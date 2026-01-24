<template>
  <div class="presentation-container">
    <!-- 使用封装好的返回按钮组件 -->
    <GoBackButton class="back-button"/>

    <div class="reveal" ref="revealRef">
      <div class="slides">
        <!-- 生成 0-19 的图片 -->
        <section
            v-for="index in 20"
            :key="index - 1"
            :data-background-color="getBackgroundColor(index - 1)"
            :data-transition="getTransition(index - 1)"
        >
          <img
              :src="`/images/olive/${index - 1}.jpg`"
              :alt="`橄榄图片 ${index - 1}`"
              class="slide-image"
          />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Reveal from "reveal.js";
import RevealZoom from "reveal.js/plugin/zoom/zoom";
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/black.css";
import GoBackButton from "@/components/GoBackButton.vue";

const revealRef = ref(null);
let deck = null;

// 背景颜色数组
const backgroundColors = [
  "#f5f5f5", "#eaeaea", "#f0f7ea", "#e8ede5", "#f8f5ed",
  "#e5ebf0", "#f0e5eb", "#e8f0e5", "#f0eae5", "#e5f0eb",
  "#ebf0e5", "#f0e5ea", "#e5f0ea", "#eaf0e5", "#f0e6e5",
  "#e5eaf0", "#f0e5e8", "#e5f0e8", "#e8e5f0", "#f0e5ef"
];

// 过渡效果数组
const transitions = ["slide", "fade", "convex", "concave", "zoom"].flatMap((t) => Array(4).fill(t));

const getBackgroundColor = (index) => backgroundColors[index % backgroundColors.length];
const getTransition = (index) => transitions[index % transitions.length];

const initReveal = () => {
  if (!revealRef.value) return;
  deck = new Reveal(revealRef.value, {
    width: window.innerWidth > 768 ? 1200 : window.innerWidth,
    height: window.innerWidth > 768 ? 700 : window.innerHeight,
    margin: 0.05,
    minScale: 0.2,
    maxScale: 2.0,
    controls: true,
    progress: true,
    center: true,
    hash: false,
    transition: "slide",
    transitionSpeed: "default",
    backgroundTransition: "fade",
    autoAnimateDuration: 1.0,
    autoAnimateEasing: "ease",
    autoSlide: 0,
    loop: true,
    touch: true,
    overview: true,
    plugins: [RevealZoom],
  });

  deck.initialize().then(() => {
    // 强制重新布局以确保第一页居中
    deck.layout();
  });
};

const handleResize = () => {
  if (deck) {
    // 当窗口尺寸变化时，更新 Reveal 尺寸（移动端可能尺寸会发生较大变化）
    deck.configure({
      width: window.innerWidth > 768 ? 1200 : window.innerWidth,
      height: window.innerWidth > 768 ? 700 : window.innerHeight,
    });
    deck.layout();
  }
};

onMounted(() => {
  initReveal();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  if (deck) {
    deck.destroy();
  }
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.presentation-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
}

.reveal {
  width: 100%;
  height: 100%;
  background-color: var(--bg-color);
}

/* 幻灯片图片样式优化 */
.slide-image {
  max-width: 90%;
  max-height: 80vh;
  border-radius: 8px;
  box-shadow: var(--hover-shadow);
  transition: all 0.3s ease;
  display: block;
  margin: auto;
  border: 1px solid var(--border-color);
}

.slide-image:hover {
  transform: scale(1.02);
  box-shadow: var(--hover-shadow);
}

/* 使用已有的返回按钮组件 */
.back-button {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .presentation-container {
    height: 100vh;
    border: none;
  }

  .reveal {
    width: 100%;
    height: 100%;
  }

  .slide-image {
    max-width: 95%;
    max-height: 70vh;
    border-radius: 6px;
  }
}
</style>
