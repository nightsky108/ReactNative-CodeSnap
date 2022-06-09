import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, StatusBar, Platform, Keyboard } from 'react-native';
import { Colors, Fonts } from '@theme';

import { Header, Input, Button, Icon, CheckBox } from 'react-native-elements';
import { wp, hp, adjustFontSize } from '@src/common/responsive';
import { FocusAwareStatusBar, NormalHeaderContainer, ErrorView } from '@components';
import styled from 'styled-components/native';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useRegion } from '@data/useUser';
import { useNavigation, useRoute } from '@react-navigation/native';
import ModalSelector from 'react-native-modal-selector';
import { Box, HStack, Pressable, Text } from 'native-base';
import * as constants from '@utils/constant';
import { TouchableOpacity } from 'react-native-gesture-handler';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import * as globals from '@utils/global';
import _ from 'lodash';

const CourierInfoSection = ({ carriers = [], courierInfo = {}, onSaveCourierInfo = () => {} }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
    getValues,
    setValue,
    reset,
  } = useForm();

  const [isManageShipBox, setIsManageShipBox] = useState(false);

  const [useCustomeCarrier, setUseCustomeCarrier] = useState(!!courierInfo?.customCarrier);
  const watchMarketTypes = useWatch({
    control,
    name: 'workInMarketTypesData',
    defaultValue: [], // default value before the render
  });
  useEffect(() => {
    const { carriers: courierCarriers, customCarrier, workInMarketTypes } = courierInfo;
    setValue('workInMarketTypesData', workInMarketTypes);
    setValue('carriersData', courierCarriers);
    setValue('customCarrier', customCarrier?.name);
    setUseCustomeCarrier(!!courierInfo?.customCarrier);
    return () => {};
  }, [courierInfo, setValue]);

  const toggleUseCustomeCarrier = () => {
    setUseCustomeCarrier(old => !old);
  };
  const saveCarriers = data => {
    const { carriersData, customCarrier, workInMarketTypesData } = data;
    const newCourierInfo = {
      carriers: carriersData,
      workInMarketTypes: workInMarketTypesData,
    };
    if (useCustomeCarrier) {
      newCourierInfo.customCarrier = customCarrier;
    }
    onSaveCourierInfo(newCourierInfo);
  };

  //= ======== State Section========
  return (
    <>
      <Box width="100%">
        <Text
          color={Colors.grey1}
          fontFamily="Microsoft YaHei"
          fontWeight="400"
          lineHeight="15px"
          fontSize="11px">
          请输入偏好的付运公司。若要售卖商品，此项必须填写。
        </Text>
        <Text
          my="10px"
          color={Colors.grey1}
          fontFamily="Microsoft YaHei"
          fontWeight="400"
          lineHeight="15px"
          fontSize="11px">
          提示：选好付运公司后，平台系统会于每件商品出售后自动生成发票与邮寄标签。你可以打印邮寄标签并附于商品，到附近邮局寄出。
        </Text>
      </Box>
      <Box width="100%" my="5px">
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, onFocus, value } }) => (
            <>
              <CheckBox
                containerStyle={{ justifyContent: 'space-around' }}
                textStyle={{ flex: 1 }}
                title="商品只适用于本地买家"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                iconRight={true}
                onPress={() => {
                  setValue('workInMarketTypesData', constants.MarketTypeEnum.DOMESTIC);
                }}
                checked={_.isEqual(value, constants.MarketTypeEnum.DOMESTIC)}
              />
              <CheckBox
                containerStyle={{ justifyContent: 'space-around' }}
                textStyle={{ flex: 1 }}
                title="商品只适用于海外买家"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                iconRight
                onPress={() => {
                  setValue('workInMarketTypesData', constants.MarketTypeEnum.INTERNATIONAL);
                }}
                checked={_.isEqual(value, constants.MarketTypeEnum.INTERNATIONAL)}
              />
              <CheckBox
                title="商品适用于本地与海外买家"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                iconRight
                containerStyle={{ justifyContent: 'space-around' }}
                textStyle={{ flex: 1 }}
                onPress={() => {
                  setValue('workInMarketTypesData', constants.MarketTypeEnum.BOTH);
                }}
                checked={_.isEqual(value, constants.MarketTypeEnum.BOTH)}
              />
            </>
          )}
          name="workInMarketTypesData"
          rules={{
            validate: value => {
              if (value?.length > 0) {
                return null;
              } else {
                return 'Please select Type';
              }
            },
          }}
          defaultValue={[]}
        />
        <ErrorView error={errors?.workInMarketTypesData?.message || ''} />
      </Box>
      <Divider />
      <Box my="10px" mx="10px">
        {watchMarketTypes?.length > 0 ? (
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, onFocus, value } }) => (
              <SectionedMultiSelect
                IconRenderer={Icon}
                items={carriers}
                uniqueKey="id"
                displayKey="name"
                selectText={
                  _.isEqual(getValues('workInMarketTypesData'), constants.MarketTypeEnum.DOMESTIC)
                    ? '商品只适用于本地买家'
                    : _.isEqual(
                        getValues('workInMarketTypesData'),
                        constants.MarketTypeEnum.INTERNATIONAL,
                      )
                    ? '商品只适用于海外买家'
                    : '商品适用于本地与海外买家'
                }
                alwaysShowSelectText={true}
                hideSearch={true}
                showDropDowns={true}
                onSelectedItemsChange={val => {
                  console.log('val', val);
                  setValue('carriersData', val);
                }}
                selectedItems={value}
                styles={{
                  chipContainer: {
                    borderWidth: 2,
                    borderRadius: 5,
                  },
                  selectToggle: {
                    borderRadius: 3,
                    borderWidth: 1,
                    paddingVertical: 10,
                    borderColor: Colors.grey3,
                    marginBottom: 5,
                  },
                }}
              />
            )}
            name="carriersData"
            rules={{
              validate: value => {
                if (value.length > 0) {
                  return null;
                } else {
                  return 'Please select Type';
                }
              },
            }}
            defaultValue={[]}
          />
        ) : null}
        <ErrorView error={errors?.carriersData?.message || ''} />
      </Box>
      <Box width="100%" my="10px">
        <CheckBox
          title="其他付运公司"
          onPress={toggleUseCustomeCarrier}
          checked={useCustomeCarrier}
        />

        {useCustomeCarrier ? (
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, onFocus, value } }) => (
              <InputElement
                placeholder="自定义运营商名称"
                onChangeText={onChange}
                value={value}
                returnKeyType="done"
                errorMessage={errors?.customCarrier?.message}
              />
            )}
            name="customCarrier"
            rules={{
              required: 'Please set custom carriers',
            }}
            defaultValue={null}
          />
        ) : null}
      </Box>
      <HStack justifyContent="center">
        <Button
          onPress={() => {}}
          buttonStyle={styles.deleteButton}
          titleStyle={styles.deleteButtonTitle}
          title="取消"
        />
        <Button
          onPress={handleSubmit(saveCarriers)}
          buttonStyle={styles.saveButton}
          titleStyle={styles.saveButtonTitle}
          title="保存"
        />
      </HStack>
    </>
  );
};
CourierInfoSection.propTypes = {
  onSaveCourierInfo: PropTypes.func,
  carriers: PropTypes.arrayOf(PropTypes.object),
  courierInfo: PropTypes.shape({}),
};
CourierInfoSection.defaultProps = {
  onSaveCourierInfo: () => {},
  carriers: [],
  courierInfo: {},
};
export default React.memo(CourierInfoSection);

const styles = StyleSheet.create({
  titleStyle: {
    ...Fonts.title,
    color: Colors.black,
    fontWeight: '400',
  },
  deleteButton: {
    backgroundColor: Colors.grey5,
    width: wp(150),
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
    width: wp(150),
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
    marginHorizontal: 10,
  },
  containerStyle: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  errorStyle: {
    color: Colors.red,
  },
})``;
const Divider = styled.View`
  background-color: ${Colors.grey4};
  height: 0.7px;
  width: 100%;
`;
