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
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';

//= ==third party plugins=======
import { connect, useDispatch, useSelector } from 'react-redux';
import { GiftedChat } from 'react-native-gifted-chat';

import { DrawerActions, NavigationContainer } from '@react-navigation/native';
import { Icon, CheckBox, SocialIcon, Image, List, ListItem, Text } from 'react-native-elements';
import { v4 as uuidv4 } from 'uuid';

import Spinner from 'react-native-loading-spinner-overlay';

import _ from 'lodash';

//= ==custom components & containers  =======
import { Content, Container } from '@components';

//= ======selectors==========================

//= ======reducer actions====================

//= ==========apis=======================

//= =============utils==================================
import * as constants from '@utils/constant';

//= =============styles==================================
import { Colors, Metrics, Fonts } from '@theme';
import { zIndex } from 'styled-system';

import { styles } from './styles';
// import { StyleSheetFactory } from './styles';

// AssetType
//= =============images & constants ===============================
//= ============import end ====================
const Data = [{ id: '1234', name: 123 }];
const NewsFeedHome = ({ navigation, route }) => {
  //= ========Hook Init===========
  const dispatch = useDispatch();
  // const styles = StyleSheetFactory({ theme });
  //= ========= Props Section========
  //= ======== State Section========
  const [messages, setMessages] = useState([]);
  const keyExtractor = useCallback(item => item?.id, []);
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'Hello developer1',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 3,
        text: 'Hello developer2',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 4,
        text: 'Hello developer3',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 5,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 6,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 7,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 8,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
  }, []);
  const renderItem = useCallback(({ item }) => {
    console.log('item', item);
    return (
      <View
        style={{
          height: Dimensions.get('window').height - 80,
          width: Dimensions.get('window').width,
        }}>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 300,
            backgroundColor: 'green',
            zIndex: 999,
          }}>
          <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
              _id: 1,
            }}
            listViewProps={{
              contentContainerStyle: {
                // zIndex: 999,
              },
            }}
          />
        </View>
      </View>
    );
  }, []);
  //= ========= GraphQl query Section========
  //= ========= Use Effect Section========
  return (
    <Container>
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        style={styles.contentView}
        scrollEnabled={false}
        data={Data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        initialNumToRender={1}
        nestedScrollEnabled={true}
      />
    </Container>
  );
};

export default NewsFeedHome;
