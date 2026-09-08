/**
 * 英语阅读 · 干扰项套路分类学（trapTaxonomy）
 *
 * 数据源：reading-questions.json 的 analysis 字段中已埋好的
 * 「【套路标签】选项字母」标记（如「【无中生有】B」），共 26 种字面标签。
 * 本模块将其归一映射到《英语阅读方法论手册》第八章的 11 大错误套路体系，
 * 并提供定位提示、同义改写对的正则抽取。个人版 / 共享版两站共用，
 * 不依赖任何个人作答数据（userAnswer），共享版可安全使用。
 *
 * 注意：一道题的一个干扰项可能同时命中多个套路（手册频率合计 109.9%），
 * 因此所有抽取结果均为「多标签」结构。
 */

export type TrapId =
  | 'degree'        // 偷换程度
  | 'concept'       // 偷换概念
  | 'fabricated'    // 无中生有
  | 'reverse'       // 正反颠倒
  | 'patchwork'     // 拼凑歪曲
  | 'partial'       // 以偏概全
  | 'commonsense'   // 常识套用
  | 'timeline'      // 时间线错乱
  | 'absolute'      // 绝对化表述
  | 'mixed'         // 虚实混杂
  | 'overinfer'     // 过度推理

export interface TrapMeta {
  id: TrapId
  name: string
  /**
   * 《糖三角》讲义第八章给出的方法论参考频率（%，多标签口径，合计 109.9）。
   * 注意：这是三师方法论层面的通用规律，并非本题库 reading-questions.json
   * 的实测分布——真题解析的【标签】词表并未细分到「偷换程度/时间线/虚实混杂」
   * 三类（其语义多被「偷换概念/正反颠倒」吸收），故这三类在题库实测中计数常为 0。
   * 网站端的套路统计一律用 countTraps() 的实时计数，此 freq 仅作 tooltip 教学参考。
   */
  freq: number
  /** 主题色（chip / 统计条使用） */
  color: string
  /** 一句话识别信号 */
  sign: string
}

/** 11 大套路元信息，按手册频率降序 */
export const TRAP_LIST: TrapMeta[] = [
  { id: 'degree',      name: '偷换程度',   freq: 28.3, color: '#e5484d', sign: '范围/数量/程度副词被悄悄改动（some→all、may→must）' },
  { id: 'concept',     name: '偷换概念',   freq: 26.1, color: '#f76b15', sign: '主语/对象/因果被替换，看似相关实则张冠李戴' },
  { id: 'fabricated',  name: '无中生有',   freq: 18.7, color: '#f5a623', sign: '原文完全没提，或答非所问、无关信息凑数' },
  { id: 'reverse',     name: '正反颠倒',   freq: 10.5, color: '#8e4ec6', sign: '与原文事实方向相反，支持变反对、肯定变否定' },
  { id: 'patchwork',   name: '拼凑歪曲',   freq: 6.8,  color: '#3e63dd', sign: '原文词都有，但东拼西凑、歪曲原意' },
  { id: 'partial',     name: '以偏概全',   freq: 4.9,  color: '#30a46c', sign: '用局部/个别情况回答整体问题，范围过大或过小' },
  { id: 'commonsense', name: '常识套用',   freq: 4.3,  color: '#0091ff', sign: '用生活常识替代原文依据，"听起来对"但文中没说' },
  { id: 'timeline',    name: '时间线错乱', freq: 3.7,  color: '#12a594', sign: '过去/现在/将来被偷换，已发生变未发生' },
  { id: 'absolute',    name: '绝对化表述', freq: 2.6,  color: '#e93d82', sign: 'must/never/only/all 等绝对词，原文留有余地' },
  { id: 'mixed',       name: '虚实混杂',   freq: 2.1,  color: '#6e56cf', sign: '真实细节包裹虚假结论，半对半错最难防' },
  { id: 'overinfer',   name: '过度推理',   freq: 1.9,  color: '#696969', sign: '在原文基础上多推了一步，推理题最常见陷阱' }
]

export const TRAP_META: Record<TrapId, TrapMeta> = TRAP_LIST.reduce((acc, t) => {
  acc[t.id] = t
  return acc
}, {} as Record<TrapId, TrapMeta>)

/**
 * 字面标签 → 套路 id 的别名映射。
 * 覆盖 JSON 中实际扫出的全部 26 种标签（含错别字变体），
 * 并天然过滤掉「【选项中文翻译】」「【定位与答案】」等段落标题
 * （它们后面不跟选项字母，OPTION_TAG_RE 不会命中）。
 */
const ALIASES: Array<[RegExp, TrapId]> = [
  [/偷换程度|程度偷换/, 'degree'],
  [/绝对|范围过大|范围扩大/, 'absolute'],
  [/时间|时态/, 'timeline'],
  [/正反|反向|颠倒|相反/, 'reverse'],
  [/因果倒置/, 'reverse'],
  [/以偏概全|断章取义|片面/, 'partial'],
  [/无中生有|答非所问|无关/, 'fabricated'],
  [/常识|望文生义/, 'commonsense'],
  [/过度推理|推理过度/, 'overinfer'],
  [/拼凑|东拼西凑|细节干扰|以例证例/, 'patchwork'],
  [/虚实|混杂/, 'mixed'],
  // 兜底类放最后：偷换概念/张冠李戴/曲解文意/词汇干扰等
  [/偷换|概念|张冠李戴|曲解|词汇|烦扰/, 'concept']
]

/** 单个字面标签 → 套路 id（未知标签返回 null） */
function normalizeTag(tag: string): TrapId | null {
  for (const [re, id] of ALIASES) {
    if (re.test(tag)) return id
  }
  return null
}

/**
 * 匹配「【标签】(选项|干扰项)? 字母」。
 * 兼容「【反向干扰，偷换概念】D」这类逗号粘连多标签（按标签内部拆分）。
 */
const OPTION_TAG_RE = /【([^】]{1,24})】\s*(?:选项|干扰项?)?\s*([A-D])/g

export interface OptionTrap {
  option: string          // 选项字母 A-D
  label: string           // 原始字面标签
  traps: TrapId[]         // 归一后的套路（可能多个）
}

/**
 * 从 analysis 文本抽取「选项字母 → 套路」映射。
 * 返回按选项字母排序的去重结果；同一字母多次命中会合并。
 */
export function extractOptionTraps(analysis?: string | null): OptionTrap[] {
  if (!analysis) return []
  const byOption = new Map<string, { labels: string[]; traps: Set<TrapId> }>()
  OPTION_TAG_RE.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = OPTION_TAG_RE.exec(analysis)) !== null) {
    const rawTag = m[1].trim()
    const option = m[2]
    // 拆分逗号/顿号粘连的多标签
    const subTags = rawTag.split(/[，,、]/).map(s => s.trim()).filter(Boolean)
    const traps = new Set<TrapId>()
    for (const st of subTags) {
      const id = normalizeTag(st)
      if (id) traps.add(id)
    }
    if (traps.size === 0) continue
    if (!byOption.has(option)) byOption.set(option, { labels: [], traps: new Set() })
    const entry = byOption.get(option)!
    entry.labels.push(rawTag)
    traps.forEach(t => entry.traps.add(t))
  }
  return [...byOption.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([option, e]) => ({ option, label: e.labels.join('，'), traps: [...e.traps] }))
}

/**
 * 抽取本题涉及的全部套路（所有被标记选项的并集，去重、按手册频率降序）。
 * 用于题目卡片的「套路 chips」行。
 */
export function extractQuestionTraps(analysis?: string | null): TrapId[] {
  const set = new Set<TrapId>()
  for (const ot of extractOptionTraps(analysis)) ot.traps.forEach(t => set.add(t))
  return [...set].sort((a, b) => TRAP_META[b].freq - TRAP_META[a].freq)
}

export interface TrapStat {
  meta: TrapMeta
  /** 命中该套路的题目数（多标签口径，一题命中多个套路会在各类各计一次） */
  count: number
}

/**
 * 聚合一批题目的套路命中分布（多标签口径）。
 * 返回按实测 count 降序、已过滤掉 count=0 的类别，直接供统计面板渲染。
 * 面板标题应写「你的真题库 · 套路命中分布」，与手册的方法论参考频率区分开。
 */
export function countTraps(
  items: Array<{ analysis?: string | null }>,
  filter?: (item: { analysis?: string | null }, index: number) => boolean
): TrapStat[] {
  const counter: Record<string, number> = {}
  items.forEach((item, i) => {
    if (filter && !filter(item, i)) return
    for (const t of extractQuestionTraps(item.analysis)) counter[t] = (counter[t] || 0) + 1
  })
  return TRAP_LIST
    .map(meta => ({ meta, count: counter[meta.id] || 0 }))
    .filter(s => s.count > 0)
    .sort((a, b) => b.count - a.count)
}

/**
 * 抽取定位提示：优先「N段N句」，退化到「第N段」。
 * location 字段目前全空，故一律从 analysis 文本抽取。
 */
export function extractLocateHint(analysis?: string | null): string[] {
  if (!analysis) return []
  const hints: string[] = []
  const re1 = /([1-9一二三四五六七八九十])\s*段\s*([1-9一二三四五六七八九十])\s*句/g
  let m: RegExpExecArray | null
  while ((m = re1.exec(analysis)) !== null) {
    const h = `第${m[1]}段第${m[2]}句`
    if (!hints.includes(h)) hints.push(h)
  }
  if (hints.length === 0) {
    const re2 = /第\s*([1-9一二三四五六七八九十]+)\s*段/g
    while ((m = re2.exec(analysis)) !== null) {
      const h = `第${m[1]}段`
      if (!hints.includes(h)) hints.push(h)
    }
  }
  return hints.slice(0, 4)
}

export interface SynonymPair {
  a: string   // 题干/选项侧表述
  b: string   // 原文侧表述
}

/**
 * 抽取最可靠的同义改写「词对」信号。
 * 真题解析里同义写法极自由（93 题含「同义」字样），精准抽词对不可靠，
 * 这里只抓两类高置信模式：
 *   (a) 英文等号链：notice=perceive=be aware of —— 直接给出同义词链；
 *   (b) 「X 与 Y 为/是同义(替换)」—— 中英文短语对。
 * 抽不到词对时用 detectSynonymSignal() 兜底点亮信号。
 */
export function extractSynonymPairs(analysis?: string | null): SynonymPair[] {
  if (!analysis) return []
  const pairs: SynonymPair[] = []
  const push = (a: string, b: string) => {
    a = a.trim(); b = b.trim()
    if (a && b && a !== b && !pairs.some(p => p.a === a && p.b === b)) pairs.push({ a, b })
  }
  // (a) 英文等号链 A=B=C，逐段两两成对
  const eqRe = /([A-Za-z][A-Za-z'’\- ]*[A-Za-z])(?:\s*=\s*([A-Za-z][A-Za-z'’\- ]*[A-Za-z]))+/g
  let m: RegExpExecArray | null
  while ((m = eqRe.exec(analysis)) !== null) {
    const chain = m[0].split('=').map(s => s.trim()).filter(Boolean)
    for (let i = 0; i < chain.length - 1; i++) push(chain[i], chain[i + 1])
  }
  // (b) X 与 Y 为/是同义(替换/转述)
  const relRe = /([^。；;，,\n]{1,28}?)\s*(?:与|和)\s*(?:原文[^。；;，,\n]{0,30}中的\s*)?([^。；;，,\n]{1,28}?)\s*(?:为|是|属于|构成)\s*同义/g
  while ((m = relRe.exec(analysis)) !== null) push(m[1], m[2])
  return pairs.slice(0, 4)
}

/**
 * 高覆盖检测：本题解析是否涉及「同义替换/转述/复现」这一核心考点。
 * 用于视角条点亮 🔁 信号（覆盖率约 93/840，远高于精准词对）。
 */
export function detectSynonymSignal(analysis?: string | null): boolean {
  if (!analysis) return false
  return /同义\s*(?:替换|转述|复现|改写|词|关系|重现)/.test(analysis)
    || /[A-Za-z][A-Za-z'’\- ]*\s*=\s*[A-Za-z]/.test(analysis)
}

/** 题型 → 手册解题要诀一句话（视角条「题型」chip 的 tooltip） */
export const TYPE_TIPS: Record<string, string> = {
  '细节理解': '先题干后原文，定位句就是答案句，警惕同义改写',
  '推理判断': '推理 ≤ 一步，答案就在原文附近，别自己脑补',
  '逻辑关系': '完型主战场：先判句间关系（转折/因果/并列/让步）再选词',
  '词汇语义': '词义题答案由上下文决定，代入原句验证方向一致',
  '语义理解': '读懂指代与省略，把抽象表述还原成具体所指',
  '固定搭配': '优先验证搭配习惯，其次看语境方向',
  '主旨大意': '串各段首末句，转折后是重点，别选局部细节',
  '态度观点': '抓形容词/副词/情态动词，作者态度多在转折后',
  '时间顺序': '盯紧时间状语，过去/现在/将来不可偷换',
  '篇章结构': '判断段落功能：举例证观点、转折引主旨、让步防绝对'
}
