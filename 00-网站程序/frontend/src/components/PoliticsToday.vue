<script setup lang="ts">
// 政治 · 今日动作（默认落地页）：打开就知道今天练什么，一屏看完
// 数据三源：错题本(store) + 记忆卡队列(srs) + 考点漏洞地图(vuln-map.json)，全部实时，不写死数字。
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useSrsStore } from '@/stores/srs'
import { useWrongProblemsStore } from '@/stores/wrongProblems'
import { POLITICS_WRONG_SEED } from '@/data/politicsWrongSeed'
import { loadPoliticsVuln, vulnMap, hbCount, hbKey, initHandbookProgress } from '@/data/politicsVuln'

const PoliticsPlaybook = defineAsyncComponent(() => import('@/components/PoliticsPlaybook.vue'))
const PoliticsRoadmap = defineAsyncComponent(() => import('@/components/PoliticsRoadmap.vue'))

const router = useRouter()
const srs = useSrsStore()
const wp = useWrongProblemsStore()
const problems = wp.bind('politics', POLITICS_WRONG_SEED)

const m = computed(() => vulnMap.value)
const unmastered = computed(() => problems.value.filter(p => !p.mastered))
const due = computed(() => srs.politicsDueCount)
const cardsTotal = computed(() => srs.politicsTotalCount)
const matured = computed(() => srs.politicsMatureCount)

// 手册抄写进度（417 条清单里已抄了多少）
const hbStat = computed(() => {
  if (!m.value) return { done: 0, total: 0 }
  const keys: string[] = []
  m.value.handbook.forEach(n => n.marks.forEach(x => keys.push(hbKey(n.subject, n.node, x.mark))))
  return hbCount(keys)
})

// 一刷失分结构（真实字母统计，不是猜的）
const causeBars = computed(() => {
  if (!m.value) return []
  const raw = m.value.meta.causes
  const SHORT: Record<string, string> = {
    '单选·两个"看着都对"的项选反了（定位词/帽子没扣准）': '单选 · 定位混淆',
    '多选·贪多：把干扰项也选上了（错选）': '多选 · 贪多错选',
    '多选·漏选：成套结论没记全，正确的不敢选': '多选 · 漏选',
    '多选·又多又漏：该考点整体框架没建立起来': '多选 · 又多又漏'
  }
  const HEX: Record<string, string> = {
    '单选 · 定位混淆': '#e6a23c', '多选 · 贪多错选': '#f56c6c',
    '多选 · 漏选': '#409eff', '多选 · 又多又漏': '#909399'
  }
  const list = Object.entries(raw).map(([k, v]) => ({ label: SHORT[k] || k, count: v as number, hex: HEX[SHORT[k]] || '#909399' }))
  const max = Math.max(1, ...list.map(x => x.count))
  return list.sort((a, b) => b.count - a.count).map(x => ({ ...x, pct: Math.round(x.count / max * 100) }))
})

// TOP 顽固考点簇（≥2 题），直接给出可点入口
const topGroups = computed(() => {
  if (!m.value) return []
  return [...m.value.groups].filter(g => g.hot).sort((a, b) => b.count - a.count).slice(0, 10)
})
const hotGroupCount = computed(() => (m.value ? m.value.groups.filter(g => g.hot).length : 0))
const goGroup = (g: { subject: string; chapter: string; group: string }) =>
  router.push({ path: '/politics', query: { tab: 'vuln', sub: g.subject, chap: g.chapter, kw: g.group } })

// 二轮优先章（错题最集中的前 6 章）
const hotChapters = computed(() => {
  if (!m.value) return []
  return [...m.value.chapters].sort((a, b) => b.total - a.total).slice(0, 6)
})

// 当前阶段（与「我的打法」同一套日期口径）
const today = new Date()
const ymd = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
const PHASES = [
  { until: '2026-11-09', span: '现在 → 11月初', title: '选择题攻坚', focus: '肖1000 二刷错题 + 真题选择题 + 帽子题判断法' },
  { until: '2026-11-30', span: '11月中 → 11月底', title: '肖八 + 背诵手册精读', focus: '肖八选择题刷到全对；背诵手册第①遍（旱区大题保险）' },
  { until: '2026-12-19', span: '12月 → 考前', title: '肖四保命盘', focus: '肖四 4×4 全文背诵，每天大声背 1h；错题只看不练' },
]
const phaseIdx = computed(() => {
  const i = PHASES.findIndex(p => ymd <= p.until)
  return i < 0 ? PHASES.length - 1 : i
})
const phase = computed(() => PHASES[phaseIdx.value])

// 今日清单（勾选存本地，给"今天这一小时"用）
const LS_TODO = 'politics-today-todo-v1'
type Route = { path: string; query?: Record<string, string> }
type Todo = { k: string; label: string; to?: Route }
const todos = ref<Todo[]>([])
const checked = ref<Record<string, boolean>>({})

// 距初试（12-19）还剩几天 → 把 483 条手册标注均摊成每天啃得动的量
const EXAM_DAY = new Date(2026, 11, 19)
const daysLeft = computed(() => Math.max(1, Math.ceil((EXAM_DAY.getTime() - today.getTime()) / 86400000)))
const hbDaily = computed(() => {
  const left = hbStat.value.total - hbStat.value.done
  if (left <= 0) return 0
  return Math.max(5, Math.min(25, Math.ceil(left / daysLeft.value)))
})
// 到期卡太多时给个"今天先刷前 N 张"的口子，避免一看 95 张就直接放弃
const srsDaily = computed(() => (due.value > 40 ? 40 : due.value))

function buildTodos() {
  const list: Todo[] = [
    {
      k: 'srs',
      label: due.value
        ? `刷记忆卡：今日到期 ${due.value} 张，先刷前 ${srsDaily.value} 张（顽固簇 + 成套结论）`
        : '今日记忆卡已刷完（可提前刷新卡）',
      to: { path: '/srs', query: { pool: 'politics-vuln' } }
    },
    {
      k: 'vuln',
      label: topGroups.value.length ? `攻 1 个顽固簇：「${topGroups.value[0].group}」（一刷错 ${topGroups.value[0].count} 次）` : '攻顽固考点簇',
      to: { path: '/politics', query: { tab: 'vuln' } }
    },
    {
      k: 'hb',
      label: hbStat.value.total - hbStat.value.done > 0
        ? `手册标注推进 ${hbDaily.value} 条/天（剩 ${hbStat.value.total - hbStat.value.done} 条 · 距初试 ${daysLeft.value} 天）`
        : `手册标注 ${hbStat.value.total} 条全部抄完 ✓`,
      to: { path: '/politics', query: { tab: 'vuln', view: 'handbook' } }
    },
    {
      k: 'back',
      label: unmastered.value.length ? `错题回炉 3-5 题，做对 2 次自动毕业（当前未掌握 ${unmastered.value.length}）` : '错题已全部毕业，改为刷真题选择题',
      to: { path: '/politics', query: { tab: 'practice' } }
    },
    { k: 'main', label: `主线：${phase.value.focus}`, to: { path: '/politics', query: { tab: 'terms' } } }
  ]
  todos.value = list
  try {
    const raw = localStorage.getItem(LS_TODO)
    if (raw) { const o = JSON.parse(raw); if (o.ymd === ymd) checked.value = o.checked || {} }
    else checked.value = {}
  } catch { checked.value = {} }
}
function toggle(k: string) {
  checked.value[k] = !checked.value[k]
  try { localStorage.setItem(LS_TODO, JSON.stringify({ ymd, checked: checked.value })) } catch { /* noop */ }
}
const doneCount = computed(() => Object.values(checked.value).filter(Boolean).length)

onMounted(async () => {
  initHandbookProgress()
  srs.init()
  await Promise.all([loadPoliticsVuln(), srs.seedPolitics().catch(() => 0)])
  buildTodos()
})
</script>

<template>
  <div class="td">
    <!-- 今日一句话 -->
    <div class="td-hero">
      <div class="td-kicker">POLITICS · TODAY · {{ ymd }}</div>
      <h2 class="td-title">
        今天政治这一小时：<b>{{ phase.title }}</b>
      </h2>
      <p class="td-sub">
        阶段 {{ phaseIdx + 1 }}/3（{{ phase.span }}）｜{{ phase.focus }}
      </p>
      <div class="td-nums">
        <span><b>{{ due }}</b>张记忆卡到期</span>
        <span><b>{{ unmastered.length }}</b>道未掌握错题</span>
        <span><b>{{ hotGroupCount }}</b>个顽固簇</span>
        <span><b>{{ hbStat.done }}/{{ hbStat.total }}</b>条手册标注</span>
      </div>
    </div>

    <!-- 今日清单 -->
    <section class="td-card">
      <h3 class="td-h">✅ 今日清单（{{ doneCount }}/{{ todos.length }}）</h3>
      <ul class="todo">
        <li v-for="t in todos" :key="t.k" :class="{ on: checked[t.k] }">
          <label>
            <input type="checkbox" :checked="!!checked[t.k]" @change="toggle(t.k)" />
            <span class="todo-txt">{{ t.label }}</span>
          </label>
          <router-link v-if="t.to" class="todo-go" :to="t.to">去做 →</router-link>
        </li>
      </ul>
    </section>

    <!-- 一刷失分结构 + TOP 顽固簇 -->
    <div class="td-two">
      <section class="td-card">
        <h3 class="td-h">🩺 一刷失分结构（{{ m?.meta.total ?? '—' }} 题真实字母统计）</h3>
        <div v-for="c in causeBars" :key="c.label" class="cb-row">
          <span class="cb-label">{{ c.label }}</span>
          <span class="cb-bar"><i :style="{ width: c.pct + '%', background: c.hex }"></i></span>
          <span class="cb-n">{{ c.count }}</span>
        </div>
        <p v-if="m" class="cb-foot">
          漏选 <b>{{ m.meta.missTotal }}</b> 人次 · 错选 <b>{{ m.meta.extraTotal }}</b> 人次 ——
          <template v-if="m.meta.extraTotal >= m.meta.missTotal">
            错选多于漏选，说明瓶颈是<b>干扰项识别</b>，不是背诵量。
          </template>
          <template v-else>
            漏选多于错选，说明瓶颈是<b>成套结论记不全</b>，先把清单补全再判断。
          </template>
        </p>
      </section>

      <section class="td-card">
        <h3 class="td-h">🔥 TOP 顽固考点簇（点开直达）</h3>
        <ol class="top">
          <li v-for="g in topGroups" :key="g.key" @click="goGroup(g)">
            <span class="top-n">×{{ g.count }}</span>
            <span class="top-g">{{ g.group }}</span>
            <span class="top-c">{{ g.chapter }}</span>
          </li>
        </ol>
        <h4 class="td-h4">二轮优先章</h4>
        <div class="chap-row">
          <router-link v-for="c in hotChapters" :key="c.chapter" class="chap" :to="`/politics?tab=vuln&sub=${c.subject}&chap=${c.chapter}`">
            {{ c.chapter }} <b>{{ c.total }}</b><em>漏{{ c.miss }} 错{{ c.extra }}</em>
          </router-link>
        </div>
      </section>
    </div>

    <!-- 记忆卡队列状态 -->
    <section class="td-card slim">
      <h3 class="td-h">🔁 记忆卡队列（Leitner 5 盒）</h3>
      <div class="srs-row">
        <span>政治卡共 <b>{{ cardsTotal }}</b> 张</span>
        <span>今日到期 <b>{{ due }}</b></span>
        <span>已达 4 盒以上（稳） <b>{{ matured }}</b></span>
        <router-link class="td-btn" to="/srs?pool=politics-vuln">开始刷 →</router-link>
        <router-link class="td-btn ghost" to="/srs?pool=politics-set">成套结论默写 →</router-link>
      </div>
      <p class="td-note">
        顽固簇卡（politics-vuln）＝同一考点一刷错 ≥2 题；成套结论卡（politics-set）＝多选漏选 ≥2 个字母。
        答"忘了"回 1 盒（明天再见），答对逐级升盒，1 /2/4/7/14 天间隔。
      </p>
    </section>

    <!-- 折叠：我的打法 + 路线图 -->
    <details class="fold">
      <summary>🎯 我的打法（病灶处方 / 阶段计划 / 旱区背诵手册打卡）</summary>
      <PoliticsPlaybook class="fold-in" />
    </details>
    <details class="fold">
      <summary>🗺️ 备考路线图（三阶段 + 课程对账）</summary>
      <PoliticsRoadmap class="fold-in" />
    </details>
  </div>
</template>

<style scoped>
.td {
  --td-ink: #1f2d3d; --td-body: #303133; --td-muted: #5b6b7f;
  --td-gold: #ffc53d; --td-navy: #16345c; --td-deep: #0d2137;
  --td-coral: #e8604c; --td-green: #2e9e6b; --td-line: #e4ebf3; --td-soft: #f5f8fc;
  --font-mono: 'JetBrains Mono', monospace;
  display: flex; flex-direction: column; gap: 16px; color: var(--td-body);
}
.td-hero { background: linear-gradient(150deg, var(--td-deep), var(--td-navy) 70%, #1e4576); border-radius: 16px; padding: 22px 26px; color: #fff; }
.td-kicker { font-family: var(--font-mono); font-size: .7rem; letter-spacing: .2em; color: var(--td-gold); }
.td-title { margin: 8px 0 6px; font-size: clamp(1.2rem, 2.4vw, 1.6rem); font-weight: 800; }
.td-title b { color: var(--td-gold); }
.td-sub { margin: 0; color: #c3d3e6; font-size: .88rem; }
.td-nums { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 14px; }
.td-nums span { font-size: .78rem; color: #cfe0f2; background: rgba(255, 255, 255, .08); border: 1px solid rgba(255, 197, 61, .25); border-radius: 999px; padding: 5px 13px; }
.td-nums b { font-family: var(--font-mono); color: var(--td-gold); font-size: .95rem; margin-right: 5px; }

.td-card { border: 1px solid var(--td-line); border-radius: 14px; background: #fff; padding: 18px 22px; }
.td-card.slim { padding: 16px 22px; }
.td-h { margin: 0 0 12px; font-size: 1.02rem; color: var(--td-ink); padding-left: 10px; border-left: 4px solid var(--td-gold); }
.td-h4 { margin: 16px 0 8px; font-size: .9rem; color: var(--td-navy); }
.td-two { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; }

.todo { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.todo li { display: flex; align-items: center; gap: 10px; border: 1px solid var(--td-line); border-radius: 10px; padding: 9px 12px; background: var(--td-soft); }
.todo li.on { opacity: .55; background: #eef6ef; border-color: rgba(46, 158, 107, .35); }
.todo li label { display: flex; align-items: center; gap: 10px; flex: 1; cursor: pointer; }
.todo li input { accent-color: var(--td-green); }
.todo-txt { font-size: .9rem; line-height: 1.6; }
.todo-go { font-size: .78rem; font-weight: 700; color: var(--td-navy); text-decoration: none; border-bottom: 1px dotted var(--td-navy); white-space: nowrap; }

.cb-row { display: grid; grid-template-columns: 120px 1fr 40px; gap: 10px; align-items: center; margin-bottom: 8px; }
.cb-label { font-size: .82rem; color: var(--td-ink); }
.cb-bar { height: 9px; background: #eef2f7; border-radius: 5px; overflow: hidden; }
.cb-bar i { display: block; height: 100%; border-radius: 5px; transition: width .5s; }
.cb-n { font-family: var(--font-mono); font-size: .84rem; font-weight: 700; color: var(--td-coral); text-align: right; }
.cb-foot { margin: 10px 0 0; font-size: .82rem; color: var(--td-muted); line-height: 1.7; }
.cb-foot b { color: var(--td-navy); }

.top { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 6px; }
.top li { display: grid; grid-template-columns: 44px 1fr auto; gap: 8px; align-items: baseline; cursor: pointer; border: 1px solid var(--td-line); border-radius: 9px; padding: 7px 10px; background: #fff; }
.top li:hover { border-color: var(--td-coral); background: #fff8f7; }
.top-n { font-family: var(--font-mono); font-weight: 800; font-size: .82rem; color: #fff; background: var(--td-coral); border-radius: 6px; text-align: center; }
.top-g { font-size: .88rem; color: var(--td-ink); font-weight: 700; }
.top-c { font-size: .72rem; color: var(--td-muted); }
.chap-row { display: flex; flex-wrap: wrap; gap: 8px; }
.chap { text-decoration: none; border: 1px solid var(--td-line); border-radius: 9px; padding: 6px 10px; background: var(--td-soft); font-size: .8rem; color: var(--td-ink); }
.chap b { font-family: var(--font-mono); color: var(--td-coral); margin: 0 5px; }
.chap em { font-style: normal; font-size: .72rem; color: var(--td-muted); }
.chap:hover { border-color: var(--td-gold); }

.srs-row { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; font-size: .88rem; color: var(--td-body); }
.srs-row b { font-family: var(--font-mono); color: var(--td-navy); margin-left: 4px; }
.td-btn { margin-left: auto; text-decoration: none; font-size: .84rem; font-weight: 700; color: #fff; background: linear-gradient(135deg, var(--td-navy), #1e4576); border-radius: 9px; padding: 8px 16px; }
.td-btn.ghost { background: #fff; color: var(--td-navy); border: 1px solid var(--td-navy); margin-left: 0; }
.td-btn:hover { box-shadow: 0 6px 16px rgba(22, 52, 92, .26); }
.td-note { margin: 10px 0 0; font-size: .8rem; color: var(--td-muted); line-height: 1.7; }

.fold { border: 1px solid var(--td-line); border-radius: 14px; background: #fff; padding: 4px 18px; }
.fold summary { cursor: pointer; font-size: .98rem; font-weight: 700; color: var(--td-navy); padding: 12px 0; }
.fold[open] { padding-bottom: 18px; }
.fold-in { margin-top: 6px; }

@media (max-width: 768px) {
  .td-hero { padding: 18px 16px; }
  .td-card { padding: 14px 14px; }
  .cb-row { grid-template-columns: 96px 1fr 34px; }
  .srs-row { gap: 10px; }
  .td-btn { margin-left: 0; }
}
</style>
