// 在已渲染的 HTML 里，把"薄弱点关键词"包成 <span class="weak-term"> 做红色波浪线标注。
// 安全策略：
//  1) 按标签切分，只处理标签之间的纯文本，绝不改动 <...> 内部（属性/标签名不受影响）。
//  2) 纯 ASCII 词（如 Tag/CPI/GBN/PSW/TLB/MAC）加字母数字边界，避免命中更长单词内部。
//  3) 长词优先，避免"页表"抢在"页表项"之前把子串拆开。
//  4) 单次 g 扫描替换，插入的 span 不会被本轮再次匹配，杜绝嵌套。
import type { WeakTerm } from '@/data/weakTerms'

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function highlightWeakTerms(html: string, terms: WeakTerm[]): string {
  if (!html || !terms || terms.length === 0) return html

  const uniq = Array.from(new Set(terms.filter(t => t && t.term)))
  if (uniq.length === 0) return html

  // 长词优先
  uniq.sort((a, b) => b.term.length - a.term.length)

  // term -> note 映射（用于 title 悬停提示）
  const noteMap = new Map<string, string>()
  for (const t of uniq) noteMap.set(t.term, t.note || '你的薄弱点')

  const parts = uniq.map(t => {
    const e = escapeRegExp(t.term)
    const isAscii = /^[\x00-\x7F]+$/.test(t.term)
    return isAscii ? `(?<![A-Za-z0-9])${e}(?![A-Za-z0-9])` : e
  })
  const re = new RegExp(parts.join('|'), 'g')

  // 切分标签与文本
  const tokens = html.split(/(<[^>]*>)/)
  for (let i = 0; i < tokens.length; i++) {
    const seg = tokens[i]
    if (!seg || seg.charAt(0) === '<') continue // 跳过标签
    tokens[i] = seg.replace(re, (match) => {
      const note = noteMap.get(match) || '你的薄弱点'
      const safe = note.replace(/"/g, '&quot;')
      return `<span class="weak-term" title="${safe}">${match}</span>`
    })
  }
  return tokens.join('')
}
