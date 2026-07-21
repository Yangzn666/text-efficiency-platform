<template>
  <div class="intensive-reading" :class="{ 'use-of-english': section === 'Use of English' }">
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
      <p class="reading-subtitle">逐句精读 · 深度解析 · 全面提升阅读能力</p>
    </div>

    <!-- 文章原文 -->
    <div class="article-container">
      <div class="article-section">
        <div class="section-title">
          <el-icon><Document /></el-icon>
          {{ section === 'Use of English' ? '文章原文（带空格标记）' : '文章原文' }}
        </div>
        <div class="article-content" v-html="articleContent"></div>
      </div>

      <!-- 逐句精读解析 -->
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
          <!-- 英文原句（带序号） -->
          <div class="sentence-original">
            <span class="sentence-number">{{ idx + 1 }}</span>
            <div class="sentence-content">
              <span class="sentence-text" v-html="highlightKeywords(sentence.english)"></span>
            </div>
          </div>

          <!-- 中文翻译 -->
          <div class="sentence-translation">
            <el-icon><ChatDotRound /></el-icon>
            <div class="translation-content">
              <span class="translation-label">精准翻译：</span>
              <span class="translation-text">{{ sentence.chinese }}</span>
            </div>
          </div>

          <!-- 核心词汇 -->
          <div v-if="sentence.vocabulary && sentence.vocabulary.length > 0" class="sentence-vocabulary">
            <el-icon><Collection /></el-icon>
            <div class="vocabulary-content">
              <span class="vocab-label">核心词汇：</span>
              <div class="vocab-list">
                <el-tag 
                  v-for="(word, wIdx) in sentence.vocabulary" 
                  :key="wIdx"
                  type="info"
                  size="default"
                  effect="plain"
                  class="vocab-tag"
                >
                  <strong>{{ word.word }}</strong>
                  <span class="vocab-meaning">{{ word.meaning }}</span>
                  <span v-if="word.usage" class="vocab-usage">· {{ word.usage }}</span>
                </el-tag>
              </div>
            </div>
          </div>

          <!-- 语法结构 -->
          <div v-if="sentence.grammar" class="sentence-grammar">
            <el-icon><Notebook /></el-icon>
            <div class="grammar-content">
              <span class="grammar-label">语法结构：</span>
              <div class="grammar-text" v-html="sentence.grammar"></div>
            </div>
          </div>

          <!-- 结构拆解 -->
          <div v-if="sentence.structure" class="sentence-structure">
            <el-icon><Operation /></el-icon>
            <div class="structure-content">
              <span class="structure-label">结构拆解：</span>
              <pre class="structure-text">{{ sentence.structure }}</pre>
            </div>
          </div>

          <!-- 逻辑关系 -->
          <div v-if="sentence.logic" class="sentence-logic">
            <el-icon><Share /></el-icon>
            <div class="logic-content">
              <span class="logic-label">逻辑关系：</span>
              <span class="logic-text">{{ sentence.logic }}</span>
            </div>
          </div>

          <!-- 考研考点 -->
          <div v-if="sentence.examPoints" class="sentence-exam">
            <el-icon><Star /></el-icon>
            <div class="exam-content">
              <span class="exam-label">考研考点：</span>
              <div class="exam-points">
                <el-tag 
                  v-for="(point, pIdx) in sentence.examPoints" 
                  :key="pIdx"
                  type="warning"
                  size="default"
                  effect="dark"
                >
                  {{ point }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 文章整体分析 -->
      <div class="article-analysis">
        <div class="section-title">
          <el-icon><DataAnalysis /></el-icon>
          文章整体分析
        </div>

        <!-- 可折叠分析卡片 -->
        <el-collapse v-model="activeCollapse" class="analysis-collapse">
          <!-- 主题思想 -->
          <el-collapse-item name="theme" class="collapse-item">
            <template #title>
              <div class="collapse-title">
                <span class="title-icon">🎯</span>
                <span class="title-text">主题思想</span>
              </div>
            </template>
            <div class="collapse-content theme-content">
              <p>{{ articleTheme || '暂无数据' }}</p>
            </div>
          </el-collapse-item>

          <!-- 文章结构 -->
          <el-collapse-item name="structure" class="collapse-item">
            <template #title>
              <div class="collapse-title">
                <span class="title-icon">📐</span>
                <span class="title-text">文章结构</span>
              </div>
            </template>
            <div class="collapse-content structure-content">
              <pre>{{ articleStructure || '暂无数据' }}</pre>
            </div>
          </el-collapse-item>

          <!-- 写作手法 -->
          <el-collapse-item name="techniques" class="collapse-item">
            <template #title>
              <div class="collapse-title">
                <span class="title-icon">✍️</span>
                <span class="title-text">写作手法</span>
                <el-tag size="small" type="success" class="count-tag">{{ writingTechniques.length }}条</el-tag>
              </div>
            </template>
            <div class="collapse-content">
              <div class="technique-list">
                <div class="technique-item" v-for="(technique, tIdx) in writingTechniques" :key="tIdx">
                  <span class="technique-index">{{ tIdx + 1 }}</span>
                  <span class="technique-text">{{ technique }}</span>
                </div>
                <div v-if="writingTechniques.length === 0" class="empty-tip">暂无数据</div>
              </div>
            </div>
          </el-collapse-item>

          <!-- 阅读策略 -->
          <el-collapse-item name="strategies" class="collapse-item">
            <template #title>
              <div class="collapse-title">
                <span class="title-icon">💡</span>
                <span class="title-text">阅读策略建议</span>
                <el-tag size="small" type="warning" class="count-tag">{{ readingStrategies.length }}条</el-tag>
              </div>
            </template>
            <div class="collapse-content">
              <div class="strategy-list">
                <div class="strategy-item" v-for="(strategy, sIdx) in readingStrategies" :key="sIdx">
                  <span class="strategy-index">{{ sIdx + 1 }}</span>
                  <span class="strategy-text">{{ strategy }}</span>
                </div>
                <div v-if="readingStrategies.length === 0" class="empty-tip">暂无数据</div>
              </div>
            </div>
          </el-collapse-item>

          <!-- 核心词汇 -->
          <el-collapse-item name="vocabulary" class="collapse-item" v-if="keyVocabulary.length > 0">
            <template #title>
              <div class="collapse-title">
                <span class="title-icon">📚</span>
                <span class="title-text">核心词汇</span>
                <el-tag size="small" type="danger" class="count-tag">{{ keyVocabulary.length }}词</el-tag>
              </div>
            </template>
            <div class="collapse-content">
              <div class="vocab-grid-compact">
                <div class="vocab-card" v-for="(vocab, vIdx) in keyVocabulary" :key="vIdx">
                  <div class="vocab-header">
                    <span class="vocab-word">{{ vocab.word }}</span>
                    <span class="vocab-meaning">{{ vocab.meaning }}</span>
                  </div>
                  <div class="vocab-context">{{ vocab.context }}</div>
                </div>
              </div>
            </div>
          </el-collapse-item>

          <!-- 语法要点 -->
          <el-collapse-item name="grammar" class="collapse-item" v-if="grammarPoints.length > 0">
            <template #title>
              <div class="collapse-title">
                <span class="title-icon"></span>
                <span class="title-text">语法要点</span>
                <el-tag size="small" type="info" class="count-tag">{{ grammarPoints.length }}点</el-tag>
              </div>
            </template>
            <div class="collapse-content">
              <div class="grammar-grid">
                <div class="grammar-card" v-for="(point, gIdx) in grammarPoints" :key="gIdx">
                  <span class="grammar-icon">🔍</span>
                  <span class="grammar-text">{{ point }}</span>
                </div>
              </div>
            </div>
          </el-collapse-item>

          <!-- 考研技巧 -->
          <el-collapse-item name="tips" class="collapse-item" v-if="examTips.length > 0">
            <template #title>
              <div class="collapse-title">
                <span class="title-icon">🏆</span>
                <span class="title-text">考研技巧</span>
                <el-tag size="small" type="primary" class="count-tag">{{ examTips.length }}条</el-tag>
              </div>
            </template>
            <div class="collapse-content">
              <div class="tips-grid">
                <div class="tip-card" v-for="(tip, eIdx) in examTips" :key="eIdx">
                  <div class="tip-number">{{ eIdx + 1 }}</div>
                  <div class="tip-text">{{ tip }}</div>
                </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { buildApiUrl } from '@/utils/apiConfig'
import { 
  ArrowLeft, 
  Reading, 
  Document, 
  EditPen, 
  ChatDotRound, 
  Collection,
  Notebook,
  Operation,
  Share,
  Star,
  DataAnalysis
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 题型、年份和Text编号
const section = ref(route.query.section as string || 'Use of English')
const year = ref(parseInt(route.query.year as string) || 2005)
const textNum = ref(route.query.text ? parseInt(route.query.text as string) : null)

// 页面标题
const pageTitle = computed(() => {
  if (section.value === 'Traditional Reading') {
    return textNum.value 
      ? `${year.value}年考研英语一 · 传统阅读 Text ${textNum.value} 精读`
      : `${year.value}年考研英语一 · 传统阅读精读`
  }
  const sectionName = section.value === 'Use of English' ? '完型填空' : '新题型'
  return `${year.value}年考研英语一 · ${sectionName}精读`
})

// 关键词高亮（不再使用，保留以防万一）
const highlightKeywords = (text: string) => {
  return text
}

// 文章内容（根据URL参数动态加载）
const articleContent = ref('')

// 逐句解析数据（暂时为空，需要根据实际文章从后端加载）
const sentenceList = ref<any[]>([])

// 文章主题（暂时为空，需要从后端加载）
const articleTheme = ref('')

// 文章结构（暂时为空，需要从后端加载）
const articleStructure = ref('')

// 写作手法（暂时为空，需要从后端加载）
const writingTechniques = ref<any[]>([])

// 阅读策略（暂时为空，需要从后端加载）
const readingStrategies = ref<any[]>([])

// 核心词汇
const keyVocabulary = ref<any[]>([])

// 语法要点
const grammarPoints = ref<any[]>([])

// 考研技巧
const examTips = ref<any[]>([])

// 折叠面板激活项（默认展开主题思想和文章结构）
const activeCollapse = ref(['theme', 'structure'])

// 返回
const goBack = () => {
  router.back()
}

// 加载精读分析数据
const loadIntensiveReadingData = async (actualTextNum: number | null = null) => {
  try {
    // 构建数据key
    let dataKey = `${year.value}-${section.value}`
    if (section.value === 'Traditional Reading') {
      const textNumToUse = actualTextNum !== null ? actualTextNum : textNum.value
      if (textNumToUse) {
        dataKey += `-${textNumToUse}`
      }
    }
    
    console.log('加载精读数据, key:', dataKey)
    
    const response = await fetch(`http://localhost:6902/api/intensive-reading?key=${encodeURIComponent(dataKey)}`)
    if (response.ok) {
      const data = await response.json()
      
      if (data.intensiveReading) {
        const reading = data.intensiveReading
        articleTheme.value = reading.theme || ''
        articleStructure.value = reading.structure || ''
        writingTechniques.value = reading.writingTechniques || []
        readingStrategies.value = reading.readingStrategies || []
        keyVocabulary.value = reading.keyVocabulary || []
        grammarPoints.value = reading.grammarPoints || []
        examTips.value = reading.examTips || []
        
        console.log('✅ 精读数据加载成功')
      } else {
        console.log('⚠️ 精读数据不存在')
      }
    } else {
      console.log('⚠️ 精读数据API返回错误:', response.status)
    }
  } catch (error) {
    console.error(' 加载精读数据失败:', error)
  }
}

// 加载数据
onMounted(async () => {
  console.log(`✅ 精读页面加载完成：${section.value} - ${year.value}年`, textNum.value ? `Text ${textNum.value}` : '')
  console.log('URL参数:', route.query)
  
  // 从 API加载文章数据
  try {
    const response = await fetch(buildApiUrl('/api/reading-questions'))
    if (response.ok) {
      const data = await response.json()
      const questions = data.questions || []
      
      console.log('总题目数:', questions.length)
      
      // 根据题型、年份和Text编号查找文章
      let article = ''
      if (section.value === 'Traditional Reading') {
        if (textNum.value) {
          // 传统阅读：查找特定Text的文章
          console.log('查找条件: Traditional Reading, year:', year.value, ', textNum:', textNum.value)
          const targetQuestion = questions.find((q: any) => 
            q.section === 'Traditional Reading' && 
            q.year === year.value && 
            q.textNumber === textNum.value &&
            q.article
          )
          if (targetQuestion) {
            article = targetQuestion.article
            console.log('✅ 找到传统阅读文章, length:', article.length)
          } else {
            console.log('❌ 未找到匹配的传统阅读文章')
          }
        } else {
          // 没有指定Text,查找该年份任意一个有文章的传统阅读题目
          console.log('未指定Text,查找该年份任意传统阅读文章')
          const targetQuestion = questions.find((q: any) => 
            q.section === 'Traditional Reading' && 
            q.year === year.value &&
            q.article
          )
          if (targetQuestion) {
            article = targetQuestion.article
            console.log('✅ 找到传统阅读文章, textNumber:', targetQuestion.textNumber, ', length:', article.length)
          } else {
            console.log('❌ 未找到匹配的传统阅读文章')
          }
        }
      } else if (section.value === 'Use of English') {
        // 完型填空：查找该年份的文章
        console.log('查找条件: Use of English, year:', year.value)
        const targetQuestion = questions.find((q: any) => 
          q.section === 'Use of English' && 
          q.year === year.value &&
          q.article
        )
        if (targetQuestion) {
          article = targetQuestion.article
          console.log('✅ 找到完型填空文章, length:', article.length)
        } else {
          console.log('❌ 未找到匹配的完型填空文章')
        }
      } else {
        console.log('⚠️ 未提供text参数或题型不匹配')
      }
      
      if (article) {
        // 添加内联样式确保缩进生效
        let styledArticle = article.replace(/<p>/g, '<p style="text-indent: 2em; margin: 0.8em 0;">')
        
        // 只对完形填空添加空格样式，传统阅读的<u>是强调标记
        if (section.value === 'Use of English') {
          styledArticle = styledArticle.replace(/<u>/g, '<u style="display: inline-block; min-width: 2.5em; text-align: center; color: #e74c3c; font-weight: bold; text-decoration: none; border-bottom: 2px solid #e74c3c; margin: 0 0.1em; padding: 0 0.2em;">')
        }
        
        articleContent.value = styledArticle
        console.log('✅ 文章加载成功')
        
        // 加载精读分析数据，传递实际找到的文章信息
        const actualTextNum = section.value === 'Traditional Reading' && !textNum.value 
          ? (questions.find((q: any) => q.section === 'Traditional Reading' && q.year === year.value && q.article)?.textNumber || null)
          : textNum.value
        loadIntensiveReadingData(actualTextNum)
      } else {
        articleContent.value = '<p style="color: #999; text-align: center; padding: 40px;">暂无文章数据,请在题目数据中添加article字段</p>'
        console.log('⚠️ 未找到文章数据')
      }
    }
  } catch (error) {
    console.error('❌ 加载文章失败:', error)
    articleContent.value = '<p style="color: #f56c6c; text-align: center; padding: 40px;">加载失败,请检查后端服务是否启动</p>'
  }
  
  // TODO: 后续可以从后端API加载更详细的精读数据
  // try {
  //   const response = await fetch(`http://localhost:3001/api/intensive-reading?section=${section.value}&year=${year.value}`)
  //   const data = await response.json()
  //   if (data.article) { ... }
  // } catch (error) { ... }
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
  text-align: left;
  margin-bottom: 36px;
  padding: 34px 38px 28px;
  background: linear-gradient(150deg, #0d2137 0%, #16345c 60%, #1e4576 100%);
  border-radius: 14px;
  color: white;
  position: relative;
  overflow: hidden;
}

.reading-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
  background-size: 44px 44px;
  pointer-events: none;
}

.reading-header::after {
  content: '';
  position: absolute;
  top: -70%;
  right: -8%;
  width: 360px;
  height: 360px;
  background: radial-gradient(circle, rgba(255,197,61,0.13) 0%, transparent 70%);
  pointer-events: none;
}

.reading-title {
  font-size: 1.9em;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
  font-weight: 800;
}

.title-icon {
  font-size: 1.2em;
}

.reading-subtitle {
  font-size: 0.95rem;
  color: #a8bdd4;
  margin: 0;
  position: relative;
  z-index: 1;
  letter-spacing: 0.06em;
}

.article-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.section-title {
  font-size: 1.5em;
  font-weight: bold;
  color: #16345c;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 3px solid #ffc53d;
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

/* 段落缩进 - 使用深度选择器 */
.article-content :deep(p) {
  text-indent: 2em;
  margin: 0.8em 0;
}

/* 完形填空空格样式 - 使用深度选择器 */
.use-of-english .article-content :deep(u) {
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

.sentence-analysis {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.sentence-card {
  background: #f8f9fa;
  border-left: 4px solid #ffc53d;
  padding: 25px;
  margin-bottom: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.sentence-original {
  margin-bottom: 18px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.sentence-number {
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1em;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(13, 33, 55, 0.3);
}

.sentence-text {
  font-size: 1.1em;
  line-height: 1.9;
  color: #2c3e50;
  flex: 1;
  font-weight: 500;
}

.sentence-translation {
  background: linear-gradient(135deg, #eef3fa 0%, #dbe7f5 100%);
  padding: 16px 18px;
  border-radius: 8px;
  margin-bottom: 15px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-left: 3px solid #ffc53d;
}

.translation-content {
  flex: 1;
}

.translation-label {
  font-weight: 600;
  color: #16345c;
  white-space: nowrap;
  display: block;
  margin-bottom: 6px;
  font-size: 0.95em;
}

.translation-text {
  color: #2c3e50;
  line-height: 1.9;
  font-size: 1.05em;
}

.sentence-vocabulary {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  padding: 16px 18px;
  border-radius: 8px;
  margin-bottom: 15px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-left: 3px solid #ff9800;
}

.vocabulary-content {
  flex: 1;
}

.vocab-label {
  font-weight: 600;
  color: #f57c00;
  white-space: nowrap;
  display: block;
  margin-bottom: 10px;
  font-size: 0.95em;
}

.vocab-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.vocab-tag {
  flex-shrink: 0;
  padding: 8px 12px;
  font-size: 0.9em;
  display: flex;
  align-items: center;
  gap: 6px;
}

.vocab-meaning {
  color: #666;
  font-size: 0.95em;
}

.vocab-usage {
  color: #999;
  font-size: 0.85em;
  font-style: italic;
  margin-left: 4px;
}

.sentence-grammar {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  padding: 16px 18px;
  border-radius: 8px;
  margin-bottom: 15px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-left: 3px solid #9c27b0;
}

.grammar-content {
  flex: 1;
}

.grammar-label {
  font-weight: 600;
  color: #7b1fa2;
  white-space: nowrap;
  display: block;
  margin-bottom: 6px;
  font-size: 0.95em;
}

.grammar-text {
  color: #2c3e50;
  line-height: 1.9;
  font-size: 1em;
}

.sentence-structure {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  padding: 16px 18px;
  border-radius: 8px;
  margin-bottom: 15px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-left: 3px solid #4caf50;
}

.structure-content {
  flex: 1;
}

.structure-label {
  font-weight: 600;
  color: #388e3c;
  white-space: nowrap;
  display: block;
  margin-bottom: 6px;
  font-size: 0.95em;
}

.structure-text {
  font-family: 'Courier New', monospace;
  font-size: 0.95em;
  line-height: 1.9;
  color: #2c3e50;
  margin: 0;
  white-space: pre-wrap;
  background: rgba(255, 255, 255, 0.6);
  padding: 12px;
  border-radius: 6px;
}

.sentence-logic {
  background: linear-gradient(135deg, #fff9c4 0%, #fff59d 100%);
  padding: 16px 18px;
  border-radius: 8px;
  margin-bottom: 15px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-left: 3px solid #fbc02d;
}

.logic-content {
  flex: 1;
}

.logic-label {
  font-weight: 600;
  color: #f9a825;
  white-space: nowrap;
  display: block;
  margin-bottom: 6px;
  font-size: 0.95em;
}

.logic-text {
  color: #2c3e50;
  line-height: 1.9;
  font-size: 1em;
}

.sentence-exam {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  padding: 16px 18px;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-left: 3px solid #f44336;
}

.exam-content {
  flex: 1;
}

.exam-label {
  font-weight: 600;
  color: #e53935;
  white-space: nowrap;
  display: block;
  margin-bottom: 10px;
  font-size: 0.95em;
}

.exam-points {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* 文章整体分析 */
.article-analysis {
  background: white;
  padding: 35px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.analysis-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 25px;
}

.analysis-card {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 10px;
  border-left: 4px solid #ffc53d;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* 折叠面板样式 */
.analysis-collapse {
  margin-top: 20px;
  border: none;
  background: transparent;
}

.analysis-collapse :deep(.el-collapse-item) {
  margin-bottom: 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.analysis-collapse :deep(.el-collapse-item:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.analysis-collapse :deep(.el-collapse-item__header) {
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  color: white;
  font-size: 1.1em;
  font-weight: 600;
  padding: 16px 20px;
  border: none;
  height: auto;
  line-height: 1.5;
}

.analysis-collapse :deep(.el-collapse-item__arrow) {
  color: white;
  font-size: 1.2em;
}

.collapse-title {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.title-icon {
  font-size: 1.4em;
}

.title-text {
  flex: 1;
}

.count-tag {
  background: rgba(255, 255, 255, 0.3) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  color: white !important;
  font-weight: 600;
}

.collapse-content {
  padding: 20px;
  background: white;
}

.theme-content p {
  line-height: 2;
  font-size: 1.15em;
  color: #2c3e50;
  text-align: justify;
}

.structure-content pre {
  font-family: 'Courier New', monospace;
  font-size: 1.05em;
  line-height: 2;
  color: #2c3e50;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  white-space: pre-wrap;
  margin: 0;
}

/* 写作手法列表 */
.technique-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.technique-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-radius: 8px;
  font-size: 1em;
  line-height: 1.6;
}

.technique-index {
  background: white;
  color: #f5576c;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

/* 阅读策略列表 */
.strategy-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.strategy-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
  border-radius: 8px;
  font-size: 1em;
  line-height: 1.6;
}

.strategy-index {
  background: white;
  color: #fa709a;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

/* 核心词汇网格（紧凑版） */
.vocab-grid-compact {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.vocab-card {
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  color: white;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(13, 33, 55, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
}

.vocab-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(13, 33, 55, 0.3);
}

.vocab-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
  gap: 8px;
}

.vocab-word {
  font-size: 1.15em;
  font-weight: bold;
  flex-shrink: 0;
}

.vocab-meaning {
  font-size: 0.95em;
  opacity: 0.95;
  text-align: right;
}

.vocab-context {
  font-size: 0.9em;
  opacity: 0.9;
  line-height: 1.5;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

/* 语法要点网格 */
.grammar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 14px;
}

.grammar-card {
  display: flex;
  gap: 12px;
  padding: 14px 18px;
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  border-radius: 10px;
  font-size: 1em;
  line-height: 1.7;
  color: #2c3e50;
  box-shadow: 0 3px 10px rgba(252, 182, 159, 0.2);
  transition: transform 0.3s;
}

.grammar-card:hover {
  transform: translateX(4px);
}

.grammar-icon {
  font-size: 1.3em;
  flex-shrink: 0;
}

.grammar-text {
  flex: 1;
}

/* 考研技巧网格 */
.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.tip-card {
  display: flex;
  gap: 14px;
  padding: 16px;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(168, 237, 234, 0.2);
  transition: transform 0.3s;
}

.tip-card:hover {
  transform: scale(1.02);
}

.tip-number {
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1em;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(13, 33, 55, 0.3);
}

.tip-text {
  flex: 1;
  line-height: 1.7;
  color: #2c3e50;
  font-size: 1em;
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 20px;
  font-style: italic;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .intensive-reading {
    padding: 15px;
  }

  .article-section,
  .sentence-analysis,
  .article-analysis {
    padding: 20px;
  }

  .vocab-grid-compact,
  .grammar-grid,
  .tips-grid {
    grid-template-columns: 1fr;
  }

  .sentence-original {
    flex-direction: column;
    gap: 8px;
  }

  .sentence-number {
    align-self: flex-start;
  }
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
  color: #16345c;
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
  color: #16345c;
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

<style>
/* 全局样式 - 用于v-html渲染的内容 */
.intensive-reading .article-content p {
  text-indent: 2em !important;
  margin: 0.8em 0 !important;
}

/* 只对完形填空应用空格样式 */
.intensive-reading.use-of-english .article-content u {
  display: inline-block !important;
  min-width: 2.5em !important;
  text-align: center !important;
  color: #e74c3c !important;
  font-weight: bold !important;
  text-decoration: none !important;
  border-bottom: 2px solid #e74c3c !important;
  margin: 0 0.1em !important;
  padding: 0 0.2em !important;
}
</style>
