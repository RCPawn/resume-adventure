/**
 * 从首页点进 `/project/:id` 时写入项目 id，返回首页后滚动到学习足迹中对应卡片
 *（不依赖 window.scrollY：下部区块异步挂载后旧滚动值往往不准）
 */
const KEY = 'ra_resume_home_project_card_v1'
const MAX_AGE_MS = 30 * 60 * 1000

export function stashHomeScrollForProjectReturn(projectId) {
  if (projectId == null || String(projectId).trim() === '') return
  try {
    sessionStorage.setItem(
      KEY,
      JSON.stringify({
        projectId: String(projectId).trim(),
        ts: Date.now(),
      }),
    )
  } catch {
    /* ignore quota / private mode */
  }
}

/** 读取但不删除，供首页轮询直到 DOM 就绪 */
export function peekHomeProjectReturn() {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    const o = JSON.parse(raw)
    if (!o || typeof o.projectId !== 'string' || o.projectId.trim() === '') return null
    if (Date.now() - (typeof o.ts === 'number' ? o.ts : 0) > MAX_AGE_MS) {
      sessionStorage.removeItem(KEY)
      return null
    }
    return { projectId: o.projectId.trim() }
  } catch {
    return null
  }
}

export function clearHomeProjectReturn() {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
