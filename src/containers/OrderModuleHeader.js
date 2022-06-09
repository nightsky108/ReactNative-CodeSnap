import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Platform, View, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Fonts } from '@theme';
import { Badge, Icon, SearchBar, Button } from 'react-native-elements';
import { wp, hp, adjustFontSize } from '@src/common/responsive';
import { SvgXml } from 'react-native-svg';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import { Box, HStack, Center, Text } from 'native-base';

import { useNavigation, useRoute } from '@react-navigation/native';

import { SearchBarContainer } from '@src/common/StyledComponents';
import { JitengHeaderContainer } from '@components';

//= ===image assets======================
import scanSVG from '@assets/svgs/scan.svg';

const OrderModuleHeader = ({ title }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  //= ======== State Section========
  return (
    <JitengHeaderContainer>
      <Box
        px="15px"
        width="100%"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <TouchableOpacity
          style={{
            paddingRight: 25,
            paddingVertical: 5,
            alignItems: 'center',
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon name="chevron-thin-left" type="entypo" color={Colors.white} size={wp(20)} />
        </TouchableOpacity>
        {/* My Order */}
        <Text
          fontFamily="Microsoft YaHei"
          fontWeight="400"
          fontSize="15px"
          lineHeight="20px"
          color={Colors.white}>
          {title}
        </Text>

        <TouchableOpacity
          style={{
            paddingHorizontal: 18,
            paddingTop: 5,
            alignItems: 'center',
          }}>
          <Badge
            value="99"
            status="error"
            containerStyle={{
              position: 'absolute',
              right: 0,
              top: 0,
              zIndex: 999,
            }}
            textProps={{
              adjustsFontSizeToFit: true,
            }}
          />
          <Icon name="dots-three-vertical" type="entypo" color={Colors.white} size={wp(18)} />
          <Text
            fontFamily="Microsoft YaHei"
            fontWeight="400"
            fontSize="9px"
            lineHeight="20px"
            color={Colors.white}>
            更多
          </Text>
        </TouchableOpacity>
      </Box>
    </JitengHeaderContainer>
  );
};
OrderModuleHeader.propTypes = {
  title: PropTypes.string,
};
OrderModuleHeader.defaultProps = {
  title: '',
};
export default React.memo(OrderModuleHeader);

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
