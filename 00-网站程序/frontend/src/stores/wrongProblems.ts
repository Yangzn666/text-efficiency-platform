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
  // 每个科目"上一次见过的种子条目 id 全集"，用于在已播种的老浏览器上增量补种新增条目
  __seedIds?: Partial<Record<WrongSubject, string[]>>
}

const tag = (subject: WrongSubject, p: WrongProblem): WrongProblem => ({ ...p, subject: p.subject || subject })

/**
 * 条目合法性校验：localStorage / 导入 JSON 里可能混进 null、非对象或没有 id 的脏数据，
 * 一旦进入 db，tag() 会抛 "Cannot read properties of null (reading 'subject')"、
 * bind() 会抛 "reading 'id' of undefined"，导致整个科目错题本白屏。读入与补种时统一过滤。
 */
const isValidProblem = (p: unknown): p is WrongProblem =>
  !!p && typeof p === 'object' && !Array.isArray(p) && typeof (p as WrongProblem).id === 'string' && (p as WrongProblem).id.length > 0

// ===== 毕业机制：连续做对 GRADUATE_STREAK 次即自动"毕业"（mastered=true），答错清零回炉 =====
export const GRADUATE_STREAK = 2

function todayStr(): string {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

function withinDays(dateStr: string, days: number): boolean {
  if (!dateStr) return false
  const t = Date.parse(dateStr)
  if (Number.isNaN(t)) return false
  return Date.now() - t <= days * 86400000
}

export const useWrongProblemsStore = defineStore('wrongProblems', () => {
  const db = reactive<Record<WrongSubject, WrongProblem[]>>(
    SUBJECTS.reduce((acc, s) => { acc[s] = []; return acc }, {} as Record<WrongSubject, WrongProblem[]>)
  )
  const seeded = reactive<Set<WrongSubject>>(new Set())
  const seedIds = reactive<Record<WrongSubject, Set<string>>>(
    SUBJECTS.reduce((acc, s) => { acc[s] = new Set(); return acc }, {} as Record<WrongSubject, Set<string>>)
  )
  let inited = false

  function init() {
    if (inited) return
    inited = true
    const canon = readJSON<StoredDoc>(CANON) || {}
    ;(canon.__seeded || []).forEach((s) => seeded.add(s))
    const sid = canon.__seedIds || {}
    SUBJECTS.forEach((s) => { (sid[s] || []).forEach((id) => seedIds[s].add(id)) })
    SUBJECTS.forEach((s) => {
      const fromCanon = canon[s]
      if (fromCanon && fromCanon.length) {
        db[s] = fromCanon.filter(isValidProblem).map((p) => tag(s, p))
        return
      }
      const legacyKey = LEGACY[s]
      if (legacyKey) {
        const legacy = readJSON<WrongProblem[]>(legacyKey)
        if (legacy && legacy.length) {
          db[s] = legacy.filter(isValidProblem).map((p) => tag(s, p))
          seeded.add(s) // 已有迁移数据视作已播种，避免再叠加种子
        }
      }
    })
  }

  function persist() {
    init()
    const doc: StoredDoc = { __seeded: Array.from(seeded) }
    const sidOut: Partial<Record<WrongSubject, string[]>> = {}
    SUBJECTS.forEach((s) => { sidOut[s] = Array.from(seedIds[s]) })
    doc.__seedIds = sidOut
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
    seed = (seed || []).filter(isValidProblem)
    let changed = false
    if (!seeded.has(subject) && db[subject].length === 0) {
      db[subject] = seed.map((p) => tag(subject, p))
      seeded.add(subject)
      seedIds[subject] = new Set(seed.map((p) => p.id))
      changed = true
    } else {
      // 增量补种：把种子里"新增的、且此前从未播种过、本地也还没有"的条目并入
      const known = seedIds[subject]
      const existing = new Set(db[subject].map((p) => p.id))
      const nextKnown = new Set<string>()
      for (const p of seed) {
        nextKnown.add(p.id)
        if (!known.has(p.id) && !existing.has(p.id)) {
          db[subject].push(tag(subject, p))
          existing.add(p.id)
          changed = true
        }
      }
      // 记录本次种子 id 全集，下一轮据此判断"新增"
      if (nextKnown.size !== known.size || [...nextKnown].some((id) => !known.has(id))) {
        seedIds[subject] = nextKnown
        changed = true
      }
    }
    if (changed) persist()
    return computed({
      get: () => db[subject],
      set: (v: WrongProblem[]) => {
        db[subject] = (v || []).filter(isValidProblem).map((p) => tag(subject, p))
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

  // ===== 毕业机制：记录一次复习结果 =====
  // 传入的 problem 是 db 里的响应式对象，直接 mutate，deep watch 会自动落盘。
  function recordReview(problem: WrongProblem, correct: boolean) {
    problem.reviewCount = (problem.reviewCount || 0) + 1
    problem.lastReviewAt = todayStr()
    if (correct) {
      problem.correctStreak = (problem.correctStreak || 0) + 1
      if (problem.correctStreak >= GRADUATE_STREAK) problem.mastered = true
    } else {
      problem.correctStreak = 0
      problem.mastered = false
    }
  }

  // 某科目的"进步仪表盘"：总数 / 已毕业 / 待复习 / 本周新毕业
  function progressOf(subject: WrongSubject) {
    init()
    const list = db[subject]
    const total = list.length
    const mastered = list.filter((p) => p.mastered).length
    const weeklyGraduated = list.filter((p) => p.mastered && withinDays(p.lastReviewAt, 7)).length
    return { total, mastered, pending: total - mastered, weeklyGraduated }
  }

  return {
    db, init, persist, bind,
    all, total, masteredCount, unmasteredCount, masteredRate,
    bySubject, countOf, masteredOf, recent, mistakeDistribution, weakChapters,
    recordReview, progressOf,
    SUBJECTS,
  }
})
