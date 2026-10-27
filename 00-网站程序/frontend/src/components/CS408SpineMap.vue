<script setup lang="ts">
// 408 主线地图 —— 以 chapterCode 为唯一主键，把「章节 → 高频考点 → 真题覆盖/正确率 → 我的错题 → 解题模板」
// 串成一条能顺线走的主线，治"整个很乱、穿不起来、记不住、刷题没进步"。
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MODULE_MAP, examFreqPoints, SUBJECTS, FREQ_LEVELS, type ExamFreqPoint } from '@/data/examFrequency'
import { CS408_TOPIC_GUIDES } from '@/data/cs408TopicGuides'

interface BigQ {
  slug: string
  subject: string
  year: number
  index: number
  chapterCode: string
  chapterName: string
  score: number
  tags: string[]
}
interface Rec { result: 'correct' | 'partial' | 'wrong'; date: string; attempts: number }
interface ProgressFile { records: Record<string, Rec> }

const router = useRouter()
const LS_KEY = 'exam408-big-v2'

const loading = ref(true)
const items = ref<BigQ[]>([])
const diskRecords = ref<Record<string, Rec>>({})
const localRecords = ref<Record<string, Rec>>({})
const records = computed<Record<string, Rec>>(() => ({ ...diskRecords.value, ...localRecords.value }))

// 高亮/聚焦的科目（点科目标题筛选）
const activeSub = ref<string>('all')
// 展开的章节
const openChapters = ref<Set<string>>(new Set())

const SUBJECT_COLORS: Record<string, string> = {
  ds: '#409EFF', co: '#67C23A', os: '#E6A23C', cn: '#F56C6C',
}
const SUBJECT_NAMES: Record<string, string> = {
  ds: '数据结构', co: '计算机组成原理', os: '操作系统', cn: '计算机网络',
}
// 作战优先科目顺序：组成 → OS → 数构 → 计网（会诊结论）
const SUB_ORDER = ['co', 'os', 'ds', 'cn']

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function loadLocal() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) localRecords.value = JSON.parse(raw) || {}
  } catch { localRecords.value = {} }
}

// ---- 每个 chapterCode 的聚合数据 ----
interface ChapterAgg {
  code: string
  sub: string
  subKey: string
  chapter: number
  chapterTitle: string
  points: ExamFreqPoint[]       // 该章高频考点（按 等级→分值 排序）
  highScore: number             // 该章考频总分值
  highCount: number             // 高频考点数
  bigqTotal: number
  bigqDone: number
  bigqCorrect: number
  bigqPartial: number
  bigqWrong: number
  wrongList: BigQ[]             // 真题里判为"错"的题
  coverage: number              // 已刷 / 总数
  templates: { title: string; tag: string; tip?: string }[]  // 命中的解题模板
}

// 模板关键词 → 章节匹配（专题指南无 chapterCode，用标题/考点关键词 loose 匹配到章）
function matchTemplates(subKey: string, chapterTitle: string, points: ExamFreqPoint[]): { title: string; tag: string; tip?: string }[] {
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
    // fallback：用标题本身分词
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
    const pts = examFreqPoints
      .filter(p => p.code === code)
      .sort((a, b) => {
        const rank = { high: 0, mid: 1, low: 2, cold: 3 } as Record<string, number>
        return rank[a.lv] - rank[b.lv] || b.score - a.score
      })
    if (!pts.length) continue
    const chItems = items.value.filter(i => i.chapterCode === code)
    let done = 0, correct = 0, partial = 0, wrong = 0
    const wrongList: BigQ[] = []
    for (const it of chItems) {
      const rr = r[it.slug]
      if (rr) {
        done++
        if (rr.result === 'correct') correct++
        else if (rr.result === 'wrong') { wrong++; wrongList.push(it) }
        else partial++
      }
    }
    const highScore = pts.reduce((s, p) => s + p.score, 0)
    const highCount = pts.filter(p => p.lv === 'high').length
    list.push({
      code, sub: info.sub, subKey: info.subKey, chapter: info.chapter, chapterTitle: info.chapterTitle,
      points: pts, highScore, highCount,
      bigqTotal: chItems.length, bigqDone: done, bigqCorrect: correct, bigqPartial: partial, bigqWrong: wrong,
      wrongList, coverage: chItems.length ? Math.round((done / chItems.length) * 100) : 0,
      templates: matchTemplates(info.subKey, info.chapterTitle, pts),
    })
  }
  return list
})

// 按科目分组，科内按「分值 + 未覆盖缺口」排序（该先攻的排前面）
const bySubject = computed(() => {
  const out: Record<string, ChapterAgg[]> = { co: [], os: [], ds: [], cn: [] }
  for (const c of chapters.value) (out[c.subKey] ||= []).push(c)
  for (const k in out) {
    out[k].sort((a, b) => {
      // 优先级：真题多但没刷完(黑洞) 优先，其次 分值高
      const gapA = a.bigqTotal - a.bigqDone, gapB = b.bigqTotal - b.bigqDone
      return (gapB > 0 ? 1 : 0) - (gapA > 0 ? 1 : 0) || gapB - gapA || b.highScore - a.highScore
    })
  }
  return out
})

const subjectsShown = computed(() =>
  SUB_ORDER.filter(k => activeSub.value === 'all' || activeSub.value === k)
)

// 顶部总览
const overview = computed(() => {
  const total = items.value.length
  let done = 0, correct = 0, wrong = 0, partial = 0
  const r = records.value
  for (const it of items.value) {
    const rr = r[it.slug]
    if (rr) { done++; if (rr.result === 'correct') correct++; else if (rr.result === 'wrong') wrong++; else partial++ }
  }
  // 黑洞章节：有真题但一个没刷
  const blackholes = chapters.value.filter(c => c.bigqTotal > 0 && c.bigqDone === 0)
  return { total, done, correct, wrong, partial, pct: total ? Math.round((done / total) * 100) : 0, blackholes }
})

function toggleChapter(code: string) {
  const s = new Set(openChapters.value)
  if (s.has(code)) s.delete(code); else s.add(code)
  openChapters.value = s
}
function levelColor(lv: string) { return FREQ_LEVELS[lv as keyof typeof FREQ_LEVELS]?.color || '#909399' }
function levelLabel(lv: string) { return FREQ_LEVELS[lv as keyof typeof FREQ_LEVELS]?.label || lv }

function goExam(subject?: string) {
  router.push({ path: '/cs408', query: subject ? { tab: 'exam', subj: subject } : { tab: 'exam' } })
}

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
  } catch (e) {
    console.error('load spine map data failed', e)
  } finally {
    loading.value = false
  }
  loadLocal()
  // 默认展开每科前 3 个高优先章节
  const s = new Set<string>()
  for (const k of SUB_ORDER) bySubject.value[k]?.slice(0, 3).forEach(c => s.add(c.code))
  openChapters.value = s
}
onMounted(load)
</script>

<template>
  <div class="spine">
    <div class="spine-head">
      <div class="sh-title">
        <h2>🧭 408 主线地图 · 把知识点串成一条线</h2>
        <p class="sh-sub">以「章节考点」为主键：<b>章节 → 高频考点(考频分值) → 大题覆盖/正确率 → 我的错题 → 解题模板</b> 一线贯通。按"先补黑洞、再攻高分"排序。</p>
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
        <b>没刷过的真题章节（最大提分空间）：</b>
        <span v-for="b in overview.blackholes" :key="b.code" class="al-chip" @click="activeSub = b.subKey">
          {{ SUBJECT_NAMES[b.subKey] }}·{{ b.chapterTitle }}（{{ b.bigqTotal }}题全空白）
        </span>
      </div>
    </div>

    <!-- 科目筛选 -->
    <div class="sub-filter">
      <button class="sf" :class="{ on: activeSub === 'all' }" @click="activeSub = 'all'">全部主线</button>
      <button v-for="k in SUB_ORDER" :key="k" class="sf" :class="{ on: activeSub === k }"
              :style="activeSub === k ? { background: SUBJECT_COLORS[k], borderColor: SUBJECT_COLORS[k] } : {}"
              @click="activeSub = k">{{ SUBJECT_NAMES[k] }}</button>
    </div>

    <div v-if="loading" class="spine-loading">加载主线…</div>

    <div v-else class="spine-body">
      <section v-for="sk in subjectsShown" :key="sk" class="sub-block">
        <div class="sub-line" :style="{ '--sc': SUBJECT_COLORS[sk] }">
          <span class="sl-dot"></span>
          <h3 class="sl-name">{{ SUBJECT_NAMES[sk] }}</h3>
          <span class="sl-meta">{{ (bySubject[sk] || []).length }} 个考点章节 · 大题 {{ (bySubject[sk] || []).reduce((s, c) => s + c.bigqTotal, 0) }} 道</span>
          <button class="sl-go" @click="goExam(sk)">去刷真题大题 →</button>
        </div>

        <div class="chapters">
          <div v-for="c in bySubject[sk]" :key="c.code" class="chap" :class="{ open: openChapters.has(c.code), hole: c.bigqTotal > 0 && c.bigqDone === 0 }">
            <div class="chap-hd" @click="toggleChapter(c.code)">
              <span class="c-title">第{{ c.chapter }}章 · {{ c.chapterTitle }}</span>
              <span v-if="c.highCount" class="c-badge high">高频 {{ c.highCount }}</span>
              <span class="c-badge score">考频 {{ c.highScore }}分</span>
              <span v-if="c.bigqTotal" class="c-badge cov" :class="{ zero: c.bigqDone === 0 }">大题 {{ c.bigqDone }}/{{ c.bigqTotal }}</span>
              <span v-if="c.bigqWrong" class="c-badge wrong">错题 {{ c.bigqWrong }}</span>
              <span class="c-caret">{{ openChapters.has(c.code) ? '▲' : '▼' }}</span>
            </div>

            <!-- 考点链条（始终可见的"线"） -->
            <div class="point-chain">
              <span v-for="(p, pi) in c.points.slice(0, 6)" :key="p.name" class="pc-item">
                <i class="pc-dot" :style="{ background: levelColor(p.lv) }" :title="levelLabel(p.lv)"></i>
                <span class="pc-name">{{ p.name }}</span>
                <em class="pc-score">{{ p.score }}分·{{ p.yrs }}年</em>
                <span v-if="pi < Math.min(c.points.length, 6) - 1" class="pc-arrow">→</span>
              </span>
              <span v-if="c.points.length > 6" class="pc-more">+{{ c.points.length - 6 }}项</span>
            </div>

            <!-- 展开详情 -->
            <div v-show="openChapters.has(c.code)" class="chap-body">
              <div class="cb-grid">
                <div class="cb-col">
                  <div class="cb-h">📌 高频考点全表</div>
                  <ul class="pt-list">
                    <li v-for="p in c.points" :key="p.name" class="pt-li">
                      <i class="pc-dot" :style="{ background: levelColor(p.lv) }"></i>
                      <span class="pt-n">{{ p.name }}</span>
                      <span class="pt-m">{{ levelLabel(p.lv) }} · {{ p.score }}分 · {{ p.q }}题 · 近{{ p.yrs }}年</span>
                    </li>
                  </ul>
                </div>

                <div class="cb-col">
                  <div class="cb-h">🧩 解题模板 / 套路</div>
                  <div v-if="c.templates.length" class="tpl-wrap">
                    <div v-for="t in c.templates" :key="t.title" class="tpl">
                      <div class="tpl-t">{{ t.title }} <em>{{ t.tag }}</em></div>
                      <div v-if="t.tip" class="tpl-tip">💡 {{ t.tip }}</div>
                    </div>
                  </div>
                  <div v-else class="tpl-none">该科目暂无模板卡，见「🧭 专题指南」页签。</div>

                  <div class="cb-h" style="margin-top:14px">🔴 我的错题（{{ c.wrongList.length }}）</div>
                  <div v-if="c.wrongList.length" class="wrong-wrap">
                    <span v-for="w in c.wrongList" :key="w.slug" class="wrong-it" @click="goExam(c.subKey)">
                      {{ w.year }} 第{{ w.index }}题
                    </span>
                  </div>
                  <div v-else class="tpl-none">暂无真题错题记录 — 去刷题后这里会自动长出来。</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div class="spine-foot">
      主线用法：先看<b>红色告警章节</b>（有题没刷=最大提分）→ 点开章节顺考点链条走 → 记录"该章我会不会、模板是哪套"→ 回「真题大题」刷 → 错题自动回填这里。
    </div>
  </div>
</template>

<style scoped>
.spine { --ink: #1f2d3d; --muted: #5b6b7f; --line: #e4ebf3; --navy: #16345c; --gold: #ffc53d; color: var(--ink); }
.spine-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; margin-bottom: 14px; }
.sh-title h2 { margin: 0 0 4px; font-size: 1.35rem; font-weight: 800; }
.sh-sub { margin: 0; color: var(--muted); font-size: 0.9rem; max-width: 720px; }
.sh-prog { min-width: 210px; }
.ov-num { font-size: .95rem; color: var(--muted); }
.ov-num b { color: #f0a820; font-size: 1.15rem; }
.ov-bar { height: 8px; background: #eef2f7; border-radius: 6px; overflow: hidden; margin: 4px 0; }
.ov-bar span { display: block; height: 100%; background: linear-gradient(90deg, #ffc53d, #f0a820); }
.ov-lab { font-size: .8rem; color: var(--muted); display: flex; gap: 12px; justify-content: flex-end; }
.dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 4px; vertical-align: middle; }
.dot.ok { background: #67c23a; } .dot.half { background: #e6a23c; } .dot.bad { background: #f56c6c; }

.alert { display: flex; gap: 10px; align-items: flex-start; background: #fff6f5; border: 1px solid #ffd7d2; border-left: 5px solid #f56c6c; border-radius: 10px; padding: 12px 16px; margin-bottom: 16px; }
.al-ic { font-size: 1.3rem; } .al-txt { font-size: .9rem; color: #a83a30; line-height: 1.6; }
.al-chip { display: inline-block; background: #fff; border: 1px solid #ffc9c2; border-radius: 6px; padding: 2px 8px; margin: 3px 4px 0 0; cursor: pointer; font-weight: 600; color: #c45656; }
.al-chip:hover { background: #f56c6c; color: #fff; }

.sub-filter { display: flex; gap: 8px; flex-wrap: wrap; padding: 12px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); margin-bottom: 16px; }
.sf { border: 1px solid var(--line); background: #fff; color: var(--muted); border-radius: 16px; padding: 5px 16px; font-size: .9rem; cursor: pointer; transition: all .2s; }
.sf.on { color: #fff; background: var(--navy); border-color: var(--navy); }

.spine-loading { padding: 40px; text-align: center; color: var(--muted); }

.sub-block { margin-bottom: 26px; }
.sub-line { display: flex; align-items: center; gap: 10px; position: relative; padding: 8px 0 12px 22px; }
.sub-line::before { content: ''; position: absolute; left: 8px; top: 0; bottom: 0; width: 3px; background: var(--sc); border-radius: 3px; opacity: .5; }
.sl-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--sc); box-shadow: 0 0 0 3px color-mix(in srgb, var(--sc) 25%, transparent); }
.sl-name { margin: 0; font-size: 1.15rem; font-weight: 800; color: var(--sc); }
.sl-meta { color: var(--muted); font-size: .85rem; }
.sl-go { margin-left: auto; border: 1px solid var(--sc); background: #fff; color: var(--sc); border-radius: 8px; padding: 4px 12px; font-size: .82rem; cursor: pointer; }
.sl-go:hover { background: var(--sc); color: #fff; }

.chapters { display: flex; flex-direction: column; gap: 10px; padding-left: 22px; }
.chap { border: 1px solid var(--line); border-left: 3px solid var(--sc, #d7dee8); border-radius: 10px; background: #fff; transition: box-shadow .2s; }
.chap:hover { box-shadow: 0 3px 14px rgba(13,33,55,.07); }
.chap.hole { border-left-color: #f56c6c; background: #fffbfb; }
.chap.open { background: #fbfdff; }
.chap-hd { display: flex; align-items: center; gap: 10px; padding: 10px 14px; cursor: pointer; flex-wrap: wrap; }
.c-title { font-weight: 700; font-size: 1rem; color: var(--navy); flex: 1 1 200px; }
.c-badge { font-size: .74rem; padding: 1px 8px; border-radius: 5px; font-weight: 700; white-space: nowrap; }
.c-badge.high { background: #fef0f0; color: #c45656; }
.c-badge.score { background: #fff7e6; color: #d48806; }
.c-badge.cov { background: #eef4ff; color: #2f5aa8; }
.c-badge.cov.zero { background: #fff1f0; color: #cf1322; }
.c-badge.wrong { background: #fde2e2; color: #b02e26; }
.c-caret { color: #b3bfce; font-size: .78rem; }

.point-chain { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; padding: 0 14px 10px; }
.pc-item { display: inline-flex; align-items: center; gap: 4px; }
.pc-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.pc-name { font-size: .84rem; color: #43536a; }
.pc-score { font-size: .74rem; color: #97a6ba; font-style: normal; }
.pc-arrow { color: #c4cfdd; margin: 0 2px; font-size: .8rem; }
.pc-more { font-size: .76rem; color: #97a6ba; margin-left: 4px; }

.chap-body { padding: 6px 14px 16px; border-top: 1px dashed var(--line); }
.cb-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.cb-h { font-size: .9rem; font-weight: 700; color: var(--navy); margin-bottom: 8px; }
.pt-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.pt-li { display: flex; align-items: baseline; gap: 8px; font-size: .88rem; }
.pt-n { color: var(--ink); font-weight: 600; }
.pt-m { color: #97a6ba; font-size: .78rem; margin-left: auto; white-space: nowrap; }
.tpl-wrap { display: flex; flex-direction: column; gap: 8px; }
.tpl { background: #f6f9ff; border: 1px solid #e2ecff; border-radius: 8px; padding: 8px 12px; }
.tpl-t { font-size: .88rem; font-weight: 700; color: #2f5aa8; }
.tpl-t em { font-style: normal; font-weight: 400; font-size: .76rem; color: #8aa0c0; margin-left: 6px; }
.tpl-tip { font-size: .8rem; color: #5b6b7f; margin-top: 4px; line-height: 1.5; }
.tpl-none { font-size: .82rem; color: #97a6ba; }
.wrong-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
.wrong-it { background: #fde2e2; color: #b02e26; border-radius: 6px; padding: 2px 10px; font-size: .8rem; cursor: pointer; font-weight: 600; }
.wrong-it:hover { background: #f56c6c; color: #fff; }

.spine-foot { margin-top: 18px; font-size: .82rem; color: var(--muted); background: var(--bg-soft, #f5f8fc); border: 1px dashed var(--line); border-radius: 10px; padding: 12px 16px; line-height: 1.6; }

@media (max-width: 720px) {
  .cb-grid { grid-template-columns: 1fr; gap: 12px; }
  .chapters { padding-left: 12px; }
  .sub-line { padding-left: 14px; }
  .sub-line::before { left: 4px; }
  .pt-m { margin-left: 0; }
}
</style>
