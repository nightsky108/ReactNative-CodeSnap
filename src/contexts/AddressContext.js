import React, { createContext, useContext } from 'react';
import { useAddress } from '@data/useUser';

const AddressContext = createContext({
  deliveryAddresses: [],
  billingAddresses: [],
  activeDeliveryAddress: null,
  activeBillingAddress: null,
  updateActiveDeliveryAddressId: () => {},
  updateActiveBillingAddressId: () => {},
  activeDeliveryAddressId: null,
  activeBillingAddressId: null,
  addDeliveryAddress: () => {},
  updateDeliveryAddress: () => {},
  deleteDeliveryAddress: () => {},
  addBillingAddress: () => {},
  updateBillingAddress: () => {},
  deleteBillingAddress: () => {},
});

export const AddressProvider = ({ children }) => {
  const addressProps = useAddress();
  return <AddressContext.Provider value={addressProps}>{children}</AddressContext.Provider>;
};
export const useAddressContext = () => useContext(AddressContext);
