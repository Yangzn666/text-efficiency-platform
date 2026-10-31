#!/usr/bin/env node
// 公式默写卡生成器
// -----------------------------------------------------------------------------
// 输入：../../01-数学一/03-个人笔记/每日公式背诵清单.md（人工维护的唯一真相源）
// 输出：public/data/formulas/recite-cards.json（构建产物，随仓库提交，CI 不跑本脚本）
//
// 为什么不在页面里直接读 md：
//   1) md 有 2165 行、大量表格与说明，手机端解析成本高；
//   2) 默写题需要稳定的「空位」与「答案」，在构建期切好才能保证同一条卡片每次挖同一个洞；
//   3) 产物可按星级筛「★★★ 必背」。
//
// 解析规则（尽量保守，宁可少切不可切错）：
//   ## 一级章 → chapter；### 小节 → 一条卡（title / ★ 数 / ⚠ / ○）
//   公式来源：$$…$$ 块；以 - 开头且含 =、\、≤、≥ 的要点；行内 $…$ 中含 = 或 \ 的
//   记忆钩：包含「记忆钩」的那一行（去掉 markdown 符号）
//   没有公式的小节也保留为「口述判据」卡，默写时自判，不丢弃。
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SRC = path.resolve(ROOT, '../../01-数学一/03-个人笔记/每日公式背诵清单.md')
const OUT_DIR = path.resolve(ROOT, 'public/data/formulas')
const OUT = path.resolve(OUT_DIR, 'recite-cards.json')

if (!fs.existsSync(SRC)) {
  console.error(`找不到公式清单：${SRC}`)
  process.exit(1)
}
const md = fs.readFileSync(SRC, 'utf8')

const cleanInline = (s) =>
  String(s || '')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()

const noMath = (s) =>
  cleanInline(s)
    .replace(/\$\$([\s\S]+?)\$\$/g, ' ')
    .replace(/\$([^$]+?)\$/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

// “像公式”的判断：含等号/反斜杠/不等号/上下标，且不是纯中文句子
function looksFormula(s) {
  const t = cleanInline(s)
  if (!t || t.length > 320) return false
  if (/[\u4e00-\u9fa5]{8,}/.test(t.replace(/[，。；：、]/g, ''))) return false
  return /[=]|\\[a-zA-Z]+|[≤≥<>]|\^|_\{/.test(t)
}

const seen = new Set()
function pushFormula(list, raw) {
  const t = String(raw || '').trim()
  if (!t) return
  if (t.length < 6) return
  // 跨行公式被切出来的「= f'(x_0)」这种续行没有默写价值，丢掉
  if (/^[=≤≥<>]/.test(t)) return
  if (!looksFormula(t) && !/\\[a-zA-Z]+/.test(t)) return
  const key = t.replace(/\s+/g, '')
  if (seen.has(key)) return
  seen.add(key)
  list.push(t)
}

// ---- 逐行扫描 ----
const lines = md.split(/\r?\n/)
let chapter = ''
let section = null
const sections = []

function flush() {
  if (section) sections.push(section)
  section = null
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i]
  if (/^##\s+/.test(line)) {
    flush()
    chapter = cleanInline(line.replace(/^##\s+/, ''))
    continue
  }
  if (/^#\s+/.test(line)) { continue }
  if (/^###\s+/.test(line)) {
    flush()
    const rawTitle = cleanInline(line.replace(/^###\s+/, ''))
    const stars = (rawTitle.match(/★/g) || []).length
    const warn = /⚠/.test(rawTitle)
    const circle = /○/.test(rawTitle)
    const title = rawTitle
      .replace(/^[\d.]+\s*/, '')
      .replace(/[★⚠○]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    section = {
      chapter, rawTitle, title, stars, warn, circle,
      lines: [], formulas: [], inline: [], hook: '', body: ''
    }
    continue
  }
  if (!section) continue
  section.lines.push(line)
  // 记忆钩
  if (!section.hook && /记忆钩|口诀/.test(line)) {
    section.hook = cleanInline(line.replace(/^>?\s*/, ''))
  }
  // 块级公式（可能跨行）
  const trimmed = line.trim()
  if (trimmed.startsWith('$$')) {
    let block = trimmed
    if ((block.match(/\$\$/g) || []).length === 1) {
      let j = i + 1
      while (j < lines.length && !/\$\$/.test(lines[j])) { block += ' ' + lines[j].trim(); j++ }
      if (j < lines.length) block += ' ' + lines[j].trim()
      i = j
    }
    const inner = block.replace(/^\$\$/, '').replace(/\$\$$/, '').replace(/\$\$/g, '').trim()
    pushFormula(section.formulas, inner)
    continue
  }
  // 要点公式
  if (/^\s*[-*]\s+/.test(line)) {
    const body = line.replace(/^\s*[-*]\s+/, '')
    if (looksFormula(body)) pushFormula(section.formulas, body)
  }
  // 行内公式：先存到 inline，只有当本节没有块级/要点公式时才拿来兜底。
  // 否则一段解释里塞 10 个行内公式，会切出一堆「x=0」这种没有默写价值的碎片。
  const inlines = line.match(/(?<!\$)\$([^$\n]+?)\$(?!\$)/g) || []
  inlines.forEach(m => {
    const inner = m.slice(1, -1).trim()
    if (!/=/.test(inner) && !/\\[a-zA-Z]+/.test(inner)) return
    if (inner.length < 4 || inner.length > 180) return
    if (!section.inline.includes(inner)) section.inline.push(inner)
  })
}
flush()

// ---- 组卡 ----
// 本节无块级/要点公式时，用行内公式兜底（最多 4 条，避免碎片刷屏）
for (const s of sections) {
  if (!s.formulas.length && s.inline.length) {
    s.inline.slice(0, 4).forEach(x => pushFormula(s.formulas, x))
  }
}

const items = []
let seq = 0
for (const s of sections) {
  // 附录/打卡这类没有 ★ 且没有公式的直接跳过
  if (!s.stars && !s.formulas.length && !s.warn) continue
  const bodyRaw = s.lines.join('\n')
  const body = noMath(bodyRaw)
    .replace(/^>\s*📎.*$/gm, '')
    .replace(/记忆钩[：:].*$/m, '')
    .trim()
    .slice(0, 520)
  const base = {
    chapter: s.chapter,
    section: s.title || s.rawTitle,
    stars: s.stars,
    warn: s.warn,
    circle: s.circle,
    hook: s.hook,
    body
  }
  if (s.formulas.length) {
    s.formulas.slice(0, 8).forEach((latex, k) => {
      seq += 1
      items.push({
        id: `fm-${String(seq).padStart(4, '0')}`,
        ...base,
        latex,
        kind: 'formula',
        order: k
      })
    })
  } else {
    seq += 1
    items.push({
      id: `fm-${String(seq).padStart(4, '0')}`,
      ...base,
      latex: '',
      kind: 'oral',
      order: 0
    })
  }
}

fs.mkdirSync(OUT_DIR, { recursive: true })
const payload = {
  meta: {
    source: '01-数学一/03-个人笔记/每日公式背诵清单.md',
    generatedAt: new Date().toLocaleString('sv-SE'),
    total: items.length,
    formulas: items.filter(x => x.kind === 'formula').length,
    mustMemorize: items.filter(x => x.stars >= 3).length
  },
  items
}
fs.writeFileSync(OUT, JSON.stringify(payload, null, 1), 'utf8')
console.log(`✅ ${items.length} 张卡（公式 ${payload.meta.formulas} · ★★★ ${payload.meta.mustMemorize}）→ ${OUT}`)
