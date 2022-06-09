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
import { getAdjustSize, adjustFontSize, wp, hp } from '@common/responsive';
//= ==custom components & containers  =======
import { Content, Container, JitengHeaderContainer } from '@components';
import { JitengHeader } from '@containers';
//= ======Query ====================

import {
  FETCH_LIVESTREAM_CATEGORIES,
  FETCH_LIVESTREAM_PREVIEWS,
} from '@modules/liveStream/graphql';
//= ======selectors==========================
import {
  liveStreamCategoryFilterSelector,
  liveStreamStatusesFilterSelector,
  liveStreamExperienceFilterSelector,
} from '@modules/liveStream/selectors';

//= ======reducer actions====================
import {
  updateLiveStreamCategoryFilter,
  resetLiveStreamFilter,
  updateLiveStreamExperienceFilter,
  clearLiveStreamExperienceFilter,
  updateLiveStreamStatusFilter,
  setLiveStreamExperienceFilter,
} from '@modules/liveStream/slice';
//= =====hook data================================
import {
  useLiveStreamList,
  useLiveStreamCategories,
  useLiveStreamExperiences,
} from '@data/useLiveShopes';
import { useAddress, useUser, useUserSettings } from '@data/useUser';

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
const ContainerSize = getAdjustSize({ width: 172, height: 269 });
const ITEM_HEIGHT = ContainerSize.height + hp(10);
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
  const initIndex = Math.floor((route?.params?.index || 1) / 2);
  // const [initIndex, setInitIndex] = useState(0);

  const keyExtractor = useCallback(item => item?.id, []);
  const { userCurrencyISO } = useUserSettings();
  // const styles = StyleSheetFactory({ theme });
  //= ========= Props Section========
  const filterPanelRef = useRef(null);
  const categoryFilter = useSelector(state => liveStreamCategoryFilterSelector(state));
  const statusesFilter = useSelector(store => liveStreamStatusesFilterSelector(store));
  const experienceFilter = useSelector(state => liveStreamExperienceFilterSelector(state));

  //= ======== State Section========

  //= ========= GraphQl query Section========

  const {
    liveStreams,
    totalLiveStreamCount,
    loading,
    fetchMoreStreams,
    refetch: refetchLiveStreams,
    fetchingMoreStreams,
    refreshing,
  } = useLiveStreamList();
  const pending = useMemo(
    () => refreshing || loading || fetchingMoreStreams,
    [loading, fetchingMoreStreams, refreshing],
  );

  const { liveStreamCategories } = useLiveStreamCategories();
  const { liveStreamExperiences } = useLiveStreamExperiences();
  const BadgedIcon = withBadge(1, {
    badgeStyle: { backgroundColor: Colors.white },
    textStyle: { color: Colors.brandRed },
  })(TypeText);

  //= ========= Use Effect Section========
  const onNavigateFollowSellers = () => {
    navigation.navigate('FollowSellers');
  };

  const onEndReachedCalledDuringMomentum = useRef(true);
  const onSelectIndex = index => {
    console.log('onSelectIndex', index);
    // setInitIndex(Math.floor((route?.params?.index || 1) / 2));
  };

  const onNavigateBrowseLiveStream = useCallback(
    index => {
      navigation.navigate('BrowseLiveStream', { index, onSelectIndex });
      // navigation.replace('BrowseLiveStream', {
      //     index,
      // });
    },
    [navigation],
  );
  const onEndReached = ({ distanceFromEnd }) => {
    if (!onEndReachedCalledDuringMomentum.current && !fetchingMoreStreams) {
      fetchMoreStreams();
      onEndReachedCalledDuringMomentum.current = true;
    }
  };
  const onMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentum.current = false;
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
  const renderItem = useCallback(({ item, index }) => {
    return (
      <LiveStreamCard
        liveStream={item}
        onPressItem={() => {
          onNavigateBrowseLiveStream(index);
        }}
      />
    );
  }, []);
  const renderFooter = useCallback(() => {
    if (!fetchingMoreStreams) {
      return null;
    }
    return (
      <View style={styles.listFooter}>
        <ActivityIndicator animating size="large" color={Colors.loaderColor} />
      </View>
    );
  }, [fetchingMoreStreams]);
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
            <TouchableOpacity
              onPress={() => {
                dispatch(updateLiveStreamStatusFilter(constants.StreamTypeDataKey.isBroadCasting));
              }}>
              <BadgedIcon badgeStyle={{ backgroundColor: Colors.white }}>
                {t('LiveShop:Live broadcast')}
              </BadgedIcon>
              {statusesFilter === constants.StreamTypeDataKey.isBroadCasting ? (
                <Box backgroundColor={Colors.white} width="50px" height={0.8} />
              ) : null}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                dispatch(updateLiveStreamStatusFilter(constants.StreamTypeDataKey.isFollowed));
              }}>
              <BadgedIcon badgeStyle={{ backgroundColor: Colors.white }}>
                {t('LiveShop:follow')}
              </BadgedIcon>
              {statusesFilter === constants.StreamTypeDataKey.isFollowed ? (
                <Box backgroundColor={Colors.white} width="50px" height={0.8} />
              ) : null}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                dispatch(updateLiveStreamStatusFilter(constants.StreamTypeDataKey.isVideo));
              }}>
              <BadgedIcon badgeStyle={{ backgroundColor: Colors.white }}>
                {t('LiveShop:video')}
              </BadgedIcon>
              {statusesFilter === constants.StreamTypeDataKey.isVideo ? (
                <Box backgroundColor={Colors.white} width="50px" height={0.8} />
              ) : null}
            </TouchableOpacity>
          </Box>
        </JitengHeaderContainer>
        <JitengHeaderContainer isTop={false}>
          <CategoryFilterHeader
            categoryList={liveStreamCategories}
            categoryFilter={categoryFilter}
            onPressCategoryItem={id => {
              dispatch(updateLiveStreamCategoryFilter({ categoryId: id }));
              //  dispatch(resetLiveStreamFilter());
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
          setExperienceFilter={experiences => {
            dispatch(setLiveStreamExperienceFilter({ categoryFilter: experiences }));
          }}
          clearExperienceFilter={experiences => {
            dispatch(clearLiveStreamExperienceFilter());
          }}
          experienceFilter={experienceFilter}
          experiences={liveStreamExperiences}
        />
        {loading && !fetchingMoreStreams ? (
          <Content style={{ flex: 0 }} contentContainerStyle={{ flex: 1 }}>
            <ActivityIndicator
              color="black"
              size="large"
              style={{ flex: 1, alignSelf: 'center' }}
            />
          </Content>
        ) : (
          <Content
            contentContainerStyle={styles.contentContainerStyle}
            style={styles.contentView}
            isList={true}
            data={liveStreams}
            renderItem={renderItem}
            ListHeaderComponent={renderHeaderContent}
            extraData={liveStreams.length}
            keyExtractor={keyExtractor}
            onEndReached={onEndReached}
            onMomentumScrollBegin={onMomentumScrollBegin}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{
              marginTop: hp(10),
              justifyContent: 'space-between',
            }}
            initialScrollIndex={initIndex}
            getItemLayout={(data, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
            onRefresh={refetchLiveStreams}
            refreshing={refreshing}
            ListFooterComponent={renderFooter}
            initialNumToRender={6}
            windowSize={5}
            maxToRenderPerBatch={5}
            updateCellsBatchingPeriod={30}
            removeClippedSubviews={false}
            onEndReachedThreshold={0.1}
            // stickyHeaderIndices={[0]}
          />
        )}
      </Container>
    </DrawerLayout>
  );
};

export default ShopeLiveHome;
