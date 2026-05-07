<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import GoBackButton from '@/components/GoBackButton.vue'
import { listShareArticles, allShareTags } from '@/data/shareDocsRegistry'
import 'bootstrap-icons/font/bootstrap-icons.css'

const PAGE_SIZE = 6

const { t } = useI18n()
const router = useRouter()

const searchQuery = ref('')
const activeTag = ref('all')
const pageIndex = ref(0)

const sourceItems = computed(() => listShareArticles())

const tagOptions = computed(() => {
  const tags = allShareTags()
  return [{ key: 'all', labelKey: 'share.tagAll' }, ...tags.map((tag) => ({ key: tag, labelKey: null, raw: tag }))]
})

const filteredItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  let list = sourceItems.value.slice()
  if (activeTag.value !== 'all') {
    list = list.filter((item) => (item.tags || []).includes(activeTag.value))
  }
  if (q) {
    list = list.filter((item) => {
      const hay = `${item.title}\n${item.description}\n${(item.tags || []).join(' ')}`.toLowerCase()
      return hay.includes(q)
    })
  }
  return list
})

const hasActiveFilters = computed(
  () => activeTag.value !== 'all' || searchQuery.value.trim().length > 0,
)

const counterSummary = computed(() => {
  const n = sourceItems.value.length
  const m = filteredItems.value.length
  if (!n) return '—'
  if (!hasActiveFilters.value) return t('share.listTotal', { n })
  return t('share.listFiltered', { m, n })
})

watch([searchQuery, activeTag], () => {
  pageIndex.value = 0
})

const pageCount = computed(() => Math.max(1, Math.ceil(filteredItems.value.length / PAGE_SIZE)))

watch(filteredItems, (list) => {
  const maxIdx = Math.max(0, Math.ceil(list.length / PAGE_SIZE) - 1)
  if (pageIndex.value > maxIdx) pageIndex.value = maxIdx
})

const visibleItems = computed(() => {
  const start = pageIndex.value * PAGE_SIZE
  return filteredItems.value.slice(start, start + PAGE_SIZE)
})

const openArticle = (slug) => {
  router.push({ name: 'share-detail', params: { slug } })
}

const goPrevPage = () => {
  pageIndex.value = Math.max(0, pageIndex.value - 1)
}

const goNextPage = () => {
  pageIndex.value = Math.min(pageCount.value - 1, pageIndex.value + 1)
}
</script>

<template>
  <div class="share-library-root">
    <div class="share-layout">
      <div class="share-lib-toolbar" role="region" :aria-label="t('share.toolbarAria')">
        <div class="share-lib-toolbar__row">
          <div class="share-lib-toolbar__lead">
            <GoBackButton
              variant="ghost"
              inline
              class="share-back-btn"
              :fallback-route="{ name: 'home' }"
              :aria-label="t('share.backToSection')"
            />

            <header class="share-lib-toolbar__identity" aria-labelledby="share-heading">
              <h1 id="share-heading" class="share-main-title">{{ t('share.title') }}</h1>
              <p
                class="share-lib-stat"
                aria-live="polite"
                :aria-label="t('share.listProgressAria')"
              >
                <span class="share-lib-stat__text">{{ counterSummary }}</span>
              </p>
            </header>
          </div>

          <div class="share-lib-toolbar__filters" role="toolbar" :aria-label="t('share.toolbarAria')">
            <div class="share-lib-toolbar__search">
              <i class="bi bi-search share-lib-toolbar__search-icon" aria-hidden="true" />
              <input
                v-model.trim="searchQuery"
                type="search"
                class="share-lib-toolbar__search-input"
                :placeholder="t('share.searchPlaceholder')"
                :aria-label="t('share.searchAria')"
                autocomplete="off"
              />
            </div>

            <div class="share-lib-tag-field">
              <label class="share-lib-tag-field__label" for="share-lib-tag-select">{{
                t('share.tagFilterLabel')
              }}</label>
              <select
                id="share-lib-tag-select"
                v-model="activeTag"
                class="share-lib-tag-select"
                :aria-label="t('share.tagGroupAria')"
              >
                <option v-for="opt in tagOptions" :key="opt.key" :value="opt.key">
                  {{ opt.labelKey ? t(opt.labelKey) : opt.raw }}
                </option>
              </select>
            </div>

            <div v-if="pageCount > 1 && filteredItems.length" class="control-page-cluster share-lib-pager">
              <button
                type="button"
                class="control-page-icon"
                :disabled="pageIndex <= 0"
                :aria-label="t('share.pagePrevAria')"
                @click="goPrevPage"
              >
                <i class="bi bi-chevron-double-left" aria-hidden="true" />
              </button>
              <span class="control-page-text" aria-hidden="true">{{
                t('share.pageIndicator', { current: pageIndex + 1, total: pageCount })
              }}</span>
              <button
                type="button"
                class="control-page-icon"
                :disabled="pageIndex >= pageCount - 1"
                :aria-label="t('share.pageNextAria')"
                @click="goNextPage"
              >
                <i class="bi bi-chevron-double-right" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <section class="share-list-stage" aria-labelledby="share-heading">
        <div v-if="!sourceItems.length" class="share-empty" role="status">
          {{ t('share.emptyNone') }}
        </div>
        <div v-else-if="!filteredItems.length" class="share-empty" role="status">
          {{ t('share.emptyFiltered') }}
          <button type="button" class="share-empty__btn" @click="searchQuery = ''; activeTag = 'all'">
            {{ t('share.clearFilters') }}
          </button>
        </div>

        <ul v-else class="share-card-grid">
          <li v-for="item in visibleItems" :key="item.slug">
            <article
              class="share-card"
              tabindex="0"
              role="link"
              :aria-label="`${item.title} · ${t('share.readMore')}`"
              @click="openArticle(item.slug)"
              @keydown.enter.prevent="openArticle(item.slug)"
              @keydown.space.prevent="openArticle(item.slug)"
            >
              <div class="share-card__head">
                <h2 class="share-card__title">{{ item.title }}</h2>
                <time
                  v-if="item.date"
                  class="share-card__time"
                  :datetime="item.date"
                >{{ item.date }}</time>
              </div>
              <p class="share-card__desc">{{ item.description }}</p>
              <div class="share-card__footer">
                <div v-if="item.tags?.length" class="share-card__tags">
                  <template v-for="(tg, ti) in item.tags.slice(0, 3)" :key="`${tg}-${ti}`">
                    <span v-if="ti > 0" class="share-card__tag-sep" aria-hidden="true">·</span>
                    <span class="share-card__tag">{{ tg }}</span>
                  </template>
                  <span v-if="item.tags.length > 3" class="share-card__tag-more"
                    >+{{ item.tags.length - 3 }}</span
                  >
                </div>
                <span class="share-card__cta" aria-hidden="true">
                  <span class="share-card__cta-text">{{ t('share.readMore') }}</span>
                  <svg class="share-card__arrow-svg" viewBox="0 0 14 10" width="13" height="10" focusable="false">
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
            </article>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.share-library-root {
  width: 100%;
  color: var(--text-color);
}

.share-layout {
  box-sizing: border-box;
  width: 100%;
  max-width: var(--page-content-max-width);
  margin: 0 auto;
  padding: 0 max(var(--page-content-pad-x), env(safe-area-inset-right, 0px))
    clamp(0.75rem, 2vw, 1.25rem)
    max(var(--page-content-pad-x), env(safe-area-inset-left, 0px));
}

.share-lib-toolbar {
  padding: 0 0 1.1rem;
  margin: 0;
  border: none;
  background: transparent;
  border-bottom: 1px solid color-mix(in srgb, var(--border-color) 28%, transparent);
}

.share-lib-toolbar__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 18px;
}

.share-lib-toolbar__lead {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 14px;
  flex: 1 1 auto;
  min-width: 0;
}

.share-lib-toolbar__filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 8px 10px;
  flex: 1 1 260px;
  min-width: 0;
}

.share-back-btn {
  flex-shrink: 0;
}

/* 与学习足迹详情 ProjectDetail `.action-bar__nav` 内返回键同一套覆盖（见 ProjectDetail.vue） */
.share-lib-toolbar__lead :deep(.back-btn.back-btn--ghost) {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: none;
  background-color: var(--btn-bg);
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}

.share-lib-toolbar__lead :deep(.back-btn.back-btn--ghost:hover) {
  background-color: rgba(var(--primary-color-rgb), 0.1);
  color: var(--primary-color);
}

html.dark .share-lib-toolbar__lead :deep(.back-btn.back-btn--ghost:hover) {
  background-color: rgba(var(--primary-color-rgb), 0.2);
}

.share-lib-toolbar__identity {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px 14px;
  flex: 1 1 auto;
  min-width: 0;
}

.share-main-title {
  font-family: var(--font-sans);
  font-size: clamp(1.05rem, 1.35vw, 1.28rem);
  font-weight: 700;
  margin: 0;
  color: var(--text-color);
  line-height: 1.2;
  letter-spacing: -0.03em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.share-lib-toolbar__search {
  flex: 1 1 160px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: min(100%, 140px);
  max-width: min(100%, 320px);
  min-height: 36px;
  padding: 6px 11px;
  border: 1px solid color-mix(in srgb, var(--border-color) 38%, transparent);
  border-radius: 10px;
  background: color-mix(in srgb, var(--btn-bg) 42%, transparent);
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background-color 0.18s ease;
}

.share-lib-toolbar__search:focus-within {
  border-color: color-mix(in srgb, var(--primary-color) 42%, var(--border-color));
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--primary-color) 22%, transparent);
  background: color-mix(in srgb, var(--btn-bg) 55%, transparent);
}

.share-lib-toolbar__search-icon {
  font-size: 0.88rem;
  color: var(--secondary-color);
  flex-shrink: 0;
  opacity: 0.85;
}

.share-lib-toolbar__search-input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 0.86rem;
  color: var(--text-color);
  outline: none;
}

.share-lib-toolbar__search-input::placeholder {
  color: color-mix(in srgb, var(--secondary-color) 75%, transparent);
}

.share-lib-stat {
  flex: 0 1 auto;
  margin: 0;
}

.share-lib-stat__text {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--secondary-color);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.share-lib-tag-field {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 1 auto;
  min-width: 0;
  max-width: min(100%, 200px);
}

.share-lib-tag-field__label {
  flex-shrink: 0;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--secondary-color);
  letter-spacing: 0.02em;
}

.share-lib-tag-select {
  flex: 1 1 auto;
  min-width: 0;
  min-height: 36px;
  padding: 6px 10px;
  padding-right: 30px;
  border: 1px solid color-mix(in srgb, var(--border-color) 38%, transparent);
  border-radius: 10px;
  background-color: color-mix(in srgb, var(--btn-bg) 55%, transparent);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='%23888'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 9px center;
  background-size: 12px;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-color);
  cursor: pointer;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background-color 0.18s ease;
}

.share-lib-tag-select:hover {
  border-color: color-mix(in srgb, var(--border-color) 62%, transparent);
}

.share-lib-tag-select:focus {
  border-color: color-mix(in srgb, var(--primary-color) 42%, var(--border-color));
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--primary-color) 22%, transparent);
}

html.dark .share-lib-tag-select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='%23aaa'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
}

.share-lib-pager.control-page-cluster {
  flex-shrink: 0;
}

.control-page-cluster {
  display: inline-flex;
  align-items: center;
  gap: 2px;
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
  background: color-mix(in srgb, var(--btn-bg) 55%, transparent);
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

.share-list-stage {
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  padding: 1rem 0 max(2rem, env(safe-area-inset-bottom, 0px));
  max-width: none;
}

.share-empty {
  padding: clamp(28px, 6vh, 56px) 0;
  text-align: center;
  color: var(--secondary-color);
  display: grid;
  gap: 12px;
  justify-items: center;
}

.share-empty__btn {
  border: 1px solid color-mix(in srgb, var(--border-color) 72%, transparent);
  background: var(--btn-bg);
  color: var(--primary-color);
  border-radius: 10px;
  padding: 8px 14px;
  cursor: pointer;
  font-weight: 650;
}

.share-card-grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.share-card {
  position: relative;
  box-sizing: border-box;
  padding: 0.6rem 0 0.85rem;
  cursor: pointer;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--border-color) 44%, transparent);
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 4px;
  outline: none;
  transition: background-color 0.18s ease;
}

.share-card:focus-visible {
  background-color: color-mix(in srgb, var(--btn-bg) 45%, transparent);
  border-radius: 6px;
  outline: 2px solid color-mix(in srgb, var(--primary-color) 35%, transparent);
  outline-offset: 2px;
}

.share-card:hover {
  background-color: color-mix(in srgb, var(--modal-bg) 35%, transparent);
}

.share-card-grid > li:last-child .share-card {
  border-bottom: none;
  padding-bottom: 0.2rem;
}

.share-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px 14px;
}

.share-card__title {
  margin: 0;
  flex: 1 1 auto;
  min-width: 0;
  font-size: 1.06rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.32;
  color: var(--text-color);
}

.share-card__time {
  flex-shrink: 0;
  padding-top: 0.12rem;
  font-size: 0.76rem;
  font-variant-numeric: tabular-nums;
  color: var(--secondary-color);
}

.share-card__footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px 14px;
  margin-top: 2px;
}

.share-card__tags {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0 4px;
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
}

.share-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  margin-left: auto;
  font-size: 0.76rem;
  font-weight: 650;
  color: var(--primary-color);
  white-space: nowrap;
}

.share-card__cta-text {
  line-height: 1.2;
}

.share-card__cta .share-card__arrow-svg {
  display: block;
  flex-shrink: 0;
}

.share-card__desc {
  margin: 0;
  flex: 1 1 auto;
  color: color-mix(in srgb, var(--secondary-color) 94%, var(--text-color));
  line-height: 1.5;
  font-size: 0.875rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.share-card__tag {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  color: color-mix(in srgb, var(--secondary-color) 88%, var(--primary-color));
  flex-shrink: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.share-card__tag-sep {
  color: color-mix(in srgb, var(--secondary-color) 55%, transparent);
  font-weight: 700;
  padding: 0 1px;
  flex-shrink: 0;
}

.share-card__tag-more {
  flex-shrink: 0;
  margin-left: 4px;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  font-weight: 700;
  color: var(--secondary-color);
}

@media (max-width: 420px) {
  .share-lib-tag-field__label {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .share-lib-tag-field {
    position: relative;
  }
}

@media (prefers-reduced-motion: reduce) {
  .share-card {
    transition: none;
  }
}

@media (max-width: 900px) {
  .share-lib-toolbar__filters {
    flex-basis: 100%;
    justify-content: stretch;
  }

  .share-lib-toolbar__search {
    max-width: none;
    flex: 1 1 100%;
  }

  .share-lib-tag-field {
    max-width: none;
    flex: 1 1 auto;
  }

  .share-lib-pager.control-page-cluster {
    margin-left: auto;
  }
}

@media (max-width: 520px) {
  .share-lib-toolbar__identity {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .share-main-title {
    white-space: normal;
  }

  .share-lib-toolbar__filters {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .share-lib-pager.control-page-cluster {
    justify-content: flex-end;
    width: 100%;
  }
}
</style>
