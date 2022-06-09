import { StyleSheet } from 'react-native';
import { Colors, Metrics, Fonts } from '@theme';
import { hp, wp } from '@src/common/responsive';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.grey6,
  },
  contentContainerStyle: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.grey6,
  },
  contentView: {
    width: '100%',
  },
});
