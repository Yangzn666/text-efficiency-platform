<template>
  <div class="topic-reinforcement-view">
    <!-- 导航菜单 -->
    <MathReinforcementNav />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>🔍 知识点强化管理</h1>
      <p class="subtitle">按题型分类 · 精准掌握 · 高效复习</p>
    </div>

    <!-- 科目选择 -->
    <div class="subject-tabs">
      <el-radio-group v-model="currentSubject" size="large" @change="onSubjectChange">
        <el-radio-button label="高等数学">高等数学</el-radio-button>
        <el-radio-button label="线性代数">线性代数</el-radio-button>
        <el-radio-button label="概率论">概率论</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 三栏布局 -->
    <div class="three-column-layout">
      <!-- 左栏：章节目录 -->
      <div class="left-panel">
        <div class="panel-header">
          <h3>📚 章节目录</h3>
        </div>
        <div class="chapter-list">
          <div 
            v-for="(chapter, index) in chapterList" 
            :key="index"
            class="chapter-item"
            :class="{ active: selectedChapter === index }"
            @click="selectChapter(index)"
          >
            <div class="chapter-title">{{ chapter.name }}</div>
            <div class="chapter-stats">
              <span>{{ chapter.topicCount }}个知识点</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 中栏：题型与例题 -->
      <div class="center-panel">
        <div class="panel-header">
          <h3>📝 题型与例题</h3>
          <el-button type="primary" size="small" @click="showAddDialog = true">
            <el-icon><Plus /></el-icon>
            添加知识点
          </el-button>
        </div>
        
        <div class="question-types-container">
          <div v-if="!selectedTopic" class="empty-hint">
            <el-empty description="请从左侧选择一个章节" />
          </div>
          
          <div v-else class="topic-content">
            <!-- 当前选中的知识点信息 -->
            <div class="topic-info-bar">
              <h4>{{ selectedTopic.topicName }}</h4>
              <el-tag>{{ selectedTopic.chapter }}</el-tag>
            </div>

            <!-- 题型列表 -->
            <div class="question-types-list">
              <div 
                v-for="(qType, idx) in selectedTopic.questionTypes" 
                :key="idx"
                class="question-type-card"
              >
                <div class="type-header">
                  <h5>{{ qType.type }}</h5>
                  <el-tag :type="getDifficultyTag(qType.difficulty)" size="small">
                    {{ qType.difficulty }}
                  </el-tag>
                </div>
                
                <div class="type-stats">
                  <div class="stat">
                    <span class="label">已做:</span>
                    <span class="value">{{ qType.solvedCount }}</span>
                  </div>
                  <div class="stat">
                    <span class="label">正确率:</span>
                    <span class="value">{{ getCorrectRate(qType) }}%</span>
                  </div>
                  <div class="stat">
                    <span class="label">平均用时:</span>
                    <span class="value">{{ qType.avgTimePerProblem }}分钟</span>
                  </div>
                </div>

                <div class="type-actions">
                  <el-button size="small" type="primary" @click="recordPractice(selectedTopic, qType)">
                    记录练习
                  </el-button>
                </div>
              </div>
            </div>

            <!-- 如果没有题型，显示提示 -->
            <div v-if="selectedTopic.questionTypes.length === 0" class="no-types">
              <el-empty description="该知识点暂无题型分类">
                <el-button type="primary" @click="addQuestionType(selectedTopic)">
                  添加题型
                </el-button>
              </el-empty>
            </div>
          </div>
        </div>
      </div>

      <!-- 右栏：学习笔记 -->
      <div class="right-panel">
        <div class="panel-header">
          <h3>📖 学习笔记</h3>
          <el-button 
            v-if="selectedTopic" 
            type="success" 
            size="small" 
            @click="exportNote(selectedTopic)"
          >
            <el-icon><Download /></el-icon>
            导出
          </el-button>
        </div>
        
        <div class="notes-container">
          <div v-if="!selectedTopic" class="empty-hint">
            <el-empty description="请从左侧选择一个知识点" />
          </div>
          
          <div v-else class="note-editor">
            <el-input
              v-model="selectedTopic.notes"
              type="textarea"
              :rows="20"
              placeholder="在这里记录你的学习笔记...\n\n建议包含：\n1. 核心概念和公式\n2. 解题方法和技巧\n3. 易错点和注意事项\n4. 典型例题总结"
              @blur="saveNotes"
            />
            
            <div class="note-footer">
              <span class="save-tip">💡 笔记会自动保存</span>
              <el-button size="small" @click="clearNotes">清空</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加知识点对话框 -->
    <el-dialog
      v-model="showAddDialog"
      title="添加知识点"
      width="600px"
    >
      <el-form :model="newTopic" label-width="100px">
        <el-form-item label="所属科目">
          <el-select v-model="newTopic.subject" style="width: 100%">
            <el-option label="高等数学" value="高等数学" />
            <el-option label="线性代数" value="线性代数" />
            <el-option label="概率论" value="概率论" />
          </el-select>
        </el-form-item>

        <el-form-item label="章节">
          <el-input v-model="newTopic.chapter" placeholder="如: 第1讲 函数、极限、连续" />
        </el-form-item>

        <el-form-item label="知识点名称">
          <el-input v-model="newTopic.topicName" placeholder="如: 函数间断点判定" />
        </el-form-item>

        <el-form-item label="是否为讲义例题">
          <el-switch v-model="newTopic.isKeyExample" />
        </el-form-item>

        <el-form-item label="需要专题突破">
          <el-switch v-model="newTopic.needsSpecialTraining" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="submitNewTopic">
          添加
        </el-button>
      </template>
    </el-dialog>

    <!-- 知识点详情对话框 -->
    <el-dialog
      v-model="showDetailDialog"
      title="知识点详情"
      width="800px"
      v-if="currentTopic"
    >
      <div class="topic-detail">
        <div class="detail-header">
          <h2>{{ currentTopic.topicName }}</h2>
          <el-tag>{{ currentTopic.chapter }}</el-tag>
        </div>

        <el-tabs v-model="activeTab">
          <el-tab-pane label="基本信息" name="basic">
            <div class="tab-content">
              <div class="info-row">
                <span class="label">掌握程度:</span>
                <el-progress 
                  :percentage="currentTopic.masteryLevel" 
                  :color="getMasteryColor(currentTopic.masteryLevel)"
                />
              </div>

              <div class="info-row">
                <span class="label">听课次数:</span>
                <span>{{ currentTopic.lectureCount || 0 }} 次</span>
              </div>

              <div class="info-row">
                <span class="label">做题次数:</span>
                <span>{{ currentTopic.practiceCount || 0 }} 次</span>
              </div>

              <div class="info-row">
                <span class="label">错题数量:</span>
                <span>{{ currentTopic.wrongProblemCount || 0 }} 道</span>
              </div>

              <div class="info-row">
                <span class="label">下次复习:</span>
                <span>{{ formatDate(currentTopic.nextReviewDate) }}</span>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="掌握详情" name="details">
            <div class="tab-content">
              <div class="mastery-details">
                <div class="detail-item">
                  <span class="label">概念理解:</span>
                  <el-progress 
                    :percentage="currentTopic.masteryDetails.conceptUnderstand" 
                    :stroke-width="8"
                  />
                </div>
                <div class="detail-item">
                  <span class="label">方法掌握:</span>
                  <el-progress 
                    :percentage="currentTopic.masteryDetails.methodMaster" 
                    :stroke-width="8"
                  />
                </div>
                <div class="detail-item">
                  <span class="label">计算速度:</span>
                  <el-progress 
                    :percentage="currentTopic.masteryDetails.calculationSpeed" 
                    :stroke-width="8"
                  />
                </div>
                <div class="detail-item">
                  <span class="label">综合能力:</span>
                  <el-progress 
                    :percentage="currentTopic.masteryDetails.comprehensiveAbility" 
                    :stroke-width="8"
                  />
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="学习记录" name="records">
            <div class="tab-content">
              <div v-if="currentTopic.studyRecords && currentTopic.studyRecords.length === 0" class="no-records">
                暂无学习记录
              </div>
              <div v-else-if="currentTopic.studyRecords" class="records-list">
                <div 
                  v-for="(record, index) in currentTopic.studyRecords" 
                  :key="index"
                  class="record-item"
                >
                  <div class="record-date">{{ record.date }}</div>
                  <div class="record-type">{{ getRecordTypeLabel(record.type) }}</div>
                  <div class="record-duration">{{ record.duration }} 分钟</div>
                  <div class="record-problems" v-if="record.problemsSolved">
                    做题 {{ record.problemsSolved }} 道
                  </div>
                </div>
              </div>
              <div v-else class="no-records">
                暂无学习记录
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="学习笔记" name="notes">
            <div class="tab-content">
              <div class="notes-section">
                <div class="notes-header">
                  <h3>📝 学习笔记</h3>
                  <el-button size="small" type="primary" @click="openLocalNote">
                    <el-icon><Document /></el-icon>
                    打开本地笔记
                  </el-button>
                </div>
                
                <div class="note-preview" v-if="currentTopic.notes">
                  <div class="markdown-content" v-html="renderMarkdown(currentTopic.notes)"></div>
                </div>
                
                <el-empty v-else description="暂无笔记，点击'打开本地笔记'查看完整内容" />
                
                <div class="local-note-info">
                  <el-alert
                    title="提示"
                    type="info"
                    :closable="false"
                    show-icon
                  >
                    <template #default>
                      完整的笔记已保存在本地文件：<br/>
                      <code>D:\学习\效率\01-数学一\03-个人笔记\高等数学强化\第一章-函数.md</code>
                    </template>
                  </el-alert>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="学习记录" name="records">
            <div class="tab-content">
              <div v-if="!currentTopic.studyRecords || currentTopic.studyRecords.length === 0" class="no-records">
                暂无学习记录
              </div>
              <div v-else class="records-list">
                <div 
                  v-for="(record, index) in currentTopic.studyRecords" 
                  :key="index"
                  class="record-item"
                >
                  <div class="record-date">{{ record.date }}</div>
                  <div class="record-type">{{ getRecordTypeLabel(record.type) }}</div>
                  <div class="record-duration">{{ record.duration }} 分钟</div>
                  <div class="record-problems" v-if="record.problemsSolved">
                    做题 {{ record.problemsSolved }} 道
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>

        <div class="detail-actions">
          <el-button type="primary" @click="updateMastery(currentTopic)">
            更新掌握度
          </el-button>
          <el-button @click="recordStudy(currentTopic)">
            记录学习
          </el-button>
          <el-button type="warning" @click="toggleSpecialTraining(currentTopic)">
            {{ currentTopic.needsSpecialTraining ? '取消专题' : '标记专题' }}
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 记录学习对话框 -->
    <el-dialog
      v-model="showRecordDialog"
      title="记录学习"
      width="500px"
      v-if="currentTopic"
    >
      <el-form :model="studyRecord" label-width="100px">
        <el-form-item label="学习类型">
          <el-radio-group v-model="studyRecord.type">
            <el-radio label="lecture">📺 听课</el-radio>
            <el-radio label="practice">✍️ 做题</el-radio>
            <el-radio label="review">🔄 复习</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="错题数量" v-if="studyRecord.type === 'practice'">
          <el-input-number 
            v-model="studyRecord.wrongCount" 
            :min="0"
          />
        </el-form-item>

        <el-form-item label="学习笔记">
          <el-input
            v-model="studyRecord.notes"
            type="textarea"
            :rows="3"
            placeholder="记录学习心得..."
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showRecordDialog = false">取消</el-button>
        <el-button type="primary" @click="submitStudyRecord">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Download, Document } from '@element-plus/icons-vue'
import { useMathReinforcementStore } from '@/stores/mathReinforcement'
import type { ReinforcementTopic, StudyRecord } from '@/stores/mathReinforcement'
import MathReinforcementNav from './MathReinforcementNav.vue'

const store = useMathReinforcementStore()

// 状态
const currentSubject = ref('高等数学')
const selectedChapter = ref<number | null>(null)
const selectedTopic = ref<ReinforcementTopic | null>(null)

// 对话框
const showAddDialog = ref(false)
const showDetailDialog = ref(false)
const showRecordDialog = ref(false)
const currentTopic = ref<ReinforcementTopic | null>(null)
const activeTab = ref('basic')

// 表单
const newTopic = ref({
  subject: '高等数学' as ReinforcementTopic['subject'],
  chapter: '',
  topicName: '',
  isKeyExample: false,
  needsSpecialTraining: false
})

const studyRecord = ref<Omit<StudyRecord, 'date'> & { wrongCount?: number }>({
  type: 'lecture',
  duration: 30,
  content: '',
  problemsSolved: 0,
  correctRate: 0,
  wrongCount: 0,
  notes: ''
})

// 计算属性
// 章节目录列表
const chapterList = computed(() => {
  const topics = store.topicsBySubject[currentSubject.value as keyof typeof store.topicsBySubject] || []
  const chapters: Record<string, ReinforcementTopic[]> = {}
  
  topics.forEach((topic: ReinforcementTopic) => {
    if (!chapters[topic.chapter]) {
      chapters[topic.chapter] = []
    }
    chapters[topic.chapter].push(topic)
  })
  
  return Object.entries(chapters).map(([name, topics]) => ({
    name,
    topicCount: topics.length,
    topics
  }))
})

// 当前章节的知识点列表
const currentChapterTopics = computed(() => {
  if (selectedChapter.value === null || !chapterList.value[selectedChapter.value]) {
    return []
  }
  return chapterList.value[selectedChapter.value].topics
})

// 方法
// 选择章节
const selectChapter = (index: number) => {
  selectedChapter.value = index
  // 默认选中该章节的第一个知识点
  if (chapterList.value[index] && chapterList.value[index].topics.length > 0) {
    selectedTopic.value = chapterList.value[index].topics[0]
  } else {
    selectedTopic.value = null
  }
}

// 获取难度标签类型
const getDifficultyTag = (difficulty: string) => {
  const map: Record<string, string> = {
    '基础': 'success',
    '中等': 'warning',
    '困难': 'danger'
  }
  return map[difficulty] || ''
}

// 计算正确率
const getCorrectRate = (qType: any) => {
  if (qType.solvedCount === 0) return 0
  return Math.round((qType.correctCount / qType.solvedCount) * 100)
}

// 记录练习
const recordPractice = (topic: ReinforcementTopic, qType: any) => {
  currentTopic.value = topic
  studyRecord.value = {
    type: 'practice',
    duration: qType.avgTimePerProblem * 5 || 30,
    content: `练习题型: ${qType.type}`,
    problemsSolved: 5,
    correctRate: 0,
    wrongCount: 0,
    notes: ''
  }
  showRecordDialog.value = true
}

// 添加题型
const addQuestionType = (topic: ReinforcementTopic) => {
  ElMessage.info('添加题型功能开发中...')
}

// 保存笔记
const saveNotes = async () => {
  if (selectedTopic.value) {
    await store.saveData()
    ElMessage.success('笔记已保存')
  }
}

// 清空笔记
const clearNotes = () => {
  if (selectedTopic.value) {
    selectedTopic.value.notes = ''
    saveNotes()
  }
}

// 导出单个知识点的笔记
const exportNote = (topic: ReinforcementTopic) => {
  let markdownContent = `# ${topic.topicName}\n\n`
  markdownContent += `**章节**: ${topic.chapter}\n`
  markdownContent += `**科目**: ${topic.subject}\n\n`
  markdownContent += `---\n\n`
  
  if (topic.notes) {
    markdownContent += topic.notes
  } else {
    markdownContent += '*暂无笔记*'
  }
  
  const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${topic.topicName}_笔记.md`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  ElMessage.success('笔记已导出')
}

const onSubjectChange = () => {
  // 切换科目时重置选择
  selectedChapter.value = null
  selectedTopic.value = null
}

// 获取掌握程度颜色
const getMasteryColor = (mastery: number) => {
  if (mastery >= 90) return '#67C23A'
  if (mastery >= 70) return '#E6A23C'
  if (mastery >= 50) return '#FF9800'
  return '#F44336'
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

const getRecordTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    lecture: '📺 听课',
    practice: '✍️ 做题',
    review: '🔄 复习',
    special_training: '🎯 专题'
  }
  return labels[type] || type
}

// 打开本地笔记文件
const openLocalNote = () => {
  const notePath = 'D:\\学习\\效率\\01-数学一\\03-个人笔记\\高等数学强化\\第一章-函数.md'
  
  // 尝试使用file协议打开
  const fileUrl = 'file:///' + notePath.replace(/\\/g, '/')
  window.open(fileUrl, '_blank')
  
  ElMessage.info('如果浏览器阻止打开，请手动打开文件：' + notePath)
}

// 简单的Markdown渲染（将换行转换为<br/>）
const renderMarkdown = (text: string) => {
  if (!text) return ''
  // 将Markdown的换行转换为HTML换行
  return text.replace(/\n/g, '<br/>')
}

const recordStudy = (topic: ReinforcementTopic) => {
  currentTopic.value = topic
  studyRecord.value = {
    type: 'lecture',
    duration: 30,
    content: '',
    problemsSolved: 0,
    correctRate: 0,
    wrongCount: 0,
    notes: ''
  }
  showRecordDialog.value = true
}

const addToReview = (topic: ReinforcementTopic) => {
  // 立即更新复习日期为今天
  store.updateTopicMastery(topic.id, topic.masteryLevel)
  ElMessage.success('已加入今日复习计划')
}

const submitNewTopic = async () => {
  await store.addTopic({
    ...newTopic.value,
    questionTypes: [],
    lectureTime: 0,
    practiceTime: 0,
    masteryLevel: 0,
    masteryDetails: {
      conceptUnderstand: 0,
      methodMaster: 0,
      calculationSpeed: 0,
      comprehensiveAbility: 0
    },
    reviewRound: 0
  })

  ElMessage.success('知识点添加成功!')
  showAddDialog.value = false
  
  newTopic.value = {
    subject: '高等数学',
    chapter: '',
    topicName: '',
    isKeyExample: false,
    needsSpecialTraining: false
  }
}

const submitStudyRecord = async () => {
  if (!currentTopic.value) return

  // 根据学习类型更新计数
  if (studyRecord.value.type === 'lecture') {
    currentTopic.value.lectureCount = (currentTopic.value.lectureCount || 0) + 1
  } else if (studyRecord.value.type === 'practice') {
    currentTopic.value.practiceCount = (currentTopic.value.practiceCount || 0) + 1
    if (studyRecord.value.wrongCount && studyRecord.value.wrongCount > 0) {
      currentTopic.value.wrongProblemCount = (currentTopic.value.wrongProblemCount || 0) + studyRecord.value.wrongCount
    }
  } else if (studyRecord.value.type === 'review') {
    // 复习后更新日期
    const nextDate = new Date()
    nextDate.setDate(nextDate.getDate() + 7)
    currentTopic.value.nextReviewDate = nextDate.toISOString().split('T')[0]
  }

  // 保存笔记
  if (studyRecord.value.notes) {
    currentTopic.value.notes = currentTopic.value.notes + '\n\n---\n\n' + studyRecord.value.notes
  }

  await store.saveData()
  
  ElMessage.success('学习记录已保存!')
  showRecordDialog.value = false
}

const updateMastery = (topic: ReinforcementTopic) => {
  ElMessage.info('更新掌握度功能开发中...')
}

const toggleSpecialTraining = async (topic: ReinforcementTopic) => {
  topic.needsSpecialTraining = !topic.needsSpecialTraining
  await store.saveData()
  ElMessage.success(topic.needsSpecialTraining ? '已标记为需要专题突破' : '已取消专题标记')
}

onMounted(() => {
  console.log('知识点强化管理已加载')
  
  // 初始化第一章函数知识点
  initChapter1FunctionTopics()
})

// 初始化第一章函数部分知识点
const initChapter1FunctionTopics = () => {
  const existingTopics = store.topics
  
  // 检查是否已经初始化
  const hasFuncConcept = existingTopics.some(t => t.id === 'ch1_func_concept')
  if (hasFuncConcept) {
    console.log('第一章函数知识点已存在,跳过初始化')
    return
  }
  
  console.log(' 初始化第一章函数知识点卡片...')
  
  const newTopics = [
    {
      id: 'ch1_func_concept',
      subject: '高等数学',
      chapter: '第一章 函数 极限 连续',
      topicName: '函数概念及常见函数',
      questionTypes: [
        { type: '复合函数', difficulty: '中等', importance: 4, solvedCount: 0, correctCount: 0, avgTimePerProblem: 0 },
        { type: '反函数求解', difficulty: '基础', importance: 3, solvedCount: 0, correctCount: 0, avgTimePerProblem: 0 }
      ],
      masteryLevel: 0,
      masteryDetails: {
        conceptClarity: 0,
        methodMastery: 0,
        problemSolving: 0,
        accuracyRate: 0
      },
      lectureCount: 0,
      practiceCount: 0,
      wrongProblemCount: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      needsSpecialTraining: false,
      isTextbookExample: true,
      reviewCount: 0,
      notes: `# 一、函数的概念

## 1. 函数的两个基本要素
- **定义域 D**: 自变量 x 的取值范围
- **对应法则 f**: x 与 y 的对应关系
- **重要结论**: 两个函数相同 ⇔ 定义域相同 且 对应法则相同

## 2. 复合函数
- **定义**: y = f[g(x)]
- **复合的关键**: **内层函数的值域 ⊆ 外层函数的定义域**
- **分解方法**: 从外到内逐层分解
- **例题**: y = sin(ln(x²+1))
  分解: y = sin u, u = ln v, v = x²+1

## 3. 反函数
- **存在条件**: 函数必须**严格单调**(一一对应)
- **核心**: 每个 y 值对应**唯一**的 x 值
- **求法**: 
  1. 从 y = f(x) 解出 x = f⁻¹(y)
  2. 交换 x, y 得 y = f⁻¹(x)
- **性质**:
  - 图像关于 y = x 对称
  - f[f⁻¹(x)] = x
  - 单调性相同

## 4. 初等函数
- **定义**: 由基本初等函数经过**有限次**四则运算和复合得到的函数
- **特点**: 能用**一个解析式**表示
- **例子**: 
  ✓ y = sin(x²) + e^x (初等)
  ✓ y = |x| = √(x²) (初等)
  ✗ 分段函数一般不是初等函数

# 二、题型总结

## 题型1: 复合函数
**考法**:
1. 求复合函数表达式
2. 复合函数分解
3. 求复合函数定义域

**技巧**:
- 分解时从外向内,逐层设中间变量
- 定义域: 内层值域要在外层定义域内

## 题型2: 反函数
**考法**:
1. 求反函数表达式
2. 判断反函数存在性
3. 反函数性质应用`,
      createdAt: new Date().toISOString()
    },
    {
      id: 'ch1_func_properties',
      subject: '高等数学',
      chapter: '第一章 函数 极限 连续',
      topicName: '函数性态(单调、奇偶、周期、有界)',
      questionTypes: [
        { type: '奇偶性判断', difficulty: '基础', importance: 5, solvedCount: 0, correctCount: 0, avgTimePerProblem: 0 },
        { type: '周期性判断', difficulty: '基础', importance: 4, solvedCount: 0, correctCount: 0, avgTimePerProblem: 0 },
        { type: '有界性判断', difficulty: '中等', importance: 3, solvedCount: 0, correctCount: 0, avgTimePerProblem: 0 }
      ],
      masteryLevel: 0,
      masteryDetails: {
        conceptClarity: 0,
        methodMastery: 0,
        problemSolving: 0,
        accuracyRate: 0
      },
      lectureCount: 0,
      practiceCount: 0,
      wrongProblemCount: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      needsSpecialTraining: false,
      isTextbookExample: true,
      reviewCount: 0,
      notes: `# 函数四大性态

## 一、单调性
**定义**: 
- 增函数: x₁ < x₂ ⇒ f(x₁) < f(x₂)
- 减函数: x₁ < x₂ ⇒ f(x₁) > f(x₂)

**判定方法**:
1. **定义法**: 比较 f(x₁) 与 f(x₂)
2. **导数法**(常用): 
   - f'(x) > 0 ⇒ 单调递增
   - f'(x) < 0 ⇒ 单调递减

**性质**:
- 增+增=增, 减+减=减
- 增×增(正) = 增
- 反函数单调性相同

## 二、奇偶性 ⭐⭐
**定义**:
- 奇函数: f(-x) = -f(x), 图像关于原点对称
- 偶函数: f(-x) = f(x), 图像关于y轴对称

**判定步骤**:
1. **先看定义域**: 必须关于原点对称!
2. 计算 f(-x)
3. 比较 f(-x) 与 f(x)、-f(x)

**常见奇偶函数**:
- 奇: sinx, tanx, x, x³, arcsinx, arctanx
- 偶: cosx, x², |x|, arccosx

**性质**:
- 奇+奇=奇, 偶+偶=偶
- 奇×奇=偶, 偶×偶=偶, 奇×偶=奇
- 奇函数的原函数是偶函数
- 偶函数的原函数不一定是奇函数

## 三、周期性
**定义**: f(x+T) = f(x), T为周期

**常见周期**:
- sinx, cosx: T = 2π
- tanx, cotx: T = π
- |sinx|, |cosx|: T = π
- sin²x, cos²x: T = π

**性质**:
- 若T是周期,则nT也是周期
- 周期函数在任意长度为T的区间上积分相等

## 四、有界性
**定义**: ∃M>0, 使 |f(x)| ≤ M

**判定方法**:
1. **闭区间上连续函数**必有界(最值定理)
2. **极限存在**的函数在去心邻域内有界
3. **单调有界**数列必收敛

**常见有界函数**:
- |sinx| ≤ 1, |cosx| ≤ 1
- |arcsinx| ≤ π/2, |arccosx| ≤ π
- |arctanx| < π/2

# 题型总结

## 题型: 函数性态判断
**考法**:
1. 判断奇偶性(必考!)
2. 判断周期性
3. 判断有界性
4. 利用性态简化计算

**技巧**:
- 奇偶性: 定义域对称是前提!
- 周期性: 记住常见函数周期
- 有界性: 闭区间连续→有界
- 综合题: 先判断性态,再计算`,
      createdAt: new Date().toISOString()
    }
  ]
  
  // 添加到store
  newTopics.forEach(topic => {
    store.addTopic({
      ...topic,
      lectureTime: 0,
      practiceTime: 0,
      isKeyExample: topic.isTextbookExample || false,
      reviewRound: 0
    } as any)
  })
  
  console.log(`✅ 已添加 ${newTopics.length} 个第一章函数知识点卡片`)
  console.log('可以在"知识点管理"页面查看和编辑')
}
</script>

<style scoped>
.topic-reinforcement-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
  background: linear-gradient(180deg, #f5f7fa 0%, #e8ecf1 100%);
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 0;
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(13, 33, 55, 0.3);
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.page-header h1 {
  font-size: 36px;
  color: #ffffff;
  margin-bottom: 12px;
  font-weight: 700;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}

.subtitle {
  color: rgba(255, 255, 255, 0.95);
  font-size: 16px;
  margin: 0;
  font-weight: 400;
  letter-spacing: 1px;
  position: relative;
  z-index: 1;
}

/* 科目选择 */
.subject-tabs {
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
}

.subject-tabs :deep(.el-radio-group) {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.subject-tabs :deep(.el-radio-button__inner) {
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  border: none;
  background: transparent;
  color: #666;
  transition: all 0.3s ease;
}

.subject-tabs :deep(.el-radio-button__orig:checked + .el-radio-button__inner) {
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(13, 33, 55, 0.3);
}

/* 三栏布局 */
.three-column-layout {
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  gap: 24px;
  height: calc(100vh - 280px);
  min-height: 600px;
}

/* 左栏：章节目录 */
.left-panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.8);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 20px;
  border-bottom: 2px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  color: white;
}

.panel-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.chapter-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.chapter-item {
  padding: 16px;
  margin-bottom: 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background: #f8f9fa;
}

.chapter-item:hover {
  background: #e8ecf1;
  transform: translateX(4px);
}

.chapter-item.active {
  background: linear-gradient(135deg, rgba(13, 33, 55, 0.1) 0%, rgba(30, 69, 118, 0.1) 100%);
  border-color: #ffc53d;
  box-shadow: 0 4px 12px rgba(13, 33, 55, 0.2);
}

.chapter-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
  line-height: 1.4;
}

.chapter-stats {
  font-size: 13px;
  color: #666;
}

/* 中栏：题型与例题 */
.center-panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.8);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.question-types-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.empty-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.topic-info-bar {
  padding: 16px;
  background: linear-gradient(135deg, rgba(13, 33, 55, 0.1) 0%, rgba(30, 69, 118, 0.1) 100%);
  border-radius: 12px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topic-info-bar h4 {
  margin: 0;
  font-size: 20px;
  color: #16345c;
  font-weight: 700;
}

.question-types-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-type-card {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px solid #e8ecf1;
  transition: all 0.3s ease;
}

.question-type-card:hover {
  border-color: #ffc53d;
  box-shadow: 0 4px 12px rgba(13, 33, 55, 0.15);
  transform: translateY(-2px);
}

.type-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.type-header h5 {
  margin: 0;
  font-size: 17px;
  color: #1a1a1a;
  font-weight: 700;
}

.type-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.type-stats .stat {
  text-align: center;
  padding: 12px;
  background: white;
  border-radius: 8px;
}

.type-stats .stat .label {
  display: block;
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.type-stats .stat .value {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: #16345c;
}

.type-actions {
  display: flex;
  justify-content: flex-end;
}

.no-types {
  padding: 40px 20px;
}

/* 右栏：学习笔记 */
.right-panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.8);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.notes-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.note-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.note-editor :deep(.el-textarea__inner) {
  flex: 1;
  min-height: 400px;
  border-radius: 12px;
  border: 2px solid #e8ecf1;
  padding: 16px;
  font-size: 14px;
  line-height: 1.8;
  resize: none;
}

.note-editor :deep(.el-textarea__inner):focus {
  border-color: #ffc53d;
  box-shadow: 0 0 0 3px rgba(13, 33, 55, 0.1);
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 2px solid #f0f0f0;
}

.save-tip {
  font-size: 13px;
  color: #666;
}

/* 对话框样式 */
:deep(.el-dialog) {
  border-radius: 20px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  padding: 24px;
  margin: 0;
}

:deep(.el-dialog__title) {
  color: white;
  font-size: 20px;
  font-weight: 700;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 20px;
}

:deep(.el-dialog__body) {
  padding: 32px;
}

/* 响应式 */
@media (max-width: 1200px) {
  .three-column-layout {
    grid-template-columns: 240px 1fr 280px;
  }
}

@media (max-width: 992px) {
  .three-column-layout {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .left-panel,
  .center-panel,
  .right-panel {
    max-height: 500px;
  }
}

@media (max-width: 768px) {
  .topic-reinforcement-view {
    padding: 16px;
  }
  
  .page-header {
    padding: 24px 0;
    border-radius: 16px;
  }
  
  .page-header h1 {
    font-size: 28px;
  }
}
</style>
