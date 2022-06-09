import { useMemo } from 'react';
import { useLazyQuery, NetworkStatus } from '@apollo/client';

import { FETCH_MESSAGES } from '@modules/message/graphql';

const Limit = 30;

export const useMessages = ({ thread }) => {
  const [fetchMessagesForThread, { loading, refetch, networkStatus, data: messagesData, called }] =
    useLazyQuery(FETCH_MESSAGES, {
      fetchPolicy: 'cache-and-network',
      variables: {
        thread,
        limit: Limit,
      },

      onError: error => {
        console.log('fetch messages error', error);
      },
    });
  const messages = useMemo(() => {
    if (!messagesData) {
      return [];
    } else {
      return messagesData?.messages || [];
    }
  }, [messagesData]);

  const refreshing = networkStatus === NetworkStatus.refetch;

  return {
    messages,
    loading,
    refreshing,
    refetch,
    called,
    fetchMessagesForThread,
  };
};
