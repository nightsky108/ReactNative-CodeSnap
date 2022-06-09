import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import createSagaMiddleware from 'redux-saga';
import reduxReset from 'redux-reset';

import thunk from 'redux-thunk';
import logger from 'redux-logger';

import rootReducer from './rootReducer';
import rootSaga from './rootSaga';
import Reactotron from './ReactotronConfig';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['checkout'],
  // timeout: 0,
  version: 1,
};

const sagaMiddleware = createSagaMiddleware();
const devMode = process.env.NODE_ENV === 'development';

const persistedReducer = persistReducer(persistConfig, rootReducer);
const middleware = [
  ...getDefaultMiddleware({
    thunk: true,
    serializableCheck: false,
    immutableCheck: {
      warnAfter: 600,
    },
  }),
  sagaMiddleware,
  thunk,
];
const enhancers = [reduxReset()];
if (devMode) {
  //  middleware.push(logger);
  enhancers.push(Reactotron.createEnhancer());
}
const store = configureStore({
  reducer: persistedReducer,
  devTools: devMode,
  middleware,
  enhancers,
});
sagaMiddleware.run(rootSaga);
const persister = persistStore(store);
export function getPersister() {
  return persister;
}
export { store, persister };
