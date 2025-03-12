<template>
  <div class="napkin-container" :class="{ 'dark-mode': isDarkMode }">
    <!-- Top Navigation Bar -->
    <nav class="napkin-nav">
      <div class="napkin-logo">RCPAWN</div>
      <div class="napkin-nav-links">
        <a href="#about" class="napkin-nav-link">{{ $t('nav.about') }}</a>
        <a href="#projects" class="napkin-nav-link">{{ $t('nav.projects') }}</a>
        <a href="#gallery" class="napkin-nav-link">{{ $t('nav.gallery') }}</a>
        <a href="#assistant" class="napkin-nav-link highlight">{{ $t('nav.assistant') }}</a>
      </div>
      `
      <div class="napkin-controls">
        <!-- GitHub Button -->
        <a href="https://github.com/RCPawn?tab=repositories" target="_blank" class="napkin-control-btn github">
          <svg viewBox="0 0 24 24" class="napkin-icon">
            <path fill="currentColor"
                  d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
          </svg>
          <span>GitHub</span>
        </a>

        <!-- Language Toggle -->
        <button @click="toggleLanguage" class="napkin-control-btn language">
          <svg viewBox="0 0 24 24" class="napkin-icon">
            <path fill="currentColor"
                  d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-2.5-13.5h5M9.5 7v9M14.5 7v9M8 10.5c0 4.5 3.5 6.5 8 6.5M16 7.5c0 4.5-3.5 6.5-8 6.5"></path>
          </svg>
          <span>{{ locale === 'cn' ? 'EN' : '中' }}</span>
        </button>

        <!-- Theme Toggle -->
        <button @click="toggleTheme" class="napkin-control-btn theme">
          <svg v-if="!isDarkMode" viewBox="0 0 24 24" class="napkin-icon">
            <path fill="currentColor"
                  d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2a7 7 0 1 1 0-14 7 7 0 0 1 0 14zM12 5V3M12 21v-2M4.22 6.22 5.64 7.64M18.36 16.36l1.42 1.42M3 12h2M19 12h2M4.22 17.78l1.42-1.42M18.36 7.64l1.42-1.42"></path>
          </svg>
          <svg v-else viewBox="0 0 24 24" class="napkin-icon">
            <path fill="currentColor"
                  d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"></path>
          </svg>
        </button>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="hero" class="napkin-section hero-section">
      <div class="napkin-hero-content animation-fade-in">
        <h1 class="napkin-heading gradient-text">{{ $t('title') }}</h1>
        <h2 class="napkin-subheading animation-slide-up">{{ $t('subtitle') }}</h2>

        <div class="napkin-profession">
          <div v-for="(prof, index) in $t('profession')" :key="index"
               class="napkin-profession-item"
               :class="`animation-delay-${index * 200}`"
               :style="{ animationDelay: `${index * 0.1}s` }">
            <span>{{ prof }}</span>
          </div>
        </div>

        <div class="napkin-actions animation-slide-up animation-delay-300">
          <a href="#projects" class="napkin-button primary">
            {{ $t('buttons.viewProjects') }}
            <svg class="napkin-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round"/>
            </svg>
          </a>
          <a href="#about" class="napkin-button secondary">
            {{ $t('buttons.aboutSite') }}
          </a>
        </div>
      </div>

      <div class="napkin-hero-graphic">
        <div class="napkin-blob"></div>
        <div class="napkin-blob-secondary"></div>
        <div class="napkin-dots"></div>
        <div class="napkin-floating-shapes">
          <div class="napkin-shape napkin-circle"></div>
          <div class="napkin-shape napkin-square"></div>
          <div class="napkin-shape napkin-triangle"></div>
          <div class="napkin-shape napkin-cross"></div>
          <div class="napkin-shape napkin-donut"></div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="napkin-section about-section">
      <h2 class="napkin-heading-secondary animation-slide-up">{{ t('about.title') }}</h2>
      <div class="napkin-about-content">
        <p class="napkin-text-featured animation-fade-in animation-delay-100">{{ t('about.intro') }}</p>

        <div class="napkin-about-grid">
          <div class="napkin-about-modules animation-slide-in animation-delay-200">
            <div class="napkin-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                   stroke-linejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <h3 class="napkin-heading-tertiary">{{ t('about.modulesTitle') }}</h3>
            <ul class="napkin-list">
              <li v-for="(module, index) in t('about.modules')" :key="index" class="napkin-list-item"
                  :style="{ animationDelay: `${index * 0.05 + 0.2}s` }">
                {{ module }}
              </li>
            </ul>
          </div>

          <div class="napkin-about-vision animation-slide-in-reverse animation-delay-300">
            <div class="napkin-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                   stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path
                    d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
            <h3 class="napkin-heading-tertiary">{{ $t('about.visionTitle') }}</h3>
            <p class="napkin-text">{{ $t('about.vision') }}</p>
          </div>

          <div class="napkin-about-contact animation-slide-in animation-delay-400">
            <div class="napkin-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                   stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <h3 class="napkin-heading-tertiary">{{ $t('about.contactTitle') }}</h3>
            <p class="napkin-text">{{ $t('about.contact') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="napkin-section projects-section">
      <h2 class="napkin-heading-secondary animation-slide-up">{{ $t('projects.title') }}</h2>
      <div class="napkin-cards">
        <div v-for="(project, index) in projects" :key="index"
             class="napkin-card project-card animation-slide-in"
             :style="{ animationDelay: `${index * 0.15}s` }">
          <div class="napkin-card-accent"></div>
          <div class="napkin-card-content">
            <div class="napkin-card-icon">
              <svg v-if="index === 0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              <svg v-else-if="index === 1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
              </svg>
            </div>
            <h3 class="napkin-card-title">{{ project.name }}</h3>
            <p class="napkin-text">{{ project.description }}</p>
            <div class="napkin-card-tags">
              <span v-for="(tag, tagIndex) in project.tags" :key="tagIndex" class="napkin-tag">{{ tag }}</span>
            </div>
          </div>
          <div class="napkin-card-shine"></div>
        </div>
      </div>
    </section>

    <!-- Horizontal Gallery Section -->
    <section id="gallery" class="napkin-section gallery-section">
      <h2 class="napkin-heading-secondary animation-slide-up">{{ $t('gallery.title') }}</h2>
      <div class="napkin-gallery-container animation-fade-in animation-delay-200">
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

    <!-- AI Assistant Entry Section -->
    <section id="assistant" class="napkin-section assistant-section">
      <h2 class="napkin-heading-secondary animation-slide-up">{{ $t('assistant.title') }}</h2>
      <div class="napkin-assistant-container">
        <div class="napkin-assistant-preview animation-slide-in animation-delay-200">
          <div class="napkin-assistant-avatar">
            <div class="napkin-assistant-avatar-glow"></div>
          </div>
          <div class="napkin-assistant-bubble">
            <p class="napkin-text">{{ $t('assistant.greeting') }}</p>
            <div class="napkin-assistant-typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
        <div class="napkin-assistant-cta animation-slide-in-reverse animation-delay-300">
          <p class="napkin-text">{{ $t('assistant.description') }}</p>
          <button @click="openAssistant" class="napkin-button primary gradient-button">
            {{ $t('assistant.cta') }}
            <svg class="napkin-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="napkin-footer animation-fade-in">
      <div class="napkin-footer-content">
        <div class="napkin-footer-wave"></div>
        <div class="napkin-footer-info">
          <div class="napkin-logo footer-logo">RCPAWN</div>
          <p>&copy; {{ new Date().getFullYear() }} RCPAWN</p>
          <p>{{ $t('footer.rights') }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue'
import {useI18n} from 'vue-i18n'

const {locale, t} = useI18n()
const isDarkMode = ref(localStorage.getItem('theme') === 'dark')

// Toggle language function
const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'cn' : 'en'
  localStorage.setItem('language', locale.value)
}

// Toggle theme function
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}

// Project data
const projects = ref([
  {
    name: 'Full-Stack Web App',
    description: '基于 Vue3 的单页应用，注重性能与交互。现代化的前端框架与后端无缝集成。',
    tags: ['Vue', 'Node.js', 'MongoDB']
  },
  {
    name: 'Unity 3D Game',
    description: '使用Unity开发的3D游戏，具有沉浸式体验和先进的物理引擎。',
    tags: ['Unity', 'C#', 'Blender']
  },
  {
    name: 'Interactive Portfolio',
    description: '全栈项目，前后端无缝对接，支持多终端。创新的交互设计体验。',
    tags: ['React', 'TypeScript', 'Three.js']
  }
])

// Gallery data
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

// Scroll gallery horizontally
const scrollGallery = (direction) => {
  const scroller = document.querySelector('.napkin-gallery-scroller')
  const scrollAmount = scroller.clientWidth * 0.7

  if (direction === 'left') {
    scroller.scrollBy({left: -scrollAmount, behavior: 'smooth'})
  } else {
    scroller.scrollBy({left: scrollAmount, behavior: 'smooth'})
  }
}

// Open assistant function
const openAssistant = () => {
  // To be implemented - would open your AI assistant
  console.log('Opening assistant...')
  alert('AI Assistant coming soon!')
}

onMounted(() => {
  // Check saved language
  const savedLanguage = localStorage.getItem('language')
  if (savedLanguage) {
    locale.value = savedLanguage
  }

  // Register intersection observer for animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, {threshold: 0.1})

  // Observe all animated elements
  document.querySelectorAll('.napkin-section, .animation-fade-in, .animation-slide-up, .animation-slide-in, .animation-slide-in-reverse, .napkin-gallery-item, .napkin-list-item, .napkin-profession-item').forEach(element => {
    observer.observe(element)
  })

  // Add floating shapes animation
  animateFloatingShapes()
})

// Animate floating shapes
const animateFloatingShapes = () => {
  const shapes = document.querySelectorAll('.napkin-shape')
  shapes.forEach(shape => {
    setInterval(() => {
      const xPos = Math.random() * 100
      const yPos = Math.random() * 100
      const rotation = Math.random() * 360
      const scale = 0.8 + Math.random() * 0.5

      shape.style.transform = `translate(${xPos}%, ${yPos}%) rotate(${rotation}deg) scale(${scale})`
    }, 3000 + Math.random() * 2000)
  })
}

onUnmounted(() => {
  // Cleanup if needed
})
</script>

<style scoped>
/* Base Styles and Variables */
:root {
  --font-primary: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-secondary: 'Space Grotesk', 'Manrope', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Color Schema Inspired by Napkin AI */
  --color-primary: #5E60CE;
  --color-primary-light: #6930C3;
  --color-primary-dark: #5390D9;
  --color-secondary: #48BFE3;
  --color-secondary-light: #64DFDF;
  --color-accent: #80FFDB;

  --color-text: #1E293B;
  --color-text-light: #64748B;
  --color-text-lighter: #94A3B8;
  --color-background: #FFFFFF;
  --color-card: #FFFFFF;
  --color-border: #E2E8F0;

  --shadow-sm: 0 4px 6px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.08);
  --shadow-md: 0 6px 16px rgba(15, 23, 42, 0.08), 0 3px 6px rgba(15, 23, 42, 0.04);
  --shadow-lg: 0 10px 25px rgba(15, 23, 42, 0.1), 0 5px 10px rgba(15, 23, 42, 0.04);
  --shadow-xl: 0 20px 40px rgba(15, 23, 42, 0.12);

  --shadow-primary: 0 8px 20px rgba(94, 96, 206, 0.25);
  --shadow-secondary: 0 8px 20px rgba(72, 191, 227, 0.25);

  --radius-sm: 0.5rem;
  --radius-md: 1rem;
  --radius-lg: 1.5rem;
  --radius-xl: 2rem;

  --transition-fast: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-spring: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);

  --gradient-primary: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  --gradient-glow: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-secondary-light) 100%);
  --gradient-card: linear-gradient(135deg, rgba(94, 96, 206, 0.1) 0%, rgba(72, 191, 227, 0.1) 100%);
}

/* Dark Mode Overrides - Fixed so text is visible */
.dark-mode {
  --color-primary: #9D4EDD;
  --color-primary-light: #C77DFF;
  --color-primary-dark: #7B2CBF;
  --color-secondary: #5390D9;
  --color-secondary-light: #4EA8DE;
  --color-accent: #48BFE3;

  --color-text: #E2E8F0;
  --color-text-light: #94A3B8;
  --color-text-lighter: #CBD5E1;
  --color-background: #0F172A;
  --color-card: #1E293B;
  --color-border: #334155;

  --shadow-sm: 0 4px 6px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 6px 16px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 12px 24px rgba(0, 0, 0, 0.3);
  --shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.4);

  --shadow-primary: 0 8px 20px rgba(157, 78, 221, 0.3);
  --shadow-secondary: 0 8px 20px rgba(83, 144, 217, 0.3);

  --gradient-card: linear-gradient(135deg, rgba(157, 78, 221, 0.1) 0%, rgba(83, 144, 217, 0.1) 100%);
}

/* Import Fonts */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

/* Global Styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html {
  scroll-behavior: smooth;
}

body {
  overflow-x: hidden;
  font-family: var(--font-primary);
}

.napkin-container {
  background-color: var(--color-background);
  font-family: var(--font-primary);
  color: var(--color-text);
  min-height: 100vh;
  transition: var(--transition);
  position: relative;
  overflow-x: hidden;
}

/* Typography */
.gradient-text {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

/* Animation Classes */
.animation-fade-in {
  opacity: 0;
  animation: fadeIn 0.8s ease forwards;
  animation-play-state: paused;
}

.animation-slide-up {
  opacity: 0;
  transform: translateY(30px);
  animation: slideUp 0.8s ease forwards;
  animation-play-state: paused;
}

.animation-slide-in {
  opacity: 0;
  transform: translateX(-50px);
  animation: slideIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-play-state: paused;
}

.animation-slide-in-reverse {
  opacity: 0;
  transform: translateX(50px);
  animation: slideInReverse 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-play-state: paused;
}

.animation-delay-100 {
  animation-delay: 0.1s;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-300 {
  animation-delay: 0.3s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

.visible {
  animation-play-state: running !important;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInReverse {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
}

@keyframes shine {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

/* Navigation */
.napkin-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--color-background);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border);
  transition: var(--transition);
}

.napkin-logo {
  font-family: var(--font-secondary);
  font-weight: 700;
  font-size: 1.5rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: var(--transition);
  position: relative;
}

.napkin-logo::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--gradient-primary);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.napkin-logo:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.napkin-nav-links {
  display: flex;
  gap: 2rem;
}

.napkin-nav-link {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  position: relative;
  transition: var(--transition);
  padding: 0.5rem 0;
}

.napkin-nav-link::after {
  content: '';
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: 0;
  left: 0;
  background: var(--gradient-primary);
  transform-origin: bottom right;
  transition: transform 0.3s ease-out;
}

.napkin-nav-link:hover {
  color: var(--color-primary);
}

.napkin-nav-link:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

.napkin-nav-link.highlight {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
}

.napkin-controls {
  display: flex;
  gap: 0.75rem;
}

.napkin-control-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  text-decoration: none;
}

.napkin-control-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary-light);
}

.napkin-control-btn.github:hover {
  background-color: #24292e;
  color: white;
}

.napkin-icon {
  width: 20px;
  height: 20px;
}

/* Hero Section */
.hero-section {
  min-height: calc(100vh - 5rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5rem 2rem;
  position: relative;
  overflow: hidden;
}

.napkin-hero-content {
  max-width: 600px;
  position: relative;
  z-index: 2;
}

.napkin-heading {
  font-family: var(--font-secondary);
  font-size: 4rem;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  font-weight: 800;
}

.napkin-subheading {
  font-size: 1.5rem;
  color: var(--color-text-light);
  margin-bottom: 2rem;
  font-weight: 500;
}

.napkin-profession {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
}

.napkin-profession-item {
  background: var(--gradient-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.5rem 1rem;
  font-weight: 500;
  font-size: 0.9rem;
  transition: var(--transition-spring);
  animation: fadeIn 0.5s ease forwards, float 4s ease-in-out infinite;
  animation-play-state: paused;
}

.napkin-profession-item:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: var(--shadow-primary);
  border-color: var(--color-primary-light);
}

.napkin-actions {
  display: flex;
  gap: 1rem;
}

.napkin-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition-spring);
  font-size: 1rem;
}

.napkin-button.primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-primary);
}

.napkin-button.secondary {
  background-color: var(--color-card);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.napkin-button.gradient-button {
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.napkin-button.gradient-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: linear-gradient(
      90deg,
      var(--color-primary) 0%,
      var(--color-secondary) 25%,
      var(--color-primary-light) 50%,
      var(--color-secondary-light) 75%,
      var(--color-primary) 100%
  );
  z-index: -1;
  transition: var(--transition);
  animation: shine 8s linear infinite;
}

.napkin-button:hover {
  transform: translateY(-3px);
}

.napkin-button.primary:hover {
  box-shadow: var(--shadow-xl);
}

.napkin-button.secondary:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.napkin-arrow {
  transition: var(--transition);
}

.napkin-button:hover .napkin-arrow {
  transform: translateX(5px);
}

.napkin-hero-graphic {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 50%;
  height: 100%;
  z-index: 1;
}

.napkin-blob {
  position: absolute;
  width: 500px;
  height: 500px;
  right: -100px;
  top: 50%;
  transform: translateY(-50%);
  background: radial-gradient(
      circle,
      rgba(94, 96, 206, 0.15) 0%,
      rgba(72, 191, 227, 0.1) 50%,
      rgba(0, 0, 0, 0) 70%
  );
  border-radius: 50%;
  filter: blur(30px);
  animation: pulse 10s infinite;
}

.napkin-blob-secondary {
  position: absolute;
  width: 300px;
  height: 300px;
  right: 100px;
  top: 60%;
  transform: translateY(-50%);
  background: radial-gradient(
      circle,
      rgba(94, 96, 206, 0.1) 0%,
      rgba(72, 191, 227, 0.05) 50%,
      rgba(0, 0, 0, 0) 70%
  );
  border-radius: 50%;
  filter: blur(40px);
  animation: pulse 15s infinite;
  animation-delay: 2s;
}

.napkin-dots {
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(var(--color-border) 1px, transparent 1px);
  background-size: 30px 30px;
  opacity: 0.5;
}

.napkin-floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.napkin-shape {
  position: absolute;
  opacity: 0.7;
  transition: transform 2s cubic-bezier(0.215, 0.61, 0.355, 1);
}

.napkin-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--color-primary-light), var(--color-primary));
  top: 20%;
  right: 15%;
}

.napkin-square {
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, var(--color-secondary), var(--color-secondary-light));
  top: 50%;
  right: 30%;
  transform: rotate(45deg);
}

.napkin-triangle {
  width: 0;
  height: 0;
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
  border-bottom: 50px solid var(--color-accent);
  top: 70%;
  right: 20%;
}

.napkin-cross {
  width: 40px;
  height: 10px;
  background: linear-gradient(45deg, var(--color-primary), var(--color-primary-light));
  top: 40%;
  right: 40%;
}

.napkin-cross::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 40px;
  background: linear-gradient(45deg, var(--color-primary), var(--color-primary-light));
  top: -15px;
  left: 15px;
}

.napkin-donut {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 8px solid var(--color-secondary);
  top: 30%;
  right: 50%;
}

/* About Section */
.about-section {
  padding: 8rem 2rem;
  position: relative;
}

.napkin-heading-secondary {
  font-family: var(--font-secondary);
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  text-align: center;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
}

.napkin-heading-secondary::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 80px;
  height: 4px;
  background: var(--gradient-primary);
  border-radius: var(--radius-sm);
}

.napkin-about-content {
  max-width: 1200px;
  margin: 0 auto;
}

.napkin-text-featured {
  font-size: 1.25rem;
  line-height: 1.7;
  color: var(--color-text-light);
  margin-bottom: 3rem;
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.napkin-about-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.napkin-about-modules,
.napkin-about-vision,
.napkin-about-contact {
  background: var(--color-card);
  border-radius: var(--radius-md);
  padding: 2rem;
  border: 1px solid var(--color-border);
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.napkin-about-modules:hover,
.napkin-about-vision:hover,
.napkin-about-contact:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary-light);
}

.napkin-card-icon {
  background: var(--gradient-card);
  width: 50px;
  height: 50px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  transition: var(--transition);
}

.napkin-card-icon svg {
  width: 24px;
  height: 24px;
  stroke: var(--color-primary);
}

.napkin-about-modules:hover .napkin-card-icon,
.napkin-about-vision:hover .napkin-card-icon,
.napkin-about-contact:hover .napkin-card-icon {
  background: var(--gradient-primary);
}

.napkin-about-modules:hover .napkin-card-icon svg,
.napkin-about-vision:hover .napkin-card-icon svg,
.napkin-about-contact:hover .napkin-card-icon svg {
  stroke: white;
}

.napkin-heading-tertiary {
  font-family: var(--font-secondary);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.napkin-text {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--color-text-light);
}

.napkin-list {
  list-style: none;
}

.napkin-list-item {
  padding: 0.5rem 0;
  position: relative;
  padding-left: 1.5rem;
  animation: fadeIn 0.5s ease forwards;
  animation-play-state: paused;
}

.napkin-list-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 1rem;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary);
}

/* Projects Section */
.projects-section {
  padding: 8rem 2rem;
  background-color: var(--color-background);
  position: relative;
}

.napkin-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.napkin-card {
  position: relative;
  background: var(--color-card);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: var(--transition-spring);
  border: 1px solid var(--color-border);
}

.napkin-card-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: var(--gradient-primary);
}

.napkin-card-content {
  padding: 2rem;
  position: relative;
  z-index: 2;
}

.napkin-card-title {
  font-family: var(--font-secondary);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.napkin-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.napkin-tag {
  background-color: var(--color-background);
  color: var(--color-text-light);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  border: 1px solid var(--color-border);
  transition: var(--transition);
}

.napkin-card:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-lg);
}

.napkin-card:hover .napkin-tag {
  background: var(--gradient-card);
  border-color: var(--color-primary-light);
  color: var(--color-primary);
}

.napkin-card-shine {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0) 100%
  );
  opacity: 0;
  transition: var(--transition);
  z-index: 1;
}

.napkin-card:hover .napkin-card-shine {
  opacity: 1;
  transform: translateX(100%);
  transition: all 0.8s ease;
}

/* Gallery Section */
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

/* Assistant Section */
.assistant-section {
  padding: 8rem 2rem;
  position: relative;
  overflow: hidden;
}

.napkin-assistant-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.napkin-assistant-preview {
  flex: 1;
  min-width: 300px;
  display: flex;
  gap: 1rem;
}

.napkin-assistant-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--gradient-primary);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.napkin-assistant-avatar-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--gradient-primary);
  filter: blur(10px);
  opacity: 0.5;
  animation: pulse 2s infinite;
}

.napkin-assistant-bubble {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  max-width: 400px;
  position: relative;
}

.napkin-assistant-bubble::before {
  content: '';
  position: absolute;
  top: 20px;
  left: -10px;
  width: 20px;
  height: 20px;
  background: var(--color-card);
  transform: rotate(45deg);
  border-left: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.napkin-assistant-typing {
  display: flex;
  gap: 0.3rem;
  margin-top: 1rem;
}

.napkin-assistant-typing span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary);
  animation: typing 1.5s infinite ease-in-out;
}

.napkin-assistant-typing span:nth-child(1) {
  animation-delay: 0s;
}

.napkin-assistant-typing span:nth-child(2) {
  animation-delay: 0.2s;
}

.napkin-assistant-typing span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-5px);
    opacity: 1;
  }
}

.napkin-assistant-cta {
  flex: 1;
  min-width: 300px;
}

.napkin-assistant-cta p {
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.7;
}

/* Footer */
.napkin-footer {
  padding: 5rem 2rem 2rem;
  position: relative;
  background-color: var(--color-background);
}

.napkin-footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 2;
}

.napkin-footer-wave {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 150px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' fill='%23f3f4f6' opacity='0.4'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
  transform: rotate(180deg);
}

.footer-logo {
  margin-bottom: 1rem;
  font-size: 2rem;
}

/* Responsive Adjustments */
@media (max-width: 1024px) {
  .napkin-heading {
    font-size: 3rem;
  }

  .hero-section {
    flex-direction: column;
    padding-top: 3rem;
  }

  .napkin-hero-graphic {
    position: relative;
    width: 100%;
    height: 300px;
    margin-top: 3rem;
    transform: none;
    top: auto;
  }

  .napkin-blob {
    right: auto;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .napkin-blob-secondary {
    right: auto;
    left: 30%;
  }
}

@media (max-width: 768px) {
  .napkin-nav {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .napkin-nav-links {
    width: 100%;
    justify-content: center;
    gap: 1rem;
  }

  .napkin-controls {
    width: 100%;
    justify-content: center;
  }

  .napkin-heading {
    font-size: 2.5rem;
  }

  .napkin-subheading {
    font-size: 1.2rem;
  }

  .napkin-actions {
    flex-direction: column;
  }

  .napkin-cards {
    grid-template-columns: 1fr;
  }

  .napkin-about-grid {
    grid-template-columns: 1fr;
  }
}

/* Fix for light mode text visibility */
.napkin-container:not(.dark-mode) {
  --color-text: #1E293B;
  --color-text-light: #475569;
  --color-text-lighter: #64748B;
  --color-background: #FFFFFF;
  --color-card: #FFFFFF;
  --color-border: #E2E8F0;
}

/* Enhanced animations */
.project-card {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
}

.project-card:hover {
  transform: scale(1.03) translateY(-10px);
}

/* 3D Tilt Effect */
.napkin-card {
  perspective: 1000px;
}

.napkin-card-content {
  transition: transform 0.3s ease;
}

.napkin-card:hover .napkin-card-content {
  transform: translateZ(20px);
}

/* Interactive elements extra styling */
.napkin-button.primary {
  position: relative;
}

</style>
