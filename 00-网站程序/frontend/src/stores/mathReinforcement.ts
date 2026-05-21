import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ==================== 类型定义 ====================

// 知识点类型(强化阶段细化)
export interface ReinforcementTopic {
  id: string
  subject: '高等数学' | '线性代数' | '概率论'
  chapter: string          // 如: "第1讲 函数、极限、连续"
  topicName: string        // 如: "函数间断点判定"
  
  // 强化阶段特有字段
  questionTypes: QuestionType[]  // 该知识点涉及的题型
  lectureTime: number      // 听课时长(分钟)
  practiceTime: number     // 做题时长(分钟)
  
  // 简化统计字段（用于快速显示）
  lectureCount?: number    // 听课次数
  practiceCount?: number   // 做题次数
  wrongProblemCount?: number  // 错题数量
  notes?: string           // 学习笔记
  
  // 掌握程度(0-100)
  masteryLevel: number
  masteryDetails: {
    conceptUnderstand: number   // 概念理解
    methodMaster: number        // 方法掌握
    calculationSpeed: number    // 计算速度
    comprehensiveAbility: number // 综合能力
  }
  
  // 学习记录
  studyRecords: StudyRecord[]
  lastReviewed: string
  nextReviewDate: string  // 下次复习日期(基于遗忘曲线)
  
  // 标记
  isKeyExample: boolean   // 是否为讲义经典例题
  reviewRound: number     // 已复习轮数(1/2/3)
  needsSpecialTraining: boolean  // 是否需要专题突破
  
  createdAt: string
}

// 题型分类
export interface QuestionType {
  type: string            // 如: "求极限", "证明中值定理"
  difficulty: '基础' | '中等' | '困难'
  importance: number      // 1-5
  solvedCount: number     // 已做题目数
  correctCount: number    // 正确数
  avgTimePerProblem: number  // 平均每题耗时(分钟)
}

// 学习记录
export interface StudyRecord {
  date: string
  type: 'lecture' | 'practice' | 'review' | 'special_training'
  duration: number        // 时长(分钟)
  content: string         // 学习内容描述
  problemsSolved: number  // 做题数量
  correctRate: number     // 正确率
  wrongCount?: number     // 错题数量（仅做题时有效）
  notes: string           // 学习笔记
}

// 错题本(强化版)
export interface WrongProblem {
  id: string
  topicId: string
  problemSource: '880题' | '660题' | '1000题A组' | '1000题B组' | '1000题C组' | '严选题' | '讲义例题' | '真题' | '模拟卷'
  questionType: string    // 题型分类
  difficulty: '基础' | '中等' | '困难'
  
  // 错误分析
  mistakeType: ('概念不清' | '方法不会' | '计算错误' | '思路错误' | '粗心大意')[]
  mistakeAnalysis: string // 错误原因详细描述
  
  // 正确解法
  correctSolution: string
  keyTechnique: string    // 关键技巧
  alternativeMethods: string[]  // 其他解法
  
  // 复习追踪
  reviewCount: number     // 已复习次数
  reviewDates: string[]   // 复习日期记录
  nextReviewDate: string  // 下次复习日期
  isMastered: boolean     // 是否已掌握
  
  // 标记
  tags: string[]          // 标签,如: "中值定理", "积分不等式"
  priority: 'high' | 'medium' | 'low'  // 优先级
  
  createdAt: string
}

// 专题突破
export interface SpecialTraining {
  id: string
  name: string            // 如: "微分中值定理专题"
  subject: string
  description: string
  videoSource: string     // B站UP主或老师
  estimatedTime: number   // 预计时长(小时)
  
  // 进度
  completed: boolean
  progress: number        // 0-100
  problemsSolved: number
  masteryLevel: number
  
  // 资源
  videoUrl?: string
  materialLinks: string[] // 相关资料链接
  
  createdAt: string
}

// 每日学习计划
export interface DailyPlan {
  date: string
  tasks: DailyTask[]
  actualStudyTime: number
  targetStudyTime: number
  completed: boolean
}

export interface DailyTask {
  id: string
  type: 'lecture' | 'practice' | 'review' | 'wrong_review' | 'special_training'
  title: string
  estimatedTime: number   // 预计时长(分钟)
  actualTime?: number     // 实际时长
  completed: boolean
  topicId?: string
  problemCount?: number   // 如果是做题任务
}

// ==================== Store 定义 ====================

export const useMathReinforcementStore = defineStore('mathReinforcement', () => {
  // 状态
  const topics = ref<ReinforcementTopic[]>([])
  // 错题本(已弃用)
  const wrongProblems = ref<WrongProblem[]>([])
  const specialTrainings = ref<SpecialTraining[]>([])
  const dailyPlans = ref<DailyPlan[]>([])
  const isLoading = ref(false)

  // ==================== 计算属性 ====================

  // 按科目分组
  const topicsBySubject = computed(() => {
    return {
      '高等数学': topics.value.filter(t => t.subject === '高等数学'),
      '线性代数': topics.value.filter(t => t.subject === '线性代数'),
      '概率论': topics.value.filter(t => t.subject === '概率论')
    }
  })

  // 各科目的强化进度
  const subjectProgress = computed(() => {
    const calculateProgress = (subjectTopics: ReinforcementTopic[]) => {
      if (subjectTopics.length === 0) return 0
      const totalMastery = subjectTopics.reduce((sum, t) => sum + t.masteryLevel, 0)
      return Math.round(totalMastery / subjectTopics.length)
    }

    return {
      '高等数学': calculateProgress(topicsBySubject.value['高等数学']),
      '线性代数': calculateProgress(topicsBySubject.value['线性代数']),
      '概率论': calculateProgress(topicsBySubject.value['概率论'])
    }
  })

  // 今日需复习的知识点
  const todayReviews = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return topics.value.filter(t => t.nextReviewDate <= today && t.masteryLevel < 90)
  })

  // 需要专题突破的知识点
  const needsSpecialTrainingTopics = computed(() => {
    return topics.value.filter(t => t.needsSpecialTraining || (t.masteryLevel < 50 && t.studyRecords.length > 3))
  })

  // 总体统计
  const statistics = computed(() => {
    const totalTopics = topics.value.length
    const masteredTopics = topics.value.filter(t => t.masteryLevel >= 80).length
    
    // 计算总学习时间
    const totalLectureTime = topics.value.reduce((sum, t) => sum + t.lectureTime, 0)
    const totalPracticeTime = topics.value.reduce((sum, t) => sum + t.practiceTime, 0)
    
    return {
      totalTopics,
      masteredTopics,
      totalLectureTime,
      totalPracticeTime,
      lectureToPracticeRatio: totalPracticeTime > 0 ? (totalLectureTime / totalPracticeTime).toFixed(2) : '0'
    }
  })

  // ==================== 核心计算方法 ====================

  // 计算遗忘曲线复习日期
  const calculateNextReviewDate = (masteryLevel: number, lastReviewed: string): string => {
    // 基于掌握程度的复习间隔
    let intervalDays: number
    if (masteryLevel >= 90) intervalDays = 30      // 熟练掌握: 30天
    else if (masteryLevel >= 70) intervalDays = 14  // 良好: 14天
    else if (masteryLevel >= 50) intervalDays = 7   // 一般: 7天
    else intervalDays = 3                           // 薄弱: 3天
    
    const nextDate = new Date(lastReviewed)
    nextDate.setDate(nextDate.getDate() + intervalDays)
    return nextDate.toISOString().split('T')[0]
  }

  // 计算听课:做题比例
  const calculateLecturePracticeRatio = (topic: ReinforcementTopic): number => {
    if (topic.practiceTime === 0) return 0
    return topic.lectureTime / topic.practiceTime
  }

  // 智能推荐今日学习任务
  const generateTodayPlan = (): DailyPlan => {
    const today = new Date().toISOString().split('T')[0]
    const tasks: DailyTask[] = []
    
    // 1. 优先复习到期的知识点
    const dueReviews = topics.value.filter(t => t.nextReviewDate <= today && t.masteryLevel < 90)
    dueReviews.slice(0, 3).forEach(topic => {
      tasks.push({
        id: `review_${topic.id}`,
        type: 'review',
        title: `复习: ${topic.topicName}`,
        estimatedTime: 30,
        topicId: topic.id,
        completed: false
      })
    })
    
    // 2. 新课学习(保证听课:做题=1:3)
    const currentLearningTopic = getCurrentLearningTopic()
    if (currentLearningTopic) {
      const ratio = calculateLecturePracticeRatio(currentLearningTopic)
      if (ratio > 0.5) {
        // 听课太多,今天主要做题
        tasks.push({
          id: `practice_${currentLearningTopic.id}`,
          type: 'practice',
          title: `做题: ${currentLearningTopic.topicName}`,
          estimatedTime: 90,
          topicId: currentLearningTopic.id,
          problemCount: 15,
          completed: false
        })
      } else {
        // 可以听课
        tasks.push({
          id: `lecture_${currentLearningTopic.id}`,
          type: 'lecture',
          title: `听课: ${currentLearningTopic.topicName}`,
          estimatedTime: 60,
          topicId: currentLearningTopic.id,
          completed: false
        })
      }
    }
    
    return {
      date: today,
      tasks,
      actualStudyTime: 0,
      targetStudyTime: tasks.reduce((sum, t) => sum + t.estimatedTime, 0),
      completed: false
    }
  }

  // 获取当前正在学习的知识点(最简单的启发式方法)
  const getCurrentLearningTopic = (): ReinforcementTopic | null => {
    // 优先返回掌握程度在30-70之间的知识点
    const inProgress = topics.value.filter(t => t.masteryLevel >= 30 && t.masteryLevel < 70)
    if (inProgress.length > 0) {
      return inProgress[0]
    }
    
    // 其次返回未开始的知识点
    const notStarted = topics.value.filter(t => t.masteryLevel === 0)
    if (notStarted.length > 0) {
      return notStarted[0]
    }
    
    return null
  }

  // ==================== 数据操作方法 ====================

  // 添加知识点
  const addTopic = async (topicData: Omit<ReinforcementTopic, 'id' | 'createdAt' | 'studyRecords' | 'lastReviewed' | 'nextReviewDate'>) => {
    const now = new Date().toISOString()
    const newTopic: ReinforcementTopic = {
      id: `topic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...topicData,
      studyRecords: [],
      lastReviewed: now,
      nextReviewDate: calculateNextReviewDate(0, now),
      createdAt: now
    }
    
    topics.value.push(newTopic)
    await saveData()
    return newTopic
  }

  // 更新知识点掌握程度
  const updateTopicMastery = async (topicId: string, masteryLevel: number, details?: Partial<ReinforcementTopic['masteryDetails']>) => {
    const topic = topics.value.find(t => t.id === topicId)
    if (!topic) return
    
    topic.masteryLevel = Math.max(0, Math.min(100, masteryLevel))
    
    if (details) {
      topic.masteryDetails = {
        ...topic.masteryDetails,
        ...details
      }
    }
    
    topic.lastReviewed = new Date().toISOString()
    topic.nextReviewDate = calculateNextReviewDate(topic.masteryLevel, topic.lastReviewed)
    
    await saveData()
  }

  // 记录学习时间
  const recordStudyTime = async (topicId: string, record: Omit<StudyRecord, 'date'>) => {
    const topic = topics.value.find(t => t.id === topicId)
    if (!topic) return
    
    const studyRecord: StudyRecord = {
      date: new Date().toISOString().split('T')[0],
      ...record
    }
    
    topic.studyRecords.push(studyRecord)
    
    // 更新总时间
    if (record.type === 'lecture') {
      topic.lectureTime += record.duration
    } else if (record.type === 'practice') {
      topic.practiceTime += record.duration
    }
    
    topic.lastReviewed = new Date().toISOString()
    
    await saveData()
  }

  // 添加错题
  const addWrongProblem = async (problemData: Omit<WrongProblem, 'id' | 'createdAt' | 'reviewCount' | 'reviewDates' | 'nextReviewDate' | 'isMastered' | 'topicId'> & { topicId?: string }) => {
    const now = new Date().toISOString()
    const newProblem: WrongProblem = {
      id: `wrong_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...problemData,
      topicId: problemData.topicId || '',
      reviewCount: 0,
      reviewDates: [],
      nextReviewDate: calculateNextReviewDate(0, now.split('T')[0]),
      isMastered: false,
      createdAt: now
    }
    
    wrongProblems.value.push(newProblem)
    await saveData()
    return newProblem
  }

  // 复习错题
  const reviewWrongProblem = async (problemId: string, isCorrect: boolean) => {
    const problem = wrongProblems.value.find(p => p.id === problemId)
    if (!problem) return
    
    problem.reviewCount++
    problem.reviewDates.push(new Date().toISOString().split('T')[0])
    
    if (isCorrect && problem.reviewCount >= 3) {
      problem.isMastered = true
    }
    
    // 重新计算下次复习日期
    const masteryLevel = problem.isMastered ? 90 : Math.min(70, problem.reviewCount * 20)
    problem.nextReviewDate = calculateNextReviewDate(masteryLevel, new Date().toISOString().split('T')[0])
    
    await saveData()
  }

  // 添加专题
  const addSpecialTraining = async (trainingData: Omit<SpecialTraining, 'id' | 'createdAt' | 'completed' | 'progress' | 'problemsSolved' | 'masteryLevel'>) => {
    const newTraining: SpecialTraining = {
      id: `training_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...trainingData,
      completed: false,
      progress: 0,
      problemsSolved: 0,
      masteryLevel: 0,
      createdAt: new Date().toISOString()
    }
    
    specialTrainings.value.push(newTraining)
    await saveData()
    return newTraining
  }

  // 更新专题进度
  const updateSpecialTrainingProgress = async (trainingId: string, progress: number, problemsSolved?: number) => {
    const training = specialTrainings.value.find(t => t.id === trainingId)
    if (!training) return
    
    training.progress = Math.max(0, Math.min(100, progress))
    if (problemsSolved !== undefined) {
      training.problemsSolved = problemsSolved
    }
    
    training.completed = training.progress >= 100
    training.masteryLevel = training.progress
    
    await saveData()
  }

  // 保存今日计划
  const saveDailyPlan = async (plan: DailyPlan) => {
    const existingIndex = dailyPlans.value.findIndex(p => p.date === plan.date)
    if (existingIndex >= 0) {
      dailyPlans.value[existingIndex] = plan
    } else {
      dailyPlans.value.push(plan)
    }
    await saveData()
  }

  // 获取今日计划
  const getTodayPlan = (): DailyPlan => {
    const today = new Date().toISOString().split('T')[0]
    const existingPlan = dailyPlans.value.find(p => p.date === today)
    
    if (existingPlan) {
      return existingPlan
    }
    
    // 生成新计划
    const newPlan = generateTodayPlan()
    dailyPlans.value.push(newPlan)
    saveData()
    return newPlan
  }

  // ==================== 数据持久化 ====================

  const STORAGE_KEYS = {
    TOPICS: 'mathReinforcement_topics',
    // WRONG_PROBLEMS - 已弃用，保留以兼容旧数据
    SPECIAL_TRAINING: 'mathReinforcement_specialTraining',
    DAILY_PLANS: 'mathReinforcement_dailyPlans'
  }

  const saveData = async () => {
    try {
      localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(topics.value))
      // 不再保存错题本数据
      localStorage.setItem(STORAGE_KEYS.SPECIAL_TRAINING, JSON.stringify(specialTrainings.value))
      localStorage.setItem(STORAGE_KEYS.DAILY_PLANS, JSON.stringify(dailyPlans.value))
    } catch (error) {
      console.error('保存数据失败:', error)
    }
  }

  const loadData = () => {
    try {
      const savedTopics = localStorage.getItem(STORAGE_KEYS.TOPICS)
      // 不再加载错题本数据
      const savedTraining = localStorage.getItem(STORAGE_KEYS.SPECIAL_TRAINING)
      const savedPlans = localStorage.getItem(STORAGE_KEYS.DAILY_PLANS)
      
      if (savedTopics) topics.value = JSON.parse(savedTopics)
      if (savedTraining) specialTrainings.value = JSON.parse(savedTraining)
      if (savedPlans) dailyPlans.value = JSON.parse(savedPlans)
    } catch (error) {
      console.error('加载数据失败:', error)
    }
  }

  // 初始化
  loadData()

  // ==================== 导出 ====================

  return {
    // 状态
    topics,
    wrongProblems, // 已弃用，保留以兼容旧数据
    specialTrainings,
    dailyPlans,
    isLoading,
    
    // 计算属性
    topicsBySubject,
    subjectProgress,
    todayReviews,
    needsSpecialTrainingTopics,
    statistics,
    
    // 核心方法
    calculateNextReviewDate,
    calculateLecturePracticeRatio,
    generateTodayPlan,
    getCurrentLearningTopic,
    
    // 数据操作
    addTopic,
    updateTopicMastery,
    recordStudyTime,
    // addWrongProblem - 已弃用
    // reviewWrongProblem - 已弃用
    addSpecialTraining,
    updateSpecialTrainingProgress,
    saveDailyPlan,
    getTodayPlan,
    
    // 持久化
    saveData,
    loadData
  }
})
