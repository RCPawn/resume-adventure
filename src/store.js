// store.js
import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      theme: localStorage.getItem('theme') || 'light', // 默认主题为 light
    }
  },
  mutations: {
    // 切换主题
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', state.theme) // 存储到 localStorage
    },
  },
  actions: {
    toggleTheme({ commit }) {
      commit('toggleTheme')
    },
  },
})

export default store
