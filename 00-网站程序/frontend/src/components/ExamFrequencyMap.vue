<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  examFreqPoints,
  FREQ_LEVELS,
  MODULE_MAP,
  SUBJECTS,
  pointsBySubject,
  summarize
} from '@/data/examFrequency'
import type { FreqLevel } from '@/data/examFrequency'

// ===== 筛选状态 =====
const activeSubject = ref<string>('all')
const activeLevels = ref<FreqLevel[]>(['high', 'mid', 'low', 'cold'])
const sortBy = ref<'score' | 'yrs' | 'q'>('score')
const searchText = ref('')
const expanded = ref<Record<string, boolean>>({})

const TOTAL_YEARS = 18

// ===== 学科统计（顶部卡片）=====
const subjectStats = computed(() =>
  SUBJECTS.map(s => {
    const pts = pointsBySubject(s.key)
    const sum = summarize(pts)
    const highMid = pts.filter(p => p.lv === 'high' || p.lv === 'mid')
    const highMidScore = highMid.reduce((a, p) => a + p.score, 0)
    return {
      ...s,
      count: sum.count,
      score: sum.score,
      highMidScore,
      highMidPct: sum.score ? Math.round((highMidScore / sum.score) * 100) : 0
    }
  })
)

// ===== 级别筛选切换 =====
function toggleLevel(lv: FreqLevel) {
  const i = activeLevels.value.indexOf(lv)
  if (i >= 0) activeLevels.value.splice(i, 1)
  else activeLevels.value.push(lv)
}

// ===== 筛选 + 排序后的列表 =====
const filteredPoints = computed(() => {
  let pts = pointsBySubject(activeSubject.value)
  pts = pts.filter(p => activeLevels.value.includes(p.lv))
  const kw = searchText.value.trim()
  if (kw) {
    pts = pts.filter(
      p =>
        p.name.toLowerCase().includes(kw.toLowerCase()) ||
        (MODULE_MAP[p.code]?.chapterTitle || '').includes(kw)
    )
  }
  const key = sortBy.value
  return [...pts].sort((a, b) => b[key] - a[key])
})

const overallSummary = computed(() => summarize(filteredPoints.value))

function chapterLabel(code: string) {
  const m = MODULE_MAP[code]
  return m ? `第${m.chapter}章 · ${m.chapterTitle}` : code
}

function toggleExpand(name: string) {
  expanded.value[name] = !expanded.value[name]
}
</script>

<template>
  <div class="freq-map">
    <!-- 说明条 -->
    <div class="freq-intro">
      <div class="intro-head">
        <span class="intro-icon">📊</span>
        <div>
          <div class="intro-title">408 考频地图</div>
          <div class="intro-sub">EXAM FREQUENCY MAP · 2009–2026</div>
        </div>
      </div>
      <p class="intro-desc">
        基于 <b>18 年</b> 408 真题（846 道题 · 3792 分）统计，按考点划分四档：
      </p>
      <div class="legend">
        <span class="legend-item" v-for="lv in (['high','mid','low','cold'] as FreqLevel[])" :key="lv">
          <i class="legend-dot" :style="{ background: FREQ_LEVELS[lv].color }"></i>
          <b>{{ FREQ_LEVELS[lv].label }}</b>
          <em>{{ FREQ_LEVELS[lv].desc }}</em>
        </span>
      </div>
    </div>

    <!-- 学科统计卡片 -->
    <div class="stat-grid">
      <div
        v-for="s in subjectStats"
        :key="s.key"
        class="stat-card"
        :class="{ active: activeSubject === s.key }"
        @click="activeSubject = activeSubject === s.key ? 'all' : s.key"
      >
        <div class="stat-top">
          <span class="stat-label">{{ s.label }}</span>
          <span class="stat-count">{{ s.count }} 考点</span>
        </div>
        <div class="stat-score">{{ s.score }}<span class="stat-unit">分</span></div>
        <div class="stat-meta">高/中频占分 <b>{{ s.highMidPct }}%</b></div>
        <div class="stat-bar">
          <div class="stat-bar-fill" :style="{ width: s.highMidPct + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- 筛选工具栏 -->
    <div class="toolbar">
      <div class="level-chips">
        <button
          v-for="lv in (['high','mid','low','cold'] as FreqLevel[])"
          :key="lv"
          class="chip"
          :class="{ on: activeLevels.includes(lv) }"
          :style="{ '--c': FREQ_LEVELS[lv].color }"
          @click="toggleLevel(lv)"
        >
          {{ FREQ_LEVELS[lv].label }}
        </button>
      </div>

      <div class="toolbar-right">
        <el-input
          v-model="searchText"
          placeholder="搜索考点 / 章节…"
          clearable
          size="default"
          class="search-input"
        >
          <template #prefix>🔍</template>
        </el-input>
        <el-select v-model="sortBy" size="default" class="sort-select">
          <el-option label="按分值排序" value="score" />
          <el-option label="按考察年数" value="yrs" />
          <el-option label="按题量排序" value="q" />
        </el-select>
      </div>
    </div>

    <!-- 结果统计 -->
    <div class="result-meta">
      当前显示 <b>{{ overallSummary.count }}</b> 个考点 · 合计
      <b class="mono">{{ overallSummary.score }}</b> 分
      <span v-if="activeSubject !== 'all'" class="clear-filter" @click="activeSubject = 'all'">
        ✕ 清除学科筛选
      </span>
    </div>

    <!-- 考点列表 -->
    <div class="point-list">
      <div
        v-for="p in filteredPoints"
        :key="p.name + p.code"
        class="point-row"
        :style="{ '--c': FREQ_LEVELS[p.lv].color }"
      >
        <div class="point-main" @click="toggleExpand(p.name)">
          <span class="lv-badge">{{ FREQ_LEVELS[p.lv].label }}</span>
          <div class="point-info">
            <div class="point-name">{{ p.name }}</div>
            <div class="point-chapter">{{ chapterLabel(p.code) }}</div>
          </div>
          <div class="point-nums">
            <div class="num"><span class="num-v">{{ p.score }}</span><span class="num-l">分值</span></div>
            <div class="num"><span class="num-v">{{ p.q }}</span><span class="num-l">题量</span></div>
            <div class="num">
              <span class="num-v">{{ p.yrs }}<i class="num-den">/{{ TOTAL_YEARS }}</i></span><span class="num-l">考察年</span>
            </div>
          </div>
          <span class="expand-arrow" :class="{ open: expanded[p.name] }">▾</span>
        </div>

        <!-- 热度条 -->
        <div class="heat-track">
          <div class="heat-fill" :style="{ width: (p.yrs / TOTAL_YEARS * 100) + '%' }"></div>
        </div>

        <!-- 展开：考察年份 -->
        <div v-if="expanded[p.name]" class="point-years">
          <span class="years-label">考察年份</span>
          <span v-for="y in p.years" :key="y" class="year-tag">{{ y }}</span>
        </div>
      </div>

      <div v-if="filteredPoints.length === 0" class="empty">
        没有符合条件的考点，请调整筛选条件
      </div>
    </div>
  </div>
</template>

<style scoped>
.freq-map {
  --navy: var(--color-primary, #16345c);
  --navy-deep: var(--color-primary-dark, #0d2137);
  --gold: #ffc53d;
  --ink: var(--color-text-primary, #212121);
  --muted: var(--color-text-tertiary, #616161);
  --line: var(--color-border-light, #eeeeee);
  --bg-soft: var(--color-bg-secondary, #f5f7fa);
  --font-display: 'Barlow Condensed', 'FZCuHei', sans-serif;
  --font-mono: var(--font-family-mono, 'JetBrains Mono', monospace);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md, 16px);
}

.mono { font-family: var(--font-mono); }

/* ===== 说明条（作战室风格）===== */
.freq-intro {
  position: relative;
  overflow: hidden;
  background: linear-gradient(150deg, var(--navy-deep) 0%, var(--navy) 65%, #1e4576 100%);
  border-radius: var(--radius-lg, 12px);
  padding: 20px 24px;
  color: #fff;
}
.freq-intro::after {
  content: '';
  position: absolute;
  top: -60%;
  right: -6%;
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(255, 197, 61, 0.14) 0%, transparent 70%);
  pointer-events: none;
}
.intro-head { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.intro-icon { font-size: 1.5rem; }
.intro-title {
  font-family: var(--font-display);
  font-size: 1.45rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.1;
}
.intro-sub {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.22em;
  color: var(--gold);
  text-transform: uppercase;
  margin-top: 3px;
}
.intro-desc {
  margin: 0 0 10px;
  font-size: 0.85rem;
  color: #a8bdd4;
}
.intro-desc b { color: var(--gold); font-family: var(--font-mono); }
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  position: relative;
  z-index: 1;
}
.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: #c7d6e8;
}
.legend-item b { color: #fff; }
.legend-item em { font-style: normal; color: #8ba3bd; font-size: 0.72rem; }
.legend-dot { width: 9px; height: 9px; border-radius: 2px; flex: none; }

/* ===== 学科统计卡片 ===== */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
.stat-card {
  background: var(--color-bg-primary, #fff);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg, 12px);
  padding: 16px 18px;
  cursor: pointer;
  transition: transform var(--transition-fast, 150ms), box-shadow var(--transition-fast, 150ms), border-color var(--transition-fast, 150ms);
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0,0,0,0.08));
}
.stat-card.active {
  border-color: var(--gold);
  box-shadow: 0 0 0 2px rgba(255, 197, 61, 0.35);
}
.stat-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.stat-label { font-size: 0.85rem; font-weight: 700; color: var(--ink); }
.stat-count { font-size: 0.7rem; color: var(--muted); font-family: var(--font-mono); }
.stat-score {
  font-family: var(--font-display);
  font-size: 2.1rem;
  font-weight: 700;
  color: var(--navy);
  line-height: 1.1;
  margin: 6px 0 2px;
}
.stat-unit { font-size: 0.85rem; font-weight: 600; margin-left: 3px; color: var(--muted); }
.stat-meta { font-size: 0.74rem; color: var(--muted); margin-bottom: 8px; }
.stat-meta b { color: var(--navy); font-family: var(--font-mono); }
.stat-bar {
  height: 5px;
  background: var(--bg-soft);
  border-radius: var(--radius-full, 9999px);
  overflow: hidden;
}
.stat-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gold), #f0a820);
  border-radius: var(--radius-full, 9999px);
}

/* ===== 工具栏 ===== */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}
.level-chips { display: flex; gap: 8px; }
.chip {
  border: 1.5px solid var(--c);
  color: var(--c);
  background: var(--color-bg-primary, #fff);
  border-radius: var(--radius-full, 9999px);
  padding: 5px 18px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: background var(--transition-fast, 150ms), color var(--transition-fast, 150ms);
}
.chip.on { background: var(--c); color: #fff; }
.toolbar-right { display: flex; gap: 10px; align-items: center; }
.search-input { width: 230px; }
.sort-select { width: 150px; }

/* ===== 结果统计 ===== */
.result-meta { font-size: 0.85rem; color: var(--muted); }
.result-meta b { color: var(--navy); }
.clear-filter {
  margin-left: 12px;
  color: var(--color-error, #f44336);
  cursor: pointer;
  font-size: 0.8rem;
}

/* ===== 考点列表 ===== */
.point-list { display: flex; flex-direction: column; gap: 10px; }
.point-row {
  background: var(--color-bg-primary, #fff);
  border: 1px solid var(--line);
  border-left: 4px solid var(--c);
  border-radius: var(--radius-md, 8px);
  padding: 12px 16px;
  transition: box-shadow var(--transition-fast, 150ms);
}
.point-row:hover { box-shadow: var(--shadow-sm, 0 2px 8px rgba(0,0,0,0.06)); }
.point-main {
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
}
.lv-badge {
  flex: none;
  background: var(--c);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  border-radius: var(--radius-sm, 4px);
  padding: 4px 0;
  width: 44px;
  text-align: center;
  letter-spacing: 0.05em;
}
.point-info { flex: 1; min-width: 0; }
.point-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.point-chapter { font-size: 0.74rem; color: var(--muted); margin-top: 2px; }
.point-nums { display: flex; gap: 20px; flex: none; }
.num { text-align: center; min-width: 44px; }
.num-v {
  display: block;
  font-family: var(--font-mono);
  font-size: 1.02rem;
  font-weight: 700;
  color: var(--navy);
}
.num-den { font-style: normal; font-size: 0.68rem; color: var(--muted); font-weight: 500; }
.num-l { display: block; font-size: 0.66rem; color: var(--muted); margin-top: 1px; }
.expand-arrow {
  flex: none;
  color: var(--muted);
  transition: transform var(--transition-fast, 150ms);
}
.expand-arrow.open { transform: rotate(180deg); }

/* 热度条 */
.heat-track {
  height: 4px;
  background: var(--bg-soft);
  border-radius: var(--radius-full, 9999px);
  margin-top: 10px;
  overflow: hidden;
}
.heat-fill { height: 100%; background: var(--c); border-radius: var(--radius-full, 9999px); }

/* 展开年份 */
.point-years {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed var(--line);
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}
.years-label { font-size: 0.72rem; color: var(--muted); margin-right: 2px; }
.year-tag {
  font-size: 0.72rem;
  background: var(--bg-soft);
  color: var(--navy);
  border-radius: var(--radius-sm, 4px);
  padding: 2px 7px;
  font-family: var(--font-mono);
}

.empty {
  text-align: center;
  color: var(--muted);
  padding: 48px 0;
  font-size: 0.9rem;
}

/* ===== 响应式 ===== */
@media (max-width: 900px) {
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
  .point-nums { gap: 12px; }
}
@media (max-width: 600px) {
  .toolbar { flex-direction: column; align-items: stretch; }
  .toolbar-right { flex-direction: column; }
  .search-input, .sort-select { width: 100%; }
  .point-name { white-space: normal; }
  .legend { gap: 6px 14px; }
}
@media (max-width: 480px) {
  .point-main { gap: 10px; }
  .lv-badge { width: 38px; font-size: 0.66rem; }
  .point-nums { gap: 8px; }
  .num { min-width: 36px; }
  .num-v { font-size: 0.92rem; }
  .point-row { padding: 10px 12px; }
}
</style>
