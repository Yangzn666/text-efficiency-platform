<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('timer')
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
          <div class="timer-content">
            <h3>🍅 番茄钟专注计时器</h3>
            <p>专注时间：25:00</p>
            <el-button type="primary">开始专注</el-button>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="诱惑对抗" name="distraction">
          <div class="distraction-content">
            <h3>🛡️ 诱惑对抗系统</h3>
            <p>记录和对抗学习诱惑</p>
            <el-button type="warning">记录诱惑</el-button>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="锁机模式" name="lock">
          <div class="lock-content">
            <h3>🔒 锁机模式</h3>
            <p>防止学习时被其他应用干扰</p>
            <el-button disabled>开发中...</el-button>
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

.timer-content, .distraction-content, .lock-content {
  text-align: center;
  padding: 50px 20px;
  color: #666666;
}

.timer-content h3, .distraction-content h3, .lock-content h3 {
  font-size: 2em;
  color: #333333;
  margin-bottom: 20px;
}
</style>