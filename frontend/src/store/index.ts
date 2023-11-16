import { defineStore } from 'pinia'
import { getLanguage } from '../utils/language'

export const useAppStore = defineStore('app', {
  state: () => ({
    language: getLanguage()
  }),
  getters: {
    locale(state) {
      return state.language
    }
  }
})