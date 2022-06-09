import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions } from 'react-native';
import Toast from 'react-native-root-toast';
import { useIsFocused } from '@react-navigation/native';

import { Box, HStack } from 'native-base';
import { Icon } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';

import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { CheckoutAddressSection } from '@components';
import { Colors } from '@theme';
import { ScrollView } from 'react-native-gesture-handler';
import { useCheckoutInputContext } from '@contexts/CheckoutInputContext';

const photo = 'https://picsum.photos/id/1/344/109';
const IconSize = 25;
const { width: screenWidth } = Dimensions.get('window');
const SelectedItemSize = getAdjustSize({ width: 23.75, height: 29.02 });
const SELECT = 0,
  ADDCART = 1,
  BUY = 2;
const AttributeOptionPanelSimple = ({
  variationKeyList,
  variationKeyValPairMap,
  variationValAttrIdPairMap,
  attrIDList,
}) => {
  //= ======== State Section========
  const [selectedKeyPairs, setSelectedKeyPairs] = useState({});
  const [possibleAttrIDList, setPossibleAttrIDList] = useState(attrIDList);

  const handleVariation = useCallback(
    ({ key, value, isDisabled }) => {
      let oldSelectedKeyPairs = { ...selectedKeyPairs };
      let previousPossibleAttrIDList = [...possibleAttrIDList];
      if (isDisabled) {
        previousPossibleAttrIDList = attrIDList;
        oldSelectedKeyPairs = {};
      }
      setSelectedKeyPairs({
        ...oldSelectedKeyPairs,
        [key]: value,
      });

      const difference = previousPossibleAttrIDList.filter(x =>
        variationValAttrIdPairMap[value].includes(x),
      );

      setPossibleAttrIDList(difference);
    },
    [attrIDList, possibleAttrIDList, selectedKeyPairs, variationValAttrIdPairMap],
  );
  const candidateVariationKeyValPairMap = useMemo(() => {
    const data = {};
    _.map(variationKeyList, key => {
      data[key] = [];
      const filteredValArr = _.filter(variationKeyValPairMap[key] || [], val => {
        const difference = possibleAttrIDList.filter(x =>
          variationValAttrIdPairMap[val].includes(x),
        );
        return difference.length > 0;
      });
      data[key] = filteredValArr;
    });
    return data;
  }, [possibleAttrIDList]);
  const calcMatchedIDS = useCallback(
    ({ key }) => {
      const restKeyValPairMap = { ...selectedKeyPairs };
      if (key in restKeyValPairMap) {
        delete restKeyValPairMap[key];
      }
      if (Object.keys(restKeyValPairMap).length === 0) {
        return attrIDList;
      }
      let attrIDArr = [];
      attrIDArr = _.map(Object.keys(restKeyValPairMap), item => {
        return _.concat(attrIDArr, variationValAttrIdPairMap[restKeyValPairMap[item]]);
      });

      if (attrIDArr.length === 0) {
        return [];
      }
      attrIDArr =
        attrIDArr.length === 1
          ? attrIDArr[0]
          : attrIDArr.reduce((a, arr) => a.filter(num => arr.includes(num)));

      return attrIDArr;
    },
    [selectedKeyPairs],
  );

  // console.log('possibleAttrIDList', possibleAttrIDList);
  // console.log('selectedKeyPairs', selectedKeyPairs);
  // console.log('candidateVariationKeyValPairMap', candidateVariationKeyValPairMap);

  return (
    <>
      {_.map(variationKeyList, (key, index) => {
        // const attrIDArr = calcMatchedIDS({ key });
        return (
          <Box width="100%" key={index.toString()}>
            <ItemTitleText>{key}</ItemTitleText>
            <Box flexDirection="row" flexWrap="wrap" marginTop="5px">
              {variationKeyValPairMap?.[key]
                ? _.map(variationKeyValPairMap?.[key], (item, index) => {
                    const isSelected = selectedKeyPairs[key] === item;
                    const isDisableItem = !candidateVariationKeyValPairMap?.[key].includes(item);
                    return (
                      <VariationButton
                        active={isSelected}
                        onPress={() => {
                          handleVariation({
                            key,
                            value: item,
                            isDisabled: isDisableItem,
                          });
                        }}
                        key={index.toString()}>
                        <VariationButtonText
                          active={isSelected}
                          //  disabled={isDisableItem}
                        >
                          {item}
                        </VariationButtonText>
                      </VariationButton>
                    );
                  })
                : null}
            </Box>
          </Box>
        );
      })}
    </>
  );
};
const AttributeOptionPanel = ({
  variationKeyList,
  variationKeyValPairMap,
  variationValAttrIdPairMap,
  attrIDList,
  onSelectAttrId,
  selectedAttributeId,
}) => {
  //= ======== State Section========
  const [selectedKeyPairs, setSelectedKeyPairs] = useState({});
  const [possibleAttrIDList, setPossibleAttrIDList] = useState(attrIDList);

  const handleVariation = useCallback(
    ({ key, value, isDisabled }) => {
      let oldSelectedKeyPairs = { ...selectedKeyPairs };
      let previousPossibleAttrIDList = [...possibleAttrIDList];
      const deSelect = oldSelectedKeyPairs[key] === value;
      if (isDisabled) {
        previousPossibleAttrIDList = attrIDList;
        oldSelectedKeyPairs = {};
      } else if (oldSelectedKeyPairs[key]) {
        // user change selected key (ex: change color)
        delete oldSelectedKeyPairs[key];
        let bufPreviousPossibleAttrIDList = [];
        bufPreviousPossibleAttrIDList = _.map(Object.keys(oldSelectedKeyPairs), item => {
          return _.union(
            _.concat(
              previousPossibleAttrIDList,
              variationValAttrIdPairMap[oldSelectedKeyPairs[item]],
            ),
          );
        });
        if (bufPreviousPossibleAttrIDList.length > 0) {
          previousPossibleAttrIDList =
            bufPreviousPossibleAttrIDList.length === 1
              ? bufPreviousPossibleAttrIDList[0]
              : bufPreviousPossibleAttrIDList.reduce((a, arr) =>
                  a.filter(num => arr.includes(num)),
                );
        } else {
          previousPossibleAttrIDList = attrIDList;
        }
      }

      if (!deSelect) {
        setSelectedKeyPairs({
          ...oldSelectedKeyPairs,
          [key]: value,
        });
        const difference = previousPossibleAttrIDList.filter(x =>
          variationValAttrIdPairMap[value].includes(x),
        );

        setPossibleAttrIDList(difference);
      } else {
        setSelectedKeyPairs(oldSelectedKeyPairs);
        setPossibleAttrIDList(previousPossibleAttrIDList);
      }
    },
    [attrIDList, possibleAttrIDList, selectedKeyPairs, variationValAttrIdPairMap],
  );
  const candidateVariationKeyValPairMap = useMemo(() => {
    const data = {};
    _.map(variationKeyList, key => {
      data[key] = [];
      const filteredValArr = _.filter(variationKeyValPairMap[key] || [], val => {
        const difference = possibleAttrIDList.filter(x =>
          variationValAttrIdPairMap[val].includes(x),
        );
        return difference.length > 0;
      });
      data[key] = filteredValArr;
    });
    return data;
  }, [possibleAttrIDList, variationKeyList, variationKeyValPairMap, variationValAttrIdPairMap]);
  useEffect(() => {
    let newSelectedId = null;
    if (Object.keys(selectedKeyPairs).length === variationKeyList.length) {
      newSelectedId = possibleAttrIDList[0] || null;
    }

    if (newSelectedId !== selectedAttributeId) {
      onSelectAttrId(newSelectedId);
    }
    return () => {};
  }, [selectedKeyPairs, possibleAttrIDList, variationKeyList, onSelectAttrId, selectedAttributeId]);
  const calcMatchedIDS = useCallback(
    ({ key }) => {
      const restKeyValPairMap = { ...selectedKeyPairs };
      if (key in restKeyValPairMap) {
        delete restKeyValPairMap[key];
      }
      if (Object.keys(restKeyValPairMap).length === 0) {
        return attrIDList;
      }
      let attrIDArr = [];
      attrIDArr = _.map(Object.keys(restKeyValPairMap), item => {
        return _.concat(attrIDArr, variationValAttrIdPairMap[restKeyValPairMap[item]]);
      });

      if (attrIDArr.length === 0) {
        return [];
      }
      attrIDArr =
        attrIDArr.length === 1
          ? attrIDArr[0]
          : attrIDArr.reduce((a, arr) => a.filter(num => arr.includes(num)));

      return attrIDArr;
    },
    [attrIDList, selectedKeyPairs, variationValAttrIdPairMap],
  );

  // console.log('possibleAttrIDList', possibleAttrIDList);
  // console.log('selectedKeyPairs', selectedKeyPairs);
  // console.log('variationKeyList', variationKeyList);
  // console.log('candidateVariationKeyValPairMap', candidateVariationKeyValPairMap);

  return (
    <>
      {_.map(variationKeyList, (key, index) => {
        const attrIDArr = calcMatchedIDS({ key });
        return (
          <Box width="100%" key={index.toString()}>
            <ItemTitleText>{key}</ItemTitleText>
            <Box flexDirection="row" flexWrap="wrap" marginTop="5px">
              {variationKeyValPairMap?.[key]
                ? _.map(variationKeyValPairMap?.[key], (item, index) => {
                    const isSelected = selectedKeyPairs[key] === item;
                    const isDisableItem = !candidateVariationKeyValPairMap?.[key].includes(item);
                    const isMatchedItem =
                      attrIDArr.filter(x => variationValAttrIdPairMap[item].includes(x)).length > 0;
                    return (
                      <VariationButton
                        active={isSelected}
                        onPress={() => {
                          handleVariation({
                            key,
                            value: item,
                            isDisabled: !isMatchedItem,
                          });
                        }}
                        key={index.toString()}>
                        <VariationButtonText active={isSelected} disabled={!isMatchedItem}>
                          {item}
                        </VariationButtonText>
                      </VariationButton>
                    );
                  })
                : null}
            </Box>
          </Box>
        );
      })}
    </>
  );
};
AttributeOptionPanel.propTypes = {
  variationKeyList: PropTypes.arrayOf(PropTypes.string),
  variationKeyValPairMap: PropTypes.shape({}),
  variationValAttrIdPairMap: PropTypes.shape({}),
  attrIDList: PropTypes.arrayOf(PropTypes.string),
  onSelectAttrId: PropTypes.func,
  selectedAttributeId: PropTypes.string,
};
AttributeOptionPanel.defaultProps = {
  variationKeyList: [],
  variationKeyValPairMap: {},
  variationValAttrIdPairMap: {},
  attrIDList: [],
  onSelectAttrId: () => {},
  selectedAttributeId: null,
};
const SelectQuantityPanel = ({ account = 1, limit = 1, updateAccount = () => {} }) => {
  useEffect(() => {
    if (account > limit) {
      updateAccount(limit);
    }
    return () => {};
  }, [account, limit, updateAccount]);
  return (
    <Box flexDirection="row">
      <QuantityButton
        disabled={account === 1}
        onPress={() => {
          updateAccount(account - 1);
        }}>
        <QuantityButtonText disabled={account === 1}>-</QuantityButtonText>
      </QuantityButton>
      <QuantityValueContent>
        <QuantityValue>{account}</QuantityValue>
      </QuantityValueContent>
      <QuantityButton
        disabled={account >= limit}
        onPress={() => {
          updateAccount(account + 1);
        }}>
        <QuantityButtonText disabled={account >= limit}>+</QuantityButtonText>
      </QuantityButton>
    </Box>
  );
};
const SelectAttributesPanel = ({
  attributes,
  onClosePanel,
  attrVariationInfo,
  productInfo,
  action,
  onNavigateCheckOut,
  onCallAddProductOnCart,
}) => {
  //= ======== State Section========
  const { checkoutOneItemInput, updateCheckOutInput, isPendingCalcRate, isPossibleCheckout } =
    useCheckoutInputContext();
  const { productAttribute: selectedAttributeId, quantity } = checkoutOneItemInput;
  const { t, i18n } = useTranslation();
  const isFocused = useIsFocused();
  const { variationKeyList, variationKeyValPairMap, variationValAttrIdPairMap, attrIDList } =
    attrVariationInfo;
  const onSelectAttrId = useCallback(
    id => {
      if (id !== selectedAttributeId) {
        if (id === null) {
          updateCheckOutInput({ productAttribute: id, attributeInfo: null });
        } else {
          const attributeInfo = _.findLast(attributes, item => item?.id === id);
          if (attributeInfo.quantity > 0) {
            updateCheckOutInput({ quantity: 1, productAttribute: id, attributeInfo });
          } else {
            updateCheckOutInput({ productAttribute: id, attributeInfo });
          }
        }
      }
    },
    [attributes, selectedAttributeId, updateCheckOutInput],
  );
  useEffect(() => {
    if (attributes.length === 1) {
      onSelectAttrId(attributes[0]?.id);
    }
    return () => {};
  }, [attributes, onSelectAttrId]);
  const updateQuantity = account => {
    if (quantity !== account && account !== 0) {
      updateCheckOutInput({ quantity: account });
    }
  };
  const info = useMemo(() => {
    if (!selectedAttributeId) {
      return productInfo;
    } else {
      const activeAttr = _.filter(attributes, attr => attr?.id === selectedAttributeId)[0];
      return {
        price: activeAttr?.price?.formatted || '0',
        quantity: activeAttr?.quantity || 0,
        thumbnail: activeAttr?.asset || null,
      };
    }
  }, [attributes, productInfo, selectedAttributeId]);
  const onCallAddCart = () => {
    // if (isPendingCalcRate) return;
    if (!isPossibleCheckout) {
      Toast.show(`please select `, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.CENTER,
        backgroundColor: Colors.toastColor,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    } else {
      onCallAddProductOnCart();
      onClosePanel();
    }
  };
  const onCallBuy = () => {
    // if (isPendingCalcRate) return;
    if (!isPossibleCheckout) {
      Toast.show(`please select `, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.CENTER,
        backgroundColor: Colors.toastColor,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    } else {
      onNavigateCheckOut();
      onClosePanel();
    }
  };
  return (
    <Box py={`${hp(17)}px`} px={`${wp(16)}px`} width="100%" flex={1}>
      <Box width="100%" justifyContent="flex-end" flexDirection="row">
        <Icon
          name="closecircleo"
          type="antdesign"
          color={Colors.grey4}
          size={wp(22)}
          onPress={onClosePanel}
        />
      </Box>
      <Box width="100%" flexDirection="row">
        <AssetPhoto source={{ uri: info?.thumbnail?.url }} />
        <Box ml={`${wp(32)}px`} justifyContent="center">
          <CostText>{info.price}</CostText>
          <QuantityText>庫存{info.quantity}件</QuantityText>
          <DescriptionText>請選擇 顔色 分類 尺碼 容量</DescriptionText>
        </Box>
      </Box>

      <Divider />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box
          width="100%"
          backgroundColor={Colors.white}
          paddingY={`${hp(5)}px`}
          marginBottom={`${hp(10.28)}px`}>
          <CheckoutAddressSection isDeliveryAddress={true} onPressChangeAddress={() => {}} />
        </Box>
        <Box
          width="100%"
          backgroundColor={Colors.white}
          paddingY={`${hp(5)}px`}
          marginBottom={`${hp(10.28)}px`}>
          <CheckoutAddressSection isDeliveryAddress={false} onPressChangeAddress={() => {}} />
        </Box>

        {attributes.length > 1 && isFocused ? (
          <>
            <Divider />
            <Box>
              <AttributeOptionPanel
                variationKeyList={variationKeyList}
                variationKeyValPairMap={variationKeyValPairMap}
                variationValAttrIdPairMap={variationValAttrIdPairMap}
                attrIDList={attrIDList}
                onSelectAttrId={onSelectAttrId}
                selectedAttributeId={selectedAttributeId}
              />
            </Box>
          </>
        ) : null}
        <Divider />
        {selectedAttributeId ? (
          <Box width="100%" flexDirection="row" justifyContent="space-between">
            <QuantityPanelTitle>購買數量</QuantityPanelTitle>
            <SelectQuantityPanel
              limit={info?.quantity}
              account={quantity}
              updateAccount={updateQuantity}
            />
          </Box>
        ) : null}
      </ScrollView>
      {action === SELECT ? (
        <HStack width="100%">
          <AddCartButton onPress={onCallAddCart}>
            <CheckoutButtonText>{t('checkout:add to Shopping Cart')}</CheckoutButtonText>
          </AddCartButton>
          <BuyButton onPress={onCallBuy}>
            <CheckoutButtonText> {t('checkout:Buy now')}</CheckoutButtonText>
          </BuyButton>
        </HStack>
      ) : action === BUY ? (
        <HStack width="100%">
          <BuyFullButton onPress={onCallBuy}>
            <CheckoutButtonText> {t('checkout:Buy now')}</CheckoutButtonText>
          </BuyFullButton>
        </HStack>
      ) : (
        <HStack width="100%">
          <AddCartFullButton onPress={onCallAddCart}>
            <CheckoutButtonText>{t('checkout:add to Shopping Cart')}</CheckoutButtonText>
          </AddCartFullButton>
        </HStack>
      )}
    </Box>
  );
};
SelectAttributesPanel.propTypes = {
  attrVariationInfo: PropTypes.shape({
    variationKeyList: PropTypes.arrayOf(PropTypes.string),
    variationKeyValPairMap: PropTypes.shape({}),
    variationValAttrIdPairMap: PropTypes.shape({}),
    attrIDList: PropTypes.arrayOf(PropTypes.string),
  }),
  attributes: PropTypes.arrayOf(PropTypes.object),
  onClosePanel: PropTypes.func,
  productInfo: PropTypes.shape({
    price: PropTypes.string,
    quantity: PropTypes.number,
    thumbnail: PropTypes.shape({}),
  }),
  checkoutOneItemInput: PropTypes.shape({
    productAttribute: PropTypes.string,
    quantity: PropTypes.number,
  }),
  onNavigateCheckOut: PropTypes.func,
  onCallAddProductOnCart: PropTypes.func,
  action: PropTypes.number,
};
SelectAttributesPanel.defaultProps = {
  onClosePanel: () => {},
  attrVariationInfo: {
    variationKeyList: [],
    variationKeyValPairMap: {},
    variationValAttrIdPairMap: {},
    attrIDList: [],
  },
  productInfo: {
    price: '0',
    quantity: 0,
    thumbnail: null,
  },
  attributes: [],
  checkoutOneItemInput: {
    productAttribute: null,
    quantity: 0,
  },
  onNavigateCheckOut: () => {},
  onCallAddProductOnCart: () => {},
  action: SELECT,
};
// 冯琳
export default React.memo(SelectAttributesPanel);

const styles = StyleSheet.create({});

const TitleText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(14)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(18.48)}px;
  text-align: left;
`;

const MoreProductButton = styled.TouchableOpacity`
  align-items: center;
  border-color: ${Colors.signUpStepRed};
  border-radius: 15px;
  border-width: 1px;
  flex-direction: row;
  justify-content: center;
  margin-right: ${wp(11.08)}px;
`;
const AssetPhoto = styled(FastImage)`
  border-radius: 2px;
  height: ${wp(95)}px;
  margin-right: ${wp(4.15)}px;
  width: ${wp(95)}px;
`;
const CostText = styled.Text`
  color: ${Colors.priceRed};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(20)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(26.4)}px;
  text-align: left;
`;
const DescriptionText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(15.84)}px;
  text-align: left;
`;
const QuantityText = styled.Text`
  color: ${Colors.grey3};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(15.84)}px;
  margin-bottom: 5px;
  margin-top: 5px;
  text-align: left;
`;
const ItemTitleText = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(12)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(21.18)}px;
  text-align: left;
`;
const AddressText = styled.Text`
  color: ${Colors.grey2};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(11)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(19.41)}px;
  text-align: left;
`;
const Divider = styled.View`
  background-color: ${Colors.grey5};
  height: 1px;
  margin-bottom: 17.75px;
  margin-top: 17.75px;
  width: 100%;
`;
const AddressButton = styled.TouchableOpacity`
  align-items: center;
  background-color: ${Colors.white};
  border-radius: 5px;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 3px;
  padding-top: 3px;
`;
const VariationButton = styled.TouchableOpacity`
  align-items: center;
  background-color: ${props => (props.active ? '#FFEDED' : Colors.grey6)};
  border-color: ${props => (props.active ? Colors.discountPrice : Colors.grey6)};
  border-radius: 5px;
  border-width: 1px;
  flex-direction: row;
  justify-content: space-between;
  margin-left: 13px;
  margin-top: 5px;
  padding: 5px 8px 5px 8px;
`;
const VariationButtonText = styled.Text`
  align-items: center;
  border-radius: 5px;
  color: ${props =>
    props.active ? Colors.discountPrice : props.disabled ? Colors.grey3 : Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(11)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(19.41)}px;
  text-align: center;
`;
const QuantityPanelTitle = styled.Text`
  color: ${Colors.black};
  font-family: 'Microsoft YaHei';
  font-size: ${adjustFontSize(14)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(24.71)}px;
  text-align: left;
`;
const QuantityButton = styled.TouchableOpacity`
  align-items: center;
  align-self: center;
  background-color: ${props => (props.disabled ? Colors.grey6 : Colors.grey6)};
  height: ${wp(30)}px;
  justify-content: center;
  width: ${wp(30)}px;
`;
const QuantityButtonText = styled.Text`
  align-items: center;
  align-self: center;
  color: ${props => (props.disabled ? Colors.grey13 : Colors.black)};
  font-size: ${adjustFontSize(20)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(26.4)}px;
  text-align: center;
`;
/* const QuantityInput = styled.TextInput`
    align-items: center;
    background-color: ${props => (props.disabled ? Colors.grey6 : Colors.grey6)};
    height: ${wp(30)}px;
    margin-left: ${wp(2)}px;
    margin-right: ${wp(2)}px;
    width: ${wp(40)}px;
`; */
const QuantityValueContent = styled.View`
  align-self: center;
  background-color: ${props => (props.disabled ? Colors.grey6 : Colors.grey6)};
  height: ${wp(30)}px;
  justify-content: center;
  margin-left: ${wp(2)}px;
  margin-right: ${wp(2)}px;
  width: ${wp(40)}px;
`;
const QuantityValue = styled.Text`
  align-self: center;
  font-size: ${adjustFontSize(13)}px;
  font-weight: 400;
  line-height: ${adjustFontSize(17.16)}px;
  text-align: center;
`;
const AddCartButton = styled.TouchableOpacity`
  align-items: center;
  background-color: ${Colors.yellow};
  border-bottom-left-radius: 20px;
  border-top-left-radius: 20px;
  flex: 1;
  padding: 9px 17px 9px 17px;
`;
const AddCartFullButton = styled(AddCartButton)`
  align-items: center;
  background-color: ${Colors.yellow};
  border-radius: 20px;
  flex: 1;
  padding: 9px 17px 9px 17px;
`;
const BuyButton = styled(AddCartButton)`
  background-color: ${Colors.signUpStepRed};
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 20px;
  border-top-left-radius: 0px;
  border-top-right-radius: 20px;
  flex: 1;
`;
const BuyFullButton = styled(AddCartFullButton)`
  background-color: ${Colors.signUpStepRed};
  flex: 1;
`;
const CheckoutButtonText = styled.Text`
  color: ${Colors.white};
  font-family: 'Microsoft YaHei';
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
`;
