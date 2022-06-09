import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  StatusBar,
  Platform,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { Icon, Text, Image, Button } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import _, { wrap } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Box, HStack, Center } from 'native-base';
import { LinearTextGradient } from 'react-native-text-gradient';
import Collapsible from 'react-native-collapsible';

//= ==custom components & containers  =======
import { FocusAwareStatusBar, NormalHeaderContainer, JitengPressable } from '@components';

import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { Colors, Fonts } from '@theme';
import Images from '@assets/images';

import { RowCenter, SearchBarContainer, RowSpaceBetween } from '@src/common/StyledComponents';

const HeaderHeight = 44;

const BannerImageSize = getAdjustSize({ width: 375, height: 186 });

const ItemTitleView = styled(View)`
  align-self: center;
  border-bottom-color: ${props => (props.active ? Colors.signUpStepRed : Colors.black)};
  border-bottom-width: ${props => (props.active ? 1 : 0)}px;
  margin-left: 20px;
  margin-right: 20px;
  padding-bottom: 10px;
  padding-top: 10px;
`;
const ItemTitleText = styled(Text)`
  align-self: center;
  color: ${props => (props.active ? Colors.signUpStepRed : Colors.black)};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  letter-spacing: 0.25px;
  line-height: 16px;
`;
const ExpandPanelTitleText = styled(Text)`
  align-self: center;
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  line-height: 16px;
  text-align: left;
`;
const ExpandPanelItemText = styled(Text)`
  align-self: center;
  color: ${props => (props.active ? Colors.signUpStepRed : Colors.black)};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  margin: 26px;
  text-align: left;
`;
const Divider = styled.View`
  background-color: ${Colors.white};
  height: 2px;
  width: ${parseInt(wp(150), 10)}px;
`;

const CategoryPanel = ({ categories, onSelectCategory, activeCategoryId }) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  //= ======== State Section========
  const [collapsed, setCollapsed] = useState(true);
  const onSelectItemOnExpend = useCallback((id, offset) => {
    setTimeout(() => {
      onSelectCategory(id, offset);
    }, 300);

    setCollapsed(true);
  }, []);

  return (
    <View>
      <RowSpaceBetween full height={HeaderHeight}>
        <Box flexShrink={1} marginX={2} alignItems="center">
          {collapsed ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((item, index) => {
                return (
                  <ItemTitleView active={activeCategoryId === item.id} key={item.id}>
                    <ItemTitleText
                      active={activeCategoryId === item.id}
                      onPress={() => {
                        onSelectCategory(item?.id, item?.offset || 0);
                      }}>
                      {item.name}
                    </ItemTitleText>
                  </ItemTitleView>
                );
              })}
            </ScrollView>
          ) : (
            <ExpandPanelTitleText>{t('common:All Categories')}</ExpandPanelTitleText>
          )}
        </Box>
        {categories?.length > 0 ? (
          <Icon
            name={collapsed ? 'chevron-thin-down' : 'chevron-thin-up'}
            size={20}
            type="entypo"
            color={Colors.grey3}
            containerStyle={{ marginRight: 10, borderRadius: 20 }}
            onPress={() => {
              setCollapsed(prev => !prev);
            }}
          />
        ) : null}
      </RowSpaceBetween>
      <Box position="absolute" left={0} top={HeaderHeight} zIndex={99} width="100%">
        <Collapsible collapsed={collapsed} align="top" renderChildrenCollapsed={false} style={{}}>
          <Box
            width="100%"
            flexWrap="wrap"
            flexDirection="row"
            borderBottomRadius={12}
            backgroundColor={Colors.white}>
            {categories.map(item => {
              return (
                <ExpandPanelItemText
                  onPress={() => {
                    onSelectItemOnExpend(item?.id, item?.offset || 0);
                  }}
                  active={activeCategoryId === item.id}
                  key={item.id}>
                  {item.name}
                </ExpandPanelItemText>
              );
            })}
          </Box>
        </Collapsible>
      </Box>
    </View>
  );
};
CategoryPanel.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object),
  onSelectCategory: PropTypes.func,
  activeCategoryId: PropTypes.string,
};
CategoryPanel.defaultProps = {
  categories: [],
  onSelectCategory: () => {},
  activeCategoryId: null,
};
export default React.memo(CategoryPanel);

const styles = StyleSheet.create({});
