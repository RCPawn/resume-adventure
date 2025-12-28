<!--
<template>
  <section id="hero" class="napkin-hero">

    &lt;!&ndash; 草稿纸背景 &ndash;&gt;
    <div class="napkin-paper-background">
      <div class="napkin-paper-lines"></div>
    </div>

    <div class="napkin-hero-content">
      &lt;!&ndash; 标题带能量线动画 &ndash;&gt;
      <div class="napkin-title-container">
        <h1 class="napkin-heading">{{ t('title') }}</h1>
        <div class="napkin-energy-overlay"></div>
      </div>

      <h2 class="napkin-subheading">{{ t('subtitle') }}</h2>

      &lt;!&ndash; 专业标签调整为类似标题的展示 &ndash;&gt;
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

    &lt;!&ndash; 背景装饰元素 &ndash;&gt;
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

        &lt;!&ndash; 新增手绘标记元素 &ndash;&gt;
        <div class="napkin-sketch-element napkin-sketch-check"></div>
        <div class="napkin-sketch-element napkin-sketch-underline"></div>
        <div class="napkin-sketch-element napkin-sketch-bracket"></div>
        <div class="napkin-sketch-element napkin-sketch-circle"></div>

        &lt;!&ndash; 新增便利贴效果 &ndash;&gt;
        <div class="napkin-sticky-note">
          <div class="napkin-sticky-content">Less is more</div>
        </div>
      </div>
    </div>

    &lt;!&ndash; 新增手绘涂鸦效果 &ndash;&gt;
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
-->
<template>
  <!-- 强制使用浅色主题，确保草稿纸效果正常显示 -->
  <section class="hero-section light-theme">

    <!-- 1. 背景纹理 (保留草稿纸效果) -->
    <div class="paper-texture">
      <div class="grid-lines"></div>
    </div>

    <div class="container-fluid">
      <div class="layout-grid">

        <!-- 左侧：文字信息 -->
        <div class="text-area">
          <div class="content-wrapper">
            <!-- 标题组 -->
            <div class="title-group">
              <h1 class="main-name">
                <span class="greeting">HEY, I AM</span>
                <br>
                <span class="highlight-name">RCPAWN</span>
                <!-- 能量线装饰 -->
                <svg class="energy-underline" viewBox="0 0 200 15" preserveAspectRatio="none">
                  <path d="M5,10 Q50,0 100,10 T195,10" fill="none" stroke="#4dabf7" stroke-width="4" />
                </svg>
              </h1>
            </div>

            <h2 class="sub-heading">{{ t('subtitle') || 'A SOFTWARE ENGINEERING STUDENT' }}</h2>

            <!-- 职业列表 -->
            <div class="skill-list">
              <div
                  v-for="(prof, index) in tm('professions')"
                  :key="index"
                  class="skill-item"
                  :style="{ animationDelay: `${0.2 + index * 0.1}s` }"
              >
<!--                <span class="icon"></span>-->
                <span class="text">{{ prof }}</span>
              </div>
            </div>

            <!-- 便利贴 (移动到不遮挡的位置) -->
            <div class="sticky-note">
              <span class="note-pin">📌</span>
              <p>Less is<br>more</p>
            </div>
          </div>
        </div>

        <!-- 右侧：3D 模型展示 -->
        <div class="model-area">
          <div class="model-wrapper floating-anim">
            <!--
              bounds="tight": 自动裁剪模型周围空白
              camera-orbit: 调整相机角度和距离 (关键!)
              field-of-view: 视角大小，越小模型越平，越大透视越强
              min-camera-orbit: 限制用户缩放的最小距离
            -->
            <model-viewer
                src="/models/mystery_shack.glb"
                camera-controls
                disable-zoom
                auto-rotate
                auto-rotate-delay="1000"
                rotation-per-second="15deg"
                shadow-intensity="1.8"
                shadow-softness="0.5"
                exposure="1.1"
                camera-orbit="-20deg 75deg 105%"
                field-of-view="25deg"
                min-camera-orbit="auto auto 5%"
                class="huge-model"
            >
              <!-- 加载时的占位 -->
              <div slot="poster" class="loading-poster">
                <div class="spinner"></div>
              </div>
            </model-viewer>
          </div>

          <!-- 手绘箭头装饰 -->
          <div class="sketch-arrow"></div>
        </div>

      </div>
    </div>

    <!-- 漂浮的背景装饰 (纯CSS动画) -->
    <div class="floating-decorations">
      <div class="doodle circle"></div>
      <div class="doodle cross"></div>
      <div class="doodle triangle"></div>
      <div class="doodle squiggly"></div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import '@google/model-viewer';

const { t, tm } = useI18n();
</script>

<style scoped>
/* 引入原有字体，如果需要 */
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Inter:wght@400;800&display=swap');

/* --- 基础布局 --- */
.hero-section {
  position: relative;
  /* 强制占满高度，确保大气 */
  min-height: 85vh;
  width: 100%;
  background-color: #f8f9fa; /* 强制浅灰背景 */
  color: #212529; /* 强制深色文字 */
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
}

.container-fluid {
  width: 100%;
  max-width: 1400px; /* 增加最大宽度 */
  margin: 0 auto;
  padding: 0 4%;
  z-index: 10;
}

.layout-grid {
  display: grid;
  /* 左侧 45%，右侧 55%，给模型更多空间 */
  grid-template-columns: 0.9fr 1.1fr;
  align-items: center;
  gap: 2rem;
}

/* --- 背景纹理 --- */
.paper-texture {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.grid-lines {
  width: 100%;
  height: 100%;
  /* 蓝色方格纸效果 */
  background-image:
      linear-gradient(#e9ecef 1px, transparent 1px),
      linear-gradient(90deg, #e9ecef 1px, transparent 1px);
  background-size: 30px 30px;
}

/* --- 左侧文字区域 --- */
.text-area {
  position: relative;
  padding: 2rem 0;
}

.content-wrapper {
  position: relative;
  max-width: 600px; /* 限制文字最大宽度，防止太长 */
}

.main-name {
  font-weight: 900;
  line-height: 1;
  color: #212529;
  margin-bottom: 1.5rem;
  position: relative;
}

.greeting {
  font-size: 2.5rem;
  color: #495057;
  display: block;
  margin-bottom: 0.5rem;
}

.highlight-name {
  font-size: 5.5rem; /* 超大字体 */
  letter-spacing: -2px;
  display: inline-block;
  position: relative;
  z-index: 2;
}

/* 能量线动画 SVG */
.energy-underline {
  position: absolute;
  bottom: -15px;
  left: 0;
  width: 100%;
  height: 20px;
  overflow: visible;
}
.energy-underline path {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: drawLine 2s ease-out forwards 0.5s;
}

.sub-heading {
  font-size: 1.2rem;
  font-weight: 600;
  color: #868e96;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 3rem;
}

/* 技能列表 */
.skill-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skill-item {
  font-size: 1.4rem;
  font-weight: 700;
  color: #343a40;
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0;
  transform: translateX(-20px);
  animation: fadeInRight 0.5s ease-out forwards;
}

.icon {
  font-size: 1.2rem;
}

/* 便利贴 (重定位) */
.sticky-note {
  position: absolute;
  top: -60px;
  right: -20px; /* 放在文字框的右上角 */
  width: 110px;
  height: 110px;
  background-color: #ffec99; /* 黄色便利贴 */
  box-shadow: 3px 3px 10px rgba(0,0,0,0.1);
  transform: rotate(5deg);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 'Caveat', cursive;
  font-size: 1.4rem;
  line-height: 1.1;
  color: #333;
  z-index: 5;
  animation: gentle-sway 4s ease-in-out infinite;
}

.note-pin {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;
}

/* --- 右侧模型区域 --- */
.model-area {
  position: relative;
  height: 70vh; /* 使用视口高度，保证模型足够大 */
  min-height: 500px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.model-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  /* 去掉这里的transform，避免冲突，动画只做上下浮动 */
}

/* 浮动动画 */
.floating-anim {
  animation: levitate 6s ease-in-out infinite;
}

.huge-model {
  width: 100%;
  height: 100%;
  /* 移除模型自带的边框聚焦颜色 */
  --poster-color: transparent;
}

/* 手绘箭头 */
.sketch-arrow {
  position: absolute;
  bottom: 10%;
  left: 0;
  width: 80px;
  height: 80px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 13l-6-6-6 6'/%3E%3Cpath d='M12 7v10'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
  opacity: 0.15;
  transform: rotate(90deg); /* 指向模型 */
}

/* --- 装饰元素 --- */
.floating-decorations {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.doodle {
  position: absolute;
  opacity: 0.1;
  border: 2px solid #333;
}

.circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  top: 15%;
  left: 50%;
  border-color: #4dabf7;
  animation: float 8s infinite;
}

.triangle {
  width: 0;
  height: 0;
  border: none;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 35px solid rgba(255, 107, 107, 0.3);
  bottom: 15%;
  left: 45%;
  animation: float 12s infinite reverse;
}

.cross {
  width: 30px;
  height: 30px;
  top: 20%;
  right: 10%;
  border: none;
  background:
      linear-gradient(#333, #333),
      linear-gradient(#333, #333);
  background-position: center;
  background-size: 100% 2px, 2px 100%;
  background-repeat: no-repeat;
  transform: rotate(45deg);
  opacity: 0.2;
}

/* --- 动画关键帧 --- */
@keyframes levitate {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes drawLine {
  to { stroke-dashoffset: 0; }
}

@keyframes fadeInRight {
  to { opacity: 1; transform: translateX(0); }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(15px, -15px) rotate(10deg); }
}

@keyframes gentle-sway {
  0%, 100% { transform: rotate(5deg); }
  50% { transform: rotate(2deg); }
}

/* --- 响应式调整 --- */
@media (max-width: 992px) {
  .highlight-name { font-size: 4rem; }
  .layout-grid {
    grid-template-columns: 1fr; /* 变回单列 */
    text-align: center;
    gap: 1rem;
  }
  .content-wrapper { margin: 0 auto; }
  .skill-item { justify-content: center; }

  /* 在移动端，把模型放上面或者下面 */
  .model-area { order: -1; height: 50vh; }
  .text-area { padding-top: 0; }

  .sticky-note {
    position: relative;
    top: auto; right: auto;
    margin: 20px auto;
    transform: rotate(-2deg);
  }
}

@media (max-width: 576px) {
  .highlight-name { font-size: 3rem; }
  .greeting { font-size: 1.5rem; }
  .model-area { height: 45vh; }
}
</style>