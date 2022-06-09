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
import _ from 'lodash';
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
const PhotoSize = getAdjustSize({ width: 354.29, height: 440.42 });

const AssetsData = [
  { id: uuidv4(), url: 'https://picsum.photos/id/1/344/109' },
  { id: uuidv4(), url: 'https://picsum.photos/id/1/344/109' },
  { id: uuidv4(), url: 'https://picsum.photos/id/1/344/109' },
];

const AttributeInfo = ({ attrAssets, brand, variationInfo }) => {
  //= ======== State Section========
  const [currentPage, setCurrentPage] = useState(-1);
  const { t, i18n } = useTranslation();

  const variationData = useMemo(() => {
    return _.map(Object.entries(variationInfo), ([key, value]) => {
      const type = key;
      const typeVal = _.reduce(
        _.uniqBy(value),
        function (result, val) {
          return `${result + val} `;
        },
        '',
      );
      return { type, typeVal };
    });
  }, [variationInfo]);
  return (
    <>
      <Box width="100%" justifyContent="space-between">
        <InfoText>
          {t('common:Brand')}: {brand}
        </InfoText>

        {_.map(variationData, item => {
          return (
            <InfoText key={item?.type}>
              {item?.type}: {item?.typeVal}
            </InfoText>
          );
        })}

        {/*  <InfoText>
                    {t('productDetail:size')}: {sizeAttr}
                </InfoText>
                <InfoText>
                    {t('productDetail:Color Classification')}: {colorAttr}
                </InfoText> */}
        <InfoText>{t('productDetail:Item No')}:</InfoText>
        <InfoText>{t('productDetail:Year season')}:</InfoText>
        <Divider />
        <Box marginY={`${hp(10)}px`} justifyContent="center">
          {attrAssets.map((item, index) => {
            return <Photo key={item?.id} source={{ uri: item?.url }} />;
          })}
        </Box>
      </Box>
    </>
  );
};
AttributeInfo.propTypes = {
  attrAssets: PropTypes.arrayOf(PropTypes.object),

  brand: PropTypes.string,
  variationInfo: PropTypes.shape({}),
};
AttributeInfo.defaultProps = {
  attrAssets: [],

  brand: '',
  variationInfo: {},
};
// 冯琳
export default React.memo(AttributeInfo);

const styles = StyleSheet.create({});

const InfoText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(14)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(18.48)}px;
  margin-bottom: 10px;
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
const Photo = styled(Image)`
  align-items: center;
  height: ${parseInt(PhotoSize.height, 10)}px;
  justify-content: center;
  margin-bottom: 5px;
  width: ${parseInt(PhotoSize.width, 10)}px;
`;

const Divider = styled.View`
  background-color: ${Colors.grey5};
  border-color: ${Colors.grey5};
  border-width: 1px;
  height: 1px;
  margin-bottom: 8px;
  margin-top: 8px;
  width: 100%;
`;
