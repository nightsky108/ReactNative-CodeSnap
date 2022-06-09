import React, { useState } from 'react';
import PropTypes, { number, string } from 'prop-types';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';

import { View, StyleSheet, ViewPropTypes, ActivityIndicator } from 'react-native';

import { Colors, Metrics, Fonts } from '@theme';
import Images from '@assets/images';
import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';

const EmptyPhotoSize = getAdjustSize({ width: 37, height: 30 });

// import {perfectSize} from '@utils/responsive';
function propsAreEqual(prevProps, nextProps) {
  return prevProps.uri === nextProps.uri;
}
const PhotoView = ({ uri, photoSize, emptyPhotoSize, containerStyle }) => {
  const Photo = styled(FastImage)`
    align-items: center;
    height: ${photoSize.height}px;
    justify-content: center;
    width: ${photoSize.width}px;
  `;
  const EmptyPhotoView = styled(View)`
    align-items: center;
    background-color: ${Colors.grey5};
    height: ${photoSize.height}px;
    justify-content: center;
    width: ${photoSize.width}px;
  `;
  const EmptyPhoto = styled.Image`
    align-items: center;
    height: ${emptyPhotoSize.height}px;
    justify-content: center;
    width: ${emptyPhotoSize.width}px;
  `;
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <View style={{ overflow: 'hidden', ...containerStyle }}>
      {uri ? (
        <>
          {!isLoaded ? (
            <EmptyPhotoView>
              <EmptyPhoto source={Images.emptyImg} />
            </EmptyPhotoView>
          ) : null}
          <Photo
            source={{ uri }}
            style={[isLoaded ? {} : { width: 0, height: 0 }]}
            onLoadEnd={() => {
              setIsLoaded(true);
            }}
          />
        </>
      ) : (
        <EmptyPhotoView>
          <EmptyPhoto source={Images.emptyImg} />
        </EmptyPhotoView>
      )}
    </View>
  );
};
PhotoView.propTypes = {
  uri: PropTypes.string,
  photoSize: PropTypes.shape({
    width: number || string,
    height: number || string,
  }),
  emptyPhotoSize: PropTypes.shape({
    width: number || string,
    height: number || string,
  }),
  containerStyle: ViewPropTypes.style,
};
PhotoView.defaultProps = {
  uri: null,
  photoSize: {
    width: 80,
    height: 80,
  },
  emptyPhotoSize: EmptyPhotoSize,
  containerStyle: {},
};

export default React.memo(PhotoView, propsAreEqual);
const styles = StyleSheet.create({});
