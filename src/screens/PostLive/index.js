import React, { useRef } from 'react';

//= ==third party plugins=======
import { useDispatch } from 'react-redux';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { Text } from 'react-native-elements';
import { v4 as uuidv4 } from 'uuid';
import { Box, HStack, Center } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { ActionSheet as CrossActionSheet } from 'react-native-cross-actionsheet';

import Spinner from 'react-native-loading-spinner-overlay';

//= ==custom components & containers  =======
import { Content, Container, DismissKeyboardView, JitengHeaderContainer } from '@components';
import { BackHeader } from '@containers';

//= ======selectors==========================

//= ======reducer actions====================

//= ==========apis=======================

//= =============utils==================================
import * as constants from '@utils/constant';

//= =============styles==================================
import { Colors, Metrics, Fonts } from '@theme';
import { wp, hp, adjustFontSize } from '@src/common/responsive';
import * as globals from '@utils/global';
import { styles } from './styles';
// import { StyleSheetFactory } from './styles';

// AssetType
//= =============images & constants ===============================
//= ============import end ====================

const PostLive = ({ navigation, route }) => {
  //= ========Hook Init===========
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const ActionSheetRef = useRef(null);
  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
    getValues,
    setValue,
    reset,
  } = useForm();
  // const styles = StyleSheetFactory({ theme });
  //= ========= Props Section========
  //= ======== State Section========

  //= ========= GraphQl query Section========
  //= ========= Use Effect Section========
  return (
    <Container>
      <BackHeader
        title="创建直播 "
        containerStyle={{ backgroundColor: Colors.white }}
        light={false}
      />
      <DismissKeyboardView
        contentContainerStyle={styles.contentContainerStyle}
        style={styles.contentView}>
        <Text h1>PostLive Page</Text>
      </DismissKeyboardView>
    </Container>
  );
};

export default PostLive;
