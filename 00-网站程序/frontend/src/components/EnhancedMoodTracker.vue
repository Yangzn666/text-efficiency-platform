<template>
  <div class="enhanced-mood-tracker">
    <!-- 情绪仪表盘 -->
    <div class="mood-dashboard">
      <div class="dashboard-header">
        <h3>😊 情绪仪表盘</h3>
        <div class="mood-indicator">
          <span class="mood-emoji">{{ currentMoodEmoji }}</span>
          <span class="mood-text">{{ currentMoodDescription }}</span>
        </div>
      </div>
      
      <div class="mood-stats">
        <div class="stat-card">
          <div class="stat-value">{{ todayAverage }}</div>
          <div class="stat-label">今日平均</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ streakInfo.count }}天</div>
          <div class="stat-label">连续记录</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ moodTrendText }}</div>
          <div class="stat-label">情绪趋势</div>
        </div>
      </div>
    </div>

    <!-- 情绪记录表单 -->
    <div class="mood-recording">
      <h4>📝 记录当前情绪</h4>
      <div class="mood-input-section">
        <div class="mood-slider-container">
          <label>情绪状态 ({{ currentMood }}/10):</label>
          <el-slider
            v-model="currentMood"
            :min="1"
            :max="10"
            show-input
            show-stops
            @change="onMoodChange"
          />
          <div class="mood-scale">
            <span class="scale-low">低落 😔</span>
            <span class="scale-high">愉悦 😊</span>
          </div>
        </div>
        
        <div class="triggers-section">
          <label>情绪触发因素:</label>
          <el-checkbox-group v-model="selectedTriggers">
            <el-checkbox 
              v-for="trigger in triggerOptions" 
              :key="trigger.value"
              :label="trigger.value"
            >
              {{ trigger.label }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        
        <div class="notes-section">
          <label>详细描述:</label>
          <el-input
            v-model="moodNotes"
            type="textarea"
            :rows="3"
            placeholder="描述当前的感受、触发事件或想法..."
          />
        </div>
        
        <div class="linked-activity">
          <label>关联的学习活动:</label>
          <el-select v-model="linkedActivity" placeholder="选择相关的学习活动">
            <el-option label="无特定活动" value=""></el-option>
            <el-option 
              v-for="activity in recentActivities" 
              :key="activity.id"
              :label="activity.name"
              :value="activity.id"
            />
          </el-select>
        </div>
        
        <el-button 
          type="primary" 
          @click="recordMood"
          :disabled="!canRecord"
          size="large"
          class="record-button"
        >
          <el-icon><Edit /></el-icon>
          记录情绪 (获得{{ moodPoints }}积分)
        </el-button>
      </div>
    </div>

    <!-- 智能推荐 -->
    <div class="smart-recommendations" v-if="recommendedActivities.length > 0">
      <h4>💡 智能推荐活动</h4>
      <div class="recommendations-grid">
        <div 
          v-for="activity in recommendedActivities" 
          :key="activity.type"
          class="recommendation-card"
          @click="selectRecommendedActivity(activity)"
        >
          <div class="activity-icon">
            <el-icon size="24">
              <component :is="getActivityIcon(activity.type)" />
            </el-icon>
          </div>
          <div class="activity-info">
            <h5>{{ activity.name }}</h5>
            <div class="activity-points">+{{ activity.points }}积分</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 情绪历史 -->
    <div class="mood-history">
      <h4>📊 情绪历史</h4>
      <div class="history-controls">
        <el-radio-group v-model="historyPeriod" @change="updateHistoryData">
          <el-radio-button label="week">近一周</el-radio-button>
          <el-radio-button label="month">近一月</el-radio-button>
        </el-radio-group>
      </div>
      
      <div class="history-placeholder">
        <p>情绪历史记录功能正在开发中...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { usePsychologyStore } from '@/stores/psychology'
import { ElMessage } from 'element-plus'
import { 
  Edit, 
  Coffee, 
  Headset, 
  Notebook, 
  ChatRound, 
  MagicStick, 
  Trophy 
} from '@element-plus/icons-vue'

const psychologyStore = usePsychologyStore()

// 状态
const currentMood = ref(5)
const selectedTriggers = ref<string[]>([])
const moodNotes = ref('')
const linkedActivity = ref('')
const historyPeriod = ref('week')
const chartRef = ref<HTMLCanvasElement | null>(null)
// 移除图表相关代码

// 触发因素选项
const triggerOptions = [
  { value: '学习压力', label: '学习压力' },
  { value: '时间紧迫', label: '时间紧迫' },
  { value: '理解困难', label: '理解困难' },
  { value: '记忆问题', label: '记忆问题' },
  { value: '外界干扰', label: '外界干扰' },
  { value: '身体疲劳', label: '身体疲劳' },
  { value: '情绪波动', label: '情绪波动' },
  { value: '其他', label: '其他原因' }
]

// 最近活动（模拟数据）
const recentActivities = ref([
  { id: 'study_math', name: '数学专项练习' },
  { id: 'review_cs', name: '408复习' },
  { id: 'english_reading', name: '英语阅读' },
  { id: 'pomodoro_session', name: '番茄钟专注' }
])

// 计算属性
const currentMoodEmoji = computed(() => psychologyStore.getMoodEmoji(currentMood.value))
const currentMoodDescription = computed(() => {
  const mood = currentMood.value
  if (mood <= 3) return '非常低落'
  if (mood <= 5) return '有些沮丧'
  if (mood <= 7) return '一般般'
  if (mood <= 9) return '心情不错'
  return '非常愉悦'
})

const todayAverage = computed(() => {
  const avg = psychologyStore.todayMoodAverage
  return avg === 0 ? '--' : avg.toFixed(1)
})

const streakInfo = computed(() => psychologyStore.streakInfo)
const moodTrendText = computed(() => {
  const trend = psychologyStore.moodTrend
  return trend === 'improving' ? '上升 📈' : 
         trend === 'declining' ? '下降 📉' : '稳定 ➖'
})

const recommendedActivities = computed(() => psychologyStore.recommendedActivities)

const moodPoints = computed(() => {
  const mood = currentMood.value
  if (mood >= 8) return 20
  if (mood >= 6) return 10
  if (mood >= 4) return 5
  return 15
})

const canRecord = computed(() => currentMood.value > 0)

// 方法
const onMoodChange = (value: number) => {
  currentMood.value = value
}

const recordMood = () => {
  if (!canRecord.value) return
  
  psychologyStore.addMoodRecord(
    currentMood.value,
    moodNotes.value,
    selectedTriggers.value
  )
  
  ElMessage.success(`情绪记录成功！获得${moodPoints.value}积分`)
  
  // 重置表单
  currentMood.value = 5
  selectedTriggers.value = []
  moodNotes.value = ''
  linkedActivity.value = ''
}

const selectRecommendedActivity = (activity: any) => {
  ElMessage.info(`推荐活动: ${activity.name} (+${activity.points}积分)`)
  // 这里可以跳转到相应的功能页面
}

const getActivityIcon = (type: string) => {
  const icons: Record<string, any> = {
    'relax': Coffee,
    'music': Headset,
    'walk': Notebook,
    'study': Notebook,
    'social': ChatRound,
    'creative': MagicStick,
    'challenge': Trophy,
    'hobby': MagicStick,
    'teach': Notebook
  }
  return icons[type] || Notebook
}

const updateHistoryData = () => {
  // 移除图表更新逻辑
}

const initChart = () => {
  // 移除图表初始化逻辑
}

onMounted(() => {
  initChart()
})

watch(historyPeriod, () => {
  updateHistoryData()
})
</script>

<style scoped>
.enhanced-mood-tracker {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.mood-dashboard {
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  border-radius: 20px;
  padding: 25px;
  color: white;
  margin-bottom: 30px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dashboard-header h3 {
  margin: 0;
  font-size: 1.5em;
}

.mood-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mood-emoji {
  font-size: 2em;
}

.mood-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 15px;
  text-align: center;
}

.stat-value {
  font-size: 1.8em;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9em;
  opacity: 0.9;
}

.mood-recording {
  background: white;
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}

.mood-recording h4 {
  color: #333;
  margin: 0 0 20px 0;
  font-size: 1.3em;
}

.mood-input-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mood-slider-container {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 15px;
}

.mood-slider-container label {
  display: block;
  margin-bottom: 15px;
  font-weight: 500;
  color: #333;
}

.mood-scale {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 0.9em;
  color: #666;
}

.triggers-section, .notes-section, .linked-activity {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 15px;
}

.triggers-section label,
.notes-section label,
.linked-activity label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: #333;
}

.record-button {
  margin-top: 10px;
  height: 50px;
  font-size: 1.1em;
}

.smart-recommendations {
  background: white;
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}

.smart-recommendations h4 {
  color: #333;
  margin: 0 0 20px 0;
  font-size: 1.3em;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.recommendation-card {
  background: linear-gradient(135deg, #eef3fa 0%, #dbe7f5 100%);
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.recommendation-card:hover {
  transform: translateY(-5px);
  border-color: #ffc53d;
  box-shadow: 0 10px 25px rgba(13, 33, 55, 0.3);
}

.activity-icon {
  text-align: center;
  margin-bottom: 15px;
  color: #16345c;
}

.activity-info h5 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.1em;
}

.activity-points {
  color: #FF9800;
  font-weight: bold;
  font-size: 0.9em;
}

.mood-history {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}

.mood-history h4 {
  color: #333;
  margin: 0 0 20px 0;
  font-size: 1.3em;
}

.history-controls {
  margin-bottom: 20px;
}

.history-placeholder {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  background: #f8f9fa;
  border-radius: 15px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .enhanced-mood-tracker {
    padding: 15px;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .mood-stats {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .recommendations-grid {
    grid-template-columns: 1fr;
  }
}
</style>