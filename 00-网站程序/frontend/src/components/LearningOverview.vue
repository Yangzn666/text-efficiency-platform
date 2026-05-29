<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStudyStore } from '@/stores/study'
import { ElMessage } from 'element-plus'
import { Plus, TrendCharts, Aim, Calendar } from '@element-plus/icons-vue'

const studyStore = useStudyStore()

// 快速记录表单
const showQuickRecord = ref(false)
const quickRecord = ref({
  subject: '数学一',
  duration: 60,
  content: ''
})

const subjects = ['数学一', '408计算机', '英语一', '政治', '其他']

// 计算属性 - 本周统计
const weeklyStats = computed(() => {
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay()) // 周日为起点
  weekStart.setHours(0, 0, 0, 0)
  
  const records = studyStore.studyRecords.filter(r => {
    const recordDate = new Date(r.date)
    return recordDate >= weekStart
  })
  
  const totalMinutes = records.reduce((sum, r) => sum + r.duration, 0)
  const totalHours = (totalMinutes / 60).toFixed(1)
  
  // 按科目统计
  const bySubject: Record<string, number> = {}
  records.forEach(r => {
    bySubject[r.subject] = (bySubject[r.subject] || 0) + r.duration
  })
  
  return {
    totalMinutes,
    totalHours,
    recordCount: records.length,
    bySubject,
    dailyAverage: (totalMinutes / 7).toFixed(0)
  }
})

// 本周目标完成情况
const weeklyGoals = computed(() => {
  const goals = [
    { subject: '数学一', target: 300, icon: '📐', color: '#409EFF' },
    { subject: '408计算机', target: 300, icon: '💻', color: '#67C23A' },
    { subject: '英语一', target: 300, icon: '📚', color: '#E6A23C' }
  ]
  
  return goals.map(goal => {
    const actual = weeklyStats.value.bySubject[goal.subject] || 0
    const progress = Math.min((actual / goal.target) * 100, 100)
    return {
      ...goal,
      actual,
      progress: Math.round(progress),
      remaining: Math.max(goal.target - actual, 0)
    }
  })
})

// 近7天学习趋势
const last7DaysTrend = computed(() => {
  const days = []
  const now = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(now.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    const dayRecords = studyStore.studyRecords.filter(r => r.date === dateStr)
    const minutes = dayRecords.reduce((sum, r) => sum + r.duration, 0)
    
    days.push({
      date: dateStr,
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      minutes,
      hours: (minutes / 60).toFixed(1)
    })
  }
  
  return days
})

// 提交快速记录
const submitQuickRecord = () => {
  if (!quickRecord.value.content.trim()) {
    ElMessage.warning('请输入学习内容')
    return
  }
  
  const today = new Date().toISOString().split('T')[0]
  const now = new Date()
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  
  const newRecord = {
    id: `record_${today}_${Date.now()}`,
    date: today,
    subject: quickRecord.value.subject,
    duration: quickRecord.value.duration,
    content: `${quickRecord.value.content}（${timeStr}）`,
    type: 'study',
    createdAt: new Date().toISOString()
  }
  
  studyStore.addStudyRecord(newRecord as any)
  ElMessage.success('学习记录已添加！')
  
  // 重置表单
  quickRecord.value.content = ''
  quickRecord.value.duration = 60
  showQuickRecord.value = false
}

// 获取趋势条的高度
const getTrendHeight = (minutes: number) => {
  const maxMinutes = Math.max(...last7DaysTrend.value.map(d => d.minutes), 1)
  return Math.max((minutes / maxMinutes) * 100, 5) // 最小5%高度
}

// 获取趋势条的颜色
const getTrendColor = (minutes: number) => {
  if (minutes === 0) return '#e0e0e0'
  if (minutes < 60) return '#ff6b6b'
  if (minutes < 120) return '#ffa500'
  if (minutes < 180) return '#ffd700'
  return '#4caf50'
}
</script>

<template>
  <div class="learning-overview">
    <!-- 快速记录 -->
    <el-card class="overview-card quick-record-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon><Plus /></el-icon>
          <span>快速记录学习</span>
        </div>
      </template>
      
      <div v-if="!showQuickRecord" class="quick-actions">
        <el-button 
          type="primary" 
          size="large"
          @click="showQuickRecord = true"
          class="add-record-btn"
        >
          <el-icon><Plus /></el-icon>
          <span>添加学习记录</span>
        </el-button>
      </div>
      
      <div v-else class="quick-form">
        <el-form :model="quickRecord" label-width="80px">
          <el-form-item label="科目">
            <el-select v-model="quickRecord.subject" style="width: 100%">
              <el-option 
                v-for="subj in subjects" 
                :key="subj" 
                :label="subj" 
                :value="subj" 
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="时长">
            <el-input-number 
              v-model="quickRecord.duration" 
              :min="5" 
              :max="300"
              :step="5"
              style="width: 100%"
            >
              <template #append>分钟</template>
            </el-input-number>
          </el-form-item>
          
          <el-form-item label="内容">
            <el-input 
              v-model="quickRecord.content"
              type="textarea"
              :rows="2"
              placeholder="例如：高数第二章强化"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="submitQuickRecord">保存</el-button>
            <el-button @click="showQuickRecord = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 本周统计 -->
    <el-card class="overview-card weekly-stats-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon><Calendar /></el-icon>
          <span>本周学习统计</span>
        </div>
      </template>
      
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ weeklyStats.totalHours }}</div>
          <div class="stat-label">总学时</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ weeklyStats.recordCount }}</div>
          <div class="stat-label">学习次数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ weeklyStats.dailyAverage }}</div>
          <div class="stat-label">日均分钟</div>
        </div>
      </div>
    </el-card>

    <!-- 本周目标 -->
    <el-card class="overview-card goals-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon><Aim /></el-icon>
          <span>本周目标</span>
        </div>
      </template>
      
      <div class="goals-list">
        <div v-for="goal in weeklyGoals" :key="goal.subject" class="goal-item">
          <div class="goal-header">
            <span class="goal-icon">{{ goal.icon }}</span>
            <span class="goal-name">{{ goal.subject }}</span>
            <span class="goal-progress">{{ goal.progress }}%</span>
          </div>
          <el-progress 
            :percentage="goal.progress" 
            :color="goal.color"
            :stroke-width="8"
          />
          <div class="goal-detail">
            <span>已完成 {{ Math.floor(goal.actual / 60) }}小时{{ goal.actual % 60 }}分钟</span>
            <span v-if="goal.remaining > 0" class="remaining">
              还需 {{ Math.floor(goal.remaining / 60) }}小时{{ goal.remaining % 60 }}分钟
            </span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 学习趋势 -->
    <el-card class="overview-card trend-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon><TrendCharts /></el-icon>
          <span>近7天学习趋势</span>
        </div>
      </template>
      
      <div class="trend-chart">
        <div class="chart-bars">
          <div 
            v-for="day in last7DaysTrend" 
            :key="day.date"
            class="chart-bar-wrapper"
          >
            <div 
              class="chart-bar"
              :style="{
                height: getTrendHeight(day.minutes) + '%',
                backgroundColor: getTrendColor(day.minutes)
              }"
            >
              <div class="bar-tooltip" v-if="day.minutes > 0">
                {{ day.hours }}h
              </div>
            </div>
            <div class="chart-label">{{ day.label }}</div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.learning-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.overview-card {
  border-radius: 16px;
  transition: all 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1em;
  font-weight: 600;
  color: #333;
}

/* 快速记录卡片 */
.quick-record-card {
  grid-column: span 1;
}

.quick-actions {
  text-align: center;
  padding: 20px 0;
}

.add-record-btn {
  width: 100%;
  height: 60px;
  font-size: 1.1em;
  border-radius: 12px;
}

.quick-form {
  padding: 10px 0;
}

/* 本周统计卡片 */
.weekly-stats-card {
  grid-column: span 1;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  text-align: center;
}

.stat-item {
  padding: 15px;
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
  border-radius: 12px;
}

.stat-value {
  font-size: 2em;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9em;
  color: #666;
}

/* 本周目标卡片 */
.goals-card {
  grid-column: span 2;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.goal-item {
  padding: 15px;
  background: #fafafa;
  border-radius: 12px;
}

.goal-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.goal-icon {
  font-size: 1.5em;
}

.goal-name {
  font-weight: 600;
  font-size: 1.1em;
  color: #333;
  flex: 1;
}

.goal-progress {
  font-weight: 700;
  font-size: 1.2em;
  color: #667eea;
}

.goal-detail {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 0.9em;
  color: #666;
}

.remaining {
  color: #ff6b6b;
  font-weight: 500;
}

/* 学习趋势卡片 */
.trend-card {
  grid-column: span 2;
}

.trend-chart {
  padding: 20px 0;
}

.chart-bars {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 200px;
  padding: 0 10px;
}

.chart-bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 60px;
}

.chart-bar {
  width: 100%;
  min-height: 5px;
  border-radius: 8px 8px 0 0;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
}

.chart-bar:hover {
  opacity: 0.8;
  transform: scaleY(1.05);
}

.bar-tooltip {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.85em;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.chart-bar:hover .bar-tooltip {
  opacity: 1;
}

.chart-label {
  margin-top: 10px;
  font-size: 0.85em;
  color: #666;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .learning-overview {
    grid-template-columns: 1fr;
    padding: 10px;
  }
  
  .goals-card,
  .trend-card {
    grid-column: span 1;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-bars {
    height: 150px;
  }
}
</style>
