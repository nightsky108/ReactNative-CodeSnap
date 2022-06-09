import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, NetworkStatus, useSubscription } from '@apollo/client';
import { useSettingContext } from '@contexts/SettingContext';

import { useSelector } from 'react-redux';

import { FETCH_PURCHASE_ORDERS, FETCH_PURCHASE_ORDER_BY_ID } from '@modules/checkout/graphql';
import * as constants from '@utils/constant';

const Limit = 10;
export const usePurchaseOrderList = () => {
  const { userCurrencyISO, userLanguage } = useSettingContext();
  const [fetchingMore, setFetchingMore] = useState(false);
  const variables = useMemo(() => {
    const filter = {
      statuses: [],
    };
    return filter;
  }, []);

  const {
    loading,
    fetchMore,
    refetch,
    networkStatus,
    data: purchaseOrdersData,
  } = useQuery(FETCH_PURCHASE_ORDERS, {
    fetchPolicy: 'cache-first',
    // fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    nextFetchPolicy: 'cache-first',
    variables: {
      skip: 0,
      limit: Limit,
      feature: 'CREATED_AT',
      sortType: 'ASC',
      currency: userCurrencyISO,
      language: userLanguage,
      ...variables,
    },
    onCompleted: data => {
      setFetchingMore(false);
    },
    onError: error => {
      setFetchingMore(false);
      console.log('fetch purchase Orders error', error);
    },
  });
  const { purchaseOrders, totalPurchaseOrdersCount } = useMemo(() => {
    if (!purchaseOrdersData) {
      return { purchaseOrders: [], totalPurchaseOrdersCount: 0 };
    } else {
      const {
        collection,
        pager: { total },
      } = purchaseOrdersData.purchaseOrders;
      return { purchaseOrders: collection, totalPurchaseOrdersCount: total };
    }
  }, [purchaseOrdersData]);

  const fetchMorePurchaseOrders = useCallback(() => {
    if (fetchingMore || purchaseOrders.length >= totalPurchaseOrdersCount || loading) {
      return;
    }
    setFetchingMore(true);

    fetchMore({
      variables: {
        skip: purchaseOrders.length,
        limit: Limit,
        feature: 'CREATED_AT',
        sortType: 'ASC',
        currency: userCurrencyISO,
        language: userLanguage,
        ...variables,
      },
    });
  }, [
    fetchMore,
    fetchingMore,
    loading,
    purchaseOrders.length,
    totalPurchaseOrdersCount,
    userCurrencyISO,
    userLanguage,
    variables,
  ]);

  const refreshing = networkStatus === NetworkStatus.refetch;

  return {
    purchaseOrders,
    totalPurchaseOrdersCount,
    loading,
    fetchMorePurchaseOrders,
    fetchingMorePurchaseOrders: fetchingMore,
    refreshing,
    refetch,
  };
};
export const usePurchaseOrderById = ({ purchaseOrderId }) => {
  const { userCurrencyISO, userLanguage } = useSettingContext();

  const { loading, error, data } = useQuery(FETCH_PURCHASE_ORDER_BY_ID, {
    fetchPolicy: 'network-only',
    variables: {
      id: purchaseOrderId,
      currency: userCurrencyISO,
      language: userLanguage,
    },
  });
  const purchaseOrder = useMemo(() => {
    if (!data) return null;
    else {
      return data?.purchaseOrder;
    }
  }, [data]);
  return { loading, error, purchaseOrder };
};
