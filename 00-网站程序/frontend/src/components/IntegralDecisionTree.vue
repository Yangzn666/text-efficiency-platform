<script setup lang="ts">
import katex from 'katex'
import 'katex/dist/katex.min.css'
import type { TreeRow } from '@/data/mathTopicGuides'

const props = defineProps<{ rows: TreeRow[] }>()

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
function texify(text: string): string {
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g)
  return parts.map(part => {
    if (part.startsWith('$$') && part.endsWith('$$') && part.length > 4) {
      try { return katex.renderToString(part.slice(2, -2), { displayMode: true, throwOnError: false, strict: false }) } catch { return escapeHtml(part) }
    }
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      try { return katex.renderToString(part.slice(1, -1), { displayMode: false, throwOnError: false, strict: false }) } catch { return escapeHtml(part) }
    }
    return escapeHtml(part).replace(/\n/g, '<br>')
  }).join('')
}

const bigThree = [
  { name: '格林', color: 'gold', obj: '平面闭合曲线 ↔ 二重积分', memo: '管平面曲线' },
  { name: '高斯', color: 'red', obj: '空间封闭曲面 ↔ 三重积分', memo: '管空间曲面' },
  { name: '斯托克斯', color: 'purple', obj: '空间闭合曲线 ↔ 曲面积分', memo: '管空间曲线' },
]

// 只有当这棵树的结论里出现三大公式时，才附上「三大公式对照」面板
const showThree = () => props.rows.some(r => (r.title || '') + (r.note || '') !== '' && /格林|高斯|斯托克斯/.test((r.title || '') + (r.note || '')))

function pad(depth: number) {
  return { paddingLeft: depth * 14 + 'px' }
}
</script>

<template>
  <div class="dtree">
    <div class="dtree-tip">
      <span class="dtree-tip-ico"></span>
      <span>从上往下走，每答一题缩进一层，走到叶子就是该用的公式。</span>
    </div>

    <div class="dtree-rows">
      <template v-for="(r, i) in rows" :key="i">
        <!-- 问题节点 -->
        <div v-if="r.kind === 'q'" class="d-q" :style="pad(r.depth)">
          <span class="d-q-badge">?</span>
          <span class="d-q-text" v-html="texify(r.text || '')"></span>
        </div>

        <!-- 分类节点（继续往下） -->
        <div v-else-if="r.kind === 'cat'" class="d-cat" :style="pad(r.depth)">
          <span class="d-cat-chip" v-html="texify(r.cond || '')"></span>
          <span class="d-cat-arrow">↳</span>
          <span class="d-cat-hint">{{ r.hint }}</span>
        </div>

        <!-- 叶子（结论公式） -->
        <div v-else class="d-leaf" :class="'c-' + r.color" :style="pad(r.depth)">
          <span class="d-cond" v-html="texify(r.cond || '')"></span>
          <span class="d-arrow">→</span>
          <div class="d-leaf-card">
            <div class="d-leaf-title" v-html="texify(r.title || '')"></div>
            <div class="d-leaf-note" v-html="texify(r.note || '')"></div>
          </div>
        </div>
      </template>
    </div>

    <div v-if="showThree()" class="dtree-three">
      <div class="dt-three-head">🧭 三大公式一句话对照</div>
      <div class="dt-three-list">
        <div v-for="t in bigThree" :key="t.name" class="dt-three-item" :class="'c-' + t.color">
          <span class="dt3-name">{{ t.name }}</span>
          <span class="dt3-obj" v-html="texify(t.obj)"></span>
          <span class="dt3-memo">{{ t.memo }}</span>
        </div>
      </div>
      <div class="dt-three-memo">口诀：格林管平面曲线、高斯管空间曲面、斯托克斯管空间曲线。判「维度 + 对象 + 是否闭合」，公式自动出。</div>
    </div>
  </div>
</template>

<style scoped>
.dtree {
  --blue: #2f6db5;
  --green: #2f8f5b;
  --gold: #d4a012;
  --red: #c0453f;
  --purple: #7b4bab;
  margin: 4px 0 20px;
  background: linear-gradient(160deg, #f7f9fc 0%, #eef3fa 100%);
  border: 1px solid #dce3ed;
  border-radius: 16px;
  padding: 16px 16px 18px;
}
.dtree-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.98rem;
  color: #16345c;
  background: #fff8e6;
  border: 1px dashed #e0b64d;
  border-radius: 10px;
  padding: 8px 12px;
  margin-bottom: 14px;
  line-height: 1.6;
}
.dtree-tip-ico { font-size: 1.2rem; }
.dtree-rows { display: flex; flex-direction: column; gap: 7px; }

/* 问题节点 */
.d-q {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}
.d-q-badge {
  flex-shrink: 0;
  width: 22px; height: 22px;
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #16345c, #1e4576);
  color: #ffc53d; font-weight: 800; font-size: 0.95rem;
}
.d-q-text {
  font-size: 1.06rem; font-weight: 700; color: #16345c; letter-spacing: 0.01em;
}

/* 分类节点 */
.d-cat { display: flex; align-items: center; gap: 8px; }
.d-cat-chip {
  font-size: 0.98rem; font-weight: 700; color: #fff;
  background: linear-gradient(135deg, #16345c, #2a5488);
  padding: 3px 12px; border-radius: 8px;
}
.d-cat-arrow { color: #8aa0bd; font-weight: 700; }
.d-cat-hint { font-size: 0.85rem; color: #7c8ba0; }

/* 叶子节点 */
.d-leaf { display: flex; align-items: stretch; gap: 8px; }
.d-cond {
  flex-shrink: 0;
  align-self: center;
  min-width: 78px;
  font-size: 0.9rem; font-weight: 700; color: #33445c;
  background: #fff; border: 1px solid #d7e0ec; border-radius: 8px;
  padding: 5px 9px; text-align: center; line-height: 1.4;
}
.d-arrow { align-self: center; color: #9fb0c4; font-weight: 800; }
.d-leaf-card {
  flex: 1; min-width: 0;
  overflow-x: auto;
  background: #fff; border-radius: 10px;
  border: 1px solid #e3e9f2;
  border-left: 4px solid var(--blue);
  padding: 8px 12px;
  box-shadow: 0 2px 8px rgba(22, 52, 92, 0.06);
}
.d-leaf-title { font-size: 1.06rem; font-weight: 800; color: #1a2332; line-height: 1.5; }
.d-leaf-note { font-size: 0.92rem; color: #4a5b70; line-height: 1.6; margin-top: 2px; }

.c-blue .d-leaf-card { border-left-color: var(--blue); }
.c-green .d-leaf-card { border-left-color: var(--green); }
.c-gold .d-leaf-card { border-left-color: var(--gold); }
.c-red .d-leaf-card { border-left-color: var(--red); }
.c-purple .d-leaf-card { border-left-color: var(--purple); }
.c-gold .d-cond { background: #fff6df; border-color: #e6c86a; color: #8a6a10; }
.c-red .d-cond { background: #fdeceb; border-color: #e3a9a5; color: #9c3a35; }
.c-green .d-cond { background: #eaf6ee; border-color: #a9d5b8; color: #2c6b45; }
.c-purple .d-cond { background: #f1ecfb; border-color: #c3b2e6; color: #5b3f8f; }
.c-blue .d-cond { background: #eaf1fa; border-color: #adc7e6; color: #285a93; }

/* 三大公式对照 */
.dtree-three {
  margin-top: 16px;
  background: #fff;
  border: 1px solid #e3e9f2;
  border-radius: 12px;
  padding: 12px 14px;
}
.dt-three-head { font-size: 1.02rem; font-weight: 800; color: #16345c; margin-bottom: 10px; }
.dt-three-list { display: flex; flex-direction: column; gap: 8px; }
.dt-three-item {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  padding: 8px 12px; border-radius: 9px; background: #f7f9fc;
  border-left: 4px solid var(--blue);
}
.dt-three-item.c-gold { border-left-color: var(--gold); }
.dt-three-item.c-red { border-left-color: var(--red); }
.dt-three-item.c-purple { border-left-color: var(--purple); }
.dt3-name { font-size: 1.02rem; font-weight: 800; color: #1a2332; min-width: 60px; }
.dt3-obj { font-size: 0.95rem; color: #33445c; flex: 1; min-width: 160px; }
.dt3-memo { font-size: 0.85rem; color: #7c8ba0; }
.dt-three-memo { margin-top: 10px; font-size: 0.92rem; color: #8a6a10; background: #fff8e6; border-radius: 8px; padding: 8px 10px; line-height: 1.6; }

/* 公式不换行：让 KaTeX 整体保持一行，容器溢出时横向滚动 */
.dtree :deep(.katex) { white-space: nowrap; font-size: 1.02em; }
.dtree :deep(.katex-display) { margin: 0.2em 0; overflow-x: auto; overflow-y: hidden; }
.d-leaf-card :deep(.katex), .d-q-text :deep(.katex), .d-cond :deep(.katex), .dt3-obj :deep(.katex), .d-cat-chip :deep(.katex) { font-size: 1.02em; }

@media (max-width: 768px) {
  .dtree { padding: 12px 10px 14px; }
  .d-cond { min-width: 66px; font-size: 0.82rem; padding: 4px 6px; }
  .d-leaf-title { font-size: 1rem; }
  .d-leaf-note { font-size: 0.86rem; }
  .d-q-text { font-size: 1rem; }
  .dt3-obj { min-width: 120px; }
}
</style>
