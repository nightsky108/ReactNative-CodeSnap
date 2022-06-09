import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Platform, View, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Fonts } from '@theme';
import { Text, Icon, Button, Image } from 'react-native-elements';
import { wp, hp, adjustFontSize } from '@src/common/responsive';
import { SvgXml } from 'react-native-svg';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import { Box, HStack, Center } from 'native-base';

import { useNavigation, useRoute } from '@react-navigation/native';

import { SearchBarContainer } from '@src/common/StyledComponents';
import { JitengHeaderContainer } from '@components';

//= ===image assets======================
import * as constants from '@utils/constant';

// const faker = require('faker');
const faker = require('faker/locale/zh_TW');

const CardContainer = styled.View`
  align-items: center;
  align-self: center;

  margin-left: 10px;
  margin-right: 5px;
`;
const StreamerContainer = styled.View`
  align-items: center;
  align-self: center;
  height: 50px;
  margin-bottom: 5px;
  padding-bottom: 2px;
  padding-left: 3px;
  padding-right: 3px;
  padding-top: 1px;
  width: 50px;
`;
const StatusText = styled.Text`
  align-self: center;
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 9px;
  font-weight: 400;
  line-height: 12px;
`;
const ShopText = styled.Text`
  align-self: center;
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: 11px;
  font-weight: 400;
  line-height: 15px;
  width: 66px;
`;
const StreamPreview = React.memo(
  ({ item, index }) => {
    const { id, title, streamer, channel } = item;
    //  console.log('StreamPreview', id);

    return (
      <CardContainer>
        <StreamerContainer>
          <Image
            source={{ uri: streamer?.photo?.url }}
            containerStyle={{
              width: 44,
              height: 44,
              borderRadius: 22,
              borderWidth: 1,
              borderColor: '#EF3900',
            }}
            style={{
              margin: 1,
              width: 40,
              height: 40,
              borderRadius: 20,
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              backgroundColor: constants.SellerColor[index % constants.SellerColor.length],
              width: 40,
              height: 15,
              borderRadius: 7,
              alignSelf: 'center',
            }}>
            <StatusText>{channel?.status}</StatusText>
          </View>
        </StreamerContainer>
        <ShopText numberOfLines={1}>{title}</ShopText>
      </CardContainer>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.item?.id === nextProps.item?.id;
  },
);

const SellerStreamHeader = ({
  sellerStreamList,
  onPressCategoryItem,
  onPressFilterItem,
  onNavigateFollowSellers,
}) => {
  const { t, i18n } = useTranslation();
  //= ======== State Section========
  return (
    <>
      <Box
        flexDirection="row"
        width="100%"
        justifyContent="space-around"
        borderRadius="8px"
        backgroundColor={Colors.white}
        marginTop="10px"
        alignItems="center">
        <Box flexShrink={1} alignItems="center">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.streamerScrollView}>
            {sellerStreamList.map((item, index) => {
              return <StreamPreview key={item?.id} item={item} index={index} />;
            })}
          </ScrollView>
        </Box>
        <TouchableOpacity
          onPress={onNavigateFollowSellers}
          style={{
            width: 30,
            paddingHorizontal: 8,
            paddingVertical: 13,
            borderRadius: 0,
          }}>
          <Text
            style={{
              fontFamily: 'Microsoft YaHei',
              fontSize: adjustFontSize(10),
              lineHeight: adjustFontSize(13),
              textAlign: 'center',
              color: Colors.more,
              marginBottom: 5,
            }}>
            {t('LiveShop:Full attention')}
          </Text>
          <Icon name="right" type="antdesign" color={Colors.more} size={adjustFontSize(15)} />
        </TouchableOpacity>
      </Box>
    </>
  );
};
SellerStreamHeader.propTypes = {
  sellerStreamList: PropTypes.arrayOf(PropTypes.object),
  onPressCategoryItem: PropTypes.func,
  onPressFilterItem: PropTypes.func,
  onNavigateFollowSellers: PropTypes.func,
};
SellerStreamHeader.defaultProps = {
  sellerStreamList: [],
  onPressCategoryItem: () => {},
  onPressFilterItem: () => {},
  onNavigateFollowSellers: () => {},
};
export default React.memo(SellerStreamHeader, (prevProps, nextProps) => {
  return prevProps.sellerStreamList?.length === nextProps.sellerStreamList?.length;
});

const styles = StyleSheet.create({
  streamerScrollView: {
    marginTop: 12,
    marginBottom: 15,
  },
});
