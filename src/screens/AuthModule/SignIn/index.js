import React, { useState, useEffect, useRef } from 'react';
import { StatusBar, Pressable } from 'react-native';

//= ==third party plugins=======
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { logger } from 'react-native-logs';
import { Box, HStack, Center } from 'native-base';

import WeChatSdkManager, { AuthResponse } from 'react-native-wechat-sdk-lib';
// import { StackActions } from '@react-navigation/native';
import { Text } from 'react-native-elements';

import Spinner from 'react-native-loading-spinner-overlay';

import { SvgXml } from 'react-native-svg';
import Toast from 'react-native-root-toast';

//= ==custom components & containers  =======
import { Content, Container, ErrorView, PasswordInput } from '@components';

//= ======selectors==========================

//= ======reducer actions====================
import { signInByPhone } from '@modules/auth/slice';
//
//= ==========apis=======================

//= =============utils==================================
import * as constants from '@utils/constant';

//= =============styles==================================
import { Colors } from '@theme';
import {
  PhoneInputElement,
  TextButtonElement,
  FullButtonElement,
} from '@src/common/StyledComponents';
// import { StyleSheetFactory } from './styles';
import loginLogoSVG from '@assets/svgs/login_logo.svg';
import alibabaSVG from '@assets/svgs/alibaba.svg';
import * as globals from '@utils/global';
import { useIsMountedRef, useComponentSize } from '@common/usehook';

import wechatSVG from '@assets/svgs/wechat.svg';

import { styles } from './styles';

const log = logger.createLogger();
// AssetType
//= =============images & constants ===============================
//= ============import end ====================

const SignIn = ({ navigation, route }) => {
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
  // const styles = StyleSheetFactory({ theme });
  //= ========= Props Section========
  const isMountedRef = useIsMountedRef();
  const phoneInput = useRef(null);
  const passwordInput = useRef(null);
  //= ======== State Section========
  const [isPending, setIsPending] = useState(false);
  //= ========= GraphQl query Section========
  const onCallSignIn = data => {
    const { phone, password } = data;

    setIsPending(true);
    const callingCode = phoneInput.current?.getCallingCode();

    dispatch(
      signInByPhone({
        phone: `+${callingCode}${phone}`,
        password,
        successCB: onSuccessSignIn,
        failureCB: onFailureSignIn,
      }),
    );
  };
  const onSuccessSignIn = () => {
    isMountedRef.current && setIsPending(false);
  };
  const onFailureSignIn = () => {
    setIsPending(false);
    Toast.show(t('auth:signIn:signInFail'), {
      duration: Toast.durations.SHORT,
      position: Toast.positions.CENTER,
      backgroundColor: Colors.toastColor,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  };
  const onCallWeChatLogin = async () => {
    try {
      const s = await WeChatSdkManager.instance().sendAuthRequest('snsapi_userinfo');
      console.log(`sendAuthRequest:${JSON.stringify(s)}`);
    } catch (error) {
      log.error('onCallWeChatLogin error', error);
    }
  };

  //= ========= Use Effect Section========
  useEffect(() => {
    const registWeChat = async () => {
      const isInit = await WeChatSdkManager.instance().init(constants.WECHAT_APPID);
      // console.log(isInit ? '初始化成功' : '初始化失败');

      const registerApp = await WeChatSdkManager.instance().registerApp(
        constants.WECHAT_APPID,
        'https://renmei.jiyunkeji.com.cn/app/',
      );
      // console.log(registerApp ? 'registerApp成功' : 'registerApp失败');

      const isWeChatInstall = await WeChatSdkManager.instance().isWXAppInstalled();
      // console.log(isWeChatInstall ? '已安装微信' : '未安装微信');

      WeChatSdkManager.instance().addListener('onSendAuthResponse', (info: AuthResponse) => {
        // console.log(`onSendAuthResponse:   ${JSON.stringify(info)}`);
      });
    };
    registWeChat();

    return () => {
      WeChatSdkManager.instance().destroy();
    };
  }, []);
  return (
    <Container>
      <StatusBar hidden />
      <Content
        contentContainerStyle={styles.contentContainerStyle}
        padder
        style={styles.contentView}>
        <Center width="100%" flexGrow={1}>
          <SvgXml width={100} height={100} xml={loginLogoSVG} />
        </Center>

        <Center width="100%" flexGrow={1}>
          <Center width="100%" marginY={3}>
            <Text style={styles.titleTxt}>
              {t('auth:signIn:Log in with your phone number and password')}
            </Text>
          </Center>
          <>
            <Controller
              render={({ field: { onChange, onBlur, onFocus, value } }) => (
                <PhoneInputElement
                  ref={phoneInput}
                  defaultValue={value}
                  placeholder={t('phone:Please enter the phone number')}
                  defaultCode="CN"
                  // onChangeFormattedText={onChange}
                  onChangeText={onChange}
                  withShadow
                />
              )}
              control={control}
              rules={{
                required: t('phone:Phone Number is required'),
                validate: value => {
                  const validate = phoneInput.current?.isValidNumber(
                    phoneInput.current?.getCallingCode() + value,
                  );
                  if (validate) {
                    return null;
                  } else {
                    return t('phone:The Phone Number is incorrect!');
                  }
                },
              }}
              name="phone"
              defaultValue="17642502762"
            />
            <ErrorView error={errors?.phone?.message || ''} />
          </>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, onFocus, value } }) => (
              <PasswordInput
                ref={passwordInput}
                placeholder={t('auth:Please enter the password')}
                placeholderTextColor={Colors.placeholderColor}
                onChangeText={onChange}
                value={value}
                returnKeyType="done"
                keyboardType="default"
                errorMessage={errors?.password?.message}
              />
            )}
            name="password"
            rules={{
              required: t('auth:Password is required'),
              validate: value => {
                const inValidate = globals.inValidatePassword(value);
                if (!inValidate) {
                  return null;
                } else {
                  return inValidate;
                }
              },
            }}
            defaultValue="Rgs213515$"
          />
          <HStack width="100%" justifyContent="space-between" alignContent="center" marginY={2}>
            <TextButtonElement title={t('auth:forget password ?')} />
            <TextButtonElement
              title={t('auth:registered')}
              onPress={() => {
                navigation.navigate('PhoneVerify');
              }}
            />
          </HStack>
          <FullButtonElement title={t('auth:Sign In')} onPress={handleSubmit(onCallSignIn)} />
        </Center>

        <Box paddingX={4} marginY={3}>
          <Box marginY={3}>
            <Text style={styles.socialTxt}>
              {t('auth:signIn:Or use the following method to log in')}
            </Text>
          </Box>
          <HStack justifyContent="center" alignContent="center">
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                  marginRight: 10,
                  padding: 5,
                },
              ]}
              onPress={() => {
                console.log('Alibaba');
              }}>
              <SvgXml width={43} height={43} xml={alibabaSVG} style={{ alignSelf: 'center' }} />
              <Text style={styles.socialIconTxt}>{t('normal:Alibaba')}</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                  marginLeft: 10,
                  padding: 5,
                },
              ]}
              onPress={onCallWeChatLogin}>
              <SvgXml width={43} height={43} xml={wechatSVG} style={{ alignSelf: 'center' }} />
              <Text style={styles.socialIconTxt}>{t('normal:Wechat')}</Text>
            </Pressable>
          </HStack>
        </Box>

        <Spinner visible={isPending} textContent="One moment..." textStyle={{ color: '#fff' }} />
      </Content>
    </Container>
  );
};

export default SignIn;
