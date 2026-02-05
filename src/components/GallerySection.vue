<template>
  <div id="gallery" class="main-container">
    <div class="gallery-viewport">

      <div class="gallery-header">
        <h2 class="gallery-title">
          <span class="icon">🎨</span>{{ t('gallery.title') }}
        </h2>
        <p class="gallery-subtitle">{{ t('gallery.subtitle') }}</p>
      </div>

      <section class="gallery-section">
        <div class="scroll-container row-one">
          <div
              class="scroll-track"
              :style="{ transform: `translateX(${rowOneScrollPosition}px)` }"
              @mouseenter="pauseAnimation(1)"
              @mouseleave="resumeAnimation(1)"
          >
            <div
                class="gallery-card polaroid-style"
                v-for="(item, idx) in rowOneDuplicated"
                :key="`row1-${idx}`"
                @click="openLightbox(item)"
            >
              <div class="image-wrapper">
                <img :src="item.imageUrl" loading="lazy" :alt="t(`gallery.items.${item.id}.title`)"
                     class="gallery-image"/>
                <div class="hover-overlay">
                  <span class="view-icon">🔍</span>
                </div>
              </div>
              <div class="card-footer">
                <span class="card-tag"># {{ t(`gallery.items.${item.id}.title`) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="scroll-container row-two">
          <div
              class="scroll-track"
              :style="{ transform: `translateX(${rowTwoScrollPosition}px)` }"
              @mouseenter="pauseAnimation(2)"
              @mouseleave="resumeAnimation(2)"
          >
            <div
                class="gallery-card film-style"
                v-for="(item, idx) in rowTwoDuplicated"
                :key="`row2-${idx}`"
                @click="openLightbox(item)"
            >
              <div class="image-wrapper">
                <img :src="item.imageUrl" loading="lazy" :alt="t(`gallery.items.${item.id}.title`)"
                     class="gallery-image"/>
                <div class="hover-overlay">
                  <span class="view-icon">🔍</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isLightboxOpen" class="lightbox-overlay" @click="closeLightbox">
          <div class="lightbox-content" @click.stop>
            <button class="close-btn" @click="closeLightbox">&times;</button>

            <img :src="activeItem.imageUrl" class="lightbox-image"/>

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
import {ref, computed, onMounted, onUnmounted} from 'vue';
import {useI18n} from 'vue-i18n';

const {t} = useI18n();

// --- 数据准备：新增 id 用于语言包映射 ---
const rowOneItems = [
  {id: 'work0', imageUrl: "/images/works/数据大屏.png"},
  {id: 'work1', imageUrl: "/images/works/非遗展厅.png"},
  {id: 'work2', imageUrl: "/images/works/传承图谱.png"},
  {id: 'work3', imageUrl: "/images/works/展品详情.png"},
  {id: 'work5', imageUrl: "/images/works/网关架构.png"},
  {id: 'work4', imageUrl: "/images/works/路由矩阵.png"},
  {id: 'work6', imageUrl: "/images/works/路由矩阵配置.png"},
  {id: 'work7', imageUrl: "/images/works/流量防卫.png"},
  {id: 'work8', imageUrl: "/images/works/流量防卫配置.png"},
  {id: 'work9', imageUrl: "/images/works/审计日志.png"},
  {id: 'work10', imageUrl: "/images/works/异步日志.png"},
  {id: 'work11', imageUrl: "/images/works/甜甜圈.png"},
];

const rowTwoItems = [...rowOneItems].reverse();

const rowOneDuplicated = computed(() => [...rowOneItems, ...rowOneItems, ...rowOneItems]);
const rowTwoDuplicated = computed(() => [...rowTwoItems, ...rowTwoItems, ...rowTwoItems]);

// --- 滚动逻辑 ---
const rowOneScrollPosition = ref(0);
const rowOneSpeed = ref(0.8);
const rowOneBaseSpeed = 0.8;
const rowTwoScrollPosition = ref(0);
const rowTwoSpeed = ref(1.0);
const rowTwoBaseSpeed = 1.0;

const ROW1_WIDTH = 320;
const ROW2_WIDTH = 260;
const rowOneSingleSetWidth = computed(() => rowOneItems.length * ROW1_WIDTH);
const rowTwoSingleSetWidth = computed(() => rowTwoItems.length * ROW2_WIDTH);

let animationFrameId;
const animate = () => {
  rowOneScrollPosition.value -= rowOneSpeed.value;
  if (Math.abs(rowOneScrollPosition.value) >= rowOneSingleSetWidth.value) {
    rowOneScrollPosition.value += rowOneSingleSetWidth.value;
  }
  rowTwoScrollPosition.value += rowTwoSpeed.value;
  if (rowTwoScrollPosition.value >= 0) {
    rowTwoScrollPosition.value -= rowTwoSingleSetWidth.value;
  }
  animationFrameId = requestAnimationFrame(animate);
};

const pauseAnimation = (row) => {
  if (row === 1) rowOneSpeed.value = 0;
  if (row === 2) rowTwoSpeed.value = 0;
};

const resumeAnimation = (row) => {
  if (row === 1) rowOneSpeed.value = rowOneBaseSpeed;
  if (row === 2) rowTwoSpeed.value = rowTwoBaseSpeed;
};

// --- Lightbox 逻辑 ---
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

onMounted(() => {
  rowTwoScrollPosition.value = -rowTwoSingleSetWidth.value;
  animationFrameId = requestAnimationFrame(animate);
});

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
});
</script>

<style scoped>
/* =================================
   布局容器
   ================================= */
.main-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  overflow: hidden;
}

.gallery-viewport {
  width: 100%;
  position: relative;
}

/* =================================
   标题区域
   ================================= */
.gallery-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 0 1rem;
}

.icon {
  display: inline-block;
  font-size: 2rem;
  margin-right: 12px;
  animation: floatIcon 3s ease-in-out infinite;
}

@keyframes floatIcon {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

.gallery-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
  letter-spacing: -1px;
}

.gallery-subtitle {
  font-size: 1rem;
  color: var(--secondary-color);
  max-width: 500px;
  margin: 0 auto;
}

/* =================================
   滚动轨道通用样式
   ================================= */
.scroll-container {
  width: 100%;
  padding: 1rem 0;
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.scroll-track {
  display: flex;
  width: max-content;
}

/* =================================
   卡片设计
   ================================= */
.gallery-card {
  flex-shrink: 0;
  position: relative;
  cursor: pointer;
  background-color: var(--modal-bg);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  user-select: none;
}

.row-one .polaroid-style {
  width: 300px;
  height: 240px;
  margin-right: 20px;
  padding: 10px 10px 40px 10px;
  border-radius: 4px;
}

.row-one .polaroid-style:nth-child(even) {
  transform: rotate(1deg);
}

.row-one .polaroid-style:nth-child(odd) {
  transform: rotate(-1deg);
}

.row-two .film-style {
  width: 240px;
  height: 160px;
  margin-right: 20px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.image-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 2px;
  background-color: var(--btn-bg);
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card-footer {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  text-align: center;
}

.card-tag {
  color: var(--secondary-color);
  font-size: 1rem;
  font-weight: 500;
}

/* =================================
   悬停效果
   ================================= */
.gallery-card:hover {
  transform: scale(1.05) rotate(0deg) !important;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.hover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-card:hover .hover-overlay {
  opacity: 1;
}

.view-icon {
  font-size: 1.5rem;
  color: white;
  transition: transform 0.3s ease;
}

.gallery-card:hover .gallery-image {
  transform: scale(1.1);
}

/* =================================
   Lightbox 灯箱 (核心修复)
   ================================= */
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

.lightbox-content {
  position: relative; /* 必须为按钮提供定位基准 */
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

/* 按钮定位修复 */
.close-btn {
  position: absolute;
  top: -10px;
  right: -50px; /* 默认在图片外部右上角 */
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

/* Vue Transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* =================================
   响应式适配
   ================================= */
@media (max-width: 1024px) {
  .close-btn {
    right: 0px;
    top: -50px; /* 屏幕较窄时放在图片上方中间或右侧 */
  }
}

@media (max-width: 768px) {
  .row-one .polaroid-style {
    width: 220px;
    height: 180px;
    padding: 6px 6px 30px 6px;
  }

  .row-two .film-style {
    width: 180px;
    height: 120px;
  }

  .gallery-title {
    font-size: 1.8rem;
  }

  /* 移动端按钮放在图片内部右上角 */
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
}
</style>