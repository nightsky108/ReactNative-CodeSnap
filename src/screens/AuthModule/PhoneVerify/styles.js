import { StyleSheet } from 'react-native';
import { Colors, Metrics, Fonts } from '@theme';
import { hp, wp, adjustFontSize } from '@src/common/responsive';

export const styles = StyleSheet.create({
  contentContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentView: {
    width: '100%',
    backgroundColor: Colors.white,
  },
  titleTxt: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(16),
    lineHeight: adjustFontSize(21),
    textAlign: 'center',
    color: Colors.grey2,
  },
  socialTxt: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(15),
    lineHeight: adjustFontSize(20),
    textAlign: 'center',
    color: 'red',
  },
  callVerifyCodeTxt: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(16),
    lineHeight: adjustFontSize(21),
    textAlign: 'center',
    color: Colors.signUpStepRed,
  },
});
