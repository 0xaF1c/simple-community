export function getDefaultLanguage(): string {
  return navigator.language.replace('-', '')
}