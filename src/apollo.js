import { split, HttpLink, ApolloClient, ApolloLink } from '@apollo/client';

// eslint-disable-next-line import/no-extraneous-dependencies
import { getMainDefinition, offsetLimitPagination } from '@apollo/client/utilities';
// eslint-disable-next-line import/no-extraneous-dependencies
import { WebSocketLink } from '@apollo/client/link/ws';
// eslint-disable-next-line import/no-extraneous-dependencies
import { InMemoryCache } from '@apollo/client/cache';
// eslint-disable-next-line import/no-extraneous-dependencies
import { setContext } from '@apollo/client/link/context';
// eslint-disable-next-line import/no-extraneous-dependencies
import { onError } from '@apollo/client/link/error';
// eslint-disable-next-line import/no-extraneous-dependencies

import { signOut } from '@modules/auth/slice';

import * as constants from '@utils/constant';

let apolloClient = null;

const errorHandler = store =>
  onError(errors => {
    const errorCode = errors?.networkError?.result?.errors[0]?.extensions?.code || 'ERROR';
    if (errorCode === 'UNAUTHENTICATED') {
      store.dispatch(signOut());
    }
  });

export const createApolloClient = store => {
  // create an apollo link instance, a network interface for apollo client
  const httpLink = new HttpLink({
    uri: constants.ROOT_API,
  });
  const authLink = setContext((req, { headers }) => {
    const token = store.getState().auth.authToken;
    return {
      ...headers,
      headers: {
        authorization: token ? `Bearer ${token}` : null,
      },
    };
  });
  const logoutLink = onError(({ networkError }) => {
    if (parseInt(networkError.statusCode / 100, 10) === 4) {
      //  store.dispatch(signOut());
    }
  });
  const wsLink = new WebSocketLink({
    uri: constants.WS_ROOT_API,
    options: {
      lazy: true,
      reconnect: true,
      reconnectionAttempts: 5,
      connectionParams: () => {
        const token = store.getState().auth.authToken;
        return {
          Authorization: token ? `Bearer ${token}` : null,
        };
      },
    },
  });
  const cleanTypeName = new ApolloLink((operation, forward) => {
    if (operation.variables) {
      const omitTypename = (key, value) => (key === '__typename' ? undefined : value);
      operation.variables = JSON.parse(JSON.stringify(operation.variables), omitTypename);
    }
    return forward(operation).map(data => {
      return data;
    });
  });
  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    // authLink.concat(httpLink),
    authLink.concat(cleanTypeName).concat(errorHandler(store).concat(httpLink)),
  );

  // create an inmemory cache instance for caching graphql data
  const cache = new InMemoryCache({
    addTypename: true,
    // dataIdFromObject: object => object.key || null,
    typePolicies: {
      /*
            LiveStream: {
                fields: {
                    publicMessageThread: {
                        merge(existing, incoming, { readField, mergeObjects }) {
                            console.log('merge existing', existing);
                            console.log('merge existing name', readField('tags', existing));
                            console.log('merge incoming name', readField('tags', incoming));

                            return mergeObjects(existing, incoming);
                        },
                        // read(existing, { args, readField }) {
                        //     console.log('read existing', existing);
                        //     if (existing) {
                        //         const name = readField('tags', existing);
                        //         console.log('read name', name);
                        //     }
                        //     return existing;
                        // },
                    },
                    privateMessageThreads: {
                        merge(existing = [], incoming) {
                            if (!existing) {
                                return incoming;
                            }
                            return [...existing, ...incoming];
                        },
                    },
                },
            }, */

      /* Mutation: {
                fields: {
                    joinLiveStream: {
                      
                        merge(existing, incoming, { args }) {
                            console.log('incoming', incoming);
                            console.log('existing', existing);
                            console.log('args', args);
                            return { ...existing, ...incoming };
                        },
                    },
                },
            }, */
      Organization: {
        fields: {
          address: {
            merge(existing, incoming) {
              // Equivalent to what happens if there is no custom merge function.
              return incoming;
            },
          },
        },
        billingAddress: {
          address: {
            merge(existing, incoming) {
              // Equivalent to what happens if there is no custom merge function.
              return incoming;
            },
          },
        },
      },
      Query: {
        fields: {
          productsRecommendedToMe: {
            keyArgs: false,
            ...offsetLimitPagination(),
            merge: (existing = {}, incoming, { args }) => {
              const offset = args?.page?.skip || 0;
              const response =
                offset === 0
                  ? incoming
                  : {
                      ...incoming,
                      collection: [...existing.collection, ...incoming.collection],
                    };
              // const response = incoming;
              return response;
            },
          },
          paymentMethods: {
            merge: (existing = [], incoming, { args }) => {
              return incoming;
            },
          },
          /* deliveryAddresses: {
            merge: (existing = [], incoming, { args }) => {
              console.log('incoming', incoming);
              console.log('existing', existing);
              console.log('merge', Object.values({ ...existing, ...incoming }));
              return Object.values({ ...existing, incoming });
            },
          }, */

          cart: {
            merge: (existing = {}, incoming, { args }) => {
              return incoming;
            },
          },
          products: {
            // keyArgs: false,
            keyArgs: ['filter', 'limit', 'sort'],
            merge: (existing = {}, incoming, { args }) => {
              const offset = args?.page?.skip || 0;
              /*  const response =
                  offset === 0
                      ? incoming
                      : {
                            __typename: incoming.__typename,
                            collection: existing.collection.concat(
                                incoming.collection,
                            ),
                        }; */
              const response =
                offset === 0
                  ? incoming
                  : {
                      ...incoming,
                      collection: [...existing.collection, ...incoming.collection],
                    };

              return response;
            },
          },
          purchaseOrders: {
            // keyArgs: false,
            keyArgs: ['filter'],
            /*  merge: (existing = {}, incoming, { args }) => {
              const offset = args?.page?.skip || 0;
              return offset === 0
                ? incoming
                : {
                    __typename: incoming.__typename,
                    collection: existing.collection.concat(incoming.collection),
                  };
            }, */

            merge: (existing = {}, incoming, { args }) => {
              const existingLength = existing?.collection?.length || 0;
              const limit = args?.page?.limit || 10;
              const offset = args?.page?.skip || 0;
              const response =
                offset === 0
                  ? incoming
                  : offset === existingLength - limit
                  ? existing
                  : {
                      ...incoming,
                      collection: [...existing.collection, ...incoming.collection],
                      pager: incoming.pager,
                    };
              return response;
            },
          },
          userList: {
            keyArgs: ['filter'],
            merge: (existing = {}, incoming, { args }) => {
              const offset = args?.page?.skip || 0;
              const response =
                offset === 0
                  ? incoming
                  : {
                      __typename: incoming.__typename,
                      collection: existing.collection.concat(incoming.collection),
                      pager: incoming.pager,
                    };
              return response;
            },
          },
          liveStreams: {
            keyArgs: ['filter', 'sort'],
            read(liveStreams) {
              return liveStreams;
            },
            merge: (existing = {}, incoming, { args }) => {
              const existingLength = existing?.collection?.length || 0;
              const limit = args?.page?.limit || 10;
              const offset = args?.page?.skip || 0;
              const response =
                offset === 0
                  ? incoming
                  : offset === existingLength - limit
                  ? existing
                  : {
                      ...incoming,
                      collection: [...existing.collection, ...incoming.collection],
                      pager: incoming.pager,
                    };
              return response;
            },
          },
          /*  product: {
            keyArgs: false,
            merge: (existing = {}, incoming, { args }) => {
              return incoming;
            },
          }, */
        },
      },
      /*  
            //!!!!!!please done remove 
            Mutation: {
                fields: {
                    updateLiveStreamCount: {
                        merge(_, incoming, { cache }) {
                            cache.modify({
                                fields: {
                                    liveStreams(existing, data) {
                                        cache.readFragment({
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
                    },
                },
            }, */
    },
  });

  // instantiate apollo client with apollo link instance and cache instance
  apolloClient = new ApolloClient({
    link,
    cache,
    connectToDevTools: true,
  });
  return apolloClient;
};
export const getApolloClient = () => apolloClient;
