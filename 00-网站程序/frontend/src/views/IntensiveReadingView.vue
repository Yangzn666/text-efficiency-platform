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
  DataAnalysis
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

// 文章内容（完整原文 - 根据20道完型填空题还原）
const articleContent = ref(`<p style="line-height: 2.2; text-align: justify; font-size: 1.15em; color: #333;">
  Humans are often thought to be insensitive smellers compared with animals, but this is largely because, unlike animals, we stand upright. This means that our noses are limited to perceiving those smells which float through the air, missing the majority of smells which stick to surfaces. In fact, though, we are extremely sensitive to smells, even if we do not generally realize it. Our noses are capable of detecting human smells even when these are diluted to far below one part in one million. Strangely, some people find that they can smell one type of flower but not another, whereas others are sensitive to the smells of both flowers. This may be because some people do not have the genes necessary to generate particular smell receptors in the nose. These receptors are the cells which sense smells and send messages to the brain. However, it has been found that even people insensitive to a certain smell at first can suddenly become sensitive to it when exposed to it often enough. The explanation for insensitivity to smell seems to be that the brain finds it inefficient to keep all smell receptors working all the time but can create new receptors if necessary. This may also explain why we are not usually sensitive to our own smells—we are not aware of the usual smell of our own house—but we notice new smells when we visit someone else's. The brain finds it best to keep smell receptors available for unfamiliar and emergency signals such as the smell of smoke, which might indicate the danger of fire.
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
    english: 'This means that our noses are limited to perceiving those smells which float through the air, missing the majority of smells which stick to surfaces.',
    chinese: '这意味着我们的鼻子仅限于感知那些在空气中漂浮的气味，错过了大部分附着在表面的气味。',
    vocabulary: [
      { word: 'be limited to', meaning: '仅限于', usage: 'to是介词，后接动名词' },
      { word: 'perceive', meaning: '感知，察觉', usage: 'perceive sth = 感知某物' },
      { word: 'float through', meaning: '漂浮通过', usage: 'float through the air' },
      { word: 'missing', meaning: '错过，漏掉', usage: 'miss的现在分词' },
      { word: 'stick to', meaning: '附着在...上', usage: 'stick to surfaces' }
    ],
    grammar: '宾语从句 + 两个定语从句，<strong>which</strong>引导的定语从句分别修饰smells',
    structure: `主句: This means that...
  |
  +-- 宾语从句: our noses are limited to perceiving those smells
      |
      +-- 定语从句1: which float through the air（修饰第一个smells）
      |
      +-- 现在分词: missing the majority of smells（伴随状语）
          |
          +-- 定语从句2: which stick to surfaces（修饰第二个smells）`,
    logic: '因果关系：站立 → 鼻子功能受限 → 错过表面气味',
    examPoints: ['宾语从句', '定语从句', '现在分词作状语', 'be limited to']
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
  },
  {
    english: 'Our noses are capable of detecting human smells even when these are diluted to far below one part in one million.',
    chinese: '我们的鼻子能够察觉到人类的气味，即使这些气味被稀释到远低于百万分之一。',
    vocabulary: [
      { word: 'be capable of', meaning: '有能力做', usage: '后接动名词' },
      { word: 'detect', meaning: '探测，察觉', usage: 'detect sth = 察觉某物' },
      { word: 'diluted', meaning: '稀释的', usage: 'dilute的过去分词' },
      { word: 'one part in one million', meaning: '百万分之一', usage: '比例表达' }
    ],
    grammar: '让步状语从句，<strong>even when</strong>引导让步，<strong>these</strong>指代smells',
    structure: `主句: Our noses are capable of detecting human smells
  |
  +-- 让步状语从句: even when these are diluted to far below one part in one million
      |
      +-- 被动语态: are diluted（被稀释）
      |
      +-- 程度副词: far below（远低于）`,
    logic: '让步关系：即使气味极淡，也能察觉',
    examPoints: ['be capable of', '让步状语从句', '被动语态', '比例表达']
  },
  {
    english: 'Strangely, some people find that they can smell one type of flower but not another, whereas others are sensitive to the smells of both flowers.',
    chinese: '奇怪的是，有些人发现他们只能闻到一种花的气味，而另一些人对两种花都敏感。',
    vocabulary: [
      { word: 'strangely', meaning: '奇怪的是', usage: '副词，引出令人惊讶的事实' },
      { word: 'whereas', meaning: '然而，但是', usage: '表对比，连接两个并列句' }
    ],
    grammar: '宾语从句 + 对比结构，<strong>whereas</strong>连接两个对比的句子',
    structure: `主句: some people find that...
  |
  +-- 宾语从句1: they can smell one type of flower but not another
  |
  +-- 对比连词: whereas（然而）
  |
  +-- 对比句2: others are sensitive to the smells of both flowers`,
    logic: '对比关系：some people vs others（whereas）',
    examPoints: ['whereas用法', '宾语从句', '对比结构']
  },
  {
    english: 'This may be because some people do not have the genes necessary to generate particular smell receptors in the nose.',
    chinese: '这可能是因为有些人缺乏在鼻腔中产生特定气味感受器所需的基因。',
    vocabulary: [
      { word: 'gene', meaning: '基因', usage: 'have the genes for 有...的基因' },
      { word: 'generate', meaning: '产生，生成', usage: 'generate electricity 发电' },
      { word: 'particular', meaning: '特定的，特别的', usage: 'a particular type 某种特定类型' },
      { word: 'receptor', meaning: '感受器，受体', usage: 'smell receptors 嗅觉感受器' }
    ],
    grammar: '<strong>主句：</strong>This may be because...<br><strong>表语从句：</strong>some people do not have the genes...<br><strong>后置定语：</strong>necessary to generate...（修饰genes）',
    structure: `主句: This(主语) + may be(系动词) + because从句(表语)
    ↓
表语从句: some people(主语) + do not have(谓语) + the genes(宾语)
    ↓
后置定语: necessary(形容词) + to generate particular smell receptors(不定式) + in the nose(地点状语)`,
    logic: '因果解释：解释前一句提到的个体差异的原因',
    examPoints: ['This is because... 这是因为...', 'necessary to do sth', '后置定语形容词短语', 'particular 特定的']
  },
  {
    english: 'These receptors are the cells which sense smells and send messages to the brain.',
    chinese: '这些感受器是感知气味并向大脑发送信息的细胞。',
    vocabulary: [
      { word: 'cell', meaning: '细胞', usage: 'nerve cells 神经细胞' },
      { word: 'message', meaning: '信息，消息', usage: 'send messages 发送信息' }
    ],
    grammar: '<strong>主句：</strong>These receptors are the cells<br><strong>定语从句：</strong>which sense smells and send messages to the brain（修饰cells）',
    structure: `主句: These receptors(主语) + are(系动词) + the cells(表语)
    ↓
定语从句: which(关系代词，作主语) + sense smells(谓语1) + and(并列连词) + send messages(谓语2) + to the brain(状语)`,
    logic: '定义说明：解释什么是感受器',
    examPoints: ['定语从句 which 引导', '并列谓语 sense...and send...', 'send messages to 向...发送信息']
  },
  {
    english: 'However, it has been found that even people insensitive to a certain smell at first can suddenly become sensitive to it when exposed to it often enough.',
    chinese: '然而，研究发现，即使是起初对某种气味不敏感的人，在经常接触后也可能突然变得敏感。',
    vocabulary: [
      { word: 'however', meaning: '然而，但是', usage: '用于句首表示转折' },
      { word: 'certain', meaning: '某种，确定的', usage: 'a certain type 某种类型' },
      { word: 'expose', meaning: '暴露，接触', usage: 'be exposed to 接触到...' }
    ],
    grammar: '<strong>转折副词：</strong>However,<br><strong>形式主语：</strong>it has been found that...<br><strong>真正主语：</strong>that 从句<br><strong>让步状语：</strong>even people insensitive to a certain smell at first<br><strong>时间状语从句：</strong>when exposed to it often enough',
    structure: `转折: However(然而)
    ↓
主句: it(形式主语) + has been found(被动谓语) + that从句(真正主语)
    ↓
that从句: even people(主语) + insensitive to...(后置定语) + can become(谓语) + sensitive(表语)
    ↓
时间状语: when(当) + exposed to it(过去分词短语) + often enough(状语)`,
    logic: '转折 + 补充：虽然有些人天生不敏感，但可以通过接触变得敏感',
    examPoints: ['it has been found that 研究发现', 'even 即使', '后置定语形容词短语', 'when exposed to 当接触时（省略句）']
  },
  {
    english: 'The explanation for insensitivity to smell seems to be that the brain finds it inefficient to keep all smell receptors working all the time but can create new receptors if necessary.',
    chinese: '对嗅觉不敏感的解释似乎是，大脑认为让所有嗅觉感受器一直工作是不高效的，但在必要时可以创造新的感受器。',
    vocabulary: [
      { word: 'explanation', meaning: '解释，说明', usage: 'the explanation for... ...的解释' },
      { word: 'inefficient', meaning: '效率低的', usage: 'inefficient method 低效的方法' },
      { word: 'create', meaning: '创造，创建', usage: 'create new things 创造新事物' }
    ],
    grammar: '<strong>主句：</strong>The explanation...seems to be that...<br><strong>表语从句：</strong>that the brain finds it inefficient...<br><strong>形式宾语：</strong>it（指代后面的不定式）<br><strong>真正宾语：</strong>to keep all smell receptors working all the time<br><strong>宾语补足语：</strong>working<br><strong>并列谓语：</strong>but can create new receptors<br><strong>条件状语：</strong>if necessary',
    structure: `主句: The explanation(主语) + for insensitivity to smell(定语) + seems to be(系动词) + that从句(表语)
    ↓
表语从句: the brain(主语) + finds(谓语) + it(形式宾语) + inefficient(宾补) + to keep...(真正宾语)
    ↓
不定式短语: to keep(不定式) + all smell receptors(宾语) + working(宾补) + all the time(状语)
    ↓
并列谓语: but(转折) + can create(谓语) + new receptors(宾语)
    ↓
条件状语: if necessary(如果需要)`,
    logic: '科学解释：从大脑工作效率角度解释嗅觉不敏感的原因',
    examPoints: ['The explanation for... ...的解释', 'seem to be 似乎是', 'find it + adj + to do 发现做某事...', 'keep sb/sth doing 让...一直做', 'if necessary 如果有必要']
  },
  {
    english: 'This may also explain why we are not usually sensitive to our own smells—we are not aware of the usual smell of our own house—but we notice new smells when we visit someone else\'s.',
    chinese: '这也可以解释为什么我们通常对自己的气味不敏感——我们觉察不到自己房子的平常气味——但当我们拜访别人家时，我们会注意到新的气味。',
    vocabulary: [
      { word: 'aware', meaning: '意识到的，知道的', usage: 'be aware of 意识到...' },
      { word: 'notice', meaning: '注意到', usage: 'notice something 注意到某事' }
    ],
    grammar: '<strong>主句：</strong>This may also explain why...<br><strong>宾语从句：</strong>why we are not usually sensitive to our own smells<br><strong>插入语（破折号）：</strong>—we are not aware of the usual smell of our own house—<br><strong>转折分句：</strong>but we notice new smells<br><strong>时间状语从句：</strong>when we visit someone else\'s',
    structure: `主句: This(主语) + may also explain(谓语) + why从句(宾语)
    ↓
宾语从句: why(疑问副词) + we(主语) + are not sensitive(系表结构) + to our own smells(状语)
    ↓
插入语: we(主语) + are not aware of(谓语) + the usual smell(宾语) + of our own house(定语)
    ↓
转折分句: but(转折) + we(主语) + notice(谓语) + new smells(宾语)
    ↓
时间状语: when(当) + we(主语) + visit(谓语) + someone else's(宾语，省略house)`,
    logic: '举例说明：用日常生活中的例子来说明前面的理论',
    examPoints: ['explain why 解释为什么', 'be aware of 意识到', 'someone else\'s 别人的（所有格）', '破折号插入语的用法']
  },
  {
    english: 'The brain finds it best to keep smell receptors available for unfamiliar and emergency signals such as the smell of smoke, which might indicate the danger of fire.',
    chinese: '大脑认为最好让嗅觉感受器保持可用状态，以应对不熟悉和紧急的信号，例如烟味，这可能预示着火灾的危险。',
    vocabulary: [
      { word: 'available', meaning: '可用的，可获得的', usage: 'keep sth available 保持某物可用' },
      { word: 'unfamiliar', meaning: '不熟悉的', usage: 'un-（否定前缀）+ familiar（熟悉的）' },
      { word: 'emergency', meaning: '紧急情况', usage: 'emergency signal 紧急信号' },
      { word: 'indicate', meaning: '表明，暗示', usage: 'indicate danger 预示危险' }
    ],
    grammar: '<strong>主句：</strong>The brain finds it best to keep...<br><strong>形式宾语：</strong>it<br><strong>真正宾语：</strong>to keep smell receptors available...<br><strong>宾语补足语：</strong>available<br><strong>目的状语：</strong>for unfamiliar and emergency signals<br><strong>举例：</strong>such as the smell of smoke<br><strong>非限制性定语从句：</strong>which might indicate the danger of fire（修饰smoke）',
    structure: `主句: The brain(主语) + finds(谓语) + it(形式宾语) + best(宾补) + to keep...(真正宾语)
    ↓
不定式短语: to keep(不定式) + smell receptors(宾语) + available(宾补) + for...(目的状语)
    ↓
举例说明: such as(例如) + the smell of smoke(例子)
    ↓
定语从句: which(关系代词，指代smoke) + might indicate(谓语) + the danger of fire(宾语)`,
    logic: '总结：解释大脑为何要让感受器保持可用状态——为了应对紧急情况',
    examPoints: ['find it + adj + to do', 'keep sth + adj 保持某物处于某种状态', 'such as 例如', 'which 引导非限制性定语从句', 'indicate 表明']
  }
])

// 文章主题
const articleTheme = ref('本文探讨了人类嗅觉能力的真相，反驳了“人类嗅觉不敏感”的传统观点。文章首先指出人类直立行走导致鼻子功能受限，只能感知空气中的气味而无法感知表面的气味。然后通过科学证据表明，人类其实对气味极其敏感，即使浓度低至百万分之一也能察觉。文章进一步解释了个体差异的原因（基因不同），以及大脑的高效调节机制（不会让所有感受器同时工作，但能在必要时创造新的感受器）。最后总结：大脑保持嗅觉感受器的可用状态，是为了应对不熟悉和紧急的信号（如烟味预示火灾危险）。')

// 文章结构
const articleStructure = ref(`第一部分（第1-2句）：提出传统观点并解释原因
  ├─ 传统观点：人类嗅觉不如动物灵敏
  ├─ 转折说明：但这主要是因为人类直立行走
  └─ 结果分析：鼻子只能感知空气中的气味，错过表面气味

第二部分（第3-4句）：转折论证，揭示真相
  ├─ 事实反驳：事实上，人类嗅觉极其敏感
  ├─ 让步说明：即使我们没有意识到
  └─ 数据支撑：能察觉到稀释到百万分之一的气味

第三部分（第5-7句）：解释个体差异
  ├─ 现象描述：有些人对某些花的气味不敏感
  ├─ 对比说明：而另一些人对两种花都敏感
  ├─ 原因分析：缺乏产生特定感受器的基因
  ├─ 定义说明：感受器是感知气味并向大脑发送信息的细胞
  └─ 补充发现：起初不敏感的人可以通过接触变得敏感

第四部分（第8-10句）：科学解释大脑机制
  ├─ 效率原则：大脑认为让所有感受器一直工作不高效
  ├─ 适应能力：可以在必要时创造新的感受器
  ├─ 生活实例：对自己房子的气味不敏感，但对别人家的新气味敏感
  └─ 总结升华：大脑保持感受器可用，以应对紧急信号（如烟味预示火灾）`) 

// 写作手法
const writingTechniques = ref([
  '对比论证（compared with / whereas）：人类 vs 动物的嗅觉能力；有些人 vs 另一些人',
  '转折论证（but / In fact / However）：先提出错误观点，再用事实反驳',
  '让步论证（even if / even when）：承认一个事实，引出更重要的观点',
  '因果分析（because / This means that / The explanation for...）：层层递进解释原因',
  '举例说明（such as）：用烟味预示火灾的例子说明紧急信号的重要性',
  '数据支撑（one part in one million）：引用具体数据增强说服力',
  '插入语用法（—we are not aware of...—）：用破折号插入补充说明',
  '形式主语/宾语结构（it has been found that / finds it inefficient to）：使句子更加简洁' 
])

// 阅读策略
const readingStrategies = ref([
  '关注转折词：but, however, in fact, actually 等往往引出作者真实观点',
  '识别让步结构：although/though/even if 引导的句子是次要信息，主句才是重点',
  '注意对比信号：compared with, in contrast, whereas 提示比较关系',
  '抓住主题句：段落首句通常是主题句，概括本段核心内容',
  '理解长难句：先找主干（主谓宾），再分析修饰成分（定语从句、状语从句等）',
  '注意指代关系：it, this, that, these 等代词指代的内容往往在前文',
  '识别逻辑关系：因果（because）、转折（but）、让步（even if）、对比（whereas）',
  '关注科学术语：gene, receptor, detect, dilute 等专业词汇的理解'
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
}

.sentence-text {
  font-size: 1.1em;
  line-height: 1.9;
  color: #2c3e50;
  flex: 1;
  font-weight: 500;
}

.sentence-translation {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  padding: 16px 18px;
  border-radius: 8px;
  margin-bottom: 15px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-left: 3px solid #2196f3;
}

.translation-content {
  flex: 1;
}

.translation-label {
  font-weight: 600;
  color: #1976d2;
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
  border-left: 4px solid #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.analysis-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.analysis-card h4 {
  color: #667eea;
  margin: 0 0 15px 0;
  font-size: 1.15em;
  font-weight: 600;
}

.analysis-card p,
.analysis-card pre,
.analysis-card ul {
  margin: 0;
  line-height: 1.9;
  color: #2c3e50;
}

.analysis-card pre {
  font-family: 'Courier New', monospace;
  font-size: 0.95em;
  white-space: pre-wrap;
  background: rgba(255, 255, 255, 0.7);
  padding: 12px;
  border-radius: 6px;
  line-height: 1.8;
}

.analysis-card ul {
  padding-left: 20px;
}

.analysis-card li {
  margin-bottom: 10px;
  line-height: 1.8;
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

  .analysis-cards {
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
