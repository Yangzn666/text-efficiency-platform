<script setup lang="ts">
// 政治 · 图谱（记忆图谱 + 逻辑图谱合并成一个页签，内部切换，少一次页签跳转）
import { ref, defineAsyncComponent } from 'vue'

const PoliticsMindMap = defineAsyncComponent(() => import('@/components/PoliticsMindMap.vue'))
const PoliticsLogicMap = defineAsyncComponent(() => import('@/components/PoliticsLogicMap.vue'))

const which = ref<'mind' | 'logic'>((localStorage.getItem('politics-atlas-v1') as any) === 'logic' ? 'logic' : 'mind')
function pick(k: 'mind' | 'logic') {
  which.value = k
  try { localStorage.setItem('politics-atlas-v1', k) } catch { /* noop */ }
}
</script>

<template>
  <div class="atlas">
    <div class="at-bar">
      <div class="at-seg">
        <button :class="{ on: which === 'mind' }" @click="pick('mind')">🧠 记忆图谱 · 骨架串联</button>
        <button :class="{ on: which === 'logic' }" @click="pick('logic')">🧭 逻辑图谱 · 提问信号→正解帽子</button>
      </div>
      <span class="at-hint">单选定位混淆 → 看右边「逻辑图谱」；多选框架模糊 → 看左边「记忆图谱」</span>
    </div>
    <PoliticsMindMap v-if="which === 'mind'" />
    <PoliticsLogicMap v-else />
  </div>
</template>

<style scoped>
.atlas { --at-navy: #16345c; --at-muted: #5b6b7f; --at-line: #e4ebf3; --at-gold: #ffc53d; display: flex; flex-direction: column; gap: 12px; }
.at-bar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.at-seg { display: inline-flex; border: 1px solid var(--at-line); border-radius: 10px; overflow: hidden; }
.at-seg button { border: none; background: #fff; padding: 9px 16px; font-size: .86rem; cursor: pointer; color: var(--at-muted); }
.at-seg button.on { background: var(--at-navy); color: #fff; font-weight: 700; }
.at-hint { font-size: .78rem; color: var(--at-muted); }
.at-hint::before { content: '💡 '; }
</style>
