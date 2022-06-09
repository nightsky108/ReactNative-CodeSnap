import React, { useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ImageBackground } from 'react-native';
import { Icon, Text, Image } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel';
import { useLazyQuery } from '@apollo/client';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
//= =====hook data================================
import { useUserSettings } from '@data/useUser';
import { useSettingContext } from '@contexts/SettingContext';

//= ======Query ====================

import { FETCH_PRODUCT_PREVIEWS_BY_THEME } from '@modules/product/graphql';

//= ==custom components & containers  =======
import { JitengPressable } from '@components';

import { getAdjustSize, wp, hp } from '@src/common/responsive';
import { Colors } from '@theme';

import _ from 'lodash';

const faker = require('faker');

faker.locale = 'zh_CN';

const TestProducts = Array(3)
  .fill('')
  .map((item, i) => ({
    id: `${i}`,
    title: `${faker.name.firstName()} ${faker.name.firstName()}${faker.name.firstName()}`,
    price: {
      formatted: `￥${faker.datatype.float()}`,
    },
    thumbnail: {
      url: faker.image.food(),
    },
    profilePhoto: faker.image.people(),
  }));
const ContainerSize = getAdjustSize({ width: 343, height: 220 });

const EventContainerSize = getAdjustSize({ width: 99, height: 152 });

const EventProductSize = getAdjustSize({ width: 99, height: 98 });

const ThemeCard = React.memo(
  ({ currency, theme, onMore = () => {} }) => {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const themeID = useMemo(() => {
      return theme?.id || null;
    }, [theme]);
    const { userLanguage } = useSettingContext();
    const [fetchProducts, { data: products }] = useLazyQuery(FETCH_PRODUCT_PREVIEWS_BY_THEME, {
      variables: {
        theme: themeID,
        skip: 0,
        limit: 3,
        currency,
        language: userLanguage,
      },
    });
    useEffect(() => {
      if (themeID) {
        fetchProducts();
      }

      return () => {};
    }, [fetchProducts, themeID]);
    const themeProducts = useMemo(() => {
      if (products) {
        return products?.productsByTheme?.collection;
      } else {
        return [];
      }
    }, [products]);
    //= ======== State Section========
    // <ImageBackground style={styles.cardContainer} source={Images.fashionImg}>
    return (
      <ImageBackground style={styles.cardContainer} source={{ uri: theme?.thumbnail?.url }}>
        <TopContent>
          <TitleText>{theme?.name} </TitleText>
          <JitengPressable onPress={onMore}>
            <MoreActionView>
              <MoreText>{t('home:fashion:More good stuff')}</MoreText>
              <Icon
                name="right"
                type="antdesign"
                color={Colors.white}
                size={15}
                containerStyle={styles.nextIcon}
              />
            </MoreActionView>
          </JitengPressable>
        </TopContent>
        <ProductContainer>
          {_.map(themeProducts, product => {
            return (
              <JitengPressable key={product?.id} onPress={() => {}}>
                <ItemContainer>
                  <ItemProduct
                    source={{
                      uri: product?.thumbnail ? product?.thumbnail?.url : product?.assets[0].url,
                    }}
                  />
                  <ProductInfo>
                    <ProductName numberOfLines={1}>{product?.title}</ProductName>
                    <ProductPrice>{product?.price?.formatted}</ProductPrice>
                  </ProductInfo>
                </ItemContainer>
              </JitengPressable>
            );
          })}
        </ProductContainer>
      </ImageBackground>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.theme?.id === nextProps.theme?.id && prevProps?.currency === nextProps?.currency
    );
  },
);

const FashionPanel = ({ themes, onMore }) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const { userCurrencyISO } = useUserSettings();

  //= ======== State Section========
  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <ThemeCard
          theme={item}
          onMore={() => {
            onMore(item?.id);
          }}
          currency={userCurrencyISO}
        />
      );
    },
    [onMore, userCurrencyISO],
  );
  return (
    <Carousel
      data={themes}
      renderItem={renderItem}
      sliderWidth={ContainerSize.width}
      itemWidth={ContainerSize.width}
      containerCustomStyle={styles.carouselContainer}
      loop={true}
    />
  );
};
FashionPanel.propTypes = {
  themes: PropTypes.arrayOf(PropTypes.object),
  onMore: PropTypes.func,
};
FashionPanel.defaultProps = {
  themes: [],
  onMore: () => {},
};
export default FashionPanel;

const styles = StyleSheet.create({
  cardContainer: {
    ...ContainerSize,
    overflow: 'hidden',
    borderRadius: wp(8),
    paddingTop: hp(10),
    paddingHorizontal: wp(13),
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
  },
  nextIcon: {
    marginLeft: 5,
    justifyContent: 'center',
  },
  carouselContainer: {
    alignSelf: 'center',
  },
});
const TopContent = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;
const TitleText = styled(Text)`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 16px;
  line-height: 21px;
`;
const MoreActionView = styled.View`
  align-items: center;
  background-color: ${Colors.blue4};
  border-bottom-left-radius: ${parseInt(wp(10), 10)}px;
  border-top-left-radius: ${parseInt(wp(10), 10)}px;
  flex-direction: row;
  height: ${parseInt(wp(22), 10)}px;
  justify-content: center;
  margin-right: -${parseInt(wp(14), 10)}px;
  width: ${parseInt(wp(80), 10)}px;
`;
const MoreText = styled(Text)`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 10px;
  line-height: 13px;
`;
const ProductContainer = styled.View`
  align-items: center;
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
`;
const ItemContainer = styled.View`
  background-color: ${Colors.white};
  border-radius: 5px;
  height: ${parseInt(EventContainerSize.height, 10)}px;
  width: ${parseInt(EventContainerSize.width, 10)}px;
`;
const ItemProduct = styled(Image)`
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  height: ${parseInt(EventProductSize.height, 10)}px;
  overflow: hidden;
  width: ${parseInt(EventProductSize.width, 10)}px;
`;
const ProductName = styled(Text)`
  color: ${Colors.grey1};
  font-family: 'Microsoft YaHei';
  font-size: 10px;
  line-height: 13.2px;
  text-align: center;
`;
const ProductInfo = styled.View`
  align-items: center;
  flex: 1;
  justify-content: space-around;
  width: 100%;
`;
const ProductPrice = styled(Text)`
  color: ${Colors.signUpStepRed};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  line-height: 16px;
  text-align: center;
`;
