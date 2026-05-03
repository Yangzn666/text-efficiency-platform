<template>
  <div class="advanced-math-exercises">
    <!-- 章节选择 -->
    <div class="chapter-selector" v-if="!selectedChapter">
      <div class="selector-header">
        <h2>📚 高等数学习题练习</h2>
        <p>选择章节开始练习，巩固知识点</p>
      </div>
      
      <div class="chapter-grid">
        <div 
          v-for="chapter in exerciseChapters" 
          :key="chapter.id"
          class="chapter-card"
          @click="selectChapter(chapter)"
        >
          <div class="chapter-icon">
            <span class="chapter-number">{{ chapter.order }}</span>
          </div>
          <div class="chapter-info">
            <h3>{{ chapter.title }}</h3>
            <div class="chapter-stats">
              <span class="problems-count">{{ chapter.totalProblems }}道题目</span>
              <span class="completion-rate">{{ Math.round((chapter.completedProblems / chapter.totalProblems) * 100) }}% 完成</span>
            </div>
            <el-progress 
              :percentage="Math.round((chapter.completedProblems / chapter.totalProblems) * 100)"
              :show-text="false"
              class="chapter-progress"
            />
          </div>
          <div class="chapter-action">
            <el-button type="primary" round>
              开始练习
              <el-icon class="arrow-icon"><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 题目练习界面 -->
    <div class="exercise-interface" v-else>
      <!-- 顶部导航 -->
      <div class="exercise-header">
        <el-button @click="backToChapters" type="primary" plain>
          <el-icon><ArrowLeft /></el-icon>
          返回章节选择
        </el-button>
        <div class="chapter-info-display">
          <h2>{{ selectedChapter.title }}</h2>
          <div class="progress-info">
            <span>题目 {{ currentProblemIndex + 1 }} / {{ currentChapterProblems.length }}</span>
            <span>已完成 {{ selectedChapter.completedProblems }} / {{ selectedChapter.totalProblems }}</span>
          </div>
        </div>
        <div class="mode-toggle">
          <el-switch
            v-model="practiceMode"
            active-text="练习模式"
            inactive-text="测试模式"
            @change="switchMode"
          />
        </div>
      </div>

      <!-- 题目显示区域 -->
      <div class="problem-area" v-if="currentProblem">
        <div class="problem-card">
          <div class="problem-header">
            <div class="problem-meta">
              <el-tag :type="getDifficultyTag(currentProblem.difficulty)">
                {{ currentProblem.difficulty }}
              </el-tag>
              <el-tag>{{ currentProblem.type }}</el-tag>
              <div class="problem-tags">
                <el-tag 
                  v-for="tag in currentProblem.tags.slice(0, 3)" 
                  :key="tag" 
                  type="info" 
                  size="small"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
            <h3 class="problem-title">{{ currentProblem.title }}</h3>
          </div>
          
          <div class="problem-content">
            <div class="content-text" v-html="renderMathContent(currentProblem.content)"></div>
          </div>

          <!-- 答案输入区域 -->
          <div class="answer-section">
            <div class="answer-input" v-if="!showSolution">
              <el-input
                v-model="userAnswer"
                type="textarea"
                :rows="4"
                placeholder="请输入你的答案..."
                v-if="currentProblem.type !== '选择题'"
              />
              <div class="choice-options" v-else>
                <el-radio-group v-model="selectedChoice">
                  <el-radio 
                    v-for="(option, index) in choiceOptions" 
                    :key="index" 
                    :label="String.fromCharCode(65 + index)"
                  >
                    {{ String.fromCharCode(65 + index) }}. {{ option }}
                  </el-radio>
                </el-radio-group>
              </div>
              
              <div class="answer-actions">
                <el-button 
                  type="primary" 
                  @click="submitAnswer"
                  :disabled="!canSubmit"
                >
                  提交答案
                </el-button>
                <el-button @click="showHint" v-if="practiceMode">
                  💡 查看提示
                </el-button>
              </div>
            </div>

            <!-- 答案解析区域 -->
            <div class="solution-section" v-if="showSolution">
              <div class="user-answer-display" v-if="userSubmitted">
                <h4>你的答案：</h4>
                <div class="answer-content">
                  {{ userAnswer || selectedChoice }}
                </div>
                <div class="answer-status" :class="{ correct: isCorrect, incorrect: !isCorrect }">
                  {{ isCorrect ? '✅ 回答正确' : '❌ 回答错误' }}
                </div>
              </div>
              
              <div class="official-solution">
                <h4>📝 详细解析：</h4>
                <div class="solution-content" v-html="renderMathContentWithHighlight(currentProblem.solution)"></div>
                <div class="solution-tips" v-if="shouldShowTips">
                  <h5>💡 解题要点：</h5>
                  <ul>
                    <li v-for="tip in getSolutionTips(currentProblem.solution)" :key="tip">{{ tip }}</li>
                  </ul>
                </div>
              </div>
              
              <div class="solution-actions">
                <el-button 
                  v-if="currentProblemIndex < currentChapterProblems.length - 1"
                  type="primary" 
                  @click="nextProblem"
                >
                  下一题
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
                <el-button 
                  v-else
                  type="success" 
                  @click="finishChapter"
                >
                  完成本章
                </el-button>
                <el-button @click="resetProblem">重新作答</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 进度条 -->
      <div class="exercise-progress">
        <el-progress 
          :percentage="Math.round(((currentProblemIndex + 1) / currentChapterProblems.length) * 100)"
          :stroke-width="10"
          striped
          striped-flow
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import type { ExerciseChapter, MathProblem } from '@/utils/exerciseParser'
import { loadAllExerciseChapters } from '@/utils/exerciseParser'

// 状态
const exerciseChapters = ref<ExerciseChapter[]>([])
const selectedChapter = ref<ExerciseChapter | null>(null)
const currentProblemIndex = ref(0)
const userAnswer = ref('')
const selectedChoice = ref('')
const showSolution = ref(false)
const userSubmitted = ref(false)
const isCorrect = ref(false)
const practiceMode = ref(true)

// 计算属性
const currentChapterProblems = computed(() => {
  return selectedChapter.value?.problems || []
})

const currentProblem = computed(() => {
  return currentChapterProblems.value[currentProblemIndex.value] || null
})

const canSubmit = computed(() => {
  if (!currentProblem.value) return false
  if (currentProblem.value.type === '选择题') {
    return selectedChoice.value !== ''
  }
  return userAnswer.value.trim() !== ''
})

const choiceOptions = computed(() => {
  // 模拟选择题选项
  if (currentProblem.value?.type === '选择题') {
    return ['选项A内容', '选项B内容', '选项C内容', '选项D内容']
  }
  return []
})

// 方法
const loadExercises = async () => {
  try {
    const chapters = await loadAllExerciseChapters()
    exerciseChapters.value = chapters
    console.log(`成功加载${chapters.length}个习题章节`)
  } catch (error) {
    console.error('加载习题失败:', error)
    ElMessage.error('加载习题失败')
  }
}

const selectChapter = (chapter: ExerciseChapter) => {
  selectedChapter.value = chapter
  currentProblemIndex.value = 0
  resetProblem()
}

const backToChapters = () => {
  selectedChapter.value = null
  resetProblem()
}

const submitAnswer = () => {
  if (!currentProblem.value) return
  
  userSubmitted.value = true
  showSolution.value = true
  
  // 简单的答案判断逻辑
  const userAns = currentProblem.value.type === '选择题' ? selectedChoice.value : userAnswer.value
  isCorrect.value = checkAnswer(userAns, currentProblem.value.solution)
  
  // 更新题目状态
  currentProblem.value.attempts += 1
  currentProblem.value.correct = isCorrect.value
  currentProblem.value.mastered = isCorrect.value
  
  // 更新章节进度
  if (selectedChapter.value) {
    selectedChapter.value.completedProblems = selectedChapter.value.problems
      .filter(p => p.mastered).length
  }
  
  ElMessage({
    message: isCorrect.value ? '回答正确！🎉' : '回答错误，继续努力！💪',
    type: isCorrect.value ? 'success' : 'error'
  })
}

const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
  // 简化的答案检查逻辑
  const normalizedUser = userAnswer.toLowerCase().replace(/\s/g, '')
  const normalizedCorrect = correctAnswer.toLowerCase().replace(/\s/g, '')
  
  // 对于选择题，直接比较选项
  if (currentProblem.value?.type === '选择题') {
    return normalizedUser === 'a' || normalizedUser === 'b' // 模拟正确答案
  }
  
  // 对于其他题型，简单包含检查
  return normalizedCorrect.includes(normalizedUser) || normalizedUser.includes(normalizedCorrect.substring(0, 10))
}

const nextProblem = () => {
  if (currentProblemIndex.value < currentChapterProblems.value.length - 1) {
    currentProblemIndex.value++
    resetProblem()
  }
}

const resetProblem = () => {
  userAnswer.value = ''
  selectedChoice.value = ''
  showSolution.value = false
  userSubmitted.value = false
  isCorrect.value = false
}

const showHint = () => {
  if (currentProblem.value) {
    ElMessage.info('提示：仔细分析题目条件，运用相关公式和定理')
  }
}

const finishChapter = () => {
  ElMessage.success(`${selectedChapter.value?.title}练习完成！`)
  backToChapters()
}

const switchMode = (mode: boolean) => {
  practiceMode.value = mode
  ElMessage.info(mode ? '已切换到练习模式' : '已切换到测试模式')
}

const getDifficultyTag = (difficulty: string) => {
  const tagMap: Record<string, string> = {
    '基础': 'success',
    '中等': 'warning',
    '困难': 'danger'
  }
  return tagMap[difficulty] || 'info'
}

const renderMathContent = (content: string) => {
  // 处理LaTeX公式
  let processed = content
    .replace(/\$\$(.*?)\$\$/gs, (match, formula) => {
      try {
        return katex.renderToString(formula.trim(), { displayMode: true })
      } catch (e) {
        return match
      }
    })
    .replace(/\$(.*?)\$/g, (match, formula) => {
      try {
        return katex.renderToString(formula.trim(), { displayMode: false })
      } catch (e) {
        return match
      }
    })
  
  // 处理换行
  processed = processed.replace(/\n/g, '<br>')
  
  return processed
}

const renderMathContentWithHighlight = (content: string) => {
  // 增强版渲染，添加关键词高亮
  let processed = renderMathContent(content)
  
  // 高亮重要词汇
  const highlightWords = ['因此', '所以', '由于', '因为', '综上所述', '答案']
  highlightWords.forEach(word => {
    const regex = new RegExp(`(${word})`, 'g')
    processed = processed.replace(regex, '<span class="highlight-keyword">$1</span>')
  })
  
  return processed
}

const shouldShowTips = computed(() => {
  return currentProblem.value && currentProblem.value.solution.length > 50
})

const getSolutionTips = (solution: string) => {
  const tips: string[] = []
  
  // 基于解析内容提取要点
  if (solution.includes('因此') || solution.includes('所以')) {
    tips.push('注意最终结论的得出过程')
  }
  if (solution.includes('由于') || solution.includes('因为')) {
    tips.push('理解前提条件的重要性')
  }
  if (solution.includes('计算') || solution.includes('求')) {
    tips.push('仔细检查计算步骤')
  }
  if (solution.includes('证明') || solution.includes('证')) {
    tips.push('关注逻辑推理的严密性')
  }
  
  return tips.length > 0 ? tips : ['仔细理解解题思路和方法']
}

onMounted(() => {
  loadExercises()
})
</script>

<style scoped>
.advanced-math-exercises {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 章节选择界面 */
.chapter-selector {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
}

.selector-header {
  text-align: center;
  margin-bottom: 40px;
}

.selector-header h2 {
  color: #333;
  font-size: 2em;
  margin-bottom: 15px;
}

.selector-header p {
  color: #666;
  font-size: 1.1em;
}

.chapter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
}

.chapter-card {
  background: #fafafa;
  border-radius: 15px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: 20px;
}

.chapter-card:hover {
  background: #f0f8ff;
  border-color: #667eea;
  transform: translateY(-5px);
}

.chapter-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chapter-number {
  color: white;
  font-size: 1.5em;
  font-weight: bold;
}

.chapter-info {
  flex-grow: 1;
}

.chapter-info h3 {
  color: #333;
  margin: 0 0 15px 0;
  font-size: 1.3em;
}

.chapter-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 0.9em;
  color: #666;
}

.chapter-progress {
  margin-bottom: 15px;
}

.chapter-action .el-button {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
}

.arrow-icon {
  margin-left: 8px;
  transition: transform 0.2s ease;
}

.chapter-card:hover .arrow-icon {
  transform: translateX(5px);
}

/* 练习界面 */
.exercise-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 25px 30px;
  border-radius: 15px;
  margin-bottom: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.chapter-info-display h2 {
  color: #333;
  margin: 0 0 10px 0;
  font-size: 1.5em;
}

.progress-info {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 0.9em;
}

.problem-area {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 25px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
}

.problem-card {
  background: #fafafa;
  border-radius: 15px;
  padding: 30px;
}

.problem-header {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 2px solid #eee;
}

.problem-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.problem-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.problem-title {
  color: #333;
  font-size: 1.4em;
  margin: 0;
}

.problem-content {
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  border-left: 4px solid #667eea;
}

.content-text {
  line-height: 1.8;
  color: #333;
  font-size: 1.1em;
}

.answer-section {
  background: white;
  border-radius: 10px;
  padding: 25px;
}

.choice-options {
  margin-bottom: 20px;
}

.answer-actions, .solution-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.user-answer-display {
  background: #e3f2fd;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.user-answer-display h4 {
  color: #333;
  margin: 0 0 15px 0;
}

.answer-content {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-family: monospace;
}

.answer-status {
  font-weight: bold;
  font-size: 1.1em;
}

.answer-status.correct {
  color: #4CAF50;
}

.answer-status.incorrect {
  color: #F44336;
}

.official-solution {
  background: #fff8e1;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.official-solution h4 {
  color: #333;
  margin: 0 0 15px 0;
}

.solution-content {
  line-height: 1.8;
  color: #333;
}

.solution-content .highlight-keyword {
  background-color: #fff3cd;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: bold;
  color: #856404;
}

.solution-tips {
  background: #e7f3ff;
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
  border-left: 4px solid #007bff;
}

.solution-tips h5 {
  color: #007bff;
  margin: 0 0 10px 0;
  font-size: 1em;
}

.solution-tips ul {
  margin: 0;
  padding-left: 20px;
}

.solution-tips li {
  margin-bottom: 5px;
  color: #333;
}

.exercise-progress {
  background: white;
  padding: 20px 30px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .advanced-math-exercises {
    padding: 15px;
  }
  
  .chapter-grid {
    grid-template-columns: 1fr;
  }
  
  .exercise-header {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
  
  .problem-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .answer-actions, .solution-actions {
    flex-direction: column;
  }
  
  .chapter-card {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
}
</style>