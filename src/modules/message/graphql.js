import { gql } from '@apollo/client';

import { MessageThreadFragment, MessageFragment } from './fragment';
import { PagerFragment } from '../commonFragments';

export const ADD_MESSAGE_THREAD = gql`
  mutation addMessageThread($liveStream: ID!, $receivers: [ID]!) {
    addMessageThread(input: { liveStream: $liveStream, receivers: $receivers }) {
      ...MessageThread
    }
  }
  ${MessageThreadFragment}
`;
export const ADD_MESSAGE = gql`
  mutation addMessage($thread: ID!, $type: MessageTypeEnum!, $data: String!, $videoTime: Int) {
    addMessage(input: { thread: $thread, type: $type, data: $data, videoTime: $videoTime }) {
      ...Message
    }
  }
  ${MessageFragment}
`;
export const MESSAGE_ADDED = gql`
  subscription messageAdded($threads: [ID!], $threadTags: [String!]) {
    messageAdded(threads: $threads, threadTags: $threadTags) {
      ...Message
    }
  }
  ${MessageFragment}
`;

export const FETCH_MESSAGES = gql`
  query fetchMessages(
    $skip: Date
    $limit: Int! = 10
    $thread: ID!
    $feature: MessageSortFeature! = CREATED_AT
    $sort: SortTypeEnum! = DESC
  ) {
    messages(
      thread: $thread
      skip: $skip
      limit: $limit
      sort: { feature: $feature, type: $sort }
    ) {
      ...Message
    }
  }
  ${MessageFragment}
`;
