import React, { useState, useMemo, useRef, createContext } from 'react';
import { StyleSheet, Platform, View, TouchableOpacity, ScrollView } from 'react-native';
import PropTypes from 'prop-types';

//= ==third party plugins=======
import { useDispatch } from 'react-redux';
import { Badge, Icon, SearchBar, Button, ListItem } from 'react-native-elements';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

import { v4 as uuidv4 } from 'uuid';
import { Box, HStack, Center, Text } from 'native-base';
import { useTranslation } from 'react-i18next';
import Collapsible from 'react-native-collapsible';
import styled from 'styled-components/native';
import _ from 'lodash';
// import Spinner from 'react-native-loading-spinner-overlay';
import { useMutation } from '@apollo/client';

//= ==custom components & containers  =======
import { Content, Container, JitengHeaderContainer, NormalHeaderContainer } from '@components';
import { AddressInputPanel } from '@containers';
//= ======selectors==========================

//= ======reducer actions====================

//= ==========apis=======================
//= ========query====================
import { UPDATE_ORGANIZATION } from '@modules/auth/graphql';
//= =======Hook data=============================

import { useOrganization } from '@data/useUser';
import { useCarries } from '@data/useAssets';
//= =============utils==================================

//= =============styles==================================
import { Colors, Metrics, Fonts } from '@theme';
import { wp, hp, adjustFontSize } from '@src/common/responsive';
import * as globals from '@utils/global';
import * as constants from '@utils/constant';
import { styles } from './styles';
// import { StyleSheetFactory } from './styles';
import { ShippingBoxSection, CourierInfoSection } from './containers';
// AssetType
//= =============images & constants ===============================
//= ============import end ====================

export const ShippingBoxUnitContext = createContext({});

function UnitSwitchPanel({ onCloseUnitSwitch, onSwitchUnit, isMetricUnit }) {
  return (
    <Box
      py={`${hp(17)}px`}
      px={`${wp(13)}px`}
      my="5px"
      width="100%"
      borderTopRightRadius="5px"
      overflow="hidden">
      <Box width="100%" justifyContent="space-between" flexDirection="row" alignItems="center">
        <Box />
        <Text
          color={Colors.black}
          fontFamily="Microsoft YaHei"
          fontWeight="400"
          lineHeight="18px"
          fontSize="14px">
          刪除箱子
        </Text>
        <Icon
          name="close"
          type="antdesign"
          color={Colors.grey4}
          size={wp(22)}
          onPress={onCloseUnitSwitch}
        />
      </Box>
      <Box>
        <ListItem
          onPress={() => {
            onSwitchUnit(false);
          }}>
          <ListItem.Content>
            <Text
              color={Colors.black}
              fontFamily="Microsoft YaHei"
              fontWeight="400"
              lineHeight="18px"
              fontSize="14px">
              英制：寸，盎司
            </Text>
          </ListItem.Content>
          {isMetricUnit ? null : (
            <Icon name="check" type="antdesign" color={Colors.checkbox1} size={wp(22)} />
          )}
        </ListItem>
        <ListItem
          onPress={() => {
            onSwitchUnit(true);
          }}>
          <ListItem.Content>
            <Text
              color={Colors.black}
              fontFamily="Microsoft YaHei"
              fontWeight="400"
              lineHeight="18px"
              fontSize="14px">
              公制：厘米，克
            </Text>
          </ListItem.Content>
          {isMetricUnit ? (
            <Icon name="check" type="antdesign" color={Colors.checkbox1} size={wp(22)} />
          ) : null}
        </ListItem>
      </Box>
    </Box>
  );
}

UnitSwitchPanel.propTypes = {
  onCloseUnitSwitch: PropTypes.func,
  onSwitchUnit: PropTypes.func,
  isMetricUnit: PropTypes.bool,
};
UnitSwitchPanel.defaultProps = {
  onCloseUnitSwitch: () => {},
  onSwitchUnit: () => {},
  isMetricUnit: true,
};

const SellerInfoDetail = ({ navigation, route }) => {
  //= ========Hook Init===========
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [collapsedShipAddressBox, setCollapsedShipAddressBox] = useState(true);
  const [collapsedShipBoxPanel, setCollapsedShipBoxPanel] = useState(false);
  const [collapsedCourierSection, setCollapsedCourierSection] = useState(false);
  const { organization, onUpdateOrganization } = useOrganization();
  const systemCarries = useCarries();
  // const originCourierInfo = getCourierInfo(organization);
  const snapPoints = useMemo(() => [0.1, '20%'], []);
  const unitSwitchPanelRef = useRef(null);

  const [isMetricUnit, setIsMetricUnit] = useState(true);

  // const styles = StyleSheetFactory({ theme });
  //= ========= Props Section========
  //= ======== State Section========

  //= ========= GraphQl query Section========
  //= ========= Use Effect Section========
  const originCourierInfo = useMemo(() => {
    return {
      carriers: organization?.carriers ? _.map(organization.carriers, i => i.id) : [],
      workInMarketTypes: organization?.workInMarketTypes || [],
      customCarrier: organization?.customCarrier || null,
    };
  }, [organization]);
  const onCallUnitSwitch = () => {
    unitSwitchPanelRef.current?.expand();
  };
  const onCloseUnitSwitch = () => {
    unitSwitchPanelRef.current?.close();
  };
  const onSwitchUnit = val => {
    setIsMetricUnit(val);
    unitSwitchPanelRef.current?.close();
  };
  const onUpdateStoreAddress = async data => {
    try {
      const { city, country, description, region, street, zipCode } = data;
      await onUpdateOrganization({
        address: {
          city,
          country,
          description,
          region,
          street,
          zipCode,
        },
      });
    } catch (error) {
      console.log('updateOrganization error', error.message);
    }
  };
  const onSaveCourierInfo = async data => {
    try {
      console.log('onSaveCourierInfo', data);
      await onUpdateOrganization(data);
    } catch (error) {
      console.log('onSaveCourierInfo error', error.message);
    }
  };
  return (
    <Container>
      <JitengHeaderContainer gradientColors={[Colors.white, Colors.white]} barStyle="dark-content">
        <Box
          px="15px"
          width="100%"
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start">
          <TouchableOpacity
            style={{
              paddingRight: 25,
              paddingVertical: 5,
              alignItems: 'center',
            }}
            onPress={() => {
              // navigation.goBack();
            }}>
            <Icon name="chevron-thin-left" type="entypo" color={Colors.grey14} size={wp(20)} />
          </TouchableOpacity>
          {/* Seller Profile */}
          <Text
            fontFamily="Microsoft YaHei"
            fontWeight="400"
            fontSize="16px"
            lineHeight="22px"
            color={Colors.black}>
            卖家资料
          </Text>
        </Box>
      </JitengHeaderContainer>
      <Content
        nestedScrollEnabled={true}
        enableOnAndroid={false}
        contentContainerStyle={styles.contentContainerStyle}
        style={styles.contentView}>
        <CardContainer>
          <TouchableOpacity
            onPress={() => {
              setCollapsedShipAddressBox(prev => !prev);
            }}>
            <Box
              width="100%"
              flexDirection="row"
              justifyContent="space-between"
              paddingY="15px"
              paddingX="10px"
              overflow="hidden"
              backgroundColor={Colors.grey6}>
              {/* {Shipping address} */}
              <SellerInfoTitle>出貨地址</SellerInfoTitle>
              <Icon
                name={collapsedShipAddressBox ? 'chevron-thin-down' : 'chevron-thin-up'}
                size={20}
                type="entypo"
                color={Colors.grey3}
                containerStyle={{ marginRight: 10, borderRadius: 20 }}
              />
            </Box>
          </TouchableOpacity>
          <Collapsible
            collapsed={collapsedShipAddressBox}
            align="top"
            renderChildrenCollapsed={true}
            style={{}}>
            <Box width="100%" my="12px" backgroundColor={Colors.white} paddingX="10px">
              <Text
                color={Colors.grey1}
                fontFamily="Microsoft YaHei"
                fontWeight="400"
                fontSize="11px"
                lineHeight="15px"
                mb="12px">
                请输入出貨地址。如欲卖货此项必须填写。
              </Text>
              <AddressInputPanel isShippingAddress={true} onSaveAddress={onUpdateStoreAddress} />
            </Box>
          </Collapsible>
        </CardContainer>

        <CardContainer>
          <TouchableOpacity
            onPress={() => {
              setCollapsedShipBoxPanel(prev => !prev);
            }}>
            <Box
              width="100%"
              flexDirection="row"
              justifyContent="space-between"
              paddingY="15px"
              paddingX="10px"
              overflow="hidden"
              backgroundColor={Colors.grey6}>
              {/* {Shipping Box} */}
              <SellerInfoTitle>出貨地址</SellerInfoTitle>
              <Icon
                name={collapsedShipBoxPanel ? 'chevron-thin-down' : 'chevron-thin-up'}
                size={20}
                type="entypo"
                color={Colors.grey3}
                containerStyle={{ marginRight: 10, borderRadius: 20 }}
              />
            </Box>
          </TouchableOpacity>
          <Collapsible
            collapsed={collapsedShipBoxPanel}
            align="top"
            renderChildrenCollapsed={true}
            style={{}}>
            <Box width="100%" my="12px" backgroundColor={Colors.white} paddingX="10px">
              <ShippingBoxSection onCallUnitSwitch={onCallUnitSwitch} isMetricUnit={isMetricUnit} />
            </Box>
          </Collapsible>
        </CardContainer>
        <CardContainer>
          <TouchableOpacity
            onPress={() => {
              setCollapsedCourierSection(prev => !prev);
            }}>
            <Box
              width="100%"
              flexDirection="row"
              justifyContent="space-between"
              paddingY="15px"
              paddingX="10px"
              overflow="hidden"
              backgroundColor={Colors.grey6}>
              {/* {Shipping address} */}
              <SellerInfoTitle>付运公司*</SellerInfoTitle>
              <Icon
                name={collapsedCourierSection ? 'chevron-thin-down' : 'chevron-thin-up'}
                size={20}
                type="entypo"
                color={Colors.grey3}
                containerStyle={{ marginRight: 10, borderRadius: 20 }}
              />
            </Box>
          </TouchableOpacity>
          <Collapsible
            collapsed={collapsedCourierSection}
            align="top"
            renderChildrenCollapsed={true}
            style={{}}>
            <Box width="100%" my="12px" backgroundColor={Colors.white} paddingX="10px">
              <CourierInfoSection
                carriers={systemCarries}
                courierInfo={originCourierInfo}
                onSaveCourierInfo={onSaveCourierInfo}
              />
            </Box>
          </Collapsible>
        </CardContainer>
      </Content>
      <BottomSheet
        ref={unitSwitchPanelRef}
        snapPoints={snapPoints}
        index={0}
        enablePanDownToClose={true}
        backdropComponent={backdropProps => (
          <BottomSheetBackdrop {...backdropProps} enableTouchThrough={true} />
        )}
        backgroundComponent={({ style }) => (
          <View
            style={[
              {
                backgroundColor: 'white',
                borderRadius: 10,
              },
              { ...style },
            ]}
          />
        )}
        handleComponent={null}
        enableOverDrag={false}
        enableHandlePanningGesture={false}
        enableContentPanningGesture={false}
        style={{
          shadowColor: Colors.black,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.18,
          shadowRadius: 4,
          elevation: 5,
          zIndex: 50,
        }}>
        <UnitSwitchPanel
          onCloseUnitSwitch={onCloseUnitSwitch}
          onSwitchUnit={onSwitchUnit}
          isMetricUnit={isMetricUnit}
        />
      </BottomSheet>
    </Container>
  );
};

export default SellerInfoDetail;
const CardContainer = styled.View`
  background-color: ${Colors.white};
  border-radius: 8px;
  margin-bottom: 10px;
  overflow: hidden;
  width: 100%;
`;
const SellerInfoTitle = styled.Text`
  align-self: center;
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
`;
