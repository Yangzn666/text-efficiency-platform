<template>
  <div class="reading-practice">
    <!-- 标题区 -->
    <div class="practice-header">
      <h2 class="practice-title">考研英语一 · 真题阅读</h2>
      <p class="practice-subtitle">Part A 传统阅读 / 完型填空 · 2005-2025</p>
    </div>

    <!-- 统计面板 -->
    <div class="stats-bar" v-if="allQuestions.length > 0">
      <div class="stat-card">
        <div class="stat-number">{{ filteredQuestions.length }}</div>
        <div class="stat-label">题目总数</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ answeredCount }}</div>
        <div class="stat-label">已作答</div>
      </div>
      <div class="stat-card accent">
        <div class="stat-number">{{ accuracyRate }}%</div>
        <div class="stat-label">正确率</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ correctCount }}</div>
        <div class="stat-label">答对题数</div>
      </div>
    </div>

    <!-- 题型标签切换 -->
    <div class="section-tabs">
      <el-tabs v-model="activeSection" type="card" size="large">
        <el-tab-pane label=" 传统阅读" name="Traditional Reading"></el-tab-pane>
        <el-tab-pane label=" 完型填空" name="Use of English"></el-tab-pane>
        <el-tab-pane label=" 新题型" name="New Question Types"></el-tab-pane>
      </el-tabs>
    </div>

    <!-- 筛选器 -->
    <div class="filter-section">
      <el-select v-model="selectedYear" placeholder="选择年份" size="large" @change="loadData">
        <el-option label="全部年份" value="all" />
        <el-option v-for="year in availableYears" :key="year" :label="`${year}年`" :value="year" />
      </el-select>
      <el-select v-model="selectedQuestionType" placeholder="选择题型" size="large" @change="filterQuestions">
        <el-option label="全部题型" value="all" />
        <el-option label="细节题" value="细节题" />
        <el-option label="主旨题" value="主旨题" />
        <el-option label="推理题" value="推理题" />
        <el-option label="词义题" value="词义题" />
        <el-option label="态度题" value="态度题" />
      </el-select>
    </div>

    <!-- ==================== 传统阅读 ==================== -->
    <div v-if="activeSection === 'Traditional Reading'" class="traditional-reading-section">
      <div v-for="year in traditionalReadingYears" :key="year" class="year-group">
        <div class="year-header" :class="{ expanded: expandedTraditionalYears.includes(year) }" @click="toggleTraditionalYear(year)">
          <el-icon class="expand-icon" :class="{ rotated: expandedTraditionalYears.includes(year) }"><ArrowRight /></el-icon>
          <span class="year-text">{{ year }}年 · 传统阅读</span>
          <span class="year-badge">{{ getTextNumbersByYear(year).length * 5 }}题</span>
        </div>

        <div v-show="expandedTraditionalYears.includes(year)" class="year-content">
          <div v-for="textNum in getTextNumbersByYear(year)" :key="textNum" class="text-group">
            <div class="text-header" :class="{ expanded: isTextExpanded(year, textNum) }" @click="toggleText(year, textNum)">
              <el-icon class="expand-icon" :class="{ rotated: isTextExpanded(year, textNum) }"><ArrowRight /></el-icon>
              <h4 class="text-title">Text {{ textNum }}</h4>
              <el-tag type="info" size="small">5题</el-tag>
              <el-button type="warning" size="small" @click.stop="toggleIntensiveReading(year, textNum)">
                {{ isIntensiveReadingOpen(year, textNum) ? '收起精读' : '精读模式' }}
              </el-button>
            </div>

            <div v-show="isTextExpanded(year, textNum)" class="text-content">
              <!-- 文章原文区 -->
              <div class="article-section">
                <div class="article-toolbar">
                  <span class="article-label">Article</span>
                  <el-button size="small" text @click.stop="toggleTranslations(year, textNum)">
                    {{ isTranslationVisible(year, textNum) ? '隐藏翻译' : '显示段落翻译' }}
                  </el-button>
                </div>
                <!-- 词汇覆盖率 -->
                <div v-if="isIntensiveReadingOpen(year, textNum)" class="vocab-coverage-bar">
                  <div class="vc-info">
                    <span class="vc-label">词汇覆盖</span>
                    <span class="vc-pct" :class="getCoverageColor(getVocabCoverage(year, textNum))">{{ getVocabCoverage(year, textNum) }}%</span>
                    <span class="vc-hint">{{ getCoverageHint(getVocabCoverage(year, textNum)) }}</span>
                  </div>
                  <div class="vc-track">
                    <div class="vc-fill" :style="{ width: getVocabCoverage(year, textNum) + '%' }" :class="getCoverageColor(getVocabCoverage(year, textNum))"></div>
                  </div>
                  <div class="vc-levels">
                    <span v-for="lv in vocabLevels" :key="lv.words" class="vc-level-btn" :class="{ active: selectedVocabLevel === lv.words }" @click.stop="selectedVocabLevel = lv.words">
                      {{ lv.label }}
                    </span>
                  </div>
                </div>

                <div class="article-body" v-html="getArticleByYearAndText(year, textNum)"></div>
                <!-- 段落翻译 -->
                <div v-if="isTranslationVisible(year, textNum)" class="paragraph-translations">
                  <div v-for="(para, idx) in getParagraphTranslations(year, textNum)" :key="idx" class="para-trans">
                    <span class="para-num">{{ idx + 1 }}</span>
                    <span class="para-cn">{{ para }}</span>
                  </div>
                  <div v-if="getParagraphTranslations(year, textNum).length === 0" class="no-data-hint">
                    暂无段落翻译数据，后续版本将补充
                  </div>
                </div>
              </div>

              <!-- 精读面板 -->
              <div v-if="isIntensiveReadingOpen(year, textNum)" class="intensive-reading-panel">
                <h4 class="panel-title">精读 · {{ year }}年 Text {{ textNum }}</h4>

                <!-- 核心词汇 -->
                <div v-if="getVocabulary(year, textNum).length > 0" class="ir-block">
                  <h5>核心词汇</h5>
                  <div class="vocab-grid">
                    <div v-for="(v, i) in getVocabulary(year, textNum)" :key="i" class="vocab-card">
                      <span class="vocab-word">{{ v.word }}</span>
                      <span class="vocab-phonetic">{{ v.phonetic || '' }}</span>
                      <span class="vocab-meaning">{{ v.meaning }}</span>
                      <span v-if="v.example" class="vocab-example">{{ v.example }}</span>
                    </div>
                  </div>
                </div>

                <!-- 长难句分析 -->
                <div v-if="getKeySentences(year, textNum).length > 0" class="ir-block">
                  <h5>长难句分析 <span class="grammar-legend">
                    <span class="gl-item"><span class="gl-dot gl-attr"></span>定语</span>
                    <span class="gl-item"><span class="gl-dot gl-adv"></span>状语</span>
                    <span class="gl-item"><span class="gl-dot gl-noun-clause"></span>名词性从句</span>
                    <span class="gl-item"><span class="gl-dot gl-appositive"></span>同位/插入</span>
                    <span class="gl-item"><span class="gl-dot gl-parallel"></span>并列</span>
                    <span class="gl-item"><span class="gl-dot gl-nonfinite"></span>非谓语</span>
                  </span></h5>
                  <div v-for="(s, i) in getKeySentences(year, textNum)" :key="i" class="sentence-card">
                    <div class="sentence-en-row">
                      <div class="sentence-en" v-html="parsedKeys.includes(`${year}-${textNum}-${i}`) && s.parse ? s.parse : escapeHtml(s.sentence)"></div>
                      <el-button size="small" :type="parsedKeys.includes(`${year}-${textNum}-${i}`) ? 'info' : 'warning'" plain @click.stop="toggleParse(year, textNum, i)">
                        {{ parsedKeys.includes(`${year}-${textNum}-${i}`) ? '收起拆解' : '拆解' }}
                      </el-button>
                    </div>
                    <div class="sentence-cn">{{ s.translation }}</div>
                    <div v-if="s.analysis" class="sentence-note" v-html="s.analysis"></div>
                  </div>
                </div>

                <!-- 篇章结构 -->
                <div v-if="getArticleStructure(year, textNum)" class="ir-block">
                  <h5>篇章结构</h5>
                  <div class="structure-list">
                    <div v-for="(p, i) in getArticleStructure(year, textNum)" :key="i" class="structure-item" :class="{ key: p.isKey }">
                      <span class="struct-label">P{{ i + 1 }}</span>
                      <span class="struct-content">{{ p.summary }}</span>
                    </div>
                  </div>
                </div>

                <!-- 无数据提示 -->
                <div v-if="getVocabulary(year, textNum).length === 0 && getKeySentences(year, textNum).length === 0 && !getArticleStructure(year, textNum)" class="ir-empty">
                  精读内容将在后续版本中补充，当前可先对照段落翻译进行精读
                </div>
              </div>

              <!-- 题目列表 -->
              <div class="questions-list">
                <div v-for="question in getQuestionsByYearAndText(year, textNum)" :key="question.number" class="question-card">
                  <div class="question-meta">
                    <el-tag size="small">{{ question.year }}年</el-tag>
                    <el-tag size="small" type="info">Text {{ question.textNumber }}</el-tag>
                    <el-tag size="small" type="warning">第{{ question.number }}题</el-tag>
                    <el-tag v-if="question.type" size="small" type="info">{{ question.type }}</el-tag>
                    <el-tag v-if="question.userAnswer" :type="question.userAnswer === question.correctAnswer ? 'success' : 'danger'" size="small">
                      {{ question.userAnswer === question.correctAnswer ? '正确' : '错误' }}
                    </el-tag>
                  </div>

                  <div class="question-stem">{{ question.stem }}</div>

                  <div v-if="question.options && question.options.length > 0" class="options-list">
                    <div v-for="option in question.options" :key="option.label" class="option-item"
                      :class="{
                        'correct': option.label === question.correctAnswer,
                        'user-wrong': question.userAnswer && question.userAnswer === option.label && option.label !== question.correctAnswer
                      }">
                      <span class="option-label">{{ option.label }}.</span>
                      <span class="option-text">{{ option.text }}</span>
                      <el-icon v-if="option.label === question.correctAnswer" class="correct-icon"><CircleCheck /></el-icon>
                      <el-icon v-if="question.userAnswer && question.userAnswer === option.label && option.label !== question.correctAnswer" class="wrong-icon"><CircleClose /></el-icon>
                    </div>
                  </div>

                  <!-- 答案和解析 -->
                  <div class="answer-section">
                    <div class="answer-row">
                      <span class="answer-label">正确答案</span>
                      <span class="answer-value correct-text">{{ question.correctAnswer }}</span>
                    </div>
                    <div class="answer-row" v-if="question.userAnswer">
                      <span class="answer-label">你的答案</span>
                      <span class="answer-value" :class="question.userAnswer === question.correctAnswer ? 'correct-text' : 'wrong-text'">{{ question.userAnswer }}</span>
                    </div>
                  </div>

                  <div class="analysis-section" v-if="question.analysis">
                    <div class="analysis-title">答案解析</div>
                    <div class="analysis-content" v-html="question.analysis"></div>
                  </div>

                  <div v-if="question.userAnswer && question.userAnswer !== question.correctAnswer && question.errorAnalysis" class="error-analysis">
                    <div class="error-title">错误选项分析</div>
                    <div class="error-item">
                      <span class="error-label">你选了 {{ question.userAnswer }}</span>
                      <span class="error-explanation">{{ question.errorAnalysis[question.userAnswer] || '该选项不符合语境' }}</span>
                    </div>
                  </div>

                  <div v-if="question.tips" class="tips-section">
                    <div class="tips-title">解题技巧</div>
                    <div class="tips-content" v-html="question.tips"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== 完型填空 ==================== -->
    <div v-if="activeSection === 'Use of English'" class="cloze-section">
      <div v-for="year in clozeYears" :key="year" class="cloze-year-group">
        <div class="year-header" :class="{ expanded: expandedClozeYears.includes(year) }" @click="toggleClozeYear(year)">
          <el-icon class="expand-icon" :class="{ rotated: expandedClozeYears.includes(year) }"><ArrowRight /></el-icon>
          <span class="year-text">{{ year }}年 · 完形填空</span>
          <span class="year-badge">{{ getClozeQuestionsByYear(year).length }}题</span>
          <el-button type="warning" size="small" @click.stop="toggleClozeTranslations(year)">
            {{ isClozeTranslationVisible(year) ? '隐藏翻译' : '显示翻译' }}
          </el-button>
        </div>

        <div v-show="expandedClozeYears.includes(year)" class="year-content">
          <!-- 文章原文 -->
          <div class="article-section">
            <div class="article-toolbar">
              <span class="article-label">Article</span>
            </div>
            <div class="article-body cloze-body" v-html="getClozeArticleByYear(year)" @click="onClozeBodyClick(year, $event)"></div>
            <!-- 段落翻译 -->
            <div v-if="isClozeTranslationVisible(year)" class="paragraph-translations">
              <div v-for="(para, idx) in getClozeParagraphTranslations(year)" :key="idx" class="para-trans">
                <span class="para-num">{{ idx + 1 }}</span>
                <span class="para-cn">{{ para }}</span>
              </div>
              <div v-if="getClozeParagraphTranslations(year).length === 0" class="no-data-hint">
                暂无段落翻译数据，后续版本将补充
              </div>
            </div>
          </div>

          <!-- 题目 -->
          <div class="cloze-questions">
            <div class="section-subtitle">题目</div>
            <div v-for="(question, idx) in getClozeQuestionsByYear(year)" :key="idx" :id="`cloze-q-${year}-${question.number}`" class="cloze-question-item">
              <div class="question-header">
                <div class="cloze-number" :class="{
                  'correct': question.userAnswer && question.userAnswer === question.correctAnswer,
                  'wrong': question.userAnswer && question.userAnswer !== question.correctAnswer
                }">{{ question.number }}</div>
                <div class="question-stem-text">{{ question.stem }}</div>
                <el-button size="small" type="primary" plain @click="toggleQuestionExpand(idx)">
                  {{ expandedQuestions.includes(idx) ? '收起' : '查看答案' }}
                </el-button>
              </div>

              <div v-show="expandedQuestions.includes(idx)" class="question-detail">
                <div v-if="question.options && question.options.length > 0" class="cloze-options">
                  <div v-for="option in question.options" :key="option.label" class="cloze-option"
                    :class="{
                      'correct': option.label === question.correctAnswer,
                      'user-wrong': question.userAnswer === option.label && option.label !== question.correctAnswer
                    }">
                    <span class="option-label">{{ option.label }}.</span>
                    <span class="option-text">{{ option.text }}</span>
                    <el-icon v-if="option.label === question.correctAnswer" class="icon-correct"><CircleCheck /></el-icon>
                    <el-icon v-if="question.userAnswer === option.label && option.label !== question.correctAnswer" class="icon-wrong"><CircleClose /></el-icon>
                  </div>
                </div>

                <div class="cloze-answer-row" v-if="question.userAnswer">
                  <span class="answer-label">你的答案</span>
                  <span :class="question.userAnswer === question.correctAnswer ? 'text-correct' : 'text-wrong'">{{ question.userAnswer }}</span>
                  <el-tag v-if="question.userAnswer === question.correctAnswer" type="success" size="small">正确</el-tag>
                  <el-tag v-else type="danger" size="small">错误</el-tag>
                  <span class="answer-sep">|</span>
                  <span class="answer-label">正确答案</span>
                  <span class="text-correct">{{ question.correctAnswer }}</span>
                </div>

                <div class="cloze-analysis" v-if="question.analysis">
                  <div class="analysis-content" v-html="question.analysis"></div>
                </div>

                <div v-if="question.userAnswer && question.userAnswer !== question.correctAnswer && question.errorAnalysis" class="cloze-error-analysis">
                  <div class="error-label">你选了 {{ question.userAnswer }}：</div>
                  <div class="error-explanation">{{ question.errorAnalysis[question.userAnswer] || '该选项不符合语境' }}</div>
                </div>

                <div v-if="question.tips" class="cloze-tips">
                  <div class="tips-content" v-html="question.tips"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== 新题型 ==================== -->
    <div v-if="activeSection === 'New Question Types'" class="type-groups">
      <div v-for="type in questionTypes" :key="type" class="type-group">
        <div class="group-header" @click="toggleGroup(type)">
          <div class="group-title">
            <el-icon class="expand-icon" :class="{ expanded: expandedGroups.includes(type) }"><ArrowRight /></el-icon>
            <el-tag size="large" :type="getQuestionTypeColor(type)">{{ type }}</el-tag>
            <span class="group-count">{{ getQuestionsByType(type).length }} 题</span>
          </div>
        </div>
        <div v-show="expandedGroups.includes(type)" class="questions-list">
          <div v-for="(question, idx) in getQuestionsByType(type)" :key="idx" class="question-card">
            <div class="question-meta">
              <el-tag size="small">{{ question.year }}年</el-tag>
              <el-tag v-if="question.section" size="small" type="info">{{ question.section }}</el-tag>
              <el-tag v-if="question.number" size="small" type="warning">第{{ question.number }}题</el-tag>
            </div>
            <div class="question-stem">{{ question.stem }}</div>
            <div v-if="question.options && question.options.length > 0" class="options-list">
              <div v-for="option in question.options" :key="option.label" class="option-item"
                :class="{ 'correct': option.label === question.correctAnswer, 'user-wrong': question.userAnswer && question.userAnswer === option.label && option.label !== question.correctAnswer }">
                <span class="option-label">{{ option.label }}.</span>
                <span class="option-text">{{ option.text }}</span>
              </div>
            </div>
            <div class="answer-section">
              <div class="answer-row">
                <span class="answer-label">正确答案</span>
                <span class="answer-value correct-text">{{ question.correctAnswer }}</span>
              </div>
            </div>
            <div class="analysis-section" v-if="question.analysis">
              <div class="analysis-content" v-html="question.analysis"></div>
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
    </div>
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
const activeSection = ref<'Traditional Reading' | 'Use of English' | 'New Question Types'>('Traditional Reading')
const expandedClozeYears = ref<number[]>([])
const expandedTraditionalYears = ref<number[]>([])
const expandedTexts = ref<string[]>([])
const expandedQuestions = ref<number[]>([])

// 句子拆解状态
const parsedKeys = ref<string[]>([]) // "year-textNum-sentenceIdx"
// 词汇覆盖率
const selectedVocabLevel = ref(3000)
const vocabLevels = [
  { label: '已掌握2000词', words: 2000 },
  { label: '已掌握3000词', words: 3000 },
  { label: '已掌握4000词', words: 4000 },
  { label: '已掌握5000词', words: 5000 }
]

// 精读模式状态
const intensiveReadingKeys = ref<string[]>([]) // "year-textNum"
// 段落翻译显示状态
const translationKeys = ref<string[]>([]) // "year-textNum" or "cloze-year"

// 可用年份（2005-2025）
const availableYears = Array.from({ length: 21 }, (_, i) => 2005 + i).reverse()

// 过滤后的题目
const filteredQuestions = computed(() => {
  if (!allQuestions.value || allQuestions.value.length === 0) return []
  let questions = allQuestions.value.filter(q =>
    q.section === 'Traditional Reading' || q.section === 'Use of English' || q.section === 'New Question Types'
  )
  if (selectedYear.value !== 'all') {
    questions = questions.filter(q => q.year === parseInt(selectedYear.value))
  }
  if (selectedQuestionType.value !== 'all') {
    questions = questions.filter(q => q.type === selectedQuestionType.value)
  }
  return questions
})

// 统计
const answeredCount = computed(() => filteredQuestions.value.filter(q => q.userAnswer).length)
const correctCount = computed(() => filteredQuestions.value.filter(q => q.userAnswer && q.userAnswer === q.correctAnswer).length)
const accuracyRate = computed(() => {
  const answered = answeredCount.value
  if (answered === 0) return 0
  return Math.round((correctCount.value / answered) * 100)
})

// 题型列表（新题型用）
const questionTypes = computed(() => {
  if (!filteredQuestions.value.length) return []
  return Array.from(new Set(filteredQuestions.value.map(q => q.type)))
})

// ===== 传统阅读 =====
const traditionalQuestions = computed(() =>
  filteredQuestions.value.filter(q => q.section === 'Traditional Reading')
)
const traditionalReadingYears = computed(() =>
  Array.from(new Set(traditionalQuestions.value.map(q => q.year))).sort((a, b) => b - a)
)
const getTextNumbersByYear = (year: number) =>
  Array.from(new Set(traditionalQuestions.value.filter(q => q.year === year).map(q => q.textNumber))).sort((a, b) => a - b)
const getQuestionsByYearAndText = (year: number, textNum: number) =>
  traditionalQuestions.value.filter(q => q.year === year && q.textNumber === textNum).sort((a, b) => a.number - b.number)
const getTextTitle = (year: number, textNum: number) => {
  const qs = getQuestionsByYearAndText(year, textNum)
  return qs.length ? (qs[0].title || '未知文章') : '未知文章'
}
const getArticleByYearAndText = (year: number, textNum: number) => {
  const qs = getQuestionsByYearAndText(year, textNum)
  if (!qs.length) return ''
  return qs[0].article || `<p style="color:#999">请导入${year}年Text ${textNum}的文章原文</p>`
}

// ===== 完型填空 =====
const clozeQuestions = computed(() =>
  filteredQuestions.value.filter(q => q.section === 'Use of English')
)
const clozeYears = computed(() =>
  Array.from(new Set(clozeQuestions.value.map(q => q.year))).sort((a, b) => b - a)
)
const getClozeQuestionsByYear = (year: number) =>
  clozeQuestions.value.filter(q => q.year === year)
// 将完形文章中的裸数字 1-20 转换为醒目的横线空位（可点击定位到对应题目）
const blankifyCloze = (html: string) =>
  html.replace(/(?<![0-9a-zA-Z])(1\d|20|[1-9])(?![0-9a-zA-Z%])/g, (n) =>
    `<span class="cloze-blank" data-blank="${n}" title="点击定位到第${n}题"><span class="cb-num">${n}</span></span>`
  )

const getClozeArticleByYear = (year: number) => {
  const qs = getClozeQuestionsByYear(year)
  if (!qs.length) return ''
  return blankifyCloze(qs[0].article || `<p style="color:#999">请导入${year}年完型填空文章</p>`)
}

// 空位点击（事件委托）：滚动定位到对应题目卡片
const onClozeBodyClick = (year: number, e: MouseEvent) => {
  const blank = (e.target as HTMLElement).closest('.cloze-blank')
  if (!blank) return
  const el = document.getElementById(`cloze-q-${year}-${blank.getAttribute('data-blank')}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.classList.add('flash-target')
    setTimeout(() => el.classList.remove('flash-target'), 1600)
  }
}

// ===== 新题型 =====
const getQuestionsByType = (type: string) => filteredQuestions.value.filter(q => q.type === type)
const getGroupStats = (type: string) => {
  const qs = getQuestionsByType(type)
  return { total: qs.filter(q => q.userAnswer).length, correct: qs.filter(q => q.userAnswer && q.userAnswer === q.correctAnswer).length }
}
const getQuestionTypeColor = (type: string) => {
  const m: Record<string, any> = { '细节题': 'primary', '主旨题': 'success', '推理题': 'warning', '词义题': 'danger', '态度题': 'info' }
  return m[type] || ''
}

// ===== 展开/折叠 =====
const toggleTraditionalYear = (year: number) => {
  const i = expandedTraditionalYears.value.indexOf(year)
  i > -1 ? expandedTraditionalYears.value.splice(i, 1) : expandedTraditionalYears.value.push(year)
}
const toggleText = (year: number, textNum: number) => {
  const key = `${year}-${textNum}`
  const i = expandedTexts.value.indexOf(key)
  i > -1 ? expandedTexts.value.splice(i, 1) : expandedTexts.value.push(key)
}
const isTextExpanded = (year: number, textNum: number) => expandedTexts.value.includes(`${year}-${textNum}`)
const toggleClozeYear = (year: number) => {
  const i = expandedClozeYears.value.indexOf(year)
  i > -1 ? expandedClozeYears.value.splice(i, 1) : expandedClozeYears.value.push(year)
}
const toggleQuestionExpand = (idx: number) => {
  const i = expandedQuestions.value.indexOf(idx)
  i > -1 ? expandedQuestions.value.splice(i, 1) : expandedQuestions.value.push(idx)
}
const toggleGroup = (type: string) => {
  const i = expandedGroups.value.indexOf(type)
  i > -1 ? expandedGroups.value.splice(i, 1) : expandedGroups.value.push(type)
}

// ===== 精读模式 =====
const toggleIntensiveReading = (year: number, textNum: number) => {
  const key = `${year}-${textNum}`
  const i = intensiveReadingKeys.value.indexOf(key)
  i > -1 ? intensiveReadingKeys.value.splice(i, 1) : intensiveReadingKeys.value.push(key)
}
const isIntensiveReadingOpen = (year: number, textNum: number) => intensiveReadingKeys.value.includes(`${year}-${textNum}`)

// ===== 段落翻译 =====
const toggleTranslations = (year: number, textNum: number) => {
  const key = `${year}-${textNum}`
  const i = translationKeys.value.indexOf(key)
  i > -1 ? translationKeys.value.splice(i, 1) : translationKeys.value.push(key)
}
const isTranslationVisible = (year: number, textNum: number) => translationKeys.value.includes(`${year}-${textNum}`)
const toggleClozeTranslations = (year: number) => {
  const key = `cloze-${year}`
  const i = translationKeys.value.indexOf(key)
  i > -1 ? translationKeys.value.splice(i, 1) : translationKeys.value.push(key)
}
const isClozeTranslationVisible = (year: number) => translationKeys.value.includes(`cloze-${year}`)

// 精读数据访问（后续版本从JSON加载）
const intensiveReadingData = ref<any>({})
const getVocabulary = (year: number, textNum: number) => intensiveReadingData.value[`${year}-${textNum}`]?.vocabulary || []
const getKeySentences = (year: number, textNum: number) => intensiveReadingData.value[`${year}-${textNum}`]?.keySentences || []
const getArticleStructure = (year: number, textNum: number) => intensiveReadingData.value[`${year}-${textNum}`]?.structure || null
const getParagraphTranslations = (year: number, textNum: number) => intensiveReadingData.value[`${year}-${textNum}`]?.paragraphTranslations || []
const getClozeParagraphTranslations = (year: number) => intensiveReadingData.value[`cloze-${year}`]?.paragraphTranslations || []

// ===== 工具函数 =====
const getCorrectOptionExplanation = (question: any) => {
  if (question.errorAnalysis && question.errorAnalysis[question.correctAnswer]) {
    return question.errorAnalysis[question.correctAnswer]
  }
  const opt = question.options?.find((o: any) => o.label === question.correctAnswer)
  return opt ? opt.text : ''
}
const getCorrectExplanation = getCorrectOptionExplanation

// ===== 句子拆解 =====
const toggleParse = (year: number, textNum: number, sentIdx: number) => {
  const key = `${year}-${textNum}-${sentIdx}`
  const i = parsedKeys.value.indexOf(key)
  i > -1 ? parsedKeys.value.splice(i, 1) : parsedKeys.value.push(key)
}
const escapeHtml = (text: string) => {
  if (!text) return ''
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// ===== 词汇覆盖率 =====
const getVocabCoverage = (year: number, textNum: number): number => {
  const vocab = getVocabulary(year, textNum)
  if (!vocab || vocab.length === 0) return 0
  // 按 word_type 分级：1=核心2000词内, 2=进阶3000-4000, 3=高级4000+
  // 覆盖率 = 已掌握词占总词数的百分比
  const level = selectedVocabLevel.value
  let knownCount = 0
  for (const v of vocab) {
    const wt = parseInt(v.word_type) || 3
    if (level >= 4000 && wt <= 3) knownCount++
    else if (level >= 3000 && wt <= 2) knownCount++
    else if (level >= 2000 && wt <= 1) knownCount++
  }
  return Math.round((knownCount / vocab.length) * 100)
}
const getCoverageColor = (pct: number): string => {
  if (pct >= 98) return 'vc-excellent'
  if (pct >= 90) return 'vc-good'
  if (pct >= 80) return 'vc-ok'
  return 'vc-low'
}
const getCoverageHint = (pct: number): string => {
  if (pct >= 98) return '顺畅阅读'
  if (pct >= 90) return '基本能读'
  if (pct >= 80) return '需要查词'
  return '词汇盲区较多'
}

// 加载数据
const loadData = () => {
  console.log(`加载数据：年份=${selectedYear.value}, 题型=${selectedQuestionType.value}`)
}
const filterQuestions = () => {
  console.log(`按题型过滤：${selectedQuestionType.value}`)
}

onMounted(async () => {
  try {
    console.log('加载英语真题数据...')
    const response = await fetch(`${import.meta.env.BASE_URL}data/english/reading-questions.json`)
    if (response.ok) {
      const data = await response.json()
      if (data.questions && data.questions.length > 0) {
        const savedAnswers = localStorage.getItem('readingUserAnswers')
        const userAnswersMap = savedAnswers ? JSON.parse(savedAnswers) : {}

        allQuestions.value = data.questions.map((question: any) => {
          const questionKey = `${question.year}-${question.section}-${question.textNumber}-${question.number}`
          const localAnswer = userAnswersMap[questionKey]
          const jsonAnswer = question.userAnswer || ''
          if (localAnswer) {
            return { ...question, userAnswer: localAnswer }
          } else if (jsonAnswer) {
            return { ...question, userAnswer: jsonAnswer }
          }
          return question
        })

        // 合并本地导入的补充题目
        const importedRaw = localStorage.getItem('readingQuestions')
        if (importedRaw) {
          try {
            const imported: any[] = JSON.parse(importedRaw)
            if (Array.isArray(imported) && imported.length > 0) {
              const existKeys = new Set(allQuestions.value.map((q: any) => `${q.year}-${q.number}`))
              const extras = imported.filter((q: any) => !existKeys.has(`${q.year}-${q.number}`))
              if (extras.length > 0) {
                allQuestions.value = [...allQuestions.value, ...extras]
                console.log(`合并了 ${extras.length} 道本地导入题目`)
              }
            }
          } catch (e) {
            console.warn('本地导入题目解析失败', e)
          }
        }

        console.log(`成功加载 ${data.questions.length} 道题目`)

        // 加载精读数据
        try {
          const irResponse = await fetch(`${import.meta.env.BASE_URL}data/english/intensive-reading.json`)
          if (irResponse.ok) {
            intensiveReadingData.value = await irResponse.json()
            console.log('成功加载精读数据')
          }
        } catch (e) {
          console.log('精读数据暂未就绪，将在后续版本补充')
        }
      }
    }
  } catch (error) {
    console.error('加载英语真题失败:', error)
  }
})
</script>

<style scoped>
/* ===== 全局布局 ===== */
.reading-practice {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 20px 60px;
}
.practice-header {
  text-align: center;
  margin-bottom: 28px;
}
.practice-title {
  font-size: 2em;
  color: #1a1a2e;
  margin: 0 0 8px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.practice-subtitle {
  color: #888;
  font-size: 1.05em;
  margin: 0;
}

/* ===== 统计面板 ===== */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 28px;
}
.stat-card {
  background: #f7f8fa;
  border-radius: 12px;
  padding: 18px 12px;
  text-align: center;
  border: 1px solid #eee;
  transition: transform 0.2s;
}
.stat-card:hover { transform: translateY(-2px); }
.stat-card.accent {
  background: linear-gradient(135deg, #16345c, #1e4576);
  border-color: transparent;
}
.stat-card.accent .stat-number,
.stat-card.accent .stat-label { color: #fff; }
.stat-number {
  font-size: 1.8em;
  font-weight: 700;
  color: #16345c;
  line-height: 1.2;
}
.stat-label {
  font-size: 0.9em;
  color: #888;
  margin-top: 4px;
}

/* ===== Tab 和筛选 ===== */
.section-tabs { margin-bottom: 20px; }
.filter-section {
  display: flex;
  gap: 14px;
  justify-content: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
}
.filter-section .el-select { width: 170px; }

/* ===== 年份/Text 折叠头 ===== */
.year-group {
  margin-bottom: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  overflow: hidden;
}
.year-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 22px;
  background: linear-gradient(135deg, #16345c, #1e4576);
  color: #fff;
  cursor: pointer;
  user-select: none;
  transition: all 0.25s;
}
.year-header:hover { opacity: 0.92; }
.year-header .expand-icon { transition: transform 0.3s; font-size: 1.15em; }
.year-header .expand-icon.rotated { transform: rotate(90deg); }
.year-text { font-size: 1.15em; font-weight: 600; flex: 1; }
.year-badge {
  background: rgba(255,255,255,0.2);
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 0.85em;
}
.year-content { padding: 20px; }

/* Text 头 */
.text-group { margin-bottom: 24px; }
.text-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  background: linear-gradient(135deg, #2c5282, #2b6cb0);
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  transition: all 0.25s;
  margin-bottom: 16px;
}
.text-header:hover { opacity: 0.92; }
.text-header .expand-icon { transition: transform 0.3s; }
.text-header .expand-icon.rotated { transform: rotate(90deg); }
.text-title { font-size: 1.1em; font-weight: 600; flex: 1; margin: 0; }
.text-content { padding-left: 4px; }

/* ===== 文章原文区 ===== */
.article-section {
  background: #fffef7;
  border: 1px solid #f0e6c8;
  border-radius: 10px;
  padding: 28px 32px;
  margin-bottom: 24px;
}
.article-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0e6c8;
}
.article-label {
  font-size: 0.85em;
  font-weight: 600;
  color: #b7950b;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.article-body {
  font-family: 'Georgia', 'Times New Roman', 'SimSun', serif;
  font-size: 1.15em;
  line-height: 2.4;
  color: #2d2d2d;
  text-align: justify;
}
.article-body p {
  text-indent: 2em;
  margin: 0.6em 0;
}
.article-body u,
.article-body .blank-marker {
  display: inline-block;
  min-width: 2.5em;
  text-align: center;
  color: #c0392b;
  font-weight: 700;
  text-decoration: none;
  border-bottom: 2px solid #c0392b;
  margin: 0 0.15em;
  padding: 0 0.3em;
  font-family: inherit;
}

/* ===== 段落翻译 ===== */
.paragraph-translations {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #e0d5b5;
}
.para-trans {
  display: flex;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f5f0e0;
  align-items: flex-start;
}
.para-trans:last-child { border-bottom: none; }
.para-num {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background: #f0e6c8;
  color: #8b7355;
  border-radius: 50%;
  font-size: 0.8em;
  font-weight: 600;
}
.para-cn {
  flex: 1;
  color: #555;
  line-height: 1.8;
  font-size: 0.95em;
  font-family: 'Microsoft YaHei', sans-serif;
}
.no-data-hint {
  text-align: center;
  color: #bbb;
  padding: 16px;
  font-size: 0.9em;
}

/* ===== 精读面板 ===== */
.intensive-reading-panel {
  background: linear-gradient(135deg, #f0f7ff, #e8f4fd);
  border: 1px solid #c8dff5;
  border-radius: 10px;
  padding: 24px 28px;
  margin-bottom: 24px;
}
.panel-title {
  font-size: 1.2em;
  color: #2c5282;
  margin: 0 0 20px;
  font-weight: 700;
}
.ir-block {
  margin-bottom: 24px;
}
.ir-block h5 {
  font-size: 1.05em;
  color: #2c5282;
  margin: 0 0 14px;
  padding-bottom: 8px;
  border-bottom: 2px solid #c8dff5;
}
.ir-empty {
  text-align: center;
  color: #999;
  padding: 24px;
  font-size: 0.95em;
}

/* 词汇网格 */
.vocab-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 10px;
}
.vocab-card {
  background: #fff;
  border: 1px solid #d8e8f8;
  border-radius: 8px;
  padding: 12px 14px;
}
.vocab-word {
  display: block;
  font-size: 1.1em;
  font-weight: 700;
  color: #2c5282;
  margin-bottom: 2px;
}
.vocab-phonetic {
  display: block;
  font-size: 0.85em;
  color: #999;
  margin-bottom: 4px;
}
.vocab-meaning {
  display: block;
  color: #444;
  font-size: 0.92em;
  line-height: 1.5;
}
.vocab-example {
  display: block;
  color: #888;
  font-size: 0.85em;
  margin-top: 4px;
  font-style: italic;
}

/* 长难句 */
.sentence-card {
  background: #fff;
  border: 1px solid #d8e8f8;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}
.sentence-en {
  font-size: 1.05em;
  color: #2d2d2d;
  line-height: 1.8;
  margin-bottom: 8px;
  font-family: 'Georgia', serif;
}
.sentence-cn {
  color: #666;
  font-size: 0.95em;
  line-height: 1.6;
  margin-bottom: 6px;
}
.sentence-note {
  color: #2c5282;
  font-size: 0.88em;
  padding: 8px 12px;
  background: #f5f9ff;
  border-radius: 6px;
  margin-top: 6px;
}

/* 篇章结构 */
.structure-list { display: flex; flex-direction: column; gap: 8px; }
.structure-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 10px 14px;
  background: #fff;
  border: 1px solid #d8e8f8;
  border-radius: 8px;
}
.structure-item.key { border-color: #2c5282; background: #f0f7ff; }
.struct-label {
  flex-shrink: 0;
  font-weight: 700;
  color: #2c5282;
  min-width: 30px;
}
.struct-content { flex: 1; color: #444; line-height: 1.6; }

/* ===== 题目卡片 ===== */
.questions-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.question-card {
  background: #fafbfc;
  border: 1px solid #e8ecf0;
  border-radius: 10px;
  padding: 22px 24px;
  transition: all 0.2s;
}
.question-card:hover {
  border-color: #c8d0d8;
  box-shadow: 0 3px 12px rgba(0,0,0,0.06);
}
.question-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}
.question-stem {
  font-size: 1.05em;
  color: #2d2d2d;
  margin-bottom: 18px;
  line-height: 1.7;
  font-weight: 500;
}

/* 选项 */
.options-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px; }
.option-item {
  padding: 11px 14px;
  background: #fff;
  border: 1.5px solid #e0e4e8;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  transition: all 0.2s;
}
.option-item:hover { border-color: #b0b8c0; }
.option-item.correct { border-color: #48bb78; background: #f0fff4; }
.option-item.user-wrong { border-color: #f56565; background: #fff5f5; }
.option-label { font-weight: 700; color: #2c5282; flex-shrink: 0; min-width: 20px; }
.option-text { flex: 1; color: #333; line-height: 1.6; }
.correct-icon { color: #48bb78; font-size: 1.2em; }
.wrong-icon { color: #f56565; font-size: 1.2em; }

/* 答案区 */
.answer-section {
  display: flex;
  gap: 20px;
  padding: 12px 16px;
  background: #f7f9fb;
  border-radius: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.answer-row { display: flex; align-items: center; gap: 8px; }
.answer-label { color: #888; font-size: 0.9em; }
.answer-value { font-weight: 700; font-size: 1.1em; }
.correct-text { color: #48bb78; }
.wrong-text { color: #f56565; }

/* 解析 */
.analysis-section {
  padding: 16px;
  background: #f0f7ff;
  border-left: 3px solid #2c5282;
  border-radius: 0 8px 8px 0;
  margin-bottom: 14px;
}
.analysis-title {
  font-weight: 600;
  color: #2c5282;
  margin-bottom: 8px;
  font-size: 0.95em;
}
.analysis-content {
  color: #444;
  line-height: 1.9;
  font-size: 0.95em;
}
.analysis-content :deep(p) { margin: 0.4em 0; }

/* 错误分析 */
.error-analysis {
  padding: 16px;
  background: #fff5f5;
  border-left: 3px solid #f56565;
  border-radius: 0 8px 8px 0;
  margin-bottom: 14px;
}
.error-title {
  font-weight: 600;
  color: #f56565;
  margin-bottom: 10px;
  font-size: 0.95em;
}
.error-item { margin-bottom: 8px; }
.error-label { color: #f56565; font-weight: 600; display: block; margin-bottom: 4px; }
.error-explanation { color: #555; line-height: 1.7; display: block; }

/* 技巧 */
.tips-section {
  padding: 16px;
  background: #fffff0;
  border-left: 3px solid #ecc94b;
  border-radius: 0 8px 8px 0;
}
.tips-title {
  font-weight: 600;
  color: #b7791f;
  margin-bottom: 8px;
  font-size: 0.95em;
}
.tips-content {
  color: #555;
  line-height: 1.9;
  font-size: 0.95em;
}
.tips-content :deep(p) { margin: 0.4em 0; }

/* ===== 完型填空 ===== */
.cloze-section { max-width: 1000px; margin: 0 auto; }
.cloze-year-group { margin-bottom: 20px; }

/* 完形文章排版：更大字号、舒展行高、明确段距 */
.cloze-body {
  font-size: 1.22em;
  line-height: 2.7;
  letter-spacing: 0.02em;
}
.cloze-body :deep(p) {
  margin: 0 0 1.4em;
}

/* 完形空位：金色下划线 + 悬浮题号徽标，点击定位题目 */
.cloze-body :deep(.cloze-blank) {
  display: inline-block;
  position: relative;
  min-width: 2.6em;
  margin: 0 0.15em;
  border-bottom: 3px solid #ffc53d;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
  vertical-align: baseline;
}
.cloze-body :deep(.cloze-blank .cb-num) {
  display: inline-block;
  min-width: 1.5em;
  padding: 0 0.35em;
  margin-bottom: 2px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62em;
  font-weight: 700;
  line-height: 1.7;
  color: #0d2137;
  background: linear-gradient(135deg, #ffc53d, #f0a820);
  border-radius: 999px;
  box-shadow: 0 2px 6px rgba(255, 197, 61, 0.45);
  vertical-align: super;
  transition: transform 0.2s ease;
}
.cloze-body :deep(.cloze-blank:hover) {
  border-bottom-color: #f0a820;
  background: rgba(255, 197, 61, 0.12);
  border-radius: 4px;
}
.cloze-body :deep(.cloze-blank:hover .cb-num) {
  transform: translateY(-2px) scale(1.08);
}

/* 空位点击后目标题目高亮闪烁 */
.cloze-question-item.flash-target {
  border-color: #ffc53d;
  box-shadow: 0 0 0 3px rgba(255, 197, 61, 0.35), 0 4px 16px rgba(255, 197, 61, 0.25);
}
.section-subtitle {
  font-size: 1.15em;
  font-weight: 700;
  color: #16345c;
  margin-bottom: 18px;
  padding-bottom: 8px;
  border-bottom: 2px solid #ffc53d;
}
.cloze-question-item {
  background: #fff;
  border: 1.5px solid #e0e4e8;
  border-radius: 8px;
  padding: 18px 20px;
  margin-bottom: 12px;
  transition: all 0.2s;
}
.cloze-question-item:hover { border-color: #16345c; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.question-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.cloze-number {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: linear-gradient(135deg, #ffc53d, #f0a820);
  color: #0d2137;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.95em;
  box-shadow: 0 2px 8px rgba(255, 197, 61, 0.4);
}
.cloze-number.correct { background: #48bb78 !important; color: #fff; }
.cloze-number.wrong { background: #f56565 !important; color: #fff; }
.question-stem-text { flex: 1; font-size: 1em; line-height: 1.6; color: #333; padding-top: 4px; }

.question-detail { margin-top: 16px; padding-top: 16px; border-top: 1px solid #f0f0f0; }

/* 完型选项（横向2列） */
.cloze-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}
.cloze-option {
  padding: 10px 14px;
  border: 1.5px solid #e0e4e8;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}
.cloze-option.correct { border-color: #48bb78; background: #f0fff4; }
.cloze-option.user-wrong { border-color: #f56565; background: #fff5f5; }
.icon-correct { color: #48bb78; font-size: 1.1em; }
.icon-wrong { color: #f56565; font-size: 1.1em; }

.cloze-answer-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #f7f9fb;
  border-radius: 6px;
  margin-bottom: 14px;
  flex-wrap: wrap;
  font-size: 0.95em;
}
.answer-sep { color: #ddd; margin: 0 4px; }
.text-correct { color: #48bb78; font-weight: 700; }
.text-wrong { color: #f56565; font-weight: 700; }

.cloze-analysis {
  padding: 14px;
  background: #f0f7ff;
  border-left: 3px solid #2c5282;
  border-radius: 0 6px 6px 0;
  margin-bottom: 12px;
}
.cloze-error-analysis {
  padding: 14px;
  background: #fff5f5;
  border-left: 3px solid #f56565;
  border-radius: 0 6px 6px 0;
  margin-bottom: 12px;
}
.cloze-tips {
  padding: 14px;
  background: #fffff0;
  border-left: 3px solid #ecc94b;
  border-radius: 0 6px 6px 0;
}

/* ===== 新题型 ===== */
.type-groups { display: flex; flex-direction: column; gap: 20px; }
.type-group {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  overflow: hidden;
}
.group-header {
  padding: 18px 22px;
  background: #f8f9fa;
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid #eee;
  transition: background 0.2s;
}
.group-header:hover { background: #f0f2f5; }
.group-title { display: flex; align-items: center; gap: 12px; }
.group-count { color: #888; font-size: 0.9em; }

/* ===== 空状态 ===== */
.empty-state { text-align: center; padding: 80px 20px; color: #999; }
.empty-state h3 { margin: 20px 0 10px; color: #666; }
.empty-state p { margin: 0 0 20px; font-size: 0.95em; }

/* ===== 通用 ===== */
.expand-icon { display: inline-block; transition: transform 0.3s; margin-right: 6px; }
.expand-icon.expanded, .expand-icon.rotated { transform: rotate(90deg); }

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .reading-practice { padding: 16px 12px 40px; }
  .stats-bar { grid-template-columns: repeat(2, 1fr); }
  .filter-section { flex-direction: column; align-items: stretch; }
  .filter-section .el-select { width: 100%; }
  .cloze-options { grid-template-columns: 1fr; }
  .article-section { padding: 20px 16px; }
  .article-body { font-size: 1.05em; }
  .vocab-grid { grid-template-columns: 1fr; }
  .practice-title { font-size: 1.5em; }
  .answer-section { flex-direction: column; gap: 8px; }
  .sentence-en-row { flex-direction: column; }
  .grammar-legend { margin-left: 0; margin-top: 8px; gap: 6px; font-size: 0.72em; }
  .vocab-coverage-bar { padding: 10px 12px; }
  .vc-level-btn { padding: 4px 12px; font-size: 0.8em; }
  .article-body { overflow-wrap: break-word; word-break: break-word; }
  .intensive-reading-panel { padding: 16px 14px; }
  .vocab-grid { grid-template-columns: 1fr; }
}
/* ===== 长难句拆解 ===== */
.sentence-en-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.sentence-en-row .sentence-en { flex: 1; }
.grammar-legend {
  display: inline-flex;
  gap: 10px;
  margin-left: 12px;
  font-weight: 400;
  font-size: 0.78em;
  color: #888;
  flex-wrap: wrap;
}
.gl-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.gl-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 2px;
}
.gl-attr { background: #3b82f6; }
.gl-adv { background: #22c55e; }
.gl-noun-clause { background: #a855f7; }
.gl-appositive { background: #f59e0b; }
.gl-parallel { background: #14b8a6; }
.gl-nonfinite { background: #ef4444; }

/* 语法高亮 span 样式 */
:deep(.g-attr) { color: #3b82f6; border-bottom: 2px solid #3b82f6; }
:deep(.g-adv) { color: #22c55e; border-bottom: 2px solid #22c55e; }
:deep(.g-clause) { color: #a855f7; border-bottom: 2px solid #a855f7; }
:deep(.g-appos) { color: #f59e0b; border-bottom: 2px solid #f59e0b; font-style: italic; }
:deep(.g-parallel) { color: #14b8a6; border-bottom: 2px solid #14b8a6; }
:deep(.g-nonfinite) { color: #ef4444; border-bottom: 2px solid #ef4444; }
:deep(.g-main) { font-weight: 700; }
:deep(.g-label) {
  font-size: 0.7em;
  color: #999;
  vertical-align: super;
  margin-left: 1px;
  font-family: 'Microsoft YaHei', sans-serif;
}

/* ===== 词汇覆盖率 ===== */
.vocab-coverage-bar {
  background: #fefce8;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
}
.vc-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.vc-label {
  font-size: 0.85em;
  color: #92400e;
  font-weight: 600;
}
.vc-pct {
  font-size: 1.3em;
  font-weight: 700;
}
.vc-pct.vc-excellent { color: #16a34a; }
.vc-pct.vc-good { color: #2563eb; }
.vc-pct.vc-ok { color: #d97706; }
.vc-pct.vc-low { color: #dc2626; }
.vc-hint {
  font-size: 0.82em;
  color: #78716c;
  margin-left: 4px;
}
.vc-track {
  height: 6px;
  background: #e5e7eb;
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 8px;
}
.vc-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.4s ease;
}
.vc-fill.vc-excellent { background: linear-gradient(90deg, #16a34a, #22c55e); }
.vc-fill.vc-good { background: linear-gradient(90deg, #2563eb, #60a5fa); }
.vc-fill.vc-ok { background: linear-gradient(90deg, #d97706, #fbbf24); }
.vc-fill.vc-low { background: linear-gradient(90deg, #dc2626, #f87171); }
.vc-levels {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.vc-level-btn {
  font-size: 0.75em;
  padding: 2px 10px;
  border-radius: 12px;
  border: 1px solid #d4d4d8;
  background: #fff;
  color: #71717a;
  cursor: pointer;
  transition: all 0.2s;
}
.vc-level-btn:hover { border-color: #a3a3a3; }
.vc-level-btn.active {
  background: #fef3c7;
  border-color: #f59e0b;
  color: #92400e;
  font-weight: 600;
}

@media (max-width: 480px) {
  .practice-title { font-size: 1.3em; }
  .sentence-card { padding: 12px; }
  .grammar-legend { gap: 4px; font-size: 0.68em; }
  .vc-pct { font-size: 1.1em; }
  .vocab-coverage-bar { padding: 8px 10px; }
  .year-header { padding: 12px 14px; }
  .text-header { padding: 10px 14px; flex-wrap: wrap; }
  .article-section { padding: 16px 12px; }
}
</style>
