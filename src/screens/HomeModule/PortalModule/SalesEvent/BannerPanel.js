import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, StatusBar, Platform, View, ImageBackground } from 'react-native';
import { Icon, Text, Image } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Text as SvgText } from 'react-native-svg';
// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Box, HStack, Center } from 'native-base';
import { LinearTextGradient } from 'react-native-text-gradient';

//= ==custom components & containers  =======
import {
  FocusAwareStatusBar,
  NormalHeaderContainer,
  JitengPressable,
  StrokeText,
} from '@components';

import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { Colors, Fonts } from '@theme';
import Images from '@assets/images';

import { SearchBarContainer } from '@src/common/StyledComponents';

const BannerImageSize = getAdjustSize({ width: 375, height: 186 });

const CardItemContainer = styled(ImageBackground)`
    align-items: center;
    height: ${parseInt(BannerImageSize.height, 10)}px;
    justify-content: flex-end;
    padding-bottom:17px
    width: ${parseInt(BannerImageSize.width, 10)}px;
`;
const TitleView = styled.View`
  background-color: ${Colors.red3};
  border-radius: 20px;
  box-shadow: 0px 3px 2px rgba(0, 0, 0, 0.25);
  margin-bottom: 5px;
  padding: 5px 20px 5px 20px;
`;
const EventTitleText = styled(Text)`
  color: ${Colors.white};
  elevation: 5;
  font-family: 'Microsoft YaHei';
  font-size: 17px;
  font-weight: 700;
  line-height: 22px;
`;
const EventContentTitleText = styled(Text)`
  color: ${Colors.yellow3};
  elevation: 5;
  font-family: 'Microsoft YaHei';
  font-size: 17px;
  font-weight: 700;
  line-height: 22px;
`;
const SubTitleView = styled.View`
  background-color: ${Colors.blue7};
  border-radius: 20px;
  box-shadow: 0px 3px 2px rgba(0, 0, 0, 0.25);
  padding: 5px 30px 5px 30px;
`;
const SubTitleText = styled(Text)`
  color: ${Colors.white};
  elevation: 5;
  font-family: 'Microsoft YaHei';
  font-size: 21px;
  font-weight: 700;
  line-height: 22px;
  margin-top: 10px;
  text-shadow: 2px 2px 4px rgb(34, 73, 176);
`;
const Divider = styled.View`
  background-color: ${Colors.white};
  height: 2px;
  width: ${parseInt(wp(150), 10)}px;
`;
const CardGradient = styled(LinearGradient).attrs({
  colors: [Colors.white, Colors.grey16],
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 },
})``;
const TextGradient = styled(LinearTextGradient).attrs({
  colors: [Colors.white, Colors.grey16],
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 },
})``;
const BannerPanel = ({ banner }) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  //= ======== State Section========
  return (
    <CardItemContainer source={{ uri: banner?.thumbnail?.url }}>
      <TitleView>
        <EventTitleText>
          全场最低<EventContentTitleText>七五折</EventContentTitleText>
        </EventTitleText>
      </TitleView>

      <SubTitleView>
        <EventTitleText>
          优惠期：<EventContentTitleText> 25/7 ~ 15/8</EventContentTitleText>
        </EventTitleText>
      </SubTitleView>
    </CardItemContainer>
  );
};
BannerPanel.propTypes = {
  banner: PropTypes.shape({}),
};
BannerPanel.defaultProps = {
  banner: {},
};
export default React.memo(BannerPanel);

const styles = StyleSheet.create({});
