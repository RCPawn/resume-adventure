<template>
  <section class="hero-section">
    <!-- 背景纹理保持不变 -->
    <div class="paper-texture">
      <div class="grid-lines"></div>
    </div>

    <div class="container-fluid">
      <div class="layout-grid">
        <!-- 左侧：文字信息 (保持不变) -->
        <div class="text-area">
          <div class="content-wrapper">
            <div class="title-group">
              <h1 class="main-name">
                <span class="greeting">HEY, I AM</span>
                <br>
                <div class="name-container">
                  <span class="highlight-name">RCPAWN</span>
                  <svg class="energy-underline" viewBox="0 0 200 20" preserveAspectRatio="none">
                    <path d="M5,15 Q50,5 100,15 T195,15" fill="none" stroke="#4dabf7" stroke-width="8" />
                  </svg>
                  <div class="sticky-note">
                    <span class="note-pin">📌</span>
                    <div class="note-content"><p>Less is<br>more</p></div>
                  </div>
                </div>
              </h1>
            </div>
            <h2 class="sub-heading">{{ t('subtitle') || 'A SOFTWARE ENGINEERING STUDENT' }}</h2>
            <div class="skill-list">
              <div v-for="(prof, index) in tm('professions')" :key="index" class="skill-item" :style="{ animationDelay: `${0.2 + index * 0.1}s` }">
                <span class="text">{{ prof }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：3D 模型展示 (核心修改) -->
        <div class="model-area">
          <div class="model-wrapper floating-anim">
            <!--
               核心优化属性说明：
               1. poster: 加载前显示的静态图，消除等待感。
               2. reveal="auto": 加载完自动淡入。
               3. loading="eager": 它是首屏内容，需要立即加载。
               4. disable-zoom: 禁止鼠标滚轮缩放。
               5. disable-pan: 禁止右键/双指拖动平移。
               6. interaction-prompt="none": 不显示那个烦人的“小手”提示。
            -->
            <model-viewer
                src="/models/mystery_shack.glb"
                poster="/images/mystery_shack_poster.webp"
                alt="Mystery Shack 3D Model"
                loading="eager"
                reveal="auto"
                camera-controls
                disable-zoom
                disable-pan
                interaction-prompt="none"
                auto-rotate
                auto-rotate-delay="1000"
                rotation-per-second="15deg"
                shadow-intensity="1.5"
                shadow-softness="0.8"
                camera-orbit="41.43deg 75.41deg 90%"
                min-camera-orbit="auto auto 90%"
                max-camera-orbit="auto auto 90%"
                class="huge-model"
            >
              <!-- 自定义加载时的样式：这里我们把默认的进度条隐藏掉，
                   或者做一个极简的 Loading 提示（可选，但我建议什么都不加，最沉浸） -->
              <div slot="progress-bar"></div>
            </model-viewer>
          </div>
        </div>
      </div>
    </div>

    <!-- 漂浮装饰 (保持不变) -->
    <div class="floating-decorations">
      <div class="doodle circle"></div>
      <div class="doodle triangle"></div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import '@google/model-viewer';

const { t, tm } = useI18n();

// 📸 临时函数：点击模型就能下载完美海报
/*const downloadPoster = () => {
  const model = document.querySelector('model-viewer');
  const link = document.createElement('a');
  link.download = 'perfect_poster.webp';
  // 抓取当前渲染画面
  link.href = model.toDataURL('/images');
  link.click();
  console.log('海报已下载！记得把这个函数删掉哦');
};*/
</script>

<style scoped>
/* ... (保留你原有的字体导入和布局样式) ... */
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Inter:wght@400;800&display=swap');

/* --- 基础布局 --- */
.hero-section {
  position: relative;
  height: calc(100vh - 80px);
  width: 100%;
  background-color: transparent;
  color: var(--text-color);
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: flex-start;
  padding-top: 10vh;
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
  gap: 6rem;
}

/* ... (保留名字、便利贴、文字区域的样式，不需要改动) ... */
.name-container { position: relative; display: inline-block; }
.highlight-name { font-size: 5.8rem; letter-spacing: -2px; font-weight: 900; line-height: 1; color: var(--text-color); }
.energy-underline { position: absolute; bottom: -4px; left: 0; width: 105%; height: 20px; z-index: -1; pointer-events: none; }
.energy-underline path { stroke: var(--primary-color); stroke-dasharray: 400; stroke-dashoffset: 400; stroke-linecap: round; animation: drawLine 3s ease-in-out forwards 0.8s; }
.sticky-note { position: absolute; top: -25px; right: -105px; width: 95px; height: 95px; background-color: #fcc419; box-shadow: var(--hover-shadow); transform: rotate(8deg); display: flex; justify-content: center; align-items: center; text-align: center; font-family: 'Caveat', cursive; font-size: 1.2rem; line-height: 1; color: #1f2937; z-index: 5; }
.note-pin { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); font-size: 1.4rem; color: #e63946; }
.text-area { justify-self: end; }
.greeting { font-size: 2rem; color: var(--text-color); font-weight: 800; }
.sub-heading { font-size: 1.1rem; font-weight: 700; color: var(--secondary-color); margin: 1.5rem 0 2rem 0; }
.skill-list { display: flex; flex-direction: column; gap: 0.8rem; }
.skill-item { font-size: 1.2rem; font-weight: 700; color: var(--text-color); opacity: 0; animation: fadeInRight 0.5s ease-out forwards; }

/* --- 3D 模型区域优化 --- */
.model-area {
  justify-self: start;
  position: relative;
  height: 65vh;
  width: 100%;
  display: flex;
  align-items: center;
}

.model-wrapper {
  width: 100%;
  height: 100%;
}

.huge-model {
  width: 100%;
  height: 100%;
  outline: none;
  /* 隐藏 model-viewer 自带的灰色背景，让它完全透明 */
  --poster-color: transparent;
}

/* 🔥 关键样式：隐藏 ModelViewer 默认的蓝色加载条 */
.huge-model::part(default-progress-bar) {
  display: none;
  opacity: 0;
}

/* 动画关键帧保持不变 */
@keyframes drawLine { to { stroke-dashoffset: 0; } }
@keyframes fadeInRight { from { opacity: 0; transform: translateX(-15px); } to { opacity: 1; transform: translateX(0); } }
.floating-anim { animation: levitate 6s ease-in-out infinite; }
@keyframes levitate { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }

/* 响应式适配 */
@media (max-width: 1024px) {
  .hero-section { padding-top: 5vh; }
  .layout-grid { grid-template-columns: 1fr; text-align: center; gap: 2rem; }
  .text-area { justify-self: center; padding-right: 0; }
  .model-area { justify-self: center; height: 45vh; }
  .sticky-note { right: 0; top: -40px; }
}

/* 大屏优化（27寸及以上） */
@media (min-width: 1600px) {
  .container-fluid { max-width: 1600px; }
  .layout-grid { gap: 8rem; }
  .highlight-name { font-size: 6.8rem; }
  .greeting { font-size: 2.3rem; }
  .sub-heading { font-size: 1.3rem; }
  .skill-item { font-size: 1.4rem; }
  .model-area { height: 70vh; }
}
</style>