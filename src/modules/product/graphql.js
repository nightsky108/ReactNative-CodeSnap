import { gql } from '@apollo/client';

import { ProductCategoryPreviewFragment, PagerFragment } from '../commonFragments';
import { ProductPreviewFragment, ProductDetailFragment } from './fragment';

export const FETCH_PRODUCT_CATEGORY_PREVIEWS = gql`
  query fetchProductCategoryPreviews($parent: ID, $hasProduct: Boolean) {
    productCategories(parent: $parent, hasProduct: $hasProduct) {
      ...ProductCategoryPreview
    }
  }
  ${ProductCategoryPreviewFragment}
`;
export const FETCH_FULL_PRODUCT_CATEGORY_PREVIEWS = gql`
  query productAllCategories($hasProduct: Boolean) {
    fullProductCategories(hasProduct: $hasProduct) {
      ...ProductCategoryPreview
    }
  }
  ${ProductCategoryPreviewFragment}
`;
export const FETCH_PRODUCT_PREVIEWS_BY_THEME = gql`
  query productsByTheme(
    $skip: Int
    $limit: Int
    $theme: ID!
    $feature: ProductSortFeature! = CREATED_AT
    $sortType: SortTypeEnum! = ASC
    $currency: Currency
    $language: LanguageList
  ) {
    productsByTheme(
      theme: $theme
      page: { skip: $skip, limit: $limit }
      sort: { type: $sortType, feature: $feature }
    ) {
      collection {
        ...ProductPreview
      }
      pager {
        ...Pager
      }
    }
  }
  ${ProductPreviewFragment}
  ${PagerFragment}
`;
export const FETCH_PRODUCT_PREVIEWS = gql`
  query Products(
    $skip: Int
    $limit: Int
    $category: [ID!]
    $theme: ID
    $brandName: [String!]
    $feature: ProductSortFeature! = CREATED_AT
    $sort: SortTypeEnum! = DESC
    $isFeatured: Boolean
    $search: String
    $sellers: [ID!]
    $variations: [VariationInput]
    $hasLivestream: Boolean
    $currency: Currency
    $language: LanguageList
  ) {
    products(
      filter: {
        sellers: $sellers
        searchQuery: $search
        categories: $category
        theme: $theme
        isFeatured: $isFeatured
        variations: $variations
        brandNames: $brandName
        hasLivestream: $hasLivestream
      }
      page: { skip: $skip, limit: $limit }
      sort: { feature: $feature, type: $sort }
    ) {
      collection {
        ...ProductPreview
      }
      pager {
        ...Pager
      }
    }
  }
  ${ProductPreviewFragment}
  ${PagerFragment}
`;
export const FETCH_PRODUCTS = gql`
  query Products(
    $skip: Int
    $limit: Int
    $category: [ID!]
    $theme: ID
    $brandName: [String!]
    $feature: ProductSortFeature! = CREATED_AT
    $sort: SortTypeEnum! = DESC
    $isFeatured: Boolean
    $search: String
    $sellers: [ID!]
    $variations: [VariationInput]
    $hasLivestream: Boolean
    $currency: Currency
    $language: LanguageList
  ) {
    products(
      filter: {
        sellers: $sellers
        searchQuery: $search
        categories: $category
        theme: $theme
        isFeatured: $isFeatured
        variations: $variations
        brandNames: $brandName
        hasLivestream: $hasLivestream
      }
      page: { skip: $skip, limit: $limit }
      sort: { feature: $feature, type: $sort }
    ) {
      collection {
        ...ProductDetail
      }
      pager {
        ...Pager
      }
    }
  }
  ${ProductDetailFragment}
  ${PagerFragment}
`;
export const FETCH_PRODUCTS_RECOMMENDED_TOME_PREVIEWS = gql`
  query ProductsRecommendedToMe(
    $skip: Int
    $limit: Int
    $currency: Currency
    $language: LanguageList
  ) {
    productsRecommendedToMe(page: { skip: $skip, limit: $limit }) {
      collection {
        ...ProductPreview
      }
      pager {
        ...Pager
      }
    }
  }
  ${ProductPreviewFragment}
  ${PagerFragment}
`;

export const FETCH_PRODUCT_BY_ID = gql`
  query fetchProductById($id: ID!, $currency: Currency, $language: LanguageList) {
    product(id: $id) {
      ...ProductDetail
    }
  }
  ${ProductDetailFragment}
`;
export const SEARCH_BRAND = gql`
  query searchBrand($skip: Int, $limit: Int, $query: String!) {
    searchBrand(page: { skip: $skip, limit: $limit }, query: $query) {
      collection {
        id
        name
      }
    }
  }
`;
export const ADD_BRAND = gql`
  mutation addBrand($name: String!) {
    addBrand(data: { name: $name }) {
      id
      name
    }
  }
`;
export const ADD_PRODUCT = gql`
  mutation addProduct(
    $title: String!
    $description: String!
    $price: Float!
    $discountPrice: Float!
    $quantity: Int!
    $currency: Currency!
    $freeDeliveryTo: [MarketType!]
    $assets: [ID!]
    $category: ID
    $brand: ID
    $shippingBox: ID
    $customCarrier: String
    $customCarrierValue: Float
    $attrs: [ProductAttrWOProductInput!]
    $thumbnailId: ID!
    $metaDescription: String!
    $metaTags: [String]!
    $seoTitle: String!
    $language: LanguageList
  ) {
    addProduct(
      data: {
        title: $title
        description: $description
        price: $price
        discountPrice: $discountPrice
        quantity: $quantity
        currency: $currency
        assets: $assets
        thumbnailId: $thumbnailId
        shippingBox: $shippingBox
        category: $category
        brand: $brand
        freeDeliveryTo: $freeDeliveryTo
        customCarrier: $customCarrier
        customCarrierValue: $customCarrierValue
        attrs: $attrs
        metaDescription: $metaDescription
        metaTags: $metaTags
        seoTitle: $seoTitle
      }
    ) {
      ...ProductPreview
    }
  }
  ${ProductPreviewFragment}
`;
