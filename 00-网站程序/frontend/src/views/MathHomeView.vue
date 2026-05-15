<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  Document, 
  EditPen, 
  DataAnalysis, 
  Grid, 
  Connection,
  TrendCharts,
  Link,
  Reading
} from '@element-plus/icons-vue'
import { useStudyStore } from '@/stores/study'

const router = useRouter()
const studyStore = useStudyStore()

// 数学一学习进度数据
const mathProgress = ref({
  totalHours: 136,
  goalHours: 160,
  completedLessons: ['第1讲', '第2讲', '第3讲', '第4讲', '第5讲', '第6讲', '第7讲', '第8讲', '第9讲', '第10讲', '第11讲', '第12讲', '第13讲', '第14讲', '第15讲'],
  currentChapter: '第15讲',
  weeklyStudyTime: 15,
  streakDays: 12
})

onMounted(async () => {
  try {
    await studyStore.initializeStudyData()
    console.log('数学一首页数据加载完成')
  } catch (error) {
    console.error('加载数学一首页数据失败:', error)
  }
})

const openCompleteWebsite = () => {
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

// 计算进度百分比
const progressPercentage = computed(() => {
  return Math.round((mathProgress.value.totalHours / mathProgress.value.goalHours) * 100)
})
</script>

<template>
  <div class="math-home-container">
    <!-- 顶部进度概览 -->
    <div class="progress-overview">
      <div class="overview-header">
        <h1 class="page-title">📚 数学一学习进度</h1>
        <p class="page-subtitle">课后习题14-15讲已完成 · 总体进度{{ progressPercentage }}%</p>
        <div class="quick-nav">
          <el-button type="success" plain @click="router.push('/')">
            <el-icon><HomeFilled /></el-icon>
            返回网站主页
          </el-button>
        </div>
      </div>
      
      <div class="progress-stats">
        <div class="stat-card">
          <div class="stat-number">{{ mathProgress.totalHours }}</div>
          <div class="stat-label">已完成小时</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ mathProgress.goalHours - mathProgress.totalHours }}</div>
          <div class="stat-label">剩余小时</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ mathProgress.streakDays }}</div>
          <div class="stat-label">连续学习天数</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ mathProgress.weeklyStudyTime }}</div>
          <div class="stat-label">本周学习(小时)</div>
        </div>
      </div>
      
      <div class="main-progress">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <div class="progress-text">
          {{ mathProgress.totalHours }} / {{ mathProgress.goalHours }} 小时
        </div>
      </div>
    </div>

    <!-- 学习模块导航 -->
    <div class="modules-section">
      <h2 class="section-title">🎯 学习模块导航</h2>
      <div class="modules-grid">
        <div class="module-card" @click="router.push('/math/knowledge')">
          <div class="module-icon">
            <el-icon size="32" color="#2196F3"><Document /></el-icon>
          </div>
          <h3>知识点梳理</h3>
          <p>系统化复习高等数学核心概念</p>
          <div class="module-status completed">已完成15讲</div>
        </div>
        
        <div class="module-card" @click="router.push('/math/wrong')">
          <div class="module-icon">
            <el-icon size="32" color="#FF6B6B"><EditPen /></el-icon>
          </div>
          <h3>错题分析</h3>
          <p>深入分析典型错误和解题思路</p>
          <div class="module-status">进行中</div>
        </div>
        
        <div class="module-card" @click="router.push('/math/practice')">
          <div class="module-icon">
            <el-icon size="32" color="#4CAF50"><DataAnalysis /></el-icon>
          </div>
          <h3>专项练习</h3>
          <p>针对薄弱环节的强化训练</p>
          <div class="module-status">待开始</div>
        </div>
        
        <div class="module-card" @click="router.push('/math/graph')">
          <div class="module-icon">
            <el-icon size="32" color="#9C27B0"><Connection /></el-icon>
          </div>
          <h3>章节依赖图</h3>
          <p>可视化知识点逻辑关系</p>
          <div class="module-status">辅助工具</div>
        </div>
        
        <div class="module-card" @click="openCompleteWebsite">
          <div class="module-icon">
            <el-icon size="32" color="#FF9800"><Reading /></el-icon>
          </div>
          <h3>完整复习系统</h3>
          <p>访问本地高等数学完整知识体系</p>
          <div class="module-status external">外部链接</div>
        </div>
        
        <div class="module-card" @click="openMindmapWebsite">
          <div class="module-icon">
            <el-icon size="32" color="#607D8B"><TrendCharts /></el-icon>
          </div>
          <h3>高数思维导图</h3>
          <p>可视化高等数学知识结构</p>
          <div class="module-status external">外部链接</div>
        </div>
      </div>
    </div>

    <!-- 学习资源中心 -->
    <div class="resources-section">
      <h2 class="section-title">🧭 学习资源中心</h2>
      <div class="resources-grid">
        <div class="resource-card">
          <el-icon size="24" color="#2196F3"><Grid /></el-icon>
          <div class="resource-info">
            <h4>线性代数学习系统</h4>
            <p>专项学习线性代数核心知识点</p>
            <el-button type="primary" size="small" @click="openLinearAlgebraSystem">
              进入学习
            </el-button>
          </div>
        </div>
        
        <div class="resource-card">
          <el-icon size="24" color="#4CAF50"><Link /></el-icon>
          <div class="resource-info">
            <h4>学习计划制定</h4>
            <p>根据当前进度制定后续学习安排</p>
            <el-button type="success" size="small" @click="router.push('/learning-path')">
              制定计划
            </el-button>
          </div>
        </div>
        
        <div class="resource-card">
          <el-icon size="24" color="#FF9800"><DataAnalysis /></el-icon>
          <div class="resource-info">
            <h4>学习数据分析</h4>
            <p>查看详细的学习统计和趋势分析</p>
            <el-button type="warning" size="small" @click="router.push('/stats')">
              查看分析
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 近期学习记录 -->
    <div class="recent-study">
      <h2 class="section-title">🕒 近期学习记录</h2>
      <div class="study-records">
        <div class="record-item">
          <div class="record-date">今天</div>
          <div class="record-content">
            <div class="record-title">完成第15讲课后习题</div>
            <div class="record-time">学习时长: 3小时</div>
          </div>
        </div>
        <div class="record-item">
          <div class="record-date">昨天</div>
          <div class="record-content">
            <div class="record-title">完成第14讲课后习题</div>
            <div class="record-time">学习时长: 2.5小时</div>
          </div>
        </div>
        <div class="record-item">
          <div class="record-date">前天</div>
          <div class="record-content">
            <div class="record-title">复习第13讲知识点</div>
            <div class="record-time">学习时长: 2小时</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.math-home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 进度概览区域 */
.progress-overview {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 25px rgba(33, 150, 243, 0.15);
  border: 2px solid #2196F3;
}

.overview-header {
  text-align: center;
  margin-bottom: 25px;
}

.quick-nav {
  margin-top: 15px;
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

.progress-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-number {
  font-size: 2.5em;
  font-weight: 700;
  color: #2196F3;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 1em;
  color: #666;
  font-weight: 500;
}

.main-progress {
  margin-top: 20px;
}

.progress-bar {
  height: 20px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2196F3 0%, #64B5F6 100%);
  border-radius: 10px;
  transition: width 1s ease-in-out;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: progressShine 2s infinite;
}

@keyframes progressShine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-text {
  text-align: center;
  font-size: 1.1em;
  color: #424242;
  font-weight: 500;
}

/* 模块导航区域 */
.modules-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.8em;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
  position: relative;
  padding-bottom: 10px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #2196F3, #64B5F6);
  border-radius: 2px;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.module-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.module-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  border-color: #2196F3;
}

.module-icon {
  margin-bottom: 15px;
}

.module-card h3 {
  font-size: 1.3em;
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
}

.module-card p {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

.module-status {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: 500;
}

.module-status.completed {
  background: #E8F5E8;
  color: #4CAF50;
}

.module-status.external {
  background: #FFF3E0;
  color: #FF9800;
}

/* 资源中心 */
.resources-section {
  margin-bottom: 30px;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.resource-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: flex-start;
  gap: 15px;
  transition: all 0.3s ease;
}

.resource-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.resource-info h4 {
  font-size: 1.2em;
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
}

.resource-info p {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

/* 学习记录 */
.recent-study {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.study-records {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.record-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.record-item:hover {
  background: #e3f2fd;
  transform: translateX(5px);
}

.record-date {
  min-width: 60px;
  font-weight: 600;
  color: #2196F3;
}

.record-content {
  flex: 1;
}

.record-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.record-time {
  font-size: 0.9em;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .math-home-container {
    padding: 15px;
  }
  
  .progress-overview {
    padding: 20px;
  }
  
  .page-title {
    font-size: 1.8em;
  }
  
  .progress-stats {
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }
  
  .stat-number {
    font-size: 2em;
  }
  
  .modules-grid {
    grid-template-columns: 1fr;
  }
  
  .resources-grid {
    grid-template-columns: 1fr;
  }
  
  .record-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>