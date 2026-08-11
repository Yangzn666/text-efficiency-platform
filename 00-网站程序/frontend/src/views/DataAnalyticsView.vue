<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTodayStatusStore } from '@/stores/todayStatus'
import { useMaterialsStore, materialStatus } from '@/stores/materials'
import { exportAllData, importAllData } from '@/utils/dataBackup'

const store = useTodayStatusStore()
const matStore = useMaterialsStore()

// ---------- 励志标语 ----------
const quotes = [
  '你背的每一个单词、做的每一道题，都在铺就上岸的路',
  '乾坤未定，你我皆是黑马',
  '星光不问赶路人，时光不负有心人',
  '既然选择了远方，便只顾风雨兼程',
  '耐得住寂寞，才守得住繁华',
  '关关难过关关过，前路漫漫亦灿灿',
  '你现在的努力，是为了让未来的自己不后悔',
  '种一棵树最好的时间是十年前，其次是现在'
]
const slogans = [
  '浙大海宁 · 等我上岸',
  '360分 · 势在必得',
  '越努力 越幸运',
  '自律给我自由',
  '坚持到无能为力',
  '拼搏到感动自己',
  '今天的你 比昨天更强',
  '每天进步一点点'
]

const quoteIdx = ref(0)
let quoteTimer: ReturnType<typeof setInterval> | null = null

const currentQuote = computed(() => quotes[quoteIdx.value % quotes.length])

// ---------- 日期与进度 ----------
const formatExamDate = computed(() => {
  const d = new Date(store.examDate)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
})

/** 领先/落后应达进度 */
const prepDelta = computed(() => store.overallPrep.actual - store.overallPrep.expected)

const statusMeta: Record<string, { label: string; cls: string }> = {
  ok: { label: '正常', cls: 'st-ok' },
  behind: { label: '略慢', cls: 'st-behind' },
  critical: { label: '告急', cls: 'st-critical' },
  notstart: { label: '未启动', cls: 'st-notstart' }
}

// ---------- 打卡热力 ----------
const heatLevel = (count: number) => {
  if (count <= 0) return 'lv0'
  if (count === 1) return 'lv1'
  if (count === 2) return 'lv2'
  return 'lv3'
}

// ---------- 里程碑（已完成的资料） ----------
const doneMaterials = computed(() =>
  matStore.materials.filter(m => materialStatus(m) === 'done')
)

// ---------- 时长格式化 ----------
const fmtHours = (min: number) => {
  const h = min / 60
  return h % 1 === 0 ? String(h) : h.toFixed(1)
}

// ---------- 周完成率环形 ----------
const RING_CIRC = 2 * Math.PI * 44
const ringOffset = computed(() => RING_CIRC * (1 - store.weekCompletion / 100))

// ---------- 冲刺配速测算 ----------
const daysBetween = (from: string, to: string): number => {
  const a = new Date(from).getTime()
  const b = new Date(to).getTime()
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}
const todayStr = (): string => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** 各科冲刺配速：剩余单元 / 距目标天数 / 每日所需配速 / 下一个任务 */
const paceRows = computed(() => {
  const today = todayStr()
  return store.plans.filter(p => p.active).map(p => {
    const remaining = Math.max(0, p.totalUnits - p.completedUnits)
    const daysLeft = Math.max(1, daysBetween(today, p.targetDate))
    const pacePerDay = remaining / daysLeft
    const minutesPerDay = pacePerDay * p.estMinutes
    const plannedPerDay = Math.max(1, p.dailyQuota * p.estMinutes)
    const pressure = minutesPerDay / plannedPerDay
    return {
      key: p.key,
      name: p.name,
      color: p.color,
      icon: p.icon,
      remaining,
      daysLeft,
      pace: pacePerDay >= 1 ? pacePerDay.toFixed(1) : pacePerDay.toFixed(2),
      hoursPerDay: (minutesPerDay / 60).toFixed(1),
      nextLabel: p.unitLabel(p.completedUnits + 1),
      pressureLevel: pressure > 1.2 ? 'high' : pressure > 0.85 ? 'mid' : 'low'
    }
  })
})

/** 到目标日期前全科合计还需投入时长（小时） */
const totalRemainingHours = computed(() => {
  const totalMin = store.plans.reduce((s, p) => s + Math.max(0, p.totalUnits - p.completedUnits) * p.estMinutes, 0)
  return Math.round(totalMin / 60)
})

// ---------- 行动建议（基于实时进度状态） ----------
const adviceList = computed(() => {
  return store.progressWarnings.map(w => {
    let text = ''
    let tone = 'ok'
    if (w.status === 'notstart') {
      text = `${w.name}还未启动，建议尽快开始第一轮，避免冲刺阶段堆积。`
      tone = 'urgent'
    } else if (w.status === 'critical') {
      text = `${w.name}进度告急，建议每天增加投入，优先补上落后部分。`
      tone = 'urgent'
    } else if (w.status === 'behind') {
      text = `${w.name}略慢于计划，建议每周多安排1-2次集中突破。`
      tone = 'warn'
    } else {
      text = `${w.name}节奏正常，保持当前配速，稳步推进。`
      tone = 'ok'
    }
    return { key: w.key, name: w.name, icon: w.icon, text, tone }
  })
})

// ---------- 数据备份与恢复 ----------
const isExporting = ref(false)
const isImporting = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const handleExport = async () => {
  isExporting.value = true
  try {
    const { lsCount, lfCount } = await exportAllData()
    ElMessage.success(`已导出备份（${lsCount} 项本地数据 + ${lfCount} 项索引数据）`)
  } catch (e) {
    ElMessage.error('导出失败：' + (e as Error).message)
  } finally {
    isExporting.value = false
  }
}

const triggerImport = () => fileInputRef.value?.click()

const handleImportFile = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    await ElMessageBox.confirm(
      '导入将覆盖当前所有本地数据（学习记录、每日任务、各科进度、错题等），且不可撤销。确定继续？',
      '确认导入备份',
      { confirmButtonText: '确定导入', cancelButtonText: '取消', type: 'warning' }
    )
  } catch {
    input.value = ''
    return
  }
  isImporting.value = true
  try {
    const { lsCount, lfCount } = await importAllData(file)
    ElMessage.success(`导入成功（${lsCount} + ${lfCount} 项），即将刷新页面`)
    setTimeout(() => window.location.reload(), 1200)
  } catch (err) {
    ElMessage.error('导入失败：' + (err as Error).message)
  } finally {
    isImporting.value = false
    input.value = ''
  }
}

onMounted(async () => {
  await store.load()
  quoteTimer = setInterval(() => {
    quoteIdx.value = (quoteIdx.value + 1) % quotes.length
  }, 6000)
})

onUnmounted(() => {
  if (quoteTimer) clearInterval(quoteTimer)
})
</script>

<template>
  <div class="analytics">
    <!-- ① 倒计时计分牌 -->
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
        </div>

        <div class="hero-divider" aria-hidden="true"></div>

        <div class="hero-prep">
          <div class="prep-big">
            <span class="prep-num">{{ store.overallPrep.actual }}</span>
            <span class="prep-pct">%</span>
          </div>
          <div class="prep-label">整体备考进度</div>
          <div class="prep-delta" :class="prepDelta >= 0 ? 'ahead' : 'lag'">
            {{ prepDelta >= 0 ? '领先应达 ' + prepDelta + ' 个百分点' : '落后应达 ' + Math.abs(prepDelta) + ' 个百分点' }}
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
    </section>

    <!-- ② 非对称 Bento -->
    <div class="bento">
      <!-- 科目进度全景（宽列） -->
      <section class="card subjects-card">
        <div class="card-head">
          <h2>科目进度全景</h2>
          <span class="head-note">实心条 = 实际 · 白线 = 应达</span>
        </div>
        <div class="subj-rows">
          <div v-for="w in store.progressWarnings" :key="w.key" class="subj-row">
            <div class="subj-accent" :style="{ background: w.color }"></div>
            <div class="subj-info">
              <span class="subj-name">{{ w.icon }} {{ w.name }}</span>
              <span class="subj-units">{{ w.completedUnits }}/{{ w.totalUnits }} 单元</span>
            </div>
            <div class="subj-track">
              <div class="subj-fill" :style="{ width: w.actual + '%', background: w.color }"></div>
              <div class="subj-tick" :style="{ left: w.expected + '%' }"></div>
            </div>
            <div class="subj-pct"><b>{{ w.actual }}</b>%</div>
            <div class="subj-status" :class="statusMeta[w.status].cls">{{ statusMeta[w.status].label }}</div>
          </div>
        </div>
      </section>

      <!-- 连续打卡（深蓝） -->
      <section class="card streak-card">
        <div class="card-head light">
          <h2>连续打卡</h2>
          <span class="head-note">断链即停</span>
        </div>
        <div class="streak-big">
          <span class="streak-num">{{ store.streak }}</span>
          <span class="streak-unit">天</span>
        </div>
        <div class="streak-sub">{{ store.streak >= 7 ? '连续一周以上，势头正猛' : '每完成一项任务，点亮今天' }}</div>
        <div class="heatmap">
          <div
            v-for="d in store.heatmap"
            :key="d.date"
            class="heat-cell"
            :class="heatLevel(d.count)"
            :title="d.label + '：完成 ' + d.count + ' 项'"
          ></div>
        </div>
        <div class="heat-legend">近 30 天 · 颜色越深完成越多</div>
      </section>

      <!-- 本周战报 -->
      <section class="card week-card">
        <div class="card-head">
          <h2>本周战报</h2>
          <span class="head-note">出勤率</span>
        </div>
        <div class="week-body">
          <div class="week-ring-wrap">
            <svg class="week-ring" viewBox="0 0 100 100">
              <circle class="ring-track" cx="50" cy="50" r="44" />
              <circle
                class="ring-progress"
                cx="50" cy="50" r="44"
                :stroke-dasharray="RING_CIRC"
                :stroke-dashoffset="ringOffset"
              />
            </svg>
            <div class="ring-center">
              <b>{{ store.weekCompletion }}</b><i>%</i>
            </div>
          </div>
          <div class="week-stats">
            <div class="wstat">
              <span class="wstat-num">{{ fmtHours(store.todayDoneMinutes) }}</span>
              <span class="wstat-label">今日已学（小时）</span>
            </div>
            <div class="wstat">
              <span class="wstat-num">{{ fmtHours(store.todayTotalMinutes) }}</span>
              <span class="wstat-label">今日计划（小时）</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 里程碑（宽列） -->
      <section class="card milestone-card">
        <div class="card-head">
          <h2>已拿下的里程碑</h2>
          <span class="head-note gold">{{ doneMaterials.length }} 项</span>
        </div>
        <div class="milestones" v-if="doneMaterials.length">
          <div v-for="m in doneMaterials" :key="m.id" class="milestone">
            <span class="ms-check">✓</span>
            <div class="ms-body">
              <span class="ms-name">{{ m.name }}</span>
              <span class="ms-detail">{{ m.done }}/{{ m.total }} {{ m.unit }}{{ m.note ? ' · ' + m.note : '' }}</span>
            </div>
          </div>
        </div>
        <div class="milestones-empty" v-else>完成第一份资料后，这里会出现你的战利品</div>
      </section>
    </div>

    <!-- ③ 冲刺配速测算 + 行动建议 -->
    <div class="bento direction-bento">
      <section class="card pace-card">
        <div class="card-head">
          <h2>冲刺配速测算</h2>
          <span class="head-note">距目标日合计还需约 {{ totalRemainingHours }} 小时</span>
        </div>
        <div class="pace-rows">
          <div v-for="r in paceRows" :key="r.key" class="pace-row">
            <div class="pace-accent" :style="{ background: r.color }"></div>
            <div class="pace-main">
              <div class="pace-top">
                <span class="pace-name">{{ r.icon }} {{ r.name }}</span>
                <span class="pace-pressure" :class="'pr-' + r.pressureLevel">
                  {{ r.pressureLevel === 'high' ? '压力高' : r.pressureLevel === 'mid' ? '适中' : '从容' }}
                </span>
              </div>
              <div class="pace-stats">
                <span class="pstat">剩 <b>{{ r.remaining }}</b> 单元</span>
                <span class="pstat"><b>{{ r.daysLeft }}</b> 天达目标</span>
                <span class="pstat">每日需 <b>{{ r.pace }}</b> 单元</span>
                <span class="pstat">≈ <b>{{ r.hoursPerDay }}</b> 小时/天</span>
              </div>
              <div class="pace-next">下一个 → {{ r.nextLabel }}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="card advice-card">
        <div class="card-head">
          <h2>行动建议</h2>
          <span class="head-note">基于实时进度生成</span>
        </div>
        <div class="advice-list">
          <div v-for="a in adviceList" :key="a.key" class="advice-item" :class="'adv-' + a.tone">
            <span class="advice-icon">{{ a.icon }}</span>
            <div class="advice-body">
              <span class="advice-name">{{ a.name }}</span>
              <span class="advice-text">{{ a.text }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- ④ 励志标语跑马灯 -->
    <section class="slogan-band" aria-hidden="true">
      <div class="marquee-track">
        <span v-for="(s, i) in [...slogans, ...slogans]" :key="i" class="slogan">{{ s }}</span>
      </div>
    </section>

    <!-- ⑤ 数据管理 -->
    <section class="card data-card">
      <div class="card-head">
        <h2>数据管理</h2>
        <span class="head-note">完整快照备份</span>
      </div>
      <div class="data-actions">
        <button class="data-btn primary" :disabled="isExporting" @click="handleExport">
          {{ isExporting ? '导出中…' : '导出全部数据' }}
        </button>
        <button class="data-btn" :disabled="isImporting" @click="triggerImport">
          {{ isImporting ? '导入中…' : '选择备份文件导入' }}
        </button>
        <input
          ref="fileInputRef"
          type="file"
          accept="application/json,.json"
          style="display: none"
          @change="handleImportFile"
        />
      </div>
      <p class="data-tip">建议每周导出一次备份。若已配置云同步，打卡数据会自动跨设备同步，此处为完整快照。</p>
    </section>
  </div>
</template>

<style scoped>
.analytics {
  --font-display: 'Barlow Condensed', 'Arial Narrow', 'PingFang SC', sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
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
  padding: 22px 20px 60px;
  color: var(--body);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* ==================== ① 计分牌 ==================== */
.hero {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  background: linear-gradient(150deg, var(--navy-deep) 0%, var(--navy) 55%, var(--navy-light) 100%);
  color: #fff;
  padding: 34px 38px 30px;
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
  background-size: 44px 44px;
  pointer-events: none;
}
.hero-glow {
  position: absolute;
  width: 420px;
  height: 420px;
  left: -120px;
  top: -160px;
  background: radial-gradient(circle, rgba(255, 197, 61, 0.22) 0%, transparent 65%);
  pointer-events: none;
}
.hero-main {
  position: relative;
  display: flex;
  align-items: center;
  gap: 34px;
  flex-wrap: wrap;
}
.hero-count { min-width: 200px; }
.count-kicker {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 2px;
  color: #a9c2e0;
  text-transform: uppercase;
}
.count-line { display: flex; align-items: baseline; gap: 8px; margin: 4px 0 2px; }
.count-num {
  font-family: var(--font-display);
  font-size: clamp(4.2rem, 8vw, 6.8rem);
  font-weight: 700;
  line-height: 1;
  color: var(--gold);
  font-variant-numeric: tabular-nums;
}
.count-unit { font-size: 1.4rem; font-weight: 600; color: #dbe7f5; }
.count-sub { font-size: 0.9rem; color: #a9c2e0; letter-spacing: 3px; }

.hero-divider {
  width: 1px;
  align-self: stretch;
  background: rgba(255, 255, 255, 0.16);
}

.hero-prep { min-width: 190px; }
.prep-big { display: flex; align-items: baseline; gap: 4px; }
.prep-num {
  font-family: var(--font-display);
  font-size: clamp(3.4rem, 6vw, 5.2rem);
  font-weight: 700;
  line-height: 1;
  color: #fff;
  font-variant-numeric: tabular-nums;
}
.prep-pct { font-size: 1.3rem; font-weight: 600; color: #dbe7f5; }
.prep-label { font-size: 0.9rem; color: #a9c2e0; letter-spacing: 2px; margin: 4px 0 8px; }
.prep-delta {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  padding: 4px 12px;
  border-radius: 999px;
}
.prep-delta.ahead { background: rgba(103, 194, 58, 0.2); color: #9be29b; border: 1px solid rgba(103, 194, 58, 0.4); }
.prep-delta.lag { background: rgba(245, 108, 108, 0.2); color: #ffb3ad; border: 1px solid rgba(245, 108, 108, 0.4); }

.hero-quote { flex: 1; min-width: 240px; display: flex; gap: 10px; align-items: flex-start; }
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
.quote-fade-enter-active, .quote-fade-leave-active { transition: opacity 0.5s ease, transform 0.5s ease; }
.quote-fade-enter-from { opacity: 0; transform: translateY(8px); }
.quote-fade-leave-to { opacity: 0; transform: translateY(-8px); }

/* ==================== ② Bento ==================== */
.bento {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 18px;
  align-items: start;
}
.card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 22px 24px;
  box-shadow: 0 2px 10px rgba(22, 52, 92, 0.05);
}
.subjects-card { grid-column: span 7; }
.streak-card { grid-column: span 5; }
.week-card { grid-column: span 5; }
.milestone-card { grid-column: span 7; }

.card-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 18px;
}
.card-head h2 {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
  position: relative;
  padding-left: 12px;
}
.card-head h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 3px;
  bottom: 3px;
  width: 4px;
  border-radius: 2px;
  background: var(--gold);
}
.card-head.light h2 { color: #fff; }
.head-note { font-size: 0.78rem; color: var(--muted); font-family: var(--font-mono); }
.head-note.gold { color: #b8860b; font-weight: 700; }

/* ---- 科目进度行 ---- */
.subj-rows { display: flex; flex-direction: column; gap: 12px; }
.subj-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--bg-soft);
  border: 1px solid var(--line);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.subj-row:hover { transform: translateX(4px); box-shadow: 0 3px 12px rgba(22, 52, 92, 0.08); }
.subj-accent { width: 5px; align-self: stretch; border-radius: 3px; }
.subj-info { min-width: 130px; display: flex; flex-direction: column; gap: 2px; }
.subj-name { font-weight: 600; color: var(--ink); font-size: 0.95rem; }
.subj-units { font-family: var(--font-mono); font-size: 0.72rem; color: var(--muted); }
.subj-track {
  position: relative;
  flex: 1;
  height: 10px;
  background: #e8eef5;
  border-radius: 5px;
  overflow: visible;
}
.subj-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.8s ease;
}
.subj-tick {
  position: absolute;
  top: -4px;
  bottom: -4px;
  width: 2px;
  background: #8a97ab;
  border-radius: 1px;
  transform: translateX(-50%);
}
.subj-pct { min-width: 56px; text-align: right; font-family: var(--font-mono); color: var(--muted); font-size: 0.85rem; }
.subj-pct b { font-family: var(--font-display); font-size: 1.6rem; font-weight: 700; color: var(--ink); }
.subj-status {
  min-width: 56px;
  text-align: center;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
}
.st-ok { background: #e8f7e0; color: #4a9c2d; }
.st-behind { background: #fdf3e0; color: #c08a1e; }
.st-critical { background: #fde8e8; color: #d94f4f; }
.st-notstart { background: #eef1f5; color: #7a8aa0; }

/* ---- 连续打卡（深蓝） ---- */
.streak-card {
  background: linear-gradient(160deg, var(--navy-deep), var(--navy));
  border-color: var(--navy-light);
  color: #fff;
}
.streak-big { display: flex; align-items: baseline; gap: 8px; margin: 4px 0 2px; }
.streak-num {
  font-family: var(--font-display);
  font-size: 4.2rem;
  font-weight: 700;
  line-height: 1;
  color: var(--gold);
  font-variant-numeric: tabular-nums;
}
.streak-unit { font-size: 1.2rem; font-weight: 600; color: #dbe7f5; }
.streak-sub { font-size: 0.82rem; color: #a9c2e0; margin-bottom: 16px; }
.heatmap {
  display: grid;
  grid-template-columns: repeat(15, 1fr);
  gap: 5px;
}
.heat-cell {
  aspect-ratio: 1;
  border-radius: 3px;
  transition: transform 0.15s ease;
}
.heat-cell:hover { transform: scale(1.25); }
.heat-cell.lv0 { background: rgba(255, 255, 255, 0.1); }
.heat-cell.lv1 { background: rgba(255, 197, 61, 0.35); }
.heat-cell.lv2 { background: rgba(255, 197, 61, 0.65); }
.heat-cell.lv3 { background: var(--gold); }
.heat-legend { font-size: 0.72rem; color: #8fa8c8; margin-top: 10px; font-family: var(--font-mono); }

/* ---- 本周战报 ---- */
.week-body { display: flex; align-items: center; gap: 22px; }
.week-ring-wrap { position: relative; width: 110px; height: 110px; flex-shrink: 0; }
.week-ring { width: 100%; height: 100%; transform: rotate(-90deg); }
.ring-track { fill: none; stroke: #e8eef5; stroke-width: 9; }
.ring-progress {
  fill: none;
  stroke: var(--gold);
  stroke-width: 9;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.8s ease;
}
.ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: baseline;
  justify-content: center;
  padding-top: 34px;
  gap: 2px;
}
.ring-center b { font-family: var(--font-display); font-size: 2rem; font-weight: 700; color: var(--ink); }
.ring-center i { font-style: normal; font-size: 0.9rem; color: var(--muted); }
.week-stats { flex: 1; display: flex; flex-direction: column; gap: 14px; }
.wstat { display: flex; flex-direction: column; gap: 2px; }
.wstat-num { font-family: var(--font-display); font-size: 1.9rem; font-weight: 700; color: var(--ink); line-height: 1; }
.wstat-label { font-size: 0.78rem; color: var(--muted); }

/* ---- 里程碑 ---- */
.milestone-card { background: linear-gradient(160deg, #fffdf5, #fff9e8); border-color: #f3e5b8; }
.milestones { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.milestone {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #f0e3b5;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.milestone:hover { transform: translateY(-3px); box-shadow: 0 5px 16px rgba(184, 134, 11, 0.14); }
.ms-check {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--gold), #eebe77);
  color: var(--navy-deep);
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}
.ms-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.ms-name { font-weight: 700; color: var(--ink); font-size: 0.92rem; }
.ms-detail { font-family: var(--font-mono); font-size: 0.72rem; color: #9a7b2e; }
.milestones-empty { color: var(--muted); font-size: 0.9rem; padding: 18px 0; text-align: center; }

/* ==================== ③ 冲刺配速 + 行动建议 ==================== */
.pace-card { grid-column: span 7; }
.advice-card { grid-column: span 5; }
.pace-rows { display: flex; flex-direction: column; gap: 12px; }
.pace-row {
  display: flex;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--bg-soft);
  border: 1px solid var(--line);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.pace-row:hover { transform: translateX(4px); box-shadow: 0 3px 12px rgba(22, 52, 92, 0.08); }
.pace-accent { width: 5px; align-self: stretch; border-radius: 3px; }
.pace-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 7px; }
.pace-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.pace-name { font-weight: 700; color: var(--ink); font-size: 0.95rem; }
.pace-pressure { font-size: 0.7rem; font-weight: 700; padding: 2px 10px; border-radius: 999px; flex-shrink: 0; }
.pr-high { background: #fde8e8; color: #d94f4f; }
.pr-mid { background: #fdf3e0; color: #c08a1e; }
.pr-low { background: #e8f7e0; color: #4a9c2d; }
.pace-stats { display: flex; flex-wrap: wrap; gap: 4px 16px; }
.pstat { font-size: 0.8rem; color: var(--muted); }
.pstat b { font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; color: var(--ink); margin: 0 1px; }
.pace-next {
  font-size: 0.8rem;
  color: var(--navy);
  background: rgba(22, 52, 92, 0.06);
  padding: 4px 10px;
  border-radius: 8px;
  align-self: flex-start;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.advice-list { display: flex; flex-direction: column; gap: 12px; }
.advice-item {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid var(--line);
  border-left: 4px solid var(--line);
  background: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.advice-item:hover { transform: translateX(4px); box-shadow: 0 3px 12px rgba(22, 52, 92, 0.08); }
.adv-urgent { border-left-color: #f56c6c; background: #fffafa; }
.adv-warn { border-left-color: #e6a23c; background: #fffcf5; }
.adv-ok { border-left-color: #67c23a; background: #fafff7; }
.advice-icon { font-size: 1.3rem; flex-shrink: 0; line-height: 1.4; }
.advice-body { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.advice-name { font-weight: 700; color: var(--ink); font-size: 0.9rem; }
.advice-text { font-size: 0.82rem; color: var(--body); line-height: 1.6; }

/* ==================== ④ 跑马灯 ==================== */
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

/* ==================== ④ 数据管理 ==================== */
.data-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
.data-btn {
  font-family: var(--font-mono);
  font-size: 0.88rem;
  font-weight: 600;
  padding: 10px 22px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--ink);
  cursor: pointer;
  transition: all 0.2s ease;
}
.data-btn:hover:not(:disabled) { border-color: var(--navy); color: var(--navy); transform: translateY(-1px); }
.data-btn:active:not(:disabled) { transform: translateY(0); }
.data-btn.primary { background: linear-gradient(135deg, var(--navy), var(--navy-light)); color: #fff; border-color: var(--navy); }
.data-btn.primary:hover:not(:disabled) { color: #fff; box-shadow: 0 4px 14px rgba(22, 52, 92, 0.3); }
.data-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.data-tip { font-size: 0.8rem; color: var(--muted); margin: 0; line-height: 1.6; }

/* ==================== 响应式 ==================== */
@media (max-width: 1080px) {
  .subjects-card, .milestone-card, .pace-card, .advice-card { grid-column: span 12; }
  .streak-card, .week-card { grid-column: span 6; }
}
@media (max-width: 860px) {
  .streak-card, .week-card { grid-column: span 12; }
  .hero-main { gap: 22px; }
  .hero-divider { display: none; }
  .milestones { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .analytics { padding: 14px 12px 40px; }
  .hero { padding: 26px 22px; }
  .subj-row { flex-wrap: wrap; }
  .subj-track { order: 5; flex-basis: 100%; }
  .week-body { flex-direction: column; text-align: center; }
  .week-stats { align-items: center; }
}

/* 动效可访问性 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
