import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, NetworkStatus, useSubscription } from '@apollo/client';
import { useSettingContext } from '@contexts/SettingContext';

import { useSelector } from 'react-redux';

import {
  liveStreamCategoryFilterSelector,
  liveStreamExperienceFilterSelector,
  liveStreamStatusesFilterSelector,
} from '@modules/liveStream/selectors';
import { userIdSelector } from '@modules/auth/selectors';

import {
  FETCH_LIVESTREAM_LIST,
  FETCH_LIVESTREAM_CATEGORIES,
  FETCH_LIVE_STREAM_EXPERIENCES,
  JOIN_LIVESTREAM_FULL_ACTION,
  JOIN_LIVESTREAM,
  UPDATE_LIVESTREAM_COUNT,
  SUBSCRIBE_LIVESTREAM,
} from '@modules/liveStream/graphql';
import * as constants from '@utils/constant';

/* export function useQuery(query, options) {
    // make a new request if variables have been changed
    // it's not the same as cache-and-network
    // since cache-and-network refetches initial request after writeQuery
    // all combinations of fetchPolicy and nextFetchPolicy also not work

    const opt = useRef(null);

    const fetchPolicy =
        options?.fetchPolicy ||
        (isEqual(opt.current, options) // check if variables have changed, if so use cache-and-network
            ? 'cache-first'
            : 'cache-and-network');

    opt.current = options;

    return _useQuery(query, { ...options, fetchPolicy });
} */
const Limit = 6;
export const useLiveStreamList = () => {
  const streamCategoryFilter = useSelector(store => liveStreamCategoryFilterSelector(store));
  const streamExperienceFilter = useSelector(store => liveStreamExperienceFilterSelector(store));
  const streamStatusesFilter = useSelector(store => liveStreamStatusesFilterSelector(store));
  // const [liveStreams, setLiveStreams] = useState([]);
  // const [totalLiveStreamCount, setTotalLiveStreamCount] = useState(0);
  const [joinStreamFullAction] = useMutation(JOIN_LIVESTREAM_FULL_ACTION);
  const [joinStream] = useMutation(JOIN_LIVESTREAM);
  const [uploadStreamCount] = useMutation(UPDATE_LIVESTREAM_COUNT);
  const { userCurrencyISO, userLanguage } = useSettingContext();
  const [fetchingMore, setFetchingMore] = useState(false);
  const variables = useMemo(() => {
    const filter = {
      categories: streamCategoryFilter,
      experiences: streamExperienceFilter,
    };
    if (streamStatusesFilter) {
      // filter.statuses = constants.StreamTypeData[streamStatusesFilter];
    }
    return filter;
  }, [streamCategoryFilter, streamExperienceFilter, streamStatusesFilter]);

  const {
    loading,
    fetchMore,
    refetch,
    networkStatus,
    data: liveStreamData,
  } = useQuery(FETCH_LIVESTREAM_LIST, {
    fetchPolicy: 'cache-first',
    // fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    nextFetchPolicy: 'cache-first',
    variables: {
      skip: 0,
      limit: Limit,
      feature: 'CREATED_AT',
      sortType: 'DESC',
      currency: userCurrencyISO,
      language: userLanguage,
      ...variables,
    },
    onCompleted: data => {
      setFetchingMore(false);
    },
    onError: error => {
      setFetchingMore(false);
      console.log('fetch livestreamList error', error);
    },
  });
  const { liveStreams, totalLiveStreamCount } = useMemo(() => {
    if (!liveStreamData) {
      return { liveStreams: [], totalLiveStreamCount: 0 };
    } else {
      const {
        collection,
        pager: { total },
      } = liveStreamData.liveStreams;
      return { liveStreams: collection, totalLiveStreamCount: total };
    }
  }, [liveStreamData]);

  const joinLiveStream = useCallback(
    liveStreamId => {
      try {
        joinStream({ variables: { liveStreamId, language: userLanguage } });
        uploadStreamCount({
          variables: { streamId: liveStreamId, playLength: 0, view: 'view', tag: 'real' },
          /*  
            //!!!!!!please done remove 
            update(cache, { data: { updateLiveStreamCount: liveStream } }) {
                cache.modify({
                    fields: {
                        liveStreams(existing, data) {
                            cache.writeFragment({
                                data: liveStream,
                                fragment: gql`
                                    ${LiveStreamPreviewFragment}
                                `,
                                fragmentName: 'LiveStreamPreview',
                            });
                            return { ...existing };
                        },
                    },
                });
            }, 
          */
        });
      } catch (error) {
        console.log('error', error?.message);
      }
    },
    [joinStream, uploadStreamCount],
  );
  /*  const fetchMoreStreams = useCallback(() => {
        const task = InteractionManager.runAfterInteractions(() => {
            if (fetchingMore || liveStreams.length >= totalLiveStreamCount) {
                return;
            }
            setFetchingMore(true);
            fetchMore({
                variables: {
                    skip: liveStreams.length,
                    limit: Limit,
                    feature: 'CREATED_AT',
                    sortType: 'DESC',
                    ...variables,
                },
            });
        });
        return () => task.cancel();
    }, [fetchMore, fetchingMore, liveStreams, totalLiveStreamCount, variables]); */
  const fetchMoreStreams = useCallback(() => {
    if (fetchingMore || liveStreams.length >= totalLiveStreamCount) {
      return;
    }
    setFetchingMore(true);

    fetchMore({
      variables: {
        skip: liveStreams.length,
        limit: Limit,
        feature: 'CREATED_AT',
        sortType: 'DESC',
        currency: userCurrencyISO,
        language: userLanguage,
        ...variables,
      },
    });
  }, [fetchMore, fetchingMore, liveStreams, totalLiveStreamCount, userCurrencyISO, variables]);

  const refreshing = networkStatus === NetworkStatus.refetch;

  /* console.log(
        'liveStreams',
        _.map(liveStreams, item => {
            return { id: item?.id, views: item?.views, likes: item?.likes };
        }),
    ); */

  return {
    liveStreams,
    totalLiveStreamCount,
    loading,
    fetchMoreStreams,
    fetchingMoreStreams: fetchingMore,
    refreshing,
    refetch,
  };
};
export const useLiveStreamCategories = () => {
  const { userLanguage } = useSettingContext();
  const [liveStreamCategories, setLiveStreamCategories] = useState([]);
  useQuery(FETCH_LIVESTREAM_CATEGORIES, {
    fetchPolicy: 'cache-first',
    onCompleted: data => {
      setLiveStreamCategories(data?.liveStreamCategories || []);
    },
  });

  return { liveStreamCategories };
};
export const useLiveStreamExperiences = () => {
  const [liveStreamExperiences, setLiveStreamExperiences] = useState([]);
  useQuery(FETCH_LIVE_STREAM_EXPERIENCES, {
    fetchPolicy: 'cache-first',
    onCompleted: data => {
      setLiveStreamExperiences(data?.liveStreamExperiences || []);
    },
  });

  return { liveStreamExperiences };
};
export const useSubscribeStream = liveStreamId => {
  const { data: subscribeData } = useSubscription(SUBSCRIBE_LIVESTREAM, {
    variables: {
      liveStreamId,
    },
  });
  return { subscribeData };
};
