import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Box } from 'native-base';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import getSymbolFromCurrency from 'currency-symbol-map';

import styled from 'styled-components/native';

import { wp, hp, adjustFontSize } from '@src/common/responsive';
import { SelectQuantityPanel } from '@components';
import { Colors } from '@theme';
import Images from '@assets/images';

const CheckoutItem = ({ checkoutOneItemInput, productInfo, updateCheckOutInput }) => {
  //= ======== State Section========
  const { t, i18n } = useTranslation();
  //  console.log('productInfo', productInfo);
  const { quantity, deliveryRate } = checkoutOneItemInput;
  const { asset, title, description, variation, price, quantity: sumQuantity } = productInfo;

  const updateQuantity = account => {
    if (quantity !== account) {
      updateCheckOutInput({ quantity: account });
    }
  };
  const sumPrice = useMemo(() => {
    return getSymbolFromCurrency(price?.currency) + ((price?.amount * quantity) / 100).toFixed(2);
  }, [quantity, price]);
  return (
    <Box
      py={`${hp(17)}px`}
      px={`${wp(13)}px`}
      marginTop={`${hp(12)}px`}
      width="100%"
      backgroundColor={Colors.white}
      borderRadius="11px">
      <Box
        width="100%"
        justifyContent="space-between"
        // alignItems="center"
        flexDirection="row">
        {asset ? (
          <AssetPhoto source={{ uri: asset?.url }} resizeMode="contain" />
        ) : (
          <EmptyContent>
            <EmptyImage source={Images.emptyImg} />
          </EmptyContent>
        )}
        <Box marginX={`${wp(12)}px`} flex={1}>
          <TitleText numberOfLines={2}>{title}</TitleText>
          {_.map(variation, (item, index) => {
            return (
              <ItemAttriText key={index}>
                {item?.name}: {item?.value}
              </ItemAttriText>
            );
          })}
          <DeliveryInfoText>{`發貨時間: 付款後${deliveryRate?.deliveryDays}天内`}</DeliveryInfoText>
        </Box>
        <ItemCostText>{price?.formatted}</ItemCostText>
      </Box>
      <Box
        width="100%"
        flexDirection="row"
        marginY={`${hp(15)}px`}
        alignItems="center"
        justifyContent="space-between">
        <QuantityTitle>{t('checkout:Purchase quantity')}</QuantityTitle>
        <SelectQuantityPanel
          limit={sumQuantity}
          account={quantity}
          updateAccount={updateQuantity}
          minLimit={0}
        />
      </Box>
      <Box
        width="100%"
        flexDirection="row"
        marginY={`${hp(15)}px`}
        alignItems="center"
        justifyContent="space-between">
        <OrderNoteTitle>{t('checkout:Purchase quantity')}</OrderNoteTitle>
        <OrderNoteInfo>選填，請先和商家協商一致</OrderNoteInfo>
      </Box>
      <Box width="100%" marginY={`${hp(15)}px`} justifyContent="center" alignItems="flex-end">
        <SumQuantityInfo>
          {`共${quantity}件 `}
          <ConstTitle>
            {`${t('checkout:Subtotal')}: `}
            <ConstInfo>{sumPrice}</ConstInfo>
          </ConstTitle>
        </SumQuantityInfo>

        <ConstTitle>
          {`${t('checkout:freight')}: `}
          <ConstInfo>{deliveryRate?.amount?.formatted}</ConstInfo>
        </ConstTitle>
      </Box>
    </Box>
  );
};
CheckoutItem.propTypes = {
  checkoutOneItemInput: PropTypes.shape({}),
  productInfo: PropTypes.shape({}),
  updateCheckOutInput: PropTypes.func,
};
CheckoutItem.defaultProps = {
  checkoutOneItemInput: {},
  productInfo: {},
  updateCheckOutInput: () => {},
};
// 冯琳
export default React.memo(CheckoutItem);

const styles = StyleSheet.create({});

const AssetPhoto = styled(FastImage)`
  height: ${wp(77)}px;
  width: ${wp(77)}px;
`;
const EmptyContent = styled.View`
  align-items: center;
  background-color: ${Colors.grey5};
  height: ${wp(77)}px;
  justify-content: center;
  width: ${wp(77)}px;
`;
const EmptyImage = styled.Image`
  height: ${wp(30)}px;
  width: ${wp(37)}px;
`;
const TitleText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(10)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(17.65)}px;
`;
const ItemAttriText = styled.Text`
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(10)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(13.2)}px;
`;
const ItemCostText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(10)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(14.5)}px;
`;
const DeliveryInfoText = styled.Text`
  color: ${Colors.filterNotiRed};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(10)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(15.65)}px;
`;
const QuantityTitle = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(10)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(20)}px;
`;
const OrderNoteTitle = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(10)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(20)}px;
`;
const OrderNoteInfo = styled.Text`
  color: ${Colors.grey3};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(10)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(20)}px;
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

const ConfirmButton = styled.TouchableOpacity`
  background-color: ${Colors.signUpStepRed};
  border-radius: 20px;
  padding-bottom: 10px;
  padding-top: 10px;
  width: 100%;
`;
const ConfirmButtonText = styled.Text`
  color: ${Colors.white};
  flex-grow: 1;
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(15)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(20)}px;
  margin-left: ${wp(20)}px;
  text-align: center;
`;
const PaymentButton = styled.TouchableOpacity`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;
const PaymentText = styled.Text`
  color: ${Colors.grey2};
  flex-grow: 1;
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(15.84)}px;
  margin-left: ${wp(11.08)}px;
  text-align: left;
`;
const SelectContent = styled.View`
  align-items: center;
  background-color: ${Colors.grey6};
  border-radius: 5px;
  height: ${hp(29.25)}px;
  justify-content: center;
  width: ${wp(83.52)}px;
`;
const SelectComment = styled.Text`
  color: ${Colors.grey3};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(9)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(11.88)}px;
`;
