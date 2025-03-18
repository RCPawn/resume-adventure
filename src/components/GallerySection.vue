<template>
  <section id="gallery" class="gallery-section">
    <!-- 标题与说明文字 -->
    <h2 class="gallery-title">Gallery</h2>
    <p class="gallery-subtitle">Here are a few visuals created on Napkin</p>

    <!-- 第一行（大卡片） - 向左滚动 -->
    <div class="scroll-container row-one">
      <div
          class="scroll-track"
          :style="{ transform: `translateX(${rowOneScrollPosition}px)` }"
      >
        <div
            class="gallery-card"
            v-for="(item, idx) in rowOneDuplicated"
            :key="`row1-${idx}`"
        >
          <img
              :src="item.imageUrl"
              :alt="item.title"
              class="gallery-image"
          />
          <div class="gallery-content">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 第二行（小卡片） - 向右滚动 -->
    <div class="scroll-container row-two">
      <div
          class="scroll-track"
          :style="{ transform: `translateX(${rowTwoScrollPosition}px)` }"
      >
        <div
            class="gallery-card"
            v-for="(item, idx) in rowTwoDuplicated"
            :key="`row2-${idx}`"
        >
          <img
              :src="item.imageUrl"
              :alt="item.title"
              class="gallery-image"
          />
          <div class="gallery-content">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

/*
  ======================
   1. 第一行数据
  ======================
*/
const rowOneItems = [
  {
    title: "Implement Robotics",
    description: "Transform manufacturing with robotics",
    imageUrl: "/images/placeholder.webp"
  },
  {
    title: "Credit Score",
    description: "An overview of credit components",
    imageUrl: "/images/placeholder.webp"
  },
  {
    title: "Hydrogen Fuel",
    description: "Future energy solutions at a glance",
    imageUrl: "/images/placeholder.webp"
  },
  {
    title: "National Distribution",
    description: "A global user distribution chart",
    imageUrl: "/images/placeholder.webp"
  },
];

/*
  ======================
   2. 第二行数据
  ======================
*/
const rowTwoItems = [
  {
    title: "Different Metaphors",
    description: "Exploring metaphors for interviews",
    imageUrl: "/images/placeholder.webp"
  },
  {
    title: "Automated Testing",
    description: "Next-gen testing pipelines",
    imageUrl: "/images/placeholder.webp"
  },
  {
    title: "Social Media Insights",
    description: "Analyzing engagement across platforms",
    imageUrl: "/images/placeholder.webp"
  },
  {
    title: "VR/AR Overview",
    description: "Trends in immersive technologies",
    imageUrl: "/images/placeholder.webp"
  },
];

/*
  ======================
   3. 数据重复 - 无缝滚动
  ======================
   多倍复制，避免滚动时出现空白
*/
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

/*
  ======================
   4. 第一行滚动逻辑
  ======================
   - 向左滚动 => scrollPosition 递减
   - 若 <= -单组宽度 => 加回单组宽度
*/
const rowOneScrollPosition = ref(0);
const rowOneSpeed = 2; // 可自行调整速度

/* 第一行卡片宽度和间距，需要与CSS中 row-one .gallery-card 保持一致 */
const rowOneCardWidth = 360;
const rowOneCardGap = 24;
const rowOneSingleSetWidth = computed(() => {
  return rowOneItems.length * (rowOneCardWidth + rowOneCardGap);
});

/*
  ======================
   5. 第二行滚动逻辑
  ======================
   - 向右滚动 => scrollPosition 递增
   - 一开始设为 -单组宽度，这样一开始就能看到“中间那组”，不会左边空白
   - 若 >= 0 => 减去单组宽度
*/
const rowTwoScrollPosition = ref(0);
const rowTwoSpeed = 2; // 可自行调整速度

/* 第二行卡片宽度和间距，需要与CSS中 row-two .gallery-card 保持一致 */
const rowTwoCardWidth = 280;
const rowTwoCardGap = 20;
const rowTwoSingleSetWidth = computed(() => {
  return rowTwoItems.length * (rowTwoCardWidth + rowTwoCardGap);
});

/*
  ======================
   6. 动画循环
  ======================
   同一个动画帧里同时更新两行滚动位置
*/
let animationFrameId;
const animate = () => {
  // 第一行：向左滚动
  rowOneScrollPosition.value -= rowOneSpeed;
  if (rowOneScrollPosition.value <= -rowOneSingleSetWidth.value) {
    rowOneScrollPosition.value += rowOneSingleSetWidth.value;
  }

  // 第二行：向右滚动
  rowTwoScrollPosition.value += rowTwoSpeed;
  if (rowTwoScrollPosition.value >= 0) {
    rowTwoScrollPosition.value -= rowTwoSingleSetWidth.value;
  }

  animationFrameId = requestAnimationFrame(animate);
};

onMounted(() => {
  // 让第二行一开始就从「-单组宽度」处开始，避免左边空白
  rowTwoScrollPosition.value = -rowTwoSingleSetWidth.value;

  animationFrameId = requestAnimationFrame(animate);
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
/* ======================
   1. 整体布局
   ====================== */
.gallery-section {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  text-align: center;
}

.gallery-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.gallery-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

/* ======================
   2. 通用滚动容器
   ====================== */
.scroll-container {
  width: 100%;
  overflow: hidden;
  position: relative;
  margin-bottom: 3rem; /* 两行之间留一些间距 */
}

/* 滚动轨道，不加 transition，瞬时回退 */
.scroll-track {
  display: flex;
  will-change: transform;
}

/* ======================
   3. 第一行 (row-one)
   ======================
   - 卡片更大
   - 与 JS 中 rowOneCardWidth、rowOneCardGap 保持一致
*/
.row-one .gallery-card {
  width: 360px;        /* JS: rowOneCardWidth */
  margin-right: 24px;  /* JS: rowOneCardGap */
}

/* ======================
   4. 第二行 (row-two)
   ======================
   - 卡片更小
   - 与 JS 中 rowTwoCardWidth、rowTwoCardGap 保持一致
*/
.row-two .gallery-card {
  width: 280px;        /* JS: rowTwoCardWidth */
  margin-right: 20px;  /* JS: rowTwoCardGap */
}

/* ======================
   5. 卡片样式
   ====================== */
.gallery-card {
  flex-shrink: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: left; /* 卡片内部左对齐 */
}

.gallery-image {
  width: 100%;
  height: 180px; /* 可自行调整图片高度 */
  object-fit: cover;
}

.gallery-content {
  padding: 1rem;
}

.gallery-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.gallery-content p {
  margin: 0;
  color: #555;
  font-size: 0.95rem;
}

/* ======================
   6. 响应式
   ====================== */
@media (max-width: 768px) {
  .row-one .gallery-card {
    width: 300px;
    margin-right: 16px;
  }
  .row-two .gallery-card {
    width: 220px;
    margin-right: 12px;
  }
  .gallery-image {
    height: 140px;
  }
}
</style>
