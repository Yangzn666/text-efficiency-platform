<template>
  <div class="reading-practice">
    <div class="practice-header">
      <h2 class="practice-title">📖 考研英语一真题阅读</h2>
      <p class="practice-subtitle">Part A · 传统阅读 · 4篇文章 × 5题 = 40分</p>
    </div>

    <!-- 年份选择器 -->
    <div class="year-selector">
      <el-select v-model="selectedYear" placeholder="选择年份" size="large" @change="loadPassage">
        <el-option
          v-for="year in availableYears"
          :key="year"
          :label="`${year}年`"
          :value="year"
        />
      </el-select>
      
      <el-select v-model="selectedPassage" placeholder="选择文章" size="large" @change="loadPassage">
        <el-option
          v-for="num in 4"
          :key="num"
          :label="`Text ${num}`"
          :value="num"
        />
      </el-select>
    </div>

    <!-- 阅读模式切换 -->
    <div class="mode-switch">
      <el-radio-group v-model="readingMode" size="large">
        <el-radio-button label="study">学习模式</el-radio-button>
        <el-radio-button label="exam">模拟考试</el-radio-button>
      </el-radio-group>
      
      <el-tag v-if="readingMode === 'exam'" type="warning" effect="dark">
        ⏱️ 计时模式：建议15-18分钟/篇
      </el-tag>
    </div>

    <!-- 文章内容区 -->
    <div v-if="currentPassage" class="passage-container">
      <!-- 文章信息 -->
      <div class="passage-info">
        <div class="info-left">
          <el-tag type="primary" size="large">{{ selectedYear }}年 Text {{ selectedPassage }}</el-tag>
          <span class="word-count">约{{ currentPassage.wordCount }}词</span>
        </div>
        <div class="info-right">
          <el-button type="primary" plain @click="toggleTranslation">
            {{ showTranslation ? '隐藏' : '显示' }}译文
          </el-button>
          <el-button type="success" plain @click="showVocabulary">
            📚 重点词汇
          </el-button>
        </div>
      </div>

      <!-- 文章正文 -->
      <div class="passage-content">
        <div 
          v-for="(paragraph, idx) in currentPassage.paragraphs" 
          :key="idx"
          class="paragraph"
          @mouseenter="highlightParagraph(idx)"
          @mouseleave="unhighlightParagraph"
        >
          <span class="para-number">{{ idx + 1 }}</span>
          <p v-html="paragraph.text"></p>
        </div>
      </div>

      <!-- 中文译文（可选显示） -->
      <div v-if="showTranslation" class="translation-content">
        <h4>📝 参考译文</h4>
        <div 
          v-for="(trans, idx) in currentPassage.translations" 
          :key="idx"
          class="translation-para"
        >
          <span class="para-number">{{ idx + 1 }}</span>
          <p>{{ trans }}</p>
        </div>
      </div>
    </div>

    <!-- 题目区域 -->
    <div v-if="currentPassage && currentQuestions.length > 0" class="questions-section">
      <div class="section-header">
        <h3>📝 阅读理解题目（共{{ currentQuestions.length }}题）</h3>
        <div class="progress-info">
          已完成: {{ answeredCount }}/{{ currentQuestions.length }}
        </div>
      </div>

      <div class="questions-list">
        <div 
          v-for="(question, qIdx) in currentQuestions" 
          :key="qIdx"
          class="question-card"
          :class="{ 
            'answered': question.userAnswer,
            'correct': question.userAnswer && question.userAnswer === question.correctAnswer,
            'wrong': question.userAnswer && question.userAnswer !== question.correctAnswer
          }"
        >
          <!-- 题号和题型 -->
          <div class="question-header">
            <div class="question-number">
              <span class="number">{{ qIdx + 1 }}</span>
              <el-tag size="small" :type="getQuestionTypeColor(question.type)">
                {{ question.type }}
              </el-tag>
            </div>
            <div class="question-score">2分</div>
          </div>

          <!-- 题干 -->
          <div class="question-stem">
            {{ question.stem }}
          </div>

          <!-- 选项 -->
          <div class="options-list">
            <div 
              v-for="(option, oIdx) in question.options" 
              :key="oIdx"
              class="option-item"
              :class="{
                'selected': question.userAnswer === option.label,
                'correct-answer': readingMode === 'study' && option.label === question.correctAnswer,
                'wrong-answer': question.userAnswer && question.userAnswer === option.label && option.label !== question.correctAnswer
              }"
              @click="selectAnswer(qIdx, option.label)"
            >
              <span class="option-label">{{ option.label }}.</span>
              <span class="option-text">{{ option.text }}</span>
              <el-icon v-if="readingMode === 'study' && option.label === question.correctAnswer" class="correct-icon">
                <CircleCheck />
              </el-icon>
              <el-icon v-if="question.userAnswer === option.label && option.label !== question.correctAnswer" class="wrong-icon">
                <CircleClose />
              </el-icon>
            </div>
          </div>

          <!-- 解析（学习模式显示） -->
          <div v-if="readingMode === 'study' && question.userAnswer" class="answer-analysis">
            <div class="analysis-header">
              <el-tag :type="question.userAnswer === question.correctAnswer ? 'success' : 'danger'">
                {{ question.userAnswer === question.correctAnswer ? '✓ 正确' : '✗ 错误' }}
              </el-tag>
              <span class="correct-answer-text">正确答案：{{ question.correctAnswer }}</span>
            </div>
            
            <div class="analysis-content">
              <h5>📖 答案解析：</h5>
              <p>{{ question.analysis }}</p>
              
              <h5>🎯 解题技巧：</h5>
              <p>{{ question.tips }}</p>
              
              <h5>📍 定位句：</h5>
              <blockquote>{{ question.location }}</blockquote>
            </div>
          </div>
        </div>
      </div>

      <!-- 提交按钮（考试模式） -->
      <div v-if="readingMode === 'exam'" class="exam-actions">
        <el-button 
          type="primary" 
          size="large" 
          :disabled="answeredCount < currentQuestions.length"
          @click="submitExam"
        >
          提交答案
        </el-button>
        <el-button size="large" @click="resetAnswers">
          重新作答
        </el-button>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!currentPassage" class="empty-state">
      <el-icon size="80" color="#ddd"><Reading /></el-icon>
      <h3>请选择年份和文章开始练习</h3>
      <p>建议从近5年真题开始，逐步往前推进</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Reading, CircleCheck, CircleClose } from '@element-plus/icons-vue'

// 数据状态
const selectedYear = ref(2025)
const selectedPassage = ref(1)
const readingMode = ref<'study' | 'exam'>('study')
const showTranslation = ref(false)
const currentPassage = ref<any>(null)
const currentQuestions = ref<any[]>([])

// 可用年份（2010-2025）
const availableYears = Array.from({ length: 16 }, (_, i) => 2010 + i).reverse()

// 已答题数
const answeredCount = computed(() => {
  return currentQuestions.value.filter(q => q.userAnswer).length
})

// 加载文章和题目
const loadPassage = () => {
  // TODO: 从后端API或本地JSON加载真实数据
  // 这里使用模拟数据演示
  currentPassage.value = getMockPassage(selectedYear.value, selectedPassage.value)
  currentQuestions.value = getMockQuestions(selectedYear.value, selectedPassage.value)
  
  console.log(`📖 加载 ${selectedYear.value}年 Text ${selectedPassage.value}`)
}

// 切换译文显示
const toggleTranslation = () => {
  showTranslation.value = !showTranslation.value
}

// 显示重点词汇
const showVocabulary = () => {
  alert('重点词汇功能开发中...\n\n将显示：\n- 考研高频词汇\n- 熟词僻义\n- 长难句解析')
}

// 高亮段落
const highlightParagraph = (idx: number) => {
  // 可以实现段落高亮效果
}

const unhighlightParagraph = () => {
  // 取消高亮
}

// 选择答案
const selectAnswer = (qIdx: number, answer: string) => {
  if (readingMode.value === 'exam' && currentQuestions.value[qIdx].userAnswer) {
    return // 考试模式下不允许修改
  }
  currentQuestions.value[qIdx].userAnswer = answer
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

// 提交考试
const submitExam = () => {
  const correctCount = currentQuestions.value.filter(
    q => q.userAnswer === q.correctAnswer
  ).length
  
  const score = correctCount * 2
  
  alert(`🎉 考试完成！\n\n得分：${score}/10分\n正确率：${correctCount}/5题\n\n点击查看详细解析`)
  
  // 切换到学习模式查看解析
  readingMode.value = 'study'
}

// 重置答案
const resetAnswers = () => {
  currentQuestions.value.forEach(q => {
    q.userAnswer = null
  })
}

// 模拟数据（实际应该从API获取）
const getMockPassage = (year: number, passage: number) => {
  return {
    wordCount: 450,
    paragraphs: [
      {
        text: 'The relationship between formal education and economic growth in poor countries is widely misunderstood by economists and politicians alike. Progress in both areas is undoubtedly necessary for the social, political, and intellectual development of these countries; however, the traditional view that education should be one of the very highest priorities for promoting rapid economic development in poor countries is wrong.'
      },
      {
        text: 'We are fortunate that it is, because building new educational systems there and putting enough people through them to improve economic performance would require two or three generations. The findings of a research institution have consistently shown that workers in all countries can be trained on the job to achieve radical higher productivity and, as a result, radically higher standards of living.'
      },
      {
        text: 'Ironically, the first evidence for this idea appeared in the United States. Not long ago, with the country entering a recession and Japan at its pre-bubble peak, the U.S. workforce was derided as poorly educated and one of primary causes of the poor U.S. economic performance. Japan was, and remains, the global leader in automotive-assembly productivity. Yet the research revealed that the U.S. factories of Honda, Nissan, and Toyota achieved about 95 percent of the productivity of their Japanese counterparts—a result of the training that U.S. workers received on the job.'
      }
    ],
    translations: [
      '在贫穷国家，正规教育与经济增长之间的关系被经济学家和政治家们广泛误解。两个领域的进步对于这些国家的社会、政治和智力发展无疑是必要的；然而，传统观点认为教育应该是促进贫穷国家经济快速发展的最优先事项之一，这是错误的。',
      '幸运的是，事实确实如此，因为在那里建立新的教育体系并让足够多的人接受教育以改善经济表现需要两到三代人的时间。一家研究机构的调查结果一致表明，所有国家的工人都可以通过在职培训实现生产力的大幅提高，从而大幅提高生活水平。',
      '讽刺的是，这一想法的第一个证据出现在美国。不久前，随着美国进入衰退期，日本处于泡沫经济顶峰之前，美国劳动力被嘲笑为受教育程度低，是美国经济表现不佳的主要原因之一。日本过去是、现在仍然是全球汽车装配生产力的领导者。然而研究显示，本田、日产和丰田在美国的工厂达到了其日本同行约95%的生产力——这是美国工人接受在职培训的结果。'
    ]
  }
}

const getMockQuestions = (year: number, passage: number) => {
  return [
    {
      type: '细节题',
      stem: 'The author believes that the traditional view of education in poor countries is ______.',
      options: [
        { label: 'A', text: 'completely wrong and should be abandoned' },
        { label: 'B', text: 'partially correct but needs modification' },
        { label: 'C', text: 'misunderstood by most economists' },
        { label: 'D', text: 'appropriate for developed countries only' }
      ],
      correctAnswer: 'A',
      analysis: '文章第一段明确指出传统观点是错误的（is wrong），作者认为在贫穷国家，教育不应该是最高优先级的事项。',
      tips: '注意转折词however后的内容往往是作者的真实观点。traditional view...is wrong直接表明了作者态度。',
      location: '第一段最后一句：however, the traditional view...is wrong.',
      userAnswer: null
    },
    {
      type: '推理题',
      stem: 'According to the passage, which of the following is TRUE about educational systems in poor countries?',
      options: [
        { label: 'A', text: 'They can be built within one generation.' },
        { label: 'B', text: 'They require long-term investment and time.' },
        { label: 'C', text: 'They are the fastest way to improve economy.' },
        { label: 'D', text: 'They are less important than job training.' }
      ],
      correctAnswer: 'B',
      analysis: '第二段提到建立新教育体系需要两到三代人时间（would require two or three generations），说明需要长期投入。',
      tips: '推理题需要基于文章信息进行合理推断，不能过度引申。注意时间表达two or three generations暗示长期性。',
      location: '第二段第一句：...would require two or three generations.',
      userAnswer: null
    },
    {
      type: '细节题',
      stem: 'The research mentioned in the passage shows that ______.',
      options: [
        { label: 'A', text: 'Japanese workers are better educated than American workers' },
        { label: 'B', text: 'on-the-job training can significantly improve productivity' },
        { label: 'C', text: 'American factories are more efficient than Japanese ones' },
        { label: 'D', text: 'education is the key to economic development' }
      ],
      correctAnswer: 'B',
      analysis: '文章第二段和第三段都强调了在职培训（training on the job）可以大幅提高生产力，美国工厂通过培训达到了日本95%的生产力水平。',
      tips: '定位关键词research/research revealed，找到相关句子进行对比分析。',
      location: '第二段最后一句和第三段最后一句关于training的内容。',
      userAnswer: null
    },
    {
      type: '词义题',
      stem: 'The word "derided" (Line 3, Para. 3) probably means ______.',
      options: [
        { label: 'A', text: 'praised' },
        { label: 'B', text: 'criticized' },
        { label: 'C', text: 'ignored' },
        { label: 'D', text: 'studied' }
      ],
      correctAnswer: 'B',
      analysis: '根据上下文，美国经济表现不佳，劳动力被"derided"为受教育程度低，这显然是负面评价，所以是"批评、嘲笑"的意思。',
      tips: '词义题要通过上下文语境判断。注意前后文的感情色彩和逻辑关系。deride本身就有"嘲笑"之意。',
      location: '第三段第二句：the U.S. workforce was derided as poorly educated...',
      userAnswer: null
    },
    {
      type: '主旨题',
      stem: 'What is the main idea of the passage?',
      options: [
        { label: 'A', text: 'Education is more important than job training.' },
        { label: 'B', text: 'On-the-job training is more effective than formal education for economic growth.' },
        { label: 'C', text: 'Japanese economy is superior to American economy.' },
        { label: 'D', text: 'Poor countries should invest more in education.' }
      ],
      correctAnswer: 'B',
      analysis: '全文核心论点是：对于贫穷国家的经济发展，在职培训比正规教育更有效、更快速。文章通过研究和实例证明了这一点。',
      tips: '主旨题要把握全文脉络，通常在首段提出论点，后续段落论证。本文核心是对比formal education和on-the-job training的效果。',
      location: '贯穿全文，特别是第一段论点和第二、三段的论证。',
      userAnswer: null
    }
  ]
}

onMounted(() => {
  // 默认加载第一篇
  loadPassage()
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

/* 年份选择器 */
.year-selector {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
}

.year-selector .el-select {
  width: 180px;
}

/* 模式切换 */
.mode-switch {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
}

/* 文章内容区 */
.passage-container {
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.passage-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

.info-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.word-count {
  color: #666;
  font-size: 0.95em;
}

.info-right {
  display: flex;
  gap: 10px;
}

.passage-content {
  line-height: 1.8;
  font-size: 1.05em;
  color: #333;
}

.paragraph {
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  gap: 15px;
}

.paragraph:hover {
  background: #f5f7fa;
}

.para-number {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9em;
}

.paragraph p {
  margin: 0;
  flex: 1;
  text-align: justify;
}

/* 译文区域 */
.translation-content {
  margin-top: 30px;
  padding-top: 25px;
  border-top: 2px dashed #e0e0e0;
}

.translation-content h4 {
  color: #666;
  margin-bottom: 20px;
}

.translation-para {
  margin-bottom: 15px;
  padding: 15px;
  background: #fff9e6;
  border-left: 4px solid #FFA726;
  border-radius: 6px;
  display: flex;
  gap: 15px;
}

.translation-para p {
  margin: 0;
  flex: 1;
  color: #666;
  line-height: 1.8;
}

/* 题目区域 */
.questions-section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #667eea;
}

.section-header h3 {
  margin: 0;
  font-size: 1.4em;
  color: #333;
}

.progress-info {
  color: #666;
  font-size: 0.95em;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.question-card {
  padding: 25px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
}

.question-card.answered {
  border-left-color: #2196F3;
}

.question-card.correct {
  border-left-color: #4CAF50;
  background: #e8f5e9;
}

.question-card.wrong {
  border-left-color: #F44336;
  background: #ffebee;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.question-number {
  display: flex;
  align-items: center;
  gap: 10px;
}

.number {
  font-size: 1.3em;
  font-weight: bold;
  color: #667eea;
}

.question-score {
  color: #FF9800;
  font-weight: 600;
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
  padding: 15px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.option-item:hover {
  border-color: #667eea;
  background: #f5f7fa;
}

.option-item.selected {
  border-color: #2196F3;
  background: #e3f2fd;
}

.option-item.correct-answer {
  border-color: #4CAF50;
  background: #e8f5e9;
}

.option-item.wrong-answer {
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

/* 答案解析 */
.answer-analysis {
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  border: 2px solid #e0e0e0;
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #e0e0e0;
}

.correct-answer-text {
  color: #4CAF50;
  font-weight: 600;
}

.analysis-content h5 {
  color: #667eea;
  margin: 15px 0 8px 0;
  font-size: 1em;
}

.analysis-content p {
  margin: 0 0 10px 0;
  color: #555;
  line-height: 1.6;
}

.analysis-content blockquote {
  margin: 10px 0;
  padding: 12px 15px;
  background: #f5f7fa;
  border-left: 4px solid #667eea;
  border-radius: 6px;
  color: #666;
  font-style: italic;
}

/* 考试操作 */
.exam-actions {
  margin-top: 30px;
  display: flex;
  gap: 15px;
  justify-content: center;
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
  margin: 0;
  font-size: 0.95em;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .reading-practice {
    padding: 15px;
  }
  
  .year-selector {
    flex-direction: column;
  }
  
  .year-selector .el-select {
    width: 100%;
  }
  
  .mode-switch {
    flex-direction: column;
    gap: 15px;
  }
  
  .passage-info {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .info-right {
    width: 100%;
  }
  
  .info-right .el-button {
    flex: 1;
  }
  
  .section-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .exam-actions {
    flex-direction: column;
  }
  
  .exam-actions .el-button {
    width: 100%;
  }
}
</style>
