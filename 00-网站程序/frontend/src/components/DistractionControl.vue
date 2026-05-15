<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAttentionStore } from '@/stores/attention'
import { ElMessage } from 'element-plus'

const attentionStore = useAttentionStore()

const isRecording = ref(false)
const triggerType = ref('')
const alternativeTask = ref('')

const triggerTypes = [
  { value: '短视频', label: '短视频平台' },
  { value: '社交媒体', label: '微信/QQ等社交软件' },
  { value: '游戏', label: '手机游戏' },
  { value: '购物', label: '网购/购物网站' },
  { value: '新闻', label: '新闻资讯' },
  { value: '其他', label: '其他诱惑源' }
]

const alternativeTasks = [
  '背5个英语单词',
  '做1道数学选择题',
  '看1页专业课笔记',
  '整理今日学习要点',
  '预习明天的内容',
  '复习昨天的知识点'
]

const handleSubmit = async () => {
  if (!triggerType.value || !alternativeTask.value) {
    ElMessage.warning('请选择诱惑类型和替代任务')
    return
  }

  try {
    const record = await attentionStore.recordDistraction(triggerType.value, alternativeTask.value)
    ElMessage.success(`诱惑记录成功！请先完成：${alternativeTask.value}`)
    
    // 重置表单
    triggerType.value = ''
    alternativeTask.value = ''
    isRecording.value = false
  } catch (error) {
    ElMessage.error('记录失败，请重试')
  }
}

const handleQuickRecord = async (trigger: string) => {
  const randomTask = alternativeTasks[Math.floor(Math.random() * alternativeTasks.length)]
  try {
    await attentionStore.recordDistraction(trigger, randomTask)
    ElMessage.success(`诱惑记录成功！请先完成：${randomTask}`)
  } catch (error) {
    ElMessage.error('记录失败，请重试')
  }
}
</script>

<template>
  <div class="distraction-modal">
    <div class="modal-header">
      <h3>🚫 诱惑对抗系统</h3>
      <p>每当想要刷短视频时，先完成一个小任务</p>
    </div>

    <div class="quick-actions">
      <h4>快速记录</h4>
      <div class="trigger-buttons">
        <el-button 
          v-for="trigger in triggerTypes.slice(0, 4)"
          :key="trigger.value"
          type="warning"
          size="small"
          @click="handleQuickRecord(trigger.value)"
        >
          {{ trigger.label }}
        </el-button>
      </div>
    </div>

    <div class="detailed-record">
      <h4>详细记录</h4>
      <el-form v-if="!isRecording" label-position="top">
        <el-form-item label="诱惑类型">
          <el-select 
            v-model="triggerType" 
            placeholder="选择诱惑来源"
            style="width: 100%"
          >
            <el-option
              v-for="option in triggerTypes"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="替代任务">
          <el-select 
            v-model="alternativeTask" 
            placeholder="选择要完成的小任务"
            style="width: 100%"
          >
            <el-option
              v-for="task in alternativeTasks"
              :key="task"
              :label="task"
              :value="task"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            @click="isRecording = true"
            style="width: 100%"
          >
            开始记录诱惑时刻
          </el-button>
        </el-form-item>
      </el-form>

      <div v-else class="recording-view">
        <div class="countdown">
          <div class="countdown-number">5</div>
          <p>秒后开始记录...</p>
        </div>
        
        <div class="confirmation">
          <p>诱惑类型：{{ triggerType }}</p>
          <p>替代任务：{{ alternativeTask }}</p>
          
          <div class="action-buttons">
            <el-button type="success" @click="handleSubmit">
              确认记录
            </el-button>
            <el-button @click="isRecording = false">
              重新选择
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="statistics">
      <h4>诱惑对抗统计</h4>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ attentionStore.distractionCountToday }}</div>
          <div class="stat-label">今日诱惑次数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">0</div>
          <div class="stat-label">成功对抗次数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">0%</div>
          <div class="stat-label">对抗成功率</div>
        </div>
      </div>
    </div>

    <div class="tips">
      <h4>💡 对抗小贴士</h4>
      <ul>
        <li>每次想刷短视频前，强制自己先完成一个5分钟的小任务</li>
        <li>从小任务开始，逐步延长专注时间</li>
        <li>记录诱惑触发点，分析自己的薄弱环节</li>
        <li>设置奖励机制，完成替代任务后给自己小奖励</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.distraction-modal {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
  max-width: 600px;
  margin: 0 auto;
}

.modal-header {
  text-align: center;
  margin-bottom: 30px;
}

.modal-header h3 {
  color: #FF6B6B;
  font-size: 1.8em;
  margin-bottom: 10px;
}

.modal-header p {
  color: #666666;
  font-size: 1.1em;
}

.quick-actions {
  margin-bottom: 30px;
}

.quick-actions h4 {
  color: #333333;
  margin-bottom: 15px;
  font-size: 1.3em;
}

.trigger-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.detailed-record {
  margin-bottom: 30px;
}

.detailed-record h4 {
  color: #333333;
  margin-bottom: 20px;
  font-size: 1.3em;
}

.recording-view {
  text-align: center;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 15px;
}

.countdown-number {
  font-size: 4em;
  font-weight: 700;
  color: #FF6B6B;
  margin-bottom: 10px;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.confirmation p {
  font-size: 1.2em;
  margin: 15px 0;
  color: #333333;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 25px;
}

.statistics {
  margin-bottom: 30px;
}

.statistics h4 {
  color: #333333;
  margin-bottom: 20px;
  font-size: 1.3em;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.stat-card {
  background: linear-gradient(135deg, #FF6B6B 0%, #4CAF50 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}

.stat-value {
  font-size: 2em;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.9em;
  opacity: 0.9;
}

.tips {
  background: #fff8e1;
  border-left: 4px solid #FFD700;
  padding: 20px;
  border-radius: 8px;
}

.tips h4 {
  color: #333333;
  margin-bottom: 15px;
  font-size: 1.3em;
}

.tips ul {
  padding-left: 20px;
  color: #666666;
  line-height: 1.8;
}

.tips li {
  margin-bottom: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .distraction-modal {
    padding: 20px;
    margin: 10px;
  }
  
  .trigger-buttons {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .countdown-number {
    font-size: 3em;
  }
}
</style>