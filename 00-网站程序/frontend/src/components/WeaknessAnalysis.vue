<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStudyStore } from '@/stores/study'
import { TrendCharts, Warning } from '@element-plus/icons-vue'

const studyStore = useStudyStore()

// 弱项数据（基于学习记录分析）
const weakPoints = ref([
  {
    id: 'math_prob_1',
    subject: '数学一',
    category: '概率论',
    topic: '随机变量及其分布',
    weaknessLevel: 'high',
    lastStudied: '3天前',
    reviewCount: 2,
    masteryLevel: 40,
    suggestions: [
      '重新阅读教材相关章节',
      '完成课后习题1-10',
      '观看强化班视频第4讲'
    ]
  },
  {
    id: 'math_prob_2',
    subject: '数学一',
    category: '概率论',
    topic: '多维随机变量',
    weaknessLevel: 'medium',
    lastStudied: '5天前',
    reviewCount: 1,
    masteryLevel: 55,
    suggestions: [
      '重点练习联合分布计算',
      '复习边缘分布概念'
    ]
  },
  {
    id: 'cs_os_1',
    subject: '408计算机',
    category: '操作系统',
    topic: '进程同步与互斥',
    weaknessLevel: 'high',
    lastStudied: '2天前',
    reviewCount: 1,
    masteryLevel: 35,
    suggestions: [
      '理解PV操作原理',
      '练习经典同步问题（生产者-消费者）',
      '绘制信号量机制流程图'
    ]
  },
  {
    id: 'eng_vocab_1',
    subject: '英语一',
    category: '词汇',
    topic: '高频核心词汇',
    weaknessLevel: 'medium',
    lastStudied: '1天前',
    reviewCount: 5,
    masteryLevel: 60,
    suggestions: [
      '使用艾宾浩斯记忆法复习',
      '在真题语境中记忆单词'
    ]
  }
])

// 计算属性
const highWeaknessCount = computed(() => {
  return weakPoints.value.filter(w => w.weaknessLevel === 'high').length
})

const mediumWeaknessCount = computed(() => {
  return weakPoints.value.filter(w => w.weaknessLevel === 'medium').length
})

const avgMasteryLevel = computed(() => {
  if (weakPoints.value.length === 0) return 0
  const sum = weakPoints.value.reduce((acc, w) => acc + w.masteryLevel, 0)
  return Math.round(sum / weakPoints.value.length)
})

const getWeaknessColor = (level: string) => {
  const colors: any = {
    high: '#F56C6C',
    medium: '#E6A23C',
    low: '#67C23A'
  }
  return colors[level] || '#909399'
}

const getWeaknessLabel = (level: string) => {
  const labels: any = {
    high: '严重薄弱',
    medium: '需要加强',
    low: '基本掌握'
  }
  return labels[level] || level
}

const getSubjectColor = (subject: string) => {
  const colors: any = {
    '数学一': '#409EFF',
    '408计算机': '#67C23A',
    '英语一': '#E6A23C',
    '政治': '#F56C6C'
  }
  return colors[subject] || '#909399'
}
</script>

<template>
  <div class="weakness-analysis">
    <!-- 概览统计 -->
    <div class="overview-stats">
      <div class="stat-item danger">
        <div class="stat-icon">🔴</div>
        <div class="stat-content">
          <div class="stat-value">{{ highWeaknessCount }}</div>
          <div class="stat-label">严重薄弱点</div>
        </div>
      </div>
      
      <div class="stat-item warning">
        <div class="stat-icon">🟡</div>
        <div class="stat-content">
          <div class="stat-value">{{ mediumWeaknessCount }}</div>
          <div class="stat-label">需要加强</div>
        </div>
      </div>
      
      <div class="stat-item info">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <div class="stat-value">{{ avgMasteryLevel }}%</div>
          <div class="stat-label">平均掌握度</div>
        </div>
      </div>
      
      <div class="stat-item success">
        <div class="stat-icon">📚</div>
        <div class="stat-content">
          <div class="stat-value">{{ weakPoints.length }}</div>
          <div class="stat-label">待改进知识点</div>
        </div>
      </div>
    </div>

    <!-- 弱项列表 -->
    <div class="weakness-list">
      <h3 class="section-title">
        <el-icon><Warning /></el-icon>
        薄弱知识点分析
      </h3>
      
      <div class="weakness-cards">
        <div 
          v-for="weakness in weakPoints" 
          :key="weakness.id"
          class="weakness-card"
        >
          <div class="card-header">
            <div class="subject-badge" :style="{ backgroundColor: getSubjectColor(weakness.subject) }">
              {{ weakness.subject }}
            </div>
            <div class="weakness-badge" :style="{ backgroundColor: getWeaknessColor(weakness.weaknessLevel) }">
              {{ getWeaknessLabel(weakness.weaknessLevel) }}
            </div>
          </div>
          
          <div class="card-body">
            <div class="category">{{ weakness.category }}</div>
            <h4 class="topic">{{ weakness.topic }}</h4>
            
            <div class="mastery-section">
              <div class="mastery-header">
                <span>掌握程度</span>
                <span>{{ weakness.masteryLevel }}%</span>
              </div>
              <el-progress 
                :percentage="weakness.masteryLevel"
                :color="getWeaknessColor(weakness.weaknessLevel)"
                :stroke-width="10"
              />
            </div>
            
            <div class="meta-info">
              <span>上次学习：{{ weakness.lastStudied }}</span>
              <span>复习次数：{{ weakness.reviewCount }}</span>
            </div>
          </div>
          
          <div class="card-footer">
            <div class="suggestions">
              <h5>💡 改进建议：</h5>
              <ul>
                <li v-for="(suggestion, index) in weakness.suggestions" :key="index">
                  {{ suggestion }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习建议 -->
    <div class="learning-tips">
      <h4 class="tips-title">
        <el-icon><TrendCharts /></el-icon>
        针对性学习策略
      </h4>
      <div class="tips-grid">
        <div class="tip-card">
          <div class="tip-icon">🎯</div>
          <h5>优先攻克</h5>
          <p>先解决严重薄弱点，这些是提分的关键</p>
        </div>
        
        <div class="tip-card">
          <div class="tip-icon">🔄</div>
          <h5>循环复习</h5>
          <p>使用间隔重复法，定期回顾薄弱知识点</p>
        </div>
        
        <div class="tip-card">
          <div class="tip-icon">✍️</div>
          <h5>大量练习</h5>
          <p>通过做题巩固理解，发现新的盲点</p>
        </div>
        
        <div class="tip-card">
          <div class="tip-icon">📖</div>
          <h5>回归基础</h5>
          <p>薄弱往往源于基础不牢，重新学习概念</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weakness-analysis {
  max-width: 1000px;
  margin: 0 auto;
}

/* 概览统计 */
.overview-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.stat-item {
  background: white;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.stat-item.danger {
  border-left: 4px solid #F56C6C;
}

.stat-item.warning {
  border-left: 4px solid #E6A23C;
}

.stat-item.info {
  border-left: 4px solid #409EFF;
}

.stat-item.success {
  border-left: 4px solid #67C23A;
}

.stat-icon {
  font-size: 2.5em;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2em;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9em;
  color: #666;
}

/* 弱项列表 */
.weakness-list {
  margin-bottom: 30px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.4em;
  color: #333;
  margin-bottom: 20px;
}

.weakness-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.weakness-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.weakness-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  background: #f5f7fa;
}

.subject-badge, .weakness-badge {
  padding: 6px 15px;
  border-radius: 20px;
  color: white;
  font-size: 0.85em;
  font-weight: 600;
}

.card-body {
  padding: 20px;
}

.category {
  color: #999;
  font-size: 0.9em;
  margin-bottom: 8px;
}

.topic {
  font-size: 1.3em;
  color: #333;
  margin-bottom: 20px;
}

.mastery-section {
  margin-bottom: 15px;
}

.mastery-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.95em;
  color: #666;
}

.meta-info {
  display: flex;
  gap: 20px;
  color: #999;
  font-size: 0.9em;
}

.card-footer {
  padding: 20px;
  background: #fafafa;
  border-top: 1px solid #eee;
}

.suggestions h5 {
  color: #333;
  margin-bottom: 10px;
  font-size: 1em;
}

.suggestions ul {
  list-style: none;
  padding: 0;
}

.suggestions li {
  padding: 8px 0;
  color: #666;
  line-height: 1.6;
  position: relative;
  padding-left: 20px;
}

.suggestions li:before {
  content: "→";
  position: absolute;
  left: 0;
  color: #409EFF;
  font-weight: bold;
}

/* 学习建议 */
.learning-tips {
  background: linear-gradient(135deg, #eef3fa 0%, #dbe7f5 100%);
  border-radius: 15px;
  padding: 25px;
}

.tips-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2em;
  color: #333;
  margin-bottom: 20px;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.tip-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.tip-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.tip-icon {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.tip-card h5 {
  color: #333;
  margin-bottom: 8px;
  font-size: 1.1em;
}

.tip-card p {
  color: #666;
  font-size: 0.9em;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .overview-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .tips-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .overview-stats {
    grid-template-columns: 1fr;
  }
  
  .tips-grid {
    grid-template-columns: 1fr;
  }
}
</style>
