import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import getSymbolFromCurrency from 'currency-symbol-map';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { Box } from 'native-base';
import { RowBox } from '@src/common/StyledComponents';

//= ==custom components & containers  =======
import { SelectQuantityPanel } from '@components';
import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { Colors } from '@theme';
import Images from '@assets/images';

const faker = require('faker');

faker.locale = 'zh_CN';
const ContainerSize = getAdjustSize({ width: 172, height: 269 });
const EmptyPhotoSize = getAdjustSize({ width: 37, height: 30 });
const PhotoSize = getAdjustSize({ width: 90, height: 90 });

const CartItem = ({ cartItem, onPressItem, isSelected, onCallUpdateCartItem }) => {
  const { t, i18n } = useTranslation();
  const { id, quantity, productAttribute, product, total, deliveryAddress } = cartItem;
  const { thumbnail, assets, description, title } = product;
  const photoUrl = thumbnail ? thumbnail?.url : assets[0].url;
  const { quantity: storeQuantity } = productAttribute;
  return (
    <Box
      marginTop="7px"
      borderRadius="10px"
      paddingX={`${wp(10)}px`}
      paddingY={`${hp(15)}px`}
      backgroundColor={Colors.white}
      flexDirection="row"
      width="100%"
      alignItems="center">
      <Icon
        name={isSelected ? 'check-circle' : 'checkbox-blank-circle-outline'}
        type="material-community"
        color={isSelected ? Colors.discountPrice : Colors.grey3}
        size={wp(22)}
        onPress={() => {
          onPressItem(id);
        }}
      />
      <Box flex={1}>
        <Box flexDirection="row">
          {photoUrl ? (
            <Photo source={{ uri: photoUrl }} />
          ) : (
            <EmptyPhotoView>
              <EmptyPhoto source={Images.emptyImg} />
            </EmptyPhotoView>
          )}

          <Box flex={1} justifyContent="space-between">
            <DescriptionText numberOfLines={2}>{title}</DescriptionText>
            <Box flexDirection="row" justifyContent="space-between">
              <Box flexDirection="row" alignItems="center">
                <SymbolText>{getSymbolFromCurrency(total?.currency)}</SymbolText>
                <CostText>{total?.amountISO}</CostText>
              </Box>
              <SelectQuantityPanel
                limit={storeQuantity}
                account={quantity}
                updateAccount={account => {
                  onCallUpdateCartItem(id, account);
                }}
              />
              {/*  <QuantityButton>
              <QuantityButtonText>{`X ${quantity}`}</QuantityButtonText>
            </QuantityButton> */}
            </Box>
          </Box>
        </Box>

        <Box flexDirection="row" marginTop="10px">
          <Box flexDirection="row">
            <AddressTitleText>{t('common:Shipping address')}</AddressTitleText>
            <Icon
              name="location-pin"
              type="entypo"
              color={Colors.signUpStepRed}
              size={adjustFontSize(20)}
            />
          </Box>
          <AddressContent>
            <AddressDetailText>
              {`${deliveryAddress?.country?.name || ''} ${deliveryAddress?.region?.name || ''} ${
                deliveryAddress?.street || ''
              } ${deliveryAddress?.city || ''}`}
            </AddressDetailText>
          </AddressContent>
        </Box>
      </Box>
    </Box>
  );
};
CartItem.propTypes = {
  cartItem: PropTypes.objectOf(PropTypes.any),
  isSelected: PropTypes.bool,
  onPressItem: PropTypes.func,
  onCallUpdateCartItem: PropTypes.func,
};
CartItem.defaultProps = {
  cartItem: null,
  isSelected: false,
  onPressItem: () => {},
  onCallUpdateCartItem: () => {},
};
export default React.memo(CartItem, (prevProps, nextProps) => {
  return (
    prevProps.cartItem?.id === nextProps.cartItem?.id &&
    prevProps.cartItem?.quantity === nextProps.cartItem?.quantity &&
    prevProps.isSelected === nextProps.isSelected
  );
});
const styles = StyleSheet.create({
  cardContainer: {
    ...ContainerSize,
    overflow: 'hidden',
    borderRadius: wp(9),
    paddingTop: hp(10),
    paddingBottom: hp(13),
    paddingHorizontal: wp(14),
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    // marginTop: hp(10),
  },
});
const Photo = styled(FastImage)`
  //border-radius: 5px;
  align-items: center;
  border-radius: 4px;
  height: ${parseInt(PhotoSize.height, 10)}px;
  justify-content: center;
  width: ${parseInt(PhotoSize.width, 10)}px;
`;
const EmptyPhotoView = styled(View)`
  align-items: center;
  background-color: ${Colors.grey5};
  border-radius: 4px;
  height: ${parseInt(PhotoSize.height, 10)}px;
  justify-content: center;
  width: ${parseInt(PhotoSize.width, 10)}px;
`;
const EmptyPhoto = styled.Image`
  align-items: center;
  height: ${parseInt(EmptyPhotoSize.height, 10)}px;
  justify-content: center;
  width: ${parseInt(EmptyPhotoSize.width, 10)}px;
`;
const DescriptionText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';

  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(22)}px;
`;
const SymbolText = styled.Text`
  color: ${Colors.priceRed};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(16)}px;
`;
const CostText = styled.Text`
  color: ${Colors.priceRed};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(17)}px;
  font-weight: 700;
  line-height: ${adjustFontSize(23)}px;
`;
const QuantityButton = styled(TouchableOpacity)`
  align-items: center;
  border-color: ${Colors.grey4};
  border-radius: 5px;
  border-width: 1px;
  height: ${wp(30)}px;
  justify-content: center;
  width: ${wp(30)}px;
`;
const QuantityButtonText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(22)}px;
  text-align: left;
`;
const AddressTitleText = styled.Text`
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(21.18)}px;
  text-align: left;
`;

const AddressText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(11)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(14.52)}px;
  margin-right: ${wp(20)}px;
  text-align: left;
`;
const AddressContent = styled.View`
  background-color: ${Colors.white};
  flex: 1;
  margin-left: ${wp(20)}px;
`;
const AddressDetailText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(11)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(14.52)}px;
  margin-right: ${wp(20)}px;
  text-align: left;
`;
