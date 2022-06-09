import AsyncStorage from '@react-native-community/async-storage';
import { put, call, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { getApolloClient } from '@src/apollo';
import {
  fetchCarriersSuccess,
  fetchCarriersError,
  fetchCarriers,
  fetchPaymentMethods,
  fetchPaymentMethodsError,
  fetchPaymentMethodsSuccess,
  fetchAvailablePaymentMethods,
  fetchAvailablePaymentMethodsSuccess,
  fetchAvailablePaymentMethodsError,
  fetchSupportedCurrencies,
  fetchSupportedCurrenciesError,
  setSupportedCurrencies,
} from './slice';
import {
  FETCH_CARRIERS,
  FETCH_PAYMENT_METHODS,
  FETCH_AVAILABLE_PAYMENT_METHODS,
  FETCH_SUPPORTED_CURRENCIES,
} from './graphql';

function* fetchSupportedCurrenciesSaga() {
  try {
    const apolloClient = yield call(getApolloClient);
    const { data } = yield call(apolloClient.query, {
      query: FETCH_SUPPORTED_CURRENCIES,
    });
    // const { data } = yield call(request, { query: FETCH_SUPPORTED_CURRENCIES_QUERY });
    yield put(setSupportedCurrencies({ supportedCurrencies: data.supportedCurrencies }));
    return { supportedCurrencies: data.supportedCurrencies };
  } catch (e) {
    yield put(fetchSupportedCurrenciesError());
    return { supportedCurrencies: [] };
  }
}

function* fetchCarriersSaga() {
  try {
    // const { data } = yield call(request, { query: FETCH_CARRIERS_QUERY });
    const apolloClient = yield call(getApolloClient);
    const { data } = yield call(apolloClient.query, {
      query: FETCH_CARRIERS,
    });

    yield put(fetchCarriersSuccess({ carriers: data.carriers }));
    return { carriers: data.carriers };
  } catch (e) {
    yield put(fetchCarriersError());
    return { carriers: [] };
  }
}
function* fetchPaymentMethodsSaga() {
  try {
    const apolloClient = yield call(getApolloClient);
    const { data } = yield call(apolloClient.query, {
      query: FETCH_PAYMENT_METHODS,
    });

    yield put(fetchPaymentMethodsSuccess({ paymentMethods: data.paymentMethods }));
    return { paymentMethods: data.paymentMethods };
  } catch (e) {
    yield put(fetchPaymentMethodsError());
    return { paymentMethods: [] };
  }
}
function* fetchAvailablePaymentMethodsSaga() {
  try {
    // const { data } = yield call(request, { query: FETCH_AVAILABLE_PAYMENT_METHODS_QUERY });
    const apolloClient = yield call(getApolloClient);
    const { data } = yield call(apolloClient.query, {
      query: FETCH_AVAILABLE_PAYMENT_METHODS,
    });
    yield put(
      fetchAvailablePaymentMethodsSuccess({
        availablePaymentMethods: data.availablePaymentMethods,
      }),
    );
    return { availablePaymentMethods: data.paymentProvider };
  } catch (e) {
    yield put(fetchAvailablePaymentMethodsError());
    return { availablePaymentMethods: [] };
  }
}

export default function* assetSaga() {
  yield takeLatest(fetchCarriers.type, fetchCarriersSaga);
  yield takeLatest(fetchPaymentMethods.type, fetchPaymentMethodsSaga);
  yield takeLatest(fetchAvailablePaymentMethods.type, fetchAvailablePaymentMethodsSaga);
  yield takeLatest(fetchSupportedCurrencies.type, fetchSupportedCurrenciesSaga);
}
