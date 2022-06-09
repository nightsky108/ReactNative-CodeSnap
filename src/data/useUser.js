import { useEffect, useMemo } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import _ from 'lodash';
import { FETCH_REGIONS } from '@modules/asset/graphql';
import { usePrevious } from '@common/usehook';

import {
  GET_USER_SETTINGS,
  GET_USER_INFO,
  ADDRESSES,
  GET_DELIVERY_ADDRESSES,
  GET_BILLING_ADDRESSES,
  ADD_DELIVERY_ADDRESS,
  UPDATE_DELIVERY_ADDRESS,
  DELETE_DELIVERY_ADDRESS,
  ADD_BILLING_ADDRESS,
  UPDATE_BILLING_ADDRESS,
  DELETE_BILLING_ADDRESS,
  GET_USER_ORGANIZATION,
  UPDATE_ORGANIZATION,
} from '@modules/auth/graphql';

import { DeliveryAddressFragment, OrganizationFragment } from '@modules/commonFragments';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveDeliveryAddressId, setActiveBillingAddressId } from '@modules/auth/slice';
//= ======selectors==========================
import {
  activeDeliveryAddressIdSelector,
  activeBillingAddressIdSelector,
} from '@modules/auth/selectors';

export const useAddress = () => {
  const dispatch = useDispatch();
  const activeDeliveryAddressId = useSelector(state => activeDeliveryAddressIdSelector(state));
  const activeBillingAddressId = useSelector(state => activeBillingAddressIdSelector(state));

  const { data: deliveryAddressData } = useQuery(GET_DELIVERY_ADDRESSES, {
    fetchPolicy: 'cache-first',
  });
  const { data: billingAddressData } = useQuery(GET_BILLING_ADDRESSES, {
    fetchPolicy: 'cache-first',
  });

  const deliveryAddresses = useMemo(() => {
    if (!deliveryAddressData) {
      return [];
    } else {
      return deliveryAddressData?.deliveryAddresses || [];
    }
  }, [deliveryAddressData]);
  const billingAddresses = useMemo(() => {
    if (!billingAddressData) {
      return [];
    } else {
      return billingAddressData?.billingAddresses || [];
    }
  }, [billingAddressData]);

  const [addDeliveryAddressMutation] = useMutation(ADD_DELIVERY_ADDRESS, {
    update(cache, { data: { addDeliveryAddress } }) {
      cache.modify({
        fields: {
          deliveryAddresses(existing) {
            const ref = cache.writeFragment({
              fragment: gql`
                ${DeliveryAddressFragment}
              `,
              fragmentName: 'DeliveryAddress',
              data: addDeliveryAddress,
            });
            return [...existing, ref];
          },
        },
      });
    },
  });
  const [updateDeliveryAddressMutation] = useMutation(UPDATE_DELIVERY_ADDRESS, {});
  const [deleteDeliveryAddressMutation] = useMutation(DELETE_DELIVERY_ADDRESS, {});

  const [addBillingAddressMutation] = useMutation(ADD_BILLING_ADDRESS, {
    update(cache, { data: { addBillingAddress } }) {
      cache.modify({
        fields: {
          billingAddresses(existing) {
            const ref = cache.writeFragment({
              fragment: gql`
                ${DeliveryAddressFragment}
              `,
              fragmentName: 'DeliveryAddress',
              data: addBillingAddress,
            });
            return [...existing, ref];
          },
        },
      });
    },
  });
  const [updateBillingAddressMutation] = useMutation(UPDATE_BILLING_ADDRESS, {});
  const [deleteBillingAddressMutation] = useMutation(DELETE_BILLING_ADDRESS, {});

  const addDeliveryAddress = async ({
    label,
    street,
    city,
    country,
    region,
    zipCode,
    description,
  }) => {
    try {
      const {
        data: {
          addDeliveryAddress: { id },
        },
      } = await addDeliveryAddressMutation({
        variables: { label, street, city, country, region, zipCode, description },
      });
      updateActiveDeliveryAddressId(id);
    } catch (error) {
      console.log('addDeliveryAddress error', error?.message);
    }
  };
  const updateDeliveryAddress = async ({
    id,
    label,
    street,
    city,
    country,
    region,
    zipCode,
    description,
    addressId,
  }) => {
    try {
      await updateDeliveryAddressMutation({
        variables: { id, addressId, label, street, city, country, region, zipCode, description },
      });
    } catch (error) {
      console.log('addDeliveryAddress error', error?.message);
    }
  };
  const deleteDeliveryAddress = async id => {
    try {
      await deleteDeliveryAddressMutation({
        variables: { id },
        update(cache, { data }) {
          cache.modify({
            fields: {
              deliveryAddresses(existing, { readField }) {
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

  const addBillingAddress = async ({
    label,
    street,
    city,
    country,
    region,
    zipCode,
    description,
  }) => {
    try {
      const {
        data: {
          addBillingAddress: { id },
        },
      } = await addBillingAddressMutation({
        variables: { label, street, city, country, region, zipCode, description },
      });
      updateActiveBillingAddressId(id);
    } catch (error) {
      console.log('addDeliveryAddress error', error?.message);
    }
  };
  const updateBillingAddress = async ({
    id,
    label,
    street,
    city,
    country,
    region,
    zipCode,
    description,
    addressId,
  }) => {
    try {
      await updateBillingAddressMutation({
        variables: { id, addressId, label, street, city, country, region, zipCode, description },
      });
    } catch (error) {
      console.log('addDeliveryAddress error', error?.message);
    }
  };
  const deleteBillingAddress = async id => {
    try {
      await deleteBillingAddressMutation({
        variables: { id },
        update(cache, { data }) {
          cache.modify({
            fields: {
              billingAddresses(existing, { readField }) {
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

  const activeDeliveryAddress = useMemo(() => {
    if (!activeDeliveryAddressId) {
      return null;
    }
    const candidate = _.findLast(
      deliveryAddresses,
      address => address?.id === activeDeliveryAddressId,
    );
    return candidate || null;
  }, [activeDeliveryAddressId, deliveryAddresses]);

  const activeBillingAddress = useMemo(() => {
    if (!activeBillingAddressId) {
      return null;
    }

    const candidate = _.findLast(
      billingAddresses,
      address => address?.id === activeBillingAddressId,
    );
    return candidate || null;
  }, [activeBillingAddressId, billingAddresses]);
  const updateActiveDeliveryAddressId = id => {
    if (id !== activeDeliveryAddressId) {
      dispatch(
        setActiveDeliveryAddressId({
          activeDeliveryAddressId: id,
        }),
      );
    }
  };
  const updateActiveBillingAddressId = id => {
    if (id !== activeBillingAddressId) {
      dispatch(
        setActiveBillingAddressId({
          activeBillingAddressId: id,
        }),
      );
    }
  };
  useEffect(() => {
    if (billingAddresses.length > 0) {
      if (
        activeBillingAddressId === null ||
        _.filter(billingAddresses, address => address?.id === activeBillingAddressId).length === 0
      ) {
        dispatch(
          setActiveBillingAddressId({
            activeBillingAddressId: billingAddresses[0].id,
          }),
        );
      }
    } else if (activeBillingAddressId) {
      dispatch(
        setActiveBillingAddressId({
          activeBillingAddressId: null,
        }),
      );
    }

    return () => {};
  }, [activeBillingAddressId, billingAddresses]);
  useEffect(() => {
    if (deliveryAddresses.length > 0) {
      if (
        activeDeliveryAddressId === null ||
        _.filter(deliveryAddresses, address => address?.id === activeDeliveryAddressId).length === 0
      ) {
        updateActiveDeliveryAddressId(deliveryAddresses[0].id);
      }
    } else if (activeDeliveryAddressId) {
      updateActiveDeliveryAddressId(null);
    }
    return () => {};
  }, [activeDeliveryAddressId, deliveryAddresses]);

  return {
    deliveryAddresses,
    billingAddresses,
    activeDeliveryAddress,
    activeBillingAddress,
    updateActiveDeliveryAddressId,
    updateActiveBillingAddressId,
    activeDeliveryAddressId,
    activeBillingAddressId,
    addDeliveryAddress,
    updateDeliveryAddress,
    deleteDeliveryAddress,
    addBillingAddress,
    updateBillingAddress,
    deleteBillingAddress,
  };
};

export const useProfile = () => {
  console.log('useProfile');
  const { data } = useQuery(GET_USER_INFO, {
    fetchPolicy: 'cache-first',
  });
  const user = useMemo(() => {
    if (!data) {
      return null;
    } else {
      return data?.me;
    }
  }, [data]);

  return { user };
};

export const useOrganization = () => {
  const { data } = useQuery(GET_USER_ORGANIZATION, {
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
  });
  const organization = useMemo(() => {
    if (!data) {
      return null;
    } else {
      return data?.organization;
    }
  }, [data]);

  const [updateOrganization] = useMutation(UPDATE_ORGANIZATION, {
    update(cache, { data: { updateOrganization } }) {
      cache.modify({
        fields: {
          organization(existing) {
            const ref = cache.writeFragment({
              fragment: gql`
                ${OrganizationFragment}
              `,
              fragmentName: 'Organization',
              data: updateOrganization,
            });
            return ref;
          },
        },
      });
    },
  });
  const onUpdateOrganization = async variables => {
    try {
      await updateOrganization({
        variables,
      });
    } catch (error) {
      console.log('onUpdateOrganization error', error?.message);
    }
  };
  return { organization, onUpdateOrganization };
};

export const useRegion = () => {
  const { data } = useQuery(FETCH_REGIONS, {
    fetchPolicy: 'cache-first',
    variables: {
      countryId: 'CN',
    },
  });
  const regions = useMemo(() => {
    if (!data) {
      return [];
    } else {
      return data?.regions;
    }
  }, [data]);

  return regions;
};
export const useUserSettings = () => {
  const { data } = useQuery(GET_USER_SETTINGS, {
    fetchPolicy: 'cache-first',
  });
  const userSettings = useMemo(() => {
    if (!data) {
      return {
        language: { id: 'ZH', name: 'Chinese' },
        measureSystem: 'USC',
        moneyDetails: { ISO: 'CNY', symbol: '¥' },
        pushNotifications: [],
      };
    } else {
      return data?.userSettings;
    }
  }, [data]);

  const userCurrencyISO = useMemo(() => {
    return userSettings?.moneyDetails?.ISO;
  }, [userSettings]);
  const userCurrencySymbol = useMemo(() => {
    return userSettings?.moneyDetails?.symbol;
  }, [userSettings]);
  const userLanguage = useMemo(() => {
    return userSettings?.language?.id;
  }, [userSettings]);
  const userCountry = { id: 'CN', name: 'China' };

  return {
    userSettings,
    userCurrencyISO,
    userCurrencySymbol,
    userLanguage,
    userCountry,
  };
};
