// 重选 105 篇精读核心词汇：词典全变形匹配原文 + 分层挑选 + 抽取真实例句
// 用法：node select-core-vocabulary.js   （词典见 core-vocab-dict.js，改完直接重跑即可）
// 选词规则：每篇上限 10 词 = T1 最多 4 + T2 最多 4 + T3 补位；T1 取跨篇高频（复习价值大），T2/T3 取跨篇低频（本篇特有、更影响理解）
// word_type 与 ReadingPractice.vue 的词汇覆盖率分级一致：1=核心2000 2=进阶3000-4000 3=高级4000+
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const DIR = 'data/english/intensive-reading.json'
const TARGETS = [
  path.join(ROOT, 'frontend/public', DIR),
  path.join(ROOT, 'frontend/dist', DIR),
  path.join(ROOT, 'frontend-share/public', DIR),
  path.join(ROOT, 'frontend-share/dist', DIR)
]
const QSRC = path.join(ROOT, 'frontend/public/data/english/reading-questions.json')

// ---------- 1. 解析词典 ----------
const dictRaw = require('./core-vocab-dict.js')
const DICT = new Map()
let dup = 0
for (const line of dictRaw.split('\n')) {
  const t = line.trim()
  if (!t || t.startsWith('//')) continue
  const [w, tier, meaning] = t.split('|')
  if (!w || !tier || !meaning) { console.log('跳过坏行:', JSON.stringify(t)); continue }
  if (DICT.has(w)) { dup++; continue }
  DICT.set(w, { word: w, tier: Number(tier), meaning: meaning.trim() })
}
console.log('词典条目:', DICT.size, '| 重复丢弃:', dup)

// 太简单/高中以下的词，绝不入选（即使有熟词僻义，上卡片也像“水词”）
const DROP = new Set('face sign mark close quit sum hobby lazy honest cure fit chief leading deliver announce announcement comment expense settle diet cop adult core focus blame just fine attractive give-in report pressure track monitor detect vary stable'.split(/\s+/))
// 短而常见的考研词：降为 T3，仅在候选不够时补位
const DEMOTE = new Set('fund root stem bear yield charge poll peer gene bias norm vice zeal measure stress tension survey sample statistic statistics estimate predict prediction project source origin original claim reveal expose transfer transport declare distribute distribution variety diverse numerous multiple separate observe patient long-term short-term smell'.split(/\s+/))
for (const w of DROP) DICT.delete(w)
// 第二轮：高考3500 级别的词，上“核心词汇”卡片会显得水
const DROP2 = new Set('birth central degree editor educate educated emotion emotional employee experience imagine independence management obtain output popularity professional retire senior struggle suffer train training virus admit agreement ancient application appointment comparison debate launch glance gratitude patience prayer priest divorce donate donation ceremony elderly fitness informal leisure remark surgery timetable viewpoint volunteer warehouse tolerate tolerance broadcast catalogue countryside detective homeless infant migration neutrality nutrient objection observer orchestra organism residence retailer satellite sentiment settlement underground capacity emergency statement strategy'.split(/\s+/))
// 第二轮降级：看着简单但有熟词僻义/考研高频，只当补位用
const DEMOTE2 = new Set('access address adopt assess assessment authority availability bond candidate campaign congress credit eliminate enhance expand federal funding immigrant immigration indicate inflation influential innovation investigate investment landscape mechanism primary principle privacy profit promote reform resident revenue shift signal sustainable transform unemployment widespread cooperation maintain perceive possess occupation isolate intimate interrupt gradual impressive instinct instrument intellect legacy minimal mislead modify monetary nationwide preserve precise grant automatic compound diligent'.split(/\s+/))
for (const w of DROP2) DICT.delete(w)
// 第三轮：T1 里漏网的简单词
for (const w of 'employer partnership recommend relax talent wealthy'.split(/\s+/)) DICT.delete(w)
const DEMOTE3 = new Set('assistance budget capital citizen cooperate debt democracy deny determine discipline disease election facility highlight industrial infection ingredient integrate journalism nuclear observation opposition passenger penalty pollution procedure proportion protest punishment reasonable recovery revolution stock treasure universal workforce concentrate confirm exception acceptance alternative appeal corporation guideline genuine investigate equivalent frustration'.split(/\s+/))
let demoted = 0
for (const w of [...DEMOTE, ...DEMOTE2, ...DEMOTE3]) { const e = DICT.get(w); if (e && e.tier < 3) { e.tier = 3; demoted++ } }
console.log('DROP 共删:', DROP.size + DROP2.size + 6, '| DEMOTE 共降级:', demoted)

// ---------- 2. 生成每个词典词的全部屈折形式 ----------
const V = 'aeiou'
const isV = (c) => V.includes(c)
function forms(w) {
  const s = new Set([w])
  const add = (x) => { if (x && x.length > 2) s.add(x) }
  const last = w.slice(-1), last2 = w.slice(-2)
  // 复数 / 第三人称单数
  add(w + 's')
  if (/(s|x|z|ch|sh|o)$/.test(w)) add(w + 'es')
  // 过去式 / 过去分词 / 比较级
  if (last === 'e') { add(w + 'd'); add(w + 'r'); add(w + 'st'); add(w.slice(0, -1) + 'ing'); add(w + 'ly'); add(w.slice(0, -1) + 'y') }
  else { add(w + 'ed'); add(w + 'ing'); add(w + 'er'); add(w + 'est'); add(w + 'ly') }
  // 辅音+y
  if (last === 'y' && !isV(w.slice(-2, -1))) {
    add(w.slice(0, -1) + 'ies'); add(w.slice(0, -1) + 'ied')
    add(w.slice(0, -1) + 'ier'); add(w.slice(0, -1) + 'iest')
    add(w.slice(0, -1) + 'ying')
  }
  // 重读闭音节双写
  if (w.length > 3 && !isV(last) && last !== 'w' && last !== 'x' && last !== 'y' && isV(w.slice(-2, -1)) && !isV(w.slice(-3, -2))) {
    const d = w + last
    add(d + 'ing'); add(d + 'ed'); add(d + 'er'); add(d + 'est')
  }
  return s
}
// 反向索引：surface form -> 词典词
const SURF = new Map()
for (const [w, ent] of DICT) {
  for (const f of forms(w)) {
    if (!SURF.has(f)) SURF.set(f, w)
    else if (SURF.get(f) !== w) SURF.set(f + '\u0001' + w, w) // 冲突时保留两条映射
  }
}
const lookup = (tok) => {
  const hit = []
  const direct = SURF.get(tok)
  if (direct) hit.push(direct)
  const alt = SURF.get(tok + '\u0001' + tok)
  return hit
}
// 一个 surface 可能对应多个词典词，全部收集
const SURF_MULTI = new Map()
for (const [w] of DICT) {
  for (const f of forms(w)) {
    if (!SURF_MULTI.has(f)) SURF_MULTI.set(f, [])
    SURF_MULTI.get(f).push(w)
  }
}
console.log('surface 形式总数:', SURF_MULTI.size)

// ---------- 3. 读取语料 ----------
const ir = JSON.parse(fs.readFileSync(TARGETS[0], 'utf8'))
const qs = JSON.parse(fs.readFileSync(QSRC, 'utf8')).questions
const textOf = (k) => {
  if (k.startsWith('cloze-')) {
    const it = qs.find(x => x.year === Number(k.slice(6)) && x.section === 'Use of English')
    return it ? (it.article || it.passage || '') : ''
  }
  const [y, t] = k.split('-').map(Number)
  const it = qs.find(x => x.year === y && x.section === 'Traditional Reading' && x.textNumber === t)
  return it ? (it.article || it.passage || '') : ''
}
const clean = (html, isCloze) => {
  let q = 0
  let t = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#\d+;/g, ' ').replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')      // 去标签留下的“词 , ”空格
    .replace(/\s+\u2019/g, '\u2019')       // 标签残留的“nation ’s” → “nation’s”
    .replace(/\s+'(?=[a-zA-Z])/g, "'")     // “Wordsworth 's” → “Wordsworth's”
    .replace(/\(\s+/g, '(').replace(/\s+\)/g, ')')
    // 引号一律按出现次序重新配对（奇=开、偶=闭）：直引号本来就没方向，
    // 弯引号也有标反的（如 “senior moments. “ 收尾误用开引号）。
    // 收尾引号方向错会连锁出事：下面的 [\u201c]\s+ 规则会把题号前的空格删掉（“ 3 → “3），
    // 导致该题号前置边界失配、expect 卡死，从它起到 20 全部漏网
    .replace(/["\u201c\u201d]/g, () => (++q % 2 ? '\u201c' : '\u201d'))
    .replace(/([\u201c\u2018])\s+/g, '$1').replace(/\s+([\u201d\u2019])/g, '$1')
    // 闭引号后紧跟字母补空格：“caravanserai ”is → ” is。
    // 只管双引号，\u2019 同时当撇号用（nation\u2019s），动了会把单词拆成两半
    .replace(/\u201d(?=[a-zA-Z])/g, '\u201d ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/(\d),\s+(\d)/g, '$1,$2')   // 千位分隔符后的空格：600, 000 → 600,000
    .trim()
  // 完型原文的填空是裸题号（1..20 按顺序出现），留在例句里就是“not 4 thought”这种噪声。
  // 只替换恰好等于期望题号的数字，避开 12-15 、14 months 这类真实数值（它们不会恰好卡在期望值上）；
  // 边界必须容许紧跟标点（or 2.）和被引号包裹（the “20” tester），否则 expect 会卡住导致后面题号全部漏网
  if (isCloze) {
    let expect = 1
    t = t.replace(/(^|[\s(])\u201c?(\d{1,2})\u201d?(?=[\s.,;:!?)\u201d]|$)/g, (m, pre, num) => {
      if (Number(num) === expect && expect <= 20) { expect++; return pre + '____' }
      return m
    })
  }
  return t
}

// 句子切分（_ 是完型题号占位符，句首也要能切开）
const sentences = (txt) => {
  const parts = txt.split(/(?<=[.!?])\s+(?=[A-Z0-9_"'(\u201c])/)
  return parts.map(s => s.trim()).filter(s => s.split(/\s+/).length >= 4)
}

// ---------- 4. 逐篇选词 ----------
const CAP = 10
const PER_TIER = { 1: 4, 2: 4, 3: 4 }
const report = []
const docFreq = new Map()

// 先统计每个词典词出现在多少篇（用于挑选偏好：跨篇高频=T1优先取，低频=T2/T3优先取）
const firstPass = new Map()
const clozeBlanks = []
for (const k of Object.keys(ir)) {
  const isCloze = k.startsWith('cloze-')
  const txt = clean(textOf(k), isCloze)
  // 完型应恰好替换出 20 个题号占位；少了说明 expect 链断在某处，例句里会残留裸数字
  if (isCloze) {
    const n = (txt.match(/____/g) || []).length
    if (n !== 20) clozeBlanks.push(k + '=' + n)
  }
  const toks = (txt.toLowerCase().match(/[a-z][a-z'-]*[a-z]|[a-z]/g) || [])
  const found = new Map() // dictWord -> 首次出现位置
  toks.forEach((tok, i) => {
    const list = SURF_MULTI.get(tok)
    if (!list) return
    for (const w of list) if (!found.has(w)) found.set(w, i)
  })
  firstPass.set(k, { txt, found })
  for (const w of found.keys()) docFreq.set(w, (docFreq.get(w) || 0) + 1)
}

const sents = new Map()
for (const [k, v] of firstPass) sents.set(k, sentences(v.txt))

function pickExample(txt, ss, dictWord) {
  const fs_ = forms(dictWord)
  const re = new RegExp('\\b(' + [...fs_].sort((a, b) => b.length - a.length).map(x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b', 'i')
  for (const s of ss) {
    const m = s.match(re)
    if (!m) continue
    let out = s.replace(/\s+/g, ' ').trim()
    if (out.length > 170) {
      // 长句围绕目标词开窗并对齐词边界，保证单词一定在例句里看得见
      const i = out.toLowerCase().indexOf(m[0].toLowerCase())
      let from = Math.max(0, i - 70), to = Math.min(out.length, i + m[0].length + 100)
      let head = '', tail = ''
      if (from > 0) { const sp = out.indexOf(' ', from); if (sp > 0) from = sp + 1; head = '\u2026 ' }
      if (to < out.length) { const sp = out.lastIndexOf(' ', to); if (sp > from) to = sp; tail = ' \u2026' }
      out = head + out.slice(from, to).trim() + tail
    }
    return out
  }
  return ''
}

const low = []
for (const k of Object.keys(ir)) {
  const { txt, found } = firstPass.get(k)
  const cands = [...found.entries()].map(([w, pos]) => ({ ent: DICT.get(w), pos, df: docFreq.get(w) || 1 }))
  const byTier = { 1: [], 2: [], 3: [] }
  for (const c of cands) (byTier[c.ent.tier] || byTier[3]).push(c)
  // T1 取跨篇最高频（复习价值大）；T2/T3 取跨篇较低频（本篇特有、更影响理解）
  byTier[1].sort((a, b) => b.df - a.df || a.pos - b.pos)
  byTier[2].sort((a, b) => a.df - b.df || a.pos - b.pos)
  byTier[3].sort((a, b) => a.df - b.df || a.pos - b.pos)
  const chosen = [...byTier[1].slice(0, PER_TIER[1]), ...byTier[2].slice(0, PER_TIER[2])]
  // T3 只用来补位，避免短而常见的词挤掉真正的难词
  for (const c of byTier[3]) { if (chosen.length >= CAP) break; chosen.push(c) }
  chosen.sort((a, b) => a.pos - b.pos)
  const final = chosen.slice(0, CAP)
  const ss = sents.get(k)
  ir[k].vocabulary = final.map(c => ({
    word: c.ent.word,
    type: 'advanced',
    word_type: String(c.ent.tier),
    meaning: c.ent.meaning,
    example: pickExample(txt, ss, c.ent.word)
  }))
  report.push({ k, n: final.length, t1: byTier[1].length, t2: byTier[2].length, t3: byTier[3].length })
  if (final.length < 6) low.push(k + ':' + final.length)
}

// ---------- 5. 校验与落盘 ----------
const bad = report.filter(r => r.n === 0).map(r => r.k)
if (bad.length) { console.log('!! 0 词条目:', bad.join(', ')); process.exit(1) }
const noEx = report.reduce((a, r) => a + (ir[r.k].vocabulary.filter(v => !v.example).length), 0)
const trivial = []
for (const k of Object.keys(ir)) for (const v of ir[k].vocabulary) if (v.word.length < 5 && !v.word.includes('-')) trivial.push(k + ':' + v.word)

console.log('--- 覆盖统计 ---')
console.log('条目数:', report.length, '| 平均词数:', (report.reduce((a, r) => a + r.n, 0) / report.length).toFixed(1))
console.log('少于6词的篇目:', low.length ? low.join(', ') : '无')
console.log('缺例句的词数:', noEx)
console.log('完型题号占位异常(应=20):', clozeBlanks.length ? clozeBlanks.join(', ') : '无')
console.log('短于5字母的词:', trivial.length ? trivial.join(', ') : '无')

// 硬校验：每条例句必须真的含有该词的某个变形，否则卡片会“词对不上句”
const missWord = []
for (const k of Object.keys(ir)) {
  for (const v of ir[k].vocabulary) {
    const low = v.example.toLowerCase()
    const hit = [...forms(v.word)].some(f => new RegExp('\\b' + f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(low))
    if (!hit) missWord.push(k + ':' + v.word)
  }
}
console.log('例句不含目标词:', missWord.length ? missWord.join(', ') : '无')
if (missWord.length) process.exit(1)

const outStr = JSON.stringify(ir, null, 2).replace(/\n/g, '\r\n')
for (const p of TARGETS) {
  if (!fs.existsSync(p)) { console.log('!! 目标不存在:', p); process.exit(1) }
  fs.writeFileSync(p, outStr, 'utf8')
}
console.log('已写入 4 份:', outStr.length, '字符')

// 全部入选词清单（去重，按层）——供人工复核有没有漏网的简单词
const all = new Map()
for (const k of Object.keys(ir)) for (const v of ir[k].vocabulary) if (!all.has(v.word)) all.set(v.word, Number(v.word_type))
const byT = { 1: [], 2: [], 3: [] }
for (const [w, t] of all) byT[t].push(w)
for (const t of [1, 2, 3]) byT[t].sort()
console.log('\n--- 入选词去重统计 ---')
console.log('T1', byT[1].length, '| T2', byT[2].length, '| T3', byT[3].length, '| 总', all.size)
fs.writeFileSync(path.join(__dirname, 'vocab-selected.txt'),
  '[T1] ' + byT[1].join(', ') + '\n\n[T2] ' + byT[2].join(', ') + '\n\n[T3] ' + byT[3].join(', ') + '\n', 'utf8')

// 抽样展示（写 UTF-8 文件，避开 PowerShell 控制台编码坑）
const sample = []
for (const k of ['2008-4', '2008-3', '2008-2', '2008-1', '2006-4', '2005-1', 'cloze-2008', 'cloze-2023']) {
  sample.push('=== ' + k + ' ===')
  for (const v of ir[k].vocabulary) sample.push(`  [T${v.word_type}] ${v.word} — ${v.meaning}\n        e.g. ${v.example}`)
}
fs.writeFileSync(path.join(__dirname, 'vocab-sample.txt'), sample.join('\n'), 'utf8')
console.log('抽样已写 vocab-sample.txt，全部入选词已写 vocab-selected.txt')
