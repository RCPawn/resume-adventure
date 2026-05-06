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

            <nav class="scroll-indicator" :aria-label="t('projects.indexRailAria')">
              <div
                  v-for="(p, i) in projects"
                  :key="p.id || `rail-${i}`"
                  class="indicator-dot"
                  :class="{ active: currentActive === i }"
                  role="button"
                  tabindex="0"
                  :aria-label="t('projects.indexJumpAria', { n: i + 1, total: projects.length, short: p.indexShort })"
                  :aria-current="currentActive === i ? 'true' : undefined"
                  @click.stop="scrollToProject(i)"
                  @keydown.enter.prevent="scrollToProject(i)"
                  @keydown.space.prevent="scrollToProject(i)"
              >
                <span class="indicator-dot-inner">
                  <span class="index-rail-num">{{ String(i + 1).padStart(2, '0') }}</span>
                  <span class="index-rail-short">{{ p.indexShort }}</span>
                </span>
              </div>
            </nav>
          </div>
        </aside>

        <div class="data-stream" ref="scrollContainer">
          <div
              v-for="(project, index) in projects"
              :key="project.id || project.nameKey || index"
              class="project-node"
              :data-index="index"
              :data-project-id="project.id || ''"
              @click="handleProjectClick(project)"
          >
            <div class="node-background">
              <img :src="project.image" :alt="project.name" class="bg-image" />
              <div class="image-tint"></div>
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
                    <span class="link-arrow" aria-hidden="true">
                      <svg class="link-arrow-svg" viewBox="0 0 14 10" width="14" height="10" focusable="false">
                        <path
                          d="M1 5h7M8 2.35L12.65 5 8 7.65"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.75"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
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
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import projectsData from '@/data/projects.json';
import WeatherModal from '@/components/WeatherModel.vue';
import { stashHomeScrollForProjectReturn } from '@/utils/homeScrollRestore.js';

const { t, te } = useI18n();
const router = useRouter();
const showWeatherModal = ref(false);
const currentActive = ref(0);
const isMobile = ref(false);
const scrollContainer = ref(null);
/** 左侧目录点击触发平滑滚动时，短暂忽略滚动同步，避免与 smooth 滚动过程打架 */
const scrollSyncSuppressedUntil = ref(0);
const RAIL_CLICK_SCROLL_SYNC_SUPPRESS_MS = 800;

const scrollToProject = (index) => {
  currentActive.value = index;
  scrollSyncSuppressedUntil.value = Date.now() + RAIL_CLICK_SCROLL_SYNC_SUPPRESS_MS;
  const root = scrollContainer.value;
  if (!root) return;
  const el = root.querySelector(`.project-node[data-index="${index}"]`);
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

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
    const idxLabelKey = p.id ? `projects.indexLabels.${p.id}` : '';
    const indexShort = idxLabelKey && te(idxLabelKey) ? t(idxLabelKey) : '';
    return {
      ...p,
      name: t(p.nameKey),
      description: t(p.descriptionKey),
      footerDateLine,
      dateIso,
      indexShort,
    };
  });
});

// --- 滚动同步高亮：遍历本节全部卡片（IO 回调里的 entries 仅为「本次变化」的子集，用 ratio 比大小会乱跳） ---
/** 合并到单帧更新左侧高亮 */
let activeIndexRaf = 0;
let pendingActiveIndex = null;

const scheduleActiveIndex = (idx) => {
  if (Number.isNaN(idx)) return;
  pendingActiveIndex = idx;
  if (activeIndexRaf) return;
  activeIndexRaf = requestAnimationFrame(() => {
    activeIndexRaf = 0;
    const next = pendingActiveIndex;
    pendingActiveIndex = null;
    if (next !== null && next !== currentActive.value) {
      currentActive.value = next;
    }
  });
};

/** 视口顶部参考线：顶栏高度 + 余量，与卡片 scroll-margin-top 同量级 */
const getActiveMarkerY = () => {
  const nav = document.querySelector('.napkin-nav');
  return (nav?.offsetHeight ?? 60) + 24;
};

const updateActiveFromScroll = () => {
  if (Date.now() < scrollSyncSuppressedUntil.value) return;
  const root = scrollContainer.value;
  if (!root) return;
  const nodes = root.querySelectorAll('.project-node');
  if (!nodes.length) return;
  const marker = getActiveMarkerY();

  let idx = 0;
  nodes.forEach((node, i) => {
    const top = node.getBoundingClientRect().top;
    if (top <= marker) idx = i;
  });
  scheduleActiveIndex(idx);
};

let scrollSyncRaf = 0;
const onScrollOrResize = () => {
  if (scrollSyncRaf) return;
  scrollSyncRaf = requestAnimationFrame(() => {
    scrollSyncRaf = 0;
    updateActiveFromScroll();
  });
};

onMounted(() => {
  nextTick(() => {
    updateActiveFromScroll();
  });
  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize, { passive: true });
});
watch(() => projects.value.length, () => nextTick(() => updateActiveFromScroll()));
onUnmounted(() => {
  window.removeEventListener('scroll', onScrollOrResize);
  window.removeEventListener('resize', onScrollOrResize);
  if (activeIndexRaf) cancelAnimationFrame(activeIndexRaf);
  if (scrollSyncRaf) cancelAnimationFrame(scrollSyncRaf);
});

const projectReturnId = (p) => {
  if (p.id != null && String(p.id).trim()) return String(p.id).trim();
  const link = p.link;
  if (typeof link !== 'string') return '';
  const m = link.match(/^\/project\/([^/?#]+)/);
  return m ? decodeURIComponent(m[1]) : '';
};

const handleProjectClick = (p) => {
  if (p.link === '/weather') showWeatherModal.value = true;
  else if (p.link) {
    if (typeof p.link === 'string' && p.link.startsWith('/project/')) {
      const rid = projectReturnId(p);
      if (rid) stashHomeScrollForProjectReturn(rid);
    }
    router.push(p.link);
  }
};
const closeWeatherModal = () => { showWeatherModal.value = false; };
</script>

<style scoped>
.projects-wrapper {
  /* 略加大区块间距，与各 Section 呼吸感对齐 */
  padding: 96px 0 112px 0;
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
  margin-bottom: 0.75rem;
}

.scroll-indicator {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 0.35rem;
  border-left: 1px solid var(--border-color);
  padding-left: 20px;
  max-height: calc(100vh - 15rem);
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--border-color) 80%, transparent) transparent;
}

.scroll-indicator::-webkit-scrollbar {
  width: 4px;
}

.scroll-indicator::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

.indicator-dot {
  font-size: 0.7rem;
  font-family: var(--font-mono);
  /* 亮色下避免过浅：用正文色混合次要色，取消整体低 opacity 叠淡 */
  color: color-mix(in srgb, var(--text-color) 52%, var(--secondary-color));
  opacity: 1;
  transition: color 0.2s ease, transform 0.25s ease;
  cursor: pointer;
  user-select: none;
}

html.dark .indicator-dot {
  color: color-mix(in srgb, var(--text-color) 38%, var(--secondary-color));
}

.indicator-dot-inner {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.35rem;
  max-width: 11rem;
  min-width: 0;
  line-height: 1.25;
}

.index-rail-num {
  flex-shrink: 0;
  font-size: 0.62rem;
  font-family: var(--font-mono);
  letter-spacing: 0.08em;
  opacity: 0.92;
}

.index-rail-short {
  flex: 1;
  min-width: 0;
  font-size: 0.74rem;
  font-family: var(--font-sans);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.indicator-dot:not(.active):hover {
  color: color-mix(in srgb, var(--text-color) 62%, var(--secondary-color));
}

html.dark .indicator-dot:not(.active):hover {
  color: color-mix(in srgb, var(--text-color) 48%, var(--secondary-color));
}

/* 暗色下 html.dark .indicator-dot 会盖过 .indicator-dot.active，须单独拉回主色 */
html.dark .indicator-dot.active {
  color: var(--primary-color);
  text-shadow: 0 0 14px rgba(var(--primary-color-rgb), 0.32);
}

.indicator-dot:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--primary-color) 70%, transparent);
  outline-offset: 3px;
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

/* ========== 学习足迹卡片：悬停边框主色倾向 + 轻阴影，封面层轻微放大（与作品影像 snap-card 一致） ========== */
.project-node {
  position: relative;
  min-height: 480px;
  background: var(--modal-bg);
  border: 1px solid var(--border-color);
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: flex-end;
  transform: none;
  box-shadow: var(--hover-shadow);
  border-radius: 0;
  scroll-margin-top: 5.5rem;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.project-node:hover,
.project-node:focus-within {
  border-color: color-mix(in srgb, var(--primary-color) 35%, var(--border-color));
  box-shadow:
    0 6px 12px -3px color-mix(in srgb, var(--text-color) 11%, transparent),
    0 22px 44px -20px color-mix(in srgb, var(--primary-color) 16%, transparent);
}

/* 封面层：裁切区内微缩放，外框与占位不变 */
.node-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  transform-origin: center center;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.project-node:hover .node-background {
  transform: scale(1.008);
}
.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
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

.detail-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--primary-color);
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 0.72rem;
  letter-spacing: 0.04em;
}

.link-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: inherit;
  opacity: 0.92;
}

.link-arrow-svg {
  display: block;
  vertical-align: middle;
}

/* 响应式：完全保留 */
@media (max-width: 900px) {
  .cyber-container { margin: 0 auto; }
  .main-layout { flex-direction: column; }
  .index-bus, .data-stream { width: 100%; }
  .sticky-content { position: relative; top: 0; margin-bottom: 40px; }
  .project-node { transform: none; }
  .project-node:hover { transform: none; }

  .scroll-indicator {
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 12px;
    max-height: none;
    overflow-x: auto;
    overflow-y: hidden;
    border-left: none;
    border-bottom: 1px solid var(--border-color);
    padding-left: 0;
    padding-bottom: 14px;
    margin-bottom: 0.25rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
  }

  .indicator-dot {
    flex-shrink: 0;
  }

  .indicator-dot-inner {
    max-width: 8rem;
  }

  .index-rail-short {
    font-size: 0.68rem;
  }

  .indicator-dot.active {
    transform: translateX(3px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-node {
    transition: none;
  }
  .node-background {
    transition: none;
  }
  .project-node:hover .node-background {
    transform: none;
  }
  .indicator-dot {
    transition: color 0.15s ease;
  }
  .indicator-dot.active {
    transform: none;
  }
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
    /* 隔离各卡片布局子树，减轻超宽屏下多轨动画时的合成牵连 */
    contain: layout;
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