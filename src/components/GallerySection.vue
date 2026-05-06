<template>
  <div id="gallery" class="main-container">
    <div class="gallery-viewport">

      <div class="gallery-header-wrap">
        <div class="gallery-cyber-block">
          <header class="gallery-cyber-header">
            <div class="header-left">
              <span class="gallery-prefix">{{ t('gallery.streamPrefix') }}</span>
              <h2 id="gallery-heading" class="gallery-main-title">{{ t('gallery.title') }}</h2>
              <p class="gallery-subtitle">{{ t('gallery.subtitle') }}</p>
            </div>
            <div class="header-right" aria-live="polite">
              <div
                class="header-counter-box"
                :role="filteredTotal > 1 ? 'progressbar' : undefined"
                :aria-valuemin="filteredTotal > 1 ? 1 : undefined"
                :aria-valuemax="filteredTotal > 1 ? filteredTotal : undefined"
                :aria-valuenow="filteredTotal > 1 ? globalDisplayIndex : undefined"
                :aria-label="filteredTotal > 1 ? t('gallery.progressAria') : undefined"
              >
                <div
                  v-if="filteredTotal > 1"
                  class="header-counter-liquid"
                  aria-hidden="true"
                  :style="{ transform: `scaleX(${progressFraction}) translateZ(0)` }"
                />
                <span class="header-counter">{{ counterDisplay }}</span>
              </div>
              <button
                type="button"
                class="header-icon-btn"
                :disabled="!canGoPrev"
                :aria-label="t('gallery.snapPrevAria')"
                @click="goPrevSlide"
              >
                <i class="bi bi-chevron-left" aria-hidden="true"></i>
              </button>
              <button
                type="button"
                class="header-icon-btn"
                :disabled="!canGoNext"
                :aria-label="t('gallery.snapNextAria')"
                @click="goNextSlide"
              >
                <i class="bi bi-chevron-right" aria-hidden="true"></i>
              </button>
            </div>
          </header>

          <div class="gallery-controls" :aria-label="t('gallery.toolbarAria')">
            <div class="control-search-wrap">
              <i class="bi bi-search control-search-icon" aria-hidden="true"></i>
              <input
                v-model.trim="searchQuery"
                type="search"
                class="control-search-input"
                :placeholder="t('gallery.searchPlaceholder')"
                :aria-label="t('gallery.searchAria')"
                autocomplete="off"
              />
            </div>

            <div class="control-chips" role="group" :aria-label="t('gallery.categoryGroupAria')">
              <button
                v-for="opt in categoryOptions"
                :key="opt.key"
                type="button"
                class="control-chip"
                :class="{ 'is-active': activeCategory === opt.key }"
                @click="activeCategory = opt.key"
              >
                {{ t(opt.labelKey) }}
              </button>
            </div>

            <select
              id="gallery-jump-select"
              class="control-jump-select"
              :disabled="!filteredTotal"
              :value="jumpSelectValue"
              :aria-label="t('gallery.jumpAria')"
              @change="onJumpChange"
            >
              <option value="-1" disabled>{{ t('gallery.jumpPlaceholder') }}</option>
              <option
                v-for="(item, gIdx) in filteredItems"
                :key="'jump-' + item.id"
                :value="String(gIdx)"
              >
                {{ formatJumpOption(gIdx, item) }}
              </option>
            </select>

            <div v-if="pageCount > 1 && filteredTotal" class="control-page-cluster">
              <button
                type="button"
                class="control-page-icon"
                :disabled="pageIndex <= 0"
                :aria-label="t('gallery.pagePrevAria')"
                @click="goPrevPage"
              >
                <i class="bi bi-chevron-double-left" aria-hidden="true"></i>
              </button>
              <span class="control-page-text" aria-hidden="true">{{
                t('gallery.pageIndicator', { current: pageIndex + 1, total: pageCount })
              }}</span>
              <button
                type="button"
                class="control-page-icon"
                :disabled="pageIndex >= pageCount - 1"
                :aria-label="t('gallery.pageNextAria')"
                @click="goNextPage"
              >
                <i class="bi bi-chevron-double-right" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <section class="gallery-section" aria-labelledby="gallery-heading">
        <div v-if="!filteredTotal" class="gallery-empty" role="status">
          {{ t('gallery.emptyFiltered') }}
        </div>

        <template v-else>
          <div class="snap-stage">
            <div
              ref="snapScrollerRef"
              class="snap-scroller"
              tabindex="0"
              role="region"
              :aria-label="t('gallery.snapRegionAria')"
              @scroll.passive="onSnapScroll"
              @keydown="onSnapKeydown"
            >
              <article
                v-for="(item, idx) in visibleItems"
                :key="item.id"
                :ref="(el) => setSlideRef(el, idx)"
                class="snap-slide"
                :class="{ 'is-active': idx === activeIndex }"
                @click="openLightbox(item)"
              >
                <div class="snap-card">
                  <footer class="snap-caption">
                    <span class="snap-caption-index">{{ formatSlideOrdinal(idx) }}</span>
                    <span class="snap-caption-title">{{ t(`gallery.items.${item.id}.title`) }}</span>
                  </footer>
                  <div class="snap-media">
                    <img
                      :src="item.imageUrl"
                      :loading="idx < 2 ? 'eager' : 'lazy'"
                      :fetchpriority="pageIndex === 0 && idx === 0 ? 'high' : undefined"
                      decoding="async"
                      class="snap-image"
                      :alt="t(`gallery.items.${item.id}.title`)"
                    />
                  </div>
                </div>
              </article>
            </div>
          </div>
        </template>
      </section>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isLightboxOpen" class="lightbox-overlay" @click="closeLightbox">
          <div class="lightbox-content" @click.stop>
            <button type="button" class="close-btn" @click="closeLightbox">&times;</button>

            <img
              :src="activeItem.imageUrl"
              class="lightbox-image"
              :alt="t(`gallery.items.${activeItem.id}.title`)"
            />

            <div class="lightbox-caption">
              <h3>{{ t(`gallery.items.${activeItem.id}.title`) }}</h3>
              <p>{{ t(`gallery.items.${activeItem.id}.desc`) }}</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import 'bootstrap-icons/font/bootstrap-icons.css';

const { t } = useI18n();

/** 每页最多渲染条数：大图多时控制 DOM，配合分页与下拉跳转浏览 */
const PAGE_SIZE = 24;

const categoryOptions = [
  { key: 'all', labelKey: 'gallery.categoryAll' },
  { key: 'exhibition', labelKey: 'gallery.categoryExhibition' },
  { key: 'gateway', labelKey: 'gallery.categoryGateway' },
  { key: 'other', labelKey: 'gallery.categoryOther' },
];

/** category 用于筛选；新增图片时请带上 category，并在 i18n 中补 items.{id} */
const rowOneItems = [
  { id: 'work0', imageUrl: '/projects/exhibition.assets/数字驾驶舱.png', category: 'exhibition' },
  { id: 'work1', imageUrl: '/projects/exhibition.assets/文化门户首页.png', category: 'exhibition' },
  { id: 'work2', imageUrl: '/projects/exhibition.assets/在线展厅.png', category: 'exhibition' },
  { id: 'work3', imageUrl: '/projects/exhibition.assets/传承关系网络.png', category: 'exhibition' },
  { id: 'work4', imageUrl: '/images/works/网关控制台.png', category: 'gateway' },
  { id: 'work5', imageUrl: '/images/works/流量防卫.png', category: 'gateway' },
  { id: 'work6', imageUrl: '/images/works/路由矩阵配置.png', category: 'gateway' },
  { id: 'work7', imageUrl: '/images/works/审计日志.png', category: 'gateway' },
  { id: 'work8', imageUrl: '/images/works/甜甜圈.png', category: 'other' },
];

const rowTwoItems = [
  { id: 'work10', imageUrl: '/images/works/网关架构.png', category: 'gateway' },
  { id: 'work11', imageUrl: '/images/works/流量防卫配置.png', category: 'gateway' },
  { id: 'work12', imageUrl: '/images/works/路由矩阵.png', category: 'gateway' },
  { id: 'work13', imageUrl: '/images/works/异步日志.png', category: 'gateway' },
  { id: 'work14', imageUrl: '/projects/exhibition.assets/纸上乾坤详情.png', category: 'exhibition' },
  { id: 'work15', imageUrl: '/projects/exhibition.assets/展品详情页.png', category: 'exhibition' },
  { id: 'work16', imageUrl: '/projects/gateway.assets/image-20260217132934258.png', category: 'gateway' },
  { id: 'work17', imageUrl: '/projects/exhibition.assets/纸上乾坤图集.png', category: 'exhibition' },
];

const sourceItems = [...rowOneItems, ...rowTwoItems];

const searchQuery = ref('');
const activeCategory = ref('all');
const pageIndex = ref(0);
const activeIndex = ref(0);

const normalize = (s) => s.trim().toLowerCase();

const filteredItems = computed(() => {
  const q = normalize(searchQuery.value);
  return sourceItems.filter((item) => {
    if (activeCategory.value !== 'all' && item.category !== activeCategory.value) return false;
    if (!q) return true;
    const title = t(`gallery.items.${item.id}.title`).toLowerCase();
    const desc = t(`gallery.items.${item.id}.desc`).toLowerCase();
    return title.includes(q) || desc.includes(q);
  });
});

const filteredTotal = computed(() => filteredItems.value.length);

const pageCount = computed(() =>
  filteredTotal.value ? Math.ceil(filteredTotal.value / PAGE_SIZE) : 0,
);

const visibleItems = computed(() => {
  const all = filteredItems.value;
  if (!all.length) return [];
  const start = pageIndex.value * PAGE_SIZE;
  return all.slice(start, start + PAGE_SIZE);
});

const globalStartIndex = computed(() => pageIndex.value * PAGE_SIZE);

const globalDisplayIndex = computed(() => {
  if (!filteredTotal.value) return 0;
  return globalStartIndex.value + activeIndex.value + 1;
});

/** 全局进度 0–1：顶栏液态能量条（第 1 张亦有可见占比，避免首张空槽） */
const progressFraction = computed(() => {
  if (filteredTotal.value <= 1) return 1;
  return globalDisplayIndex.value / filteredTotal.value;
});

const jumpSelectValue = computed(() =>
  filteredTotal.value ? String(globalStartIndex.value + activeIndex.value) : '-1',
);

/** 右栏计数：当前序号/总数；多页时在同一行追加页码，不再单独占标签 */
const counterDisplay = computed(() => {
  if (!filteredTotal.value) return '—';
  const main = t('gallery.snapCounter', {
    current: globalDisplayIndex.value,
    total: filteredTotal.value,
  });
  if (pageCount.value <= 1) return main;
  return `${main} · ${pageIndex.value + 1}/${pageCount.value}`;
});

const canGoPrev = computed(() => globalDisplayIndex.value > 1);

const canGoNext = computed(() =>
  filteredTotal.value ? globalDisplayIndex.value < filteredTotal.value : false,
);

watch(filteredItems, (list) => {
  const maxPage = list.length ? Math.ceil(list.length / PAGE_SIZE) - 1 : 0;
  if (pageIndex.value > maxPage) pageIndex.value = maxPage;
  if (pageIndex.value < 0) pageIndex.value = 0;
});

watch([searchQuery, activeCategory], () => {
  pageIndex.value = 0;
  activeIndex.value = 0;
  slideRefs.value = [];
  if (scrollLockTimer != null) {
    clearTimeout(scrollLockTimer);
    scrollLockTimer = null;
  }
  programmaticTargetIndex.value = null;
  nextTick(resetScrollerScroll);
});

function resetScrollerScroll() {
  if (scrollLockTimer != null) {
    clearTimeout(scrollLockTimer);
    scrollLockTimer = null;
  }
  programmaticTargetIndex.value = null;
  const scroller = snapScrollerRef.value;
  if (scroller) scroller.scrollLeft = 0;
  requestAnimationFrame(syncActiveIndexFromScroll);
}

const snapScrollerRef = ref(null);
const slideRefs = ref([]);

/** 按钮/点选触发的平滑滚动期间，忽略按视口中心的 scroll 同步，避免序号与指示器在相邻张之间来回跳 */
const programmaticTargetIndex = ref(null);
let scrollLockTimer = null;
let scrollRaf = null;
let snapScrollEndHandler = null;

const setSlideRef = (el, idx) => {
  if (el) slideRefs.value[idx] = el;
};

/** 程序化滚动结束后不再强制 sync：避免首张等边界处误判到相邻张 */
function releaseScrollLock() {
  if (scrollLockTimer != null) {
    clearTimeout(scrollLockTimer);
    scrollLockTimer = null;
  }
  programmaticTargetIndex.value = null;
}

/** 与 scroll-snap + scroll-behavior: smooth 对齐；无 scrollend 时由定时器释放 */
function armScrollLock(clamped) {
  programmaticTargetIndex.value = clamped;
  if (scrollLockTimer != null) clearTimeout(scrollLockTimer);
  scrollLockTimer = setTimeout(releaseScrollLock, 560);
}

const syncActiveIndexFromScroll = () => {
  scrollRaf = null;
  if (programmaticTargetIndex.value !== null) return;

  const scroller = snapScrollerRef.value;
  const slides = slideRefs.value;
  if (!scroller || !slides.length) return;

  const viewMidX = scroller.scrollLeft + scroller.clientWidth / 2;
  let best = 0;
  let bestDist = Infinity;
  slides.forEach((slide, i) => {
    if (!slide) return;
    const mid = slide.offsetLeft + slide.offsetWidth / 2;
    const d = Math.abs(mid - viewMidX);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  });
  activeIndex.value = Math.min(best, visibleItems.value.length - 1);
};

const onSnapScroll = () => {
  if (programmaticTargetIndex.value !== null) return;
  if (scrollRaf != null) return;
  scrollRaf = requestAnimationFrame(syncActiveIndexFromScroll);
};

const goToIndexInPage = (idx) => {
  const len = visibleItems.value.length;
  if (!len) return;
  const clamped = Math.max(0, Math.min(len - 1, idx));
  activeIndex.value = clamped;
  armScrollLock(clamped);
  const slide = slideRefs.value[clamped];
  if (slide && typeof slide.scrollIntoView === 'function') {
    slide.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }
};

function goPrevSlide() {
  if (activeIndex.value > 0) {
    goToIndexInPage(activeIndex.value - 1);
    return;
  }
  if (pageIndex.value > 0) {
    pageIndex.value -= 1;
    slideRefs.value = [];
    nextTick(() => {
      const scroller = snapScrollerRef.value;
      if (scroller) scroller.scrollLeft = 0;
      const last = visibleItems.value.length - 1;
      requestAnimationFrame(() => goToIndexInPage(Math.max(0, last)));
    });
  }
}

function goNextSlide() {
  const vis = visibleItems.value.length;
  if (!vis) return;
  if (activeIndex.value < vis - 1) {
    goToIndexInPage(activeIndex.value + 1);
    return;
  }
  if (pageIndex.value < pageCount.value - 1) {
    pageIndex.value += 1;
    slideRefs.value = [];
    activeIndex.value = 0;
    nextTick(() => {
      const scroller = snapScrollerRef.value;
      if (scroller) scroller.scrollLeft = 0;
      requestAnimationFrame(() => goToIndexInPage(0));
    });
  }
}

function goPrevPage() {
  if (pageIndex.value <= 0) return;
  pageIndex.value -= 1;
  activeIndex.value = 0;
  slideRefs.value = [];
  nextTick(resetScrollerScroll);
}

function goNextPage() {
  if (pageIndex.value >= pageCount.value - 1) return;
  pageIndex.value += 1;
  activeIndex.value = 0;
  slideRefs.value = [];
  nextTick(resetScrollerScroll);
}

function focusGlobalIndex(gIdx) {
  const list = filteredItems.value;
  if (gIdx < 0 || gIdx >= list.length) return;
  const page = Math.floor(gIdx / PAGE_SIZE);
  const local = gIdx % PAGE_SIZE;
  if (pageIndex.value !== page) {
    pageIndex.value = page;
    slideRefs.value = [];
    nextTick(() => {
      const scroller = snapScrollerRef.value;
      if (scroller) scroller.scrollLeft = 0;
      requestAnimationFrame(() => goToIndexInPage(local));
    });
  } else {
    goToIndexInPage(local);
  }
}

function onJumpChange(e) {
  const raw = e.target?.value;
  const gIdx = parseInt(raw, 10);
  if (Number.isNaN(gIdx)) return;
  focusGlobalIndex(gIdx);
}

function formatJumpOption(gIdx, item) {
  const title = t(`gallery.items.${item.id}.title`);
  const n = gIdx + 1;
  const w = Math.max(2, String(filteredTotal.value || 1).length);
  return `${String(n).padStart(w, '0')} · ${title}`;
}

function formatSlideOrdinal(idxInPage) {
  const n = globalStartIndex.value + idxInPage + 1;
  const w = Math.max(2, String(filteredTotal.value || 1).length);
  return String(n).padStart(w, '0');
}

const onSnapKeydown = (e) => {
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    goNextSlide();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    goPrevSlide();
  }
};

/** Lightbox */
const isLightboxOpen = ref(false);
const activeItem = ref({});

const openLightbox = (item) => {
  activeItem.value = item;
  isLightboxOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  isLightboxOpen.value = false;
  document.body.style.overflow = '';
};

const handleEscapeKey = (e) => {
  if (e.key === 'Escape' && isLightboxOpen.value) closeLightbox();
};

onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey);
  nextTick(() => {
    requestAnimationFrame(syncActiveIndexFromScroll);
    const el = snapScrollerRef.value;
    if (el) {
      snapScrollEndHandler = () => {
        if (programmaticTargetIndex.value !== null) releaseScrollLock();
      };
      el.addEventListener('scrollend', snapScrollEndHandler);
    }
  });
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey);
  if (scrollRaf != null) cancelAnimationFrame(scrollRaf);
  if (scrollLockTimer != null) clearTimeout(scrollLockTimer);
  const el = snapScrollerRef.value;
  if (el && snapScrollEndHandler) el.removeEventListener('scrollend', snapScrollEndHandler);
});
</script>

<style scoped>
.main-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 132px 0 96px;
  overflow: hidden;
}

.gallery-viewport {
  width: 100%;
  position: relative;
}

.gallery-header-wrap {
  box-sizing: border-box;
  width: 100%;
  max-width: var(--page-content-max-width);
  margin: 0 auto 2.75rem;
  padding: 0 var(--page-content-pad-x);
}

.gallery-cyber-block {
  width: 100%;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.9rem;
}

.gallery-cyber-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--page-main-layout-gap);
  width: 100%;
}

.header-left {
  min-width: 0;
  flex: 1 1 auto;
  max-width: calc(100% - 17rem);
}

.gallery-prefix {
  display: block;
  font-family: var(--font-mono);
  font-size: var(--section-heading-prefix-size);
  font-weight: bold;
  color: var(--primary-color);
  letter-spacing: normal;
}

.gallery-main-title {
  font-family: var(--font-sans);
  font-size: var(--section-heading-title-size);
  font-weight: 800;
  margin: 10px 0;
  color: var(--text-color);
  line-height: 1.15;
}

.gallery-subtitle {
  font-family: var(--font-sans);
  font-size: var(--section-heading-subtitle-size);
  color: var(--secondary-color);
  line-height: 1.6;
  margin: 0;
  white-space: nowrap;
}

/* 指示器 | 左箭头 | 右箭头：三者紧邻；指示器固定原宽度，高度与箭头一致 */
.header-right {
  --gallery-strip-h: 32px;
  flex-shrink: 0;
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.35rem;
}

.header-counter-box {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  flex: 0 0 12rem;
  width: 12rem;
  min-width: 12rem;
  max-width: 12rem;
  height: var(--gallery-strip-h);
  min-height: var(--gallery-strip-h);
  padding: 0 10px;
  background: var(--btn-bg);
  border: 1px solid var(--border-color);
  border-radius: 6px;
}

.header-icon-btn {
  box-sizing: border-box;
  flex-shrink: 0;
  width: var(--gallery-strip-h);
  height: var(--gallery-strip-h);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: var(--btn-bg);
  color: var(--text-color);
  cursor: pointer;
  font-size: 1rem;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    opacity 0.2s ease;
}

.header-icon-btn:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--primary-color) 35%, var(--border-color));
  background: var(--modal-bg);
}

.header-icon-btn:disabled {
  opacity: 0.32;
  cursor: not-allowed;
}


.header-counter-liquid {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  transform-origin: left center;
  pointer-events: none;
  border-radius: inherit;
  background: linear-gradient(
    105deg,
    color-mix(in srgb, var(--primary-color) 58%, transparent) 0%,
    color-mix(in srgb, var(--primary-color) 38%, transparent) 42%,
    color-mix(in srgb, var(--primary-color) 72%, transparent) 100%
  );
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.14),
    0 0 22px rgb(var(--primary-color-rgb) / 0.24);
  opacity: 0.9;
  transition: transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1);
  will-change: transform;
}

.header-counter-liquid::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgb(255 255 255 / 0.16) 50%,
    transparent 100%
  );
  background-size: 220% 100%;
  animation: header-counter-liquid-shimmer 2.8s ease-in-out infinite;
}

@keyframes header-counter-liquid-shimmer {
  0% {
    background-position: 130% 0;
  }
  100% {
    background-position: -130% 0;
  }
}

.header-counter {
  position: relative;
  z-index: 1;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-color);
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum' 1;
  white-space: nowrap;
  text-align: center;
  min-width: 9.5ch;
  text-shadow:
    0 0 10px color-mix(in srgb, var(--btn-bg) 75%, transparent),
    0 1px 2px color-mix(in srgb, var(--bg-color) 35%, transparent);
}

.gallery-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem 0.55rem;
  margin-top: 0.75rem;
}

.control-search-wrap {
  flex: 1 1 140px;
  min-width: min(100%, 160px);
  max-width: min(100%, 280px);
  display: flex;
  align-items: center;
  gap: 0.35rem;
  height: 32px;
  padding: 0 0.5rem 0 0.55rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: var(--btn-bg);
}

.control-search-icon {
  font-size: 0.85rem;
  color: var(--secondary-color);
  flex-shrink: 0;
}

.control-search-input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--text-color);
  outline: none;
}

.control-search-input::placeholder {
  color: color-mix(in srgb, var(--secondary-color) 80%, transparent);
}

.control-chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  flex: 1 1 auto;
  justify-content: flex-end;
}

.control-chip {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: transparent;
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--secondary-color);
  cursor: pointer;
  line-height: 1.3;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background 0.2s ease;
}

.control-chip:hover {
  border-color: color-mix(in srgb, var(--primary-color) 32%, var(--border-color));
  color: var(--text-color);
}

.control-chip.is-active {
  border-color: color-mix(in srgb, var(--primary-color) 42%, var(--border-color));
  background: color-mix(in srgb, var(--primary-color) 12%, transparent);
  color: var(--text-color);
}

.control-jump-select {
  flex: 1 1 160px;
  min-width: min(100%, 140px);
  max-width: min(100%, 320px);
  height: 32px;
  padding: 0 1.75rem 0 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: var(--btn-bg);
  color: var(--text-color);
  font-family: var(--font-sans);
  font-size: 0.78rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 16 16'%3E%3Cpath fill='%23888' d='M4 6l4 4 4-4'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.45rem center;
}

.control-jump-select:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.control-page-cluster {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.control-page-icon {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--secondary-color);
  cursor: pointer;
  font-size: 0.95rem;
  transition:
    color 0.2s ease,
    background 0.2s ease;
}

.control-page-icon:hover:not(:disabled) {
  color: var(--text-color);
  background: color-mix(in srgb, var(--btn-bg) 80%, transparent);
}

.control-page-icon:disabled {
  opacity: 0.28;
  cursor: not-allowed;
}

.control-page-text {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--secondary-color);
  font-variant-numeric: tabular-nums;
  padding: 0 4px;
  white-space: nowrap;
}

.gallery-empty {
  width: 100%;
  max-width: var(--page-content-max-width);
  padding: 2.5rem 1.5rem;
  margin: 0 auto;
  text-align: center;
  font-size: 0.95rem;
  color: var(--secondary-color);
  border: 1px dashed var(--border-color);
  border-radius: 12px;
  background: color-mix(in srgb, var(--btn-bg) 40%, transparent);
}

.gallery-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

@media (prefers-reduced-motion: reduce) {
  .header-counter-liquid {
    transition: none;
    will-change: auto;
  }

  .header-counter-liquid::after {
    animation: none;
  }
}

/* —— 橱窗舞台：边缘羽化 + scroll-snap —— */
.snap-stage {
  --snap-w: min(540px, 86vw);
  --snap-gap: clamp(12px, 2.5vw, 20px);
  position: relative;
  width: 100%;
  max-width: 100%;
  isolation: isolate;
  /* 收窄两侧羽化，减轻横滑橱窗「蒙一层雾」的观感 */
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black min(5%, 36px),
    black max(95%, calc(100% - 36px)),
    transparent 100%
  );
}

.snap-scroller {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
  gap: var(--snap-gap);
  width: 100%;
  padding-block: 0.5rem 0.25rem;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scroll-padding-inline: max(1rem, calc(50% - var(--snap-w) / 2));
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
  touch-action: pan-x;
  scrollbar-width: none;
  -ms-overflow-style: none;
  outline: none;
}

.snap-scroller::-webkit-scrollbar {
  display: none;
}

.snap-scroller:focus-visible {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary-color) 55%, transparent);
  border-radius: 0;
}

.snap-slide {
  flex: 0 0 var(--snap-w);
  scroll-snap-align: center;
  scroll-snap-stop: normal;
  min-width: 0;
  cursor: pointer;
  border-radius: 0;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease;
}

.snap-slide:not(.is-active) {
  opacity: 0.84;
  transform: scale(0.96);
}

.snap-slide.is-active {
  opacity: 1;
  transform: scale(1);
}

@media (prefers-reduced-motion: reduce) {
  .snap-scroller {
    scroll-behavior: auto;
  }
  .snap-slide {
    transition: none;
  }
  .snap-slide:not(.is-active) {
    opacity: 0.92;
    transform: none;
  }
  .snap-media,
  .snap-slide:hover .snap-media,
  .snap-slide:focus-within .snap-media {
    transition: none;
    transform: none;
  }
}

.snap-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--modal-bg);
  border: 1px solid var(--border-color);
  border-radius: 0;
  /* 略收扩散阴影，避免亮背景下大块灰雾 */
  box-shadow:
    0 2px 4px -1px color-mix(in srgb, var(--text-color) 7%, transparent),
    0 14px 28px -16px color-mix(in srgb, var(--text-color) 14%, transparent);
  overflow: hidden;
  user-select: none;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.snap-slide:hover .snap-card,
.snap-slide:focus-within .snap-card {
  border-color: color-mix(in srgb, var(--primary-color) 35%, var(--border-color));
  box-shadow:
    0 6px 12px -3px color-mix(in srgb, var(--text-color) 11%, transparent),
    0 22px 44px -20px color-mix(in srgb, var(--primary-color) 16%, transparent);
}

/* 与 ProjectsSection .node-background 一致：裁切区内微缩放 */
.snap-media {
  position: relative;
  width: 100%;
  /* 16:9 与常见截图一致；object-fit:contain 保证整图入画 */
  aspect-ratio: 16 / 9;
  background: var(--btn-bg);
  overflow: hidden;
  border-radius: 0;
  transform-origin: center center;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.snap-slide:hover .snap-media,
.snap-slide:focus-within .snap-media {
  transform: scale(1.008);
}

.snap-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center center;
  /* 略提对比与饱和度，抵消叠层与阴影带来的「发灰」 */
  filter: saturate(1.04) contrast(1.02);
}

/* 标题条：置于图上方，不透明纯色，与图区域分离 */
.snap-caption {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  width: 100%;
  padding: 0.32rem 0.5rem 0.34rem;
  margin: 0;
  border: none;
  border-bottom: 1px solid var(--border-color);
  background: var(--btn-bg);
  pointer-events: none;
}

.snap-caption-index {
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--primary-color);
  font-variant-numeric: tabular-nums;
  line-height: 1.15;
}

.snap-caption-title {
  flex: 1;
  min-width: 0;
  font-family: var(--font-sans);
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--text-color);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Lightbox */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

@media (min-width: 1920px) {
  .lightbox-overlay {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
}

.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lightbox-image {
  max-width: 100%;
  max-height: 75vh;
  border-radius: 0;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.lightbox-caption {
  margin-top: 1.5rem;
  color: white;
  text-align: center;
}

.lightbox-caption h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.lightbox-caption p {
  margin: 0.5rem 0 0;
  opacity: 0.8;
  font-size: 1rem;
  max-width: 600px;
}

.close-btn {
  position: absolute;
  top: -10px;
  right: -50px;
  background: none;
  border: none;
  color: white;
  font-size: 3rem;
  cursor: pointer;
  line-height: 1;
  opacity: 0.7;
  transition: all 0.2s;
  z-index: 10001;
}

.close-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 1024px) {
  .close-btn {
    right: 0;
    top: -50px;
  }
}

@media (max-width: 900px) {
  .gallery-header-wrap {
    margin-bottom: 1.75rem;
  }

  .gallery-cyber-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .header-left {
    max-width: 100%;
  }

  .header-right {
    align-self: stretch;
    justify-content: center;
    flex-wrap: wrap;
    row-gap: 0.5rem;
  }

  .gallery-subtitle {
    white-space: normal;
  }

  .gallery-controls {
    margin-top: 0.65rem;
  }

  .control-chips {
    justify-content: flex-start;
  }

  .control-search-wrap {
    max-width: 100%;
    flex: 1 1 100%;
  }

  .control-jump-select {
    max-width: 100%;
    flex: 1 1 100%;
  }

  .control-page-cluster {
    width: 100%;
    justify-content: center;
    padding-top: 0.15rem;
  }
}

@media (max-width: 768px) {
  .close-btn {
    top: 10px;
    right: 10px;
    font-size: 2.2rem;
    background: rgba(0, 0, 0, 0.4);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .snap-stage {
    mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 4%,
      black 96%,
      transparent 100%
    );
  }
}

@media (min-width: 1600px) {
  .snap-stage {
    --snap-w: min(580px, 84vw);
  }
}
</style>

<style>
/* 亮色：计数器数字叠在液体动画上时，减弱光晕以免发糊（暗色保持组件内原 shadow） */
html:not(.dark) #gallery .header-counter {
  text-shadow: 0 1px 0 rgb(255 255 255 / 0.72);
}
</style>
