import React, { useState, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  StatusBar,
  Platform,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { Icon, Text, Image, Button } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import getSymbolFromCurrency from 'currency-symbol-map';
import { useQuery, useLazyQuery, useMutation, NetworkStatus } from '@apollo/client';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Box, HStack, Center } from 'native-base';
import { LinearTextGradient } from 'react-native-text-gradient';
import Collapsible from 'react-native-collapsible';

//= ==custom components & containers  =======
import { FocusAwareStatusBar, NormalHeaderContainer, JitengPressable } from '@components';
//= ======Query ====================
import { useSettingContext } from '@contexts/SettingContext';

import { FETCH_PRODUCT_PREVIEWS } from '@modules/product/graphql';
import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { Colors, Fonts } from '@theme';
import Images from '@assets/images';

import {
  RootBox,
  CenterBox,
  FullHorizontalScrollView,
  HorizontalGradient,
} from '@src/common/StyledComponents';

const HeaderHeight = hp(44);

const CardSize = getAdjustSize({ width: 115, height: 138 });
const PhotoSize = getAdjustSize({ width: 86, height: 82 });
const EmptyPhotoSize = getAdjustSize({ width: 37, height: 30 });

const ProductItem = React.memo(
  ({ item }) => {
    if (item?.isEmpty) {
      return <Card empty />;
    }
    return (
      <Card>
        {item?.thumbnail?.url ? (
          <Photo source={{ uri: item?.thumbnail?.url }} />
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
const EventPanel = ({ title, onLayout, categoryId, themId, onPressItem, currency }) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const { userCurrencyISO, userLanguage } = useSettingContext();
  const [fetchProducts, { data: productData }] = useLazyQuery(FETCH_PRODUCT_PREVIEWS, {
    fetchPolicy: 'network-only',
    variables: {
      category: [categoryId],
      theme: themId,
      skip: 0,
      limit: 6,
      currency,
      language: userLanguage,
    },
  });
  const productList = useMemo(() => {
    if (!productData) {
      return [];
    } else {
      return productData?.products?.collection || [];
    }
  }, [productData]);
  useEffect(() => {
    if (categoryId && themId) {
      fetchProducts();
    }
    return () => {};
  }, [categoryId, fetchProducts, themId]);
  //= ======== State Section========
  const keyExtractor = useCallback(item => item.id, []);
  const eventList = useMemo(() => {
    const isThird = productList.length % 3;
    if (isThird === 0) {
      return productList;
    } else {
      return _.concat(
        productList,
        Array(3 - isThird)
          .fill('')
          .map((item, i) => ({
            id: uuidv4(),
            isEmpty: true,
          })),
      );
    }
  }, [productList]);
  const renderItem = useCallback(({ item }) => {
    return <ProductItem item={item} />;
  }, []);
  if (eventList.length === 0) {
    return (
      <Box alignItems="center" width="100%" justifyContent="center" onLayout={onLayout}>
        <TitlePhoto source={Images.eventDividerImg}>
          <TitleText>{title}</TitleText>
        </TitlePhoto>
      </Box>
    );
  }

  return (
    <Box alignItems="center" width="100%" justifyContent="center" onLayout={onLayout}>
      <TitlePhoto source={Images.eventDividerImg}>
        <TitleText>{title}</TitleText>
      </TitlePhoto>
      <FullHorizontalScrollView>
        <FlatList
          data={eventList}
          renderItem={renderItem}
          extraData={eventList.length}
          keyExtractor={keyExtractor}
          numColumns={3}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ justifyContent: 'space-evenly', marginTop: 8 }}
          removeClippedSubviews={true} // Unmount components when outside of window
          initialNumToRender={1} // Reduce initial render amount
          maxToRenderPerBatch={1} // Reduce number in each render batch
          updateCellsBatchingPeriod={250} // Increase time between renders
          windowSize={3} // Reduce the window size
        />
      </FullHorizontalScrollView>
      <CenterBox full hPadding>
        <MoreButton
          title={t('common:More products')}
          icon={
            <Icon
              name="right"
              type="antdesign"
              color={Colors.white}
              size={adjustFontSize(17)}
              containerStyle={{
                alignSelf: 'flex-end',
              }}
            />
          }
          iconRight
          onPress={() => {
            onPressItem(categoryId);
          }}
        />
      </CenterBox>
    </Box>
  );
};
EventPanel.propTypes = {
  onLayout: PropTypes.func,
  title: PropTypes.string,
  categoryId: PropTypes.string,
  themId: PropTypes.string,
  onPressItem: PropTypes.func,
  currency: PropTypes.string,
};
EventPanel.defaultProps = {
  onLayout: () => {},
  onPressItem: () => {},
  title: '',
  categoryId: null,
  themId: null,
  currency: 'CNY',
};
export default React.memo(EventPanel, (prevProps, nextProps) => {
  return prevProps.title === nextProps.title && prevProps.currency === nextProps.currency;
});

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#F5FCFF',
    height: HeaderHeight,
    padding: 10,
    width: 150,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
  },
});
const Card = styled.View`
  align-items: center;

  background-color: ${props => (props.empty ? 'transparent' : Colors.white)};
  border-radius: 5px;
  height: ${parseInt(CardSize.height, 10)}px;
  justify-content: center;
  width: ${parseInt(CardSize.width, 10)}px;
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
const TitlePhoto = styled(ImageBackground)`
  align-items: center;
  height: ${wp(41)}px;
  justify-content: center;
  margin-bottom: 5px;
  margin-top: 5px;
  width: ${wp(322)}px;
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

  text-shadow: 0px 4px 3px rgba(53, 29, 150, 0.5);
`;
const MoreButton = styled(Button).attrs({
  containerStyle: {
    width: '80%',
    marginVertical: 10,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    height: hp(36),
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    borderColor: Colors.white,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleStyle: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(15),
    lineHeight: adjustFontSize(20),

    color: Colors.white,
    // backgroundColor: 'red',
  },
})``;
