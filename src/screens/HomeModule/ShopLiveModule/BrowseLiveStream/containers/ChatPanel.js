import React, { useState, useEffect, useCallback, useContext, useMemo, useRef } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Keyboard,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import { useSubscription, useMutation, useApolloClient } from '@apollo/client';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { Box, HStack, Center } from 'native-base';

import { Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-community/masked-view';
//= ==third party plugins=======
import humanFormat from 'human-format';
import ChatContext from '@contexts/ChatContext';
import {
  GiftedChat,
  InputToolbar,
  Actions,
  Avatar,
  AvatarProps,
  Composer,
  Send,
  MessageText,
  Message,
  Bubble,
} from 'react-native-gifted-chat';
//= ==custom components & containers  =======

import useIsMountedRef from '@common/usehook';
//= ========hook data===================
import { useProfile } from '@data/useUser';
import { useMessages } from '@data/useChat';
//= ==========apis=======================
//= ======selectors==========================
//= ======reducer actions====================
//= ======Query ====================
import { MESSAGE_ADDED, ADD_MESSAGE } from '@modules/message/graphql';
import { FETCH_ASSET_BY_ID } from '@modules/asset/graphql';

//= =============utils==================================
import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import * as constants from '@utils/constant';

//= =============styles==================================
import { Colors, Metrics, Fonts } from '@theme';
import * as globals from '@utils/global';

//= =============images & constants ===============================
const dimensions = {
  // get dimensions of the device to use in view styles
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
//= ============import end ====================

export const renderAvatar = props => (
  <Avatar
    {...props}
    imageStyle={{ left: { width: 18, height: 18, borderRadius: 9 } }}
    textStyle={{
      color: Colors.white,
      fontFamily: 'Microsoft YaHei',
      fontSize: adjustFontSize(10),
      lineHeight: adjustFontSize(13),
    }}
    containerStyle={{
      left: {
        marginRight: 4,
      },
    }}
  />
);
export const renderInputToolbar = props => {
  return (
    <InputToolbar
      {...props}
      containerStyle={styles.inputContainer}
      primaryStyle={{ alignItems: 'center' }}
    />
  );
};
export const renderEmptyInputToolbar = props => (
  <InputToolbar
    {...props}
    containerStyle={styles.inputEmptyContainer}
    primaryStyle={{ alignItems: 'center' }}
  />
);
export const renderMessageText = props => (
  <MessageText
    {...props}
    customTextStyle={{
      color: Colors.white,
      fontFamily: 'Microsoft YaHei',
      fontSize: adjustFontSize(10),
      lineHeight: adjustFontSize(13),
    }}
  />
);
export const renderMessage = props => (
  <Message
    {...props}
    position="left"
    containerStyle={{
      left: {},
    }}
  />
);
const renderBubble = props => (
  <Bubble
    {...props}
    wrapperStyle={{
      left: {
        backgroundColor: Colors.grey3,
        borderRadius: 3,
        opacity: 0.5,
      },
    }}
  />
);

export const renderComposer = props => (
  <Composer {...props} textInputStyle={styles.composerContainer} />
);

export const renderSend = props =>
  props?.text ? (
    <Send {...props} disabled={!props?.text} containerStyle={styles.senderContainer}>
      <Icon name="send" type="feather" color="#517fa4" />
    </Send>
  ) : (
    <Icon
      containerStyle={styles.senderContainer}
      name="arrow-undo-sharp"
      type="ionicon"
      color="#517fa4"
    />
  );

/**
 * @description convert fetched server message to gift message
 */
const decodeMSG = serverMSG => {
  const { id, type, data, author, createdAt } = serverMSG;
  const giftMSG = {
    _id: id,
    // createdAt,
    user: {
      _id: author.id,
      // name: `${author.name}test`,
      name: `test`,
    },
  };
  giftMSG.text = data;
  // type: constants.MessageTypeEnum.ASSET,

  if (author?.photo?.url) {
    giftMSG.user.avatar = author?.photo?.url;
  }

  return giftMSG;
};
const ChatPanel = () => {
  const chatPanelRef = useRef(null);
  const { onEndEditing, chatEditStatus, isJoined, activeMessageThreadId, msgThreadList } =
    useContext(ChatContext);
  const { user } = useProfile();
  const [msgs, setMsgs] = useState([]);
  const msgBuffer = useRef({});

  useEffect(() => {
    msgBuffer.current = {};
    _.map(msgThreadList, thread => {
      msgBuffer.current[thread?.id] = _.map(thread?.messages || [], msg => {
        return decodeMSG(msg);
      });
    });

    return () => {};
  }, [msgThreadList, isJoined]);

  useEffect(() => {
    if (activeMessageThreadId) {
      setMsgs(msgBuffer.current[activeMessageThreadId]);
    }

    return () => {};
  }, [activeMessageThreadId, msgBuffer]);

  const [callAddMessage] = useMutation(ADD_MESSAGE);

  const { data: subscribeMSG } = useSubscription(MESSAGE_ADDED, {
    variables: { threads: _.map(msgThreadList, item => item?.id) },
    skip: !isJoined,
    shouldResubscribe: true,
  });

  useEffect(() => {
    if (chatEditStatus) {
      chatPanelRef.current?.focusTextInput();
    } else {
      // Keyboard.dismiss();
    }
    return () => {};
  }, [chatEditStatus]);
  useEffect(() => {
    if (subscribeMSG) {
      const message = subscribeMSG?.messageAdded;
      _.concat([decodeMSG(message)], msgBuffer[message?.thread?.id]);

      if (message?.thread?.id === activeMessageThreadId) {
        setMsgs(prev => _.concat([decodeMSG(message)], prev));
      }
    }
    return () => {};
  }, [activeMessageThreadId, subscribeMSG]);

  const me = useMemo(() => {
    return {
      _id: user.id,
      name: `${user?.name}test`,
      avatar: user?.photo?.url,
    };
  }, [user]);

  const onSend = useCallback(
    async (newMSG = []) => {
      if (newMSG.length === 0) {
        onEndEditing();
        return;
      }
      callAddMessage({
        variables: {
          thread: activeMessageThreadId,
          type: constants.MessageTypeEnum.TEXT,
          data: newMSG[0].text,
          videoTime: 10,
        },
      });

      // setMessages((previousMessages) => GiftedChat.append(previousMessages, newMSG));
    },
    [activeMessageThreadId, callAddMessage, onEndEditing],
  );
  // console.log('render chat panel', new Date());

  return (
    <MaskedView
      style={styles.container}
      maskElement={
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'black', 'black', 'black']}
          style={{ flex: 1 }}
        />
      }>
      <GiftedChat
        ref={chatPanelRef}
        messages={msgs}
        onSend={onSend}
        user={me}
        alignTop
        alwaysShowSend
        scrollToBottom
        renderUsernameOnMessage={false}
        showUserAvatar
        showAvatarForEveryMessage={true}
        renderAvatarOnTop={false}
        renderMessageText={renderMessageText}
        renderMessage={renderMessage}
        renderBubble={renderBubble}
        renderAvatar={renderAvatar}
        minInputToolbarHeight={60}
        multiline={false}
        textInputProps={{
          returnKeyType: 'send',
          blurOnSubmit: false,
          onSubmitEditing: event => {
            const text = event.nativeEvent.text.trim();
            if (text) {
              chatPanelRef.current?.onSend([{ text }], true);
            }
          },
        }}
        listViewProps={{
          showsVerticalScrollIndicator: false,
        }}
        messagesContainerStyle={{
          width: '80%',
        }}
        // condition render features
        renderInputToolbar={chatEditStatus ? renderInputToolbar : renderEmptyInputToolbar}
        renderComposer={renderComposer}
        renderSend={renderSend}
        scrollToBottomComponent={() => {}}
        scrollToBottomStyle={{ backgroundColor: 'transparent' }}
      />
    </MaskedView>
  );
};

export default React.memo(ChatPanel);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  chatContainer: {
    flex: 1,
  },
  inputContainer: {
    backgroundColor: '#222B45',
  },
  inputEmptyContainer: {
    backgroundColor: '#222B45',
    opacity: 0.0,
  },
  actionContaciner: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 0,
  },
  composerContainer: {
    color: '#222B45',
    backgroundColor: '#EDF1F7',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#E4E9F2',
    paddingTop: 8.5,
    paddingHorizontal: 12,
    marginLeft: 0,
  },
  senderContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
});
