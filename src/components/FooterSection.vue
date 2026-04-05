<template>
  <footer id="footer" class="footer-section">
    <div class="footer-container">
      <div class="footer-brand">
        <h2 class="brand-name">{{ t('footer.appName') }}</h2>
        <p class="brand-tagline">{{ t('footer.tagline') }}</p>

        <div class="social-actions">
          <div class="social-links">
            <a
                v-for="(social, index) in tm('footer.socialLinks')"
                :key="index"
                :href="social.url"
                class="social-btn"
                target="_blank"
                :title="social.icon"
            >
              <i :class="social.icon"></i>
            </a>
          </div>

          <button
              class="email-btn"
              @click="copyEmail"
              :class="{ copied: emailCopied }"
              :aria-label="emailCopied ? '邮箱已复制' : '复制邮箱'"
          >
            <span class="btn-icon">
              <svg
                  v-if="!emailCopied"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <svg
                  v-else
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            {{ emailCopied ? t('footer.emailCopied') : t('footer.copyEmail') }}
          </button>
        </div>
      </div>

      <div class="footer-tech">
        <h3>{{ t('footer.techTitle') }}</h3>
        <div class="tech-grid">
          <span v-for="tech in techStack" :key="tech" class="tech-tag">{{ tech }}</span>
        </div>
      </div>

      <div class="footer-nav">
        <div v-for="(group, index) in tm('footer.linkGroups')" :key="index" class="nav-group">
          <h4>{{ group.title }}</h4>
          <ul>
            <li v-for="(link, linkIndex) in group.links" :key="linkIndex">
              <a :href="link.url" :target="isExternal(link.url) ? '_blank' : '_self'">
                {{ link.text }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p class="copyright">
        {{ t('footer.copyright', { year: new Date().getFullYear() }) }}
      </p>

      <div class="site-stats">
        <div class="stat-card">
          <svg class="stat-icon" viewBox="0 0 24 24" width="20" height="20">
            <path
                fill="currentColor"
                d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
            />
          </svg>
          <span class="stat-label">总访问量</span>
          <span id="busuanzi_site_pv" class="stat-value">0</span>
        </div>

        <div class="stat-card">
          <svg class="stat-icon" viewBox="0 0 24 24" width="20" height="20">
            <path
                fill="currentColor"
                d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
            />
          </svg>
          <span class="stat-label">今日访客</span>
          <span id="busuanzi_today_uv" class="stat-value">0</span>
        </div>

        <div class="stat-card">
          <svg class="stat-icon" viewBox="0 0 24 24" width="20" height="20">
            <path
                fill="currentColor"
                d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"
            />
          </svg>
          <span class="stat-label">已运行</span>
          <span class="stat-value">{{ runningDays }} 天</span>
        </div>
      </div>

      <p class="made-with">
        {{ t('footer.madeWith') }} <span class="heart">❤</span>
      </p>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()

const emailCopied = ref(false)
const techStack = ['Vue3', 'Vite', 'I18n', 'Reveal.js', 'Markdown-it', '@google/model-viewer']

const isExternal = (url) => url.startsWith('http')

// 计算博客运行天数（从 2025-02-07 22:55 开始）
const startDate = new Date('2025-02-07T22:55:00')
const runningDays = computed(() => {
  const now = new Date()
  const diff = now - startDate
  return Math.floor(diff / (1000 * 60 * 60 * 24))
})

// 复制邮箱功能
const copyEmail = async () => {
  const email = 'shangxi0275@163.com'

  try {
    await navigator.clipboard.writeText(email)
    emailCopied.value = true
    setTimeout(() => {
      emailCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('复制邮箱失败:', err)
  }
}

// 不蒜子统计配置
const busuanziScriptId = 'busuanzi-script'
const busuanziScriptUrl = 'https://cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js'
let busuanziInitialized = false

// 动态注入不蒜子脚本
const injectBusuanziScript = () => {
  // 如果脚本已经存在，直接返回
  if (document.getElementById(busuanziScriptId)) {
    return
  }

  const script = document.createElement('script')
  script.id = busuanziScriptId
  script.src = busuanziScriptUrl
  script.async = true

  script.onload = () => {
    console.log('不蒜子脚本加载成功')
    busuanziInitialized = true
  }

  script.onerror = () => {
    console.warn('不蒜子脚本加载失败，统计功能将不可用')
    // 设置默认值
    const pvEl = document.getElementById('busuanzi_value_site_pv')
    const uvEl = document.getElementById('busuanzi_value_today_uv')
    if (pvEl) pvEl.textContent = '--'
    if (uvEl) uvEl.textContent = '--'
  }

  document.head.appendChild(script)
}

onMounted(() => {
  // 挂载时注入不蒜子脚本
  injectBusuanziScript()
})
</script>

<style scoped>
.footer-section {
  padding: 5rem 2rem 2rem;
  background-color: var(--nav-bg);
  border-top: 1px solid var(--border-color);
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow: hidden;
}

.footer-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
  opacity: 0.3;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 4rem;
  margin-bottom: 3rem;
}

/* --- 左侧品牌区 --- */
.brand-name {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 0.6rem;
  color: var(--text-color);
  letter-spacing: -1px;
}

.brand-tagline {
  color: var(--secondary-color);
  margin-bottom: 2rem;
  font-size: 1rem;
  line-height: 1.6;
  max-width: 300px;
}

/* 社交与邮箱 */
.social-actions {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.social-links {
  display: flex;
  gap: 0.8rem;
}

.social-btn {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: var(--btn-bg);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.social-btn:hover {
  background: var(--modal-bg);
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(var(--primary-color-rgb, 96, 165, 250), 0.15);
}

.social-btn i {
  position: relative;
  z-index: 1;
  font-size: 1.1rem;
  color: inherit;
}

.email-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--btn-bg);
  color: var(--text-color);
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.email-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--modal-bg);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
}

.email-btn:hover {
  background: var(--modal-bg);
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(var(--primary-color-rgb, 96, 165, 250), 0.15);
}

.email-btn .btn-icon {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
}

.email-btn span:not(.btn-icon) {
  position: relative;
  z-index: 1;
}

/* 关键修复：复制状态增强对比度，避免深色主题下文字“消失” */
.email-btn.copied {
  border-color: #10b981;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.28);
}

.email-btn.copied::before {
  opacity: 0;
  background: transparent;
}

.email-btn.copied:hover {
  color: #ffffff;
  border-color: #10b981;
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(16, 185, 129, 0.32);
}

.email-btn.copied .btn-icon,
.email-btn.copied span:not(.btn-icon) {
  color: #ffffff;
}

.email-btn.copied svg {
  stroke: currentColor;
}

/* --- 中间技术栈区 --- */
.footer-tech h3 {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--secondary-color);
  margin-bottom: 1.2rem;
  font-weight: 600;
}

.tech-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tech-tag {
  padding: 6px 14px;
  background: var(--btn-bg);
  border-radius: 8px;
  font-size: 0.85rem;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  transition: all 0.25s ease;
  cursor: default;
  font-weight: 500;
}

.tech-tag:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: var(--modal-bg);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--primary-color-rgb, 96, 165, 250), 0.2);
}

/* --- 右侧导航区 --- */
.footer-nav {
  display: flex;
  gap: 3rem;
}

.nav-group h4 {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
  color: var(--text-color);
}

.nav-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-group li {
  margin-bottom: 0.8rem;
}

.nav-group a {
  text-decoration: none;
  color: var(--secondary-color);
  font-size: 0.9rem;
  transition: all 0.2s ease;
  position: relative;
  display: inline-block;
}

.nav-group a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--primary-color);
  transition: width 0.3s ease;
}

.nav-group a:hover {
  color: var(--primary-color);
}

.nav-group a:hover::after {
  width: 100%;
}

/* --- 底部版权 --- */
.footer-bottom {
  border-top: 1px solid var(--border-color);
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  font-size: 0.85rem;
  color: var(--secondary-color);
  margin: 0;
  flex: 0 0 auto;
}

/* 站点统计样式 - 卡片式布局 */
.site-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
  justify-content: center;
}

.stat-card {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  background: linear-gradient(135deg, var(--btn-bg), var(--modal-bg));
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 0.9rem;
  color: var(--secondary-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.stat-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(var(--primary-color-rgb, 96, 165, 250), 0.2);
}

.stat-icon {
  color: var(--primary-color);
  opacity: 0.85;
}

.stat-label {
  font-weight: 500;
  color: var(--secondary-color);
}

.stat-value {
  font-weight: 700;
  color: var(--text-color);
  font-family: 'Courier New', 'Monaco', monospace;
  font-size: 0.95rem;
  min-width: 30px;
  text-align: right;
}

.made-with {
  font-size: 0.85rem;
  color: var(--secondary-color);
  margin: 0;
  flex: 0 0 auto;
  text-align: right;
}

.heart {
  color: #e63946;
  animation: heartbeat 1.5s ease infinite;
  display: inline-block;
}

@keyframes heartbeat {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* 响应式 */
@media (max-width: 1024px) {
  .footer-container {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }

  .brand-tagline {
    margin-left: auto;
    margin-right: auto;
  }

  .social-actions {
    justify-content: center;
  }

  .tech-grid {
    justify-content: center;
  }

  .footer-nav {
    justify-content: center;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 0.8rem;
  }

  .copyright,
  .made-with {
    text-align: center;
  }

  .site-stats {
    order: -1;
    gap: 10px;
  }

  .stat-card {
    padding: 8px 14px;
    font-size: 0.85rem;
  }
}

/* 大屏优化（27寸及以上） */
@media (min-width: 1600px) {
  .footer-section {
    padding: 6rem 2rem 2.5rem;
  }

  .footer-container {
    max-width: 1400px;
    gap: 5rem;
  }

  .brand-name {
    font-size: 2.2rem;
  }

  .brand-tagline {
    font-size: 1.1rem;
    max-width: 350px;
  }

  .social-btn {
    width: 46px;
    height: 46px;
  }

  .email-btn {
    padding: 12px 20px;
    font-size: 0.95rem;
  }

  .footer-tech h3 {
    font-size: 0.95rem;
  }

  .tech-tag {
    font-size: 0.9rem;
    padding: 7px 16px;
  }

  .nav-group h4 {
    font-size: 1rem;
  }

  .nav-group a {
    font-size: 0.95rem;
  }
}
</style>