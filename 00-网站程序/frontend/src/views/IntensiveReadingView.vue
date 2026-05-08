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
      <p class="reading-subtitle">逐句精读 · 深度解析 · 全面提升阅读能力</p>
    </div>

    <!-- 文章原文 -->
    <div class="article-container">
      <div class="article-section">
        <div class="section-title">
          <el-icon><Document /></el-icon>
          文章原文（带空格标记）
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
          <!-- 句号和英文原句 -->
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
              <span class="translation-label"> 精准翻译：</span>
              <span class="translation-text">{{ sentence.chinese }}</span>
            </div>
          </div>

          <!-- 重点词汇 -->
          <div v-if="sentence.vocabulary && sentence.vocabulary.length > 0" class="sentence-vocabulary">
            <el-icon><Collection /></el-icon>
            <div class="vocabulary-content">
              <span class="vocab-label"> 核心词汇：</span>
              <div class="vocab-list">
                <el-tag 
                  v-for="(word, wIdx) in sentence.vocabulary" 
                  :key="wIdx"
                  type="info"
                  size="large"
                  effect="plain"
                  class="vocab-tag"
                >
                  <div class="vocab-item">
                    <strong>{{ word.word }}</strong>
                    <span class="vocab-meaning">{{ word.meaning }}</span>
                    <span v-if="word.usage" class="vocab-usage">{{ word.usage }}</span>
                  </div>
                </el-tag>
              </div>
            </div>
          </div>

          <!-- 语法分析 -->
          <div v-if="sentence.grammar" class="sentence-grammar">
            <el-icon><Notebook /></el-icon>
            <div class="grammar-content">
              <span class="grammar-label"> 语法结构：</span>
              <div class="grammar-text" v-html="sentence.grammar"></div>
            </div>
          </div>

          <!-- 长难句拆解 -->
          <div v-if="sentence.structure" class="sentence-structure">
            <el-icon><Operation /></el-icon>
            <div class="structure-content">
              <span class="structure-label"> 结构拆解：</span>
              <pre class="structure-text">{{ sentence.structure }}</pre>
            </div>
          </div>

          <!-- 逻辑关系 -->
          <div v-if="sentence.logic" class="sentence-logic">
            <el-icon><Share /></el-icon>
            <div class="logic-content">
              <span class="logic-label"> 逻辑关系：</span>
              <span class="logic-text">{{ sentence.logic }}</span>
            </div>
          </div>

          <!-- 考研考点 -->
          <div v-if="sentence.examPoints" class="sentence-exam">
            <el-icon><Star /></el-icon>
            <div class="exam-content">
              <span class="exam-label"> 考研考点：</span>
              <div class="exam-points">
                <el-tag 
                  v-for="(point, pIdx) in sentence.examPoints" 
                  :key="pIdx"
                  type="warning"
                  size="large"
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

        <div class="analysis-cards">
          <!-- 主题思想 -->
          <div class="analysis-card theme-card">
            <h4> 主题思想</h4>
            <p>{{ articleTheme }}</p>
          </div>

          <!-- 文章结构 -->
          <div class="analysis-card structure-card">
            <h4> 文章结构</h4>
            <pre>{{ articleStructure }}</pre>
          </div>

          <!-- 写作手法 -->
          <div class="analysis-card technique-card">
            <h4> 写作手法</h4>
            <ul>
              <li v-for="(technique, tIdx) in writingTechniques" :key="tIdx">
                {{ technique }}
              </li>
            </ul>
          </div>

          <!-- 阅读策略 -->
          <div class="analysis-card strategy-card">
            <h4> 阅读策略建议</h4>
            <ul>
              <li v-for="(strategy, sIdx) in readingStrategies" :key="sIdx">
                {{ strategy }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 翻译训练 -->
      <div class="translation-training">
        <div class="section-title">
          <el-icon><Switch /></el-icon>
          翻译训练（自我检测）
        </div>

        <div class="training-tip">
          <el-icon><InfoFilled /></el-icon>
          <span>建议：先自己翻译下面的句子，再对照上方的精准翻译，找出差距</span>
        </div>

        <div 
          v-for="(training, idx) in translationTrainings" 
          :key="idx"
          class="training-item"
        >
          <div class="training-sentence">
            <span class="training-number">{{ idx + 1 }}</span>
            <span class="training-text">{{ training.sentence }}</span>
          </div>
          <el-collapse>
            <el-collapse-item title="点击查看答案">
              <div class="training-answer">
                <strong>参考翻译：</strong>{{ training.translation }}
              </div>
              <div class="training-keywords">
                <strong>关键词：</strong>
                <el-tag v-for="(kw, kIdx) in training.keywords" :key="kIdx" size="small">
                  {{ kw }}
                </el-tag>
              </div>
            </el-collapse-item>
          </el-collapse>
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
  Share,
  Star,
  DataAnalysis,
  Switch,
  InfoFilled
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

// 关键词高亮（不再使用，保留以防万一）
const highlightKeywords = (text: string) => {
  return text
}

// 文章内容（完整原文，不带空格标记）
const articleContent = ref(`<p style="line-height: 2.2; text-align: justify; font-size: 1.15em; color: #333;">
  Humans are often thought to be insensitive smellers compared with animals, but this is largely because, unlike animals, we stand upright. This means that our noses are limited to perceiving those smells which float through the air, rather than the majority of smells which stick to surfaces. In fact, though, we are extremely sensitive to smells, even if we do not generally realize it.
</p>`)

// 逐句解析数据（增强版）
const sentenceList = ref([
  {
    english: 'Humans are often thought to be insensitive smellers compared with animals, but this is largely because, unlike animals, we stand upright.',
    chinese: '与动物相比，人类通常被认为是嗅觉不敏感的，但这主要是因为，与动物不同，我们是直立行走的。',
    vocabulary: [
      { word: 'insensitive', meaning: '不敏感的', usage: 'in-（否定前缀）+ sensitive（敏感的）' },
      { word: 'compared with', meaning: '与...相比', usage: '固定搭配' },
      { word: 'largely', meaning: '主要地', usage: 'largely because = 主要是因为' },
      { word: 'unlike', meaning: '与...不同', usage: '介词，表对比' }
    ],
    grammar: '主句 + 原因状语从句，<strong>compared with animals</strong> 是过去分词短语作状语，表比较',
    structure: `主句: Humans are often thought to be insensitive smellers
  |
  +-- 状语: compared with animals（与动物相比）
  |
  +-- 原因状语从句: but this is largely because...
      |
      +-- 插入语: unlike animals（与动物不同）
      |
      +-- 从句内容: we stand upright（我们直立行走）`,
    logic: '对比关系：人类 vs 动物（compared with / unlike）',
    examPoints: ['比较结构', '原因状语从句', '过去分词作状语', '插入语']
  },
  {
    english: 'This means that our noses are limited to perceiving those smells which float through the air, rather than the majority of smells which stick to surfaces.',
    chinese: '这意味着我们的鼻子仅限于感知那些在空气中漂浮的气味，而不是大部分附着在表面的气味。',
    vocabulary: [
      { word: 'be limited to', meaning: '仅限于', usage: 'to是介词，后接动名词' },
      { word: 'perceive', meaning: '感知，察觉', usage: 'perceive sth = 感知某物' },
      { word: 'float through', meaning: '漂浮通过', usage: 'float through the air' },
      { word: 'rather than', meaning: '而不是', usage: '表对比/选择' },
      { word: 'stick to', meaning: '附着在...上', usage: 'stick to surfaces' }
    ],
    grammar: '宾语从句 + 两个定语从句，<strong>which</strong>引导的定语从句分别修饰smells，<strong>rather than</strong>表对比',
    structure: `主句: This means that...
  |
  +-- 宾语从句: our noses are limited to perceiving those smells
      |
      +-- 定语从句1: which float through the air（修饰第一个smells）
      |
      +-- 对比结构: rather than（而不是）
      |
      +-- 定语从句2: which stick to surfaces（修饰第二个smells）`,
    logic: '对比关系：空气中的气味 vs 表面的气味（rather than）',
    examPoints: ['宾语从句', '定语从句', 'rather than用法', '动词不定式']
  },
  {
    english: 'In fact, though, we are extremely sensitive to smells, even if we do not generally realize it.',
    chinese: '事实上，我们对气味极其敏感，即使我们通常没有意识到这一点。',
    vocabulary: [
      { word: 'in fact', meaning: '事实上', usage: '转折信号词' },
      { word: 'though', meaning: '然而', usage: '副词，放在句中表转折' },
      { word: 'extremely', meaning: '极其地', usage: 'extremely sensitive = 极其敏感' },
      { word: 'even if', meaning: '即使', usage: '引导让步状语从句' },
      { word: 'realize', meaning: '意识到', usage: 'realize it = 意识到这一点' }
    ],
    grammar: '让步状语从句，<strong>In fact</strong>和<strong>though</strong>双重转折，<strong>even if</strong>引导让步状语',
    structure: `转折句: In fact, though, we are extremely sensitive to smells
  |
  +-- 双重转折信号: In fact + though（强调转折）
  |
  +-- 让步状语从句: even if we do not generally realize it
      |
      +-- 让步关系: 虽然没意识到，但确实敏感`,
    logic: '转折关系：In fact 引出与上文相反的观点',
    examPoints: ['让步状语从句', '转折信号词', 'even if用法', '副词though']
  }
])

// 文章主题
const articleTheme = ref('本文讨论了人类嗅觉的真实能力，反驳了"人类嗅觉不敏感"的传统观点。文章指出人类嗅觉之所以显得不敏感，主要是因为人类直立行走，鼻子只能感知空气中漂浮的气味，而无法感知附着在表面的气味。实际上，人类的嗅觉非常敏感，只是我们通常没有意识到这一点。')

// 文章结构
const articleStructure = ref(`第一段（引出话题）：
  ├─ 传统观点：人类嗅觉不敏感
  └─ 原因分析：直立行走导致鼻子功能受限

第二段（转折论证）：
  ├─ 事实反驳：人类其实极其敏感
  ├─ 证据支撑：嗅觉细胞数量、灵敏度数据
  └─ 让步说明：虽然我们没有意识到

第三段（深入解释）：
  ├─ 个体差异：有些人对某些气味不敏感
  └─ 科学原因：基因差异导致受体数量不同

第四段（进一步论证）：
  ├─ 大脑调节机制：不会让所有受体同时工作
  ├─ 适应性：产生新受体的能力
  └─ 总结：人类嗅觉系统高度发达`)

// 写作手法
const writingTechniques = ref([
  '对比论证（compared with）：人类 vs 动物的嗅觉能力',
  '转折论证（In fact）：先提出错误观点，再用事实反驳',
  '让步论证（although/though）：承认一个事实，引出更重要的观点',
  '数据支撑：引用科学研究和实验结果增强说服力',
  '因果分析：解释为什么人类嗅觉看似不敏感的原因',
  '举例说明：用具体例子说明抽象概念'
])

// 阅读策略
const readingStrategies = ref([
  '关注转折词：but, however, in fact, actually 等往往引出作者真实观点',
  '识别让步结构：although/though 引导的句子是次要信息，主句才是重点',
  '注意对比信号：compared with, in contrast, on the other hand 提示比较关系',
  '抓住主题句：段落首句通常是主题句，概括本段核心内容',
  '理解长难句：先找主干（主谓宾），再分析修饰成分',
  '注意指代关系：it, this, that 等代词指代的内容往往在前文'
])

// 翻译训练
const translationTrainings = ref([
  {
    sentence: 'Humans are often thought to be insensitive smellers compared with animals.',
    translation: '与动物相比，人类通常被认为是嗅觉不敏感的。',
    keywords: ['compared with', 'insensitive', 'smellers']
  },
  {
    sentence: 'This means that our noses are limited to perceiving those smells which float through the air.',
    translation: '这意味着我们的鼻子仅限于感知那些在空气中漂浮的气味。',
    keywords: ['be limited to', 'perceive', 'float through']
  },
  {
    sentence: 'In fact, we are extremely sensitive to smells, although we do not generally realize it.',
    translation: '事实上，我们对气味极其敏感，尽管我们通常没有意识到这一点。',
    keywords: ['in fact', 'extremely sensitive', 'although', 'realize']
  }
])

// 返回
const goBack = () => {
  router.back()
}

// 加载数据
onMounted(async () => {
  console.log(`✅ 精读页面加载完成：${section.value} - ${year.value}年`)
  
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
  flex: 1;
}

.sentence-translation {
  background: #e3f2fd;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.translation-content {
  flex: 1;
}

.translation-label {
  font-weight: bold;
  color: #1976d2;
  white-space: nowrap;
  display: block;
  margin-bottom: 5px;
}

.translation-text {
  color: #333;
  line-height: 1.8;
  font-size: 1.05em;
}

.sentence-vocabulary {
  background: #fff3e0;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.vocabulary-content {
  flex: 1;
}

.vocab-label {
  font-weight: bold;
  color: #f57c00;
  white-space: nowrap;
  display: block;
  margin-bottom: 8px;
}

.vocab-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.vocab-tag {
  flex-shrink: 0;
}

.vocab-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.vocab-meaning {
  color: #666;
  font-size: 0.9em;
}

.vocab-usage {
  color: #999;
  font-size: 0.85em;
  font-style: italic;
}

.sentence-grammar {
  background: #f3e5f5;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.grammar-content {
  flex: 1;
}

.grammar-label {
  font-weight: bold;
  color: #7b1fa2;
  white-space: nowrap;
  display: block;
  margin-bottom: 5px;
}

.grammar-text {
  color: #333;
  line-height: 1.8;
}

.sentence-structure {
  background: #e8f5e9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.structure-content {
  flex: 1;
}

.structure-label {
  font-weight: bold;
  color: #388e3c;
  white-space: nowrap;
  display: block;
  margin-bottom: 5px;
}

.structure-text {
  font-family: 'Courier New', monospace;
  font-size: 0.95em;
  line-height: 1.8;
  color: #333;
  margin: 0;
  white-space: pre-wrap;
  background: rgba(255, 255, 255, 0.5);
  padding: 10px;
  border-radius: 6px;
}

.sentence-logic {
  background: #fff9c4;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.logic-content {
  flex: 1;
}

.logic-label {
  font-weight: bold;
  color: #f9a825;
  white-space: nowrap;
}

.logic-text {
  color: #333;
  line-height: 1.6;
}

.sentence-exam {
  background: #ffebee;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.exam-content {
  flex: 1;
}

.exam-label {
  font-weight: bold;
  color: #e53935;
  white-space: nowrap;
  display: block;
  margin-bottom: 8px;
}

.exam-points {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 文章整体分析 */
.article-analysis {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.analysis-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.analysis-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid #667eea;
}

.analysis-card h4 {
  color: #667eea;
  margin: 0 0 12px 0;
  font-size: 1.1em;
}

.analysis-card p,
.analysis-card pre,
.analysis-card ul {
  margin: 0;
  line-height: 1.8;
  color: #555;
}

.analysis-card pre {
  font-family: 'Courier New', monospace;
  font-size: 0.95em;
  white-space: pre-wrap;
  background: rgba(255, 255, 255, 0.5);
  padding: 10px;
  border-radius: 6px;
}

.analysis-card ul {
  padding-left: 20px;
}

.analysis-card li {
  margin-bottom: 8px;
  line-height: 1.6;
}

/* 翻译训练 */
.translation-training {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.training-tip {
  background: #e3f2fd;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1976d2;
  font-size: 0.95em;
}

.training-item {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 15px;
  border: 2px solid #e0e0e0;
}

.training-sentence {
  display: flex;
  gap: 12px;
  margin-bottom: 15px;
}

.training-number {
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

.training-text {
  font-size: 1.05em;
  line-height: 1.8;
  color: #333;
  flex: 1;
}

.training-answer {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  line-height: 1.8;
}

.training-keywords {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.training-keywords strong {
  color: #667eea;
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
