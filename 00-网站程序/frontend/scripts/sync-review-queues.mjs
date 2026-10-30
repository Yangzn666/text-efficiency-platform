// 复习队列聚合器（把散在磁盘上的带刷/复习状态汇成一份网站可读的 JSON）
//
// 背景：数学刷题调度(drill-system)、透视带刷(xray-drill)、费曼复习(feynman-review)、
// 睡前口答(bedtime-drill)、长难句(long-sentence-drill)、作文背诵(essay-recite)、
// 作文模板(writing-coach)、408 选择题轮次(choice-progress) 各自维护一套 spacedQueue，
// 但网站只读得到站内 localStorage 的数据 → 手机上看不见「今天到底欠了多少条复习」。
// 本脚本把它们合并成 public/data/queues/review-queues.json，供 /review-queue 页消费。
//
// 用法：node scripts/sync-review-queues.mjs        （在 frontend 目录下）
//      带刷 skill 每次改完 state.json 后顺手跑一次，再 push 即手机上更新。
//
// 隐私：只抽取「考点名 + 严重度 + 到期日 + 错因短语 + 计数」这类结构化字段，
//      明确丢弃 note / reason / lastNote / _note 等自由文本（里面是对话过程记录）。
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

const HERE = dirname(fileURLToPath(import.meta.url))
const FRONTEND = resolve(HERE, '..')
const ROOT = resolve(FRONTEND, '..', '..') // D:\学习\效率
const OUT_DIR = resolve(FRONTEND, 'public', 'data', 'queues')
const OUT = join(OUT_DIR, 'review-queues.json')

/** 本地日期的 YYYY-MM-DD（toISOString 是 UTC，东八区夜间会差一天） */
const localToday = () => new Date().toLocaleDateString('sv-SE')
const TODAY = localToday()

function readJson(abs) {
  if (!existsSync(abs)) return null
  try {
    return JSON.parse(readFileSync(abs, 'utf8'))
  } catch (e) {
    console.warn('[skip] 解析失败', abs, e.message)
    return null
  }
}
function ageDays(abs) {
  if (!existsSync(abs)) return null
  return Math.floor((Date.now() - statSync(abs).mtimeMs) / 86400000)
}
/** 逾期天数：nextReview 距今几天（未到期为负数） */
function overdue(dateStr) {
  if (!dateStr) return null
  const d = new Date(String(dateStr).slice(0, 10) + 'T00:00:00')
  if (isNaN(d.getTime())) return null
  const t = new Date(TODAY + 'T00:00:00')
  return Math.round((t - d) / 86400000)
}
/** 严重度归一：high / mid / low */
function sev(v) {
  const s = String(v || '').toLowerCase()
  if (s === 'high' || s === 's1' || s === 'a' || s === '严重') return 'high'
  if (s === 'medium' || s === 'mid' || s === 's2' || s === 'b' || s === '中等') return 'mid'
  if (s === 'low' || s === 's3' || s === 'c') return 'low'
  return 'mid'
}
/** 自由文本里的错因短语做长度收敛，只留可执行的一句话 */
function clip(s, n = 90) {
  if (!s) return ''
  const t = String(s).replace(/\s+/g, ' ').trim()
  return t.length > n ? t.slice(0, n) + '…' : t
}
const FEY_SUBJECT = { math: '数学', ds: '408', co: '408', os: '408', cn: '408' }
// 磁盘各队列的 subject 字段口径不一（math / cs408 / english …），统一成账本显示名，
// 否则同一科目在筛选 chip 里会分裂成两条。
const SUBJ_NORM = {
  math: '数学', 数学: '数学',
  cs408: '408', ds: '408', co: '408', os: '408', cn: '408', '408': '408',
  english: '英语', 英语: '英语',
  politics: '政治', 政治: '政治',
  comprehensive: '综合', 综合: '综合'
}
const normSubject = (s) => SUBJ_NORM[String(s || '').trim()] || String(s || '').trim() || '综合'

const items = []
const preExam = []
const overview = []
const sources = []
/** 每日时间预算（来自 drill-system/params） */
let budget = null
/** 今日排程（来自 drill-system/plannedToday） */
let todayPlan = null
/** 初试日期（来自 drill-system/params.examDate） */
let examDate = null

function push(it) {
  if (!it || !it.title) return
  items.push({
    id: `${it.src}|${it.title}`,
    overdue: overdue(it.nextReview),
    severity: sev(it.severity),
    ...it
  })
}

// ───────────────────────── 1. 数一刷题调度 drill-system ─────────────────────────
{
  const p = join(ROOT, 'drill-system', 'drillState.json')
  const d = readJson(p)
  if (d) {
    sources.push({ key: 'drill', label: '数一刷题调度', file: 'drill-system/drillState.json', ageDays: ageDays(p) })
    const cmap = new Map((d.clusters || []).map(c => [c.id, c]))
    for (const q of d.spacedQueue || []) {
      const c = cmap.get(q.clusterId) || {}
      push({
        src: 'drill', srcLabel: '数一刷题调度', subject: '数学', branch: c.subject || '数学',
        title: q.clusterId, kind: '考点簇回炉', tier: q.tier || c.tier || '',
        severity: q.severity || c.severity, nextReview: q.nextReview,
        mastery: c.mastery || '', linked: (c.qIds || []).length
      })
    }
    for (const r of d.preExamReminders || []) {
      preExam.push({ subject: '数学', cause: r.错因 || '', text: clip(r.提醒, 120) })
    }
    // 今日排程：plannedToday / plannedToday2 取日期更新的那一份
    const plans = [d.plannedToday, d.plannedToday2].filter(Boolean).sort((a, b) => (a.date < b.date ? 1 : -1))
    const plan = plans[0]
    if (plan) {
      todayPlan = {
        date: plan.date,
        subjectLabel: '数学一',
        items: (plan.items || []).map(x => ({
          ord: x.ord, title: x.cluster || x.id, branch: x.subject || '',
          mode: x.mode || '', why: clip(x.why, 60), status: x.status || 'todo'
        }))
      }
    }
    const st = d.stats || {}
    overview.push({
      key: 'drill', label: '数一错题存量', total: st.backlogAll ?? 0, left: st.backlogLeft ?? 0,
      unit: '题', hint: `A档${st.tierA ?? 0}·B档${st.tierB ?? 0}·C档${st.tierC ?? 0}，毕业 ${st.graduated ?? 0}`,
      href: '/math/drill-plan'
    })
    if (d.params) {
      examDate = d.params.examDate || null
      budget = {
        dailyMinutes: d.params.dailyMinutes ?? null,
        alloc: d.params.alloc || null,
        intervalLadder: d.params.intervalLadder || null,
        amnesty: d.params.amnesty ? { date: d.params.amnesty.date, threshold: d.params.amnesty.threshold } : null,
        focusClusters: d.params.focusClusters || []
      }
    }
  }
}

// ───────────────────────── 2. 透视带刷 xray-drill ─────────────────────────
{
  const p = join(ROOT, 'xray-drill', 'state.json')
  const d = readJson(p)
  if (d) {
    sources.push({ key: 'xray', label: '数一透视诊断', file: 'xray-drill/state.json', ageDays: ageDays(p) })
    const know = d.knowledge || {}
    for (const q of d.spacedQueue || []) {
      const k = know[q.id] || {}
      push({
        src: 'xray', srcLabel: '数一透视诊断', subject: '数学', branch: '题型透视',
        title: q.id, kind: '题型卡重测', severity: q.severity, nextReview: q.nextReview,
        mastery: k.mastery || '', linked: (k.errors || []).length,
        causes: (k.errors || []).slice(0, 3).map(e => clip(e, 80))
      })
    }
    const ed = d.errorDistribution || {}
    overview.push({
      key: 'xray', label: '数一错因分布', total: Object.values(ed).reduce((a, b) => a + b, 0), left: (d.errorNotebook || []).length,
      unit: '条', hint: Object.entries(ed).map(([k, v]) => `${k}${v}`).join('·'), href: '/wrong-problems?subject=math'
    })
  }
}

// ───────────────────────── 3. 费曼复习缺口 feynman-review ─────────────────────────
{
  const p = join(ROOT, 'feynman-review', 'state.json')
  const d = readJson(p)
  if (d) {
    sources.push({ key: 'feynman', label: '费曼复习缺口', file: 'feynman-review/state.json', ageDays: ageDays(p) })
    for (const q of d.spacedQueue || []) {
      const chap = String(q.chapter || '')
      const head = chap.split('-')[0]
      push({
        src: 'feynman', srcLabel: '费曼复习缺口', subject: FEY_SUBJECT[head] || '408', branch: chap,
        title: q.topic || q.id, kind: '费曼缺口回炉', severity: q.severity, nextReview: q.nextReview,
        box: q.interval ?? null, streak: q.correctStreak ?? null,
        causes: q.errorType ? [clip(q.errorType, 60)] : []
      })
    }
    const st = d.stats || {}
    overview.push({
      key: 'feynman', label: '费曼缺口账本', total: st.totalGaps ?? 0, left: (d.spacedQueue || []).length,
      unit: '个缺口', hint: `已讲透 ${st.mastered ?? 0}，累计提问 ${st.totalQuestions ?? 0}`, href: '/cs408'
    })
  }
}

// ───────────────────────── 4. 长难句 long-sentence-drill ─────────────────────────
{
  const p = join(ROOT, 'long-sentence-drill', 'state.json')
  const d = readJson(p)
  if (d) {
    sources.push({ key: 'long', label: '长难句', file: 'long-sentence-drill/state.json', ageDays: ageDays(p) })
    const sents = d.sentences || {}
    for (const q of d.spacedQueue || []) {
      push({
        src: 'long', srcLabel: '长难句', subject: '英语', branch: `模式${q.mode || '-'}`,
        title: sents[q.id]?.source || q.id, kind: '长难句重译', severity: q.severity, nextReview: q.nextReview,
        causes: q.errorType ? [clip(q.errorType, 80)] : []
      })
    }
  }
}

// ───────────────────────── 5. 睡前口答 bedtime-drill ─────────────────────────
{
  const p = join(ROOT, 'bedtime-drill', 'state.json')
  const d = readJson(p)
  if (d) {
    sources.push({ key: 'bedtime', label: '睡前口答', file: 'bedtime-drill/state.json', ageDays: ageDays(p) })
    let dueCount = 0
    for (const [id, it] of Object.entries(d.items || {})) {
      const od = overdue(it.nextDue)
      if (it.graduated) continue
      if (od === null || od < 0) continue
      dueCount++
      push({
        src: 'bedtime', srcLabel: '睡前口答', subject: normSubject(it.subject), branch: it.type || '口答',
        title: clip(it.prompt, 120), kind: '睡前口答', severity: it.box >= 3 ? 'low' : 'mid',
        nextReview: it.nextDue, box: it.box ?? 0, answer: clip(it.answerKey, 120)
      })
    }
    overview.push({
      key: 'bedtime', label: '睡前口答队列', total: Object.keys(d.items || {}).length, left: dueCount,
      unit: '条', hint: `每场 ${(d.config || {}).countPerSession ?? 10} 条 · 间隔 ${((d.config || {}).intervalsDays || []).join('/')}`,
      href: '/srs'
    })
    if ((d.focusTomorrow || []).length) {
      for (const f of d.focusTomorrow) preExam.push({ subject: '综合', cause: '明日聚焦', text: clip(f, 120) })
    }
  }
}

// ───────────────────────── 6. 作文背诵 essay-recite ─────────────────────────
{
  const p = join(ROOT, 'essay-recite', 'state.json')
  const d = readJson(p)
  if (d) {
    sources.push({ key: 'essay', label: '作文背诵顺序', file: 'essay-recite/state.json', ageDays: ageDays(p) })
    const units = Object.values(d.units || {})
    const learned = units.filter(u => u.status && u.status !== 'unlearned').length
    const due = units.filter(u => u.nextReview && overdue(u.nextReview) >= 0).length
    overview.push({
      key: 'essay', label: '英语作文背诵', total: units.length, left: units.length - learned,
      unit: '句', hint: `已学 ${learned} · 到期 ${due} · 游标 ${Object.entries(d.cursor || {}).map(([k, v]) => `${k}:${v}`).join(' ') || '未开始'}`,
      href: '/english'
    })
  }
}

// ───────────────────────── 7. 作文模板 writing-coach ─────────────────────────
{
  const p = join(ROOT, 'writing-coach', 'state.json')
  const d = readJson(p)
  if (d) {
    sources.push({ key: 'coach', label: '作文模板默写', file: 'writing-coach/state.json', ageDays: ageDays(p) })
    const its = Object.values(d.items || {})
    const learned = its.filter(u => u.status && u.status !== 'unlearned').length
    const due = its.filter(u => u.nextReview && overdue(u.nextReview) >= 0).length
    overview.push({
      key: 'coach', label: '作文模板库', total: its.length, left: its.length - learned,
      unit: '条', hint: `已背 ${learned} · 到期 ${due} · 队列 ${(d.spacedQueue || []).length}`, href: '/english'
    })
  }
}

// ───────────────────────── 8. 408 选择题轮次 choice-progress ─────────────────────────
{
  const p = join(FRONTEND, 'public', 'data', '408-exam', 'choice-progress.json')
  const d = readJson(p)
  if (d) {
    sources.push({ key: 'choice', label: '408 选择题轮次', file: 'public/data/408-exam/choice-progress.json', ageDays: ageDays(p) })
    const subs = Object.entries(d.subjects || {})
    const totalWrong = subs.reduce((a, [, s]) => a + ((s.wrongList || []).length || s.wrongCount || 0), 0)
    overview.push({
      key: 'choice', label: '408 选择题', total: subs.reduce((a, [, s]) => a + (s.round || 0), 0), left: totalWrong,
      unit: '轮/错', hint: subs.map(([k, s]) => `${k} 第${s.round || 1}轮 错${(s.wrongList || []).length || s.wrongCount || 0}`).join(' · '),
      href: '/cs408'
    })
  }
}

// ───────────────────────── 9. 政治漏洞地图（站内已有，只做入口与计数） ─────────────────────────
{
  const p = join(FRONTEND, 'public', 'data', 'politics', 'vuln-map.json')
  const d = readJson(p)
  if (d) {
    const groups = d.groups || []
    const hot = groups.filter(g => (g.count || 0) >= 2).length
    overview.push({
      key: 'politics', label: '政治一刷漏洞', total: d.meta?.total ?? groups.reduce((a, g) => a + (g.count || 0), 0),
      left: hot, unit: '题', hint: `${groups.length} 考点簇 · 顽固簇(≥2题) ${hot} · 手册节点 ${(d.handbook || []).length}`,
      href: '/politics?tab=vuln'
    })
  }
}

// 排序：逾期天数为主，严重度加权
const SEV_W = { high: 1.35, mid: 1, low: 0.75 }
items.sort((a, b) => {
  const sa = (a.overdue ?? -999) * SEV_W[a.severity]
  const sb = (b.overdue ?? -999) * SEV_W[b.severity]
  return sb - sa
})

const payload = {
  generatedAt: `${localToday()} ${new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' })}`,
  today: TODAY,
  examDate: examDate || '2026-12-19',
  sources,
  budget,
  todayPlan,
  items,
  preExam,
  overview
}

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })
writeFileSync(OUT, JSON.stringify(payload), 'utf8')

const due = items.filter(i => i.overdue !== null && i.overdue >= 0).length
console.log(
  `[sync-review-queues] ${items.length} 条队列项（到期 ${due}）· 最后一晚清单 ${preExam.length} 条 · ` +
  `概览 ${overview.length} 项 · ${Math.round(readFileSync(OUT).length / 1024)}KB → public/data/queues/review-queues.json`
)
