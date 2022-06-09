import {
  AssetFragment,
  SellerInfoFragment,
  ShippingBoxInfoFragment,
  ProductCategoryInfoFragment,
  AmountOfMoneyFragment,
  BrandPreviewFragment,
} from '../commonFragments';

export const ProductPreviewFragment = `
    fragment ProductPreview on Product {
        id
        title
        assets {
            ...Asset
        }
        seller {
          ...SellerInfo
        }
        description(language:$language)
        thumbnail {
            ...Asset
        }
        price(currency: $currency) {
            ...AmountOfMoney
        }
        oldPrice(currency: $currency) {
            ...AmountOfMoney
        }       
        sold
        quantity
    }
    ${AssetFragment}
    ${AmountOfMoneyFragment}
    ${SellerInfoFragment}
`;

export const ProductAttributeInfoFragment = `
    fragment ProductAttributeInfo on ProductAttribute {
        id
            price(currency: $currency) {
                ...AmountOfMoney
            }
            oldPrice(currency: $currency) {
                ...AmountOfMoney
            }
            quantity
            variation {
                name
                value
            }
            asset {
                ...Asset                
            }
            sku
    }
    ${AmountOfMoneyFragment}
    ${AssetFragment}
`;

export const ProductDetailFragment = `
    fragment ProductDetail on Product {
        id
        title
        description(language:$language)
        sold
        slug
        rating {
            average
            total
        }
        attrs {
            ...ProductAttributeInfo
        }
        seller {
            ...SellerInfo
        }
        price(currency: $currency) {
            ...AmountOfMoney
        }
        oldPrice(currency: $currency) {
            ...AmountOfMoney
        }
        quantity
        assets {
            ...Asset
        }
        thumbnail {
            ...Asset
        }
        category {
            ...ProductCategoryInfo
        }
        shippingBox {
            ...ShippingBoxInfo
        }
        customCarrier {
            id
            name
        }
        customCarrierValue(currency: $currency) {
            ...AmountOfMoney
        }
        brand {
            ...BrandPreview
        }
    },
    ${AssetFragment}
    ${SellerInfoFragment}
    ${ShippingBoxInfoFragment}
    ${ProductCategoryInfoFragment}
    ${AmountOfMoneyFragment}
    ${ProductAttributeInfoFragment}
    ${BrandPreviewFragment}
`;
