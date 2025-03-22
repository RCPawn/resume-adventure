<template>
  <div class="game-container">
    <div class="back-button-area">
      <GoBackButton />
    </div>

    <div class="game-area">
      <div class="game-frame">
        <iframe ref="gameIframe" :src="gameUrl" class="game-iframe"></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import GoBackButton from "@/components/GoBackButton.vue";

const gameUrl = ref('/WebGL Builds/index.html');
const gameIframe = ref(null);

// 调整游戏尺寸，确保最佳显示效果
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
  background-color: #f5f5f5;
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
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.game-iframe {
  border: none;
  border-radius: 8px;
  background-color: #fff;
  transition: all 0.3s ease;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .game-area {
    width: 95%;
    height: 85%;
  }
}
</style>