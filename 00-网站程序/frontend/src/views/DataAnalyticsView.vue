<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStudyStore } from '@/stores/study'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import StudyStats from '@/components/StudyStats.vue'

const studyStore = useStudyStore()
const userStore = useUserStore()

// 数据状态
const activeTab = ref('overview')
const timeRange = ref('week')
const isLoading = ref(false)

// 计算属性
const studyStats = computed(() => {
  // 根据时间范围返回相应的统计数据
  switch(timeRange.value) {
    case 'day':
      return {
        currentTime: studyStore.todayStudyTime,
        currentLabel: '今日学习时长',
        comparisonValue: studyStore.weeklyStudyTime,
        comparisonLabel: '本周总计',
        currentStreak: studyStore.currentStreak,
        totalStudyDays: studyStore.totalStudyDays
      }
    case 'week':
      return {
        currentTime: studyStore.weeklyStudyTime,
        currentLabel: '本周学习时长',
        comparisonValue: studyStore.monthlyStudyTime,
        comparisonLabel: '本月总计',
        currentStreak: studyStore.currentStreak,
        totalStudyDays: studyStore.totalStudyDays
      }
    case 'month':
      return {
        currentTime: studyStore.monthlyStudyTime,
        currentLabel: '本月学习时长',
        comparisonValue: studyStore.yearlyStudyTime,
        comparisonLabel: '本年总计',
        currentStreak: studyStore.currentStreak,
        totalStudyDays: studyStore.totalStudyDays
      }
    case 'year':
      return {
        currentTime: studyStore.yearlyStudyTime,
        currentLabel: '本年学习时长',
        comparisonValue: studyStore.totalStudyDays * 120, // 估算值
        comparisonLabel: '平均每月',
        currentStreak: studyStore.currentStreak,
        totalStudyDays: studyStore.totalStudyDays
      }
    default:
      return {
        currentTime: studyStore.todayStudyTime,
        currentLabel: '今日学习时长',
        comparisonValue: studyStore.weeklyStudyTime,
        comparisonLabel: '本周总计',
        currentStreak: studyStore.currentStreak,
        totalStudyDays: studyStore.totalStudyDays
      }
  }
})

// 学习效率数据 - 根据时间范围动态生成
const efficiencyData = computed(() => {
  const data = []
  const today = new Date()
  
  switch(timeRange.value) {
    case 'day':
      // 显示今天的小时分布
      for (let hour = 8; hour <= 22; hour += 2) {
        const time = Math.floor(Math.random() * 60 + 30) // 30-90分钟
        const efficiency = Math.floor(Math.random() * 30 + 70) // 70-100%
        data.push({
          date: `${hour}:00`,
          time: time,
          efficiency: efficiency
        })
      }
      break
    
    case 'week':
      // 显示本周每天的数据
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(today.getDate() - i)
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        const time = Math.floor(Math.random() * 120 + 60) // 60-180分钟
        const efficiency = Math.floor(Math.random() * 30 + 70) // 70-100%
        data.push({
          date: weekdays[date.getDay()],
          time: time,
          efficiency: efficiency
        })
      }
      break
    
    case 'month':
      // 显示本月每周的数据
      for (let week = 0; week < 4; week++) {
        const time = Math.floor(Math.random() * 420 + 280) // 280-700分钟
        const efficiency = Math.floor(Math.random() * 25 + 75) // 75-100%
        data.push({
          date: `第${week + 1}周`,
          time: time,
          efficiency: efficiency
        })
      }
      break
    
    case 'year':
      // 显示本年每月的数据
      for (let month = 0; month < 12; month++) {
        const time = Math.floor(Math.random() * 1200 + 600) // 600-1800分钟
        const efficiency = Math.floor(Math.random() * 20 + 80) // 80-100%
        data.push({
          date: `${month + 1}月`,
          time: time,
          efficiency: efficiency
        })
      }
      break
  }
  
  return data
})

// 科目学习分布 - 根据时间范围动态计算
const subjectDistribution = computed(() => {
  const subjectStats = studyStore.subjectStats
  const total = Object.values(subjectStats).reduce((sum, stat: any) => sum + stat.totalTime, 0)
  
  if (total === 0) {
    // 如果没有数据，返回默认分布
    return [
      { subject: '408计算机', time: 320, percentage: 40 },
      { subject: '数学一', time: 240, percentage: 30 },
      { subject: '英语一', time: 160, percentage: 20 },
      { subject: '政治', time: 80, percentage: 10 }
    ]
  }
  
  const distribution = Object.entries(subjectStats).map(([subject, stat]: [string, any]) => ( {
    subject,
    time: stat.totalTime,
    percentage: Math.round((stat.totalTime / total) * 100)
  }))
  
  // 确保百分比总和为100%
  const sumPercentage = distribution.reduce((sum, item) => sum + item.percentage, 0)
  if (sumPercentage !== 100) {
    // 调整最后一个科目的百分比
    const lastItem = distribution[distribution.length - 1]
    lastItem.percentage = 100 - distribution.slice(0, -1).reduce((sum, item) => sum + item.percentage, 0)
  }
  
  // 按时间排序
  return distribution.sort((a, b) => b.time - a.time)
})

// 学习趋势数据
const studyTrends = ref([
  { week: '第1周', totalTime: 840, avgDaily: 120, completionRate: 85 },
  { week: '第2周', totalTime: 980, avgDaily: 140, completionRate: 92 },
  { week: '第3周', totalTime: 750, avgDaily: 107, completionRate: 78 },
  { week: '第4周', totalTime: 1050, avgDaily: 150, completionRate: 95 }
])

// 方法
const refreshData = async () => {
  isLoading.value = true
  try {
    // 模拟数据刷新
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('数据已刷新')
  } catch (error) {
    ElMessage.error('刷新失败，请重试')
  } finally {
    isLoading.value = false
  }
}

const exportData = () => {
  ElMessage.success('数据导出功能开发中...')
}

const clearMockData = async () => {
  try {
    await ElMessageBox.confirm(
      '此操作将清除所有模拟的学习记录和时长数据，从今天开始记录真实的学习数据。代办事项将保持不变。是否继续？',
      '清除模拟数据',
      {
        confirmButtonText: '确定清除',
        cancelButtonText: '取消',
        type: 'warning',
        distinguishCancelAndClose: true
      }
    )
    
    const result = await studyStore.clearMockData()
    if (result.success) {
      ElMessage.success(result.message)
      // 刷新页面以显示更新后的状态
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } else {
      ElMessage.error(result.error || '清除数据失败')
    }
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      ElMessage.error('操作失败')
    }
  }
}

const getTimeRangeText = () => {
  const ranges: Record<string, string> = {
    day: '今日',
    week: '本周',
    month: '本月',
    year: '本年'
  }
  return ranges[timeRange.value] || '本周'
}

const getTimeRangeChartTitle = () => {
  const titles: Record<string, string> = {
    day: '今日学习时段分布',
    week: '本周学习效率趋势',
    month: '本月学习周报',
    year: '年度学习概况'
  }
  return titles[timeRange.value] || '学习效率分析'
}

const getSegmentColor = (index: number) => {
  const colors = ['#4CAF50', '#FF6B6B', '#2196F3', '#FF9800']
  return colors[index % colors.length]
}

// 新增的增强版饼图相关函数
const hoveredSegment = ref<number | null>(null)

const getSegmentStartAngle = (index: number) => {
  let angle = 0
  for (let i = 0; i < index; i++) {
    const prevSubject = subjectDistribution.value[i]
    if (prevSubject) {
      angle += (prevSubject.percentage / 100) * 360
    }
  }
  return angle
}

const getSegmentEndAngle = (index: number) => {
  const subject = subjectDistribution.value[index]
  if (!subject) return 0
  return getSegmentStartAngle(index) + (subject.percentage / 100) * 360
}

const getEnhancedSegmentColor = (index: number) => {
  // 使用更现代化的颜色方案
  const colors = [
    '#FF6B6B', // 红色 - 408计算机
    '#4ECDC4', // 青绿色 - 数学一
    '#45B7D1', // 蓝色 - 英语一
    '#FFA07A', // 浅橙色 - 政治
    '#98D8C8', // 薄荷绿
    '#F7DC6F'  // 黄色
  ]
  return colors[index % colors.length]
}

const getTotalStudyTime = () => {
  return subjectDistribution.value.reduce((sum, subject) => sum + subject.time, 0)
}

const getRotationAngle = (index: number) => {
  let angle = 0
  for (let i = 0; i < index; i++) {
    const prevSubject = subjectDistribution.value[i]
    if (prevSubject) {
      angle += prevSubject.percentage
    }
  }
  return angle
}

const getEfficiencyLevel = (efficiency: number) => {
  if (efficiency >= 90) return { level: '优秀', color: '#4CAF50' }
  if (efficiency >= 80) return { level: '良好', color: '#2196F3' }
  if (efficiency >= 70) return { level: '一般', color: '#FF9800' }
  return { level: '需改进', color: '#FF6B6B' }
}

onMounted(() => {
  // 初始化数据
  studyStore.initializeStudyData()
})
</script>

<template>
  <div class="statistics-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">📊 学习统计数据</h1>
      <p class="page-subtitle">全面了解学习情况，发现提升空间</p>
      
      <!-- 数据状态提示 -->
      <div 
        class="data-status-banner" 
        v-if="studyStore.studyRecords.length === 0"
      >
        <div class="status-content">
          <el-icon class="status-icon"><InfoFilled /></el-icon>
          <div class="status-text">
            <strong>提示：</strong>系统检测到暂无学习记录。从今天开始记录真实的学习时间和进度吧！
          </div>
        </div>
      </div>
      
      <div 
        class="data-status-banner warning" 
        v-else-if="studyStore.studyRecords.length > 0 && studyStore.studyRecords.every(r => new Date(r.createdAt) < new Date('2026-01-01'))"
      >
        <div class="status-content">
          <el-icon class="status-icon"><Warning /></el-icon>
          <div class="status-text">
            <strong>注意：</strong>检测到的历史数据可能是模拟数据。您可以通过设置页面清除模拟数据，从今天开始记录真实的学习情况。
            <router-link to="/settings" class="settings-link">前往设置页面</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 时间范围选择 -->
    <div class="time-range-selector">
      <el-radio-group v-model="timeRange" size="large">
        <el-radio-button label="day">今日</el-radio-button>
        <el-radio-button label="week">本周</el-radio-button>
        <el-radio-button label="month">本月</el-radio-button>
        <el-radio-button label="year">本年</el-radio-button>
      </el-radio-group>
      
      <div class="header-actions">
        <el-button 
          type="primary" 
          :loading="isLoading"
          @click="refreshData"
        >
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
        <el-button @click="exportData">
          <el-icon><Download /></el-icon>
          导出数据
        </el-button>
        <el-button type="danger" @click="clearMockData" v-if="studyStore.studyRecords.length > 0">
          <el-icon><Delete /></el-icon>
          清除模拟数据
        </el-button>
      </div>
    </div>

    <!-- 核心统计数据 -->
    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon success">⏱️</div>
          <h3>{{ studyStats.currentLabel }}</h3>
        </div>
        <div class="stat-content">
          <div class="main-value">{{ studyStore.studyRecords.length > 0 ? studyStats.currentTime : 0 }}</div>
          <div class="sub-value">分钟</div>
          <div class="trend" :class="studyStore.studyRecords.length > 0 ? 'positive' : 'neutral'">
            {{ studyStore.studyRecords.length > 0 ? '对比: ' + studyStats.comparisonValue + '分钟' : '暂无学习记录' }}
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon primary">🔥</div>
          <h3>连续学习天数</h3>
        </div>
        <div class="stat-content">
          <div class="main-value">{{ studyStats.currentStreak }}</div>
          <div class="sub-value">天</div>
          <div class="trend neutral">保持学习习惯</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon warning">📊</div>
          <h3>{{ studyStats.comparisonLabel }}</h3>
        </div>
        <div class="stat-content">
          <div class="main-value">{{ studyStats.comparisonValue }}</div>
          <div class="sub-value">分钟</div>
          <div class="trend positive">{{ timeRange === 'day' ? '+25%' : timeRange === 'week' ? '+15%' : '+8%' }} 目标进度</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon info">🎯</div>
          <h3>总学习天数</h3>
        </div>
        <div class="stat-content">
          <div class="main-value">{{ studyStats.totalStudyDays }}</div>
          <div class="sub-value">天</div>
          <div class="trend positive">学习坚持力强</div>
        </div>
      </div>
    </div>

    <!-- 详细统计内容 -->
    <div class="main-content">
      <el-tabs v-model="activeTab" class="stats-tabs">
        <!-- 学习概览 Tab -->
        <el-tab-pane label="📋 学习概览" name="overview">
          <!-- 全新学习统计模块 -->
          <StudyStats />
          
          <div class="overview-content">
            <div class="charts-row">
              <!-- 学习效率图表 -->
              <div class="chart-container">
                <h3>{{ getTimeRangeChartTitle() }}</h3>
                <div class="efficiency-chart">
                  <div 
                    v-for="(item, index) in efficiencyData" 
                    :key="index"
                    class="chart-bar"
                  >
                    <div 
                      class="bar-fill"
                      :style="{ height: `${item.efficiency}%` }"
                    >
                      <span class="efficiency-value">{{ item.efficiency }}%</span>
                    </div>
                    <div class="bar-label">{{ item.date }}</div>
                    <div class="time-label">{{ item.time }}分钟</div>
                  </div>
                </div>
              </div>

              <!-- 科目分布饼图 -->
              <div class="chart-container enhanced-pie-container">
                <h3 class="chart-title">📚 科目学习分布</h3>
                <div class="enhanced-distribution-chart">
                  <!-- 主饼图区域 -->
                  <div class="enhanced-pie-chart">
                    <div 
                      v-for="(subject, index) in subjectDistribution" 
                      :key="index"
                      class="enhanced-pie-segment"
                      :style="{
                        '--start-angle': `${getSegmentStartAngle(index)}deg`,
                        '--end-angle': `${getSegmentEndAngle(index)}deg`,
                        '--segment-color': getEnhancedSegmentColor(index),
                        '--hover-scale': index === hoveredSegment ? 1.05 : 1
                      }"
                      @mouseenter="hoveredSegment = index"
                      @mouseleave="hoveredSegment = null"
                    >
                      <div 
                        class="segment-fill"
                        :style="{
                          'background': `conic-gradient(from ${getSegmentStartAngle(index)}deg, ${getEnhancedSegmentColor(index)} 0deg, ${getEnhancedSegmentColor(index)} ${(getSegmentEndAngle(index) - getSegmentStartAngle(index))}deg, transparent ${(getSegmentEndAngle(index) - getSegmentStartAngle(index))}deg)`
                        }"
                      ></div>
                    </div>
                    
                    <!-- 中心信息展示区 -->
                    <div class="center-info">
                      <div class="total-time">
                        <div class="time-number">{{ getTotalStudyTime() }}</div>
                        <div class="time-unit">分钟</div>
                      </div>
                      <div class="center-label">总学习时间</div>
                    </div>
                  </div>
                  
                  <!-- 图例说明 -->
                  <div class="legend-container">
                    <div 
                      v-for="(subject, index) in subjectDistribution" 
                      :key="index"
                      class="legend-item"
                      :class="{ 'active': hoveredSegment === index }"
                      @mouseenter="hoveredSegment = index"
                      @mouseleave="hoveredSegment = null"
                    >
                      <div 
                        class="legend-color"
                        :style="{ backgroundColor: getEnhancedSegmentColor(index) }"
                      ></div>
                      <div class="legend-content">
                        <div class="legend-subject">{{ subject.subject }}</div>
                        <div class="legend-details">
                          <span class="legend-time">{{ subject.time }}分钟</span>
                          <span class="legend-percent">{{ subject.percentage }}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 学习趋势 -->
            <div class="trend-section">
              <h3>学习趋势分析</h3>
              <div class="trend-table">
                <div class="table-header">
                  <div class="header-cell">周期</div>
                  <div class="header-cell">总时长(分钟)</div>
                  <div class="header-cell">日均(分钟)</div>
                  <div class="header-cell">完成率</div>
                  <div class="header-cell">趋势</div>
                </div>
                <div 
                  v-for="(trend, index) in studyTrends" 
                  :key="index"
                  class="table-row"
                >
                  <div class="cell">{{ trend.week }}</div>
                  <div class="cell">{{ trend.totalTime }}</div>
                  <div class="cell">{{ trend.avgDaily }}</div>
                  <div class="cell">
                    <el-tag :type="trend.completionRate >= 90 ? 'success' : trend.completionRate >= 80 ? 'warning' : 'danger'">
                      {{ trend.completionRate }}%
                    </el-tag>
                  </div>
                  <div class="cell">
                    <span class="trend-indicator positive" v-if="index > 0 && trend.totalTime > studyTrends[index-1].totalTime">↑</span>
                    <span class="trend-indicator negative" v-else-if="index > 0 && trend.totalTime < studyTrends[index-1].totalTime">↓</span>
                    <span class="trend-indicator neutral" v-else>→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 详细分析 Tab -->
        <el-tab-pane label="🔍 详细分析" name="analysis">
          <div class="analysis-content">
            <div class="analysis-grid">
              <!-- 时间段分析 -->
              <div class="analysis-card">
                <h3>⏰ 学习时间段分析</h3>
                <div class="time-distribution">
                  <div class="time-slot">
                    <div class="slot-label">早晨 (6-9点)</div>
                    <el-progress :percentage="15" :stroke-width="12" color="#4CAF50" />
                    <div class="slot-hours">45分钟</div>
                  </div>
                  <div class="time-slot">
                    <div class="slot-label">上午 (9-12点)</div>
                    <el-progress :percentage="35" :stroke-width="12" color="#2196F3" />
                    <div class="slot-hours">105分钟</div>
                  </div>
                  <div class="time-slot">
                    <div class="slot-label">下午 (12-18点)</div>
                    <el-progress :percentage="25" :stroke-width="12" color="#FF9800" />
                    <div class="slot-hours">75分钟</div>
                  </div>
                  <div class="time-slot">
                    <div class="slot-label">晚上 (18-24点)</div>
                    <el-progress :percentage="25" :stroke-width="12" color="#FF6B6B" />
                    <div class="slot-hours">75分钟</div>
                  </div>
                </div>
              </div>

              <!-- 科目效率对比 -->
              <div class="analysis-card">
                <h3>📚 科目效率对比</h3>
                <div class="subject-efficiency">
                  <div 
                    v-for="(subject, index) in subjectDistribution" 
                    :key="index"
                    class="efficiency-item"
                  >
                    <div class="subject-info">
                      <div class="subject-color" :style="{ backgroundColor: ['#4CAF50', '#FF6B6B', '#2196F3', '#FF9800'][index] }"></div>
                      <span>{{ subject.subject }}</span>
                    </div>
                    <div class="efficiency-score">
                      <el-rate
                        :model-value="Math.floor(subject.percentage / 20)"
                        disabled
                        :colors="['#FF6B6B', '#FF9800', '#4CAF50']"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 学习建议 -->
            <div class="recommendations">
              <h3>💡 个性化学习建议</h3>
              <div class="suggestions-list">
                <div class="suggestion-item">
                  <div class="suggestion-icon">🎯</div>
                  <div class="suggestion-content">
                    <h4>目标设定建议</h4>
                    <p>根据您的学习模式，建议将每日学习时间设定为3-4小时，保持稳定的节奏。</p>
                  </div>
                </div>
                <div class="suggestion-item">
                  <div class="suggestion-icon">⏰</div>
                  <div class="suggestion-content">
                    <h4>时间安排优化</h4>
                    <p>上午9-12点是您的高效学习时段，建议安排难度较大的科目学习。</p>
                  </div>
                </div>
                <div class="suggestion-item">
                  <div class="suggestion-icon">📊</div>
                  <div class="suggestion-content">
                    <h4>科目平衡发展</h4>
                    <p>政治科目学习时间相对较少，建议适当增加投入，保持各科目均衡发展。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 历史记录 Tab -->
        <el-tab-pane label="📜 历史记录" name="history">
          <div class="history-content">
            <div class="history-filters">
              <el-date-picker
                v-model="timeRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="large"
              />
            </div>

            <div class="history-table">
              <div class="table-header">
                <div class="header-cell">日期</div>
                <div class="header-cell">学习时长</div>
                <div class="header-cell">完成章节</div>
                <div class="header-cell">学习科目</div>
                <div class="header-cell">效率评分</div>
              </div>
              <div class="table-body">
                <div 
                  v-for="i in 10" 
                  :key="i"
                  class="table-row"
                >
                  <div class="cell">{{ new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString() }}</div>
                  <div class="cell">{{ Math.floor(Math.random() * 180 + 60) }}分钟</div>
                  <div class="cell">{{ Math.floor(Math.random() * 3 + 1) }}章</div>
                  <div class="cell">{{ ['408计算机', '数学一', '英语一', '政治'][Math.floor(Math.random() * 4)] }}</div>
                  <div class="cell">
                    <el-tag :type="Math.random() > 0.7 ? 'success' : Math.random() > 0.4 ? 'warning' : 'danger'">
                      {{ Math.floor(Math.random() * 30 + 70) }}分
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.statistics-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0px; /* 极致减少数据分析页面页边距至1/4 */
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px 0;
}

.page-title {
  font-size: 2.5em;
  color: white;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  font-weight: 700;
}

.page-subtitle {
  font-size: 1.2em;
  color: rgba(255, 255, 255, 0.9);
  opacity: 0.9;
  font-weight: 400;
}

.time-range-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px 30px;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.header-actions {
  display: flex;
  gap: 15px;
}

/* 数据状态提示样式 */
.data-status-banner {
  margin-top: 20px;
  padding: 15px 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.data-status-banner.warning {
  background: rgba(255, 248, 225, 0.9);
  border-color: #ffd54f;
}

.status-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.status-icon {
  font-size: 20px;
  color: #2196F3;
  flex-shrink: 0;
  margin-top: 2px;
}

.data-status-banner.warning .status-icon {
  color: #FF9800;
}

.status-text {
  flex: 1;
  color: #333;
  line-height: 1.5;
}

.settings-link {
  color: #2196F3;
  text-decoration: none;
  font-weight: 500;
  margin-left: 8px;
}

.settings-link:hover {
  text-decoration: underline;
}

/* 统计概览卡片 */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(0,0,0,0.15);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.stat-icon {
  font-size: 2em;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.success { background: rgba(76, 175, 80, 0.1); color: #4CAF50; }
.stat-icon.primary { background: rgba(255, 107, 107, 0.1); color: #FF6B6B; }
.stat-icon.warning { background: rgba(255, 152, 0, 0.1); color: #FF9800; }
.stat-icon.info { background: rgba(33, 150, 243, 0.1); color: #2196F3; }

.stat-header h3 {
  color: #333333;
  margin: 0;
  font-size: 1.2em;
}

.stat-content {
  text-align: center;
}

.main-value {
  font-size: 2.5em;
  font-weight: 700;
  color: #333333;
  margin-bottom: 5px;
}

.sub-value {
  color: #666666;
  font-size: 1em;
  margin-bottom: 10px;
}

.trend {
  font-size: 0.9em;
  font-weight: 500;
}

.trend.positive { color: #4CAF50; }
.trend.negative { color: #FF6B6B; }
.trend.neutral { color: #FF9800; }

/* 主要内容区域 - 超极致紧凑 */
.main-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  backdrop-filter: blur(5px);
}

.stats-tabs :deep(.el-tabs__header) {
  margin-bottom: 30px;
}

.stats-tabs :deep(.el-tabs__nav-wrap)::after {
  display: none;
}

.stats-tabs :deep(.el-tabs__item) {
  font-size: 1.1em;
  font-weight: 500;
  padding: 0 25px;
  height: 55px;
  line-height: 55px;
  color: #666666;
}

.stats-tabs :deep(.el-tabs__item.is-active) {
  color: #4CAF50;
  font-weight: 600;
}

.stats-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, #FF6B6B 0%, #4CAF50 100%);
  height: 4px;
  border-radius: 2px;
}

/* StudyStats组件在数据分析页面的样式调整 */
.overview-content > .study-stats-container {
  margin-bottom: 30px;
}

/* 图表样式 */
.charts-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

.chart-container {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 25px;
}

.chart-container h3 {
  color: #333333;
  margin-bottom: 20px;
  font-size: 1.3em;
  text-align: center;
}

/* 效率柱状图 */
.efficiency-chart {
  display: flex;
  align-items: end;
  height: 200px;
  gap: 15px;
  padding: 20px 10px;
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(to top, #4CAF50, #81C784);
  border-radius: 8px 8px 0 0;
  position: relative;
  min-height: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 5px;
}

.efficiency-value {
  color: white;
  font-size: 0.8em;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

.bar-label {
  font-weight: 500;
  color: #333333;
  font-size: 0.9em;
}

.time-label {
  color: #666666;
  font-size: 0.8em;
}

/* 增强版分布饼图 */
.enhanced-pie-container {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.chart-title {
  text-align: center;
  color: #333333;
  font-size: 1.5em;
  font-weight: 600;
  margin-bottom: 25px;
  position: relative;
}

.chart-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #FF6B6B, #4ECDC4);
  border-radius: 2px;
}

.enhanced-distribution-chart {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
}

.enhanced-pie-chart {
  position: relative;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #FF6B6B 0deg 90deg,
    #4ECDC4 90deg 180deg,
    #45B7D1 180deg 270deg,
    #FFA07A 270deg 360deg
  );
  box-shadow: 
    0 15px 35px rgba(0, 0, 0, 0.1),
    inset 0 0 20px rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  animation: pieRotate 20s linear infinite;
}

@keyframes pieRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.enhanced-pie-segment {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transform-origin: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.enhanced-pie-segment:hover {
  transform: scale(1.03);
  filter: brightness(1.2) drop-shadow(0 0 15px var(--segment-color));
  z-index: 10;
}

.segment-fill {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.center-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 
    0 5px 15px rgba(0, 0, 0, 0.1),
    inset 0 2px 5px rgba(0, 0, 0, 0.05);
  z-index: 5;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.05); }
  100% { transform: translate(-50%, -50%) scale(1); }
}

.total-time {
  text-align: center;
  margin-bottom: 5px;
}

.time-number {
  font-size: 1.8em;
  font-weight: 700;
  color: #FF6B6B;
  line-height: 1;
  animation: counter 2s ease-out;
}

@keyframes counter {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}

.time-unit {
  font-size: 0.8em;
  color: #666666;
  font-weight: 500;
}

.center-label {
  font-size: 0.85em;
  color: #999999;
  text-align: center;
  font-weight: 500;
}

.legend-container {
  flex: 1;
  min-width: 200px;
  max-width: 300px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  margin-bottom: 10px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.legend-item:hover, .legend-item.active {
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border-color: #FF6B6B;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.legend-content {
  flex: 1;
}

.legend-subject {
  font-weight: 600;
  color: #333333;
  font-size: 1em;
  margin-bottom: 3px;
}

.legend-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.legend-time {
  color: #FF6B6B;
  font-weight: 600;
  font-size: 0.9em;
}

.legend-percent {
  background: linear-gradient(90deg, #FF6B6B, #4ECDC4);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .enhanced-distribution-chart {
    flex-direction: column;
    gap: 25px;
  }
  
  .enhanced-pie-chart {
    width: 200px;
    height: 200px;
  }
  
  .center-info {
    width: 80px;
    height: 80px;
  }
  
  .time-number {
    font-size: 1.5em;
  }
  
  .legend-container {
    width: 100%;
    max-width: 100%;
  }
}

/* 趋势表格 */
.trend-section {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 25px;
}

.trend-section h3 {
  color: #333333;
  margin-bottom: 20px;
  font-size: 1.3em;
  text-align: center;
}

.trend-table {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  background: #4CAF50;
  color: white;
  font-weight: 600;
}

.header-cell {
  padding: 15px 20px;
  text-align: center;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  border-bottom: 1px solid #eeeeee;
}

.table-row:last-child {
  border-bottom: none;
}

.cell {
  padding: 15px 20px;
  text-align: center;
  color: #333333;
}

.trend-indicator {
  font-size: 1.5em;
  font-weight: 700;
}

.trend-indicator.positive { color: #4CAF50; }
.trend-indicator.negative { color: #FF6B6B; }
.trend-indicator.neutral { color: #FF9800; }

/* 分析内容 */
.analysis-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

.analysis-card {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 25px;
}

.analysis-card h3 {
  color: #333333;
  margin-bottom: 20px;
  font-size: 1.3em;
  text-align: center;
}

.time-distribution {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.time-slot {
  display: flex;
  align-items: center;
  gap: 15px;
}

.slot-label {
  width: 120px;
  font-weight: 500;
  color: #333333;
}

.slot-hours {
  width: 80px;
  text-align: right;
  color: #666666;
  font-size: 0.9em;
}

.subject-efficiency {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.efficiency-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.subject-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.subject-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

/* 建议区域 */
.recommendations {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border-radius: 15px;
  padding: 30px;
}

.recommendations h3 {
  color: #333333;
  margin-bottom: 25px;
  font-size: 1.4em;
  text-align: center;
}

.suggestions-list {
  display: grid;
  gap: 20px;
}

.suggestion-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.suggestion-icon {
  font-size: 2em;
  flex-shrink: 0;
}

.suggestion-content h4 {
  color: #333333;
  margin: 0 0 10px 0;
  font-size: 1.1em;
}

.suggestion-content p {
  color: #666666;
  margin: 0;
  line-height: 1.6;
}

/* 历史记录 */
.history-filters {
  margin-bottom: 25px;
  text-align: center;
}

.history-table {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .statistics-container {
    padding: 12px;
  }
  
  .page-title {
    font-size: 1.8em;
  }
  
  .time-range-selector {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }
  
  .stats-overview {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .charts-row {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .analysis-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr 1fr;
    font-size: 0.9em;
  }
  
  .header-cell:nth-child(n+3),
  .cell:nth-child(n+3) {
    display: none;
  }
  
  .suggestion-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>
