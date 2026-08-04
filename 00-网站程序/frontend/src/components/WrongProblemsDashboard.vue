<script setup lang="ts">
import { computed } from 'vue'

// 各科统计数据（手动维护，与各科组件数据同步）
const subjectStats = [
  {
    key: 'math',
    name: '数学一',
    icon: '📐',
    color: '#e74c3c',
    total: 9,
    mastered: 0,
    unmastered: 9,
    subs: [
      { key: 'gaoshu', name: '高数', total: 5, mastered: 0, unmastered: 5 },
      { key: 'xiandai', name: '线代', total: 2, mastered: 0, unmastered: 2 },
      { key: 'gailv', name: '概率论', total: 2, mastered: 0, unmastered: 2 },
    ],
  },
  {
    key: 'english',
    name: '英语一',
    icon: '📚',
    color: '#27ae60',
    total: 0,
    mastered: 0,
    unmastered: 0,
  },
  {
    key: 'politics',
    name: '政治',
    icon: '',
    color: '#f39c12',
    total: 0,
    mastered: 0,
    unmastered: 0,
  },
  {
    key: 'cs408',
    name: '408 计算机',
    icon: '',
    color: '#3498db',
    total: 151,
    mastered: 0,
    unmastered: 151,
    subs: [
      { key: 'ds', name: '数据结构', total: 151, mastered: 0, unmastered: 151 },
      { key: 'co', name: '计组', total: 0, mastered: 0, unmastered: 0 },
      { key: 'os', name: '操作系统', total: 0, mastered: 0, unmastered: 0 },
      { key: 'network', name: '计算机网络', total: 0, mastered: 0, unmastered: 0 },
    ],
  },
]

const totalStats = computed(() => {
  let total = 0, mastered = 0, unmastered = 0
  for (const s of subjectStats) {
    total += s.total
    mastered += s.mastered
    unmastered += s.unmastered
  }
  const rate = total > 0 ? Math.round((mastered / total) * 100) : 0
  return { total, mastered, unmastered, rate }
})

function masteryRate(s: { total: number; mastered: number }) {
  return s.total > 0 ? Math.round((s.mastered / s.total) * 100) : 0
}
</script>

<template>
  <div class="dashboard">
    <!-- Hero Stats Bar -->
    <div class="hero-stats">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <div class="stat-card main-stat">
          <div class="stat-value">{{ totalStats.total }}</div>
          <div class="stat-label">总错题数</div>
        </div>
        <div class="stat-card mastered-stat">
          <div class="stat-value">{{ totalStats.mastered }}</div>
          <div class="stat-label">已掌握</div>
        </div>
        <div class="stat-card unmastered-stat">
          <div class="stat-value">{{ totalStats.unmastered }}</div>
          <div class="stat-label">待复习</div>
        </div>
        <div class="stat-card rate-stat">
          <div class="stat-value">{{ totalStats.rate }}%</div>
          <div class="stat-label">掌握率</div>
          <div class="rate-bar">
            <div class="rate-fill" :style="{ width: totalStats.rate + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Subject Breakdown -->
    <div class="subject-grid">
      <div v-for="s in subjectStats" :key="s.key" class="subject-card">
        <div class="subject-head">
          <span class="subject-icon">{{ s.icon }}</span>
          <h3>{{ s.name }}</h3>
        </div>
        <div class="subject-stats">
          <div class="mini-stat">
            <span class="mini-value">{{ s.total }}</span>
            <span class="mini-label">总计</span>
          </div>
          <div class="mini-stat mastered">
            <span class="mini-value">{{ s.mastered }}</span>
            <span class="mini-label">已掌握</span>
          </div>
          <div class="mini-stat pending">
            <span class="mini-value">{{ s.unmastered }}</span>
            <span class="mini-label">待复习</span>
          </div>
        </div>
        <div class="subject-rate">
          <div class="rate-track">
            <div class="rate-progress" :style="{ width: masteryRate(s) + '%', background: s.color }"></div>
          </div>
          <span class="rate-text">{{ masteryRate(s) }}%</span>
        </div>
      </div>
    </div>

    <!-- 408 Sub-subjects -->
    <div v-if="subjectStats.find(s => s.key === 'cs408')?.subs" class="sub-subjects">
      <h4 class="section-title">408 各科明细</h4>
      <div class="sub-grid">
        <div
          v-for="sub in subjectStats.find(s => s.key === 'cs408')!.subs"
          :key="sub.key"
          class="sub-card"
        >
          <div class="sub-name">{{ sub.name }}</div>
          <div class="sub-stats">
            <span class="sub-total">{{ sub.total }} 题</span>
            <span class="sub-mastered">{{ sub.mastered }} 已掌握</span>
          </div>
          <div class="sub-rate">
            <div class="sub-rate-track">
              <div
                class="sub-rate-fill"
                :style="{ width: masteryRate(sub) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h4 class="section-title">快速操作</h4>
      <div class="action-grid">
        <div class="action-card">
          <span class="action-icon">📝</span>
          <span class="action-label">录入新错题</span>
        </div>
        <div class="action-card">
          <span class="action-icon"></span>
          <span class="action-label">开始复习</span>
        </div>
        <div class="action-card">
          <span class="action-icon">📊</span>
          <span class="action-label">统计分析</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  --ink: #1a2332;
  --body: #2c3e50;
  --gold: #d4a012;
  --gold-light: #f0c040;
  --gold-glow: rgba(212, 160, 18, 0.12);
  --navy-deep: #0a1628;
  --navy: #16345c;
  --navy-light: #1e4576;
  --line: #dce3ed;
  --bg-soft: #f4f7fb;
  --paper: #faf8f4;
  --cream: #f5f0e6;
  --success: #27ae60;
  --danger: #e74c3c;
  --warning: #f39c12;

  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* ── Hero Stats Bar ─────────────────────── */
.hero-stats {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(150deg, var(--navy-deep) 0%, var(--navy) 55%, var(--navy-light) 100%);
  padding: 28px 24px;
  box-shadow: 0 8px 32px rgba(10, 22, 40, 0.15);
}

.hero-bg {
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 24px,
      rgba(255, 255, 255, 0.015) 24px,
      rgba(255, 255, 255, 0.015) 48px
    );
  pointer-events: none;
}

.hero-bg::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, var(--gold) 25%, var(--gold-light) 50%, var(--gold) 75%, transparent 100%);
}

.hero-content {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  text-align: center;
  padding: 16px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-value {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 2.2em;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 0.85em;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 0.05em;
}

.main-stat .stat-value { color: #fff; }
.mastered-stat .stat-value { color: #2ecc71; }
.unmastered-stat .stat-value { color: #f39c12; }
.rate-stat .stat-value { color: var(--gold-light); }

.rate-bar {
  margin-top: 8px;
  height: 4px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  overflow: hidden;
}

.rate-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 100%);
  border-radius: 2px;
  transition: width 0.6s ease;
}

/* ── Subject Grid ───────────────────────── */
.subject-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.subject-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(22, 52, 92, 0.04);
  transition: all 0.3s ease;
}

.subject-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(22, 52, 92, 0.08);
}

.subject-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.subject-icon {
  font-size: 1.6em;
  line-height: 1;
}

.subject-head h3 {
  margin: 0;
  font-size: 1.05em;
  color: var(--ink);
  font-weight: 600;
}

.subject-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 14px;
}

.mini-stat {
  text-align: center;
  padding: 8px 4px;
  border-radius: 8px;
  background: var(--bg-soft);
}

.mini-stat.mastered { background: rgba(39, 174, 96, 0.08); }
.mini-stat.pending { background: rgba(243, 156, 18, 0.08); }

.mini-value {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.3em;
  font-weight: 700;
  color: var(--ink);
  line-height: 1.2;
}

.mini-stat.mastered .mini-value { color: var(--success); }
.mini-stat.pending .mini-value { color: var(--warning); }

.mini-label {
  display: block;
  font-size: 0.72em;
  color: #909399;
  margin-top: 2px;
}

.subject-rate {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rate-track {
  flex: 1;
  height: 6px;
  background: var(--bg-soft);
  border-radius: 3px;
  overflow: hidden;
}

.rate-progress {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s ease;
}

.rate-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85em;
  font-weight: 600;
  color: var(--ink);
  min-width: 36px;
  text-align: right;
}

/* ── 408 Sub-subjects ───────────────────── */
.sub-subjects {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 20px 24px;
  box-shadow: 0 4px 16px rgba(22, 52, 92, 0.04);
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 1em;
  color: var(--ink);
  font-weight: 600;
  padding-left: 12px;
  border-left: 4px solid var(--gold);
}

.sub-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.sub-card {
  padding: 14px 16px;
  border-radius: 10px;
  background: var(--bg-soft);
  border: 1px solid var(--line);
}

.sub-name {
  font-size: 0.92em;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 8px;
}

.sub-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.78em;
  margin-bottom: 8px;
}

.sub-total { color: var(--body); }
.sub-mastered { color: var(--success); font-weight: 600; }

.sub-rate-track {
  height: 4px;
  background: var(--line);
  border-radius: 2px;
  overflow: hidden;
}

.sub-rate-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--navy) 0%, var(--navy-light) 100%);
  border-radius: 2px;
  transition: width 0.6s ease;
}

/* ── Quick Actions ──────────────────────── */
.quick-actions {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 20px 24px;
  box-shadow: 0 4px 16px rgba(22, 52, 92, 0.04);
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 10px;
  background: var(--bg-soft);
  border: 1px solid var(--line);
  cursor: pointer;
  transition: all 0.25s ease;
}

.action-card:hover {
  background: var(--cream);
  border-color: var(--gold);
  transform: translateY(-1px);
}

.action-icon {
  font-size: 1.4em;
  line-height: 1;
}

.action-label {
  font-size: 0.92em;
  color: var(--ink);
  font-weight: 500;
}

/* ─ Responsive ─────────────────────────── */
@media (max-width: 900px) {
  .hero-content { grid-template-columns: repeat(2, 1fr); }
  .subject-grid { grid-template-columns: repeat(2, 1fr); }
  .sub-grid { grid-template-columns: repeat(2, 1fr); }
  .action-grid { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
  .hero-content { grid-template-columns: 1fr 1fr; }
  .stat-value { font-size: 1.8em; }
  .subject-grid { grid-template-columns: 1fr; }
  .sub-grid { grid-template-columns: 1fr 1fr; }
}
</style>
