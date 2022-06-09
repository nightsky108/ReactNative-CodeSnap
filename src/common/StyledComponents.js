import { Colors, Metrics, Fonts } from '@theme';
import { Input, Button, Icon, SearchBar } from 'react-native-elements';
import { wp, hp, adjustFontSize } from '@src/common/responsive';
import LinearGradient from 'react-native-linear-gradient';

import styled from 'styled-components/native';
import PhoneInput from 'react-native-phone-number-input';

const itemHeight = 40;
const buttonHeight = 50;

const hPaddingStyle = { paddingHorizontal: Metrics.medium };
const vPaddingStyle = { paddingVertical: Metrics.small };
const hMarginStyle = { marginHorizontal: Metrics.medium };
const vMarginStyle = { marginVertical: Metrics.small };

const fullWidthStyle = { width: '100%' };

export const Square = styled.TouchableOpacity`
  background-color: ${p => p.color || Colors.brandRed};
  height: ${p => p.size || 25}px;
  width: ${p => p.size || 25}px;
`;
export const TriangleContainer = styled.TouchableOpacity`
  overflow: hidden;
`;
export const Triangle = styled.TouchableOpacity.attrs({})`
  position: absolute;
  right: -${p => p.size / 2 || 12}px;
  top: -${p => p.size / 2 || 12}px;
  transform: rotate(45deg);
  justify-content: flex-end;
  padding-bottom: ${p => p.size / 10 || 2}px;
  background-color: ${p => p.color || Colors.brandRed};
  height: ${p => p.size || 25}px;
  width: ${p => p.size || 25}px;
`;
export const TriangleClose = styled(Icon).attrs({
  containerStyle: {
    transform: [{ rotate: '45deg' }],
  },
})``;
export const RootBox = styled.View.attrs(props => ({
  ...(props.hPadding && hPaddingStyle),
  ...(props.vPadding && vPaddingStyle),
  ...(props.hMargin && hMarginStyle),
  ...(props.vMargin && vMarginStyle),
  ...(props.full && fullWidthStyle),
  ...(props.aspectRatio && { aspectRatio: props.aspectRatio }),
  ...(props.height && { height: props.height }),
  ...(props.width && { width: props.width }),
  ...props.style,
}))`
  opacity: ${props => props.opacity || 1};
`;

export const ColumnBox = styled(RootBox)`
  flex-direction: column;
`;
export const CenterBox = styled(RootBox)`
  align-items: center;
  justify-content: center;
`;
export const ColumnCenter = styled(RootBox)`
  align-items: center;
  justify-content: center;
`;
export const ColumnHCenter = styled(RootBox)`
  align-items: center;
`;
export const ColumnVCenter = styled(RootBox)`
  justify-content: center;
`;
export const RowBox = styled(RootBox)`
  flex-direction: row;
`;
export const RowSpaceBetween = styled(RowBox)`
  align-items: center;
  justify-content: space-between;
`;
export const RowSpaceAround = styled(RowBox)`
  align-items: center;
  justify-content: space-around;
`;
export const RowSpaceEvenly = styled(RowBox)`
  align-items: center;
  justify-content: space-evenly;
`;
export const RowCenter = styled(RowBox)`
  align-items: center;
  justify-content: center;
`;
export const RowLeft = styled(RowBox)`
  align-items: center;
  justify-content: flex-start;
`;
export const RowRight = styled(RowBox)`
  align-items: center;
  justify-content: flex-end;
`;

export const RowTop = styled(RowBox)`
  align-items: flex-start;
  justify-content: center;
`;
export const RowBottom = styled(RowBox)`
  align-items: flex-end;
  justify-content: center;
`;

export const RowTopLeft = styled(RowTop)`
  justify-content: flex-start;
`;
export const RowTopRight = styled(RowTop)`
  justify-content: flex-end;
`;

export const RowBottomLeft = styled(RowBottom)`
  justify-content: flex-start;
`;
export const RowBottomRight = styled(RowBottom)`
  justify-content: flex-end;
`;

export const SpaceBox = styled(RootBox)`
  aspect-ratio: ${props => props.aspectRatio};
  width: 100%;
`;

export const FullHorizontalScrollView = styled.ScrollView.attrs(props => ({
  horizontal: true,
  contentContainerStyle: {
    width: '100%',
    // backgroundColor: Colors.backgroundColor,
    ...props.contentContainerStyle,
  },
}))``;

export const HiddenText = styled.Text`
  height: 0px;
  opacity: 0;
`;

export const InputElement = styled(Input).attrs(props => ({
  placeholderTextColor: Colors.placeholderColor,
  inputContainerStyle: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 5,
    borderColor: Colors.inputBorderColor,
    height: hp(itemHeight),
  },
  containerStyle: {
    paddingLeft: 0,
    paddingRight: 0,
    ...props.containerStyle,
  },

  errorStyle: {
    color: Colors.signUpStepRed,
  },
}))``;

export const TextAreaElement = styled(Input).attrs({
  inputContainerStyle: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 5,
  },
  containerStyle: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  errorStyle: {
    color: Colors.red,
  },
})``;
export const HorizontalGradient = styled(LinearGradient).attrs(props => ({
  colors: props.colors,
  start: { x: 0, y: 1 },
  end: { x: 1, y: 1 },
  style: {
    flex: 1,
    width: '100%',
    ...props.style,
  },
}))``;

export const ButtonElement = styled(Button).attrs(props => ({
  buttonStyle: {
    backgroundColor: props.dark ? Colors.lightDark : Colors.grey,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    ...props.buttonStyle,
  },
  titleStyle: {
    ...Fonts.button,
    color: props.dark ? Colors.grey : Colors.lightDark,
    ...props.titleStyle,
  },
}))``;
export const TextButtonElement = styled(Button).attrs(props => ({
  buttonStyle: {
    height: buttonHeight,
    backgroundColor: Colors.white,
    ...props.buttonStyle,
    borderRadius: 30,
  },
  titleStyle: {
    ...Fonts.button,
    color: Colors.grey3,
    ...props.titleStyle,
  },
}))``;
export const FullButtonElement = styled(Button).attrs(props => ({
  containerStyle: {
    width: '100%',
    ...props.containerStyle,
  },
  buttonStyle: {
    height: buttonHeight,
    backgroundColor: Colors.signUpStepRed,
    borderRadius: 4,
    ...props.buttonStyle,
  },
  titleStyle: {
    ...Fonts.button,
    color: Colors.white,
    ...props.titleStyle,
  },
}))``;

export const LinkButton = styled.Text`
  border-bottom-color: ${props => props.color || Colors.blue};
  border-bottom-width: 1px;
  color: ${props => props.color || Colors.blue};
  font-family: 'Cabin-Medium';
  font-size: 16px;
`;

export const PhoneInputElement = styled(PhoneInput).attrs({
  containerStyle: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.inputBorderColor,
    height: hp(itemHeight),
  },
  flagButtonStyle: {
    width: wp(60),
  },
  textContainerStyle: {
    paddingVertical: 0,
    paddingHorizontal: 4,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  textInputStyle: {
    ...Fonts.input,
    color: Colors.inputFontColor,
  },
  codeTextStyle: {
    ...Fonts.input,
    color: Colors.inputFontColor,
  },
  textInputProps: {
    placeholderTextColor: Colors.placeholderColor,
  },
})``;
export const GuideText = styled.Text`
  color: ${Colors.grey3};
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  line-height: 18px;
`;

export const SearchBarContainer = styled(SearchBar).attrs(props => ({
  containerStyle: {
    backgroundColor: Colors.white,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: 20,
    //  marginHorizontal: 10,
    height: hp(29),
    alignSelf: 'center',
    ...props.containerStyle,
  },
  leftIconContainerStyle: {
    height: hp(21),
    marginVertical: hp(0),
    color: props.leftIconColor ? props.leftIconColor : Colors.searchRed,
    ...props.leftIconContainerStyle,
  },
  searchIcon: {
    type: 'ionicon',
    name: 'search',
    color: props.leftIconColor ? props.leftIconColor : Colors.searchRed,
    size: 18,
  },

  inputContainerStyle: {
    backgroundColor: 'transparent',
    height: hp(29),
    ...props.inputContainerStyle,
  },
  inputStyle: {
    backgroundColor: 'transparent',
    height: hp(29),
    marginVertical: 0,
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(13),
    lineHeight: adjustFontSize(22),
    letterSpacing: adjustFontSize(-0.41),
    ...props.inputStyle,
  },
}))``;
