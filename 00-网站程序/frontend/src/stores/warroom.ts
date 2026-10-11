import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 战术作战室「交互层」专用 store。
 * 只负责游戏化 / 情绪价值部分：今日战训勾选、XP/等级、连胜、真题计数、高光时刻、战力曲线快照。
 * 四科完成度 / 应达 / 综合战力等所有进度真相一律读 useTodayStatusStore，不在此重复，避免双数据源。
 * 数据仅存本机 localStorage（key: warroom-v1）。
 */

const KEY = 'warroom-v1'

interface CounterState { mathDone: number, mathTotal: number, c408Done: number, c408Total: number }
interface TrendPoint { date: string, v: number }
interface LogItem { date: string, text: string }

const DEFAULT_COUNTERS: CounterState = { mathDone: 14, mathTotal: 19, c408Done: 9, c408Total: 126 }

const todayKey = (): string => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const useWarroomStore = defineStore('warroom', () => {
  // ---------- 状态 ----------
  const counters = ref<CounterState>({ ...DEFAULT_COUNTERS })
  const xp = ref(0)
  const streak = ref(0)
  const lastDate = ref('')
  /** 每日战训勾选：{ [date]: { [taskId]: boolean } } */
  const checks = ref<Record<string, Record<string, boolean>>>({})
  /** 高光时刻（最新在前） */
  const log = ref<LogItem[]>([])
  /** 战力曲线快照（升序） */
  const trend = ref<TrendPoint[]>([])

  // ---------- 持久化 ----------
  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        counters: counters.value,
        xp: xp.value,
        streak: streak.value,
        lastDate: lastDate.value,
        checks: checks.value,
        log: log.value,
        trend: trend.value
      }))
    } catch { /* 隐私模式 / 配额：内存态照常工作 */ }
  }

  const load = () => {
    try {
      const raw = localStorage.getItem(KEY)
      if (!raw) return
      const p = JSON.parse(raw)
      if (p.counters) counters.value = { ...DEFAULT_COUNTERS, ...p.counters }
      if (typeof p.xp === 'number') xp.value = p.xp
      if (typeof p.streak === 'number') streak.value = p.streak
      if (typeof p.lastDate === 'string') lastDate.value = p.lastDate
      if (p.checks) checks.value = p.checks
      if (Array.isArray(p.log)) log.value = p.log
      if (Array.isArray(p.trend)) trend.value = p.trend
    } catch { /* 损坏存档忽略，用内存默认 */ }
  }

  // ---------- 派生 ----------
  const level = computed(() => Math.floor(xp.value / 120) + 1)
  const xpIntoLevel = computed(() => xp.value % 120)
  const todayChecks = computed<Record<string, boolean>>(() => checks.value[todayKey()] || {})

  // ---------- 战训勾选 ----------
  /** 勾选/取消今日某条战训；返回是否新勾选（供组件触发庆祝特效） */
  const toggleCheck = (taskId: string, xpPer = 12): 'checked' | 'unchecked' => {
    const tk = todayKey()
    if (!checks.value[tk]) checks.value[tk] = {}
    const map = checks.value[tk]
    const wasDone = !!map[taskId]
    const firstOfDay = Object.keys(map).every(k => !map[k])
    if (wasDone) {
      map[taskId] = false
      xp.value = Math.max(0, xp.value - xpPer)
    } else {
      map[taskId] = true
      xp.value += xpPer
      bumpStreak(firstOfDay)
    }
    save()
    return wasDone ? 'unchecked' : 'checked'
  }

  /** 连续开火天数：与上次记录相邻（昨天/今天）则 +1，否则重置为 1 */
  const bumpStreak = (isFirst: boolean): boolean => {
    const tk = todayKey()
    if (lastDate.value === tk) return false
    const y = new Date()
    y.setDate(y.getDate() - 1)
    const yk = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`
    streak.value = lastDate.value === yk ? streak.value + 1 : 1
    lastDate.value = tk
    return isFirst && streak.value > 1
  }

  // ---------- 真题计数 ----------
  const bumpCounter = (which: 'mathDone' | 'c408Done', delta: number): boolean => {
    const maxKey = which === 'mathDone' ? 'mathTotal' : 'c408Total'
    let nv = counters.value[which] + delta
    if (nv < 0) nv = 0
    if (nv > counters.value[maxKey]) nv = counters.value[maxKey]
    counters.value[which] = nv
    save()
    return delta > 0
  }

  // ---------- 高光时刻 ----------
  const addLog = (text: string): boolean => {
    const v = text.trim()
    if (!v) return false
    log.value.unshift({ date: todayKey(), text: v })
    if (log.value.length > 60) log.value.length = 60
    save()
    return true
  }

  // ---------- 战力曲线 ----------
  /** 记录当天综合战力（v 由组件从 todayStatus 取值传入），同日覆盖，最多留 60 天 */
  const snapshot = (v: number) => {
    const tk = todayKey()
    const i = trend.value.findIndex(p => p.date === tk)
    const pt: TrendPoint = { date: tk, v }
    if (i >= 0) trend.value[i] = pt
    else trend.value.push(pt)
    trend.value.sort((a, b) => (a.date < b.date ? -1 : 1))
    if (trend.value.length > 60) trend.value.splice(0, trend.value.length - 60)
    save()
  }

  // ---------- 存档 导入 / 导出 / 重置 ----------
  const exportData = (): string => JSON.stringify({
    counters: counters.value, xp: xp.value, streak: streak.value,
    lastDate: lastDate.value, checks: checks.value, log: log.value, trend: trend.value
  }, null, 2)

  const importData = (json: string): boolean => {
    try {
      const p = JSON.parse(json)
      if (p.counters) counters.value = { ...DEFAULT_COUNTERS, ...p.counters }
      xp.value = typeof p.xp === 'number' ? p.xp : 0
      streak.value = typeof p.streak === 'number' ? p.streak : 0
      lastDate.value = typeof p.lastDate === 'string' ? p.lastDate : ''
      checks.value = p.checks || {}
      log.value = Array.isArray(p.log) ? p.log : []
      trend.value = Array.isArray(p.trend) ? p.trend : []
      save()
      return true
    } catch { return false }
  }

  const reset = () => {
    counters.value = { ...DEFAULT_COUNTERS }
    xp.value = 0
    streak.value = 0
    lastDate.value = ''
    checks.value = {}
    log.value = []
    trend.value = []
    save()
  }

  return {
    counters, xp, streak, lastDate, checks, log, trend,
    level, xpIntoLevel, todayChecks,
    toggleCheck, bumpCounter, addLog, snapshot,
    exportData, importData, reset,
    load, save
  }
})
