<template>
  <div class="top-right-buttons">
    <!-- GitHub 按钮 -->
    <a href="https://github.com/RCPawn?tab=repositories" target="_blank" class="top-btn github-btn">
      <GithubOutlined class="btn-icon"/>
      <span>GitHub</span>
    </a>

    <!-- 语言切换按钮 -->
    <button class="top-btn language-btn" @click="toggleLanguage">
      <GlobalOutlined class="btn-icon"/>
      <span>{{ locale === 'cn' ? 'English' : '中文' }}</span>
    </button>

    <!-- 主题切换按钮 -->
    <button class="top-btn theme-btn" @click="toggleTheme">
      <BulbOutlined class="btn-icon"/>
      <span>{{ isDarkMode ? 'Light' : 'Dark' }}</span>
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { enable as enableDarkMode, disable as disableDarkMode } from 'darkreader';
import { GithubOutlined, GlobalOutlined, BulbOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';

const { locale } = useI18n();
const isDarkMode = ref(localStorage.getItem('theme') === 'dark');

// 切换语言
const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'cn' : 'en';
};

// 切换主题
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    enableDarkMode({ brightness: 100, contrast: 90, sepia: 10 });
    localStorage.setItem('theme', 'dark');
  } else {
    disableDarkMode();
    localStorage.setItem('theme', 'light');
  }
};
</script>

<style scoped>
.top-right-buttons {
  position: absolute;
  top: clamp(1rem, 3vw, 2rem);
  right: clamp(1rem, 3vw, 2rem);
  display: flex;
  gap: clamp(0.5rem, 1vw, 1rem);
  z-index: 100;
}

/* 通用按钮样式 */
.top-btn {
  display: flex;
  align-items: center;
  gap: clamp(0.3rem, 0.8vw, 0.5rem);
  padding: clamp(0.5rem, 1vw, 0.75rem) clamp(0.8rem, 1.5vw, 1rem);
  font-size: clamp(0.8rem, 1.5vw, 1rem);
  font-weight: bold;
  border-radius: clamp(5px, 1vw, 10px);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 clamp(2px, 0.5vw, 4px) clamp(4px, 1vw, 6px) rgba(0, 0, 0, 0.1);
}

/* GitHub 按钮 */
.github-btn {
  background-color: #24292e;
  color: #fff;
  border-color: #24292e;
  text-decoration: none;
}

.github-btn:hover {
  background-color: #333;
}

/* 语言和主题按钮 */
.language-btn {
  background-color: #3498db;
  color: #fff;
}

.theme-btn {
  background-color: #f1c40f;
  color: #2d3436;
}

/* 悬停效果 */
.top-btn:hover {
  transform: translateY(clamp(1px, 2vw, 3px));
  box-shadow: 0 clamp(3px, 1vw, 6px) clamp(6px, 1.5vw, 10px) rgba(0, 0, 0, 0.2);
}

/* 图标大小 */
.btn-icon {
  font-size: clamp(1rem, 1.5vw, 1.2rem);
}

/* 移动端优化：将按钮组作为顶部固定导航栏展示 */
@media (max-width: 600px) {
  .top-right-buttons {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 0.5rem clamp(1rem, 3vw, 2rem);
    background-color: rgba(255, 255, 255, 0.95);
    justify-content: flex-end;
    gap: 0.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
}
</style>
