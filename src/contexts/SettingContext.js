import React, { createContext, useContext } from 'react';
import { useUserSettings } from '@data/useUser';

const SettingContext = createContext({
  userSettings: {},
  userCurrencyISO: 'CNY',
  userCurrencySymbol: '¥',
  userLanguage: 'ZH',
  userCountry: { id: 'CN', name: 'China' },
});

export const SettingProvider = ({ children }) => {
  const settingProps = useUserSettings();
  return <SettingContext.Provider value={settingProps}>{children}</SettingContext.Provider>;
};
export const useSettingContext = () => useContext(SettingContext);
