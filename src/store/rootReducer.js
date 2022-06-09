/* import { combineReducers } from 'redux';
import authReducer from '@modules/auth/reducer';
import AsyncStorage from '@react-native-community/async-storage';

import assetReducer from '@modules/asset/reducer';
import productReducer from '@modules/product/reducer';

const appReducer = combineReducers({
    auth: authReducer,
    asset: assetReducer,
    product: productReducer,
});
const rootReducer = (state, action) => {
    if (action.type === 'RESET') {
        // for all keys defined in your persistConfig(s)
        AsyncStorage.removeItem('persist:root');
        return appReducer(undefined, action);
    }
    return appReducer(state, action);
};
export default rootReducer;
 */

import { combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-community/async-storage';

import assetReducer from '@modules/asset/slice';
import authReducer from '@modules/auth/slice';
import productReducer from '@modules/product/slice';
import liveStreamReducer from '@modules/liveStream/slice';
import checkoutReducer from '@modules/checkout/slice';

const appReducer = combineReducers({
  auth: authReducer,
  asset: assetReducer,
  product: productReducer,
  liveStream: liveStreamReducer,
  checkout: checkoutReducer,
});
const rootReducer = (state, action) => {
  if (action.type === 'RESET') {
    // for all keys defined in your persistConfig(s)
    AsyncStorage.removeItem('persist:root');
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};
export default rootReducer;
