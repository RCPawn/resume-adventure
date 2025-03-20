<template>
  <section id="skills" class="skills-section">
    <h2 class="section-title">{{ t('skills.title') }}</h2>
    <div class="skills-container">
      <div
          v-for="(skill, index) in tm('skills.items')"
          :key="index"
          class="skill-card"
          :class="`skill-card-${index + 1}`"
          @mouseenter="pauseAnimation($event, true)"
          @mouseleave="pauseAnimation($event, false)"
      >
        <div class="skill-icon">
          <i :class="skill.icon"></i>
        </div>
        <h3 class="skill-title">{{ skill.name }}</h3>
        <p class="skill-desc">{{ skill.desc }}</p>
        <div class="skill-level">
          <div class="level-bar">
            <div class="level-fill" :style="{ width: skill.level + '%' }"></div>
          </div>
          <span class="level-text">{{ skill.level }}%</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t, tm } = useI18n();

// 当鼠标悬停时暂停动画
function pauseAnimation(event, pause) {
  const card = event.currentTarget;
  card.style.animationPlayState = pause ? 'paused' : 'running';
}
</script>

<style scoped>
.skills-section {
  padding: 60px 20px;
  background-color: white;
  position: relative;
  overflow: hidden;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 40px;
  font-weight: 700;
  color: #333;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #333;
}

.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
}

.skill-card {
  position: relative;
  width: 260px;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  overflow: hidden;
  background-color: white;
  animation: float 4s ease-in-out infinite;
  animation-delay: calc(var(--animation-order) * 0.5s);
}

.skill-card:hover {
  transform: translateY(-15px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.skill-card-1 {
  --animation-order: 0;
  border-top: 5px solid #4D8CF5;
}

.skill-card-2 {
  --animation-order: 1;
  border-top: 5px solid #9D50BB;
}

.skill-card-3 {
  --animation-order: 2;
  border-top: 5px solid #FF6B6B;
}

.skill-card-4 {
  --animation-order: 3;
  border-top: 5px solid #FFD166;
}

.skill-card-5 {
  --animation-order: 4;
  border-top: 5px solid #06D6A0;
}

.skill-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 50%);
  z-index: 0;
}

.skill-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: inherit;
  text-align: center;
}

.skill-card-1 .skill-icon { color: #4D8CF5; }
.skill-card-2 .skill-icon { color: #9D50BB; }
.skill-card-3 .skill-icon { color: #FF6B6B; }
.skill-card-4 .skill-icon { color: #FFD166; }
.skill-card-5 .skill-icon { color: #06D6A0; }

.skill-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #333;
  position: relative;
}

.skill-desc {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.skill-level {
  position: relative;
  margin-top: 15px;
}

.level-bar {
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.skill-card-1 .level-fill { background-color: #4D8CF5; }
.skill-card-2 .level-fill { background-color: #9D50BB; }
.skill-card-3 .level-fill { background-color: #FF6B6B; }
.skill-card-4 .level-fill { background-color: #FFD166; }
.skill-card-5 .level-fill { background-color: #06D6A0; }

.level-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 1.5s ease-in-out;
}

.level-text {
  position: absolute;
  right: 0;
  top: -22px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #555;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 768px) {
  .skills-container {
    gap: 20px;
  }

  .skill-card {
    width: calc(50% - 20px);
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .skill-card {
    width: 100%;
  }
}
</style>