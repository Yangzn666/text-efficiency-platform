import MarkdownIt from 'markdown-it'
import katex from 'katex'
import 'katex/dist/katex.min.css'

/**
 * 408 真题大题富文本渲染
 * 数据里的 stem/explanation 是 Markdown，混合了：
 *  - LaTeX 公式 $...$ / $$...$$（占多数）
 *  - GFM 管道表格
 *  - ```c 代码块 + 各类图示 DSL 代码块（network-topology / bits-layout / graph ...）
 *  - 本地配图 ![](...data/408-exam/images/xxx)
 * 渲染顺序很关键：先把代码块、行内代码、数学公式各保护成占位符，
 * 再交给 markdown-it（避免反斜杠被 markdown 吞掉），最后回填 KaTeX / <pre> / 图片路径。
 */

const BASE = import.meta.env.BASE_URL || '/'

const md = new MarkdownIt({ html: true, breaks: true, linkify: false })

// 已知的“图示 DSL”语言 → 友好标题；其余按普通代码块
const DIAGRAM_LANGS: Record<string, string> = {
  'network-topology': '网络拓扑图',
  'bits-layout': '数据/指令位布局',
  'graph': '图（顶点/边）',
  'cache-coach': 'Cache 结构示意',
  'pipeline-timing': '流水线时空图',
  'pipeline-coach': '流水线示意',
  'singly-linked-list': '单链表示意',
  'binary-tree': '二叉树示意',
  'file-system-tree': '文件目录树',
  'message-sequence': '消息交互序列',
  'disk-track': '磁盘/柱面示意',
  'process-gantt': '进程调度甘特图',
  'text': '示意文本'
}

function escapeHtml(t: string): string {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function renderLatex(tex: string, display: boolean): string {
  try {
    return katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: false })
  } catch {
    return escapeHtml(display ? '$$' + tex + '$$' : '$' + tex + '$')
  }
}

/** 把 src 为站内相对 data/... 的图片，补上部署 BASE 前缀 */
function localizeImages(html: string): string {
  return html.replace(/src="(data\/408-exam\/[^"]+)"/g, (_m, p) => `src="${BASE}${p}"`)
}

/** 自定义围栏：C 代码块 / 图示 DSL 块 / 普通块，各配不同样式与说明 */
md.renderer.rules.fence = (tokens, idx) => {
  const token = tokens[idx]
  const info = (token.info || '').trim()
  const lang = info.split(/\s+/)[0]
  const code = escapeHtml(token.content)
  if (DIAGRAM_LANGS[lang]) {
    return (
      `<div class="ex-diagram"><div class="ex-diagram-hd">📐 ${escapeHtml(DIAGRAM_LANGS[lang])}` +
      `<span class="ex-diagram-tag">${escapeHtml(lang)}</span></div>` +
      `<pre class="ex-diagram-body"><code>${code}</code></pre></div>`
    )
  }
  if (lang === 'c' || lang === 'cpp' || lang === 'java' || lang === 'python') {
    return `<div class="ex-code"><div class="ex-code-hd">${escapeHtml(lang)}</div><pre><code>${code}</code></pre></div>`
  }
  return `<div class="ex-code"><pre><code>${code}</code></pre></div>`
}

/** 表格包一层可横向滚动容器（手机端友好） */
md.renderer.rules.table_open = () => '<div class="ex-table-wrap"><table>'
md.renderer.rules.table_close = () => '</table></div>'

export function renderExamMarkdown(raw: string): string {
  if (!raw) return ''
  let text = raw

  const store: string[] = []
  const keep = (html: string): string => {
    const id = '%%EXPH' + store.length + '%%'
    store.push(html)
    return id
  }

  // 1) 保护 ```围栏```
  text = text.replace(/```[\s\S]*?```/g, (block) => {
    const m = block.match(/^```([^\n]*)\n?([\s\S]*?)\n?```\s*$/)
    const info = m ? m[1].trim() : ''
    const content = m ? m[2] : block
    return keep(
      md.renderer.rules.fence!(
        [{ info, content, type: 'fence', markup: '```', tag: '', attrs: [], map: null, nesting: 0, level: 0 } as any],
        0,
        md.options,
        {} as any,
        {} as any
      )
    )
  })

  // 2) 保护行内代码 `...`
  text = text.replace(/`[^`\n]+`/g, (ic) => keep(ic))

  // 3) 保护数学 $$...$$ 先，再 $...$
  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_m, tex) => keep(renderLatex(tex, true)))
  text = text.replace(/\$([^$\n]+?)\$/g, (_m, tex) => keep(renderLatex(tex, false)))

  // 4) 交给 markdown-it 渲染正文（表格/加粗/图片/链接等）
  let html = md.render(text)

  // 5) 回填占位符（占位符在 md 里可能被包进 <p>，回填后即为成品 HTML）
  html = html.replace(/%%EXPH(\d+)%%/g, (_m, n) => store[Number(n)] ?? '')

  // 6) 图片补 BASE 前缀
  html = localizeImages(html)

  return html
}
