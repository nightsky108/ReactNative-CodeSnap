import { gql } from '@apollo/client';

import {
  OrganizationFragment,
  UserFragment,
  DeliveryAddressFragment,
} from '@modules/commonFragments';

export const GET_DELIVERY_ADDRESSES_QUERY = `
  query {
    deliveryAddresses {
      ...DeliveryAddress
    }
  }
  ${DeliveryAddressFragment}
`;
export const GET_DELIVERY_ADDRESSES = gql`
  ${GET_DELIVERY_ADDRESSES_QUERY}
`;

export const GET_USER_ID = gql`
  query getUserId {
    me {
      id
    }
  }
`;
export const GET_USER_ORGANIZATION = gql`
  query {
    organization {
      ...Organization
    }
  }
  ${OrganizationFragment}
`;
export const GET_USER_INFO_QUERY = `
    query getUserInfo {
        me {
            ...User
        }
    }
    ${UserFragment}
`;
export const GET_USER_INFO = gql`
  ${GET_USER_INFO_QUERY}
`;

export const ADDRESSES_QUERY = `
    query {
        deliveryAddresses {
            ...DeliveryAddress
        }
        billingAddresses {
            ...DeliveryAddress
        }
    }
    ${DeliveryAddressFragment}
`;
export const ADDRESSES = gql`
  ${ADDRESSES_QUERY}
`;

export const GET_BILLING_ADDRESSES_QUERY = `
  query {
    billingAddresses {
      ...DeliveryAddress
    }
  }
  ${DeliveryAddressFragment}
`;
export const GET_BILLING_ADDRESSES = gql`
  ${GET_BILLING_ADDRESSES_QUERY}
`;

export const UserSettingFragment = `
    fragment userSettings on UserSettings {        
		pushNotifications
		language{
            id
            name
        }
		moneyDetails {
			ISO
			symbol
		}
		measureSystem        
    }
`;
export const MoneyDetailsFragment = `
    fragment MoneyDetails on MoneyDetails {
        ISO
        symbol
    }
`;
export const GET_USER_SETTINGS_QUERY = `
    query getUserSettings {
        userSettings {
            pushNotifications          
            language {
				id
				name
			}
            moneyDetails {
                ISO
                symbol
            }
            measureSystem
        }
    }
`;
export const GET_USER_SETTINGS = gql`
  ${GET_USER_SETTINGS_QUERY}
`;
export const SIGNIN_QUERY = `
    mutation($email: String!, $password: String!) {
        generateAccessToken(data: {email: $email, password: $password})
    }
`;
export const SIGNIN = gql`
  ${SIGNIN_QUERY}
`;
export const GET_CHAT_TOKEN_QUERY = `
    query getChatToken {
        generateChatToken
    }
`;
export const GET_CHAT_TOKEN = gql`
  ${GET_CHAT_TOKEN_QUERY}
`;
export const SIGNIN_PHONE_QUERY = `
    mutation($phone: String!, $password: String!, $ip: String, $userAgent: String) {
        generateAccessTokenByPhone(
            data: { phone: $phone, password: $password, ip: $ip, userAgent: $userAgent }
        )
    }
`;
export const SIGNIN_PHONE = gql`
  ${SIGNIN_PHONE_QUERY}
`;

export const SIGNIN_SOCIAL_QUERY = `
    mutation generateAccessTokenByOAuth2($provider: LoginProvider!, $token: String!) {
        generateAccessTokenByOAuth2(data: { provider: $provider, token: $token })
    }
`;
export const SIGNIN_SOCIAL = gql`
  ${SIGNIN_SOCIAL_QUERY}
`;
export const ADDUSER_QUERY = `
    mutation add_user($email: String!, $password: String!) {
        addUser(data: {email: $email, password: $password}) {
            id
            email
        }
    }
`;
export const ADDUSER = gql`
  ${ADDUSER_QUERY}
`;
export const ADDUSER_BY_SOCIAL_QUERY = `
    mutation addUserBySocial($provider: LoginProvider!, $token: String!) {
        addUserBySocial(data: { provider: $provider, token: $token }) {
            id
            email
        }
    }
`;

export const ADDUSER_BY_SOCIAL = gql`
  ${ADDUSER_BY_SOCIAL_QUERY}
`;
export const ADDUSER_BY_PHONE_QUERY = `
    mutation addUserByPhone($phone: String!,$countryCode: String!, $password: String!) {
        addUserByPhone(data: { phone: $phone,countryCode:$countryCode, password: $password }) {
            id
            phone
        }
    }
`;

export const ADDUSER_BY_PHONE = gql`
  ${ADDUSER_BY_PHONE_QUERY}
`;
export const UPDATE_USER = gql`
  mutation update_user(
    $name: String
    $email: String
    $phone: String
    $address: AddressInput
    $location: LatLngInput
    $countryCode: String
    $photo: ID
  ) {
    updateUser(
      data: {
        name: $name
        email: $email
        phone: $phone
        address: $address
        location: $location
        countryCode: $countryCode
        photo: $photo
      }
    ) {
      ...User
    }
  }
  ${UserFragment}
`;
export const ADD_DELIVERY_ADDRESS = gql`
  mutation addDeliveryAddress(
    $label: String
    $street: String
    $city: String
    $region: ID!
    $country: ID!
    $zipCode: String
    $description: String
  ) {
    addDeliveryAddress(
      data: {
        label: $label
        street: $street
        city: $city
        region: $region
        country: $country
        zipCode: $zipCode
        description: $description
      }
    ) {
      ...DeliveryAddress
    }
  }
  ${DeliveryAddressFragment}
`;
export const UPDATE_DELIVERY_ADDRESS = gql`
  mutation updateDeliveryAddress(
    $id: ID!
    $label: String
    $street: String
    $city: String
    $region: ID!
    $country: ID!
    $zipCode: String
    $description: String
    $addressId: String
    $shippingAddress: String
  ) {
    updateDeliveryAddress(
      id: $id
      data: {
        label: $label
        street: $street
        city: $city
        region: $region
        country: $country
        zipCode: $zipCode
        description: $description
        addressId: $addressId
        shippingAddress: $shippingAddress
      }
    ) {
      ...DeliveryAddress
    }
  }
  ${DeliveryAddressFragment}
`;
export const DELETE_DELIVERY_ADDRESS = gql`
  mutation deleteDeliveryAddress($id: ID!) {
    deleteDeliveryAddress(id: $id)
  }
`;
export const ADD_BILLING_ADDRESS = gql`
  mutation addBillingAddress(
    $label: String
    $street: String
    $city: String
    $region: ID!
    $country: ID!
    $zipCode: String
    $description: String
    $shippingAddress: String
  ) {
    addBillingAddress(
      data: {
        label: $label
        street: $street
        city: $city
        region: $region
        country: $country
        zipCode: $zipCode
        description: $description
        shippingAddress: $shippingAddress
      }
    ) {
      ...DeliveryAddress
    }
  }
  ${DeliveryAddressFragment}
`;
export const UPDATE_BILLING_ADDRESS = gql`
  mutation updateBillingAddress(
    $id: ID!
    $label: String
    $street: String
    $city: String
    $region: ID!
    $country: ID!
    $zipCode: String
    $description: String
    $addressId: String
    $shippingAddress: String
  ) {
    updateBillingAddress(
      id: $id
      data: {
        label: $label
        street: $street
        city: $city
        region: $region
        country: $country
        zipCode: $zipCode
        description: $description
        addressId: $addressId
        shippingAddress: $shippingAddress
      }
    ) {
      ...DeliveryAddress
    }
  }
  ${DeliveryAddressFragment}
`;
export const DELETE_BILLING_ADDRESS = gql`
  mutation ($id: ID!) {
    deleteBillingAddress(id: $id)
  }
`;
export const UPDATE_ORGANIZATION = gql`
  mutation updateOrganization(
    $name: String
    $photo: ID
    $carriers: [ID]
    $address: AddressInput
    $billingAddress: AddressInput
    $workInMarketTypes: [MarketType]
    $customCarrier: String
  ) {
    updateOrganization(
      data: {
        name: $name
        photo: $photo
        carriers: $carriers
        address: $address
        billingAddress: $billingAddress
        workInMarketTypes: $workInMarketTypes
        customCarrier: $customCarrier
      }
    ) {
      ...Organization
    }
  }
  ${OrganizationFragment}
`;
export const UPDATE_USER_SETTINGS_QUERY = `
    mutation (
        $pushNotifications: [PushNotification]!
        $language: LanguageList!
        $currency: Currency!
        $measureSystem: MeasureSystem!
    ) {
        updateUserSettings(
            data: {
                pushNotifications: $pushNotifications
                language: $language
                currency: $currency
                measureSystem: $measureSystem
            }
        ) {
            pushNotifications
            language {
                id
                name
            }
            moneyDetails {
                ...MoneyDetails
            }
            measureSystem
        }
    }
    ${MoneyDetailsFragment}
`;
export const UPDATE_USER_SETTINGS = gql`
  ${UPDATE_USER_SETTINGS_QUERY}
`;
export const SEND_VERIFICATION_CODE_QUERY = `
    mutation($email: String!, $template: VerificationEmailTemplateEnum!) {
        sendVerificationCode(email: $email, template: $template)
    }
`;
export const SEND_VERIFICATION_CODE = gql`
  ${SEND_VERIFICATION_CODE_QUERY}
`;
export const SEND_CODE_2PHONE_FOR_USER_QUERY = `
    mutation($phone: String!, $countryCode: String!) {
        sendCode2PhoneForUser(data: { phone: $phone, countryCode: $countryCode })
    }
`;
export const SEND_CODE_2PHONE_FOR_USER = gql`
  ${SEND_CODE_2PHONE_FOR_USER_QUERY}
`;

export const SEND_VERIFICATION_CODE_2PHONE_QUERY = `
    mutation($phone: String!, $countryCode: String!) {
        sendVerificationCode2Phone(data: { phone: $phone, countryCode: $countryCode }) {
            id
        }
    }
`;
export const SEND_VERIFICATION_CODE_2PHONE = gql`
  ${SEND_VERIFICATION_CODE_2PHONE_QUERY}
`;
export const CHECK_PHONE_VERIFICATION_CODE_QUERY = `
    mutation($request_id: String!, $code: String!) {
        checkPhoneVerificationCode(data: { request_id: $request_id, code: $code }) {
            result
            message
        }
    }
`;
export const CHECK_PHONE_VERIFICATION_CODE = gql`
  ${CHECK_PHONE_VERIFICATION_CODE_QUERY}
`;
export const CHANGE_PASSWORD_QUERY = `
    mutation($email: String, $phone: String, $newPassword: String!, $verificationCode: String) {
        changePassword(
            email: $email
            phone: $phone
            newPassword: $newPassword
            verificationCode: $verificationCode
        )
    }
`;
export const CHANGE_PASSWORD = gql`
  ${CHANGE_PASSWORD_QUERY}
`;
