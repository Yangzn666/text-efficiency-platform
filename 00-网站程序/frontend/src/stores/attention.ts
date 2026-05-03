import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import localforage from 'localforage'
import { usePsychologyStore } from './psychology'

interface PomodoroSession {
  id: string
  startTime: string
  endTime?: string
  duration: number // 分钟
  subject: string
  status: 'active' | 'completed' | 'interrupted'
  interruptions: number
}

interface Task {
  id: string
  title: string
  description: string
  duration: number // 分钟
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in-progress' | 'completed'
  createdAt: string
  completedAt?: string
}

interface DistractionRecord {
  id: string
  trigger: string // 诱惑源（如短视频、社交媒体等）
  timestamp: string
  alternativeTask: string // 替代任务
  completed: boolean
}

export const useAttentionStore = defineStore('attention', () => {
  // 状态
  const currentSession = ref<PomodoroSession | null>(null)
  const pomodoroSessions = ref<PomodoroSession[]>([])
  const tasks = ref<Task[]>([])
  const distractionRecords = ref<DistractionRecord[]>([])
  const timerState = ref<'idle' | 'running' | 'paused' | 'completed'>('idle')
  const remainingTime = ref(0)
  const settings = ref({
    workDuration: 25, // 工作时间（分钟）
    breakDuration: 5, // 休息时间（分钟）
    longBreakDuration: 15, // 长休息时间（分钟）
    sessionsBeforeLongBreak: 4, // 长休息前的会话数
    enableSound: true,
    enableNotifications: true
  })

  // 计算属性
  const todaysSessions = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return pomodoroSessions.value.filter(session => 
      session.startTime.startsWith(today)
    )
  })

  const todaysFocusTime = computed(() => {
    return todaysSessions.value.reduce((total, session) => {
      if (session.status === 'completed') {
        return total + session.duration
      }
      return total
    }, 0)
  })

  const sessionCompletionRate = computed(() => {
    if (todaysSessions.value.length === 0) return 0
    const completed = todaysSessions.value.filter(s => s.status === 'completed').length
    return Math.round((completed / todaysSessions.value.length) * 100)
  })

  const distractionCountToday = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return distractionRecords.value.filter(record => 
      record.timestamp.startsWith(today) && !record.completed
    ).length
  })

  // 方法
  const startPomodoroSession = async (subject: string) => {
    if (timerState.value !== 'idle') return

    const newSession: PomodoroSession = {
      id: 'session_' + Date.now(),
      startTime: new Date().toISOString(),
      duration: settings.value.workDuration,
      subject,
      status: 'active',
      interruptions: 0
    }

    currentSession.value = newSession
    remainingTime.value = settings.value.workDuration * 60 // 转换为秒
    timerState.value = 'running'

    // 保存到本地存储
    await saveSessionData()
  }

  const pauseSession = () => {
    if (timerState.value === 'running') {
      timerState.value = 'paused'
    }
  }

  const resumeSession = () => {
    if (timerState.value === 'paused') {
      timerState.value = 'running'
    }
  }

  const completeSession = async () => {
    if (!currentSession.value) return

    currentSession.value.endTime = new Date().toISOString()
    currentSession.value.status = 'completed'
    
    pomodoroSessions.value.push(currentSession.value)
    
    // 给予积分奖励
    const psychologyStore = usePsychologyStore()
    const sessionDuration = currentSession.value.duration
    psychologyStore.integrateWithAttention(sessionDuration, 1)
    
    currentSession.value = null
    timerState.value = 'completed'
    remainingTime.value = 0

    // 保存数据
    await saveSessionData()
    
    // 重置为待机状态
    setTimeout(() => {
      timerState.value = 'idle'
    }, 3000)
  }

  const interruptSession = async () => {
    if (!currentSession.value) return

    currentSession.value.status = 'interrupted'
    currentSession.value.interruptions += 1
    
    pomodoroSessions.value.push(currentSession.value)
    currentSession.value = null
    timerState.value = 'idle'
    remainingTime.value = 0

    await saveSessionData()
  }

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'status'>) => {
    const newTask: Task = {
      id: 'task_' + Date.now(),
      ...taskData,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    tasks.value.push(newTask)
    await saveTaskData()
    return newTask
  }

  const completeTask = async (taskId: string) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (task && task.status === 'in-progress') {
      task.status = 'completed'
      task.completedAt = new Date().toISOString()
      await saveTaskData()
    }
  }

  const startTask = async (taskId: string) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (task && task.status === 'pending') {
      task.status = 'in-progress'
      await saveTaskData()
    }
  }

  const recordDistraction = async (trigger: string, alternativeTask: string) => {
    const newRecord: DistractionRecord = {
      id: 'distraction_' + Date.now(),
      trigger,
      timestamp: new Date().toISOString(),
      alternativeTask,
      completed: false
    }

    distractionRecords.value.push(newRecord)
    await saveDistractionData()
    return newRecord
  }

  const completeAlternativeTask = async (distractionId: string) => {
    const record = distractionRecords.value.find(r => r.id === distractionId)
    if (record) {
      record.completed = true
      await saveDistractionData()
      
      // 给予积分奖励
      const psychologyStore = usePsychologyStore()
      psychologyStore.addPoints(15, '成功抵抗诱惑')
    }
  }

  const updateSettings = async (newSettings: Partial<typeof settings.value>) => {
    settings.value = { ...settings.value, ...newSettings }
    await localforage.setItem('pomodoroSettings', settings.value)
  }

  const tick = () => {
    if (timerState.value === 'running' && remainingTime.value > 0) {
      remainingTime.value -= 1
      
      // 检查是否完成
      if (remainingTime.value === 0) {
        completeSession()
      }
    }
  }

  const getWeeklyReport = () => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const weeklySessions = pomodoroSessions.value.filter(session => 
      new Date(session.startTime) >= oneWeekAgo
    )

    const dailyStats: Record<string, { sessions: number; focusTime: number }> = {}
    
    weeklySessions.forEach(session => {
      const date = session.startTime.split('T')[0]
      if (!dailyStats[date]) {
        dailyStats[date] = { sessions: 0, focusTime: 0 }
      }
      
      if (session.status === 'completed') {
        dailyStats[date].sessions += 1
        dailyStats[date].focusTime += session.duration
      }
    })

    return {
      totalSessions: weeklySessions.length,
      completedSessions: weeklySessions.filter(s => s.status === 'completed').length,
      totalFocusTime: weeklySessions
        .filter(s => s.status === 'completed')
        .reduce((sum, s) => sum + s.duration, 0),
      dailyStats
    }
  }

  // 数据持久化方法
  const saveSessionData = async () => {
    await localforage.setItem('pomodoroSessions', pomodoroSessions.value)
    await localforage.setItem('currentSession', currentSession.value)
  }

  const saveTaskData = async () => {
    await localforage.setItem('tasks', tasks.value)
  }

  const saveDistractionData = async () => {
    await localforage.setItem('distractionRecords', distractionRecords.value)
  }

  const initializeAttentionData = async () => {
    try {
      // 加载会话数据
      const storedSessions = await localforage.getItem<PomodoroSession[]>('pomodoroSessions')
      const storedCurrentSession = await localforage.getItem<PomodoroSession | null>('currentSession')
      const storedTasks = await localforage.getItem<Task[]>('tasks')
      const storedDistractions = await localforage.getItem<DistractionRecord[]>('distractionRecords')
      const storedSettings = await localforage.getItem< typeof settings.value>('pomodoroSettings')

      if (storedSessions) pomodoroSessions.value = storedSessions
      if (storedCurrentSession) currentSession.value = storedCurrentSession
      if (storedTasks) tasks.value = storedTasks
      if (storedDistractions) distractionRecords.value = storedDistractions
      if (storedSettings) settings.value = storedSettings

      // 恢复未完成的会话
      if (currentSession.value && currentSession.value.status === 'active') {
        const elapsed = Math.floor(
          (Date.now() - new Date(currentSession.value.startTime).getTime()) / 1000
        )
        remainingTime.value = Math.max(0, 
          currentSession.value.duration * 60 - elapsed
        )
        timerState.value = 'paused'
      }
    } catch (error) {
      console.error('初始化注意力数据失败:', error)
    }
  }

  return {
    // 状态
    currentSession,
    pomodoroSessions,
    tasks,
    distractionRecords,
    timerState,
    remainingTime,
    settings,
    
    // 计算属性
    todaysSessions,
    todaysFocusTime,
    sessionCompletionRate,
    distractionCountToday,
    
    // 方法
    startPomodoroSession,
    pauseSession,
    resumeSession,
    completeSession,
    interruptSession,
    addTask,
    completeTask,
    startTask,
    recordDistraction,
    completeAlternativeTask,
    updateSettings,
    tick,
    getWeeklyReport,
    initializeAttentionData
  }
})