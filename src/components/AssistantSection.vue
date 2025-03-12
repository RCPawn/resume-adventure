<template>
  <section id="assistant" class="napkin-section assistant-section">
    <h2 class="napkin-heading-secondary animation-slide-up">{{ t('assistant.title') }}</h2>
    <div class="napkin-assistant-container">
      <div class="napkin-assistant-preview animation-slide-in" style="animation-delay: 0.2s;">
        <div class="napkin-assistant-avatar">
          <div class="napkin-assistant-avatar-glow"></div>
        </div>
        <div class="napkin-assistant-bubble">
          <p class="napkin-text">{{ t('assistant.greeting') }}</p>
          <div class="napkin-assistant-typing">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
      <div class="napkin-assistant-cta animation-slide-in-reverse" style="animation-delay: 0.3s;">
        <p class="napkin-text">{{ t('assistant.description') }}</p>
        <button @click="openAssistant" class="napkin-button primary gradient-button">
          {{ t('assistant.cta') }}
          <svg class="napkin-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const openAssistant = () => {
  console.log('Opening assistant...')
  alert('AI Assistant coming soon!')
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, { threshold: 0.1 })
  const els = document.querySelectorAll('#assistant .animation-slide-up, #assistant .animation-slide-in, #assistant .animation-slide-in-reverse')
  els.forEach(el => observer.observe(el))
})
</script>

<style scoped>
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
</style>
