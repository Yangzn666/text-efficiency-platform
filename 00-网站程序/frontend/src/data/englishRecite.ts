// 英语背诵台 · 数据层（P2-8）
//
// 病根：作文模板 143 条、长难句 5 条队列都只存在电脑上的 state.json 里，
// 站内只能「看」，不能「背」——看十遍不如合上书默一遍。
//
// 这里把两份已经进站的静态数据变成可背诵的卡：
//   ① writing-templates.json：小作文 7 类句库（开头/正文/结尾）+ 大作文三段句库 + 范文 + 名言
//   ② translation-exams.json：2001 年至今每套翻译 5 句（英文原句 + 参考译文 + 主干 + 成分拆解）
//
// 背诵方式用「首字母骨架卡」：短词（≤3 字母）保留，长词只留首字母 + 下划线。
// 手机上看骨架出声背 → 翻面对照原文 → 自判（忘了/模糊/背出），Leitner 排期。
// 长难句给中文译文当线索，等于做「回译」——比只看英文更能暴露结构漏洞。
import { ref } from 'vue'

export type ReciteTrack = 'writing' | 'sentence'
export type ReciteGrade = 'again' | 'hard' | 'good'

export interface ReciteCard {
  id: string
  track: ReciteTrack
  group: string          // 建议信 / 第一段 · 描图句库 / 2014 Text 5
  label: string          // 开头句 1 / 第 3 句 / 主干拆解
  en: string
  zh?: string
  note?: string
  extra?: string         // 长难句成分拆解（多行）
  year?: number
}

const BASE_URL = import.meta.env.BASE_URL || '/'
const INTERVALS = [0, 1, 2, 4, 7]   // box 0 新卡；1→1 天，2→2 天，3→4 天，4→7 天
export const MAX_BOX = 4
export const RECITE_KEY = 'english-recite-v1'

// ---------- 首字母骨架 ----------
const SHORT_WORD = 3
export function skeleton(en: string): string {
  if (!en) return ''
  return en.split(/\s+/).map(tok => {
    // 拆出前导标点 / 词 / 尾随标点
    const m = tok.match(/^([^A-Za-z]*)([A-Za-z][A-Za-z'’-]*)(.*)$/)
    if (!m) return tok
    const [, pre, word, post] = m
    const isShort = word.replace(/['’-]/g, '').length <= SHORT_WORD
    if (isShort) return tok
    const core = word.replace(/['’-]/g, '')
    const hidden = '_'.repeat(Math.min(core.length - 1, 9))
    return `${pre}${word[0]}${hidden}${post}`
  }).join(' ')
}

export function wordCount(en: string): number {
  return (en.match(/[A-Za-z][A-Za-z'’-]*/g) || []).length
}

// ---------- 卡片构建 ----------
let cardsCache: ReciteCard[] | null = null
export const reciteCards = ref<ReciteCard[]>([])
export const reciteLoading = ref(false)
export const reciteError = ref('')

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const r = await fetch(`${BASE_URL}data/${path}`, { cache: 'force-cache' })
    if (!r.ok) return null
    return await r.json() as T
  } catch { return null }
}

function buildWritingCards(tpl: any): ReciteCard[] {
  const out: ReciteCard[] = []
  const letters = Array.isArray(tpl?.smallLetters) ? tpl.smallLetters : []
  letters.forEach((t: any) => {
    const parts: Array<[string, string[]]> = [
      ['开头句', t.openers || []],
      ['正文句', t.body || []],
      ['结尾句', t.closers || []]
    ]
    parts.forEach(([label, list]) => {
      list.forEach((en: string, i: number) => {
        out.push({
          id: `letter-${t.id}-${label}-${i}`,
          track: 'writing',
          group: `${t.icon || ''} ${t.name}`.trim(),
          label: `${label} ${i + 1}`,
          en,
          note: [t.scene, ...(t.tips || [])].filter(Boolean).join(' · ')
        })
      })
    })
  })
  const bigs = Array.isArray(tpl?.bigParagraphs) ? tpl.bigParagraphs : []
  bigs.forEach((g: any, gi: number) => {
    (g.sentences || []).forEach((en: string, i: number) => {
      out.push({
        id: `big-${gi}-${i}`,
        track: 'writing',
        group: g.name,
        label: `第 ${i + 1} 句`,
        en,
        note: g.role
      })
    })
  })
  ;(tpl?.modelEssay?.paragraphs || []).forEach((p: any, pi: number) => {
    out.push({
      id: `model-${pi}`,
      track: 'writing',
      group: `范文 · ${tpl.modelEssay.theme || '图画作文'}`,
      label: `${p.label}（整段）`,
      en: p.text,
      note: p.note
    })
  })
  ;(tpl?.quotes || []).forEach((q: any, i: number) => {
    out.push({
      id: `quote-${i}`,
      track: 'writing',
      group: '名言引用库',
      label: q.topic || `第 ${i + 1} 条`,
      en: q.text
    })
  })
  return out
}

function buildSentenceCards(data: any): ReciteCard[] {
  const out: ReciteCard[] = []
  const years = Array.isArray(data?.years) ? data.years : []
  years.forEach((y: any) => {
    ;(y.sentences || []).forEach((s: any) => {
      const trunk = s.trunk || {}
      const extra = [
        trunk['主干翻译'] ? `主干：${trunk['主语'] || ''} + ${trunk['谓语'] || ''} + ${trunk['宾语或表语'] || ''} → ${trunk['主干翻译']}` : '',
        ...(s.components || []).map((c: any) => `· ${c['成分类型']}｜${c['原文']} → ${c['中文翻译']}（${c['说明']}）`)
      ].filter(Boolean).join('\n')
      out.push({
        id: s.id,
        track: 'sentence',
        group: `${y.year} 翻译 · 第 ${s.no} 句`,
        label: '中文回译',
        en: s.en,
        zh: s.zh,
        extra,
        year: y.year
      })
    })
  })
  return out
}

export async function loadReciteCards(): Promise<ReciteCard[]> {
  if (cardsCache) return cardsCache
  if (reciteLoading.value) {
    // 等待进行中的加载
    for (let i = 0; i < 100 && reciteLoading.value; i++) await new Promise(r => setTimeout(r, 50))
    return cardsCache || []
  }
  reciteLoading.value = true
  reciteError.value = ''
  try {
    const [tpl, trans] = await Promise.all([
      fetchJson<any>('english/writing-templates.json'),
      fetchJson<any>('english/translation-exams.json')
    ])
    if (!tpl && !trans) { reciteError.value = '两份背诵数据都没读到'; return [] }
    cardsCache = [...buildWritingCards(tpl || {}), ...buildSentenceCards(trans || {})]
    reciteCards.value = cardsCache
    loadProgress()
    return cardsCache
  } finally {
    reciteLoading.value = false
  }
}

// ---------- 进度（Leitner 轻量版，自判） ----------
export interface ReciteRec { box: number; due: string; last: string; seen: number; again: number }
const progress = ref<Record<string, ReciteRec>>({})
let progressLoaded = false

export const todayStr = () => new Date().toISOString().slice(0, 10)
export function addDays(date: string, n: number): string {
  const d = new Date(date + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export function loadProgress() {
  if (progressLoaded) return
  progressLoaded = true
  try {
    const raw = localStorage.getItem(RECITE_KEY)
    progress.value = raw ? JSON.parse(raw) : {}
  } catch { progress.value = {} }
}
function saveProgress() {
  try { localStorage.setItem(RECITE_KEY, JSON.stringify(progress.value)) } catch { /* 配额满时静默 */ }
}

export function recordOf(id: string): ReciteRec | undefined {
  loadProgress()
  return progress.value[id]
}
export function isDue(id: string): boolean {
  const r = recordOf(id)
  if (!r) return true
  return r.due <= todayStr()
}
export function isNew(id: string): boolean {
  return !recordOf(id)
}
export function gradeCard(id: string, g: ReciteGrade) {
  loadProgress()
  const t = todayStr()
  const cur = progress.value[id] || { box: 0, due: t, last: '', seen: 0, again: 0 }
  let box = cur.box
  if (g === 'again') { box = 0; cur.again += 1 }
  else if (g === 'hard') { box = Math.max(box, 1); }
  else { box = Math.min(MAX_BOX, box + 1) }
  const step = g === 'again' ? 0 : INTERVALS[Math.min(INTERVALS.length - 1, Math.max(1, box))]
  progress.value = {
    ...progress.value,
    [id]: { box, due: addDays(t, step), last: t, seen: cur.seen + 1, again: cur.again }
  }
  saveProgress()
  // 同步进全站复习流水，趋势图/今日负荷都能看到这笔
  logRecite()
}
function logRecite() {
  try {
    const key = 'review-log-v1'
    const log = JSON.parse(localStorage.getItem(key) || '{}')
    const t = todayStr()
    log[t] = log[t] || {}
    log[t].recite = (log[t].recite || 0) + 1
    localStorage.setItem(key, JSON.stringify(log))
  } catch { /* 流水失败不影响背诵 */ }
}

export function reciteStats(cards: ReciteCard[]) {
  loadProgress()
  let due = 0, neu = 0, mastered = 0
  cards.forEach(c => {
    const r = progress.value[c.id]
    if (!r) neu++
    else if (r.box >= MAX_BOX) mastered++
    else if (r.due <= todayStr()) due++
  })
  return { due, neu, mastered, total: cards.length }
}

export function resetRecite() {
  progress.value = {}
  progressLoaded = true
  saveProgress()
}

// ---------- 组卷：到期优先，其次新卡，按组交错避免同类疲劳 ----------
export function buildReciteQueue(cards: ReciteCard[], size = 15): string[] {
  loadProgress()
  const due: string[] = []
  const neu: string[] = []
  cards.forEach(c => {
    const r = progress.value[c.id]
    if (!r) neu.push(c.id)
    else if (r.due <= todayStr()) due.push(c.id)
  })
  // 逾期越久越靠前
  due.sort((a, b) => String(progress.value[a].due).localeCompare(String(progress.value[b].due)))
  const pick: string[] = []
  const pool = [...due, ...neu]
  const byGroup = new Map<string, string[]>()
  pool.forEach(id => {
    const c = cards.find(x => x.id === id)
    if (!c) return
    if (!byGroup.has(c.group)) byGroup.set(c.group, [])
    byGroup.get(c.group)!.push(id)
  })
  const groups = [...byGroup.keys()]
  let round = 0
  while (pick.length < size && round < 30) {
    let added = false
    for (const g of groups) {
      const list = byGroup.get(g)!
      if (list[round]) { pick.push(list[round]); added = true }
      if (pick.length >= size) break
    }
    if (!added) break
    round++
  }
  return pick
}
