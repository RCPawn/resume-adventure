<template>
  <section id="projects" class="projects-wrapper">
    <div class="cyber-container">
      <div class="main-layout">

        <aside class="index-bus">
          <div class="sticky-content">
            <div class="title-group">
              <span class="prefix">// ARCHIVE_INDEX</span>
              <h1 class="main-title">{{ t('projects.title') }}</h1>
              <p class="subtitle">{{ t('projects.subtitle') }}</p>
            </div>

            <div class="scroll-indicator">
              <div
                  v-for="(p, i) in projects"
                  :key="i"
                  class="indicator-dot"
                  :class="{ active: currentActive === i }"
              >
                <span class="dot-label">P_{{ (i+1).toString().padStart(2,'0') }}</span>
              </div>
            </div>
            <div class="decoration-dots"></div>
          </div>
        </aside>

        <div class="data-stream" ref="scrollContainer">
          <div
              v-for="(project, index) in projects"
              :key="project.name"
              class="project-node"
              :data-index="index"
              @mouseenter="playTickSound"
              @click="handleProjectClick(project)"
          >
            <div class="node-background">
              <img :src="project.image" :alt="project.name" class="bg-image" />
              <div class="image-tint"></div>
              <div class="glitch-overlay"></div>
            </div>

            <div class="node-overlay">
              <div class="scan-bar"></div>
              <div class="neon-border"></div>
            </div>

            <div class="node-content-glass">
              <div class="content-inner">
                <div class="node-header">
                  <span class="node-serial">ID: {{ (index + 1).toString().padStart(2, '0') }}</span>
                  <h3 class="node-title">{{ project.name }}</h3>
                </div>

                <p class="node-desc">{{ project.description }}</p>

                <div class="node-footer">
                  <div class="tag-cloud">
                    <span v-for="tag in (project.tags || ['SYSTEM'])" :key="tag" class="p-tag">
                      #{{ tag }}
                    </span>
                  </div>
                  <div class="detail-link">
                    <span class="link-text">查看详情</span>
                    <span class="link-arrow"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WeatherModal :show="showWeatherModal" :isMobile="isMobile" @close="closeWeatherModal" />
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import projectsData from '@/data/projects.json';
import WeatherModal from '@/components/WeatherModel.vue';

const { t } = useI18n();
const router = useRouter();
const showWeatherModal = ref(false);
const currentActive = ref(0);
const isMobile = ref(false);

const projects = computed(() => projectsData.map(p => ({
  ...p,
  name: t(p.nameKey),
  description: t(p.descriptionKey),
})));

// --- 🔉 音效逻辑 ---
let audioCtx = null;
const initAudio = () => { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); };
const playTickSound = () => {
  if (!audioCtx) initAudio();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.008, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime + 0.03);
};

// --- 滚动监听 ---
let observer = null;
onMounted(() => {
  document.addEventListener('mousedown', initAudio, { once: true });
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) currentActive.value = parseInt(entry.target.dataset.index); });
  }, { threshold: 0.6 });
  document.querySelectorAll('.project-node').forEach(node => observer.observe(node));
});
onUnmounted(() => { if (observer) observer.disconnect(); });

const handleProjectClick = (p) => {
  if (p.link === '/weather') showWeatherModal.value = true;
  else if (p.link) router.push(p.link);
};
const closeWeatherModal = () => { showWeatherModal.value = false; };
</script>

<style scoped>
.projects-wrapper {
  padding: 120px 0 100px 0;
}

.cyber-container {
  max-width: 1100px;
  margin-left: calc(50% - 530px);
  margin-right: auto;
  padding: 0 43px;
}

.main-layout {
  display: flex;
  gap: 20px;
}

/* 左侧固定区：尺寸完全保留 */
.index-bus { width: 260px; }
.sticky-content { position: sticky; top: 120px; }
.prefix { font-family: monospace; color: var(--primary-color); font-size: 0.8rem; font-weight: bold; }
.main-title { font-size: 2.2rem; font-weight: 800; margin: 10px 0; color: var(--text-color); }
.subtitle { color: var(--secondary-color); font-size: 0.95rem; line-height: 1.6; margin-bottom: 40px; }

.scroll-indicator {
  display: flex; flex-direction: column; gap: 15px;
  border-left: 1px solid var(--border-color); padding-left: 20px;
}
.indicator-dot { font-size: 0.7rem; font-family: monospace; color: var(--secondary-color); opacity: 0.3; transition: 0.3s; }
.indicator-dot.active { color: var(--primary-color); opacity: 1; transform: translateX(5px); font-weight: bold; }

/* 右侧全景数据流：尺寸完全保留 */
.data-stream { width: calc(100% - 260px - 20px); display: flex; flex-direction: column; gap: 60px; }

/* ========== 核心优化：图片显示+底部阴影 ========== */
.project-node {
  position: relative;
  min-height: 480px;
  background: var(--modal-bg);
  border: 1px solid rgba(var(--primary-color), 0.2);
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: flex-end;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  transform: none;
  box-shadow: 0 0 0 rgba(var(--primary-color), 0);
}

.project-node:hover {
  transform: translateY(-5px);
  border-color: var(--primary-color);
  box-shadow: 0 0 30px rgba(var(--primary-color), 0.3),
  inset 0 0 10px rgba(var(--primary-color), 0.1);
}

/* 修复图片放大导致不完整：取消缩放，保持完整显示 */
.node-background {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 1;
}
.bg-image {
  width: 100%; height: 100%;
  object-fit: cover; /* 保持图片比例覆盖容器，不裁剪关键内容 */
  opacity: 0.8; /* 提高透明度，让图片更清晰完整 */
  transition: opacity 0.8s ease; /* 去掉缩放动画，保留透明度过渡 */
  transform: translate(0, 0); /* 固定位置，不偏移 */
}
.project-node:hover .bg-image {
  transform: translate(0, 0); /* 取消hover缩放，保持图片完整 */
  opacity: 0.9; /* 轻微提高透明度，不影响完整性 */
}

/* 优化底部阴影：更柔和，贴近示例图风格 */
.image-tint {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.1) 0%,
      rgba(0,0,0,0.2) 40%,
      rgba(0,0,0,0.4) 80%, /* 降低中间层阴影 */
      rgba(0,0,0,0.5) 100% /* 减轻底部阴影，更柔和 */
  );
}

/* 故障风光影层 */
.glitch-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  z-index: 1;
  background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(var(--primary-color), 0.02) 50%,
      transparent 100%
  );
  pointer-events: none;
  animation: glitchMove 8s linear infinite;
}

/* 装饰层：保持原有样式 */
.node-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2; pointer-events: none; }
.scan-bar {
  position: absolute; top: 0; left: 0; width: 100%; height: 1px;
  background: var(--primary-color);
  opacity: 0.6;
  filter: blur(1px);
  animation: scanLoop 4s linear infinite;
}
.neon-border {
  position: absolute;
  top: 2px; left: 2px; right: 2px; bottom: 2px;
  border: 1px solid transparent;
  border-radius: 2px;
  background: linear-gradient(var(--modal-bg), var(--modal-bg)) padding-box,
  linear-gradient(90deg,
      transparent,
      rgba(var(--primary-color), 0.6),
      transparent) border-box;
  background-size: 200% 100%;
  animation: borderFlow 3s linear infinite;
  pointer-events: none;
}

/* 透明内容层：保持原有样式 */
.node-content-glass {
  position: relative;
  z-index: 3;
  width: 100%;
  padding: 40px;
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  transition: 0.3s;
}

.project-node:hover .node-content-glass {
  background: transparent;
}

.node-header { margin-bottom: 20px; }
.node-serial {
  font-family: monospace;
  color: var(--primary-color);
  font-size: 0.7rem;
  letter-spacing: 2px;
  text-shadow: 0 0 5px rgba(var(--primary-color), 0.5);
}
.node-title {
  font-size: 1.6rem;
  font-weight: 800;
  margin: 8px 0;
  color: #ffffff;
  background: linear-gradient(120deg, #fff, rgba(var(--primary-color), 0.9));
  -webkit-background-clip: text;
  background-clip: text;
  text-shadow: 0 0 8px rgba(var(--primary-color), 0.2);
}

.node-desc {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
  line-height: 1.8;
  margin-bottom: 30px;
  max-width: 90%;
}

.node-footer { display: flex; justify-content: space-between; align-items: center; }
.p-tag {
  font-size: 0.7rem;
  color: var(--primary-color);
  background: rgba(var(--primary-color), 0.15);
  padding: 3px 9px;
  border-radius: 3px;
  margin-right: 10px;
  font-family: monospace;
  transition: all 0.2s;
}
.project-node:hover .p-tag {
  background: rgba(var(--primary-color), 0.25);
  box-shadow: 0 0 5px rgba(var(--primary-color), 0.3);
}

.detail-link {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--primary-color);
  font-family: monospace;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(var(--primary-color), 0.5);
}
.link-arrow {
  width: 12px;
  height: 2px;
  background: var(--primary-color);
  position: relative;
  transition: 0.3s;
  filter: blur(0.5px);
}
.link-arrow::after {
  content: '';
  position: absolute;
  right: 0;
  top: -3px;
  width: 6px;
  height: 6px;
  border-top: 2px solid var(--primary-color);
  border-right: 2px solid var(--primary-color);
  transform: rotate(45deg);
  filter: blur(0.5px);
}
.project-node:hover .link-arrow { width: 20px; }

/* 动画保持不变 */
@keyframes scanLoop { 0% { top: 0; } 100% { top: 100%; } }
@keyframes glitchMove { 0% { background-position: 0 0; } 100% { background-position: 200% 0; } }
@keyframes borderFlow { 0% { background-position: 0 0; } 100% { background-position: 200% 0; } }

/* 响应式：完全保留 */
@media (max-width: 900px) {
  .cyber-container { margin: 0 auto; padding: 0 20px; }
  .main-layout { flex-direction: column; }
  .index-bus, .data-stream { width: 100%; }
  .sticky-content { position: relative; top: 0; margin-bottom: 40px; }
  .project-node { transform: none; }
  .project-node:hover { transform: translateY(-5px) rotateX(0); }
}

/* 大屏优化（27寸及以上） */
@media (min-width: 1600px) {
  .cyber-container { max-width: 1300px; margin-left: calc(50% - 630px); }
  .project-node { min-height: 540px; }
  .main-title { font-size: 2.5rem; }
  .subtitle { font-size: 1.05rem; }
  .node-title { font-size: 1.8rem; }
  .node-desc { font-size: 1.05rem; max-width: 95%; }
  .node-content-glass { padding: 48px; }
}
</style>