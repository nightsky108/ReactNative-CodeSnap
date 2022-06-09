import React, { createContext, useContext } from 'react';
import { useCart } from '@data/useCheckout';

const CartContext = createContext({
  cart: null,
  addProductToCart: () => {},
  updateCartItem: () => {},
  clearCart: () => {},
  deleteCartItem: () => {},
  selectCartItems: () => {},
  callCheckoutCart: () => {},
  fetchCarts: () => {},
});

export const CartProvider = ({ children }) => {
  const cartProps = useCart();
  return <CartContext.Provider value={cartProps}>{children}</CartContext.Provider>;
};
export const useCartContext = () => useContext(CartContext);
