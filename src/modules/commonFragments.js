import { gql } from '@apollo/client';

export const UserPreviewFragment = `
    fragment UserPreview on User {
        id
        email
        name
        phone
        photo {
            url
        }      
    }
`;
export const SellerInfoFragment = `
    fragment SellerInfo on User {
        ...UserPreview
        organization {
            id
            address {
                street
                city
            }
        }
    }
    ${UserPreviewFragment}
`;
export const AmountOfMoneyFragment = `
    fragment AmountOfMoney on AmountOfMoney {
        amount
        amountISO
        currency
        formatted
    }
`;
//= ===pager==================
export const PagerFragment = `
    fragment Pager on Pager {
        total
        skip
        limit
    }
`;
//= assets===========================
export const AssetFragment = `
    fragment Asset on Asset {
        id
        url
        type        
    }
`;
export const BannerAssetFragment = `
    fragment BannerAsset  on BannerAsset  {
        image
        image4Mobile
        link
    }
`;
export const AssetFullInfoFragment = `
    fragment AssetFullInfo on Asset {
        ...Asset
        status        
    }
    ${AssetFragment}
`;

export const CardDetailsFragment = `
	fragment CardDetails on CardDetails {
		id
		number
		exp_month
		exp_year
		cvc
		name
	}
`;
export const PaymentMethodFragment = `
  fragment PaymentMethod on PaymentMethod {
    id
    name
    provider
    providerIdentity
    expiredAt
    card {
      ...CardDetails
    }
  }
  ${CardDetailsFragment}
`;
export const AddressFragment = `
    fragment Address on Address {
        street
        city
        region {
            id
            name
        }
        country {
            id
            name
        }
        zipCode        
        addressId
        description
    }
`;
export const VerifiedAddressFragment = `
    fragment VerifiedAddress on VerifiedAddress {        
        street
        city
        region {
            id
            name
        }
        country {
            id
            name
        }
        zipCode        
        addressId
        description
        isDeliveryAvailable
    }
`;

export const DeliveryAddressFragment = `
    fragment DeliveryAddress on DeliveryAddress {
        id
        label     
        shippingAddress     
        street
        city
        region {
            id
            name
        }
        country {
            id
            name
        }
        zipCode        
        addressId
        description
        isDeliveryAvailable
    }
   
`;

export const OrganizationFragment = `
    fragment Organization on Organization {
        id
        carriers {
            id
            name
            carrierId
        }
        address {
            ...VerifiedAddress
        }
        billingAddress {
          ...VerifiedAddress
        }
        payoutInfo
        returnPolicy
        workInMarketTypes
        rating
        customCarrier {
            id
            name
        }
    }
    ${VerifiedAddressFragment}
`;
export const OrganizationPreviewFragment = `
    fragment OrganizationPreview on Organization  {
        id        
        name
        photo {
            ...Asset
        }
        owner {
            ...UserPreview
        }   
        address {
            ...VerifiedAddress
        }   
    }
    ${UserPreviewFragment}
    ${AssetFragment}
    ${VerifiedAddressFragment}
`;

export const UserFragment = `
    fragment User on User {
        id
        name
        email
        phone
        location {
            latitude
            longitude
        }
        photo {
            id
            url
        }
        address {
            ...Address
        }
    }
    ${AddressFragment}
`;

//= =====order=======================

/* export const DeliveryOrderFragment = `
	fragment DeliveryOrder on DeliveryOrder{
		id
		trackingNumber
		status
        estimatedDeliveryDate
        deliveryPrice{
            ...AmountOfMoney
        }
        deliveryAddress {
            ...DeliveryAddress
        }
        proofPhoto{
            id
            path
            url
        }
        carrier{
            id
            name
        }
        
    }
    ${AmountOfMoneyFragment}
    ${DeliveryAddressFragment}
`; */

//= =====shipping =================================
export const ShippingBoxInfoFragment = `
    fragment ShippingBoxInfo on ShippingBox {
        id
        label
        width
        height
        length
        weight
        unit
        unitWeight
    }
`;
//= ===product category=============================
export const ProductVariationFragment = `
    fragment ProductVariation on ProductVariation {
        id
        name
        description
        values
        keyName
        displayName
    }
`;
export const ProductCategoryInfoFragment = `
    fragment ProductCategoryInfo on ProductCategory {
        id
        name
        parent {
            id
            name
        }
        parents {
            id
            name
        }
    }
`;
export const ProductCategoryBodyFragment = `
    fragment ProductCategoryBody on ProductCategory {
        id
        name
        level
        image {
            ...Asset
        }
               
    }
    ${AssetFragment}
`;
export const ProductCategoryPreviewFragment = `
    fragment ProductCategoryPreview on ProductCategory {
        ...ProductCategoryBody
        hasChildren
        parent {
            id
        }
        parents {
            id
            level
        }        
        image {
            ...Asset
        }
    }
    ${ProductCategoryBodyFragment}
    ${AssetFragment}
`;
export const ProductCategoryDetailFragment = `
    fragment ProductCategoryDetail on ProductCategory {
        ...ProductCategoryBody
        hasChildren
        parent {
            ...ProductCategoryBody
        }
        parents {
            ...ProductCategoryBody
        }
        
       
    }
    ${ProductCategoryBodyFragment}
    ${AssetFragment}
`;
//= ======Brand===============================
export const BrandCategoryFragment = `
    fragment BrandCategory on BrandCategory {
        id
        name
        isRecommended
        hashtags
    }
`;
export const BrandPreviewFragment = `
    fragment BrandPreview on Brand {
        id
        name
        images {
            ...Asset
        }
    }
    ${AssetFragment}
`;
export const BrandFragment = `
    fragment Brand on Brand {
        id
        name
        brandCategories {
            id
        }
        images {
            ...Asset
        }
        countProducts
    }
    ${AssetFragment}
`;
//= =====Banner===========================
export const ShippingBoxFragment = `
  fragment ShippingBox on ShippingBox {
    id
    parcelId
    label
    width
    height
    length
    weight
    unit
    unitWeight
  }
`;
