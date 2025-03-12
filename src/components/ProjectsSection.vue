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
            <path d="M2 10C8 4 16 2 22 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </div>
        <div class="napkin-arrow napkin-arrow-bottom">
          <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2C8 8 16 10 22 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </div>
      </div>

      <!-- 项目内容区 -->
      <div class="napkin-projects-display" ref="projectsContainer" @wheel="handleWheel">
        <div
            v-for="(project, index) in projects"
            :key="project.name"
            class="napkin-project-card"
            :class="{ 'active': activeIndex === index }"
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
              <a :href="project.link" class="napkin-button">
                {{ t('projects.viewDetails') }}
                <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 6H19M19 6L14 1M19 6L14 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- 导航按钮 -->
        <div class="napkin-nav-buttons">
          <button @click="prevProject" class="napkin-nav-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button @click="nextProject" class="napkin-nav-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const activeIndex = ref(0);
const projectsContainer = ref(null);
const showcaseContainer = ref(null);
const isScrolling = ref(false);
const scrollTimeout = ref(null);

// 从i18n中获取项目数据
const projects = computed(() => {
  // 这里应该从i18n文件中获取项目数据
  // 注意：实际使用时应该替换为从i18n中获取的数据
  return [
    {
      "name": t('projects.items.0.name'),
      "description": t('projects.items.0.description'),
      "image": "/images/skillmap.webp",
      "link": "/coming-soon"
    },
    {
      "name": t('projects.items.1.name'),
      "description": t('projects.items.1.description'),
      "image": "/images/Car.png",
      "link": "/projects/adventure"
    },
    {
      "name": t('projects.items.2.name'),
      "description": t('projects.items.2.description'),
      "image": "/images/donuts.png",
      "link": "/coming-soon"
    },
    {
      "name": t('projects.items.3.name'),
      "description": t('projects.items.3.description'),
      "image": "/images/skillmap.webp",
      "link": "/coming-soon"
    },
    {
      "name": t('projects.items.4.name'),
      "description": t('projects.items.4.description'),
      "image": "/images/github.webp",
      "link": "/projects/github"
    },
    {
      "name": t('projects.items.5.name'),
      "description": t('projects.items.5.description'),
      "image": "/images/skillmap.webp",
      "link": "/coming-soon"
    }
  ];
});

// 设置当前项目
const setActiveProject = (index) => {
  if (isScrolling.value) return;

  isScrolling.value = true;
  activeIndex.value = index;

  // 添加过渡结束后的防抖
  clearTimeout(scrollTimeout.value);
  scrollTimeout.value = setTimeout(() => {
    isScrolling.value = false;
  }, 800); // 略长于过渡时间
};

// 下一个项目
const nextProject = () => {
  if (isScrolling.value) return;

  const nextIndex = (activeIndex.value + 1) % projects.value.length;
  setActiveProject(nextIndex);
};

// 上一个项目
const prevProject = () => {
  if (isScrolling.value) return;

  const prevIndex = (activeIndex.value - 1 + projects.value.length) % projects.value.length;
  setActiveProject(prevIndex);
};

// 处理鼠标滚轮事件
const handleWheel = (e) => {
  if (isScrolling.value) return;

  // 防止滚动事件传播
  e.preventDefault();

  // 确定滚动方向
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

// 检查组件是否在视口内
const checkVisibility = () => {
  if (!showcaseContainer.value) return;

  const rect = showcaseContainer.value.getBoundingClientRect();
  const isVisible =
      rect.top < window.innerHeight &&
      rect.bottom > 0;

  if (isVisible) {
    document.querySelector('.napkin-heading').classList.add('visible');
  }
};

// 监听组件可见性，触发动画
onMounted(() => {
  window.addEventListener('keydown', handleKeyNavigation);
  window.addEventListener('scroll', checkVisibility);

  // 初始检查可见性
  setTimeout(checkVisibility, 100);

  // 添加滚动事件监听
  if (projectsContainer.value) {
    projectsContainer.value.addEventListener('wheel', handleWheel, { passive: false });
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
}

.napkin-heading {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
  text-align: center;
  position: relative;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
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
  width: 80px;
  height: 3px;
  background: currentColor;
  border-radius: 3px;
}

.napkin-showcase-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  height: 500px; /* 增加高度以提供更多内容展示空间 */
  position: relative;
  background: repeating-linear-gradient(45deg, rgba(255,255,255,0.03), rgba(255,255,255,0.03) 10px, rgba(0,0,0,0.01) 10px, rgba(0,0,0,0.01) 20px);
  border: 2px solid;
  border-radius: 12px;
  box-shadow: 6px 6px 0 rgba(0,0,0,0.1);
  overflow: hidden;
}

.napkin-showcase-container::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border: 1px dashed rgba(0,0,0,0.1);
  border-radius: 8px;
  pointer-events: none;
}

/* 左侧指示器 */
.napkin-indicators {
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-right: 2px dashed rgba(0,0,0,0.1);
  padding: 2rem 0;
}

.napkin-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0.75rem 0;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.indicator-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid;
  background: transparent;
  transition: all 0.3s ease;
  position: relative;
}

.napkin-indicator.active .indicator-dot {
  background: currentColor;
  transform: scale(1.3);
}

.indicator-line {
  width: 2px;
  height: 30px;
  border-left: 2px dashed;
  margin-top: 4px;
}

.napkin-arrow {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.napkin-arrow-top {
  top: 15px;
}

.napkin-arrow-bottom {
  bottom: 15px;
}

/* 项目展示区 */
.napkin-projects-display {
  flex: 1;
  position: relative;
  overflow: hidden;
  cursor: ns-resize; /* 添加滚动光标提示 */
}

.napkin-project-card {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 2rem;
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); /* 更流畅的动画曲线 */
  will-change: transform; /* 性能优化 */
}

.project-content {
  display: flex;
  height: 100%;
  gap: 2rem;
  padding: 1rem;
}

.project-image {
  width: 40%;
  position: relative;
  border: 2px solid;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 4px 4px 0 rgba(0,0,0,0.1);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.napkin-project-card.active .project-image {
  transform: scale(1.02);
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.2s ease;
}

.napkin-project-card.active .project-image img {
  transform: scale(1.05);
}

.image-corner {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  border-top: 2px solid;
  border-right: 2px solid;
  transform: rotate(45deg) translate(10px, -10px);
}

.image-pin {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 1px 1px 0 rgba(0,0,0,0.3);
}

.project-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.napkin-project-card.active .project-info {
  opacity: 1;
  transform: translateY(0);
}

.project-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.project-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 2px;
  background: currentColor;
  border-radius: 2px;
}

.project-description {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  flex: 1;
}

.napkin-button {
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  color: inherit;
  background: transparent;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 3px 3px 0 rgba(0,0,0,0.1);
}

.napkin-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: currentColor;
  opacity: 0.1;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.napkin-button:hover {
  transform: translate(-3px, -3px);
  box-shadow: 6px 6px 0 rgba(0,0,0,0.1);
}

.napkin-button:hover::before {
  transform: translateX(0);
}

/* 导航按钮 */
.napkin-nav-buttons {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
}

.napkin-nav-button {
  width: 40px;
  height: 40px;
  border: 2px solid;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.napkin-nav-button:hover {
  background: rgba(0,0,0,0.05);
  transform: scale(1.1);
}

/* 添加滚动提示 */
.napkin-projects-display::after {
  content: '';
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 50px;
  border: 2px solid currentColor;
  border-radius: 15px;
  opacity: 0.5;
  animation: fadeInOut 2s infinite;
  pointer-events: none;
}

.napkin-projects-display::before {
  content: '';
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 10px;
  background: currentColor;
  border-radius: 3px;
  opacity: 0.5;
  animation: scrollDown 2s infinite;
  z-index: 1;
  pointer-events: none;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.7; }
}

@keyframes scrollDown {
  0% { transform: translateY(-5px) translateX(-50%); opacity: 0; }
  50% { opacity: 0.5; }
  100% { transform: translateY(15px) translateX(-50%); opacity: 0; }
}

/* 响应式布局 */
@media (max-width: 768px) {
  .napkin-showcase-container {
    height: 600px;
  }

  .project-content {
    flex-direction: column;
  }

  .project-image {
    width: 100%;
    height: 200px;
    margin-bottom: 1rem;
  }
}
</style>