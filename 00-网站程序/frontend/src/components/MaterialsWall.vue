<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  useMaterialsStore,
  MATERIAL_SUBJECTS,
  materialStatus,
  type Material,
  type MaterialSubject
} from '@/stores/materials'

const store = useMaterialsStore()

const statusMap = {
  todo: { icon: '⬜', label: '未开始', cls: 'ms-todo' },
  doing: { icon: '🔄', label: '进行中', cls: 'ms-doing' },
  done: { icon: '✅', label: '已完成', cls: 'ms-done' }
}

function subjectMeta(key: MaterialSubject) {
  return MATERIAL_SUBJECTS.find(s => s.key === key)!
}

function percent(m: Material) {
  return m.total ? Math.round((m.done / m.total) * 100) : 0
}

// ---------- 编辑弹窗 ----------
const editVisible = ref(false)
const editing = ref<Material | null>(null)
const editDone = ref(0)
const editTotal = ref(1)

function openEdit(m: Material) {
  editing.value = m
  editDone.value = m.done
  editTotal.value = m.total
  editVisible.value = true
}

function confirmEdit() {
  if (editing.value) {
    store.update(editing.value, editDone.value, editTotal.value)
    ElMessage.success('进度已更新')
  }
  editVisible.value = false
}

function handleRemove(m: Material) {
  ElMessageBox.confirm(`确定删除资料「${m.name}」吗？`, '删除确认', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      store.removeMaterial(m.id)
      ElMessage.success('已删除')
    })
    .catch(() => {})
}

// ---------- 新增弹窗 ----------
const addVisible = ref(false)
const addForm = ref({
  subject: 'math' as MaterialSubject,
  name: '',
  unit: '套',
  total: 10,
  note: ''
})

function confirmAdd() {
  if (!addForm.value.name.trim()) {
    ElMessage.warning('请填写资料名称')
    return
  }
  store.addMaterial({
    subject: addForm.value.subject,
    name: addForm.value.name.trim(),
    unit: addForm.value.unit || '套',
    total: Math.max(1, addForm.value.total),
    done: 0,
    note: addForm.value.note
  })
  ElMessage.success('资料已添加')
  addForm.value = { subject: 'math', name: '', unit: '套', total: 10, note: '' }
  addVisible.value = false
}
</script>

<template>
  <div class="materials-wall">
    <!-- 顶部统计 + 新增按钮 -->
    <div class="wall-top">
      <div class="wall-summary">
        <span class="sum-item">共 <strong>{{ store.overall.total }}</strong> 份资料</span>
        <span class="sum-item ms-done">✅ {{ store.overall.done }}</span>
        <span class="sum-item ms-doing">🔄 {{ store.overall.doing }}</span>
        <span class="sum-item ms-todo">⬜ {{ store.overall.todo }}</span>
      </div>
      <el-button type="primary" size="small" round @click="addVisible = true">＋ 新增资料</el-button>
    </div>

    <!-- 按科目分组 -->
    <div v-for="sub in MATERIAL_SUBJECTS" :key="sub.key" class="subject-group">
      <div class="subject-title" :style="{ color: sub.color }">
        {{ sub.icon }} {{ sub.name }}
      </div>
      <div class="material-list">
        <div
          v-for="m in store.bySubject(sub.key).value"
          :key="m.id"
          class="material-card"
          :class="statusMap[materialStatus(m)].cls"
        >
          <div class="mat-main">
            <div class="mat-head">
              <span class="mat-name">{{ m.name }}</span>
              <span class="mat-status">{{ statusMap[materialStatus(m)].icon }} {{ statusMap[materialStatus(m)].label }}</span>
            </div>
            <div v-if="m.note" class="mat-note">{{ m.note }}</div>
            <div class="mat-progress">
              <div class="mat-bar-track">
                <div class="mat-bar-fill" :style="{ width: percent(m) + '%', background: sub.color }"></div>
              </div>
              <span class="mat-count">{{ m.done }}/{{ m.total }} {{ m.unit }}</span>
            </div>
          </div>
          <div class="mat-actions">
            <button class="step-btn" @click="store.decrement(m)" :disabled="m.done <= 0">−</button>
            <button class="step-btn primary" @click="store.increment(m)" :disabled="m.done >= m.total">＋1</button>
            <button class="step-btn ghost" @click="openEdit(m)">✎</button>
            <button class="step-btn ghost danger" @click="handleRemove(m)">✕</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editVisible" title="修改进度" width="360px">
      <el-form label-position="top">
        <el-form-item :label="`已完成（${editing?.unit || ''}）`">
          <el-input-number v-model="editDone" :min="0" :max="editTotal" style="width: 100%" />
        </el-form-item>
        <el-form-item :label="`总量（${editing?.unit || ''}）`">
          <el-input-number v-model="editTotal" :min="1" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmEdit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 新增弹窗 -->
    <el-dialog v-model="addVisible" title="新增资料" width="400px">
      <el-form label-position="top">
        <el-form-item label="科目">
          <el-select v-model="addForm.subject" style="width: 100%">
            <el-option v-for="s in MATERIAL_SUBJECTS" :key="s.key" :label="s.icon + ' ' + s.name" :value="s.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="资料名称">
          <el-input v-model="addForm.name" placeholder="例如：张宇8套卷" />
        </el-form-item>
        <el-form-item label="进度单位">
          <el-input v-model="addForm.unit" placeholder="套 / 章 / 篇 / 讲" />
        </el-form-item>
        <el-form-item label="总量">
          <el-input-number v-model="addForm.total" :min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注（可选）">
          <el-input v-model="addForm.note" placeholder="例如：11月出版" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAdd">添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.materials-wall {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.wall-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}
.wall-summary {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #303133;
  font-size: 0.9em;
}
.sum-item strong {
  color: #16345c;
  font-size: 1.15em;
}

.subject-group {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #ebeef5;
  padding: 14px;
}
.subject-title {
  font-weight: 700;
  font-size: 1.05em;
  margin-bottom: 10px;
}

.material-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.material-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #ebeef5;
  background: #fafbfc;
  transition: box-shadow 0.2s;
}
.material-card:hover {
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}
.material-card.ms-done {
  background: #f0f9eb;
  border-color: #c2e7b0;
}

.mat-main {
  flex: 1;
  min-width: 0;
}
.mat-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.mat-name {
  font-weight: 600;
  color: #303133;
}
.mat-status {
  font-size: 0.8em;
  white-space: nowrap;
}
.ms-todo {
  color: #303133;
}
.ms-doing {
  color: #e6a23c;
}
.ms-done {
  color: #67c23a;
}
.mat-note {
  font-size: 0.8em;
  color: #303133;
  opacity: 0.7;
  margin-top: 2px;
}
.mat-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}
.mat-bar-track {
  flex: 1;
  height: 8px;
  background: #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}
.mat-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}
.mat-count {
  font-size: 0.82em;
  color: #303133;
  white-space: nowrap;
}

.mat-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}
.step-btn {
  border: 1px solid #dcdfe6;
  background: #fff;
  color: #303133;
  border-radius: 8px;
  width: 34px;
  height: 34px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.step-btn:hover:not(:disabled) {
  border-color: #ffc53d;
  color: #16345c;
}
.step-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.step-btn.primary {
  background: #16345c;
  border-color: #ffc53d;
  color: #fff;
  width: auto;
  padding: 0 12px;
  font-weight: 600;
}
.step-btn.primary:hover:not(:disabled) {
  background: #16345c;
  color: #fff;
}
.step-btn.ghost {
  background: transparent;
}
.step-btn.ghost.danger:hover {
  border-color: #f56c6c;
  color: #f56c6c;
}

@media (max-width: 600px) {
  .material-card {
    flex-direction: column;
    align-items: stretch;
  }
  .mat-actions {
    justify-content: flex-end;
  }
}
</style>
