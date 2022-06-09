import React, {
  Component,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  PureComponent,
  useReducer,
} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Keyboard,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';

//= ==third party plugins=======
import { connect, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';
import { Box, HStack, Center } from 'native-base';
import { useQuery, NetworkStatus } from '@apollo/client';

import { DrawerActions, NavigationContainer } from '@react-navigation/native';
import { Icon, CheckBox, SocialIcon, Image, ListItem, Text } from 'react-native-elements';
import { v4 as uuidv4 } from 'uuid';
import Spinner from 'react-native-loading-spinner-overlay';
import { TabView, TabBar } from 'react-native-tab-view';

import _ from 'lodash';

//= ==custom components & containers  =======
import { Content, Container, NormalHeaderContainer } from '@components';
import { SearchBarContainer, RowSpaceBetween, RowBox } from '@src/common/StyledComponents';

//= ===inner component======================
//= ======selectors==========================

//= ======reducer actions====================

//= ======Query ====================

import { FETCH_USERS_PREVIEWS } from '@modules/users/graphql';
//= ==========apis=======================

//= =============utils==================================
import * as constants from '@utils/constant';

//= =============styles==================================
import { Colors, Metrics, Fonts } from '@theme';
import { hp } from '@src/common/responsive';
import FollowingSellers from './FollowingSellers';
import FollowerSellers from './FollowerSellers';
import { styles } from './styles';
// import { StyleSheetFactory } from './styles';

// AssetType
//= =============images & constants ===============================
//= ============import end ====================

const LazyPlaceholder = ({ route }) => {
  const { t, i18n } = useTranslation();
  return (
    <View style={styles.scene}>
      <Text>{route.title}…</Text>
    </View>
  );
};

const TabLabel = React.memo(({ route, focused, color }) => {
  return (
    <View>
      {focused ? (
        <ActiveTabTitle>{route.title}</ActiveTabTitle>
      ) : (
        <TabTitle>{route.title}</TabTitle>
      )}
    </View>
  );
});
const PageHeader = ({ navigation, onPressManage }) => {
  const { t, i18n } = useTranslation();
  return (
    <NormalHeaderContainer
      isStatusBarHidden={false}
      applyGradient={false}
      light={true}
      statusBarColor={Colors.grey4}
      leftComponent={{
        icon: 'left',
        type: 'antdesign',
        color: Colors.grey3,
        size: 25,
        onPress: () => {
          navigation.goBack();
        },
      }}
      centerComponent={<TitleText>{t('follow seller:my focus')}</TitleText>}
      rightComponent={
        <TouchableOpacity onPress={onPressManage}>
          <ManageButtonText>{t('common:management')}</ManageButtonText>
        </TouchableOpacity>
      }
    />
  );
};

const FollowSellers = ({ navigation, route }) => {
  //= ========Hook Init===========
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const routes = [
    { key: 'FollowingSellers', title: t('common:Following') },
    { key: 'FollowerSellers', title: t('common:Fan') },
  ];

  // const styles = StyleSheetFactory({ theme });
  //= ========= Props Section========
  const followingSellersRef = useRef(null);
  const followerSellersRef = useRef(null);
  //= ======== State Section========
  const [index, setIndex] = useState(0);
  const [followingsQuery, setFollowingsQuery] = useState('');
  const [followersQuery, setFollowersQuery] = useState('');
  //= ========= GraphQl query Section========
  //= ========= Use Effect Section========
  const onPressManage = useCallback(() => {
    if (index === 0) {
      followingSellersRef?.current?.toggleApplyMore();
    } else {
      followerSellersRef?.current?.toggleApplyMore();
    }
  }, [index]);
  const handleSearchChange = useCallback(
    q => {
      if (index === 0) {
        setFollowingsQuery(q);
      } else {
        setFollowersQuery(q);
      }
    },
    [index],
  );
  const renderLabel = ({ route, focused, color }) => {
    return <TabLabel route={route} focused={focused} />;
  };
  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: Colors.black,
      }}
      style={{
        backgroundColor: Colors.grey6,
      }}
      renderLabel={renderLabel}
    />
  );
  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'FollowingSellers':
        return <FollowingSellers ref={followingSellersRef} searchQuery={followingsQuery} />;
      case 'FollowerSellers':
        return <FollowerSellers ref={followerSellersRef} searchQuery={followersQuery} />;
      default:
        return null;
    }
  };
  return (
    <Container style={styles.container}>
      <PageHeader navigation={navigation} onPressManage={onPressManage} />
      {/*  <Box width="100%" paddingX="12px">
                <SearchBarContainer
                    placeholder={t('follow seller:followedSearch')}
                    containerStyle={{ width: '100%', height: hp(35) }}
                    leftIconColor="#8E8E93"
                    value={index === 0 ? followersQuery : followersQuery}
                    onChangeText={handleSearchChange}
                />
            </Box> */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        animationEnabled={false}
        swipeEnabled={false}
      />
    </Container>
  );
};

export default FollowSellers;

const TitleText = styled.Text`
  align-self: center;
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  text-align: center;
`;
const ManageButtonText = styled.Text`
  align-self: center;
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: 15px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
`;
const ActiveTabTitle = styled.Text`
  align-self: center;
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: 11px;
  font-weight: 400;
  line-height: 15px;
  text-align: center;
`;
const TabTitle = styled.Text`
  align-self: center;
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: 11px;
  font-weight: 400;
  line-height: 15px;
  text-align: center;
`;
