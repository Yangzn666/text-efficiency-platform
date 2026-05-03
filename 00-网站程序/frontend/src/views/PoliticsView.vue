<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
// 使用动态导入解决TypeScript默认导出识别问题
const CurrentAffairs = defineAsyncComponent(() => import('@/components/PlaceholderComponent.vue'))
const PoliticalPoints = defineAsyncComponent(() => import('@/components/PlaceholderComponent.vue'))
const KnowledgeStructure = defineAsyncComponent(() => import('@/components/KnowledgeStructure.vue'))

const activeTab = ref('knowledge')
</script>

<template>
  <div class="politics-container">
    <div class="page-header">
      <h1 class="page-title">政治学习系统</h1>
      <p class="page-subtitle">时政热点 · 考点梳理 · 知识关联 · 模拟练习</p>
    </div>

    <div class="tab-navigation">
      <el-tabs v-model="activeTab" class="politics-tabs">
        <el-tab-pane label="知识点梳理" name="knowledge">
          <KnowledgeStructure subject="politics" />
        </el-tab-pane>
        
        <el-tab-pane label="时政热点" name="affairs">
          <CurrentAffairs />
        </el-tab-pane>
        
        <el-tab-pane label="考点关联" name="points">
          <PoliticalPoints />
        </el-tab-pane>
        
        <el-tab-pane label="知识结构" name="structure">
          <div class="structure-content">
            <div class="structure-illustration">
              <el-icon size="80" color="#2196F3"><Connection /></el-icon>
            </div>
            <h3>🧠 知识结构可视化</h3>
            <p>构建政治知识体系，理清概念间的关系</p>
            
            <div class="structure-features">
              <div class="feature-card">
                <el-icon size="24" color="#FF6B6B"><DataAnalysis /></el-icon>
                <div>
                  <h4>知识图谱构建</h4>
                  <p>可视化展示知识点之间的逻辑关系</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#4CAF50"><Cpu /></el-icon>
                <div>
                  <h4>智能关联分析</h4>
                  <p>自动识别和建立知识点间的联系</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#FF9800"><Lightning /></el-icon>
                <div>
                  <h4>学习路径优化</h4>
                  <p>基于知识结构推荐最优学习顺序</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#9C27B0"><Collection /></el-icon>
                <div>
                  <h4>记忆强化系统</h4>
                  <p>通过结构化学习加深理解和记忆</p>
                </div>
              </div>
            </div>
            
            <el-button type="primary" size="large" @click="activeTab = 'knowledge'">
              <el-icon><Collection /></el-icon>
              前往知识点梳理
            </el-button>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="模拟练习" name="practice">
          <div class="practice-content">
            <div class="practice-illustration">
              <el-icon size="80" color="#FF9800"><EditPen /></el-icon>
            </div>
            <h3>📝 模拟试题练习</h3>
            <p>海量政治模拟题，在线练习和智能批改</p>
            
            <div class="practice-features">
              <div class="feature-card">
                <el-icon size="24" color="#FF6B6B"><Document /></el-icon>
                <div>
                  <h4>全题型覆盖</h4>
                  <p>单选、多选、简答、论述题全面练习</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#4CAF50"><DataLine /></el-icon>
                <div>
                  <h4>智能评分系统</h4>
                  <p>AI辅助批改和详细答案解析</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#2196F3"><TrendCharts /></el-icon>
                <div>
                  <h4>成绩统计分析</h4>
                  <p>练习成绩趋势和薄弱环节分析</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#9C27B0"><MagicStaff /></el-icon>
                <div>
                  <h4>错题巩固训练</h4>
                  <p>针对性错题练习和知识点强化</p>
                </div>
              </div>
            </div>
            
            <el-button type="primary" size="large" @click="activeTab = 'knowledge'">
              <el-icon><Collection /></el-icon>
              前往知识点梳理
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.politics-container {
  max-width: 3000px; /* 统一增加容器宽度 */
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 25px rgba(33, 150, 243, 0.15);
  border: 2px solid #2196F3;
  text-align: center;
}

.page-title {
  font-size: 2.2em;
  color: #1976D2;
  margin-bottom: 10px;
  font-weight: 700;
}

.page-subtitle {
  font-size: 1.2em;
  color: #424242;
  font-weight: 500;
}

.tab-navigation {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.politics-tabs :deep(.el-tabs__header) {
  margin-bottom: 25px;
}

.politics-tabs :deep(.el-tabs__nav-wrap)::after {
  display: none;
}

.politics-tabs :deep(.el-tabs__item) {
  font-size: 1.1em;
  font-weight: 500;
  padding: 0 25px;
  height: 50px;
  line-height: 50px;
  color: #666;
}

.politics-tabs :deep(.el-tabs__item.is-active) {
  color: #2196F3;
  font-weight: 600;
}

.politics-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, #2196F3, #64B5F6);
  height: 3px;
  border-radius: 2px;
}

.structure-content, .practice-content {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.structure-illustration, .practice-illustration {
  margin-bottom: 25px;
}

.structure-content h3, .practice-content h3 {
  font-size: 1.8em;
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
}

.structure-content p, .practice-content p {
  font-size: 1.1em;
  margin-bottom: 30px;
  color: #666;
  line-height: 1.6;
}

.structure-features, .practice-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.feature-card {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  text-align: left;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
  border-color: #2196F3;
}

.feature-card h4 {
  color: #333;
  margin: 0 0 8px 0;
  font-size: 1.1em;
  font-weight: 600;
}

.feature-card p {
  color: #666;
  margin: 0;
  font-size: 0.95em;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .politics-container {
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
  
  .structure-features, .practice-features {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .feature-card {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .politics-tabs :deep(.el-tabs__item) {
    padding: 0 12px;
    font-size: 0.9em;
  }
}
</style>
