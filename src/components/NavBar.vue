<template>
  <nav class="napkin-nav" :class="{ 'napkin-nav--rolled': navScrollCompact }">
    <!-- RCPAWN Logo -->
    <div class="napkin-logo">{{ t('nav.logo') }}</div>
    <div class="napkin-nav-links">
      <a href="javascript:void(0);" onclick="window.scrollTo({ top: 0, behavior: 'smooth' });" class="napkin-nav-link">{{ t('nav.intro') }}</a>
      <a href="#projects" class="napkin-nav-link">{{ t('nav.journey') }}</a>
      <a href="#gallery" class="napkin-nav-link">{{ t('nav.works') }}</a>
      <a href="#footer" class="napkin-nav-link">{{ t('nav.contact') }}</a>
      <router-link to="/game" class="napkin-nav-link napkin-nav-game">
        <svg class="napkin-nav-game-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path
            fill="currentColor"
            d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H9v2H7v-2H5v-2h2V9h2v2h2v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5S20.33 12 19.5 12z"
          />
        </svg>
        <span class="napkin-nav-game-label">{{ t('nav.game') }}</span>
      </router-link>
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
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import ThemeAppearanceToggle from '@/components/ThemeAppearanceToggle.vue'

const { locale, t } = useI18n()

/** 首页惰性挂载区块后，再滚动到 #projects 等锚点（由 HomeView provide） */
const ensureHomeBelowFold = inject('ensureHomeBelowFold', null)

/** 页面下移后关闭毛玻璃、改用略实的顶栏底，滚动更轻且仍整洁 */
const navScrollCompact = ref(false)
const SCROLL_COMPACT_PX = 28
let scrollRaf = 0
const syncNavScrollMode = () => {
  const y = window.scrollY || document.documentElement.scrollTop || 0
  navScrollCompact.value = y > SCROLL_COMPACT_PX
}
const onWindowScroll = () => {
  if (scrollRaf) return
  scrollRaf = requestAnimationFrame(() => {
    scrollRaf = 0
    syncNavScrollMode()
  })
}

const toggleLanguage = () => {
  document.body.classList.add('language-transition')
  locale.value = locale.value === 'en' ? 'cn' : 'en'
  localStorage.setItem('language', locale.value)
  setTimeout(() => {
    document.body.classList.remove('language-transition')
  }, 300)
}

const handleNavLinkClick = async (e) => {
  e.preventDefault()
  const rawHref = e.currentTarget.getAttribute('href')
  if (!rawHref || rawHref === 'javascript:void(0);') return

  const targetId = rawHref.split('?')[0]
  const needsBelowFold = /^#(projects|gallery|footer)$/.test(targetId)
  if (needsBelowFold && typeof ensureHomeBelowFold === 'function') {
    await ensureHomeBelowFold()
    await nextTick()
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
  }

  const targetElement = document.querySelector(targetId)
  if (targetElement) {
    const navBar = document.querySelector('.napkin-nav')
    const navHeight = navBar ? navBar.offsetHeight : 60
    const elementPosition = targetElement.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.scrollY - navHeight
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
    history.pushState(null, null, rawHref)
  }
}

onMounted(() => {
  const savedLanguage = localStorage.getItem('language')
  if (savedLanguage) {
    locale.value = savedLanguage
  }
  document.querySelectorAll('.napkin-nav-link[href^="#"]').forEach((link) => {
    link.addEventListener('click', handleNavLinkClick)
  })
  syncNavScrollMode()
  window.addEventListener('scroll', onWindowScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onWindowScroll)
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
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
  transition:
    background-color 0.38s ease,
    backdrop-filter 0.38s ease,
    -webkit-backdrop-filter 0.38s ease,
    border-bottom-color 0.38s ease,
    box-shadow 0.38s ease;
  /* 独立合成层，减轻 document 滚动时与 backdrop-filter 叠加的开销（不改变样式数值） */
  transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/*
 * 滚动后：去掉 backdrop-filter（大屏滚动成本主要来源），用略不透明白/暗底 + 轻阴影保持质感
 */
.napkin-nav.napkin-nav--rolled {
  background-color: rgba(255, 255, 255, 0.93);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border-bottom-color: color-mix(in srgb, var(--border-color) 78%, transparent);
  box-shadow: 0 6px 24px -18px rgba(15, 23, 42, 0.18);
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

/* 中间锚点：仅变色，无上移（与右侧控制钮交互一致） */
.napkin-nav-link:not(.napkin-nav-game):hover {
  color: var(--primary-color);
}

/* 「我的游戏」：主色常驻，与同排链接一样悬停不上移 */
.napkin-nav-game {
  gap: 0.28rem;
  margin-inline-start: 0.2rem;
  padding: 0.15rem 0.32rem 0.15rem 0.22rem;
  color: var(--primary-color);
  font-weight: 500;
}

.napkin-nav-game-icon {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  display: block;
  transform-origin: 50% 50%;
  color: inherit;
  opacity: 1;
}

/* 悬停：图标轻微摆动，文案不位移 */
@keyframes napkin-nav-game-icon-wiggle {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  22% {
    transform: translate(-1px, 0.5px) rotate(-2.5deg);
  }
  48% {
    transform: translate(1px, -0.5px) rotate(2.5deg);
  }
  72% {
    transform: translate(-0.5px, 0) rotate(-1deg);
  }
}

.napkin-nav-game:hover .napkin-nav-game-icon {
  animation: napkin-nav-game-icon-wiggle 0.38s ease-out both;
}

.napkin-nav-game-label {
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 1.25;
}

.napkin-nav-game.router-link-active {
  color: var(--primary-color);
}

.napkin-nav-game.router-link-active .napkin-nav-game-icon {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .napkin-nav-link {
    transition: color 0.2s ease;
  }

  .napkin-control-btn {
    transition: color 0.2s ease, background-color 0.2s ease;
  }

  .napkin-nav-game:hover .napkin-nav-game-icon {
    animation: none;
  }

  .napkin-control-btn.github:hover .napkin-icon,
  .napkin-control-btn.language:hover .napkin-icon {
    transform: none;
  }
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

  /* 与毛玻璃顶栏协调：常驻柔和底，悬停不再叠一层底色，避免「整块亮起」打断阅读 */
  background-color: var(--btn-bg);
  border: none;
  border-radius: 7px;
  box-shadow: none;

  color: var(--secondary-color);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease;
  text-decoration: none;
}

.napkin-control-btn:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* 悬停仅强化文字色，背景保持与默认一致 */
.napkin-control-btn:hover {
  color: var(--text-color);
}

/* 主题：与 GoBack ghost 同款主色浅底（仅 hover，无图标震动） */
.napkin-control-btn.theme:hover {
  background-color: rgba(var(--primary-color-rgb), 0.1);
  color: var(--primary-color);
}

html.dark .napkin-control-btn.theme:hover {
  background-color: rgba(var(--primary-color-rgb), 0.2);
}

/* GitHub / 语言：悬停文案与图标为主色（与主题钮文字反馈一致） */
.napkin-control-btn.github:hover,
.napkin-control-btn.language:hover {
  color: var(--primary-color);
}

/* 图标：GitHub / 语言 悬停旋转 */
.napkin-control-btn .napkin-icon {
  display: block;
  flex-shrink: 0;
  transform-origin: 50% 50%;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.napkin-icon {
  width: 16px;
  height: 16px;
  color: inherit; /* 跟随文字颜色 */
}

/* 顶栏断点与 .napkin-icon 同档，避免右排图标大小不一 */
.napkin-control-btn.theme :deep(.theme-appearance-toggle__ico) {
  width: 16px;
  height: 16px;
}

.napkin-control-btn.github:hover .napkin-icon,
.napkin-control-btn.language:hover .napkin-icon {
  transform: rotate(10deg);
}

/* 响应式 */
@media (max-width: 768px) {
  .napkin-nav {
    --nav-pad-y: 0.5625rem;
    --nav-pad-x: 1rem;
    padding: var(--nav-pad-y) var(--nav-pad-x);
  }

  /* 小屏仅保留居中的「我的游戏」，其余锚点收入滚动或后续扩展 */
  .napkin-nav-link:not(.napkin-nav-game) {
    display: none;
  }

  .napkin-nav-game {
    margin-inline-start: 0;
  }

  .napkin-control-btn span {
    display: none;
  }
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

  .napkin-nav-game {
    padding: 0.2rem 0.42rem 0.2rem 0.3rem;
    gap: 0.3rem;
  }

  .napkin-nav-game-label {
    font-size: 0.85rem;
  }

  .napkin-nav-game-icon {
    width: 15px;
    height: 15px;
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

  .napkin-control-btn.theme :deep(.theme-appearance-toggle__ico) {
    width: 17px;
    height: 17px;
  }
}

@media (min-width: 1920px) {
  .napkin-nav:not(.napkin-nav--rolled) {
    --nav-pad-y: 0.75rem;
    /* 略减 blur 半径；与 main.css 同步提高 --nav-bg 不透明度，观感几乎不变 */
    backdrop-filter: blur(9px);
    -webkit-backdrop-filter: blur(9px);
  }

  .napkin-nav.napkin-nav--rolled {
    --nav-pad-y: 0.75rem;
  }

  .napkin-logo {
    font-size: 1.8rem;
  }

  .napkin-nav-links {
    gap: 1.5rem;
  }

  .napkin-nav-game {
    padding: 0.2rem 0.45rem 0.2rem 0.32rem;
    gap: 0.32rem;
  }

  .napkin-nav-game-label {
    font-size: 0.875rem;
  }

  .napkin-nav-game-icon {
    width: 16px;
    height: 16px;
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

  .napkin-control-btn.theme :deep(.theme-appearance-toggle__ico) {
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

/* 深色：底边改浅灰半透明，避免与 body 背景形成「黑细缝」 */
html.dark .napkin-nav {
  border-bottom-color: rgba(148, 163, 184, 0.16);
}

/* 深色：滚动压实顶栏底（scoped 外，需挂 html.dark） */
html.dark .napkin-nav.napkin-nav--rolled {
  background-color: rgba(28, 28, 30, 0.94);
  border-bottom-color: rgba(148, 163, 184, 0.2);
  box-shadow: 0 10px 36px -14px rgba(0, 0, 0, 0.62);
}
</style>