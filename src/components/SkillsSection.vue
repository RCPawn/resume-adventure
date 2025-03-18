<template>
  <section id="skills">
    <div class="skills-container">
      <div
          class="skill-card"
          v-for="(skill, index) in skills"
          :key="index"
          @mouseenter="pauseAnimation($event, true)"
          @mouseleave="pauseAnimation($event, false)"
      >
        <h3 class="skill-title">{{ skill.name }}</h3>
        <p class="skill-desc">{{ skill.desc }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const skills = ref([
  { name: '全栈开发', desc: '涵盖前端、后端、数据库等全方位能力' },
  { name: 'Unity & Blender', desc: '游戏开发与3D建模创意实践' },
  { name: 'Deep Learning (PyTorch)', desc: '机器学习、深度学习实战经验' },
  { name: 'GitHub', desc: '版本控制与开源协作精通' }
])

// 可选：当鼠标悬停时暂停动画
function pauseAnimation(event, pause) {
  const card = event.currentTarget
  card.style.animationPlayState = pause ? 'paused' : 'running'
}
</script>

<style scoped>
.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  justify-content: center;
}

/* 手绘风格卡片 */
.skill-card {
  position: relative;
  background: #fff;
  padding: 20px;
  width: 240px;
  border: 3px dashed #333;
  border-radius: 10px;
  transition: transform 0.3s;
  /* 浮动动画 */
  animation: float 3s ease-in-out infinite;
  /* 模拟手绘风格的字体 */
  font-family: 'Comic Sans MS', cursive, sans-serif;
  overflow: hidden;
}

.skill-card:hover {
  transform: scale(1.05);
}

/* 卡片标题和描述 */
.skill-title {
  font-size: 1.4rem;
  margin-bottom: 10px;
}

.skill-desc {
  font-size: 1rem;
  color: #555;
}

/* 浮动动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 手绘边框效果：利用伪元素模拟先后绘制的动画 */
.skill-card::before,
.skill-card::after {
  content: '';
  position: absolute;
  border: 2px solid transparent;
  border-radius: inherit;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  z-index: -1;
}

.skill-card::before {
  border-top: 2px solid #333;
  border-left: 2px solid #333;
  animation: drawBorder 2s forwards;
}

.skill-card::after {
  border-bottom: 2px solid #333;
  border-right: 2px solid #333;
  animation: drawBorder 2s forwards 1s;
}

@keyframes drawBorder {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
