<template>
  <!-- 纯箭头返回按钮，无按钮框体 -->
  <button
      @click="goBack"
      class="back-arrow"
      title="返回上一级"
      aria-label="返回上一页"
  >
    ←
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();

// 增强返回逻辑：兼容历史记录为空的情况
const goBack = () => {
  if (window.history.length <= 1) {
    router.push('/'); // 无历史记录则返回首页
  } else {
    router.go(-1); // 有历史记录则返回上一页
  }
};
</script>

<style scoped>
/* 核心：纯箭头返回按钮，无框体设计 */
.back-arrow {
  /* 固定定位，确保滚动不消失 */
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 9999; /* 最高层级，不被遮挡 */

  /* 纯箭头样式 - 无背景、无边框 */
  background: transparent;
  border: none;
  padding: 12px;
  margin: 0;
  cursor: pointer;

  /* 箭头样式 - 贴合博客手绘风格 */
  font-size: 40px;
  font-family: 'Comic Neue', 'Comic Sans MS', cursive;
  font-weight: 700;
  color: var(--text-color);

  /* 点击区域优化（比箭头大，提升点击体验） */
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;

  /* 柔和过渡动画 */
  transition: all 0.2s ease-in-out;
}

/* 悬浮效果：轻微缩放+浅背景+主题色，无深按感 */
.back-arrow:hover {
  color: var(--primary-color);
  transform: scale(1.1);
  background-color: rgba(var(--primary-color-rgb), 0.1);
}

/* 点击效果：极轻微缩放，避免深按感 */
.back-arrow:active {
  transform: scale(1.05);
  background-color: rgba(var(--primary-color-rgb), 0.15);
}

/* 适配暗黑模式 */
html.dark .back-arrow:hover {
  background-color: rgba(var(--primary-color-rgb), 0.2);
}

html.dark .back-arrow:active {
  background-color: rgba(var(--primary-color-rgb), 0.25);
}

/* 移动端适配：缩小尺寸，优化位置 */
@media (max-width: 768px) {
  .back-arrow {
    top: 16px;
    left: 16px;
    font-size: 20px;
    width: 40px;
    height: 40px;
    padding: 8px;
  }

  .back-arrow:hover {
    transform: scale(1.08);
  }
}

/* 可选：添加全局CSS变量（如果你的项目中没有primary-color-rgb） */
:root {
  --primary-color-rgb: 59, 130, 246; /* 对应#3b82f6的RGB值 */
}

html.dark {
  --primary-color-rgb: 96, 165, 250; /* 对应#60a5fa的RGB值 */
}
</style>