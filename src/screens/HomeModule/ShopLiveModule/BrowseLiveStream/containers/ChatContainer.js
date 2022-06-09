import React, { useState, useEffect, useCallback, useContext, useMemo, useRef } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Platform,
  ScrollView,
  Dimensions,
  Image,
  Text,
} from 'react-native';
import { useSubscription, useMutation } from '@apollo/client';
import { useSelector } from 'react-redux';
import _ from 'lodash';
//= ======context=================
import ChatContext from '@contexts/ChatContext';
import { Icon, Avatar } from 'react-native-elements';

//= ==third party plugins=======
import humanFormat from 'human-format';

//= =============styles==================================

import ChatPanel from './ChatPanel';

//= =============images & constants ===============================
const dimensions = {
  // get dimensions of the device to use in view styles
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
const CHAT_HEIGHT = dimensions.width * 0.6;

const ChatContainer = () => {
  const { onEndEditing } = useContext(ChatContext);
  return (
    <View onStartShouldSetResponder={onEndEditing} style={styles.chatContainer}>
      <ChatPanel />
    </View>
  );
};

export default React.memo(ChatContainer);
const styles = StyleSheet.create({
  chatContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: CHAT_HEIGHT,
  },
});
