<template>
  <nav class="napkin-nav">
    <!-- RCPAWN Logo -->
    <div class="napkin-logo">{{ t('nav.logo') }}</div>
    <div class="napkin-nav-links">
      <a href="javascript:void(0);" onclick="window.scrollTo({ top: 0, behavior: 'smooth' });" class="napkin-nav-link">{{ t('nav.home') }}</a>
      <a href="#projects" class="napkin-nav-link">{{ t('nav.experience') }}</a>
<!--      <a href="#skills" class="napkin-nav-link">{{ t('nav.skill') }}</a>-->
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
      <ThemeAppearanceToggle class="napkin-control-btn theme" />
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
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AboutSection from '@/components/ResumeSection.vue'
import ThemeAppearanceToggle from '@/components/ThemeAppearanceToggle.vue'
import { onClickOutside } from '@vueuse/core'

const showAboutModal = ref(false)
const modalRef = ref(null)
const { locale, t } = useI18n()

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
  document.querySelectorAll('.napkin-nav-link:not([onclick])').forEach(link => {
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
  /*
   * 与 Hero / Projects / main.css 一致：默认紧凑，仅在 min-width 1600 / 1920 小幅加码，
   * 避免用大系数 vw 在宽屏笔记本上把整条栏撑得过高。
   */
  --nav-pad-y: 0.5625rem;
  --nav-pad-x: max(1rem, var(--page-pad-x));
  padding: var(--nav-pad-y) var(--nav-pad-x);

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
  font-size: 1.5rem;
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
  align-items: center;
  gap: 1.125rem;
  /* 保证中层导航在左右两栏之上，避免偶发层叠导致「只有字能点」 */
  z-index: 1;
}

.napkin-nav-link {
  /* inline 时 padding 的命中区域不稳定；inline-flex 整块可点（常见导航做法） */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-height: 2.25rem;
  padding: 0.15rem 0.35rem;
  margin: 0;
  cursor: pointer;

  color: var(--secondary-color); /* 默认次要颜色，不抢 Logo 风头 */
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  position: relative;
  transition: color 0.2s ease;
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
  gap: 0.45rem;

  height: 34px;
  padding: 0 11px;

  /* 样式优化 */
  background-color: transparent; /* 默认透明，更清爽 */
  border: 1px solid transparent; /* 预留边框位置 */
  border-radius: 7px;

  color: var(--secondary-color);
  font-size: 0.8125rem;
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
  width: 16px;
  height: 16px;
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

@media (max-width: 768px) {
  .modal-wrapper {
    width: 100%;
    max-width: 100%;
    padding-left: max(10px, env(safe-area-inset-left, 0px));
    padding-right: max(10px, env(safe-area-inset-right, 0px));
    box-sizing: border-box;
  }

  .modal-container {
    max-height: min(94dvh, 1000px);
  }
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
  .napkin-nav {
    --nav-pad-y: 0.5625rem;
    --nav-pad-x: 1rem;
    padding: var(--nav-pad-y) var(--nav-pad-x);
  }
  .napkin-nav-links { display: none; }
  .napkin-control-btn span { display: none; }
  .napkin-control-btn {
    padding: 0;
    width: 36px;
    min-width: 36px;
    height: 36px;
    box-sizing: border-box;
  }
}

/* 与 main.css、HeroSection、ProjectsSection 同档断点 */
@media (min-width: 1600px) {
  .napkin-nav {
    --nav-pad-y: 0.6875rem;
  }

  .napkin-logo {
    font-size: 1.65rem;
  }

  .napkin-nav-links {
    gap: 1.375rem;
  }

  .napkin-nav-link {
    font-size: 0.95rem;
    min-height: 2.375rem;
    padding: 0.2rem 0.4rem;
  }

  .napkin-controls {
    gap: 1rem;
  }

  .napkin-control-btn {
    height: 36px;
    padding: 0 12px;
    border-radius: 8px;
    font-size: 0.875rem;
  }

  .napkin-icon {
    width: 17px;
    height: 17px;
  }
}

@media (min-width: 1920px) {
  .napkin-nav {
    --nav-pad-y: 0.75rem;
  }

  .napkin-logo {
    font-size: 1.8rem;
  }

  .napkin-nav-links {
    gap: 1.5rem;
  }

  .napkin-controls {
    gap: 1.125rem;
  }

  .napkin-control-btn {
    height: 38px;
    padding: 0 14px;
  }

  .napkin-icon {
    width: 18px;
    height: 18px;
  }
}
</style>

<style>
/* 与顶栏实际高度同档，供 #footer 等 scroll-margin（阶梯与上文断点一致） */
html {
  /* 与链接 min-height + 竖向 padding 对齐，供锚点 scroll-margin */
  --layout-navbar-height: 56px;
}

@media (min-width: 1600px) {
  html {
    --layout-navbar-height: 58px;
  }
}

@media (min-width: 1920px) {
  html {
    --layout-navbar-height: 64px;
  }
}
</style>