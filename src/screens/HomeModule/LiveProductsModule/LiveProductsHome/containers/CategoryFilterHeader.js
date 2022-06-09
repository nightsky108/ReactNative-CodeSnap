import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Platform, View, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Colors, Fonts } from '@theme';
import { Text, Icon, SearchBar, Button } from 'react-native-elements';
import { wp, hp, adjustFontSize } from '@src/common/responsive';
import { SvgXml } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import Collapsible from 'react-native-collapsible';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import { Box, HStack, Center } from 'native-base';

import { useNavigation, useRoute } from '@react-navigation/native';

import { RowSpaceBetween, RowCenter } from '@src/common/StyledComponents';
import { JitengHeaderContainer } from '@components';

//= ===image assets======================
import scanSVG from '@assets/svgs/scan.svg';

// const faker = require('faker');
const faker = require('faker/locale/zh_TW');

const HeaderHeight = 44;

const CategoryText = styled.Text`
  align-self: center;
  color: ${props => (props.active ? Colors.brandRed : Colors.white)};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-weight: 400;
  letter-spacing: -0.41px;
  line-height: 22px;
  margin-right: 4px;

  text-align: center;
`;

const ItemButton = styled.TouchableOpacity`
  align-items: center;
  background-color: ${props => (props.active ? Colors.pink2 : 'transparent')};
  border-radius: 15px;
  flex-direction: row;
  height: ${hp(28)}px;
  margin-right: 20px;
  padding-left: 8px;
  padding-right: 8px;
`;
const ExpandPanelTitleText = styled(Text)`
  align-self: center;
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  line-height: 16px;
  text-align: left;
`;
const ExpandPanelItem = styled.TouchableOpacity`
  align-self: center;
  flex-direction: row;
  justify-content: center;
  margin: 26px;
`;
const ExpandPanelItemText = styled(Text)`
  color: ${props => (props.active ? Colors.signUpStepRed : Colors.black)};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  margin-right: 4px;
  text-align: left;
`;
const ResetButton = styled.TouchableOpacity`
  align-items: center;
  background-color: ${Colors.grey5};
  border-bottom-left-radius: 20px;
  border-top-left-radius: 20px;
  flex: 1;
  margin-bottom: 10px;
  margin-top: 10px;
  padding: 10px 44px 10px 44px;
`;
const SetButton = styled(ResetButton)`
  background-color: ${Colors.signUpStepRed};
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 20px;
  border-top-left-radius: 0px;
  border-top-right-radius: 20px;
  flex: 1;
`;
const SetButtonText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
`;
const ReSetButtonText = styled(SetButtonText)`
  color: ${Colors.black};
`;
const CategoryItem = React.memo(
  ({ item, active, onPressCategoryItem }) => {
    return (
      <ItemButton
        key={item.id}
        active={active}
        onPress={() => {
          onPressCategoryItem(item?.id);
        }}>
        <CategoryText active={active}>{item.name}</CategoryText>
        {active ? <Icon type="antdesign" name="close" color={Colors.brandRed} size={12} /> : null}
      </ItemButton>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.item?.id === nextProps.item?.id && prevProps?.active === nextProps?.active;
  },
);

const CategoryFilterHeader = ({
  categoryList,
  onPressCategoryItem,
  categoryFilter,
  onPressFilterItem,
}) => {
  const { t, i18n } = useTranslation();
  //= ======== State Section========
  return (
    <>
      <RowSpaceBetween full height={hp(HeaderHeight)} backgroundColor="transparent">
        <Box flexShrink={1} marginX={2} alignItems="center">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center' }}>
            {categoryList.map(item => {
              return (
                <CategoryItem
                  key={item.id}
                  onPressCategoryItem={() => {
                    onPressCategoryItem(item?.id);
                  }}
                  active={categoryFilter.includes(item?.id)}
                  item={item}
                />
              );
            })}
          </ScrollView>
        </Box>

        <Button
          icon={<Icon name="menu" size={20} type="ionicons" color="white" />}
          title={t('home:header:classification')}
          buttonStyle={{
            backgroundColor: Colors.filterNotiRed,
            paddingHorizontal: 10,
          }}
          titleStyle={{
            fontFamily: 'Microsoft YaHei',
            fontSize: adjustFontSize(13),
            lineHeight: adjustFontSize(22),
            letterSpacing: adjustFontSize(-0.41),
            textAlign: 'center',
          }}
          containerStyle={{ marginRight: 10, borderRadius: 20 }}
          onPress={() => {}}
        />
      </RowSpaceBetween>
    </>
  );
};
CategoryFilterHeader.propTypes = {
  categoryList: PropTypes.arrayOf(PropTypes.object),
  onPressCategoryItem: PropTypes.func,
  onPressFilterItem: PropTypes.func,
  categoryFilter: PropTypes.arrayOf(PropTypes.string),
};
CategoryFilterHeader.defaultProps = {
  categoryList: [],
  onPressCategoryItem: () => {},
  onPressFilterItem: () => {},
  categoryFilter: [],
};
export default React.memo(CategoryFilterHeader);

const styles = StyleSheet.create({
  titleStyle: {
    ...Fonts.title,
    color: Colors.black,
    fontWeight: '400',
  },
  wrapperCustom: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginHorizontal: 5,
    // backgroundColor: 'blue',
  },
});
