import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { View, ActivityIndicator, InteractionManager } from 'react-native';

//= ==third party plugins=======

import { Text, Icon } from 'react-native-elements';

import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, NetworkStatus } from '@apollo/client';

//= ==custom components & containers  =======
import { Content, Container, JitengHeaderContainer } from '@components';
import { JitengHeader } from '@containers';
//= ======selectors==========================
import { productCategoryFilterSelector } from '@modules/product/selectors';

//= ======reducer actions====================
//= ======Query ====================

import { FETCH_PRODUCT_PREVIEWS } from '@modules/product/graphql';
//= ==========apis=======================
//= =====hook data================================
import { useTopProductCategories } from '@data/useProductCategories';
import { useSettingContext } from '@contexts/SettingContext';

//= =============utils==================================

//= =============styles==================================
import { Colors } from '@theme';
import { styles } from './styles';

// import { StyleSheetFactory } from './styles';
import { CategoryFilterHeader, BannerPanel } from './containers';
import { ProductItem } from './components';
// AssetType
//= =============images & constants ===============================
//= ============import end ====================
const HeaderContent = () => {
  return (
    <>
      <BannerPanel />
    </>
  );
};
const LiveProductsHome = ({ navigation, route }) => {
  //= ========Hook Init===========
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  // const styles = StyleSheetFactory({ theme });
  //= ========= Props Section========
  const { topProductCategories } = useTopProductCategories();
  const fetchingMore = useRef(false);
  // const styles = StyleSheetFactory({ theme });
  //= ========= Props Section========
  const categoryFilter = useSelector(state => productCategoryFilterSelector(state));
  //= ======== State Section========
  const [focusCategoryId, setFocusCategoryId] = useState(null);
  const [filter, setFilter] = useState([]);
  // const [products, setProducts] = useState([]);
  // const [totalProductCount, setTotalProductCount] = useState(0);
  // const { userCurrencyISO } = useUserSettings();
  const { userCurrencyISO, userLanguage } = useSettingContext();
  const keyExtractor = useCallback(item => item?.id, []);
  //= ======== State Section========
  //= ========= GraphQl query Section========
  //= ========= Use Effect Section========
  const {
    loading,
    fetchMore,
    refetch,
    networkStatus,
    data: productData,
  } = useQuery(FETCH_PRODUCT_PREVIEWS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    nextFetchPolicy: 'cache-first',
    variables: {
      skip: 0,
      limit: 10,
      feature: 'CREATED_AT',
      sortType: 'DESC',
      // category: categoryFilter,
      currency: userCurrencyISO,
      language: userLanguage,
    },
    onCompleted: data => {
      /*  const {
        collection,
        pager: { total },
      } = data.products;
      setProducts(collection);
      setTotalProductCount(total);
      // setFetchingMore(false); */
      fetchingMore.current = false;
    },
    onError: error => {
      fetchingMore.current = false;
      console.log('fetch livestreamList error', error);
    },
  });
  const { products, totalProductCount } = useMemo(() => {
    if (!productData) {
      return { products: [], totalProductCount: 0 };
    } else {
      const {
        collection,
        pager: { total },
      } = productData.products;
      return { products: collection, totalProductCount: total };
    }
  }, [productData]);
  const fetchMoreProducts = useCallback(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      console.log('fetchMoreProducts init');
      if (fetchingMore.current || products.length >= totalProductCount) {
        return;
      }
      console.log('call fetchMoreProducts');
      // setFetchingMore(true);
      fetchingMore.current = true;
      fetchMore({
        variables: {
          skip: products.length,
          limit: 10,
          feature: 'CREATED_AT',
          sortType: 'DESC',
          // category: categoryFilter,
          currency: userCurrencyISO,
        },
      });
    });
    return () => task.cancel();
  }, [fetchMore, products, totalProductCount, userCurrencyISO]);

  useEffect(() => {
    setFilter(categoryFilter);
    return () => {};
  }, [categoryFilter]);
  const onEndReachedCalledDuringMomentum = useRef(true);

  const onEndReached = ({ distanceFromEnd }) => {
    console.log('fetchMoreProducts', onEndReachedCalledDuringMomentum.current);
    if (!onEndReachedCalledDuringMomentum.current && !fetchingMore.current) {
      // fetchMoreProducts();
      onEndReachedCalledDuringMomentum.current = true;
    }
  };
  const onMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentum.current = false;
  };
  const renderHeaderContent = useCallback(() => {
    return <HeaderContent />;
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
  const renderItem = useCallback(({ item, index }) => {
    return <ProductItem product={item} />;
  }, []);
  return (
    <Container>
      <JitengHeader />
      <JitengHeaderContainer isTop={false}>
        <CategoryFilterHeader categoryList={topProductCategories} />
      </JitengHeaderContainer>
      <Content
        contentContainerStyle={styles.contentContainerStyle}
        style={styles.contentView}
        isList={true}
        data={products}
        renderItem={renderItem}
        ListHeaderComponent={renderHeaderContent}
        extraData={products.length}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        onMomentumScrollBegin={onMomentumScrollBegin}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
        initialNumToRender={6}
        windowSize={5}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={30}
        removeClippedSubviews={false}
        onEndReachedThreshold={0.1}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginTop: 10,
          paddingHorizontal: 15,
        }}
      />
    </Container>
  );
};

export default LiveProductsHome;
