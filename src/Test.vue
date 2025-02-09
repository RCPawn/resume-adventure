<template>
  <div class="projects-wrapper">
    <!-- 顶部右侧按钮组件 -->
    <TopRightButtons class="top-right-buttons" />

    <!-- 页面标题 -->
    <h1 class="section-title">My Projects</h1>

    <!-- 根据当前布局显示不同内容 -->
    <div v-if="layoutMode === 'masonry'" class="masonry">
      <div v-for="project in projects" :key="project.name" class="project">
        <img :src="project.image" alt="Project Image" class="project-image" loading="lazy" />
        <!-- 详情覆盖层 -->
        <div class="details">
          <h3 class="project-title">{{ project.name }}</h3>
          <p class="project-description">{{ project.description }}</p>
          <RouterLink :to="project.link" class="view-details">View Details</RouterLink>
        </div>
      </div>
    </div>

    <!-- 环形布局 -->
    <div v-else>
      <!-- 旋转体 -->
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
      <!-- 指示器放在旋转体下方 -->
      <div class="indicator-wrapper">
        <div class="indicators">
          <span v-for="(project, index) in projects" :key="index" class="indicator"
                :class="{ active: index === indicatorActiveIndex }" @click="goToIndex(index)"></span>
        </div>
      </div>
    </div>

    <!-- 返回按钮 -->
    <GoBackButton/>

    <!-- 布局切换浮动按钮 -->
    <button class="toggle-layout-btn" @click="toggleLayout"
            :title="layoutMode === 'masonry' ? '切换为环形布局' : '切换为瀑布流布局'">
      <!-- 当当前为瀑布流时，按钮显示环形图标；反之则显示网格图标 -->
      <svg v-if="layoutMode === 'masonry'" viewBox="0 0 24 24" width="24" height="24" fill="white">
        <!-- 简单的环形图标 -->
        <circle cx="12" cy="12" r="9" stroke="white" stroke-width="2" fill="none"/>
      </svg>
      <svg v-else viewBox="0 0 24 24" width="24" height="24" fill="white">
        <!-- 简单的网格图标 -->
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onBeforeUnmount} from 'vue';
import {RouterLink} from 'vue-router';
import GoBackButton from '@/components/GoBackButton.vue';
import TopRightButtons from '@/components/TopRightButtons.vue';

/**
 * 控制当前展示的布局模式：
 * - 'masonry' 为瀑布流布局；
 * - 'ring' 为环形布局。
 */
const layoutMode = ref('ring');
const toggleLayout = () => {
  layoutMode.value = layoutMode.value === 'masonry' ? 'ring' : 'masonry';
  // 切换到环形布局时启动自动旋转；切换为瀑布流时停止旋转
  if (layoutMode.value === 'ring') {
    startAutoRotation();
  } else {
    stopAutoRotation();
  }
};

// 项目数据，根据六个模块更新了名称、简介、图片及链接
const projects = ref([
  {
    name: '全栈开发 -- 园区资产管理',
    description: '全栈开发项目：园区资产管理系统，集成前后端功能，实现资产信息管理、报表生成、权限管理等功能。',
    image: '/images/work.png',
    link: '/projects/asset-management'
  },
  {
    name: 'Unity -- 简历冒险小游戏',
    description: 'Unity 小游戏项目：简历冒险小游戏，结合互动剧情与动作玩法，生动展示个人技能与创意。',
    image: '/images/Car.png',
    link: '/projects/resume-adventure'
  },
  {
    name: 'Blender -- 3D 互动展示',
    description: 'Blender 项目：利用 3D 建模和渲染技术，创建交互式 3D 展示平台，呈现作品与设计理念。',
    image: '/images/work.png',
    link: '/projects/interactive-3d'
  },
  {
    name: '深度学习 -- PyTorch 学习成果展示',
    description: '深度学习项目：通过 PyTorch 展示模型训练、数据处理与可视化成果，展现对 AI 技术的掌握。',
    image: '/images/work.png',
    link: '/projects/pytorch-demo'
  },
  {
    name: '开源贡献 -- 我的 GitHub 仓库',
    description: '开源贡献：整合并展示我在 GitHub 上的开源项目与代码贡献，彰显技术实力与社区参与。',
    image: '/images/work.png',
    link: '/projects/github'
  },
  {
    name: '我的技能路线图',
    description: '技能路线图：详细展示个人从基础到进阶的技能成长历程，涵盖全栈开发、游戏开发、3D 建模、深度学习等多领域。',
    image: '/images/work.png',
    link: '/projects/skill-map'
  }
]);

/* ------------------------- */
/* 环形布局相关逻辑代码 */
/* ------------------------- */
const rotation = ref(0);
const intervalId = ref(null);
const radius = ref(300);
const isAutoRotating = ref(true);
const initialDragRotation = ref(0);
const initialMouseX = ref(0);

// 每个项目在环形布局中的旋转步长（角度）
const rotationStep = computed(() => 360 / projects.value.length);

// 根据当前旋转值计算处于激活状态的项目索引
const activeIndex = computed(() => {
  let normalizedRotation = ((-rotation.value) % 360 + 360) % 360;
  return Math.round(normalizedRotation / rotationStep.value) % projects.value.length;
});
const indicatorActiveIndex = computed(() => activeIndex.value);

// 根据项目索引计算每个环形项目的位置（使用 rotateY 与 translateZ 实现 3D 环绕效果）
const itemStyle = (index) => {
  const count = projects.value.length;
  const angle = (360 / count) * index;
  return {
    transform: `rotateY(${angle}deg) translateZ(${radius.value}px)`,
    filter: index === activeIndex.value ? 'brightness(1.2)' : 'brightness(0.9)',
    transition: 'transform 0.5s ease, filter 0.5s ease'
  };
};

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

const startDrag = (e) => {
  stopAutoRotation();
  initialDragRotation.value = rotation.value;
  initialMouseX.value = e.clientX;
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
};

const drag = (e) => {
  const deltaX = e.clientX - initialMouseX.value;
  rotation.value = initialDragRotation.value - (deltaX * 0.1);
};

const stopDrag = () => {
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDrag);
  startAutoRotation();
};

const goToIndex = (indicatorIndex) => {
  stopAutoRotation();
  rotation.value = -indicatorIndex * rotationStep.value;
  setTimeout(() => {
    startAutoRotation();
  }, 1000);
};

onMounted(() => {
  if (layoutMode.value === 'ring') {
    startAutoRotation();
  }
});
onBeforeUnmount(() => {
  stopAutoRotation();
});
</script>

<style scoped>
/* 整体页面样式 */
.projects-wrapper {
  padding: 2rem;
  background: #f9f9f9;
  min-height: 100vh;
  font-family: 'Helvetica Neue', sans-serif;
  position: relative;
  text-align: center;
}

.top-right-buttons {
  position: absolute;
  top: 20px;
  right: 20px;
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #333;
  border-bottom: 2px solid #ff9800;
  display: inline-block;
  padding-bottom: 0.5rem;
}

/* ----------------------------- */
/* 布局切换按钮（浮动右下角） */
/* ----------------------------- */
.toggle-layout-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #ff9800;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.toggle-layout-btn:hover {
  background-color: #e68900;
  transform: scale(1.1);
}

/* ----------------------- */
/* 瀑布流布局相关样式 */
/* ----------------------- */
.masonry {
  column-count: 3;
  column-gap: 15px;
}

.project {
  background-color: #fff;
  border-radius: 5px;
  margin-bottom: 15px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.project:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.project-image {
  width: 100%;
  display: block;
  transition: transform 0.3s ease;
}

.project:hover .project-image {
  transform: scale(1.05);
}

.details {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 15px;
  opacity: 0;
  transform: translateY(100%);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.project:hover .details {
  opacity: 1;
  transform: translateY(0);
}

.project-title {
  margin: 0 0 5px;
  font-size: 1.2rem;
}

.project-description {
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.view-details {
  color: #ff9800;
  text-decoration: none;
  font-weight: bold;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.view-details:hover {
  color: #fff;
}

@media (max-width: 1024px) {
  .masonry {
    column-count: 2;
  }
}

@media (max-width: 600px) {
  .masonry {
    column-count: 1;
  }
}

/* ----------------------- */
/* 环形布局相关样式 */
/* ----------------------- */
.ring-container {
  width: 100%;
  max-width: 800px;
  height: 500px;
  margin: 0 auto;
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

/* 指示器区域（放在旋转体下方） */
.indicator-wrapper {
  margin-top: 1rem;
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
