<template>
  <div class="game-container">
    <div class="back-button-area">
      <GoBackButton />
    </div>

    <div class="game-area">
      <div class="game-frame">
        <iframe ref="gameIframe" :src="gameUrl" class="game-iframe"></iframe>
      </div>

      <div class="game-controls">
        <button class="hand-drawn-btn" @click="toggleFullscreen">
          <span class="btn-icon">⛶</span>
          <span class="btn-text">全屏</span>
        </button>
        <button class="hand-drawn-btn" @click="reloadGame">
          <span class="btn-icon">↻</span>
          <span class="btn-text">重新开始</span>
        </button>
      </div>
    </div>

    <!-- 简约手绘装饰元素 -->
    <div class="doodle top-right"></div>
    <div class="doodle bottom-left"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import GoBackButton from "@/components/GoBackButton.vue";

const gameUrl = ref('/WebGL Builds/index.html');
const gameIframe = ref(null);

function toggleFullscreen() {
  const iframe = gameIframe.value;
  if (iframe) {
    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
      iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) {
      iframe.msRequestFullscreen();
    }
  }
}

function reloadGame() {
  const iframe = gameIframe.value;
  if (iframe) {
    iframe.src = iframe.src;
  }
}

// 调整游戏尺寸
function adjustGameSize() {
  const iframe = gameIframe.value;
  if (!iframe) return;

  const wrapper = document.querySelector('.game-frame');
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
/* 手绘风格字体 */
@font-face {
  font-family: 'HandDrawn';
  src: url('https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Architects_Daughter/ArchitectsDaughter-Regular.ttf') format('truetype');
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  overflow: hidden;
  height: 100%;
  width: 100%;
}

.game-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'HandDrawn', cursive;
  /* 镜面设计背景 */
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  background-image:
      linear-gradient(45deg, rgba(255,255,255,.2) 25%, transparent 25%, transparent 50%,
      rgba(255,255,255,.2) 50%, rgba(255,255,255,.2) 75%, transparent 75%, transparent);
  background-size: 100px 100px;
}

.back-button-area {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 50;
}

.game-area {
  width: 92%;
  height: 88%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.game-frame {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  /* 镜面效果 */
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.game-iframe {
  border: none;
  border-radius: 8px;
  background-color: rgba(246, 246, 246, 0.8);
  transition: all 0.3s ease;
  /* 手绘边框效果 */
  box-shadow:
      0 4px 8px rgba(0, 0, 0, 0.08),
      0 0 0 2px #f1f1f1,
      0 0 0 4px #e6e6e6;
}

.game-controls {
  position: absolute;
  bottom: 15px;
  right: 15px;
  display: flex;
  gap: 15px;
  padding: 8px;
  z-index: 10;
}

/* 手绘风格按钮 */
.hand-drawn-btn {
  padding: 10px 20px;
  background-color: #fff;
  border: 2px solid #333;
  border-radius: 8px;
  font-family: 'Sketchy', 'Comic Sans MS', cursive;
  font-size: 16px;
  cursor: pointer;
  position: relative;
  box-shadow: 4px 4px 0 #333;
  transition: all 0.2s ease;
}

/* 鼠标悬停时向下移动效果 */
.hand-drawn-btn:hover {
  box-shadow: 2px 2px 0 #333;
  transform: translate(2px, 2px);
}

.hand-drawn-btn:active {
  box-shadow: none;
  transform: translate(4px, 4px);
}

.btn-icon {
  font-size: 18px;
}

/* 手绘装饰元素 */
.doodle {
  position: absolute;
  pointer-events: none;
  opacity: 0.5;
  z-index: 1;
}

.top-right {
  top: 30px;
  right: 30px;
  width: 100px;
  height: 100px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20,50 C20,50 40,30 50,50 C60,70 80,50 80,50' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-dasharray='1,3'/%3E%3C/svg%3E");
}

.bottom-left {
  bottom: 30px;
  left: 30px;
  width: 120px;
  height: 120px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-dasharray='2,4'/%3E%3C/svg%3E");
  animation: gentle-rotate 50s linear infinite;
}

@keyframes gentle-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .game-area {
    width: 95%;
    height: 85%;
  }

  .game-controls {
    bottom: 20px;
    right: 50%;
    transform: translateX(50%);
  }

  .hand-drawn-btn {
    padding: 8px 14px;
    font-size: 14px;
  }

  .doodle {
    opacity: 0.3;
    transform: scale(0.7);
  }
}
</style>