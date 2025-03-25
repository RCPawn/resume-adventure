<script setup>
import {ref, onMounted, computed, nextTick} from 'vue';
import {useI18n} from 'vue-i18n';
import projectsData from '@/data/projects.json';
import {gsap} from 'gsap';
import {
  SparklesIcon,
  RocketIcon,
  CodeIcon,
  BrainIcon
} from 'lucide-vue-next';

const {t} = useI18n();

const activeIndex = ref(0);

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

const setActiveProject = (index) => {
  activeIndex.value = index;
  animateProjectChange();
};

const animateProjectChange = () => {
  // Smooth, subtle animations for project transitions
  gsap.fromTo(
      '.project-card.active .project-info',
      {opacity: 0, y: 20},
      {opacity: 1, y: 0, duration: 0.5, ease: 'power2.out'}
  );

  gsap.fromTo(
      '.project-card.active .project-image',
      {scale: 0.95, opacity: 0.7},
      {scale: 1, opacity: 1, duration: 0.7, ease: 'power1.inOut'}
  );
};

const icons = {
  spark: SparklesIcon,
  rocket: RocketIcon,
  code: CodeIcon,
  brain: BrainIcon
};

onMounted(async () => {
  animateProjectChange();
  await nextTick();
});
</script>

<template>
  <div class="main-container">
    <div class="usecases-nav">
      <div class="sticky-header">
        <h1 class="gradient-text">Use Cases</h1>
      </div>
    </div>

    <div class="projects-list">
      <div
          v-for="(project, index) in projects"
          :key="project.name"
          class="project-card"
          :class="{
          'active': activeIndex === index,
          'prev': getPrevIndex() === index,
          'next': getNextIndex() === index
        }"
          @click="setActiveProject(index)"
      >
        <div class="project-image-container">
          <img :src="project.image" :alt="project.name" class="project-image"/>
        </div>
        <div class="project-info">
          <span class="project-number">{{ (index + 1).toString().padStart(2, '0') }}</span>
          <h3 class="project-title">{{ project.name }}</h3>
          <p class="project-description">{{ project.description }}</p>
          <router-link v-if="project.link" :to="project.link" class="project-link">
            View Details →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --bg-primary: #f0f4f8;
  --text-primary: #1a2b3b;
  --accent-color: #007bff;
  --card-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.main-container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-primary) 0%, #ffffff 100%);
  padding: 2rem;
  box-sizing: border-box;
}

.usecases-nav {
  width: 35%;
  padding: 2rem;
  position: relative;
}

.sticky-header {
  position: sticky;
  top: 10rem;
  z-index: 10;
  margin-bottom: 2rem;
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
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  opacity: 0.6;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.project-card.active {
  opacity: 1;
  transform: scale(1.03);
  box-shadow: var(--card-shadow);
}

.project-image-container {
  width: 55%;
}

.project-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  object-fit: cover;
  transition: transform 0.4s ease;
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

.project-link {
  display: inline-block;
  color: var(--accent-color);
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.project-link:hover {
  color: #0056b3;
}
</style>