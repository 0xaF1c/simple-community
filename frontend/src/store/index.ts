import { defineStore } from 'pinia'
import { getLanguage } from '../utils/language'

export const useAppStore = defineStore('app', {
  state: () => ({
    language: getLanguage(),
    followTextUpdateCount: 0
  }),
  getters: {
    locale(state) {
      return state.language
    }
  },
  actions: {
    followTextUpdate() {      
      this.followTextUpdateCount++
    }
  }
})