import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, StatusBar, Platform, View, ImageBackground } from 'react-native';
import { Icon, Text, Image } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Box, HStack, Center } from 'native-base';
import { LinearTextGradient } from 'react-native-text-gradient';

//= ==custom components & containers  =======
import { FocusAwareStatusBar, NormalHeaderContainer, JitengPressable } from '@components';

import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { Colors, Fonts } from '@theme';
import Images from '@assets/images';

import { SearchBarContainer } from '@src/common/StyledComponents';

const BannerImageSize = getAdjustSize({ width: 375, height: 186 });

const CardItemContainer = styled(ImageBackground)`
  align-items: center;
  height: ${parseInt(BannerImageSize.height, 10)}px;
  justify-content: center;
  width: ${parseInt(BannerImageSize.width, 10)}px;
`;

const TitleText = styled(Text)`
  color: ${Colors.white};
  elevation: 5;
  font-family: 'Microsoft YaHei';
  font-size: 41px;
  font-weight: bold;
  line-height: 54px;
  text-shadow: 0px 4px 3px rgba(9, 113, 146, 0.8);
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
      <TextGradient>
        <TitleText numberOfLines={1}>{t('home:fashion:Fashion life')}</TitleText>
      </TextGradient>
      <CardGradient>
        <Divider />
      </CardGradient>

      <SubTitleText numberOfLines={1}>{t('home:fashion:More good stuff')}</SubTitleText>

      <SubTitleText numberOfLines={1}>{t('home:fashion:Selected high-quality goods')}</SubTitleText>
    </CardItemContainer>
  );
};
BannerPanel.propTypes = {
  banner: PropTypes.objectOf(PropTypes.object),
};
BannerPanel.defaultProps = {
  banner: {},
};
export default React.memo(BannerPanel);

const styles = StyleSheet.create({});
