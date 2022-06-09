import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Image,
  FlatList,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ActionSheetIOS,
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
import { Box, HStack, Center, Text, Pressable } from 'native-base';
import { useTranslation } from 'react-i18next';
import Collapsible from 'react-native-collapsible';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from '@alessiocancian/react-native-actionsheet';
import _ from 'lodash';
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
import { SEARCH_BRAND, ADD_BRAND, ADD_PRODUCT } from '@modules/product/graphql';

//= =========context===============================
import { useSettingContext } from '@contexts/SettingContext';

//= =============utils==================================
import * as constants from '@utils/constant';
//= =======Hook data=============================
import { useTopProductCategories } from '@data/useProductCategories';
import { useSupportedCurrencies, useShippingBoxes } from '@data/useAssets';
import { useOrganization } from '@data/useUser';
import { useProduct } from '@data/useProduct';

//= =============styles==================================
import { Colors, Metrics, Fonts } from '@theme';
import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { styles } from './styles';
// import { StyleSheetFactory } from './styles';
import { ProductAttributesSection, ShippingBoxSection } from './containers';
import { AssetPreview } from './components';

const assetPreviewSize = getAdjustSize({ width: 114, height: 114 });

// AssetType
//= =============images & constants ===============================
//= ============import end ====================
const emptyProduct = {
  productCat: null,
  productBrand: null,
  productAssets: [],
  productOptions: [],
  productName: '',
  productDesc: '',
  price: null,
  discountPrice: null,
  productQuantity: null,
  thumbnailId: null,
  shippingBox: null,
  customCarrierValue: null,
  freeDeliveryTo: constants.FreeShipType[0],
};

const BrandFilter = ({
  selectBrand = () => {},
  onFocusBrandFilter = () => {},
  onBlurBrandFilter = () => {},
  value = {},
  errorMessage = null,
}) => {
  const [query, setquery] = useState('');
  const [isExistBrand, setIsExistBrand] = useState(true);
  const [searching, setSearching] = useState(false);
  const [brandList, setbrandList] = useState([]);
  const brandInputRef = useRef();
  const [addBrand] = useMutation(ADD_BRAND);
  useEffect(() => {
    setquery(value?.name || '');
  }, [value]);

  const { t, i18n } = useTranslation();
  const [searchBrand] = useLazyQuery(SEARCH_BRAND, {
    variables: {
      skip: 0,
      limit: 30,
      query,
    },
    onCompleted: data => {
      setbrandList(data?.searchBrand?.collection || []);
    },
  });

  useEffect(() => {
    if (query && query.length > 2 && searching) {
      setIsExistBrand(false);
      searchBrand();
    }
    return () => {};
  }, [query, searchBrand, searching]);

  const onSelectBrand = useCallback(
    item => {
      brandInputRef?.current?.blur();
      setSearching(false);
      selectBrand(item);
      setquery(item.name);
      setIsExistBrand(true);
    },
    [selectBrand],
  );

  const onCallAddBrand = async () => {
    const {
      data: { addBrand: brand },
    } = await addBrand({
      variables: { name: query },
    });
    onSelectBrand(brand);
  };
  const onFocus = useCallback(() => {
    setquery('');
    setSearching(true);
    onFocusBrandFilter();
  }, [onFocusBrandFilter]);
  const onBlur = useCallback(() => {
    setSearching(false);
    onBlurBrandFilter();
  }, [onBlurBrandFilter]);
  const renderBrandItem = useCallback(
    ({ item, i }) => {
      return (
        <TouchableOpacity
          key={i}
          style={{ paddingVertical: 5 }}
          onPress={() => {
            onSelectBrand(item);
          }}>
          <Text>{item.name}</Text>
        </TouchableOpacity>
      );
    },
    [onSelectBrand],
  );

  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
      }}>
      <View style={{ flexGrow: 1, minHeight: 80 }}>
        <View style={styles.autocompleteContainer}>
          <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
            <Autocomplete
              data={brandList}
              inputContainerStyle={{
                borderWidth: 0,
              }}
              hideResults={!searching}
              renderTextInput={() => {
                return (
                  <Input
                    ref={brandInputRef}
                    placeholder="品牌名称*"
                    inputContainerStyle={{ borderWidth: 1, borderRadius: 4 }}
                    value={query}
                    defaultValue={value?.name}
                    onChangeText={setquery}
                    returnKeyType="done"
                    clearButtonMode="always"
                    onFocus={onFocus}
                    onBlur={onBlur}
                    errorMessage={errorMessage}
                    rightIcon={
                      <Icon
                        type="ionicon"
                        name="search"
                        size={20}
                        color={Colors.placeholderColor}
                      />
                    }
                  />
                );
              }}
              listContainerStyle={{
                marginTop: -20,
                height: 150,
                marginHorizontal: 10,
              }}
              flatListProps={{
                keyExtractor: (_, idx) => idx,
                renderItem: renderBrandItem,
              }}
              keyboardShouldPersistTaps="always"
            />
          </ScrollView>
        </View>
      </View>
      <Button
        containerStyle={{ marginLeft: 3, marginTop: 5, paddingRight: 10 }}
        disabled={isExistBrand}
        onPress={onCallAddBrand}
        title="Add New"
        type="outline"
      />
    </View>
  );
};

const ManageProduct = ({ navigation, route }) => {
  //= ========Hook Init===========
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const { topProductCategories } = useTopProductCategories();
  const supportedCurrencies = useSupportedCurrencies();
  const { organization } = useOrganization();
  const { shippingBoxes } = useShippingBoxes();
  const { userLanguage } = useSettingContext();
  // const styles = StyleSheetFactory({ theme });
  const ActionSheetRef = useRef(null);
  const contentRef = useRef(null);
  const [addProductQuery] = useMutation(ADD_PRODUCT);
  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
    getValues,
    setValue,
    reset,
  } = useForm();
  const keyExtractor = useCallback(item => item?.id, []);
  useEffect(() => {
    // reset(emptyProduct);
    return () => {};
  }, []);

  const {
    loading: isFetchingProduct,
    error: fetchingProductError,
    product,
  } = useProduct({ productId: route?.params?.productId });

  const watchThumbnailId = useWatch({
    control,
    name: 'thumbnailId',
    defaultValue: null, // default value before the render
  });
  //= ========= Props Section========
  //= ======== State Section========
  const [panelScrollEnabled, setPanelScrollEnabled] = useState(true);
  const [isAddingNewAttribute, setIsAddingNewAttribute] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [collapsedProductOptionPanel, setCollapsedProductOptionPanel] = useState(false);
  const [collapsedFreeShip, setCollapsedFreeShip] = useState(false);
  const [collapsedCustomCarrier, setCollapsedCustomCarrier] = useState(false);
  const [collapsedShipBox, setCollapsedShipBox] = useState(false);

  //= ========= GraphQl query Section========
  //= ========= Use Effect Section========
  useEffect(() => {
    if (product) {
      setValue('productAssets', product?.assets || []);
      setValue('thumbnailId', product?.thumbnail?.id || null);
      setValue('productName', product?.title || null);
      setValue('productDesc', product?.description || null);
      setValue('productCat', product?.category || null);
      setValue('productBrand', product?.brand || null);

      setValue('discountPrice', product?.oldPrice?.amountISO.toString() || null);
      setValue('price', product?.price?.amountISO.toString() || null);
      setValue('productQuantity', product?.quantity.toString() || null);
      setValue('productCurrency', product?.price?.currency || null);
      setValue('customCarrierValue', product?.customCarrierValue?.amountISO.toString() || null);

      setValue('shippingBox', product?.shippingBox?.id || null);
      setValue(
        'attrs',
        _.map(product?.attrs || [], item => {
          const { id, asset, variation, price, oldPrice, quantity } = item;
          return {
            id,
            asset,
            variation,
            price: price?.amountISO.toString() || null,
            discountPrice: oldPrice?.amountISO.toString() || null,
            quantity,
          };
        }),
      );
    }
    return () => {};
  }, [product]);
  useEffect(() => {
    if (organization) {
      setValue('customCarrier', organization?.customCarrier);
    }

    return () => {};
  }, [organization]);

  const onFocusBrandFilter = () => {
    setPanelScrollEnabled(false);
    setTimeout(() => {
      contentRef.current._innerRoot.scrollTo({ x: 0, y: 300, animated: true });
    }, 400);
  };
  const onBlurBrandFilter = () => {
    setPanelScrollEnabled(true);
  };

  const selectBrand = item => {
    setValue('productBrand', item);
    setPanelScrollEnabled(true);
  };

  const chooseAssetPhoto = response => {
    if (response.didCancel) {
    } else if (response.error) {
    } else {
      const id = uuidv4();
      const asset = response.assets[0];

      const oldData = getValues('productAssets');
      if (oldData.length === 0) {
        setValue('thumbnailId', id);
      }
      const photoData = {
        id,
        type: asset.type,
        size: asset.fileSize,
        url: asset.uri,
        isLocal: true,
      };
      setValue('productAssets', _.concat(oldData, photoData));
    }
  };

  const onPressAssetItem = useCallback(
    id => {
      if (getValues('productAssets').length >= 6) {
        return;
      }
      if (id === 'button') {
        ActionSheetRef.current?.show();
      } else {
        setValue('thumbnailId', id);
      }
    },
    [getValues, setValue],
  );
  const onPressRemoveAssetItem = useCallback(
    id => {
      const newAssetsData = _.filter(getValues('productAssets'), item => item?.id !== id);
      setValue('productAssets', newAssetsData);
      if (getValues('thumbnailId') === id) {
        if (newAssetsData.length === 0) {
          setValue('thumbnailId', null);
        } else {
          setValue('thumbnailId', newAssetsData[0].id);
        }
      }
    },
    [getValues, setValue],
  );
  const onChangeCurrency = item => {
    setValue('productCurrency', item);
  };
  const onChangeCategory = item => {
    setValue('productCat', item);
  };

  const addProductOption = data => {
    const originVal = getValues('attrs') || [];
    setValue('attrs', _.concat(originVal, { id: uuidv4(), ...data }));
    setIsAddingNewAttribute(false);
  };
  const removeProductOption = id => {
    const originVal = getValues('attrs') || [];
    setValue(
      'attrs',
      _.filter(originVal, item => item.id !== id),
    );
  };
  const updateProductOptions = data => {
    const originVal = getValues('attrs') || [];
    setValue(
      'attrs',
      _.map(originVal, item => (item.id !== data.id ? item : data)),
    );
  };

  const onAddProduct = async data => {
    try {
      // console.log('onAddProduct', JSON.stringify(data));
      const {
        productAssets,
        thumbnailId,
        productName,
        productDesc,
        productBrand,
        productCat,
        price,
        discountPrice,
        attrs,
        freeDeliveryTo,
        customCarrierValue,
        customCarrier,
        shippingBox,
        productCurrency,
        productQuantity,
      } = data;

      const productAttr = await Promise.all(
        _.map(attrs, async attr => {
          const {
            id,
            asset,
            variation,
            price: attrPrice,
            discountPrice: attrDiscountPrice,
            quantity,
          } = attr;
          const assetIdPair = await globals.uploadAsset(asset);
          return {
            quantity: parseInt(quantity, 10),
            price: parseFloat(attrPrice),
            discountPrice: parseFloat(attrDiscountPrice),
            currency: productCurrency,
            asset: assetIdPair[asset.id],
            variation: _.map(variation, item => ({ name: item.name, value: item.value })),
          };
        }),
      );
      const assetPairIds = await globals.uploadMultiAssets(productAssets);

      const productData = {
        title: productName,
        description: productDesc,
        quantity: parseInt(productQuantity, 10),
        price: parseFloat(price),
        discountPrice: parseFloat(discountPrice),
        currency: productCurrency,
        assets: Object.values(assetPairIds),
        thumbnailId: assetPairIds[thumbnailId],
        category: productCat.id,
        brand: productBrand.id,
        freeDeliveryTo: freeDeliveryTo.id,
        attrs: productAttr,
        metaDescription: '',
        metaTags: [],
        seoTitle: '',
        language: userLanguage,
        shippingBox,
      };
      if (customCarrier) {
        productData.customCarrier = customCarrier.name;
        productData.customCarrierValue = parseFloat(customCarrierValue);
      }
      const {
        data: { addProduct },
      } = await addProductQuery({
        variables: productData,
      });
      const result = addProduct;
    } catch (error) {
      console.log('onAddProduct error', error?.message);
    }
  };
  const toggleIsAddingNewAttribute = () => {
    setIsAddingNewAttribute(prev => !prev);
  };
  const renderAssetItem = useCallback(
    ({ item, index }) => {
      return (
        <Box marginRight="12px">
          <AssetPreview
            asset={item}
            onPressAssetItem={onPressAssetItem}
            onPressRemoveItem={onPressRemoveAssetItem}
            marked={item.id === watchThumbnailId}
          />
        </Box>
      );
    },
    [onPressAssetItem, onPressRemoveAssetItem, watchThumbnailId],
  );

  return (
    <Container>
      <JitengHeaderContainer
        gradientColors={[Colors.white, Colors.white]}
        barStyle="dark-content"
        statusBarBackgroundColor={Colors.white}>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          paddingX={`${wp(15)}px`}
          width="100%">
          <Box flexDirection="row">
            <BackButton
              onPress={() => {
                navigation.goBack();
                /*  navigation.reset({
                  index: 0,
                  routes: [{ name: 'SellerProductList', params: { refetch: true } }],
                }); */
              }}>
              <Icon name="left" type="antdesign" color={Colors.grey14} size={wp(22)} />
            </BackButton>
            <HeaderText>添加商品</HeaderText>
          </Box>
          <DeleteButton>
            <DeleteButtonText>刪除</DeleteButtonText>
          </DeleteButton>
        </Box>
      </JitengHeaderContainer>

      <Content
        ref={contentRef}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        enableOnAndroid={false}
        scrollEnabled={panelScrollEnabled}
        contentContainerStyle={styles.contentContainerStyle}
        style={styles.contentView}>
        <Box width="100%" flexGrow={1} pb="10px" px="12px">
          <CardContainer>
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
                <ProductInfoTitle>商品资料</ProductInfoTitle>
                <Icon
                  name={collapsed ? 'chevron-thin-down' : 'chevron-thin-up'}
                  size={20}
                  type="entypo"
                  color={Colors.grey3}
                  containerStyle={{ marginRight: 10, borderRadius: 20 }}
                />
              </Box>
            </TouchableOpacity>

            <Collapsible
              collapsed={collapsed}
              align="top"
              renderChildrenCollapsed={true}
              style={{}}>
              <Box width="100%" backgroundColor={Colors.white} paddingY="12px" paddingX="10px">
                <Box>
                  <ProductItemTitle>最多添加6张相片</ProductItemTitle>
                  <Box
                    width="100%"
                    borderColor={Colors.grey4}
                    borderRadius="5px"
                    borderWidth="1px"
                    paddingX="8px"
                    paddingY="8px">
                    <Controller
                      control={control}
                      render={({ field: { value } }) => {
                        const listData = _.reverse(_.concat(value, constants.AssetsBtnObj));
                        return (
                          <FlatList
                            data={listData}
                            renderItem={renderAssetItem}
                            extraData={listData.length}
                            keyExtractor={keyExtractor}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                          />
                        );
                      }}
                      name="productAssets"
                      rules={{
                        required: 'Please select cover image for product',
                        validate: value => {
                          const validate = value?.length > 0;
                          if (validate) {
                            return null;
                          } else {
                            return 'Please select cover image for product';
                          }
                        },
                      }}
                      defaultValue={emptyProduct.productAssets}
                    />
                  </Box>
                  <Controller
                    control={control}
                    render={({ value }) => <HiddenText>{value}</HiddenText>}
                    name="thumbnailId"
                    rules={{ required: true }}
                    defaultValue={emptyProduct.thumbnailId}
                  />
                  <ErrorView error={errors?.productAssets?.message || ''} />
                </Box>
                <Box>
                  <ProductItemTitle>商品名称*</ProductItemTitle>
                  <Controller
                    render={({ field: { onChange, onBlur, value } }) => {
                      return (
                        <InputElement
                          placeholder="商品名称"
                          textAlignVertical="top"
                          value={value}
                          onChangeText={onChange}
                          errorMessage={errors?.productName?.message}
                        />
                      );
                    }}
                    control={control}
                    rules={{ required: 'Please input product Name' }}
                    name="productName"
                    defaultValue={emptyProduct.productName}
                  />
                </Box>
                <Box>
                  <ProductItemTitle>商品名称*</ProductItemTitle>
                  <Controller
                    render={({ field: { onChange, onBlur, value } }) => {
                      return (
                        <InputElement
                          placeholder="商品名称"
                          multiline={true}
                          numberOfLines={2}
                          textAlignVertical="top"
                          value={value}
                          onChangeText={onChange}
                          errorMessage={errors?.productDesc?.message}
                        />
                      );
                    }}
                    control={control}
                    rules={{ required: 'Please input product Name' }}
                    name="productDesc"
                    defaultValue={emptyProduct.productDesc}
                  />
                </Box>
                <Box>
                  <ProductItemTitle>品牌名称*</ProductItemTitle>
                  <Controller
                    render={({ field: { onChange, onBlur, value } }) => {
                      return (
                        <BrandFilter
                          selectBrand={selectBrand}
                          onFocusBrandFilter={onFocusBrandFilter}
                          onBlurBrandFilter={onBlurBrandFilter}
                          errorMessage={errors?.productBrand?.message}
                          value={value}
                        />
                      );
                    }}
                    control={control}
                    rules={{ required: 'Please select brand' }}
                    name="productBrand"
                    defaultValue={emptyProduct.productBrand}
                  />
                </Box>
                <Box>
                  <ProductItemTitle> 类别*</ProductItemTitle>
                  <Controller
                    render={({ field: { value } }) => {
                      return (
                        <ModalSelector
                          data={topProductCategories}
                          style={styles.catContentStyle}
                          initValue={value?.name}
                          selectedItemTextStyle={{ color: Colors.red }}
                          onChange={onChangeCategory}
                          keyExtractor={item => item.id}
                          labelExtractor={item => item.name}>
                          <InputElement
                            editable={false}
                            placeholder="类别*"
                            value={value?.name}
                            rightIcon={
                              <Icon
                                type="material"
                                name="keyboard-arrow-down"
                                size={25}
                                color={Colors.placeholderColor}
                              />
                            }
                            errorMessage={errors?.productCat?.message}
                          />
                        </ModalSelector>
                      );
                    }}
                    control={control}
                    rules={{ required: 'Please select category' }}
                    name="productCat"
                    defaultValue={emptyProduct.productCat}
                  />
                </Box>
                <Divider />

                <Box>
                  <ProductItemTitle>数量*</ProductItemTitle>
                  <Controller
                    render={({ field: { onChange, onBlur, value } }) => {
                      return (
                        <InputElement
                          placeholder="数字"
                          textAlignVertical="top"
                          value={value}
                          keyboardType="numeric"
                          onChangeText={onChange}
                          errorMessage={errors?.productQuantity?.message}
                        />
                      );
                    }}
                    control={control}
                    rules={{
                      required: 'Please set product Quantity',
                    }}
                    name="productQuantity"
                    defaultValue={emptyProduct.productQuantity}
                  />
                </Box>
                <Box>
                  <ProductItemTitle>原价*</ProductItemTitle>
                  <Controller
                    render={({ field: { onChange, onBlur, value } }) => {
                      return (
                        <InputElement
                          placeholder="原价(RMB)"
                          textAlignVertical="top"
                          value={value}
                          onChangeText={onChange}
                          keyboardType="numeric"
                          errorMessage={errors?.price?.message}
                        />
                      );
                    }}
                    control={control}
                    rules={{
                      required: 'Please set product price',
                      validate: value => {
                        const validate = parseFloat(value) < parseFloat(getValues('discountPrice'));
                        if (validate) {
                          return null;
                        } else {
                          return 'Price has to be smaller than Old Price.';
                        }
                      },
                    }}
                    name="price"
                    defaultValue={emptyProduct.price}
                  />
                </Box>

                <Box>
                  <ProductItemTitle>特价*</ProductItemTitle>
                  <Controller
                    render={({ field: { onChange, onBlur, value } }) => {
                      return (
                        <InputElement
                          placeholder="特价(RMB)"
                          textAlignVertical="top"
                          value={value}
                          onChangeText={onChange}
                          keyboardType="numeric"
                          errorMessage={errors?.discountPrice?.message}
                        />
                      );
                    }}
                    control={control}
                    rules={{
                      required: 'Please set product old price',
                      validate: value => {
                        const validate = parseFloat(value) > parseFloat(getValues('price'));
                        if (validate) {
                          return null;
                        } else {
                          return 'Discount Price has not to be smaller than price.';
                        }
                      },
                    }}
                    name="discountPrice"
                    defaultValue={emptyProduct.discountPrice}
                  />
                </Box>

                <Box>
                  <ProductItemTitle>货币*</ProductItemTitle>
                  <Controller
                    render={({ field: { value } }) => {
                      return (
                        <ModalSelector
                          data={supportedCurrencies}
                          initValue={value}
                          selectedItemTextStyle={{ color: Colors.red }}
                          style={styles.catContentStyle}
                          onChange={onChangeCurrency}
                          keyExtractor={item => item}
                          labelExtractor={item => item}>
                          <InputElement
                            editable={false}
                            placeholder="货币*(RMB)"
                            value={value}
                            rightIcon={
                              <Icon
                                type="material"
                                name="keyboard-arrow-down"
                                size={25}
                                color={Colors.placeholderColor}
                              />
                            }
                            errorMessage={errors?.productCat?.message}
                          />
                        </ModalSelector>
                      );
                    }}
                    control={control}
                    rules={{ required: 'Please select Currency' }}
                    name="productCurrency"
                    defaultValue="CNY"
                  />
                </Box>
              </Box>
            </Collapsible>
          </CardContainer>
          <CardContainer>
            <TouchableOpacity
              onPress={() => {
                setCollapsedProductOptionPanel(prev => !prev);
              }}>
              <Box
                width="100%"
                flexDirection="row"
                justifyContent="space-between"
                paddingY="12px"
                paddingX="10px"
                overflow="hidden"
                backgroundColor={Colors.grey6}>
                <ProductInfoTitle>商品选项</ProductInfoTitle>
                <Icon
                  name={collapsedProductOptionPanel ? 'chevron-thin-down' : 'chevron-thin-up'}
                  size={20}
                  type="entypo"
                  color={Colors.grey3}
                  containerStyle={{ marginRight: 10, borderRadius: 20 }}
                />
              </Box>
            </TouchableOpacity>

            <Collapsible
              collapsed={collapsedProductOptionPanel}
              align="top"
              renderChildrenCollapsed={true}
              style={{}}>
              <Box width="100%" backgroundColor={Colors.white} paddingY="12px" paddingX="10px">
                <Controller
                  control={control}
                  render={({ field: { value } }) => {
                    return (
                      <>
                        {_.map(value || [], item => {
                          return (
                            <ProductAttributesSection
                              key={item.id}
                              onRemoveProductOption={removeProductOption}
                              onUpdateProductOptions={updateProductOptions}
                              productOption={item}
                            />
                          );
                        })}

                        {isAddingNewAttribute ? (
                          <ProductAttributesSection
                            onClose={toggleIsAddingNewAttribute}
                            onAddProductOption={addProductOption}
                          />
                        ) : (
                          <>
                            <Pressable onPress={toggleIsAddingNewAttribute}>
                              {({ isHovered, isFocused, isPressed }) => {
                                return (
                                  <HStack
                                    alignItems="center"
                                    justifyContent="center"
                                    bg={
                                      isPressed
                                        ? 'primary.100'
                                        : isHovered
                                        ? 'primary.50'
                                        : Colors.white
                                    }
                                    my="10px"
                                    px="10px"
                                    py="10px"
                                    borderColor={Colors.grey3}
                                    borderWidth="1px"
                                    borderRadius="5px"
                                    style={{
                                      transform: [
                                        {
                                          scale: isPressed ? 0.96 : 1,
                                        },
                                      ],
                                    }}>
                                    <Text
                                      textAlign="center"
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
                          </>
                        )}
                      </>
                    );
                  }}
                  name="attrs"
                  rules={{
                    validate: value => {
                      if (value?.length > 0) {
                        return null;
                      } else {
                        return 'Please add attributes';
                      }
                    },
                  }}
                  defaultValue={[]}
                />
                {errors?.attrs?.message ? <ErrorView error={errors?.attrs?.message} /> : null}
              </Box>
            </Collapsible>
          </CardContainer>

          <CardContainer>
            <TouchableOpacity
              onPress={() => {
                setCollapsedFreeShip(prev => !prev);
              }}>
              <Box
                width="100%"
                flexDirection="row"
                justifyContent="space-between"
                paddingY="12px"
                paddingX="10px"
                overflow="hidden"
                backgroundColor={Colors.grey6}>
                <ProductInfoTitle>免费邮递*</ProductInfoTitle>
                <Icon
                  name={collapsedFreeShip ? 'chevron-thin-down' : 'chevron-thin-up'}
                  size={20}
                  type="entypo"
                  color={Colors.grey3}
                  containerStyle={{ marginRight: 10, borderRadius: 20 }}
                />
              </Box>
            </TouchableOpacity>

            <Collapsible
              collapsed={collapsedFreeShip}
              align="top"
              renderChildrenCollapsed={true}
              style={{}}>
              <Box width="100%" backgroundColor={Colors.white} paddingY="12px" paddingX="10px">
                <Controller
                  render={({ field: { value } }) => {
                    return (
                      <ModalSelector
                        data={constants.FreeShipType}
                        style={styles.catContentStyle}
                        onChange={item => {
                          setValue('freeDeliveryTo', item);
                        }}
                        initValue={value.name}
                        selectedItemTextStyle={{ color: Colors.red }}
                        keyExtractor={item => item.id}
                        labelExtractor={item => item.name}>
                        <InputElement
                          editable={false}
                          placeholder="免费邮递*"
                          value={value?.name}
                          rightIcon={
                            <Icon
                              type="material"
                              name="keyboard-arrow-down"
                              size={25}
                              color={Colors.placeholderColor}
                            />
                          }
                          errorMessage={errors?.freeDeliveryTo?.message}
                        />
                      </ModalSelector>
                    );
                  }}
                  control={control}
                  rules={{ required: 'Please select freeDeliveryTo' }}
                  name="freeDeliveryTo"
                  defaultValue={emptyProduct.freeDeliveryTo}
                />
              </Box>
            </Collapsible>
          </CardContainer>

          {organization?.customCarrier ? (
            <CardContainer>
              <TouchableOpacity
                onPress={() => {
                  setCollapsedCustomCarrier(prev => !prev);
                }}>
                <Box
                  width="100%"
                  flexDirection="row"
                  justifyContent="space-between"
                  paddingY="12px"
                  paddingX="10px"
                  overflow="hidden"
                  backgroundColor={Colors.grey6}>
                  <ProductInfoTitle>付运公司</ProductInfoTitle>
                  <Icon
                    name={collapsedCustomCarrier ? 'chevron-thin-down' : 'chevron-thin-up'}
                    size={20}
                    type="entypo"
                    color={Colors.grey3}
                    containerStyle={{ marginRight: 10, borderRadius: 20 }}
                  />
                </Box>
              </TouchableOpacity>

              <Collapsible
                collapsed={collapsedCustomCarrier}
                align="top"
                renderChildrenCollapsed={true}
                style={{}}>
                <Box width="100%" backgroundColor={Colors.white} paddingY="12px" paddingX="10px">
                  <Controller
                    render={({ field: { onChange, onBlur, value } }) => {
                      return (
                        <InputElement
                          label="其他付运公司*"
                          value={value?.name}
                          onChangeText={onChange}
                          disabled={true}
                        />
                      );
                    }}
                    control={control}
                    rules={{ required: 'Please input customCarrier' }}
                    name="customCarrier"
                    defaultValue={null}
                  />

                  <Controller
                    render={({ field: { onChange, onBlur, value } }) => {
                      return (
                        <InputElement
                          placeholder="邮递费用"
                          label="邮递费用*"
                          keyboardType="numeric"
                          value={value}
                          onChangeText={onChange}
                          errorMessage={errors?.customCarrierValue?.message}
                        />
                      );
                    }}
                    control={control}
                    rules={{ required: 'Please input customCarrierValue' }}
                    name="customCarrierValue"
                    defaultValue={emptyProduct.customCarrierValue}
                  />
                </Box>
              </Collapsible>
            </CardContainer>
          ) : (
            <></>
          )}

          <CardContainer>
            <TouchableOpacity
              onPress={() => {
                setCollapsedShipBox(prev => !prev);
              }}>
              <Box
                width="100%"
                flexDirection="row"
                justifyContent="space-between"
                paddingY="12px"
                paddingX="10px"
                overflow="hidden"
                backgroundColor={Colors.grey6}>
                <ProductInfoTitle>免费邮递*</ProductInfoTitle>
                <Icon
                  name={collapsedShipBox ? 'chevron-thin-down' : 'chevron-thin-up'}
                  size={20}
                  type="entypo"
                  color={Colors.grey3}
                  containerStyle={{ marginRight: 10, borderRadius: 20 }}
                />
              </Box>
            </TouchableOpacity>

            <Collapsible
              collapsed={collapsedShipBox}
              align="top"
              renderChildrenCollapsed={true}
              style={{}}>
              <Box width="100%" backgroundColor={Colors.white} paddingY="12px" paddingX="10px">
                <Controller
                  render={({ field: { value } }) => {
                    return (
                      <ShippingBoxSection
                        shippingBoxItems={shippingBoxes}
                        onSelectShippingBoxItem={id => {
                          setValue('shippingBox', id);
                        }}
                        activeShipBoxId={value}
                      />
                    );
                  }}
                  control={control}
                  rules={{ required: 'Please select shippingBox' }}
                  name="shippingBox"
                  defaultValue={emptyProduct.shippingBox}
                />
              </Box>
            </Collapsible>
          </CardContainer>
        </Box>
        <Box width="100%" paddingY="10px" backgroundColor={Colors.white} px="15px">
          <Button
            onPress={() => {}}
            buttonStyle={styles.saveDraftButton}
            titleStyle={styles.saveDraftButtonTitle}
            title="保存为草稿"
          />
          <Button
            onPress={handleSubmit(onAddProduct)}
            buttonStyle={styles.saveButton}
            titleStyle={styles.saveButtonTitle}
            title="保存"
          />
          <Button
            onPress={() => {}}
            buttonStyle={styles.deleteButton}
            titleStyle={styles.deleteButtonTitle}
            title="取消并删除"
          />
        </Box>
      </Content>

      <ActionSheet
        ref={ActionSheetRef}
        title="Add cover photo"
        options={constants.ImagePickerOptions.PHOTO_ACTIONS}
        cancelButtonIndex={constants.ImagePickerOptions.CANCEL_INDEX}
        destructiveButtonIndex={constants.ImagePickerOptions.DESTRUCTIVE_INDEX}
        onPress={index => {
          if (index === 0) {
            launchCamera(constants.Image_Options, response => {
              chooseAssetPhoto(response);
            });
          } else if (index === 1) {
            launchImageLibrary(constants.Image_Options, response => {
              chooseAssetPhoto(response);
            });
          }
        }}
      />
    </Container>
  );
};

export default ManageProduct;
const HeaderText = styled.Text`
  align-self: center;
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  font-weight: 400;
  letter-spacing: -0.41px;
  line-height: 22px;
`;
const BackButton = styled(TouchableOpacity)`
  padding-right: 5px;
`;
const DeleteButton = styled(TouchableOpacity)`
  padding-left: 5px;
`;
const DeleteButtonText = styled.Text`
  align-self: center;
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: 13px;
  font-weight: 400;
  line-height: 17px;
`;
const CardContainer = styled.View`
  background-color: ${Colors.white};
  border-radius: 8px;
  justify-content: center;
  margin-top: 10px;
  overflow: hidden;
  width: 100%;
`;
const ProductInfoTitle = styled.Text`
  align-self: center;
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
`;
const ProductItemTitle = styled.Text`
  align-self: flex-start;
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: 11px;
  font-weight: 400;
  line-height: 15px;
  margin-bottom: 10px;
  margin-top: 10px;
`;
const AssetContainer = styled.View`
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
const ShadowText = styled(Text)`
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
  elevation: 5;
`;
const HiddenText = styled.Text.attrs()`
  height: 0px;
  opacity: 0;
`;
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
const Divider = styled.View`
  background-color: ${Colors.grey4};
  height: 1px;
  margin-bottom: 5px;
  margin-top: 5px;
  width: 100%;
`;
