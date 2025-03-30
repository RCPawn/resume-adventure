<script setup>
import {ref, computed, onMounted} from 'vue';
import {useI18n} from 'vue-i18n';
import {useRouter} from 'vue-router';
import projectsData from '@/data/projects.json';
import SkillTarget from '@/components/TargetWindow.vue';

const {t, tm} = useI18n();
const router = useRouter();
const showModal = ref(false);
const activeIndex = ref(0);
const isMobile = ref(false);

// 检测设备类型
const checkDeviceType = () => {
  isMobile.value = window.innerWidth <= 768;
};

// 监听窗口大小变化
onMounted(() => {
  checkDeviceType();
  window.addEventListener('resize', checkDeviceType);
});

const projects = computed(() => {
  return projectsData.map(project => ({
    name: t(project.nameKey),
    description: t(project.descriptionKey),
    image: project.image,
    link: project.link,
    icon: project.icon
  }));
});

const getPrevIndex = () => {
  return (activeIndex.value - 1 + projects.value.length) % projects.value.length;
};

const getNextIndex = () => {
  return (activeIndex.value + 1) % projects.value.length;
};

const handleProjectClick = (project) => {
  if (project.link === '/roadmap') {
    showModal.value = true;
  } else if (project.link) {
    router.push(project.link);
  }
};

const closeModal = () => {
  showModal.value = false;
};

// 用于移动端的滑动功能
const touchStartX = ref(0);
const touchEndX = ref(0);

const handleTouchStart = (e) => {
  touchStartX.value = e.changedTouches[0].screenX;
};

const handleTouchEnd = (e) => {
  touchEndX.value = e.changedTouches[0].screenX;
  handleSwipe();
};

const handleSwipe = () => {
  const swipeThreshold = 50;
  if (touchEndX.value < touchStartX.value - swipeThreshold) {
    // 左滑
    activeIndex.value = getNextIndex();
  } else if (touchEndX.value > touchStartX.value + swipeThreshold) {
    // 右滑
    activeIndex.value = getPrevIndex();
  }
};

// 移动端切换项目
const navigateProject = (direction) => {
  if (direction === 'next') {
    activeIndex.value = getNextIndex();
  } else {
    activeIndex.value = getPrevIndex();
  }
};
</script>

<template>
  <div id="projects" class="projects-container">
    <div class="main-container" :class="{'mobile-layout': isMobile}">
      <!-- 标题部分 -->
      <div class="usecases-nav" :class="{'mobile-header': isMobile}">
        <div class="sticky-header">
          <h1 class="gradient-text">📜{{ t('projects.title') }}</h1>
          <p class="subtitle">{{ t('projects.subtitle') }}</p>
          <div class="decoration-dots"></div>
        </div>
      </div>

      <!-- 项目列表 - 桌面视图 -->
      <div v-if="!isMobile" class="projects-list">
        <div
            v-for="(project, index) in projects"
            :key="project.name"
            class="project-card"
            :class="{
              'active': activeIndex === index,
              'prev': getPrevIndex() === index,
              'next': getNextIndex() === index
            }"
            @click="handleProjectClick(project)"
        >
          <div class="project-image-container">
            <img :src="project.image" :alt="project.name" class="project-image"/>
            <div class="project-overlay"></div>
          </div>
          <div class="project-info">
            <span class="project-number">{{ (index + 1).toString().padStart(2, '0') }}</span>
            <h3 class="project-title">{{ project.name }}</h3>
            <p class="project-description">{{ project.description }}</p>
          </div>
        </div>
      </div>

      <!-- 项目列表 - 移动视图 (卡片滑动) -->
      <div v-else class="mobile-projects-carousel"
           @touchstart="handleTouchStart"
           @touchend="handleTouchEnd">
        <div class="mobile-projects-wrapper" :style="{transform: `translateX(-${activeIndex * 100}%)`}">
          <div
              v-for="(project, index) in projects"
              :key="project.name"
              class="mobile-project-card"
              @click="handleProjectClick(project)"
          >
            <div class="mobile-project-image-container">
              <img :src="project.image" :alt="project.name" class="project-image"/>
              <div class="project-overlay"></div>
            </div>
            <div class="mobile-project-info">
              <span class="project-number">{{ (index + 1).toString().padStart(2, '0') }}</span>
              <h3 class="project-title">{{ project.name }}</h3>
              <p class="project-description">{{ project.description }}</p>
            </div>
          </div>
        </div>

        <!-- 移动端导航控制 -->
        <div class="mobile-navigation">
          <button class="nav-button prev-button" @click.stop="navigateProject('prev')">&lt;</button>
          <div class="mobile-indicators">
            <span v-for="(_, index) in projects"
                  :key="index"
                  class="indicator-dot"
                  :class="{'active': activeIndex === index}">
            </span>
          </div>
          <button class="nav-button next-button" @click.stop="navigateProject('next')">&gt;</button>
        </div>
      </div>

      <!-- 模态框 -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" :class="{'mobile-modal': isMobile}" @click.stop>
          <button class="close-button" @click="closeModal">×</button>
          <SkillTarget/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.projects-container {
  position: relative;
  width: 100%;
}

.main-container {
  position: relative;
  display: flex;
  width: 100%;
  max-width: 1200px;
  margin: 10rem auto;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-primary) 0%, #ffffff 100%);
  padding: 2rem;
  box-sizing: border-box;
  z-index: 99;
}

.usecases-nav {
  width: 35%;
  padding: 2rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sticky-header {
  position: sticky;
  top: 10rem;
  z-index: 10;
  margin-bottom: 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gradient-text {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
  background: #333;
  -webkit-background-clip: text;
  background-clip: text;
  color: #333;
  letter-spacing: -0.5px;
  position: relative;
}

.subtitle {
  font-size: 1.1rem;
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.6;
  position: relative;
  padding: 0 1rem;
}

.subtitle::before,
.subtitle::after {
  content: '';
  position: absolute;
  width: 30px;
  height: 2px;
  background: #666;
  opacity: 0.3;
}

.subtitle::before {
  left: -20px;
  top: 50%;
  transform: translateY(-50%);
}

.subtitle::after {
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
}

.sticky-header::before {
  content: '✨';
  font-size: 1.5rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 2px 5px rgba(255, 235, 100, 0.3));
}

.sticky-header::after {
  content: '';
  position: absolute;
  bottom: -1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 1px;
  background: linear-gradient(90deg,
  transparent 0%,
  rgba(51, 51, 51, 0.1) 20%,
  rgba(51, 51, 51, 0.1) 80%,
  transparent 100%
  );
}

.decoration-dots {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle, #333 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.1;
  pointer-events: none;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.projects-list {
  width: 65%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.project-card {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: #F2F2F2;
  border-radius: 16px;
  padding: 1.5rem;
  transform: translateY(20px);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.project-image-container {
  width: 55%;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.project-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(0.95);
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.15) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .project-image {
  transform: scale(1.05);
  filter: brightness(1);
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.project-info {
  width: 45%;
}

.project-number {
  display: block;
  color: var(--accent-color);
  opacity: 0.7;
  margin-bottom: 0.5rem;
}

.project-title {
  font-size: 1.75rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.project-description {
  color: var(--text-primary);
  opacity: 0.8;
  margin-bottom: 1rem;
}

.modal-overlay {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  border-radius: 24px;
  max-width: 1000px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  z-index: 10000;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: transparent;
}

.modal-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.close-button {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: #333;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.close-button:hover {
  background: #fff;
  color: #000;
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-content {
  animation: modalFadeIn 0.3s ease-out forwards;
}

/* 移动端样式 */
.mobile-layout {
  flex-direction: column;
  margin: 4rem auto;
  min-height: auto;
  padding: 1.5rem;
}

.mobile-header {
  width: 100%;
  padding: 1rem 0 2rem;
}

.mobile-header .sticky-header {
  position: relative;
  top: 0;
}

.mobile-header .gradient-text {
  font-size: 2.2rem;
}

.mobile-header .subtitle {
  font-size: 1rem;
  padding: 0 2rem;
}

/* 移动端轮播样式 */
.mobile-projects-carousel {
  width: 100%;
  overflow: hidden;
  position: relative;
  margin-top: 1rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.mobile-projects-wrapper {
  display: flex;
  transition: transform 0.4s ease;
  width: 100%;
}

.mobile-project-card {
  flex: 0 0 100%;
  width: 100%;
  background: #F7F7F7;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.mobile-project-image-container {
  width: 100%;
  height: 240px;
  overflow: hidden;
  position: relative;
}

.mobile-project-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mobile-project-info {
  padding: 1.5rem;
}

.mobile-project-info .project-title {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

.mobile-project-info .project-description {
  font-size: 0.95rem;
  line-height: 1.5;
}

/* 移动端导航控制 */
.mobile-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 5;
}

.nav-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-button:active {
  transform: scale(0.95);
  background: #f0f0f0;
}

.mobile-indicators {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.indicator-dot.active {
  width: 12px;
  height: 12px;
  background: var(--accent-color, #333);
}

/* 移动端模态框 */
.mobile-modal {
  width: 95%;
  max-height: 90vh;
  border-radius: 18px;
  padding-top: 2.5rem;
}

.mobile-modal .close-button {
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  font-size: 1.2rem;
}

/* 横屏适配 */
@media (max-width: 768px) and (orientation: landscape) {
  .mobile-project-image-container {
    height: 180px;
  }

  .mobile-layout {
    margin: 2rem auto;
  }

  .mobile-header {
    padding: 0.5rem 0 1rem;
  }

  .mobile-navigation {
    padding: 0.5rem 1rem;
  }
}

/* 小屏幕手机优化 */
@media (max-width: 380px) {
  .mobile-header .gradient-text {
    font-size: 1.8rem;
  }

  .mobile-header .subtitle {
    font-size: 0.9rem;
  }

  .mobile-project-image-container {
    height: 200px;
  }

  .mobile-project-info .project-title {
    font-size: 1.3rem;
  }

  .mobile-project-info {
    padding: 1.2rem;
  }

  .nav-button {
    width: 36px;
    height: 36px;
  }
}

/* 项目卡片过渡动画增强 */
.mobile-project-card {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transform: scale(0.98);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.mobile-projects-wrapper:hover .mobile-project-card {
  transform: scale(1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}
</style>