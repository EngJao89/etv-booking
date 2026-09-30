import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '@/i18n/locales/en.json'
import pt from '@/i18n/locales/pt.json'

export const SUPPORTED_LANGUAGES = ['en', 'pt'] as const
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number]

const STORAGE_KEY = 'etv-language'

function getStoredLanguage(): AppLanguage {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'pt') {
    return stored
  }
  return 'en'
}

/** Typed wrapper so service code can use unprefixed keys like `signIn.unableToSignIn`. */
export function translate(
  key: string,
  options?: Record<string, unknown>,
): string {
  return String(
    (i18n.t as (key: string, options?: Record<string, unknown>) => string)(
      key,
      options,
    ),
  )
}

function applyLanguage(language: string) {
  document.documentElement.lang = language
  document.title = translate('app.title')
}

void i18n.use(initReactI18next).init({
  lng: getStoredLanguage(),
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    pt: { translation: pt },
  },
  interpolation: {
    escapeValue: false,
  },
})

applyLanguage(i18n.language)

i18n.on('languageChanged', (language) => {
  if (language === 'en' || language === 'pt') {
    localStorage.setItem(STORAGE_KEY, language)
  }
  applyLanguage(language)
})

export function setAppLanguage(language: AppLanguage) {
  void i18n.changeLanguage(language)
}

export default i18n
