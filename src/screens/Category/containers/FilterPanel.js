import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Platform, View, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Fonts } from '@theme';
import { Text, Icon, Button, Image } from 'react-native-elements';
import { wp, hp, adjustFontSize, getAdjustSize } from '@src/common/responsive';
import { SvgXml } from 'react-native-svg';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import { Box, HStack, Center } from 'native-base';
import { v4 as uuidv4 } from 'uuid';

import { useNavigation, useRoute } from '@react-navigation/native';

import {
  SearchBarContainer,
  TriangleContainer,
  Triangle,
  TriangleClose,
  RowBox,
} from '@src/common/StyledComponents';
import { JitengHeaderContainer } from '@components';

//= ===image assets======================
import * as constants from '@utils/constant';
import _ from 'lodash';

const faker = require('faker');

faker.locale = 'zh_CN';

/* const FilterList = Array(6)
    .fill('')
    .map((item, i) => ({
        id: uuidv4(),
        title: `${faker.name.firstName()} ${faker.name.firstName()} ${faker.name.firstName()} ${faker.name.firstName()}}`,
        content: Array(Math.floor(Math.random() * 6) + 6)
            .fill('')
            .map((item, i) => ({
                id: uuidv4(),
                title: `${faker.name.firstName()} ${faker.name.firstName()} ${faker.name.firstName()} ${faker.name.firstName()}}`,
            })),
    })); */
const FilterList = Array(6)
  .fill('')
  .map((item, i) => ({
    id: uuidv4(),
    title: `${faker.name.firstName()} ${faker.name.firstName()} ${faker.name.firstName()} ${faker.name.firstName()}}`,
  }));
const ItemSize = getAdjustSize({ width: 77, height: 33 });
const TriangleSize = wp(46);
const ItemContainer = styled(TriangleContainer)`
  align-items: center;
  background-color: ${p => (p.active ? '#FFC9C9' : Colors.grey6)};
  border-radius: 3px;
  height: ${hp(33)}px;
  justify-content: center;
  margin-bottom: ${hp(7)}px;
  margin-right: ${wp(7)}px;
  width: ${wp(77)}px;
`;
const CategoryText = styled.Text`
  align-self: center;
  color: ${p => (p.active ? Colors.brandRed : Colors.black)};
  font-family: 'Microsoft YaHei';
  font-size: 9.5px;
  font-weight: 400;
  line-height: 22px;
`;
const TitleText = styled.Text`
  color: ${Colors.grey3};
  font-family: 'Microsoft YaHei';
  font-size: 10px;
  font-weight: 400;
  line-height: 22px;
  margin-left: 4px;
`;
const ItemTitleText = styled.Text`
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: 10px;
  font-weight: 400;
  line-height: 22px;
  margin-left: 4px;
`;
/* const FilterPanel = () => {
    const { t, i18n } = useTranslation();
    //= ======== State Section========
    return (
        <Box marginTop={20} marginLeft={10}>
            <ItemContainer>
                <CategoryText>直播</CategoryText>
            </ItemContainer>
            <ItemContainer active>
                <Triangle size={TriangleSize}>
                    <TriangleClose type="antdesign" name="close" color={Colors.white} size={12} />
                </Triangle>
                <CategoryText active>直播</CategoryText>
            </ItemContainer>
        </Box>
    );
}; */
const TypePanel = () => {
  return (
    <Box width="100%" paddingY="10px" paddingLeft="12px">
      <ItemTitleText>視頻類型</ItemTitleText>
      <Box width="100%" flexWrap="wrap" flexDirection="row">
        {_.map(FilterList, (item, index) => {
          return (
            <ItemContainer active key={index} onPress={() => console.log(`${item?.id} is pressed`)}>
              <Triangle size={TriangleSize}>
                <TriangleClose type="antdesign" name="close" color={Colors.white} size={12} />
              </Triangle>
              <CategoryText active>直播</CategoryText>
            </ItemContainer>
          );
        })}
      </Box>
    </Box>
  );
};

const FilterPanel = () => {
  const { t, i18n } = useTranslation();
  //= ======== State Section========
  return (
    <Box background={Colors.white} width="100%">
      <Box
        height={`${hp(54)}px`}
        alignItems="flex-start"
        justifyContent="flex-end"
        backgroundColor={Colors.greyRed}
        paddingBottom={`${hp(4)}px`}
        width="100%">
        <TouchableOpacity>
          <RowBox>
            <Icon
              name="left"
              type="antdesign"
              color={Colors.grey3}
              containerStyle={{ marginLeft: wp(12), alignSelf: 'center' }}
              onPress={() => {}}
              size={15}
            />
            <TitleText>{t('category:filter')}</TitleText>
          </RowBox>
        </TouchableOpacity>
      </Box>
      <Box width="100%" paddingY="10px">
        {/* <ItemTitleText>視頻類型</ItemTitleText> */}
        <TypePanel />
      </Box>
    </Box>
  );
};
FilterPanel.propTypes = {};
FilterPanel.defaultProps = {};
export default React.memo(FilterPanel);

const styles = StyleSheet.create({});
