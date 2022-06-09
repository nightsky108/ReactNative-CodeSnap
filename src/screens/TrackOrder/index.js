import React from 'react';

//= ==third party plugins=======
import { useDispatch } from 'react-redux';

import { Text } from 'react-native-elements';
// import { v4 as uuidv4 } from 'uuid';
// import { Box, HStack, Center } from 'native-base';
import { useTranslation } from 'react-i18next';

// import Spinner from 'react-native-loading-spinner-overlay';

//= ==custom components & containers  =======
import { Content, Container, JitengHeaderContainer } from '@components';
import { OrderModuleHeader } from '@containers';

//= ======selectors==========================

//= ======reducer actions====================

//= ==========apis=======================

//= =============utils==================================
// import * as constants from '@utils/constant';

//= =============styles==================================
// import { Colors, Metrics, Fonts } from '@theme';
// import { wp, hp, adjustFontSize } from '@src/common/responsive';
import { styles } from './styles';
// import { StyleSheetFactory } from './styles';
import { OrderContentPanel, TrackInfoPanel } from './containers';
// AssetType
//= =============images & constants ===============================
//= ============import end ====================

const TrackOrder = ({ navigation, route }) => {
  //= ========Hook Init===========
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  // const orderId = route?.params?.orderId;

  const orderId = '990a95a7-82d2-49a5-a152-07370d0afe94';
  // const styles = StyleSheetFactory({ theme });
  //= ========= Props Section========
  //= ======== State Section========

  //= ========= GraphQl query Section========
  //= ========= Use Effect Section========
  return (
    <Container>
      <OrderModuleHeader title="查看物流" />
      <Content contentContainerStyle={styles.contentContainerStyle} style={styles.contentView}>
        <OrderContentPanel />
        <TrackInfoPanel />
      </Content>
    </Container>
  );
};

export default TrackOrder;
