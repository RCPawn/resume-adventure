<template>
  <div class="page-container">
    <!-- 全宽功能条：返回、技术栈、统计与外链同一视觉轨道，避免「多个小组件」堆叠感 -->
    <header class="action-bar">
      <div class="action-bar__inner">
        <div class="action-bar__cluster action-bar__cluster--grow">
          <div class="action-bar__nav">
            <GoBackButton variant="ghost" inline />
          </div>
          <template v-if="currentProject">
            <span class="action-bar__rule" aria-hidden="true" />
            <div class="action-bar__tags" aria-label="技术栈">
              <span
                v-for="tag in (currentProject.tags || [])"
                :key="tag"
                class="action-tag"
                :title="tag"
              >{{ tag }}</span>
            </div>
          </template>
        </div>
        <div v-if="currentProject" class="action-bar__cluster action-bar__cluster--end">
          <span class="action-kpi" title="文档日期">
            <svg class="action-kpi__ico" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
            </svg>
            {{ currentProject.date || '—' }}
          </span>
          <span class="action-bar__rule action-bar__rule--soft" aria-hidden="true" />
          <span class="action-kpi" title="本页阅读量（不蒜子）">
            <svg class="action-kpi__ico" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            <span id="busuanzi_page_pv" v-once class="page-pv-num">--</span><span class="page-pv-suffix">次</span>
          </span>
          <a
            v-if="currentProject.repoLink"
            :href="currentProject.repoLink"
            target="_blank"
            class="action-kpi action-kpi--link"
            rel="noreferrer"
            title="在浏览器中打开源码仓库"
          >
            <svg class="action-kpi__ico" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
            </svg>
            源码
          </a>
        </div>
      </div>
    </header>

    <div class="doc-stage">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        加载精彩内容中...
      </div>
      <div v-else-if="error" class="error-state">😕 {{ error }}</div>
      <div v-else class="content-flex" :class="{ 'doc-layout--with-toc': toc.length > 0 }">
        <aside v-if="toc.length" class="toc" :class="{ 'toc-hidden': isTocHidden }">
          <!-- 仅用于与正文上内边距对齐；滚走后可避免整块 aside 吸顶时顶部大块留白 -->
          <div class="toc-top-spacer" aria-hidden="true" />
          <div class="toc-sticky">
            <div class="toc-header" @click="toggleToc" role="button" tabindex="0" @keydown.enter="toggleToc">
              <div class="toc-title">
                <svg class="toc-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path fill="currentColor" d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z"></path>
                </svg>
                <strong>目录</strong>
              </div>
              <button type="button" class="toc-toggle" aria-label="切换目录">
                <span class="chev" :class="{ open: !isTocHidden }">
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
                  </svg>
                </span>
              </button>
            </div>
            <nav class="toc-list" v-if="!isTocHidden">
              <ul>
                <li v-for="item in toc" :key="item.slug" :class="`level-${item.level}`">
                  <a :href="`#${item.slug}`" @click.prevent="scrollToId(item.slug)">{{ item.title }}</a>
                </li>
              </ul>
            </nav>
          </div>
        </aside>
        <main class="markdown-column markdown-body" v-html="htmlContent" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'
import mermaid from 'mermaid'
import projectsData from '@/data/projects.json'
import GoBackButton from '@/components/GoBackButton.vue'
import 'github-markdown-css/github-markdown.css'

const route = useRoute()

const md = new MarkdownIt({ html: true, linkify: true, typographer: true })
const defaultHeadingOpen = md.renderer.rules.heading_open || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}
const defaultImageRender = md.renderer.rules.image || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}

const slugify = (str) => {
  if (!str) return ''
  return String(str).trim().toLowerCase()
      .replace(/[\s+~\/]+/g, '-')
      .replace(/[^\w\-一-龥\u4E00-\u9FFF]+/g, '')
      .replace(/-+/g, '-').replace(/(^-|-$)/g, '')
}

md.renderer.rules.heading_open = function (tokens, idx, options, env, self) {
  const next = tokens[idx + 1]
  let title = ''
  if (next && next.type === 'inline') title = next.content
  const id = slugify(title || `heading-${idx}`)
  const existing = tokens[idx].attrIndex && tokens[idx].attrIndex('id')
  if (existing === -1) tokens[idx].attrPush(['id', id])
  else tokens[idx].attrs[existing][1] = id
  return defaultHeadingOpen(tokens, idx, options, env, self)
}

md.renderer.rules.image = function (tokens, idx, options, env, self) {
  const token = tokens[idx]
  const srcIndex = token.attrIndex('src')
  if (srcIndex >= 0) {
    let src = token.attrs[srcIndex][1] || ''
    if (!src.startsWith('http') && !src.startsWith('/') && !src.startsWith('data:'))
      token.attrs[srcIndex][1] = `/projects/${src}`
  }
  token.attrPush(['loading', 'lazy'])
  token.attrJoin('class', 'md-img')
  return defaultImageRender(tokens, idx, options, env, self)
}

const loading = ref(true)
const error = ref('')
const htmlContent = ref('')
const toc = ref([])
const isTocHidden = ref(false)
const currentProject = computed(() => projectsData.find(p => p.id === route.params.id))

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
      border-radius: 6px;
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

/** 将 markdown-it 输出的 ```mermaid 代码块替换为 SVG（需在 htmlContent 注入 DOM 后调用） */
const renderMermaidDiagrams = async () => {
  await nextTick()
  const root = document.querySelector('.markdown-body')
  if (!root) return
  const codes = root.querySelectorAll('pre code.language-mermaid')
  if (!codes.length) return

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  /** 贴近 Mermaid 默认与 GitHub 所用管线：少覆盖 themeVariables，减少与 htmlLabels 的布局打架 */
  mermaid.initialize({
    startOnLoad: false,
    theme: isDark ? 'dark' : 'default',
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

  let i = 0
  for (const code of codes) {
    const pre = code.parentElement
    if (!pre || !pre.parentElement) continue
    const graph = (code.textContent || '').trim()
    if (!graph) continue
    const id = `mmd-${i++}-${Math.random().toString(36).slice(2, 9)}`
    try {
      const { svg } = await mermaid.render(id, graph)
      const host = mountMermaidInShadowRoot(svg, isDark)
      pre.replaceWith(host)
    } catch (err) {
      console.warn('[mermaid]', err)
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
  try {
    if (!currentProject.value) throw new Error('未找到项目')
    const fileName = currentProject.value.mdFile
    if (!fileName) throw new Error('暂无内容')
    const response = await fetch(`/projects/${fileName}`)
    if (!response.ok) throw new Error('加载失败')
    const text = await response.text()
    const tokens = md.parse(text, {})
    const list = []
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i]
      if (t.type === 'heading_open') {
        const level = parseInt(t.tag.replace('h', ''), 10)
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
  } finally {
    loading.value = false
  }
}

// 不蒜子：项目详情页无 Footer，须自行保证脚本与 #busuanzi_page_pv 生命周期对齐（SPA 须在 DOM 就绪后多次触发 fetch）
const BUSUANZI_SCRIPT_ID = 'busuanzi-script'
const BUSUANZI_SCRIPT_URL = 'https://cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js'
const BUSUANZI_FETCH_URL = '//busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback'

const loadBusuanziScript = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      resolve(false)
      return
    }

    const existing = document.getElementById(BUSUANZI_SCRIPT_ID)
    if (existing) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.id = BUSUANZI_SCRIPT_ID
    script.src = BUSUANZI_SCRIPT_URL
    script.async = true

    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)

    document.body.appendChild(script)
  })
}

const invokeBusuanziFetch = () => {
  try {
    if (window.bszCaller && typeof window.bszCaller.fetch === 'function') {
      window.bszCaller.fetch(BUSUANZI_FETCH_URL, () => {})
    }
  } catch {
    // 忽略
  }
}

/** 与 Footer 类似：等 DOM 稳定后拉取；并在一段时间后补拉，避免首屏 markdown 异步导致漏更 */
const refreshBusuanziPagePv = async () => {
  await nextTick()
  const run = () => invokeBusuanziFetch()
  window.setTimeout(run, 180)
  window.setTimeout(run, 900)
  window.setTimeout(run, 1800)
}

onMounted(async () => {
  if (typeof window !== 'undefined' && window.innerWidth <= 768) isTocHidden.value = true

  const scriptPromise = loadBusuanziScript().catch(() => false)
  const mdPromise = fetchMarkdown()

  await scriptPromise
  await nextTick()
  refreshBusuanziPagePv()

  await mdPromise
  await nextTick()
  refreshBusuanziPagePv()
})

watch(
    () => route.params.id,
    async () => {
      await fetchMarkdown()
      await nextTick()
      refreshBusuanziPagePv()
    }
)

watch(loading, (done) => {
  if (!done) return
  nextTick(() => refreshBusuanziPagePv())
})

watch(htmlContent, async () => {
  await renderMermaidDiagrams()
})
</script>

<style scoped>
/* =================================
   基础布局
   ================================= */
.page-container {
  --content-max: min(1420px, min(96vw, 100vw - 24px));
  --page-pad-x: clamp(16px, 2.5vw, 32px);
  --section-gap: clamp(12px, 2vw, 24px);
  --action-bar-h: 52px;
  min-height: 100vh;
  min-height: 100dvh;
  background-color: var(--bg-color);
}

/* ---------- 全宽功能条：单轨、弱分隔、无「小药丸边框」堆叠 ---------- */
.action-bar {
  position: sticky;
  top: 0;
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
  flex-shrink: 0;
}

.action-bar__nav :deep(.back-btn.back-btn--ghost) {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border-color: transparent;
  background: color-mix(in srgb, var(--text-color) 4%, transparent);
}

.action-bar__nav :deep(.back-btn.back-btn--ghost:hover) {
  background: color-mix(in srgb, var(--text-color) 8%, transparent);
  border-color: color-mix(in srgb, var(--border-color) 50%, transparent);
  color: var(--primary-color);
}

@supports not (background: color-mix(in srgb, red, blue)) {
  .action-bar__nav :deep(.back-btn.back-btn--ghost) {
    background: rgba(0, 0, 0, 0.04);
  }

  .action-bar__nav :deep(.back-btn.back-btn--ghost:hover) {
    background: rgba(0, 0, 0, 0.07);
  }

  html.dark .action-bar__nav :deep(.back-btn.back-btn--ghost) {
    background: rgba(255, 255, 255, 0.06);
  }

  html.dark .action-bar__nav :deep(.back-btn.back-btn--ghost:hover) {
    background: rgba(255, 255, 255, 0.1);
  }
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
  padding: clamp(12px, 2vw, 24px) var(--page-pad-x) clamp(32px, 5vh, 56px);
  box-sizing: border-box;
}

/* 正文区：无卡片描边，与页面背景一体 */
.content-flex {
  display: flex;
  gap: clamp(20px, 2.5vw, 36px);
  align-items: flex-start;
}

.content-flex.doc-layout--with-toc {
  gap: clamp(16px, 2.2vw, 32px);
  align-items: stretch;
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  --doc-top-pad: clamp(28px, 3.5vw, 48px);
  --doc-bottom-pad: clamp(36px, 4.5vw, 56px);
  --doc-main-pad-x: clamp(20px, 3vw, 48px);
  --doc-toc-pad-start: clamp(16px, 2vw, 24px);
  --doc-toc-pad-end: clamp(12px, 1.5vw, 18px);
  --doc-sticky-top: calc(var(--action-bar-h, 52px) + 10px);
  overflow-x: clip;
  overflow-y: visible;
}

/* Markdown 主列：v-html 直接挂在本节点，无额外 wrapper */
.markdown-column.markdown-body {
  flex: 1 1 0;
  min-width: 0;
  overflow-x: auto;
  overflow-y: visible;
  box-sizing: border-box;
}

.content-flex.doc-layout--with-toc .markdown-column.markdown-body {
  flex: 1 1 min(0, 100%);
  padding: var(--doc-top-pad) var(--doc-main-pad-x) var(--doc-bottom-pad);
}

.content-flex:not(.doc-layout--with-toc) .markdown-column.markdown-body {
  width: 100%;
  padding: 0 0 clamp(20px, 3vh, 40px);
}

/* TOC 侧边栏：与正文同属一块面板 */
.toc {
  width: 248px;
  flex: 0 0 248px;
  position: sticky;
  align-self: flex-start;
  top: 88px;
  max-height: min(calc(100vh - 100px), calc(100dvh - 100px));
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
  background: transparent;
  border-radius: 12px;
  padding: 12px;
  box-sizing: border-box;
  transition: opacity .2s ease;
}

.content-flex.doc-layout--with-toc .toc {
  position: static;
  top: auto;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  max-height: none;
  height: auto;
  overflow: visible;
  overflow-x: visible;
  overscroll-behavior: auto;
  scrollbar-gutter: auto;
  width: min(248px, 24vw);
  flex: 0 0 min(248px, 24vw);
  padding: 0;
  border-radius: 0;
  background: transparent;
  border-right: none;
  box-shadow: none;
}

.content-flex.doc-layout--with-toc .toc-top-spacer {
  flex-shrink: 0;
  height: var(--doc-top-pad);
  pointer-events: none;
}

.content-flex.doc-layout--with-toc .toc-sticky {
  position: sticky;
  top: var(--doc-sticky-top);
  flex-shrink: 0;
  /* 底留白略小于正文区，避免目录较短时在链接下方出现大块「空垫」 */
  padding: 10px var(--doc-toc-pad-end) clamp(20px, 3vh, 36px) var(--doc-toc-pad-start);
  box-sizing: border-box;
}

.toc.toc-hidden {
  opacity: 1;
}

/* 目录顶栏：扁平文案 + 细分隔线，不再套一层「卡片」 */
.content-flex.doc-layout--with-toc .toc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 0 12px;
  margin: 0 0 4px;
  cursor: pointer;
  border-radius: 0;
  background: none;
  border: none;
  border-bottom: 1px solid color-mix(in srgb, var(--border-color) 28%, transparent);
  transition: border-color 0.15s ease;
}

.content-flex.doc-layout--with-toc .toc-header:hover {
  background: none;
  border-bottom-color: color-mix(in srgb, var(--border-color) 72%, transparent);
}

@supports not (color: color-mix(in srgb, red, blue)) {
  .content-flex.doc-layout--with-toc .toc-header {
    border-bottom-color: var(--border-color);
  }
}

.content-flex.doc-layout--with-toc .toc-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: none;
  color: var(--secondary-color);
}

.content-flex.doc-layout--with-toc .toc-title strong {
  font-weight: 600;
  color: inherit;
}

.content-flex.doc-layout--with-toc .toc-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  opacity: 0.72;
  color: inherit;
}

/* 折叠：图标级幽灵按钮，弱化「又一个方块组件」 */
.content-flex.doc-layout--with-toc .toc-toggle {
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

.content-flex.doc-layout--with-toc .toc-toggle:hover {
  opacity: 1;
  color: var(--text-color);
  background: color-mix(in srgb, var(--text-color) 6%, transparent);
}

@supports not (background: color-mix(in srgb, red, blue)) {
  .content-flex.doc-layout--with-toc .toc-toggle:hover {
    background: rgba(0, 0, 0, 0.06);
  }

  html.dark .content-flex.doc-layout--with-toc .toc-toggle:hover {
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

/* TOC 列表：与正文同一阅读平面，交互保持轻量 */
.content-flex.doc-layout--with-toc .toc-list {
  font-size: 0.875rem;
  padding-top: 10px;
}

.content-flex.doc-layout--with-toc .toc-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.content-flex.doc-layout--with-toc .toc-list li {
  margin: 1px 0;
  line-height: 1.45;
}

.content-flex.doc-layout--with-toc .toc-list li.level-2 {
  padding-left: 0;
}

.content-flex.doc-layout--with-toc .toc-list li.level-3 {
  padding-left: 14px;
  font-size: 0.875rem;
}

.content-flex.doc-layout--with-toc .toc-list li.level-4 {
  padding-left: 24px;
  font-size: 0.8125rem;
}

.content-flex.doc-layout--with-toc .toc-list li.level-3 a,
.content-flex.doc-layout--with-toc .toc-list li.level-4 a {
  color: color-mix(in srgb, var(--text-color) 72%, var(--secondary-color));
}

@supports not (color: color-mix(in srgb, red, blue)) {
  .content-flex.doc-layout--with-toc .toc-list li.level-3 a,
  .content-flex.doc-layout--with-toc .toc-list li.level-4 a {
    color: var(--secondary-color);
  }
}

.content-flex.doc-layout--with-toc .toc-list a {
  display: block;
  padding: 5px 8px;
  margin: 0 -6px;
  border-radius: 6px;
  color: var(--text-color);
  text-decoration: none;
  transition: background 0.14s ease, color 0.14s ease;
}

.content-flex.doc-layout--with-toc .toc-list a:hover {
  color: var(--primary-color);
  background: color-mix(in srgb, var(--text-color) 5.5%, transparent);
}

@supports not (background: color-mix(in srgb, red, blue)) {
  .content-flex.doc-layout--with-toc .toc-list a:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  html.dark .content-flex.doc-layout--with-toc .toc-list a:hover {
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

/* 正文自带主标题时，收紧首段顶距，让首屏尽量落在文档内容 */
:deep(.markdown-body > h1:first-child) {
  margin-top: 0.25em;
}

/* 图片 */
:deep(.markdown-body img) {
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  margin: 20px 0;
  max-width: 100%;
  border: none;
}

/* 带侧栏长文：压一层阴影，减少「嵌套卡片」感（须在本块之后以覆盖上一段） */
.content-flex.doc-layout--with-toc :deep(.markdown-body img) {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.055);
}

html.dark .content-flex.doc-layout--with-toc :deep(.markdown-body img) {
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
}

/* 代码块 */
:deep(.markdown-body pre) {
  background-color: #1e1e1e !important;
  border-radius: 12px;
  padding: 16px;
  overflow: auto;
}

/* Mermaid：外层卡片（图在 Shadow DOM 内，避免主页样式渗入 foreignObject —— 对齐 GitHub iframe 隔离思路） */
:deep(.markdown-body .mermaid-github-host) {
  margin: 1.5rem 0;
  padding: 0;
  overflow-x: auto;
  overflow-y: visible;
  border: 1px solid color-mix(in srgb, var(--border-color) 88%, transparent);
  border-radius: 8px;
  background: transparent;
}

html.dark :deep(.markdown-body .mermaid-github-host) {
  border-color: #30363d;
}

html:not(.dark) :deep(.markdown-body .mermaid-github-host) {
  border-color: #d0d7de;
}

:deep(.markdown-body .mermaid-error) {
  margin: 1.25rem 0;
  padding: 14px 16px;
  border-radius: 12px;
  background: rgba(220, 53, 69, 0.12);
  color: var(--text-color);
  font-size: 0.9rem;
  overflow: auto;
}

/* 行内代码 */
:deep(.markdown-body code) {
  background-color: var(--btn-bg);
  border-radius: 6px;
  color: var(--primary-color);
  padding: 0 6px;
}

/* 标题样式 */
:deep(.markdown-body h2) {
  border-bottom: none;
  font-size: 1.8rem;
  margin-top: 2em;
  margin-bottom: 1em;
  color: var(--text-color);
  position: relative;
  padding-left: 16px;
}

:deep(.markdown-body h2::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: 4px;
  background: var(--primary-color);
  border-radius: 2px;
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
  .page-container {
    --action-bar-h: 48px;
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

  .content-flex {
    flex-direction: column;
    gap: 12px;
  }

  .content-flex.doc-layout--with-toc {
    gap: clamp(12px, 2vw, 20px);
    border-radius: 0;
    --doc-top-pad: 18px;
    --doc-bottom-pad: 28px;
    --doc-main-pad-x: 20px;
    --doc-toc-pad-start: 18px;
    --doc-toc-pad-end: 18px;
  }

  .content-flex.doc-layout--with-toc .toc {
    width: 100%;
    flex: 0 0 auto;
    max-height: none;
    position: relative;
    top: auto;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    overflow: visible;
    border-right: none;
    border-bottom: 1px solid color-mix(in srgb, var(--border-color) 35%, transparent);
    box-shadow: none;
    padding: 0;
  }

  .content-flex.doc-layout--with-toc .toc-sticky {
    position: relative;
    top: auto;
    padding: 0 var(--doc-toc-pad-end) 14px var(--doc-toc-pad-start);
  }

  .content-flex.doc-layout--with-toc .markdown-column.markdown-body {
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

  .content-flex:not(.doc-layout--with-toc) .markdown-column.markdown-body {
    padding-bottom: 28px;
  }
}

/* 大屏：略放宽内容区 + 目录列，阅读与表格更舒展 */
@media (min-width: 1600px) {
  .page-container {
    --content-max: min(1520px, min(94vw, 100vw - 40px));
  }

  .content-flex.doc-layout--with-toc {
    --doc-top-pad: clamp(40px, 3.5vw, 64px);
    --doc-bottom-pad: clamp(48px, 4vw, 80px);
    --doc-main-pad-x: clamp(36px, 3vw, 72px);
    --doc-toc-pad-start: clamp(22px, 2.4vw, 30px);
    --doc-toc-pad-end: clamp(14px, 1.8vw, 22px);
    gap: clamp(0px, 2.5vw, 36px);
  }

  .content-flex.doc-layout--with-toc .toc {
    width: min(292px, 22vw);
    flex: 0 0 min(292px, 22vw);
  }

  .content-flex {
    gap: 30px;
  }

  .content-flex:not(.doc-layout--with-toc) .markdown-column.markdown-body {
    padding-top: clamp(4px, 1vw, 12px);
    padding-bottom: clamp(28px, 3.5vw, 52px);
  }

  .markdown-column.markdown-body {
    font-size: 1.1rem;
  }

  :deep(.markdown-body h2) {
    font-size: 2rem;
  }

  :deep(.markdown-body p) {
    font-size: 1.15rem;
    line-height: 1.9;
  }

  :deep(.markdown-body img) {
    border-radius: 14px;
    margin: 25px 0;
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
