<script setup lang="ts">
import { computed, ref } from 'vue'
import { buildThinkingPath, hasThinkingPath } from '@/utils/thinkingPath'

// 思考路径卡：把颉斌斌「三步走 + 复盘四件事」按题型定制成一条解题思路，
// 并复用 trapTaxonomy 抽取的本题真实信号（定位句 / 各选项套路 / 同义改写）。
// 只读 type + analysis，不碰 userAnswer，个人版与共享版共用同一组件。
const props = defineProps<{ question: any }>()

const open = ref(false)
const steps = computed(() => buildThinkingPath(props.question))
const show = computed(() => hasThinkingPath(props.question))
</script>

<template>
  <div v-if="show" class="think-path" :class="{ open }">
    <div class="tp-head" @click="open = !open">
      <span class="tp-badge">🧭 思考路径</span>
      <span class="tp-sub">遇到这类题，按这四步想</span>
      <span class="tp-toggle">{{ open ? '收起 ▴' : '展开 ▾' }}</span>
    </div>

    <div v-show="open" class="tp-body">
      <div v-for="s in steps" :key="s.no" class="tp-step">
        <div class="tp-rail">
          <span class="tp-no">{{ s.no }}</span>
          <span class="tp-line"></span>
        </div>
        <div class="tp-content">
          <div class="tp-title">{{ s.icon }} {{ s.title }}</div>
          <div class="tp-method" :class="{ multiline: s.no === '4' }">{{ s.method }}</div>
          <div v-if="s.detail && s.detailHtml" class="tp-detail" v-html="s.detail"></div>
          <div v-else-if="s.detail" class="tp-detail">{{ s.detail }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.think-path {
  margin: 10px 0 14px;
  border: 1px solid #dbe6f3;
  border-left: 3px solid #2c7be5;
  border-radius: 10px;
  background: #fbfdff;
  overflow: hidden;
}
.think-path.open {
  background: linear-gradient(135deg, #f6faff 0%, #eef5fd 100%);
}
.tp-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  cursor: pointer;
  user-select: none;
}
.tp-head:hover { background: rgba(44, 123, 229, 0.05); }
.tp-badge {
  font-size: 0.8rem;
  font-weight: 700;
  color: #16345c;
  letter-spacing: 0.03em;
}
.tp-sub {
  flex: 1;
  font-size: 0.76rem;
  color: #7a8ba3;
}
.tp-toggle {
  font-size: 0.76rem;
  color: #2c7be5;
  flex-shrink: 0;
}
.tp-body {
  padding: 4px 16px 14px;
}
.tp-step {
  display: flex;
  gap: 12px;
}
.tp-rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  padding-top: 2px;
}
.tp-no {
  width: 22px;
  height: 22px;
  line-height: 22px;
  text-align: center;
  border-radius: 50%;
  background: #2c7be5;
  color: #fff;
  font-size: 0.74rem;
  font-weight: 700;
}
.tp-line {
  flex: 1;
  width: 2px;
  background: #cfe0f2;
  margin: 3px 0;
  min-height: 12px;
}
.tp-step:last-child .tp-line { display: none; }
.tp-content {
  flex: 1;
  min-width: 0;
  padding-bottom: 14px;
}
.tp-title {
  font-size: 0.86rem;
  font-weight: 700;
  color: #1e4576;
  margin-bottom: 3px;
}
.tp-method {
  font-size: 0.82rem;
  line-height: 1.7;
  color: #44546a;
}
.tp-method.multiline { white-space: pre-line; }
.tp-detail {
  margin-top: 6px;
  padding: 7px 11px;
  background: #fff;
  border: 1px dashed #c3d6ee;
  border-radius: 7px;
  font-size: 0.8rem;
  line-height: 1.65;
  color: #2c5282;
}
.tp-detail :deep(b) {
  color: #5b21b6;
  font-weight: 700;
}
@media (max-width: 480px) {
  .tp-sub { display: none; }
  .tp-body { padding: 4px 12px 12px; }
}
</style>
