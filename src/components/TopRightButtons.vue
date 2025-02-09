<template>
  <div class="top-right-buttons">
    <a href="https://github.com/RCPawn?tab=repositories" target="_blank" class="top-btn github-btn">
      <!-- 使用 Ant Design 的 GitHub 图标 -->
      <GithubOutlined />
      GitHub
    </a>
    <button class="top-btn language-btn" @click="toggleLanguage">
      EN | CN
    </button>
    <button class="top-btn theme-btn" @click="toggleTheme">
      Light/Dark
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { enable as enableDarkMode, disable as disableDarkMode } from 'darkreader';
// 引入 Ant Design 的 GitHub 图标
import { GithubOutlined } from '@ant-design/icons-vue';

const { locale } = useI18n();

// 切换语言
const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'cn' : 'en';
};

// 切换主题
const toggleTheme = () => {
  const isDarkMode = localStorage.getItem('theme') === 'dark';
  if (isDarkMode) {
    disableDarkMode();
    localStorage.setItem('theme', 'light');
  } else {
    enableDarkMode({
      brightness: 100,
      contrast: 90,
      sepia: 10,
    });
    localStorage.setItem('theme', 'dark');
  }
};
</script>

<style scoped>
.top-right-buttons {
  position: absolute;
  top: 2rem;
  right: 2rem;
  display: flex;
  gap: 1rem;
}

.top-btn {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background: #fff;
  border: 2px solid #2d3436;
  border-radius: 8px;
  color: #2d3436;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center; /* 让内容在按钮内居中 */
}

.top-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.github-btn {
  background-color: #333;
  color: #fff;
  text-decoration: none;
}

.github-btn {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  gap: 0.5rem; /* 设置图标和文字之间的间距 */
}


.language-btn,
.theme-btn {
  background-color: #3498db;
  color: #fff;
}
</style>