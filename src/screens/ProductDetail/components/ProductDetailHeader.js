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
import { JitengHeaderContainer, JitengPressable } from '@components';

//= ===image assets======================
import scanSVG from '@assets/svgs/scan.svg';

const IconText = styled.Text`
  color: ${Colors.grey3};
  font-family: 'Microsoft YaHei';
  font-size: 9px;
  font-weight: 400;
  line-height: 15px;
`;
const IconButton = styled(JitengPressable)`
  margin-left: 5px;
  margin-right: 5px; ;
`;
const ProductDetailHeader = ({ title = '', titleStyle, hidden }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  //= ======== State Section========
  return (
    <>
      <JitengHeaderContainer gradientColors={[Colors.grey6, Colors.grey6]} barStyle="dark-content">
        <Box
          flexDirection="row"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          paddingX={3}>
          <IconButton
            onPress={() => {
              navigation.goBack();
            }}>
            <Icon name="chevron-thin-left" type="entypo" color={Colors.grey3} size={wp(22)} />
          </IconButton>
          <SearchBarContainer
            placeholder={t('home:header:search')}
            onChangeText={setSearchQuery}
            value={searchQuery}
            containerStyle={{
              flexGrow: 4,
            }}
          />
          <IconButton>
            <Icon name="share" type="entypo" color={Colors.grey3} size={22} />
            <IconText>分享</IconText>
          </IconButton>
          <IconButton>
            <Icon name="shopping-cart" type="entypo" color={Colors.grey3} size={22} />
            <IconText>购物车</IconText>
          </IconButton>
          <IconButton>
            <Icon name="dots-three-vertical" type="entypo" color={Colors.grey3} size={22} />
            <IconText>更多</IconText>
          </IconButton>
        </Box>
      </JitengHeaderContainer>
    </>
  );
};
ProductDetailHeader.propTypes = {
  titleStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  title: PropTypes.string,
  hidden: PropTypes.bool,
};
ProductDetailHeader.defaultProps = {
  titleStyle: {},
  title: '',
  hidden: false,
};
export default React.memo(ProductDetailHeader);

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
