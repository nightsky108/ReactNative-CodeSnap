import { StyleSheet } from 'react-native';
import { Colors, Metrics, Fonts } from '@theme';
import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';

export const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
    alignItems: 'center',

    // paddingHorizontal: wp(12),
    // paddingVertical: hp(10),
  },
  contentView: {
    width: '100%',
    backgroundColor: Colors.grey5,
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 999,
  },
  catContentStyle: {
    width: '100%',
  },

  deleteButton: {
    marginTop: 10,
    backgroundColor: Colors.grey5,
    height: hp(36),
    borderRadius: 10,
  },
  deleteButtonTitle: {
    fontFamily: 'Microsoft YaHei',
    color: Colors.grey2,
    fontSize: adjustFontSize(13),
    lineHeight: adjustFontSize(17),
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: Colors.signUpStepRed,
    height: hp(36),
    borderRadius: 10,
  },
  saveButtonTitle: {
    fontFamily: 'Microsoft YaHei',
    color: Colors.white,
    fontSize: adjustFontSize(13),
    lineHeight: adjustFontSize(17),
  },

  saveDraftButton: {
    backgroundColor: Colors.createButton,
    height: hp(36),
    borderRadius: 10,
  },
  saveDraftButtonTitle: {
    fontFamily: 'Microsoft YaHei',
    color: Colors.confirm2,
    fontSize: adjustFontSize(13),
    lineHeight: adjustFontSize(17),
  },
});
