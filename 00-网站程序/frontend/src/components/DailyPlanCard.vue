<script setup lang="ts">
import { ref, computed } from 'vue'

interface PlanItem {
  time: string
  activity: string
}

const props = defineProps({
  date: {
    type: String,
    required: true,
    default: ''
  },
  planItems: {
    type: Array as () => PlanItem[],
    required: false,
    default: () => []
  },
  showDateSelector: {
    type: Boolean,
    default: true
  }
})

const selectedDate = ref(props.date)
const isDatePickerOpen = ref(false)

const formattedDate = computed(() => {
  if (!props.date) {
    return {
      dateText: '请选择日期',
      weekdayTop: '',
      weekdayBottom: ''
    }
  }
  
  const date = new Date(props.date)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const weekday = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
  
  return {
    dateText: `${year}年${month}月${day}日`,
    weekdayTop: '星',
    weekdayBottom: `期${weekday}`
  }
})

const formatDateDisplay = (dateStr: string) => {
  const date = new Date(dateStr)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const weekday = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
  return `${month}/${day} 星期${weekday}`
}

const openDatePicker = () => {
  isDatePickerOpen.value = true
}

const closeDatePicker = () => {
  isDatePickerOpen.value = false
}

const selectDate = (dateStr: string) => {
  selectedDate.value = dateStr
  closeDatePicker()
}

const generateDateRange = () => {
  const dates = []
  const today = new Date()
  
  for (let i = -3; i <= 3; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    dates.push(`${year}-${month}-${day}`)
  }
  
  return dates
}

const dateRange = generateDateRange()

const getTimeColor = (time: string) => {
  const hour = parseInt(time.split(':')[0])
  if (hour >= 6 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 22) return 'evening'
  return 'night'
}
</script>

<template>
  <div class="daily-plan-card">
    <!-- 卡片头部 -->
    <div class="card-header">
      <div class="header-content">
        <h2 class="card-title">
          <span>学习</span>
          <span>计划</span>
        </h2>
        <div v-if="showDateSelector" class="date-selector">
          <button 
            class="date-btn"
            @click="openDatePicker"
          >
            <span class="date-text">{{ formattedDate.dateText }}</span>
            <div class="weekday-text">
              <span class="weekday-top">{{ formattedDate.weekdayTop }}</span>
              <span class="weekday-bottom">{{ formattedDate.weekdayBottom }}</span>
            </div>
            <span class="arrow-icon">▼</span>
          </button>
          
          <!-- 日期选择器下拉菜单 -->
          <div 
            v-if="isDatePickerOpen" 
            class="date-dropdown"
          >
            <div class="date-options">
              <button 
                v-for="date in dateRange"
                :key="date"
                class="date-option"
                :class="{ 'active': selectedDate === date }"
                @click="selectDate(date)"
              >
                {{ formatDateDisplay(date) }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 计划内容 -->
    <div class="plan-content">
      <div 
        v-if="planItems && planItems.length > 0"
        class="plan-items"
      >
        <div 
          v-for="(item, index) in planItems"
          :key="index"
          class="plan-item"
          :class="`time-${getTimeColor(item.time)}`"
        >
          <div class="time-badge">
            {{ item.time }}
          </div>
          <div class="activity-content">
            {{ item.activity }}
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">📝</div>
        <p class="empty-text">暂无今日学习计划</p>
        <p class="empty-subtext">请添加您的学习安排</p>
      </div>
    </div>

    <!-- 底部操作 -->
    <div class="card-footer">
      <button class="add-plan-btn">
        <span>+</span> 添加计划
      </button>
      <button class="edit-plan-btn">
        编辑计划
      </button>
    </div>
  </div>
</template>

<style scoped>
.daily-plan-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.daily-plan-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 25px 30px;
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  color: white;
  position: relative;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.card-title {
  font-size: 1.4em;
  font-weight: 700;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  color: white;
  line-height: 1.1;
  min-width: 60px;
  
  span {
    display: block;
  }
}

.date-selector {
  position: relative;
}

.date-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 12px;
  padding: 8px 16px;
  color: white;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
}

.date-text {
  white-space: nowrap;
}

.weekday-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.1;
}

.weekday-top,
.weekday-bottom {
  display: block;
  text-align: center;
}

.date-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.arrow-icon {
  font-size: 0.8em;
  opacity: 0.8;
}

.date-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  margin-top: 8px;
  z-index: 1000;
  overflow: hidden;
}

.date-options {
  padding: 12px 0;
}

.date-option {
  width: 100%;
  padding: 12px 20px;
  text-align: left;
  background: transparent;
  border: none;
  font-size: 1em;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-option:hover {
  background: #f8f9fa;
}

.date-option.active {
  background: #eef3fa;
  color: #16345c;
  font-weight: 600;
}

.plan-content {
  padding: 25px 30px;
  max-height: none;
  overflow-y: visible;
}

/* 自定义滚动条样式 */
.plan-content::-webkit-scrollbar {
  width: 6px;
}

.plan-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.plan-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.plan-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.plan-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.plan-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 12px;
  border-radius: 12px;
  background: #f8f9fa;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.plan-item:hover {
  background: #f0f9ff;
  transform: translateX(5px);
}

.time-morning .time-badge {
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  color: white;
}

.time-afternoon .time-badge {
  background: linear-gradient(135deg, #FF9800 0%, #FF5722 100%);
  color: white;
}

.time-evening .time-badge {
  background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
  color: white;
}

.time-night .time-badge {
  background: linear-gradient(135deg, #607D8B 0%, #455A64 100%);
  color: white;
}

.time-badge {
  min-width: 50px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9em;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
  font-size: 0.95em;
  line-height: 1.4;
  word-break: break-word;
}

.card-footer {
  padding: 20px 30px;
  display: flex;
  gap: 15px;
  border-top: 1px solid #eee;
}

.add-plan-btn,
.edit-plan-btn {
  flex: 1;
  padding: 14px 0;
  border-radius: 12px;
  border: none;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.add-plan-btn {
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  color: white;
}

.edit-plan-btn {
  background: linear-gradient(135deg, #16345c 0%, #2a5290 100%);
  color: white;
}

.add-plan-btn:hover,
.edit-plan-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.add-plan-btn span {
  font-size: 1.2em;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 3em;
  margin-bottom: 15px;
  opacity: 0.6;
}

.empty-text {
  font-size: 1.2em;
  color: #666;
  margin: 0 0 8px 0;
}

.empty-subtext {
  font-size: 0.9em;
  color: #999;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-header {
    padding: 18px 16px;
  }

  .header-content {
    gap: 12px;
    flex-wrap: wrap;
  }

  .card-title {
    font-size: 1.15em;
    min-width: 0;
  }

  .date-btn {
    padding: 6px 12px;
    font-size: 0.9em;
  }

  .card-footer {
    padding: 16px;
  }
}
</style>