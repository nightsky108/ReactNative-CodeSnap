import React, {
  Component,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  PureComponent,
  useReducer,
} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Keyboard,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Animated,
  Pressable,
  InteractionManager,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

//= ==third party plugins=======
import { useTranslation } from 'react-i18next';
import { Box, HStack, Center } from 'native-base';

import { connect, useDispatch, useSelector } from 'react-redux';
import { useQuery, useLazyQuery, NetworkStatus } from '@apollo/client';

import { DrawerActions, NavigationContainer } from '@react-navigation/native';
import {
  Icon,
  CheckBox,
  SocialIcon,
  Image,
  Button,
  ListItem,
  Text,
  withBadge,
} from 'react-native-elements';
import { v4 as uuidv4 } from 'uuid';
import { DrawerLayout } from 'react-native-gesture-handler';

import Spinner from 'react-native-loading-spinner-overlay';

import _ from 'lodash';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import { adjustFontSize, wp, hp } from '@common/responsive';
//= ==custom components & containers  =======
import { Content, Container, JitengHeaderContainer } from '@components';
import { JitengHeader } from '@containers';
//= ======Query ====================

import {
  FETCH_LIVESTREAM_CATEGORIES,
  FETCH_LIVESTREAM_PREVIEWS,
} from '@modules/liveStream/graphql';
//= ======selectors==========================

//= ======reducer actions====================

//= ==========apis=======================

//= =============utils==================================
import * as constants from '@utils/constant';

//= =============styles==================================
import { Colors, Metrics, Fonts } from '@theme';
import { FilterHeader, LiveStreamCard, SellerStreamHeader } from './components';
import { FilterPanel, CategoryFilterHeader } from './containers';

import { styles } from './styles';

const faker = require('faker');

faker.locale = 'zh_CN';
const LiveStreamList = Array(6)
  .fill('')
  .map((item, i) => ({
    id: uuidv4(),
    title: `${faker.name.firstName()} ${faker.name.firstName()} ${faker.name.firstName()} ${faker.name.firstName()} ${faker.name.firstName()} ${faker.name.firstName()} ${faker.name.lastName()}`,
    streamer: {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      photo: {
        url: faker.image.people(),
      },
    },
    thumbnail: {
      url: faker.image.food(),
    },
    views: faker.datatype.number(),
  }));

const AttentionList = Array(10)
  .fill('')
  .map((item, i) => ({
    id: uuidv4(),
    title: `${faker.name.firstName()} ${faker.name.firstName()} ${faker.name.firstName()} ${faker.name.lastName()}`,
    streamer: {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      photo: {
        url: faker.image.people(),
      },
    },
    channel: {
      status: `${faker.name.firstName()} ${faker.name.lastName()}`,
    },
    thumbnail: {
      url: faker.image.food(),
    },
    views: faker.datatype.number(),
  }));
// import { StyleSheetFactory } from './styles';
const calcStyle = ({ pressed }) => {
  return [
    {
      backgroundColor: pressed ? Colors.pinkHighlight : 'transparent',
    },
    styles.wrapperCustom,
  ];
};
// AssetType
//= =============images & constants ===============================
//= ============import end ====================
const TypeText = styled.Text`
  align-self: center;
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-weight: 400;
  letter-spacing: -0.41px;
  line-height: 22px;
`;
const DrawerContainer = styled.View`
  background-color: ${Colors.red};
`;
export const limitSize = 10;
const ShopeLiveHome = ({ navigation, route }) => {
  //= ========Hook Init===========
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const keyExtractor = useCallback(item => item?.id, []);

  const streamTypeData = useMemo(() => {
    return {
      isBroadCasting: {
        id: 'isBroadCasting',
        label: t('LiveShop:Live broadcast'),
        value: {
          statuses: [
            constants.StreamChannelStatus.STREAMING,
            constants.StreamChannelStatus.PENDING,
          ],
        },
      },
      isFollowed: {
        id: 'isFollowed',
        label: t('LiveShop:follow'),
        value: {
          statuses: [
            constants.StreamChannelStatus.STREAMING,
            constants.StreamChannelStatus.PENDING,
            constants.StreamChannelStatus.FINISHED,
          ],
          isFeatured: true,
        },
      },
      isVideo: {
        id: 'isVideo',
        label: t('LiveShop:video'),
        value: {
          statuses: [constants.StreamChannelStatus.FINISHED],
        },
      },
    };
  }, [t]);
  // const styles = StyleSheetFactory({ theme });
  //= ========= Props Section========
  const fetchingMore = useRef(false);
  const filterPanelRef = useRef(null);
  //= ======== State Section========
  const [streamType, setStreamType] = useState('isBroadCasting');
  const [activeLiveStreamCategoryId, setActiveLiveStreamCategoryId] = useState(null);

  //= ========= GraphQl query Section========
  const { data: streamCategoriesCollection } = useQuery(FETCH_LIVESTREAM_CATEGORIES);
  const {
    data: streamsCollection,
    loading,
    fetchMore,
    networkStatus,
  } = useQuery(FETCH_LIVESTREAM_PREVIEWS, {
    fetchPolicy: 'cache-only',
    notifyOnNetworkStatusChange: true,
    nextFetchPolicy: 'cache-first',
    variables: {
      skip: 0,
      limit: 10,
      feature: 'CREATED_AT',
      sort: 'DESC',
      ...streamTypeData[streamType].value,
    },
  });
  const BadgedIcon = withBadge(1, {
    badgeStyle: { backgroundColor: Colors.white },
    textStyle: { color: Colors.brandRed },
  })(TypeText);

  const liveStreamCategories = useMemo(() => {
    return streamCategoriesCollection ? streamCategoriesCollection?.liveStreamCategories : [];
  }, [streamCategoriesCollection]);
  const fetchMoreStreams = useCallback(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      if (fetchingMore.current) {
        return;
      }
      fetchingMore.current = true;
      fetchMore({
        variables: {
          skip: skip + 1,
          limit: 10,
          feature: 'CREATED_AT',
          sortType: 'DESC',
          ...streamTypeData[streamType].value,
        },
      });
    });
    return () => task.cancel();
  }, [fetchMore, skip, streamType, streamTypeData]);
  const { skip, total, liveStreams } = useMemo(() => {
    if (streamsCollection) {
      const {
        liveStreams: {
          collection,
          pager: { skip, total },
        },
      } = streamsCollection;
      return { skip, total, liveStreams: collection };
    } else {
      return { skip: 0, total: 0, liveStreams: [] };
    }
  }, [streamsCollection]);
  //= ========= Use Effect Section========
  const onNavigateFollowSellers = () => {
    navigation.navigate('FollowSellers');
  };
  const renderFilterPanelDrawer = progressValue => {
    const parallax = progressValue.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    });
    const animatedStyles = {
      transform: [{ translateX: parallax }],
    };
    return (
      <Animated.View style={[styles.drawerContainer, animatedStyles]}>
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.greyRed }}>
          <FilterPanel liveStreamCategories={liveStreamCategories} />
        </SafeAreaView>
      </Animated.View>
    );
  };
  const renderHeaderContent = useCallback(() => {
    return (
      <SellerStreamHeader
        sellerStreamList={AttentionList}
        onNavigateFollowSellers={onNavigateFollowSellers}
      />
    );
  }, []);
  const renderItem = useCallback(({ item }) => {
    return <LiveStreamCard liveStream={item} />;
  }, []);
  return (
    <DrawerLayout
      ref={filterPanelRef}
      drawerWidth={wp(266)}
      keyboardDismissMode="on-drag"
      drawerPosition={DrawerLayout.positions.Right}
      drawerType="front"
      drawerBackgroundColor="transparent"
      overlayColor="#00000080"
      renderNavigationView={renderFilterPanelDrawer}>
      <Container>
        <JitengHeader />
        <JitengHeaderContainer isTop={false}>
          <Box flexDirection="row" width="100%" justifyContent="space-around" alignItems="center">
            {Object.values(streamTypeData).map(item => {
              return (
                <Pressable
                  key={item.id}
                  style={calcStyle}
                  onPress={() => {
                    setStreamType(item.id);
                  }}>
                  <BadgedIcon badgeStyle={{ backgroundColor: Colors.white }}>
                    {item.label}
                  </BadgedIcon>
                  {streamType === item.id ? (
                    <Box backgroundColor={Colors.white} width="50px" height={0.8} />
                  ) : null}
                </Pressable>
              );
            })}
          </Box>
        </JitengHeaderContainer>
        <JitengHeaderContainer isTop={false}>
          <CategoryFilterHeader
            categoryList={liveStreamCategories}
            activeCategoryId={activeLiveStreamCategoryId}
            onPressCategoryItem={id => {
              setActiveLiveStreamCategoryId(id);
            }}
            onPressFilterItem={() => {
              navigation.navigate('Category', { isProduct: false });
            }}
          />
        </JitengHeaderContainer>
        <FilterHeader
          onOpenFilterPanel={() => {
            filterPanelRef.current?.openDrawer();
          }}
        />
        <Content
          contentContainerStyle={styles.contentContainerStyle}
          style={styles.contentView}
          isList={true}
          data={LiveStreamList}
          renderItem={renderItem}
          ListHeaderComponent={renderHeaderContent}
          extraData={LiveStreamList.length}
          keyExtractor={keyExtractor}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{
            marginTop: hp(10),
            justifyContent: 'space-between',
          }}
        />
      </Container>
    </DrawerLayout>
  );
};

export default ShopeLiveHome;
