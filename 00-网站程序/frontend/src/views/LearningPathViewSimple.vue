<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('overview')
const selectedSubject = ref('')
const subjects = ref(['408计算机科学综合', '数学一', '英语一', '政治'])

const createLearningPath = () => {
  if (!selectedSubject.value) {
    ElMessage.warning('请选择学习科目')
    return
  }
  ElMessage.success(`${selectedSubject.value}学习路径创建成功！`)
}

const startLearning = () => {
  ElMessage.success('开始学习之旅！')
}
</script>

<template>
  <div class="learning-path-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">学习计划</h1>
      <p class="page-subtitle">制定个性化的学习路径，科学规划备考进度</p>
    </div>

    <!-- 标签页导航 -->
    <div class="tab-navigation">
      <el-tabs v-model="activeTab" class="path-tabs">
        <el-tab-pane label="学习概览" name="overview">
          <div class="overview-content">
            <div class="overview-cards">
              <div class="stat-card">
                <div class="stat-icon">📚</div>
                <div class="stat-info">
                  <div class="stat-number">4</div>
                  <div class="stat-label">学习科目</div>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">⏱️</div>
                <div class="stat-info">
                  <div class="stat-number">120</div>
                  <div class="stat-label">总学习天数</div>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">🎯</div>
                <div class="stat-info">
                  <div class="stat-number">65%</div>
                  <div class="stat-label">整体进度</div>
                </div>
              </div>
            </div>

            <div class="subject-selector">
              <h3>选择学习科目</h3>
              <div class="selector-controls">
                <el-select 
                  v-model="selectedSubject" 
                  placeholder="请选择要学习的科目"
                  size="large"
                  class="subject-select"
                >
                  <el-option
                    v-for="subject in subjects"
                    :key="subject"
                    :label="subject"
                    :value="subject"
                  />
                </el-select>
                
                <el-button 
                  type="primary" 
                  size="large"
                  @click="createLearningPath"
                >
                  <el-icon><Plus /></el-icon>
                  创建学习路径
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="进度追踪" name="progress">
          <div class="progress-content">
            <div class="progress-illustration">
              <el-icon size="80" color="#4CAF50"><DataAnalysis /></el-icon>
            </div>
            <h3>📊 学习进度追踪</h3>
            <p>实时监控各科目学习进度，及时调整学习策略</p>
            
            <div class="progress-features">
              <div class="feature-card">
                <el-icon size="24" color="#FF6B6B"><TrendCharts /></el-icon>
                <div>
                  <h4>进度可视化</h4>
                  <p>直观展示各科目学习完成情况</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#4CAF50"><Lightning /></el-icon>
                <div>
                  <h4>智能提醒</h4>
                  <p>根据遗忘曲线提醒复习时间</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#2196F3"><Target /></el-icon>
                <div>
                  <h4>目标设定</h4>
                  <p>制定阶段性学习目标</p>
                </div>
              </div>
            </div>
            
            <el-button type="primary" size="large" @click="startLearning">
              开始学习
            </el-button>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="周计划" name="weekly">
          <div class="weekly-content">
            <div class="weekly-illustration">
              <el-icon size="80" color="#FF9800"><Calendar /></el-icon>
            </div>
            <h3>📅 每周学习计划</h3>
            <p>科学安排每周学习任务，提高学习效率</p>
            
            <div class="weekly-features">
              <div class="feature-card">
                <el-icon size="24" color="#9C27B0"><Document /></el-icon>
                <div>
                  <h4>任务分解</h4>
                  <p>将大目标分解为每日小任务</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#E91E63"><PieChart /></el-icon>
                <div>
                  <h4>时间分配</h4>
                  <p>合理分配各科目学习时间</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#00BCD4"><Setting /></el-icon>
                <div>
                  <h4>灵活调整</h4>
                  <p>根据实际情况动态调整计划</p>
                </div>
              </div>
            </div>
            
            <el-button type="primary" size="large" disabled>
              周计划功能开发中...
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.learning-path-container {
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

/* 概览内容样式 */
.overview-content {
  text-align: center;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 15px;
  text-align: left;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.stat-icon {
  font-size: 2.5em;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 2em;
  font-weight: 700;
  color: #333333;
  margin-bottom: 5px;
}

.stat-label {
  color: #666666;
  font-size: 1.1em;
}

.subject-selector {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.subject-selector h3 {
  color: #333333;
  font-size: 1.8em;
  margin-bottom: 30px;
}

.selector-controls {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.subject-select {
  width: 300px;
}

/* 进度和周计划内容样式 */
.progress-content, .weekly-content {
  text-align: center;
  padding: 50px 20px;
  color: #666666;
}

.progress-illustration, .weekly-illustration {
  margin-bottom: 30px;
}

.progress-content h3, .weekly-content h3 {
  font-size: 2em;
  color: #333333;
  margin-bottom: 15px;
}

.progress-content p, .weekly-content p {
  font-size: 1.2em;
  margin-bottom: 40px;
  color: #666666;
}

.progress-features, .weekly-features {
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
  .learning-path-container {
    padding: 15px;
  }
  
  .page-title {
    font-size: 2.2em;
  }
  
  .page-subtitle {
    font-size: 1.1em;
  }
  
  .tab-navigation {
    padding: 20px;
  }
  
  .overview-cards {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .selector-controls {
    flex-direction: column;
  }
  
  .subject-select {
    width: 100%;
  }
  
  .progress-features, .weekly-features {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .feature-card {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .path-tabs :deep(.el-tabs__item) {
    padding: 0 15px;
    font-size: 1em;
  }
}
</style>