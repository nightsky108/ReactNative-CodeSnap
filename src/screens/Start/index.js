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

// AssetType
//= =============images & constants ===============================
//= ============import end ====================

const Connections = ({ navigation, route }) => {
  //= ========Hook Init===========
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  // const styles = StyleSheetFactory({ theme });
  //= ========= Props Section========
  //= ======== State Section========

  //= ========= GraphQl query Section========
  //= ========= Use Effect Section========
  return (
    <Container>
      <JitengHeaderContainer />
      <Content contentContainerStyle={styles.contentContainerStyle} style={styles.contentView}>
        <Text h1>Start Page</Text>
      </Content>
    </Container>
  );
};

export default Connections;
