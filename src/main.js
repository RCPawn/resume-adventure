import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './data/i18n.js'
import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
/** 首屏 Hero 使用 <model-viewer>：应用入口提前注册自定义元素，避免组件挂载后再加载模块的延迟 */
import '@google/model-viewer'

const app = createApp(App)

app.use(router)
app.use(i18n)

app.mount('#app')