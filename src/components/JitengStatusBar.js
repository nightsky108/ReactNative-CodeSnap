import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, StatusBar, Platform, View, ViewPropTypes } from 'react-native';
import { Colors, Fonts } from '@theme';
import { Header } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HorizontalGradient, CenterBox } from '@common/StyledComponents';
import { wp, hp } from '@common/responsive';
import { Box, HStack, Center } from 'native-base';

import FocusAwareStatusBar from './FocusAwareStatusBar';

const JitengStatusBar = ({ gradientColors, barStyle }) => {
  //= ======== State Section========
  const containerStyle = [
    Platform.select({
      android: Platform.Version <= 20 ? { paddingTop: 0, height: 56 } : {},
    }),
    { marginTop: (StatusBar.currentHeight || 0) * -1 },
  ];

  return (
    <>
      <FocusAwareStatusBar translucent={true} barStyle={barStyle} backgroundColor="transparent" />
      <HorizontalGradient style={containerStyle} colors={gradientColors}>
        <SafeAreaView />
      </HorizontalGradient>
    </>
  );
};
JitengStatusBar.propTypes = {
  gradientColors: PropTypes.arrayOf(PropTypes.string),
  barStyle: PropTypes.string,
};
JitengStatusBar.defaultProps = {
  gradientColors: [Colors.headerRed1, Colors.headerRed2],
  barStyle: 'light-content',
};
export default React.memo(JitengStatusBar);
