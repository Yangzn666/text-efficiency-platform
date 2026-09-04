import katex from 'katex'
import 'katex/dist/katex.min.css'

/**
 * 数学公式渲染工具（错题本 / 公式展示通用）
 * 支持 $$...$$ 块级公式与 $...$ 行内公式，其余文本做 HTML 转义保护，
 * 换行符转为 <br>，输出可直接用于 v-html。
 * 实现模式复用 MathTopicGuideView.vue 中已验证的 texify 方案。
 */

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * 将含 LaTeX 标记的纯文本渲染为 HTML 字符串
 * - $$...$$ → 块级公式
 * - $...$   → 行内公式
 * - 其余文本转义后换行转 <br>
 * - 公式渲染失败时回退为转义原文，不抛错
 */
export function renderMath(text: string): string {
  if (!text) return ''
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g)
  return parts
    .map(part => {
      if (part.startsWith('$$') && part.endsWith('$$') && part.length > 4) {
        try {
          return katex.renderToString(part.slice(2, -2), { displayMode: true, throwOnError: false, strict: false })
        } catch {
          return escapeHtml(part)
        }
      }
      if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        try {
          return katex.renderToString(part.slice(1, -1), { displayMode: false, throwOnError: false, strict: false })
        } catch {
          return escapeHtml(part)
        }
      }
      return escapeHtml(part).replace(/\n/g, '<br>')
    })
    .join('')
}
