<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton } from 'element-plus'
import { Timer, DataAnalysis, Guide, MagicStick, Plus } from '@element-plus/icons-vue'
import MonthlyCalendar from '@/components/MonthlyCalendar.vue'
import DailyPlanCard from '@/components/DailyPlanCard.vue'
import { useStudyStore } from '@/stores/study'
import { useTodoStore } from '@/stores/todos'
import { useTaskStore } from '@/stores/tasks'

const router = useRouter()
const studyStore = useStudyStore()
const todoStore = useTodoStore()
const taskStore = useTaskStore()

// 对话框相关状态
const showAddDialog = ref(false)
const showTaskManager = ref(false)
const newTodoText = ref('')
const newTodoPriority = ref('medium')
const newTodoCategory = ref('')

// 学习计划相关数据
const todayDate = ref(new Date().toISOString().split('T')[0])

// 快速学习记录对话框
const showStudyDialog = ref(false)
const studySubject = ref('408专业课')
const studyDuration = ref(25)
const studyContent = ref('')

const subjectOptions = [
  { label: '408专业课', value: '408专业课' },
  { label: '数学一', value: '数学一' },
  { label: '英语一', value: '英语一' },
  { label: '政治', value: '政治' }
]

const quickAddStudy = () => {
  if (!studyContent.value.trim()) {
    ElMessage.warning('请输入学习内容')
    return
  }
  
  const today = new Date().toISOString().split('T')[0]
  let studyData = JSON.parse(localStorage.getItem('studyData') || '{}')
  
  if (!studyData.studyRecords) {
    studyData.studyRecords = []
  }
  
  studyData.studyRecords.push({
    id: 'record_' + Date.now(),
    date: today,
    subject: studySubject.value,
    duration: studyDuration.value,
    content: studyContent.value.trim(),
    type: 'study',
    createdAt: new Date().toISOString()
  })
  
  localStorage.setItem('studyData', JSON.stringify(studyData))
  
  ElMessage.success(`✅ 已记录${studyDuration.value}分钟的${studySubject.value}学习！`)
  
  // 重置表单
  studyContent.value = ''
  studyDuration.value = 25
  showStudyDialog.value = false
}

// 自动记录今天的学习（首次加载时执行）
const autoRecordTodayStudy = () => {
  const today = new Date().toISOString().split('T')[0]
  let studyData = JSON.parse(localStorage.getItem('studyData') || '{}')
  
  if (!studyData.studyRecords) {
    studyData.studyRecords = []
  }
  
  // 检查今天是否已经记录过这两条
  const alreadyRecorded = studyData.studyRecords.some((record: any) => 
    record.date === today && 
    record.content.includes('第三章 存储器系统')
  )
  
  if (!alreadyRecorded) {
    // 记录第一次学习：16:00-16:25
    studyData.studyRecords.push({
      id: 'record_' + Date.now(),
      date: today,
      subject: '408专业课',
      duration: 25,
      content: '计算机组成原理 - 第三章 存储器系统',
      type: 'study',
      createdAt: new Date().toISOString()
    })
    
    // 记录第二次学习：16:30-16:55
    studyData.studyRecords.push({
      id: 'record_' + (Date.now() + 1),
      date: today,
      subject: '408专业课',
      duration: 25,
      content: '计算机组成原理 - 第四章 指令系统',
      type: 'study',
      createdAt: new Date().toISOString()
    })
    
    localStorage.setItem('studyData', JSON.stringify(studyData))
    console.log('✅ 已自动记录今天的50分钟计组学习！')
  }
}
const todayPlanItems = ref([
  { time: '8:00', activity: '起床 + 洗漱' },
  { time: '8:30', activity: '早餐 + 复习英语词汇(30分钟，复习剩余500词)' },
  { time: '9:00', activity: '📚 英语基础语法 - 听八哥老师直播课/回放（1.5小时）' },
  { time: '10:30', activity: '休息 15分钟' },
  { time: '10:45', activity: '🔢 数学概率论第16讲 - 基础三十讲（1.5小时）' },
  { time: '12:00', activity: '午饭 + 午休(30分钟)' },
  { time: '13:00', activity: '💻 408计算机组成原理 - 数据表示和运算（2小时）' },
  { time: '15:00', activity: '休息 15分钟' },
  { time: '15:15', activity: ' 数学概率论第17讲 - 基础三十讲（1.5小时）' },
  { time: '16:45', activity: '休息 15分钟' },
  { time: '17:00', activity: '💻 408组成原理 - 存储系统（1.5小时）' },
  { time: '18:30', activity: '晚饭 + 散步放松' },
  { time: '19:30', activity: '📚 英语基础语法 - 做笔记+复习（1小时）' },
  { time: '20:30', activity: '📝 整理今天学习内容 - 数学+408笔记（1小时）' },
  { time: '21:30', activity: '复习英语词汇(30分钟)' },
  { time: '22:00', activity: '洗漱休息，准备睡觉' }
])

// 考研倒计时相关
const examDate = new Date(2026, 11, 26) // 2026年12月26日
const countdown = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

let countdownInterval: NodeJS.Timeout | null = null

// 计算属性和方法
const getCurrentDate = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const weekday = ['日', '一', '二', '三', '四', '五', '六'][now.getDay()]
  return `${year}年${month}月${day}日 星期${weekday}`
}

const getPriorityText = (priority: string): string => {
  const priorityMap: Record<string, string> = {
    'high': '高优先级',
    'medium': '中优先级',
    'low': '低优先级'
  }
  return priorityMap[priority] || priority
}

const updateCountdown = () => {
  const now = new Date()
  const diff = examDate.getTime() - now.getTime()
  
  if (diff > 0) {
    countdown.value.days = Math.floor(diff / (1000 * 60 * 60 * 24))
    countdown.value.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    countdown.value.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    countdown.value.seconds = Math.floor((diff % (1000 * 60)) / 1000)
  } else {
    countdown.value.days = 0
    countdown.value.hours = 0
    countdown.value.minutes = 0
    countdown.value.seconds = 0
  }
}

const formatTimeUnit = (unit: number): string => {
  return unit.toString().padStart(2, '0')
}

const addTodo = () => {
  if (newTodoText.value.trim()) {
    todoStore.addTodo({
      title: newTodoText.value.trim(),
      priority: newTodoPriority.value as 'low' | 'medium' | 'high',
      category: newTodoCategory.value || undefined,
      completed: false
    })
    // 重置表单
    newTodoText.value = ''
    newTodoPriority.value = 'medium'
    newTodoCategory.value = ''
    showAddDialog.value = false
    ElMessage.success('任务添加成功')
  }
}

const openTaskManager = () => {
  showTaskManager.value = true
}

const closeTaskManager = () => {
  showTaskManager.value = false
}

// 任务管理相关方法
const openCreateTask = () => {
  router.push('/task-management')
}

const toggleTaskCompletion = async (taskId: number) => {
  try {
    await taskStore.toggleTask(taskId)
  } catch (error) {
    ElMessage.error('状态更新失败')
  }
}

const editTask = (task: any) => {
  router.push(`/task-management/edit/${task.id}`)
}

const deleteTask = async (taskId: number) => {
  try {
    await taskStore.deleteTask(taskId)
    ElMessage.success('任务删除成功')
  } catch (error) {
    ElMessage.error('删除失败，请重试')
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

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日`
}

onMounted(() => {
  updateCountdown()
  countdownInterval = setInterval(updateCountdown, 1000)
  
  // 自动记录今天的学习
  autoRecordTodayStudy()
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>

<template>
  <div class="home-container">
    <!-- 顶部仪表盘区域 -->
    <div class="dashboard-header">
      <div class="header-content">
        <!-- 主标题区域 -->
        <div class="header-main">
          <div class="logo-section">
            <div class="logo-icon">🎓</div>
            <div class="logo-text">
              <h1 class="main-title">考研效率平台</h1>
              <p class="subtitle">专注 · 高效 · 科学</p>
            </div>
          </div>
          
          <!-- 倒计时卡片 -->
          <div class="countdown-card">
            <div class="countdown-header">
              <h3>🎯 考研倒计时</h3>
              <div class="exam-date">2026.12.26</div>
            </div>
            <div class="countdown-numbers">
              <div class="time-unit">
                <div class="time-value">{{ formatTimeUnit(countdown.days) }}</div>
                <div class="time-label">天</div>
              </div>
              <div class="time-unit">
                <div class="time-value">{{ formatTimeUnit(countdown.hours) }}</div>
                <div class="time-label">时</div>
              </div>
              <div class="time-unit">
                <div class="time-value">{{ formatTimeUnit(countdown.minutes) }}</div>
                <div class="time-label">分</div>
              </div>
              <div class="time-unit">
                <div class="time-value">{{ formatTimeUnit(countdown.seconds) }}</div>
                <div class="time-label">秒</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 快速统计卡片 -->
        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-icon">📚</div>
            <div class="stat-info">
              <div class="stat-number">{{ Math.floor(studyStore.todayStudyTime / 60) || 0 }}</div>
              <div class="stat-label">学习时长(h)</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <div class="stat-number">{{ todoStore.completedTodos.length || 0 }}</div>
              <div class="stat-label">已完成任务</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📈</div>
            <div class="stat-info">
              <div class="stat-number">{{ studyStore.currentStreak || 0 }}</div>
              <div class="stat-label">学习天数</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content-grid">
      <!-- 左侧主要内容 -->
      <div class="main-panel">
        <!-- 学习计划核心区域 -->
        <div class="primary-card">
          <div class="card-header">
            <h2 class="card-title">📅 今日学习计划</h2>
            <div class="date-display">{{ getCurrentDate() }}</div>
          </div>
          <div class="card-content">
            <DailyPlanCard 
              :date="todayDate" 
              :plan-items="todayPlanItems"
              show-date-selector
            />
          </div>
        </div>

        <!-- 待办事项 -->
        <div class="secondary-card">
          <div class="card-header">
            <h2 class="card-title">📋 今日待办</h2>
            <el-button size="small" type="primary" @click="showAddDialog = true">
              + 添加任务
            </el-button>
            <el-button size="small" type="success" @click="showStudyDialog = true" style="margin-left: 8px;">
              ⏱️ 记录学习
            </el-button>
          </div>
          <div class="card-content">
            <div class="todo-list">
              <div 
                class="todo-item" 
                v-for="todo in todoStore.todos.slice(0, 5)" 
                :key="todo.id"
                :class="{ 'completed': todo.completed }"
              >
                <el-checkbox v-model="todo.completed"></el-checkbox>
                <div class="todo-details">
                  <div class="todo-text">{{ todo.title }}</div>
                  <div class="todo-tags">
                    <span class="priority-tag" :class="todo.priority">
                      {{ getPriorityText(todo.priority) }}
                    </span>
                    <span class="category-tag" v-if="todo.category">
                      {{ todo.category }}
                    </span>
                  </div>
                </div>
                <div class="todo-actions">
                  <el-button size="small" type="danger" link @click="todoStore.deleteTodo(todo.id)">
                    删除
                  </el-button>
                </div>
              </div>
              
              <div v-if="todoStore.todos.length === 0" class="empty-state">
                <div class="empty-icon">📝</div>
                <p>还没有待办任务</p>
                <el-button type="primary" @click="showAddDialog = true">添加第一个任务</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧辅助面板 -->
      <div class="sidebar-panel">
        <!-- 月度日历 -->
        <div class="sidebar-card">
          <div class="card-header">
            <h3 class="card-title">📅 月度日历</h3>
          </div>
          <div class="card-content compact-calendar">
            <MonthlyCalendar />
          </div>
        </div>

        <!-- 学习统计 -->
        <div class="sidebar-card">
          <div class="card-header">
            <h3 class="card-title">📊 学习统计</h3>
          </div>
          <div class="card-content stats-summary">
            <div class="stat-row">
              <span class="stat-label">本周学习:</span>
              <span class="stat-value">{{ studyStore.weeklyStudyTime || 0 }}h</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">本月学习:</span>
              <span class="stat-value">{{ studyStore.monthlyStudyTime || 0 }}h</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">连续学习:</span>
              <span class="stat-value">{{ studyStore.currentStreak || 0 }}天</span>
            </div>
          </div>
        </div>

        <!-- 快捷操作 -->
        <div class="sidebar-card">
          <div class="card-header">
            <h3 class="card-title">⚡ 快捷操作</h3>
          </div>
          <div class="card-content quick-actions">
            <div class="action-grid">
              <el-button class="action-btn" type="primary" @click="router.push('/learning-path')">
                <el-icon><Guide /></el-icon>
                <span>学习路径</span>
              </el-button>
              <el-button class="action-btn" type="success" @click="router.push('/analytics')">
                <el-icon><DataAnalysis /></el-icon>
                <span>数据统计</span>
              </el-button>
              <el-button class="action-btn" type="warning" @click="router.push('/psychology')">
                <el-icon><MagicStick /></el-icon>
                <span>心理干预</span>
              </el-button>
              <el-button class="action-btn" type="info" @click="router.push('/tasks')">
                <el-icon><Timer /></el-icon>
                <span>任务管理</span>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加任务对话框 -->
    <el-dialog v-model="showAddDialog" title="添加新任务" width="500px">
      <el-form @submit.prevent="addTodo">
        <el-form-item label="任务内容">
          <el-input 
            v-model="newTodoText" 
            placeholder="请输入任务内容" 
            autofocus
            @keyup.enter="addTodo"
          />
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="newTodoPriority" placeholder="选择优先级">
            <el-option label="高" value="high"></el-option>
            <el-option label="中" value="medium"></el-option>
            <el-option label="低" value="low"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="newTodoCategory" placeholder="可选" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addTodo">添加</el-button>
      </template>
    </el-dialog>

    <!-- 快速学习记录对话框 -->
    <el-dialog v-model="showStudyDialog" title="⏱️ 快速记录学习时间" width="500px">
      <el-form label-width="100px">
        <el-form-item label="学习科目">
          <el-select v-model="studySubject" placeholder="选择科目" style="width: 100%;">
            <el-option 
              v-for="option in subjectOptions" 
              :key="option.value" 
              :label="option.label" 
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学习时长">
          <el-input-number 
            v-model="studyDuration" 
            :min="5" 
            :max="180" 
            :step="5"
            style="width: 100%;"
          />
          <span style="margin-left: 10px; color: #999;">分钟</span>
        </el-form-item>
        <el-form-item label="学习内容">
          <el-input 
            v-model="studyContent" 
            type="textarea"
            :rows="3"
            placeholder="例如：计算机组成原理 - 第三章 存储器系统" 
            autofocus
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showStudyDialog = false">取消</el-button>
        <el-button type="success" @click="quickAddStudy">✅ 记录</el-button>
      </template>
    </el-dialog>

    <!-- 任务管理对话框 -->
    <el-dialog v-model="showTaskManager" title="任务管理" width="600px" :close-on-click-modal="false">
      <div class="task-manager-container">
        <div class="task-manager-header">
          <div class="task-stats">
            <span class="stat-item">
              <span class="stat-number">{{ taskStore.tasks.length }}</span>
              <span class="stat-label">总任务</span>
            </span>
            <span class="stat-item">
              <span class="stat-number completed">{{ taskStore.completedTasks.length }}</span>
              <span class="stat-label">已完成</span>
            </span>
            <span class="stat-item">
              <span class="stat-number pending">{{ taskStore.pendingTasks.length }}</span>
              <span class="stat-label">待完成</span>
            </span>
          </div>
          <el-button size="small" type="primary" @click="openCreateTask">
            + 创建任务
          </el-button>
        </div>
        
        <div class="task-list">
          <div v-if="taskStore.tasks.length === 0" class="empty-state">
            <div class="empty-icon">📋</div>
            <p>暂无学习任务</p>
            <p class="subtitle">您可以创建第一个学习任务</p>
          </div>
          
          <div v-else class="tasks-grid">
            <div 
              v-for="task in taskStore.tasks" 
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
                  <h4 class="task-title">{{ task.title }}</h4>
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
                      :color="taskStore.getSubjectColor(task.subject)"
                      size="small"
                      class="meta-tag subject-tag"
                    >
                      {{ task.subject }}
                    </el-tag>
                    
                    <span v-if="task.estimatedDuration" class="duration">
                      <el-icon><Timer /></el-icon>
                      {{ task.estimatedDuration }}分钟
                    </span>
                    
                    <span v-if="task.dueDate" class="due-date">
                      <el-icon><Calendar /></el-icon>
                      截止: {{ formatDate(task.dueDate) }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="task-actions">
                <el-button 
                  size="small" 
                  type="primary" 
                  @click="editTask(task)"
                  class="action-btn"
                >
                  编辑
                </el-button>
                <el-button 
                  size="small" 
                  type="danger"
                  @click="deleteTask(task.id)"
                  class="action-btn"
                >
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="closeTaskManager">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
/* 全新现代化首页样式 */

.home-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
  min-height: 100vh;
}

/* 顶部仪表盘区域 */
.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  color: white;
  position: relative;
  overflow: hidden;
}

.dashboard-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #f093fb, #f5576c, #4facfe, #00f2fe);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 32px;
}

/* 主标题区域 */
.header-main {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-icon {
  font-size: 2.5em;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.logo-text .main-title {
  font-size: 2.2em;
  font-weight: 800;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-text .subtitle {
  font-size: 1.1em;
  opacity: 0.9;
  margin: 0;
  font-weight: 500;
}

/* 倒计时卡片 */
.countdown-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 280px;
}

.countdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.countdown-header h3 {
  font-size: 1.3em;
  font-weight: 600;
  margin: 0;
}

.exam-date {
  font-size: 0.9em;
  opacity: 0.8;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
}

.countdown-numbers {
  display: flex;
  justify-content: space-around;
  gap: 12px;
}

.time-unit {
  text-align: center;
  flex: 1;
}

.time-value {
  font-size: 1.8em;
  font-weight: 700;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: white;
  margin-bottom: 4px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.time-label {
  font-size: 0.9em;
  opacity: 0.9;
  font-weight: 500;
}

/* 统计卡片 */
.stats-cards {
  display: flex;
  gap: 20px;
  margin-top: 24px;
}

.stat-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 2em;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 1.8em;
  font-weight: 700;
  margin-bottom: 4px;
  color: #ffffff !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
}

.stat-label {
  font-size: 0.9em;
  opacity: 0.9;
}

/* 主要内容网格布局 */
.main-content-grid {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 20px;
}

/* 主面板 */
.main-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 600px;
}

.primary-card, .secondary-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  overflow: visible;
  transition: all 0.3s ease;
  max-height: none;
}

.primary-card:hover, .secondary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
}

.card-header {
  padding: 12px 16px 8px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 1.4em;
  font-weight: 700;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-display {
  font-size: 1em;
  color: #666;
  background: #f8f9fa;
  padding: 6px 16px;
  border-radius: 20px;
}

.card-content {
  padding: 12px 16px;
}

/* 待办事项列表 */
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: none;
  overflow-y: visible;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.todo-item:hover {
  background: #f0f4ff;
  transform: translateX(8px);
}

.todo-item.completed {
  opacity: 0.7;
  background: #e8f5e8;
}

.todo-details {
  flex: 1;
}

.todo-text {
  font-size: 1em;
  color: #333;
  margin-bottom: 6px;
  font-weight: 500;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #666;
}

.todo-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.priority-tag {
  font-size: 0.75em;
  padding: 3px 10px;
  border-radius: 16px;
  font-weight: 500;
}

.priority-tag.high {
  background: #ffebee;
  color: #f44336;
}

.priority-tag.medium {
  background: #fff3e0;
  color: #ff9800;
}

.priority-tag.low {
  background: #e8f5e8;
  color: #4caf50;
}

.category-tag {
  font-size: 0.75em;
  background: #e3f2fd;
  color: #2196f3;
  padding: 3px 10px;
  border-radius: 16px;
}

.todo-actions {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.todo-item:hover .todo-actions {
  opacity: 1;
}

/* 侧边栏面板 */
.sidebar-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.sidebar-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.compact-calendar {
  padding: 0;
}

.stats-summary {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-label {
  color: #666;
  font-size: 0.95em;
}

.stat-value {
  font-weight: 600;
  color: #333;
}

.quick-actions .action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border-radius: 12px;
  background: #f8f9fa;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #333333;
}

.action-btn:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.action-icon {
  font-size: 1.5em;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: #999;
}

.empty-icon {
  font-size: 3em;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-state p {
  font-size: 1.1em;
  margin: 12px 0;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content-grid {
    grid-template-columns: 1fr;
  }
  
  .sidebar-panel {
    order: -1;
  }
  
  .header-content {
    flex-direction: column;
    gap: 24px;
  }
  
  .header-main {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }
  
  .countdown-card {
    width: 100%;
    min-width: auto;
  }
  
  .stats-cards {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .home-container {
    padding: 16px;
  }
  
  .dashboard-header {
    padding: 24px;
    border-radius: 16px;
  }
  
  .logo-text .main-title {
    font-size: 1.8em;
  }
  
  .countdown-numbers {
    gap: 12px;
  }
  
  .time-value {
    font-size: 1.8em;
  }
  
  .stats-cards {
    flex-direction: column;
  }
  
  .card-header {
    padding: 20px 24px 12px;
  }
  
  .card-content {
    padding: 20px 24px;
  }
  
  .todo-item {
    padding: 12px;
    gap: 12px;
  }
  
  .quick-actions .action-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .home-container {
    padding: 12px;
  }
  
  .dashboard-header {
    padding: 16px;
  }
  
  .logo-section {
    gap: 10px;
  }
  
  .logo-icon {
    font-size: 1.8em;
  }
  
  .logo-text .main-title {
    font-size: 1.3em;
  }
  
  .countdown-card {
    padding: 16px;
  }
  
  .time-value {
    font-size: 1.4em;
  }
  
  .stat-card {
    padding: 12px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .todo-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .todo-actions {
    opacity: 1;
    align-self: flex-end;
  }
}
</style>