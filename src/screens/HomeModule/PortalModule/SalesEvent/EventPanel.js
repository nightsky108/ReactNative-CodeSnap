import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  StatusBar,
  Platform,
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { Icon, Text, Image, Button } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import getSymbolFromCurrency from 'currency-symbol-map';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Box, HStack, Center } from 'native-base';
import { LinearTextGradient } from 'react-native-text-gradient';
import Collapsible from 'react-native-collapsible';

//= ==custom components & containers  =======
import { FocusAwareStatusBar, NormalHeaderContainer, JitengPressable } from '@components';

import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { Colors, Fonts } from '@theme';
import Images from '@assets/images';

import {
  RootBox,
  CenterBox,
  FullHorizontalScrollView,
  HorizontalGradient,
} from '@src/common/StyledComponents';

const BannerBackGrounds = [
  Images.saleBannerPinkImg,
  Images.saleBannerGreenImg,
  Images.saleBannerIndigoImg,
  Images.saleBannerRedImg,
  Images.saleBannerBlueImg,
  Images.saleBannerPurpleImg,
];

const BannerSize = getAdjustSize({ width: 351, height: 75 });
const CardSize = getAdjustSize({ width: 117, height: 140.25 });
const PhotoSize = getAdjustSize({ width: 86, height: 82 });
const EmptyPhotoSize = getAdjustSize({ width: 37, height: 30 });

const ContainerBox = styled(CenterBox)`
  background-color: ${Colors.white};
  border-radius: 11px;
  margin-top: ${hp(10)}px;
  width: ${BannerSize.width}px;
`;

const TitlePhoto = styled(ImageBackground)`
  align-items: center;
  flex-direction: row;
  height: ${BannerSize.height}px;
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 10px;

  width: ${BannerSize.width}px;
`;
const Card = styled.View`
  align-items: center;
  height: ${CardSize.height}px;
  justify-content: center;
  overflow: hidden;
  width: ${CardSize.width}px;
`;
const Photo = styled(Image)`
  align-items: center;
  height: ${parseInt(PhotoSize.height, 10)}px;
  justify-content: center;
  width: ${parseInt(PhotoSize.width, 10)}px;
`;
const EmptyPhotoView = styled(View)`
  align-items: center;
  background-color: ${Colors.grey5};
  height: ${parseInt(PhotoSize.height, 10)}px;
  justify-content: center;
  width: ${parseInt(PhotoSize.width, 10)}px;
`;
const EmptyPhoto = styled.Image`
  align-items: center;
  height: ${parseInt(EmptyPhotoSize.height, 10)}px;
  justify-content: center;
  width: ${parseInt(EmptyPhotoSize.width, 10)}px;
`;

const ItemTitleText = styled(Text)`
  align-self: center;
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: 8px;
  line-height: 18px;
  text-align: center;
`;
const ItemCostText = styled(Text)`
  align-self: center;
  color: ${Colors.filterNotiRed};
  font-family: 'Microsoft YaHei';
  font-size: 13px;
  letter-spacing: -0.41px;
  line-height: 22px;
`;
const ItemCostSymbolText = styled(Text)`
  align-self: center;
  color: ${Colors.filterNotiRed};
  font-family: 'Microsoft YaHei';
  font-size: 9px;
  letter-spacing: -0.41px;
  line-height: 22px;
`;
const TitleText = styled(Text)`
  color: ${Colors.white};
  elevation: 5;
  font-family: 'Microsoft YaHei';
  font-size: 20px;
  font-weight: bold;
  line-height: 26px;

  text-shadow: 0px 2px 3px rgba(106, 32, 0, 0.4);
`;
const MoreButton = styled(Button).attrs({
  containerStyle: {
    marginVertical: 10,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    height: hp(30),
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 15,
    borderColor: Colors.white,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
  },
  titleStyle: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(12),
    lineHeight: adjustFontSize(15.84),
    color: Colors.white,
    // backgroundColor: 'red',
  },
})``;
const ProductItem = React.memo(
  ({ item }) => {
    if (item?.isEmpty) {
      return <Card empty />;
    }
    const photoUrl = item?.thumbnail ? item?.thumbnail?.url : item?.assets[0].url;
    return (
      <Card>
        {photoUrl ? (
          <Photo source={{ uri: photoUrl }} />
        ) : (
          <EmptyPhotoView>
            <EmptyPhoto source={Images.emptyImg} />
          </EmptyPhotoView>
        )}
        <ItemTitleText numberOfLines={1}>{item?.description}</ItemTitleText>
        <ItemCostText>
          <ItemCostSymbolText>{getSymbolFromCurrency(item?.price?.currency)}</ItemCostSymbolText>
          {parseInt(item?.price?.amount / 100, 10)}.
          <ItemCostSymbolText>{item?.price?.amount % 100}</ItemCostSymbolText>
        </ItemCostText>
      </Card>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.item?.id === nextProps.item?.id;
  },
);
const EventPanel = ({ events, title, index, onPressItem, categoryId }) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  //= ======== State Section========
  const keyExtractor = useCallback(item => item.id, []);

  const eventList = useMemo(() => {
    const isThird = events.length % 3;
    if (isThird === 0) {
      return events;
    } else {
      return _.concat(
        events,
        Array(3 - isThird)
          .fill('')
          .map((item, i) => ({
            id: uuidv4(),
            isEmpty: true,
          })),
      );
    }
  }, [events]);
  const renderItem = useCallback(({ item }) => {
    return <ProductItem item={item} />;
  }, []);

  return (
    <ContainerBox>
      <TitlePhoto source={BannerBackGrounds[index % BannerBackGrounds.length]}>
        <TitleText>{title}</TitleText>
        <MoreButton
          title={t('common:All')}
          icon={
            <Icon name="right" type="antdesign" color={Colors.white} size={adjustFontSize(15)} />
          }
          iconRight
          onPress={() => {
            onPressItem(categoryId);
          }}
        />
      </TitlePhoto>

      <FlatList
        data={eventList}
        renderItem={renderItem}
        extraData={eventList.length}
        keyExtractor={keyExtractor}
        numColumns={3}
        style={styles.listPanel}
        showsVerticalScrollIndicator={false}
      />
    </ContainerBox>
  );
};
EventPanel.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object),
  index: PropTypes.number,
  title: PropTypes.string,
  onPressItem: PropTypes.func,
  categoryId: PropTypes.string,
};
EventPanel.defaultProps = {
  onPressItem: () => {},
  events: [],
  index: 0,
  title: '',
  categoryId: '',
};
export default React.memo(EventPanel, (prevProps, nextProps) => {
  return prevProps.title === nextProps.title;
});
const styles = StyleSheet.create({
  listPanel: {
    borderBottomLeftRadius: 11,
    borderBottomRightRadius: 11,
    overflow: 'hidden',
    backgroundColor: Colors.green,
  },
});
