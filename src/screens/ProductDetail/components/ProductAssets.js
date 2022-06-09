import React, { useState, useEffect, useMemo, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, StatusBar, Platform, Dimensions, View, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Box } from 'native-base';
import { Icon, Text, Image } from 'react-native-elements';
import Video from 'react-native-video';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';

import LinearGradient from 'react-native-linear-gradient';
import PageControl from 'react-native-page-control';

import { TopBannerImgStyle } from '@common/GlobalStyles';
import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { FocusAwareStatusBar, TopBannerImage } from '@components';
import { HorizontalGradient } from '@src/common/StyledComponents';
import { Colors, Fonts } from '@theme';
import * as constants from '@utils/constant';

const IconSize = 25;
const { width: screenWidth } = Dimensions.get('window');
const CardSize = getAdjustSize({ width: 375, height: 376.66 });
function propsVideoAreEqual(prev, next) {
  return prev.video === next.video;
}
const VideoPlayer = React.memo(
  forwardRef(({ video }, ref) => {
    const [pauseVideo, changePauseVideo] = useState(false);
    const player = React.useRef(null);
    const onLoadStart = () => {
      player.current.seek(0);
    };
    const onLoad = () => {};
    const onBuffer = () => {};
    useImperativeHandle(ref, () => ({
      playThisVideo() {
        changePauseVideo(false);
      },
      pauseThisVideo() {
        changePauseVideo(true);
      },
      togglePlayVideo() {
        changePauseVideo(old => !old);
      },
    }));
    return (
      <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(0,0,0,0.8)']} style={{ ...CardSize }}>
        <Video
          source={{ uri: video }}
          ref={player}
          rate={1.0}
          volume={1.0}
          paused={pauseVideo}
          onBuffer={onBuffer}
          resizeMode="stretch"
          repeat={true}
          muted={false}
          playInBackground={false}
          playWhenInactive={true}
          ignoreSilentSwitch="ignore"
          progressUpdateInterval={250.0}
          onLoadStart={onLoadStart}
          onLoad={onLoad}
          // fullscreenOrientation="portrait"
          style={styles.playerCoverView}
        />
      </LinearGradient>
    );
  }),
  propsVideoAreEqual,
);

const ProductAssets = ({ assets, onPress }) => {
  //= ======== State Section========
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const onScroll = event => {
    setCurrentPage(event?.nativeEvent?.position || 0);
  };

  const isFocusingVideoItem = useMemo(() => {
    return assets[currentPage].type === constants.AssetTypeEnum.VIDEO;
  }, [assets, currentPage]);
  // console.log('isVideoItem', isFocusingVideoItem);

  return (
    <AssetContainer>
      <PagerView onPageSelected={onScroll} style={styles.pagerViewContainer}>
        {assets.map((asset, index) => {
          return (
            <AssetContainer key={asset?.id}>
              {asset.type === constants.AssetTypeEnum.VIDEO ? (
                <VideoPlayer video={asset.url} style={styles.assetContent} />
              ) : (
                <Image
                  source={{
                    uri: asset.url,
                  }}
                  style={styles.assetContent}
                />
              )}
            </AssetContainer>
          );
        })}
      </PagerView>

      <PageNoteContent>
        <PageNoteText>{`${currentPage + 1}/${assets.length}`}</PageNoteText>
      </PageNoteContent>
    </AssetContainer>
  );
};
ProductAssets.propTypes = {
  assets: PropTypes.arrayOf(PropTypes.object),
  onPress: PropTypes.func,
};
ProductAssets.defaultProps = {
  assets: [],
  onPress: () => {},
};
// 冯琳
export default React.memo(ProductAssets);

const styles = StyleSheet.create({
  pagerViewContainer: {
    ...CardSize,
  },
  dotViewContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  assetContent: {
    ...CardSize,
  },
  playerCoverView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
const AssetContainer = styled.View`
  height: ${CardSize.height}px;
  width: ${CardSize.width}px;
`;
const PageNoteContent = styled.View`
  background-color: rgb(0, 0, 0);
  border-radius: ${wp(10)}px;
  bottom: ${hp(10)}px;
  height: ${hp(19.12)}px;
  opacity: 0.5;
  position: absolute;
  right: ${wp(16)}px;
  width: ${wp(29.74)}px;
  z-index: 30;
`;
const PageNoteText = styled.Text`
  align-self: center;
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(11)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(19.41)}px;
  text-align: center;
`;
