import { StyleSheet, Platform, Dimensions } from 'react-native';
import { Colors, Metrics, Fonts } from '@theme';
import { hp, wp } from '@src/common/responsive';

export const styles = StyleSheet.create({
  contentContainerStyle: {
    // flexGrow: 1,
  },
  contentView: {
    width: '100%',
    backgroundColor: '#000000',
    height: Dimensions.get('window').height,
  },
  drawerContainer: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: Colors.white,
    flex: 1,
  },
  listFooter: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#FFFFFF',
    height: 30,
  },
  wrapperCustom: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginHorizontal: 5,
    // backgroundColor: 'blue',
  },
});
