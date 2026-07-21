<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLearningPathStore } from '@/stores/learningPath'
import { useStudyStore } from '@/stores/study'
import { ElMessage } from 'element-plus'
import { InfoFilled, CircleCheck } from '@element-plus/icons-vue'

const learningPathStore = useLearningPathStore()
const studyStore = useStudyStore()

// 当前选中的科目
const selectedSubject = ref('all')

// 计算属性 - 学习情况分析
const studyAnalysis = computed(() => {
  return learningPathStore.analyzeStudyRecords()
})

// 各科目详细统计
const subjectDetails = computed(() => {
  const stats = studyStore.subjectStats
  const progress = studyStore.subjectProgress as any
  const details: any[] = []
  
  // 数学一
  if (stats['数学一']) {
    const mathStats = stats['数学一']
    const mathProgress = progress['数学一'] || { totalTime: 0, lastStudyDate: '-', weeklyGoal: 300, completionRate: 0 }
    details.push({
      id: 'math',
      name: '数学一',
      icon: '📐',
      color: '#409EFF',
      totalTime: mathStats.totalTime,
      lastDate: mathProgress.lastStudyDate,
      weeklyGoal: mathProgress.weeklyGoal,
      completionRate: mathProgress.completionRate,
      status: '强化阶段',
      progress: 35, // 概率论完成35%
      currentFocus: '概率论强化（第1-3章已完成）',
      nextStep: '继续概率论强化（剩余6章）',
      estimatedDays: 17,
      milestones: [
        { name: '高数基础', completed: true },
        { name: '线代基础', completed: true },
        { name: '概率论强化', completed: false, current: true },
        { name: '高数强化复习', completed: false },
        { name: '线代强化复习', completed: false },
        { name: '真题训练', completed: false }
      ]
    })
  }
  
  // 408计算机
  if (stats['408计算机']) {
    const csStats = stats['408计算机']
    const csProgress = progress['408计算机'] || { totalTime: 0, lastStudyDate: '-', weeklyGoal: 300, completionRate: 0 }
    details.push({
      id: 'cs408',
      name: '408计算机',
      icon: '💻',
      color: '#67C23A',
      totalTime: csStats.totalTime,
      lastDate: csProgress.lastStudyDate,
      weeklyGoal: csProgress.weeklyGoal,
      completionRate: csProgress.completionRate,
      status: '基础阶段',
      progress: 45, // 数据结构+计组完成约45%
      currentFocus: '操作系统第一章学习中',
      nextStep: '完成操作系统基础轮',
      estimatedDays: 30,
      milestones: [
        { name: '数据结构', completed: true },
        { name: '组成原理', completed: true },
        { name: '操作系统', completed: false, current: true },
        { name: '计算机网络', completed: false },
        { name: '真题训练', completed: false }
      ]
    })
  }
  
  // 英语一
  if (stats['英语一']) {
    const engStats = stats['英语一']
    const engProgress = progress['英语一'] || { totalTime: 0, lastStudyDate: '-', weeklyGoal: 300, completionRate: 0 }
    details.push({
      id: 'english',
      name: '英语一',
      icon: '📚',
      color: '#E6A23C',
      totalTime: engStats.totalTime,
      lastDate: engProgress.lastStudyDate,
      weeklyGoal: engProgress.weeklyGoal,
      completionRate: engProgress.completionRate,
      status: '基础巩固',
      progress: 60, // 词汇80% + 语法40%
      currentFocus: '词汇第6轮 + 长难句分析',
      nextStep: '开始真题阅读训练',
      estimatedDays: 45,
      milestones: [
        { name: '词汇突破', completed: false, current: true, percent: 80 },
        { name: '语法长难句', completed: false, percent: 40 },
        { name: '阅读理解', completed: false },
        { name: '翻译完型', completed: false },
        { name: '写作专项', completed: false },
        { name: '真题冲刺', completed: false }
      ]
    })
  }
  
  // 政治
  details.push({
    id: 'politics',
    name: '政治',
    icon: '📖',
    color: '#F56C6C',
    totalTime: 0,
    lastDate: '-',
    weeklyGoal: 300,
    completionRate: 0,
    status: '计划7月启动',
    progress: 0,
    currentFocus: '尚未开始',
    nextStep: '7月开始马原学习',
    estimatedDays: 90,
    milestones: [
      { name: '马原', completed: false },
      { name: '毛中特', completed: false },
      { name: '史纲', completed: false },
      { name: '思修', completed: false },
      { name: '形势政策', completed: false },
      { name: '选择题强化', completed: false },
      { name: '分析题背诵', completed: false }
    ]
  })
  
  return details
})

// 总体进度
const overallProgress = computed(() => {
  const total = subjectDetails.value.length
  const avgProgress = subjectDetails.value.reduce((sum, s) => sum + s.progress, 0) / total
  return Math.round(avgProgress)
})

// 今日学习建议
const todayRecommendation = computed(() => {
  const recommendations: string[] = []
  
  // 基于最近学习记录的建议
  const today = new Date().toISOString().split('T')[0]
  const todayRecords = studyStore.studyRecords.filter(r => r.date === today)
  
  if (todayRecords.length === 0) {
    recommendations.push('今天还没有学习记录，建议开始学习！')
  }
  
  // 检查各科目的平衡性
  const subjects = [...new Set(todayRecords.map(r => r.subject))]
  
  if (subjects.length < 2 && todayRecords.length > 0) {
    recommendations.push('建议今天学习多个科目，避免偏科')
  }
  
  // 基于进度的建议
  subjectDetails.value.forEach(subject => {
    if (subject.id === 'math' && subject.progress < 50) {
      recommendations.push('数学一：继续概率论强化学习，保持每天2-3小时')
    }
    if (subject.id === 'cs408' && subject.currentFocus.includes('操作系统')) {
      recommendations.push('408：操作系统刚开始，建议每天1.5-2小时')
    }
    if (subject.id === 'english' && subjects.length === 0) {
      recommendations.push('英语一：今天还没背单词，建议安排15-30分钟')
    }
  })
  
  return recommendations.slice(0, 3) // 最多显示3条建议
})

// 学习方法
const getSubjectColor = (color: string) => color

// 格式化时间
const formatTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes}分钟`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (hours < 24) {
    return remainingMinutes > 0 ? `${hours}小时${remainingMinutes}分钟` : `${hours}小时`
  }
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  return remainingHours > 0 ? `${days}天${remainingHours}小时` : `${days}天`
}

// 获取里程碑状态文本
const getMilestoneStatus = (milestone: any) => {
  if (milestone.completed) return '已完成'
  if (milestone.current) return '进行中'
  return '待开始'
}

// 查看科目详情
const viewSubjectDetail = (subject: any) => {
  ElMessage.info(`查看${subject.name}的详细学习计划`)
  // TODO: 可以跳转到详细页面或展开详情
}
</script>

<template>
  <div class="personalized-path">
    <!-- 顶部概览卡片 -->
    <div class="overview-section">
      <div class="overview-card gradient-bg">
        <div class="overview-header">
          <h2>🎯 考研学习总览</h2>
          <span class="overall-progress">{{ overallProgress }}%</span>
        </div>
        <div class="overview-stats">
          <div class="stat-item">
            <div class="stat-value">{{ studyAnalysis.totalStudyTime > 0 ? Math.round(studyAnalysis.totalStudyTime / 60) : 0 }}</div>
            <div class="stat-label">累计学习(小时)</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ studyAnalysis.studyDays }}</div>
            <div class="stat-label">学习天数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ studyAnalysis.avgDailyTime > 0 ? Math.round(studyAnalysis.avgDailyTime / 60 * 10) / 10 : 0 }}</div>
            <div class="stat-label">日均学习(小时)</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ subjectDetails.length }}</div>
            <div class="stat-label">学习科目</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 今日建议 -->
    <div class="recommendation-section" v-if="todayRecommendation.length > 0">
      <div class="section-header">
        <h3>💡 今日学习建议</h3>
      </div>
      <div class="recommendation-list">
        <div 
          v-for="(rec, index) in todayRecommendation" 
          :key="index"
          class="recommendation-item"
        >
          <el-icon><InfoFilled /></el-icon>
          <span>{{ rec }}</span>
        </div>
      </div>
    </div>

    <!-- 各科目学习路径 -->
    <div class="subjects-section">
      <div class="section-header">
        <h3>📊 各科目学习路径</h3>
        <p class="section-subtitle">基于你的实际学习进度智能生成</p>
      </div>

      <div class="subjects-grid">
        <div 
          v-for="subject in subjectDetails" 
          :key="subject.id"
          class="subject-card"
          :style="{ borderLeft: `4px solid ${subject.color}` }"
        >
          <!-- 科目头部 -->
          <div class="subject-header">
            <div class="subject-info">
              <span class="subject-icon">{{ subject.icon }}</span>
              <div class="subject-meta">
                <h4>{{ subject.name }}</h4>
                <span class="subject-status" :style="{ color: subject.color }">
                  {{ subject.status }}
                </span>
              </div>
            </div>
            <div class="subject-progress-ring">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle 
                  cx="30" cy="30" r="26" 
                  fill="none" 
                  stroke="#e0e0e0" 
                  stroke-width="4"
                />
                <circle 
                  cx="30" cy="30" r="26" 
                  fill="none" 
                  :stroke="subject.color" 
                  stroke-width="4"
                  :stroke-dasharray="`${2 * Math.PI * 26}`"
                  :stroke-dashoffset="`${2 * Math.PI * 26 * (1 - subject.progress / 100)}`"
                  transform="rotate(-90 30 30)"
                  stroke-linecap="round"
                />
                <text x="30" y="30" text-anchor="middle" dy=".3em" font-size="14" font-weight="bold">
                  {{ subject.progress }}%
                </text>
              </svg>
            </div>
          </div>

          <!-- 当前焦点 -->
          <div class="current-focus">
            <div class="focus-label">当前重点：</div>
            <div class="focus-content">{{ subject.currentFocus }}</div>
          </div>

          <!-- 下一步 -->
          <div class="next-step">
            <div class="step-label">下一步：</div>
            <div class="step-content">{{ subject.nextStep }}</div>
            <span class="estimated-time">预计{{ subject.estimatedDays }}天</span>
          </div>

          <!-- 学习统计 -->
          <div class="study-stats">
            <div class="mini-stat">
              <span class="label">累计学习</span>
              <span class="value">{{ formatTime(subject.totalTime) }}</span>
            </div>
            <div class="mini-stat">
              <span class="label">本周目标</span>
              <span class="value">{{ subject.completionRate }}%</span>
            </div>
            <div class="mini-stat">
              <span class="label">最后学习</span>
              <span class="value">{{ subject.lastDate }}</span>
            </div>
          </div>

          <!-- 里程碑 -->
          <div class="milestones">
            <div class="milestones-title">学习里程碑</div>
            <div class="milestone-list">
              <div 
                v-for="(milestone, idx) in subject.milestones" 
                :key="idx"
                class="milestone-item"
                :class="{ 
                  'completed': milestone.completed, 
                  'current': milestone.current 
                }"
              >
                <div class="milestone-marker">
                  <el-icon v-if="milestone.completed" color="#67C23A"><CircleCheck /></el-icon>
                  <div v-else-if="milestone.current" class="current-dot"></div>
                  <div v-else class="pending-dot"></div>
                </div>
                <div class="milestone-content">
                  <span class="milestone-name">{{ milestone.name }}</span>
                  <span v-if="milestone.percent !== undefined" class="milestone-percent">
                    {{ milestone.percent }}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="subject-actions">
            <el-button 
              type="primary" 
              :color="subject.color"
              @click="viewSubjectDetail(subject)"
            >
              查看详细计划
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习建议总结 -->
    <div class="summary-section">
      <div class="section-header">
        <h3>🎓 综合学习建议</h3>
      </div>
      <div class="suggestions-grid">
        <div class="suggestion-card priority-high">
          <div class="suggestion-icon">🔥</div>
          <h4>优先任务</h4>
          <ul>
            <li>数学一：完成概率论强化（剩余6章），预计17天</li>
            <li>408：操作系统刚启动，需要持续投入时间</li>
            <li>英语一：保持每日背单词习惯</li>
          </ul>
        </div>
        
        <div class="suggestion-card priority-medium">
          <div class="suggestion-icon">⚖️</div>
          <h4>时间分配建议</h4>
          <ul>
            <li>数学一：每天3-4小时（强化阶段关键期）</li>
            <li>408：每天2-3小时（基础轮收尾）</li>
            <li>英语一：每天1-2小时（持续积累）</li>
            <li>政治：7月启动后每天1.5-2小时</li>
          </ul>
        </div>
        
        <div class="suggestion-card priority-low">
          <div class="suggestion-icon">📈</div>
          <h4>长期规划</h4>
          <ul>
            <li>6月底前：完成所有科目基础轮</li>
            <li>7-8月：强化阶段全面展开</li>
            <li>9-10月：真题训练第一遍</li>
            <li>11-12月：冲刺模拟+查漏补缺</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.personalized-path {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 顶部概览 */
.overview-section {
  margin-bottom: 30px;
}

.overview-card {
  background: linear-gradient(150deg, #0d2137 0%, #16345c 60%, #1e4576 100%);
  border-radius: 20px;
  padding: 30px;
  color: white;
  box-shadow: 0 10px 30px rgba(13, 33, 55, 0.25);
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.overview-header h2 {
  margin: 0;
  font-size: 1.8em;
  font-weight: 600;
}

.overall-progress {
  font-size: 2em;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: 10px;
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat-item {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.stat-value {
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9em;
  opacity: 0.9;
}

/* 建议区域 */
.recommendation-section {
  margin-bottom: 30px;
  background: #fff;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.section-header {
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0 0 5px 0;
  font-size: 1.5em;
  color: #333;
}

.section-subtitle {
  margin: 0;
  color: #999;
  font-size: 0.95em;
}

.recommendation-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recommendation-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  background: #f0f9ff;
  border-left: 4px solid #409EFF;
  border-radius: 8px;
  color: #333;
  font-size: 0.95em;
}

.recommendation-item .el-icon {
  color: #409EFF;
  font-size: 1.2em;
}

/* 科目卡片网格 */
.subjects-section {
  margin-bottom: 30px;
}

.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
}

.subject-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.subject-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.subject-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.subject-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.subject-icon {
  font-size: 2.5em;
}

.subject-meta h4 {
  margin: 0 0 5px 0;
  font-size: 1.3em;
  color: #333;
}

.subject-status {
  font-size: 0.85em;
  font-weight: 500;
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
}

.subject-progress-ring {
  flex-shrink: 0;
}

.current-focus, .next-step {
  margin-bottom: 15px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.focus-label, .step-label {
  font-size: 0.85em;
  color: #999;
  margin-bottom: 5px;
}

.focus-content, .step-content {
  font-size: 0.95em;
  color: #333;
  font-weight: 500;
}

.estimated-time {
  display: inline-block;
  margin-top: 5px;
  font-size: 0.85em;
  color: #666;
  background: #e8f4ff;
  padding: 3px 8px;
  border-radius: 4px;
}

.study-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background: #fafafa;
  border-radius: 8px;
}

.mini-stat {
  text-align: center;
}

.mini-stat .label {
  display: block;
  font-size: 0.75em;
  color: #999;
  margin-bottom: 3px;
}

.mini-stat .value {
  display: block;
  font-size: 0.9em;
  color: #333;
  font-weight: 600;
}

/* 里程碑 */
.milestones {
  margin-bottom: 20px;
}

.milestones-title {
  font-size: 0.95em;
  color: #666;
  margin-bottom: 12px;
  font-weight: 500;
}

.milestone-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.milestone-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.milestone-item.completed {
  background: #f0f9ff;
}

.milestone-item.current {
  background: #fff7e6;
  border-left: 3px solid #E6A23C;
}

.milestone-marker {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.current-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #E6A23C;
  animation: pulse 2s infinite;
}

.pending-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #d9d9d9;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.milestone-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.milestone-name {
  font-size: 0.9em;
  color: #333;
}

.milestone-percent {
  font-size: 0.8em;
  color: #E6A23C;
  font-weight: 600;
}

.subject-actions {
  text-align: center;
}

.subject-actions .el-button {
  width: 100%;
}

/* 综合建议 */
.summary-section {
  margin-bottom: 30px;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.suggestion-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border-top: 4px solid;
}

.suggestion-card.priority-high {
  border-top-color: #F56C6C;
}

.suggestion-card.priority-medium {
  border-top-color: #E6A23C;
}

.suggestion-card.priority-low {
  border-top-color: #67C23A;
}

.suggestion-icon {
  font-size: 2.5em;
  margin-bottom: 15px;
}

.suggestion-card h4 {
  margin: 0 0 15px 0;
  font-size: 1.2em;
  color: #333;
}

.suggestion-card ul {
  margin: 0;
  padding-left: 20px;
  list-style: none;
}

.suggestion-card li {
  margin-bottom: 10px;
  color: #666;
  font-size: 0.95em;
  line-height: 1.6;
  position: relative;
}

.suggestion-card li:before {
  content: '•';
  position: absolute;
  left: -15px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .personalized-path {
    padding: 15px;
  }
  
  .overview-header h2 {
    font-size: 1.4em;
  }
  
  .overall-progress {
    font-size: 1.5em;
    padding: 8px 15px;
  }
  
  .stat-value {
    font-size: 1.5em;
  }
  
  .subjects-grid {
    grid-template-columns: 1fr;
  }
  
  .suggestions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
