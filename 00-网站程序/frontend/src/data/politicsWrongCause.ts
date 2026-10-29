// 政治错题 · 错因客观推导 + 定位词辨析数据源
// 设计：错因一律由「正确答案 vs 您的答案」实时推导，不依赖存储的 mistakeType，
//       这样即便老浏览器已把条目播种进 localStorage，改了推导规则也会立即生效。
import type { WrongProblem } from '@/data/wrongProblemTypes'

export type CauseKey = 'single-confuse' | 'multi-over' | 'multi-under' | 'multi-both'

export interface CauseMeta {
  key: CauseKey
  label: string      // 完整标签
  short: string      // 徽章短标签
  color: string      // CSS 变量名（组件内定义）
  hex: string        // 兜底实色
  diag: string       // 病因一句话
  cure: string       // 处方一句话
}

export const CAUSE_META: Record<CauseKey, CauseMeta> = {
  'single-confuse': {
    key: 'single-confuse', label: '单选 · 概念/定位混淆', short: '定位混淆',
    color: 'var(--dg-gold)', hex: '#e6a23c',
    diag: '两个"看着都对"的项之间选反了——多半是没记住那个"最X/根本/首要/统领"的帽子该扣在谁头上。',
    cure: '给每个定位词写一句"专属判据"，靠判据作答而非语感（见「定位词速答」）。',
  },
  'multi-over': {
    key: 'multi-over', label: '多选 · 贪多（没认出干扰项）', short: '贪多',
    color: 'var(--dg-coral)', hex: '#f56c6c',
    diag: '把那个"话说太满 / 偷换概念 / 张冠李戴"的干扰项也选上了，正确项⊂你的答案。这是新思想最大失分点。',
    cure: '交卷前逐条反问"这个选项题干问的那个定位吗？话说绝没绝？"，宁缺毋滥。',
  },
  'multi-under': {
    key: 'multi-under', label: '多选 · 漏选（记不全）', short: '漏选',
    color: 'var(--dg-blue)', hex: '#409eff',
    diag: '知识点成套结论没记全，正确的不敢选，你的答案⊂正确项。',
    cure: '把"四大/五个/四个战略支撑"这类成套结论做成清单先补全，再判断。',
  },
  'multi-both': {
    key: 'multi-both', label: '多选 · 又多又漏（框架模糊）', short: '边界模糊',
    color: 'var(--dg-grey)', hex: '#909399',
    diag: '该考点整体框架没建立起来，选多也选漏。',
    cure: '回炉该节思维导图，先搭框架再刷题，别急着逐个纠错选项。',
  },
}

export const CAUSE_ORDER: CauseKey[] = ['multi-over', 'single-confuse', 'multi-under', 'multi-both']

// 解析 correction：返回正确/作答的字母集合
export function parseChoice(correction: string): { correct: string[]; mine: string[] } {
  const runs = (correction || '').match(/[A-D]+/g) || []
  const norm = (s = '') => [...new Set(s.split(''))].sort()
  return { correct: norm(runs[0]), mine: norm(runs[1]) }
}

// 由题目推导错因
export function deriveCause(p: WrongProblem): CauseKey {
  const isMulti = /_m$/.test(p.sectionId || '') || (p.content || '').includes('多选')
  const { correct, mine } = parseChoice(p.correction)
  if (!isMulti) return 'single-confuse'
  const extra = mine.filter((x) => !correct.includes(x))
  const miss = correct.filter((x) => !mine.includes(x))
  if (extra.length && miss.length) return 'multi-both'
  if (extra.length) return 'multi-over'
  if (miss.length) return 'multi-under'
  return 'multi-over'
}

// 由"正确答案字母集 + 本次作答字母集"实时推导错因（供演练室重做时使用）
export function deriveCauseFromSelection(
  correct: string[],
  mine: string[],
  isMulti: boolean
): CauseKey {
  if (!isMulti) return 'single-confuse'
  const extra = mine.filter((x) => !correct.includes(x))
  const miss = correct.filter((x) => !mine.includes(x))
  if (extra.length && miss.length) return 'multi-both'
  if (extra.length) return 'multi-over'
  if (miss.length) return 'multi-under'
  return 'multi-over'
}

export function isXxs(p: WrongProblem): boolean {
  return (p.id || '').startsWith('xxs_') || (p.chapterId || '').startsWith('xxs_')
}

// 是否多选题（章节 _m 或题干含"多选"）
export function isMulti(p: WrongProblem): boolean {
  return /_m$/.test(p.sectionId || '') || (p.content || '').includes('多选')
}

// 从 content 拆出题干与选项（A./B./C./D. 逐行）
export function parseStem(content: string): { stem: string; options: { key: string; text: string }[] } {
  const lines = (content || '').split('\n')
  const options: { key: string; text: string }[] = []
  const stemLines: string[] = []
  for (const line of lines) {
    const m = line.match(/^\s*([A-D])[\.、\)]\s*(.+)$/)
    if (m) options.push({ key: m[1], text: m[2].trim() })
    else if (options.length === 0) stemLines.push(line)
  }
  return { stem: stemLines.join('\n').trim(), options }
}

// 政治四科前缀
export const SUBJECT_OF: Record<string, { key: string; name: string }> = {
  my: { key: 'my', name: '马原' },
  sg: { key: 'sg', name: '史纲' },
  sx: { key: 'sx', name: '思修' },
  xxs: { key: 'xxs', name: '新思想' },
}
export function subjectPrefix(p: WrongProblem): string {
  const m = (p.id || '').match(/^(my|sg|sx|xxs)_/)
  return m ? m[1] : ''
}

/* ────────────────────────────────────────────────
   定位词辨析卡（新思想高频失分点）
   signal = 题干里的"提问信号词"
   answer = 唯一正确的那顶帽子
   trap   = 最容易张冠李戴的干扰项（别选）
   src    = 出处题号
   ──────────────────────────────────────────────── */
export interface TermCard {
  id: string
  topic: string   // 板块：强军 / 一国两制 / 外交 / 全面从严治党
  signal: string  // 提问信号词
  answer: string  // 正解
  trap: string    // 高频干扰（坑）
  src: string     // 出处
}

export const TERM_CARDS: TermCard[] = [
  { id: 't1', topic: '强军', signal: '强军兴军的「核心」', answer: '能打胜仗', trap: '听党指挥＝灵魂/命脉/首要；作风优良＝保证', src: '第十四章 单选1' },
  { id: 't2', topic: '强军', signal: '党对军队绝对领导的「根本制度 / 根本实现形式」', answer: '军委主席负责制', trap: '支部建在连上、政治委员制（是实现形式之一，非"根本"）', src: '第十四章 单选2' },
  { id: 't3', topic: '强军', signal: '「听党指挥」是', answer: '人民军队建设的首要、军队的命脉所在', trap: '鲜明特色和政治优势＝党对军队绝对领导本身', src: '第十四章 多选4' },
  { id: 't4', topic: '一国两制', signal: '「一国两制」方针的「最高原则」', answer: '维护国家主权、安全、发展利益', trap: '实现祖国和平统一（是目标，不是最高原则）', src: '第十五章 单选1' },
  { id: 't5', topic: '一国两制', signal: '「一国两制」的「根本宗旨」', answer: '维护国家主权、安全、发展利益 ＋ 保持港澳长期繁荣稳定', trap: '维护台海和平稳定 / 增强认同感（非宗旨）', src: '第十五章 多选3' },
  { id: 't6', topic: '一国两制', signal: '「一国」与「两制」的关系', answer: '"一国"是前提、基础、根、本；"两制"从属派生于"一国"', trap: '"两制"等量齐观、比肩并列（错，二者不对等）', src: '第十五章 多选4' },
  { id: 't7', topic: '外交', signal: '中国特色大国外交的「主线」', answer: '服务民族复兴、促进人类进步', trap: '维护世界和平、促进共同发展（是宗旨/目标）', src: '第十六章 单选1' },
  { id: 't8', topic: '外交', signal: '我国对外工作的「出发点和落脚点」', answer: '维护国家主权、安全、发展利益', trap: '推动构建人类命运共同体（是目标）', src: '第十六章 单选3' },
  { id: 't9', topic: '从严治党', signal: '深入推进党的建设的「统领」', answer: '政治建设', trap: '思想建设（是基础性建设，非统领）', src: '第十七章 单选2' },
  { id: 't10', topic: '从严治党', signal: '党内政治生活的「首要任务」', answer: '加强思想教育和理论武装', trap: '保证全党服从中央（那是"政治建设"的首要任务）', src: '第十七章 单选3' },
  { id: 't11', topic: '从严治党', signal: '党的政治建设的「首要任务」', answer: '保证全党服从中央、维护党中央权威和集中统一领导', trap: '以伟大自我革命引领伟大社会革命', src: '第十七章 多选3' },
  { id: 't12', topic: '从严治党', signal: '最彻底的自我革命是', answer: '反腐败', trap: '党风廉政建设 / 让人民监督政府', src: '第十七章 单选5' },
  { id: 't13', topic: '从严治党', signal: '新时代再塑党的形象的「第一行动」', answer: '中央八项规定', trap: '开展反腐败斗争 / 全面从严治党', src: '第十七章 单选6' },
  { id: 't14', topic: '从严治党', signal: '党的自我革命的「根本目的」', answer: '引领伟大社会革命', trap: '跳出历史周期率（是自我革命的意义/答案，非"根本目的"）', src: '第十七章 单选8' },
  { id: 't15', topic: '从严治党', signal: '全面从严治党的定位（多选）', answer: '必由之路 ＋ 鲜明主题 ＋ 伟大实践', trap: '"党的政治建设的首要任务"是干扰项（别选）', src: '第十七章 多选1' },
]
