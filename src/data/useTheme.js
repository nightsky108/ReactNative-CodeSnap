import { useMemo } from 'react';
import { useLazyQuery, NetworkStatus, useQuery } from '@apollo/client';
import { FETCH_THEME_PREVIEWS } from '@modules/theme/graphql';

import { FETCH_MESSAGES } from '@modules/message/graphql';

export const useThemes = () => {
  const { data } = useQuery(FETCH_THEME_PREVIEWS, {
    variables: {
      searchQuery: 'liveproducts',
    },
    onCompleted: response => {},
  });
  const liveProductsThemes = useMemo(() => {
    if (!data) {
      return [];
    } else {
      return data.themes.collection;
    }
  }, [data]);
  return liveProductsThemes;
};
