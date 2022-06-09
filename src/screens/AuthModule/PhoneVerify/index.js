import React, { useState, useRef } from 'react';
import { Keyboard, Pressable } from 'react-native';

//= ==third party plugins=======
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import Toast from 'react-native-root-toast';
import { Box } from 'native-base';

import { Text } from 'react-native-elements';

import Spinner from 'react-native-loading-spinner-overlay';

//= ==custom components & containers  =======
import { Content, Container, ErrorView } from '@components';
import { BackHeader } from '@containers';
//= ======selectors==========================

//= ======reducer actions====================

//= ==========apis=======================
import {
  SEND_VERIFICATION_CODE_2PHONE,
  CHECK_PHONE_VERIFICATION_CODE,
} from '@modules/auth/graphql';
//= =============utils==================================

//= =============styles==================================
import { Colors } from '@theme';
import {
  PhoneInputElement,
  FullButtonElement,
  InputElement,
  GuideText,
} from '@src/common/StyledComponents';
// import { StyleSheetFactory } from './styles';

import { styles } from './styles';
// AssetType
//= =============images & constants ===============================
//= ============import end ====================

const PhoneVerify = ({ navigation, route }) => {
  //= ========Hook Init===========
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm();
  //= ========= Props Section========
  //= =======use ref=========================

  const phoneInput = useRef(null);
  const phone = useRef(null);
  const countryCode = useRef(null);
  //= ======== State Section========
  const [isCalledVerifyCode, setIsCalledVerifyCode] = useState(false);
  const [verifyRequestId, setVerifyRequestId] = useState(null);

  const [phoneNumber, setPhoneNumber] = useState('17642502762');
  const [verifyCode, setVerifyCode] = useState(null);

  const [phoneError, setPhoneError] = useState(null);
  const [verifyCodeError, setVerifyCodeError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  //= ========Query===============
  const [sendVerifyCode2Phone] = useMutation(SEND_VERIFICATION_CODE_2PHONE);
  const [checkPhoneVerifyCode] = useMutation(CHECK_PHONE_VERIFICATION_CODE);

  const onCallPhoneVerifyCode = async () => {
    Keyboard.dismiss();

    setPhoneError(null);
    setVerifyCodeError(null);
    setVerifyCode(null);
    if (phoneNumber === null) {
      setPhoneError(t('phone:Phone Number is required'));
      return;
    }
    if (!phoneInput.current?.isValidNumber(phoneNumber)) {
      setPhoneError(t('phone:The Phone Number is incorrect!'));
      return;
    }

    const countryCodeVal = phoneInput.current?.getCountryCode();
    const callingCode = phoneInput.current?.getCallingCode();

    try {
      setIsPending(true);
      const {
        data: {
          sendVerificationCode2Phone: { id },
        },
      } = await sendVerifyCode2Phone({
        variables: { phone: `+${callingCode}${phoneNumber}`, countryCode: countryCodeVal },
      });
      setVerifyRequestId(id);
      countryCode.current = countryCodeVal;
      phone.current = `+${callingCode}${phoneNumber}`;

      setIsPending(false);
      setIsCalledVerifyCode(true);
    } catch (e) {
      setIsPending(false);
      console.log('sendVerifyCode2Phone error: ', e.message);
    }
  };
  const onCallCheckPhoneVerifyCode = async () => {
    Keyboard.dismiss();
    if (verifyCode === null) {
      setVerifyCodeError(t('phone:Enter Received Verify Code'));
      return;
    }
    try {
      setIsPending(true);
      const {
        data: {
          checkPhoneVerificationCode: { result, message },
        },
      } = await checkPhoneVerifyCode({
        variables: { request_id: verifyRequestId, code: verifyCode },
      });
      if (!result) {
        setVerifyCodeError(message);
      } else {
        setVerifyCodeError(null);
        setTimeout(() => {
          navigation.navigate('SignUp', {
            phone: phone.current,
            countryCode: countryCode.current,
          });
        }, 300);
      }
      setVerifyCode(null);
      setIsPending(false);
    } catch (e) {
      setIsPending(false);
      Toast.show(
        `${t('phone:Incorrect verification code')}\n${t('phone:Please get verification again')}`,
        {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
          backgroundColor: Colors.toastColor,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        },
      );
      console.log('sendVerifyCode2Phone error: ', e.message);
    }
  };
  return (
    <Container>
      <BackHeader
        title={t('auth:phoneVerify:Bind mobile phone number')}
        isStatusBarHidden={true}
        containerStyle={{ backgroundColor: Colors.white }}
      />
      <Content
        contentContainerStyle={styles.contentContainerStyle}
        padder
        style={styles.contentView}>
        <Box width="100%" alignItems="center" justifyContent="center">
          <PhoneInputElement
            ref={phoneInput}
            defaultValue={phoneNumber}
            placeholder={t('phone:Please enter the phone number')}
            defaultCode="CN"
            onChangeFormattedText={setPhoneNumber}
            withShadow
          />
          <ErrorView error={phoneError || ''} />
          <InputElement
            placeholder={t('phone:Please enter verification code')}
            placeholderTextColor={Colors.placeholderColor}
            onChangeText={setVerifyCode}
            value={verifyCode}
            returnKeyType="next"
            keyboardType="number-pad"
            errorMessage={verifyCodeError}
            rightIcon={
              <Pressable
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                    marginLeft: 10,
                  },
                ]}
                onPress={onCallPhoneVerifyCode}>
                <Text style={styles.callVerifyCodeTxt}>
                  {isCalledVerifyCode
                    ? t('phone:get verification code')
                    : t('phone:Re-acquire verification code')}
                </Text>
              </Pressable>
            }
          />
          <Box width="100%" marginY={3}>
            <FullButtonElement
              disabled={!isCalledVerifyCode}
              title={t('auth:phoneVerify:Agree to the agreement and register')}
              onPress={onCallCheckPhoneVerifyCode}
            />
          </Box>

          <Box width="100%" marginY={3}>
            <GuideText>{t('auth:phoneVerify:guide')}</GuideText>
          </Box>
        </Box>
      </Content>
      <Spinner visible={isPending} textContent="One moment..." textStyle={{ color: '#fff' }} />
    </Container>
  );
};

export default PhoneVerify;
