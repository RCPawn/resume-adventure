<template>
  <div class="ring-wrapper">
    <!-- 顶部右侧按钮组件 -->
    <TopRightButtons class="top-right-buttons" />

    <h1 class="section-title">My Projects</h1>
    <!-- 3D 环形容器 -->
    <div class="ring-container" @mouseenter="stopAutoRotation" @mouseleave="startAutoRotation">
      <!-- 环形整体旋转 -->
      <div class="ring" :style="{ transform: 'rotateY(' + rotation + 'deg)' }">
        <div v-for="(project, index) in projects" :key="index" class="ring-item" :style="itemStyle(index)">
          <RouterLink :to="project.link" class="item-link">
            <div class="item-content">
              <img :src="project.image" alt="Project Image" class="item-image" loading="lazy" />
              <div class="item-title">{{ project.name }}</div>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- 指示器区域 -->
    <div class="indicator-wrapper">
      <div class="indicators">
        <span v-for="(project, index) in projects" :key="index" class="indicator"
          :class="{ active: index === indicatorActiveIndex }" @click="goToIndex(index)"></span>
      </div>
    </div>

    <GoBackButton />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { RouterLink } from 'vue-router';
import GoBackButton from '@/components/GoBackButton.vue';
import TopRightButtons from '@/components/TopRightButtons.vue';

const projects = ref([
  { name: 'My Resume', image: '/images/rcpawn.png', link: '/projects/jeu-de-loie' },
  { name: 'PPT I Made', image: '/images/work.png', link: '/projects/cocolyze' },
  { name: 'Deep Learning', image: '/images/DeepLearning.webp', link: '/projects/dua-lipa' },
  { name: 'Assets Manager', image: '/images/AssetsManager.webp', link: '/projects/act-responsable' },
  { name: 'Resume Adventure', image: '/images/Car.png', link: '/gateway/adventure' }
]);

const rotation = ref(0);
const intervalId = ref(null);
const radius = ref(300);
const isAutoRotating = ref(true);

// 每个卡片旋转步长
const rotationStep = computed(() => 360 / projects.value.length);

// 根据当前旋转角度计算激活的卡片索引（标准化到 [0, 360)）
const activeIndex = computed(() => {
  let normalizedRotation = ((-rotation.value) % 360 + 360) % 360;
  return Math.round(normalizedRotation / rotationStep.value) % projects.value.length;
});

// 指示器激活状态直接等于 activeIndex，起始时 0（最左侧）亮起
const indicatorActiveIndex = computed(() => activeIndex.value);

// 每个卡片的样式，包含 3D 旋转和 translateZ 位移
const itemStyle = (index) => {
  const count = projects.value.length;
  const angle = (360 / count) * index;
  return {
    transform: `rotateY(${angle}deg) translateZ(${radius.value}px)`,
    filter: index === activeIndex.value ? 'brightness(1.2)' : 'brightness(0.9)',
    transition: 'transform 0.5s ease, filter 0.5s ease'
  };
};

// 自动旋转：旋转方向采用减法
const startAutoRotation = () => {
  if (intervalId.value) return;
  isAutoRotating.value = true;
  intervalId.value = setInterval(() => {
    rotation.value -= 0.5;
  }, 30);
};

const stopAutoRotation = () => {
  clearInterval(intervalId.value);
  intervalId.value = null;
  isAutoRotating.value = false;
};

// 点击指示器时，直接跳转到对应的项目索引  
// 使 activeIndex 为 indicatorIndex，即 rotation.value = -indicatorIndex * rotationStep.value
const goToIndex = (indicatorIndex) => {
  stopAutoRotation();
  rotation.value = -indicatorIndex * rotationStep.value;
};

onMounted(() => {
  startAutoRotation();
});

onBeforeUnmount(() => {
  stopAutoRotation();
});
</script>

<style scoped>
.ring-wrapper {
  padding: 2rem;
  background: #f9f9f9;
  min-height: 100vh;
  text-align: center;
  font-family: 'Helvetica Neue', sans-serif;
  position: relative;
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
  border-bottom: 2px solid #ff9800;
  display: inline-block;
  padding-bottom: 0.5rem;
}

.ring-container {
  width: 100%;
  max-width: 800px;
  height: 500px;
  margin: 0 auto;
  position: relative;
  perspective: 1000px;
  overflow: hidden;
  cursor: default;
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

/* 指示器区域 */
.indicator-wrapper {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .ring-container {
    width: 100%;
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

  .indicator-wrapper {
    margin-top: 1rem;
  }

  .indicators {
    flex-wrap: wrap;
    justify-content: center;
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
