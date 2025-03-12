<template>
  <section id="gallery" class="napkin-section gallery-section">
    <h2 class="napkin-heading-secondary animation-slide-up">{{ t('gallery.title') }}</h2>
    <div class="napkin-gallery-container animation-fade-in" style="animation-delay: 0.2s;">
      <div class="napkin-gallery-background">
        <div class="napkin-gallery-gradient"></div>
      </div>
      <div class="napkin-gallery-scroller">
        <div v-for="(item, index) in gallery" :key="index"
             class="napkin-gallery-item"
             :style="{ animationDelay: `${index * 0.1}s` }">
          <div class="napkin-image-container">
            <img :src="item.src" :alt="item.alt" class="napkin-image"/>
            <div class="napkin-image-overlay"></div>
          </div>
          <div class="napkin-gallery-overlay">
            <h4>{{ item.title }}</h4>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
      <div class="napkin-gallery-controls">
        <button class="napkin-gallery-btn prev" @click="scrollGallery('left')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button class="napkin-gallery-btn next" @click="scrollGallery('right')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const gallery = ref([
  {
    src: '/assets/gallery1.jpg',
    alt: '3D Render',
    title: '3D建模作品',
    description: '使用Blender创建的科幻场景'
  },
  {
    src: '/assets/gallery2.jpg',
    alt: 'Web Design',
    title: '网页设计',
    description: '响应式电商网站设计'
  },
  {
    src: '/assets/gallery3.jpg',
    alt: 'Game Screenshot',
    title: '游戏截图',
    description: 'Unity开发的冒险游戏'
  },
  {
    src: '/assets/gallery4.jpg',
    alt: 'Mobile App',
    title: '移动应用',
    description: '多功能生产力应用'
  },
  {
    src: '/assets/gallery5.jpg',
    alt: 'UI Design',
    title: 'UI设计',
    description: '现代化界面设计系统'
  }
])

const scrollGallery = (direction) => {
  const scroller = document.querySelector('#gallery .napkin-gallery-scroller')
  const scrollAmount = scroller.clientWidth * 0.7
  if (direction === 'left') {
    scroller.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
  } else {
    scroller.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, { threshold: 0.1 })
  const els = document.querySelectorAll('#gallery .animation-slide-up, #gallery .animation-fade-in, #gallery .napkin-gallery-item')
  els.forEach(el => observer.observe(el))
})
</script>

<style scoped>
.gallery-section {
  padding: 8rem 2rem;
  position: relative;
  overflow: hidden;
}

.napkin-gallery-container {
  position: relative;
  width: 100%;
  margin-top: 3rem;
  height: 350px;
}

.napkin-gallery-background {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: var(--radius-lg);
}

.napkin-gallery-gradient {
  position: absolute;
  width: 100%;
  height: 100%;
  background: var(--gradient-card);
  opacity: 0.8;
}

.napkin-gallery-scroller {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding: 2rem;
  position: relative;
  z-index: 2;
  height: 100%;
  scroll-snap-type: x mandatory;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.napkin-gallery-scroller::-webkit-scrollbar {
  display: none;
}

.napkin-gallery-item {
  flex: 0 0 300px;
  height: 100%;
  scroll-snap-align: start;
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: var(--transition-spring);
  transform: scale(0.95);
  opacity: 0;
  animation: fadeIn 0.5s ease forwards, float 6s ease-in-out infinite;
  animation-play-state: paused;
}

.napkin-gallery-item:hover {
  transform: scale(1) translateY(-10px);
  box-shadow: var(--shadow-lg);
  z-index: 3;
}

.napkin-image-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.napkin-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition);
}

.napkin-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0.3) 50%,
      rgba(0, 0, 0, 0) 100%
  );
}

.napkin-gallery-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1.5rem;
  color: white;
  z-index: 2;
}

.napkin-gallery-overlay h4 {
  font-family: var(--font-secondary);
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.napkin-gallery-overlay p {
  font-size: 0.9rem;
  opacity: 0.9;
}

.napkin-gallery-controls {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  transform: translateY(-50%);
  z-index: 3;
  pointer-events: none;
}

.napkin-gallery-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  pointer-events: auto;
}

.napkin-gallery-btn svg {
  width: 20px;
  height: 20px;
  stroke: var(--color-text);
}

.napkin-gallery-btn:hover {
  background: var(--color-primary);
  transform: scale(1.1);
}

.napkin-gallery-btn:hover svg {
  stroke: white;
}
</style>
