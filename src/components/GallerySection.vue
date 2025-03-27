<template>
  <div id="gallery" class="main-container">
    <div class="gallery-viewport">
      <!-- Gallery Header -->
      <div class="gallery-header">
        <h2 class="gallery-title">
          <span class="icon">🖼️</span>{{ t('gallery.title') }}
        </h2>
        <p class="gallery-subtitle">{{ t('gallery.subtitle') }}</p>
      </div>
      <section class="gallery-section">
        <!-- First row - scrolling left -->
        <div class="scroll-container row-one">
          <div
              class="scroll-track"
              :style="{ transform: `translateX(${rowOneScrollPosition}px)` }"
              @mouseenter="pauseAnimation(1)"
              @mouseleave="resumeAnimation(1)"
          >
            <div
                class="gallery-card"
                v-for="(item, idx) in rowOneDuplicated"
                :key="`row1-${idx}`"
                :style="{ animationDelay: `${idx * 0.1}s` }"
                @mouseenter="scaleUp($event)"
                @mouseleave="scaleDown($event)"
            >
              <img :src="item.imageUrl" :alt="`Gallery image ${idx}`" class="gallery-image"/>
            </div>
          </div>
        </div>

        <!-- Second row - scrolling right -->
        <div class="scroll-container row-two">
          <div
              class="scroll-track"
              :style="{ transform: `translateX(${rowTwoScrollPosition}px)` }"
              @mouseenter="pauseAnimation(2)"
              @mouseleave="resumeAnimation(2)"
          >
            <div
                class="gallery-card"
                v-for="(item, idx) in rowTwoDuplicated"
                :key="`row2-${idx}`"
                :style="{ animationDelay: `${idx * 0.1}s` }"
                @mouseenter="scaleUp($event)"
                @mouseleave="scaleDown($event)"
            >
              <img :src="item.imageUrl" :alt="`Gallery image ${idx}`" class="gallery-image"/>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted} from 'vue';
import {useI18n} from 'vue-i18n';

const {t} = useI18n();
// First row data - larger images
const rowOneItems = [
  {imageUrl: "/images/works/0.png"},
  {imageUrl: "/images/works/b1.png"},
  {imageUrl: "/images/works/1.png"},
  {imageUrl: "/images/works/2.png"},
  {imageUrl: "/images/works/b4.png"},
  {imageUrl: "/images/works/b6.png"},
  {imageUrl: "/images/works/b0.png"},
  {imageUrl: "/images/light.png"},
  {imageUrl: "/images/works/b3.png"},
  {imageUrl: "/images/works/3.png"},
  {imageUrl: "/images/works/b1.png"},
  {imageUrl: "/images/works/b2.png"},
  {imageUrl: "/images/github.jpg"},
  {imageUrl: "/images/works/b5.png"},
  {imageUrl: "/images/works/b1.png"},
  {imageUrl: "/images/car.webp"},
  {imageUrl: "/images/works/0.png"},
  {imageUrl: "/images/works/b1.png"},
  {imageUrl: "/images/works/b3.png"},
  {imageUrl: "/images/neural_network.webp"},
  {imageUrl: "/images/works/b6.png"},
  {imageUrl: "/images/works/2.png"},
  {imageUrl: "/images/donut.webp"},
  {imageUrl: "/images/works/b1.png"},
  {imageUrl: "/images/tree.jpg"}
];

// rowTwoItems = rowOneItems.reverse();
const rowTwoItems = [...rowOneItems].reverse();


// Duplicate items for seamless scrolling
const rowOneDuplicated = computed(() => [
  ...rowOneItems,
  ...rowOneItems,
  ...rowOneItems
]);

const rowTwoDuplicated = computed(() => [
  ...rowTwoItems,
  ...rowTwoItems,
  ...rowTwoItems
]);

// Row 1 scrolling logic (left)
const rowOneScrollPosition = ref(0);
const rowOneSpeed = ref(1); // Adjusted for smoother animation
const rowOneBaseSpeed = 1;

// Row 1 dimensions
const rowOneCardWidth = 360;
const rowOneCardGap = 24;
const rowOneSingleSetWidth = computed(() => {
  return rowOneItems.length * (rowOneCardWidth + rowOneCardGap);
});

// Row 2 scrolling logic (right)
const rowTwoScrollPosition = ref(0);
const rowTwoSpeed = ref(1.2);
const rowTwoBaseSpeed = 1.2;

// Row 2 dimensions
const rowTwoCardWidth = 280;
const rowTwoCardGap = 20;
const rowTwoSingleSetWidth = computed(() => {
  return rowTwoItems.length * (rowTwoCardWidth + rowTwoCardGap);
});

// Animation frame
let animationFrameId;

const animate = () => {
  // Row 1: Left scroll
  rowOneScrollPosition.value -= rowOneSpeed.value;
  if (rowOneScrollPosition.value <= -rowOneSingleSetWidth.value) {
    rowOneScrollPosition.value += rowOneSingleSetWidth.value;
  }

  // Row 2: Right scroll
  rowTwoScrollPosition.value += rowTwoSpeed.value;
  if (rowTwoScrollPosition.value >= 0) {
    rowTwoScrollPosition.value -= rowTwoSingleSetWidth.value;
  }

  animationFrameId = requestAnimationFrame(animate);
};

// Hover effects
const pauseAnimation = (row) => {
  if (row === 1) rowOneSpeed.value = 0;
  if (row === 2) rowTwoSpeed.value = 0;
};

const resumeAnimation = (row) => {
  if (row === 1) rowOneSpeed.value = rowOneBaseSpeed;
  if (row === 2) rowTwoSpeed.value = rowTwoBaseSpeed;
};

const scaleUp = (event) => {
  event.currentTarget.classList.add('scaled');
};

const scaleDown = (event) => {
  event.currentTarget.classList.remove('scaled');
};

onMounted(() => {
  // Initialize row positions
  rowTwoScrollPosition.value = -rowTwoSingleSetWidth.value;

  // Start animation
  animationFrameId = requestAnimationFrame(animate);
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
.main-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* 减少内边距，紧凑布局 */
  padding: 2rem 1rem;
  overflow: hidden;
  background-color: #F8F8F8;
}

/* 视口容器：保证横向隐藏溢出，并适当增加上下留白 */
.gallery-viewport {
  width: 100%;
  overflow-x: hidden;
  position: relative;
  padding: 1rem 0;
}

/* 基础布局 */
.gallery-section {
  width: 100%;
  margin: 0 auto;
  padding: 3rem 2rem;
  overflow: hidden;
  background: #F8F8F8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/* Gallery header */
.gallery-header {
  text-align: center;
  margin-bottom: 1rem;
}

/* 新增图标动画样式 */
.icon {
  animation: float 3s ease-in-out infinite;
  display: inline-block;
  transform: translateZ(0);
  filter: drop-shadow(0 2px 5px rgba(255, 235, 100, 0.3));
  will-change: transform;
  margin-right: 0.8rem;
  font-size: 2.5rem;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 保持原有标题样式 */
.gallery-title {
  font-size: 2.5rem;
  font-weight: 700;
  background: #333;
  margin-bottom: 1rem;
  -webkit-background-clip: text;
  background-clip: text;
  color: #333;
  letter-spacing: -0.5px;
  display: inline-flex;
  align-items: center;
}

.gallery-subtitle {
  font-size: 1.1rem;
  color: #666;
  font-weight: 400;
}

/* 滚动容器：使用视口宽度，保证居中显示，并为各行添加适当间距 */
.scroll-container {
  width: 100vw;
  margin: 0 auto 2rem auto; /* 底部增加间距分隔行 */
  transform: translateX(0);
  padding: 1rem 0;
  position: relative;
  overflow: hidden;
}

/* 调整滚动轨道，保持平滑过渡 */
.scroll-track {
  display: flex;
  will-change: transform;
  transition: transform 0.2s ease-out;
}

/* 第一行 - 大卡片 */
.row-one .gallery-card {
  width: 620px;
  height: 400px;
  margin-right: 32px; /* 稍微加大卡片之间的间距 */
  border-radius: 14px;
}

/* 第二行 - 小卡片 */
.row-two .gallery-card {
  width: 280px;
  height: 200px;
  margin-right: 24px; /* 同样调整间距 */
  border-radius: 12px;
}

/* 卡片基础样式 */
.gallery-card {
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  animation: fadeIn 0.8s ease-out forwards;
  background-color: #f5f5f7;
  transform-origin: center;
}

/* 图片样式 */
.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease-out;
}

/* 卡片悬停效果 */
.gallery-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
}

/* 保证每行最后一张卡片不会紧靠屏幕右侧 */
.row-one .gallery-card:last-child,
.row-two .gallery-card:last-child {
  margin-right: calc(100vw - 2rem);
}

/* 渐现动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .gallery-section {
    padding: 2rem 1rem;
  }

  .gallery-header {
    margin-bottom: 2rem;
  }

  .gallery-title {
    font-size: 1.8rem;
  }

  .gallery-subtitle {
    font-size: 1rem;
  }

  .scroll-container {
    padding: 0.8rem 0;
    margin-bottom: 1.5rem;
  }

  .row-one .gallery-card {
    width: 300px;
    height: 180px;
    margin-right: 20px;
  }

  .row-two .gallery-card {
    width: 220px;
    height: 140px;
    margin-right: 18px;
  }
}

@media (max-width: 480px) {
  .gallery-title {
    font-size: 1.6rem;
  }

  .row-one .gallery-card {
    width: 240px;
    height: 160px;
    margin-right: 16px;
  }

  .row-two .gallery-card {
    width: 180px;
    height: 120px;
    margin-right: 14px;
  }
}
</style>
