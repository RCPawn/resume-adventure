/**
 * 解析 Markdown 文件顶部的 YAML frontmatter（轻量实现，满足本站字段约定）。
 * 支持：title, slug, description, date, tags, category, published, order。
 * tags 可为 JSON 数组单行：`tags: ["a","b"]`
 */
export function parseFrontmatter(raw) {
  const text = typeof raw === 'string' ? raw : String(raw ?? '')
  if (!text.startsWith('---')) {
    return { data: {}, body: text }
  }
  const firstNl = text.indexOf('\n')
  if (firstNl === -1) return { data: {}, body: text }

  let rest = text.slice(firstNl + 1)
  const endSeq = '\n---'
  const endIdx = rest.indexOf(endSeq)
  if (endIdx === -1) return { data: {}, body: text }

  const yamlBlock = rest.slice(0, endIdx)
  const body = rest.slice(endIdx + endSeq.length).replace(/^\s*\n/, '')
  const data = parseSimpleYaml(yamlBlock)
  return { data, body }
}

function parseSimpleYaml(yamlBlock) {
  const data = {}
  const lines = yamlBlock.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const colon = trimmed.indexOf(':')
    if (colon === -1) continue
    const key = trimmed.slice(0, colon).trim()
    let val = trimmed.slice(colon + 1).trim()
    if (!key) continue

    if (val === 'true') {
      data[key] = true
    } else if (val === 'false') {
      data[key] = false
    } else if (/^-?\d+$/.test(val)) {
      data[key] = parseInt(val, 10)
    } else if (val.startsWith('[') && val.endsWith(']')) {
      try {
        data[key] = JSON.parse(val.replace(/'/g, '"'))
      } catch {
        data[key] = val
      }
    } else if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      data[key] = val.slice(1, -1)
    } else {
      data[key] = val
    }
  }
  return data
}
