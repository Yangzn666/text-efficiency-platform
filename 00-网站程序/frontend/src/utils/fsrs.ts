/**
 * FSRS-5 (Free Spaced Repetition Scheduler) 算法实现
 *
 * 基于 FSRS-5 论文，用于费曼学习法薄弱点的间隔复习调度。
 * 核心思想：根据每次复习的评分（Again/Hard/Good/Easy）动态调整
 * 卡片的难度(Difficulty)和稳定性(Stability)，从而计算最优复习间隔。
 */

// ==================== 常量 ====================

/** 衰减系数 */
const DECAY = -0.5

/** 因子：19/81 ≈ 0.2346 */
const FACTOR = 19 / 81

/** 目标保留率（90%概率回忆成功） */
const REQUEST_RETENTION = 0.9

/**
 * FSRS-5 默认权重参数 w[0]~w[17]
 * 来源：FSRS-5 论文默认值
 */
const W = [
  0.55,   // w[0]  - 难度更新权重
  0.7,    // w[1]  - 评分对难度的影响
  0.0,    // w[2]  - （保留，未使用）
  0.0,    // w[3]  - （保留，未使用）
  1.01,   // w[4]  - 遗忘后难度更新系数
  0.18,   // w[5]  - 遗忘后评分影响
  0.65,   // w[6]  - 遗忘后难度偏移
  0.57,   // w[7]  - 初始难度计算参数
  1.58,   // w[8]  - 稳定性增长基础系数
  0.09,   // w[9]  - 难度对稳定性增长的影响
  0.2,    // w[10] - 保留率对稳定性增长的影响
  1.25,   // w[11] - 保留率补偿系数
  0.31,   // w[12] - 稳定性衰减系数
  0.37,   // w[13] - 稳定性衰减指数
  1.06,   // w[14] - 遗忘后稳定性基础系数
  0.26,   // w[15] - 遗忘后难度影响
  0.22,   // w[16] - 遗忘后原稳定性影响
  0.44,   // w[17] - 遗忘后保留率影响
]

/**
 * 初始稳定性 S0(G)，对应评分 G=1,2,3,4
 * 单位：天
 */
const S0 = [0.4, 0.6, 2.4, 5.8]

// ==================== 类型定义 ====================

/** 卡片状态 */
export type CardState = 'new' | 'learning' | 'review' | 'relearning'

/** 评分等级：1=Again(忘了), 2=Hard(模糊), 3=Good(记得), 4=Easy(秒杀) */
export type Grade = 1 | 2 | 3 | 4

/** FSRS 卡片状态数据 */
export interface FSRSState {
  /** 难度 D，范围 [1, 10] */
  difficulty: number
  /** 稳定性 S，单位：天 */
  stability: number
  /** 距上次复习已过天数 */
  elapsedDays: number
  /** 计划的复习间隔天数 */
  scheduledDays: number
  /** 总复习次数 */
  reps: number
  /** 遗忘次数（评分=1） */
  lapses: number
  /** 当前卡片状态 */
  state: CardState
  /** 上次复习时间 (ISO 日期字符串) */
  lastReview: string | null
  /** 下次到期时间 (ISO 日期字符串) */
  due: string | null
}

// ==================== 工具函数 ====================

/** 将数值限制在 [min, max] 区间 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/** 将日期增加指定天数，返回 ISO 字符串 */
function addDays(date: Date, days: number): string {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result.toISOString()
}

/** 将日期增加指定分钟数，返回 ISO 字符串 */
function addMinutes(date: Date, minutes: number): string {
  const result = new Date(date)
  result.setMinutes(result.getMinutes() + minutes)
  return result.toISOString()
}

// ==================== 核心算法 ====================

/**
 * 计算初始难度 D0(G)
 * 公式：D0(G) = 4 - exp(w[7] * (G-1)) + 1
 * 限制在 [1, 10] 范围
 */
function initDifficulty(grade: Grade): number {
  const d = 4 - Math.exp(W[7] * (grade - 1)) + 1
  return clamp(d, 1, 10)
}

/**
 * 计算复习后的新难度 D'
 * 对于成功复习 (grade >= 2)：
 *   D' = w[0] * (D - w[1] * (G-1)) + (1 - w[0]) * 5
 * 对于遗忘 (grade = 1)：
 *   D' = w[4] * D - w[5] * (G-1) + w[6]
 * 限制在 [1, 10] 范围
 */
function nextDifficulty(current: number, grade: Grade): number {
  if (grade === 1) {
    // 遗忘：难度上升
    const d = W[4] * current - W[5] * (grade - 1) + W[6]
    return clamp(d, 1, 10)
  }
  // 成功复习：难度向均值5回归
  const d = W[0] * (current - W[1] * (grade - 1)) + (1 - W[0]) * 5
  return clamp(d, 1, 10)
}

/**
 * 计算成功复习后的新稳定性 S'（recall stability）
 * 公式：
 *   S_r = D * (exp(w[8]) - 1) * exp(w[9] * (11 - D))
 *         * exp(w[10] * (R - 1)) * (exp(w[11] * (1 - R)) - 1)
 *         / (exp(w[12] * S^(-w[13])) - 1) + 1
 *
 * 其中 R = REQUEST_RETENTION
 */
function nextRecallStability(d: number, s: number, r: number): number {
  const sr =
    d *
    (Math.exp(W[8]) - 1) *
    Math.exp(W[9] * (11 - d)) *
    Math.exp(W[10] * (r - 1)) *
    (Math.exp(W[11] * (1 - r)) - 1) /
    (Math.exp(W[12] * Math.pow(s, -W[13])) - 1) +
    1
  return Math.max(0.1, sr)
}

/**
 * 计算遗忘后的新稳定性 S_f（forgetting stability）
 * 公式：
 *   S_f = w[14] * D^(-w[15]) * ((S+1)^w[16] - 1) * exp(w[17] * (1 - R))
 */
function nextForgetStability(d: number, s: number, r: number): number {
  const sf =
    W[14] *
    Math.pow(d, -W[15]) *
    (Math.pow(s + 1, W[16]) - 1) *
    Math.exp(W[17] * (1 - r))
  return Math.max(0.1, sf)
}

/**
 * 根据稳定性计算复习间隔（天）
 * 公式：interval = max(1, round(S * ln(R) / ln(0.9)))
 * 其中 R = REQUEST_RETENTION = 0.9
 */
function calcInterval(stability: number): number {
  const interval = stability * Math.log(REQUEST_RETENTION) / Math.log(0.9)
  return Math.max(1, Math.round(interval))
}

// ==================== 公开函数 ====================

/**
 * 创建新卡片的初始 FSRS 状态
 */
export function createNewCard(): FSRSState {
  return {
    difficulty: 0,
    stability: 0,
    elapsedDays: 0,
    scheduledDays: 0,
    reps: 0,
    lapses: 0,
    state: 'new',
    lastReview: null,
    due: null
  }
}

/**
 * 调度卡片复习 —— FSRS-5 核心调度函数
 *
 * @param current  当前卡片的 FSRS 状态
 * @param grade    本次评分：1=Again(忘了), 2=Hard(模糊), 3=Good(记得), 4=Easy(秒杀)
 * @param now      当前时间，默认为 new Date()
 * @returns        更新后的 FSRS 状态
 */
export function scheduleCard(current: FSRSState, grade: Grade, now?: Date): FSRSState {
  const currentTime = now || new Date()
  const R = REQUEST_RETENTION

  // 复制当前状态
  const next: FSRSState = { ...current }
  next.reps++
  next.lastReview = currentTime.toISOString()

  // ------ 新卡片：首次学习 ------
  if (current.state === 'new') {
    next.difficulty = initDifficulty(grade)
    next.stability = S0[grade - 1]

    if (grade <= 2) {
      // Again 或 Hard：进入学习状态，短间隔
      next.state = 'learning'
      const minutes = grade === 1 ? 5 : 10
      next.due = addMinutes(currentTime, minutes)
      next.scheduledDays = 0
    } else {
      // Good 或 Easy：直接进入复习状态
      next.state = 'review'
      const interval = calcInterval(next.stability)
      next.scheduledDays = interval
      next.due = addDays(currentTime, interval)
    }
    next.elapsedDays = 0
    return next
  }

  // ------ 学习中 / 重新学习中 ------
  if (current.state === 'learning' || current.state === 'relearning') {
    next.difficulty = nextDifficulty(current.difficulty, grade)

    if (grade <= 2) {
      // Again / Hard：继续学习，短间隔
      next.state = current.state // 保持 learning 或 relearning
      const minutes = grade === 1 ? 5 : 10
      next.due = addMinutes(currentTime, minutes)
      next.scheduledDays = 0
    } else {
      // Good / Easy：毕业进入 review
      next.state = 'review'
      // 更新稳定性：从学习状态毕业时使用初始稳定性的加权值
      if (grade === 3) {
        next.stability = Math.max(current.stability, S0[2]) // Good 至少用 S0[3]=2.4
      } else {
        next.stability = Math.max(current.stability, S0[3]) // Easy 至少用 S0[4]=5.8
      }
      const interval = calcInterval(next.stability)
      next.scheduledDays = interval
      next.due = addDays(currentTime, interval)
    }
    next.elapsedDays = 0
    return next
  }

  // ------ 复习状态 (review) ------
  if (current.state === 'review') {
    // 计算已过天数
    if (current.lastReview) {
      const lastDate = new Date(current.lastReview)
      next.elapsedDays = Math.max(0, Math.round(
        (currentTime.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      ))
    }

    if (grade === 1) {
      // ===== 遗忘 (Again / Lapse) =====
      next.lapses++
      next.difficulty = nextDifficulty(current.difficulty, grade)
      next.stability = nextForgetStability(
        current.difficulty,
        current.stability,
        R
      )
      next.state = 'relearning'
      // 遗忘后短间隔：5分钟
      next.due = addMinutes(currentTime, 5)
      next.scheduledDays = 0
    } else {
      // ===== 成功回忆 (Hard / Good / Easy) =====
      next.difficulty = nextDifficulty(current.difficulty, grade)
      next.stability = nextRecallStability(
        next.difficulty,
        current.stability,
        R
      )
      next.state = 'review'
      const interval = calcInterval(next.stability)
      next.scheduledDays = interval
      next.due = addDays(currentTime, interval)
    }

    return next
  }

  // 兜底：不应到达此处
  return next
}

/**
 * 获取距下次复习的天数
 * 返回 0 表示已到期或即将到期
 */
export function getNextInterval(state: FSRSState): number {
  if (!state.due) return 0
  const now = new Date()
  const dueDate = new Date(state.due)
  const diffMs = dueDate.getTime() - now.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return Math.max(0, Math.ceil(diffDays))
}

/**
 * 检查卡片是否已到期（今天需要复习）
 */
export function isCardDue(state: FSRSState, now?: Date): boolean {
  if (!state.due) return true // 新卡片没有到期日，视为需要复习
  const currentTime = now || new Date()
  const dueDate = new Date(state.due)
  return dueDate.getTime() <= currentTime.getTime()
}

/**
 * 获取卡片的人类可读状态信息
 */
export function getCardStatus(state: FSRSState): { label: string; color: string; nextReview: string } {
  // 状态标签
  const stateLabels: Record<CardState, string> = {
    new: '新卡片',
    learning: '学习中',
    review: '复习中',
    relearning: '重新学习'
  }

  const stateColors: Record<CardState, string> = {
    new: '#409EFF',
    learning: '#E6A23C',
    review: '#67C23A',
    relearning: '#F56C6C'
  }

  // 下次复习时间
  let nextReview = '未安排'
  if (state.due) {
    const dueDate = new Date(state.due)
    const now = new Date()
    const diffMs = dueDate.getTime() - now.getTime()
    const diffDays = diffMs / (1000 * 60 * 60 * 24)

    if (diffMs <= 0) {
      nextReview = '已到期'
    } else if (diffDays < 1) {
      const hours = Math.ceil(diffMs / (1000 * 60 * 60))
      nextReview = `${hours}小时后`
    } else if (diffDays < 30) {
      nextReview = `${Math.ceil(diffDays)}天后`
    } else {
      nextReview = dueDate.toLocaleDateString('zh-CN')
    }
  }

  return {
    label: stateLabels[state.state],
    color: stateColors[state.state],
    nextReview
  }
}
