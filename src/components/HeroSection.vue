<template>
  <section class="hero-section light-theme">
    <!-- 1. 背景纹理 -->
    <div class="paper-texture">
      <div class="grid-lines"></div>
    </div>

    <div class="container-fluid">
      <div class="layout-grid">
        <!-- 左侧：文字信息 -->
        <div class="text-area">
          <div class="content-wrapper">
            <div class="title-group">
              <h1 class="main-name">
                <span class="greeting">HEY, I AM</span>
                <br>
                <div class="name-container">
                  <span class="highlight-name">RCPAWN</span>

                  <!-- 能量线下划线 (动画降速至3s) -->
                  <svg class="energy-underline" viewBox="0 0 200 20" preserveAspectRatio="none">
                    <path d="M5,15 Q50,5 100,15 T195,15" fill="none" stroke="#4dabf7" stroke-width="8" />
                  </svg>

                  <!-- 便利贴 (位置偏移，不遮挡文字) -->
                  <div class="sticky-note">
                    <span class="note-pin">📌</span>
                    <div class="note-content">
                      <p>Less is<br>more</p>
                    </div>
                  </div>
                </div>
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
                <span class="text">{{ prof }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：3D 模型展示 -->
        <div class="model-area">
          <div class="model-wrapper floating-anim">
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
                camera-orbit="-20deg 75deg 90%"
                field-of-view="25deg"
                min-camera-orbit="auto auto 5%"
                class="huge-model"
                @progress="onProgress"
            >
              <div slot="poster" class="custom-loader-overlay">
                <div class="loader-box">
                  <div class="loader-circle"></div>
                  <div class="loader-text">模型加载中</div>
                  <div class="loader-bar-container">
                    <div class="loader-bar-fill" :style="{ width: loadProgress + '%' }"></div>
                  </div>
                  <div class="loader-percentage">{{ loadProgress }}%</div>
                </div>
              </div>
            </model-viewer>
          </div>
        </div>
      </div>
    </div>

    <!-- 漂浮装饰 -->
    <div class="floating-decorations">
      <div class="doodle circle"></div>
      <div class="doodle triangle"></div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import '@google/model-viewer';

const { t, tm } = useI18n();
const loadProgress = ref(0);

const onProgress = (event) => {
  loadProgress.value = Math.round(event.detail.totalProgress * 100);
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Inter:wght@400;800&display=swap');

/* --- 基础布局优化：整体上移 --- */
.hero-section {
  position: relative;
  height: calc(100vh - 80px);
  width: 100%;
  background-color: transparent;
  color: inherit;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: flex-start; /* 改为靠顶对齐 */
  padding-top: 10vh; /* 通过 padding 控制上移程度，10vh 比较适中 */
}

.container-fluid {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 4%;
  z-index: 10;
}

.layout-grid {
  display: grid;
  grid-template-columns: minmax(400px, 1fr) minmax(500px, 1.1fr);
  align-items: center;
  justify-content: center;
  gap: 6rem; /* 保持满意的间距 */
}

/* --- 名字区域 --- */
.name-container {
  position: relative;
  display: inline-block;
}

.highlight-name {
  font-size: 5.8rem;
  letter-spacing: -2px;
  font-weight: 900;
  line-height: 1;
}

.energy-underline {
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 105%;
  height: 20px;
  z-index: -1;
  pointer-events: none;
}

.energy-underline path {
  stroke-dasharray: 400;
  stroke-dashoffset: 400;
  stroke-linecap: round;
  animation: drawLine 3s ease-in-out forwards 0.8s;
}

/* --- 便利贴 --- */
.sticky-note {
  position: absolute;
  top: -25px;
  right: -105px; /* 进一步向右，确保不遮挡文字 */
  width: 95px;
  height: 95px;
  background-color: #fcc419;
  box-shadow: 6px 6px 0px rgba(0,0,0,0.1);
  transform: rotate(8deg);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 'Caveat', cursive;
  font-size: 1.2rem;
  line-height: 1;
  color: #333;
  z-index: 5;
}

.note-pin {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.4rem;
}

@keyframes napkinBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
}

/* --- 文字与组件样式 --- */
.text-area { justify-self: end; }
.greeting { font-size: 2rem; color: #495057; font-weight: 800; }
.sub-heading { font-size: 1.1rem; font-weight: 700; color: #868e96; margin: 1.5rem 0 2rem 0; }
.skill-list { display: flex; flex-direction: column; gap: 0.8rem; }
.skill-item { font-size: 1.2rem; font-weight: 700; opacity: 0; animation: fadeInRight 0.5s ease-out forwards; }

.model-area { justify-self: start; position: relative; height: 65vh; width: 100%; display: flex; align-items: center; }
.model-wrapper { width: 100%; height: 100%; }
.huge-model { width: 100%; height: 100%; outline: none; --poster-color: transparent; }

/* --- 加载提示 --- */
.custom-loader-overlay {
  position: absolute; inset: 0; background-color: rgba(33, 37, 41, 0.92);
  display: flex; align-items: center; justify-content: center; z-index: 100;
}
.loader-box { width: 200px; display: flex; flex-direction: column; align-items: center; }
.loader-circle { width: 36px; height: 36px; border: 3px solid rgba(255,255,255,0.1); border-top: 3px solid #339af0; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px; }
.loader-text { color: #ffffff; font-size: 1rem; font-weight: 700; margin-bottom: 12px; }
.loader-bar-container { width: 100%; height: 5px; background-color: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden; }
.loader-bar-fill { height: 100%; background: #339af0; transition: width 0.3s ease; }
.loader-percentage { color: #adb5bd; font-size: 0.8rem; margin-top: 8px; }

/* --- 通用动画 --- */
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes drawLine { to { stroke-dashoffset: 0; } }
@keyframes fadeInRight { from { opacity: 0; transform: translateX(-15px); } to { opacity: 1; transform: translateX(0); } }
.floating-anim { animation: levitate 6s ease-in-out infinite; }
@keyframes levitate { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }

/* --- 背景纹理 --- */
.paper-texture { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.grid-lines {
  width: 100%; height: 100%;
  background-image: linear-gradient(rgba(128, 128, 128, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(128, 128, 128, 0.1) 1px, transparent 1px);
  background-size: 35px 35px;
}

@media (max-width: 1024px) {
  .hero-section { padding-top: 5vh; }
  .layout-grid { grid-template-columns: 1fr; text-align: center; gap: 2rem; }
  .text-area { justify-self: center; padding-right: 0; }
  .model-area { justify-self: center; height: 45vh; }
  .sticky-note { right: 0; top: -40px; }
  .scroll-down-indicator { bottom: 2vh; }
}
</style>