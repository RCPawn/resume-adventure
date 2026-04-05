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

        <div class="meta-tags">
          <span class="meta-tag date">📅 {{ currentProject?.date || '2025' }}</span>
          <span v-for="tag in currentProject?.tags" :key="tag" class="meta-tag tech">⚡{{ tag }}</span>

          <span class="meta-tag views">
            <svg class="stat-icon" viewBox="0 0 24 24" width="20" height="20">
              <path
                  fill="currentColor"
                  d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
              />
            </svg>
            <span class="views-text">
              <span id="busuanzi_page_pv">--</span>
            </span>
          </span>

          <a v-if="currentProject?.repoLink" :href="currentProject.repoLink" target="_blank" class="meta-tag link" rel="noreferrer">
            🔗 源码仓库
          </a>
        </div>
      </div>
    </div>

    <div class="content-container">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        加载精彩内容中...
      </div>

      <div v-else-if="error" class="error-state">
        😕 {{ error }}
      </div>

      <div v-else class="content-flex">
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
                  <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
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
  return String(str)
      .trim()
      .toLowerCase()
      .replace(/[\s+~\/]+/g, '-')
      .replace(/[^\w\-一-龥\u4E00-\u9FFF]+/g, '')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '')
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
    if (!src.startsWith('http') && !src.startsWith('/') && !src.startsWith('data:')) {
      token.attrs[srcIndex][1] = `/projects/${src}`
    }
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

// ✅ 核心修复：每次进入页面都重新插入脚本，让不蒜子自动重新扫描 DOM
const BUSUANZI_SCRIPT_ID = 'busuanzi-script'
const BUSUANZI_SCRIPT_URL = 'https://cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js'

const reinitBusuanzi = () => {
  // 1. 清除不蒜子在 window 上挂载的所有状态，防止旧数据干扰
  delete window.bszCaller
  delete window.bszTag

  // 2. 移除旧脚本标签
  const old = document.getElementById(BUSUANZI_SCRIPT_ID)
  if (old) old.remove()

  // 3. 重置元素显示，避免残留旧值
  const pvEl = document.getElementById('busuanzi_page_pv')
  if (pvEl) pvEl.textContent = '--'

  // 4. 重新插入脚本，不蒜子加载后会自动扫描页面中所有 busuanzi_ ID 元素并填充数据
  const script = document.createElement('script')
  script.id = BUSUANZI_SCRIPT_ID
  script.src = BUSUANZI_SCRIPT_URL
  script.async = true
  document.body.appendChild(script)
}

onMounted(async () => {
  if (window.innerWidth <= 768) isTocHidden.value = true
  await fetchMarkdown()
  await nextTick()
  // 等 DOM 完全渲染后再初始化，确保 busuanzi_page_pv 元素已存在
  reinitBusuanzi()
})

watch(
    () => route.params.id,
    async () => {
      await fetchMarkdown()
      await nextTick()
      reinitBusuanzi()
    }
)
</script>

<style scoped>
/* =================================
   基础布局
   ================================= */
.page-container {
  min-height: 100vh;
  background-color: var(--bg-color);
}

/* Hero 区域保持原样 */
.hero-section {
  position: relative;
  height: 60vh;
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
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px 60px 20px;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.project-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0 0 10px 0;
  letter-spacing: -1px;
  line-height: 1.1;
}

.project-desc {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 24px;
  max-width: 600px;
}

.meta-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}

.meta-tag {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.meta-tag.date {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.meta-tag.tech {
  background: rgba(96, 165, 250, 0.2);
  border: 1px solid rgba(96, 165, 250, 0.3);
  color: #60a5fa;
}

.meta-tag.views {
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10b981;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
}

.views-icon {
  flex-shrink: 0;
  opacity: 0.9;
}

.views-text {
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
}

.meta-tag.link {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-decoration: none;
  color: white;
}

.meta-tag.link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* =================================
   内容容器：拓展宽度以容纳侧边 TOC
   ================================= */
.content-container {
  position: relative;
  z-index: 3;
  max-width: 1250px; /* 放宽以便显示侧边目录 */
  margin: -50px auto 40px auto;
  padding: 0 20px;
}

/* 当有内容时，使用 flex 布局：左主内容，右 TOC */
.content-flex {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

/* Markdown 主列 */
.markdown-column {
  flex: 1 1 0;
  min-width: 0; /* 允许子元素溢出横向滚动 */
}

/* TOC 侧边栏 */
.toc {
  width: 240px;
  flex: 0 0 240px;
  position: sticky;
  top: 100px;
  height: calc(100vh - 120px);
  overflow: auto;
  background: transparent;
  border-radius: 12px;
  padding: 12px;
  box-sizing: border-box;
  transition: transform .25s ease, opacity .25s ease;
}

/* 隐藏效果（移动端折叠） */
.toc.toc-hidden {
  opacity: 0.9;
  transform: translateY(0);
}

/* TOC header - 使用版本二的样式 */
.toc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px;
  cursor: pointer;
}

.toc-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  color: var(--text-color);
}

.toc-icon {
  opacity: 0.9;
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

/* TOC 链接样式 */
.toc-list a {
  color: var(--text-color);
  text-decoration: none;
  transition: color .15s;
}

.toc-list a:hover {
  color: var(--primary-color);
  text-decoration: underline;
}

/* =================================
   Markdown 卡片（玻璃拟态） - 保持原样但微调
   ================================= */
.markdown-wrapper {
  background: var(--modal-bg);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 50px;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
  min-height: 400px;
  overflow: hidden;
}

/* =================================
   Markdown 深度定制
   ================================= */
.markdown-body {
  background: transparent !important;
  font-family: 'Inter', sans-serif;
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

/* 段落与文字 */
:deep(.markdown-body p) {
  color: var(--secondary-color);
  line-height: 1.8;
  font-size: 1.05rem;
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

/* 小屏设备：TOC 折叠并可切换 */
@media (max-width: 768px) {
  .content-flex {
    flex-direction: column;
    gap: 12px;
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
    gap: 10px;
  }

  .meta-tag {
    flex-shrink: 1;
  }
}

/* 大屏优化（27寸及以上） */
@media (min-width: 1600px) {
  .content-container {
    max-width: 1400px;
  }

  .hero-section {
    height: 65vh;
  }

  .hero-content {
    max-width: 1100px;
    padding: 0 30px 80px 30px;
  }

  .project-title {
    font-size: 4rem;
  }

  .project-desc {
    font-size: 1.4rem;
    max-width: 700px;
  }

  .content-flex {
    gap: 30px;
  }

  .toc {
    width: 280px;
    flex: 0 0 280px;
    padding: 16px;
  }

  .markdown-wrapper {
    padding: 60px;
    border-radius: 28px;
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
