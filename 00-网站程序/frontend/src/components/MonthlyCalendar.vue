<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElDialog, ElButton, ElTag, ElProgress } from 'element-plus'
import { useTodoStore } from '@/stores/todos'
import { useTaskStore } from '@/stores/tasks'

const todoStore = useTodoStore()
const taskStore = useTaskStore()

// 统一日期格式化函数
const formatDateToLocalISO = (date: Date): string => {
  // 创建一个新的 Date 对象避免修改原对象
  const d = new Date(date)
  // 设置为当天的开始时间
  d.setHours(0, 0, 0, 0)
  // 返回 YYYY-MM-DD 格式
  return d.getFullYear() + '-' + 
         String(d.getMonth() + 1).padStart(2, '0') + '-' + 
         String(d.getDate()).padStart(2, '0')
}

// Props
const props = defineProps<{
  showCompleted?: boolean
}>()

// 状态管理
const currentDate = ref(new Date())
const selectedDate = ref('')
const showTodoDialog = ref(false)

// 获取今天的完整日期信息
const today = new Date()

// 计算属性
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())

const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  
  // 获取当月第一天和最后一天
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  // 获取第一天是星期几 (0 = 周日, 1 = 周一, ..., 6 = 周六)
  const firstDayOfWeek = firstDay.getDay()
  
  // 获取上个月的天数
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  
  const days = []
  
  // 按照国际标准：周一到周日排列
  // JavaScript getDay(): 0=周日, 1=周一, 2=周二, ..., 6=周六
  // 我们需要转换为: 0=周一, 1=周二, ..., 5=周六, 6=周日
  
  // 计算需要显示的上个月天数
  // 如果firstDayOfWeek是0(周日)，则需要显示6天上个月的日期
  // 如果firstDayOfWeek是1(周一)，则不需要显示上个月的日期
  // 如果firstDayOfWeek是2(周二)，则需要显示1天上个月的日期
  const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
  
  // 添加上个月的日期
  for (let i = 0; i < daysFromPrevMonth; i++) {
    const dayNumber = prevMonthLastDay - daysFromPrevMonth + i + 1
    const date = new Date(year, month - 1, dayNumber)
    const dateStr = formatDateToLocalISO(date)
    days.push({
      date: dateStr,
      day: dayNumber,
      isCurrentMonth: false,
      isToday: dateStr === formatDateToLocalISO(new Date()),
      todos: getTodosForDate(dateStr)
    })
  }
  
  // 添加当前月的日期
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day)
    const dateStr = formatDateToLocalISO(date)
    days.push({
      date: dateStr,
      day: day,
      isCurrentMonth: true,
      isToday: dateStr === formatDateToLocalISO(new Date()),
      todos: getTodosForDate(dateStr)
    })
  }
  
  // 添加下个月的日期以填满最后一周
  const remainingDays = 42 - days.length // 6行 × 7天 = 42
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day)
    const dateStr = formatDateToLocalISO(date)
    days.push({
      date: dateStr,
      day: day,
      isCurrentMonth: false,
      isToday: dateStr === formatDateToLocalISO(new Date()),
      todos: getTodosForDate(dateStr)
    })
  }
  
  return days
})

const monthName = computed(() => {
  const months = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ]
  return months[currentMonth.value]
})

// 方法
const getTodosForDate = (date: string) => {
  // 获取待办事项
  const todos = todoStore.todos.filter(todo => 
    todo.dueDate === date && 
    (!todo.completed || props.showCompleted)
  )
  
  // 获取学习任务 - 只在截止日期显示
  const tasks = taskStore.tasks.filter(task => {
    if (task.completed && !props.showCompleted) return false
    if (!task.dueDate) return false
    
    const taskDueDate = new Date(task.dueDate)
    const currentDate = new Date(date)
    
    // 只在截止日期当天显示任务
    return currentDate.toDateString() === taskDueDate.toDateString()
  })
  
  return [...todos, ...tasks]
}

const selectDate = (dayInfo: any) => {
  if (!dayInfo.isCurrentMonth) return
  
  selectedDate.value = dayInfo.date
  showTodoDialog.value = true
}

const navigateMonth = (direction: 'prev' | 'next') => {
  const current = new Date(currentDate.value)
  if (direction === 'prev') {
    current.setMonth(current.getMonth() - 1)
  } else {
    current.setMonth(current.getMonth() + 1)
  }
  currentDate.value = new Date(current.getFullYear(), current.getMonth(), 1)
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

const getPriorityTagType = (priority: string) => {
  const types: Record<string, 'danger' | 'warning' | 'success'> = {
    'high': 'danger',
    'medium': 'warning',
    'low': 'success'
  }
  return types[priority] || 'info'
}

const getWeekDay = (date: Date) => {
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return weekdays[date.getDay()]
}

const getSubjectInitial = (subject: string) => {
  const initials: Record<string, string> = {
    '408计算机': '计',
    '数学一': '数',
    '英语一': '英',
    '政治': '政'
  }
  return initials[subject] || subject.charAt(0)
}

onMounted(() => {
  // 强制重置到当前系统日期
  const systemDate = new Date()
  currentDate.value = new Date(systemDate.getFullYear(), systemDate.getMonth(), 1)
  
  // 清除可能存在的错误本地存储数据
  localStorage.removeItem('monthly-calendar-date')
})
</script>

<template>
  <div class="calendar-container">
    <!-- 日历头部 -->
    <div class="calendar-header">
      <div class="header-controls">
        <el-button 
          circle 
          icon="ArrowLeft" 
          @click="navigateMonth('prev')"
        />
        <div class="calendar-title">
          <h3>{{ currentYear }}年 {{ monthName }}</h3>
          <p class="current-date">今天是 {{ today.getFullYear() }}年{{ today.getMonth() + 1 }}月{{ today.getDate() }}日 {{ getWeekDay(today) }}</p>
          <p class="month-stats">本月共有 {{ calendarDays.filter(d => d.isCurrentMonth && d.todos.length > 0).length }} 天有待办事项</p>
        </div>
        <el-button 
          circle 
          icon="ArrowRight" 
          @click="navigateMonth('next')"
        />
      </div>
      <div class="legend">
        <div class="legend-item">
          <div class="legend-color today"></div>
          <span>今天</span>
        </div>
        <div class="legend-item">
          <div class="legend-color has-todos"></div>
          <span>有待办</span>
        </div>
        <div class="legend-item">
          <div class="legend-color completed"></div>
          <span>已完成</span>
        </div>
      </div>
    </div>
    
    <!-- 星期标题 -->
    <div class="weekdays">
      <div class="weekday" v-for="weekday in ['一', '二', '三', '四', '五', '六', '日']" :key="weekday">
        {{ weekday }}
      </div>
    </div>
    
    <!-- 日历主体 -->
    <div class="calendar-grid">
      <div 
        v-for="(day, index) in calendarDays" 
        :key="index"
        class="calendar-day"
        :class="{
          'current-month': day.isCurrentMonth,
          'today': day.isToday,
          'has-todos': day.todos.length > 0,
          'selected': selectedDate === day.date
        }"
        @click="selectDate(day)"
      >
        <div class="day-number">{{ day.day }}</div>
        <div class="todo-indicators">
          <div 
            v-for="(todo, todoIndex) in day.todos.slice(0, 3)" 
            :key="todoIndex"
            class="todo-dot"
            :style="{ backgroundColor: todoStore.getPriorityColor(todo.priority) }"
            :title="todo.title"
          />
          <div v-if="day.todos.length > 3" class="more-indicator">
            +{{ day.todos.length - 3 }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- 代办事项弹窗 -->
    <el-dialog
      v-model="showTodoDialog"
      :title="`📅 ${formatDate(selectedDate)} 的待办事项`"
      width="500px"
      class="todo-dialog"
      modal
      :lock-scroll="true"
      :append-to-body="true"
      :close-on-click-modal="true"
      :center="true"
    >
      <div v-if="getTodosForDate(selectedDate).length === 0" class="no-todos">
        <p>这一天没有待办事项 🎉</p>
        <p class="subtitle">可以好好休息或安排新的学习计划</p>
      </div>
      
      <div v-else class="todo-list">
        <div 
          v-for="item in getTodosForDate(selectedDate)" 
          :key="item.id"
          class="todo-item"
          :class="{ 'completed': item.completed }"
        >
          <!-- 待办事项 -->
          <template v-if="!item.hasOwnProperty('subject')">
            <el-checkbox 
              v-model="item.completed"
              @change="todoStore.toggleTodo(String(item.id))"
            />
            <div class="todo-content">
              <h4>{{ item.title }}</h4>
              <p v-if="item.description">{{ item.description }}</p>
              <div class="todo-meta">
                <el-tag 
                  :type="getPriorityTagType(item.priority)"
                  size="small"
                >
                  {{ todoStore.getPriorityText(item.priority) }}
                </el-tag>
                <span v-if="item.estimatedDuration" class="duration">
                  ⏱️ {{ item.estimatedDuration }}分钟
                </span>
              </div>
            </div>
          </template>
          
          <!-- 学习任务 -->
          <template v-else>
            <div class="task-indicator" :class="(item as any).subject?.replace(' ', '-')">
              {{ getSubjectInitial((item as any).subject) }}
            </div>
            <div class="todo-content">
              <h4>{{ item.title }}</h4>
              <p v-if="item.description">{{ item.description }}</p>
              <div class="todo-meta">
                <el-tag 
                  :type="getPriorityTagType(item.priority)"
                  size="small"
                >
                  {{ taskStore.getPriorityText(item.priority) }}
                </el-tag>
                <el-tag 
                  :color="taskStore.getSubjectColor((item as any).subject)"
                  size="small"
                >
                  {{ (item as any).subject }}
                </el-tag>
                <span class="date-range" v-if="(item as any).startDate && (item as any).dueDate">
                  {{ (item as any).startDate }} ~ {{ (item as any).dueDate }}
                </span>
                <div v-if="(item as any).progress > 0" class="task-progress-mini">
                  <el-progress 
                    :percentage="(item as any).progress" 
                    :stroke-width="4"
                    :show-text="false"
                  />
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showTodoDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.calendar-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
  max-width: 800px;
  margin: 0 auto;
}

.calendar-header {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.header-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.calendar-title {
  text-align: center;
  flex: 1;
}

.calendar-title h3 {
  margin: 0 0 8px 0;
  color: #333333;
  font-size: 1.8em;
  font-weight: 600;
}

.current-date {
  margin: 0 0 8px 0;
  color: #667eea;
  font-size: 1.1em;
  font-weight: 500;
}

.month-stats {
  margin: 0;
  color: #666666;
  font-size: 1em;
  font-weight: 400;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 25px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9em;
  color: #666666;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-color.today {
  background-color: #4CAF50;
  border: 2px solid #4CAF50;
}

.legend-color.has-todos {
  background-color: #fff3e0;
  border: 2px solid #ff9800;
}

.legend-color.completed {
  background-color: #e8f5e8;
  border: 2px solid #4CAF50;
  position: relative;
}

.legend-color.completed::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #4CAF50;
  font-size: 10px;
  font-weight: bold;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 15px;
  font-weight: 600;
  color: #666666;
}

.weekday {
  padding: 12px 0;
  font-size: 1.1em;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.calendar-day {
  aspect-ratio: 1;
  border-radius: 12px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  border: 2px solid transparent;
}

.calendar-day:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.calendar-day.current-month {
  background-color: white;
}

.calendar-day:not(.current-month) {
  background-color: #f8f9fa;
  color: #cccccc;
}

.calendar-day.today {
  border-color: #4CAF50;
  background-color: #e8f5e8;
  font-weight: 700;
}

.calendar-day.has-todos {
  background-color: #fff3e0;
}

.calendar-day.selected {
  border-color: #2196F3;
  background-color: #e3f2fd;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.2);
}

.day-number {
  font-size: 1.2em;
  font-weight: 500;
  margin-bottom: 5px;
  text-align: center;
}

.todo-indicators {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.todo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  cursor: pointer;
}

.more-indicator {
  font-size: 0.7em;
  color: #666666;
  font-weight: 500;
}

.task-indicator {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: white;
  flex-shrink: 0;
  margin-right: 10px;
}

.task-indicator.计算机 {
  background-color: #409EFF;
}

.task-indicator.数学一 {
  background-color: #67C23A;
}

.task-indicator.英语一 {
  background-color: #E6A23C;
}

.task-indicator.政治 {
  background-color: #F56C6C;
}

.date-range {
  font-size: 0.85em;
  color: #666666;
  display: flex;
  align-items: center;
  gap: 5px;
}

.task-progress-mini {
  width: 100%;
  margin-top: 8px;
}

/* 弹窗样式 */
.todo-dialog :deep(.el-dialog__body) {
  padding: 20px;
}

.todo-dialog :deep(.el-dialog) {
  margin: 0 auto !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  max-height: 80vh;
  overflow: hidden;
}

.todo-dialog :deep(.el-dialog__header) {
  padding: 20px 20px 10px;
}

.todo-dialog :deep(.el-dialog__footer) {
  padding: 10px 20px 20px;
}

.no-todos {
  text-align: center;
  padding: 40px 20px;
}

.no-todos p {
  margin: 10px 0;
  font-size: 1.2em;
  color: #666666;
}

.no-todos .subtitle {
  font-size: 1em;
  color: #999999;
  margin-top: 15px;
}

.todo-list {
  max-height: 400px;
  overflow-y: auto;
}

.todo-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  margin-bottom: 15px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.todo-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.todo-item.completed {
  opacity: 0.7;
  background: #e8f5e8;
}

.todo-content {
  flex: 1;
}

.todo-content h4 {
  margin: 0 0 8px 0;
  color: #333333;
  font-size: 1.1em;
  font-weight: 500;
}

.todo-content p {
  margin: 0 0 12px 0;
  color: #666666;
  font-size: 0.95em;
  line-height: 1.5;
}

.todo-meta {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.duration {
  font-size: 0.9em;
  color: #666666;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .calendar-container {
    padding: 20px 15px;
    margin: 0 15px;
  }
  
  .calendar-header {
    margin-bottom: 20px;
  }
  
  .calendar-title h3 {
    font-size: 1.5em;
  }
  
  .weekdays {
    font-size: 0.9em;
  }
  
  .day-number {
    font-size: 1em;
  }
  
  .calendar-grid {
    gap: 5px;
  }
  
  .todo-dialog {
    width: 95% !important;
  }
  
  .todo-dialog :deep(.el-dialog) {
    margin: 0 10px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    max-height: 85vh;
    width: calc(100% - 20px) !important;
  }
  
  .todo-item {
    padding: 12px;
    gap: 12px;
  }
}
</style>