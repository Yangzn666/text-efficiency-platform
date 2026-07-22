import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 费曼学习法数据引擎
 * 设计原则：
 * - 数据存储在 public/data/feynman/{subject}.json（支持多科目）
 * - localStorage 作为本地缓存 + 离线兜底
 * - 微信对话中 AI 动态更新 JSON → 网站刷新后同步
 * - 每条薄弱点记录包含：概念、错误描述、严重度、是否解决、复习次数
 */

// ==================== 类型定义 ====================
export type FeynmanSubject = 'cs408' | 'math'

export type WeakPointSeverity = 'low' | 'medium' | 'high'
export type WeakPointStatus = 'unresolved' | 'reviewing' | 'resolved'

export interface WeakPoint {
  id: string
  /** 所属章节/主题 */
  topic: string
  /** 具体概念 */
  concept: string
  /** 错误/卡点描述 */
  description: string
  /** 严重程度 */
  severity: WeakPointSeverity
  /** 状态 */
  status: WeakPointStatus
  /** 首次发现日期 */
  createdAt: string
  /** 最近复习日期 */
  lastReviewAt: string | null
  /** 复习次数 */
  reviewCount: number
  /** 关联的会话ID */
  sessionId: string | null
}

export interface FeynmanSession {
  id: string
  /** 日期 */
  date: string
  /** 主题/章节 */
  topic: string
  /** 费曼讲解的知识点列表 */
  concepts: string[]
  /** 本次发现的薄弱点ID列表 */
  weakPointIds: string[]
  /** 会话摘要 */
  summary: string
  /** 自评掌握度 1-5 */
  mastery: number
}

export interface FeynmanData {
  version: number
  subject: string
  subjectName: string
  updatedAt: string
  sessions: FeynmanSession[]
  weakPoints: WeakPoint[]
  stats: {
    totalSessions: number
    totalWeakPoints: number
    resolvedCount: number
    streakDays: number
  }
}

// ==================== 常量 ====================
const STORAGE_PREFIX = 'feynman-data-'

const SUBJECT_META: Record<FeynmanSubject, { name: string; color: string; icon: string }> = {
  cs408: { name: '408计算机', color: '#409EFF', icon: '💻' },
  math: { name: '数学一', color: '#67C23A', icon: '📐' }
}

// ==================== Store ====================
export const useFeynmanStore = defineStore('feynman', () => {
  const currentSubject = ref<FeynmanSubject>('cs408')
  const data = ref<FeynmanData>(buildEmpty('cs408'))
  const loading = ref(false)

  function buildEmpty(subject: FeynmanSubject): FeynmanData {
    return {
      version: 1,
      subject,
      subjectName: SUBJECT_META[subject].name,
      updatedAt: new Date().toISOString(),
      sessions: [],
      weakPoints: [],
      stats: { totalSessions: 0, totalWeakPoints: 0, resolvedCount: 0, streakDays: 0 }
    }
  }

  // ---------- 数据加载 ----------
  async function loadFromJson(subject: FeynmanSubject) {
    loading.value = true
    try {
      const base = import.meta.env.BASE_URL || '/'
      const resp = await fetch(`${base}data/feynman/${subject}.json?t=${Date.now()}`)
      if (resp.ok) {
        const json = await resp.json() as FeynmanData
        data.value = json
        // 同步到 localStorage
        localStorage.setItem(STORAGE_PREFIX + subject, JSON.stringify(json))
        return
      }
    } catch { /* 网络失败，走 localStorage */ }
    // fallback: localStorage
    loadFromLocal(subject)
    loading.value = false
  }

  function loadFromLocal(subject: FeynmanSubject) {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + subject)
      if (saved) {
        data.value = JSON.parse(saved) as FeynmanData
        return
      }
    } catch { /* ignore */ }
    data.value = buildEmpty(subject)
  }

  function saveLocal() {
    localStorage.setItem(STORAGE_PREFIX + currentSubject.value, JSON.stringify(data.value))
  }

  function switchSubject(subject: FeynmanSubject) {
    currentSubject.value = subject
    loadFromJson(subject)
  }

  // ---------- 薄弱点操作 ----------
  function addWeakPoint(wp: Omit<WeakPoint, 'id' | 'createdAt' | 'lastReviewAt' | 'reviewCount' | 'status'>) {
    const id = `wp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const newWp: WeakPoint = {
      ...wp,
      id,
      status: 'unresolved',
      createdAt: new Date().toISOString().slice(0, 10),
      lastReviewAt: null,
      reviewCount: 0
    }
    data.value.weakPoints.unshift(newWp)
    updateStats()
    saveLocal()
    return id
  }

  function updateWeakPointStatus(id: string, status: WeakPointStatus) {
    const wp = data.value.weakPoints.find(w => w.id === id)
    if (wp) {
      wp.status = status
      if (status === 'reviewing' || status === 'resolved') {
        wp.lastReviewAt = new Date().toISOString().slice(0, 10)
        wp.reviewCount++
      }
      updateStats()
      saveLocal()
    }
  }

  function removeWeakPoint(id: string) {
    data.value.weakPoints = data.value.weakPoints.filter(w => w.id !== id)
    updateStats()
    saveLocal()
  }

  // ---------- 会话操作 ----------
  function addSession(session: Omit<FeynmanSession, 'id'>) {
    const id = `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    data.value.sessions.unshift({ ...session, id })
    updateStats()
    saveLocal()
    return id
  }

  // ---------- 统计 ----------
  function updateStats() {
    data.value.stats = {
      totalSessions: data.value.sessions.length,
      totalWeakPoints: data.value.weakPoints.length,
      resolvedCount: data.value.weakPoints.filter(w => w.status === 'resolved').length,
      streakDays: calcStreak()
    }
    data.value.updatedAt = new Date().toISOString()
  }

  function calcStreak(): number {
    const dates = [...new Set(data.value.sessions.map(s => s.date))].sort().reverse()
    if (dates.length === 0) return 0
    let streak = 1
    const today = new Date().toISOString().slice(0, 10)
    if (dates[0] !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      if (dates[0] !== yesterday) return 0
    }
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1])
      const curr = new Date(dates[i])
      const diff = (prev.getTime() - curr.getTime()) / 86400000
      if (diff <= 1) streak++
      else break
    }
    return streak
  }

  // ---------- 计算属性 ----------
  const unresolvedWeakPoints = computed(() =>
    data.value.weakPoints.filter(w => w.status !== 'resolved')
  )

  const highPriorityWeakPoints = computed(() =>
    data.value.weakPoints
      .filter(w => w.status !== 'resolved' && w.severity === 'high')
      .sort((a, b) => b.reviewCount - a.reviewCount)
  )

  const weakPointsByTopic = computed(() => {
    const map: Record<string, WeakPoint[]> = {}
    data.value.weakPoints.forEach(wp => {
      if (!map[wp.topic]) map[wp.topic] = []
      map[wp.topic].push(wp)
    })
    return map
  })

  const subjectMeta = computed(() => SUBJECT_META[currentSubject.value])

  // 初始化加载
  loadFromJson('cs408')

  return {
    currentSubject,
    data,
    loading,
    subjectMeta,
    unresolvedWeakPoints,
    highPriorityWeakPoints,
    weakPointsByTopic,
    switchSubject,
    loadFromJson,
    addWeakPoint,
    updateWeakPointStatus,
    removeWeakPoint,
    addSession,
    saveLocal
  }
})
