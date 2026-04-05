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

// 全局路由守卫 - 监听路由变化并更新不蒜子统计
router.afterEach((to, from) => {
  // 路由切换后更新不蒜子统计
  nextTick(() => {
    if (window.bszCaller) {
      try {
        window.bszCaller.fetch('//busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback', () => {
          console.log('路由切换，不蒜子统计已更新')
        })
      } catch (e) {
        console.warn('不蒜子统计更新失败:', e)
      }
    }
  })
})

app.mount('#app')
