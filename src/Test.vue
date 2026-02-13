<template>
  <div class="page-container">
    <!-- HERO -->
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
          <span v-for="tag in currentProject?.tags" :key="tag" class="meta-tag tech">⚡ {{ tag }}</span>
          <a v-if="currentProject?.repoLink" :href="currentProject.repoLink" target="_blank" class="meta-tag link">🔗 源码仓库</a>
        </div>
      </div>
    </div>

    <!-- CONTENT: TOC + MARKDOWN -->
    <div class="content-container">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div> 加载精彩内容中...
      </div>

      <div v-else-if="error" class="error-state">
        😕 {{ error }}
      </div>

      <div v-else class="content-flex">
        <!-- TOC：收起时显示窄条，展开时显示卡片 -->
        <aside class="toc" :class="{ collapsed: isTocHidden }">
          <div class="toc-inner">
            <div class="toc-header" @click="toggleToc" role="button" tabindex="0" @keydown.enter="toggleToc">
              <div class="toc-title">
                <svg class="toc-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path fill="currentColor" d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z"></path>
                </svg>
                <strong>目录</strong>
              </div>
              <button class="toc-toggle" aria-label="切换目录">
                <span class="chev" :class="{ open: !isTocHidden }">
                  <!-- chevron -->
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
                  </svg>
                </span>
              </button>
            </div>

            <nav class="toc-list-wrap" v-show="!isTocHidden">
              <ul class="toc-list">
                <li v-for="item in toc" :key="item.slug" :class="`level-${item.level}`">
                  <a :href="`#${item.slug}`" @click.prevent="scrollToId(item.slug)">{{ item.title }}</a>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        <!-- Markdown 主体 -->
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
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'
import projectsData from '@/data/projects.json'
import GoBackButton from "@/components/GoBackButton.vue";

// GitHub markdown base 样式（保留）
import 'github-markdown-css/github-markdown.css'

// route & defaults
const route = useRoute()
const defaultCover = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop'

// markdown-it init
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

// store default renderers
const defaultHeadingOpen = md.renderer.rules.heading_open || function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};
const defaultImageRender = md.renderer.rules.image || function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

// slugify (保留中文并去除特殊字符，类似 GitHub 简化风格)
const slugify = (str) => {
  if (!str) return ''
  return String(str)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/　+/g, '-') // 日文全角空格
      .replace(/[^\w\-一-龥\u4E00-\u9FFF]+/g, '') // 保留字母数字及中文
      .replace(/\-+/g, '-')
      .replace(/(^-+|-+$)/g, '')
}

// inject id into headings for anchors
md.renderer.rules.heading_open = function (tokens, idx, options, env, self) {
  const next = tokens[idx + 1]
  let title = ''
  if (next && next.type === 'inline') title = next.content
  const id = slugify(title || `heading-${idx}`)
  const existingIndex = tokens[idx].attrIndex && tokens[idx].attrIndex('id')
  if (existingIndex === -1) tokens[idx].attrPush(['id', id])
  else tokens[idx].attrs[existingIndex][1] = id
  return defaultHeadingOpen(tokens, idx, options, env, self)
}

// image path auto-fix + lazy + class
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

// reactive state
const loading = ref(true)
const error = ref('')
const htmlContent = ref('')
const currentProject = computed(() => projectsData.find(p => p.id === route.params.id))

const toc = ref([]) // { level, title, slug }
const isTocHidden = ref(false)

const scrollToId = (id) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (window.innerWidth <= 768) isTocHidden.value = true
  }
}

const toggleToc = () => {
  isTocHidden.value = !isTocHidden.value
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

    // parse tokens to build TOC (h2-h4)
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
    // render HTML (ids already injected by heading_open override)
    htmlContent.value = md.render(text)
  } catch (err) {
    error.value = err.message || String(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (window.innerWidth <= 768) isTocHidden.value = true
  fetchMarkdown()
})
</script>

<style scoped>
/* -------------------------
   基础容器与 hero（保留原设计）
   ------------------------- */
.page-container { min-height: 100vh; background-color: var(--bg-color); }
.hero-section {
  position: relative; height: 60vh;
  background-size: cover; background-position: center;
  display:flex; flex-direction:column; justify-content:flex-end;
  background-attachment: fixed;
}
.hero-overlay {
  position:absolute; inset:0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.6) 60%, var(--bg-color) 100%);
  z-index:1;
}
.hero-nav { position:absolute; top:20px; left:20px; z-index:10; }
.hero-content { position:relative; z-index:2; width:100%; max-width:1100px; margin:0 auto; padding:0 20px 60px; color:white; text-shadow:0 2px 10px rgba(0,0,0,0.45); }
.project-title { font-size:3.2rem; font-weight:800; margin:0 0 8px; line-height:1.05; }
.project-desc { font-size:1.05rem; opacity:0.95; margin-bottom:18px; max-width:680px; }

/* meta tags */
.meta-tags { display:flex; flex-wrap:wrap; gap:10px; }
.meta-tag { background: rgba(255,255,255,0.08); backdrop-filter: blur(6px); border:1px solid rgba(255,255,255,0.08); padding:6px 12px; border-radius:18px; font-weight:500; display:inline-flex; align-items:center; gap:8px; color:white; }
.meta-tag.link { background:var(--primary-color); color:white; border-color:var(--primary-color); text-decoration:none; }

/* -------------------------
   内容容器：扩大为 1200px，以提高正文宽度
   将 TOC 稍左移（通过减小 toc 宽度并放宽主列）
   ------------------------- */
.content-container {
  position:relative; z-index:3; max-width:1200px; margin:-50px auto 40px auto; padding:0 20px;
}
.content-flex { display:flex; gap:20px; align-items:flex-start; }

/* markdown 主列宽度增加（保证更宽正文） */
.markdown-column { flex: 1 1 0; min-width: 0; }

/* TOC：更窄、更靠左（200px），并实现收起与展开的平滑动画 */
.toc {
  width: 200px; flex: 0 0 200px; position:sticky; top:100px; height: calc(100vh - 120px);
  display:flex; align-items:flex-start; transition: width .28s ease, opacity .25s ease, transform .25s ease;
  z-index:4;
}
.toc.collapsed { width: 56px; }

/* TOC 内部卡片样式 */
.toc-inner {
  width:100%; background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border-radius:12px; padding:8px; box-sizing:border-box;
  border: 1px solid rgba(100,100,100,0.06);
  box-shadow: 0 6px 20px rgba(10,10,20,0.06);
}

/* header（可点击） */
.toc-header {
  display:flex; align-items:center; justify-content:space-between; gap:10px; padding:8px; cursor:pointer;
}
.toc-title { display:flex; align-items:center; gap:8px; font-size:0.95rem; color:var(--text-color); }
.toc-icon { opacity:0.9; }

/* 折叠按钮及箭头 */
.toc-toggle { background:transparent; border:none; padding:6px; display:inline-flex; align-items:center; cursor:pointer; color:var(--secondary-color); }
.chev { display:inline-block; transform: rotate(-90deg); transition: transform .28s cubic-bezier(.2,.9,.2,1); }
.chev.open { transform: rotate(0deg); }

/* when collapsed, hide title text (only show icon) */
.toc.collapsed .toc-title strong { display:none; }
.toc.collapsed .toc-list-wrap { display:none; }

/* TOC 列表容器（展开时显示） */
.toc-list-wrap { max-height: calc(100vh - 160px); overflow:auto; padding:6px 4px 8px 6px; border-top:1px dashed rgba(100,100,100,0.04); }

/* list visuals */
.toc-list { list-style:none; padding:0; margin:6px 0 16px 0; }
.toc-list li { margin:6px 0; line-height:1.45; }
.toc-list li.level-2 { padding-left:0; font-weight:600; }
.toc-list li.level-3 { padding-left:10px; color:var(--secondary-color); font-size:0.95rem; }
.toc-list li.level-4 { padding-left:18px; color:var(--secondary-color); font-size:0.92rem; }

/* links */
.toc-list a { color:var(--text-color); text-decoration:none; transition: color .12s; }
.toc-list a:hover { color:var(--primary-color); text-decoration:underline; }

/* -------------------------
   Markdown 卡片（保留并微调）
   ------------------------- */
.markdown-wrapper {
  background: var(--modal-bg); border:1px solid var(--border-color); border-radius:20px; padding:48px; box-shadow:0 20px 40px -12px rgba(0,0,0,0.08); min-height:400px; overflow:hidden;
}
.markdown-body { background:transparent !important; font-family:'Inter',sans-serif; color:var(--text-color) !important; }

/* 图片 */
:deep(.markdown-body img) { border-radius:12px; box-shadow:0 8px 20px rgba(0,0,0,0.06); margin:20px 0; max-width:100%; border:1px solid var(--border-color); }

/* 代码块与行内代码 */
:deep(.markdown-body pre) { background-color:#1e1e1e !important; border-radius:12px; padding:14px; overflow:auto; }
:deep(.markdown-body code) { background-color:var(--btn-bg); border-radius:6px; color:var(--primary-color); padding:0 6px; }

/* 标题 */
:deep(.markdown-body h2) { border-bottom:none; font-size:1.7rem; margin-top:2.1em; margin-bottom:0.9em; color:var(--text-color); position:relative; padding-left:16px; }
:deep(.markdown-body h2::before) { content:''; position:absolute; left:0; top:6px; bottom:6px; width:4px; background:var(--primary-color); border-radius:2px; }

/* 段落 */
:deep(.markdown-body p) { color:var(--secondary-color); line-height:1.75; font-size:1.03rem; }

/* -------------------------
   表格：关键修复区（亮色主题下不再是暗色背景）
   目标：
     - 表头为浅色（或半透明）以提供分层
     - 单元格背景透明或非常浅
     - 保证在 light/dark 下都可读
     - 可横向滚动以防撑破布局
   ------------------------- */

/* 默认表格容器 */
:deep(.markdown-body table) {
  width:100%;
  border-collapse:collapse;
  margin:16px 0;
  overflow:auto;
  color:var(--text-color);
  font-size:0.95rem;
  border:1px solid var(--border-color);
  background: transparent;
  display: block; /* 让表格可滚动 */
}

/* 响应式横向滚动 wrapper（保证在较窄屏不撑破布局） */
.markdown-wrapper :deep(table) { display:block; width:100%; overflow-x:auto; }

/* 表头：亮主题下使用非常浅的灰色，暗主题下使用半透明白 */
@media (prefers-color-scheme: light) {
  :deep(.markdown-body thead th) {
    background-color: rgba(0,0,0,0.04);
    color: var(--text-color);
  }
}
@media (prefers-color-scheme: dark) {
  :deep(.markdown-body thead th) {
    background-color: rgba(255,255,255,0.04);
    color: var(--text-color);
  }
}

/* 统一单元格样式：透明底，边界更清晰 */
:deep(.markdown-body thead th),
:deep(.markdown-body tbody td) {
  padding:10px 12px;
  border-bottom:1px solid var(--border-color);
  background: transparent;
  text-align:left;
  vertical-align: middle;
}

/* tbody 行 hover 提示 */
:deep(.markdown-body tbody tr:hover) td {
  background-color: rgba(0,0,0,0.02);
}

/* 如果用户的全局变量没有准备好，提供保底色 */
:root {
  --fallback-table-header: rgba(0,0,0,0.04);
}

/* -------------------------
   Loading / Error / Spinner
   ------------------------- */
.loading-state, .error-state { text-align:center; padding:100px; background:var(--modal-bg); border-radius:20px; color:var(--secondary-color); border:1px solid var(--border-color); }
.spinner { width:40px; height:40px; border:3px solid var(--border-color); border-top-color:var(--primary-color); border-radius:50%; animation:spin 1s linear infinite; margin:0 auto 20px; }
@keyframes spin { to { transform: rotate(360deg); } }

/* -------------------------
   响应式
   ------------------------- */
@media (max-width: 1024px) {
  .content-container { max-width: 960px; }
  .hero-content { max-width: 960px; }
}
@media (max-width: 768px) {
  .content-flex { flex-direction: column; gap:12px; }
  .toc { width:100%; flex:0 0 auto; position:relative; height:auto; }
  .toc.collapsed { width:100%; }
  .toc-inner { padding:8px; }
  .markdown-wrapper { padding:20px; border-radius:12px; }
  .project-title { font-size:2rem; }
}
</style>