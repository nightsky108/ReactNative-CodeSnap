import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { Icon } from 'react-native-elements';

import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  interpolate,
  withRepeat,
  withTiming,
  Extrapolate,
} from 'react-native-reanimated';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { Colors } from '@theme';
// import {perfectSize} from '@utils/responsive';
const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

const HEART_SIZE = 25;
const ANIMATION_END_Y = Math.ceil(deviceHeight);
const NEGATIVE_END_Y = ANIMATION_END_Y * -1;
const getRandomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};
const AnimatedHeart = forwardRef(({ style = {}, ...props }, ref) => {
  const play = useSharedValue(false);
  useImperativeHandle(ref, () => ({
    start() {
      if (!play.value) {
        play.value = true;
      }
    },
    stop() {
      play.value = false;
    },
  }));

  const progress = useDerivedValue(() => {
    return play.value
      ? withRepeat(withTiming(1, { duration: 1500 }), 2, false, finished => {
          if (finished) {
            play.value = false;
          }
        })
      : 0;
  });
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 0.01, 1], [0, 1, 0]);
    const translateY = interpolate(progress.value, [0, 1], [0, NEGATIVE_END_Y]);
    const translateX = interpolate(progress.value, [0, 0.5, 1], [0, HEART_SIZE / 2, HEART_SIZE]);
    const scale = interpolate(progress.value, [0, 1], [1, 0.5], Extrapolate.CLAMP);
    return {
      opacity,
      transform: [{ translateY }, { scale }, { translateX }],
    };
  });
  try {
    return (
      <Animated.View style={[styles.heartWrap, animatedStyle, style]}>
        <Icon name="heart" type="ionicon" color={Colors.white} size={HEART_SIZE} />
      </Animated.View>
    );
  } catch (error) {
    console.log('error', error?.message);
  }
});

AnimatedHeart.propTypes = {};
AnimatedHeart.defaultProps = {};

const HeartFloater = ({ children }, ref) => {
  const heartsItemRefs = useRef({});
  const [hearts, setHearts] = useState([]);
  useImperativeHandle(ref, () => ({
    callAnimation() {
      startAnimation();
    },
  }));
  useEffect(() => {
    init();
    return () => {};
  }, []);

  const startAnimation = () => {
    _.forEach(hearts, (val, index) => {
      const delayTime = Math.floor(getRandomNumber(200, 300)) + 300 * index;
      setTimeout(() => {
        heartsItemRefs.current[val.id]?.start();
      }, delayTime);
    });
  };
  const init = useCallback(() => {
    const heartMap = _.map(new Array(Math.floor(getRandomNumber(20, 30))), item => {
      return { id: uuidv4(), right: getRandomNumber(0, 20) };
    });
    setHearts(heartMap);
  }, []);

  try {
    return (
      <View style={styles.container}>
        {hearts.map(function (v, i) {
          return (
            <AnimatedHeart
              key={v.id}
              ref={ref => {
                heartsItemRefs.current[`${v.id}`] = ref;
              }}
              style={{ right: hearts[i].right }}
            />
          );
        })}
      </View>
    );
  } catch (error) {
    console.log('error', error?.message);
  }
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  heartWrap: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'transparent',
  },
});
export default React.memo(forwardRef(HeartFloater));
