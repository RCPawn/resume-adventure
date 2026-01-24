<template>
  <nav class="napkin-nav">
    <!-- RCPAWN Logo -->
    <div class="napkin-logo">{{ t('nav.logo') }}</div>
    <div class="napkin-nav-links">
      <a href="javascript:void(0);" onclick="window.scrollTo({ top: 0, behavior: 'smooth' });" class="napkin-nav-link">{{ t('nav.home') }}</a>
      <a href="#skills" class="napkin-nav-link">{{ t('nav.skill') }}</a>
      <a href="#projects" class="napkin-nav-link">{{ t('nav.experience') }}</a>
      <a href="#gallery" class="napkin-nav-link">{{ t('nav.gallery') }}</a>
      <a href="javascript:void(0);" @click="toggleAboutModal" class="napkin-nav-link">{{ t('nav.resume') }}</a>
      <a href="#footer" class="napkin-nav-link">{{ t('nav.footer') }}</a>
    </div>
    <div class="napkin-controls">
      <!-- GitHub 按钮 -->
      <a href="https://github.com/RCPawn" target="_blank" class="napkin-control-btn github">
        <svg viewBox="0 0 24 24" class="napkin-icon">
          <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
        </svg>
        <span>GitHub</span>
      </a>
      <!-- 语言切换按钮 -->
      <button @click="toggleLanguage" class="napkin-control-btn language">
        <svg viewBox="0 0 24 24" class="napkin-icon">
          <path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-2.5-13.5h5M9.5 7v9M14.5 7v9M8 10.5c0 4.5 3.5 6.5 8 6.5M16 7.5c0 4.5-3.5 6.5-8 6.5"></path>
        </svg>
        <span>{{ locale === 'cn' ? 'EN' : 'CN' }}</span>
      </button>
      <!-- 主题切换按钮 -->
      <button @click="toggleTheme" class="napkin-control-btn theme">
        <svg v-if="!isDarkMode" viewBox="0 0 24 24" class="napkin-icon">
          <path fill="currentColor" d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2a7 7 0 1 1 0-14 7 7 0 0 1 0 14zM12 5V3M12 21v-2M4.22 6.22 5.64 7.64M18.36 16.36l1.42 1.42M3 12h2M19 12h2M4.22 17.78l1.42-1.42M18.36 7.64l1.42-1.42"></path>
        </svg>
        <svg v-else viewBox="0 0 24 24" class="napkin-icon">
          <path fill="currentColor" d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"></path>
        </svg>
      </button>
    </div>
  </nav>

  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="showAboutModal" class="modal-mask">
        <div class="modal-wrapper">
          <div ref="modalRef" class="modal-container">
            <button class="modal-close" @click="toggleAboutModal">&times;</button>
            <AboutSection :isVisible="showAboutModal" @close="showAboutModal = false" />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import AboutSection from '@/components/ResumeSection.vue'
import { onClickOutside, useDark, useToggle } from '@vueuse/core'

const showAboutModal = ref(false)
const modalRef = ref(null)
const { locale, t } = useI18n()

// useDark 自动管理 html class="dark"
const isDarkMode = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: '',
  storageKey: 'theme',
})

const toggleThemeLogic = useToggle(isDarkMode)

watch(isDarkMode, (newValue) => {
  window.dispatchEvent(new CustomEvent('theme-changed', {
    detail: { isDark: newValue }
  }))
})

const toggleTheme = (event) => {
  const x = event ? event.clientX : innerWidth / 2
  const y = event ? event.clientY : innerHeight / 2

  const isAppearanceTransition = document.startViewTransition
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!isAppearanceTransition) {
    toggleThemeLogic()
    return
  }

  const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
  )

  const transition = document.startViewTransition(async () => {
    toggleThemeLogic()
    await nextTick()
  })

  transition.ready.then(() => {
    document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
          ]
        },
        {
          duration: 400,
          easing: 'ease-in',
          pseudoElement: '::view-transition-new(root)'
        }
    )
  })
}

const toggleAboutModal = () => {
  showAboutModal.value = !showAboutModal.value
}
onClickOutside(modalRef, () => {
  showAboutModal.value = false
})

const toggleLanguage = () => {
  document.body.classList.add('language-transition')
  locale.value = locale.value === 'en' ? 'cn' : 'en'
  localStorage.setItem('language', locale.value)
  setTimeout(() => {
    document.body.classList.remove('language-transition')
  }, 300)
}

const handleNavLinkClick = (e) => {
  e.preventDefault()
  const targetId = e.currentTarget.getAttribute('href')
  if (!targetId || targetId === 'javascript:void(0);') return

  const targetElement = document.querySelector(targetId)
  if (targetElement) {
    const navBar = document.querySelector('.napkin-nav')
    const navHeight = navBar ? navBar.offsetHeight : 60
    const elementPosition = targetElement.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.scrollY - navHeight
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
    history.pushState(null, null, targetId)
  }
}

onMounted(() => {
  const savedLanguage = localStorage.getItem('language')
  if (savedLanguage) {
    locale.value = savedLanguage
  }
  document.querySelectorAll('.napkin-nav-link:not(router-link)').forEach(link => {
    link.addEventListener('click', handleNavLinkClick)
  })
})
</script>

<!-- 组件内样式：导航栏布局与交互 -->
<style scoped>
/* =========================================
   导航栏容器 - 毛玻璃效果
   ========================================= */
.napkin-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 2rem; /* 稍微减小垂直内边距，更精致 */

  /* 引用半透明背景 */
  background-color: var(--nav-bg);

  /* 🔥 核心：高斯模糊，让背景看起来像磨砂玻璃 */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  /* 底部边框也需要半透明，避免太生硬 */
  border-bottom: 1px solid var(--border-color);

  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
}

/* =========================================
   Logo 区域
   ========================================= */
.napkin-logo {
  font-weight: 700;
  font-size: 1.5rem; /* 调整字体大小，避免过大 */
  color: var(--text-color);
  letter-spacing: -0.02em; /* 稍微紧凑一点 */
  cursor: default;
  transition: color 0.3s ease;
}

/* =========================================
   中间链接区域
   ========================================= */
.napkin-nav-links {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 2rem;
}

.napkin-nav-link {
  color: var(--secondary-color); /* 默认次要颜色，不抢 Logo 风头 */
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  position: relative;
  transition: color 0.2s ease;
  padding: 0.5rem 0;
}

.napkin-nav-link:hover {
  color: var(--primary-color);
}

/* 下划线动画 */
.napkin-nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
  border-radius: 2px;
}
.napkin-nav-link:hover::after {
  width: 100%;
}

/* =========================================
   右侧按钮组 (修复"难看"的问题)
   ========================================= */
.napkin-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.napkin-control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  /* 固定高度，保证整齐 */
  height: 36px;
  padding: 0 12px;

  /* 样式优化 */
  background-color: transparent; /* 默认透明，更清爽 */
  border: 1px solid transparent; /* 预留边框位置 */
  border-radius: 8px; /* 圆角适中 */

  color: var(--secondary-color);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

/* 按钮悬浮态：显示背景和边框 */
.napkin-control-btn:hover {
  background-color: var(--btn-bg);
  border-color: var(--border-color);
  color: var(--text-color);
  transform: translateY(-1px); /* 轻微上浮 */
}

/* GitHub 按钮特殊处理：一直显示浅色背景，突出 CTA */
.napkin-control-btn.github {
  background-color: var(--btn-bg);
  border-color: var(--border-color);
  color: var(--text-color);
}
.napkin-control-btn.github:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  box-shadow: var(--hover-shadow);
}

/* 图标 */
.napkin-icon {
  width: 18px;
  height: 18px;
  color: inherit; /* 跟随文字颜色 */
  transition: transform 0.3s ease;
}

.napkin-control-btn:hover .napkin-icon {
  transform: rotate(10deg); /* 俏皮一点的交互 */
}

/* =========================================
   模态框 (简历)
   ========================================= */
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  width: 90%;
  max-width: 1000px;
}

.modal-container {
  position: relative;
  background-color: var(--modal-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: var(--hover-shadow);
  padding: 0; /* 如果里面组件有 padding，这里设为 0 */
  overflow: hidden; /* 防止圆角被内容遮挡 */
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--btn-bg);
  border: 1px solid var(--border-color);
  color: var(--secondary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s;
  z-index: 10;
}

.modal-close:hover {
  background-color: var(--primary-color);
  color: #fff;
  border-color: var(--primary-color);
}

/* 响应式 */
@media (max-width: 768px) {
  .napkin-nav { padding: 0.75rem 1rem; }
  .napkin-nav-links { display: none; }
  .napkin-control-btn span { display: none; }
  .napkin-control-btn { padding: 0 8px; width: 36px; } /* 移动端只留图标，方形按钮 */
}
</style>