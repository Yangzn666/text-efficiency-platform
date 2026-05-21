<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStudyStore } from '@/stores/study'
import { ElMessage } from 'element-plus'
import { Calendar, Clock, Target, Check } from '@element-plus/icons-vue'

const studyStore = useStudyStore()

// 今日计划任务
const todayTasks = ref<any[]>([])
const completedTasks = ref<Set<string>>(new Set())

// 计算属性
const completionRate = computed(() => {
  if (todayTasks.value.length === 0) return 0
  return Math.round((completedTasks.value.size / todayTasks.value.length) * 100)
})

const remainingTasks = computed(() => {
  return todayTasks.value.length - completedTasks.value.size
})

const totalDuration = computed(() => {
  return todayTasks.value.reduce((sum, task) => {
    return completedTasks.value.has(task.id) ? sum : sum + task.duration
  }, 0)
})

// 生成今日计划
const generateTodayPlan = () => {
  const tasks = []
  const today = new Date().toISOString().split('T')[0]
  
  // 基于学习记录生成建议
  const subjects = ['数学一', '408专业课', '英语一']
  
  // 数学一任务
  tasks.push({
    id: 'math_1',
    subject: '数学一',
    title: '概率论强化学习',
    description: '继续第4-5章学习，完成课后习题',
    duration: 90,
    priority: 'high',
    type: 'study',
    color: '#409EFF'
  })
  
  tasks.push({
    id: 'math_2',
    subject: '数学一',
    title: '错题复习',
    description: '复习昨日错题，确保理解',
    duration: 30,
    priority: 'medium',
    type: 'review',
    color: '#409EFF'
  })
  
  // 408任务
  tasks.push({
    id: 'cs_1',
    subject: '408专业课',
    title: '操作系统学习',
    description: '进程管理与线程概念',
    duration: 60,
    priority: 'high',
    type: 'study',
    color: '#67C23A'
  })
  
  // 英语任务
  tasks.push({
    id: 'eng_1',
    subject: '英语一',
    title: '单词背诵',
    description: '背诵50个新单词，复习100个旧单词',
    duration: 30,
    priority: 'high',
    type: 'vocabulary',
    color: '#E6A23C'
  })
  
  tasks.push({
    id: 'eng_2',
    subject: '英语一',
    title: '长难句分析',
    description: '分析3-5个真题长难句',
    duration: 25,
    priority: 'medium',
    type: 'grammar',
    color: '#E6A23C'
  })
  
  // 休息任务
  tasks.push({
    id: 'break_1',
    subject: '休息',
    title: '午休时间',
    description: '适当休息，保持精力',
    duration: 30,
    priority: 'low',
    type: 'break',
    color: '#909399'
  })
  
  todayTasks.value = tasks
}

// 切换任务完成状态
const toggleTask = (taskId: string) => {
  if (completedTasks.value.has(taskId)) {
    completedTasks.value.delete(taskId)
    ElMessage.info('任务标记为未完成')
  } else {
    completedTasks.value.add(taskId)
    ElMessage.success('任务完成！+10积分')
  }
}

// 获取优先级标签
const getPriorityLabel = (priority: string) => {
  const labels: any = {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级'
  }
  return labels[priority] || priority
}

const getPriorityColor = (priority: string) => {
  const colors: any = {
    high: '#F56C6C',
    medium: '#E6A23C',
    low: '#909399'
  }
  return colors[priority] || '#909399'
}

onMounted(() => {
  generateTodayPlan()
})
</script>

<template>
  <div class="daily-plan-generator">
    <!-- 顶部统计 -->
    <div class="plan-stats">
      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-info">
          <div class="stat-value">{{ todayTasks.length }}</div>
          <div class="stat-label">总任务数</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-info">
          <div class="stat-value">{{ completedTasks.size }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">⏰</div>
        <div class="stat-info">
          <div class="stat-value">{{ remainingTasks }}</div>
          <div class="stat-label">待完成</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🎯</div>
        <div class="stat-info">
          <div class="stat-value">{{ completionRate }}%</div>
          <div class="stat-label">完成率</div>
        </div>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="progress-section">
      <div class="progress-header">
        <span>今日进度</span>
        <span>{{ completionRate }}%</span>
      </div>
      <el-progress 
        :percentage="completionRate" 
        :color="completionRate >= 80 ? '#67C23A' : completionRate >= 50 ? '#E6A23C' : '#409EFF'"
        :stroke-width="12"
      />
      <div class="time-estimate">
        预计还需 {{ totalDuration }} 分钟完成剩余任务
      </div>
    </div>

    <!-- 任务列表 -->
    <div class="tasks-section">
      <h3 class="section-title">
        <el-icon><Calendar /></el-icon>
        今日学习计划
      </h3>
      
      <div class="task-list">
        <div 
          v-for="task in todayTasks" 
          :key="task.id"
          class="task-card"
          :class="{ completed: completedTasks.has(task.id) }"
        >
          <div class="task-header">
            <div class="task-subject" :style="{ backgroundColor: task.color }">
              {{ task.subject }}
            </div>
            <div class="task-priority" :style="{ color: getPriorityColor(task.priority) }">
              {{ getPriorityLabel(task.priority) }}
            </div>
          </div>
          
          <div class="task-content">
            <h4 class="task-title">{{ task.title }}</h4>
            <p class="task-description">{{ task.description }}</p>
          </div>
          
          <div class="task-footer">
            <div class="task-meta">
              <span class="task-duration">
                <el-icon><Clock /></el-icon>
                {{ task.duration }}分钟
              </span>
              <span class="task-type">{{ task.type }}</span>
            </div>
            
            <button 
              class="complete-btn"
              :class="{ done: completedTasks.has(task.id) }"
              @click="toggleTask(task.id)"
            >
              <el-icon v-if="completedTasks.has(task.id)"><Check /></el-icon>
              <span>{{ completedTasks.has(task.id) ? '已完成' : '标记完成' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 建议提示 -->
    <div class="suggestions">
      <h4 class="suggestion-title">💡 学习建议</h4>
      <ul class="suggestion-list">
        <li>优先完成高优先级任务，确保核心学习内容</li>
        <li>每个学习任务后休息5-10分钟，保持专注力</li>
        <li>遇到困难时不要卡太久，先标记后回头复习</li>
        <li>晚上睡前回顾今日所学，加深记忆</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.daily-plan-generator {
  max-width: 1000px;
  margin: 0 auto;
}

/* 顶部统计 */
.plan-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.stat-icon {
  font-size: 2.5em;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 2em;
  font-weight: 700;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9em;
  opacity: 0.9;
}

/* 进度条 */
.progress-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 1.1em;
  font-weight: 600;
  color: #333;
}

.time-estimate {
  margin-top: 10px;
  text-align: center;
  color: #666;
  font-size: 0.95em;
}

/* 任务列表 */
.tasks-section {
  margin-bottom: 25px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.4em;
  color: #333;
  margin-bottom: 20px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.task-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.task-card:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.task-card.completed {
  opacity: 0.7;
  background: #f5f7fa;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.task-subject {
  padding: 6px 15px;
  border-radius: 20px;
  color: white;
  font-size: 0.9em;
  font-weight: 600;
}

.task-priority {
  font-size: 0.85em;
  font-weight: 600;
}

.task-content {
  margin-bottom: 15px;
}

.task-title {
  font-size: 1.2em;
  color: #333;
  margin-bottom: 8px;
}

.task-description {
  color: #666;
  font-size: 0.95em;
  line-height: 1.6;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-meta {
  display: flex;
  gap: 15px;
}

.task-duration {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #409EFF;
  font-weight: 600;
}

.task-type {
  color: #999;
  font-size: 0.9em;
}

.complete-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 2px solid #67C23A;
  border-radius: 10px;
  background: white;
  color: #67C23A;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.complete-btn:hover {
  background: #67C23A;
  color: white;
}

.complete-btn.done {
  background: #67C23A;
  color: white;
  border-color: #67C23A;
}

/* 建议提示 */
.suggestions {
  background: linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%);
  border-radius: 15px;
  padding: 25px;
  border-left: 4px solid #E6A23C;
}

.suggestion-title {
  font-size: 1.2em;
  color: #333;
  margin-bottom: 15px;
}

.suggestion-list {
  list-style: none;
  padding: 0;
}

.suggestion-list li {
  padding: 10px 0;
  color: #666;
  line-height: 1.6;
  position: relative;
  padding-left: 25px;
}

.suggestion-list li:before {
  content: "•";
  position: absolute;
  left: 10px;
  color: #E6A23C;
  font-weight: bold;
  font-size: 1.2em;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .plan-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .task-footer {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .complete-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
