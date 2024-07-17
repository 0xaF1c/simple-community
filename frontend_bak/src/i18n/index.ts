import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { getDefaultLanguage } from '../utils/language'

import enUS from './lang/enUS'
import zhCN from './lang/zhCN'

const language = getDefaultLanguage()
export const resources = {
  'enUS': {
    translation: enUS
  },
  'zhCN': {
    translation: zhCN
  }
}


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: language,
    debug: false,
    interpolation: {
      escapeValue: false
    },
    lng: language
  })

export default i18n