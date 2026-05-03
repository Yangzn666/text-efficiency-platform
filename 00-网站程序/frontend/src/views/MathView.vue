<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DependencyGraph from '@/components/DependencyGraph.vue'
import WrongProblemAnalysis from '@/components/WrongProblemAnalysis.vue'
import KnowledgeStructure from '@/components/KnowledgeStructure.vue'
import MathPracticeModule from '@/components/MathPracticeModule.vue'
import MathProgressTracker from '@/components/MathProgressTracker.vue'

const router = useRouter()
const activeTab = ref('knowledge')

const openCompleteWebsite = () => {
  // 打开本地高等数学网站
  const websiteUrl = 'file:///D:/学习/数学/高数基础知识/index.html'
  console.log('尝试打开URL:', websiteUrl)
  try {
    const newWindow = window.open(websiteUrl, '_blank')
    if (!newWindow) {
      alert('弹窗被浏览器阻止，请允许弹窗或手动复制以下地址到浏览器：\n' + websiteUrl)
    }
  } catch (error) {
    console.error('打开链接失败:', error)
    alert('打开链接失败，请检查文件路径是否正确')
  }
}

const openMindmapWebsite = () => {
  // 打开本地高数思维导图
  const mindmapUrl = 'file:///D:/学习/数学/高等数学知识点思维导图.html'
  console.log('尝试打开URL:', mindmapUrl)
  try {
    const newWindow = window.open(mindmapUrl, '_blank')
    if (!newWindow) {
      alert('弹窗被浏览器阻止，请允许弹窗或手动复制以下地址到浏览器：\n' + mindmapUrl)
    }
  } catch (error) {
    console.error('打开链接失败:', error)
    alert('打开链接失败，请检查文件路径是否正确')
  }
}

const openLinearAlgebraSystem = () => {
  // 打开本地线性代数学习系统
  const linearAlgebraUrl = 'file:///D:/学习/线代/线性代数考研巩固项目/线性代数学习系统.html'
  console.log('尝试打开URL:', linearAlgebraUrl)
  try {
    const newWindow = window.open(linearAlgebraUrl, '_blank')
    if (!newWindow) {
      alert('弹窗被浏览器阻止，请允许弹窗或手动复制以下地址到浏览器：\n' + linearAlgebraUrl)
    }
  } catch (error) {
    console.error('打开链接失败:', error)
    alert('打开链接失败，请检查文件路径是否正确')
  }
}
</script>

<template>
  <div class="math-container">
    <div class="page-header">
      <h1 class="page-title">数学一学习系统</h1>
      <p class="page-subtitle">高等数学 · 线性代数 · 概率统计</p>
      <div class="navigation-links">
        <el-button type="primary" plain @click="router.push('/math')">
          <el-icon><House /></el-icon>
          返回数学一首页
        </el-button>
        <el-button type="success" plain @click="router.push('/')">
          <el-icon><HomeFilled /></el-icon>
          返回网站主页
        </el-button>
      </div>
    </div>

    <div class="tab-navigation">
      <el-tabs v-model="activeTab" class="math-tabs">
        <el-tab-pane label="知识点梳理" name="knowledge">
          <KnowledgeStructure subject="math" />
        </el-tab-pane>
        
        <el-tab-pane label="错题分析" name="wrong">
          <WrongProblemAnalysis />
        </el-tab-pane>
        
        <el-tab-pane label="专项练习" name="practice">
          <MathPracticeModule />
        </el-tab-pane>
        
        <el-tab-pane label="完整复习" name="completeReview">
          <div class="review-content">
            <div class="review-illustration">
              <el-icon size="80" color="#4CAF50"><Reading /></el-icon>
            </div>
            <h3>📚 完整知识点复习</h3>
            <p>访问完整的高等数学知识体系，系统化复习所有核心概念</p>
            
            <div class="review-features">
              <div class="feature-card">
                <el-icon size="24" color="#2196F3"><Document /></el-icon>
                <div>
                  <h4>系统化知识</h4>
                  <p>涵盖18个完整章节的详细知识点</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#FF9800"><EditPen /></el-icon>
                <div>
                  <h4>丰富例题</h4>
                  <p>大量典型例题和详细解题过程</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#9C27B0"><DataAnalysis /></el-icon>
                <div>
                  <h4>思维导图</h4>
                  <p>可视化的知识结构和逻辑关系</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#4CAF50"><SetUp /></el-icon>
                <div>
                  <h4>交互学习</h4>
                  <p>可折叠的内容结构，按需查看</p>
                </div>
              </div>
            </div>
            
            <div class="comprehensive-review">
              <h4>🧭 综合复习资源中心</h4>
              <div class="resource-grid">
                <div class="resource-card">
                  <el-icon size="32" color="#2196F3"><Connection /></el-icon>
                  <h5>章节依赖图</h5>
                  <p>查看知识点间的逻辑关系和前置要求</p>
                  <el-button type="primary" size="small" @click="activeTab = 'graph'">
                    前往查看
                  </el-button>
                </div>
                
                <div class="resource-card">
                  <el-icon size="32" color="#9C27B0"><DataAnalysis /></el-icon>
                  <h5>高数思维导图</h5>
                  <p>可视化高等数学知识体系结构</p>
                  <el-button type="primary" size="small" @click="openMindmapWebsite">
                    查看导图
                  </el-button>
                </div>
                
                <div class="resource-card">
                  <el-icon size="32" color="#4CAF50"><Grid /></el-icon>
                  <h5>线性代数系统</h5>
                  <p>专项学习线性代数核心知识点</p>
                  <el-button type="primary" size="small" @click="openLinearAlgebraSystem">
                    进入学习
                  </el-button>
                </div>
                
                <div class="resource-card">
                  <el-icon size="32" color="#FF9800"><TrendCharts /></el-icon>
                  <h5>学习进度追踪</h5>
                  <p>实时掌握各章节学习完成情况</p>
                  <el-button type="primary" size="small" @click="activeTab = 'progress'">
                    查看进度
                  </el-button>
                </div>
              </div>
            </div>
            
            <el-button type="success" size="large" @click="openCompleteWebsite">
              <el-icon><Link /></el-icon>
              前往完整高等数学网站
            </el-button>
            
            <div class="website-info">
              <p>💡 提示：这将打开本地文件，建议在电脑上使用</p>
              <p class="file-path">文件路径：D:/学习/数学/高数基础知识/index.html</p>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="线性代数学习系统" name="linearAlgebraSystem">
          <div class="linear-algebra-content">
            <div class="linear-algebra-illustration">
              <el-icon size="80" color="#2196F3"><Grid /></el-icon>
            </div>
            <h3>🔢 线性代数专项学习系统</h3>
            <p>专为考研数学一线性代数打造的完整学习平台</p>
            
            <div class="linear-algebra-features">
              <div class="feature-card">
                <el-icon size="24" color="#4CAF50"><Files /></el-icon>
                <div>
                  <h4>系统化知识</h4>
                  <p>涵盖行列式、矩阵、向量等核心章节</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#FF9800"><EditPen /></el-icon>
                <div>
                  <h4>专项练习</h4>
                  <p>针对性的题库和解题训练</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#9C27B0"><DataAnalysis /></el-icon>
                <div>
                  <h4>智能分析</h4>
                  <p>错题分析和薄弱环节诊断</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#2196F3"><TrendCharts /></el-icon>
                <div>
                  <h4>进度追踪</h4>
                  <p>实时掌握学习进展和掌握情况</p>
                </div>
              </div>
            </div>
            
            <el-button type="primary" size="large" @click="openLinearAlgebraSystem">
              <el-icon><Link /></el-icon>
              进入线性代数学习系统
            </el-button>
            
            <div class="website-info">
              <p>💡 提示：这将打开本地线性代数学习系统，建议在电脑上使用</p>
              <p class="file-path">文件路径：D:/学习/线代/线性代数考研巩固项目/线性代数学习系统.html</p>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="学习进度" name="progress">
          <MathProgressTracker />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

.navigation-links {
  margin-top: 20px;
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

<style scoped>
/* 数学一页面整体样式 */
.math-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.page-header {
  text-align: center;
  padding: 40px 0 30px;
  background: linear-gradient(135deg, #2196F3 0%, #64B5F6 100%);
  color: white;
  border-radius: 20px 20px 0 0;
  margin-bottom: 30px;
}

.page-title {
  font-size: 2.5em;
  margin-bottom: 15px;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.page-subtitle {
  font-size: 1.3em;
  opacity: 0.9;
  font-weight: 400;
}

.tab-navigation {
  margin-bottom: 40px;
}

.math-tabs {
  --el-tabs-header-height: 56px;
  --el-tabs-header-border-color: #e0e0e0;
  --el-tabs-header-item-active-color: #2196F3;
  --el-tabs-header-item-hover-color: #2196F3;
}

.review-content {
  padding: 30px;
  background: #f8f9fa;
  border-radius: 16px;
  margin-bottom: 30px;
}

.review-illustration {
  text-align: center;
  margin-bottom: 25px;
}

.review-illustration .el-icon {
  margin-bottom: 20px;
}

.review-illustration h3 {
  font-size: 1.8em;
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
}

.review-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 25px;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.feature-card h4 {
  font-size: 1.2em;
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
}

.feature-card p {
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.comprehensive-review {
  margin-top: 40px;
}

.comprehensive-review h4 {
  font-size: 1.5em;
  color: #2196F3;
  margin-bottom: 20px;
  font-weight: 600;
  position: relative;
}

.comprehensive-review h4::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #2196F3, #64B5F6);
  border-radius: 2px;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.resource-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: all 0.3s ease;
}

.resource-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.resource-card h5 {
  font-size: 1.2em;
  color: #333;
  margin-bottom: 12px;
  font-weight: 600;
}

.resource-card p {
  color: #666;
  margin-bottom: 16px;
  line-height: 1.5;
}

.website-info {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  text-align: center;
}

.file-path {
  color: #999;
  font-size: 0.9em;
  margin-top: 10px;
  font-family: monospace;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .math-container {
    padding: 0 12px;
  }
  
  .page-title {
    font-size: 1.8em;
  }
  
  .review-features {
    grid-template-columns: 1fr;
  }
  
  .resource-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header {
    padding: 25px 0 15px;
    border-radius: 12px 12px 0 0;
  }
}
.math-container {
  max-width: 3000px; /* 统一增加容器宽度 */
  margin: 0 auto;
  padding: 0px; /* 极致减少数学页面页边距至1/4 */
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

.math-tabs :deep(.el-tabs__header) {
  margin-bottom: 30px;
}

.math-tabs :deep(.el-tabs__nav-wrap)::after {
  display: none;
}

.math-tabs :deep(.el-tabs__item) {
  font-size: 1.2em;
  font-weight: 500;
  padding: 0 30px;
  height: 60px;
  line-height: 60px;
  color: #666666;
}

.math-tabs :deep(.el-tabs__item.is-active) {
  color: #FF9800;
  font-weight: 600;
}

.math-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, #FF6B6B 0%, #4CAF50 100%);
  height: 4px;
  border-radius: 2px;
}

.formulas-content {
  text-align: center;
  padding: 50px 20px;
  color: #666666;
}

.formulas-illustration {
  margin-bottom: 30px;
}

.formulas-content h3 {
  font-size: 2em;
  color: #333333;
  margin-bottom: 15px;
}

.formulas-content p {
  font-size: 1.2em;
  margin-bottom: 40px;
  color: #666666;
}

.formulas-features {
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

.review-content {
  text-align: center;
  padding: 50px 20px;
  color: #666666;
}

.review-illustration {
  margin-bottom: 30px;
}

.review-content h3 {
  font-size: 2em;
  color: #333333;
  margin-bottom: 15px;
}

.review-content p {
  font-size: 1.2em;
  margin-bottom: 40px;
  color: #666666;
}

.review-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.comprehensive-review {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 15px;
  margin: 30px 0;
}

.comprehensive-review h4 {
  text-align: center;
  color: #333;
  margin-bottom: 25px;
  font-size: 1.4rem;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.resource-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.resource-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.resource-card h5 {
  color: #333;
  margin: 15px 0 10px;
  font-size: 1.1rem;
}

.resource-card p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 20px;
  line-height: 1.5;
}

.website-info {
  margin-top: 30px;
  padding: 20px;
  background: #f0f8ff;
  border-radius: 12px;
  border-left: 4px solid #4CAF50;
}

.website-info p {
  margin: 10px 0;
  font-size: 1em;
  color: #555;
}

.file-path {
  font-family: 'Courier New', monospace;
  background: #e8f5e8;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.9em;
  color: #2e7d32;
}

.mindmap-content {
  text-align: center;
  padding: 50px 20px;
  color: #666666;
}

.mindmap-illustration {
  margin-bottom: 30px;
}

.mindmap-content h3 {
  font-size: 2em;
  color: #333333;
  margin-bottom: 15px;
}

.mindmap-content p {
  font-size: 1.2em;
  margin-bottom: 40px;
  color: #666666;
}

.mindmap-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}


/* 鍝嶅簲寮忚�璁?*/
@media (max-width: 768px) {
  .math-container {
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
  
  .formulas-features {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .feature-card {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .math-tabs :deep(.el-tabs__item) {
    padding: 0 15px;
    font-size: 1em;
  }
}
</style>
