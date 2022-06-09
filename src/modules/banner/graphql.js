import { gql } from '@apollo/client';

import { BannerFragment } from './fragment';
import { PagerFragment } from '../commonFragments';

export const FETCH_BANNER_PREVIEWS = gql`
  query Banners(
    $searchQuery: String
    $sitePath: String
    $bannerType: BannerType
    $adType: BannerAdType
    $layout: BannerLayoutType
    $identifiers: [String!]
    $skip: Int = 0
    $limit: Int = 10
    $feature: BannerSortFeature! = CREATED_AT
    $sortType: SortTypeEnum! = ASC
  ) {
    banners(
      filter: {
        searchQuery: $searchQuery
        sitePath: $sitePath
        type: $bannerType
        adType: $adType
        layout: $layout
        identifiers: $identifiers
      }
      sort: { type: $sortType, feature: $feature }
      page: { skip: $skip, limit: $limit }
    ) {
      collection {
        ...Banner
      }
      pager {
        ...Pager
      }
    }
  }
  ${BannerFragment}
  ${PagerFragment}
`;

export const FETCH_BANNER_BY_IDENTIFIER = gql`
  query bannerByIdentifier($identifier: String!) {
    bannerByIdentifier(identifier: $identifier) {
      ...Banner
    }
  }
  ${BannerFragment}
`;
