<template>
  <div class="container">
    <header class="header">
      <h1 class="title-en animate-fade-in">{{ $t('title') }}</h1>
      <h2 class="title-fr animate-slide-up">{{ $t('subtitle') }}</h2>
    </header>

    <div class="profession">
      <div class="profession-line animate-slide-left">
        <span class="highlight">{{ $t('profession.0') }}</span>
      </div>
      <div class="profession-line animate-slide-right">
        <span class="highlight">{{ $t('profession.1') }}</span>
      </div>
      <div class="profession-line animate-slide-left">
        <span class="highlight">{{ $t('profession.2') }}</span>
      </div>
    </div>

    <div class="actions">
      <RouterLink to="/gateway" class="action-btn animate-bounce">
        {{ $t('buttons.viewProjects') }}
        <div class="hover-line"></div>
      </RouterLink>
      <RouterLink to="/about" class="action-btn animate-bounce">
        {{ $t('buttons.aboutSite') }}
        <div class="hover-line"></div>
      </RouterLink>
    </div>

    <!-- 右上角按钮组件 -->
    <TopRightButtons/>
  </div>
</template>

<script setup>
import {onMounted, onUnmounted} from 'vue'
import TopRightButtons from '@/components/TopRightButtons.vue'
import {enable as enableDarkMode} from 'darkreader'

onMounted(() => {
  // 锁定页面滚动
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'

  // 检查 localStorage 中的主题设置
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    enableDarkMode({
      brightness: 100,
      contrast: 90,
      sepia: 10,
    })
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
})
</script>

<style scoped>
/* 页面基础样式 */
.container {
  min-height: 100vh;
  /* 增加顶部内边距，使内容整体向下移动 */
  padding: 4rem 4rem 2rem 4rem;
  font-family: 'Helvetica Neue', sans-serif;
  color: #2d3436;
  position: relative;
}

.header {
  margin-bottom: 4rem;
  text-align: center;
}

.title-en {
  font-size: 3rem;
  font-weight: 700;
  animation: fade-in 1s ease;
}

.title-fr {
  font-size: 1.8rem;
  font-weight: 400;
  animation: slide-up 1.5s ease;
}

.profession {
  margin: 4rem 0;
}

.profession-line {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 1rem 0;
}

.highlight {
  color: #34495e;
  font-weight: bold;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 3rem 0;
}

.action-btn {
  position: relative;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: #fff;
  border: 2px solid #2d3436;
  border-radius: 10px;
  text-decoration: none;
  color: #2d3436;
  font-weight: bold;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: bounce 2s infinite;
}

.action-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.hover-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #e74c3c;
  transition: width 0.3s ease;
}

.action-btn:hover .hover-line {
  width: 100%;
}

/* 动画效果 */
@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-left {
  from {
    transform: translateX(-20px);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-right {
  from {
    transform: translateX(20px);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}
</style>