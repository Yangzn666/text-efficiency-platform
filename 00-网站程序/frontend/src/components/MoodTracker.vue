<template>
  <div class="mood-tracker">
    <!-- 情绪记录表单 -->
    <div class="mood-form">
      <h3>😊 记录当前情绪</h3>
      <div class="mood-input">
        <div class="mood-slider-section">
          <label>当前情绪状态 (1-10):</label>
          <div class="mood-slider-container">
            <el-slider
              v-model="currentMood"
              :min="1"
              :max="10"
              show-input
              show-stops
              @change="onMoodChange"
            />
            <span class="mood-emoji">{{ getMoodEmoji(currentMood) }}</span>
          </div>
        </div>
        
        <div class="mood-notes">
          <label>情绪备注:</label>
          <el-input
            v-model="moodNotes"
            type="textarea"
            :rows="3"
            placeholder="描述当前的感受、触发事件或想法..."
          />
        </div>
        
        <el-button 
          type="primary" 
          @click="recordMood"
          :disabled="!canRecord"
          size="large"
        >
          记录情绪
        </el-button>
      </div>
    </div>

    <!-- 情绪趋势图 -->
    <div class="mood-trends">
      <h3>📊 情绪趋势</h3>
      <div class="trend-controls">
        <el-radio-group v-model="trendPeriod" @change="updateTrendData">
          <el-radio-button label="week">近一周</el-radio-button>
          <el-radio-button label="month">近一月</el-radio-button>
          <el-radio-button label="threeMonths">近三月</el-radio-button>
        </el-radio-group>
      </div>
      
      <div class="trend-chart">
        <div 
          v-if="moodEntries.length === 0"
          class="chart-placeholder"
        >
          <el-icon size="60" color="#999"><TrendCharts /></el-icon>
          <h4>暂无情绪数据</h4>
          <p>开始记录你的情绪变化吧</p>
        </div>
        
        <div 
          v-else
          class="mood-chart"
        >
          <div class="chart-grid">
            <!-- Y轴标签 -->
            <div class="y-axis">
              <div class="y-label" style="bottom: 90%">10 😄</div>
              <div class="y-label" style="bottom: 70%">8</div>
              <div class="y-label" style="bottom: 50%">6</div>
              <div class="y-label" style="bottom: 30%">4</div>
              <div class="y-label" style="bottom: 10%">2 😢</div>
            </div>
            
            <!-- 图表主体 -->
            <div class="chart-body">
              <div 
                v-for="(entry, index) in displayedEntries" 
                :key="entry.id"
                class="mood-point"
                :style="getPointStyle(entry, index)"
                @mouseenter="showTooltip(entry, $event)"
                @mouseleave="hideTooltip"
              >
                <div class="point-dot"></div>
              </div>
              
              <!-- 连接线 -->
              <svg class="chart-lines" width="100%" height="100%">
                <polyline
                  :points="getPolylinePoints()"
                  fill="none"
                  stroke="#667eea"
                  stroke-width="3"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 情绪记录历史 -->
    <div class="mood-history">
      <h3>📋 情绪记录历史</h3>
      <div class="history-list">
        <div 
          v-if="recentEntries.length === 0"
          class="empty-history"
        >
          <el-icon size="60" color="#999"><Document /></el-icon>
          <h4>暂无记录</h4>
          <p>开始你的情绪追踪之旅吧</p>
        </div>
        
        <div 
          v-else
          class="entries-list"
        >
          <div 
            v-for="entry in recentEntries" 
            :key="entry.id"
            class="entry-item"
          >
            <div class="entry-header">
              <div class="entry-mood">
                <span class="mood-emoji-large">{{ getMoodEmoji(entry.mood) }}</span>
                <span class="mood-value">{{ entry.mood }}/10</span>
              </div>
              <div class="entry-date">
                {{ formatDateTime(entry.timestamp) }}
              </div>
            </div>
            
            <div v-if="entry.notes" class="entry-notes">
              {{ entry.notes }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 情绪洞察 -->
    <div class="mood-insights">
      <h3>💡 情绪洞察</h3>
      <div class="insights-grid">
        <div class="insight-card">
          <div class="insight-icon">📈</div>
          <div class="insight-info">
            <div class="insight-value">{{ averageMood.toFixed(1) }}</div>
            <div class="insight-label">平均情绪</div>
          </div>
        </div>
        
        <div class="insight-card">
          <div class="insight-icon">🔥</div>
          <div class="insight-info">
            <div class="insight-value">{{ moodImprovement }}%</div>
            <div class="insight-label">情绪改善</div>
          </div>
        </div>
        
        <div class="insight-card">
          <div class="insight-icon">📝</div>
          <div class="insight-info">
            <div class="insight-value">{{ moodEntries.length }}</div>
            <div class="insight-label">记录次数</div>
          </div>
        </div>
        
        <div class="insight-card">
          <div class="insight-icon">📅</div>
          <div class="insight-info">
            <div class="insight-value">{{ streakDays }}</div>
            <div class="insight-label">连续记录</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 情绪提示框 -->
    <div 
      v-if="tooltipVisible"
      class="mood-tooltip"
      :style="tooltipStyle"
    >
      <div class="tooltip-content">
        <div class="tooltip-mood">
          {{ getMoodEmoji(tooltipEntry.mood) }} {{ tooltipEntry.mood }}/10
        </div>
        <div class="tooltip-date">
          {{ formatDateTime(tooltipEntry.timestamp) }}
        </div>
        <div v-if="tooltipEntry.notes" class="tooltip-notes">
          {{ tooltipEntry.notes }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

interface MoodEntry {
  id: string
  mood: number
  notes: string
  timestamp: string
}

// 状态
const currentMood = ref(5)
const moodNotes = ref('')
const trendPeriod = ref('week')
const moodEntries = ref<MoodEntry[]>([])
const tooltipVisible = ref(false)
const tooltipEntry = ref<MoodEntry>({ id: '', mood: 5, notes: '', timestamp: '' })
const tooltipStyle = ref({})

// 计算属性
const canRecord = computed(() => currentMood.value >= 1 && currentMood.value <= 10)

const displayedEntries = computed(() => {
  const periodMap: Record<string, number> = {
    'week': 7,
    'month': 30,
    'threeMonths': 90
  }
  
  const days = periodMap[trendPeriod.value] || 7
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)
  
  return moodEntries.value
    .filter(entry => new Date(entry.timestamp) >= cutoffDate)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
})

const recentEntries = computed(() => {
  return [...moodEntries.value]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)
})

const averageMood = computed(() => {
  if (moodEntries.value.length === 0) return 0
  const sum = moodEntries.value.reduce((acc, entry) => acc + entry.mood, 0)
  return sum / moodEntries.value.length
})

const moodImprovement = computed(() => {
  if (moodEntries.value.length < 2) return 0
  
  const recentEntries = [...moodEntries.value]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)
  
  const olderEntries = [...moodEntries.value]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(5, 10)
  
  if (olderEntries.length === 0) return 0
  
  const recentAvg = recentEntries.reduce((acc, entry) => acc + entry.mood, 0) / recentEntries.length
  const olderAvg = olderEntries.reduce((acc, entry) => acc + entry.mood, 0) / olderEntries.length
  
  return Math.round(((recentAvg - olderAvg) / olderAvg) * 100)
})

const streakDays = computed(() => {
  if (moodEntries.value.length === 0) return 0
  
  const sortedEntries = [...moodEntries.value]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let i = sortedEntries.length - 1; i >= 0; i--) {
    const entryDate = new Date(sortedEntries[i].timestamp)
    entryDate.setHours(0, 0, 0, 0)
    
    const diffDays = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === streak) {
      streak++
    } else {
      break
    }
  }
  
  return streak
})

// 方法
const getMoodEmoji = (mood: number) => {
  if (mood <= 3) return '😢'
  if (mood <= 6) return '😐'
  if (mood <= 8) return '🙂'
  return '😄'
}

const onMoodChange = (value: number) => {
  currentMood.value = value
}

const recordMood = () => {
  if (!canRecord.value) return
  
  const newEntry: MoodEntry = {
    id: Date.now().toString(),
    mood: currentMood.value,
    notes: moodNotes.value.trim(),
    timestamp: new Date().toISOString()
  }
  
  moodEntries.value.push(newEntry)
  saveMoodData()
  
  // 重置表单
  currentMood.value = 5
  moodNotes.value = ''
  
  ElMessage.success('情绪记录保存成功！')
}

const updateTrendData = () => {
  // 数据已通过计算属性自动更新
}

const getPointStyle = (entry: MoodEntry, index: number) => {
  const xPercent = moodEntries.value.length > 1 
    ? (index / (moodEntries.value.length - 1)) * 100 
    : 50
  
  const yPercent = ((entry.mood - 1) / 9) * 100
  
  return {
    left: `${xPercent}%`,
    bottom: `${yPercent}%`
  }
}

const getPolylinePoints = () => {
  return displayedEntries.value
    .map((entry, index) => {
      const xPercent = displayedEntries.value.length > 1 
        ? (index / (displayedEntries.value.length - 1)) * 100 
        : 50
      
      const yPercent = ((entry.mood - 1) / 9) * 100
      
      return `${xPercent}%,${100 - yPercent}%`
    })
    .join(' ')
}

const showTooltip = (entry: MoodEntry, event: MouseEvent) => {
  tooltipEntry.value = entry
  tooltipVisible.value = true
  
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  tooltipStyle.value = {
    left: `${rect.left + rect.width / 2}px`,
    top: `${rect.top - 10}px`,
    transform: 'translateX(-50%) translateY(-100%)'
  }
}

const hideTooltip = () => {
  tooltipVisible.value = false
}

const formatDateTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const saveMoodData = () => {
  localStorage.setItem('moodEntries', JSON.stringify(moodEntries.value))
}

const loadMoodData = () => {
  const saved = localStorage.getItem('moodEntries')
  if (saved) {
    try {
      moodEntries.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to load mood data:', e)
    }
  }
}

// 初始化
onMounted(() => {
  loadMoodData()
})
</script>

<style scoped>
.mood-tracker {
  padding: 20px 0;
}

.mood-form {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.mood-form h3 {
  color: #333;
  margin: 0 0 20px 0;
  font-size: 1.4em;
}

.mood-input {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mood-slider-section label,
.mood-notes label {
  display: block;
  margin-bottom: 10px;
  color: #333;
  font-weight: 500;
}

.mood-slider-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.mood-emoji {
  font-size: 2em;
  min-width: 50px;
  text-align: center;
}

.mood-trends {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.mood-trends h3 {
  color: #333;
  margin: 0 0 20px 0;
  font-size: 1.4em;
}

.trend-controls {
  margin-bottom: 25px;
}

.trend-chart {
  height: 300px;
  position: relative;
}

.chart-placeholder {
  text-align: center;
  padding: 80px 20px;
  color: #999;
}

.chart-placeholder h4 {
  margin: 20px 0 10px 0;
  color: #666;
}

.chart-grid {
  position: relative;
  width: 100%;
  height: 100%;
}

.y-axis {
  position: absolute;
  left: 0;
  top: 0;
  width: 50px;
  height: 100%;
  border-right: 1px solid #eee;
}

.y-label {
  position: absolute;
  left: 0;
  transform: translateY(50%);
  font-size: 0.8em;
  color: #666;
  width: 40px;
  text-align: right;
  padding-right: 10px;
}

.chart-body {
  position: absolute;
  left: 60px;
  top: 0;
  right: 0;
  bottom: 40px;
  border-bottom: 1px solid #eee;
  border-left: 1px solid #eee;
}

.mood-point {
  position: absolute;
  transform: translate(-50%, 50%);
  cursor: pointer;
}

.point-dot {
  width: 12px;
  height: 12px;
  background: #667eea;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.chart-lines {
  position: absolute;
  top: 0;
  left: 0;
}

.mood-history {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.mood-history h3 {
  color: #333;
  margin: 0 0 20px 0;
  font-size: 1.4em;
}

.entries-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.entry-item {
  padding: 20px;
  background: #fafafa;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.entry-mood {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mood-emoji-large {
  font-size: 1.8em;
}

.mood-value {
  font-weight: 700;
  color: #333;
  font-size: 1.2em;
}

.entry-date {
  color: #999;
  font-size: 0.9em;
}

.entry-notes {
  color: #666;
  line-height: 1.6;
  padding-left: 10px;
  border-left: 2px solid #ddd;
}

.empty-history {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.mood-insights {
  background: #f8f9ff;
  border-radius: 15px;
  padding: 25px;
  border: 1px solid #e0e7ff;
}

.mood-insights h3 {
  color: #333;
  margin: 0 0 20px 0;
  font-size: 1.4em;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
}

.insight-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.insight-icon {
  font-size: 2em;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.insight-info {
  flex: 1;
}

.insight-value {
  font-size: 1.8em;
  font-weight: 800;
  color: #333;
  margin-bottom: 5px;
}

.insight-label {
  color: #666;
  font-size: 0.9em;
}

.mood-tooltip {
  position: fixed;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 15px;
  border-radius: 10px;
  font-size: 0.9em;
  pointer-events: none;
  min-width: 200px;
}

.tooltip-content {
  text-align: center;
}

.tooltip-mood {
  font-size: 1.2em;
  margin-bottom: 8px;
  font-weight: 600;
}

.tooltip-date {
  color: #ccc;
  font-size: 0.85em;
  margin-bottom: 10px;
}

.tooltip-notes {
  color: #eee;
  font-size: 0.9em;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mood-slider-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .entry-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .insights-grid {
    grid-template-columns: 1fr;
  }
  
  .insight-card {
    justify-content: center;
  }
}
</style>