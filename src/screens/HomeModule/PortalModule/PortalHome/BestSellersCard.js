import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, StatusBar, Platform, View, ImageBackground } from 'react-native';
import { Icon, Text, Image } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Box, HStack, Center } from 'native-base';
import Carousel, { Pagination } from 'react-native-snap-carousel';

//= ==custom components & containers  =======
import { FocusAwareStatusBar, NormalHeaderContainer, JitengPressable } from '@components';

import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { Colors, Fonts } from '@theme';
import Images from '@assets/images';

import { SearchBarContainer } from '@src/common/StyledComponents';
import { ScrollView } from 'react-native-gesture-handler';

const IconSize = 25;
const CardSize = getAdjustSize({ width: 166, height: 170 });

const EventProductContainerSize = getAdjustSize({ width: 63, height: 103 });

const EventProductSize = getAdjustSize({ width: 59, height: 77 });
const ProductItem = ({ product }) => {
  return (
    <EventProductContainer>
      <JitengPressable>
        <Image
          source={{
            uri: product?.thumbnail ? product?.thumbnail?.url : product?.assets[0].url,
          }}
          style={styles.eventProductImg}
        />
        <Text style={styles.productOldCostTxt}>{product?.oldPrice?.formatted}</Text>
        <Text style={styles.productCostTxt}>{product?.price?.formatted}</Text>
      </JitengPressable>
    </EventProductContainer>
  );
};
const BestSellersCard = ({ products }) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  //= ======== State Section========
  const renderItem = useCallback(({ item, index }) => {
    return <ProductItem key={item?.id} product={item} />;
  }, []);
  return (
    <Box justifyContent="center" alignItems="center" style={styles.cardContainer}>
      <Box width="100%" flexDirection="row" justifyContent="space-between">
        <RowContainer>
          <CircleView>
            <CardGradient startColor={Colors.yellow1} endColor={Colors.yellow2}>
              <CircleCenterView>
                <Icon name="clock" type="evilicon" color={Colors.white} size={15} />
              </CircleCenterView>
            </CardGradient>
          </CircleView>
          <Text style={styles.rushTitle}> {t('specialProduct:Special Goods')}</Text>
        </RowContainer>

        <JitengPressable>
          <ProductRowContainer>
            <Text style={styles.rushTitle}> {t('common:More')} </Text>
            <Icon
              name="right"
              type="antdesign"
              color={Colors.black}
              size={11}
              containerStyle={styles.nextIcon}
            />
          </ProductRowContainer>
        </JitengPressable>
      </Box>

      <Box width="100%" marginTop="21px">
        {/* <Carousel
                    data={products}
                    renderItem={renderItem}
                    sliderWidth={EventProductContainerSize.width}
                    itemWidth={EventProductContainerSize.width}
                /> */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {products.map((product, index) => {
            return <ProductItem key={product?.id} product={product} />;
          })}
        </ScrollView>
      </Box>
    </Box>
  );
};
BestSellersCard.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object),
};
BestSellersCard.defaultProps = {
  products: [],
};
export default React.memo(BestSellersCard);

const styles = StyleSheet.create({
  cardContainer: {
    ...CardSize,
    borderRadius: wp(8),
    paddingTop: hp(9),
    paddingHorizontal: 7,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: Colors.white,
    justifyContent: 'flex-start',
    // alignItems: 'flex-start',
  },

  eventProductImg: {
    ...EventProductSize,
  },
  rushTitle: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(12.5),
    lineHeight: adjustFontSize(16.5),

    textAlign: 'center',
    fontWeight: '400',
  },

  productOldCostTxt: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(10),
    lineHeight: adjustFontSize(13),
    color: Colors.black,
    textAlign: 'center',
    fontWeight: '400',
    textAlignVertical: 'center',
    textDecorationLine: 'line-through',
    marginVertical: 3,
  },
  productCostTxt: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(12),
    lineHeight: adjustFontSize(16),
    color: Colors.priceRed,
    textAlign: 'center',
    fontWeight: '400',
    textAlignVertical: 'center',
  },
  nextIcon: {
    justifyContent: 'center',
  },
});

const SubContent = styled.View`
  justify-content: flex-start;
`;

const CircleView = styled.View`
  border-radius: 9px;
  height: 18px;
  overflow: hidden;
  width: 18px;
`;
const CircleCenterView = styled.View`
  align-items: center;
  height: 18px;
  justify-content: center;
  width: 18px;
`;
const RowContainer = styled.View`
  flex-direction: row;
`;
const ProductRowContainer = styled(RowContainer)`
  justify-content: flex-end;
`;

const BodyContainer = styled.View`
  margin-top: 21px;
`;
const EventProductContainer = styled.View`
  align-items: center;
  height: ${parseInt(EventProductContainerSize.height, 10)}px;
  justify-content: flex-end;
  margin-right: ${wp(20)}px;
  width: ${parseInt(EventProductContainerSize.width, 10)}px;
`;
const CardGradient = styled(LinearGradient).attrs(props => ({
  colors: [props.startColor, props.endColor],
  start: { x: 0, y: 1 },
  end: { x: 1, y: 1 },
}))``;
