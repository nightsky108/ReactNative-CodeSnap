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
import { Icon, Text, ListItem } from 'react-native-elements';
import Video from 'react-native-video';
import { useTranslation } from 'react-i18next';
import DashedLine from 'react-native-dashed-line';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
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
  { id: uuidv4(), url: 'https://picsum.photos/id/1/344/109' },
  { id: uuidv4(), url: 'https://picsum.photos/id/1/344/109' },
  { id: uuidv4(), url: 'https://picsum.photos/id/1/344/109' },
  { id: uuidv4(), url: 'https://picsum.photos/id/1/344/109' },
  { id: uuidv4(), url: 'https://picsum.photos/id/1/344/109' },
  { id: uuidv4(), url: 'https://picsum.photos/id/1/344/109' },
  { id: uuidv4(), url: 'https://picsum.photos/id/1/344/109' },
  { id: uuidv4(), url: 'https://picsum.photos/id/1/344/109' },
  { id: uuidv4(), url: 'https://picsum.photos/id/1/344/109' },
  { id: uuidv4(), url: 'https://picsum.photos/id/1/344/109' },
  { id: uuidv4(), url: 'https://picsum.photos/id/1/344/109' },
  { id: uuidv4(), url: 'https://picsum.photos/id/1/344/109' },
];
const IconSize = 25;
const { width: screenWidth } = Dimensions.get('window');
const SelectedItemSize = getAdjustSize({ width: 23.75, height: 29.02 });

const AttributeVariationInfo = ({
  onOpenSelectAttributePanel,
  variationKeyList,
  attrAssets,
  attrsSum,
}) => {
  //= ======== State Section========
  const [currentPage, setCurrentPage] = useState(-1);
  const { t, i18n } = useTranslation();
  const variationKeyString = useMemo(() => {
    return _.reduce(
      _.uniqBy(variationKeyList),
      function (result, val) {
        return `${result + val} `;
      },
      ' ',
    );
  }, [variationKeyList]);

  return (
    <>
      <Box flexDirection="row" marginY={`${hp(15)}px`} width="100%" alignItems="flex-start">
        <TitleText>{t('productDetail:select')}</TitleText>
        <Box flexGrow={1}>
          <Box marginLeft={`${wp(15.31)}px`}>
            <ItemButton onPress={onOpenSelectAttributePanel}>
              <AddressButtonText>
                {/* {t('productDetail:Please select color category size')} */}
                {variationKeyString}
              </AddressButtonText>
              <Icon name="right" type="antdesign" color="#BDBDBD" size={adjustFontSize(15)} />
            </ItemButton>
          </Box>
          <Box marginLeft={`${wp(15.31)}px`} flexDirection="row" marginTop={`${hp(9)}px`}>
            <ScrollView
              style={{ marginRight: 4, flex: 2 }}
              contentContainerStyle={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexGrow: 1,
              }}
              horizontal
              showsHorizontalScrollIndicator={false}>
              {attrAssets.map(item => {
                return <SelectedItemImg key={item?.id} source={{ uri: item?.url }} />;
              })}
            </ScrollView>
            <SelectContent>
              <SelectComment>
                {/* {t('productDetail:3 kinds of capacities are available')} */}
                {`共${attrsSum}種容量可選`}
              </SelectComment>
            </SelectContent>
          </Box>
        </Box>
      </Box>

      <Box flexDirection="row" marginY={`${hp(15)}px`} width="100%" alignItems="flex-start">
        <TitleText>{t('productDetail:data')}</TitleText>
        <Box flexGrow={1} marginLeft={`${wp(15.31)}px`}>
          <ItemButton>
            <AddressButtonText>
              {t('productDetail:Brand Origin Specification Type...')}
            </AddressButtonText>
            <Icon name="right" type="antdesign" color="#BDBDBD" size={adjustFontSize(15)} />
          </ItemButton>
        </Box>
      </Box>
      {/* <RowBox full>
                <SimpleTitleText>{t('productDetail:To pay')}</SimpleTitleText>
                <Box
                    flexDirection="row"
                    justifyContent="space-between"
                    flexGrow={1}
                    marginLeft={`${wp(15.31)}px`}>
                    <PaymentButton>
                        <Image source={Images.JCBLogoImg} />
                        <PaymentText>JBC</PaymentText>
                    </PaymentButton>
                    <PaymentButton>
                        <Image source={Images.VISALogoImg} />
                        <PaymentText>Visa</PaymentText>
                    </PaymentButton>
                    <PaymentButton>
                        <Image source={Images.MastercardLogoImg} />
                        <PaymentText>Master</PaymentText>
                    </PaymentButton>
                </Box>
            </RowBox> */}
    </>
  );
};
AttributeVariationInfo.propTypes = {
  onOpenSelectAttributePanel: PropTypes.func,
  variationKeyList: PropTypes.arrayOf(PropTypes.string),
  attrAssets: PropTypes.arrayOf(PropTypes.object),
  attrsSum: PropTypes.number,
};
AttributeVariationInfo.defaultProps = {
  onOpenSelectAttributePanel: () => {},
  variationKeyList: [],
  attrAssets: [],
  attrsSum: 0,
};
// 冯琳
export default React.memo(AttributeVariationInfo);

const styles = StyleSheet.create({});

const SimpleTitleText = styled.Text`
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(21.18)}px;
  text-align: left;
`;
const TitleText = styled(SimpleTitleText)`
  padding-top: ${hp(10.41)}px;
`;

const ItemButton = styled.TouchableOpacity`
  background-color: ${Colors.grey6};
  border-radius: 5px;
  flex-direction: row;
  justify-content: space-around;
  padding: ${hp(10.41)}px ${wp(17.03)}px ${hp(10.41)}px ${wp(17.03)}px;
`;
const AddressButtonText = styled.Text`
  color: ${Colors.black};
  flex-grow: 1;
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(11)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(14.52)}px;
  margin-left: ${wp(20)}px;
  text-align: left;
`;
const PaymentButton = styled.TouchableOpacity`
  align-items: center;
  flex: 1;
  flex-direction: row;
  justify-content: center;
`;
const PaymentText = styled.Text`
  color: ${Colors.grey2};
  flex-grow: 1;
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(15.84)}px;
  margin-left: ${wp(11.08)}px;
  text-align: left;
`;
const SelectContent = styled.View`
  align-items: center;
  background-color: ${Colors.grey6};
  border-radius: 5px;
  flex-shrink: 0;
  height: ${hp(29.25)}px;
  justify-content: center;
  width: ${wp(83.52)}px;
`;
const SelectComment = styled.Text`
  color: ${Colors.grey3};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(9)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(11.88)}px;
`;
const SelectedItemImg = styled.Image`
  border-radius: 2px;
  height: ${SelectedItemSize.height}px;
  margin-right: ${wp(4.15)}px;
  width: ${SelectedItemSize.width}px;
`;
