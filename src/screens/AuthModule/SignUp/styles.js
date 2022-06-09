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
  formInputContainer: {
    width: '78%',
  },
  itemTitle: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(16),
    lineHeight: adjustFontSize(21),
    textAlign: 'left',
    marginBottom: 15,

    color: Colors.grey3,
  },
  itemInfo: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(16),
    lineHeight: adjustFontSize(21),
    textAlign: 'left',
    marginTop: 12,
    marginLeft: 10,
    color: Colors.grey1,
  },
  successTitle: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(19),
    lineHeight: adjustFontSize(25),
    textAlign: 'left',
    marginTop: 12,
    marginLeft: 10,
    color: Colors.signUpStepRed,
  },
});
