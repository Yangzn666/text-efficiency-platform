import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 任务数据接口
export interface Task {
  id: number
  title: string
  description?: string
  priority: 'high' | 'medium' | 'low'
  subject: '408计算机' | '数学一' | '英语一' | '政治'
  startDate?: string  // 任务开始日期
  dueDate?: string    // 任务截止日期
  estimatedDuration?: string
  completed: boolean
  createdAt: string
  updatedAt: string
  progress?: number   // 任务进度百分比 (0-100)
  tags?: string[]     // 任务标签
}

export const useTaskStore = defineStore('tasks', () => {
  // 状态
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const todayTasks = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return tasks.value.filter(task => {
      // 如果没有设置截止日期，则默认为今日任务
      if (!task.dueDate) return true
      // 如果设置了截止日期，则只显示今日及之前的任务
      return task.dueDate <= today
    })
  })

  const completedTasks = computed(() => {
    return tasks.value.filter(task => task.completed)
  })

  const pendingTasks = computed(() => {
    return tasks.value.filter(task => !task.completed)
  })

  const tasksBySubject = computed(() => {
    return tasks.value.reduce((acc, task) => {
      if (!acc[task.subject]) {
        acc[task.subject] = []
      }
      acc[task.subject].push(task)
      return acc
    }, {} as Record<string, Task[]>)
  })

  const tasksByPriority = computed(() => {
    return tasks.value.reduce((acc, task) => {
      if (!acc[task.priority]) {
        acc[task.priority] = []
      }
      acc[task.priority].push(task)
      return acc
    }, {} as Record<string, Task[]>)
  })

  // 工具方法
  const getPriorityText = (priority: string) => {
    const texts: Record<string, string> = {
      'high': '高优先级',
      'medium': '中优先级',
      'low': '低优先级'
    }
    return texts[priority] || priority
  }

  const getPriorityValue = (priority: string) => {
    const values: Record<string, number> = {
      'high': 3,
      'medium': 2,
      'low': 1
    }
    return values[priority] || 0
  }

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      '408计算机': '#409EFF',
      '数学一': '#67C23A',
      '英语一': '#E6A23C',
      '政治': '#F56C6C'
    }
    return colors[subject] || '#909399'
  }

  // 获取任务时间范围内的所有日期
  const getTaskDateRange = (task: Task): string[] => {
    if (!task.startDate || !task.dueDate) return []
    
    const dates: string[] = []
    const start = new Date(task.startDate)
    const end = new Date(task.dueDate)
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0])
    }
    
    return dates
  }

  // 检查任务是否逾期
  const isTaskOverdue = (task: Task): boolean => {
    if (task.completed || !task.dueDate) return false
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return dueDate < today
  }

  // 获取任务剩余天数
  const getRemainingDays = (task: Task): number => {
    if (task.completed || !task.dueDate) return 0
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diffTime = dueDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // 更新任务进度
  const updateTaskProgress = async (id: number, progress: number) => {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      task.progress = Math.max(0, Math.min(100, progress))
      task.updatedAt = new Date().toISOString()
      if (progress >= 100) {
        task.completed = true
      }
      saveTasks()
    }
  }

  // Actions
  const generateId = () => {
    return Date.now() + Math.floor(Math.random() * 1000)
  }

  const loadTasks = () => {
    loading.value = true
    try {
      // 强制重新初始化2026年学习计划数据
      console.log('🔄 重新初始化2026年学习计划数据');
      
      // 清除旧数据
      localStorage.removeItem('study-tasks');
      localStorage.removeItem('study-plans-2026');
      
      // 初始化您的2026年学习规划数据
      tasks.value = [
        {
          id: generateId(),
          title: '完成《基础三十讲》高数部分所有课后习题',
          description: '3月1日～3月5日，系统完成《基础三十讲》高等数学部分所有课后练习题，巩固基础知识',
          priority: 'high',
          subject: '数学一',
          startDate: '2026-03-01',
          dueDate: '2026-03-05',
          estimatedDuration: '120',
          completed: false,
          progress: 0,
          tags: ['高数', '基础练习', '基础三十讲'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: generateId(),
          title: '学完所有数一概率论部分',
          description: '3月1日～3月15日，系统学习考研数学一概率论部分所有知识点，建立完整知识框架',
          priority: 'high',
          subject: '数学一',
          startDate: '2026-03-01',
          dueDate: '2026-03-15',
          estimatedDuration: '180',
          completed: false,
          progress: 0,
          tags: ['概率论', '理论学习'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: generateId(),
          title: '完成《基础三十讲》概率论部分所有课后习题',
          description: '3月1日～3月15日，完成《基础三十讲》概率论部分所有课后习题，加深理解',
          priority: 'high',
          subject: '数学一',
          startDate: '2026-03-01',
          dueDate: '2026-03-15',
          estimatedDuration: '100',
          completed: false,
          progress: 0,
          tags: ['概率论', '习题练习', '基础三十讲'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: generateId(),
          title: '完成《1000题》所有高数部分基础题',
          description: '3月15日～3月31日，系统完成《1000题》高等数学部分所有基础题目，提升解题能力',
          priority: 'high',
          subject: '数学一',
          startDate: '2026-03-15',
          dueDate: '2026-03-31',
          estimatedDuration: '200',
          completed: false,
          progress: 0,
          tags: ['高数', '1000题', '基础训练'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: generateId(),
          title: '完成《1000题》线代，概率论部分基础题',
          description: '4月1日～4月15日，完成《1000题》线性代数和概率论部分的基础题目练习',
          priority: 'high',
          subject: '数学一',
          startDate: '2026-04-01',
          dueDate: '2026-04-15',
          estimatedDuration: '150',
          completed: false,
          progress: 0,
          tags: ['线代', '概率论', '1000题'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: generateId(),
          title: '复习完王道《数据结构》',
          description: '3月15日～4月1日，系统复习王道考研《数据结构》教材，掌握核心算法和数据结构',
          priority: 'high',
          subject: '408计算机',
          startDate: '2026-03-15',
          dueDate: '2026-04-01',
          estimatedDuration: '180',
          completed: false,
          progress: 0,
          tags: ['数据结构', '王道', '专业课'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: generateId(),
          title: '复习完计算机组成原理',
          description: '4月1日～4月15日，系统复习计算机组成原理，掌握CPU、存储器、指令系统等核心内容',
          priority: 'high',
          subject: '408计算机',
          startDate: '2026-04-01',
          dueDate: '2026-04-15',
          estimatedDuration: '160',
          completed: false,
          progress: 0,
          tags: ['组成原理', '硬件基础'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: generateId(),
          title: '复习完计算机网络',
          description: '4月15日～5月1日，系统复习计算机网络，掌握OSI七层模型、TCP/IP协议栈等核心知识',
          priority: 'high',
          subject: '408计算机',
          startDate: '2026-04-15',
          dueDate: '2026-05-01',
          estimatedDuration: '140',
          completed: false,
          progress: 0,
          tags: ['计算机网络', '网络协议'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: generateId(),
          title: '复习完操作系统',
          description: '5月1日～5月15日，系统复习操作系统，掌握进程管理、内存管理、文件系统等核心概念',
          priority: 'high',
          subject: '408计算机',
          startDate: '2026-05-01',
          dueDate: '2026-05-15',
          estimatedDuration: '150',
          completed: false,
          progress: 0,
          tags: ['操作系统', '系统软件'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: generateId(),
          title: '做完660基础题复习',
          description: '4月15日～5月15日，系统完成660题基础部分练习，全面复习各科基础知识',
          priority: 'high',
          subject: '数学一',
          startDate: '2026-04-15',
          dueDate: '2026-05-15',
          estimatedDuration: '200',
          completed: false,
          progress: 0,
          tags: ['660题', '综合复习', '基础巩固'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      
      saveTasks();
      console.log('✅ 2026年学习计划数据初始化完成，共创建', tasks.value.length, '个任务');
      
    } catch (err) {
      error.value = '加载任务失败';
      console.error('❌ Failed to load tasks:', err);
    } finally {
      loading.value = false;
    }
  }

  const saveTasks = () => {
    try {
      localStorage.setItem('study-tasks', JSON.stringify(tasks.value))
    } catch (err) {
      error.value = '保存任务失败'
      console.error('Failed to save tasks:', err)
    }
  }

  const addTask = async (taskData: Omit<Task, 'id' | 'completed' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true
    try {
      const newTask: Task = {
        id: generateId(),
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      tasks.value.push(newTask)
      saveTasks()
      error.value = null
      return newTask
    } catch (err) {
      error.value = '添加任务失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTask = async (id: number, taskData: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    loading.value = true
    try {
      const taskIndex = tasks.value.findIndex(task => task.id === id)
      if (taskIndex !== -1) {
        tasks.value[taskIndex] = {
          ...tasks.value[taskIndex],
          ...taskData,
          updatedAt: new Date().toISOString()
        }
        saveTasks()
        error.value = null
        return tasks.value[taskIndex]
      } else {
        throw new Error('任务不存在')
      }
    } catch (err) {
      error.value = '更新任务失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTask = async (id: number) => {
    loading.value = true
    try {
      const taskIndex = tasks.value.findIndex(task => task.id === id)
      if (taskIndex !== -1) {
        tasks.value.splice(taskIndex, 1)
        saveTasks()
        error.value = null
      } else {
        throw new Error('任务不存在')
      }
    } catch (err) {
      error.value = '删除任务失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  const toggleTask = async (id: number) => {
    loading.value = true
    try {
      const task = tasks.value.find(task => task.id === id)
      if (task) {
        task.completed = !task.completed
        task.updatedAt = new Date().toISOString()
        saveTasks()
        error.value = null
        return task
      } else {
        throw new Error('任务不存在')
      }
    } catch (err) {
      error.value = '切换任务状态失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getTaskById = (id: number) => {
    return tasks.value.find(task => task.id === id)
  }

  const getTasksByDate = (date: string) => {
    return tasks.value.filter(task => task.dueDate === date)
  }

  const getTasksBySubjectAndDate = (subject: string, date: string) => {
    return tasks.value.filter(task => 
      task.subject === subject && 
      (!task.dueDate || task.dueDate === date)
    )
  }

  const clearCompletedTasks = async () => {
    loading.value = true
    try {
      tasks.value = tasks.value.filter(task => !task.completed)
      saveTasks()
      error.value = null
    } catch (err) {
      error.value = '清空已完成任务失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetStore = () => {
    tasks.value = []
    loading.value = false
    error.value = null
    localStorage.removeItem('study-tasks')
  }

  return {
    // 状态
    tasks,
    loading,
    error,
    
    // 计算属性
    todayTasks,
    completedTasks,
    pendingTasks,
    tasksBySubject,
    tasksByPriority,
    
    // 工具方法
    getPriorityText,
    getPriorityValue,
    getSubjectColor,
    getTaskDateRange,
    isTaskOverdue,
    getRemainingDays,
    updateTaskProgress,
    
    // Actions
    loadTasks,
    saveTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    getTaskById,
    getTasksByDate,
    getTasksBySubjectAndDate,
    clearCompletedTasks,
    resetStore
  }
})