// 王道刷题小程序「错题重练卷」种子数据 · 公共工厂
// 数据来源：小程序导出记录 3400 / 3401 / 3402（计组，各30题）
// 章节归类：按王道《计算机组成原理》七章体系，根据题目考点人工归类

export interface WangdaoWrongSeed {
  id: string
  chapterId: string
  chapterName: string
  sectionId: string
  sectionName: string
  title: string
  content: string
  mistakeType: string
  importance: number
  correction: string
  createdAt: string
  reviewCount: number
  lastReviewAt: string
  mastered: boolean
  subject: string
}

const CHAPTER_NAMES: Record<string, string> = {
  ch1: '第一章 计算机系统概述',
  ch2: '第二章 数据的表示和运算',
  ch3: '第三章 存储系统',
  ch4: '第四章 指令系统',
  ch5: '第五章 中央处理器',
  ch6: '第六章 总线',
  ch7: '第七章 输入/输出系统'
}

const CREATED_AT = '2026-08-31T10:00:00.000Z'

/**
 * 紧凑工厂：P(卷号, 题号, 章, 小节, 标题, 题干+选项, 答案, 解析)
 * - id 规则：wd_cs_卷号_题号（跨卷不冲突）
 * - 统考真题自动 5 星重要度，其余 3 星
 */
export const P = (
  record: string,
  no: number,
  chapterId: string,
  sectionName: string,
  title: string,
  content: string,
  answer: string,
  analysis: string
): WangdaoWrongSeed => ({
  id: `wd_cs_${record}_${String(no).padStart(2, '0')}`,
  chapterId,
  chapterName: CHAPTER_NAMES[chapterId],
  sectionId: chapterId,
  sectionName,
  title,
  content,
  mistakeType: '概念不清',
  importance: title.includes('统考真题') ? 5 : 3,
  correction: `正确答案：${answer}\n解析：${analysis}`,
  createdAt: CREATED_AT,
  reviewCount: 0,
  lastReviewAt: '',
  mastered: false,
  subject: '408计算机'
})
