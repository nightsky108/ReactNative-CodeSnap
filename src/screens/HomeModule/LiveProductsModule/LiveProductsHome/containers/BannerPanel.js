import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Platform, View, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Colors, Fonts } from '@theme';
import { Text, Icon, SearchBar, Button } from 'react-native-elements';
import { wp, hp, adjustFontSize, getAdjustSize } from '@src/common/responsive';
import { SvgXml } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import Collapsible from 'react-native-collapsible';
import FastImage from 'react-native-fast-image';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import { Box, HStack, Center } from 'native-base';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery, NetworkStatus } from '@apollo/client';
//= ==custom components & containers  =======

import { RowSpaceBetween, RowCenter } from '@src/common/StyledComponents';
import { JitengHeaderContainer } from '@components';
import { JitengMidHeader, TopBannerPanel } from '@containers';

//= ======Query ====================

import { FETCH_BANNER_BY_IDENTIFIER } from '@modules/banner/graphql';
//= ===image assets======================
import scanSVG from '@assets/svgs/scan.svg';

// const faker = require('faker');
const faker = require('faker/locale/zh_TW');

const HeaderHeight = 44;
const vRectSize = getAdjustSize({ width: 162, height: 222 });
const hSmallRectSize = getAdjustSize({ width: 211, height: 100 });
const vSmallRectSize = getAdjustSize({ width: 105, height: 121 });

const BannerContent = React.memo(({ banner, onPress, containerSize }) => {
  if (!banner || !banner?.assets) {
    return <View style={[styles.emptyContainer, containerSize]} />;
  } else {
    return (
      <FastImage
        style={[styles.container, containerSize]}
        source={{ uri: banner?.assets[0]?.image, priority: FastImage.priority.high }}
        resizeMode={FastImage.resizeMode.contain}
      />
    );
  }
});
BannerContent.propTypes = {
  banner: PropTypes.oneOfType([PropTypes.object]),
  onPress: PropTypes.func,
  containerSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
};
BannerContent.defaultProps = {
  banner: null,
  onPress: () => {},
  containerSize: {
    width: 0,
    height: 0,
  },
};

const MainHorizontalContent = () => {
  const { data: bannerData } = useQuery(FETCH_BANNER_BY_IDENTIFIER, {
    variables: {
      identifier: 'n',
    },
  });
  const { data: vRectData } = useQuery(FETCH_BANNER_BY_IDENTIFIER, {
    variables: {
      identifier: 'lpm_a',
    },
  });
  const { data: hSmallData } = useQuery(FETCH_BANNER_BY_IDENTIFIER, {
    variables: {
      identifier: 'lpm_b',
    },
  });
  const { data: vSmallData1 } = useQuery(FETCH_BANNER_BY_IDENTIFIER, {
    variables: {
      identifier: 'lpm_c',
    },
  });
  const { data: vSmallData2 } = useQuery(FETCH_BANNER_BY_IDENTIFIER, {
    variables: {
      identifier: 'lpm_d',
    },
  });
  return (
    <>
      <TopBannerPanel banner={bannerData?.bannerByIdentifier} />
      <Box flexDirection="row">
        <BannerContent banner={vRectData?.bannerByIdentifier} containerSize={vRectSize} />
        <Box>
          <BannerContent banner={hSmallData?.bannerByIdentifier} containerSize={hSmallRectSize} />
          <Box flexDirection="row">
            <BannerContent
              banner={vSmallData1?.bannerByIdentifier}
              containerSize={vSmallRectSize}
            />
            <BannerContent
              banner={vSmallData2?.bannerByIdentifier}
              containerSize={vSmallRectSize}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};
const BannerPanel = () => {
  const { t, i18n } = useTranslation();
  //= ======== State Section========
  return (
    <>
      <MainHorizontalContent />
    </>
  );
};
BannerPanel.propTypes = {};
BannerPanel.defaultProps = {};
export default React.memo(BannerPanel);

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
  emptyContainer: {
    backgroundColor: Colors.grey5,
  },
});
