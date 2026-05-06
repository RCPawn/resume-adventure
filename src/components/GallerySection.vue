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
              <div class="header-nav-cluster">
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
              <div class="header-counter-box">
                <span class="header-counter">{{ counterDisplay }}</span>
              </div>
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
                  <div class="snap-media">
                    <img
                      :src="item.imageUrl"
                      :loading="idx < 2 ? 'eager' : 'lazy'"
                      :fetchpriority="pageIndex === 0 && idx === 0 ? 'high' : undefined"
                      decoding="async"
                      class="snap-image"
                      :alt="t(`gallery.items.${item.id}.title`)"
                    />
                    <div class="snap-media-overlay" aria-hidden="true">
                      <i class="bi bi-zoom-in snap-zoom-icon"></i>
                    </div>
                  </div>
                  <footer class="snap-caption">
                    <span class="snap-caption-index">{{ formatSlideOrdinal(idx) }}</span>
                    <span class="snap-caption-title">{{ t(`gallery.items.${item.id}.title`) }}</span>
                  </footer>
                </div>
              </article>
            </div>
          </div>

          <div v-if="filteredTotal > 1" class="gallery-indicator">
            <div
              class="gallery-indicator-track"
              role="progressbar"
              :aria-valuemin="1"
              :aria-valuemax="filteredTotal"
              :aria-valuenow="globalDisplayIndex"
              :aria-label="t('gallery.progressAria')"
            >
              <div
                class="gallery-indicator-fill"
                :style="{ transform: `scaleX(${progressFraction})` }"
              />
            </div>
            <div
              v-if="showSegmentStrip"
              class="gallery-indicator-segments"
              role="tablist"
              :aria-label="t('gallery.snapDotsAria')"
            >
              <button
                v-for="(item, idx) in visibleItems"
                :key="'ind-seg-' + item.id"
                type="button"
                role="tab"
                class="gallery-indicator-seg"
                :class="{ 'is-active': idx === activeIndex }"
                :aria-selected="idx === activeIndex"
                :aria-label="
                  t('gallery.indicatorSegAria', {
                    n: globalStartIndex + idx + 1,
                    title: t(`gallery.items.${item.id}.title`),
                  })
                "
                @click="goToIndexInPage(idx)"
              />
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
/** 底部细分段最多条数：再多则只保留顶栏进度条，避免挤成一团 */
const INDICATOR_SEG_MAX = 16;

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

/** 全局进度 0–1，用于底部主轨填充（与标题区「当前/总数」一致） */
const progressFraction = computed(() => {
  if (filteredTotal.value <= 1) return 1;
  return (globalDisplayIndex.value - 1) / (filteredTotal.value - 1);
});

const showSegmentStrip = computed(
  () =>
    visibleItems.value.length > 1 && visibleItems.value.length <= INDICATOR_SEG_MAX,
);

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
  nextTick(resetScrollerScroll);
});

function resetScrollerScroll() {
  const scroller = snapScrollerRef.value;
  if (scroller) scroller.scrollLeft = 0;
  requestAnimationFrame(syncActiveIndexFromScroll);
}

const snapScrollerRef = ref(null);
const slideRefs = ref([]);

const setSlideRef = (el, idx) => {
  if (el) slideRefs.value[idx] = el;
};

let scrollRaf = null;
const syncActiveIndexFromScroll = () => {
  scrollRaf = null;
  const scroller = snapScrollerRef.value;
  const slides = slideRefs.value;
  if (!scroller || !slides.length) return;

  const scrollerRect = scroller.getBoundingClientRect();
  const viewMid = scrollerRect.left + scrollerRect.width / 2;
  let best = 0;
  let bestDist = Infinity;
  slides.forEach((slide, i) => {
    if (!slide) return;
    const r = slide.getBoundingClientRect();
    const mid = r.left + r.width / 2;
    const d = Math.abs(mid - viewMid);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  });
  activeIndex.value = Math.min(best, visibleItems.value.length - 1);
};

const onSnapScroll = () => {
  if (scrollRaf != null) return;
  scrollRaf = requestAnimationFrame(syncActiveIndexFromScroll);
};

const goToIndexInPage = (idx) => {
  const len = visibleItems.value.length;
  if (!len) return;
  const clamped = Math.max(0, Math.min(len - 1, idx));
  const slide = slideRefs.value[clamped];
  if (slide && typeof slide.scrollIntoView === 'function') {
    slide.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }
  activeIndex.value = clamped;
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
  nextTick(() => requestAnimationFrame(syncActiveIndexFromScroll));
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey);
  if (scrollRaf != null) cancelAnimationFrame(scrollRaf);
});
</script>

<style scoped>
.main-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 0 100px;
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
  max-width: calc(100% - 11.5rem);
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

.header-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-nav-cluster {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.header-icon-btn {
  width: 32px;
  height: 32px;
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

.header-counter-box {
  display: flex;
  align-items: center;
  min-height: 32px;
  padding: 0 10px;
  background: var(--btn-bg);
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.header-counter {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-color);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
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
  gap: 1.25rem;
}

/* 底部指示器：与标题区 HUD（边框 + mono）同一语境 */
.gallery-indicator {
  width: 100%;
  max-width: min(560px, 100%);
  padding: 0 var(--page-content-pad-x);
  box-sizing: border-box;
}

.gallery-indicator-track {
  height: 4px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background: var(--btn-bg);
  overflow: hidden;
  position: relative;
}

.gallery-indicator-fill {
  position: absolute;
  inset: 0;
  transform-origin: left center;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--primary-color) 82%, var(--text-color)),
    var(--primary-color)
  );
  box-shadow: 0 0 16px rgb(var(--primary-color-rgb) / 0.28);
  transition: transform 0.38s cubic-bezier(0.22, 1, 0.36, 1);
}

.gallery-indicator-segments {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 5px;
  margin-top: 0.65rem;
  width: 100%;
}

.gallery-indicator-seg {
  flex: 1 1 0;
  min-width: 0;
  max-width: 36px;
  height: 10px;
  padding: 0;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  background: color-mix(in srgb, var(--border-color) 88%, var(--secondary-color));
  transition:
    background 0.2s ease,
    height 0.2s ease,
    box-shadow 0.2s ease;
}

.gallery-indicator-seg:hover {
  background: color-mix(in srgb, var(--secondary-color) 35%, var(--border-color));
}

.gallery-indicator-seg.is-active {
  height: 12px;
  background: var(--primary-color);
  box-shadow: 0 0 12px rgb(var(--primary-color-rgb) / 0.35);
}

@media (prefers-reduced-motion: reduce) {
  .gallery-indicator-fill {
    transition: none;
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
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black min(8%, 48px),
    black max(92%, calc(100% - 48px)),
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
  border-radius: 12px;
}

.snap-slide {
  flex: 0 0 var(--snap-w);
  scroll-snap-align: center;
  scroll-snap-stop: normal;
  min-width: 0;
  cursor: pointer;
  border-radius: 14px;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease;
}

.snap-slide:not(.is-active) {
  opacity: 0.72;
  transform: scale(0.94);
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
    opacity: 0.88;
    transform: none;
  }
}

.snap-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--modal-bg);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  box-shadow:
    0 4px 6px -1px color-mix(in srgb, var(--text-color) 8%, transparent),
    0 18px 40px -18px color-mix(in srgb, var(--text-color) 22%, transparent);
  overflow: hidden;
  user-select: none;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.snap-slide:hover .snap-card,
.snap-slide:focus-within .snap-card {
  border-color: color-mix(in srgb, var(--primary-color) 35%, var(--border-color));
  box-shadow:
    0 8px 16px -4px color-mix(in srgb, var(--text-color) 12%, transparent),
    0 28px 56px -24px color-mix(in srgb, var(--primary-color) 18%, transparent);
}

.snap-media {
  position: relative;
  aspect-ratio: 16 / 10;
  background: var(--btn-bg);
  overflow: hidden;
}

.snap-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}

.snap-slide:hover .snap-image,
.snap-slide:focus-within .snap-image {
  transform: scale(1.04);
}

.snap-media-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to top, color-mix(in srgb, var(--text-color) 55%, transparent) 0%, transparent 45%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.snap-slide:hover .snap-media-overlay,
.snap-slide:focus-within .snap-media-overlay {
  opacity: 1;
}

.snap-zoom-icon {
  font-size: 1.5rem;
  color: #fff;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.45));
}

.snap-caption {
  display: flex;
  align-items: baseline;
  gap: 0.65rem;
  padding: 0.65rem 1rem 0.85rem;
  border-top: 1px solid var(--border-color);
  background: color-mix(in srgb, var(--btn-bg) 65%, var(--modal-bg));
}

.snap-caption-index {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--primary-color);
  opacity: 0.9;
  font-variant-numeric: tabular-nums;
}

.snap-caption-title {
  font-family: var(--font-sans);
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text-color);
  line-height: 1.35;
  flex: 1;
  min-width: 0;
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
  border-radius: 8px;
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
    justify-content: space-between;
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
      black 5%,
      black 95%,
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
