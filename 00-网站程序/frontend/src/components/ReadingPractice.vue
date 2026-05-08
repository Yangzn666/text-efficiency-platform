<template>
  <div class="reading-practice">
    <div class="practice-header">
      <h2 class="practice-title">📖 考研英语一真题阅读</h2>
      <p class="practice-subtitle">Part A · 传统阅读 · 按题型分类整理</p>
    </div>

    <!-- 题型标签切换 -->
    <div class="section-tabs">
      <el-tabs v-model="activeSection" type="card" size="large">
        <!-- 已删除传统阅读，只保留完型填空和新题型 -->
        <el-tab-pane label="✍️ 完型填空" name="Use of English"></el-tab-pane>
        <el-tab-pane label="📝 新题型" name="New Question Types"></el-tab-pane>
      </el-tabs>
    </div>

    <!-- 筛选器 -->
    <div class="filter-section">
      <el-select v-model="selectedYear" placeholder="选择年份" size="large" @change="loadData">
        <el-option label="全部年份" value="all" />
        <el-option
          v-for="year in availableYears"
          :key="year"
          :label="`${year}年`"
          :value="year"
        />
      </el-select>
      
      <el-select v-model="selectedQuestionType" placeholder="选择题型" size="large" @change="filterQuestions">
        <el-option label="全部题型" value="all" />
        <el-option label="细节题" value="细节题" />
        <el-option label="主旨题" value="主旨题" />
        <el-option label="推理题" value="推理题" />
        <el-option label="词义题" value="词义题" />
        <el-option label="态度题" value="态度题" />
      </el-select>
      
      <el-button type="primary" size="large" @click="importQuestions">
        <el-icon><Upload /></el-icon>
        导入题目
      </el-button>
    </div>



    <!-- 按题型分组展示（新题型） -->
    <div v-if="activeSection === 'New Question Types'" class="type-groups">
      <div 
        v-for="type in questionTypes" 
        :key="type"
        class="type-group"
      >
        <div class="group-header" @click="toggleGroup(type)">
          <div class="group-title">
            <el-icon class="expand-icon" :class="{ 'expanded': expandedGroups.includes(type) }">
              <ArrowRight />
            </el-icon>
            <el-tag size="large" :type="getQuestionTypeColor(type)">{{ type }}</el-tag>
            <span class="group-count">{{ getQuestionsByType(type).length }} 题</span>
            <el-tag v-if="getGroupStats(type).total > 0" type="success" size="small">
              答对 {{ getGroupStats(type).correct }}/{{ getGroupStats(type).total }}
            </el-tag>
          </div>
        </div>

        <div v-show="expandedGroups.includes(type)" class="questions-list">
          <div 
            v-for="(question, idx) in getQuestionsByType(type)" 
            :key="idx"
            class="question-card"
          >
            <!-- 题目信息 -->
            <div class="question-meta">
              <el-tag size="small">{{ question.year }}年</el-tag>
              <el-tag v-if="question.section" size="small" type="info">{{ question.section }}</el-tag>
              <el-tag v-if="question.number" size="small" type="warning">第{{ question.number }}题</el-tag>
              <el-tag v-if="question.userAnswer" :type="question.userAnswer === question.correctAnswer ? 'success' : 'danger'" size="small">
                {{ question.userAnswer === question.correctAnswer ? '✓ 正确' : '✗ 错误' }}
              </el-tag>
            </div>

            <!-- 题干 -->
            <div class="question-stem">
              {{ question.stem }}
            </div>

            <!-- 选项（如果有） -->
            <div v-if="question.options && question.options.length > 0" class="options-list">
              <div 
                v-for="option in question.options" 
                :key="option.label"
                class="option-item"
                :class="{ 
                  'correct': option.label === question.correctAnswer,
                  'user-wrong': question.userAnswer && question.userAnswer === option.label && option.label !== question.correctAnswer
                }"
              >
                <span class="option-label">{{ option.label }}.</span>
                <span class="option-text">{{ option.text }}</span>
                <el-icon v-if="option.label === question.correctAnswer" class="correct-icon">
                  <CircleCheck />
                </el-icon>
                <el-icon v-if="question.userAnswer && question.userAnswer === option.label && option.label !== question.correctAnswer" class="wrong-icon">
                  <CircleClose />
                </el-icon>
              </div>
            </div>

            <!-- 用户答案和正确答案 -->
            <div class="answer-comparison">
              <div class="user-answer" v-if="question.userAnswer">
                <span class="label">你的答案：</span>
                <span :class="question.userAnswer === question.correctAnswer ? 'correct-text' : 'wrong-text'">{{ question.userAnswer }}</span>
              </div>
              <div class="correct-answer">
                <span class="label">正确答案：</span>
                <span class="answer">{{ question.correctAnswer }}</span>
              </div>
            </div>

            <!-- 答案解析 -->
            <div class="analysis-section">
              <h5>📖 答案解析：</h5>
              <p>{{ question.analysis }}</p>
            </div>

            <!-- 错误选项分析（如果用户答错） -->
            <div v-if="question.userAnswer && question.userAnswer !== question.correctAnswer && question.errorAnalysis" class="error-analysis-section">
              <h5 class="error-title">❌ 为什么你选的答案不对</h5>
              <div class="error-item">
                <span class="error-label">你选了 {{ question.userAnswer }}：</span>
                <span class="error-explanation">{{ question.errorAnalysis[question.userAnswer] || '该选项不符合语境' }}</span>
              </div>
              <div class="correct-comparison">
                <span class="correct-label">✓ 正确答案 {{ question.correctAnswer }}：</span>
                <span class="correct-explanation">{{ getCorrectOptionExplanation(question) }}</span>
              </div>
            </div>

            <!-- 解题技巧 -->
            <div v-if="question.tips" class="tips-section">
              <h5>🎯 解题技巧：</h5>
              <p>{{ question.tips }}</p>
            </div>

            <!-- 定位句 -->
            <div v-if="question.location" class="location-section">
              <h5>📍 原文定位：</h5>
              <blockquote>{{ question.location }}</blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 完型填空 -->
    <div v-if="activeSection === 'Use of English' && clozeQuestions.length > 0" class="cloze-section">
      <div class="cloze-header">
        <h3 class="cloze-title"> {{ clozeYear }}年考研英语一 Use of English</h3>
        <p class="cloze-subtitle">完形填空 · 共{{ clozeQuestions.length }}题 · 满分10分</p>
      </div>

      <!-- 完型填空大题容器（可折叠，包含原文和题目） -->
      <div class="cloze-year-group">
        <div 
          class="year-header"
          :class="{ 'expanded': expandedCloze }"
          @click="expandedCloze = !expandedCloze"
        >
          <el-icon class="expand-icon" :class="{ 'rotated': expandedCloze }">
            <ArrowRight />
          </el-icon>
          <span class="year-text">{{ clozeYear }}年完型填空</span>
          <el-tag type="info" size="small">{{ clozeQuestions.length }}题</el-tag>
          <el-button 
            type="warning" 
            size="small"
            @click.stop="openIntensiveReading('Use of English', clozeYear)"
          >
             精读
          </el-button>
        </div>

        <div v-show="expandedCloze" class="year-content">
          <!-- 文章原文 -->
          <div class="article-section">
            <div class="section-title"> 文章原文</div>
            <div class="article-content" v-html="clozeArticle"></div>
          </div>

          <!-- 题目列表 -->
          <div class="cloze-questions">
            <div class="section-title">❓ 题目</div>
            
            <div 
              v-for="(question, idx) in clozeQuestions" 
              :key="idx"
              class="cloze-question-item"
            >
              <!-- 题号和题干 -->
              <div class="question-header">
                <div 
                  class="cloze-number"
                  :class="{
                    'correct': question.userAnswer && question.userAnswer === question.correctAnswer,
                    'wrong': question.userAnswer && question.userAnswer !== question.correctAnswer
                  }"
                >
                  {{ question.number }}
                </div>
                <div class="question-stem-text">{{ question.stem }}</div>
                <el-button 
                  size="small" 
                  type="primary" 
                  plain
                  @click="toggleQuestionExpand(idx)"
                >
                  {{ expandedQuestions.includes(idx) ? '收起' : '查看答案' }}
                </el-button>
              </div>

              <!-- 展开的内容：选项、答案、解析 -->
              <div v-show="expandedQuestions.includes(idx)" class="question-detail">
                <!-- 选项（横向排列） -->
                <div v-if="question.options && question.options.length > 0" class="cloze-options">
                  <div 
                    v-for="option in question.options" 
                    :key="option.label"
                    class="cloze-option"
                    :class="{
                      'correct': option.label === question.correctAnswer,
                      'user-wrong': question.userAnswer === option.label && option.label !== question.correctAnswer
                    }"
                  >
                    <span class="option-label">{{ option.label }}.</span>
                    <span class="option-text">{{ option.text }}</span>
                    <el-icon v-if="option.label === question.correctAnswer" class="icon-correct">
                      <CircleCheck />
                    </el-icon>
                    <el-icon v-if="question.userAnswer === option.label && option.label !== question.correctAnswer" class="icon-wrong">
                      <CircleClose />
                    </el-icon>
                  </div>
                </div>

                <!-- 答案对比 -->
                <div v-if="question.userAnswer" class="cloze-answer-comparison">
                  <div class="answer-box user-answer">
                    <span class="label">你的答案：</span>
                    <span :class="question.userAnswer === question.correctAnswer ? 'text-correct' : 'text-wrong'">
                      {{ question.userAnswer }}
                    </span>
                    <el-tag v-if="question.userAnswer === question.correctAnswer" type="success" size="small">✓ 正确</el-tag>
                    <el-tag v-else type="danger" size="small">✗ 错误</el-tag>
                  </div>
                  <div class="answer-box correct-answer">
                    <span class="label">正确答案：</span>
                    <span class="text-correct">{{ question.correctAnswer }}</span>
                  </div>
                </div>

                <!-- 答案解析 -->
                <div class="cloze-analysis">
                  <div class="analysis-title"> 解析</div>
                  <p>{{ question.analysis }}</p>
                </div>

                <!-- 错误选项分析（仅答错时显示） -->
                <div 
                  v-if="question.userAnswer && question.userAnswer !== question.correctAnswer && question.errorAnalysis" 
                  class="cloze-error-analysis"
                >
                  <div class="analysis-title error-title">❌ 为什么你选的答案不对</div>
                  <div class="error-detail">
                    <strong>你选了 {{ question.userAnswer }}：</strong>
                    <p>{{ question.errorAnalysis[question.userAnswer] || '该选项不符合语境' }}</p>
                  </div>
                  <div class="correct-detail">
                    <strong>✓ 正确答案 {{ question.correctAnswer }}：</strong>
                    <p>{{ getCorrectExplanation(question) }}</p>
                  </div>
                </div>

                <!-- 解题技巧 -->
                <div v-if="question.tips" class="cloze-tips">
                  <div class="tips-title">🎯 解题技巧</div>
                  <p>{{ question.tips }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredQuestions.length === 0" class="empty-state">
      <el-icon size="80" color="#ddd"><Document /></el-icon>
      <h3>暂无题目数据</h3>
      <p>请点击右上角"导入题目"按钮，导入JSON格式的题目数据</p>
      <el-button type="primary" size="large" @click="showImportGuide">
        查看导入指南
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Document, Upload, CircleCheck, CircleClose, ArrowRight } from '@element-plus/icons-vue'

// 数据状态
const selectedYear = ref('all')
const selectedQuestionType = ref('all')
const allQuestions = ref<any[]>([]) // 初始化为空数组
const expandedGroups = ref<string[]>([]) // 默认全部折叠
const activeSection = ref<'Use of English' | 'New Question Types'>('Use of English')
const expandedCloze = ref(false) // 完型填空大题默认折叠

// 可用年份（2010-2025）
const availableYears = Array.from({ length: 16 }, (_, i) => 2010 + i).reverse()

// 过滤后的题目（只保留完型填空和新题型，删除传统阅读）
const filteredQuestions = computed(() => {
  if (!allQuestions.value || allQuestions.value.length === 0) {
    return []
  }
  
  let questions = allQuestions.value.filter(q => 
    q.section === 'Use of English' || q.section === 'New Question Types'
  )
  
  // 按年份过滤
  if (selectedYear.value !== 'all') {
    questions = questions.filter(q => q.year === parseInt(selectedYear.value))
  }
  
  // 按题型过滤
  if (selectedQuestionType.value !== 'all') {
    questions = questions.filter(q => q.type === selectedQuestionType.value)
  }
  
  return questions
})

// 所有题型列表
const questionTypes = computed(() => {
  if (!filteredQuestions.value || filteredQuestions.value.length === 0) {
    return []
  }
  const types = new Set(filteredQuestions.value.map(q => q.type))
  return Array.from(types)
})

// 覆盖的年份
const coveredYears = computed(() => {
  if (!filteredQuestions.value || filteredQuestions.value.length === 0) {
    return []
  }
  const years = new Set(filteredQuestions.value.map(q => q.year))
  return Array.from(years)
})

// 完型填空相关（Use of English）
const clozeQuestions = computed(() => {
  if (!filteredQuestions.value || filteredQuestions.value.length === 0) {
    return []
  }
  return filteredQuestions.value.filter(q => q.section === 'Use of English')
})

const clozeYear = computed(() => {
  if (!clozeQuestions.value || clozeQuestions.value.length === 0) {
    return selectedYear.value !== 'all' ? parseInt(selectedYear.value) : 2005
  }
  return clozeQuestions.value[0].year
})

// 展开的题目索引列表
const expandedQuestions = ref<number[]>([])

// 切换题目展开/收起
const toggleQuestionExpand = (index: number) => {
  const idx = expandedQuestions.value.indexOf(index)
  if (idx > -1) {
    expandedQuestions.value.splice(idx, 1)
  } else {
    expandedQuestions.value.push(index)
  }
}

// 生成完整文章（带空格标记）
const clozeArticle = computed(() => {
  if (clozeQuestions.value.length === 0) return ''
  
  // 这里需要根据实际文章内容生成
  // 暂时返回提示，后续可以补充真实文章
  return '<p style="color: #666; line-height: 2; text-align: justify;">' +
    'Humans are often thought to be insensitive smellers compared with animals, ' +
    '<strong style="color: #667eea;">___(1)___</strong> this is largely because, ' +
    '<strong style="color: #667eea;">___(2)___</strong> animals, we stand upright. ' +
    'This means that our noses are <strong style="color: #667eea;">___(3)___</strong> to perceiving those smells which float through the air, ' +
    '<strong style="color: #667eea;">___(4)___</strong> the majority of smells which stick to surfaces. ' +
    'In fact, <strong style="color: #667eea;">___(5)___</strong>, we are extremely sensitive to smells, ' +
    '<strong style="color: #667eea;">___(6)___</strong> we do not generally realize it. ' +
    'Our noses are capable of <strong style="color: #667eea;">___(7)___</strong> human smells even when these are ' +
    '<strong style="color: #667eea;">___(8)___</strong> to far below one part in one million. ' +
    'Strangely, some people find that they can smell one type of flower but not another, ' +
    '<strong style="color: #667eea;">___(9)___</strong> others are sensitive to the smells of both flowers. ' +
    'This may be because some people do not have the genes necessary to generate ' +
    '<strong style="color: #667eea;">___(10)___</strong> smell receptors in the nose. ' +
    'These receptors are the cells which sense smells and send ' +
    '<strong style="color: #667eea;">___(11)___</strong> to the brain. ' +
    'However, it has been found that even people insensitive to a certain smell ' +
    '<strong style="color: #667eea;">___(12)___</strong> can suddenly become sensitive to it when ' +
    '<strong style="color: #667eea;">___(13)___</strong> to it often enough. ' +
    'The explanation for insensitivity to smell seems to be that the brain finds it ' +
    '<strong style="color: #667eea;">___(14)___</strong> to keep all smell receptors working all the time but can ' +
    '<strong style="color: #667eea;">___(15)___</strong> new receptors if necessary. ' +
    'This may <strong style="color: #667eea;">___(16)___</strong> explain why we are not usually sensitive to our own smells—' +
    'we simply do not need to be. We are not <strong style="color: #667eea;">___(17)___</strong> of the usual smell of our own house, ' +
    'but we <strong style="color: #667eea;">___(18)___</strong> new smells when we visit someone else\'s. ' +
    'The brain finds it best to keep smell receptors <strong style="color: #667eea;">___(19)___</strong> for unfamiliar and emergency signals ' +
    '<strong style="color: #667eea;">___(20)___</strong> the smell of smoke, which might indicate the danger of fire.' +
    '</p>'
})

// 答对题数
const correctCount = computed(() => {
  if (!filteredQuestions.value || filteredQuestions.value.length === 0) {
    return 0
  }
  return filteredQuestions.value.filter(q => q.userAnswer && q.userAnswer === q.correctAnswer).length
})

// 正确率
const accuracyRate = computed(() => {
  if (!filteredQuestions.value || filteredQuestions.value.length === 0) {
    return 0
  }
  const answered = filteredQuestions.value.filter(q => q.userAnswer).length
  if (answered === 0) return 0
  return Math.round((correctCount.value / answered) * 100)
})

// 加载数据
const loadData = () => {
  console.log(`📊 加载数据：年份=${selectedYear.value}, 题型=${selectedQuestionType.value}`)
  // TODO: 从 localStorage或API加载真实数据
}

// 按题型过滤
const filterQuestions = () => {
  console.log(` 按题型过滤：${selectedQuestionType.value}`)
}

// 获取某题型的所有题目
const getQuestionsByType = (type: string) => {
  return filteredQuestions.value.filter(q => q.type === type)
}

// 获取组统计信息
const getGroupStats = (type: string) => {
  const questions = getQuestionsByType(type)
  const total = questions.filter(q => q.userAnswer).length
  const correct = questions.filter(q => q.userAnswer && q.userAnswer === q.correctAnswer).length
  return { total, correct }
}

// 获取正确答案的解释
const getCorrectOptionExplanation = (question: any) => {
  if (question.errorAnalysis && question.errorAnalysis[question.correctAnswer]) {
    return question.errorAnalysis[question.correctAnswer]
  }
  // 如果没有专门的解释，返回选项文本
  const correctOption = question.options?.find((o: any) => o.label === question.correctAnswer)
  return correctOption ? correctOption.text : ''
}

// 完型填空用的正确解释函数（别名）
const getCorrectExplanation = getCorrectOptionExplanation

// 切换分组展开/收起
const toggleGroup = (type: string) => {
  const index = expandedGroups.value.indexOf(type)
  if (index > -1) {
    expandedGroups.value.splice(index, 1)
  } else {
    expandedGroups.value.push(type)
  }
}

// 获取题型颜色
const getQuestionTypeColor = (type: string) => {
  const colorMap: Record<string, any> = {
    '细节题': 'primary',
    '主旨题': 'success',
    '推理题': 'warning',
    '词义题': 'danger',
    '态度题': 'info'
  }
  return colorMap[type] || ''
}

// 导入题目
const importQuestions = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = async (e: any) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = async (event: any) => {
      try {
        const data = JSON.parse(event.target.result)
        if (Array.isArray(data)) {
          allQuestions.value = data
          
          // 保存到localStorage（临时）
          localStorage.setItem('readingQuestions', JSON.stringify(data))
          
          // 保存到后端
          try {
            await fetch('http://localhost:3000/api/reading-questions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ questions: data })
            })
            console.log('✅ 已保存到后端')
          } catch (err) {
            console.log('⚠️ 后端保存失败，仅保存到本地')
          }
          
          alert(`✅ 成功导入 ${data.length} 道题目！\n数据已保存，下次登录依然可见`)
        } else {
          alert('❌ JSON格式错误：应该是数组格式')
        }
      } catch (error) {
        alert('❌ 文件解析失败：' + error)
      }
    }
    reader.readAsText(file)
  }
  input.click()
}

// 显示导入指南
const showImportGuide = () => {
  alert(`📋 JSON导入格式示例：

[
  {
    "year": 2025,
    "passage": 1,
    "number": 1,
    "type": "细节题",
    "stem": "题干内容...",
    "options": [
      {"label": "A", "text": "选项A"},
      {"label": "B", "text": "选项B"},
      {"label": "C", "text": "选项C"},
      {"label": "D", "text": "选项D"}
    ],
    "correctAnswer": "A",
    "analysis": "答案解析...",
    "tips": "解题技巧...",
    "location": "原文定位..."
  }
]

必填字段：year, type, stem, correctAnswer
选填字段：passage, number, options, analysis, tips, location`)
}

// 打开精读页面
const openIntensiveReading = (section: string, year: number) => {
  // 跳转到精读页面，传递题型和年份参数
  window.location.href = `/intensive-reading?section=${encodeURIComponent(section)}&year=${year}`
}

onMounted(async () => {
  // 从后端API加载数据（直接读取JSON文件）
  try {
    console.log('🔄 从后端API加载英语真题...')
    const response = await fetch('http://localhost:3001/api/reading-questions')
    
    if (response.ok) {
      const data = await response.json()
      
      if (data.questions && data.questions.length > 0) {
        allQuestions.value = data.questions
        console.log(`✅ 成功加载 ${data.questions.length} 道题目`)
      } else {
        console.warn('⚠️  API返回数据为空')
      }
    } else {
      console.error('❌ API请求失败:', response.status)
    }
  } catch (error) {
    console.error('❌ 加载英语真题失败:', error)
  }
})
</script>

<style scoped>
.reading-practice {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.practice-header {
  text-align: center;
  margin-bottom: 30px;
}

.practice-title {
  font-size: 2.2em;
  color: #333;
  margin-bottom: 10px;
}

.practice-subtitle {
  color: #666;
  font-size: 1.1em;
}

/* 筛选器 */
.filter-section {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.filter-section .el-select {
  width: 180px;
}

/* 统计栏 */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.stat-item {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  text-align: center;
}

.stat-value {
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.95em;
  opacity: 0.9;
}

/* 题型分组 */
.type-groups {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.type-group {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.group-header {
  padding: 20px 25px;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #e0e0e0;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 15px;
}

.group-count {
  color: #666;
  font-size: 0.95em;
}

.questions-list {
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.question-card {
  padding: 25px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #667eea;
  transition: all 0.3s ease;
}

.question-card:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.question-meta {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.question-stem {
  font-size: 1.05em;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.6;
  font-weight: 500;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.option-item {
  padding: 12px 15px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.option-item.correct {
  border-color: #4CAF50;
  background: #e8f5e9;
}

.option-item.user-wrong {
  border-color: #F44336;
  background: #ffebee;
}

.option-label {
  font-weight: bold;
  color: #667eea;
  flex-shrink: 0;
}

.option-text {
  flex: 1;
  color: #333;
  line-height: 1.6;
}

.correct-icon {
  color: #4CAF50;
  font-size: 1.3em;
}

.wrong-icon {
  color: #F44336;
  font-size: 1.3em;
}

/* 答案对比 */
.answer-comparison {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.user-answer,
.correct-answer {
  padding: 12px 15px;
  border-radius: 6px;
  flex: 1;
  min-width: 150px;
}

.user-answer {
  background: #fff3e0;
  border-left: 4px solid #FF9800;
}

.correct-answer {
  background: #e8f5e9;
  border-left: 4px solid #4CAF50;
}

.user-answer .label,
.correct-answer .label {
  color: #666;
  font-weight: 500;
}

.user-answer .correct-text {
  color: #4CAF50;
  font-weight: bold;
  font-size: 1.1em;
}

.user-answer .wrong-text {
  color: #F44336;
  font-weight: bold;
  font-size: 1.1em;
}

.correct-answer .answer {
  color: #4CAF50;
  font-weight: bold;
  font-size: 1.1em;
}

.analysis-section,
.tips-section,
.location-section {
  margin-top: 15px;
}

.analysis-section h5,
.tips-section h5,
.location-section h5 {
  color: #667eea;
  margin: 0 0 8px 0;
  font-size: 1em;
}

.analysis-section p,
.tips-section p {
  margin: 0;
  color: #555;
  line-height: 1.6;
}

/* 错误选项分析 */
.error-analysis-section {
  background: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%);
  border-left: 4px solid #F44336;
  padding: 20px;
  border-radius: 8px;
  margin-top: 15px;
}

.error-title {
  color: #F44336 !important;
  font-weight: bold;
}

.error-item {
  margin-bottom: 15px;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 2px solid #F44336;
}

.error-label {
  color: #F44336;
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.error-explanation {
  color: #333;
  line-height: 1.8;
  display: block;
}

.correct-comparison {
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 2px solid #4CAF50;
}

.correct-label {
  color: #4CAF50;
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.correct-explanation {
  color: #333;
  line-height: 1.8;
  display: block;
}

.location-section blockquote {
  margin: 0;
  padding: 12px 15px;
  background: #f5f7fa;
  border-left: 4px solid #667eea;
  border-radius: 6px;
  color: #666;
  font-style: italic;
}

/* 题型标签切换 */
.section-tabs {
  margin-bottom: 25px;
}

/* 题型分组头部（可点击） */
.group-header {
  cursor: pointer;
  user-select: none;
  transition: all 0.3s;
}

.group-header:hover {
  background: #f5f7fa;
}

.expand-icon {
  display: inline-block;
  transition: transform 0.3s;
  margin-right: 8px;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

/* 完型填空区域 */
.cloze-section {
  max-width: 900px;
  margin: 0 auto;
}

.cloze-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.cloze-title {
  font-size: 1.6em;
  margin: 0 0 8px 0;
}

.cloze-subtitle {
  font-size: 0.95em;
  margin: 0;
  opacity: 0.9;
}

/* 文章区域 */
.article-section {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.article-content {
  font-size: 1.05em;
  line-height: 2.2;
  color: #333;
  text-align: justify;
}

.section-title {
  font-size: 1.3em;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 3px solid #667eea;
}

/* 完型填空大题容器 */
.cloze-year-group {
  margin-bottom: 20px;
}

.year-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s;
}

.year-header:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.year-header .expand-icon {
  color: white;
}

.year-text {
  font-size: 1.2em;
  font-weight: bold;
  flex: 1;
}

.year-content {
  margin-top: 15px;
  padding-left: 10px;
}

/* 完型填空题目项 */
.cloze-question-item {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  transition: all 0.3s;
}

.cloze-question-item:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
}

/* 题目头部：题号+题干+按钮 */
.question-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 0;
}

.cloze-number {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: #667eea;
  color: white;
  border-radius: 50%;
  font-weight: bold;
  font-size: 1em;
}

.question-stem-text {
  flex: 1;
  font-size: 1em;
  line-height: 1.6;
  color: #333;
  padding-top: 5px;
}

/* 选项横向排列 */
.cloze-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.cloze-option {
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}

.cloze-option.correct {
  border-color: #4CAF50;
  background: #e8f5e9;
}

.cloze-option.user-wrong {
  border-color: #F44336;
  background: #ffebee;
}

.option-label {
  font-weight: bold;
  color: #667eea;
}

.option-text {
  flex: 1;
}

.icon-correct {
  color: #4CAF50;
  font-size: 1.2em;
}

.icon-wrong {
  color: #F44336;
  font-size: 1.2em;
}

/* 答案对比 */
.cloze-answer-comparison {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.answer-box {
  flex: 1;
  min-width: 200px;
  padding: 12px 15px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-answer {
  background: #fff3e0;
  border: 2px solid #FF9800;
}

.correct-answer {
  background: #e8f5e9;
  border: 2px solid #4CAF50;
}

.text-correct {
  color: #4CAF50;
  font-weight: bold;
  font-size: 1.2em;
}

.text-wrong {
  color: #F44336;
  font-weight: bold;
  font-size: 1.2em;
}

/* 解析区域 */
.cloze-analysis {
  padding: 15px;
  background: #e3f2fd;
  border-left: 4px solid #2196F3;
  border-radius: 6px;
  margin-bottom: 15px;
}

.analysis-title {
  font-weight: bold;
  color: #2196F3;
  margin-bottom: 8px;
  font-size: 1.05em;
}

.analysis-title.error-title {
  color: #F44336;
}

/* 错误分析 */
.cloze-error-analysis {
  padding: 15px;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%);
  border: 2px solid #F44336;
  border-radius: 6px;
  margin-bottom: 15px;
}

.error-detail,
.correct-detail {
  margin-bottom: 12px;
}

.error-detail:last-child,
.correct-detail:last-child {
  margin-bottom: 0;
}

.error-detail strong {
  color: #F44336;
  display: block;
  margin-bottom: 5px;
}

.correct-detail strong {
  color: #4CAF50;
  display: block;
  margin-bottom: 5px;
}

/* 解题技巧 */
.cloze-tips {
  padding: 15px;
  background: #fff9c4;
  border-left: 4px solid #FFC107;
  border-radius: 6px;
}

.tips-title {
  font-weight: bold;
  color: #FF9800;
  margin-bottom: 8px;
  font-size: 1.05em;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .cloze-options {
    grid-template-columns: 1fr;
  }
  
  .cloze-answer-comparison {
    flex-direction: column;
  }
  
  .answer-box {
    min-width: 100%;
  }
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #999;
}

.empty-state h3 {
  margin: 20px 0 10px;
  color: #666;
}

.empty-state p {
  margin: 0 0 20px 0;
  font-size: 0.95em;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .reading-practice {
    padding: 15px;
  }
  
  .filter-section {
    flex-direction: column;
  }
  
  .filter-section .el-select {
    width: 100%;
  }
  
  .stats-bar {
    grid-template-columns: 1fr;
  }
  
  .group-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}

/* 完型填空试卷式展示 */
.mode-switcher {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
}

.cloze-section {
  max-width: 1100px;
  margin: 0 auto;
}

.cloze-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.cloze-title {
  font-size: 1.6em;
  margin: 0 0 8px 0;
}

.cloze-subtitle {
  font-size: 0.95em;
  margin: 0;
  opacity: 0.9;
}

/* 文章区域 */
.article-section {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.article-content {
  font-size: 1.05em;
  line-height: 2.2;
  color: #333;
  text-align: justify;
}

.section-title {
  font-size: 1.3em;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 3px solid #667eea;
}

.cloze-question-item {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  transition: all 0.3s;
}

.cloze-question-item:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
}

/* 题目头部：题号+题干+按钮 */
.question-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 0;
}

.cloze-number {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: #667eea;
  color: white;
  border-radius: 50%;
  font-weight: bold;
  font-size: 1em;
}

.question-stem-text {
  flex: 1;
  font-size: 1em;
  line-height: 1.6;
  color: #333;
  padding-top: 5px;
}

/* 选项横向排列 */
.cloze-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.cloze-option {
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  position: relative;
  transition: all 0.2s;
}

.cloze-option.correct {
  border-color: #4CAF50;
  background: #e8f5e9;
}

.cloze-option.user-wrong {
  border-color: #F44336;
  background: #ffebee;
}

/* 完型填空序号颜色：答对绿色，答错红色 */
.cloze-question-item .question-header .cloze-number.correct {
  background: #4CAF50 !important;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.cloze-question-item .question-header .cloze-number.wrong {
  background: #F44336 !important;
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
}

/* 题干后面的comment文本 */
.comment-text {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #4CAF50;
  font-size: 1.3em;
}

.icon-wrong {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #F44336;
  font-size: 1.3em;
}

/* 答案对比 */
.cloze-answer-comparison {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.answer-box {
  flex: 1;
  min-width: 150px;
  padding: 12px 15px;
  border-radius: 6px;
}

.user-answer {
  background: #fff3e0;
  border-left: 4px solid #FF9800;
}

.correct-answer {
  background: #e8f5e9;
  border-left: 4px solid #4CAF50;
}

.answer-box .label {
  color: #666;
  font-weight: 500;
  margin-right: 8px;
}

.text-correct {
  color: #4CAF50;
  font-weight: bold;
  font-size: 1.1em;
}

.text-wrong {
  color: #F44336;
  font-weight: bold;
  font-size: 1.1em;
}

/* 解析区域 */
.cloze-analysis,
.cloze-error-analysis,
.cloze-tips {
  margin-top: 15px;
  padding: 15px;
  border-radius: 6px;
}

.cloze-analysis {
  background: #f5f7fa;
  border-left: 4px solid #667eea;
}

.cloze-error-analysis {
  background: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%);
  border-left: 4px solid #F44336;
}

.cloze-tips {
  background: #fff9e6;
  border-left: 4px solid #FFC107;
}

.analysis-title {
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8px;
  font-size: 0.95em;
}

.error-title {
  color: #F44336 !important;
}

.cloze-analysis p,
.cloze-error-analysis p,
.cloze-tips p {
  margin: 0;
  line-height: 1.8;
  color: #555;
}

.error-detail,
.correct-detail {
  margin-bottom: 10px;
}

.error-detail strong {
  color: #F44336;
  display: block;
  margin-bottom: 5px;
}

.correct-detail strong {
  color: #4CAF50;
  display: block;
  margin-bottom: 5px;
}

@media (max-width: 768px) {
  .cloze-options {
    grid-template-columns: 1fr;
  }
  
  .cloze-answer-comparison {
    flex-direction: column;
  }
  
  .cloze-title {
    font-size: 1.3em;
  }
}
</style>
