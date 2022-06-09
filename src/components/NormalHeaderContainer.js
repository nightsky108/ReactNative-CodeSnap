import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, StatusBar, Platform, ViewPropTypes } from 'react-native';
import { Colors, Fonts } from '@theme';
import { Header } from 'react-native-elements';
import { wp, hp } from '@src/common/responsive';
import { HorizontalGradient } from '@src/common/StyledComponents';
import LinearGradient from 'react-native-linear-gradient';

import FocusAwareStatusBar from './FocusAwareStatusBar';

const NormalHeaderContainer = ({
  isStatusBarHidden,
  applyGradient,
  containerStyle,
  statusBarColor,
  light,
  ...props
}) => {
  const headerContainerStyle = [
    Platform.select({ android: Platform.Version <= 20 ? { paddingTop: 0, height: 56 } : {} }),
    {
      marginTop: isStatusBarHidden ? 0 : (StatusBar.currentHeight || 0) * -1,
      backgroundColor: Colors.backgroundColor,
    },
    containerStyle,
  ];

  //= ======== State Section========
  return (
    <>
      <FocusAwareStatusBar translucent hidden={isStatusBarHidden} />
      {applyGradient ? (
        <Header
          statusBarProps={{
            barStyle: light ? 'light-content' : 'dark-content',
            translucent: true,
            backgroundColor: statusBarColor,
          }}
          containerStyle={headerContainerStyle}
          ViewComponent={LinearGradient}
          linearGradientProps={{
            colors: [Colors.headerRed1, Colors.headerRed2],
            start: { x: 0, y: 1 },
            end: { x: 1, y: 1 },
          }}
          {...props}
        />
      ) : (
        <Header
          statusBarProps={{
            barStyle: light ? 'light-content' : 'dark-content',
            translucent: true,
            backgroundColor: statusBarColor,
          }}
          containerStyle={headerContainerStyle}
          {...props}
        />
      )}
    </>
  );
};
NormalHeaderContainer.propTypes = {
  containerStyle: ViewPropTypes.style,
  isStatusBarHidden: PropTypes.bool,
  applyGradient: PropTypes.bool,
  statusBarColor: PropTypes.string,
  light: PropTypes.bool,
};
NormalHeaderContainer.defaultProps = {
  containerStyle: {},
  isStatusBarHidden: false,
  applyGradient: false,
  statusBarColor: 'transparent',
  light: true,
};
export default React.memo(NormalHeaderContainer);
