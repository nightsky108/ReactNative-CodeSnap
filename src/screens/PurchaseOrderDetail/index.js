import React, { useEffect, useCallback, useRef, useMemo } from 'react';
import { ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

//= ==third party plugins=======
import { useDispatch } from 'react-redux';
// import Alipay from '@uiw/react-native-alipay';
import { useNavigation } from '@react-navigation/native';
import ActionSheet from '@alessiocancian/react-native-actionsheet';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { Icon, Badge, Button } from 'react-native-elements';
import { v4 as uuidv4 } from 'uuid';
import { Box, HStack, Center, Text } from 'native-base';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
// import Spinner from 'react-native-loading-spinner-overlay';

//= ==custom components & containers  =======
import { Content, Container, JitengHeaderContainer } from '@components';
import { useSettingContext } from '@contexts/SettingContext';
import { OrderModuleHeader } from '@containers';

//= ======selectors==========================

//= ======reducer actions====================

//= ==========apis=======================
//= ==========Hook Data=======================
import { usePurchaseOrderList, usePurchaseOrderById } from '@data/usePurchaseOrders';

//= =============utils==================================
import * as constants from '@utils/constant';
import styled from 'styled-components/native';

//= =============styles==================================
import { Colors, Metrics, Fonts } from '@theme';
import { wp, hp, adjustFontSize } from '@src/common/responsive';
import * as globals from '@utils/global';
import { styles } from './styles';
// import { StyleSheetFactory } from './styles';
import { Destination, OrderItemInfo, TotalInfo } from './containers';

// AssetType
//= =============images & constants ===============================
//= ============import end ====================
const Header = () => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  return (
    <JitengHeaderContainer>
      <Box
        flexDirection="row"
        width="100%"
        height={`${hp(44)}px`}
        justifyContent="space-between"
        paddingX={2}
        alignItems="center">
        <BackIconButton
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon name="chevron-thin-left" type="entypo" color={Colors.white} size={wp(22)} />
        </BackIconButton>
        <HeaderTitle>{t('purchaseOrder:order details')}</HeaderTitle>
        <TouchableOpacity
          style={{
            paddingHorizontal: 18,
            paddingTop: 5,
            alignItems: 'center',
          }}>
          <Badge
            value="99"
            status="error"
            containerStyle={{
              position: 'absolute',
              right: 0,
              top: 0,
              zIndex: 999,
            }}
            textProps={{
              adjustsFontSizeToFit: true,
            }}
          />
          <Icon name="dots-three-vertical" type="entypo" color={Colors.white} size={wp(18)} />
          <Text
            fontFamily="Microsoft YaHei"
            fontWeight="400"
            fontSize="9px"
            lineHeight="20px"
            color={Colors.white}>
            更多
          </Text>
        </TouchableOpacity>
      </Box>
    </JitengHeaderContainer>
  );
};
const PurchaseOrderDetail = ({ navigation, route }) => {
  //= ========Hook Init===========
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const ActionSheetRef = useRef(null);

  const orderId = route?.params?.orderId;
  // const orderId = '990a95a7-82d2-49a5-a152-07370d0afe94';
  useEffect(() => {
    return () => {};
  }, []);
  const {
    loading: orderLoading,
    error: orderError,
    purchaseOrder,
  } = usePurchaseOrderById({ purchaseOrderId: orderId });

  // const styles = StyleSheetFactory({ theme });
  //= ========= Props Section========
  //= ======== State Section========

  //= ========= GraphQl query Section========
  //= ========= Use Effect Section========
  const onNavigateTrackOrder = () => {
    navigation.navigate('TrackOrder', { orderId });
  };
  const setCoverPhoto = response => {
    console.log('response', response);
    if (response.didCancel) {
    } else if (response.error) {
    } else {
      const id = uuidv4();
      const asset = response.assets[0];
      const photoData = {
        id,
        type: asset.type,
        size: asset.fileSize,
        url: asset.uri,
      };
      console.log('photoData', photoData);
      globals.uploadAsset(photoData);
    }
  };
  const orderItems = useMemo(() => {
    if (!purchaseOrder) {
      return [];
    } else {
      return purchaseOrder.items;
    }
  }, [purchaseOrder]);
  const totalInfo = useMemo(() => {
    if (!purchaseOrder) {
      return {};
    } else {
      return {
        id: purchaseOrder.deliveryOrders[0]?.id,
        tax: purchaseOrder.tax,
        total: purchaseOrder.total,
        deliveryOrder: purchaseOrder.deliveryOrders[0],
      };
    }
  }, [purchaseOrder]);

  const deliveryAddress = useMemo(() => {
    if (!purchaseOrder) {
      return {};
    } else {
      return purchaseOrder.deliveryOrders[0]?.deliveryAddress || {};
    }
  }, [purchaseOrder]);

  if (orderLoading || orderError) {
    return (
      <Container style={styles.container}>
        <OrderModuleHeader title="訂單詳情" />
        <Content style={{ flex: 0 }} contentContainerStyle={{ flex: 1 }}>
          <ActivityIndicator color="black" size="large" style={{ flex: 1, alignSelf: 'center' }} />
        </Content>
      </Container>
    );
  }
  return (
    <Container>
      <OrderModuleHeader title="訂單詳情" />
      <Content contentContainerStyle={styles.contentContainerStyle} style={styles.contentView}>
        <Destination deliveryAddress={deliveryAddress} />
        {_.map(orderItems, item => {
          return <OrderItemInfo key={item.id} orderInfo={item} />;
        })}

        <TotalInfo totalInfo={totalInfo} />
        {/*  <TouchableOpacity
          onPress={() => {
            ActionSheetRef.current?.show();
          }}>
          <Text>Select Photo</Text>
        </TouchableOpacity> */}
      </Content>
      <Box
        width="100%"
        py={`${hp(9)}px`}
        px={`${wp(13)}px`}
        backgroundColor={Colors.white}
        justifyContent="flex-end"
        flexDirection="row">
        <Button
          title={t('purchaseOrder:check logistics')}
          type="outline"
          titleStyle={{ color: Colors.grey2 }}
          buttonStyle={{ borderColor: Colors.grey2, borderRadius: 14, width: 90, height: 40 }}
          containerStyle={{ marginRight: 15 }}
          onPress={onNavigateTrackOrder}
        />
        {/* confirm the receipt of goods */}
        <Button
          title="確認收貨"
          type="outline"
          titleStyle={{ color: Colors.grey2 }}
          buttonStyle={{ borderColor: Colors.grey2, borderRadius: 14, width: 90, height: 40 }}
          containerStyle={{ marginRight: 15 }}
        />
        <Button
          title={t('purchaseOrder:Download order')}
          type="outline"
          titleStyle={{ color: Colors.grey2 }}
          buttonStyle={{ borderColor: Colors.grey2, borderRadius: 14, width: 90, height: 40 }}
        />
      </Box>
      <ActionSheet
        ref={ActionSheetRef}
        title="Add cover photo"
        options={constants.ImagePickerOptions.PHOTO_ACTIONS}
        cancelButtonIndex={constants.ImagePickerOptions.CANCEL_INDEX}
        destructiveButtonIndex={constants.ImagePickerOptions.DESTRUCTIVE_INDEX}
        onPress={index => {
          if (index === 0) {
            launchCamera(constants.Image_Options, response => {
              setCoverPhoto(response);
            });
          } else if (index === 1) {
            launchImageLibrary(constants.Image_Options, response => {
              setCoverPhoto(response);
            });
          }
        }}
      />
    </Container>
  );
};

export default PurchaseOrderDetail;
const BackIconButton = styled.TouchableOpacity`
  flex-direction: row;
  padding-left: 5px;
  padding-right: 5px; ;
`;
const HeaderTitle = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(15)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(20)}px;
`;
const MoreButton = styled.TouchableOpacity`
  margin-right: 12px;
  padding-left: 5px;
  padding-right: 5px;
`;
const MoreText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 9px;
  font-weight: 400;
  line-height: 22px;
`;
