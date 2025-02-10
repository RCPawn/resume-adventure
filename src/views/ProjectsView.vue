<template>
  <div class="projects-wrapper">
    <!-- 顶部右侧按钮组件 -->
    <TopRightButtons class="top-right-buttons"/>

    <!-- 页面标题 -->
    <h1 class="section-title">My Projects</h1>

    <!-- 根据当前布局显示不同组件 -->
    <MasonryLayout v-if="layoutMode === 'masonry'" :projects="projects"/>
    <RingCarousel v-else :projects="projects"/>

    <!-- 返回按钮 -->
    <GoBackButton/>

    <!-- 布局切换按钮 -->
    <LayoutToggleButton :currentMode="layoutMode" @toggle="toggleLayout"/>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import TopRightButtons from '@/components/TopRightButtons.vue';
import GoBackButton from '@/components/GoBackButton.vue';
import LayoutToggleButton from '@/components/LayoutToggleButton.vue';
import MasonryLayout from '@/components/MasonryLayout.vue';
import RingCarousel from '@/components/RingCarousel.vue';
import projectsData from '@/data/projects.json';

const layoutMode = ref('ring');

const toggleLayout = () => {
  layoutMode.value = layoutMode.value === 'masonry' ? 'ring' : 'masonry';
};

const projects = ref(projectsData);
</script>

<style scoped>
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
</style>
