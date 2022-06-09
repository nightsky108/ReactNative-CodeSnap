import { gql } from '@apollo/client';

import {
  LiveStreamPreviewFragment,
  LiveStreamFragment,
  LiveStreamCategoryPreviewFragment,
  LiveStreamExperiencePreviewFragment,
  StreamChannelFragment,
} from './fragment';
import { PagerFragment } from '../commonFragments';

export const FETCH_LIVESTREAM_PREVIEWS = gql`
  query liveStreamPreviews(
    $skip: Int
    $limit: Int
    $categories: [ID]
    $experiences: [ID]
    $cities: [ID]
    $statuses: [StreamChannelStatus]
    $streamers: [ID!]
    $feature: LiveStreamSortFeature = CREATED_AT
    $sort: SortTypeEnum = DESC
  ) {
    liveStreams(
      filter: {
        categories: $categories
        experiences: $experiences
        cities: $cities
        streamers: $streamers
        statuses: $statuses
      }
      page: { skip: $skip, limit: $limit }
      sort: { feature: $feature, type: $sort }
    ) {
      collection {
        ...LiveStreamPreview
      }
      pager {
        ...Pager
      }
    }
  }
  ${LiveStreamPreviewFragment}
  ${PagerFragment}
`;
export const FETCH_LIVESTREAM_LIST = gql`
  query liveStreamList(
    $skip: Int
    $limit: Int
    $categories: [ID]
    $experiences: [ID]
    $cities: [ID]
    $statuses: [StreamChannelStatus]
    $streamers: [ID!]
    $feature: LiveStreamSortFeature = CREATED_AT
    $sort: SortTypeEnum = DESC
    $currency: Currency
    $language: LanguageList
  ) {
    liveStreams(
      filter: {
        categories: $categories
        experiences: $experiences
        cities: $cities
        streamers: $streamers
        statuses: $statuses
      }
      page: { skip: $skip, limit: $limit }
      sort: { feature: $feature, type: $sort }
    ) {
      collection {
        ...LiveStream
      }
      pager {
        ...Pager
      }
    }
  }
  ${LiveStreamFragment}
  ${PagerFragment}
`;

export const JOIN_LIVESTREAM = gql`
  mutation joinLiveStream($liveStreamId: ID!, $currency: Currency, $language: LanguageList) {
    joinLiveStream(id: $liveStreamId) {
      ...LiveStream
    }
  }
  ${LiveStreamFragment}
`;
/* export const SUBSCRIBE_LIVESTREAM = gql`
    subscription streamStatistic($liveStreamId: ID!) {
        liveStream(id: $liveStreamId) {
            ...LiveStream
        }
    }
    ${LiveStreamFragment}
`; 
export const LIKE_STREAM = gql`
    mutation likeStream($liveStreamId: ID!) {
        likeLiveStream(id: $liveStreamId) {
            ...LiveStream
        }
    }
    ${LiveStreamFragment}
`; */
export const SUBSCRIBE_LIVESTREAM = gql`
  subscription streamStatistic($liveStreamId: ID!) {
    liveStream(id: $liveStreamId) {
      id
      likes
      views
      channel {
        ...StreamChannel
      }
    }
  }
  ${StreamChannelFragment}
`;
export const LIKE_STREAM = gql`
  mutation likeStream($liveStreamId: ID!) {
    likeLiveStream(id: $liveStreamId) {
      id
      likes
      views
      isLiked
    }
  }
`;
export const JOIN_LIVESTREAM_FULL_ACTION = gql`
  mutation joinLiveStreamFullAction(
    $liveStreamId: ID!
    $realAccountData: LiveStreamUpdateInput
    $realViewData: LiveStreamUpdateInput
    $realLikeData: LiveStreamUpdateInput
  ) {
    joinLiveStream(id: $liveStreamId) {
      ...LiveStream
    }
    realAccount: updateLiveStreamCount(data: $realAccountData) {
      ...LiveStream
    }
    realViewAccount: updateLiveStreamCount(data: $realViewData) {
      ...LiveStream
    }
    realLikeAccount: updateLiveStreamCount(data: $realLikeData) {
      ...LiveStream
    }
  }
  ${LiveStreamFragment}
`;

/* export const LEAVE_LIVESTREAM_FULL_ACTION = gql`
    mutation leaveLiveStreamFullAction(
        $liveStreamId: ID!
        $realViewData: LiveStreamUpdateInput
        $realLikeData: LiveStreamUpdateInput
    ) {
        realViewAccount: updateLiveStreamCount(data: $realViewData) {
            ...LiveStream
        }
        realLikeAccount: updateLiveStreamCount(data: $realLikeData) {
            ...LiveStream
        }
        leaveLiveStream(id: $liveStreamId)
    }
    ${LiveStreamFragment}
`; */
export const LEAVE_LIVESTREAM_FULL_ACTION = gql`
  mutation leaveLiveStreamFullAction(
    $liveStreamId: ID!
    $realViewData: LiveStreamUpdateInput
    $realLikeData: LiveStreamUpdateInput
  ) {
    realViewAccount: updateLiveStreamCount(data: $realViewData) {
      id
      likes
      views
    }
    realLikeAccount: updateLiveStreamCount(data: $realLikeData) {
      id
      likes
      views
    }
    leaveLiveStream(id: $liveStreamId)
  }
`;
export const LEAVE_LIVESTREAM = gql`
  mutation leaveLiveStream($liveStreamId: ID!) {
    leaveLiveStream(id: $liveStreamId)
  }
`;

export const UPDATE_LIVESTREAM_COUNT = gql`
  mutation updateLiveStreamCount($streamId: ID!, $playLength: Int!, $view: String!, $tag: String!) {
    updateLiveStreamCount(
      data: { id: $streamId, playLength: $playLength, view: $view, tag: $tag }
    ) {
      id
      likes
      views
    }
  }
`;

export const FETCH_LIVESTREAM_CATEGORIES = gql`
  query liveStreamCategories($hasStream: Boolean, $locale: Locale) {
    liveStreamCategories(hasStream: $hasStream) {
      ...LiveStreamCategoryPreview
    }
  }
  ${LiveStreamCategoryPreviewFragment}
`;
export const FETCH_LIVE_STREAM_EXPERIENCES = gql`
  query liveStreamExperiences($hasStream: Boolean, $locale: Locale) {
    liveStreamExperiences(hasStream: $hasStream) {
      ...LiveStreamExperiencePreview
    }
  }
  ${LiveStreamExperiencePreviewFragment}
`;
