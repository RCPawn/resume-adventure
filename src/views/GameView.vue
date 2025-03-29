<template>
  <div class="game-container">
    <div class="back-button-area">
      <GoBackButton />
    </div>

      <div class="game-frame">
        <iframe ref="gameIframe" :src="gameUrl" class="game-iframe"></iframe>
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
  height: 90vh;
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

.game-frame {
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #f8f8f8;
  justify-content: center;
  align-items: center;
  position: relative;
  border-radius: 12px;
}

.game-iframe {
  border: none;
  border-radius: 8px;
  background-color: #f8f8f8;
  transition: all 0.3s ease;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .game-area {
    width: 95%;
    height: 85%;
  }
}
</style>