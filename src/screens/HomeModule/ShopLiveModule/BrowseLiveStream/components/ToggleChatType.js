import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import PropTypes from 'prop-types';
import Toggle from 'react-native-toggle-element';
import { Box, HStack, Center } from 'native-base';
// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import { Colors, Metrics, Fonts } from '@theme';
import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';

function propsAreEqual(prevProps, nextProps) {
  return prevProps.value === nextProps.value && prevProps.disabled === nextProps.disabled;
}
const ToggleChatType = ({ value, onToggleValue, containerStyle, disabled }) => {
  return (
    <View style={containerStyle}>
      <Toggle
        disabled={disabled}
        trackBar={{
          width: wp(74),
          height: hp(37),
          radius: hp(30),
          activeBackgroundColor: Colors.grey1,
          inActiveBackgroundColor: Colors.grey1,
        }}
        thumbButton={{
          width: hp(37),
          height: hp(37),
          radius: hp(18.5),
          inActiveBackgroundColor: Colors.white,
          activeBackgroundColor: Colors.white,
        }}
        value={value}
        onPress={onToggleValue}
        leftComponent={
          <View style={styles.elementContainer}>
            <Icon
              type="material"
              name="people"
              size={25}
              color={value ? '#e4e4e4' : Colors.signUpStepRed}
            />
            {value ? <ItemText>公開</ItemText> : <ActiveItemText>公開</ActiveItemText>}
          </View>
        }
        rightComponent={
          <View style={styles.elementContainer}>
            <Icon
              type="ionicon"
              name="person-sharp"
              size={20}
              color={!value ? '#e4e4e4' : Colors.signUpStepRed}
            />
            {!value ? <ItemText>私訊</ItemText> : <ActiveItemText>私訊</ActiveItemText>}
          </View>
        }
      />
    </View>
  );
};
ToggleChatType.propTypes = {
  value: PropTypes.bool, // true: private , false:public
  onToggleValue: PropTypes.func,
  containerStyle: PropTypes.shape({}),
  disabled: PropTypes.bool,
};
ToggleChatType.defaultProps = {
  value: false,
  onToggleValue: () => {},
  containerStyle: {},
  disabled: false,
};

export default React.memo(ToggleChatType);
const styles = StyleSheet.create({
  chatTxt: {
    textAlign: 'center',
    color: Colors.white,
  },
  elementContainer: {
    flexDirection: 'column',
  },
});
const ItemText = styled.Text`
  align-self: center;
  color: #e4e4e4;
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(7)}px;
  font-weight: 400;
  letter-spacing: ${adjustFontSize(-0.36)}px;
  line-height: ${adjustFontSize(11)}px; ;
`;
const ActiveItemText = styled(ItemText)`
  color: ${Colors.signUpStepRed};
`;
