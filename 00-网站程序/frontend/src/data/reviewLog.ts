// 复习事件流水 · 全站唯一的「今天到底做了什么」计数
//
// 背景：错题本的 lastReviewAt 只保留最后一次，看不到「本周毕业了几道」的历史曲线；
// SRS 只有盒子状态，也不知道今天刷了几张。这里按天记账，给趋势图 / 今日看板提供底表。
//
// 结构（localStorage: review-log-v1）：
//   { "2026-10-31": { srs: 12, wrong: 8, graduate: 3, queue: 40,
//                     grads: { math: 2, cs: 1 } } }
// 只增不减，单日一条；一年也就 365 行，体积可忽略。
import { ref } from 'vue'

export type ReviewKind = 'srs' | 'wrong' | 'graduate' | 'queue'

interface DayBucket {
  srs?: number
  wrong?: number
  graduate?: number
  queue?: number
  grads?: Record<string, number>
}

const KEY = 'review-log-v1'
const days = ref<Record<string, DayBucket>>({})
let loaded = false

export function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function loadReviewLog() {
  if (loaded) return
  loaded = true
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') days.value = parsed
    }
  } catch {
    days.value = {}
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(days.value))
  } catch (e) {
    console.warn('[reviewLog] 持久化失败', e)
  }
}

/** 记一次复习事件（同日同类型直接累加） */
export function logReview(kind: ReviewKind, n = 1, subject?: string) {
  if (!n) return
  loadReviewLog()
  const d = todayStr()
  const bucket: DayBucket = days.value[d] || (days.value[d] = {})
  bucket[kind] = (bucket[kind] || 0) + n
  if (kind === 'graduate' && subject) {
    bucket.grads = bucket.grads || {}
    bucket.grads[subject] = (bucket.grads[subject] || 0) + n
  }
  // 写回触发响应式（ref 里就地改也响应，但整体替换更稳）
  days.value = { ...days.value, [d]: bucket }
  save()
}

export function countOn(date: string, kind: ReviewKind): number {
  loadReviewLog()
  return days.value[date]?.[kind] || 0
}

export function todayCount(kind: ReviewKind): number {
  return countOn(todayStr(), kind)
}

export interface DayPoint {
  date: string
  label: string
  srs: number
  wrong: number
  graduate: number
  queue: number
}

function shift(date: string, n: number): string {
  const [y, m, d] = date.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() + n)
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
}

/** 最近 N 天（含今天）的逐日序列，queue 由调用方传入的额外底表合并 */
export function lastDays(n: number, queueHistory: Record<string, number> = {}): DayPoint[] {
  loadReviewLog()
  const today = todayStr()
  const out: DayPoint[] = []
  for (let i = n - 1; i >= 0; i--) {
    const date = shift(today, -i)
    const b = days.value[date] || {}
    out.push({
      date,
      label: date.slice(5),
      srs: b.srs || 0,
      wrong: b.wrong || 0,
      graduate: b.graduate || 0,
      queue: queueHistory[date] || b.queue || 0
    })
  }
  return out
}

/** 近 N 天毕业数按科目拆分 */
export function graduationsBySubject(n: number): Record<string, number> {
  loadReviewLog()
  const today = todayStr()
  const from = shift(today, -(n - 1))
  const out: Record<string, number> = {}
  Object.entries(days.value).forEach(([date, b]) => {
    if (date < from || date > today) return
    Object.entries(b.grads || {}).forEach(([s, c]) => {
      out[s] = (out[s] || 0) + c
    })
  })
  return out
}

/** 全量导出（调试 / 备份） */
export function dumpReviewLog() {
  loadReviewLog()
  return JSON.parse(JSON.stringify(days.value))
}
