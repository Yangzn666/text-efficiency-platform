<script setup lang="ts">
// 今日回炉总账 · 把散在磁盘上的 8 套复习队列汇成一份「今天该还的债」
// 数据由 npm run sync:queues 生成（scripts/sync-review-queues.mjs），只读展示 + 本地销账
import { ref, computed, onMounted } from 'vue'
import {
  loadReviewQueues, loading, error, payload,
  dueItems, upcomingItems, dueCount, dueBySubject, subjectChips,
  worstOverdue, highSeverityCount, overview, sources, staleSources,
  preExam, todayPlan, budget, generatedAt, daysToExam, priorityScore,
  isQueueDone, toggleQueueDone, clearQueueToday, doneTodayCount,
  undoneDueCount, DAILY_QUOTA, backlogDays,
  type QueueItem
} from '@/data/reviewQueues'
import { useSrsStore } from '@/stores/srs'
import { useWrongProblemsStore } from '@/stores/wrongProblems'

const subjectFilter = ref('全部')
const srcFilter = ref('all')
const onlyHigh = ref(false)
const keyword = ref('')
const showUpcoming = ref(false)
const showPreExam = ref(false)

const srs = useSrsStore()
const wp = useWrongProblemsStore()

onMounted(() => {
  loadReviewQueues()
  // 记忆卡/错题本播种只是给数字条补两个参考值，慢也不该挡住主数据
  srs.init()
  srs.seedPolitics().catch(() => {})
  // 错题本 getter 不会自己读 localStorage，必须显式 init，否则「站内未掌握」恒为 0
  wp.init()
})

const isDone = isQueueDone
const toggleDone = toggleQueueDone
const doneToday = doneTodayCount
const clearToday = clearQueueToday

const visible = computed<QueueItem[]>(() => {
  let list = dueItems.value
  if (subjectFilter.value !== '全部') list = list.filter(i => i.subject === subjectFilter.value)
  if (srcFilter.value !== 'all') list = list.filter(i => i.src === srcFilter.value)
  if (onlyHigh.value) list = list.filter(i => i.severity === 'high')
  const k = keyword.value.trim().toLowerCase()
  if (k) {
    list = list.filter(i =>
      (i.title || '').toLowerCase().includes(k) ||
      (i.branch || '').toLowerCase().includes(k) ||
      (i.causes || []).join(' ').toLowerCase().includes(k) ||
      (i.srcLabel || '').toLowerCase().includes(k)
    )
  }
  return list
})
// 每日配额：默认只摊前 40 条（优先级最高），其余折进积压区
const showAllBacklog = ref(false)
const shownList = computed(() =>
  showAllBacklog.value ? visible.value : visible.value.slice(0, DAILY_QUOTA)
)
const hiddenBacklog = computed(() => Math.max(0, visible.value.length - DAILY_QUOTA))
const backlogDaysText = computed(() => (backlogDays.value > 1 ? `${backlogDays.value} 天` : '1 天内'))

const remaining = computed(() => visible.value.filter(i => !isDone(i.id)).length)

const srcOptions = computed(() => {
  const m = new Map<string, string>()
  dueItems.value.forEach(i => m.set(i.src, i.srcLabel))
  return [{ key: 'all', label: '全部来源' }, ...[...m].map(([key, label]) => ({ key, label }))]
})

const sevLabel = (s?: string) => (s === 'high' ? '高危' : s === 'low' ? '低' : '中')
const overdueText = (n?: number | null) =>
  n === null || n === undefined ? '未排期' : n >= 0 ? `逾期 ${n} 天` : `${-n} 天后`

// 站内自己的到期量（记忆卡 + 未掌握错题），和磁盘队列并排看，才知道总欠账
// 注意：srs.cards 是 id→卡片 的字典（不是数组），这里直接用 store 的 dueCount/totalCount，
// 保证与「🧠 记忆卡」页面的到期口径一致（同一套 todayStr + box>=1 判定）。
const siteDue = computed(() => {
  const due = srs.dueCount
  const pending = wp.unmasteredCount
  return { due, total: srs.totalCount, pending }
})

const planStatus = (s?: string) =>
  s?.startsWith('done') ? 'ok' : s === 'wrong' || s?.startsWith('slip') ? 'bad' : 'todo'
</script>

<template>
  <div class="rq">
    <section class="rq-hero">
      <div class="hero-grid" />
      <span class="rq-kicker">REVIEW QUEUE · 全队列到期总账</span>
      <h2 class="rq-title">今日回炉总账</h2>
      <p class="rq-note">
        数学刷题调度、透视诊断、费曼缺口、睡前口答、长难句、作文背诵/模板、408 选择题轮次——
        这 8 套队列各自记着自己的到期日，以前只有电脑上的脚本看得见。这一页把它们汇成一张账，
        手机上打开就知道今天到底欠了多少条复习。
        <br>到期几百条一次性摊开等于没摊：默认只按优先级摊出 <b>今日前 {{ DAILY_QUOTA }} 条</b>，
        剩下的记作积压并估算几天能清完，想看全量点「展开积压」。
        <em v-if="generatedAt">数据同步于 {{ generatedAt }}<template v-if="daysToExam !== null"> · 距初试 {{ daysToExam }} 天</template></em>
      </p>
    </section>

    <div v-if="loading" class="rq-tip">读取队列数据…</div>
    <div v-else-if="error || !payload" class="rq-tip bad">
      读不到 <code>data/queues/review-queues.json</code>（{{ error || '空' }}）。
      在电脑上前台跑一次 <code>npm run sync:queues</code> 再 push 即可。
    </div>

    <template v-else>
      <div class="rq-strip">
        <div class="rq-stat coral"><strong>{{ undoneDueCount }}</strong><span>今日待还</span></div>
        <div class="rq-stat"><strong>{{ dueCount }}</strong><span>到期总量</span></div>
        <div class="rq-stat"><strong>{{ doneToday }}</strong><span>今日已销</span></div>
        <div class="rq-stat coral"><strong>{{ worstOverdue }}</strong><span>最长逾期(天)</span></div>
        <div class="rq-stat"><strong>{{ highSeverityCount }}</strong><span>高危项</span></div>
        <div class="rq-stat" v-for="(n, s) in dueBySubject" :key="s"><strong>{{ n }}</strong><span>{{ s }}</span></div>
        <div class="rq-stat gold"><strong>{{ siteDue.due }}</strong><span>记忆卡到期</span></div>
        <div class="rq-stat gold"><strong>{{ siteDue.pending }}</strong><span>站内未掌握</span></div>
      </div>

      <!-- 今日排程（数一刷题调度已排好的顺序） -->
      <section v-if="todayPlan" class="rq-card">
        <h3 class="rq-h3">📋 {{ todayPlan.subjectLabel }}今日排程 <small>{{ todayPlan.date }} · {{ todayPlan.items.length }} 项</small></h3>
        <div class="plan-list">
          <div v-for="p in todayPlan.items" :key="p.ord" class="plan" :class="planStatus(p.status)">
            <span class="pl-ord">{{ p.ord }}</span>
            <div class="pl-main">
              <div class="pl-title">{{ p.title }}<small v-if="p.branch"> · {{ p.branch }}</small></div>
              <div class="pl-meta">{{ p.mode }}<template v-if="p.why"> · {{ p.why }}</template></div>
            </div>
            <span class="pl-badge">{{ p.status === 'todo' ? '待刷' : p.status }}</span>
          </div>
        </div>
      </section>

      <!-- 时间预算 -->
      <section v-if="budget && budget.alloc" class="rq-card">
        <h3 class="rq-h3">⏱ 每日时间预算 <small>刷题调度口径 {{ budget.dailyMinutes }} 分钟</small></h3>
        <div class="alloc">
          <div v-for="(mins, k) in budget.alloc" :key="k" class="alloc-item">
            <span class="ai-name">{{ k }}</span>
            <span class="ai-bar"><i :style="{ width: (mins / (budget.dailyMinutes || 420) * 100) + '%' }" /></span>
            <span class="ai-num">{{ mins }}′</span>
          </div>
        </div>
        <p class="rq-foot-note">
          间隔阶梯 {{ (budget.intervalLadder || []).join('→') }} 天
          <template v-if="budget.amnesty"> · {{ budget.amnesty.date }} 起进入特赦期（连对 {{ budget.amnesty.threshold }} 次即毕业，不再派 7 天后重测，防止考前到期量爆炸）</template>
        </p>
      </section>

      <!-- 到期清单 -->
      <section class="rq-card">
        <div class="rq-tools">
          <div class="chips">
            <button :class="{ on: subjectFilter === '全部' }" @click="subjectFilter = '全部'">全部</button>
            <button v-for="s in subjectChips" :key="s" :class="{ on: subjectFilter === s }" @click="subjectFilter = s">{{ s }} ({{ dueBySubject[s] }})</button>
          </div>
          <div class="rq-tools-r">
            <select v-model="srcFilter" class="rq-sel">
              <option v-for="o in srcOptions" :key="o.key" :value="o.key">{{ o.label }}</option>
            </select>
            <label class="rq-chk"><input v-model="onlyHigh" type="checkbox" />只看高危</label>
            <input v-model="keyword" class="rq-inp" placeholder="搜考点 / 错因 / 来源" />
          </div>
        </div>
        <div class="rq-listhead">
          <span>
            今日配额 <b class="lh-hot">{{ shownList.length }}</b> 条（优先级前 {{ DAILY_QUOTA }}）
            · 筛选下共 {{ visible.length }} 条 · 未销账 {{ remaining }} 条 · 今日已销 {{ doneToday }} 条
          </span>
          <div>
            <button v-if="hiddenBacklog" class="rq-mini hot" @click="showAllBacklog = !showAllBacklog">
              {{ showAllBacklog ? '收回今日配额' : `展开积压 ${hiddenBacklog} 条` }}
              <template v-if="!showAllBacklog">（按每天 {{ DAILY_QUOTA }} 条约 {{ backlogDaysText }}清完）</template>
            </button>
            <button class="rq-mini" @click="clearToday">重置今日销账</button>
            <button v-if="upcomingItems.length" class="rq-mini" @click="showUpcoming = !showUpcoming">
              {{ showUpcoming ? '收起' : '看' }}未到期 {{ upcomingItems.length }} 条
            </button>
          </div>
        </div>

        <p v-if="!visible.length" class="rq-tip good">这个筛选下没有到期项——去别的科目或关掉「只看高危」。</p>

        <div class="q-list">
          <div v-for="it in shownList" :key="it.id" class="q" :class="[{ ok: isDone(it.id) }, it.severity]">
            <button class="q-box" :class="{ on: isDone(it.id) }" :title="isDone(it.id) ? '撤销销账' : '今天已处理，销账'" @click="toggleDone(it.id)">
              {{ isDone(it.id) ? '✓' : '' }}
            </button>
            <div class="q-main">
              <div class="q-top">
                <span class="q-sev" :class="it.severity">{{ sevLabel(it.severity) }}</span>
                <span class="q-title">{{ it.title }}</span>
              </div>
              <div class="q-meta">
                <span class="q-sub">{{ it.subject }}<template v-if="it.branch"> · {{ it.branch }}</template></span>
                <span class="q-src">{{ it.srcLabel }}{{ it.kind ? ' · ' + it.kind : '' }}{{ it.tier ? ' · ' + it.tier + '档' : '' }}</span>
                <span class="q-due" :class="{ od: (it.overdue ?? 0) >= 0 }">{{ overdueText(it.overdue) }}</span>
                <span v-if="it.linked" class="q-link">关联 {{ it.linked }} 题</span>
                <span class="q-pri" :title="'优先级分 = 严重度 × 逾期压力 × 关联错题量'">分 {{ priorityScore(it).toFixed(2) }}</span>
              </div>
              <ul v-if="it.causes && it.causes.length" class="q-cause">
                <li v-for="(c, i) in it.causes" :key="i">{{ c }}</li>
              </ul>
              <p v-if="it.answer" class="q-ans">答案锚点：{{ it.answer }}</p>
            </div>
          </div>
        </div>

        <div v-if="showUpcoming" class="q-list upcoming">
          <div v-for="it in upcomingItems" :key="'u' + it.id" class="q">
            <div class="q-main">
              <div class="q-top"><span class="q-title dim">{{ it.title }}</span></div>
              <div class="q-meta">
                <span class="q-sub">{{ it.subject }} · {{ it.srcLabel }}</span>
                <span class="q-due">{{ overdueText(it.overdue) }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 队列概览 -->
      <section class="rq-card">
        <h3 class="rq-h3">🧮 各队列存量 <small>左=总量 · 右=欠账</small></h3>
        <div class="ov-grid">
          <component :is="o.href ? 'a' : 'div'" v-for="o in overview" :key="o.key" class="ov" :class="{ stale: (sources.find(s => s.key === o.key)?.ageDays ?? 0) > 14 }" :href="o.href || undefined">
            <div class="ov-name">{{ o.label }}</div>
            <div class="ov-num"><b>{{ o.total }}</b><span>/</span><i>{{ o.left }}</i><em>{{ o.unit }}</em></div>
            <div class="ov-hint">{{ o.hint }}</div>
            <div v-if="(sources.find(s => s.key === o.key)?.ageDays ?? 0) > 14" class="ov-stale">
              {{ sources.find(s => s.key === o.key)?.ageDays }} 天没更新，可能已停练
            </div>
          </component>
        </div>
        <div v-if="staleSources.length" class="rq-foot-note bad">
          陈旧队列：{{ staleSources.map(s => `${s.label}(${s.ageDays}天)`).join('、') }}——要么恢复，要么明确停掉，别让它们继续占你的心理负债。
        </div>
      </section>

      <!-- 考前最后一晚 -->
      <section class="rq-card">
        <h3 class="rq-h3 click" @click="showPreExam = !showPreExam">
          🌙 考前最后一晚清单 <small>{{ preExam.length }} 条 · {{ showPreExam ? '收起' : '展开' }}</small>
        </h3>
        <p v-if="!showPreExam" class="rq-foot-note">
          来源：数一刷题调度的「考前提醒」（错题里反复出现的计算/审题坑）+ 睡前口答的明日聚焦。
          12 月 15 日之后每天睡前扫一遍，不新学任何东西。
        </p>
        <div v-else class="pe-list">
          <div v-for="(p, i) in preExam" :key="i" class="pe">
            <span class="pe-tag">{{ p.subject }}</span>
            <span class="pe-cause">{{ p.cause }}</span>
            <span class="pe-text">{{ p.text }}</span>
          </div>
        </div>
      </section>

      <p class="rq-how">
        这页只读不改你磁盘上的状态：销账记录存在本机浏览器（<code>review-queue-done-v1</code>），
        第二天自动清零。要让队列往前走，还是在电脑上跑带刷；改完 state.json 后
        <code>npm run sync:queues</code> + push，手机上就是新的。
      </p>
    </template>
  </div>
</template>

<style scoped>
.rq { padding: 4px 0 24px; }

/* hero */
.rq-hero {
  position: relative; overflow: hidden;
  background: linear-gradient(150deg, #10294a 0%, #16345c 60%, #1e4576 100%);
  color: #fff; border-radius: 14px; padding: 18px 18px 20px; margin-bottom: 14px;
}
.hero-grid {
  position: absolute; inset: 0; opacity: .14;
  background-image: linear-gradient(rgba(255, 255, 255, .25) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, .25) 1px, transparent 1px);
  background-size: 26px 26px;
}
.rq-kicker { position: relative; font-size: .72em; letter-spacing: .16em; color: #ffc53d; font-weight: 700; }
.rq-title { position: relative; margin: 6px 0 8px; font-size: 1.6em; font-weight: 800; }
.rq-note { position: relative; margin: 0; font-size: .86em; line-height: 1.75; color: #dce7f5; max-width: 78ch; }
.rq-note em { display: block; margin-top: 6px; font-style: normal; color: #ffc53d; font-size: .92em; }
.rq-note b { color: #ffc53d; font-weight: 800; }

/* stats */
.rq-strip { display: grid; grid-template-columns: repeat(auto-fit, minmax(104px, 1fr)); gap: 8px; margin-bottom: 14px; }
.rq-stat { background: #16345c; color: #fff; border-radius: 11px; padding: 10px 8px; text-align: center; }
.rq-stat.coral { background: #b6402f; }
.rq-stat.gold { background: #6b5310; }
.rq-stat strong { display: block; font-size: 1.35em; line-height: 1.2; }
.rq-stat span { display: block; font-size: .72em; opacity: .86; margin-top: 2px; }

/* cards */
.rq-card { background: #fff; border: 1px solid #e3e8ef; border-radius: 14px; padding: 14px; margin-bottom: 14px; }
.rq-h3 { margin: 0 0 10px; font-size: 1.02em; color: #16345c; font-weight: 800; }
.rq-h3 small { font-weight: 500; color: #8a94a3; font-size: .74em; margin-left: 6px; }
.rq-h3.click { cursor: pointer; }
.rq-tip { padding: 16px; border-radius: 12px; background: #eef2f8; color: #5a6472; font-size: .9em; margin-bottom: 14px; }
.rq-tip.bad { background: #fdecea; color: #b6402f; }
.rq-tip.good { background: #e9f7ef; color: #1f7a4d; }
.rq-foot-note { margin: 10px 0 0; font-size: .8em; color: #7a848f; line-height: 1.6; }
.rq-foot-note.bad { color: #b6402f; }
.rq-how { font-size: .78em; color: #8a94a3; line-height: 1.7; padding: 0 4px; }
.rq-how code, .rq-tip code { background: #f1f4f9; padding: 1px 5px; border-radius: 5px; color: #b6402f; }

/* plan */
.plan-list { display: grid; gap: 6px; }
.plan { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 10px; background: #f7f9fc; border-left: 3px solid #c8d2e0; }
.plan.ok { border-left-color: #2e9e6b; }
.plan.bad { border-left-color: #e8604c; }
.plan.todo { border-left-color: #409eff; }
.pl-ord { width: 22px; height: 22px; flex: none; border-radius: 50%; background: #16345c; color: #fff; font-size: .74em; font-weight: 700; display: grid; place-items: center; }
.pl-main { flex: 1; min-width: 0; }
.pl-title { font-size: .9em; font-weight: 700; color: #22314a; }
.pl-title small { font-weight: 500; color: #8a94a3; }
.pl-meta { font-size: .76em; color: #7a848f; margin-top: 2px; }
.pl-badge { font-size: .7em; color: #5a6472; background: #fff; border: 1px solid #e3e8ef; border-radius: 999px; padding: 2px 8px; flex: none; }

/* budget */
.alloc { display: grid; gap: 7px; }
.alloc-item { display: grid; grid-template-columns: 88px 1fr 44px; align-items: center; gap: 8px; font-size: .82em; }
.ai-name { color: #22314a; font-weight: 600; }
.ai-bar { height: 9px; border-radius: 999px; background: #eef2f8; overflow: hidden; }
.ai-bar i { display: block; height: 100%; background: linear-gradient(90deg, #16345c, #409eff); border-radius: 999px; }
.ai-num { color: #7a848f; text-align: right; }

/* tools */
.rq-tools { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chips button { border: 1px solid #dfe5ee; background: #fff; color: #5a6472; border-radius: 999px; padding: 4px 11px; font-size: .8em; cursor: pointer; }
.chips button.on { background: #16345c; color: #fff; border-color: #16345c; }
.rq-tools-r { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.rq-sel, .rq-inp { border: 1px solid #dfe5ee; border-radius: 8px; padding: 4px 8px; font-size: .8em; color: #3b4757; background: #fff; }
.rq-inp { min-width: 150px; }
.rq-chk { font-size: .78em; color: #5a6472; display: flex; align-items: center; gap: 4px; }
.rq-listhead { display: flex; flex-wrap: wrap; gap: 8px; justify-content: space-between; align-items: center; font-size: .78em; color: #8a94a3; margin-bottom: 8px; }
.rq-mini { border: 1px solid #dfe5ee; background: #fff; color: #5a6472; border-radius: 7px; padding: 3px 9px; font-size: .95em; cursor: pointer; margin-left: 4px; }
.rq-mini.hot { border-color: #f0c9a6; color: #b6402f; background: #fff8f3; font-weight: 600; }
.lh-hot { font-size: 1.25em; color: #b6402f; font-variant-numeric: tabular-nums; }

/* queue list */
.q-list { display: grid; gap: 8px; }
.q { display: flex; gap: 10px; padding: 10px 12px; border-radius: 11px; background: #f8fafc; border: 1px solid #e8edf4; border-left: 3px solid #c8d2e0; }
.q.high { border-left-color: #e8604c; }
.q.mid { border-left-color: #409eff; }
.q.low { border-left-color: #b8c2d0; }
.q.ok { opacity: .48; background: #f1f5f2; border-left-color: #2e9e6b; }
.q-box { width: 22px; height: 22px; flex: none; margin-top: 2px; border-radius: 6px; border: 1.5px solid #c2ccda; background: #fff; color: #fff; font-size: .78em; font-weight: 800; cursor: pointer; line-height: 1; }
.q-box.on { background: #2e9e6b; border-color: #2e9e6b; }
.q-main { flex: 1; min-width: 0; }
.q-top { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
.q-sev { font-size: .66em; font-weight: 800; padding: 1px 6px; border-radius: 999px; background: #eef2f8; color: #7a848f; flex: none; }
.q-sev.high { background: #fdecea; color: #b6402f; }
.q-sev.mid { background: #eaf3ff; color: #2b6cb0; }
.q-title { font-size: .95em; font-weight: 700; color: #22314a; word-break: break-word; }
.q-title.dim { font-weight: 500; color: #8a94a3; }
.q-meta { display: flex; flex-wrap: wrap; gap: 4px 10px; margin-top: 4px; font-size: .74em; color: #8a94a3; }
.q-sub { color: #5a6472; font-weight: 600; }
.q-due.od { color: #b6402f; font-weight: 700; }
.q-link { color: #6b5310; }
.q-pri { color: #aab3bf; }
.q-cause { margin: 6px 0 0; padding-left: 16px; font-size: .78em; color: #5a6472; line-height: 1.6; }
.q-ans { margin: 5px 0 0; font-size: .78em; color: #1f7a4d; }
.upcoming { margin-top: 10px; padding-top: 10px; border-top: 1px dashed #e3e8ef; }

/* overview */
.ov-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px; }
.ov { display: block; text-decoration: none; color: inherit; padding: 10px 12px; border-radius: 11px; background: #f8fafc; border: 1px solid #e8edf4; }
.ov.stale { background: #fbf7f2; border-color: #f0e2d2; }
.ov-name { font-size: .82em; font-weight: 700; color: #22314a; }
.ov-num { margin-top: 3px; font-size: .95em; color: #16345c; }
.ov-num b { font-size: 1.25em; }
.ov-num i { font-style: normal; color: #b6402f; font-weight: 700; }
.ov-num span { margin: 0 4px; color: #c8d2e0; }
.ov-num em { font-style: normal; font-size: .74em; color: #8a94a3; margin-left: 4px; }
.ov-hint { margin-top: 3px; font-size: .72em; color: #8a94a3; line-height: 1.5; }
.ov-stale { margin-top: 4px; font-size: .7em; color: #b07c3c; }

/* pre-exam */
.pe-list { display: grid; gap: 6px; margin-top: 4px; }
.pe { display: flex; gap: 8px; align-items: baseline; font-size: .84em; padding: 7px 10px; border-radius: 9px; background: #f8fafc; }
.pe-tag { flex: none; font-size: .8em; font-weight: 700; color: #16345c; background: #eaf0f8; border-radius: 5px; padding: 1px 6px; }
.pe-cause { flex: none; font-size: .82em; color: #b6402f; }
.pe-text { color: #3b4757; line-height: 1.55; }

@media (max-width: 640px) {
  .rq-title { font-size: 1.32em; }
  .rq-tools { flex-direction: column; align-items: stretch; }
  .rq-tools-r { justify-content: flex-start; }
  .rq-inp { flex: 1; min-width: 0; }
  .alloc-item { grid-template-columns: 76px 1fr 40px; }
  .pe { flex-wrap: wrap; }
}
</style>
