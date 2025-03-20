import { createApp, reactive, onMounted, nextTick } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './data/i18n.js'
import DarkReader from 'darkreader'
import '@fortawesome/fontawesome-free/css/all.min.css';

const app = createApp(App)

// 全局状态：管理暗黑模式
const globalState = reactive({
    isDark: localStorage.getItem('theme') === 'dark', // 从 localStorage 获取初始值
    toggleDarkMode() {
        this.isDark = !this.isDark
        this.updateTheme()  // 更新主题设置
    },
    updateTheme() {
        if (this.isDark) {
            DarkReader.enable({
                brightness: 95,
                contrast: 90,
                sepia: 0,
            })
            localStorage.setItem('theme', 'dark') // 保存状态到 localStorage
        } else {
            DarkReader.disable()
            localStorage.setItem('theme', 'light')
        }
    }
})

// 在 Vue 完全挂载后启用暗黑模式（如果需要）
/*onMounted(() => {
    nextTick(() => {
        if (globalState.isDark) {
            globalState.updateTheme()
        }
    })
})*/

// 将全局状态提供给所有组件
app.provide('globalState', globalState)

// 加载其他插件
app.use(router)
app.use(i18n)

app.mount('#app')
