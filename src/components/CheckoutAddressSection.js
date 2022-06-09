import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Box } from 'native-base';
import { Icon } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';

import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { RowBox } from '@src/common/StyledComponents';
import { Colors } from '@theme';
//= =====hook data================================
import { useAddressContext } from '@contexts/AddressContext';

const IconSize = 25;
const { width: screenWidth } = Dimensions.get('window');
const CardSize = getAdjustSize({ width: 375, height: 376.66 });

const CheckoutAddressSection = ({ onPressChangeAddress, isDeliveryAddress }) => {
  // console.log('deliveryRateInfoList', deliveryRateInfoList);
  const { activeDeliveryAddress, activeBillingAddress } = useAddressContext();
  const navigation = useNavigation();

  //= ======== State Section========
  const { t, i18n } = useTranslation();

  const address = isDeliveryAddress ? activeDeliveryAddress : activeBillingAddress || 'default';
  const onChangeAddress = () => {
    // navigation.navigate('CheckoutAddressManage', { isDeliveryAddress });
  };
  return (
    <TouchableOpacity onPress={onChangeAddress}>
      <RowBox full>
        <Box flexDirection="row">
          <TitleText>
            {isDeliveryAddress ? t('common:Shipping address') : t('common:Billing Address')}
          </TitleText>
          <Icon
            name="location-pin"
            type="entypo"
            color={Colors.signUpStepRed}
            size={adjustFontSize(20)}
          />
        </Box>
        <AddressContent>
          <Box flex={1}>
            {address === 'default' ? (
              <AddressText>{t('common:Same as delivery address')}</AddressText>
            ) : (
              <>
                <AddressText>{address?.label || ''}</AddressText>
                <AddressDetailText>
                  {`${address?.country?.name || ''} ${address?.region?.name || ''} ${
                    address?.street || ''
                  } ${address?.city || ''}`}
                </AddressDetailText>
              </>
            )}
          </Box>

          {/*  <Icon name="right" type="antdesign" color="#BDBDBD" size={adjustFontSize(15)} /> */}
        </AddressContent>
      </RowBox>
    </TouchableOpacity>
  );
};
CheckoutAddressSection.propTypes = {
  onPressChangeAddress: PropTypes.func,
  isDeliveryAddress: PropTypes.bool,
};
CheckoutAddressSection.defaultProps = {
  onPressChangeAddress: () => {},
  isDeliveryAddress: true,
};

export default React.memo(CheckoutAddressSection);
const styles = StyleSheet.create({});

const TitleText = styled.Text`
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(21.18)}px;
  text-align: left;
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
