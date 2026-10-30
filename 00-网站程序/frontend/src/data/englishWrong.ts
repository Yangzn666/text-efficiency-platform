// 英语一错题自动沉淀
//
// 病根：英语错题本一直是空壳（"做题时拍照发给 QoderWork 录入"），
// 而站点里其实早就躺着 860 道真题的作答记录（data/english/reading/index.json 每题带
// correctAnswer + userAnswer），做错的题从来没进过错题本，也没人按题型统计过错因。
//
// 这里做三件事：
//   1) 读 index.json，叠加浏览器里更新的作答（ReadingPractice 写 localStorage:readingUserAnswers）
//   2) 把 userAnswer 存在且 ≠ correctAnswer 的题映射成站统一错题模型（wrongProblems store 的 english 桶）
//   3) 暴露"重新同步"入口——以后在精读页每做错一道，回这本账就自动多一条，不用再手动录
import type { WrongProblem } from './wrongProblemTypes'

const ANSWERS_KEY = 'readingUserAnswers'
const INDEX_PATH = 'data/english/reading/index.json'
export const readingQuestionIndexUrl = () => `${(import.meta as any).env?.BASE_URL || '/'}${INDEX_PATH}`

interface RawQuestion {
  year: number
  section: string
  textNumber?: number
  title?: string
  number: number
  type?: string
  stem?: string
  options?: { label: string; text: string }[]
  correctAnswer?: string
  userAnswer?: string
  location?: string
}

export interface EnglishWrongSeed extends WrongProblem {
  rawKey: string
  stemText: string
  options: { label: string; text: string }[]
  yourAnswer: string
  rightAnswer: string
}

let cache: EnglishWrongSeed[] | null = null
let inflight: Promise<EnglishWrongSeed[]> | null = null

const SECTION_LABEL: Record<string, string> = {
  'Use of English': '完形填空',
  'Traditional Reading': '传统阅读',
  'New Question Types': '新题型',
  'Translation': '翻译',
}
const sectionLabel = (s: string) => SECTION_LABEL[s] || s || '其他'

/** 浏览器里后写的作答优先于 JSON 里打包时的作答 */
function localAnswers(): Record<string, string> {
  try {
    const raw = localStorage.getItem(ANSWERS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const keyOf = (q: RawQuestion) => `${q.year}-${q.section}-${q.textNumber ?? 0}-${q.number}`

function toSeed(q: RawQuestion, your: string): EnglishWrongSeed {
  const id = `eng-${keyOf(q).replace(/[^0-9A-Za-z]+/g, '-')}`
  const optText = (label?: string) => {
    const hit = (q.options || []).find(o => o.label === label)
    return hit ? `${label} ${hit.text}` : (label || '—')
  }
  return {
    id,
    rawKey: keyOf(q),
    subject: 'english',
    chapterId: `eng-${q.year}-${q.section}`,
    sectionId: `eng-${q.year}-${q.section}-${q.textNumber ?? 0}`,
    chapterName: `${q.year} 年 · ${sectionLabel(q.section)}${q.textNumber ? ` 篇${q.textNumber}` : ''}`,
    sectionName: q.title || '',
    title: `${q.year} ${sectionLabel(q.section)} 第 ${q.number} 题${q.type ? ` · ${q.type}` : ''}`,
    content: q.stem || '',
    stemText: q.stem || '',
    options: q.options || [],
    mistakeType: q.type || '未标注题型',
    // 错题本里最有用的两行：你当时选了句什么话、正确选项是哪句话（原话级，不是"粗心"）
    correction: `应选 ${optText(q.correctAnswer)}　｜　你选 ${optText(your)}`,
    yourAnswer: your,
    rightAnswer: q.correctAnswer || '',
    importance: 4,
    mastered: false,
    correctStreak: 0,
    reviewCount: 0,
    createdAt: '',
    lastReviewAt: '',
  }
}

/** 拉取并沉淀英语错题（幂等：同一会话只发一次请求；force 可重拉） */
export function loadEnglishWrongSeeds(force = false): Promise<EnglishWrongSeed[]> {
  if (cache && !force) return Promise.resolve(cache)
  if (inflight && !force) return inflight
  inflight = (async () => {
    const res = await fetch(readingQuestionIndexUrl())
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const questions: RawQuestion[] = data.questions || []
    const ans = localAnswers()
    cache = questions
      .map(q => {
        const your = ans[keyOf(q)] || q.userAnswer || ''
        const right = q.correctAnswer || ''
        return your && right && your !== right ? toSeed(q, your) : null
      })
      .filter((x): x is EnglishWrongSeed => !!x)
    return cache
  })()
  return inflight
}

/** 题型错因分布：细节题错 50 次和主旨题错 9 次，补救动作完全不同 */
export function englishCauseDistribution(list: EnglishWrongSeed[]) {
  const m: Record<string, number> = {}
  list.forEach(p => { m[p.mistakeType] = (m[p.mistakeType] || 0) + 1 })
  return Object.entries(m).map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
}

export function englishYearDistribution(list: EnglishWrongSeed[]) {
  const m: Record<string, number> = {}
  list.forEach(p => {
    const y = (p.chapterName || '').split(' 年')[0]
    m[y] = (m[y] || 0) + 1
  })
  return Object.entries(m).map(([year, count]) => ({ year, count }))
    .sort((a, b) => (a.year < b.year ? -1 : 1))
}

// ---------- 按年份懒加载解析（by-year/<year>.json 以 rawKey 为键） ----------
export interface EnglishDetail {
  article?: string
  analysis?: string
  errorAnalysis?: Record<string, string>
  tips?: string
}

const detailCache = new Map<string, Record<string, EnglishDetail>>()

/** 拉某一年全部题目详情（含原文/解析），同一会话只拉一次；走 SW 运行时缓存，第二次离线秒开 */
export async function loadEnglishYearDetail(year: string | number): Promise<Record<string, EnglishDetail>> {
  const y = String(year)
  if (detailCache.has(y)) return detailCache.get(y)!
  const base = (import.meta as any).env?.BASE_URL || '/'
  const res = await fetch(`${base}data/english/reading/by-year/${y}.json`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  detailCache.set(y, data)
  return data
}

/** 取单题详情：rawKey 形如 2008-Traditional Reading-1-40 */
export async function getEnglishDetail(year: string | number, rawKey: string): Promise<EnglishDetail | null> {
  try {
    const data = await loadEnglishYearDetail(year)
    return data[rawKey] || null
  } catch {
    return null
  }
}

/** 把解析 HTML 里的标签/内联样式剥掉，只留能读的正文 */
export function stripHtml(html?: string): string {
  if (!html) return ''
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\/\*(?:[^*]|\*[^/])*\*\//g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

