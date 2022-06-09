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
import { Icon, CheckBox, ListItem } from 'react-native-elements';
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

const SelectDeliveryAddress = ({
  activeDeliveryAddressID,
  deliveryAddresses,
  onChangeActiveDeliveryAddress,
  onClosePanel,
}) => {
  //= ======== State Section========
  const { t, i18n } = useTranslation();
  const [activeId, setActiveId] = useState(null);
  useEffect(() => {
    setActiveId(activeDeliveryAddressID);
    return () => {};
  }, [activeDeliveryAddressID]);

  return (
    <Box py={`${hp(17)}px`} px={`${wp(13)}px`} width="100%" flex={1}>
      <Box width="100%" justifyContent="space-between" flexDirection="row">
        <Box />
        <TitleText>{t('checkout:Delivery Method')}</TitleText>
        <Icon
          name="close"
          type="antdesign"
          color={Colors.grey4}
          size={wp(22)}
          onPress={onClosePanel}
        />
      </Box>
      <ScrollView>
        {deliveryAddresses.map((item, index) => (
          <ListItem
            key={item?.id}
            bottomDivider
            onPress={() => {
              setActiveId(item?.id);
            }}>
            <ListItem.Content>
              <ItemTitleText>{item?.street || `${item?.city}` || ''}</ItemTitleText>
            </ListItem.Content>
            <Box flexDirection="row" alignItems="center">
              <Icon
                name={activeId === item?.id ? 'check-circle' : 'checkbox-blank-circle-outline'}
                type="material-community"
                color={activeId === item?.id ? Colors.discountPrice : Colors.grey3}
                size={wp(22)}
              />
            </Box>
          </ListItem>
        ))}
      </ScrollView>
      <ConfirmButton onPress={() => onChangeActiveDeliveryAddress(activeId)}>
        <ConfirmButtonText>{t('common:carry out')}</ConfirmButtonText>
      </ConfirmButton>
    </Box>
  );
};
SelectDeliveryAddress.propTypes = {
  activeDeliveryAddressID: PropTypes.string,
  deliveryAddresses: PropTypes.arrayOf(PropTypes.object),
  onChangeActiveDeliveryAddress: PropTypes.func,
  onClosePanel: PropTypes.func,
};
SelectDeliveryAddress.defaultProps = {
  activeDeliveryAddressID: null,
  deliveryAddresses: [],
  onChangeActiveDeliveryAddress: () => {},
  onClosePanel: () => {},
};
// 冯琳
export default React.memo(SelectDeliveryAddress);

const styles = StyleSheet.create({});

const TitleText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(13)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(22.94)}px;
  text-align: center;
`;
const ItemTitleText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(13)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(17.16)}px;
`;
const ItemCostText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(10)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(17.65)}px;
  margin-right: ${wp(5)}px;
`;
const ConfirmButton = styled.TouchableOpacity`
  background-color: ${Colors.signUpStepRed};
  border-radius: 20px;
  padding-bottom: 10px;
  padding-top: 10px;
  width: 100%;
`;
const ConfirmButtonText = styled.Text`
  color: ${Colors.white};
  flex-grow: 1;
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(15)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(20)}px;
  margin-left: ${wp(20)}px;
  text-align: center;
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
const SelectContent = styled.View`
  align-items: center;
  background-color: ${Colors.grey6};
  border-radius: 5px;
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
