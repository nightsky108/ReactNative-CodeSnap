import { createSelector } from '@reduxjs/toolkit';

export const auth = state => state.auth;

export const authTokenSelector = createSelector(auth, data => {
  return data.authToken;
});

export const userSelector = createSelector(auth, data => {
  return data.user || {};
});
export const userIdSelector = createSelector(auth, data => {
  return data.userId || null;
});
export const activeDeliveryAddressIdSelector = createSelector(auth, data => {
  return data?.activeDeliveryAddressId || null;
});
export const activeBillingAddressIdSelector = createSelector(auth, data => {
  return data?.activeBillingAddressId || null;
});
