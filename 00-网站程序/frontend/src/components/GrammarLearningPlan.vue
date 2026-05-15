<template>
  <div class="grammar-learning-plan">
    <div class="plan-header">
      <h2 class="plan-title"> 语法2周强化计划</h2>
      <p class="plan-subtitle">2026-05-05 ~ 2026-05-18 | 目标：从60-70分提升到80-85分</p>
      <div class="plan-stats">
        <div class="stat-item">
          <div class="stat-value">2周</div>
          <div class="stat-label">总时长</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">2.5h</div>
          <div class="stat-label">每日学习</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">+20-25分</div>
          <div class="stat-label">目标提升</div>
        </div>
      </div>
    </div>

    <!-- 当前进度 -->
    <div class="current-progress">
      <div class="progress-header">
        <h3>📊 当前学习进度</h3>
        <div class="progress-info">
          <span>第 {{ currentWeek }} 周 / 共 2 周</span>
          <span>第 {{ currentDay }} 天</span>
        </div>
      </div>
      <el-progress 
        :percentage="overallProgress" 
        :stroke-width="20"
        :color="progressColor"
      />
      <div class="progress-detail">
        <span>已完成: {{ completedDays }} / {{ totalDays }} 天</span>
        <span>完成率: {{ overallProgress }}%</span>
      </div>
    </div>

    <!-- 学习阶段标签页 -->
    <div class="phase-tabs">
      <el-tabs v-model="activePhase" type="border-card">
        <!-- 第1周：核心语法突破 -->
        <el-tab-pane label="第1周：核心语法" name="week1">
          <div class="phase-content">
            <div class="phase-overview">
              <h3>📚 第1周：核心语法突破</h3>
              <div class="phase-info-grid">
                <div class="info-item">
                  <div class="info-label">🎯 重点内容</div>
                  <div class="info-value">长难句 + 虚拟语气 + 非谓语动词</div>
                </div>
                <div class="info-item">
                  <div class="info-label">⏰ 每日时间</div>
                  <div class="info-value">2.5小时</div>
                </div>
                <div class="info-item">
                  <div class="info-label">📈 预期成果</div>
                  <div class="info-value">掌握三大核心语法，能分析复杂句子</div>
                </div>
              </div>
            </div>

            <div class="weekly-plans">
              <div class="week-plan">
                <h4 class="week-title">第1周（Day 1-7）：核心语法强化</h4>
                <div class="daily-plans">
                  <div v-for="day in week1Plans" :key="day.day" 
                       class="day-plan"
                       :class="{ 'completed': day.completed, 'today': day.isToday }">
                    <div class="day-header">
                      <div class="day-info">
                        <div class="day-number">Day {{ day.day }}</div>
                        <div class="day-date">{{ day.date }}</div>
                      </div>
                      <input 
                        type="checkbox" 
                        :checked="day.completed"
                        @change="toggleDayComplete('week1', day.day)"
                        class="day-checkbox"
                      />
                    </div>
                    <div class="day-tasks">
                      <div v-for="(task, idx) in day.tasks" :key="idx" class="task-item">
                        <div class="task-time">{{ task.time }}</div>
                        <div class="task-content">{{ task.content }}</div>
                      </div>
                    </div>
                    <div v-if="day.aiTemplate" class="ai-template">
                      🤖 {{ day.aiTemplate }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 第2周：进阶语法+实战 -->
        <el-tab-pane label="第2周：进阶实战" name="week2">
          <div class="phase-content">
            <div class="phase-overview">
              <h3>🎯 第2周：进阶语法+实战</h3>
              <div class="phase-info-grid">
                <div class="info-item">
                  <div class="info-label">🎯 重点内容</div>
                  <div class="info-value">倒装句 + 独立主格 + 真题模拟</div>
                </div>
                <div class="info-item">
                  <div class="info-label">⏰ 每日时间</div>
                  <div class="info-value">2.5小时</div>
                </div>
                <div class="info-item">
                  <div class="info-label">📈 预期成果</div>
                  <div class="info-value">语法部分达80-85分，写作能用高级语法</div>
                </div>
              </div>
            </div>

            <div class="weekly-plans">
              <div class="week-plan">
                <h4 class="week-title">第2周（Day 8-14）：进阶语法+综合测试</h4>
                <div class="daily-plans">
                  <div v-for="day in week2Plans" :key="day.day" 
                       class="day-plan"
                       :class="{ 'completed': day.completed, 'today': day.isToday }">
                    <div class="day-header">
                      <div class="day-info">
                        <div class="day-number">Day {{ day.day + 7 }}</div>
                        <div class="day-date">{{ day.date }}</div>
                      </div>
                      <input 
                        type="checkbox" 
                        :checked="day.completed"
                        @change="toggleDayComplete('week2', day.day)"
                        class="day-checkbox"
                      />
                    </div>
                    <div class="day-tasks">
                      <div v-for="(task, idx) in day.tasks" :key="idx" class="task-item">
                        <div class="task-time">{{ task.time }}</div>
                        <div class="task-content">{{ task.content }}</div>
                      </div>
                    </div>
                    <div v-if="day.aiTemplate" class="ai-template">
                      🤖 {{ day.aiTemplate }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 学习建议 -->
    <div class="study-tips">
      <h3>💡 学习建议</h3>
      <div class="tips-grid">
        <div class="tip-card">
          <div class="tip-icon"></div>
          <div class="tip-title">坚持每日学习</div>
          <div class="tip-content">即使只有15分钟，也要保持连续性。使用番茄工作法（25分钟学习 + 5分钟休息）</div>
        </div>
        <div class="tip-card">
          <div class="tip-icon"></div>
          <div class="tip-title">主动而非被动</div>
          <div class="tip-content">不要只看视频或读书，要主动分析句子、造句、总结</div>
        </div>
        <div class="tip-card">
          <div class="tip-icon"></div>
          <div class="tip-title">充分利用AI</div>
          <div class="tip-content">遇到不懂的立即问AI，让AI生成针对性练习，用AI检查写作中的语法</div>
        </div>
        <div class="tip-card">
          <div class="tip-icon">📝</div>
          <div class="tip-title">定期复盘</div>
          <div class="tip-content">每周末花30分钟回顾本周学习，使用模板10进行诊断，调整下周计划</div>
        </div>
        <div class="tip-card">
          <div class="tip-icon">📚</div>
          <div class="tip-title">真题导向</div>
          <div class="tip-content">所有练习都围绕考研真题，分析真题中的语法现象，理解出题规律</div>
        </div>
        <div class="tip-card">
          <div class="tip-icon">✅</div>
          <div class="tip-title">打卡激励</div>
          <div class="tip-content">每天完成学习后打卡，连续打卡7天、14天、30天都有奖励</div>
        </div>
      </div>
    </div>

    <!-- 预期成果 -->
    <div class="expected-outcomes">
      <h3> 预期成果</h3>
      <div class="outcomes-grid">
        <div class="outcome-item">
          <div class="outcome-icon">✅</div>
          <div class="outcome-text">快速提取长难句主干</div>
        </div>
        <div class="outcome-item">
          <div class="outcome-icon">✅</div>
          <div class="outcome-text">虚拟语气运用自如</div>
        </div>
        <div class="outcome-item">
          <div class="outcome-icon">✅</div>
          <div class="outcome-text">非谓语动词概念清晰</div>
        </div>
        <div class="outcome-item">
          <div class="outcome-icon">✅</div>
          <div class="outcome-text">倒装句识别准确</div>
        </div>
        <div class="outcome-item">
          <div class="outcome-icon">✅</div>
          <div class="outcome-text">独立主格理解透彻</div>
        </div>
        <div class="outcome-item">
          <div class="outcome-icon">✅</div>
          <div class="outcome-text">写作能使用高级语法</div>
        </div>
        <div class="outcome-item highlight">
          <div class="outcome-icon">🎯</div>
          <div class="outcome-text">语法部分得分80-85分</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activePhase = ref('week1')

// 计算当前周和天
const startDate = new Date('2026-05-05')
const today = new Date()
const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
const currentWeek = computed(() => Math.min(Math.floor(daysDiff / 7) + 1, 2))
const currentDay = computed(() => Math.min(daysDiff + 1, 14))

// 学习进度数据
const learningProgress = ref({
  week1: [false, false, false, false, false, false, false],
  week2: [false, false, false, false, false, false, false]
})

const completedDays = computed(() => {
  let count = 0
  for (const week of Object.values(learningProgress.value)) {
    count += week.filter(Boolean).length
  }
  return count
})

const totalDays = 14
const overallProgress = computed(() => {
  return Math.round((completedDays.value / totalDays) * 100)
})

const progressColor = computed(() => {
  if (overallProgress.value >= 80) return '#67C23A'
  if (overallProgress.value >= 50) return '#E6A23C'
  return '#409EFF'
})

// 切换天的完成状态
const toggleDayComplete = (week: string, day: number) => {
  const weekKey = week as keyof typeof learningProgress.value
  learningProgress.value[weekKey][day - 1] = !learningProgress.value[weekKey][day - 1]
}

// 生成日期
const generateDate = (dayOffset: number) => {
  const date = new Date(startDate)
  date.setDate(date.getDate() + dayOffset)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

// 第1周计划（每天不同语法点，不重复）
const week1Plans = ref([
  {
    day: 1,
    date: generateDate(0),
    completed: false,
    isToday: daysDiff === 0,
    tasks: [
      { time: '50分钟', content: '长难句分析方法论：四步法（找主干→找并列→找从句→去修饰）' },
      { time: '40分钟', content: '实战分析5个简单长难句，掌握找主干技巧' },
      { time: '30分钟', content: '整理笔记，总结四步法要点' }
    ],
    aiTemplate: '模板1：语法概念深度解释器 + 模板2：长难句拆解教练'
  },
  {
    day: 2,
    date: generateDate(1),
    completed: false,
    isToday: daysDiff === 1,
    tasks: [
      { time: '60分钟', content: '虚拟语气三种形式对比学习（现在/过去/将来事实相反）' },
      { time: '30分钟', content: '制作时态倒退规则表格' },
      { time: '30分钟', content: '完成15道基础练习' }
    ],
    aiTemplate: '模板1：语法概念深度解释器 + 模板6：个性化练习生成器'
  },
  {
    day: 3,
    date: generateDate(2),
    completed: false,
    isToday: daysDiff === 2,
    tasks: [
      { time: '60分钟', content: '非谓语动词入门：不定式、动名词、分词概念辨析' },
      { time: '30分钟', content: '制作三种非谓语对比表格' },
      { time: '30分钟', content: '完成15道基础练习' }
    ],
    aiTemplate: '模板1：语法概念深度解释器'
  },
  {
    day: 4,
    date: generateDate(3),
    completed: false,
    isToday: daysDiff === 3,
    tasks: [
      { time: '60分钟', content: '倒装句规则：完全倒装vs不完全倒装' },
      { time: '30分钟', content: '学习否定词/only/so等引起的倒装' },
      { time: '30分钟', content: '完成15道倒装句练习' }
    ],
    aiTemplate: '模板1：概念解释 + 模板6：练习生成'
  },
  {
    day: 5,
    date: generateDate(4),
    completed: false,
    isToday: daysDiff === 4,
    tasks: [
      { time: '60分钟', content: '独立主格结构：名词/代词+分词/形容词/介词短语' },
      { time: '30分钟', content: '对比独立主格和从句的区别' },
      { time: '30分钟', content: '完成15道独立主格练习' }
    ],
    aiTemplate: '模板1：概念解释 + 模板6：练习生成'
  },
  {
    day: 6,
    date: generateDate(5),
    completed: false,
    isToday: daysDiff === 5,
    tasks: [
      { time: '60分钟', content: '定语从句进阶：嵌套从句+多重修饰' },
      { time: '30分钟', content: '分析5个复杂定语从句真题例句' },
      { time: '30分钟', content: '整理定语从句高频考点' }
    ],
    aiTemplate: '模板2：长难句拆解教练'
  },
  {
    day: 7,
    date: generateDate(6),
    completed: false,
    isToday: daysDiff === 6,
    tasks: [
      { time: '60分钟', content: '状语从句+插入语：快速跳过修饰找主干' },
      { time: '30分钟', content: '分析5个含插入语的复杂句' },
      { time: '30分钟', content: '整理常见插入语类型' }
    ],
    aiTemplate: '模板2：长难句拆解教练'
  }
])

// 第2周计划（评估+针对性突破）
const week2Plans = ref([
  {
    day: 1,
    date: generateDate(7),
    completed: false,
    isToday: daysDiff === 7,
    tasks: [
      { time: '90分钟', content: '第1次全面评估测试（涵盖所有语法点）' },
      { time: '30分钟', content: '核对答案，分析错题' }
    ],
    aiTemplate: '模板10：学习进度诊断师'
  },
  {
    day: 2,
    date: generateDate(8),
    completed: false,
    isToday: daysDiff === 8,
    tasks: [
      { time: '60分钟', content: '针对评估薄弱点1进行专项突破' },
      { time: '30分钟', content: '完成20道专项练习' },
      { time: '30分钟', content: '总结规律，整理笔记' }
    ],
    aiTemplate: '模板6：个性化练习生成器'
  },
  {
    day: 3,
    date: generateDate(9),
    completed: false,
    isToday: daysDiff === 9,
    tasks: [
      { time: '60分钟', content: '针对评估薄弱点2进行专项突破' },
      { time: '30分钟', content: '完成20道专项练习' },
      { time: '30分钟', content: '总结规律，整理笔记' }
    ],
    aiTemplate: '模板6：个性化练习生成器'
  },
  {
    day: 4,
    date: generateDate(10),
    completed: false,
    isToday: daysDiff === 10,
    tasks: [
      { time: '60分钟', content: '针对评估薄弱点3进行专项突破' },
      { time: '30分钟', content: '完成20道专项练习' },
      { time: '30分钟', content: '总结规律，整理笔记' }
    ],
    aiTemplate: '模板6：个性化练习生成器'
  },
  {
    day: 5,
    date: generateDate(11),
    completed: false,
    isToday: daysDiff === 11,
    tasks: [
      { time: '60分钟', content: '写作实战：写一篇完整作文（运用所学语法）' },
      { time: '30分钟', content: '使用AI获取反馈并修改' },
      { time: '30分钟', content: '确保使用3种以上高级语法' }
    ],
    aiTemplate: '模板5：写作反馈 + 模板8：作文阅卷'
  },
  {
    day: 6,
    date: generateDate(12),
    completed: false,
    isToday: daysDiff === 12,
    tasks: [
      { time: '90分钟', content: '第2次评估测试（检验薄弱点是否解决）' },
      { time: '30分钟', content: '对比两次成绩，评估进步' }
    ],
    aiTemplate: '模板10：学习进度诊断师'
  },
  {
    day: 7,
    date: generateDate(13),
    completed: false,
    isToday: daysDiff === 13,
    tasks: [
      { time: '60分钟', content: '最后查漏补缺：针对仍存在的薄弱点' },
      { time: '30分钟', content: '制作语法知识点思维导图' },
      { time: '30分钟', content: '总结2周学习成果，制定后续计划' }
    ],
    aiTemplate: '模板9：知识卡片生成器 + 模板10：学习进度诊断师'
  }
])
</script>

<style scoped>
.grammar-learning-plan {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.plan-header {
  text-align: center;
  margin-bottom: 30px;
}

.plan-title {
  font-size: 2em;
  color: #333;
  margin-bottom: 10px;
}

.plan-subtitle {
  color: #666;
  font-size: 0.95em;
  margin-bottom: 20px;
}

.plan-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.stat-item {
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  text-align: center;
}

.stat-value {
  font-size: 1.8em;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9em;
  opacity: 0.9;
}

/* 当前进度 */
.current-progress {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.progress-header h3 {
  margin: 0;
  font-size: 1.3em;
  color: #333;
}

.progress-info {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 0.95em;
}

.progress-detail {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: #666;
  font-size: 0.9em;
}

/* 学习阶段标签页 */
.phase-tabs {
  margin-bottom: 30px;
}

.phase-content {
  padding: 20px;
}

.phase-overview {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
}

.phase-overview h3 {
  margin: 0 0 15px 0;
  font-size: 1.3em;
  color: #1976D2;
}

.phase-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.info-item {
  padding: 12px;
  background: white;
  border-radius: 8px;
}

.info-label {
  font-size: 0.85em;
  color: #666;
  margin-bottom: 5px;
}

.info-value {
  font-size: 1em;
  color: #333;
  font-weight: 600;
}

/* 周计划 */
.weekly-plans {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.week-plan {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.week-title {
  margin: 0 0 20px 0;
  font-size: 1.2em;
  color: #333;
  padding-bottom: 10px;
  border-bottom: 2px solid #667eea;
}

.daily-plans {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.day-plan {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.day-plan:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.day-plan.completed {
  background: #e8f5e9;
  border-left-color: #67C23A;
}

.day-plan.today {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-left-color: #FF9800;
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.2);
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.day-info {
  flex: 1;
}

.day-number {
  font-size: 1.1em;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.day-date {
  font-size: 0.85em;
  color: #666;
}

.day-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.day-tasks {
  margin-bottom: 10px;
}

.task-item {
  display: flex;
  gap: 10px;
  padding: 8px 0;
  font-size: 0.9em;
  border-bottom: 1px dashed #e0e0e0;
}

.task-item:last-child {
  border-bottom: none;
}

.task-time {
  color: #2196F3;
  font-weight: 600;
  white-space: nowrap;
  min-width: 60px;
}

.task-content {
  color: #555;
  line-height: 1.5;
}

.ai-template {
  padding: 8px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 6px;
  font-size: 0.85em;
  margin-top: 10px;
}

/* 学习建议 */
.study-tips {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.study-tips h3 {
  margin: 0 0 20px 0;
  font-size: 1.3em;
  color: #333;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.tip-card {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
}

.tip-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.tip-icon {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.tip-title {
  font-size: 1.1em;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.tip-content {
  font-size: 0.9em;
  color: #666;
  line-height: 1.6;
}

/* 预期成果 */
.expected-outcomes {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  padding: 30px;
  color: white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.expected-outcomes h3 {
  margin: 0 0 20px 0;
  font-size: 1.5em;
  text-align: center;
}

.outcomes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.outcome-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.outcome-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.outcome-item.highlight {
  background: rgba(255, 255, 255, 0.25);
  border: 2px solid white;
}

.outcome-icon {
  font-size: 1.5em;
}

.outcome-text {
  font-size: 0.95em;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .grammar-learning-plan {
    padding: 15px;
  }
  
  .plan-stats {
    grid-template-columns: 1fr;
  }
  
  .daily-plans {
    grid-template-columns: 1fr;
  }
  
  .phase-info-grid,
  .tips-grid,
  .outcomes-grid {
    grid-template-columns: 1fr;
  }
  
  .progress-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
