import React, { createContext, useContext } from 'react';
import { usePaymentMethods } from '@data/useCheckout';

const PaymentMethodsContext = createContext({
  paymentMethods: [],
  addPaymentMethod: () => {},
  addNewCard: () => {},
  updateCard: () => {},
  deleteCard: () => {},
  checkoutProcessing: () => {},
});

export const PaymentMethodsProvider = ({ children }) => {
  const paymentMethodsProps = usePaymentMethods();
  return (
    <PaymentMethodsContext.Provider value={paymentMethodsProps}>
      {children}
    </PaymentMethodsContext.Provider>
  );
};
export const usePaymentMethodsContext = () => useContext(PaymentMethodsContext);
