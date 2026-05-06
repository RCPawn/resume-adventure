<template>
  <div class="presentation-container" ref="containerRef">
    <GoBackButton />

    <div class="reveal" ref="revealRef">
      <div class="slides">
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
            decoding="async"
            @load="onSlideMediaLoad"
          />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import Reveal from 'reveal.js';
import RevealZoom from 'reveal.js/plugin/zoom/zoom';
import 'reveal.js/dist/reveal.css';
import GoBackButton from '@/components/GoBackButton.vue';

const containerRef = ref(null);
const revealRef = ref(null);
let deck = null;
let themeObserver = null;
let resizeObserver = null;
let mediaLayoutTimer = null;
let resizeLayoutTimer = null;

/** Reveal 依赖容器真实尺寸；首帧或路由切换后需延后/在尺寸变化时再次 layout，否则会出现幻灯片贴底、上半屏空白或封面只显示一半。 */
const scheduleLayout = () => {
  if (!deck) return;
  requestAnimationFrame(() => {
    deck.layout();
  });
};

const onSlideMediaLoad = () => {
  if (mediaLayoutTimer) clearTimeout(mediaLayoutTimer);
  mediaLayoutTimer = setTimeout(() => {
    mediaLayoutTimer = null;
    scheduleLayout();
  }, 80);
};

/** 以演示容器为准计算 Reveal 设计宽高，避免固定 1200×700 与外层 dvh 不一致导致缩放错位 */
const getDeckSize = () => {
  const el = containerRef.value;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (el && el.clientWidth >= 280 && el.clientHeight >= 280) {
    return {
      width: Math.floor(el.clientWidth),
      height: Math.floor(el.clientHeight),
    };
  }
  if (vw <= 768) {
    return { width: Math.floor(vw), height: Math.floor(vh) };
  }
  return { width: Math.floor(vw), height: Math.floor(vh) };
};

const themeColors = {
  light: [
    '#f5f5f5', '#eaeaea', '#f0f7ea', '#e8ede5', '#f8f5ed',
    '#e5ebf0', '#f0e5eb', '#e8f0e5', '#f0eae5', '#e5f0eb',
    '#ebf0e5', '#f0e5ea', '#e5f0ea', '#eaf0e5', '#f0e6e5',
    '#e5eaf0', '#f0e5e8', '#e5f0e8', '#e8e5f0', '#f0e5ef',
  ],
  dark: [
    '#1a1a1a', '#222222', '#2a2a2a', '#333333', '#3a3a3a',
    '#444444', '#4a4a4a', '#555555', '#5a5a5a', '#666666',
    '#6a6a6a', '#777777', '#7a7a7a', '#888888', '#8a8a8a',
    '#999999', '#9a9a9a', '#aa8888', '#88aa88', '#8888aa',
  ],
};

const transitions = ['slide', 'fade', 'convex', 'concave', 'zoom'].flatMap((t) => Array(4).fill(t));

const getBackgroundColor = (index) => {
  const isDark = document.documentElement.classList.contains('dark');
  const colors = isDark ? themeColors.dark : themeColors.light;
  return colors[index % colors.length];
};

const getTransition = (index) => transitions[index % transitions.length];

const updateRevealTheme = () => {
  if (deck) {
    deck.getSlides().forEach((slide, index) => {
      slide.setAttribute('data-background-color', getBackgroundColor(index));
    });
    deck.layout();
  }
};

const flushLayoutPasses = () => {
  scheduleLayout();
  setTimeout(scheduleLayout, 50);
  setTimeout(scheduleLayout, 200);
  setTimeout(scheduleLayout, 500);
};

const initReveal = () => {
  if (!revealRef.value) return;

  const { width, height } = getDeckSize();

  deck = new Reveal(revealRef.value, {
    width,
    height,
    margin: 0.05,
    minScale: 0.2,
    maxScale: 2.0,
    controls: true,
    progress: true,
    center: true,
    hash: false,
    transition: 'slide',
    transitionSpeed: 'default',
    backgroundTransition: 'fade',
    autoAnimateDuration: 1.0,
    autoAnimateEasing: 'ease',
    autoSlide: 0,
    loop: true,
    touch: true,
    overview: true,
    plugins: [RevealZoom],
  });

  deck.initialize().then(async () => {
    scheduleLayout();
    await nextTick();
    scheduleLayout();
    requestAnimationFrame(() => {
      requestAnimationFrame(scheduleLayout);
    });
    flushLayoutPasses();
    updateRevealTheme();

    if (typeof ResizeObserver !== 'undefined' && containerRef.value) {
      resizeObserver = new ResizeObserver(() => {
        if (resizeLayoutTimer) clearTimeout(resizeLayoutTimer);
        resizeLayoutTimer = setTimeout(() => {
          resizeLayoutTimer = null;
          if (!deck || !containerRef.value) return;
          const next = getDeckSize();
          deck.configure({ width: next.width, height: next.height });
          scheduleLayout();
        }, 100);
      });
      resizeObserver.observe(containerRef.value);
    }
  });

  const htmlElement = document.documentElement;
  themeObserver = new MutationObserver(() => {
    updateRevealTheme();
  });

  themeObserver.observe(htmlElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
};

const handleResize = () => {
  if (!deck) return;
  const { width, height } = getDeckSize();
  deck.configure({ width, height });
  scheduleLayout();
};

onMounted(async () => {
  await nextTick();
  requestAnimationFrame(() => {
    initReveal();
  });
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  if (mediaLayoutTimer) clearTimeout(mediaLayoutTimer);
  if (resizeLayoutTimer) clearTimeout(resizeLayoutTimer);
  if (deck) {
    deck.destroy();
    deck = null;
  }
  window.removeEventListener('resize', handleResize);
  if (themeObserver) {
    themeObserver.disconnect();
    themeObserver = null;
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});
</script>

<style scoped>
.presentation-container {
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  position: relative;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.reveal {
  position: absolute;
  inset: 0;
  width: auto;
  height: auto;
  background-color: var(--bg-color);
  transition: background-color 0.3s ease;
}

/* 每页内容在 section 内居中，避免仅用 vh 与 Reveal 缩放坐标系不一致导致裁切/只露半张 */
:deep(.reveal .slides > section) {
  box-sizing: border-box;
  display: flex !important;
  align-items: center;
  justify-content: center;
}

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
  background: rgba(0, 0, 0, 0.1);
  transition: color 0.3s ease, background 0.3s ease;
}
html.dark :deep(.reveal .slide-number) {
  background: rgba(255, 255, 255, 0.1);
}

.slide-image {
  display: block;
  margin: auto;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: var(--hover-shadow);
  border: 1px solid var(--border-color);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

@media (prefers-reduced-motion: no-preference) {
  .slide-image:hover {
    transform: scale(1.02);
    box-shadow: var(--hover-shadow);
  }
}

@media (max-width: 768px) {
  .presentation-container {
    border: none;
  }

  .slide-image {
    border-radius: 6px;
  }
}
</style>
