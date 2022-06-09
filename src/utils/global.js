import _ from 'lodash';
import { Platform } from 'react-native';
import * as constants from '@utils/constant';
import { decode } from 'base64-arraybuffer';
import { ReactNativeFile } from 'apollo-upload-client';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';
import RnBgTask from 'react-native-bg-thread';
import axios from 'axios';
import { getApolloClient } from '@src/apollo';
import { i18n } from '@src/i18n';
import { v4 as uuidv4 } from 'uuid';

import * as mime from 'react-native-mime-types';
import {
  ADD_ASSET_QUERY,
  ADD_ASSET,
  ADD_ASSET_URL,
  UPLOAD_PREVIEW_VIDEO_QUERY,
  UPLOAD_PREVIEW_VIDEO,
  ADD_ASSET_URL_QUERY,
} from '@modules/asset/graphql';

const RNFS = require('react-native-fs');

const LangList = {
  passwordLengthError: i18n.t('auth:passwordLengthError'),
  passwordNumberError: i18n.t('auth:passwordNumberError'),
  passwordLowerError: i18n.t('auth:passwordLowerError'),
  passwordUpperError: i18n.t('auth:passwordUpperError'),
};
i18n.on('languageChanged', language => {
  LangList.passwordLengthError = i18n.t('auth:passwordLengthError');
  LangList.passwordNumberError = i18n.t('auth:passwordNumberError');
  LangList.passwordLowerError = i18n.t('auth:passwordLowerError');
  LangList.passwordUpperError = i18n.t('auth:passwordUpperError');
});
export const generateRNFile = (uri, type, name = Date.now()) => {
  return uri
    ? new ReactNativeFile({
        uri,
        type,
        name,
      })
    : null;
};

export const uploadVideo = async asset => {
  try {
    // upload assets data
    /*  const { url, path } = asset;
        const fileInfo = await RNFetchBlob.fs.stat(path);
        const { size: fileSize, filename } = fileInfo;
        const mimetype = mime.lookup(path);

        console.log('asset', asset); */
    const { url, size: fileSize } = asset;
    const fileInfo = await RNFetchBlob.fs.stat(url);
    console.log('fileInfo', fileInfo);
    const { filename, path } = fileInfo;
    const mimetype = mime.lookup(path);
    console.log('mimetype', mimetype);
    const apolloClient = getApolloClient();
    const { data } = await apolloClient.mutate({
      mutation: ADD_ASSET,
      variables: { mimetype, size: fileSize },
    });

    const { id } = data.addAsset;
    RnBgTask.runInBackground(() => {
      RNFS.readFile(url, 'base64')
        .then(base64 => {
          console.log('RNFS video 64bit data is read assetId', id);
          console.log('RNFS video 64bit data is read mimetype', mimetype);
          apolloClient.mutate({
            mutation: UPLOAD_PREVIEW_VIDEO,
            variables: {
              assetId: id,
              file: { base64, type: mimetype },
              cropMode: 'AUTO_PAD',
            },
          });
        })
        .catch(err => {
          console.log('RNFS.readFile video  error', err.message);
        });
    });
    return id;
  } catch (error) {
    console.log('error', error.message);
    return null;
  }
};
export const uploadVideoOnBox = async asset => {
  try {
    // upload assets data
    const { url } = asset;
    const fileInfo = await RNFetchBlob.fs.stat(url);
    const { filename, path } = fileInfo;
    const mimetype = mime.lookup(path);
    const formData = new FormData();
    formData.append('files', {
      uri: Platform.OS === 'android' ? url : url.replace('file://', ''),
      name: filename,
      type: mimetype,
    });
    const response = await axios({
      url: `${constants.RECORDING_SERVER_URL}/uploadfile`,
      method: 'POST',
      data: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const recordingVideoPath = `${constants.RECORDING_SERVER_URL}/getfile?fileid=${response?.data[0]}`;

    RnBgTask.runInBackground(() => {
      const apolloClient = getApolloClient();
      const { data } = apolloClient.mutate({
        mutation: ADD_ASSET_URL,
        variables: recordingVideoPath,
      });
    });

    return recordingVideoPath;
  } catch (error) {
    console.log('uploadVideoOnBox error', error.message);
    return null;
  }
};
export const uploadAsset = async asset => {
  try {
    const { url: source, type: mimetype, size: fileSize, id: localId } = asset;

    const apolloClient = getApolloClient();
    const { data } = await apolloClient.mutate({
      mutation: ADD_ASSET,
      variables: { mimetype, size: fileSize },
    });
    const { id, path, url, type, status, size } = data.addAsset;
    //= ====uploadImageOnS3=======
    RnBgTask.runInBackground(() => {
      RNFS.readFile(source, 'base64')
        .then(base64 => {
          const arrayBuffer = decode(base64);
          constants.s3bucket.createBucket(() => {
            const params = {
              Bucket: 'jiteng',
              Key: path,
              Body: arrayBuffer,
              ContentType: type,
            };
            constants.s3bucket.upload(params, (err, response) => {
              if (err) {
                console.log('error in callback', err);
              } else {
                console.log(`Response URL : ${response.Location}`);
              }
            });
          });
        })
        .catch(err => {
          console.log('RNFS.readFile error', err.message);
        });
    });
    return { [localId]: id };
  } catch (error) {
    console.log('error', error.message);
    return null;
  }
};
export const uploadMultiAssets = async assetList => {
  try {
    const assetIdPairs = await _.reduce(
      assetList,
      async (result, asset) => {
        const idPair = await uploadAsset(asset);
        return { ...(await result), ...idPair };
      },
      {},
    );
    return assetIdPairs;
  } catch (error) {
    console.log('error', error.message);
    return {};
  }
};
export const emailValidPattern = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/i;

export const inValidateEmail = text => {
  // console.log(text);
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (reg.test(text) === false) {
    return true;
  } else {
    return false;
  }
};

export const inValidatePassword = text => {
  let re = /[0-9]/;
  if (!text || text.length < 6 || text === '') {
    return LangList.passwordLengthError;
  } else if (!re.test(text)) {
    return LangList.passwordNumberError;
  }
  re = /[a-z]/;
  if (!re.test(text)) {
    return LangList.passwordLowerError;
  }
  re = /[A-Z]/;
  if (!re.test(text)) {
    return LangList.passwordUpperError;
  } else {
    return false;
  }
};
export const validatePhoneNumber = text => {
  const reg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3,4}[-\s\.]?[0-9]{4,6}$/im;
  // let reg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (reg.test(text) === false) {
    return false;
  } else {
    return true;
  }
};
export const numberWithCommas = x => {
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};
export function secondsToMS(duration) {
  // var milliseconds = parseInt((duration % 1000) / 100);
  let seconds = parseInt(duration % 60, 10) || 0;
  let minutes = parseInt((duration / 60) % 60, 10) || 0;
  let hours = parseInt((duration / 60 / 60) % 60, 10) || 0;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  hours = hours < 10 ? `0${hours}` : hours;
  return { hours, minutes, seconds };
}
export const parseOptionValue = (arr, key) => {
  const index = _.findIndex(arr, item => item.name.toLowerCase() === key);
  if (index === -1) {
    return null;
  }
  return arr[index]?.value;
};
export const getMatchedColsData = ({ data = [], cols = 3 }) => {
  const isThird = data.length % cols;
  if (isThird === 0) {
    return data;
  } else {
    return _.concat(
      data,
      Array(cols - isThird)
        .fill('')
        .map((item, i) => ({
          id: uuidv4(),
          isEmpty: true,
        })),
    );
  }
};
export const parseAliPaySecret = url => {
  const paramData = url.split('?');
  const spiltData = paramData[1].split('&');
  const pairData = {};
  _.map(spiltData, item => {
    const pairItem = item.split('=');
    if (pairItem[0] === 'biz_content') {
      const decodeInfo = JSON.parse(decodeURIComponent(pairItem[1]));
      _.map(Object.keys(decodeInfo), key => {
        pairData[key] = decodeInfo[key];
      });
    }
    const key = pairItem[0];
    const value = pairItem[1];
    pairData[key] = value;
  });

  return pairData;
};
