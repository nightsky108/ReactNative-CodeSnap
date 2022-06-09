import * as React from 'react';
import { Text, StyleSheet, View, ViewStyle } from 'react-native';
import PropTypes from 'prop-types';

const StrokeText = ({ text, textStyle }) => {
  return (
    <View>
      <Text style={[textStyle]}>{text}</Text>
      <Text style={[textStyle, styles.abs, { textShadowOffset: { width: -2, height: -2 } }]}>
        {text}
      </Text>
      <Text style={[textStyle, styles.abs, { textShadowOffset: { width: -2, height: 2 } }]}>
        {text}
      </Text>
      <Text style={[textStyle, styles.abs, { textShadowOffset: { width: 2, height: -2 } }]}>
        {text}
      </Text>
    </View>
  );
};
StrokeText.propTypes = {
  text: PropTypes.string,
  textStyle: ViewStyle,
};
StrokeText.defaultProps = {
  text: '',
  textStyle: null,
};
export default StrokeText;
const styles = StyleSheet.create({
  paragraph: {
    fontSize: 50,
    color: '#FFF',
    textShadowColor: 'black',
    textShadowRadius: 1,
    textShadowOffset: {
      width: 2,
      height: 2,
    },
  },
  abs: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
