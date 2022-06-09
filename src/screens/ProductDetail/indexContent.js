import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, ActivityIndicator, Image, InteractionManager } from 'react-native';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

import { Box, HStack } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';

//= ==third party plugins=======
import { useDispatch } from 'react-redux';
import { useLazyQuery } from '@apollo/client';

import { Icon } from 'react-native-elements';
import { v4 as uuidv4 } from 'uuid';

import _ from 'lodash';

//= ==custom components & containers  =======
import { Content, Container, CheckoutAddressSection } from '@components';
import { AddressInputPanel } from '@containers';
//= ======selectors==========================

//= ======reducer actions====================

//= ======Query ====================

import { FETCH_PRODUCT_PREVIEWS } from '@modules/product/graphql';

//= =====hook data================================
import { useProduct } from '@data/useProduct';
import { useCart } from '@data/useCheckout';
import { useCheckoutInputContext } from '@contexts/CheckoutInputContext';
import { useSettingContext } from '@contexts/SettingContext';

//= =============utils==================================
import * as constants from '@utils/constant';
import { wp, hp, adjustFontSize } from '@src/common/responsive';

//= =============styles==================================
import { Colors } from '@theme';
import Images from '@assets/images';
import { styles } from './styles';

// import { StyleSheetFactory } from './styles';
import {
  ProductDetailHeader,
  ProductAssets,
  ProductInfo,
  AttributeVariationInfo,
  ReviewPanel,
  RatePanel,
  SellerProductList,
  AttributeInfo,
  BestProductList,
} from './components';
import { SelectAttributesPanel } from './containers';

// AssetType
//= =============images & constants ===============================
//= ============import end ====================
const faker = require('faker');

faker.locale = 'zh_CN';

const SELECT = 0,
  ADDCART = 1,
  BUY = 2;
const ProductDetail = ({ navigation, route }) => {
  //= ========Hook Init===========
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const deliveryRateListSheetRef = useRef(null);
  //  const { userCurrencyISO } = useUserSettings();
  const { userCurrencyISO, userLanguage } = useSettingContext();

  const selectAttributePanelSheetRef = useRef(null);
  const [action, setAction] = useState(SELECT);
  const { cart, clearCart, addProductToCart } = useCart();
  const snapPoints = useMemo(() => [0.1, '80%'], []);
  // const productId = route?.params?.productId;

  const productId = 'bc0ac246-6cf1-42ac-bb4e-f0c68bc7fbed';
  // const productId = '0a760a6e-37d2-46a6-b3dd-2f6e083dae07';
  const {
    isPossibleCheckout,
    updateCheckOutInput,
    clearCheckOutInput,
    checkoutOneItemInput,
    isPendingCalcRate,
  } = useCheckoutInputContext();
  // console.log('isPossibleCheckout', isPossibleCheckout);
  useEffect(() => {
    // clearCheckOutInput();
    return () => {};
  }, []);

  // console.log('checkOutInput', checkoutOneItemInput);
  const {
    loading: isFetchingProduct,
    error: fetchingProductError,
    product,
  } = useProduct({ productId });

  useEffect(() => {
    if (product) {
      const productInfo = {
        title: product?.title,
        description: product?.description,
      };
      updateCheckOutInput({ product: product?.id, productInfo });
    }

    return () => {};
  }, [product]);
  const productInfo = useMemo(() => {
    if (!product) {
      return {
        oldPrice: '0',
        price: '0',
        title: '',
      };
    } else {
      return {
        oldPrice: product?.oldPrice?.formatted,
        price: product?.price?.formatted,
        title: product?.title,
      };
    }
  }, [product]);
  const productQuantity = useMemo(() => {
    if (!product) {
      return 0;
    } else {
      return product?.quantity;
    }
  }, [product]);

  const attributes = useMemo(() => {
    return _.filter(product?.attrs || [], attr => {
      return attr?.variation && attr?.variation.length >= 0 && attr?.quantity > 0;
    });
  }, [product]);

  const attrAssets = useMemo(() => {
    return _.compact(
      _.map(attributes, item => {
        return item.asset;
      }),
    );
  }, [attributes]);

  const attrVariationInfo = useMemo(() => {
    let variationKeyList = []; // [color, size, weight]
    const variationKeyValPairMap = {}; // {color:['red,'green','blue'], size:['small','middle']};
    const variationValAttrIdPairMap = {}; // {red:[0,1,2],green:[0,1],small:[1.2]};
    const attrIDList = [];
    if (attributes) {
      _.map(attributes, attr => {
        const { id, variation } = attr;
        attrIDList.push(id);
        return _.map(variation, item => {
          if (!variationKeyList.includes(item.name)) {
            variationKeyList = _.concat(variationKeyList, item.name);
            variationKeyValPairMap[item.name] = [];
          }
          if (!variationKeyValPairMap[item.name].includes(item.value)) {
            variationKeyValPairMap[item.name].push(item.value);
            variationValAttrIdPairMap[item.value] = [];
          }
          if (!variationValAttrIdPairMap[item.value].includes(id)) {
            variationValAttrIdPairMap[item.value].push(id);
          }
        });
      });
    }
    return {
      variationKeyList,
      variationKeyValPairMap,
      variationValAttrIdPairMap,
      attrIDList,
    };
  }, [attributes]);
  const { variationKeyList, variationKeyValPairMap, variationValAttrIdPairMap, attrIDList } =
    attrVariationInfo;
  const sellerId = useMemo(() => {
    if (!product) {
      return null;
    } else {
      return product?.seller?.id;
    }
  }, [product]);

  useEffect(() => {
    if (product?.category?.id) {
      fetchBestReviewProducts();
    }
    return () => {};
  }, [product?.category?.id, fetchBestReviewProducts]);
  useEffect(() => {
    if (sellerId) {
      fetchSellerProducts();
    }
    return () => {};
  }, [fetchSellerProducts, sellerId]);

  //= ========= GraphQl query Section========
  const [fetchBestReviewProducts, { data: bestReviewProductsData }] = useLazyQuery(
    FETCH_PRODUCT_PREVIEWS,
    {
      fetchPolicy: 'network-only',
      variables: {
        // category: [product?.category?.id],
        skip: 0,
        limit: 10,
        feature: constants.ProductSortFeatures.SOLD,
        sort: constants.SortTypeEnum.DESC,
        currency: userCurrencyISO,
        language: userLanguage,
      },
    },
  );
  const [fetchSellerProducts, { data: sellerProductsData }] = useLazyQuery(FETCH_PRODUCT_PREVIEWS, {
    fetchPolicy: 'network-only',
    variables: {
      sellers: [sellerId],
      skip: 0,
      limit: 9,
      currency: userCurrencyISO,
      language: userLanguage,
    },
  });
  /* const deliveryRate = useMemo(() => {
        if (!deliveryRatesData) {
            return null;
        } else {
            return deliveryRatesData?.calculateDeliveryRates[0];
        }
    }, [deliveryRatesData]); */
  const sellerProductList = useMemo(() => {
    if (!sellerProductsData) {
      return [];
    } else {
      return sellerProductsData?.products?.collection;
    }
  }, [sellerProductsData]);
  const bestReviewProductList = useMemo(() => {
    if (!bestReviewProductsData) {
      return [];
    } else {
      return bestReviewProductsData?.products?.collection;
    }
  }, [bestReviewProductsData]);

  //= ========= Use Effect Section========
  const onPressChangeAddress = () => {
    InteractionManager.runAfterInteractions(() => {
      deliveryRateListSheetRef.current?.expand();
    });
  };

  const onOpenSelectAttributePanel = () => {
    InteractionManager.runAfterInteractions(() => {
      if (productQuantity === 0) {
        console.log('disabled');
      } else {
        setAction(SELECT);
        selectAttributePanelSheetRef.current.expand();
      }
    });
  };
  const onSelectAttribute = id => {
    selectAttributePanelSheetRef.current.close();
  };
  const onNavigateCheckOut = () => {
    // clearCart();
    navigation.navigate('CheckoutOneTime');
  };
  const onCallAddProductOnCart = () => {
    addProductToCart();
  };
  const onCheckOutOneItem = () => {
    if (productQuantity === 0) {
      console.log('disabled');
    } else {
      setAction(BUY);
      selectAttributePanelSheetRef.current.expand();
    }

    /* if (!isPendingCalcRate) {
            if (isPossibleCheckout) {
                onNavigateCheckOut();
            } else {
                setAction(BUY);
                selectAttributePanelSheetRef.current.expand();
            }
        } */
  };

  const onAddProductOnCart = () => {
    if (productQuantity === 0) {
      console.log('disabled');
    } else {
      setAction(ADDCART);
      selectAttributePanelSheetRef.current.expand();
    }

    /* if (!isPendingCalcRate) {
            if (isPossibleCheckout) {
                onCallAddProductOnCart();
            } else {
                setAction(ADDCART);
                selectAttributePanelSheetRef.current.expand();
            }
        } */
  };

  if (isFetchingProduct || fetchingProductError) {
    return (
      <Container style={styles.container}>
        <ProductDetailHeader />
        <Content style={{ flex: 0 }} contentContainerStyle={{ flex: 1 }}>
          <ActivityIndicator color="black" size="large" style={{ flex: 1, alignSelf: 'center' }} />
        </Content>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <ProductDetailHeader />

        <Content
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          contentContainerStyle={styles.contentContainerStyle}
          style={styles.contentView}>
          <ProductAssets assets={product?.assets || []} />
          {/* <AttributeOptionPanel /> */}
          <Box
            width="100%"
            backgroundColor={Colors.white}
            paddingX={`${wp(28.4)}px`}
            paddingY={`${hp(12.5)}px`}
            marginBottom={`${hp(10.28)}px`}>
            <ProductInfo productInfo={productInfo} />
          </Box>
          <Box
            width="100%"
            backgroundColor={Colors.white}
            paddingX={`${wp(28.4)}px`}
            paddingY={`${hp(12.5)}px`}
            marginBottom={`${hp(10.28)}px`}>
            <AddressInputPanel />
          </Box>

          {/* <Box
            width="100%"
            backgroundColor={Colors.white}
            paddingX={`${wp(28.4)}px`}
            paddingY={`${hp(12.5)}px`}
            marginBottom={`${hp(10.28)}px`}>
            <CheckoutAddressSection
              isDeliveryAddress={true}
              onPressChangeAddress={onPressChangeAddress}
            />
          </Box>
          <Box
            width="100%"
            backgroundColor={Colors.white}
            paddingX={`${wp(28.4)}px`}
            paddingY={`${hp(12.5)}px`}
            marginBottom={`${hp(10.28)}px`}>
            <CheckoutAddressSection
              isDeliveryAddress={false}
              onPressChangeAddress={onPressChangeAddress}
            />
          </Box>
          */}
          <Box
            width="100%"
            backgroundColor={Colors.white}
            paddingX={`${wp(28.4)}px`}
            paddingY={`${hp(12.5)}px`}
            marginBottom={`${hp(10.28)}px`}>
            <AttributeVariationInfo
              variationKeyList={variationKeyList}
              attrAssets={attrAssets}
              attrsSum={product?.attrs?.length || 0}
              onOpenSelectAttributePanel={onOpenSelectAttributePanel}
            />
          </Box>
          <Box
            width="100%"
            backgroundColor={Colors.white}
            paddingX={`${wp(28.4)}px`}
            paddingY={`${hp(12.5)}px`}
            marginBottom={`${hp(10.28)}px`}>
            <ReviewPanel />
          </Box>
          <Box
            width="100%"
            backgroundColor={Colors.white}
            paddingX={`${wp(10)}px`}
            paddingY={`${hp(12.5)}px`}
            marginBottom={`${hp(10.28)}px`}>
            <RatePanel rateScore={product?.rating?.average || 0} />
            <SellerProductList products={sellerProductList} />
          </Box>
          <Box width="100%" marginBottom={`${hp(10.28)}px`}>
            <Box flexDirection="row" width="100%" justifyContent="space-around" alignItems="center">
              <HalfDivider />
              <SectionTitle>{t('productDetail:product details')}</SectionTitle>
              <HalfDivider />
            </Box>

            <Box
              width="100%"
              backgroundColor={Colors.white}
              paddingX={`${wp(10)}px`}
              paddingY={`${hp(12.5)}px`}
              marginTop={`${hp(10.28)}px`}>
              <AttributeInfo
                attrAssets={attrAssets}
                brand={product?.brand?.name || ''}
                variationInfo={variationKeyValPairMap}
              />
            </Box>
          </Box>
          <Box width="100%" marginBottom={`${hp(10.28)}px`}>
            <Box flexDirection="row" width="100%" justifyContent="space-around" alignItems="center">
              <HalfDivider />
              <SectionTitle>{t('productDetail:Popular View Products')}</SectionTitle>
              <HalfDivider />
            </Box>

            <Box
              width="100%"
              paddingX={`${wp(10)}px`}
              paddingY={`${hp(12.5)}px`}
              marginTop={`${hp(10.28)}px`}>
              <BestProductList products={bestReviewProductList} />
            </Box>
          </Box>
        </Content>

        <HStack
          paddingY={`${hp(10)}px`}
          paddingX={`${wp(16)}px`}
          justifyContent="space-between"
          backgroundColor={Colors.white}>
          <HStack flexGrow={1} justifyContent="space-evenly">
            <BottomMenuButton>
              <Image source={Images.shopHomeImg} />
              <BottomMenuText>{t('productDetail:Into the store')}</BottomMenuText>
            </BottomMenuButton>
            <BottomMenuButton>
              <Image source={Images.messageImg} />
              <BottomMenuText>{t('productDetail:Contact the shopkeeper')}</BottomMenuText>
            </BottomMenuButton>
            <BottomMenuButton>
              <Image source={Images.startImg} />
              <BottomMenuText>{t('productDetail:Favorites')}</BottomMenuText>
            </BottomMenuButton>
          </HStack>

          <HStack>
            <AddCartButton onPress={onAddProductOnCart}>
              <CheckoutButtonText>{t('checkout:add to Shopping Cart')}</CheckoutButtonText>
            </AddCartButton>
            <BuyButton onPress={onCheckOutOneItem}>
              <CheckoutButtonText> {t('checkout:Buy now')}</CheckoutButtonText>
            </BuyButton>
          </HStack>
        </HStack>
        <ExplanationContainer>
          <ExplanationIconGradient>
            <Icon
              name="chevron-double-right"
              type="material-community"
              color={Colors.white}
              size={18}
            />
          </ExplanationIconGradient>
          <ExplanationText>{t('productDetail:See explanation')}</ExplanationText>
        </ExplanationContainer>
      </Container>
      <BottomSheet
        ref={selectAttributePanelSheetRef}
        snapPoints={snapPoints}
        index={0}
        enablePanDownToClose={true}
        // animateOnMount={true}
        backdropComponent={backdropProps => (
          <BottomSheetBackdrop {...backdropProps} enableTouchThrough={true} />
        )}
        backgroundComponent={({ style }) => (
          <View
            style={[
              {
                backgroundColor: 'white',
                borderRadius: 0,
              },
              { ...style },
            ]}
          />
        )}
        handleComponent={null}
        enableOverDrag={false}
        enableHandlePanningGesture={false}
        enableContentPanningGesture={false}
        style={{
          shadowColor: Colors.black,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.18,
          shadowRadius: 4,
          elevation: 5,
          zIndex: 50,
        }}>
        {productQuantity > 0 ? (
          <SelectAttributesPanel
            attributes={attributes}
            productInfo={{
              price: product?.price?.formatted || '0',
              quantity: productQuantity,
              thumbnail: product?.thumbnail || (product?.assets && product?.assets[0]) || null,
            }}
            attrVariationInfo={attrVariationInfo}
            onSelectAttribute={onSelectAttribute}
            onClosePanel={() => {
              selectAttributePanelSheetRef.current?.close();
            }}
            checkoutOneItemInput={checkoutOneItemInput}
            onNavigateCheckOut={onNavigateCheckOut}
            onCallAddProductOnCart={onCallAddProductOnCart}
            isPendingCalcRate={isPendingCalcRate}
            isPossibleCheckout={isPossibleCheckout}
            action={action}
          />
        ) : null}
      </BottomSheet>
    </>
  );
};

export default ProductDetail;
const ExplanationContainer = styled.TouchableOpacity`
  //z-index: 20;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
  border-color: rgba(130, 130, 130, 0.5);
  border-radius: ${wp(13)}px;
  border-width: 1px;
  height: ${hp(59.75)}px;
  justify-content: space-evenly;
  position: absolute;
  right: ${wp(16.01)}px;
  top: ${hp(122.87)}px;
  width: ${wp(48.3)}px;
`;
const ExplanationIconGradient = styled(LinearGradient).attrs({
  colors: [Colors.replyRed1, Colors.replyRed2],
  start: { x: 0, y: 1 },
  end: { x: 1, y: 1 },
})`
  width: ${wp(22.46)}px;
  height: ${wp(22.46)}px;
  border-radius: ${wp(11.23)}px;
  align-items: center;
  justify-content: center;
`;
const ExplanationText = styled.Text`
  align-self: center;
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(8)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(14.12)}px;
  text-align: center;
`;
const HalfDivider = styled.View`
  background-color: ${Colors.grey5};
  border-color: ${Colors.grey5};
  border-width: 1px;

  height: 1px;
  width: ${wp(117.17)}px;
`;
const SectionTitle = styled.Text`
  align-self: center;
  color: ${Colors.grey3};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(11)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(19.41)}px;
  text-align: center;
`;

const AddCartButton = styled.TouchableOpacity`
  align-items: center;
  background-color: ${Colors.yellow};
  border-bottom-left-radius: 20px;
  border-top-left-radius: 20px;
  padding: 9px 17px 9px 17px;
`;
const BuyButton = styled(AddCartButton)`
  background-color: ${Colors.signUpStepRed};
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 20px;
  border-top-left-radius: 0px;
  border-top-right-radius: 20px;
`;
const CheckoutButtonText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
`;
const BottomMenuText = styled.Text`
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(10)}px;
  font-style: normal;
  font-weight: 400;
  line-height: ${adjustFontSize(17.65)}px;
`;
const BottomMenuButton = styled.TouchableOpacity`
  align-items: center;
`;
