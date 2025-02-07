// import './assets/main.css'

import { createApp, reactive } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import store from './store'
import DarkReader from 'darkreader'

const app = createApp(App)

// 全局状态：管理暗黑模式
const globalState = reactive({
  isDark: localStorage.getItem('theme') === 'dark', // 从 localStorage 获取初始值
  toggleDarkMode() {
    this.isDark = !this.isDark
    if (this.isDark) {
      DarkReader.enable({
        brightness: 100,
        contrast: 90,
        sepia: 10,
      })
      localStorage.setItem('theme', 'dark') // 保存状态到 localStorage
    } else {
      DarkReader.disable()
      localStorage.setItem('theme', 'light')
    }
  },
})

// 初始化时应用暗黑模式
if (globalState.isDark) {
  DarkReader.enable({
    brightness: 100,
    contrast: 90,
    sepia: 10,
  })
}

// 将全局状态提供给所有组件
app.provide('globalState', globalState)

// 加载其他插件
app.use(router)
app.use(i18n)
app.use(store)

app.mount('#app')
