<template>
  <div class="repo-detail">
    <h2>{{ repo.repoName }}</h2>
    <!-- 如果有截图数据，使用截图轮播组件 -->
    <ScreenshotCarousel v-if="repo.screenshots && repo.screenshots.length"
                        :screenshots="repo.screenshots"
    />
    <div v-else class="no-screenshot">
      <p>No screenshots available.</p>
    </div>
    <!-- README 内容渲染 -->
    <div class="readme-content" v-html="renderedMarkdown">
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { marked } from "marked";
import DOMPurify from "dompurify";
import ScreenshotCarousel from './ScreenshotCarousel.vue';

const props = defineProps({
  repo: {
    type: Object,
    required: true
  }
});

// 渲染 Markdown 内容并进行安全处理
const renderedMarkdown = computed(() => {
  const html = marked.parse(props.repo.repoReadme || "");
  return DOMPurify.sanitize(html);
});
</script>

<style scoped>
.repo-detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.no-screenshot {
  text-align: center;
  color: #777;
  padding: 1rem;
  background: #fafafa;
  border-radius: 8px;
}
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
</style>
