<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  useReinforcementStore,
  SUBJECTS,
  isChapterDone,
  type ReinforceSubjectKey,
  type ChapterProgress
} from '@/stores/reinforcement'

const store = useReinforcementStore()
const activeSubject = ref<ReinforceSubjectKey>('ds')

const currentSubject = computed(() => SUBJECTS.find(s => s.key === activeSubject.value)!)
const chapters = computed(() => store.data[activeSubject.value])
const currentStats = computed(() => store.subjectStats(activeSubject.value))

// 状态显示映射
const listenMap = {
  none: { icon: '⬜', label: '未开始', cls: 'st-none' },
  doing: { icon: '🔄', label: '进行中', cls: 'st-doing' },
  done: { icon: '✅', label: '完成', cls: 'st-done' }
}
const feynmanMap = {
  todo: { icon: '⬜', label: '待讲', cls: 'st-none' },
  stuck: { icon: '⚠️', label: '有卡点', cls: 'st-stuck' },
  pass: { icon: '✅', label: '通过', cls: 'st-done' }
}
const correctionMap = {
  todo: { icon: '⬜', label: '待补', cls: 'st-none' },
  done: { icon: '✅', label: '已补', cls: 'st-done' }
}

function accuracyCls(c: ChapterProgress) {
  if (c.accuracy === 0) return 'st-none'
  return c.accuracy < 70 ? 'st-low' : 'st-done'
}

function editAccuracy(c: ChapterProgress) {
  ElMessageBox.prompt('请输入刷题正确率（0-100）', `${c.name} · 刷题正确率`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: String(c.accuracy || ''),
    inputPattern: /^\d{1,3}$/,
    inputErrorMessage: '请输入 0-100 的数字'
  })
    .then(({ value }) => {
      store.setAccuracy(c, Number(value))
    })
    .catch(() => {})
}

function handleReset() {
  ElMessageBox.confirm(`确定要重置「${currentSubject.value.name}」的全部进度吗？`, '重置确认', {
    confirmButtonText: '重置',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      store.resetSubject(activeSubject.value)
      ElMessage.success('已重置')
    })
    .catch(() => {})
}
</script>

<template>
  <div class="reinforcement-tracker">
    <!-- 顶部说明 -->
    <div class="intro-bar">
      <span class="intro-icon">🎯</span>
      <span>费曼强化追踪：点击单元格切换状态。章节完成定义 = 听课✅ + 讲解✅ + 正确率≥70% + 错题已补讲。</span>
    </div>

    <!-- 四科总进度环 -->
    <div class="overview-grid">
      <div
        v-for="s in SUBJECTS"
        :key="s.key"
        class="overview-card"
        :class="{ active: s.key === activeSubject }"
        :style="{ '--accent': s.color }"
        @click="activeSubject = s.key"
      >
        <el-progress
          type="circle"
          :percentage="store.subjectStats(s.key).percent"
          :width="72"
          :stroke-width="7"
          :color="s.color"
        />
        <div class="overview-name">{{ s.icon }} {{ s.short }}</div>
        <div class="overview-count">
          {{ store.subjectStats(s.key).done }} / {{ store.subjectStats(s.key).total }} 章
        </div>
      </div>
    </div>

    <!-- 科目切换 + 当前进度 -->
    <div class="subject-bar">
      <el-radio-group v-model="activeSubject" size="large">
        <el-radio-button v-for="s in SUBJECTS" :key="s.key" :label="s.key">
          {{ s.icon }} {{ s.short }}
        </el-radio-button>
      </el-radio-group>
      <div class="subject-progress">
        已完成 <strong>{{ currentStats.done }}</strong> / {{ currentStats.total }} 章
        <el-button link type="danger" size="small" @click="handleReset">重置本科</el-button>
      </div>
    </div>

    <!-- 章节进度矩阵 -->
    <div class="matrix-wrap">
      <table class="matrix-table">
        <thead>
          <tr>
            <th class="col-chapter">章节</th>
            <th class="col-cell">听课</th>
            <th class="col-cell">费曼讲解</th>
            <th class="col-cell">刷题正确率</th>
            <th class="col-cell">错题补讲</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in chapters" :key="c.id" :class="{ 'row-done': isChapterDone(c) }">
            <td class="col-chapter">
              <span class="chapter-name">{{ c.name }}</span>
              <el-tag v-if="isChapterDone(c)" type="success" size="small" effect="dark" class="done-flag">
                已完成
              </el-tag>
            </td>
            <td class="col-cell" @click="store.cycleListen(c)">
              <span class="cell-btn" :class="listenMap[c.listen].cls">
                {{ listenMap[c.listen].icon }}
                <em>{{ listenMap[c.listen].label }}</em>
              </span>
            </td>
            <td class="col-cell" @click="store.cycleFeynman(c)">
              <span class="cell-btn" :class="feynmanMap[c.feynman].cls">
                {{ feynmanMap[c.feynman].icon }}
                <em>{{ feynmanMap[c.feynman].label }}</em>
              </span>
            </td>
            <td class="col-cell" @click="editAccuracy(c)">
              <span class="cell-btn" :class="accuracyCls(c)">
                <template v-if="c.accuracy > 0">{{ c.accuracy }}%</template>
                <template v-else>⬜<em>未刷</em></template>
              </span>
            </td>
            <td class="col-cell" @click="store.cycleCorrection(c)">
              <span class="cell-btn" :class="correctionMap[c.correction].cls">
                {{ correctionMap[c.correction].icon }}
                <em>{{ correctionMap[c.correction].label }}</em>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 漏洞清单 -->
    <div class="weak-panel">
      <div class="weak-header">
        <h3>⚠️ 漏洞清单（费曼讲解有卡点）</h3>
        <el-tag type="danger" size="small" effect="dark">{{ store.weakChapters.length }} 个</el-tag>
      </div>
      <div v-if="store.weakChapters.length === 0" class="weak-empty">
        🎉 暂无卡点章节，继续保持！
      </div>
      <div v-else class="weak-list">
        <div
          v-for="item in store.weakChapters"
          :key="item.chapter.id"
          class="weak-item"
          @click="activeSubject = item.subject.key"
        >
          <el-tag :color="item.subject.color" effect="dark" size="small" class="weak-subject">
            {{ item.subject.icon }} {{ item.subject.short }}
          </el-tag>
          <span class="weak-name">{{ item.chapter.name }}</span>
          <span class="weak-hint">点击跳转 →</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reinforcement-tracker {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.intro-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff8e6;
  border: 1px solid #ffd66b;
  border-radius: 12px;
  padding: 12px 16px;
  color: #303133;
  font-size: 0.92em;
  line-height: 1.5;
}
.intro-icon {
  font-size: 1.3em;
}

/* 总进度环 */
.overview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
.overview-card {
  background: #fff;
  border: 2px solid #ebeef5;
  border-radius: 14px;
  padding: 16px 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.overview-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}
.overview-card.active {
  border-color: var(--accent);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}
.overview-name {
  font-weight: 600;
  color: #303133;
  font-size: 0.95em;
}
.overview-count {
  color: #303133;
  font-size: 0.85em;
}

/* 科目切换栏 */
.subject-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.subject-progress {
  color: #303133;
  font-size: 0.95em;
  display: flex;
  align-items: center;
  gap: 8px;
}
.subject-progress strong {
  color: #16345c;
  font-size: 1.2em;
}

/* 矩阵表格 */
.matrix-wrap {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #ebeef5;
}
.matrix-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 560px;
}
.matrix-table th,
.matrix-table td {
  border: 1px solid #ebeef5;
  padding: 10px 8px;
  text-align: center;
}
.matrix-table th {
  background: #f5f7fa;
  color: #303133;
  font-weight: 600;
  font-size: 0.9em;
  white-space: nowrap;
}
.col-chapter {
  text-align: left !important;
  min-width: 180px;
}
.chapter-name {
  color: #303133;
  font-weight: 500;
}
.done-flag {
  margin-left: 6px;
}
.col-cell {
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}
.cell-btn {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.9em;
  transition: background 0.2s;
}
.cell-btn em {
  font-style: normal;
  font-size: 0.85em;
}
.cell-btn:hover {
  background: #f0f2f5;
}
.st-none {
  color: #303133;
}
.st-doing {
  color: #e6a23c;
}
.st-done {
  color: #67c23a;
}
.st-stuck {
  color: #f56c6c;
  font-weight: 600;
}
.st-low {
  color: #f56c6c;
  font-weight: 600;
}
.row-done {
  background: #f0f9eb;
}
.row-done .chapter-name {
  color: #67c23a;
  font-weight: 600;
}

/* 漏洞清单 */
.weak-panel {
  background: #fff;
  border: 1px solid #fde2e2;
  border-radius: 14px;
  padding: 18px;
}
.weak-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.weak-header h3 {
  margin: 0;
  font-size: 1.1em;
  color: #303133;
}
.weak-empty {
  color: #303133;
  text-align: center;
  padding: 16px;
}
.weak-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.weak-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #fef0f0;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s;
}
.weak-item:hover {
  background: #fde2e2;
}
.weak-subject {
  border: none;
}
.weak-name {
  flex: 1;
  color: #303133;
  font-weight: 500;
}
.weak-hint {
  color: #f56c6c;
  font-size: 0.85em;
}

/* 响应式 */
@media (max-width: 768px) {
  .overview-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .intro-bar {
    font-size: 0.85em;
  }
  .cell-btn em {
    display: none;
  }
  .col-chapter {
    min-width: 130px;
  }
}
</style>
