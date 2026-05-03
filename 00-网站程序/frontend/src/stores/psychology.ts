import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStudyStore } from './study'
import { useAttentionStore } from './attention'
import { useTodoStore } from './todos'
import { useLearningPathStore } from './learningPath'

interface IntegrationPoints {
  todos: number
  study: number
  attention: number
  learningPath: number
}

export interface CognitiveRecord {
  id: string
  date: string
  negativeThought: string
  cognitiveDistortion: string
  rationalResponse: string
  moodBefore: number // 1-10
  moodAfter: number // 1-10
  createdAt: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  points: number
  unlockedAt: string
  category: string
}

export interface Reward {
  id: string
  title: string
  description: string
  cost: number
  redeemed: boolean
  redeemedAt?: string
}

export interface MoodRecord {
  id: string
  mood: number // 1-10
  timestamp: string
  notes?: string
  triggers?: string[]
  linkedActivity?: string
}

export interface StreakInfo {
  count: number
  lastDate: string
  startDate: string
  longestStreak: number
}

export const usePsychologyStore = defineStore('psychology', () => {
  // 引入其他store
  const studyStore = useStudyStore()
  const attentionStore = useAttentionStore()
  const todoStore = useTodoStore()
  const learningPathStore = useLearningPathStore()
  
  // 状态
  const cognitiveRecords = ref<CognitiveRecord[]>([])
  const achievements = ref<Achievement[]>([])
  const rewards = ref<Reward[]>([])
  const moodRecords = ref<MoodRecord[]>([])
  const totalPoints = ref(0)
  const dailyPoints = ref(0)
  
  // 联动积分系统
  const integrationPoints = ref<IntegrationPoints>({
    todos: 0,
    study: 0,
    attention: 0,
    learningPath: 0
  })
  
  // 连击系统
  const streakInfo = ref<StreakInfo>({
    count: 0,
    lastDate: '',
    startDate: '',
    longestStreak: 0
  })
  
  // 计算属性
  const todayRecords = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return cognitiveRecords.value.filter(record => 
      record.date === today
    )
  })
  
  const weeklyRecords = computed(() => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    return cognitiveRecords.value.filter(record => 
      new Date(record.createdAt) >= oneWeekAgo
    )
  })
  
  const availableRewards = computed(() => {
    return rewards.value.filter(reward => 
      !reward.redeemed && reward.cost <= totalPoints.value
    )
  })
  
  const unlockedAchievements = computed(() => {
    return achievements.value.filter(achievement => 
      totalPoints.value >= achievement.points
    )
  })
  
  const todayMoodAverage = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    const todayRecords = moodRecords.value.filter(record => 
      record.timestamp.startsWith(today)
    )
    if (todayRecords.length === 0) return 0
    return todayRecords.reduce((sum, record) => sum + record.mood, 0) / todayRecords.length
  })
  
  const moodTrend = computed(() => {
    if (moodRecords.value.length < 2) return 'stable'
    const recent = moodRecords.value.slice(-7)
    const firstAvg = recent.slice(0, 3).reduce((sum, r) => sum + r.mood, 0) / 3
    const lastAvg = recent.slice(-3).reduce((sum, r) => sum + r.mood, 0) / 3
    return lastAvg > firstAvg ? 'improving' : lastAvg < firstAvg ? 'declining' : 'stable'
  })
  
  const recommendedActivities = computed(() => {
    const avgMood = todayMoodAverage.value
    if (avgMood < 4) {
      return [
        { type: 'relax', name: '深呼吸练习', points: 15 },
        { type: 'music', name: '听舒缓音乐', points: 10 },
        { type: 'walk', name: '散步10分钟', points: 20 }
      ]
    } else if (avgMood < 7) {
      return [
        { type: 'study', name: '轻松复习', points: 25 },
        { type: 'social', name: '联系朋友', points: 15 },
        { type: 'hobby', name: '兴趣爱好时间', points: 20 }
      ]
    } else {
      return [
        { type: 'challenge', name: '挑战难题', points: 40 },
        { type: 'creative', name: '创造性学习', points: 35 },
        { type: 'teach', name: '教别人知识', points: 50 }
      ]
    }
  })

  // 认知重构相关方法
  const addCognitiveRecord = (record: Omit<CognitiveRecord, 'id' | 'createdAt'>) => {
    const newRecord: CognitiveRecord = {
      ...record,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    
    cognitiveRecords.value.push(newRecord)
    saveData()
    
    // 根据情绪改善程度给予积分奖励
    const improvement = record.moodAfter - record.moodBefore
    if (improvement > 0) {
      addPoints(improvement * 10, '认知重构')
    }
  }

  const updateCognitiveRecord = (id: string, updates: Partial<CognitiveRecord>) => {
    const index = cognitiveRecords.value.findIndex(r => r.id === id)
    if (index !== -1) {
      cognitiveRecords.value[index] = { 
        ...cognitiveRecords.value[index], 
        ...updates 
      }
      saveData()
    }
  }

  const deleteCognitiveRecord = (id: string) => {
    const index = cognitiveRecords.value.findIndex(r => r.id === id)
    if (index !== -1) {
      cognitiveRecords.value.splice(index, 1)
      saveData()
    }
  }

  // 积分系统相关方法
  const addPoints = (points: number, reason: string) => {
    totalPoints.value += points
    dailyPoints.value += points
    
    // 检查是否解锁新成就
    checkAchievements(points, reason)
    saveData()
  }

  const redeemReward = (rewardId: string) => {
    const reward = rewards.value.find(r => r.id === rewardId)
    if (reward && !reward.redeemed && totalPoints.value >= reward.cost) {
      totalPoints.value -= reward.cost
      reward.redeemed = true
      reward.redeemedAt = new Date().toISOString()
      saveData()
      return true
    }
    return false
  }

  // 成就系统相关方法
  const checkAchievements = (points: number, reason: string) => {
    // 这里可以添加具体的成就解锁逻辑
    const newAchievements: Achievement[] = []
    
    // 示例成就
    if (totalPoints.value >= 100 && !achievements.value.some(a => a.title === '初次突破')) {
      newAchievements.push({
        id: 'ach_1',
        title: '初次突破',
        description: '累计获得100积分',
        points: 100,
        unlockedAt: new Date().toISOString(),
        category: '里程碑'
      })
    }
    
    if (cognitiveRecords.value.length >= 5 && !achievements.value.some(a => a.title === '认知勇士')) {
      newAchievements.push({
        id: 'ach_2',
        title: '认知勇士',
        description: '完成5次认知重构练习',
        points: 50,
        unlockedAt: new Date().toISOString(),
        category: '练习成就'
      })
    }
    
    achievements.value.push(...newAchievements)
  }
  
  // 情绪追踪相关方法
  const addMoodRecord = (mood: number, notes?: string, triggers?: string[]) => {
    const newRecord: MoodRecord = {
      id: Date.now().toString(),
      mood,
      timestamp: new Date().toISOString(),
      notes,
      triggers
    }
    
    moodRecords.value.push(newRecord)
    
    // 根据情绪状态给予积分奖励
    let points = 0
    if (mood >= 8) {
      points = 20 // 情绪很好
    } else if (mood >= 6) {
      points = 10 // 情绪一般
    } else if (mood >= 4) {
      points = 5  // 情绪较低
    } else {
      points = 15 // 情绪很差但勇于记录
    }
    
    addPoints(points, '情绪记录')
    updateStreak()
    saveData()
  }
  
  const updateStreak = () => {
    const today = new Date().toISOString().split('T')[0]
    
    if (streakInfo.value.lastDate === '') {
      // 第一次记录
      streakInfo.value.count = 1
      streakInfo.value.startDate = today
      streakInfo.value.lastDate = today
    } else {
      const lastDate = new Date(streakInfo.value.lastDate)
      const currentDate = new Date(today)
      const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        // 连续记录
        streakInfo.value.count++
        streakInfo.value.lastDate = today
        if (streakInfo.value.count > streakInfo.value.longestStreak) {
          streakInfo.value.longestStreak = streakInfo.value.count
        }
        // 连击奖励
        if (streakInfo.value.count % 3 === 0) {
          addPoints(streakInfo.value.count * 5, `连续${streakInfo.value.count}天情绪记录`)
        }
      } else if (diffDays > 1) {
        // 断开，重新开始
        streakInfo.value.count = 1
        streakInfo.value.startDate = today
        streakInfo.value.lastDate = today
      }
      // diffDays === 0 表示当天已有记录，不做处理
    }
  }
  
  // 与其他模块的联动方法
  const integrateWithTodos = (completedTodoIds: string[]) => {
    const highPriorityTodos = todoStore.todos.filter(t => 
      completedTodoIds.includes(t.id) && t.priority === 'high'
    )
    
    const longDurationTodos = todoStore.todos.filter(t => 
      completedTodoIds.includes(t.id) && t.estimatedDuration && t.estimatedDuration > 60
    )
    
    let points = 0
    
    // 高优先级任务奖励
    points += highPriorityTodos.length * 20
    
    // 长时间任务奖励
    points += longDurationTodos.length * 30
    
    if (points > 0) {
      addPoints(points, '完成重要任务')
      integrationPoints.value.todos += points
    }
  }
  
  const integrateWithStudy = (studyDuration: number, subject: string) => {
    let points = Math.floor(studyDuration / 10) // 每10分钟获得1积分
    
    // 根据科目调整积分倍数
    const multiplier = subject.includes('数学') || subject.includes('408') ? 1.5 : 1.2
    points = Math.floor(points * multiplier)
    
    addPoints(points, `学习${subject}`)
    integrationPoints.value.study += points
  }
  
  const integrateWithAttention = (focusDuration: number, sessionsCompleted: number) => {
    let points = focusDuration // 每分钟专注获得1积分
    
    // 完成会话额外奖励
    points += sessionsCompleted * 10
    
    // 达到阈值的额外奖励
    if (focusDuration >= 120) { // 2小时以上
      points += 50
    } else if (focusDuration >= 60) { // 1小时以上
      points += 25
    }
    
    addPoints(points, '专注学习')
    integrationPoints.value.attention += points
  }
  
  const integrateWithLearningPath = (completedChapters: number, planCompletion: boolean) => {
    let points = completedChapters * 50 // 每完成一章获得50积分
    
    // 完成计划额外奖励
    if (planCompletion) {
      points += 100
      // 连续完成奖励
      if (streakInfo.value.count >= 3) {
        points += streakInfo.value.count * 10
      }
    }
    
    addPoints(points, '学习计划完成')
    integrationPoints.value.learningPath += points
  }

  const getCognitiveDistortions = () => {
    return [
      '全或无思维',
      '过度概括',
      '心理过滤',
      '贬低积极面',
      '妄下结论',
      '放大缩小',
      '情绪化推理',
      '应该陈述',
      '贴标签',
      '罪责归己'
    ]
  }

  const getMoodEmoji = (mood: number) => {
    if (mood <= 3) return '😢'
    if (mood <= 6) return '😐'
    if (mood <= 8) return '🙂'
    return '😄'
  }

  // 数据持久化
  const saveData = () => {
    const data = {
      cognitiveRecords: cognitiveRecords.value,
      achievements: achievements.value,
      rewards: rewards.value,
      moodRecords: moodRecords.value,
      totalPoints: totalPoints.value,
      dailyPoints: dailyPoints.value,
      integrationPoints: integrationPoints.value,
      streakInfo: streakInfo.value
    }
    localStorage.setItem('psychologyData', JSON.stringify(data))
  }

  const loadData = () => {
    const saved = localStorage.getItem('psychologyData')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        cognitiveRecords.value = data.cognitiveRecords || []
        achievements.value = data.achievements || []
        rewards.value = data.rewards || []
        moodRecords.value = data.moodRecords || []
        totalPoints.value = data.totalPoints || 0
        dailyPoints.value = data.dailyPoints || 0
        integrationPoints.value = data.integrationPoints || {
          todos: 0,
          study: 0,
          attention: 0,
          learningPath: 0
        }
        streakInfo.value = data.streakInfo || {
          count: 0,
          lastDate: '',
          startDate: '',
          longestStreak: 0
        }
      } catch (e) {
        console.error('Failed to load psychology data:', e)
      }
    }
  }

  // 重置每日积分
  const resetDailyPoints = () => {
    dailyPoints.value = 0
    saveData()
  }

  // 初始化奖励系统
  const initializeRewards = () => {
    if (rewards.value.length === 0) {
      rewards.value = [
        {
          id: 'reward_1',
          title: '休息时间',
          description: '兑换30分钟自由休息时间',
          cost: 50,
          redeemed: false
        },
        {
          id: 'reward_2',
          title: '小零食',
          description: '兑换一次小零食奖励',
          cost: 30,
          redeemed: false
        },
        {
          id: 'reward_3',
          title: '娱乐时间',
          description: '兑换1小时娱乐时间',
          cost: 100,
          redeemed: false
        },
        {
          id: 'reward_4',
          title: '购物基金',
          description: '兑换小额购物基金',
          cost: 200,
          redeemed: false
        }
      ]
      saveData()
    }
  }

  // 初始化
  loadData()
  initializeRewards()

  return {
    // 状态
    cognitiveRecords,
    achievements,
    rewards,
    moodRecords,
    totalPoints,
    dailyPoints,
    integrationPoints,
    streakInfo,
    
    // 计算属性
    todayRecords,
    weeklyRecords,
    availableRewards,
    unlockedAchievements,
    todayMoodAverage,
    moodTrend,
    recommendedActivities,
    
    // 方法
    addCognitiveRecord,
    updateCognitiveRecord,
    deleteCognitiveRecord,
    addPoints,
    redeemReward,
    checkAchievements,
    getCognitiveDistortions,
    getMoodEmoji,
    saveData,
    loadData,
    resetDailyPoints,
    initializeRewards,
    
    // 情绪追踪方法
    addMoodRecord,
    updateStreak,
    
    // 联动方法
    integrateWithTodos,
    integrateWithStudy,
    integrateWithAttention,
    integrateWithLearningPath
  }
})