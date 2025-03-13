<template>
  <div class="sketchy-game-container">
    <GoBackButton class="sketchy-back-button"/>
    <div class="sketchy-frame">
      <div class="sketchy-frame-corner top-left"></div>
      <div class="sketchy-frame-corner top-right"></div>
      <div class="sketchy-frame-corner bottom-left"></div>
      <div class="sketchy-frame-corner bottom-right"></div>
      <iframe :src="gameUrl" class="sketchy-iframe" border="0"></iframe>
    </div>
    <div class="sketchy-controls">
      <button class="sketchy-btn" @click="toggleFullscreen">全屏</button>
      <button class="sketchy-btn" @click="reloadGame">重新开始</button>
    </div>
    <div class="sketchy-decoration dot-1"></div>
    <div class="sketchy-decoration dot-2"></div>
    <div class="sketchy-decoration squiggle-1"></div>
    <div class="sketchy-decoration squiggle-2"></div>
    <div class="sketchy-decoration star"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import GoBackButton from "@/components/GoBackButton.vue";

const gameUrl = ref('/WebGL Builds/index.html');
const iframeElement = ref(null);

function toggleFullscreen() {
  const iframe = document.querySelector('.sketchy-iframe');
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
  const iframe = document.querySelector('.sketchy-iframe');
  if (iframe) {
    iframe.src = iframe.src;
  }
}

onMounted(() => {
  // 添加窗口大小调整时的事件监听器
  window.addEventListener('resize', adjustGameSize);
  // 初始化时调整一次
  adjustGameSize();
});

function adjustGameSize() {
  const container = document.querySelector('.sketchy-frame');
  const iframe = document.querySelector('.sketchy-iframe');

  if (container && iframe) {
    // 根据容器大小自动调整iframe大小
    const aspectRatio = 960 / 600; // 原始游戏宽高比
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // 确保iframe保持正确的宽高比
    if (containerWidth / containerHeight > aspectRatio) {
      iframe.style.height = '100%';
      iframe.style.width = `${containerHeight * aspectRatio}px`;
    } else {
      iframe.style.width = '100%';
      iframe.style.height = `${containerWidth / aspectRatio}px`;
    }
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'Sketchy';
  src: url('https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Architects_Daughter/ArchitectsDaughter-Regular.ttf') format('truetype');
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #f8f4e8;
  font-family: 'Sketchy', 'Comic Sans MS', cursive;
}

.sketchy-game-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23bbb' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
}

.sketchy-back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}

.sketchy-frame {
  width: 95%;
  height: 85%;
  max-width: 1280px;
  max-height: 800px;
  position: relative;
  border: 3px solid #333;
  border-radius: 12px;
  background-color: white;
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: gentle-float 6s ease-in-out infinite;
}

@keyframes gentle-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.sketchy-frame::before {
  content: "";
  position: absolute;
  top: -8px;
  right: -8px;
  bottom: -8px;
  left: -8px;
  border: 2px dashed #aaa;
  border-radius: 16px;
  z-index: -1;
}

.sketchy-frame-corner {
  position: absolute;
  width: 28px;
  height: 28px;
  background-color: transparent;
  z-index: 5;
}

.top-left {
  top: -8px;
  left: -8px;
  border-top: 4px solid #333;
  border-left: 4px solid #333;
  transform: rotate(-10deg);
}

.top-right {
  top: -8px;
  right: -8px;
  border-top: 4px solid #333;
  border-right: 4px solid #333;
  transform: rotate(10deg);
}

.bottom-left {
  bottom: -8px;
  left: -8px;
  border-bottom: 4px solid #333;
  border-left: 4px solid #333;
  transform: rotate(10deg);
}

.bottom-right {
  bottom: -8px;
  right: -8px;
  border-bottom: 4px solid #333;
  border-right: 4px solid #333;
  transform: rotate(-10deg);
}

.sketchy-iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
  display: block;
}

.sketchy-controls {
  margin-top: 20px;
  display: flex;
  gap: 15px;
}

.sketchy-btn {
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

.sketchy-btn:hover {
  box-shadow: 2px 2px 0 #333;
  transform: translate(2px, 2px);
}

.sketchy-btn:active {
  box-shadow: none;
  transform: translate(4px, 4px);
}

/* 装饰元素 */
.sketchy-decoration {
  position: absolute;
  opacity: 0.4;
  z-index: -1;
}

.dot-1 {
  top: 15%;
  right: 8%;
  width: 50px;
  height: 50px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='15' fill='none' stroke='%23333' stroke-width='2' stroke-dasharray='4,3'/%3E%3C/svg%3E");
  animation: spin 15s linear infinite;
}

.dot-2 {
  bottom: 15%;
  left: 8%;
  width: 70px;
  height: 70px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='25' fill='none' stroke='%23333' stroke-width='2' stroke-dasharray='5,3'/%3E%3C/svg%3E");
  animation: spin 20s linear infinite reverse;
}

.squiggle-1 {
  top: 80%;
  right: 12%;
  width: 120px;
  height: 30px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 30'%3E%3Cpath d='M0,15 Q15,5 30,15 T60,15 T90,15' fill='none' stroke='%23333' stroke-width='2'/%3E%3C/svg%3E");
  animation: float 8s ease-in-out infinite;
}

.squiggle-2 {
  top: 20%;
  left: 12%;
  width: 100px;
  height: 30px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 30'%3E%3Cpath d='M0,15 Q15,25 30,15 T60,15 T90,15' fill='none' stroke='%23333' stroke-width='2'/%3E%3C/svg%3E");
  animation: float 10s ease-in-out infinite;
}

.star {
  bottom: 25%;
  right: 15%;
  width: 60px;
  height: 60px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50'%3E%3Cpath d='M25,1 L31,17 L47,17 L34,28 L40,45 L25,35 L10,45 L16,28 L3,17 L19,17 Z' fill='none' stroke='%23333' stroke-width='2'/%3E%3C/svg%3E");
  animation: pulse 4s ease-in-out infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .sketchy-frame {
    width: 90%;
    height: 75%;
  }
}

@media (max-width: 768px) {
  .sketchy-frame {
    width: 95%;
    height: 70%;
  }

  .sketchy-decoration {
    opacity: 0.2;
  }
}

@media (max-width: 480px) {
  .sketchy-frame {
    width: 95%;
    height: 60%;
    box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.6);
  }

  .sketchy-back-button {
    top: 10px;
    left: 10px;
  }

  .sketchy-controls {
    margin-top: 15px;
  }

  .sketchy-btn {
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>