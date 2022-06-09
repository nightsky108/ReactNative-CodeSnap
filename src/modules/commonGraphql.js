import { gql } from '@apollo/client';
import { PagerFragment } from './commonFragments';

export const ELASTIC_SEARCH = gql`
  query elasticSearch($skip: Int, $limit: Int, $category: String!, $searchKey: String!) {
    elasticSearch(
      category: $category
      searchKey: $searchKey
      page: { skip: $skip, limit: $limit }
    ) {
      collection {
        id
        title
        assets {
          id
          url
        }
        type
      }
    }
  }
`;

export const REPORT_COMPLAINT = gql`
  mutation reportComplaint($user: ID, $product: ID, $liveStream: ID, $reasons: [ComplaintReason!]) {
    reportComplaint(
      data: { user: $user, product: $product, liveStream: $liveStream, reasons: $reasons }
    )
  }
`;
