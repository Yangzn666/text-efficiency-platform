import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usePsychologyStore } from './psychology'

export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
  category?: string
  estimatedDuration?: number // 预估完成时间（分钟）
}

export const useTodoStore = defineStore('todos', () => {
  // 状态
  const todos = ref<Todo[]>([])
  const loading = ref(false)

  // 计算属性
  const todayTodos = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return todos.value.filter(todo => 
      !todo.completed && 
      (!todo.dueDate || todo.dueDate <= today)
    )
  })

  const completedTodos = computed(() => {
    return todos.value.filter(todo => todo.completed)
  })

  const pendingTodos = computed(() => {
    return todos.value.filter(todo => !todo.completed)
  })

  const highPriorityTodos = computed(() => {
    return todos.value.filter(todo => 
      !todo.completed && todo.priority === 'high'
    )
  })

  // 方法
  const addTodo = (todo: Omit<Todo, 'id' | 'createdAt'>) => {
    const newTodo: Todo = {
      ...todo,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    todos.value.push(newTodo)
    saveTodos()
  }

  const toggleTodo = (id: string) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      const wasCompleted = todo.completed
      todo.completed = !todo.completed
      saveTodos()
      
      // 如果是完成任务，给予积分奖励
      if (todo.completed && !wasCompleted) {
        const psychologyStore = usePsychologyStore()
        
        // 根据任务属性计算积分
        let points = 10 // 基础积分
        
        // 高优先级任务额外奖励
        if (todo.priority === 'high') {
          points += 10
        }
        
        // 长时间任务额外奖励
        if (todo.estimatedDuration && todo.estimatedDuration > 60) {
          points += 15
        }
        
        // 添加积分到心理学系统
        psychologyStore.integrateWithTodos([todo.id])
      }
    }
  }

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    const index = todos.value.findIndex(t => t.id === id)
    if (index !== -1) {
      todos.value[index] = { ...todos.value[index], ...updates }
      saveTodos()
    }
  }

  const deleteTodo = (id: string) => {
    const index = todos.value.findIndex(t => t.id === id)
    if (index !== -1) {
      todos.value.splice(index, 1)
      saveTodos()
    }
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'high': '#f44336',
      'medium': '#ff9800',
      'low': '#4caf50'
    }
    return colors[priority] || '#9e9e9e'
  }

  const getPriorityText = (priority: string) => {
    const texts: Record<string, string> = {
      'high': '高优先级',
      'medium': '中优先级',
      'low': '低优先级'
    }
    return texts[priority] || '未知'
  }

  // 本地存储
  const saveTodos = () => {
    localStorage.setItem('todos', JSON.stringify(todos.value))
  }

  const loadTodos = () => {
    const saved = localStorage.getItem('todos')
    if (saved) {
      try {
        todos.value = JSON.parse(saved)
      } catch (e) {
        console.error('Failed to load todos:', e)
      }
    }
  }

  // 初始化
  loadTodos()

  return {
    // 状态
    todos,
    loading,
    
    // 计算属性
    todayTodos,
    completedTodos,
    pendingTodos,
    highPriorityTodos,
    
    // 方法
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    getPriorityColor,
    getPriorityText,
    saveTodos,
    loadTodos
  }
})