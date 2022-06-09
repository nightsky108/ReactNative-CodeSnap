import { StyleSheet } from 'react-native';
import { Colors, Metrics, Fonts } from '@theme';
import { hp, wp } from '@src/common/responsive';

export const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
  },
  contentView: {
    width: '100%',
    backgroundColor: Colors.backgroundColor,
    paddingHorizontal: wp(10),
    marginBottom: hp(10),
  },
});
