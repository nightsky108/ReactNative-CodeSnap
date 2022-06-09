import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useImperativeHandle,
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
  Image,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { Box, HStack } from 'native-base';
import { Icon, Text, ListItem, Button } from 'react-native-elements';
import Video from 'react-native-video';
import { useTranslation } from 'react-i18next';
import DashedLine from 'react-native-dashed-line';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components/native';

import LinearGradient from 'react-native-linear-gradient';
import PageControl from 'react-native-page-control';
import StepIndicator from 'react-native-step-indicator';

import { TopBannerImgStyle } from '@common/GlobalStyles';
import { getAdjustSize, wp, hp, adjustFontSize } from '@src/common/responsive';
import { FocusAwareStatusBar, TopBannerImage } from '@components';
import { RowBox, RowCenter } from '@src/common/StyledComponents';
import { Colors, Fonts } from '@theme';
import * as constants from '@utils/constant';
import Images from '@assets/images';
import { ScrollView } from 'react-native-gesture-handler';

const photo = 'https://picsum.photos/id/1/344/109';
const IconSize = 25;
const { width: screenWidth } = Dimensions.get('window');
const SelectedItemSize = getAdjustSize({ width: 23.75, height: 29.02 });
const PhotoSize = getAdjustSize({ width: 354.29, height: 440.42 });

const AssetsData = [
  { id: uuidv4(), url: 'https://picsum.photos/id/1/344/109' },
  { id: uuidv4(), url: 'https://picsum.photos/id/1/344/109' },
  { id: uuidv4(), url: 'https://picsum.photos/id/1/344/109' },
];
/* const attrs = [
    {
        id: 1,
        variation: [
            { name: 'color', value: 'red' },
            { name: 'size', value: 'short' },
            { name: 'weight', value: 'light' },
            { name: 'power', value: 220 },
        ],
    },
    {
        id: 2,
        variation: [
            { name: 'color', value: 'red' },
            { name: 'size', value: 'short' },
            { name: 'weight', value: 'heavy' },
            { name: 'power', value: 220 },
        ],
    },
    {
        id: 3,
        variation: [
            { name: 'color', value: 'red' },
            { name: 'size', value: 'long' },
            { name: 'weight', value: 'light' },
            { name: 'power', value: 220 },
        ],
    },
    {
        id: 4,
        variation: [
            { name: 'color', value: 'red' },
            { name: 'size', value: 'long' },
            { name: 'weight', value: 'light' },
            { name: 'power', value: 380 },
        ],
    },
    {
        id: 5,
        variation: [
            { name: 'color', value: 'blue' },
            { name: 'size', value: 'small' },
            { name: 'weight', value: 'heavy' },
            { name: 'power', value: 380 },
        ],
    },
    {
        id: 6,
        variation: [
            { name: 'color', value: 'blue' },
            { name: 'size', value: 'long' },
            { name: 'weight', value: 'heavy' },
            { name: 'power', value: 220 },
        ],
    },
    {
        id: 7,
        variation: [
            { name: 'color', value: 'blue' },
            { name: 'size', value: 'short' },
            { name: 'weight', value: 'light' },
            { name: 'power', value: 220 },
        ],
    },
    {
        id: 8,
        variation: [
            { name: 'color', value: 'blue' },
            { name: 'size', value: 'highest' },
            { name: 'weight', value: 'heavy' },
            { name: 'power', value: 220 },
        ],
    },
    {
        id: 9,
        variation: [
            { name: 'color', value: 'blue' },
            { name: 'size', value: 'highest' },
            { name: 'weight', value: 'middle' },
            { name: 'power', value: 220 },
        ],
    },
    {
        id: 10,
        variation: [
            { name: 'color', value: 'yellow' },
            { name: 'size', value: 'short' },
            { name: 'weight', value: 'light' },
            { name: 'power', value: 220 },
        ],
    },
    {
        id: 11,
        variation: [
            { name: 'color', value: 'yellow' },
            { name: 'size', value: 'long' },
            { name: 'weight', value: 'heavy' },
            { name: 'power', value: 220 },
        ],
    },
    {
        id: 12,
        variation: [
            { name: 'color', value: 'yellow' },
            { name: 'size', value: 'highest' },
            { name: 'weight', value: 'middle' },
            { name: 'power', value: 220 },
        ],
    },
    {
        id: 13,
        variation: [
            { name: 'color', value: 'green' },
            { name: 'size', value: 'highest' },
            { name: 'weight', value: 'middle' },
            { name: 'power', value: 220 },
        ],
    },
    {
        id: 14,
        variation: [
            { name: 'color', value: 'green' },
            { name: 'size', value: 'highest' },
            { name: 'weight', value: 'middle' },
            { name: 'power', value: 380 },
        ],
    },
    {
        id: 15,
        variation: [
            { name: 'color', value: 'green' },
            { name: 'size', value: 'highest' },
            { name: 'weight', value: 'heavy' },
            { name: 'power', value: 380 },
        ],
    },
]; */
const attrs = [
  {
    id: 1,
    variation: [
      { name: 'color', value: 'blue' },
      { name: 'size', value: 'L' },
    ],
  },
  {
    id: 2,
    variation: [
      { name: 'color', value: 'blue' },
      { name: 'size', value: 'M' },
    ],
  },
  {
    id: 3,
    variation: [
      { name: 'color', value: 'blue' },
      { name: 'size', value: 'S' },
    ],
  },
  {
    id: 4,
    variation: [
      { name: 'color', value: 'blue' },
      { name: 'size', value: 'XL' },
    ],
  },
  {
    id: 5,
    variation: [
      { name: 'color', value: 'white' },
      { name: 'size', value: 'M' },
    ],
  },
  {
    id: 6,
    variation: [
      { name: 'color', value: 'white' },
      { name: 'size', value: 'S' },
    ],
  },
  {
    id: 7,
    variation: [
      { name: 'color', value: 'white' },
      { name: 'size', value: 'XL' },
    ],
  },
];
let variationKeyList = []; // [color, size, weight]
const variationKeyValPairMap = {}; // {color:['red,'green','blue'], size:['small','middle']};
const variationValAttrIdPairMap = {}; // {red:[0,1,2],green:[0,1],small:[1.2]};
const attrIDList = [];
_.map(attrs, attr => {
  const { id, variation } = attr;
  attrIDList.push(id);
  return _.map(variation, item => {
    // console.log(`${key}: ${value}`);
    if (!variationKeyList.includes(item.name)) {
      variationKeyList = _.concat(variationKeyList, item.name);
      variationKeyValPairMap[item.name] = [];
    }
    if (!variationKeyValPairMap[item.name].includes(item.value)) {
      variationKeyValPairMap[item.name].push(item.value);
      variationValAttrIdPairMap[item.value] = [];
    }
    if (!variationValAttrIdPairMap[item.value].includes(id)) {
      variationValAttrIdPairMap[item.value].push(id);
    }
  });
});

const AttributeOptionPanel = () => {
  //= ======== State Section========
  const [selectedKeyPairs, setSelectedKeyPairs] = useState({});
  const [possibleAttrIDList, setPossibleAttrIDList] = useState(attrIDList);

  /* const handleVariation = useCallback(
        ({ key, value }) => {
            const oldSelectedKeyPairs = { ...selectedKeyPairs };
            let previousPossibleAttrIDList = [...possibleAttrIDList];
            if (oldSelectedKeyPairs[key]) {
                // user change selected key (ex: change color)
                delete oldSelectedKeyPairs[key];
                previousPossibleAttrIDList = [];
                previousPossibleAttrIDList = _.map(Object.keys(oldSelectedKeyPairs), item => {
                    return _.concat(
                        previousPossibleAttrIDList,
                        variationValAttrIdPairMap[oldSelectedKeyPairs[item]],
                    );
                });
                previousPossibleAttrIDList = previousPossibleAttrIDList.reduce((a, arr) =>
                    a.filter(num => arr.includes(num)),
                );
                const updatedSelectedKeyPairs = {};

                _.map(Object.keys(oldSelectedKeyPairs), item => {
                    const difference = previousPossibleAttrIDList.filter(x =>
                        variationValAttrIdPairMap[oldSelectedKeyPairs[item]].includes(x),
                    );
                    if (difference.length >= 0) {
                        updatedSelectedKeyPairs[item] = oldSelectedKeyPairs[item];
                    }
                });
                console.log('updatedSelectedKeyPairs', updatedSelectedKeyPairs);
                previousPossibleAttrIDList = [];
                previousPossibleAttrIDList = _.map(Object.keys(updatedSelectedKeyPairs), item => {
                    return _.concat(
                        previousPossibleAttrIDList,
                        variationValAttrIdPairMap[updatedSelectedKeyPairs[item]],
                    );
                });
                console.log('previousPossibleAttrIDList before', previousPossibleAttrIDList);
                previousPossibleAttrIDList = previousPossibleAttrIDList.reduce((a, arr) =>
                    a.filter(num => arr.includes(num)),
                );
                console.log('previousPossibleAttrIDList', previousPossibleAttrIDList);
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
        [possibleAttrIDList, selectedKeyPairs],
    ); */

  /* const candidateVariationKeyValPairMap = useMemo(() => {
        const data = {};
        _.map(variationKeyList, key => {
            data[key] = [];
            const filteredValArr = Object.keys(selectedKeyPairs).includes(key)
                ? variationKeyValPairMap[key]
                : _.filter(variationKeyValPairMap[key] || [], val => {
                      const difference = possibleAttrIDList.filter(x =>
                          variationValAttrIdPairMap[val].includes(x),
                      );
                      return difference.length > 0;
                  });
            data[key] = filteredValArr;
        });
        return data;
    }, [possibleAttrIDList, selectedKeyPairs]); */
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
    [possibleAttrIDList, selectedKeyPairs],
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
  // console.log('possibleAttrIDList', possibleAttrIDList);
  // console.log('selectedKeyPairs', selectedKeyPairs);
  // console.log('candidateVariationKeyValPairMap', candidateVariationKeyValPairMap);
  return (
    <>
      {_.map(variationKeyList, (key, index) => {
        return (
          <Box width="100%" key={index.toString()}>
            <Text>{key}</Text>
            <Box flexDirection="row">
              {variationKeyValPairMap?.[key]
                ? _.map(variationKeyValPairMap?.[key], (item, index) => {
                    const isSelected = selectedKeyPairs[key] === item;
                    const isDisableItem = !candidateVariationKeyValPairMap?.[key].includes(item);
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          handleVariation({
                            key,
                            value: item,
                            isDisabled: isDisableItem,
                          });
                        }}
                        key={index.toString()}
                        style={{ marginRight: 10 }}>
                        <Text
                          style={{
                            color: isSelected ? 'red' : !isDisableItem ? 'black' : 'grey',
                          }}>
                          {item}
                        </Text>
                      </TouchableOpacity>
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
AttributeOptionPanel.propTypes = {};
AttributeOptionPanel.defaultProps = {};
// 冯琳
export default React.memo(AttributeOptionPanel);

const styles = StyleSheet.create({});

const InfoText = styled.Text`
  font-family: 'Microsoft YaHei';

  line-height: ${adjustFontSize(18.48)}px;
  margin-bottom: 10px;
  name: 'color', ${Colors.black};
  text-align: left;
`;
const MoreProductButton = styled.TouchableOpacity`
  border-radius: 15px;
  border-width: 1px;
  flex-direction: row;
  justify-content: center;
  margin-right: ${wp(11.08)}px;
`;
const Photo = styled(Image)`
  align-items: center;
  height: ${parseInt(PhotoSize.height, 10)}px;
  justify-content: center;
  margin-bottom: 5px;
  width: ${parseInt(PhotoSize.width, 10)}px;
`;

const Divider = styled.View`
  border-width: 1px;
  height: 1px;
  margin-bottom: 8px;
  margin-top: 8px;
  width: 100%;
`;
