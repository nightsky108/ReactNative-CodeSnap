import React, { useCallback, useMemo } from 'react';

import styled from 'styled-components/native';

//= ==third party plugins=======
import { useDispatch } from 'react-redux';

import { Icon } from 'react-native-elements';
import { Box } from 'native-base';
import { useTranslation } from 'react-i18next';

//= ==custom components & containers  =======
import { Content, Container, JitengStatusBar } from '@components';

//= ======selectors==========================

//= ======reducer actions====================

//= =====hook data================================
import { useAddressContext } from '@contexts/AddressContext';
//= =============utils==================================

//= =============styles==================================
import { Colors } from '@theme';
import { wp, adjustFontSize } from '@src/common/responsive';
import { styles } from './styles';
// import { StyleSheetFactory } from './styles';
import { PageHeader } from './components';
import { AddressItem } from './containers';
// AssetType
//= =============images & constants ===============================
//= ============import end ====================

const CheckoutAddressManage = ({ navigation, route }) => {
  //= ========Hook Init===========
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isDeliveryAddress = route?.params?.isDeliveryAddress || true;
  const {
    deliveryAddresses,
    billingAddresses,

    updateActiveDeliveryAddressId,
    updateActiveBillingAddressId,
    activeDeliveryAddressId,
    activeBillingAddressId,
  } = useAddressContext();

  const addressList = useMemo(() => {
    return isDeliveryAddress ? deliveryAddresses : billingAddresses;
  }, [isDeliveryAddress, deliveryAddresses, billingAddresses]);
  const activeId = useMemo(() => {
    return isDeliveryAddress ? activeDeliveryAddressId : activeBillingAddressId;
  }, [isDeliveryAddress, activeDeliveryAddressId, activeBillingAddressId]);
  // const styles = StyleSheetFactory({ theme });
  //= ========= Props Section========
  //= ======== State Section========

  //= ========= GraphQl query Section========
  //= ========= Use Effect Section========
  const keyExtractor = useCallback(item => item?.id, []);
  const onActiveItem = useCallback(id => {
    if (isDeliveryAddress) {
      updateActiveDeliveryAddressId(id);
    } else {
      updateActiveBillingAddressId(id);
    }
  }, []);
  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <AddressItem
          address={item}
          isDefault={activeId === item?.id}
          onDeleteItem={() => {}}
          onActiveItem={onActiveItem}
          onEditItem={() => {}}
        />
      );
    },
    [activeId, onActiveItem],
  );
  return (
    <Container>
      <JitengStatusBar />
      <PageHeader
        title={isDeliveryAddress ? t('common:My shipping address') : t('common:My billing address')}
      />
      <Content
        contentContainerStyle={styles.contentContainerStyle}
        style={styles.contentView}
        isList={true}
        data={addressList}
        renderItem={renderItem}
        extraData={addressList.length}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
      />
      <Box backgroundColor={Colors.white} width="100%" paddingX="21px" paddingY="10px">
        <ActiveButton>
          <Icon name="plus" type="antdesign" color={Colors.white} size={wp(22)} />
          <ActiveButtonText>{t('common:Add address')}</ActiveButtonText>
        </ActiveButton>
      </Box>
    </Container>
  );
};

export default CheckoutAddressManage;
const ActiveButton = styled.TouchableOpacity`
  align-items: center;
  background-color: ${Colors.signUpStepRed};
  border-radius: 20px;
  flex-direction: row;
  justify-content: center;
  padding-bottom: 10px;
  padding-top: 10px;
  width: 100%;
`;
const ActiveButtonText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(18)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(24)}px;
  margin-left: ${wp(5)}px;
  text-align: center;
`;
