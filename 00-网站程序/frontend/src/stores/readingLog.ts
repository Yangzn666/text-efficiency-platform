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
