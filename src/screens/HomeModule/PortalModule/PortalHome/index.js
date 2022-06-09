import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, ActivityIndicator, ScrollView, InteractionManager } from 'react-native';

//= ==third party plugins=======
import { useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import { Box } from 'native-base';

import { Icon, Button } from 'react-native-elements';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';

import { useQuery, useApolloClient, NetworkStatus } from '@apollo/client';

//= ==custom components & containers  =======
import { Content, Container, JitengHeaderContainer } from '@components';
import { JitengHeader, TopBannerPanel } from '@containers';

//= ======selectors==========================

//= ======reducer actions====================

//= =====hook data================================
import { useTopProductCategories } from '@data/useProductCategories';
import { useSettingContext } from '@contexts/SettingContext';
import { useThemes } from '@data/useTheme';
//= =========custom context============================================

//= ======Query ====================

import {
  FETCH_PRODUCT_PREVIEWS,
  FETCH_PRODUCTS_RECOMMENDED_TOME_PREVIEWS,
} from '@modules/product/graphql';
import { FETCH_BANNER_BY_IDENTIFIER } from '@modules/banner/graphql';
import { FETCH_LIVESTREAM_PREVIEWS } from '@modules/liveStream/graphql';
import { FETCH_THEME_PREVIEWS } from '@modules/theme/graphql';
import { FETCH_ORGANIZATIONS_PREVIEWS } from '@modules/organization/graphql';

//= ==========apis=======================

//= =============utils==================================
import * as constants from '@utils/constant';

//= =============styles==================================
import { Colors } from '@theme';
import { adjustFontSize, hp } from '@common/responsive';

import { signOut } from '@src/modules/auth/slice';
import { styles } from './styles';
import EventCard from './EventCard';
import BestSellersCard from './BestSellersCard';
import FashionPanel from './FashionPanel';
import LiveStreamPreviewPanel from './LiveStreamPreviewPanel';
import PopularStoresPanel from './PopularStoresPanel';
import ProductItem from './ProductItem';
// import { StyleSheetFactory } from './styles';

// AssetType
//= =============images & constants ===============================
//= ============import end ====================
const bannerAssetsData = [
  'https://picsum.photos/id/0/375/117',
  'https://picsum.photos/id/1/375/117',
  'https://picsum.photos/id/2/375/117',
];
//= ========test data=========================
const faker = require('faker');

faker.locale = 'zh_CN';

const Banner = {
  thumbnail: {
    url: 'https://picsum.photos/id/1/344/109',
  },
};
const StoreList = Array(6)
  .fill('')
  .map((item, i) => ({
    id: uuidv4(),
    owner: {
      photo: {
        url: faker.image.people(),
      },
    },
    thumbnail: {
      url: faker.image.food(),
    },
    storeName: `${faker.name.firstName()} ${faker.name.lastName()}`,
    storeLocation: `${faker.name.firstName()} ${faker.name.lastName()}`,
  }));
//= ========end data=========================

const CategoryText = styled.Text`
  align-self: center;
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-weight: 400;
  letter-spacing: -0.41px;
  line-height: 22px;
  margin-right: 40px;
`;
const ProductTitleText = styled.Text`
  align-self: flex-start;
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: 19px;
  letter-spacing: -0.41px;
  line-height: 22px;
  margin-bottom: 5px;
  text-align: left;
`;

// export default React.memo(EventCard, propsAreEqual);
const Header = React.memo(({ onNavigateFashionEvents, portalData, onGoToSalesEvent }) => {
  const {
    timeLimitedTheme,
    bestSellerProducts,
    topBanner,
    fashionThemes,
    finishedStreamList,
    onGoingStreamList,
    hotShops,
  } = portalData;
  const { t, i18n } = useTranslation();
  return (
    <Box width="100%" alignItems="center">
      <TopBannerPanel banner={topBanner} onPress={onGoToSalesEvent} />

      <Box
        flexDirection="row"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        my={3}>
        <EventCard theme={timeLimitedTheme} />
        <BestSellersCard products={bestSellerProducts} />
      </Box>

      <FashionPanel onMore={onNavigateFashionEvents} themes={fashionThemes} />
      <Box width="100%" justifyContent="space-between" alignItems="center" my={3}>
        <LiveStreamPreviewPanel
          finishedStreamList={finishedStreamList}
          onGoingStreamList={onGoingStreamList}
        />
      </Box>
      <Box width="100%" my={3}>
        <PopularStoresPanel stores={hotShops} banner={Banner} />
      </Box>
      <Box marginTop={3} width="100%">
        <ProductTitleText>{t('home:you may also like')}</ProductTitleText>
      </Box>
    </Box>
  );
});
const PortalHome = ({ navigation, route }) => {
  //= ========Hook Init===========
  const { t, i18n } = useTranslation();
  const apolloClient = useApolloClient();
  const dispatch = useDispatch();
  const [interactionsComplete, setInteractionsComplete] = useState(false);
  // const { userCurrencyISO } = useUserSettings();
  const { userCurrencyISO, userLanguage } = useSettingContext();
  const liveProductsThemes = useThemes();

  useEffect(() => {
    return () => {};
  }, []);

  // const styles = StyleSheetFactory({ theme });
  //= ======custom context==============================
  //= ========= Props Section========
  const fetchingMore = useRef(false);
  const { topProductCategories } = useTopProductCategories();
  //= ======== State Section========
  const [refreshing, setRefreshing] = useState(false);
  const [headerLoaded, setHeaderLoaded] = useState(false);
  const [recommendProduct, setRecommendProduct] = useState({
    total: 0,
    skip: 0,
    productList: [],
  });
  const { productList, skip, total } = recommendProduct;
  const [portalData, setPortalData] = useState({
    timeLimitedTheme: null,
    bestSellerProducts: [],
    topBanner: null,
    topBanners: [],
    fashionThemes: [],
    finishedStreamList: [],
    onGoingStreamList: [],
    hotShops: [],
  });

  const fetchPortalData = useCallback(async () => {
    try {
      setHeaderLoaded(false);
      const [
        topBanner,
        // topBanners,
        bestSellerProducts,
        timeLimitedThemes,
        organizations,
        fashionThemes,
        finishedStreams,
        onGoingStreams,
      ] = await Promise.all([
        // topBannerData
        apolloClient.query({
          query: FETCH_BANNER_BY_IDENTIFIER,
          fetchPolicy: 'network-only',
          variables: {
            identifier: 'a',
          },
        }),
        // bestSellerProductsData
        apolloClient.query({
          query: FETCH_PRODUCT_PREVIEWS,
          fetchPolicy: 'network-only',
          variables: {
            skip: 0,
            limit: 10,
            feature: constants.ProductSortFeatures.SOLD,
            sort: constants.SortTypeEnum.DESC,
            currency: userCurrencyISO,
            language: userLanguage,
          },
        }),
        // timeLimitedThemeData
        apolloClient.query({
          query: FETCH_THEME_PREVIEWS,
          fetchPolicy: 'network-only',
          variables: {
            themeType: constants.ThemeTypes.LIMITED_TIME,
            skip: 0,
            limit: 10,
          },
        }),
        // organizationsData
        apolloClient.query({
          query: FETCH_ORGANIZATIONS_PREVIEWS,
          fetchPolicy: 'network-only',
          variables: {
            feature: constants.OrganizationSortFeature.ORDER,
            skip: 0,
            limit: 3,
          },
        }),
        /// fashionThemesData
        apolloClient.query({
          query: FETCH_THEME_PREVIEWS,
          fetchPolicy: 'network-only',
          variables: {
            themeType: constants.ThemeTypes.NORMAL,
            feature: constants.ThemeSortFeatures.ORDER,
            sortType: constants.SortTypeEnum.ASC,
            skip: 0,
            limit: 2,
          },
        }),
        // finishedStreamCollection
        apolloClient.query({
          query: FETCH_LIVESTREAM_PREVIEWS,
          fetchPolicy: 'network-only',
          variables: {
            skip: 0,
            limit: 10,
            statuses: [constants.StreamChannelStatus.FINISHED],
          },
        }),
        // onGoingStreamCollection
        apolloClient.query({
          query: FETCH_LIVESTREAM_PREVIEWS,
          fetchPolicy: 'network-only',
          variables: {
            skip: 0,
            limit: 10,
            statuses: [constants.StreamChannelStatus.STREAMING],
          },
        }),
      ]);
      setRefreshing(false);

      setPortalData({
        topBanner: topBanner?.data?.bannerByIdentifier ? topBanner?.data?.bannerByIdentifier : null,
        bestSellerProducts: bestSellerProducts?.data?.products
          ? bestSellerProducts?.data?.products?.collection
          : [],
        timeLimitedTheme: timeLimitedThemes?.data?.themes
          ? timeLimitedThemes?.data?.themes?.collection[0]
          : {},
        hotShops: organizations?.data?.organizations
          ? organizations?.data?.organizations?.collection
          : [],
        fashionThemes: fashionThemes?.data?.themes ? fashionThemes?.data?.themes?.collection : [],
        finishedStreamList: finishedStreams?.data?.liveStreams
          ? finishedStreams?.data?.liveStreams?.collection
          : [],
        onGoingStreamList: onGoingStreams?.data?.liveStreams
          ? onGoingStreams?.data?.liveStreams?.collection
          : [],
      });
      setHeaderLoaded(true);
    } catch (error) {}
  }, []);
  const onCallRefresh = () => {
    setRefreshing(true);
    setRecommendProduct({
      productList: [],
      total: 0,
      skip: 0,
    });
    setTimeout(() => {
      fetchPortalData();
      refetchProducts();
    }, 200);
  };
  useEffect(() => {
    console.log('init fetchPortalData');
    const task = InteractionManager.runAfterInteractions(() => {
      fetchPortalData();
    });
    return () => task.cancel();
  }, []);

  const {
    loading,
    fetchMore,
    refetch: refetchProducts,
    networkStatus,
  } = useQuery(FETCH_PRODUCTS_RECOMMENDED_TOME_PREVIEWS, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    nextFetchPolicy: 'cache-first',
    variables: {
      skip: 0,
      limit: 10,
      currency: userCurrencyISO,
      language: userLanguage,
    },
    onCompleted: data => {
      if (data) {
        const {
          collection,
          pager: { skip, total },
        } = data.productsRecommendedToMe;
        setRecommendProduct({
          productList: collection,
          total,
          skip,
        });
      }

      fetchingMore.current = false;
    },
  });

  const fetchMoreProducts = useCallback(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      if (fetchingMore.current && productList.length >= total) {
        return;
      }
      fetchingMore.current = true;
      fetchMore({
        variables: {
          skip: productList.length,
          limit: 10,
        },
      });
    });
    return () => task.cancel();
  }, [fetchMore, productList.length, total]);

  //= ========= Use Effect Section========
  const onNavigateCategory = () => {
    navigation.navigate('Category', { isProduct: true });
    // dispatch(signOut());
  };
  const onGoToProductDetail = useCallback(
    id => {
      navigation.navigate('CheckoutStack', {
        screen: 'ProductDetail',
        params: {
          productId: id,
        },
      });
      //  navigation.navigate('ProductDetail', { productId: id });
    },
    [navigation],
  );
  const keyExtractor = useCallback(item => item.id, []);
  const onEndReachedCalledDuringMomentum = useRef(true);

  const onEndReached = ({ distanceFromEnd }) => {
    if (!onEndReachedCalledDuringMomentum.current && !fetchingMore.current && !loading) {
      fetchMoreProducts();
      onEndReachedCalledDuringMomentum.current = true;
    }
  };
  const onMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentum.current = false;
  };
  const renderHeaderContent = useCallback(() => {
    const onNavigateFashionEvents = themeId => {
      navigation.navigate('FashionEvent', { themeId });
    };
    const onGoToSalesEvent = () => {
      navigation.navigate('SalesEvent');
    };
    return (
      <Header
        portalData={portalData}
        onNavigateFashionEvents={onNavigateFashionEvents}
        onGoToSalesEvent={onGoToSalesEvent}
      />
    );
  }, [navigation, portalData]);
  const renderItem = useCallback(({ item }) => {
    return <ProductItem product={item} onPressProductItem={onGoToProductDetail} />;
  }, []);
  const renderFooter = useCallback(() => {
    if (!fetchingMore.current) {
      return null;
    }
    return (
      <View style={styles.listFooter}>
        <ActivityIndicator animating size="large" color={Colors.loaderColor} />
      </View>
    );
  }, [fetchingMore]);

  return (
    <Container>
      <JitengHeader title="title" />
      <JitengHeaderContainer isTop={false}>
        <Box flexDirection="row" width="100%" justifyContent="space-between" alignItems="center">
          <Box flexShrink={1} marginX={2}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {topProductCategories.map(item => {
                return <CategoryText key={item.id}>{item.name}</CategoryText>;
              })}
            </ScrollView>
          </Box>

          <Button
            icon={<Icon name="menu" size={20} type="ionicons" color="white" />}
            title={t('home:header:classification')}
            buttonStyle={{
              backgroundColor: Colors.filterNotiRed,
              paddingHorizontal: 10,
            }}
            titleStyle={{
              fontFamily: 'Microsoft YaHei',
              fontSize: adjustFontSize(13),
              lineHeight: adjustFontSize(22),
              letterSpacing: adjustFontSize(-0.41),
              textAlign: 'center',
            }}
            containerStyle={{ marginRight: 10, borderRadius: 20 }}
            onPress={onNavigateCategory}
          />
        </Box>
      </JitengHeaderContainer>

      <Content
        contentContainerStyle={styles.contentContainerStyle}
        isList={true}
        padder
        style={styles.contentView}
        ListHeaderComponent={renderHeaderContent}
        showsVerticalScrollIndicator={false}
        data={productList}
        renderItem={renderItem}
        extraData={productList.length}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        onMomentumScrollBegin={onMomentumScrollBegin}
        numColumns={2}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginTop: hp(10),
        }}
        refreshing={networkStatus === NetworkStatus.refetch || refreshing}
        onRefresh={onCallRefresh}
        ListFooterComponent={renderFooter}
      />
    </Container>
  );
};

export default PortalHome;
