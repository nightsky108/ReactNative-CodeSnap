import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, StatusBar, Platform, View, ImageBackground } from 'react-native';
import { Icon, Text, Image } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Box, HStack, Center } from 'native-base';
import { LinearTextGradient } from 'react-native-text-gradient';

//= ==custom components & containers  =======
import { FocusAwareStatusBar, NormalHeaderContainer, JitengPressable } from '@components';
import { HorizontalGradient, CenterBox, RowCenter } from '@common/StyledComponents';

import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { Colors, Fonts } from '@theme';
import Images from '@assets/images';
import { TouchableOpacity } from 'react-native-gesture-handler';
// 'https://picsum.photos/id/0/375/117',
const HeaderController = ({ streamer, views, title, hostId }) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  //= ======== State Section========
  return (
    <HStack
      marginTop={`${hp(12)}px`}
      marginLeft={`${wp(10)}px`}
      marginRight={`${wp(50)}px`}
      justifyContent="space-between">
      <HStack
        borderRadius="30px"
        backgroundColor="#33333380"
        alignItems="center"
        paddingX={`${wp(10)}px`}
        paddingY={`${hp(5)}px`}>
        <Avatar source={{ uri: 'https://picsum.photos/id/0/375/117' }} />
        <Box marginX={`${wp(6)}px`} justifyContent="center" width={`${wp(100)}px`}>
          <TitleText numberOfLines={1}>{title}</TitleText>
          <ViewText>{views}观看</ViewText>
        </Box>
        <TouchableOpacity>
          <FollowContent colors={[Colors.green1, Colors.green2]}>
            <RowCenter>
              <Icon
                type="material-community"
                name="heart-plus-outline"
                color={Colors.white}
                size={18}
              />
              <FollowText>关注</FollowText>
            </RowCenter>
          </FollowContent>
        </TouchableOpacity>
      </HStack>
      <HStack
        borderRadius="30px"
        backgroundColor="#33333380"
        alignItems="center"
        paddingX={`${wp(10)}px`}
        paddingY={`${hp(5)}px`}>
        <ViewText>主播 ID:{hostId}</ViewText>
      </HStack>
    </HStack>
  );
};
HeaderController.propTypes = {
  streamer: PropTypes.shape({}),
  views: PropTypes.number,
  title: PropTypes.string,
  hostId: PropTypes.string,
};
HeaderController.defaultProps = {
  streamer: {},
  views: 0,
  title: '',
  hostId: '',
};
export default React.memo(HeaderController);

const styles = StyleSheet.create({});
const Avatar = styled(FastImage)`
  border-radius: ${wp(15)}px;
  height: ${wp(30)}px;
  width: ${wp(30)}px;
`;
const TitleText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(11)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(14.5)}px;
  text-align: left;
`;
const ViewText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(8)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(11)}px;
  text-align: left;
`;
const FollowContent = styled(HorizontalGradient)`
  border-radius: 30px;
  padding-bottom: ${hp(4)}px;
  padding-left: ${wp(7)}px;
  padding-right: ${wp(7)}px;
  padding-top: ${hp(4)}px;
`;
const FollowText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(10)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(14)}px;
  padding-left: ${wp(7)}px;
  padding-right: ${wp(7)}px;
  text-align: left;
`;
