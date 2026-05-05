/**
 * 不蒜子 CDN 3.6.x：官方 busuanzi.min.js 为一次性 IIFE（window.busuanziRequestSent），
 * SPA 路由切换后不会再次请求。脚本内实际为向 api.php POST { url, referrer }，再按返回 key 写入 #key。
 * 本模块复现该请求，供各路由反复调用。
 */
const BUSUANZI_API_URL = 'https://cdn.busuanzi.cc/api.php'

/**
 * 与官方脚本一致：拉取统计并写入页面内对应 id 的节点（innerText）。
 * @returns {Promise<void>}
 */
export function requestBusuanziApply() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.resolve()
  }

  const payload = { url: location.href, referrer: document.referrer || '' }

  return fetch(BUSUANZI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
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
      if (!r || typeof r !== 'object') return

      for (const k of Object.keys(r)) {
        if (!/^busuanzi_[a-z0-9_]+$/i.test(k)) continue
        const el = document.getElementById(k)
        if (el) el.innerText = r[k]
      }
    })
    .catch(() => {})
}
