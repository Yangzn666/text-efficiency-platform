<script setup lang="ts">
import { ref, onMounted } from 'vue'

const activeTab = ref('timer')
const timeLeft = ref(25 * 60) // 25分钟
const isRunning = ref(false)
const timerInterval = ref<NodeJS.Timeout | null>(null)
const distractionCount = ref(0)
const focusTime = ref(0)
const selectedSubject = ref('408计算机科学综合')

const subjects = [
  '408计算机科学综合',
  '数学一', 
  '英语一',
  '政治'
]

function switchTab(tabName: string) {
  activeTab.value = tabName
}

function startTimer() {
  if (isRunning.value) return
  
  isRunning.value = true
  timerInterval.value = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      completeTimer()
    }
  }, 1000)
}

function pauseTimer() {
  if (!isRunning.value) return
  
  isRunning.value = false
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

function completeTimer() {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
  
  isRunning.value = false
  alert('专注时间完成！休息5分钟吧！')
  timeLeft.value = 25 * 60
  focusTime.value += 25
}

function recordDistraction(type: string) {
  distractionCount.value++
  alert(`诱惑记录成功！请先完成一个5分钟的小任务：背5个英语单词`)
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

onMounted(() => {
  console.log('注意力管理组件已加载')
})
</script>

<template>
  <div class="attention-container">
    <div class="page-header">
      <h1 class="page-title">注意力管理中心</h1>
      <p class="page-subtitle">战胜短视频诱惑，提升专注力</p>
    </div>
    
    <div class="tab-navigation">
      <div class="tabs">
        <div 
          class="tab" 
          :class="{ active: activeTab === 'timer' }"
          @click="switchTab('timer')"
        >
          专注计时器
        </div>
        <div 
          class="tab" 
          :class="{ active: activeTab === 'distraction' }"
          @click="switchTab('distraction')"
        >
          诱惑对抗
        </div>
        <div 
          class="tab" 
          :class="{ active: activeTab === 'lock' }"
          @click="switchTab('lock')"
        >
          锁机模式
        </div>
      </div>
      
      <!-- 专注计时器内容 -->
      <div v-show="activeTab === 'timer'" class="tab-content">
        <div class="content-box">
          <h3>🍅 番茄钟专注计时器</h3>
          <div class="timer-display">{{ formatTime(timeLeft) }}</div>
          <p>选择学习科目开始专注</p>
          
          <el-select 
            v-model="selectedSubject" 
            placeholder="选择学习科目"
            size="large"
            style="margin: 15px; width: 250px;"
          >
            <el-option
              v-for="subject in subjects"
              :key="subject"
              :label="subject"
              :value="subject"
            />
          </el-select>
          
          <br>
          <el-button 
            v-if="!isRunning"
            type="primary" 
            size="large"
            @click="startTimer"
          >
            开始专注
          </el-button>
          
          <el-button 
            v-else
            type="warning" 
            size="large"
            @click="pauseTimer"
          >
            暂停
          </el-button>
        </div>
      </div>
      
      <!-- 诱惑对抗内容 -->
      <div v-show="activeTab === 'distraction'" class="tab-content">
        <div class="content-box">
          <h3>🛡️ 诱惑对抗系统</h3>
          <p>每当想要刷短视频时，先完成一个小任务</p>
          
          <div class="distraction-buttons">
            <el-button 
              type="warning" 
              size="large"
              @click="recordDistraction('短视频')"
            >
              短视频平台
            </el-button>
            <el-button 
              type="warning" 
              size="large"
              @click="recordDistraction('社交媒体')"
            >
              微信/QQ
            </el-button>
            <el-button 
              type="warning" 
              size="large"
              @click="recordDistraction('游戏')"
            >
              手机游戏
            </el-button>
            <el-button 
              type="warning" 
              size="large"
              @click="recordDistraction('购物')"
            >
              网购诱惑
            </el-button>
          </div>
          
          <div class="stats-box">
            <h4>今日统计</h4>
            <p>诱惑次数：<span class="highlight">{{ distractionCount }}</span></p>
            <p>专注时间：<span class="highlight">{{ focusTime }}</span>分钟</p>
          </div>
        </div>
      </div>
      
      <!-- 锁机模式内容 -->
      <div v-show="activeTab === 'lock'" class="tab-content">
        <div class="content-box">
          <h3>🔒 锁机模式</h3>
          <p>防止学习时被其他应用干扰</p>
          
          <div class="lock-features">
            <div class="feature-card">
              <span class="check">✓</span> 仅允许学习相关应用
            </div>
            <div class="feature-card">
              <span class="check">✓</span> 屏蔽通知和消息
            </div>
            <div class="feature-card">
              <span class="check">✓</span> 定时自动解锁
            </div>
          </div>
          
          <el-button type="primary" size="large" disabled>
            锁机模式开发中...
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.attention-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px 0;
}

.page-title {
  font-size: 2.8em;
  color: white;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  font-weight: 700;
}

.page-subtitle {
  font-size: 1.3em;
  color: rgba(255, 255, 255, 0.9);
  opacity: 0.9;
  font-weight: 400;
}

.tab-navigation {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
}

.tabs {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  border-bottom: 2px solid #eee;
}

.tab {
  padding: 15px 25px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: 500;
  color: #666;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
}

.tab:hover {
  color: #FF6B6B;
}

.tab.active {
  color: #FF6B6B;
  border-bottom-color: #FF6B6B;
}

.tab-content {
  padding: 20px 0;
}

.content-box {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 40px;
  margin-bottom: 20px;
  text-align: center;
}

.content-box h3 {
  color: #333;
  font-size: 2em;
  margin-bottom: 20px;
}

.timer-display {
  font-size: 4em;
  font-weight: 700;
  color: #FF6B6B;
  font-family: 'Courier New', monospace;
  margin: 20px 0;
}

.distraction-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  margin: 30px 0;
}

.stats-box {
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
}

.stats-box h4 {
  margin-top: 0;
  color: #333;
}

.highlight {
  font-weight: 600;
  color: #FF6B6B;
}

.lock-features {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 30px 0;
  flex-wrap: wrap;
}

.feature-card {
  background: #e8f5e8;
  padding: 15px;
  border-radius: 10px;
  min-width: 150px;
  color: #4CAF50;
  font-weight: 500;
}

.check {
  color: #4CAF50;
  margin-right: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .attention-container {
    padding: 12px;
  }
  
  .page-title {
    font-size: 1.8em;
  }
  
  .page-subtitle {
    font-size: 1em;
  }
  
  .tab-navigation {
    padding: 15px;
  }
  
  .tabs {
    flex-direction: column;
    gap: 5px;
  }
  
  .tab {
    text-align: center;
  }
  
  .distraction-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .lock-features {
    flex-direction: column;
    align-items: center;
  }
  
  .feature-card {
    width: 100%;
    max-width: 250px;
  }
  
  .timer-display {
    font-size: 2.5em;
  }
}
</style>