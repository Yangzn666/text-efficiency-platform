import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface UserPreference {
  theme: 'light' | 'dark' | 'auto'
  language: 'zh' | 'en'
  fontSize: 'small' | 'medium' | 'large'
  animation: boolean
  notifications: boolean
  soundEffects: boolean
}

interface Shortcut {
  id: string
  name: string
  key: string
  action: string
  enabled: boolean
}

interface TutorialStep {
  id: string
  title: string
  content: string
  targetElement?: string
  completed: boolean
}

export const useUXStore = defineStore('ux', () => {
  // 状态
  const preferences = ref<UserPreference>({
    theme: 'light',
    language: 'zh',
    fontSize: 'medium',
    animation: true,
    notifications: true,
    soundEffects: false
  })
  
  const shortcuts = ref<Shortcut[]>([
    {
      id: 'focus_mode',
      name: '专注模式',
      key: 'Ctrl+Shift+F',
      action: 'toggleFocusMode',
      enabled: true
    },
    {
      id: 'quick_timer',
      name: '快速计时',
      key: 'Ctrl+T',
      action: 'startQuickTimer',
      enabled: true
    },
    {
      id: 'toggle_sidebar',
      name: '切换侧边栏',
      key: 'Ctrl+B',
      action: 'toggleSidebar',
      enabled: true
    },
    {
      id: 'search',
      name: '全局搜索',
      key: 'Ctrl+K',
      action: 'openSearch',
      enabled: true
    }
  ])
  
  const tutorialSteps = ref<TutorialStep[]>([
    {
      id: 'welcome',
      title: '欢迎使用考研效率平台',
      content: '这是一个专为考研学子设计的学习效率提升平台，帮助您更好地管理学习时间和提高专注力。',
      completed: false
    },
    {
      id: 'dashboard',
      title: '学习仪表板',
      content: '这里是您的学习中心，可以查看今日学习计划、专注时间统计和各科目进度。',
      targetElement: '.dashboard-overview',
      completed: false
    },
    {
      id: 'timer',
      title: '番茄钟专注',
      content: '使用番茄钟技术来提高学习专注度，25分钟专注学习后休息5分钟。',
      targetElement: '.pomodoro-timer',
      completed: false
    },
    {
      id: 'subjects',
      title: '学科专项训练',
      content: '针对考研四门科目提供专业的学习工具和练习系统。',
      targetElement: '.subject-modules',
      completed: false
    },
    {
      id: 'analytics',
      title: '学习数据分析',
      content: '通过详细的数据分析了解自己的学习习惯和进步情况。',
      targetElement: '.analytics-section',
      completed: false
    }
  ])
  
  const currentTutorialStep = ref(0)
  const isTutorialActive = ref(false)
  const isLoading = ref(false)

  // 计算属性
  const completedTutorialSteps = computed(() => {
    return tutorialSteps.value.filter(step => step.completed).length
  })

  const tutorialProgress = computed(() => {
    return Math.round((completedTutorialSteps.value / tutorialSteps.value.length) * 100)
  })

  const activeShortcuts = computed(() => {
    return shortcuts.value.filter(shortcut => shortcut.enabled)
  })

  // 方法
  const updatePreference = async <K extends keyof UserPreference>(
    key: K,
    value: UserPreference[K]
  ) => {
    isLoading.value = true
    try {
      preferences.value[key] = value
      await saveUXData()
      
      // 应用主题变化
      if (key === 'theme') {
        applyTheme(value as string)
      }
      
      // 应用字体大小变化
      if (key === 'fontSize') {
        applyFontSize(value as string)
      }
      
      return true
    } catch (error) {
      console.error('更新偏好设置失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const toggleShortcut = async (shortcutId: string) => {
    const shortcut = shortcuts.value.find(s => s.id === shortcutId)
    if (shortcut) {
      shortcut.enabled = !shortcut.enabled
      await saveUXData()
      return shortcut.enabled
    }
    return false
  }

  const completeTutorialStep = async (stepId: string) => {
    const step = tutorialSteps.value.find(s => s.id === stepId)
    if (step) {
      step.completed = true
      await saveUXData()
      
      // 自动进入下一步
      if (currentTutorialStep.value < tutorialSteps.value.length - 1) {
        currentTutorialStep.value++
      }
      
      return true
    }
    return false
  }

  const startTutorial = () => {
    isTutorialActive.value = true
    currentTutorialStep.value = 0
  }

  const nextTutorialStep = () => {
    if (currentTutorialStep.value < tutorialSteps.value.length - 1) {
      currentTutorialStep.value++
    } else {
      finishTutorial()
    }
  }

  const prevTutorialStep = () => {
    if (currentTutorialStep.value > 0) {
      currentTutorialStep.value--
    }
  }

  const finishTutorial = async () => {
    isTutorialActive.value = false
    currentTutorialStep.value = 0
    
    // 标记所有步骤为完成
    tutorialSteps.value.forEach(step => {
      step.completed = true
    })
    
    await saveUXData()
  }

  const resetTutorial = async () => {
    tutorialSteps.value.forEach(step => {
      step.completed = false
    })
    currentTutorialStep.value = 0
    isTutorialActive.value = false
    await saveUXData()
  }

  const applyTheme = (theme: string) => {
    const body = document.body
    
    // 移除现有主题类
    body.classList.remove('theme-light', 'theme-dark')
    
    // 应用新主题
    if (theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      body.classList.add(isDark ? 'theme-dark' : 'theme-light')
    } else {
      body.classList.add(`theme-${theme}`)
    }
  }

  const applyFontSize = (size: string) => {
    const html = document.documentElement
    
    // 移除现有字体大小类
    html.classList.remove('font-small', 'font-medium', 'font-large')
    
    // 应用新字体大小
    html.classList.add(`font-${size}`)
  }

  const getShortcutByKey = (key: string) => {
    return shortcuts.value.find(shortcut => shortcut.key === key)
  }

  const showNotification = (title: string, message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
    if (!preferences.value.notifications) return
    
    // 创建通知元素
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
      <div class="notification-content">
        <h4>${title}</h4>
        <p>${message}</p>
      </div>
      <button class="notification-close">&times;</button>
    `
    
    // 添加到页面
    document.body.appendChild(notification)
    
    // 添加关闭事件
    const closeBtn = notification.querySelector('.notification-close')
    closeBtn?.addEventListener('click', () => {
      document.body.removeChild(notification)
    })
    
    // 自动关闭
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 5000)
  }

  const playSound = (soundType: 'success' | 'warning' | 'error' | 'notification') => {
    if (!preferences.value.soundEffects) return
    
    // 简单的音频反馈（实际应用中应该使用真实的音频文件）
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // 不同声音类型的频率设置
    const frequencies: Record<string, number> = {
      success: 880,
      warning: 660,
      error: 440,
      notification: 550
    }
    
    oscillator.frequency.setValueAtTime(frequencies[soundType] || 440, audioContext.currentTime)
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  // 数据持久化
  const saveUXData = async () => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences.value))
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts.value))
    localStorage.setItem('tutorialSteps', JSON.stringify(tutorialSteps.value))
  }

  const initializeUXData = async () => {
    isLoading.value = true
    try {
      const storedPreferences = localStorage.getItem('userPreferences')
      const storedShortcuts = localStorage.getItem('shortcuts')
      const storedTutorial = localStorage.getItem('tutorialSteps')
      
      if (storedPreferences) {
        preferences.value = { ...preferences.value, ...JSON.parse(storedPreferences) }
      }
      
      if (storedShortcuts) {
        shortcuts.value = JSON.parse(storedShortcuts)
      }
      
      if (storedTutorial) {
        tutorialSteps.value = JSON.parse(storedTutorial)
      }
      
      // 应用初始设置
      applyTheme(preferences.value.theme)
      applyFontSize(preferences.value.fontSize)
      
    } catch (error) {
      console.error('初始化UX数据失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    // 状态
    preferences,
    shortcuts,
    tutorialSteps,
    currentTutorialStep,
    isTutorialActive,
    isLoading,
    
    // 计算属性
    completedTutorialSteps,
    tutorialProgress,
    activeShortcuts,
    
    // 方法
    updatePreference,
    toggleShortcut,
    completeTutorialStep,
    startTutorial,
    nextTutorialStep,
    prevTutorialStep,
    finishTutorial,
    resetTutorial,
    getShortcutByKey,
    showNotification,
    playSound,
    initializeUXData
  }
})