import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Pressable,
  SectionList,
  Animated,
} from 'react-native';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
//= ==third party plugins=======
import { useDispatch, useSelector } from 'react-redux';
import { DrawerLayout } from 'react-native-gesture-handler';

import { Icon, Button, withBadge } from 'react-native-elements';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import { Box } from 'native-base';

import _ from 'lodash';

//= ==custom components & containers  =======
import { Content, Container, JitengHeaderContainer, JitengPressable } from '@components';

//= ======selectors==========================
import { productCategoryFilterSelector } from '@modules/product/selectors';

//= ======reducer actions====================
import { setProductCategoryFilter, clearProductCategoryFilter } from '@modules/product/slice';

//= ======Query ====================

//= =====hook data================================
import { useFullProductCategories } from '@data/useProductCategories';
//= ==========apis=======================

//= =============utils==================================
import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';

//= =============styles==================================
import { Colors, Metrics } from '@theme';
import { SearchBarContainer, RowSpaceBetween } from '@src/common/StyledComponents';

import images from '@src/assets/images';
import { styles } from './styles';
// import { StyleSheetFactory } from './styles';
import { FilterPanel } from './containers';

// AssetType
//= =============images & constants ===============================
//= ============import end ====================

const categorySize = getAdjustSize({ width: 72, height: 70.58 });
const emptyImageSize = getAdjustSize({ width: 45.63, height: 37.5 });
const ChildCategoryItem = React.memo(
  ({ category, isSelected, onToggleCategoryFilter }) => {
    if (category?.isEmpty) {
      return <View style={{ ...categorySize }} />;
    }
    return (
      <CategoryPressable
        isSelected={true}
        onPress={() => {
          onToggleCategoryFilter(category?.id);
        }}>
        {isSelected ? (
          <BadgeIcon name="checkcircle" type="antdesign" color={Colors.filterNotiRed} size={16} />
        ) : null}
        {category?.image?.url ? (
          <CategoryPhoto source={{ uri: category?.image?.url }} />
        ) : (
          <EmptyContent>
            <EmptyImage source={images.emptyImg} />
          </EmptyContent>
        )}

        <ItemTitleText numberOfLines={2}>{category?.name}</ItemTitleText>
      </CategoryPressable>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.category?.id === nextProps.category?.id &&
      prevProps.isSelected === nextProps.isSelected
    );
  },
);
const SubCategoryPanel = React.memo(
  ({ category, filter, onToggleCategoryFilter }) => {
    const keyExtractor = useCallback(item => item.id, []);
    const childCategories = useMemo(() => {
      const isThird = category.list.length % 3;
      if (isThird === 0) {
        return category.list;
      } else {
        return _.concat(
          category.list,
          Array(3 - isThird)
            .fill('')
            .map((item, i) => ({
              id: uuidv4(),
              isEmpty: true,
            })),
        );
      }
    }, [category.list]);
    const renderItem = useCallback(
      ({ item, index }) => {
        const isFiltered = filter.includes(item.id);
        return (
          <ChildCategoryItem
            isSelected={isFiltered}
            category={item}
            onToggleCategoryFilter={onToggleCategoryFilter}
          />
        );
      },
      [filter, onToggleCategoryFilter],
    );
    return (
      <FlatList
        data={childCategories}
        renderItem={renderItem}
        extraData={childCategories.length}
        scrollEnabled={false}
        keyExtractor={keyExtractor}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: 'space-evenly' }}
        removeClippedSubviews={true} // Unmount components when outside of window
        initialNumToRender={6} // Reduce initial render amount
        maxToRenderPerBatch={1} // Reduce number in each render batch
        updateCellsBatchingPeriod={100} // Increase time between renders
        windowSize={7} // Reduce the window size
      />
    );
  },
  (prevProps, nextProps) => {
    const equal = _.isEqual(_.sortBy(nextProps.filter), _.sortBy(prevProps.filter));
    return prevProps.category?.id === nextProps.category?.id && equal;
  },
);

const Category = ({ navigation, route }) => {
  //= ========Hook Init===========
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isProduct = route?.params?.isProduct || false;

  // const styles = StyleSheetFactory({ theme });
  //= ========= Props Section========
  const categoryFilter = useSelector(state => productCategoryFilterSelector(state));
  const { fullProductCategoryIds, fullProductCategories, loading, error } =
    useFullProductCategories();
  const firstCatKey = Object.keys(fullProductCategories)[0];
  const filterPanelRef = useRef(null);
  //= ======== State Section========
  const [searchQuery, setSearchQuery] = useState('');
  const [focusCategoryId, setFocusCategoryId] = useState(firstCatKey);
  const [filter, setFilter] = useState([]);
  const keyExtractor = useCallback(item => item.id, []);

  //= ========= GraphQl query Section========

  const activeSubCategory = useMemo(() => {
    if (!focusCategoryId) {
      return [];
    } else {
      const children = Object.values(fullProductCategories[focusCategoryId].children);

      const data = _.map(
        _.filter(children, item => item?.hasChildren === true),
        cat => {
          return {
            id: cat?.id,
            title: cat?.name,
            data: [
              {
                id: cat?.id,
                list: Object.values(cat?.children),
              },
            ],
          };
        },
      );

      return data;
    }
  }, [focusCategoryId, fullProductCategories]);
  useEffect(() => {
    setFilter(categoryFilter);
    return () => {};
  }, [categoryFilter]);
  const resetFilter = () => {
    dispatch(clearProductCategoryFilter());
  };
  const applyFilter = () => {
    dispatch(setProductCategoryFilter({ categoryFilter: filter }));
    navigation.goBack();
  };
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
  const isFiltered = useCallback(
    id => {
      return filter.includes(id);
    },
    [filter],
  );
  const selectedItems = useMemo(() => {
    return _.map(filter, id => {
      const selectedItem = _.findLast(fullProductCategoryIds, item => item?.id === id);
      return { id, name: selectedItem?.name };
    });
  }, [filter, fullProductCategoryIds]);
  const renderFilterPanelDrawer = progressValue => {
    const parallax = progressValue.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    });
    const animatedStyles = {
      transform: [{ translateX: parallax }],
    };
    return (
      <Animated.View style={[styles.drawerContainer, animatedStyles]}>
        <FilterPanel />
      </Animated.View>
    );
  };
  //= ========= Use Effect Section========
  return (
    <DrawerLayout
      ref={filterPanelRef}
      drawerWidth={wp(266)}
      keyboardDismissMode="on-drag"
      drawerPosition={DrawerLayout.positions.Right}
      drawerType="front"
      drawerBackgroundColor="transparent"
      overlayColor="#00000080"
      renderNavigationView={renderFilterPanelDrawer}>
      <Container>
        <JitengHeaderContainer>
          <RowSpaceBetween full height={hp(44)}>
            <Icon
              name="left"
              type="antdesign"
              color={Colors.white}
              containerStyle={{ marginHorizontal: wp(15) }}
              onPress={() => {
                navigation.goBack();
              }}
            />
            <HeaderText>{t('category:Categories')}</HeaderText>
            <SearchBarContainer
              placeholder={t('common:search')}
              onChangeText={setSearchQuery}
              value={searchQuery}
              containerStyle={{
                marginHorizontal: wp(22),
                flexGrow: 1,
              }}
            />
          </RowSpaceBetween>
        </JitengHeaderContainer>
        <SelectHeaderPanel full height={hp(40)}>
          <Box flexShrink={1} mx={3}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filter.length === 0 ? (
                <PlaceholderText>{t('category:Categories')}</PlaceholderText>
              ) : (
                _.map(selectedItems, item => {
                  return (
                    <FilterItemButton
                      onPress={() => toggleCategoryFilter(item?.id)}
                      key={item?.id}
                      title={item?.name}
                      iconRight
                      icon={
                        <Icon
                          type="antdesign"
                          name="close"
                          color={Colors.signUpStepRed}
                          size={12}
                        />
                      }
                    />
                  );
                })
              )}
            </ScrollView>
          </Box>

          <FilterButton
            icon={<Icon name="filter" size={20} type="antdesign" color={Colors.grey1} />}
            title={`|  ${t('home:header:classification')}`}
            iconRight
            onPress={() => {
              filterPanelRef.current?.openDrawer();
            }}
          />
        </SelectHeaderPanel>
        {loading ? (
          <Content style={{ flex: 0 }} contentContainerStyle={{ flex: 1 }}>
            <ActivityIndicator
              color="black"
              size="large"
              style={{ flex: 1, alignSelf: 'center' }}
            />
          </Content>
        ) : (
          <>
            <Content
              contentContainerStyle={styles.contentContainerStyle}
              scrollEnabled={false}
              style={styles.contentView}>
              <View style={{ width: wp(87), backgroundColor: Colors.grey6 }}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ flexGrow: 1 }}>
                  {_.map(fullProductCategories, function (value, key) {
                    return (
                      <TopCategoryPressable
                        key={key}
                        onPress={() => {
                          setFocusCategoryId(key);
                        }}
                        disabled={key === focusCategoryId}>
                        {({ pressed }) => (
                          <StyledView pressed={pressed}>
                            <TopCategoryText disabled={key === focusCategoryId}>
                              {value?.name}
                            </TopCategoryText>
                          </StyledView>
                        )}
                      </TopCategoryPressable>
                    );
                  })}
                  {/*  {fullProductCategories.entrySeq().map(([key, value]) => {
                                return (
                                    <TopCategoryPressable
                                        key={key}
                                        onPress={() => {
                                            setFocusCategoryId(key);
                                        }}
                                        disabled={key === focusCategoryId}>
                                        {({ pressed }) => (
                                            <StyledView pressed={pressed}>
                                                <TopCategoryText disabled={key === focusCategoryId}>
                                                    {value?.name}
                                                </TopCategoryText>
                                            </StyledView>
                                        )}
                                    </TopCategoryPressable>
                                );
                            })} */}
                </ScrollView>
              </View>
              {focusCategoryId ? (
                <RightContainer>
                  <ParentTitlePressable
                    onPress={() =>
                      toggleCategoryFilter(
                        // fullProductCategories.getIn([focusCategoryId, 'id']),
                        fullProductCategories[focusCategoryId].id,
                      )
                    }>
                    <BadgedText
                      isSelected={isFiltered(
                        // fullProductCategories.getIn([focusCategoryId, 'id']),
                        fullProductCategories[focusCategoryId].id,
                      )}>
                      {/* {fullProductCategories.getIn([focusCategoryId, 'name'])} */}
                      {fullProductCategories[focusCategoryId].name}
                    </BadgedText>
                  </ParentTitlePressable>
                  <RightScrollView horizontal>
                    <SectionList
                      sections={activeSubCategory}
                      nestedScrollEnabled={true}
                      keyExtractor={keyExtractor}
                      renderItem={({ item }) => (
                        <SubCategoryPanel
                          category={item}
                          filter={filter}
                          onToggleCategoryFilter={toggleCategoryFilter}
                        />
                      )}
                      renderSectionHeader={({ section: { title, id } }) => {
                        return (
                          <ParentTitlePressable onPress={() => toggleCategoryFilter(id)}>
                            <BadgedText isSelected={isFiltered(id)}>{title}</BadgedText>
                          </ParentTitlePressable>
                        );
                      }}
                      keyboardShouldPersistTaps="always"
                      showsVerticalScrollIndicator={false}
                    />
                  </RightScrollView>
                </RightContainer>
              ) : null}
            </Content>
            <Box
              width="100%"
              backgroundColor={Colors.white}
              paddingX={3}
              paddingY={3}
              flexDirection="row"
              justifyContent="flex-end">
              <ResetButton title={t('common:Reset')} onPress={resetFilter} />
              <ApplyButton
                title={t('common:determine')}
                disabled={filter.length === 0}
                onPress={applyFilter}
              />
            </Box>
          </>
        )}
      </Container>
    </DrawerLayout>
  );
};

export default Category;
const HeaderText = styled.Text`
  align-self: center;
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  font-weight: 400;
  letter-spacing: -0.41px;
  line-height: 22px;
`;
const PlaceholderText = styled.Text`
  align-self: center;
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-weight: 400;
  line-height: 22px;
`;
const RightContainer = styled.View.attrs({})`
  flex-grow: 1;
  padding-left: ${Metrics.small}px;
  padding-right: ${Metrics.small}px;
`;
const RightScrollView = styled.ScrollView.attrs({
  contentContainerStyle: { flexGrow: 1 },
})``;
const TopCategoryText = styled.Text`
  align-self: center;
  color: ${props => (props.disabled ? Colors.signUpStepRed : Colors.grey3)};
  font-family: 'Microsoft YaHei';

  font-size: 12px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
`;
const ParentTitleText = styled.Text`
  align-self: center;
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-weight: 400;
  line-height: 22px;
  padding-bottom: 5px;
  padding-top: 5px;
  text-align: left;
`;
const ParentTitlePressable = styled(JitengPressable).attrs({})`
  align-self: flex-start;
  margin-top: 5px;
  margin-bottom: 5px;
`;
const ParentTitleButton = styled(Button).attrs({
  buttonStyle: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    borderWidth: 0,
  },
  titleStyle: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(12),
    lineHeight: adjustFontSize(22),
    color: Colors.grey2,
    textAlign: 'left',
  },
})``;
const FilterItemButton = styled(Button).attrs({
  containerStyle: {
    marginTop: hp(10),
    marginRight: wp(5),
  },
  buttonStyle: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.more,
    borderRadius: 15,
    paddingVertical: 0,
  },
  titleStyle: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(11),
    lineHeight: adjustFontSize(22),
    letterSpacing: adjustFontSize(-0.41),
    color: Colors.signUpStepRed,
    textAlign: 'center',
  },
})``;
const TopCategoryPressable = styled(Pressable).attrs()`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${hp(54)}px;
  border-bottom-width: 1px;
  border-bottom-color: ${Colors.grey15};
  border-left-width: ${props => (props.disabled ? '1px' : '0px')};
  border-left-color: ${props => (props.disabled ? Colors.signUpStepRed : 'transparent')};
  background-color: ${props => (props.disabled ? Colors.white : 'transparent')};
`;
const StyledView = styled.View`
  align-items: center;
  background-color: ${({ pressed }) => (pressed ? Colors.pinkHighlight : 'transparent')};
  height: 100%;
  justify-content: center;
  width: 100%;
`;
const CategoryPressable = styled(JitengPressable).attrs({
  style: { marginTop: 10 },
  onPressColor: Colors.previous,
})``;
const CategoryPhoto = styled.Image`
  height: ${categorySize.height}px;
  width: ${categorySize.width}px;
`;
const BadgeIcon = styled(Icon).attrs({
  containerStyle: {
    position: 'absolute',
    right: 5,
    top: 5,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  },
})``;
const EmptyContent = styled.View`
  align-items: center;
  background-color: ${Colors.grey5};
  height: ${categorySize.height}px;
  justify-content: center;
  width: ${categorySize.width}px;
`;
const EmptyImage = styled.Image`
  height: ${emptyImageSize.height}px;
  width: ${emptyImageSize.width}px;
`;
const ItemTitleText = styled.Text`
  color: ${Colors.grey3};
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
  width: ${categorySize.width}px;
`;
const SelectHeaderPanel = styled(RowSpaceBetween)`
  border-bottom-color: ${Colors.grey15};
  border-bottom-width: 1px;
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
  containerStyle: { marginRight: 10 },
})``;

const ResetButton = styled(Button).attrs({
  containerStyle: {
    marginRight: 6,
  },
  buttonStyle: {
    backgroundColor: Colors.grey5,
    borderWidth: 0,
    borderRadius: 5,
    paddingHorizontal: 20,
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
  },
  titleStyle: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(13),
    lineHeight: adjustFontSize(22),
    letterSpacing: adjustFontSize(-0.41),
    color: Colors.white,
  },
})``;
const BadgedText = withBadge(
  props => {
    return props.isSelected ? (
      <Icon name="checkcircle" type="antdesign" color={Colors.filterNotiRed} size={15} />
    ) : null;
  },
  {
    badgeStyle: { backgroundColor: Colors.white },
  },
)(ParentTitleText);

const BadgedCategoryPressable = React.memo(
  withBadge(
    props => {
      return props.isSelected ? (
        <Icon name="checkcircle" type="antdesign" color={Colors.filterNotiRed} size={15} />
      ) : null;
    },
    {
      badgeStyle: { backgroundColor: Colors.white, right: 20, top: 5 },
    },
  )(CategoryPressable),
);
