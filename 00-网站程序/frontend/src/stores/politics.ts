import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import localforage from 'localforage'

interface CurrentAffair {
  id: string
  title: string
  content: string
  date: string
  category: '时政要闻' | '政策解读' | '经济动态' | '社会民生' | '国际形势'
  importance: 'high' | 'medium' | 'low'
  keywords: string[]
  relatedPoints: PoliticalPoint[]
  readStatus: 'unread' | 'reading' | 'read'
  bookmarked: boolean
}

interface PoliticalPoint {
  id: string
  category: '马克思主义基本原理' | '毛泽东思想和中国特色社会主义理论体系' | '中国近现代史纲要' | '思想道德修养与法律基础' | '形势与政策'
  title: string
  content: string
  keyConcepts: string[]
  examFrequency: number
  masteryLevel: number // 0-100
  lastReviewed: string
  reviewInterval: number // 天数
  relatedAffairs: string[] // 关联的时政ID
}

interface MockQuestion {
  id: string
  type: '单选题' | '多选题' | '简答题' | '论述题'
  category: PoliticalPoint['category']
  content: string
  options?: string[]
  correctAnswer: string
  analysis: string
  difficulty: '简单' | '中等' | '困难'
  userAnswer?: string
  isCorrect?: boolean
  attempts: number
}

interface KnowledgeStructure {
  id: string
  title: string
  nodes: KnowledgeNode[]
  connections: Connection[]
}

interface KnowledgeNode {
  id: string
  label: string
  type: 'concept' | 'theory' | 'event' | 'person'
  importance: 'core' | 'important' | 'basic'
  x: number
  y: number
}

interface Connection {
  id: string
  source: string
  target: string
  relationship: '因果关系' | '包含关系' | '并列关系' | '对立关系'
  strength: number // 1-10
}

export const usePoliticsStore = defineStore('politics', () => {
  // 状态
  const currentAffairs = ref<CurrentAffair[]>([])
  const politicalPoints = ref<PoliticalPoint[]>([])
  const mockQuestions = ref<MockQuestion[]>([])
  const knowledgeStructures = ref<KnowledgeStructure[]>([])
  const isLoading = ref(false)

  // 计算属性
  const unreadAffairs = computed(() => {
    return currentAffairs.value.filter(affair => affair.readStatus === 'unread')
  })

  const bookmarkedAffairs = computed(() => {
    return currentAffairs.value.filter(affair => affair.bookmarked)
  })

  const masteryStats = computed(() => {
    const stats = {
      total: politicalPoints.value.length,
      mastered: politicalPoints.value.filter(point => point.masteryLevel >= 80).length,
      learning: politicalPoints.value.filter(point => point.masteryLevel >= 50 && point.masteryLevel < 80).length,
      new: politicalPoints.value.filter(point => point.masteryLevel < 50).length
    }
    return stats
  })

  const dueForReview = computed(() => {
    const today = new Date()
    return politicalPoints.value.filter(point => {
      const nextReview = new Date(point.lastReviewed)
      nextReview.setDate(nextReview.getDate() + point.reviewInterval)
      return nextReview <= today
    })
  })

  const categoryStats = computed(() => {
    const stats: Record<string, { total: number; mastered: number; accuracy: number }> = {}
    
    politicalPoints.value.forEach(point => {
      if (!stats[point.category]) {
        stats[point.category] = { total: 0, mastered: 0, accuracy: 0 }
      }
      stats[point.category].total++
      if (point.masteryLevel >= 80) stats[point.category].mastered++
    })
    
    Object.values(stats).forEach(stat => {
      if (stat.total > 0) {
        stat.accuracy = Math.round((stat.mastered / stat.total) * 100)
      }
    })
    
    return stats
  })

  // 方法
  const addCurrentAffair = async (affairData: Omit<CurrentAffair, 'id' | 'readStatus' | 'bookmarked'>) => {
    isLoading.value = true
    try {
      const newAffair: CurrentAffair = {
        id: 'affair_' + Date.now(),
        ...affairData,
        readStatus: 'unread',
        bookmarked: false
      }

      currentAffairs.value.push(newAffair)
      await savePoliticsData()
      return newAffair
    } catch (error) {
      console.error('添加时政失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateAffairStatus = async (affairId: string, status: 'unread' | 'reading' | 'read') => {
    const affair = currentAffairs.value.find(a => a.id === affairId)
    if (affair) {
      affair.readStatus = status
      await savePoliticsData()
    }
  }

  const toggleBookmark = async (affairId: string) => {
    const affair = currentAffairs.value.find(a => a.id === affairId)
    if (affair) {
      affair.bookmarked = !affair.bookmarked
      await savePoliticsData()
      return affair.bookmarked
    }
    return false
  }

  const addPoliticalPoint = async (pointData: Omit<PoliticalPoint, 'id' | 'masteryLevel' | 'lastReviewed' | 'reviewInterval' | 'relatedAffairs'>) => {
    isLoading.value = true
    try {
      const newPoint: PoliticalPoint = {
        id: 'point_' + Date.now(),
        ...pointData,
        masteryLevel: 0,
        lastReviewed: new Date().toISOString(),
        reviewInterval: 1,
        relatedAffairs: []
      }

      politicalPoints.value.push(newPoint)
      await savePoliticsData()
      return newPoint
    } catch (error) {
      console.error('添加政治考点失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateMasteryLevel = async (pointId: string, level: number) => {
    const point = politicalPoints.value.find(p => p.id === pointId)
    if (point) {
      point.masteryLevel = Math.max(0, Math.min(100, level))
      point.lastReviewed = new Date().toISOString()
      
      // 根据掌握程度调整复习间隔
      if (level >= 90) point.reviewInterval = 30
      else if (level >= 75) point.reviewInterval = 14
      else if (level >= 60) point.reviewInterval = 7
      else point.reviewInterval = 3
      
      await savePoliticsData()
    }
  }

  const addMockQuestion = async (questionData: Omit<MockQuestion, 'id' | 'attempts'>) => {
    isLoading.value = true
    try {
      const newQuestion: MockQuestion = {
        id: 'question_' + Date.now(),
        ...questionData,
        attempts: 0
      }

      mockQuestions.value.push(newQuestion)
      await savePoliticsData()
      return newQuestion
    } catch (error) {
      console.error('添加模拟题失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const submitAnswer = async (questionId: string, answer: string) => {
    const question = mockQuestions.value.find(q => q.id === questionId)
    if (question) {
      question.userAnswer = answer
      question.attempts += 1
      question.isCorrect = answer === question.correctAnswer
      
      await savePoliticsData()
      return question.isCorrect
    }
    return false
  }

  const createKnowledgeStructure = async (structureData: Omit<KnowledgeStructure, 'id' | 'nodes' | 'connections'>) => {
    isLoading.value = true
    try {
      const newStructure: KnowledgeStructure = {
        id: 'structure_' + Date.now(),
        ...structureData,
        nodes: [],
        connections: []
      }

      knowledgeStructures.value.push(newStructure)
      await savePoliticsData()
      return newStructure
    } catch (error) {
      console.error('创建知识结构失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const addNodeToStructure = async (structureId: string, nodeData: Omit<KnowledgeNode, 'id'>) => {
    const structure = knowledgeStructures.value.find(s => s.id === structureId)
    if (structure) {
      const newNode: KnowledgeNode = {
        id: 'node_' + Date.now(),
        ...nodeData
      }
      
      structure.nodes.push(newNode)
      await savePoliticsData()
      return newNode
    }
  }

  const addConnection = async (structureId: string, connectionData: Omit<Connection, 'id'>) => {
    const structure = knowledgeStructures.value.find(s => s.id === structureId)
    if (structure) {
      const newConnection: Connection = {
        id: 'conn_' + Date.now(),
        ...connectionData
      }
      
      structure.connections.push(newConnection)
      await savePoliticsData()
      return newConnection
    }
  }

  const getRelatedPoints = (affairId: string) => {
    return politicalPoints.value.filter(point => 
      point.relatedAffairs.includes(affairId)
    )
  }

  const getRecommendedQuestions = (category?: string, count: number = 5) => {
    let questions = mockQuestions.value
    
    if (category) {
      questions = questions.filter(q => q.category === category)
    }
    
    // 优先返回未做过的题目
    const unanswered = questions.filter(q => q.attempts === 0)
    const wrongAnswers = questions.filter(q => q.attempts > 0 && !q.isCorrect)
    
    return [...unanswered, ...wrongAnswers].slice(0, count)
  }

  const generateStudyPlan = (days: number = 7) => {
    const plan = []
    const today = new Date()
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dailyPlan = {
        date: dateStr,
        affairs: [] as CurrentAffair[],
        points: [] as PoliticalPoint[],
        questions: [] as MockQuestion[],
        reviewPoints: [] as PoliticalPoint[]
      }
      
      // 分配时政阅读
      if (i === 0) {
        dailyPlan.affairs = unreadAffairs.value.slice(0, 3)
      }
      
      // 分配考点学习
      const categoryKeys = Object.keys(categoryStats.value)
      const categoryIndex = i % categoryKeys.length
      const categoryName = categoryKeys[categoryIndex] as PoliticalPoint['category']
      const categoryPoints = politicalPoints.value.filter(p => p.category === categoryName)
      dailyPlan.points = categoryPoints.slice(0, 2)
      
      // 分配练习题
      dailyPlan.questions = getRecommendedQuestions(undefined, 3)
      
      // 分配复习内容
      dailyPlan.reviewPoints = dueForReview.value.slice(i * 2, i * 2 + 2)
      
      plan.push(dailyPlan)
    }
    
    return plan
  }

  // 数据持久化
  const savePoliticsData = async () => {
    await localforage.setItem('politicsAffairs', currentAffairs.value)
    await localforage.setItem('politicsPoints', politicalPoints.value)
    await localforage.setItem('politicsQuestions', mockQuestions.value)
    await localforage.setItem('politicsStructures', knowledgeStructures.value)
  }

  const initializePoliticsData = async () => {
    isLoading.value = true
    try {
      const storedAffairs = await localforage.getItem<CurrentAffair[]>('politicsAffairs')
      const storedPoints = await localforage.getItem<PoliticalPoint[]>('politicsPoints')
      const storedQuestions = await localforage.getItem<MockQuestion[]>('politicsQuestions')
      const storedStructures = await localforage.getItem<KnowledgeStructure[]>('politicsStructures')
      
      if (storedAffairs) currentAffairs.value = storedAffairs
      if (storedPoints) politicalPoints.value = storedPoints
      if (storedQuestions) mockQuestions.value = storedQuestions
      if (storedStructures) knowledgeStructures.value = storedStructures
      
      // 如果没有数据，加载示例数据
      if (currentAffairs.value.length === 0) {
        await loadSampleData()
      }
    } catch (error) {
      console.error('初始化政治数据失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  const loadSampleData = async () => {
    // 添加示例时政
    const sampleAffairs: Omit<CurrentAffair, 'id' | 'readStatus' | 'bookmarked'>[] = [
      {
        title: '2024年政府工作报告要点',
        content: '2024年政府工作报告提出了一系列重要政策措施...',
        date: new Date().toISOString().split('T')[0],
        category: '政策解读',
        importance: 'high',
        keywords: ['经济发展', '民生改善', '改革开放'],
        relatedPoints: []
      }
    ]

    for (const affair of sampleAffairs) {
      await addCurrentAffair(affair)
    }

    // 添加示例政治考点
    const samplePoints: Omit<PoliticalPoint, 'id' | 'masteryLevel' | 'lastReviewed' | 'reviewInterval' | 'relatedAffairs'>[] = [
      {
        category: '马克思主义基本原理',
        title: '马克思主义哲学基本特征',
        content: '马克思主义哲学是关于自然、社会和思维发展一般规律的科学...',
        keyConcepts: ['唯物主义', '辩证法', '实践观'],
        examFrequency: 15
      }
    ]

    for (const point of samplePoints) {
      await addPoliticalPoint(point)
    }

    // 添加示例模拟题
    const sampleQuestions: Omit<MockQuestion, 'id' | 'attempts'>[] = [
      {
        type: '单选题',
        category: '马克思主义基本原理',
        content: '马克思主义哲学的根本特征是？',
        options: [
          'A. 唯心主义',
          'B. 形而上学',
          'C. 辩证唯物主义',
          'D. 机械唯物主义'
        ],
        correctAnswer: 'C',
        analysis: '马克思主义哲学的根本特征是辩证唯物主义...',
        difficulty: '中等'
      }
    ]

    for (const question of sampleQuestions) {
      await addMockQuestion(question)
    }
  }

  return {
    // 状态
    currentAffairs,
    politicalPoints,
    mockQuestions,
    knowledgeStructures,
    isLoading,
    
    // 计算属性
    unreadAffairs,
    bookmarkedAffairs,
    masteryStats,
    dueForReview,
    categoryStats,
    
    // 方法
    addCurrentAffair,
    updateAffairStatus,
    toggleBookmark,
    addPoliticalPoint,
    updateMasteryLevel,
    addMockQuestion,
    submitAnswer,
    createKnowledgeStructure,
    addNodeToStructure,
    addConnection,
    getRelatedPoints,
    getRecommendedQuestions,
    generateStudyPlan,
    initializePoliticsData
  }
})