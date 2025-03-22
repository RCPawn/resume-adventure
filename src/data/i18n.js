// data/i18n.js
import { createI18n } from 'vue-i18n'
import en from '@/data/en'
import cn from '@/data/cn'

const messages = {
  en,
  cn
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: localStorage.getItem('language') || 'cn',
  fallbackLocale: 'cn',
  messages,
  warnHtmlInMessage: 'off'
})

export default i18n
