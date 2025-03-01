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
      <span>{{ locale === 'en' ? '中文' : 'English' }}</span>
    </button>

    <!-- 主题切换按钮 -->
    <button class="top-btn theme-btn" @click="toggleTheme">
      <BulbOutlined class="btn-icon"/>
      <span>{{ isDarkMode ? 'Light' : 'Dark' }}</span>
    </button>
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n';
import {enable as enableDarkMode, disable as disableDarkMode} from 'darkreader';
import {GithubOutlined, GlobalOutlined, BulbOutlined} from '@ant-design/icons-vue';
import {ref, computed} from 'vue';

const {locale} = useI18n();
const isDarkMode = ref(localStorage.getItem('theme') === 'dark');

// 切换语言
const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'cn' : 'en';
};

// 切换主题
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    enableDarkMode({brightness: 100, contrast: 90, sepia: 10});
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
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  gap: 0.75rem;
}

/* 通用按钮样式 */
.top-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 10px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

/* 统一悬停效果 */
.top-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

/* 图标 */
.btn-icon {
  font-size: 1.2rem;
}
</style>
