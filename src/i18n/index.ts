import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '@/i18n/locales/en.json'

void i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
  },
  interpolation: {
    escapeValue: false,
  },
})

document.documentElement.lang = i18n.language
document.title = i18n.t('app.title')

export default i18n
