import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import Video from 'react-native-video';

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

const VideoPlayer = forwardRef(({ videoUrls = [] }, ref) => {
  const player = useRef(null);
  const [index, setIndex] = useState(-1);
  const onLoadStart = () => {
    player.current.seek(0);
  };
  const onLoad = () => {};
  const onBuffer = () => {};
  const onEnd = useCallback(() => {
    if (index === videoUrls.length - 1) {
      setIndex(0);
    } else {
      setIndex(prev => prev + 1);
    }
  }, [index, videoUrls.length]);
  useImperativeHandle(ref, () => ({
    playThisVideo() {},
    pauseThisVideo() {},
    togglePlayVideo() {},
    toggleMuteVideo() {},
  }));
  useEffect(() => {
    if (videoUrls.length > 0) {
      setIndex(0);
    }
    return () => {};
  }, [videoUrls]);

  const videoUrl = useMemo(() => {
    if (videoUrls.length === 0) {
      return null;
    } else {
      return videoUrls[index];
    }
  }, [videoUrls, index]);
  // console.log('videoUrl', videoUrl);

  return (
    <View style={styles.streamFullView}>
      {videoUrl ? (
        <Video
          source={{ uri: videoUrl }}
          ref={player}
          rate={1.0}
          volume={1.0}
          onBuffer={onBuffer}
          resizeMode="contain"
          repeat={false}
          playInBackground={false}
          playWhenInactive={true}
          ignoreSilentSwitch="ignore"
          progressUpdateInterval={250.0}
          onLoadStart={onLoadStart}
          onLoad={onLoad}
          onEnd={onEnd}
          fullscreenOrientation="portrait"
          style={styles.playerCoverView}
        />
      ) : null}
    </View>
  );
});
VideoPlayer.propTypes = {
  videoUrls: PropTypes.arrayOf(PropTypes.string),
};
VideoPlayer.defaultProps = {
  videoUrls: [],
};
export default React.memo(VideoPlayer);

const styles = StyleSheet.create({
  playerCoverView: {
    width: dimensions.width,
    height: dimensions.height,
  },
  streamFullView: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#000000',
  },
});
