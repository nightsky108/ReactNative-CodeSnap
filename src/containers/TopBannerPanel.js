import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, StatusBar, Platform, Dimensions, View, TouchableOpacity } from 'react-native';
import { Colors, Fonts } from '@theme';
import PagerView from 'react-native-pager-view';
import { TopBannerImgStyle } from '@common/GlobalStyles';

import { Header } from 'react-native-elements';
import { wp, hp } from '@src/common/responsive';
import { FocusAwareStatusBar, TopBannerImage } from '@components';
import { HorizontalGradient } from '@src/common/StyledComponents';
import LinearGradient from 'react-native-linear-gradient';
import PageControl from 'react-native-page-control';

import { useNavigation, useRoute } from '@react-navigation/native';

const IconSize = 25;
const { width: screenWidth } = Dimensions.get('window');

const TopBannerPanel = ({ banner, onPress }) => {
  //= ======== State Section========
  const [currentPage, setCurrentPage] = useState(0);
  const onScroll = event => {
    setCurrentPage(event?.nativeEvent?.position || 0);
  };
  if (!banner || !banner?.assets) {
    return <View style={[styles.emptyContainer, TopBannerImgStyle]} />;
  }

  return (
    <View style={[styles.container, TopBannerImgStyle]}>
      <PagerView onPageSelected={onScroll} style={styles.pagerViewContainer}>
        {banner?.assets.map((item, index) => {
          return (
            <TouchableOpacity
              key={index.toString()}
              activeOpacity={0.5}
              delayPressIn={50}
              onPress={onPress}>
              <TopBannerImage bannerUrl={item.image} />
            </TouchableOpacity>
          );
        })}
      </PagerView>
      <PageControl
        style={styles.dotViewContainer}
        numberOfPages={banner?.assets.length}
        currentPage={currentPage}
        hidesForSinglePage
        pageIndicatorTintColor={Colors.whiteOpacity}
        currentPageIndicatorTintColor={Colors.white}
        indicatorStyle={{ borderRadius: wp(4) }}
        currentIndicatorStyle={{ borderRadius: 5 }}
        indicatorSize={{ width: wp(8), height: wp(8) }}
      />
    </View>
  );
};
TopBannerPanel.propTypes = {
  banner: PropTypes.oneOfType([PropTypes.object]),
  onPress: PropTypes.func,
};
TopBannerPanel.defaultProps = {
  banner: null,
  onPress: () => {},
};
export default React.memo(TopBannerPanel);

const styles = StyleSheet.create({
  pagerViewContainer: {
    flex: 1,
  },
  dotViewContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
  },
  emptyContainer: {
    backgroundColor: Colors.grey5,
  },
});
