// 今日负荷 · 全站唯一口径
//
// 此前三套账各说各话：刷题调度说 420 分钟、SRS 说 40 张、回炉总账说 40 条，
// 首页只显示「今日任务 0/5」这种计划数，没人知道今天到底还欠多少时间。
// 这里把三套折算成分钟并排序：先销回炉 → 再刷记忆卡 → 错题复测 → 剩余时间给新题。
//
// 口径（全部可解释，改数字只改这里）：
//   回炉  每条按 3 分钟估价（含回看题干/想一遍/销账）
//   记忆卡 每张 1.5 分钟（正面回忆 + 翻面核对）
//   复测  每道 3 分钟（重做 + 对答案）；每日目标 10 道
//   预算  420 分钟 = 刷题调度那边的日预算，三科分摊后仍按这个总盘算
import { computed } from 'vue'
import { useSrsStore } from '@/stores/srs'
import { useWrongProblemsStore } from '@/stores/wrongProblems'
import {
  loadReviewQueues, undoneDueCount, doneTodayCount, DAILY_QUOTA
} from './reviewQueues'
import { todayCount } from './reviewLog'

export const DAILY_MINUTES = 420
export const MIN_PER_QUEUE = 3
export const MIN_PER_CARD = 1.5
export const MIN_PER_REDO = 3
export const SRS_DAILY_QUOTA = 40
export const REDO_TARGET = 10

export function useDailyLoad() {
  const srs = useSrsStore()
  const wp = useWrongProblemsStore()
  srs.init()
  wp.init()
  loadReviewQueues()

  // 回炉：只算今日配额内、尚未销账的（积压不吓唬人，见 /review-queue 的积压区）
  const queueLeft = computed(() => Math.min(undoneDueCount.value, DAILY_QUOTA))
  const queueMinutes = computed(() => Math.round(queueLeft.value * MIN_PER_QUEUE))

  // 记忆卡：到期旧卡 + 新卡，但每天封顶 40 张；今天已刷多少从流水里扣
  const srsReviewed = computed(() => todayCount('srs'))
  const srsLeftRaw = computed(() => srs.dueAllCount)
  const srsLeft = computed(() =>
    Math.min(srsLeftRaw.value, Math.max(0, SRS_DAILY_QUOTA - srsReviewed.value))
  )
  const srsMinutes = computed(() => Math.round(srsLeft.value * MIN_PER_CARD))

  // 错题复测：每日 10 道目标，今天已记的复习次数从流水扣
  const wrongReviewed = computed(() => todayCount('wrong'))
  const redoLeft = computed(() => Math.min(
    Math.max(0, REDO_TARGET - wrongReviewed.value),
    wp.unmasteredCount
  ))
  const redoMinutes = computed(() => redoLeft.value * MIN_PER_REDO)

  // 总欠账（分钟）
  const owedMinutes = computed(() => queueMinutes.value + srsMinutes.value + redoMinutes.value)
  const newTaskMinutes = computed(() => Math.max(0, DAILY_MINUTES - owedMinutes.value))

  const steps = computed(() => [
    {
      key: 'queue', icon: '🔥', label: '销回炉账',
      detail: `${queueLeft.value} 条 × 3′`,
      minutes: queueMinutes.value,
      left: queueLeft.value,
      href: '/review-queue',
      note: queueLeft.value ? '按优先级从逾期最久的开始' : '今日配额已清'
    },
    {
      key: 'srs', icon: '🧠', label: '刷记忆卡',
      detail: `${srsLeft.value} 张 × 1.5′（到期 ${srs.dueCount} + 新卡 ${srs.newCount}，日上限 ${SRS_DAILY_QUOTA}）`,
      minutes: srsMinutes.value,
      left: srsLeft.value,
      href: '/srs',
      note: srsLeft.value ? '先过到期旧卡再看新卡' : '今天到期的已经刷完'
    },
    {
      key: 'redo', icon: '↻', label: '错题复测',
      detail: `${redoLeft.value} 道 × 3′（连对 2 次毕业）`,
      minutes: redoMinutes.value,
      left: redoLeft.value,
      href: '/wrong-problems',
      note: redoLeft.value ? '挑未掌握里逾期最久的' : '今日复测目标已达成'
    }
  ])

  return {
    DAILY_MINUTES,
    queueLeft, queueMinutes,
    srsLeft, srsMinutes, srsReviewed,
    redoLeft, redoMinutes, wrongReviewed,
    owedMinutes, newTaskMinutes, steps,
    queueDone: doneTodayCount,
    srsDue: computed(() => srs.dueCount),
    srsNew: computed(() => srs.newCount),
    unmastered: computed(() => wp.unmasteredCount)
  }
}
