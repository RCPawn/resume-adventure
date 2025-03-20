<template>
  <section id="projects" class="projects-showcase">
    <h2 class="showcase-heading">{{ t('projects.title') }}</h2>

    <div class="showcase-container">
      <!-- Navigation arrows -->
      <button class="nav-arrow nav-prev" @click="prevProject" aria-label="Previous project">
        <span class="arrow-icon">&#10094;</span>
      </button>

      <div class="projects-display" ref="projectsContainer">
        <div
            v-for="(project, index) in projects"
            :key="project.name"
            class="project-card"
            :class="{
            'active': activeIndex === index,
            'prev': getPrevIndex() === index,
            'next': getNextIndex() === index,
            'far': !isActiveOrAdjacent(index)
          }"
        >
          <div class="card-inner">
            <div class="project-image-container">
              <img :src="project.image" :alt="project.name" class="project-image"/>
              <div class="image-overlay"></div>
            </div>

            <div class="project-info">
              <span class="project-number">{{ (index + 1).toString().padStart(2, '0') }}</span>
              <h3 class="project-title">{{ project.name }}</h3>
              <p class="project-description">{{ project.description }}</p>

              <div class="project-actions">
                <router-link :to="getProjectLink(index)" class="view-button">
                  <span>{{ t('projects.viewDetails') }}</span>
                  <span class="button-icon">→</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button class="nav-arrow nav-next" @click="nextProject" aria-label="Next project">
        <span class="arrow-icon">&#10095;</span>
      </button>
    </div>

    <!-- Project indicators -->
    <div class="project-indicators">
      <div
          v-for="(project, index) in projects"
          :key="'indicator-' + index"
          class="indicator"
          :class="{ 'active': activeIndex === index }"
          @click="setActiveProject(index)"
      >
        <span class="indicator-label">{{ project.name }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import {ref, onMounted, computed, onBeforeUnmount} from 'vue';
import {useI18n} from 'vue-i18n';
import projectsData from '@/data/projects.json';
import {gsap} from 'gsap';

const {t} = useI18n();

const activeIndex = ref(0);
const projectsContainer = ref(null);
const isScrolling = ref(false);
const scrollTimeout = ref(null);
const touchStartY = ref(0);
const touchStartX = ref(0);

const projects = computed(() => {
  return projectsData.map(project => ({
    name: t(project.nameKey),
    description: t(project.descriptionKey),
    image: project.image,
    link: project.link,
  }));
});

const getPrevIndex = () => {
  return (activeIndex.value - 1 + projects.value.length) % projects.value.length;
};

const getNextIndex = () => {
  return (activeIndex.value + 1) % projects.value.length;
};

const isActiveOrAdjacent = (index) => {
  return index === activeIndex.value ||
      index === getPrevIndex() ||
      index === getNextIndex();
};

const animateProjectChange = () => {
  gsap.fromTo(
      '.project-card.active .project-info',
      {opacity: 0, y: 30},
      {opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.2}
  );

  gsap.fromTo(
      '.project-card.active .project-image',
      {scale: 1.1, opacity: 0.8},
      {scale: 1, opacity: 1, duration: 0.8, ease: 'power1.out'}
  );
};

const setActiveProject = (index) => {
  if (isScrolling.value || index === activeIndex.value) return;

  isScrolling.value = true;
  activeIndex.value = index;

  animateProjectChange();

  clearTimeout(scrollTimeout.value);
  scrollTimeout.value = setTimeout(() => {
    isScrolling.value = false;
  }, 800);
};

const getProjectLink = (index) => {
  return index === 1 ? {path: '/projects/adventure'} : {path: '/coming-soon'};
};

const nextProject = () => {
  setActiveProject(getNextIndex());
};

const prevProject = () => {
  setActiveProject(getPrevIndex());
};

const handleWheel = (e) => {
  if (isScrolling.value) {
    e.preventDefault();
    return;
  }

  e.preventDefault();
  if (e.deltaY > 20) nextProject();
  else if (e.deltaY < -20) prevProject();
};

const handleKeydown = (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    nextProject();
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    prevProject();
  }
};

const handleTouchStart = (e) => {
  touchStartY.value = e.touches[0].clientY;
  touchStartX.value = e.touches[0].clientX;
};

const handleTouchMove = (e) => {
  if (isScrolling.value) {
    e.preventDefault();
    return;
  }

  const touchEndY = e.touches[0].clientY;
  const touchEndX = e.touches[0].clientX;
  const deltaY = touchStartY.value - touchEndY;
  const deltaX = touchStartX.value - touchEndX;

  // Only respond to significant movements
  if (Math.abs(deltaY) > 50 || Math.abs(deltaX) > 50) {
    e.preventDefault();

    // Determine if horizontal or vertical swipe is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 0) nextProject();
      else prevProject();
    } else {
      // Vertical swipe
      if (deltaY > 0) nextProject();
      else prevProject();
    }

    touchStartY.value = 0;
    touchStartX.value = 0;
  }
};

onMounted(() => {
  if (projectsContainer.value) {
    projectsContainer.value.addEventListener('wheel', handleWheel, {passive: false});
    projectsContainer.value.addEventListener('touchstart', handleTouchStart, {passive: true});
    projectsContainer.value.addEventListener('touchmove', handleTouchMove, {passive: false});
  }

  document.addEventListener('keydown', handleKeydown);

  // Initial animation
  animateProjectChange();

  // Add intersection observer for lazy loading
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      gsap.fromTo(
          '.showcase-heading',
          {opacity: 0, y: -30},
          {opacity: 1, y: 0, duration: 0.8, ease: 'power2.out'}
      );

      gsap.fromTo(
          '.project-indicators',
          {opacity: 0, y: 30},
          {opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.3}
      );

      observer.disconnect();
    }
  }, {threshold: 0.2});

  observer.observe(document.querySelector('.projects-showcase'));
});

onBeforeUnmount(() => {
  if (projectsContainer.value) {
    projectsContainer.value.removeEventListener('wheel', handleWheel);
    projectsContainer.value.removeEventListener('touchstart', handleTouchStart);
    projectsContainer.value.removeEventListener('touchmove', handleTouchMove);
  }

  document.removeEventListener('keydown', handleKeydown);
  clearTimeout(scrollTimeout.value);
});
</script>

<style scoped>
.projects-showcase {
  padding: 4rem 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #ffffff;
  color: #333;
  max-width: 1400px;
  margin: 0 auto;
}

.showcase-heading {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 3rem;
  text-align: center;
  background: #333;
  -webkit-background-clip: text;
  background-clip: text;
  color: #333;
  letter-spacing: -0.5px;
}

.showcase-container {
  position: relative;
  display: flex;
  align-items: center;
  height: 600px;
  width: 1000px;
  margin-bottom: 2rem;
}

.projects-display {
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 1000px;
  overflow: hidden;
}

.project-card {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.8s ease;
  visibility: hidden;
  opacity: 0;
  transform: scale(0.8) translateY(100px);
  z-index: 1;
}

.project-card.active {
  visibility: visible;
  opacity: 1;
  transform: scale(1) translateY(0);
  z-index: 5;
}

.project-card.prev {
  visibility: visible;
  opacity: 0.7;
  transform: scale(0.85) translateX(-30%) translateY(5%);
  z-index: 4;
}

.project-card.next {
  visibility: visible;
  opacity: 0.7;
  transform: scale(0.85) translateX(30%) translateY(5%);
  z-index: 3;
}

.project-card.far {
  visibility: hidden;
  opacity: 0;
  transform: scale(0.7) translateY(200px);
  z-index: 1;
}

.card-inner {
  display: flex;
  height: 100%;
  background: linear-gradient(to right, #ffffff, #f7f9fc);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08), 0 5px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.5s ease;
}

.project-card.active .card-inner {
  box-shadow: 0 25px 60px rgba(24, 96, 255, 0.15), 0 10px 30px rgba(39, 69, 190, 0.08);
}

.project-image-container {
  position: relative;
  flex: 1;
  overflow: hidden;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.project-card.active .project-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.4), transparent);
}

.project-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem;
  position: relative;
  overflow: hidden;
}

.project-number {
  position: absolute;
  top: 2rem;
  right: 2rem;
  font-size: 5rem;
  font-weight: 800;
  color: rgba(74, 108, 247, 0.08);
  user-select: none;
}

.project-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  letter-spacing: -0.5px;
  color: #1a202c;
  position: relative;
}

.project-title::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 0;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, rgba(77, 171, 247, 0.7) 0%, rgba(66, 153, 225, 0.7) 100%);
  border-radius: 4px;
}

.project-description {
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 2.5rem;
  color: #4a5568;
  max-width: 90%;
}

.project-actions {
  display: flex;
  align-items: center;
}

.view-button {
  display: flex;
  align-items: center;
  padding: 0.8rem 1.8rem;
  background-color: #fff;
  color: #333;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-shadow: 4px 4px 0 #333;
}

.view-button:hover {
  box-shadow: 2px 2px 0 #333;
  transform: translate(2px, 2px);
}

.button-icon {
  margin-left: 0.5rem;
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.view-button:hover .button-icon {
  transform: translateX(4px);
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  transition: all 0.3s ease;
}

.nav-arrow:hover {
  background: linear-gradient(90deg, rgba(77, 171, 247, 0.7) 0%, rgba(66, 153, 225, 0.7) 100%);
  color: white;
  box-shadow: 0 6px 15px rgba(74, 108, 247, 0.25);
}

.nav-prev {
  left: -25px;
}

.nav-next {
  right: -25px;
}

.arrow-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.project-indicators {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 2rem;
}

.indicator {
  position: relative;
  padding: 0.7rem 1.2rem;
  cursor: pointer;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  color: #4a5568;
  background: #f7f9fc;
  transition: all 0.3s ease;
  overflow: hidden;
}

.indicator::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, rgba(77, 171, 247, 0.7) 0%, rgba(66, 153, 225, 0.7) 100%);
  transition: width 0.3s ease;
}

.indicator:hover {
  background: #edf2f7;
  color: #2d3748;
}

.indicator.active {
  background: #edf2f7;
  color: #1a202c;
  font-weight: 600;
}

.indicator.active::before {
  width: 100%;
}

@media (max-width: 1024px) {
  .showcase-heading {
    font-size: 2.5rem;
  }

  .card-inner {
    flex-direction: column;
  }

  .project-image-container,
  .project-info {
    width: 100%;
  }

  .project-image-container {
    height: 40%;
  }

  .project-info {
    height: 60%;
    padding: 2rem;
  }

  .project-number {
    top: 1rem;
    right: 1rem;
    font-size: 3rem;
  }

  .project-title {
    font-size: 2rem;
  }

  .project-description {
    font-size: 1rem;
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .projects-showcase {
    padding: 3rem 1rem;
  }

  .showcase-container {
    height: 700px;
  }

  .showcase-heading {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .nav-arrow {
    width: 40px;
    height: 40px;
  }

  .nav-prev {
    left: -10px;
  }

  .nav-next {
    right: -10px;
  }

  .indicator {
    padding: 0.5rem 0.8rem;
    font-size: 0.8rem;
  }

  .project-title {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .showcase-container {
    height: 600px;
  }

  .indicator-label {
    display: none;
  }

  .indicator::after {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #a0aec0;
  }

  .indicator.active::after {
    background-color: #4a6cf7;
  }

  .indicator {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .project-title {
    font-size: 1.5rem;
  }

  .project-description {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
}
</style>