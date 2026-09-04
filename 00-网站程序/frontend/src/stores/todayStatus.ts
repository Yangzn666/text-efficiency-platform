import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { isCloudSyncEnabled, pullFromCloud, pushToCloudDebounced } from '@/utils/cloudSync'

/**
 * 今日状态页数据引擎
 * 设计原则：纯前端计算 + localStorage 持久化
 * - 打开页面即根据「剩余章节 + 剩余天数」自动算出今日任务，不依赖后台服务
 * - 任务完成打勾 → 自动推进进度指针
 * - 某天没完成 → 未完成量自动累积到第二天（欠账机制）
 * - 打卡链：每天完成≥1项即点亮，断链警告
 */

// ==================== 类型定义 ====================
export type SubjectKey = 'math' | 'cs408' | 'english' | 'politics'

export interface SubjectPlan {
  key: SubjectKey
  name: string
  color: string
  icon: string
  /** 总任务单元数（章节/讲/篇） */
  totalUnits: number
  /** 每天应完成的单元数 */
  dailyQuota: number
  /** 单个任务单元的预计用时（分钟），用于每日时间预算与任务时长标注 */
  estMinutes: number
  /** 已完成的单元数（进度指针） */
  completedUnits: number
  /** 计划开始日期 YYYY-MM-DD（用于计算应达进度） */
  startDate: string
  /** 目标完成日期 YYYY-MM-DD（该科目全部单元应完成的日期，用于反推应达进度） */
  targetDate: string
  /** 是否启用（未启动的科目如政治可先关闭） */
  active: boolean
  /** 生成单个任务标题的模板，{n} 为单元序号 */
  unitLabel: (n: number) => string
}

export interface DailyTask {
  id: string
  subject: SubjectKey
  subjectName: string
  color: string
  title: string
  unitIndex: number
  done: boolean
}

interface DayRecord {
  /** 当天完成的任务数 */
  completedCount: number
  /** 当天日期 YYYY-MM-DD */
  date: string
}

/** 备考里程碑（阶段节点）：已完成的阶段标记 done，未完成的 date 为目标启动/节点日期 */
export interface Milestone {
  id: string
  title: string
  /** YYYY-MM-DD：已完成则为完成日期，未完成则为目标日期 */
  date: string
  /** 关联科目（用于配色/图标），可选 */
  subject?: SubjectKey
  done: boolean
  /** 该阶段要做的事的简要说明 */
  note?: string
}

// ==================== 工具函数 ====================
const todayStr = (): string => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const daysBetween = (from: string, to: string): number => {
  const a = new Date(from).getTime()
  const b = new Date(to).getTime()
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}

// ==================== 考试日期 ====================
// 27考研初试：2026年12月19日（官方考试日期）
const DEFAULT_EXAM_DATE = '2026-12-19'
/** 旧默认考试日期：用于识别当年使用默认值的存档，迁移到正式日期 */
const OLD_DEFAULT_EXAM_DATE = '2026-12-26'

const STORAGE_KEY = 'today-status-v2'
/** 计划配置版本：调高后强制使用新默认计划（进度模型重建时升级） */
const PLAN_VERSION = 4

export const useTodayStatusStore = defineStore('todayStatus', () => {
  // ---------- 持久化状态 ----------
  const examDate = ref<string>(DEFAULT_EXAM_DATE)
  /** 各科计划（含进度指针） */
  const plans = ref<SubjectPlan[]>([])
  /** 每日完成记录：{ [date]: DayRecord } */
  const dailyRecords = ref<Record<string, DayRecord>>({})
  /** 今日已勾选的任务单元索引：{ [subject]: number[] } */
  const todayDone = ref<Record<string, number[]>>({})
  /** 今日日期标记（用于跨天重置今日勾选） */
  const todayKey = ref<string>(todayStr())
  /** 每日任务快照：当天首次打开时生成一份固定清单，勾选只打勾不重生 */
  const taskSnapshot = ref<{ date: string, version: number, items: Omit<DailyTask, 'done'>[] }>({ date: '', version: 0, items: [] })
  /** 备考里程碑（阶段节点） */
  const milestones = ref<Milestone[]>([])

  // ---------- 初始化默认计划（备考全程模型：totalUnits 覆盖基础→强化→真题→冲刺全周期） ----------
  const initDefaultPlans = () => {
    plans.value = [
      {
        key: 'math',
        name: '数学一',
        color: '#67C23A',
        icon: '📐',
        totalUnits: 158,
        dailyQuota: 1,
        estMinutes: 100,
        completedUnits: 143,
        startDate: '2026-05-01',
        targetDate: '2026-12-12',
        active: true,
        unitLabel: (n) => {
          if (n <= 30) return `基础30讲 第${n}讲`
          if (n <= 48) return `武忠详强化 第${n - 30}讲`
          if (n <= 66) return `1000题A组 高数第${n - 48}讲`
          if (n <= 75) return `1000题A组 线代第${n - 66}讲`
          if (n <= 84) return `1000题A组 概率第${n - 75}讲`
          if (n <= 101) return `1000题B组 高数第${n - 84}讲`
          if (n <= 107) return `1000题B组 线代第${n - 101}讲`
          if (n <= 110) return `1000题B组 概率第${n - 107}讲`
          if (n <= 111) return `1000题B组 高数第18讲`
          if (n <= 114) return `1000题B组 线代第${n - 105}讲`
          if (n <= 120) return `1000题B组 概率第${n - 111}讲`
          if (n <= 130) return `660题 第${n - 120}章 + 错题回顾`
          if (n <= 140) return `李林880 第${n - 130}章`
          if (n <= 158) return `真题套卷 第${n - 140}套（限时3h + 订正）`
          return `数学冲刺回顾`
        }
      },
      {
        key: 'cs408',
        name: '408计算机',
        color: '#409EFF',
        icon: '💻',
        totalUnits: 74,
        dailyQuota: 1,
        estMinutes: 150,
        completedUnits: 49,
        startDate: '2026-07-01',
        targetDate: '2026-12-12',
        active: true,
        unitLabel: (n) => {
          if (n <= 40) return `基础轮 第${n}章`
          if (n <= 66) return `王道大题强化 第${n - 40}章（费曼讲解→大题）`
          if (n <= 74) return `王道26模拟卷 第${n - 66}套`
          return `408冲刺回顾`
        }
      },
      {
        key: 'english',
        name: '英语一',
        color: '#E6A23C',
        icon: '📖',
        totalUnits: 147,
        dailyQuota: 1,
        estMinutes: 75,
        completedUnits: 22,
        startDate: '2026-06-15',
        targetDate: '2026-12-15',
        active: true,
        unitLabel: (n) => {
          if (n <= 4) return `单词 第${n}轮`
          if (n <= 14) return `语法长难句 第${n - 4}讲`
          if (n <= 102) return `英一真题 第${n - 14}篇精读（生词+长难句）`
          if (n <= 116) return `新题型 第${n - 102}篇`
          if (n <= 126) return `翻译 第${n - 116}篇`
          if (n <= 136) return `作文 第${n - 126}个模块`
          if (n <= 147) return `套卷模考 第${n - 136}套`
          return `英语冲刺回顾`
        }
      },
      {
        key: 'politics',
        name: '政治',
        color: '#F56C6C',
        icon: '🚩',
        totalUnits: 62,
        dailyQuota: 1,
        estMinutes: 50,
        completedUnits: 0,
        startDate: '2026-07-15',
        targetDate: '2026-12-15',
        active: true,
        unitLabel: (n) => {
          if (n <= 30) return `徐涛强化 第${n}讲 + 肖1000对应章节`
          if (n <= 50) return `肖1000 第${n - 30}章（二刷错题）`
          if (n <= 58) return `肖八 第${n - 50}套（选择题+订正）`
          if (n <= 62) return `肖四 第${n - 58}套（选择+背大题）`
          return `政治冲刺回顾`
        }
      }
    ]
  }

  // ---------- 初始化默认里程碑（阶段节点：已完成 + 未来关键节点） ----------
  const initDefaultMilestones = () => {
    milestones.value = [
      { id: 'm-xiandai-done', title: '线代强化完成', date: '2026-07-26', subject: 'math', done: true, note: '线性代数强化阶段收尾' },
      { id: 'm-ds-reinforce-done', title: '数据结构强化完成', date: '2026-08-11', subject: 'cs408', done: true, note: '除大题外全部完成，大题放408大题最后' },
      { id: 'm-math-papers-09-11', title: '数学真题09-11完成', date: '2026-08-11', subject: 'math', done: true, note: '09-11年真题刷完，11年错题明天整理' },
      { id: 'm-co-reinforce-start', title: '计组错题一刷完成', date: '2026-09-01', subject: 'cs408', done: true, note: '王道小程序93道计组错题一轮过完，背诵手册建成，待二刷验收' },
      { id: 'm-politics-mayuan', title: '政治·马原启动', date: '2026-08-01', subject: 'politics', done: false, note: '徐涛强化+肖1000马原部分，重理解轻死记' },
      { id: 'm-eng-writing', title: '英语·作文翻译启动', date: '2026-09-01', subject: 'english', done: false, note: '整理作文模板，翻译真题穿插练采分点' },
      { id: 'm-xiao8', title: '肖八上市·刷选择题', date: '2026-11-01', subject: 'politics', done: false, note: '肖八选择题+大题框架，时政起步' },
      { id: 'm-xiao4', title: '肖四上市·背大题', date: '2026-12-01', subject: 'politics', done: false, note: '肖四大题背诵+时政收尾' }
    ]
  }

  // ---------- 加载 / 保存 ----------
  /** 从解析后的数据对象恢复状态（本地与云端共用） */
  const restoreFromData = (data: any) => {
    // 考试日期：仍使用旧默认值（12-26）的存档迁移到正式日期 12-19；用户自定义日期保留
    examDate.value = (data.examDate && data.examDate !== OLD_DEFAULT_EXAM_DATE) ? data.examDate : DEFAULT_EXAM_DATE
    dailyRecords.value = data.dailyRecords || {}
    todayDone.value = data.todayDone || {}
    todayKey.value = data.todayKey || todayStr()
    taskSnapshot.value = data.taskSnapshot || { date: '', version: 0, items: [] }
    // 恢复计划：计划版本过旧时使用新默认（进度模型重建），否则合并已存进度
    initDefaultPlans()
    if ((data.planVersion || 0) >= PLAN_VERSION && Array.isArray(data.plans)) {
      data.plans.forEach((saved: any) => {
        const p = plans.value.find(x => x.key === saved.key)
        if (p) {
          p.totalUnits = saved.totalUnits ?? p.totalUnits
          p.dailyQuota = saved.dailyQuota ?? p.dailyQuota
          p.completedUnits = saved.completedUnits ?? p.completedUnits
          p.startDate = saved.startDate ?? p.startDate
          p.targetDate = saved.targetDate ?? p.targetDate
          p.active = saved.active ?? p.active
        }
      })
    }

    // 恢复里程碑：先置默认，再按 id 叠加已存的 done/date，最后追加用户自定义节点
    initDefaultMilestones()
    if (Array.isArray(data.milestones)) {
      const savedMap = new Map<string, any>(data.milestones.map((m: any) => [m.id, m]))
      milestones.value = milestones.value.map(def => {
        const s = savedMap.get(def.id)
        return s ? { ...def, done: s.done ?? def.done, date: s.date ?? def.date, note: s.note ?? def.note } : def
      })
      const defIds = new Set(milestones.value.map(m => m.id))
      data.milestones.forEach((s: any) => { if (s && s.id && !defIds.has(s.id)) milestones.value.push(s) })
    }
  }

  /** 加载收尾：跨天重置今日勾选 + 生成当日任务快照（快照格式升级时也强制重生） */
  const finalizeLoad = () => {
    if (todayKey.value !== todayStr()) {
      todayKey.value = todayStr()
      todayDone.value = {}
    }
    if (taskSnapshot.value.date !== todayStr() || (taskSnapshot.value.version || 0) < SNAPSHOT_VERSION) {
      generateSnapshot()
      save()
    }
  }

  const load = async () => {
    let localData: any = null
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) localData = JSON.parse(raw)
    } catch (e) {
      console.error('读取本地数据失败', e)
    }

    if (localData) {
      restoreFromData(localData)
    } else {
      initDefaultPlans()
      initDefaultMilestones()
    }
    finalizeLoad()

    // 云同步：若已配置且云端数据更新，以云端为准（单用户最后写入胜出）
    if (isCloudSyncEnabled) {
      const remote = await pullFromCloud()
      if (remote && remote.data && remote.updatedAt > (localData?._updatedAt || '')) {
        restoreFromData(remote.data)
        finalizeLoad()
      }
    }
  }

  const save = () => {
    try {
      const data: any = {
        planVersion: PLAN_VERSION,
        examDate: examDate.value,
        dailyRecords: dailyRecords.value,
        todayDone: todayDone.value,
        todayKey: todayKey.value,
        taskSnapshot: taskSnapshot.value,
        // 只存可序列化的进度字段
        plans: plans.value.map(p => ({
          key: p.key,
          totalUnits: p.totalUnits,
          dailyQuota: p.dailyQuota,
          estMinutes: p.estMinutes,
          completedUnits: p.completedUnits,
          startDate: p.startDate,
          targetDate: p.targetDate,
          active: p.active
        })),
        milestones: milestones.value,
        _updatedAt: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      // 已配置云同步时防抖推送到云端
      pushToCloudDebounced(data)
    } catch (e) {
      console.error('保存今日状态数据失败', e)
    }
  }

  // ==================== 倒计时 ====================
  const daysToExam = computed(() => {
    const diff = daysBetween(todayStr(), examDate.value)
    return diff > 0 ? diff : 0
  })

  // ==================== 今日任务生成器（时间预算制） ====================
  /** 快照格式版本：升级后强制重生当日快照 */
  const SNAPSHOT_VERSION = 3
  /** 每日推荐总时长预算（分钟），约 8 小时，超出则不再追加任务 */
  const DAILY_TIME_BUDGET = 480
  /** 单科单日任务上限（避免欠账一次性堆出十几条） */
  const MAX_PER_SUBJECT_PER_DAY = 2

  /**
   * 生成当日任务快照（当天首次打开或快照升级时调用）
   * 算法：
   * - 保底：每个启用科目先出 dailyQuota 个任务
   * - 追加：在时间预算内，按科目轮流为「欠账多」的科目加任务，单科封顶
   * - 每个任务带预计用时（estMinutes），全天总量可控、时长可评估
   */
  const generateSnapshot = () => {
    const today = todayStr()
    const items: Omit<DailyTask, 'done'>[] = []
    const active = plans.value.filter(p => p.active)

    const countOf: Record<string, number> = {}
    const backlogOf: Record<string, number> = {}
    let totalMinutes = 0

    // 保底：每科 dailyQuota 个任务
    active.forEach(plan => {
      const remaining = plan.totalUnits - plan.completedUnits
      if (remaining <= 0) { countOf[plan.key] = 0; return }
      const base = Math.min(plan.dailyQuota, remaining)
      countOf[plan.key] = base
      totalMinutes += base * plan.estMinutes
      const elapsed = Math.max(0, daysBetween(plan.startDate, today) + 1)
      const expected = Math.min(plan.totalUnits, elapsed * plan.dailyQuota)
      backlogOf[plan.key] = Math.max(0, expected - plan.completedUnits)
    })

    // 追加：时间预算内轮流为欠账科目加任务
    let added = true
    while (totalMinutes < DAILY_TIME_BUDGET && added) {
      added = false
      for (const plan of active) {
        if (totalMinutes >= DAILY_TIME_BUDGET) break
        const current = countOf[plan.key] || 0
        const remaining = plan.totalUnits - plan.completedUnits
        if (current >= MAX_PER_SUBJECT_PER_DAY || current >= (backlogOf[plan.key] || 0) || current >= remaining) continue
        if (totalMinutes + plan.estMinutes > DAILY_TIME_BUDGET) continue
        countOf[plan.key] = current + 1
        totalMinutes += plan.estMinutes
        added = true
      }
    }

    // 依计数生成任务清单
    plans.value.forEach(plan => {
      const count = countOf[plan.key] || 0
      for (let i = 0; i < count; i++) {
        const unitIndex = plan.completedUnits + i + 1 // 1-based 单元序号
        items.push({
          id: `${plan.key}-${unitIndex}`,
          subject: plan.key,
          subjectName: plan.name,
          color: plan.color,
          title: plan.unitLabel(unitIndex),
          unitIndex
        })
      }
    })
    taskSnapshot.value = { date: today, version: SNAPSHOT_VERSION, items }
  }

  /** 今日任务：读取当日固定快照，done 状态实时从 todayDone 派生 */
  const todayTasks = computed<DailyTask[]>(() => {
    return taskSnapshot.value.items.map(item => ({
      ...item,
      done: (todayDone.value[item.subject] || []).includes(item.unitIndex)
    }))
  })

  const todayTotal = computed(() => todayTasks.value.length)
  const todayCompleted = computed(() => todayTasks.value.filter(t => t.done).length)
  const todayProgress = computed(() =>
    todayTotal.value === 0 ? 0 : Math.round((todayCompleted.value / todayTotal.value) * 100)
  )

  // ---------- 任务时长评估 ----------
  /** 某科目单个任务的预计用时（分钟） */
  const estMinutesOf = (subject: SubjectKey): number =>
    plans.value.find(p => p.key === subject)?.estMinutes || 60

  /** 今日全部任务预计总时长（分钟） */
  const todayTotalMinutes = computed(() =>
    todayTasks.value.reduce((sum, t) => sum + estMinutesOf(t.subject), 0)
  )
  /** 今日已完成任务折算时长（分钟） */
  const todayDoneMinutes = computed(() =>
    todayTasks.value.filter(t => t.done).reduce((sum, t) => sum + estMinutesOf(t.subject), 0)
  )

  // ---------- 切换任务完成 ----------
  const toggleTask = (task: DailyTask) => {
    const key = task.subject
    if (!todayDone.value[key]) todayDone.value[key] = []
    const arr = todayDone.value[key]
    const idx = arr.indexOf(task.unitIndex)

    if (idx === -1) {
      // 标记完成
      arr.push(task.unitIndex)
      // 推进进度指针：只有当完成的是「最靠前的未完成单元」时才推进 completedUnits
      const plan = plans.value.find(p => p.key === key)
      if (plan) {
        // 连续完成才推进指针（保证任务列表稳定）
        while (arr.includes(plan.completedUnits + 1)) {
          plan.completedUnits++
        }
      }
      // 记录当日完成数
      recordCompletion()
    } else {
      // 取消完成
      arr.splice(idx, 1)
      const plan = plans.value.find(p => p.key === key)
      if (plan && task.unitIndex <= plan.completedUnits) {
        plan.completedUnits = task.unitIndex - 1
      }
      // 减少当日记录
      const rec = dailyRecords.value[todayStr()]
      if (rec && rec.completedCount > 0) rec.completedCount--
    }
    save()
  }

  const recordCompletion = () => {
    const today = todayStr()
    if (!dailyRecords.value[today]) {
      dailyRecords.value[today] = { date: today, completedCount: 0 }
    }
    dailyRecords.value[today].completedCount++
  }

  // ==================== 打卡链 ====================
  /** 连续学习天数（从今天往前数，断链即停） */
  const streak = computed(() => {
    let count = 0
    const d = new Date()
    // 如果今天还没完成任何任务，从昨天开始数（保住"昨天"的链）
    const todayRec = dailyRecords.value[todayStr()]
    if (!todayRec || todayRec.completedCount === 0) {
      d.setDate(d.getDate() - 1)
    }
    while (true) {
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const key = `${y}-${m}-${day}`
      const rec = dailyRecords.value[key]
      if (rec && rec.completedCount > 0) {
        count++
        d.setDate(d.getDate() - 1)
      } else {
        break
      }
    }
    return count
  })

  /** 最近 N 天的热力图数据（含今天） */
  const heatmap = computed(() => {
    const days: { date: string; count: number; label: string }[] = []
    const N = 30
    const d = new Date()
    for (let i = 0; i < N; i++) {
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const key = `${y}-${m}-${day}`
      const rec = dailyRecords.value[key]
      days.unshift({
        date: key,
        count: rec ? rec.completedCount : 0,
        label: `${m}-${day}`
      })
      d.setDate(d.getDate() - 1)
    }
    return days
  })

  /** 本周完成率 */
  const weekCompletion = computed(() => {
    const d = new Date()
    let total = 0
    let doneDays = 0
    for (let i = 0; i < 7; i++) {
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const key = `${y}-${m}-${day}`
      const rec = dailyRecords.value[key]
      if (rec && rec.completedCount > 0) doneDays++
      total++
      d.setDate(d.getDate() - 1)
    }
    return Math.round((doneDays / total) * 100)
  })

  // ==================== 进度预警 ====================
  interface ProgressWarn {
    key: SubjectKey
    name: string
    color: string
    icon: string
    actual: number      // 实际进度 %
    expected: number    // 应达进度 %
    status: 'ok' | 'behind' | 'critical' | 'notstart'
    completedUnits: number
    totalUnits: number
  }

  const progressWarnings = computed<ProgressWarn[]>(() => {
    const today = todayStr()
    return plans.value.map(plan => {
      const actual = Math.round((plan.completedUnits / plan.totalUnits) * 100)
      // 应达进度：按「开始日期 → 目标完成日期」的时间比例（每科自己的节奏）
      const totalSpan = Math.max(1, daysBetween(plan.startDate, plan.targetDate))
      const elapsed = Math.max(0, daysBetween(plan.startDate, today))
      const expected = Math.min(100, Math.round((elapsed / totalSpan) * 100))

      let status: ProgressWarn['status'] = 'ok'
      if (!plan.active) {
        status = 'notstart'
      } else if (plan.completedUnits === 0 && expected > 0) {
        // 本应已启动却零进度（如政治未启动）→ 红色警告
        status = 'critical'
      } else if (actual < expected - 15) {
        status = 'critical'
      } else if (actual < expected - 5) {
        status = 'behind'
      }

      return {
        key: plan.key,
        name: plan.name,
        color: plan.color,
        icon: plan.icon,
        actual,
        expected,
        status,
        completedUnits: plan.completedUnits,
        totalUnits: plan.totalUnits
      }
    })
  })

  // ==================== 整体备考进度（按考试科目分值加权） ====================
  /** 科目分值权重：数学一150 + 408 150 + 英语一100 + 政治100 = 500 分 */
  const SCORE_WEIGHTS: Record<SubjectKey, number> = { math: 150, cs408: 150, english: 100, politics: 100 }

  /**
   * 整体备考进度 = 各科实际完成率按科目分值加权平均
   * - actual：真正完成的备考任务量占比（替代旧版“只看时间流逝比例”的算法）
   * - expected：按各科自身节奏（startDate→targetDate）折算到当前应达进度
   */
  const overallPrep = computed(() => {
    const today = todayStr()
    const totalWeight = plans.value.reduce((s, p) => s + (SCORE_WEIGHTS[p.key] || 100), 0)
    let actual = 0
    let expected = 0
    for (const p of plans.value) {
      const w = (SCORE_WEIGHTS[p.key] || 100) / totalWeight
      actual += (p.completedUnits / p.totalUnits) * w
      const span = Math.max(1, daysBetween(p.startDate, p.targetDate))
      const elapsed = Math.max(0, Math.min(span, daysBetween(p.startDate, today)))
      expected += (elapsed / span) * w
    }
    return { actual: Math.round(actual * 100), expected: Math.round(expected * 100) }
  })

  // ---------- 修改计划（供设置面板用） ----------
  const updatePlan = (key: SubjectKey, patch: Partial<{
    totalUnits: number; dailyQuota: number; completedUnits: number; startDate: string; targetDate: string; active: boolean
  }>) => {
    const p = plans.value.find(x => x.key === key)
    if (p) {
      Object.assign(p, patch)
      save()
    }
  }

  const setExamDate = (date: string) => {
    examDate.value = date
    save()
  }

  // ==================== 备考里程碑 ====================
  /** 里程碑（按日期升序，附 daysUntil：正=还有多少天，负=已过多少天） */
  const milestoneRows = computed(() => {
    const today = todayStr()
    return milestones.value
      .map(m => ({ ...m, daysUntil: daysBetween(today, m.date) }))
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
  })

  /** 最近的下一个未完成里程碑 */
  const nextMilestone = computed(() => milestoneRows.value.find(m => !m.done) || null)

  const toggleMilestone = (id: string) => {
    const m = milestones.value.find(x => x.id === id)
    if (m) {
      m.done = !m.done
      save()
    }
  }

  return {
    // 状态
    examDate,
    plans,
    dailyRecords,
    todayDone,
    // 倒计时
    daysToExam,
    // 任务
    todayTasks,
    todayTotal,
    todayCompleted,
    todayProgress,
    estMinutesOf,
    todayTotalMinutes,
    todayDoneMinutes,
    toggleTask,
    // 打卡链
    streak,
    heatmap,
    weekCompletion,
    // 预警
    progressWarnings,
    overallPrep,
    // 操作
    load,
    save,
    updatePlan,
    setExamDate,
    // 里程碑
    milestones,
    milestoneRows,
    nextMilestone,
    toggleMilestone
  }
})
