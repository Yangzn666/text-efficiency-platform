<template>
  <div class="study-stats-container">
    <!-- 今日学习概览 -->
    <div class="today-overview card">
      <div class="card-header">
        <h3 class="card-title">📊 今日学习概览</h3>
        <el-tag type="success" effect="dark">{{ currentDate }}</el-tag>
      </div>
      
      <div class="overview-grid">
        <div class="stat-item primary">
          <div class="stat-content">
            <div class="stat-value">{{ todayMinutes }}</div>
            <div class="stat-label">学习时长(分钟)</div>
          </div>
        </div>
        
        <div class="stat-item success">
          <div class="stat-content">
            <div class="stat-value">{{ todaySessionCount }}</div>
            <div class="stat-label">学习次数</div>
          </div>
        </div>
        
        <div class="stat-item warning">
          <div class="stat-content">
            <div class="stat-value">{{ todaySubjects }}</div>
            <div class="stat-label">学习科目</div>
          </div>
        </div>
      </div>
      
      <!-- 各科学习时长进度条 -->
      <div class="subject-progress" v-if="todaySubjectStats.length > 0">
        <h4 class="section-title">各科学习时长</h4>
        <div 
          v-for="stat in todaySubjectStats" 
          :key="stat.subject"
          class="subject-bar"
        >
          <div class="subject-info">
            <span class="subject-name">{{ stat.subject }}</span>
            <span class="subject-time">{{ stat.minutes }}分钟</span>
          </div>
          <el-progress 
            :percentage="getSubjectPercentage(stat.minutes)" 
            :color="stat.color"
            :stroke-width="8"
          />
        </div>
      </div>
    </div>
    
    <!-- 最近学习记录 -->
    <div class="recent-records card">
      <div class="card-header">
        <h3 class="card-title">📝 最近学习记录</h3>
        <el-button size="small" @click="showAllRecords = !showAllRecords">
          {{ showAllRecords ? '收起' : '查看全部' }}
        </el-button>
      </div>
      
      <div class="records-list">
        <div 
          v-for="record in displayRecords" 
          :key="record.id"
          class="record-item"
        >
          <div class="record-time">
            <div class="record-date">{{ formatDate(record.createdAt) }}</div>
            <div class="record-clock">{{ formatTime(record.createdAt) }}</div>
          </div>
          
          <div class="record-content">
            <div class="record-header">
              <el-tag 
                :color="getSubjectColor(record.subject)"
                effect="dark"
                size="small"
              >
                {{ record.subject }}
              </el-tag>
              <span class="record-duration">{{ record.duration }}分钟</span>
            </div>
            <div class="record-detail">{{ record.content }}</div>
            <div class="record-type" v-if="record.type">
              <el-tag size="small" effect="plain">
                {{ getTypeText(record.type) }}
              </el-tag>
            </div>
          </div>
        </div>
        
        <el-empty v-if="displayRecords.length === 0" description="暂无学习记录" />
      </div>
    </div>
    
    <!-- 本周学习趋势 -->
    <div class="weekly-trend card">
      <div class="card-header">
        <h3 class="card-title">📈 本周学习趋势</h3>
      </div>
      
      <div class="trend-chart">
        <div 
          v-for="day in weekDays" 
          :key="day.date"
          class="day-bar"
          :class="{ today: day.isToday }"
        >
          <div class="day-label">{{ day.weekday }}</div>
          <div class="bar-container">
            <div 
              class="bar-fill"
              :style="{ height: getBarHeight(day.minutes) + '%' }"
              :class="{ active: day.minutes > 0 }"
            >
              <span class="bar-value" v-if="day.minutes > 0">{{ day.minutes }}</span>
            </div>
          </div>
          <div class="day-date">{{ day.day }}</div>
        </div>
      </div>
      
      <div class="trend-summary">
        <div class="summary-item">
          <span class="label">本周总时长</span>
          <span class="value">{{ weekTotalMinutes }}分钟</span>
        </div>
        <div class="summary-item">
          <span class="label">日均时长</span>
          <span class="value">{{ weekAvgMinutes }}分钟</span>
        </div>
        <div class="summary-item">
          <span class="label">学习天数</span>
          <span class="value">{{ weekStudyDays }}天</span>
        </div>
      </div>
    </div>
    
    <!-- 学习热力图 -->
    <div class="heatmap card">
      <div class="card-header">
        <h3 class="card-title">🔥 学习热力图</h3>
        <div class="heatmap-legend">
          <span>少</span>
          <div class="legend-bar">
            <div class="legend-level level-0"></div>
            <div class="legend-level level-1"></div>
            <div class="legend-level level-2"></div>
            <div class="legend-level level-3"></div>
            <div class="legend-level level-4"></div>
          </div>
          <span>多</span>
        </div>
      </div>
      
      <div class="heatmap-grid">
        <div 
          v-for="day in heatmapDays" 
          :key="day.date"
          class="heatmap-cell"
          :class="getHeatmapClass(day.minutes)"
          :title="`${day.date}: ${day.minutes}分钟`"
        >
          <el-tooltip 
            :content="`${day.date} - ${day.minutes}分钟`"
            placement="top"
          >
            <div class="cell-content">
              <span class="cell-day">{{ day.day }}</span>
            </div>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStudyStore } from '@/stores/study'

const studyStore = useStudyStore()
const showAllRecords = ref(false)

// 当前日期
const currentDate = computed(() => {
  const today = new Date()
  return `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`
})

// 今日学习统计
const todayMinutes = computed(() => studyStore.todayStudyTime || 0)
const todaySessionCount = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return studyStore.studyRecords.filter(r => r.date === today).length
})
const todaySubjects = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  const subjects = new Set(studyStore.studyRecords.filter(r => r.date === today).map(r => r.subject))
  return subjects.size
})

// 今日各科统计
const todaySubjectStats = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  const todayRecords = studyStore.studyRecords.filter(r => r.date === today)
  
  const stats: Record<string, { minutes: number; color: string }> = {}
  const colors = ['#667eea', '#4CAF50', '#FF9800', '#2196F3', '#9C27B0', '#F44336']
  
  todayRecords.forEach((record, index) => {
    if (!stats[record.subject]) {
      stats[record.subject] = {
        minutes: 0,
        color: colors[index % colors.length]
      }
    }
    stats[record.subject].minutes += record.duration
  })
  
  return Object.entries(stats).map(([subject, data]) => ({
    subject,
    ...data
  }))
})

// 获取科目百分比（相对于今日总时长）
const getSubjectPercentage = (minutes: number) => {
  return todayMinutes.value > 0 ? Math.round((minutes / todayMinutes.value) * 100) : 0
}

// 获取科目颜色
const getSubjectColor = (subject: string) => {
  const colorMap: Record<string, string> = {
    '408计算机科学综合': '#667eea',
    '数学一': '#4CAF50',
    '英语一': '#2196F3',
    '政治': '#FF9800'
  }
  return colorMap[subject] || '#9C27B0'
}

// 获取类型文本
const getTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    'study': '学习',
    'practice': '练习',
    'review': '复习'
  }
  return typeMap[type] || type
}

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 格式化时间
const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 显示的学习记录（最近10条或全部）
const displayRecords = computed(() => {
  const sorted = [...studyStore.studyRecords].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  return showAllRecords.value ? sorted : sorted.slice(0, 10)
})

// 本周学习数据
const weekDays = computed(() => {
  const today = new Date()
  const days = []
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    const dayMinutes = studyStore.studyRecords
      .filter(r => r.date === dateStr)
      .reduce((sum, r) => sum + r.duration, 0)
    
    days.push({
      date: dateStr,
      day: date.getDate(),
      weekday: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
      minutes: dayMinutes,
      isToday: i === 0
    })
  }
  
  return days
})

const weekTotalMinutes = computed(() => {
  return weekDays.value.reduce((sum, day) => sum + day.minutes, 0)
})

const weekAvgMinutes = computed(() => {
  const studyDays = weekDays.value.filter(d => d.minutes > 0).length
  return studyDays > 0 ? Math.round(weekTotalMinutes.value / studyDays) : 0
})

const weekStudyDays = computed(() => {
  return weekDays.value.filter(d => d.minutes > 0).length
})

// 获取柱状图高度百分比
const getBarHeight = (minutes: number) => {
  const maxMinutes = Math.max(...weekDays.value.map(d => d.minutes), 1)
  return (minutes / maxMinutes) * 100
}

// 学习热力图（最近30天）
const heatmapDays = computed(() => {
  const today = new Date()
  const days = []
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    const dayMinutes = studyStore.studyRecords
      .filter(r => r.date === dateStr)
      .reduce((sum, r) => sum + r.duration, 0)
    
    days.push({
      date: dateStr,
      day: date.getDate(),
      minutes: dayMinutes
    })
  }
  
  return days
})

// 获取热力图等级
const getHeatmapClass = (minutes: number) => {
  if (minutes === 0) return 'level-0'
  if (minutes < 60) return 'level-1'
  if (minutes < 120) return 'level-2'
  if (minutes < 180) return 'level-3'
  return 'level-4'
}

onMounted(() => {
  // 确保数据已加载
  if (studyStore.studyRecords.length === 0) {
    studyStore.initializeStudyData()
  }
})
</script>

<style scoped lang="scss">
.study-stats-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  
  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
  
  .card-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
}

// 今日概览
.today-overview {
  grid-column: span 2;
  
  .overview-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }
  
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px;
    border-radius: 10px;
    background: #f8f9fa;
    text-align: center;
    
    &.primary { background: linear-gradient(135deg, #667eea20, #764ba220); }
    &.success { background: linear-gradient(135deg, #4CAF5020, #81C78420); }
    &.warning { background: linear-gradient(135deg, #FF980020, #FFB74D20); }
    
    .stat-icon {
      font-size: 32px;
    }
    
    .stat-content {
      flex: 1;
      
      .stat-value {
        font-size: 28px;
        font-weight: 700;
        color: #333;
        font-family: 'FZCuHei', monospace;
      }
      
      .stat-label {
        font-size: 13px;
        color: #666;
        margin-top: 4px;
      }
    }
  }
  
  .subject-progress {
    .section-title {
      font-size: 15px;
      font-weight: 600;
      color: #333;
      margin: 0 0 12px 0;
    }
    
    .subject-bar {
      margin-bottom: 12px;
      
      .subject-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
        font-size: 13px;
        
        .subject-name {
          font-weight: 500;
          color: #333;
        }
        
        .subject-time {
          color: #666;
        }
      }
    }
  }
}

// 最近记录
.recent-records {
  .records-list {
    max-height: 500px;
    overflow-y: auto;
    
    .record-item {
      display: flex;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 8px;
      background: #fafafa;
      transition: all 0.3s ease;
      
      &:hover {
        background: #f0f0f0;
      }
      
      .record-time {
        flex-shrink: 0;
        text-align: center;
        min-width: 60px;
        
        .record-date {
          font-size: 12px;
          color: #999;
          margin-bottom: 4px;
        }
        
        .record-clock {
          font-size: 16px;
          font-weight: 600;
          color: #667eea;
          font-family: 'FZCuHei', monospace;
        }
      }
      
      .record-content {
        flex: 1;
        
        .record-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
          
          .record-duration {
            font-size: 13px;
            font-weight: 600;
            color: #667eea;
          }
        }
        
        .record-detail {
          font-size: 13px;
          color: #666;
          line-height: 1.5;
          margin-bottom: 6px;
        }
        
        .record-type {
          display: inline-block;
        }
      }
    }
  }
}

// 本周趋势
.weekly-trend {
  .trend-chart {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    height: 200px;
    margin-bottom: 20px;
    padding: 0 10px;
    
    .day-bar {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      
      &.today {
        .day-label {
          color: #667eea;
          font-weight: 700;
        }
      }
      
      .day-label {
        font-size: 12px;
        color: #999;
        margin-bottom: 8px;
      }
      
      .bar-container {
        width: 30px;
        height: 150px;
        background: #f0f0f0;
        border-radius: 15px;
        overflow: hidden;
        position: relative;
        
        .bar-fill {
          position: absolute;
          bottom: 0;
          width: 100%;
          background: linear-gradient(to top, #667eea, #764ba2);
          border-radius: 15px;
          transition: height 0.5s ease;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 4px;
          
          &.active {
            background: linear-gradient(to top, #667eea, #764ba2);
          }
          
          .bar-value {
            font-size: 11px;
            font-weight: 600;
            color: white;
          }
        }
      }
      
      .day-date {
        font-size: 13px;
        font-weight: 600;
        color: #333;
        margin-top: 8px;
      }
    }
  }
  
  .trend-summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    
    .summary-item {
      text-align: center;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      
      .label {
        display: block;
        font-size: 12px;
        color: #999;
        margin-bottom: 4px;
      }
      
      .value {
        font-size: 18px;
        font-weight: 700;
        color: #667eea;
      }
    }
  }
}

// 热力图
.heatmap {
  .heatmap-legend {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #999;
    
    .legend-bar {
      display: flex;
      gap: 3px;
      
      .legend-level {
        width: 12px;
        height: 12px;
        border-radius: 2px;
        
        &.level-0 { background: #ebedf0; }
        &.level-1 { background: #9be9a8; }
        &.level-2 { background: #40c463; }
        &.level-3 { background: #30a14e; }
        &.level-4 { background: #216e39; }
      }
    }
  }
  
  .heatmap-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    margin-top: 16px;
    
    .heatmap-cell {
      aspect-ratio: 1;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        transform: scale(1.1);
      }
      
      &.level-0 { background: #ebedf0; }
      &.level-1 { background: #9be9a8; }
      &.level-2 { background: #40c463; }
      &.level-3 { background: #30a14e; }
      &.level-4 { background: #216e39; }
      
      .cell-content {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        
        .cell-day {
          font-size: 10px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.4);
        }
      }
    }
  }
}

// 成就
.achievements {
  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    
    .achievement-item {
      display: flex;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      background: #f8f9fa;
      opacity: 0.5;
      transition: all 0.3s ease;
      
      &.unlocked {
        opacity: 1;
        background: linear-gradient(135deg, #667eea20, #764ba220);
        border: 2px solid #667eea;
      }
      
      .achievement-icon {
        font-size: 28px;
      }
      
      .achievement-info {
        flex: 1;
        
        .achievement-name {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }
        
        .achievement-desc {
          font-size: 12px;
          color: #666;
          margin-bottom: 6px;
        }
      }
    }
  }
}

// 响应式
@media (max-width: 768px) {
  .study-stats-container {
    grid-template-columns: 1fr;
  }
  
  .today-overview {
    grid-column: span 1;
    
    .overview-grid {
      grid-template-columns: 1fr;
    }
  }
  
  .trend-chart {
    height: 150px !important;
  }
  
  .achievements-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
