// 全科错题本统一 store（2026-09-18 P1 数据打通）
// 目标：
//  1) 单一数据源：所有科目错题落在同一个 localStorage 键 wrong-problems-v1，形如 { math:[...], cs:[...], ... , __seeded:[...] }。
//  2) 一次性迁移：老键 csWrongProblems / dsWrongProblems / os_wrong_problems / networkWrongProblems 首次读取时并入统一键。
//  3) 数学错题获得真正的持久化（此前仅内联种子、刷新即丢）。
//  4) 暴露聚合 getters，供错题看板 / 数据分析 / 薄弱点分析 / 今日任务 复用，替代手写假数字。
//
// 用法（组件侧，最小改动）：
//   const wp = useWrongProblemsStore()
//   const problems = wp.bind('cs', [ ...种子数组... ])   // 返回可写 computed，problems.value 读写皆落统一 store
//   ...（增删改仍可直接操作 problems.value，store 通过 deep watch 自动持久化）
import { defineStore } from 'pinia'
import { reactive, computed, watch, type ComputedRef } from 'vue'
import type { WrongProblem } from '@/data/wrongProblemTypes'

export type WrongSubject =
  | 'math' | 'cs' | 'ds' | 'os' | 'network' | 'english' | 'politics'

const CANON = 'wrong-problems-v1'

// 历史遗留键（迁移来源）；math/english/politics 无遗留键
const LEGACY: Partial<Record<WrongSubject, string>> = {
  cs: 'csWrongProblems',
  ds: 'dsWrongProblems',
  os: 'os_wrong_problems',
  network: 'networkWrongProblems',
}

const SUBJECTS: WrongSubject[] = ['math', 'cs', 'ds', 'os', 'network', 'english', 'politics']

function readJSON<T>(key: string): T | null {
  try {
    const s = localStorage.getItem(key)
    return s ? (JSON.parse(s) as T) : null
  } catch {
    return null
  }
}

interface StoredDoc extends Partial<Record<WrongSubject, WrongProblem[]>> {
  __seeded?: WrongSubject[]
}

const tag = (subject: WrongSubject, p: WrongProblem): WrongProblem => ({ ...p, subject: p.subject || subject })

export const useWrongProblemsStore = defineStore('wrongProblems', () => {
  const db = reactive<Record<WrongSubject, WrongProblem[]>>(
    SUBJECTS.reduce((acc, s) => { acc[s] = []; return acc }, {} as Record<WrongSubject, WrongProblem[]>)
  )
  const seeded = reactive<Set<WrongSubject>>(new Set())
  let inited = false

  function init() {
    if (inited) return
    inited = true
    const canon = readJSON<StoredDoc>(CANON) || {}
    ;(canon.__seeded || []).forEach((s) => seeded.add(s))
    SUBJECTS.forEach((s) => {
      const fromCanon = canon[s]
      if (fromCanon && fromCanon.length) {
        db[s] = fromCanon.map((p) => tag(s, p))
        return
      }
      const legacyKey = LEGACY[s]
      if (legacyKey) {
        const legacy = readJSON<WrongProblem[]>(legacyKey)
        if (legacy && legacy.length) {
          db[s] = legacy.map((p) => tag(s, p))
          seeded.add(s) // 已有迁移数据视作已播种，避免再叠加种子
        }
      }
    })
  }

  function persist() {
    init()
    const doc: StoredDoc = { __seeded: Array.from(seeded) }
    SUBJECTS.forEach((s) => { doc[s] = db[s] })
    try {
      localStorage.setItem(CANON, JSON.stringify(doc))
    } catch (e) {
      console.warn('[wrongProblems] 持久化失败', e)
    }
  }

  // 任一变更自动落盘
  watch(db, () => persist(), { deep: true })

  /**
   * 绑定某科目：首次且该科目从未被播种且当前为空时，用传入种子填充；
   * 返回可写 computed，组件对 problems.value 的读取/重赋值/push/splice 均落到统一 store。
   */
  function bind(subject: WrongSubject, seed: WrongProblem[]): ComputedRef<WrongProblem[]> {
    init()
    if (!seeded.has(subject) && db[subject].length === 0) {
      db[subject] = seed.map((p) => tag(subject, p))
      seeded.add(subject)
      persist()
    }
    return computed({
      get: () => db[subject],
      set: (v: WrongProblem[]) => {
        db[subject] = (v || []).map((p) => tag(subject, p))
      },
    })
  }

  // ===== 聚合 getters（供 Dashboard / 数据分析 / 薄弱点 / 今日任务）=====
  const all = computed<WrongProblem[]>(() =>
    SUBJECTS.flatMap((s) => db[s].map((p) => tag(s, p)))
  )
  const total = computed(() => all.value.length)
  const masteredCount = computed(() => all.value.filter((p) => p.mastered).length)
  const unmasteredCount = computed(() => total.value - masteredCount.value)
  const masteredRate = computed(() => (total.value ? Math.round((masteredCount.value / total.value) * 100) : 0))

  function countOf(subject: WrongSubject) { return db[subject].length }
  function masteredOf(subject: WrongSubject) { return db[subject].filter((p) => p.mastered).length }
  const bySubject = computed(() => {
    const o: Record<WrongSubject, { total: number; mastered: number }> = {} as any
    SUBJECTS.forEach((s) => { o[s] = { total: db[s].length, mastered: db[s].filter((p) => p.mastered).length } })
    return o
  })

  function recent(days: number): WrongProblem[] {
    init()
    const t = Date.now() - days * 86400000
    return all.value.filter((p) => {
      const d = p.createdAt ? Date.parse(p.createdAt) : NaN
      return !Number.isNaN(d) && d >= t
    })
  }

  // 未掌握错题按错因分布
  const mistakeDistribution = computed(() => {
    const m: Record<string, number> = {}
    all.value.filter((p) => !p.mastered).forEach((p) => { m[p.mistakeType] = (m[p.mistakeType] || 0) + 1 })
    return Object.entries(m).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count)
  })

  // 薄弱章节 Top（按未掌握数量）
  const weakChapters = computed(() => {
    const m: Record<string, { subject: WrongSubject; chapter: string; count: number }> = {}
    all.value.filter((p) => !p.mastered).forEach((p) => {
      const key = `${p.subject}::${p.chapterName || '未分类'}`
      if (!m[key]) m[key] = { subject: p.subject as WrongSubject, chapter: p.chapterName || '未分类', count: 0 }
      m[key].count++
    })
    return Object.values(m).sort((a, b) => b.count - a.count)
  })

  return {
    db, init, persist, bind,
    all, total, masteredCount, unmasteredCount, masteredRate,
    bySubject, countOf, masteredOf, recent, mistakeDistribution, weakChapters,
    SUBJECTS,
  }
})
