<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useLearningPathStore } from '@/stores/learningPath'
import { ElMessage } from 'element-plus'

const learningPathStore = useLearningPathStore()

// 计算属性
const habits = computed(() => learningPathStore.analyzeStudyHabits())
const subjectDistribution = computed(() => learningPathStore.getSubjectDistribution())
const optimalTimes = computed(() => learningPathStore.getOptimalStudyTimes())
const efficiencyTrend = computed(() => learningPathStore.getEfficiencyTrend(7))
const report = computed(() => learningPathStore.generateLearningReport())

// 预测数据（示例：数学一）
const mathPrediction = computed(() => learningPathStore.predictCompletionTime('数学一'))
const englishPrediction = computed(() => learningPathStore.predictCompletionTime('英语一'))
const cs408Prediction = computed(() => learningPathStore.predictCompletionTime('408计算机科学综合'))
const politicsPrediction = computed(() => learningPathStore.predictCompletionTime('政治'))

const predictions = computed(() => {
  return [mathPrediction, englishPrediction, cs408Prediction, politicsPrediction]
    .filter(p => p !== null)
})

// 方法
const getEfficiencyColor = (efficiency: number) => {
  if (efficiency >= 80) return '#4CAF50'
  if (efficiency >= 60) return '#FF9800'
  return '#FF6B6B'
}

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.7) return '#4CAF50'
  if (confidence >= 0.4) return '#FF9800'
  return '#FF6B6B'
}

const formatTime = (minutes: number) => {
  if (minutes < 60) return `${minutes}分钟`
  return `${Math.round(minutes / 60)}小时`
}
</script>

<template>
  <div class="analytics-dashboard">
    <!-- 学习习惯概览 -->
    <div class="section-card">
      <div class="section-header">
        <h3>📊 学习习惯概览</h3>
      </div>
      
      <div class="habits-grid">
        <div 
          v-for="habit in habits" 
          :key="habit.metric"
          class="habit-card"
        >
          <div class="habit-icon">{{ habit.icon }}</div>
          <div class="habit-content">
            <div class="habit-value">{{ habit.value }}</div>
            <div class="habit-label">{{ habit.metric }}</div>
            <div class="habit-desc">{{ habit.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 科目时间分布 -->
    <div class="section-card" v-if="subjectDistribution.length > 0">
      <div class="section-header">
        <h3>📚 科目时间分布</h3>
      </div>
      
      <div class="distribution-list">
        <div 
          v-for="item in subjectDistribution" 
          :key="item.subject"
          class="distribution-item"
        >
          <div class="distribution-info">
            <div class="subject-name">{{ item.subject }}</div>
            <div class="subject-stats">
              <span>{{ formatTime(item.totalTime) }}</span>
              <span>{{ item.sessions }}次</span>
              <span>平均{{ formatTime(item.avgSessionTime) }}/次</span>
            </div>
          </div>
          
          <div class="distribution-bar">
            <div 
              class="bar-fill"
              :style="{ 
                width: item.percentage + '%',
                background: `linear-gradient(90deg, #4CAF50 ${item.percentage}%, #e0e0e0 ${item.percentage}%)`
              }"
            ></div>
          </div>
          
          <div class="percentage">{{ item.percentage }}%</div>
        </div>
      </div>
    </div>

    <!-- 最佳学习时段 -->
    <div class="section-card" v-if="optimalTimes.length > 0">
      <div class="section-header">
        <h3>⏰ 最佳学习时段</h3>
      </div>
      
      <div class="time-slots">
        <div 
          v-for="(slot, index) in optimalTimes" 
          :key="slot.hour"
          class="time-slot"
          :class="{ 'top-slot': index === 0 }"
        >
          <div class="slot-rank" v-if="index < 3">
            {{ index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉' }}
          </div>
          
          <div class="slot-info">
            <div class="slot-time">{{ slot.label }}</div>
            <div class="slot-sessions">{{ slot.sessionCount }}次学习</div>
          </div>
          
          <div class="slot-efficiency">
            <div 
              class="efficiency-badge"
              :style="{ color: getEfficiencyColor(slot.avgEfficiency) }"
            >
              {{ slot.avgEfficiency }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 效率趋势图（最近7天） -->
    <div class="section-card" v-if="efficiencyTrend.length > 0">
      <div class="section-header">
        <h3>📈 学习效率趋势（近7天）</h3>
      </div>
      
      <div class="trend-chart">
        <div 
          v-for="day in efficiencyTrend" 
          :key="day.date"
          class="trend-bar"
        >
          <div class="efficiency-label">{{ day.efficiency }}%</div>
          <div 
            class="bar"
            :style="{ 
              height: day.efficiency + '%',
              background: getEfficiencyColor(day.efficiency)
            }"
          ></div>
          <div class="date-label">{{ day.date.slice(5) }}</div>
        </div>
      </div>
    </div>

    <!-- 完成时间预测 -->
    <div class="section-card" v-if="predictions.length > 0">
      <div class="section-header">
        <h3>🎯 完成时间预测</h3>
      </div>
      
      <div class="predictions-list">
        <div 
          v-for="pred in predictions" 
          :key="pred!.subject"
          class="prediction-item"
        >
          <div class="prediction-header">
            <div class="subject-title">{{ pred!.subject }}</div>
            <div 
              class="confidence-badge"
              :style="{ background: getConfidenceColor(pred!.confidence) }"
            >
              置信度 {{ Math.round(pred!.confidence * 100) }}%
            </div>
          </div>
          
          <div class="prediction-details">
            <div class="detail-row">
              <span>预计还需：</span>
              <span class="highlight">{{ pred!.estimatedDays }}天</span>
            </div>
            <div class="detail-row">
              <span>预计完成：</span>
              <span class="highlight">{{ pred!.estimatedDate }}</span>
            </div>
          </div>
          
          <div class="prediction-factors">
            <div 
              v-for="(factor, idx) in pred!.factors" 
              :key="idx"
              class="factor-tag"
            >
              {{ factor }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 综合学习报告 -->
    <div class="section-card">
      <div class="section-header">
        <h3>📋 综合学习报告</h3>
      </div>
      
      <div class="report-summary">
        <div class="summary-stats">
          <div class="stat-item">
            <div class="stat-value">{{ Math.round(report.summary.totalTime / 60) }}h</div>
            <div class="stat-label">总学习时间</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ report.summary.studyDays }}</div>
            <div class="stat-label">学习天数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ report.summary.subjects }}</div>
            <div class="stat-label">学习科目</div>
          </div>
          <div class="stat-item">
            <div 
              class="stat-value"
              :style="{ color: getEfficiencyColor(report.summary.averageEfficiency) }"
            >
              {{ report.summary.averageEfficiency }}%
            </div>
            <div class="stat-label">平均效率</div>
          </div>
        </div>
      </div>
      
      <div class="report-details">
        <div class="detail-section" v-if="report.strengths.length > 0">
          <h4>✅ 优势</h4>
          <ul>
            <li v-for="(strength, idx) in report.strengths" :key="idx">
              {{ strength }}
            </li>
          </ul>
        </div>
        
        <div class="detail-section" v-if="report.weaknesses.length > 0">
          <h4>⚠️ 待改进</h4>
          <ul>
            <li v-for="(weakness, idx) in report.weaknesses" :key="idx">
              {{ weakness }}
            </li>
          </ul>
        </div>
        
        <div class="detail-section">
          <h4>💡 建议</h4>
          <ul>
            <li v-for="(rec, idx) in report.recommendations" :key="idx">
              {{ rec }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="habits.length === 0" class="empty-state">
      <el-icon :size="60" color="#ccc"><DataAnalysis /></el-icon>
      <p>暂无学习数据</p>
      <p class="hint">开始学习后，系统将自动生成分析报告</p>
    </div>
  </div>
</template>

<style scoped>
.analytics-dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.section-header {
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 1.3em;
  color: #333;
  margin: 0;
}

/* 学习习惯网格 */
.habits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.habit-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  border-radius: 12px;
  color: white;
}

.habit-icon {
  font-size: 2em;
}

.habit-content {
  flex: 1;
}

.habit-value {
  font-size: 1.5em;
  font-weight: 700;
  margin-bottom: 5px;
}

.habit-label {
  font-size: 0.9em;
  opacity: 0.9;
  margin-bottom: 3px;
}

.habit-desc {
  font-size: 0.75em;
  opacity: 0.7;
}

/* 科目分布 */
.distribution-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.distribution-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.distribution-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subject-name {
  font-weight: 600;
  color: #333;
  font-size: 1.05em;
}

.subject-stats {
  display: flex;
  gap: 15px;
  font-size: 0.85em;
  color: #666;
}

.distribution-bar {
  height: 12px;
  background: #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.5s ease;
}

.percentage {
  text-align: right;
  font-weight: 600;
  color: #4CAF50;
  font-size: 0.9em;
}

/* 最佳时段 */
.time-slots {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-slot {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #4CAF50;
}

.time-slot.top-slot {
  background: linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%);
  border-left-color: #FFD700;
}

.slot-rank {
  font-size: 1.5em;
}

.slot-info {
  flex: 1;
}

.slot-time {
  font-weight: 600;
  color: #333;
  font-size: 1.05em;
  margin-bottom: 5px;
}

.slot-sessions {
  font-size: 0.85em;
  color: #666;
}

.slot-efficiency {
  font-size: 1.2em;
  font-weight: 700;
}

.efficiency-badge {
  padding: 5px 12px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.05);
}

/* 趋势图表 */
.trend-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 200px;
  padding: 20px 10px 0;
  gap: 10px;
}

.trend-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
  position: relative;
}

.efficiency-label {
  font-size: 0.8em;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.bar {
  width: 100%;
  max-width: 40px;
  border-radius: 6px 6px 0 0;
  transition: all 0.5s ease;
  min-height: 4px;
  align-self: flex-end;
}

.date-label {
  font-size: 0.75em;
  color: #666;
  margin-top: 4px;
}

/* 预测列表 */
.predictions-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.prediction-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
}

.prediction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.subject-title {
  font-weight: 600;
  color: #333;
  font-size: 1.1em;
}

.confidence-badge {
  padding: 5px 12px;
  border-radius: 20px;
  color: white;
  font-size: 0.85em;
  font-weight: 600;
}

.prediction-details {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
}

.detail-row {
  display: flex;
  gap: 8px;
  font-size: 0.95em;
}

.detail-row span:first-child {
  color: #666;
}

.highlight {
  font-weight: 600;
  color: #4CAF50;
}

.prediction-factors {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.factor-tag {
  padding: 4px 10px;
  background: white;
  border-radius: 15px;
  font-size: 0.8em;
  color: #666;
  border: 1px solid #e0e0e0;
}

/* 报告摘要 */
.report-summary {
  margin-bottom: 20px;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 10px;
}

.stat-value {
  font-size: 1.8em;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.85em;
  color: #666;
}

/* 报告详情 */
.report-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-section h4 {
  color: #333;
  margin-bottom: 10px;
  font-size: 1.1em;
}

.detail-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.detail-section li {
  padding: 8px 0;
  padding-left: 25px;
  position: relative;
  color: #666;
  line-height: 1.6;
}

.detail-section li::before {
  content: '•';
  position: absolute;
  left: 10px;
  color: #4CAF50;
  font-weight: bold;
  font-size: 1.2em;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.empty-state p {
  color: #999;
  margin: 10px 0;
}

.empty-state .hint {
  font-size: 0.9em;
  font-style: italic;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .section-card {
    padding: 20px;
  }
  
  .habits-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .trend-chart {
    height: 150px;
  }
  
  .prediction-details {
    flex-direction: column;
    gap: 10px;
  }
  
  .summary-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .section-card {
    padding: 15px;
  }
  
  .section-header h3 {
    font-size: 1.15em;
  }
  
  .habits-grid {
    grid-template-columns: 1fr;
  }
  
  .habit-value {
    font-size: 1.3em;
  }
  
  .subject-stats {
    flex-direction: column;
    gap: 5px;
  }
  
  .trend-chart {
    height: 120px;
  }
  
  .bar {
    max-width: 25px;
  }
  
  .summary-stats {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  
  .stat-value {
    font-size: 1.5em;
  }
}
</style>
