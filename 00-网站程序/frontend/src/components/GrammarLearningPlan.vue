<template>
  <div class="grammar-learning-plan">
    <div class="plan-header">
      <h2 class="plan-title"> 语法6周学习计划</h2>
      <p class="plan-subtitle">2026-05-05 ~ 2026-06-15 | 目标：从60-70分提升到80-85分</p>
      <div class="plan-stats">
        <div class="stat-item">
          <div class="stat-value">6周</div>
          <div class="stat-label">总时长</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">2-2.5h</div>
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
          <span>第 {{ currentWeek }} 周 / 共 6 周</span>
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
        <!-- 第1-2周：基础巩固期 -->
        <el-tab-pane label="第1-2周：基础巩固" name="phase1">
          <div class="phase-content">
            <div class="phase-overview">
              <h3>📚 第1-2周：基础巩固期</h3>
              <div class="phase-info-grid">
                <div class="info-item">
                  <div class="info-label">🎯 重点内容</div>
                  <div class="info-value">长难句分析 + 虚拟语气</div>
                </div>
                <div class="info-item">
                  <div class="info-label">⏰ 每日时间</div>
                  <div class="info-value">2小时</div>
                </div>
                <div class="info-item">
                  <div class="info-label">📈 预期成果</div>
                  <div class="info-value">掌握长难句拆解方法，虚拟语气运用自如</div>
                </div>
              </div>
            </div>

            <div class="weekly-plans">
              <!-- 第1周 -->
              <div class="week-plan">
                <h4 class="week-title">第1周：长难句入门 + 虚拟语气基础</h4>
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

              <!-- 第2周 -->
              <div class="week-plan">
                <h4 class="week-title">第2周：长难句进阶 + 虚拟语气强化</h4>
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

        <!-- 第3-4周：专项突破期 -->
        <el-tab-pane label="第3-4周：专项突破" name="phase2">
          <div class="phase-content">
            <div class="phase-overview">
              <h3> 第3-4周：专项突破期</h3>
              <div class="phase-info-grid">
                <div class="info-item">
                  <div class="info-label">🎯 重点内容</div>
                  <div class="info-value">非谓语动词 + 倒装句</div>
                </div>
                <div class="info-item">
                  <div class="info-label">⏰ 每日时间</div>
                  <div class="info-value">2小时</div>
                </div>
                <div class="info-item">
                  <div class="info-label">📈 预期成果</div>
                  <div class="info-value">非谓语概念清晰，倒装句识别准确</div>
                </div>
              </div>
            </div>

            <div class="weekly-plans">
              <!-- 第3周 -->
              <div class="week-plan">
                <h4 class="week-title">第3周：非谓语动词系统学习</h4>
                <div class="daily-plans">
                  <div v-for="day in week3Plans" :key="day.day" 
                       class="day-plan"
                       :class="{ 'completed': day.completed, 'today': day.isToday }">
                    <div class="day-header">
                      <div class="day-info">
                        <div class="day-number">Day {{ day.day + 14 }}</div>
                        <div class="day-date">{{ day.date }}</div>
                      </div>
                      <input 
                        type="checkbox" 
                        :checked="day.completed"
                        @change="toggleDayComplete('week3', day.day)"
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

              <!-- 第4周 -->
              <div class="week-plan">
                <h4 class="week-title">第4周：倒装句规则掌握</h4>
                <div class="daily-plans">
                  <div v-for="day in week4Plans" :key="day.day" 
                       class="day-plan"
                       :class="{ 'completed': day.completed, 'today': day.isToday }">
                    <div class="day-header">
                      <div class="day-info">
                        <div class="day-number">Day {{ day.day + 21 }}</div>
                        <div class="day-date">{{ day.date }}</div>
                      </div>
                      <input 
                        type="checkbox" 
                        :checked="day.completed"
                        @change="toggleDayComplete('week4', day.day)"
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

        <!-- 第5-6周：综合提升期 -->
        <el-tab-pane label="第5-6周：综合提升" name="phase3">
          <div class="phase-content">
            <div class="phase-overview">
              <h3>🎯 第5-6周：综合提升期</h3>
              <div class="phase-info-grid">
                <div class="info-item">
                  <div class="info-label"> 重点内容</div>
                  <div class="info-value">独立主格 + 综合应用 + 写作实践</div>
                </div>
                <div class="info-item">
                  <div class="info-label">⏰ 每日时间</div>
                  <div class="info-value">2.5小时</div>
                </div>
                <div class="info-item">
                  <div class="info-label">📈 预期成果</div>
                  <div class="info-value">写作能使用高级语法，语法部分达80-85分</div>
                </div>
              </div>
            </div>

            <div class="weekly-plans">
              <!-- 第5周 -->
              <div class="week-plan">
                <h4 class="week-title">第5周：独立主格 + 写作应用</h4>
                <div class="daily-plans">
                  <div v-for="day in week5Plans" :key="day.day" 
                       class="day-plan"
                       :class="{ 'completed': day.completed, 'today': day.isToday }">
                    <div class="day-header">
                      <div class="day-info">
                        <div class="day-number">Day {{ day.day + 28 }}</div>
                        <div class="day-date">{{ day.date }}</div>
                      </div>
                      <input 
                        type="checkbox" 
                        :checked="day.completed"
                        @change="toggleDayComplete('week5', day.day)"
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

              <!-- 第6周 -->
              <div class="week-plan">
                <h4 class="week-title">第6周：综合复习 + 模拟测试</h4>
                <div class="daily-plans">
                  <div v-for="day in week6Plans" :key="day.day" 
                       class="day-plan"
                       :class="{ 'completed': day.completed, 'today': day.isToday }">
                    <div class="day-header">
                      <div class="day-info">
                        <div class="day-number">Day {{ day.day + 35 }}</div>
                        <div class="day-date">{{ day.date }}</div>
                      </div>
                      <input 
                        type="checkbox" 
                        :checked="day.completed"
                        @change="toggleDayComplete('week6', day.day)"
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

const activePhase = ref('phase1')

// 计算当前周和天
const startDate = new Date('2026-05-05')
const today = new Date()
const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
const currentWeek = computed(() => Math.min(Math.floor(daysDiff / 7) + 1, 6))
const currentDay = computed(() => Math.min(daysDiff + 1, 42))

// 学习进度数据
const learningProgress = ref({
  week1: [false, false, false, false, false, false, false],
  week2: [false, false, false, false, false, false, false],
  week3: [false, false, false, false, false, false, false],
  week4: [false, false, false, false, false, false, false],
  week5: [false, false, false, false, false, false, false],
  week6: [false, false, false, false, false, false, false]
})

const completedDays = computed(() => {
  let count = 0
  for (const week of Object.values(learningProgress.value)) {
    count += week.filter(Boolean).length
  }
  return count
})

const totalDays = 42
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

// 第1周计划
const week1Plans = ref([
  {
    day: 1,
    date: generateDate(0),
    completed: false,
    isToday: daysDiff === 0,
    tasks: [
      { time: '30分钟', content: '使用AI语法助手模板1学习长难句分析方法论' },
      { time: '30分钟', content: '学习"四步法"：找主干→找并列→找从句→去修饰' },
      { time: '30分钟', content: '使用模板2分析5个简单长难句' },
      { time: '30分钟', content: '整理笔记，总结今天学到的方法' }
    ],
    aiTemplate: '模板1：语法概念深度解释器 + 模板2：长难句拆解教练'
  },
  {
    day: 2,
    date: generateDate(1),
    completed: false,
    isToday: daysDiff === 1,
    tasks: [
      { time: '40分钟', content: '虚拟语气三种形式对比学习（现在/过去/将来）' },
      { time: '40分钟', content: '制作时态倒退规则表格+完成20道综合练习' },
      { time: '40分钟', content: '核对答案，分析错误原因，总结规律' }
    ],
    aiTemplate: '模板1：语法概念深度解释器 + 模板6：个性化练习生成器'
  },
  {
    day: 3,
    date: generateDate(2),
    completed: false,
    isToday: daysDiff === 2,
    tasks: [
      { time: '40分钟', content: '长难句实战：分析5个含定语从句的复杂句' },
      { time: '40分钟', content: '重点练习"找从句"和"去修饰"步骤' },
      { time: '40分钟', content: '整理定语从句嵌套技巧+错题笔记' }
    ],
    aiTemplate: '模板2：长难句拆解教练'
  },
  {
    day: 4,
    date: generateDate(3),
    completed: false,
    isToday: daysDiff === 3,
    tasks: [
      { time: '40分钟', content: '虚拟语气真题实战：完成30道考研真题' },
      { time: '40分钟', content: '分析出题规律，总结高频考点' },
      { time: '40分钟', content: '整理常见错误类型+易混淆点' }
    ],
    aiTemplate: '模板6：个性化练习生成器'
  },
  {
    day: 5,
    date: generateDate(4),
    completed: false,
    isToday: daysDiff === 4,
    tasks: [
      { time: '40分钟', content: '长难句进阶：分析5个含状语从句+插入语的复杂句' },
      { time: '40分钟', content: '练习快速跳过插入语找主干的技巧' },
      { time: '40分钟', content: '整理状语从句类型+常见插入语' }
    ],
    aiTemplate: '模板2：长难句拆解教练'
  },
  {
    day: 6,
    date: generateDate(5),
    completed: false,
    isToday: daysDiff === 5,
    tasks: [
      { time: '40分钟', content: '虚拟语气写作应用：写一段含虚拟语气的作文' },
      { time: '40分钟', content: '用AI获取写作反馈并修改完善' },
      { time: '40分钟', content: '总结虚拟语气在写作中的高分句型' }
    ],
    aiTemplate: '模板5：写作反馈 + 模板8：作文阅卷'
  },
  {
    day: 7,
    date: generateDate(6),
    completed: false,
    isToday: daysDiff === 6,
    tasks: [
      { time: '30分钟', content: '复习本周所有内容' },
      { time: '30分钟', content: '完成10道综合测试题' },
      { time: '30分钟', content: '使用模板10诊断本周学习进度' },
      { time: '30分钟', content: '制定下周学习计划' }
    ],
    aiTemplate: '模板10：学习进度诊断师'
  }
])

// 第2周计划
const week2Plans = ref([
  {
    day: 1,
    date: generateDate(7),
    completed: false,
    isToday: daysDiff === 7,
    tasks: [
      { time: '40分钟', content: '长难句真题实战：分析5个阅读真题长难句' },
      { time: '40分钟', content: '应用"四步法"完整分析+翻译句子' },
      { time: '40分钟', content: '整理阅读中长难句的出题特点' }
    ],
    aiTemplate: '模板2：长难句拆解教练'
  },
  {
    day: 2,
    date: generateDate(8),
    completed: false,
    isToday: daysDiff === 8,
    tasks: [
      { time: '40分钟', content: '虚拟语气综合测试：完成40道真题' },
      { time: '40分钟', content: '分析错题，总结三种形式的易混点' },
      { time: '40分钟', content: '制作虚拟语气思维导图（模板9）' }
    ],
    aiTemplate: '模板6：个性化练习生成器 + 模板9：知识卡片生成器'
  },
  {
    day: 3,
    date: generateDate(9),
    completed: false,
    isToday: daysDiff === 9,
    tasks: [
      { time: '40分钟', content: '非谓语动词入门：学习不定式、动名词、分词概念' },
      { time: '40分钟', content: '澄清三种非谓语的核心功能差异' },
      { time: '40分钟', content: '制作对比表格+完成15道基础练习' }
    ],
    aiTemplate: '模板1：语法概念深度解释器'
  },
  {
    day: 4,
    date: generateDate(10),
    completed: false,
    isToday: daysDiff === 10,
    tasks: [
      { time: '40分钟', content: '非谓语动词专项：不定式用法详解' },
      { time: '40分钟', content: '完成20道不定式练习+整理常见搭配' },
      { time: '40分钟', content: '总结错题规律' }
    ],
    aiTemplate: '模板1：概念解释 + 模板6：练习生成'
  },
  {
    day: 5,
    date: generateDate(11),
    completed: false,
    isToday: daysDiff === 11,
    tasks: [
      { time: '40分钟', content: '非谓语动词专项：动名词vs不定式对比' },
      { time: '40分钟', content: '完成20道对比练习+整理动词后接规则' },
      { time: '40分钟', content: '总结易混淆点' }
    ],
    aiTemplate: '模板1：概念解释 + 模板6：练习生成'
  },
  {
    day: 6,
    date: generateDate(12),
    completed: false,
    isToday: daysDiff === 12,
    tasks: [
      { time: '40分钟', content: '非谓语动词专项：分词（现在/过去）用法' },
      { time: '40分钟', content: '理解主动/被动关系+完成20道练习' },
      { time: '40分钟', content: '整理分词作定语、状语的用法' }
    ],
    aiTemplate: '模板1：概念解释 + 模板6：练习生成'
  },
  {
    day: 7,
    date: generateDate(13),
    completed: false,
    isToday: daysDiff === 13,
    tasks: [
      { time: '40分钟', content: '复习第1-2周所有内容（长难句+虚拟语气）' },
      { time: '40分钟', content: '完成30道综合测试题' },
      { time: '40分钟', content: '使用模板10诊断学习进度+制定第3周计划' }
    ],
    aiTemplate: '模板10：学习进度诊断师'
  }
])

// 第3周计划
const week3Plans = ref([
  {
    day: 1,
    date: generateDate(14),
    completed: false,
    isToday: daysDiff === 14,
    tasks: [
      { time: '30分钟', content: '使用模板1学习非谓语动词概念（不定式、动名词、分词）' },
      { time: '30分钟', content: '澄清三种非谓语动词的核心功能差异' },
      { time: '30分钟', content: '制作对比表格' },
      { time: '30分钟', content: '完成10道基础练习' }
    ],
    aiTemplate: '模板1：语法概念深度解释器'
  },
  {
    day: 2,
    date: generateDate(15),
    completed: false,
    isToday: daysDiff === 15,
    tasks: [
      { time: '30分钟', content: '深入学习不定式的用法' },
      { time: '30分钟', content: '完成15道不定式专项练习' },
      { time: '30分钟', content: '整理不定式常见搭配' },
      { time: '30分钟', content: '总结错题' }
    ],
    aiTemplate: '模板1：概念解释 + 模板6：练习生成'
  },
  {
    day: 3,
    date: generateDate(16),
    completed: false,
    isToday: daysDiff === 16,
    tasks: [
      { time: '30分钟', content: '深入学习动名词的用法' },
      { time: '30分钟', content: '对比不定式和动名词的区别' },
      { time: '30分钟', content: '完成15道动名词练习' },
      { time: '30分钟', content: '整理常见动词后接动名词的情况' }
    ],
    aiTemplate: '模板1：概念解释 + 模板6：练习生成'
  },
  {
    day: 4,
    date: generateDate(17),
    completed: false,
    isToday: daysDiff === 17,
    tasks: [
      { time: '30分钟', content: '深入学习分词（现在分词、过去分词）' },
      { time: '30分钟', content: '理解分词的主动/被动关系' },
      { time: '30分钟', content: '完成15道分词练习' },
      { time: '30分钟', content: '整理分词作定语、状语的用法' }
    ],
    aiTemplate: '模板1：概念解释 + 模板6：练习生成'
  },
  {
    day: 5,
    date: generateDate(18),
    completed: false,
    isToday: daysDiff === 18,
    tasks: [
      { time: '30分钟', content: '非谓语动词综合复习' },
      { time: '30分钟', content: '完成30道综合练习' },
      { time: '30分钟', content: '分析错题，总结规律' },
      { time: '30分钟', content: '整理高频考点' }
    ],
    aiTemplate: '模板6：个性化练习生成器'
  },
  {
    day: 6,
    date: generateDate(19),
    completed: false,
    isToday: daysDiff === 19,
    tasks: [
      { time: '30分钟', content: '非谓语动词在真题中的应用' },
      { time: '30分钟', content: '分析10个真题例句' },
      { time: '30分钟', content: '理解出题规律' },
      { time: '30分钟', content: '整理笔记' }
    ],
    aiTemplate: '模板3：平行文本分析'
  },
  {
    day: 7,
    date: generateDate(20),
    completed: false,
    isToday: daysDiff === 20,
    tasks: [
      { time: '30分钟', content: '复习本周非谓语动词内容' },
      { time: '30分钟', content: '完成20道测试题' },
      { time: '30分钟', content: '使用模板10诊断进度' },
      { time: '30分钟', content: '制定下周计划' }
    ],
    aiTemplate: '模板10：学习进度诊断师'
  }
])

// 第4周计划
const week4Plans = ref([
  {
    day: 1,
    date: generateDate(21),
    completed: false,
    isToday: daysDiff === 21,
    tasks: [
      { time: '30分钟', content: '使用模板1学习倒装句概念' },
      { time: '30分钟', content: '理解完全倒装和不完全倒装的区别' },
      { time: '30分钟', content: '整理常见倒装触发词' },
      { time: '30分钟', content: '完成10道基础练习' }
    ],
    aiTemplate: '模板1：语法概念深度解释器'
  },
  {
    day: 2,
    date: generateDate(22),
    completed: false,
    isToday: daysDiff === 22,
    tasks: [
      { time: '30分钟', content: '学习否定词引起的倒装（never, hardly, seldom等）' },
      { time: '30分钟', content: '完成15道专项练习' },
      { time: '30分钟', content: '整理句型结构' },
      { time: '30分钟', content: '总结规律' }
    ],
    aiTemplate: '模板1：概念解释 + 模板6：练习生成'
  },
  {
    day: 3,
    date: generateDate(23),
    completed: false,
    isToday: daysDiff === 23,
    tasks: [
      { time: '30分钟', content: '学习only引起的倒装' },
      { time: '30分钟', content: '学习so/neither/nor引起的倒装' },
      { time: '30分钟', content: '完成15道练习' },
      { time: '30分钟', content: '对比不同触发词的区别' }
    ],
    aiTemplate: '模板1：概念解释 + 模板6：练习生成'
  },
  {
    day: 4,
    date: generateDate(24),
    completed: false,
    isToday: daysDiff === 24,
    tasks: [
      { time: '30分钟', content: '学习here/there/now/then引起的完全倒装' },
      { time: '30分钟', content: '理解完全倒装的语序' },
      { time: '30分钟', content: '完成15道练习' },
      { time: '30分钟', content: '整理完全倒装句型' }
    ],
    aiTemplate: '模板1：概念解释 + 模板6：练习生成'
  },
  {
    day: 5,
    date: generateDate(25),
    completed: false,
    isToday: daysDiff === 25,
    tasks: [
      { time: '30分钟', content: '倒装句综合复习' },
      { time: '30分钟', content: '完成30道综合练习' },
      { time: '30分钟', content: '分析错题，总结规律' },
      { time: '30分钟', content: '整理高频考点' }
    ],
    aiTemplate: '模板6：个性化练习生成器'
  },
  {
    day: 6,
    date: generateDate(26),
    completed: false,
    isToday: daysDiff === 26,
    tasks: [
      { time: '30分钟', content: '倒装句在真题中的应用' },
      { time: '30分钟', content: '分析10个真题例句' },
      { time: '30分钟', content: '理解出题规律' },
      { time: '30分钟', content: '整理笔记' }
    ],
    aiTemplate: '模板3：平行文本分析'
  },
  {
    day: 7,
    date: generateDate(27),
    completed: false,
    isToday: daysDiff === 27,
    tasks: [
      { time: '30分钟', content: '复习第3-4周内容' },
      { time: '30分钟', content: '完成20道测试题' },
      { time: '30分钟', content: '使用模板10诊断进度' },
      { time: '30分钟', content: '制定第5周计划' }
    ],
    aiTemplate: '模板10：学习进度诊断师'
  }
])

// 第5周计划
const week5Plans = ref([
  {
    day: 1,
    date: generateDate(28),
    completed: false,
    isToday: daysDiff === 28,
    tasks: [
      { time: '30分钟', content: '使用模板1学习独立主格结构' },
      { time: '30分钟', content: '理解"名词/代词+分词/形容词/介词短语"结构' },
      { time: '30分钟', content: '完成10道基础练习' },
      { time: '30分钟', content: '整理独立主格句型' }
    ],
    aiTemplate: '模板1：语法概念深度解释器'
  },
  {
    day: 2,
    date: generateDate(29),
    completed: false,
    isToday: daysDiff === 29,
    tasks: [
      { time: '30分钟', content: '深入学习独立主格的用法' },
      { time: '30分钟', content: '对比独立主格和从句的区别' },
      { time: '30分钟', content: '完成15道练习' },
      { time: '30分钟', content: '总结使用场景' }
    ],
    aiTemplate: '模板1：概念解释 + 模板6：练习生成'
  },
  {
    day: 3,
    date: generateDate(30),
    completed: false,
    isToday: daysDiff === 30,
    tasks: [
      { time: '30分钟', content: '高级语法在写作中的应用' },
      { time: '30分钟', content: '用模板5写一篇含高级语法的作文' },
      { time: '30分钟', content: '用模板8获取写作反馈' },
      { time: '30分钟', content: '修改并完善作文' }
    ],
    aiTemplate: '模板5：写作反馈 + 模板8：作文阅卷'
  },
  {
    day: 4,
    date: generateDate(31),
    completed: false,
    isToday: daysDiff === 31,
    tasks: [
      { time: '30分钟', content: '综合语法复习（长难句+虚拟语气+非谓语）' },
      { time: '30分钟', content: '完成30道综合练习' },
      { time: '30分钟', content: '分析错题' },
      { time: '30分钟', content: '整理薄弱环节' }
    ],
    aiTemplate: '模板6：个性化练习生成器'
  },
  {
    day: 5,
    date: generateDate(32),
    completed: false,
    isToday: daysDiff === 32,
    tasks: [
      { time: '30分钟', content: '综合语法复习（倒装句+独立主格）' },
      { time: '30分钟', content: '完成30道综合练习' },
      { time: '30分钟', content: '分析错题' },
      { time: '30分钟', content: '整理薄弱环节' }
    ],
    aiTemplate: '模板6：个性化练习生成器'
  },
  {
    day: 6,
    date: generateDate(33),
    completed: false,
    isToday: daysDiff === 33,
    tasks: [
      { time: '45分钟', content: '写作实战：写一篇完整的作文' },
      { time: '45分钟', content: '使用模板5和模板8获取反馈' },
      { time: '30分钟', content: '修改作文，运用高级语法' }
    ],
    aiTemplate: '模板5：写作反馈 + 模板8：作文阅卷'
  },
  {
    day: 7,
    date: generateDate(34),
    completed: false,
    isToday: daysDiff === 34,
    tasks: [
      { time: '30分钟', content: '复习第5周内容' },
      { time: '30分钟', content: '完成20道测试题' },
      { time: '30分钟', content: '使用模板10诊断进度' },
      { time: '30分钟', content: '制定第6周计划' }
    ],
    aiTemplate: '模板10：学习进度诊断师'
  }
])

// 第6周计划
const week6Plans = ref([
  {
    day: 1,
    date: generateDate(35),
    completed: false,
    isToday: daysDiff === 35,
    tasks: [
      { time: '30分钟', content: '全面复习所有语法知识点' },
      { time: '30分钟', content: '制作知识点思维导图（模板9）' },
      { time: '30分钟', content: '整理高频考点' },
      { time: '30分钟', content: '复习错题本' }
    ],
    aiTemplate: '模板9：知识卡片生成器'
  },
  {
    day: 2,
    date: generateDate(36),
    completed: false,
    isToday: daysDiff === 36,
    tasks: [
      { time: '60分钟', content: '第1次真题模拟测试（语法部分）' },
      { time: '30分钟', content: '核对答案' },
      { time: '30分钟', content: '分析错题，找出薄弱点' }
    ],
    aiTemplate: '模板10：学习进度诊断师'
  },
  {
    day: 3,
    date: generateDate(37),
    completed: false,
    isToday: daysDiff === 37,
    tasks: [
      { time: '30分钟', content: '针对薄弱点进行专项练习' },
      { time: '30分钟', content: '完成30道专项练习' },
      { time: '30分钟', content: '总结错题规律' },
      { time: '30分钟', content: '整理笔记' }
    ],
    aiTemplate: '模板6：个性化练习生成器'
  },
  {
    day: 4,
    date: generateDate(38),
    completed: false,
    isToday: daysDiff === 38,
    tasks: [
      { time: '60分钟', content: '第2次真题模拟测试（语法部分）' },
      { time: '30分钟', content: '核对答案' },
      { time: '30分钟', content: '对比两次测试成绩，评估进步' }
    ],
    aiTemplate: '模板10：学习进度诊断师'
  },
  {
    day: 5,
    date: generateDate(39),
    completed: false,
    isToday: daysDiff === 39,
    tasks: [
      { time: '30分钟', content: '写作实战：写一篇完整的作文' },
      { time: '45分钟', content: '使用AI获取反馈并修改' },
      { time: '45分钟', content: '完善作文，确保使用3种以上高级语法' }
    ],
    aiTemplate: '模板5：写作反馈 + 模板8：作文阅卷'
  },
  {
    day: 6,
    date: generateDate(40),
    completed: false,
    isToday: daysDiff === 40,
    tasks: [
      { time: '30分钟', content: '最后复习所有知识点' },
      { time: '30分钟', content: '复习错题本' },
      { time: '30分钟', content: '使用模板10进行最终诊断' },
      { time: '30分钟', content: '总结6周学习成果' }
    ],
    aiTemplate: '模板10：学习进度诊断师'
  },
  {
    day: 7,
    date: generateDate(41),
    completed: false,
    isToday: daysDiff === 41,
    tasks: [
      { time: '30分钟', content: '庆祝完成6周学习计划！' },
      { time: '30分钟', content: '制定下一阶段学习计划' },
      { time: '60分钟', content: '放松休息，准备新的开始' }
    ],
    aiTemplate: '模板10：学习进度诊断师'
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
