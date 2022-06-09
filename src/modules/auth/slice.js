import { createSlice, createAction } from '@reduxjs/toolkit';
import Reactotron from 'reactotron-react-native';

const initState = {
  pending: false,
  isLogin: false,
  authToken: null,
  authError: false,
  activeDeliveryAddressId: null,
  activeBillingAddressId: null,
  userId: null,
  user: {},
};
export const signOut = createAction('jiteng/auth/SIGN_OUT');

const requestReducer = state => {
  state.pending = true;
  state.authError = false;
};
const errorReducer = state => {
  state.pending = false;
};
const successReducer = state => {
  state.pending = false;
};
const authSlice = createSlice({
  name: 'auth',
  initialState: initState,
  reducers: {
    signInByPhone: requestReducer,
    signUpByPhone: requestReducer,

    signInByPhoneError: errorReducer,
    signUpByPhoneError: errorReducer,
    cancelAuthAction: errorReducer,

    signInByPhoneSuccess: successReducer,
    signUpByPhoneSuccess: successReducer,

    setAuthToken: (state, action) => {
      const { payload } = action;
      state.authToken = payload?.authToken;
      const oldState = { ...state };
      if (__DEV__) {
        Reactotron.display({
          name: 'Action',
          value: { ...action, oldState, newState: state },
          preview: action.type,
          important: true,
        });
      }
    },
    setActiveDeliveryAddressId: (state, action) => {
      const { payload } = action;
      state.activeDeliveryAddressId = payload?.activeDeliveryAddressId;
    },
    setActiveBillingAddressId: (state, action) => {
      const { payload } = action;
      state.activeBillingAddressId = payload?.activeBillingAddressId;
    },
    setUserId: (state, action) => {
      const { payload } = action;
      state.userId = payload?.userId;
    },
    updateUser: (state, action) => {
      const { payload } = action;
      state.user = payload?.user;
    },
    resetUser: state => initState,
  },
});

export const {
  signInByPhone,
  signUpByPhone,

  signInByPhoneError,
  signUpByPhoneError,
  cancelAuthAction,

  signInByPhoneSuccess,
  signUpByPhoneSuccess,
  setAuthToken,
  setUserId,
  updateUser,
  resetUser,

  setActiveDeliveryAddressId,
  setActiveBillingAddressId,
} = authSlice.actions;

export default authSlice.reducer;
