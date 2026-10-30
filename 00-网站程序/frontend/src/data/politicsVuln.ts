// 政治 · 考点漏洞地图数据源（肖1000 一刷 483 题逐题细读 → 381 考点簇 / 417 手册节点）
// ---------------------------------------------------------------------------
// 数据由管线产出（脚本 C:/shot/pw/site_data.py），落到 public/data/politics/：
//   vuln-map.json      科目→章→考点簇→题目（含每题 ●漏选 ▲错选 原话与"为什么"）+ 手册节点清单
//   wrong-letters.json 逐题字母明细（错题本用：真实漏选/错选 + 每个字母的为什么）
// 只 fetch 一次并缓存；组件通过 vulnMap/letters 这两个响应式单例读取。
import { ref, readonly } from 'vue'
import type { CauseKey } from '@/data/politicsWrongCause'

export interface VulnLetter { l: string; t: string; why?: string }
export interface VulnQuestion {
  id: string; qtype: string; kp: string; node: string; mark: string; err: string; fix: string
  miss: VulnLetter[]; extra: VulnLetter[]; singlePair?: boolean
}
export interface VulnGroup {
  key: string; subject: string; chapter: string; group: string
  count: number; hot: boolean; questions: VulnQuestion[]
}
export interface VulnChapter {
  subject: string; chapter: string; total: number; single: number; multi: number
  miss: number; extra: number; groupCount: number
}
export interface HandbookMark { mark: string; ids: string[]; kp?: string }
export interface HandbookNode { subject: string; chapter: string; node: string; marks: HandbookMark[] }
export interface HotGroup { subject: string; group: string; count: number; chapters: string[]; ids: string[] }

export interface VulnMap {
  meta: {
    generated: string; total: number; chapterCount: number; groupCount: number; nodeCount: number
    missTotal: number; extraTotal: number
    subjects: Record<string, number>; causes: Record<string, number>
  }
  chapters: VulnChapter[]
  groups: VulnGroup[]
  handbook: HandbookNode[]
  hotGroups: HotGroup[]
}

export interface WrongLetterRec {
  qtype: '单选' | '多选'
  correct: string; mine: string
  miss: { l: string; t: string }[]
  extra: { l: string; t: string }[]
  why: Record<string, string>
  cause: string
}

const dataBase = () => ((import.meta as any).env?.BASE_URL || '/') + 'data/politics/'

// ── 响应式单例 ──
const _vulnMap = ref<VulnMap | null>(null)
const _letters = ref<Record<string, WrongLetterRec>>({})
const _loading = ref(false)
const _error = ref('')
export const vulnMap = readonly(_vulnMap)
export const letters = readonly(_letters)
export const vulnLoading = readonly(_loading)
export const vulnError = readonly(_error)

// 反向索引：题目 id → 所在考点簇（错题本"看它在哪个漏洞簇"用）
const qidToGroup = ref<Record<string, VulnGroup>>({})

let inflight: Promise<void> | null = null
/** 幂等加载：多次调用只 fetch 一次；失败可重试 */
export function loadPoliticsVuln(force = false): Promise<void> {
  if (_vulnMap.value && !force) return Promise.resolve()
  if (inflight && !force) return inflight
  _loading.value = true
  _error.value = ''
  const job = (async () => {
    try {
      const [m, w] = await Promise.all([
        fetch(`${dataBase()}vuln-map.json`).then(r => (r.ok ? r.json() : null)),
        fetch(`${dataBase()}wrong-letters.json`).then(r => (r.ok ? r.json() : null)),
      ])
      if (!m) throw new Error('vuln-map.json 读取失败')
      _vulnMap.value = m as VulnMap
      _letters.value = (w || {}) as Record<string, WrongLetterRec>
      const idx: Record<string, VulnGroup> = {}
      ;(m as VulnMap).groups.forEach(g => g.questions.forEach(q => { idx[q.id] = g }))
      qidToGroup.value = idx
    } catch (e: any) {
      _error.value = String(e?.message || e)
      console.warn('[politicsVuln] 加载失败', e)
      inflight = null // 允许下次重试
    } finally {
      _loading.value = false
    }
  })()
  inflight = job
  return job
}

/** 题号 → 考点簇（未加载时返回 undefined） */
export function groupOfQuestion(id: string): VulnGroup | undefined {
  return qidToGroup.value[id]
}

/**
 * 真实错因（来自一刷作答的字母集合，不是从订正文本猜的）。
 * 返回 null 表示该题不在 483 题明细里（例如新录入的错题），调用方回退 deriveCause。
 */
export function realCauseKey(id: string): CauseKey | null {
  const r = _letters.value[id]
  if (!r) return null
  if (r.qtype === '单选') return 'single-confuse'
  const hasMiss = (r.miss || []).length > 0
  const hasExtra = (r.extra || []).length > 0
  if (hasMiss && hasExtra) return 'multi-both'
  if (hasExtra) return 'multi-over'
  if (hasMiss) return 'multi-under'
  return 'multi-over'
}

/** 该考点簇是否有"成套结论"型漏洞（漏选≥2 个字母 → 需要整条框架默写） */
export function setGapLetters(id: string) {
  const r = _letters.value[id]
  return r ? { miss: r.miss || [], extra: r.extra || [], correct: r.correct || '', mine: r.mine || '', qtype: r.qtype } : null
}

// ── 手册抄写进度（localStorage，与背诵手册遍数打卡分键，互不干扰）──
const LS_HB = 'politics-handbook-marked-v1'
const _hbDone = ref<Record<string, string>>({})   // `${subject}||${node}||${mark}` → 完成日
let hbInited = false
export function initHandbookProgress() {
  if (hbInited) return
  hbInited = true
  try {
    const raw = localStorage.getItem(LS_HB)
    if (raw) _hbDone.value = JSON.parse(raw) || {}
  } catch { /* noop */ }
}
function hbPersist() {
  try { localStorage.setItem(LS_HB, JSON.stringify(_hbDone.value)) } catch { /* noop */ }
}
export const hbKey = (subject: string, node: string, mark: string) => `${subject}||${node}||${mark}`
export function isMarkDone(key: string) { return !!_hbDone.value[key] }
export function toggleMark(key: string) {
  initHandbookProgress()
  if (_hbDone.value[key]) delete _hbDone.value[key]
  else {
    const d = new Date()
    _hbDone.value[key] = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }
  hbPersist()
}
export function resetMarks() { initHandbookProgress(); _hbDone.value = {}; hbPersist() }
export const hbDoneMap = readonly(_hbDone)
/** 已抄条数 / 总条数（按当前可见范围传入 keys 计算） */
export function hbCount(keys: string[]) {
  initHandbookProgress()
  return { done: keys.filter(k => _hbDone.value[k]).length, total: keys.length }
}

// ── 派生统计（漏洞地图页与今日动作共用）──
export function vulnStats(m: VulnMap) {
  const hotGroups = m.groups.filter(g => g.hot)
  const hotQuestionIds = new Set<string>()
  hotGroups.forEach(g => g.questions.forEach(q => hotQuestionIds.add(q.id)))
  // 跨题重复最狠的簇（同章同名簇出现次数之和）
  const top = [...m.groups].sort((a, b) => b.count - a.count).slice(0, 12)
  // 漏选/错选真实人次（从字母明细统计，比 meta 更贴当前状态）
  let miss = 0, extra = 0, single = 0, multi = 0
  Object.values(_letters.value).forEach(r => {
    miss += (r.miss || []).length; extra += (r.extra || []).length
    if (r.qtype === '单选') single++; else multi++
  })
  return {
    total: m.meta.total, chapters: m.chapters.length, groups: m.groups.length,
    nodes: m.handbook.length, hotGroups: hotGroups.length, hotQuestions: hotQuestionIds.size,
    top, miss, extra, single, multi
  }
}
