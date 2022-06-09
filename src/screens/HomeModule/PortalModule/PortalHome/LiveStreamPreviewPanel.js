import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, FlatList, View, ImageBackground } from 'react-native';
import { Icon, Image, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import humanFormat from 'human-format';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { Box } from 'native-base';

//= ==custom components & containers  =======
import { JitengPressable } from '@components';

import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { Colors } from '@theme';

import { FullHorizontalScrollView } from '@src/common/StyledComponents';

const faker = require('faker');

faker.locale = 'zh_CN';

const ContainerSize = getAdjustSize({ width: 166, height: 269 });

/* const Title = styled(JitengPressable).attrs((props) => ({
    containerStyle: {
        flex: 1,
        alignItems: 'center',
    },
}))``;
const VideoTitle = styled(JitengPressable).attrs((props) => ({
    containerStyle: {
        borderLeftColor: Colors.grey4,
        borderLeftWidth: 1,
        flex: 1,
        alignItems: 'center',
    },
}))``; */
const Title = styled(View).attrs()`
  flex: 1;
  align-items: center;
`;
const VideoTitle = styled(Title).attrs()`
  border-left-width: 1px;
  border-left-color: ${Colors.grey4};
`;
const TitleButton = styled(Button).attrs({
  containerStyle: {
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: Colors.backgroundColor,
  },
})``;
const TitleText = styled.Text`
  color: ${props => (props.isActive ? Colors.live : Colors.black)};
  font-family: 'Microsoft YaHei';
  font-size: 18px;
  line-height: 24px;
`;
const LiveText = styled.Text`
  background-color: ${Colors.live};
  border-radius: 2px;
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 8px;
  line-height: 11px;
  padding-bottom: 2px;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 2px;
  position: absolute;
  right: -30px;
  top: 0px;
`;
/* const LiveStreamPreviewPanel = ({ liveStreams, videos }) => {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    //= ======== State Section========
    return <ImageBackground style={styles.cardContainer} source={Images.fashionImg} />;
}; */
const LiveStatusContainer = styled.View`
  background-color: transparent;
  flex-direction: row;
  height: ${parseInt(hp(27), 10)}px;
  width: ${parseInt(wp(122.34), 10)}px;
`;
const LiveStatusLeftContainer = styled.View`
  align-items: center;
  background-color: ${Colors.live};
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
  justify-content: center;
  width: ${parseInt(wp(41.17), 10)}px;
`;
const LiveStatusRightContainer = styled.View`
  //opacity: 0.3;
  align-items: center;
  background-color: #00000044;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
  flex-grow: 1;
  justify-content: center;
`;
const LiveStatusText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  line-height: 16px;
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
  line-height: 15px;
`;
const UserNameText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 15px;
  line-height: 20px;
`;
const UserImage = styled(Image).attrs({
  containerStyle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 5,
  },
})``;
const MoreButton = styled(Button).attrs({
  containerStyle: {
    marginVertical: 10,
  },
  buttonStyle: {
    width: '100%',
    height: hp(36),
    backgroundColor: Colors.more,
    borderRadius: 8,
  },
  titleStyle: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(15),
    lineHeight: adjustFontSize(20),
    color: Colors.white,
  },
})``;
const LiveStreamCard = React.memo(
  ({ liveStream }) => {
    const { t, i18n } = useTranslation();
    const { id, streamer, thumbnail, views, title, statistics, isLiveStream } = liveStream;
    return (
      <JitengPressable>
        <ImageBackground style={styles.cardContainer} source={{ uri: thumbnail?.url }}>
          <LiveStatusContainer>
            <LiveStatusLeftContainer>
              <LiveStatusText>
                {isLiveStream ? t('LiveShop:Live broadcast') : t('LiveShop:video')}
              </LiveStatusText>
            </LiveStatusLeftContainer>
            <LiveStatusRightContainer>
              <LiveStatusText>
                {humanFormat(statistics?.viewers || 0)} {t('LiveShop:Watch')}
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
  },
  (prevProps, nextProps) => {
    return prevProps.liveStream?.id === nextProps.liveStream?.id;
  },
);
const LiveStreamPreviewPanel = ({ finishedStreamList, onGoingStreamList }) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const keyExtractor = useCallback(item => item.id, []);
  //= ======== State Section========
  const [isLiveStream, setIsLiveStream] = useState(true);
  const streamData = useMemo(() => {
    if (isLiveStream) return onGoingStreamList;
    else return finishedStreamList;
  }, [finishedStreamList, isLiveStream, onGoingStreamList]);
  return (
    <Box width="100%">
      <Box flexDirection="row" width="100%" justifyContent="space-between" alignItems="center">
        <Title>
          <TitleButton
            onPress={() => {
              setIsLiveStream(true);
            }}
            title={
              <View>
                <TitleText isActive={isLiveStream}>{t('LiveShop:Live broadcast')}</TitleText>
                <LiveText>LIVE</LiveText>
              </View>
            }
          />
        </Title>
        <VideoTitle>
          <TitleButton
            onPress={() => {
              setIsLiveStream(false);
            }}
            title={<TitleText isActive={!isLiveStream}>{t('LiveShop:video')}</TitleText>}
          />
        </VideoTitle>
      </Box>
      <FullHorizontalScrollView>
        <FlatList
          data={streamData}
          renderItem={({ item }) => <LiveStreamCard liveStream={{ ...item, isLiveStream }} />}
          extraData={streamData.length}
          scrollEnabled={false}
          keyExtractor={keyExtractor}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          style={{ width: '100%' }}
          columnWrapperStyle={{ justifyContent: 'space-between', marginTop: hp(10) }}
        />
      </FullHorizontalScrollView>
      <MoreButton
        title={t('LiveShop:More videos')}
        icon={<Icon name="right" type="antdesign" color={Colors.white} />}
        iconRight
      />
    </Box>
  );
};
LiveStreamPreviewPanel.propTypes = {
  finishedStreamList: PropTypes.arrayOf(PropTypes.object),
  onGoingStreamList: PropTypes.arrayOf(PropTypes.object),
};
LiveStreamPreviewPanel.defaultProps = {
  finishedStreamList: [],
  onGoingStreamList: [],
};
export default React.memo(LiveStreamPreviewPanel);
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
