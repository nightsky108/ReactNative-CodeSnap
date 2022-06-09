import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Image,
  FlatList,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ActionSheetIOS,
} from 'react-native';
import PropTypes from 'prop-types';

import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

//= ==third party plugins=======
import { useDispatch } from 'react-redux';
import styled from 'styled-components/native';
import { v4 as uuidv4 } from 'uuid';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-community/masked-view';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import ModalSelector from 'react-native-modal-selector';
import { Icon, Input, Button } from 'react-native-elements';
// import { v4 as uuidv4 } from 'uuid';
import { Box, HStack, Center, Text, Pressable } from 'native-base';
import { useTranslation } from 'react-i18next';
import Collapsible from 'react-native-collapsible';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from '@alessiocancian/react-native-actionsheet';
import _ from 'lodash';
import * as globals from '@utils/global';
import FastImage from 'react-native-fast-image';
import Autocomplete from 'react-native-autocomplete-input';
import { ActionSheet as CrossActionSheet } from 'react-native-cross-actionsheet';

// import Spinner from 'react-native-loading-spinner-overlay';

//= ==custom components & containers  =======
import { Content, Container, JitengHeaderContainer, ErrorView } from '@components';

//= ======selectors==========================

//= ======reducer actions====================

//= ==========Query=======================
import { SEARCH_BRAND, ADD_BRAND } from '@modules/product/graphql';
//= =========context===============================
import { useSettingContext } from '@contexts/SettingContext';

//= =============utils==================================
import * as constants from '@utils/constant';
//= =======Hook data=============================
import { useTopProductCategories } from '@data/useProductCategories';
import { useSupportedCurrencies, useShippingBoxes } from '@data/useAssets';
import { useOrganization } from '@data/useUser';

//= =============styles==================================
import { Colors, Metrics, Fonts } from '@theme';
import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
// import { StyleSheetFactory } from './styles';

const assetPreviewSize = getAdjustSize({ width: 114, height: 114 });
function propsAreEqual(prev, next) {
  return prev.asset?.id === next.asset?.id && prev.marked === next.marked;
}
const AssetPreview = React.memo(
  ({ asset, marked = false, onPressAssetItem = () => {}, onPressRemoveItem = () => {} }) => {
    return (
      <>
        {asset.id === 'button' ? (
          <AssetContainer>
            <TouchableOpacity
              onPress={() => onPressAssetItem(asset?.id)}
              style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
              <Icon name="plus" type="entypo" color={Colors.white} size={wp(50)} />
            </TouchableOpacity>
          </AssetContainer>
        ) : (
          <AssetContainer marked={marked}>
            <TouchableOpacity
              onPress={() => onPressAssetItem(asset?.id)}
              style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
              <AssetImage source={{ uri: asset.url }}>
                <LinearGradient
                  start={{ x: 0.0, y: 0.25 }}
                  end={{ x: 0.5, y: 1.0 }}
                  colors={['rgba(0,0,0,0.00)', 'rgba(0,0,0,0.2)']}
                  style={{ flex: 1 }}
                />
              </AssetImage>
            </TouchableOpacity>
            <View style={{ position: 'absolute', right: 5, top: 5, zIndex: 999 }}>
              <TouchableOpacity onPress={() => onPressRemoveItem(asset?.id)}>
                <ShadowText>
                  <Icon name="close" type="antdesign" color={Colors.white} size={wp(25)} />
                </ShadowText>
              </TouchableOpacity>
            </View>
          </AssetContainer>
        )}
      </>
    );
  },
  propsAreEqual,
);
export default AssetPreview;
AssetPreview.propTypes = {
  asset: PropTypes.shape({}),
  onPressAssetItem: PropTypes.func,
  onPressRemoveItem: PropTypes.func,
  marked: PropTypes.bool,
};
AssetPreview.defaultProps = {
  asset: null,
  onPressAssetItem: () => {},
  onPressRemoveItem: () => {},
  marked: false,
};
const AssetContainer = styled.View`
  background-color: ${Colors.grey4};
  border-color: ${props => (props.marked ? Colors.priceRed : Colors.grey4)};
  border-radius: 6px;
  border-width: ${props => (props.marked ? 5 : 0)}px;
  height: ${assetPreviewSize.height}px;
  overflow: hidden;
  width: ${assetPreviewSize.width}px;
`;
const AssetImage = styled(FastImage)`
  background-color: ${Colors.grey4};
  height: ${assetPreviewSize.height}px;
  width: ${assetPreviewSize.width}px;
`;
const ShadowText = styled(Text)`
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
  elevation: 5;
`;
