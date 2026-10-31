<script setup lang="ts">
// 英语真题 · 二刷只刷错题（P2-12）
//
// 病根：reading/index.json 里已经躺着 213 道「当时做错」的真题（含原选项、正确答案、
// 每个错选项的 errorAnalysis），但站内只能从头再刷一遍 860 道——错题没有独立入口。
// 这里把错题抽出来单独成卷：只做错过的，做对连对 2 次即毕业，不再占二刷时间。
import { computed, onMounted, ref } from 'vue'
import { logReview } from '@/data/reviewLog'

const BASE_URL = import.meta.env.BASE_URL || '/'
const REDO_KEY = 'english-redo-v1'
const GRADUATE_STREAK = 2

interface Q {
  year: number
  section: string
  textNumber: number
  title?: string
  number: number
  type?: string
  stem: string
  options: { label: string; text: string }[]
  correctAnswer: string
  userAnswer?: string
  analysis?: string
  errorAnalysis?: Record<string, string>
  tips?: string
}

const all = ref<Q[]>([])
const loading = ref(true)
const error = ref('')
const yearFilter = ref('all')
const sectionFilter = ref('all')
const onlyPending = ref(true)

interface RedoRec { streak: number; last: string; right: number; wrong: number; lastResult: 'right' | 'wrong' }
const redo = ref<Record<string, RedoRec>>({})
const key = (q: Q) => `${q.year}-${q.section}-${q.textNumber}-${q.number}`

function loadRedo() {
  try { redo.value = JSON.parse(localStorage.getItem(REDO_KEY) || '{}') } catch { redo.value = {} }
}
function saveRedo() {
  try { localStorage.setItem(REDO_KEY, JSON.stringify(redo.value)) } catch { /* 忽略配额错误 */ }
}
const isGraduated = (q: Q) => (redo.value[key(q)]?.streak || 0) >= GRADUATE_STREAK

// ---------- 会话 ----------
const started = ref(false)
const queue = ref<Q[]>([])
const pos = ref(0)
const picked = ref('')
const revealed = ref(false)
const sessionRight = ref(0)
const sessionWrong = ref(0)

const cur = computed<Q | null>(() => queue.value[pos.value] || null)
const curRec = computed(() => (cur.value ? redo.value[key(cur.value)] : undefined))
const sessionDone = computed(() => started.value && !cur.value)

const wrongAll = computed(() => all.value.filter(q =>
  q.userAnswer && q.userAnswer !== q.correctAnswer && q.section !== 'New Question Types'
))
const years = computed(() => [...new Set(wrongAll.value.map(q => q.year))].sort((a, b) => b - a))
const filtered = computed(() => wrongAll.value.filter(q => {
  if (yearFilter.value !== 'all' && q.year !== Number(yearFilter.value)) return false
  if (sectionFilter.value !== 'all' && q.section !== sectionFilter.value) return false
  if (onlyPending.value && isGraduated(q)) return false
  return true
}))
const stats = computed(() => {
  const total = wrongAll.value.length
  const grad = wrongAll.value.filter(isGraduated).length
  return { total, grad, pending: total - grad }
})

function begin() {
  // 最久没练的优先，其次连对 1 次的优先（差一步毕业）
  queue.value = [...filtered.value].sort((a, b) => {
    const ra = redo.value[key(a)], rb = redo.value[key(b)]
    const sa = ra ? ra.streak : 0, sb = rb ? rb.streak : 0
    if (sa !== sb) return sb - sa
    return String(ra?.last || '').localeCompare(String(rb?.last || ''))
  }).slice(0, 20)
  pos.value = 0
  picked.value = ''
  revealed.value = false
  sessionRight.value = 0
  sessionWrong.value = 0
  started.value = true
  ensureHeavy(queue.value[0]?.year)
}

function choose(label: string) {
  if (revealed.value || !cur.value) return
  picked.value = label
  revealed.value = true
  const k = key(cur.value)
  const right = label === cur.value.correctAnswer
  const prev = redo.value[k] || { streak: 0, last: '', right: 0, wrong: 0, lastResult: 'wrong' as const }
  const next: RedoRec = {
    streak: right ? prev.streak + 1 : 0,
    last: new Date().toISOString().slice(0, 10),
    right: prev.right + (right ? 1 : 0),
    wrong: prev.wrong + (right ? 0 : 1),
    lastResult: right ? 'right' : 'wrong'
  }
  redo.value = { ...redo.value, [k]: next }
  saveRedo()
  if (right) sessionRight.value += 1
  else sessionWrong.value += 1
  // 记进全站流水：今日负荷的「错题复测」和趋势图都会+1
  logReview('wrong', 1)
}

function next() {
  pos.value += 1
  picked.value = ''
  revealed.value = false
  ensureHeavy(cur.value?.year)
}

// ---------- 重字段（解析/错项分析）按年懒加载 ----------
const heavy = ref<Record<string, Partial<Q>>>({})
const heavyYears = new Set<number>()
function ensureHeavy(year?: number) {
  if (!year || heavyYears.has(year)) return
  heavyYears.add(year)
  fetch(`${BASE_URL}data/english/reading/by-year/${year}.json`)
    .then(r => (r.ok ? r.json() : {}))
    .then((map: Record<string, Partial<Q>>) => {
      const merged = { ...heavy.value }
      Object.keys(map).forEach(k => { merged[k] = { ...(merged[k] || {}), ...map[k] } })
      heavy.value = merged
    })
    .catch(() => { /* 解析拿不到不影响判分 */ })
}

const curAnalysis = computed(() => {
  if (!cur.value) return ''
  const h = heavy.value[key(cur.value)] || {}
  return h.analysis || cur.value.analysis || ''
})
const curErrorWhy = computed(() => {
  if (!cur.value || !picked.value) return ''
  if (picked.value === cur.value.correctAnswer) return ''
  const h = heavy.value[key(cur.value)] || {}
  const ea = (h.errorAnalysis || cur.value.errorAnalysis || {}) as Record<string, string>
  return ea[picked.value] || '该选项不符合原文语境。'
})

onMounted(async () => {
  loadRedo()
  try {
    const r = await fetch(`${BASE_URL}data/english/reading/index.json`)
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const data = await r.json()
    let local: Record<string, string> = {}
    try { local = JSON.parse(localStorage.getItem('readingUserAnswers') || '{}') } catch { local = {} }
    all.value = (data.questions || []).map((q: Q) => {
      const k = `${q.year}-${q.section}-${q.textNumber}-${q.number}`
      const ua = local[k] || q.userAnswer
      return { ...q, userAnswer: ua }
    })
  } catch (e: any) {
    error.value = e?.message || '读取真题索引失败'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="redo">
    <div class="redo-header">
      <h2 class="redo-title">🔁 真题二刷 · 只刷错题</h2>
      <p class="redo-sub">从 {{ stats.total }} 道做错过的真题里抽题重做 · 连对 {{ GRADUATE_STREAK }} 次毕业，不再占二刷时间</p>
    </div>

    <div v-if="loading" class="tip">读取真题索引…</div>
    <div v-else-if="error" class="tip bad">读取失败：{{ error }}</div>

    <template v-else>
      <div class="stat-row">
        <div class="stat-box"><div class="stat-num" style="color:#b6402f">{{ stats.total }}</div><div class="stat-label">错题总数</div></div>
        <div class="stat-box"><div class="stat-num" style="color:#e6a23c">{{ stats.pending }}</div><div class="stat-label">待二刷</div></div>
        <div class="stat-box"><div class="stat-num" style="color:#2fa36b">{{ stats.grad }}</div><div class="stat-label">已毕业</div></div>
        <div class="stat-box"><div class="stat-num">{{ filtered.length }}</div><div class="stat-label">当前范围</div></div>
      </div>

      <div class="filters">
        <select v-model="yearFilter" class="sel">
          <option value="all">全部年份</option>
          <option v-for="y in years" :key="y" :value="String(y)">{{ y }} 年</option>
        </select>
        <select v-model="sectionFilter" class="sel">
          <option value="all">传统阅读 + 完型</option>
          <option value="Traditional Reading">只看传统阅读</option>
          <option value="Use of English">只看完型填空</option>
        </select>
        <label class="chk"><input v-model="onlyPending" type="checkbox" /> 排除已毕业</label>
        <button class="btn-start" :disabled="!filtered.length" @click="begin">
          {{ started ? '重开一组（最多 20 题）' : '开始二刷（最多 20 题）' }}
        </button>
      </div>

      <div v-if="started && cur" class="session">
        <div class="meta-bar">
          <span>{{ pos + 1 }} / {{ queue.length }} · 对 {{ sessionRight }} · 错 {{ sessionWrong }}</span>
          <span class="streak-tag" :class="{ hot: (curRec?.streak || 0) > 0 }">
            连对 {{ curRec?.streak || 0 }} / {{ GRADUATE_STREAK }}
          </span>
        </div>

        <div class="q-meta">
          <span class="tag year">{{ cur.year }}</span>
          <span class="tag sec">{{ cur.section === 'Use of English' ? '完型' : '阅读' }}</span>
          <span v-if="cur.section === 'Traditional Reading'" class="tag">Text {{ cur.textNumber }}</span>
          <span v-if="cur.type" class="tag type">{{ cur.type }}</span>
          <span class="qno">第 {{ cur.number }} 题</span>
        </div>

        <p class="stem">{{ cur.stem }}</p>

        <div class="options">
          <button
            v-for="o in cur.options" :key="o.label"
            class="opt"
            :class="{
              right: revealed && o.label === cur.correctAnswer,
              wrong: revealed && o.label === picked && o.label !== cur.correctAnswer,
              chosen: picked === o.label
            }"
            :disabled="revealed"
            @click="choose(o.label)"
          >
            <span class="opt-label">{{ o.label }}</span>
            <span class="opt-text">{{ o.text }}</span>
          </button>
        </div>

        <div v-if="revealed" class="verdict" :class="picked === cur.correctAnswer ? 'ok' : 'bad'">
          <div class="verdict-line">
            {{ picked === cur.correctAnswer ? '✅ 二刷正确' : '❌ 又错了' }}
            <span class="ans">正确答案 {{ cur.correctAnswer }} · 你选 {{ picked }}</span>
            <span v-if="(curRec?.streak || 0) >= GRADUATE_STREAK" class="grad-tag">🏅 已毕业</span>
          </div>
          <p v-if="curErrorWhy" class="why"><b>你选的 {{ picked }}：</b>{{ curErrorWhy }}</p>
          <div v-if="curAnalysis" class="analysis"><b>解析：</b><span v-html="curAnalysis" /></div>
        </div>

        <div class="actions">
          <button v-if="revealed" class="btn-next" @click="next">
            {{ pos + 1 >= queue.length ? '完成这一组' : '下一题' }}
          </button>
          <button v-else class="btn-hint" @click="revealed = true">不会了，直接看答案</button>
        </div>
      </div>

      <div v-else-if="sessionDone" class="empty">
        <div class="empty-emoji">📌</div>
        <div class="empty-title">这组做完：对 {{ sessionRight }} / {{ sessionRight + sessionWrong }}</div>
        <div class="empty-sub">连对 {{ GRADUATE_STREAK }} 次的题已经毕业，下次组卷不再出现。</div>
        <button class="btn-start" @click="begin">再来一组</button>
      </div>

      <div v-else class="empty">
        <div class="empty-emoji">🔁</div>
        <div class="empty-title">选年份，开始二刷错题</div>
        <div class="empty-sub">当前范围 {{ filtered.length }} 道；做对一次记一次连对，连对 {{ GRADUATE_STREAK }} 次毕业。</div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.redo { max-width: 820px; margin: 0 auto; padding: 8px 2px 40px; }
.redo-header { text-align: center; margin-bottom: 14px; }
.redo-title { font-size: 1.8em; color: #1a1a2e; margin: 0 0 6px; font-weight: 800; }
.redo-sub { color: #7a8798; margin: 0; font-size: .95em; }
.tip { text-align: center; color: #8a94a3; padding: 26px 0; }
.tip.bad { color: #b6402f; }
.stat-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px; }
.stat-box { background: #f7f8fa; border: 1px solid #eef1f5; border-radius: 12px; padding: 12px 6px; text-align: center; }
.stat-num { font-size: 1.5em; font-weight: 800; line-height: 1.1; }
.stat-label { font-size: .82em; color: #5b6b7f; margin-top: 4px; }
.filters { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 14px; }
.sel { border: 1px solid #dfe5ee; border-radius: 8px; padding: 6px 10px; font-size: .9em; color: #3b4757; background: #fff; }
.chk { font-size: .84em; color: #5a6472; display: flex; align-items: center; gap: 4px; }
.btn-start { background: #16345c; color: #fff; border: none; border-radius: 10px; padding: 8px 16px; font-size: .92em; font-weight: 700; cursor: pointer; }
.btn-start:disabled { opacity: .5; cursor: not-allowed; }
.session { background: #fff; border: 1px solid #eceff3; border-radius: 16px; padding: 16px; box-shadow: 0 4px 18px rgba(30, 60, 110, .06); }
.meta-bar { display: flex; justify-content: space-between; align-items: center; font-size: .9em; color: #5b6b7f; margin-bottom: 10px; }
.streak-tag { background: #eef2fb; color: #3a6df0; border-radius: 999px; padding: 3px 10px; font-size: .82em; }
.streak-tag.hot { background: #e9f7ef; color: #1f7a4d; }
.q-meta { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-bottom: 8px; }
.tag { background: #f1f4f9; color: #5a6472; border-radius: 6px; padding: 2px 8px; font-size: .78em; }
.tag.year { background: #16345c; color: #fff; }
.tag.sec { background: #eef2fb; color: #3a6df0; }
.tag.type { background: #fff4e6; color: #b07a1a; }
.qno { margin-left: auto; font-size: .8em; color: #9aa5b3; }
.stem { font-size: 1.02em; line-height: 1.8; color: #1f2d3d; margin: 0 0 12px; }
.options { display: grid; gap: 8px; }
.opt { display: flex; gap: 10px; align-items: flex-start; text-align: left; background: #fbfcfe; border: 1.5px solid #e3e9f1; border-radius: 12px; padding: 11px 12px; font-size: .98em; color: #22314a; cursor: pointer; transition: .12s; }
.opt:hover:not(:disabled) { border-color: #9db8e0; background: #f4f8ff; }
.opt:disabled { cursor: default; }
.opt.right { border-color: #2fa36b; background: #eefaf2; }
.opt.wrong { border-color: #e6544f; background: #fdf0ef; }
.opt-label { width: 24px; height: 24px; flex: none; border-radius: 50%; background: #fff; border: 1.5px solid #c9d4e2; display: grid; place-items: center; font-weight: 800; font-size: .82em; }
.opt.right .opt-label { background: #2fa36b; border-color: #2fa36b; color: #fff; }
.opt.wrong .opt-label { background: #e6544f; border-color: #e6544f; color: #fff; }
.opt-text { line-height: 1.65; }
.verdict { border-radius: 12px; padding: 12px 14px; margin-top: 12px; font-size: .92em; }
.verdict.ok { background: #eefaf2; border: 1px solid #c9ecd6; }
.verdict.bad { background: #fdf0ef; border: 1px solid #f5cfcb; }
.verdict-line { font-weight: 800; color: #22314a; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.verdict.ok .verdict-line { color: #1f7a4d; }
.verdict.bad .verdict-line { color: #b6402f; }
.ans { font-weight: 500; font-size: .86em; color: #5a6472; }
.grad-tag { font-size: .8em; background: #fff; border: 1px solid #c9ecd6; color: #1f7a4d; border-radius: 999px; padding: 1px 8px; }
.why { margin: 8px 0 0; line-height: 1.7; color: #3b4757; }
.analysis { margin: 6px 0 0; line-height: 1.75; color: #3b4757; white-space: pre-wrap; }
.actions { text-align: center; margin-top: 14px; }
.btn-next { background: #16345c; color: #fff; border: none; border-radius: 12px; padding: 12px 34px; font-size: 1em; font-weight: 700; cursor: pointer; }
.btn-hint { background: #fff; color: #8a94a3; border: 1px solid #dfe5ee; border-radius: 10px; padding: 8px 16px; font-size: .88em; cursor: pointer; }
.empty { text-align: center; padding: 30px 10px; background: #fff; border: 1px solid #eceff3; border-radius: 16px; }
.empty-emoji { font-size: 2.6em; }
.empty-title { font-size: 1.2em; font-weight: 700; color: #1f2d3d; margin: 8px 0 6px; }
.empty-sub { color: #7a8798; font-size: .92em; margin-bottom: 14px; }
@media (max-width: 480px) {
  .stat-row { grid-template-columns: repeat(2, 1fr); }
  .stem { font-size: .98em; }
}
</style>
