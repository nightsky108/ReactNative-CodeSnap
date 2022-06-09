import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Keyboard, Alert, Linking } from 'react-native';
import getSymbolFromCurrency from 'currency-symbol-map';
import Spinner from 'react-native-loading-spinner-overlay';
import _ from 'lodash';
//= ==third party plugins=======
import { setCheckOutOneItemInput, clearCheckOutOneItemInput } from '@modules/checkout/slice';
// import Alipay from '@uiw/react-native-alipay';

import { useDispatch } from 'react-redux';
import { Box } from 'native-base';
import { useTranslation } from 'react-i18next';

import { Icon } from 'react-native-elements';
import { useMutation } from '@apollo/client';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

//= ==custom components & containers  =======
import { Content, Container, JitengHeaderContainer, CheckoutAddressSection } from '@components';
import { PaymentProviderPanel } from '@containers';
//= ======selectors==========================

//= ======reducer actions====================

//= ==========query=======================
import { CHECKOUT_ONE_PRODUCT } from '@modules/checkout/graphql';

//= =====hook data================================
import { useUserSettings } from '@data/useUser';
import { useAddressContext } from '@contexts/AddressContext';

import { usePaymentMethods } from '@data/useCheckout';
import { usePaymentMethodsContext } from '@contexts/PaymentMethodsContext';

import { wp, hp, adjustFontSize } from '@src/common/responsive';
import { useCheckoutInputContext } from '@contexts/CheckoutInputContext';

//= =============utils==================================
import styled from 'styled-components/native';

//= =============styles==================================
import { Colors } from '@theme';
import * as constants from '@utils/constant';
import { CheckoutItem } from './containers';
import { styles } from './styles';

const CheckoutOneTime = ({ navigation, route }) => {
  //= ========Hook Init===========
  const dispatch = useDispatch();
  const snapPoints = useMemo(() => [0.1, '75%'], []);

  const paymentProviderPanelRef = useRef(null);
  const { t, i18n } = useTranslation();
  const { userCurrencyISO } = useUserSettings();
  const { checkoutProcessing } = usePaymentMethodsContext();

  const { activeDeliveryAddressId, activeBillingAddressId } = useAddressContext();
  const { updateCheckOutInput, checkoutOneItemInput } = useCheckoutInputContext();

  const {
    product: productId,
    productAttribute,
    quantity,
    deliveryRate,
    attributeInfo,
    productInfo: product,
  } = checkoutOneItemInput;

  const [proceedCheckoutOneItem] = useMutation(CHECKOUT_ONE_PRODUCT);
  const productInfo = useMemo(() => {
    return {
      ...attributeInfo,
      title: product?.title,
      description: product?.description,
    };
  }, [attributeInfo, product?.description, product?.title]);
  const { price, quantity: sumQuantity } = productInfo;

  const sumPrice = useMemo(() => {
    if (!deliveryRate) {
      return `${getSymbolFromCurrency(price?.currency)}0.00`;
    }
    const { amount } = deliveryRate;
    return (
      getSymbolFromCurrency(price?.currency) +
      ((price?.amount * quantity + amount?.amount) / 100).toFixed(2)
    );
  }, [price?.currency, price?.amount, quantity, deliveryRate]);
  const [isPending, setIsPending] = useState(false);

  const onCallCheckOutOneProduct = async () => {
    paymentProviderPanelRef.current?.expand();
  };
  /*  */
  const onCallCheckout = async data => {
    Keyboard.dismiss();
    paymentProviderPanelRef.current?.close();
    const { provider } = data;

    try {
      setIsPending(true);
      const {
        data: { checkoutOneProduct },
      } = await proceedCheckoutOneItem({
        variables: {
          deliveryRate: deliveryRate?.id,
          product: productId,
          productAttribute,
          quantity,
          provider,
          billingAddress: activeBillingAddressId || activeDeliveryAddressId,
          currency: userCurrencyISO,
        },
      });
      const {
        paymentClientSecret,
        publishableKey,
        id: purchaseOrderId,
        total,
      } = checkoutOneProduct;

      const checkoutResult = await checkoutProcessing({
        paymentClientSecret,
        provider,
        publishableKey,
        data,
      });
      if (checkoutResult) {
        dispatch(clearCheckOutOneItemInput());
        navigation.reset({
          index: 0,
          routes: [
            { name: 'CheckoutComplete', params: { purchaseOrderId, totalCost: total.formatted } },
          ],
        });
      }
    } catch (e) {
      Alert.alert(`Error`, e?.message);
      console.log('checkout error', e?.message);
    } finally {
      setIsPending(false);
    }
  };

  //= ========= Props Section========
  //= ======== State Section========

  //= ========= GraphQl query Section========
  //= ========= Use Effect Section========
  const handleDeepLink = async url => {
    // if (url) {
    console.log('handleDeepLink url', url);
    // }
  };

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      handleDeepLink(initialUrl);
    };
    getUrlAsync();

    const urlCallback = event => {
      handleDeepLink(event.url);
    };
    Linking.addEventListener('url', urlCallback);
    return () => Linking.removeEventListener('url', urlCallback);
  }, []);
  return (
    <>
      <Container>
        <JitengHeaderContainer>
          <Box flexDirection="row" width="100%" height={`${hp(44)}px`} alignItems="center">
            <IconButton
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon name="chevron-thin-left" type="entypo" color={Colors.white} size={wp(22)} />
              <IconText>{t('common:Confirm Order')}</IconText>
            </IconButton>
          </Box>
        </JitengHeaderContainer>
        <Content contentContainerStyle={styles.contentContainerStyle} style={styles.contentView}>
          <CheckoutItem
            checkoutOneItemInput={checkoutOneItemInput}
            updateCheckOutInput={updateCheckOutInput}
            productInfo={productInfo}
          />
          <Box
            py={`${hp(17)}px`}
            px={`${wp(13)}px`}
            marginTop={`${hp(12)}px`}
            width="100%"
            backgroundColor={Colors.white}
            borderRadius="11px">
            <CheckoutAddressSection isDeliveryAddress={true} />
          </Box>
          <Box
            py={`${hp(17)}px`}
            px={`${wp(13)}px`}
            marginTop={`${hp(12)}px`}
            width="100%"
            backgroundColor={Colors.white}
            borderRadius="11px">
            <CheckoutAddressSection isDeliveryAddress={false} />
          </Box>
        </Content>
        <Box
          flexDirection="row"
          justifyContent="flex-end"
          paddingY="9px"
          paddingX="12px"
          backgroundColor={Colors.white}>
          <Box alignSelf="center" marginRight="10px">
            <SumQuantityInfo>
              {`共${quantity}件 `}
              <ConstTitle>
                {`${t('checkout:TotalSum')}: `}
                <ConstInfo>{sumPrice}</ConstInfo>
              </ConstTitle>
            </SumQuantityInfo>
          </Box>

          <CheckoutButton onPress={onCallCheckOutOneProduct}>
            <CheckoutButtonText>{t('payment:To pay')}</CheckoutButtonText>
          </CheckoutButton>
        </Box>
        <Spinner visible={isPending} textContent="One moment..." textStyle={{ color: '#fff' }} />
      </Container>
      <BottomSheet
        ref={paymentProviderPanelRef}
        snapPoints={snapPoints}
        index={0}
        enablePanDownToClose={true}
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
        onClose={() => {
          Keyboard.dismiss();
        }}
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
        <PaymentProviderPanel
          onClosePanel={() => {
            paymentProviderPanelRef.current?.close();
          }}
          onSelectProvider={onCallCheckout}
          sumPrice={sumPrice}
        />
      </BottomSheet>
    </>
  );
};
const IconText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
`;
const IconButton = styled.TouchableOpacity`
  flex-direction: row;
  margin-left: 5px;
  margin-right: 5px; ;
`;
const CheckoutButton = styled.TouchableOpacity`
  background-color: ${Colors.signUpStepRed};
  border-radius: 20px;
  padding: 10px 28px 10px 28px;
`;
const CheckoutButtonText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
`;
const SumQuantityInfo = styled.Text`
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(10)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(17.65)}px;
  margin-bottom: 5px;
  margin-top: 5px;
`;
const ConstTitle = styled.Text`
  color: ${Colors.grey1};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(10)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(17.65)}px;
`;
const ConstInfo = styled.Text`
  color: ${Colors.discountPrice};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(10)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(17.65)}px;
`;
export default CheckoutOneTime;
