import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Platform, View, Pressable, ScrollView } from 'react-native';
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
import { JitengHeaderContainer, CartIcon } from '@components';

//= ===image assets======================
import scanSVG from '@assets/svgs/scan.svg';

// const faker = require('faker');
const faker = require('faker/locale/zh_TW');

const calcStyle = ({ pressed }) => {
  return [
    {
      backgroundColor: pressed ? Colors.pinkHighlight : 'transparent',
    },
    styles.wrapperCustom,
  ];
};
const IconText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 9px;
  font-weight: 400;
  line-height: 15px;
`;
const CategoryText = styled.Text`
  align-self: center;
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-weight: 400;
  letter-spacing: -0.41px;
  line-height: 22px;
  margin-right: 40px;
`;

const liveStreamCategoryList = Array(10)
  .fill('')
  .map((item, i) => ({
    id: `${i}`,
    name: `${faker.name.firstName()}${faker.name.lastName()}`,
  }));
const JitengMidHeader = ({ title = '', titleStyle, hidden, onLeftPress }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { t, i18n } = useTranslation();
  //= ======== State Section========
  return (
    <>
      <JitengHeaderContainer>
        <Box
          flexDirection="row"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          paddingX={3}>
          <Pressable style={calcStyle} onPress={onLeftPress}>
            <Icon name="left" type="antdesign" color={Colors.white} size={wp(22)} />
          </Pressable>
          <SearchBarContainer
            placeholder={t('common:Search this page')}
            onChangeText={setSearchQuery}
            value={searchQuery}
            containerStyle={{
              flexGrow: 4,
            }}
          />

          <Pressable style={calcStyle}>
            <Icon name="person" type="ionicons" color={Colors.white} size={wp(25)} />
            <IconText>{t('home:header:mine')}</IconText>
          </Pressable>
          <Pressable style={calcStyle}>
            <CartIcon />
            <IconText>{t('home:header:shopping cart')}</IconText>
          </Pressable>
        </Box>
      </JitengHeaderContainer>
    </>
  );
};
JitengMidHeader.propTypes = {
  titleStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  title: PropTypes.string,
  hidden: PropTypes.bool,
  onLeftPress: PropTypes.func,
};
JitengMidHeader.defaultProps = {
  titleStyle: {},
  title: '',
  hidden: false,
  onLeftPress: () => {},
};
export default React.memo(JitengMidHeader);

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
