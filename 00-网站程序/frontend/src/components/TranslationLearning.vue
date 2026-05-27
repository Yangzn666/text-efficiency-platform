<template>
  <div class="translation-learning">
    <div class="page-header">
      <h2>🌐 翻译学习系统</h2>
      <p>科学诊断 · 系统提升 · 高效备考</p>
    </div>

    <!-- 评测日期小卡片 -->
    <div class="diagnosis-card-wrapper">
      <div class="diagnosis-card" @click="showDiagnosis = !showDiagnosis">
        <div class="card-decoration">
          <div class="decoration-circle circle-1"></div>
          <div class="decoration-circle circle-2"></div>
        </div>
        <div class="card-content">
          <div class="card-header">
            <div class="card-icon">
              <el-icon :size="28"><DocumentChecked /></el-icon>
            </div>
            <div class="card-title-section">
              <div class="card-title">翻译能力评测</div>
              <div class="card-subtitle">点击查看详情报告</div>
            </div>
          </div>
          <div class="card-info">
            <div class="info-item">
              <el-icon><Calendar /></el-icon>
              <span class="info-label">评测日期</span>
              <span class="info-value">{{ diagnosisDate }}</span>
            </div>
            <div class="info-divider"></div>
            <div class="info-item">
              <el-icon><TrendCharts /></el-icon>
              <span class="info-label">综合评分</span>
              <span class="info-value score-highlight">{{ diagnosisResult.overallScore }} 分</span>
            </div>
          </div>
        </div>
        <div class="card-action">
          <el-button type="primary" size="small" round>
            {{ showDiagnosis ? '收起' : '查看' }}
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 诊断结果展示区 -->
    <div v-if="showDiagnosis" class="diagnosis-section">
      <div class="diagnosis-header">
        <h3>📊 翻译能力诊断报告</h3>
        <el-button type="primary" size="small" @click="showDiagnosis = false">关闭诊断</el-button>
      </div>
      
      <!-- 总体评分 -->
      <div class="score-overview">
        <div class="score-card total">
          <div class="score-number">{{ diagnosisResult.overallScore }}</div>
          <div class="score-label">综合评分</div>
          <div class="score-desc">预估六级翻译得分：{{ diagnosisResult.predictedScore }}/15分</div>
        </div>
        <div class="score-cards-grid">
          <div v-for="(dimension, key) in diagnosisResult.dimensions" :key="key" class="score-card">
            <div class="score-icon">{{ dimension.icon }}</div>
            <div class="score-number">{{ dimension.stars }}</div>
            <div class="score-label">{{ dimension.name }}</div>
          </div>
        </div>
      </div>

      <!-- 详细分析 -->
      <div class="detailed-analysis">
        <h4>🔍 逐句分析</h4>
        <div v-for="(sentence, index) in diagnosisResult.sentences" :key="index" class="sentence-analysis">
          <div class="sentence-header">
            <span class="sentence-num">第{{ index + 1 }}句</span>
            <el-tag :type="sentence.quality === 'good' ? 'success' : sentence.quality === 'medium' ? 'warning' : 'danger'" size="small">
              {{ sentence.quality === 'good' ? '良好' : sentence.quality === 'medium' ? '一般' : '需改进' }}
            </el-tag>
          </div>
          <div class="sentence-content">
            <div class="original-text"><strong>原文：</strong>{{ sentence.original }}</div>
            <div class="user-answer"><strong>你的翻译：</strong><span class="highlight-error">{{ sentence.userTranslation }}</span></div>
            <div class="reference-answer"><strong>参考译文：</strong>{{ sentence.reference }}</div>
          </div>
          <div v-if="sentence.issues.length > 0" class="issues-list">
            <strong>问题分析：</strong>
            <ul>
              <li v-for="(issue, idx) in sentence.issues" :key="idx" class="issue-item">
                <el-tag size="small" :type="issue.type === 'spelling' ? 'danger' : issue.type === 'grammar' ? 'warning' : 'info'">
                  {{ issue.type === 'spelling' ? '拼写' : issue.type === 'grammar' ? '语法' : '表达' }}
                </el-tag>
                <span class="issue-desc">{{ issue.description }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 核心问题总结 -->
      <div class="core-issues">
        <h4>⚠️ 核心问题总结</h4>
        <div class="issues-grid">
          <div v-for="(issue, index) in diagnosisResult.coreIssues" :key="index" class="issue-card">
            <div class="issue-icon">{{ issue.icon }}</div>
            <h5>{{ issue.title }}</h5>
            <p>{{ issue.description }}</p>
            <div class="impact">影响：{{ issue.impact }}</div>
          </div>
        </div>
      </div>

      <!-- 18天提升计划 -->
      <div class="improvement-plan">
        <h4>📅 18天冲刺提升计划</h4>
        <div class="plan-timeline">
          <div v-for="(phase, index) in improvementPlan.phases" :key="index" class="phase-card">
            <div class="phase-header">
              <div class="phase-number">阶段{{ index + 1 }}</div>
              <div class="phase-duration">{{ phase.duration }}</div>
            </div>
            <h5>{{ phase.title }}</h5>
            <p class="phase-goal">目标：{{ phase.goal }}</p>
            <ul class="phase-tasks">
              <li v-for="(task, taskIdx) in phase.tasks" :key="taskIdx">
                <el-icon><Check /></el-icon>
                {{ task }}
              </li>
            </ul>
            <div class="phase-time">每日投入：{{ phase.dailyTime }}</div>
          </div>
        </div>

        <!-- 今日任务 -->
        <div class="today-tasks">
          <h5>✅ 今日任务（立即开始）</h5>
          <div class="task-list">
            <div v-for="(task, index) in improvementPlan.todayTasks" :key="index" class="task-item">
              <el-checkbox v-model="task.completed" @change="saveTaskProgress(task)">
                {{ task.content }}
              </el-checkbox>
              <el-tag v-if="task.time" size="small" type="info">{{ task.time }}</el-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- 高频搭配记忆卡 -->
      <div class="vocabulary-cards">
        <h4>📝 必背高频搭配（今天就开始记忆）</h4>
        <div class="vocab-grid">
          <div v-for="(vocab, index) in improvementPlan.keyCollocations" :key="index" class="vocab-card">
            <div class="vocab-en">{{ vocab.en }}</div>
            <div class="vocab-cn">{{ vocab.cn }}</div>
            <el-button size="small" type="primary" link @click="playAudio(vocab.en)">🔊</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 功能模块导航 -->
    <div class="modules-grid">
      <!-- 翻译词组积累 -->
      <div class="module-card" @click="navigateToModule('phrases')">
        <div class="module-icon phrases-icon">
          <el-icon :size="40"><Collection /></el-icon>
        </div>
        <h3 class="module-title">翻译词组积累</h3>
        <p class="module-desc">高频搭配 · 固定用法 · 主题词汇</p>
        <div class="module-stats">
          <span class="stat-item">已掌握 <strong>{{ stats.phrasesMastered }}</strong> 个</span>
        </div>
        <div class="module-arrow">
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>

      <!-- 词汇积累 -->
      <div class="module-card" @click="navigateToModule('vocabulary')">
        <div class="module-icon vocabulary-icon">
          <el-icon :size="40"><Reading /></el-icon>
        </div>
        <h3 class="module-title">核心词汇积累</h3>
        <p class="module-desc">翻译高频词 · 熟词僻义 · 同义替换</p>
        <div class="module-stats">
          <span class="stat-item">已学习 <strong>{{ stats.vocabularyLearned }}</strong> 个</span>
        </div>
        <div class="module-arrow">
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>

      <!-- 句型积累 -->
      <div class="module-card" @click="navigateToModule('patterns')">
        <div class="module-icon patterns-icon">
          <el-icon :size="40"><Connection /></el-icon>
        </div>
        <h3 class="module-title">万能句型积累</h3>
        <p class="module-desc">开头句型 · 过渡句型 · 结尾句型</p>
        <div class="module-stats">
          <span class="stat-item">已掌握 <strong>{{ stats.patternsMastered }}</strong> 个</span>
        </div>
        <div class="module-arrow">
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>

      <!-- 真题训练 -->
      <div class="module-card" @click="navigateToModule('exams')">
        <div class="module-icon exams-icon">
          <el-icon :size="40"><Document /></el-icon>
        </div>
        <h3 class="module-title">真题实战训练</h3>
        <p class="module-desc">历年真题 · 限时模拟 · 错题复盘</p>
        <div class="module-stats">
          <span class="stat-item">已完成 <strong>{{ stats.examsCompleted }}</strong> 套</span>
        </div>
        <div class="module-arrow">
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>

      <!-- 技巧讲义 -->
      <div class="module-card" @click="navigateToModule('tips')">
        <div class="module-icon tips-icon">
          <el-icon :size="40"><Lightning /></el-icon>
        </div>
        <h3 class="module-title">翻译技巧讲义</h3>
        <p class="module-desc">增词译法 · 词类转换 · 语序调整</p>
        <div class="module-stats">
          <span class="stat-item">共 <strong>6</strong> 个技巧</span>
        </div>
        <div class="module-arrow">
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>

      <!-- 错题本 -->
      <div class="module-card" @click="navigateToModule('mistakes')">
        <div class="module-icon mistakes-icon">
          <el-icon :size="40"><Warning /></el-icon>
        </div>
        <h3 class="module-title">错题本</h3>
        <p class="module-desc">拼写错误 · 语法错误 · 表达问题</p>
        <div class="module-stats">
          <span class="stat-item">待复习 <strong>{{ stats.mistakesPending }}</strong> 个</span>
        </div>
        <div class="module-arrow">
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>
    </div>

    <!-- 使用提示 -->
    <div class="usage-tips">
      <el-icon><InfoFilled /></el-icon>
      <span>💡 使用建议：每天完成5-10句翻译练习，对照答案找差距，积累常用表达</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { InfoFilled, DocumentChecked, Check, Calendar, ArrowRight, Collection, Reading, Connection, Document, Lightning, Warning, TrendCharts } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

// 路由
const router = useRouter()

// 诊断相关数据
const showDiagnosis = ref(false)
const hasCompletedDiagnosis = ref(true) // 默认已完成

// 评测日期
const diagnosisDate = computed(() => {
  const saved = localStorage.getItem('translation-diagnosis-date')
  return saved || '2026-05-26'
})

// 统计数据
const stats = ref({
  phrasesMastered: 45,
  vocabularyLearned: 128,
  patternsMastered: 15,
  examsCompleted: 8,
  mistakesPending: 23
})

// 诊断结果（基于用户之前的回答）
const diagnosisResult = ref({
  overallScore: 5.5,
  predictedScore: '5-6',
  dimensions: {
    vocabulary: { name: '词汇准确性', stars: 3, icon: '📚' },
    grammar: { name: '句型结构', stars: 2, icon: '🔧' },
    expression: { name: '地道表达', stars: 2, icon: '💬' },
    timeControl: { name: '时间控制', stars: 4, icon: '⏱️' },
    fluency: { name: '整体流畅度', stars: 2, icon: '✨' }
  },
  sentences: [
    {
      original: '中国茶文化源远流长，可以追溯到几千年前。',
      userTranslation: 'Chinese tea culture has a long histroy with thousands years',
      reference: 'Chinese tea culture has a long history, dating back thousands of years.',
      quality: 'medium',
      issues: [
        { type: 'spelling', description: 'histroy → history（拼写错误）' },
        { type: 'expression', description: 'with thousands years → dating back thousands of years（介词使用不当）' },
        { type: 'expression', description: '遗漏“可以追溯到”的翻译' }
      ]
    },
    {
      original: '茶不仅是一种饮料，更是一种文化象征。',
      userTranslation: 'which not only a drink,but also a symbol of culture',
      reference: 'Tea is not only a beverage, but also a cultural symbol.',
      quality: 'bad',
      issues: [
        { type: 'grammar', description: 'which引导的从句缺少谓语动词，应为Tea is not only...' },
        { type: 'grammar', description: '逗号后需要空格' },
        { type: 'expression', description: 'drink → beverage（更正式的表达）' }
      ]
    },
    {
      original: '在中国，人们喝茶不仅为了解渴，更是为了享受闲暇时光和社交交流。',
      userTranslation: 'In China,people drinks tea not only for solving thirsty,but also for enjoying relaxing time and social interaction.',
      reference: 'In China, people drink tea not only to quench their thirst, but also to enjoy leisure time and socialize.',
      quality: 'medium',
      issues: [
        { type: 'grammar', description: 'people是复数，应用drink而非drinks' },
        { type: 'expression', description: 'solving thirsty → quenching thirst（固定搭配）' },
        { type: 'expression', description: 'relaxing time → leisure time（更地道）' }
      ]
    },
    {
      original: '茶艺表演展示了泡茶的技巧和艺术，吸引了越来越多的国内外游客。',
      userTranslation: 'The Art Tea shows have apealed more and more trivalers around the world by showing the technology and art of making tea.',
      reference: 'Tea art performances showcase the techniques and artistry of brewing tea, attracting an increasing number of domestic and international tourists.',
      quality: 'medium',
      issues: [
        { type: 'spelling', description: 'apealed → appealed, trivalers → travelers' },
        { type: 'expression', description: 'technology（科技）→ techniques（技巧）' },
        { type: 'expression', description: 'Art Tea → tea art（语序问题）' }
      ]
    },
    {
      original: '如今，茶文化已经成为中国文化的重要组成部分，也是中外文化交流的重要桥梁。',
      userTranslation: 'Nowadays,tea cultrue have been a important parts in Chinese culture that also have been a significant bridge for interacting to abroad culture.',
      reference: 'Nowadays, tea culture has become an important part of Chinese culture and a significant bridge for cultural exchange between China and other countries.',
      quality: 'bad',
      issues: [
        { type: 'spelling', description: 'cultrue → culture' },
        { type: 'grammar', description: 'tea culture是单数，应用has而非have' },
        { type: 'grammar', description: 'a important → an important（冠词错误）' },
        { type: 'expression', description: 'interacting to abroad culture → cultural exchange between China and other countries（中式英语）' }
      ]
    }
  ],
  coreIssues: [
    {
      icon: '❌',
      title: '拼写错误频发',
      description: 'history, appealed, travelers, culture等基础词汇拼写错误',
      impact: '阅卷老师看到拼写错误会直接扣分，显得基础不扎实'
    },
    {
      icon: '⚠️',
      title: '主谓一致错误',
      description: 'people drinks, tea culture have等高频语法错误',
      impact: '基础语法错误会让整篇文章显得不专业'
    },
    {
      icon: '🇨🇳',
      title: '中式英语明显',
      description: 'solving thirsty, interacting to abroad culture等Chinglish表达',
      impact: '虽然能看懂，但不地道，拿不到高分'
    },
    {
      icon: '📝',
      title: '标点符号不规范',
      description: '逗号后面必须空格，这是基本书写规范',
      impact: '影响卷面整洁度，给阅卷老师留下不好印象'
    }
  ]
})

// 18天提升计划
const improvementPlan = ref({
  phases: [
    {
      duration: '第1-3天',
      title: '纠正基础错误',
      goal: '消除拼写和主谓一致错误',
      tasks: [
        '每天检查拼写：写完必须通读一遍',
        '主谓一致专项训练：找10个句子练习',
        '标点规范：养成逗号后空格的习惯',
        '抄写5个拼写错误并默写'
      ],
      dailyTime: '40分钟'
    },
    {
      duration: '第4-7天',
      title: '积累固定搭配',
      goal: '掌握六级翻译高频搭配',
      tasks: [
        '背诵quench thirst, date back to等10个搭配',
        '每个搭配造2个句子',
        '真题中找出类似搭配并整理',
        '每天复习前一天的搭配'
      ],
      dailyTime: '40分钟'
    },
    {
      duration: '第8-12天',
      title: '句型升级训练',
      goal: '学会使用3个万能句型',
      tasks: [
        'Not only...but also...句型练习',
        '定语从句which/that用法',
        'By doing...句式应用',
        '每天用新句型翻译3个句子'
      ],
      dailyTime: '40分钟'
    },
    {
      duration: '第13-16天',
      title: '真题实战+复盘',
      goal: '适应考试节奏，查漏补缺',
      tasks: [
        '每天1篇真题翻译（限时25分钟）',
        '对照答案找差距',
        '建立错题本记录常见错误',
        '周末做完整模拟测试'
      ],
      dailyTime: '40分钟'
    },
    {
      duration: '第17-18天',
      title: '考前模拟+模板固化',
      goal: '保持手感，巩固成果',
      tasks: [
        '完整做1套翻译真题（严格计时）',
        '复习错题本',
        '背诵积累的万能句式',
        '调整心态，准备考试'
      ],
      dailyTime: '30分钟'
    }
  ],
  todayTasks: [
    { content: '抄写5个拼写错误（history, appealed, travelers, culture, technology）', completed: false, time: '10分钟' },
    { content: '背诵3个固定搭配：quench thirst, date back to, cultural exchange', completed: false, time: '15分钟' },
    { content: '再做1道翻译题，重点关注拼写和主谓一致', completed: false, time: '15分钟' }
  ],
  keyCollocations: [
    { en: 'quench thirst', cn: '解渴' },
    { en: 'date back to', cn: '追溯到' },
    { en: 'cultural exchange', cn: '文化交流' },
    { en: 'attach importance to', cn: '重视' },
    { en: 'play an important role in', cn: '在...中起重要作用' },
    { en: 'serve as a bridge', cn: '充当桥梁' }
  ]
})

// 导航到模块子页面
function navigateToModule(module: string) {
  const routeMap: Record<string, string> = {
    phrases: '/translation/phrases',
    vocabulary: '/translation/vocabulary',
    patterns: '/translation/patterns',
    exams: '/translation/exams',
    tips: '/translation/tips',
    mistakes: '/translation/mistakes'
  }
  
  const route = routeMap[module]
  if (route) {
    router.push(route)
  }
}

// 保存任务进度
function saveTaskProgress(task: any) {
  const saved = localStorage.getItem('translation-today-tasks')
  const tasks = saved ? JSON.parse(saved) : []
  const existingIndex = tasks.findIndex((t: any) => t.content === task.content)
  
  if (existingIndex >= 0) {
    tasks[existingIndex].completed = task.completed
  } else {
    tasks.push({ content: task.content, completed: task.completed })
  }
  
  localStorage.setItem('translation-today-tasks', JSON.stringify(tasks))
  
  if (task.completed) {
    ElMessage.success('任务完成！继续加油！')
  }
}

// 播放音频（模拟）
function playAudio(text: string) {
  ElMessage.info(`播放发音：${text}`)
  // 实际项目中可以使用Web Speech API或接入音频服务
}

onMounted(() => {
  // 检查是否已完成诊断
  const diagnosisCompleted = localStorage.getItem('translation-diagnosis-completed')
  if (diagnosisCompleted === 'true') {
    hasCompletedDiagnosis.value = true
  }
  
  // 加载今日任务进度
  const savedTasks = localStorage.getItem('translation-today-tasks')
  if (savedTasks) {
    const tasks = JSON.parse(savedTasks)
    tasks.forEach((savedTask: any) => {
      const task = improvementPlan.value.todayTasks.find(t => t.content === savedTask.content)
      if (task) {
        task.completed = savedTask.completed
      }
    })
  }
})
</script>

<style scoped>
.translation-learning {
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h2 {
  font-size: 2em;
  color: #FF9800;
  margin-bottom: 10px;
}

.page-header p {
  font-size: 1.1em;
  color: #555;
}

/* 诊断入口 */
.diagnosis-entry {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-radius: 15px;
  border: 2px dashed #FF9800;
}

.entry-hint {
  margin-top: 10px;
  color: #F57C00;
  font-size: 0.95em;
}

/* 诊断结果区域 */
.diagnosis-section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(255, 152, 0, 0.15);
  margin-bottom: 30px;
  border: 2px solid #FF9800;
}

.diagnosis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.diagnosis-header h3 {
  font-size: 1.6em;
  color: #FF9800;
  margin: 0;
}

/* 评分总览 */
.score-overview {
  margin-bottom: 30px;
}

.score-card {
  background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.score-card.total {
  background: linear-gradient(135deg, #FF9800 0%, #FFB74D 100%);
  color: white;
  margin-bottom: 20px;
}

.score-number {
  font-size: 2.5em;
  font-weight: bold;
  color: #FF9800;
  margin-bottom: 8px;
}

.score-card.total .score-number {
  color: white;
}

.score-label {
  font-size: 1em;
  color: #444;
  margin-bottom: 5px;
}

.score-card.total .score-label {
  color: rgba(255, 255, 255, 0.9);
}

.score-desc {
  font-size: 0.9em;
  color: rgba(255, 255, 255, 0.8);
}

.score-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.score-icon {
  font-size: 2em;
  margin-bottom: 8px;
}

/* 详细分析 */
.detailed-analysis {
  margin-bottom: 30px;
}

.detailed-analysis h4,
.core-issues h4,
.improvement-plan h4,
.vocabulary-cards h4 {
  font-size: 1.4em;
  color: #333;
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 4px solid #FF9800;
}

.sentence-analysis {
  background: #fafafa;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 15px;
  border-left: 4px solid #ddd;
}

.sentence-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.sentence-num {
  font-weight: bold;
  color: #FF9800;
  font-size: 1.1em;
}

.sentence-content {
  margin-bottom: 12px;
}

.original-text,
.user-answer,
.reference-answer {
  margin-bottom: 8px;
  line-height: 1.6;
}

.highlight-error {
  color: #f44336;
  text-decoration: underline wavy #f44336;
}

.reference-answer {
  color: #4CAF50;
  font-weight: 500;
}

.issues-list {
  background: #fff3e0;
  padding: 12px;
  border-radius: 8px;
}

.issues-list strong {
  color: #F57C00;
  display: block;
  margin-bottom: 8px;
}

.issues-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.issue-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
}

.issue-desc {
  color: #555;
  font-size: 0.95em;
}

/* 核心问题 */
.core-issues {
  margin-bottom: 30px;
}

.issues-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.issue-card {
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;
}

.issue-card:hover {
  border-color: #FF9800;
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.15);
  transform: translateY(-2px);
}

.issue-icon {
  font-size: 2em;
  margin-bottom: 10px;
}

.issue-card h5 {
  font-size: 1.1em;
  color: #333;
  margin-bottom: 8px;
}

.issue-card p {
  color: #666;
  font-size: 0.95em;
  line-height: 1.5;
  margin-bottom: 10px;
}

.impact {
  color: #f44336;
  font-size: 0.9em;
  font-weight: 500;
}

/* 提升计划 */
.improvement-plan {
  margin-bottom: 30px;
}

.plan-timeline {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.phase-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  position: relative;
  transition: all 0.3s ease;
}

.phase-card:hover {
  border-color: #FF9800;
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.15);
}

.phase-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.phase-number {
  background: #FF9800;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: bold;
}

.phase-duration {
  color: #777;
  font-size: 0.9em;
}

.phase-card h5 {
  font-size: 1.2em;
  color: #333;
  margin-bottom: 8px;
}

.phase-goal {
  color: #555;
  font-size: 0.95em;
  margin-bottom: 12px;
}

.phase-tasks {
  list-style: none;
  padding: 0;
  margin: 0 0 12px 0;
}

.phase-tasks li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 0;
  color: #555;
  font-size: 0.95em;
  line-height: 1.5;
}

.phase-tasks li .el-icon {
  color: #4CAF50;
  margin-top: 2px;
}

.phase-time {
  color: #FF9800;
  font-size: 0.9em;
  font-weight: 500;
}

/* 今日任务 */
.today-tasks {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border-radius: 12px;
  padding: 20px;
  border: 2px solid #4CAF50;
}

.today-tasks h5 {
  font-size: 1.2em;
  color: #2e7d32;
  margin-bottom: 15px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 12px 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.task-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.task-item .el-checkbox {
  flex: 1;
}

/* 词汇卡片 */
.vocabulary-cards {
  margin-bottom: 30px;
}

.vocab-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.vocab-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.vocab-card:hover {
  border-color: #FF9800;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.15);
}

.vocab-en {
  font-weight: bold;
  color: #FF9800;
  font-size: 1.05em;
}

.vocab-cn {
  color: #666;
  font-size: 0.95em;
  flex: 1;
  margin-left: 10px;
}

.usage-tips {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 20px;
  background: #fff3e0;
  border-radius: 10px;
  color: #F57C00;
  font-size: 0.95em;
}

/* 评测日期小卡片 */
.diagnosis-card-wrapper {
  margin-bottom: 30px;
}

.diagnosis-card {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.25);
  overflow: hidden;
}

.diagnosis-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.35);
}

.card-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 120px;
  height: 120px;
  top: -40px;
  right: -30px;
}

.circle-2 {
  width: 80px;
  height: 80px;
  bottom: -20px;
  right: 80px;
}

.card-content {
  flex: 1;
  z-index: 1;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.card-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  backdrop-filter: blur(10px);
}

.card-title-section {
  flex: 1;
}

.card-title {
  font-size: 1.3em;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
}

.card-subtitle {
  font-size: 0.9em;
  color: rgba(255, 255, 255, 0.8);
}

.card-info {
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(255, 255, 255, 0.15);
  padding: 12px 16px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
}

.info-item .el-icon {
  font-size: 1.1em;
}

.info-label {
  font-size: 0.85em;
  color: rgba(255, 255, 255, 0.8);
}

.info-value {
  font-size: 1em;
  font-weight: 600;
  color: white;
}

.score-highlight {
  font-size: 1.2em;
  color: #FFD700;
}

.info-divider {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.3);
}

.card-action {
  z-index: 1;
}

.card-action .el-button {
  background: rgba(255, 255, 255, 0.95);
  border: none;
  color: #667eea;
  font-weight: 600;
  padding: 10px 20px;
  transition: all 0.3s ease;
}

.card-action .el-button:hover {
  background: white;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 功能模块导航 */
.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.module-card {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 28px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid #f0f0f0;
  overflow: hidden;
}

.module-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--module-color) 0%, var(--module-color-light) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.module-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  border-color: var(--module-color);
}

.module-card:hover::before {
  opacity: 1;
}

.module-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: white;
  transition: all 0.3s ease;
}

.module-card:hover .module-icon {
  transform: scale(1.1) rotate(5deg);
}

.phrases-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.vocabulary-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.patterns-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.exams-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.tips-icon {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.mistakes-icon {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
}

.module-title {
  font-size: 1.25em;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.module-desc {
  font-size: 0.9em;
  color: #555;
  line-height: 1.5;
  margin-bottom: 16px;
}

.module-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 12px;
}

.stat-item {
  font-size: 0.9em;
  color: #555;
}

.stat-item strong {
  color: #333;
  font-size: 1.1em;
}

.module-arrow {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  background: #f8f9fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
  transition: all 0.3s ease;
}

.module-card:hover .module-arrow {
  background: var(--module-color);
  color: white;
  transform: translateX(4px);
}

/* 为每个模块设置颜色变量 */
.module-card:nth-child(1) {
  --module-color: #667eea;
  --module-color-light: #764ba2;
}

.module-card:nth-child(2) {
  --module-color: #f5576c;
  --module-color-light: #f093fb;
}

.module-card:nth-child(3) {
  --module-color: #4facfe;
  --module-color-light: #00f2fe;
}

.module-card:nth-child(4) {
  --module-color: #43e97b;
  --module-color-light: #38f9d7;
}

.module-card:nth-child(5) {
  --module-color: #fa709a;
  --module-color-light: #fee140;
}

.module-card:nth-child(6) {
  --module-color: #ff6b6b;
  --module-color-light: #ee5a6f;
}

@media (max-width: 768px) {
  .modules-grid {
    grid-template-columns: 1fr;
  }
  
  .diagnosis-card {
    flex-direction: column;
    text-align: center;
  }
  
  .card-header {
    justify-content: center;
  }
  
  .card-info {
    flex-direction: column;
    gap: 12px;
  }
  
  .info-divider {
    width: 80%;
    height: 1px;
  }
}
</style>
