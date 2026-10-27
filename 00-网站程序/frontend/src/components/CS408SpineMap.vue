<script setup lang="ts">
// 408 主线地图（ECharts 树状连线图版）
// 以 chapterCode 为主键，把「科目 → 章节 → 高频考点」画成一棵能顺线走的树；
// 节点颜色=掌握度（红=有题没刷/黑洞，橙=有错题，蓝=刷过部分，绿=全对，灰=纯考点无大题），
// 节点大小=考频分值。点章节下钻展开考点并弹出该章「错题 + 解题模板」。手机支持缩放/拖动。
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts/core'
import { TreeChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { MODULE_MAP, examFreqPoints, FREQ_LEVELS, type ExamFreqPoint } from '@/data/examFrequency'
import { CS408_TOPIC_GUIDES } from '@/data/cs408TopicGuides'

echarts.use([TreeChart, TooltipComponent, CanvasRenderer])

interface BigQ {
  slug: string; subject: string; year: number; index: number
  chapterCode: string; chapterName: string; score: number; tags: string[]
}
interface Rec { result: 'correct' | 'partial' | 'wrong'; date: string; attempts: number }

const router = useRouter()
const LS_KEY = 'exam408-big-v2'

const loading = ref(true)
const items = ref<BigQ[]>([])
const diskRecords = ref<Record<string, Rec>>({})
const localRecords = ref<Record<string, Rec>>({})
const records = computed<Record<string, Rec>>(() => ({ ...diskRecords.value, ...localRecords.value }))

const activeSub = ref<string>('all')
const selectedCode = ref<string>('')

const SUBJECT_COLORS: Record<string, string> = { ds: '#409EFF', co: '#67C23A', os: '#E6A23C', cn: '#F56C6C' }
const SUBJECT_NAMES: Record<string, string> = { ds: '数据结构', co: '计算机组成原理', os: '操作系统', cn: '计算机网络' }
const SUB_ORDER = ['co', 'os', 'ds', 'cn']

function loadLocal() {
  try { const raw = localStorage.getItem(LS_KEY); if (raw) localRecords.value = JSON.parse(raw) || {} }
  catch { localRecords.value = {} }
}

interface ChapterAgg {
  code: string; sub: string; subKey: string; chapter: number; chapterTitle: string
  points: ExamFreqPoint[]; highScore: number; highCount: number
  bigqTotal: number; bigqDone: number; bigqCorrect: number; bigqPartial: number; bigqWrong: number
  wrongList: BigQ[]; coverage: number
  templates: { title: string; tag: string; tip?: string }[]
}

function matchTemplates(subKey: string, chapterTitle: string, points: ExamFreqPoint[]) {
  const guide = CS408_TOPIC_GUIDES.find(g => g.subject === subKey)
  if (!guide) return []
  const hay = (chapterTitle + ' ' + points.map(p => p.name).join(' ')).toLowerCase()
  const kwTable: Record<string, string[]> = {
    '存储系统': ['cache', '虚拟', '主存', '存储', '页表', '磁盘'],
    'cpu与数据通路': ['cpu', '流水线', '数据通路', '控制器', '中断', '异常'],
    '数据表示': ['定点', '浮点', 'ieee754', '补码', '编码', '移位', '校验'],
    '指令系统': ['指令', '寻址', 'cisc', 'risc'],
    'i/o系统': ['dma', 'i/o', 'io', '中断', '总线'],
    '线性表': ['链表', '顺序表', '线性表', '数组'],
    '图的算法': ['图', '拓扑', '最短路', '生成树', '关键路径'],
    '树与二叉树': ['树', '二叉', '哈夫曼', '遍历', 'bst'],
    '排序与查找': ['排序', '查找', '散列', '哈希', '折半', 'b树'],
    '数据结构设计题': ['设计'],
  }
  const out: { title: string; tag: string; tip?: string }[] = []
  for (const it of guide.items) {
    const key = Object.keys(kwTable).find(k => k.toLowerCase() === it.title.toLowerCase().replace(/（.*）/, '').trim())
    const kws = key ? kwTable[key] : []
    const localKws = kws.length ? kws : it.title.split(/[（(·\s]/).filter(Boolean)
    if (localKws.some(w => hay.includes(w.toLowerCase()))) out.push({ title: it.title, tag: it.tag, tip: it.tip })
  }
  return out
}

const chapters = computed<ChapterAgg[]>(() => {
  const r = records.value
  const list: ChapterAgg[] = []
  for (const code in MODULE_MAP) {
    const info = MODULE_MAP[code]
    const pts = examFreqPoints.filter(p => p.code === code)
      .sort((a, b) => {
        const rank: Record<string, number> = { high: 0, mid: 1, low: 2, cold: 3 }
        return rank[a.lv] - rank[b.lv] || b.score - a.score
      })
    if (!pts.length) continue
    const chItems = items.value.filter(i => i.chapterCode === code)
    let done = 0, correct = 0, partial = 0, wrong = 0
    const wrongList: BigQ[] = []
    for (const it of chItems) {
      const rr = r[it.slug]
      if (rr) { done++; if (rr.result === 'correct') correct++; else if (rr.result === 'wrong') { wrong++; wrongList.push(it) } else partial++ }
    }
    list.push({
      code, sub: info.sub, subKey: info.subKey, chapter: info.chapter, chapterTitle: info.chapterTitle,
      points: pts, highScore: pts.reduce((s, p) => s + p.score, 0), highCount: pts.filter(p => p.lv === 'high').length,
      bigqTotal: chItems.length, bigqDone: done, bigqCorrect: correct, bigqPartial: partial, bigqWrong: wrong,
      wrongList, coverage: chItems.length ? Math.round((done / chItems.length) * 100) : 0,
      templates: matchTemplates(info.subKey, info.chapterTitle, pts),
    })
  }
  return list
})

const bySubject = computed(() => {
  const out: Record<string, ChapterAgg[]> = { co: [], os: [], ds: [], cn: [] }
  for (const c of chapters.value) (out[c.subKey] ||= []).push(c)
  for (const k in out) {
    out[k].sort((a, b) => {
      const gapA = a.bigqTotal - a.bigqDone, gapB = b.bigqTotal - b.bigqDone
      return (gapB > 0 ? 1 : 0) - (gapA > 0 ? 1 : 0) || gapB - gapA || b.highScore - a.highScore
    })
  }
  return out
})

const overview = computed(() => {
  const total = items.value.length
  let done = 0, correct = 0, wrong = 0, partial = 0
  const r = records.value
  for (const it of items.value) { const rr = r[it.slug]; if (rr) { done++; if (rr.result === 'correct') correct++; else if (rr.result === 'wrong') wrong++; else partial++ } }
  const blackholes = chapters.value.filter(c => c.bigqTotal > 0 && c.bigqDone === 0)
  return { total, done, correct, wrong, partial, pct: total ? Math.round((done / total) * 100) : 0, blackholes }
})

const selectedChapter = computed(() => chapters.value.find(c => c.code === selectedCode.value) || null)

function chapterColor(c: ChapterAgg): string {
  if (c.bigqTotal > 0 && c.bigqDone === 0) return '#f56c6c'
  if (c.bigqWrong > 0) return '#e6a23c'
  if (c.bigqTotal > 0 && c.bigqDone === c.bigqTotal && c.bigqCorrect === c.bigqTotal) return '#67c23a'
  if (c.bigqDone > 0) return '#409EFF'
  return '#909399'
}
function levelColor(lv: string) { return FREQ_LEVELS[lv as keyof typeof FREQ_LEVELS]?.color || '#909399' }
function levelLabel(lv: string) { return FREQ_LEVELS[lv as keyof typeof FREQ_LEVELS]?.label || lv }

// ---- 构建 ECharts 树数据 ----
const SHORT_SUB: Record<string, string> = { co: '计组', os: '操作系统', ds: '数据结构', cn: '计网' }
function buildTree() {
  const mob = typeof window !== 'undefined' && window.innerWidth < 640
  const subs = activeSub.value === 'all' ? SUB_ORDER : [activeSub.value]
  const subjectNodes = subs.map(sk => {
    const chs = bySubject.value[sk] || []
    return {
      name: mob ? SHORT_SUB[sk] : SUBJECT_NAMES[sk],
      itemStyle: { color: SUBJECT_COLORS[sk], borderColor: '#fff', borderWidth: 1 },
      lineStyle: { color: SUBJECT_COLORS[sk], width: 2 },
      label: { fontWeight: 'bold' as const, fontSize: 14, color: SUBJECT_COLORS[sk] },
      tip: `${SUBJECT_NAMES[sk]}<br/>${chs.length} 个考点章节 · 大题 ${chs.reduce((s, c) => s + c.bigqTotal, 0)} 道`,
      children: chs.map(c => ({
        name: c.chapterTitle,
        chapterCode: c.code,
        symbolSize: 16 + Math.min(26, Math.round(c.highScore / 12)),
        itemStyle: { color: chapterColor(c), borderColor: '#fff', borderWidth: 1.5 },
        lineStyle: { color: chapterColor(c), width: 1.6 },
        label: { fontSize: 12.5, color: '#1f2d3d' },
        tip: `<b>${SUBJECT_NAMES[c.subKey]} · 第${c.chapter}章 ${c.chapterTitle}</b><br/>`
          + `考频 ${c.highScore} 分 · 高频考点 ${c.highCount} 个<br/>`
          + `大题：已刷 ${c.bigqDone}/${c.bigqTotal}（对${c.bigqCorrect} 半${c.bigqPartial} 错${c.bigqWrong}）<br/>`
          + `<span style="color:#8a94a6">点击展开考点 / 查看错题模板</span>`,
        children: c.points.slice(0, 12).map(p => ({
          name: p.name,
          chapterCode: c.code,
          symbolSize: 8 + Math.min(14, Math.round(p.score / 8)),
          itemStyle: { color: levelColor(p.lv) },
          lineStyle: { color: levelColor(p.lv), width: 1, opacity: 0.55 },
          label: { fontSize: 11.5, color: '#5b6b7f' },
          tip: `<b>${p.name}</b><br/>${levelLabel(p.lv)} · ${p.score} 分 · ${p.q} 题 · 近 ${p.yrs} 年`,
        })),
      })),
    }
  })
  if (activeSub.value !== 'all') return subjectNodes[0] || { name: '408', children: [] }
  return { name: '408', itemStyle: { color: '#16345c' }, label: { fontWeight: 'bold' as const, fontSize: 15, color: '#16345c' }, children: subjectNodes }
}

// ---- 图表实例 ----
const chartEl = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
let ro: ResizeObserver | null = null

function renderChart() {
  if (!chart || loading.value) return
  const isMobile = window.innerWidth < 640
  chart.setOption({
    tooltip: {
      trigger: 'item', confine: true, backgroundColor: 'rgba(13,33,55,.94)', borderWidth: 0,
      textStyle: { color: '#fff', fontSize: 12 }, extraCssText: 'border-radius:8px;max-width:260px;line-height:1.6;',
      formatter: (p: any) => p.data?.tip || p.name,
    },
    series: [{
      type: 'tree', data: [buildTree()],
      orient: 'LR', edgeShape: 'polyline', edgeForkPosition: '38%',
      initialTreeDepth: isMobile ? 1 : 2,
      top: '4%', left: isMobile ? '10%' : '12%', bottom: '4%', right: isMobile ? '34%' : '22%',
      symbol: 'circle', roam: true, expandAndCollapse: true, animationDuration: 550, animationDurationUpdate: 550,
      lineStyle: { color: '#c7d2e0', width: 1.4, curveness: 0 },
      label: { position: 'left', verticalAlign: 'middle', align: 'right', fontSize: 12 },
      leaves: { label: { position: 'right', verticalAlign: 'middle', align: 'left' } },
      emphasis: { focus: 'descendant', itemStyle: { shadowBlur: 10, shadowColor: 'rgba(22,52,92,.3)' } },
    }],
  }, true)
}

function onClick(p: any) {
  const code = p?.data?.chapterCode
  if (code) selectedCode.value = code
}

onMounted(async () => {
  await load()
  await nextTick()
  if (chartEl.value) {
    chart = echarts.init(chartEl.value)
    chart.on('click', onClick)
    renderChart()
    ro = new ResizeObserver(() => chart && chart.resize())
    ro.observe(chartEl.value)
  }
})
onBeforeUnmount(() => { ro?.disconnect(); chart?.dispose(); chart = null })

watch([() => items.value.length, () => records.value, activeSub], () => nextTick(renderChart), { deep: false })

async function load() {
  loading.value = true
  const base = import.meta.env.BASE_URL || '/'
  try {
    const [rq, pq] = await Promise.all([
      fetch(`${base}data/408-exam/questions.json?t=${Date.now()}`).then(r => (r.ok ? r.json() : null)).catch(() => null),
      fetch(`${base}data/408-exam/progress.json?t=${Date.now()}`).then(r => (r.ok ? r.json() : null)).catch(() => null),
    ])
    if (rq?.items) items.value = rq.items
    if (pq?.records) diskRecords.value = pq.records
  } catch (e) { console.error('load spine data failed', e) }
  finally { loading.value = false }
  loadLocal()
}

function pickSub(k: string) { activeSub.value = k; nextTick(renderChart) }
function goExam(subject?: string) { router.push({ path: '/cs408', query: subject ? { tab: 'exam', subj: subject } : { tab: 'exam' } }) }
function focusChapter(code: string) { selectedCode.value = code }
</script>

<template>
  <div class="spine">
    <div class="spine-head">
      <div class="sh-title">
        <h2>🧭 408 主线地图 · 顺线走一遍就串起来了</h2>
        <p class="sh-sub">科目 → 章节 → 高频考点 连成一棵树。<b>颜色=掌握度，大小=考频分值</b>。手机上双指缩放/拖动，点章节展开考点并看错题模板。</p>
      </div>
      <div class="sh-prog">
        <div class="ov-num"><b>{{ overview.done }}</b>/{{ overview.total }} 大题已刷</div>
        <div class="ov-bar"><span :style="{ width: overview.pct + '%' }"></span></div>
        <div class="ov-lab">
          <span><i class="dot ok"></i>对 {{ overview.correct }}</span>
          <span><i class="dot half"></i>半 {{ overview.partial }}</span>
          <span><i class="dot bad"></i>错 {{ overview.wrong }}</span>
        </div>
      </div>
    </div>

    <!-- 黑洞告警 -->
    <div v-if="overview.blackholes.length" class="alert">
      <span class="al-ic">⚠️</span>
      <div class="al-txt">
        <b>有题却一题没刷（最大提分空间）：</b>
        <span v-for="b in overview.blackholes" :key="b.code" class="al-chip" @click="pickSub(b.subKey); focusChapter(b.code)">
          {{ SUBJECT_NAMES[b.subKey] }}·{{ b.chapterTitle }}（{{ b.bigqTotal }}题空白）
        </span>
      </div>
    </div>

    <!-- 科目筛选 -->
    <div class="sub-filter">
      <button class="sf" :class="{ on: activeSub === 'all' }" @click="pickSub('all')">全部</button>
      <button v-for="k in SUB_ORDER" :key="k" class="sf" :class="{ on: activeSub === k }"
              :style="activeSub === k ? { background: SUBJECT_COLORS[k], borderColor: SUBJECT_COLORS[k] } : {}"
              @click="pickSub(k)">{{ SUBJECT_NAMES[k] }}</button>
    </div>

    <!-- 图例 -->
    <div class="legend">
      <span><i style="background:#f56c6c"></i>有题没刷</span>
      <span><i style="background:#e6a23c"></i>有错题</span>
      <span><i style="background:#409eff"></i>刷过部分</span>
      <span><i style="background:#67c23a"></i>全对</span>
      <span><i style="background:#909399"></i>纯考点无大题</span>
      <span class="lg-note">⬤ 越大 = 考频分值越高</span>
    </div>

    <div v-if="loading" class="spine-loading">加载主线…</div>
    <div v-show="!loading" class="chart-wrap">
      <div ref="chartEl" class="chart"></div>
    </div>

    <!-- 点章节后的详情面板 -->
    <div v-if="selectedChapter" class="detail">
      <div class="dt-hd" :style="{ borderLeftColor: chapterColor(selectedChapter) }">
        <div class="dt-title">
          <span class="dt-sub" :style="{ color: SUBJECT_COLORS[selectedChapter.subKey] }">{{ SUBJECT_NAMES[selectedChapter.subKey] }}</span>
          第{{ selectedChapter.chapter }}章 · {{ selectedChapter.chapterTitle }}
        </div>
        <div class="dt-meta">考频 {{ selectedChapter.highScore }}分 · 大题 {{ selectedChapter.bigqDone }}/{{ selectedChapter.bigqTotal }}
          <em v-if="selectedChapter.bigqWrong" class="dt-wrong">错 {{ selectedChapter.bigqWrong }}</em></div>
        <button class="dt-go" @click="goExam(selectedChapter.subKey)">去刷这章真题 →</button>
        <span class="dt-close" @click="selectedCode = ''">✕</span>
      </div>
      <div class="dt-body">
        <div class="dt-col">
          <div class="cb-h">📌 高频考点</div>
          <ul class="pt-list">
            <li v-for="p in selectedChapter.points" :key="p.name" class="pt-li">
              <i class="pc-dot" :style="{ background: levelColor(p.lv) }"></i>
              <span class="pt-n">{{ p.name }}</span>
              <span class="pt-m">{{ levelLabel(p.lv) }}·{{ p.score }}分·{{ p.yrs }}年</span>
            </li>
          </ul>
          <div v-if="selectedChapter.wrongList.length" class="cb-h" style="margin-top:12px">🔴 我的错题</div>
          <div v-if="selectedChapter.wrongList.length" class="wrong-wrap">
            <span v-for="w in selectedChapter.wrongList" :key="w.slug" class="wrong-it" @click="goExam(selectedChapter.subKey)">{{ w.year }} 第{{ w.index }}题</span>
          </div>
        </div>
        <div class="dt-col">
          <div class="cb-h">🧩 解题模板 / 套路</div>
          <div v-if="selectedChapter.templates.length" class="tpl-wrap">
            <div v-for="t in selectedChapter.templates" :key="t.title" class="tpl">
              <div class="tpl-t">{{ t.title }} <em>{{ t.tag }}</em></div>
              <div v-if="t.tip" class="tpl-tip">💡 {{ t.tip }}</div>
            </div>
          </div>
          <div v-else class="tpl-none">该科目暂无模板卡，见「🧭 专题指南」。</div>
        </div>
      </div>
    </div>

    <div class="spine-foot">用法：先看<b>红色节点</b>（有题没刷=最大提分）→ 点它展开考点、记下"会不会、套哪张模板"→ 去刷真题 → 错题自动回填变橙。</div>
  </div>
</template>

<style scoped>
.spine { --ink: #1f2d3d; --muted: #5b6b7f; --line: #e4ebf3; --navy: #16345c; color: var(--ink); }
.spine-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; margin-bottom: 12px; }
.sh-title h2 { margin: 0 0 4px; font-size: 1.32rem; font-weight: 800; }
.sh-sub { margin: 0; color: var(--muted); font-size: .88rem; max-width: 760px; line-height: 1.5; }
.sh-prog { min-width: 200px; }
.ov-num { font-size: .92rem; color: var(--muted); } .ov-num b { color: #f0a820; font-size: 1.12rem; }
.ov-bar { height: 8px; background: #eef2f7; border-radius: 6px; overflow: hidden; margin: 4px 0; }
.ov-bar span { display: block; height: 100%; background: linear-gradient(90deg, #ffc53d, #f0a820); }
.ov-lab { font-size: .8rem; color: var(--muted); display: flex; gap: 10px; justify-content: flex-end; }
.dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 4px; vertical-align: middle; }
.dot.ok { background: #67c23a; } .dot.half { background: #e6a23c; } .dot.bad { background: #f56c6c; }

.alert { display: flex; gap: 10px; align-items: flex-start; background: #fff6f5; border: 1px solid #ffd7d2; border-left: 5px solid #f56c6c; border-radius: 10px; padding: 11px 14px; margin-bottom: 12px; }
.al-ic { font-size: 1.2rem; } .al-txt { font-size: .88rem; color: #a83a30; line-height: 1.55; }
.al-chip { display: inline-block; background: #fff; border: 1px solid #ffc9c2; border-radius: 6px; padding: 2px 8px; margin: 3px 4px 0 0; cursor: pointer; font-weight: 600; color: #c45656; }
.al-chip:hover { background: #f56c6c; color: #fff; }

.sub-filter { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
.sf { border: 1px solid var(--line); background: #fff; color: var(--muted); border-radius: 16px; padding: 5px 16px; font-size: .9rem; cursor: pointer; transition: all .2s; }
.sf.on { color: #fff; background: var(--navy); border-color: var(--navy); }

.legend { display: flex; gap: 14px; flex-wrap: wrap; align-items: center; font-size: .8rem; color: var(--muted); padding: 6px 0 10px; }
.legend i { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 5px; vertical-align: middle; }
.lg-note { margin-left: auto; color: #97a6ba; }

.chart-wrap { background: linear-gradient(180deg,#fbfdff,#f4f8fd); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
.chart { width: 100%; height: 560px; }
.spine-loading { padding: 40px; text-align: center; color: var(--muted); }

.detail { margin-top: 16px; border: 1px solid var(--line); border-radius: 12px; background: #fff; overflow: hidden; box-shadow: 0 4px 18px rgba(13,33,55,.06); }
.dt-hd { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding: 12px 16px; border-left: 5px solid #999; background: #f7fafd; }
.dt-title { font-weight: 800; font-size: 1.05rem; color: var(--navy); }
.dt-sub { font-size: .82rem; margin-right: 6px; }
.dt-meta { font-size: .82rem; color: var(--muted); }
.dt-wrong { font-style: normal; color: #c45656; font-weight: 700; margin-left: 6px; }
.dt-go { margin-left: auto; border: 1px solid var(--navy); background: var(--navy); color: #fff; border-radius: 8px; padding: 5px 12px; font-size: .82rem; cursor: pointer; }
.dt-close { cursor: pointer; color: #b3bfce; font-size: 1rem; padding: 0 4px; }
.dt-body { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; padding: 14px 16px; }
.cb-h { font-size: .9rem; font-weight: 700; color: var(--navy); margin-bottom: 8px; }
.pt-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.pt-li { display: flex; align-items: baseline; gap: 8px; font-size: .87rem; }
.pc-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
.pt-n { color: var(--ink); font-weight: 600; }
.pt-m { color: #97a6ba; font-size: .76rem; margin-left: auto; white-space: nowrap; }
.tpl-wrap { display: flex; flex-direction: column; gap: 8px; }
.tpl { background: #f6f9ff; border: 1px solid #e2ecff; border-radius: 8px; padding: 8px 12px; }
.tpl-t { font-size: .87rem; font-weight: 700; color: #2f5aa8; }
.tpl-t em { font-style: normal; font-weight: 400; font-size: .75rem; color: #8aa0c0; margin-left: 6px; }
.tpl-tip { font-size: .8rem; color: #5b6b7f; margin-top: 4px; line-height: 1.5; }
.tpl-none { font-size: .82rem; color: #97a6ba; }
.wrong-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
.wrong-it { background: #fde2e2; color: #b02e26; border-radius: 6px; padding: 2px 10px; font-size: .8rem; cursor: pointer; font-weight: 600; }
.wrong-it:hover { background: #f56c6c; color: #fff; }

.spine-foot { margin-top: 14px; font-size: .82rem; color: var(--muted); background: #f5f8fc; border: 1px dashed var(--line); border-radius: 10px; padding: 11px 14px; line-height: 1.6; }

@media (max-width: 640px) {
  .chart { height: 460px; }
  .dt-body { grid-template-columns: 1fr; gap: 12px; }
  .legend { gap: 10px; font-size: .74rem; }
  .lg-note { margin-left: 0; width: 100%; }
  .sh-prog { min-width: 100%; }
  .al-txt { max-height: 88px; overflow-y: auto; -webkit-overflow-scrolling: touch; }
  .al-chip { margin: 2px 4px 0 0; padding: 1px 7px; font-size: .8rem; }
}
</style>
