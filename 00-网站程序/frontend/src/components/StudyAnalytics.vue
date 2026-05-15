<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAnalyticsStore } from '@/stores/analytics'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const analyticsStore = useAnalyticsStore()
const userStore = useUserStore()

const activeTab = ref('overview')
const timeRange = ref('week')
const selectedSubject = ref('all')

// 计算属�?
const dailyReport = computed(() => analyticsStore.generateDailyReport())
const monthlyReport = computed(() => analyticsStore.generateMonthlyReport())
const weeklyReports = computed(() => analyticsStore.weeklyReports)
const productivityTrend = computed(() => analyticsStore.productivityTrend)

const filteredWeeklyReports = computed(() => {
  if (timeRange.value === 'month') {
    return weeklyReports.value.slice(-4) // 最�?�?
  } else if (timeRange.value === 'quarter') {
    return weeklyReports.value.slice(-12) // 最�?2�?
  }
  return weeklyReports.value.slice(-1) // 最�?�?
})

const subjectProgress = computed(() => {
  const subjects = ['408', '数学', '英语', '政治']
  return subjects.map(subject => ({
    name: subject,
    ...analyticsStore.getSubjectProgress(subject)
  }))
})

const chartData = computed(() => {
  // 为图表准备数�?
  const labels = productivityTrend.value.map(item => item.date)
  const data = productivityTrend.value.map(item => item.productivity)
  
  return {
    labels,
    datasets: [{
      label: '学习效率',
      data,
      borderColor: '#FF6B6B',
      backgroundColor: 'rgba(255, 107, 107, 0.1)',
      tension: 0.4,
      fill: true
    }]
  }
})

const exportReport = () => {
  analyticsStore.exportData()
  ElMessage.success('数据导出成功�?)
}

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`
}

const getProgressColor = (progress: number) => {
  if (progress >= 80) return '#67C23A'
  if (progress >= 60) return '#E6A23C'
  return '#F56C6C'
}

const getSubjectIcon = (subject: string) => {
  const icons: Record<string, string> = {
    '408': '💻',
    '数学': '🔢',
    '英语': '📚',
    '政治': '🏛�?
  }
  return icons[subject] || '📖'
}

onMounted(() => {
  analyticsStore.initializeAnalyticsData()
})
</script>

<template>
  <div class="analytics-container">
    <!-- 顶部概览 -->
    <div class="overview-section">
      <h2 class="section-title">学习数据分析</h2>
      <p class="section-description">全面了解学习进度和效�?/p>
      
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon">⏱️</div>
          <div class="stat-content">
            <div class="stat-value">{{ formatTime(analyticsStore.totalStudyTime) }}</div>
            <div class="stat-label">总学习时�?/div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-content">
            <div class="stat-value">{{ analyticsStore.averageProductivity }}/10</div>
            <div class="stat-label">平均效率</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-content">
            <div class="stat-value">{{ analyticsStore.studySessions.length }}</div>
            <div class="stat-label">学习会话</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-content">
            <div class="stat-value">{{ analyticsStore.recentAchievements.length }}</div>
            <div class="stat-label">近期成就</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要功能区域 -->
    <div class="analytics-content">
      <el-tabs v-model="activeTab" class="analytics-tabs">
        <el-tab-pane label="学习概览" name="overview">
          <div class="overview-content">
            <!-- 今日学习情况 -->
            <el-card v-if="dailyReport" class="report-card">
              <template #header>
                <div class="card-header">
                  <h3>今日学习报告</h3>
                  <span class="report-date">{{ dailyReport.date }}</span>
                </div>
              </template>
              
              <div class="daily-stats">
                <div class="stat-item">
                  <span class="label">学习时长</span>
                  <span class="value">{{ formatTime(dailyReport.totalTime) }}</span>
                </div>
                <div class="stat-item">
                  <span class="label">学习会话</span>
                  <span class="value">{{ dailyReport.sessions }}�?/span>
                </div>
                <div class="stat-item">
                  <span class="label">平均效率</span>
                  <span class="value">{{ dailyReport.productivity }}/10</span>
                </div>
                <div class="stat-item">
                  <span class="label">主力科目</span>
                  <span class="value">{{ dailyReport.mostStudiedSubject }}</span>
                </div>
              </div>
              
              <div class="subject-breakdown">
                <h4>科目时间分布</h4>
                <div class="breakdown-list">
                  <div 
                    v-for="(time, subject) in dailyReport.subjects" 
                    :key="subject"
                    class="subject-item"
                  >
                    <span class="subject-name">
                      <span class="subject-icon">{{ getSubjectIcon(subject) }}</span>
                      {{ subject }}
                    </span>
                    <span class="subject-time">{{ formatTime(time) }}</span>
                  </div>
                </div>
              </div>
            </el-card>
            
            <div v-else class="no-data">
              <el-icon size="60" color="#999999"><Document /></el-icon>
              <p>今天还没有学习记�?/p>
            </div>

            <!-- 本月学习概览 -->
            <el-card v-if="monthlyReport" class="report-card">
              <template #header>
                <div class="card-header">
                  <h3>本月学习概览</h3>
                  <span class="report-date">{{ monthlyReport.month }}</span>
                </div>
              </template>
              
              <div class="monthly-stats">
                <div class="stat-grid">
                  <div class="stat-item">
                    <span class="label">总时�?/span>
                    <span class="value">{{ formatTime(monthlyReport.totalTime) }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="label">学习天数</span>
                    <span class="value">{{ monthlyReport.studyDays }}�?/span>
                  </div>
                  <div class="stat-item">
                    <span class="label">日均时长</span>
                    <span class="value">{{ formatTime(monthlyReport.avgDailyTime) }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="label">平均效率</span>
                    <span class="value">{{ monthlyReport.productivity }}/10</span>
                  </div>
                </div>
                
                <div class="monthly-subjects">
                  <h4>科目进度</h4>
                  <div class="progress-list">
                    <div 
                      v-for="subject in subjectProgress" 
                      :key="subject.name"
                      class="progress-item"
                    >
                      <div class="subject-info">
                        <span class="subject-icon">{{ getSubjectIcon(subject.name) }}</span>
                        <span class="subject-name">{{ subject.name }}</span>
                      </div>
                      <div class="progress-bar">
                        <el-progress 
                          :percentage="subject.progress" 
                          :stroke-width="12"
                          :color="getProgressColor(subject.progress)"
                          :show-text="false"
                        />
                        <span class="progress-text">{{ subject.progress }}%</span>
                      </div>
                      <div class="completion-status">
                        {{ subject.completed }}/{{ subject.total }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="效率趋势" name="trend">
          <div class="trend-content">
            <el-card>
              <template #header>
                <div class="card-header">
                  <h3>学习效率趋势</h3>
                  <div class="time-filters">
                    <el-radio-group v-model="timeRange">
                      <el-radio-button label="week">近一�?/el-radio-button>
                      <el-radio-button label="month">近一�?/el-radio-button>
                      <el-radio-button label="quarter">近三�?/el-radio-button>
                    </el-radio-group>
                  </div>
                </div>
              </template>
              
              <div class="trend-chart">
                <div 
                  v-for="item in productivityTrend.slice(-30)" 
                  :key="item.date"
                  class="trend-bar"
                >
                  <div class="bar-container">
                    <div 
                      class="bar-fill"
                      :style="{ height: item.productivity * 3 + 'px' }"
                    ></div>
                  </div>
                  <div class="trend-date">{{ item.date.split('-')[2] }}</div>
                  <div class="trend-value">{{ item.productivity }}</div>
                </div>
              </div>
              
              <div class="trend-stats">
                <div class="stat-item">
                  <span class="label">最高效�?/span>
                  <span class="value">{{ Math.max(...productivityTrend.map(t => t.productivity)) }}/10</span>
                </div>
                <div class="stat-item">
                  <span class="label">最低效�?/span>
                  <span class="value">{{ Math.min(...productivityTrend.map(t => t.productivity)) }}/10</span>
                </div>
                <div class="stat-item">
                  <span class="label">平均效率</span>
                  <span class="value">{{ analyticsStore.averageProductivity }}/10</span>
                </div>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="科目分析" name="subjects">
          <div class="subjects-content">
            <el-card>
              <template #header>
                <h3>各科目学习情�?/h3>
              </template>
              
              <div class="subjects-grid">
                <div 
                  v-for="subject in subjectProgress" 
                  :key="subject.name"
                  class="subject-card"
                >
                  <div class="subject-header">
                    <div class="subject-icon-large">{{ getSubjectIcon(subject.name) }}</div>
                    <h4>{{ subject.name }}</h4>
                  </div>
                  
                  <div class="progress-display">
                    <el-progress 
                      type="circle"
                      :percentage="subject.progress"
                      :width="120"
                      :color="getProgressColor(subject.progress)"
                    />
                  </div>
                  
                  <div class="subject-details">
                    <div class="detail-item">
                      <span class="label">完成�?/span>
                      <span class="value">{{ subject.completed }}/{{ subject.total }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">进度状�?/span>
                      <el-tag :type="subject.progress >= 80 ? 'success' : subject.progress >= 60 ? 'warning' : 'danger'">
                        {{ subject.progress >= 80 ? '优秀' : subject.progress >= 60 ? '良好' : '需加强' }}
                      </el-tag>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="成就系统" name="achievements">
          <div class="achievements-content">
            <el-card>
              <template #header>
                <div class="card-header">
                  <h3>学习成就</h3>
                  <el-button @click="exportReport">
                    <el-icon><Download /></el-icon>
                    导出数据
                  </el-button>
                </div>
              </template>
              
              <div class="achievements-grid">
                <div 
                  v-for="achievement in analyticsStore.achievements" 
                  :key="achievement.id"
                  class="achievement-card"
                  :class="{ 'unlocked': achievement.unlocked }"
                >
                  <div class="achievement-icon">
                    {{ achievement.icon }}
                  </div>
                  <div class="achievement-content">
                    <h4>{{ achievement.title }}</h4>
                    <p>{{ achievement.description }}</p>
                    <div class="achievement-status">
                      <el-tag :type="achievement.unlocked ? 'success' : 'info'">
                        {{ achievement.unlocked ? '已解�? : '未解�? }}
                      </el-tag>
                      <span v-if="achievement.unlocked" class="unlock-date">
                        {{ new Date(achievement.unlockDate!).toLocaleDateString() }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.analytics-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px;
}

.section-title {
  text-align: center;
  color: white;
  font-size: 2.2em;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.section-description {
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2em;
  margin-bottom: 40px;
}

.overview-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  text-align: center;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
  margin-top: 30px;
}

.stat-card {
  background: linear-gradient(135deg, #FF6B6B 0%, #4CAF50 100%);
  color: white;
  padding: 25px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  font-size: 2.5em;
}

.stat-content {
  text-align: left;
}

.stat-value {
  font-size: 2em;
  font-weight: 700;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 1em;
  opacity: 0.9;
}

.analytics-content {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}

.analytics-tabs :deep(.el-tabs__header) {
  margin-bottom: 30px;
}

.analytics-tabs :deep(.el-tabs__nav-wrap)::after {
  display: none;
}

.analytics-tabs :deep(.el-tabs__item) {
  font-size: 1.2em;
  font-weight: 500;
  padding: 0 30px;
  height: 60px;
  line-height: 60px;
  color: #666666;
}

.analytics-tabs :deep(.el-tabs__item.is-active) {
  color: #FF6B6B;
  font-weight: 600;
}

.report-card {
  margin-bottom: 30px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  color: #333333;
  margin: 0;
  font-size: 1.4em;
}

.report-date {
  color: #666666;
  font-size: 1em;
}

.daily-stats, .monthly-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.stat-item .label {
  display: block;
  color: #666666;
  font-size: 0.9em;
  margin-bottom: 10px;
}

.stat-item .value {
  display: block;
  color: #333333;
  font-size: 1.3em;
  font-weight: 600;
}

.subject-breakdown h4, .monthly-subjects h4 {
  color: #333333;
  margin: 25px 0 15px 0;
  font-size: 1.2em;
}

.breakdown-list, .progress-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.subject-item, .progress-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
}

.subject-name {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: #333333;
}

.subject-icon {
  font-size: 1.2em;
}

.subject-time {
  color: #666666;
  font-weight: 600;
}

.progress-bar {
  flex: 1;
  margin: 0 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.progress-text {
  color: #333333;
  font-weight: 600;
  min-width: 50px;
}

.completion-status {
  color: #666666;
  font-size: 0.9em;
}

.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #999999;
}

.no-data p {
  margin-top: 20px;
  font-size: 1.2em;
}

.trend-content {
  text-align: center;
}

.time-filters {
  margin-left: auto;
}

.trend-chart {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 200px;
  gap: 3px;
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.trend-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  flex: 1;
  max-width: 30px;
}

.bar-container {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  background: #e9ecef;
  border-radius: 3px;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(to top, #FF6B6B, #4CAF50);
  border-radius: 3px;
  transition: height 0.3s ease;
}

.trend-date {
  color: #666666;
  font-size: 0.8em;
}

.trend-value {
  color: #333333;
  font-weight: 600;
  font-size: 0.9em;
}

.trend-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.subject-card {
  text-align: center;
  padding: 30px 20px;
  background: #f8f9fa;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.subject-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.subject-header {
  margin-bottom: 25px;
}

.subject-icon-large {
  font-size: 3em;
  margin-bottom: 15px;
}

.subject-header h4 {
  color: #333333;
  margin: 0;
  font-size: 1.3em;
}

.progress-display {
  margin: 25px 0;
}

.subject-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-item .label {
  color: #666666;
}

.achievements-content {
  text-align: center;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.achievement-card {
  display: flex;
  gap: 20px;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 15px;
  text-align: left;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.achievement-card.unlocked {
  background: linear-gradient(135deg, #fff8f8 0%, #f8fff8 100%);
  opacity: 1;
  border: 2px solid #4CAF50;
}

.achievement-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.achievement-icon {
  font-size: 2.5em;
  min-width: 60px;
  text-align: center;
}

.achievement-content h4 {
  color: #333333;
  margin: 0 0 10px 0;
  font-size: 1.2em;
}

.achievement-content p {
  color: #666666;
  margin: 0 0 15px 0;
  line-height: 1.5;
}

.achievement-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.unlock-date {
  color: #666666;
  font-size: 0.9em;
}

/* 响应式设�?*/
@media (max-width: 768px) {
  .analytics-container {
    padding: 20px 15px;
  }
  
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .stat-card {
    padding: 20px;
    gap: 15px;
  }
  
  .daily-stats, .monthly-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .trend-stats {
    flex-direction: column;
    gap: 15px;
  }
  
  .subjects-grid {
    grid-template-columns: 1fr;
  }
  
  .achievements-grid {
    grid-template-columns: 1fr;
  }
  
  .achievement-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>
