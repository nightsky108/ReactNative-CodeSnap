import React, {
  useState,
  useEffect,
  useMemo,
  useImperativeHandle,
  useRef,
  forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  StatusBar,
  Platform,
  Dimensions,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { Box } from 'native-base';
import { Icon, Text, Image } from 'react-native-elements';
import Video from 'react-native-video';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import TextInputMask from 'react-native-text-input-mask';
import valid from 'card-validator';
// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';

import LinearGradient from 'react-native-linear-gradient';
import PageControl from 'react-native-page-control';

import { TopBannerImgStyle } from '@common/GlobalStyles';
import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { RowBox } from '@src/common/StyledComponents';
import { Colors, Fonts } from '@theme';
import * as constants from '@utils/constant';

const IconSize = 25;
const { width: screenWidth } = Dimensions.get('window');
const CardSize = getAdjustSize({ width: 375, height: 376.66 });

const StripeCard = forwardRef(
  (
    {
      placeFolder,
      updateEnabledStatus,
      checkOutWithNewCard,
      checkOutWithUpdatedCard,
      card,
      isEdit,
      deleteCard,
      disable,
    },
    ref,
  ) => {
    const { t, i18n } = useTranslation();

    const [cardDetails, setCardDetails] = useState(card);
    const {
      control,
      handleSubmit,
      formState: { errors },
      getValues,
      setValue,
      reset,
    } = useForm();
    const cardNumberInputRef = useRef(null);
    const callCheckoutWithNewCard = handleSubmit(async data => {
      checkOutWithNewCard(data);
    });
    const callCheckoutWithUpdatedCard = handleSubmit(async data => {
      checkOutWithUpdatedCard({ ...data, id: card.id });
    });

    useImperativeHandle(ref, () => ({
      callCheckoutWithNewCard,
      callCheckoutWithUpdatedCard,
    }));
    useEffect(() => {
      setValue('cardholder', card.name);
      setValue('cardNumber', card.number);
      setValue('expiryMonth', card?.exp_month ? card?.exp_month.toString() : null);
      setValue('expiryYear', card?.exp_year ? card?.exp_year.toString() : null);
      setValue('CVC', card.cvc);
      return () => {};
    }, [card]);

    return (
      <>
        <Box marginBottom={`${hp(25)}px`} marginTop="10px">
          <Label>{t('common:cardholder')}</Label>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, onFocus, value } }) => (
              <CardInput
                placeholderTextColor={Colors.placeholderColor}
                onChangeText={(formatted, extracted) => {
                  onChange(formatted);
                }}
                value={value}
                returnKeyType="go"
              />
            )}
            name="cardholder"
            rules={{
              required: t('auth:Password is required'),
            }}
            defaultValue={null}
          />

          <Label>{t('common:card number')}</Label>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, onFocus, value } }) => (
              <CardInput
                ref={cardNumberInputRef}
                placeholder="4242 4242 4242 4242"
                placeholderTextColor={Colors.placeholderColor}
                keyboardType="numeric"
                // onChangeText={onChange}
                onChangeText={(formatted, extracted) => {
                  onChange(formatted);
                  // console.log(formatted); // +1 (123) 456-78-90
                  // console.log(extracted); // 1234567890
                }}
                disabled={isEdit}
                value={value}
                returnKeyType="go"
                errorMessage={errors?.password?.message}
                mask="[0000] [0000] [0000] [0000]"
              />
            )}
            name="cardNumber"
            rules={{
              required: t('auth:Password is required'),
            }}
            defaultValue={null}
          />
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-end"
          marginBottom={`${hp(25)}px`}>
          <Box flexDirection="row" flexGrow={0.8} justifyContent="space-between">
            <Box>
              <Label>{t('common:Month')}</Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, onFocus, value } }) => (
                  <CardInput
                    ref={cardNumberInputRef}
                    placeholder="00"
                    placeholderTextColor={Colors.placeholderColor}
                    keyboardType="numeric"
                    // onChangeText={onChange}
                    onChangeText={(formatted, extracted) => {
                      onChange(formatted);
                      // console.log(formatted); // +1 (123) 456-78-90
                      // console.log(extracted); // 1234567890
                    }}
                    value={value}
                    returnKeyType="go"
                    errorMessage={errors?.password?.message}
                    mask="[00]"
                  />
                )}
                name="expiryMonth"
                rules={{
                  required: t('auth:Password is required'),
                }}
                defaultValue={null}
              />
            </Box>
            <Box>
              <Label>{t('common:year')}</Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, onFocus, value } }) => (
                  <CardInput
                    ref={cardNumberInputRef}
                    placeholder="00"
                    placeholderTextColor={Colors.placeholderColor}
                    keyboardType="numeric"
                    // onChangeText={onChange}
                    onChangeText={(formatted, extracted) => {
                      onChange(formatted);
                      // console.log(formatted); // +1 (123) 456-78-90
                      // console.log(extracted); // 1234567890
                    }}
                    value={value}
                    returnKeyType="go"
                    errorMessage={errors?.password?.message}
                    mask="[00]"
                  />
                )}
                name="expiryYear"
                rules={{
                  required: t('auth:Password is required'),
                }}
                defaultValue={null}
              />
            </Box>
            <Box>
              <Label>CVS</Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, onFocus, value } }) => (
                  <CardInput
                    ref={cardNumberInputRef}
                    placeholder="000"
                    placeholderTextColor={Colors.placeholderColor}
                    keyboardType="numeric"
                    // onChangeText={onChange}
                    onChangeText={(formatted, extracted) => {
                      onChange(formatted);
                      // console.log(formatted); // +1 (123) 456-78-90
                      // console.log(extracted); // 1234567890
                    }}
                    value={value}
                    disabled={isEdit}
                    returnKeyType="done"
                    errorMessage={errors?.password?.message}
                    mask="[000]"
                  />
                )}
                name="CVC"
                rules={{
                  required: t('auth:Password is required'),
                }}
                defaultValue={null}
              />
            </Box>
          </Box>
          {isEdit ? (
            <RemoveButton
              disabled={disable}
              onPress={() => {
                deleteCard(card?.payMethodId);
              }}>
              {disable ? (
                <ActivityIndicator animating={true} color={Colors.signUpStepRed} />
              ) : (
                <RemoveButtonText>{t('common:delete')}</RemoveButtonText>
              )}
            </RemoveButton>
          ) : null}
        </Box>
      </>
    );
  },
);

StripeCard.propTypes = {
  updateEnabledStatus: PropTypes.func,
  checkOutWithNewCard: PropTypes.func,
  checkOutWithUpdatedCard: PropTypes.func,
  deleteCard: PropTypes.func,
  isEdit: PropTypes.bool,
  disable: PropTypes.bool,
  card: PropTypes.shape({
    payMethodId: PropTypes.string,
    id: PropTypes.string,
    number: PropTypes.string,
    exp_month: PropTypes.number,
    exp_year: PropTypes.number,
    cvc: PropTypes.string,
    name: PropTypes.string,
  }),
};
StripeCard.defaultProps = {
  updateEnabledStatus: () => {},
  checkOutWithNewCard: () => {},
  checkOutWithUpdatedCard: () => {},
  deleteCard: () => {},
  isEdit: false,
  disable: false,
  card: {
    payMethodId: null,
    id: null,
    number: null,
    exp_month: null,
    exp_year: null,
    cvc: null,
    name: null,
  },
};
// 冯琳
export default StripeCard;

const styles = StyleSheet.create({});

const PriceText = styled.Text`
  color: ${Colors.priceRed};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(20)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(26.4)}px;
  text-align: left;
`;
const PriceTitleText = styled.Text`
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(11)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(19.41)}px;
  text-align: left;
`;

const OldPriceText = styled(PriceTitleText)`
  margin-left: 4px;
  text-decoration-line: line-through; ;
`;
const DescriptionText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(14)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(24.71)}px;
  text-align: left;
`;
const CardInput = styled(TextInputMask)`
  border-color: ${Colors.grey4};
  border-radius: 5px;
  border-width: 1px;
  height: ${hp(36)}px;
  padding-left: 18px;
  padding-right: 18px;
`;
const Label = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(13)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(20)}px;
  margin-bottom: 8px;
  text-align: left;
`;
const RemoveButton = styled.TouchableOpacity`
  align-items: center;
  background-color: ${Colors.grey6};
  border-color: ${Colors.grey2};
  border-radius: 7px;
  border-width: 1px;
  height: ${hp(36)}px;
  justify-content: center;
  width: ${wp(54)}px;
`;
const RemoveButtonText = styled.Text`
  color: ${Colors.grey1};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(13)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(18)}px;
`;
