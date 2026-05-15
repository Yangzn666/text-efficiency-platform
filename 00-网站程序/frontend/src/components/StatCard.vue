<script setup lang="ts">
import { ref, computed } from 'vue'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: number
  color?: 'primary' | 'success' | 'warning' | 'danger'
}

const props = withDefaults(defineProps<StatCardProps>(), {
  color: 'primary'
})

const colorMap = {
  primary: '#FF6B6B',
  success: '#4CAF50',
  warning: '#FFD700',
  danger: '#FF4757'
}

const trendIcon = computed(() => {
  switch (props.trend) {
    case 'up': return 'ArrowUp'
    case 'down': return 'ArrowDown'
    case 'stable': return 'Minus'
    default: return ''
  }
})

const trendColor = computed(() => {
  switch (props.trend) {
    case 'up': return '#4CAF50'
    case 'down': return '#FF4757'
    case 'stable': return '#666666'
    default: return '#666666'
  }
})
</script>

<template>
  <div class="stat-card" :class="[`stat-card--${color}`]">
    <div class="stat-card__content">
      <!-- 图标区域 -->
      <div v-if="icon" class="stat-card__icon">
        <el-icon :size="24" :color="colorMap[color]">
          <component :is="icon" />
        </el-icon>
      </div>
      
      <!-- 主要内容 -->
      <div class="stat-card__main">
        <div class="stat-card__value">{{ value }}</div>
        <div class="stat-card__title">{{ title }}</div>
        <div v-if="subtitle" class="stat-card__subtitle">{{ subtitle }}</div>
      </div>
      
      <!-- 趋势指示器 -->
      <div v-if="trend" class="stat-card__trend">
        <el-icon :size="16" :color="trendColor">
          <component :is="trendIcon" />
        </el-icon>
        <span :style="{ color: trendColor }">
          {{ trendValue }}{{ trend === 'stable' ? '' : '%' }}
        </span>
      </div>
    </div>
    
    <!-- 进度条 -->
    <div v-if="typeof value === 'number'" class="stat-card__progress">
      <div 
        class="stat-card__progress-bar"
        :style="{ 
          width: `${Math.min(value, 100)}%`,
          backgroundColor: colorMap[color]
        }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.stat-card__content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.stat-card__icon {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: rgba(255, 107, 107, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card__main {
  flex: 1;
  min-width: 0;
}

.stat-card__value {
  font-size: 2.2em;
  font-weight: 700;
  color: #333333;
  margin-bottom: 4px;
  line-height: 1.2;
}

.stat-card__title {
  font-size: 1.1em;
  color: #666666;
  font-weight: 500;
  margin-bottom: 4px;
}

.stat-card__subtitle {
  font-size: 0.9em;
  color: #999999;
}

.stat-card__trend {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9em;
  font-weight: 500;
  flex-shrink: 0;
}

.stat-card__progress {
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.stat-card__progress-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
  position: relative;
}

.stat-card__progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: progress-shine 2s infinite;
}

@keyframes progress-shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* 颜色变体 */
.stat-card--success .stat-card__icon {
  background: rgba(76, 175, 80, 0.1);
}

.stat-card--warning .stat-card__icon {
  background: rgba(255, 215, 0, 0.1);
}

.stat-card--danger .stat-card__icon {
  background: rgba(255, 71, 87, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stat-card {
    padding: 20px;
  }
  
  .stat-card__content {
    gap: 12px;
  }
  
  .stat-card__icon {
    width: 40px;
    height: 40px;
  }
  
  .stat-card__value {
    font-size: 1.8em;
  }
  
  .stat-card__title {
    font-size: 1em;
  }
}
</style>