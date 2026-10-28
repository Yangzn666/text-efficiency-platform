<script setup lang="ts">
// 408 主页：集中目标用——最近复习重点 + 复习概况 + 快捷入口
// 数据源与主线地图一致：questions.json / progress.json / localStorage 'exam408-big-v2'
// 强化四科进度取 useReinforcementStore，今日到期记忆卡取 useSrsStore。
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSrsStore } from '@/stores/srs'
import { useReinforcementStore, SUBJECTS } from '@/stores/reinforcement'

interface BigQ {
  slug: string; subject: string; year: number; index: number
  chapterCode: string; chapterName: string; score: number
}
interface Rec { result: 'correct' | 'partial' | 'wrong' | 'taught'; date: string; attempts: number }

const router = useRouter()
const srs = useSrsStore()
const reinforce = useReinforcementStore()

const LS_KEY = 'exam408-big-v2'
const SUBJECT_NAMES: Record<string, string> = {
  ds: '数据结构', co: '计算机组成原理', os: '操作系统', cn: '计算机网络'
}

const loading = ref(true)
const items = ref<BigQ[]>([])
const diskRecords = ref<Record<string, Rec>>({})
const localRecords = ref<Record<string, Rec>>({})
const records = computed<Record<string, Rec>>(() => ({ ...diskRecords.value, ...localRecords.value }))

// ===== 倒计时（目标初试日 2026-12-19）=====
const EXAM_DATE = '2026-12-19'
const daysLeft = computed(() => {
  const target = new Date(EXAM_DATE + 'T00:00:00')
  const now = new Date()
  const ms = target.getTime() - now.getTime()
  return Math.max(0, Math.ceil(ms / 86400000))
})

// ===== 大题总览 =====
const overview = computed(() => {
  const total = items.value.length
  let done = 0, correct = 0, wrong = 0, partial = 0
  const r = records.value
  for (const it of items.value) {
    const rr = r[it.slug]
    if (rr) { done++; if (rr.result === 'correct') correct++; else if (rr.result === 'wrong') wrong++; else if (rr.result === 'partial') partial++ }
  }
  return {
    total, done, correct, wrong, partial,
    pct: total ? Math.round((done / total) * 100) : 0,
    acc: done ? Math.round((correct / done) * 100) : 0
  }
})

// 章节级聚合：找黑洞（有题没刷）
interface ChAgg { code: string; subject: string; name: string; total: number; done: number; wrong: number }
const chapterAgg = computed<ChAgg[]>(() => {
  const map = new Map<string, ChAgg>()
  const r = records.value
  for (const it of items.value) {
    let c = map.get(it.chapterCode)
    if (!c) { c = { code: it.chapterCode, subject: it.subject, name: it.chapterName, total: 0, done: 0, wrong: 0 }; map.set(it.chapterCode, c) }
    c.total++
    const rr = r[it.slug]
    if (rr) { c.done++; if (rr.result === 'wrong') c.wrong++ }
  }
  return [...map.values()]
})
const blackholes = computed(() =>
  chapterAgg.value.filter(c => c.total > 0 && c.done === 0).sort((a, b) => b.total - a.total)
)
const wrongItems = computed(() => {
  const r = records.value
  return items.value
    .filter(it => r[it.slug]?.result === 'wrong')
    .sort((a, b) => (r[b.slug]?.date || '').localeCompare(r[a.slug]?.date || ''))
})

// 强化：今日到期卡 & 费曼卡点
const cs408Due = computed(() => srs.cs408DueCount)
const weakChapters = computed(() => reinforce.weakChapters)
const reinforceOverall = computed(() => reinforce.overallStats)
const reinforceBySubject = computed(() =>
  SUBJECTS.map(s => {
    const stats = reinforce.subjectStats(s.key)
    return { key: s.key, short: s.short, color: s.color, icon: s.icon, percent: stats.percent }
  })
)

// ===== 最近复习重点（优先级动作清单）=====
interface Action {
  key: string; icon: string; title: string; desc: string; cta: string; go: () => void; hot: boolean
}
const actions = computed<Action[]>(() => {
  const out: Action[] = []
  if (cs408Due.value > 0) out.push({
    key: 'due', icon: '🔁', hot: true,
    title: `今日到期记忆卡 ${cs408Due.value} 张`,
    desc: '讲过 / 做错的真题，按记忆曲线该回炉了——碎片时间主动回忆解题钥匙',
    cta: '去复习', go: () => { srs.seedCS408().finally(() => router.push({ path: '/srs', query: { pool: 'cs408-bigq' } })) }
  })
  if (blackholes.value.length) out.push({
    key: 'blackhole', icon: '🕳️', hot: true,
    title: `黑洞章节 ${blackholes.value.length} 个（有题一题没刷）`,
    desc: blackholes.value.slice(0, 4).map(b => `${SUBJECT_NAMES[b.subject] || b.subject}·${b.name}(${b.total}题)`).join('　'),
    cta: '打开主线地图', go: () => router.push({ path: '/cs408', query: { tab: 'spine' } })
  })
  if (wrongItems.value.length) out.push({
    key: 'wrong', icon: '🔴', hot: false,
    title: `待回炉错题 ${wrongItems.value.length} 道`,
    desc: '做错的独立重做一遍，别只看解析——重做对了才算真会',
    cta: '去真题大题', go: () => router.push({ path: '/cs408', query: { tab: 'exam' } })
  })
  if (weakChapters.value.length) out.push({
    key: 'feynman', icon: '⚠️', hot: false,
    title: `费曼卡点 ${weakChapters.value.length} 章`,
    desc: weakChapters.value.slice(0, 4).map(w => `${w.subject.short}·${w.chapter.name.replace(/^第\d+章\s*/, '')}`).join('　'),
    cta: '去强化进度', go: () => router.push({ path: '/cs408', query: { tab: 'progress', mode: 'reinforce' } })
  })
  return out
})

// 快捷入口
const shortcuts = [
  { icon: '🧭', label: '主线地图', go: () => router.push({ path: '/cs408', query: { tab: 'spine' } }) },
  { icon: '📝', label: '真题大题', go: () => router.push({ path: '/cs408', query: { tab: 'exam' } }) },
  { icon: '📈', label: '进度总览', go: () => router.push({ path: '/cs408', query: { tab: 'progress' } }) },
  { icon: '🧭', label: '专题指南', go: () => router.push({ path: '/cs408', query: { tab: 'guide' } }) },
  { icon: '📊', label: '考频地图', go: () => router.push({ path: '/cs408', query: { tab: 'frequency' } }) },
  { icon: '🔁', label: '记忆卡', go: () => { srs.seedCS408().finally(() => router.push({ path: '/srs', query: { pool: 'cs408-bigq' } })) } }
]

function loadLocal() {
  try { const raw = localStorage.getItem(LS_KEY); if (raw) localRecords.value = JSON.parse(raw) || {} }
  catch { localRecords.value = {} }
}

async function load() {
  loading.value = true
  const base = import.meta.env.BASE_URL || '/'
  const dir = `${base}data/408-exam/`
  try {
    const [rq, pq] = await Promise.all([
      fetch(`${dir}questions.json?t=${Date.now()}`).then(r => (r.ok ? r.json() : null)).catch(() => null),
      fetch(`${dir}progress.json?t=${Date.now()}`).then(r => (r.ok ? r.json() : null)).catch(() => null)
    ])
    if (rq?.items) items.value = rq.items
    if (pq?.records) diskRecords.value = pq.records
  } catch (e) { console.error('load home data failed', e) }
  finally { loading.value = false }
  loadLocal()
}

onMounted(() => {
  srs.init()
  srs.seedCS408()
  load()
})
</script>

<template>
  <div class="cs408-home">
    <!-- 顶部：目标 + 倒计时 + 一句话阶段 -->
    <div class="hero-strip">
      <div class="hs-goal">
        <span class="hs-kicker">目标 110+ · 主攻大题判据 & 黑洞章节</span>
        <h2 class="hs-title">408 冲刺主页<span class="hs-dim"> · 集中目标，一秒看清今天要打哪儿</span></h2>
        <p class="hs-now">
          基础轮四门已收官 → 现处<b>大题强化阶段</b>（数据结构 → 计组 → 操作系统 → 计网）。
          数一每天 4.5h 雷打不动，408 每天 1~1.5h，跑不满就砍量不砍结构。
        </p>
      </div>
      <div class="hs-count">
        <div class="hs-days"><b>{{ daysLeft }}</b><span>天</span></div>
        <div class="hs-dl-lab">距初试（{{ EXAM_DATE }}）</div>
      </div>
    </div>

    <!-- 最近复习重点 -->
    <section class="panel focus-panel">
      <div class="panel-hd">
        <h3>🎯 最近复习重点</h3>
        <span class="panel-sub">按优先级排好——从上往下逐个击破</span>
      </div>
      <div v-if="loading" class="ph-loading">正在读取进度…</div>
      <div v-else-if="!actions.length" class="ph-allclear">
        ✅ 无到期卡 / 无黑洞章节 / 无待回炉错题 / 无费曼卡点——保持节奏，直接推进下一专题。
      </div>
      <div v-else class="action-list">
        <div v-for="a in actions" :key="a.key" class="action" :class="{ hot: a.hot }">
          <div class="ac-icon">{{ a.icon }}</div>
          <div class="ac-body">
            <div class="ac-title">{{ a.title }}</div>
            <div class="ac-desc">{{ a.desc }}</div>
          </div>
          <button class="ac-cta" @click="a.go">{{ a.cta }} →</button>
        </div>
      </div>
    </section>

    <!-- 复习概况 -->
    <section class="panel">
      <div class="panel-hd">
        <h3>📊 复习概况</h3>
        <span class="panel-sub">三块拼图：真题大题 · 强化矩阵 · 基础轮</span>
      </div>

      <div class="ov-grid">
        <!-- 大题 -->
        <div class="ov-card bigq">
          <div class="ov-h">📝 真题大题</div>
          <div class="ov-big"><b>{{ overview.done }}</b><span>/{{ overview.total }} 已刷 · {{ overview.pct }}%</span></div>
          <div class="ov-bar"><span :style="{ width: overview.pct + '%' }"></span></div>
          <div class="ov-chips">
            <span class="chip ok">对 {{ overview.correct }}</span>
            <span class="chip half">半 {{ overview.partial }}</span>
            <span class="chip bad">错 {{ overview.wrong }}</span>
            <span class="chip acc">正确率 {{ overview.acc }}%</span>
          </div>
        </div>

        <!-- 强化矩阵 -->
        <div class="ov-card reinforce">
          <div class="ov-h">🎯 强化矩阵</div>
          <div class="ov-big"><b>{{ reinforceOverall.percent }}%</b><span>四科达成 · {{ reinforceOverall.done }}/{{ reinforceOverall.total }} 章</span></div>
          <div class="ov-sub-row">
            <div v-for="s in reinforceBySubject" :key="s.key" class="mini">
              <div class="mini-ring" :style="{ background: `conic-gradient(${s.color} ${s.percent * 3.6}deg, #eef2f7 0deg)` }">
                <i>{{ s.percent }}</i>
              </div>
              <div class="mini-lab">{{ s.icon }} {{ s.short }}</div>
            </div>
          </div>
        </div>

        <!-- 基础轮 -->
        <div class="ov-card base">
          <div class="ov-h">🎓 基础轮</div>
          <div class="ov-big"><b>4</b><span>/4 门已收官</span></div>
          <div class="ov-base-list">
            <div class="bl"><span>数据结构</span><em>✅</em></div>
            <div class="bl"><span>计算机组成原理</span><em>✅</em></div>
            <div class="bl"><span>操作系统</span><em>✅</em></div>
            <div class="bl"><span>计算机网络</span><em>✅</em></div>
          </div>
        </div>
      </div>

      <!-- 快捷入口 -->
      <div class="quick-row">
        <button v-for="s in shortcuts" :key="s.label" class="quick" @click="s.go">
          <span class="q-ic">{{ s.icon }}</span>{{ s.label }}
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.cs408-home {
  --ink: #1f2d3d;
  --muted: #5b6b7f;
  --line: #e4ebf3;
  --navy: #16345c;
  --gold: #ffc53d;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* 顶部 hero */
.hero-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  background: linear-gradient(150deg, #0d2137 0%, #16345c 60%, #1e4576 100%);
  border-radius: 16px;
  padding: 24px 28px;
  position: relative;
  overflow: hidden;
}
.hero-strip::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255,255,255,.05) 1px, transparent 1px);
  background-size: 22px 22px;
  pointer-events: none;
}
.hs-goal { position: relative; z-index: 1; flex: 1; min-width: 260px; }
.hs-kicker {
  font-size: .74rem; letter-spacing: .16em; color: var(--gold);
  text-transform: uppercase; font-weight: 700;
}
.hs-title { margin: 8px 0 6px; font-size: 1.5rem; font-weight: 800; color: #fff; }
.hs-dim { font-size: .9rem; font-weight: 500; color: #9fb4cd; }
.hs-now { margin: 0; color: #b9c8dc; font-size: .9rem; line-height: 1.6; max-width: 640px; }
.hs-now b { color: #fff; }
.hs-count { position: relative; z-index: 1; text-align: center; }
.hs-days { display: flex; align-items: baseline; gap: 4px; justify-content: center; }
.hs-days b { font-size: 3rem; font-weight: 900; color: var(--gold); line-height: 1; }
.hs-days span { font-size: 1.1rem; color: var(--gold); }
.hs-dl-lab { font-size: .78rem; color: #9fb4cd; margin-top: 4px; }

/* 面板通用 */
.panel {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 4px 18px rgba(13, 33, 55, .05);
}
.panel-hd { display: flex; align-items: baseline; gap: 12px; margin-bottom: 14px; }
.panel-hd h3 { margin: 0; font-size: 1.12rem; font-weight: 800; color: var(--navy); }
.panel-sub { font-size: .82rem; color: var(--muted); }
.ph-loading, .ph-allclear { padding: 18px; text-align: center; color: var(--muted); font-size: .9rem; }
.ph-allclear { color: #529b2e; background: #f0f9eb; border-radius: 10px; }

/* 最近复习重点 */
.action-list { display: flex; flex-direction: column; gap: 10px; }
.action {
  display: flex; align-items: center; gap: 14px;
  border: 1px solid var(--line); border-radius: 12px;
  padding: 12px 16px; background: #fbfcfe;
  transition: all .2s ease;
}
.action:hover { box-shadow: 0 6px 16px rgba(13, 33, 55, .08); transform: translateY(-1px); }
.action.hot { border-left: 5px solid #f56c6c; background: #fff7f6; }
.ac-icon { font-size: 1.6rem; flex-shrink: 0; }
.ac-body { flex: 1; min-width: 0; }
.ac-title { font-weight: 700; color: var(--ink); font-size: .98rem; }
.ac-desc { font-size: .84rem; color: var(--muted); margin-top: 3px; line-height: 1.5; }
.ac-cta {
  flex-shrink: 0; border: none; cursor: pointer; white-space: nowrap;
  font-weight: 700; font-size: .88rem; color: #fff;
  background: linear-gradient(90deg, var(--navy), #1e4576);
  padding: 9px 16px; border-radius: 999px;
  box-shadow: 0 3px 10px rgba(22, 52, 92, .22);
  transition: transform .15s ease;
}
.ac-cta:hover { transform: translateY(-2px); }

/* 复习概况 */
.ov-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.ov-card { border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; background: #fbfcfe; }
.ov-card.bigq { border-top: 3px solid var(--gold); }
.ov-card.reinforce { border-top: 3px solid #67c23a; }
.ov-card.base { border-top: 3px solid #409eff; }
.ov-h { font-size: .88rem; font-weight: 700; color: var(--navy); margin-bottom: 8px; }
.ov-big { display: flex; align-items: baseline; gap: 8px; margin-bottom: 8px; }
.ov-big b { font-size: 1.9rem; font-weight: 900; color: var(--navy); line-height: 1; }
.ov-big span { font-size: .82rem; color: var(--muted); }
.ov-bar { height: 8px; background: #eef2f7; border-radius: 6px; overflow: hidden; margin-bottom: 10px; }
.ov-bar span { display: block; height: 100%; background: linear-gradient(90deg, var(--gold), #f0a820); }
.ov-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip { font-size: .76rem; border-radius: 999px; padding: 2px 10px; background: #eef2f7; color: var(--muted); }
.chip.ok { color: #529b2e; background: #f0f9eb; }
.chip.half { color: #b88230; background: #fdf6ec; }
.chip.bad { color: #c45656; background: #fef0f0; }
.chip.acc { color: var(--navy); background: #eef4fd; font-weight: 700; }

.ov-sub-row { display: flex; justify-content: space-between; gap: 8px; }
.mini { text-align: center; flex: 1; }
.mini-ring {
  width: 46px; height: 46px; border-radius: 50%; margin: 0 auto 5px;
  display: flex; align-items: center; justify-content: center;
  position: relative;
}
.mini-ring::after { content: ''; position: absolute; inset: 5px; background: #fbfcfe; border-radius: 50%; }
.mini-ring i {
  position: relative; z-index: 1; font-style: normal;
  font-size: .76rem; font-weight: 800; color: var(--navy);
}
.mini-lab { font-size: .74rem; color: var(--muted); }

.ov-base-list { display: flex; flex-direction: column; gap: 6px; }
.bl { display: flex; justify-content: space-between; font-size: .84rem; color: var(--ink); }
.bl em { font-style: normal; color: #67c23a; font-weight: 700; }

/* 快捷入口 */
.quick-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
.quick {
  border: 1px solid var(--line); background: #fff; color: var(--navy);
  border-radius: 10px; padding: 10px 16px; font-size: .9rem; font-weight: 600;
  cursor: pointer; transition: all .18s ease; display: inline-flex; align-items: center; gap: 6px;
}
.quick:hover { background: var(--navy); color: #fff; border-color: var(--navy); transform: translateY(-2px); box-shadow: 0 5px 14px rgba(22, 52, 92, .2); }
.q-ic { font-size: 1.05rem; }

@media (max-width: 768px) {
  .ov-grid { grid-template-columns: 1fr; }
  .action { flex-wrap: wrap; }
  .ac-cta { width: 100%; }
  .hero-strip { padding: 18px 20px; }
  .hs-days b { font-size: 2.4rem; }
}
</style>
