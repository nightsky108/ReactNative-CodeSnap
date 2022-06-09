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

const PageHeader = ({ title = '' }) => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  //= ======== State Section========
  return (
    <Box
      flexDirection="row"
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      height={`${hp(44)}px`}
      paddingX={3}>
      <IconButton
        onPress={() => {
          navigation.goBack();
        }}>
        <Icon name="chevron-thin-left" type="entypo" color={Colors.grey3} size={wp(22)} />
      </IconButton>
      <Title>{title}</Title>
      <Box />
    </Box>
  );
};
PageHeader.propTypes = {
  title: PropTypes.string,
};
PageHeader.defaultProps = {
  title: '',
};
export default React.memo(PageHeader);

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
const Title = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
`;
const IconButton = styled(JitengPressable)`
  margin-left: 5px;
  margin-right: 5px; ;
`;
