/**
 * 博客访问量统计工具
 * 使用 LocalStorage 实现本地统计
 */

const STORAGE_KEYS = {
  SITE_PV: 'site_pv',        // 站点总访问量
  SITE_UV: 'site_uv',        // 站点访客数
  UV_SESSION: 'uv_session',  // UV 会话标识
  PAGE_VIEWS: 'page_views'   // 页面浏览量 {path: count}
}

// 生成唯一访客ID
const generateVisitorId = () => {
  return 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// 获取 LocalStorage 数据
const getStorage = (key, defaultValue = 0) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : defaultValue
  } catch (e) {
    console.warn('LocalStorage 读取失败:', e)
    return defaultValue
  }
}

// 设置 LocalStorage 数据
const setStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('LocalStorage 写入失败:', e)
  }
}

/**
 * 记录站点访问 (PV + UV)
 * @returns {Object} { pv, uv }
 */
export const recordSiteVisit = () => {
  // PV: 每次访问都 +1
  let pv = getStorage(STORAGE_KEYS.SITE_PV, 0)
  pv++
  setStorage(STORAGE_KEYS.SITE_PV, pv)

  // UV: 同一会话只计一次 (24小时内)
  const sessionId = getStorage(STORAGE_KEYS.UV_SESSION, '')
  const now = Date.now()
  
  // 如果没有会话ID 或 会话超过24小时,则计为新访客
  if (!sessionId || (now - parseInt(sessionId.split('_')[1]) > 24 * 60 * 60 * 1000)) {
    let uv = getStorage(STORAGE_KEYS.SITE_UV, 0)
    uv++
    setStorage(STORAGE_KEYS.SITE_UV, uv)
    setStorage(STORAGE_KEYS.UV_SESSION, `visitor_${now}`)
  }

  return {
    pv: getStorage(STORAGE_KEYS.SITE_PV),
    uv: getStorage(STORAGE_KEYS.SITE_UV)
  }
}

/**
 * 获取站点统计数据
 * @returns {Object} { pv, uv }
 */
export const getSiteStats = () => {
  return {
    pv: getStorage(STORAGE_KEYS.SITE_PV, 0),
    uv: getStorage(STORAGE_KEYS.SITE_UV, 0)
  }
}

/**
 * 记录页面访问
 * @param {String} pagePath - 页面路径 (如: /project/gateway)
 * @returns {Number} 当前页面浏览量
 */
export const recordPageView = (pagePath) => {
  const views = getStorage(STORAGE_KEYS.PAGE_VIEWS, {})
  
  if (!views[pagePath]) {
    views[pagePath] = 0
  }
  views[pagePath]++
  
  setStorage(STORAGE_KEYS.PAGE_VIEWS, views)
  return views[pagePath]
}

/**
 * 获取页面浏览量
 * @param {String} pagePath - 页面路径
 * @returns {Number} 浏览量
 */
export const getPageViews = (pagePath) => {
  const views = getStorage(STORAGE_KEYS.PAGE_VIEWS, {})
  return views[pagePath] || 0
}
