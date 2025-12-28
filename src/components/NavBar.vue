<template>
  <nav class="napkin-nav">
    <!-- RCPAWN Logo -->
    <div class="napkin-logo">{{ t('nav.logo') }}</div>
    <div class="napkin-nav-links">
      <a href="javascript:void(0);" onclick="window.scrollTo({ top: 0, behavior: 'smooth' });" class="napkin-nav-link">{{
          t('nav.home')
        }}</a>
      <a href="#skills" class="napkin-nav-link">{{ t('nav.skill') }}</a>
      <a href="#projects" class="napkin-nav-link">{{ t('nav.experience') }}</a>
      <a href="#gallery" class="napkin-nav-link">{{ t('nav.gallery') }}</a>
      <!-- 修改为点击后弹出 About 模态框 -->
      <a href="javascript:void(0);" @click="toggleAboutModal" class="napkin-nav-link">{{ t('nav.resume') }}</a>
      <a href="#footer" class="napkin-nav-link">{{ t('nav.footer') }}</a>
    </div>
    <div class="napkin-controls">
      <!-- GitHub 按钮 -->
      <a href="https://github.com/RCPawn" target="_blank" class="napkin-control-btn github">
        <svg viewBox="0 0 24 24" class="napkin-icon">
          <path fill="currentColor"
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
        </svg>
        <span>GitHub</span>
      </a>
      <!-- 语言切换按钮 -->
      <button @click="toggleLanguage" class="napkin-control-btn language">
        <svg viewBox="0 0 24 24" class="napkin-icon">
          <path fill="currentColor"
                d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-2.5-13.5h5M9.5 7v9M14.5 7v9M8 10.5c0 4.5 3.5 6.5 8 6.5M16 7.5c0 4.5-3.5 6.5-8 6.5"></path>
        </svg>
        <span>{{ locale === 'cn' ? 'EN' : 'CN' }}</span>
      </button>
      <!-- 主题切换按钮 -->
      <button @click="toggleTheme" class="napkin-control-btn theme">
        <svg v-if="!isDarkMode" viewBox="0 0 24 24" class="napkin-icon">
          <path fill="currentColor"
                d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2a7 7 0 1 1 0-14 7 7 0 0 1 0 14zM12 5V3M12 21v-2M4.22 6.22 5.64 7.64M18.36 16.36l1.42 1.42M3 12h2M19 12h2M4.22 17.78l1.42-1.42M18.36 7.64l1.42-1.42"></path>
        </svg>
        <svg v-else viewBox="0 0 24 24" class="napkin-icon">
          <path fill="currentColor"
                d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"></path>
        </svg>
      </button>
    </div>
  </nav>

  <!-- 修改后的模态框结构 -->
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="showAboutModal" class="modal-mask">
        <div class="modal-wrapper">
          <div ref="modalRef" class="modal-container">
            <button class="modal-close" @click="toggleAboutModal">&times;</button>
            <AboutSection
                :isVisible="showAboutModal"
                @close="showAboutModal = false"
            />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useI18n} from 'vue-i18n'
import {enable as enableDarkMode, disable as disableDarkMode, setFetchMethod} from 'darkreader'
import AboutSection from '@/components/ResumeSection.vue'
// 新增导入
import {onClickOutside} from '@vueuse/core'
// 新增模态框状态
const showAboutModal = ref(false)
const modalRef = ref(null)
const {locale, t} = useI18n()
const isDarkMode = ref(false)

// 切换 About 模态框的显示状态
const toggleAboutModal = () => {
  showAboutModal.value = !showAboutModal.value
}

onClickOutside(modalRef, () => {
  showAboutModal.value = false
})

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  isDarkMode.value = savedTheme === 'dark'
  if (isDarkMode.value) {
    enableDarkMode({brightness: 100, contrast: 90, sepia: 10})
  } else {
    disableDarkMode()
  }

  const savedLanguage = localStorage.getItem('language')
  if (savedLanguage) {
    locale.value = savedLanguage
  }

  // 添加平滑滚动导航功能
  document.querySelectorAll('.napkin-nav-link:not(router-link)').forEach(link => {
    link.addEventListener('click', handleNavLinkClick)
  })
})

// 处理导航链接点击（平滑滚动效果）
const handleNavLinkClick = (e) => {
  e.preventDefault()
  const targetId = e.currentTarget.getAttribute('href')
  if (!targetId || targetId === 'javascript:void(0);') return

  const targetElement = document.querySelector(targetId)
  if (targetElement) {
    const navHeight = document.querySelector('.napkin-nav').offsetHeight
    const elementPosition = targetElement.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.scrollY - navHeight

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
    history.pushState(null, null, targetId)
  }
}

const toggleLanguage = () => {
  document.body.classList.add('language-transition')
  locale.value = locale.value === 'en' ? 'cn' : 'en'
  localStorage.setItem('language', locale.value)
  setTimeout(() => {
    document.body.classList.remove('language-transition')
  }, 300)
}

// Set the fetch method once, preferably during app initialization
setFetchMethod(window.fetch);

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    enableDarkMode({
      brightness: 100,
      contrast: 90,
      sepia: 10,
    });
    localStorage.setItem('theme', 'dark');
  } else {
    disableDarkMode();
    localStorage.setItem('theme', 'light');
  }

  // 🔥 新增：派发一个全局事件，通知 HeroSection 调整 3D 模型
  window.dispatchEvent(new CustomEvent('theme-changed', { detail: { isDark: isDarkMode.value } }));
};
</script>

<style scoped>
/* 引入 Inter 字体 */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

/* 定义颜色变量 */
:root {
  --text-color: #333; /* 深灰色文字 */
  --primary-color: #0070f3; /* 亮蓝色，更现代 */
  --secondary-color: #666; /* 辅助文字颜色 */
  --background-color: #fff; /* 白色背景 */
  --border-color: #ddd; /* 边框颜色 */
  --hover-shadow: rgba(0, 0, 0, 0.1); /* 悬停阴影颜色 */
}

/* 导航栏 */
.napkin-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #F8F8F8;
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Logo */
.napkin-logo {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 2rem;
  color: var(--text-color);
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.napkin-logo:hover {
  transform: scale(1.05); /* 悬停放大 */
}

/* 修改导航链接样式，使其居中 */
.napkin-nav-links {
  position: absolute; /* 绝对定位 */
  left: 50%; /* 从左边50%位置开始 */
  transform: translateX(-50%); /* 向左平移自身宽度的一半，实现居中 */
  display: flex;
  gap: 2rem;
}

/* 添加平滑滚动效果 */
html {
  scroll-behavior: smooth;
}

.napkin-nav-link {
  color: var(--text-color);
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 1rem;
  position: relative;
  transition: color 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
}

.napkin-nav-link:hover {
  color: var(--primary-color);
  transform: scale(1.05);
}

.napkin-nav-link:active {
  transform: scale(0.98); /* 点击时轻微收缩效果 */
}

/* 点击动画效果 */
.napkin-nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary-color);
  transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.napkin-nav-link:hover::after {
  width: 100%;
}

/* 控制按钮 */
.napkin-controls {
  display: flex;
  gap: 0.75rem;
}

.napkin-control-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #F8F8F8;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--secondary-color);
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  text-decoration: none;
}

.napkin-control-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 10px var(--hover-shadow);
  color: var(--text-color);
}

.napkin-control-btn.github:hover {
  box-shadow: 0 4px 15px rgba(36, 41, 46, 0.2);
}

.napkin-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.napkin-control-btn:hover .napkin-icon {
  transform: rotate(15deg);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .napkin-nav {
    padding: 0.75rem 1rem;
  }

  .napkin-nav-links {
    gap: 1.5rem;
  }

  .napkin-control-btn span {
    display: none; /* 小屏幕隐藏按钮文字 */
  }

  .napkin-control-btn {
    padding: 0.5rem;
  }
}

@media (max-width: 640px) {
  .napkin-nav-links {
    display: none; /* 超小屏幕隐藏导航链接 */
  }
}

/* 语言切换过渡 */
.language-transition {
  transition: all 0.3s ease;
}

/* 模态框样式 */
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px); /* 毛玻璃效果 */
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  width: 90%;
  max-width: 600px;
}

.modal-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #F8F8F8;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  width: 1000px; /* 固定宽度 */
}


.modal-close {
  position: absolute;
  top: 20px;      /* 距离顶部距离 */
  right: 20px;    /* 距离右侧距离 */
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
  padding: 4px;    /* 增加点击区域 */
  z-index: 1;      /* 确保在最顶层 */
  line-height: 1;  /* 消除行高影响 */
}

.modal-close:hover {
  color: #333;
}

/* 过渡动画 */
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
}
</style>