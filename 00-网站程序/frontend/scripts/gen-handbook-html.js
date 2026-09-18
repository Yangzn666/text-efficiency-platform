/**
 * 背诵手册 HTML 生成器
 * 用法: node gen-handbook-html.js <源.md> <目标.html>
 *
 * 源 md 为受控子集（专为本手册体例设计）：
 *   @title / @sub / @rule / @footer   封面与页脚
 *   @meta 标签|内容                    封面信息条（可多行）
 *   ## 章号|标题|标签                   新起一张章节卡片（自动轮换配色 s0~s7）
 *   ### 小节标题
 *   | a | b |                          表格（首行 th，其余 td；含 ☐ 自动加 class=check）
 *   - 列表项 / 1. 有序项
 *   > hook: 内容                        记忆钩卡片
 *   > warn: 内容                        陷阱卡片
 *   > chain: 内容                       概念链卡片
 *   > formula: 内容                     公式卡片
 *   > note: 内容                        绿色注记
 *   其它非空行                          普通段落
 *   行内 **粗体** → <b>（红字黄底高亮），`代码` → 蓝字
 */
const fs = require('fs')
const path = require('path')

const TEMPLATE = 'd:/学习/效率/04-408专业课/03-个人笔记/计组背诵手册-打印版.html'

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
function inline(s) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/`([^`]+)`/g, '<span class="blue">$1</span>')
}

// 从模板抽取 <style> 与手机版 <script>，保证两份新手册样式与计组版完全一致
const tpl = fs.readFileSync(TEMPLATE, 'utf8')
const css = tpl.match(/<style>([\s\S]*?)<\/style>/)[1]
const mobileJs = tpl.match(/<script>([\s\S]*?)<\/script>/)[1]

const src = process.argv[2]
const dest = process.argv[3]
if (!src || !dest) {
  console.error('用法: node gen-handbook-html.js <源.md> <目标.html>')
  process.exit(1)
}
const lines = fs.readFileSync(src, 'utf8').split(/\r?\n/)

let title = '', sub = '', rule = '', footer = ''
const metas = []
const body = []
let secIdx = -1
let inUl = false, inOl = false, inTable = false, tableBuf = []

function closeLists() {
  if (inUl) { body.push('  </ul>'); inUl = false }
  if (inOl) { body.push('  </ol>'); inOl = false }
}
function flushTable() {
  if (!inTable) return
  inTable = false
  const rows = tableBuf.filter(r => r.trim() !== '')
  tableBuf = []
  if (!rows.length) return
  const parsed = rows.map(r =>
    r.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim())
  )
  // 跳过分隔行（全是 - : 组成）
  const dataRows = parsed.filter(cells => !cells.every(c => /^:?-{2,}:?$/.test(c) || c === ''))
  const hasBox = dataRows.some(cells => cells.some(c => /[☐☑]/.test(c)))
  body.push(hasBox ? '  <table class="check">' : '  <table>')
  dataRows.forEach((cells, i) => {
    const tag = i === 0 ? 'th' : 'td'
    const tds = cells.map(c => {
      const boxAttr = /[☐☑]/.test(c) ? ' class="box"' : ''
      const leftAttr = i > 0 && cells.length >= 4 && c.length > 6 && !/[☐☑]/.test(c) ? ' style="text-align:left"' : ''
      return `<${tag}${boxAttr}${leftAttr}>${inline(c)}</${tag}>`
    }).join('')
    body.push('    <tr>' + tds + '</tr>')
  })
  body.push('  </table>')
}

for (const raw of lines) {
  const line = raw.replace(/\s+$/, '')
  const t = line.trim()

  if (t.startsWith('|')) {
    closeLists()
    inTable = true
    tableBuf.push(t)
    continue
  } else if (inTable) {
    flushTable()
  }

  if (t === '') { closeLists(); continue }

  if (t.startsWith('@title ')) { title = t.slice(7).trim(); continue }
  if (t.startsWith('@sub ')) { sub = t.slice(5).trim(); continue }
  if (t.startsWith('@rule ')) { rule = t.slice(6).trim(); continue }
  if (t.startsWith('@footer ')) { footer = t.slice(8).trim(); continue }
  if (t.startsWith('@meta ')) {
    const m = t.slice(6).trim()
    const i = m.indexOf('|')
    metas.push(i > -1 ? [m.slice(0, i).trim(), m.slice(i + 1).trim()] : ['', m])
    continue
  }

  if (t.startsWith('## ')) {
    closeLists()
    if (secIdx >= 0) body.push('</section>')
    secIdx++
    const cls = 's' + (secIdx % 8)
    const parts = t.slice(3).split('|').map(x => x.trim())
    const num = parts[0] || ''
    const h2 = parts[1] || ''
    const tag = parts[2] || ''
    body.push('')
    body.push(`<section class="card ${cls}">`)
    body.push(`  <div class="ch-head"><div class="ch-num">${esc(num)}</div><h2>${esc(h2)}</h2>` +
      (tag ? `<div class="tag">${esc(tag)}</div>` : '') + `</div>`)
    continue
  }

  if (t.startsWith('### ')) { closeLists(); body.push(`  <h3>${inline(t.slice(4).trim())}</h3>`); continue }

  if (t.startsWith('> ')) {
    closeLists()
    const c = t.slice(2).trim()
    const kinds = { 'hook:': 'hook', 'warn:': 'warn', 'chain:': 'chain', 'formula:': 'formula', 'note:': 'note' }
    let cls = 'hook', txt = c
    for (const k of Object.keys(kinds)) {
      if (c.toLowerCase().startsWith(k)) { cls = kinds[k]; txt = c.slice(k.length).trim(); break }
    }
    if (cls === 'note') {
      body.push(`  <p class="note">${inline(txt)}</p>`)
    } else {
      body.push(`  <div class="${cls}">${inline(txt)}</div>`)
    }
    continue
  }

  if (/^[-*]\s+/.test(t)) {
    if (inOl) { body.push('  </ol>'); inOl = false }
    if (!inUl) { body.push('  <ul>'); inUl = true }
    body.push(`    <li>${inline(t.replace(/^[-*]\s+/, ''))}</li>`)
    continue
  }
  if (/^\d+[.)]\s+/.test(t)) {
    if (inUl) { body.push('  </ul>'); inUl = false }
    if (!inOl) { body.push('  <ol>'); inOl = true }
    body.push(`    <li>${inline(t.replace(/^\d+[.)]\s+/, ''))}</li>`)
    continue
  }
  if (/^(-{3,}|#{1}\s)/.test(t)) continue

  closeLists()
  body.push(`  <p>${inline(t)}</p>`)
}
flushTable()
closeLists()
if (secIdx >= 0) body.push('</section>')

const metaHtml = metas
  .map((m, i) => `    <b>${esc(m[0])}</b>：${inline(m[1])}${i < metas.length - 1 ? '<br>' : ''}`)
  .join('\n')

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<style>${css}
  /* 绿色注记（生成器扩展） */
  p.note{margin-top:12px;font-size:15px;background:#ecfdf5;border-left:4px solid #059669;padding:8px 12px;border-radius:4px;}
</style>
</head>
<body>
<div class="page-wrap">

<section class="card cover">
  <h1>${esc(title)}</h1>
  <div class="sub">${esc(sub)}</div>
  <div class="meta">
${metaHtml}
  </div>
  <div class="rule">${inline(rule)}</div>
</section>
${body.join('\n')}

<footer>${inline(footer)}</footer>

</div>
<script>${mobileJs}</script>
</body>
</html>
`

fs.mkdirSync(path.dirname(dest), { recursive: true })
fs.writeFileSync(dest, html, 'utf8')
console.log('OK ->', dest, '|', html.split('\n').length, 'lines |', (html.length / 1024).toFixed(1), 'KB')
