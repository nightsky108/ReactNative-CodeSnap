import React, { createContext, useContext } from 'react';
import { useCheckOutInput } from '@data/useCheckout';

const CheckoutInputContext = createContext({
  checkoutOneItemInput: {},
  isPossibleCheckout: false,
  isPendingCalcRate: false,
  clearCheckOutInput: () => {},
  updateCheckOutInput: () => {},
  callClearDeliveryRate: () => {},
});

export const CheckoutInputContextProvider = ({ children }) => {
  const checkoutInputProps = useCheckOutInput();
  return (
    <CheckoutInputContext.Provider value={checkoutInputProps}>
      {children}
    </CheckoutInputContext.Provider>
  );
};
export const useCheckoutInputContext = () => useContext(CheckoutInputContext);
