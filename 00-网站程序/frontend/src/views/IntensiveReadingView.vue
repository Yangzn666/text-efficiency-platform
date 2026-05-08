<template>
  <div class="intensive-reading">
    <!-- 返回按钮 -->
    <div class="back-bar">
      <el-button @click="goBack" size="large">
        <el-icon><ArrowLeft /></el-icon>
        返回真题列表
      </el-button>
    </div>

    <!-- 精读标题 -->
    <div class="reading-header">
      <h1 class="reading-title">
        <el-icon class="title-icon"><Reading /></el-icon>
        {{ pageTitle }}
      </h1>
      <p class="reading-subtitle">逐句精读 · 深度解析 · 全面提升</p>
    </div>

    <!-- 文章内容 -->
    <div class="article-container">
      <div class="article-section">
        <div class="section-title">
          <el-icon><Document /></el-icon>
          文章原文
        </div>
        <div class="article-content" v-html="articleContent"></div>
      </div>

      <!-- 逐句解析 -->
      <div class="sentence-analysis">
        <div class="section-title">
          <el-icon><EditPen /></el-icon>
          逐句精读解析
        </div>

        <div 
          v-for="(sentence, idx) in sentenceList" 
          :key="idx"
          class="sentence-card"
        >
          <!-- 英文原句 -->
          <div class="sentence-original">
            <span class="sentence-number">{{ idx + 1 }}</span>
            <span class="sentence-text" v-html="sentence.english"></span>
          </div>

          <!-- 中文翻译 -->
          <div class="sentence-translation">
            <el-icon><ChatDotRound /></el-icon>
            <span class="translation-label">翻译：</span>
            <span class="translation-text">{{ sentence.chinese }}</span>
          </div>

          <!-- 重点词汇 -->
          <div v-if="sentence.vocabulary && sentence.vocabulary.length > 0" class="sentence-vocabulary">
            <el-icon><Collection /></el-icon>
            <span class="vocab-label">重点词汇：</span>
            <div class="vocab-list">
              <el-tag 
                v-for="(word, wIdx) in sentence.vocabulary" 
                :key="wIdx"
                type="info"
                size="large"
                effect="plain"
              >
                <strong>{{ word.word }}</strong> {{ word.meaning }}
              </el-tag>
            </div>
          </div>

          <!-- 语法分析 -->
          <div v-if="sentence.grammar" class="sentence-grammar">
            <el-icon><Notebook /></el-icon>
            <span class="grammar-label">语法结构：</span>
            <div class="grammar-content" v-html="sentence.grammar"></div>
          </div>

          <!-- 长难句拆解 -->
          <div v-if="sentence.structure" class="sentence-structure">
            <el-icon><Operation /></el-icon>
            <span class="structure-label">句子结构：</span>
            <pre class="structure-content">{{ sentence.structure }}</pre>
          </div>
        </div>
      </div>

      <!-- 题目解析 -->
      <div v-if="questions.length > 0" class="questions-section">
        <div class="section-title">
          <el-icon><QuestionFilled /></el-icon>
          题目详解
        </div>

        <div 
          v-for="(question, idx) in questions" 
          :key="idx"
          class="question-card"
        >
          <div class="question-header">
            <el-tag type="warning" size="large">第 {{ question.number }} 题</el-tag>
            <el-tag v-if="question.type" size="large">{{ question.type }}</el-tag>
          </div>

          <div class="question-stem">{{ question.stem }}</div>

          <!-- 选项 -->
          <div v-if="question.options" class="question-options">
            <div 
              v-for="option in question.options" 
              :key="option.label"
              class="option-item"
              :class="{ 'correct': option.label === question.correctAnswer }"
            >
              <span class="option-label">{{ option.label }}.</span>
              <span class="option-text">{{ option.text }}</span>
              <el-icon v-if="option.label === question.correctAnswer" class="correct-icon">
                <CircleCheck />
              </el-icon>
            </div>
          </div>

          <!-- 答案和解析 -->
          <div class="question-answer">
            <el-tag type="success" size="large">正确答案：{{ question.correctAnswer }}</el-tag>
            
            <div class="answer-analysis">
              <h5> 详细解析：</h5>
              <p>{{ question.analysis }}</p>
            </div>

            <div v-if="question.location" class="answer-location">
              <h5>📍 原文定位：</h5>
              <blockquote>{{ question.location }}</blockquote>
            </div>

            <div v-if="question.tips" class="answer-tips">
              <h5>🎯 解题技巧：</h5>
              <p>{{ question.tips }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  Reading, 
  Document, 
  EditPen, 
  ChatDotRound, 
  Collection,
  Notebook,
  Operation,
  QuestionFilled,
  CircleCheck
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 题型和年份
const section = ref(route.query.section as string || 'Use of English')
const year = ref(parseInt(route.query.year as string) || 2005)

// 页面标题
const pageTitle = computed(() => {
  const sectionName = section.value === 'Use of English' ? '完型填空' : '新题型'
  return `${year.value}年考研英语一 · ${sectionName}精读`
})

// 文章内容（示例数据，后续从JSON文件加载）
const articleContent = ref(`<p style="line-height: 2; text-align: justify; font-size: 1.1em;">
  Humans are often thought to be insensitive smellers compared with animals, 
  <strong style="color: #667eea;">___(1)___</strong> this is largely because, 
  <strong style="color: #667eea;">___(2)___</strong> animals, we stand upright. 
  This means that our noses are <strong style="color: #667eea;">___(3)___</strong> to perceiving those smells which float through the air, 
  <strong style="color: #667eea;">___(4)___</strong> the majority of smells which stick to surfaces.
</p>`)

// 逐句解析数据
const sentenceList = ref([
  {
    english: 'Humans are often thought to be insensitive smellers compared with animals, ___(1)___ this is largely because...',
    chinese: '与动物相比，人类通常被认为是嗅觉不敏感的，___(1)___ 这主要是因为...',
    vocabulary: [
      { word: 'insensitive', meaning: '不敏感的' },
      { word: 'compared with', meaning: '与...相比' },
      { word: 'largely', meaning: '主要地' }
    ],
    grammar: '主句 + 原因状语从句，compared with animals 是过去分词作状语',
    structure: `主句: Humans are often thought to be insensitive smellers
      |
      +-- 状语: compared with animals
      |
      +-- 从句: ___(1)___ this is largely because...`
  },
  {
    english: 'This means that our noses are ___(3)___ to perceiving those smells which float through the air...',
    chinese: '这意味着我们的鼻子 ___(3)___ 感知那些在空气中漂浮的气味...',
    vocabulary: [
      { word: 'perceive', meaning: '感知，察觉' },
      { word: 'float through', meaning: '漂浮通过' }
    ],
    grammar: '宾语从句 + 定语从句，which引导的定语从句修饰smells',
    structure: `主句: This means that...
      |
      +-- 宾语从句: our noses are ___(3)___ to perceiving...
          |
          +-- 定语从句: which float through the air`
  }
])

// 题目数据
const questions = ref<any[]>([])

// 返回
const goBack = () => {
  router.back()
}

// 加载数据
onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3001/api/reading-questions')
    const data = await response.json()
    
    if (data.questions) {
      // 筛选对应题型和年份的题目
      questions.value = data.questions.filter((q: any) => 
        q.section === section.value && q.year === year.value
      )
      console.log(`✅ 加载了 ${questions.value.length} 道${section.value}题目`)
    }
  } catch (error) {
    console.error('加载题目数据失败:', error)
  }
})
</script>

<style scoped>
.intensive-reading {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.back-bar {
  margin-bottom: 20px;
}

.reading-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
}

.reading-title {
  font-size: 2em;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.title-icon {
  font-size: 1.2em;
}

.reading-subtitle {
  font-size: 1.1em;
  opacity: 0.9;
  margin: 0;
}

.article-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.section-title {
  font-size: 1.5em;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 3px solid #667eea;
}

.article-section {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.article-content {
  line-height: 2;
  font-size: 1.1em;
  color: #333;
}

.sentence-analysis {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.sentence-card {
  background: #f8f9fa;
  border-left: 4px solid #667eea;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.sentence-original {
  margin-bottom: 15px;
  display: flex;
  gap: 10px;
}

.sentence-number {
  background: #667eea;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.sentence-text {
  font-size: 1.05em;
  line-height: 1.8;
  color: #333;
}

.sentence-translation {
  background: #e3f2fd;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.translation-label {
  font-weight: bold;
  color: #1976d2;
  white-space: nowrap;
}

.translation-text {
  color: #333;
  line-height: 1.6;
}

.sentence-vocabulary {
  background: #fff3e0;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-wrap: wrap;
}

.vocab-label {
  font-weight: bold;
  color: #f57c00;
  white-space: nowrap;
}

.vocab-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  flex: 1;
}

.sentence-grammar {
  background: #f3e5f5;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.grammar-label {
  font-weight: bold;
  color: #7b1fa2;
  white-space: nowrap;
}

.grammar-content {
  color: #333;
  line-height: 1.6;
}

.sentence-structure {
  background: #e8f5e9;
  padding: 12px;
  border-radius: 6px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.structure-label {
  font-weight: bold;
  color: #388e3c;
  white-space: nowrap;
}

.structure-content {
  font-family: 'Courier New', monospace;
  font-size: 0.95em;
  line-height: 1.6;
  color: #333;
  margin: 0;
  white-space: pre-wrap;
}

.questions-section {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.question-card {
  background: #fafafa;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
}

.question-header {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.question-stem {
  font-size: 1.1em;
  line-height: 1.8;
  color: #333;
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
}

.question-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.option-item {
  padding: 12px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-item.correct {
  background: #e8f5e9;
  border-color: #4caf50;
}

.option-label {
  font-weight: bold;
  color: #667eea;
}

.option-text {
  flex: 1;
}

.correct-icon {
  color: #4caf50;
  font-size: 1.2em;
}

.question-answer {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
}

.answer-analysis,
.answer-location,
.answer-tips {
  margin-top: 15px;
}

.answer-analysis h5,
.answer-location h5,
.answer-tips h5 {
  color: #667eea;
  margin-bottom: 8px;
  font-size: 1em;
}

.answer-analysis p,
.answer-tips p {
  line-height: 1.8;
  color: #555;
  margin: 0;
}

.answer-location blockquote {
  background: #fff9e6;
  padding: 12px;
  border-left: 4px solid #ffc107;
  margin: 0;
  color: #666;
  font-style: italic;
}

@media (max-width: 768px) {
  .intensive-reading {
    padding: 10px;
  }
  
  .reading-title {
    font-size: 1.5em;
  }
  
  .question-options {
    grid-template-columns: 1fr;
  }
  
  .sentence-vocabulary {
    flex-direction: column;
  }
}
</style>
