import { put, call, takeLatest } from 'redux-saga/effects';

import { getPersister } from '@store/store';
import { getApolloClient } from '@src/apollo';
import {
  SIGNIN_PHONE,
  UPDATE_USER_SETTINGS,
  ADDUSER_BY_PHONE,
  UPDATE_USER,
  GET_USER_ID,
} from './graphql';
import {
  signInByPhone,
  signInByPhoneSuccess,
  signInByPhoneError,
  signUpByPhone,
  signUpByPhoneError,
  signUpByPhoneSuccess,
  setUserId,
  updateUser,
  signOut,
  resetUser,
  setAuthToken,
} from './slice';

function* updateUserSettingsSaga({ payload }) {
  const { pushNotifications, language, currency, measureSystem } = payload;
  try {
    const apolloClient = yield call(getApolloClient);
    const { data } = yield call(apolloClient.mutate, {
      mutation: UPDATE_USER_SETTINGS,
      variables: { pushNotifications, language, currency, measureSystem },
    });
  } catch (e) {}
}

function* signInByPhoneSaga({ payload }) {
  const { phone, countryCode, password, successCB, failureCB } = payload;
  try {
    const apolloClient = yield call(getApolloClient);
    const { data: authToken } = yield call(apolloClient.mutate, {
      mutation: SIGNIN_PHONE,
      variables: { phone, password },
    });

    yield put(setAuthToken({ authToken: authToken.generateAccessTokenByPhone }));

    const {
      data: {
        me: { id },
      },
    } = yield call(apolloClient.query, {
      query: GET_USER_ID,
    });

    yield put(setUserId({ userId: id }));
    yield put(signInByPhoneSuccess());
    yield call(successCB);
  } catch (e) {
    console.log('signin phone error', e.message);
    yield call(failureCB);
    yield put(signInByPhoneError());
  }
}

function* signUpByPhoneSaga({ payload }) {
  const { phone, countryCode, password, email, name, successCB, failureCB } = payload;
  try {
    const apolloClient = yield call(getApolloClient);
    const { data: userData } = yield call(apolloClient.mutate, {
      mutation: ADDUSER_BY_PHONE,
      variables: { phone, countryCode, password },
    });

    const { data: authToken } = yield call(apolloClient.mutate, {
      mutation: SIGNIN_PHONE,
      variables: { phone, password },
    });
    yield put(setAuthToken({ authToken: authToken.generateAccessTokenByPhone }));
    const {
      data: { updateUser: updatedData },
    } = yield call(apolloClient.mutate, {
      mutation: UPDATE_USER,
      variables: { ...userData.addUserByPhone, email, name, countryCode },
    });
    yield put(updateUser({ user: updatedData }));
    yield put(signUpByPhoneSuccess());
    yield call(successCB);
  } catch (e) {
    console.log('signup phone error', e.message);
    yield call(failureCB);
    yield put(signUpByPhoneError());
  }
}

function* signOutSaga() {
  try {
    yield put(resetUser());
    const apolloClient = yield call(getApolloClient);

    const persistor = yield call(getPersister);
    yield call(() => {
      setTimeout(() => persistor.purge(), 200);
    });
    yield call(apolloClient.resetStore);
  } catch (error) {
    console.log('signout error', error.message);
  }
}

export default function* authSaga() {
  yield takeLatest(signInByPhone.type, signInByPhoneSaga);
  yield takeLatest(signUpByPhone.type, signUpByPhoneSaga);
  yield takeLatest(signOut.type, signOutSaga);
}
