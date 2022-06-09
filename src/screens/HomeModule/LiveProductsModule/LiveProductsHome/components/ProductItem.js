import React, { useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, StatusBar, Platform, View, FlatList } from 'react-native';
import { Icon, Text, Image } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { Box, HStack, Center } from 'native-base';

//= ==custom components & containers  =======
import { FocusAwareStatusBar, NormalHeaderContainer, JitengPressable } from '@components';

import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { Colors, Fonts } from '@theme';
import Images from '@assets/images';
import { FullHorizontalScrollView } from '@src/common/StyledComponents';
import _ from 'lodash';

const faker = require('faker');

faker.locale = 'zh_CN';

const ContainerSize = getAdjustSize({ width: 167, height: 251 });
const emptyImageSize = getAdjustSize({ width: 77.46, height: 64.55 });

const ProductSize = getAdjustSize({ width: 167, height: 170 });
const CardItemContainer = styled.View`
  align-items: flex-start;
  background-color: ${Colors.white};
  border-radius: ${parseInt(wp(7), 10)}px;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
  elevation: 5;
  height: ${parseInt(ContainerSize.height, 10)}px;
  justify-content: space-between;
  overflow: hidden;
  padding-bottom: ${parseInt(hp(12), 10)}px;
  width: ${parseInt(ContainerSize.width, 10)}px;
`;
const ProductImage = styled(Image).attrs({
  containerStyle: {
    width: ProductSize.width,
    height: ProductSize.height,
    borderTopLeftRadius: wp(7),
    borderTopRightRadius: wp(7),
    overflow: 'hidden',
  },
})``;
const EmptyContent = styled.View`
  align-items: center;
  background-color: ${Colors.grey5};
  height: ${ProductSize.height}px;
  justify-content: center;
  width: ${ProductSize.width}px;
`;
const EmptyImage = styled.Image`
  height: ${emptyImageSize.height}px;
  width: ${emptyImageSize.width}px;
`;
const TitleText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: 19px;
  letter-spacing: -0.41px;
  line-height: 22px;
  margin-bottom: 5px;
`;
const ProductDescTxt = styled(Text)`
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: 11px;
  line-height: 18px;
`;
const ProductCostContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
`;
const ProductOldPrice = styled(Text)`
  color: ${Colors.grey3};
  flex: 1;
  font-family: 'Microsoft YaHei';
  font-size: ${parseInt(adjustFontSize(12), 10)}px;
  letter-spacing: 0.21px;
  line-height: ${parseInt(adjustFontSize(16), 10)}px;
  margin-left: 2px;
  text-decoration: line-through;
`;
const ProductPrice = styled(Text)`
  color: ${Colors.filterNotiRed};
  flex-shrink: 1;
  font-family: 'Microsoft YaHei';
  font-size: ${parseInt(adjustFontSize(16), 10)}px;
  letter-spacing: -0.41px;
  line-height: ${parseInt(adjustFontSize(22), 10)}px;
`;
const CurrencySymbol = styled(Text)`
  color: ${Colors.filterNotiRed};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  letter-spacing: 0.21px;
  line-height: 16px;
`;
const OldCurrencySymbol = styled(Text)`
  color: ${Colors.grey3};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  letter-spacing: 0.21px;
  line-height: 16px;
  text-decoration: line-through;
`;
const ProductItem = ({ product, onPressProductItem }) => {
  const { t, i18n } = useTranslation();
  const { id, thumbnail, description, assets, price, oldPrice } = product;
  const asset = useMemo(() => {
    if (thumbnail) {
      return thumbnail;
    } else if (assets.length > 0) {
      return assets[0];
    }
    return null;
  }, [thumbnail, assets]);
  return (
    <JitengPressable
      onPress={() => {
        onPressProductItem(product?.id);
      }}>
      <CardItemContainer>
        {asset === null ? (
          <EmptyContent>
            <EmptyImage source={Images.emptyImg} />
          </EmptyContent>
        ) : (
          <ProductImage source={{ uri: asset?.url }} />
        )}

        <Box width="100%" px={4}>
          <ProductDescTxt numberOfLines={2}>{description}</ProductDescTxt>
          <ProductCostContainer>
            <ProductPrice numberOfLines={1}>{price?.formatted}</ProductPrice>
            <ProductOldPrice numberOfLines={1}>{oldPrice?.formatted}</ProductOldPrice>
          </ProductCostContainer>
        </Box>
      </CardItemContainer>
    </JitengPressable>
  );
};

ProductItem.propTypes = {
  product: PropTypes.oneOfType([PropTypes.object]),
  onPressProductItem: PropTypes.func,
};
ProductItem.defaultProps = {
  product: {},
  onPressProductItem: () => {},
};
export default React.memo(ProductItem, (prevProps, nextProps) => {
  return prevProps.product?.id === nextProps.product?.id;
});

const styles = StyleSheet.create({});
