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

      <!-- 原来的模态框 -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" :class="{'mobile-modal': isMobile}" @click.stop>
          <button class="close-button" @click="closeModal">×</button>
          <SkillTarget/>
        </div>
      </div>

      <!-- 天气模态框 -->
      <WeatherModal
          :show="showWeatherModal"
          :isMobile="isMobile"
          @close="closeWeatherModal"
      />

    </div>

  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import {useRouter, useRoute} from 'vue-router';
import projectsData from '@/data/projects.json';
import SkillTarget from '@/components/TargetWindow.vue';
import WeatherModal from '@/components/WeatherModel.vue'; // 导入天气组件

const {t, tm} = useI18n();
const router = useRouter();
const route = useRoute(); // 获取当前路由
const showModal = ref(false);
const showWeatherModal = ref(false); // 天气模态框状态
const activeIndex = ref(0);
const isMobile = ref(false);

// 监听路由变化，检测是否需要显示天气弹窗
watch(() => route.path, (newPath) => {
  if (newPath === '/weather') {
    showWeatherModal.value = true;
  }
}, { immediate: true });

// 检测设备类型
const checkDeviceType = () => {
  isMobile.value = window.innerWidth <= 768;
};

// 监听窗口大小变化
onMounted(() => {
  checkDeviceType();
  window.addEventListener('resize', checkDeviceType);

  // 初始化时检查是否在天气路径
  if (route.path === '/weather') {
    showWeatherModal.value = true;
  }
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
  } else if (project.link === '/weather') {
    showWeatherModal.value = true; // 打开天气模态框
  } else if (project.link) {
    router.push(project.link);
  }
};

const closeModal = () => {
  showModal.value = false;
};

const closeWeatherModal = () => {
  showWeatherModal.value = false;
  // 返回上一个路由，如果是直接访问 /weather
  if (route.path === '/weather') {
    router.push('/');
  }
};

</script>

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
