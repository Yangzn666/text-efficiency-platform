<template>
  <div class="linear-algebra-practice">
    <!-- 练习控制面板 -->
    <div class="practice-control-panel" v-if="!linearAlgebraStore.isPracticing">
      <div class="panel-header">
        <h2>📐 线性代数专项练习</h2>
        <p>基于考研大纲的系统化练习平台</p>
      </div>
      
      <div class="practice-options">
        <!-- 章节选择 -->
        <div class="option-section">
          <h3>📚 按章节练习</h3>
          <div class="chapter-grid">
            <div 
              v-for="(stat, chapter) in linearAlgebraStore.chapterStats" 
              :key="chapter"
              class="chapter-card"
              @click="startChapterPractice(chapter)"
            >
              <div class="chapter-title">{{ chapter }}</div>
              <div class="chapter-stats">
                <div class="stat-item">
                  <span class="stat-number">{{ stat.completed }}/{{ stat.total }}</span>
                  <span class="stat-label">已完成</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ stat.accuracy }}%</span>
                  <span class="stat-label">准确率</span>
                </div>
              </div>
              <el-progress 
                :percentage="stat.accuracy" 
                :show-text="false"
                class="chapter-progress"
              />
            </div>
          </div>
        </div>
        
        <!-- 题型选择 -->
        <div class="option-section">
          <h3>📝 按题型练习</h3>
          <div class="type-grid">
            <div 
              v-for="type in ['选择题', '填空题', '计算题', '证明题']" 
              :key="type"
              class="type-card"
              @click="startTypePractice(type)"
            >
              <div class="type-icon">
                <el-icon v-if="type === '选择题'"><List /></el-icon>
                <el-icon v-else-if="type === '填空题'"><EditPen /></el-icon>
                <el-icon v-else-if="type === '计算题'"><Calculator /></el-icon>
                <el-icon v-else><Document /></el-icon>
              </div>
              <div class="type-name">{{ type }}</div>
              <div class="type-count">
                {{ getProblemsByType(type).length }}题
              </div>
            </div>
          </div>
        </div>
        
        <!-- 难度选择 -->
        <div class="option-section">
          <h3>💪 按难度练习</h3>
          <div class="difficulty-grid">
            <div 
              v-for="(stat, difficulty) in linearAlgebraStore.difficultyStats" 
              :key="difficulty"
              class="difficulty-card"
              :class="`difficulty-${difficulty}`"
              @click="startDifficultyPractice(difficulty)"
            >
              <div class="difficulty-header">
                <span class="difficulty-stars">
                  {{ '★'.repeat(getDifficultyLevel(difficulty)) }}
                </span>
                <span class="difficulty-name">{{ difficulty }}</span>
              </div>
              <div class="difficulty-stats">
                <div class="stat-item">
                  <span class="stat-number">{{ stat.completed }}/{{ stat.total }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 错题练习 -->
        <div class="option-section">
          <h3>❌ 错题重练</h3>
          <div class="wrong-problems-section">
            <div class="wrong-summary">
              <div class="summary-item">
                <span class="summary-number">{{ linearAlgebraStore.wrongProblems.length }}</span>
                <span class="summary-label">道错题</span>
              </div>
              <div class="summary-item">
                <span class="summary-number">{{ getReviewRate() }}%</span>
                <span class="summary-label">复习率</span>
              </div>
            </div>
            <el-button 
              v-if="linearAlgebraStore.wrongProblems.length > 0"
              type="danger" 
              @click="startWrongProblemsPractice"
              size="large"
            >
              开始错题练习
            </el-button>
            <el-button v-else disabled size="large">
              暂无错题
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 练习界面 -->
    <div class="practice-session" v-else>
      <!-- 进度条 -->
      <div class="session-header">
        <div class="session-info">
          <h3>{{ currentSession?.title }}</h3>
          <div class="progress-info">
            <span>第 {{ linearAlgebraStore.currentProblemIndex + 1 }} 题 / 共 {{ currentSession?.problems.length }} 题</span>
            <el-progress 
              :percentage="linearAlgebraStore.sessionProgress" 
              :show-text="false"
              class="session-progress"
            />
          </div>
        </div>
        <el-button @click="exitPractice">退出练习</el-button>
      </div>

      <!-- 题目显示 -->
      <div class="problem-container" v-if="linearAlgebraStore.currentProblem">
        <div class="problem-header">
          <div class="problem-meta">
            <el-tag :type="getProblemTypeTag(linearAlgebraStore.currentProblem.type)">
              {{ linearAlgebraStore.currentProblem.type }}
            </el-tag>
            <el-tag :type="getDifficultyTag(linearAlgebraStore.currentProblem.difficulty)">
              {{ linearAlgebraStore.currentProblem.difficulty }}
            </el-tag>
            <span class="problem-chapter">{{ linearAlgebraStore.currentProblem.chapter }}</span>
          </div>
          <div class="problem-title">
            {{ linearAlgebraStore.currentProblem.title }}
          </div>
        </div>

        <div class="problem-content">
          <div class="content-text" v-html="formatContent(linearAlgebraStore.currentProblem.content)"></div>
          
          <!-- 选择题选项 -->
          <div v-if="linearAlgebraStore.currentProblem.type === '选择题'" class="options-container">
            <div 
              v-for="(option, index) in linearAlgebraStore.currentProblem.options" 
              :key="index"
              class="option-item"
              :class="{ selected: selectedOption === String.fromCharCode(65 + index) }"
              @click="selectOption(String.fromCharCode(65 + index))"
            >
              <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
              <span class="option-content">{{ option.replace(/^[A-D]\.\s*/, '') }}</span>
            </div>
          </div>
          
          <!-- 填空题输入 -->
          <div v-else-if="linearAlgebraStore.currentProblem.type === '填空题'" class="fill-blank-container">
            <el-input
              v-model="fillBlankAnswer"
              placeholder="请输入答案"
              size="large"
              @keyup.enter="submitFillBlank"
            />
          </div>
        </div>

        <!-- 答题按钮 -->
        <div class="answer-actions">
          <el-button 
            v-if="linearAlgebraStore.currentProblem.type === '选择题'"
            type="primary" 
            @click="submitAnswer"
            :disabled="!selectedOption"
            size="large"
          >
            提交答案
          </el-button>
          
          <el-button 
            v-else-if="linearAlgebraStore.currentProblem.type === '填空题'"
            type="primary" 
            @click="submitFillBlank"
            :disabled="!fillBlankAnswer.trim()"
            size="large"
          >
            提交答案
          </el-button>
          
          <el-button 
            v-else
            type="primary" 
            @click="showSolution"
            size="large"
          >
            查看解答
          </el-button>
        </div>
      </div>

      <!-- 解答显示 -->
      <div v-if="showSolutionPanel" class="solution-panel">
        <div class="solution-header">
          <h4>📝 详细解答</h4>
          <el-button @click="closeSolution" size="small">关闭</el-button>
        </div>
        <div class="solution-content" v-html="formatContent(currentProblem?.solution || '')"></div>
        <div class="solution-actions">
          <el-button @click="moveToNextProblem">下一题</el-button>
        </div>
      </div>
    </div>

    <!-- 练习结果 -->
    <div v-if="showResults" class="practice-results">
      <div class="results-overlay">
        <div class="results-content">
          <div class="results-header">
            <h2>🎉 练习完成</h2>
          </div>
          
          <div class="results-stats">
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-info">
                <div class="stat-number">{{ correctCount }}</div>
                <div class="stat-label">正确题数</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">📈</div>
              <div class="stat-info">
                <div class="stat-number">{{ currentSession?.score }}%</div>
                <div class="stat-label">正确率</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">⏱️</div>
              <div class="stat-info">
                <div class="stat-number">{{ formatTime(totalTime) }}</div>
                <div class="stat-label">用时</div>
              </div>
            </div>
          </div>
          
          <div class="results-actions">
            <el-button @click="closeResults">继续练习</el-button>
            <el-button type="primary" @click="reviewWrongProblems">查看错题</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useLinearAlgebraStore } from '@/stores/linearAlgebra'
import type { LinearAlgebraProblem } from '@/stores/linearAlgebra'

const linearAlgebraStore = useLinearAlgebraStore()

// 练习状态
const selectedOption = ref('')
const fillBlankAnswer = ref('')
const showSolutionPanel = ref(false)
const showResults = ref(false)
const correctCount = ref(0)
const totalTime = ref(0)

// 计算属性
const currentSession = computed(() => linearAlgebraStore.currentSession)
const currentProblem = computed(() => linearAlgebraStore.currentProblem)

// 方法
const formatContent = (content: string) => {
  // 简单的LaTeX渲染（实际项目中应该使用完整的KaTeX库）
  return content
    .replace(/\\\begin\{([^}]+)\}/g, '<div class="latex-block">')
    .replace(/\\\end\{([^}]+)\}/g, '</div>')
    .replace(/\\begin\{([^}]+)\}/g, '<div class="latex-inline">')
    .replace(/\\end\{([^}]+)\}/g, '</div>')
    .replace(/\$(.*?)\$/g, '<span class="math-inline">$1</span>')
}

const getProblemsByType = (type: string) => {
  return linearAlgebraStore.getProblemsByType(type)
}

const getDifficultyLevel = (difficulty: string) => {
  const levels: Record<string, number> = {
    '基础': 1,
    '中等': 2,
    '困难': 3
  }
  return levels[difficulty] || 1
}

const getReviewRate = () => {
  if (linearAlgebraStore.wrongProblems.length === 0) return 100
  const reviewed = linearAlgebraStore.wrongProblems.filter(wp => wp.wrongCount <= 1).length
  return Math.round((reviewed / linearAlgebraStore.wrongProblems.length) * 100)
}

const getProblemTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    '选择题': 'primary',
    '填空题': 'success',
    '计算题': 'warning',
    '证明题': 'danger'
  }
  return tagMap[type] || ''
}

const getDifficultyTag = (difficulty: string) => {
  const tagMap: Record<string, string> = {
    '基础': 'success',
    '中等': 'warning',
    '困难': 'danger'
  }
  return tagMap[difficulty] || ''
}

const startChapterPractice = (chapter: string) => {
  const problems = linearAlgebraStore.getProblemsByChapter(chapter)
  if (problems.length === 0) {
    ElMessage.warning('该章节暂无题目')
    return
  }
  
  const problemIds = problems.map(p => p.id)
  linearAlgebraStore.startPractice(problemIds, `章节练习：${chapter}`)
  ElMessage.success('开始章节练习')
}

const startTypePractice = (type: string) => {
  const problems = linearAlgebraStore.getProblemsByType(type)
  if (problems.length === 0) {
    ElMessage.warning('该题型暂无题目')
    return
  }
  
  const problemIds = problems.map(p => p.id)
  linearAlgebraStore.startPractice(problemIds, `题型练习：${type}`)
  ElMessage.success('开始题型练习')
}

const startDifficultyPractice = (difficulty: string) => {
  const problems = linearAlgebraStore.getProblemsByDifficulty(difficulty)
  if (problems.length === 0) {
    ElMessage.warning('该难度暂无题目')
    return
  }
  
  const problemIds = problems.map(p => p.id)
  linearAlgebraStore.startPractice(problemIds, `难度练习：${difficulty}`)
  ElMessage.success('开始难度练习')
}

const startWrongProblemsPractice = () => {
  const wrongProblems = linearAlgebraStore.getWrongProblems()
  if (wrongProblems.length === 0) {
    ElMessage.warning('暂无错题')
    return
  }
  
  const problemIds = wrongProblems.map(p => p.id)
  linearAlgebraStore.startPractice(problemIds, '错题重练')
  ElMessage.success('开始错题练习')
}

const selectOption = (option: string) => {
  selectedOption.value = option
}

const submitAnswer = () => {
  if (!selectedOption.value) return
  
  linearAlgebraStore.submitAnswer(selectedOption.value)
  selectedOption.value = ''
  
  const isCorrect = linearAlgebraStore.checkAnswer(
    linearAlgebraStore.currentProblem!, 
    selectedOption.value
  )
  
  if (isCorrect) {
    ElMessage.success('回答正确！')
  } else {
    ElMessage.error('回答错误')
  }
}

const submitFillBlank = () => {
  if (!fillBlankAnswer.value.trim()) return
  
  linearAlgebraStore.submitAnswer(fillBlankAnswer.value)
  
  const isCorrect = linearAlgebraStore.checkAnswer(
    linearAlgebraStore.currentProblem!, 
    fillBlankAnswer.value
  )
  
  if (isCorrect) {
    ElMessage.success('回答正确！')
  } else {
    ElMessage.error('回答错误')
  }
  
  fillBlankAnswer.value = ''
}

const showSolution = () => {
  showSolutionPanel.value = true
}

const closeSolution = () => {
  showSolutionPanel.value = false
}

const moveToNextProblem = () => {
  linearAlgebraStore.moveToNextProblem()
  closeSolution()
}

const exitPractice = () => {
  linearAlgebraStore.finishPractice()
  ElMessage.info('已退出练习')
}

const closeResults = () => {
  showResults.value = false
}

const reviewWrongProblems = () => {
  closeResults()
  startWrongProblemsPractice()
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}分${secs}秒`
}

// 监听练习状态变化
const checkPracticeStatus = () => {
  if (currentSession.value && currentSession.value.endTime) {
    // 练习结束，显示结果
    correctCount.value = currentSession.value.problems.filter(problemId => {
      const problem = linearAlgebraStore.problems.find(p => p.id === problemId)
      return problem?.completed && linearAlgebraStore.checkAnswer(problem, problem.userAnswer || '')
    }).length
    
    totalTime.value = currentSession.value.totalTime || 0
    showResults.value = true
  }
}

// 监听器
watch(() => linearAlgebraStore.currentSession, checkPracticeStatus)

onMounted(() => {
  linearAlgebraStore.loadProblems()
})
</script>

<style scoped>
.linear-algebra-practice {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.practice-control-panel {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
}

.panel-header {
  text-align: center;
  margin-bottom: 40px;
}

.panel-header h2 {
  color: #333;
  margin-bottom: 15px;
  font-size: 2em;
}

.panel-header p {
  color: #666;
  font-size: 1.2em;
}

.option-section {
  margin-bottom: 40px;
}

.option-section h3 {
  color: #333;
  margin: 0 0 25px 0;
  font-size: 1.4em;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.chapter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.chapter-card {
  background: #fafafa;
  border-radius: 15px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.chapter-card:hover {
  background: #f0f8ff;
  border-color: #ffc53d;
  transform: translateY(-5px);
}

.chapter-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  font-size: 1.1em;
}

.chapter-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.3em;
  font-weight: 700;
  color: #16345c;
}

.stat-label {
  font-size: 0.9em;
  color: #666;
}

.chapter-progress {
  margin-top: 15px;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.type-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.type-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.type-icon {
  font-size: 2.5em;
  margin-bottom: 15px;
  color: #16345c;
}

.type-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  font-size: 1.1em;
}

.type-count {
  color: #666;
  font-size: 0.9em;
}

.difficulty-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.difficulty-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.difficulty-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.difficulty-card.difficulty-基础 {
  border-left: 4px solid #4CAF50;
}

.difficulty-card.difficulty-中等 {
  border-left: 4px solid #FF9800;
}

.difficulty-card.difficulty-困难 {
  border-left: 4px solid #F44336;
}

.difficulty-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.difficulty-stars {
  color: #FFD700;
  font-size: 1.2em;
}

.difficulty-name {
  font-weight: 600;
  color: #333;
  font-size: 1.1em;
}

.wrong-problems-section {
  background: #fff5f5;
  border-radius: 15px;
  padding: 25px;
  text-align: center;
}

.summary-item {
  display: inline-block;
  margin: 0 30px;
}

.summary-number {
  display: block;
  font-size: 2em;
  font-weight: 800;
  color: #F44336;
}

.summary-label {
  color: #666;
  font-size: 1em;
}

.practice-session {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.session-info h3 {
  color: #333;
  margin: 0 0 15px 0;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.session-progress {
  flex: 1;
  max-width: 300px;
}

.problem-container {
  margin-bottom: 30px;
}

.problem-header {
  margin-bottom: 25px;
}

.problem-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.problem-chapter {
  color: #666;
  font-size: 0.9em;
}

.problem-title {
  font-size: 1.4em;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.problem-content {
  background: #fafafa;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 25px;
}

.content-text {
  font-size: 1.1em;
  line-height: 1.8;
  color: #333;
}

.options-container {
  margin-top: 20px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  margin-bottom: 10px;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.option-item:hover {
  background: #f0f8ff;
  border-color: #ffc53d;
}

.option-item.selected {
  background: #eef3fa;
  border-color: #ffc53d;
}

.option-letter {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #16345c;
  color: white;
  border-radius: 50%;
  font-weight: 600;
}

.option-content {
  flex: 1;
  font-size: 1.1em;
}

.fill-blank-container {
  margin-top: 20px;
  max-width: 400px;
}

.answer-actions {
  text-align: center;
}

.solution-panel {
  background: #f8f9ff;
  border-radius: 15px;
  padding: 25px;
  margin-top: 20px;
  border: 1px solid #e0e7ff;
}

.solution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.solution-header h4 {
  color: #333;
  margin: 0;
}

.solution-content {
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  line-height: 1.8;
  color: #333;
}

.practice-results {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.results-overlay {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.results-header h2 {
  color: #333;
  margin: 0 0 30px 0;
  font-size: 2em;
}

.results-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #fafafa;
  border-radius: 15px;
}

.stat-icon {
  font-size: 2.5em;
}

.stat-number {
  font-size: 2em;
  font-weight: 800;
  color: #16345c;
}

.stat-label {
  color: #666;
  font-size: 1em;
}

.results-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

/* LaTeX样式 */
.latex-block {
  display: block;
  text-align: center;
  margin: 15px 0;
  padding: 15px;
  background: white;
  border-radius: 8px;
  font-family: 'Times New Roman', serif;
}

.latex-inline {
  display: inline-block;
  font-family: 'Times New Roman', serif;
}

.math-inline {
  font-family: 'Times New Roman', serif;
  font-style: italic;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .linear-algebra-practice {
    padding: 15px;
  }
  
  .chapter-grid,
  .type-grid,
  .difficulty-grid {
    grid-template-columns: 1fr;
  }
  
  .session-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .progress-info {
    width: 100%;
  }
  
  .session-progress {
    max-width: 100%;
  }
  
  .results-stats {
    grid-template-columns: 1fr;
  }
  
  .results-actions {
    flex-direction: column;
  }
}
</style>