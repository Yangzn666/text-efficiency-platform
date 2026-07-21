<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLearningPathStore } from '@/stores/learningPath'
import { ElMessage } from 'element-plus'
import AssessmentQuiz from './AssessmentQuiz.vue'

const learningPathStore = useLearningPathStore()

const selectedSubject = ref('')
const subjects = ref(['408计算机科学综合', '数学一', '英语一', '政治'])

// 错误处理
const hasError = ref(false)
const errorMessage = ref('')

// 测评相关
const showAssessment = ref(false)
const assessmentResult = ref<any>(null)

// 时间格式化函数：将分钟转换为易读的格式
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

// 日期格式化函数：将ISO日期字符串转换为易读格式
const formatDate = (dateString: string): string => {
  if (!dateString) return '未计算'
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}年${month}月${day}日`
}

// 获取任务类型图标
const getTaskTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    reading: 'Reading',
    practice: 'Edit',
    review: 'Refresh',
    exercise: 'Document'
  }
  return icons[type] || 'Document'
}

// 获取任务类型颜色
const getTaskTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    reading: '#409EFF',
    practice: '#67C23A',
    review: '#E6A23C',
    exercise: '#F56C6C'
  }
  return colors[type] || '#909399'
}

// 获取任务类型名称
const getTaskTypeName = (type: string): string => {
  const names: Record<string, string> = {
    reading: '阅读',
    practice: '练习',
    review: '复习',
    exercise: '习题'
  }
  return names[type] || '任务'
}

// 计算属性
const currentPath = computed(() => {
  return learningPathStore.learningPaths.find(path => 
    path.subject === selectedSubject.value && path.status !== 'completed'
  ) || null
})

const pathProgress = computed(() => {
  if (!currentPath.value) return 0
  return Math.round((currentPath.value.completedChapters / currentPath.value.totalChapters) * 100)
})

const currentChapter = computed(() => {
  if (!currentPath.value) return null
  return currentPath.value.chapters.find(chapter => chapter.order === currentPath.value!.currentChapter)
})

const upcomingChapters = computed(() => {
  if (!currentPath.value) return []
  return currentPath.value.chapters
    .filter(chapter => chapter.order > currentPath.value!.currentChapter)
    .slice(0, 3)
})

// 学习分析数据
const studyAnalysis = computed(() => {
  return learningPathStore.analyzeStudyRecords()
})

// 方法
const createPath = async () => {
  if (!selectedSubject.value) {
    ElMessage.warning('请选择科目')
    return
  }

  try {
    hasError.value = false
    const pathStructure = learningPathStore.getDefaultPathStructure(selectedSubject.value)
    await learningPathStore.createLearningPath(selectedSubject.value, pathStructure.chapters)
    ElMessage.success(`${selectedSubject.value}学习路径创建成功！`)
  } catch (error) {
    hasError.value = true
    errorMessage.value = '创建学习路径失败，请重试'
    ElMessage.error(errorMessage.value)
  }
}

const startPath = async () => {
  if (!currentPath.value) return
  
  try {
    hasError.value = false
    await learningPathStore.startLearningPath(currentPath.value.id)
    ElMessage.success('学习路径已开始！')
  } catch (error) {
    hasError.value = true
    errorMessage.value = '启动学习路径失败'
    ElMessage.error(errorMessage.value)
  }
}

const completeCurrentChapter = async () => {
  if (!currentPath.value || !currentChapter.value) return
  
  try {
    hasError.value = false
    await learningPathStore.completeChapter(currentPath.value.id, currentChapter.value.id)
    ElMessage.success('章节完成')
  } catch (error) {
    hasError.value = true
    errorMessage.value = '章节完成失败'
    ElMessage.error(errorMessage.value)
  }
}

const generatePlan = async () => {
  try {
    hasError.value = false
    const startDate = new Date().toISOString().split('T')[0]
    await learningPathStore.generateWeeklyPlan(startDate)
    ElMessage.success('一周学习计划生成成功！')
  } catch (error) {
    hasError.value = true
    errorMessage.value = '生成学习计划失败'
    ElMessage.error(errorMessage.value)
  }
}

const retryLoad = async () => {
  hasError.value = false
  try {
    await learningPathStore.initializeLearningPathData()
  } catch (error) {
    hasError.value = true
    errorMessage.value = '加载数据失败，请检查网络连接'
  }
}

// 测评相关方法
const startAssessmentQuiz = () => {
  if (!selectedSubject.value) {
    ElMessage.warning('请先选择科目')
    return
  }
  
  try {
    learningPathStore.startAssessment(selectedSubject.value)
    showAssessment.value = true
    assessmentResult.value = null
  } catch (error: any) {
    ElMessage.error(error.message || '启动测评失败')
  }
}

const handleAssessmentComplete = (result: any) => {
  assessmentResult.value = result
  showAssessment.value = false
  
  // 显示结果摘要
  ElMessage.success({
    message: `测评完成！得分：${result.score}分，等级：${getLevelText(result.overallLevel)}`,
    duration: 3000
  })
}

const handleAssessmentCancel = () => {
  showAssessment.value = false
  assessmentResult.value = null
}

const getLevelText = (level: string) => {
  switch (level) {
    case 'beginner': return '初级'
    case 'intermediate': return '中级'
    case 'advanced': return '高级'
    default: return '未知'
  }
}

const createPathFromResult = async () => {
  if (!selectedSubject.value || !assessmentResult.value) return
  
  try {
    // 基于测评结果创建路径
    const pathStructure = learningPathStore.getDefaultPathStructure(selectedSubject.value)
    
    // 根据测评结果调整预估时间
    if (pathStructure.chapters) {
      const multiplier = assessmentResult.value.overallLevel === 'beginner' ? 1.5 :
                        assessmentResult.value.overallLevel === 'intermediate' ? 1.0 : 0.7
      
      pathStructure.chapters = pathStructure.chapters.map((chapter: any) => ({
        ...chapter,
        estimatedTime: Math.round(chapter.estimatedTime * multiplier)
      }))
    }
    
    await learningPathStore.createLearningPath(selectedSubject.value, pathStructure.chapters)
    ElMessage.success('学习路径创建成功！已根据测评结果调整学习计划')
    assessmentResult.value = null
  } catch (error) {
    ElMessage.error('创建学习路径失败')
  }
}

onMounted(async () => {
  try {
    await learningPathStore.initializeLearningPathData()
  } catch (error) {
    hasError.value = true
    errorMessage.value = '初始化数据失败，请刷新页面重试'
    console.error('初始化学习路径数据失败:', error)
  }
})
</script>

<template>
  <div class="learning-path-container">
    <!-- 加载状态 -->
    <div v-if="learningPathStore.isLoading" class="loading-state">
      <el-icon class="is-loading" :size="50" color="#4CAF50"><Loading /></el-icon>
      <p>正在加载学习路径数据...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="hasError" class="error-state">
      <el-icon :size="50" color="#FF6B6B"><CircleClose /></el-icon>
      <p>{{ errorMessage }}</p>
      <el-button type="primary" @click="retryLoad">重试</el-button>
    </div>

    <!-- 正常内容 -->
    <template v-else>
    <!-- 顶部选择区域 -->
    <div class="path-selector">
      <h2 class="section-title">个性化学习路径</h2>
      <div class="selector-controls">
        <el-select 
          v-model="selectedSubject" 
          placeholder="选择学习科目"
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
          v-if="!currentPath"
          type="primary" 
          size="large"
          @click="createPath"
        >
          <el-icon><Plus /></el-icon>
          创建学习路径
        </el-button>
        
        <el-button 
          v-if="selectedSubject && !showAssessment"
          type="success" 
          size="large"
          @click="startAssessmentQuiz"
        >
          <el-icon><DocumentChecked /></el-icon>
          开始测评
        </el-button>
      </div>
    </div>

    <!-- 测评组件 -->
    <AssessmentQuiz 
      v-if="showAssessment && selectedSubject"
      :subject="selectedSubject"
      @complete="handleAssessmentComplete"
      @cancel="handleAssessmentCancel"
    />

    <!-- 测评结果展示 -->
    <div v-if="assessmentResult" class="assessment-result">
      <h3 class="subsection-title">🎯 测评结果</h3>
      <div class="result-card">
        <div class="result-header">
          <div class="score-circle">
            <div class="score-value">{{ assessmentResult.score }}</div>
            <div class="score-label">分</div>
          </div>
          <div class="result-info">
            <div class="level-badge" :class="assessmentResult.overallLevel">
              {{ getLevelText(assessmentResult.overallLevel) }}
            </div>
            <p class="result-summary">
              答对 {{ assessmentResult.correctCount }} / {{ assessmentResult.totalCount }} 题
            </p>
          </div>
        </div>
        
        <div class="result-details">
          <div class="detail-item">
            <span class="label">预估学习时间：</span>
            <span class="value">{{ assessmentResult.estimatedStudyTime }} 小时</span>
          </div>
          
          <div v-if="assessmentResult.strongAreas.length > 0" class="detail-section">
            <h4>✅ 掌握较好的知识点</h4>
            <div class="tags-list">
              <el-tag 
                v-for="area in assessmentResult.strongAreas" 
                :key="area"
                type="success"
                size="small"
              >
                {{ area }}
              </el-tag>
            </div>
          </div>
          
          <div v-if="assessmentResult.weakAreas.length > 0" class="detail-section">
            <h4>⚠️ 需要加强的知识点</h4>
            <div class="tags-list">
              <el-tag 
                v-for="area in assessmentResult.weakAreas" 
                :key="area"
                type="warning"
                size="small"
              >
                {{ area }}
              </el-tag>
            </div>
          </div>
        </div>
        
        <div class="result-actions">
          <el-button type="primary" size="large" @click="createPathFromResult">
            基于测评创建学习路径
          </el-button>
          <el-button size="large" @click="assessmentResult = null">
            关闭
          </el-button>
        </div>
      </div>
    </div>

    <!-- 路径概览 -->
    <div v-if="currentPath" class="path-overview">
      <div class="overview-header">
        <h3>{{ currentPath.name }}</h3>
        <div class="path-status">
          <el-tag :type="currentPath.status === 'in-progress' ? 'success' : 'info'">
            {{ currentPath.status === 'in-progress' ? '进行中' : '未开始' }}
          </el-tag>
        </div>
      </div>
      
      <!-- 预计完成时间 -->
      <div class="detail-item" style="margin-bottom: 20px;">
        <el-icon color="#16345c"><Calendar /></el-icon>
        <span>预计完成：<strong>{{ formatDate(currentPath.estimatedEndDate) }}</strong></span>
      </div>
      
      <div class="progress-section">
        <div class="progress-info">
          <div class="progress-text">
            <span class="completed">{{ currentPath.completedChapters }}</span>
            <span class="separator">/</span>
            <span class="total">{{ currentPath.totalChapters }}</span>
            <span class="label">章节完成</span>
          </div>
          <div class="progress-percentage">{{ pathProgress }}%</div>
        </div>
        
        <div class="progress-bar-container">
          <div class="progress-bar">
            <div 
              class="progress-fill"
              :style="{ width: `${pathProgress}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 当前章节 -->
    <div v-if="currentChapter" class="current-chapter">
      <h3 class="subsection-title">当前章节</h3>
      <div class="chapter-card">
        <div class="chapter-header">
          <div class="chapter-info">
            <span class="chapter-order">第{{ currentChapter.order }}章</span>
            <h4 class="chapter-title">{{ currentChapter.title }}</h4>
          </div>
          <el-tag v-if="currentChapter.completed" type="success">已完成</el-tag>
        </div>
        
        <div class="chapter-details">
          <div class="detail-item">
            <el-icon color="#16345c"><Timer /></el-icon>
            <span>预计时间：<strong>{{ formatTime(currentChapter.estimatedTime) }}</strong></span>
          </div>
          <div class="detail-item">
            <el-icon color="#4CAF50"><List /></el-icon>
            <span>任务数量：{{ currentChapter.tasks.length }}个</span>
          </div>
        </div>
        
        <div class="chapter-actions">
          <el-button 
            v-if="!currentChapter.completed"
            type="primary"
            size="large"
            @click="completeCurrentChapter"
          >
            <el-icon><Check /></el-icon>
            完成本章
          </el-button>
          <el-button 
            v-else
            type="success"
            size="large"
            disabled
          >
            <el-icon><Check /></el-icon>
            章节已完成
          </el-button>
        </div>
      </div>
    </div>

    <!-- 后续章节预览 -->
    <div v-if="upcomingChapters.length > 0" class="upcoming-chapters">
      <h3 class="subsection-title">后续章节</h3>
      <div class="chapters-grid">
        <div 
          v-for="chapter in upcomingChapters" 
          :key="chapter.id"
          class="chapter-preview"
        >
          <div class="preview-header">
            <span class="preview-order">第{{ chapter.order }}章</span>
            <el-tag v-if="chapter.completed" type="success" size="small">已完成</el-tag>
          </div>
          <h5 class="preview-title">{{ chapter.title }}</h5>
          <div class="preview-details">
            <span class="time-badge">{{ formatTime(chapter.estimatedTime) }}</span>
            <span>{{ chapter.tasks.length }}个任务</span>
          </div>
          <!-- 任务列表提示 -->
          <div v-if="chapter.tasks.length > 0" class="task-preview-list">
            <div 
              v-for="(task, idx) in chapter.tasks.slice(0, 3)" 
              :key="task.id"
              class="mini-task-item"
            >
              <span class="task-type-badge" :class="task.type">{{ getTaskTypeName(task.type) }}</span>
              <span class="mini-time">{{ formatTime(task.estimatedTime) }}</span>
            </div>
            <div v-if="chapter.tasks.length > 3" class="more-tasks">
              +{{ chapter.tasks.length - 3 }}个更多任务
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习计划 -->
    <div class="study-plan">
      <div class="plan-header">
        <h3 class="subsection-title">本周学习计划</h3>
        <el-button 
          type="primary" 
          @click="generatePlan"
          :disabled="learningPathStore.isLoading"
        >
          <el-icon><Refresh /></el-icon>
          生成计划
        </el-button>
      </div>
      
      <div v-if="learningPathStore.todayPlan" class="today-plan">
        <h4>今日计划 ({{ learningPathStore.todayPlan.date }})</h4>
        <div class="tasks-list">
          <div 
            v-for="task in learningPathStore.todayPlan.tasks" 
            :key="task.id"
            class="task-item"
            :class="{ 'completed': task.completed }"
          >
            <el-checkbox 
              v-model="task.completed"
              disabled
            />
            <div class="task-info">
              <div class="task-title">{{ task.taskTitle }}</div>
              <div class="task-meta">
                <span>{{ task.subject }}</span>
                <span>{{ task.chapterTitle }}</span>
                <span class="time-badge">{{ formatTime(task.estimatedTime) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="path-statistics">
      <h3 class="subsection-title">学习统计</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ learningPathStore.overallProgress }}%</div>
          <div class="stat-label">总体进度</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ learningPathStore.activePaths.length }}</div>
          <div class="stat-label">进行中路径</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ learningPathStore.weeklyPlanProgress }}%</div>
          <div class="stat-label">本周计划完成</div>
        </div>
      </div>
    </div>

    <!-- 智能建议 -->
    <div class="smart-recommendations">
      <h3 class="subsection-title">💡 智能学习建议</h3>
      <div class="recommendations-list">
        <div 
          v-for="(rec, index) in studyAnalysis.recommendations" 
          :key="index"
          class="recommendation-item"
        >
          <el-icon color="#4CAF50"><InfoFilled /></el-icon>
          <span>{{ rec }}</span>
        </div>
        <div v-if="studyAnalysis.recommendations.length === 0" class="no-recommendations">
          暂无建议，开始学习后会自动生成个性化建议
        </div>
      </div>
      
      <!-- 科目时间分布 -->
      <div v-if="studyAnalysis.subjectDistribution.length > 0" class="subject-distribution">
        <h4>📊 科目时间分布</h4>
        <div 
          v-for="item in studyAnalysis.subjectDistribution" 
          :key="item.subject"
          class="distribution-item"
        >
          <div class="distribution-header">
            <span class="subject-name">{{ item.subject }}</span>
            <span class="time-info">{{ Math.round(item.totalTime / 60) }}小时 ({{ item.percentage }}%)</span>
          </div>
          <div class="distribution-bar">
            <div 
              class="distribution-fill"
              :style="{ width: item.percentage + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<style scoped>
.learning-path-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px 20px;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 20px;
}

.loading-state p {
  color: #666;
  font-size: 1.1em;
}

/* 错误状态 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 20px;
  padding: 40px;
  background: #fff5f5;
  border-radius: 20px;
  border: 2px solid #FF6B6B;
}

.error-state p {
  color: #FF6B6B;
  font-size: 1.1em;
  text-align: center;
}

.section-title {
  text-align: center;
  color: white;
  font-size: 2.2em;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.path-selector {
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  border-radius: 24px;
  padding: 35px;
  margin-bottom: 30px;
  box-shadow: 0 12px 40px rgba(13, 33, 55, 0.3);
  color: white;
  text-align: center;
}

.section-title {
  color: white !important;
  font-size: 2em;
  margin-bottom: 25px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  font-weight: 700;
}

.selector-controls {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.subject-select {
  width: 250px;
}

.path-overview {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 24px;
  padding: 35px;
  margin-bottom: 30px;
  box-shadow: 0 10px 35px rgba(0,0,0,0.12);
  border: 2px solid rgba(13, 33, 55, 0.1);
  transition: all 0.3s ease;
}

.path-overview:hover {
  box-shadow: 0 15px 45px rgba(13, 33, 55, 0.2);
  transform: translateY(-2px);
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.overview-header h3 {
  color: #333333;
  font-size: 1.9em;
  margin: 0;
  font-weight: 700;
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.progress-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 18px;
  padding: 28px;
  border: 2px solid rgba(13, 33, 55, 0.15);
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.04);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.progress-text {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 1.4em;
}

.completed {
  color: #4CAF50;
  font-weight: 700;
  font-size: 2em;
}

.separator {
  color: #999999;
}

.total {
  color: #666666;
  font-weight: 500;
}

.label {
  color: #666666;
  margin-left: 10px;
}

.progress-percentage {
  font-size: 2em;
  font-weight: 700;
  color: #16345c;
}

.progress-bar-container {
  height: 12px;
  background: #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50 0%, #FF6B6B 100%);
  border-radius: 6px;
  transition: width 0.5s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shine 2s infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.current-chapter {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 24px;
  padding: 35px;
  margin-bottom: 30px;
  box-shadow: 0 10px 35px rgba(0,0,0,0.12);
  border: 2px solid rgba(13, 33, 55, 0.1);
  transition: all 0.3s ease;
}

.current-chapter:hover {
  box-shadow: 0 15px 45px rgba(13, 33, 55, 0.2);
  transform: translateY(-2px);
}

.subsection-title {
  color: #333333;
  font-size: 1.6em;
  margin-bottom: 25px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.subsection-title::before {
  content: '';
  width: 4px;
  height: 24px;
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  border-radius: 2px;
}

.chapter-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 18px;
  padding: 28px;
  border: 2px solid #dee2e6;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.chapter-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(13, 33, 55, 0.2);
  border-color: #16345c;
}

.chapter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #dee2e6;
}

.chapter-info {
  flex: 1;
}

.chapter-order {
  color: #16345c;
  font-weight: 700;
  font-size: 1.1em;
  display: inline-block;
  background: rgba(13, 33, 55, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 8px;
}

.chapter-title {
  color: #333;
  font-size: 1.5em;
  margin: 8px 0 0 0;
  font-weight: 700;
}

.chapter-details {
  display: flex;
  gap: 25px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666666;
  font-size: 1.1em;
}

.chapter-actions {
  text-align: center;
}

.upcoming-chapters {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 24px;
  padding: 35px;
  margin-bottom: 30px;
  box-shadow: 0 10px 35px rgba(0,0,0,0.12);
  border: 2px solid rgba(13, 33, 55, 0.1);
  transition: all 0.3s ease;
}

.upcoming-chapters:hover {
  box-shadow: 0 15px 45px rgba(13, 33, 55, 0.2);
  transform: translateY(-2px);
}

.chapters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.chapter-preview {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 14px;
  padding: 22px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  animation: fadeInUp 0.5s ease-out backwards;
}

.chapter-preview:nth-child(1) { animation-delay: 0.1s; }
.chapter-preview:nth-child(2) { animation-delay: 0.2s; }
.chapter-preview:nth-child(3) { animation-delay: 0.3s; }
.chapter-preview:nth-child(4) { animation-delay: 0.4s; }
.chapter-preview:nth-child(5) { animation-delay: 0.5s; }

.chapter-preview:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
  border-color: #16345c;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.preview-order {
  color: #16345c;
  font-weight: 700;
  font-size: 1em;
  background: rgba(13, 33, 55, 0.1);
  padding: 3px 10px;
  border-radius: 15px;
}

.preview-title {
  color: #333;
  font-size: 1.25em;
  margin: 0 0 15px 0;
  font-weight: 600;
}

.preview-details {
  display: flex;
  gap: 15px;
  color: #666;
  font-size: 0.95em;
}

.preview-details span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.preview-details .time-badge {
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  color: white;
  padding: 3px 10px;
  border-radius: 15px;
  font-size: 0.85em;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(13, 33, 55, 0.3);
}

/* 任务预览列表 */
.task-preview-list {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mini-task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(13, 33, 55, 0.05);
  border-radius: 8px;
  font-size: 0.85em;
  transition: all 0.2s ease;
}

.mini-task-item:hover {
  background: rgba(13, 33, 55, 0.1);
  transform: translateX(3px);
}

.task-type-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8em;
  font-weight: 600;
  color: white;
}

.task-type-badge.reading {
  background: #409EFF;
}

.task-type-badge.practice {
  background: #67C23A;
}

.task-type-badge.review {
  background: #E6A23C;
}

.task-type-badge.exercise {
  background: #F56C6C;
}

.mini-time {
  color: #666;
  font-size: 0.85em;
}

.more-tasks {
  text-align: center;
  color: #999;
  font-size: 0.8em;
  padding: 5px;
  font-style: italic;
}

.study-plan {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 24px;
  padding: 35px;
  margin-bottom: 30px;
  box-shadow: 0 10px 35px rgba(0,0,0,0.12);
  border: 2px solid rgba(13, 33, 55, 0.1);
  transition: all 0.3s ease;
}

.study-plan:hover {
  box-shadow: 0 15px 45px rgba(13, 33, 55, 0.2);
  transform: translateY(-2px);
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.today-plan h4 {
  color: #333333;
  margin-bottom: 20px;
  font-size: 1.4em;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.today-plan h4::before {
  content: '📅';
  font-size: 1.2em;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.task-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 14px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  animation: fadeInLeft 0.4s ease-out backwards;
}

.task-item:nth-child(1) { animation-delay: 0.1s; }
.task-item:nth-child(2) { animation-delay: 0.15s; }
.task-item:nth-child(3) { animation-delay: 0.2s; }
.task-item:nth-child(4) { animation-delay: 0.25s; }
.task-item:nth-child(5) { animation-delay: 0.3s; }

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.task-item:hover {
  transform: translateX(5px) translateY(-2px);
  border-color: #16345c;
  box-shadow: 0 6px 20px rgba(13, 33, 55, 0.2);
  background: linear-gradient(135deg, #ffffff 0%, #f0f2ff 100%);
}

.task-item.completed {
  background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);
  border-left: 4px solid #4CAF50;
  border-color: #4CAF50;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.15);
}

.task-info {
  flex: 1;
}

.task-title {
  color: #333;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 1.05em;
}

.task-meta {
  display: flex;
  gap: 15px;
  color: #666;
  font-size: 0.9em;
  flex-wrap: wrap;
}

.time-badge {
  display: inline-block;
  padding: 4px 12px;
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(13, 33, 55, 0.3);
}

.path-statistics {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 24px;
  padding: 35px;
  box-shadow: 0 10px 35px rgba(0,0,0,0.12);
  border: 2px solid rgba(13, 33, 55, 0.1);
  transition: all 0.3s ease;
}

.path-statistics:hover {
  box-shadow: 0 15px 45px rgba(13, 33, 55, 0.2);
  transform: translateY(-2px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-card {
  text-align: center;
  padding: 28px;
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  color: white;
  border-radius: 18px;
  box-shadow: 0 8px 25px rgba(13, 33, 55, 0.35);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: scaleIn 0.5s ease-out backwards;
}

.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.2s; }
.stat-card:nth-child(3) { animation-delay: 0.3s; }

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.stat-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 40px rgba(13, 33, 55, 0.5);
}

.stat-value {
  font-size: 2.5em;
  font-weight: 800;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.stat-label {
  font-size: 1.1em;
  opacity: 0.95;
  font-weight: 500;
}

/* 智能建议区域 */
.smart-recommendations {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 24px;
  padding: 35px;
  margin-top: 30px;
  box-shadow: 0 10px 35px rgba(0,0,0,0.12);
  border: 2px solid rgba(13, 33, 55, 0.1);
  transition: all 0.3s ease;
}

.smart-recommendations:hover {
  box-shadow: 0 15px 45px rgba(13, 33, 55, 0.2);
  transform: translateY(-2px);
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 18px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border-left: 4px solid #4CAF50;
  color: #333;
  line-height: 1.6;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  animation: fadeInRight 0.4s ease-out backwards;
}

.recommendation-item:nth-child(1) { animation-delay: 0.1s; }
.recommendation-item:nth-child(2) { animation-delay: 0.15s; }
.recommendation-item:nth-child(3) { animation-delay: 0.2s; }
.recommendation-item:nth-child(4) { animation-delay: 0.25s; }
.recommendation-item:nth-child(5) { animation-delay: 0.3s; }

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.recommendation-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.15);
  background: linear-gradient(135deg, #ffffff 0%, #f0fff0 100%);
}

.no-recommendations {
  text-align: center;
  color: #999;
  padding: 30px;
  font-style: italic;
}

.subject-distribution h4 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.3em;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.subject-distribution h4::before {
  content: '📊';
  font-size: 1.2em;
}

.distribution-item {
  margin-bottom: 22px;
  padding: 15px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  transition: all 0.3s ease;
  animation: fadeInUp 0.4s ease-out backwards;
}

.distribution-item:nth-child(1) { animation-delay: 0.1s; }
.distribution-item:nth-child(2) { animation-delay: 0.15s; }
.distribution-item:nth-child(3) { animation-delay: 0.2s; }
.distribution-item:nth-child(4) { animation-delay: 0.25s; }

.distribution-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(13, 33, 55, 0.15);
  background: linear-gradient(135deg, #ffffff 0%, #f0f2ff 100%);
}

.distribution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.subject-name {
  font-weight: 600;
  color: #333;
}

.time-info {
  color: #666;
  font-size: 0.9em;
}

.distribution-bar {
  height: 10px;
  background: linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 100%);
  border-radius: 5px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

.distribution-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF6B6B 0%, #4CAF50 100%);
  border-radius: 5px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.distribution-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* 测评结果 */
.assessment-result {
  margin-top: 30px;
}

.result-card {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 24px;
  padding: 35px;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.12);
  border: 2px solid rgba(13, 33, 55, 0.1);
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out;
}

.result-card:hover {
  box-shadow: 0 15px 45px rgba(13, 33, 55, 0.2);
  transform: translateY(-2px);
}

.result-header {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 2px solid #f0f0f0;
}

.score-circle {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B6B 0%, #4CAF50 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.score-circle::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.score-circle:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.5);
}

.score-value {
  font-size: 2.5em;
  font-weight: 700;
  line-height: 1;
}

.score-label {
  font-size: 1em;
  opacity: 0.9;
  margin-top: 5px;
}

.result-info {
  flex: 1;
}

.level-badge {
  display: inline-block;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 1.1em;
  font-weight: 600;
  margin-bottom: 10px;
}

.level-badge.beginner {
  background: #fff3e0;
  color: #FF9800;
}

.level-badge.intermediate {
  background: #eef3fa;
  color: #16345c;
}

.level-badge.advanced {
  background: #e8f5e9;
  color: #4CAF50;
}

.result-summary {
  color: #666;
  font-size: 1em;
  margin: 0;
}

.result-details {
  margin-bottom: 30px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 18px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  animation: fadeInUp 0.4s ease-out backwards;
}

.detail-item:nth-child(1) { animation-delay: 0.1s; }
.detail-item:nth-child(2) { animation-delay: 0.15s; }
.detail-item:nth-child(3) { animation-delay: 0.2s; }

.detail-item:hover {
  transform: translateX(5px);
  border-color: #16345c;
  box-shadow: 0 4px 15px rgba(13, 33, 55, 0.15);
  background: linear-gradient(135deg, #ffffff 0%, #f0f2ff 100%);
}

.detail-item .label {
  color: #666;
  font-size: 1em;
}

.detail-item .value {
  color: #333;
  font-weight: 600;
  font-size: 1.1em;
}

.detail-section h4 {
  color: #333;
  font-size: 1.1em;
  margin-bottom: 15px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tags-list .el-tag {
  transition: all 0.3s ease;
  border: none;
}

.tags-list .el-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.result-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

/* 响应式设计*/
@media (max-width: 768px) {
  .learning-path-container {
    padding: 20px 15px;
  }
  
  /* 移动端减少动画以提升性能 */
  .chapter-preview,
  .task-item,
  .stat-card,
  .recommendation-item,
  .distribution-item,
  .detail-item {
    animation: none !important;
  }
  
  .section-title {
    font-size: 1.8em;
    margin-bottom: 20px;
  }
  
  .path-selector,
  .path-overview,
  .current-chapter,
  .upcoming-chapters,
  .study-plan,
  .path-statistics {
    padding: 20px;
    border-radius: 15px;
    margin-bottom: 20px;
  }
  
  .selector-controls {
    flex-direction: column;
  }
  
  .subject-select {
    width: 100%;
  }
  
  .overview-header h3 {
    font-size: 1.5em;
  }
  
  .progress-info {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .progress-text {
    font-size: 1.2em;
  }
  
  .completed {
    font-size: 1.6em;
  }
  
  .progress-percentage {
    font-size: 1.6em;
  }
  
  .subsection-title {
    font-size: 1.3em;
  }
  
  .chapter-title {
    font-size: 1.2em;
  }
  
  .chapter-details {
    flex-direction: column;
    gap: 15px;
  }
  
  .detail-item {
    font-size: 1em;
  }
  
  .chapters-grid {
    grid-template-columns: 1fr;
  }
  
  .preview-title {
    font-size: 1.1em;
  }
  
  .plan-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .today-plan h4 {
    font-size: 1.1em;
  }
  
  .task-meta {
    flex-direction: column;
    gap: 5px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .stat-value {
    font-size: 2em;
  }
  
  .stat-label {
    font-size: 1em;
  }
}

@media (max-width: 480px) {
  .learning-path-container {
    padding: 12px;
  }
  
  .section-title {
    font-size: 1.5em;
    margin-bottom: 15px;
  }
  
  .path-selector,
  .path-overview,
  .current-chapter,
  .upcoming-chapters,
  .study-plan,
  .path-statistics {
    padding: 15px;
    border-radius: 12px;
    margin-bottom: 15px;
  }
  
  .selector-controls {
    gap: 12px;
  }
  
  .overview-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .overview-header h3 {
    font-size: 1.3em;
  }
  
  .progress-section {
    padding: 15px;
  }
  
  .progress-text {
    font-size: 1em;
  }
  
  .completed {
    font-size: 1.4em;
  }
  
  .progress-percentage {
    font-size: 1.4em;
  }
  
  .progress-bar-container {
    height: 10px;
  }
  
  .subsection-title {
    font-size: 1.15em;
    margin-bottom: 15px;
  }
  
  .chapter-card {
    padding: 15px;
  }
  
  .chapter-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .chapter-order {
    font-size: 1em;
  }
  
  .chapter-title {
    font-size: 1.1em;
    margin: 5px 0 0 0;
  }
  
  .detail-item {
    font-size: 0.9em;
  }
  
  .chapter-actions {
    margin-top: 10px;
  }
  
  .chapter-actions .el-button {
    width: 100%;
  }
  
  .chapter-preview {
    padding: 15px;
  }
  
  .preview-order {
    font-size: 0.9em;
  }
  
  .preview-title {
    font-size: 1em;
    margin: 8px 0 10px 0;
  }
  
  .preview-details {
    font-size: 0.8em;
    gap: 10px;
  }
  
  .plan-header .el-button {
    width: 100%;
  }
  
  .today-plan h4 {
    font-size: 1em;
    margin-bottom: 12px;
  }
  
  .task-item {
    padding: 12px;
    gap: 10px;
  }
  
  .task-title {
    font-size: 0.95em;
    margin-bottom: 6px;
  }
  
  .task-meta {
    font-size: 0.8em;
  }
  
  .stat-card {
    padding: 15px;
  }
  
  .stat-value {
    font-size: 1.8em;
    margin-bottom: 8px;
  }
  
  .stat-label {
    font-size: 0.9em;
  }
  
  .smart-recommendations {
    padding: 20px;
    margin-top: 20px;
  }
  
  .recommendation-item {
    padding: 12px;
    font-size: 0.9em;
  }
  
  .subject-distribution h4 {
    font-size: 1.1em;
  }
  
  .distribution-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .time-info {
    font-size: 0.85em;
  }
  
  .loading-state {
    min-height: 300px;
  }
  
  .loading-state p {
    font-size: 1em;
  }
  
  .error-state {
    min-height: 300px;
    padding: 30px 20px;
  }
  
  .error-state p {
    font-size: 1em;
  }
  
  .result-card {
    padding: 20px;
  }
  
  .result-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .score-circle {
    width: 100px;
    height: 100px;
  }
  
  .score-value {
    font-size: 2em;
  }
  
  .result-actions {
    flex-direction: column;
  }
  
  .result-actions .el-button {
    width: 100%;
  }
}
</style>
