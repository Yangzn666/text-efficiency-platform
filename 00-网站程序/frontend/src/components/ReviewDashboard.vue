<script setup lang="ts">
import { computed } from 'vue'
import { useLearningPathStore } from '@/stores/learningPath'
import { ElMessage } from 'element-plus'
import { CircleCheck } from '@element-plus/icons-vue'

const learningPathStore = useLearningPathStore()

// 计算属性
const todayReviews = computed(() => learningPathStore.getTodayReviews())
const pendingReviews = computed(() => learningPathStore.getPendingReviews())
const weakPoints = computed(() => learningPathStore.getWeakKnowledgePoints(5))

// 方法
const handleCompleteReview = (knowledgePointId: string) => {
  const success = learningPathStore.completeReview(knowledgePointId)
  if (success) {
    ElMessage.success('复习完成！记忆保持率已更新')
  }
}

const getRetentionColor = (rate: number) => {
  if (rate >= 0.8) return '#4CAF50'
  if (rate >= 0.5) return '#FF9800'
  return '#FF6B6B'
}

const getRetentionText = (rate: number) => {
  return Math.round(rate * 100) + '%'
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'improving': return '📈'
    case 'declining': return '📉'
    default: return '➡️'
  }
}

const getTrendColor = (trend: string) => {
  switch (trend) {
    case 'improving': return '#4CAF50'
    case 'declining': return '#FF6B6B'
    default: return '#999'
  }
}
</script>

<template>
  <div class="review-dashboard">
    <!-- 今日复习 -->
    <div class="section-card" v-if="todayReviews.length > 0">
      <div class="section-header">
        <h3>📅 今日复习任务</h3>
        <el-tag type="danger" size="large">{{ todayReviews.length }}</el-tag>
      </div>
      
      <div class="review-list">
        <div 
          v-for="review in todayReviews" 
          :key="review.knowledgePointId"
          class="review-item today"
        >
          <div class="review-info">
            <div class="review-title">{{ review.knowledgePointName }}</div>
            <div class="review-meta">
              <span class="subject">{{ review.subject }}</span>
              <span class="date">学习于 {{ review.learnDate }}</span>
            </div>
          </div>
          
          <div class="review-actions">
            <div class="retention-badge" :style="{ color: getRetentionColor(review.retentionRate) }">
              记忆保持: {{ getRetentionText(review.retentionRate) }}
            </div>
            <el-button 
              type="primary" 
              size="small"
              @click="handleCompleteReview(review.knowledgePointId)"
            >
              完成复习
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 待复习列表 -->
    <div class="section-card" v-if="pendingReviews.length > 0">
      <div class="section-header">
        <h3>⏰ 待复习知识点</h3>
        <el-tag type="warning" size="large">{{ pendingReviews.length }}</el-tag>
      </div>
      
      <div class="review-list">
        <div 
          v-for="review in pendingReviews.slice(0, 5)" 
          :key="review.knowledgePointId"
          class="review-item"
          :class="{ overdue: review.status === 'overdue' }"
        >
          <div class="review-info">
            <div class="review-title">{{ review.knowledgePointName }}</div>
            <div class="review-meta">
              <span class="subject">{{ review.subject }}</span>
              <span class="next-date">下次复习: {{ review.nextReviewDate }}</span>
              <span v-if="review.status === 'overdue'" class="overdue-tag">已过期</span>
            </div>
          </div>
          
          <div class="progress-info">
            <span>进度: {{ review.completedReviews }}/{{ review.reviewDates.length }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 薄弱知识点 -->
    <div class="section-card" v-if="weakPoints.length > 0">
      <div class="section-header">
        <h3>⚠️ 需要加强的知识点</h3>
      </div>
      
      <div class="weak-points-list">
        <div 
          v-for="point in weakPoints" 
          :key="point.knowledgePointId"
          class="weak-point-item"
        >
          <div class="point-header">
            <span class="point-name">{{ point.knowledgePointName }}</span>
            <span class="trend-icon" :style="{ color: getTrendColor(point.trend) }">
              {{ getTrendIcon(point.trend) }}
            </span>
          </div>
          
          <div class="point-stats">
            <div class="mastery-bar">
              <div 
                class="mastery-fill" 
                :style="{ 
                  width: point.masteryScore + '%',
                  background: point.masteryScore >= 60 ? '#4CAF50' : '#FF6B6B'
                }"
              ></div>
            </div>
            <span class="mastery-score">{{ point.masteryScore }}分</span>
          </div>
          
          <div class="point-meta">
            <span>学习次数: {{ point.studyCount }}</span>
            <span v-if="point.testScores.length > 0">
              测试次数: {{ point.testScores.length }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="todayReviews.length === 0 && pendingReviews.length === 0 && weakPoints.length === 0" class="empty-state">
      <el-icon :size="60" color="#ccc"><CircleCheck /></el-icon>
      <p>太棒了！暂无复习任务和薄弱知识点</p>
      <p class="hint">继续学习新内容，系统会自动生成复习计划</p>
    </div>
  </div>
</template>

<style scoped>
.review-dashboard {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 1.3em;
  color: #333;
  margin: 0;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.review-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #2196F3;
  transition: all 0.3s ease;
}

.review-item.today {
  border-left-color: #4CAF50;
  background: #f1f8f4;
}

.review-item.overdue {
  border-left-color: #FF6B6B;
  background: #fff5f5;
}

.review-info {
  flex: 1;
}

.review-title {
  font-size: 1.05em;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.review-meta {
  display: flex;
  gap: 15px;
  font-size: 0.85em;
  color: #666;
}

.overdue-tag {
  color: #FF6B6B;
  font-weight: 600;
}

.review-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.retention-badge {
  font-size: 0.9em;
  font-weight: 600;
}

.progress-info {
  font-size: 0.85em;
  color: #666;
}

.weak-points-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.weak-point-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
}

.point-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.point-name {
  font-weight: 600;
  color: #333;
  font-size: 1em;
}

.trend-icon {
  font-size: 1.3em;
}

.point-stats {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.mastery-bar {
  flex: 1;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.mastery-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.mastery-score {
  font-weight: 600;
  color: #333;
  min-width: 50px;
  text-align: right;
}

.point-meta {
  display: flex;
  gap: 15px;
  font-size: 0.85em;
  color: #666;
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
  
  .review-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .review-actions {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  }
  
  .review-meta {
    flex-direction: column;
    gap: 5px;
  }
}

@media (max-width: 480px) {
  .section-card {
    padding: 15px;
  }
  
  .section-header h3 {
    font-size: 1.15em;
  }
  
  .review-title {
    font-size: 0.95em;
  }
  
  .review-meta {
    font-size: 0.8em;
  }
  
  .point-name {
    font-size: 0.95em;
  }
}
</style>
