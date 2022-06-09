import { createSelector } from '@reduxjs/toolkit';

export const checkout = state => state.checkout;

export const checkoutOneItemInputSelector = createSelector(
  checkout,
  data => data.checkoutOneItemInput || {},
);
