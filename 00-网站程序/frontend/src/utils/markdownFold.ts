/**
 * 把 markdown-it 渲染出的长文 HTML 折叠成「记忆卡」手风琴。
 * 408 各科目学习页（数据结构/计组/操作系统/网络）的知识点面板原本把整节内容
 * 一屏到底堆成大段文字，不便记忆。这里按小节内的分块标题（通常是 ### 一、二、三…）
 * 把每一块包成可折叠的 <details>：第一块默认展开，其余收起，点标题才展开——
 * 一次只看一块，方便逐块背诵。
 *
 * 规则：
 *  - 只在「分块级别」及其之上的标题处切分；更深层标题（如 #### ）留在卡片体内。
 *  - 分块级别默认取 h3；若 h3 不足 2 个则回退到 h2 / h4 中出现≥2次的级别。
 *  - 比折叠级别更浅的标题（如节标题 h2）原样输出，不参与折叠。
 */
export function foldMarkdownHtml(html: string, preferLevel = 3): string {
  if (!html) return html

  const headingRe = /<h([2-4])([^>]*)>([\s\S]*?)<\/h\1>/g
  interface Head { level: number; attrs: string; inner: string; start: number; end: number }
  const heads: Head[] = []
  let m: RegExpExecArray | null
  while ((m = headingRe.exec(html)) !== null) {
    heads.push({ level: Number(m[1]), attrs: m[2], inner: m[3], start: m.index, end: m.index + m[0].length })
  }
  if (heads.length < 2) return html

  const countAt = (lv: number) => heads.filter(h => h.level === lv).length
  let fl = preferLevel
  if (countAt(fl) < 2) {
    const cand = [3, 2, 4].find(lv => countAt(lv) >= 2)
    if (!cand) return html // 没有可折叠的重复分块，原样返回
    fl = cand
  }

  // 切分点：仅 level <= fl 的标题（更深层留在卡片体内）
  const bounds = heads.filter(h => h.level <= fl)
  let out = html.slice(0, bounds[0].start)
  let opened = false

  for (let i = 0; i < bounds.length; i++) {
    const h = bounds[i]
    const bodyEnd = i + 1 < bounds.length ? bounds[i + 1].start : html.length
    const body = html.slice(h.end, bodyEnd)
    if (h.level < fl) {
      // 节标题等更浅层级：原样保留
      out += `<h${h.level}${h.attrs}>${h.inner}</h${h.level}>` + body
    } else {
      const open = !opened ? ' open' : ''
      opened = true
      out +=
        `<details class="md-fold"${open}>` +
        `<summary class="md-fold-sum"><span class="md-fold-chev">▸</span><span class="md-fold-tt">${h.inner}</span></summary>` +
        `<div class="md-fold-body">${body}</div>` +
        `</details>`
    }
  }
  return out
}
