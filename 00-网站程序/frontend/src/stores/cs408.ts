import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import localforage from 'localforage'

interface CodeProblem {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  template: string
  solution: string
  testCase: TestCase[]
  userSolution?: string
  passedTests?: number
  totalTests?: number
  completed: boolean
  completionTime?: string
}

interface TestCase {
  input: string
  expectedOutput: string
}

interface MindMapNode {
  id: string
  title: string
  content: string
  children: MindMapNode[]
  x: number
  y: number
}

interface KnowledgePoint {
  id: string
  subject: '数据结构' | '计算机组成原理' | '操作系统' | '计算机网络'
  title: string
  description: string
  importance: 'high' | 'medium' | 'low'
  masteryLevel: number // 0-100
  lastReviewed: string
  reviewInterval: number // 天数
}

export const useCS408Store = defineStore('cs408', () => {
  // 状态
  const codeProblems = ref<CodeProblem[]>([])
  const mindMapNodes = ref<MindMapNode[]>([])
  const knowledgePoints = ref<KnowledgePoint[]>([])
  const currentProblem = ref<CodeProblem | null>(null)
  const isLoading = ref(false)

  // 计算属性
  const solvedProblems = computed(() => {
    return codeProblems.value.filter(problem => problem.completed)
  })

  const problemStats = computed(() => {
    const stats = {
      total: codeProblems.value.length,
      solved: solvedProblems.value.length,
      easy: 0,
      medium: 0,
      hard: 0
    }
    
    codeProblems.value.forEach(problem => {
      stats[problem.difficulty]++
    })
    
    return stats
  })

  const masteryOverview = computed(() => {
    const subjects: Record<string, { total: number; mastered: number; averageMastery: number }> = {
      '数据结构': { total: 0, mastered: 0, averageMastery: 0 },
      '计算机组成原理': { total: 0, mastered: 0, averageMastery: 0 },
      '操作系统': { total: 0, mastered: 0, averageMastery: 0 },
      '计算机网络': { total: 0, mastered: 0, averageMastery: 0 }
    }
    
    knowledgePoints.value.forEach(point => {
      const subject = subjects[point.subject]
      if (subject) {
        subject.total++
        subject.averageMastery += point.masteryLevel
        if (point.masteryLevel >= 80) subject.mastered++
      }
    })
    
    Object.values(subjects).forEach(subject => {
      if (subject.total > 0) {
        subject.averageMastery = Math.round(subject.averageMastery / subject.total)
      }
    })
    
    return subjects
  })

  const dueForReview = computed(() => {
    const today = new Date()
    return knowledgePoints.value.filter(point => {
      const nextReview = new Date(point.lastReviewed)
      nextReview.setDate(nextReview.getDate() + point.reviewInterval)
      return nextReview <= today
    })
  })

  // 方法
  const addCodeProblem = async (problemData: Omit<CodeProblem, 'id' | 'completed'>) => {
    isLoading.value = true
    try {
      const newProblem: CodeProblem = {
        id: 'problem_' + Date.now(),
        ...problemData,
        completed: false
      }

      codeProblems.value.push(newProblem)
      await saveCS408Data()
      return newProblem
    } catch (error) {
      console.error('添加编程题失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateProblemSolution = async (problemId: string, solution: string) => {
    const problem = codeProblems.value.find(p => p.id === problemId)
    if (problem) {
      problem.userSolution = solution
      await saveCS408Data()
    }
  }

  const runTestCase = (problemId: string, userSolution: string) => {
    const problem = codeProblems.value.find(p => p.id === problemId)
    if (!problem) return { passed: 0, total: 0, results: [] }

    // 简化的测试执行逻辑（实际应用中需要安全的沙箱环境）
    const results = problem.testCase.map(test => {
      try {
        // 这里应该是实际的代码执行逻辑
        const passed = Math.random() > 0.3 // 模拟测试结果
        return { input: test.input, expected: test.expectedOutput, passed }
      } catch (error) {
        return { input: test.input, expected: test.expectedOutput, passed: false, error: String(error) }
      }
    })

    const passed = results.filter(r => r.passed).length
    return { passed, total: results.length, results }
  }

  const completeProblem = async (problemId: string, userSolution: string) => {
    const problem = codeProblems.value.find(p => p.id === problemId)
    if (problem && !problem.completed) {
      const testResult = runTestCase(problemId, userSolution)
      
      problem.userSolution = userSolution
      problem.passedTests = testResult.passed
      problem.totalTests = testResult.total
      problem.completed = testResult.passed === testResult.total
      problem.completionTime = new Date().toISOString()
      
      await saveCS408Data()
      return problem.completed
    }
    return false
  }

  const addKnowledgePoint = async (pointData: Omit<KnowledgePoint, 'id' | 'masteryLevel' | 'lastReviewed' | 'reviewInterval'>) => {
    isLoading.value = true
    try {
      const newPoint: KnowledgePoint = {
        id: 'point_' + Date.now(),
        ...pointData,
        masteryLevel: 0,
        lastReviewed: new Date().toISOString(),
        reviewInterval: 1 // 初始1天复习间隔
      }

      knowledgePoints.value.push(newPoint)
      await saveCS408Data()
      return newPoint
    } catch (error) {
      console.error('添加知识点失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateMasteryLevel = async (pointId: string, level: number) => {
    const point = knowledgePoints.value.find(p => p.id === pointId)
    if (point) {
      point.masteryLevel = Math.max(0, Math.min(100, level))
      point.lastReviewed = new Date().toISOString()
      
      // 根据掌握程度调整复习间隔
      if (level >= 90) point.reviewInterval = 30
      else if (level >= 70) point.reviewInterval = 14
      else if (level >= 50) point.reviewInterval = 7
      else point.reviewInterval = 3
      
      await saveCS408Data()
    }
  }

  const createMindMap = async (rootNode: Omit<MindMapNode, 'id' | 'children'>) => {
    isLoading.value = true
    try {
      const newRoot: MindMapNode = {
        id: 'mindmap_' + Date.now(),
        ...rootNode,
        children: [],
        x: 0,
        y: 0
      }

      mindMapNodes.value.push(newRoot)
      await saveCS408Data()
      return newRoot
    } catch (error) {
      console.error('创建思维导图失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const addMindMapNode = async (parentId: string, nodeData: Omit<MindMapNode, 'id' | 'children' | 'x' | 'y'>) => {
    const parentNode = findNode(parentId)
    if (parentNode) {
      const newNode: MindMapNode = {
        id: 'node_' + Date.now(),
        ...nodeData,
        children: [],
        x: 0,
        y: 0
      }
      
      parentNode.children.push(newNode)
      await saveCS408Data()
      return newNode
    }
  }

  const findNode = (nodeId: string): MindMapNode | null => {
    const findInArray = (nodes: MindMapNode[]): MindMapNode | null => {
      for (const node of nodes) {
        if (node.id === nodeId) return node
        const found = findInArray(node.children)
        if (found) return found
      }
      return null
    }
    
    return findInArray(mindMapNodes.value)
  }

  const getSubjectProblems = (subject: string) => {
    // 根据标签筛选相关编程题
    return codeProblems.value.filter(problem => 
      problem.tags.includes(subject)
    )
  }

  const getReviewSchedule = () => {
    const schedule: Record<string, KnowledgePoint[]> = {}
    
    dueForReview.value.forEach(point => {
      const nextReview = new Date(point.lastReviewed)
      nextReview.setDate(nextReview.getDate() + point.reviewInterval)
      const dateKey = nextReview.toISOString().split('T')[0]
      
      if (!schedule[dateKey]) {
        schedule[dateKey] = []
      }
      schedule[dateKey].push(point)
    })
    
    return schedule
  }

  const generatePracticePlan = (days: number = 7) => {
    const plan = []
    const today = new Date()
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dailyPlan = {
        date: dateStr,
        problems: [] as CodeProblem[],
        reviewPoints: [] as KnowledgePoint[],
        mindMapWork: [] as MindMapNode[]
      }
      
      // 分配编程题（每天2-3题）
      const availableProblems = codeProblems.value
        .filter(p => !p.completed)
        .slice(i * 2, i * 2 + 3)
      dailyPlan.problems = availableProblems
      
      // 分配复习知识点
      dailyPlan.reviewPoints = dueForReview.value.slice(i * 2, i * 2 + 2)
      
      plan.push(dailyPlan)
    }
    
    return plan
  }

  // 数据持久化
  const saveCS408Data = async () => {
    await localforage.setItem('cs408Problems', codeProblems.value)
    await localforage.setItem('cs408MindMaps', mindMapNodes.value)
    await localforage.setItem('cs408KnowledgePoints', knowledgePoints.value)
  }

  const initializeCS408Data = async () => {
    isLoading.value = true
    try {
      const storedProblems = await localforage.getItem<CodeProblem[]>('cs408Problems')
      const storedMindMaps = await localforage.getItem<MindMapNode[]>('cs408MindMaps')
      const storedPoints = await localforage.getItem<KnowledgePoint[]>('cs408KnowledgePoints')
      
      if (storedProblems) codeProblems.value = storedProblems
      if (storedMindMaps) mindMapNodes.value = storedMindMaps
      if (storedPoints) knowledgePoints.value = storedPoints
      
      // 如果没有数据，添加一些示例数据
      if (codeProblems.value.length === 0) {
        await loadSampleData()
      }
    } catch (error) {
      console.error('初始化408数据失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  const loadSampleData = async () => {
    // 添加示例编程题
    const sampleProblems: Omit<CodeProblem, 'id' | 'completed'>[] = [
      {
        title: '二叉树遍历',
        description: '实现二叉树的前序遍历',
        difficulty: 'medium',
        tags: ['数据结构', '二叉树'],
        template: 'function preorderTraversal(root) {\n  // 你的代码\n}',
        solution: 'function preorderTraversal(root) {\n  if (!root) return [];\n  return [root.val, ...preorderTraversal(root.left), ...preorderTraversal(root.right)];\n}',
        testCase: [
          { input: '[1,null,2,3]', expectedOutput: '[1,2,3]' },
          { input: '[]', expectedOutput: '[]' }
        ]
      },
      {
        title: 'LRU缓存',
        description: '实现LRU (最近最少使用) 缓存',
        difficulty: 'hard',
        tags: ['数据结构', '哈希表'],
        template: 'class LRUCache {\n  constructor(capacity) {}\n  get(key) {}\n  put(key, value) {}\n}',
        solution: 'class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const value = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, value);\n    return value;\n  }\n  put(key, value) {\n    if (this.cache.has(key)) {\n      this.cache.delete(key);\n    } else if (this.cache.size >= this.capacity) {\n      const firstKey = this.cache.keys().next().value;\n      this.cache.delete(firstKey);\n    }\n    this.cache.set(key, value);\n  }\n}',
        testCase: [
          { input: '["LRUCache","put","put","get","put","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]', 
            expectedOutput: '[null,null,null,1,null,-1,null,-1,3,4]' }
        ]
      }
    ]

    for (const problem of sampleProblems) {
      await addCodeProblem(problem)
    }

    // 添加示例知识点
    const samplePoints: Omit<KnowledgePoint, 'id' | 'masteryLevel' | 'lastReviewed' | 'reviewInterval'>[] = [
      {
        subject: '数据结构',
        title: '二叉搜索树',
        description: '二叉搜索树的性质和基本操作',
        importance: 'high'
      },
      {
        subject: '计算机组成原理',
        title: 'CPU指令执行',
        description: 'CPU执行指令的基本流程',
        importance: 'high'
      }
    ]

    for (const point of samplePoints) {
      await addKnowledgePoint(point)
    }
  }

  return {
    // 状态
    codeProblems,
    mindMapNodes,
    knowledgePoints,
    currentProblem,
    isLoading,
    
    // 计算属性
    solvedProblems,
    problemStats,
    masteryOverview,
    dueForReview,
    
    // 方法
    addCodeProblem,
    updateProblemSolution,
    runTestCase,
    completeProblem,
    addKnowledgePoint,
    updateMasteryLevel,
    createMindMap,
    addMindMapNode,
    getSubjectProblems,
    getReviewSchedule,
    generatePracticePlan,
    initializeCS408Data
  }
})