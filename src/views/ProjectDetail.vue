<template>
  <div class="page-container">
    <!-- 1. 顶部沉浸式 Hero 区域 -->
    <div class="hero-section" :style="{ backgroundImage: `url(${currentProject?.cover || defaultCover})` }">
      <div class="hero-overlay"></div>

      <!-- 顶部导航栏占位 -->
      <div class="hero-nav">
        <GoBackButton class="hero-back-btn" />
      </div>

      <div class="hero-content">
        <h1 class="project-title">{{ currentProject?.title }}</h1>
        <p class="project-desc">{{ currentProject?.description }}</p>

        <!-- 元数据胶囊 -->
        <div class="meta-tags">
          <span class="meta-tag date">
            📅 {{ currentProject?.date || '2024' }}
          </span>
          <span v-for="tag in currentProject?.tags" :key="tag" class="meta-tag tech">
            ⚡ {{ tag }}
          </span>
          <a v-if="currentProject?.repoLink" :href="currentProject.repoLink" target="_blank" class="meta-tag link">
            🔗 源码仓库
          </a>
        </div>
      </div>
    </div>

    <!-- 2. 内容阅读区域 (向上浮动) -->
    <div class="content-container">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div> 加载精彩内容中...
      </div>

      <div v-else-if="error" class="error-state">
        😕 {{ error }}
      </div>

      <div v-else class="markdown-wrapper">
        <!-- Markdown 内容 -->
        <div class="markdown-body" v-html="htmlContent"></div>
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

// 引入 GitHub 风格 Markdown 样式
import 'github-markdown-css/github-markdown.css'

const route = useRoute()

// 默认封面（如果项目没配图，用这个渐变兜底）
// 建议找一张好看的抽象科技图放在 public/images/default-cover.jpg
const defaultCover = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop'
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

const loading = ref(true)
const error = ref('')
const htmlContent = ref('')

const currentProject = computed(() => {
  return projectsData.find(p => p.id === route.params.id)
})

// ============================================
// 🔥 核心修复：自动修正 Markdown 图片路径
// ============================================
const defaultImageRender = md.renderer.rules.image || function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.image = function (tokens, idx, options, env, self) {
  const token = tokens[idx];
  const srcIndex = token.attrIndex('src');
  let src = token.attrs[srcIndex][1];

  // 逻辑：如果路径不是 http 开头，也不是 / 开头，说明是相对路径
  // 比如你写的是 "demo.png" 或者 "images/demo.png"
  if (!src.startsWith('http') && !src.startsWith('/') && !src.startsWith('data:')) {
    token.attrs[srcIndex][1] = `/projects/${src}`;
  }

  // 同时也给图片加个懒加载和样式类，优化体验
  token.attrPush(['loading', 'lazy']);

  return defaultImageRender(tokens, idx, options, env, self);
};

const fetchMarkdown = async () => {
  loading.value = true
  try {
    if (!currentProject.value) throw new Error('未找到项目')
    const fileName = currentProject.value.mdFile
    if (!fileName) throw new Error('暂无内容')

    const response = await fetch(`/projects/${fileName}`)
    if (!response.ok) throw new Error('加载失败')

    const text = await response.text()
    htmlContent.value = md.render(text)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMarkdown()
})
</script>

<style scoped>
/* =================================
   布局容器
   ================================= */
.page-container {
  min-height: 100vh;
  background-color: var(--bg-color); /* 使用你的全局背景 */
}

/* =================================
   1. Hero 区域 (沉浸式头部)
   ================================= */
.hero-section {
  position: relative;
  height: 60vh; /* 占据屏幕 60% 高度 */
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* 内容靠下 */
  /* 视差滚动效果 (可选) */
  background-attachment: fixed;
}

/* 遮罩层：让文字更清晰，且与底部自然过渡 */
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
      var(--bg-color) 100% /* 底部渐变到页面背景色，实现无缝融合 */
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
  padding: 0 20px 60px 20px; /* 底部留白给重叠的内容 */
  color: white; /* Hero 区域文字强制白色 */
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
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

/* =================================
   元数据标签 (Tech Stack)
   ================================= */
.meta-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.meta-tag {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.meta-tag.link {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  text-decoration: none;
  cursor: pointer;
}

.meta-tag.link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

/* =================================
   2. 内容区域 (卡片悬浮效果)
   ================================= */
.content-container {
  position: relative;
  z-index: 3;
  max-width: 900px;
  margin: -50px auto 40px auto; /* 负 margin 让它向上重叠 */
  padding: 0 20px;
}

.markdown-wrapper {
  /* 玻璃拟态卡片 */
  background: var(--modal-bg);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 50px;
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); /* 高级阴影 */
  min-height: 400px;
}

/* =================================
   Markdown 样式深度定制
   ================================= */
.markdown-body {
  background: transparent !important; /* 移除自带背景 */
  font-family: 'Inter', sans-serif;
  color: var(--text-color) !important;
}

/* 定制图片样式：让截图自带阴影和圆角 */
:deep(.markdown-body img) {
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  margin: 20px 0;
  max-width: 100%;
  border: 1px solid var(--border-color);
}

/* 标题样式优化 */
:deep(.markdown-body h2) {
  border-bottom: none;
  font-size: 1.8rem;
  margin-top: 2em;
  margin-bottom: 1em;
  color: var(--text-color);
  position: relative;
  padding-left: 16px;
}

/* 标题左侧装饰线 */
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

/* 文字颜色适配 */
:deep(.markdown-body p) {
  color: var(--secondary-color);
  line-height: 1.8;
  font-size: 1.05rem;
}

:deep(.markdown-body code) {
  background-color: var(--btn-bg);
  border-radius: 6px;
  color: var(--primary-color);
}

:deep(.markdown-body pre) {
  background-color: #1e1e1e !important; /* 代码块强制深色 */
  border-radius: 12px;
}

/* =================================
   Loading & Error
   ================================= */
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
  to { transform: rotate(360deg); }
}

/* =================================
   响应式
   ================================= */
@media (max-width: 768px) {
  .hero-section {
    height: 50vh;
  }

  .project-title {
    font-size: 2rem;
  }

  .content-container {
    padding: 0 10px;
    margin-top: -30px;
  }

  .markdown-wrapper {
    padding: 24px 20px;
    border-radius: 16px;
  }
}
</style>