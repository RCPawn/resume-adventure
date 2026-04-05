<template>
  <div class="page-container">
    <!-- 顶部 Hero 区域 -->
    <div class="hero-section">
      <div class="hero-overlay"></div>
      
      <!-- 返回按钮 -->
      <div class="hero-nav">
        <GoBackButton class="hero-back-btn" />
      </div>

      <div class="hero-content">
        <h1 class="project-title">🎮 简历冒险</h1>
        <p class="project-desc">在像素世界中探索我的技术旅程</p>
      </div>
    </div>

    <!-- 游戏内容区域 -->
    <div class="content-container">
      <div class="game-wrapper">
        <div class="game-frame">
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>游戏加载中...</p>
          </div>
          <iframe 
            v-show="!loading"
            ref="gameIframe" 
            :src="gameUrl" 
            class="game-iframe"
            @load="onGameLoaded"
          ></iframe>
        </div>
        
        <!-- 游戏提示 -->
        <div class="game-tips">
          <div class="tip-item">🎯 使用方向键或 WASD 移动</div>
          <div class="tip-item">⌨️ 按空格键互动</div>
          <div class="tip-item">🚀 探索整个地图发现更多内容</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import GoBackButton from "@/components/GoBackButton.vue";

const gameUrl = ref('/WebGL Builds/index.html');
const gameIframe = ref(null);
const loading = ref(true);

const onGameLoaded = () => {
  loading.value = false;
  adjustGameSize();
};

// 调整游戏尺寸，确保最佳显示效果
function adjustGameSize() {
  const iframe = gameIframe.value;
  if (!iframe) return;

  const wrapper = document.querySelector('.game-frame');
  if (!wrapper) return;
  
  const aspectRatio = 16 / 9;
  const maxWidth = wrapper.clientWidth;
  const maxHeight = wrapper.clientHeight;

  let width = maxWidth;
  let height = width / aspectRatio;

  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  iframe.style.width = `${width}px`;
  iframe.style.height = `${height}px`;
}

onMounted(() => {
  window.addEventListener('resize', adjustGameSize);
  setTimeout(adjustGameSize, 200);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', adjustGameSize);
});
</script>

<style scoped>
/* =================================
   基础布局
   ================================= */
.page-container {
  min-height: 100vh;
  background-color: var(--bg-color);
}

/* Hero 区域 */
.hero-section {
  position: relative;
  height: 45vh;
  min-height: 350px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-attachment: fixed;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.5) 60%,
    var(--bg-color) 100%
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
  padding: 0 20px 50px 20px;
  color: white;
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
}

.project-title {
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 10px 0;
  letter-spacing: -1px;
  line-height: 1.1;
}

.project-desc {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

/* =================================
   内容容器
   ================================= */
.content-container {
  position: relative;
  z-index: 3;
  max-width: 1200px;
  margin: -40px auto 60px auto;
  padding: 0 20px;
}

.game-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* =================================
   游戏卡片（玻璃拟态）
   ================================= */
.game-frame {
  background: var(--modal-bg);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1);
  min-height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.game-iframe {
  border: none;
  border-radius: 12px;
  background-color: #000;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

/* Loading 状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  color: var(--secondary-color);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* =================================
   游戏提示
   ================================= */
.game-tips {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  padding: 0 10px;
}

.tip-item {
  background: var(--modal-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px 20px;
  color: var(--text-color);
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.tip-item:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--hover-shadow);
}

/* =================================
   响应式适配
   ================================= */
@media (max-width: 768px) {
  .hero-section {
    height: 35vh;
    min-height: 280px;
  }
  
  .project-title {
    font-size: 2rem;
  }
  
  .project-desc {
    font-size: 1rem;
  }
  
  .content-container {
    margin: -30px auto 40px auto;
    padding: 0 15px;
  }
  
  .game-frame {
    padding: 20px;
    min-height: 500px;
    border-radius: 16px;
  }
  
  .game-tips {
    grid-template-columns: 1fr;
  }
}

/* 大屏优化（27寸及以上） */
@media (min-width: 1600px) {
  .hero-section {
    height: 50vh;
  }
  
  .hero-content {
    max-width: 1100px;
    padding: 0 30px 60px 30px;
  }
  
  .project-title {
    font-size: 3.5rem;
  }
  
  .project-desc {
    font-size: 1.3rem;
  }
  
  .content-container {
    max-width: 1400px;
    margin: -50px auto 80px auto;
    padding: 0 30px;
  }
  
  .game-frame {
    padding: 40px;
    min-height: 700px;
    border-radius: 28px;
  }
  
  .game-iframe {
    border-radius: 16px;
  }
  
  .game-tips {
    gap: 20px;
  }
  
  .tip-item {
    padding: 20px 24px;
    font-size: 1.05rem;
  }
}
</style>