<script setup lang="ts">
// 英语背诵台 · 作文模板句库 + 长难句回译（P2-8）
//
// 站内此前只能「看」模板（WritingLearning）和长难句清单，不能「背」。
// 这一页把两份静态数据变成首字母骨架卡：看骨架/中文译文出声背 → 翻面对照 → 自判排期。
import { computed, onMounted, ref } from 'vue'
import {
  loadReciteCards, reciteCards, reciteLoading, reciteError,
  buildReciteQueue, skeleton, wordCount, gradeCard, isDue, isNew,
  recordOf, reciteStats, resetRecite, MAX_BOX,
  type ReciteCard, type ReciteGrade
} from '@/data/englishRecite'

const track = ref<'writing' | 'sentence'>('writing')
const groupFilter = ref('all')
const yearFilter = ref('all')
const started = ref(false)
const queue = ref<string[]>([])
const pos = ref(0)
const flipped = ref(false)
const done = ref(0)
const again = ref(0)

const trackCards = computed(() => reciteCards.value.filter(c => c.track === track.value))
const groups = computed(() => {
  const m = new Map<string, number>()
  trackCards.value.forEach(c => m.set(c.group, (m.get(c.group) || 0) + 1))
  return [...m.entries()]
})
const years = computed(() => {
  const set = new Set<number>()
  reciteCards.value.forEach(c => { if (c.year) set.add(c.year) })
  return [...set].sort((a, b) => b - a)
})

const filtered = computed(() => trackCards.value.filter(c => {
  if (track.value === 'sentence') {
    if (yearFilter.value !== 'all' && c.year !== Number(yearFilter.value)) return false
  } else if (groupFilter.value !== 'all' && c.group !== groupFilter.value) return false
  return true
}))

const stats = computed(() => reciteStats(filtered.value))
const cur = computed<ReciteCard | null>(() => {
  const id = queue.value[pos.value]
  return id ? reciteCards.value.find(c => c.id === id) || null : null
})
const curRec = computed(() => (cur.value ? recordOf(cur.value.id) : undefined))
const sessionDone = computed(() => started.value && !cur.value)
const progressPct = computed(() => (queue.value.length ? Math.round((pos.value / queue.value.length) * 100) : 0))

function begin() {
  queue.value = buildReciteQueue(filtered.value, 15)
  pos.value = 0
  done.value = 0
  again.value = 0
  flipped.value = false
  started.value = true
}

function reveal() { flipped.value = true }
function rate(g: ReciteGrade) {
  const c = cur.value
  if (!c) return
  gradeCard(c.id, g)
  done.value += 1
  if (g === 'again') {
    again.value += 1
    queue.value.push(c.id)   // 当天回炉，排到队尾
  }
  pos.value += 1
  flipped.value = false
}

function switchTrack(t: 'writing' | 'sentence') {
  track.value = t
  groupFilter.value = 'all'
  yearFilter.value = 'all'
  started.value = false
  queue.value = []
}

function onReset() {
  if (!confirm('清空全部背诵进度？此操作不可撤销（只影响本机浏览器）。')) return
  resetRecite()
  started.value = false
  queue.value = []
}

onMounted(() => { loadReciteCards() })
</script>

<template>
  <div class="recite">
    <div class="recite-header">
      <h2 class="recite-title">🗣️ 英语背诵台</h2>
      <p class="recite-sub">作文模板句库 + 长难句回译 · 首字母骨架自测 · 忘了当天回炉</p>
      <p class="recite-how">
        看法：长词只留首字母（如 <code>w_____</code>），短词保留。出声把整句背出来，
        再点「显示原文」核对；背不出的点「忘了」，今天会再出现一次。
      </p>
    </div>

    <div class="track-tabs">
      <button class="track-tab" :class="{ on: track === 'writing' }" @click="switchTrack('writing')">
        ✍️ 作文模板（{{ reciteCards.filter(c => c.track === 'writing').length }}）
      </button>
      <button class="track-tab" :class="{ on: track === 'sentence' }" @click="switchTrack('sentence')">
        🔄 长难句回译（{{ reciteCards.filter(c => c.track === 'sentence').length }}）
      </button>
    </div>

    <div v-if="reciteLoading" class="tip">读取背诵数据…</div>
    <div v-else-if="reciteError" class="tip bad">{{ reciteError }}</div>

    <template v-else>
      <div class="stat-row">
        <div class="stat-box"><div class="stat-num" style="color:#b6402f">{{ stats.due }}</div><div class="stat-label">今日到期</div></div>
        <div class="stat-box"><div class="stat-num" style="color:#3a6df0">{{ stats.neu }}</div><div class="stat-label">新卡</div></div>
        <div class="stat-box"><div class="stat-num" style="color:#2fa36b">{{ stats.mastered }}</div><div class="stat-label">已掌握</div></div>
        <div class="stat-box"><div class="stat-num">{{ stats.total }}</div><div class="stat-label">范围内总数</div></div>
      </div>

      <div class="filters">
        <template v-if="track === 'writing'">
          <select v-model="groupFilter" class="sel">
            <option value="all">全部句库（{{ groups.length }} 组）</option>
            <option v-for="[g, n] in groups" :key="g" :value="g">{{ g }}（{{ n }}）</option>
          </select>
        </template>
        <template v-else>
          <select v-model="yearFilter" class="sel">
            <option value="all">全部年份（2001-2025）</option>
            <option v-for="y in years" :key="y" :value="String(y)">{{ y }} 年</option>
          </select>
        </template>
        <button class="btn-start" :disabled="!filtered.length" @click="begin">
          {{ started ? '重开一组（15 张）' : '开始背诵 15 张' }}
        </button>
        <button class="btn-reset" @click="onReset">重置记录</button>
      </div>

      <div v-if="started && cur" class="session">
        <div class="meta-bar">
          <span>本组 {{ pos + 1 }} / {{ queue.length }} · 已背 {{ done }} 张<template v-if="again"> · 回炉 {{ again }}</template></span>
          <span class="box-tag" v-if="curRec">{{ '★'.repeat(curRec.box) }}{{ '☆'.repeat(MAX_BOX - curRec.box) }}</span>
          <span class="box-tag new" v-else>新卡</span>
        </div>
        <div class="prog-track"><i :style="{ width: progressPct + '%' }"></i></div>

        <div class="card-face">
          <div class="face-top">
            <span class="group-tag">{{ cur.group }}</span>
            <span class="label-tag">{{ cur.label }}</span>
            <span class="wc-tag">{{ wordCount(cur.en) }} 词</span>
          </div>
          <div v-if="cur.track === 'sentence' && cur.zh" class="zh-hint">
            <span class="zh-label">中文译文（回译线索）</span>
            <p class="zh-text">{{ cur.zh }}</p>
          </div>
          <div v-else-if="cur.note" class="note-hint">{{ cur.note }}</div>
          <pre class="skeleton">{{ skeleton(cur.en) }}</pre>
          <p class="skeleton-tip">先出声背完整句，再翻面核对</p>
        </div>

        <div v-if="flipped" class="card-face answer">
          <div class="face-label">原文</div>
          <p class="answer-en">{{ cur.en }}</p>
          <div v-if="cur.note" class="answer-note">{{ cur.note }}</div>
          <pre v-if="cur.extra" class="answer-extra">{{ cur.extra }}</pre>
        </div>

        <div v-if="!flipped" class="actions">
          <button class="btn-reveal" @click="reveal">显示原文</button>
        </div>
        <div v-else class="grade-row">
          <button class="btn again" @click="rate('again')"><b>忘了</b><span>今天再出现</span></button>
          <button class="btn hard" @click="rate('hard')"><b>有点卡</b><span>明天再来</span></button>
          <button class="btn good" @click="rate('good')"><b>背出来了</b><span>下次更远</span></button>
        </div>
      </div>

      <div v-else-if="sessionDone" class="empty">
        <div class="empty-emoji">🎉</div>
        <div class="empty-title">本组背完：{{ done }} 张，回炉 {{ again }} 张</div>
        <div class="empty-sub">背出的卡按 1→2→4→7 天往后排；回炉的今天还会出现一次。</div>
        <button class="btn-start" @click="begin">再来一组</button>
      </div>

      <div v-else class="empty">
        <div class="empty-emoji">🗣️</div>
        <div class="empty-title">选好范围，开始出声背</div>
        <div class="empty-sub">
          当前范围：到期 {{ stats.due }} · 新卡 {{ stats.neu }} · 已掌握 {{ stats.mastered }}。
          <template v-if="!filtered.length">这个范围暂时没有卡片，换一组。</template>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.recite { max-width: 780px; margin: 0 auto; padding: 8px 2px 40px; }
.recite-header { text-align: center; margin-bottom: 14px; }
.recite-title { font-size: 1.8em; color: #1a1a2e; margin: 0 0 6px; font-weight: 800; }
.recite-sub { color: #7a8798; margin: 0 0 8px; font-size: 1em; }
.recite-how { max-width: 620px; margin: 0 auto; font-size: .82em; line-height: 1.7; color: #8a94a3; }
.recite-how code { background: #f1f4f9; border-radius: 4px; padding: 1px 5px; color: #b6402f; }
.track-tabs { display: flex; gap: 8px; justify-content: center; margin-bottom: 14px; }
.track-tab { border: 1px solid #dfe5ee; background: #fff; color: #5a6472; border-radius: 999px; padding: 8px 16px; font-size: .95em; cursor: pointer; }
.track-tab.on { background: #16345c; color: #fff; border-color: #16345c; }
.tip { text-align: center; color: #8a94a3; padding: 26px 0; }
.tip.bad { color: #b6402f; }
.stat-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px; }
.stat-box { background: #f7f8fa; border: 1px solid #eef1f5; border-radius: 12px; padding: 12px 6px; text-align: center; }
.stat-num { font-size: 1.5em; font-weight: 800; line-height: 1.1; }
.stat-label { font-size: .82em; color: #5b6b7f; margin-top: 4px; }
.filters { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 14px; }
.sel { border: 1px solid #dfe5ee; border-radius: 8px; padding: 6px 10px; font-size: .9em; color: #3b4757; background: #fff; max-width: 100%; }
.btn-start { background: #16345c; color: #fff; border: none; border-radius: 10px; padding: 8px 16px; font-size: .92em; font-weight: 700; cursor: pointer; }
.btn-start:disabled { opacity: .5; cursor: not-allowed; }
.btn-reset { background: #fff; color: #8a94a3; border: 1px solid #dfe5ee; border-radius: 10px; padding: 7px 12px; font-size: .85em; cursor: pointer; }
.session { background: #fff; border: 1px solid #eceff3; border-radius: 16px; padding: 16px 16px 20px; box-shadow: 0 4px 18px rgba(30, 60, 110, .06); }
.meta-bar { display: flex; justify-content: space-between; align-items: center; font-size: .9em; color: #5b6b7f; margin-bottom: 8px; }
.box-tag { font-weight: 700; color: #f0a92e; letter-spacing: 1px; }
.box-tag.new { color: #3a6df0; }
.prog-track { height: 6px; border-radius: 999px; background: #eef2f8; overflow: hidden; margin-bottom: 14px; }
.prog-track i { display: block; height: 100%; background: linear-gradient(90deg, #16345c, #409eff); }
.card-face { border-radius: 14px; padding: 18px 16px; margin-bottom: 12px; }
.card-face:not(.answer) { background: linear-gradient(135deg, #fbfcfe, #f1f4fa); border: 1px solid #e6ebf3; }
.card-face.answer { background: #f4fbf6; border: 1px solid #cdeed6; }
.face-top { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-bottom: 10px; }
.group-tag { background: #16345c; color: #fff; border-radius: 6px; padding: 2px 8px; font-size: .78em; }
.label-tag { background: #eef2fb; color: #3a6df0; border-radius: 6px; padding: 2px 8px; font-size: .78em; }
.wc-tag { color: #9aa5b3; font-size: .78em; margin-left: auto; }
.zh-hint { background: #fff8e6; border-left: 3px solid #e6a23c; border-radius: 8px; padding: 10px 12px; margin-bottom: 10px; }
.zh-label { font-size: .76em; color: #b07a1a; }
.zh-text { margin: 4px 0 0; font-size: 1em; line-height: 1.7; color: #3b4757; }
.note-hint { font-size: .82em; color: #7a8798; margin-bottom: 8px; }
.skeleton {
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: .98em; line-height: 1.9; color: #22314a;
  white-space: pre-wrap; word-break: break-word; margin: 6px 0 0;
}
.skeleton-tip { text-align: center; font-size: .78em; color: #9aa5b3; margin: 10px 0 0; }
.face-label { font-size: .82em; color: #93a1b3; margin-bottom: 6px; letter-spacing: 1px; }
.answer-en { font-size: 1.15em; line-height: 1.8; color: #1f2d3d; margin: 0 0 8px; font-weight: 600; }
.answer-note { font-size: .84em; color: #5b6b7f; background: #fff; border: 1px dashed #d7e3ee; border-radius: 8px; padding: 8px 10px; margin-bottom: 8px; }
.answer-extra { font-size: .82em; line-height: 1.75; color: #3b4757; background: #fff; border: 1px solid #e3ecf5; border-radius: 8px; padding: 10px; white-space: pre-wrap; margin: 0; }
.actions { text-align: center; }
.btn-reveal { background: #16345c; color: #fff; border: none; border-radius: 12px; padding: 14px 38px; font-size: 1.1em; font-weight: 700; cursor: pointer; }
.grade-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.btn { border: none; border-radius: 12px; padding: 13px 8px; cursor: pointer; color: #fff; display: flex; flex-direction: column; align-items: center; gap: 3px; font-size: 1em; }
.btn b { font-size: 1.1em; }
.btn span { font-size: .76em; opacity: .9; }
.btn.again { background: #e6544f; }
.btn.hard { background: #e6a23c; }
.btn.good { background: #2fa36b; }
.empty { text-align: center; padding: 30px 10px; background: #fff; border: 1px solid #eceff3; border-radius: 16px; }
.empty-emoji { font-size: 2.6em; }
.empty-title { font-size: 1.2em; font-weight: 700; color: #1f2d3d; margin: 8px 0 6px; }
.empty-sub { color: #7a8798; font-size: .92em; margin-bottom: 14px; }
@media (max-width: 480px) {
  .stat-row { grid-template-columns: repeat(2, 1fr); }
  .skeleton { font-size: .9em; }
  .grade-row { gap: 6px; }
  .btn { padding: 12px 4px; }
}
</style>
