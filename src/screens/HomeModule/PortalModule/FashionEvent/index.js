import React, { useState, useCallback, useRef } from 'react';

//= ==third party plugins=======
import { useDispatch } from 'react-redux';

import { v4 as uuidv4 } from 'uuid';

import { useQuery } from '@apollo/client';

//= ==custom components & containers  =======
import { Content, Container } from '@components';
import { JitengMidHeader, TopBannerPanel } from '@containers';

//= ======selectors==========================

//= ======reducer actions====================
//= =====hook data================================
import { useTopProductCategories } from '@data/useProductCategories';
import { useUserSettings } from '@data/useUser';

//= ======Query ====================
import { FETCH_BANNER_BY_IDENTIFIER } from '@modules/banner/graphql';

//= ==========apis=======================

//= =============utils==================================

//= =============styles==================================
import { styles } from './styles';
// import { StyleSheetFactory } from './styles';
import CategoryPanel from './CategoryPanel';

const LazyEventPanel = React.lazy(() => import('./EventPanel'));

// AssetType
//= =============images & constants ===============================
//= ============import end ====================
const Banner = {
  thumbnail: {
    url: 'https://picsum.photos/id/1/375/186',
  },
};
const faker = require('faker');

faker.locale = 'zh_CN';

const EventItems = Array(9)
  .fill('')
  .map((item, i) => ({
    id: uuidv4(),
    title: `${faker.name.firstName()} ${faker.name.firstName()} ${faker.name.firstName()} ${faker.name.lastName()}`,
    description: faker.lorem.sentence(),

    thumbnail: {
      url: faker.image.food(),
      // url: null,
    },
    price: {
      amount: 149684,
      amountISO: 1496.84,
      currency: 'CNY',
      formatted: `￥${faker.datatype.float()}`,
    },
  }));

const FashionEvent = ({ navigation, route }) => {
  //= ========Hook Init===========
  const dispatch = useDispatch();
  const scrollTarget = useRef({});
  const categoryPanelRef = useRef(null);
  const { themeId } = route?.params;
  const { topProductCategories } = useTopProductCategories();
  const { data: bannerData } = useQuery(FETCH_BANNER_BY_IDENTIFIER, {
    variables: {
      identifier: 'a',
    },
  });
  const { userCurrencyISO } = useUserSettings();
  // const styles = StyleSheetFactory({ theme });
  //= ========= Props Section========
  //= ======== State Section========
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  //= ========= GraphQl query Section========
  const onGoToEventProducts = useCallback(id => {
    navigation.navigate('EventProducts', { categoryId: id });
  }, []);
  //= ========= Use Effect Section========
  const onScrollPanel = id => {
    categoryPanelRef.current?._root?.scrollToPosition(0, scrollTarget.current[id] || 0);
    setActiveCategoryId(id);
  };
  const keyExtractor = useCallback(item => item.id, []);
  return (
    <Container>
      <JitengMidHeader
        onLeftPress={() => {
          navigation.goBack();
        }}
      />

      {/* <BannerPanel banner={Banner} /> */}
      {bannerData?.bannerByIdentifier ? (
        <TopBannerPanel banner={bannerData?.bannerByIdentifier} />
      ) : null}

      <CategoryPanel
        categories={topProductCategories}
        onSelectCategory={onScrollPanel}
        activeCategoryId={activeCategoryId}
      />
      <Content
        contentContainerStyle={styles.contentContainerStyle}
        showsVerticalScrollIndicator={false}
        ref={categoryPanelRef}
        style={styles.contentView}>
        {topProductCategories.map(item => {
          return (
            <LazyEventPanel
              title={item.name}
              key={item.id}
              onPressItem={onGoToEventProducts}
              categoryId={item?.id}
              themId={themeId}
              onLayout={event => {
                scrollTarget.current[item.id] = event.nativeEvent.layout.y;
              }}
              currency={userCurrencyISO}
            />
          );
        })}
      </Content>
    </Container>
  );
};

export default FashionEvent;
