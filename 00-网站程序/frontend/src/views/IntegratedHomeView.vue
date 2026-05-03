<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  Timer, 
  Calendar, 
  Document, 
  Plus, 
  Edit, 
  Delete, 
  Check,
  Guide,
  DataAnalysis,
  MagicStick
} from '@element-plus/icons-vue'
import { useStudyStore } from '@/stores/study'
import { useTodoStore } from '@/stores/todos'
import StatCard from '@/components/StatCard.vue'
import SubjectProgress from '@/components/SubjectProgress.vue'
import MonthlyCalendar from '@/components/MonthlyCalendar.vue'

const router = useRouter()
const studyStore = useStudyStore()
const todoStore = useTodoStore()

// 科目进度数据
const subjectProgressData = ref([
  {
    subject: '408计算机科学综合',
    progress: 75,
    timeSpent: 450,
    goalTime: 600,
    color: '#FF6B6B'
  },
  {
    subject: '数学一',
    progress: 68,
    timeSpent: 340,
    goalTime: 500,
    color: '#4CAF50'
  },
  {
    subject: '英语一',
    progress: 82,
    timeSpent: 246,
    goalTime: 300,
    color: '#2196F3'
  },
  {
    subject: '政治',
    progress: 55,
    timeSpent: 220,
    goalTime: 400,
    color: '#FF9800'
  }
])

// 状态管理
const showAddDialog = ref(false)
const editingTodo = ref(false)
const todoForm = ref({
  title: '',
  description: '',
  priority: 'medium' as 'high' | 'medium' | 'low',
  dueDate: '',
  category: ''
})
const formRules = ref({
  title: [{ required: true, message: '请输入任务标题', trigger: 'blur' }]
})
const submitLoading = ref(false)

// 方法
const handleStartStudy = () => {
  ElMessage.success('开始今日学习计划')
}

const goToTaskManagement = () => {
  router.push('/tasks')
}

const goToLearningPath = () => {
  router.push('/learning-path')
}

const goToAnalytics = () => {
  router.push('/analytics')
}

const goToPsychology = () => {
  router.push('/psychology')
}

const goToAttention = () => {
  router.push('/attention')
}

const addTodo = () => {
  if (!todoForm.value.title) {
    ElMessage.warning('请输入任务标题')
    return
  }
  
  const newTodo = {
    ...todoForm.value,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    completed: false
  }
  
  todoStore.addTodo(newTodo)
  resetForm()
  showAddDialog.value = false
}

const editTodo = (todo: any) => {
  editingTodo.value = true
  todoForm.value = { ...todo }
  showAddDialog.value = true
}

const deleteTodo = (id: string) => {
  todoStore.deleteTodo(id)
}

const resetForm = () => {
  todoForm.value = {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: ''
  }
  editingTodo.value = false
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

onMounted(() => {
  // 初始化学习数据
  studyStore.initializeStudyData()
  
  // 初始化示例待办事项
  initializeSampleTodos()
})

const initializeSampleTodos = () => {
  // 如果没有待办事项，添加一些示例数据
  if (todoStore.todos.length === 0) {
    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    
    // 今天的待办事项
    todoStore.addTodo({
      title: '完成数据结构第一章复习',
      description: '复习线性表的基本操作和应用场景',
      completed: false,
      priority: 'high',
      dueDate: today,
      category: '408计算机科学综合',
      estimatedDuration: 90
    })
    
    todoStore.addTodo({
      title: '做高等数学极限练习题',
      description: '完成课后习题1-10题',
      completed: false,
      priority: 'medium',
      dueDate: today,
      category: '数学一',
      estimatedDuration: 60
    })
    
    // 明天的待办事项
    todoStore.addTodo({
      title: '背诵英语单词50个',
      description: '重点记忆高频词汇',
      completed: false,
      priority: 'medium',
      dueDate: tomorrow,
      category: '英语一',
      estimatedDuration: 45
    })
    
    // 昨天的已完成事项
    todoStore.addTodo({
      title: '完成政治马原第一章学习',
      description: '学习马克思主义哲学基本原理',
      completed: true,
      priority: 'high',
      dueDate: yesterday,
      category: '政治',
      estimatedDuration: 120
    })
    
    // 生活类代办事项 - 半程马拉松
    const marathonDate = '2026-03-29'
    todoStore.addTodo({
      title: '参加梦想小镇半程马拉松',
      description: '参加杭州梦想小镇半程马拉松比赛，目标完赛时间2小时30分',
      completed: false,
      priority: 'high',
      dueDate: marathonDate,
      category: '运动健身',
      estimatedDuration: 180
    })
  }
}
</script>

<template>
  <div class="home-container">
    <!-- 顶部欢迎概览区 -->
    <div class="welcome-overview">
      <div class="overview-content">
        <div class="overview-stats">
          <div class="stat-item">
            <div class="stat-value">{{ studyStore.todayStudyTime }}</div>
            <div class="stat-label">今日学习(分钟)</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ studyStore.currentStreak }}</div>
            <div class="stat-label">连续学习天</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ studyStore.studyRecords.length }}</div>
            <div class="stat-label">总任务数</div>
          </div>
        </div>
        <div class="quick-actions">
          <el-button type="primary" @click="goToLearningPath">
            <el-icon><Guide /></el-icon>
            学习路径
          </el-button>
          <el-button type="success" @click="goToAnalytics">
            <el-icon><DataAnalysis /></el-icon>
            数据统计
          </el-button>
          <el-button type="warning" @click="goToPsychology">
            <el-icon><MagicStick /></el-icon>
            心理干预
          </el-button>
          <el-button type="info" @click="goToAttention">
            <el-icon><Timer /></el-icon>
            注意力
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧：今日待办 -->
      <div class="left-panel">
        <div class="panel-card">
          <div class="panel-header">
            <h3 class="panel-title">📋 今日待办</h3>
            <el-badge :value="todoStore.todayTodos.filter(t => !t.completed).length" type="primary">
              <el-button type="primary" circle @click="showAddDialog = true">
                <el-icon><Plus /></el-icon>
              </el-button>
            </el-badge>
          </div>
          <div class="todo-content">
            <div 
              v-if="todoStore.todayTodos.length === 0" 
              class="empty-state"
            >
              <el-icon size="48" color="#999"><Check /></el-icon>
              <h4>今日无待办事项</h4>
              <p>做得好！可以添加新的学习任务</p>
            </div>
            
            <div 
              v-else 
              class="todo-list"
            >
              <div 
                v-for="todo in todoStore.todayTodos" 
                :key="todo.id"
                class="todo-item"
                :class="{ completed: todo.completed }"
              >
                <el-checkbox 
                  :model-value="todo.completed"
                  @change="todoStore.toggleTodo(todo.id)"
                  size="large"
                />
                
                <div class="todo-main">
                  <div class="todo-header">
                    <h4 class="todo-title">{{ todo.title }}</h4>
                    <div class="todo-tags">
                      <el-tag 
                        :color="todoStore.getPriorityColor(todo.priority)"
                        effect="dark"
                        size="small"
                      >
                        {{ todoStore.getPriorityText(todo.priority) }}
                      </el-tag>
                      <span v-if="todo.category" class="todo-category">
                        {{ todo.category }}
                      </span>
                    </div>
                  </div>
                  <p v-if="todo.description" class="todo-desc">{{ todo.description }}</p>
                </div>
                
                <div class="todo-actions">
                  <el-button 
                    size="small" 
                    @click="editTodo(todo)"
                    circle
                  >
                    <el-icon><Edit /></el-icon>
                  </el-button>
                  <el-button 
                    size="small" 
                    type="danger"
                    @click="deleteTodo(todo.id)"
                    circle
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧：学习统计和日历 -->
      <div class="right-panel">
        <!-- 学习统计卡片 -->
        <div class="panel-card stats-grid">
          <div class="stat-card">
            <div class="stat-icon primary">
              <el-icon><Timer /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ studyStore.todayStudyTime }}</div>
              <div class="stat-text">今日学习分钟</div>
              <div class="stat-trend up">↑ 15%</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon success">
              <el-icon><Calendar /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ studyStore.currentStreak }}</div>
              <div class="stat-text">连续学习天数</div>
              <div class="stat-trend stable">→ 稳定</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon warning">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ studyStore.studyRecords.length }}</div>
              <div class="stat-text">已完成任务</div>
              <div class="stat-trend up">↑ 8%</div>
            </div>
          </div>
        </div>
        
        <!-- 本月日历 -->
        <div class="panel-card calendar-card">
          <div class="panel-header">
            <h3 class="panel-title">📅 本月学习日历</h3>
          </div>
          <MonthlyCalendar />
        </div>
      </div>
    </div>

    <!-- 添加任务对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingTodo ? '编辑任务' : '添加任务'"
      width="500px"
      @close="resetForm"
    >
      <el-form
        :model="todoForm"
        :rules="formRules"
        ref="formRef"
        label-width="80px"
      >
        <el-form-item label="任务标题" prop="title">
          <el-input
            v-model="todoForm.title"
            placeholder="请输入任务标题"
          />
        </el-form-item>
        
        <el-form-item label="任务描述">
          <el-input
            v-model="todoForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入任务描述（可选）"
          />
        </el-form-item>
        
        <el-form-item label="优先级">
          <el-select v-model="todoForm.priority" placeholder="请选择优先级">
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="截止日期">
          <el-date-picker
            v-model="todoForm.dueDate"
            type="date"
            placeholder="请选择截止日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        
        <el-form-item label="科目分类">
          <el-select v-model="todoForm.category" placeholder="请选择科目（可选）">
            <el-option label="408计算机科学综合" value="408计算机科学综合" />
            <el-option label="数学一" value="数学一" />
            <el-option label="英语一" value="英语一" />
            <el-option label="政治" value="政治" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="addTodo"
            :loading="submitLoading"
          >
            {{ editingTodo ? '更新' : '添加' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.home-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

// 顶部欢迎概览区
.welcome-overview {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  color: white;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  
  .overview-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .overview-stats {
    display: flex;
    gap: 32px;
    
    .stat-item {
      text-align: center;
      
      .stat-value {
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 4px;
        font-family: 'FZCuHei', monospace;
      }
      
      .stat-label {
        font-size: 14px;
        opacity: 0.9;
      }
    }
  }
  
  .quick-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    
    .el-button {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      min-width: 120px;
      
      &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
      }
    }
    
    .el-button[type='success'] {
      background: rgba(76, 175, 80, 0.2);
      border-color: rgba(76, 175, 80, 0.3);
      
      &:hover {
        background: rgba(76, 175, 80, 0.3);
      }
    }
    
    .el-button[type='warning'] {
      background: rgba(255, 152, 0, 0.2);
      border-color: rgba(255, 152, 0, 0.3);
      
      &:hover {
        background: rgba(255, 152, 0, 0.3);
      }
    }
    
    .el-button[type='info'] {
      background: rgba(33, 150, 243, 0.2);
      border-color: rgba(33, 150, 243, 0.3);
      
      &:hover {
        background: rgba(33, 150, 243, 0.3);
      }
    }
  }
}

// 主要内容区域
.main-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;
}

// 面板卡片通用样式
.panel-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 16px;
  border-bottom: 1px solid #f0f0f0;
  
  .panel-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
}

// 左侧面板 - 待办事项
.left-panel {
  .todo-content {
    padding: 20px;
  }
  
  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #999;
    
    h4 {
      margin: 12px 0 8px;
      color: #666;
      font-size: 16px;
      font-weight: 500;
    }
    
    p {
      margin: 0;
      font-size: 13px;
    }
  }
  
  .todo-list {
    .todo-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      border: 1px solid #f0f0f0;
      border-radius: 8px;
      margin-bottom: 12px;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: #e0e0e0;
        background-color: #fafafa;
      }
      
      &.completed {
        opacity: 0.7;
        background-color: #f8f9fa;
        
        .todo-title {
          text-decoration: line-through;
          color: #999;
        }
      }
      
      .todo-main {
        flex: 1;
        min-width: 0;
        
        .todo-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
          gap: 12px;
          
          .todo-title {
            margin: 0;
            font-size: 15px;
            font-weight: 500;
            color: #333;
            flex: 1;
            line-height: 1.4;
          }
          
          .todo-tags {
            display: flex;
            gap: 6px;
            align-items: center;
            flex-shrink: 0;
            
            .todo-category {
              font-size: 11px;
              color: #666;
              background: #f0f0f0;
              padding: 2px 6px;
              border-radius: 3px;
            }
          }
        }
        
        .todo-desc {
          margin: 0 0 10px 0;
          font-size: 13px;
          color: #666;
          line-height: 1.5;
        }
      }
      
      .todo-actions {
        display: flex;
        gap: 6px;
        align-self: flex-start;
        opacity: 0;
        transition: opacity 0.3s ease;
        
        .el-button {
          padding: 6px;
          font-size: 12px;
        }
      }
      
      &:hover .todo-actions {
        opacity: 1;
      }
    }
  }
}

// 右侧面板
.right-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

// 统计卡片网格
.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 20px;
  
  .stat-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border-radius: 10px;
    background: #f8f9fa;
    
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
      
      &.primary {
        background: linear-gradient(135deg, #4285f4, #64b5f6);
      }
      
      &.success {
        background: linear-gradient(135deg, #4caf50, #81c784);
      }
      
      &.warning {
        background: linear-gradient(135deg, #ff9800, #ffb74d);
      }
    }
    
    .stat-info {
      flex: 1;
      
      .stat-number {
        font-size: 24px;
        font-weight: 700;
        color: #ffffff !important;
        margin-bottom: 4px;
        font-family: 'FZCuHei', monospace;
      }
      
      .stat-text {
        font-size: 13px;
        color: #666;
        margin-bottom: 4px;
      }
      
      .stat-trend {
        font-size: 12px;
        font-weight: 500;
        
        &.up {
          color: #4caf50;
        }
        
        &.stable {
          color: #ff9800;
        }
      }
    }
  }
}

// 日历卡片
.calendar-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  
  :deep(.el-calendar) {
    border: none;
    
    .el-calendar__header {
      padding: 16px 20px;
    }
    
    .el-calendar__body {
      padding: 0 20px 20px;
    }
  }
}

// 对话框样式
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

// 响应式设计
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .right-panel {
    flex-direction: row;
    
    .stats-grid {
      flex: 1;
    }
    
    .calendar-card {
      flex: 1;
    }
  }
}

@media (max-width: 768px) {
  .home-container {
    padding: 16px;
  }
  
  .welcome-overview {
    padding: 20px;
    
    .overview-content {
      flex-direction: column;
      align-items: stretch;
    }
    
    .overview-stats {
      justify-content: space-around;
      gap: 20px;
      
      .stat-item {
        .stat-value {
          font-size: 28px;
        }
      }
    }
    
    .quick-actions {
      justify-content: center;
    }
  }
  
  .right-panel {
    flex-direction: column;
  }
  
  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 16px;
  }
}
</style>