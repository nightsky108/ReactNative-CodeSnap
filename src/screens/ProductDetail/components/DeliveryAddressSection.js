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
import { Icon, Text, ListItem } from 'react-native-elements';
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
import _ from 'lodash';
//= =====hook data================================
import { useAddressContext } from '@contexts/AddressContext';

const IconSize = 25;
const { width: screenWidth } = Dimensions.get('window');
const CardSize = getAdjustSize({ width: 375, height: 376.66 });

const DeliveryAddressSection = ({ onPressChangeAddress }) => {
  // console.log('deliveryRateInfoList', deliveryRateInfoList);
  const { activeDeliveryAddress } = useAddressContext();

  //= ======== State Section========
  const { t, i18n } = useTranslation();

  if (!activeDeliveryAddress) return null;

  return (
    <TouchableOpacity onPress={onPressChangeAddress}>
      <RowBox full>
        <Box flexDirection="row">
          <TitleText>{t('common:Shipping address')}</TitleText>
          <Icon
            name="location-pin"
            type="entypo"
            color={Colors.signUpStepRed}
            size={adjustFontSize(20)}
          />
        </Box>
        <AddressContent>
          <Box flex={1}>
            <AddressText>{activeDeliveryAddress?.label || ''}</AddressText>
            <AddressDetailText>
              {`${activeDeliveryAddress?.country?.name || ''} ${
                activeDeliveryAddress?.region?.name || ''
              } ${activeDeliveryAddress?.street || ''} ${activeDeliveryAddress?.city || ''}`}
            </AddressDetailText>
          </Box>

          <Icon name="right" type="antdesign" color="#BDBDBD" size={adjustFontSize(15)} />
        </AddressContent>
      </RowBox>

      {/* <RowBox full>
                <TitleText>{t('productDetail:To pay')}</TitleText>
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
    </TouchableOpacity>
  );
};
DeliveryAddressSection.propTypes = {
  onPressChangeAddress: PropTypes.func,
};
DeliveryAddressSection.defaultProps = {
  onPressChangeAddress: () => {},
};

export default React.memo(DeliveryAddressSection);
const styles = StyleSheet.create({});

const TitleText = styled.Text`
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(21.18)}px;
  text-align: left;
`;

const DeliveryRateItem = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  margin-left: ${wp(15.91)}px;
`;

const PriceText = styled.Text`
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(11)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(19.41)}px;
  text-align: right;
`;
const SetDeliveryButton = styled.TouchableOpacity`
  background-color: ${Colors.grey6};
  border-radius: 5px;
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: ${hp(15)}px;
  margin-top: ${hp(15)}px;
  padding: ${hp(10.41)}px ${wp(17.03)}px ${hp(10.41)}px ${wp(17.03)}px;
`;
const AddressText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(11)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(14.52)}px;
  margin-right: ${wp(20)}px;
  text-align: left;
`;
const AddressContent = styled.View`
  align-items: center;
  background-color: ${Colors.white};
  flex-direction: row;
  flex-grow: 1;
  justify-content: space-between;
  margin-left: ${wp(20)}px;
`;
const AddressDetailText = styled.Text`
  color: ${Colors.black};
  flex: 1;
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(11)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(14.52)}px;
  margin-right: ${wp(20)}px;
  margin-top: ${hp(15)}px;
  text-align: left;
`;
const PaymentButton = styled.TouchableOpacity`
  align-items: center;
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
