import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

import {
  RowCenter,
  SearchBarContainer,
  RowBox,
  RowSpaceBetween,
} from '@src/common/StyledComponents';

const HeaderHeight = 44;

const SortFilterPanel = () => {
  const { t, i18n } = useTranslation();
  return (
    <Box borderBottomRadius={12} width="100%">
      <ListItemButton>
        <FilterItemText>{t('common:sort filter:Comprehensive')}</FilterItemText>
      </ListItemButton>
      <ListItemButton>
        <FilterItemText>{t('common:sort filter:credit')}</FilterItemText>
      </ListItemButton>
      <ListItemButton>
        <FilterItemText>{t('common:sort filter:Price descending')}</FilterItemText>
      </ListItemButton>
      <ListItemButton>
        <FilterItemText>{t('common:sort filter:Price ascending')}</FilterItemText>
      </ListItemButton>
    </Box>
  );
};
const VideoThemeFilterPanel = ({
  setExperienceFilter = () => {},
  clearExperienceFilter = () => {},
  experienceFilter = [],
  experiences = [],
}) => {
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState(experienceFilter);
  useEffect(() => {
    setFilter(experienceFilter);
    return () => {};
  }, [experienceFilter]);
  const toggleCategoryFilter = useCallback(
    id => {
      const existIndex = _.findIndex(filter, item => {
        return item === id;
      });
      if (existIndex === -1) {
        // add new category filter
        setFilter(oldFilter => _.concat(oldFilter, id));
      } else {
        // remove category filter
        setFilter(oldFilter => _.filter(oldFilter, item => item !== id));
      }
    },
    [filter],
  );
  const callSetCategoryFilter = useCallback(() => {
    if (!_.isEqual(filter.sort(), experienceFilter.sort())) {
      setExperienceFilter(filter);
    }
  }, [filter, experienceFilter, setExperienceFilter]);
  return (
    <Box borderBottomRadius={12} width="100%">
      {_.map(experiences, item => {
        return (
          <ListItemButton
            key={item?.id}
            onPress={() => {
              toggleCategoryFilter(item?.id);
            }}>
            <FilterItemText active={filter.includes(item?.id)}>{item?.name}</FilterItemText>
          </ListItemButton>
        );
      })}

      <RowCenter>
        <ResetButton onPress={clearExperienceFilter}>
          <ButtonText> {t('common:Reset')}</ButtonText>
        </ResetButton>
        <SetButton onPress={callSetCategoryFilter}>
          <ButtonText> {t('common:determine')}</ButtonText>
        </SetButton>
      </RowCenter>
    </Box>
  );
};
const FilterHeader = ({
  setExperienceFilter,
  experienceFilter,
  experiences,
  onOpenFilterPanel,
  clearExperienceFilter,
}) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  //= ======== State Section========
  const [collapsed, setCollapsed] = useState(true);
  const [isSorted, setIsSorted] = useState(false);
  const onSelectItemOnExpend = useCallback((id, offset) => {
    setTimeout(() => {}, 300);
    setCollapsed(true);
  }, []);
  const callSetExperienceFilter = filter => {
    setCollapsed(true);
    setExperienceFilter(filter);
  };
  const callClearExperienceFilter = () => {
    setCollapsed(true);
    clearExperienceFilter();
  };

  return (
    <View>
      <HeaderBox full hPadding>
        <Button
          icon={<Icon name="caretdown" size={15} type="antdesign" color={Colors.brandRed} />}
          iconRight
          title={t('common:Comprehensive')}
          buttonStyle={{
            backgroundColor: Colors.white,
            paddingHorizontal: 10,
          }}
          titleStyle={{
            fontFamily: 'Microsoft YaHei',
            fontSize: adjustFontSize(13),
            lineHeight: adjustFontSize(22),
            letterSpacing: adjustFontSize(-0.41),
            textAlign: 'center',
            color: Colors.brandRed,
          }}
          containerStyle={{ marginRight: 10, borderRadius: 20 }}
          onPress={() => {
            setCollapsed(prev => !prev);
            setIsSorted(true);
          }}
        />
        <Button
          title={t('common:Sales')}
          buttonStyle={{
            backgroundColor: Colors.white,
            paddingHorizontal: 10,
          }}
          titleStyle={{
            fontFamily: 'Microsoft YaHei',
            fontSize: adjustFontSize(13),
            lineHeight: adjustFontSize(22),
            letterSpacing: adjustFontSize(-0.41),
            textAlign: 'center',
            color: Colors.grey1,
          }}
          containerStyle={{ marginRight: 10, borderRadius: 20 }}
        />
        <Button
          icon={<Icon name="caretdown" size={15} type="antdesign" color={Colors.brandRed} />}
          iconRight
          title={t('common:Video theme')}
          buttonStyle={{
            backgroundColor: Colors.white,
            paddingHorizontal: 10,
          }}
          titleStyle={{
            fontFamily: 'Microsoft YaHei',
            fontSize: adjustFontSize(13),
            lineHeight: adjustFontSize(22),
            letterSpacing: adjustFontSize(-0.41),
            textAlign: 'center',
            color: Colors.brandRed,
          }}
          containerStyle={{ marginRight: 10, borderRadius: 20 }}
          onPress={() => {
            setCollapsed(prev => !prev);
            setIsSorted(false);
          }}
        />

        <FilterButton
          icon={<Icon name="filter" size={20} type="antdesign" color={Colors.grey1} />}
          title={`|  ${t('common:filter')}`}
          onPress={onOpenFilterPanel}
          iconRight
        />
      </HeaderBox>
      <Box
        position="absolute"
        left={0}
        top={HeaderHeight}
        backgroundColor={Colors.white}
        borderBottomRadius={12}
        zIndex={99}
        width="100%"
        paddingX="55px">
        <Collapsible collapsed={collapsed} align="top" renderChildrenCollapsed={false}>
          {isSorted ? (
            <SortFilterPanel />
          ) : (
            <VideoThemeFilterPanel
              experiences={experiences}
              setExperienceFilter={callSetExperienceFilter}
              clearExperienceFilter={callClearExperienceFilter}
              experienceFilter={experienceFilter}
            />
          )}
        </Collapsible>
      </Box>
    </View>
  );
};
FilterHeader.propTypes = {
  experiences: PropTypes.arrayOf(PropTypes.object),
  experienceFilter: PropTypes.arrayOf(PropTypes.string),
  setExperienceFilter: PropTypes.func,
  onOpenFilterPanel: PropTypes.func,
  clearExperienceFilter: PropTypes.func,
};
FilterHeader.defaultProps = {
  experiences: [],
  setExperienceFilter: () => {},
  onOpenFilterPanel: () => {},
  clearExperienceFilter: () => {},
  experienceFilter: [],
};
export default React.memo(FilterHeader);

const styles = StyleSheet.create({});
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
const HeaderBox = styled(RowSpaceBetween)`
  align-self: center;
  background-color: ${Colors.white};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  height: ${HeaderHeight}px;
`;
const FilterButton = styled(Button).attrs({
  buttonStyle: {
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
  },
  titleStyle: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(12),
    lineHeight: adjustFontSize(22),
    color: Colors.grey1,
    textAlign: 'center',
  },
  // containerStyle: { marginRight: 10 },
})``;
const HamburgerButton = styled(Button).attrs({
  buttonStyle: {
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
  },
})``;
const ListItemButton = styled.TouchableOpacity`
  border-bottom-color: rgba(194, 194, 194, 0.6);
  border-bottom-width: 1px;
  padding-bottom: 12px;
  padding-top: 12px;
`;
const FilterItemText = styled.Text`
  color: ${props => (props.active ? Colors.signUpStepRed : Colors.black)};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  text-align: left;
`;
const ResetButton = styled.TouchableOpacity`
  background-color: #ff7a00;
  border-bottom-left-radius: 20px;
  border-top-left-radius: 20px;
  margin-bottom: 10px;
  margin-top: 10px;
  padding: 10px 44px 10px 44px;
`;
const SetButton = styled(ResetButton)`
  background-color: ${Colors.signUpStepRed};
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 20px;
  border-top-left-radius: 0px;
  border-top-right-radius: 20px;
`;
const ButtonText = styled.Text`
  color: ${Colors.white};

  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
`;
