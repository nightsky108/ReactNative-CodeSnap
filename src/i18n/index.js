// @flow

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import i18nHttpLoader from 'i18next-http-backend';
import Axios from 'axios';
import { store } from '@store/store';
import * as constants from '@utils/constant';
import en from './translations/en.json';
import cn from './translations/cn.json';

const getDefaultLanguage = () => {
  const authStore = store.getState().auth;
  const storedVal = authStore?.userSettings?.language?.id;
  const defaultLanguage = storedVal ? storedVal.toLowerCase() : getLocales()[0].languageCode;

  return 'cn';
};
const languageDetector = {
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: callback => {
    callback(getDefaultLanguage());
  },
  init: () => {},
  cacheUserLanguage: () => {},
};
const getInitOption = () => {
  const initOption = {
    interpolation: {
      escapeValue: false,
    },
    lng: getDefaultLanguage(),
    fallbackLng: 'cn',
    resources: {
      en: { translation: en },
      cn: { translation: cn },
    },
    nsSeparator: ':',
    keySeparator: ':',
    react: {
      useSuspense: false,
    },
    backend: {
      loadPath: `${constants.LANG_API}/{{lng}}`,
      parse: data => {
        return data;
      },
      request: (options, url, payload, callback) => {
        Axios.get(url)
          .then(res => {
            callback(null, res);
          })
          .catch(err => {
            callback(err, null);
          });
      },
    },
    simplifyPluralSuffix: false,
    // debug: __DEV__,
    debug: false,
  };
  return initOption;
};
export const i18n = i18next.createInstance();

i18n
  .on('missingKey', (...extra) => {})
  .use(languageDetector)
  .use(initReactI18next)
  // .use(i18nHttpLoader)
  .init();
export const initI18n = () => {
  i18n.init(getInitOption());
};
