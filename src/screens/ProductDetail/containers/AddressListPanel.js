import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, StatusBar, Platform, Dimensions, View, Image, Text } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import PagerView from 'react-native-pager-view';
import { Box } from 'native-base';
import { Icon, CheckBox, ListItem } from 'react-native-elements';
import Video from 'react-native-video';
import { useTranslation } from 'react-i18next';
import DashedLine from 'react-native-dashed-line';
import { v4 as uuidv4 } from 'uuid';
import DropDownPicker from 'react-native-dropdown-picker';
import { Dropdown } from 'react-native-element-dropdown';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';

import LinearGradient from 'react-native-linear-gradient';
import PageControl from 'react-native-page-control';
import StepIndicator from 'react-native-step-indicator';
import { AddressInputPanel } from '@containers';

import { TopBannerImgStyle } from '@common/GlobalStyles';
import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { FocusAwareStatusBar, TopBannerImage } from '@components';
import { RowBox, RowCenter } from '@src/common/StyledComponents';
import { Colors, Fonts } from '@theme';
import * as constants from '@utils/constant';
import _ from 'lodash';
import Images from '@assets/images';
//= =====hook data================================
import { useAddress } from '@data/useUser';

const EDIT = 0,
  ADD = 1;
const AddressListPanel = ({
  activeAddressID,
  addresses,
  onChangeActiveAddressId,
  onClosePanel,
  title,
  isDeliveryAddress,
  onAddAddress,
  onEditAddress,
  onDisableParentScroll,
  onDeleteAddress,
  activeAddress,
}) => {
  //= ======== State Section========
  const { t, i18n } = useTranslation();
  const [addressAction, setAddressAction] = useState(null);
  const [open, setOpen] = useState(false);
  const addressList = useMemo(() => {
    return _.map(addresses, address => {
      return {
        ...address,
        name: `${address?.label}\n${address?.region?.name} ${address?.city}, ${address?.street}`,
      };
    });
  }, [addresses]);
  const onCallSaveAddress = data => {
    if (addressAction === ADD) {
      onAddAddress(data);
    } else {
      onEditAddress(data);
    }

    setAddressAction(null);
  };
  const onCallDeleteAddress = data => {
    onDeleteAddress(data);
    setAddressAction(null);
  };

  return (
    <View>
      <Box
        flexDirection="row"
        width="100%"
        marginBottom={`${hp(15)}px`}
        justifyContent="space-between">
        <Box flexDirection="row">
          <AddressTitleText>{title}</AddressTitleText>
          <Icon
            name="location-pin"
            type="entypo"
            color={Colors.signUpStepRed}
            size={adjustFontSize(20)}
          />
        </Box>
        <Box flexDirection="row">
          {addressAction === null ? (
            <>
              {addressList.length > 0 ? (
                <AddressIconButton
                  onPress={() => {
                    setAddressAction(EDIT);
                  }}>
                  <Icon name="pencil" type="material-community" color={Colors.grey3} />
                </AddressIconButton>
              ) : null}
              <AddressIconButton
                onPress={() => {
                  setAddressAction(ADD);
                }}>
                <Icon name="plus" type="material-community" color={Colors.grey3} size={wp(25)} />
              </AddressIconButton>
            </>
          ) : (
            <AddressIconButton
              onPress={() => {
                setAddressAction(null);
              }}>
              <Icon name="close" type="material-community" color={Colors.grey3} size={wp(25)} />
            </AddressIconButton>
          )}
        </Box>
      </Box>
      {addressAction === null ? (
        addressList.length > 0 ? (
          <DropDownPicker
            open={open}
            value={activeAddressID}
            items={addressList}
            setValue={callback => {
              onChangeActiveAddressId(callback());
            }}
            setOpen={setOpen}
            itemKey="id"
            listMode="SCROLLVIEW"
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
            schema={{
              label: 'name',
              value: 'id',
            }}
            style={{
              height: 80,
              borderRadius: 10,
              borderColor: '#D6D6D6',
              borderWidth: 1,
              zIndex: isDeliveryAddress ? 100 : 10,
            }}
            dropDownContainerStyle={{
              borderRadius: 10,
              borderColor: '#D6D6D6',
              borderWidth: 1,
              zIndex: isDeliveryAddress ? 100 : 10,
            }}
            textStyle={{
              fontSize: 11,
            }}
            listItemContainerStyle={{
              height: 80,
            }}
          />
        ) : !isDeliveryAddress ? (
          <AddressText>{t('common:Same as delivery address')}</AddressText>
        ) : null
      ) : (
        <AddressInputPanel
          onSaveAddress={onCallSaveAddress}
          onDeleteAddress={onCallDeleteAddress}
          address={addressAction === EDIT ? activeAddress : null}
          isEditAction={addressAction === EDIT}
        />
      )}
    </View>
  );
};
AddressListPanel.propTypes = {
  activeAddressID: PropTypes.string,
  activeAddress: PropTypes.shape({}),
  addresses: PropTypes.arrayOf(PropTypes.object),
  onChangeActiveAddressId: PropTypes.func,
  onClosePanel: PropTypes.func,
  title: PropTypes.string,
  isDeliveryAddress: PropTypes.bool,
  onAddAddress: PropTypes.func,
  onEditAddress: PropTypes.func,
  onDeleteAddress: PropTypes.func,
  onDisableParentScroll: PropTypes.func,
};
AddressListPanel.defaultProps = {
  activeAddressID: null,
  addresses: [],
  onChangeActiveAddressId: () => {},
  onClosePanel: () => {},
  title: '',
  isDeliveryAddress: false,
  onAddAddress: () => {},
  onEditAddress: () => {},
  onDisableParentScroll: () => {},
  onDeleteAddress: () => {},
  activeAddress: null,
};
// 冯琳
export default React.memo(AddressListPanel);

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
const AddressTitleText = styled.Text`
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(21.18)}px;
  text-align: left;
`;
const AddressIconButton = styled(TouchableOpacity)`
  margin-left: 5px;
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
