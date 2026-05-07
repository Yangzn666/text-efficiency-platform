<template>
  <div class="cloze-test">
    <div class="test-header">
      <h2 class="test-title">📝 {{ currentTest.year }}年考研英语一 Use of English</h2>
      <p class="test-subtitle">完形填空 · 共20题 · 满分10分</p>
    </div>

    <!-- 年份选择器 -->
    <div class="year-selector">
      <el-select v-model="selectedYear" placeholder="选择年份" size="large" @change="loadTest">
        <el-option
          v-for="year in availableYears"
          :key="year"
          :label="`${year}年`"
          :value="year"
        />
      </el-select>
      
      <el-button type="primary" size="large" @click="importQuestions">
        <el-icon><Upload /></el-icon>
        导入题目
      </el-button>
    </div>

    <!-- 文章原文区域 -->
    <div v-if="currentTest.article" class="article-section">
      <div class="section-title">📖 文章原文</div>
      <div class="article-content" v-html="currentTest.article"></div>
    </div>

    <!-- 题目列表 -->
    <div class="questions-section">
      <div class="section-title">❓ 题目与解析</div>
      
      <div 
        v-for="(question, idx) in currentTest.questions" 
        :key="idx"
        class="question-item"
        :class="{ 'answered': question.userAnswer }"
      >
        <!-- 题号 -->
        <div class="question-number">{{ question.number }}</div>
        
        <!-- 题干 -->
        <div class="question-stem">
          <p>{{ question.stem }}</p>
        </div>

        <!-- 选项 -->
        <div class="options-grid">
          <div 
            v-for="option in question.options" 
            :key="option.label"
            class="option-box"
            :class="{
              'correct': option.label === question.correctAnswer,
              'user-selected': question.userAnswer === option.label,
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
        <div v-if="question.userAnswer" class="answer-comparison">
          <div class="user-answer-box">
            <span class="label">你的答案：</span>
            <span :class="question.userAnswer === question.correctAnswer ? 'text-correct' : 'text-wrong'">
              {{ question.userAnswer }}
            </span>
            <el-tag 
              v-if="question.userAnswer === question.correctAnswer" 
              type="success" 
              size="small"
            >
              ✓ 正确
            </el-tag>
            <el-tag 
              v-else 
              type="danger" 
              size="small"
            >
              ✗ 错误
            </el-tag>
          </div>
          
          <div class="correct-answer-box">
            <span class="label">正确答案：</span>
            <span class="text-correct">{{ question.correctAnswer }}</span>
          </div>
        </div>

        <!-- 答案解析 -->
        <div class="analysis-box">
          <div class="analysis-title">📖 解析</div>
          <p>{{ question.analysis }}</p>
        </div>

        <!-- 错误选项分析（仅答错时显示） -->
        <div 
          v-if="question.userAnswer && question.userAnswer !== question.correctAnswer && question.errorAnalysis" 
          class="error-analysis-box"
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
        <div v-if="question.tips" class="tips-box">
          <div class="tips-title">🎯 解题技巧</div>
          <p>{{ question.tips }}</p>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty v-if="!currentTest.questions || currentTest.questions.length === 0" description="暂无题目，请导入数据" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Upload, CircleCheck, CircleClose } from '@element-plus/icons-vue'

// 当前测试数据
const currentTest = ref<any>({
  year: 2005,
  questions: []
})

const selectedYear = ref(2005)
const availableYears = [2005] // 目前只有2005年

// 加载测试
const loadTest = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/reading-questions')
    const data = await response.json()
    
    if (data.questions && data.questions.length > 0) {
      // 筛选指定年份的题目
      const yearQuestions = data.questions.filter((q: any) => q.year === selectedYear.value)
      
      if (yearQuestions.length > 0) {
        currentTest.value = {
          year: selectedYear.value,
          questions: yearQuestions.sort((a: any, b: any) => a.number - b.number),
          article: generateArticle(yearQuestions)
        }
        console.log(`✅ 加载 ${selectedYear.value}年完型填空 ${yearQuestions.length} 题`)
      }
    }
  } catch (error) {
    console.error('加载失败', error)
  }
}

// 生成带空格的文章
const generateArticle = (questions: any[]) => {
  // 这里可以根据实际文章内容生成
  // 暂时返回提示
  return '<p style="color: #999; text-align: center;">文章原文待补充</p>'
}

// 获取正确答案的解释
const getCorrectExplanation = (question: any) => {
  if (question.errorAnalysis && question.errorAnalysis[question.correctAnswer]) {
    return question.errorAnalysis[question.correctAnswer]
  }
  const correctOption = question.options?.find((o: any) => o.label === question.correctAnswer)
  return correctOption ? correctOption.text : ''
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
          await fetch('http://localhost:3001/api/reading-questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questions: data })
          })
          alert(`✅ 成功导入 ${data.length} 道题目！`)
          loadTest()
        }
      } catch (error) {
        alert('❌ 文件解析失败')
      }
    }
    reader.readAsText(file)
  }
  input.click()
}

onMounted(() => {
  loadTest()
})
</script>

<style scoped>
.cloze-test {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.test-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.test-title {
  font-size: 1.8em;
  margin: 0 0 10px 0;
}

.test-subtitle {
  font-size: 1em;
  margin: 0;
  opacity: 0.9;
}

.year-selector {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.4em;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 3px solid #667eea;
}

/* 文章区域 */
.article-section {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 8px;
  margin-bottom: 30px;
  line-height: 2;
}

.article-content {
  font-size: 1.05em;
  color: #333;
}

/* 题目区域 */
.questions-section {
  margin-top: 30px;
}

.question-item {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.question-item.answered {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
}

.question-number {
  display: inline-block;
  width: 36px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  background: #667eea;
  color: white;
  border-radius: 50%;
  font-weight: bold;
  font-size: 1.1em;
  margin-bottom: 15px;
}

.question-stem {
  margin-bottom: 20px;
  font-size: 1.05em;
  line-height: 1.8;
  color: #333;
}

/* 选项网格 */
.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.option-box {
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.option-box:hover {
  border-color: #667eea;
  background: #f5f7ff;
}

.option-box.correct {
  border-color: #4CAF50;
  background: #e8f5e9;
}

.option-box.user-selected {
  border-color: #FF9800;
  background: #fff3e0;
}

.option-box.user-wrong {
  border-color: #F44336;
  background: #ffebee;
}

.option-label {
  font-weight: bold;
  color: #667eea;
  margin-right: 8px;
}

.option-text {
  color: #333;
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
.answer-comparison {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.user-answer-box,
.correct-answer-box {
  flex: 1;
  min-width: 150px;
  padding: 12px 15px;
  border-radius: 6px;
}

.user-answer-box {
  background: #fff3e0;
  border-left: 4px solid #FF9800;
}

.correct-answer-box {
  background: #e8f5e9;
  border-left: 4px solid #4CAF50;
}

.user-answer-box .label,
.correct-answer-box .label {
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
.analysis-box,
.error-analysis-box,
.tips-box {
  margin-top: 15px;
  padding: 15px;
  border-radius: 6px;
}

.analysis-box {
  background: #f5f7fa;
  border-left: 4px solid #667eea;
}

.error-analysis-box {
  background: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%);
  border-left: 4px solid #F44336;
}

.tips-box {
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

.analysis-box p,
.error-analysis-box p,
.tips-box p {
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

/* 响应式 */
@media (max-width: 768px) {
  .options-grid {
    grid-template-columns: 1fr;
  }
  
  .answer-comparison {
    flex-direction: column;
  }
  
  .test-title {
    font-size: 1.4em;
  }
}
</style>
