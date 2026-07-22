<template>
  <div class="reading-practice">
    <div class="practice-header">
      <h2 class="practice-title">📖 考研英语一真题阅读</h2>
      <p class="practice-subtitle">Part A · 传统阅读 · 按题型分类整理</p>
    </div>

    <!-- 题型标签切换 -->
    <div class="section-tabs">
      <el-tabs v-model="activeSection" type="card" size="large">
        <el-tab-pane label=" 传统阅读" name="Traditional Reading"></el-tab-pane>
        <el-tab-pane label="️ 完型填空" name="Use of English"></el-tab-pane>
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

            <!--  新手详细解析（如果有） -->
            <div v-if="question.detailedAnalysis" class="detailed-analysis-section">
              <el-divider />
              <h4 class="detailed-title">📚 新手详解版</h4>
              
              <!-- 文章结构分析 -->
              <div v-if="question.detailedAnalysis.articleStructure" class="detail-block">
                <h5>️ 文章结构分析</h5>
                <div class="structure-list">
                  <div 
                    v-for="(para, idx) in question.detailedAnalysis.articleStructure" 
                    :key="idx"
                    class="structure-item"
                    :class="{ 'key-paragraph': para.keyPoint.includes('⭐') }"
                  >
                    <span class="para-num">第{{ para.paragraph }}段:</span>
                    <span class="para-content">{{ para.content }}</span>
                    <el-tag v-if="para.keyPoint.includes('⭐')" type="warning" size="small">关键段落</el-tag>
                  </div>
                </div>
              </div>

              <!-- 关键词汇表 -->
              <div v-if="question.detailedAnalysis.vocabulary && question.detailedAnalysis.vocabulary.length > 0" class="detail-block">
                <h5>📖 核心词汇表</h5>
                <div class="vocab-grid">
                  <div 
                    v-for="(word, idx) in question.detailedAnalysis.vocabulary" 
                    :key="idx"
                    class="vocab-item"
                  >
                    <strong class="vocab-word">{{ word.word }}</strong>
                    <span class="vocab-meaning">{{ word.meaning }}</span>
                    <span v-if="word.example" class="vocab-example">例: {{ word.example }}</span>
                    <span v-if="word.note" class="vocab-note">({{ word.note }})</span>
                    <span v-if="word.contrast" class="vocab-contrast">对比: {{ word.contrast }}</span>
                    <span v-if="word.context" class="vocab-context">语境: {{ word.context }}</span>
                  </div>
                </div>
              </div>

              <!-- 解题步骤 -->
              <div v-if="question.detailedAnalysis.questionBreakdown" class="detail-block">
                <h5>🔍 解题步骤详解</h5>
                <div class="steps-list">
                  <div v-if="question.detailedAnalysis.questionBreakdown.step1" class="step-item">
                    <span class="step-icon">1️</span>
                    <span>{{ question.detailedAnalysis.questionBreakdown.step1 }}</span>
                  </div>
                  <div v-if="question.detailedAnalysis.questionBreakdown.step2" class="step-item">
                    <span class="step-icon">2️⃣</span>
                    <span>{{ question.detailedAnalysis.questionBreakdown.step2 }}</span>
                  </div>
                  <div v-if="question.detailedAnalysis.questionBreakdown.step3" class="step-item">
                    <span class="step-icon">3️⃣</span>
                    <span>{{ question.detailedAnalysis.questionBreakdown.step3 }}</span>
                  </div>
                  <div v-if="question.detailedAnalysis.questionBreakdown.step4" class="step-item">
                    <span class="step-icon">4️⃣</span>
                    <span>{{ question.detailedAnalysis.questionBreakdown.step4 }}</span>
                  </div>
                  <div v-if="question.detailedAnalysis.questionBreakdown.elimination" class="elimination-list">
                    <div v-for="(item, idx) in question.detailedAnalysis.questionBreakdown.elimination" :key="idx" class="elimination-item">
                      {{ item }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- 常见陷阱 -->
              <div v-if="question.detailedAnalysis.commonTraps && question.detailedAnalysis.commonTraps.length > 0" class="detail-block">
                <h5>️ 常见陷阱提醒</h5>
                <div class="traps-list">
                  <div v-for="(trap, idx) in question.detailedAnalysis.commonTraps" :key="idx" class="trap-item">
                    {{ trap }}
                  </div>
                </div>
              </div>

              <!-- 记忆技巧 -->
              <div v-if="question.detailedAnalysis.memoryTechnique" class="detail-block memory-block">
                <h5>🧠 记忆技巧</h5>
                <div class="memory-content">
                  <div v-if="question.detailedAnalysis.memoryTechnique.method" class="memory-method">
                    <strong>方法:</strong> {{ question.detailedAnalysis.memoryTechnique.method }}
                  </div>
                  <div v-if="question.detailedAnalysis.memoryTechnique.explanation" class="memory-explanation">
                    <strong>解释:</strong> {{ question.detailedAnalysis.memoryTechnique.explanation }}
                  </div>
                  <div v-if="question.detailedAnalysis.memoryTechnique.keyword" class="memory-keyword">
                    <strong>关键词:</strong> {{ question.detailedAnalysis.memoryTechnique.keyword }}
                  </div>
                  <div v-if="question.detailedAnalysis.memoryTechnique.visualAid" class="memory-visual">
                    <strong>可视化:</strong> {{ question.detailedAnalysis.memoryTechnique.visualAid }}
                  </div>
                </div>
              </div>
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

    <!-- 传统阅读 -->
    <div v-if="activeSection === 'Traditional Reading'" class="traditional-reading-section">
      <!-- 按年份和Text分组 -->
      <div 
        v-for="year in traditionalReadingYears" 
        :key="year"
        class="year-group"
      >
        <div 
          class="year-header"
          :class="{ 'expanded': expandedTraditionalYears.includes(year) }"
          @click="toggleTraditionalYear(year)"
        >
          <el-icon class="expand-icon" :class="{ 'rotated': expandedTraditionalYears.includes(year) }">
            <ArrowRight />
          </el-icon>
          <span class="year-text">{{ year }}年考研英语一 · 传统阅读</span>
        </div>

        <div v-show="expandedTraditionalYears.includes(year)" class="year-content">
          <!-- 按Text分组 -->
          <div 
            v-for="textNum in getTextNumbersByYear(year)" 
            :key="textNum"
            class="text-group"
          >
            <div 
              class="text-header"
              :class="{ 'expanded': isTextExpanded(year, textNum) }"
              @click="toggleText(year, textNum)"
            >
              <el-icon class="expand-icon" :class="{ 'rotated': isTextExpanded(year, textNum) }">
                <ArrowRight />
              </el-icon>
              <h4 class="text-title">Text {{ textNum }} - {{ getTextTitle(year, textNum) }}</h4>
              <el-tag type="info" size="small">5题</el-tag>
              <el-button 
                type="warning" 
                size="small"
                @click.stop="openIntensiveReadingForText(year, textNum)"
              >
                 精读
              </el-button>
            </div>

            <div v-show="isTextExpanded(year, textNum)" class="text-content">

            <!-- 文章原文 -->
            <div class="article-section">
              <div class="section-title">📄 文章原文</div>
              <div class="article-content" v-html="getArticleByYearAndText(year, textNum)"></div>
            </div>

            <!-- 题目列表 -->
            <div class="questions-list">
              <div 
                v-for="question in getQuestionsByYearAndText(year, textNum)" 
                :key="question.number"
                class="question-card"
              >
                <!-- 题目信息 -->
                <div class="question-meta">
                  <el-tag size="small">{{ question.year }}年</el-tag>
                  <el-tag size="small" type="warning">Text {{ question.textNumber }}</el-tag>
                  <el-tag size="small" type="warning">第{{ question.number }}题</el-tag>
                  <el-tag v-if="question.userAnswer" :type="question.userAnswer === question.correctAnswer ? 'success' : 'danger'" size="small">
                    {{ question.userAnswer === question.correctAnswer ? '✓ 正确' : '✗ 错误' }}
                  </el-tag>
                </div>

                <!-- 题干 -->
                <div class="question-stem">
                  {{ question.stem }}
                </div>

                <!-- 选项 -->
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

                <!-- 答案对比 -->
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

                <!-- 错误选项分析 -->
                <div v-if="question.userAnswer && question.userAnswer !== question.correctAnswer && question.errorAnalysis" class="error-analysis-section">
                  <h5 class="error-title">❌ 为什么你选的答案不对</h5>
                  <div class="error-item">
                    <span class="error-label">你选了 {{ question.userAnswer }}：</span>
                    <span class="error-explanation">{{ question.errorAnalysis[question.userAnswer] || '该选项不符合语境' }}</span>
                  </div>
                </div>

                <!-- 解题技巧 -->
                <div v-if="question.tips" class="tips-section">
                  <h5>🎯 解题技巧：</h5>
                  <p>{{ question.tips }}</p>
                </div>
              </div>
            </div>
          </div>
            </div>
        </div>
      </div>
    </div>

    <!-- 完型填空 -->
    <div v-if="activeSection === 'Use of English'" class="cloze-section">
      <!-- 按年份分组 -->
      <div 
        v-for="year in clozeYears" 
        :key="year"
        class="cloze-year-group"
      >
        <div 
          class="year-header"
          :class="{ 'expanded': expandedClozeYears.includes(year) }"
          @click="toggleClozeYear(year)"
        >
          <el-icon class="expand-icon" :class="{ 'rotated': expandedClozeYears.includes(year) }">
            <ArrowRight />
          </el-icon>
          <span class="year-text">{{ year }}年考研英语一 · 完形填空</span>
          <el-tag type="info" size="small">{{ getClozeQuestionsByYear(year).length }}题</el-tag>
          <el-button 
            type="warning" 
            size="small"
            @click.stop="openIntensiveReading('Use of English', year)"
          >
            📖 精读
          </el-button>
        </div>

        <div v-show="expandedClozeYears.includes(year)" class="year-content">
          <!-- 文章原文 -->
          <div class="article-section">
            <div class="section-title"> 文章原文</div>
            <div class="article-content" v-html="getClozeArticleByYear(year)"></div>
          </div>

          <!-- 题目列表 -->
          <div class="cloze-questions">
            <div class="section-title">❓ 题目</div>
            
            <div 
              v-for="(question, idx) in getClozeQuestionsByYear(year)" 
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
const activeSection = ref<'Traditional Reading' | 'Use of English' | 'New Question Types'>('Traditional Reading')
const expandedCloze = ref(false) // 完型填空大题默认折叠
const expandedClozeYears = ref<number[]>([]) // 完型填空展开的年份
const expandedTraditionalYears = ref<number[]>([]) // 传统阅读展开的年份
const expandedTexts = ref<string[]>([]) // 传统阅读展开的Text（格式："year-textNum"）

// 可用年份（2005-2025）
const availableYears = Array.from({ length: 21 }, (_, i) => 2005 + i).reverse()

// 过滤后的题目（包含传统阅读、完型填空和新题型）
const filteredQuestions = computed(() => {
  if (!allQuestions.value || allQuestions.value.length === 0) {
    return []
  }
  
  let questions = allQuestions.value.filter(q => 
    q.section === 'Traditional Reading' || q.section === 'Use of English' || q.section === 'New Question Types'
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

// 完型填空覆盖的年份
const clozeYears = computed(() => {
  if (!clozeQuestions.value || clozeQuestions.value.length === 0) {
    return []
  }
  const years = new Set(clozeQuestions.value.map(q => q.year))
  return Array.from(years).sort((a, b) => b - a) // 降序排列
})

// 获取某年的完型填空题目
const getClozeQuestionsByYear = (year: number) => {
  return clozeQuestions.value.filter(q => q.year === year)
}

// 切换完型填空年份展开/收起
const toggleClozeYear = (year: number) => {
  const idx = expandedClozeYears.value.indexOf(year)
  if (idx > -1) {
    expandedClozeYears.value.splice(idx, 1)
  } else {
    expandedClozeYears.value.push(year)
  }
}

// 生成某年的完型填空文章（带空格标记）
const getClozeArticleByYear = (year: number) => {
  const questions = getClozeQuestionsByYear(year)
  if (questions.length === 0) return ''
  
  // 尝试从第一个题目中获取article字段
  const firstQuestion = questions[0]
  if (firstQuestion.article) {
    return firstQuestion.article
  }
  
  // 如果没有article字段，返回提示信息
  return '<p style="color: #666; line-height: 2; text-align: justify;">' +
    `请导入${year}年完型填空的文章原文</p>`
}

// 传统阅读相关（Traditional Reading）
const traditionalQuestions = computed(() => {
  if (!filteredQuestions.value || filteredQuestions.value.length === 0) {
    return []
  }
  return filteredQuestions.value.filter(q => q.section === 'Traditional Reading')
})

// 传统阅读覆盖的年份
const traditionalReadingYears = computed(() => {
  if (!traditionalQuestions.value || traditionalQuestions.value.length === 0) {
    return []
  }
  const years = new Set(traditionalQuestions.value.map(q => q.year))
  return Array.from(years).sort((a, b) => b - a) // 降序排列
})

// 获取某年的Text编号列表
const getTextNumbersByYear = (year: number) => {
  const questions = traditionalQuestions.value.filter(q => q.year === year)
  const textNums = new Set(questions.map(q => q.textNumber))
  return Array.from(textNums).sort((a, b) => a - b)
}

// 获取某年某Text的题目
const getQuestionsByYearAndText = (year: number, textNum: number) => {
  return traditionalQuestions.value.filter(
    q => q.year === year && q.textNumber === textNum
  ).sort((a, b) => a.number - b.number)
}

// 获取某年某Text的标题
const getTextTitle = (year: number, textNum: number) => {
  const questions = getQuestionsByYearAndText(year, textNum)
  if (questions.length === 0) return '未知文章'
  
  // 从第一道题中获取title字段
  const firstQuestion = questions[0]
  return firstQuestion.title || '未知文章'
}

// 获取某年某Text的文章原文
const getArticleByYearAndText = (year: number, textNum: number) => {
  const questions = getQuestionsByYearAndText(year, textNum)
  if (questions.length === 0) return ''
  
  // 尝试从第一个题目中获取article字段
  const firstQuestion = questions[0]
  if (firstQuestion.article) {
    return firstQuestion.article
  }
  
  // 如果没有article字段，返回提示信息
  return '<p style="color: #666; line-height: 2; text-align: justify;">' +
    `请导入${year}年Text ${textNum}的文章原文</p>`
}

// 切换传统阅读年份展开/收起
const toggleTraditionalYear = (year: number) => {
  const idx = expandedTraditionalYears.value.indexOf(year)
  if (idx > -1) {
    expandedTraditionalYears.value.splice(idx, 1)
  } else {
    expandedTraditionalYears.value.push(year)
  }
}

// 切换Text展开/收起
const toggleText = (year: number, textNum: number) => {
  const key = `${year}-${textNum}`
  const idx = expandedTexts.value.indexOf(key)
  if (idx > -1) {
    expandedTexts.value.splice(idx, 1)
  } else {
    expandedTexts.value.push(key)
  }
}

// 检查Text是否展开
const isTextExpanded = (year: number, textNum: number) => {
  return expandedTexts.value.includes(`${year}-${textNum}`)
}

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
    '<strong style="color: #16345c;">___(1)___</strong> this is largely because, ' +
    '<strong style="color: #16345c;">___(2)___</strong> animals, we stand upright. ' +
    'This means that our noses are <strong style="color: #16345c;">___(3)___</strong> to perceiving those smells which float through the air, ' +
    '<strong style="color: #16345c;">___(4)___</strong> the majority of smells which stick to surfaces. ' +
    'In fact, <strong style="color: #16345c;">___(5)___</strong>, we are extremely sensitive to smells, ' +
    '<strong style="color: #16345c;">___(6)___</strong> we do not generally realize it. ' +
    'Our noses are capable of <strong style="color: #16345c;">___(7)___</strong> human smells even when these are ' +
    '<strong style="color: #16345c;">___(8)___</strong> to far below one part in one million. ' +
    'Strangely, some people find that they can smell one type of flower but not another, ' +
    '<strong style="color: #16345c;">___(9)___</strong> others are sensitive to the smells of both flowers. ' +
    'This may be because some people do not have the genes necessary to generate ' +
    '<strong style="color: #16345c;">___(10)___</strong> smell receptors in the nose. ' +
    'These receptors are the cells which sense smells and send ' +
    '<strong style="color: #16345c;">___(11)___</strong> to the brain. ' +
    'However, it has been found that even people insensitive to a certain smell ' +
    '<strong style="color: #16345c;">___(12)___</strong> can suddenly become sensitive to it when ' +
    '<strong style="color: #16345c;">___(13)___</strong> to it often enough. ' +
    'The explanation for insensitivity to smell seems to be that the brain finds it ' +
    '<strong style="color: #16345c;">___(14)___</strong> to keep all smell receptors working all the time but can ' +
    '<strong style="color: #16345c;">___(15)___</strong> new receptors if necessary. ' +
    'This may <strong style="color: #16345c;">___(16)___</strong> explain why we are not usually sensitive to our own smells—' +
    'we simply do not need to be. We are not <strong style="color: #16345c;">___(17)___</strong> of the usual smell of our own house, ' +
    'but we <strong style="color: #16345c;">___(18)___</strong> new smells when we visit someone else\'s. ' +
    'The brain finds it best to keep smell receptors <strong style="color: #16345c;">___(19)___</strong> for unfamiliar and emergency signals ' +
    '<strong style="color: #16345c;">___(20)___</strong> the smell of smoke, which might indicate the danger of fire.' +
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
          
          // 保存到 localStorage，下次加载时会与静态题库合并
          localStorage.setItem('readingQuestions', JSON.stringify(data))
          console.log('✅ 导入题目已保存到本地')
          
          alert(`✅ 成功导入 ${data.length} 道题目！\n已保存到本机，下次打开依然可见`)
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

传统阅读（Traditional Reading）：
[
  {
    "year": 2025,
    "section": "Traditional Reading",
    "textNumber": 1,
    "number": 21,
    "type": "细节题",
    "article": "<p>文章第一段...</p><p>文章第二段...</p>",
    "stem": "题干内容...",
    "options": [
      {"label": "A", "text": "选项A"},
      {"label": "B", "text": "选项B"},
      {"label": "C", "text": "选项C"},
      {"label": "D", "text": "选项D"}
    ],
    "correctAnswer": "A",
    "analysis": "答案解析...",
    "tips": "解题技巧..."
  }
]

完型填空（Use of English）：
[
  {
    "year": 2025,
    "section": "Use of English",
    "number": 1,
    "type": "逻辑关系",
    "article": "<p>文章第一段...</p><p>文章第二段...</p>",
    "stem": "Humans are often thought to be insensitive smellers...",
    "options": [...],
    "correctAnswer": "C",
    "analysis": "答案解析..."
  }
]

必填字段：year, section, type, stem, correctAnswer
选填字段：textNumber（传统阅读用）, number, article, options, analysis, tips, errorAnalysis

注意：article字段可以包含HTML标签，用于格式化文章内容`)
}

// 打开精读页面
const openIntensiveReading = (section: string, year: number) => {
  // 跳转到精读页面，传递题型和年份参数
  window.location.href = `/intensive-reading?section=${encodeURIComponent(section)}&year=${year}`
}

// 打开特定Text的精读页面
const openIntensiveReadingForText = (year: number, textNum: number) => {
  // 跳转到精读页面，传递题型、年份和Text编号
  window.location.href = `/intensive-reading?section=Traditional%20Reading&year=${year}&text=${textNum}`
}

onMounted(async () => {
  // 从静态数据文件加载英语真题（部署在 GitHub Pages，无需后端）
  try {
    console.log('🔄 加载英语真题数据...')
    const response = await fetch(`${import.meta.env.BASE_URL}data/english/reading-questions.json`)
    
    if (response.ok) {
      const data = await response.json()
      
      if (data.questions && data.questions.length > 0) {
        // 尝试从localStorage读取用户作答记录
        const savedAnswers = localStorage.getItem('readingUserAnswers')
        const userAnswersMap = savedAnswers ? JSON.parse(savedAnswers) : {}
        
        console.log('📝 localStorage中的作答记录:', userAnswersMap)
        
        // 合并用户答案到题目数据中
        allQuestions.value = data.questions.map((question: any) => {
          const questionKey = `${question.year}-${question.section}-${question.textNumber}-${question.number}`
          
          // 优先使用localStorage中的答案，如果没有则使用JSON文件中的userAnswer
          const localAnswer = userAnswersMap[questionKey]
          const jsonAnswer = question.userAnswer || ''
          
          if (localAnswer) {
            console.log(`题目 ${questionKey}: localStorage=${localAnswer}, JSON=${jsonAnswer}, 最终=${localAnswer}`)
            return { ...question, userAnswer: localAnswer }
          } else if (jsonAnswer) {
            console.log(`题目 ${questionKey}: 使用JSON中的答案 ${jsonAnswer}`)
            return { ...question, userAnswer: jsonAnswer }
          }
          
          return question
        })

        // 合并用户本地导入的题目（静态题库之外的补充，按 year-number 去重）
        const importedRaw = localStorage.getItem('readingQuestions')
        if (importedRaw) {
          try {
            const imported: any[] = JSON.parse(importedRaw)
            if (Array.isArray(imported) && imported.length > 0) {
              const existKeys = new Set(allQuestions.value.map((q: any) => `${q.year}-${q.number}`))
              const extras = imported.filter((q: any) => !existKeys.has(`${q.year}-${q.number}`))
              if (extras.length > 0) {
                allQuestions.value = [...allQuestions.value, ...extras]
                console.log(`📥 合并了 ${extras.length} 道本地导入题目`)
              }
            }
          } catch (e) {
            console.warn('本地导入题目解析失败', e)
          }
        }

        console.log(`✅ 成功加载 ${data.questions.length} 道题目`)
        console.log(`📝 已合并 ${Object.keys(userAnswersMap).length} 条作答记录`)
        
        // 打印Text3的题目答案
        const text3Questions = allQuestions.value.filter(q => q.year === 2005 && q.section === 'Traditional Reading' && q.textNumber === 3)
        console.log('📖 Text3题目答案:', text3Questions.map(q => ({
          number: q.number,
          userAnswer: q.userAnswer,
          correctAnswer: q.correctAnswer,
          isCorrect: q.userAnswer === q.correctAnswer
        })))
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
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
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
  border-left: 4px solid #ffc53d;
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
  color: #16345c;
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
  color: #16345c;
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
  border-left: 4px solid #ffc53d;
  border-radius: 6px;
  color: #666;
  font-style: italic;
}

/* 新手详细解析区域 */
.detailed-analysis-section {
  margin-top: 25px;
  padding-top: 20px;
}

.detailed-title {
  color: #FF6B35 !important;
  font-size: 1.2em;
  margin-bottom: 20px;
  font-weight: bold;
}

.detail-block {
  background: linear-gradient(135deg, #fff9f0 0%, #fff5e6 100%);
  border-left: 4px solid #FF6B35;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.detail-block h5 {
  color: #FF6B35 !important;
  font-size: 1.1em;
  margin: 0 0 15px 0;
  font-weight: bold;
}

/* 文章结构列表 */
.structure-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.structure-item {
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #ffe0c0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.structure-item.key-paragraph {
  border: 2px solid #FF6B35;
  background: #fff9f5;
}

.para-num {
  font-weight: bold;
  color: #FF6B35;
  min-width: 60px;
}

.para-content {
  flex: 1;
  color: #333;
}

/* 词汇网格 */
.vocab-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.vocab-item {
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #ffe0c0;
}

.vocab-word {
  color: #FF6B35;
  font-size: 1.1em;
  display: block;
  margin-bottom: 5px;
}

.vocab-meaning {
  color: #333;
  display: block;
  margin-bottom: 5px;
}

.vocab-example,
.vocab-note,
.vocab-contrast,
.vocab-context {
  color: #666;
  font-size: 0.9em;
  display: block;
  margin-top: 3px;
}

/* 解题步骤列表 */
.steps-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.step-item {
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #ffe0c0;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.step-icon {
  font-size: 1.2em;
  min-width: 30px;
}

.elimination-list {
  margin-top: 10px;
  padding-left: 40px;
}

.elimination-item {
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border-left: 3px solid #F44336;
  margin-bottom: 8px;
  color: #666;
}

/* 常见陷阱列表 */
.traps-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.trap-item {
  padding: 12px;
  background: white;
  border-radius: 6px;
  border-left: 3px solid #F44336;
  color: #666;
}

/* 记忆技巧块 */
.memory-block {
  background: linear-gradient(135deg, #f5f8fc 0%, #eef3fa 100%) !important;
  border-left-color: #ffc53d !important;
}

.memory-block h5 {
  color: #16345c !important;
}

.memory-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.memory-method,
.memory-explanation,
.memory-keyword,
.memory-visual {
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #d7e3f0;
}

.memory-method strong,
.memory-explanation strong,
.memory-keyword strong,
.memory-visual strong {
  color: #16345c;
  margin-right: 8px;
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
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
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

.article-content p {
  text-indent: 2em;
  margin: 0.8em 0;
}

/* 完形填空空格样式 */
.article-content u {
  display: inline-block;
  min-width: 2.5em;
  text-align: center;
  color: #e74c3c;
  font-weight: bold;
  text-decoration: none;
  border-bottom: 2px solid #e74c3c;
  margin: 0 0.1em;
  padding: 0 0.2em;
}

.section-title {
  font-size: 1.3em;
  font-weight: bold;
  color: #16345c;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 3px solid #ffc53d;
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
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s;
}

.year-header:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 33, 55, 0.3);
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

/* Text折叠样式 */
.text-group {
  margin-bottom: 15px;
}

.text-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s;
}

.text-header:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 33, 55, 0.3);
}

.text-header .expand-icon {
  color: white;
  transition: transform 0.3s;
}

.text-header .expand-icon.rotated {
  transform: rotate(90deg);
}

.text-title {
  font-size: 1.15em;
  font-weight: bold;
  flex: 1;
  margin: 0;
}

.text-content {
  margin-top: 12px;
  padding-left: 8px;
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
  border-color: #16345c;
  box-shadow: 0 2px 8px rgba(13, 33, 55, 0.12);
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
  background: #16345c;
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
  color: #16345c;
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
  background: #eef3fa;
  border-left: 4px solid #ffc53d;
  border-radius: 6px;
  margin-bottom: 15px;
}

.analysis-title {
  font-weight: bold;
  color: #16345c;
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

.article-content p {
  text-indent: 2em;
  margin: 0.8em 0;
}

/* 完形填空空格样式 */
.article-content u {
  display: inline-block;
  min-width: 2.5em;
  text-align: center;
  color: #e74c3c;
  font-weight: bold;
  text-decoration: none;
  border-bottom: 2px solid #e74c3c;
  margin: 0 0.1em;
  padding: 0 0.2em;
}

.section-title {
  font-size: 1.3em;
  font-weight: bold;
  color: #16345c;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 3px solid #ffc53d;
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
  border-color: #16345c;
  box-shadow: 0 2px 8px rgba(13, 33, 55, 0.12);
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
  background: #16345c;
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
  border-left: 4px solid #ffc53d;
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
  color: #16345c;
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

/* 传统阅读样式 */
.traditional-reading-section {
  margin-top: 20px;
}

.year-group {
  margin-bottom: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.year-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  user-select: none;
}

.year-header:hover {
  opacity: 0.95;
}

.year-header .expand-icon {
  transition: transform 0.3s;
  font-size: 1.2em;
}

.year-header .expand-icon.rotated {
  transform: rotate(90deg);
}

.year-text {
  font-size: 1.2em;
  font-weight: 600;
  flex: 1;
}

.year-content {
  padding: 20px;
}

.text-group {
  margin-bottom: 30px;
}

.text-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.text-title {
  font-size: 1.3em;
  font-weight: 600;
  color: white;
  margin: 0;
}

@media (max-width: 768px) {
  .year-text {
    font-size: 1em;
  }
  
  .text-title {
    font-size: 1.1em;
  }
}
</style>
