<template>
  <section id="hero" class="napkin-hero">

    <!-- 草稿纸背景 -->
    <div class="napkin-paper-background">
      <div class="napkin-paper-lines"></div>
    </div>

    <div class="napkin-hero-content">
      <!-- 标题带能量线动画 -->
      <div class="napkin-title-container">
        <h1 class="napkin-heading">{{ t('title') }}</h1>
        <div class="napkin-energy-overlay"></div>
      </div>

      <h2 class="napkin-subheading">{{ t('subtitle') }}</h2>

      <!-- 专业标签调整为类似标题的展示 -->
      <div class="napkin-profession-sentences">
        <div
            v-for="(prof, index) in tm('professions')"
            :key="index"
            class="napkin-profession-item"
            :style="{ animationDelay: `${0.1 + index * 0.15}s` }"
        >
          {{ prof }}
        </div>
      </div>
    </div>

    <!-- 背景装饰元素 -->
    <div class="napkin-decoration">
      <div class="napkin-floating-shapes">
        <div class="napkin-shape napkin-circle" ref="circle"></div>
        <div class="napkin-shape napkin-square" ref="square"></div>
        <div class="napkin-shape napkin-triangle" ref="triangle"></div>
        <div class="napkin-shape napkin-cross" ref="cross"></div>
        <div class="napkin-shape napkin-donut" ref="donut"></div>
        <div class="napkin-dot napkin-dot-1"></div>
        <div class="napkin-dot napkin-dot-2"></div>
        <div class="napkin-dot napkin-dot-3"></div>
        <div class="napkin-shape napkin-star" ref="star"></div>
        <div class="napkin-shape napkin-hexagon" ref="hexagon"></div>
        <div class="napkin-dot napkin-dot-4"></div>
        <div class="napkin-dot napkin-dot-5"></div>

        <!-- 新增手绘标记元素 -->
        <div class="napkin-sketch-element napkin-sketch-check"></div>
        <div class="napkin-sketch-element napkin-sketch-underline"></div>
        <div class="napkin-sketch-element napkin-sketch-bracket"></div>
        <div class="napkin-sketch-element napkin-sketch-circle"></div>

        <!-- 新增便利贴效果 -->
        <div class="napkin-sticky-note">
          <div class="napkin-sticky-content">Less is more</div>
        </div>
      </div>
    </div>

    <!-- 新增手绘涂鸦效果 -->
    <div class="napkin-doodles">
      <div class="napkin-doodle napkin-lightbulb"></div>
      <div class="napkin-doodle napkin-rocket"></div>
      <div class="napkin-doodle napkin-stars"></div>
    </div>
  </section>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import {useI18n} from 'vue-i18n';

const {t, tm} = useI18n();

// 形状动画引用
const circle = ref(null);
const square = ref(null);
const triangle = ref(null);
const cross = ref(null);
const donut = ref(null);
const star = ref(null);
const hexagon = ref(null);

// 存储动画间隔以便清理
const animationIntervals = ref([]);

// 随机移动形状的函数
const animateShape = (element) => {
  if (!element) return null;
  return setInterval(() => {
    const xPos = Math.random() * 70 + 15; // 15-85%
    const yPos = Math.random() * 70 + 15; // 15-85%
    const rotation = Math.random() * 360;
    const scale = 0.8 + Math.random() * 0.4;
    element.style.transform = `translate(${xPos}%, ${yPos}%) rotate(${rotation}deg) scale(${scale})`;
  }, 4000 + Math.random() * 3000);
};

// 初始化动画
onMounted(() => {
  // 为浮动形状设置动画
  const shapeElements = [circle.value, square.value, triangle.value, cross.value, donut.value, star.value, hexagon.value];
  shapeElements.forEach(element => {
    if (element) {
      const xPos = Math.random() * 70 + 15;
      const yPos = Math.random() * 70 + 15;
      element.style.transform = `translate(${xPos}%, ${yPos}%)`;
      const interval = animateShape(element);
      if (interval) animationIntervals.value.push(interval);
    }
  });

  // 为能量线覆盖添加动画
  const energyOverlay = document.querySelector('.napkin-energy-overlay');
  if (energyOverlay) {
    energyOverlay.classList.add('animate');
  }
});

// 组件卸载时清理所有动画间隔
onUnmounted(() => {
  animationIntervals.value.forEach(interval => clearInterval(interval));
});
</script>

<style scoped>
@import '@/assets/styles/NapkinBackground.css';

.napkin-hero {
  position: relative;
  /* 调整最小高度，使组件不再占满整个视口 */
  min-height: 75vh; /* 或者根据需要使用 auto */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* 减少内边距，紧凑布局 */
  padding: 2rem 1rem;
  overflow: hidden;
  background-color: #F8F8F8;
  color: #333;
  font-family: 'Inter', sans-serif;
}

.napkin-hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding-top: 0;
  /* 移除或调整负 margin */
  /* margin-top: -10vh; */
}


/* 标题容器和能量线动画 */
.napkin-title-container {
  position: relative;
  display: inline-block;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.napkin-heading {
  font-size: 4.5rem; /* 增大标题字体 */
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #333;
  display: inline-block;
  opacity: 0;
  position: relative;
  transform: translateY(30px);
  animation: napkinFadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  z-index: 2;
}

.napkin-energy-overlay {
  position: absolute;
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, rgba(77, 171, 247, 0.7) 0%, rgba(66, 153, 225, 0.7) 100%);
  top: 0;
  left: 0;
  z-index: -1;
  mix-blend-mode: color;
  border-radius: 2px;
}

.napkin-energy-overlay.animate {
  animation: energyChargeCycle 4s ease-in-out infinite;
}

.napkin-subheading {
  font-size: 1.3rem;
  color: #666;
  margin-bottom: 3rem;
  font-weight: 500;
  letter-spacing: 1px;
  opacity: 0;
  transform: translateY(30px);
  animation: napkinFadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards 0.3s;
}

/* 专业标签调整：与标题相似但略小 */
.napkin-profession-sentences {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  margin: 0 auto 3rem;
}

.napkin-profession-item {
  font-size: 2rem; /* 稍小于标题 */
  font-weight: 700;
  color: #484848;
  opacity: 0;
  transform: translateY(30px);
  animation: napkinFadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* 装饰元素及动画关键帧等保持不变 */
.napkin-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 2;
}

.napkin-floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.napkin-shape {
  position: absolute;
  transition: transform 2.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 0.15;
  animation: napkinFadeIn 1s ease forwards;
}

.napkin-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #4dabf7;
  top: 15%;
  left: 75%;
  animation-delay: 1s;
}

.napkin-square {
  width: 35px;
  height: 35px;
  border: 2px solid #339af0;
  top: 70%;
  left: 20%;
  animation-delay: 1.5s;
}

.napkin-triangle {
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 35px solid rgba(66, 153, 225, 0.2);
  top: 30%;
  left: 30%;
  animation-delay: 2s;
}

.napkin-cross {
  width: 30px;
  height: 30px;
  top: 60%;
  left: 75%;
  animation-delay: 2.5s;
  transform: rotate(45deg);
}

.napkin-cross::before,
.napkin-cross::after {
  content: '';
  position: absolute;
  background-color: #74c0fc;
}

.napkin-cross::before {
  width: 100%;
  height: 3px;
  top: 50%;
  transform: translateY(-50%);
}

.napkin-cross::after {
  height: 100%;
  width: 3px;
  left: 50%;
  transform: translateX(-50%);
}

.napkin-donut {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 4px solid #74c0fc;
  top: 20%;
  left: 20%;
  animation-delay: 3s;
}

.napkin-star {
  width: 40px;
  height: 40px;
  top: 25%;
  right: 25%;
  animation-delay: 2.3s;
  position: relative;
}

.napkin-star:before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(77, 171, 247, 0.2);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}

.napkin-hexagon {
  width: 35px;
  height: 40px;
  top: 65%;
  right: 35%;
  animation-delay: 3.1s;
  position: relative;
}

.napkin-hexagon:before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(66, 153, 225, 0.2);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}

.napkin-dot {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(77, 171, 247, 0.3);
}

.napkin-dot-1 {
  top: 20%;
  right: 15%;
  animation: floatAnimation 6s infinite ease-in-out;
}

.napkin-dot-2 {
  bottom: 30%;
  left: 10%;
  animation: floatAnimation 7s infinite ease-in-out 1s;
}

.napkin-dot-3 {
  bottom: 15%;
  right: 30%;
  animation: floatAnimation 5s infinite ease-in-out 0.5s;
}

.napkin-dot-4 {
  top: 45%;
  right: 18%;
  animation: floatAnimation 7.5s infinite ease-in-out 0.7s;
}

.napkin-dot-5 {
  bottom: 55%;
  left: 18%;
  animation: floatAnimation 6.5s infinite ease-in-out 1.2s;
}

/* 新增: 手绘标记元素 */
.napkin-sketch-element {
  position: absolute;
  opacity: 0.3;
  transform-origin: center;
  animation: napkinFadeIn 1s ease forwards 3s;
}

.napkin-sketch-check {
  width: 25px;
  height: 25px;
  top: 40%;
  right: 30%;
  background: transparent;
  position: relative;
}

.napkin-sketch-check::before,
.napkin-sketch-check::after {
  content: '';
  position: absolute;
  background-color: #ff4757;
}

.napkin-sketch-check::before {
  width: 6px;
  height: 15px;
  left: 4px;
  top: 0;
  transform: rotate(45deg);
}

.napkin-sketch-check::after {
  width: 20px;
  height: 6px;
  right: 0;
  bottom: 10px;
  transform: rotate(45deg);
}

.napkin-sketch-underline {
  width: 100px;
  height: 5px;
  bottom: 35%;
  left: 25%;
  background: transparent;
  border-bottom: 3px solid #ff4757;
  transform: rotate(-2deg);
}

.napkin-sketch-bracket {
  width: 30px;
  height: 60px;
  top: 25%;
  left: 40%;
  border-left: 3px solid #ff4757;
  border-top: 3px solid #ff4757;
  border-bottom: 3px solid #ff4757;
  border-radius: 8px 0 0 8px;
}

.napkin-sketch-circle {
  width: 50px;
  height: 50px;
  bottom: 25%;
  right: 25%;
  border: 3px solid #ff4757;
  border-radius: 50%;
  transform: rotate(15deg);
}

/* 新增: 便利贴效果 */
.napkin-sticky-note {
  position: absolute;
  width: 120px;
  height: 120px;
  background-color: #ffe066;
  transform: rotate(-8deg);
  top: 15%;
  right: 10%;
  padding: 15px;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.1);
  z-index: 5;
  animation: wobble 3s ease-in-out infinite, napkinFadeIn 1s ease forwards 2s;
}

.napkin-sticky-content {
  font-family: 'Caveat', cursive;
  font-size: 1.2rem;
  color: #495057;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* 新增: 手绘涂鸦效果 */
.napkin-doodles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
}

.napkin-doodle {
  position: absolute;
  opacity: 0.4;
  animation: napkinFadeIn 1s ease forwards 3.5s;
}

.napkin-lightbulb {
  width: 40px;
  height: 60px;
  top: 20%;
  left: 15%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ff6b6b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 18h6'/%3E%3Cpath d='M10 22h4'/%3E%3Cpath d='M12 2v4'/%3E%3Cpath d='M12 12v4'/%3E%3Cpath d='M12 12a5 5 0 0 0 0-10 5 5 0 0 0 0 10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  transform: rotate(15deg);
}

.napkin-rocket {
  width: 60px;
  height: 60px;
  bottom: 20%;
  right: 15%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235f27cd' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z'/%3E%3Cpath d='m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z'/%3E%3Cpath d='M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0'/%3E%3Cpath d='M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  transform: rotate(-15deg);
}

.napkin-stars {
  width: 80px;
  height: 80px;
  top: 50%;
  right: 20%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23feca57' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
}

/* 动画关键帧 */
@keyframes napkinFadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes napkinFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.15;
  }
}

@keyframes energyChargeCycle {
  0% {
    width: 0;
    opacity: 0;
  }
  20% {
    width: 100%;
    opacity: 0.7;
  }
  30% {
    width: 100%;
    opacity: 0.7;
  }
  50% {
    width: 0;
    opacity: 0;
    left: 100%;
  }
  51% {
    width: 0;
    left: 0;
  }
  70% {
    width: 100%;
    opacity: 0.7;
  }
  80% {
    width: 100%;
    opacity: 0.7;
  }
  100% {
    width: 0;
    opacity: 0;
    left: 100%;
  }
}

@keyframes floatAnimation {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes wobble {
  0%, 100% {
    transform: rotate(-8deg);
  }
  50% {
    transform: rotate(-2deg);
  }
}

@media (max-width: 768px) {
  .napkin-heading {
    font-size: 3.8rem;
  }

  .napkin-subheading {
    font-size: 1.1rem;
  }

  .napkin-profession-item {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .napkin-hero-content {
    margin-top: -5vh;
  }

  .napkin-heading {
    font-size: 3rem;
  }

  .napkin-subheading {
    font-size: 0.95rem;
    margin-bottom: 2rem;
  }

  .napkin-profession-item {
    font-size: 2rem;
  }
}
</style>
