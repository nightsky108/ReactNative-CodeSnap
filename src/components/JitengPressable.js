import React from 'react';
import { Text, View, StyleSheet, Pressable, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { Colors, Metrics, Fonts } from '@theme';
// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';

const StyledView = styled.View.attrs()`
  background-color: ${({ pressed, onPressColor }) => (pressed ? 'white' : 'transparent')};
  opacity: ${({ pressed, onPressColor }) => (pressed ? 0.8 : 1)};
  justify-content: center;
  align-items: center;
  //border-radius: 5px;
  z-index: 999;
`;

const JitengPressable = ({ style, onPressColor, onPress, children }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: 'transparent',
          opacity: pressed ? 0.2 : 1,
        },
        style,
      ]}
      onPress={onPress}>
      {({ pressed }) => (
        <StyledView pressed={pressed} onPressColor={onPressColor}>
          {children}
        </StyledView>
      )}
    </Pressable>
  );
};

JitengPressable.propTypes = {
  onPressColor: PropTypes.string,
  style: ViewPropTypes.style,
  onPress: PropTypes.func,
};
JitengPressable.defaultProps = {
  // onPressColor: 'rgb(210, 230, 255)',
  onPressColor: 'transparent',
  style: null,
  onPress: () => {},
};
export default JitengPressable;
