import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { Colors, Metrics, Fonts } from '@theme';
import { getAdjustSize } from '@src/common/responsive';
import { TopBannerImgStyle } from '@common/GlobalStyles';
import { logger } from 'react-native-logs';
import FastImage from 'react-native-fast-image';
import { Image } from 'react-native-elements';

const log = logger.createLogger();
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: Colors.grey5,
    ...TopBannerImgStyle,
  },
});
const TopBannerImage = ({ bannerUrl, containerStyle }) => {
  /*  return (
        <Image containerStyle={[styles.container, containerStyle]} source={{ uri: bannerUrl }} />
    ); */
  return (
    <FastImage
      style={[styles.container, containerStyle]}
      source={{ uri: bannerUrl, priority: FastImage.priority.high }}
      resizeMode={FastImage.resizeMode.contain}
    />
  );
};

TopBannerImage.propTypes = {
  bannerUrl: PropTypes.string,
  containerStyle: PropTypes.objectOf(PropTypes.object),
};
TopBannerImage.defaultProps = {
  bannerUrl: null,
  containerStyle: {},
};
export default React.memo(TopBannerImage);
