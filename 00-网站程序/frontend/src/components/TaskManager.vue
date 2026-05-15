<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElDialog, ElButton, ElInput, ElSelect, ElOption, ElDatePicker, ElCheckbox, ElTag, ElMessage, ElSlider } from 'element-plus'
import { Plus, Edit, Delete, Check, Clock, Calendar, Warning, Search } from '@element-plus/icons-vue'
import { useTaskStore, type Task } from '@/stores/tasks'

const taskStore = useTaskStore()

// 状态管理
const showDialog = ref(false)
const isEditing = ref(false)
const currentTaskId = ref<number | null>(null)
const searchKeyword = ref('')
const filterSubject = ref('')
const filterStatus = ref('all') // all, completed, pending

// 表单数据
const taskForm = ref({
  title: '',
  description: '',
  priority: 'medium',
  subject: '',
  startDate: '',
  dueDate: '',
  estimatedDuration: '',
  progress: 0
})

// 表单验证规则
const formRules = {
  title: [{ required: true, message: '请输入任务标题', trigger: 'blur' }],
  subject: [{ required: true, message: '请选择所属科目', trigger: 'change' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }]
}

// 计算属性
const todayTasks = computed(() => {
  return taskStore.todayTasks
})

const allTasks = computed(() => {
  return taskStore.tasks
})

const completedTasks = computed(() => {
  return taskStore.completedTasks
})

const pendingTasks = computed(() => {
  return taskStore.pendingTasks
})

const sortedTodayTasks = computed(() => {
  return [...todayTasks.value].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
})

const sortedAllTasks = computed(() => {
  return [...allTasks.value].sort((a, b) => {
    // 首先按完成状态排序（未完成在前）
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    // 然后按截止日期排序
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }
    // 没有截止日期的任务排在后面
    if (a.dueDate) return -1
    if (b.dueDate) return 1
    // 最后按优先级排序
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
})

// 过滤后的任务
const filteredTasks = computed(() => {
  let tasks = [...sortedAllTasks.value]
  
  // 按关键字搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    tasks = tasks.filter(task => 
      task.title.toLowerCase().includes(keyword) ||
      (task.description && task.description.toLowerCase().includes(keyword)) ||
      task.subject.toLowerCase().includes(keyword)
    )
  }
  
  // 按科目过滤
  if (filterSubject.value) {
    tasks = tasks.filter(task => task.subject === filterSubject.value)
  }
  
  // 按状态过滤
  if (filterStatus.value === 'completed') {
    tasks = tasks.filter(task => task.completed)
  } else if (filterStatus.value === 'pending') {
    tasks = tasks.filter(task => !task.completed)
  }
  
  return tasks
})

const completedFilteredTasks = computed(() => {
  return filteredTasks.value.filter(task => task.completed)
})

const pendingFilteredTasks = computed(() => {
  return filteredTasks.value.filter(task => !task.completed)
})

const taskStats = computed(() => {
  const total = todayTasks.value.length
  const completed = todayTasks.value.filter(task => task.completed).length
  const pending = total - completed
  return { total, completed, pending }
})

// 方法
const openCreateDialog = () => {
  isEditing.value = false
  currentTaskId.value = null
  resetForm()
  showDialog.value = true
}

const openEditDialog = (task: any) => {
  isEditing.value = true
  currentTaskId.value = task.id
  taskForm.value = {
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    subject: task.subject,
    startDate: task.startDate || '',
    dueDate: task.dueDate || '',
    estimatedDuration: task.estimatedDuration || '',
    progress: task.progress || 0
  }
  showDialog.value = true
}

const resetForm = () => {
  taskForm.value = {
    title: '',
    description: '',
    priority: 'medium',
    subject: '',
    startDate: '',
    dueDate: '',
    estimatedDuration: '',
    progress: 0
  }
}

const handleSubmit = async () => {
  try {
    // 明确指定类型以解决类型兼容性问题
    const formData: Omit<Task, 'id' | 'completed' | 'createdAt' | 'updatedAt'> = {
      title: taskForm.value.title,
      description: taskForm.value.description,
      priority: taskForm.value.priority as 'high' | 'medium' | 'low',
      subject: taskForm.value.subject as '408计算机' | '数学一' | '英语一' | '政治',
      startDate: taskForm.value.startDate || undefined,
      dueDate: taskForm.value.dueDate || undefined,
      estimatedDuration: taskForm.value.estimatedDuration || undefined,
      progress: taskForm.value.progress
    }
    
    if (isEditing.value && currentTaskId.value) {
      await taskStore.updateTask(currentTaskId.value, formData)
      ElMessage.success('任务更新成功')
    } else {
      await taskStore.addTask(formData)
      ElMessage.success('任务创建成功')
    }
    showDialog.value = false
    resetForm()
  } catch (error) {
    ElMessage.error('操作失败，请重试')
  }
}

const handleDelete = async (taskId: number) => {
  try {
    await taskStore.deleteTask(taskId)
    ElMessage.success('任务删除成功')
  } catch (error) {
    ElMessage.error('删除失败，请重试')
  }
}

const toggleTaskCompletion = async (taskId: number) => {
  try {
    await taskStore.toggleTask(taskId)
    // TODO: 同步更新学习统计
  } catch (error) {
    ElMessage.error('状态更新失败')
  }
}

const getPriorityTagType = (priority: string) => {
  const types: Record<string, 'danger' | 'warning' | 'success'> = {
    'high': 'danger',
    'medium': 'warning',
    'low': 'success'
  }
  return types[priority] || 'info'
}

const getSubjectColor = (subject: string) => {
  const colors: Record<string, string> = {
    '408计算机': '#409EFF',
    '数学一': '#67C23A',
    '英语一': '#E6A23C',
    '政治': '#F56C6C'
  }
  return colors[subject] || '#909399'
}

const isTaskOverdue = (task: any) => {
  return taskStore.isTaskOverdue(task)
}

const getRemainingDays = (task: any) => {
  return taskStore.getRemainingDays(task)
}

onMounted(() => {
  taskStore.loadTasks()
})
</script>

<template>
  <div class="task-manager">
    <!-- 任务概览卡片 -->
    <div class="section-card task-overview">
      <div class="overview-header">
        <h2 class="section-title">📋 学习任务管理</h2>
        <div class="stats-summary">
          <div class="stat-item">
            <span class="stat-number">{{ filteredTasks.length }}</span>
            <span class="stat-label">总任务</span>
          </div>
          <div class="stat-item">
            <span class="stat-number completed">{{ completedFilteredTasks.length }}</span>
            <span class="stat-label">已完成</span>
          </div>
          <div class="stat-item">
            <span class="stat-number pending">{{ pendingFilteredTasks.length }}</span>
            <span class="stat-label">待完成</span>
          </div>
        </div>
        <el-button 
          type="primary" 
          :icon="Plus" 
          @click="openCreateDialog"
          class="add-task-btn"
        >
          添加任务
        </el-button>
      </div>

      <!-- 过滤和搜索控件 -->
      <div class="filter-controls">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索任务标题、描述或科目..."
          clearable
          style="width: 300px; margin-right: 15px;"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-select 
          v-model="filterSubject" 
          placeholder="选择科目" 
          clearable 
          style="width: 150px; margin-right: 15px;"
        >
          <el-option label="数学一" value="数学一" />
          <el-option label="408计算机" value="408计算机" />
          <el-option label="英语一" value="英语一" />
          <el-option label="政治" value="政治" />
        </el-select>
        
        <el-select 
          v-model="filterStatus" 
          placeholder="任务状态" 
          style="width: 120px;"
        >
          <el-option label="全部" value="all" />
          <el-option label="已完成" value="completed" />
          <el-option label="待完成" value="pending" />
        </el-select>
      </div>

      <!-- 任务列表 -->
      <div class="task-list">
        <div 
          v-if="filteredTasks.length === 0" 
          class="empty-state"
        >
          <div class="empty-icon">
            <el-icon size="40" color="#909399"><Check /></el-icon>
          </div>
          <p>暂无学习任务</p>
          <span>您的2026年学习计划还未加载，请刷新页面或联系管理员</span>
        </div>

        <div 
          v-else
          v-for="task in filteredTasks" 
          :key="task.id"
          class="task-card"
          :class="{ 'completed': task.completed }"
        >
          <div class="task-main">
            <el-checkbox 
              :model-value="task.completed"
              @change="toggleTaskCompletion(task.id)"
              class="task-checkbox"
            />
            
            <div class="task-content">
              <h3 class="task-title">{{ task.title }}</h3>
              <p v-if="task.description" class="task-description">{{ task.description }}</p>
              
              <div class="task-meta">
                <el-tag 
                  :type="getPriorityTagType(task.priority)"
                  size="small"
                  class="meta-tag"
                >
                  {{ taskStore.getPriorityText(task.priority) }}
                </el-tag>
                
                <el-tag 
                  :color="getSubjectColor(task.subject)"
                  size="small"
                  class="meta-tag subject-tag"
                >
                  {{ task.subject }}
                </el-tag>
                
                <span v-if="task.estimatedDuration" class="duration">
                  <el-icon><Clock /></el-icon>
                  {{ task.estimatedDuration }}分钟
                </span>
                
                <span v-if="task.startDate" class="date-range">
                  <el-icon><Calendar /></el-icon>
                  {{ task.startDate }} 至 {{ task.dueDate }}
                </span>
                
                <span v-if="isTaskOverdue(task)" class="overdue-warning">
                  <el-icon color="#F56C6C"><Warning /></el-icon>
                  已逾期 {{ Math.abs(getRemainingDays(task)) }} 天
                </span>
                
                <span v-else-if="task.dueDate" class="remaining-days">
                  剩余 {{ getRemainingDays(task) }} 天
                </span>
              </div>
            </div>
          </div>
          
          <div class="task-actions">
            <el-button 
              :icon="Edit" 
              size="small" 
              @click="openEditDialog(task)"
              class="action-btn"
            >
              编辑
            </el-button>
            <el-button 
              :icon="Delete" 
              size="small" 
              type="danger"
              @click="handleDelete(task.id)"
              class="action-btn"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 任务创建/编辑对话框 -->
    <el-dialog
      v-model="showDialog"
      :title="isEditing ? '编辑任务' : '创建新任务'"
      width="500px"
      class="task-dialog"
    >
      <el-form 
        :model="taskForm" 
        :rules="formRules"
        label-position="top"
        ref="taskFormRef"
      >
        <el-form-item label="任务标题" prop="title">
          <el-input
            v-model="taskForm.title"
            placeholder="请输入任务标题"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="任务描述" prop="description">
          <el-input
            v-model="taskForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入任务详细描述（可选）"
          />
        </el-form-item>
        
        <div class="form-row">
          <el-form-item label="优先级" prop="priority" class="form-item-half">
            <el-select v-model="taskForm.priority" placeholder="选择优先级">
              <el-option label="高优先级" value="high" />
              <el-option label="中优先级" value="medium" />
              <el-option label="低优先级" value="low" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="所属科目" prop="subject" class="form-item-half">
            <el-select v-model="taskForm.subject" placeholder="选择科目">
              <el-option label="408计算机" value="408计算机" />
              <el-option label="数学一" value="数学一" />
              <el-option label="英语一" value="英语一" />
              <el-option label="政治" value="政治" />
            </el-select>
          </el-form-item>
        </div>
        
        <div class="form-row">
          <el-form-item label="开始日期" prop="startDate" class="form-item-half">
            <el-date-picker
              v-model="taskForm.startDate"
              type="date"
              placeholder="选择开始日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
          
          <el-form-item label="截止日期" prop="dueDate" class="form-item-half">
            <el-date-picker
              v-model="taskForm.dueDate"
              type="date"
              placeholder="选择截止日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </div>

        <el-form-item label="任务进度" prop="progress">
          <el-slider
            v-model="taskForm.progress"
            :min="0"
            :max="100"
            show-input
            show-stops
          />
        </el-form-item>

        <el-form-item label="预计时长（分钟）" prop="estimatedDuration" class="form-item-half">
          <el-input
            v-model="taskForm.estimatedDuration"
            placeholder="如：60"
            type="number"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button 
          type="primary" 
          @click="handleSubmit"
        >
          {{ isEditing ? '更新任务' : '创建任务' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.task-manager {
  width: 100%;
}

/* 任务概览卡片 */
.task-overview {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  padding: 25px;
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(0, 0, 0, 0.02);
  margin-bottom: 25px;
  transition: all 0.3s ease;
}

.task-overview:hover {
  box-shadow: 
    0 8px 30px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(0, 0, 0, 0.03);
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.06);
  flex-wrap: wrap;
  gap: 15px;
}

.section-title {
  color: #2c3e50;
  margin: 0;
  font-size: 1.5em;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stats-summary {
  display: flex;
  gap: 25px;
}

.stat-item {
  text-align: center;
  min-width: 60px;
}

.stat-number {
  display: block;
  font-size: 1.8em;
  font-weight: 700;
  line-height: 1;
  color: #667eea;
}

.stat-number.completed {
  color: #67C23A;
}

.stat-number.pending {
  color: #E6A23C;
}

.stat-label {
  font-size: 0.85em;
  opacity: 0.8;
  font-weight: 500;
  color: #666666;
}

.add-task-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.add-task-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

/* 过滤控件样式 */
.filter-controls {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
  flex-wrap: wrap;
  gap: 10px;
}

/* 任务列表 */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-icon {
  margin-bottom: 20px;
}

.empty-state p {
  font-size: 1.2em;
  margin: 15px 0 10px 0;
  color: #666666;
}

.empty-state span {
  font-size: 0.95em;
  color: #999999;
}

/* 任务卡片 */
.task-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  gap: 15px;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.95);
}

.task-card.completed {
  opacity: 0.7;
  background: #f0f9f0;
  border-color: #d1f3d1;
}

.task-main {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  flex: 1;
  min-width: 0;
}

.task-checkbox {
  margin-top: 3px;
  flex-shrink: 0;
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-title {
  margin: 0 0 8px 0;
  font-size: 1.1em;
  font-weight: 600;
  color: #333333;
  text-decoration: none;
}

.task-card.completed .task-title {
  text-decoration: line-through;
  color: #666666;
}

.task-description {
  margin: 0 0 12px 0;
  font-size: 0.95em;
  color: #666666;
  line-height: 1.5;
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.meta-tag {
  height: 24px;
  line-height: 22px;
}

.subject-tag {
  color: white !important;
  border: none;
}

.duration, .due-date {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85em;
  color: #666666;
}

.task-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.action-btn {
  padding: 8px 16px;
  font-size: 0.9em;
}

/* 表单样式 */
.form-row {
  display: flex;
  gap: 20px;
}

.form-item-half {
  flex: 1;
}

/* 对话框样式 */
.task-dialog :deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
}

.task-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
}

.task-dialog :deep(.el-dialog__title) {
  color: white;
  font-weight: 600;
}

.task-dialog :deep(.el-dialog__body) {
  padding: 25px;
}

.task-dialog :deep(.el-dialog__footer) {
  padding: 15px 25px 25px;
  background: #f8f9fa;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .overview-header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .stats-summary {
    justify-content: center;
    gap: 15px;
  }
  
  .task-card {
    flex-direction: column;
    align-items: stretch;
  }
  
  .task-main {
    margin-bottom: 15px;
  }
  
  .task-actions {
    align-self: flex-end;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .task-dialog {
    width: 95% !important;
    margin: 0 10px;
  }
}

@media (max-width: 480px) {
  .task-overview {
    padding: 20px 15px;
  }
  
  .stats-summary {
    gap: 12px;
  }
  
  .stat-item {
    min-width: 50px;
  }
  
  .stat-number {
    font-size: 1.5em;
  }
  
  .task-card {
    padding: 15px;
  }
  
  .task-content {
    min-width: 0;
  }
  
  .task-title {
    font-size: 1em;
  }
  
  .task-meta {
    gap: 8px;
  }
}
</style>