<template>

  <GoBackButton/>

  <TopRightButtons/>

  <section class="github-view">
    <h1 class="page-title">我的 GitHub 仓库展示</h1>
    <div class="repo-container">
      <!-- 左侧：仓库列表 -->
      <aside class="repo-list">
        <div
            v-for="(repo, index) in repositories"
            :key="repo.id"
            :class="['repo-card', { active: activeRepo && activeRepo.id === repo.id }]"
            @click="selectRepo(repo)"
        >
          <h3>{{ repo.repoName }}</h3>
          <p class="description">{{ repo.repoDescription }}</p>
        </div>
      </aside>

      <!-- 右侧：仓库详情 -->
      <div class="repo-detail" v-if="activeRepo">
        <h2>{{ activeRepo.repoName }}</h2>

        <!-- 截图轮播（仅当 screenshots 存在且不为空时展示） -->
        <div v-if="activeRepo.screenshots && activeRepo.screenshots.length" class="screenshot-carousel">
          <button class="carousel-btn left" @click="prevSlide">❮</button>
          <img
              :src="activeRepo.screenshots[currentSlide].src"
              :alt="activeRepo.screenshots[currentSlide].alt"
              class="screenshot"
          />
          <button class="carousel-btn right" @click="nextSlide">❯</button>
          <div class="carousel-indicator">
            {{ currentSlide + 1 }} / {{ activeRepo.screenshots.length }}
          </div>
        </div>
        <div v-else class="no-screenshot">
          <p>No screenshots available.</p>
        </div>

        <!-- README Markdown 内容 -->
        <div class="readme-content" v-html="renderMarkdown(activeRepo.repoReadme)">
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {marked} from 'marked'
import DOMPurify from 'dompurify'
import githubData from '@/data/GitHub.json'
import GoBackButton from "@/components/GoBackButton.vue";
import TopRightButtons from '@/components/TopRightButtons.vue';

// 在 setup 内同步注册 onMounted
onMounted(() => {
  console.log('组件已挂载')
})

// 因为你的 JSON 文件内容即为一个数组，所以直接赋值
const repositories = ref(githubData || [])
const activeRepo = ref(repositories.value.length ? repositories.value[0] : null)
const currentSlide = ref(0)

// 切换选中仓库
const selectRepo = (repo) => {
  activeRepo.value = repo
  currentSlide.value = 0
}

// 下一张截图
const nextSlide = () => {
  if (activeRepo.value && activeRepo.value.screenshots && activeRepo.value.screenshots.length) {
    currentSlide.value = (currentSlide.value + 1) % activeRepo.value.screenshots.length
  }
}

// 上一张截图
const prevSlide = () => {
  if (activeRepo.value && activeRepo.value.screenshots && activeRepo.value.screenshots.length) {
    currentSlide.value = (currentSlide.value - 1 + activeRepo.value.screenshots.length) % activeRepo.value.screenshots.length
  }
}

// 使用 marked 渲染 Markdown，再用 DOMPurify 进行安全处理
const renderMarkdown = (content) => {
  const html = marked.parse(content || '')
  return DOMPurify.sanitize(html)
}
</script>

<style scoped>
.github-view {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
}

.page-title {
  text-align: center;
  margin-bottom: 1.5rem;
}

/* 左右分栏布局 */
.repo-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

/* 左侧：仓库列表 */
.repo-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  max-height: 80vh;
  border-right: 1px solid #e0e0e0;
  padding-right: 1rem;
}

.repo-card {
  padding: 1rem;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
}

.repo-card:hover {
  background: #f9f9f9;
  transform: translateX(5px);
}

.repo-card.active {
  border-left: 4px solid #42b983;
  background: #eefaf2;
}

.description {
  color: #555;
  font-size: 0.9rem;
}

/* 右侧：仓库详情 */
.repo-detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 截图轮播样式 */
.screenshot-carousel {
  position: relative;
  width: 100%;
  max-height: 500px;
  overflow: hidden;
  border-radius: 10px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.screenshot-carousel .screenshot {
  width: 100%;
  max-height: 500px;
  object-fit: contain;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.7);
  border: none;
  padding: 0.5rem;
  font-size: 1.5rem;
  cursor: pointer;
  border-radius: 50%;
}

.carousel-btn.left {
  left: 10px;
}

.carousel-btn.right {
  right: 10px;
}

.carousel-indicator {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.no-screenshot {
  text-align: center;
  color: #777;
  padding: 1rem;
  background: #fafafa;
  border-radius: 8px;
}

/* README 内容样式 */
.readme-content {
  padding: 1.5rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  line-height: 1.6;
}

.readme-content h1,
.readme-content h2,
.readme-content h3,
.readme-content h4,
.readme-content h5,
.readme-content h6 {
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .repo-container {
    grid-template-columns: 1fr;
  }

  .repo-list {
    flex-direction: row;
    overflow-x: auto;
    max-height: none;
    border-right: none;
    padding-right: 0;
  }

  .repo-card {
    min-width: 200px;
  }
}
</style>
