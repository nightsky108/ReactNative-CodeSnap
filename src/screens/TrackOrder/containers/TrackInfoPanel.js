import React, { useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Image } from 'react-native';
import { Box, Text, HStack, Image as NBImage, Hidden } from 'native-base';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import StepIndicator from 'react-native-step-indicator';

import _ from 'lodash';
import getSymbolFromCurrency from 'currency-symbol-map';
import { Icon, CheckBox, Button } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

import styled from 'styled-components/native';

import { wp, hp, adjustFontSize, getAdjustSize } from '@src/common/responsive';
import { PhotoView } from '@components';
import { Colors } from '@theme';
import Images from '@assets/images';
import dummyData from './data';
// 'https://placeimg.com/140/140/any'
const EmptyPhotoSize = getAdjustSize({ width: 37, height: 30 });
const PhotoSize = getAdjustSize({ width: 66, height: 66 });

const labels = ['待攬件', '運輸', '派送', '簽收'];
const stepActiveIndicators = [
  Images.pendingActiveImg,
  Images.transportationActiveImg,
  Images.deliveryActiveImg,
  Images.receiveActiveImg,
];
const stepInActiveIndicators = [
  Images.pendingGreyImg,
  Images.transportationGreyImg,
  Images.deliveryGreyImg,
  Images.receiveGreyImg,
];
const customStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 1,
  currentStepStrokeWidth: 1,
  stepStrokeCurrentColor: Colors.checkoutHighlight2,
  stepStrokeWidth: 1,
  separatorStrokeFinishedWidth: 1,
  stepStrokeFinishedColor: Colors.checkoutHighlight2,
  stepStrokeUnFinishedColor: Colors.grey5,
  separatorFinishedColor: Colors.signUpStepRed,
  separatorUnFinishedColor: Colors.grey3,
  stepIndicatorFinishedColor: Colors.checkoutHighlight1,
  stepIndicatorUnFinishedColor: Colors.grey5,
  stepIndicatorLabelUnFinishedColor: Colors.grey5,
  stepIndicatorCurrentColor: Colors.checkoutHighlight1,
  labelColor: Colors.grey2,
  labelSize: 10,
  labelAlign: 'flex-start',
  currentStepLabelColor: Colors.signUpStepRed,
};
const TrackerStyles = {
  stepIndicatorSize: 32,
  currentStepIndicatorSize: 32,
  separatorStrokeWidth: 1,
  currentStepStrokeWidth: 0,
  stepStrokeCurrentColor: Colors.checkoutHighlight2,
  stepStrokeWidth: 0,
  separatorStrokeFinishedWidth: 1,
  stepStrokeFinishedColor: Colors.checkoutHighlight2,
  stepStrokeUnFinishedColor: Colors.grey5,
  separatorFinishedColor: Colors.signUpStepRed,
  separatorUnFinishedColor: Colors.grey3,
  stepIndicatorFinishedColor: Colors.checkoutHighlight1,
  stepIndicatorUnFinishedColor: Colors.grey5,
  stepIndicatorLabelUnFinishedColor: Colors.grey5,
  stepIndicatorCurrentColor: Colors.checkoutHighlight1,
  labelColor: Colors.grey2,
  labelSize: 10,
  labelAlign: 'flex-start',
  currentStepLabelColor: Colors.signUpStepRed,
};
const TrackInfoPanel = ({ orderInfo }) => {
  //= ======== State Section========
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentPosition, setCurrentPosition] = useState(1);
  const [currentTrackPoint, setCurrentTrackPoint] = useState(4);
  const renderTrackStepIndicator = useCallback(({ position, stepStatus }) => {
    console.log('position: ', position, 'stepStatus: ', stepStatus);
    if (position === 0) {
      return (
        <Box
          size="30px"
          // borderRadius="15px"
          borderWidth="1px"
          borderColor={Colors.grey5}
          backgroundColor="#ff0000"
          alignItems="center"
          justifyContent="center">
          <NBImage alt="簽收" source={Images.receiveGreyImg} alignSelf="center" size="20px" />
        </Box>
      );
    }
    return (
      <Box size="30px" backgroundColor="#ffffff" justifyContent="center">
        <Icon name="dot-single" type="entypo" color={Colors.grey3} size={25} />
      </Box>
    );
  }, []);

  const renderTrackStepLabel = useCallback(({ position, stepStatus, label, currentPosition }) => {
    const { description, status } = JSON.parse(label);

    return (
      <Box flex={1} flexGrow={1} justifyContent="center" alignItems="flex-start" width="95%">
        <Text>{status}</Text>
        {description && description.length > 0 ? <Text>{description}</Text> : null}
      </Box>
    );
  }, []);
  return (
    <Box
      marginTop="7px"
      borderRadius="10px"
      paddingX={`${wp(10)}px`}
      paddingY={`${hp(15)}px`}
      backgroundColor={Colors.white}
      width="100%">
      <StepIndicator
        customStyles={customStyles}
        currentPosition={currentPosition}
        labels={labels}
        stepCount={labels.length}
        renderStepIndicator={({ position, stepStatus }) => {
          if (stepStatus === 'finished') {
            return (
              <NBImage alt={labels[position]} source={stepActiveIndicators[position]} size="30px" />
            );
          }
          return (
            <NBImage alt={labels[position]} source={stepInActiveIndicators[position]} size="30px" />
          );
        }}
      />
      <Box flexDirection="row" my="20px" alignItems="center">
        <Text
          fontFamily="Microsoft YaHei"
          fontSize="10px"
          lineHeight="13px"
          mx="4px"
          color={Colors.grey2}>
          配送方案 1 64007395586
        </Text>
        <Image source={Images.bookmarkImg} />
      </Box>
      <Box
        my="15px"
        width="100%"
        height={`${isExpanded ? dummyData.test_data.length * 80 : 120}px`}
        overflow="hidden">
        <Box height={`${dummyData.test_data.length * 80}px`}>
          <StepIndicator
            customStyles={TrackerStyles}
            currentPosition={currentTrackPoint}
            direction="vertical"
            stepCount={dummyData.data.length}
            // labels={dummyData.test_data}
            labels={dummyData.data.map(item => JSON.stringify(item))}
            renderLabel={renderTrackStepLabel}
            renderStepIndicator={renderTrackStepIndicator}
          />
        </Box>
      </Box>

      <Box width="100%" alignItems="center" zIndex={50} my="15px">
        <TouchableOpacity
          onPress={() => {
            setIsExpanded(prev => !prev);
          }}>
          <HStack width="100%" py="10px" px="60px">
            <Text
              fontFamily="Microsoft YaHei"
              fontSize="10px"
              lineHeight="16px"
              mr="5px"
              color={Colors.grey3}>
              點擊查看訂單全部商品
            </Text>
            <Icon
              name={isExpanded ? 'upcircleo' : 'downcircleo'}
              type="antdesign"
              color={Colors.grey3}
              size={15}
            />
          </HStack>
        </TouchableOpacity>
      </Box>
    </Box>
  );
};
TrackInfoPanel.propTypes = {
  orderInfo: PropTypes.shape({}),
};
TrackInfoPanel.defaultProps = {
  orderInfo: {},
};
// 冯琳
/* export default React.memo(TrackInfoPanel, (prev, next) => {
  return prev.orderInfo?.id === next.orderInfo?.id;
}); */
export default TrackInfoPanel;
const styles = StyleSheet.create({});

const AssetPhoto = styled(FastImage)`
  height: ${wp(77)}px;
  width: ${wp(77)}px;
`;
const ProductImg = styled(FastImage)`
  border-radius: 3px;
  height: ${wp(90)}px;
  width: ${wp(90)}px;
`;
