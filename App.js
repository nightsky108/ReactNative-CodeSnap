/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Suspense, useEffect } from 'react';
import { StyleSheet, View, PermissionsAndroid, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import { MenuProvider } from 'react-native-popup-menu';
import { enableFlipperApolloDevtools } from 'react-native-flipper-apollo-devtools';
// import Alipay from '@uiw/react-native-alipay';

import { store, persister } from '@store/store';
import SplashScreen from 'react-native-splash-screen';

import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';

import { PersistGate } from 'redux-persist/integration/react';

import { initI18n } from '@src/i18n';

//= ======reducer actions====================

import { navigationRef, isReadyRef } from '@src/RootNavigation';
import AppStack from '@src/router';

//= ======selectors==========================

import { createApolloClient } from './src/apollo';

const publishableKey = 'pk_test_nxx';

const apolloClient = createApolloClient(store);
enableFlipperApolloDevtools(apolloClient);
// Alipay.setAlipaySandbox(true);
const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'Cool Photo App Camera Permission',
      message: 'Cool Photo App needs access to your camera \n so you can take awesome pictures.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // console.log('You can use the camera');
    } else {
      //  console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};
const RootContainer = () => {
  useEffect(() => {
    initI18n();
  }, []);
  return <AppStack />;
};
const App = () => {
  useEffect(() => {
    requestCameraPermission();
    return () => {
      isReadyRef.current = false;
    };
  }, []);
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);

  return (
    <Suspense fallback={null}>
      <NativeBaseProvider>
        <ApolloProvider client={apolloClient}>
          <Provider store={store}>
            <PersistGate
              loading={
                <View style={styles.container}>
                  <ActivityIndicator color="#219653" />
                </View>
              }
              persistor={persister}>
              <MenuProvider>
                <NavigationContainer
                  ref={navigationRef}
                  onReady={() => {
                    isReadyRef.current = true;
                  }}>
                  <RootContainer />
                </NavigationContainer>
              </MenuProvider>
            </PersistGate>
          </Provider>
        </ApolloProvider>
      </NativeBaseProvider>
    </Suspense>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default React.memo(App);
