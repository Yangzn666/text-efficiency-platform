<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { TRAP_LIST, TRAP_META, extractOptionTraps } from '@/utils/trapTaxonomy'
import {
  reviewKey,
  loadReview,
  saveReview,
  clearReview,
  isReviewComplete,
  hasAnyReview,
  type ReviewEntry
} from '@/utils/reviewStore'

// 逐题四步复盘卡：把"看完解析就翻篇"逼成"亲手拆一遍自己的思维"。
// 纯个人版，写 localStorage（见 utils/reviewStore.ts），不进共享版。
const props = defineProps<{ question: any }>()

const key = computed(() => reviewKey(props.question || {}))
const open = ref(false)
const isWrong = computed(() => {
  const q = props.question || {}
  return !!(q.userAnswer && q.correctAnswer && q.userAnswer !== q.correctAnswer)
})

const form = reactive<ReviewEntry>({ reason: '', locate: '', rewrite: '', trapId: null, updatedAt: 0 })

function reload() {
  const e = loadReview(key.value)
  form.reason = e?.reason || ''
  form.locate = e?.locate || ''
  form.rewrite = e?.rewrite || ''
  form.trapId = e?.trapId || null
  filled.value = hasAnyReview(e)
  complete.value = isReviewComplete(e)
}

const filled = ref(false)
const complete = ref(false)

watch(key, reload, { immediate: true })

let timer: number | undefined
function persist(patch: Partial<ReviewEntry>) {
  saveReview(key.value, patch)
  const now = loadReview(key.value)
  filled.value = hasAnyReview(now)
  complete.value = isReviewComplete(now)
}
// 文本框停止输入 500ms 自动存，避免每敲一个字就写盘
function onText() {
  if (timer) window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    persist({ reason: form.reason, locate: form.locate, rewrite: form.rewrite })
  }, 500)
}
function pickTrap(id: string) {
  form.trapId = form.trapId === id ? null : (id as any)
  persist({ trapId: form.trapId })
}
function reset() {
  clearReview(key.value)
  reload()
}

// 解析侧参考标注：这题各干扰项被打了哪些套路（帮用户对号入座，不替他决定）
const refTraps = computed(() => {
  const q = props.question || {}
  const list = extractOptionTraps(q.analysis)
  return list.map((o) => ({
    option: o.option,
    names: o.traps.map((t) => TRAP_META[t].name),
    isMine: isWrong.value && o.option === q.userAnswer
  }))
})

const steps = [
  { k: 'reason', tag: '① 我当时为什么选它', ph: '逼出那句真实理由：是"读着顺"？"看着像原文"？还是某个词没看懂只能猜？别写套话。' },
  { k: 'locate', tag: '② 定位句 + 我漏看的词', ph: '答案在第几段第几句？我漏看了哪个关键词 / 转折 / 指代？（draw on、but、non-lawyers 这类）' },
  { k: 'rewrite', tag: '③ 正确项 = 原文哪里的同义改写', ph: '正确选项把原文哪个说法换了层皮？写出来，下次见到同款改写就能秒认。' }
] as const
</script>

<template>
  <div class="qr" :class="{ 'qr-wrong': isWrong }">
    <div class="qr-head" @click="open = !open">
      <span class="qr-badge">🔬 逐题复盘</span>
      <span class="qr-steps">四步手术：为什么选它 → 定位漏词 → 同义改写 → 踩哪类坑</span>
      <span v-if="complete" class="qr-done">已复盘 ✓</span>
      <span v-else-if="filled" class="qr-part">进行中</span>
      <span v-else-if="isWrong" class="qr-tipme">这题最该拆</span>
      <span class="qr-toggle">{{ open ? '收起 ▴' : '展开 ▾' }}</span>
    </div>

    <div v-show="open" class="qr-body">
      <div v-for="s in steps" :key="s.k" class="qr-field">
        <label class="qr-label">{{ s.tag }}</label>
        <el-input
          v-model="(form as any)[s.k]"
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 5 }"
          resize="none"
          :placeholder="s.ph"
          @input="onText"
        />
      </div>

      <div class="qr-field">
        <label class="qr-label">④ 我踩的是哪类干扰套路</label>
        <div class="qr-traps">
          <button
            v-for="t in TRAP_LIST"
            :key="t.id"
            type="button"
            class="qr-chip"
            :class="{ on: form.trapId === t.id }"
            :style="form.trapId === t.id
              ? { color: '#fff', borderColor: t.color, background: t.color }
              : { color: t.color, borderColor: t.color + '66', background: t.color + '10' }"
            :title="t.sign"
            @click="pickTrap(t.id)"
          >{{ t.name }}</button>
        </div>
        <div v-if="form.trapId" class="qr-picked">
          你标注：<b :style="{ color: TRAP_META[form.trapId as any].color }">{{ TRAP_META[form.trapId as any].name }}</b>
          —— {{ TRAP_META[form.trapId as any].sign }}
        </div>
        <div v-if="refTraps.length" class="qr-ref">
          <span class="qr-ref-t">解析参考：</span>
          <span v-for="r in refTraps" :key="r.option" class="qr-ref-item" :class="{ mine: r.isMine }">
            {{ r.option }} {{ r.names.join('/') }}<template v-if="r.isMine">（你选的）</template>
          </span>
        </div>
      </div>

      <div class="qr-foot">
        <span class="qr-note">复盘自动保存在本机，汇总进「错因深度分析 → 你自标的坑」。</span>
        <button v-if="filled" type="button" class="qr-clear" @click="reset">清空本题</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qr {
  margin: 12px 0 4px;
  border: 1px solid #e2e8f0;
  border-left: 3px solid #7c3aed;
  border-radius: 10px;
  background: linear-gradient(135deg, #faf9ff 0%, #f5f3ff 100%);
}
.qr.qr-wrong { border-left-color: #e5484d; }
.qr-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  cursor: pointer;
  user-select: none;
  flex-wrap: wrap;
}
.qr-badge { font-size: 0.8rem; font-weight: 700; color: #4c1d95; letter-spacing: 0.02em; }
.qr-steps { font-size: 0.72rem; color: #94a3b8; flex: 1; min-width: 120px; }
.qr-done { font-size: 0.72rem; color: #059669; font-weight: 700; }
.qr-part { font-size: 0.72rem; color: #d97706; font-weight: 600; }
.qr-tipme { font-size: 0.72rem; color: #e5484d; font-weight: 700; background: #fee2e2; padding: 1px 8px; border-radius: 9px; }
.qr-toggle { font-size: 0.74rem; color: #7c3aed; }
.qr-body { padding: 2px 14px 12px; display: flex; flex-direction: column; gap: 11px; }
.qr-field { display: flex; flex-direction: column; gap: 5px; }
.qr-label { font-size: 0.78rem; font-weight: 600; color: #475569; }
.qr-traps { display: flex; flex-wrap: wrap; gap: 6px; }
.qr-chip {
  font-family: inherit;
  font-size: 0.76rem;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 11px;
  border: 1px solid;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}
.qr-chip:hover { transform: translateY(-1px); }
.qr-chip.on { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); }
.qr-picked { font-size: 0.78rem; color: #334155; }
.qr-ref { font-size: 0.72rem; color: #94a3b8; display: flex; flex-wrap: wrap; gap: 8px; align-items: baseline; margin-top: 2px; }
.qr-ref-t { color: #64748b; }
.qr-ref-item { background: #f1f5f9; padding: 1px 7px; border-radius: 8px; }
.qr-ref-item.mine { background: #fef3c7; color: #92400e; font-weight: 600; }
.qr-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.qr-note { font-size: 0.7rem; color: #a1a1aa; }
.qr-clear { font-family: inherit; font-size: 0.72rem; color: #e5484d; background: none; border: none; cursor: pointer; text-decoration: underline; }
:deep(.qr-body .el-textarea__inner) { font-size: 0.84rem; box-shadow: 0 0 0 1px #e2e8f0 inset; border-radius: 8px; }
@media (max-width: 640px) {
  .qr-steps { display: none; }
}
</style>
