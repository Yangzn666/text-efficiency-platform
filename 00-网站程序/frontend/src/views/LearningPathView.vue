<script setup lang="ts">
import { ref } from 'vue'
import LearningPathVisualizer from '@/components/LearningPathVisualizer.vue'

const activeTab = ref('visualizer')
</script>

<template>
  <div class="learning-path-page">
    <div class="page-header">
      <h1 class="page-title">个性化学习路径</h1>
      <p class="page-subtitle">智能规划，循序渐进，高效学习</p>
    </div>

    <div class="tab-navigation">
      <el-tabs v-model="activeTab" class="path-tabs">
        <el-tab-pane label="路径可视化" name="visualizer">
          <LearningPathVisualizer />
        </el-tab-pane>
        
        <el-tab-pane label="智能推荐" name="recommendation">
          <div class="recommendation-content">
            <div class="ai-illustration">
              <el-icon size="80" color="#4CAF50"><MagicStick /></el-icon>
            </div>
            <h3>🤖 智能学习推荐</h3>
            <p>基于您的学习情况和进度，提供个性化学习建议</p>
            
            <div class="recommendation-features">
              <div class="feature-card">
                <el-icon size="24" color="#FF6B6B"><TrendCharts /></el-icon>
                <div>
                  <h4>进度分析</h4>
                  <p>深度分析学习进度，识别薄弱环节</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#4CAF50"><Lightning /></el-icon>
                <div>
                  <h4>优化建议</h4>
                  <p>根据遗忘曲线调整复习计划</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#2196F3"><Target /></el-icon>
                <div>
                  <h4>目标规划</h4>
                  <p>制定科学合理的阶段性目标</p>
                </div>
              </div>
            </div>
            
            <el-button type="primary" size="large" disabled>
              智能推荐系统开发中...
            </el-button>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="学习报告" name="report">
          <div class="report-content">
            <div class="report-illustration">
              <el-icon size="80" color="#FF9800"><DataAnalysis /></el-icon>
            </div>
            <h3>📊 学习数据分析</h3>
            <p>全面了解学习情况，发现提升空间</p>
            
            <div class="report-features">
              <div class="feature-card">
                <el-icon size="24" color="#9C27B0"><PieChart /></el-icon>
                <div>
                  <h4>时间分布</h4>
                  <p>各科目学习时间占比分析</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#E91E63"><BarChart /></el-icon>
                <div>
                  <h4>效率趋势</h4>
                  <p>学习效率变化趋势图表</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#00BCD4"><Calendar /></el-icon>
                <div>
                  <h4>习惯分析</h4>
                  <p>学习时间规律和习惯分析</p>
                </div>
              </div>
            </div>
            
            <el-button type="primary" size="large" disabled>
              学习报告系统开发中...
            </el-button>
          </div>
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
  
  .page-title {
    font-size: 1.8em;
  }
  
  .page-subtitle {
    font-size: 1em;
  }
  
  .tab-navigation {
    padding: 15px;
  }
  
  .recommendation-features, .report-features {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .feature-card {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .path-tabs :deep(.el-tabs__item) {
    padding: 0 12px;
    font-size: 0.9em;
  }
}
</style>