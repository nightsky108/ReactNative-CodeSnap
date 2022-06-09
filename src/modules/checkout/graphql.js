import { gql } from '@apollo/client';
import {
  PaymentMethodFragment,
  ProductCategoryPreviewFragment,
  PagerFragment,
} from '@modules/commonFragments';
import {
  DeliveryRateInfoFragment,
  PurchaseOrderInfoFragment,
  CartFragment,
  PurchaseOrderFragment,
} from './fragment';

export const FETCH_CARTS = gql`
  query fetchCart($currency: Currency!, $language: LanguageList) {
    cart {
      ...Cart
    }
  }
  ${CartFragment}
`;

export const CALCULATE_DELIVERY_RATES = gql`
  mutation calculateDeliveryRates(
    $productId: ID!
    $quantity: Int!
    $deliveryAddress: ID!
    $currency: Currency
  ) {
    calculateDeliveryRates(
      product: $productId
      deliveryAddress: $deliveryAddress
      quantity: $quantity
    ) {
      ...DeliveryRateInfo
    }
  }
  ${DeliveryRateInfoFragment}
`;
export const CHECKOUT_ONE_PRODUCT = gql`
  mutation proceedCheckoutOneItem(
    $deliveryRate: ID!
    $product: ID!
    $productAttribute: ID!
    $quantity: Int! = 1
    $provider: PaymentMethodProviders!
    $billingAddress: ID!
    $redirection: RedirectionInput
    $paymentMethodNonce: String
    $currency: Currency!
  ) {
    checkoutOneProduct(
      deliveryRate: $deliveryRate
      product: $product
      productAttribute: $productAttribute
      quantity: $quantity
      provider: $provider
      billingAddress: $billingAddress
      redirection: $redirection
      paymentMethodNonce: $paymentMethodNonce
      currency: $currency
    ) {
      ...PurchaseOrderInfo
    }
  }
  ${PurchaseOrderInfoFragment}
`;
export const CHECKOUT_CART = gql`
  mutation checkoutCart(
    $provider: PaymentMethodProviders!
    $redirection: RedirectionInput
    $paymentMethodNonce: String
    $currency: Currency!
  ) {
    checkoutCart(
      provider: $provider
      redirection: $redirection
      paymentMethodNonce: $paymentMethodNonce
      currency: $currency
    ) {
      ...PurchaseOrderInfo
    }
  }
  ${PurchaseOrderInfoFragment}
`;
export const ADD_PRODUCT_TO_CART = gql`
  mutation addProductToCart(
    $product: ID!
    $deliveryRate: ID!
    $quantity: Int! = 1
    $billingAddress: ID!
    $productAttribute: ID!
    $metricUnit: ProductMetricUnit
    $note: String
    $currency: Currency!
    $language: LanguageList
  ) {
    addProductToCart(
      deliveryRate: $deliveryRate
      product: $product
      productAttribute: $productAttribute
      quantity: $quantity
      billingAddress: $billingAddress
      metricUnit: $metricUnit
      note: $note
    ) {
      ...Cart
    }
  }
  ${CartFragment}
`;
export const UPDATE_CART_ITEM = gql`
  mutation updateCartItem(
    $id: ID!
    $deliveryRate: ID
    $quantity: Int! = 1
    $billingAddress: ID
    $note: String
    $currency: Currency!
    $language: LanguageList
  ) {
    updateCartItem(
      id: $id
      deliveryRate: $deliveryRate
      quantity: $quantity
      billingAddress: $billingAddress
      note: $note
    ) {
      ...Cart
    }
  }
  ${CartFragment}
`;

export const SELECT_CART_ITEMS = gql`
  mutation selectCartItems(
    $ids: [ID]!
    $selected: Boolean = true
    $currency: Currency!
    $language: LanguageList
  ) {
    selectCartItems(ids: $ids, selected: $selected) {
      ...Cart
    }
  }
  ${CartFragment}
`;
export const DELETE_CART_ITEM = gql`
  mutation deleteCartItem($id: ID!, $currency: Currency!, $language: LanguageList) {
    deleteCartItem(id: $id) {
      ...Cart
    }
  }
  ${CartFragment}
`;
export const CLEAR_CART = gql`
  mutation clearCart($selected: Boolean, $currency: Currency!, $language: LanguageList) {
    clearCart(selected: $selected) {
      ...Cart
    }
  }
  ${CartFragment}
`;
export const ADD_NEW_CARD = gql`
  mutation addNewCard($data: NewCardInput!) {
    addNewCard(data: $data) {
      id
    }
  }
`;
export const DELETE_PAYMENT_METHOD = gql`
  mutation deletePaymentMethod($data: deletePaymentMethodInput!) {
    deletePaymentMethod(data: $data) {
      success
    }
  }
`;
export const UPDATE_PAYMENT_METHOD = gql`
  mutation updateCardDetails($data: UpdateCardInput!) {
    updateCardDetails(data: $data) {
      ...PaymentMethod
    }
  }
  ${PaymentMethodFragment}
`;
export const FETCH_PAYMENT_METHODS = gql`
  query {
    paymentMethods {
      ...PaymentMethod
    }
  }
  ${PaymentMethodFragment}
`;
export const ADD_PAYMENT_METHOD_STRIPE = gql`
  mutation addPaymentMethod($token: String!) {
    addPaymentMethod(data: { Stripe: { token: $token } }) {
      ...PaymentMethod
    }
  }
  ${PaymentMethodFragment}
`;

export const FETCH_PURCHASE_ORDER_BY_ID = gql`
  query ($id: ID!, $currency: Currency, $language: LanguageList) {
    purchaseOrder(id: $id) {
      ...PurchaseOrder
    }
  }
  ${PurchaseOrderFragment}
`;
export const FETCH_PURCHASE_ORDERS = gql`
  query (
    $skip: Int
    $limit: Int
    $statuses: [PurchaseOrderStatus!]
    $feature: OrderSortFeature!
    $sortType: SortTypeEnum!
    $currency: Currency
    $language: LanguageList
  ) {
    purchaseOrders(
      filter: { statuses: $statuses }
      page: { skip: $skip, limit: $limit }
      sort: { feature: $feature, type: $sortType }
    ) {
      collection {
        ...PurchaseOrder
      }
      pager {
        ...Pager
      }
    }
  }
  ${PurchaseOrderFragment}
  ${PagerFragment}
`;
