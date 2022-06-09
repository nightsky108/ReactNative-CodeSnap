import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Pressable } from 'react-native';
import { Colors, Fonts } from '@theme';
import { Icon } from 'react-native-elements';
import { wp } from '@src/common/responsive';
import { SvgXml } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { DrawerActions, useNavigation } from '@react-navigation/native';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import { Box } from 'native-base';

import { SearchBarContainer } from '@src/common/StyledComponents';
import { JitengHeaderContainer, JitengPressable, CartIcon } from '@components';

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
const JitengHeader = ({ title = '', titleStyle, hidden }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  //= ======== State Section========

  const onPressProfileIconBtn = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };
  return (
    <>
      <JitengHeaderContainer>
        <Box
          flexDirection="row"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          paddingX={3}>
          <Pressable style={calcStyle} onPress={onPressProfileIconBtn}>
            {/* <SvgXml width={wp(17)} height={wp(17)} xml={scanSVG} style={{ marginBottom: 5 }} /> */}
            <Icon name="menu" color={Colors.white} size={wp(30)} />
          </Pressable>
          <SearchBarContainer
            placeholder={t('home:header:search')}
            onChangeText={setSearchQuery}
            value={searchQuery}
            containerStyle={{
              flexGrow: 4,
            }}
          />
          <JitengPressable style={styles.wrapperCustom}>
            <Icon name="location-pin" type="entypo" color={Colors.white} size={wp(22)} />
            <IconText>香港特...</IconText>
          </JitengPressable>
          <JitengPressable style={styles.wrapperCustom}>
            <Icon name="person" type="ionicons" color={Colors.white} size={wp(25)} />
            <IconText>{t('home:header:mine')}</IconText>
          </JitengPressable>

          <JitengPressable
            style={styles.wrapperCustom}
            onPress={() => {
              navigation.navigate('CartStack');
            }}>
            <CartIcon />

            <IconText>{t('home:header:shopping cart')}</IconText>
          </JitengPressable>
        </Box>
      </JitengHeaderContainer>
    </>
  );
};
JitengHeader.propTypes = {
  titleStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  title: PropTypes.string,
  hidden: PropTypes.bool,
};
JitengHeader.defaultProps = {
  titleStyle: {},
  title: '',
  hidden: false,
};
export default React.memo(JitengHeader);

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
  },
});
