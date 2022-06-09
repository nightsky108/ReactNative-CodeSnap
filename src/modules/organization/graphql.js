import { gql } from '@apollo/client';

import { PagerFragment, OrganizationPreviewFragment } from '../commonFragments';

export const FETCH_ORGANIZATIONS_PREVIEWS = gql`
  query Organizations(
    $searchQuery: String
    $ids: [ID!]
    $skip: Int = 0
    $limit: Int = 10
    $feature: OrganizationSortFeature! = CREATED_AT
    $sortType: SortTypeEnum! = ASC
  ) {
    organizations(
      filter: { searchQuery: $searchQuery, ids: $ids }
      sort: { type: $sortType, feature: $feature }
      page: { skip: $skip, limit: $limit }
    ) {
      collection {
        ...OrganizationPreview
      }
      pager {
        ...Pager
      }
    }
  }
  ${OrganizationPreviewFragment}
  ${PagerFragment}
`;
