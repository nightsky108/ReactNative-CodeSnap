import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, StatusBar, Platform, View, ImageBackground } from 'react-native';
import { Icon, Text, Image } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Box, HStack, Center } from 'native-base';
import { LinearTextGradient } from 'react-native-text-gradient';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
//= ==custom components & containers  =======
import { FocusAwareStatusBar, NormalHeaderContainer, JitengPressable } from '@components';
import {
  HorizontalGradient,
  CenterBox,
  RowCenter,
  FullHorizontalScrollView,
} from '@common/StyledComponents';
import Images from '@assets/images';

import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { Colors, Fonts } from '@theme';

// 'https://picsum.photos/id/0/375/117',
const ProductCard = React.memo(
  ({ product, onPressItem = () => {} }) => {
    const { t, i18n } = useTranslation();
    const { id, thumbnail, title, description, assets, price, oldPrice, quantity } = product;
    const asset = useMemo(() => {
      if (thumbnail) {
        return thumbnail;
      } else if (assets.length > 0) {
        return assets[0];
      }
      return null;
    }, [thumbnail, assets]);
    return (
      <Box
        marginTop={`${hp(15)}px`}
        width="100%"
        borderBottomWidth="1px"
        borderBottomColor={Colors.grey4}>
        <Box flexDirection="row">
          {asset === null ? (
            <EmptyContent>
              <EmptyImage source={Images.emptyImg} />
            </EmptyContent>
          ) : (
            <ProductImg source={{ uri: asset?.url }}>
              <QuantityContent>
                <QuantityText>{quantity}</QuantityText>
              </QuantityContent>
            </ProductImg>
          )}

          <Box marginX="10px" flex={1}>
            <TitleText>{description}</TitleText>
            <CostText>{price?.formatted}</CostText>
          </Box>
        </Box>
        <Box flexDirection="row" marginY="10px" justifyContent="space-between" alignItems="center">
          <AskButton>
            <AskButtonText>求講解</AskButtonText>
          </AskButton>
          <TouchableOpacity
            onPress={() => {
              onPressItem(id);
            }}>
            <MoreButtonContent colors={['#FF4D00', '#FF1F00']}>
              <MoreButtonText>去買</MoreButtonText>
            </MoreButtonContent>
          </TouchableOpacity>
        </Box>
      </Box>
    );
  },
  // (prevProps, nextProps) => {
  //     return prevProps.product?.id === nextProps.product?.id;
  // },
);
const ProductListPanel = ({ products, liveStreamId, onNavigateProductDetail }) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  //= ======== State Section========
  const renderItem = useCallback(({ item }) => {
    return <ProductCard product={item} onPressItem={onNavigateProductDetail} />;
  }, []);
  const keyExtractor = useCallback(item => `${liveStreamId}-${item?.id}`, [liveStreamId]);
  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      extraData={products.length}
      listKey={`product_${liveStreamId}`}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      style={{ marginHorizontal: wp(12) }}
    />
  );
};
ProductListPanel.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object),
  liveStreamId: PropTypes.string,
  onNavigateProductDetail: PropTypes.func,
};
ProductListPanel.defaultProps = {
  products: [],
  liveStreamId: null,
  onNavigateProductDetail: () => {},
};
export default React.memo(ProductListPanel);

const styles = StyleSheet.create({});
const ProductImg = styled(FastImage)`
  border-radius: ${5}px;
  height: ${wp(100)}px;
  width: ${wp(100)}px;
`;
const EmptyContent = styled.View`
  align-items: center;
  background-color: ${Colors.grey5};
  height: ${wp(100)}px;
  justify-content: center;
  width: ${wp(100)}px;
`;
const EmptyImage = styled.Image`
  height: ${wp(100)}px;
  width: ${wp(100)}px;
`;
const TitleText = styled.Text`
  color: ${Colors.grey1};
  flex: 1;
  flex-wrap: wrap;
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(16)}px;
  text-align: left;
`;
const CostText = styled.Text`
  color: ${Colors.priceRed};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(15)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(20)}px;
  text-align: left;
`;

const QuantityContent = styled.View`
  background-color: #33333380;

  border-bottom-right-radius: 5px;
  border-top-left-radius: 5px;
  height: ${hp(15)}px;
  justify-content: center;
  left: 0;
  overflow: hidden;
  position: absolute;
  top: 0;
  width: ${wp(30)}px;
`;
const QuantityText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(10)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(14)}px;
  text-align: center;
`;
const AskButton = styled.TouchableOpacity`
  align-items: center;
  background-color: ${Colors.grey6};
  border-color: ${Colors.grey3};
  border-radius: 10px;
  border-width: 1px;
  height: ${hp(21)}px;
  justify-content: center;
  width: ${wp(64)}px;
`;

const AskButtonText = styled.Text`
  color: ${Colors.grey1};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(16)}px;
  text-align: left;
`;
const MoreButton = styled.TouchableOpacity`
  align-items: center;
  background-color: ${Colors.grey6};
  border-color: ${Colors.grey3};
  border-radius: 10px;
  border-width: 1px;
  height: ${hp(21)}px;
  justify-content: center;
  width: ${wp(64)}px;
`;
const MoreButtonContent = styled(HorizontalGradient)`
  align-items: center;
  border-radius: 20px;
  height: ${hp(28)}px;
  justify-content: center;
  width: ${wp(74)}px;
`;
const MoreButtonText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(16)}px;
  text-align: left;
`;
const ViewText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(8)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(11)}px;
  text-align: left;
`;
const FollowContent = styled(HorizontalGradient)`
  border-radius: 30px;
  padding-bottom: ${hp(4)}px;
  padding-left: ${wp(7)}px;
  padding-right: ${wp(7)}px;
  padding-top: ${hp(4)}px;
`;
const FollowText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(10)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(14)}px;
  padding-left: ${wp(7)}px;
  padding-right: ${wp(7)}px;
  text-align: left;
`;
