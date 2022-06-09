import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  useQuery,
  useLazyQuery,
  useMutation,
  NetworkStatus,
  useSubscription,
} from '@apollo/client';
import { useSettingContext } from '@contexts/SettingContext';
import { userIdSelector } from '@modules/auth/selectors';
import { useSelector } from 'react-redux';

import { FETCH_PRODUCT_BY_ID, FETCH_PRODUCTS } from '@modules/product/graphql';

const Limit = 12;

export const useProduct = ({ productId }) => {
  // const { userCurrencyISO } = useUserSettings();
  const { userCurrencyISO, userLanguage } = useSettingContext();

  /* const { loading, error, data } = useQuery(FETCH_PRODUCT_BY_ID, {
    fetchPolicy: 'network-only',
    variables: {
      id: productId,
      currency: userCurrencyISO,
      language: userLanguage,
    },
  }); */

  const [fetchProductById, { loading, data, error, called }] = useLazyQuery(FETCH_PRODUCT_BY_ID, {
    fetchPolicy: 'network-only',
    variables: {
      id: productId,
      currency: userCurrencyISO,
      language: userLanguage,
    },
    onError: error => {
      console.log('fetch messages error', error);
    },
  });
  useEffect(() => {
    if (productId && !called) {
      console.log('fetchProductById');
      fetchProductById();
    }
    return () => {};
  }, [called, productId]);
  const product = useMemo(() => {
    if (!data) return null;
    else {
      return data?.product;
    }
  }, [data]);
  return { loading: (called && loading) || !called, error, product };
};
export const useProductList = ({ isSellerProduct = false }) => {
  const { userCurrencyISO, userLanguage } = useSettingContext();
  const userId = useSelector(store => userIdSelector(store));
  const [fetchingMore, setFetchingMore] = useState(false);
  const variables = useMemo(() => {
    const filter = {
      sellers: [],
    };
    if (isSellerProduct) {
      filter.sellers = [userId];
    }
    return filter;
  }, [isSellerProduct, userId]);

  const {
    loading,
    fetchMore,
    refetch,
    networkStatus,
    data: productsData,
  } = useQuery(FETCH_PRODUCTS, {
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    nextFetchPolicy: 'cache-first',
    variables: {
      skip: 0,
      limit: Limit,
      feature: 'CREATED_AT',
      sortType: 'DESC',
      currency: userCurrencyISO,
      language: userLanguage,
      ...variables,
    },
    onCompleted: data => {
      setFetchingMore(false);
    },
    onError: error => {
      setFetchingMore(false);
      console.log('fetch livestreamList error', error);
    },
  });
  const { products, totalProductCount } = useMemo(() => {
    if (!productsData) {
      return { products: [], totalProductCount: 0 };
    } else {
      const {
        collection,
        pager: { total },
      } = productsData.products;
      return { products: collection, totalProductCount: total };
    }
  }, [productsData]);
  const fetchMoreProducts = useCallback(() => {
    if (fetchingMore || products.length >= totalProductCount) {
      return;
    }
    setFetchingMore(true);

    fetchMore({
      variables: {
        skip: products.length,
        limit: Limit,
        feature: 'CREATED_AT',
        sortType: 'DESC',
        currency: userCurrencyISO,
        language: userLanguage,
        ...variables,
      },
    });
  }, [
    fetchMore,
    fetchingMore,
    products.length,
    totalProductCount,
    userCurrencyISO,
    userLanguage,
    variables,
  ]);

  const refreshing = networkStatus === NetworkStatus.refetch;

  return {
    products,
    totalProductCount,
    loading,
    fetchMoreProducts,
    fetchingMoreProducts: fetchingMore,
    refreshing,
    refetch,
  };
};
