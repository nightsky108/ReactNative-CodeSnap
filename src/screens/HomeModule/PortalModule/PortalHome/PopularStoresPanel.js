import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, StatusBar, Platform, View, ImageBackground, FlatList } from 'react-native';
import { Icon, Text, Image } from 'react-native-elements';
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
import { FullButtonElement } from '@src/common/StyledComponents';
import _ from 'lodash';

const faker = require('faker');

faker.locale = 'zh_CN';

const BannerSize = getAdjustSize({ width: 344, height: 109 });

const CardItemSize = getAdjustSize({ width: 167, height: 167 });

const TitleText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: 19px;
  letter-spacing: -0.41px;
  line-height: 22px;
`;
const CardItemContainer = styled(ImageBackground)`
  align-items: flex-start;
  border-radius: ${parseInt(wp(12), 10)}px;
  height: ${parseInt(CardItemSize.height, 10)}px;
  justify-content: flex-end;
  margin-right: 8px;
  overflow: hidden;
  width: ${parseInt(CardItemSize.width, 10)}px;
`;
const BannerImage = styled(Image).attrs({
  containerStyle: {
    width: BannerSize.width,
    height: BannerSize.height,
    borderRadius: wp(10),
    overflow: 'hidden',
  },
})``;

const UserImage = styled(Image).attrs({
  containerStyle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 5,
  },
})``;
export const ContainerGradient = styled(LinearGradient).attrs({
  colors: ['rgba(0, 0, 0, 0.0001)', `rgba(0, 0, 0, 0.87)`],
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 },
})`
  flex: 1;
  width: 100%;
  justify-content: flex-end;
`;
const StoreInfoContainer = styled(View).attrs()`
  width: 100%;
  // align-items: center;
  justify-content: flex-start;
  flex-shrink: 1;
`;
const NameText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  line-height: 16px;
  margin-bottom: 5px;
`;
const LocationTxt = styled(Text)`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 10px;
  letter-spacing: 0.31px;
  line-height: 19px;
`;

const StoreCard = React.memo(
  ({ store }) => {
    const { t, i18n } = useTranslation();

    return (
      <JitengPressable>
        <CardItemContainer source={{ uri: store?.photo?.url }}>
          <ContainerGradient>
            <Box
              flexDirection="row"
              width="100%"
              justifyContent="space-between"
              alignItems="center"
              paddingX={4}
              marginY={3}>
              <UserImage source={{ uri: store?.owner?.photo?.url }} />

              <StoreInfoContainer>
                <NameText numberOfLines={1}>{store?.name || ''}</NameText>
                <LocationTxt numberOfLines={1}>{store?.address?.city}</LocationTxt>
              </StoreInfoContainer>
            </Box>
          </ContainerGradient>
        </CardItemContainer>
      </JitengPressable>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.store?.id === nextProps.store?.id;
  },
);
const PopularStoresPanel = ({ stores, banner }) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const keyExtractor = useCallback(item => item.id, []);

  //= ======== State Section========
  return (
    <Box width="100%">
      <TitleText>{t('home:Discover popular stores')}</TitleText>

      <Box width="100%" marginY={3}>
        <JitengPressable>
          <BannerImage source={Images.hotShopImg} />
        </JitengPressable>
      </Box>
      <Box width="100%">
        <FlatList
          data={stores}
          renderItem={({ item }) => <StoreCard store={item} />}
          extraData={stores.length}
          horizontal
          keyExtractor={keyExtractor}
          showsHorizontalScrollIndicator={false}
        />
      </Box>
    </Box>
  );
};
PopularStoresPanel.propTypes = {
  stores: PropTypes.arrayOf(PropTypes.object),
  banner: PropTypes.objectOf(PropTypes.object),
};
PopularStoresPanel.defaultProps = {
  stores: [],
  banner: null,
};
export default React.memo(PopularStoresPanel);

const styles = StyleSheet.create({});
