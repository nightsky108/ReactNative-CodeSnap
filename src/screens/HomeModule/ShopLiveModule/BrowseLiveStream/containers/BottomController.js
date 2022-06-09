import React, { useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  StatusBar,
  Platform,
  View,
  ImageBackground,
  Pressable,
  TouchableOpacity,
  InteractionManager,
} from 'react-native';
import { Icon, Text, Image } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import SwitchSelector from 'react-native-switch-selector';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Box, HStack, Center } from 'native-base';
import { LinearTextGradient } from 'react-native-text-gradient';
import humanFormat from 'human-format';
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';
//= ==custom components & containers  =======
import { FocusAwareStatusBar, NormalHeaderContainer, JitengPressable } from '@components';

import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { Colors, Fonts } from '@theme';
import Images from '@assets/images';
import { ToggleChatType, HeartFloater } from '../components';

const { Popover } = renderers;

const BottomController = ({
  isPrivateChat,
  onOpenProductsPanel,
  onToggleChatType,
  onStartEditing,
  onToggleLike,
  isJoined,
  productsSum,
}) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const animationHeartRef = useRef();
  const onCallLike = () => {
    animationHeartRef?.current?.callAnimation();
    onToggleLike();
  };
  // console.log('BottomController', new Date());
  const initValue = isPrivateChat ? 1 : 0;
  //= ======== State Section========
  return (
    <HStack alignItems="center">
      <TouchableOpacity onPress={onOpenProductsPanel}>
        <BagImg source={Images.shoppingBagImg}>
          <ProductLengthText>{productsSum}</ProductLengthText>
        </BagImg>
      </TouchableOpacity>
      <ToggleChatType value={isPrivateChat} onToggleValue={onToggleChatType} disabled={!isJoined} />

      {/* <SwitchSelector
                initial={0}
                value={isPrivateChat.toString()}
                disabled={!isJoined}
                onPress={onToggleChatType}
                textColor="#e4e4e4"
                backgroundColor={Colors.grey1}
                selectedColor={Colors.signUpStepRed}
                buttonColor={Colors.white}
                borderColor={Colors.grey1}
                textContainerStyle={{ flexDirection: 'column' }}
                selectedTextContainerStyle={{ flexDirection: 'column' }}
                style={{
                    width: wp(74),
                    height: hp(37),
                    radius: hp(30),
                    opacity: isJoined ? 1 : 0.5,
                }}
                textStyle={{
                    alignSelf: 'center',
                    fontFamily: 'Microsoft YaHei',
                    fontSize: adjustFontSize(7),
                    letterSpacing: adjustFontSize(-0.36),
                    lineHeight: adjustFontSize(11),
                }}
                selectedTextStyle={{
                    alignSelf: 'center',
                    fontFamily: 'Microsoft YaHei',
                    fontSize: adjustFontSize(7),
                    letterSpacing: adjustFontSize(-0.36),
                    lineHeight: adjustFontSize(11),
                }}
                hasPadding
                options={[
                    {
                        label: '公開',
                        value: !isPrivateChat,
                        customIcon: (
                            <Icon
                                type="material"
                                name="people"
                                size={25}
                                color={isPrivateChat ? '#e4e4e4' : Colors.signUpStepRed}
                            />
                        ),
                    },
                    {
                        label: '私訊',
                        value: isPrivateChat,
                        customIcon: (
                            <Icon
                                type="ionicon"
                                name="person-sharp"
                                size={20}
                                color={!isPrivateChat ? '#e4e4e4' : Colors.signUpStepRed}
                            />
                        ),
                    },
                ]}
            /> */}
      <ChatInputButton onPress={onStartEditing} disabled={!isJoined}>
        <ChatInputButtonText>聊天...</ChatInputButtonText>
      </ChatInputButton>
      <Menu
        renderer={Popover}
        rendererProps={{
          preferredPlacement: 'bottom',
          anchorStyle: { backgroundColor: 'transparent' },
        }}>
        <MenuTrigger>
          <Icon
            name="dots-three-horizontal"
            type="entypo"
            color={Colors.white}
            containerStyle={{
              backgroundColor: Colors.grey1,
              width: wp(28),
              height: wp(28),
              borderRadius: wp(14),
              justifyContent: 'center',
            }}
            size={20}
          />
          <MoreButtonText>更多</MoreButtonText>
        </MenuTrigger>

        <MenuOptions
          customStyles={{ backgroundColor: 'transparent' }}
          optionsContainerStyle={{ backgroundColor: 'transparent' }}>
          <MenuOption onSelect={() => alert(`Save`)}>
            <Icon
              name="report"
              type="material"
              color={Colors.white}
              containerStyle={{
                backgroundColor: Colors.grey1,
                width: wp(28),
                height: wp(28),
                borderRadius: wp(14),
                justifyContent: 'center',
              }}
              size={20}
            />
          </MenuOption>
          <MenuOption onSelect={() => alert(`Delete`)}>
            <Icon
              name="share"
              type="entypo"
              color={Colors.white}
              containerStyle={{
                backgroundColor: Colors.grey1,
                width: wp(28),
                height: wp(28),
                borderRadius: wp(14),
                justifyContent: 'center',
              }}
              size={20}
            />
          </MenuOption>
        </MenuOptions>
      </Menu>

      <Box alignSelf="center" justifyContent="center" alignItems="center">
        <HeartFloater ref={animationHeartRef} />
        <TouchableOpacity onPress={onCallLike} style={{ alignSelf: 'center' }}>
          <Icon
            name="heart"
            type="ionicon"
            color={Colors.white}
            size={27}
            containerStyle={{ zIndex: 10 }}
          />
          <LikeContent colors={['#F64967', '#EA0046']}>
            <LikeContentText>{humanFormat(2346)}</LikeContentText>
          </LikeContent>
        </TouchableOpacity>
      </Box>
    </HStack>
  );
};
BottomController.propTypes = {
  isPrivateChat: PropTypes.bool,
  onToggleChatType: PropTypes.func,
  onStartEditing: PropTypes.func,
  isJoined: PropTypes.bool,
  onOpenProductsPanel: PropTypes.func,
  onToggleLike: PropTypes.func,
  productsSum: PropTypes.number,
};
BottomController.defaultProps = {
  isPrivateChat: false,
  onToggleChatType: () => {},
  onStartEditing: () => {},
  onOpenProductsPanel: () => {},
  onToggleLike: () => {},
  isJoined: false,
  productsSum: 0,
};
export default React.memo(BottomController);
const BagImg = styled.ImageBackground`
  align-items: center;
  height: ${wp(47)}px;
  justify-content: center;
  width: ${wp(47)}px;
`;
const ProductLengthText = styled.Text`
  align-self: center;
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 15px;
  font-weight: 700;
  line-height: 19.8px;
`;
const ChatInputButton = styled.TouchableOpacity`
  align-self: center;
  background-color: ${Colors.grey1};
  border-radius: 30px;
  flex-grow: 1;
  height: ${hp(30)}px;
  justify-content: center;
  margin-left: ${wp(6.5)}px;
  margin-right: ${wp(6.5)}px;
  opacity: 0.5;
  padding-left: ${wp(16)}px;
`;
const ChatInputButtonText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';

  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(15.84)}px;
`;
const MoreButtonText = styled.Text`
  align-self: center;
  color: ${Colors.white};

  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(7)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(9.24)}px;
  margin-top: 3px;
`;
const LikeContent = styled(LinearGradient)`
  align-self: center;
  border-radius: ${wp(10)}px;
  height: ${hp(15)}px;
  justify-content: center;
  margin-top: -${hp(5)}px;
  width: ${wp(40)}px; ;
`;
const LikeContentText = styled.Text`
  align-self: center;
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(8)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(11)}px;
  text-align: center;
`;
const styles = StyleSheet.create({});
