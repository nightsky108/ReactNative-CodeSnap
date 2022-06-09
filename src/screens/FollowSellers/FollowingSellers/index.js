import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useReducer,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  View,
  Alert,
  Keyboard,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  InteractionManager,
  StyleSheet,
} from 'react-native';
import { AlertDialog } from 'native-base';

import { useQuery, NetworkStatus } from '@apollo/client';
import PropTypes from 'prop-types';
//= ==third party plugins=======
import { connect, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import { Icon, CheckBox, SocialIcon, Image, ListItem, Text } from 'react-native-elements';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import Toast from 'react-native-root-toast';

//= ===inner component======================
//= ==custom components & containers  =======
import { Content, Container } from '@components';
//= ======selectors==========================

//= ======reducer actions====================

//= ======Query ====================

import { FETCH_USERS_PREVIEWS } from '@modules/users/graphql';
//= ==========apis=======================

//= =============utils==================================
import * as constants from '@utils/constant';

//= =============styles==================================
import { Colors, Metrics, Fonts } from '@theme';
import { hp } from '@src/common/responsive';
import { FollowSellerItem } from '../Components';
//= ========test data=========================
const faker = require('faker');

faker.locale = 'zh_CN';
const generateFakeData = () => {
  const FollowingList = Array(15)
    .fill('')
    .map((item, i) => ({
      id: uuidv4(),
      title: `${faker.name.firstName()} ${faker.name.firstName()} ${faker.name.firstName()} ${faker.name.firstName()} ${faker.name.firstName()} ${faker.name.firstName()} ${faker.name.lastName()}`,
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      photo: {
        url: faker.image.people(),
      },
    }));
  return FollowingList;
};

const FollowingSellers = forwardRef(({ searchQuery }, ref) => {
  //= ========Hook Init===========

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  //= ========= Props Section========
  const fetchingMore = useRef(false);

  //= ======== State Section========
  const [followings, setFollowings] = useState(generateFakeData());
  const [selectedSellerIds, setSelectedSellerIds] = useState([]);
  const [isOpenConfirmAlert, setIsOpenConfirmAlert] = useState(false);
  const [applyMore, setApplyMore] = useState(false);
  useImperativeHandle(ref, () => ({
    toggleApplyMore() {
      setApplyMore(prev => !prev);
      setSelectedSellerIds([]);
    },
  }));
  const delayQueryCall = useRef(_.debounce(q => {}, 500)).current;
  useEffect(() => {
    if (searchQuery.length < 1) {
      return;
    }
    delayQueryCall(searchQuery);
    return () => {};
  }, [delayQueryCall, searchQuery]);
  // pls check original state double when  update filter
  /*  const {
        loading: followingsLoading,
        fetchMore,
        refetch,
        networkStatus,
    } = useQuery(FETCH_USERS_PREVIEWS, {
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
        nextFetchPolicy: 'cache-first',
        variables: {
            skip: 0,
            limit: 20,
        },
        onCompleted: data => {
            const { collection } = data.userList;
            setFollowings(collection);
            fetchingMore.current = false;
        },
    }); */
  //= ========= GraphQl query Section========
  //= ========= Use Effect Section========
  const fetchMoreFollowings = useCallback(() => {
    if (fetchingMore.current) {
      return;
    }
    fetchingMore.current = true;
    setFollowings(prev => _.concat(prev, generateFakeData()));
    fetchingMore.current = false;
  }, []);
  //= ========= Flat List Action Section========
  const onEndReachedCalledDuringMomentum = useRef(true);

  const keyExtractor = useCallback(item => item.id, []);
  const onEndReached = useCallback(
    ({ distanceFromEnd }) => {
      if (!onEndReachedCalledDuringMomentum.current) {
        fetchMoreFollowings();
        onEndReachedCalledDuringMomentum.current = true;
      }
    },
    [fetchMoreFollowings],
  );
  const onMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentum.current = false;
  };

  const onToggleSelectSeller = useCallback((id, isSelected) => {
    if (!isSelected) {
      setSelectedSellerIds(prev => _.concat(prev, id));
    } else {
      setSelectedSellerIds(prev => _.filter(prev, sellerId => sellerId !== id));
    }
  }, []);
  const onCallSubscribe = useCallback(
    (id, name) => {
      Toast.show(`${t('follow seller:No longer follow')} \n ${name}`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.CENTER,
        backgroundColor: Colors.toastColor,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    },
    [t],
  );
  const onCallSubscribeMulti = useCallback(() => {
    Toast.show(
      `${t('follow seller:No longer follow')} ${selectedSellerIds.length} ${t('common:Users')}`,
      {
        duration: Toast.durations.SHORT,
        position: Toast.positions.CENTER,
        backgroundColor: Colors.toastColor,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      },
    );
    setSelectedSellerIds([]);
    setApplyMore(false);
  }, [selectedSellerIds.length, t]);
  const onSubscribe = useCallback(
    id => {
      const focusUser = _.find(followings, item => item?.id === id);
      Alert.alert(t('follow seller:Confirm not to follow'), focusUser?.name, [
        {
          text: t('common:cancel'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: t('common:confirm'), onPress: () => onCallSubscribe(id, focusUser?.name) },
      ]);
    },
    [followings, onCallSubscribe, t],
  );
  const renderSellerItem = useCallback(
    ({ item }) => {
      const isSelected = _.filter(selectedSellerIds, id => id === item?.id).length > 0;

      return (
        <FollowSellerItem
          SellerPreview={item}
          isSelected={isSelected}
          onToggleSelect={onToggleSelectSeller}
          onRemove={onSubscribe}
          applyMore={applyMore}
          isFollowing={true}
        />
      );
    },
    [applyMore, onSubscribe, onToggleSelectSeller, selectedSellerIds],
  );
  const renderFooter = useCallback(() => {
    if (!fetchingMore.current) {
      return null;
    }
    return (
      <View style={styles.listFooter}>
        <ActivityIndicator animating size="large" color={Colors.loaderColor} />
      </View>
    );
  }, [fetchingMore]);
  return (
    <>
      <Content
        isList
        padder
        contentContainerStyle={styles.contentContainerStyle}
        style={styles.contentView}
        data={followings}
        renderItem={renderSellerItem}
        extraData={selectedSellerIds}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        // onEndReached={onEndReached}
        // onEndReachedThreshold={0.5}
        // initialNumToRender={4}
        // onMomentumScrollBegin={onMomentumScrollBegin}
        // ListFooterComponent={renderFooter}
        // refreshing={networkStatus === NetworkStatus.refetch}
        // onRefresh={refetchStreams}
        // Performance settings
        removeClippedSubviews={true} // Unmount components when outside of window
        maxToRenderPerBatch={1} // Reduce number in each render batch
        updateCellsBatchingPeriod={100} // Increase time between renders
        windowSize={7} // Reduce the window size
      />
      {applyMore && selectedSellerIds.length > 0 ? (
        <UnScribeButton onPress={onCallSubscribeMulti}>
          <UnScribeButtonText>
            {t('common:unsubscribe')}({selectedSellerIds.length})
          </UnScribeButtonText>
        </UnScribeButton>
      ) : null}
    </>
  );
});

export default React.memo(FollowingSellers);
FollowingSellers.propTypes = {
  searchQuery: PropTypes.string,
};
FollowingSellers.defaultProps = {
  searchQuery: '',
};
const styles = StyleSheet.create({
  contentContainerStyle: {},
  contentView: {
    width: '100%',
    backgroundColor: Colors.white,
  },
  listFooter: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#FFFFFF',
    height: 30,
  },
});
const UnScribeButton = styled.TouchableOpacity`
  background-color: ${Colors.grey6};
  height: ${hp(48)}px;
  justify-content: center;
  width: 100%;
`;
const UnScribeButtonText = styled.Text`
  align-self: center;
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
  text-align: center;
`;
