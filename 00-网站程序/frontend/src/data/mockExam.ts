// 限时模考 · 规则与成绩账（P0-4）
//
// 病根：平时刷题不计时，考场上 18 分钟一篇阅读、45 分钟 40 道 408 选择从来没实测过。
// 这里给三种最小可用的限时场景：
//   ① 英语阅读 18′/篇——站内有题库，自动判分；
//   ② 408 选择 45′/40 题——题面在王道上（纸面），这里只做计时 + 答题卡自评；
//   ③ 数学选填 50′/16 题——同上，10 选择 + 6 填空。
// 成绩统一记到 mock-exam-v1，能看到「同样 45 分钟，正确率有没有涨」。
import { ref } from 'vue'

export type MockMode = 'english' | 'sheet'
export interface MockPreset {
  key: 'english' | 'cs408' | 'math'
  name: string
  icon: string
  mode: MockMode
  minutes: number
  total: number
  scorePer: number
  fullScore: number
  desc: string
  tip: string
}

export const PRESETS: MockPreset[] = [
  {
    key: 'english', name: '英语阅读 · 单篇', icon: '📖', mode: 'english',
    minutes: 18, total: 5, scorePer: 2, fullScore: 10,
    desc: '18 分钟 · 1 篇真题 · 5 题，站内自动判分',
    tip: '考场节奏：先题干定位再读段落，18 分钟到点自动交卷。'
  },
  {
    key: 'cs408', name: '408 选择题 · 40 题', icon: '💻', mode: 'sheet',
    minutes: 45, total: 40, scorePer: 2, fullScore: 80,
    desc: '45 分钟 · 40 题 · 纸面做题，答题卡自评',
    tip: '用王道/真题套卷纸面做 1-40 题，做完在答题卡上点对错；选择满分 80。'
  },
  {
    key: 'math', name: '数学选填 · 16 题', icon: '📐', mode: 'sheet',
    minutes: 50, total: 16, scorePer: 5, fullScore: 80,
    desc: '50 分钟 · 10 选择 + 6 填空 · 纸面做题，答题卡自评',
    tip: '选填一题 5 分，50 分钟是考场上限；超时说明中档题还不够熟。'
  }
]

export interface MockRecord {
  id: string
  key: string
  name: string
  mode: MockMode
  date: string
  usedMin: number
  total: number
  right: number
  wrong: number
  rate: number
  score: number
  fullScore: number
  label?: string
}

const KEY = 'mock-exam-v1'
export const mockHistory = ref<MockRecord[]>([])

export function loadMockHistory() {
  try { mockHistory.value = JSON.parse(localStorage.getItem(KEY) || '[]') } catch { mockHistory.value = [] }
  return mockHistory.value
}

export function saveMockRecord(rec: Omit<MockRecord, 'id' | 'date'>) {
  const row: MockRecord = {
    ...rec,
    id: `m-${Date.now()}`,
    date: new Date().toISOString().slice(0, 10)
  }
  mockHistory.value = [row, ...mockHistory.value].slice(0, 80)
  try { localStorage.setItem(KEY, JSON.stringify(mockHistory.value)) } catch { /* 配额满忽略 */ }
  return row
}

export function historyOf(key: string) {
  return mockHistory.value.filter(r => r.key === key)
}

// 同类型最近一次（用于「比上次 +x%」）
export function lastBefore(key: string): MockRecord | undefined {
  return mockHistory.value.find(r => r.key === key)
}

export function mmss(sec: number): string {
  const s = Math.max(0, Math.floor(sec))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}
