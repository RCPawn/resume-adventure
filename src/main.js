import { createApp, reactive, onMounted, nextTick } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './data/i18n.js'
import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.min.css';

const app = createApp(App)

// 加载其他插件
app.use(router)
app.use(i18n)

app.mount('#app')
