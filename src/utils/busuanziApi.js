/**
 * 不蒜子 CDN 3.6.x：官方 busuanzi.min.js 为一次性 IIFE（window.busuanziRequestSent），
 * SPA 路由切换后不会再次请求。脚本内实际为向 api.php POST { url, referrer }，再按返回 key 写入 #key。
 * 本模块复现该请求，供各路由反复调用。
 *
 * 注意：服务端按「每次 POST」计 PV/UV。Footer、详情页、多个 watch 若在几毫秒内连打，
 * 会导致阅读量与全站统计被重复累加。故对「同一波」调用做 trailing debounce，合并为一次请求；
 * 请求在途时再次调用则共用同一 Promise，不发起新请求。
 */
const BUSUANZI_API_URL = 'https://cdn.busuanzi.cc/api.php'

/** 同一导航周期内 Footer / 详情 / nextTick 等多处触发的合并窗口 */
const DEBOUNCE_MS = 420

let debounceTimer = null
/** @type {Promise<void> | null} */
let inFlight = null
/** @type {Promise<void> | null} */
let burstPromise = null
/** @type {(() => void) | null} */
let burstResolve = null

let abortController = null

function ensureBurstPromise() {
  if (!burstPromise) {
    burstPromise = new Promise((resolve) => {
      burstResolve = resolve
    })
  }
  return burstPromise
}

function settleBurst() {
  if (burstResolve) {
    burstResolve()
  }
  burstPromise = null
  burstResolve = null
}

function runFetch(url) {
  if (abortController) {
    abortController.abort()
  }
  abortController = new AbortController()
  const signal = abortController.signal

  const payload = { url, referrer: document.referrer || '' }

  return fetch(BUSUANZI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  })
    .then(async (res) => {
      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        throw new Error(`busuanzi 响应解析失败 HTTP ${res.status}`)
      }
      if (!res.ok) {
        throw new Error(`busuanzi HTTP ${res.status}`)
      }
      return data
    })
    .then((r) => {
      if (signal.aborted || location.href !== url) return
      if (!r || typeof r !== 'object') return

      for (const k of Object.keys(r)) {
        if (!/^busuanzi_[a-z0-9_]+$/i.test(k)) continue
        const el = document.getElementById(k)
        if (el) el.innerText = r[k]
      }
    })
    .catch((err) => {
      if (err?.name === 'AbortError') return
    })
}

/**
 * 与官方脚本一致：拉取统计并写入页面内对应 id 的节点（innerText）。
 * @returns {Promise<void>}
 */
export function requestBusuanziApply() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.resolve()
  }

  if (inFlight) {
    return inFlight
  }

  const p = ensureBurstPromise()

  clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => {
    debounceTimer = null
    const url = location.href
    inFlight = runFetch(url).finally(() => {
      inFlight = null
      settleBurst()
    })
  }, DEBOUNCE_MS)

  return p
}
