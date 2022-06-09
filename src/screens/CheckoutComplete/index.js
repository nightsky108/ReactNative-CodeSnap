import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View,
  ActivityIndicator,
  ScrollView,
  InteractionManager,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

//= ==third party plugins=======
import { useDispatch } from 'react-redux';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import { Box } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';

import { Text, Icon, Badge } from 'react-native-elements';
// import { v4 as uuidv4 } from 'uuid';
// import { Box, HStack, Center } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useQuery, useApolloClient, NetworkStatus } from '@apollo/client';
import getSymbolFromCurrency from 'currency-symbol-map';

// import Spinner from 'react-native-loading-spinner-overlay';

//= ==custom components & containers  =======
import { Content, Container, JitengStatusBar } from '@components';

//= ======selectors==========================

//= ======reducer actions====================
//= =====context data================================

import { useSettingContext } from '@contexts/SettingContext';

//= ======Query ====================

import {
  FETCH_PRODUCT_PREVIEWS,
  FETCH_PRODUCTS_RECOMMENDED_TOME_PREVIEWS,
} from '@modules/product/graphql';
//= =============utils==================================
import * as constants from '@utils/constant';

//= =============styles==================================
import { Colors, Metrics, Fonts } from '@theme';
import { wp, hp, adjustFontSize, getAdjustSize } from '@src/common/responsive';
import { RowBox, RowCenter, FullHorizontalScrollView } from '@src/common/StyledComponents';

import Images from '@assets/images';
import { styles } from './styles';

// import { StyleSheetFactory } from './styles';

// AssetType
//= =============images & constants ===============================
//= ============import end ====================
const CardSize = getAdjustSize({ width: 167, height: 251 });
const EmptyPhotoSize = getAdjustSize({ width: 37, height: 30 });
const PhotoSize = getAdjustSize({ width: 167, height: 170 });
const ProductItem = React.memo(
  ({ item }) => {
    if (item?.isEmpty) {
      return <Card empty />;
    }
    const { thumbnail, title, assets, price, oldPrice } = item;
    const asset = thumbnail || (assets.length > 0 ? assets[0] : null);
    return (
      <Card>
        {asset ? (
          <Photo source={{ uri: asset?.url }} />
        ) : (
          <EmptyPhotoView>
            <EmptyPhoto source={Images.emptyImg} />
          </EmptyPhotoView>
        )}
        <Box width="100%" px={3} flexGrow={1} py={1} justifyContent="center">
          <ItemTitleText numberOfLines={2}>{title}</ItemTitleText>
          <RowBox>
            <ItemCostText>
              <ItemCostSymbolText>{getSymbolFromCurrency(price?.currency)}</ItemCostSymbolText>
              {parseInt(price?.amount / 100, 10)}.
              <ItemCostSymbolText>{price?.amount % 100}</ItemCostSymbolText>
            </ItemCostText>
            <ItemOldCostText>{oldPrice?.formatted}</ItemOldCostText>
          </RowBox>
        </Box>
      </Card>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.item?.id === nextProps.item?.id;
  },
);
const PageHeader = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  //= ======== State Section========
  return (
    <Box
      flexDirection="row"
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      height={`${hp(44)}px`}
      paddingX={5}>
      <Box />
      <Title>{t('payment:payment successful')}</Title>
      <TouchableOpacity alignSelf="flex-end" alignItems="flex-end">
        <Badge
          value="99+"
          status="error"
          containerStyle={{ position: 'absolute', right: -12, top: 0 }}
        />
        <Icon name="dots-three-vertical" type="entypo" color={Colors.grey2} size={wp(18)} />
        <MoreText>{t('common:More')}</MoreText>
      </TouchableOpacity>
    </Box>
  );
};
PageHeader.propTypes = {};
PageHeader.defaultProps = {};

const HeaderContent = ({ totalCost, orderId }) => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  //= ======== State Section========
  return (
    <Box width="100%">
      <Box
        alignItems="center"
        width="100%"
        backgroundColor={Colors.white}
        borderRadius="11px"
        paddingY="6px">
        <Box flexDirection="row" justifyContent="flex-end">
          {/* <CheckoutAmountSymbol>Y</CheckoutAmountSymbol> */}
          <CheckoutAmount>{totalCost}</CheckoutAmount>
        </Box>
        <Box flexDirection="row" justifyContent="space-between" width="100%">
          <HeaderButton
            onPress={() => {
              if (orderId) {
                navigation.navigate('OrderStack', {
                  screen: 'PurchaseOrderDetail',
                  params: {
                    orderId,
                  },
                });
              }
            }}>
            <HeaderButtonText>{t('payment:check order')}</HeaderButtonText>
          </HeaderButton>
          <Box height="100%" width="1px" backgroundColor={Colors.grey3} />
          <HeaderButton
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'HomeBottomTab' }],
              });
            }}>
            <HeaderButtonText>{t('payment:Back to homepage')}</HeaderButtonText>
          </HeaderButton>
        </Box>
      </Box>
      <Box
        width="100%"
        justifyContent="center"
        flexDirection="row"
        marginY="15px"
        alignItems="center">
        <Box height="1px" width="50px" backgroundColor={Colors.signUpStepRed} marginRight="10px" />
        <CommentText>{t('home:you may also like')}</CommentText>
        <Box height="1px" width="50px" backgroundColor={Colors.signUpStepRed} marginLeft="10px" />
      </Box>
    </Box>
  );
};
HeaderContent.propTypes = {
  totalCost: PropTypes.string,
  orderId: PropTypes.string,
};
HeaderContent.defaultProps = {
  totalCost: '¥ 0.00',
  orderId: null,
};
const CheckoutComplete = ({ navigation, route }) => {
  //= ========Hook Init===========
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { userCurrencyISO, userLanguage } = useSettingContext();
  const [fetchingMore, setFetchingMore] = useState(false);
  const purchaseOrderId = route?.params?.purchaseOrderId;
  const totalCost = route?.params?.totalCost;
  const {
    loading,
    fetchMore,
    refetch: refetchProducts,
    networkStatus,
    data: productData,
  } = useQuery(FETCH_PRODUCTS_RECOMMENDED_TOME_PREVIEWS, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    nextFetchPolicy: 'cache-first',
    variables: {
      skip: 0,
      limit: 10,
      currency: userCurrencyISO,
      language: userLanguage,
    },
    onCompleted: data => {
      setFetchingMore(false);
    },
    onError: error => {
      setFetchingMore(false);
      console.log('fetch products error', error);
    },
  });
  const { productList, totalProductsCount } = useMemo(() => {
    if (!productData) {
      return { productList: [], totalProductsCount: 0 };
    } else {
      const {
        collection,
        pager: { total },
      } = productData.productsRecommendedToMe;
      return { productList: collection, totalProductsCount: total };
    }
  }, [productData]);
  const fetchMoreProducts = useCallback(() => {
    if (fetchingMore && productList.length >= totalProductsCount) {
      return;
    }
    setFetchingMore(true);
    fetchMore({
      variables: {
        skip: productList.length,
        limit: 10,
      },
    });
  }, [fetchMore, fetchingMore, productList.length, totalProductsCount]);
  const refreshing = networkStatus === NetworkStatus.refetch;
  // const styles = StyleSheetFactory({ theme });
  //= ========= Props Section========
  //= ======== State Section========

  //= ========= GraphQl query Section========
  //= ========= Use Effect Section========
  const keyExtractor = useCallback(item => item?.id, []);
  const onEndReachedCalledDuringMomentum = useRef(true);

  const onEndReached = ({ distanceFromEnd }) => {
    if (!onEndReachedCalledDuringMomentum.current && !fetchingMore && !loading) {
      fetchMoreProducts();
      onEndReachedCalledDuringMomentum.current = true;
    }
  };
  const onMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentum.current = false;
  };
  const renderItem = useCallback(({ item, index }) => {
    return <ProductItem item={item} />;
  }, []);
  const renderFooter = useCallback(() => {
    if (!fetchingMore) {
      return null;
    }
    return (
      <View style={styles.listFooter}>
        <ActivityIndicator animating size="large" color={Colors.loaderColor} />
      </View>
    );
  }, [fetchingMore]);
  return (
    <Container>
      <JitengStatusBar />
      <PageHeader />
      <HeaderContent totalCost={totalCost} orderId={purchaseOrderId} />
      {loading && !fetchingMore ? (
        <Content style={{ flex: 0 }} contentContainerStyle={{ flex: 1 }}>
          <ActivityIndicator color="black" size="large" style={{ flex: 1, alignSelf: 'center' }} />
        </Content>
      ) : (
        <Content
          contentContainerStyle={styles.contentContainerStyle}
          style={styles.contentView}
          isList={true}
          data={productList}
          renderItem={renderItem}
          extraData={productList.length}
          keyExtractor={keyExtractor}
          onEndReached={onEndReached}
          onMomentumScrollBegin={onMomentumScrollBegin}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{
            marginTop: hp(10),
            justifyContent: 'space-between',
          }}
          onRefresh={refetchProducts}
          refreshing={refreshing}
          ListFooterComponent={renderFooter}
          initialNumToRender={6}
          windowSize={5}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={30}
          removeClippedSubviews={false}
          onEndReachedThreshold={0.5}
        />
      )}
    </Container>
  );
};

export default CheckoutComplete;
const Card = styled.TouchableOpacity`
  //  align-items: center;
  background-color: white;
  border-radius: 5px;
  height: ${parseInt(CardSize.height, 10)}px;
  //  justify-content: flex-end;
  overflow: hidden;
  width: ${parseInt(CardSize.width, 10)}px;
`;
const Photo = styled(FastImage)`
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
  align-self: flex-start;
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  line-height: 18.3px;
  margin-bottom: 6px;
  text-align: left; ;
`;
const ItemCostText = styled(Text)`
  align-self: center;
  color: ${Colors.filterNotiRed};
  font-family: 'Microsoft YaHei';
  font-size: 16px;
  letter-spacing: -0.41px;
  line-height: 22px;
`;
const ItemCostSymbolText = styled(Text)`
  align-self: center;
  color: ${Colors.filterNotiRed};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  letter-spacing: -0.41px;
  line-height: 16px;
`;
const ItemOldCostText = styled(Text)`
  color: ${Colors.grey3};
  flex: 1;
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  letter-spacing: 0.21px;
  line-height: 16px;
  margin-left: 2px;
  text-decoration: line-through;
`;
const Title = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
`;
const MoreText = styled.Text`
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: 9px;
  font-weight: 400;
  line-height: 22px;
`;
const CheckoutAmount = styled.Text`
  color: ${Colors.discountPrice};
  font-family: 'Microsoft YaHei';
  font-size: 30px;
  font-weight: 400;
  line-height: 53px;
`;
const CheckoutAmountSymbol = styled.Text`
  color: ${Colors.discountPrice};
  font-family: 'Microsoft YaHei';
  font-size: 20px;
  font-weight: 400;
  line-height: 53px;
`;
const HeaderButton = styled.TouchableOpacity`
  align-self: center;
  flex-grow: 1;
`;
const HeaderButtonText = styled.Text`
  align-self: center;
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  font-weight: 400;
  line-height: 25px;
`;
const CommentText = styled.Text`
  color: ${Colors.signUpStepRed};
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  font-weight: 400;
  line-height: 25px;
`;
