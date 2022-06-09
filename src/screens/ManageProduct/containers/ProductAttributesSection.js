import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Image,
  FlatList,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ActionSheetIOS,
  StyleSheet,
} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

//= ==third party plugins=======

import { useDispatch } from 'react-redux';
import styled from 'styled-components/native';
import { v4 as uuidv4 } from 'uuid';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-community/masked-view';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import ModalSelector from 'react-native-modal-selector';
import { Icon, Input, Button } from 'react-native-elements';
// import { v4 as uuidv4 } from 'uuid';
import { Box, HStack, Center, Pressable, Text } from 'native-base';
import { useTranslation } from 'react-i18next';
import Collapsible from 'react-native-collapsible';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from '@alessiocancian/react-native-actionsheet';
import _, { findLastKey } from 'lodash';
import * as globals from '@utils/global';
import FastImage from 'react-native-fast-image';
import Autocomplete from 'react-native-autocomplete-input';
import { ActionSheet as CrossActionSheet } from 'react-native-cross-actionsheet';

// import Spinner from 'react-native-loading-spinner-overlay';

//= ==custom components & containers  =======
import { Content, Container, JitengHeaderContainer, ErrorView } from '@components';

//= ======selectors==========================

//= ======reducer actions====================

//= ==========Query=======================
import { SEARCH_BRAND, ADD_BRAND } from '@modules/product/graphql';
//= =========context===============================
import { useSettingContext } from '@contexts/SettingContext';

//= =============utils==================================
import * as constants from '@utils/constant';
//= =======Hook data=============================
import { useTopProductCategories } from '@data/useProductCategories';
import { useSupportedCurrencies } from '@data/useAssets';
//= =============styles==================================
import { Colors, Metrics, Fonts } from '@theme';
import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { borderWidth } from 'styled-system';
import { AssetPreview } from '../components';

// import { StyleSheetFactory } from './styles';
const assetPreviewSize = getAdjustSize({ width: 114, height: 114 });

//= =============images & constants ===============================
//= ============import end ====================
const options = {
  mediaType: 'photo',
  includeBase64: false,
};

const initOptionData = {
  id: null,
  variation: [],
  price: null,
  discountPrice: null,
  asset: null,
  quantity: null,
};

const OptionVariantForm = ({ variant, onClose, onSubmit, onRemove, isFocused }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm();
  const onClosePanel = () => {
    if (variant) {
      onRemove(variant.id);
    } else {
      onClose();
    }
  };
  useEffect(() => {
    if (isFocused) {
      reset({
        name: variant?.name || null,
        value: variant?.value || null,
      });
    }
    return () => {};
  }, [isFocused]);

  return (
    <>
      <Box width="100%" backgroundColor={Colors.white} paddingY="12px" paddingX="10px">
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputElement
              placeholder="选项名称*"
              label="选项名称"
              inputContainerStyle={[{ borderWidth: 1, borderRadius: 4 }]}
              onChangeText={value => onChange(value)}
              value={value}
              // errorStyle={{ color: errors.quantity ? Colors.red : 'transparent' }}
              errorMessage={errors?.name?.message}
            />
          )}
          name="name"
          rules={{
            required: 'This is required.',
          }}
          defaultValue={variant?.name}
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputElement
              placeholder="选项数值*"
              label="选项数值"
              inputContainerStyle={[{ borderWidth: 1, borderRadius: 4 }]}
              onChangeText={value => onChange(value)}
              value={value}
              // errorStyle={{ color: errors.quantity ? Colors.red : 'transparent' }}
              errorMessage={errors?.value?.message}
            />
          )}
          name="value"
          rules={{
            required: 'This is required.',
          }}
          defaultValue={variant?.value}
        />
        <HStack justifyContent="center">
          <Button
            onPress={onClosePanel}
            buttonStyle={styles.deleteButton}
            titleStyle={styles.deleteButtonTitle}
            title={variant ? '删除' : '取消'}
          />
          <Button
            onPress={handleSubmit(onSubmit)}
            buttonStyle={styles.saveButton}
            titleStyle={styles.saveButtonTitle}
            title="保存"
          />
        </HStack>
      </Box>
    </>
  );
};
OptionVariantForm.propTypes = {
  variant: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  onRemove: PropTypes.func,
  isFocused: PropTypes.bool,
};
OptionVariantForm.defaultProps = {
  variant: null,
  onClose: () => {},
  onSubmit: () => {},
  onRemove: () => {},
  isFocused: true,
};
const OptionVariantPanel = ({ variant, onRemoveVariant, onUpdateVariant }) => {
  const [collapsed, setCollapsed] = useState(true);

  const updateVariant = value => {
    onUpdateVariant({ ...value, id: variant.id });
    setCollapsed(true);
  };

  return (
    <>
      <VariantCardContainer>
        <TouchableOpacity
          onPress={() => {
            setCollapsed(prev => !prev);
          }}>
          <Box
            width="100%"
            flexDirection="row"
            justifyContent="space-between"
            paddingY="12px"
            paddingX="10px"
            overflow="hidden"
            backgroundColor={Colors.grey6}>
            <VariantInfoTitle>{`${variant.name} / ${variant.value}`}</VariantInfoTitle>
            <Icon
              name={collapsed ? 'chevron-thin-down' : 'chevron-thin-up'}
              size={20}
              type="entypo"
              color={Colors.grey3}
              containerStyle={{ marginRight: 10, borderRadius: 20 }}
            />
          </Box>
        </TouchableOpacity>

        <Collapsible collapsed={collapsed} align="top" renderChildrenCollapsed={true} style={{}}>
          <OptionVariantForm
            variant={variant}
            onRemove={onRemoveVariant}
            isFocused={!collapsed}
            onSubmit={updateVariant}
          />
        </Collapsible>
      </VariantCardContainer>
    </>
  );
};
OptionVariantPanel.propTypes = {
  variant: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  onRemoveVariant: PropTypes.func,
  onUpdateVariant: PropTypes.func,
};
OptionVariantPanel.defaultProps = {
  variant: null,
  onRemoveVariant: () => {},
  onUpdateVariant: () => {},
};
const ProductAttributesSection = forwardRef(
  (
    {
      productOption = initOptionData,
      onUpdateProductOptions = () => {},
      onRemoveProductOption = () => {},
      onAddProductOption = () => {},
      onClose = () => {},
      addAction,
    },
    ref,
  ) => {
    //= ========Hook Init===========

    const {
      control,
      handleSubmit,
      formState: { errors },
      getValues,
      setValue,
      reset,
    } = useForm();

    useImperativeHandle(ref, () => ({
      callGetProductOptions() {},
    }));
    const onClosePanel = () => {
      if (productOption?.id) {
        onRemoveProductOption(productOption?.id);
      } else {
        console.log('onClose');
        onClose();
      }
    };

    const onSubmit = data => {
      if (productOption?.id) {
        onUpdateProductOptions(data);
      } else {
        onAddProductOption(data);
      }
    };
    //= ========= Props Section========
    const sizeInputRef = useRef(null);
    const { id, asset, variation, price, discountPrice, quantity } = productOption;
    //= ======== State Section========
    const [isAddingNewVariant, setIsAddingNewVariant] = useState(false);

    useEffect(() => {
      setValue(
        'variation',
        _.map(variation, item => {
          return { id: `${item.name}_${item.value}`, name: item.name, value: item.value };
        }),
      );
    }, [variation]);
    useEffect(() => {
      setValue('asset', asset);
      setValue('price', price.toString());
      setValue('discountPrice', discountPrice.toString());
      setValue('quantity', quantity.toString());
      return () => {};
    }, [asset, price, discountPrice, quantity, setValue]);
    const chooseAssetPhoto = response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        const id = uuidv4();
        const asset = response.assets[0];

        const photoData = {
          id,
          type: asset.type,
          size: asset.fileSize,
          url: asset.uri,
          isLocal: true,
        };
        setValue('asset', photoData);
      }
    };
    const onPressAssetItem = useCallback(() => {
      CrossActionSheet.options({
        options: [
          {
            text: 'Take a photo',
            onPress: () => {
              launchCamera(constants.Image_Options, response => {
                chooseAssetPhoto(response);
              });
            },
          },
          {
            text: 'Choose from gallery',
            onPress: () => {
              launchImageLibrary(constants.Image_Options, response => {
                chooseAssetPhoto(response);
              });
            },
          },
        ],
        cancel: { onPress: () => console.log('cancel') },
      });
    }, []);

    const addNewVariant = item => {
      const originVales = getValues('variation');
      setValue(
        'variation',
        _.concat(originVales, {
          id: `${item.name}_${item.value}`,
          name: item.name,
          value: item.value,
        }),
      );
      setIsAddingNewVariant(false);
    };
    const onRemoveVariant = id => {
      const originVales = getValues('variation');

      setValue(
        'variation',
        _.filter(originVales, item => item.id !== id),
      );
    };
    const onUpdateVariant = updateItem => {
      const originVales = getValues('variation');

      setValue(
        'variation',
        _.map(originVales, item => (item.id !== updateItem.id ? item : updateItem)),
      );
    };
    const toggleIsAddingNewVariant = () => {
      setIsAddingNewVariant(prev => !prev);
    };
    const watchVariation = useWatch({
      control,
      name: 'variation',
      defaultValue: [], // default value before the render
    });

    return (
      <Box borderColor={Colors.grey4} borderWidth="1px" borderRadius="5px" marginTop="8px">
        <Text
          color={Colors.grey1}
          my="10px"
          ml="5px"
          fontFamily="Microsoft YaHei"
          fontWeight="400"
          lineHeight="15px"
          fontSize="11px">
          添加商品选项相片*
        </Text>
        <Box backgroundColor={Colors.grey4} height="1px" width="100%" />
        <Box px="10px" py="10px">
          <Controller
            control={control}
            render={({ field: { value } }) => {
              const assetData = value || constants.AssetsBtnObj;
              return (
                <Box alignSelf="center">
                  <AssetPreview
                    asset={assetData}
                    onPressAssetItem={onPressAssetItem}
                    onPressRemoveItem={() => {
                      setValue('asset', null);
                    }}
                    marked={false}
                  />
                </Box>
              );
            }}
            name="asset"
            rules={{
              required: {
                value: true,
                message: 'This is required',
              },
            }}
            defaultValue={asset}
          />
          <ErrorView error={errors?.asset?.message || ''} />

          <Controller
            control={control}
            render={({ field: { value } }) => {
              return (
                <>
                  {_.map(value || [], item => {
                    return (
                      <OptionVariantPanel
                        key={item.id}
                        variant={item}
                        onRemoveVariant={onRemoveVariant}
                        onUpdateVariant={onUpdateVariant}
                      />
                    );
                  })}

                  {isAddingNewVariant ? (
                    <OptionVariantForm
                      onClose={toggleIsAddingNewVariant}
                      onSubmit={addNewVariant}
                    />
                  ) : (
                    <Pressable onPress={toggleIsAddingNewVariant}>
                      {({ isHovered, isFocused, isPressed }) => {
                        return (
                          <HStack
                            alignItems="center"
                            bg={isPressed ? 'primary.100' : isHovered ? 'primary.50' : Colors.white}
                            my="10px"
                            px="10px"
                            py="3px"
                            style={{
                              transform: [
                                {
                                  scale: isPressed ? 0.96 : 1,
                                },
                              ],
                            }}>
                            <Icon type="antdesign" name="plus" size={15} color={Colors.moreInfo} />
                            <Text
                              color={Colors.moreInfo}
                              fontFamily="Microsoft YaHei"
                              fontWeight="400"
                              fontSize="11px">
                              添加更多產品变异
                            </Text>
                          </HStack>
                        );
                      }}
                    </Pressable>
                  )}
                </>
              );
            }}
            name="variation"
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
          <ErrorView error={errors?.variation?.message || ''} />

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputElement
                placeholder="数字"
                label="数量*"
                inputContainerStyle={[{ borderWidth: 1, borderRadius: 4 }]}
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
                // errorStyle={{ color: errors.quantity ? Colors.red : 'transparent' }}
                errorMessage={errors?.quantity?.message}
              />
            )}
            name="quantity"
            rules={{
              required: 'This is required.',
              min: {
                value: 0,
                message: 'This value has to be larger than zero',
              },
            }}
            defaultValue={quantity}
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputElement
                placeholder="价格"
                label="特价*"
                inputContainerStyle={[{ borderWidth: 1, borderRadius: 4 }]}
                containerStyle={{ width: '50%' }}
                keyboardType="numeric"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                returnKeyType="next"
                // errorStyle={{ color: errors.price ? Colors.red : 'transparent' }}
                errorMessage={errors?.price?.message}
              />
            )}
            name="price"
            rules={{
              required: 'Please set product price',
              validate: value => {
                const validate = parseFloat(value) < parseFloat(getValues('discountPrice'));
                if (validate) {
                  return null;
                } else {
                  return 'Price has  to be smaller than Old Price.';
                }
              },
            }}
            defaultValue={price}
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputElement
                placeholder="价格"
                label="原价*"
                inputContainerStyle={[{ borderWidth: 1, borderRadius: 4 }]}
                containerStyle={{ width: '50%' }}
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
                returnKeyType="next"
                // errorStyle={{
                //     color: errors.discountPrice ? Colors.red : 'transparent',
                // }}
                errorMessage={errors?.discountPrice?.message}
              />
            )}
            name="discountPrice"
            rules={{
              required: 'Please set product price',
              validate: value => {
                const validate = parseFloat(value) > parseFloat(getValues('price'));
                if (validate) {
                  return null;
                } else {
                  return 'Price has  to be bigger  than  Price.';
                }
              },
            }}
            defaultValue={discountPrice}
          />

          <HStack justifyContent="center">
            <Button
              onPress={() => {
                onClosePanel();
              }}
              buttonStyle={styles.deleteButton}
              titleStyle={styles.deleteButtonTitle}
              title={productOption?.id ? '删除' : '取消'}
            />
            <Button
              onPress={handleSubmit(onSubmit)}
              buttonStyle={styles.saveButton}
              titleStyle={styles.saveButtonTitle}
              title={productOption?.id ? '更新' : '保存'}
            />
          </HStack>
        </Box>
      </Box>
    );
  },
);
ProductAttributesSection.propTypes = {
  productOption: PropTypes.shape({
    id: PropTypes.string,
    variation: PropTypes.arrayOf(PropTypes.object),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    discountPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    asset: PropTypes.shape({}),
  }),
  onUpdateProductOptions: PropTypes.func,
  onRemoveProductOption: PropTypes.func,
  onAddProductOption: PropTypes.func,
  onClose: PropTypes.func,
  addAction: PropTypes.bool,
};
ProductAttributesSection.defaultProps = {
  productOption: initOptionData,

  onUpdateProductOptions: () => {},
  onRemoveProductOption: () => {},
  onAddProductOption: () => {},
  onClose: () => {},
  addAction: false,
};
export default ProductAttributesSection;
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
  },
  containerStyle: {
    paddingLeft: 0,
    paddingRight: 0,
  },
})``;
const AssetContainer = styled.View`
  align-self: center;
  background-color: ${Colors.grey4};
  border-color: ${props => (props.marked ? Colors.priceRed : Colors.grey4)};
  border-radius: 6px;
  border-width: ${props => (props.marked ? 5 : 0)}px;
  height: ${assetPreviewSize.height}px;
  overflow: hidden;
  width: ${assetPreviewSize.width}px;
`;
const AssetImage = styled(FastImage)`
  background-color: ${Colors.grey4};
  height: ${assetPreviewSize.height}px;
  width: ${assetPreviewSize.width}px;
`;

const VariantCardContainer = styled.View`
  background-color: ${Colors.white};
  border-color: ${Colors.grey4};
  border-radius: 8px;
  border-width: 1px;
  justify-content: center;
  margin-top: 10px;
  overflow: hidden;
  width: 100%;
`;
const ShadowText = styled(Text)`
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
  elevation: 5;
`;
const VariantInfoTitle = styled.Text`
  align-self: center;
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
`;
