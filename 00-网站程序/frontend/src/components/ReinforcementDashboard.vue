<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTodayStatusStore } from '@/stores/todayStatus'
import MathReinforcementNav from './MathReinforcementNav.vue'

const router = useRouter()
const todayStore = useTodayStatusStore()

// ===== 费曼掌握度数据（单一来源：skilltree/math.json，由 question-bank-math.json 生成）=====
interface SkillItem { id: string; mastery: string }
interface SkillChapter { id: string; name: string; items: SkillItem[] }
interface SkillSubject { name: string; chapters: SkillChapter[] }

const skillLoaded = ref(false)
const subjects = ref<Record<string, SkillSubject>>({})

const SUBJECT_META: Record<string, { icon: string; grad: string; label: string }> = {
  gaoshu: { icon: '数', grad: 'linear-gradient(135deg,#1e4576,#16345c)', label: '高等数学' },
  xiandai: { icon: '线', grad: 'linear-gradient(135deg,#0e7490,#155e75)', label: '线性代数' },
  gailv: { icon: '概', grad: 'linear-gradient(135deg,#7c3aed,#5b21b6)', label: '概率统计' }
}

async function loadSkillData() {
  try {
    const base = import.meta.env.BASE_URL || '/'
    const resp = await fetch(`${base}data/skilltree/math.json?t=${Date.now()}`)
    if (!resp.ok) return
    const data = await resp.json()
    subjects.value = data.subjects || {}
    skillLoaded.value = true
  } catch (e) {
    console.error('加载掌握度数据失败', e)
  }
}

// 每学科掌握度汇总
const subjectStats = computed(() => {
  return Object.keys(SUBJECT_META).map(key => {
    const subj = subjects.value[key]
    let total = 0, mastered = 0, learning = 0
    if (subj) {
      for (const ch of subj.chapters) {
        for (const it of ch.items) {
          total++
          if (it.mastery === 'mastered') mastered++
          else if (it.mastery === 'learning') learning++
        }
      }
    }
    return {
      key,
      ...SUBJECT_META[key],
      total,
      mastered,
      learning,
      pct: total ? Math.round((mastered / total) * 100) : 0
    }
  })
})

// 章节掌握度明细（学习进度）
const chapterRows = computed(() => {
  const rows: { subjectKey: string; subjectLabel: string; chapterName: string; total: number; mastered: number; pct: number }[] = []
  for (const key of Object.keys(SUBJECT_META)) {
    const subj = subjects.value[key]
    if (!subj) continue
    for (const ch of subj.chapters) {
      const total = ch.items.length
      const mastered = ch.items.filter(i => i.mastery === 'mastered').length
      rows.push({
        subjectKey: key,
        subjectLabel: SUBJECT_META[key].label,
        chapterName: ch.name,
        total,
        mastered,
        pct: total ? Math.round((mastered / total) * 100) : 0
      })
    }
  }
  return rows
})

const overallMastered = computed(() => subjectStats.value.reduce((s, x) => s + x.mastered, 0))
const overallTotal = computed(() => subjectStats.value.reduce((s, x) => s + x.total, 0))

// ===== 今日任务（云端每日计划，与首页今日状态同源）=====
const mathTasks = computed(() => todayStore.todayTasks.filter(t => t.subject === 'math'))
const mathDoneCount = computed(() => mathTasks.value.filter(t => t.done).length)

const progressColor = (pct: number) => (pct >= 80 ? '#67C23A' : pct >= 40 ? '#E6A23C' : '#F56C6C')

const go = (path: string) => router.push(path)

onMounted(() => {
  todayStore.load()
  loadSkillData()
})
</script>

<template>
  <div class="math-dashboard">
    <MathReinforcementNav />

    <!-- 紧凑头部 -->
    <div class="dash-hero">
      <div class="hero-left">
        <span class="hero-kicker">MATH · 数学一 · 目标120+</span>
        <h1>数学一<em>仪表盘</em></h1>
        <p class="hero-sub">掌握度与每日计划 · 单一数据源 · 费曼复习自动同步</p>
      </div>
      <div class="hero-countdown">
        <div class="cd-num">{{ todayStore.daysToExam }}</div>
        <div class="cd-label">天后考试</div>
      </div>
    </div>

    <!-- 进度概览（费曼掌握度）-->
    <div class="section">
      <div class="section-head">
        <h2>📊 掌握度概览</h2>
        <span class="section-note">共掌握 {{ overallMastered }} / {{ overallTotal }} 个题型</span>
      </div>
      <div class="subject-grid">
        <div v-for="s in subjectStats" :key="s.key" class="subject-card">
          <div class="subject-icon" :style="{ background: s.grad }">{{ s.icon }}</div>
          <div class="subject-main">
            <div class="subject-top">
              <h3>{{ s.label }}</h3>
              <span class="subject-pct">{{ s.pct }}%</span>
            </div>
            <el-progress :percentage="s.pct" :color="progressColor(s.pct)" :stroke-width="10" :show-text="false" />
            <p class="subject-detail">
              已掌握 {{ s.mastered }} / {{ s.total }} 题型<span v-if="s.learning"> · {{ s.learning }} 个学习中</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 今日学习任务（紧凑）-->
    <div class="section">
      <div class="section-head">
        <h2>📅 今日学习任务</h2>
        <span class="section-note">{{ mathDoneCount }} / {{ mathTasks.length }} 已完成</span>
      </div>

      <div v-if="mathTasks.length === 0" class="tasks-empty">
        今日暂无数学任务 · 去首页「今日状态」查看全科计划
      </div>
      <div v-else class="task-list">
        <div
          v-for="task in mathTasks"
          :key="task.id"
          class="task-row"
          :class="{ done: task.done }"
          @click="todayStore.toggleTask(task)"
        >
          <span class="task-check">{{ task.done ? '✓' : '' }}</span>
          <span class="task-title">{{ task.title }}</span>
          <span class="task-est">约 {{ todayStore.estMinutesOf(task.subject) }} 分钟</span>
        </div>
      </div>
    </div>

    <!-- 章节掌握度（学习进度）-->
    <div class="section">
      <div class="section-head">
        <h2>📖 章节掌握度</h2>
        <span class="section-note">通过费曼复习诊断点亮题型</span>
      </div>
      <div v-if="!skillLoaded" class="tasks-empty">掌握度数据加载中…</div>
      <div v-else class="chapter-grid">
        <div v-for="(row, idx) in chapterRows" :key="idx" class="chapter-cell">
          <div class="chapter-name" :title="row.chapterName">{{ row.chapterName }}</div>
          <el-progress :percentage="row.pct" :color="progressColor(row.pct)" :stroke-width="7" :show-text="false" />
          <div class="chapter-meta">{{ row.mastered }}/{{ row.total }} · {{ row.subjectLabel }}</div>
        </div>
      </div>
    </div>

    <!-- 快速入口 -->
    <div class="section">
      <div class="section-head"><h2>🚀 快速入口</h2></div>
      <div class="quick-links">
        <button class="link-btn" @click="go('/math/detail')">🔍 知识点梳理</button>
        <button class="link-btn" @click="go('/math/quickcards')">📇 速查卡片</button>
        <button class="link-btn" @click="go('/skilltree')">🌳 技能树</button>
        <button class="link-btn" @click="go('/wrong-problems')">📕 全科错题本</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.math-dashboard {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px 48px;
  font-family: 'FZCuHei', '方正粗黑_GBK', 'Microsoft YaHei', sans-serif;
  font-weight: 400;
}

.dash-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  background: linear-gradient(150deg, #0d2137 0%, #16345c 60%, #1e4576 100%);
  border-radius: 16px;
  padding: 26px 30px;
  color: #fff;
  margin-bottom: 22px;
}
.hero-kicker {
  display: block;
  font-size: 0.8em;
  letter-spacing: 2px;
  color: #ffc53d;
  margin-bottom: 8px;
}
.dash-hero h1 {
  font-size: 1.9em;
  font-weight: 400;
  margin: 0 0 8px;
}
.dash-hero h1 em {
  font-style: normal;
  color: #ffc53d;
}
.hero-sub {
  font-size: 0.9em;
  color: #b8c9dd;
  margin: 0;
}
.hero-countdown { text-align: center; }
.cd-num {
  font-size: 2.6em;
  font-weight: 700;
  color: #ffc53d;
  line-height: 1;
}
.cd-label { font-size: 0.85em; color: #b8c9dd; margin-top: 4px; }

.section {
  background: #fff;
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 20px;
  box-shadow: 0 6px 24px rgba(13, 33, 55, 0.08);
}
.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16px;
}
.section-head h2 {
  font-size: 1.2em;
  font-weight: 400;
  color: #16345c;
  margin: 0;
}
.section-note { font-size: 0.85em; color: #909399; }

.subject-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.subject-card {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  border: 1px solid #ebeef5;
  border-radius: 14px;
  padding: 16px;
}
.subject-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  color: #fff;
  font-size: 1.3em;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.subject-main { flex: 1; min-width: 0; }
.subject-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}
.subject-top h3 { font-size: 1.05em; font-weight: 400; color: #303133; margin: 0; }
.subject-pct { font-size: 1.1em; font-weight: 700; color: #16345c; }
.subject-detail { font-size: 0.82em; color: #909399; margin: 8px 0 0; }

.tasks-empty {
  text-align: center;
  color: #909399;
  font-size: 0.9em;
  padding: 18px 0;
}
.task-list { display: flex; flex-direction: column; gap: 8px; }
.task-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.task-row:hover { border-color: #ffc53d; background: #fffdf5; }
.task-check {
  width: 20px;
  height: 20px;
  border: 2px solid #dcdfe6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8em;
  color: #fff;
  flex-shrink: 0;
}
.task-row.done .task-check { background: #67c23a; border-color: #67c23a; }
.task-title { flex: 1; font-size: 0.95em; color: #303133; }
.task-row.done .task-title { color: #c0c4cc; text-decoration: line-through; }
.task-est { font-size: 0.8em; color: #909399; flex-shrink: 0; }

.chapter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 12px;
}
.chapter-cell {
  border: 1px solid #ebeef5;
  border-radius: 10px;
  padding: 10px 12px;
}
.chapter-name {
  font-size: 0.85em;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 6px;
}
.chapter-meta { font-size: 0.72em; color: #909399; margin-top: 5px; }

.quick-links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.link-btn {
  padding: 14px;
  border: 1px solid #dbe7f5;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff, #f5f8fc);
  color: #16345c;
  font-size: 0.95em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.link-btn:hover {
  border-color: #ffc53d;
  background: #fff8e6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 197, 61, 0.25);
}

@media (max-width: 900px) {
  .subject-grid { grid-template-columns: 1fr; }
  .quick-links { grid-template-columns: repeat(2, 1fr); }
  .dash-hero { flex-direction: column; text-align: center; }
}
</style>
