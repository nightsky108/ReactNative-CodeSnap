import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text } from 'react-native';
import { Box } from 'native-base';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import getSymbolFromCurrency from 'currency-symbol-map';
import { Icon, CheckBox, ListItem } from 'react-native-elements';

import styled from 'styled-components/native';

import { wp, hp, adjustFontSize } from '@src/common/responsive';
import { SelectQuantityPanel } from '@components';
import { Colors } from '@theme';
import Images from '@assets/images';

const Destination = ({ deliveryAddress }) => {
  //= ======== State Section========
  const { t, i18n } = useTranslation();
  //  console.log('productInfo', productInfo);
  const { id, label, street, city, region, country, zipCode } = deliveryAddress;
  return (
    <Box
      py={`${hp(17)}px`}
      px={`${wp(13)}px`}
      marginTop={`${hp(12)}px`}
      width="100%"
      backgroundColor={Colors.white}
      borderTopWidth={`${hp(50)}px`}
      borderTopColor={Colors.more}
      borderRadius="11px">
      <Box position="absolute" left={4} top={`${hp(-35)}px`}>
        <TitleText>{t('purchaseOrder:To be shipped by the seller')}</TitleText>
      </Box>
      <SubTitleText>{t('purchaseOrder:Shipping address')}</SubTitleText>
      <Box flexDirection="row" paddingBottom={`${hp(10)}px`} alignItems="center">
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
        <Box marginLeft={2} flexGrow={1} flex={1}>
          <Box flexDirection="row" alignItems="center" marginBottom={1}>
            <ItemTitleText>{label}</ItemTitleText>
            <NumberText>{zipCode}</NumberText>
          </Box>

          <ItemTitleText numberOfLines={2}>{`${region?.name} ${city} ${street}`} </ItemTitleText>
        </Box>
      </Box>
    </Box>
  );
};
Destination.propTypes = {
  deliveryAddress: PropTypes.shape({}),
};
Destination.defaultProps = {
  deliveryAddress: {},
};
// 冯琳
export default React.memo(Destination);

const styles = StyleSheet.create({});

const AssetPhoto = styled(FastImage)`
  height: ${wp(77)}px;
  width: ${wp(77)}px;
`;
const EmptyContent = styled.View`
  align-items: center;
  background-color: ${Colors.grey5};
  height: ${wp(77)}px;
  justify-content: center;
  width: ${wp(77)}px;
`;
const EmptyImage = styled.Image`
  height: ${wp(30)}px;
  width: ${wp(37)}px;
`;
const TitleText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(15)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(28)}px;
`;
const SubTitleText = styled.Text`
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(19)}px;
`;
const ItemTitleText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(15)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(23)}px;
`;
const NumberText = styled.Text`
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(20)}px;
  margin-left: 20px;
`;
const QuantityTitle = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(10)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(20)}px;
`;
const OrderNoteTitle = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(10)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(20)}px;
`;
const OrderNoteInfo = styled.Text`
  color: ${Colors.grey3};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(10)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(20)}px;
`;

const SumQuantityInfo = styled.Text`
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(10)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(17.65)}px;
  margin-bottom: 5px;
  margin-top: 5px;
`;
const ConstTitle = styled.Text`
  color: ${Colors.grey1};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(10)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(17.65)}px;
`;
const ConstInfo = styled.Text`
  color: ${Colors.discountPrice};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(10)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(17.65)}px;
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
