<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  useMaterialsStore,
  MATERIAL_SUBJECTS,
  type Material,
  type MaterialSubject
} from '@/stores/materials'

const store = useMaterialsStore()

// ---------- 新增 ----------
const addVisible = ref(false)
const addForm = ref({ subject: 'math' as MaterialSubject, name: '', note: '' })
function confirmAdd() {
  if (!addForm.value.name.trim()) {
    ElMessage.warning('请填写资料名称')
    return
  }
  store.addMaterial({
    subject: addForm.value.subject,
    name: addForm.value.name.trim(),
    unit: '项',
    total: 1,
    done: 0,
    note: addForm.value.note
  })
  ElMessage.success('资料已添加')
  addForm.value = { subject: 'math', name: '', note: '' }
  addVisible.value = false
}

// ---------- 编辑（只改名与备注） ----------
const editVisible = ref(false)
const editing = ref<Material | null>(null)
const editName = ref('')
const editNote = ref('')
function openEdit(m: Material) {
  editing.value = m
  editName.value = m.name
  editNote.value = m.note || ''
  editVisible.value = true
}
function confirmEdit() {
  if (editing.value) {
    store.rename(editing.value, editName.value, editNote.value)
    ElMessage.success('已更新')
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
</script>

<template>
  <div class="materials-wall">
    <div class="wall-top">
      <div class="wall-summary">
        <span class="sum-item">共 <strong>{{ store.overall.total }}</strong> 份资料</span>
      </div>
      <el-button type="primary" size="small" round @click="addVisible = true">＋ 添加资料</el-button>
    </div>

    <p class="wall-hint">
      这里只记「手头有哪些资料」。做题进度以 <b>100 天作战计划 / 今日任务</b> 为准。
    </p>

    <div v-for="sub in MATERIAL_SUBJECTS" :key="sub.key" class="subject-group">
      <template v-if="store.bySubject(sub.key).value.length">
        <div class="subject-title" :style="{ color: sub.color }">
          {{ sub.icon }} {{ sub.name }}
          <span class="subject-count">{{ store.bySubject(sub.key).value.length }} 项</span>
        </div>
        <div class="material-list">
          <div v-for="m in store.bySubject(sub.key).value" :key="m.id" class="material-row">
            <div class="mat-main">
              <span class="mat-name">{{ m.name }}</span>
              <span v-if="m.note" class="mat-note">{{ m.note }}</span>
            </div>
            <div class="mat-actions">
              <button class="row-btn" title="编辑" @click="openEdit(m)">✎</button>
              <button class="row-btn danger" title="删除" @click="handleRemove(m)">✕</button>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editVisible" title="编辑资料" width="360px">
      <el-form label-position="top">
        <el-form-item label="名称">
          <el-input v-model="editName" placeholder="资料名称" />
        </el-form-item>
        <el-form-item label="备注（可选）">
          <el-input v-model="editNote" type="textarea" :rows="2" placeholder="例如：11月出版 / 已刷两轮" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmEdit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 新增弹窗 -->
    <el-dialog v-model="addVisible" title="添加资料" width="400px">
      <el-form label-position="top">
        <el-form-item label="科目">
          <el-select v-model="addForm.subject" style="width: 100%">
            <el-option v-for="s in MATERIAL_SUBJECTS" :key="s.key" :label="s.icon + ' ' + s.name" :value="s.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="资料名称">
          <el-input v-model="addForm.name" placeholder="例如：张宇8套卷" />
        </el-form-item>
        <el-form-item label="备注（可选）">
          <el-input v-model="addForm.note" type="textarea" :rows="2" placeholder="例如：11月出版" />
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
  gap: 14px;
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
.wall-hint {
  margin: 0;
  font-size: 0.82em;
  color: #909399;
  line-height: 1.5;
}
.wall-hint b { color: #606266; }

.subject-group {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #ebeef5;
  padding: 14px;
}
.subject-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 1.05em;
  margin-bottom: 10px;
}
.subject-count {
  font-size: 0.72em;
  font-weight: 500;
  color: #909399;
  background: #f4f7fb;
  border-radius: 999px;
  padding: 2px 9px;
}

.material-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.material-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 10px;
  border-radius: 10px;
  transition: background 0.2s;
}
.material-row:hover {
  background: #f7f9fc;
}
.mat-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.mat-name {
  font-weight: 600;
  color: #303133;
}
.mat-note {
  font-size: 0.82em;
  color: #909399;
}

.mat-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.55;
  transition: opacity 0.2s;
}
.material-row:hover .mat-actions { opacity: 1; }
.row-btn {
  border: 1px solid #dcdfe6;
  background: #fff;
  color: #303133;
  border-radius: 8px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 0.85em;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.row-btn:hover { border-color: #ffc53d; color: #16345c; }
.row-btn.danger:hover { border-color: #f56c6c; color: #f56c6c; }

@media (max-width: 600px) {
  .mat-actions { opacity: 1; }
}
</style>
