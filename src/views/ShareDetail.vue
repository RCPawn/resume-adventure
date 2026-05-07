<template>
  <div ref="pageContainerRef" class="page-container">
    <!-- 全宽功能条：返回、标签、统计同一视觉轨道（栈迹文库正文来自 docs/technical） -->
    <header ref="actionBarRef" class="action-bar">
      <div class="action-bar__inner">
        <div class="action-bar__cluster action-bar__cluster--grow">
          <div class="action-bar__nav">
            <GoBackButton variant="ghost" inline fallback-path="/share" />
            <ThemeAppearanceToggle variant="doc" />
          </div>
          <template v-if="article">
            <span class="action-bar__rule" aria-hidden="true" />
            <div class="action-bar__tags" :aria-label="t('share.tagsAria')">
              <span
                v-for="tag in (article.tags || [])"
                :key="tag"
                class="action-tag"
                :title="tag"
              >{{ tag }}</span>
            </div>
          </template>
        </div>
        <div v-if="article" class="action-bar__cluster action-bar__cluster--end">
          <span class="action-kpi" :title="t('share.dateCaption')">
            <svg class="action-kpi__ico" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
            </svg>
            {{ article.date || '—' }}
          </span>
          <span class="action-bar__rule action-bar__rule--soft" aria-hidden="true" />
          <span class="action-kpi" :title="t('share.pagePvCaption')">
            <svg class="action-kpi__ico" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            <!-- 不蒜子会写入纯文本；勿放初始「--」在节点内，否则部分环境下脚本不覆盖；占位由 :empty::before 提供 -->
            <span id="busuanzi_page_pv" v-once class="page-pv-num page-pv-busuanzi" aria-live="polite" />
            <span class="page-pv-suffix">{{ t('share.pagePvSuffix') }}</span>
          </span>
        </div>
      </div>
    </header>

    <div class="doc-stage">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        {{ t('share.loading') }}
      </div>
      <div v-else-if="error" class="error-state">😕 {{ error }}</div>
      <div v-else class="doc-layout" :class="{ 'doc-layout--with-toc': toc.length > 0 }">
        <aside v-if="toc.length" ref="tocAsideRef" class="doc-layout__aside toc" :class="{ 'toc-hidden': isTocHidden }">
          <div class="doc-toc">
            <div class="toc-header" @click="toggleToc" role="button" tabindex="0" @keydown.enter="toggleToc">
              <div class="toc-title">
                <svg class="toc-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path fill="currentColor" d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z"></path>
                </svg>
                <strong>{{ t('share.tocTitle') }}</strong>
              </div>
              <button type="button" class="toc-toggle" :aria-label="t('share.tocToggleAria')">
                <span class="chev" :class="{ open: !isTocHidden }">
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
                  </svg>
                </span>
              </button>
            </div>
            <div v-if="!isTocHidden" class="toc-scroll">
              <nav class="toc-list">
                <ul>
                  <li v-for="item in toc" :key="item.slug" :class="`level-${item.level}`">
                    <a :href="`#${item.slug}`" @click.prevent="scrollToId(item.slug)">{{ item.title }}</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </aside>
        <main
          class="markdown-column markdown-body"
          :key="`share-md-${String(route.params.slug)}-${isDarkMode}`"
          v-html="htmlContent"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import mermaid from 'mermaid'
import { getShareArticleBySlug } from '@/data/shareDocsRegistry'
import { createDocMarkdownIt } from '@/utils/markdownItDoc'
import GoBackButton from '@/components/GoBackButton.vue'
import ThemeAppearanceToggle from '@/components/ThemeAppearanceToggle.vue'
import { useAppearanceTheme } from '@/composables/useAppearanceTheme'
import { requestBusuanziApply } from '@/utils/busuanziApi'
import 'github-markdown-css/github-markdown.css'
import '@/assets/doc-github-markdown-theme-bridge.css'
import '@/assets/doc-hljs-github-light-scoped.css'
import '@/assets/doc-hljs-github-dark-scoped.css'

const route = useRoute()
const { isDarkMode } = useAppearanceTheme()
const { t } = useI18n()

/** 当前 slug 对应的 MarkdownIt（含相对图片前缀），随路由重建 */
const mdRef = ref(null)

const loading = ref(true)
const error = ref('')
/** 成功解析后的正文 Markdown（无 frontmatter），用于亮暗切换时重渲染正文与 Mermaid */
const mdSourceText = ref('')
const htmlContent = ref('')
const toc = ref([])
const isTocHidden = ref(false)
const article = computed(() => getShareArticleBySlug(route.params.slug))

/** 顶栏实测高度 → --action-bar-actual；侧栏列占位 → 目录 position:fixed 的 left/width（桌面端消除 sticky 抖动） */
const pageContainerRef = ref(null)
const actionBarRef = ref(null)
const tocAsideRef = ref(null)
let actionBarResizeObserver = null
let tocAsideResizeObserver = null
let winResizeHandler = null

const syncActionBarMetrics = () => {
  const root = pageContainerRef.value
  const bar = actionBarRef.value
  if (!root || !bar || typeof bar.offsetHeight !== 'number') return
  root.style.setProperty('--action-bar-actual', `${bar.offsetHeight}px`)
}

/** 桌面：目录固定于视口，left/width 与 Grid 侧栏列对齐；窄屏清除变量恢复流式布局 */
const syncTocFixedPanel = () => {
  const root = pageContainerRef.value
  const aside = tocAsideRef.value
  if (!root || typeof window === 'undefined') return
  if (!aside || window.innerWidth <= 768) {
    root.style.removeProperty('--toc-fixed-left')
    root.style.removeProperty('--toc-fixed-width')
    return
  }
  const r = aside.getBoundingClientRect()
  root.style.setProperty('--toc-fixed-left', `${Math.round(r.left)}px`)
  root.style.setProperty('--toc-fixed-width', `${Math.round(r.width)}px`)
}

const reconnectTocAsideObserver = () => {
  if (tocAsideResizeObserver) {
    tocAsideResizeObserver.disconnect()
    tocAsideResizeObserver = null
  }
  const el = tocAsideRef.value
  if (!el || typeof ResizeObserver === 'undefined') return
  tocAsideResizeObserver = new ResizeObserver(() => {
    syncTocFixedPanel()
  })
  tocAsideResizeObserver.observe(el)
}

const scrollToId = (id) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (window.innerWidth <= 768) isTocHidden.value = true
  }
}
const toggleToc = () => { isTocHidden.value = !isTocHidden.value }

/**
 * GitHub 将 Mermaid 放在独立 iframe/Viewscreen 中渲染，避免仓库页全局 CSS 影响 foreignObject。
 * 我们用 Shadow DOM 达到同等「样式隔离」，图表内仅保留系统字体栈与少量重置，接近 github.com 上的观感。
 */
const MERMAID_FONT_STACK =
  '"Bricolage Grotesque", "Noto Sans SC", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'

const mountMermaidInShadowRoot = (svgMarkup, isDark) => {
  const host = document.createElement('div')
  host.className = 'mermaid-block mermaid-github-host'
  host.setAttribute('role', 'img')
  const shadow = host.attachShadow({ mode: 'open' })
  const bg = isDark ? '#0d1117' : '#ffffff'
  const fg = isDark ? '#e6edf3' : '#24292f'
  const style = document.createElement('style')
  style.textContent = `
    :host {
      display: block;
      width: 100%;
      box-sizing: border-box;
      color: ${fg};
    }
    .mermaid-inner {
      box-sizing: border-box;
      width: 100%;
      overflow-x: auto;
      overflow-y: visible;
      -webkit-overflow-scrolling: touch;
      padding: 16px;
      background: ${bg};
      border-radius: 0;
    }
    .mermaid-inner svg {
      display: block;
      margin: 0 auto;
      max-width: 100%;
      height: auto;
    }
    .mermaid-inner foreignObject { overflow: visible; }
    .mermaid-inner foreignObject div {
      font-family: ${MERMAID_FONT_STACK} !important;
      font-size: 14px !important;
      line-height: 1.5 !important;
      color: inherit !important;
      word-break: keep-all !important;
      overflow-wrap: break-word !important;
      white-space: normal !important;
    }
  `
  const inner = document.createElement('div')
  inner.className = 'mermaid-inner'
  inner.innerHTML = svgMarkup
  shadow.append(style, inner)
  return host
}

/** 仅在亮/暗主题切换时调用 initialize，避免每次正文变更重复配置 */
let mermaidConfiguredThemeKey = null
const ensureMermaidConfigured = (isDark) => {
  const themeKey = isDark ? 'dark' : 'default'
  if (mermaidConfiguredThemeKey === themeKey) return
  mermaidConfiguredThemeKey = themeKey
  mermaid.initialize({
    startOnLoad: false,
    theme: themeKey,
    securityLevel: 'loose',
    fontFamily: MERMAID_FONT_STACK,
    flowchart: {
      htmlLabels: true,
      curve: 'basis',
      useMaxWidth: true,
      padding: 12,
      nodeSpacing: 50,
      rankSpacing: 50,
      diagramPadding: 16,
    },
    sequence: {
      useMaxWidth: true,
      diagramMarginX: 24,
      diagramMarginY: 12,
      actorMargin: 60,
      boxMargin: 10,
      boxTextMargin: 5,
      noteMargin: 10,
      messageMargin: 35,
      mirrorActors: true,
    },
  })
}

/** 并发渲染代际：快速切换路由或反复替换 htmlContent 时，丢弃过期的异步结果，避免误改 DOM */
let mermaidRenderGeneration = 0

/** 将 markdown-it 输出的 ```mermaid 代码块替换为 SVG（需在 htmlContent 注入 DOM 后调用） */
const renderMermaidDiagrams = async () => {
  const gen = ++mermaidRenderGeneration
  await nextTick()
  if (gen !== mermaidRenderGeneration) return
  const root = document.querySelector('.markdown-body')
  if (!root) return
  const codes = root.querySelectorAll('pre code.language-mermaid')
  if (!codes.length) return

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  ensureMermaidConfigured(isDark)

  let i = 0
  for (const code of codes) {
    const pre = code.parentElement
    if (!pre || !pre.parentElement) continue
    const graph = (code.textContent || '').trim()
    if (!graph) continue
    const id = `mmd-${i++}-${Math.random().toString(36).slice(2, 9)}`
    try {
      const { svg } = await mermaid.render(id, graph)
      if (gen !== mermaidRenderGeneration) return
      const host = mountMermaidInShadowRoot(svg, isDark)
      pre.replaceWith(host)
    } catch (err) {
      console.warn('[mermaid]', err)
      if (gen !== mermaidRenderGeneration) return
      const fail = document.createElement('pre')
      fail.className = 'mermaid-error'
      fail.textContent = `图表渲染失败：${err?.message || String(err)}`
      pre.replaceWith(fail)
    }
  }
}

const fetchMarkdown = async () => {
  loading.value = true
  error.value = ''
  toc.value = []
  mdSourceText.value = ''
  try {
    const art = getShareArticleBySlug(route.params.slug)
    if (!art) throw new Error(t('share.detailNotFound'))
    const { md, slugify } = createDocMarkdownIt({ assetBase: art.assetDir })
    mdRef.value = md

    const text = art.body || ''
    mdSourceText.value = text

    const tokens = md.parse(text, {})
    const list = []
    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i]
      if (tok.type === 'heading_open') {
        const level = parseInt(tok.tag.replace('h', ''), 10)
        const next = tokens[i + 1]
        const title = next && next.type === 'inline' ? next.content : ''
        const slug = slugify(title || `heading-${i}`)
        if (level >= 2 && level <= 4) list.push({ level, title, slug })
      }
    }
    toc.value = list
    htmlContent.value = md.render(text)
  } catch (err) {
    error.value = err.message || String(err)
    mdSourceText.value = ''
    htmlContent.value = ''
    mdRef.value = null
  } finally {
    loading.value = false
    await nextTick()
    requestBusuanziApply()
  }
}

onMounted(async () => {
  if (typeof window !== 'undefined' && window.innerWidth <= 768) isTocHidden.value = true

  await nextTick()
  syncActionBarMetrics()
  if (typeof window !== 'undefined' && actionBarRef.value && typeof ResizeObserver !== 'undefined') {
    actionBarResizeObserver = new ResizeObserver(() => {
      syncActionBarMetrics()
      syncTocFixedPanel()
    })
    actionBarResizeObserver.observe(actionBarRef.value)
  }
  if (typeof window !== 'undefined' && !winResizeHandler) {
    winResizeHandler = () => {
      syncActionBarMetrics()
      syncTocFixedPanel()
    }
    window.addEventListener('resize', winResizeHandler, { passive: true })
  }

  await fetchMarkdown()

  await nextTick()
  syncActionBarMetrics()
  syncTocFixedPanel()
  reconnectTocAsideObserver()
})

onUnmounted(() => {
  if (actionBarResizeObserver && actionBarRef.value) {
    try {
      actionBarResizeObserver.unobserve(actionBarRef.value)
    } catch {
      /* noop */
    }
    actionBarResizeObserver.disconnect()
    actionBarResizeObserver = null
  }
  if (tocAsideResizeObserver) {
    tocAsideResizeObserver.disconnect()
    tocAsideResizeObserver = null
  }
  if (typeof window !== 'undefined' && winResizeHandler) {
    window.removeEventListener('resize', winResizeHandler)
    winResizeHandler = null
  }
  const root = pageContainerRef.value
  if (root) {
    root.style.removeProperty('--toc-fixed-left')
    root.style.removeProperty('--toc-fixed-width')
  }
})

watch(
  () => route.params.slug,
  () => {
    fetchMarkdown()
  }
)

watch(toc, async () => {
  await nextTick()
  syncTocFixedPanel()
  reconnectTocAsideObserver()
})

watch(htmlContent, async () => {
  await renderMermaidDiagrams()
  await nextTick()
  syncActionBarMetrics()
  syncTocFixedPanel()
  reconnectTocAsideObserver()
})

watch(isDarkMode, async () => {
  if (!mdSourceText.value || loading.value) return
  if (!mdRef.value) return
  /* 正文 HTML 可能不变，v-html 不会重建，Mermaid 已被替换成 Shadow host；用 main 的 :key 强制重挂并重新跑 Mermaid */
  mermaidConfiguredThemeKey = null
  await nextTick()
  await renderMermaidDiagrams()
  await nextTick()
  syncActionBarMetrics()
  syncTocFixedPanel()
}, { flush: 'post' })
</script>

<style scoped>
/* =================================
   基础布局
   ================================= */
.page-container {
  /* 与带 TOC 的 flex 布局一起算宽；大屏再分级放宽，避免只靠放大字号撑满 */
  --content-max: min(1460px, min(96vw, 100vw - 24px));
  --page-pad-x: clamp(16px, 2.5vw, 32px);
  --section-gap: clamp(12px, 2vw, 24px);
  --action-bar-h: 52px;
  /* fixed 顶栏占位：优先 JS 写入的 --action-bar-actual，避免恒等 52px 与真实高度不符 */
  padding-top: calc(var(--action-bar-actual, var(--action-bar-h)) + env(safe-area-inset-top, 0px));
  min-height: 100vh;
  min-height: 100dvh;
  background-color: var(--bg-color);
  /* 减轻 Chrome 滚动锚定与异步内容导致的视口微跳（不影响目录 sticky 计算） */
  overflow-anchor: none;
}

/* ---------- 全宽功能条：fixed；正文区目录桌面端亦为 fixed（见 .doc-toc） ---------- */
.action-bar {
  position: fixed;
  top: env(safe-area-inset-top, 0px);
  left: 0;
  right: 0;
  z-index: 30;
  width: 100%;
  box-sizing: border-box;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--bg-color) 70%, var(--modal-bg)) 0%,
    var(--bg-color) 100%
  );
  border-bottom: 1px solid color-mix(in srgb, var(--border-color) 45%, transparent);
  backdrop-filter: saturate(140%) blur(10px);
  -webkit-backdrop-filter: saturate(140%) blur(10px);
}

@media (min-width: 1920px) {
  .action-bar {
    backdrop-filter: saturate(135%) blur(8px);
    -webkit-backdrop-filter: saturate(135%) blur(8px);
  }
}

@supports not (background: color-mix(in srgb, red, blue)) {
  .action-bar {
    background: var(--bg-color);
    border-bottom-color: var(--border-color);
  }
}

.action-bar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px 20px;
  flex-wrap: wrap;
  max-width: none;
  width: 100%;
  margin: 0;
  padding: 8px clamp(12px, 2vw, 28px);
  min-height: var(--action-bar-h);
  box-sizing: border-box;
}

@media (min-width: 900px) {
  .action-bar__inner {
    padding-left: max(24px, calc((100vw - var(--content-max)) / 2 + var(--page-pad-x)));
    padding-right: max(24px, calc((100vw - var(--content-max)) / 2 + var(--page-pad-x)));
  }
}

.action-bar__cluster {
  display: flex;
  align-items: center;
  gap: 0 12px;
  min-height: 36px;
}

.action-bar__cluster--grow {
  flex: 1 1 0;
  min-width: 0;
}

.action-bar__cluster--end {
  flex: 0 0 auto;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.action-bar__nav {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.action-bar__nav :deep(.back-btn.back-btn--ghost) {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: none;
  background-color: var(--btn-bg);
  transition: color 0.2s ease, background-color 0.2s ease;
}

.action-bar__nav :deep(.back-btn.back-btn--ghost:hover) {
  background-color: rgba(var(--primary-color-rgb), 0.1);
  color: var(--primary-color);
}

html.dark .action-bar__nav :deep(.back-btn.back-btn--ghost:hover) {
  background-color: rgba(var(--primary-color-rgb), 0.2);
}

.action-bar__rule {
  width: 1px;
  height: 22px;
  flex-shrink: 0;
  background: color-mix(in srgb, var(--border-color) 65%, transparent);
  border-radius: 1px;
}

.action-bar__rule--soft {
  height: 18px;
  opacity: 0.85;
}

.action-bar__tags {
  display: flex;
  align-items: center;
  gap: 4px 2px;
  flex: 1 1 0;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-inline: contain;
  padding: 2px 0;
  mask-image: linear-gradient(90deg, #000 96%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, #000 96%, transparent 100%);
  scrollbar-width: none;
}

.action-bar__tags::-webkit-scrollbar {
  display: none;
}

.action-tag {
  flex: 0 0 auto;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: color-mix(in srgb, var(--text-color) 88%, var(--secondary-color));
  background: transparent;
  max-width: min(12rem, 42vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: background 0.15s ease, color 0.15s ease;
}

.action-tag:hover {
  background: color-mix(in srgb, var(--text-color) 6%, transparent);
  color: var(--text-color);
}

.action-kpi {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 10px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--secondary-color);
  white-space: nowrap;
  transition: background 0.15s ease, color 0.15s ease;
}

.action-kpi__ico {
  flex-shrink: 0;
  opacity: 0.88;
  color: var(--secondary-color);
}

.page-pv-num {
  font-variant-numeric: tabular-nums;
  min-width: 2ch;
  display: inline-block;
  color: var(--text-color);
}

/* 不蒜子写入前无文本节点，用伪元素占位，避免真实「--」阻碍脚本更新 */
.page-pv-busuanzi:empty::before {
  content: '--';
  opacity: 0.55;
}

.page-pv-suffix {
  font-weight: 500;
  margin-left: 1px;
  color: var(--text-color);
}

.action-kpi--link {
  text-decoration: none;
  color: var(--text-color);
  cursor: pointer;
  border: none;
  background: color-mix(in srgb, var(--primary-color) 8%, transparent);
}

.action-kpi--link:hover {
  background: color-mix(in srgb, var(--primary-color) 14%, transparent);
  color: var(--primary-color);
}

@supports not (background: color-mix(in srgb, red, blue)) {
  .action-kpi--link {
    background: rgba(96, 165, 250, 0.1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .action-bar__tags {
    scroll-behavior: auto;
  }
}

/* =================================
   内容容器：拓展宽度以容纳侧边 TOC
   ================================= */
.doc-stage {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: var(--content-max);
  margin: 0 auto;
  /* 与顶栏留出一线间距；正文/目录对齐仍靠 --doc-top-pad */
  padding: clamp(8px, 1vw, 14px) var(--page-pad-x) clamp(32px, 5vh, 56px);
  box-sizing: border-box;
}

/* 正文区：无卡片描边，与页面背景一体 */
.doc-layout {
  display: flex;
  gap: clamp(20px, 2.5vw, 36px);
  align-items: flex-start;
}

.doc-layout.doc-layout--with-toc {
  display: grid;
  grid-template-columns: min(248px, 24vw) minmax(0, 1fr);
  gap: clamp(16px, 2.2vw, 32px);
  align-items: stretch;
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  /* 正文顶内边距与目录 .toc-header 顶内边距同源 */
  --doc-top-pad: clamp(10px, 1.35vw, 18px);
  --doc-bottom-pad: clamp(36px, 4.5vw, 56px);
  --doc-main-pad-x: clamp(20px, 3vw, 48px);
  --doc-toc-pad-start: clamp(16px, 2vw, 24px);
  --doc-toc-pad-end: clamp(12px, 1.5vw, 18px);
  --doc-sticky-top: calc(var(--action-bar-actual, var(--action-bar-h)) + env(safe-area-inset-top, 0px) + 8px);
}

/* Markdown 主列：v-html 直接挂在本节点，无额外 wrapper */
.markdown-column.markdown-body {
  flex: 1 1 0;
  min-width: 0;
  /* 横向滚动交给 pre / table 等块级元素，避免与代码块双层横向滚动 */
  overflow-x: visible;
  overflow-y: visible;
  box-sizing: border-box;
}

.doc-layout.doc-layout--with-toc .markdown-column.markdown-body {
  min-width: 0;
  padding: var(--doc-top-pad) var(--doc-main-pad-x) var(--doc-bottom-pad);
  overflow-anchor: none;
}

.doc-layout:not(.doc-layout--with-toc) .markdown-column.markdown-body {
  width: 100%;
  padding: 0 0 clamp(20px, 3vh, 40px);
}

/* 侧栏列仅占宽占位（Grid 第一轨）；桌面端目录 .doc-toc 为 position:fixed，left/width 由 JS 对齐本列 */
.doc-layout.doc-layout--with-toc .doc-layout__aside {
  position: static;
  min-width: 0;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  overflow: visible;
}

/*
 * 桌面：fixed 贴视口，避免 sticky 与整页滚动合成抖动；超长目录由内部 .toc-scroll 滚动。
 * left/width：--toc-fixed-*（syncTocFixedPanel）；top：与顶栏留白一致。
 */
.doc-layout.doc-layout--with-toc .doc-toc {
  position: fixed;
  z-index: 11;
  top: var(--doc-sticky-top);
  left: var(--toc-fixed-left, 0px);
  width: var(--toc-fixed-width, min(248px, 24vw));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 0 var(--doc-toc-pad-end) clamp(20px, 3vh, 36px) var(--doc-toc-pad-start);
  max-height: calc(100dvh - var(--doc-sticky-top) - max(12px, env(safe-area-inset-bottom, 0px)));
  overflow: hidden;
}

.doc-layout.doc-layout--with-toc .toc-scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
}

.toc.toc-hidden {
  opacity: 1;
}

/* 目录顶栏：扁平文案 + 细分隔线，不再套一层「卡片」 */
.doc-layout.doc-layout--with-toc .toc-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: var(--doc-top-pad) 0 12px;
  margin: 0 0 4px;
  cursor: pointer;
  border-radius: 0;
  background: none;
  border: none;
  border-bottom: 1px solid color-mix(in srgb, var(--border-color) 28%, transparent);
  transition: border-color 0.15s ease;
}

.doc-layout.doc-layout--with-toc .toc-header:hover {
  background: none;
  border-bottom-color: color-mix(in srgb, var(--border-color) 72%, transparent);
}

@supports not (color: color-mix(in srgb, red, blue)) {
  .doc-layout.doc-layout--with-toc .toc-header {
    border-bottom-color: var(--border-color);
  }
}

.doc-layout.doc-layout--with-toc .toc-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: none;
  color: var(--secondary-color);
}

.doc-layout.doc-layout--with-toc .toc-title strong {
  font-weight: 600;
  color: inherit;
}

.doc-layout.doc-layout--with-toc .toc-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  opacity: 0.72;
  color: inherit;
}

/* 折叠：图标级幽灵按钮，弱化「又一个方块组件」 */
.doc-layout.doc-layout--with-toc .toc-toggle {
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  color: var(--secondary-color);
  opacity: 0.85;
  transition: background 0.15s ease, color 0.15s ease, opacity 0.15s ease;
}

.doc-layout.doc-layout--with-toc .toc-toggle:hover {
  opacity: 1;
  color: var(--text-color);
  background: color-mix(in srgb, var(--text-color) 6%, transparent);
}

@supports not (background: color-mix(in srgb, red, blue)) {
  .doc-layout.doc-layout--with-toc .toc-toggle:hover {
    background: rgba(0, 0, 0, 0.06);
  }

  html.dark .doc-layout.doc-layout--with-toc .toc-toggle:hover {
    background: rgba(255, 255, 255, 0.07);
  }
}

.chev {
  display: inline-block;
  transform: rotate(-90deg);
  transition: transform .28s cubic-bezier(.2, .9, .2, 1);
}

.chev.open {
  transform: rotate(0deg);
}

/* TOC 列表：与正文同一阅读平面；纵向滚动由父级 .toc-scroll 承担 */
.doc-layout.doc-layout--with-toc .toc-list {
  font-size: 0.875rem;
  padding-top: 10px;
}

.doc-layout.doc-layout--with-toc .toc-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.doc-layout.doc-layout--with-toc .toc-list li {
  margin: 1px 0;
  line-height: 1.45;
}

.doc-layout.doc-layout--with-toc .toc-list li.level-2 {
  padding-left: 0;
}

.doc-layout.doc-layout--with-toc .toc-list li.level-3 {
  padding-left: 14px;
  font-size: 0.875rem;
}

.doc-layout.doc-layout--with-toc .toc-list li.level-4 {
  padding-left: 24px;
  font-size: 0.8125rem;
}

.doc-layout.doc-layout--with-toc .toc-list li.level-3 a,
.doc-layout.doc-layout--with-toc .toc-list li.level-4 a {
  color: color-mix(in srgb, var(--text-color) 72%, var(--secondary-color));
}

@supports not (color: color-mix(in srgb, red, blue)) {
  .doc-layout.doc-layout--with-toc .toc-list li.level-3 a,
  .doc-layout.doc-layout--with-toc .toc-list li.level-4 a {
    color: var(--secondary-color);
  }
}

.doc-layout.doc-layout--with-toc .toc-list a {
  display: block;
  padding: 5px 8px;
  margin: 0 -6px;
  border-radius: 6px;
  color: var(--text-color);
  text-decoration: none;
  transition: background 0.14s ease, color 0.14s ease;
}

.doc-layout.doc-layout--with-toc .toc-list a:hover {
  color: var(--primary-color);
  background: color-mix(in srgb, var(--text-color) 5.5%, transparent);
}

@supports not (background: color-mix(in srgb, red, blue)) {
  .doc-layout.doc-layout--with-toc .toc-list a:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  html.dark .doc-layout.doc-layout--with-toc .toc-list a:hover {
    background: rgba(255, 255, 255, 0.065);
  }
}

/* =================================
   Markdown 深度定制
   ================================= */
.markdown-body {
  background: transparent !important;
  font-family: var(--font-sans);
  color: var(--text-color) !important;
  scroll-behavior: smooth;
}

/* 目录/锚点跳转：避免标题被 sticky 顶栏遮挡 */
:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3),
:deep(.markdown-body h4),
:deep(.markdown-body h5),
:deep(.markdown-body h6) {
  scroll-margin-top: calc(var(--action-bar-actual, var(--action-bar-h)) + env(safe-area-inset-top, 0px) + 12px);
}

/* 正文自带主标题时，收紧首段顶距，让首屏尽量落在文档内容 */
:deep(.markdown-body > h1:first-child) {
  margin-top: 0.25em;
}

/* 带侧栏时首条 h1 与「目录」同行对齐，不再额外下移 */
.doc-layout.doc-layout--with-toc :deep(.markdown-body > h1:first-child) {
  margin-top: 0;
}

/* 图片（方角，与截图/文档类素材更一致） */
:deep(.markdown-body img) {
  border-radius: 0;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  margin: 20px 0;
  max-width: 100%;
  height: auto;
  display: block;
  border: none;
}

/* 带侧栏长文：压一层阴影，减少「嵌套卡片」感（须在本块之后以覆盖上一段） */
.doc-layout.doc-layout--with-toc :deep(.markdown-body img) {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.055);
}

html.dark .doc-layout.doc-layout--with-toc :deep(.markdown-body img) {
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
}

/* 代码块：Typora 式仅靠底色分区，无描边（避免与正文「卡片框」抢视觉） */
:deep(.markdown-body pre) {
  margin: 1.15rem 0;
  padding: 14px 18px !important;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  border: none !important;
  border-radius: 4px !important;
  box-sizing: border-box;
  font-size: 0.875rem;
  line-height: 1.55;
  box-shadow: none;
}

:deep(.markdown-body pre code) {
  font-family: var(--font-mono);
  font-size: inherit;
  line-height: inherit;
  color: inherit;
  tab-size: 2;
  -moz-tab-size: 2;
}

:deep(.markdown-body pre code.hljs) {
  display: block;
  overflow-x: auto;
  background: transparent !important;
  border-radius: inherit !important;
}

html:not(.dark) :deep(.markdown-body pre) {
  color: #1f2328 !important;
  background-color: #f6f8fa !important;
}

html.dark :deep(.markdown-body pre) {
  color: #e6edf3 !important;
  background-color: #161b22 !important;
}

/* Mermaid：与围栏代码同一底色语言，无框线 */
:deep(.markdown-body .mermaid-github-host) {
  margin: 1.5rem 0;
  padding: 0;
  overflow-x: auto;
  overflow-y: visible;
  border: none !important;
  border-radius: 4px !important;
  box-sizing: border-box;
  box-shadow: none;
}

html:not(.dark) :deep(.markdown-body .mermaid-github-host) {
  background-color: #f6f8fa !important;
}

html.dark :deep(.markdown-body .mermaid-github-host) {
  background-color: #161b22 !important;
}

:deep(.markdown-body .mermaid-error) {
  margin: 1.25rem 0;
  padding: 14px 18px;
  border-radius: 0 !important;
  background: rgba(220, 53, 69, 0.12);
  color: var(--text-color);
  font-size: 0.9rem;
  overflow: auto;
}

/* 行内代码：Typora 式弱对比（灰底 + 接近正文色，不用主色链蓝） */
:deep(.markdown-body :not(pre) > code),
:deep(.markdown-body td > code),
:deep(.markdown-body th > code) {
  padding: 0.12em 0.38em;
  font-size: 0.9em;
  border-radius: 4px;
  border: none;
  font-family: var(--font-mono);
}

html:not(.dark) :deep(.markdown-body :not(pre) > code),
html:not(.dark) :deep(.markdown-body td > code),
html:not(.dark) :deep(.markdown-body th > code) {
  color: #24292f;
  background-color: #eaecef;
}

html.dark :deep(.markdown-body :not(pre) > code),
html.dark :deep(.markdown-body td > code),
html.dark :deep(.markdown-body th > code) {
  color: #c9d1d9;
  background-color: color-mix(in srgb, var(--btn-bg) 92%, var(--text-color));
}

@supports not (color: color-mix(in srgb, red, blue)) {
  html.dark :deep(.markdown-body :not(pre) > code),
  html.dark :deep(.markdown-body td > code),
  html.dark :deep(.markdown-body th > code) {
    color: #c9d1d9;
    background-color: #2d333b;
  }
}

/* 正文链接：更易扫读、键盘焦点可见 */
:deep(.markdown-body a) {
  color: var(--primary-color);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;
  text-decoration-skip-ink: auto;
}

:deep(.markdown-body a:hover) {
  text-decoration-thickness: 2px;
}

:deep(.markdown-body a:focus-visible) {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
  border-radius: 2px;
}

/* 图片外链：避免在图片下出现多余下划线 */
:deep(.markdown-body a:has(> img)) {
  text-decoration: none;
}

:deep(.markdown-body a:has(> img):focus-visible) {
  outline-offset: 4px;
}

/* 引用块（实习文等大量使用 > 时，层次更清晰） */
:deep(.markdown-body blockquote) {
  margin: 1.2em 0;
  padding: 0.35em 0 0.35em 1em;
  border-left: 3px solid color-mix(in srgb, var(--primary-color) 70%, var(--border-color));
  color: var(--secondary-color);
}

:deep(.markdown-body blockquote > :first-child) {
  margin-top: 0;
}

:deep(.markdown-body blockquote > :last-child) {
  margin-bottom: 0;
}

/* 分隔线：弱化视觉噪音，保留结构 */
:deep(.markdown-body hr) {
  height: 0;
  margin: 1.75em 0;
  border: 0;
  border-top: 1px solid color-mix(in srgb, var(--border-color) 75%, transparent);
  background: none;
}

/* 列表：段内多级列表更易读 */
:deep(.markdown-body ul),
:deep(.markdown-body ol) {
  margin: 0.65em 0;
  padding-left: 1.35em;
}

:deep(.markdown-body li) {
  margin: 0.35em 0;
  line-height: 1.75;
}

:deep(.markdown-body li > p) {
  margin-top: 0.4em;
  margin-bottom: 0.4em;
}

/* 二级标题：与 Vue / Vite 文档类似的清爽层级，无左侧装饰条 */
:deep(.markdown-body h2) {
  border-bottom: 1px solid color-mix(in srgb, var(--border-color) 55%, transparent);
  font-size: 1.45rem;
  font-weight: 600;
  margin-top: 2.25rem;
  margin-bottom: 0.85rem;
  padding-bottom: 0.4rem;
  color: var(--text-color);
}

/* 段落与文字（Typora 类节奏：略收紧段距，仍保持 1.8 行高可读） */
:deep(.markdown-body p) {
  color: var(--secondary-color);
  line-height: 1.8;
  font-size: 1.05rem;
  margin-top: 0.65em;
  margin-bottom: 0.65em;
}

/* 修复表格样式（核心）- 完全对齐 GitHub 风格 */
:deep(.markdown-body table) {
  border-spacing: 0 !important;
  border-collapse: collapse !important;
  width: 100% !important;
  margin: 20px 0 !important;
  display: block !important;
  overflow-x: auto !important;
}

/* 亮色/暗色主题表格适配 */
:deep(.markdown-body th) {
  font-weight: 600 !important;
  background-color: var(--btn-bg) !important;
  color: var(--text-color) !important;
}

:deep(.markdown-body td, .markdown-body th) {
  padding: 6px 13px !important;
}

:deep(.markdown-body tr) {
  background-color: var(--modal-bg) !important;
  border-top: 1px solid var(--border-color) !important;
}

:deep(.markdown-body tr:nth-child(2n)) {
  background-color: var(--btn-bg) !important;
}

/* 小屏设备：TOC 在上、正文在下，仍保持「同一面板」视觉 */
@media (max-width: 768px) {
  /* 小屏取消整页 min-height:100dvh，避免短文时下半屏大块留白 */
  .page-container {
    --action-bar-h: 48px;
    min-height: auto;
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }

  .doc-stage {
    padding-bottom: max(clamp(32px, 5vh, 56px), env(safe-area-inset-bottom, 0px));
  }

  .action-bar__inner {
    padding: 6px var(--page-pad-x);
    gap: 10px 12px;
  }

  .action-bar__cluster--end {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .doc-layout {
    flex-direction: column;
    gap: 12px;
  }

  .doc-layout.doc-layout--with-toc {
    display: flex;
    flex-direction: column;
    gap: clamp(12px, 2vw, 20px);
    border-radius: 0;
    align-items: stretch;
    --doc-top-pad: clamp(8px, 2vw, 14px);
    --doc-bottom-pad: 28px;
    --doc-main-pad-x: 20px;
    --doc-toc-pad-start: 18px;
    --doc-toc-pad-end: 18px;
  }

  .doc-layout.doc-layout--with-toc .doc-layout__aside {
    width: 100%;
    max-width: none;
    border-right: none;
    border-bottom: 1px solid color-mix(in srgb, var(--border-color) 35%, transparent);
    box-shadow: none;
  }

  .doc-layout.doc-layout--with-toc .doc-toc {
    position: relative;
    left: auto;
    width: auto;
    top: auto;
    z-index: auto;
    max-height: none;
    overflow: visible;
    display: block;
    padding: 0 var(--doc-toc-pad-end) 14px var(--doc-toc-pad-start);
  }

  .doc-layout.doc-layout--with-toc .toc-scroll {
    flex: none;
    min-height: 0;
    overflow: visible;
    scrollbar-gutter: auto;
  }

  .doc-layout.doc-layout--with-toc .markdown-column.markdown-body {
    /* 纵向 flex 下勿 flex-grow，避免主列被撑出大块空白 */
    flex: 0 1 auto;
    min-width: 0;
    width: 100%;
    padding: var(--doc-top-pad) var(--doc-main-pad-x) var(--doc-bottom-pad);
  }

  .toc {
    width: 100%;
    height: auto;
    position: relative;
    top: auto;
  }

  .toc.toc-hidden .toc-list {
    display: none;
  }

  .doc-layout:not(.doc-layout--with-toc) .markdown-column.markdown-body {
    padding-bottom: 28px;
  }
}

/* 窄屏手机：略减水平留白与标题字号，正文可视面积更大（不影响 ≥769px） */
@media (max-width: 480px) {
  .doc-stage {
    padding-left: max(12px, env(safe-area-inset-left, 0px));
    padding-right: max(12px, env(safe-area-inset-right, 0px));
  }

  .doc-layout.doc-layout--with-toc {
    --doc-top-pad: clamp(8px, 2vw, 12px);
    --doc-bottom-pad: 24px;
    --doc-main-pad-x: 14px;
    --doc-toc-pad-start: 14px;
    --doc-toc-pad-end: 14px;
  }

  .page-container :deep(.markdown-body h2) {
    font-size: 1.3rem;
    margin-top: 1.35em;
  }

  .page-container :deep(.markdown-body p) {
    font-size: 1rem;
  }
}

/* 大屏：加宽容器与留白；正文字号保持与常规桌面一致，避免 27″ 上因字号变大而比笔记本更早换行 */
@media (min-width: 1600px) {
  .page-container {
    --content-max: min(1580px, min(93vw, 100vw - 40px));
  }

  .doc-layout.doc-layout--with-toc {
    grid-template-columns: min(300px, min(18vw, 320px)) minmax(0, 1fr);
    --doc-top-pad: clamp(14px, 1.6vw, 22px);
    --doc-bottom-pad: clamp(48px, 4vw, 80px);
    --doc-main-pad-x: clamp(36px, 3vw, 72px);
    --doc-toc-pad-start: clamp(22px, 2.4vw, 30px);
    --doc-toc-pad-end: clamp(14px, 1.8vw, 22px);
    gap: clamp(0px, 2.5vw, 36px);
  }

  .doc-layout {
    gap: 30px;
  }

  .doc-layout:not(.doc-layout--with-toc) .markdown-column.markdown-body {
    padding-top: clamp(4px, 1vw, 12px);
    padding-bottom: clamp(28px, 3.5vw, 52px);
  }

  :deep(.markdown-body img) {
    border-radius: 0;
    margin: 25px 0;
  }
}

/* 27″ / 2K 等：再放宽总宽，目录列用 vw 上限避免占掉过多正文 */
@media (min-width: 1920px) {
  .page-container {
    --content-max: min(1720px, min(90vw, 100vw - 48px));
    --page-pad-x: clamp(20px, 2.2vw, 40px);
  }

  .doc-layout.doc-layout--with-toc {
    grid-template-columns: min(300px, min(16vw, 320px)) minmax(0, 1fr);
  }
}

/* Loading & Error：与页面融合，弱化「卡片」 */
.loading-state,
.error-state {
  text-align: center;
  padding: clamp(48px, 12vh, 100px) var(--page-pad-x);
  background: transparent;
  border: none;
  border-radius: 0;
  color: var(--secondary-color);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
