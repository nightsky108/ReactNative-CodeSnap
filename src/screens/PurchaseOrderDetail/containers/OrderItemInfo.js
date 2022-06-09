import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, Image } from 'react-native';
import { Box } from 'native-base';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import getSymbolFromCurrency from 'currency-symbol-map';
import { Icon, CheckBox, Button } from 'react-native-elements';

import styled from 'styled-components/native';

import { wp, hp, adjustFontSize } from '@src/common/responsive';
import { SelectQuantityPanel } from '@components';
import { Colors } from '@theme';
import Images from '@assets/images';

const OrderItemInfo = ({ orderInfo }) => {
  //= ======== State Section========
  const { t, i18n } = useTranslation();
  //  console.log('productInfo', productInfo);
  const {
    product: { thumbnail, assets, title, seller },
    productAttribute: { price },
    quantity,
    deliveryPrice,
    subtotal,
    deliveryOrder,
  } = orderInfo;
  const asset = useMemo(() => {
    if (thumbnail) {
      return thumbnail;
    } else if (assets.length > 0) {
      return assets[0];
    }
    return null;
  }, [thumbnail, assets]);
  return (
    <Box backgroundColor={Colors.white} marginTop={`${hp(12)}px`} width="100%" borderRadius="11px">
      <Box
        py={`${hp(9)}px`}
        px={`${wp(13)}px`}
        borderBottomColor={Colors.grey5}
        borderBottomWidth="1px">
        <Box flexDirection="row" alignItems="center">
          <Image source={Images.homeIconImg} />
          <TitleText>{t('purchaseOrder:Store Name')}</TitleText>
          <Icon name="right" type="antdesign" color={Colors.grey4} size={15} />
        </Box>
        <Box flexDirection="row" alignItems="flex-start" py={2}>
          {asset === null ? (
            <EmptyContent>
              <EmptyImage source={Images.emptyImg} />
            </EmptyContent>
          ) : (
            <ProductImg source={{ uri: asset?.url }} />
          )}

          <Box flex={1} flexGrow={1} paddingX={3}>
            <SubTitleText>{title}</SubTitleText>
            <Box flexDirection="row">
              {/* <SubInfoText>123</SubInfoText> */}
              <SubInfoText>{seller.name}</SubInfoText>
            </Box>
          </Box>
          <Box alignItems="flex-end">
            <Box flexDirection="row" alignItems="flex-end">
              <ItemCostSymbolText>{getSymbolFromCurrency(price.currency)}</ItemCostSymbolText>
              <ItemCostText>{Math.floor(price.amount / 100)}.</ItemCostText>
              <ItemCostSymbolText>{price.amount % 100}</ItemCostSymbolText>
            </Box>
            <QuantityText>{`x ${quantity}`}</QuantityText>
          </Box>
        </Box>
        <Box alignItems="flex-end">
          <Button
            title={t('purchaseOrder:Refund')}
            type="outline"
            titleStyle={{ color: Colors.grey3 }}
            buttonStyle={{ borderColor: Colors.grey3, borderRadius: 14, width: 90, height: 40 }}
          />
          <Box alignItems="center" marginRight="10px" flexDirection="row" marginTop={2}>
            <PieceText>{`${t('checkout:total')} 1 ${t('checkout:Pieces')}`}</PieceText>
            <TotalSumText>{`${t('checkout:TotalSum')}:`}</TotalSumText>
            <Box flexDirection="row" marginLeft={1}>
              <TotalCostSymbolText>{getSymbolFromCurrency(subtotal.currency)}</TotalCostSymbolText>
              <TotalCostText>{subtotal.amountISO.toFixed(2)}</TotalCostText>
            </Box>
          </Box>
          <Box alignItems="center" marginRight="10px" flexDirection="row" marginTop={2}>
            <TotalSumText>{`${t('checkout:freight')}:`}</TotalSumText>
            <Box flexDirection="row" marginLeft={1}>
              <TotalCostSymbolText>
                {getSymbolFromCurrency(deliveryPrice.currency)}
              </TotalCostSymbolText>
              <TotalCostText>{deliveryPrice.amountISO.toFixed(2)}</TotalCostText>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box py={`${hp(9)}px`} px={`${wp(13)}px`}>
        <SecondTitleText>{t('purchaseOrder:order information')}</SecondTitleText>
        <Box flexDirection="row" alignItems="center">
          <SubInfoText>{t('purchaseOrder:Order number')}</SubInfoText>
          <Box width={2} />
          <SubInfoText>{deliveryOrder?.trackingNumber}</SubInfoText>
          <Box width={2} />
          <Image source={Images.bookmarkImg} />
        </Box>
        <Box flexDirection="row" alignSelf="center" alignItems="center">
          <Image source={Images.greenChatImg} />
          <Box width={2} />
          <ContactInfoText> {t('purchaseOrder:contact seller')}: </ContactInfoText>
          <Box width={2} />
          <ContactInfoText>{seller?.phone}</ContactInfoText>
        </Box>
      </Box>
    </Box>
  );
};
OrderItemInfo.propTypes = {
  orderInfo: PropTypes.shape({}),
};
OrderItemInfo.defaultProps = {
  orderInfo: {},
};
// 冯琳
export default React.memo(OrderItemInfo, (prev, next) => {
  return prev.orderInfo?.id === next.orderInfo?.id;
});

const styles = StyleSheet.create({});

const AssetPhoto = styled(FastImage)`
  height: ${wp(77)}px;
  width: ${wp(77)}px;
`;
const ProductImg = styled(FastImage)`
  border-radius: 3px;
  height: ${wp(90)}px;
  width: ${wp(90)}px;
`;
const EmptyContent = styled.View`
  align-items: center;
  background-color: ${Colors.grey5};
  border-radius: 3px;
  height: ${wp(90)}px;
  justify-content: center;
  width: ${wp(90)}px;
`;
const EmptyImage = styled.Image`
  height: ${wp(37)}px;
  width: ${wp(45)}px;
`;
const TitleText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(13)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(23)}px;
  margin-left: 8px;
  margin-right: 3px;
`;
const SecondTitleText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(13)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(23)}px;
`;
const SubTitleText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(14)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(20)}px;
`;
const SubInfoText = styled.Text`
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(10)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(18)}px;
`;
const ItemCostText = styled(Text)`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: 13px;
  letter-spacing: -0.41px;
  line-height: 22px;
  margin-left: 2px;
`;
const ItemCostSymbolText = styled(Text)`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: 9px;
  letter-spacing: -0.41px;
  line-height: 22px;
`;

const QuantityText = styled.Text`
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(22)}px;
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
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
`;

const TotalCostSymbolText = styled(Text)`
  align-self: center;
  color: ${Colors.discountPrice};
  font-family: 'Microsoft YaHei';
  font-size: 11px;
  letter-spacing: -0.41px;
  line-height: 22px;
`;

const PieceText = styled(Text)`
  align-self: center;
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: 11px;
  line-height: 20px;
  margin-right: 6px;
`;
const ContactInfoText = styled(Text)`
  align-self: center;
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  line-height: 20px;
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
