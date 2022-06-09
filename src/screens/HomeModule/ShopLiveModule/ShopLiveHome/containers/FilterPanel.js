import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Platform, View, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Fonts } from '@theme';
import { Text, Icon, Button, Image, ListItem } from 'react-native-elements';
import { wp, hp, adjustFontSize, getAdjustSize } from '@src/common/responsive';
import { SvgXml } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import Collapsible from 'react-native-collapsible';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import { Box, HStack, Center } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';

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
const SectionTitleButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 3px;
  padding-top: 3px;
  width: 100%;
`;
const CategoryItemButton = styled.TouchableOpacity`
  border-bottom-color: #f2f2f2;
  border-bottom-width: 1px;
  flex-direction: row;
  justify-content: space-between;
  padding: 9px 10px 9px 10px;
  width: 100%;
`;
const ItemTitleText = styled.Text`
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: 10px;
  font-weight: 400;
  line-height: 22px;
  margin-left: 4px;
`;
const CategoryItemTitleText = styled.Text`
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: 10px;
  font-weight: 400;
  line-height: 22px;
`;
const ResetButton = styled(Button).attrs({
  containerStyle: {
    marginRight: 6,
  },
  buttonStyle: {
    backgroundColor: Colors.grey5,
    borderWidth: 0,
    borderRadius: 5,
    paddingHorizontal: 20,
    width: wp(66),
    height: hp(32),
  },
  titleStyle: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(13),
    lineHeight: adjustFontSize(22),
    letterSpacing: adjustFontSize(-0.41),
    color: Colors.grey1,
  },
})``;
const ApplyButton = styled(Button).attrs({
  containerStyle: {},
  buttonStyle: {
    backgroundColor: Colors.filterNotiRed,
    borderWidth: 0,
    borderRadius: 5,
    paddingHorizontal: 20,
    width: wp(66),
    height: hp(32),
  },
  titleStyle: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(13),
    lineHeight: adjustFontSize(22),
    letterSpacing: adjustFontSize(-0.41),
    color: Colors.white,
  },
})``;
const VideoTypePanel = () => {
  const { t, i18n } = useTranslation();
  return (
    <Box
      width="100%"
      paddingY="10px"
      paddingLeft="12px"
      borderBottomWidth="1px"
      borderBottomColor="#f2f2f2">
      <ItemTitleText>{t('LiveShop:video type')}</ItemTitleText>
      <Box width="100%" flexDirection="row">
        <ItemContainer active onPress={() => {}}>
          <Triangle size={TriangleSize}>
            <TriangleClose type="antdesign" name="close" color={Colors.white} size={12} />
          </Triangle>
          <CategoryText active>{t('LiveShop:Live broadcast')}</CategoryText>
        </ItemContainer>
        <ItemContainer onPress={() => {}}>
          <CategoryText>{t('LiveShop:video')}</CategoryText>
        </ItemContainer>
        <ItemContainer active onPress={() => {}}>
          <Triangle size={TriangleSize}>
            <TriangleClose type="antdesign" name="close" color={Colors.white} size={12} />
          </Triangle>
          <CategoryText>{t('LiveShop:replay')}</CategoryText>
        </ItemContainer>
      </Box>
    </Box>
  );
};
const CategoryPanel = ({ categoryList }) => {
  const { t, i18n } = useTranslation();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Box
      width="100%"
      paddingY="10px"
      paddingX="12px"
      borderBottomWidth="1px"
      borderBottomColor="#f2f2f2">
      <SectionTitleButton onPress={() => setCollapsed(prev => !prev)}>
        <ItemTitleText>{t('LiveShop:classification')}</ItemTitleText>
        <Icon
          name={collapsed ? 'chevron-thin-down' : 'chevron-thin-up'}
          size={15}
          type="entypo"
          color={Colors.grey3}
          containerStyle={{ alignSelf: 'center' }}
        />
      </SectionTitleButton>

      <Box width="100%">
        <Collapsible collapsed={collapsed} align="top" renderChildrenCollapsed={false} style={{}}>
          {categoryList.map((item, i) => (
            <CategoryItemButton key={i.toString()} onPress={() => {}}>
              <CategoryItemTitleText> {item.name}</CategoryItemTitleText>
              {/*   <Icon name="circle" type="entypo" color={Colors.grey3} size={15} /> */}
              <Icon name="checkcircle" type="antdesign" color={Colors.priceRed} size={15} />
            </CategoryItemButton>
          ))}
        </Collapsible>
      </Box>
    </Box>
  );
};
const FilterPanel = ({ liveStreamCategories }) => {
  const { t, i18n } = useTranslation();
  //= ======== State Section========
  return (
    <Box backgroundColor={Colors.white} width="100%" style={{ flex: 1 }}>
      <Box
        // height={`${hp(54)}px`}
        alignItems="flex-start"
        justifyContent="flex-end"
        backgroundColor={Colors.greyRed}
        paddingY={`${hp(4)}px`}
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
      <ScrollView>
        <Box width="100%" paddingY="10px">
          <VideoTypePanel />
          <CategoryPanel categoryList={liveStreamCategories} />
        </Box>
      </ScrollView>
      <Box
        width="100%"
        backgroundColor={Colors.white}
        paddingX={3}
        paddingY={3}
        alignSelf="flex-end"
        flexDirection="row"
        justifyContent="flex-end">
        <ResetButton title={t('common:Reset')} />
        <ApplyButton title={t('common:determine')} />
      </Box>
    </Box>
  );
};
FilterPanel.propTypes = {
  liveStreamCategories: PropTypes.arrayOf(PropTypes.object),
};
FilterPanel.defaultProps = {
  liveStreamCategories: [],
};
export default React.memo(FilterPanel);

const styles = StyleSheet.create({});
