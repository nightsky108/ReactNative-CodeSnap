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
  Text,
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

const AddressItem = ({ address, isDefault, onDeleteItem, onActiveItem, onEditItem }) => {
  //= ======== State Section========
  const { t, i18n } = useTranslation();
  const { id, label, street, city, region, country, zipCode } = address;

  return (
    <Box
      py={`${hp(17)}px`}
      px={`${wp(11)}px`}
      marginTop={`${hp(11.5)}px`}
      width="100%"
      backgroundColor={Colors.white}
      borderRadius={`${adjustFontSize(11)}px`}>
      <Box
        flexDirection="row"
        alignItems="center"
        paddingBottom={`${hp(10)}px`}
        borderBottomWidth="1px"
        borderBottomColor={Colors.grey4}>
        <Icon
          name="location-pin"
          type="entypo"
          containerStyle={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: Colors.discountPrice,
            justifyContent: 'center',
          }}
          color={Colors.white}
        />
        <Box marginX={`${wp(15)}px`} flex={1}>
          <Box flexDirection="row" alignItems="center">
            <LabelText>{label}</LabelText>
            <ZipCodeText>{zipCode}</ZipCodeText>
          </Box>

          <Box flexDirection="row">
            {isDefault ? (
              <DefaultContent>
                <DefaultText>{t('common:default')}</DefaultText>
              </DefaultContent>
            ) : null}
            <Box flex={1}>
              <AddressText numberOfLines={3}>{`${region?.name} ${city} ${street}`}</AddressText>
            </Box>
          </Box>
        </Box>

        <TouchableOpacity>
          <Icon name="pencil" type="material-community" color={Colors.grey3} />
        </TouchableOpacity>
      </Box>
      <Box
        flexDirection="row"
        alignItems="center"
        paddingTop={`${hp(10)}px`}
        justifyContent="space-between">
        <ActiveButton
          onPress={() => {
            onActiveItem(id);
          }}>
          <Icon
            name={isDefault ? 'check-circle' : 'checkbox-blank-circle-outline'}
            type="material-community"
            color={isDefault ? Colors.discountPrice : Colors.grey3}
            size={wp(22)}
          />
          <ActiveButtonText>{t('common:default address')}</ActiveButtonText>
        </ActiveButton>
        <DeleteButton>
          <DeleteButtonText>{t('common:delete')}</DeleteButtonText>
        </DeleteButton>
      </Box>
    </Box>
  );
};
AddressItem.propTypes = {
  address: PropTypes.shape({}),
  isDefault: PropTypes.bool,
  onDeleteItem: PropTypes.func,
  onActiveItem: PropTypes.func,
  onEditItem: PropTypes.func,
};
AddressItem.defaultProps = {
  address: {},
  isDefault: true,
  onDeleteItem: () => {},
  onActiveItem: () => {},
  onEditItem: () => {},
};
// 冯琳
export default React.memo(AddressItem, (prev, next) => {
  prev?.address?.id === next?.address?.id && prev?.isDefault === next?.isDefault;
});

const styles = StyleSheet.create({});

const LabelText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(15)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(23)}px;
  text-align: center;
`;
const ZipCodeText = styled.Text`
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(19)}px;
  margin-left: ${wp(15)}px;
`;
const AddressText = styled.Text`
  color: ${Colors.black};
  flex-shrink: 0;
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(19)}px;
`;
const ActiveButton = styled.TouchableOpacity`
  align-items: center;
  flex-direction: row;
`;
const ActiveButtonText = styled.Text`
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(13)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(20)}px;
  margin-left: ${wp(5)}px;
  text-align: center;
`;
const DeleteButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;
const DeleteButtonText = styled.Text`
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(13)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(20)}px;
  text-align: center;
`;
const DefaultContent = styled.View`
  align-items: center;
  background-color: ${Colors.checkoutHighlight1};
  border-radius: 5px;
  height: ${hp(22)}px;
  justify-content: center;
  margin-right: 5px;
  width: ${wp(28)}px;
`;
const DefaultText = styled.Text`
  color: ${Colors.more};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(10)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(15.3)}px;
`;
