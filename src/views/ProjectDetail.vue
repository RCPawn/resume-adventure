<template>
  <div class="page-container">
    <div class="hero-section" :style="{ backgroundImage: `url(${currentProject?.cover || defaultCover})` }">
      <div class="hero-overlay"></div>
      <div class="hero-nav">
        <GoBackButton class="hero-back-btn" />
      </div>
      <div class="hero-content">
        <h1 class="project-title">{{ currentProject?.title }}</h1>
        <p class="project-desc">{{ currentProject?.description }}</p>
        <div class="meta-tags-wrap">
          <div class="meta-tags" aria-label="项目元信息">
            <span class="meta-tag meta-tag--date">
              <svg class="meta-tag__ico" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
              </svg>
              <span>{{ currentProject?.date || '2025' }}</span>
            </span>
            <span
              v-for="tag in currentProject?.tags"
              :key="tag"
              class="meta-tag meta-tag--tech"
              :title="tag"
            >
              <span class="meta-tag__tech-text">{{ tag }}</span>
            </span>
            <span class="meta-tag meta-tag--views" title="本页阅读量（不蒜子）">
              <svg class="meta-tag__ico" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              <span class="meta-tag__views-inner">
                <span id="busuanzi_page_pv" v-once class="page-pv-num">--</span><span class="page-pv-suffix"> 次</span>
              </span>
            </span>
            <a
              v-if="currentProject?.repoLink"
              :href="currentProject.repoLink"
              target="_blank"
              class="meta-tag meta-tag--link"
              rel="noreferrer"
              title="在浏览器中打开源码仓库"
            >
              <svg class="meta-tag__ico" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
              </svg>
              <span>源码</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="content-container">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        加载精彩内容中...
      </div>
      <div v-else-if="error" class="error-state">😕 {{ error }}</div>
      <div v-else class="content-flex" :class="{ 'doc-layout--with-toc': toc.length > 0 }">
        <aside v-if="toc.length" class="toc" :class="{ 'toc-hidden': isTocHidden }">
          <div class="toc-header" @click="toggleToc" role="button" tabindex="0" @keydown.enter="toggleToc">
            <div class="toc-title">
              <svg class="toc-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path fill="currentColor" d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z"></path>
              </svg>
              <strong>目录</strong>
            </div>
            <button class="toc-toggle" aria-label="切换目录">
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
        </aside>
        <main class="markdown-column">
          <div class="markdown-wrapper">
            <div class="markdown-body" v-html="htmlContent"></div>
          </div>
        </main>
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
const defaultCover = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop'

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
  /* 略宽于 1200：长表格/图文并排更舒适；仍用 max-width 防止超宽一行过长 */
  --content-max: min(1360px, min(96vw, 100vw - 24px));
  --page-pad-x: clamp(16px, 2.5vw, 32px);
  --section-gap: clamp(12px, 2vw, 24px);
  /* 主视觉：兼顾笔记本矮屏与 27" 一屏纵览，避免单靠 vh 撑出视口 */
  --project-hero-h: min(52vh, calc(100vh - clamp(120px, 18vh, 220px)));
  min-height: 100vh;
  min-height: 100dvh;
  background-color: var(--bg-color);
}

@supports (height: 1dvh) {
  .page-container {
    --project-hero-h: min(52dvh, calc(100dvh - clamp(120px, 18vh, 220px)));
  }
}

.hero-section {
  position: relative;
  height: var(--project-hero-h);
  min-height: 200px;
  max-height: min(560px, 85vh);
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-attachment: fixed;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.3) 0%,
      rgba(0, 0, 0, 0.6) 60%,
      var(--bg-color) 100%
  );
  z-index: 1;
}

.hero-nav {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 0 var(--page-pad-x) clamp(28px, 5vh, 48px);
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
}

.project-title {
  font-size: clamp(1.75rem, 2.5vw + 1rem, 3.5rem);
  font-weight: 800;
  margin: 0 0 10px 0;
  letter-spacing: -1px;
  line-height: 1.15;
}

.project-desc {
  font-size: clamp(1rem, 0.8vw + 0.85rem, 1.2rem);
  opacity: 0.9;
  margin-bottom: var(--section-gap);
  max-width: min(600px, 92vw);
  line-height: 1.55;
}

.meta-tags-wrap {
  margin-top: 14px;
  margin-left: calc(-1 * var(--page-pad-x));
  margin-right: calc(-1 * var(--page-pad-x));
}

/* 单行横向滚动：标签再多也不换行挤乱版面（资讯/App 里常见） */
.meta-tags {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-inline: contain;
  scroll-snap-type: x proximity;
  scroll-padding-inline: var(--page-pad-x);
  -webkit-overflow-scrolling: touch;
  padding: 2px var(--page-pad-x) 6px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.28) transparent;
}

.meta-tags::-webkit-scrollbar {
  height: 5px;
}

.meta-tags::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.22);
  border-radius: 999px;
}

.meta-tags::-webkit-scrollbar-track {
  background: transparent;
}

@media (prefers-reduced-motion: reduce) {
  .meta-tags {
    scroll-behavior: auto;
  }

  .meta-tag--link:hover,
  .meta-tag--link:active {
    transform: none;
  }
}

/* 与下方文档卡片一致的「圆角条」语言，避免大胶囊抢戏 */
.meta-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: 0 0 auto;
  scroll-snap-align: start;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 0.01em;
  color: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(15, 23, 42, 0.42);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.06) inset, 0 2px 12px rgba(0, 0, 0, 0.15);
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
  white-space: nowrap;
}

.meta-tag__ico {
  flex-shrink: 0;
  opacity: 0.88;
}

.meta-tag--date {
  border-color: rgba(255, 255, 255, 0.2);
}

.meta-tag--tech {
  min-width: 0;
  max-width: min(16rem, 72vw);
  border-left: 3px solid color-mix(in srgb, var(--primary-color) 75%, white);
  padding-left: 10px;
}

@supports not (color: color-mix(in srgb, red, blue)) {
  .meta-tag--tech {
    border-left-color: var(--primary-color);
  }
}

.meta-tag__tech-text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.meta-tag--views {
  border-color: rgba(52, 211, 153, 0.35);
  background: rgba(15, 23, 42, 0.5);
}

.meta-tag__views-inner {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.page-pv-num {
  font-variant-numeric: tabular-nums;
  min-width: 2ch;
  display: inline-block;
}

.page-pv-suffix {
  font-weight: 500;
}

.meta-tag--link {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.95);
  cursor: pointer;
  border-color: rgba(255, 255, 255, 0.22);
}

.meta-tag--link:hover {
  border-color: rgba(255, 255, 255, 0.38);
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.meta-tag--link:active {
  transform: translateY(0);
}

/* =================================
   内容容器：拓展宽度以容纳侧边 TOC
   ================================= */
.content-container {
  position: relative;
  z-index: 3;
  width: 100%;
  max-width: var(--content-max);
  margin: clamp(-32px, -4vh, -24px) auto clamp(28px, 4vh, 40px);
  padding: 0 var(--page-pad-x);
  box-sizing: border-box;
}

/* 正文区：无目录时仅 flex；有目录时由 .doc-layout--with-toc 统一成「单卡片」 */
.content-flex {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

/* 有目录：整页一块面板，目录与正文同高对齐（文档站常见做法，避免目录「飘着」） */
.content-flex.doc-layout--with-toc {
  gap: 0;
  align-items: stretch;
  background: var(--modal-bg);
  border: 1px solid var(--border-color);
  border-radius: 22px;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.06) inset,
    0 20px 50px -18px rgba(0, 0, 0, 0.12);
  /* 勿用 overflow:hidden，会纵向裁切 Mermaid SVG；横向交给内列 min-width:0 处理 */
  overflow-x: clip;
  overflow-y: visible;
}

/* Markdown 主列 */
.markdown-column {
  flex: 1 1 0;
  min-width: 0; /* 允许子元素溢出横向滚动 */
}

.content-flex.doc-layout--with-toc .markdown-column {
  min-width: 0;
  flex: 1 1 min(0, 100%);
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
  position: sticky;
  top: 72px;
  max-height: min(calc(100vh - 88px), calc(100dvh - 88px));
  height: auto;
  width: min(268px, 26vw);
  flex: 0 0 min(268px, 26vw);
  padding: 20px 14px 28px 20px;
  border-radius: 0;
  background: linear-gradient(
    165deg,
    color-mix(in srgb, var(--btn-bg) 92%, var(--primary-color) 8%) 0%,
    var(--btn-bg) 48%,
    var(--modal-bg) 100%
  );
  border-right: 1px solid var(--border-color);
  box-shadow: 4px 0 24px -20px rgba(0, 0, 0, 0.15);
}

/* 无 color-mix 的内核：纯色底 */
@supports not (background: color-mix(in srgb, red, blue)) {
  .content-flex.doc-layout--with-toc .toc {
    background: var(--btn-bg);
  }
}

/* 隐藏效果（移动端折叠） */
.toc.toc-hidden {
  opacity: 0.92;
}

/* TOC header */
.toc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 8px 14px;
  margin: -4px -4px 4px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
}

.toc-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--secondary-color);
}

.toc-icon {
  opacity: 0.85;
  color: var(--primary-color);
}

/* 折叠按钮及箭头 */
.toc-toggle {
  background: transparent;
  border: none;
  padding: 6px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  color: var(--secondary-color);
}

.chev {
  display: inline-block;
  transform: rotate(-90deg);
  transition: transform .28s cubic-bezier(.2, .9, .2, 1);
}

.chev.open {
  transform: rotate(0deg);
}

/* TOC 列表 */
.toc-list {
  font-size: 0.95rem;
}

.toc-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-list li {
  margin: 6px 0;
  line-height: 1.5;
}

/* 根据标题层级稍作缩进 */
.toc-list li.level-2 {
  padding-left: 0px;
}

.toc-list li.level-3 {
  padding-left: 10px;
  font-size: 0.92rem;
  color: var(--secondary-color);
}

.toc-list li.level-4 {
  padding-left: 18px;
  font-size: 0.9rem;
  color: var(--secondary-color);
}

/* TOC 链接：弱引导线 + 悬停主色，避免像纯文本列表 */
.toc-list a {
  display: block;
  padding: 6px 8px 6px 10px;
  margin: 0 -8px;
  border-radius: 8px;
  color: var(--text-color);
  text-decoration: none;
  transition: background .15s ease, color .15s ease;
  border-left: 3px solid transparent;
}

.toc-list a:hover {
  color: var(--primary-color);
  background: color-mix(in srgb, var(--primary-color) 8%, transparent);
}

@supports not (color: color-mix(in srgb, red, blue)) {
  .toc-list a:hover {
    background: rgba(96, 165, 250, 0.08);
  }
}

.content-flex.doc-layout--with-toc .toc-list a:hover {
  border-left-color: color-mix(in srgb, var(--primary-color) 55%, transparent);
}

@supports not (color: color-mix(in srgb, red, blue)) {
  .content-flex.doc-layout--with-toc .toc-list a:hover {
    border-left-color: rgba(96, 165, 250, 0.5);
  }
}

/* =================================
   Markdown 卡片
   ================================= */
.markdown-wrapper {
  background: var(--modal-bg);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 50px;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
  min-height: 400px;
  overflow-x: auto;
  overflow-y: visible;
}

/* 与目录合体时：去掉第二张「卡片」，避免双层边框 */
.content-flex.doc-layout--with-toc .markdown-wrapper {
  border: none;
  border-radius: 0;
  box-shadow: none;
  padding: clamp(32px, 4vw, 52px) clamp(28px, 3.5vw, 56px) clamp(40px, 5vw, 64px);
  min-height: min(400px, 60vh);
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

/* 图片 */
:deep(.markdown-body img) {
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  margin: 20px 0;
  max-width: 100%;
  border: 1px solid var(--border-color);
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
  .hero-section {
    background-attachment: scroll;
    max-height: none;
  }

  .content-flex {
    flex-direction: column;
    gap: 12px;
  }

  .content-flex.doc-layout--with-toc {
    flex-direction: column;
    gap: 0;
    border-radius: 18px;
  }

  .content-flex.doc-layout--with-toc .toc {
    width: 100%;
    flex: 0 0 auto;
    max-height: none;
    position: relative;
    top: auto;
    align-self: stretch;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    box-shadow: 0 10px 28px -16px rgba(0, 0, 0, 0.12);
    padding: 16px 18px 14px;
  }

  .content-flex.doc-layout--with-toc .markdown-wrapper {
    padding: 24px 20px 32px;
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

  .markdown-wrapper {
    padding: 24px;
    border-radius: 16px;
  }

  .project-title {
    font-size: 2rem;
  }

  .meta-tags {
    gap: 6px;
    padding-bottom: 8px;
  }
}

/* 大屏：略放宽内容区 + 目录列，阅读与表格更舒展 */
@media (min-width: 1600px) {
  .page-container {
    --project-hero-h: min(48vh, calc(100vh - clamp(100px, 14vh, 180px)));
    --content-max: min(1480px, min(94vw, 100vw - 40px));
  }

  @supports (height: 1dvh) {
    .page-container {
      --project-hero-h: min(48dvh, calc(100dvh - clamp(100px, 14vh, 180px)));
    }
  }

  .hero-section {
    max-height: min(520px, 70vh);
  }

  .hero-content {
    max-width: var(--content-max);
    padding-bottom: clamp(36px, 5vh, 56px);
  }

  .project-title {
    font-size: clamp(2.25rem, 2vw + 1.5rem, 4rem);
  }

  .project-desc {
    font-size: clamp(1.1rem, 0.5vw + 1rem, 1.4rem);
    max-width: min(700px, 88vw);
  }

  .content-flex.doc-layout--with-toc .toc {
    width: min(292px, 22vw);
    flex: 0 0 min(292px, 22vw);
    padding: 22px 16px 32px 22px;
  }

  .content-flex {
    gap: 30px;
  }

  .content-flex.doc-layout--with-toc {
    gap: 0;
  }

  .markdown-wrapper {
    padding: 60px;
    border-radius: 28px;
  }

  .content-flex.doc-layout--with-toc .markdown-wrapper {
    padding: clamp(40px, 3.5vw, 64px) clamp(36px, 3vw, 72px) clamp(48px, 4vw, 80px);
  }

  .markdown-body {
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

/* Loading & Error 保持原样 */
.loading-state, .error-state {
  text-align: center;
  padding: 100px;
  background: var(--modal-bg);
  border-radius: 24px;
  color: var(--secondary-color);
  border: 1px solid var(--border-color);
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
