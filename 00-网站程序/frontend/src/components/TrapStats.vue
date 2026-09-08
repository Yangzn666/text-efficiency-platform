<script setup lang="ts">
import { computed, ref } from 'vue'
import { countTraps } from '@/utils/trapTaxonomy'

// 错因套路统计面板（个人版专属，依赖 userAnswer 个人作答数据）
// 两块：① 错题命中的干扰套路分布 ② 答案位置偏好审计
const props = defineProps<{ questions: any[] }>()
const expanded = ref(true)

const list = computed(() => props.questions || [])

// ===== ① 错因套路分布 =====
const wrongQuestions = computed(() =>
  list.value.filter(q => q.userAnswer && q.userAnswer !== q.correctAnswer)
)
const trapStats = computed(() => countTraps(wrongQuestions.value))
const maxTrap = computed(() => trapStats.value.reduce((m, s) => Math.max(m, s.count), 0))
const wrongTotal = computed(() => wrongQuestions.value.length)
const topTrap = computed(() => trapStats.value[0] || null)

// ===== ② 答案位置偏好审计 =====
const answered = computed(() => list.value.filter(q => q.userAnswer))
const LETTERS = ['A', 'B', 'C', 'D'] as const
const letterDist = computed(() => {
  const dist: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 }
  answered.value.forEach(q => { if (dist[q.userAnswer] !== undefined) dist[q.userAnswer]++ })
  return dist
})
const letterTotal = computed(() => LETTERS.reduce((s, k) => s + letterDist.value[k], 0))
const maxLetter = computed(() => letterTotal.value ? Math.max(...LETTERS.map(k => letterDist.value[k])) : 0)
// 样本 ≥ 8 且某字母占比 ≥ 35% 才判定为位置偏好（理想均分是 25%）
const biasLetter = computed(() => {
  if (letterTotal.value < 8) return null
  const top = LETTERS.reduce((a, b) => letterDist.value[b] > letterDist.value[a] ? b : a, 'A')
  const ratio = letterDist.value[top] / letterTotal.value
  return ratio >= 0.35 ? { letter: top, count: letterDist.value[top], ratio: Math.round(ratio * 100) } : null
})

const hasData = computed(() => wrongTotal.value > 0 || letterTotal.value > 0)
</script>

<template>
  <div v-if="hasData" class="trap-stats">
    <div class="ts-head" @click="expanded = !expanded">
      <span class="ts-title">🎯 错因深度分析</span>
      <span class="ts-sub">套路命中 {{ wrongTotal }} 道错题 · 位置偏好审计 {{ letterTotal }} 次作答</span>
      <span class="ts-toggle">{{ expanded ? '收起 ▴' : '展开 ▾' }}</span>
    </div>

    <div v-show="expanded" class="ts-body">
      <!-- ① 错因套路分布 -->
      <div v-if="wrongTotal > 0" class="ts-block">
        <div class="ts-block-head">
          <span class="ts-block-title">干扰套路命中分布</span>
          <span class="ts-block-note">多标签口径，一题可命中多类</span>
        </div>
        <div v-if="topTrap" class="ts-alert" :style="{ borderColor: topTrap.meta.color, background: topTrap.meta.color + '0f' }">
          最该警惕 <b :style="{ color: topTrap.meta.color }">{{ topTrap.meta.name }}</b>
          （错 {{ topTrap.count }} 次）· {{ topTrap.meta.sign }}
        </div>
        <div class="ts-bars">
          <div v-for="s in trapStats" :key="s.meta.id" class="ts-row" :title="s.meta.sign">
            <span class="ts-name">{{ s.meta.name }}</span>
            <span class="ts-track">
              <span class="ts-fill" :style="{ width: (s.count / maxTrap * 100) + '%', background: s.meta.color }"></span>
            </span>
            <span class="ts-count" :style="{ color: s.meta.color }">{{ s.count }}</span>
          </div>
        </div>
      </div>

      <!-- ② 答案位置偏好审计 -->
      <div v-if="letterTotal > 0" class="ts-block">
        <div class="ts-block-head">
          <span class="ts-block-title">答案位置偏好审计</span>
          <span class="ts-block-note">理想四项均分约 25%</span>
        </div>
        <div v-if="biasLetter" class="ts-alert warn">
          ⚠️ 你有 <b>{{ biasLetter.ratio }}%</b> 的作答选了 <b>{{ biasLetter.letter }}</b>（{{ biasLetter.count }}/{{ letterTotal }}）——
          明显高于均分线。选 {{ biasLetter.letter }} 前，先确认是真的读懂了定位句，而不是在放弃比对。
        </div>
        <div v-else class="ts-alert ok">
          ✅ 暂无明显位置偏好，四项分布较均衡，保持"逐项回原文比对"的习惯。
        </div>
        <div class="ts-letters">
          <div v-for="k in LETTERS" :key="k" class="ts-letter" :class="{ bias: biasLetter && biasLetter.letter === k }">
            <span class="ts-letter-key">{{ k }}</span>
            <span class="ts-letter-track">
              <span class="ts-letter-fill" :style="{ width: (maxLetter ? letterDist[k] / maxLetter * 100 : 0) + '%' }"></span>
            </span>
            <span class="ts-letter-num">{{ letterDist[k] }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trap-stats {
  margin: 0 0 18px;
  background: linear-gradient(135deg, #0d2137 0%, #16345c 100%);
  border-radius: 12px;
  border: 1px solid rgba(255, 197, 61, 0.25);
  overflow: hidden;
}
.ts-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  cursor: pointer;
  user-select: none;
}
.ts-title {
  font-size: 0.98rem;
  font-weight: 700;
  color: #ffc53d;
  letter-spacing: 0.03em;
}
.ts-sub {
  font-size: 0.76rem;
  color: #a8bdd4;
  flex: 1;
}
.ts-toggle {
  font-size: 0.76rem;
  color: #ffc53d;
}
.ts-body {
  padding: 4px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.ts-block-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 10px;
}
.ts-block-title {
  font-size: 0.86rem;
  font-weight: 700;
  color: #eaf1f9;
}
.ts-block-note {
  font-size: 0.72rem;
  color: #7f96b0;
}
.ts-alert {
  font-size: 0.8rem;
  line-height: 1.6;
  color: #d7e3f2;
  padding: 8px 12px;
  border-radius: 8px;
  border-left: 3px solid #ffc53d;
  background: rgba(255, 255, 255, 0.04);
  margin-bottom: 12px;
}
.ts-alert b { font-weight: 700; }
.ts-alert.warn { border-left-color: #e5484d; background: rgba(229, 72, 77, 0.1); }
.ts-alert.ok { border-left-color: #30a46c; background: rgba(48, 164, 108, 0.1); }

/* 套路条形 */
.ts-bars { display: flex; flex-direction: column; gap: 8px; }
.ts-row {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: help;
}
.ts-name {
  width: 78px;
  flex-shrink: 0;
  font-size: 0.78rem;
  color: #c7d5e5;
  text-align: right;
}
.ts-track {
  flex: 1;
  height: 14px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 7px;
  overflow: hidden;
}
.ts-fill {
  display: block;
  height: 100%;
  border-radius: 7px;
  transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.ts-count {
  width: 28px;
  flex-shrink: 0;
  font-size: 0.82rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
}

/* 位置偏好 */
.ts-letters {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 18px;
}
.ts-letter {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ts-letter-key {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.76rem;
  font-weight: 700;
  color: #a8bdd4;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 5px;
}
.ts-letter.bias .ts-letter-key {
  color: #0d2137;
  background: #ffc53d;
  border-color: #ffc53d;
}
.ts-letter-track {
  flex: 1;
  height: 12px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  overflow: hidden;
}
.ts-letter-fill {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #3e63dd, #6e9bff);
  border-radius: 6px;
  transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.ts-letter.bias .ts-letter-fill { background: linear-gradient(90deg, #e5484d, #ff8080); }
.ts-letter-num {
  width: 24px;
  flex-shrink: 0;
  font-size: 0.8rem;
  color: #c7d5e5;
  font-family: 'JetBrains Mono', monospace;
  text-align: right;
}

@media (max-width: 640px) {
  .ts-sub { display: none; }
  .ts-letters { grid-template-columns: 1fr; }
}
</style>
