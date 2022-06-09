import React, { useState, useCallback, useMemo, useRef } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

//= ==third party plugins=======
import { useDispatch } from 'react-redux';
import { useQuery, useMutation, NetworkStatus, useSubscription } from '@apollo/client';
import { TabView, TabBar } from 'react-native-tab-view';

import { Icon, Badge, Button } from 'react-native-elements';
// import { v4 as uuidv4 } from 'uuid';
import { Box, HStack, Center, Text, VStack } from 'native-base';
import { useTranslation } from 'react-i18next';

// import Spinner from 'react-native-loading-spinner-overlay';

//= ==custom components & containers  =======
import { Content, Container, JitengHeaderContainer } from '@components';
import { OrderModuleHeader } from '@containers';
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
import { styles } from './styles';
// import { StyleSheetFactory } from './styles';
import { OrderListContent } from './containers';
// AssetType
//= =============images & constants ===============================
//= ============import end ====================
const Limit = 10;

const StatusType = { ALL: 0, SHIPPED: 1, DELIVERY: 2 };
const routes = [
  { key: 'All', title: '全部' },
  { key: 'Delivery', title: '待发货' },
  { key: 'Shipped', title: '已发货' },
];

const TabLabel = React.memo(({ route, focused, color }) => {
  return (
    <>
      {focused ? (
        <>
          <Text
            fontFamily="Microsoft YaHei"
            fontWeight="400"
            fontSize="12px"
            lineHeight="16px"
            color={Colors.signUpStepRed}>
            {route.title}
          </Text>

          <Box
            borderRadius="1.5px"
            borderWidth="1.5px"
            borderColor={Colors.signUpStepRed}
            mt="5px"
          />
        </>
      ) : (
        <Text
          fontFamily="Microsoft YaHei"
          fontWeight="400"
          fontSize="12px"
          lineHeight="16px"
          color={Colors.black}>
          {route.title}
        </Text>
      )}
    </>
  );
});

const BuyerOrderList = ({ navigation, route }) => {
  //= ========Hook Init===========
  const dispatch = useDispatch();
  //= ========= Props Section========

  //= ======== State Section========
  const [index, setIndex] = useState(0);

  //= ========= GraphQl query Section========
  //= ========= Use Effect Section========

  const renderLabel = ({ route, focused, color }) => {
    return <TabLabel route={route} focused={focused} />;
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: 'transparent',
      }}
      style={{
        backgroundColor: Colors.grey6,
      }}
      renderLabel={renderLabel}
    />
  );

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'All':
        return <OrderListContent statuses={constants.PurchaseOrderItemStatusFilter.ALL} />;
      case 'Delivery':
        return <OrderListContent statuses={constants.PurchaseOrderItemStatusFilter.DELIVERY} />;
      case 'Shipped':
        return <OrderListContent statuses={constants.PurchaseOrderItemStatusFilter.SHIPPED} />;

      default:
        return null;
    }
  };

  return (
    <Container>
      {/* My Order */}
      <OrderModuleHeader title="我的訂單" />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        animationEnabled={false}
        swipeEnabled={false}
      />
    </Container>
  );
};

export default BuyerOrderList;
