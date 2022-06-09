import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  StatusBar,
  Platform,
  Dimensions,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { Box, HStack } from 'native-base';
import { Icon, Text, ListItem, Button } from 'react-native-elements';
import Video from 'react-native-video';
import { useTranslation } from 'react-i18next';
import DashedLine from 'react-native-dashed-line';
import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';

import LinearGradient from 'react-native-linear-gradient';
import PageControl from 'react-native-page-control';
import StepIndicator from 'react-native-step-indicator';

import { TopBannerImgStyle } from '@common/GlobalStyles';
import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { FocusAwareStatusBar, TopBannerImage } from '@components';
import { RowBox, RowCenter } from '@src/common/StyledComponents';
import { Colors, Fonts } from '@theme';
import * as constants from '@utils/constant';
import Images from '@assets/images';
import { ScrollView } from 'react-native-gesture-handler';

const photo = 'https://picsum.photos/id/1/344/109';
const IconSize = 25;
const { width: screenWidth } = Dimensions.get('window');
const SelectedItemSize = getAdjustSize({ width: 23.75, height: 29.02 });

const RatePanel = ({ rateScore }) => {
  //= ======== State Section========
  const [currentPage, setCurrentPage] = useState(-1);
  const { t, i18n } = useTranslation();

  return (
    <>
      <Box width="100%" flexDirection="row" justifyContent="space-between">
        <HStack alignItems="center">
          <RateImg source={{ uri: photo }} />
          <TitleText>{t('productDetail:Domi Global Beauty')}</TitleText>
        </HStack>
        <HStack alignItems="center">
          <MoreProductButton>
            <MoreProductButtonText>{t('productDetail:all products')}</MoreProductButtonText>
          </MoreProductButton>
          <GoShopButton>
            <GoShopButtonText>{t('productDetail:enter a shop')}</GoShopButtonText>
          </GoShopButton>
        </HStack>
      </Box>
      <Box flexDirection="row" marginY={`${hp(10)}px`}>
        <ScoreTitleText>{t('productDetail:Merchant Rating')}</ScoreTitleText>
        <RateText>{rateScore}</RateText>
      </Box>
    </>
  );
};
RatePanel.propTypes = {
  rateScore: PropTypes.number,
};
RatePanel.defaultProps = {
  rateScore: 0,
};
// 冯琳
export default React.memo(RatePanel);

const styles = StyleSheet.create({});

const TitleText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(14)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(18.48)}px;
  text-align: left;
`;

const MoreProductButton = styled.TouchableOpacity`
  align-items: center;
  border-color: ${Colors.signUpStepRed};
  border-radius: 15px;
  border-width: 1px;
  flex-direction: row;
  justify-content: center;
  margin-right: ${wp(11.08)}px;
`;

const MoreProductButtonText = styled.Text`
  color: ${Colors.priceRed};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(21.18)}px;
  margin-left: ${wp(11.08)}px;
  margin-right: ${wp(11.08)}px;
`;

const GoShopButton = styled.TouchableOpacity`
  align-items: center;
  background-color: ${Colors.signUpStepRed};
  border-color: ${Colors.signUpStepRed};
  border-radius: 15px;
  border-width: 1px;
  flex-direction: row;
  justify-content: center;
`;

const GoShopButtonText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(21.18)}px;
  margin-left: ${wp(11.08)}px;
  margin-right: ${wp(11.08)}px;
`;
const ScoreTitleText = styled.Text`
  align-self: center;
  color: ${Colors.grey3};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(11)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(19.41)}px;
  margin-right: ${wp(7)}px;
  text-align: left;
`;

const RateImg = styled.Image`
  border-radius: ${wp(2)}px;

  height: ${wp(32.44)}px;
  margin-left: ${wp(15)}px;
  margin-right: ${wp(15)}px;
  width: ${wp(32.44)}px;
`;
const RateText = styled.Text`
  align-self: center;
  color: ${Colors.signUpStepRed};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(11)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(19.41)}px;
`;
