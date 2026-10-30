<script setup lang="ts">
// 错题复测闭环（408 四门 + 其它科目错题本共用）
//
// 病根：错题本只有「标记掌握」一个按钮 —— 看一眼就勾掉，等于把错题本变成"划掉本"。
// 这里换成数学错题本已经在用的机制：重做 → 判对错 → 连对 GRADUATE_STREAK 次才真正毕业，
// 答错则连对清零、继续留在回炉清单。状态存在 wrongProblems store（wrong-problems-v1），
// 手机上也能点，不需要电脑。
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useWrongProblemsStore, GRADUATE_STREAK } from '@/stores/wrongProblems'

interface Reviewable {
  id: string
  mastered: boolean
  reviewCount?: number
  correctStreak?: number
  lastReviewAt?: string
}

const props = defineProps<{ problem: Reviewable }>()
const emit = defineEmits<{ (e: 'judged', correct: boolean): void }>()

const wp = useWrongProblemsStore()

const streak = computed(() => props.problem.correctStreak || 0)
const stateText = computed(() => {
  if (props.problem.mastered) return '已毕业'
  return streak.value > 0 ? `连对 ${streak.value}/${GRADUATE_STREAK}` : `待重做 ${GRADUATE_STREAK} 对`
})

function judge(correct: boolean) {
  const p = props.problem as any
  const wasMastered = p.mastered
  wp.recordReview(p, correct)
  wp.persist()
  if (correct && !wasMastered && p.mastered) {
    ElMessage.success(`连对 ${GRADUATE_STREAK} 次，这题毕业 🎉 清单又薄一格`)
  } else if (correct) {
    ElMessage.success(`记一次做对（还差 ${Math.max(0, GRADUATE_STREAK - (p.correctStreak || 0))} 次连对毕业）`)
  } else {
    ElMessage.warning('又错了 → 连对清零，继续留在回炉清单')
  }
  emit('judged', correct)
}
</script>

<template>
  <span class="wr-retest">
    <span
      class="wr-pill"
      :class="{ grad: problem.mastered, warm: !problem.mastered && streak > 0 }"
      :title="`连对 ${GRADUATE_STREAK} 次自动毕业；答错清零重来`"
    >{{ stateText }}</span>
    <button
      v-if="!problem.mastered"
      class="wr-btn ok"
      @click.stop="judge(true)"
      title="这题现在能独立做对，记一次"
    >✔ 做对</button>
    <button
      v-if="!problem.mastered"
      class="wr-btn bad"
      @click.stop="judge(false)"
      title="重做还是错，连对清零"
    >✘ 又错</button>
    <button
      v-if="problem.mastered && streak < GRADUATE_STREAK"
      class="wr-btn bad"
      @click.stop="judge(false)"
      title="毕业题也会回炉：现在做不出来就清零重记"
    >↺ 打回</button>
  </span>
</template>

<style scoped>
.wr-retest { display: inline-flex; align-items: center; gap: 6px; }
.wr-pill {
  font-size: 12px;
  font-weight: 700;
  color: #8a94a3;
  background: #f1f4f9;
  border: 1px solid #e3e8ef;
  border-radius: 999px;
  padding: 2px 9px;
  white-space: nowrap;
}
.wr-pill.warm { color: #6b5310; background: #fdf6e3; border-color: #f0e0b8; }
.wr-pill.grad { color: #1f7a4d; background: #e9f7ef; border-color: #bfe3cd; }
.wr-btn {
  font-size: 12px;
  font-weight: 600;
  border-radius: 7px;
  padding: 3px 10px;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dfe5ee;
  color: #5a6472;
  white-space: nowrap;
  transition: background .15s ease, border-color .15s ease, color .15s ease;
}
.wr-btn.ok:hover { background: #e9f7ef; border-color: #7fc9a2; color: #1f7a4d; }
.wr-btn.bad:hover { background: #fdecea; border-color: #eaa6a0; color: #b6402f; }
.wr-btn.ok { border-color: #bfe3cd; color: #1f7a4d; }
.wr-btn.bad { border-color: #f0c9c4; color: #b6402f; }
</style>
