import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 408 强化追踪数据引擎（费曼学习法进度矩阵）
 * 设计原则：纯前端 + localStorage 持久化
 * - 四门课（数据结构/计组/操作系统/网络）共用一套章节矩阵
 * - 每章四个维度：听课 / 费曼讲解 / 刷题正确率 / 错题补讲
 * - 章节完成定义：听课✅ + 讲解✅ + 正确率≥70% + 错题已补讲 → 整行变绿
 * - 漏洞清单：自动汇总所有「费曼讲解有卡点」的章节
 */

// ==================== 类型定义 ====================
export type ReinforceSubjectKey = 'ds' | 'co' | 'os' | 'net'

/** 听课状态：未开始 / 进行中 / 完成 */
export type ListenStatus = 'none' | 'doing' | 'done'
/** 费曼讲解状态：待讲 / 有卡点 / 通过 */
export type FeynmanStatus = 'todo' | 'stuck' | 'pass'
/** 错题补讲状态：待补 / 已补 */
export type CorrectionStatus = 'todo' | 'done'

export interface ChapterProgress {
  id: string
  name: string
  listen: ListenStatus
  feynman: FeynmanStatus
  /** 刷题正确率 0-100，0 表示尚未刷题 */
  accuracy: number
  correction: CorrectionStatus
}

export interface SubjectMeta {
  key: ReinforceSubjectKey
  name: string
  short: string
  color: string
  icon: string
}

// ==================== 科目与章节配置 ====================
export const SUBJECTS: SubjectMeta[] = [
  { key: 'ds', name: '数据结构', short: '数据结构', color: '#409EFF', icon: '🌲' },
  { key: 'co', name: '计算机组成原理', short: '计组', color: '#67C23A', icon: '🔧' },
  { key: 'os', name: '操作系统', short: '操作系统', color: '#E6A23C', icon: '💻' },
  { key: 'net', name: '计算机网络', short: '网络', color: '#F56C6C', icon: '🌐' }
]

const CHAPTERS: Record<ReinforceSubjectKey, string[]> = {
  ds: [
    '第1章 绪论',
    '第2章 线性表',
    '第3章 栈、队列和数组',
    '第4章 串',
    '第5章 树与二叉树',
    '第6章 图',
    '第7章 查找',
    '第8章 排序'
  ],
  co: [
    '第1章 计算机系统概述',
    '第2章 数据的表示和运算',
    '第3章 存储系统',
    '第4章 指令系统',
    '第5章 中央处理器',
    '第6章 总线',
    '第7章 输入/输出系统'
  ],
  os: [
    '第1章 操作系统概述',
    '第2章 进程管理',
    '第3章 内存管理',
    '第4章 文件管理',
    '第5章 输入/输出(I/O)管理'
  ],
  net: [
    '第1章 计算机网络体系结构',
    '第2章 物理层',
    '第3章 数据链路层',
    '第4章 网络层',
    '第5章 传输层',
    '第6章 应用层'
  ]
}

const STORAGE_KEY = 'reinforcement-progress-v1'

// ==================== 工具函数 ====================
function buildInitial(): Record<ReinforceSubjectKey, ChapterProgress[]> {
  const result = {} as Record<ReinforceSubjectKey, ChapterProgress[]>
  ;(Object.keys(CHAPTERS) as ReinforceSubjectKey[]).forEach(key => {
    result[key] = CHAPTERS[key].map((name, i) => ({
      id: `${key}-ch${i + 1}`,
      name,
      listen: 'none',
      feynman: 'todo',
      accuracy: 0,
      correction: 'todo'
    }))
  })
  return result
}

/** 章节是否达成完成定义 */
export function isChapterDone(c: ChapterProgress): boolean {
  return c.listen === 'done' && c.feynman === 'pass' && c.accuracy >= 70 && c.correction === 'done'
}

// ==================== Store ====================
export const useReinforcementStore = defineStore('reinforcement', () => {
  const data = ref<Record<ReinforceSubjectKey, ChapterProgress[]>>(buildInitial())

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return
      const parsed = JSON.parse(saved) as Record<ReinforceSubjectKey, ChapterProgress[]>
      // 合并：保留新增章节，兼容旧数据
      ;(Object.keys(data.value) as ReinforceSubjectKey[]).forEach(key => {
        if (Array.isArray(parsed[key])) {
          data.value[key] = data.value[key].map(ch => {
            const found = parsed[key].find(p => p.id === ch.id)
            return found ? { ...ch, ...found } : ch
          })
        }
      })
    } catch {
      /* 忽略损坏数据 */
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.value))
  }

  // ---------- 状态切换 ----------
  function cycleListen(c: ChapterProgress) {
    const order: ListenStatus[] = ['none', 'doing', 'done']
    c.listen = order[(order.indexOf(c.listen) + 1) % order.length]
    save()
  }

  function cycleFeynman(c: ChapterProgress) {
    const order: FeynmanStatus[] = ['todo', 'stuck', 'pass']
    c.feynman = order[(order.indexOf(c.feynman) + 1) % order.length]
    save()
  }

  function cycleCorrection(c: ChapterProgress) {
    c.correction = c.correction === 'done' ? 'todo' : 'done'
    save()
  }

  function setAccuracy(c: ChapterProgress, value: number) {
    c.accuracy = Math.max(0, Math.min(100, Math.round(value)))
    save()
  }

  // ---------- 统计 ----------
  function subjectStats(key: ReinforceSubjectKey) {
    const list = data.value[key]
    const total = list.length
    const done = list.filter(isChapterDone).length
    return { total, done, percent: total ? Math.round((done / total) * 100) : 0 }
  }

  /** 漏洞清单：所有费曼讲解有卡点的章节 */
  const weakChapters = computed(() => {
    const result: { subject: SubjectMeta; chapter: ChapterProgress }[] = []
    SUBJECTS.forEach(meta => {
      data.value[meta.key].forEach(ch => {
        if (ch.feynman === 'stuck') {
          result.push({ subject: meta, chapter: ch })
        }
      })
    })
    return result
  })

  const overallStats = computed(() => {
    let total = 0
    let done = 0
    SUBJECTS.forEach(meta => {
      const s = subjectStats(meta.key)
      total += s.total
      done += s.done
    })
    return { total, done, percent: total ? Math.round((done / total) * 100) : 0 }
  })

  function resetSubject(key: ReinforceSubjectKey) {
    data.value[key] = buildInitial()[key]
    save()
  }

  load()

  return {
    data,
    weakChapters,
    overallStats,
    cycleListen,
    cycleFeynman,
    cycleCorrection,
    setAccuracy,
    subjectStats,
    resetSubject,
    save
  }
})
