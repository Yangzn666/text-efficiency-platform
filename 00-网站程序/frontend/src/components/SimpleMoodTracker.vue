<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePsychologyStore } from '@/stores/psychology'
import { ElMessage } from 'element-plus'

const psychologyStore = usePsychologyStore()

// 当前选择的心情
const currentMood = ref<number | null>(null)

// 心情选项
const moodOptions = [
  { value: 1, emoji: '😢', label: '低落', color: '#F56C6C' },
  { value: 2, emoji: '😕', label: '不太好', color: '#E6A23C' },
  { value: 3, emoji: '😐', label: '一般', color: '#909399' },
  { value: 4, emoji: '🙂', label: '不错', color: '#67C23A' },
  { value: 5, emoji: '😊', label: '很好', color: '#409EFF' }
]

// 今日是否已记录
const hasRecordedToday = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return psychologyStore.moodRecords.some((record: any) => record.timestamp.startsWith(today))
})

// 今日心情值（1-5映射到1-10）
const todayMood = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  const todayRecord = psychologyStore.moodRecords.find((record: any) => record.timestamp.startsWith(today))
  return todayRecord ? todayRecord.mood : null
})

// 最近7天的心情趋势
const moodTrend = computed(() => {
  const last7Days = psychologyStore.moodRecords.slice(-7)
  if (last7Days.length === 0) return null
  
  const avg = last7Days.reduce((sum: number, r: any) => sum + r.mood, 0) / last7Days.length
  return {
    average: avg.toFixed(1),
    trend: avg > 3.5 ? '上升 📈' : avg < 2.5 ? '下降 📉' : '平稳 ➡️'
  }
})

// 记录心情
const recordMood = async () => {
  if (!currentMood.value) {
    ElMessage.warning('请选择今天的心情')
    return
  }
  
  try {
    // 将1-5的评分转换为1-10的评分
    const moodValue = currentMood.value * 2
    psychologyStore.addMoodRecord(moodValue, '')
    ElMessage.success('心情记录成功！+10积分')
    currentMood.value = null
  } catch (error) {
    console.error('心情记录失败:', error)
    ElMessage.error('记录失败，请重试')
  }
}

onMounted(() => {
  psychologyStore.loadData()
})
</script>

<template>
  <div class="simple-mood-tracker">
    <div class="tracker-header">
      <h3>😊 今日心情打卡</h3>
      <p v-if="hasRecordedToday" class="recorded-badge">✅ 今日已记录</p>
    </div>

    <!-- 心情选择 -->
    <div class="mood-selection" v-if="!hasRecordedToday">
      <div 
        v-for="mood in moodOptions" 
        :key="mood.value"
        class="mood-option"
        :class="{ selected: currentMood === mood.value }"
        @click="currentMood = mood.value"
        :style="{ borderColor: currentMood === mood.value ? mood.color : '' }"
      >
        <div class="mood-emoji">{{ mood.emoji }}</div>
        <div class="mood-label">{{ mood.label }}</div>
      </div>
    </div>

    <!-- 已记录状态 -->
    <div v-else class="recorded-status">
      <div class="today-mood">
        <span class="mood-display">
          {{ moodOptions.find(m => m.value === Math.ceil((todayMood || 10) / 2))?.emoji || '😊' }}
        </span>
        <span class="mood-text">
          今日心情：{{ moodOptions.find(m => m.value === Math.ceil((todayMood || 10) / 2))?.label || '很好' }}
        </span>
      </div>
    </div>

    <!-- 心情趋势 -->
    <div class="mood-trend" v-if="moodTrend">
      <div class="trend-item">
        <span class="trend-label">近7天平均</span>
        <span class="trend-value">{{ moodTrend.average }}/5</span>
      </div>
      <div class="trend-item">
        <span class="trend-label">趋势</span>
        <span class="trend-value">{{ moodTrend.trend }}</span>
      </div>
    </div>

    <!-- 记录按钮 -->
    <el-button 
      v-if="!hasRecordedToday"
      type="primary" 
      size="large"
      @click="recordMood"
      :disabled="!currentMood"
      class="record-btn"
    >
      记录心情 (+10积分)
    </el-button>

    <!-- 小贴士 -->
    <div class="tips">
      <p>💡 每天花10秒钟记录心情，帮助你更好地了解自己的学习状态</p>
    </div>
  </div>
</template>

<style scoped>
.simple-mood-tracker {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.tracker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tracker-header h3 {
  margin: 0;
  font-size: 1.3em;
  color: #333;
}

.recorded-badge {
  color: #67C23A;
  font-size: 0.9em;
  font-weight: 500;
}

.mood-selection {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.mood-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 10px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.mood-option:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mood-option.selected {
  border-width: 3px;
  background: white;
  transform: scale(1.05);
}

.mood-emoji {
  font-size: 2.5em;
  margin-bottom: 8px;
}

.mood-label {
  font-size: 0.85em;
  color: #666;
  font-weight: 500;
}

.recorded-status {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  border-radius: 12px;
  margin-bottom: 20px;
}

.today-mood {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  color: white;
}

.mood-display {
  font-size: 3em;
}

.mood-text {
  font-size: 1.2em;
  font-weight: 500;
}

.mood-trend {
  display: flex;
  justify-content: space-around;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 20px;
}

.trend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.trend-label {
  font-size: 0.85em;
  color: #999;
}

.trend-value {
  font-size: 1.1em;
  font-weight: 600;
  color: #333;
}

.record-btn {
  width: 100%;
  margin-bottom: 15px;
}

.tips {
  padding: 12px;
  background: #fff8e1;
  border-left: 4px solid #FFD700;
  border-radius: 6px;
  font-size: 0.9em;
  color: #666;
}

.tips p {
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mood-selection {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .mood-trend {
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .mood-selection {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .mood-emoji {
    font-size: 2em;
  }
}
</style>
