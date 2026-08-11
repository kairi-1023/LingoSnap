import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en/common.json';
import ko from './locales/ko/common.json';

export const SUPPORTED_I18N_LANGUAGES = ['ko', 'en'];

export const initI18n = async () => {
  await i18n.use(initReactI18next).init({
    resources: {
      en: { common: en },
      ko: { common: ko },
    },
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    returnObjects: true,
  });
};

export const changeAppLanguage = async (lang: string) => {
  const code = SUPPORTED_I18N_LANGUAGES.includes(lang) ? lang : 'en';
  await i18n.changeLanguage(code);
  await AsyncStorage.setItem('displayLanguage', code);
};

export const getSavedLanguage = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('displayLanguage');
  } catch {
    return null;
  }
};

export default i18n;
