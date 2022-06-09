import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Image } from 'react-native';
import { Box, Text, HStack } from 'native-base';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import getSymbolFromCurrency from 'currency-symbol-map';
import { Icon, CheckBox, Button } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

import styled from 'styled-components/native';

import { wp, hp, adjustFontSize, getAdjustSize } from '@src/common/responsive';
import { PhotoView } from '@components';
import { Colors } from '@theme';
import Images from '@assets/images';
// 'https://placeimg.com/140/140/any'
const EmptyPhotoSize = getAdjustSize({ width: 37, height: 30 });
const PhotoSize = getAdjustSize({ width: 66, height: 66 });
const OrderContentPanel = ({ orderInfo }) => {
  //= ======== State Section========
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Box
      backgroundColor={Colors.white}
      marginTop={`${hp(12)}px`}
      width="100%"
      borderBottomWidth={`${hp(50)}px`}
      borderBottomColor={Colors.more}
      borderRadius="11px">
      <Box
        py={`${hp(9)}px`}
        px={`${wp(13)}px`}
        borderBottomColor={Colors.grey5}
        borderBottomWidth="1px">
        <Text
          fontFamily="Microsoft YaHei"
          fontSize="13"
          lineHeight="18px"
          mx="4px"
          color={Colors.grey2}>
          訂單内容
        </Text>
        {isExpanded ? (
          <HStack my="15px">
            <Box borderRadius="3px" overflow="hidden">
              <PhotoView
                uri="https://placeimg.com/140/140/any"
                photoSize={PhotoSize}
                emptyPhotoSize={EmptyPhotoSize}
              />
            </Box>
            <Box ml="15px" flex={1} flexGrow={1} justifyContent="space-around">
              <HStack>
                <Text
                  numberOfLines={2}
                  color={Colors.grey2}
                  fontFamily="Microsoft YaHei"
                  fontSize="12px"
                  lineHeight="18px">
                  商品名稱 行一商品名稱 行二 商品名稱 行一商品名稱 行二 商品名稱 行一商品名稱 行二
                  商品名稱 行一商品名稱 行二 商品名稱 行一商品名稱 行二 商品名稱 行一商品名稱 行二
                </Text>
              </HStack>
              <HStack>
                <Text
                  fontFamily="Microsoft YaHei"
                  color={Colors.grey3}
                  fontSize="9px"
                  lineHeight="16px">
                  商品明細:
                </Text>
                <Box ml="5px" flex={1} flexGrow={1}>
                  <Text
                    numberOfLines={2}
                    fontFamily="Microsoft YaHei"
                    color={Colors.grey3}
                    fontSize="9px"
                    lineHeight="16px">
                    明細内容{' '}
                  </Text>
                </Box>
              </HStack>
            </Box>
          </HStack>
        ) : (
          <HStack my="15px" alignItems="center">
            <Box
              size={`${wp(65)}px`}
              borderColor="#F6BDD1"
              borderWidth="1px"
              borderRadius="3px"
              backgroundColor="#FFF3F7"
              justifyContent="center">
              <Icon name="box" type="entypo" color={Colors.signUpStepRed} size={35} />
            </Box>
            <HStack ml={`${wp(15)}px`}>
              <Text
                fontFamily="Microsoft YaHei"
                fontSize="12px"
                lineHeight="18px"
                color={Colors.grey2}>
                訂單包含
              </Text>
              <Text
                fontFamily="Microsoft YaHei"
                fontWeight="700"
                fontSize="13px"
                lineHeight="20px"
                mx="4px"
                color={Colors.grey2}>
                3
              </Text>
              <Text
                fontFamily="Microsoft YaHei"
                fontSize="12px"
                lineHeight="18px"
                color={Colors.grey2}>
                件商品
              </Text>
            </HStack>
          </HStack>
        )}

        <Box width="100%" alignItems="center">
          <TouchableOpacity
            onPress={() => {
              setIsExpanded(prev => !prev);
            }}>
            <HStack>
              <Text
                fontFamily="Microsoft YaHei"
                fontSize="10px"
                lineHeight="16px"
                mr="5px"
                color={Colors.grey3}>
                點擊查看訂單全部商品
              </Text>
              <Icon
                name={isExpanded ? 'upcircleo' : 'downcircleo'}
                type="antdesign"
                color={Colors.grey3}
                size={15}
              />
            </HStack>
          </TouchableOpacity>
        </Box>
      </Box>
      <Box position="absolute" left={4} bottom={`${hp(-35)}px`}>
        <Text fontFamily="Microsoft YaHei" fontSize="15" lineHeight="27px" color={Colors.white}>
          倉庫處理中
        </Text>
      </Box>
    </Box>
  );
};
OrderContentPanel.propTypes = {
  orderInfo: PropTypes.shape({}),
};
OrderContentPanel.defaultProps = {
  orderInfo: {},
};
// 冯琳
export default React.memo(OrderContentPanel, (prev, next) => {
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
