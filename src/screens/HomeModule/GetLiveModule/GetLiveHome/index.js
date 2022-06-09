import React, {
  Component,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  PureComponent,
  useReducer,
} from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

//= ==third party plugins=======
import { connect, useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/native';
import { HorizontalGradient, CenterBox } from '@common/StyledComponents';

import { DrawerActions, NavigationContainer } from '@react-navigation/native';
import { Icon, CheckBox, SocialIcon, List, ListItem, Text } from 'react-native-elements';
import { v4 as uuidv4 } from 'uuid';
import { Box, Text as NBText, Button } from 'native-base';

import Spinner from 'react-native-loading-spinner-overlay';

import _ from 'lodash';

//= ==custom components & containers  =======
import { Content, Container, JitengHeaderContainer, JitengPressable, CartIcon } from '@components';
import { JitengHeader } from '@containers';
//= ======selectors==========================

//= ======reducer actions====================

//= ==========apis=======================
//= ====Hook Data==================
import { useProfile } from '@data/useUser';
import { useSettingContext } from '@contexts/SettingContext';

//= =============utils==================================
import * as constants from '@utils/constant';

//= =============styles==================================
import { wp, hp } from '@src/common/responsive';

import { Colors, Metrics, Fonts } from '@theme';
import Images from '@assets/images';
import { styles } from './styles';
// import { StyleSheetFactory } from './styles';

// AssetType
//= =============images & constants ===============================
//= ============import end ====================
// https://placeimg.com/140/140/any
const GetLiveHome = ({ navigation, route }) => {
  //= ========Hook Init===========
  const dispatch = useDispatch();
  const { user } = useProfile();

  console.log('user', user);

  // const styles = StyleSheetFactory({ theme });
  //= ========= Props Section========
  //= ======== State Section========

  //= ========= GraphQl query Section========
  //= ========= Use Effect Section========
  return (
    <Container>
      <JitengHeaderContainer>
        <Box
          flexDirection="row"
          width="100%"
          justifyContent="flex-end"
          alignItems="center"
          paddingX={3}>
          <JitengPressable style={styles.wrapperCustom}>
            <Icon name="person" type="ionicons" color={Colors.white} size={wp(25)} />
            <IconText>我的</IconText>
          </JitengPressable>
          <JitengPressable
            style={styles.wrapperCustom}
            onPress={() => {
              navigation.navigate('CartStack');
            }}>
            <CartIcon />

            <IconText>购物车</IconText>
          </JitengPressable>

          <JitengPressable style={styles.wrapperCustom}>
            <Icon name="settings" type="ionicons" color={Colors.white} size={wp(25)} />
            <IconText>设定</IconText>
          </JitengPressable>
        </Box>
      </JitengHeaderContainer>

      <HorizontalGradient colors={[Colors.headerRed1, Colors.headerRed2]}>
        <Box width="100%" flexDirection="row" paddingX="12px" paddingY="8px">
          <Photo
            source={{ uri: 'https://placeimg.com/140/140/any', priority: FastImage.priority.high }}
          />
          <Box justifyContent="center" marginLeft="8px">
            <Box flexDirection="row">
              <NameText>{user?.name}</NameText>

              <EditButton>
                <Icon name="pencil" type="material-community" color={Colors.grey3} size={15} />
                <EditButtonText>編輯資料</EditButtonText>
              </EditButton>
            </Box>

            <NumberText>{user?.email}</NumberText>
          </Box>
        </Box>
        <Box
          width="100%"
          flexDirection="row"
          paddingX="24px"
          paddingY="8px"
          justifyContent="space-between">
          <Box flexDirection="row">
            <StatusTitleText>279</StatusTitleText>
            <StatusInfoText>获赞</StatusInfoText>
          </Box>
          <Box flexDirection="row">
            <StatusTitleText>5461</StatusTitleText>
            <StatusInfoText>关注</StatusInfoText>
          </Box>
          <Box flexDirection="row">
            <StatusTitleText>1231</StatusTitleText>
            <StatusInfoText>粉丝</StatusInfoText>
          </Box>
        </Box>
      </HorizontalGradient>
      <Content contentContainerStyle={styles.contentContainerStyle} style={styles.contentView}>
        <Box
          width="100%"
          marginY="14px"
          paddingX="24px"
          justifyContent="space-between"
          flexDirection="row">
          <LinearGradient
            style={{ borderRadius: 7 }}
            start={{ x: 0.5, y: 0.0 }}
            end={{ x: 0.5, y: 1.0 }}
            colors={['#9815FF', '#BF0BFF']}>
            <ActionButton
              onPress={() => {
                navigation.navigate('PostLiveStack');
              }}>
              <Image source={Images.tvImg} />
              <ActionButtonText>直播</ActionButtonText>
            </ActionButton>
          </LinearGradient>

          <LinearGradient
            style={{ borderRadius: 7 }}
            start={{ x: 0.5, y: 0.0 }}
            end={{ x: 0.5, y: 1.0 }}
            colors={['#FF9A03', '#FFB904']}>
            <ActionButton>
              <Image source={Images.filmImg} />
              <ActionButtonText>短视频</ActionButtonText>
            </ActionButton>
          </LinearGradient>
        </Box>
        <Text h1>GetLiveHome Page</Text>
      </Content>
    </Container>
  );
};

export default GetLiveHome;
const IconText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 9px;
  font-weight: 400;
  line-height: 15px;
`;

const NameText = styled.Text`
  color: ${Colors.white};
  flex: 1;
  flex-grow: 1;
  font-family: 'Microsoft YaHei';
  font-size: 13px;
  font-weight: 700;
  line-height: 17px;
`;
const NumberText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  margin-top: 10px;
`;

const StatusTitleText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 13px;
  font-weight: 700;
  line-height: 17px;
`;
const StatusInfoText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
`;
const EditButton = styled.TouchableOpacity`
  align-items: center;
  background-color: ${Colors.white};
  border-radius: 20px;
  flex-direction: row;
  height: 20px;
  justify-content: center;
  width: 72px;
`;
const EditButtonText = styled.Text`
  color: ${Colors.grey3};
  font-family: 'Microsoft YaHei';
  font-size: 9px;
  font-weight: 400;
  line-height: 11px;
`;

const ActionButton = styled.TouchableOpacity`
  align-items: center;
  border-radius: 7px;
  flex-direction: row;
  height: 60px;
  justify-content: space-around;
  width: 160px;
`;
const ActionButtonText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 15px;
  font-weight: 700;
  line-height: 20px;
`;

const Photo = styled(FastImage)`
  align-items: center;
  border-radius: 37px;
  height: 74px;
  justify-content: center;
  width: 74px;
`;
