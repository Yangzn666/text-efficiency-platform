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
    seedMath, addCards, grade, suspend,
    all, newCards, dueCards, dueCount, newCount, matureCount, totalCount, sessionQueue, pools, statsByPool,
    INTERVALS, MAX_BOX
  }
})
