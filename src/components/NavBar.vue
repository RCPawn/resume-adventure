<template>
  <nav class="napkin-nav">
    <!-- RCPAWN Logo -->
    <div class="napkin-logo">{{ t('nav.logo') }}</div>
    <div class="napkin-nav-links">
      <a
        href="javascript:void(0);"
        onclick="window.scrollTo({ top: 0, behavior: 'smooth' });"
        class="napkin-nav-link"
      >{{ t('nav.intro') }}</a>
      <a href="#projects" class="napkin-nav-link">{{ t('nav.journey') }}</a>
      <a href="#gallery" class="napkin-nav-link">{{ t('nav.works') }}</a>
      <a href="#footer" class="napkin-nav-link">{{ t('nav.contact') }}</a>
      <div class="napkin-nav-app-cluster" role="group">
        <router-link
          :to="{ name: 'share-home' }"
          class="napkin-nav-link napkin-nav-share"
          :class="{ 'router-link-active': shareNavActive }"
        >{{ t('nav.share') }}</router-link>
        <router-link to="/game" class="napkin-nav-link napkin-nav-game">{{ t('nav.game') }}</router-link>
      </div>
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
import { onMounted, inject, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ThemeAppearanceToggle from '@/components/ThemeAppearanceToggle.vue'

const { locale, t } = useI18n()
const route = useRoute()

/** 全文库列表与详情同属「栈迹文库」导航态 */
const shareNavActive = computed(
  () => route.name === 'share-home' || route.name === 'share-detail',
)

/** 首页惰性挂载区块后，再滚动到 #projects 等锚点（由 HomeView provide） */
const ensureHomeBelowFold = inject('ensureHomeBelowFold', null)

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
})
</script>

<!-- 组件内样式：导航栏布局与交互 -->
<style scoped>
/* =========================================
   导航栏：固定窄边高度 + 实底层次阴影（无滚动缩放、无 backdrop-filter）
   ========================================= */
.napkin-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  --nav-pad-y: 0.375rem;
  --nav-pad-x: max(1rem, var(--page-pad-x));
  padding: var(--nav-pad-y) var(--nav-pad-x);

  background-color: var(--bg-color);
  border-bottom: 1px solid
    color-mix(in srgb, var(--border-color) 38%, transparent);
  /* 仅环境阴影，避免再叠一条 1px 与 border 形成「双轨线」 */
  box-shadow: 0 4px 16px -6px color-mix(in srgb, var(--text-color) 6%, transparent);

  position: sticky;
  top: 0;
  z-index: 100;
  transition:
    background-color 0.38s ease,
    border-bottom-color 0.38s ease,
    box-shadow 0.38s ease;
  transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* =========================================
   Logo 区域
   ========================================= */
.napkin-logo {
  font-weight: 700;
  font-size: 1.45rem;
  color: var(--text-color);
  letter-spacing: -0.02em;
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
  gap: 1.625rem;
  /* 保证中层导航在左右两栏之上，避免偶发层叠导致「只有字能点」 */
  z-index: 1;
}

/* 文库 + 游戏：同一视觉组，组内间距远小于主导航 gap，避免两道主色并排抢戏 */
.napkin-nav-app-cluster {
  display: inline-flex;
  align-items: center;
  gap: 0.12rem;
}

.napkin-nav-app-cluster .napkin-nav-share {
  position: relative;
  padding-right: 0.44rem;
}

.napkin-nav-app-cluster .napkin-nav-share::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 0.7rem;
  background: color-mix(in srgb, var(--border-color) 58%, transparent);
  border-radius: 1px;
  pointer-events: none;
}

.napkin-nav-link {
  /* inline 时 padding 的命中区域不稳定；inline-flex 整块可点（常见导航做法） */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-height: 2.125rem;
  padding: 0.15rem 0.4rem;
  margin: 0;
  cursor: pointer;

  color: var(--secondary-color); /* 默认次要颜色，不抢 Logo 风头 */
  text-decoration: none;
  font-weight: 500;
  font-size: 0.925rem;
  position: relative;
  transition: color 0.2s ease;
}

.napkin-nav-link:hover {
  color: var(--primary-color);
}

/* 「栈迹文库」「我的游戏」：默认与主导航同为次要色；悬停 / 当前路由才主色，避免双蓝并排。
 * 字号与当初仅去图标时一致（原 label 样式），略小于其它锚点。 */
.napkin-nav-game,
.napkin-nav-share {
  padding: 0.15rem 0.32rem;
  color: var(--secondary-color);
  font-weight: 500;
  font-size: 0.8125rem;
  letter-spacing: 0.02em;
  line-height: 1.25;
}

.napkin-nav-game:hover,
.napkin-nav-share:hover,
.napkin-nav-game.router-link-active,
.napkin-nav-share.router-link-active {
  color: var(--primary-color);
}

.napkin-nav-game.router-link-active,
.napkin-nav-share.router-link-active {
  font-weight: 600;
}

@media (prefers-reduced-motion: reduce) {
  .napkin-nav-link {
    transition: color 0.2s ease;
  }

  .napkin-control-btn {
    transition: color 0.2s ease, background-color 0.2s ease;
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
  gap: 0.95rem;
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
    --nav-pad-y: 0.375rem;
    --nav-pad-x: 1rem;
    padding: var(--nav-pad-y) var(--nav-pad-x);
  }

  /* 小屏仅保留文库+游戏；组内再收紧，与右排按钮区平衡 */
  .napkin-nav-app-cluster {
    gap: 0.08rem;
  }

  .napkin-nav-app-cluster .napkin-nav-share {
    padding-right: 0.38rem;
  }
  .napkin-nav-link:not(.napkin-nav-game):not(.napkin-nav-share) {
    display: none;
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
    --nav-pad-y: 0.4375rem;
  }

  .napkin-logo {
    font-size: 1.58rem;
  }

  .napkin-nav-links {
    gap: 1.875rem;
  }

  .napkin-nav-app-cluster {
    gap: 0.15rem;
  }

  .napkin-nav-app-cluster .napkin-nav-share {
    padding-right: 0.48rem;
  }

  .napkin-nav-app-cluster .napkin-nav-share::after {
    height: 0.75rem;
  }

  .napkin-nav-link {
    font-size: 0.95rem;
    min-height: 2.25rem;
    padding: 0.18rem 0.42rem;
  }

  .napkin-nav-game,
  .napkin-nav-share {
    padding: 0.18rem 0.42rem;
    font-size: 0.85rem;
  }

  .napkin-controls {
    gap: 1.1rem;
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
  .napkin-nav {
    --nav-pad-y: 0.5rem;
  }

  .napkin-logo {
    font-size: 1.72rem;
  }

  .napkin-nav-links {
    gap: 2rem;
  }

  .napkin-nav-app-cluster {
    gap: 0.18rem;
  }

  .napkin-nav-link {
    font-size: 0.97rem;
    min-height: 2.3125rem;
    padding: 0.2rem 0.44rem;
  }

  .napkin-nav-game,
  .napkin-nav-share {
    padding: 0.2rem 0.44rem;
    font-size: 0.875rem;
  }

  .napkin-controls {
    gap: 1.2rem;
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
  --layout-navbar-height: 52px;
}

@media (min-width: 1600px) {
  html {
    --layout-navbar-height: 54px;
  }
}

@media (min-width: 1920px) {
  html {
    --layout-navbar-height: 56px;
  }
}

/* 深色：弱化底部分割线，不留第二条发丝投影 */
html.dark .napkin-nav {
  background-color: var(--bg-color);
  border-bottom-color: color-mix(in srgb, var(--border-color) 22%, transparent);
  box-shadow: 0 10px 26px -14px rgba(0, 0, 0, 0.38);
}
</style>