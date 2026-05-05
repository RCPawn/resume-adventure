import { effectScope, nextTick } from 'vue'
import { useDark } from '@vueuse/core'

/**
 * 主题（useDark / useColorMode）必须在**不随页面卸载而停止**的 effect scope 里初始化。
 * 若首次在 NavBar 子组件里调用 useDark，离开首页时该组件 scope 被 dispose，
 * 同步 html class 的 watch 会失效，表现为详情页与返回首页后点击主题均无反应。
 */
let themePersistentScope = null
let isDarkModeSingleton = null

function ensureThemeRefs() {
  if (isDarkModeSingleton) return
  themePersistentScope = effectScope(true)
  themePersistentScope.run(() => {
    isDarkModeSingleton = useDark({
      selector: 'html',
      attribute: 'class',
      valueDark: 'dark',
      valueLight: '',
      storageKey: 'theme',
    })
  })
}

/** 与 NavBar / 文档页顶栏共用，避免连点叠加多次 View Transition */
let themeTransitionActive = false
let transitionSafetyTimer = null

function clearTransitionLock() {
  themeTransitionActive = false
  if (transitionSafetyTimer != null) {
    clearTimeout(transitionSafetyTimer)
    transitionSafetyTimer = null
  }
}

function flipDarkMode() {
  ensureThemeRefs()
  if (!isDarkModeSingleton) return
  isDarkModeSingleton.value = !isDarkModeSingleton.value
}

/**
 * 站点亮/暗主题（html class `dark`，localStorage `theme`），含可选的圆形 View Transition。
 */
export function useAppearanceTheme() {
  ensureThemeRefs()

  const toggleTheme = (event) => {
    if (themeTransitionActive) return

    const x = event && 'clientX' in event ? event.clientX : innerWidth / 2
    const y = event && 'clientY' in event ? event.clientY : innerHeight / 2

    const canViewTransition = typeof document !== 'undefined'
      && typeof document.startViewTransition === 'function'
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!canViewTransition) {
      flipDarkMode()
      return
    }

    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    )

    themeTransitionActive = true
    transitionSafetyTimer = window.setTimeout(clearTransitionLock, 2600)

    let transition
    try {
      transition = document.startViewTransition(() => {
        flipDarkMode()
        return nextTick()
      })
    } catch {
      clearTransitionLock()
      flipDarkMode()
      return
    }

    transition.finished.finally(() => {
      clearTransitionLock()
    })

    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 400,
            easing: 'ease-in',
            pseudoElement: '::view-transition-new(root)',
          },
        )
      })
      .catch(() => {})
  }

  return { isDarkMode: isDarkModeSingleton, toggleTheme }
}
