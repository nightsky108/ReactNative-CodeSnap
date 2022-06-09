import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, StatusBar, Platform, View, ViewPropTypes } from 'react-native';
import { Colors, Fonts } from '@theme';
import { Header } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HorizontalGradient, CenterBox } from '@common/StyledComponents';
import { useNavigation } from '@react-navigation/native';

import { wp, hp } from '@common/responsive';
import { Box, HStack, Center } from 'native-base';

import FocusAwareStatusBar from './FocusAwareStatusBar';

const JitengHeaderContainer = ({
  isTop,
  isStatusBarHidden,
  statusBarBackgroundColor,
  gradientColors,
  children,
  barStyle,
}) => {
  const navigation = useNavigation();
  //= ======== State Section========
  const containerStyle = [
    Platform.select({
      android: Platform.Version <= 20 ? { paddingTop: 0, height: 56 } : {},
    }),
    { marginTop: isStatusBarHidden ? 0 : (StatusBar.currentHeight || 0) * -1 },
    { backgroundColor: Colors.backgroundColor },
  ];

  return isTop ? (
    <>
      <FocusAwareStatusBar
        translucent={true}
        barStyle={barStyle}
        backgroundColor={statusBarBackgroundColor}
        hidden={isStatusBarHidden}
      />
      <HorizontalGradient style={containerStyle} colors={gradientColors}>
        <SafeAreaView>
          <CenterBox full height={hp(44)}>
            {children}
          </CenterBox>
        </SafeAreaView>
      </HorizontalGradient>
    </>
  ) : (
    <HorizontalGradient colors={gradientColors}>
      <CenterBox full height={hp(44)}>
        {children}
      </CenterBox>
    </HorizontalGradient>
  );
};
JitengHeaderContainer.propTypes = {
  isStatusBarHidden: PropTypes.bool,
  statusBarBackgroundColor: PropTypes.string,
  isTop: PropTypes.bool,
  gradientColors: PropTypes.arrayOf(PropTypes.string),
  barStyle: PropTypes.string,
};
JitengHeaderContainer.defaultProps = {
  isStatusBarHidden: false,
  isTop: true,
  statusBarBackgroundColor: 'transparent',
  gradientColors: [Colors.headerRed1, Colors.headerRed2],
  barStyle: 'light-content',
};
export default React.memo(JitengHeaderContainer);
