import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

//= ==third party plugins=======
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-root-toast';
import { Box, HStack } from 'native-base';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import { StackActions } from '@react-navigation/native';
import { Text } from 'react-native-elements';
import { logger } from 'react-native-logs';
import Spinner from 'react-native-loading-spinner-overlay';

//= ==custom components & containers  =======
import { Content, Container, PasswordInput } from '@components';
import { BackHeader } from '@containers';
//= ======selectors==========================
import { userSelector } from '@modules/auth/selectors';
//= ======reducer actions====================
import { signUpByPhone } from '@modules/auth/slice';
//= ==========apis=======================

//= =============utils==================================
import * as globals from '@utils/global';

//= =============styles==================================
import { Colors } from '@theme';
import { FullButtonElement, InputElement } from '@src/common/StyledComponents';
// import { StyleSheetFactory } from './styles';

import { styles } from './styles';

const log = logger.createLogger();
// AssetType
//= =============images & constants ===============================
//= ============import end ====================

export const FormItem = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const SignUpPanel = ({ onCallSignUp }) => {
  const { t, i18n } = useTranslation();
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confPassInputRef = useRef(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,

    reset,
  } = useForm();

  return (
    <>
      <FormItem>
        <Text style={styles.itemTitle}>{t('auth:signUp:user name')}</Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, onFocus, value } }) => (
            <InputElement
              placeholder={t('auth:signUp:name guide')}
              onChangeText={onChange}
              value={value}
              returnKeyType="next"
              keyboardType="default"
              errorMessage={errors?.name?.message}
              containerStyle={styles.formInputContainer}
              onSubmitEditing={() => {
                emailInputRef?.current?.focus();
              }}
            />
          )}
          name="name"
          rules={{ required: t('auth:Name is required') }}
          defaultValue=""
        />
      </FormItem>
      <FormItem>
        <Text style={styles.itemTitle}>{t('auth:signUp:email')}</Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, onFocus, value } }) => (
            <InputElement
              ref={emailInputRef}
              placeholder={t('auth:signUp:Please enter your email address')}
              onChangeText={onChange}
              value={value}
              returnKeyType="next"
              keyboardType="email-address"
              errorMessage={errors?.email?.message}
              containerStyle={styles.formInputContainer}
              onSubmitEditing={() => {
                passwordInputRef?.current?.focus();
              }}
            />
          )}
          name="email"
          rules={{
            pattern: {
              value: globals.emailValidPattern,
              message: t('auth:Email is required'),
            },
            required: t('auth:Confirm Password is required'),
          }}
          defaultValue=""
        />
      </FormItem>
      <FormItem>
        <Text style={styles.itemTitle}>{t('auth:signUp:password')}</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, onFocus, value } }) => (
            <PasswordInput
              ref={passwordInputRef}
              placeholder={t('auth:signUp:Set your login password')}
              onChangeText={onChange}
              value={value}
              returnKeyType="next"
              keyboardType="default"
              errorMessage={errors?.password?.message}
              containerStyle={styles.formInputContainer}
              onSubmitEditing={() => {
                confPassInputRef?.current?.focus();
              }}
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
          defaultValue=""
        />
      </FormItem>
      <FormItem>
        <Text style={styles.itemTitle}>{t('auth:signUp:confirm password')}</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, onFocus, value } }) => (
            <PasswordInput
              ref={confPassInputRef}
              placeholder={t('auth:signUp:Please enter your password again')}
              onChangeText={onChange}
              value={value}
              returnKeyType="done"
              keyboardType="default"
              errorMessage={errors?.confirmPass?.message}
              containerStyle={styles.formInputContainer}
            />
          )}
          name="confirmPass"
          rules={{
            required: t('auth:Confirm Password is required'),
            validate: value => {
              const validate = value === getValues('password');
              if (validate) {
                return null;
              } else {
                return t('auth:Password is not confirmed');
              }
            },
          }}
          defaultValue=""
        />
      </FormItem>
      <Box width="100%" my={3}>
        <FullButtonElement title={t('auth:signUp:submit')} onPress={handleSubmit(onCallSignUp)} />
      </Box>
    </>
  );
};
SignUpPanel.propTypes = {
  onCallSignUp: PropTypes.func,
};
SignUpPanel.defaultProps = {
  onCallSignUp: () => {},
};
const SuccessPanel = ({ onCallReturnHome, user }) => {
  const { t, i18n } = useTranslation();
  return (
    <>
      <Box marginY={3}>
        <Text style={styles.successTitle}>{t('auth:signUp:success note')}</Text>
      </Box>

      <Box width="100%" marginY={3}>
        <HStack justifyContent="center" alignItems="center">
          <Text style={styles.itemTitle}>{t('auth:signUp:user name')}: </Text>
          <Text style={styles.itemInfo}>{user?.name}</Text>
        </HStack>
        <HStack justifyContent="center" alignItems="center">
          <Text style={styles.itemTitle}>{t('auth:signUp:email')}: </Text>
          <Text style={styles.itemInfo}>{user?.email}</Text>
        </HStack>
        <HStack justifyContent="center" alignItems="center">
          <Text style={styles.itemTitle}>{t('auth:signUp:Bind phone')}: </Text>
          <Text style={styles.itemInfo}>{user?.phone}</Text>
        </HStack>
      </Box>

      <Box width="100%" marginY={3}>
        <FullButtonElement title={t('auth:signUp:Back to Homepage')} onPress={onCallReturnHome} />
      </Box>
    </>
  );
};
SuccessPanel.propTypes = {
  onCallReturnHome: PropTypes.func,
  user: PropTypes.objectOf(PropTypes.any),
};
SuccessPanel.defaultProps = {
  onCallReturnHome: () => {},
  user: {},
};

const SignUp = ({ navigation, route }) => {
  //= ========Hook Init===========
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const user = useSelector(state => userSelector(state));
  //= ========= Props Section========
  //= ======== State Section========

  const [isPending, setIsPending] = useState(false);
  const [isRegisted, setIsRegisted] = useState(false);
  //= =======use ref=========================

  const onCallSignUp = data => {
    const { name, email, password } = data;
    const { phone, countryCode } = route.params;
    setIsPending(true);

    dispatch(
      signUpByPhone({
        phone,
        countryCode,
        name,
        email,
        password,
        successCB: onSuccessSignUp,
        failureCB: onFailureSignUp,
      }),
    );
  };
  const onSuccessSignUp = () => {
    setIsRegisted(true);
    setIsPending(false);
  };
  const onFailureSignUp = () => {
    setIsPending(false);
    Toast.show(t('auth:signUp:signUpFail'), {
      duration: Toast.durations.SHORT,
      position: Toast.positions.CENTER,
      backgroundColor: Colors.toastColor,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  };
  const onCallReturnHome = () => {
    navigation.dispatch(StackActions.replace('Main'));
  };
  return (
    <Container>
      <BackHeader
        title={
          isRegisted
            ? t('auth:signUp:registration success')
            : t('auth:signUp:fill in account information')
        }
        disabled={isRegisted}
        isStatusBarHidden={true}
        containerStyle={{ backgroundColor: Colors.red }}
      />
      <Content
        contentContainerStyle={styles.contentContainerStyle}
        padder
        style={styles.contentView}>
        <Box width="100%" alignItems="center" justifyContent="center">
          {isRegisted ? (
            <SuccessPanel onCallReturnHome={onCallReturnHome} user={user} />
          ) : (
            <SignUpPanel onCallSignUp={onCallSignUp} />
          )}
        </Box>
      </Content>
      <Spinner visible={isPending} textContent="One moment..." textStyle={{ color: '#fff' }} />
    </Container>
  );
};

export default SignUp;
