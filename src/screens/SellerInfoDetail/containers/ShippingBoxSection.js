import React, { useEffect, useState, useContext, useRef, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, StatusBar, Platform, Keyboard, View } from 'react-native';
import { Colors, Fonts } from '@theme';
import { Header, Input, Button, Icon, CheckBox } from 'react-native-elements';
import { wp, hp, adjustFontSize } from '@src/common/responsive';
import { FocusAwareStatusBar, NormalHeaderContainer, ErrorView } from '@components';
import styled from 'styled-components/native';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useRegion } from '@data/useUser';
import { useNavigation, useRoute } from '@react-navigation/native';
import ModalSelector from 'react-native-modal-selector';
import { Box, HStack, Pressable, Text } from 'native-base';
import * as constants from '@utils/constant';
import { TouchableOpacity, FlatList, ScrollView } from 'react-native-gesture-handler';
import { useShippingBoxes } from '@data/useAssets';

import { ShippingBoxUnitContext } from '../index';

const IconSize = 25;
const userCountry = { id: 'CN', name: 'China' };
function ShippingBox({ item, onRemoveShippingBox }) {
  const { id, label, width, height, length } = item;
  return (
    <Box borderTopWidth="1px" borderTopColor={Colors.grey5}>
      <Box flexDirection="row" marginTop="10px">
        <Box>
          <Text color={Colors.black} fontFamily="Microsoft YaHei" lineHeight="20px" fontSize="15px">
            {label}
          </Text>
          <Text
            color={Colors.black}
            fontFamily="Microsoft YaHei"
            lineHeight="18px"
            fontSize="13px">{`${width} x ${height} x ${length} 寸`}</Text>
        </Box>
      </Box>
      <HStack justifyContent="flex-end" width="100%" py="12px">
        <Pressable
          onPress={() => {
            onRemoveShippingBox(id);
          }}>
          {({ isHovered, isFocused, isPressed }) => {
            return (
              <HStack
                alignItems="center"
                bg={isPressed ? 'primary.100' : isHovered ? 'primary.50' : Colors.white}
                borderColor={Colors.grey3}
                borderWidth="1px"
                borderRadius="15px"
                px="10px"
                py="3px"
                style={{
                  transform: [
                    {
                      scale: isPressed ? 0.96 : 1,
                    },
                  ],
                }}>
                <Icon type="entypo" name="trash" size={15} color={Colors.grey2} />
                <Text
                  color={Colors.black}
                  fontFamily="Microsoft YaHei"
                  fontWeight="400"
                  fontSize="11px">
                  删除
                </Text>
              </HStack>
            );
          }}
        </Pressable>
      </HStack>
    </Box>
  );
}
ShippingBox.propTypes = {
  item: PropTypes.shape({}),
  onRemoveShippingBox: PropTypes.func,
};
ShippingBox.defaultProps = {
  item: {},
  onRemoveShippingBox: () => {},
};
/* const ShippingBoxList = ({ shippingBoxList }) => {
  return <></>;
};
ShippingBoxList.propTypes = {
  shippingBoxList: PropTypes.arrayOf(PropTypes.object),
};
ShippingBoxList.defaultProps = {
  shippingBoxList: [],
}; */
const ShippingBoxForm = ({ onSaveShipBox, onAddNewShipBox, shippingBox, isAddAction }) => {
  const lengthInputRef = useRef(null);
  const widthInputRef = useRef(null);
  const heightInputRef = useRef(null);
  const weightInputRef = useRef(null);
  const [isDefault, setIsDefault] = useState(false);

  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors, dirtyFields },
    validate,
    getValues,
    setValue,
    reset,
    trigger,
  } = useForm({
    // validate: ['onSubmit', 'onBlur'], // breaking change, refactor of `mode`
    // revalidate: ['onSubmit', 'onBlur'], // as in defaults
  });

  const onSubmit = data => {
    onAddNewShipBox(data);
  };
  return (
    <>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, onFocus, value } }) => (
          <>
            <Text
              color={Colors.black}
              fontFamily="Microsoft YaHei"
              fontWeight="400"
              my="5px"
              lineHeight="15px"
              fontSize="11px">
              名称*
            </Text>
            <InputElement
              placeholder="为箱子命名（例：小型，中型， 中型，大型）"
              onChangeText={onChange}
              value={value}
              returnKeyType="next"
              errorMessage={errors?.label?.message}
              onBlur={() => {
                trigger('label');
                lengthInputRef.current?.focus();
                onBlur();
              }}
            />
          </>
        )}
        name="label"
        rules={{
          required: 'pls set label value',
        }}
        defaultValue={null}
      />

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, onFocus, value } }) => (
          <>
            <Text
              color={Colors.black}
              fontFamily="Microsoft YaHei"
              fontWeight="400"
              my="5px"
              lineHeight="15px"
              fontSize="11px">
              长度*
            </Text>
            <InputElement
              ref={lengthInputRef}
              placeholder="寸"
              onChangeText={onChange}
              onBlur={() => {
                trigger('length');
                widthInputRef.current?.focus();
                onBlur();
              }}
              value={value}
              returnKeyType="next"
              keyboardType="numeric"
              errorMessage={errors?.length?.message}
            />
          </>
        )}
        name="length"
        rules={{
          required: 'pls set length value',
        }}
        defaultValue={null}
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, onFocus, value } }) => (
          <>
            <Text
              color={Colors.black}
              fontFamily="Microsoft YaHei"
              fontWeight="400"
              my="5px"
              lineHeight="15px"
              fontSize="11px">
              宽度*
            </Text>
            <InputElement
              ref={widthInputRef}
              placeholder="寸"
              onChangeText={onChange}
              value={value}
              returnKeyType="next"
              keyboardType="numeric"
              errorMessage={errors?.width?.message}
              onBlur={() => {
                trigger('width');
                heightInputRef.current?.focus();
                onBlur();
              }}
            />
          </>
        )}
        name="width"
        rules={{
          required: 'pls set width value',
        }}
        defaultValue={null}
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, onFocus, value } }) => (
          <>
            <Text
              color={Colors.black}
              fontFamily="Microsoft YaHei"
              fontWeight="400"
              my="5px"
              lineHeight="15px"
              fontSize="11px">
              高度*
            </Text>
            <InputElement
              ref={heightInputRef}
              placeholder="寸"
              onChangeText={onChange}
              value={value}
              returnKeyType="next"
              keyboardType="numeric"
              errorMessage={errors?.height?.message}
              onBlur={() => {
                trigger('height');
                weightInputRef.current?.focus();
                onBlur();
              }}
            />
          </>
        )}
        name="height"
        rules={{
          required: 'pls set height value',
        }}
        defaultValue={null}
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, onFocus, value } }) => (
          <>
            <Text
              color={Colors.black}
              fontFamily="Microsoft YaHei"
              fontWeight="400"
              my="5px"
              lineHeight="15px"
              fontSize="11px">
              重量*
            </Text>
            <InputElement
              ref={weightInputRef}
              placeholder="寸"
              onChangeText={onChange}
              value={value}
              returnKeyType="next"
              keyboardType="numeric"
              errorMessage={errors?.weight?.message}
              onBlur={() => {
                trigger('weight');
                onBlur();
              }}
            />
          </>
        )}
        name="weight"
        rules={{
          required: 'pls set weight value',
        }}
        defaultValue={null}
      />
      {/* <CheckBox
        checked={isDefault}
        title="将此箱子设定为预设"
        onPress={() => {
          setIsDefault(prev => !prev);
        }}
        textStyle={styles.checkBoxTitle}
      /> */}

      <HStack justifyContent="center" mt="10px">
        <Button
          onPress={() => {}}
          buttonStyle={styles.deleteButton}
          titleStyle={styles.deleteButtonTitle}
          title="取消"
        />
        <Button
          onPress={handleSubmit(onSubmit)}
          buttonStyle={styles.saveButton}
          titleStyle={styles.saveButtonTitle}
          title="保存"
        />
      </HStack>
    </>
  );
};
ShippingBoxForm.propTypes = {
  onSaveShipBox: PropTypes.func,
  onAddNewShipBox: PropTypes.func,
  shippingBox: PropTypes.shape({}),
  isAddAction: PropTypes.bool,
};
ShippingBoxForm.defaultProps = {
  onSaveShipBox: () => {},
  onAddNewShipBox: () => {},
  shippingBox: {},
  isAddAction: false,
};
const ShippingBoxSection = ({
  onSaveShipBox = () => {},
  onCallUnitSwitch = () => {},
  isMetricUnit,
  activeShipBoxId = null,
}) => {
  const regions = useRegion();
  const navigation = useNavigation();
  const [isManageShipBox, setIsManageShipBox] = useState(false);
  const { shippingBoxes, addShippingBox, removeShippingBox } = useShippingBoxes();
  const keyExtractor = useCallback(item => item.id, []);
  //= ======== State Section========
  const unitType = useMemo(() => {
    return isMetricUnit ? constants.MetricUnitType : constants.BritishUnitType;
  }, [isMetricUnit]);
  const onAddNewShipBox = async data => {
    const { height, length, width, weight, label } = data;
    await addShippingBox({
      label,
      width: parseFloat(width),
      height: parseFloat(height),
      length: parseFloat(length),
      weight: parseFloat(weight),
      unit: unitType.size,
      unitWeight: unitType.weight,
    });

    try {
    } catch (error) {}
  };
  const onRemoveShippingBox = async id => {
    await removeShippingBox(id);

    try {
    } catch (error) {}
  };
  const renderShippingBoxItem = useCallback(({ item, index }) => {
    return <ShippingBox item={item} onRemoveShippingBox={onRemoveShippingBox} />;
  }, []);
  return (
    <>
      {!isManageShipBox ? (
        <HStack alignItems="center" justifyContent="space-between" width="100%" py="12px">
          <Text
            color={Colors.grey1}
            fontFamily="Microsoft YaHei"
            fontWeight="400"
            lineHeight="15px"
            fontSize="11px">
            请在下面输入自定义箱子资料
          </Text>
          <Pressable
            onPress={() => {
              setIsManageShipBox(true);
            }}>
            {({ isHovered, isFocused, isPressed }) => {
              return (
                <HStack
                  alignItems="center"
                  bg={isPressed ? 'primary.100' : isHovered ? 'primary.50' : Colors.white}
                  borderColor={Colors.grey3}
                  borderWidth="1px"
                  borderRadius="15px"
                  px="10px"
                  py="3px"
                  style={{
                    transform: [
                      {
                        scale: isPressed ? 0.96 : 1,
                      },
                    ],
                  }}>
                  <Icon type="antdesign" name="plus" size={15} color={Colors.black} />
                  <Text
                    color={Colors.black}
                    fontFamily="Microsoft YaHei"
                    fontWeight="400"
                    fontSize="11px">
                    添加箱子
                  </Text>
                </HStack>
              );
            }}
          </Pressable>
        </HStack>
      ) : (
        <HStack alignItems="center" justifyContent="space-between" width="100%" py="12px">
          <Text
            color={Colors.black}
            fontFamily="Microsoft YaHei"
            fontWeight="400"
            lineHeight="15px"
            fontSize="11px">
            添加箱子
          </Text>
          <TouchableOpacity
            onPress={() => {
              setIsManageShipBox(false);
            }}>
            <Icon type="antdesign" name="close" size={25} color={Colors.black} />
          </TouchableOpacity>
        </HStack>
      )}

      <Divider />
      <HStack justifyContent="flex-end" width="100%" py="12px">
        <Pressable onPress={onCallUnitSwitch}>
          {({ isHovered, isFocused, isPressed }) => {
            return (
              <HStack
                alignItems="center"
                bg={isPressed ? 'primary.100' : isHovered ? 'primary.50' : Colors.white}
                borderColor={Colors.grey3}
                borderWidth="1px"
                borderRadius="15px"
                px="10px"
                py="3px"
                style={{
                  transform: [
                    {
                      scale: isPressed ? 0.96 : 1,
                    },
                  ],
                }}>
                <Text
                  color={Colors.black}
                  fontFamily="Microsoft YaHei"
                  fontWeight="400"
                  fontSize="11px">
                  {isMetricUnit ? '公制：厘米，克' : '英制：寸，盎司'}
                </Text>
                <Icon type="material" name="keyboard-arrow-down" size={20} color={Colors.grey2} />
              </HStack>
            );
          }}
        </Pressable>
      </HStack>
      {isManageShipBox ? (
        <ShippingBoxForm onAddNewShipBox={onAddNewShipBox} />
      ) : shippingBoxes.length === 0 ? (
        <Text
          textAlign="center"
          color={Colors.grey3}
          fontFamily="Microsoft YaHei"
          fontWeight="400"
          lineHeight="15px"
          fontSize="11px">
          目前未有寄货箱尺寸。请点击“添加箱子”以添加。
        </Text>
      ) : (
        <ScrollView horizontal contentContainerStyle={{ flex: 1, height: 200 }}>
          <FlatList
            data={shippingBoxes}
            renderItem={renderShippingBoxItem}
            extraData={shippingBoxes.length}
            scrollEnabled={true}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
          />
        </ScrollView>
      )}
    </>
  );
};
ShippingBoxSection.propTypes = {
  onSaveShipBox: PropTypes.func,
  onCallUnitSwitch: PropTypes.func,
  activeShipBoxId: PropTypes.string,
  isMetricUnit: PropTypes.bool,
};
ShippingBoxSection.defaultProps = {
  onSaveShipBox: () => {},
  onCallUnitSwitch: () => {},
  activeShipBoxId: null,
  isMetricUnit: true,
};
export default React.memo(ShippingBoxSection);

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
