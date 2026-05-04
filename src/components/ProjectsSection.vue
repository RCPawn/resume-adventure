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
                <span class="dot-label">P_{{ (i + 1).toString().padStart(2, '0') }}</span>
              </div>
            </div>
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
                <header class="node-header">
                  <span class="node-serial">ID · {{ (index + 1).toString().padStart(2, '0') }}</span>
                  <h3 class="node-title">{{ project.name }}</h3>
                </header>

                <div class="node-copy">
                  <p class="node-desc">{{ project.description }}</p>
                  <div class="node-copy-dateline">
                    <time
                      class="node-copy-date"
                      :datetime="project.dateIso || undefined"
                    >{{ project.footerDateLine }}</time>
                  </div>
                </div>

                <div class="node-footer">
                  <div class="tag-cloud">
                    <span v-for="tag in (project.tags || ['SYSTEM'])" :key="tag" class="p-tag">
                      #{{ tag }}
                    </span>
                  </div>
                  <div class="detail-link">
                    <span class="link-text">{{ t('projects.viewDetails') }}</span>
                    <span class="link-arrow" aria-hidden="true"></span>
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

const toSortTime = (iso) => {
  if (!iso || !String(iso).trim()) return 0;
  const n = String(iso).trim();
  const ms = Date.parse(/^\d{4}-\d{2}-\d{2}$/.test(n) ? `${n}T12:00:00` : n);
  return Number.isNaN(ms) ? 0 : ms;
};

const formatCardDateCompact = (iso) => {
  if (!iso || !String(iso).trim()) return '—';
  const n = String(iso).trim();
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(n) ? `${n}T12:00:00` : n);
  if (Number.isNaN(d.getTime())) return '—';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
};

const projects = computed(() => {
  const sorted = [...projectsData].sort((a, b) => {
    const diff = toSortTime(b.date) - toSortTime(a.date);
    if (diff !== 0) return diff;
    return String(a.nameKey).localeCompare(String(b.nameKey), 'en');
  });
  return sorted.map((p) => {
    const raw = p.date && String(p.date).trim();
    const dateIso = raw && /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : '';
    const compact = formatCardDateCompact(p.date);
    const footerDateLine =
      compact === '—'
        ? `${t('projects.dateCaption')} · ${t('projects.dateUnknown')}`
        : `${t('projects.dateCaption')} · ${compact}`;
    return {
      ...p,
      name: t(p.nameKey),
      description: t(p.descriptionKey),
      footerDateLine,
      dateIso,
    };
  });
});

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
  /* 顶距 120 → 80，与 Hero 垂直居中后的底部留白衔接更自然，不再产生大空洞 */
  padding: 80px 0 100px 0;
}

/*
 * 主内容区：与 HeroSection 共用 main.css 的 --page-*（与顶栏独立）
 */
.cyber-container {
  max-width: var(--page-content-max-width);
  margin: 0 auto;
  padding: 0 var(--page-content-pad-x);
}

.main-layout {
  display: flex;
  gap: 20px;
}

/* 左侧固定区（无外层卡套，与早期版一致） */
.index-bus {
  width: var(--page-index-rail-width);
  flex-shrink: 0;
}
.sticky-content {
  position: sticky;
  top: 120px;
}
.prefix {
  font-family: var(--font-mono);
  color: var(--primary-color);
  font-size: var(--section-heading-prefix-size);
  font-weight: bold;
  letter-spacing: normal;
}
.main-title {
  font-size: var(--section-heading-title-size);
  font-weight: 800;
  margin: 10px 0;
  color: var(--text-color);
}
.subtitle {
  color: var(--secondary-color);
  font-size: var(--section-heading-subtitle-size);
  line-height: 1.6;
  margin-bottom: 40px;
}

.scroll-indicator {
  display: flex;
  flex-direction: column;
  gap: 15px;
  border-left: 1px solid var(--border-color);
  padding-left: 20px;
}
.indicator-dot {
  font-size: 0.7rem;
  font-family: var(--font-mono);
  color: var(--secondary-color);
  opacity: 0.3;
  transition: 0.3s;
}
.indicator-dot.active {
  color: var(--primary-color);
  opacity: 1;
  transform: translateX(5px);
  font-weight: bold;
}

/* 右侧全景数据流 */
.data-stream {
  width: calc(100% - var(--page-index-rail-width) - var(--page-main-layout-gap));
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 60px;
}

/* ========== 核心优化：图片显示+底部阴影 ========== */
.project-node {
  position: relative;
  min-height: 480px;
  background: var(--modal-bg);
  border: 1px solid var(--border-color);
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: flex-end;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
  transform: none;
  box-shadow: var(--hover-shadow);
  border-radius: 12px;
}

.project-node:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--border-color) 65%, var(--primary-color) 35%);
  box-shadow:
    0 16px 48px -20px rgba(15, 23, 42, 0.18),
    0 0 0 1px color-mix(in srgb, var(--border-color) 90%, var(--primary-color) 10%);
}

html.dark .project-node:hover {
  box-shadow:
    0 20px 50px -24px rgba(0, 0, 0, 0.55),
    0 0 0 1px color-mix(in srgb, var(--border-color) 75%, var(--primary-color) 25%);
}

/* 修复图片放大导致不完整：取消缩放，保持完整显示 */
.node-background {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 1;
}
.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 1;
  transition: opacity 0.45s ease;
}
.project-node:hover .bg-image {
  opacity: 1;
}

/* 遮罩：仅在卡片下半段加深，上半段大面积留白给封面图 */
.image-tint {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 42%,
    rgba(0, 0, 0, 0.12) 62%,
    rgba(0, 0, 0, 0.55) 88%,
    rgba(0, 0, 0, 0.62) 100%
  );
}

/* 深浅色共用同一套底部暗条：浅色不再单独盖白/毛玻璃，封面与深色一致可见 */
.glitch-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(var(--primary-color-rgb), 0.025) 50%,
    transparent 100%
  );
  animation: glitchMove 10s linear infinite;
  opacity: 0.5;
}

html:not(.dark) .glitch-overlay {
  display: none;
}

.node-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

/* 扫描线：深色极淡；亮色关闭（避免横跨卡片的白/蓝线） */
.scan-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--primary-color);
  opacity: 0.12;
  animation: scanLoop 5s linear infinite;
}

html:not(.dark) .scan-bar {
  display: none;
}

/*
 * 渐变描边：padding-box 须透明；亮色关闭动画描边（易出现中间亮带）
 */
.neon-border {
  position: absolute;
  top: 1px;
  left: 1px;
  right: 1px;
  bottom: 1px;
  border: 1px solid transparent;
  border-radius: 11px;
  background: linear-gradient(transparent, transparent) padding-box,
    linear-gradient(
      90deg,
      transparent,
      rgba(var(--primary-color-rgb), 0.22),
      transparent
    ) border-box;
  background-size: 200% 100%;
  animation: borderFlow 5s linear infinite;
  pointer-events: none;
  opacity: 0.55;
}

html:not(.dark) .neon-border {
  display: none;
}

/* 底部文案区：与主题无关，统一暗底渐变（浅色亦同深色，保证图可见） */
.node-content-glass {
  position: relative;
  z-index: 3;
  width: 100%;
  padding: 28px 36px 30px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 0, 0, 0.35) 18%,
    rgba(0, 0, 0, 0.72) 100%
  );
  transition: background 0.3s ease;
}

.project-node:hover .node-content-glass {
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 0, 0, 0.42) 18%,
    rgba(0, 0, 0, 0.78) 100%
  );
}

.content-inner {
  display: flex;
  flex-direction: column;
  gap: 0;
  max-width: 100%;
}

.node-header {
  margin-bottom: 1rem;
}

.node-serial {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-mono);
  color: color-mix(in srgb, var(--primary-color) 92%, white);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.node-title {
  font-size: clamp(1.35rem, 1.1vw + 1rem, 1.75rem);
  font-weight: 800;
  margin: 0.45rem 0 0;
  line-height: 1.25;
  letter-spacing: -0.03em;
  color: #f1f5f9;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
}

.node-copy {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: 0 0 0.6rem;
  padding: 0 0 0 0.95rem;
  border-left: 2px solid rgba(var(--primary-color-rgb), 0.45);
  max-width: 42rem;
}

.node-desc {
  font-size: 0.95rem;
  line-height: 1.72;
  letter-spacing: 0.01em;
  margin: 0;
  color: rgba(248, 250, 252, 0.94);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
}

/* 仅占文案宽度，避免整行拉满后右侧时间左侧大片留白 */
.node-copy-dateline {
  align-self: flex-start;
  width: fit-content;
  max-width: 100%;
  margin-top: 0.5rem;
}

.node-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem 1.25rem;
  padding-top: 0.65rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.node-copy-date {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.64rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  font-variant-numeric: tabular-nums;
  color: rgba(248, 250, 252, 0.68);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
  line-height: 1.35;
  white-space: nowrap;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.p-tag {
  font-size: 0.65rem;
  color: color-mix(in srgb, var(--primary-color) 92%, white);
  background: rgba(var(--primary-color-rgb), 0.12);
  padding: 4px 10px;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-weight: 500;
  letter-spacing: 0.02em;
  border: 1px solid rgba(var(--primary-color-rgb), 0.22);
  transition: background 0.2s ease, border-color 0.2s ease;
}

.project-node:hover .p-tag {
  background: rgba(var(--primary-color-rgb), 0.18);
  border-color: rgba(var(--primary-color-rgb), 0.32);
}

.detail-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-color);
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 0.72rem;
  letter-spacing: 0.04em;
}

.link-arrow {
  width: 14px;
  height: 2px;
  background: var(--primary-color);
  position: relative;
  transition: width 0.25s ease;
  flex-shrink: 0;
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
}

.project-node:hover .link-arrow {
  width: 20px;
}

/* 动画保持不变 */
@keyframes scanLoop { 0% { top: 0; } 100% { top: 100%; } }
@keyframes glitchMove { 0% { background-position: 0 0; } 100% { background-position: 200% 0; } }
@keyframes borderFlow { 0% { background-position: 0 0; } 100% { background-position: 200% 0; } }

/* 响应式：完全保留 */
@media (max-width: 900px) {
  .cyber-container { margin: 0 auto; }
  .main-layout { flex-direction: column; }
  .index-bus, .data-stream { width: 100%; }
  .sticky-content { position: relative; top: 0; margin-bottom: 40px; }
  .project-node { transform: none; }
  .project-node:hover { transform: translateY(-4px); }
}

@media (max-width: 520px) {
  .node-footer {
    flex-direction: column;
    align-items: stretch;
  }
  .node-copy-date {
    font-size: 0.62rem;
  }
}

/* 大屏优化（27寸及以上） */
@media (min-width: 1600px) {
  .project-node { min-height: 540px; }
  .node-title { font-size: 1.8rem; }
  .node-desc { font-size: 1.05rem; max-width: 95%; }
  .node-content-glass { padding: 34px 44px 34px; }
}

/* 2K / 27" 常见视口：再放宽主栏并略放大卡片与正文，避免相对屏幕「缩在中间一小块」 */
@media (min-width: 1920px) {
  .project-node {
    min-height: 600px;
  }
  .node-title {
    font-size: clamp(1.75rem, 0.9vw + 1.2rem, 2rem);
  }
  .node-desc {
    font-size: 1.08rem;
    line-height: 1.75;
    max-width: min(52rem, 95%);
  }
  .node-content-glass {
    padding: 38px 48px 38px;
  }
}
</style>