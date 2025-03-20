<template>
  <section id="gallery" class="gallery-section">
    <!-- Gallery Header -->
    <div class="gallery-header">
      <h2 class="gallery-title">Gallery</h2>
      <p class="gallery-subtitle">Some of my works</p>
    </div>

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
          <img :src="item.imageUrl" :alt="`Gallery image ${idx}`" class="gallery-image" />
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
          <img :src="item.imageUrl" :alt="`Gallery image ${idx}`" class="gallery-image" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

// First row data - larger images
const rowOneItems = [
  { imageUrl: "/images/placeholder.webp" },
  { imageUrl: "/images/placeholder.webp" },
  { imageUrl: "/images/placeholder.webp" },
  { imageUrl: "/images/placeholder.webp" },
  { imageUrl: "/images/placeholder.webp" },
  { imageUrl: "/images/placeholder.webp" },
];

// Second row data - smaller images
const rowTwoItems = [
  { imageUrl: "/images/placeholder.webp" },
  { imageUrl: "/images/placeholder.webp" },
  { imageUrl: "/images/placeholder.webp" },
  { imageUrl: "/images/placeholder.webp" },
  { imageUrl: "/images/placeholder.webp" },
  { imageUrl: "/images/placeholder.webp" },
];

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
/* Base layout - iOS inspired clean design */
.gallery-section {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  overflow: hidden;
  background: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/* Gallery header */
.gallery-header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.gallery-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 3rem;
  text-align: center;
  background: #333;
  -webkit-background-clip: text;
  background-clip: text;
  color: #333;
  letter-spacing: -0.5px;
}

.gallery-subtitle {
  font-size: 1.2rem;
  color: #86868b;
  font-weight: 400;
}

/* Scroll container with increased spacing between rows */
.scroll-container {
  width: 100%;
  overflow: hidden;
  position: relative;
  margin-bottom: 5rem; /* Increased spacing between rows */
}

.scroll-track {
  display: flex;
  will-change: transform;
  transition: transform 0.2s ease-out;
}

/* Row 1 styles - larger cards */
.row-one .gallery-card {
  width: 360px;
  height: 220px;
  margin-right: 24px;
  border-radius: 14px;
}

/* Row 2 styles - smaller cards */
.row-two .gallery-card {
  width: 280px;
  height: 180px;
  margin-right: 20px;
  border-radius: 12px;
}

/* Card base styles - iOS inspired with subtle shadows */
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

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease-out;
}

/* Card hover effects - iOS inspired subtlety */
.gallery-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
}

.gallery-card.scaled {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
}

.gallery-card:hover .gallery-image {
  transform: scale(1.05);
}

/* Animations */
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .gallery-section {
    padding: 3rem 1rem;
  }

  .gallery-header {
    margin-bottom: 2.5rem;
  }

  .gallery-title {
    font-size: 1.8rem;
  }

  .gallery-subtitle {
    font-size: 1rem;
  }

  .scroll-container {
    margin-bottom: 3rem;
  }

  .row-one .gallery-card {
    width: 300px;
    height: 180px;
    margin-right: 16px;
  }

  .row-two .gallery-card {
    width: 220px;
    height: 140px;
    margin-right: 14px;
  }
}

@media (max-width: 480px) {
  .gallery-title {
    font-size: 1.6rem;
  }

  .row-one .gallery-card {
    width: 240px;
    height: 160px;
    margin-right: 12px;
  }

  .row-two .gallery-card {
    width: 180px;
    height: 120px;
    margin-right: 12px;
  }
}
</style>