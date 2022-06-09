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
  // StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, Box, HStack, Center } from 'native-base';

//= ==third party plugins=======
import { useTranslation } from 'react-i18next';

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
//= ==========apis=======================

//= =============utils==================================
import * as constants from '@utils/constant';

//= =============styles==================================
import { Colors, Metrics, Fonts } from '@theme';
import { LiveStreamContainer } from './containers';

import { styles } from './styles';

const faker = require('faker');

faker.locale = 'zh_CN';

// import { StyleSheetFactory } from './styles';

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
const BrowseLiveStream = ({ navigation, route }) => {
  //= ========Hook Init===========
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const keyExtractor = useCallback(item => item?.id, []);
  const panelListRef = useRef(null);
  const streamItemRefs = useRef({});
  const initIndex = route?.params?.index || 0;
  const onSelectIndex = route?.params?.onSelectIndex;
  const timer = useRef(null);
  const focusIndex = useRef(0);
  //= ======== State Section========\
  const [visibleId, setVisibleId] = useState(null);

  //= ========= GraphQl query Section========

  const {
    liveStreams,
    totalLiveStreamCount,
    loading,
    fetchMoreStreams,
    refetch: refetchLiveStreams,
    fetchingMoreStreams,
    refreshing,
    // fetchLiveStreamList,
  } = useLiveStreamList();

  //= ========= Use Effect Section========

  const onEndReachedCalledDuringMomentum = useRef(true);

  const onEndReached = ({ distanceFromEnd }) => {
    if (!onEndReachedCalledDuringMomentum.current && !fetchingMoreStreams) {
      fetchMoreStreams();
      onEndReachedCalledDuringMomentum.current = true;
    }
  };
  const onMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentum.current = false;
  };
  const onLayout = () => {
    panelListRef?.current.scrollToIndex({ index: initIndex });
  };
  const updateVisibleId = useCallback(id => {
    timer.current = setTimeout(() => {
      setVisibleId(id);
    }, 1500);
  }, []);
  const clearVisibleId = useCallback(() => {
    clearTimeout(timer.current);
  }, []);

  const renderItem = useCallback(({ item }) => {
    return (
      <LiveStreamContainer
        liveStream={item}
        ref={ref => {
          streamItemRefs.current[`${item.id}`] = ref;
        }}
      />
    );
  }, []);
  const onViewableItemsChanged = useRef(({ viewableItems, changed }) => {
    changed.forEach(item => {
      if (!item.isViewable) {
        streamItemRefs.current[item.key].stop();
        // clearVisibleId();
      }
    });

    viewableItems.forEach(item => {
      if (item.isViewable) {
        // updateVisibleId(item.key);
        streamItemRefs.current[item.key].start();
        focusIndex.current = item.index;
      }
    });
  });
  const viewConfigRef = useRef({
    //  viewAreaCoveragePercentThreshold: 90,
    itemVisiblePercentThreshold: 90,
  });
  const renderFooter = useCallback(() => {
    if (!fetchingMoreStreams) {
      return null;
    }
    return <ActivityIndicator animating size="large" color={Colors.loaderColor} />;
  }, [fetchingMoreStreams]);
  return (
    <Container>
      <StatusBar hidden={true} />
      <TouchableOpacity
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'ShopeLiveHome', params: { index: focusIndex.current } }],
          });
        }}
        style={{ position: 'absolute', right: wp(15), top: wp(15), zIndex: 99 }}>
        <Icon name="close" type="antdesign" color={Colors.white} size={30} />
      </TouchableOpacity>

      {loading && !fetchingMoreStreams ? (
        <Content
          style={{ flex: 0 }}
          contentContainerStyle={{ flex: 1, backgroundColor: '#000000' }}>
          <ActivityIndicator color="white" size="large" style={{ flex: 1, alignSelf: 'center' }} />
        </Content>
      ) : (
        <Content
          ref={panelListRef}
          contentContainerStyle={styles.contentContainerStyle}
          onViewableItemsChanged={onViewableItemsChanged.current}
          style={styles.contentView}
          isList={true}
          data={liveStreams}
          initialScrollIndex={initIndex}
          renderItem={renderItem}
          extraData={liveStreams.length}
          keyExtractor={keyExtractor}
          onEndReached={onEndReached}
          onMomentumScrollBegin={onMomentumScrollBegin}
          snapToAlignment="start"
          getItemLayout={(data, index) => ({
            length: Dimensions.get('window').height,
            offset: Dimensions.get('window').height * index,
            index,
          })}
          snapToInterval={Dimensions.get('window').height}
          viewabilityConfig={viewConfigRef.current}
          decelerationRate="fast"
          pagingEnabled={true}
          onEndReachedThreshold={0.3}
          showsVerticalScrollIndicator={false}
          // onRefresh={refetchLiveStreams}
          // refreshing={refreshing}
          nestedScrollEnabled={true}
          initialNumToRender={1}
          maxToRenderPerBatch={1} // Reduce number in each render batch
          updateCellsBatchingPeriod={100} // Increase time between renders
          windowSize={2} // Reduce the window size
          // ListFooterComponent={renderFooter}
        />
      )}
    </Container>
  );
};

export default BrowseLiveStream;
