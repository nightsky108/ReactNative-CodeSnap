import { StyleSheet } from 'react-native';
import { Colors, Metrics, Fonts } from '@theme';
import { hp, wp } from '@src/common/responsive';

export const styles = StyleSheet.create({
  contentContainerStyle: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexShrink: 1,
  },
  contentView: {
    width: '100%',
    backgroundColor: Colors.white,
  },
  wrapperCustomTopCatPress: {
    width: '100%',
    height: hp(54),
    borderBottomColor: Colors.grey15,
    borderBottomWidth: 1,
    justifyContent: 'center', // Centered vertically
    alignItems: 'center', // Centered horizontally
    flex: 1,
  },
  drawerContainer: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: Colors.white,
    flex: 1,
  },
});
