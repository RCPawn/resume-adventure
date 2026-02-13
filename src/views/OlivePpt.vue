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
import { ref, onMounted, onUnmounted, watchEffect } from "vue";
import Reveal from "reveal.js";
import RevealZoom from "reveal.js/plugin/zoom/zoom";
import "reveal.js/dist/reveal.css";
// 移除硬编码的black.css，改用自定义主题
// import "reveal.js/dist/theme/black.css";
import GoBackButton from "@/components/GoBackButton.vue";

const revealRef = ref(null);
let deck = null;
let themeObserver = null;

// 定义亮色/暗色两套背景色数组
const themeColors = {
  light: [
    "#f5f5f5", "#eaeaea", "#f0f7ea", "#e8ede5", "#f8f5ed",
    "#e5ebf0", "#f0e5eb", "#e8f0e5", "#f0eae5", "#e5f0eb",
    "#ebf0e5", "#f0e5ea", "#e5f0ea", "#eaf0e5", "#f0e6e5",
    "#e5eaf0", "#f0e5e8", "#e5f0e8", "#e8e5f0", "#f0e5ef"
  ],
  dark: [
    "#1a1a1a", "#222222", "#2a2a2a", "#333333", "#3a3a3a",
    "#444444", "#4a4a4a", "#555555", "#5a5a5a", "#666666",
    "#6a6a6a", "#777777", "#7a7a7a", "#888888", "#8a8a8a",
    "#999999", "#9a9a9a", "#aa8888", "#88aa88", "#8888aa"
  ]
};

// 过渡效果数组
const transitions = ["slide", "fade", "convex", "concave", "zoom"].flatMap((t) => Array(4).fill(t));

// 获取当前主题对应的背景色
const getBackgroundColor = (index) => {
  const isDark = document.documentElement.classList.contains('dark');
  const colors = isDark ? themeColors.dark : themeColors.light;
  return colors[index % colors.length];
};

const getTransition = (index) => transitions[index % transitions.length];

// 更新Reveal主题样式
const updateRevealTheme = () => {
  if (deck) {
    // 重新设置所有幻灯片的背景色
    deck.getSlides().forEach((slide, index) => {
      slide.setAttribute('data-background-color', getBackgroundColor(index));
    });
    deck.layout(); // 重新布局确保样式生效
  }
};

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
    deck.layout();
    // 初始化时先更新一次主题
    updateRevealTheme();
  });

  // 监听html标签的class变化（主题切换）
  const htmlElement = document.documentElement;
  themeObserver = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      updateRevealTheme();
    });
  });

  themeObserver.observe(htmlElement, {
    attributes: true,
    attributeFilter: ['class']
  });
};

const handleResize = () => {
  if (deck) {
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
  // 销毁观察者
  if (themeObserver) {
    themeObserver.disconnect();
  }
});
</script>

<style scoped>
/* 定义主题切换的过渡动画 */
.presentation-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  /* 主题切换过渡 */
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.reveal {
  width: 100%;
  height: 100%;
  background-color: var(--bg-color);
  transition: background-color 0.3s ease;
}

/* 覆盖Reveal默认控件样式，适配全局主题 */
:deep(.reveal .controls) {
  color: var(--text-color);
  opacity: 0.8;
  transition: color 0.3s ease, opacity 0.3s ease;
}
:deep(.reveal .controls:hover) {
  color: var(--primary-color);
  opacity: 1;
}

:deep(.reveal .progress) {
  color: var(--primary-color);
  transition: color 0.3s ease;
}

:deep(.reveal .slide-number) {
  color: var(--text-color);
  background: rgba(0,0,0,0.1);
  transition: color 0.3s ease, background 0.3s ease;
}
html.dark :deep(.reveal .slide-number) {
  background: rgba(255,255,255,0.1);
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

/* 返回按钮样式 */
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