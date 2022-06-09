import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  StatusBar,
  Platform,
  FlatList,
  View,
  ImageBackground,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import { Icon, Text, Image, Button } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Box, HStack, Center } from 'native-base';

//= ==custom components & containers  =======
import { FocusAwareStatusBar, NormalHeaderContainer, JitengPressable } from '@components';

import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { Colors, Fonts } from '@theme';
import Images from '@assets/images';

import _ from 'lodash';
import { FullHorizontalScrollView, FullButtonElement } from '@src/common/StyledComponents';

const faker = require('faker');

faker.locale = 'zh_CN';

const ContainerSize = getAdjustSize({ width: 172, height: 269 });

const LiveStatusContainer = styled.View`
  background-color: #00000044;
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

const LiveStreamCard = ({ liveStream, onPressItem }) => {
  const { t, i18n } = useTranslation();
  const { id, streamer, thumbnail, views, title, isLiveStream } = liveStream;
  return (
    <JitengPressable onPress={onPressItem}>
      <ImageBackground style={styles.cardContainer} source={{ uri: thumbnail?.url }}>
        <LiveStatusContainer>
          <LiveStatusLeftContainer>
            <Icon
              type="octicon"
              name="primitive-dot"
              containerStyle={{ marginRight: 4 }}
              color={Colors.white}
              size={5}
            />
            <LiveStatusText>
              {isLiveStream ? t('LiveShop:Live broadcast') : t('LiveShop:video')}
            </LiveStatusText>
          </LiveStatusLeftContainer>
          <LiveStatusRightContainer>
            <LiveStatusText>
              {views} {t('LiveShop:Watch')}
            </LiveStatusText>
          </LiveStatusRightContainer>
        </LiveStatusContainer>
        <LiveDataContainer>
          <UserImage source={{ uri: streamer?.photo?.url }} />
          <LiveInfoContainer>
            <UserNameText>{streamer?.name}</UserNameText>
            <LiveInfoText numberOfLines={1}>{title}</LiveInfoText>
          </LiveInfoContainer>
        </LiveDataContainer>
      </ImageBackground>
    </JitengPressable>
  );
};
LiveStreamCard.propTypes = {
  liveStream: PropTypes.objectOf(PropTypes.any),
  onPressItem: PropTypes.func,
};
LiveStreamCard.defaultProps = {
  liveStream: null,
  onPressItem: () => {},
};
export default React.memo(LiveStreamCard, (prevProps, nextProps) => {
  return (
    prevProps.liveStream?.id === nextProps.liveStream?.id &&
    prevProps.liveStream?.views === nextProps.liveStream?.views
  );
});
const styles = StyleSheet.create({
  cardContainer: {
    ...ContainerSize,
    overflow: 'hidden',
    borderRadius: wp(9),
    paddingTop: hp(10),
    paddingBottom: hp(13),
    paddingHorizontal: wp(14),
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    // marginTop: hp(10),
  },
});
