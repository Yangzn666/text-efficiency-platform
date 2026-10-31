<script setup lang="ts">
// 公式挖空默写 · 每日公式背诵清单 613 条 → 站内填空判分
// 为什么必须默写而不是重做原题：公式类回锅的病灶是「看着眼熟、下笔写错符号/系数」，
// 重做原题会被题目本身提示，默写不会。连对 2 次毕业，答错当天回炉。
import { computed, onMounted, ref, watch, nextTick } from 'vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import {
  makeCloze, judgeCloze, recordCloze, isGraduated, isDue, recordOf,
  clozeSummary, resetCloze, loadCloze, GRADUATE_STREAK
} from '@/utils/formulaCloze'

interface FormulaItem {
  id: string
  chapter: string
  section: string
  stars: number
  warn: boolean
  circle: boolean
  hook: string
  body: string
  latex: string
  kind: 'formula' | 'oral'
}

const items = ref<FormulaItem[]>([])
const loading = ref(true)
const error = ref('')

const chapterFilter = ref('all')
const starOnly = ref<'all' | '3' | '2'>('all')
const viewMode = ref<'due' | 'all'>('due')
const keyword = ref('')

const queue = ref<string[]>([])
const pos = ref(0)
const phase = ref<'ask' | 'judged' | 'oral'>('ask')
const input = ref('')
const ok = ref<boolean | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)

const SESSION_SIZE = 20

onMounted(async () => {
  loadCloze()
  try {
    const base = (import.meta as any).env?.BASE_URL || '/'
    const res = await fetch(`${base}data/formulas/recite-cards.json`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    items.value = data.items || []
    buildQueue()
  } catch (e: any) {
    error.value = e?.message || '加载失败'
  } finally {
    loading.value = false
  }
})

const chapters = computed(() => [...new Set(items.value.map(i => i.chapter))])

const filtered = computed<FormulaItem[]>(() => {
  let list = items.value
  if (chapterFilter.value !== 'all') list = list.filter(i => i.chapter === chapterFilter.value)
  if (starOnly.value === '3') list = list.filter(i => i.stars >= 3)
  if (starOnly.value === '2') list = list.filter(i => i.stars >= 2)
  const k = keyword.value.trim().toLowerCase()
  if (k) list = list.filter(i => (i.section + i.hook + i.latex).toLowerCase().includes(k))
  return list.slice().sort((a, b) =>
    Number(b.warn) - Number(a.warn) || b.stars - a.stars || a.chapter.localeCompare(b.chapter)
  )
})

const duePool = computed(() => filtered.value.filter(i => isDue(i.id)))
const pool = computed(() => (viewMode.value === 'due' ? duePool.value : filtered.value))

const summary = computed(() => {
  // 依赖 recs 的读取都放在这里，任何一次记录后自动刷新
  const s = clozeSummary()
  return {
    ...s,
    due: items.value.filter(i => isDue(i.id)).length,
    must: items.value.filter(i => i.stars >= 3).length,
    total: items.value.length
  }
})

const cur = computed<FormulaItem | null>(() => {
  const id = queue.value[pos.value]
  return id ? items.value.find(i => i.id === id) || null : null
})

const cloze = computed(() => (cur.value ? makeCloze(cur.value.id, cur.value.latex) : null))
const rec = computed(() => (cur.value ? recordOf(cur.value.id) : null))

function buildQueue() {
  queue.value = pool.value.slice(0, SESSION_SIZE).map(i => i.id)
  pos.value = 0
  phase.value = 'ask'
  input.value = ''
  ok.value = null
  focusInput()
}

function focusInput() {
  nextTick(() => inputEl.value?.focus())
}

function displayLatex(s: string): string {
  try {
    return katex.renderToString(s, { displayMode: true, throwOnError: false, strict: false })
  } catch {
    return s
  }
}

// 口述卡正文/记忆钩里常带行内公式 $...$，直接插值会露出 LaTeX 源码
function renderRich(text: string): string {
  if (!text) return ''
  return String(text)
    .replace(/\$\$([\s\S]+?)\$\$/g, (_m, p1) => katex.renderToString(p1, { displayMode: true, throwOnError: false, strict: false }))
    .replace(/\$([^$]+?)\$/g, (_m, p1) => katex.renderToString(p1, { displayMode: false, throwOnError: false, strict: false }))
}

const blankedHtml = computed(() => {
  if (!cloze.value) return ''
  if (cloze.value.mode === 'latex') return displayLatex(cloze.value.blanked)
  return ''
})

function submit() {
  if (!cloze.value || phase.value !== 'ask') return
  if (!cloze.value.hasBlank) {
    phase.value = 'oral'
    return
  }
  ok.value = judgeCloze(input.value, cloze.value.answer)
  recordCloze(cur.value!.id, !!ok.value)
  phase.value = 'judged'
}

function selfJudge(correct: boolean) {
  if (!cur.value) return
  if (phase.value === 'oral') {
    recordCloze(cur.value.id, correct)
    ok.value = correct
    phase.value = 'judged'
    return
  }
  // 判错后用户坚持等价：补记一次正确（把刚才那次错误抵消）
  if (!correct) return
  recordCloze(cur.value.id, true)
  recordCloze(cur.value.id, true)
  ok.value = true
}

function next() {
  if (pos.value + 1 < queue.value.length) {
    pos.value += 1
  } else {
    pos.value = queue.value.length
  }
  phase.value = 'ask'
  input.value = ''
  ok.value = null
  focusInput()
}

function finish() {
  pos.value = queue.value.length
}

const finished = computed(() => queue.value.length > 0 && pos.value >= queue.value.length)
const progress = computed(() => (queue.value.length ? Math.round((Math.min(pos.value, queue.value.length) / queue.value.length) * 100) : 0))

const queueStats = computed(() => {
  const ids = queue.value
  const done = ids.filter(id => (recordOf(id)?.done || 0) > 0).length
  const grad = ids.filter(id => isGraduated(id)).length
  return { done, grad, total: ids.length }
})

watch([chapterFilter, starOnly, viewMode, keyword], () => buildQueue())
</script>

<template>
  <div class="fc">
    <section class="fc-hero">
      <span class="fc-kicker">FORMULA RECALL · 公式挖空默写</span>
      <h2 class="fc-title">公式挖空默写</h2>
      <p class="fc-note">
        数据源：<code>01-数学一/03-个人笔记/每日公式背诵清单.md</code>。每条公式只挖一个「最容易被记错」的洞——
        系数、指数、希腊字母、函数名或运算符；写对连对 {{ GRADUATE_STREAK }} 次毕业，写错当天回炉。
        <br>判分不认死理：<code>1/2</code>、<code>0.5</code>、<code>\frac{1}{2}</code> 都算对；仍判错可点「我写对了（等价）」自判。
      </p>
    </section>

    <div v-if="loading" class="fc-tip">读取公式卡…</div>
    <div v-else-if="error || !items.length" class="fc-tip bad">
      读不到 <code>data/formulas/recite-cards.json</code>（{{ error || '空' }}）。先跑 <code>node scripts/sync-formula-cards.mjs</code>。
    </div>

    <template v-else>
      <div class="fc-strip">
        <div class="fc-stat"><strong>{{ summary.total }}</strong><span>公式卡</span></div>
        <div class="fc-stat gold"><strong>{{ summary.must }}</strong><span>★★★ 必背</span></div>
        <div class="fc-stat coral"><strong>{{ summary.due }}</strong><span>今日待默</span></div>
        <div class="fc-stat green"><strong>{{ summary.graduated }}</strong><span>已毕业</span></div>
        <div class="fc-stat"><strong>{{ summary.todayDone }}</strong><span>今日已默</span></div>
      </div>

      <section class="fc-tools">
        <select v-model="chapterFilter" class="fc-sel">
          <option value="all">全部章节（{{ items.length }}）</option>
          <option v-for="c in chapters" :key="c" :value="c">{{ c }}</option>
        </select>
        <div class="chips">
          <button :class="{ on: starOnly === 'all' }" @click="starOnly = 'all'">全部</button>
          <button :class="{ on: starOnly === '3' }" @click="starOnly = '3'">★★★ 必背</button>
          <button :class="{ on: starOnly === '2' }" @click="starOnly = '2'">★★ 以上</button>
        </div>
        <div class="chips">
          <button :class="{ on: viewMode === 'due' }" @click="viewMode = 'due'">到期 {{ duePool.length }}</button>
          <button :class="{ on: viewMode === 'all' }" @click="viewMode = 'all'">全量 {{ filtered.length }}</button>
        </div>
        <input v-model="keyword" class="fc-inp" placeholder="搜章节 / 记忆钩 / 公式" />
      </section>

      <section v-if="!finished" class="fc-card">
        <template v-if="cur">
          <div class="fc-meta">
            <span class="fc-prog">{{ Math.min(pos + 1, queue.length) }} / {{ queue.length }} · 本组已毕业 {{ queueStats.grad }}</span>
            <span class="fc-stars">{{ '★'.repeat(cur.stars) }}<i>{{ '★'.repeat(Math.max(0, 3 - cur.stars)) }}</i>
              <b v-if="cur.warn">⚠ 二刷栽过</b>
              <b v-if="rec?.streak"> · 连对 {{ rec.streak }}/{{ GRADUATE_STREAK }}</b>
            </span>
          </div>
          <div class="fc-bar"><i :style="{ width: progress + '%' }" /></div>

          <div class="fc-chapter">{{ cur.chapter }} · {{ cur.section }}</div>

          <div v-if="cloze?.hasBlank" class="fc-prompt">
            <div v-if="cur.hook" class="fc-hook">{{ cur.hook }}</div>
            <div v-if="cloze.mode === 'latex'" class="fc-formula" v-html="blankedHtml"></div>
            <div v-else class="fc-formula-text">{{ cloze.blanked }}</div>

            <div class="fc-answer-row">
              <input
                ref="inputEl"
                v-model="input"
                class="fc-answer"
                :disabled="phase !== 'ask'"
                placeholder="填这个空（支持 1/2、pi、∞、\frac{1}{2}）"
                @keyup.enter="phase === 'ask' ? submit() : next()"
              />
              <button v-if="phase === 'ask'" class="fc-btn primary" @click="submit">判分</button>
              <button v-else-if="phase === 'judged'" class="fc-btn primary" @click="next">
                {{ pos + 1 < queue.length ? '下一个 →' : '完成本组' }}
              </button>
            </div>

            <div v-if="phase === 'judged'" class="fc-result" :class="ok ? 'good' : 'bad'">
              <div class="fc-result-title">{{ ok ? '✓ 写对了' : '✗ 差一点' }}</div>
              <div class="fc-answer-line">
                答案：<code>{{ cloze.answer }}</code>
                <template v-if="cloze.answerLatex"> <span class="fc-ans-tex" v-html="displayLatex(cloze.answerLatex)"></span></template>
                <span v-if="!ok"> ｜ 你写：<code>{{ input || '（空）' }}</code></span>
              </div>
              <button v-if="!ok" class="fc-mini" @click="selfJudge(true)">我写对了（只是写法不同）</button>
            </div>
          </div>

          <!-- 口述卡：没有可挖的 token，翻面自判 -->
          <div v-else class="fc-prompt">
            <div class="fc-hook" v-html="renderRich(cur.hook || '把这一节的判据完整口述一遍，再翻面核对。')"></div>
            <div class="fc-oral-q">这一节的公式/判据是什么？</div>
            <button v-if="phase === 'ask'" class="fc-btn primary" @click="submit">翻面核对</button>
            <div v-if="phase === 'oral'" class="fc-oral-a">
              <div v-if="cur.latex" class="fc-formula" v-html="displayLatex(cur.latex)"></div>
              <p v-if="cur.body" class="fc-body" v-html="renderRich(cur.body)"></p>
              <div class="fc-self">
                <button class="fc-btn bad" @click="selfJudge(false)">没记住</button>
                <button class="fc-btn good" @click="selfJudge(true)">记住了</button>
              </div>
            </div>
          </div>

          <div v-if="phase === 'judged'" class="fc-full">
            <div class="fc-full-label">完整公式</div>
            <div v-if="cloze.mode === 'latex'" class="fc-formula" v-html="displayLatex(cur.latex)"></div>
            <div v-else class="fc-formula-text" v-html="renderRich(cur.latex)"></div>
            <p v-if="cur.hook" class="fc-body" v-html="renderRich(cur.hook)"></p>
            <p v-if="cur.body" class="fc-body" v-html="renderRich(cur.body)"></p>
          </div>
        </template>
      </section>

      <section v-else class="fc-card fc-done">
        <div class="fc-done-emoji">🎯</div>
        <div class="fc-done-title">本组 {{ queue.length }} 条默完了</div>
        <p class="fc-done-sub">毕业 {{ queueStats.grad }} 条 · 已作答 {{ queueStats.done }} 条。明天到期的会自动出现在「到期」里。</p>
        <div class="fc-done-btns">
          <button class="fc-btn primary" @click="buildQueue">再来一组（{{ duePool.length }} 条到期）</button>
          <button class="fc-mini" @click="viewMode = 'all'; buildQueue()">浏览全量</button>
        </div>
      </section>

      <p class="fc-how">
        进度存在本机 <code>formula-cloze-v1</code>；重置按钮只清默写记录，不动清单。
        <button class="fc-reset" @click="resetCloze(); buildQueue()">重置全部默写记录</button>
      </p>
    </template>
  </div>
</template>

<style scoped>
.fc { padding: 4px 0 24px; }
.fc-hero { background: linear-gradient(150deg, #10294a, #16345c 60%, #1e4576); color: #fff; border-radius: 14px; padding: 18px; margin-bottom: 14px; }
.fc-kicker { font-size: .72em; letter-spacing: .16em; color: #ffc53d; font-weight: 700; }
.fc-title { margin: 6px 0 8px; font-size: 1.6em; font-weight: 800; }
.fc-note { margin: 0; font-size: .86em; line-height: 1.75; color: #dce7f5; max-width: 80ch; }
.fc-note code, .fc-how code { background: rgba(255,255,255,.12); padding: 1px 5px; border-radius: 5px; color: #ffc53d; }
.fc-strip { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 8px; margin-bottom: 12px; }
.fc-stat { background: #16345c; color: #fff; border-radius: 11px; padding: 9px 8px; text-align: center; }
.fc-stat.coral { background: #b6402f; } .fc-stat.gold { background: #6b5310; } .fc-stat.green { background: #1f6b4a; }
.fc-stat strong { display: block; font-size: 1.3em; } .fc-stat span { display: block; font-size: .7em; opacity: .86; margin-top: 2px; }
.fc-tip { padding: 16px; border-radius: 12px; background: #eef2f8; color: #5a6472; margin-bottom: 14px; }
.fc-tip.bad { background: #fdecea; color: #b6402f; }
.fc-tools { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 12px; }
.fc-sel, .fc-inp { border: 1px solid #dfe5ee; border-radius: 8px; padding: 5px 9px; font-size: .82em; background: #fff; color: #3b4757; max-width: 100%; }
.fc-inp { flex: 1; min-width: 150px; }
.chips { display: flex; flex-wrap: wrap; gap: 5px; }
.chips button { border: 1px solid #dfe5ee; background: #fff; color: #5a6472; border-radius: 999px; padding: 4px 10px; font-size: .78em; cursor: pointer; }
.chips button.on { background: #16345c; color: #fff; border-color: #16345c; }
.fc-card { background: #fff; border: 1px solid #e3e8ef; border-radius: 14px; padding: 16px; margin-bottom: 12px; }
.fc-meta { display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap; font-size: .78em; color: #7a848f; }
.fc-stars { color: #e8a33d; letter-spacing: 1px; }
.fc-stars i { color: #dfe5ee; font-style: normal; }
.fc-stars b { color: #b6402f; font-weight: 700; margin-left: 4px; letter-spacing: 0; }
.fc-bar { height: 5px; background: #eef2f8; border-radius: 999px; overflow: hidden; margin: 8px 0 14px; }
.fc-bar i { display: block; height: 100%; background: linear-gradient(90deg, #ffc53d, #f0a820); border-radius: 999px; transition: width .3s; }
.fc-chapter { font-size: .8em; color: #2b6cb0; background: #eef4fd; border-radius: 6px; padding: 3px 9px; display: inline-block; margin-bottom: 10px; }
.fc-hook { font-size: .84em; color: #7a4a2b; background: #fff8f3; border-left: 3px solid #e8a33d; padding: 7px 10px; border-radius: 0 8px 8px 0; line-height: 1.6; margin-bottom: 10px; }
.fc-formula { font-size: 1.25em; text-align: center; padding: 10px 4px; overflow-x: auto; color: #1f2d3d; }
.fc-formula-text { font-family: 'JetBrains Mono', Consolas, monospace; font-size: 1.05em; text-align: center; padding: 12px 6px; background: #f7f9fc; border-radius: 10px; white-space: pre-wrap; word-break: break-word; color: #22314a; }
.fc-answer-row { display: flex; gap: 8px; margin-top: 12px; }
.fc-answer { flex: 1; min-width: 0; border: 1.5px solid #cfd8e6; border-radius: 9px; padding: 10px 12px; font-size: 1em; color: #1f2d3d; }
.fc-answer:focus { outline: none; border-color: #16345c; }
.fc-answer:disabled { background: #f4f6fa; color: #6b7684; }
.fc-btn { border: 0; border-radius: 9px; padding: 10px 18px; font-size: .9em; font-weight: 700; cursor: pointer; color: #fff; background: #16345c; white-space: nowrap; }
.fc-btn.primary { background: #16345c; }
.fc-btn.good { background: #2e9e6b; } .fc-btn.bad { background: #e8604c; }
.fc-result { margin-top: 12px; border-radius: 10px; padding: 10px 12px; font-size: .86em; }
.fc-result.good { background: #eef8f2; border: 1px solid #cdeedb; color: #1f7a4d; }
.fc-result.bad { background: #fdf0ee; border: 1px solid #f5cfc8; color: #b6402f; }
.fc-result-title { font-weight: 800; margin-bottom: 4px; }
.fc-answer-line code { background: #fff; border-radius: 4px; padding: 1px 5px; color: #22314a; }
.fc-ans-tex { display: inline-block; vertical-align: middle; margin-left: 4px; }
.fc-mini { border: 1px solid #dfe5ee; background: #fff; color: #5a6472; border-radius: 7px; padding: 4px 10px; font-size: .8em; cursor: pointer; margin-top: 6px; }
.fc-oral-q { text-align: center; font-size: 1em; color: #7a848f; padding: 18px 0; }
.fc-oral-a { margin-top: 8px; }
.fc-self { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }
.fc-body { font-size: .82em; color: #5a6472; line-height: 1.7; margin: 8px 0 0; white-space: pre-wrap; }
.fc-full { margin-top: 14px; border-top: 1px dashed #e3e8ef; padding-top: 12px; }
.fc-full-label { font-size: .74em; color: #8a94a3; letter-spacing: .08em; }
.fc-done { text-align: center; padding: 34px 16px; }
.fc-done-emoji { font-size: 2.6em; }
.fc-done-title { font-size: 1.25em; font-weight: 800; color: #22314a; margin: 8px 0 6px; }
.fc-done-sub { color: #7a848f; font-size: .88em; line-height: 1.7; }
.fc-done-btns { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 12px; }
.fc-how { font-size: .76em; color: #8a94a3; line-height: 1.7; }
.fc-reset { border: 1px solid #f0c9c2; background: #fff7f5; color: #b6402f; border-radius: 6px; padding: 2px 8px; font-size: .92em; cursor: pointer; margin-left: 6px; }
@media (max-width: 640px) {
  .fc-title { font-size: 1.3em; }
  .fc-tools { gap: 6px; }
  .fc-answer-row { flex-direction: column; }
  .fc-btn { width: 100%; }
  .fc-formula { font-size: 1.1em; }
}
</style>
