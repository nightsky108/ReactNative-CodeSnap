import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Platform, View, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Fonts } from '@theme';
import { Text, Icon, SearchBar, Button } from 'react-native-elements';
import { wp, hp, adjustFontSize } from '@src/common/responsive';
import { SvgXml } from 'react-native-svg';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import { Box, HStack, Center } from 'native-base';

import { useNavigation, useRoute } from '@react-navigation/native';

import { SearchBarContainer } from '@src/common/StyledComponents';
import { JitengHeaderContainer } from '@components';

//= ===image assets======================
import scanSVG from '@assets/svgs/scan.svg';

// const faker = require('faker');
const faker = require('faker/locale/zh_TW');

const CategoryText = styled.Text`
  align-self: center;
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-weight: ${props => (props.active ? 700 : 400)};
  letter-spacing: -0.41px;
  line-height: 22px;

  text-align: center;
`;

const ItemButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  margin-right: 20px;
`;

const CategoryFilterHeader = ({
  categoryList,
  onPressCategoryItem,
  activeCategoryId,
  onPressFilterItem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { t, i18n } = useTranslation();
  //= ======== State Section========
  return (
    <>
      <Box flexDirection="row" width="100%" justifyContent="space-between" alignItems="center">
        <Box flexShrink={1} marginX={2} alignItems="center">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categoryList.map(item => {
              return (
                <ItemButton
                  key={item.id}
                  onPress={() => {
                    onPressCategoryItem(item?.id);
                  }}>
                  <CategoryText active={item?.id === activeCategoryId}>{item.name}</CategoryText>
                  {item?.id === activeCategoryId ? (
                    <Box backgroundColor={Colors.white} width="100%" height={0.8} />
                  ) : null}
                </ItemButton>
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
          onPress={onPressFilterItem}
        />
      </Box>
    </>
  );
};
CategoryFilterHeader.propTypes = {
  categoryList: PropTypes.arrayOf(PropTypes.object),
  onPressCategoryItem: PropTypes.func,
  onPressFilterItem: PropTypes.func,
  activeCategoryId: PropTypes.string,
};
CategoryFilterHeader.defaultProps = {
  categoryList: [],
  onPressCategoryItem: () => {},
  onPressFilterItem: () => {},
  activeCategoryId: null,
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
