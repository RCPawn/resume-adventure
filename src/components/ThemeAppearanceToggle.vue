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
  /** nav：由外层 napkin 控制尺寸；doc：详情顶栏 38px，常驻 btn-bg，悬停主色浅底 */
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
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  display: block;
  transform-origin: 50% 50%;
  color: inherit;
}

/* 浅色模式：实心太阳略偏琥珀，和月亮的冷色形成对比 */
.theme-appearance-toggle--light-on .theme-appearance-toggle__ico {
  color: #d97706;
}

/* 深色模式：月亮用主题蓝，与浅色太阳对称、更易扫一眼分辨 */
html.dark .theme-appearance-toggle:not(.theme-appearance-toggle--light-on) .theme-appearance-toggle__ico {
  color: var(--primary-color);
}

/* 详情顶栏：常驻 btn-bg；悬停与 GoBack ghost 同款主色浅底 */
.theme-appearance-toggle--doc {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 10px;
  border: none;
  background-color: var(--btn-bg);
  color: var(--text-color);
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.theme-appearance-toggle--doc:hover {
  background-color: rgba(var(--primary-color-rgb), 0.1);
  color: var(--primary-color);
}

html.dark .theme-appearance-toggle--doc:hover {
  background-color: rgba(var(--primary-color-rgb), 0.2);
}

.theme-appearance-toggle--doc:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
</style>
