import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  PureComponent,
  useReducer,
} from 'react';
import { useQuery, useLazyQuery, NetworkStatus, useMutation, gql } from '@apollo/client';

import {
  FETCH_SUPPORTED_CURRENCIES,
  FETCH_CARRIERS,
  FETCH_SHIPPING_BOXES,
  ADD_SHIPPING_BOX,
  REMOVE_SHIPPING_BOX,
} from '@modules/asset/graphql';
import { ShippingBoxFragment } from '@modules/commonFragments';

export const useSupportedCurrencies = () => {
  const { data } = useQuery(FETCH_SUPPORTED_CURRENCIES, {
    fetchPolicy: 'cache-first',
  });
  const supportedCurrencies = useMemo(() => {
    if (!data) {
      return [];
    } else {
      return data.supportedCurrencies;
    }
  }, [data]);

  return supportedCurrencies;
};
export const useCarries = () => {
  const { data } = useQuery(FETCH_CARRIERS, {
    fetchPolicy: 'cache-first',
  });
  const systemCarries = useMemo(() => {
    if (!data) {
      return [];
    } else {
      return data.carriers;
    }
  }, [data]);

  return systemCarries;
};
export const useShippingBoxes = () => {
  const [removeShippingBoxMutation] = useMutation(REMOVE_SHIPPING_BOX, {});

  const { data } = useQuery(FETCH_SHIPPING_BOXES, {
    fetchPolicy: 'cache-first',
  });
  const shippingBoxes = useMemo(() => {
    if (!data) {
      return [];
    } else {
      return data.shippingBoxes;
    }
  }, [data]);

  const [addShippingBoxQuery] = useMutation(ADD_SHIPPING_BOX, {
    update(cache, { data: { addShippingBox } }) {
      cache.modify({
        fields: {
          shippingBoxes(existing) {
            const ref = cache.writeFragment({
              fragment: gql`
                ${ShippingBoxFragment}
              `,
              fragmentName: 'ShippingBox',
              data: addShippingBox,
            });
            return [...existing, ref];
          },
        },
      });
    },
  });
  const addShippingBox = async variables => {
    try {
      await addShippingBoxQuery({
        variables,
      });
    } catch (error) {
      console.log('onAddShippingBox error', error?.message);
    }
  };

  const removeShippingBox = async id => {
    try {
      await removeShippingBoxMutation({
        variables: { id },
        update(cache, { data }) {
          cache.modify({
            fields: {
              shippingBoxes(existing, { readField }) {
                return existing.filter(ref => {
                  return id !== readField('id', ref);
                });
              },
            },
          });
        },
      });
    } catch (error) {
      console.log('addDeliveryAddress error', error?.message);
    }
  };
  return { shippingBoxes, removeShippingBox, addShippingBox };
};
