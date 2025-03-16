<template>
  <section id="projects" class="ios-projects">
    <h2 class="ios-heading">{{ t('projects.title') }}</h2>
    <div class="ios-showcase-container">
      <div class="ios-indicators">
        <div
            v-for="(project, index) in projects"
            :key="index"
            class="ios-indicator"
            :class="{ active: activeIndex === index }"
            @click="setActiveProject(index)"
        >
          <div class="indicator-dot"></div>
        </div>
      </div>
      <div class="ios-projects-display" ref="projectsContainer" @wheel="handleWheel">
        <div
            v-for="(project, index) in projects"
            :key="project.name"
            class="ios-project-card"
            :class="{ active: activeIndex === index }"
            :style="{ transform: `translateY(${(index - activeIndex) * 100}%)` }"
        >
          <div class="project-content">
            <div class="project-image">
              <img :src="project.image" :alt="project.name" />
            </div>
            <div class="project-info">
              <h3 class="project-title">{{ project.name }}</h3>
              <p class="project-description">{{ project.description }}</p>
              <router-link :to="getProjectLink(index)" class="ios-button">
                {{ t('projects.viewDetails') }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import projectsData from '@/data/projects.json';

const { t } = useI18n();

const activeIndex = ref(0);
const projectsContainer = ref(null);
const isScrolling = ref(false);
const scrollTimeout = ref(null);

const projects = computed(() => {
  return projectsData.map(project => ({
    name: t(project.nameKey),
    description: t(project.descriptionKey),
    image: project.image,
    link: project.link,
  }));
});

const setActiveProject = (index) => {
  if (isScrolling.value) return;
  isScrolling.value = true;
  activeIndex.value = index;
  clearTimeout(scrollTimeout.value);
  scrollTimeout.value = setTimeout(() => {
    isScrolling.value = false;
  }, 800);
};

const getProjectLink = (index) => {
  return index === 1 ? { path: '/projects/adventure' } : { path: '/coming-soon' };
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

const handleWheel = (e) => {
  if (isScrolling.value) return;
  e.preventDefault();
  if (e.deltaY > 0) nextProject();
  else prevProject();
};

onMounted(() => {
  if (projectsContainer.value) {
    projectsContainer.value.addEventListener('wheel', handleWheel, { passive: false });
  }
});

onBeforeUnmount(() => {
  if (projectsContainer.value) {
    projectsContainer.value.removeEventListener('wheel', handleWheel);
  }
  clearTimeout(scrollTimeout.value);
});
</script>

<style scoped>
.ios-projects {
  padding: 2rem 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #000;
}

.ios-heading {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.ios-showcase-container {
  display: flex;
  max-width: 1000px;
  margin: 0 auto;
  height: 600px;
  background: #f2f2f2;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.ios-indicators {
  width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #2c2c2c;
}

.ios-indicator {
  margin: 1rem 0;
  cursor: pointer;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #c7c7cc;
  transition: all 0.3s ease;
}

.ios-indicator.active .indicator-dot {
  background: #007aff;
  transform: scale(1.2);
}

.ios-projects-display {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.ios-project-card {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 2rem;
  transition: transform 0.5s ease;
}

.project-content {
  display: flex;
  height: 100%;
  gap: 2rem;
  align-items: center;
  justify-content: center;
}

.project-image {
  width: 50%;
  height: 80%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.ios-project-card.active .project-info {
  opacity: 1;
}

.project-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.project-description {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.ios-button {
  align-self: flex-start;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  background: #007aff;
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.3s ease;
}

.ios-button:hover {
  background: #0056b3;
}

@media (max-width: 768px) {
  .ios-showcase-container {
    height: 700px;
  }
  .project-content {
    flex-direction: column;
  }
  .project-image {
    width: 100%;
    height: 50%;
  }
  .project-info {
    width: 100%;
  }
}
</style>