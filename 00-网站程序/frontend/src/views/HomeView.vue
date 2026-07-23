<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton } from 'element-plus'
import { Timer, DataAnalysis, Guide, MagicStick, Plus } from '@element-plus/icons-vue'
import MonthlyCalendar from '@/components/MonthlyCalendar.vue'
import DailyPlanCard from '@/components/DailyPlanCard.vue'
import StudyStats from '@/components/StudyStats.vue'
import SimpleMoodTracker from '@/components/SimpleMoodTracker.vue'
import { useStudyStore } from '@/stores/study'
import { useTodoStore } from '@/stores/todos'
import { useTaskStore } from '@/stores/tasks'
import { useTodayStatusStore } from '@/stores/todayStatus'

const router = useRouter()
const studyStore = useStudyStore()
const todoStore = useTodoStore()
const taskStore = useTaskStore()
const todayStore = useTodayStatusStore()

// 对话框相关状态
const showAddDialog = ref(false)
const showTaskManager = ref(false)
const newTodoText = ref('')
const newTodoPriority = ref('medium')
const newTodoCategory = ref('')

// 学习计划相关数据
const todayDate = ref(new Date().toISOString().split('T')[0])

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

// 考研倒计时相关（考试日期统一读取 store，与今日进度/数据分析页保持单一数据源）
const examDate = computed(() => new Date(todayStore.examDate + 'T00:00:00'))
// 展示用日期：2026-12-19 → 2026.12.19
const examDateDisplay = computed(() => todayStore.examDate.replace(/-/g, '.'))
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
  const diff = examDate.value.getTime() - now.getTime()
  
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

// 学习成就
const achievements = computed(() => {
  const totalMinutes = studyStore.studyRecords.reduce((sum, r) => sum + r.duration, 0)
  const totalDays = new Set(studyStore.studyRecords.map(r => r.date)).size
  
  // 计算本周学习时长
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay())
  weekStart.setHours(0, 0, 0, 0)
  
  const weekTotalMinutes = studyStore.studyRecords
    .filter(r => new Date(r.date) >= weekStart)
    .reduce((sum, r) => sum + r.duration, 0)
  
  // 计算每天的学习时长
  const daysMap = new Map<string, number>()
  studyStore.studyRecords.forEach(r => {
    daysMap.set(r.date, (daysMap.get(r.date) || 0) + r.duration)
  })
  const weekDays = Array.from(daysMap.entries())
    .filter(([date]) => new Date(date) >= weekStart)
    .map(([_, minutes]) => ({ minutes }))
  
  return [
    {
      id: 'first-step',
      icon: '',
      name: '初试锋芒',
      description: '完成第一次学习记录',
      unlocked: totalMinutes > 0,
      progress: Math.min(100, (totalMinutes / 25) * 100)
    },
    {
      id: 'hour-master',
      icon: '',
      name: '小时达人',
      description: '累计学习60分钟',
      unlocked: totalMinutes >= 60,
      progress: Math.min(100, (totalMinutes / 60) * 100)
    },
    {
      id: 'half-day',
      icon: '',
      name: '半日苦读',
      description: '单日学习超过240分钟',
      unlocked: weekDays.some(d => d.minutes >= 240),
      progress: Math.min(100, (Math.max(...weekDays.map(d => d.minutes), 0) / 240) * 100)
    },
    {
      id: 'week-warrior',
      icon: '🔥',
      name: '周学习战士',
      description: '本周学习超过600分钟',
      unlocked: weekTotalMinutes >= 600,
      progress: Math.min(100, (weekTotalMinutes / 600) * 100)
    },
    {
      id: 'consistent',
      icon: '',
      name: '坚持不懈',
      description: '连续学习7天',
      unlocked: totalDays >= 7,
      progress: Math.min(100, (totalDays / 7) * 100)
    },
    {
      id: 'marathon',
      icon: '🏆',
      name: '学习马拉松',
      description: '累计学习1000分钟',
      unlocked: totalMinutes >= 1000,
      progress: Math.min(100, (totalMinutes / 1000) * 100)
    }
  ]
})

onMounted(() => {
  // 初始化学习数据（从localStorage/IndexedDB加载）
  studyStore.initializeStudyData()

  updateCountdown()
  countdownInterval = setInterval(updateCountdown, 1000)
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
              <div class="exam-date">{{ examDateDisplay }}</div>
            </div>
            <div class="countdown-numbers">
              <div class="time-unit">
                <div class="time-value">{{ formatTimeUnit(countdown.days) }}<span class="time-unit-text">天</span></div>
              </div>
              <div class="time-separator">:</div>
              <div class="time-unit">
                <div class="time-value">{{ formatTimeUnit(countdown.hours) }}<span class="time-unit-text">时</span></div>
              </div>
              <div class="time-separator">:</div>
              <div class="time-unit">
                <div class="time-value">{{ formatTimeUnit(countdown.minutes) }}<span class="time-unit-text">分</span></div>
              </div>
              <div class="time-separator">:</div>
              <div class="time-unit">
                <div class="time-value">{{ formatTimeUnit(countdown.seconds) }}<span class="time-unit-text">秒</span></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content-grid">
      <!-- 左侧栏 -->
      <div class="left-panel">
        <!-- 学习数据统计模块 -->
        <StudyStats />
      </div>

      <!-- 中间栏 - 学习计划 -->
      <div class="center-panel">
        <!-- 学习计划核心区域 -->
        <div class="primary-card">
          <div class="card-header">
            <h2 class="card-title">今日学习计划</h2>
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
      </div>

      <!-- 右侧栏 -->
      <div class="right-panel">
        <!-- 月度日历 -->
        <div class="sidebar-card">
          <div class="card-header">
            <h3 class="card-title"> 月度日历</h3>
          </div>
          <div class="card-content compact-calendar">
            <MonthlyCalendar />
          </div>
        </div>

        <!-- 待办事项 -->
        <div class="secondary-card">
          <div class="card-header">
            <h2 class="card-title">📋 今日待办</h2>
            <el-button size="small" type="primary" @click="showAddDialog = true">
              + 添加任务
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

        <!-- 心情打卡 -->
        <div class="sidebar-card mood-card">
          <SimpleMoodTracker />
        </div>

        <!-- 学习成就 -->
        <div class="sidebar-card achievements-card">
          <div class="card-header">
            <h3 class="card-title">🏆 学习成就</h3>
          </div>
          <div class="card-content">
            <div class="achievements-grid">
              <div 
                v-for="achievement in achievements" 
                :key="achievement.id"
                class="achievement-item"
                :class="{ unlocked: achievement.unlocked }"
              >
                <div class="achievement-icon">{{ achievement.icon }}</div>
                <div class="achievement-info">
                  <div class="achievement-name">{{ achievement.name }}</div>
                  <div class="achievement-desc">{{ achievement.description }}</div>
                  <el-progress 
                    v-if="!achievement.unlocked"
                    :percentage="achievement.progress" 
                    :stroke-width="4"
                  />
                </div>
              </div>
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
  width: 100%;
  margin: 0 auto;
  padding: 0;
  background: linear-gradient(180deg, #f5f8fc 0%, #edf2f8 100%);
  min-height: calc(100vh - 100px);
  border-radius: 0 0 24px 24px;
  overflow: hidden;
}

/* 顶部仪表盘区域 */
.dashboard-header {
  background: linear-gradient(150deg, #0d2137 0%, #16345c 60%, #1e4576 100%);
  border-radius: 0;
  padding: 40px 48px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(13, 33, 55, 0.25);
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
  height: 3px;
  background: linear-gradient(90deg, #ffc53d, #f0a820, #ffc53d);
  opacity: 0.9;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
}

/* 主标题区域 */
.header-main {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: 100px;
}

.logo-icon {
  font-size: 2.8em;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

.logo-text .main-title {
  font-size: 2.3em;
  font-weight: 700;
  margin: 0 0 6px 0;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.logo-text .subtitle {
  font-size: 1.2em;
  opacity: 0.85;
  margin: 0;
  font-weight: 400;
  letter-spacing: 2px;
}

/* 倒计时卡片 */
.countdown-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(24px);
  border-radius: 20px;
  padding: 24px 36px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  min-width: 400px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
}

.countdown-card:hover {
  background: rgba(255, 255, 255, 0.16);
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
}

.countdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.countdown-header h3 {
  font-size: 1.2em;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.5px;
}

.exam-date {
  font-size: 0.85em;
  opacity: 0.85;
  background: rgba(255, 255, 255, 0.15);
  padding: 5px 14px;
  border-radius: 16px;
  font-weight: 500;
}

.countdown-numbers {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.time-unit {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.time-separator {
  font-size: 1.8em;
  font-weight: 700;
  opacity: 0.5;
  margin: 0 4px;
  color: white;
}

.time-value {
  font-size: 2.2em;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  letter-spacing: 1px;
  line-height: 1;
}

.time-unit-text {
  font-size: 0.9em;
  font-weight: 500;
  opacity: 0.9;
  color: white;
  letter-spacing: 1px;
}

/* 统计卡片 */
.stats-cards {
  display: flex;
  gap: 16px;
  margin-top: 20px;
}

.stat-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  font-size: 1.8em;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-number {
  font-size: 1.6em;
  font-weight: 700;
  margin-bottom: 4px;
  color: #ffffff !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.85em;
  opacity: 0.8;
  font-weight: 400;
}

/* 主要内容网格布局 */
.main-content-grid {
  display: grid;
  grid-template-columns: 1.15fr 1.1fr 0.75fr;
  gap: 10px;
  padding: 0 24px 24px 24px;
}

/* 左侧栏 */
.left-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  overflow: hidden;
}

/* 中间栏 - 学习计划 */
.center-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

/* 右侧栏 */
.right-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
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
  font-size: 1.1em;
  font-weight: 700;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 学习计划卡片标题更小 */
.center-panel .card-title {
  font-size: 0.95em;
}

.date-display {
  font-size: 0.9em;
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
  background: #eef3fa;
  color: #16345c;
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

/* 心情打卡卡片 */
.mood-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.mood-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12);
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

  /* 桌面端 logo 靠 100px 左边距定位；纵向堆叠后须重置，否则移动端 logo 被挤出中心 */
  .logo-section {
    margin-left: 0;
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
  
  .main-content-grid {
    grid-template-columns: 1fr;
    gap: 12px;
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
    border-radius: 12px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
  }
  
  .header-main {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  
  .logo-section {
    gap: 10px;
    justify-content: center;
  }
  
  .logo-icon {
    font-size: 1.8em;
  }
  
  .logo-text {
    text-align: center;
  }
  
  .logo-text .main-title {
    font-size: 1.3em;
    white-space: nowrap;
  }
  
  .logo-text .subtitle {
    font-size: 0.75em;
    white-space: nowrap;
    letter-spacing: 1px;
  }
  
  .countdown-card {
    width: 100%;
    padding: 12px;
    min-width: auto;
  }
  
  .countdown-header {
    margin-bottom: 12px;
  }
  
  .countdown-header h3 {
    font-size: 1em;
  }
  
  .exam-date {
    font-size: 0.7em;
    padding: 3px 8px;
  }
  
  .countdown-numbers {
    gap: 4px;
  }
  
  .time-unit {
    padding: 0 2px;
  }
  
  .time-value {
    font-size: 1.2em;
  }
  
  .time-unit-text {
    font-size: 0.7em;
  }
  
  .time-separator {
    font-size: 1.2em;
    margin: 0 2px;
  }
  
  .stats-cards {
    flex-wrap: wrap;
    gap: 10px;
    width: 100%;
  }
  
  .stat-card {
    flex: 1 1 calc(50% - 5px);
    min-width: calc(50% - 5px);
    padding: 10px;
  }
  
  .stat-icon {
    width: 36px;
    height: 36px;
    font-size: 1.3em;
  }
  
  .stat-number {
    font-size: 1.2em;
  }
  
  .stat-label {
    font-size: 0.7em;
  }
  
  .main-content-grid {
    grid-template-columns: 1fr;
    padding: 0 12px 12px 12px;
    gap: 12px;
  }
  
  .left-panel,
  .center-panel,
  .right-panel {
    order: 0;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 16px 8px;
  }
  
  .card-title {
    font-size: 1.2em;
  }
  
  .card-content {
    padding: 12px 16px;
  }
  
  .todo-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 12px;
  }
  
  .todo-actions {
    opacity: 1;
    align-self: flex-end;
  }
  
  .sidebar-card {
    border-radius: 12px;
  }
  
  .quick-actions .action-grid {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  
  .action-btn {
    padding: 12px 8px;
    font-size: 0.9em;
  }
}

/* 学习成就样式 */
.achievements-card {
  .achievements-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .achievement-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    background: #f8f9fa;
    transition: all 0.3s ease;
    
    &.unlocked {
      background: linear-gradient(135deg, rgba(255,197,61,0.10), rgba(240,168,32,0.14));
      border: 1px solid rgba(255, 197, 61, 0.4);
    }
    
    &:hover {
      transform: translateX(5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
  
  .achievement-icon {
    font-size: 2em;
    min-width: 40px;
    text-align: center;
  }
  
  .achievement-info {
    flex: 1;
    min-width: 0;
  }
  
  .achievement-name {
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
    font-size: 0.9em;
  }
  
  .achievement-desc {
    font-size: 0.8em;
    color: #666;
    margin-bottom: 8px;
  }
}


</style>
