import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/common'

const slugify = (str) => {
  if (!str) return ''
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/[\s+~/]+/g, '-')
    .replace(/[^\w\-一-龥\u4E00-\u9FFF]+/g, '')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * @param {string} str
 * @param {string | undefined} lang
 * @param {import('markdown-it').MarkdownIt} md
 */
function highlightFence(str, lang, md) {
  const l = (lang || '').trim().toLowerCase()
  if (l === 'mermaid') return null

  try {
    /**
     * Vue SFC：整文件用 `xml` 高亮，使 `<!-- ... -->` 落在 `.hljs-comment`（与 `//` 注释样式一致）。
     * 若用 `javascript`，模板区会被转义且注释内文字易被误标为 `hljs-title` 等。
     * `<script>` 内 hljs 仍会嵌套 `language-javascript` 子高亮（见 xml 语法定义）。
     */
    if (l === 'vue') {
      return hljs.highlight(str, { language: 'xml', ignoreIllegals: true }).value
    }
    if (l && hljs.getLanguage(l)) {
      return hljs.highlight(str, { language: l, ignoreIllegals: true }).value
    }
    return hljs.highlightAuto(str).value
  } catch {
    return md.utils.escapeHtml(str)
  }
}

/**
 * 与栈迹文库详情页共用：标题锚点、相对图片、`highlight.js` 语法高亮（与 GitHub 主题 CSS 配套）。
 * @param {{ assetBase?: string }} options
 */
export function createDocMarkdownIt(options = {}) {
  const assetBase = (options.assetBase || '').replace(/\/?$/, '/')

  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: (str, lang) => highlightFence(str, lang, md),
  })

  const defaultHeadingOpen =
    md.renderer.rules.heading_open ||
    function (tokens, idx, opts, env, self) {
      return self.renderToken(tokens, idx, opts)
    }
  const defaultImageRender =
    md.renderer.rules.image ||
    function (tokens, idx, opts, env, self) {
      return self.renderToken(tokens, idx, opts)
    }

  md.renderer.rules.heading_open = function (tokens, idx, opts, env, self) {
    const next = tokens[idx + 1]
    let title = ''
    if (next && next.type === 'inline') title = next.content
    const id = slugify(title || `heading-${idx}`)
    const existing = tokens[idx].attrIndex && tokens[idx].attrIndex('id')
    if (existing === -1) tokens[idx].attrPush(['id', id])
    else tokens[idx].attrs[existing][1] = id
    return defaultHeadingOpen(tokens, idx, opts, env, self)
  }

  md.renderer.rules.image = function (tokens, idx, opts, env, self) {
    const token = tokens[idx]
    const srcIndex = token.attrIndex('src')
    if (srcIndex >= 0) {
      let src = token.attrs[srcIndex][1] || ''
      if (!src.startsWith('http') && !src.startsWith('/') && !src.startsWith('data:')) {
        const baseUrl = import.meta.env.BASE_URL.replace(/\/?$/, '/')
        const prefix = String(assetBase || '')
          .replace(/^\/?/, '')
          .replace(/\/?$/, '/')
        token.attrs[srcIndex][1] = baseUrl + prefix + src.replace(/^\.\//, '')
      }
    }
    token.attrPush(['loading', 'lazy'])
    token.attrJoin('class', 'md-img')
    return defaultImageRender(tokens, idx, opts, env, self)
  }

  /** 与 GitHub / doc-hljs-* 一致：围栏 `<code>` 带 `hljs`，便于 scoped 主题与 display/padding 命中 */
  md.renderer.rules.fence = function (tokens, idx, options, env, slf) {
    const token = tokens[idx]
    const info = token.info ? md.utils.unescapeAll(token.info).trim() : ''
    let langName = ''
    let langAttrs = ''
    if (info) {
      const arr = info.split(/(\s+)/g)
      langName = arr[0]
      langAttrs = arr.slice(2).join('')
    }
    let highlighted
    if (options.highlight) {
      highlighted = options.highlight(token.content, langName, langAttrs) || md.utils.escapeHtml(token.content)
    } else {
      highlighted = md.utils.escapeHtml(token.content)
    }
    if (highlighted.indexOf('<pre') === 0) {
      return highlighted + '\n'
    }
    const langPrefix = options.langPrefix || 'language-'
    if (info) {
      const i = token.attrIndex('class')
      const tmpAttrs = token.attrs ? token.attrs.slice() : []
      const langClass = langName ? langPrefix + langName : ''
      const classNames = ['hljs', langClass].filter(Boolean).join(' ')
      if (i < 0) {
        tmpAttrs.push(['class', classNames])
      } else {
        tmpAttrs[i] = tmpAttrs[i].slice()
        tmpAttrs[i][1] += ` ${classNames}`
      }
      const tmpToken = { attrs: tmpAttrs }
      return `<pre><code${slf.renderAttrs(tmpToken)}>${highlighted}</code></pre>\n`
    }
    return `<pre><code class="hljs"${slf.renderAttrs(token)}>${highlighted}</code></pre>\n`
  }

  return { md, slugify }
}
