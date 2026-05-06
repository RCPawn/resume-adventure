<template>
  <button
    type="button"
    @click="goBack"
    :class="['back-btn', `back-btn--${variant}`, { 'back-btn--inline': inline }]"
    title="返回上一级"
    aria-label="返回上一页"
  >
    <svg class="back-btn__icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        fill="currentColor"
        d="M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"
      />
    </svg>
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({
  /** surface：与顶栏控制按钮一致的浅色底+描边；hero：叠在大图/暗底上时的高对比毛玻璃 */
  variant: {
    type: String,
    default: 'surface',
    validator: (v) => ['surface', 'hero', 'ghost'].includes(v),
  },
  /** true：参与文档流布局，不占固定层，避免与正文重叠 */
  inline: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()

const goBack = () => {
  if (window.history.length <= 1) {
    router.push('/')
  } else {
    router.go(-1)
  }
}
</script>

<style scoped>
.back-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 9999;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  border-radius: 8px;
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.back-btn.back-btn--inline {
  position: relative;
  top: auto;
  left: auto;
  z-index: 1;
  flex-shrink: 0;
}

.back-btn__icon {
  display: block;
  flex-shrink: 0;
}

/* 与 NavBar 的 napkin-control-btn（GitHub）同款：实底 + 描边，贴合站点控件语言 */
.back-btn--surface {
  background-color: var(--btn-bg);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  box-shadow: var(--hover-shadow);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.back-btn--surface:hover {
  border-color: color-mix(in srgb, var(--primary-color) 55%, var(--border-color));
  color: var(--primary-color);
  transform: translateY(-1px);
}

.back-btn--surface:active {
  transform: translateY(0);
}

@supports not (color: color-mix(in srgb, red, blue)) {
  .back-btn--surface:hover {
    border-color: var(--primary-color);
  }
}

/* 与 ProjectDetail 元信息标签同系：深半透明底 + 浅色图标，亮色主题下叠暗色封面仍可读 */
.back-btn--hero {
  background: rgba(15, 23, 42, 0.52);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.08) inset,
    0 2px 14px rgba(0, 0, 0, 0.25);
}

.back-btn--hero:hover {
  background: rgba(15, 23, 42, 0.66);
  border-color: rgba(255, 255, 255, 0.28);
  color: #fff;
}

.back-btn--hero:active {
  background: rgba(15, 23, 42, 0.72);
}

html.dark .back-btn--hero {
  background: rgba(15, 23, 42, 0.62);
}

html.dark .back-btn--hero:hover {
  background: rgba(15, 23, 42, 0.78);
}

/* 极简：仅图标，用于特殊底图；默认不推荐 */
.back-btn--ghost {
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-color);
}

.back-btn--ghost:hover {
  background-color: rgba(var(--primary-color-rgb), 0.1);
  color: var(--primary-color);
}

html.dark .back-btn--ghost:hover {
  background-color: rgba(var(--primary-color-rgb), 0.2);
}

@media (max-width: 768px) {
  .back-btn:not(.back-btn--inline) {
    top: 16px;
    left: 16px;
    width: 40px;
    height: 40px;
  }

  .back-btn__icon {
    width: 18px;
    height: 18px;
  }
}

@media (min-width: 1920px) {
  .back-btn--surface {
    backdrop-filter: blur(9px);
    -webkit-backdrop-filter: blur(9px);
  }

  .back-btn--hero {
    backdrop-filter: blur(11px);
    -webkit-backdrop-filter: blur(11px);
  }
}
</style>
