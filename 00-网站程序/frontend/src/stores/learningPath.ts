import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import localforage from 'localforage'

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

export const useLearningPathStore = defineStore('learningPath', () => {
  // 状态
  const learningPaths = ref<LearningPath[]>([])
  const currentPath = ref<LearningPath | null>(null)
  const studyPlans = ref<StudyPlan[]>([])
  const isLoading = ref(false)

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
      const newPath: LearningPath = {
        id: 'path_' + Date.now(),
        subject,
        name: `${subject}学习路径`,
        description: `系统为您定制的${subject}学习计划`,
        totalChapters: chapters.length,
        completedChapters: 0,
        currentChapter: 1,
        startDate: new Date().toISOString(),
        estimatedEndDate: calculateEndDate(chapters),
        status: 'not-started',
        chapters: chapters.map((chapter, index) => ({
          ...chapter,
          id: `chapter_${Date.now()}_${index}`,
          completed: false,
          tasks: generateTasksForChapter(chapter.title, chapter.estimatedTime)
        }))
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

  const generateDailyTasks = (date: string): PlannedTask[] => {
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

  const getDefaultPathStructure = (subject: string) => {
    const structures: Record<string, any> = {
      '408计算机科学综合': {
        chapters: [
          { title: '数据结构', order: 1, estimatedTime: 240, dependencies: [] },
          { title: '计算机组成原理', order: 2, estimatedTime: 240, dependencies: [] },
          { title: '操作系统', order: 3, estimatedTime: 180, dependencies: [] },
          { title: '计算机网络', order: 4, estimatedTime: 180, dependencies: [] }
        ]
      },
      '数学一': {
        chapters: [
          { title: '高等数学', order: 1, estimatedTime: 480, dependencies: [] },
          { title: '线性代数', order: 2, estimatedTime: 180, dependencies: [] },
          { title: '概率论与数理统计', order: 3, estimatedTime: 180, dependencies: [] }
        ]
      },
      '英语一': {
        chapters: [
          { title: '词汇', order: 1, estimatedTime: 200, dependencies: [] },
          { title: '语法', order: 2, estimatedTime: 120, dependencies: [] },
          { title: '阅读理解', order: 3, estimatedTime: 180, dependencies: ['1', '2'] },
          { title: '翻译', order: 4, estimatedTime: 120, dependencies: ['1', '2'] },
          { title: '写作', order: 5, estimatedTime: 120, dependencies: ['1', '2', '3'] }
        ]
      },
      '政治': {
        chapters: [
          { title: '马克思主义基本原理', order: 1, estimatedTime: 120, dependencies: [] },
          { title: '毛泽东思想和中国特色社会主义理论体系', order: 2, estimatedTime: 120, dependencies: [] },
          { title: '中国近现代史纲要', order: 3, estimatedTime: 90, dependencies: [] },
          { title: '思想道德修养与法律基础', order: 4, estimatedTime: 90, dependencies: [] },
          { title: '形势与政策', order: 5, estimatedTime: 60, dependencies: [] }
        ]
      }
    }
    
    return structures[subject] || { chapters: [] }
  }

  // 数据持久化
  const saveLearningPathData = async () => {
    await localforage.setItem('learningPaths', learningPaths.value)
    await localforage.setItem('currentPath', currentPath.value)
  }

  const saveStudyPlanData = async () => {
    await localforage.setItem('studyPlans', studyPlans.value)
  }

  const initializeLearningPathData = async () => {
    isLoading.value = true
    try {
      const storedPaths = await localforage.getItem<LearningPath[]>('learningPaths')
      const storedCurrentPath = await localforage.getItem<LearningPath | null>('currentPath')
      const storedPlans = await localforage.getItem<StudyPlan[]>('studyPlans')
      
      if (storedPaths) learningPaths.value = storedPaths
      if (storedCurrentPath) currentPath.value = storedCurrentPath
      if (storedPlans) studyPlans.value = storedPlans
    } catch (error) {
      console.error('初始化学习路径数据失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    // 状态
    learningPaths,
    currentPath,
    studyPlans,
    isLoading,
    
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
    initializeLearningPathData
  }
})