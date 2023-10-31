import { defineStore } from 'pinia'
import { AppState } from './types'

const defaultSettings = {
  searchWebSrc: '',
  searchWebTiltleValue: '',
  searchWebValue: '百度'
}

const useAppStore = defineStore('app', {
  state: (): AppState => ({ ...defaultSettings }),

  getters: {
    searchWebInitData(state: AppState) {
      const { searchWebSrc, searchWebTiltleValue, searchWebValue } = state
      return {
        searchWebSrc,
        searchWebTiltleValue,
        searchWebValue
      }
    }
  },

  actions: {
    // Update app settings
    updateSettings(partial: Partial<AppState>) {
      // @ts-ignore-next-line
      this.$patch(partial)
    }
  },

  persist: true
})

export default useAppStore
