<script setup lang="ts">
import { ref, computed } from 'vue'

interface SubjectProgressProps {
  subject: string
  progress: number
  timeSpent: number
  goalTime: number
  color?: string
}

const props = withDefaults(defineProps<SubjectProgressProps>(), {
  color: '#FF6B6B'
})

const progressPercentage = computed(() => {
  return Math.min(100, Math.round((props.timeSpent / props.goalTime) * 100))
})

const remainingTime = computed(() => {
  return Math.max(0, props.goalTime - props.timeSpent)
})

const getStatusText = computed(() => {
  if (progressPercentage.value >= 100) {
    return '已完成'
  } else if (progressPercentage.value >= 80) {
    return '接近完成'
  } else if (progressPercentage.value >= 50) {
    return '进行中'
  } else {
    return '刚开始'
  }
})

const getStatusColor = computed(() => {
  if (progressPercentage.value >= 100) {
    return '#4CAF50'
  } else if (progressPercentage.value >= 80) {
    return '#FFD700'
  } else if (progressPercentage.value >= 50) {
    return '#FF9F43'
  } else {
    return '#FF6B6B'
  }
})
</script>

<template>
  <div class="subject-progress">
    <!-- 标题栏 -->
    <div class="subject-header">
      <div class="subject-info">
        <h3 class="subject-name">{{ subject }}</h3>
        <span 
          class="status-tag" 
          :style="{ backgroundColor: getStatusColor }"
        >
          {{ getStatusText }}
        </span>
      </div>
      <div class="subject-stats">
        <span class="time-spent">{{ timeSpent }}分钟</span>
        <span class="time-goal">/ {{ goalTime }}分钟</span>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="progress-container">
      <div 
        class="progress-bar"
        :style="{ 
          width: `${progressPercentage}%`,
          backgroundColor: color 
        }"
      >
        <div class="progress-text">{{ progressPercentage }}%</div>
      </div>
    </div>

    <!-- 详细信息 -->
    <div class="progress-details">
      <div class="detail-item">
        <el-icon color="#4CAF50" size="16"><Clock /></el-icon>
        <span>今日学习: {{ timeSpent }}分钟</span>
      </div>
      <div class="detail-item">
        <el-icon color="#FF6B6B" size="16"><Timer /></el-icon>
        <span>还需: {{ remainingTime }}分钟</span>
      </div>
      <div class="detail-item">
        <el-icon color="#FFD700" size="16"><Target /></el-icon>
        <span>周目标: {{ goalTime }}分钟</span>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="progress-actions">
      <el-button 
        type="primary" 
        size="small"
        :style="{ backgroundColor: color, borderColor: color }"
      >
        <el-icon><EditPen /></el-icon>
        记录学习
      </el-button>
      <el-button size="small">
        <el-icon><DataAnalysis /></el-icon>
        查看详情
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.subject-progress {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.subject-progress:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.subject-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.subject-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.subject-name {
  font-size: 1.4em;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.status-tag {
  padding: 4px 12px;
  border-radius: 20px;
  color: white;
  font-size: 0.85em;
  font-weight: 500;
}

.subject-stats {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-size: 1.1em;
  font-weight: 500;
}

.time-spent {
  color: #FF6B6B;
  font-weight: 600;
}

.time-goal {
  color: #999999;
}

.progress-container {
  height: 12px;
  background: #f0f0f0;
  border-radius: 6px;
  margin-bottom: 20px;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  height: 100%;
  border-radius: 6px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px;
}

.progress-text {
  color: white;
  font-size: 0.8em;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

.progress-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95em;
  color: #666666;
}

.progress-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.progress-actions .el-button {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.progress-actions .el-button:first-child {
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.progress-actions .el-button:first-child:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .subject-progress {
    padding: 20px;
  }
  
  .subject-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .subject-stats {
    font-size: 1em;
  }
  
  .progress-details {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .progress-actions {
    width: 100%;
  }
  
  .progress-actions .el-button {
    flex: 1;
  }
}
</style>