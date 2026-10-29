<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useTodayStatusStore } from '@/stores/todayStatus'
import { useWarroomStore } from '@/stores/warroom'
import { QUOTES_EFFORT, QUOTES_RESILIENCE, QUOTES_CONFIDENCE } from '@/data/quotes'

const today = useTodayStatusStore()
const wr = useWarroomStore()

/* ===== 调色 & 科目映射 ===== */
const C = { math: '#3ddc84', c408: '#4aa8ff', eng: '#ff9f45', pol: '#ff5f6d', gold: '#ffcf5c', gray: '#5f7189' }
interface SubMeta { wk: 'math' | 'c408' | 'eng' | 'pol', tk: 'math' | 'cs408' | 'english' | 'politics', name: string, tgt: string, note: string }
const SUBMETA: SubMeta[] = [
  { wk: 'math', tk: 'math', name: '数学一', tgt: '130+', note: '真题多套已刷并复盘，剩近年数套；已进模拟卷（26李林6+4做了2套）。弱点：会而不对 + 曲线曲面积分/参数估计。' },
  { wk: 'c408', tk: 'cs408', name: '408', tgt: '110–120', note: '计组存储器大题已基本刷通；OS 真题大题带刷中（PV/调度，累计 17/126）；OS/计网强化未完（10-15 红线）。' },
  { wk: 'eng', tk: 'english', name: '英语一', tgt: '70+', note: '2019 全套收官、精读推进到 2020；作文（0 基础）逾期未启动＝最大缺口；单词停新词。' },
  { wk: 'pol', tk: 'politics', name: '政治', tgt: '65–70', note: '马原网课 + 肖1000 马原部分一刷完成；后置科目，其余模块用思维导图带过，11 月肖八、12 月肖四发力。' }
]
const VC: Record<string, string> = { math: C.math, c408: C.c408, eng: C.eng, pol: C.pol }

/* ===== 四科环：完成度 / 应达 / 判定（单一真相：todayStatus.progressWarnings） ===== */
const R = 70, SW = 13, CX = 85, CY = 85, CIRC = 2 * Math.PI * R
function verdictOf(delta: number): [string, string] {
  if (delta >= 10) return ['领先·安全垫', C.math]
  if (delta >= 2) return ['超前·守住', C.math]
  if (delta >= -2) return ['贴线·可争取', C.gold]
  if (delta >= -10) return ['轻微欠账', C.eng]
  return ['重点欠账·补', C.pol]
}
interface Gauge { wk: string, name: string, color: string, pct: number, should: number, delta: number, verdict: string[], off: number, tick: { x1: number, y1: number, x2: number, y2: number }, note: string, tgt: string }
const gauges = computed<Gauge[]>(() => SUBMETA.map(m => {
  const pw = today.progressWarnings.find(p => p.key === m.tk)
  const pct = pw ? pw.actual : 0
  const should = pw ? pw.expected : 0
  const delta = pct - should
  const th = should / 100 * 2 * Math.PI
  return {
    wk: m.wk, name: m.name, color: VC[m.wk], pct, should, delta,
    verdict: verdictOf(delta), off: CIRC * (1 - pct / 100),
    tick: {
      x1: +(CX + (R - SW / 2 - 3) * Math.sin(th)).toFixed(1),
      y1: +(CY - (R - SW / 2 - 3) * Math.cos(th)).toFixed(1),
      x2: +(CX + (R + SW / 2 + 3) * Math.sin(th)).toFixed(1),
      y2: +(CY - (R + SW / 2 + 3) * Math.cos(th)).toFixed(1)
    },
    note: m.note, tgt: m.tgt
  }
}))
const ringAnimate = ref(false) // 挂载后开启 → 环从满偏移动画到目标

/* ===== 综合战力（分值加权，读 overallPrep） ===== */
const comp = computed(() => today.overallPrep.actual)
const compShould = computed(() => today.overallPrep.expected)
const compDiff = computed(() => comp.value - compShould.value)
const compColor = computed(() => comp.value >= 70 ? C.math : comp.value >= 50 ? C.gold : C.pol)

/* ===== 英雄区 facts 实时行 ===== */
const heroFacts = computed(() => {
  const lab: Record<string, string> = { math: '数学', eng: '英语', c408: '408', pol: '政治' }
  const order: SubMeta['wk'][] = ['math', 'eng', 'c408', 'pol']
  return order.map(wk => {
    const g = gauges.value.find(x => x.wk === wk)!
    const s = g.delta >= 0 ? `· 超前 ${g.delta.toFixed(1)}` : `· 欠 ${Math.abs(g.delta).toFixed(1)}`
    return { wk, led: VC[wk], name: `${lab[wk]} ${g.pct.toFixed(1)}% ${s}` }
  })
})

/* ===== 分数账 / gap bars（静态经验估计，用于排优先级） ===== */
interface Gap { wk: string, name: string, max: number, base: number, target: number, sub: string, segs: [string, number, string][] }
const GAPS: Gap[] = [
  { wk: 'math', name: '数学一', max: 150, base: 108, target: 130, sub: '已稳 108 → 目标 130 · 缺口 20 拆成可攻动作', segs: [['会而不对回炉', 8, C.math], ['曲线曲面积分专题', 7, '#2bb673'], ['参数估计/幂级数', 5, '#86efac']] },
  { wk: 'eng', name: '英语一', max: 100, base: 52, target: 70, sub: '已稳 52 → 目标 70 · 缺口几乎全在作文', segs: [['作文 0→15', 15, C.eng], ['小三门技巧', 6, '#ffbe7d'], ['阅读保分', 3, '#ffd9b3']] },
  { wk: 'c408', name: '408', max: 150, base: 82, target: 115, sub: '已稳 82 → 目标 110–120 · 大题空间最大', segs: [['选择题提速', 12, C.c408], ['真题大题', 18, '#7cc0ff'], ['OS/计网补坑', 8, '#b3dcff']] },
  { wk: 'pol', name: '政治', max: 100, base: 40, target: 68, sub: '已稳 40 → 目标 65–70 · 选择题为王', segs: [['选择题争 35+', 12, C.pol], ['肖四大题', 18, '#ff97a0']] }
]
function gapTrack(g: Gap) {
  const bw = 100 / g.max
  const baseW = g.base * bw
  const segs = g.segs.map(s => ({ w: s[1] * bw, color: s[2], label: s[1] * bw > 7 ? `+${s[1]}` : '', name: s[0], gain: s[1] }))
  const tickL = g.target / g.max * 100
  return { baseW, segs, tickL }
}

/* ===== 优先级矩阵（SVG 气泡，静态坐标数据） ===== */
const MW = 720, MH = 540, MPL = 54, MPR = 26, MPT = 26, MPB = 48
const miw = MW - MPL - MPR, mih = MH - MPT - MPB
const mx = (v: number) => MPL + v / 100 * miw
const my = (v: number) => MPT + (100 - v) / 100 * mih
interface Bubble { label: string, x: number, y: number, r: number, color: string, hot: boolean }
const MATRIX: Bubble[] = [
  { label: '英语作文启动', x: 92, y: 88, r: 26, color: C.eng, hot: true },
  { label: '408 选择提速', x: 70, y: 86, r: 22, color: C.c408, hot: true },
  { label: '政治砍课→选择', x: 82, y: 74, r: 18, color: C.pol, hot: true },
  { label: '数学会而不对回炉', x: 58, y: 92, r: 24, color: C.math, hot: true },
  { label: '408 真题大题', x: 64, y: 60, r: 24, color: C.c408, hot: false },
  { label: '曲线曲面积分专题', x: 40, y: 74, r: 20, color: C.math, hot: false },
  { label: '英语新题型完型', x: 30, y: 80, r: 14, color: C.eng, hot: false },
  { label: '数学选填满分', x: 22, y: 66, r: 16, color: C.math, hot: false },
  { label: 'OS/计网收尾(硬)', x: 86, y: 40, r: 16, color: C.c408, hot: false },
  { label: '政治肖四大题', x: 48, y: 58, r: 22, color: C.pol, hot: false },
  { label: '英语阅读保分', x: 36, y: 46, r: 14, color: C.eng, hot: false },
  { label: '参数估计/幂级数', x: 44, y: 70, r: 15, color: C.math, hot: false },
  { label: '408 模拟卷', x: 16, y: 20, r: 12, color: C.gold, hot: false },
  { label: '黑书/题海120套', x: 12, y: 12, r: 16, color: C.gray, hot: false }
]
const matrixGridX = [0, 20, 40, 60, 80, 100]
const matrixGridY = [0, 20, 40, 60, 80, 100]

/* ===== 一天时间块 ===== */
const dayStart = 6.5, dayEnd = 23
const pos = (h: number) => (h - dayStart) / (dayEnd - dayStart) * 100
const DAY_BLOCKS = [
  ['晨间碎片', 6.5, 8, C.gold, '单词/时政/默写'], ['数学·限时真题/回炉', 8, 11, C.math, '3h 整块'],
  ['408 选择提速', 11, 12, C.c408, '1h'], ['英语精读+作文', 14, 16.5, C.eng, '2.5h 生物钟'],
  ['408 真题大题', 16.5, 18, C.c408, '1.5h 动笔'], ['政治选择题', 19.5, 21, C.pol, '1.5h'],
  ['数学回炉+公式默写', 21, 22.5, C.math, '1.5h 复盘']
] as [string, number, number, string, string][]
const DAY_AXIS = [7, 9, 11, 13, 15, 17, 19, 21, 23]

/* ===== 60 天关键节点 ===== */
const TL = [
  [10, 15, '408 红线', 'OS/计网强化收尾，否则大题 17→12', 'red'], [10, 18, '作文成型', '小作文 5 类 + 大作文 3 类双库', 'gold'],
  [10, 20, '政治截止', '串讲没过完即弃转肖八', 'red'], [11, 5, '肖八到手', '选择题攻坚', ''],
  [11, 15, '作文上答题卡', '每天全真默写；408 大题过半', 'gold'], [12, 5, '肖四到手', '大题背诵冲刺 +3~4h/天', ''],
  [12, 10, '全真模拟', '近 3 年真题 + 数学 2026 全真', ''], [12, 13, '停新题', '只回错题/公式/作文/肖四', 'gold']
] as [number, number, string, string, string][]

/* ===== 战训清单 ===== */
interface Task { id: string, k: string, label: string }
const TASKS: Task[] = [
  { id: 'math-reheat', k: 'math', label: '数学：会而不对 A4 默写表盖住写一遍' },
  { id: 'math-topic', k: 'math', label: '数学：曲线曲面积分 / 端点型MLE 专题 1 组' },
  { id: 'eng-writing', k: 'eng', label: '英语：作文 1 篇（小作文框架 / 大作文骨架）' },
  { id: 'eng-word', k: 'eng', label: '英语：真题词 + 生词本 30min（只认读）' },
  { id: 'c408-choice', k: 'c408', label: '408：选择题限时 1 组（压进 40min）' },
  { id: 'c408-big', k: 'c408', label: '408：真题大题 2 道（先硬写再对答案）' },
  { id: 'pol-choice', k: 'pol', label: '政治：1000 题错题 1 节 + 考点回填手册' }
]
const taskK = (id: string) => TASKS.find(t => t.id === id)?.k || ''
const chkDone = computed(() => TASKS.filter(t => wr.todayChecks[t.id]).length)

function onCheck(t: Task, e: MouseEvent) {
  const res = wr.toggleCheck(t.id, 12)
  if (res === 'checked') {
    const el = (e.currentTarget as HTMLElement)
    const r = el.getBoundingClientRect()
    burst(r.left + r.width * 0.14, r.top + r.height / 2, VC[t.k] || C.gold)
    toast(praise(), VC[t.k] || C.math)
    snapAndTrend()
  }
}

/* ===== 高光时刻 ===== */
const logInput = ref('')
function submitLog(e: MouseEvent) {
  if (wr.addLog(logInput.value)) {
    logInput.value = ''
    const el = (e.currentTarget as HTMLElement)
    const r = el.getBoundingClientRect()
    burst(r.left + r.width / 2, r.top + r.height / 2, C.math)
    toast('已记入高光时刻', C.gold)
  }
}

/* ===== 真题计数 ===== */
function bump(which: 'mathDone' | 'c408Done', d: number, e: MouseEvent) {
  const increased = wr.bumpCounter(which, d)
  if (increased) {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
    burst(r.left, r.top, C.gold)
    snapAndTrend()
  }
}

/* ===== toast ===== */
interface Toast { id: number, msg: string, color: string, out: boolean }
const toasts = ref<Toast[]>([])
let toastSeq = 0
function toast(msg: string, color: string) {
  const id = ++toastSeq
  toasts.value.push({ id, msg, color, out: false })
  setTimeout(() => {
    const t = toasts.value.find(x => x.id === id)
    if (t) t.out = true
    setTimeout(() => { toasts.value = toasts.value.filter(x => x.id !== id) }, 400)
  }, 2300)
}
const PRAISE = ['漂亮，又拿下一城。', '兑现率+1，考场就稳这一口。', '别停，手感正在升温。', '这一小时会回报你十倍。', '稳。离目标又近一格。', '积累看得见，继续。']
function praise() { return PRAISE[Math.floor(Math.random() * PRAISE.length)] }

/* ===== 战力曲线（trend） ===== */
const ANCHOR = new Date(2026, 10, 11)
const examMs = computed(() => new Date(today.examDate + 'T00:00:00').getTime())
function snapAndTrend() { wr.snapshot(comp.value) }
interface TrendPt { x: number, y: number, date: string, v: number, last: boolean }
const trendChart = computed(() => {
  const W = 780, H = 250, PL = 42, PR = 18, PT = 18, PB = 34
  const iw = W - PL - PR, ih = H - PT - PB
  const aMs = ANCHOR.getTime(), eMs = examMs.value
  const X = (ms: number) => PL + Math.max(0, Math.min(1, (ms - aMs) / (eMs - aMs))) * iw
  const Y = (val: number) => PT + (1 - val / 100) * ih
  const pts: TrendPt[] = wr.trend.map(p => ({ x: X(Date.parse(p.date + 'T00:00:00')), y: Y(p.v), date: p.date, v: p.v, last: false }))
  if (pts.length) pts[pts.length - 1].last = true
  let line = '', area = ''
  if (pts.length > 1) {
    line = 'M' + pts.map(p => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L')
    area = `${line} L${pts[pts.length - 1].x.toFixed(1)} ${Y(0)} L${pts[0].x.toFixed(1)} ${Y(0)} Z`
  }
  const c0 = compShould.value
  const ramp = { x1: X(aMs), y1: Y(c0), x2: X(eMs), y2: Y(100) }
  const tX = X(new Date().setHours(0, 0, 0, 0))
  const months: [number, number, number, string][] = [[2026, 10, 11, '10/11'], [2026, 10, 27, '10/27'], [2026, 11, 12, '11/12'], [2026, 11, 28, '11/28'], [2026, 12, 18, '12/19 初试']]
  return {
    W, H, PL, PT, iw, ih,
    gridY: [0, 25, 50, 75, 100].map(g => ({ y: Y(g), label: g })),
    xTicks: months.map((m, i) => ({ x: X(new Date(m[0], m[1], m[2]).getTime()), label: m[3], end: i === months.length - 1 })),
    pts, line, area, ramp, tX,
    meta: `已记录 ${pts.length} 天 · 最新战力 ${pts.length ? pts[pts.length - 1].v.toFixed(1) : '--'}%`
  }
})

/* ===== 今日战训语录 ===== */
const QUOTES = [...QUOTES_EFFORT, ...QUOTES_RESILIENCE, ...QUOTES_CONFIDENCE]
const qi = ref(0)
const quoteFade = ref(false)

/* ===== 倒计时（live） ===== */
const cd = reactive({ days: 0, hh: '00', mm: '00', ss: '00', dateLabel: '' })
function tickCD() {
  const target = new Date(today.examDate + 'T08:30:00').getTime()
  const diff = target - Date.now()
  cd.days = Math.max(0, Math.ceil(diff / 86400000))
  if (diff > 0) {
    const s = Math.floor(diff / 1000)
    cd.hh = String(Math.floor(s / 3600) % 24).padStart(2, '0')
    cd.mm = String(Math.floor(s / 60) % 60).padStart(2, '0')
    cd.ss = String(s % 60).padStart(2, '0')
  }
  const n = new Date()
  cd.dateLabel = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')} · 周${['日', '一', '二', '三', '四', '五', '六'][n.getDay()]}`
}

/* ===== confetti ===== */
const confettiRef = ref<HTMLCanvasElement | null>(null)
let ctx2d: CanvasRenderingContext2D | null = null
interface Part { x: number, y: number, vx: number, vy: number, g: number, s: number, c: string, life: number, max: number, rot: number, vr: number }
const parts: Part[] = []
let raf: number | null = null
function sizeCv() { const cv = confettiRef.value; if (cv) { cv.width = window.innerWidth; cv.height = window.innerHeight } }
function burst(x: number, y: number, color: string) {
  const cv = confettiRef.value; if (!cv || !ctx2d) return
  const pal = [color, C.gold, C.math, C.c408, C.eng]
  for (let i = 0; i < 26; i++) {
    const a = Math.random() * Math.PI * 2, sp = 2 + Math.random() * 5
    parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 3, g: 0.14 + Math.random() * 0.08, s: 3 + Math.random() * 4, c: pal[Math.floor(Math.random() * pal.length)], life: 0, max: 70 + Math.random() * 40, rot: Math.random() * 6, vr: -0.2 + Math.random() * 0.4 })
  }
  if (raf == null) raf = requestAnimationFrame(loopCv)
}
function loopCv() {
  const cv = confettiRef.value; if (!cv || !ctx2d) return
  ctx2d.clearRect(0, 0, cv.width, cv.height)
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]
    p.life++; p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.vx *= 0.99
    if (p.life > p.max || p.y > cv.height + 20) { parts.splice(i, 1); continue }
    ctx2d.save(); ctx2d.translate(p.x, p.y); ctx2d.rotate(p.rot); ctx2d.globalAlpha = Math.max(0, 1 - p.life / p.max)
    ctx2d.fillStyle = p.c; ctx2d.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 1.6); ctx2d.restore()
  }
  if (parts.length) raf = requestAnimationFrame(loopCv); else { raf = null; ctx2d.clearRect(0, 0, cv.width, cv.height) }
}

/* ===== 导入 / 导出 / 重置 ===== */
const fileRef = ref<HTMLInputElement | null>(null)
function exportSave() {
  try {
    const blob = new Blob([wr.exportData()], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = `作战室存档-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a); a.click(); a.remove()
    setTimeout(() => URL.revokeObjectURL(a.href), 1500)
    toast('存档已导出', C.c408)
  } catch (e) { toast('导出失败', C.pol) }
}
function pickImport() { fileRef.value?.click() }
function onImport(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return
  const rd = new FileReader()
  rd.onload = () => {
    if (wr.importData(String(rd.result))) { burst(window.innerWidth / 2, 120, C.c408); toast('存档已导入', C.c408) }
    else toast('导入失败：文件无效', C.pol)
  }
  rd.readAsText(f); (e.target as HTMLInputElement).value = ''
}
function doReset() {
  if (confirm('确定清空本机所有战训勾选、连胜、真题计数与高光时刻，恢复出厂数值？（进度完成度仍来自今日状态页，不受影响）')) {
    wr.reset(); wr.snapshot(comp.value); toast('已重置', C.pol)
  }
}

let cdTimer = 0, quoteTimer = 0
onMounted(async () => {
  await today.load()
  wr.load(); wr.snapshot(comp.value)
  ctx2d = confettiRef.value?.getContext('2d') || null
  sizeCv(); window.addEventListener('resize', sizeCv)
  tickCD(); cdTimer = window.setInterval(tickCD, 1000)
  const dayIdx = Math.floor((new Date().setHours(0, 0, 0, 0) - ANCHOR.getTime()) / 86400000)
  qi.value = ((dayIdx % QUOTES.length) + QUOTES.length) % QUOTES.length
  quoteTimer = window.setInterval(() => {
    quoteFade.value = true
    setTimeout(() => { qi.value = (qi.value + 1) % QUOTES.length; quoteFade.value = false }, 500)
  }, 9000)
  nextTick(() => { ringAnimate.value = true })
})
onBeforeUnmount(() => {
  clearInterval(cdTimer); clearInterval(quoteTimer)
  window.removeEventListener('resize', sizeCv)
  if (raf != null) cancelAnimationFrame(raf)
})
const quote = computed(() => QUOTES[qi.value])
</script>

<template>
  <div class="warroom">
    <canvas ref="confettiRef" class="confetti"></canvas>
    <div class="toast-wrap">
      <div v-for="t in toasts" :key="t.id" class="toast" :class="{ out: t.out }" :style="{ background: t.color }">
        <span class="ti">★</span><span>{{ t.msg }}</span>
      </div>
    </div>

    <div class="wrap">
      <!-- STATUS STRIP -->
      <div class="statusbar">
        <span class="live"><i></i>SYSTEM ONLINE</span>
        <span>MODE / 冲刺 · 4 SUBJECTS</span>
        <span>DATE / {{ cd.dateLabel }}</span>
        <span class="sp">T-{{ cd.days }} DAYS · {{ cd.hh }}:{{ cd.mm }}:{{ cd.ss }}</span>
      </div>

      <!-- HERO -->
      <div class="hud hero rv">
        <div class="meta">// GRADUATE-ENTRY EXAM · MATH-I / 408 / ENGLISH-I / POLITICS</div>
        <div class="hero-grid">
          <div>
            <h1>最后 <span class="hl">{{ cd.days }} 天</span><br>四科提分战术作战室</h1>
            <span class="bar"></span>
            <div class="desc">数据源已接入你的进度真相（今日状态 store · 单一来源）。按边际提分性价比排序，不按焦虑排序。下方控制台可实时登记战训、勾选即庆祝，环上金标=随日期自动爬升的应达刻度。四科完成度改到「今日状态」页勾选任务即自动同步。</div>
          </div>
          <div class="readout">
            <div class="ro"><div class="n mono">{{ cd.days }}</div><div class="l">天到初试</div></div>
            <div class="ro"><div class="n mono">≈{{ Math.ceil(cd.days / 9) }}</div><div class="l">个 9 天周</div></div>
          </div>
        </div>
        <div class="reframe">
          <div class="intel">
            <div class="lab">◆ INTEL BRIEF · 态势研判</div>
            <div class="q">你的"危险感"来自<em>参照系错了</em>：唯一超前的（数学）恰恰最难补，最难追的基本盘已锁定；而欠着的（英语作文 / 政治 / 408 大题）全是<em>后置·模板型</em>——10 到 12 月正是它们提分最快的窗口。</div>
            <div class="a">你不是"落后"，是"欠账集中在可逆区"。按下面的顺序打，完全够翻盘。</div>
          </div>
          <div class="facts">
            <div class="fact" v-for="f in heroFacts" :key="f.wk">
              <span class="led" :style="{ background: f.led, boxShadow: '0 0 8px ' + f.led }"></span>
              <div><div class="fn">{{ f.name }}</div><div class="fd">{{ ({ math: '上扬曲线 · 先堵兑现率', eng: '作文今天开 · 提分最快', c408: '真题大题空间最大', pol: '10 月少投 · 12 月发力' } as Record<string,string>)[f.wk] }}</div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 00 LIVE CONSOLE -->
      <section class="rv" id="console">
        <div class="kick"><span class="no">00</span><h2>作战控制台</h2><span class="en">// live console</span><span class="sub">打勾即庆祝 · 数据自动保存在本机</span><span class="rule"></span></div>
        <div class="console">
          <div class="hud cp">
            <div class="stat-strip">
              <div class="stat comp"><div class="sl">综合战力 // readiness</div><div class="sv" :style="{ color: compColor }">{{ comp.toFixed(1) }}%</div><div class="ss">应达均速 {{ compShould.toFixed(1) }}% · 你 <b :style="{ color: compDiff >= 0 ? C.math : C.pol }">{{ compDiff >= 0 ? '超 ' + compDiff.toFixed(1) : '欠 ' + Math.abs(compDiff).toFixed(1) }}</b></div></div>
              <div class="stat streak"><div class="sl">连胜 // streak</div><div class="sv">{{ wr.streak }}<span style="font-size:16px;color:var(--ink3)"> 天</span></div><div class="ss">{{ wr.streak > 0 ? ('最近开火 ' + wr.lastDate) : '今天还没开火' }}</div></div>
              <div class="stat lvl"><div class="sl">等级 // level</div>
                <div class="xpv"><div class="sv">Lv.{{ wr.level }}</div><div class="sm">{{ wr.xp }} XP</div></div>
                <div class="lvbar"><i :style="{ width: (wr.xpIntoLevel / 120 * 100) + '%' }"></i></div>
                <div class="ss">勾选战训 / 推进进度即得 XP</div>
              </div>
            </div>
            <div class="check-h">今日战训清单 <span style="font-size:11px;color:var(--ink3);font-family:var(--mono)">DAILY OBJECTIVES</span><span class="cnt">完成 <b>{{ chkDone }}</b>/<span>{{ TASKS.length }}</span></span></div>
            <div class="checks">
              <div v-for="t in TASKS" :key="t.id" class="chk" :class="{ done: wr.todayChecks[t.id] }" @click="onCheck(t, $event)">
                <span class="box"><svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#06121f" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
                <span class="dot" :style="{ background: VC[t.k] }"></span>
                <span class="cl">{{ t.label }}</span>
                <span class="cg">+12 XP</span>
              </div>
            </div>
            <div class="cp-tools">
              <div class="counter"><span class="dot" style="width:8px;height:8px;border-radius:50%;background:var(--math)"></span><span class="cn">数学真题</span><button class="cbtn" @click="bump('mathDone', -1, $event)">−</button><span class="cv">{{ wr.counters.mathDone }}<span>/{{ wr.counters.mathTotal }}</span></span><button class="cbtn" @click="bump('mathDone', 1, $event)">+</button></div>
              <div class="counter"><span class="dot" style="width:8px;height:8px;border-radius:50%;background:var(--c408)"></span><span class="cn">408 大题</span><button class="cbtn" @click="bump('c408Done', -1, $event)">−</button><span class="cv">{{ wr.counters.c408Done }}<span>/{{ wr.counters.c408Total }}</span></span><button class="cbtn" @click="bump('c408Done', 1, $event)">+</button></div>
              <button class="tbtn" @click="exportSave">导出存档</button>
              <button class="tbtn" @click="pickImport">导入存档</button>
              <button class="tbtn danger" @click="doReset">重置</button>
              <input ref="fileRef" type="file" accept="application/json" style="display:none" @change="onImport">
            </div>
          </div>
          <div class="hud cp">
            <div class="check-h" style="margin-bottom:2px">高光时刻 <span style="font-size:11px;color:var(--ink3);font-family:var(--mono)">VICTORY LOG</span></div>
            <div style="font-size:12px;color:var(--ink3);margin-bottom:6px">记下今天拿下的一城——考前回头翻，全是弹药。</div>
            <div class="log-add"><input v-model="logInput" placeholder="例：搞定了旋转曲面列方程 / 端点型MLE第3次终于想到" maxlength="80" @keydown.enter="submitLog"><button @click="submitLog">＋</button></div>
            <div class="log-list">
              <div v-if="!wr.log.length" class="log-empty">还没有战果。拿下第一题就记一条。</div>
              <div v-for="(it, i) in wr.log.slice(0, 40)" :key="i" class="logitem">
                <span class="ld">{{ it.date.slice(5) }}</span><span class="lt">{{ it.text }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="hud quote"><span class="qi">今日战训 //</span><span class="qt" :class="{ fade: quoteFade }">{{ quote.text }}</span><span class="qa" :class="{ fade: quoteFade }">—— {{ quote.author }}<template v-if="quote.src"> · {{ quote.src }}</template></span></div>
      </section>

      <!-- 01 GAUGES -->
      <section class="rv">
        <div class="kick"><span class="no">01</span><h2>态势总览</h2><span class="en">// situation</span><span class="sub">完成度与应达刻度实时读取 · 数据源=今日状态页</span><span class="rule"></span></div>
        <div class="gauges">
          <div class="hud gauge" v-for="g in gauges" :key="g.wk">
            <div class="gname" :style="{ color: g.color }">{{ g.name }}</div>
            <div class="verdict" :style="{ background: g.verdict[1] + '22', color: g.verdict[1] }">{{ g.verdict[0] }}</div>
            <div class="ring">
              <svg width="170" height="170" viewBox="0 0 170 170">
                <circle :cx="CX" :cy="CY" :r="R" fill="none" stroke="rgba(255,255,255,.06)" :stroke-width="SW" />
                <circle :cx="CX" :cy="CY" :r="R" fill="none" :stroke="g.color" :stroke-width="SW" stroke-linecap="round" :stroke-dasharray="CIRC" :stroke-dashoffset="ringAnimate ? g.off : CIRC" class="arc" :style="{ filter: 'drop-shadow(0 0 6px ' + g.color + '66)' }" />
                <line :x1="g.tick.x1" :y1="g.tick.y1" :x2="g.tick.x2" :y2="g.tick.y2" :stroke="C.gold" stroke-width="2.5" />
              </svg>
              <div class="ctr"><div class="p" :style="{ color: g.color }">{{ g.pct }}</div><div class="pl">% 完成</div></div>
            </div>
            <div class="delta" :class="g.delta >= 0 ? 'up' : 'down'">{{ g.delta >= 0 ? '▲' : '▼' }} 应达 {{ g.should }} · 差 {{ g.delta.toFixed(1) }}</div>
            <div class="note">{{ g.note }}</div>
            <div class="tgt">目标 <b>{{ g.tgt }}</b></div>
          </div>
        </div>
      </section>

      <!-- 02 SCORE LEDGER -->
      <section class="rv">
        <div class="kick"><span class="no">02</span><h2>分数账 · 每一分从哪来</h2><span class="en">// point ledger</span><span class="sub">把目标缺口拆成可攻动作 · 经验估计用于排序</span><span class="rule"></span></div>
        <div class="gaps">
          <div class="hud gap" v-for="g in GAPS" :key="g.wk">
            <div class="gh"><span class="name" :style="{ color: VC[g.wk] }">{{ g.name }}</span><span class="goal">目标 <b>{{ g.target }}</b> / {{ g.max }}</span></div>
            <div class="gsub">{{ g.sub }}</div>
            <div class="track">
              <div class="seg base" :style="{ width: gapTrack(g).baseW + '%' }">已稳 {{ g.base }}</div>
              <div v-for="(s, i) in gapTrack(g).segs" :key="i" class="seg" :title="s.name + ' +' + s.gain" :style="{ width: s.w + '%', background: s.color }">{{ s.label }}</div>
              <div class="tick" :style="{ left: gapTrack(g).tickL.toFixed(1) + '%' }"></div>
            </div>
            <div class="legend2">
              <span class="li"><span class="sw" style="background:rgba(150,170,195,.28)"></span>已锁定 <b>{{ g.base }}</b></span>
              <span class="li" v-for="(s, i) in gapTrack(g).segs" :key="i"><span class="sw" :style="{ background: s.color }"></span>{{ s.name }} <b>+{{ s.gain }}</b></span>
            </div>
          </div>
        </div>
      </section>

      <!-- 03 MATRIX -->
      <section class="rv">
        <div class="kick"><span class="no">03</span><h2>优先级作战矩阵</h2><span class="en">// priority matrix</span><span class="sub">纵=提分效率 · 横=紧迫/缺口 · 泡径=分值权重</span><span class="rule"></span></div>
        <div class="matrix-wrap">
          <div class="hud matrix">
            <div class="mreadout">X:URGENCY→ · Y:ROI↑ · R:WEIGHT</div>
            <svg :viewBox="'0 0 ' + MW + ' ' + MH" preserveAspectRatio="xMidYMid meet">
              <rect :x="MPL" :y="MPT" :width="miw / 2" :height="mih / 2" fill="rgba(61,220,132,.05)" />
              <rect :x="MPL + miw / 2" :y="MPT" :width="miw / 2" :height="mih / 2" fill="rgba(255,207,92,.08)" />
              <rect :x="MPL" :y="MPT + mih / 2" :width="miw / 2" :height="mih / 2" fill="rgba(95,113,137,.05)" />
              <rect :x="MPL + miw / 2" :y="MPT + mih / 2" :width="miw / 2" :height="mih / 2" fill="rgba(74,168,255,.05)" />
              <line v-for="gx in matrixGridX" :key="'gx' + gx" :x1="mx(gx)" :y1="MPT" :x2="mx(gx)" :y2="MPT + mih" stroke="rgba(120,150,190,.10)" stroke-width="1" />
              <line v-for="gy in matrixGridY" :key="'gy' + gy" :x1="MPL" :y1="my(gy)" :x2="MPL + miw" :y2="my(gy)" stroke="rgba(120,150,190,.10)" stroke-width="1" />
              <line :x1="mx(50)" :y1="MPT" :x2="mx(50)" :y2="MPT + mih" stroke="rgba(120,150,190,.35)" stroke-width="1.5" stroke-dasharray="4 4" />
              <line :x1="MPL" :y1="my(50)" :x2="MPL + miw" :y2="my(50)" stroke="rgba(120,150,190,.35)" stroke-width="1.5" stroke-dasharray="4 4" />
              <rect :x="MPL" :y="MPT" :width="miw" :height="mih" fill="none" stroke="rgba(120,150,190,.25)" stroke-width="1" />
              <text :x="MPL - 8" :y="MPT + mih / 2" fill="#9fb0c4" font-size="11" text-anchor="middle" :transform="'rotate(-90 ' + (MPL - 8) + ' ' + (MPT + mih / 2) + ')'">效率 ROI ↑</text>
              <text :x="MPL + miw / 2" :y="MH - 14" fill="#9fb0c4" font-size="11" text-anchor="middle">紧迫 / 缺口 →</text>
              <text :x="MPL + 6" :y="MPT + 16" fill="rgba(61,220,132,.7)" font-size="12">② 稳定推进</text>
              <text :x="MPL + miw - 6" :y="MPT + 16" fill="rgba(255,207,92,.85)" font-size="12" text-anchor="end">① 立即开火</text>
              <text :x="MPL + 6" :y="MPT + mih - 8" fill="rgba(95,113,137,.8)" font-size="12">④ 战略放弃</text>
              <text :x="MPL + miw - 6" :y="MPT + mih - 8" fill="rgba(74,168,255,.75)" font-size="12" text-anchor="end">③ 硬骨头</text>
              <g v-for="(b, i) in MATRIX" :key="i" :transform="'translate(' + mx(b.x).toFixed(1) + ',' + my(b.y).toFixed(1) + ')'">
                <circle v-if="b.hot" :r="b.r + 6" :fill="b.color" opacity="0.16" class="halo" />
                <circle :r="b.r" :fill="b.color" opacity="0.9" stroke="rgba(255,255,255,.5)" stroke-width="1" />
                <text :y="b.r + 13" text-anchor="middle" fill="#e9eef5" font-size="11.5" paint-order="stroke" stroke="rgba(7,11,18,.9)" stroke-width="3">{{ b.label }}</text>
              </g>
            </svg>
          </div>
          <div class="hud legend">
            <h4>怎么读这张图</h4>
            <div class="hint">越靠右上越该立刻做；左下是战略放弃区</div>
            <div class="li"><span class="qbadge" style="background:rgba(255,207,92,.16);color:var(--gold)">①</span><div><b>右上 · 立即开火</b><br>效率又高缺口又大：英语作文、408 选择提速、政治砍课转选择、数学会而不对回炉——这周就动。</div></div>
            <div class="li"><span class="qbadge" style="background:rgba(61,220,132,.16);color:var(--math)">②</span><div><b>左上 · 稳定推进</b><br>效率高不救火：数学选填满分、英语新题型完型、曲线曲面积分专题。每天定量喂。</div></div>
            <div class="li"><span class="qbadge" style="background:rgba(74,168,255,.16);color:var(--c408)">③</span><div><b>右下 · 硬骨头必须啃</b><br>慢但卡红线：OS/计网收尾、408 真题大题。以题带点提速，别泛看视频。</div></div>
            <div class="li"><span class="qbadge" style="background:rgba(95,113,137,.2);color:var(--ink2)">④</span><div><b>左下 · 战略放弃 / 延后</b><br>性价比低：408 模拟卷、黑书、数学 120 套题海、政治毛中特前期课。砍掉，把时间还给右上。</div></div>
          </div>
        </div>
      </section>

      <!-- 04 ROUTES -->
      <section class="rv">
        <div class="kick"><span class="no">04</span><h2>四科战术路线</h2><span class="en">// tactical routes</span><span class="sub">现状 → 瓶颈 → 拿分动作（排序）→ 每日时间 → 红线</span><span class="rule"></span></div>
        <div class="hud route math">
          <div class="rt-head"><span class="tag" style="background:rgba(61,220,132,.14);color:var(--math)">上扬曲线 · 先堵兑现率</span><h3>数学一</h3><span class="flow">策略：10月3h → 11/12月3.5–4h，先焊"会而不对"，再补硬缺口</span></div>
          <div class="rt-body">
            <div class="acts">
              <div class="act"><div class="rk">1</div><div class="body"><b>「会而不对」回炉（最快的一块）</b><p>翻你错题本：几乎每道都做对了最难的核心一步，却死在最后一步——∫sec 原函数记串、½z² 漏系数、高斯"上侧≠外侧"没翻号、路径无关判据凭感觉。这不是不会，是兑现率漏风。抽成 A4 默写表，每天盖住写一遍。</p><span class="src">依据：曲线曲面积分弱点 09-29 · 概率统计弱点 10-08</span></div><div class="gain">+5~10</div></div>
              <div class="act"><div class="rk">2</div><div class="body"><b>曲线/曲面积分专题（唯一真内容缺口）</b><p>数一压轴原型：旋转曲面方程、空间曲线投影、薄片求质量、平方反比场挖洞。唯一"多刷同类真有用"的块，各 3–4 天按四问集中砸：高斯·斯托克斯、投影法 dS。</p><span class="src">依据：149/424 实测 · 129 以真题定强化</span></div><div class="gain">+6~12</div></div>
              <div class="act"><div class="rk">3</div><div class="body"><b>便宜分支：参数估计端点型 + 幂级数求和</b><p>端点型 MLE（θ 只在取值边界那种）补"两类判断"就捡回；幂级数求和固定步骤（先积后导/先导后积 + 拆分子）。都是套路化模板提分。</p><span class="src">依据：10-08 端点型 MLE 第2次踩坑</span></div><div class="gain">+4~8</div></div>
              <div class="act"><div class="rk">4</div><div class="body"><b>模拟卷纪律（32套别海刷）</b><p>手上：26李林6+4（已做前2套）/ 26张宇8+4 / 25超越5+5。<b>26版难度已重排</b>：李林明显变难（大题强度↑、每套计算量特别大、方向正贴真题），难度回落后的 26 张宇与它逼近<b>同一档</b>——往年"李林最简单"的印象作废；超越是 25 版、选填最难且有印刷错误。用法：<b>李林6+4 主力全做</b>（正好治你算慢/会而不对），4 套留考前掐时全真；<b>张宇8+4 选做 3–5 套</b>，只挑计算量大的大题练"可执行第一步"，偏怪/竞赛味/超纲冷门跳过；<b>超越5+5 专项选做 2–3 套</b>，攻第一步卡壳 + 临场抗压，别全刷。顺序：李林 → 穿插张宇 → 超越 → 考前回李林 4 套全真。<b>注意跨年份别直接比难度。</b></p><span class="src">依据：2026 版一手评测（数一143 / 抖音阿经 / 百度客观评测）· 宁缺毋滥</span></div><div class="gain">稳 75–80</div></div>
            </div>
            <div class="side">
              <div class="blk"><div class="h">核心瓶颈</div><div class="c">不是不会，是<b>"会而不对 + 认不出题型"</b>。130 主要靠稳定兑现，不靠刷新题。</div></div>
              <div class="blk"><div class="h">每日投入</div><div class="c">10 月 <b>3h</b>（1h 专题 + 1h 限时 + 1h 回炉）→ 11/12 月 <b>3.5–4h</b>。</div></div>
              <div class="blk"><div class="h">穿插节奏</div><div class="c"><span class="pill">11月起每7–10天1套全真</span><span class="pill">两次全真间插1套精品模拟</span><span class="pill">最后1周停新题</span></div></div>
              <div class="blk"><div class="h">放弃清单</div><div class="c"><span class="pill no">32套全刷</span><span class="pill no">题海 120 套</span><span class="pill no">张宇8+4 大部分</span><span class="pill no">超越5+5 除计算专项外</span></div></div>
            </div>
          </div>
        </div>
        <div class="hud route eng">
          <div class="rt-head"><span class="tag" style="background:rgba(255,159,69,.14);color:var(--eng)">唯一硬欠账 · 今天开作文</span><h3>英语一</h3><span class="flow">策略：作文 + 小三门补分，阅读单词保底</span></div>
          <div class="rt-body">
            <div class="acts">
              <div class="act"><div class="rk">1</div><div class="body"><b>作文从零启动（逾期，今天就开）</b><p>听课→暂停→跟写→想为何。小作文按题型、大作文按主题建双库；单建"主动调用词库"；抄范文顺便练字→AI 纠错→回填。</p><span class="src">出处：89 乌冬面 · 京区79 · 92 旱区</span></div><div class="gain">0→15~18</div></div>
              <div class="act"><div class="rk">2</div><div class="body"><b>新题型 + 完型（纯技巧，短期见效）</b><p>新题型盯首尾句 + 代词/逻辑词；完型抓"复现"。性价比仅次于作文，别拖到 11 月。</p><span class="src">出处：李地球89 · 92</span></div><div class="gain">技巧分</div></div>
              <div class="act"><div class="rk">3</div><div class="body"><b>阅读保分（看懂→选对）</b><p>精读四步 + 定位·比对·排除："找不到依据一律不选"。二刷限时 15–18 分/篇。</p><span class="src">出处：88 精读四步 · 93 干扰套路</span></div><div class="gain">+2~4</div></div>
              <div class="act"><div class="rk">4</div><div class="body"><b>单词：停新词，只过 ROI 核心</b><p>黄皮书真题词 + 生词本，专攻熟词生义；认读即可，拼写只留给作文。</p><span class="src">出处：京区79 转折点 · 词汇 ROI 分档</span></div><div class="gain">守 50+</div></div>
            </div>
            <div class="side">
              <div class="blk"><div class="h">核心瓶颈</div><div class="c">缺口几乎全在<b>作文（0 基础）</b>。补分主战场 = 作文 + 小三门技巧。</div></div>
              <div class="blk"><div class="h">每日投入</div><div class="c"><b>2–2.5h</b>：单词 0.5h + 复盘 1h + 作文 0.5–1h。<b>下午 2–5 点练英语</b>养生物钟。</div></div>
              <div class="blk"><div class="h">排期</div><div class="c"><span class="pill">1–2周 小作文5类</span><span class="pill">3–5周 大作文3类+周1篇</span><span class="pill">11月中 上答题卡默写</span><span class="pill">后1月 套卷</span></div></div>
              <div class="redline">背 ≠ 写。11 月中必须<b>上答题卡限时默写</b>，否则模板想得起写不出。</div>
            </div>
          </div>
        </div>
        <div class="hud route c408">
          <div class="rt-head"><span class="tag" style="background:rgba(74,168,255,.14);color:var(--c408)">贴线 · 最大提分空间</span><h3>408 计算机</h3><span class="flow">策略：选择题提速 + 以真题定强化</span></div>
          <div class="rt-body">
            <div class="acts">
              <div class="act"><div class="rk">1</div><div class="body"><b>选择题提速（80 分，最快最稳）</b><p>覆盖碎点、提分最快。防"选择耗到 80 分钟→慌乱→大题连环看错"。每天限时刷到条件反射。</p><span class="src">出处：软微血泪 · 441 · 131</span></div><div class="gain">地基</div></div>
              <div class="act"><div class="rk">2</div><div class="body"><b>真题大题 2 道/天</b><p>先硬写再对答案，定位卡在哪一问。算法题分层：暴力/模板/优化。按年一刷、按科归类二刷。</p><span class="src">出处：123 分 · 精炼指南三刷</span></div><div class="gain">大题 70</div></div>
              <div class="act"><div class="rk">3</div><div class="body"><b>OS/计网强化 · 红线前收尾</b><p>视频只当补丁，<b>视频:做题 = 1:3</b>。以题带点：先做真题暴露漏洞→回书清死角→费曼回捞。</p><span class="src">出处：软微 kira 醒脑 · 终极指南误区5</span></div><div class="gain">补坑</div></div>
              <div class="act"><div class="rk">4</div><div class="body"><b>高频大题套路固定化</b><p>OS-PV 每天照模板动笔；计组 Cache 画映射图 + 背性能公式；计网每层一张卡片 + 子网划分每天 3 题。</p><span class="src">出处：过来人忠告 · Cache 专项</span></div><div class="gain">高频</div></div>
            </div>
            <div class="side">
              <div class="blk"><div class="h">四科优先级</div><div class="c"><b>OS / 计网</b>（未填坑+红线）→ <b>计组</b>（Cache/数据通路必考）→ <b>数构</b>（选择题保温）。</div></div>
              <div class="blk"><div class="h">每日投入</div><div class="c"><b>3–4h</b>，下午 14–17 点：1.5h 选择 + 1.5h 大题 + 复盘 + 0.5h 记忆卡。</div></div>
              <div class="blk"><div class="h">资料取舍</div><div class="c"><span class="pill">王道课后选择题必做</span><span class="pill">大题以真题为主</span><span class="pill no">王道野题全做</span><span class="pill no">模拟卷</span><span class="pill no">黑书</span></div></div>
              <div class="redline">10-15 红线：OS/计网仍未过完 → 大题从 <b>17 章砍到 12 章</b>，冷门战略放弃。</div>
            </div>
          </div>
        </div>
        <div class="hud route pol">
          <div class="rt-head"><span class="tag" style="background:rgba(255,95,109,.14);color:var(--pol)">后置型 · 别挪数学408时间补</span><h3>政治</h3><span class="flow">策略：选择题为王，大题靠肖四，10 月少投</span></div>
          <div class="rt-body">
            <div class="acts">
              <div class="act"><div class="rk">1</div><div class="body"><b>选择题为王（50 分拉分关键）</b><p>多选全对才得分，先争选择题 35+。三遍法：一刷全做标错、二刷重做错题、三刷只做仍错。当日订正不过夜，考点回填手册。</p><span class="src">出处：1000 题三遍法 · 80 四轮帖</span></div><div class="gain">命脉</div></div>
              <div class="act"><div class="rk">2</div><div class="body"><b>网课只保马原（已看完）+ 史纲</b><p>毛中特/习思想/思修前期课 90% 是帽子题，背诵手册后期突击即可，<b>不必听课</b>；用思维导图带过 → 直接刷肖1000 对应选择题。</p><span class="src">依据：你的策略 · 81 刀刃帖</span></div><div class="gain">省时间</div></div>
              <div class="act"><div class="rk">3</div><div class="body"><b>肖八（11 月上旬）只做选择题</b><p>一天做一天看解析，吃透每道错题背后考点。时政（16 分）吃透一份汇总，刷题顺带记。</p><span class="src">出处：74 速通 · 苏一时政</span></div><div class="gain">考点</div></div>
              <div class="act"><div class="rk">4</div><div class="body"><b>肖四（12 月）大题框架背诵</b><p>到手立即背约 20 道，框架法记逻辑+关键词。肖四是语料非押题，练"设问—原理"对应。考前用答题卡限时 30min/题。</p><span class="src">出处：81 · 小程序帖</span></div><div class="gain">+20</div></div>
            </div>
            <div class="side">
              <div class="blk"><div class="h">核心判断</div><div class="c">政治落后<b>非真掉队</b>——后置型，肖四在 12 月。进度按 100 单元工作量制计，10 月应达刻意低。</div></div>
              <div class="blk"><div class="h">每日投入（阶梯加码）</div><div class="c">现阶段 <b>1–1.5h</b> → 11 月 <b>2–3h</b> → 12 月 <b>3–4h</b>。<b style="color:var(--pol)">别挪数学/408 的时间补政治。</b></div></div>
              <div class="blk"><div class="h">工具</div><div class="c"><span class="pill">苍盾/南山小程序自动错题集</span><span class="pill">碎片 10min 一套</span></div></div>
              <div class="redline">10-20 红线：串讲剩余仍多 → 按红线<b>弃剩余直接转肖八</b>，不恋战。</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 06 TREND -->
      <section class="rv" id="trendsec">
        <div class="kick"><span class="no">06</span><h2>战力曲线</h2><span class="en">// burn-in trend</span><span class="sub">每次打开/勾选自动记录当天 · 金线=应达均速 · 绿线=你的真实综合战力</span><span class="rule"></span></div>
        <div class="hud trend">
          <svg :viewBox="'0 0 ' + trendChart.W + ' ' + trendChart.H" preserveAspectRatio="xMidYMid meet">
            <g>
              <line v-for="g in trendChart.gridY" :key="'ty' + g.label" :x1="trendChart.PL" :y1="g.y" :x2="trendChart.PL + trendChart.iw" :y2="g.y" stroke="rgba(120,150,190,.10)" stroke-width="1" />
              <text v-for="g in trendChart.gridY" :key="'tl' + g.label" :x="trendChart.PL - 7" :y="g.y + 3" text-anchor="end" :fill="C.gray" font-size="10">{{ g.label }}</text>
            </g>
            <g>
              <line v-for="(t, i) in trendChart.xTicks" :key="'txl' + i" :x1="t.x" :y1="trendChart.PT" :x2="t.x" :y2="trendChart.PT + trendChart.ih" stroke="rgba(120,150,190,.07)" stroke-width="1" />
              <text v-for="(t, i) in trendChart.xTicks" :key="'tx' + i" :x="t.x" :y="trendChart.H - 12" :text-anchor="t.end ? 'end' : 'middle'" :fill="C.gray" font-size="10">{{ t.label }}</text>
            </g>
            <line :x1="trendChart.ramp.x1" :y1="trendChart.ramp.y1" :x2="trendChart.ramp.x2" :y2="trendChart.ramp.y2" :stroke="C.gold" stroke-width="2" stroke-dasharray="6 5" opacity="0.8" />
            <text :x="trendChart.ramp.x2 - 4" :y="trendChart.ramp.y2 + 14" text-anchor="end" :fill="C.gold" font-size="11" opacity="0.9">应达均速</text>
            <line :x1="trendChart.tX" :y1="trendChart.PT" :x2="trendChart.tX" :y2="trendChart.PT + trendChart.ih" stroke="rgba(233,238,245,.18)" stroke-width="1" />
            <text :x="Math.min(trendChart.tX + 4, trendChart.W - 40)" :y="trendChart.PT + 11" fill="#9fb0c4" font-size="10">今日</text>
            <path v-if="trendChart.area" :d="trendChart.area" fill="rgba(61,220,132,.10)" stroke="none" />
            <path v-if="trendChart.line" :d="trendChart.line" fill="none" :stroke="C.math" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" :style="{ filter: 'drop-shadow(0 0 5px ' + C.math + '88)' }" />
            <circle v-for="(p, i) in trendChart.pts" :key="'tp' + i" :cx="p.x.toFixed(1)" :cy="p.y.toFixed(1)" r="3.4" :fill="C.math" stroke="#0a1019" stroke-width="1.5" />
            <circle v-for="(p, i) in trendChart.pts.filter(x => x.last)" :key="'th' + i" :cx="p.x.toFixed(1)" :cy="p.y.toFixed(1)" r="3.4" fill="none" :stroke="C.math" stroke-width="2" class="halo" />
          </svg>
          <div class="trend-lg">
            <span class="li"><span class="sw" style="background:var(--math)"></span>你的综合战力（按分值加权）</span>
            <span class="li"><span class="sw dash"></span>应达均速线（从今天爬到 100）</span>
            <span class="li" style="margin-left:auto;color:var(--ink2)">{{ trendChart.meta }}</span>
          </div>
        </div>
      </section>

      <!-- 07 DAY BAR -->
      <section class="rv">
        <div class="kick"><span class="no">07</span><h2>一天怎么排 · 时间块</h2><span class="en">// daily blocks</span><span class="sub">按真实钟点铺开 · 一科一块不混做</span><span class="rule"></span></div>
        <div class="hud day">
          <div class="dhead"><span class="t">典型冲刺日 · 有效学习约 11h</span><span class="s">06:30 → 23:00 · 午休/留白为灰</span></div>
          <div class="daybar">
            <div v-for="(b, i) in DAY_BLOCKS" :key="i" class="dblk" :style="{ left: pos(b[1]) + '%', width: (pos(b[2]) - pos(b[1])) + '%', background: b[3] }">
              <div class="bt">{{ b[0] }}</div><div class="bh">{{ b[4] }}</div>
            </div>
          </div>
          <div class="axis">
            <span v-for="h in DAY_AXIS" :key="h" :style="{ left: pos(h) + '%' }">{{ h }}:00</span>
          </div>
          <div class="daynote">最难、最要整块的放<b>上午（数学/408 限时真题）</b>；<b>下午 2–5 点固定练英语</b>；<b>晚上政治选择题 + 当日错题回炉</b>，订正不过夜；<b>睡前 + 晨起</b>做默写/单词/时政。留白不排新内容，防崩盘。</div>
        </div>
      </section>

      <!-- 08 TIMELINE -->
      <section class="rv">
        <div class="kick"><span class="no">08</span><h2>最后阶段关键节点</h2><span class="en">// milestones</span><span class="sub">节点顺序铺轴 · 红线触发即调整不硬扛</span><span class="rule"></span></div>
        <div class="hud tl">
          <div class="axisline"></div>
          <div v-for="(n, i) in TL" :key="i" class="node" :class="n[4]" :style="{ left: 'calc(26px + ' + (((i + 0.5) / TL.length) * 100).toFixed(2) + '%)' }">
            <div class="dot"></div>
            <div class="d">{{ String(n[0]).padStart(2, '0') }}-{{ String(n[1]).padStart(2, '0') }}</div>
            <div class="e">{{ n[2] }}</div>
            <div class="s">{{ n[3] }}</div>
          </div>
        </div>
      </section>

      <!-- 09 MINDSET -->
      <section class="rv">
        <div class="kick"><span class="no">09</span><h2>又累又慢 · 科学应对</h2><span class="en">// mindset</span><span class="sub">盯有效产出，不盯时长</span><span class="rule"></span></div>
        <div class="mind">
          <div class="hud panel">
            <h3>为什么"感觉慢"是正常的</h3>
            <div class="rules">
              <div class="rule2"><div class="ic">🎯</div><b>参照系错了</b><p>多数人 10 月 408 大题和政治都未成型。用"今日 3 件硬任务完成度"评估，别和想象中的别人比进度。</p></div>
              <div class="rule2"><div class="ic">⏱️</div><b>时长 ≠ 产出</b><p>别用"坐图书馆 10 小时"制造焦虑。摸鱼也开着钟的时长是水分，盯有效产出。</p></div>
              <div class="rule2"><div class="ic">🧠</div><b>背了就忘有解</b><p>提取练习（合书主动回忆）远胜重读；间隔重复 1/3/7/21 天；睡前背 + 晨复盘靠睡眠巩固。</p></div>
              <div class="rule2"><div class="ic">🛌</div><b>累是效率杀手</b><p>睡够 7 小时；每 90 分钟休 10 分钟；每周留半天完全空白 + 运动。单任务不混科。</p></div>
            </div>
          </div>
          <div class="hud panel">
            <h3>提分主引擎 · 三个动作</h3>
            <div class="rules">
              <div class="rule2"><div class="ic">🔁</div><b>错题回炉</b><p>设"耻辱日/钉子户"清单集中重做，错过的反复处刑到能流畅写出。</p></div>
              <div class="rule2"><div class="ic">✍️</div><b>盖住默写</b><p>公式表、作文句型、政治大题各做一份"主动回忆清单"——只看不背必翻车。</p></div>
              <div class="rule2"><div class="ic">🧩</div><b>以真题定强化</b><p>先做题暴露漏洞，再回头补对应专题，别闷头二刷讲义。</p></div>
              <div class="rule2"><div class="ic">📅</div><b>留白不排新</b><p>每做完一套全真，次日留白只复盘，不塞新内容，防崩盘。</p></div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div class="src-note">数据来源：进度真相统一读你的 todayStatus store（四科完成度/应达/综合战力单一来源，政治已修正为 100 单元工作量制 + 后置应达曲线）× 你的数学错题本 × 20+ 届上岸经验贴 × 全网冲刺战术交叉验证。所有"提分区间 / 分数账分段"为经验估计，用于排优先级，非承诺。控制台游戏化数据（战训勾选/XP/连胜/真题计数/高光时刻/战力曲线）存于你本机 localStorage。</div>
        <div>集成版 · 站点内嵌 · 数据实时</div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
:root { --unused: 0; }
.warroom {
  --bg: #070b12; --bg2: #0a1019; --panel: rgba(14, 21, 33, .72); --panel2: rgba(18, 26, 40, .85);
  --line: rgba(120, 150, 190, .14); --line2: rgba(120, 150, 190, .26);
  --ink: #e9eef5; --ink2: #9fb0c4; --ink3: #5f7189;
  --math: #3ddc84; --c408: #4aa8ff; --eng: #ff9f45; --pol: #ff5f6d; --gold: #ffcf5c;
  --grid: rgba(90, 120, 160, .06);
  --mono: "Cascadia Mono", "Consolas", "SFMono-Regular", ui-monospace, monospace;
  --disp: "Bahnschrift", "DIN Alternate", "Oswald", "Microsoft YaHei", sans-serif;
  --cjk: "Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", sans-serif;
  position: relative; z-index: 1; color: var(--ink); font-family: var(--cjk); line-height: 1.62;
  letter-spacing: .2px; margin: -20px; padding: 0;
  background:
    radial-gradient(1400px 700px at 15% -10%, rgba(74, 168, 255, .10), transparent 60%),
    radial-gradient(1200px 640px at 95% 0%, rgba(255, 95, 109, .07), transparent 55%),
    radial-gradient(1000px 900px at 50% 120%, rgba(61, 220, 132, .05), transparent 60%),
    linear-gradient(180deg, var(--bg), var(--bg2) 60%, var(--bg));
  min-height: 100vh;
}
.warroom::before { content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background-image: linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px);
  background-size: 46px 46px; -webkit-mask: radial-gradient(120% 90% at 50% 0%, #000 40%, transparent 100%); mask: radial-gradient(120% 90% at 50% 0%, #000 40%, transparent 100%); opacity: .6 }
.warroom::after { content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background: repeating-linear-gradient(180deg, rgba(255, 255, 255, .014) 0 1px, transparent 1px 3px); opacity: .5 }
.warroom * { box-sizing: border-box }
.wrap { position: relative; z-index: 1; max-width: 1420px; margin: 0 auto; padding: 26px 34px 90px }
.mono { font-family: var(--mono); font-variant-numeric: tabular-nums }

section { margin-top: 52px; position: relative }
.kick { display: flex; align-items: baseline; gap: 14px; margin-bottom: 20px; flex-wrap: wrap }
.kick .no { font-family: var(--disp); font-size: 15px; font-weight: 700; color: var(--gold); letter-spacing: 2px }
.kick .en { font-family: var(--mono); font-size: 11px; color: var(--ink3); letter-spacing: 3px; text-transform: uppercase; align-self: center }
.kick h2 { font-family: var(--disp); font-weight: 700; font-size: 26px; margin: 0; letter-spacing: 1px }
.kick .sub { color: var(--ink3); font-size: 13px; margin-left: auto; font-family: var(--mono) }
.kick .rule { flex-basis: 100%; height: 1px; background: linear-gradient(90deg, var(--line2), transparent); margin-top: 6px }

.hud { position: relative; background: var(--panel); border: 1px solid var(--line); border-radius: 4px; backdrop-filter: blur(2px) }
.hud::before, .hud::after { content: ""; position: absolute; width: 14px; height: 14px; pointer-events: none }
.hud::before { top: -1px; left: -1px; border-top: 2px solid var(--line2); border-left: 2px solid var(--line2) }
.hud::after { bottom: -1px; right: -1px; border-bottom: 2px solid var(--line2); border-right: 2px solid var(--line2) }

.statusbar { display: flex; align-items: center; gap: 18px; font-family: var(--mono); font-size: 11.5px; color: var(--ink3); letter-spacing: 1.5px; padding: 9px 14px; border: 1px solid var(--line); border-radius: 4px; background: rgba(8, 13, 21, .6); text-transform: uppercase; margin-top: 20px }
.statusbar .live { display: flex; align-items: center; gap: 7px; color: var(--math) }
.statusbar .live i { width: 7px; height: 7px; border-radius: 50%; background: var(--math); box-shadow: 0 0 8px var(--math); animation: blink 1.6s infinite }
@keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: .25 } }
.statusbar .sp { margin-left: auto; color: var(--ink2) }

.hero { margin-top: 18px; padding: 30px 34px; overflow: hidden }
.hero .meta { font-family: var(--mono); font-size: 12px; color: var(--ink3); letter-spacing: 1px; margin-bottom: 12px }
.hero-grid { display: grid; grid-template-columns: 1fr auto; gap: 30px; align-items: center }
.hero h1 { font-family: var(--disp); font-weight: 700; font-size: 46px; line-height: 1.02; margin: 0; letter-spacing: 1px }
.hero h1 .hl { color: var(--gold) }
.hero h1 .bar { display: inline-block; width: 100%; height: 2px; background: linear-gradient(90deg, var(--math), var(--c408) 40%, var(--eng) 70%, var(--pol)); margin: 14px 0 0 }
.hero .desc { color: var(--ink2); font-size: 14px; margin-top: 14px; max-width: 640px }
.readout { display: flex; gap: 14px }
.ro { text-align: center; padding: 14px 20px; border: 1px solid var(--line2); border-radius: 4px; background: rgba(0, 0, 0, .35); min-width: 104px; position: relative }
.ro .n { font-family: var(--disp); font-weight: 700; font-size: 52px; line-height: .9; color: var(--gold); text-shadow: 0 0 22px rgba(255, 207, 92, .35) }
.ro .l { font-family: var(--mono); font-size: 10.5px; color: var(--ink3); margin-top: 8px; letter-spacing: 1.5px }
.reframe { margin-top: 26px; display: grid; grid-template-columns: 1.35fr .65fr; gap: 20px }
.intel { border-left: 3px solid var(--gold); padding: 16px 20px; background: linear-gradient(90deg, rgba(255, 207, 92, .07), transparent) }
.intel .lab { font-family: var(--mono); font-size: 11px; color: var(--gold); letter-spacing: 2px; margin-bottom: 8px }
.intel .q { font-size: 18px; font-weight: 700; line-height: 1.55 }
.intel .q em { color: var(--gold); font-style: normal }
.intel .a { color: var(--ink2); font-size: 13.5px; margin-top: 9px }
.facts { display: flex; flex-direction: column; gap: 8px }
.fact { display: flex; align-items: center; gap: 11px; padding: 9px 12px; border: 1px solid var(--line); border-radius: 3px; background: rgba(0, 0, 0, .22) }
.fact .led { width: 8px; height: 8px; border-radius: 50%; flex: none }
.fact .fn { font-family: var(--disp); font-weight: 700; font-size: 14px; letter-spacing: .5px }
.fact .fd { font-size: 11.5px; color: var(--ink3); font-family: var(--mono) }

.console { display: grid; grid-template-columns: 1.5fr 1fr; gap: 18px }
.cp { padding: 20px 22px }
.stat-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 20px }
.stat { border: 1px solid var(--line); border-radius: 4px; padding: 14px 16px; background: rgba(0, 0, 0, .28); position: relative; overflow: hidden }
.stat .sl { font-family: var(--mono); font-size: 10px; letter-spacing: 1.5px; color: var(--ink3); text-transform: uppercase }
.stat .sv { font-family: var(--disp); font-weight: 700; font-size: 34px; line-height: 1.05; margin-top: 5px }
.stat .ss { font-family: var(--mono); font-size: 10.5px; color: var(--ink3); margin-top: 3px }
.stat.streak .sv { color: var(--eng) }
.stat.lvl .sv { color: var(--c408) }
.xpv { display: flex; align-items: baseline; gap: 6px }
.xpv .sm { font-family: var(--mono); font-size: 11px; color: var(--ink3) }
.lvbar { height: 7px; border-radius: 4px; background: rgba(255, 255, 255, .07); margin-top: 9px; overflow: hidden; border: 1px solid var(--line) }
.lvbar > i { display: block; height: 100%; background: linear-gradient(90deg, var(--c408), var(--math)); transition: width .6s cubic-bezier(.2, .7, .2, 1); box-shadow: 0 0 10px rgba(74, 168, 255, .5) }

.check-h { font-family: var(--disp); font-weight: 700; font-size: 15px; letter-spacing: .5px; display: flex; align-items: center; gap: 9px; margin-bottom: 12px }
.check-h .cnt { margin-left: auto; font-family: var(--mono); font-size: 11.5px; color: var(--ink3); font-weight: 400 }
.check-h .cnt b { color: var(--math); font-size: 15px; font-family: var(--disp) }
.checks { display: flex; flex-direction: column; gap: 2px }
.chk { display: flex; align-items: center; gap: 12px; padding: 10px 10px; border-radius: 3px; cursor: pointer; transition: background .18s, border-color .18s; border: 1px solid transparent; user-select: none }
.chk:hover { background: rgba(255, 255, 255, .035); border-color: var(--line) }
.chk .box { width: 20px; height: 20px; flex: none; border: 2px solid var(--line2); border-radius: 4px; display: grid; place-items: center; transition: all .18s; position: relative }
.chk .box svg { width: 13px; height: 13px; opacity: 0; transform: scale(.5); transition: all .18s }
.chk .dot { width: 8px; height: 8px; border-radius: 50%; flex: none }
.chk .cl { font-size: 13.5px; color: var(--ink2) }
.chk .cg { margin-left: auto; font-family: var(--mono); font-size: 11px; color: var(--ink3); flex: none }
.chk.done .box { background: var(--math); border-color: var(--math) }
.chk.done .box svg { opacity: 1; transform: scale(1) }
.chk.done .cl { color: var(--ink); text-decoration: line-through; text-decoration-color: rgba(159, 176, 196, .5) }

.cp-tools { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-top: 18px; padding-top: 16px; border-top: 1px dashed var(--line) }
.counter { display: flex; align-items: center; gap: 8px; padding: 7px 10px; border: 1px solid var(--line); border-radius: 4px; background: rgba(0, 0, 0, .25) }
.counter .cn { font-family: var(--mono); font-size: 11px; color: var(--ink3) }
.counter .cv { font-family: var(--disp); font-weight: 700; font-size: 17px; min-width: 38px; text-align: center }
.counter .cv span { color: var(--ink3); font-size: 12px }
.cbtn { width: 24px; height: 24px; border-radius: 4px; border: 1px solid var(--line2); background: rgba(255, 255, 255, .04); color: var(--ink); font-size: 16px; line-height: 1; cursor: pointer; display: grid; place-items: center; transition: all .15s; font-family: var(--mono) }
.cbtn:hover { background: var(--c408); color: #04101f; border-color: var(--c408) }
.cbtn:active { transform: scale(.9) }
.tbtn { margin-left: auto; font-family: var(--mono); font-size: 11px; letter-spacing: .5px; padding: 8px 13px; border: 1px solid var(--line2); border-radius: 4px; background: rgba(255, 255, 255, .04); color: var(--ink2); cursor: pointer; transition: all .15s; text-transform: uppercase }
.tbtn:hover { color: var(--ink); border-color: var(--gold); background: rgba(255, 207, 92, .1) }
.tbtn.danger:hover { border-color: var(--pol); background: rgba(255, 95, 109, .1); color: #ffb3ba }

.log-list { display: flex; flex-direction: column; gap: 8px; max-height: 270px; overflow-y: auto; margin-top: 14px; padding-right: 4px }
.log-list::-webkit-scrollbar { width: 6px } .log-list::-webkit-scrollbar-thumb { background: var(--line2); border-radius: 3px }
.logitem { display: flex; gap: 11px; align-items: flex-start; padding: 10px 12px; border: 1px solid var(--line); border-left: 3px solid var(--math); border-radius: 3px; background: rgba(0, 0, 0, .22) }
.logitem .ld { font-family: var(--mono); font-size: 10.5px; color: var(--ink3); flex: none; padding-top: 1px }
.logitem .lt { font-size: 13px; color: var(--ink) }
.log-add { display: flex; gap: 8px; margin-top: 4px }
.log-add input { flex: 1; background: rgba(0, 0, 0, .3); border: 1px solid var(--line2); border-radius: 4px; color: var(--ink); font-family: var(--cjk); font-size: 13px; padding: 9px 12px }
.log-add input:focus { outline: none; border-color: var(--gold) }
.log-add button { width: 40px; border: 1px solid var(--line2); border-radius: 4px; background: rgba(61, 220, 132, .12); color: var(--math); font-size: 19px; cursor: pointer; transition: all .15s }
.log-add button:hover { background: var(--math); color: #04101f }
.log-empty { font-size: 12.5px; color: var(--ink3); font-style: italic; padding: 14px 4px; text-align: center; border: 1px dashed var(--line); border-radius: 4px }

.quote { margin-top: 16px; padding: 18px 24px; display: flex; align-items: baseline; gap: 16px; flex-wrap: wrap; border-left: 3px solid var(--gold) }
.quote .qi { font-size: 12px; letter-spacing: 2px; color: var(--gold); flex: none; font-family: var(--mono) }
.quote .qt { font-size: 17px; font-weight: 700; line-height: 1.5; transition: opacity .5s }
.quote .qt.fade { opacity: 0 }
.quote .qa { font-size: 13px; color: var(--gold); opacity: .82; letter-spacing: 1px; transition: opacity .5s }
.quote .qa.fade { opacity: 0 }

.gauges { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px }
.gauge { padding: 22px 18px 18px; text-align: center }
.gauge .gname { font-family: var(--disp); font-weight: 700; font-size: 18px; letter-spacing: 1px }
.gauge .verdict { font-family: var(--mono); font-size: 10.5px; letter-spacing: 1px; padding: 3px 9px; border-radius: 20px; display: inline-block; margin-top: 4px }
.ring { position: relative; width: 170px; height: 170px; margin: 14px auto 6px }
.ring svg { transform: rotate(-90deg) }
.ring .arc { transition: stroke-dashoffset 1.2s cubic-bezier(.2, .7, .2, 1) }
.ring .ctr { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center }
.ring .ctr .p { font-family: var(--disp); font-weight: 700; font-size: 38px; line-height: 1 }
.ring .ctr .pl { font-family: var(--mono); font-size: 11px; color: var(--ink3) }
.gauge .delta { font-family: var(--mono); font-size: 13px; font-weight: 700; margin-top: 2px }
.gauge .note { font-size: 12px; color: var(--ink2); margin-top: 12px; border-top: 1px dashed var(--line); padding-top: 10px; min-height: 56px; text-align: left }
.gauge .tgt { font-family: var(--mono); font-size: 11px; color: var(--ink3); margin-top: 6px }
.gauge .tgt b { font-family: var(--disp); font-size: 16px; color: var(--ink) }
.up { color: var(--math) } .down { color: var(--pol) }

.gaps { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px }
.gap { padding: 18px 20px }
.gap .gh { display: flex; align-items: baseline; gap: 10px; margin-bottom: 3px }
.gap .gh .name { font-family: var(--disp); font-weight: 700; font-size: 17px; letter-spacing: .5px }
.gap .gh .goal { margin-left: auto; font-family: var(--mono); font-size: 12px; color: var(--ink3) }
.gap .gh .goal b { color: var(--gold); font-family: var(--disp); font-size: 15px }
.gap .gsub { font-size: 11.5px; color: var(--ink3); margin-bottom: 14px; font-family: var(--mono) }
.track { position: relative; height: 30px; border-radius: 3px; background: rgba(255, 255, 255, .04); display: flex; overflow: hidden; border: 1px solid var(--line) }
.track .seg { height: 100%; display: flex; align-items: center; justify-content: center; font-family: var(--mono); font-size: 10.5px; color: #06121f; font-weight: 700; white-space: nowrap; position: relative; overflow: hidden; transition: filter .2s }
.track .seg.base { background: rgba(150, 170, 195, .28); color: var(--ink2) }
.track .tick { position: absolute; top: -6px; bottom: -6px; width: 2px; background: var(--gold); z-index: 3 }
.track .tick::after { content: "目标"; position: absolute; top: -16px; left: 50%; transform: translateX(-50%); font-family: var(--mono); font-size: 9px; color: var(--gold); white-space: nowrap }
.legend2 { display: flex; flex-wrap: wrap; gap: 6px 16px; margin-top: 12px }
.legend2 .li { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--ink2) }
.legend2 .sw { width: 11px; height: 11px; border-radius: 2px; flex: none }
.legend2 .li b { color: var(--ink); font-family: var(--mono); font-size: 11.5px }

.matrix-wrap { display: grid; grid-template-columns: 1fr 340px; gap: 22px; align-items: stretch }
.matrix { position: relative; padding: 14px }
.matrix svg { display: block; width: 100%; height: auto }
.halo { animation: halo 2.2s ease-in-out infinite }
@keyframes halo { 0%, 100% { opacity: .16 } 50% { opacity: .34 } }
.mreadout { position: absolute; top: 12px; right: 16px; font-family: var(--mono); font-size: 10px; color: var(--ink3); letter-spacing: 1px }
.legend { padding: 18px 20px }
.legend h4 { font-family: var(--disp); margin: 0 0 4px; font-size: 15px; letter-spacing: .5px }
.legend .hint { font-family: var(--mono); font-size: 10.5px; color: var(--ink3); margin-bottom: 14px }
.legend .li { display: flex; gap: 11px; align-items: flex-start; margin-bottom: 13px; font-size: 12.5px; color: var(--ink2); line-height: 1.5 }
.legend .li:last-child { margin-bottom: 0 }
.legend .li b { color: var(--ink) }
.legend .qbadge { width: 26px; height: 26px; flex: none; border-radius: 4px; display: grid; place-items: center; font-family: var(--disp); font-weight: 700; font-size: 14px }

.route { margin-bottom: 16px; overflow: hidden }
.rt-head { display: flex; align-items: center; gap: 14px; padding: 14px 22px; border-bottom: 1px solid var(--line); position: relative }
.rt-head::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 4px }
.route.math .rt-head::before { background: var(--math) } .route.c408 .rt-head::before { background: var(--c408) }
.route.eng .rt-head::before { background: var(--eng) } .route.pol .rt-head::before { background: var(--pol) }
.rt-head .tag { font-family: var(--mono); font-size: 11px; font-weight: 700; padding: 4px 11px; border-radius: 20px; letter-spacing: .5px }
.rt-head h3 { font-family: var(--disp); font-weight: 700; font-size: 21px; margin: 0; letter-spacing: 1px }
.rt-head .flow { margin-left: auto; font-family: var(--mono); font-size: 11.5px; color: var(--ink3) }
.rt-body { display: grid; grid-template-columns: 1.4fr 1fr }
.acts { padding: 8px 22px 16px }
.side { padding: 16px 22px; border-left: 1px solid var(--line); background: rgba(0, 0, 0, .18) }
.act { display: grid; grid-template-columns: 34px 1fr auto; gap: 12px; align-items: start; padding: 12px 0; border-bottom: 1px dashed rgba(255, 255, 255, .06) }
.act:last-child { border-bottom: 0 }
.act .rk { width: 30px; height: 30px; border-radius: 4px; display: grid; place-items: center; font-family: var(--disp); font-weight: 700; font-size: 15px }
.route.math .rk { background: rgba(61, 220, 132, .14); color: var(--math) } .route.c408 .rk { background: rgba(74, 168, 255, .14); color: var(--c408) }
.route.eng .rk { background: rgba(255, 159, 69, .14); color: var(--eng) } .route.pol .rk { background: rgba(255, 95, 109, .14); color: var(--pol) }
.act .body b { font-size: 14.5px; font-weight: 700 }
.act .body p { margin: 3px 0 0; font-size: 12.7px; color: var(--ink2) }
.act .body .src { font-size: 10.5px; color: var(--ink3); font-family: var(--mono); margin-top: 3px; display: block }
.act .gain { font-family: var(--disp); font-weight: 700; font-size: 15px; white-space: nowrap; align-self: center }
.route.math .gain { color: var(--math) } .route.c408 .gain { color: var(--c408) } .route.eng .gain { color: var(--eng) } .route.pol .gain { color: var(--pol) }
.side .blk { margin-bottom: 15px }
.side .blk:last-child { margin-bottom: 0 }
.side .blk .h { font-family: var(--mono); font-size: 10px; letter-spacing: 1.5px; color: var(--ink3); text-transform: uppercase; margin-bottom: 6px }
.side .blk .c { font-size: 12.8px; color: var(--ink2) }
.side .blk .c b { color: var(--ink) }
.pill { display: inline-block; font-size: 11.5px; padding: 3px 9px; border-radius: 3px; margin: 0 5px 5px 0; background: rgba(255, 255, 255, .05); border: 1px solid var(--line); color: var(--ink2) }
.pill.no { background: rgba(255, 95, 109, .08); border-color: rgba(255, 95, 109, .28); color: var(--pol); text-decoration: line-through }
.redline { background: rgba(255, 95, 109, .07); border: 1px solid rgba(255, 95, 109, .26); border-radius: 3px; padding: 10px 12px; font-size: 12.3px; color: var(--pol) }
.redline b { color: #ffb3ba }

.trend { padding: 18px 20px }
.trend svg { display: block; width: 100%; height: auto }
.trend-lg { display: flex; flex-wrap: wrap; gap: 8px 20px; margin-top: 12px; font-family: var(--mono); font-size: 11px; color: var(--ink3) }
.trend-lg .li { display: flex; align-items: center; gap: 7px }
.trend-lg .sw { width: 16px; height: 3px; border-radius: 2px; flex: none }
.trend-lg .sw.dash { background: repeating-linear-gradient(90deg, var(--gold) 0 4px, transparent 4px 8px) }

.day { padding: 24px 26px }
.day .dhead { display: flex; align-items: baseline; gap: 12px; margin-bottom: 22px }
.day .dhead .t { font-family: var(--disp); font-weight: 700; font-size: 17px }
.day .dhead .s { font-family: var(--mono); font-size: 11.5px; color: var(--ink3); margin-left: auto }
.daybar { position: relative; height: 64px; border-radius: 4px; background: rgba(255, 255, 255, .03); border: 1px solid var(--line); overflow: hidden }
.dblk { position: absolute; top: 0; bottom: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; padding: 0 4px; border-right: 1px solid rgba(0, 0, 0, .4); text-align: center; overflow: hidden }
.dblk .bt { font-family: var(--mono); font-size: 10px; font-weight: 700; color: #06121f; white-space: nowrap }
.dblk .bh { font-family: var(--mono); font-size: 9px; color: rgba(6, 18, 31, .7); white-space: nowrap }
.axis { position: relative; height: 22px; margin-top: 6px; font-family: var(--mono); font-size: 10px; color: var(--ink3) }
.axis span { position: absolute; transform: translateX(-50%) }
.axis::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 1px; background: var(--line) }
.daynote { margin-top: 16px; font-size: 12.5px; color: var(--ink2) }
.daynote b { color: var(--gold) }

.tl { position: relative; padding: 40px 26px 34px }
.tl .axisline { position: absolute; left: 26px; right: 26px; top: 51px; height: 2px; background: linear-gradient(90deg, var(--math), var(--c408) 45%, var(--eng) 72%, var(--pol)) }
.tl .node { position: absolute; top: 44px; transform: translateX(-50%); width: 150px; text-align: center }
.tl .node .dot { width: 15px; height: 15px; border-radius: 50%; background: var(--bg); border: 3px solid var(--ink2); margin: 0 auto 12px; position: relative; z-index: 2 }
.tl .node.red .dot { border-color: var(--pol); box-shadow: 0 0 0 5px rgba(255, 95, 109, .16) }
.tl .node.gold .dot { border-color: var(--gold); box-shadow: 0 0 0 5px rgba(255, 207, 92, .16) }
.tl .node .d { font-family: var(--disp); font-size: 14px; font-weight: 700; color: var(--gold) }
.tl .node .e { font-size: 12.5px; color: var(--ink); font-weight: 700; margin-top: 2px }
.tl .node .s { font-size: 10.5px; color: var(--ink3); margin-top: 3px; line-height: 1.4 }

.mind { display: grid; grid-template-columns: 1fr 1fr; gap: 18px }
.mind .panel { padding: 20px 24px }
.mind h3 { font-family: var(--disp); font-size: 17px; margin: 0 0 14px; letter-spacing: .5px }
.rules { display: grid; grid-template-columns: 1fr 1fr; gap: 12px }
.rule2 { background: rgba(0, 0, 0, .22); border: 1px solid var(--line); border-radius: 3px; padding: 13px 15px }
.rule2 .ic { font-size: 19px }
.rule2 b { font-size: 13.5px; display: block; margin: 5px 0 3px; font-family: var(--disp); letter-spacing: .3px }
.rule2 p { margin: 0; font-size: 11.8px; color: var(--ink3); line-height: 1.5 }

footer { margin-top: 50px; padding-top: 18px; border-top: 1px solid var(--line); color: var(--ink3); font-size: 11.5px; font-family: var(--mono); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; letter-spacing: .3px }
.src-note { max-width: 960px; line-height: 1.6 }

@keyframes rise { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: none } }
.rv { opacity: 1; animation: rise .7s cubic-bezier(.2, .7, .2, 1) both }
.rv:nth-of-type(1) { animation-delay: .02s }
.rv:nth-of-type(2) { animation-delay: .10s }
.rv:nth-of-type(3) { animation-delay: .18s }
.rv:nth-of-type(4) { animation-delay: .26s }
.rv:nth-of-type(5) { animation-delay: .34s }
.rv:nth-of-type(6) { animation-delay: .42s }
.rv:nth-of-type(7) { animation-delay: .50s }
.rv:nth-of-type(n+8) { animation-delay: .58s }

.confetti { position: fixed; inset: 0; pointer-events: none; z-index: 200 }
.toast-wrap { position: fixed; top: 18px; right: 18px; z-index: 210; display: flex; flex-direction: column; gap: 10px; pointer-events: none }
.toast { font-family: var(--cjk); font-size: 14px; font-weight: 700; color: #06121f; padding: 12px 18px; border-radius: 6px; box-shadow: 0 8px 30px rgba(0, 0, 0, .5), 0 0 20px rgba(61, 220, 132, .4); display: flex; align-items: center; gap: 10px; transform: translateX(120%); opacity: 0; animation: toastin .4s cubic-bezier(.2, .9, .2, 1) forwards; max-width: 340px }
.toast .ti { font-family: var(--disp); font-size: 20px; line-height: 1 }
.toast.out { animation: toastout .4s ease forwards }
@keyframes toastin { to { transform: translateX(0); opacity: 1 } }
@keyframes toastout { to { transform: translateX(120%); opacity: 0 } }

@media (max-width: 1080px) {
  .gauges, .gaps, .mind, .console { grid-template-columns: 1fr 1fr }
  .reframe, .route .rt-body, .matrix-wrap, .hero-grid { grid-template-columns: 1fr }
  .hero h1 { font-size: 36px }
  .stat-strip { grid-template-columns: 1fr }
}
@media (max-width: 640px) {
  .wrap { padding: 16px 14px 70px }
  .gauges, .gaps, .mind, .console { grid-template-columns: 1fr }
  .stat-strip { grid-template-columns: 1fr 1fr }
  .hero h1 { font-size: 28px }
  .hero { padding: 22px 18px }
  .hero .meta { overflow-wrap: anywhere }
  .statusbar { flex-wrap: wrap; gap: 8px; font-size: 10.5px }
  .statusbar .sp { margin-left: 0; width: 100% }
}
@media (max-width: 768px) { .warroom { margin: -10px } }
@media (max-width: 480px) { .warroom { margin: -8px } }
</style>
