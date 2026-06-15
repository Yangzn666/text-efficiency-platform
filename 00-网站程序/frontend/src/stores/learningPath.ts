import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import localforage from 'localforage'
import { useStudyStore } from './study'

interface LearningPath {
  id: string
  subject: string
  name: string
  description: string
  totalChapters: number
  completedChapters: number
  currentChapter: number
  startDate: string
  estimatedEndDate: string
  status: 'not-started' | 'in-progress' | 'completed' | 'paused'
  chapters: Chapter[]
}

interface Chapter {
  id: string
  title: string
  order: number
  estimatedTime: number // 分钟
  completed: boolean
  completionDate?: string
  tasks: Task[]
  dependencies: string[] // 依赖的前置章节
}

interface Task {
  id: string
  title: string
  type: 'reading' | 'practice' | 'review' | 'exercise'
  estimatedTime: number // 分钟
  completed: boolean
  completionDate?: string
  priority: 'high' | 'medium' | 'low'
  difficulty: 'easy' | 'medium' | 'hard'
}

interface StudyPlan {
  id: string
  date: string
  tasks: PlannedTask[]
  completed: boolean
}

interface PlannedTask {
  id: string
  taskId: string
  subject: string
  chapterTitle: string
  taskTitle: string
  estimatedTime: number
  completed: boolean
}

// 测评相关接口
interface AssessmentQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number // 正确答案的索引
  difficulty: 'easy' | 'medium' | 'hard'
  knowledgePoint: string
}

interface AssessmentResult {
  subject: string
  overallLevel: 'beginner' | 'intermediate' | 'advanced'
  score: number // 0-100
  correctCount: number
  totalCount: number
  weakAreas: string[]
  strongAreas: string[]
  estimatedStudyTime: number // 预估需要的小时数
  takenAt: string
}

// 复习计划相关接口
interface ReviewSchedule {
  knowledgePointId: string
  knowledgePointName: string
  subject: string
  learnDate: string
  reviewDates: string[] // 艾宾浩斯复习日期
  completedReviews: number
  nextReviewDate: string
  retentionRate: number // 记忆保持率估算 0-1
  status: 'pending' | 'completed' | 'overdue'
}

// 掌握度追踪
interface MasteryRecord {
  knowledgePointId: string
  knowledgePointName: string
  subject: string
  masteryScore: number // 0-100
  lastStudied: string
  studyCount: number
  reviewCount: number
  testScores: number[] // 历次测试分数
  trend: 'improving' | 'stable' | 'declining'
}

// 成就系统相关接口
interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'study' | 'streak' | 'milestone' | 'mastery'
  condition: (store: any) => boolean
  unlocked: boolean
  unlockedAt?: string
  xpReward: number
}

// 等级系统
interface UserLevel {
  level: number
  currentXP: number
  totalXP: number
  nextLevelXP: number
  title: string
}

// Streaks连续学习
interface StreakData {
  currentStreak: number
  longestStreak: number
  lastStudyDate: string
  streakHistory: string[] // 连续学习的日期列表
}

export const useLearningPathStore = defineStore('learningPath', () => {
  // 状态
  const learningPaths = ref<LearningPath[]>([])
  const currentPath = ref<LearningPath | null>(null)
  const studyPlans = ref<StudyPlan[]>([])
  const isLoading = ref(false)
  
  // 测评相关状态
  const currentAssessment = ref<{
    subject: string
    questions: AssessmentQuestion[]
    currentIndex: number
    answers: number[]
    startTime: number
  } | null>(null)
  
  const assessmentResults = ref<AssessmentResult[]>([])
  
  // 复习计划状态
  const reviewSchedules = ref<ReviewSchedule[]>([])
  
  // 掌握度追踪状态
  const masteryRecords = ref<MasteryRecord[]>([])
  
  // 游戏化状态
  const achievements = ref<Achievement[]>([])
  const userLevel = ref<UserLevel>({
    level: 1,
    currentXP: 0,
    totalXP: 0,
    nextLevelXP: 100,
    title: '初学者'
  })
  const streakData = ref<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: '',
    streakHistory: []
  })

  // 计算属性
  const overallProgress = computed(() => {
    if (learningPaths.value.length === 0) return 0
    const totalChapters = learningPaths.value.reduce((sum, path) => sum + path.totalChapters, 0)
    const completedChapters = learningPaths.value.reduce((sum, path) => sum + path.completedChapters, 0)
    return totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0
  })

  const activePaths = computed(() => {
    return learningPaths.value.filter(path => 
      path.status === 'in-progress' || path.status === 'paused'
    )
  })

  const todayPlan = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return studyPlans.value.find(plan => plan.date === today) || null
  })

  const weeklyPlanProgress = computed(() => {
    const today = new Date()
    const oneWeekAgo = new Date(today)
    oneWeekAgo.setDate(today.getDate() - 7)
    
    const weeklyPlans = studyPlans.value.filter(plan => {
      const planDate = new Date(plan.date)
      return planDate >= oneWeekAgo && planDate <= today
    })
    
    if (weeklyPlans.length === 0) return 0
    
    const totalTasks = weeklyPlans.reduce((sum, plan) => sum + plan.tasks.length, 0)
    const completedTasks = weeklyPlans.reduce((sum, plan) => 
      sum + plan.tasks.filter(task => task.completed).length, 0
    )
    
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  })

  // 方法
  const createLearningPath = async (subject: string, chapters: Omit<Chapter, 'id' | 'completed' | 'tasks'>[]) => {
    isLoading.value = true
    try {
      // 确保数据是纯JSON对象，可以序列化
      const processedChapters = chapters.map((chapter, index) => {
        return {
          id: `chapter_${Date.now()}_${index}`,
          title: String(chapter.title),
          order: Number(chapter.order),
          estimatedTime: Number(chapter.estimatedTime),
          completed: false,
          dependencies: Array.isArray(chapter.dependencies) 
            ? chapter.dependencies.map(d => String(d))
            : [],
          tasks: generateTasksForChapter(String(chapter.title), Number(chapter.estimatedTime))
        }
      })
      
      const newPath: LearningPath = {
        id: 'path_' + Date.now(),
        subject: String(subject),
        name: `${subject}学习路径`,
        description: `系统为您定制的${subject}学习计划`,
        totalChapters: processedChapters.length,
        completedChapters: 0,
        currentChapter: 1,
        startDate: new Date().toISOString(),
        estimatedEndDate: calculateEndDate(processedChapters),
        status: 'not-started',
        chapters: processedChapters
      }

      learningPaths.value.push(newPath)
      await saveLearningPathData()
      return newPath
    } catch (error) {
      console.error('创建学习路径失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const startLearningPath = async (pathId: string) => {
    const path = learningPaths.value.find(p => p.id === pathId)
    if (path && path.status === 'not-started') {
      path.status = 'in-progress'
      path.startDate = new Date().toISOString()
      await saveLearningPathData()
    }
  }

  const completeChapter = async (pathId: string, chapterId: string) => {
    const path = learningPaths.value.find(p => p.id === pathId)
    if (!path) return

    const chapter = path.chapters.find(c => c.id === chapterId)
    if (chapter && !chapter.completed) {
      chapter.completed = true
      chapter.completionDate = new Date().toISOString()
      path.completedChapters += 1
      
      // 检查是否可以进入下一章
      const nextChapter = path.chapters.find(c => c.order === chapter.order + 1)
      if (nextChapter && areDependenciesMet(path, nextChapter)) {
        path.currentChapter = nextChapter.order
      }
      
      // 检查路径是否完成
      if (path.completedChapters === path.totalChapters) {
        path.status = 'completed'
        path.estimatedEndDate = new Date().toISOString()
      }
      
      await saveLearningPathData()
    }
  }

  const generateWeeklyPlan = async (startDate: string, days: number = 7) => {
    isLoading.value = true
    try {
      const plans: StudyPlan[] = []
      const currentDate = new Date(startDate)
      
      for (let i = 0; i < days; i++) {
        const dateStr = currentDate.toISOString().split('T')[0]
        const dailyTasks = generateDailyTasks(dateStr)
        
        const plan: StudyPlan = {
          id: `plan_${Date.now()}_${i}`,
          date: dateStr,
          tasks: dailyTasks,
          completed: false
        }
        
        plans.push(plan)
        currentDate.setDate(currentDate.getDate() + 1)
      }
      
      studyPlans.value = [...studyPlans.value.filter(p => 
        new Date(p.date) < new Date(startDate)
      ), ...plans]
      
      await saveStudyPlanData()
      return plans
    } catch (error) {
      console.error('生成学习计划失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const completePlannedTask = async (planId: string, taskId: string) => {
    const plan = studyPlans.value.find(p => p.id === planId)
    if (!plan) return

    const task = plan.tasks.find(t => t.id === taskId)
    if (task && !task.completed) {
      task.completed = true
      
      // 检查计划是否完成
      if (plan.tasks.every(t => t.completed)) {
        plan.completed = true
      }
      
      await saveStudyPlanData()
    }
  }

  const getSubjectRecommendation = (subject: string) => {
    const subjectPaths = learningPaths.value.filter(path => path.subject === subject)
    
    if (subjectPaths.length === 0) {
      // 返回默认学习路径建议
      return getDefaultPathStructure(subject)
    }
    
    // 基于已完成路径给出建议
    const completedPaths = subjectPaths.filter(path => path.status === 'completed')
    if (completedPaths.length > 0) {
      return {
        recommendation: '您已完成该科目的学习，建议进行复习或开始下一科目',
        nextSteps: ['制定复习计划', '开始模拟考试', '查漏补缺']
      }
    }
    
    const inProgressPath = subjectPaths.find(path => path.status === 'in-progress')
    if (inProgressPath) {
      const progress = Math.round((inProgressPath.completedChapters / inProgressPath.totalChapters) * 100)
      return {
        recommendation: `当前进度${progress}%，继续保持！`,
        nextSteps: [`完成第${inProgressPath.currentChapter}章`, '按计划执行每日任务', '定期回顾已完成内容']
      }
    }
    
    return {
      recommendation: '您有待开始的学习路径',
      nextSteps: ['开始学习路径', '制定详细计划', '设置学习目标']
    }
  }

  const getPathStatistics = (subject?: string) => {
    let paths = learningPaths.value
    if (subject) {
      paths = paths.filter(path => path.subject === subject)
    }
    
    return {
      totalPaths: paths.length,
      completedPaths: paths.filter(p => p.status === 'completed').length,
      inProgressPaths: paths.filter(p => p.status === 'in-progress').length,
      totalChapters: paths.reduce((sum, path) => sum + path.totalChapters, 0),
      completedChapters: paths.reduce((sum, path) => sum + path.completedChapters, 0),
      averageProgress: paths.length > 0 
        ? Math.round(paths.reduce((sum, path) => sum + (path.completedChapters / path.totalChapters) * 100, 0) / paths.length)
        : 0
    }
  }

  // 基于真实学习记录生成智能建议
  const analyzeStudyRecords = () => {
    const studyStore = useStudyStore()
    
    // 获取各科目学习时间统计
    const subjectStats = studyStore.subjectStats
    
    // 计算总学习时间
    const totalStudyTime = Object.values(subjectStats).reduce((sum, stat) => sum + stat.totalTime, 0)
    
    // 分析学习频率和习惯
    const recentRecords = studyStore.studyRecords.slice(-30) // 最近30条记录
    const studyDays = new Set(recentRecords.map(r => r.date)).size
    const avgDailyTime = studyDays > 0 ? totalStudyTime / studyDays : 0
    
    // 识别主要学习科目
    const sortedSubjects = Object.entries(subjectStats)
      .sort((a, b) => b[1].totalTime - a[1].totalTime)
      .map(([subject, stats]) => ({
        subject,
        totalTime: stats.totalTime,
        sessions: stats.sessions,
        percentage: totalStudyTime > 0 ? Math.round((stats.totalTime / totalStudyTime) * 100) : 0
      }))
    
    // 生成建议
    const recommendations: string[] = []
    
    if (sortedSubjects.length === 0) {
      recommendations.push('还没有学习记录，建议开始创建学习路径')
    } else {
      // 基于学习时间的建议
      const topSubject = sortedSubjects[0]
      recommendations.push(`您在学习${topSubject.subject}上投入最多时间（${Math.round(topSubject.totalTime / 60)}小时）`)
      
      // 检查是否偏科
      if (sortedSubjects.length > 1) {
        const secondSubject = sortedSubjects[1]
        if (topSubject.percentage > 50 && secondSubject.percentage < 20) {
          recommendations.push(`建议平衡各科学习时间，目前${topSubject.subject}占比过高`)
        }
      }
      
      // 学习频率建议
      if (studyDays < 15 && recentRecords.length > 0) {
        recommendations.push('学习频率较低，建议保持每天学习的习惯')
      }
      
      // 每日学习时间建议
      if (avgDailyTime > 0) {
        if (avgDailyTime < 60) {
          recommendations.push(`日均学习时间${Math.round(avgDailyTime)}分钟，建议增加到2-3小时`)
        } else if (avgDailyTime > 300) {
          recommendations.push('学习时间充足，注意劳逸结合')
        }
      }
    }
    
    return {
      totalStudyTime,
      studyDays,
      avgDailyTime: Math.round(avgDailyTime),
      subjectDistribution: sortedSubjects,
      recommendations
    }
  }

  // ========== 测评系统 ==========
  
  // 获取测评题目
  const getAssessmentQuestions = (subject: string): AssessmentQuestion[] => {
    // 这里使用简化的示例题目，实际应该从配置文件或后端获取
    const questionBank: Record<string, AssessmentQuestion[]> = {
      '数学一': [
        {
          id: 'math_1',
          question: 'lim(x→0) sin(x)/x 的值是？',
          options: ['0', '1', '∞', '不存在'],
          correctAnswer: 1,
          difficulty: 'easy',
          knowledgePoint: '极限'
        },
        {
          id: 'math_2',
          question: '函数f(x) = x²在x=1处的导数是？',
          options: ['0', '1', '2', '3'],
          correctAnswer: 2,
          difficulty: 'easy',
          knowledgePoint: '导数'
        },
        {
          id: 'math_3',
          question: '∫₀¹ x dx 的值是？',
          options: ['0', '1/2', '1', '2'],
          correctAnswer: 1,
          difficulty: 'medium',
          knowledgePoint: '积分'
        },
        {
          id: 'math_4',
          question: '矩阵A的行列式det(A)=0，则A是？',
          options: ['可逆矩阵', '奇异矩阵', '单位矩阵', '对角矩阵'],
          correctAnswer: 1,
          difficulty: 'medium',
          knowledgePoint: '线性代数'
        },
        {
          id: 'math_5',
          question: '概率P(A∪B) = P(A) + P(B) - ？',
          options: ['P(A∩B)', 'P(A)P(B)', 'P(A|B)', 'P(B|A)'],
          correctAnswer: 0,
          difficulty: 'medium',
          knowledgePoint: '概率论'
        }
      ],
      '英语一': [
        {
          id: 'eng_1',
          question: '"ubiquitous"的意思是？',
          options: ['罕见的', '普遍存在的', '独特的', '复杂的'],
          correctAnswer: 1,
          difficulty: 'medium',
          knowledgePoint: '词汇'
        },
        {
          id: 'eng_2',
          question: 'Which sentence is grammatically correct?',
          options: [
            'He don\'t like apples.',
            'She have a book.',
            'They are students.',
            'I is happy.'
          ],
          correctAnswer: 2,
          difficulty: 'easy',
          knowledgePoint: '语法'
        },
        {
          id: 'eng_3',
          question: '"Nevertheless"在句子中通常表示？',
          options: ['因果关系', '转折关系', '递进关系', '并列关系'],
          correctAnswer: 1,
          difficulty: 'medium',
          knowledgePoint: '逻辑关系'
        },
        {
          id: 'eng_4',
          question: '阅读理解中，"main idea"指的是？',
          options: ['细节信息', '文章主旨', '作者态度', '写作手法'],
          correctAnswer: 1,
          difficulty: 'easy',
          knowledgePoint: '阅读技巧'
        },
        {
          id: 'eng_5',
          question: '写作中，"thesis statement"应该出现在？',
          options: ['文章开头', '文章中间', '文章结尾', '任意位置'],
          correctAnswer: 0,
          difficulty: 'medium',
          knowledgePoint: '写作结构'
        }
      ],
      '408计算机科学综合': [
        {
          id: 'cs_1',
          question: '时间复杂度O(n log n)的排序算法是？',
          options: ['冒泡排序', '快速排序', '插入排序', '选择排序'],
          correctAnswer: 1,
          difficulty: 'medium',
          knowledgePoint: '数据结构'
        },
        {
          id: 'cs_2',
          question: 'CPU中负责指令译码的是？',
          options: ['ALU', 'CU', '寄存器', 'Cache'],
          correctAnswer: 1,
          difficulty: 'medium',
          knowledgePoint: '组成原理'
        },
        {
          id: 'cs_3',
          question: '进程和线程的主要区别是？',
          options: [
            '进程有独立内存空间，线程共享',
            '线程有独立内存空间，进程共享',
            '没有区别',
            '进程更快'
          ],
          correctAnswer: 0,
          difficulty: 'medium',
          knowledgePoint: '操作系统'
        },
        {
          id: 'cs_4',
          question: 'TCP三次握手的目的是？',
          options: [
            '传输数据',
            '建立可靠连接',
            '断开连接',
            '加密数据'
          ],
          correctAnswer: 1,
          difficulty: 'easy',
          knowledgePoint: '计算机网络'
        },
        {
          id: 'cs_5',
          question: '二叉树的前序遍历顺序是？',
          options: [
            '左-根-右',
            '根-左-右',
            '左-右-根',
            '右-根-左'
          ],
          correctAnswer: 1,
          difficulty: 'easy',
          knowledgePoint: '数据结构'
        }
      ],
      '政治': [
        {
          id: 'pol_1',
          question: '马克思主义的核心是？',
          options: ['唯物史观', '剩余价值理论', '科学社会主义', '以上都是'],
          correctAnswer: 3,
          difficulty: 'easy',
          knowledgePoint: '马原'
        },
        {
          id: 'pol_2',
          question: '中国特色的社会主义最本质的特征是？',
          options: ['人民当家作主', '党的领导', '依法治国', '改革开放'],
          correctAnswer: 1,
          difficulty: 'easy',
          knowledgePoint: '毛中特'
        },
        {
          id: 'pol_3',
          question: '近代中国社会的性质是？',
          options: ['封建社会', '资本主义社会', '半殖民地半封建社会', '社会主义社会'],
          correctAnswer: 2,
          difficulty: 'easy',
          knowledgePoint: '史纲'
        },
        {
          id: 'pol_4',
          question: '社会主义核心价值观中，个人层面的要求是？',
          options: [
            '富强、民主、文明、和谐',
            '自由、平等、公正、法治',
            '爱国、敬业、诚信、友善',
            '改革、创新、开放、包容'
          ],
          correctAnswer: 2,
          difficulty: 'medium',
          knowledgePoint: '思修'
        },
        {
          id: 'pol_5',
          question: '矛盾的基本属性是？',
          options: ['普遍性和特殊性', '同一性和斗争性', '主要性和次要性', '内部性和外部性'],
          correctAnswer: 1,
          difficulty: 'medium',
          knowledgePoint: '马原'
        }
      ]
    }
    
    return questionBank[subject] || []
  }

  // 开始测评
  const startAssessment = (subject: string) => {
    const questions = getAssessmentQuestions(subject)
    if (questions.length === 0) {
      throw new Error('该科目暂无测评题目')
    }
    
    currentAssessment.value = {
      subject,
      questions,
      currentIndex: 0,
      answers: new Array(questions.length).fill(-1),
      startTime: Date.now()
    }
  }

  // 回答题目
  const answerQuestion = (questionIndex: number, answerIndex: number) => {
    if (!currentAssessment.value) return
    
    currentAssessment.value.answers[questionIndex] = answerIndex
  }

  // 下一题
  const nextQuestion = () => {
    if (!currentAssessment.value) return false
    
    if (currentAssessment.value.currentIndex < currentAssessment.value.questions.length - 1) {
      currentAssessment.value.currentIndex++
      return true
    }
    return false
  }

  // 上一题
  const prevQuestion = () => {
    if (!currentAssessment.value) return false
    
    if (currentAssessment.value.currentIndex > 0) {
      currentAssessment.value.currentIndex--
      return true
    }
    return false
  }

  // 提交测评
  const submitAssessment = (): AssessmentResult | null => {
    if (!currentAssessment.value) return null
    
    const { subject, questions, answers } = currentAssessment.value
    let correctCount = 0
    const weakAreasSet = new Set<string>()
    const strongAreasSet = new Set<string>()
    
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correctCount++
        strongAreasSet.add(q.knowledgePoint)
      } else {
        weakAreasSet.add(q.knowledgePoint)
      }
    })
    
    const score = Math.round((correctCount / questions.length) * 100)
    // const duration = (Date.now() - currentAssessment.value.startTime) / 1000 / 60 // 分钟
    
    // 评估水平
    let overallLevel: 'beginner' | 'intermediate' | 'advanced'
    if (score >= 80) {
      overallLevel = 'advanced'
    } else if (score >= 60) {
      overallLevel = 'intermediate'
    } else {
      overallLevel = 'beginner'
    }
    
    // 预估学习时间（基于水平和科目难度）
    const baseHours: Record<string, number> = {
      '数学一': 400,
      '英语一': 300,
      '408计算机科学综合': 500,
      '政治': 200
    }
    
    const levelMultiplier: Record<string, number> = {
      'beginner': 1.5,
      'intermediate': 1.0,
      'advanced': 0.7
    }
    
    const estimatedStudyTime = Math.round(
      (baseHours[subject] || 300) * levelMultiplier[overallLevel]
    )
    
    const result: AssessmentResult = {
      subject,
      overallLevel,
      score,
      correctCount,
      totalCount: questions.length,
      weakAreas: Array.from(weakAreasSet),
      strongAreas: Array.from(strongAreasSet),
      estimatedStudyTime,
      takenAt: new Date().toISOString()
    }
    
    assessmentResults.value.push(result)
    currentAssessment.value = null
    
    return result
  }

  // 取消测评
  const cancelAssessment = () => {
    currentAssessment.value = null
  }

  // ========== 艾宾浩斯遗忘曲线复习系统 ==========
  
  // 生成艾宾浩斯复习日期
  const generateReviewDates = (learnDate: string): string[] => {
    const dates: string[] = []
    const learn = new Date(learnDate)
    
    // 艾宾浩斯遗忘曲线复习间隔（天）
    const intervals = [1, 2, 4, 7, 15, 30]
    
    intervals.forEach(days => {
      const reviewDate = new Date(learn)
      reviewDate.setDate(learn.getDate() + days)
      dates.push(reviewDate.toISOString().split('T')[0])
    })
    
    return dates
  }
  
  // 计算记忆保持率（基于艾宾浩斯曲线）
  const calculateRetentionRate = (daysSinceLearn: number, reviewCount: number): number => {
    // 基础遗忘曲线：R = e^(-t/S)，S为记忆强度
    // 每次复习会增加记忆强度
    const baseStrength = 1.5 // 基础记忆强度
    const strengthIncrease = 0.5 * reviewCount // 每次复习增加的强度
    const S = baseStrength + strengthIncrease
    
    // 记忆保持率
    const retention = Math.exp(-daysSinceLearn / S)
    return Math.max(0, Math.min(1, retention))
  }
  
  // 创建复习计划
  const createReviewSchedule = (knowledgePointId: string, knowledgePointName: string, subject: string, learnDate: string) => {
    const reviewDates = generateReviewDates(learnDate)
    
    const schedule: ReviewSchedule = {
      knowledgePointId,
      knowledgePointName,
      subject,
      learnDate,
      reviewDates,
      completedReviews: 0,
      nextReviewDate: reviewDates[0],
      retentionRate: 1.0,
      status: 'pending'
    }
    
    reviewSchedules.value.push(schedule)
    saveReviewData()
    
    return schedule
  }
  
  // 完成复习
  const completeReview = (knowledgePointId: string) => {
    const schedule = reviewSchedules.value.find(s => s.knowledgePointId === knowledgePointId)
    if (!schedule) return false
    
    schedule.completedReviews++
    
    // 更新下次复习日期
    if (schedule.completedReviews < schedule.reviewDates.length) {
      schedule.nextReviewDate = schedule.reviewDates[schedule.completedReviews]
      schedule.status = 'pending'
    } else {
      schedule.status = 'completed'
      schedule.nextReviewDate = ''
    }
    
    // 更新记忆保持率
    const daysSinceLearn = Math.floor(
      (new Date().getTime() - new Date(schedule.learnDate).getTime()) / (1000 * 60 * 60 * 24)
    )
    schedule.retentionRate = calculateRetentionRate(daysSinceLearn, schedule.completedReviews)
    
    saveReviewData()
    return true
  }
  
  // 获取今日需要复习的知识点
  const getTodayReviews = (): ReviewSchedule[] => {
    const today = new Date().toISOString().split('T')[0]
    
    return reviewSchedules.value.filter(schedule => {
      return schedule.nextReviewDate === today && schedule.status === 'pending'
    })
  }
  
  // 获取所有待复习的知识点
  const getPendingReviews = (): ReviewSchedule[] => {
    const today = new Date().toISOString().split('T')[0]
    
    return reviewSchedules.value.filter(schedule => {
      if (schedule.status === 'completed') return false
      
      // 检查是否过期
      if (schedule.nextReviewDate < today) {
        schedule.status = 'overdue'
      }
      
      return schedule.status === 'pending' || schedule.status === 'overdue'
    })
  }
  
  // ========== 掌握度追踪系统 ==========
  
  // 更新掌握度记录
  const updateMasteryRecord = (knowledgePointId: string, knowledgePointName: string, subject: string, score?: number) => {
    let record = masteryRecords.value.find(r => r.knowledgePointId === knowledgePointId)
    
    if (!record) {
      // 创建新记录
      record = {
        knowledgePointId,
        knowledgePointName,
        subject,
        masteryScore: score || 50,
        lastStudied: new Date().toISOString(),
        studyCount: 1,
        reviewCount: 0,
        testScores: score ? [score] : [],
        trend: 'stable'
      }
      masteryRecords.value.push(record)
    } else {
      // 更新现有记录
      record.lastStudied = new Date().toISOString()
      record.studyCount++
      
      if (score !== undefined) {
        record.testScores.push(score)
        // 保留最近10次成绩
        if (record.testScores.length > 10) {
          record.testScores.shift()
        }
        
        // 计算新的掌握度分数（加权平均）
        const recentScores = record.testScores.slice(-5) // 最近5次
        record.masteryScore = Math.round(
          recentScores.reduce((sum, s) => sum + s, 0) / recentScores.length
        )
        
        // 判断趋势
        if (record.testScores.length >= 2) {
          const lastScore = record.testScores[record.testScores.length - 1]
          const prevScore = record.testScores[record.testScores.length - 2]
          
          if (lastScore > prevScore + 5) {
            record.trend = 'improving'
          } else if (lastScore < prevScore - 5) {
            record.trend = 'declining'
          } else {
            record.trend = 'stable'
          }
        }
      }
    }
    
    saveMasteryData()
    return record
  }
  
  // 获取科目掌握度统计
  const getSubjectMasteryStats = (subject: string) => {
    const records = masteryRecords.value.filter(r => r.subject === subject)
    
    if (records.length === 0) {
      return {
        averageMastery: 0,
        totalPoints: 0,
        improving: 0,
        stable: 0,
        declining: 0,
        weakPoints: [] as string[],
        strongPoints: [] as string[]
      }
    }
    
    const averageMastery = Math.round(
      records.reduce((sum, r) => sum + r.masteryScore, 0) / records.length
    )
    
    const weakPoints = records
      .filter(r => r.masteryScore < 60)
      .map(r => r.knowledgePointName)
    
    const strongPoints = records
      .filter(r => r.masteryScore >= 85)
      .map(r => r.knowledgePointName)
    
    return {
      averageMastery,
      totalPoints: records.length,
      improving: records.filter(r => r.trend === 'improving').length,
      stable: records.filter(r => r.trend === 'stable').length,
      declining: records.filter(r => r.trend === 'declining').length,
      weakPoints,
      strongPoints
    }
  }
  
  // 获取需要重点复习的知识点
  const getWeakKnowledgePoints = (limit = 10): MasteryRecord[] => {
    return masteryRecords.value
      .filter(r => r.masteryScore < 70 || r.trend === 'declining')
      .sort((a, b) => a.masteryScore - b.masteryScore)
      .slice(0, limit)
  }

  // ========== 学习分析系统 ==========
  
  // 学习效率趋势分析
  interface EfficiencyTrend {
    date: string
    studyTime: number // 分钟
    completedTasks: number
    efficiency: number // 效率分数 0-100
  }
  
  const getEfficiencyTrend = (days = 30): EfficiencyTrend[] => {
    const studyStore = useStudyStore()
    const trends: EfficiencyTrend[] = []
    
    // 获取最近N天的数据
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      // 查找该日期的学习记录
      const dayRecords = studyStore.studyRecords.filter(r => r.date === dateStr)
      const studyTime = dayRecords.reduce((sum, r) => sum + r.duration, 0)
      const completedTasks = dayRecords.length
      
      // 计算效率分数（基于学习时间和任务完成数）
      const timeScore = Math.min(studyTime / 180, 1) * 50 // 最多3小时得50分
      const taskScore = Math.min(completedTasks / 5, 1) * 50 // 最多5个任务得50分
      const efficiency = Math.round(timeScore + taskScore)
      
      trends.push({
        date: dateStr,
        studyTime,
        completedTasks,
        efficiency
      })
    }
    
    return trends
  }
  
  // 最佳学习时段识别
  interface TimeSlotAnalysis {
    hour: number
    avgEfficiency: number
    sessionCount: number
    label: string
  }
  
  const getOptimalStudyTimes = (): TimeSlotAnalysis[] => {
    const studyStore = useStudyStore()
    const hourStats: Record<number, { totalEfficiency: number; count: number }> = {}
    
    // 初始化24小时
    for (let i = 0; i < 24; i++) {
      hourStats[i] = { totalEfficiency: 0, count: 0 }
    }
    
    // 分析每条记录的学习时段
    studyStore.studyRecords.forEach(record => {
      // 从createdAt提取小时（ISO格式）
      if (record.createdAt) {
        const date = new Date(record.createdAt)
        const hour = date.getHours()
        if (!isNaN(hour)) {
          // 估算效率（基于持续时间）
          const efficiency = Math.min(record.duration / 60, 1) * 100
          hourStats[hour].totalEfficiency += efficiency
          hourStats[hour].count++
        }
      }
    })
    
    // 转换为数组并排序
    const timeSlots: TimeSlotAnalysis[] = Object.entries(hourStats)
      .map(([hour, stats]) => ({
        hour: parseInt(hour),
        avgEfficiency: stats.count > 0 ? Math.round(stats.totalEfficiency / stats.count) : 0,
        sessionCount: stats.count,
        label: `${hour}:00-${hour + 1}:00`
      }))
      .filter(slot => slot.sessionCount > 0) // 只返回有数据的时段
      .sort((a, b) => b.avgEfficiency - a.avgEfficiency) // 按效率降序
    
    return timeSlots.slice(0, 5) // 返回前5个最佳时段
  }
  
  // 科目时间分布分析
  interface SubjectDistribution {
    subject: string
    totalTime: number
    percentage: number
    sessions: number
    avgSessionTime: number
  }
  
  const getSubjectDistribution = (): SubjectDistribution[] => {
    const studyStore = useStudyStore()
    const subjectStats = studyStore.subjectStats
    
    const totalAllTime = Object.values(subjectStats).reduce((sum, stat) => sum + stat.totalTime, 0)
    
    return Object.entries(subjectStats)
      .map(([subject, stats]) => ({
        subject,
        totalTime: stats.totalTime,
        percentage: totalAllTime > 0 ? Math.round((stats.totalTime / totalAllTime) * 100) : 0,
        sessions: stats.sessions,
        avgSessionTime: stats.sessions > 0 ? Math.round(stats.totalTime / stats.sessions) : 0
      }))
      .sort((a, b) => b.totalTime - a.totalTime)
  }
  
  // 学习习惯分析
  interface StudyHabit {
    metric: string
    value: string | number
    description: string
    icon: string
  }
  
  const analyzeStudyHabits = (): StudyHabit[] => {
    const studyStore = useStudyStore()
    const habits: StudyHabit[] = []
    
    // 总学习时间
    const totalTime = Object.values(studyStore.subjectStats)
      .reduce((sum, stat) => sum + stat.totalTime, 0)
    
    habits.push({
      metric: '总学习时间',
      value: `${Math.round(totalTime / 60)}小时`,
      description: '累计学习时长',
      icon: '⏱️'
    })
    
    // 学习天数
    const studyDays = new Set(studyStore.studyRecords.map(r => r.date)).size
    habits.push({
      metric: '学习天数',
      value: studyDays,
      description: '有学习记录的天数',
      icon: '📅'
    })
    
    // 平均每日学习时间
    if (studyDays > 0) {
      const avgDaily = Math.round(totalTime / studyDays / 60 * 10) / 10
      habits.push({
        metric: '日均学习',
        value: `${avgDaily}小时`,
        description: '平均每天学习时长',
        icon: '📊'
      })
    }
    
    // 最长连续学习
    let maxStreak = 0
    let currentStreak = 0
    const sortedDates = [...new Set(studyStore.studyRecords.map(r => r.date))].sort()
    
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        currentStreak = 1
      } else {
        const prevDate = new Date(sortedDates[i - 1])
        const currDate = new Date(sortedDates[i])
        const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
        
        if (diffDays === 1) {
          currentStreak++
        } else {
          maxStreak = Math.max(maxStreak, currentStreak)
          currentStreak = 1
        }
      }
    }
    maxStreak = Math.max(maxStreak, currentStreak)
    
    habits.push({
      metric: '最长连续',
      value: `${maxStreak}天`,
      description: '最长连续学习天数',
      icon: '🔥'
    })
    
    // 学习科目数
    habits.push({
      metric: '学习科目',
      value: Object.keys(studyStore.subjectStats).length,
      description: '正在学习的科目数量',
      icon: '📚'
    })
    
    return habits
  }
  
  // 完成时间预测
  interface CompletionPrediction {
    subject: string
    estimatedDays: number
    estimatedDate: string
    confidence: number // 置信度 0-1
    factors: string[]
  }
  
  const predictCompletionTime = (subject: string): CompletionPrediction | null => {
    const path = learningPaths.value.find(p => p.subject === subject && p.status === 'in-progress')
    if (!path) return null
    
    const studyStore = useStudyStore()
    const subjectStats = studyStore.subjectStats[subject]
    
    if (!subjectStats || subjectStats.sessions === 0) {
      return null
    }
    
    // 计算剩余工作量
    const completedChapters = path.chapters.filter(c => c.completed).length
    const totalChapters = path.chapters.length
    const remainingChapters = totalChapters - completedChapters
    
    // 计算平均学习速度（章节/天）
    const daysSinceStart = Math.max(
      1,
      Math.floor(
        (new Date().getTime() - new Date(path.startDate).getTime()) / (1000 * 60 * 60 * 24)
      )
    )
    const chaptersPerDay = completedChapters / daysSinceStart
    
    // 预测剩余天数
    const estimatedDays = chaptersPerDay > 0 
      ? Math.ceil(remainingChapters / chaptersPerDay)
      : 999
    
    // 预测完成日期
    const completionDate = new Date()
    completionDate.setDate(completionDate.getDate() + estimatedDays)
    
    // 计算置信度（基于数据量）
    const confidence = Math.min(daysSinceStart / 30, 1) // 30天以上数据置信度高
    
    // 影响因素
    const factors: string[] = []
    if (chaptersPerDay > 0.5) {
      factors.push('学习进度良好')
    } else if (chaptersPerDay > 0.2) {
      factors.push('学习进度一般')
    } else {
      factors.push('学习进度较慢')
    }
    
    if (confidence > 0.7) {
      factors.push('预测可信度高')
    } else if (confidence > 0.4) {
      factors.push('预测可信度中等')
    } else {
      factors.push('需要更多数据')
    }
    
    return {
      subject,
      estimatedDays,
      estimatedDate: completionDate.toISOString().split('T')[0],
      confidence: Math.round(confidence * 100) / 100,
      factors
    }
  }
  
  // 综合学习报告
  interface LearningReport {
    summary: {
      totalTime: number
      studyDays: number
      subjects: number
      averageEfficiency: number
    }
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
  }
  
  const generateLearningReport = (): LearningReport => {
    const studyStore = useStudyStore()
    
    // 基础统计
    const totalTime = Object.values(studyStore.subjectStats)
      .reduce((sum, stat) => sum + stat.totalTime, 0)
    const studyDays = new Set(studyStore.studyRecords.map(r => r.date)).size
    const subjects = Object.keys(studyStore.subjectStats).length
    
    // 计算平均效率
    const recentTrends = getEfficiencyTrend(7)
    const averageEfficiency = recentTrends.length > 0
      ? Math.round(recentTrends.reduce((sum, t) => sum + t.efficiency, 0) / recentTrends.length)
      : 0
    
    // 优势分析
    const strengths: string[] = []
    const distribution = getSubjectDistribution()
    if (distribution.length > 0) {
      const topSubject = distribution[0]
      strengths.push(`${topSubject.subject}投入时间最多（${Math.round(topSubject.totalTime / 60)}小时）`)
    }
    
    const optimalTimes = getOptimalStudyTimes()
    if (optimalTimes.length > 0) {
      strengths.push(`最佳学习时段：${optimalTimes[0].label}（效率${optimalTimes[0].avgEfficiency}%）`)
    }
    
    // 弱势分析
    const weaknesses: string[] = []
    const weakPoints = getWeakKnowledgePoints(5)
    if (weakPoints.length > 0) {
      weaknesses.push(`${weakPoints.length}个知识点掌握度较低`)
    }
    
    if (studyDays < 7) {
      weaknesses.push('学习频率不够稳定')
    }
    
    // 建议
    const recommendations: string[] = []
    if (distribution.length > 1) {
      const imbalance = distribution.some(d => d.percentage > 60)
      if (imbalance) {
        recommendations.push('建议平衡各科学习时间，避免偏科')
      }
    }
    
    if (averageEfficiency < 50) {
      recommendations.push('尝试在高效时段学习，提升学习效果')
    }
    
    if (weakPoints.length > 3) {
      recommendations.push('优先复习薄弱知识点，巩固基础')
    }
    
    recommendations.push('保持连续学习，建立稳定的学习习惯')
    
    return {
      summary: {
        totalTime,
        studyDays,
        subjects,
        averageEfficiency
      },
      strengths,
      weaknesses,
      recommendations
    }
  }

  // ========== 游戏化系统 ==========
  
  // 初始化成就列表
  const initializeAchievements = () => {
    const defaultAchievements: Achievement[] = [
      // 学习类成就
      {
        id: 'first_study',
        name: '第一步',
        description: '完成第一次学习',
        icon: '🎯',
        category: 'study',
        condition: (store) => store.studyStore.studyRecords.length >= 1,
        unlocked: false,
        xpReward: 50
      },
      {
        id: 'study_10_hours',
        name: '勤奋学习者',
        description: '累计学习10小时',
        icon: '⏱️',
        category: 'study',
        condition: (store) => {
          const totalTime = Object.values(store.studyStore.subjectStats)
            .reduce((sum: number, stat: any) => sum + stat.totalTime, 0)
          return totalTime >= 600 // 10小时 = 600分钟
        },
        unlocked: false,
        xpReward: 100
      },
      {
        id: 'study_50_hours',
        name: '学霸',
        description: '累计学习50小时',
        icon: '📚',
        category: 'study',
        condition: (store) => {
          const totalTime = Object.values(store.studyStore.subjectStats)
            .reduce((sum: number, stat: any) => sum + stat.totalTime, 0)
          return totalTime >= 3000 // 50小时
        },
        unlocked: false,
        xpReward: 300
      },
      {
        id: 'study_100_hours',
        name: '学习大师',
        description: '累计学习100小时',
        icon: '👑',
        category: 'study',
        condition: (store) => {
          const totalTime = Object.values(store.studyStore.subjectStats)
            .reduce((sum: number, stat: any) => sum + stat.totalTime, 0)
          return totalTime >= 6000 // 100小时
        },
        unlocked: false,
        xpReward: 500
      },
      
      // Streaks成就
      {
        id: 'streak_3_days',
        name: '坚持3天',
        description: '连续学习3天',
        icon: '🔥',
        category: 'streak',
        condition: (store) => store.streakData.currentStreak >= 3,
        unlocked: false,
        xpReward: 80
      },
      {
        id: 'streak_7_days',
        name: '一周不间断',
        description: '连续学习7天',
        icon: '💪',
        category: 'streak',
        condition: (store) => store.streakData.currentStreak >= 7,
        unlocked: false,
        xpReward: 200
      },
      {
        id: 'streak_30_days',
        name: '月度冠军',
        description: '连续学习30天',
        icon: '🏆',
        category: 'streak',
        condition: (store) => store.streakData.currentStreak >= 30,
        unlocked: false,
        xpReward: 1000
      },
      
      // 里程碑成就
      {
        id: 'complete_first_chapter',
        name: '初战告捷',
        description: '完成第一个章节',
        icon: '✅',
        category: 'milestone',
        condition: (store) => {
          return store.learningPaths.some((path: any) => 
            path.chapters.some((chapter: any) => chapter.completed)
          )
        },
        unlocked: false,
        xpReward: 100
      },
      {
        id: 'complete_path',
        name: '完美收官',
        description: '完成一个完整的学习路径',
        icon: '🎓',
        category: 'milestone',
        condition: (store) => {
          return store.learningPaths.some((path: any) => 
            path.status === 'completed'
          )
        },
        unlocked: false,
        xpReward: 500
      },
      
      // 掌握度成就
      {
        id: 'master_one_point',
        name: '精通一点',
        description: '有一个知识点掌握度达到90分以上',
        icon: '⭐',
        category: 'mastery',
        condition: (store) => {
          return store.masteryRecords.some((record: any) => record.masteryScore >= 90)
        },
        unlocked: false,
        xpReward: 150
      },
      {
        id: 'master_five_points',
        name: '博学多才',
        description: '有5个知识点掌握度达到90分以上',
        icon: '🌟',
        category: 'mastery',
        condition: (store) => {
          return store.masteryRecords.filter((record: any) => record.masteryScore >= 90).length >= 5
        },
        unlocked: false,
        xpReward: 400
      }
    ]
    
    achievements.value = defaultAchievements
  }
  
  // 检查并解锁成就
  const checkAndUnlockAchievements = () => {
    const studyStore = useStudyStore()
    let newUnlocks = 0
    
    achievements.value.forEach(achievement => {
      if (!achievement.unlocked && achievement.condition({ 
        studyStore, 
        masteryRecords: masteryRecords.value, 
        learningPaths: learningPaths.value, 
        streakData: streakData.value 
      })) {
        achievement.unlocked = true
        achievement.unlockedAt = new Date().toISOString()
        
        // 奖励经验值
        addXP(achievement.xpReward)
        newUnlocks++
      }
    })
    
    if (newUnlocks > 0) {
      saveGameData()
    }
    
    return newUnlocks
  }
  
  // 添加经验值
  const addXP = (amount: number) => {
    userLevel.value.currentXP += amount
    userLevel.value.totalXP += amount
    
    // 检查是否升级
    while (userLevel.value.currentXP >= userLevel.value.nextLevelXP) {
      levelUp()
    }
    
    saveGameData()
  }
  
  // 升级
  const levelUp = () => {
    userLevel.value.currentXP -= userLevel.value.nextLevelXP
    userLevel.value.level++
    
    // 计算下一级所需经验（指数增长）
    userLevel.value.nextLevelXP = Math.floor(100 * Math.pow(1.5, userLevel.value.level - 1))
    
    // 更新称号
    userLevel.value.title = getLevelTitle(userLevel.value.level)
  }
  
  // 获取等级称号
  const getLevelTitle = (level: number): string => {
    const titles = [
      '初学者',    // 1
      '学习者',    // 2
      '进阶者',    // 3
      '熟练者',    // 4
      '专家',      // 5
      '大师',      // 6
      '宗师',      // 7
      '传奇',      // 8
      '神话',      // 9
      '至尊'       // 10+
    ]
    return titles[Math.min(level - 1, titles.length - 1)]
  }
  
  // 更新Streaks
  const updateStreak = () => {
    const today = new Date().toISOString().split('T')[0]
    const studyStore = useStudyStore()
    
    // 检查今天是否有学习记录
    const hasStudiedToday = studyStore.studyRecords.some(record => record.date === today)
    
    if (!hasStudiedToday) return
    
    // 如果已经是今天的记录，不重复更新
    if (streakData.value.lastStudyDate === today) return
    
    // 检查是否是连续的一天
    if (streakData.value.lastStudyDate) {
      const lastDate = new Date(streakData.value.lastStudyDate)
      const currentDate = new Date(today)
      const diffDays = Math.floor(
        (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      )
      
      if (diffDays === 1) {
        // 连续一天
        streakData.value.currentStreak++
      } else if (diffDays > 1) {
        // 中断，重新开始
        streakData.value.currentStreak = 1
      }
    } else {
      // 第一次学习
      streakData.value.currentStreak = 1
    }
    
    // 更新最长连续
    if (streakData.value.currentStreak > streakData.value.longestStreak) {
      streakData.value.longestStreak = streakData.value.currentStreak
    }
    
    // 添加到历史
    streakData.value.streakHistory.push(today)
    streakData.value.lastStudyDate = today
    
    // 奖励经验值（连续天数越多，奖励越多）
    const streakBonus = Math.min(streakData.value.currentStreak * 10, 100)
    addXP(20 + streakBonus) // 基础20XP + 连续奖励
    
    saveGameData()
  }
  
  // 保存游戏数据
  const saveGameData = async () => {
    // 将响应式对象转换为纯JSON对象
    const plainAchievements = JSON.parse(JSON.stringify(achievements.value))
    const plainLevel = JSON.parse(JSON.stringify(userLevel.value))
    const plainStreak = JSON.parse(JSON.stringify(streakData.value))
    
    await localforage.setItem('achievements', plainAchievements)
    await localforage.setItem('userLevel', plainLevel)
    await localforage.setItem('streakData', plainStreak)
  }
  
  // 加载游戏数据
  const loadGameData = async () => {
    const storedAchievements = await localforage.getItem<Achievement[]>('achievements')
    const storedLevel = await localforage.getItem<UserLevel>('userLevel')
    const storedStreak = await localforage.getItem<StreakData>('streakData')
    
    if (storedAchievements) {
      achievements.value = storedAchievements
    } else {
      initializeAchievements()
    }
    
    if (storedLevel) {
      userLevel.value = storedLevel
    }
    
    if (storedStreak) {
      streakData.value = storedStreak
    }
  }
  
  // 获取已解锁的成就
  const getUnlockedAchievements = (): Achievement[] => {
    return achievements.value.filter(a => a.unlocked)
  }
  
  // 获取未解锁的成就
  const getLockedAchievements = (): Achievement[] => {
    return achievements.value.filter(a => !a.unlocked)
  }
  
  // 获取成就进度
  const getAchievementProgress = () => {
    const total = achievements.value.length
    const unlocked = achievements.value.filter(a => a.unlocked).length
    return {
      total,
      unlocked,
      percentage: total > 0 ? Math.round((unlocked / total) * 100) : 0
    }
  }

  // 辅助方法
  const calculateEndDate = (chapters: Omit<Chapter, 'id' | 'completed' | 'tasks'>[]): string => {
    const totalMinutes = chapters.reduce((sum, chapter) => sum + chapter.estimatedTime, 0)
    const totalDays = Math.ceil(totalMinutes / 120) // 假设每天学习2小时
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + totalDays)
    return endDate.toISOString()
  }

  const areDependenciesMet = (path: LearningPath, chapter: Chapter): boolean => {
    return chapter.dependencies.every(depOrder => {
      const depChapter = path.chapters.find(c => c.order === Number(depOrder))
      return depChapter ? depChapter.completed : true
    })
  }

  const generateTasksForChapter = (chapterTitle: string, estimatedTime: number): Task[] => {
    const taskCount = Math.max(2, Math.floor(estimatedTime / 30)) // 每30分钟一个任务
    const tasks: Task[] = []
    
    for (let i = 0; i < taskCount; i++) {
      tasks.push({
        id: `task_${Date.now()}_${i}`,
        title: `${chapterTitle} - 任务${i + 1}`,
        type: i % 3 === 0 ? 'reading' : i % 3 === 1 ? 'practice' : 'review',
        estimatedTime: Math.min(30, estimatedTime - (i * 30)),
        completed: false,
        priority: i < 2 ? 'high' : 'medium',
        difficulty: i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard'
      })
    }
    
    return tasks
  }

  const generateDailyTasks = (_date: string): PlannedTask[] => {
    const tasks: PlannedTask[] = []
    const activePath = activePaths.value[0] // 简化处理，取第一个活跃路径
    
    if (activePath) {
      const currentChapter = activePath.chapters.find(c => c.order === activePath.currentChapter)
      if (currentChapter && currentChapter.tasks.length > 0) {
        // 为当天分配2-3个任务
        const taskCount = Math.min(3, currentChapter.tasks.length)
        const availableTasks = currentChapter.tasks.filter(t => !t.completed)
        
        for (let i = 0; i < Math.min(taskCount, availableTasks.length); i++) {
          const task = availableTasks[i]
          tasks.push({
            id: `planned_${Date.now()}_${i}`,
            taskId: task.id,
            subject: activePath.subject,
            chapterTitle: currentChapter.title,
            taskTitle: task.title,
            estimatedTime: task.estimatedTime,
            completed: false
          })
        }
      }
    }
    
    return tasks
  }

  const getDefaultPathStructure = (subject: string, level?: 'beginner' | 'intermediate' | 'advanced') => {
    // 根据水平调整时间倍数
    const timeMultiplier = level === 'beginner' ? 1.5 : level === 'advanced' ? 0.7 : 1.0
    
    const structures: Record<string, any> = {
      '408计算机科学综合': {
        name: '408计算机科学综合全程复习计划',
        description: '数据结构、组成原理、操作系统、计算机网络四门课程系统复习',
        chapters: [
          { 
            title: '数据结构基础', 
            order: 1, 
            estimatedTime: Math.round(300 * timeMultiplier), 
            dependencies: [],
            tasks: [
              { title: '线性表', type: 'reading', estimatedTime: 60, priority: 'high' },
              { title: '栈和队列', type: 'reading', estimatedTime: 45, priority: 'medium' },
              { title: '树和二叉树', type: 'reading', estimatedTime: 90, priority: 'high' },
              { title: '图', type: 'reading', estimatedTime: 75, priority: 'high' },
              { title: '查找和排序', type: 'practice', estimatedTime: 60, priority: 'high' }
            ]
          },
          { 
            title: '计算机组成原理', 
            order: 2, 
            estimatedTime: Math.round(300 * timeMultiplier), 
            dependencies: ['1'],
            tasks: [
              { title: '数据的表示和运算', type: 'reading', estimatedTime: 60, priority: 'high' },
              { title: '存储系统', type: 'reading', estimatedTime: 75, priority: 'high' },
              { title: '指令系统', type: 'reading', estimatedTime: 45, priority: 'medium' },
              { title: '中央处理器CPU', type: 'reading', estimatedTime: 90, priority: 'high' },
              { title: '总线与I/O系统', type: 'reading', estimatedTime: 45, priority: 'medium' }
            ]
          },
          { 
            title: '操作系统', 
            order: 3, 
            estimatedTime: Math.round(240 * timeMultiplier), 
            dependencies: ['2'],
            tasks: [
              { title: '进程管理', type: 'reading', estimatedTime: 75, priority: 'high' },
              { title: '内存管理', type: 'reading', estimatedTime: 60, priority: 'high' },
              { title: '文件管理', type: 'reading', estimatedTime: 45, priority: 'medium' },
              { title: 'I/O管理', type: 'reading', estimatedTime: 45, priority: 'medium' }
            ]
          },
          { 
            title: '计算机网络', 
            order: 4, 
            estimatedTime: Math.round(240 * timeMultiplier), 
            dependencies: ['3'],
            tasks: [
              { title: '物理层和数据链路层', type: 'reading', estimatedTime: 60, priority: 'medium' },
              { title: '网络层', type: 'reading', estimatedTime: 75, priority: 'high' },
              { title: '传输层', type: 'reading', estimatedTime: 60, priority: 'high' },
              { title: '应用层', type: 'reading', estimatedTime: 45, priority: 'medium' }
            ]
          },
          {
            title: '真题训练与强化',
            order: 5,
            estimatedTime: Math.round(300 * timeMultiplier),
            dependencies: ['1', '2', '3', '4'],
            tasks: [
              { title: '近5年真题第一遍', type: 'exercise', estimatedTime: 150, priority: 'high' },
              { title: '错题整理与复习', type: 'review', estimatedTime: 90, priority: 'high' },
              { title: '近5年真题第二遍', type: 'exercise', estimatedTime: 120, priority: 'high' }
            ]
          }
        ]
      },
      '数学一': {
        name: '数学一全程复习计划',
        description: '高等数学、线性代数、概率论系统复习',
        chapters: [
          { 
            title: '高等数学上册', 
            order: 1, 
            estimatedTime: Math.round(400 * timeMultiplier), 
            dependencies: [],
            tasks: [
              { title: '函数、极限、连续', type: 'reading', estimatedTime: 60, priority: 'high' },
              { title: '一元函数微分学', type: 'reading', estimatedTime: 90, priority: 'high' },
              { title: '一元函数积分学', type: 'reading', estimatedTime: 90, priority: 'high' },
              { title: '向量代数和空间解析几何', type: 'reading', estimatedTime: 45, priority: 'medium' },
              { title: '多元函数微分学', type: 'reading', estimatedTime: 75, priority: 'high' },
              { title: '多元函数积分学', type: 'reading', estimatedTime: 90, priority: 'high' }
            ]
          },
          { 
            title: '高等数学下册', 
            order: 2, 
            estimatedTime: Math.round(300 * timeMultiplier), 
            dependencies: ['1'],
            tasks: [
              { title: '无穷级数', type: 'reading', estimatedTime: 90, priority: 'high' },
              { title: '常微分方程', type: 'reading', estimatedTime: 75, priority: 'high' },
              { title: '综合练习', type: 'practice', estimatedTime: 120, priority: 'high' }
            ]
          },
          { 
            title: '线性代数', 
            order: 3, 
            estimatedTime: Math.round(240 * timeMultiplier), 
            dependencies: ['1'],
            tasks: [
              { title: '行列式', type: 'reading', estimatedTime: 30, priority: 'medium' },
              { title: '矩阵及其运算', type: 'reading', estimatedTime: 45, priority: 'high' },
              { title: '向量组的线性相关性', type: 'reading', estimatedTime: 60, priority: 'high' },
              { title: '线性方程组', type: 'reading', estimatedTime: 45, priority: 'high' },
              { title: '特征值与特征向量', type: 'reading', estimatedTime: 60, priority: 'high' }
            ]
          },
          { 
            title: '概率论与数理统计', 
            order: 4, 
            estimatedTime: Math.round(240 * timeMultiplier), 
            dependencies: ['1'],
            tasks: [
              { title: '随机事件和概率', type: 'reading', estimatedTime: 45, priority: 'medium' },
              { title: '随机变量及其分布', type: 'reading', estimatedTime: 60, priority: 'high' },
              { title: '多维随机变量', type: 'reading', estimatedTime: 60, priority: 'high' },
              { title: '数字特征', type: 'reading', estimatedTime: 45, priority: 'high' },
              { title: '大数定律和中心极限定理', type: 'reading', estimatedTime: 30, priority: 'medium' }
            ]
          },
          {
            title: '真题强化训练',
            order: 5,
            estimatedTime: Math.round(300 * timeMultiplier),
            dependencies: ['1', '2', '3', '4'],
            tasks: [
              { title: '近10年真题第一遍', type: 'exercise', estimatedTime: 150, priority: 'high' },
              { title: '错题分析与总结', type: 'review', estimatedTime: 90, priority: 'high' },
              { title: '近10年真题第二遍', type: 'exercise', estimatedTime: 120, priority: 'high' }
            ]
          }
        ]
      },
      '英语一': {
        name: '英语一全程复习计划',
        description: '词汇、语法、阅读、翻译、写作全面提升',
        chapters: [
          { 
            title: '核心词汇突破', 
            order: 1, 
            estimatedTime: Math.round(200 * timeMultiplier), 
            dependencies: [],
            tasks: [
              { title: '高频词汇500个', type: 'reading', estimatedTime: 60, priority: 'high' },
              { title: '中频词汇500个', type: 'reading', estimatedTime: 60, priority: 'high' },
              { title: '低频词汇500个', type: 'reading', estimatedTime: 45, priority: 'medium' },
              { title: '词汇复习巩固', type: 'review', estimatedTime: 45, priority: 'high' }
            ]
          },
          { 
            title: '语法长难句', 
            order: 2, 
            estimatedTime: Math.round(150 * timeMultiplier), 
            dependencies: ['1'],
            tasks: [
              { title: '基本语法结构', type: 'reading', estimatedTime: 45, priority: 'medium' },
              { title: '从句分析', type: 'reading', estimatedTime: 45, priority: 'high' },
              { title: '长难句拆解练习', type: 'practice', estimatedTime: 60, priority: 'high' }
            ]
          },
          { 
            title: '阅读理解强化', 
            order: 3, 
            estimatedTime: Math.round(240 * timeMultiplier), 
            dependencies: ['1', '2'],
            tasks: [
              { title: '阅读技巧讲解', type: 'reading', estimatedTime: 60, priority: 'high' },
              { title: '真题阅读精练（10篇）', type: 'practice', estimatedTime: 120, priority: 'high' },
              { title: '错题分析与总结', type: 'review', estimatedTime: 60, priority: 'high' }
            ]
          },
          { 
            title: '翻译与完型', 
            order: 4, 
            estimatedTime: Math.round(150 * timeMultiplier), 
            dependencies: ['1', '2'],
            tasks: [
              { title: '翻译技巧与练习', type: 'practice', estimatedTime: 75, priority: 'medium' },
              { title: '完型填空训练', type: 'practice', estimatedTime: 60, priority: 'medium' },
              { title: '新题型训练', type: 'practice', estimatedTime: 45, priority: 'medium' }
            ]
          },
          { 
            title: '写作专项', 
            order: 5, 
            estimatedTime: Math.round(150 * timeMultiplier), 
            dependencies: ['1', '2', '3'],
            tasks: [
              { title: '小作文模板与练习', type: 'practice', estimatedTime: 60, priority: 'high' },
              { title: '大作文结构与范文', type: 'practice', estimatedTime: 75, priority: 'high' },
              { title: '写作批改与修改', type: 'review', estimatedTime: 45, priority: 'high' }
            ]
          },
          {
            title: '真题模拟冲刺',
            order: 6,
            estimatedTime: Math.round(180 * timeMultiplier),
            dependencies: ['1', '2', '3', '4', '5'],
            tasks: [
              { title: '近5年真题模考', type: 'exercise', estimatedTime: 120, priority: 'high' },
              { title: '考前重点复习', type: 'review', estimatedTime: 60, priority: 'high' }
            ]
          }
        ]
      },
      '政治': {
        name: '政治冲刺复习计划',
        description: '马原、毛中特、史纲、思修、形势政策全面覆盖',
        chapters: [
          { 
            title: '马克思主义基本原理', 
            order: 1, 
            estimatedTime: Math.round(120 * timeMultiplier), 
            dependencies: [],
            tasks: [
              { title: '唯物论和辩证法', type: 'reading', estimatedTime: 45, priority: 'high' },
              { title: '认识论和历史观', type: 'reading', estimatedTime: 45, priority: 'high' },
              { title: '政治经济学', type: 'reading', estimatedTime: 30, priority: 'medium' }
            ]
          },
          { 
            title: '毛泽东思想和中国特色社会主义理论体系', 
            order: 2, 
            estimatedTime: Math.round(150 * timeMultiplier), 
            dependencies: ['1'],
            tasks: [
              { title: '毛泽东思想', type: 'reading', estimatedTime: 45, priority: 'high' },
              { title: '邓小平理论', type: 'reading', estimatedTime: 30, priority: 'medium' },
              { title: '三个代表和科学发展观', type: 'reading', estimatedTime: 30, priority: 'medium' },
              { title: '新时代中国特色社会主义思想', type: 'reading', estimatedTime: 45, priority: 'high' }
            ]
          },
          { 
            title: '中国近现代史纲要', 
            order: 3, 
            estimatedTime: Math.round(90 * timeMultiplier), 
            dependencies: [],
            tasks: [
              { title: '旧民主主义革命时期', type: 'reading', estimatedTime: 30, priority: 'medium' },
              { title: '新民主主义革命时期', type: 'reading', estimatedTime: 30, priority: 'high' },
              { title: '社会主义革命和建设时期', type: 'reading', estimatedTime: 30, priority: 'medium' }
            ]
          },
          { 
            title: '思想道德修养与法律基础', 
            order: 4, 
            estimatedTime: Math.round(90 * timeMultiplier), 
            dependencies: [],
            tasks: [
              { title: '思想道德部分', type: 'reading', estimatedTime: 45, priority: 'medium' },
              { title: '法律基础部分', type: 'reading', estimatedTime: 45, priority: 'medium' }
            ]
          },
          { 
            title: '形势与政策', 
            order: 5, 
            estimatedTime: Math.round(60 * timeMultiplier), 
            dependencies: [],
            tasks: [
              { title: '年度热点事件', type: 'reading', estimatedTime: 30, priority: 'high' },
              { title: '重要会议精神', type: 'reading', estimatedTime: 30, priority: 'high' }
            ]
          },
          {
            title: '选择题强化训练',
            order: 6,
            estimatedTime: Math.round(120 * timeMultiplier),
            dependencies: ['1', '2', '3', '4', '5'],
            tasks: [
              { title: '肖秀荣1000题', type: 'exercise', estimatedTime: 90, priority: 'high' },
              { title: '错题整理', type: 'review', estimatedTime: 30, priority: 'high' }
            ]
          },
          {
            title: '分析题背诵',
            order: 7,
            estimatedTime: Math.round(90 * timeMultiplier),
            dependencies: ['1', '2', '3', '4', '5'],
            tasks: [
              { title: '肖四肖八背诵', type: 'reading', estimatedTime: 60, priority: 'high' },
              { title: '答题技巧训练', type: 'practice', estimatedTime: 30, priority: 'high' }
            ]
          }
        ]
      }
    }
    
    return structures[subject] || { chapters: [] }
  }

  // 数据持久化
  const saveLearningPathData = async () => {
    // 将响应式对象转换为纯JSON对象
    const plainPaths = JSON.parse(JSON.stringify(learningPaths.value))
    const plainCurrentPath = currentPath.value ? JSON.parse(JSON.stringify(currentPath.value)) : null
    
    await localforage.setItem('learningPaths', plainPaths)
    await localforage.setItem('currentPath', plainCurrentPath)
  }

  const saveStudyPlanData = async () => {
    const plainPlans = JSON.parse(JSON.stringify(studyPlans.value))
    await localforage.setItem('studyPlans', plainPlans)
  }
  
  const saveReviewData = async () => {
    const plainReviews = JSON.parse(JSON.stringify(reviewSchedules.value))
    await localforage.setItem('reviewSchedules', plainReviews)
  }
  
  const saveMasteryData = async () => {
    const plainMastery = JSON.parse(JSON.stringify(masteryRecords.value))
    await localforage.setItem('masteryRecords', plainMastery)
  }

  const initializeLearningPathData = async () => {
    isLoading.value = true
    try {
      const storedPaths = await localforage.getItem<LearningPath[]>('learningPaths')
      const storedCurrentPath = await localforage.getItem<LearningPath | null>('currentPath')
      const storedPlans = await localforage.getItem<StudyPlan[]>('studyPlans')
      const storedReviews = await localforage.getItem<ReviewSchedule[]>('reviewSchedules')
      const storedMastery = await localforage.getItem<MasteryRecord[]>('masteryRecords')
      
      if (storedPaths && Array.isArray(storedPaths)) {
        learningPaths.value = storedPaths
      } else {
        // 如果没有学习路径，自动创建基于用户真实进度的个性化路径
        console.log('🚀 检测到首次使用，正在创建个性化学习路径...')
        await createPersonalizedPaths()
      }
      
      if (storedCurrentPath) currentPath.value = storedCurrentPath
      if (storedPlans && Array.isArray(storedPlans)) studyPlans.value = storedPlans
      if (storedReviews && Array.isArray(storedReviews)) reviewSchedules.value = storedReviews
      if (storedMastery && Array.isArray(storedMastery)) masteryRecords.value = storedMastery
      
      // 加载游戏化数据
      await loadGameData()
      
      // 检查成就（确保learningPaths是数组）
      if (Array.isArray(learningPaths.value)) {
        checkAndUnlockAchievements()
      }
    } catch (error) {
      console.error('初始化学习路径数据失败:', error)
    } finally {
      isLoading.value = false
    }
  }
  
  // 创建基于用户真实进度的个性化学习路径
  const createPersonalizedPaths = async () => {
    console.log('📐 创建数学一学习路径...')
    
    // 数学一：高数和线代基础已完成，概率论强化进行中（前三章已完成）
    // 根据经验贴：方浩强化讲义共9章，已完成第1-3章
    const mathChapters = [
      {
        title: '概率论强化 - 第四章：随机变量的数字特征',
        order: 1,
        estimatedTime: 450, // 约7.5小时(看课4h+做题3.5h)
        dependencies: []
      },
      {
        title: '概率论强化 - 第五章：大数定律/中心极限定理',
        order: 2,
        estimatedTime: 360, // 约6小时
        dependencies: ['1']
      },
      {
        title: '概率论强化 - 第六章：数理统计的基本概念',
        order: 3,
        estimatedTime: 420, // 约7小时
        dependencies: ['2']
      },
      {
        title: '高等数学强化复习（武忠祥，剩余章节）',
        order: 4,
        estimatedTime: 4320, // 18讲×4小时(看课2.5h+做题1.5h)，每天3小时≈24天
        dependencies: ['3']
      },
      {
        title: '线性代数强化 - 第一章：行列式',
        order: 5,
        estimatedTime: 180, // 约3小时
        dependencies: ['4']
      },
      {
        title: '线性代数强化 - 第二章：矩阵运算、分块矩阵',
        order: 6,
        estimatedTime: 240, // 约4小时
        dependencies: ['5']
      },
      {
        title: '线性代数强化 - 第三章：矩阵的秩与向量组',
        order: 7,
        estimatedTime: 270, // 约4.5小时
        dependencies: ['6']
      },
      {
        title: '线性代数强化 - 第四章：向量组、广义初等变换进阶',
        order: 8,
        estimatedTime: 300, // 约5小时
        dependencies: ['7']
      },
      {
        title: '线性代数强化 - 第六章：线性方程组解的判定、解AX=B',
        order: 9,
        estimatedTime: 300, // 约5小时
        dependencies: ['8']
      },
      {
        title: '线性代数强化 - 第七章：抽象方程、公共解与同解问题',
        order: 10,
        estimatedTime: 270, // 约4.5小时
        dependencies: ['9']
      },
      {
        title: '线性代数强化 - 第八章：特征值特征向量与相似理论',
        order: 11,
        estimatedTime: 360, // 约6小时
        dependencies: ['10']
      },
      {
        title: '线性代数强化 - 第九章：实对称阵&二次型',
        order: 12,
        estimatedTime: 300, // 约5小时
        dependencies: ['11']
      },
      {
        title: '线性代数强化 - 第十章：二次型进阶',
        order: 13,
        estimatedTime: 240, // 约4小时
        dependencies: ['12']
      },
      {
        title: '真题训练（近10年）',
        order: 14,
        estimatedTime: 3000, // 10套×5小时(做题3h+复盘2h)，每天1套≈10天
        dependencies: ['4', '13']
      }
    ]
    
    await createLearningPath('数学一', mathChapters)
    console.log('✅ 数学一路径创建成功')
    
    // 408：数据结构完成，组成原理55%，操作系统和网络未开始
    // 根据经验贴：王道单科40-60小时，暑假每天4-5小时
    const cs408Chapters = [
      {
        title: '计算机组成原理（剩余章节）',
        order: 1,
        estimatedTime: 1800, // 王道计组约45小时，剩余45%≈20小时+做题10小时
        dependencies: []
      },
      {
        title: '操作系统（全新学习）',
        order: 2,
        estimatedTime: 3000, // 王道操作系统约50小时(看课30h+做题20h)
        dependencies: ['1']
      },
      {
        title: '计算机网络（全新学习）',
        order: 3,
        estimatedTime: 2400, // 王道计网约40小时(看课24h+做题16h)
        dependencies: ['2']
      },
      {
        title: '数据结构复习巩固',
        order: 4,
        estimatedTime: 1500, // 数据结构复习约25小时(重点算法+错题)
        dependencies: []
      },
      {
        title: '真题训练（近5年）',
        order: 5,
        estimatedTime: 1800, // 5套×6小时(做题4h+复盘2h)
        dependencies: ['1', '2', '3', '4']
      }
    ]
    
    await createLearningPath('408计算机科学综合', cs408Chapters)
    console.log('✅ 408路径创建成功')
    
    // 英语一：词汇80%，语法40%，真题0%
    // 根据经验贴：每天1-2小时，总计400小时
    const englishChapters = [
      {
        title: '词汇巩固（最后20%）',
        order: 1,
        estimatedTime: 900, // 每天1小时×30天(艾宾浩斯复习)
        dependencies: []
      },
      {
        title: '语法长难句强化',
        order: 2,
        estimatedTime: 1200, // 每天1.5小时×13天(系统学习+练习)
        dependencies: ['1']
      },
      {
        title: '阅读理解专项（精读训练）',
        order: 3,
        estimatedTime: 2400, // 每天2小时×20天(40篇×1小时精读+1小时复盘)
        dependencies: ['1', '2']
      },
      {
        title: '翻译与完型填空',
        order: 4,
        estimatedTime: 1200, // 每天1.5小时×13天(翻译10篇+完型20篇)
        dependencies: ['1', '2']
      },
      {
        title: '写作专项（大小作文模板）',
        order: 5,
        estimatedTime: 1200, // 每天1.5小时×13天(积累素材+练习写作)
        dependencies: ['1', '2', '3']
      },
      {
        title: '真题模考冲刺（近10年）',
        order: 6,
        estimatedTime: 1800, // 10套×3小时(做题2h+复盘1h)
        dependencies: ['1', '2', '3', '4', '5']
      }
    ]
    
    await createLearningPath('英语一', englishChapters)
    console.log('✅ 英语一路径创建成功')
    
    // 政治：计划7月启动
    // 根据经验贴：暑假前每天1-2小时，暑假后每天2小时
    const politicsChapters = [
      {
        title: '马克思主义基本原理（难点突破）',
        order: 1,
        estimatedTime: 1800, // 每天1.5小时×20天(马原最难，需听课辅助)
        dependencies: []
      },
      {
        title: '毛泽东思想和中国特色社会主义理论体系',
        order: 2,
        estimatedTime: 2100, // 每天1.5小时×23天(内容最多，结合时政)
        dependencies: ['1']
      },
      {
        title: '中国近现代史纲要',
        order: 3,
        estimatedTime: 1200, // 每天1.5小时×13天(记忆型知识点)
        dependencies: []
      },
      {
        title: '思想道德修养与法律基础',
        order: 4,
        estimatedTime: 900, // 每天1.5小时×10天(相对简单)
        dependencies: []
      },
      {
        title: '形势与政策（考前更新）',
        order: 5,
        estimatedTime: 600, // 每天1.5小时×7天(11-12月更新)
        dependencies: []
      },
      {
        title: '选择题强化训练（肖1000题）',
        order: 6,
        estimatedTime: 1200, // 每天2小时×10天(刷题+订正)
        dependencies: ['1', '2', '3', '4', '5']
      },
      {
        title: '分析题背诵冲刺',
        order: 7,
        estimatedTime: 180,
        dependencies: ['1', '2', '3', '4', '5']
      }
    ]
    
    await createLearningPath('政治', politicsChapters)
    console.log('✅ 政治路径创建成功')
    
    console.log('\n🎉 所有个性化学习路径创建完成！')
    console.log('📊 已创建4个科目的学习路径')
    console.log('💡 打开"学习路径"页面查看详细计划')
  }

  return {
    // 状态
    learningPaths,
    currentPath,
    studyPlans,
    isLoading,
    currentAssessment,
    assessmentResults,
    reviewSchedules,
    masteryRecords,
    
    // 计算属性
    overallProgress,
    activePaths,
    todayPlan,
    weeklyPlanProgress,
    
    // 方法
    createLearningPath,
    startLearningPath,
    completeChapter,
    generateWeeklyPlan,
    completePlannedTask,
    getSubjectRecommendation,
    getPathStatistics,
    analyzeStudyRecords,
    getDefaultPathStructure,
    // 测评相关方法
    getAssessmentQuestions,
    startAssessment,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    submitAssessment,
    cancelAssessment,
    // 复习和掌握度相关方法
    generateReviewDates,
    calculateRetentionRate,
    createReviewSchedule,
    completeReview,
    getTodayReviews,
    getPendingReviews,
    updateMasteryRecord,
    getSubjectMasteryStats,
    getWeakKnowledgePoints,
    // 数据分析相关方法
    getEfficiencyTrend,
    getOptimalStudyTimes,
    getSubjectDistribution,
    analyzeStudyHabits,
    predictCompletionTime,
    generateLearningReport,
    // 游戏化相关方法
    initializeAchievements,
    checkAndUnlockAchievements,
    addXP,
    updateStreak,
    getUnlockedAchievements,
    getLockedAchievements,
    getAchievementProgress,
    userLevel,
    streakData,
    achievements,
    initializeLearningPathData
  }
})