import { StyleSheet } from 'react-native';
import { Colors, Metrics, Fonts } from '@theme';
import { hp, wp } from '@src/common/responsive';

export const styles = StyleSheet.create({
  contentContainerStyle: {
    // flex: 1,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentView: {
    width: '100%',
    backgroundColor: Colors.backgroundColor,
    paddingHorizontal: Metrics.small,
  },
});
