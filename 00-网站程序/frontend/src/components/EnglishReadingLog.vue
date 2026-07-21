<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  useReadingLogStore,
  TEXTS_PER_YEAR,
  type PassageRecord
} from '@/stores/readingLog'

const store = useReadingLogStore()

const expandedYear = ref<number | null>(null)

function toggleYear(year: number) {
  expandedYear.value = expandedYear.value === year ? null : year
}

function passageState(year: number, text: number) {
  const rec = store.get(year, text)
  return rec
}

// ---------- 编辑弹窗 ----------
const editVisible = ref(false)
const editing = ref<PassageRecord | null>(null)
const editDone = ref(false)
const editCorrect = ref(0)
const editNotes = ref('')

function openEdit(year: number, text: number) {
  const rec = store.get(year, text)
  editing.value = rec
  editDone.value = rec.done
  editCorrect.value = rec.correct
  editNotes.value = rec.notes
  editVisible.value = true
}

function confirmEdit() {
  if (!editing.value) return
  store.update(editing.value.year, editing.value.text, {
    done: editDone.value,
    correct: editDone.value ? editCorrect.value : 0,
    notes: editNotes.value
  })
  ElMessage.success('已保存')
  editVisible.value = false
}

function accuracyColor(acc: number) {
  if (acc === 0) return '#909399'
  return acc < 60 ? '#F56C6C' : acc < 80 ? '#E6A23C' : '#67C23A'
}
</script>

<template>
  <div class="reading-log">
    <!-- 总进度 -->
    <div class="overall-card">
      <div class="overall-left">
        <div class="overall-num">
          {{ store.overall.done }}<span class="overall-total">/{{ store.overall.total }}</span>
        </div>
        <div class="overall-label">已完成篇数</div>
      </div>
      <div class="overall-right">
        <div class="overall-bar-track">
          <div
            class="overall-bar-fill"
            :style="{ width: (store.overall.done / store.overall.total) * 100 + '%' }"
          ></div>
        </div>
        <div class="overall-meta">
          <span>总进度 {{ Math.round((store.overall.done / store.overall.total) * 100) }}%</span>
          <span v-if="store.overall.accuracy > 0">平均正确率 {{ store.overall.accuracy }}%</span>
        </div>
      </div>
    </div>

    <!-- 年份列表 -->
    <div class="year-list">
      <div v-for="year in store.years" :key="year" class="year-card">
        <div class="year-head" @click="toggleYear(year)">
          <span class="year-name">{{ year }} 年</span>
          <span class="year-stats">
            <span class="year-done">{{ store.yearStats(year).done }}/{{ TEXTS_PER_YEAR }} 篇</span>
            <span
              v-if="store.yearStats(year).done > 0"
              class="year-acc"
              :style="{ color: accuracyColor(store.yearStats(year).accuracy) }"
            >
              正确率 {{ store.yearStats(year).accuracy }}%
            </span>
          </span>
          <span class="year-toggle">{{ expandedYear === year ? '▲' : '▼' }}</span>
        </div>

        <div v-show="expandedYear === year" class="passage-grid">
          <div
            v-for="text in TEXTS_PER_YEAR"
            :key="text"
            class="passage-chip"
            :class="{ done: passageState(year, text).done }"
            @click="openEdit(year, text)"
          >
            <div class="passage-name">Text {{ text }}</div>
            <div class="passage-info">
              <template v-if="passageState(year, text).done">
                ✅ {{ passageState(year, text).correct }}/5
              </template>
              <template v-else>⬜ 未做</template>
            </div>
            <div v-if="passageState(year, text).notes" class="passage-note">📝 有笔记</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editVisible" :title="`${editing?.year} 年 Text ${editing?.text}`" width="400px">
      <el-form label-position="top">
        <el-form-item label="完成状态">
          <el-switch v-model="editDone" active-text="已完成" inactive-text="未做" />
        </el-form-item>
        <el-form-item v-if="editDone" label="正确题数（共5题）">
          <el-rate v-model="editCorrect" :max="5" show-score />
        </el-form-item>
        <el-form-item label="生词 / 长难句笔记（可选）">
          <el-input
            v-model="editNotes"
            type="textarea"
            :rows="4"
            placeholder="记录本篇的生词、长难句、易错点..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.reading-log {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.overall-card {
  display: flex;
  align-items: center;
  gap: 24px;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border: 2px solid #67c23a;
  border-radius: 16px;
  padding: 20px 24px;
}
.overall-left {
  text-align: center;
}
.overall-num {
  font-size: 2.2em;
  font-weight: 700;
  color: #2e7d32;
  line-height: 1;
}
.overall-total {
  font-size: 0.5em;
  color: #303133;
  font-weight: 500;
}
.overall-label {
  color: #303133;
  font-size: 0.85em;
  margin-top: 6px;
}
.overall-right {
  flex: 1;
}
.overall-bar-track {
  height: 12px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  overflow: hidden;
}
.overall-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #67c23a, #95d475);
  border-radius: 6px;
  transition: width 0.3s ease;
}
.overall-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  color: #303133;
  font-size: 0.85em;
}

.year-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.year-card {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  overflow: hidden;
}
.year-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}
.year-head:hover {
  background: #f5f7fa;
}
.year-name {
  font-weight: 700;
  color: #303133;
  min-width: 70px;
}
.year-stats {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 0.88em;
}
.year-done {
  color: #303133;
}
.year-acc {
  font-weight: 600;
}
.year-toggle {
  color: #67c23a;
  font-size: 0.8em;
}

.passage-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 0 16px 16px;
}
.passage-chip {
  border: 1px solid #dcdfe6;
  border-radius: 10px;
  padding: 12px 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #fafbfc;
}
.passage-chip:hover {
  border-color: #67c23a;
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}
.passage-chip.done {
  background: #f0f9eb;
  border-color: #b3e19d;
}
.passage-name {
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}
.passage-info {
  font-size: 0.82em;
  color: #303133;
}
.passage-note {
  font-size: 0.72em;
  color: #e6a23c;
  margin-top: 4px;
}

@media (max-width: 600px) {
  .overall-card {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
  }
  .passage-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
