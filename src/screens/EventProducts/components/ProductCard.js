import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  StatusBar,
  Platform,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { Icon, Text, Image, Button } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import _, { wrap } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Box, HStack, Center } from 'native-base';
import Collapsible from 'react-native-collapsible';
import getSymbolFromCurrency from 'currency-symbol-map';

//= ==custom components & containers  =======
import { FocusAwareStatusBar, NormalHeaderContainer, JitengPressable } from '@components';

import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { Colors, Fonts } from '@theme';
import Images from '@assets/images';

import {
  RowCenter,
  SearchBarContainer,
  RowSpaceBetween,
  RowBox,
} from '@src/common/StyledComponents';
import { colorStyle } from 'styled-system';

const ContainerSize = getAdjustSize({ width: 167, height: 251 });
const ProductImageSize = getAdjustSize({ width: 167, height: 170 });

const BannerImageSize = getAdjustSize({ width: 375, height: 186 });

const Container = styled.TouchableOpacity`
    align-self: center;
    background-color: ${Colors.white};
    border-radius: 7px;
    height: ${ContainerSize.height}px;
    overflow:hidden
    width: ${ContainerSize.width}px;
`;
const ProductPhoto = styled.Image`
    align-self: center;
    height: ${ProductImageSize.height}px;
    overflow:hidden
    width: ${ProductImageSize.width}px;
`;
const ProductTitleText = styled.Text`
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
const ProductOldPriceText = styled(Text)`
  color: ${Colors.grey3};
  flex: 1;
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  letter-spacing: 0.21px;
  line-height: 16px;
  margin-left: 2px;
  text-decoration: line-through;
`;
const ProductPriceText = styled(Text)`
  color: ${Colors.filterNotiRed};
  flex-shrink: 1;
  font-family: 'Microsoft YaHei';
  font-size: 16px;
  letter-spacing: -0.41px;
  line-height: 22px;
`;
const ProductPriceSymbolText = styled(Text)`
  color: ${Colors.filterNotiRed};
  flex-shrink: 1;
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  letter-spacing: -0.41px;
  line-height: 16px;
`;

const ProductCard = ({ product }) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const { id, thumbnail, description, price, oldPrice } = product;

  //= ======== State Section========

  return (
    <Container>
      <ProductPhoto source={{ uri: thumbnail?.url }} />
      <Box width="100%" px={4} flexGrow={1} py={4}>
        <ProductTitleText numberOfLines={2}>{description}</ProductTitleText>
        <ProductCostContainer>
          <RowCenter>
            <ProductPriceSymbolText>
              {getSymbolFromCurrency(price?.currency)}
            </ProductPriceSymbolText>
            <ProductPriceText>{price?.amountISO}</ProductPriceText>
          </RowCenter>
          <RowCenter>
            <ProductOldPriceText>{price?.formatted}</ProductOldPriceText>
          </RowCenter>
        </ProductCostContainer>
      </Box>
    </Container>
  );
};
ProductCard.propTypes = {
  product: PropTypes.objectOf(Object),
};
ProductCard.defaultProps = {
  product: {},
};
export default React.memo(ProductCard, (prevProps, nextProps) => {
  return prevProps.product?.id === nextProps.product?.id;
});

const styles = StyleSheet.create({});
