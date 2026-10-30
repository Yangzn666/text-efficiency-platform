// 今日回炉总账 · 数据层
//
// 磁盘上散落着 8 套带刷/复习状态（数一刷题调度、透视诊断、费曼缺口、睡前口答、
// 长难句、作文背诵、作文模板、408 选择题轮次），各自维护 spacedQueue 到期日，
// 但网站读不到 → 手机上看不见「今天到底欠了多少条复习」。
// 由 `npm run sync:queues`（scripts/sync-review-queues.mjs）合并成
// public/data/queues/review-queues.json，本模块负责读取 + 派生排序。
//
// 优先级分（可解释、不玄学）：严重度 × 逾期压力 × 关联错题量
//   overdueW = clamp(overdue / 14, 0, 1)      逾期两周视为满压力（再往后已经烂了，不再线性加）
//   sevW     = high 1.35 / mid 1 / low 0.75   诊断时标的严重度
//   linkW    = 1 + min(linked, 12) / 12       这个考点背后错了几道题，最多翻倍
//   pri      = sevW * (0.55 + 0.45 * overdueW) * linkW
export type QueueSeverity = 'high' | 'mid' | 'low'

export interface QueueItem {
  id: string
  src: string
  srcLabel: string
  subject: string
  branch?: string
  title: string
  kind?: string
  tier?: string
  severity: QueueSeverity
  nextReview?: string | null
  overdue?: number | null
  mastery?: string
  linked?: number
  box?: number
  streak?: number
  causes?: string[]
  answer?: string
}

export interface QueueOverview {
  key: string
  label: string
  total: number
  left: number
  unit: string
  hint: string
  href?: string
}

export interface QueueSource { key: string; label: string; file: string; ageDays: number | null }
export interface QueuePlanItem { ord?: number; title: string; branch?: string; mode?: string; why?: string; status?: string }
export interface QueuePayload {
  generatedAt: string
  today: string
  examDate: string
  sources: QueueSource[]
  budget: { dailyMinutes?: number; alloc?: Record<string, number>; intervalLadder?: number[]; amnesty?: { date: string; threshold: number }; focusClusters?: string[] } | null
  todayPlan: { date: string; subjectLabel: string; items: QueuePlanItem[] } | null
  items: QueueItem[]
  preExam: { subject: string; cause: string; text: string }[]
  overview: QueueOverview[]
}

import { ref, computed } from 'vue'

export const payload = ref<QueuePayload | null>(null)
export const loading = ref(false)
export const error = ref('')
let inflight: Promise<void> | null = null

/** 幂等加载：多次调用只发一次请求；失败可重试 */
export function loadReviewQueues(force = false): Promise<void> {
  if (payload.value && !force) return Promise.resolve()
  if (inflight && !force) return inflight
  loading.value = true
  error.value = ''
  inflight = (async () => {
    try {
      const base = (import.meta as any).env?.BASE_URL || '/'
      const res = await fetch(`${base}data/queues/review-queues.json?t=${Date.now()}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      payload.value = await res.json()
    } catch (e: any) {
      error.value = e?.message || '加载失败'
      payload.value = null
    } finally {
      loading.value = false
      inflight = null
    }
  })()
  return inflight
}

const SEV_W: Record<QueueSeverity, number> = { high: 1.35, mid: 1, low: 0.75 }

export function priorityScore(it: QueueItem): number {
  const od = it.overdue ?? 0
  const overdueW = Math.max(0, Math.min(1, od / 14))
  const linkW = 1 + Math.min(it.linked || 0, 12) / 12
  return (SEV_W[it.severity] || 1) * (0.55 + 0.45 * overdueW) * linkW
}

export const queueItems = computed<QueueItem[]>(() => payload.value?.items || [])
/** 到期（含逾期）项，按优先级降序 */
export const dueItems = computed<QueueItem[]>(() =>
  queueItems.value
    .filter(i => (i.overdue ?? -1) >= 0)
    .slice()
    .sort((a, b) => priorityScore(b) - priorityScore(a))
)
/** 未到期（未来复习）项，按到期日升序 */
export const upcomingItems = computed<QueueItem[]>(() =>
  queueItems.value
    .filter(i => i.overdue !== null && i.overdue < 0)
    .slice()
    .sort((a, b) => (a.overdue ?? 0) - (b.overdue ?? 0))
)
export const dueCount = computed(() => dueItems.value.length)
/** 到期且今日尚未销账（首页横幅用的"真欠账"） */
export const undoneDueItems = computed(() => dueItems.value.filter(i => !isQueueDone(i.id)))
export const undoneDueCount = computed(() => undoneDueItems.value.length)

// ---------- 每日配额 ----------
// 192 条到期一次性摊到手机上等于没摊。按 40 条/天切一刀：前 40 条是"今天真要做的"，
// 其余进积压区，并给出清空天数——让人看见欠账是可控的，而不是一屏绝望。
export const DAILY_QUOTA = 40
export const quotaItems = computed(() => undoneDueItems.value.slice(0, DAILY_QUOTA))
export const backlogItems = computed(() => undoneDueItems.value.slice(DAILY_QUOTA))
export const backlogDays = computed(() => Math.ceil(undoneDueCount.value / DAILY_QUOTA))

/** 到期项按科目分组计数（数学/408/英语/综合） */
export const dueBySubject = computed<Record<string, number>>(() => {
  const m: Record<string, number> = {}
  dueItems.value.forEach(i => { m[i.subject] = (m[i.subject] || 0) + 1 })
  return m
})
export const subjectChips = computed(() => Object.keys(dueBySubject.value))

export const worstOverdue = computed(() =>
  dueItems.value.reduce((max, i) => Math.max(max, i.overdue ?? 0), 0)
)
export const highSeverityCount = computed(() => dueItems.value.filter(i => i.severity === 'high').length)

export const overview = computed<QueueOverview[]>(() => payload.value?.overview || [])
export const sources = computed<QueueSource[]>(() => payload.value?.sources || [])
export const preExam = computed(() => payload.value?.preExam || [])
export const todayPlan = computed(() => payload.value?.todayPlan || null)
export const budget = computed(() => payload.value?.budget || null)
export const generatedAt = computed(() => payload.value?.generatedAt || '')
export const daysToExam = computed(() => {
  const d = payload.value?.examDate
  if (!d) return null
  const t = new Date((payload.value?.today || new Date().toLocaleDateString('sv-SE')) + 'T00:00:00')
  const e = new Date(d + 'T00:00:00')
  return Math.max(0, Math.round((e.getTime() - t.getTime()) / 86400000))
})
/** 陈旧数据源（>14 天没更新），提醒这些队列可能已经废弃 */
export const staleSources = computed(() => sources.value.filter(s => (s.ageDays ?? 0) > 14))

export function fmtScore(it: QueueItem): string {
  return priorityScore(it).toFixed(2)
}

// ---------- 今日销账（与首页横幅共用同一份本地记录） ----------
// 只在本机记住"这条今天已经处理过"，次日按日期分桶自动清零；不动磁盘上的队列状态。
const DONE_KEY = 'review-queue-done-v1'
export const localToday = () => new Date().toLocaleDateString('sv-SE')
const doneMap = ref<Record<string, Record<string, boolean>>>({})
const doneReady = ref(false)

export function loadQueueDone() {
  if (doneReady.value) return
  try {
    const raw = localStorage.getItem(DONE_KEY)
    if (raw) doneMap.value = JSON.parse(raw)
  } catch { doneMap.value = {} }
  doneReady.value = true
}
function saveQueueDone() {
  try { localStorage.setItem(DONE_KEY, JSON.stringify(doneMap.value)) } catch { /* 隐私模式忽略 */ }
}
export function isQueueDone(id: string): boolean {
  loadQueueDone()
  return !!doneMap.value[localToday()]?.[id]
}
export function toggleQueueDone(id: string) {
  loadQueueDone()
  const d = localToday()
  const day = doneMap.value[d] || (doneMap.value[d] = {})
  if (day[id]) delete day[id]; else day[id] = true
  saveQueueDone()
}
export function clearQueueToday() {
  loadQueueDone()
  doneMap.value = { ...doneMap.value, [localToday()]: {} }
  saveQueueDone()
}
/** 今日已销账条数 */
export const doneTodayCount = computed(() => {
  loadQueueDone()
  return Object.keys(doneMap.value[localToday()] || {}).length
})
