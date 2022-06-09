import React, { useEffect } from 'react';
import { Image, Platform, Linking, Alert, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { Colors } from '@theme';
import { adjustFontSize } from '@src/common/responsive';

import { authTokenSelector } from '@modules/auth/selectors';
import { CartProvider } from '@contexts/CartContext';
import { CheckoutInputContextProvider } from '@contexts/CheckoutInputContext';
import { PaymentMethodsProvider } from '@contexts/PaymentMethodsContext';
import { AddressProvider } from '@contexts/AddressContext';

//= ================= screen components=============================
import SignIn from '@screens/AuthModule/SignIn';
import SignUp from '@screens/AuthModule/SignUp';
import PhoneVerify from '@screens/AuthModule/PhoneVerify';
/**
 * Home Tab Module screen
 */
import GetLiveHome from '@src/screens/HomeModule/GetLiveModule/GetLiveHome';

import ShopLiveHome from '@src/screens/HomeModule/ShopLiveModule/ShopLiveHome';
import BrowseLiveStream from '@src/screens/HomeModule/ShopLiveModule/BrowseLiveStream';

import PortalHome from '@src/screens/HomeModule/PortalModule/PortalHome';
import LiveProductsHome from '@src/screens/HomeModule/LiveProductsModule/LiveProductsHome';
import NewsFeedHome from '@src/screens/HomeModule/NewsFeedModule/NewsFeedHome';

/**
 * PostLive stack screens
 */

import PostLive from '@src/screens/PostLive';

/**
 * Home stack screens
 */

import FashionEvent from '@src/screens/HomeModule/PortalModule/FashionEvent';
import SalesEvent from '@src/screens/HomeModule/PortalModule/SalesEvent';
/**
 * Product Details screens
 */
import ProductDetail from '@screens/ProductDetail';

/**
 * Categoty screen
 */
import Category from '@screens/Category';
/**
 * Following/Follower sellers screen
 */
import FollowSellers from '@screens/FollowSellers';
/**
 * EventProducts screen
 */
import EventProducts from '@screens/EventProducts';
import CheckoutOneTime from '@screens/CheckoutOneTime';
/**
Cart
 */
import Cart from '@screens/Cart';
import CheckoutComplete from '@screens/CheckoutComplete';
import CheckoutAddressManage from '@screens/CheckoutAddressManage';

/**
Manage Products Stack
 */

import ManageProduct from '@screens/ManageProduct';
import SellerProductList from '@screens/SellerProductList';

/**
Buyer DashBoard stack
 */
import BuyerOrderList from '@screens/BuyerOrderList';
import PurchaseOrderDetail from '@screens/PurchaseOrderDetail';
import TrackOrder from '@screens/TrackOrder';
/**
SellerInfoDetail DashBoard stack
 */
import SellerInfoDetail from '@screens/SellerInfoDetail';

//= ===========icons=============================

import Images from '@assets/images';
import { SettingProvider } from '@contexts/SettingContext';
import DrawerContent from './DrawerContent';

//= ===========Home Tab Module==================================

//= ================= screen components end=============================

const Stack = createStackNavigator();
// const Tab = createMaterialBottomTabNavigator();
const Tab = createBottomTabNavigator();
const NativeStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const { width } = Dimensions.get('screen');

const getTabBarVisibility = route => {
  const routeName = getFocusedRouteNameFromRoute(route);
  if (routeName === 'BrowseLiveStream') {
    return false;
  }
  return true;
};
const horizontalAnimation = {
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
      initialRouteName="SignIn">
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="PhoneVerify" component={PhoneVerify} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};
const PortalStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
      initialRouteName="PortalHome">
      <Stack.Screen name="PortalHome" component={PortalHome} />
      <Stack.Screen name="FashionEvent" component={FashionEvent} />
      <Stack.Screen name="SalesEvent" component={SalesEvent} />
    </Stack.Navigator>
  );
};
const ShopLiveStack = ({ navigation, route }) => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
      initialRouteName="ShopeLiveHome">
      <Stack.Screen name="ShopeLiveHome" component={ShopLiveHome} />
      <Stack.Screen name="BrowseLiveStream" component={BrowseLiveStream} />
    </Stack.Navigator>
  );
};
const GetLiveStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
      initialRouteName="GetLiveHome">
      <Stack.Screen name="GetLiveHome" component={GetLiveHome} />
    </Stack.Navigator>
  );
};

const PostLiveStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
      initialRouteName="PostLive">
      <Stack.Screen name="PostLive" component={PostLive} />
    </Stack.Navigator>
  );
};
const LiveProductsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
      initialRouteName="LiveProductsHome">
      <Stack.Screen name="LiveProductsHome" component={LiveProductsHome} />
    </Stack.Navigator>
  );
};
const NewsFeedStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
      initialRouteName="NewsFeedHome">
      <Stack.Screen name="NewsFeedHome" component={NewsFeedHome} />
    </Stack.Navigator>
  );
};
const CartStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
      initialRouteName="Cart">
      <Stack.Screen name="Cart" component={Cart} />
    </Stack.Navigator>
  );
};
const CheckoutStack = () => {
  return (
    <CheckoutInputContextProvider>
      <Stack.Navigator
        screenOptions={{ headerShown: false, gestureEnabled: false }}
        initialRouteName="ProductDetail">
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetail}
          // options={horizontalAnimation}
        />
        <Stack.Screen
          name="CheckoutOneTime"
          component={CheckoutOneTime}
          // options={horizontalAnimation}
        />
      </Stack.Navigator>
    </CheckoutInputContextProvider>
  );
};
const OrderStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
      initialRouteName="TrackOrder">
      <Stack.Screen name="BuyerOrderList" component={BuyerOrderList} />
      <Stack.Screen name="PurchaseOrderDetail" component={PurchaseOrderDetail} />
      <Stack.Screen name="TrackOrder" component={TrackOrder} />
    </Stack.Navigator>
  );
};

const HomeBottomTab = React.memo(({ navigation, route }) => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        lazy: true,
        tabBarHideOnKeyboard: false,
        tabBarActiveTintColor: Colors.brandRed,
        tabBarInactiveTintColor: Colors.grey4,
        tabBarLabelStyle: {
          fontSize: adjustFontSize(11),
          lineHeight: adjustFontSize(14.52),
          paddingBottom: Platform.OS === 'android' ? 9 : 0,
        },
        tabBarStyle: Platform.OS === 'android' ? { height: 60 } : {},

        tabBarShowIcon: true,
      }}
      backBehavior="none"
      initialRouteName="GetLiveStack">
      <Tab.Screen
        name="PortalStack"
        component={PortalStack}
        options={{
          tabBarLabel: t('menu:mainBottom:Home page'),
          tabBarIcon: ({ color, size }) => (
            <Image
              source={Images.portalBMenuIcon}
              resizeMode="contain"
              style={{ tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ShopLiveStack"
        component={ShopLiveStack}
        options={({ navigation, route }) => ({
          tabBarLabel: t('menu:mainBottom:On-site shopping'),
          tabBarIcon: ({ color, size }) => (
            <Image
              source={Images.shopBMenuIcon}
              resizeMode="contain"
              style={{ tintColor: color }}
            />
          ),

          tabBarStyle: {
            display: getTabBarVisibility(route) ? 'flex' : 'none',
            backgroundColor: Colors.backgroundColor,
          },
        })}
      />
      <Tab.Screen
        name="GetLiveHome"
        component={GetLiveHome}
        options={{
          tabBarLabel: t('menu:mainBottom:Live broadcast'),
          tabBarIcon: ({ color, size }) => (
            <Image
              source={Images.getLiveBMenuIcon}
              resizeMode="contain"
              style={{ tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="LiveProductsStack"
        component={LiveProductsStack}
        options={{
          tabBarLabel: t('menu:mainBottom:On-site products'),
          tabBarIcon: ({ color, size }) => (
            <Image
              source={Images.productsBMenuIcon}
              resizeMode="contain"
              style={{ tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="NewsFeedStack"
        component={NewsFeedStack}
        options={{
          tabBarLabel: t('menu:mainBottom:News'),
          tabBarIcon: ({ color, size }) => (
            <Image
              source={Images.newsBMenuIcon}
              resizeMode="contain"
              style={{ tintColor: color }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
});

const SellerProductStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
      initialRouteName="SellerProductList">
      <Stack.Screen name="SellerProductList" component={SellerProductList} />
      <Stack.Screen name="ManageProduct" component={ManageProduct} />
    </Stack.Navigator>
  );
};

const MainStack = () => {
  /* const handleDeepLink = async url => {
    if (url) {
      console.log('handleDeepLink url', url);
    }
  };

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      handleDeepLink(initialUrl);
    };
    getUrlAsync();

    const urlCallback = event => {
      handleDeepLink(event.url);
    };
    Linking.addEventListener('url', urlCallback);
    return () => Linking.removeEventListener('url', urlCallback);
  }, []); */
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
      initialRouteName="HomeBottomTab">
      <Stack.Screen name="HomeBottomTab" component={HomeBottomTab} />
      <Stack.Screen name="Category" component={Category} options={horizontalAnimation} />
      <Stack.Screen name="FollowSellers" component={FollowSellers} />
      <Stack.Screen name="EventProducts" component={EventProducts} />
      <Stack.Screen name="CheckoutStack" component={CheckoutStack} options={horizontalAnimation} />
      <Stack.Screen name="CartStack" component={CartStack} options={horizontalAnimation} />
      <Stack.Screen name="CheckoutAddressManage" component={CheckoutAddressManage} />
      <Stack.Screen name="CheckoutComplete" component={CheckoutComplete} />
      <Stack.Screen name="PostLiveStack" component={PostLiveStack} />
      <Stack.Screen name="OrderStack" component={OrderStack} />
    </Stack.Navigator>
  );
};

const MainDraw = () => {
  return (
    <Drawer.Navigator
      initialRouteName="SellerProductStack"
      useLegacyImplementation
      screenOptions={{
        gestureEnabled: true,
        lazy: true,
        drawerStyle: {
          width: width * 0.75,
        },
        drawerType: 'slide',
        headerShown: false,
      }}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen name="MainStack" component={MainStack} />
      <Drawer.Screen name="SellerProductStack" component={SellerProductStack} />
      <Drawer.Screen name="SellerInfoDetail" component={SellerInfoDetail} />
    </Drawer.Navigator>
  );
};
const AppStack = () => {
  const isLogged = useSelector(state => authTokenSelector(state));

  return (
    <SettingProvider>
      <CartProvider>
        <PaymentMethodsProvider>
          <AddressProvider>
            <NativeStack.Navigator screenOptions={{ headerShown: false, orientation: 'portrait' }}>
              {!isLogged ? (
                <NativeStack.Screen name="Auth" component={AuthStack} />
              ) : (
                <NativeStack.Screen name="Main" component={MainDraw} />
              )}
            </NativeStack.Navigator>
          </AddressProvider>
        </PaymentMethodsProvider>
      </CartProvider>
    </SettingProvider>
  );
};
export default React.memo(AppStack);
