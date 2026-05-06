<template>
  <section ref="heroRootRef" class="hero-section">
    <!-- 背景纹理保持不变 -->
    <div class="paper-texture"></div>

    <!-- 首屏占满视口高度，主内容与箭头之间用 flex 分配留白（箭头贴近一屏下沿、不压在内容下也不悬空） -->
    <div class="hero-shell">
      <div class="hero-top">
        <div class="container-fluid">
          <div class="layout-grid">
        <!-- 左侧：文字信息 -->
        <div class="text-area">
          <div class="content-wrapper">
            <!-- 顶部：标题组 -->
            <div class="intro-block">
              <div class="title-group">
                <h1 class="main-name">
                  <span class="greeting">HEY, I AM</span>
                  <br>
                  <div class="name-container">
                    <span class="highlight-name">RCPAWN</span>
                    <div class="sticky-note">
                      <span class="note-pin">📌</span>
                      <div class="note-content"><p>Less is<br>more</p></div>
                    </div>
                  </div>
                </h1>
              </div>
              <h2 class="sub-heading">{{ t('subtitle') || 'A SOFTWARE ENGINEERING STUDENT' }}</h2>
            </div>

            <!-- 底部：技能标签 -->
            <div class="skill-list">
              <div
                v-for="(prof, index) in professions"
                :key="prof.icon + '-' + index"
                class="skill-item"
                :style="{ animationDelay: `${0.2 + index * 0.1}s` }"
              >
                <span v-if="professionIconMap[prof.icon]" class="skill-item__icon" aria-hidden="true">
                  <component :is="professionIconMap[prof.icon]" class="skill-item__svg" />
                </span>
                <span class="skill-item__label">{{ prof.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：3D 模型展示 (核心修改) -->
        <div class="model-area">
          <div class="model-wrapper">
            <!--
               无 poster：直接拉 GLB，避免静态图与渲染透视不一致；配合 index.html preload + main.js 提前注册组件。
               reveal="auto": 首帧就绪后淡入；loading="eager": 首屏立即开始解码。
               disable-zoom / disable-pan / interaction-prompt="none": 交互与提示见下行属性。
            -->
            <model-viewer
                :key="heroModelViewerKey"
                src="/models/mystery_shack.glb"
                alt="Mystery Shack 3D Model"
                loading="eager"
                reveal="auto"
                camera-controls
                disable-zoom
                disable-pan
                interaction-prompt="none"
                :auto-rotate="heroAutoRotate"
                auto-rotate-delay="1000"
                rotation-per-second="7deg"
                shadow-intensity="1"
                shadow-softness="0.35"
                camera-orbit="41.43deg 75.41deg 90%"
                min-camera-orbit="auto auto 90%"
                max-camera-orbit="auto auto 90%"
                class="huge-model"
            >
              <div slot="progress-bar"></div>
            </model-viewer>
          </div>
        </div>
      </div>
        </div>
      </div>

      <div class="hero-bottom">
        <a href="#projects" class="scroll-cue" :aria-label="t('hero.scrollHint')">
          <svg class="scroll-cue-arrow" viewBox="0 0 28 32" aria-hidden="true">
            <path d="M4 8 L14 18 L24 8" fill="none" stroke="currentColor"
                  stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4 18 L14 28 L24 18" fill="none" stroke="currentColor"
                  stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"
                  class="scroll-cue-arrow--second" />
          </svg>
        </a>
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
import { computed, ref, onMounted, onUnmounted, onActivated, onDeactivated, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { CodeBracketSquareIcon, CloudIcon, CubeTransparentIcon } from '@heroicons/vue/24/outline';

const { t, tm } = useI18n();

/** 首屏滚走后暂停自转，显著减轻大屏 WebGL 压力；回到视口自动恢复（观感不变） */
const heroRootRef = ref(null);
/** 父级 keep-alive 隐藏再显示时，部分浏览器会丢 WebGL 合成；返回首页时 bump key 强制重建 model-viewer */
const heroModelViewerKey = ref(0);
let heroResumeRemountModel = false;

const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const heroAutoRotate = ref(!prefersReducedMotion);
let heroIo = null;

function teardownHeroIntersection() {
  heroIo?.disconnect();
  heroIo = null;
}

function setupHeroIntersection() {
  if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') return;
  teardownHeroIntersection();
  const el = heroRootRef.value;
  if (!el) return;
  heroIo = new IntersectionObserver(
      (entries) => {
        const hit = entries[0];
        heroAutoRotate.value = hit.isIntersecting && hit.intersectionRatio >= 0.06;
      },
      { threshold: [0, 0.06, 0.12, 0.25] }
  );
  heroIo.observe(el);
}

onMounted(() => {
  setupHeroIntersection();
});

onUnmounted(() => {
  teardownHeroIntersection();
});

onDeactivated(() => {
  teardownHeroIntersection();
  heroResumeRemountModel = true;
});

onActivated(async () => {
  if (heroResumeRemountModel) {
    heroResumeRemountModel = false;
    heroModelViewerKey.value += 1;
    await nextTick();
  }
  setupHeroIntersection();
});

const professionIconMap = {
  code: CodeBracketSquareIcon,
  cloud: CloudIcon,
  cube: CubeTransparentIcon
};

const professions = computed(() => {
  const raw = tm('professions');
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => (typeof entry === 'string' ? null : entry))
    .filter(Boolean);
});

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
/* --- 基础布局：首屏至少一屏高，留白由 hero-shell 在「主区 / 箭头」之间分配 --- */
.hero-section {
  position: relative;
  min-height: calc(100vh - 80px);
  min-height: calc(100dvh - 80px);
  box-sizing: border-box;
  width: 100%;
  background-color: transparent;
  color: var(--text-color);
  overflow: hidden;
  font-family: var(--font-sans);
  display: flex;
  flex-direction: column;
  padding-top: clamp(4vh, 7vh, 9vh);
  padding-bottom: clamp(0.75rem, 1.8vh, 1.25rem);
}

.paper-texture,
.floating-decorations {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.hero-shell {
  position: relative;
  z-index: 10;
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
}

.hero-top {
  flex: 0 0 auto;
  width: 100%;
}

.hero-bottom {
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

/*
 * 主内容区：与 ProjectsSection 共用 main.css 的 --page-*（与顶栏独立）
 */
.container-fluid {
  width: 100%;
  max-width: var(--page-max-width);
  margin: 0 auto;
  padding: 40px var(--page-pad-x);
}

.layout-grid {
  display: grid;
  /* 模型一侧给足比例（1.2fr），文本侧自然收紧；最小 360/440 守住可读性 */
  grid-template-columns: minmax(360px, 1fr) minmax(440px, 1.2fr);
  align-items: stretch;
  justify-content: center;
  /* 中等屏紧凑、27" 大屏自然舒展；27" 还会在 1600+ media query 里再放大 */
  gap: clamp(2.5rem, 3vw, 4rem);
}

/* ============ 文字区 ============ */
.text-area {
  /* 与 Projects 左侧索引列同一左缘：首字与「// ARCHIVE」对齐 */
  justify-self: start;
  width: 100%;
  max-width: 560px;
  display: flex;
  align-items: center;
}
.content-wrapper {
  width: 100%;
  /* 两段（intro / skills）居中分布，靠流体字号自然撑高 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(2rem, 5vh, 3.6rem);
}

.name-container { position: relative; display: inline-block; }
.highlight-name {
  /* 流体字号上限收紧：避免在 1440px 中等屏（文本列只有 ~430px）下溢出 */
  font-size: clamp(4.2rem, 5.6vw, 7.4rem);
  letter-spacing: -2px;
  font-weight: 900;
  line-height: 1;
  color: var(--text-color);
  position: relative;
  display: inline-block;
  z-index: 1;
}

/* 纯 CSS 弧形下划线：
   - 利用 border-radius:50% 把伪元素的盒子塑造成椭圆轮廓
   - 只渲染 border-top，于是只看到椭圆的"上半弧"——形如笑脸
   - 把这个伪元素整体放到文字基线下方，弧线就成了一条微微上扬的下划线
   - clip-path 从右往左收缩，形成"由左向右画出来"的手写感动画 */
.highlight-name::after {
  content: '';
  position: absolute;
  left: -2%;
  right: -2%;
  bottom: -32px;
  height: 28px;
  border-top: 7px solid var(--primary-color);
  border-radius: 50%;
  pointer-events: none;
  z-index: -1;
  clip-path: inset(0 100% 0 0);
  animation: drawArc 1.3s cubic-bezier(0.65, 0, 0.35, 1) 0.8s forwards;
  filter: drop-shadow(0 1px 2px rgba(77, 171, 247, 0.18));
}
.sticky-note { position: absolute; top: -25px; right: -105px; width: 95px; height: 95px; background-color: #fcc419; box-shadow: var(--hover-shadow); transform: rotate(8deg); display: flex; justify-content: center; align-items: center; text-align: center; font-family: var(--font-handwriting); font-size: 1.2rem; line-height: 1; color: #1f2937; z-index: 5; }
.note-pin { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); font-size: 1.4rem; color: #e63946; }

/* ============ 顶部介绍 ============ */
.greeting {
  font-size: clamp(1.6rem, 1.8vw + 0.3rem, 2.6rem);
  color: var(--text-color);
  font-weight: 800;
  display: inline-block;
  margin-bottom: 0.4em;
  letter-spacing: 0.02em;
}
.sub-heading {
  font-size: clamp(1.05rem, 0.7vw + 0.55rem, 1.5rem);
  font-weight: 700;
  color: var(--secondary-color);
  margin: clamp(2.2rem, 4vh, 3rem) 0 0 0;
  letter-spacing: 0.04em;
  line-height: 1.4;
}

/* ============ 中段技能 ============ */
.skill-list {
  display: flex;
  flex-direction: column;
  gap: clamp(0.85rem, 0.7vh + 0.4rem, 1.4rem);
}
.skill-item {
  display: flex;
  align-items: center;
  gap: 0.55em;
  font-size: clamp(1.15rem, 0.7vw + 0.6rem, 1.6rem);
  font-weight: 700;
  color: var(--text-color);
  opacity: 0;
  animation: fadeInRight 0.5s ease-out forwards;
  letter-spacing: 0.01em;
}
.skill-item__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.15em;
  height: 1.15em;
  color: var(--primary-color);
  opacity: 0.88;
}
.skill-item__svg {
  width: 100%;
  height: 100%;
}
.skill-item__label {
  line-height: 1.35;
}

/* ============ 滚动提示：固定在首屏下沿区域（由 hero-shell 的 space-between 推出位置） ============ */
.scroll-cue {
  position: relative;
  width: 44px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--secondary-color);
  text-decoration: none;
  z-index: 50;
  cursor: pointer;
  opacity: 0;
  animation: scrollCueIn 0.55s ease-out 0.9s forwards;
  transition: color 0.25s ease;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.2));
}
.scroll-cue:hover {
  color: var(--primary-color);
}
.scroll-cue-arrow {
  width: 100%;
  height: 100%;
  animation: scrollArrowBob 2.2s cubic-bezier(0.65, 0, 0.35, 1) 1.6s infinite;
}
.scroll-cue-arrow path {
  opacity: 0.5;
  animation: scrollChevron 2.2s ease-in-out infinite;
}
.scroll-cue-arrow .scroll-cue-arrow--second {
  animation-delay: 0.4s;
}

/* --- 3D 模型区域优化 --- */
.model-area {
  justify-self: start;
  position: relative;
  /* 模型高度略降（800 → 720），与文本三段式骨架更平衡；同时保持下限 */
  height: clamp(50vh, 64vh, min(70vh, 720px));
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
}

/* 隐藏 model-viewer 底部加载条（slot 已替换默认实现，此处兜底） */
.huge-model::part(default-progress-bar) {
  display: none;
  opacity: 0;
}

/* 动画关键帧 */
@keyframes drawArc { to { clip-path: inset(0 0 0 0); } }
@keyframes fadeInRight { from { opacity: 0; transform: translateX(-15px); } to { opacity: 1; transform: translateX(0); } }
@keyframes scrollCueIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
/* 仅 SVG 上下浮动，避免与外层 translateX(-50%) 冲突 */
@keyframes scrollArrowBob {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(5px); }
}
/* 双 chevron 错位闪烁，营造"持续向下"的指引 */
@keyframes scrollChevron {
  0%, 100% { opacity: 0.35; }
  50%      { opacity: 1; }
}
/* 响应式适配 */
@media (max-width: 1024px) {
  .hero-section {
    padding-top: 5vh;
    padding-bottom: clamp(0.75rem, 1.5vh, 1.25rem);
  }
  /* 移动端：容器回退到完全居中（不再用 calc 偏移），与 Projects 在小屏的处理一致 */
  .container-fluid { max-width: 100%; margin-left: auto; padding: 0 1rem; }
  .layout-grid { grid-template-columns: 1fr; text-align: center; gap: 2rem; align-items: center; }
  .text-area { justify-self: center; padding-right: 0; max-width: 100%; }
  .content-wrapper { gap: 1.6rem; }
  .skill-list { align-items: center; }
  .skill-item { justify-content: center; }
  .model-area { justify-self: center; height: 45vh; }
  .sticky-note { right: 0; top: -40px; }
  .scroll-cue { width: 40px; height: 44px; }
}

/* 大屏：首屏主区整体略向右移（加左内边距、略收右内边距），文案与模型间距不变 */
@media (min-width: 1600px) {
  .container-fluid {
    max-width: var(--page-max-width-lg);
    padding: 40px max(1rem, calc(var(--page-pad-x) - clamp(0.5rem, 1.2vw, 1.25rem))) 40px
      calc(var(--page-pad-x) + clamp(1.75rem, 3.2vw, 3.25rem));
  }
  .layout-grid {
    gap: clamp(4.75rem, 5.5vw, 6.5rem);
  }
  .model-area {
    height: clamp(52vh, 62vh, min(72vh, 760px));
  }
  .highlight-name::after {
    height: 32px;
    bottom: -36px;
    border-top-width: 8px;
  }
  .scroll-cue {
    width: 48px;
    height: 54px;
  }
}

/* 更宽视口：在上一档基础上再多移一点，与容器变宽成比例 */
@media (min-width: 1920px) {
  .container-fluid {
    max-width: var(--page-max-width-xl);
    padding: 40px max(1rem, calc(var(--page-pad-x) - clamp(0.75rem, 1.4vw, 1.5rem))) 40px
      calc(var(--page-pad-x) + clamp(2.25rem, 3.8vw, 4rem));
  }
}

@media (prefers-reduced-motion: reduce) {
  .highlight-name::after { animation: none; clip-path: none; }
  .scroll-cue { animation: none; opacity: 1; transform: none; }
  .scroll-cue-arrow { animation: none; }
  .scroll-cue-arrow path { animation: none; opacity: 0.65; }
}
</style>
