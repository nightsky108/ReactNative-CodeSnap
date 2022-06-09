import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ViewPropTypes } from 'react-native';
import { Text } from 'native-base';

const AppText = ({ children, ...props }) => {
  return (
    <Text fontFamily="Microsoft YaHei" {...props}>
      {children}
    </Text>
  );
};

AppText.propTypes = {
  children: PropTypes.node.isRequired,
};

AppText.defaultProps = {};

export default AppText;
