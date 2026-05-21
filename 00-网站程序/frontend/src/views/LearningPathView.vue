<script setup lang="ts">
import { ref } from 'vue'
import LearningPathVisualizer from '@/components/LearningPathVisualizer.vue'
import PersonalizedLearningPath from '@/components/PersonalizedLearningPath.vue'
import ReviewDashboard from '@/components/ReviewDashboard.vue'
import LearningAnalytics from '@/components/LearningAnalytics.vue'
import GamificationDashboard from '@/components/GamificationDashboard.vue'
import DailyPlanGenerator from '@/components/DailyPlanGenerator.vue'
import WeaknessAnalysis from '@/components/WeaknessAnalysis.vue'

const activeTab = ref('personalized')
</script>

<template>
  <div class="learning-path-page">
    <div class="page-header">
      <h1 class="page-title">个性化学习路径</h1>
      <p class="page-subtitle">智能规划，循序渐进，高效学习</p>
    </div>

    <div class="tab-navigation">
      <el-tabs v-model="activeTab" class="path-tabs">
        <el-tab-pane label="个性化路径" name="personalized">
          <PersonalizedLearningPath />
        </el-tab-pane>
        
        <el-tab-pane label="每日计划" name="daily-plan">
          <DailyPlanGenerator />
        </el-tab-pane>
        
        <el-tab-pane label="弱项分析" name="weakness">
          <WeaknessAnalysis />
        </el-tab-pane>
        
        <el-tab-pane label="路径可视化" name="visualizer">
          <LearningPathVisualizer />
        </el-tab-pane>
        
        <el-tab-pane label="复习提醒" name="review">
          <ReviewDashboard />
        </el-tab-pane>
        
        <el-tab-pane label="学习报告" name="report">
          <LearningAnalytics />
        </el-tab-pane>
        
        <el-tab-pane label="成就中心" name="gamification">
          <GamificationDashboard />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.learning-path-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px 0;
}

.page-title {
  font-size: 2.8em;
  color: white;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  font-weight: 700;
}

.page-subtitle {
  font-size: 1.3em;
  color: rgba(255, 255, 255, 0.9);
  opacity: 0.9;
  font-weight: 400;
}

.tab-navigation {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
}

.path-tabs :deep(.el-tabs__header) {
  margin-bottom: 30px;
}

.path-tabs :deep(.el-tabs__nav-wrap)::after {
  display: none;
}

.path-tabs :deep(.el-tabs__item) {
  font-size: 1.2em;
  font-weight: 500;
  padding: 0 30px;
  height: 60px;
  line-height: 60px;
  color: #666666;
}

.path-tabs :deep(.el-tabs__item.is-active) {
  color: #4CAF50;
  font-weight: 600;
}

.path-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, #FF6B6B 0%, #4CAF50 100%);
  height: 4px;
  border-radius: 2px;
}

.recommendation-content, .report-content {
  text-align: center;
  padding: 50px 20px;
  color: #666666;
}

.ai-illustration, .report-illustration {
  margin-bottom: 30px;
}

.recommendation-content h3, .report-content h3 {
  font-size: 2em;
  color: #333333;
  margin-bottom: 15px;
}

.recommendation-content p, .report-content p {
  font-size: 1.2em;
  margin-bottom: 40px;
  color: #666666;
}

.recommendation-features, .report-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.feature-card {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 15px;
  text-align: left;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.feature-card h4 {
  color: #333333;
  margin: 0 0 10px 0;
  font-size: 1.3em;
}

.feature-card p {
  color: #666666;
  margin: 0;
  font-size: 1em;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .learning-path-page {
    padding: 12px;
  }
  
  .page-header {
    margin-bottom: 30px;
    padding: 20px 0;
  }
  
  .page-title {
    font-size: 1.8em;
  }
  
  .page-subtitle {
    font-size: 1em;
  }
  
  .tab-navigation {
    padding: 15px;
    border-radius: 15px;
  }
  
  .path-tabs :deep(.el-tabs__header) {
    margin-bottom: 20px;
  }
  
  .path-tabs :deep(.el-tabs__item) {
    padding: 0 15px;
    font-size: 0.95em;
    height: 50px;
    line-height: 50px;
  }
  
  .recommendation-content, .report-content {
    padding: 30px 15px;
  }
  
  .recommendation-content h3, .report-content h3 {
    font-size: 1.6em;
  }
  
  .recommendation-content p, .report-content p {
    font-size: 1em;
    margin-bottom: 30px;
  }
  
  .recommendation-features, .report-features {
    grid-template-columns: 1fr;
    gap: 15px;
    margin-bottom: 30px;
  }
  
  .feature-card {
    flex-direction: column;
    text-align: center;
    gap: 12px;
    padding: 20px;
  }
  
  .feature-card h4 {
    font-size: 1.15em;
  }
  
  .feature-card p {
    font-size: 0.95em;
  }
}

@media (max-width: 480px) {
  .learning-path-page {
    padding: 8px;
  }
  
  .page-header {
    margin-bottom: 20px;
    padding: 15px 0;
  }
  
  .page-title {
    font-size: 1.5em;
  }
  
  .page-subtitle {
    font-size: 0.9em;
  }
  
  .tab-navigation {
    padding: 10px;
    border-radius: 12px;
  }
  
  .path-tabs :deep(.el-tabs__header) {
    margin-bottom: 15px;
  }
  
  .path-tabs :deep(.el-tabs__item) {
    padding: 0 10px;
    font-size: 0.85em;
    height: 45px;
    line-height: 45px;
  }
  
  .recommendation-content, .report-content {
    padding: 20px 10px;
  }
  
  .ai-illustration, .report-illustration {
    margin-bottom: 20px;
  }
  
  .ai-illustration .el-icon,
  .report-illustration .el-icon {
    font-size: 60px !important;
  }
  
  .recommendation-content h3, .report-content h3 {
    font-size: 1.3em;
    margin-bottom: 10px;
  }
  
  .recommendation-content p, .report-content p {
    font-size: 0.9em;
    margin-bottom: 20px;
  }
  
  .recommendation-features, .report-features {
    gap: 12px;
    margin-bottom: 20px;
  }
  
  .feature-card {
    padding: 15px;
    gap: 10px;
  }
  
  .feature-card h4 {
    font-size: 1.05em;
    margin-bottom: 8px;
  }
  
  .feature-card p {
    font-size: 0.9em;
    line-height: 1.5;
  }
  
  .feature-card .el-button {
    width: 100%;
  }
}
</style>