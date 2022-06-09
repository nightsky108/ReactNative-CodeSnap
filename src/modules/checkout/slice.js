import { createSlice, createAction } from '@reduxjs/toolkit';
import Reactotron from 'reactotron-react-native';
import _ from 'lodash';

const initState = {
  checkoutOneItemInput: {
    deliveryRate: null,
    product: null,
    productAttribute: null,
    quantity: 0,
    productInfo: null,
    attributeInfo: null,
  },
};

const productSlice = createSlice({
  name: 'checkout',
  initialState: initState,
  reducers: {
    clearCheckOutOneItemInput: (state, action) => {
      state.checkoutOneItemInput = {
        deliveryRate: null,
        product: null,
        productAttribute: null,
        quantity: 0,
        productInfo: null,
        attributeInfo: null,
      };
    },
    setCheckOutOneItemInput: (state, action) => {
      const { checkoutInput } = action.payload;
      const { product, productAttribute, quantity, deliveryRate, productInfo, attributeInfo } =
        checkoutInput;
      const originData = state.checkoutOneItemInput;

      state.checkoutOneItemInput = {
        deliveryRate: deliveryRate || originData?.deliveryRate,
        product: product || originData?.product,
        productAttribute:
          productAttribute === undefined ? originData?.productAttribute : productAttribute,
        productInfo: productInfo === undefined ? originData?.productInfo : productInfo,
        attributeInfo: attributeInfo === undefined ? originData?.attributeInfo : attributeInfo,
        quantity: quantity || originData?.quantity,
      };
    },
  },
});

export const { setCheckOutOneItemInput, clearCheckOutOneItemInput } = productSlice.actions;

export default productSlice.reducer;
