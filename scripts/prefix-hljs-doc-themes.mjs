/**
 * Scope highlight.js GitHub / GitHub-dark themes to .markdown-body only.
 * Run: node scripts/prefix-hljs-doc-themes.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

function extractRules(css) {
  const parts = []
  let i = 0
  while (i < css.length) {
    while (i < css.length && /\s/.test(css[i])) i++
    if (i >= css.length) break

    if (css[i] === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2)
      const comment = end === -1 ? css.slice(i) : css.slice(i, end + 2)
      parts.push({ kind: 'comment', text: comment })
      i = end === -1 ? css.length : end + 2
      continue
    }

    const brace = css.indexOf('{', i)
    if (brace === -1) break

    const selectors = css.slice(i, brace).trim()
    if (!selectors || selectors.startsWith('@')) {
      const nextBlock = skipAtRule(css, brace)
      parts.push({ kind: 'raw', text: css.slice(i, nextBlock) })
      i = nextBlock
      continue
    }

    let depth = 1
    let j = brace + 1
    while (j < css.length && depth > 0) {
      if (css[j] === '{') depth++
      else if (css[j] === '}') depth--
      j++
    }
    const body = css.slice(brace, j)
    parts.push({ kind: 'rule', selectors, body })
    i = j
  }
  return parts
}

function skipAtRule(css, fromBrace) {
  let depth = 1
  let j = fromBrace + 1
  while (j < css.length && depth > 0) {
    if (css[j] === '{') depth++
    else if (css[j] === '}') depth--
    j++
  }
  return j
}

function scopeSelectors(selectors, prefix) {
  return selectors
    .split(',')
    .map((s) => `${prefix} ${s.trim()}`)
    .join(',\n')
}

function scopeCss(css, prefix) {
  const parts = extractRules(css)
  let out = ''
  for (const p of parts) {
    if (p.kind === 'comment' || p.kind === 'raw') {
      out += p.text
      continue
    }
    if (p.kind === 'rule') {
      out += `${scopeSelectors(p.selectors, prefix)} ${p.body}\n`
    }
  }
  return out
}

const pairs = [
  {
    inFile: 'node_modules/highlight.js/styles/github.css',
    outFile: 'src/assets/doc-hljs-github-light-scoped.css',
    prefix: 'html:not(.dark) .markdown-body',
  },
  {
    inFile: 'node_modules/highlight.js/styles/github-dark.css',
    outFile: 'src/assets/doc-hljs-github-dark-scoped.css',
    prefix: 'html.dark .markdown-body',
  },
]

for (const p of pairs) {
  const raw = fs.readFileSync(path.join(root, p.inFile), 'utf8')
  const out = scopeCss(raw, p.prefix)
  fs.writeFileSync(
    path.join(root, p.outFile),
    `/* Scoped hljs — regenerate: node scripts/prefix-hljs-doc-themes.mjs */\n${out}\n`,
  )
  console.log('Wrote', p.outFile)
}
