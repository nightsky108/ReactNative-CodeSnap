import { gql } from '@apollo/client';

import { SellerPreviewFragment } from './fragment';
import { PagerFragment, UserPreviewFragment } from '../commonFragments';

export const FETCH_USERS_PREVIEWS = gql`
  query userListPreviews(
    $searchQuery: String
    $language: [ID!]
    $currency: [ID!]
    $zipcode: [ID!]
    $country: [ID!]
    $name: String
    $useremail: String
    $phone: String
    $userID: ID
    $seller: Boolean
    $skip: Int
    $limit: Int
    $type: SortTypeEnum! = ASC
    $feature: UserSortFeature! = CREATED_AT
  ) {
    userList(
      filter: {
        searchQuery: $searchQuery
        language: $language
        currency: $currency
        zipcode: $zipcode
        country: $country
        name: $name
        useremail: $useremail
        phone: $phone
        userID: $userID
        seller: $seller
      }
      page: { skip: $skip, limit: $limit }
      sort: { type: $type, feature: $feature }
    ) {
      collection {
        ...UserPreview
      }
      pager {
        ...Pager
      }
    }
  }
  ${UserPreviewFragment}
  ${PagerFragment}
`;
