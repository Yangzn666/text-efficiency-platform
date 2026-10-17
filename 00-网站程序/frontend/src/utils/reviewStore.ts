/**
 * 英语阅读 · 逐题复盘卡数据层（reviewStore）
 *
 * 用途：让"每道真题做完后亲手复盘"这件事被结构化沉淀下来，
 * 而不是看完解析"哦"一声就翻篇——正是对症"固定思维 / 碰运气"。
 *
 * 每题记四步（对应"手术四步法"）：
 *   1 reason  —— 我当时为什么选它（把脑子里那句"感觉/好像/读着顺"逼出来）
 *   2 locate  —— 定位句在第几段第几句 + 我漏看了哪个关键词
 *   3 rewrite —— 正确项是原文哪里的同义改写
 *   4 trapId  —— 我踩的到底是哪一类干扰套路（复用 trapTaxonomy 的 11 类）
 *
 * 纯 localStorage（个人版专属），不写库、不进共享版。key = year-section-textNumber-number。
 * 保存时派发 window 事件 'reading-review-updated'，供统计面板实时刷新。
 */
import type { TrapId } from './trapTaxonomy'

export interface ReviewEntry {
  reason: string
  locate: string
  rewrite: string
  trapId: TrapId | null
  updatedAt: number
}

export const REVIEW_KEY = 'readingReview-v1'

export function reviewKey(q: { year?: any; section?: any; textNumber?: any; number?: any }): string {
  return `${q.year}-${q.section}-${q.textNumber}-${q.number}`
}

function readRaw(): Record<string, ReviewEntry> {
  try {
    const s = localStorage.getItem(REVIEW_KEY)
    const o = s ? JSON.parse(s) : {}
    return o && typeof o === 'object' ? o : {}
  } catch {
    return {}
  }
}

function writeRaw(all: Record<string, ReviewEntry>) {
  try {
    localStorage.setItem(REVIEW_KEY, JSON.stringify(all))
    window.dispatchEvent(new CustomEvent('reading-review-updated'))
  } catch (e) {
    console.warn('复盘保存失败', e)
  }
}

export function loadAllReviews(): Record<string, ReviewEntry> {
  return readRaw()
}

export function loadReview(key: string): ReviewEntry | null {
  return readRaw()[key] || null
}

const EMPTY: ReviewEntry = { reason: '', locate: '', rewrite: '', trapId: null, updatedAt: 0 }

/** 合并式保存；返回写入后的完整条目 */
export function saveReview(key: string, patch: Partial<ReviewEntry>): ReviewEntry {
  const all = readRaw()
  const merged: ReviewEntry = { ...(all[key] || EMPTY), ...patch, updatedAt: Date.now() }
  all[key] = merged
  writeRaw(all)
  return merged
}

/** 四步是否都填了（用于角标 / 统计口径：只把填全的复盘计入趋势） */
export function isReviewComplete(e?: ReviewEntry | null): boolean {
  if (!e) return false
  return !!(e.reason.trim() && e.locate.trim() && e.rewrite.trim() && e.trapId)
}

/** 任一字段非空即视为"已开始复盘" */
export function hasAnyReview(e?: ReviewEntry | null): boolean {
  if (!e) return false
  return !!(e.reason.trim() || e.locate.trim() || e.rewrite.trim() || e.trapId)
}

export function clearReview(key: string) {
  const all = readRaw()
  if (all[key]) {
    delete all[key]
    writeRaw(all)
  }
}

/** 供 TrapStats：所有已标注 trapId 的复盘（含未填全的），返回 TrapId 计数 */
export function selfTaggedTrapCounts(): Record<string, number> {
  const all = readRaw()
  const counter: Record<string, number> = {}
  Object.keys(all).forEach((k) => {
    const t = all[k].trapId
    if (t) counter[t] = (counter[t] || 0) + 1
  })
  return counter
}

/** 已复盘（开始填写）的题数 */
export function reviewStartCount(): number {
  const all = readRaw()
  return Object.keys(all).filter((k) => hasAnyReview(all[k])).length
}
