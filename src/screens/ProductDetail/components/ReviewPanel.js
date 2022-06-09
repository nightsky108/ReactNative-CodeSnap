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
import { Box } from 'native-base';
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

const AssetsData = [
  {
    id: uuidv4(),

    url: 'https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4',
  },
  { id: uuidv4(), url: 'https://picsum.photos/id/1/344/109' },
  { id: uuidv4(), url: 'https://picsum.photos/id/1/344/109' },
  { id: uuidv4(), url: 'https://picsum.photos/id/1/344/109' },
];
const photo = 'https://picsum.photos/id/1/344/109';
const IconSize = 25;
const { width: screenWidth } = Dimensions.get('window');
const SelectedItemSize = getAdjustSize({ width: 23.75, height: 29.02 });

const ReviewPanel = () => {
  //= ======== State Section========
  const [currentPage, setCurrentPage] = useState(-1);
  const { t, i18n } = useTranslation();

  return (
    <>
      <Box width="100%" flexDirection="row" justifyContent="space-between">
        <TitleText>{t('productDetail:product review')}</TitleText>
        <MoreButton>
          <MoreButtonText>{t('productDetail:view all')}</MoreButtonText>
          <Icon
            name="right"
            type="antdesign"
            color={Colors.signUpStepRed}
            size={adjustFontSize(15)}
          />
        </MoreButton>
      </Box>
      <Box flexDirection="row" marginY={`${hp(10)}px`}>
        <PhotoImg source={{ uri: photo }} />
        <UserNameText>桃子</UserNameText>
      </Box>
      <ReviewText>
        黑金亮片的花花太吸引眼球啦！袖子设计好遮肉！版型修身高腰设计显腿长！透过网纱隐隐约约看到的腿又细又长！
      </ReviewText>
    </>
  );
};
ReviewPanel.propTypes = {};
ReviewPanel.defaultProps = {};
// 冯琳
export default React.memo(ReviewPanel);

const styles = StyleSheet.create({});

const TitleText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(13)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(22.94)}px;
  text-align: left;
`;

const MoreButton = styled.TouchableOpacity`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;
const MoreButtonText = styled.Text`
  color: ${Colors.signUpStepRed};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(21.18)}px;
  margin-left: ${wp(11.08)}px;
  margin-right: ${wp(11.08)}px;
  text-align: left;
`;
const UserNameText = styled.Text`
  align-self: center;
  color: ${Colors.grey3};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(15.84)}px;
  margin-left: ${wp(6)}px;
  text-align: left;
`;
const PhotoImg = styled.Image`
  border-radius: ${wp(12)}px;

  height: ${wp(24)}px;
  width: ${wp(24)}px;
`;
const ReviewText = styled.Text`
  align-self: center;
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(11)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(19.41)}px;
  text-align: left;
`;
