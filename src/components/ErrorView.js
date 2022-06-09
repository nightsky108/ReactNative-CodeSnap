import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Colors, Metrics, Fonts } from '@theme';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
});

const ErrorView = ({ error, containerStyle = {} }) => {
  const errTxtStyle = { color: Colors.errorColor, fontSize: 14 };
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={errTxtStyle} key={error}>
        {error}
      </Text>
    </View>
  );
};

ErrorView.propTypes = {
  error: PropTypes.string,
  containerStyle: PropTypes.objectOf(PropTypes.object),
};
ErrorView.defaultProps = {
  error: '',
  containerStyle: {},
};
export default ErrorView;
