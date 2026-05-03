<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLearningPathStore } from '@/stores/learningPath'
import { ElMessage } from 'element-plus'

const learningPathStore = useLearningPathStore()

const selectedSubject = ref('')
const subjects = ref(['408计算机科学综合', '数学一', '英语一', '政治'])

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

// 方法
const createPath = async () => {
  if (!selectedSubject.value) {
    ElMessage.warning('请选择科目')
    return
  }

  try {
    const pathStructure = learningPathStore.getDefaultPathStructure(selectedSubject.value)
    await learningPathStore.createLearningPath(selectedSubject.value, pathStructure.chapters)
    ElMessage.success(`${selectedSubject.value}学习路径创建成功！`)
  } catch (error) {
    ElMessage.error('创建学习路径失败')
  }
}

const startPath = async () => {
  if (!currentPath.value) return
  
  try {
    await learningPathStore.startLearningPath(currentPath.value.id)
    ElMessage.success('学习路径已开始！')
  } catch (error) {
    ElMessage.error('启动学习路径失败')
  }
}

const completeCurrentChapter = async () => {
  if (!currentPath.value || !currentChapter.value) return
  
  try {
    await learningPathStore.completeChapter(currentPath.value.id, currentChapter.value.id)
    ElMessage.success('章节完成')
  } catch (error) {
    ElMessage.error('章节完成失败')
  }
}

const generatePlan = async () => {
  try {
    const startDate = new Date().toISOString().split('T')[0]
    await learningPathStore.generateWeeklyPlan(startDate)
    ElMessage.success('一周学习计划生成成功！')
  } catch (error) {
    ElMessage.error('生成学习计划失败')
  }
}

onMounted(() => {
  learningPathStore.initializeLearningPathData()
})
</script>

<template>
  <div class="learning-path-container">
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
            <el-icon color="#FF6B6B"><Timer /></el-icon>
            <span>预计时间：{{ currentChapter.estimatedTime }}分钟</span>
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
            <span>{{ chapter.estimatedTime }}分钟</span>
            <span>{{ chapter.tasks.length }}个任务</span>
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
                <span>{{ task.estimatedTime }}分钟</span>
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
  </div>
</template>

<style scoped>
.learning-path-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px 20px;
}

.section-title {
  text-align: center;
  color: white;
  font-size: 2.2em;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.path-selector {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  text-align: center;
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
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.overview-header h3 {
  color: #333333;
  font-size: 1.8em;
  margin: 0;
}

.progress-section {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 25px;
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
  color: #FF6B6B;
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
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}

.subsection-title {
  color: #333333;
  font-size: 1.5em;
  margin-bottom: 20px;
}

.chapter-card {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 25px;
}

.chapter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chapter-info {
  flex: 1;
}

.chapter-order {
  color: #FF6B6B;
  font-weight: 600;
  font-size: 1.1em;
}

.chapter-title {
  color: #333333;
  font-size: 1.4em;
  margin: 10px 0 0 0;
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
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}

.chapters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.chapter-preview {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #eeeeee;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.preview-order {
  color: #FF6B6B;
  font-weight: 600;
}

.preview-title {
  color: #333333;
  font-size: 1.2em;
  margin: 0 0 15px 0;
}

.preview-details {
  display: flex;
  gap: 15px;
  color: #666666;
  font-size: 0.9em;
}

.study-plan {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
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
  font-size: 1.3em;
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
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.task-item.completed {
  background: #e8f5e8;
  border-left: 4px solid #4CAF50;
}

.task-info {
  flex: 1;
}

.task-title {
  color: #333333;
  font-weight: 500;
  margin-bottom: 8px;
}

.task-meta {
  display: flex;
  gap: 15px;
  color: #666666;
  font-size: 0.9em;
}

.path-statistics {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-card {
  text-align: center;
  padding: 25px;
  background: linear-gradient(135deg, #FF6B6B 0%, #4CAF50 100%);
  color: white;
  border-radius: 15px;
}

.stat-value {
  font-size: 2.5em;
  font-weight: 700;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 1.1em;
  opacity: 0.9;
}

/* 响应式设计*/
@media (max-width: 768px) {
  .learning-path-container {
    padding: 20px 15px;
  }
  
  .selector-controls {
    flex-direction: column;
  }
  
  .subject-select {
    width: 100%;
  }
  
  .progress-info {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .chapter-details {
    flex-direction: column;
    gap: 15px;
  }
  
  .chapters-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .task-meta {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
