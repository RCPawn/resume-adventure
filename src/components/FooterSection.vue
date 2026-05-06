<template>
  <footer id="footer" class="footer-section">
    <div class="footer-inner">
      <div class="footer-ornament" aria-hidden="true">
        <span class="footer-ornament__line" />
        <span class="footer-ornament__diamond" />
        <span class="footer-ornament__line" />
      </div>

      <div class="footer-container">
        <div class="footer-brand">
          <p class="brand-eyebrow">{{ t('footer.stayInTouch') }}</p>
          <h2 class="brand-name">{{ t('footer.appName') }}</h2>
          <p class="brand-tagline">{{ t('footer.tagline') }}</p>

          <div class="social-actions">
            <div class="social-links">
              <a
                  v-for="(social, index) in tm('footer.socialLinks')"
                  :key="index"
                  :href="social.url"
                  class="social-btn"
                  target="_blank"
                  :title="social.icon"
                  rel="noreferrer"
              >
                <i :class="social.icon"></i>
              </a>
            </div>

            <a
              :href="resumePdfHref"
              class="resume-pdf-btn"
              download
              rel="noreferrer"
              :aria-label="t('footer.downloadResumeAria')"
            >
              <span class="btn-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </span>
              {{ t('footer.downloadResume') }}
            </a>
        </div>
      </div>

      <div class="footer-tech">
        <h3>{{ t('footer.techTitle') }}</h3>
        <div class="tech-grid">
          <span v-for="tech in techStack" :key="tech" class="tech-tag">{{ tech }}</span>
        </div>
      </div>

      <div class="footer-nav">
        <div v-for="(group, index) in tm('footer.linkGroups')" :key="index" class="nav-group">
          <h4>{{ group.title }}</h4>
          <ul>
            <li v-for="(link, linkIndex) in group.links" :key="linkIndex">
              <a :href="link.url" :target="isExternal(link.url) ? '_blank' : '_self'" rel="noreferrer">
                {{ link.text }}
              </a>
            </li>
          </ul>
        </div>
      </div>
      </div>

      <div class="footer-bottom-wrap">
        <div class="footer-meta-bar">
          <p class="copyright">
            {{ t('footer.copyright', { year: new Date().getFullYear() }) }}
          </p>

          <div class="site-stats" role="group" :aria-label="t('footer.statsGroupAria')">
            <span class="stat-inline">
              <svg class="stat-icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path
                    fill="currentColor"
                    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                />
              </svg>
              <span class="stat-label">{{ t('footer.statsSitePv') }}</span>
              <span id="busuanzi_site_pv" class="stat-value" aria-live="polite">{{ sitePvText }}</span>
            </span>
            <span class="stat-sep" aria-hidden="true">·</span>
            <span class="stat-inline">
              <svg class="stat-icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path
                    fill="currentColor"
                    d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
                />
              </svg>
              <span class="stat-label">{{ t('footer.statsTodayUv') }}</span>
              <span id="busuanzi_today_uv" class="stat-value" aria-live="polite">{{ todayUvText }}</span>
            </span>
            <span class="stat-sep" aria-hidden="true">·</span>
            <span class="stat-inline">
              <svg class="stat-icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path
                    fill="currentColor"
                    d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"
                />
              </svg>
              <span class="stat-label">{{ t('footer.statsRunning') }}</span>
              <span class="stat-value">{{ runningDays }} {{ t('footer.statsRunningUnit') }}</span>
            </span>
          </div>

          <p class="made-with">
            {{ t('footer.madeWith') }} <span class="heart" aria-hidden="true">❤</span>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { requestBusuanziApply } from '@/utils/busuanziApi'

const { t, tm, locale } = useI18n()
const route = useRoute()

const resumePdfHref = computed(() => {
  const base = import.meta.env.BASE_URL || '/'
  return base.endsWith('/') ? `${base}resume.pdf` : `${base}/resume.pdf`
})

const STAT_PLACEHOLDER = '—'
const sitePvText = ref(STAT_PLACEHOLDER)
const todayUvText = ref(STAT_PLACEHOLDER)
const techStack = ['Vue3', 'Vite', 'I18n', 'Reveal.js', 'Markdown-it', '@google/model-viewer']

const isExternal = (url) => /^https?:\/\//i.test(url)

const startDate = new Date('2025-02-07T22:55:00')
const runningDays = computed(() => {
  const now = new Date()
  const diff = now - startDate
  return Math.floor(diff / (1000 * 60 * 60 * 24))
})

/** 不蒜子按每次 POST 计 PV；切勿用定时器反复请求，否则长时间停留会虚增阅读量。统计刷新依赖：首屏、路由、回到前台（visibility/pageshow）。 */
const CACHE_KEY = 'footer_busuanzi_cache_v1'

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const saveCache = (payload) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
  } catch {
    // 忽略缓存写入失败
  }
}

const normalizeStatNumber = (text) => String(text ?? '').replace(/[^\d]/g, '')

const isValidNumberText = (text) => {
  const n = normalizeStatNumber(text)
  return n.length > 0 && n !== '0'
}

const getCurrentStatsFromDom = () => {
  const sitePvEl = document.getElementById('busuanzi_site_pv')
  const todayUvEl = document.getElementById('busuanzi_today_uv')

  return {
    sitePv: normalizeStatNumber(sitePvEl?.textContent),
    todayUv: normalizeStatNumber(todayUvEl?.textContent)
  }
}

const applyStatsToDom = (stats) => {
  if (stats.sitePv) {
    sitePvText.value = t('footer.statsPvFormat', { n: stats.sitePv })
  }
  if (stats.todayUv) {
    todayUvText.value = t('footer.statsUvFormat', { n: stats.todayUv })
  }
}

const hydrateFromCache = () => {
  const cache = readCache()
  if (cache) {
    const pv = normalizeStatNumber(cache.sitePv)
    const uv = normalizeStatNumber(cache.todayUv)
    if (pv) sitePvText.value = t('footer.statsPvFormat', { n: pv })
    if (uv) todayUvText.value = t('footer.statsUvFormat', { n: uv })
  }
}

const refreshBusuanzi = async () => {
  if (typeof window === 'undefined') return

  await nextTick()

  // 等 Footer DOM 稳定后再触发刷新，避免路由切换瞬间拿到空节点（与 CDN 3.6 一次性 script 解耦，直接调 api）
  window.setTimeout(() => {
    requestBusuanziApply()

    // 再延迟读一次 DOM，把成功结果缓存下来；失败时保留缓存值，不显示 0
    window.setTimeout(() => {
      const current = getCurrentStatsFromDom()

      const hasValidSitePv = isValidNumberText(current.sitePv)
      const hasValidTodayUv = isValidNumberText(current.todayUv)

      if (hasValidSitePv || hasValidTodayUv) {
        const nextCache = {
          sitePv: hasValidSitePv ? current.sitePv : normalizeStatNumber(sitePvText.value),
          todayUv: hasValidTodayUv ? current.todayUv : normalizeStatNumber(todayUvText.value)
        }
        saveCache(nextCache)
        applyStatsToDom(nextCache)
        return
      }

      // 如果这次没拿到有效值，就恢复上一次成功缓存，避免显示 0
      const cache = readCache()
      if (cache) {
        applyStatsToDom({
          sitePv: normalizeStatNumber(cache.sitePv),
          todayUv: normalizeStatNumber(cache.todayUv)
        })
      }
    }, 1200)
  }, 180)
}

const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    refreshBusuanzi()
  }
}

const handlePageShow = () => {
  refreshBusuanzi()
}

onMounted(async () => {
  hydrateFromCache()

  refreshBusuanzi()

  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('pageshow', handlePageShow)
})

watch(locale, () => {
  const cache = readCache()
  const pv = normalizeStatNumber(cache?.sitePv ?? sitePvText.value)
  const uv = normalizeStatNumber(cache?.todayUv ?? todayUvText.value)
  if (pv) sitePvText.value = t('footer.statsPvFormat', { n: pv })
  if (uv) todayUvText.value = t('footer.statsUvFormat', { n: uv })
})

watch(
    () => route.fullPath,
    () => {
      refreshBusuanzi()
    },
    { flush: 'post' }
)

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  window.removeEventListener('pageshow', handlePageShow)
})

defineExpose({
  refreshBusuanzi
})
</script>

<style scoped>
.footer-section {
  --footer-serif: var(--font-serif);
  --footer-sans: var(--font-sans);
  --footer-pad-x: clamp(1rem, 3.5vw, 1.75rem);
  --footer-pad-top: clamp(0.5rem, 1.05vw, 0.95rem);
  --footer-pad-bottom: max(0.65rem, env(safe-area-inset-bottom, 0px));
  --footer-max: min(72rem, 96vw);
  --footer-section-gap: clamp(1rem, 2.2vw, 1.65rem);
  --footer-ctrl-h: 2.25rem;
  /* 与顶栏一致底，顶边与底栏内分割共用弱对比线 */
  --footer-sep: color-mix(in srgb, var(--border-color) 36%, transparent);

  position: relative;
  scroll-margin-top: calc(var(--layout-navbar-height, 72px) + 12px);
  padding: var(--footer-pad-top) var(--footer-pad-x) var(--footer-pad-bottom);
  font-family: var(--footer-sans);
  color: var(--text-color);
  border-top: 1px solid var(--footer-sep);
  background-color: var(--bg-color);
}

.footer-inner {
  position: relative;
  z-index: 1;
  max-width: var(--footer-max);
  margin-inline: auto;
}

.footer-ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: clamp(0.35rem, 0.9vw, 0.55rem);
}

.footer-ornament__line {
  flex: 1;
  max-width: 5rem;
  height: 1px;
  background-color: var(--border-color);
}

.footer-ornament__diamond {
  width: 5px;
  height: 5px;
  background: var(--primary-color);
  opacity: 0.55;
  transform: rotate(45deg);
  flex-shrink: 0;
}

.footer-container {
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(0, 1fr) minmax(0, 1.02fr);
  column-gap: var(--footer-section-gap);
  row-gap: clamp(0.75rem, 1.6vw, 1.05rem);
  align-items: start;
  margin-bottom: clamp(0.65rem, 1.5vw, 1.1rem);
}

.footer-brand {
  justify-self: start;
  width: 100%;
  max-width: min(26rem, 100%);
}

.footer-tech {
  justify-self: center;
  width: 100%;
  max-width: 23rem;
}

.footer-nav {
  justify-self: end;
  align-self: start;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: clamp(1.25rem, 2.2vw, 1.85rem);
  width: max-content;
  max-width: 100%;
}

.nav-group {
  flex: 0 0 auto;
  min-width: 0;
  text-align: left;
}

/* 品牌区：杂志式眉题 + 衬线标题 */
.brand-eyebrow {
  margin: 0 0 0.35rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--secondary-color);
}

.brand-name {
  font-family: var(--footer-serif);
  font-size: clamp(1.45rem, 2.2vw, 1.85rem);
  font-weight: 600;
  margin: 0 0 0.45rem;
  color: var(--text-color);
  letter-spacing: 0.02em;
  line-height: 1.2;
}

.brand-tagline {
  margin: 0 0 clamp(0.75rem, 1.5vw, 1.1rem);
  font-size: clamp(0.875rem, 1.1vw, 1rem);
  line-height: 1.55;
  color: var(--secondary-color);
  max-width: 22rem;
}

.social-actions {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: 0.5rem 0.65rem;
}

.social-links {
  display: inline-flex;
  align-items: stretch;
  gap: 0.5rem;
}

.social-btn {
  box-sizing: border-box;
  width: var(--footer-ctrl-h);
  height: var(--footer-ctrl-h);
  min-width: var(--footer-ctrl-h);
  min-height: var(--footer-ctrl-h);
  border-radius: 10px;
  background: var(--btn-bg);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color);
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

.social-btn:hover {
  background: var(--modal-bg);
  border-color: color-mix(in srgb, var(--primary-color) 45%, var(--border-color));
  color: var(--primary-color);
  box-shadow: 0 6px 18px rgba(var(--primary-color-rgb, 59, 130, 246), 0.12);
}

.social-btn:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 3px;
}

.social-btn i {
  font-size: 1.05rem;
  color: inherit;
}

@media (prefers-reduced-motion: no-preference) {
  .social-btn:hover {
    transform: translateY(-2px);
  }
}

.resume-pdf-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  box-sizing: border-box;
  min-height: var(--footer-ctrl-h);
  height: var(--footer-ctrl-h);
  padding: 0 0.95rem;
  line-height: 1;
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--primary-color) 38%, var(--border-color));
  background: color-mix(in srgb, var(--primary-color) 10%, var(--btn-bg));
  color: var(--primary-color);
  cursor: pointer;
  font-family: inherit;
  font-weight: 650;
  font-size: 0.8125rem;
  letter-spacing: 0.02em;
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

.resume-pdf-btn:hover {
  background: color-mix(in srgb, var(--primary-color) 18%, var(--modal-bg));
  border-color: color-mix(in srgb, var(--primary-color) 55%, var(--border-color));
  color: var(--primary-color);
  box-shadow: 0 6px 18px rgba(var(--primary-color-rgb, 59, 130, 246), 0.18);
}

.resume-pdf-btn:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: no-preference) {
  .resume-pdf-btn:hover {
    transform: translateY(-2px);
  }
}

.resume-pdf-btn .btn-icon {
  display: flex;
  align-items: center;
}

@supports not (border-color: color-mix(in srgb, white 50%, black)) {
  .resume-pdf-btn {
    border-color: var(--primary-color);
    background: var(--btn-bg);
  }
}

/* 技术栈：与左右列形成「左齐 / 中轴 / 右齐」节奏 */
.footer-tech h3 {
  margin: 0 0 0.5rem;
  text-align: center;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--secondary-color);
}

.tech-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.45rem;
  justify-content: center;
}

.tech-tag {
  padding: 0.28rem 0.62rem;
  background: color-mix(in srgb, var(--btn-bg) 92%, transparent);
  border-radius: 6px;
  font-size: 0.8125rem;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  font-weight: 500;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.tech-tag:hover {
  border-color: color-mix(in srgb, var(--primary-color) 40%, var(--border-color));
  color: var(--primary-color);
  background: var(--modal-bg);
  box-shadow: 0 3px 10px rgba(var(--primary-color-rgb, 59, 130, 246), 0.08);
}

@supports not (background-color: color-mix(in srgb, white 50%, black)) {
  .tech-tag {
    background: var(--btn-bg);
  }

  .tech-tag:hover {
    border-color: var(--primary-color);
  }
}

.nav-group h4 {
  margin: 0 0 0.55rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-color);
}

.nav-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-group li {
  margin-bottom: 0.4rem;
}

.nav-group li:last-child {
  margin-bottom: 0;
}

.nav-group a {
  text-decoration: none;
  color: var(--secondary-color);
  font-size: 0.875rem;
  transition: color 0.2s ease;
  text-underline-offset: 0.2em;
}

.nav-group a:hover {
  color: var(--primary-color);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.25em;
}

.nav-group a:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
  border-radius: 2px;
}

/* 底栏：单行三列 — 版权 | 统计 | 署名，节省纵向空间 */
/* 底栏元信息上沿：与主顶边同一套弱分割 */
.footer-bottom-wrap {
  border-top: 1px solid var(--footer-sep, color-mix(in srgb, var(--border-color) 36%, transparent));
  padding-top: clamp(0.45rem, 1vw, 0.65rem);
  padding-bottom: 0;
}

.footer-meta-bar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  column-gap: clamp(0.65rem, 1.8vw, 1.35rem);
  row-gap: 0.3rem;
}

.copyright {
  margin: 0;
  justify-self: start;
  text-align: left;
  font-size: 0.6875rem;
  line-height: 1.45;
  letter-spacing: 0.03em;
  color: var(--secondary-color);
  max-width: 22rem;
}

.site-stats {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  justify-self: center;
  gap: 0;
  max-width: min(100%, 42rem);
  font-size: 0.6875rem;
  color: var(--secondary-color);
}

.stat-inline {
  display: inline-flex;
  align-items: center;
  gap: 0.28rem;
  white-space: nowrap;
}

.stat-sep {
  color: color-mix(in srgb, var(--secondary-color) 45%, var(--border-color));
  padding: 0 0.4rem;
  font-weight: 300;
  user-select: none;
  line-height: 1;
}

@supports not (color: color-mix(in srgb, white 50%, black)) {
  .stat-sep {
    color: var(--border-color);
  }
}

.stat-icon {
  flex-shrink: 0;
  color: var(--primary-color);
  opacity: 0.82;
}

.stat-label {
  font-weight: 500;
  color: var(--secondary-color);
  letter-spacing: 0.02em;
}

.stat-value {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--text-color);
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

.made-with {
  margin: 0;
  justify-self: end;
  text-align: right;
  font-size: 0.6875rem;
  line-height: 1.45;
  letter-spacing: 0.02em;
  color: var(--secondary-color);
  max-width: 20rem;
}

.heart {
  color: #e11d48;
  display: inline-block;
}

@media (prefers-reduced-motion: no-preference) {
  .heart {
    animation: heartbeat 1.6s ease-in-out infinite;
  }

  @keyframes heartbeat {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.08);
    }
  }
}

@media (max-width: 1024px) {
  .footer-container {
    grid-template-columns: 1fr;
    gap: clamp(1.35rem, 3.5vw, 1.85rem);
    text-align: center;
  }

  .brand-tagline {
    margin-inline: auto;
  }

  .social-actions {
    justify-content: center;
  }

  .tech-grid {
    justify-content: center;
  }

  .footer-nav {
    justify-self: center;
    justify-content: center;
    width: 100%;
    max-width: min(26rem, 100%);
    margin-inline: auto;
  }

  .footer-brand,
  .footer-tech {
    justify-self: center;
    margin-inline-start: unset;
  }

  .footer-brand {
    max-width: min(26rem, 100%);
  }

  .footer-tech {
    max-width: min(26rem, 100%);
  }
}

/* 平板及以下：底栏两行（版权 + 署名 | 统计整行），比三行堆叠更省高 */
@media (max-width: 1180px) {
  .footer-meta-bar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'copy made'
      'stats stats';
    justify-items: stretch;
    column-gap: 0.75rem;
    row-gap: 0.45rem;
  }

  .copyright {
    grid-area: copy;
    text-align: left;
    max-width: none;
  }

  .made-with {
    grid-area: made;
    text-align: right;
    max-width: none;
  }

  .site-stats {
    grid-area: stats;
    justify-self: center;
  }
}

@media (max-width: 520px) {
  .footer-meta-bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .copyright,
  .made-with {
    text-align: center;
    max-width: none;
  }

  .stat-inline {
    white-space: normal;
  }

  .site-stats {
    flex-direction: column;
    row-gap: 0.35rem;
  }

  .stat-sep {
    display: none;
  }
}

@media (min-width: 1440px) {
  .footer-section {
    --footer-pad-top: clamp(0.55rem, 1vw, 1rem);
  }

  .footer-container {
    column-gap: clamp(1.2rem, 2vw, 1.85rem);
  }
}

@media (min-width: 1920px) {
  .footer-section {
    --footer-max: min(76rem, 94vw);
  }
}
</style>

<style>
/* 暗色：顶栏/大底边/元信息线统一更弱，避免高对比「硬线」 */
html.dark .footer-section {
  --footer-sep: color-mix(in srgb, var(--border-color) 18%, transparent);
}
</style>