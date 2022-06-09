import React from 'react';
import { Colors } from '@theme';
import { SafeAreaView } from 'react-native-safe-area-context';

import PropTypes from 'prop-types';

const Container = ({ dark, children }) => {
  const containerStyle = {
    flex: 1,
  };
  return <SafeAreaView style={containerStyle}>{children}</SafeAreaView>;
};

Container.propTypes = {
  dark: PropTypes.bool,
};
Container.defaultProps = {
  dark: false,
};
export default Container;
