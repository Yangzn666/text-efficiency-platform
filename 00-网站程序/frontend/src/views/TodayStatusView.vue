<template>
  <div class="today-status">
    <!-- ① 倒计时计分牌（页面主角） -->
    <section class="hero">
      <div class="hero-grid" aria-hidden="true"></div>
      <div class="hero-glow" aria-hidden="true"></div>

      <div class="hero-main">
        <div class="hero-count">
          <div class="count-kicker">距 {{ formatExamDate }} 初试</div>
          <div class="count-line">
            <span class="count-num">{{ store.daysToExam }}</span>
            <span class="count-unit">天</span>
          </div>
          <div class="count-sub">后上考场</div>
          <div class="count-underline" aria-hidden="true"></div>
        </div>

        <div class="hero-divider" aria-hidden="true"></div>

        <div class="hero-brief">
          <div class="brief-date">{{ todayLabel }}</div>
          <div class="brief-goal">
            <span class="goal-chip">🎯 浙大海宁 · 电子信息(AI)</span>
            <span class="goal-chip gold">目标 380+</span>
          </div>
          <div class="brief-today">
            <span class="bt-label">今日任务</span>
            <div class="bt-bar">
              <div class="bt-fill" :style="{ width: store.todayProgress + '%' }"></div>
            </div>
            <span class="bt-num">{{ store.todayCompleted }}/{{ store.todayTotal }}</span>
          </div>
        </div>

        <div class="hero-divider" aria-hidden="true"></div>

        <div class="hero-quote">
          <div class="quote-mark" aria-hidden="true">「</div>
          <transition name="quote-fade" mode="out-in">
            <div class="quote-text" :key="quoteIdx">{{ currentQuote }}</div>
          </transition>
        </div>
      </div>

      <div class="hero-prep">
        <span class="prep-label">备考进度</span>
        <div class="prep-track">
          <div class="prep-fill" :style="{ width: store.overallPrep.actual + '%' }"></div>
          <div class="prep-expected" :style="{ left: store.overallPrep.expected + '%' }"></div>
          <div class="prep-marker" :style="{ left: store.overallPrep.actual + '%' }"></div>
        </div>
        <div class="prep-nums">
          <span class="prep-pct">{{ store.overallPrep.actual }}%</span>
          <span class="prep-due">应达 {{ store.overallPrep.expected }}%</span>
        </div>
      </div>
    </section>

    <!-- ② 非对称 Bento 主区 -->
    <div class="bento">
      <!-- 今日任务（宽列） -->
      <section class="card tasks-card">
        <div class="card-head">
          <h2 class="card-title">📋 今日任务</h2>
          <div class="head-right">
            <span class="head-time">⏱ 预计 {{ formatTotal(store.todayTotalMinutes) }} 小时</span>
            <span class="head-badge">{{ store.todayCompleted }}/{{ store.todayTotal }}</span>
          </div>
        </div>
        <div class="task-progress-bar">
          <div class="task-progress-fill" :style="{ width: store.todayProgress + '%' }"></div>
        </div>
        <div class="task-time-summary">
          今日共 {{ store.todayTotal }} 项，预计 {{ formatTotal(store.todayTotalMinutes) }} 小时，
          已完成 {{ formatTotal(store.todayDoneMinutes) }} 小时
        </div>

        <div v-if="store.todayTasks.length === 0" class="empty-hint">
          🎉 所有科目都已完成阶段任务，休息一下吧！
        </div>

        <ul class="task-list">
          <li
            v-for="(task, index) in store.todayTasks"
            :key="task.id"
            class="task-item"
            :class="{ done: task.done }"
            :style="{ '--task-color': task.color, animationDelay: index * 0.045 + 's' }"
            @click="store.toggleTask(task)"
          >
            <span class="checkbox" :class="{ checked: task.done }">
              <span v-if="task.done">✓</span>
            </span>
            <span class="task-tag" :style="{ background: task.color }">{{ task.subjectName }}</span>
            <span class="task-title">{{ task.title }}</span>
            <span class="task-est">{{ formatEst(store.estMinutesOf(task.subject)) }}</span>
          </li>
        </ul>
      </section>

      <!-- 打卡链 -->
      <section class="card chain-card">
        <div class="card-head">
          <h2 class="card-title">🔥 打卡链</h2>
          <div class="streak-box">
            <span class="streak-num">{{ store.streak }}</span>
            <span class="streak-unit">天</span>
          </div>
        </div>

        <div v-if="store.streak === 0 && hadYesterday" class="chain-broken">
          ⚠️ 链断了！今天完成任意一项任务即可重新接上。
        </div>

        <div class="heatmap">
          <div
            v-for="day in store.heatmap"
            :key="day.date"
            class="heatmap-cell"
            :class="heatLevel(day.count)"
            :title="`${day.label}：完成 ${day.count} 项`"
          ></div>
        </div>
        <div class="heatmap-legend">
          <span>近30天</span>
          <span class="legend-cells">
            <span class="heatmap-cell level-0"></span>
            <span class="heatmap-cell level-1"></span>
            <span class="heatmap-cell level-2"></span>
            <span class="heatmap-cell level-3"></span>
          </span>
          <span>少→多</span>
        </div>

        <div class="week-rate">
          <span>本周打卡率</span>
          <strong>{{ store.weekCompletion }}%</strong>
        </div>
      </section>

      <!-- 费曼学习法快捷入口 -->
      <section class="card feynman-card" @click="$router.push('/cs408/feynman')">
        <div class="feynman-inner">
          <span class="feynman-icon">🧠</span>
          <div class="feynman-text">
            <strong>费曼学习法</strong>
            <span>408强化 · AI对话 · 薄弱点追踪</span>
          </div>
          <span class="feynman-arrow">→</span>
        </div>
      </section>

      <!-- 各科进度（全宽计量板） -->
      <section class="card subjects-card">
        <div class="card-head">
          <h2 class="card-title">📊 各科进度</h2>
          <span class="head-hint">实际 vs 应达</span>
        </div>

        <div class="subj-list">
          <div
            v-for="w in store.progressWarnings"
            :key="w.key"
            class="subj-row"
            :style="{ '--sc': w.color }"
          >
            <div class="subj-accent" aria-hidden="true"></div>
            <div class="subj-id">
              <span class="subj-icon">{{ w.icon }}</span>
              <div class="subj-names">
                <span class="subj-name">{{ w.name }}</span>
                <span class="subj-status" :class="w.status">{{ statusText(w.status) }}</span>
              </div>
            </div>
            <div class="subj-pct"><b>{{ w.actual }}</b><i>%</i></div>
            <div class="subj-track">
              <div class="subj-fill" :style="{ width: w.actual + '%', background: w.color }"></div>
              <div class="subj-tick" :style="{ left: w.expected + '%' }"></div>
            </div>
            <div class="subj-meta">
              <span class="subj-target">应达 {{ w.expected }}%</span>
              <span class="subj-units">{{ w.completedUnits }}/{{ w.totalUnits }} 单元</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- ③ 励志标语跑马灯 -->
    <section class="slogan-band" aria-hidden="true">
      <div class="marquee-track">
        <span v-for="(s, i) in [...slogans, ...slogans]" :key="i" class="slogan">{{ s }}</span>
      </div>
    </section>

    <!-- ④ 资料进度墙（全宽折叠） -->
    <section class="card materials-card">
      <div class="card-head clickable" @click="materialsOpen = !materialsOpen">
        <h2 class="card-title">📚 资料进度墙</h2>
        <span class="toggle-hint">{{ materialsOpen ? '▲ 收起' : '▼ 展开' }}</span>
      </div>
      <div v-show="materialsOpen" class="materials-body">
        <MaterialsWall />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTodayStatusStore } from '@/stores/todayStatus'
import MaterialsWall from '@/components/MaterialsWall.vue'

const store = useTodayStatusStore()

// 资料进度墙折叠状态
const materialsOpen = ref(false)

// ---------- 励志语录（6秒轮换） ----------
const quotes = [
  '你现在的努力，是为了让未来的自己不后悔。',
  '把每一天当作冲刺，但用马拉松的节奏呼吸。',
  '完成比完美更重要，先做完再做好。',
  '链断了不可怕，可怕的是不再接上。',
  '今天的你，是昨天所有选择的总和。',
  '别和别人比进度，只和昨天的自己比。',
  '专注25分钟，胜过走神2小时。',
  '考研不是青春的终点，是自律的勋章。',
  '难点章节多花时间是值得的，那才是提分点。',
  '休息也是计划的一部分，别透支明天的精力。'
]
const slogans = [
  '浙大海宁 · 等我上岸',
  '380分 · 势在必得',
  '越努力 越幸运',
  '自律给我自由',
  '坚持到无能为力',
  '拼搏到感动自己',
  '今天的你 比昨天更强',
  '每天进步一点点'
]
const quoteIdx = ref(0)
let quoteTimer = null
const currentQuote = computed(() => quotes[quoteIdx.value % quotes.length])

// ---------- 日期格式化 ----------
const formatExamDate = computed(() => {
  const d = new Date(store.examDate)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
})

const todayLabel = computed(() => {
  const now = new Date()
  const week = ['日', '一', '二', '三', '四', '五', '六'][now.getDay()]
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 · 星期${week}`
})

// ---------- 时长格式化 ----------
/** 单任务预计用时：分钟 → "约45分钟" / "约1.7小时" */
const formatEst = (min) => {
  if (!min) return ''
  if (min < 60) return `约${min}分钟`
  const h = min / 60
  return `约${h % 1 === 0 ? h : h.toFixed(1)}小时`
}
/** 汇总时长：分钟 → 小时数（保留一位小数） */
const formatTotal = (min) => {
  const h = min / 60
  return h % 1 === 0 ? String(h) : h.toFixed(1)
}

// ---------- 打卡链辅助 ----------
const hadYesterday = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  return store.dailyRecords[key] && store.dailyRecords[key].completedCount > 0
})

const heatLevel = (count) => {
  if (count === 0) return 'level-0'
  if (count <= 2) return 'level-1'
  if (count <= 4) return 'level-2'
  return 'level-3'
}

const statusText = (status) => {
  const map = {
    ok: '✅ 正常',
    behind: '🟠 略落后',
    critical: '🔴 严重落后',
    notstart: '⬜ 未启动'
  }
  return map[status] || status
}

onMounted(() => {
  store.load()
  quoteTimer = setInterval(() => {
    quoteIdx.value = (quoteIdx.value + 1) % quotes.length
  }, 6000)
})

onUnmounted(() => {
  if (quoteTimer) clearInterval(quoteTimer)
})
</script>

<style scoped>
/* ============================================================
   设计体系（本页锁定）
   主题：备考作战室 / 计分牌，深蓝 + 金色，整页浅色系
   字体：Barlow Condensed（展示数字）+ JetBrains Mono（计时/数据）
   圆角体系：大面板 18px / 内嵌面板 12px / 交互件 8px / 圆形件 full
   科目四色为语义色（来自 store），金色 #ffc53d 为页面唯一强调色
   ============================================================ */
.today-status {
  --font-display: 'Barlow Condensed', 'Arial Narrow', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Consolas', 'Courier New', monospace;
  --ink: #1f2d3d;
  --body: #303133;
  --muted: #5b6b7f;
  --gold: #ffc53d;
  --navy-deep: #0d2137;
  --navy: #16345c;
  --navy-light: #1e4576;
  --line: #e4ebf3;
  --bg-soft: #f5f8fc;

  max-width: 1380px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 8px 4px 36px;
  color: var(--body);
}

/* 卡片入场（层级：依次浮现，引导视线） */
@keyframes riseIn {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 4px 18px rgba(16, 35, 63, 0.06);
  animation: riseIn 0.5s ease both;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  min-width: 0;
}
.card:hover {
  box-shadow: 0 10px 30px rgba(16, 35, 63, 0.1);
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
}
.head-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.head-time {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--navy);
  background: #eef4fb;
  padding: 4px 12px;
  border-radius: 999px;
  white-space: nowrap;
}
.head-badge {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  color: #4f9f28;
  background: #f0f9eb;
  padding: 2px 14px;
  border-radius: 999px;
  letter-spacing: 0.5px;
}
.head-hint {
  font-size: 0.82rem;
  color: var(--muted);
}

/* ==================== ① 倒计时计分牌 ==================== */
.hero {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  background: linear-gradient(118deg, var(--navy-deep) 0%, var(--navy) 55%, var(--navy-light) 100%);
  color: #fff;
  padding: 36px 40px 26px;
  animation: riseIn 0.5s ease both;
}
/* 作战室网格纹理 */
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
  background-size: 44px 44px;
  pointer-events: none;
}
/* 锚定在倒计时数字上的光晕（层级：聚焦主角，非漂浮光斑） */
.hero-glow {
  position: absolute;
  width: 560px;
  height: 560px;
  left: -140px;
  top: -220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 197, 61, 0.2) 0%, transparent 68%);
  pointer-events: none;
}

.hero-main {
  position: relative;
  display: flex;
  align-items: center;
  gap: 40px;
}

.hero-count {
  flex-shrink: 0;
}
.count-kicker {
  font-size: 0.95rem;
  letter-spacing: 2.5px;
  color: #ffd97a;
  margin-bottom: 4px;
  font-weight: 600;
}
.count-line {
  display: flex;
  align-items: baseline;
  gap: 12px;
}
.count-num {
  font-family: var(--font-display);
  font-size: clamp(5.2rem, 10.5vw, 8.6rem);
  font-weight: 700;
  line-height: 0.95;
  color: var(--gold);
  font-variant-numeric: tabular-nums;
  letter-spacing: -1px;
  text-shadow: 0 4px 28px rgba(255, 197, 61, 0.38);
  animation: numberPop 0.7s cubic-bezier(0.22, 1.4, 0.36, 1) both;
}
@keyframes numberPop {
  from { opacity: 0; transform: scale(0.72); }
  to { opacity: 1; transform: scale(1); }
}
.count-unit {
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 600;
  color: #dbe7f7;
}
.count-sub {
  font-size: 1rem;
  color: #a9c2e0;
  margin-top: 2px;
  letter-spacing: 3px;
}
/* 金色下划线（反馈：载入时展开，强调主角） */
.count-underline {
  width: 96px;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--gold), rgba(255, 197, 61, 0.15));
  margin-top: 14px;
  animation: underlineGrow 0.8s 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes underlineGrow {
  from { width: 0; opacity: 0; }
  to { width: 96px; opacity: 1; }
}

.hero-divider {
  width: 1px;
  align-self: stretch;
  background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.35), transparent);
}

.hero-brief {
  flex: 0 0 auto;
  min-width: 0;
}
.brief-date {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 10px;
}
.brief-goal {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
.goal-chip {
  font-size: 0.8rem;
  font-weight: 600;
  color: #dbe7f7;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 4px 12px;
  border-radius: 999px;
  white-space: nowrap;
}
.goal-chip.gold {
  color: var(--navy-deep);
  background: var(--gold);
  border-color: var(--gold);
  font-weight: 700;
}
.hero-quote {
  flex: 1;
  min-width: 240px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.quote-mark {
  font-family: var(--font-display);
  font-size: 2.6rem;
  line-height: 1;
  color: var(--gold);
}
.quote-text {
  font-size: 1.05rem;
  line-height: 1.7;
  color: #e8eef7;
  padding-top: 8px;
}
.brief-today {
  display: flex;
  align-items: center;
  gap: 10px;
}
.bt-label {
  font-size: 0.88rem;
  color: #dbe7f7;
  white-space: nowrap;
}
.bt-bar {
  flex: 1;
  max-width: 220px;
  height: 8px;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 4px;
  overflow: hidden;
}
.bt-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gold), #ffd97a);
  border-radius: 4px;
  transition: width 0.5s ease;
}
.bt-num {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--gold);
}

/* 备考进度：带游标的标尺轨道 */
.hero-prep {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 26px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.16);
}
.prep-label {
  font-size: 0.82rem;
  color: #a9c2e0;
  white-space: nowrap;
  letter-spacing: 1px;
}
.prep-track {
  position: relative;
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 3px;
}
.prep-fill {
  height: 100%;
  background: linear-gradient(90deg, #2a5290, var(--gold));
  border-radius: 3px;
  transition: width 0.8s ease;
}
/* "你在这里"游标（状态：脉动提示当前位置） */
.prep-marker {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--gold);
  border: 2px solid var(--navy-deep);
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 0 rgba(255, 197, 61, 0.5);
  animation: markerPulse 2.4s ease-out infinite;
  transition: left 0.8s ease;
}
@keyframes markerPulse {
  0% { box-shadow: 0 0 0 0 rgba(255, 197, 61, 0.5); }
  70% { box-shadow: 0 0 0 9px rgba(255, 197, 61, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 197, 61, 0); }
}
.prep-pct {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--gold);
  font-variant-numeric: tabular-nums;
}
/* 右侧数值组：实际进度 + 应达进度 */
.prep-nums {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1.15;
}
.prep-due {
  font-size: 0.72rem;
  color: #a9c2e0;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
/* 应达进度刻度线（竖线，供对比实际游标位置） */
.prep-expected {
  position: absolute;
  top: -5px;
  bottom: -5px;
  width: 2px;
  background: rgba(255, 255, 255, 0.55);
  border-radius: 1px;
  transform: translateX(-50%);
  transition: left 0.8s ease;
}

/* ==================== ② Bento 主区（12 栅格） ==================== */
.bento {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 18px;
  align-items: start;
}
.tasks-card { grid-column: span 7; animation-delay: 0.08s; }
.chain-card { grid-column: span 5; animation-delay: 0.14s; }
.feynman-card { grid-column: span 12; animation-delay: 0.16s; cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s; }
.feynman-card:hover { border-color: #ffc53d; box-shadow: 0 4px 16px rgba(255,197,61,0.15); }
.feynman-inner { display: flex; align-items: center; gap: 14px; }
.feynman-icon { font-size: 1.6rem; }
.feynman-text { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.feynman-text strong { color: #1f2d3d; font-size: 0.95rem; }
.feynman-text span { color: #5b6b7f; font-size: 0.8rem; }
.feynman-arrow { color: #ffc53d; font-size: 1.2rem; font-weight: 700; }
.subjects-card { grid-column: span 12; animation-delay: 0.18s; }
.materials-card { animation-delay: 0.22s; }

/* ---------- 今日任务 ---------- */
.task-progress-bar {
  height: 9px;
  background: #eef2f6;
  border-radius: 5px;
  overflow: hidden;
}
.task-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #67C23A, #95d475);
  border-radius: 5px;
  transition: width 0.4s ease;
}
.task-time-summary {
  font-size: 0.82rem;
  color: var(--muted);
  margin: 10px 0 16px;
  font-variant-numeric: tabular-nums;
}

.empty-hint {
  text-align: center;
  color: var(--muted);
  padding: 24px 0;
  font-size: 0.95rem;
}

.task-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

@keyframes taskIn {
  from { opacity: 0; transform: translateX(-12px); }
  to { opacity: 1; transform: translateX(0); }
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 14px 13px 12px;
  border-radius: 12px;
  background: var(--bg-soft);
  border-left: 4px solid var(--task-color, #409EFF);
  cursor: pointer;
  user-select: none;
  animation: taskIn 0.4s ease both;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}
.task-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 14px rgba(16, 35, 63, 0.1);
  background: #fff;
}
.task-item:active {
  transform: translateX(5px) scale(0.985);
}
.task-item.done {
  background: #f4faf0;
  opacity: 0.62;
}
.task-item.done .task-title {
  text-decoration: line-through;
  color: var(--muted);
}

.checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: 2px solid #c5cdd8;
  border-radius: 50%;
  flex-shrink: 0;
  font-size: 0.95rem;
  font-weight: 800;
  color: #fff;
  transition: all 0.2s ease;
}
.checkbox.checked {
  background: #67C23A;
  border-color: #67C23A;
  animation: checkBounce 0.35s cubic-bezier(0.22, 1.6, 0.36, 1);
}
@keyframes checkBounce {
  0% { transform: scale(0.5); }
  60% { transform: scale(1.25); }
  100% { transform: scale(1); }
}

.task-tag {
  color: #fff;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 8px;
  flex-shrink: 0;
  white-space: nowrap;
}
.task-title {
  flex: 1;
  min-width: 0;
  font-size: 0.95rem;
  color: var(--body);
  line-height: 1.45;
}
/* 单任务预计时长标注 */
.task-est {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--navy);
  background: #eef4fb;
  padding: 3px 9px;
  border-radius: 999px;
  flex-shrink: 0;
  white-space: nowrap;
}

/* ---------- 打卡链 ---------- */
.streak-box {
  display: flex;
  align-items: baseline;
  gap: 3px;
}
.streak-num {
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 700;
  color: #E6A23C;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.streak-unit {
  font-size: 0.85rem;
  color: #E6A23C;
  font-weight: 600;
}

.chain-broken {
  background: #fef0f0;
  color: #F56C6C;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 0.88rem;
  margin-bottom: 12px;
  font-weight: 600;
}

.heatmap {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 5px;
  margin-bottom: 10px;
}
.heatmap-cell {
  aspect-ratio: 1;
  border-radius: 4px;
  background: #e8edf3;
  transition: transform 0.15s ease;
}
.heatmap-cell:hover {
  transform: scale(1.28);
}
.heatmap-cell.level-0 { background: #e8edf3; }
.heatmap-cell.level-1 { background: #c6e48b; }
.heatmap-cell.level-2 { background: #7bc96f; }
.heatmap-cell.level-3 { background: #239a3b; }

.heatmap-legend {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--muted);
  margin-bottom: 14px;
}
.legend-cells {
  display: flex;
  gap: 4px;
}
.legend-cells .heatmap-cell {
  width: 12px;
  height: 12px;
  aspect-ratio: auto;
}

.week-rate {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fdf6ec;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 0.88rem;
  color: var(--body);
}
.week-rate strong {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: #E6A23C;
  font-variant-numeric: tabular-nums;
}

/* ---------- 各科进度 · 全宽计量板 ---------- */
.subj-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.subj-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 18px;
  background: var(--bg-soft);
  border: 1px solid #edf1f6;
  border-radius: 12px;
  padding: 14px 18px 14px 22px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.subj-row:hover {
  transform: translateX(4px);
  box-shadow: 0 6px 18px rgba(16, 35, 63, 0.09);
}
.subj-accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  background: var(--sc, #409EFF);
}
.subj-id {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  width: 172px;
}
.subj-icon {
  font-size: 1.5rem;
  line-height: 1;
}
.subj-names {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.subj-name {
  font-weight: 700;
  color: var(--body);
  font-size: 0.95rem;
  white-space: nowrap;
}
.subj-status {
  font-size: 0.74rem;
  white-space: nowrap;
}
.subj-status.critical { color: #F56C6C; font-weight: 700; }
.subj-status.behind { color: #E6A23C; font-weight: 600; }
.subj-status.ok { color: #67C23A; }
.subj-status.notstart { color: var(--muted); }

.subj-pct {
  font-family: var(--font-display);
  color: var(--sc, #409EFF);
  line-height: 1;
  flex-shrink: 0;
  width: 84px;
  text-align: right;
}
.subj-pct b {
  font-size: 2rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.subj-pct i {
  font-style: normal;
  font-size: 1rem;
  font-weight: 600;
  margin-left: 1px;
}

.subj-track {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 10px;
  background: #e8edf3;
  border-radius: 5px;
}
.subj-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.5s ease;
}
/* 应达进度刻度线（对比：目标在哪） */
.subj-tick {
  position: absolute;
  top: -3px;
  bottom: -3px;
  width: 2px;
  background: #8a97ab;
  border-radius: 1px;
  transform: translateX(-50%);
}

.subj-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
  width: 92px;
}
.subj-target {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--muted);
  white-space: nowrap;
}
.subj-units {
  font-size: 0.72rem;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

/* ---------- 资料进度墙 ---------- */
.card-head.clickable {
  cursor: pointer;
  user-select: none;
  margin-bottom: 0;
}
.toggle-hint {
  font-size: 0.85rem;
  color: #409EFF;
  font-weight: 600;
}
.materials-body {
  margin-top: 16px;
}

/* ==================== 响应式 ==================== */
@media (max-width: 1080px) {
  .bento {
    grid-template-columns: 1fr;
  }
  .tasks-card,
  .chain-card,
  .subjects-card {
    grid-column: auto;
  }
}

@media (max-width: 860px) {
  .hero-main {
    flex-direction: column;
    align-items: flex-start;
    gap: 22px;
  }
  .hero-divider {
    display: none;
  }
  .subj-id {
    width: 130px;
  }
  .subj-pct {
    width: 64px;
  }
  .subj-pct b {
    font-size: 1.6rem;
  }
  .subj-meta {
    width: 76px;
  }
}

@media (max-width: 600px) {
  .today-status {
    padding: 4px 2px 24px;
  }
  .hero {
    padding: 28px 20px 20px;
  }
  .card {
    padding: 18px 16px;
  }
  .heatmap {
    grid-template-columns: repeat(15, 1fr);
  }
  .subj-row {
    flex-wrap: wrap;
    gap: 10px;
    padding-left: 18px;
  }
  .subj-id {
    width: auto;
    flex: 1;
  }
  .subj-track {
    order: 5;
    flex-basis: 100%;
  }
  .subj-meta {
    width: auto;
    align-items: flex-end;
  }
}

/* ==================== 励志标语跑马灯 ==================== */
.slogan-band {
  overflow: hidden;
  border-radius: 12px;
  background: linear-gradient(90deg, var(--navy-deep), var(--navy));
  padding: 14px 0;
  border: 1px solid var(--navy-light);
}
.marquee-track {
  display: flex;
  gap: 48px;
  width: max-content;
  animation: marquee 28s linear infinite;
}
.slogan {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 2px;
  color: var(--gold);
  white-space: nowrap;
}
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.quote-fade-enter-active, .quote-fade-leave-active { transition: opacity 0.5s ease, transform 0.5s ease; }
.quote-fade-enter-from { opacity: 0; transform: translateY(6px); }
.quote-fade-leave-to { opacity: 0; transform: translateY(-6px); }

/* ==================== 动效可访问性 ==================== */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
