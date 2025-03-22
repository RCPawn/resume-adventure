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
              :src="`/images/olive/${index - 1}.png`"
              :alt="`橄榄图片 ${index - 1}`"
              class="slide-image"
          />
        </section>
      </div>
    </div>

    <!-- 贴近图片底部的导航指示器 -->
    <div class="navigation-indicator" ref="navIndicator">
      {{ currentSlide + 1 }} / 20
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, nextTick, watch} from "vue";
import Reveal from "reveal.js";
import RevealZoom from "reveal.js/plugin/zoom/zoom";
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/black.css";
import GoBackButton from "@/components/GoBackButton.vue";

// 引用
const revealRef = ref(null);
const navIndicator = ref(null);
const currentSlide = ref(0);
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

// 获取背景颜色
const getBackgroundColor = (index) => backgroundColors[index % backgroundColors.length];

// 获取过渡效果
const getTransition = (index) => transitions[index % transitions.length];

// Reveal.js 初始化
const initReveal = () => {
  if (!revealRef.value) return;

  deck = new Reveal(revealRef.value, {
    width: 1200,
    height: 700,
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
    deck.on("ready", () => {
      updateSlidePosition(); // 确保初始化后更新导航指示器
    });

    deck.on("slidechanged", (event) => {
      currentSlide.value = event.indexh;
      updateSlidePosition();
    });

    updateSlidePosition();
  });
};

// 更新导航指示器的位置
const updateSlidePosition = () => {
  nextTick(() => {
    requestAnimationFrame(() => {
      const img = document.querySelector(".reveal .slides section.present img");
      if (img && navIndicator.value) {
        const rect = img.getBoundingClientRect();
        navIndicator.value.style.top = `${rect.bottom + 10}px`;
      }
    });
  });
};

// 监听窗口大小调整，防止不居中
const handleResize = () => {
  if (deck) {
    deck.layout();
    requestAnimationFrame(updateSlidePosition);
  }
};

// 组件挂载
onMounted(() => {
  initReveal();
  window.addEventListener("resize", handleResize);
});

// 组件卸载
onUnmounted(() => {
  if (deck) {
    deck.destroy();
  }
  window.removeEventListener("resize", handleResize);
});

// 监听当前幻灯片变化，调整导航指示器
watch(currentSlide, updateSlidePosition);
</script>

<style scoped>
.presentation-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.reveal {
  height: 100%;
}

/* 幻灯片图片样式优化 */
.slide-image {
  max-width: 90%;
  max-height: 80vh;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  display: block;
  margin: auto;
}

.slide-image:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* 使用已有的返回按钮组件 */
.back-button {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
}

/* 导航指示器，自动放置在图片下方 */
.navigation-indicator {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  white-space: nowrap;
  transition: top 0.3s ease;
}
</style>
