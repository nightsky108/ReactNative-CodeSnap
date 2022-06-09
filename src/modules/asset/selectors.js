import { createSelector } from '@reduxjs/toolkit';

export const asset = state => state.asset;

export const carriersSelector = createSelector(asset, data => data.carriers || []);
export const supportedCurrenciesSelector = createSelector(
  asset,
  data => data.supportedCurrencies || [],
);
export const paymentMethodsSelector = createSelector(asset, data => data.paymentMethods || []);
export const availablePaymentMethodsSelector = createSelector(
  asset,
  data => data.availablePaymentMethods || [],
);
