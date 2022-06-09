import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import getSymbolFromCurrency from 'currency-symbol-map';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { Box, HStack, Text, Image } from 'native-base';
import { RowBox } from '@src/common/StyledComponents';

//= ==custom components & containers  =======
import { SelectQuantityPanel, PhotoView, AppText } from '@components';
import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { Colors } from '@theme';
import Images from '@assets/images';
import _ from 'lodash';
import moment from 'moment';

const faker = require('faker');

faker.locale = 'zh_CN';
const ContainerSize = getAdjustSize({ width: 172, height: 269 });
const EmptyPhotoSize = getAdjustSize({ width: 37, height: 30 });
const PhotoSize = getAdjustSize({ width: 90, height: 90 });
// 'https://placeimg.com/140/140/any'
const OrderItem = ({ orderItem, onPressItem, isSelected, onCallUpdateCartItem }) => {
  const { items, total, id } = orderItem;
  const totalQuantity = _.reduce(items, (result, item) => result + item.quantity, 0);

  return (
    <Box
      marginTop="7px"
      borderRadius="10px"
      paddingX={`${wp(10)}px`}
      paddingY={`${hp(15)}px`}
      backgroundColor={Colors.white}
      width="100%">
      <HStack alignItems="center" justifyContent="space-between">
        <TouchableOpacity>
          <HStack alignItems="center">
            <Image source={Images.homeIconImg} alt="shop" />
            <Text fontFamily="Microsoft YaHei" fontSize="13" lineHeight="23" mx="4px">
              植草纲目旗舰店
            </Text>
            <Icon name="chevron-thin-right" type="entypo" color={Colors.grey4} size={12} />
          </HStack>
        </TouchableOpacity>
        <Text fontFamily="Microsoft YaHei" color={Colors.more} fontSize="12px" lineHeight="22">
          待卖家发货
        </Text>
      </HStack>
      {/* order Item */}
      <TouchableOpacity
        onPress={() => {
          onPressItem(id);
        }}>
        {items.map(item => {
          const {
            product: { thumbnail, assets },
            productAttribute: { variation },
            deliveryOrder: { estimatedDeliveryDate },
            price,
            quantity,
            total,
          } = item;
          const asset = thumbnail?.url || (assets.length > 0 ? assets[0]?.url : null);
          const remainDeliveryHours = moment(estimatedDeliveryDate).diff(moment(), 'hours'); // 1
          const remainDeliveryDays = moment(estimatedDeliveryDate).diff(moment(), 'days'); // 1

          return (
            <HStack mt="15" key={item?.id}>
              <Box borderRadius="3px" overflow="hidden">
                <PhotoView uri={asset} photoSize={PhotoSize} emptyPhotoSize={EmptyPhotoSize} />
              </Box>

              <Box mx="12px" flex={1} flexGrow={1} justifyContent="space-between">
                <Box>
                  <Text
                    fontFamily="Microsoft YaHei"
                    color={Colors.black}
                    numberOfLines={2}
                    fontSize="14"
                    lineHeight="21"
                    fontWeight="400">
                    {item?.title}
                  </Text>
                  {_.map(variation, item => {
                    return (
                      <Box key={item?.name}>
                        <Text
                          fontFamily="Microsoft YaHei"
                          color={Colors.grey2}
                          fontSize="10px"
                          lineHeight="13px"
                          fontWeight="400">
                          {item?.name}: {item?.value}
                        </Text>
                      </Box>
                    );
                  })}
                </Box>

                <Text
                  fontFamily="Microsoft YaHei"
                  color={Colors.filterNotiRed}
                  fontSize="10px"
                  lineHeight="18px"
                  fontWeight="400">
                  發貨時間:{' '}
                  {remainDeliveryHours < 48
                    ? `付款後${remainDeliveryHours}小時内`
                    : `付款後${remainDeliveryDays}天内`}
                </Text>
              </Box>
              <Box>
                <HStack alignItems="center">
                  <Text
                    fontFamily="Microsoft YaHei"
                    color={Colors.black}
                    fontSize="11px"
                    lineHeight="14px"
                    fontWeight="400">
                    {getSymbolFromCurrency(price?.currency)}
                  </Text>
                  <Box flexDirection="row">
                    <Text
                      fontFamily="Microsoft YaHei"
                      color={Colors.black}
                      fontSize="14px"
                      lineHeight="18px"
                      fontWeight="400">
                      {parseInt(price.amount / 100, 10)}.
                    </Text>
                    <Text
                      fontFamily="Microsoft YaHei"
                      color={Colors.black}
                      fontSize="11px"
                      lineHeight="18px"
                      fontWeight="400">
                      {parseInt(price.amount % 100, 10)}
                    </Text>
                  </Box>
                </HStack>

                <Text
                  textAlign="right"
                  mt="5px"
                  fontFamily="Microsoft YaHei"
                  color={Colors.grey2}
                  fontSize="12px"
                  lineHeight="12px"
                  fontWeight="400">
                  x {quantity}
                </Text>
              </Box>
            </HStack>
          );
        })}
      </TouchableOpacity>

      <HStack justifyContent="flex-end" alignItems="center" flexGrow={1} my="10px">
        <Text fontFamily="Microsoft YaHei" color={Colors.grey2} fontSize="11px" lineHeight="20px">
          共{totalQuantity}件
        </Text>
        <Text
          fontFamily="Microsoft YaHei"
          color={Colors.black}
          fontSize="11px"
          lineHeight="20px"
          mx="5px">
          合計:
        </Text>
        <HStack alignItems="center">
          <Text
            fontFamily="Microsoft YaHei"
            color={Colors.discountPrice}
            fontSize="11px"
            lineHeight="20px"
            fontWeight="400">
            ￥
          </Text>
          <Box flexDirection="row">
            <Text
              fontFamily="Microsoft YaHei"
              color={Colors.discountPrice}
              fontSize="14px"
              lineHeight="25px"
              fontWeight="400">
              {parseInt(total.amount / 100, 10)}.
            </Text>
            <Text
              fontFamily="Microsoft YaHei"
              color={Colors.discountPrice}
              fontSize="11px"
              lineHeight="25px"
              fontWeight="400">
              {parseInt(total.amount % 100, 10)}
            </Text>
          </Box>
        </HStack>
      </HStack>
      <HStack flexGrow={1} justifyContent="space-evenly">
        <ActionButton>
          <Text fontFamily="Microsoft YaHei" color={Colors.grey2} fontSize="13px" lineHeight="23px">
            查看物流
          </Text>
        </ActionButton>
        <ActionButton>
          <Text fontFamily="Microsoft YaHei" color={Colors.grey2} fontSize="13px" lineHeight="23px">
            下载订单
          </Text>
        </ActionButton>
        <ActionButton>
          <Text fontFamily="Microsoft YaHei" color={Colors.grey2} fontSize="13px" lineHeight="23px">
            确认收货
          </Text>
        </ActionButton>
      </HStack>
    </Box>
  );
};
OrderItem.propTypes = {
  orderItem: PropTypes.objectOf(PropTypes.any),
  isSelected: PropTypes.bool,
  onPressItem: PropTypes.func,
  onCallUpdateCartItem: PropTypes.func,
};
OrderItem.defaultProps = {
  orderItem: null,
  isSelected: false,
  onPressItem: () => {},
  onCallUpdateCartItem: () => {},
};
export default React.memo(OrderItem, (prevProps, nextProps) => {
  return prevProps.cartItem?.id === nextProps.cartItem?.id;
});
const styles = StyleSheet.create({});

const ActionButton = styled(TouchableOpacity)`
  align-items: center;
  border-color: ${Colors.grey3};
  border-radius: 14px;
  border-width: 1px;
  height: ${wp(30)}px;
  justify-content: center;
  width: ${wp(85)}px;
`;
