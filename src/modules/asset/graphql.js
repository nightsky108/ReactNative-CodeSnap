import { gql } from '@apollo/client';
import {
  AmountOfMoneyFragment,
  PaymentMethodFragment,
  DeliveryAddressFragment,
  ShippingBoxFragment,
} from '@modules/commonFragments';

export const FETCH_CITIES_QUERY = `
    query {
        cities {
            id
            name
            photo
        }
    }
`;
export const FETCH_CITIES = gql`
  ${FETCH_CITIES_QUERY}
`;
export const ADD_ASSET_QUERY = `
    mutation addFileAsset($mimetype: String!, $size: Int!) {
        addAsset(data: {mimetype: $mimetype, size: $size}) {
            id
            path
            url
            status
            type
            size
        }
    }
`;
export const ADD_ASSET = gql`
  ${ADD_ASSET_QUERY}
`;
export const ADD_ASSET_URL_QUERY = `
    mutation addAssetUrl($path: String!) {
        addAssetUrl(data: { path: $path }) {
            id
            path
            url
            status
            type
            size
        }
    }
`;
export const ADD_ASSET_URL = gql`
  ${ADD_ASSET_URL_QUERY}
`;
export const UPLOAD_PREVIEW_VIDEO_QUERY = `
    mutation uploadPreviewVideo($assetId: ID!, $file: File64Input!, $cropMode: VideoCropMode!) {
        uploadPreviewVideo(assetId: $assetId, file: $file, cropMode: $cropMode) {
            id
            path
            url
            status
            type
            size
        }
    }
`;
export const UPLOAD_PREVIEW_VIDEO = gql`
  ${UPLOAD_PREVIEW_VIDEO_QUERY}
`;
export const FETCH_COUNTRIES_QUERY = `
    query {
        countries {
            id
            name
            currency
        }
    }
`;
export const FETCH_COUNTRIES = gql`
  ${FETCH_COUNTRIES_QUERY}
`;
export const SEARCH_COUNTRY = gql`
  query searchCountry($skip: Int, $limit: Int, $query: String!) {
    searchCountry(page: { skip: $skip, limit: $limit }, query: $query) {
      collection {
        id
        name
        currency
      }
    }
  }
`;
export const FETCH_REGIONS_QUERY = `
    query fetchRegions($countryId: ID!) {
        regions (filter: {countryId: $countryId})  {
            id
            name            
        }
    }
`;
export const FETCH_REGIONS = gql`
  ${FETCH_REGIONS_QUERY}
`;

export const GET_AWS_STORAGE_CONF_QUERY = `
    mutation {
        giveSignedUrl {
            key
            secret
            region
            bucket
        }
    }
`;
export const GET_AWS_STORAGE_CONF = gql`
  ${GET_AWS_STORAGE_CONF_QUERY}
`;
export const FETCH_CARRIERS_QUERY = `
    query {
        carriers {
            id
            name
            carrierId           
        }
    }
`;
export const FETCH_CARRIERS = gql`
  ${FETCH_CARRIERS_QUERY}
`;
export const FETCH_PAYMENT_METHODS_QUERY = `
    query {
        paymentMethods {
            ...PaymentMethod
        }
    }
    ${PaymentMethodFragment}
`;
export const FETCH_PAYMENT_METHODS = gql`
  ${FETCH_PAYMENT_METHODS_QUERY}
`;

export const FETCH_AVAILABLE_PAYMENT_METHODS_QUERY = `
    query {
        availablePaymentMethods
    }
`;
export const FETCH_SUPPORTED_CURRENCIES_QUERY = `
    query {
        supportedCurrencies
    }
`;
export const FETCH_SUPPORTED_CURRENCIES = gql`
  ${FETCH_SUPPORTED_CURRENCIES_QUERY}
`;
export const FETCH_AVAILABLE_PAYMENT_METHODS = gql`
  ${FETCH_AVAILABLE_PAYMENT_METHODS_QUERY}
`;
export const FETCH_SHIPPING_BOXES = gql`
  query shippingBoxes {
    shippingBoxes {
      ...ShippingBox
    }
  }
  ${ShippingBoxFragment}
`;
export const ADD_SHIPPING_BOX = gql`
  mutation addShippingBox(
    $label: String!
    $width: Float!
    $height: Float!
    $length: Float!
    $weight: Float!
    $unit: SizeUnitSystem!
    $unitWeight: WeightUnitSystem!
  ) {
    addShippingBox(
      data: {
        label: $label
        width: $width
        height: $height
        length: $length
        weight: $weight
        unit: $unit
        unitWeight: $unitWeight
      }
    ) {
      ...ShippingBox
    }
  }
  ${ShippingBoxFragment}
`;
export const REMOVE_SHIPPING_BOX = gql`
  mutation removeShippingBox($id: ID!) {
    removeShippingBox(id: $id)
  }
`;
export const FETCH_ASSET_BY_ID = gql`
  query fetchAssetById($id: ID!) {
    asset(id: $id) {
      url
    }
  }
`;

export const FETCH_PRE_ASSETS = gql`
  query {
    supportedCurrencies
    paymentMethods {
      ...PaymentMethod
    }
    availablePaymentMethods
  }
  ${PaymentMethodFragment}
`;
