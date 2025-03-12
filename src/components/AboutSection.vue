<template>
  <section id="about" class="napkin-section about-section">
    <h2 class="napkin-heading-secondary animation-slide-up">{{ t('about.title') }}</h2>
    <div class="napkin-about-content">
      <p class="napkin-text-featured animation-fade-in" style="animation-delay: 0.1s;">
        {{ t('about.intro') }}
      </p>
      <div class="napkin-about-grid">
        <div class="napkin-about-modules animation-slide-in" style="animation-delay: 0.2s;">
          <div class="napkin-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                 stroke-linejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <!-- 注意这里调用 modulesTitle -->
          <h3 class="napkin-heading-tertiary">{{ t('about.modulesTitle') }}</h3>
          <ul class="napkin-list">
            <li v-for="(module, index) in modules" :key="index" class="napkin-list-item"
                :style="{ animationDelay: `${index * 0.05 + 0.2}s` }">
              {{ module }}
            </li>
          </ul>
        </div>
        <div class="napkin-about-vision animation-slide-in-reverse" style="animation-delay: 0.3s;">
          <div class="napkin-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                 stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path
                  d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </div>
          <h3 class="napkin-heading-tertiary">{{ t('about.visionTitle') }}</h3>
          <p class="napkin-text">{{ t('about.vision') }}</p>
        </div>
        <div class="napkin-about-contact animation-slide-in" style="animation-delay: 0.4s;">
          <div class="napkin-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                 stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          <h3 class="napkin-heading-tertiary">{{ t('about.contactTitle') }}</h3>
          <p class="napkin-text">{{ t('about.contact') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useI18n} from 'vue-i18n'

const {t, tm} = useI18n()

const modules = ref(tm('about.modules'))

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, {threshold: 0.1})
  const els = document.querySelectorAll('#about .animation-fade-in, #about .animation-slide-up, #about .animation-slide-in, #about .animation-slide-in-reverse, #about .napkin-list-item')
  els.forEach(el => observer.observe(el))
})
</script>

<style scoped>
/* 样式部分保持不变 */
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
</style>
