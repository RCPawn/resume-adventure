<template>
  <div class="top-right-buttons">
    <a href="https://github.com/RCPawn?tab=repositories" target="_blank" class="top-btn github-btn">
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
import { useI18n } from 'vue-i18n'
import { enable as enableDarkMode, disable as disableDarkMode } from 'darkreader'

const { locale } = useI18n()

// 切换语言
const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'cn' : 'en'
}

// 切换主题
const toggleTheme = () => {
  const isDarkMode = localStorage.getItem('theme') === 'dark'
  if (isDarkMode) {
    disableDarkMode()
    localStorage.setItem('theme', 'light')
  } else {
    enableDarkMode({
      brightness: 100,
      contrast: 90,
      sepia: 10,
    })
    localStorage.setItem('theme', 'dark')
  }
}
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

.language-btn,
.theme-btn {
  background-color: #3498db;
  color: #fff;
}
</style>
