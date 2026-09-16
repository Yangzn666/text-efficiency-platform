/**
 * 英语阅读 · 每题「思考路径」生成器（thinkingPath）
 *
 * 方法论来源：颉斌斌阅读三步走 —— 理解题目（读九项 / 选项求同存异）
 * → 精准定位（S 型定位法 / 题文同序）→ 选项比错（找错误而非找正确 / 范围定律），
 * 外加复盘四件事。本模块把这套流程按「题型」定制成一条可视化的解题思路，
 * 并复用 trapTaxonomy 从 analysis 抽取的真实信号（定位句、各选项套路、同义改写），
 * 让每道题都得到「遇到它该怎么一步步想」的具体路径，而非空泛模板。
 *
 * 只依赖 type + analysis，不读取 userAnswer，个人版 / 共享版两站共用。
 */

import {
  TRAP_META,
  extractLocateHint,
  extractOptionTraps,
  extractSynonymPairs,
  detectSynonymSignal
} from './trapTaxonomy'

export interface PathStep {
  no: string        // 步序徽标，如「1」
  icon: string      // 步骤图标
  title: string     // 步骤名，如「审题干 · 求同存异」
  method: string    // 通用方法说明（题型定制）
  detail?: string   // 本题专属抽取结果（定位句 / 各选项套路 / 同义链）
  detailHtml?: boolean // detail 是否含 HTML（同义链用 <b>）
}

/** 主旨类题型（颉斌斌：主旨题不靠定位，靠串读+读九项） */
const MAIN_IDEA_TYPES = new Set(['主旨大意', '篇章结构'])
/** 完型类题型（逻辑/搭配/词义辨析，定位=空格前后句） */
const CLOZE_TYPES = new Set(['逻辑关系', '固定搭配', '介词辨析', '语法结构'])
/** 词义类题型（熟词僻义高发区） */
const WORD_TYPES = new Set(['词义辨析', '词汇辨析', '词义猜测'])

/** 第 1 步 · 审题干：按题型定制「这题到底在问什么」 */
const TYPE_PROBE: Record<string, string> = {
  '细节理解': '题干问「原文哪句是对的」——问什么答什么，别被关键词带跑。先圈题干限定词（often / recently / usually / only），它们常是命题人埋的雷区。',
  '推理判断': '题干含 imply / infer / suggest / learn / conclude——推理题其实不推理：答案只是原文的近义改写，最多往前推一步，谁「说得最满」谁先排除。',
  '主旨大意': '题干含 main idea / best title / purpose / mainly about——问的是全文中心，不定位单句。用「读九项」圈各题干重复出现的名词=主旨词，再串各段首末句定方向。',
  '态度观点': '题干问 attitude / tone / view / feel——抓形容词、副词、情态动词（should / must / may），作者真实态度多藏在转折词（but / however）之后。',
  '篇章结构': '问段落功能或文章组织方式——判断该段是「举例证观点」「转折引主旨」还是「让步防绝对」，例子永远服务于它前后的观点句。',
  '词义辨析': '问某词 / 短语在文中的含义——答案由上下文决定，警惕熟词僻义（一个词你认识不代表这里考你熟悉的意思），把选项代回原句验证感情方向一致。',
  '词汇辨析': '问某词 / 短语在文中的含义——答案由上下文决定，警惕熟词僻义，把选项代回原句验证感情方向一致。',
  '词义猜测': '问某生词 / 指代的意思——靠上下文的解释、举例、同复现、转折反义来猜，别指望认识这个词，答案线索一定在附近句。',
  '逻辑关系': '完型主战场——先判空格前后两句的逻辑关系（转折 / 因果 / 并列 / 让步 / 递进），关系一旦定死，正确答案往往唯一。',
  '固定搭配': '完型题——先验证「搭配习惯」（这个动词 / 形容词习惯接哪个介词或名词），搭配成立再看语境方向是否吻合。',
  '介词辨析': '完型题——先看介词与前后动词 / 名词的固定搭配，再用句间逻辑排除，多数空靠「搭配」而非「翻译」就能定。',
  '语法结构': '完型题——先判句子缺什么成分（主 / 谓 / 宾 / 连词 / 关系词），成分需求定了，再在符合语法的选项里挑语境方向对的。'
}

/** 第 2 步 · 精准定位：按大类定制定位策略 */
function locateStrategy(type: string): string {
  if (MAIN_IDEA_TYPES.has(type)) {
    return '主旨 / 结构题不靠定位单句！串读各段首句 + 末段总结，圈题干重复名词=主旨词，重点读转折（but / however）后的句子，方向定了主旨就定了。'
  }
  if (CLOZE_TYPES.has(type)) {
    return '定位到空格所在句，重点精读空格前后各一句：判断句间逻辑、寻找同复现词与固定搭配，答案线索几乎都在这一句的紧邻上下文里。'
  }
  if (WORD_TYPES.has(type)) {
    return '定位到该词所在句，往前后各延伸一句：找解释、举例、同义复现或转折反义。词义由语境方向（正 / 负）决定，不由你的第一印象决定。'
  }
  return 'S 型定位法：先按「题文同序」锁定题目对应的段落，段内第一行从右往左、第二行从左往右扫读，只找不读，锁定含题干关键词「同义替换」的那一句——它才是出题句。'
}

/** 第 3 步 · 选项比错：通用铁律 */
const COMPARE_METHOD =
  '做题不是找正确答案，而是找错误选项并排除——找错远比找对简单。逐个选项对照出题句：命中「无中生有 / 偷换概念 / 正反颠倒 / 过度推理 / 以偏概全」立即排除。剩两个相近选项时，用范围定律：谁的范围更大、更贴合原文口径，就选谁。'

/** 第 4 步 · 复盘四件事（颉斌斌，做完一篇必过一遍） */
export const REVIEW_FOUR: string[] = [
  '定位句在哪里？为什么是这句、不是那句？',
  '题干真正问的是什么？我有没有被某个关键词带跑？',
  '错选项到底错在哪？（无中生有 / 偷换概念 / 范围扩大 / 强加因果 / 答非所问）',
  '这篇文章的主旨词是什么？作者方向是正是负？'
]

/**
 * 生成一道题的四步思考路径。
 * @param q reading-questions.json 里的单个 question 对象
 */
export function buildThinkingPath(q: any): PathStep[] {
  const type: string = q?.type || ''
  const analysis: string = q?.analysis || ''

  // 第 1 步 · 审题干
  const probe = TYPE_PROBE[type] ||
    '先读懂题干在问什么：问「为什么」就别去找「怎么做」。题干信息不足时，把四个选项求同存异，找出它们的差异点（动词 / 方向 / 范围），差异点就是考点。'

  // 第 2 步 · 精准定位（附本题抽取到的定位句）
  const locs = extractLocateHint(analysis)
  const locateDetail = locs.length
    ? `本题解析定位：${locs.join(' / ')}`
    : '本题解析未标注明确「N 段 N 句」，按上述策略 + 题干关键词回原文自行锁定出题句。'

  // 第 3 步 · 选项比错（附各选项命中的套路 + 同义改写链）
  const optTraps = extractOptionTraps(analysis)
  let compareDetail = ''
  if (optTraps.length) {
    const seg = optTraps
      .map(ot => `${ot.option}：${ot.traps.map(t => TRAP_META[t].name).join('、')}`)
      .join('　')
    compareDetail = `本题各干扰项套路 → ${seg}。`
  }
  const pairs = extractSynonymPairs(analysis)
  if (pairs.length) {
    compareDetail += `正确项常是原文的同义改写：<b>${pairs.map(p => `${p.a} ≈ ${p.b}`).join('；')}</b>`
    return [
      { no: '1', icon: '🔍', title: '审题干 · 求同存异', method: probe },
      { no: '2', icon: '📍', title: '精准定位 · S 型扫描', method: locateStrategy(type), detail: locateDetail },
      { no: '3', icon: '⚖️', title: '选项比错 · 找错误而非找正确', method: COMPARE_METHOD, detail: compareDetail, detailHtml: true },
      { no: '4', icon: '🔁', title: '复盘四件事', method: REVIEW_FOUR.map((s, i) => `${i + 1}. ${s}`).join('\n') }
    ]
  }
  if (detectSynonymSignal(analysis)) {
    compareDetail += '本题涉及同义替换：正确项往往是原文那句话「换了说法、意思不变」的改写，认准改写、警惕原词照抄。'
  }

  return [
    { no: '1', icon: '🔍', title: '审题干 · 求同存异', method: probe },
    { no: '2', icon: '📍', title: '精准定位 · S 型扫描', method: locateStrategy(type), detail: locateDetail },
    { no: '3', icon: '⚖️', title: '选项比错 · 找错误而非找正确', method: COMPARE_METHOD, detail: compareDetail || undefined },
    { no: '4', icon: '🔁', title: '复盘四件事', method: REVIEW_FOUR.map((s, i) => `${i + 1}. ${s}`).join('\n') }
  ]
}

/** 一道题是否值得展示思考路径（有任何可用信号或题型已知即展示） */
export function hasThinkingPath(q: any): boolean {
  return !!(q && (q.type || q.analysis))
}

/**
 * 精读四步法 SOP（25–30 分钟 / 篇）——用于精读面板顶部的「方法指引」。
 * 来自靶向翻译 + 选项尸检方法论，纯静态指引，两站通用。
 */
export interface IntensiveStep {
  icon: string
  title: string
  minutes: string
  how: string
}

export const INTENSIVE_SOP: IntensiveStep[] = [
  {
    icon: '📖',
    title: '第 1 步 · 裸读回顾',
    minutes: '约 5 分钟',
    how: '不查词典重读全文，给每段标功能：这是「提出观点 / 举例证明 / 转折引主旨 / 让步补充」中的哪一种？先重建文章骨架，别急着抠词。'
  },
  {
    icon: '✍️',
    title: '第 2 步 · 靶向翻译',
    minutes: '约 10 分钟',
    how: '只翻三类句子：① 错题定位句 ± 前后各一句；② 与正确选项构成同义替换的原句；③ 让你卡壳的长难句。先自己翻，再对照下方段落译文，只记录差异（从句挂错、否定范围读反、指代认错）。'
  },
  {
    icon: '🔬',
    title: '第 3 步 · 选项尸检',
    minutes: '约 8 分钟',
    how: '对每道错题：用一句话说出错误选项「错在哪个套路」（对照上方各题思考路径第 3 步），再用一句话说出正确选项对应原文哪句、做了什么同义改写。'
  },
  {
    icon: '📌',
    title: '第 4 步 · 巩固输出',
    minutes: '约 3 分钟',
    how: '把生词、长难句、踩过的套路记进笔记；再用翻译检测小程序做「中译英」默写，逼自己输出——能默出来才是真掌握。'
  }
]
