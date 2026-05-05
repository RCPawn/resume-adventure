<template>
  <button
    type="button"
    v-bind="attrs"
    class="theme-appearance-toggle"
    :class="{
      'theme-appearance-toggle--light-on': !isDarkMode,
      'theme-appearance-toggle--doc': variant === 'doc',
    }"
    :aria-pressed="isDarkMode"
    :aria-label="isDarkMode ? '当前为深色模式，点击切换为浅色' : '当前为浅色模式，点击切换为深色'"
    :title="isDarkMode ? '切换为浅色' : '切换为深色'"
    @click="toggleTheme"
  >
    <SunIcon v-if="!isDarkMode" class="theme-appearance-toggle__ico" aria-hidden="true" />
    <MoonIcon v-else class="theme-appearance-toggle__ico" aria-hidden="true" />
  </button>
</template>

<script setup>
import { useAttrs } from 'vue'
import { SunIcon, MoonIcon } from '@heroicons/vue/24/solid'
import { useAppearanceTheme } from '@/composables/useAppearanceTheme'

defineOptions({ inheritAttrs: false })

defineProps({
  /** nav：由外层 napkin 按钮类控制尺寸；doc：项目详情顶栏 38px 方钮 */
  variant: {
    type: String,
    default: 'nav',
    validator: (v) => ['nav', 'doc'].includes(v),
  },
})

const attrs = useAttrs()
const { isDarkMode, toggleTheme } = useAppearanceTheme()
</script>

<style scoped>
.theme-appearance-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.theme-appearance-toggle__ico {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
  color: inherit;
}

.theme-appearance-toggle--doc .theme-appearance-toggle__ico {
  width: 1.25rem;
  height: 1.25rem;
}

/* 浅色模式：实心太阳略偏琥珀，和月亮的冷色形成对比 */
.theme-appearance-toggle--light-on .theme-appearance-toggle__ico {
  color: #d97706;
}

/* 深色模式：月亮用主题蓝，与浅色太阳对称、更易扫一眼分辨 */
html.dark .theme-appearance-toggle:not(.theme-appearance-toggle--light-on) .theme-appearance-toggle__ico {
  color: var(--primary-color);
}

/* 文档顶栏：与返回键同系 */
.theme-appearance-toggle--doc {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 10px;
  border: 1px solid transparent;
  background: color-mix(in srgb, var(--text-color) 4%, transparent);
  color: var(--text-color);
  cursor: pointer;
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.theme-appearance-toggle--doc:hover {
  background: color-mix(in srgb, var(--text-color) 8%, transparent);
  border-color: color-mix(in srgb, var(--border-color) 50%, transparent);
  color: var(--primary-color);
}

.theme-appearance-toggle--doc:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

@supports not (background: color-mix(in srgb, red, blue)) {
  .theme-appearance-toggle--doc {
    background: rgba(0, 0, 0, 0.04);
  }

  .theme-appearance-toggle--doc:hover {
    background: rgba(0, 0, 0, 0.07);
  }

  html.dark .theme-appearance-toggle--doc {
    background: rgba(255, 255, 255, 0.06);
  }

  html.dark .theme-appearance-toggle--doc:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>
