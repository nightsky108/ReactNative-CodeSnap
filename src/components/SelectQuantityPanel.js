import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Box } from 'native-base';
import styled from 'styled-components/native';
import { wp, adjustFontSize } from '@src/common/responsive';
import { Colors } from '@theme';

const SelectQuantityPanel = ({ account = 1, limit = 1, minLimit, updateAccount = () => {} }) => {
  useEffect(() => {
    if (account > limit) {
      updateAccount(limit);
    }
    return () => {};
  }, [account, limit, updateAccount]);
  return (
    <Box flexDirection="row">
      <QuantityButton
        disabled={account === minLimit}
        onPress={() => {
          updateAccount(account - 1);
        }}>
        <QuantityButtonText disabled={account === 1}>-</QuantityButtonText>
      </QuantityButton>
      <QuantityValueContent>
        <QuantityValue>{account}</QuantityValue>
      </QuantityValueContent>
      <QuantityButton
        disabled={account >= limit}
        onPress={() => {
          updateAccount(account + 1);
        }}>
        <QuantityButtonText disabled={account >= limit}>+</QuantityButtonText>
      </QuantityButton>
    </Box>
  );
};
SelectQuantityPanel.propTypes = {
  account: PropTypes.number,
  limit: PropTypes.number,
  updateAccount: PropTypes.func,
  minLimit: PropTypes.number,
};
SelectQuantityPanel.defaultProps = {
  account: 1,
  limit: 1,
  updateAccount: () => {},
  minLimit: 1,
};
export default SelectQuantityPanel;
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
const QuantityPanelTitle = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(14)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(24.71)}px;
  text-align: left;
`;
const QuantityButton = styled.TouchableOpacity`
  align-items: center;
  align-self: center;
  background-color: ${props => (props.disabled ? Colors.grey6 : Colors.grey6)};
  height: ${wp(30)}px;
  justify-content: center;
  width: ${wp(30)}px;
`;
const QuantityButtonText = styled.Text`
  align-items: center;
  align-self: center;
  color: ${props => (props.disabled ? Colors.grey13 : Colors.black)};
  font-size: ${adjustFontSize(20)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(26.4)}px;
  text-align: center;
`;
/* const QuantityInput = styled.TextInput`
    align-items: center;
    background-color: ${props => (props.disabled ? Colors.grey6 : Colors.grey6)};
    height: ${wp(30)}px;
    margin-left: ${wp(2)}px;
    margin-right: ${wp(2)}px;
    width: ${wp(40)}px;
`; */
const QuantityValueContent = styled.View`
  align-self: center;
  background-color: ${props => (props.disabled ? Colors.grey6 : Colors.grey6)};
  height: ${wp(30)}px;
  justify-content: center;
  margin-left: ${wp(2)}px;
  margin-right: ${wp(2)}px;
  width: ${wp(40)}px;
`;
const QuantityValue = styled.Text`
  align-self: center;
  font-size: ${adjustFontSize(13)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(17.16)}px;
  text-align: center;
`;
