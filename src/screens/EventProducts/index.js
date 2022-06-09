import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, ActivityIndicator, InteractionManager } from 'react-native';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
//= ==third party plugins=======
import { useDispatch, useSelector } from 'react-redux';

import { Icon, Button } from 'react-native-elements';
import { useQuery, NetworkStatus } from '@apollo/client';
import { useTranslation } from 'react-i18next';

//= ==custom components & containers  =======
import { Content, Container, JitengHeaderContainer } from '@components';

//= ======selectors==========================
import { productCategoryFilterSelector } from '@modules/product/selectors';

//= ======reducer actions====================
//= =====hook data================================
import { useTopProductCategories } from '@data/useProductCategories';
import { useSettingContext } from '@contexts/SettingContext';

//= ======Query ====================

import { FETCH_PRODUCT_PREVIEWS } from '@modules/product/graphql';

//= ==========apis=======================

//= =============utils==================================
import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';

//= =============styles==================================
import { Colors } from '@theme';
import { SearchBarContainer, RowSpaceBetween } from '@src/common/StyledComponents';

//= =====inner component=======================
import { ProductCard, FilterHeader } from './components';

import { styles } from './styles';
// import { StyleSheetFactory } from './styles';

// AssetType
//= =============images & constants ===============================
//= ============import end ====================
const faker = require('faker');

faker.locale = 'zh_CN';

const CotainerSize = getAdjustSize({ width: 167, height: 251 });
const ProductImageSize = getAdjustSize({ width: 167, height: 170 });

const SubHeader = () => {};

const EventProducts = ({ navigation, route }) => {
  //= ========Hook Init===========
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const categoryId = route?.params?.categoryId;
  const fetchingMore = useRef(false);
  // const styles = StyleSheetFactory({ theme });
  //= ========= Props Section========
  const categoryFilter = useSelector(state => productCategoryFilterSelector(state));
  //= ======== State Section========
  const [searchQuery, setSearchQuery] = useState('');
  const [focusCategoryId, setFocusCategoryId] = useState(null);
  const [filter, setFilter] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalProductCount, setTotalProductCount] = useState(0);
  // const { userCurrencyISO } = useUserSettings();
  const { userCurrencyISO, userLanguage } = useSettingContext();
  const keyExtractor = useCallback(item => item?.id, []);

  //= ========= GraphQl query Section========
  const { topProductCategories } = useTopProductCategories();

  const { loading, fetchMore, refetch, networkStatus } = useQuery(FETCH_PRODUCT_PREVIEWS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    nextFetchPolicy: 'cache-first',
    variables: {
      skip: 0,
      limit: 10,
      feature: 'CREATED_AT',
      sortType: 'DESC',
      category: [categoryId],
      currency: userCurrencyISO,
      language: userLanguage,
    },
    onCompleted: data => {
      const {
        collection,
        pager: { total },
      } = data.products;
      setProducts(collection);
      setTotalProductCount(total);
      // setFetchingMore(false);
      fetchingMore.current = false;
    },
    onError: error => {
      fetchingMore.current = false;
      console.log('fetch livestreamList error', error);
    },
  });
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
          category: [categoryId],
          currency: userCurrencyISO,
        },
      });
    });
    return () => task.cancel();
  }, [categoryId, fetchMore, products.length, totalProductCount, userCurrencyISO]);

  useEffect(() => {
    setFilter(categoryFilter);
    return () => {};
  }, [categoryFilter]);
  const onEndReachedCalledDuringMomentum = useRef(true);

  const onEndReached = ({ distanceFromEnd }) => {
    console.log('fetchMoreProducts', onEndReachedCalledDuringMomentum.current);
    if (!onEndReachedCalledDuringMomentum.current && !fetchingMore.current) {
      fetchMoreProducts();
      onEndReachedCalledDuringMomentum.current = true;
    }
  };
  const onMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentum.current = false;
  };
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
  //= ========= Use Effect Section========
  return (
    <Container>
      <JitengHeaderContainer>
        <RowSpaceBetween full height={hp(44)}>
          <Icon
            name="left"
            type="antdesign"
            color={Colors.white}
            containerStyle={{ marginHorizontal: wp(15) }}
            onPress={() => {
              navigation.goBack();
            }}
          />

          <SearchBarContainer
            placeholder={t('common:search')}
            onChangeText={setSearchQuery}
            value={searchQuery}
            containerStyle={{
              marginHorizontal: wp(15),
              flexGrow: 1,
            }}
          />
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
          />
        </RowSpaceBetween>
      </JitengHeaderContainer>
      <FilterHeader categories={topProductCategories} />
      {loading && !fetchingMore?.current ? (
        <Content style={{ flex: 0 }} contentContainerStyle={{ flex: 1 }}>
          <ActivityIndicator color="black" size="large" style={{ flex: 1, alignSelf: 'center' }} />
        </Content>
      ) : (
        <Content
          contentContainerStyle={styles.contentContainerStyle}
          style={styles.contentView}
          isList={true}
          data={products}
          renderItem={({ item }) => <ProductCard product={item} />}
          extraData={products.length}
          keyExtractor={keyExtractor}
          onEndReached={onEndReached}
          onMomentumScrollBegin={onMomentumScrollBegin}
          numColumns={2}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ justifyContent: 'space-between', marginTop: hp(10) }}
          onRefresh={refetch}
          refreshing={networkStatus === NetworkStatus.refetch}
          ListFooterComponent={renderFooter}
        />
      )}
    </Container>
  );
};

export default EventProducts;
const HeaderBox = styled(RowSpaceBetween)`
  align-self: center;
  background-color: ${Colors.white};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  height: ${hp(47)}px;
`;
const FilterButton = styled(Button).attrs({
  buttonStyle: {
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
  },
  titleStyle: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(12),
    lineHeight: adjustFontSize(22),
    color: Colors.grey1,
    textAlign: 'center',
  },
  // containerStyle: { marginRight: 10 },
})``;
const HamburgerButton = styled(Button).attrs({
  buttonStyle: {
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
  },
})``;
