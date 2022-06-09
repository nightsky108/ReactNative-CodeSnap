import { createSelector } from '@reduxjs/toolkit';

export const product = state => state.product;

export const productFilterSelector = createSelector(product, data => data.filter || {});

export const productCategoryFilterSelector = createSelector(
  productFilterSelector,
  data => data.categoryFilter || [],
);
