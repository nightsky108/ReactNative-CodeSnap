import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ActivityIndicator } from 'react-native';

//= ==third party plugins=======
import { useDispatch } from 'react-redux';

import { useQuery, useApolloClient } from '@apollo/client';

import _ from 'lodash';

//= ==custom components & containers  =======
import { Content, Container } from '@components';
import { JitengMidHeader, TopBannerPanel } from '@containers';
import { getAdjustSize, hp } from '@src/common/responsive';

//= ======selectors==========================

//= ======reducer actions====================

//= ======Query ====================
import { FETCH_BANNER_BY_IDENTIFIER } from '@modules/banner/graphql';

import { FETCH_PRODUCT_PREVIEWS } from '@modules/product/graphql';
//= ==========apis=======================
//= =====hook data================================
import { useTopProductCategories } from '@data/useProductCategories';
import { useSettingContext } from '@contexts/SettingContext';

//= =============utils==================================

//= =============styles==================================
import { styles } from './styles';
// import { StyleSheetFactory } from './styles';
import CategoryPanel from './CategoryPanel';
import EventPanel from './EventPanel';
// AssetType
//= =============images & constants ===============================

const BannerHeight = getAdjustSize({ width: 351, height: 75 }).height + hp(10);
const CardHeight = getAdjustSize({ width: 117, height: 140.25 }).height;
const ITEM_HEIGHT = BannerHeight + CardHeight * 3;
//= ============import end ====================
const Banner = {
  thumbnail: {
    url: 'https://picsum.photos/id/1/375/186',
  },
};
const faker = require('faker');

faker.locale = 'zh_CN';

const SalesEvent = ({ navigation, route }) => {
  //= ========Hook Init===========
  const dispatch = useDispatch();
  const scrollTarget = useRef(0);
  const categoryPanelRef = useRef(null);
  const apolloClient = useApolloClient();
  const { data: bannerData } = useQuery(FETCH_BANNER_BY_IDENTIFIER, {
    variables: {
      identifier: 'a',
    },
  });
  // const { userCurrencyISO } = useUserSettings();
  const { userCurrencyISO, userLanguage } = useSettingContext();
  // const styles = StyleSheetFactory({ theme });
  //= ========= Props Section========
  //= ======== State Section========
  const [pending, setPending] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const { topProductCategories } = useTopProductCategories();
  const [productCategoryPreviews, setProductCategoryPreviews] = useState([]);

  //= ========= GraphQl query Section========

  useEffect(() => {
    const fetchFullData = async () => {
      try {
        const data = await Promise.all(
          _.map(topProductCategories, async item => {
            const {
              data: { products },
            } = await apolloClient.query({
              query: FETCH_PRODUCT_PREVIEWS,
              variables: {
                category: [item?.id],
                skip: 0,
                limit: 6,
                currency: userCurrencyISO,
                language: userLanguage,
              },
            });
            return { categoryId: item?.id, products: products?.collection || [] };
          }),
        );
        let currentOffset = 0;
        const previews = _.compact(
          _.map(topProductCategories, cat => {
            const { products } = _.findLast(data, item => item?.categoryId === cat?.id) || [];
            if (products.length > 0) {
              const newOffset = Math.ceil(products.length / 3) * CardHeight + BannerHeight;
              const preOffset = currentOffset;
              currentOffset = preOffset + newOffset;

              return { ...cat, products, offset: preOffset };
            } else {
              return null;
            }
          }),
        );
        setPending(false);
        setProductCategoryPreviews(previews);
      } catch (error) {
        setPending(false);
      }
    };
    if (topProductCategories.length > 0) {
      fetchFullData();
    }

    return () => {};
  }, [apolloClient, topProductCategories]);

  //= ========= Use Effect Section========
  const onScrollPanel = (id, offset) => {
    categoryPanelRef.current?._root?.scrollToPosition(0, offset);
    setActiveCategoryId(id);
  };
  const onGoToEventProducts = useCallback(id => {
    navigation.navigate('EventProducts', { categoryId: id });
  }, []);
  const keyExtractor = useCallback(item => item.id, []);
  const renderItem = useCallback(({ item, index }) => {
    return (
      <EventPanel
        events={item?.products}
        categoryId={item?.id}
        title={item.name}
        index={index}
        onPressItem={onGoToEventProducts}
      />
    );
  }, []);

  return (
    <Container>
      <JitengMidHeader
        onLeftPress={() => {
          navigation.goBack();
        }}
      />

      {bannerData?.bannerByIdentifier ? (
        <TopBannerPanel banner={bannerData?.bannerByIdentifier} />
      ) : null}

      <CategoryPanel
        categories={productCategoryPreviews}
        onSelectCategory={onScrollPanel}
        activeCategoryId={activeCategoryId}
      />
      {pending ? (
        <Content style={{ flex: 0 }} contentContainerStyle={{ flex: 1 }}>
          <ActivityIndicator color="black" size="large" style={{ flex: 1, alignSelf: 'center' }} />
        </Content>
      ) : (
        <Content
          contentContainerStyle={styles.contentContainerStyle}
          showsVerticalScrollIndicator={false}
          isList={true}
          ref={categoryPanelRef}
          style={styles.contentView}
          data={productCategoryPreviews}
          renderItem={renderItem}
          extraData={productCategoryPreviews.length}
          keyExtractor={keyExtractor}
          removeClippedSubviews={true} // Unmount components when outside of window
          initialNumToRender={1} // Reduce initial render amount
          maxToRenderPerBatch={1} // Reduce number in each render batch
          updateCellsBatchingPeriod={250} // Increase time between renders
          windowSize={3} // Reduce the window size
        />
      )}
    </Container>
  );
};

export default SalesEvent;
