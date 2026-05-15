<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PomodoroTimer from '@/components/PomodoroTimer.vue'
import DistractionControl from '@/components/DistractionControl.vue'
import { useAttentionStore } from '@/stores/attention'

const activeTab = ref('timer')
const attentionStore = useAttentionStore()

onMounted(() => {
  console.log('AttentionView mounted, timerState:', attentionStore.timerState)
  console.log('Current session:', attentionStore.currentSession)
})
</script>

<template>
  <div class="attention-container">
    <div class="page-header">
      <h1 class="page-title">注意力管理中心</h1>
      <p class="page-subtitle">战胜短视频诱惑，提升专注力</p>
    </div>

    <div class="tab-navigation">
      <el-tabs v-model="activeTab" class="attention-tabs">
        <el-tab-pane label="专注计时器" name="timer">
          <PomodoroTimer />
        </el-tab-pane>
        
        <el-tab-pane label="诱惑对抗" name="distraction">
          <DistractionControl />
        </el-tab-pane>
        
        <el-tab-pane label="锁机模式" name="lock">
          <div class="lock-mode-content">
            <div class="lock-illustration">
              <el-icon size="80" color="#FF6B6B"><Lock /></el-icon>
            </div>
            <h3>🔒 锁机模式</h3>
            <p>防止学习时被其他应用干扰</p>
            <div class="lock-features">
              <div class="feature-card">
                <el-icon size="24" color="#4CAF50"><Check /></el-icon>
                <span>仅允许学习相关应用</span>
              </div>
              <div class="feature-card">
                <el-icon size="24" color="#4CAF50"><VolumeOff /></el-icon>
                <span>屏蔽通知和消息</span>
              </div>
              <div class="feature-card">
                <el-icon size="24" color="#4CAF50"><Timer /></el-icon>
                <span>定时自动解锁</span>
              </div>
            </div>
            <el-button type="primary" size="large" disabled>
              锁机模式开发中...
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
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

.attention-tabs :deep(.el-tabs__header) {
  margin-bottom: 30px;
}

.attention-tabs :deep(.el-tabs__nav-wrap)::after {
  display: none;
}

.attention-tabs :deep(.el-tabs__item) {
  font-size: 1.2em;
  font-weight: 500;
  padding: 0 30px;
  height: 60px;
  line-height: 60px;
  color: #666666;
}

.attention-tabs :deep(.el-tabs__item.is-active) {
  color: #FF6B6B;
  font-weight: 600;
}

.attention-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, #FF6B6B 0%, #4CAF50 100%);
  height: 4px;
  border-radius: 2px;
}

.lock-mode-content {
  text-align: center;
  padding: 50px 20px;
  color: #666666;
}

.lock-illustration {
  margin-bottom: 30px;
}

.lock-mode-content h3 {
  font-size: 2em;
  color: #333333;
  margin-bottom: 15px;
}

.lock-mode-content p {
  font-size: 1.2em;
  margin-bottom: 40px;
  color: #666666;
}

.lock-features {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.feature-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 25px;
  background: #f8f9fa;
  border-radius: 12px;
  font-size: 1.1em;
  font-weight: 500;
  min-width: 200px;
  justify-content: center;
}

.feature-card span {
  color: #333333;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .attention-container {
    padding: 15px;
  }
  
  .page-title {
    font-size: 2.2em;
  }
  
  .page-subtitle {
    font-size: 1.1em;
  }
  
  .tab-navigation {
    padding: 20px;
  }
  
  .lock-features {
    flex-direction: column;
    gap: 15px;
  }
  
  .feature-card {
    min-width: auto;
    width: 100%;
  }
  
  .attention-tabs :deep(.el-tabs__item) {
    padding: 0 15px;
    font-size: 1em;
  }
}
</style>