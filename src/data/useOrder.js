import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  PureComponent,
  useReducer,
} from 'react';
import { useQuery, useLazyQuery, NetworkStatus } from '@apollo/client';

import { FETCH_AVAILABLE_PAYMENT_METHODS_QUERY } from '@modules/asset/graphql';

export const useAvailablePaymentMethods = () => {
  const { data: availablePaymentMethods } = useQuery(FETCH_AVAILABLE_PAYMENT_METHODS_QUERY, {
    fetchPolicy: 'cache-first',
  });

  return availablePaymentMethods;
};
