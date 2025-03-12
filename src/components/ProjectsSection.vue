<template>
  <section id="projects" class="napkin-projects">
    <h2 class="napkin-heading animation-slide-up">{{ t('projects.title') }}</h2>

    <!-- 垂直滑动项目展示区 -->
    <div class="napkin-showcase-container" ref="showcaseContainer">
      <!-- 左侧导航指示器 -->
      <div class="napkin-indicators">
        <div
            v-for="(project, index) in projects"
            :key="index"
            class="napkin-indicator"
            :class="{ active: activeIndex === index }"
            @click="setActiveProject(index)"
        >
          <div class="indicator-dot"></div>
          <div v-if="index < projects.length - 1" class="indicator-line"></div>
        </div>

        <!-- 手绘装饰元素 -->
        <div class="napkin-arrow napkin-arrow-top">
          <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 10C8 4 16 2 22 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="napkin-arrow napkin-arrow-bottom">
          <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2C8 8 16 10 22 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
      </div>

      <!-- 项目内容区 -->
      <div class="napkin-projects-display" ref="projectsContainer" @wheel="handleWheel">
        <div
            v-for="(project, index) in projects"
            :key="project.name"
            class="napkin-project-card"
            :class="{ active: activeIndex === index }"
            :style="{ transform: `translateY(${(index - activeIndex) * 100}%)` }"
        >
          <div class="project-content">
            <!-- 项目图片 -->
            <div class="project-image">
              <img :src="project.image" :alt="project.name">
              <div class="image-corner"></div>
              <div class="image-pin"></div>
            </div>

            <!-- 项目信息 -->
            <div class="project-info">
              <h3 class="project-title">{{ project.name }}</h3>
              <p class="project-description">{{ project.description }}</p>
              <router-link :to="getProjectLink(index)" class="napkin-button">
                {{ t('projects.viewDetails') }}
                <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 6H19M19 6L14 1M19 6L14 11" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round"/>
                </svg>
              </router-link>
            </div>
          </div>
        </div>

        <!-- 导航按钮 -->
        <div class="napkin-nav-buttons">
          <button @click="prevProject" class="napkin-nav-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round"/>
            </svg>
          </button>
          <button @click="nextProject" class="napkin-nav-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {ref, onMounted, computed, onBeforeUnmount} from 'vue';
import {useI18n} from 'vue-i18n';
// 根据你的项目配置调整导入路径
import projectsData from '@/data/projects.json';

const {t, locale} = useI18n();

const activeIndex = ref(0);
const projectsContainer = ref(null);
const showcaseContainer = ref(null);
const isScrolling = ref(false);
const scrollTimeout = ref(null);

// 通过 i18n 处理 JSON 文件中配置的 key 值
const projects = computed(() => {
  return projectsData.map(project => ({
    name: t(project.nameKey),
    description: t(project.descriptionKey),
    image: project.image,
    link: project.link
  }));
});

// 设置当前激活项目
const setActiveProject = (index) => {
  if (isScrolling.value) return;
  isScrolling.value = true;
  activeIndex.value = index;
  clearTimeout(scrollTimeout.value);
  scrollTimeout.value = setTimeout(() => {
    isScrolling.value = false;
  }, 800);
};

// 获取项目链接 - 仅索引为1的项目使用原始链接，其他项目使用 "/coming-soon"
const getProjectLink = (index) => {
  if (index === 1) {
    return { path: "/projects/adventure" };
  }
  return { path: "/coming-soon" };
};

const nextProject = () => {
  if (isScrolling.value) return;
  const nextIndex = (activeIndex.value + 1) % projects.value.length;
  setActiveProject(nextIndex);
};

const prevProject = () => {
  if (isScrolling.value) return;
  const prevIndex = (activeIndex.value - 1 + projects.value.length) % projects.value.length;
  setActiveProject(prevIndex);
};

// 处理鼠标滚轮事件
const handleWheel = (e) => {
  if (isScrolling.value) return;
  e.preventDefault();
  if (e.deltaY > 0) {
    nextProject();
  } else {
    prevProject();
  }
};

// 添加键盘导航
const handleKeyNavigation = (e) => {
  if (e.key === 'ArrowUp') {
    prevProject();
  } else if (e.key === 'ArrowDown') {
    nextProject();
  }
};

// 检查组件是否在视口内以触发动画
const checkVisibility = () => {
  if (!showcaseContainer.value) return;
  const rect = showcaseContainer.value.getBoundingClientRect();
  const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
  if (isVisible) {
    document.querySelector('.napkin-heading').classList.add('visible');
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyNavigation);
  window.addEventListener('scroll', checkVisibility);
  setTimeout(checkVisibility, 100);
  if (projectsContainer.value) {
    projectsContainer.value.addEventListener('wheel', handleWheel, {passive: false});
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyNavigation);
  window.removeEventListener('scroll', checkVisibility);
  if (projectsContainer.value) {
    projectsContainer.value.removeEventListener('wheel', handleWheel);
  }
  clearTimeout(scrollTimeout.value);
});
</script>

<style scoped>
/* Napkin手绘风格组件 */
.napkin-projects {
  padding: 3rem 2rem 5rem;
  font-family: 'Inter', sans-serif;
  position: relative;
  margin-top: -2rem; /* 减少与上方组件的距离 */
  --napkin-primary: #ffffff; /* 主色 */
  --napkin-secondary: #f1f1f1; /* 次要色 */
  --napkin-accent: #333333; /* 强调色 */
  --napkin-shadow: rgba(0, 0, 0, 0.15);
  color: var(--napkin-accent);
}

.napkin-heading {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
  text-align: center;
  position: relative;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: 'Comic Sans MS', cursive, sans-serif; /* 增加手绘风格 */
  letter-spacing: 1px;
}

.napkin-heading.visible {
  opacity: 1;
  transform: translateY(0);
}

.napkin-heading::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: var(--napkin-accent);
  border-radius: 3px;
  /* 手绘风格的波浪线 */
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='3' viewBox='0 0 100 3' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 1.5C5 0.5 10 2.5 15 1.5C20 0.5 25 2.5 30 1.5C35 0.5 40 2.5 45 1.5C50 0.5 55 2.5 60 1.5C65 0.5 70 2.5 75 1.5C80 0.5 85 2.5 90 1.5C95 0.5 100 2.5 105 1.5' stroke='%23333333' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

/* Updated background - replaced checkerboard with paper texture */
.napkin-showcase-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  height: 650px; /* 增加高度，更好地展示图片 */
  position: relative;
  background: var(--napkin-primary);
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23f1f1f1' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E"),
  linear-gradient(to bottom, #ffffff, #fcfcfc);
  border: 2px solid var(--napkin-accent);
  border-radius: 12px;
  box-shadow: 8px 8px 0 var(--napkin-shadow);
  overflow: hidden;
}

.napkin-showcase-container::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border: 1px dashed var(--napkin-accent);
  border-radius: 8px;
  pointer-events: none;
  opacity: 0.3;
}

/* 左侧指示器 */
.napkin-indicators {
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-right: 2px dashed rgba(0, 0, 0, 0.2);
  padding: 2rem 0;
  background: rgba(255, 255, 255, 0.6);
}

.napkin-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.indicator-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--napkin-accent);
  background: transparent;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 2px 2px 0 var(--napkin-shadow);
}

.napkin-indicator.active .indicator-dot {
  background: var(--napkin-accent);
  transform: scale(1.3);
}

.indicator-line {
  width: 2px;
  height: 30px;
  border-left: 2px dashed var(--napkin-accent);
  margin-top: 4px;
  opacity: 0.6;
}

.napkin-arrow {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: var(--napkin-accent);
  opacity: 0.7;
}

.napkin-arrow-top {
  top: 15px;
  animation: bounceUp 2s infinite;
}

.napkin-arrow-bottom {
  bottom: 15px;
  animation: bounceDown 2s infinite;
}

@keyframes bounceUp {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-5px);
  }
}

@keyframes bounceDown {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(5px);
  }
}

/* 项目展示区 */
.napkin-projects-display {
  flex: 1;
  position: relative;
  overflow: hidden;
  cursor: ns-resize; /* 添加滚动光标提示 */
}

/* Updated project card styles */
.napkin-project-card {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* Add more padding at the top */
  padding: 4rem 2rem 2rem;
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

/* Updated project content for better vertical centering */
.project-content {
  display: flex;
  height: 100%;
  gap: 2.5rem;
  padding: 1.5rem;
  align-items: center;
  justify-content: center; /* Ensure horizontal centering */
  transform: translateY(-5%); /* Move content up slightly */
}

/* Updated project image styles */
.project-image {
  width: 45%; /* Slightly reduced width */
  height: 75%; /* Slightly reduced from 80% */
  margin-top: -2rem; /* Move up a bit */
  position: relative;
  border: 3px solid var(--napkin-accent);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 6px 6px 0 var(--napkin-shadow);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  transform: rotate(-1deg); /* 略微倾斜，增加手绘感 */
}

.napkin-project-card.active .project-image {
  transform: rotate(-1deg) scale(1.02);
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 保持图片比例填充容器 */
  transition: transform 1.2s ease;
}

.napkin-project-card.active .project-image img {
  transform: scale(1.05);
}

.image-corner {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 25px;
  height: 25px;
  border-top: 3px solid var(--napkin-accent);
  border-right: 3px solid var(--napkin-accent);
  transform: rotate(45deg) translate(8px, -8px);
}

.image-pin {
  position: absolute;
  top: 15px;
  left: 15px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--napkin-accent);
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

/* 添加额外的大头针 */
.project-image::after {
  content: '';
  position: absolute;
  bottom: 15px;
  right: 15px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--napkin-accent);
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

/* Updated project info styles */
.project-info {
  flex: 1;
  margin-top: -2rem; /* Move up to match the image */
  max-height: 75%; /* Control maximum height */
  overflow-y: auto; /* Add scrolling if needed */
  display: flex;
  flex-direction: column;
  opacity: 0;
  transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid var(--napkin-accent);
  box-shadow: 4px 4px 0 var(--napkin-shadow);
  position: relative;
  background: rgba(255, 255, 255, 0.7) repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.03) 1px, transparent 1px, transparent 30px);
  transform: rotate(1deg); /* 与图片反向倾斜 */
}

/* 添加手绘装饰 */
.project-info::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 20px;
  width: 40px;
  height: 20px;
  background: var(--napkin-primary);
  border: 2px solid var(--napkin-accent);
  border-bottom: none;
  border-radius: 50% 50% 0 0;
  transform: rotate(-5deg);
  z-index: -1;
}

.napkin-project-card.active .project-info {
  opacity: 1;
  transform: translateY(0) rotate(1deg);
}

.project-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.75rem;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  color: var(--napkin-accent);
}

.project-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 80px;
  height: 3px;
  background: var(--napkin-accent);
  border-radius: 2px;
  opacity: 0.7;
  /* 手绘下划线 */
  background-image: url("data:image/svg+xml,%3Csvg width='80' height='3' viewBox='0 0 80 3' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 1.5C4 0.5 8 2.5 12 1.5C16 0.5 20 2.5 24 1.5C28 0.5 32 2.5 36 1.5C40 0.5 44 2.5 48 1.5C52 0.5 56 2.5 60 1.5C64 0.5 68 2.5 72 1.5C76 0.5 80 2.5 84 1.5' stroke='%23333333' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.project-description {
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 2.5rem;
  flex: 1;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  font-style: italic;
  letter-spacing: 0.5px;
}

.napkin-button {
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.75rem;
  border: 2.5px solid var(--napkin-accent);
  border-radius: 30px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  color: var(--napkin-accent);
  background: var(--napkin-primary);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 4px 4px 0 var(--napkin-shadow);
  font-family: 'Comic Sans MS', cursive, sans-serif;
  border-color: var(--napkin-accent);
}

.napkin-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--napkin-accent);
  opacity: 0.1;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.napkin-button:hover {
  transform: translate(-4px, -4px);
  box-shadow: 8px 8px 0 var(--napkin-shadow);
}

.napkin-button:hover::before {
  transform: translateX(0);
}

/* Updated navigation buttons position */
.napkin-nav-buttons {
  position: absolute;
  top: 1rem; /* Move up slightly */
  right: 1.5rem;
  display: flex;
  gap: 1rem;
  z-index: 5;
}

.napkin-nav-button {
  width: 48px;
  height: 48px;
  border: 2px solid var(--napkin-accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--napkin-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--napkin-accent);
  box-shadow: 3px 3px 0 var(--napkin-shadow);
}

.napkin-nav-button:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: scale(1.1) rotate(5deg);
  box-shadow: 5px 5px 0 var(--napkin-shadow);
}

/* 添加滚动提示 */
.napkin-projects-display::after {
  content: '';
  position: absolute;
  bottom: 20px;
  left: 95%;
  transform: translateX(-50%);
  width: 36px;
  height: 60px;
  border: 3px solid var(--napkin-accent);
  border-radius: 18px;
  opacity: 0.5;
  animation: fadeInOut 2s infinite;
  pointer-events: none;
}

.napkin-projects-display::before {
  content: '';
  position: absolute;
  bottom: 50px;
  left: 95%;
  transform: translateX(-50%);
  width: 8px;
  height: 12px;
  background: var(--napkin-accent);
  border-radius: 4px;
  opacity: 0.5;
  animation: scrollDown 2s infinite;
  z-index: 1;
  pointer-events: none;
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes scrollDown {
  0% {
    transform: translateY(-10px) translateX(-50%);
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(20px) translateX(-50%);
    opacity: 0;
  }
}

/* 响应式布局 */
@media (max-width: 1024px) {
  .napkin-showcase-container {
    height: 700px;
  }

  .project-content {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    transform: translateY(-3%);
  }

  .project-image,
  .project-info {
    margin-top: -1rem;
  }

  .project-image {
    width: 85%;
    height: 50%;
  }

  .project-info {
    width: 90%;
  }

  .napkin-project-card {
    padding-top: 3rem;
  }
}

@media (max-width: 768px) {
  .napkin-showcase-container {
    height: 750px;
  }

  .napkin-heading {
    font-size: 2.2rem;
  }

  .project-content {
    transform: translateY(-2%);
  }

  .project-image {
    width: 100%;
    height: 45%;
  }

  .project-title {
    font-size: 1.6rem;
  }

  .project-description {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  .napkin-button {
    padding: 0.7rem 1.4rem;
    font-size: 0.95rem;
  }

  .napkin-project-card {
    padding-top: 2rem;
  }
}

@media (max-width: 480px) {
  .napkin-showcase-container {
    height: 650px;
  }

  .napkin-indicators {
    width: 60px;
  }

  .project-content {
    padding: 0.75rem;
  }

  .project-image {
    height: 40%;
  }

  .napkin-nav-buttons {
    top: auto;
    bottom: 1rem;
    right: 1rem;
  }

  .napkin-nav-button {
    width: 40px;
    height: 40px;
  }
}
</style>