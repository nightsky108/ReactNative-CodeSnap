import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  StatusBar,
  Platform,
  Dimensions,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { Box } from 'native-base';
import { Icon, Text, ListItem, Button } from 'react-native-elements';
import Video from 'react-native-video';
import { useTranslation } from 'react-i18next';
import DashedLine from 'react-native-dashed-line';
import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';

import LinearGradient from 'react-native-linear-gradient';
import PageControl from 'react-native-page-control';
import StepIndicator from 'react-native-step-indicator';

import { TopBannerImgStyle } from '@common/GlobalStyles';
import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { FocusAwareStatusBar, TopBannerImage } from '@components';
import { RowBox, RowCenter, FullHorizontalScrollView } from '@src/common/StyledComponents';
import { Colors, Fonts } from '@theme';
import * as constants from '@utils/constant';
import Images from '@assets/images';
import { ScrollView } from 'react-native-gesture-handler';
import * as globals from '@utils/global';

const IconSize = 25;
const { width: screenWidth } = Dimensions.get('window');
const CardSize = getAdjustSize({ width: 111.74, height: 184.43 });
const EmptyPhotoSize = getAdjustSize({ width: 37, height: 30 });
const PhotoSize = getAdjustSize({ width: 111.74, height: 112 });
const ProductItem = React.memo(
  ({ item }) => {
    if (item?.isEmpty) {
      return <Card empty />;
    }
    const { thumbnail, title, assets, price } = item;
    const asset = thumbnail || (assets.length > 0 ? assets[0] : null);
    return (
      <Card>
        {asset ? (
          <Photo source={{ uri: asset?.url }} resizeMode="contain" />
        ) : (
          <EmptyPhotoView>
            <EmptyPhoto source={Images.emptyImg} />
          </EmptyPhotoView>
        )}
        <ItemTitleText numberOfLines={2}>{title}</ItemTitleText>
        <ItemCostText>{price?.formatted}.</ItemCostText>
      </Card>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.item?.id === nextProps.item?.id;
  },
);
const SellerProductList = ({ products }) => {
  //= ======== State Section========
  const [currentPage, setCurrentPage] = useState(-1);
  const { t, i18n } = useTranslation();
  const keyExtractor = useCallback(item => item.id, []);
  const productList = useMemo(() => {
    return globals.getMatchedColsData({ data: products });
  }, [products]);
  const renderItem = useCallback(({ item }) => {
    return <ProductItem item={item} />;
  }, []);
  return (
    <Box width="100%" marginY="10px">
      <Box width="100%" marginY="5px" flexDirection="row" justifyContent="space-between">
        <TitleText>{t('productDetail:Shop recommendation')}</TitleText>
        <MoreButton>
          <MoreButtonText>{t('productDetail:view all')}</MoreButtonText>
          <Icon
            name="right"
            type="antdesign"
            color={Colors.signUpStepRed}
            size={adjustFontSize(15)}
          />
        </MoreButton>
      </Box>
      <FullHorizontalScrollView>
        <FlatList
          data={productList}
          renderItem={renderItem}
          extraData={productList.length}
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
          // nestedScrollEnabled={true}
        />
      </FullHorizontalScrollView>
    </Box>
  );
};
SellerProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object),
};
SellerProductList.defaultProps = {
  products: [],
};
// 冯琳
export default React.memo(SellerProductList);

const styles = StyleSheet.create({});

const TitleText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(13)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(22.94)}px;
  text-align: left;
`;

const MoreButton = styled.TouchableOpacity`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;
const MoreButtonText = styled.Text`
  color: ${Colors.signUpStepRed};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(21.18)}px;
  margin-left: ${wp(11.08)}px;
  margin-right: ${wp(11.08)}px;
  text-align: left;
`;
const Card = styled.TouchableOpacity`
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
const ItemTitleText = styled(Text)`
  align-self: flex-start;
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  line-height: 18.3px;
  text-align: left;
`;
const ItemCostText = styled(Text)`
  align-self: flex-start;
  color: ${Colors.priceRed};
  font-family: 'Microsoft YaHei';
  font-size: 15px;
  line-height: 26.47px;
  text-align: left;
`;
