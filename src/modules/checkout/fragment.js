import { gql } from '@apollo/client';

import { ProductPreviewFragment, ProductAttributeInfoFragment } from '@modules/product/fragment';
import {
  DeliveryAddressFragment,
  AssetFragment,
  SellerInfoFragment,
  UserPreviewFragment,
  AmountOfMoneyFragment,
} from '../commonFragments';

export const DeliveryRateInfoFragment = `
    fragment DeliveryRateInfo on DeliveryRate {
        id        
        amount(currency: $currency) {
            ...AmountOfMoney
        }
        estimatedDeliveryDate
        deliveryDays
        deliveryDateGuaranteed       
    }
    ${AmountOfMoneyFragment}
`;
export const PaymentTransactionInterfaceFragment = `
    fragment PaymentTransactionInterface on PaymentTransactionInterface {
        id  
        createdAt      
        amount {
            ...AmountOfMoney
        }
        status
        processedAt
        tags       
    }
    ${AmountOfMoneyFragment}
`;

export const DeliveryOrderFragment = `
    fragment DeliveryOrder on DeliveryOrder {
        id   
        trackingNumber
        status
        estimatedDeliveryDate
        deliveryPrice {
            ...AmountOfMoney
        }
        deliveryAddress {
            ...DeliveryAddress
        }
        proofPhoto {
            ...Asset
        }
        carrier {
            id
            name
        }
    }
    ${AmountOfMoneyFragment}
    ${DeliveryAddressFragment}
    ${AssetFragment}
`;
/* export const DeliveryOrderFragment = `
    fragment DeliveryOrder on DeliveryOrder {
        id   
        trackingNumber
        status
        estimatedDeliveryDate
        deliveryPrice {
            ...AmountOfMoney
        }       
        proofPhoto {
            ...Asset
        }
        carrier {
            id
            name
        }
    }
    ${AmountOfMoneyFragment}
    ${AssetFragment}
`; */
export const OrderItemLogFragment = `
  fragment OrderItemLog on OrderItemLog {
    id
    date
    oldStatus
    newStatus
    whoChanged{
      ...UserPreview
    }
    tags
  }
  ${UserPreviewFragment}
`;
export const OrderProductItemFragment = `
  fragment OrderProductItem on OrderProductItem {
    id
    title
    productAttribute {
      ...ProductAttributeInfo
    }
    product {
      ...ProductPreview
    }
    quantity
    price {
      ...AmountOfMoney
    }
    deliveryPrice {
      ...AmountOfMoney
    }
    deliveryOrder {
      ...DeliveryOrder
    }
    subtotal {
      ...AmountOfMoney
    }
    total{
      ...AmountOfMoney
    }
    seller {
      ...SellerInfo
    }
    status   
  
    note
  }
  ${AmountOfMoneyFragment}
  ${ProductAttributeInfoFragment}
  ${ProductPreviewFragment}
  ${SellerInfoFragment}
  ${DeliveryOrderFragment}
`;
export const OrderProductItemFragmentOrigin = `
  fragment OrderProductItem on OrderProductItem {
    id
    title
    productAttribute {
      ...ProductAttributeInfo
    }
    product {
      ...ProductPreview
    }
    quantity
    price {
      ...AmountOfMoney
    }
    deliveryPrice {
      ...AmountOfMoney
    }
    subtotal {
      ...AmountOfMoney
    }
    total{
      ...AmountOfMoney
    }
    seller {
      ...SellerInfo
    }
    status
    deliveryOrder {
      ...DeliveryOrder
    }
    log {
      ...OrderItemLog
    }
    billingAddress {
      ...DeliveryAddress
    }
    note
  }
  ${AmountOfMoneyFragment}
  ${ProductAttributeInfoFragment}
  ${ProductPreviewFragment}
  ${SellerInfoFragment}
  ${DeliveryOrderFragment}
  ${OrderItemLogFragment}
  ${DeliveryAddressFragment}
`;

export const PurchaseOrderFragment = `
  fragment PurchaseOrder on PurchaseOrder {
    id
    isPaid
    status
    items {
      ...OrderProductItem
    }
    price {
      ...AmountOfMoney
    }
    deliveryPrice {
      ...AmountOfMoney
    }
    total {
      ...AmountOfMoney
    }
    tax {
      ...AmountOfMoney
    }
    payments {
      ...PaymentTransactionInterface
    }
    deliveryOrders {
      ...DeliveryOrder
    }
    cancelationReason
    error
    publishableKey
    paymentClientSecret
    buyer {
      ...UserPreview
    }
    createdAt
    paymentInfo
  }
  ${OrderProductItemFragment}
  ${AmountOfMoneyFragment}
  ${PaymentTransactionInterfaceFragment}
  ${DeliveryOrderFragment}
  ${UserPreviewFragment}
`;
export const PurchaseOrderInfoFragment = `
    fragment PurchaseOrderInfo on PurchaseOrder {
        id  
        total {
          ...AmountOfMoney
        }
        error
        publishableKey
        paymentClientSecret
    }
    ${AmountOfMoneyFragment}  
`;

export const CartProductItemFragment = `
    fragment CartProductItem on CartProductItem {
        id
        quantity
        metricUnit
        seller {
            ...SellerInfo
        }
        total(currency: $currency) {
            ...AmountOfMoney
        }
        productAttribute {
            ...ProductAttributeInfo
        }
        product {
            ...ProductPreview
        }
        deliveryIncluded
        deliveryAddress {
          ...DeliveryAddress
        }
        note
        selected
    }
    ${AmountOfMoneyFragment}
    ${SellerInfoFragment}
    ${ProductAttributeInfoFragment}
    ${ProductPreviewFragment}
`;
export const CartFragment = `
    fragment Cart on Cart {
        items {
            ...CartProductItem
        }
        price(currency: $currency) {
            ...AmountOfMoney
        }
        deliveryPrice(currency: $currency) {
            ...AmountOfMoney
        }
        total(currency: $currency) {
            ...AmountOfMoney
        }
        
    }
    ${AmountOfMoneyFragment}
    ${CartProductItemFragment}
    ${DeliveryAddressFragment}
   
`;
