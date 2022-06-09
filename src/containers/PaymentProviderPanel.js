import React, { useState, useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Box } from 'native-base';
import { Icon, ListItem } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import DropDownPicker from 'react-native-dropdown-picker';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';

import { wp, hp, adjustFontSize } from '@src/common/responsive';
import { StripeCard } from '@components';
import { Colors } from '@theme';
import * as constants from '@utils/constant';
import Images from '@assets/images';
import { ScrollView } from 'react-native-gesture-handler';
import { usePaymentMethods } from '@data/useCheckout';
import { usePaymentMethodsContext } from '@contexts/PaymentMethodsContext';

import _ from 'lodash';

const EDIT_CARD_ACTION = 'EditCardAction';
const ADD_CARD_ACTION = 'AddCardAction';

const PaymentProviderPanel = ({
  onSelectProvider,
  onClosePanel,
  checkoutProc,
  checkOutWithExistingCard,
  sumPrice,
}) => {
  //= ======== State Section========
  const { t, i18n } = useTranslation();
  const stripeCardRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const { paymentMethods, deleteCard } = usePaymentMethodsContext();
  const [activeProvider, setActiveProvider] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const [cardAction, setCardAction] = useState(null);

  const [activeExistCardSection, setActiveExistCardSection] = useState(false);
  const onSetProvider = (val, action) => {
    setActiveProvider(val);
    setCardAction(action);
  };
  const updateEnabledStatus = value => {};
  useEffect(() => {
    if (paymentMethods.length > 0) {
      setSelectedCardId(paymentMethods[0].id);
    }

    return () => {};
  }, [paymentMethods]);

  const checkOutWithNewCard = data => {
    onSelectProvider({
      provider: constants.PaymentMethodProviders.UnionPay,
      card: data,
    });
    onSetProvider(null);
  };
  const checkOutWithUpdatedCard = data => {
    onSelectProvider({
      provider: constants.PaymentMethodProviders.UnionPay,
      card: data,
      isUpdated: true,
    });
    onSetProvider(null);
    setActiveExistCardSection(false);
  };
  const callDeleteCard = async id => {
    try {
      setIsPending(true);
      await deleteCard({ id, provider: constants.PaymentMethodProviders.Stripe });
      setIsPending(false);
    } catch (error) {
      setIsPending(false);
    }
  };
  useEffect(() => {
    if (activeExistCardSection) {
      onSetProvider(constants.PaymentMethodProviders.UnionPay);
    } else {
      onSetProvider(null);
    }
    return () => {};
  }, [activeExistCardSection]);
  const selectedCard = useMemo(() => {
    const payMethod = _.findLast(paymentMethods, method => method.id === selectedCardId);
    return { ...payMethod?.card, payMethodId: payMethod?.id };
  }, [paymentMethods, selectedCardId]);
  const isSelectedAddCardItem = useMemo(() => {
    return (
      activeProvider === constants.PaymentMethodProviders.UnionPay && cardAction === ADD_CARD_ACTION
    );
  }, [activeProvider, cardAction]);
  const isSelectedEditCardItem = useMemo(() => {
    return (
      activeProvider === constants.PaymentMethodProviders.UnionPay &&
      cardAction === EDIT_CARD_ACTION
    );
  }, [activeProvider, cardAction]);
  const callPayment = () => {
    if (activeProvider === constants.PaymentMethodProviders.UnionPay) {
      if (cardAction === ADD_CARD_ACTION) {
        stripeCardRef.current?.callCheckoutWithNewCard();
      } else if (cardAction === EDIT_CARD_ACTION) {
        stripeCardRef.current?.callCheckoutWithUpdatedCard();
      } else {
        onSelectProvider({
          provider: constants.PaymentMethodProviders.Stripe,
          card: {
            cardNumber: selectedCard.number,
            expiryMonth: selectedCard.exp_month,
            expiryYear: selectedCard.exp_year,
            CVC: selectedCard.cvc,
            cardholder: selectedCard.name,
          },
          usingExistCard: true,
        });
      }
    } else {
      onSelectProvider({
        provider: activeProvider,
      });
    }
  };
  return (
    <Box py={`${hp(17)}px`} px={`${wp(13)}px`} width="100%" flex={1}>
      <Box width="100%" justifyContent="space-between" flexDirection="row">
        <Box />
        <TitleText>{t('payment:Choice of payment method')}</TitleText>
        <Icon
          name="close"
          type="antdesign"
          color={Colors.grey4}
          size={wp(22)}
          onPress={onClosePanel}
        />
      </Box>
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <ListItem
          onPress={() => {
            setActiveExistCardSection(prev => !prev);
          }}>
          <IconImg source={Images.unionpayImg} />
          <ListItem.Content>
            <Box flexDirection="row" alignItems="center">
              <ItemTitleText>{t('payment:Credit card')}</ItemTitleText>
              <ItemSubTitleText>{t('payment:May include handling fees')}</ItemSubTitleText>
            </Box>
          </ListItem.Content>
          <Box flexDirection="row" alignItems="center">
            <Icon
              name={activeExistCardSection ? 'check-circle' : 'checkbox-blank-circle-outline'}
              type="material-community"
              color={activeExistCardSection ? Colors.discountPrice : Colors.grey3}
              size={wp(22)}
            />
          </Box>
        </ListItem>
        {activeExistCardSection ? (
          <>
            <Box flexDirection="row" width="100%" justifyContent="space-around" alignItems="center">
              <DropDownPicker
                open={open}
                value={selectedCardId}
                items={paymentMethods}
                setOpen={setOpen}
                setValue={setSelectedCardId}
                itemKey="id"
                listMode="SCROLLVIEW"
                scrollViewProps={{
                  nestedScrollEnabled: true,
                }}
                schema={{
                  label: 'name',
                  value: 'id',
                }}
                containerStyle={{
                  width: '80%',
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  if (isSelectedEditCardItem) {
                    setCardAction(null);
                  } else {
                    setCardAction(EDIT_CARD_ACTION);
                  }
                }}>
                <Icon name="pencil" type="material-community" color={Colors.grey3} />
              </TouchableOpacity>
            </Box>

            {isSelectedEditCardItem ? (
              <StripeCard
                ref={stripeCardRef}
                updateEnabledStatus={updateEnabledStatus}
                checkOutWithNewCard={checkOutWithNewCard}
                checkOutWithUpdatedCard={checkOutWithUpdatedCard}
                deleteCard={callDeleteCard}
                isEdit={true}
                disable={isPending}
                card={selectedCard}
              />
            ) : null}
          </>
        ) : null}
        <Box borderBottomColor={Colors.grey6} borderBottomWidth="1px">
          <ListItem
            onPress={() => {
              if (isSelectedAddCardItem) {
                onSetProvider(null);
              } else {
                onSetProvider(constants.PaymentMethodProviders.UnionPay, ADD_CARD_ACTION);
              }
              setActiveExistCardSection(false);
            }}>
            <IconImg source={Images.plusBagImg} />
            <ListItem.Content>
              <ItemTitleText>{t('payment:Use a new credit card')}</ItemTitleText>
            </ListItem.Content>
            <Box flexDirection="row" alignItems="center">
              <Icon
                name={isSelectedAddCardItem ? 'up' : 'down'}
                type="antdesign"
                color={Colors.grey3}
                size={adjustFontSize(20)}
              />
            </Box>
          </ListItem>
          {isSelectedAddCardItem ? (
            <StripeCard
              ref={stripeCardRef}
              updateEnabledStatus={updateEnabledStatus}
              checkOutWithNewCard={checkOutWithNewCard}
            />
          ) : null}
        </Box>

        <ListItem
          bottomDivider
          onPress={() => {
            onSetProvider(constants.PaymentMethodProviders.Alipay);
            setActiveExistCardSection(false);
          }}>
          <IconImg source={Images.alipayImg} />
          <ListItem.Content>
            <Box flexDirection="row" alignItems="center">
              <ItemTitleText>{t('payment:Alipay')}</ItemTitleText>
              <ItemSubTitleText>{t('payment:May include handling fees')}</ItemSubTitleText>
            </Box>
          </ListItem.Content>
          <Box flexDirection="row" alignItems="center">
            <Icon
              name={
                activeProvider === constants.PaymentMethodProviders.Alipay
                  ? 'check-circle'
                  : 'checkbox-blank-circle-outline'
              }
              type="material-community"
              color={
                activeProvider === constants.PaymentMethodProviders.Alipay
                  ? Colors.discountPrice
                  : Colors.grey3
              }
              size={wp(22)}
            />
          </Box>
        </ListItem>
        <ListItem
          bottomDivider
          onPress={() => {
            onSetProvider(constants.PaymentMethodProviders.WeChatPay);
            setActiveExistCardSection(false);
          }}>
          <IconImg source={Images.wechatpayImg} />
          <ListItem.Content>
            <Box flexDirection="row" alignItems="center">
              <ItemTitleText>{t('payment:WeChat Pay')}</ItemTitleText>
              <ItemSubTitleText>{t('payment:May include handling fees')}</ItemSubTitleText>
            </Box>
          </ListItem.Content>
          <Box flexDirection="row" alignItems="center">
            <Icon
              name={
                activeProvider === constants.PaymentMethodProviders.WeChatPay
                  ? 'check-circle'
                  : 'checkbox-blank-circle-outline'
              }
              type="material-community"
              color={
                activeProvider === constants.PaymentMethodProviders.WeChatPay
                  ? Colors.discountPrice
                  : Colors.grey3
              }
              size={wp(22)}
            />
          </Box>
        </ListItem>
      </ScrollView>
      <Box
        flexDirection="row"
        width="100%"
        paddingRight="11px"
        paddingTop="10px"
        justifyContent="flex-end"
        borderTopWidth="1px"
        alignItems="center"
        borderTopColor={Colors.grey5}>
        <ConstTitle>
          {`${t('checkout:TotalSum')}: `}
          <ConstInfo>{sumPrice}</ConstInfo>
        </ConstTitle>
        <PayButton disabled={activeProvider === null} onPress={callPayment}>
          <PayButtonText>{t('payment:Payment')}</PayButtonText>
        </PayButton>
      </Box>
    </Box>
  );
};
PaymentProviderPanel.propTypes = {
  onSelectProvider: PropTypes.func,
  onClosePanel: PropTypes.func,
  checkoutProc: PropTypes.func,
  checkOutWithExistingCard: PropTypes.func,
  sumPrice: PropTypes.string,
};
PaymentProviderPanel.defaultProps = {
  onSelectProvider: () => {},
  onClosePanel: () => {},
  checkoutProc: () => {},
  checkOutWithExistingCard: () => {},
  sumPrice: '0.00',
};
// 冯琳
export default React.memo(PaymentProviderPanel);

const styles = StyleSheet.create({});

const TitleText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(15)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(26.5)}px;
  text-align: center;
`;
const ItemTitleText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(14)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(25)}px;
`;
const ItemSubTitleText = styled.Text`
  color: ${Colors.grey3};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(11)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(15)}px;
  margin-left: 8px;
`;
const CostTitle = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(13)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(23)}px;
`;
const CostInfoText = styled.Text`
  color: ${Colors.discountPrice};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(17)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(23)}px;
`;
const PayButton = styled.TouchableOpacity`
  background-color: ${props => (props.disabled ? Colors.grey13 : Colors.signUpStepRed)};
  border-radius: 20px;
  margin-left: 10px;
  padding-bottom: 9px;
  padding-left: 32px;
  padding-right: 32px;
  padding-top: 9px;
`;
const PayButtonText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(13)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(18)}px;
`;
const IconImg = styled.Image``;
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
