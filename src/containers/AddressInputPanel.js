import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, StatusBar, Platform, Keyboard } from 'react-native';
import { Colors, Fonts } from '@theme';
import { CheckBox, Input, Button } from 'react-native-elements';
import { wp, hp, adjustFontSize } from '@src/common/responsive';
import { FocusAwareStatusBar, NormalHeaderContainer, ErrorView } from '@components';
import styled from 'styled-components/native';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useRegion } from '@data/useUser';
import { useNavigation, useRoute } from '@react-navigation/native';
import ModalSelector from 'react-native-modal-selector';
import { Box, HStack } from 'native-base';
import * as constants from '@utils/constant';

const IconSize = 25;
const userCountry = { id: 'CN', name: 'China' };
const RegionInput = ({ value = null, data = [], onSelectRegion = () => {} }) => {
  const { t, i18n } = useTranslation();
  return (
    <ModalSelector
      data={data}
      onChange={onSelectRegion}
      disabled={data.length === 0}
      style={{ width: '100%' }}
      keyExtractor={item => item.id}
      labelExtractor={item => item.name}>
      <Button
        title={value || t('address:province')}
        buttonStyle={{
          borderColor: Colors.inputBorderColor,
          borderWidth: 1,
          justifyContent: 'space-between',
        }}
        titleStyle={{
          ...Fonts.input,
          color: Colors.inputFontColor,
        }}
        icon={{
          name: 'chevron-down-sharp',
          type: 'ionicon',
          size: hp(20),
          color: Colors.inputFontColor,
        }}
        iconRight={true}
        type="outline"
      />
    </ModalSelector>
  );
};
const AddressInputPanel = ({
  onSaveAddress,
  onDeleteAddress,
  address,
  isEditAction,
  isShippingAddress,
}) => {
  const regions = useRegion();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const [isApplyAsDeliveryAddress, setIsApplyAsDeliveryAddress] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
    getValues,
    setValue,
    reset,
  } = useForm();
  useEffect(() => {
    if (address) {
      setValue('label', address?.label);
      setValue('region', address?.region);
      setValue('city', address?.city);
      setValue('street', address?.street);
      setValue('description', address?.description);
      setValue('zipCode', address?.zipCode);
    }
    return () => {};
  }, [address]);
  const onSelectRegion = async activeRegion => {
    setValue('region', activeRegion);
  };
  const onSubmit = async data => {
    Keyboard.dismiss();
    try {
      const { city, description, label, region: regionData, zipCode, street } = data;
      const updateData = {
        city,
        description,
        label,
        region: regionData.id,
        zipCode,
        street,
        country: constants.USER_COUNTRY.id,
      };
      if (isEditAction) {
        updateData.id = address.id;
        updateData.addressId = address.addressId;
      }
      updateData.isApplyAsDeliveryAddress = isApplyAsDeliveryAddress;
      onSaveAddress(updateData);
    } catch (error) {}
  };
  //= ======== State Section========
  return (
    <>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, onFocus, value } }) => (
          <InputElement
            placeholder={t('address:Receiver')}
            onChangeText={onChange}
            value={value}
            returnKeyType="next"
            errorMessage={errors?.label?.message}
          />
        )}
        name="label"
        rules={
          {
            // required: t('auth:Password is required'),
          }
        }
        defaultValue={null}
      />

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, onFocus, value } }) => (
          <RegionInput data={regions} value={value?.name || null} onSelectRegion={onSelectRegion} />
        )}
        name="region"
        rules={{
          required: t('auth:Password is required'),
        }}
        defaultValue={null}
      />
      <ErrorView error={errors?.region?.message || ''} />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, onFocus, value } }) => (
          <InputElement
            placeholder={t('address:city')}
            onChangeText={onChange}
            value={value}
            returnKeyType="next"
            errorMessage={errors?.city?.message}
          />
        )}
        name="city"
        rules={
          {
            //  required: t('auth:Password is required'),
          }
        }
        defaultValue={null}
      />

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, onFocus, value } }) => (
          <InputElement
            placeholder={t('address:Address1')}
            onChangeText={onChange}
            value={value}
            returnKeyType="next"
            errorMessage={errors?.street?.message}
          />
        )}
        name="street"
        rules={
          {
            //    required: t('auth:Password is required'),
          }
        }
        defaultValue={null}
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, onFocus, value } }) => (
          <InputElement
            placeholder={t('address:Address2')}
            onChangeText={onChange}
            value={value}
            returnKeyType="next"
            errorMessage={errors?.description?.message}
          />
        )}
        name="description"
        rules={
          {
            //     required: t('auth:Password is required'),
          }
        }
        defaultValue={null}
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, onFocus, value } }) => (
          <InputElement
            placeholder={t('address:Postal code')}
            onChangeText={onChange}
            value={value}
            returnKeyType="next"
            errorMessage={errors?.zipCode?.message}
          />
        )}
        name="zipCode"
        rules={
          {
            //    required: t('auth:Password is required'),
          }
        }
        defaultValue={null}
      />

      {isShippingAddress ? (
        <CheckBox
          checked={isApplyAsDeliveryAddress}
          title="新增此地址作为我的账单地址"
          onPress={() => {
            setIsApplyAsDeliveryAddress(prev => !prev);
          }}
          textStyle={styles.checkBoxTitle}
        />
      ) : null}

      <HStack justifyContent="center">
        {isEditAction ? (
          <Button
            onPress={() => {
              onDeleteAddress(address.id);
            }}
            buttonStyle={styles.deleteButton}
            titleStyle={styles.deleteButtonTitle}
            title={t('common:delete')}
          />
        ) : null}
        <Button
          onPress={handleSubmit(onSubmit)}
          buttonStyle={styles.saveButton}
          titleStyle={styles.saveButtonTitle}
          title={t('common:save')}
        />
      </HStack>
    </>
  );
};
AddressInputPanel.propTypes = {
  onSaveAddress: PropTypes.func,
  onDeleteAddress: PropTypes.func,
  address: PropTypes.shape({}),
  isEditAction: PropTypes.bool,
  isShippingAddress: PropTypes.bool,
};
AddressInputPanel.defaultProps = {
  onSaveAddress: () => {},
  onDeleteAddress: () => {},
  address: {},
  isEditAction: false,
  isShippingAddress: false,
};
export default React.memo(AddressInputPanel);

const styles = StyleSheet.create({
  titleStyle: {
    ...Fonts.title,
    color: Colors.black,
    fontWeight: '400',
  },
  deleteButton: {
    backgroundColor: Colors.grey5,
    width: wp(90),
    height: hp(36),
    borderRadius: 10,
    marginRight: 10,
  },
  deleteButtonTitle: {
    fontFamily: 'Microsoft YaHei',
    color: Colors.grey2,
    fontSize: adjustFontSize(13),
    lineHeight: adjustFontSize(17),
  },
  saveButton: {
    marginLeft: 10,
    backgroundColor: Colors.signUpStepRed,
    width: wp(90),
    height: hp(36),
    borderRadius: 10,
  },
  saveButtonTitle: {
    fontFamily: 'Microsoft YaHei',
    color: Colors.white,
    fontSize: adjustFontSize(13),
    lineHeight: adjustFontSize(17),
  },
  checkBoxTitle: {
    fontFamily: 'Microsoft YaHei',
    color: Colors.grey2,
    fontSize: adjustFontSize(11),
    lineHeight: adjustFontSize(20),
  },
});
const InputElement = styled(Input).attrs({
  inputContainerStyle: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 5,
    height: hp(40),
  },
  containerStyle: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  errorStyle: {
    color: Colors.red,
  },
})``;
