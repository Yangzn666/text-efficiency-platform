<script setup lang="ts">
// 错题漏洞簇 · 数学/408/英语/政治统一按「章节（考点簇）」聚合
//
// 病根：1342 道错题逐题刷永远刷不完，而同一章反复错 5 道，本质是 1 个漏洞。
// 政治早就有漏洞地图（380 考点簇），数学/408 却只能一条条翻。
// 这里把四个科目所有未掌握错题按 chapterName 聚成簇，展开即可就地复测（连对 2 次毕业）。
import { computed, ref } from 'vue'
import { useWrongProblemsStore } from '@/stores/wrongProblems'
import WrongRetestActions from '@/components/WrongRetestActions.vue'

const wp = useWrongProblemsStore()
wp.init()

const SUBJECT_LABEL: Record<string, string> = {
  math: '数学', ds: '数据结构', cs: '计组', os: '操作系统',
  network: '计网', english: '英语', politics: '政治'
}
const SUBJECT_ORDER = ['math', 'ds', 'cs', 'os', 'network', 'english', 'politics']

const subjectFilter = ref<'all' | string>('all')
const onlyStubborn = ref(true)
const minCount = ref(2)
const keyword = ref('')
const expanded = ref<Record<string, boolean>>({})

interface Cluster {
  key: string
  subject: string
  subjectLabel: string
  chapter: string
  problems: any[]
  count: number
  avgImportance: number
  masteredRate: number
  topTypes: { type: string; n: number }[]
  oldest: string
}

const clusters = computed<Cluster[]>(() => {
  const buckets: Record<string, Cluster> = {}
  wp.all.forEach(p => {
    if (p.mastered) return
    const subject = p.subject || 'math'
    const chapter = p.chapterName || p.sectionName || '未分类'
    const key = `${subject}::${chapter}`
    if (!buckets[key]) {
      buckets[key] = {
        key, subject, subjectLabel: SUBJECT_LABEL[subject] || subject, chapter,
        problems: [], count: 0, avgImportance: 0, masteredRate: 0,
        topTypes: [], oldest: ''
      }
    }
    const c = buckets[key]
    c.problems.push(p)
    c.count += 1
  })
  // 补算指标：平均重要度、簇内掌握率、错因 Top3、最早未复习日
  Object.values(buckets).forEach(c => {
    const totalInChapter = wp.all.filter(p => (p.subject || 'math') === c.subject && (p.chapterName || p.sectionName || '未分类') === c.chapter)
    const masteredInChapter = totalInChapter.filter(p => p.mastered).length
    c.masteredRate = totalInChapter.length ? Math.round((masteredInChapter / totalInChapter.length) * 100) : 0
    c.avgImportance = c.problems.reduce((s, p) => s + (p.importance || 3), 0) / (c.count || 1)
    const tm: Record<string, number> = {}
    c.problems.forEach(p => { const t = p.mistakeType || '未标注'; tm[t] = (tm[t] || 0) + 1 })
    c.topTypes = Object.entries(tm).map(([type, n]) => ({ type, n })).sort((a, b) => b.n - a.n).slice(0, 3)
    const dates = c.problems.map(p => p.lastReviewAt || p.createdAt || '').filter(Boolean).sort()
    c.oldest = dates[0] || ''
    // 簇内按「重要度高 → 最久没碰」排序，展开后直接照着做
    c.problems.sort((a, b) => (b.importance || 0) - (a.importance || 0) || String(a.lastReviewAt || '').localeCompare(String(b.lastReviewAt || '')))
  })
  return Object.values(buckets)
})

const filtered = computed(() => {
  let list = clusters.value
  if (subjectFilter.value !== 'all') list = list.filter(c => c.subject === subjectFilter.value)
  if (onlyStubborn.value) list = list.filter(c => c.count >= minCount.value)
  const k = keyword.value.trim().toLowerCase()
  if (k) list = list.filter(c => c.chapter.toLowerCase().includes(k) || c.topTypes.some(t => t.type.toLowerCase().includes(k)))
  return list.sort((a, b) => b.count - a.count || a.masteredRate - b.masteredRate)
})

const subjectCounts = computed(() => {
  const m: Record<string, number> = {}
  clusters.value.forEach(c => { m[c.subject] = (m[c.subject] || 0) + 1 })
  return m
})

const totals = computed(() => ({
  clusters: filtered.value.length,
  problems: filtered.value.reduce((s, c) => s + c.count, 0),
  stubborn: clusters.value.filter(c => c.count >= 3).length,
  worst: clusters.value.slice().sort((a, b) => b.count - a.count)[0]
}))

function toggle(key: string) { expanded.value[key] = !expanded.value[key] }
function pct(n: number) { return Math.max(4, n) + '%' }
</script>

<template>
  <div class="wc">
    <div class="wc-headline">
      <b>{{ totals.clusters }}</b> 个漏洞簇 · <b>{{ totals.problems }}</b> 道未掌握题；
      <template v-if="totals.worst">最重的一簇是「{{ totals.worst.chapter }}」{{ totals.worst.count }} 道</template>
    </div>

    <div class="wc-tools">
      <div class="chips">
        <button :class="{ on: subjectFilter === 'all' }" @click="subjectFilter = 'all'">全部 {{ clusters.length }}</button>
        <button v-for="s in SUBJECT_ORDER.filter(k => subjectCounts[k])" :key="s" :class="{ on: subjectFilter === s }" @click="subjectFilter = s">
          {{ SUBJECT_LABEL[s] }} {{ subjectCounts[s] }}
        </button>
      </div>
      <div class="wc-tools-r">
        <label class="wc-chk"><input v-model="onlyStubborn" type="checkbox" />只看 ≥{{ minCount }} 题</label>
        <select v-model.number="minCount" class="wc-sel">
          <option :value="2">≥2 题</option>
          <option :value="3">≥3 题</option>
          <option :value="5">≥5 题</option>
        </select>
        <input v-model="keyword" class="wc-inp" placeholder="搜章节 / 错因" />
      </div>
    </div>

    <p v-if="!filtered.length" class="wc-empty">当前筛选下没有成簇的错题——把「只看」关掉看看单题。</p>

    <div class="wc-list">
      <div v-for="c in filtered" :key="c.key" class="wc-card">
        <div class="wc-row" @click="toggle(c.key)">
          <div class="wc-main">
            <div class="wc-title">
              <span class="wc-subj" :class="c.subject">{{ c.subjectLabel }}</span>
              {{ c.chapter }}
              <span v-if="c.count >= 3" class="wc-hot">顽固</span>
            </div>
            <div class="wc-meta">
              <span>未掌握 <b>{{ c.count }}</b> 道</span>
              <span>簇内掌握率 {{ c.masteredRate }}%</span>
              <span>重要度 {{ c.avgImportance.toFixed(1) }}</span>
              <span v-for="t in c.topTypes" :key="t.type" class="wc-type">{{ t.type }} {{ t.n }}</span>
            </div>
            <div class="wc-bar"><i :style="{ width: pct(c.masteredRate), background: c.masteredRate >= 60 ? '#2e9e6b' : c.masteredRate >= 30 ? '#e8a33d' : '#e8604c' }" /></div>
          </div>
          <div class="wc-go">{{ expanded[c.key] ? '收起' : `展开 ${c.count} 题` }}</div>
        </div>

        <div v-if="expanded[c.key]" class="wc-items">
          <div v-for="p in c.problems" :key="p.id" class="wc-problem">
            <div class="wc-p-head">
              <div class="wc-p-title">{{ p.title }}</div>
              <WrongRetestActions :problem="p" />
            </div>
            <p class="wc-p-content">{{ (p.content || '').slice(0, 220) }}{{ (p.content || '').length > 220 ? '…' : '' }}</p>
            <p v-if="p.correction" class="wc-p-fix">订正锚点：{{ String(p.correction).slice(0, 160) }}{{ String(p.correction).length > 160 ? '…' : '' }}</p>
            <div class="wc-p-meta">
              <span>{{ p.mistakeType }}</span>
              <span v-if="p.lastReviewAt">上次 {{ p.lastReviewAt }}</span>
              <span v-if="p.correctStreak">连对 {{ p.correctStreak }}/2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wc { padding: 2px 0 20px; }
.wc-headline { background: #fff8f3; border: 1px solid #f0dcc8; color: #7a4a2b; border-radius: 12px; padding: 10px 12px; font-size: .88em; line-height: 1.6; margin-bottom: 12px; }
.wc-headline b { color: #b6402f; font-size: 1.15em; }
.wc-tools { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chips button { border: 1px solid #dfe5ee; background: #fff; color: #5a6472; border-radius: 999px; padding: 4px 11px; font-size: .8em; cursor: pointer; }
.chips button.on { background: #16345c; color: #fff; border-color: #16345c; }
.wc-tools-r { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.wc-chk { font-size: .78em; color: #5a6472; display: flex; align-items: center; gap: 4px; }
.wc-sel, .wc-inp { border: 1px solid #dfe5ee; border-radius: 8px; padding: 4px 8px; font-size: .8em; background: #fff; color: #3b4757; }
.wc-inp { min-width: 140px; }
.wc-empty { padding: 16px; background: #eef2f8; border-radius: 12px; color: #5a6472; font-size: .88em; }
.wc-list { display: grid; gap: 8px; }
.wc-card { background: #fff; border: 1px solid #e3e8ef; border-radius: 12px; overflow: hidden; }
.wc-row { display: flex; align-items: center; gap: 10px; padding: 11px 12px; cursor: pointer; }
.wc-main { flex: 1; min-width: 0; }
.wc-title { font-size: .95em; font-weight: 700; color: #22314a; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.wc-subj { font-size: .72em; font-weight: 700; padding: 1px 7px; border-radius: 999px; background: #eef2f8; color: #5a6472; }
.wc-subj.math { background: #fdecea; color: #b6402f; }
.wc-subj.english { background: #e8f5f4; color: #1f7a72; }
.wc-subj.politics { background: #eef6ea; color: #4a7a2b; }
.wc-hot { font-size: .7em; background: #b6402f; color: #fff; border-radius: 999px; padding: 1px 7px; }
.wc-meta { display: flex; flex-wrap: wrap; gap: 4px 10px; margin-top: 4px; font-size: .74em; color: #8a94a3; }
.wc-meta b { color: #b6402f; }
.wc-type { background: #f7f9fc; border-radius: 5px; padding: 0 5px; color: #5a6472; }
.wc-bar { height: 5px; background: #eef2f8; border-radius: 999px; margin-top: 7px; overflow: hidden; }
.wc-bar i { display: block; height: 100%; border-radius: 999px; }
.wc-go { flex: none; font-size: .78em; color: #16345c; background: #eef2f8; border-radius: 999px; padding: 4px 10px; }
.wc-items { border-top: 1px dashed #e3e8ef; padding: 8px 10px 10px; background: #fbfcfe; }
.wc-problem { background: #fff; border: 1px solid #e8edf4; border-radius: 10px; padding: 9px 10px; margin-top: 8px; }
.wc-p-head { display: flex; gap: 8px; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; }
.wc-p-title { font-size: .86em; font-weight: 700; color: #22314a; flex: 1; min-width: 160px; }
.wc-p-content { margin: 6px 0 0; font-size: .8em; color: #3b4757; line-height: 1.65; white-space: pre-wrap; }
.wc-p-fix { margin: 5px 0 0; font-size: .78em; color: #1f7a4d; line-height: 1.6; }
.wc-p-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 5px; font-size: .72em; color: #8a94a3; }
@media (max-width: 640px) {
  .wc-tools { flex-direction: column; align-items: stretch; }
  .wc-tools-r { justify-content: flex-start; }
  .wc-inp { flex: 1; min-width: 0; }
}
</style>
