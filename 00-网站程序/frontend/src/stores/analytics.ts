import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// import { useUserStore } from './user'
// import { useAttentionStore } from './attention'
// import { useLearningPathStore } from './learningPath'
// import { usePsychologyStore } from './psychology'
import { useCS408Store } from './cs408'
import { useMathStore } from './math'
import { useEnglishStore } from './english'
import { usePoliticsStore } from './politics'

interface StudySession {
  id: string
  date: string
  duration: number // 分钟
  subject: string
  activity: string
  productivity: number // 1-10
}

interface WeeklyReport {
  week: string
  totalTime: number
  sessions: number
  subjects: Record<string, number>
  productivity: number
  goalsAchieved: number
  streak: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockDate?: string
  criteria: string
}

export const useAnalyticsStore = defineStore('analytics', () => {
  // 状态
  const studySessions = ref<StudySession[]>([])
  const achievements = ref<Achievement[]>([])
  const isLoading = ref(false)

  // 获取其他store的数据
  // const userStore = useUserStore()
  // const attentionStore = useAttentionStore()
  // const learningPathStore = useLearningPathStore()
  // const psychologyStore = usePsychologyStore()
  const cs408Store = useCS408Store()
  const mathStore = useMathStore()
  const englishStore = useEnglishStore()
  const politicsStore = usePoliticsStore()

  // 计算属性
  const totalStudyTime = computed(() => {
    return studySessions.value.reduce((sum, session) => sum + session.duration, 0)
  })

  const averageProductivity = computed(() => {
    if (studySessions.value.length === 0) return 0
    const totalProductivity = studySessions.value.reduce((sum, session) => sum + session.productivity, 0)
    return Math.round(totalProductivity / studySessions.value.length)
  })

  const subjectDistribution = computed(() => {
    const distribution: Record<string, number> = {}
    studySessions.value.forEach(session => {
      distribution[session.subject] = (distribution[session.subject] || 0) + session.duration
    })
    return distribution
  })

  const weeklyReports = computed(() => {
    const reports: WeeklyReport[] = []
    const sessionsByWeek: Record<string, StudySession[]> = {}
    
    // 按周分组
    studySessions.value.forEach(session => {
      const date = new Date(session.date)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      const weekKey = weekStart.toISOString().split('T')[0]
      
      if (!sessionsByWeek[weekKey]) {
        sessionsByWeek[weekKey] = []
      }
      sessionsByWeek[weekKey].push(session)
    })
    
    // 生成每周报告
    Object.entries(sessionsByWeek).forEach(([week, sessions]) => {
      const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0)
      const totalProductivity = sessions.reduce((sum, s) => sum + s.productivity, 0)
      const subjects: Record<string, number> = {}
      
      sessions.forEach(session => {
        subjects[session.subject] = (subjects[session.subject] || 0) + session.duration
      })
      
      reports.push({
        week,
        totalTime,
        sessions: sessions.length,
        subjects,
        productivity: sessions.length > 0 ? Math.round(totalProductivity / sessions.length) : 0,
        goalsAchieved: calculateGoalsAchieved(week, sessions),
        streak: calculateStreak(week)
      })
    })
    
    return reports.sort((a, b) => a.week.localeCompare(b.week))
  })

  const recentAchievements = computed(() => {
    return achievements.value
      .filter(ach => ach.unlocked)
      .sort((a, b) => (b.unlockDate || '').localeCompare(a.unlockDate || ''))
      .slice(0, 5)
  })

  const productivityTrend = computed(() => {
    const trend: { date: string; productivity: number }[] = []
    const sessionsByDate: Record<string, StudySession[]> = {}
    
    studySessions.value.forEach(session => {
      if (!sessionsByDate[session.date]) {
        sessionsByDate[session.date] = []
      }
      sessionsByDate[session.date].push(session)
    })
    
    Object.entries(sessionsByDate).forEach(([date, sessions]) => {
      const avgProductivity = sessions.reduce((sum, s) => sum + s.productivity, 0) / sessions.length
      trend.push({
        date,
        productivity: Math.round(avgProductivity)
      })
    })
    
    return trend.sort((a, b) => a.date.localeCompare(b.date)).slice(-30) // 最近30天
  })

  // 方法
  const addStudySession = async (sessionData: Omit<StudySession, 'id'>) => {
    isLoading.value = true
    try {
      const newSession: StudySession = {
        id: 'session_' + Date.now(),
        ...sessionData
      }

      studySessions.value.push(newSession)
      await saveAnalyticsData()
      
      // 检查成就解锁
      checkAchievements()
      
      return newSession
    } catch (error) {
      console.error('添加学习会话失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const generateDailyReport = () => {
    const today = new Date().toISOString().split('T')[0]
    const todaySessions = studySessions.value.filter(s => s.date === today)
    
    if (todaySessions.length === 0) {
      return null
    }
    
    const totalTime = todaySessions.reduce((sum, s) => sum + s.duration, 0)
    const avgProductivity = todaySessions.reduce((sum, s) => sum + s.productivity, 0) / todaySessions.length
    const subjects: Record<string, number> = {}
    
    todaySessions.forEach(session => {
      subjects[session.subject] = (subjects[session.subject] || 0) + session.duration
    })
    
    return {
      date: today,
      totalTime,
      sessions: todaySessions.length,
      subjects,
      productivity: Math.round(avgProductivity),
      mostStudiedSubject: Object.entries(subjects).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
    }
  }

  const generateMonthlyReport = () => {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    const monthSessions = studySessions.value.filter(s => {
      const sessionDate = new Date(s.date)
      return sessionDate >= monthStart && sessionDate <= monthEnd
    })
    
    if (monthSessions.length === 0) {
      return null
    }
    
    const totalTime = monthSessions.reduce((sum, s) => sum + s.duration, 0)
    const avgProductivity = monthSessions.reduce((sum, s) => sum + s.productivity, 0) / monthSessions.length
    const subjects: Record<string, number> = {}
    const dailyStats: Record<string, { time: number; sessions: number }> = {}
    
    monthSessions.forEach(session => {
      // 科目统计
      subjects[session.subject] = (subjects[session.subject] || 0) + session.duration
      
      // 日常统计
      if (!dailyStats[session.date]) {
        dailyStats[session.date] = { time: 0, sessions: 0 }
      }
      dailyStats[session.date].time += session.duration
      dailyStats[session.date].sessions += 1
    })
    
    const studyDays = Object.keys(dailyStats).length
    const avgDailyTime = totalTime / studyDays
    
    return {
      month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
      totalTime,
      sessions: monthSessions.length,
      studyDays,
      avgDailyTime: Math.round(avgDailyTime),
      subjects,
      productivity: Math.round(avgProductivity),
      mostProductiveDay: Object.entries(dailyStats)
        .sort((a, b) => b[1].time - a[1].time)[0]?.[0] || ''
    }
  }

  const getSubjectProgress = (subject: string) => {
    switch (subject) {
      case '408':
        return {
          progress: Math.round((cs408Store.solvedProblems.length / Math.max(1, cs408Store.codeProblems.length)) * 100),
          completed: cs408Store.solvedProblems.length,
          total: cs408Store.codeProblems.length
        }
      case '数学':
        return {
          progress: mathStore.overallProgress,
          completed: mathStore.completedChapters.length,
          total: mathStore.chapters.length
        }
      case '英语':
        return {
          progress: englishStore.overallReadingAccuracy,
          completed: englishStore.readingPassages.filter(p => p.accuracy !== undefined).length,
          total: englishStore.readingPassages.length
        }
      case '政治':
        return {
          progress: Math.round((politicsStore.masteryStats.mastered / Math.max(1, politicsStore.masteryStats.total)) * 100),
          completed: politicsStore.masteryStats.mastered,
          total: politicsStore.masteryStats.total
        }
      default:
        return { progress: 0, completed: 0, total: 0 }
    }
  }

  const calculateGoalsAchieved = (_week: string, sessions: StudySession[]) => {
    // 简单的目标达成计算逻辑
    const weeklyGoal = 20 * 60 // 20小时每周
    const actualTime = sessions.reduce((sum, s) => sum + s.duration, 0)
    return Math.min(100, Math.round((actualTime / weeklyGoal) * 100))
  }

  const calculateStreak = (week: string) => {
    // 连续学习天数计算
    const sortedSessions = [...studySessions.value].sort((a, b) => a.date.localeCompare(b.date))
    let streak = 0
    let currentDate = new Date(week)
    
    for (let i = 6; i >= 0; i--) {
      const checkDate = new Date(currentDate)
      checkDate.setDate(currentDate.getDate() - i)
      const dateString = checkDate.toISOString().split('T')[0]
      
      if (sortedSessions.some(s => s.date === dateString)) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  const checkAchievements = () => {
    const totalTime = totalStudyTime.value
    const sessions = studySessions.value.length
    const completedSubjects = [
      cs408Store.solvedProblems.length > 0,
      mathStore.completedChapters.length > 0,
      englishStore.readingPassages.filter(p => p.accuracy !== undefined).length > 0,
      politicsStore.masteryStats.mastered > 0
    ].filter(Boolean).length

    // 学习时长成就
    if (totalTime >= 60 && !achievements.value.find(a => a.id === 'first_hour')) {
      unlockAchievement('first_hour')
    }
    
    if (totalTime >= 300 && !achievements.value.find(a => a.id === 'five_hours')) {
      unlockAchievement('five_hours')
    }
    
    if (totalTime >= 1000 && !achievements.value.find(a => a.id === 'ten_hours')) {
      unlockAchievement('ten_hours')
    }

    // 学习会话成就
    if (sessions >= 10 && !achievements.value.find(a => a.id === 'ten_sessions')) {
      unlockAchievement('ten_sessions')
    }

    // 科目完成成就
    if (completedSubjects >= 2 && !achievements.value.find(a => a.id === 'two_subjects')) {
      unlockAchievement('two_subjects')
    }
    
    if (completedSubjects >= 4 && !achievements.value.find(a => a.id === 'all_subjects')) {
      unlockAchievement('all_subjects')
    }
  }

  const unlockAchievement = (achievementId: string) => {
    const achievement = achievements.value.find(a => a.id === achievementId)
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true
      achievement.unlockDate = new Date().toISOString()
      saveAnalyticsData()
    }
  }

  const exportData = () => {
    const exportData = {
      sessions: studySessions.value,
      achievements: achievements.value,
      reports: {
        daily: generateDailyReport(),
        monthly: generateMonthlyReport(),
        weekly: weeklyReports.value
      },
      exportTime: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `学习数据_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    
    URL.revokeObjectURL(url)
  }

  // 数据持久化
  const saveAnalyticsData = async () => {
    localStorage.setItem('studySessions', JSON.stringify(studySessions.value))
    localStorage.setItem('achievements', JSON.stringify(achievements.value))
  }

  const initializeAnalyticsData = async () => {
    isLoading.value = true
    try {
      const storedSessions = localStorage.getItem('studySessions')
      const storedAchievements = localStorage.getItem('achievements')
      
      if (storedSessions) {
        studySessions.value = JSON.parse(storedSessions)
      }
      
      if (storedAchievements) {
        achievements.value = JSON.parse(storedAchievements)
      } else {
        // 初始化成就系统
        achievements.value = [
          {
            id: 'first_hour',
            title: '初学者',
            description: '累计学习1小时',
            icon: '🎓',
            unlocked: false,
            criteria: '总学习时间达到60分钟'
          },
          {
            id: 'five_hours',
            title: '坚持者',
            description: '累计学习5小时',
            icon: '💪',
            unlocked: false,
            criteria: '总学习时间达到300分钟'
          },
          {
            id: 'ten_hours',
            title: '学霸',
            description: '累计学习10小时',
            icon: '🏆',
            unlocked: false,
            criteria: '总学习时间达到600分钟'
          },
          {
            id: 'ten_sessions',
            title: '勤奋者',
            description: '完成10次学习会话',
            icon: '📊',
            unlocked: false,
            criteria: '累计学习会话达到10次'
          },
          {
            id: 'two_subjects',
            title: '全面发展',
            description: '在两个科目中都有学习进展',
            icon: '🎯',
            unlocked: false,
            criteria: '至少在两个不同科目中有学习记录'
          },
          {
            id: 'all_subjects',
            title: '全能选手',
            description: '四门科目都有学习进展',
            icon: '🌟',
            unlocked: false,
            criteria: '四门考研科目都有学习记录'
          }
        ]
      }
    } catch (error) {
      console.error('初始化分析数据失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    // 状态
    studySessions,
    achievements,
    isLoading,
    
    // 计算属性
    totalStudyTime,
    averageProductivity,
    subjectDistribution,
    weeklyReports,
    recentAchievements,
    productivityTrend,
    
    // 方法
    addStudySession,
    generateDailyReport,
    generateMonthlyReport,
    getSubjectProgress,
    exportData,
    initializeAnalyticsData
  }
})