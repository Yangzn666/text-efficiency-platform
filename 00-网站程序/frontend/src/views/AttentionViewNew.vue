<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAttentionStore } from '@/stores/attention'
import { ElMessage } from 'element-plus'
import { Play, Pause, Close, Timer, WarningFilled, DataLine } from '@element-plus/icons-vue'

const attentionStore = useAttentionStore()
const selectedSubject = ref('')
const showDistractionModal = ref(false)
const distractionType = ref('')

const subjects = [
  { label: '408计算机科学综合', value: '408计算机科学综合', color: '#409EFF' },
  { label: '数学一', value: '数学一', color: '#67C23A' },
  { label: '英语一', value: '英语一', color: '#E6A23C' },
  { label: '政治', value: '政治', color: '#F56C6C' }
]

const distractionTypes = [
  { label: '短视频', value: '短视频', icon: '📱' },
  { label: '社交媒体', value: '社交媒体', icon: '💬' },
  { label: '游戏', value: '游戏', icon: '🎮' },
  { label: '购物', value: '购物', icon: '🛒' },
  { label: '其他', value: '其他', icon: '⚠️' }
]

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

const currentSubjectColor = computed(() => {
  if (!attentionStore.currentSession) return '#409EFF'
  const subject = subjects.find(s => s.value === attentionStore.currentSession?.subject)
  return subject?.color || '#409EFF'
})

const sessionStatusText = computed(() => {
  switch (attentionStore.timerState) {
    case 'idle': return '准备开始专注'
    case 'running': return '专注学习中...'
    case 'paused': return '已暂停'
    case 'completed': return '完成！休息一下吧'
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

const recordDistraction = (type: string) => {
  const alternativeTasks = [
    '背5个英语单词',
    '做1道数学选择题',
    '看1页专业课笔记',
    '整理今日学习要点'
  ]
  const randomTask = alternativeTasks[Math.floor(Math.random() * alternativeTasks.length)]
  
  attentionStore.recordDistraction(type, randomTask)
  ElMessage.success(`已记录！请先完成：${randomTask}`)
  showDistractionModal.value = false
  distractionType.value = ''
}

onMounted(() => {
  attentionStore.initializeAttentionData()
})
</script>

<template>
  <div class="focus-zone">
    <!-- 顶部统计栏 -->
    <div class="stats-bar">
      <div class="stat-item">
        <div class="stat-value">{{ attentionStore.todaysSessions.length }}</div>
        <div class="stat-label">今日专注</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ attentionStore.todaysFocusTime }}</div>
        <div class="stat-label">专注分钟</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ attentionStore.sessionCompletionRate }}%</div>
        <div class="stat-label">完成率</div>
      </div>
      <div class="stat-item warning" @click="showDistractionModal = true">
        <div class="stat-value">{{ attentionStore.distractionCountToday }}</div>
        <div class="stat-label">诱惑次数</div>
      </div>
    </div>

    <!-- 主计时器区域 -->
    <div class="timer-section">
      <!-- 科目选择（仅在空闲时显示） -->
      <div v-if="attentionStore.timerState === 'idle'" class="subject-selector">
        <div class="selector-title">选择学习科目</div>
        <div class="subject-grid">
          <div 
            v-for="subject in subjects" 
            :key="subject.value"
            class="subject-card"
            :class="{ selected: selectedSubject === subject.value }"
            :style="{ borderColor: selectedSubject === subject.value ? subject.color : '' }"
            @click="selectedSubject = subject.value"
          >
            <div class="subject-name">{{ subject.label }}</div>
          </div>
        </div>
      </div>

      <!-- 计时器显示 -->
      <div class="timer-display">
        <div 
          class="progress-ring"
          :style="{ 
            background: `conic-gradient(${currentSubjectColor} ${progressPercentage}%, #2a2a2a ${progressPercentage}%)`
          }"
        >
          <div class="timer-inner">
            <div class="time-text">{{ formattedTime }}</div>
            <div class="status-text">{{ sessionStatusText }}</div>
            <div v-if="attentionStore.currentSession" class="subject-badge">
              {{ attentionStore.currentSession.subject }}
            </div>
          </div>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="controls">
        <button 
          v-if="attentionStore.timerState === 'idle'"
          class="btn btn-start"
          @click="startSession"
          :disabled="!selectedSubject"
        >
          <el-icon><Play /></el-icon>
          <span>开始专注</span>
        </button>

        <template v-else>
          <button class="btn btn-pause" @click="togglePause">
            <el-icon><Pause /></el-icon>
            <span>{{ attentionStore.timerState === 'running' ? '暂停' : '继续' }}</span>
          </button>
          
          <button class="btn btn-interrupt" @click="interruptSession">
            <el-icon><Close /></el-icon>
            <span>中断</span>
          </button>
        </template>
      </div>
    </div>

    <!-- 今日数据概览 -->
    <div class="daily-overview">
      <h3 class="section-title">
        <el-icon><DataLine /></el-icon>
        今日专注数据
      </h3>
      <div class="overview-grid">
        <div class="overview-card">
          <div class="card-header">
            <span class="card-icon">🎯</span>
            <span class="card-title">专注会话</span>
          </div>
          <div class="card-content">
            <div class="big-number">{{ attentionStore.todaysSessions.length }}</div>
            <div class="trend-text">次专注训练</div>
          </div>
        </div>

        <div class="overview-card">
          <div class="card-header">
            <span class="card-icon">⏱️</span>
            <span class="card-title">专注时长</span>
          </div>
          <div class="card-content">
            <div class="big-number">{{ attentionStore.todaysFocusTime }}</div>
            <div class="trend-text">分钟高效学习</div>
          </div>
        </div>

        <div class="overview-card">
          <div class="card-header">
            <span class="card-icon">✅</span>
            <span class="card-title">完成率</span>
          </div>
          <div class="card-content">
            <div class="big-number">{{ attentionStore.sessionCompletionRate }}%</div>
            <div class="trend-text">会话完成比例</div>
          </div>
        </div>

        <div class="overview-card warning-card">
          <div class="card-header">
            <span class="card-icon">⚠️</span>
            <span class="card-title">诱惑对抗</span>
          </div>
          <div class="card-content">
            <div class="big-number">{{ attentionStore.distractionCountToday }}</div>
            <div class="trend-text">次诱惑记录</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 诱惑记录弹窗 -->
    <div v-if="showDistractionModal" class="modal-overlay" @click.self="showDistractionModal = false">
      <div class="modal-content">
        <h3 class="modal-title">🚫 记录诱惑时刻</h3>
        <p class="modal-subtitle">选择一个替代任务来对抗诱惑</p>
        
        <div class="distraction-grid">
          <div 
            v-for="type in distractionTypes" 
            :key="type.value"
            class="distraction-card"
            :class="{ selected: distractionType === type.value }"
            @click="distractionType = type.value"
          >
            <div class="distraction-icon">{{ type.icon }}</div>
            <div class="distraction-name">{{ type.label }}</div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn btn-cancel" @click="showDistractionModal = false">取消</button>
          <button 
            class="btn btn-confirm" 
            @click="recordDistraction(distractionType)"
            :disabled="!distractionType"
          >
            确认记录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.focus-zone {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  color: #e0e0e0;
}

/* 顶部统计栏 */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.stat-item {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #2a2a2a;
}

.stat-item:hover {
  transform: translateY(-2px);
  border-color: #409EFF;
}

.stat-item.warning:hover {
  border-color: #E6A23C;
}

.stat-value {
  font-size: 2em;
  font-weight: 700;
  color: #409EFF;
  margin-bottom: 5px;
}

.stat-item.warning .stat-value {
  color: #E6A23C;
}

.stat-label {
  font-size: 0.9em;
  color: #999;
}

/* 计时器区域 */
.timer-section {
  background: #1a1a1a;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
  border: 1px solid #2a2a2a;
}

.subject-selector {
  margin-bottom: 40px;
}

.selector-title {
  font-size: 1.2em;
  color: #999;
  margin-bottom: 20px;
  text-align: center;
}

.subject-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.subject-card {
  background: #2a2a2a;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.subject-card:hover {
  transform: translateY(-3px);
  background: #333;
}

.subject-card.selected {
  background: #333;
}

.subject-name {
  font-size: 1em;
  font-weight: 600;
  color: #e0e0e0;
}

/* 计时器显示 */
.timer-display {
  display: flex;
  justify-content: center;
  margin: 40px 0;
}

.progress-ring {
  width: 280px;
  height: 280px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 0 40px rgba(64, 158, 255, 0.2);
}

.timer-inner {
  width: 240px;
  height: 240px;
  background: #1a1a1a;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.time-text {
  font-size: 4em;
  font-weight: 700;
  color: #fff;
  font-family: 'Courier New', monospace;
}

.status-text {
  font-size: 1.1em;
  color: #999;
}

.subject-badge {
  background: #2a2a2a;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.9em;
  color: #409EFF;
  margin-top: 10px;
}

/* 控制按钮 */
.controls {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 15px 30px;
  border: none;
  border-radius: 12px;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-start {
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
  color: white;
}

.btn-start:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.4);
}

.btn-pause {
  background: #2a2a2a;
  color: #e0e0e0;
  border: 1px solid #409EFF;
}

.btn-pause:hover {
  background: #333;
}

.btn-interrupt {
  background: #2a2a2a;
  color: #e0e0e0;
  border: 1px solid #F56C6C;
}

.btn-interrupt:hover {
  background: #333;
}

/* 今日数据概览 */
.daily-overview {
  background: #1a1a1a;
  border-radius: 20px;
  padding: 30px;
  border: 1px solid #2a2a2a;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.3em;
  color: #e0e0e0;
  margin-bottom: 25px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.overview-card {
  background: #2a2a2a;
  border-radius: 15px;
  padding: 25px;
  transition: all 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.card-icon {
  font-size: 1.5em;
}

.card-title {
  font-size: 1em;
  color: #999;
}

.big-number {
  font-size: 2.5em;
  font-weight: 700;
  color: #409EFF;
  margin-bottom: 5px;
}

.trend-text {
  font-size: 0.9em;
  color: #666;
}

.warning-card .big-number {
  color: #E6A23C;
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: #1a1a1a;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 90%;
  border: 1px solid #2a2a2a;
}

.modal-title {
  font-size: 1.8em;
  color: #e0e0e0;
  margin-bottom: 10px;
  text-align: center;
}

.modal-subtitle {
  font-size: 1em;
  color: #999;
  text-align: center;
  margin-bottom: 30px;
}

.distraction-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.distraction-card {
  background: #2a2a2a;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.distraction-card:hover {
  background: #333;
  transform: translateY(-2px);
}

.distraction-card.selected {
  border-color: #E6A23C;
  background: #333;
}

.distraction-icon {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.distraction-name {
  font-size: 1em;
  color: #e0e0e0;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn-cancel {
  background: #2a2a2a;
  color: #999;
}

.btn-cancel:hover {
  background: #333;
}

.btn-confirm {
  background: linear-gradient(135deg, #E6A23C 0%, #f0c78a 100%);
  color: #1a1a1a;
}

.btn-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(230, 162, 60, 0.4);
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-bar {
    grid-template-columns: repeat(2, 1fr);
  }

  .subject-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .progress-ring {
    width: 240px;
    height: 240px;
  }

  .timer-inner {
    width: 200px;
    height: 200px;
  }

  .time-text {
    font-size: 3em;
  }

  .overview-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .distraction-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-bar {
    grid-template-columns: 1fr;
  }

  .subject-grid {
    grid-template-columns: 1fr;
  }

  .overview-grid {
    grid-template-columns: 1fr;
  }

  .controls {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
