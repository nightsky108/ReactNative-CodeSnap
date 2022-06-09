import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, StatusBar, Platform, View, ImageBackground } from 'react-native';
import { Icon, Text, Image } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Box, HStack, Center } from 'native-base';
import { useLazyQuery } from '@apollo/client';
import moment from 'moment';
import Carousel, { Pagination } from 'react-native-snap-carousel';

//= ==custom components & containers  =======
import selfCorrectingInterval from '@utils/selfCorrectingInterval';
import { useIsMountedRef, useComponentSize } from '@common/usehook';

import { FocusAwareStatusBar, NormalHeaderContainer, JitengPressable } from '@components';

import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { Colors, Fonts } from '@theme';
import Images from '@assets/images';
import * as globals from '@utils/global';

import { SearchBarContainer } from '@src/common/StyledComponents';
//= ======Query ====================

import { FETCH_PRODUCT_PREVIEWS_BY_THEME } from '@modules/product/graphql';
import { ScrollView } from 'react-native-gesture-handler';
import { useSettingContext } from '@contexts/SettingContext';

const IconSize = 25;
const CardSize = getAdjustSize({ width: 166, height: 170 });
const EventContentSize = getAdjustSize({ width: 76, height: 107 });
const EventTimerImageSize = getAdjustSize({ width: 37, height: 19 });

const EventProductContainerSize = getAdjustSize({ width: 66, height: 107 });

const EventProductSize = getAdjustSize({ width: 48, height: 67 });

const CountTimer = ({ duration = 0 }) => {
  const { t, i18n } = useTranslation();
  const durationTimer = useRef(null);
  const isMountedRef = useIsMountedRef();
  const [durationTime, setDurationTime] = useState(duration);
  //= ======== State Section========
  useEffect(() => {
    if (isMountedRef?.current) {
      setDurationTime(duration);
    }
    return () => {};
  }, [duration, isMountedRef]);
  const { hours, minutes, seconds } = useMemo(() => {
    return globals.secondsToMS(durationTime);
  }, [durationTime]);
  const stopWritingTimer = useCallback(() => {
    selfCorrectingInterval.clearInterval(durationTimer.current);
    durationTimer.current = null;
  }, []);
  const updateDuration = useCallback(() => {
    if (isMountedRef?.current) {
      setDurationTime(s => {
        return s === 0 ? 0 : s - 1;
      });
    }
  }, [isMountedRef]);
  useEffect(() => {
    return () => {
      stopWritingTimer();
    };
  }, []);
  useEffect(() => {
    const startWritingTimer = () => {
      if (durationTimer.current === null) {
        durationTimer.current = selfCorrectingInterval.setInterval(updateDuration, 1000);
      }
    };
    if (isMountedRef?.current) {
      setDurationTime(duration);
      startWritingTimer();
    }
  }, [duration, isMountedRef, updateDuration]);

  return (
    <CounterContainer>
      <Box>
        <CountValueContent>
          <Text style={styles.timerValueTxt}>{hours}</Text>
        </CountValueContent>
        <Text style={styles.timerValueTxt}>{t('event:hour')}</Text>
      </Box>
      <Box>
        <CountValueContent>
          <Text style={styles.timerValueTxt}>{minutes}</Text>
        </CountValueContent>
        <Text style={styles.timerValueTxt}>{t('event:Minute')}</Text>
      </Box>
      <Box>
        <CountValueContent>
          <Text style={styles.timerValueTxt}>{seconds}</Text>
        </CountValueContent>
        <Text style={styles.timerValueTxt}>{t('event:second')}</Text>
      </Box>
    </CounterContainer>
  );
};
const ProductItem = ({ product }) => {
  return (
    <JitengPressable>
      <EventProductContainer>
        <Image
          source={{
            uri: product?.thumbnail ? product?.thumbnail?.url : product?.assets[0].url,
          }}
          style={styles.eventProductImg}
        />
        <Text style={styles.productOldCostTxt}>{product?.oldPrice?.formatted}</Text>
        <Text style={styles.productCostTxt}>{product?.price?.formatted}</Text>
      </EventProductContainer>
    </JitengPressable>
  );
};
const EventCard = ({ theme }) => {
  const { t } = useTranslation();
  const isMountedRef = useIsMountedRef();
  const { userLanguage, userCurrencyISO } = useSettingContext();
  const remainEventTime = useMemo(() => {
    if (theme?.start_time && theme?.end_time) {
      return moment(theme?.end_time).diff(moment(theme?.startTime), 'seconds');
    } else {
      return 0;
    }
  }, [theme]);

  const themeID = useMemo(() => {
    return theme?.id || null;
  }, [theme]);

  const [fetchProducts, { data: products }] = useLazyQuery(FETCH_PRODUCT_PREVIEWS_BY_THEME, {
    variables: {
      theme: themeID,
      skip: 0,
      limit: 3,
      currency: userCurrencyISO,
      language: userLanguage,
    },
  });
  useEffect(() => {
    if (themeID) {
      fetchProducts();
    }

    return () => {};
  }, [themeID]);
  const themeProducts = useMemo(() => {
    if (products) {
      return products?.productsByTheme?.collection;
    } else {
      return [];
    }
  }, [products]);
  const renderItem = useCallback(({ item, index }) => {
    return <ProductItem key={item?.id} product={item} />;
  }, []);
  //= ======== State Section========
  return (
    <Box
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      style={styles.cardContainer}>
      <SubContent>
        <RowContainer>
          <CircleView>
            <CardGradient startColor={Colors.purple1} endColor={Colors.purple2}>
              <CircleCenterView>
                <Icon name="clock" type="evilicon" color={Colors.white} size={15} />
              </CircleCenterView>
            </CardGradient>
          </CircleView>
          <Text style={styles.rushTitle}> {t('event:Rush to buy')}</Text>
        </RowContainer>
        <BodyContainer>
          <CardGradient startColor={Colors.headerRed0} endColor={Colors.headerRed1}>
            <ImageBackground source={Images.eventBannerImg} style={styles.eventBannerImg}>
              <Image source={Images.eventTimeImg} style={styles.eventTimeImg} />
              <Text style={styles.limitOfferTxt}>{t('event:Limited Time Offer')}</Text>
              <Text style={styles.limitNoteTxt}>{t('event:time note')}</Text>
              {remainEventTime > 0 && isMountedRef?.current ? (
                <CountTimer duration={remainEventTime} />
              ) : null}
            </ImageBackground>
          </CardGradient>
        </BodyContainer>
      </SubContent>
      <SubContent>
        <JitengPressable>
          <ProductRowContainer>
            <Text style={styles.rushTitle}> {t('event:Rush to buy')} </Text>
            <Icon
              name="right"
              type="antdesign"
              color={Colors.black}
              size={11}
              containerStyle={styles.nextIcon}
            />
          </ProductRowContainer>
        </JitengPressable>
        <BodyContainer>
          <Carousel
            data={themeProducts}
            renderItem={renderItem}
            sliderWidth={EventProductContainerSize.width}
            itemWidth={EventProductContainerSize.width}
            loop={true}
          />
        </BodyContainer>
      </SubContent>
    </Box>
  );
};
EventCard.propTypes = {
  theme: PropTypes.shape({}),
  // theme: PropTypes.oneOfType([PropTypes.object]),
};
EventCard.defaultProps = {
  theme: null,
};
function propsAreEqual(prevProps, nextProps) {
  return prevProps?.theme?.id === nextProps?.theme?.id;
}
export default React.memo(EventCard, propsAreEqual);
const styles = StyleSheet.create({
  cardContainer: {
    ...CardSize,
    borderRadius: wp(8),
    paddingTop: hp(9),
    paddingHorizontal: 7,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eventBannerImg: {
    ...EventContentSize,
    alignItems: 'center',
    paddingTop: hp(6),
  },
  eventTimeImg: {
    ...EventTimerImageSize,
  },
  eventProductImg: {
    ...EventProductSize,
  },
  rushTitle: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(12.5),
    lineHeight: adjustFontSize(16.5),

    textAlign: 'center',
    fontWeight: '400',
  },
  limitOfferTxt: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(10),
    lineHeight: adjustFontSize(13),
    color: Colors.white,

    textAlign: 'center',
    fontWeight: '400',
    marginVertical: hp(3),
  },
  limitNoteTxt: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(7),
    lineHeight: adjustFontSize(9),
    color: Colors.white,

    textAlign: 'center',
    fontWeight: '400',
  },
  timerValueTxt: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(9),
    lineHeight: adjustFontSize(12),
    color: Colors.white,

    textAlign: 'center',
    fontWeight: '400',
    textAlignVertical: 'center',
  },
  productOldCostTxt: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(10),
    lineHeight: adjustFontSize(13),
    color: Colors.black,
    textAlign: 'center',
    fontWeight: '400',
    textAlignVertical: 'center',
    textDecorationLine: 'line-through',
  },
  productCostTxt: {
    fontFamily: 'Microsoft YaHei',
    fontSize: adjustFontSize(12),
    lineHeight: adjustFontSize(16),
    color: Colors.priceRed,
    textAlign: 'center',
    fontWeight: '400',
    textAlignVertical: 'center',
  },
  nextIcon: {
    justifyContent: 'center',
  },
});

export const SubContent = styled.View`
  justify-content: flex-start;
`;

export const CircleView = styled.View`
  border-radius: 9px;
  height: 18px;
  overflow: hidden;
  width: 18px;
`;
export const CircleCenterView = styled.View`
  align-items: center;
  height: 18px;
  justify-content: center;
  width: 18px;
`;
export const RowContainer = styled.View`
  flex-direction: row;
`;
export const ProductRowContainer = styled(RowContainer)`
  justify-content: flex-end;
`;
export const CounterContainer = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  margin-bottom: 10px;
  margin-top: 10px;
  width: 100%;
`;
export const CountValueContent = styled.View`
  align-items: center;
  background-color: ${Colors.black};
  border-radius: 3px;
  height: 21px;
  justify-content: center;
  width: 19px;
`;
const BodyContainer = styled.View`
  margin-top: 21px;
`;
const EventProductContainer = styled.View`
  align-items: center;
  height: ${parseInt(EventProductContainerSize.height, 10)}px;
  justify-content: flex-end;
  width: ${parseInt(EventProductContainerSize.width, 10)}px;
`;
const CardGradient = styled(LinearGradient).attrs(props => ({
  colors: [props.startColor, props.endColor],
  start: { x: 0, y: 1 },
  end: { x: 1, y: 1 },
}))``;
