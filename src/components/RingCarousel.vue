<!-- src/components/RingCarousel.vue -->
<template>
  <div class="ring-wrapper">
    <div class="ring-container"
         @mousedown="startDrag" @mousemove="drag" @mouseup="stopDrag"
         @mouseenter="stopAutoRotation" @mouseleave="startAutoRotation">
      <div class="ring" :style="{ transform: 'rotateY(' + rotation + 'deg)' }">
        <div v-for="(project, index) in projects" :key="index" class="ring-item" :style="itemStyle(index)">
          <RouterLink :to="project.link" class="item-link">
            <div class="item-content">
              <img :src="project.image" alt="Project Image" class="item-image" loading="lazy"/>
              <div class="item-title">{{ project.name }}</div>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
    <!-- 将指示器区域放在外层容器中，使其显示在卡片下方 -->
    <div class="indicator-wrapper">
      <div class="indicators">
        <span v-for="(project, index) in projects" :key="index" class="indicator"
              :class="{ active: index === indicatorActiveIndex }" @click="goToIndex(index)"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { RouterLink } from 'vue-router';
import { useRingRotation } from '@/composables/useRingRotation';

const props = defineProps({
  projects: {
    type: Array,
    required: true
  }
});

const {
  rotation,
  itemStyle,
  startDrag,
  drag,
  stopDrag,
  startAutoRotation,
  stopAutoRotation,
  goToIndex,
  indicatorActiveIndex
} = useRingRotation(props.projects);
</script>

<style scoped>
/* 新增外层包裹容器，保证指示器显示在卡片下方 */
.ring-wrapper {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

/* 环形布局相关样式 */
.ring-container {
  width: 100%;
  height: 500px;
  position: relative;
  perspective: 1000px;
  overflow: hidden;
  cursor: grab;
}

.ring-container:active {
  cursor: grabbing;
}

.ring {
  width: 100%;
  height: 100%;
  position: absolute;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.ring-item {
  position: absolute;
  width: 200px;
  height: 250px;
  left: 50%;
  top: 50%;
  margin: -125px 0 0 -100px;
  transition: transform 0.5s ease, filter 0.5s ease;
}

.item-link {
  text-decoration: none;
  color: inherit;
}

.item-content {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.ring-item:hover .item-content {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.item-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.item-title {
  padding: 0.5rem;
  font-size: 1.2rem;
  color: #333;
}

/* 指示器区域：由于放在 .ring-wrapper 内部，所以自然位于卡片（ring-container）下方 */
.indicator-wrapper {
  margin-top: 0.3rem;
  display: flex;
  justify-content: center;
}

.indicators {
  display: flex;
  gap: 0.5rem;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ccc;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.indicator.active {
  background: #ff9800;
}

.indicator:hover {
  transform: scale(1.2);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .ring-container {
    height: 300px;
  }

  .ring-item {
    width: 120px;
    height: 150px;
    margin: -75px 0 0 -60px;
  }

  .item-image {
    height: 90px;
  }

  .item-title {
    font-size: 1rem;
  }

  .indicator {
    width: 10px;
    height: 10px;
  }
}

@media (pointer: coarse) {
  .ring-container {
    touch-action: pan-y;
  }
}
</style>
