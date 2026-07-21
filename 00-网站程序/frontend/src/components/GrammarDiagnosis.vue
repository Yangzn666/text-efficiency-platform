<template>
  <div class="grammar-diagnosis">
    <div class="diagnosis-header">
      <h2 class="diagnosis-title">📊 语法水平诊断报告</h2>
      <p class="diagnosis-date">诊断日期: 2026-05-05 | 下次诊断: 2026-06-16</p>
    </div>

    <!-- 总体评估 -->
    <div class="overall-assessment">
      <div class="grade-card">
        <div class="grade-level">B-</div>
        <div class="grade-score">60-70分</div>
        <div class="grade-label">当前语法水平</div>
      </div>
      <div class="target-card">
        <div class="target-level">A</div>
        <div class="target-score">80-85分</div>
        <div class="target-label">6周后目标</div>
        <div class="target-improvement"> +20-25分提升</div>
      </div>
    </div>

    <!-- 测试详情 -->
    <div class="test-details">
      <h3 class="section-title">📝 诊断测试详情</h3>
      <p class="section-desc">苏格拉底式问答（10题）| 测试范围：基础句子结构 → 高级独立主格</p>
      
      <div class="test-results">
        <div v-for="(result, index) in testResults" :key="index" 
             class="result-item"
             :class="result.status">
          <div class="result-number">{{ index + 1 }}</div>
          <div class="result-content">
            <div class="result-topic">{{ result.topic }}</div>
            <div class="result-status">{{ result.statusText }}</div>
          </div>
          <div class="result-icon">{{ result.icon }}</div>
        </div>
      </div>
    </div>

    <!-- 强项分析 -->
    <div class="strengths-section">
      <h3 class="section-title">✅ 强项分析</h3>
      <div class="strength-cards">
        <div v-for="(strength, index) in strengths" :key="index" class="strength-card">
          <div class="strength-icon">{{ strength.icon }}</div>
          <div class="strength-title">{{ strength.title }}</div>
          <div class="strength-desc">{{ strength.desc }}</div>
        </div>
      </div>
    </div>

    <!-- 薄弱环节 -->
    <div class="weaknesses-section">
      <h3 class="section-title">❌ 薄弱环节（按严重程度排序）</h3>
      <div class="weakness-list">
        <div v-for="(weakness, index) in weaknesses" :key="index" 
             class="weakness-item"
             :class="`severity-${weakness.severity}`">
          <div class="weakness-rank">{{ index + 1 }}</div>
          <div class="weakness-content">
            <div class="weakness-title">{{ weakness.title }}</div>
            <div class="weakness-desc">{{ weakness.desc }}</div>
            <div class="weakness-advice">{{ weakness.advice }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 知识点掌握情况 -->
    <div class="knowledge-mastery">
      <h3 class="section-title">📈 知识点掌握情况</h3>
      <div class="mastery-table">
        <div class="table-header">
          <div class="col-topic">知识点</div>
          <div class="col-level">掌握程度</div>
          <div class="col-status">状态</div>
        </div>
        <div v-for="(item, index) in masteryItems" :key="index" class="table-row">
          <div class="col-topic">{{ item.topic }}</div>
          <div class="col-level">
            <el-progress 
              :percentage="item.level" 
              :color="getProgressColor(item.level)"
              :stroke-width="12"
            />
          </div>
          <div class="col-status">
            <span class="status-badge" :class="getStatusClass(item.level)">
              {{ getStatusText(item.level) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习建议 -->
    <div class="learning-advice">
      <h3 class="section-title">🎯 学习建议</h3>
      <div class="advice-cards">
        <div v-for="(advice, index) in adviceItems" :key="index" 
             class="advice-card"
             :class="`priority-${advice.priority}`">
          <div class="advice-priority">{{ advice.priorityText }}</div>
          <div class="advice-title">{{ advice.title }}</div>
          <div class="advice-content">{{ advice.content }}</div>
        </div>
      </div>
    </div>

    <!-- AI语法助手使用建议 -->
    <div class="ai-usage-tips">
      <h3 class="section-title">🤖 AI语法助手使用建议</h3>
      <div class="ai-tips-grid">
        <div v-for="(tip, index) in aiTips" :key="index" class="ai-tip-card">
          <div class="tip-template">模板{{ tip.template }}</div>
          <div class="tip-name">{{ tip.name }}</div>
          <div class="tip-usage">{{ tip.usage }}</div>
          <div class="tip-frequency">{{ tip.frequency }}</div>
        </div>
      </div>
    </div>

    <!-- 6周计划概览 -->
    <div class="plan-overview">
      <h3 class="section-title">📅 6周学习计划概览</h3>
      <div class="plan-timeline">
        <div v-for="(phase, index) in planPhases" :key="index" class="phase-card">
          <div class="phase-number">第{{ phase.weeks }}周</div>
          <div class="phase-title">{{ phase.title }}</div>
          <div class="phase-focus">重点: {{ phase.focus }}</div>
          <div class="phase-time">⏱️ {{ phase.dailyTime }}</div>
          <ul class="phase-tasks">
            <li v-for="(task, idx) in phase.tasks" :key="idx">{{ task }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 成功指标 -->
    <div class="success-metrics">
      <h3 class="section-title"> 成功指标</h3>
      <div class="metrics-grid">
        <div class="metric-card short-term">
          <div class="metric-title">短期指标（2周内）</div>
          <ul class="metric-list">
            <li v-for="(item, index) in metrics.shortTerm" :key="index">
              <input type="checkbox" class="metric-checkbox" />
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
        <div class="metric-card mid-term">
          <div class="metric-title">中期指标（4周内）</div>
          <ul class="metric-list">
            <li v-for="(item, index) in metrics.midTerm" :key="index">
              <input type="checkbox" class="metric-checkbox" />
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
        <div class="metric-card long-term">
          <div class="metric-title">长期指标（6周后）</div>
          <ul class="metric-list">
            <li v-for="(item, index) in metrics.longTerm" :key="index">
              <input type="checkbox" class="metric-checkbox" />
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 总结与鼓励 -->
    <div class="encouragement">
      <h3 class="section-title"> 总结</h3>
      <div class="encouragement-content">
        <p class="enc-text">通过本次诊断，我们明确了你的语法水平（B-级，60-70分），找出了5个主要薄弱点，并制定了详细的6周学习计划。</p>
        <p class="enc-text"><strong>预期效果：</strong></p>
        <ul class="enc-list">
          <li>📈 语法水平提升20-25分</li>
          <li>📈 阅读理解能力显著增强</li>
          <li>📈 写作质量明显提高</li>
          <li>📈 建立系统的语法知识体系</li>
        </ul>
        <p class="enc-final">💪 坚持每天学习2小时，6周后你一定能达到80-85分的目标！加油！</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 测试结果
const testResults = ref([
  { topic: '基础句子结构', status: 'success', statusText: '完全正确', icon: '✅' },
  { topic: '定语从句', status: 'success', statusText: '完全正确', icon: '✅' },
  { topic: '非谓语动词', status: 'warning', statusText: '概念混淆', icon: '⚠️' },
  { topic: '分词时间关系', status: 'success', statusText: '完全正确', icon: '✅' },
  { topic: '虚拟语气', status: 'error', statusText: '理解错误', icon: '❌' },
  { topic: '条件句类型', status: 'error', statusText: '完全相反', icon: '' },
  { topic: '倒装句', status: 'warning', statusText: '规则不清', icon: '⚠️' },
  { topic: '复杂从句嵌套', status: 'error', statusText: '完全错误', icon: '❌' },
  { topic: '强调句型', status: 'warning', statusText: '部分正确', icon: '⚠️' },
  { topic: '独立主格', status: 'error', statusText: '完全不懂', icon: '' }
])

// 强项
const strengths = ref([
  {
    icon: '🏗️',
    title: '基础句子结构',
    desc: '能够准确识别主谓宾结构，理解句子基本框架'
  },
  {
    icon: '🔗',
    title: '定语从句',
    desc: '掌握定语从句的引导词和修饰关系，理解准确'
  },
  {
    icon: '⏱️',
    title: '分词时间关系',
    desc: '能正确理解分词动作与主句动作的时间先后关系'
  },
  {
    icon: '🧩',
    title: '句子成分识别',
    desc: '对基本的句子成分（主、谓、宾、定、状）有清晰认知'
  }
])

// 薄弱环节
const weaknesses = ref([
  {
    title: '复杂长难句分析',
    desc: '面对多层嵌套的从句结构时，无法快速提取主干',
    advice: '使用"四步法"：找主干→找并列→找从句→去修饰',
    severity: 'critical'
  },
  {
    title: '虚拟语气',
    desc: '对三种虚拟语气形式（与现在/过去/将来事实相反）混淆',
    advice: '系统学习三种形式的时态倒退规则',
    severity: 'critical'
  },
  {
    title: '非谓语动词概念',
    desc: '对不定式、动名词、分词的使用场景和区别不清',
    advice: '澄清三种非谓语动词的核心功能差异',
    severity: 'major'
  },
  {
    title: '倒装句规则',
    desc: '不完全倒装和完全倒装的触发条件记忆混乱',
    advice: '整理常见倒装触发词清单，分类记忆',
    severity: 'major'
  },
  {
    title: '独立主格结构',
    desc: '对独立主格的构成和用法完全不了解',
    advice: '学习"名词/代词+分词/形容词/介词短语"结构',
    severity: 'minor'
  }
])

// 知识点掌握情况
const masteryItems = ref([
  { topic: '基础句子结构', level: 90 },
  { topic: '定语从句', level: 85 },
  { topic: '分词时间关系', level: 80 },
  { topic: '句子成分识别', level: 75 },
  { topic: '时态语态', level: 70 },
  { topic: '介词搭配', level: 65 },
  { topic: '非谓语动词', level: 45 },
  { topic: '倒装句', level: 40 },
  { topic: '虚拟语气', level: 35 },
  { topic: '复杂从句嵌套', level: 30 },
  { topic: '独立主格', level: 20 }
])

// 学习建议
const adviceItems = ref([
  {
    priority: 'high',
    priorityText: '🔴 高优先级',
    title: '长难句分析能力',
    content: '每天使用AI语法助手模板2分析5个真题长难句，坚持2周，快速提升句子拆解能力'
  },
  {
    priority: 'high',
    priorityText: '🔴 高优先级',
    title: '虚拟语气系统学习',
    content: '使用模板1深入学习虚拟语气三种形式，制作规则表格，完成50道专项练习'
  },
  {
    priority: 'medium',
    priorityText: '🟡 中优先级',
    title: '非谓语动词澄清',
    content: '重点区分不定式、动名词、分词的核心功能，通过例句对比加深理解'
  },
  {
    priority: 'medium',
    priorityText: '🟡 中优先级',
    title: '倒装句规则整理',
    content: '整理常见倒装触发词（never, hardly, only等），分类记忆并练习'
  },
  {
    priority: 'low',
    priorityText: '🟢 低优先级',
    title: '独立主格学习',
    content: '掌握基本结构即可，考试中频率较低，可在第5-6周集中学习'
  }
])

// AI使用建议
const aiTips = ref([
  {
    template: '2',
    name: '长难句拆解教练',
    usage: '每天分析5个真题长难句',
    frequency: '每日必用'
  },
  {
    template: '1',
    name: '语法概念深度解释器',
    usage: '深入理解虚拟语气、非谓语等概念',
    frequency: '每周2-3次'
  },
  {
    template: '6',
    name: '个性化练习生成器',
    usage: '针对薄弱点生成专项练习',
    frequency: '每周使用'
  },
  {
    template: '10',
    name: '学习进度诊断师',
    usage: '每两周重新评估学习进度',
    frequency: '定期复盘'
  }
])

// 6周计划阶段
const planPhases = ref([
  {
    weeks: '1-2',
    title: '基础巩固期',
    focus: '长难句分析 + 虚拟语气',
    dailyTime: '2小时/天',
    tasks: [
      '每天分析5个长难句（模板2）',
      '系统学习虚拟语气（模板1）',
      '每周完成25个长难句分析',
      '每周完成50道虚拟语气练习'
    ]
  },
  {
    weeks: '3-4',
    title: '专项突破期',
    focus: '非谓语动词 + 倒装句',
    dailyTime: '2小时/天',
    tasks: [
      '澄清非谓语动词概念（模板1）',
      '掌握常见倒装触发词',
      '每周完成20个非谓语练习',
      '每周完成30道倒装句练习'
    ]
  },
  {
    weeks: '5-6',
    title: '综合提升期',
    focus: '独立主格 + 综合应用',
    dailyTime: '2.5小时/天',
    tasks: [
      '学习独立主格结构',
      '写作中运用高级语法',
      '完成2篇高质量作文',
      '进行2次真题模拟测试'
    ]
  }
])

// 成功指标
const metrics = ref({
  shortTerm: [
    '完成至少25个长难句分析',
    '掌握虚拟语气三种形式',
    '能熟练提取句子主干',
    '每日学习打卡率达到80%'
  ],
  midTerm: [
    '非谓语动词概念清晰',
    '掌握常见倒装句结构',
    '完成至少100道语法练习',
    '能在写作中使用2种高级语法'
  ],
  longTerm: [
    '模拟测试达到80分以上',
    '独立完成长难句分析（准确率90%）',
    '写作中能主动使用3种以上高级语法',
    '建立完整的语法知识体系'
  ]
})

// 辅助函数
const getProgressColor = (level: number) => {
  if (level >= 80) return '#67C23A'
  if (level >= 60) return '#E6A23C'
  return '#F56C6C'
}

const getStatusClass = (level: number) => {
  if (level >= 80) return 'status-excellent'
  if (level >= 60) return 'status-good'
  return 'status-poor'
}

const getStatusText = (level: number) => {
  if (level >= 80) return '优秀'
  if (level >= 60) return '良好'
  return '需加强'
}
</script>

<style scoped>
.grammar-diagnosis {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.diagnosis-header {
  text-align: center;
  margin-bottom: 30px;
}

.diagnosis-title {
  font-size: 2em;
  color: #333;
  margin-bottom: 10px;
}

.diagnosis-date {
  color: #666;
  font-size: 0.95em;
}

/* 总体评估 */
.overall-assessment {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.grade-card, .target-card {
  padding: 25px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.grade-card {
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  color: white;
}

.target-card {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.grade-level, .target-level {
  font-size: 3em;
  font-weight: bold;
  margin-bottom: 10px;
}

.grade-score, .target-score {
  font-size: 1.5em;
  margin-bottom: 8px;
}

.grade-label, .target-label {
  font-size: 1em;
  opacity: 0.9;
}

.target-improvement {
  margin-top: 10px;
  font-size: 1.1em;
  font-weight: 600;
}

/* 章节标题 */
.section-title {
  font-size: 1.5em;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 3px solid #16345c;
}

.section-desc {
  color: #666;
  margin-bottom: 20px;
  font-size: 0.95em;
}

/* 测试详情 */
.test-details {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.test-results {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 10px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.result-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.result-item.success {
  border-left: 4px solid #67C23A;
}

.result-item.warning {
  border-left: 4px solid #E6A23C;
}

.result-item.error {
  border-left: 4px solid #F56C6C;
}

.result-number {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #16345c;
  color: white;
  border-radius: 50%;
  font-weight: bold;
  flex-shrink: 0;
}

.result-content {
  flex: 1;
}

.result-topic {
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.result-status {
  font-size: 0.9em;
  color: #666;
}

.result-icon {
  font-size: 1.5em;
}

/* 强项分析 */
.strengths-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.strength-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.strength-card {
  padding: 20px;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
}

.strength-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.2);
}

.strength-icon {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.strength-title {
  font-size: 1.1em;
  font-weight: 600;
  color: #2e7d32;
  margin-bottom: 8px;
}

.strength-desc {
  font-size: 0.9em;
  color: #555;
  line-height: 1.5;
}

/* 薄弱环节 */
.weaknesses-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.weakness-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.weakness-item {
  display: flex;
  gap: 15px;
  padding: 20px;
  border-radius: 12px;
  background: #fff3e0;
  transition: all 0.3s ease;
}

.weakness-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.weakness-item.severity-critical {
  border-left: 5px solid #F56C6C;
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
}

.weakness-item.severity-major {
  border-left: 5px solid #FF9800;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
}

.weakness-item.severity-minor {
  border-left: 5px solid #E6A23C;
  background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
}

.weakness-rank {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ff7043;
  color: white;
  border-radius: 50%;
  font-weight: bold;
  font-size: 1.2em;
  flex-shrink: 0;
}

.weakness-content {
  flex: 1;
}

.weakness-title {
  font-size: 1.1em;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.weakness-desc {
  font-size: 0.95em;
  color: #666;
  margin-bottom: 8px;
  line-height: 1.5;
}

.weakness-advice {
  font-size: 0.9em;
  color: #16345c;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border-left: 3px solid #16345c;
}

/* 知识点掌握情况 */
.knowledge-mastery {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.mastery-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 3fr 1fr;
  gap: 15px;
  padding: 12px 15px;
  background: #16345c;
  color: white;
  border-radius: 8px;
  font-weight: 600;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 3fr 1fr;
  gap: 15px;
  padding: 12px 15px;
  background: #f8f9fa;
  border-radius: 8px;
  align-items: center;
  transition: all 0.3s ease;
}

.table-row:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 600;
  text-align: center;
}

.status-excellent {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-good {
  background: #fff3e0;
  color: #f57c00;
}

.status-poor {
  background: #ffebee;
  color: #c62828;
}

/* 学习建议 */
.learning-advice {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.advice-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.advice-card {
  padding: 20px;
  border-radius: 12px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.advice-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.advice-card.priority-high {
  border-top: 4px solid #F56C6C;
}

.advice-card.priority-medium {
  border-top: 4px solid #E6A23C;
}

.advice-card.priority-low {
  border-top: 4px solid #67C23A;
}

.advice-priority {
  font-size: 0.9em;
  font-weight: 600;
  margin-bottom: 10px;
}

.advice-title {
  font-size: 1.1em;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.advice-content {
  font-size: 0.95em;
  color: #666;
  line-height: 1.6;
}

/* AI使用建议 */
.ai-usage-tips {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.ai-tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.ai-tip-card {
  padding: 20px;
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  color: white;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.ai-tip-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(13, 33, 55, 0.3);
}

.tip-template {
  font-size: 0.85em;
  opacity: 0.9;
  margin-bottom: 8px;
}

.tip-name {
  font-size: 1.1em;
  font-weight: 600;
  margin-bottom: 10px;
}

.tip-usage {
  font-size: 0.9em;
  margin-bottom: 8px;
  line-height: 1.5;
}

.tip-frequency {
  font-size: 0.85em;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: inline-block;
}

/* 6周计划概览 */
.plan-overview {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.plan-timeline {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.phase-card {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 5px solid #16345c;
  transition: all 0.3s ease;
}

.phase-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.phase-number {
  font-size: 0.9em;
  color: #16345c;
  font-weight: 600;
  margin-bottom: 8px;
}

.phase-title {
  font-size: 1.2em;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.phase-focus {
  font-size: 0.95em;
  color: #666;
  margin-bottom: 8px;
}

.phase-time {
  font-size: 0.9em;
  color: #16345c;
  font-weight: 600;
  margin-bottom: 12px;
}

.phase-tasks {
  list-style: none;
  padding: 0;
  margin: 0;
}

.phase-tasks li {
  padding: 6px 0;
  font-size: 0.9em;
  color: #555;
  padding-left: 20px;
  position: relative;
}

.phase-tasks li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #67C23A;
  font-weight: bold;
}

/* 成功指标 */
.success-metrics {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.metric-card {
  padding: 20px;
  border-radius: 12px;
  background: #f8f9fa;
}

.metric-card.short-term {
  border-top: 4px solid #4CAF50;
}

.metric-card.mid-term {
  border-top: 4px solid #FF9800;
}

.metric-card.long-term {
  border-top: 4px solid #F44336;
}

.metric-title {
  font-size: 1.1em;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.metric-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.metric-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  font-size: 0.95em;
  color: #555;
}

.metric-checkbox {
  margin-top: 3px;
  flex-shrink: 0;
}

/* 总结与鼓励 */
.encouragement {
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  border-radius: 15px;
  padding: 30px;
  color: white;
  box-shadow: 0 8px 25px rgba(13, 33, 55, 0.3);
}

.encouragement .section-title {
  color: white;
  border-bottom-color: rgba(255, 255, 255, 0.3);
}

.enc-text {
  font-size: 1em;
  line-height: 1.8;
  margin-bottom: 15px;
}

.enc-list {
  list-style: none;
  padding: 0;
  margin: 15px 0;
}

.enc-list li {
  padding: 8px 0;
  font-size: 1em;
  line-height: 1.6;
}

.enc-final {
  font-size: 1.2em;
  font-weight: 600;
  text-align: center;
  margin-top: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .grammar-diagnosis {
    padding: 15px;
  }
  
  .overall-assessment {
    grid-template-columns: 1fr;
  }
  
  .test-results {
    grid-template-columns: 1fr;
  }
  
  .strength-cards,
  .advice-cards,
  .ai-tips-grid,
  .plan-timeline,
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .table-header {
    display: none;
  }
}
</style>
