/**
 * 栈迹文库 · 文档数据源（对照：学习足迹详情由 `src/data/projects.json` 的 `mdFile` 指向 `projects/*.md`）。
 *
 * 此处用 Vite `import.meta.glob('../../docs/technical/*.md', { query: '?raw', eager: true })`
 * 在构建期把 `docs/technical/*.md` 原文打进 bundle，再 `parseFrontmatter` 得到列表与正文。
 * 设计类文档放在 `docs/design/`，不参与本 glob。
 *
 * frontmatter：`published: false`、或文件名 `README.md`（大小写不敏感）→ 不参与列表。
 */
import { parseFrontmatter } from '@/utils/frontmatter'

const rawGlob = import.meta.glob('../../docs/technical/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function inferCategoryFromPath(globPath) {
  const normalized = globPath.replace(/\\/g, '/')
  const marker = 'docs/technical/'
  const idx = normalized.indexOf(marker)
  if (idx === -1) return 'general'
  const tail = normalized.slice(idx + marker.length)
  const parts = tail.split('/').filter(Boolean)
  // 扁平目录：仅文件名时可再用文件名前缀推断（可选）；默认 general，优先用 frontmatter category
  if (parts.length !== 1) return parts[0] || 'general'
  return 'general'
}

function basenameSlug(globPath) {
  const normalized = globPath.replace(/\\/g, '/')
  const seg = normalized.split('/').pop() || ''
  return seg.replace(/\.md$/i, '')
}

function buildEntries() {
  const list = []
  for (const [pathKey, rawText] of Object.entries(rawGlob)) {
    const normalizedKey = pathKey.replace(/\\/g, '/')
    const baseName = basenameSlug(normalizedKey)
    if (/^readme$/i.test(baseName)) continue

    const { data, body } = parseFrontmatter(rawText)
    if (data.published === false) continue

    const slug = (data.slug || baseName).trim()
    const title = (data.title || baseName).trim()
    const description = (data.description || '').trim()
    const date = (data.date || '').trim()
    const tags = normalizeTags(data.tags)
    const order = typeof data.order === 'number' ? data.order : 0
    const category = (data.category || inferCategoryFromPath(normalizedKey) || 'general').trim()

    const assetDir = normalizedKey
      .replace(/^.*?docs\/technical\//i, 'docs/technical/')
      .replace(/[^/]+\.md$/i, '')

    list.push({
      slug,
      title,
      description,
      date,
      tags,
      order,
      category,
      pathKey: normalizedKey,
      raw: rawText,
      body,
      assetDir,
    })
  }

  list.sort((a, b) => {
    const da = parseDateKey(a.date)
    const db = parseDateKey(b.date)
    if (db !== da) return db - da
    if (b.order !== a.order) return b.order - a.order
    return a.slug.localeCompare(b.slug, 'zh-CN')
  })

  return list
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) return tags.map((t) => String(t).trim()).filter(Boolean)
  if (typeof tags === 'string') {
    return tags
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter(Boolean)
  }
  return []
}

function parseDateKey(isoOrStr) {
  if (!isoOrStr) return 0
  const t = Date.parse(isoOrStr)
  return Number.isFinite(t) ? t : 0
}

const entries = buildEntries()
const bySlug = new Map(entries.map((e) => [e.slug, e]))

export function listShareArticles() {
  return entries.slice()
}

export function getShareArticleBySlug(slug) {
  if (!slug) return null
  return bySlug.get(String(slug)) || null
}

export function allShareTags() {
  const set = new Set()
  for (const e of entries) {
    for (const t of e.tags) set.add(t)
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'zh-CN'))
}
