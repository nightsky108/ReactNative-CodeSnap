import { createSlice, createAction } from '@reduxjs/toolkit';
import Reactotron from 'reactotron-react-native';
import _ from 'lodash';

const initState = {
  isLoading: false,
  countries: [],
  cities: [],
  carriers: [],
  paymentMethods: [],
  availablePaymentMethods: [],
  supportedCurrencies: [],
};
const requestReducer = state => {
  state.isLoading = true;
};
const errorReducer = state => {
  state.isLoading = false;
};
const supportedCurrenciesReducer = (state, { payload }) => {
  state.supportedCurrencies = payload.supportedCurrencies;
  state.isLoading = false;
};
const assetSlice = createSlice({
  name: 'asset',
  initialState: initState,
  reducers: {
    fetchCarriers: requestReducer,
    fetchPaymentMethods: requestReducer,
    fetchAvailablePaymentMethods: requestReducer,
    fetchSupportedCurrencies: requestReducer,
    fetchCarriersError: errorReducer,
    fetchPaymentMethodsError: errorReducer,
    fetchAvailablePaymentMethodsError: errorReducer,
    fetchSupportedCurrenciesError: errorReducer,
    fetchSupportedCurrenciesSuccess: supportedCurrenciesReducer,
    setSupportedCurrencies: supportedCurrenciesReducer,

    fetchCarriersSuccess: (state, action) => {
      const { payload } = action;
      state.carriers = payload.carriers;
      state.isLoading = false;
    },
    addPaymentMethod: (state, action) => {
      const { payload } = action;
      state.paymentMethods = _.concat(state.paymentMethods, payload.paymentMethod);
    },
    fetchPaymentMethodsSuccess: (state, action) => {
      const { payload } = action;
      state.paymentMethods = payload.paymentMethods;
      state.isLoading = false;
    },
    fetchAvailablePaymentMethodsSuccess: (state, action) => {
      const { payload } = action;
      state.availablePaymentMethods = payload.availablePaymentMethods;
      state.isLoading = false;
    },
    resetAssets: state => initState,
  },
});

export const {
  fetchCarriers,
  fetchPaymentMethods,
  fetchAvailablePaymentMethods,
  fetchSupportedCurrencies,
  fetchCarriersError,
  fetchPaymentMethodsError,
  fetchAvailablePaymentMethodsError,
  fetchSupportedCurrenciesError,
  fetchSupportedCurrenciesSuccess,
  setSupportedCurrencies,
  fetchCarriersSuccess,
  addPaymentMethod,
  fetchPaymentMethodsSuccess,
  fetchAvailablePaymentMethodsSuccess,
  resetAssets,
} = assetSlice.actions;

export default assetSlice.reducer;
