import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Keyboard, Alert, View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useUserSettings } from '@data/useUser';

//= ==third party plugins=======
import { useDispatch } from 'react-redux';

import { Icon } from 'react-native-elements';
import { Box } from 'native-base';
import { useTranslation } from 'react-i18next';
import Spinner from 'react-native-loading-spinner-overlay';

import _ from 'lodash';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useMutation } from '@apollo/client';

//= ==custom components & containers  =======
import { Content, Container, JitengHeaderContainer } from '@components';
import { PaymentProviderPanel } from '@containers';

//= ======selectors==========================

//= ======reducer actions====================
//= =====hook data================================
import { usePaymentMethods } from '@data/useCheckout';
//= ==========Context=======================
import { useCartContext } from '@contexts/CartContext';
import { usePaymentMethodsContext } from '@contexts/PaymentMethodsContext';

//= =============utils==================================
import * as constants from '@utils/constant';
//= ==========query=======================
import { CHECKOUT_CART } from '@modules/checkout/graphql';
//= =============styles==================================
import { Colors } from '@theme';
import { wp, hp, adjustFontSize } from '@src/common/responsive';
import { styles } from './styles';
import { CartItem } from './containers';

// import { StyleSheetFactory } from './styles';

// AssetType
//= =============images & constants ===============================
//= ============import end ====================

const Cart = ({ navigation, route }) => {
  //= ========Hook Init===========
  const { t, i18n } = useTranslation();
  const {
    cart,
    updateCartItem,
    clearCart,
    deleteCartItem,
    selectCartItems,
    fetchCarts,
    callCheckoutCart,
  } = useCartContext();
  const { userCurrencySymbol } = useUserSettings();
  const { items } = cart;
  const dispatch = useDispatch();
  const keyExtractor = useCallback(item => item?.id, []);
  const snapPoints = useMemo(() => [0.1, '75%'], []);

  const paymentProviderPanelRef = useRef(null);
  const { checkoutProcessing } = usePaymentMethodsContext();
  //= ========= Props Section========
  //= ======== State Section========
  const [selectedIds, setSelectedIds] = useState([]);
  const [isAllSet, setIsAllSet] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [enableManage, setEnableManage] = useState(false);

  const allIds = useMemo(() => {
    return _.map(items, item => item?.id);
  }, [items]);

  //= ========= GraphQl query Section========
  //= ========= Use Effect Section========
  const onToggleItem = useCallback(
    id => {
      const existIndex = _.findIndex(selectedIds, item => item === id);
      if (existIndex === -1) {
        setSelectedIds(prev => _.concat(prev, id));
      } else {
        setSelectedIds(prev => _.filter(prev, item => item !== id));
      }
    },
    [selectedIds],
  );
  const onCallUpdateCartItem = useCallback((id, updatedQuantity) => {
    updateCartItem({ id, updatedQuantity });
  }, []);
  const onToggleAllSet = () => {
    setIsAllSet(prev => !prev);
  };
  useEffect(() => {
    if (isAllSet) {
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
    return () => {};
  }, [allIds, isAllSet]);
  const sumPrice = useMemo(() => {
    const selectedItems = _.filter(items, item => {
      const exist = _.findIndex(selectedIds, id => id === item?.id);
      return exist !== -1;
    });
    const totalCostAmount = _.reduce(
      selectedItems,
      function (result, item) {
        return result + item?.total?.amount;
      },
      0,
    );
    return userCurrencySymbol + (totalCostAmount / 100).toFixed(2);
  }, [items, selectedIds, userCurrencySymbol]);
  const renderItem = useCallback(
    ({ item, index }) => {
      const isSelected = !!(_.findIndex(selectedIds, id => id === item?.id) !== -1);
      return (
        <CartItem
          cartItem={item}
          isSelected={isSelected}
          onPressItem={onToggleItem}
          onCallUpdateCartItem={onCallUpdateCartItem}
        />
      );
    },
    [selectedIds],
  );
  const onCallCheckOutCart = async () => {
    paymentProviderPanelRef.current?.expand();
  };
  const onDeleteItems = async () => {
    try {
      // selectedIds
      await Promise.all(
        _.map(selectedIds, async id => {
          await deleteCartItem(id);
        }),
      );
    } catch (error) {}
  };
  const onCallRemove = () => {
    if (!isAllSet) {
      onDeleteItems();
    } else {
      clearCart();
    }
  };
  const onCallCheckout = async data => {
    Keyboard.dismiss();
    paymentProviderPanelRef.current?.close();
    const { provider } = data;

    try {
      setIsPending(true);
      await selectCartItems(selectedIds);
      const checkoutCart = await callCheckoutCart(provider);
      const { paymentClientSecret, publishableKey, id: purchaseOrderId, total } = checkoutCart;
      const checkoutResult = await checkoutProcessing({
        paymentClientSecret,
        provider,
        publishableKey,
        data,
      });
      if (checkoutResult) {
        fetchCarts();
        navigation.reset({
          index: 0,
          routes: [
            { name: 'CheckoutComplete', params: { purchaseOrderId, totalCost: total.formatted } },
          ],
        });
      }
    } catch (e) {
      console.log('checkout error', e?.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <Container>
        <JitengHeaderContainer>
          <Box
            paddingX="15px"
            width="100%"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon name="chevron-thin-left" type="entypo" color={Colors.white} size={wp(20)} />
            </TouchableOpacity>

            <TitleText>
              {t('cart:shopping cart')}
              <SubTitleText>{`(${items?.length}${t('common:Pieces')}${t(
                'common:commodity',
              )})`}</SubTitleText>
            </TitleText>
            <ManageButton
              enabled={enableManage}
              onPress={() => {
                setEnableManage(prev => !prev);
              }}>
              <ManageButtonText enabled={enableManage}>{t('common:delete')}</ManageButtonText>
              {enableManage ? (
                <Icon name="close" type="antdesign" color={Colors.brandRed} size={wp(12)} />
              ) : null}
            </ManageButton>
          </Box>
        </JitengHeaderContainer>
        <Content
          contentContainerStyle={styles.contentContainerStyle}
          style={styles.contentView}
          isList={true}
          data={items}
          // extraData={items.length}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
        />
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          paddingY="9px"
          paddingX="12px"
          backgroundColor={Colors.white}>
          <AllSetButton onPress={onToggleAllSet}>
            <Icon
              name={isAllSet ? 'check-circle' : 'checkbox-blank-circle-outline'}
              type="material-community"
              color={isAllSet ? Colors.discountPrice : Colors.grey3}
              size={wp(22)}
            />
            <AllSetText>{t('common:select all')}</AllSetText>
          </AllSetButton>
          <Box flexDirection="row">
            <Box alignItems="center" marginRight="10px" flexDirection="row">
              <TotalSumText>{`${t('checkout:TotalSum')}:`}</TotalSumText>
              <TotalCostText>{sumPrice}</TotalCostText>
            </Box>
            <CheckoutButton onPress={onCallCheckOutCart} disabled={selectedIds.length === 0}>
              <CheckoutButtonText>{t('common:Settlement')}</CheckoutButtonText>
            </CheckoutButton>
            {enableManage ? (
              <DeleteButton onPress={onCallRemove} disabled={selectedIds.length === 0}>
                <DeleteButtonText disabled={selectedIds.length === 0}>
                  {t('common:Settlement')}
                </DeleteButtonText>
              </DeleteButton>
            ) : null}
          </Box>
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

export default Cart;
const TitleText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 15px;
  font-weight: 400;
  line-height: 20px;
`;
const SubTitleText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
`;
const CheckoutButton = styled.TouchableOpacity`
  background-color: ${props => (props.disabled ? Colors.grey13 : Colors.signUpStepRed)};
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
const AllSetButton = styled.TouchableOpacity`
  align-items: center;
  flex-direction: row;
`;
const AllSetText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-weight: 400;
  line-height: 22px;
  margin-left: 7px;
`;
const TotalSumText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-weight: 400;
  line-height: 22px;
`;
const TotalCostText = styled.Text`
  color: ${Colors.priceRed};
  font-family: 'Microsoft YaHei';
  font-size: 11px;
  font-weight: 400;
  line-height: 15px;
`;
const ManageButton = styled.TouchableOpacity`
  align-items: center;
  background-color: ${props => (props.enabled ? Colors.white : Colors.brandRed)};
  border-color: ${Colors.white};
  border-radius: 10px;
  border-width: 1px;
  flex-direction: row;
  height: ${hp(29)}px;
  justify-content: center;
  width: ${wp(54)}px;
`;
const ManageButtonText = styled(TitleText)`
  color: ${props => (props.enabled ? Colors.brandRed : Colors.white)};
  font-size: ${adjustFontSize(13)}px;
  line-height: ${adjustFontSize(17)}px;
`;

const DeleteButton = styled.TouchableOpacity`
  background-color: ${props => (props.disabled ? Colors.grey13 : Colors.white)};
  border-color: ${props => (props.disabled ? Colors.grey13 : Colors.brandRed)};
  border-radius: 20px;
  border-width: 1px;
  justify-content: center;
  margin-left: 5px;
  padding: 10px 28px 10px 28px;
`;
const DeleteButtonText = styled.Text`
  color: ${props => (props.disabled ? Colors.grey2 : Colors.brandRed)};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
`;
