<template>
  <div class="english-study-plan">
    <div class="plan-header">
      <h2 class="plan-title">📘 英语一考研学习计划</h2>
      <p class="plan-subtitle">八哥老师 27考研英语一/二 全程班 | B站 直播+回放</p>
    </div>

    <!-- 总体进度概览 -->
    <div class="progress-overview">
      <div class="progress-stats">
        <div class="stat-card">
          <div class="stat-number">{{ completedPhases }}/{{ totalPhases }}</div>
          <div class="stat-label">完成阶段</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ completedLessons }}/{{ totalLessons }}</div>
          <div class="stat-label">完成课时</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ overallProgress }}%</div>
          <div class="stat-label">总体进度</div>
        </div>
      </div>
    </div>

    <!-- 学习阶段详情 -->
    <div class="phases-container">
      <!-- 基础阶段 -->
      <div class="phase-card" :class="{ 'completed': phaseStatus.fundamental.completed }">
        <div class="phase-header" @click="togglePhase('fundamental')">
          <div class="phase-info">
            <h3>📚 基础阶段</h3>
            <p class="phase-time">开始 —— 6月</p>
            <div class="phase-progress">
              <el-progress 
                :percentage="phaseStatus.fundamental.progress" 
                :stroke-width="8"
                :show-text="false"
              />
              <span class="progress-text">{{ phaseStatus.fundamental.progress }}%</span>
            </div>
          </div>
          <el-icon class="expand-icon" :class="{ 'expanded': expandedPhases.fundamental }">
            <ArrowDown />
          </el-icon>
        </div>
        
        <div class="phase-content" v-show="expandedPhases.fundamental">
          <div class="lesson-list">
            <div 
              v-for="lesson in fundamentalLessons" 
              :key="lesson.id"
              class="lesson-item"
              :class="{ 'completed': lesson.completed }"
            >
              <div class="lesson-main">
                <input 
                  type="checkbox" 
                  :checked="lesson.completed"
                  @change="toggleLesson('fundamental', lesson.id)"
                  class="custom-checkbox"
                />
                <div class="lesson-content">
                  <h4 class="lesson-title">{{ lesson.title }}</h4>
                  <p class="lesson-desc">{{ lesson.description }}</p>
                  
                  <!-- 词汇1800子项 -->
                  <div v-if="lesson.subItems && lesson.id === 1" class="lesson-subitems">
                    <div v-for="(item, idx) in lesson.subItems" :key="idx" class="subitem">
                      <span class="subitem-name">{{ item.name }}</span>
                      <span class="subitem-count">{{ (item as SubItemWithStatus).count }}</span>
                      <span v-if="'status' in item" class="subitem-status"> {{ (item as SubItemWithStatus).status }}</span>
                    </div>
                  </div>
                  
                  <!-- 词汇进度备注 -->
                  <div v-if="lesson.note" class="lesson-note">
                    📱 {{ lesson.note }}
                  </div>
                  
                  <!-- 长难句四步法子项 -->
                  <div v-if="lesson.subItems && lesson.id === 3" class="lesson-steps">
                    <div v-for="(step, idx) in lesson.subItems" :key="idx" class="step-item">
                      <span class="step-name">{{ step.name }}</span>
                      <span class="step-detail">{{ (step as SubItemWithDetail).detail }}</span>
                    </div>
                  </div>
                  
                  <!-- 年份范围和篇数 -->
                  <div v-if="lesson.yearRange" class="lesson-year-info">
                    <span v-if="lesson.passageCount">📖 {{ lesson.passageCount }}篇精读</span>
                    <span v-if="lesson.steps">📝 {{ lesson.steps.join(' → ') }}</span>
                  </div>
                  
                  <div class="lesson-meta">
                    <span class="duration">⏱️ {{ lesson.duration }}</span>
                    <span class="type" :class="lesson.type">{{ lesson.type }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 暑期强化阶段 -->
      <div class="phase-card" :class="{ 'completed': phaseStatus.summer.completed }">
        <div class="phase-header" @click="togglePhase('summer')">
          <div class="phase-info">
            <h3>🔥 暑期强化阶段</h3>
            <p class="phase-time">7月 —— 9月</p>
            <div class="phase-progress">
              <el-progress 
                :percentage="phaseStatus.summer.progress" 
                :stroke-width="8"
                :show-text="false"
              />
              <span class="progress-text">{{ phaseStatus.summer.progress }}%</span>
            </div>
          </div>
          <el-icon class="expand-icon" :class="{ 'expanded': expandedPhases.summer }">
            <ArrowDown />
          </el-icon>
        </div>
        
        <div class="phase-content" v-show="expandedPhases.summer">
          <div class="lesson-list">
            <div 
              v-for="lesson in summerLessons" 
              :key="lesson.id"
              class="lesson-item"
              :class="{ 'completed': lesson.completed }"
            >
              <div class="lesson-main">
                <input 
                  type="checkbox" 
                  :checked="lesson.completed"
                  @change="toggleLesson('summer', lesson.id)"
                  class="custom-checkbox"
                />
                <div class="lesson-content">
                  <h4 class="lesson-title">{{ lesson.title }}</h4>
                  <p class="lesson-desc">{{ lesson.description }}</p>
                  
                  <!-- 直播+录播内容详情 -->
                  <div v-if="lesson.liveContent" class="lesson-content-detail">
                    <div class="content-item live">
                      <span class="content-label">🔴 直播：</span>
                      <span>{{ lesson.liveContent }}</span>
                    </div>
                    <div class="content-item recorded">
                      <span class="content-label"> 录播：</span>
                      <span>{{ lesson.recordedContent }}</span>
                    </div>
                  </div>
                  
                  <!-- 写作特色标记 -->
                  <div v-if="lesson.features" class="lesson-features">
                    <span v-for="feature in lesson.features" :key="feature" class="feature-tag">
                      ✨ {{ feature }}
                    </span>
                  </div>
                  
                  <div class="lesson-meta">
                    <span class="duration">⏱️ {{ lesson.duration }}</span>
                    <span class="type" :class="lesson.type">{{ lesson.type }}</span>
                    <span v-if="lesson.highlight" class="highlight-badge">🌟 重点</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 冲刺模拟阶段 -->
      <div class="phase-card" :class="{ 'completed': phaseStatus.final.completed }">
        <div class="phase-header" @click="togglePhase('final')">
          <div class="phase-info">
            <h3>🎯 冲刺模拟阶段</h3>
            <p class="phase-time">10月 —— 12月底 考前</p>
            <div class="phase-progress">
              <el-progress 
                :percentage="phaseStatus.final.progress" 
                :stroke-width="8"
                :show-text="false"
              />
              <span class="progress-text">{{ phaseStatus.final.progress }}%</span>
            </div>
          </div>
          <el-icon class="expand-icon" :class="{ 'expanded': expandedPhases.final }">
            <ArrowDown />
          </el-icon>
        </div>
        
        <div class="phase-content" v-show="expandedPhases.final">
          <div class="lesson-list">
            <div 
              v-for="lesson in finalLessons" 
              :key="lesson.id"
              class="lesson-item"
              :class="{ 'completed': lesson.completed }"
            >
              <div class="lesson-main">
                <input 
                  type="checkbox" 
                  :checked="lesson.completed"
                  @change="toggleLesson('final', lesson.id)"
                  class="custom-checkbox"
                />
                <div class="lesson-content">
                  <h4 class="lesson-title">{{ lesson.title }}</h4>
                  <p class="lesson-desc">{{ lesson.description }}</p>
                  
                  <!-- 题型列表 -->
                  <div v-if="lesson.questionTypes" class="question-types">
                    <span v-for="type in lesson.questionTypes" :key="type" class="type-tag">
                      {{ type }}
                    </span>
                  </div>
                  
                  <!-- 年份和套数 -->
                  <div v-if="lesson.yearRange" class="lesson-year-info">
                    <span>📅 {{ lesson.yearRange }}年</span>
                    <span>📖 {{ lesson.setCount }}套真题</span>
                  </div>
                  
                  <!-- 写作带练天数 -->
                  <div v-if="lesson.duration_days" class="duration-info">
                    <span>⏰ {{ lesson.duration_days }}天强化训练</span>
                  </div>
                  
                  <div class="lesson-meta">
                    <span class="duration">⏱️ {{ lesson.duration }}</span>
                    <span class="type" :class="lesson.type">{{ lesson.type }}</span>
                    <span v-if="lesson.highlight" class="highlight-badge">🌟 重点</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习提醒 -->
    <div class="study-reminder" v-if="incompleteItems.length > 0">
      <h4> 待完成任务提醒</h4>
      <ul>
        <li v-for="item in incompleteItems" :key="item.key">
          {{ item.text }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'

// 类型定义
interface SubItemWithStatus {
  name: string
  count: string
  status: string
}

interface SubItemWithDetail {
  name: string
  detail: string
}

type SubItem = SubItemWithStatus | SubItemWithDetail

interface Lesson {
  id: number
  title: string
  description: string
  duration: string
  type: string
  completed: boolean
  note?: string
  subItems?: SubItem[]
  yearRange?: string
  passageCount?: number
  steps?: string[]
  liveContent?: string
  recordedContent?: string
  features?: string[]
  highlight?: boolean
  questionTypes?: string[]
  setCount?: number
  duration_days?: number
}

// 展开状态
const expandedPhases = reactive({
  fundamental: true,
  summer: false,
  final: false
})

// 阶段状态
const phaseStatus = reactive({
  fundamental: {
    completed: false,
    progress: 0
  },
  summer: {
    completed: false,
    progress: 0
  },
  final: {
    completed: false,
    progress: 0
  }
})

// 基础阶段课程（开始——6月）
const fundamentalLessons = ref<Lesson[]>([
  {
    id: 1,
    title: '词汇1800核心词汇（录播）',
    description: '词根词缀—扩大词汇量500单词；形近法—避免混淆500单词；派生法—超级核心词汇100单词；同义词—阅读实战400单词',
    duration: '4天 30课时',
    type: '录播',
    completed: true,
    note: '已通过不背单词APP完成红宝书4轮背诵，剩余500词待巩固',
    subItems: [
      { name: '词根词缀扩词', count: '500单词', status: '已完成' },
      { name: '形近法辨析', count: '500单词', status: '已完成' },
      { name: '派生法记忆', count: '100单词', status: '已完成' },
      { name: '同义词实战', count: '400单词', status: '已完成' }
    ]
  },
  {
    id: 2,
    title: '基础语法（直播）',
    description: '长难句所需要的所有基础语法',
    duration: '直播课程',
    type: '直播',
    completed: false
  },
  {
    id: 3,
    title: '长难句四步法（录播）',
    description: '第1步找主干(框架+顺口溜)讲解时间3h；第2步找并列(大并列+小并列)5个长难句；第3步找从句(6大从句=主/宾/表/同/定/状)35个长难句；第4步去修饰(定语+状语+同位语+插入语)16个长难句',
    duration: '4天 32课时',
    type: '录播',
    completed: false,
    subItems: [
      { name: '第1步：找主干', detail: '框架+顺口溜，讲解3h' },
      { name: '第2步：找并列', detail: '大并列+小并列，5个长难句' },
      { name: '第3步：找从句', detail: '6大从句(主/宾/表/同/定/状)，35个长难句' },
      { name: '第4步：去修饰', detail: '定语+状语+同位语+插入语，16个长难句' },
      { name: '真题定位句', detail: '真题练习' }
    ]
  },
  {
    id: 4,
    title: '阅读逐句精读（录播）',
    description: '2005年——2009年（20篇超细精读）',
    duration: '录播课程',
    type: '录播',
    completed: false,
    yearRange: '2005-2009',
    passageCount: 20
  },
  {
    id: 5,
    title: '阅读四步法（直播）',
    description: '英语一：2011年—2015年（1.做题 2.讲题 3.长难句分析）；英语二：2011年—2015年（1.做题 2.讲题 3.长难句分析）',
    duration: '直播课程',
    type: '直播',
    completed: false,
    yearRange: '2011-2015',
    steps: ['做题', '讲题', '长难句分析']
  }
])

// 暑期强化阶段课程（7月——9月）
const summerLessons = ref<Lesson[]>([
  {
    id: 1,
    title: '翻译二步法专项突破',
    description: '掌握翻译核心技巧，重点突破长难句翻译',
    duration: '暑期强化',
    type: '直播+录播',
    completed: false,
    liveContent: '翻译二步法精讲',
    recordedContent: '2016-2020翻译真题实战'
  },
  {
    id: 2,
    title: '完形填空三步法',
    description: '完形填空解题技巧与实战训练',
    duration: '暑期强化',
    type: '直播+录播',
    completed: false,
    liveContent: '完形三步法技巧',
    recordedContent: '2016-2020完形真题讲解'
  },
  {
    id: 3,
    title: '新题型解题策略',
    description: '七选五/小标题/排序题解题方法',
    duration: '暑期强化',
    type: '直播+录播',
    completed: false,
    liveContent: '新题型三步法',
    recordedContent: '2016-2020新题型真题'
  },
  {
    id: 4,
    title: '写作框架搭建',
    description: '大小作文模板构建+素材积累',
    duration: '9月初直播',
    type: '直播',
    completed: false,
    highlight: true,
    features: ['模板框架', '万能句型', '高分词汇']
  }
])

// 冲刺模拟阶段课程（10月——12月底考前）
const finalLessons = ref<Lesson[]>([
  {
    id: 1,
    title: '近5年真题全真模拟',
    description: '2021-2025年真题限时训练+深度解析',
    duration: '10-11月',
    type: '综合训练',
    completed: false,
    yearRange: '2021-2025',
    setCount: 5
  },
  {
    id: 2,
    title: '写作实战带练',
    description: '50天写作强化训练，每日一篇+批改反馈',
    duration: '11月初-考前',
    type: '直播带练',
    completed: false,
    duration_days: 50,
    highlight: true
  },
  {
    id: 3,
    title: '考前押题+查漏补缺',
    description: '最后2周高频考点梳理+预测题训练',
    duration: '12月中旬-考前',
    type: '冲刺点睛',
    completed: false,
    highlight: true
  }
])

// 计算属性
const totalPhases = computed(() => 3)
const completedPhases = computed(() => {
  return Object.values(phaseStatus).filter(phase => phase.completed).length
})

const totalLessons = computed(() => {
  return fundamentalLessons.value.length + summerLessons.value.length + finalLessons.value.length
})

const completedLessons = computed(() => {
  const fundamentalCompleted = fundamentalLessons.value.filter(lesson => lesson.completed).length
  const summerCompleted = summerLessons.value.filter(lesson => lesson.completed).length
  const finalCompleted = finalLessons.value.filter(lesson => lesson.completed).length
  return fundamentalCompleted + summerCompleted + finalCompleted
})

const overallProgress = computed(() => {
  return Math.round((completedLessons.value / totalLessons.value) * 100)
})

const incompleteItems = computed(() => {
  const items: Array<{ key: string; text: string }> = []
  
  // 检查未完成的基础课程
  fundamentalLessons.value.forEach(lesson => {
    if (!lesson.completed) {
      items.push({
        key: `fundamental-${lesson.id}`,
        text: `基础阶段：${lesson.title}`
      })
    }
  })
  
  // 检查未完成的暑期课程
  summerLessons.value.forEach(lesson => {
    if (!lesson.completed) {
      items.push({
        key: `summer-${lesson.id}`,
        text: `暑期强化：${lesson.title}`
      })
    }
  })
  
  // 检查未完成的冲刺课程
  finalLessons.value.forEach(lesson => {
    if (!lesson.completed) {
      items.push({
        key: `final-${lesson.id}`,
        text: `冲刺阶段：${lesson.title}`
      })
    }
  })
  
  return items
})

// 方法
const togglePhase = (phaseName: 'fundamental' | 'summer' | 'final') => {
  expandedPhases[phaseName] = !expandedPhases[phaseName]
}

const toggleLesson = (phaseName: 'fundamental' | 'summer' | 'final', lessonId: number) => {
  let lessons: Lesson[] | undefined
  
  switch(phaseName) {
    case 'fundamental':
      lessons = fundamentalLessons.value
      break
    case 'summer':
      lessons = summerLessons.value
      break
    case 'final':
      lessons = finalLessons.value
      break
  }
  
  if (!lessons) return
  
  const lesson = lessons.find(l => l.id === lessonId)
  if (lesson) {
    lesson.completed = !lesson.completed
    updatePhaseProgress(phaseName)
  }
}

const updateLessonStatus = (phaseName: 'fundamental' | 'summer' | 'final', lessonId: number) => {
  // 更新该阶段的进度
  updatePhaseProgress(phaseName)
}

const updatePhaseProgress = (phaseName: 'fundamental' | 'summer' | 'final') => {
  let lessons: Lesson[] | undefined
  
  switch(phaseName) {
    case 'fundamental':
      lessons = fundamentalLessons.value
      break
    case 'summer':
      lessons = summerLessons.value
      break
    case 'final':
      lessons = finalLessons.value
      break
  }
  
  if (!lessons) return
  
  const completedCount = lessons.filter(lesson => lesson.completed).length
  const progress = Math.round((completedCount / lessons.length) * 100)
  
  phaseStatus[phaseName].progress = progress
  phaseStatus[phaseName].completed = progress === 100
}

const updateOverallProgress = () => {
  // 触发计算属性重新计算
  void overallProgress.value
}
</script>

<style scoped>
.english-study-plan {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.plan-header {
  text-align: center;
  margin-bottom: 30px;
}

.plan-title {
  font-size: 2.2em;
  color: #333;
  margin-bottom: 10px;
}

.plan-subtitle {
  font-size: 1.1em;
  color: #666;
}

.progress-overview {
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  color: white;
}

.progress-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  text-align: center;
}

.stat-card .stat-number {
  font-size: 2.5em;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-card .stat-label {
  font-size: 1em;
  opacity: 0.9;
}

.phases-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.phase-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.phase-card.completed {
  border-left: 5px solid #4CAF50;
}

.phase-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.phase-header:hover {
  background: #e9ecef;
}

.phase-info h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.4em;
}

.phase-time {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 0.95em;
}

.phase-progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-text {
  font-size: 0.9em;
  color: #666;
  min-width: 40px;
}

.expand-icon {
  transition: transform 0.3s ease;
  font-size: 1.2em;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.phase-content {
  padding: 0 20px 20px;
}

.lesson-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.lesson-item {
  padding: 15px;
  border-radius: 10px;
  background: #f8f9fa;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.lesson-item.completed {
  background: #e8f5e8;
  border-left-color: #4CAF50;
}

.lesson-item:hover {
  background: #e9ecef;
}

/* 课程主要内容区 */
.lesson-main {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

/* 自定义复选框 */
.custom-checkbox {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  min-width: 20px;
  border: 2px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  margin-top: 3px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.custom-checkbox:hover {
  border-color: #409eff;
}

.custom-checkbox:checked {
  background-color: #409eff;
  border-color: #409eff;
}

.custom-checkbox:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
  font-weight: bold;
}

/* 课程内容区 */
.lesson-content {
  flex: 1;
  min-width: 0;
}

.lesson-title {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.1em;
  font-weight: 600;
}

.lesson-desc {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 0.95em;
  line-height: 1.5;
}

.lesson-meta {
  display: flex;
  gap: 15px;
  font-size: 0.85em;
  margin-top: 10px;
}

.duration {
  color: #16345c;
  font-weight: 500;
}

.type {
  color: #FF9800;
  font-weight: 500;
}

/* 课程子项样式（词汇1800） */
.lesson-subitems {
  margin: 10px 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
}

.subitem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  background: white;
  border-radius: 6px;
  font-size: 0.9em;
  gap: 8px;
}

.subitem-name {
  color: #333;
  flex: 1;
}

.subitem-count {
  color: #16345c;
  font-weight: 600;
  white-space: nowrap;
}

.subitem-status {
  color: #4CAF50;
  font-size: 0.85em;
  font-weight: 500;
  padding: 2px 6px;
  background: #e8f5e9;
  border-radius: 4px;
  white-space: nowrap;
}

/* 课程备注样式 */
.lesson-note {
  margin: 10px 0;
  padding: 10px 15px;
  background: linear-gradient(135deg, #eef3fa 0%, #dbe7f5 100%);
  border-left: 4px solid #ffc53d;
  border-radius: 6px;
  color: #16345c;
  font-size: 0.9em;
  line-height: 1.6;
}

/* 长难句步骤样式 */
.lesson-steps {
  margin: 10px 0;
  padding: 10px;
  background: white;
  border-radius: 8px;
  border-left: 3px solid #4CAF50;
}

.step-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #e0e0e0;
  font-size: 0.9em;
  gap: 10px;
}

.step-item:last-child {
  border-bottom: none;
}

.step-name {
  color: #4CAF50;
  font-weight: 600;
  white-space: nowrap;
}

.step-detail {
  color: #666;
  text-align: right;
  flex: 1;
}

/* 年份信息样式 */
.lesson-year-info {
  margin: 8px 0;
  display: flex;
  gap: 15px;
  font-size: 0.9em;
  color: #666;
}

/* 直播+录播内容详情 */
.lesson-content-detail {
  margin: 10px 0;
  padding: 10px;
  background: white;
  border-radius: 8px;
}

.content-item {
  padding: 6px 0;
  font-size: 0.9em;
}

.content-item.live {
  color: #F44336;
  border-bottom: 1px dashed #e0e0e0;
  padding-bottom: 8px;
  margin-bottom: 8px;
}

.content-item.recorded {
  color: #16345c;
}

.content-label {
  font-weight: 600;
}

/* 特色标签 */
.lesson-features {
  margin: 8px 0;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.feature-tag {
  padding: 4px 10px;
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  color: white;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 500;
}

/* 题型标签 */
.question-types {
  margin: 8px 0;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.type-tag {
  padding: 4px 10px;
  background: #eef3fa;
  color: #16345c;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 500;
}

/* 时长信息 */
.duration-info {
  margin: 8px 0;
  font-size: 0.9em;
  color: #FF9800;
  font-weight: 500;
}

/* 重点标记 */
.highlight-badge {
  padding: 3px 8px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
  border-radius: 10px;
  font-size: 0.8em;
  font-weight: 600;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* 类型标签颜色 */
.type.录播 {
  color: #16345c;
}

.type.直播 {
  color: #F44336;
}

.type.直播+录播 {
  color: #FF9800;
}

.study-reminder {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 10px;
  padding: 20px;
  margin-top: 30px;
}

.study-reminder h4 {
  margin: 0 0 15px 0;
  color: #856404;
}

.study-reminder ul {
  margin: 0;
  padding-left: 20px;
}

.study-reminder li {
  color: #856404;
  margin-bottom: 8px;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .english-study-plan {
    padding: 15px;
  }
  
  .plan-title {
    font-size: 1.8em;
  }
  
  .progress-stats {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .stat-card .stat-number {
    font-size: 2em;
  }
  
  .phase-header {
    padding: 15px;
  }
  
  .lesson-meta {
    flex-direction: column;
    gap: 5px;
  }
  
  .lesson-subitems {
    grid-template-columns: 1fr;
  }
}
</style>
