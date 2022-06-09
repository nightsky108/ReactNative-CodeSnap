import React, { useEffect, useState, useContext, useRef, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, StatusBar, Platform, Keyboard, View } from 'react-native';
import { Colors, Fonts } from '@theme';
import { Header, Input, Button, Icon, CheckBox } from 'react-native-elements';
import { wp, hp, adjustFontSize } from '@src/common/responsive';
import { FocusAwareStatusBar, NormalHeaderContainer, ErrorView } from '@components';
import styled from 'styled-components/native';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useRegion } from '@data/useUser';
import { useNavigation, useRoute } from '@react-navigation/native';
import ModalSelector from 'react-native-modal-selector';
import { Box, HStack, Pressable, Text } from 'native-base';
import * as constants from '@utils/constant';
import { TouchableOpacity, FlatList, ScrollView } from 'react-native-gesture-handler';
import { useShippingBoxes } from '@data/useAssets';

function ShippingBox({ item, onPressItem, isActive }) {
  const { id, width, height, length } = item;
  return (
    <>
      <CheckBox
        containerStyle={{ justifyContent: 'space-around' }}
        textStyle={{ flex: 1 }}
        title={`${width} x ${height} x ${length} 寸`}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        onPress={() => {
          onPressItem(id);
        }}
        checked={isActive}
      />
    </>
  );
}
ShippingBox.propTypes = {
  item: PropTypes.shape({}),
  onPressItem: PropTypes.func,
  isActive: PropTypes.bool,
};
ShippingBox.defaultProps = {
  item: {},
  onPressItem: () => {},
  isActive: false,
};
const ShippingBoxSection = ({
  onSelectShippingBoxItem = () => {},
  shippingBoxItems,
  activeShipBoxId = null,
}) => {
  const regions = useRegion();
  const navigation = useNavigation();
  const keyExtractor = useCallback(item => item.id, []);
  //= ======== State Section========

  const renderShippingBoxItem = useCallback(
    ({ item, index }) => {
      return (
        <ShippingBox
          item={item}
          onPressItem={onSelectShippingBoxItem}
          isActive={item?.id === activeShipBoxId}
        />
      );
    },
    [activeShipBoxId],
  );
  return (
    <>
      <Text
        color={Colors.grey1}
        fontFamily="Microsoft YaHei"
        fontWeight="400"
        my="5px"
        lineHeight="15px"
        fontSize="11px">
        选择商品大小
      </Text>
      <Text
        color={Colors.grey3}
        fontFamily="Microsoft YaHei"
        fontWeight="400"
        my="5px"
        lineHeight="15px"
        fontSize="11px">
        请选择下面适合商品尺寸的运输盒
      </Text>
      <ScrollView horizontal contentContainerStyle={{ flex: 1, height: 200 }}>
        <FlatList
          data={shippingBoxItems}
          renderItem={renderShippingBoxItem}
          extraData={shippingBoxItems.length}
          scrollEnabled={true}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    </>
  );
};
ShippingBoxSection.propTypes = {
  onSelectShippingBoxItem: PropTypes.func,
  shippingBoxItems: PropTypes.arrayOf(PropTypes.object),
  activeShipBoxId: PropTypes.string,
};
ShippingBoxSection.defaultProps = {
  onSelectShippingBoxItem: () => {},
  shippingBoxItems: [],
  activeShipBoxId: null,
};
export default React.memo(ShippingBoxSection);

const styles = StyleSheet.create({
  titleStyle: {
    ...Fonts.title,
    color: Colors.black,
    fontWeight: '400',
  },
  deleteButton: {
    backgroundColor: Colors.grey5,
    width: wp(150),
    height: hp(36),
    borderRadius: 10,
    marginRight: 10,
  },
  deleteButtonTitle: {
    fontFamily: 'Microsoft YaHei',
    color: Colors.grey2,
    fontSize: adjustFontSize(13),
    lineHeight: adjustFontSize(17),
  },
  saveButton: {
    marginLeft: 10,
    backgroundColor: Colors.signUpStepRed,
    width: wp(150),
    height: hp(36),
    borderRadius: 10,
  },
  saveButtonTitle: {
    fontFamily: 'Microsoft YaHei',
    color: Colors.white,
    fontSize: adjustFontSize(13),
    lineHeight: adjustFontSize(17),
  },
  checkBoxTitle: {
    fontFamily: 'Microsoft YaHei',
    color: Colors.grey2,
    fontSize: adjustFontSize(11),
    lineHeight: adjustFontSize(20),
  },
});
const InputElement = styled(Input).attrs({
  inputContainerStyle: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 5,
    height: hp(40),
  },
  containerStyle: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  errorStyle: {
    color: Colors.red,
  },
})``;
const Divider = styled.View`
  background-color: ${Colors.grey4};
  height: 0.7px;
  width: 100%;
`;
