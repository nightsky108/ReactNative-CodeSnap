import React, { useState, useCallback, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { TouchableOpacity } from 'react-native-gesture-handler';

//= ==third party plugins=======
import { useDispatch } from 'react-redux';
import { useQuery, useMutation, NetworkStatus, useSubscription } from '@apollo/client';
import { useNavigation, useRoute } from '@react-navigation/native';

import { Icon, Badge, Button } from 'react-native-elements';
// import { v4 as uuidv4 } from 'uuid';
import { Box, HStack, Center, Text, VStack } from 'native-base';
import { useTranslation } from 'react-i18next';

// import Spinner from 'react-native-loading-spinner-overlay';

//= ==custom components & containers  =======
import { Content, Container, JitengHeaderContainer } from '@components';

//= ======selectors==========================

//= ======reducer actions====================

//= ==========query=======================
import { FETCH_PURCHASE_ORDERS, FETCH_PURCHASE_ORDER_BY_ID } from '@modules/checkout/graphql';

//= =========context==================
import { useSettingContext } from '@contexts/SettingContext';

//= ==========Hook Data=======================
import { usePurchaseOrderList, usePurchaseOrderById } from '@data/usePurchaseOrders';
//= =============utils==================================
import * as constants from '@utils/constant';

//= =============styles==================================
import { Colors, Metrics, Fonts } from '@theme';
import { wp, hp, adjustFontSize } from '@src/common/responsive';
import { OrderItem } from '../components';

// import { StyleSheetFactory } from './styles';
// AssetType
//= =============images & constants ===============================
//= ============import end ====================
const Limit = 10;

const StatusType = { ALL: 0, SHIPPED: 1, DELIVERY: 2 };

const OrderListContent = ({ statuses }) => {
  const navigation = useNavigation();
  //= ========Hook Init===========
  const dispatch = useDispatch();
  // const styles = StyleSheetFactory({ theme });
  //= ========= Props Section========
  const onEndReachedCalledDuringMomentum = useRef(true);
  const keyExtractor = useCallback(item => item?.id, []);
  //= ======== State Section========

  //= ========= GraphQl query Section========
  //= ========= Use Effect Section========
  const { userCurrencyISO, userLanguage } = useSettingContext();
  const [fetchingMore, setFetchingMore] = useState(false);

  /*  navigation.navigate('OrderStack', {
    screen: 'PurchaseOrderDetail',
    params: {
      orderId,
    },
  }); */
  const onNavigateOrderDetail = orderId => {
    navigation.navigate('PurchaseOrderDetail', { orderId });
  };

  const {
    loading,
    fetchMore,
    refetch,
    networkStatus,
    data: purchaseOrdersData,
  } = useQuery(FETCH_PURCHASE_ORDERS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    nextFetchPolicy: 'cache-first',
    variables: {
      skip: 0,
      limit: Limit,
      feature: 'CREATED_AT',
      sortType: 'ASC',
      currency: userCurrencyISO,
      language: userLanguage,
      statuses,
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
    console.log('fetchMorePurchaseOrders');

    fetchMore({
      variables: {
        skip: purchaseOrders.length,
        limit: Limit,
        feature: 'CREATED_AT',
        sortType: 'ASC',
        currency: userCurrencyISO,
        language: userLanguage,
        filter: { statuses },
      },
    });
  }, [
    fetchMore,
    fetchingMore,
    loading,
    purchaseOrders.length,
    statuses,
    totalPurchaseOrdersCount,
    userCurrencyISO,
    userLanguage,
  ]);
  const refreshing = networkStatus === NetworkStatus.refetch;

  const renderItem = useCallback(({ item, index }) => {
    return <OrderItem orderItem={item} onPressItem={onNavigateOrderDetail} />;
  }, []);
  const onEndReached = ({ distanceFromEnd }) => {
    if (!onEndReachedCalledDuringMomentum.current && !fetchingMore && !loading) {
      fetchMorePurchaseOrders();
      onEndReachedCalledDuringMomentum.current = true;
    }
  };
  const onMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentum.current = false;
  };
  return (
    <Content
      contentContainerStyle={styles.contentContainerStyle}
      style={styles.contentView}
      isList={true}
      data={purchaseOrders}
      renderItem={renderItem}
      extraData={purchaseOrders.length}
      keyExtractor={keyExtractor}
      onEndReached={onEndReached}
      onMomentumScrollBegin={onMomentumScrollBegin}
      initialNumToRender={6}
      windowSize={5}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={30}
      removeClippedSubviews={false}
      onEndReachedThreshold={0.1}
      showsVerticalScrollIndicator={false}
    />
  );
};

OrderListContent.propTypes = {
  statuses: PropTypes.arrayOf(PropTypes.string),
};
OrderListContent.defaultProps = {
  statuses: [],
};

export default React.memo(OrderListContent, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.statuses) === JSON.stringify(nextProps.statuses);
});
const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
  },
  contentView: {
    width: '100%',
    backgroundColor: Colors.backgroundColor,
    paddingHorizontal: 10,
  },
});
