<template>
  <div class="napkin-container napkin-background" :class="{ 'dark-mode': isDarkMode }">
    <NavBar />
    <HeroSection/>
    <ProjectsSection/>
    <!-- <GallerySection :gallery="gallery" /> -->
    <!-- <AboutSection /> -->
    <!-- <AssistantSection /> -->
    <!-- <FooterSection /> -->
  </div>
</template>

<script setup>
import {ref} from 'vue';
import NavBar from '@/components/NavBar.vue';
import HeroSection from '@/components/HeroSection.vue';
import ProjectsSection from '@/components/ProjectsSection.vue';
import AboutSection from '@/components/AboutSection.vue';
import GallerySection from '@/components/GallerySection.vue';
import AssistantSection from '@/components/AssistantSection.vue';
import FooterSection from '@/components/FooterSection.vue';

</script>

<style>

/* 全局样式 */
/*.napkin-container {
  min-height: 100vh;
  width: 100%;
  position: relative;
}*/
.napkin-container {
  display: flex;
  flex-direction: column;
  gap: 20px; /* 可根据实际需要调整 */
  padding: 1rem; /* 如有需要，也可以统一设置内边距 */
}

:root {
  --global-gap: 20px;
}

.napkin-container {
  display: flex;
  flex-direction: column;
  gap: var(--global-gap);
  padding: 1rem;
}

@media (max-width: 768px) {
  .napkin-container {
    gap: 15px;
  }
}


</style>