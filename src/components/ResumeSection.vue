<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import 'bootstrap-icons/font/bootstrap-icons.css';

const { t, tm } = useI18n();
const activeSection = ref(null);
const sidebarVisible = ref(true); // 新增：控制侧边栏可见性的变量

onMounted(() => {
  // 初始化显示第一个部分
  activeSection.value = 'education';
});

const setActiveSection = (section) => {
  activeSection.value = section;
};

// 新增：切换侧边栏可见性的方法
const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};

const sections = [
  {id: 'education', icon: 'mortarboard-fill', label: t('resume.education.title')},
  {id: 'skills', icon: 'code-slash', label: t('resume.skills.title')},
  {id: 'projects', icon: 'kanban', label: t('resume.projects.title')},
  {id: 'algo', icon: 'graph-up', label: t('resume.algo.title')},
  {id: 'courses', icon: 'book', label: t('resume.courses.title')},
  {id: 'selfLearning', icon: 'lightning', label: t('resume.selfLearning.title')},
  {id: 'softSkills', icon: 'people', label: t('resume.softSkills.title')}
];
</script>

<template>
  <div class="resume-container">
    <!-- 侧边栏，根据 sidebarVisible 状态显示或隐藏 -->
    <div class="resume-sidebar" :class="{ 'sidebar-hidden': !sidebarVisible }">
      <div class="resume-nav">
        <div
            v-for="section in sections"
            :key="section.id"
            class="nav-item"
            :class="{ active: activeSection === section.id }"
            @click="setActiveSection(section.id)"
        >
          <i :class="`bi bi-${section.icon}`"></i>
          <span>{{ section.label }}</span>
        </div>
      </div>
    </div>

    <div class="resume-content">
      <!-- 新增：侧边栏切换按钮 -->
      <div class="sidebar-toggle-button" @click="toggleSidebar">
        <i :class="sidebarVisible ? 'bi bi-chevron-double-left' : 'bi bi-chevron-double-right'"></i>
        <span class="toggle-tooltip">{{ sidebarVisible ? '隐藏菜单' : '显示菜单' }}</span>
      </div>
      <!-- 教育背景 -->
      <div v-if="activeSection === 'education'" class="section">
        <h2 class="section-title">
          <i class="bi bi-mortarboard-fill"></i>
          {{ t('resume.education.title') }}
        </h2>
        <div class="content-scrollable">
          <ul>
            <li v-for="(item, index) in tm('resume.education.items')" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>

      <!-- 专业技能 -->
      <div v-if="activeSection === 'skills'" class="section">
        <h2 class="section-title">
          <i class="bi bi-code-slash"></i>
          {{ t('resume.skills.title') }}
        </h2>
        <div class="content-scrollable">
          <div v-for="(category, index) in tm('resume.skills.categories')" :key="index" class="skill-category">
            <h3 class="category-title">{{ category.name }}</h3>
            <ul>
              <li v-for="(item, itemIndex) in category.items" :key="itemIndex">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 项目经验 -->
      <div v-if="activeSection === 'projects'" class="section">
        <h2 class="section-title">
          <i class="bi bi-kanban"></i>
          {{ t('resume.projects.title') }}
        </h2>
        <div class="content-scrollable">
          <div v-for="(project, index) in tm('resume.projects.items')" :key="index" class="project-item">
            <h3 class="project-title">{{ project.title }}</h3>
            <div class="project-stack">
              <span class="stack-label">{{ t('resume.projects.stackLabel') }}：</span>
              <span class="stack-content">{{ project.stack }}</span>
            </div>
            <div class="project-contributions">
              <h4>{{ t('resume.projects.contributionsLabel') }}：</h4>
              <ul>
                <li v-for="(item, itemIndex) in project.contributions" :key="itemIndex">
                  {{ item }}
                </li>
              </ul>
            </div>
            <div v-if="project.highlight" class="project-highlight">
              <p>{{ project.highlight }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 算法能力 -->
      <div v-if="activeSection === 'algo'" class="section">
        <h2 class="section-title">
          <i class="bi bi-graph-up"></i>
          {{ t('resume.algo.title') }}
        </h2>
        <div class="content-scrollable">
          <ul>
            <li v-for="(item, index) in tm('resume.algo.items')" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>

      <!-- 专业课程 -->
      <div v-if="activeSection === 'courses'" class="section">
        <h2 class="section-title">
          <i class="bi bi-book"></i>
          {{ t('resume.courses.title') }}
        </h2>
        <div class="content-scrollable">
          <ul>
            <li v-for="(item, index) in tm('resume.courses.items')" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>

      <!-- 自学能力 -->
      <div v-if="activeSection === 'selfLearning'" class="section">
        <h2 class="section-title">
          <i class="bi bi-lightning"></i>
          {{ t('resume.selfLearning.title') }}
        </h2>
        <div class="content-scrollable">
          <ul>
            <li v-for="(item, index) in tm('resume.selfLearning.items')" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>

      <!-- 软技能 -->
      <div v-if="activeSection === 'softSkills'" class="section">
        <h2 class="section-title">
          <i class="bi bi-people"></i>
          {{ t('resume.softSkills.title') }}
        </h2>
        <div class="content-scrollable">
          <ul>
            <li v-for="(item, index) in tm('resume.softSkills.items')" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.resume-container {
  display: flex;
  width: 100%;
  max-width: 1200px; /* Making it wider */
  height: 100vh;
  max-height: 1000px;
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.resume-sidebar {
  width: 240px;
  background-color: #f5f5f7;
  padding: 24px 0;
  border-right: 1px solid #e6e6e6;
}

.resume-nav {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 14px 24px;
  margin: 4px 12px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 10px;
  color: #333333;
}

.nav-item:hover {
  background-color: rgba(0, 122, 255, 0.08);
}

.nav-item.active {
  background-color: rgba(0, 122, 255, 0.12);
  color: #007AFF;
  font-weight: 500;
}

.nav-item i {
  margin-right: 12px;
  font-size: 1.2rem;
}

.resume-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 28px 32px;
  background-color: #ffffff;
}

.section {
  display: flex;
  flex-direction: column;
  height: 100%;
  animation: fadeIn 0.4s ease;
}

.content-scrollable {
  flex: 1;
  overflow-y: auto;
  padding-right: 16px;
}

/* 自定义滚动条 - iOS风格 */
.content-scrollable::-webkit-scrollbar {
  width: 8px;
}

.content-scrollable::-webkit-scrollbar-track {
  background: #f5f5f7;
  border-radius: 8px;
}

.content-scrollable::-webkit-scrollbar-thumb {
  background: #d1d1d6;
  border-radius: 8px;
}

.content-scrollable::-webkit-scrollbar-thumb:hover {
  background: #c7c7cc;
}

.section-title {
  color: #1d1d1f;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.section-title i {
  margin-right: 12px;
  color: #007AFF;
}

ul {
  padding-left: 20px;
  list-style-type: none;
}

ul li {
  position: relative;
  margin-bottom: 12px;
  line-height: 1.6;
  color: #333333;
}

ul li::before {
  content: "•";
  position: absolute;
  left: -20px;
  color: #007AFF;
  font-weight: bold;
}

/* 专业技能样式 */
.skill-category {
  margin-bottom: 24px;
}

.category-title {
  color: #333333;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  padding-left: 12px;
  border-left: 3px solid #007AFF;
}

/* 项目经验样式 */
.project-item {
  margin-bottom: 30px;
  padding: 20px;
  border-radius: 12px;
  background-color: #f5f5f7;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

.project-title {
  color: #1d1d1f;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

.project-stack {
  margin-bottom: 16px;
  font-size: 15px;
  color: #515154;
}

.stack-label {
  font-weight: 500;
}

.project-contributions h4 {
  color: #333333;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
}

.project-highlight {
  margin-top: 16px;
  padding: 12px;
  background-color: rgba(0, 122, 255, 0.08);
  border-radius: 8px;
  color: #007AFF;
  font-weight: 500;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .resume-container {
    flex-direction: column;
    height: 85vh;
  }

  .resume-sidebar {
    width: 100%;
    padding: 12px 0;
    border-right: none;
    border-bottom: 1px solid #e6e6e6;
  }

  .resume-nav {
    flex-direction: row;
    overflow-x: auto;
    padding: 0 12px;
  }

  .nav-item {
    padding: 12px;
    margin: 0 4px;
  }

  .nav-item span {
    display: none;
  }

  .nav-item i {
    margin-right: 0;
    font-size: 1.2rem;
  }

  .resume-content {
    padding: 20px;
  }
}
/* 新增：侧边栏切换按钮样式 */
.sidebar-toggle-button {
  position: absolute;
  top: 20px;
  left: 0;
  width: 28px;
  height: 28px;
  background-color: #007AFF;
  color: white;
  border-radius: 0 4px 4px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 10;
}

.sidebar-toggle-button:hover {
  background-color: #0056b3;
  width: 32px;
}

.sidebar-toggle-button i {
  font-size: 14px;
}

.toggle-tooltip {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background-color: #333;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  margin-left: 5px;
}

.sidebar-toggle-button:hover .toggle-tooltip {
  opacity: 1;
  visibility: visible;
}

/* 新增：侧边栏隐藏时的样式 */
.sidebar-hidden {
  margin-left: -240px;
  transition: margin-left 0.3s ease;
}

.resume-sidebar {
  transition: margin-left 0.3s ease;
}

.resume-content {
  transition: padding-left 0.3s ease;
  position: relative;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .sidebar-toggle-button {
    display: none; /* 在移动视图下隐藏此按钮，因为已经是堆叠布局 */
  }
}
</style>
