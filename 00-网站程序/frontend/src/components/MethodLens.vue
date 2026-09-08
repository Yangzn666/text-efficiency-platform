<script setup lang="ts">
import { computed } from 'vue'
import {
  TRAP_META,
  extractQuestionTraps,
  extractLocateHint,
  extractSynonymPairs,
  detectSynonymSignal,
  TYPE_TIPS
} from '@/utils/trapTaxonomy'

// 方法论视角条：把《糖三角》三师方法论叠加到每道真题上
// 数据全部来自题目 analysis 的既有文本（套路【标签】/定位/同义改写），
// 不依赖任何个人作答数据，个人版与共享版可共用同一组件。
const props = defineProps<{ question: any }>()

const lens = computed(() => {
  const q = props.question || {}
  const trapIds = extractQuestionTraps(q.analysis)
  return {
    type: q.type || '',
    typeTip: TYPE_TIPS[q.type] || '',
    traps: trapIds.map(id => ({ id, ...TRAP_META[id] })),
    locations: extractLocateHint(q.analysis),
    synonym: detectSynonymSignal(q.analysis),
    synonymPairs: extractSynonymPairs(q.analysis)
  }
})

// 全空则不渲染，避免出现空视角条
const hasContent = computed(() =>
  !!(lens.value.typeTip || lens.value.traps.length || lens.value.locations.length || lens.value.synonym)
)
</script>

<template>
  <div v-if="hasContent" class="method-lens">
    <div class="lens-head">
      <span class="lens-badge">🧭 方法论视角</span>
      <span v-if="lens.type" class="lens-type">{{ lens.type }}</span>
    </div>

    <div v-if="lens.typeTip" class="lens-row">
      <span class="lens-tag">🎯 要诀</span>
      <span class="lens-text">{{ lens.typeTip }}</span>
    </div>

    <div v-if="lens.locations.length" class="lens-row">
      <span class="lens-tag">📍 定位</span>
      <span v-for="(loc, i) in lens.locations" :key="i" class="lens-loc">{{ loc }}</span>
    </div>

    <div v-if="lens.traps.length" class="lens-row">
      <span class="lens-tag">⚠️ 干扰套路</span>
      <span
        v-for="t in lens.traps"
        :key="t.id"
        class="lens-chip"
        :style="{ color: t.color, borderColor: t.color, background: t.color + '14' }"
        :title="t.sign"
      >{{ t.name }}</span>
    </div>

    <div v-if="lens.synonym" class="lens-row">
      <span class="lens-tag">🔁 同义改写</span>
      <template v-if="lens.synonymPairs.length">
        <span v-for="(p, i) in lens.synonymPairs" :key="i" class="lens-syn">
          <b>{{ p.a }}</b> ≈ <b>{{ p.b }}</b>
        </span>
      </template>
      <span v-else class="lens-text">本题涉及同义替换，正确项常是原文的同义改写</span>
    </div>
  </div>
</template>

<style scoped>
.method-lens {
  margin: 10px 0 14px;
  padding: 10px 14px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-left: 3px solid #ffc53d;
  border-radius: 10px;
}
.lens-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.lens-badge {
  font-size: 0.78rem;
  font-weight: 700;
  color: #16345c;
  letter-spacing: 0.04em;
}
.lens-type {
  font-size: 0.72rem;
  color: #64748b;
  background: #fff;
  border: 1px solid #e2e8f0;
  padding: 1px 8px;
  border-radius: 10px;
}
.lens-row {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
  font-size: 0.82rem;
  line-height: 1.6;
}
.lens-tag {
  flex-shrink: 0;
  color: #475569;
  font-size: 0.76rem;
  min-width: 66px;
}
.lens-text {
  color: #334155;
}
.lens-loc {
  background: #e0f2fe;
  color: #0369a1;
  padding: 1px 8px;
  border-radius: 8px;
  font-size: 0.76rem;
  font-family: 'JetBrains Mono', monospace;
}
.lens-chip {
  padding: 1px 9px;
  border-radius: 10px;
  border: 1px solid;
  font-size: 0.76rem;
  font-weight: 600;
  cursor: help;
}
.lens-syn {
  color: #6e56cf;
  background: #f3f0ff;
  padding: 1px 8px;
  border-radius: 8px;
  font-size: 0.78rem;
}
.lens-syn b {
  font-weight: 700;
  color: #5b21b6;
}
</style>
