// 全站记忆卡 SRS 引擎（P4-1）· Leitner 盒间隔重复
// -----------------------------------------------------------------------------
// 目标：把已散落的「自测卡/公式/背诵」变成一套手机碎片时间可刷的间隔重复系统。
//  - 单一数据源：localStorage 键 srs-cards-v1（离线可用）；如已配置云同步则防抖推 'srs-cards' 表（未配置自动降级为纯本地）。
//  - 卡片来源用「适配器」导入：本文件内置数学速查卡（QUICK_CARDS）种子；错题→卡、其它池可通过 addCards 扩展。
//  - 调度：Leitner 5 盒，间隔 [1,2,4,7,14]→封顶30 天；again 回盒1，good +1 盒，easy +2 盒。
import { defineStore } from 'pinia'
import { reactive, computed, watch } from 'vue'
import { QUICK_CARDS, type QuickSubjectKey } from '@/data/quickCardsData'
import { pushToCloudDebounced } from '@/utils/cloudSync'

export type SrsGrade = 'again' | 'good' | 'easy'

export interface SrsCard {
  id: string            // 稳定 id：`${pool}:${srcId}`
  pool: string          // 池标识：'math-higher' | 'math-linear' | 'math-gailv' | 'wrong' | 'custom' ...
  poolLabel: string     // 展示名
  subject: string       // 归类（用于过滤 chip）：'math' | 'wrong' | ...
  front: string
  back: string
  chapter?: string
  box: number           // 0=新卡(未学)，1..5=Leitner 盒
  due: string           // 'YYYY-MM-DD' 到期日（box=0 恒为今天）
  reps: number          // 成功复习次数
  lapses: number        // 遗忘次数
  createdAt: string
  lastReviewedAt: string | null
}

const KEY = 'srs-cards-v1'
// box 1..5 → 学习后间隔天数
const INTERVALS = [1, 2, 4, 7, 14]
const MAX_BOX = 5

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function addDays(base: string, n: number): string {
  const [y, m, d] = base.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() + n)
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
}
const nowISO = () => new Date().toISOString()

// ===== 408 复习闭环（间隔重复）辅助 =====
// 408 科目代码 → 全称（progress.json slug 前缀 / questions.json subject 字段）
const CS408_SUBJECT_LABEL: Record<string, string> = {
  ds: '数据结构', co: '计算机组成原理', os: '操作系统', cn: '计算机网络',
}
// 重做队列：讲过(taught)、做错(wrong)、部分对(partial) 的大题需要进入记忆卡循环
const CS408_REDO_RESULTS = ['taught', 'wrong', 'partial']

function stripMd(text: string): string {
  return String(text || '')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 去图片语法
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接保留文字
    .replace(/\s+/g, ' ')
    .trim()
}

// 从解析里抽取"解题钥匙"：优先整句考点概述，否则截断，避免卡片背面过长
function extractKey(explanation: string): string {
  const clean = stripMd(explanation)
  if (!clean) return '回题目原解析确认解题钥匙'
  // 取到第一个句号/换行为止（多为"本题考查……"的考点句）
  const m = clean.match(/^[^。！？.!?]*[。！？.!?]/)
  const first = (m ? m[0] : clean).trim()
  return first.length > 160 ? first.slice(0, 160) + '…' : first
}

export const useSrsStore = defineStore('srs', () => {
  const cards = reactive<Record<string, SrsCard>>({})
  let inited = false

  function init() {
    if (inited) return
    inited = true
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) {
        const arr = JSON.parse(raw) as SrsCard[]
        arr.forEach(c => { cards[c.id] = c })
      }
    } catch (e) {
      console.warn('[srs] 读取本地卡失败', e)
    }
    seedMath() // 首次自动导入数学速查卡（按 id 去重，用户删过的不会重复灌回，见下）
  }

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(Object.values(cards)))
    } catch (e) {
      console.warn('[srs] 持久化失败', e)
    }
    // 云同步（未配置时 no-op）；用独立表名，避免覆盖 today_status / study_data
    pushToCloudDebounced(Object.values(cards), 2000, 'srs_cards')
  }
  watch(cards, () => persist(), { deep: true })

  function ensureCard(c: SrsCard): boolean {
    if (cards[c.id]) return false
    cards[c.id] = c
    return true
  }
  const newCard = (partial: Partial<SrsCard> & { id: string; pool: string; poolLabel: string; subject: string; front: string; back: string }): SrsCard => ({
    box: 0, due: todayStr(), reps: 0, lapses: 0, chapter: undefined,
    createdAt: nowISO(), lastReviewedAt: null, ...partial
  })

  // 种子：数学速查卡（高数/线代/概率）
  let mathSeeded = false
  function seedMath(force = false): number {
    if (mathSeeded && !force) return 0
    mathSeeded = true
    let added = 0
    ;(Object.keys(QUICK_CARDS) as QuickSubjectKey[]).forEach(sk => {
      const grp = QUICK_CARDS[sk]
      grp.chapters.forEach(ch => {
        ch.cards.forEach(card => {
          const c = newCard({
            id: `math-${sk}:${card.id}`,
            pool: `math-${sk}`,
            poolLabel: grp.name,
            subject: 'math',
            front: card.front,
            back: card.back,
            chapter: ch.title
          })
          if (ensureCard(c)) added++
        })
      })
    })
    if (added) persist()
    return added
  }

  // 批量导入任意来源卡片（错题、其它池适配器复用）
  function addCards(list: Array<Partial<SrsCard> & { id: string; front: string; back: string; pool?: string; poolLabel?: string; subject?: string }>): number {
    init()
    let added = 0
    list.forEach(raw => {
      const c = newCard({
        pool: raw.pool || 'custom',
        poolLabel: raw.poolLabel || '自定义',
        subject: raw.subject || 'custom',
        ...raw, id: raw.id
      } as any)
      if (ensureCard(c)) added++
    })
    if (added) persist()
    return added
  }

  // ===== 408 复习闭环：把「讲过/做错/半懂」的真题大题灌成间隔重复记忆卡 =====
  // 单一来源：public/data/408-exam/{questions.json,progress.json}
  //  - 正面：科目+年份+题号+章节 → 回忆解题钥匙/第一步抓什么（主动回忆）
  //  - 背面：progress.note（若有，往往是我给该题定的错因补丁）否则解析首句考点概述
  // 幂等：按 id `cs408-bigq:${slug}` 去重，重跑只补新增，用户删过的不复活（与 seedMath 同策略）
  let cs408Promise: Promise<number> | null = null
  function seedCS408(force = false): Promise<number> {
    if (cs408Promise && !force) return cs408Promise
    const job = (async () => {
      try {
        const base = (import.meta as any).env?.BASE_URL || '/'
        const dir = `${base}data/408-exam/`
        const [qRes, pRes] = await Promise.all([
          fetch(`${dir}questions.json`).then(r => r.ok ? r.json() : null),
          fetch(`${dir}progress.json`).then(r => r.ok ? r.json() : null),
        ])
        if (!qRes || !pRes) return 0
        const bySlug: Record<string, any> = {}
        ;(qRes.items || []).forEach((it: any) => { bySlug[it.slug] = it })
        const records = pRes.records || {}
        const cards: Array<Partial<SrsCard> & { id: string; front: string; back: string }> = []
        Object.entries(records).forEach(([slug, rec]: [string, any]) => {
          if (!CS408_REDO_RESULTS.includes(rec.result)) return
          const it = bySlug[slug]
          if (!it) return
          const subj = CS408_SUBJECT_LABEL[it.subject] || it.subject
          const front = `【${subj}】${it.year} 年第 ${it.index} 题 · ${it.chapterName || ''} —— 回忆：这道大题的解题钥匙 / 第一步该抓什么？`
          const back = (rec.note && stripMd(rec.note)) || extractKey(it.explanation)
          cards.push({
            id: `cs408-bigq:${slug}`,
            pool: 'cs408-bigq',
            poolLabel: '408 真题重做',
            subject: 'cs408',
            front,
            back,
            chapter: it.chapterName || undefined,
          })
        })
        return cards.length ? addCards(cards) : 0
      } catch (e) {
        console.warn('[srs] 408 真题卡种子失败', e)
        return 0
      }
    })()
    cs408Promise = job
    return job
  }

  // ===== 政治复习闭环：把「考点漏洞地图」里的顽固簇 + 成套结论漏洞灌成记忆卡 =====
  // 单一来源：public/data/politics/vuln-map.json（肖1000 一刷 483 题逐题细读产出）
  //  - 顽固簇卡（politics-vuln）：同一考点一刷错 ≥2 题，正面问"该扣哪顶帽子/正确说法"，背面给可照抄的标注短语+处方
  //  - 成套结论卡（politics-set）：多选漏选 ≥2 个字母（成套结论没背全），背面列出"应选/你漏的"原话
  // 幂等：按 id 去重，重跑只补新增；用户删过的不复活（与 seedMath / seedCS408 同策略）
  let politicsPromise: Promise<number> | null = null
  function seedPolitics(force = false): Promise<number> {
    if (politicsPromise && !force) return politicsPromise
    const job = (async () => {
      try {
        const base = (import.meta as any).env?.BASE_URL || '/'
        const res = await fetch(`${base}data/politics/vuln-map.json`)
        if (!res.ok) return 0
        const m: any = await res.json()
        if (!m || !Array.isArray(m.groups)) return 0
        const cards: Array<Partial<SrsCard> & { id: string; front: string; back: string }> = []

        m.groups.forEach((g: any) => {
          if (!(g.count >= 2)) return
          const qs: any[] = g.questions || []
          const marks = [...new Set(qs.map(q => q.mark).filter(Boolean))].slice(0, 3).join('；')
          const fixes = [...new Set(qs.map(q => q.fix).filter(Boolean))].slice(0, 2).join('；')
          const letters = qs
            .flatMap(q => [...(q.miss || []), ...(q.extra || [])].map(l => `${l.l}「${l.t}」`))
            .slice(0, 4).join(' / ')
          cards.push({
            id: `politics-vuln:${g.key}`,
            pool: 'politics-vuln',
            poolLabel: '政治·顽固考点簇',
            subject: 'politics',
            chapter: g.chapter,
            front: `【${g.chapter}】考点「${g.group}」一刷错 ${g.count} 次（顽固）—— 回忆：这个考点的正确说法 / 该扣哪顶帽子？`,
            back: `${marks || '回漏洞地图看标注短语'}${fixes ? '<br>处方：' + fixes : ''}${letters ? '<br>涉及选项：' + letters : ''}`
          })
        })

        m.groups.forEach((g: any) => {
          (g.questions || []).forEach((q: any) => {
            if (q.singlePair) return
            if (!((q.miss || []).length >= 2)) return
            const missTxt = q.miss.map((l: any) => `${l.l}「${l.t}」`).join('；')
            cards.push({
              id: `politics-set:${q.id}`,
              pool: 'politics-set',
              poolLabel: '政治·成套结论默写',
              subject: 'politics',
              chapter: g.chapter,
              front: `【${g.chapter}】成套结论｜${q.kp || g.group} —— 回忆：一共几条？你当时漏了哪几条？`,
              back: `一刷漏选：${missTxt}${q.mark ? '<br>抄手册：' + q.mark : ''}`
            })
          })
        })

        return cards.length ? addCards(cards) : 0
      } catch (e) {
        console.warn('[srs] 政治漏洞卡种子失败', e)
        return 0
      }
    })()
    politicsPromise = job
    return job
  }

  // 复习评分
  function grade(id: string, g: SrsGrade) {
    init()
    const c = cards[id]
    if (!c) return
    const t = todayStr()
    if (g === 'again') {
      c.box = 1
      c.due = addDays(t, INTERVALS[0])
      c.lapses += 1
    } else if (g === 'good') {
      c.box = Math.min(MAX_BOX, Math.max(1, c.box + 1))
      c.due = addDays(t, INTERVALS[c.box - 1])
      c.reps += 1
    } else { // easy
      c.box = Math.min(MAX_BOX, Math.max(1, c.box + 2))
      c.due = addDays(t, INTERVALS[c.box - 1])
      c.reps += 1
    }
    c.lastReviewedAt = nowISO()
    persist()
  }

  // 答"again"的卡当日回炉：放到本次会话队尾（不真正改 due，前端会话内管理）
  const all = computed<SrsCard[]>(() => Object.values(cards))
  const t = todayStr()
  const newCards = computed(() => all.value.filter(c => c.box === 0))
  const dueCards = computed(() => all.value.filter(c => c.box >= 1 && c.due <= t).sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : a.box - b.box)))
  const dueCount = computed(() => dueCards.value.length)
  const newCount = computed(() => newCards.value.length)
  const matureCount = computed(() => all.value.filter(c => c.box >= 4).length)
  const totalCount = computed(() => all.value.length)
  const sessionQueue = computed(() => [...dueCards.value, ...newCards.value])

  // 408 复习闭环：今日到点(到期 or 新卡未学)的 408 记忆卡数，供 408 页"今日复习"角标
  const cs408TotalCount = computed(() => all.value.filter(c => c.subject === 'cs408').length)
  const cs408DueCount = computed(() => all.value.filter(c => c.subject === 'cs408' && (c.box === 0 || (c.box >= 1 && c.due <= t))).length)

  // 政治复习闭环：同上，subject='politics'（顽固考点簇 + 成套结论默写两个池）
  const politicsTotalCount = computed(() => all.value.filter(c => c.subject === 'politics').length)
  const politicsDueCount = computed(() => all.value.filter(c => c.subject === 'politics' && (c.box === 0 || (c.box >= 1 && c.due <= t))).length)
  const politicsMatureCount = computed(() => all.value.filter(c => c.subject === 'politics' && c.box >= 4).length)

  // 分池统计
  const pools = computed(() => {
    const m: Record<string, { pool: string; poolLabel: string; subject: string; total: number; due: number; neu: number; mature: number }> = {}
    all.value.forEach(c => {
      if (!m[c.pool]) m[c.pool] = { pool: c.pool, poolLabel: c.poolLabel, subject: c.subject, total: 0, due: 0, neu: 0, mature: 0 }
      const s = m[c.pool]; s.total++
      if (c.box === 0) s.neu++
      else if (c.due <= t) s.due++
      if (c.box >= 4) s.mature++
    })
    return Object.values(m)
  })

  function statsByPool(poolFilter: string | 'all') {
    const base = poolFilter === 'all' ? all.value : all.value.filter(c => c.pool === poolFilter)
    return {
      total: base.length,
      due: base.filter(c => c.box >= 1 && c.due <= t).length,
      neu: base.filter(c => c.box === 0).length,
      mature: base.filter(c => c.box >= 4).length
    }
  }

  function suspend(id: string, on = true) { init(); const c = cards[id]; if (c) { ;(c as any).suspended = on; persist() } }

  return {
    cards, init, persist,
    seedMath, seedCS408, seedPolitics, addCards, grade, suspend,
    all, newCards, dueCards, dueCount, newCount, matureCount, totalCount, sessionQueue, pools, statsByPool,
    cs408TotalCount, cs408DueCount,
    politicsTotalCount, politicsDueCount, politicsMatureCount,
    INTERVALS, MAX_BOX
  }
})
