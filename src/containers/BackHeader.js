import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, StatusBar, Platform } from 'react-native';
import { Colors, Fonts } from '@theme';
import { Header } from 'react-native-elements';
import { wp, hp } from '@src/common/responsive';
import { FocusAwareStatusBar, NormalHeaderContainer } from '@components';

import { useNavigation, useRoute } from '@react-navigation/native';

const IconSize = 25;

const BackHeader = ({
  title = '',
  titleStyle,
  isStatusBarHidden,
  applyGradient,
  disabled,
  light,
  ...props
}) => {
  const navigation = useNavigation();

  //= ======== State Section========
  return (
    <NormalHeaderContainer
      isStatusBarHidden={isStatusBarHidden}
      applyGradient={applyGradient}
      light={light}
      leftComponent={
        disabled
          ? null
          : {
              icon: 'left',
              type: 'antdesign',
              color: Colors.darkGrey,
              size: IconSize,
              onPress: () => {
                navigation.goBack();
              },
            }
      }
      centerComponent={{
        text: title,
        style: [styles.titleStyle, titleStyle],
      }}
      {...props}
    />
  );
};
BackHeader.propTypes = {
  title: PropTypes.string,
  titleStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  isStatusBarHidden: PropTypes.bool,
  applyGradient: PropTypes.bool,
  disabled: PropTypes.bool,
  light: PropTypes.bool,
};
BackHeader.defaultProps = {
  title: '',
  titleStyle: {},
  isStatusBarHidden: false,
  applyGradient: false,
  disabled: false,
  light: true,
};
export default React.memo(BackHeader);

const styles = StyleSheet.create({
  titleStyle: {
    ...Fonts.title,
    color: Colors.black,
    fontWeight: '400',
  },
});
