<template>
  <div class="reading-practice">
    <h2>📖 英语一真题阅读训练</h2>
    
    <!-- 筛选器 -->
    <div class="filters">
      <el-select v-model="selectedYear" placeholder="选择年份" @change="filterQuestions">
        <el-option label="全部年份" value="all"></el-option>
        <el-option v-for="year in availableYears" :key="year" :label="year + '年'" :value="year"></el-option>
      </el-select>

      <el-select v-model="selectedQuestionType" placeholder="选择题型" @change="filterQuestions">
        <el-option label="全部题型" value="all"></el-option>
        <el-option label="主旨题" value="主旨题"></el-option>
        <el-option label="细节题" value="细节题"></el-option>
        <el-option label="推理题" value="推理题"></el-option>
        <el-option label="词汇题" value="词汇题"></el-option>
        <el-option label="态度题" value="态度题"></el-option>
        <el-option label="例证题" value="例证题"></el-option>
        <el-option label="逻辑关系" value="逻辑关系"></el-option>
        <el-option label="固定搭配" value="固定搭配"></el-option>
      </el-select>
    </div>

    <!-- 题型标签切换 -->
    <div class="section-tabs">
      <el-tabs v-model="activeSection" type="card" size="large">
        <el-tab-pane label="📖 传统阅读" name="Reading Comprehension"></el-tab-pane>
        <el-tab-pane label="✍️ 完型填空" name="Use of English"></el-tab-pane>
        <el-tab-pane label="📝 新题型" name="New Question Types"></el-tab-pane>
      </el-tabs>
    </div>

    <!-- 统计信息 -->
    <div class="stats-bar">
      <span>共 {{ filteredQuestions.length }} 道题</span>
      <span>已作答 {{ answeredCount }} 道</span>
      <span>答对 {{ correctCount }} 道</span>
      <span>正确率 {{ correctRate }}%</span>
    </div>

    <!-- 按题型分类显示 -->
    <div v-if="activeSection === 'Reading Comprehension' || activeSection === 'New Question Types'">
      <div v-for="(group, type) in groupedQuestions" :key="type" class="question-group">
        <div class="group-header" @click="toggleGroup(type)">
          <el-icon class="expand-icon" :class="{ 'expanded': expandedGroups.includes(type) }">
            <ArrowRight />
          </el-icon>
          <h3>{{ type }} ({{ group.length }}题)</h3>
          <el-tag v-if="getGroupStats(group).total > 0" type="success">
            答对 {{ getGroupStats(group).correct }}/{{ getGroupStats(group).total }}
          </el-tag>
        </div>
        
        <div v-show="expandedGroups.includes(type)" class="group-content">
          <div v-for="question in group" :key="question.id" class="question-card">
            <div class="question-header">
              <span class="question-number">{{ question.number }}</span>
              <span class="question-meta">
                {{ question.year }}年 · {{ question.section }}
                <el-tag v-if="question.userAnswer" 
                  :type="question.userAnswer === question.correctAnswer ? 'success' : 'danger'" 
                  size="small">
                  {{ question.userAnswer === question.correctAnswer ? '✓ 正确' : ' 错误' }}
                </el-tag>
              </span>
            </div>
            
            <div class="question-body">
              <p class="stem">{{ question.stem }}</p>
              
              <div v-if="question.options && question.options.length > 0" class="options">
                <div v-for="option in question.options" :key="option.label" 
                  class="option"
                  :class="{
                    'correct': option.label === question.correctAnswer,
                    'user-wrong': question.userAnswer === option.label && option.label !== question.correctAnswer
                  }">
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
                <h5> 答案解析：</h5>
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
    </div>

    <!-- 完型填空 -->
    <div v-if="activeSection === 'Use of English' && clozeQuestions.length > 0" class="cloze-section">
      <div class="cloze-header">
        <h3 class="cloze-title">📝 {{ clozeYear }}年考研英语一 Use of English</h3>
        <p class="cloze-subtitle">完形填空 · 共{{ clozeQuestions.length }}题 · 满分10分</p>
      </div>

      <!-- 文章原文 -->
      <div class="article-section">
        <div class="section-title"> 文章原文</div>
        <div class="article-content" v-html="clozeArticle"></div>
      </div>

      <!-- 题目列表（可折叠） -->
      <div class="cloze-questions">
        <div class="section-title">❓ 题目（点击展开查看答案）</div>
        
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
          </div>

          <div v-show="expandedCloze" class="year-content">
            <div 
              v-for="(question, idx) in clozeQuestions" 
              :key="idx"
              class="cloze-question-item"
            >
              <!-- 题号和题干 -->
              <div class="question-header">
                <div class="cloze-number">{{ question.number }}</div>
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

    <!-- 无数据提示 -->
    <el-empty v-if="filteredQuestions.length === 0 && activeSection !== 'Use of English'" description="暂无数据"></el-empty>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Document, Upload, CircleCheck, CircleClose, ArrowRight } from '@element-plus/icons-vue'

// 数据状态
const selectedYear = ref('all')
const selectedQuestionType = ref('all')
const allQuestions = ref<any[]>([])
const expandedGroups = ref<string[]>([])
const activeSection = ref<'Reading Comprehension' | 'Use of English' | 'New Question Types'>('Reading Comprehension')
const expandedCloze = ref(false)

// 可用年份（2010-2025）
const availableYears = Array.from({ length: 16 }, (_, i) => 2010 + i).reverse()

// 过滤后的题目（用于传统阅读和新题型）
const filteredQuestions = computed(() => {
  if (activeSection.value === 'Use of English') return []
  
  let questions = allQuestions.value.filter(q => q.section !== 'Use of English')
  
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

// 按题型分组（传统阅读和新题型）
const groupedQuestions = computed(() => {
  if (activeSection.value === 'Use of English') return {}
  
  let questions = filteredQuestions.value
  
  // 按题型分组
  const groups: Record<string, any[]> = {}
  questions.forEach(q => {
    if (!groups[q.type]) {
      groups[q.type] = []
    }
    groups[q.type].push(q)
  })
  
  return groups
})



// 展开的题目索引列表
const expandedQuestions = ref<number[]>([])

// 切换题型组展开/收起
const toggleGroup = (type: string) => {
  const idx = expandedGroups.value.indexOf(type)
  if (idx > -1) {
    expandedGroups.value.splice(idx, 1)
  } else {
    expandedGroups.value.push(type)
  }
}

// 获取组统计信息
const getGroupStats = (group: any[]) => {
  const total = group.filter(q => q.userAnswer).length
  const correct = group.filter(q => q.userAnswer && q.userAnswer === q.correctAnswer).length
  return { total, correct }
}

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
  return filteredQuestions.value.filter(q => q.userAnswer && q.userAnswer === q.correctAnswer).length
})

// 已作答题数
const answeredCount = computed(() => {
  return filteredQuestions.value.filter(q => q.userAnswer).length
})

// 正确率
const correctRate = computed(() => {
  const answered = filteredQuestions.value.filter(q => q.userAnswer).length
  if (answered === 0) return 0
  return Math.round((correctCount.value / answered) * 100)
})

// 加载数据
const loadData = () => {
  console.log(`📊 加载数据：年份=${selectedYear.value}, 题型=${selectedQuestionType.value}`)
  // TODO: 从 localStorage或API加载真实数据
}

// 获取某题型的所有题目
const getQuestionsByType = (type: string) => {
  return filteredQuestions.value.filter(q => q.type === type)
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

onMounted(async () => {
  // 优先从后端加载数据
  try {
    const response = await fetch('http://localhost:3001/api/reading-questions')
    const data = await response.json()
    
    if (data.questions && data.questions.length > 0) {
      allQuestions.value = data.questions
      console.log(`✅ 从后端加载 ${data.questions.length} 道题目`)
    } else {
      // 如果后端没有数据，尝试从localStorage加载
      const saved = localStorage.getItem('readingQuestions')
      if (saved) {
        allQuestions.value = JSON.parse(saved)
        console.log(`✅ 从localStorage加载 ${allQuestions.value.length} 道题目`)
      }
    }
  } catch (error) {
    console.log('⚠️ 后端加载失败，尝试从localStorage加载')
    // 从localStorage加载
    const saved = localStorage.getItem('readingQuestions')
    if (saved) {
      try {
        allQuestions.value = JSON.parse(saved)
        console.log(`✅ 从localStorage加载 ${allQuestions.value.length} 道题目`)
      } catch (e) {
        console.error('加载数据失败', e)
      }
    }
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

.icon-correct {
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
