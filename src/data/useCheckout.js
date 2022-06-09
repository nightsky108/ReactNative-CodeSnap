import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Linking, StyleSheet, View } from 'react-native';

import _ from 'lodash';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import * as constants from '@utils/constant';

import {
  CALCULATE_DELIVERY_RATES,
  FETCH_CARTS,
  ADD_PRODUCT_TO_CART,
  UPDATE_CART_ITEM,
  CLEAR_CART,
  DELETE_CART_ITEM,
  FETCH_PAYMENT_METHODS,
  ADD_PAYMENT_METHOD_STRIPE,
  ADD_NEW_CARD,
  DELETE_PAYMENT_METHOD,
  UPDATE_PAYMENT_METHOD,
  SELECT_CART_ITEMS,
  CHECKOUT_CART,
} from '@modules/checkout/graphql';
import {
  activeDeliveryAddressIdSelector,
  activeBillingAddressIdSelector,
} from '@modules/auth/selectors';
import { setCheckOutOneItemInput, clearCheckOutOneItemInput } from '@modules/checkout/slice';
import { useSettingContext } from '@contexts/SettingContext';
import { usePrevious } from '@common/usehook';
import { checkoutOneItemInputSelector } from '@modules/checkout/selectors';

export const useCalcDeliveryAddress = () => {
  const [calculateDeliveryRateQuery, { called, loading }] = useMutation(CALCULATE_DELIVERY_RATES);
  // const { userCurrencyISO } = useUserSettings();
  const { userLanguage, userCurrencyISO } = useSettingContext();

  const calculateDeliveryRate = async ({ productId, quantity, deliveryAddress }) => {
    try {
      const {
        data: { calculateDeliveryRates },
      } = await calculateDeliveryRateQuery({
        variables: {
          productId,
          quantity,
          deliveryAddress,
          currency: userCurrencyISO,
        },
      });

      return calculateDeliveryRates[0];
    } catch (error) {}
  };

  return { calculateDeliveryRate, called, loading };
};
export const useCheckOutInput = () => {
  const dispatch = useDispatch();
  const activeDeliveryAddressId = useSelector(state => activeDeliveryAddressIdSelector(state));
  // const activeBillingAddressId = useSelector(state => activeBillingAddressIdSelector(state));
  const checkoutOneItemInput = useSelector(state => checkoutOneItemInputSelector(state));
  const { product, quantity, deliveryRate, productAttribute } = checkoutOneItemInput;
  // const prevActiveDeliveryAddressId = usePrevious(activeDeliveryAddressId);
  // const prevQuantity = usePrevious(quantity);
  const { calculateDeliveryRate, called, loading } = useCalcDeliveryAddress();
  const callCalcRate = async variables => {
    console.log('callCalcRate', new Date());
    try {
      const calcRate = await calculateDeliveryRate(variables);
      dispatch(setCheckOutOneItemInput({ checkoutInput: { deliveryRate: calcRate } }));
      return true;
    } catch (error) {
      return false;
    }
  };
  const delayQueryCall = useRef(_.debounce(variables => callCalcRate(variables), 0)).current;
  const updateCheckOutInput = useCallback(async data => {
    dispatch(setCheckOutOneItemInput({ checkoutInput: data }));
  }, []);

  /* useEffect(() => {
    const isPossibleCalRate = !!(product && quantity > 0 && activeDeliveryAddressId);

    if (isPossibleCalRate) {
      delayQueryCall({
        productId: product,
        quantity,
        deliveryAddress: activeDeliveryAddressId,
      });
    }

    return () => {};
  }, [quantity, activeDeliveryAddressId, product]); */

  const callClearDeliveryRate = useCallback(async () => {
    try {
      const isPossibleCalRate = !!(product && quantity > 0 && activeDeliveryAddressId);

      if (isPossibleCalRate) {
        await delayQueryCall({
          productId: product,
          quantity,
          deliveryAddress: activeDeliveryAddressId,
        });
      }
      return true;
    } catch (error) {
      return false;
    }
  }, [quantity, activeDeliveryAddressId, product]);

  const clearCheckOutInput = useCallback(() => {
    dispatch(clearCheckOutOneItemInput());
  }, []);
  /*  const isPossibleCheckout = useMemo(() => {
    return !!(deliveryRate && product && productAttribute && !(called && loading));
  }, [called, loading, deliveryRate, product, productAttribute]); */
  const isPossibleCheckout = useMemo(() => {
    return !!(product && productAttribute && !(called && loading));
  }, [called, loading, product, productAttribute]);
  const isPendingCalcRate = useMemo(() => {
    return called && loading;
  }, [called, loading]);

  return {
    checkoutOneItemInput,
    clearCheckOutInput,
    updateCheckOutInput,
    isPossibleCheckout,
    isPendingCalcRate,
    callClearDeliveryRate,
  };
};
export const useCart = () => {
  const dispatch = useDispatch();

  const checkoutOneItemInput = useSelector(state => checkoutOneItemInputSelector(state));
  const activeDeliveryAddressId = useSelector(state => activeDeliveryAddressIdSelector(state));
  const activeBillingAddressId = useSelector(state => activeBillingAddressIdSelector(state));
  const { product, quantity, deliveryRate, productAttribute } = checkoutOneItemInput;
  const { userLanguage, userCurrencyISO } = useSettingContext();
  const updateCache = (cache, cart) => {
    cache.writeQuery({
      query: FETCH_CARTS,
      data: { cart },
      variables: {
        currency: userCurrencyISO,
        language: userLanguage,
      },
    });
  };

  const { data: cartsData } = useQuery(FETCH_CARTS, {
    variables: {
      currency: userCurrencyISO,
      language: userLanguage,
    },
  });

  const [fetchCarts] = useLazyQuery(FETCH_CARTS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      currency: userCurrencyISO,
      language: userLanguage,
    },

    onError: error => {
      console.log('fetch messages error', error);
    },
  });
  const [addProductToCartMutation] = useMutation(ADD_PRODUCT_TO_CART, {
    update(cache, { data: { addProductToCart } }) {
      updateCache(cache, addProductToCart);
    },
  });
  const [checkoutCartMutation] = useMutation(CHECKOUT_CART, {
    // refetchQueries: [
    //   {
    //     query: FETCH_CARTS,
    //     variables: {
    //       currency: userCurrencyISO,
    //       language: userLanguage,
    //     },
    //   },
    // ],
    // awaitRefetchQueries: true,
  });

  const [clearCartMutation] = useMutation(CLEAR_CART, {
    update(cache, { data: { clearCart } }) {
      updateCache(cache, clearCart);
    },
  });
  const [selectCartItemsMutation] = useMutation(SELECT_CART_ITEMS, {
    update(cache, { data: { selectCartItems } }) {
      updateCache(cache, selectCartItems);
    },
  });
  const [deleteCartItemMutation] = useMutation(DELETE_CART_ITEM, {
    update(cache, { data: { deleteCartItem } }) {
      updateCache(cache, deleteCartItem);
    },
  });

  const [updateCartItemMutation] = useMutation(UPDATE_CART_ITEM, {
    update(cache, { data: { updateCartItem } }) {
      updateCache(cache, updateCartItem);
    },
  });

  const cart = useMemo(() => {
    if (!cartsData) {
      return {
        items: [],
      };
    } else {
      return cartsData?.cart;
    }
  }, [cartsData]);
  const addProductToCart = async () => {
    try {
      await addProductToCartMutation({
        variables: {
          deliveryRate: deliveryRate?.id,
          product,
          productAttribute,
          quantity,
          billingAddress: activeBillingAddressId || activeDeliveryAddressId,
          currency: userCurrencyISO,
          language: userLanguage,
        },
      });
    } catch (error) {
      console.log('addProductToCartMutation error', error?.message);
    }
  };
  const callCheckoutCart = async provider => {
    try {
      const { data } = await checkoutCartMutation({
        variables: {
          provider,
          currency: userCurrencyISO,
        },
      });
      return data?.checkoutCart;
    } catch (error) {
      console.log('addProductToCartMutation error', error?.message);
    }
  };

  const clearCart = async () => {
    try {
      await clearCartMutation({
        variables: {
          currency: userCurrencyISO,
          language: userLanguage,
        },
      });
    } catch (error) {
      console.log('clearCartMutation error', error?.message);
    }
  };
  const deleteCartItem = async id => {
    try {
      await deleteCartItemMutation({
        variables: {
          id,
          currency: userCurrencyISO,
          language: userLanguage,
        },
      });
    } catch (error) {
      console.log('deleteCartItemMutation error', error?.message);
    }
  };
  //
  const updateCartItem = async ({ id, updatedQuantity }) => {
    try {
      await updateCartItemMutation({
        variables: {
          id,
          quantity: updatedQuantity,
          currency: userCurrencyISO,
          language: userLanguage,
        },
      });
    } catch (error) {
      console.log('updateCartItemMutation error', error?.message);
    }
  };
  const selectCartItems = async ids => {
    try {
      await selectCartItemsMutation({
        variables: {
          ids,
          // selected: true,
          currency: userCurrencyISO,
          language: userLanguage,
        },
      });
    } catch (error) {
      console.log('selectCartItemsMutation error', error?.message);
    }
  };

  return {
    cart,
    addProductToCart,
    clearCart,
    updateCartItem,
    deleteCartItem,
    selectCartItems,
    callCheckoutCart,
    fetchCarts,
  };
};
export const usePaymentMethods = () => {
  const { data } = useQuery(FETCH_PAYMENT_METHODS, {});

  const [addPaymentMethodQuery] = useMutation(ADD_PAYMENT_METHOD_STRIPE);
  const [addNewCardQuery] = useMutation(ADD_NEW_CARD, {
    refetchQueries: [{ query: FETCH_PAYMENT_METHODS }],
    awaitRefetchQueries: true,
  });
  const [updateCardQuery] = useMutation(UPDATE_PAYMENT_METHOD, {
    refetchQueries: [{ query: FETCH_PAYMENT_METHODS }],
    awaitRefetchQueries: true,
  });
  const [deleteCardQuery] = useMutation(DELETE_PAYMENT_METHOD, {
    refetchQueries: [{ query: FETCH_PAYMENT_METHODS }],
    awaitRefetchQueries: true,
  });

  const addPaymentMethod = async ({ token }) => {
    try {
      const { data } = await addPaymentMethodQuery({
        variables: {
          token,
        },
      });
      return data?.addPaymentMethod;
    } catch (error) {}
  };
  const addNewCard = async ({ card, provider }) => {
    try {
      await addNewCardQuery({
        variables: {
          data: {
            details: card,
            provider,
          },
        },
      });
    } catch (error) {}
  };
  const updateCard = async ({ card, provider }) => {
    try {
      await updateCardQuery({
        variables: {
          data: {
            details: card,
            provider,
          },
        },
      });
    } catch (error) {}
  };
  const deleteCard = async ({ id, provider }) => {
    try {
      await deleteCardQuery({
        variables: {
          data: {
            id,
            provider,
          },
        },
      });
    } catch (error) {}
  };

  const checkoutProcessing = async ({
    paymentClientSecret,
    publishableKey,
    provider,
    data: detailData,
  }) => {
    try {
      if (provider === constants.PaymentMethodProviders.UnionPay) {
        const { card } = detailData;
        const cardDetailData = {
          number: card?.cardNumber.replace(/\s+/g, ''),
          exp_month: parseInt(card?.expiryMonth, 10),
          exp_year: parseInt(card?.expiryYear, 10),
          cvc: card?.CVC,
          name: card?.cardholder,
        };

        if (detailData.usingExistCard) {
          return true;
        }
        if (detailData?.isUpdated) {
          cardDetailData.id = card.id;
          delete cardDetailData.number;
          delete cardDetailData.cvc;
          await updateCard({ card: cardDetailData, provider });
        } else {
          await addNewCard({ card: cardDetailData, provider });
        }

        const supported = await Linking.canOpenURL(paymentClientSecret);
        if (supported) {
          // Opening the link with some app, if the URL scheme is "http" the web link should be opened
          // by some browser in the mobile
          const response = await Linking.openURL(paymentClientSecret);
          return true;
        } else {
          return false;
        }
      } else if (provider === constants.PaymentMethodProviders.Alipay) {
        const supported = await Linking.canOpenURL(paymentClientSecret);
        if (supported) {
          // Opening the link with some app, if the URL scheme is "http" the web link should be opened
          // by some browser in the mobile
          const response = await Linking.openURL(paymentClientSecret);
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      console.log('checkoutProcessing error', error?.message);
      return false;
    }
  };
  const paymentMethods = useMemo(() => {
    if (!data) {
      return [];
    } else {
      return data?.paymentMethods;
    }
  }, [data]);

  return {
    addPaymentMethod,
    paymentMethods,
    addNewCard,
    updateCard,
    deleteCard,
    checkoutProcessing,
  };
};
