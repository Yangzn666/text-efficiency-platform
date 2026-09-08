import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 英语阅读记录数据引擎
 * - 按年份（2005-2026）记录每年 4 篇阅读（Text1-4）的完成情况
 * - 每篇记录：是否完成 + 正确数（0-5）+ 生词/长难句笔记
 * - 总进度：已完成篇数 / 88
 */

export interface PassageRecord {
  year: number
  text: number
  done: boolean
  /** 正确题数 0-5 */
  correct: number
  /** 生词/长难句笔记 */
  notes: string
}

export const START_YEAR = 2005
export const END_YEAR = 2026
export const TEXTS_PER_YEAR = 4
export const TOTAL_PASSAGES = (END_YEAR - START_YEAR + 1) * TEXTS_PER_YEAR

const STORAGE_KEY = 'english-reading-log-v1'

/**
 * 已完成篇目的种子数据：key = `${year}-${text}`，value = 已知正确题数。
 * 该映射同时驱动 seedCompletedPassages 的遍历范围，新做完一篇只需在此加一行。
 * 数值与 reading-questions.json 中的 userAnswer 保持一致。
 */
const SEEDED_CORRECT: Record<string, number> = {
  '2005-1': 1,
  '2005-2': 2,
  '2005-3': 3,
  '2005-4': 1,
  '2006-1': 2,
  '2006-2': 3,
  '2006-3': 5,
  '2006-4': 3,
  '2008-1': 3
}

/** 已知作答结果的篇目生词/长难句笔记（仅在用户未填写时注入） */
const SEEDED_NOTES: Record<string, string> = {
  '2006-4':
    'function as = 充当/起到…的作用（同义：serve as / act as）。' +
    '第5题错因：不认识 function as，无法解码 A 选项 Religion once functioned as a reminder of misery（宗教曾充当痛苦的提醒物），' +
    '转而误选 D（媒体倾向报道灾难死亡，与原文“媒体只贩卖快乐”相反）。' +
    '补救信号：选项中的时间副词 once / used to / now 常是定位钥匙，本文全程是“过去宗教提醒痛苦 vs 现在广告贩卖幸福”的二元对照。',
  '2008-1':
    '第1题错因（形近词误读）：vulnerable（易受伤害的）看成 voluntary（自愿的），误解文意为“女性乐于承受压力”，直接排除了正确答案 A。' +
    '第3题错因（原词照抄陷阱）：domestic 误读为“动态的”；且看到原文出现该词就直接选含原词的选项，未识别出正确答案 C 是同义替换。' +
    '共性教训：① 选项词汇要逐字确认再排除；② 原文照抄的选项先怀疑，换了说法的选项先相信。'
}

function keyOf(year: number, text: number) {
  return `${year}-${text}`
}

export const useReadingLogStore = defineStore('readingLog', () => {
  /** key: `${year}-${text}` */
  const records = ref<Record<string, PassageRecord>>({})

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) records.value = JSON.parse(saved)
    } catch {
      /* 忽略损坏数据 */
    }
    seedCompletedPassages()
  }

  /** 预置已完成的真题记录（遍历范围由 SEEDED_CORRECT 的 key 决定，支持跨年不连续篇目） */
  function seedCompletedPassages() {
    let changed = false
    for (const k of Object.keys(SEEDED_CORRECT)) {
      const [year, text] = k.split('-').map(Number)
      const seededCorrect = SEEDED_CORRECT[k]
      if (!records.value[k]) {
        records.value[k] = { year, text, done: true, correct: seededCorrect, notes: SEEDED_NOTES[k] || '' }
        changed = true
        continue
      }
      const rec = records.value[k]
      if (!rec.done) {
        rec.done = true
        changed = true
      }
      // 仅在用户尚未手动填写时同步，避免覆盖手工记录
      if (seededCorrect > 0 && rec.correct === 0) {
        rec.correct = seededCorrect
        changed = true
      }
      const seededNotes = SEEDED_NOTES[k]
      if (seededNotes && !rec.notes) {
        rec.notes = seededNotes
        changed = true
      }
    }
    if (changed) save()
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records.value))
  }

  function get(year: number, text: number): PassageRecord {
    const k = keyOf(year, text)
    if (!records.value[k]) {
      records.value[k] = { year, text, done: false, correct: 0, notes: '' }
    }
    return records.value[k]
  }

  function update(year: number, text: number, patch: Partial<PassageRecord>) {
    const rec = get(year, text)
    Object.assign(rec, patch)
    save()
  }

  const years = computed(() => {
    const list: number[] = []
    for (let y = END_YEAR; y >= START_YEAR; y--) list.push(y)
    return list
  })

  function yearStats(year: number) {
    let done = 0
    let totalCorrect = 0
    let answered = 0
    for (let t = 1; t <= TEXTS_PER_YEAR; t++) {
      const k = keyOf(year, t)
      const rec = records.value[k]
      if (rec && rec.done) {
        done++
        totalCorrect += rec.correct
        answered += 5
      }
    }
    return {
      done,
      accuracy: answered ? Math.round((totalCorrect / answered) * 100) : 0
    }
  }

  const overall = computed(() => {
    let done = 0
    let totalCorrect = 0
    let answered = 0
    Object.values(records.value).forEach(rec => {
      if (rec.done) {
        done++
        totalCorrect += rec.correct
        answered += 5
      }
    })
    return {
      done,
      total: TOTAL_PASSAGES,
      accuracy: answered ? Math.round((totalCorrect / answered) * 100) : 0
    }
  })

  load()

  return { records, years, get, update, yearStats, overall }
})
