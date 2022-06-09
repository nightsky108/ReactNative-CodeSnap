import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as constants from '@utils/constant';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon, ListItem } from 'react-native-elements';
import { Box, Text } from 'native-base';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';

import Animated from 'react-native-reanimated';

import { Colors } from '@theme';
import { wp, hp, adjustFontSize } from '@src/common/responsive';

import { signOut } from '@modules/auth/slice';
import { useProfile } from '@data/useUser';
// 'https://placeimg.com/140/140/any'

const DrawerContent = props => {
  const { navigation } = props;
  const { user } = useProfile();

  const dispatch = useDispatch();
  const onCallSignOut = () => {
    dispatch(signOut());
  };

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <Box flexDirection="row" mx="15px" my="15px">
        <Photo
          source={{ uri: 'https://placeimg.com/140/140/any', priority: FastImage.priority.high }}
        />
        <Box flexGrow={1} justifyContent="space-around">
          <Text fontFamily="Microsoft YaHei" fontWeight="400" fontSize="13px" lineHeight="20px">
            {user?.name}
          </Text>
          <Box alignItems="center" flexDirection="row">
            <Icon type="entypo" name="location-pin" color={Colors.grey3} size={22} />
            <Text
              numberOfLines={1}
              fontFamily="Microsoft YaHei"
              fontWeight="400"
              fontSize="9px"
              lineHeight="16px"
              flex={1}
              flexGrow={1}>
              广东省，广州市，白云区，钟1 广东省，广州市，白云区，钟1广东省，广州市，白云区，钟1
            </Text>
          </Box>
        </Box>
      </Box>
      <Box marginY="15px">
        <ItemButton disabled>
          {/* Buyer */}
          <Text
            fontFamily="Microsoft YaHei"
            fontWeight="400"
            fontSize="12px"
            lineHeight="16px"
            color={Colors.black}>
            我是买家
          </Text>
        </ItemButton>

        <SubItemButton
          onPress={() => {
            navigation.navigate('OrderStack');
          }}>
          <Text
            // My Order
            color={Colors.grey2}
            fontFamily="Microsoft YaHei"
            fontWeight="400"
            fontSize="12px"
            lineHeight="16px"
            marginLeft="5px">
            我的訂單
          </Text>
        </SubItemButton>
        <SubItemButton onPress={() => {}}>
          <Text
            // my collection
            color={Colors.grey2}
            fontFamily="Microsoft YaHei"
            fontWeight="400"
            fontSize="12px"
            lineHeight="16px"
            marginLeft="5px">
            我的收藏
          </Text>
        </SubItemButton>
        <SubItemButton onPress={() => {}}>
          <Text
            // Shops purchased
            color={Colors.grey2}
            fontFamily="Microsoft YaHei"
            fontWeight="400"
            fontSize="12px"
            lineHeight="16px"
            marginLeft="5px">
            購買過的店鋪
          </Text>
        </SubItemButton>
        <Divider />
        <ItemButton disabled>
          {/* I am the seller */}
          <Text
            fontFamily="Microsoft YaHei"
            fontWeight="400"
            fontSize="12px"
            lineHeight="16px"
            color={Colors.black}>
            我是卖家
          </Text>
        </ItemButton>
        <SubItemButton
          onPress={() => {
            navigation.navigate('SellerProductStack');
          }}>
          <Text
            // Commodity management
            color={Colors.grey2}
            fontFamily="Microsoft YaHei"
            fontWeight="400"
            fontSize="12px"
            lineHeight="16px"
            marginLeft="5px">
            商品管理
          </Text>
        </SubItemButton>
        <SubItemButton
          onPress={() => {
            navigation.navigate('SellerInfoDetail');
          }}>
          <Text
            // Seller Profile
            color={Colors.grey2}
            fontFamily="Microsoft YaHei"
            fontWeight="400"
            fontSize="12px"
            lineHeight="16px"
            marginLeft="5px">
            卖家资料
          </Text>
        </SubItemButton>

        <SubItemButton onPress={() => {}}>
          <Text
            // Live broadcast management
            color={Colors.grey2}
            fontFamily="Microsoft YaHei"
            fontWeight="400"
            fontSize="12px"
            lineHeight="16px"
            marginLeft="5px">
            直播管理
          </Text>
        </SubItemButton>
        <Divider />
        <ItemButton disabled>
          {/* Evaluation */}
          <Text
            fontFamily="Microsoft YaHei"
            fontWeight="400"
            fontSize="12px"
            lineHeight="16px"
            color={Colors.black}>
            评价
          </Text>
        </ItemButton>
        <SubItemButton onPress={() => {}}>
          <Text
            // Evaluation Management
            color={Colors.grey2}
            fontFamily="Microsoft YaHei"
            fontWeight="400"
            fontSize="12px"
            lineHeight="16px"
            marginLeft="5px">
            评价管理
          </Text>
        </SubItemButton>
        <Divider />
        <ItemButton disabled>
          {/* set up */}
          <Text
            fontFamily="Microsoft YaHei"
            fontWeight="400"
            fontSize="12px"
            lineHeight="16px"
            color={Colors.black}>
            设定
          </Text>
        </ItemButton>
        <SubItemButton onPress={() => {}}>
          <Text
            // Options
            color={Colors.grey2}
            fontFamily="Microsoft YaHei"
            fontWeight="400"
            fontSize="12px"
            lineHeight="16px"
            marginLeft="5px">
            选项
          </Text>
        </SubItemButton>
        <SubItemButton onPress={() => {}}>
          <Text
            // help
            color={Colors.grey2}
            fontFamily="Microsoft YaHei"
            fontWeight="400"
            fontSize="12px"
            lineHeight="16px"
            marginLeft="5px">
            帮助
          </Text>
        </SubItemButton>
        <SubItemButton onPress={onCallSignOut}>
          <Text
            // Sign out
            color={Colors.grey2}
            fontFamily="Microsoft YaHei"
            fontWeight="400"
            fontSize="12px"
            lineHeight="16px"
            marginLeft="5px">
            登出
          </Text>
        </SubItemButton>
      </Box>
    </DrawerContentScrollView>
  );
};

DrawerContent.propTypes = {};

export default DrawerContent;
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingBottom: 60,
  },
});
const Photo = styled(FastImage)`
  align-items: center;
  border-radius: 37px;
  height: 74px;
  justify-content: center;
  margin-left: 10px;
  margin-right: 10px;

  width: 74px;
`;
const ItemButton = styled(TouchableOpacity)`
  margin-bottom: 8px;
  margin-left: 22px;
  margin-top: 8px;
`;
const SubItemButton = styled(TouchableOpacity)`
  margin-bottom: 12px;
  margin-left: 32px;
  margin-top: 12px;
`;
const Divider = styled.View`
  border-color: ${Colors.grey5};
  border-width: 1px;
  width: 100%;
`;
