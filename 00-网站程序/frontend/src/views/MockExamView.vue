<script setup lang="ts">
// 限时模考（P0-4）· 英语阅读自动判分 + 408/数学答题卡计时自评
//
// 只做一件事：把「平时刷题」变成「考场节奏」——倒计时到点强制交卷，
// 英语当场出分并保存答案（下次二刷错题会自动收录），408/数学用答题卡自评后记入成绩账。
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  PRESETS, mockHistory, loadMockHistory, saveMockRecord, historyOf, mmss,
  type MockPreset, type MockRecord
} from '@/data/mockExam'
import { logReview } from '@/data/reviewLog'

const BASE_URL = import.meta.env.BASE_URL || '/'

type Phase = 'setup' | 'running' | 'result'
const phase = ref<Phase>('setup')
const preset = ref<MockPreset>(PRESETS[0])
const startedAt = ref(0)
const timeLeft = ref(0)
const finishedAt = ref(0)
const result = ref<MockRecord | null>(null)
let timer: number | null = null

// ---------- 英语阅读 ----------
const years = Array.from({ length: 21 }, (_, i) => 2005 + i).reverse()
const year = ref(2023)
const textNo = ref(1)
const indexLoaded = ref(false)
const indexError = ref('')
const allQ = ref<any[]>([])
const article = ref('')
const answers = ref<Record<string, string>>({})
const heavy = ref<Record<string, any>>({})
const heavyYears = new Set<number>()

const paper = computed(() => allQ.value
  .filter(q => q.year === Number(year.value) && q.section === 'Traditional Reading' && q.textNumber === Number(textNo.value))
  .sort((a, b) => a.number - b.number))

const KEY = (q: any) => `${q.year}-${q.section}-${q.textNumber}-${q.number}`

function loadIndex() {
  if (indexLoaded.value) return
  indexLoaded.value = true
  fetch(`${BASE_URL}data/english/reading/index.json`)
    .then(r => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
    .then(d => { allQ.value = d.questions || [] })
    .catch(e => { indexError.value = e?.message || '读取题库失败' })
}

function loadPaperYear(y: number) {
  if (heavyYears.has(y)) return
  heavyYears.add(y)
  fetch(`${BASE_URL}data/english/reading/by-year/${y}.json`)
    .then(r => (r.ok ? r.json() : {}))
    .then((map: Record<string, any>) => {
      heavy.value = { ...heavy.value, ...map }
    })
    .catch(() => { /* 无原文不影响答题 */ })
}

// ---------- 答题卡（408 / 数学） ----------
const sheet = ref<string[]>([])
function resetSheet(total: number) { sheet.value = Array(total).fill('') }
function cycle(i: number) {
  const order = ['', 'right', 'wrong']
  const cur = sheet.value[i] || ''
  sheet.value[i] = order[(order.indexOf(cur) + 1) % order.length]
}
// 原文与题目可能异步到达，任一就绪后补齐文章
watch([paper, heavy], () => {
  const first = paper.value[0]
  if (first) article.value = heavy.value[KEY(first)]?.article || ''
})

const sheetRight = computed(() => sheet.value.filter(s => s === 'right').length)
const sheetWrong = computed(() => sheet.value.filter(s => s === 'wrong').length)
const sheetMarked = computed(() => sheet.value.filter(Boolean).length)
const sheetUnmarked = computed(() => sheet.value.length - sheetMarked.value)

// ---------- 通用 ----------
const total = computed(() => (preset.value.mode === 'english' ? paper.value.length || preset.value.total : preset.value.total))
const answered = computed(() => (preset.value.mode === 'english'
  ? Object.keys(answers.value).length
  : sheetMarked.value))
const usedSec = computed(() => Math.max(0, (finishedAt.value || Date.now()) - startedAt.value) / 1000)
const lowTime = computed(() => timeLeft.value <= 60)

function start(p: MockPreset) {
  preset.value = p
  phase.value = 'running'
  startedAt.value = Date.now()
  finishedAt.value = 0
  timeLeft.value = p.minutes * 60
  answers.value = {}
  article.value = ''
  result.value = null
  resetSheet(p.total)
  if (p.mode === 'english') {
    loadIndex()
    loadPaperYear(Number(year.value))
  }
  if (timer) window.clearInterval(timer)
  timer = window.setInterval(() => {
    timeLeft.value -= 1
    if (timeLeft.value <= 0) submit(true)
  }, 1000)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function stopTimer() {
  if (timer) { window.clearInterval(timer); timer = null }
}

function submit(auto = false) {
  if (phase.value !== 'running') return
  if (!auto) {
    const left = total.value - answered.value
    if (left > 0 && !confirm(`还有 ${left} 题未${preset.value.mode === 'english' ? '作答' : '判定'}，确定交卷？`)) return
  }
  stopTimer()
  finishedAt.value = Date.now()
  let right = 0, wrong = 0
  if (preset.value.mode === 'english') {
    // 保存到 readingUserAnswers，英语二刷错题会自动收录这些新错题
    let local: Record<string, string> = {}
    try { local = JSON.parse(localStorage.getItem('readingUserAnswers') || '{}') } catch { local = {} }
    paper.value.forEach(q => {
      const a = answers.value[KEY(q)]
      if (!a) return
      if (!local[KEY(q)]) local[KEY(q)] = a
      if (a === q.correctAnswer) right += 1
      else wrong += 1
    })
    try { localStorage.setItem('readingUserAnswers', JSON.stringify(local)) } catch { /* 忽略 */ }
    const blank = paper.value.length - right - wrong
    wrong += blank
  } else {
    right = sheetRight.value
    wrong = preset.value.total - right
  }
  const rate = total.value ? Math.round((right / total.value) * 100) : 0
  result.value = saveMockRecord({
    key: preset.value.key,
    name: preset.value.name,
    mode: preset.value.mode,
    usedMin: Math.round(usedSec.value / 60),
    total: total.value,
    right,
    wrong,
    rate,
    score: right * preset.value.scorePer,
    fullScore: preset.value.fullScore,
    label: preset.value.key === 'english' ? `${year.value} 年 Text ${textNo.value}` : undefined
  })
  // 英语模考的错题计入「错题复测」流水，今日负荷看得见
  if (preset.value.mode === 'english' && wrong > 0) logReview('wrong', wrong)
  phase.value = 'result'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function backToSetup() {
  stopTimer()
  phase.value = 'setup'
  loadMockHistory()
}

function again() { start(preset.value) }

const prevRecord = computed(() => {
  if (!result.value) return null
  return mockHistory.value.find(r => r.key === result.value!.key && r.id !== result.value!.id) || null
})
const deltaRate = computed(() => {
  if (!result.value || !prevRecord.value) return null
  return result.value.rate - prevRecord.value.rate
})

function pickChoice(q: any, label: string) {
  if (!answers.value[KEY(q)]) answers.value = { ...answers.value, [KEY(q)]: label }
}

function beforeUnload(e: BeforeUnloadEvent) {
  if (phase.value === 'running') { e.preventDefault(); e.returnValue = '' }
}

onMounted(() => {
  loadMockHistory()
  loadIndex()
  window.addEventListener('beforeunload', beforeUnload)
})
onBeforeUnmount(() => {
  stopTimer()
  window.removeEventListener('beforeunload', beforeUnload)
})
</script>

<template>
  <div class="mock">
    <div class="mock-header">
      <h2 class="mock-title">⏱️ 限时模考</h2>
      <p class="mock-sub">平时刷题不计时，考场就没有节奏 · 倒计时到点强制交卷，成绩自动记账</p>
    </div>

    <!-- ================= 设置 ================= -->
    <template v-if="phase === 'setup'">
      <div class="preset-grid">
        <div v-for="p in PRESETS" :key="p.key" class="preset" :class="p.key">
          <div class="preset-top">
            <span class="preset-icon">{{ p.icon }}</span>
            <div>
              <div class="preset-name">{{ p.name }}</div>
              <div class="preset-desc">{{ p.desc }}</div>
            </div>
          </div>
          <div class="preset-tip">{{ p.tip }}</div>
          <div v-if="p.key === 'english'" class="preset-opt">
            <select v-model.number="year" class="sel">
              <option v-for="y in years" :key="y" :value="y">{{ y }} 年</option>
            </select>
            <select v-model.number="textNo" class="sel">
              <option v-for="n in 4" :key="n" :value="n">Text {{ n }}</option>
            </select>
            <span class="paper-hint" v-if="indexLoaded && paper.length">{{ paper.length }} 题可做</span>
            <span class="paper-hint bad" v-else-if="indexError">题库读取失败</span>
          </div>
          <div class="preset-foot">
            <span class="preset-last" v-if="historyOf(p.key).length">
              上次 {{ historyOf(p.key)[0].rate }}%（{{ historyOf(p.key)[0].date }}）
            </span>
            <button class="btn-start" @click="start(p)">开始 {{ p.minutes }}′</button>
          </div>
        </div>
      </div>

      <section v-if="mockHistory.length" class="hist-card">
        <h3 class="hist-h3">📈 模考成绩账 <small>近 {{ Math.min(mockHistory.length, 12) }} 次</small></h3>
        <div class="hist-list">
          <div v-for="r in mockHistory.slice(0, 12)" :key="r.id" class="hist-row">
            <span class="h-date">{{ r.date }}</span>
            <span class="h-name">{{ r.name }}<template v-if="r.label"> · {{ r.label }}</template></span>
            <span class="h-time">{{ r.usedMin }}′</span>
            <span class="h-score">{{ r.score }}/{{ r.fullScore }}</span>
            <span class="h-rate" :class="{ good: r.rate >= 80, bad: r.rate < 60 }">{{ r.rate }}%</span>
          </div>
        </div>
      </section>
      <p class="mock-note">
        408/数学没有站内题库（题面在王道/真题纸上），所以用「答题卡自评」：做完按题号点对/错，到点自动算出正确率。
        英语阅读有站内题库，自动判分，做错的题会写进「英语二刷错题」。
      </p>
    </template>

    <!-- ================= 考试中 ================= -->
    <template v-else-if="phase === 'running'">
      <div class="exam-bar" :class="{ low: lowTime }">
        <div class="bar-left">
          <span class="bar-name">{{ preset.icon }} {{ preset.name }}</span>
          <span v-if="preset.key === 'english'" class="bar-paper">{{ year }} 年 Text {{ textNo }}</span>
        </div>
        <div class="bar-timer">{{ mmss(timeLeft) }}</div>
        <div class="bar-right">
          <span class="bar-prog">已{{ preset.mode === 'english' ? '答' : '判' }} {{ answered }}/{{ total }}</span>
          <button class="btn-submit" @click="submit(false)">交卷</button>
        </div>
      </div>

      <!-- 英语阅读 -->
      <template v-if="preset.mode === 'english'">
        <div v-if="!paper.length" class="tip">正在准备试卷…（若长时间为空，换一篇或检查网络）</div>
        <template v-else>
          <div v-if="article" class="article" v-html="article"></div>
          <div v-else class="article-empty">原文未能加载，按题干作答即可（不影响判分）。</div>
          <div class="q-list">
            <div v-for="q in paper" :key="KEY(q)" class="q" :class="{ done: !!answers[KEY(q)] }">
              <div class="q-head">
                <span class="q-no">第 {{ q.number }} 题</span>
                <span v-if="q.type" class="q-type">{{ q.type }}</span>
                <span v-if="answers[KEY(q)]" class="q-picked">已选 {{ answers[KEY(q)] }}</span>
              </div>
              <p class="q-stem">{{ q.stem }}</p>
              <div class="q-opts">
                <button
                  v-for="o in q.options" :key="o.label"
                  class="q-opt" :class="{ on: answers[KEY(q)] === o.label }"
                  @click="pickChoice(q, o.label)"
                >
                  <span class="q-opt-l">{{ o.label }}</span>{{ o.text }}
                </button>
              </div>
            </div>
          </div>
        </template>
      </template>

      <!-- 408 / 数学答题卡 -->
      <template v-else>
        <div class="sheet-card">
          <p class="sheet-tip">
            在纸上做题；做完一题，点对应题号切换「✓ 对 / ✗ 错 / 未判」。
            当前：对 {{ sheetRight }} · 错 {{ sheetWrong }} · 未判 {{ sheetUnmarked }}。
          </p>
          <div class="sheet-grid" :class="{ dense: preset.total > 20 }">
            <button
              v-for="(s, i) in sheet" :key="i"
              class="cell" :class="s"
              @click="cycle(i)"
            >
              <span class="cell-no">{{ i + 1 }}</span>
              <span class="cell-mark">{{ s === 'right' ? '✓' : s === 'wrong' ? '✗' : '·' }}</span>
            </button>
          </div>
          <div class="sheet-foot">
            <button class="btn-ghost" @click="resetSheet(preset.total)">清空答题卡</button>
            <span class="sheet-live">实时得分 {{ sheetRight * preset.scorePer }} / {{ preset.fullScore }}</span>
          </div>
        </div>
        <div class="paper-note">{{ preset.tip }}</div>
      </template>
    </template>

    <!-- ================= 结果 ================= -->
    <template v-else-if="phase === 'result' && result">
      <div class="result-card">
        <div class="res-kicker">{{ result.name }}<template v-if="result.label"> · {{ result.label }}</template></div>
        <div class="res-score">{{ result.score }}<small>/ {{ result.fullScore }}</small></div>
        <div class="res-line">
          正确率 <b>{{ result.rate }}%</b> · 对 {{ result.right }} / {{ result.total }} · 用时 {{ result.usedMin }}′
          <span v-if="deltaRate !== null" class="res-delta" :class="{ up: deltaRate > 0, down: deltaRate < 0 }">
            {{ deltaRate > 0 ? '↑' : deltaRate < 0 ? '↓' : '＝' }} 比上次 {{ Math.abs(deltaRate) }} 个百分点
          </span>
        </div>
        <div class="res-actions">
          <button class="btn-start" @click="again">再考一次</button>
          <button class="btn-ghost" @click="backToSetup">返回模考首页</button>
        </div>
      </div>

      <div v-if="preset.mode === 'english'" class="review">
        <h3 class="review-h3">逐题复盘</h3>
        <div v-for="q in paper" :key="KEY(q)" class="rq" :class="{ ok: answers[KEY(q)] === q.correctAnswer, miss: !answers[KEY(q)] }">
          <div class="rq-head">
            <span class="rq-no">第 {{ q.number }} 题</span>
            <span class="rq-ans">
              你选 <b>{{ answers[KEY(q)] || '未答' }}</b> · 正确 <b>{{ q.correctAnswer }}</b>
            </span>
          </div>
          <p class="rq-stem">{{ q.stem }}</p>
          <p v-if="answers[KEY(q)] && answers[KEY(q)] !== q.correctAnswer && (heavy[KEY(q)]?.errorAnalysis || {})[answers[KEY(q)]]" class="rq-why">
            你选的 {{ answers[KEY(q)] }}：{{ (heavy[KEY(q)]?.errorAnalysis || {})[answers[KEY(q)]] }}
          </p>
          <p v-if="heavy[KEY(q)]?.analysis" class="rq-analysis">{{ heavy[KEY(q)].analysis }}</p>
        </div>
      </div>

      <div v-else class="review">
        <h3 class="review-h3">下一步</h3>
        <p class="review-note">
          错题请在错题本里按题号补录（错因选「限时失误」），这样回炉总账会把它排进复习。
          连续两次模考同一段题正确率不涨，说明不是速度问题，是那一章的漏洞没补。
        </p>
        <div class="res-actions">
          <router-link class="btn-start link" to="/wrong-problems?subject=cs408">去 408 错题本 →</router-link>
          <router-link class="btn-ghost link" to="/review-queue">看今日回炉 →</router-link>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.mock { max-width: 980px; margin: 0 auto; padding: 8px 2px 50px; }
.mock-header { text-align: center; margin-bottom: 16px; }
.mock-title { font-size: 1.9em; color: #1a1a2e; margin: 0 0 6px; font-weight: 800; }
.mock-sub { color: #7a8798; margin: 0; font-size: .98em; }
.preset-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 12px; margin-bottom: 16px; }
.preset { background: #fff; border: 1px solid #e3e8ef; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 3px 14px rgba(30, 60, 110, .05); }
.preset.english { border-top: 4px solid #3a6df0; }
.preset.cs408 { border-top: 4px solid #2fa36b; }
.preset.math { border-top: 4px solid #e6a23c; }
.preset-top { display: flex; gap: 10px; align-items: flex-start; }
.preset-icon { font-size: 1.7em; line-height: 1; }
.preset-name { font-weight: 800; color: #16345c; font-size: 1.05em; }
.preset-desc { font-size: .82em; color: #7a8798; margin-top: 2px; line-height: 1.6; }
.preset-tip { font-size: .8em; color: #8a94a3; line-height: 1.65; background: #f8fafc; border-radius: 8px; padding: 8px 10px; }
.preset-opt { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.sel { border: 1px solid #dfe5ee; border-radius: 8px; padding: 5px 8px; font-size: .84em; color: #3b4757; background: #fff; }
.paper-hint { font-size: .78em; color: #2fa36b; }
.paper-hint.bad { color: #b6402f; }
.preset-foot { display: flex; align-items: center; justify-content: space-between; margin-top: auto; }
.preset-last { font-size: .78em; color: #9aa5b3; }
.btn-start { background: #16345c; color: #fff; border: none; border-radius: 10px; padding: 9px 18px; font-size: .92em; font-weight: 700; cursor: pointer; }
.btn-start.link { display: inline-block; text-decoration: none; }
.btn-ghost { background: #fff; color: #5a6472; border: 1px solid #dfe5ee; border-radius: 10px; padding: 8px 14px; font-size: .86em; cursor: pointer; }
.btn-ghost.link { display: inline-block; text-decoration: none; }
.hist-card { background: #fff; border: 1px solid #e3e8ef; border-radius: 14px; padding: 14px; margin-bottom: 14px; }
.hist-h3 { margin: 0 0 10px; font-size: 1em; color: #16345c; font-weight: 800; }
.hist-h3 small { color: #9aa5b3; font-weight: 500; font-size: .78em; }
.hist-list { display: grid; gap: 5px; }
.hist-row { display: grid; grid-template-columns: 86px 1fr 48px 70px 52px; gap: 6px; font-size: .82em; color: #5a6472; padding: 6px 8px; border-radius: 8px; background: #f8fafc; }
.h-date { color: #9aa5b3; }
.h-name { font-weight: 600; color: #22314a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.h-time, .h-score { text-align: right; font-variant-numeric: tabular-nums; }
.h-rate { text-align: right; font-weight: 700; color: #5a6472; }
.h-rate.good { color: #1f7a4d; }
.h-rate.bad { color: #b6402f; }
.mock-note { font-size: .8em; color: #8a94a3; line-height: 1.7; }
.tip { text-align: center; color: #8a94a3; padding: 26px 0; }

/* 考试条 */
.exam-bar { position: sticky; top: 0; z-index: 30; display: flex; align-items: center; gap: 10px; background: #16345c; color: #fff; border-radius: 12px; padding: 10px 14px; margin-bottom: 12px; box-shadow: 0 6px 18px rgba(16, 41, 74, .25); }
.exam-bar.low { background: #b6402f; }
.bar-left { display: flex; flex-direction: column; min-width: 0; }
.bar-name { font-weight: 800; font-size: .95em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bar-paper { font-size: .74em; opacity: .8; }
.bar-timer { font-size: 1.7em; font-weight: 800; font-variant-numeric: tabular-nums; letter-spacing: 1px; margin-left: auto; }
.bar-right { display: flex; align-items: center; gap: 8px; }
.bar-prog { font-size: .78em; opacity: .9; }
.btn-submit { background: #ffc53d; color: #16345c; border: none; border-radius: 8px; padding: 7px 14px; font-weight: 800; font-size: .85em; cursor: pointer; }
.article { background: #fff; border: 1px solid #e3e8ef; border-radius: 14px; padding: 16px 18px; margin-bottom: 12px; font-size: .98em; line-height: 1.9; color: #22314a; max-height: 420px; overflow: auto; }
.article :deep(p) { margin: 0 0 10px; }
.article-empty { background: #f8fafc; border-radius: 12px; padding: 14px; color: #8a94a3; font-size: .86em; margin-bottom: 12px; }
.q-list { display: grid; gap: 10px; }
.q { background: #fff; border: 1px solid #e3e8ef; border-radius: 14px; padding: 14px; }
.q.done { border-color: #c9d8ee; }
.q-head { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.q-no { background: #16345c; color: #fff; border-radius: 6px; padding: 1px 8px; font-size: .76em; font-weight: 700; }
.q-type { background: #fff4e6; color: #b07a1a; border-radius: 6px; padding: 1px 8px; font-size: .74em; }
.q-picked { margin-left: auto; font-size: .78em; color: #3a6df0; }
.q-stem { margin: 0 0 10px; line-height: 1.75; color: #1f2d3d; }
.q-opts { display: grid; gap: 7px; }
.q-opt { display: flex; gap: 8px; align-items: flex-start; text-align: left; background: #fbfcfe; border: 1.5px solid #e3e9f1; border-radius: 10px; padding: 9px 11px; font-size: .94em; color: #22314a; cursor: pointer; }
.q-opt.on { border-color: #3a6df0; background: #eff5ff; }
.q-opt-l { font-weight: 800; color: #3a6df0; flex: none; }
.sheet-card { background: #fff; border: 1px solid #e3e8ef; border-radius: 16px; padding: 16px; }
.sheet-tip { margin: 0 0 12px; font-size: .86em; color: #5a6472; line-height: 1.7; }
.sheet-grid { display: grid; grid-template-columns: repeat(10, 1fr); gap: 6px; }
.sheet-grid.dense { grid-template-columns: repeat(8, 1fr); }
.cell { position: relative; border: 1.5px solid #d7deea; background: #fff; border-radius: 9px; padding: 6px 4px; display: flex; flex-direction: column; align-items: center; cursor: pointer; color: #5a6472; }
.cell-no { font-size: .72em; color: #9aa5b3; }
.cell-mark { font-weight: 800; font-size: .95em; line-height: 1.2; }
.cell.right { background: #eefaf2; border-color: #2fa36b; color: #1f7a4d; }
.cell.wrong { background: #fdf0ef; border-color: #e6544f; color: #b6402f; }
.sheet-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; }
.sheet-live { font-weight: 800; color: #16345c; }
.paper-note { margin-top: 10px; font-size: .82em; color: #8a94a3; }
.result-card { background: linear-gradient(150deg, #10294a, #16345c 70%, #1e4576); color: #fff; border-radius: 16px; padding: 20px; margin-bottom: 14px; }
.res-kicker { font-size: .8em; letter-spacing: .08em; color: #ffc53d; font-weight: 700; }
.res-score { font-size: 3em; font-weight: 800; line-height: 1.1; margin: 6px 0; }
.res-score small { font-size: .32em; font-weight: 500; opacity: .8; margin-left: 6px; }
.res-line { font-size: .9em; color: #dce7f5; }
.res-line b { color: #ffc53d; }
.res-delta { margin-left: 8px; font-weight: 700; }
.res-delta.up { color: #7ee2a8; }
.res-delta.down { color: #ff9b8a; }
.res-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
.result-card .btn-ghost { background: transparent; color: #dce7f5; border-color: rgba(255, 255, 255, .3); }
.review { background: #fff; border: 1px solid #e3e8ef; border-radius: 14px; padding: 14px; }
.review-h3 { margin: 0 0 10px; font-size: 1em; color: #16345c; font-weight: 800; }
.review-note { font-size: .88em; color: #5a6472; line-height: 1.75; margin: 0 0 4px; }
.rq { border-left: 3px solid #d7deea; background: #fbfcfe; border-radius: 10px; padding: 10px 12px; margin-bottom: 8px; }
.rq.ok { border-left-color: #2fa36b; }
.rq.miss { border-left-color: #e6a23c; }
.rq-head { display: flex; justify-content: space-between; gap: 8px; font-size: .82em; flex-wrap: wrap; }
.rq-no { font-weight: 700; color: #22314a; }
.rq-ans { color: #5a6472; }
.rq-ans b { color: #16345c; }
.rq-stem { font-size: .9em; line-height: 1.7; margin: 6px 0 4px; color: #22314a; }
.rq-why { font-size: .84em; color: #b6402f; line-height: 1.65; margin: 4px 0 0; }
.rq-analysis { font-size: .84em; color: #3b4757; line-height: 1.7; margin: 4px 0 0; white-space: pre-wrap; }
@media (max-width: 640px) {
  .exam-bar { flex-wrap: wrap; }
  .bar-timer { font-size: 1.4em; }
  .sheet-grid { grid-template-columns: repeat(6, 1fr); }
  .hist-row { grid-template-columns: 76px 1fr 42px 58px 46px; font-size: .76em; }
  .article { max-height: none; }
}
</style>
