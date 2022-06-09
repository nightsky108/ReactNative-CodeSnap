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
import { View, Dimensions, Alert } from 'react-native';

//= ==third party plugins=======
import { useDispatch } from 'react-redux';
import styled from 'styled-components/native';
import { Box, HStack, Center, Text, Pressable } from 'native-base';

// import { v4 as uuidv4 } from 'uuid';
// import { Box, HStack, Center } from 'native-base';
import { useTranslation } from 'react-i18next';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Icon, Input, Button } from 'react-native-elements';

// import Spinner from 'react-native-loading-spinner-overlay';

//= ==custom components & containers  =======
import { Content, Container, JitengHeaderContainer, PhotoView } from '@components';
//= =======Hook data=============================

import { useOrganization } from '@data/useUser';
//= ======selectors==========================

//= ======reducer actions====================

//= ==========apis=======================

//= =============utils==================================
import * as constants from '@utils/constant';
//= =====hook data================================
import { useProductList } from '@data/useProduct';
//= =============styles==================================
import { Colors, Metrics, Fonts } from '@theme';
import { wp, hp, adjustFontSize, getAdjustSize } from '@src/common/responsive';
import { styles } from './styles';
// import { StyleSheetFactory } from './styles';

// AssetType
//= =============images & constants ===============================
//= ============import end ====================

const EmptyPhotoSize = getAdjustSize({ width: 37, height: 30 });
const PhotoSize = getAdjustSize({ width: 90, height: 90 });

function ProductItem({ product, onPressItem }) {
  const { thumbnail, assets, description, price } = product;
  const asset = thumbnail?.url || (assets.length > 0 ? assets[0]?.url : null);
  return (
    <TouchableOpacity
      onPress={() => {
        onPressItem(product.id);
      }}>
      <Box
        width="100%"
        py="13px"
        px="10px"
        flexDirection="row"
        alignItems="center"
        borderBottomColor={Colors.grey4}
        borderBottomWidth="1px">
        <PhotoView uri={asset} photoSize={PhotoSize} emptyPhotoSize={EmptyPhotoSize} />

        <Box flexGrow={1} flex={1} paddingX="18px">
          <Text
            color={Colors.grey2}
            fontFamily="Microsoft YaHei"
            fontWeight="400"
            lineHeight="18px"
            fontSize="13px"
            numberOfLines={2}>
            {description}
          </Text>
          <Text
            color={Colors.black}
            fontFamily="Microsoft YaHei"
            fontWeight="400"
            lineHeight="28px"
            fontSize="16px">
            {price.formatted}
          </Text>
        </Box>
        <Icon name="right" type="antdesign" color={Colors.grey14} size={wp(22)} />
      </Box>
    </TouchableOpacity>
  );
}
const ProductCard = React.memo(ProductItem, (prevProps, nextProps) => {
  return prevProps.product?.id === nextProps.product?.id;
});
const SellerProductList = ({ navigation, route }) => {
  //= ========Hook Init===========
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { organization } = useOrganization();
  const onEndReachedCalledDuringMomentum = useRef(true);
  const {
    products,
    totalProductCount,
    loading,
    fetchMoreProducts,
    fetchingMoreProducts,
    refreshing,
    refetch,
  } = useProductList({ isSellerProduct: true });
  const keyExtractor = useCallback(item => item?.id, []);
  const onEndReached = ({ distanceFromEnd }) => {
    if (!onEndReachedCalledDuringMomentum.current && !fetchingMoreProducts) {
      fetchMoreProducts();
      onEndReachedCalledDuringMomentum.current = true;
    }
  };
  const onMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentum.current = false;
  };
  useEffect(() => {
    if (route?.params?.refetch) {
      // refetch();
    }
    return () => {};
  }, [route?.params]);
  // const styles = StyleSheetFactory({ theme });
  //= ========= Props Section========
  //= ======== State Section========

  //= ========= GraphQl query Section========
  //= ========= Use Effect Section========
  const onCallAddProduct = () => {
    if (!organization) {
      Alert.alert(
        'Warning!',
        'Organization Information is not registered yet.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('SellerInfoDetail');
            },
          },
        ],
        { cancelable: false },
      );
      return;
    }

    navigation.navigate('ManageProduct');
  };
  const gotoEditScreen = productId => {
    navigation.navigate('ManageProduct', { productId });
  };

  const renderItem = useCallback(({ item, index }) => {
    return <ProductCard product={item} onPressItem={gotoEditScreen} />;
  }, []);
  return (
    <Container>
      <JitengHeaderContainer
        gradientColors={[Colors.white, Colors.white]}
        barStyle="dark-content"
        statusBarBackgroundColor={Colors.white}>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          paddingX={`${wp(15)}px`}
          width="100%">
          <Box flexDirection="row">
            <BackButton>
              <Icon name="left" type="antdesign" color={Colors.grey14} size={wp(22)} />
            </BackButton>
            <HeaderText>添加商品</HeaderText>
          </Box>
          <Box flexDirection="row">
            <ActionButton onPress={onCallAddProduct}>
              <Icon name="plussquare" type="antdesign" color={Colors.grey14} size={wp(22)} />
              <ActionButtonText>添加商品</ActionButtonText>
            </ActionButton>
            <ActionButton>
              <Icon name="dots-three-vertical" type="entypo" color={Colors.grey14} size={wp(22)} />
              <ActionButtonText>刪除</ActionButtonText>
            </ActionButton>
          </Box>
        </Box>
      </JitengHeaderContainer>
      <Content
        contentContainerStyle={styles.contentContainerStyle}
        style={styles.contentView}
        isList={true}
        data={products}
        renderItem={renderItem}
        extraData={products.length}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onRefresh={fetchingMoreProducts}
        refreshing={refreshing}
      />
    </Container>
  );
};

export default SellerProductList;
const HeaderText = styled.Text`
  align-self: center;
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  font-weight: 400;
  letter-spacing: -0.41px;
  line-height: 22px;
`;
const BackButton = styled(TouchableOpacity)`
  padding-right: 5px;
`;

const ActionButton = styled(TouchableOpacity)`
  padding-left: 5px;
`;
const ActionButtonText = styled.Text`
  align-self: center;
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: 13px;
  font-weight: 400;
  line-height: 17px;
`;

const DeleteButton = styled(TouchableOpacity)`
  padding-left: 5px;
`;
const DeleteButtonText = styled.Text`
  align-self: center;
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: 13px;
  font-weight: 400;
  line-height: 17px;
`;
