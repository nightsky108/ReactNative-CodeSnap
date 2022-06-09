import { adjustFontSize } from '@common/responsive';

const Fonts = {
  title: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(18),
    lineHeight: adjustFontSize(24),
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: 'Cabin-Bold',
    fontSize: adjustFontSize(18),
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  label: {
    fontFamily: 'Cabin-Medium',
    fontSize: adjustFontSize(14),
    lineHeight: adjustFontSize(16),
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  subLabel: {
    fontFamily: 'Cabin-Medium',
    fontSize: adjustFontSize(12),
    lineHeight: adjustFontSize(16),
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  button: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(16),
    lineHeight: adjustFontSize(21),
    letterSpacing: adjustFontSize(-0.41),
    textAlign: 'center',
  },

  input: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(16),
    lineHeight: adjustFontSize(21),
    textAlign: 'center',
  },
};
export default Fonts;
