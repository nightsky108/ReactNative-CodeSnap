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
import { RowBox } from '@src/common/StyledComponents';
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

const ProductInfo = ({ productInfo }) => {
  //= ======== State Section========
  const { t, i18n } = useTranslation();
  const { price, oldPrice, title } = productInfo;
  return (
    <>
      <PriceText>{price}</PriceText>
      <RowBox>
        <PriceTitleText>{t('common:price')}</PriceTitleText>
        <OldPriceText>{oldPrice}</OldPriceText>
      </RowBox>

      <DescriptionText>{title}</DescriptionText>
    </>
  );
};
ProductInfo.propTypes = {
  productInfo: PropTypes.shape({
    oldPrice: PropTypes.string,
    price: PropTypes.string,
    title: PropTypes.string,
  }),
};
ProductInfo.defaultProps = {
  productInfo: {
    oldPrice: '0',
    price: '0',
    title: '',
  },
};
// 冯琳
export default React.memo(ProductInfo);

const styles = StyleSheet.create({});

const PriceText = styled.Text`
  color: ${Colors.priceRed};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(20)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(26.4)}px;
  text-align: left;
`;
const PriceTitleText = styled.Text`
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(11)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(19.41)}px;
  text-align: left;
`;

const OldPriceText = styled(PriceTitleText)`
  margin-left: 4px;
  text-decoration-line: line-through; ;
`;
const DescriptionText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(14)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(24.71)}px;
  text-align: left;
`;
