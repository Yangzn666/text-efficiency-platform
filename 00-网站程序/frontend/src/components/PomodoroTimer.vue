<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAttentionStore } from '@/stores/attention'
import { ElMessage } from 'element-plus'

const attentionStore = useAttentionStore()

const selectedSubject = ref('')
const subjects = ref(['408计算机科学综合', '数学一', '英语一', '政治'])
const timerInterval = ref<number | null>(null)

// 计算属性
const formattedTime = computed(() => {
  const minutes = Math.floor(attentionStore.remainingTime / 60)
  const seconds = attentionStore.remainingTime % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const progressPercentage = computed(() => {
  if (!attentionStore.currentSession) return 0
  const totalTime = attentionStore.currentSession.duration * 60
  return ((totalTime - attentionStore.remainingTime) / totalTime) * 100
})

const sessionStatusText = computed(() => {
  switch (attentionStore.timerState) {
    case 'idle': return '准备开始专注时间'
    case 'running': return `专注学习中 - ${attentionStore.currentSession?.subject}`
    case 'paused': return '已暂停'
    case 'completed': return '专注时间完成！休息一下吧'
    default: return ''
  }
})

// 方法
const startSession = () => {
  if (!selectedSubject.value) {
    ElMessage.warning('请选择学习科目')
    return
  }
  
  if (attentionStore.timerState !== 'idle') {
    ElMessage.warning('当前已有进行中的专注时间')
    return
  }

  attentionStore.startPomodoroSession(selectedSubject.value)
  ElMessage.success(`开始${selectedSubject.value}专注学习`)
}

const togglePause = () => {
  if (attentionStore.timerState === 'running') {
    attentionStore.pauseSession()
  } else if (attentionStore.timerState === 'paused') {
    attentionStore.resumeSession()
  }
}

const interruptSession = () => {
  if (attentionStore.currentSession) {
    attentionStore.interruptSession()
    ElMessage.info('专注时间已中断')
  }
}

const handleDistraction = () => {
  // TODO: 实现诱惑记录功能
  ElMessage.info('诱惑记录功能开发中')
}

// 定时器逻辑
const startTimer = () => {
  if (timerInterval.value) return
  
  timerInterval.value = window.setInterval(() => {
    attentionStore.tick()
    
    // 检查是否完成
    if (attentionStore.timerState === 'completed') {
      ElMessage.success('专注时间完成！🎉')
      stopTimer()
    }
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

// 生命周期
onMounted(() => {
  attentionStore.initializeAttentionData()
  
  // 根据状态决定是否启动定时器
  if (attentionStore.timerState === 'running') {
    startTimer()
  }
})

onUnmounted(() => {
  stopTimer()
})

// 监听状态变化
watch(() => attentionStore.timerState, (newState: string) => {
  if (newState === 'running') {
    startTimer()
  } else if (newState === 'idle' || newState === 'completed') {
    stopTimer()
  }
})
</script>

<template>
  <div class="pomodoro-container">
    <!-- 状态显示区域 -->
    <div class="status-section">
      <h2 class="section-title">专注时间管理</h2>
      <div class="status-display">
        <div class="timer-display">
          <div class="time-text">{{ formattedTime }}</div>
          <div class="status-text">{{ sessionStatusText }}</div>
        </div>
        
        <div class="progress-container">
          <div 
            class="progress-ring"
            :style="{ 
              background: `conic-gradient(#FF6B6B ${progressPercentage}%, #f0f0f0 ${progressPercentage}%)`
            }"
          >
            <div class="progress-inner">
              {{ Math.round(progressPercentage) }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 控制区域 -->
    <div class="controls-section">
      <div v-if="attentionStore.timerState === 'idle'" class="start-controls">
        <el-select 
          v-model="selectedSubject" 
          placeholder="选择学习科目"
          size="large"
          class="subject-select"
        >
          <el-option
            v-for="subject in subjects"
            :key="subject"
            :label="subject"
            :value="subject"
          />
        </el-select>
        
        <el-button 
          type="primary" 
          size="large"
          class="start-button"
          @click="startSession"
        >
          <el-icon><Play /></el-icon>
          开始专注
        </el-button>
      </div>

      <div v-else class="session-controls">
        <el-button 
          v-if="attentionStore.timerState === 'running'"
          type="warning"
          size="large"
          @click="togglePause"
        >
          <el-icon><VideoPause /></el-icon>
          暂停
        </el-button>
        
        <el-button 
          v-else-if="attentionStore.timerState === 'paused'"
          type="primary"
          size="large"
          @click="togglePause"
        >
          <el-icon><Play /></el-icon>
          继续
        </el-button>
        
        <el-button 
          type="danger"
          size="large"
          @click="interruptSession"
        >
          <el-icon><CircleClose /></el-icon>
          中断
        </el-button>
      </div>
    </div>

    <!-- 诱惑对抗区域 -->
    <div class="distraction-section">
      <h3 class="subsection-title">短视频诱惑对抗</h3>
      <div class="distraction-controls">
        <el-button 
          type="warning"
          @click="handleDistraction"
        >
          <el-icon><Warning /></el-icon>
          记录诱惑时刻
        </el-button>
        
        <div class="distraction-info">
          <p>今日诱惑次数：{{ attentionStore.distractionCountToday }}</p>
          <p>今日专注时间：{{ attentionStore.todaysFocusTime }}分钟</p>
          <p>完成率：{{ attentionStore.sessionCompletionRate }}%</p>
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="stats-section">
      <h3 class="subsection-title">今日统计</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ attentionStore.todaysSessions.length }}</div>
          <div class="stat-label">专注会话</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ attentionStore.todaysFocusTime }}</div>
          <div class="stat-label">专注分钟</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ attentionStore.sessionCompletionRate }}%</div>
          <div class="stat-label">完成率</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pomodoro-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;
}

.section-title {
  text-align: center;
  color: white;
  font-size: 2em;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.status-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}

.status-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}

.timer-display {
  flex: 1;
}

.time-text {
  font-size: 4em;
  font-weight: 700;
  color: #FF6B6B;
  font-family: 'Courier New', monospace;
  text-align: center;
  margin-bottom: 10px;
}

.status-text {
  text-align: center;
  color: #666666;
  font-size: 1.2em;
  font-weight: 500;
}

.progress-container {
  flex-shrink: 0;
}

.progress-ring {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.progress-inner {
  width: 120px;
  height: 120px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  font-weight: 600;
  color: #FF6B6B;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.controls-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  text-align: center;
}

.start-controls {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.subject-select {
  width: 250px;
}

.start-button {
  height: 40px;
  font-size: 1.1em;
  font-weight: 500;
  background: linear-gradient(135deg, #FF6B6B 0%, #4CAF50 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.session-controls {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.subsection-title {
  color: white;
  font-size: 1.5em;
  margin-bottom: 20px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
}

.distraction-section, .stats-section {
  background: white;
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}

.distraction-controls {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.distraction-info {
  flex: 1;
  color: #666666;
}

.distraction-info p {
  margin: 8px 0;
  font-size: 1.1em;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.stat-value {
  font-size: 2em;
  font-weight: 700;
  color: #FF6B6B;
  margin-bottom: 8px;
}

.stat-label {
  color: #666666;
  font-size: 1.1em;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .pomodoro-container {
    padding: 20px 15px;
  }
  
  .status-display {
    flex-direction: column;
    gap: 20px;
  }
  
  .time-text {
    font-size: 3em;
  }
  
  .progress-ring {
    width: 120px;
    height: 120px;
  }
  
  .progress-inner {
    width: 90px;
    height: 90px;
    font-size: 1.2em;
  }
  
  .start-controls {
    flex-direction: column;
  }
  
  .subject-select {
    width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}
</style>