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
const PLAN_VERSION = 12
/** 里程碑配置版本：调高后强制使用新默认里程碑（存档里的旧 done/date 不再覆盖默认值） */
const MILESTONE_VERSION = 6

// ==================== 政治串讲课结构（2026-09-16 按网盘目录逐课对账） ====================
/**
 * 课程为「考点串讲」五模块，共 58 讲（各模块末讲为阶段测试；史纲目录未见测试课，暂按 9 讲计）。
 * 网盘只给体积不给时长，按录播常见码率 1 GB ≈ 45 min 折算原始时长，再按 2 倍速折半得净看课时长：
 *   体积合计 59.4 GB → 原始 44.5 h → 2 倍速 22.3 h（平均每讲 46 min / 23 min）
 * 日后拿到真实时长只需改 rawMin，进度百分比与任务标签会自动跟着重算。
 * tags 只写中性短标签（学科术语/序号），不抄完整课名，避免敏感表述。
 */
const POLITICS_COURSE: { code: string; lessons: number; rawMin: number; tags: string[] }[] = [
  {
    code: '马原', lessons: 21, rawMin: 968, // 21.51 GB
    tags: ['导论', '哲学基本问题', '物质观', '意识与物质统一', '两大总特征', '对立统一', '质变与否定之否定', '五对范畴', '实践', '认识', '真理与价值', '历史观·社会矛盾', '社会形态·群众', '简单商品经济上', '简单商品经济下', '发达商品经济上', '发达商品经济中', '发达商品经济下', '垄断与当代资本', '科学社会主义', '阶段测试']
  },
  {
    code: '思修', lessons: 8, rawMin: 291, // 6.46 GB
    tags: ['绪论·人生观', '理想信念', '中国精神', '核心价值', '道德', '法律特征与运行', '宪法权威', '阶段测试']
  },
  {
    code: '史纲', lessons: 9, rawMin: 583, // 12.96 GB
    tags: ['近代磨难与抗争', '出路早期探索', '辛亥革命', '新文化·五四·建党', '革命新局面', '革命新道路', '抗战', '解放战争·建国', '新中国时期']
  },
  {
    code: '毛中特', lessons: 7, rawMin: 285, // 6.34 GB
    tags: ['导论·思想地位', '新民主主义革命上', '新民主主义革命下', '改造理论', '建设道路探索', '理论体系', '阶段测试']
  },
  {
    code: '新思想', lessons: 13, rawMin: 545, // 12.10 GB
    tags: ['新时代总论', '中国式现代化', '领导力量·人民立场', '改革开放', '高质量发展上', '高质量发展下', '教育科技人才', '民主', '法治', '文化', '民生·生态', '内外条件', '阶段测试']
  }
]

/** 串讲课总讲数（58） */
export const POLITICS_COURSE_LESSONS = POLITICS_COURSE.reduce((s, m) => s + m.lessons, 0)
/** 串讲课原始时长（分钟，2672 ≈ 44.5 h） */
const POLITICS_COURSE_RAW_MIN = POLITICS_COURSE.reduce((s, m) => s + m.rawMin, 0)
/** 2 倍速后的净看课小时数（≈22.3 h），供页面展示 */
export const POLITICS_COURSE_HOURS_2X = Math.round(POLITICS_COURSE_RAW_MIN / 2 / 60 * 10) / 10
/** 串讲课原始时长（小时，≈44.5 h） */
export const POLITICS_COURSE_RAW_HOURS = Math.round(POLITICS_COURSE_RAW_MIN / 60 * 10) / 10
/** 政治总单元 = 串讲 58 讲（含同步一刷） + 1000 题二刷 20 章 + 肖八 8 套 + 肖四 4 套 */
const POLITICS_TOTAL_UNITS = POLITICS_COURSE_LESSONS + 20 + 8 + 4

/** 把政治串讲的单元序号翻译成「模块 + 课号 + 短标签 + 2 倍速净时长」 */
const politicsCourseUnit = (n: number) => {
  let i = n - 1
  for (const m of POLITICS_COURSE) {
    if (i < m.lessons) {
      const tag = m.tags[i] || ''
      return {
        code: m.code,
        idx: i + 1,
        total: m.lessons,
        tag,
        perMin: Math.round(m.rawMin / m.lessons / 2),
        isTest: tag.includes('测试')
      }
    }
    i -= m.lessons
  }
  return null
}

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
        // 2026-09-10 进度对账：660题主动放弃（1000题+880已够用），故不计入 totalUnits；
        // 1000题B组概率9讲因题目质量低主动放弃，同样不计入；中值定理证明题性价比低，延后为独立单元。
        // 880 的定位是「真题套卷暴露出的弱点章节」，改为按需专题而非线性推进。
        // 单指针无法表达中间有洞，故沿用「已完成单元排在前」的排序惯例。
        // 2026-09-14 更新：1000题概率基础二刷实际在推进（已到第3讲），原模型把它压在 n=133
        // 的单个单元里，导致指针落点 n=123 显示「真题套卷 剩余第1套」与实际任务不符。
        // 故按讲拆成 9 个单元并前移到 n=123~131：totalUnits 139 -> 147，completedUnits 122 -> 125。
        // 2026-09-16 更新：1000题二刷全部结束。概率基础只刷到第 4 讲（用户判断后续题目质量
        // 不高，第 5~9 讲主动放弃 -> 删掉这 5 个单元）；高数强化/线代强化/真题09-16 三块错题
        // 二刷同时收尾，按「已完成排在前」惯例前移到 n=127~129。
        // totalUnits 147 -> 142，completedUnits 125 -> 129，指针落点 n=130 = 真题套卷剩余第 1 套。
        // 2026-09-16 更新二：限时刷完 2017 年真题（n=130 就是这一套），completedUnits 129 -> 130，
        // 指针落点 n=131 = 剩余第 2 套 = 2018 年。顺手给「剩余第 n 套」补上年份，避免只报序号。
        totalUnits: 142,
        dailyQuota: 1,
        estMinutes: 100,
        completedUnits: 130,
        startDate: '2026-05-01',
        targetDate: '2026-12-12',
        active: true,
        unitLabel: (n) => {
          if (n <= 30) return `基础30讲 第${n}讲`
          if (n <= 48) return `武忠详强化 第${n - 30}讲`
          if (n <= 66) return `1000题A组基础 高数第${n - 48}讲`
          if (n <= 75) return `1000题A组基础 线代第${n - 66}讲`
          if (n <= 84) return `1000题A组基础 概率第${n - 75}讲`
          if (n <= 102) return `1000题B组强化 高数第${n - 84}讲`
          if (n <= 111) return `1000题B组强化 线代第${n - 102}讲`
          if (n <= 119) return `真题套卷 ${2008 + (n - 111)}年（限时3h + 订正）`
          if (n <= 121) return `错题二刷 ${['1000题高数基础', '1000题线代基础'][n - 120]}（已完成）`
          if (n <= 122) return `880专题 概率论（真题弱点驱动，已完成三分之二）`
          if (n <= 126) return `错题二刷 1000题概率基础 第${n - 122}讲（已完成·第5~9讲题目质量低主动放弃）`
          if (n <= 129) return `错题二刷 ${['1000题高数强化', '1000题线代强化', '真题09-16错题'][n - 127]}（已完成）`
          if (n <= 139) return `真题套卷 ${2016 + (n - 129)}年·剩余第${n - 129}套（限时3h + 订正）`
          if (n <= 141) return `880专题 ${['高数', '线代'][n - 140]}（真题暴露的弱点章节）`
          if (n <= 142) return `中值定理证明题专项（延后·性价比低）`
          return `数学冲刺回顾`
        }
      },
      {
        key: 'cs408',
        name: '408计算机',
        color: '#409EFF',
        icon: '💻',
        // 2026-09-10 进度对账：原模型只有「基础40 + 大题强化26 + 模拟卷8」，
        // 缺了实际在走的「四门强化轮」这条线（数据结构已完成、计组卡住、操作系统与网络未开始）。
        // 补入 4 个强化轮单元后 totalUnits 74 -> 78，下一任务指针正好落在计组强化。
        // 2026-09-16 更新：09-15 计组费曼复习一轮全部过完（co-01~co-07，31 问、新建 13 个 gap
        // C-035~C-047，见 feynman-review/sessions/2026-09-15.json），completedUnits 50 -> 51，
        // 指针落点 n=52 = 强化轮 操作系统。新 gap 的二刷验收归入阶段三「408 错题 / gap 回捞」。
        // 2026-09-16 更新二：OS 费曼一轮过了前三章（os-01 概述 / os-02 进程管理 / os-03 内存管理，
        // 5 个 session、23 问、新建 16 个 gap C-048~C-063，指针推到 os-04 文件管理，
        // 见 feynman-review/sessions/2026-09-16.json）。但 n=52 这一整单元要求 os-01~05 全过，
        // 单指针不能中途记分，故 completedUnits 保持 51，完成度写进 n<=52 的标签里。
        // 63 条 gap 已同步到 data/feynman/cs408.json（public 与 dist 一致）。
        totalUnits: 78,
        dailyQuota: 1,
        estMinutes: 150,
        completedUnits: 51,
        startDate: '2026-07-01',
        targetDate: '2026-12-12',
        active: true,
        unitLabel: (n) => {
          if (n <= 40) return `基础轮 第${n}章`
          if (n <= 41) return `强化轮 数据结构（除大题外全部完成）`
          if (n <= 50) return `王道大题强化 第${n - 41}章（费曼讲解→大题）`
          if (n <= 51) return `强化轮 计算机组成原理（09-15 费曼一轮过完 co-01~07·13 个新 gap 待验收）`
          if (n <= 52) return `强化轮 操作系统（费曼已过 os-01~03·16 个新 gap 待验收·指针 os-04 文件管理）`
          if (n <= 53) return `强化轮 计算机网络`
          if (n <= 70) return `王道大题强化 第${n - 53}章（费曼讲解→大题）`
          if (n <= 78) return `王道26模拟卷 第${n - 70}套`
          return `408冲刺回顾`
        }
      },
      {
        key: 'english',
        name: '英语一',
        color: '#E6A23C',
        icon: '📖',
        // 2026-09-10 进度对账：真题精读原为 88 篇笼统计数，且完型无任何对应单元（做完即蒸发）。
        // 拆成「阅读84篇 + 完型21篇」，并按 readingLog.ts 的 SEEDED_CORRECT 事实校准完成数。
        // 2026-09-14 更新一：2009 年四篇传统阅读刷完，阅读累计 12 -> 16 篇。
        // 2026-09-14 更新二：核 public/data/english/reading-questions.json 的 userAnswer 发现完型实际已做 3 篇
        // （2005 得 11/20、2006 得 13/20、2008 得 5/20，累计 29/60 = 48.3%），旧注释「2篇 24/40」是 09-10 的快照。
        // 2026-09-14 决策：2010 年及之前尚未做的完型（2007/2009/2010）主动跳过，不计入 totalUnits。
        // 理由：完型仅 10 分、每题 0.5 分，老完型题材陈旧，且 2011 年起命题重心转向逻辑衔接；
        // 同样 0.4 h 投在阅读上的边际收益是它的数倍。后期 6 套模考自带完型，届时暴露弱点再按需回补。
        // 故完型 21 篇 -> 15 篇（2011-2025），totalUnits 164 -> 161，completedUnits 32 -> 33，
        // 指针落点仍为 n=34 = 阅读第 17 篇。阅读剩余 84 - 16 = 68 篇。
        // 2026-09-16 更新：09-15 做完 2010 年前两篇传统阅读（T1《艺术报道的衰落》2/5、
        // T2《商业方法专利之争》0/5，英一史上最难年），阅读累计 16 -> 18 篇、41/90 = 45.6%。
        // completedUnits 33 -> 35，按惯例把这两篇前移为已完成单元，n<=101 的第 n-17 篇公式不变
        // （n=36 起自然对应第 19~84 篇，共 66 篇）。指针落点 n=36 = 阅读第 19 篇（2010 T3）。
        // 2026-09-16 校正：套卷模考原定 11 套，规划里已主动砍到 6 套（模考边际收益后期递减，
        // 释放的 15 h 挪给肖四大题背诵），但单元模型一直还挂着 11 个，导致网站剩余单元比手册多 5 个。
        // 本次对齐决策：totalUnits 161 -> 156（n=151~156 = 模考第 1~6 套），completedUnits 35 不变。
        // 2026-09-16 更新二：刷完 2010 年后两篇传统阅读（T3/T4），2010 年四篇收官，阅读累计 18 -> 20 篇。
        // completedUnits 35 -> 37（把 T3/T4 也前移为已完成单元），已完成的 2010 年分支放宽到 n <= 37；
        // n<=101 的「第 n-17 篇」公式无需改（n=38 自然对应第 21 篇，剩余 84-20=64 篇）。
        // 指针落点 n=38 = 阅读第 21 篇（2011 年 T1）。
        totalUnits: 156,
        dailyQuota: 1,
        estMinutes: 75,
        completedUnits: 37,
        startDate: '2026-06-15',
        targetDate: '2026-12-15',
        active: true,
        unitLabel: (n) => {
          if (n <= 4) return `单词 第${n}轮`
          if (n <= 14) return `语法长难句 第${n - 4}讲`
          if (n <= 26) return `真题阅读精读 第${n - 14}篇（2005/2006/2008 各4篇，已完成）`
          if (n <= 29) return `完型 ${[2005, 2006, 2008][n - 27]}年（已完成，累计29/60）`
          if (n <= 33) return `真题阅读精读 2009年第${n - 29}篇（已完成）`
          if (n <= 37) return `真题阅读精读 2010年第${n - 33}篇（已完成·英一最难年四篇全过，T1 2/5、T2 0/5）`
          if (n <= 101) return `真题阅读精读 第${n - 17}篇（生词+长难句+逻辑信号词）`
          if (n <= 116) return `完型 ${2011 + (n - 102)}年（逻辑衔接题为主，非词义题）`
          if (n <= 130) return `新题型 第${n - 116}篇`
          if (n <= 140) return `翻译 第${n - 130}篇（采分点拆解）`
          if (n <= 150) return `作文 第${n - 140}个模块`
          if (n <= 156) return `套卷模考 第${n - 150}套（原 11 套已主动砍到 6 套）`
          return `英语冲刺回顾`
        }
      },
      {
        key: 'politics',
        name: '政治',
        color: '#F56C6C',
        icon: '🚩',
        // 2026-09-10 进度对账：串讲 09-09 才听第1讲、09-10 第2讲，completedUnits 0 -> 2。
        // startDate 由计划值 07-15 改为真实启动日 09-09：应达刻度线才有可执行意义
        //（否则永远显示追不上的 -34%，失去指导价值）；落后 56 天这一事实记在里程碑里。
        // 2026-09-14 更新：前三课已结束，completedUnits 2 -> 3。
        // 2026-09-16 结构重建：原「30 讲」是拍脑袋的占位数，真实课程为五模块 58 讲（见 POLITICS_COURSE）。
        // 单元序号 1-58 = 串讲各讲（绑定同讲对应的 1000 题一刷），59-78 = 1000 题二刷，79-86 肖八，87-90 肖四。
        // estMinutes 50 = 视频 2 倍速平均 23 min + 对应选择题 27 min；净看课全程仅 22.3 h，瓶颈在题不在课。
        // completedUnits 3 -> 5（09-15 看完马原第 5 讲）；1000 题对应章节尚未动，故资料墙里 1000 题仍记 0。
        // 2026-09-16 更新二：看完马原第 6 讲「对立统一」（矛盾规律），completedUnits 5 -> 6。
        // 该讲对应的肖1000章节仍未动，一刷欠账随讲数累积（现欠 6 讲的选择量）。
        totalUnits: POLITICS_TOTAL_UNITS,
        dailyQuota: 1,
        estMinutes: 50,
        completedUnits: 6,
        startDate: '2026-09-09',
        targetDate: '2026-12-15',
        active: true,
        unitLabel: (n) => {
          if (n <= POLITICS_COURSE_LESSONS) {
            const u = politicsCourseUnit(n)
            if (!u) return `串讲 第${n}讲`
            const pad = String(u.idx).padStart(2, '0')
            return `串讲·${u.code} ${pad}/${u.total} ${u.tag}（2倍速约${u.perMin}min）+ ${u.isTest ? '测试卷错题回炉' : '肖1000对应章节'}`
          }
          if (n <= POLITICS_COURSE_LESSONS + 20) return `肖1000 第${n - POLITICS_COURSE_LESSONS}章（二刷错题）`
          if (n <= POLITICS_COURSE_LESSONS + 28) return `肖八 第${n - POLITICS_COURSE_LESSONS - 20}套（选择题+订正）`
          if (n <= POLITICS_COURSE_LESSONS + 32) return `肖四 第${n - POLITICS_COURSE_LESSONS - 28}套（选择+背大题）`
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
      { id: 'm-math-papers-0916', title: '数学真题09-16刷完·错题二刷', date: '2026-09-05', subject: 'math', done: true, note: '09-16年共8套限时刷完并二刷错题；真题剩10套' },
      { id: 'm-co-reinforce-start', title: '计组错题一刷完成', date: '2026-09-01', subject: 'cs408', done: true, note: '王道小程序93道计组错题一轮过完，背诵手册建成，待二刷验收' },
      { id: 'm-math-b18-xd2', title: '1000题B组高数18讲收尾·高数与线代基础二刷完成', date: '2026-09-09', subject: 'math', done: true, note: 'B组强化高数18讲、线代9讲全部完成；概率9讲因题目质量低主动放弃；660题决定不做。错题二刷已过高数基础与线代基础，错题本累计121条（高数82/线代21/概率18）' },
      { id: 'm-math-1000-done', title: '1000题二刷全部结束', date: '2026-09-16', subject: 'math', done: true, note: '高数基础/线代基础/高数强化/线代强化四块二刷全部收尾，概率基础刷到第4讲（第5~9讲因题目质量低主动放弃）；本批录入线代16条+概率9条，错题本累计146条（高数82/线代37/概率27）。数学进入真题套卷阶段，剩10套' },
      { id: 'm-math-2017', title: '数学·2017年真题限时刷完', date: '2026-09-16', subject: 'math', done: true, note: '09-16 限时 3h 刷完 2017 年数一（剩余第 1 套），第 3/6/8/10/15/16/17/18/22/23 题共 10 道错题进入录入流程。completedUnits 129→130，指针落点 n=131 = 2018 年，真题剩 9 套' },
      { id: 'm-politics-mayuan', title: '政治·串讲启动', date: '2026-09-09', subject: 'politics', done: true, note: '计划07-15启动，实际09-09启动，落后56天；90单元压缩进97天，日均0.93单元。肖1000刷题尚未开始' },
      { id: 'm-politics-course-audit', title: '政治·课程结构对账', date: '2026-09-16', subject: 'politics', done: true, note: '按网盘目录逐课核对：串讲五模块共58讲（马原21/思修8/史纲9/毛中特7/新思想13），体积59.4GB≈原始44.5h，2倍速净看课22.3h。进度模型 totalUnits 62→90、completedUnits 3→5（马原前5讲已看完，09-15 到第5讲）' },
      { id: 'm-politics-round1', title: '政治·串讲58讲+1000题一刷收尾', date: '2026-10-20', subject: 'politics', done: false, note: '剩52讲要在34天内过完=每天1.5讲（2倍速约1.4h/天）。这是政治真正的硬截止线：拖到10月下旬就没有时间做二刷和肖八，12月只能靠死背肖四' },
      { id: 'm-cs408-co-stuck', title: '408·计组强化（卡点已破）', date: '2026-09-16', subject: 'cs408', done: true, note: '09-15 计组费曼复习一轮全部过完：co-01~co-07 共 31 问，新建 13 个 gap（C-035~C-047），state.json 指针推进到 co-07。卡了两个月的计组终于推过去了。重复错 C-001（存储程序混合存放）/ C-005（执行时间是乘不是除）与 co-02 补码/IEEE754 整片薄弱是下一轮验收重点' },
      { id: 'm-eng-2010', title: '英语·2010 最难年 T1/T2 收尾', date: '2026-09-16', subject: 'english', done: true, note: 'T1 2/5、T2 0/5，阅读累计 18 篇 41/90 = 45.6%。本轮确诊跨篇系统恶习＝「选项/词在文中出现频次高就选它」（T1Q5 critics、T2Q4 legal、T2Q5 法律案件三题同栽）；铁律：高频词与论据多是例子不是答案，论点与正确答案常是抽象同义改写。熟词僻义族再添 big deal / about-face / patent' },
      { id: 'm-eng-2010-tail', title: '英语·2010 年四篇阅读收官', date: '2026-09-16', subject: 'english', done: true, note: '09-16 刷完后两篇 T3/T4，2010 年（英一史上最难年）四篇全部过完，阅读累计 20 篇。completedUnits 35→37，指针落点 n=38 = 阅读第 21 篇（2011 T1），剩余 64 篇' },
      { id: 'm-os-feynman-os123', title: '408·操作系统费曼一轮（os-01~03）', date: '2026-09-16', subject: 'cs408', done: true, note: 'OS 前三章费曼过完：5 个 session、23 问，新建 16 个 gap（C-048~C-063），gaps-408.json 累计 63 条并已同步到网站 data/feynman/cs408.json；state.json 指针推到 os-04 文件管理。命门＝内外碎片反复混淆（C-059 标 S1）、IPC 整块全忘、RR 退化误答成 SJF；C-052/C-059 为 S1，09-17 就到期。os-04/05 未动，故 n=52 这一单元仍不算完成' },
      { id: 'm-politics-mayuan-06', title: '政治·马原第6讲（对立统一）', date: '2026-09-16', subject: 'politics', done: true, note: '串讲进度 6/58，completedUnits 5→6。该讲对应的肖1000章节仍未动，一刷欠账累积到 6 讲；马原剩 15 讲是 10-20 硬截止线的主要压力源' },
      { id: 'm-eng-writing', title: '英语·作文翻译启动', date: '2026-09-01', subject: 'english', done: false, note: '已逾期。英语是当前最大缺口：剩136单元/96天=每天1.42篇，必须每天拿到2个任务槽位才做得完' },
      { id: 'm-cs408-co-done', title: '408·计组强化收尾', date: '2026-09-30', subject: 'cs408', done: false, note: '计组强化过完后依次推进操作系统、计算机网络强化' },
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
    // 里程碑版本过旧时不叠加，强制用新默认——否则存档里的旧 done 会把进度对账结果覆盖回去
    initDefaultMilestones()
    if (Array.isArray(data.milestones) && (data.milestoneVersion || 0) >= MILESTONE_VERSION) {
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
        milestoneVersion: MILESTONE_VERSION,
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
  const SNAPSHOT_VERSION = 12
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

  // ==================== 战果累计（只增不减，给焦虑时的自己看） ====================
  /** 累计有效备考天数（有完成记录的天数，从第一天打卡算起） */
  const daysTouched = computed(() =>
    Object.values(dailyRecords.value).filter(r => r && r.completedCount > 0).length
  )
  /** 累计完成的任务单元数（一格格勾掉的） */
  const totalCompletedUnits = computed(() =>
    plans.value.reduce((s, p) => s + p.completedUnits, 0)
  )
  /** 累计投入时长（小时，按各科任务预计用时折算，做题/精读口径） */
  const accumulatedHours = computed(() =>
    Math.round(plans.value.reduce((s, p) => s + p.completedUnits * (p.estMinutes || 0), 0) / 60)
  )
  /** 已完成里程碑数 / 里程碑总数 */
  const milestonesDone = computed(() => milestones.value.filter(m => m.done).length)
  const milestonesTotal = computed(() => milestones.value.length)

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
    // 战果累计
    daysTouched,
    totalCompletedUnits,
    accumulatedHours,
    milestonesDone,
    milestonesTotal,
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
