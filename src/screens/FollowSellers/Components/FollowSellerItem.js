import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  StatusBar,
  Platform,
  FlatList,
  View,
  ImageBackground,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import { Icon, Text, Image, Button, ListItem, CheckBox } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Box, HStack, Center } from 'native-base';

//= ==custom components & containers  =======
import { FocusAwareStatusBar, NormalHeaderContainer, JitengPressable } from '@components';

import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { Colors, Fonts } from '@theme';
import Images from '@assets/images';

import _ from 'lodash';
import { FullHorizontalScrollView, FullButtonElement } from '@src/common/StyledComponents';

const faker = require('faker');

faker.locale = 'zh_CN';

const ContainerSize = getAdjustSize({ width: 172, height: 269 });

const FollowInfoText = styled.Text`
  color: ${Colors.grey4};
  font-family: 'Microsoft YaHei';
  font-size: 11px;
  font-weight: 400;
  line-height: 15px;
`;
const UserNameText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  font-weight: 400;
  line-height: 19px;
`;
const UserImage = styled(Image).attrs({
  containerStyle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5,
  },
})``;
const RemoveButton = styled(Button).attrs({
  containerStyle: {},
  buttonStyle: {
    width: 47,
    height: 26,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#BDBDBD',
    padding: 0,
  },
  titleStyle: {
    fontFamily: 'Microsoft YaHei',
    fontSize: 10,
    lineHeight: 13,
    color: Colors.grey3,
  },
})``;
const UnSubscribeButton = styled(Button).attrs({
  containerStyle: {},
  buttonStyle: {
    width: 64,
    height: 26,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#BDBDBD',
    padding: 0,
  },
  titleStyle: {
    fontFamily: 'Microsoft YaHei',
    fontSize: 10,
    lineHeight: 13,
    color: Colors.grey3,
  },
})``;
const FollowSellerItem = ({
  SellerPreview,
  isSelected,
  onToggleSelect,
  applyMore,
  onRemove,
  isFollowing,
}) => {
  const { t, i18n } = useTranslation();
  const { id, name, photo, title } = SellerPreview;
  return (
    <ListItem bottomDivider>
      {applyMore ? (
        <CheckBox
          checkedIcon="check-circle"
          uncheckedIcon="circle-o"
          checkedColor="#FF4173"
          containerStyle={{
            marginLeft: -15,
            marginRight: -15,
          }}
          checked={isSelected}
          onPress={() => {
            onToggleSelect(id, isSelected);
          }}
        />
      ) : null}
      <UserImage source={{ uri: photo?.url }} />
      <ListItem.Content>
        <UserNameText>{name}</UserNameText>
        <FollowInfoText numberOfLines={1}>{title}</FollowInfoText>
      </ListItem.Content>
      {isFollowing ? (
        <UnSubscribeButton
          onPress={() => {
            onRemove(id);
          }}
          title={t('common:unsubscribe')}
        />
      ) : (
        <RemoveButton
          onPress={() => {
            onRemove(id);
          }}
          title={t('common:Remove')}
        />
      )}
    </ListItem>
  );
};
FollowSellerItem.propTypes = {
  SellerPreview: PropTypes.objectOf(PropTypes.any),
  isSelected: PropTypes.bool,
  onToggleSelect: PropTypes.func,
  onRemove: PropTypes.func,
  applyMore: PropTypes.bool,
  isFollowing: PropTypes.bool,
};
FollowSellerItem.defaultProps = {
  SellerPreview: null,
  isSelected: false,
  onToggleSelect: () => {},
  onRemove: () => {},
  applyMore: false,
  isFollowing: true,
};
export default React.memo(FollowSellerItem, (prevProps, nextProps) => {
  return (
    prevProps.SellerPreview?.id === nextProps.SellerPreview?.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isFollowing === nextProps.isFollowing &&
    prevProps.applyMore === nextProps.applyMore
  );
});
const styles = StyleSheet.create({
  cardContainer: {
    ...ContainerSize,
    overflow: 'hidden',
    borderRadius: wp(9),
    paddingTop: hp(10),
    paddingBottom: hp(13),
    paddingHorizontal: wp(14),
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    // marginTop: hp(10),
  },
});
