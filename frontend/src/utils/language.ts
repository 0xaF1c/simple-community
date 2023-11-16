import { Ref } from "vue"

export function getLanguage() {
  return localStorage.getItem('locale') || navigator.language || 'en-US'
}
export function toggleLocale(localeKey: string, locale: Ref<any>) {
  localStorage.setItem('locale', localeKey)
  locale.value = localeKey
}