<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import { useStudyStore } from '@/stores/study'

const studyStore = useStudyStore()

// 状态管理
const activeTab = ref('overview')
const selectedSubject = ref('')
const selectedChapter = ref('')
const isCreatingPath = ref(false)
const showChapterDetail = ref(false)

// 学习科目数据
const subjects = ref([
  { 
    id: 'cs408', 
    name: '408计算机科学综合', 
    chapters: [
      { id: 'ds', name: '数据结构', duration: 60, completed: false },
      { id: 'co', name: '计算机组成原理', duration: 80, completed: false },
      { id: 'os', name: '操作系统', duration: 50, completed: false },
      { id: 'net', name: '计算机网络', duration: 50, completed: false }
    ] 
  },
  { 
    id: 'math', 
    name: '数学一', 
    chapters: [
      { id: 'calculus', name: '高等数学', duration: 120, completed: false },
      { id: 'linear', name: '线性代数', duration: 40, completed: false },
      { id: 'probability', name: '概率论与数理统计', duration: 40, completed: false }
    ] 
  },
  { 
    id: 'english', 
    name: '英语一', 
    chapters: [
      { id: 'vocab', name: '词汇', duration: 50, completed: false },
      { id: 'grammar', name: '语法', duration: 30, completed: false },
      { id: 'reading', name: '阅读理解', duration: 60, completed: false },
      { id: 'translation', name: '翻译', duration: 40, completed: false },
      { id: 'writing', name: '写作', duration: 40, completed: false }
    ] 
  },
  { 
    id: 'politics', 
    name: '政治', 
    chapters: [
      { id: 'marxism', name: '马克思主义基本原理', duration: 30, completed: false },
      { id: 'mao', name: '毛泽东思想和中国特色社会主义理论体系', duration: 30, completed: false },
      { id: 'history', name: '中国近现代史纲要', duration: 25, completed: false },
      { id: 'morality', name: '思想道德修养与法律基础', duration: 25, completed: false },
      { id: 'policy', name: '形势与政策', duration: 20, completed: false }
    ] 
  }
])

// 计算属性
const currentSubject = computed(() => {
  return subjects.value.find(s => s.id === selectedSubject.value)
})

const totalStudyTime = computed(() => {
  return subjects.value.reduce((total, subject) => {
    return total + subject.chapters.reduce((subTotal, chapter) => {
      return subTotal + (chapter.completed ? chapter.duration : 0)
    }, 0)
  }, 0)
})

const overallProgress = computed(() => {
  const totalChapters = subjects.value.reduce((sum, subject) => sum + subject.chapters.length, 0)
  const completedChapters = subjects.value.reduce((sum, subject) => {
    return sum + subject.chapters.filter(chapter => chapter.completed).length
  }, 0)
  return totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0
})

const weeklyGoal = ref(20) // 每周学习小时目标
const dailyStudyTime = ref(3) // 每日学习小时

// 方法
const createLearningPath = async () => {
  if (!selectedSubject.value) {
    ElMessage.warning('请选择学习科目')
    return
  }

  isCreatingPath.value = true
  
  try {
    // 模拟创建学习路径的过程
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    ElNotification({
      title: '🎉 学习路径创建成功',
      message: `已为您生成${currentSubject.value?.name}的个性化学习计划`,
      type: 'success',
      duration: 3000
    })
    
    // 更新学习数据
    studyStore.updateStudyStats({
      todayStudyTime: studyStore.todayStudyTime + 30,
      weeklyStudyTime: studyStore.weeklyStudyTime + 30
    })
    
  } catch (error) {
    ElMessage.error('创建学习路径失败，请重试')
  } finally {
    isCreatingPath.value = false
  }
}

const toggleChapterCompletion = (chapterId: string) => {
  const subject = subjects.value.find(s => s.id === selectedSubject.value)
  if (!subject) return
  
  const chapter = subject.chapters.find(c => c.id === chapterId)
  if (chapter) {
    chapter.completed = !chapter.completed
    const message = chapter.completed ? 
      `✅ ${chapter.name} 已完成` : 
      `🔄 ${chapter.name} 重新开始`
    ElMessage.success(message)
    
    // 更新学习统计
    if (chapter.completed) {
      studyStore.updateStudyStats({
        todayStudyTime: studyStore.todayStudyTime + chapter.duration,
        weeklyStudyTime: studyStore.weeklyStudyTime + chapter.duration
      })
    }
  }
}

const generateWeeklyPlan = () => {
  if (!selectedSubject.value) {
    ElMessage.warning('请先选择学习科目')
    return
  }
  
  ElNotification({
    title: '📅 周计划已生成',
    message: `基于您的学习目标，建议本周完成${currentSubject.value?.chapters.slice(0, 2).map(c => c.name).join('和')}章节`,
    type: 'info',
    duration: 4000
  })
}

const showChapterDetails = (chapterId: string) => {
  selectedChapter.value = chapterId
  showChapterDetail.value = true
}

const getProgressColor = (progress: number) => {
  if (progress >= 80) return '#4CAF50'
  if (progress >= 50) return '#FF9800'
  return '#FF6B6B'
}

onMounted(() => {
  // 初始化一些已完成的示例数据
  if (subjects.value.length > 0) {
    subjects.value[0].chapters[0].completed = true // 标记第一个章节为已完成
  }
})
</script>

<template>
  <div class="learning-path-complete">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">🎓 个性化学习计划</h1>
      <p class="page-subtitle">科学规划，循序渐进，高效备考</p>
    </div>

    <!-- 统计概览 -->
    <div class="stats-overview">
      <div class="stat-card primary">
        <div class="stat-content">
          <div class="stat-icon">📚</div>
          <div class="stat-info">
            <div class="stat-value">{{ subjects.length }}</div>
            <div class="stat-label">学习科目</div>
          </div>
        </div>
      </div>
      
      <div class="stat-card success">
        <div class="stat-content">
          <div class="stat-icon">⏱️</div>
          <div class="stat-info">
            <div class="stat-value">{{ totalStudyTime }}</div>
            <div class="stat-label">已学分钟</div>
          </div>
        </div>
      </div>
      
      <div class="stat-card warning">
        <div class="stat-content">
          <div class="stat-icon">🎯</div>
          <div class="stat-info">
            <div class="stat-value" :style="{ color: getProgressColor(overallProgress) }">
              {{ overallProgress }}%
            </div>
            <div class="stat-label">整体进度</div>
          </div>
        </div>
      </div>
      
      <div class="stat-card info">
        <div class="stat-content">
          <div class="stat-icon">📅</div>
          <div class="stat-info">
            <div class="stat-value">{{ weeklyGoal }}</div>
            <div class="stat-label">周目标(小时)</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <el-tabs v-model="activeTab" class="path-tabs">
        <!-- 学习概览 Tab -->
        <el-tab-pane label="📋 学习概览" name="overview">
          <div class="overview-section">
            <div class="subject-selection">
              <h3>选择学习科目</h3>
              <div class="selection-controls">
                <el-select 
                  v-model="selectedSubject" 
                  placeholder="请选择要学习的科目"
                  size="large"
                  class="subject-select"
                >
                  <el-option
                    v-for="subject in subjects"
                    :key="subject.id"
                    :label="subject.name"
                    :value="subject.id"
                  />
                </el-select>
                
                <el-button 
                  type="primary" 
                  size="large"
                  :loading="isCreatingPath"
                  @click="createLearningPath"
                >
                  <el-icon><MagicStick /></el-icon>
                  {{ isCreatingPath ? '生成中...' : '智能生成学习路径' }}
                </el-button>
              </div>
            </div>

            <!-- 科目详情 -->
            <div v-if="currentSubject" class="subject-details">
              <h3>{{ currentSubject.name }} - 章节列表</h3>
              <div class="chapters-grid">
                <div 
                  v-for="chapter in currentSubject.chapters" 
                  :key="chapter.id"
                  class="chapter-card"
                  :class="{ completed: chapter.completed }"
                  @click="showChapterDetails(chapter.id)"
                >
                  <div class="chapter-header">
                    <div class="chapter-info">
                      <h4>{{ chapter.name }}</h4>
                      <span class="duration">{{ chapter.duration }}分钟</span>
                    </div>
                    <el-checkbox 
                      :model-value="chapter.completed"
                      @change="toggleChapterCompletion(chapter.id)"
                      @click.stop
                    />
                  </div>
                  <div class="chapter-progress">
                    <el-progress 
                      :percentage="chapter.completed ? 100 : 0"
                      :stroke-width="6"
                      :show-text="false"
                      :color="chapter.completed ? '#4CAF50' : '#e0e0e0'"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 进度追踪 Tab -->
        <el-tab-pane label="📊 进度追踪" name="progress">
          <div class="progress-section">
            <div class="progress-header">
              <h3>学习进度总览</h3>
              <div class="progress-summary">
                <div class="summary-item">
                  <span class="label">总体进度:</span>
                  <span class="value" :style="{ color: getProgressColor(overallProgress) }">
                    {{ overallProgress }}%
                  </span>
                </div>
                <div class="summary-item">
                  <span class="label">累计学习:</span>
                  <span class="value">{{ totalStudyTime }}分钟</span>
                </div>
              </div>
            </div>

            <!-- 各科目进度 -->
            <div class="subjects-progress">
              <div 
                v-for="subject in subjects" 
                :key="subject.id"
                class="subject-progress-card"
              >
                <div class="subject-header">
                  <h4>{{ subject.name }}</h4>
                  <span class="completion-rate">
                    {{ Math.round(subject.chapters.filter(c => c.completed).length / subject.chapters.length * 100) }}%
                  </span>
                </div>
                <el-progress 
                  :percentage="Math.round(subject.chapters.filter(c => c.completed).length / subject.chapters.length * 100)"
                  :stroke-width="10"
                  :color="getProgressColor(Math.round(subject.chapters.filter(c => c.completed).length / subject.chapters.length * 100))"
                />
                <div class="chapter-completion">
                  <span>{{ subject.chapters.filter(c => c.completed).length }}/{{ subject.chapters.length }} 章节完成</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 周计划 Tab -->
        <el-tab-pane label="📅 周计划" name="weekly">
          <div class="weekly-section">
            <div class="plan-header">
              <h3>本周学习计划</h3>
              <div class="plan-controls">
                <el-button type="primary" @click="generateWeeklyPlan">
                  <el-icon><Refresh /></el-icon>
                  重新生成计划
                </el-button>
              </div>
            </div>

            <div class="plan-content">
              <div class="goal-setting">
                <h4>🎯 学习目标设置</h4>
                <div class="goal-controls">
                  <div class="goal-item">
                    <label>每周目标(小时):</label>
                    <el-slider 
                      v-model="weeklyGoal" 
                      :min="10" 
                      :max="40" 
                      :step="5"
                      show-input
                    />
                  </div>
                  <div class="goal-item">
                    <label>每日学习(小时):</label>
                    <el-slider 
                      v-model="dailyStudyTime" 
                      :min="1" 
                      :max="8" 
                      :step="1"
                      show-input
                    />
                  </div>
                </div>
              </div>

              <div class="suggested-plan">
                <h4>📋 推荐学习安排</h4>
                <div class="plan-timeline">
                  <div class="timeline-day" v-for="day in 7" :key="day">
                    <div class="day-header">
                      <span class="day-name">第{{ day }}天</span>
                      <span class="time-estimate">{{ dailyStudyTime }}小时</span>
                    </div>
                    <div class="day-content">
                      <el-tag 
                        v-for="(subject, index) in subjects.slice(0, 2)" 
                        :key="index"
                        type="success"
                        size="small"
                        class="subject-tag"
                      >
                        {{ subject.name.split('').slice(0, 2).join('') }}
                      </el-tag>
                      <span class="more-indicator" v-if="subjects.length > 2">+{{ subjects.length - 2 }}更多</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 章节详情弹窗 -->
    <el-dialog 
      v-model="showChapterDetail" 
      :title="currentSubject?.chapters.find(c => c.id === selectedChapter)?.name"
      width="500px"
    >
      <div v-if="currentSubject && selectedChapter" class="chapter-detail">
        <div class="detail-item">
          <label>预计时长:</label>
          <span>{{ currentSubject.chapters.find(c => c.id === selectedChapter)?.duration }}分钟</span>
        </div>
        <div class="detail-item">
          <label>完成状态:</label>
          <el-tag :type="currentSubject.chapters.find(c => c.id === selectedChapter)?.completed ? 'success' : 'info'">
            {{ currentSubject.chapters.find(c => c.id === selectedChapter)?.completed ? '已完成' : '未开始' }}
          </el-tag>
        </div>
        <div class="detail-item">
          <label>学习建议:</label>
          <p>建议按照章节顺序学习，每完成一个章节后进行适当复习巩固。</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="showChapterDetail = false">关闭</el-button>
        <el-button 
          type="primary" 
          @click="toggleChapterCompletion(selectedChapter)"
        >
          {{ currentSubject?.chapters.find(c => c.id === selectedChapter)?.completed ? '重新开始' : '标记完成' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.learning-path-complete {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px 0;
}

.page-title {
  font-size: 2.5em;
  color: white;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  font-weight: 700;
}

.page-subtitle {
  font-size: 1.2em;
  color: rgba(255, 255, 255, 0.9);
  opacity: 0.9;
  font-weight: 400;
}

/* 统计概览 */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(0,0,0,0.15);
}

.stat-card.primary { border-left: 5px solid #4CAF50; }
.stat-card.success { border-left: 5px solid #FF6B6B; }
.stat-card.warning { border-left: 5px solid #FF9800; }
.stat-card.info { border-left: 5px solid #2196F3; }

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  font-size: 2.5em;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 2em;
  font-weight: 700;
  color: #333333;
  margin-bottom: 5px;
}

.stat-label {
  color: #666666;
  font-size: 1em;
}

/* 主要内容区域 */
.main-content {
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
  font-size: 1.1em;
  font-weight: 500;
  padding: 0 25px;
  height: 55px;
  line-height: 55px;
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

/* 学习概览样式 */
.overview-section {
  text-align: center;
}

.subject-selection {
  margin-bottom: 40px;
}

.subject-selection h3 {
  color: #333333;
  font-size: 1.8em;
  margin-bottom: 25px;
}

.selection-controls {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.subject-select {
  width: 300px;
}

/* 章节网格 */
.chapters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.chapter-card {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.chapter-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  border-color: #4CAF50;
}

.chapter-card.completed {
  background: #e8f5e8;
  border-color: #4CAF50;
}

.chapter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.chapter-info h4 {
  color: #333333;
  margin: 0 0 8px 0;
  font-size: 1.2em;
}

.duration {
  color: #666666;
  font-size: 0.9em;
}

/* 进度追踪样式 */
.progress-section {
  padding: 20px 0;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.progress-header h3 {
  color: #333333;
  font-size: 1.8em;
  margin: 0;
}

.progress-summary {
  display: flex;
  gap: 30px;
}

.summary-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.summary-item .label {
  color: #666666;
  font-weight: 500;
}

.summary-item .value {
  font-size: 1.3em;
  font-weight: 700;
}

.subjects-progress {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
}

.subject-progress-card {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 25px;
  border: 1px solid #eeeeee;
}

.subject-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.subject-header h4 {
  color: #333333;
  margin: 0;
  font-size: 1.3em;
}

.completion-rate {
  font-size: 1.2em;
  font-weight: 700;
  color: #4CAF50;
}

.chapter-completion {
  margin-top: 15px;
  text-align: center;
  color: #666666;
  font-size: 0.9em;
}

/* 周计划样式 */
.weekly-section {
  padding: 20px 0;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.plan-header h3 {
  color: #333333;
  font-size: 1.8em;
  margin: 0;
}

.goal-setting {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
}

.goal-setting h4 {
  color: #333333;
  margin-bottom: 20px;
  font-size: 1.3em;
}

.goal-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.goal-item {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.goal-item label {
  font-weight: 500;
  color: #333333;
}

.suggested-plan {
  background: white;
  border-radius: 15px;
  padding: 25px;
  border: 1px solid #eeeeee;
}

.suggested-plan h4 {
  color: #333333;
  margin-bottom: 20px;
  font-size: 1.3em;
}

.plan-timeline {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.timeline-day {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.day-name {
  font-weight: 600;
  color: #333333;
}

.time-estimate {
  font-size: 0.9em;
  color: #666666;
  background: #e0e0e0;
  padding: 2px 8px;
  border-radius: 10px;
}

.day-content {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;
}

.subject-tag {
  margin: 2px;
}

.more-indicator {
  font-size: 0.8em;
  color: #999999;
  margin-top: 5px;
  display: block;
}

/* 弹窗样式 */
.chapter-detail .detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eeeeee;
}

.chapter-detail .detail-item:last-child {
  border-bottom: none;
}

.chapter-detail .detail-item label {
  font-weight: 500;
  color: #333333;
}

.chapter-detail .detail-item p {
  color: #666666;
  margin: 10px 0 0 0;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .learning-path-complete {
    padding: 15px;
  }
  
  .page-title {
    font-size: 2em;
  }
  
  .stats-overview {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .main-content {
    padding: 20px;
  }
  
  .selection-controls {
    flex-direction: column;
  }
  
  .subject-select {
    width: 100%;
  }
  
  .chapters-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .subjects-progress {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .goal-controls {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .plan-timeline {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .path-tabs :deep(.el-tabs__item) {
    padding: 0 15px;
    font-size: 0.9em;
  }
}
</style>