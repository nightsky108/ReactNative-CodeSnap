import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  StatusBar,
  Platform,
  FlatList,
  View,
  ImageBackground,
  TouchableHighlight,
  Dimensions,
  SafeAreaView,
  Animated,
  InteractionManager,
} from 'react-native';
import { Icon, Text, Image, Button } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  DrawerLayout,
  LongPressGestureHandler,
  ScrollView,
  State,
  TapGestureHandler,
  PanGestureHandler,
  LongPressGestureHandlerStateChangeEvent,
  TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetHandleProps } from '@gorhom/bottom-sheet';

import {
  useQuery,
  useMutation,
  useLazyQuery,
  useSubscription,
  useApolloClient,
  gql,
} from '@apollo/client';
// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Box, HStack, Center } from 'native-base';

//= ==custom components & containers  =======
import { Content, FocusAwareStatusBar, NormalHeaderContainer, JitengPressable } from '@components';

import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { Colors, Fonts } from '@theme';
import Images from '@assets/images';
import * as constants from '@utils/constant';
//= ========hook data===================
import { useProfile, useUserSettings } from '@data/useUser';
//= ======context=================
import ChatContext from '@contexts/ChatContext';
import { useIsMountedRef, useComponentSize } from '@common/usehook';
import moment from 'moment';

import _ from 'lodash';
import { FullHorizontalScrollView, FullButtonElement } from '@src/common/StyledComponents';
import {
  JOIN_LIVESTREAM,
  LEAVE_LIVESTREAM,
  UPDATE_LIVESTREAM_COUNT,
  JOIN_LIVESTREAM_FULL_ACTION,
  FETCH_LIVESTREAM_PREVIEWS,
  SUBSCRIBE_LIVESTREAM,
  LIKE_STREAM,
  LEAVE_LIVESTREAM_FULL_ACTION,
} from '@modules/liveStream/graphql';
import { LiveStreamFragment } from '@modules/liveStream/fragment';
import { MESSAGE_ADDED, ADD_MESSAGE } from '@modules/message/graphql';
import { useSettingContext } from '@contexts/SettingContext';

import { VideoPlayer } from '../components';
import BottomController from './BottomController';
import HeaderController from './HeaderController';
import ChatContainer from './ChatContainer';
import ChatPanel from './ChatPanel';
import ProductListPanel from './ProductListPanel';

const dimensions = {
  // get dimensions of the device to use in view styles
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
const faker = require('faker');

faker.locale = 'zh_CN';
const swipeLimit = dimensions.height - dimensions.width * 0.8;
const hashID = s => {
  const hashVal = Array.from(s).reduce(function (a, b) {
    // eslint-disable-next-line no-bitwise
    // eslint-disable-next-line no-param-reassign
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
  return Math.abs(hashVal);
};
const checkExistPrivateThread = ({ basepair, threadList }) => {
  return _.filter(threadList, item => {
    const { participants } = item;
    if (participants.length !== 2) {
      return false;
    }
    const pair = [participants[0].id, participants[1].id];
    return _.isEqual(basepair, pair);
  });
};
const TestVideoList = [
  'https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4',
  'https://download.samplelib.com/mp4/sample-5s.mp4',
  'https://download.samplelib.com/mp4/sample-10s.mp4',
];
const CHAT_HEIGHT = 250;
const DELAY_SECONDS = 500;

const LiveStreamContainer = React.forwardRef(({ liveStream }, ref) => {
  const {
    id,
    title,
    views,
    likes,
    streamer,
    thumbnail,
    channel,
    // privateMessageThreads,
    publicMessageThread,
    products,
  } = liveStream;
  const snapPoints = useMemo(() => [0.1, '60%'], []);

  const { userCurrencyISO, userLanguage } = useSettingContext();
  const { t, i18n } = useTranslation();
  const { user } = useProfile();
  const navigation = useNavigation();
  const isMountedRef = useIsMountedRef();
  const startMoment = useRef(moment());
  const [leaveStream] = useMutation(LEAVE_LIVESTREAM);
  const [joinStream] = useMutation(JOIN_LIVESTREAM);
  const [likeStream] = useMutation(LIKE_STREAM);
  const [leaveLiveStreamFullAction] = useMutation(LEAVE_LIVESTREAM_FULL_ACTION);
  const timer = useRef(null); // we can save timer in useRef and pass it to child
  const isFocus = useRef(false);
  const productsDrawer = useRef();
  const [isJoined, setIsJoined] = useState(false);
  // console.log('render LiveStreamContainer', new Date());
  /* 
    //pleas don't remove
    const msgThreadIds = useMemo(() => {
        if (!liveStream?.privateMessageThreads || !liveStream?.publicMessageThread) {
            return [];
        } else {
            const { privateMessageThreads, publicMessageThread } = liveStream;
            return _.concat(
                _.map(
                    _.filter(privateMessageThreads, item => {
                        return (
                            _.findIndex(item?.participants, person => person?.id === user?.id) !==
                            -1
                        );
                    }),
                    item => item?.id,
                ),
                publicMessageThread?.id,
            );
        }
    }, [liveStream, user?.id]); */

  const roomID = hashID(id);

  //= ======== State Section========
  const [initIsLive, setInitIsLive] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [chatEditStatus, setChatEditStatus] = useState(false);
  useImperativeHandle(ref, () => ({
    start() {
      InteractionManager.runAfterInteractions(() => {
        timer.current = setTimeout(() => {
          startBrowsing();
        }, DELAY_SECONDS);
      });
    },
    stop() {
      stopBrowsing();
      if (isMountedRef.current) {
        setIsJoined(false);
      }
    },
  }));
  useEffect(() => {
    return () => {
      stopBrowsing();
      if (isMountedRef.current) {
        setIsJoined(false);
      }
    };
  }, [isMountedRef, stopBrowsing]);

  const startBrowsing = useCallback(async () => {
    console.log('startBrowsing', id);
    isFocus.current = true;
    try {
      await joinStream({
        variables: { liveStreamId: id, currency: userCurrencyISO, language: userLanguage },
      });
      if (isMountedRef.current) {
        setIsJoined(true);
        startMoment.current = moment();
      }
    } catch (error) {
      console.log('joinStream error', error?.message);
    }
  }, [id, joinStream, userCurrencyISO, isMountedRef]);
  // console.log('liveStream', publicMessageThread);
  const stopBrowsing = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = null;
    if (isFocus.current) {
      console.log('leaveStream', id);
      isFocus.current = false;
      const streamDuration = moment().diff(startMoment.current, 'seconds');
      /* leaveStream({
                variables: { liveStreamId: id },
            }); */
      leaveLiveStreamFullAction({
        variables: {
          liveStreamId: id,
          realViewData: {
            id,
            playLength: parseInt(streamDuration, 10),
            view: 'view',
            tag: 'real',
          },
          realLikeData: {
            id,
            playLength: parseInt(streamDuration, 10),
            view: 'like',
            tag: 'real',
          },
        },
      });
    }
  }, [leaveLiveStreamFullAction, id]);
  useEffect(() => {
    const { status } = channel;
    setInitIsLive(
      status === constants.StreamChannelStatus.STREAMING ||
        status === constants.StreamChannelStatus.PENDING,
    );
    return () => {};
  }, []);
  const streamChannel = useMemo(() => {
    const recordedVideoList = _.map(channel?.record?.sources || [], item => item?.source);
    return { recordedVideoList };
  }, [channel]);
  const { recordedVideoList } = streamChannel;

  const msgThreadList = useMemo(() => {
    if (!liveStream?.privateMessageThreads || !liveStream?.publicMessageThread) {
      return [];
    } else {
      const { privateMessageThreads, publicMessageThread } = liveStream;
      return [privateMessageThreads[0], publicMessageThread];
    }
  }, [liveStream]);
  const activeMessageThreadId = useMemo(() => {
    if (!liveStream?.privateMessageThreads || !liveStream?.publicMessageThread) {
      return null;
    } else {
      const { privateMessageThreads, publicMessageThread } = liveStream;
      if (isPrivate) {
        return privateMessageThreads[0]?.id;
      } else {
        return publicMessageThread?.id;
      }
    }
  }, [isPrivate, liveStream]);
  const productsSum = useMemo(() => {
    if (!products) {
      return 0;
    } else {
      return products?.length || 0;
    }
  }, [products]);

  const { data } = useSubscription(SUBSCRIBE_LIVESTREAM, {
    variables: {
      liveStreamId: id,
    },
    skip: !isJoined,
  });

  const onNavigateProductDetail = id => {
    productsDrawer.current?.close();
    // navigation.navigate('ProductDetail', { productId: id });
    navigation.navigate('CheckoutStack', {
      screen: 'ProductDetail',
      params: {
        productId: id,
      },
    });
  };
  const onOpenProductsPanel = () => {
    productsDrawer.current?.expand();
  };
  const onToggleLike = () => {
    likeStream({ variables: { liveStreamId: id } });
  };
  const toggleChatType = () => {
    setIsPrivate(prev => !prev);
  };
  const onStartEditing = useCallback(() => {
    setChatEditStatus(true);
  }, []);

  const onEndEditing = useCallback(() => {
    setChatEditStatus(false);
  }, []);

  //
  return (
    <View style={styles.cardContainer}>
      {/* {isJoined ? <VideoPlayer videoUrls={TestVideoList} /> : null} */}
      <HeaderController
        streamer={streamer}
        views={views}
        title={title}
        hostId={roomID.toString()}
      />
      <ChatContext.Provider
        value={{
          chatEditStatus,
          onEndEditing,
          activeMessageThreadId,
          msgThreadList,
          isJoined,
        }}>
        <ChatContainer />
      </ChatContext.Provider>
      {!chatEditStatus ? (
        <BottomController
          onToggleChatType={toggleChatType}
          isPrivateChat={isPrivate}
          onStartEditing={onStartEditing}
          onOpenProductsPanel={onOpenProductsPanel}
          isJoined={isJoined}
          onToggleLike={onToggleLike}
          productsSum={productsSum}
        />
      ) : (
        <View />
      )}
      <BottomSheet
        ref={productsDrawer}
        snapPoints={snapPoints}
        index={0}
        backdropComponent={backdropProps => (
          <BottomSheetBackdrop {...backdropProps} enableTouchThrough={true} />
        )}
        backgroundComponent={({ style }) => (
          <View
            style={[
              {
                backgroundColor: 'white',
                borderRadius: 10,
              },
              { ...style },
            ]}
          />
        )}
        handleComponent={null}
        enableOverDrag={false}
        enableHandlePanningGesture={false}
        enableContentPanningGesture={false}
        style={{
          shadowColor: Colors.black,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.18,
          shadowRadius: 4,
          elevation: 5,
          zIndex: 50,
        }}>
        <ProductListPanel
          products={products}
          liveStreamId={id}
          onNavigateProductDetail={onNavigateProductDetail}
        />
      </BottomSheet>
    </View>
  );
});

LiveStreamContainer.propTypes = {
  liveStream: PropTypes.objectOf(PropTypes.any),
};
LiveStreamContainer.defaultProps = {
  liveStream: null,
};

export default LiveStreamContainer;

const styles = StyleSheet.create({
  cardContainer: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
  },
  drawerContainer: {
    // flex: 1,
    paddingTop: 10,
    opacity: 1,
    backgroundColor: '#00000000',
  },
});

const LiveStatusContainer = styled.View`
  background-color: #000000;
  border-radius: 10px;
  flex-direction: row;

  // height: ${parseInt(hp(27), 10)}px;
  //  width: ${parseInt(wp(122.34), 10)}px;
`;
const LiveStatusLeftContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${Colors.live};
  border-radius: 10px;
  justify-content: center;
  padding-left: 7px;
  padding-right: 7px;
  padding-top: 3px;
  padding-bottom: 3px;
  //  width: ${parseInt(wp(41.17), 10)}px;
`;
const LiveStatusRightContainer = styled.View`
  //opacity: 0.3;
  align-items: center;
  background-color: transparent;
  justify-content: center;
  padding-bottom: 3px;
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 3px;
`;
const LiveStatusText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 10px;
  line-height: 13px;
`;
const LiveInfoContainer = styled.View`
  flex-shrink: 1;
`;
const LiveDataContainer = styled.View`
  flex-direction: row;
  width: 100%;
`;
const LiveInfoText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 11px;
  font-weight: 400;
  line-height: 15px;
`;
const UserNameText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 13px;
  font-weight: 700;
  line-height: 18px;
`;
const UserImage = styled(Image).attrs({
  containerStyle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 5,
  },
})``;
