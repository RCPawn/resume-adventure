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
import { onMounted, onUnmounted } from 'vue'
import TopRightButtons from '@/components/TopRightButtons.vue'
import { enable as enableDarkMode } from 'darkreader'

onMounted(() => {
  // 锁定页面滚动（可根据实际需求调整）
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
/* 全流式布局，使用 vw 单位和 clamp() 动态调整 */
.container {
  width: 100%;
  min-height: 100vh;
  padding: 4vw;
  font-family: 'Helvetica Neue', sans-serif;
  color: #2d3436;
  position: relative;
  box-sizing: border-box;
}

/* header 部分 */
.header {
  margin-bottom: 4vw;
  text-align: center;
}

.title-en {
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 700;
  animation: fade-in 1s ease;
}

.title-fr {
  font-size: clamp(1.5rem, 4vw, 3rem);
  font-weight: 400;
  animation: slide-up 1.5s ease;
}

/* 专业介绍区域 */
.profession {
  margin: 4vw 0;
}

.profession-line {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  margin: 2vw 0;
}

.highlight {
  color: #34495e;
  font-weight: bold;
}

/* 按钮区域 */
.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2vw;
  margin: 4vw 0;
}

.action-btn {
  position: relative;
  padding: clamp(0.8rem, 2vw, 1.2rem) clamp(1.5rem, 3vw, 2rem);
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  background: #fff;
  border: 2px solid #2d3436;
  border-radius: 10px;
  text-decoration: none;
  color: #2d3436;
  font-weight: bold;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: bounce 2s infinite;
  min-width: clamp(120px, 10vw, 150px);
  box-sizing: border-box;
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
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slide-left {
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slide-right {
  from { transform: translateX(20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* 针对竖屏手机优化：增大上下间距，保证整体居中显示 */
@media (max-width: 600px) and (orientation: portrait) {
  .container {
    padding: 6vw;
  }
  .header {
    margin-bottom: 6vw;
  }
  .profession {
    margin: 6vw 0;
  }
  .actions {
    margin: 6vw 0;
    gap: 3vw;
  }
}
</style>
