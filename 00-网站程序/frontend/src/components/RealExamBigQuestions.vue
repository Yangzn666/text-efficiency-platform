<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { renderExamMarkdown } from '@/utils/examRender'

type Result = 'correct' | 'partial' | 'wrong'
interface BigQ {
  slug: string
  subject: string
  year: number
  index: number
  chapterCode: string
  chapterName: string
  score: number
  tags: string[]
  totalAnswers: number | null
  wrongCount: number | null
  stem: string
  explanation: string
  subQuestions?: unknown
  hasImages?: boolean
  imageCount?: number
}
interface Rec { result: Result; date: string; attempts: number }
interface Payload { meta: { count: number; bySubject: Record<string, number> }; items: BigQ[] }
interface ProgressFile { version?: number; updatedAt?: string; records: Record<string, Rec> }

const SUBJECTS: Record<string, { name: string; color: string }> = {
  ds: { name: '数据结构', color: '#409EFF' },
  co: { name: '组成原理', color: '#67C23A' },
  os: { name: '操作系统', color: '#E6A23C' },
  cn: { name: '计算机网络', color: '#F56C6C' }
}

const loading = ref(true)
const items = ref<BigQ[]>([])
const subjFilter = ref<string>('all')
const yearFilter = ref<string>('all')
const viewMode = ref<'all' | 'todo' | 'wrong'>('all')
const expanded = ref<Set<string>>(new Set())
const showAns = ref<Set<string>>(new Set())

// ---- 记录：disk(progress.json 真相源) + local(localStorage 叠加) ----
const LS_KEY = 'exam408-big-v2'
const OLD_KEY = 'exam408-big-done-v1' // 迁移旧的"已二刷"布尔标记
const diskRecords = ref<Record<string, Rec>>({})
const localRecords = ref<Record<string, Rec>>({})
const records = computed<Record<string, Rec>>(() => ({ ...diskRecords.value, ...localRecords.value }))

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function loadLocal() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      localRecords.value = JSON.parse(raw) || {}
      return
    }
    // 迁移旧版 done 集合 → 记为 partial（未记录具体对错，先算刷过）
    const old = localStorage.getItem(OLD_KEY)
    if (old) {
      const arr = JSON.parse(old)
      if (Array.isArray(arr) && arr.length) {
        const m: Record<string, Rec> = {}
        arr.forEach((slug: string) => { m[slug] = { result: 'partial', date: todayStr(), attempts: 1 } })
        localRecords.value = m
        saveLocal()
      }
    }
  } catch {
    localRecords.value = {}
  }
}
function saveLocal() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(localRecords.value)) } catch { /* ignore */ }
}
function setResult(slug: string, r: Result) {
  const cur = localRecords.value[slug]
  if (cur && cur.result === r) {
    delete localRecords.value[slug] // 再次点同一结果 = 取消
  } else {
    localRecords.value[slug] = { result: r, date: todayStr(), attempts: (cur?.attempts || 0) + 1 }
  }
  localRecords.value = { ...localRecords.value }
  saveLocal()
}
function clearRec(slug: string) {
  if (localRecords.value[slug]) {
    delete localRecords.value[slug]
    localRecords.value = { ...localRecords.value }
    saveLocal()
  }
}
function rec(slug: string): Rec | undefined { return records.value[slug] }

function toggleExpand(slug: string) {
  const s = new Set(expanded.value)
  if (s.has(slug)) s.delete(slug); else s.add(slug)
  expanded.value = s
}
function toggleAns(slug: string) {
  const s = new Set(showAns.value)
  if (s.has(slug)) s.delete(slug); else s.add(slug)
  showAns.value = s
}

const years = computed(() => [...new Set(items.value.map(i => i.year))].sort((a, b) => b - a))

const filtered = computed(() => {
  let list = items.value
  if (subjFilter.value !== 'all') list = list.filter(i => i.subject === subjFilter.value)
  if (yearFilter.value !== 'all') list = list.filter(i => i.year === Number(yearFilter.value))
  const r = records.value
  if (viewMode.value === 'todo') list = list.filter(i => !r[i.slug])
  else if (viewMode.value === 'wrong') list = list.filter(i => r[i.slug] && r[i.slug].result !== 'correct')
  return [...list].sort((a, b) => a.subject.localeCompare(b.subject) || b.year - a.year || a.index - b.index)
})

const stats = computed(() => {
  const total = items.value.length
  const r = records.value
  let correct = 0, partial = 0, wrong = 0
  for (const k in r) {
    const v = r[k].result
    if (v === 'correct') correct++
    else if (v === 'wrong') wrong++
    else if (v === 'partial') partial++
  }
  const doneN = correct + partial + wrong
  return { total, doneN, correct, partial, wrong, pct: total ? Math.round((doneN / total) * 100) : 0 }
})

const bySubject = computed(() => {
  const r = records.value
  const out: Record<string, { total: number; done: number; correct: number; partial: number; wrong: number }> = {}
  for (const k in SUBJECTS) out[k] = { total: 0, done: 0, correct: 0, partial: 0, wrong: 0 }
  items.value.forEach(i => {
    const o = out[i.subject]
    if (!o) return
    o.total++
    const rr = r[i.slug]
    if (rr) {
      o.done++
      if (rr.result === 'correct') o.correct++
      else if (rr.result === 'wrong') o.wrong++
      else o.partial++
    }
  })
  return out
})

const rendered = new Map<string, string>()
function md(text: string, key: string): string {
  if (rendered.has(key)) return rendered.get(key)!
  const html = renderExamMarkdown(text || '')
  rendered.set(key, html)
  return html
}

async function load() {
  loading.value = true
  const base = import.meta.env.BASE_URL || '/'
  try {
    const [rq, pq] = await Promise.all([
      fetch(`${base}data/408-exam/questions.json?t=${Date.now()}`).then(r => (r.ok ? r.json() : null)).catch(() => null),
      fetch(`${base}data/408-exam/progress.json?t=${Date.now()}`).then(r => (r.ok ? r.json() : null)).catch(() => null)
    ])
    if (rq) items.value = (rq as Payload).items || []
    if (pq && (pq as ProgressFile).records) diskRecords.value = (pq as ProgressFile).records
  } catch (e) {
    console.error('load 408 big questions failed', e)
  } finally {
    loading.value = false
  }
  loadLocal()
}
onMounted(load)

function wrongRate(i: BigQ): number | null {
  if (i.totalAnswers && i.wrongCount != null) return Math.round((i.wrongCount / i.totalAnswers) * 100)
  return null
}
function subjPct(k: string): number {
  const o = bySubject.value[k]
  return o && o.total ? Math.round((o.done / o.total) * 100) : 0
}
</script>

<template>
  <div class="bigq">
    <div class="bigq-head">
      <div class="bigq-title">
        <h2>📝 408 真题·综合应用题（大题）</h2>
        <p class="bigq-sub">2009–2026 共 {{ stats.total }} 道 · 刷过自动记录、错题可回炉 · 完整离线可用</p>
      </div>
      <div class="bigq-prog">
        <div class="prog-num"><b>{{ stats.doneN }}</b> / {{ stats.total }} 已刷</div>
        <div class="prog-bar"><span :style="{ width: stats.pct + '%' }"></span></div>
        <div class="prog-lab">
          <span><i class="dot ok"></i>对 {{ stats.correct }}</span>
          <span><i class="dot half"></i>半 {{ stats.partial }}</span>
          <span><i class="dot bad"></i>错 {{ stats.wrong }}</span>
        </div>
      </div>
    </div>

    <!-- 分科进度 -->
    <div class="subj-stats">
      <div v-for="(v, k) in SUBJECTS" :key="k" class="subj-cell" :class="{ active: subjFilter === k }" @click="subjFilter = subjFilter === k ? 'all' : k">
        <span class="sc-name" :style="{ color: v.color }">{{ v.name }}</span>
        <span class="sc-num">{{ bySubject[k]?.done || 0 }}/{{ bySubject[k]?.total || 0 }}</span>
        <div class="sc-bar"><span :style="{ width: subjPct(k) + '%', background: v.color }"></span></div>
        <span class="sc-mini"><i class="ok">{{ bySubject[k]?.correct || 0 }}</i>·<i class="half">{{ bySubject[k]?.partial || 0 }}</i>·<i class="bad">{{ bySubject[k]?.wrong || 0 }}</i></span>
      </div>
    </div>

    <div class="bigq-filter">
      <div class="chips">
        <button class="chip" :class="{ on: subjFilter === 'all' }" @click="subjFilter = 'all'">全部</button>
        <button v-for="(v, k) in SUBJECTS" :key="k" class="chip"
                :class="{ on: subjFilter === k }"
                :style="subjFilter === k ? { background: v.color, borderColor: v.color } : {}"
                @click="subjFilter = k">{{ v.name }}</button>
      </div>
      <div class="filter-right">
        <div class="viewmode">
          <button :class="{ on: viewMode === 'all' }" @click="viewMode = 'all'">全部</button>
          <button :class="{ on: viewMode === 'todo' }" @click="viewMode = 'todo'">只看未刷</button>
          <button :class="{ on: viewMode === 'wrong' }" @click="viewMode = 'wrong'">错题回炉</button>
        </div>
        <select v-model="yearFilter" class="ysel">
          <option value="all">全部年份</option>
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="bigq-loading">加载中…</div>
    <div v-else-if="!filtered.length" class="bigq-empty">
      {{ viewMode === 'todo' ? '这个筛选下没有未刷的题了 🎉' : viewMode === 'wrong' ? '还没有需要回炉的错题，继续保持！' : '没有符合条件的题目' }}
    </div>

    <div v-else class="bigq-list">
      <div v-for="q in filtered" :key="q.slug" class="qcard"
           :class="[rec(q.slug) ? 'res-' + rec(q.slug).result : '', { open: expanded.has(q.slug) }]">
        <div class="qcard-hd" @click="toggleExpand(q.slug)">
          <span class="q-badge" :style="{ background: SUBJECTS[q.subject]?.color || '#909399' }">
            {{ SUBJECTS[q.subject]?.name || q.subject }}
          </span>
          <span class="q-year">{{ q.year }}</span>
          <span class="q-idx">第{{ q.index }}题</span>
          <span class="q-chap">{{ q.chapterName }}</span>
          <span v-if="rec(q.slug)" class="q-res" :class="rec(q.slug)!.result">
            {{ rec(q.slug)!.result === 'correct' ? '✓ 对' : rec(q.slug)!.result === 'wrong' ? '✗ 错' : '◐ 半' }}
          </span>
          <span class="q-score">{{ q.score }}分</span>
          <span v-if="wrongRate(q) !== null" class="q-wrong" title="码砖全站正确率">易错{{ wrongRate(q) }}%</span>
          <span class="q-caret">{{ expanded.has(q.slug) ? '▲' : '▼' }}</span>
        </div>

        <div v-show="expanded.has(q.slug)" class="qcard-body">
          <div class="q-tags" v-if="q.tags && q.tags.length">
            <span v-for="t in q.tags" :key="t" class="tag">{{ t }}</span>
          </div>
          <div class="q-stem md-body" v-html="md(q.stem, q.slug + ':stem')"></div>

          <div class="q-actions">
            <button class="btn" :class="{ ghost: !showAns.has(q.slug) }" @click="toggleAns(q.slug)">
              {{ showAns.has(q.slug) ? '收起参考答案与解析' : '显示参考答案与解析' }}
            </button>
            <span class="q-src">来源 {{ q.slug }}</span>
          </div>

          <!-- 作答记录 -->
          <div class="q-record">
            <span class="qr-label">我的作答：</span>
            <button class="rbtn ok" :class="{ on: rec(q.slug)?.result === 'correct' }" @click="setResult(q.slug, 'correct')">✓ 做对</button>
            <button class="rbtn half" :class="{ on: rec(q.slug)?.result === 'partial' }" @click="setResult(q.slug, 'partial')">◐ 半对</button>
            <button class="rbtn bad" :class="{ on: rec(q.slug)?.result === 'wrong' }" @click="setResult(q.slug, 'wrong')">✗ 做错</button>
            <span v-if="rec(q.slug)" class="qr-meta">{{ rec(q.slug)!.date }} · 第 {{ rec(q.slug)!.attempts }} 次</span>
            <button v-if="rec(q.slug)" class="qr-clear" @click="clearRec(q.slug)">清除</button>
          </div>

          <div v-show="showAns.has(q.slug)" class="q-ans md-body">
            <div class="q-ans-hd">参考答案 · 解析</div>
            <div v-html="md(q.explanation, q.slug + ':expl')"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bigq { --ink: #1f2d3d; --muted: #5b6b7f; --line: #e4ebf3; color: var(--ink); }
.bigq-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; margin-bottom: 14px; }
.bigq-title h2 { margin: 0 0 4px; font-size: 1.35rem; font-weight: 800; }
.bigq-sub { margin: 0; color: var(--muted); font-size: 0.9rem; }
.bigq-prog { min-width: 200px; }
.prog-num { font-size: 0.95rem; color: var(--muted); }
.prog-num b { color: #f0a820; font-size: 1.15rem; }
.prog-bar { height: 8px; background: #eef2f7; border-radius: 6px; overflow: hidden; margin: 4px 0; }
.prog-bar span { display: block; height: 100%; background: linear-gradient(90deg, #ffc53d, #f0a820); }
.prog-lab { font-size: 0.8rem; color: var(--muted); display: flex; gap: 12px; justify-content: flex-end; align-items: center; }
.dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 4px; vertical-align: middle; }
.dot.ok { background: #67c23a; }
.dot.half { background: #e6a23c; }
.dot.bad { background: #f56c6c; }

.subj-stats { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }
.subj-cell { flex: 1 1 150px; border: 1px solid var(--line); border-radius: 10px; padding: 8px 12px; cursor: pointer; background: #fff; transition: all .2s; }
.subj-cell:hover { box-shadow: 0 2px 10px rgba(13,33,55,.07); }
.subj-cell.active { border-color: #16345c; box-shadow: 0 0 0 1px #16345c inset; }
.sc-name { font-size: .85rem; font-weight: 700; }
.sc-num { float: right; font-size: .85rem; color: var(--muted); }
.sc-bar { height: 6px; background: #eef2f7; border-radius: 4px; overflow: hidden; margin: 6px 0 4px; clear: both; }
.sc-bar span { display: block; height: 100%; }
.sc-mini { font-size: .75rem; color: #90a0b4; }
.sc-mini .ok { color: #67c23a; font-style: normal; }
.sc-mini .half { color: #e6a23c; font-style: normal; }
.sc-mini .bad { color: #f56c6c; font-style: normal; }

.bigq-filter { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; padding: 12px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); margin-bottom: 14px; }
.chips { display: flex; gap: 8px; flex-wrap: wrap; }
.chip { border: 1px solid var(--line); background: #fff; color: var(--muted); border-radius: 16px; padding: 5px 14px; font-size: 0.9rem; cursor: pointer; transition: all .2s; }
.chip.on { color: #fff; background: #16345c; border-color: #16345c; }
.filter-right { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.viewmode { display: inline-flex; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
.viewmode button { border: 0; background: #fff; color: var(--muted); padding: 5px 12px; font-size: .85rem; cursor: pointer; }
.viewmode button + button { border-left: 1px solid var(--line); }
.viewmode button.on { background: #16345c; color: #fff; }
.ysel { padding: 5px 8px; border: 1px solid var(--line); border-radius: 8px; font-size: 0.9rem; color: var(--ink); }

.bigq-loading, .bigq-empty { padding: 40px; text-align: center; color: var(--muted); }
.bigq-list { display: flex; flex-direction: column; gap: 10px; }

.qcard { border: 1px solid var(--line); border-left: 4px solid var(--line); border-radius: 10px; background: #fff; overflow: hidden; transition: box-shadow .2s; }
.qcard:hover { box-shadow: 0 3px 14px rgba(13,33,55,.08); }
.qcard.res-correct { border-left-color: #67c23a; }
.qcard.res-partial { border-left-color: #e6a23c; }
.qcard.res-wrong { border-left-color: #f56c6c; }
.qcard-hd { display: flex; align-items: center; gap: 10px; padding: 12px 16px; cursor: pointer; flex-wrap: wrap; }
.q-badge { color: #fff; font-size: .78rem; padding: 2px 8px; border-radius: 5px; }
.q-year { font-weight: 700; color: #16345c; }
.q-idx { color: var(--muted); font-size: .85rem; }
.q-chap { color: var(--ink); font-size: .9rem; flex: 1 1 auto; min-width: 120px; }
.q-res { font-size: .76rem; padding: 1px 8px; border-radius: 5px; font-weight: 700; }
.q-res.correct { background: #f0f9eb; color: #529b2e; }
.q-res.partial { background: #fdf6ec; color: #b88230; }
.q-res.wrong { background: #fef0f0; color: #c45656; }
.q-score { background: #fff7e6; color: #d48806; font-size: .8rem; padding: 1px 8px; border-radius: 5px; }
.q-wrong { background: #fff1f0; color: #cf1322; font-size: .8rem; padding: 1px 8px; border-radius: 5px; }
.q-caret { color: #b3bfce; font-size: .8rem; }

.qcard-body { padding: 4px 18px 18px; border-top: 1px dashed var(--line); }
.q-tags { margin: 10px 0; display: flex; gap: 6px; flex-wrap: wrap; }
.tag { background: #eef4ff; color: #2f5aa8; font-size: .78rem; padding: 1px 8px; border-radius: 4px; }
.q-actions { display: flex; align-items: center; gap: 10px; margin-top: 14px; flex-wrap: wrap; }
.btn { border: 1px solid #16345c; background: #16345c; color: #fff; border-radius: 8px; padding: 6px 14px; font-size: .88rem; cursor: pointer; }
.btn.ghost { background: #fff; color: #16345c; }
.q-src { color: #b3bfce; font-size: .78rem; margin-left: auto; }

.q-record { display: flex; align-items: center; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
.qr-label { font-size: .85rem; color: var(--muted); }
.rbtn { border: 1px solid var(--line); background: #fff; border-radius: 8px; padding: 4px 12px; font-size: .85rem; cursor: pointer; color: var(--muted); transition: all .15s; }
.rbtn.ok.on { background: #67c23a; border-color: #67c23a; color: #fff; }
.rbtn.half.on { background: #e6a23c; border-color: #e6a23c; color: #fff; }
.rbtn.bad.on { background: #f56c6c; border-color: #f56c6c; color: #fff; }
.qr-meta { font-size: .78rem; color: #90a0b4; }
.qr-clear { border: 0; background: none; color: #b3bfce; font-size: .78rem; cursor: pointer; text-decoration: underline; }

.q-ans { margin-top: 14px; padding: 14px 16px; background: #f6f9ff; border: 1px solid #e2ecff; border-radius: 10px; }
.q-ans-hd { font-weight: 700; color: #2f5aa8; margin-bottom: 6px; }

/* markdown 正文通用样式 */
.md-body { line-height: 1.75; font-size: 1.02rem; }
.md-body :deep(p) { margin: .5em 0; }
.md-body :deep(strong) { color: #0d2137; }
.md-body :deep(table) { border-collapse: collapse; margin: .8em 0; font-size: .95rem; }
.md-body :deep(th), .md-body :deep(td) { border: 1px solid #cfd8e3; padding: 6px 12px; }
.md-body :deep(th) { background: #eef4ff; }
.md-body :deep(img) { max-width: 100%; height: auto; border: 1px solid var(--line); border-radius: 8px; margin: 8px 0; background: #fff; }
.md-body :deep(.ex-table-wrap) { overflow-x: auto; }
.md-body :deep(.ex-code) { margin: .8em 0; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; background: #f7f9fb; }
.md-body :deep(.ex-code-hd) { background: #eef2f6; color: #57606a; font-size: .75rem; padding: 3px 12px; font-family: 'JetBrains Mono', monospace; }
.md-body :deep(.ex-code pre) { margin: 0; padding: 12px 14px; overflow-x: auto; }
.md-body :deep(.ex-code code) { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: .9rem; }
.md-body :deep(.ex-diagram) { margin: .9em 0; border: 1px solid #d9e6ff; border-radius: 8px; overflow: hidden; background: #fbfdff; }
.md-body :deep(.ex-diagram-hd) { background: linear-gradient(90deg,#eef4ff,#f7fbff); color: #2f5aa8; font-size: .85rem; font-weight: 700; padding: 6px 12px; }
.md-body :deep(.ex-diagram-tag) { margin-left: 8px; font-weight: 400; color: #8aa0c0; font-size: .72rem; }
.md-body :deep(.ex-diagram-body) { margin: 0; padding: 12px 14px; overflow-x: auto; }
.md-body :deep(.ex-diagram-body code) { font-family: 'JetBrains Mono', monospace; font-size: .88rem; color: #456; white-space: pre; }

@media (max-width: 640px) {
  .q-chap { flex-basis: 100%; order: 5; }
  .md-body { font-size: .98rem; }
  .subj-cell { flex-basis: 45%; }
}
</style>
