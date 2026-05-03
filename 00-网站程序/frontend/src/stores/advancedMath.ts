import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface AdvancedMathTopic {
  id: string
  chapter: string
  title: string
  content: string
  importance: number // 1-5
  type: 'concept' | 'method' | 'formula'
  examples?: string[]
  applications?: string[]
  relatedTopics?: string[]
  createdAt: string
  mastered: boolean
  lastReviewed: string
}

export interface ChapterProgress {
  chapter: string
  totalTopics: number
  masteredTopics: number
  lastStudied: string
}

export const useAdvancedMathStore = defineStore('advancedMath', () => {
  // 状态
  const topics = ref<AdvancedMathTopic[]>([])
  const isLoading = ref(false)
  const currentTopicId = ref<string | null>(null)

  // 计算属性
  const chapters = computed(() => {
    const uniqueChapters = [...new Set(topics.value.map(topic => topic.chapter))]
    return uniqueChapters.sort()
  })

  const chapterProgress = computed<Record<string, ChapterProgress>>(() => {
    const progress: Record<string, ChapterProgress> = {}
    
    chapters.value.forEach(chapter => {
      const chapterTopics = topics.value.filter(t => t.chapter === chapter)
      const masteredCount = chapterTopics.filter(t => t.mastered).length
      
      progress[chapter] = {
        chapter,
        totalTopics: chapterTopics.length,
        masteredTopics: masteredCount,
        lastStudied: chapterTopics.length > 0 
          ? new Date(Math.max(...chapterTopics.map(t => new Date(t.lastReviewed).getTime()))).toISOString()
          : new Date().toISOString()
      }
    })
    
    return progress
  })

  const overallProgress = computed(() => {
    if (topics.value.length === 0) return 0
    const masteredCount = topics.value.filter(t => t.mastered).length
    return Math.round((masteredCount / topics.value.length) * 100)
  })

  const currentTopic = computed(() => {
    return currentTopicId.value 
      ? topics.value.find(t => t.id === currentTopicId.value) 
      : null
  })

  const topicsByImportance = computed(() => {
    return [...topics.value].sort((a, b) => b.importance - a.importance)
  })

  // 方法
  const loadTopics = async () => {
    isLoading.value = true
    try {
      // 从本地文件或API加载高等数学知识点
      // 这里使用示例数据，实际应用中应该从你的数学文件夹导入
      if (topics.value.length === 0) {
        const sampleTopics: AdvancedMathTopic[] = [
          {
            id: 'am_ch1_1',
            chapter: '第1讲 函数、极限、连续',
            title: '函数间断点',
            content: '如果函数f(x)在点x₀处不连续，则称x₀为f(x)的间断点。分类：第一类间断点（左右极限都存在），第二类间断点（至少有一个单侧极限不存在）。判定方法：1.求分段函数的分界点的极限值；2.判定左右极限是否存在及是否相等；3.判断极限值与函数值的关系。',
            importance: 4,
            type: 'concept',
            examples: [
              '分段函数在分界点处的间断点判定',
              '无穷间断点的识别',
              '跳跃间断点的计算'
            ],
            applications: [
              '判断函数连续性',
              '分析函数性质',
              '为后续微积分学习奠定基础'
            ],
            createdAt: new Date().toISOString(),
            mastered: false,
            lastReviewed: new Date().toISOString()
          },
          {
            id: 'am_ch1_2',
            chapter: '第1讲 函数、极限、连续',
            title: '周期函数性质',
            content: '对于函数f(x)，如果存在一个正数T，使得当x取定义域内的每一个值时，都有f(x+T)=f(x)，则称f(x)为周期函数。重要性质：若f(x)以T为周期，则f(ax+b)以T/|a|为周期；若g(x)是周期函数，则复合函数f[g(x)]也是周期函数；若f(x)是以T为周期的可导函数，则f\'(x)也以T为周期。',
            importance: 3,
            type: 'concept',
            examples: [
              '三角函数的周期性分析',
              '复合函数周期的计算',
              '周期函数导数的性质'
            ],
            applications: [
              '分析三角函数等周期性现象',
              '傅里叶级数的基础',
              '信号处理中的周期分析'
            ],
            createdAt: new Date().toISOString(),
            mastered: false,
            lastReviewed: new Date().toISOString()
          },
          {
            id: 'am_ch2_1',
            chapter: '第2讲 数列极限',
            title: '数列极限的定义',
            content: '设{xn}为一数列，若存在常数a，对任意ε>0，总存在正整数N，当n>N时，|xn-a|<ε恒成立，则称a是数列{xn}的极限，记为lim xn = a。核心要点：ε是任意给定的正数，N依赖于ε的选取；定义中的"当n>N时"表示从某一项之后的所有项都满足不等式；这是严格定义数列收敛性的数学语言。',
            importance: 5,
            type: 'concept',
            examples: [
              '用定义证明常数数列的极限',
              '证明等比数列的收敛性',
              '利用ε-N语言进行极限证明'
            ],
            applications: [
              '严格定义数列的收敛性',
              '为函数极限奠定理论基础',
              '数学分析的基础工具'
            ],
            createdAt: new Date().toISOString(),
            mastered: false,
            lastReviewed: new Date().toISOString()
          },
          {
            id: 'am_ch2_2',
            chapter: '第2讲 数列极限',
            title: '夹逼准则',
            content: '从某项起，yn ≤ xn ≤ zn，且lim yn = lim zn = a，则lim xn = a。使用技巧：常用放缩方法：分母放大(分数变小)，分母缩小(分数变大)；利用重要不等式：sin x<x (x>0)、e^x≥x+1、x-1≥ln x (x>0)等；关键是找到合适的上下界数列。',
            importance: 5,
            type: 'method',
            examples: [
              'lim(n→∞) n√n = 1的证明',
              '利用夹逼准则求解复杂数列极限',
              '三角函数数列的极限计算'
            ],
            applications: [
              '证明复杂数列的极限存在',
              '计算难以直接求解的极限',
              '建立不等式关系的重要工具'
            ],
            createdAt: new Date().toISOString(),
            mastered: false,
            lastReviewed: new Date().toISOString()
          },
          {
            id: 'am_ch3_1',
            chapter: '第3讲 一元函数微分学的概念',
            title: '导数的定义',
            content: '基本定义：f\'(x₀) = lim(Δx→0) [f(x₀ + Δx) - f(x₀)]/Δx。等价定义：f\'(x₀) = lim(x→x₀) [f(x) - f(x₀)]/(x - x₀)。核心要点：导数定义是微分学的基础，两种形式要熟练掌握；在具体计算中，根据题目条件选择合适的定义形式；表示函数在某点处的瞬时变化率。',
            importance: 5,
            type: 'concept',
            examples: [
              '用定义求解基本初等函数的导数',
              '分段函数在分界点处可导性的判定',
              '抽象函数导数的定义应用'
            ],
            applications: [
              '求解函数在某点的瞬时变化率',
              '物理学中的速度、加速度计算',
              '经济学中的边际分析'
            ],
            createdAt: new Date().toISOString(),
            mastered: false,
            lastReviewed: new Date().toISOString()
          }
        ]
        
        topics.value = sampleTopics
        saveData()
      }
    } catch (error) {
      console.error('加载高等数学知识点失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  const getTopicsByChapter = (chapter: string) => {
    return topics.value.filter(topic => topic.chapter === chapter)
  }

  const getTopicsByType = (type: string) => {
    return topics.value.filter(topic => topic.type === type)
  }

  const getTopicsByImportanceLevel = (level: number) => {
    return topics.value.filter(topic => topic.importance === level)
  }

  const markAsMastered = (topicId: string) => {
    const topic = topics.value.find(t => t.id === topicId)
    if (topic) {
      topic.mastered = true
      topic.lastReviewed = new Date().toISOString()
      saveData()
    }
  }

  const resetProgress = (topicId: string) => {
    const topic = topics.value.find(t => t.id === topicId)
    if (topic) {
      topic.mastered = false
      topic.lastReviewed = new Date().toISOString()
      saveData()
    }
  }

  const setCurrentTopic = (topicId: string) => {
    currentTopicId.value = topicId
  }

  const getNextTopic = (currentTopicId: string) => {
    const currentIndex = topics.value.findIndex(t => t.id === currentTopicId)
    if (currentIndex < topics.value.length - 1) {
      return topics.value[currentIndex + 1]
    }
    return null
  }

  const getPreviousTopic = (currentTopicId: string) => {
    const currentIndex = topics.value.findIndex(t => t.id === currentTopicId)
    if (currentIndex > 0) {
      return topics.value[currentIndex - 1]
    }
    return null
  }

  // 数据持久化
  const saveData = () => {
    const data = {
      topics: topics.value,
      currentTopicId: currentTopicId.value
    }
    localStorage.setItem('advancedMathData', JSON.stringify(data))
  }

  const loadData = () => {
    const saved = localStorage.getItem('advancedMathData')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        topics.value = data.topics || []
        currentTopicId.value = data.currentTopicId || null
      } catch (e) {
        console.error('加载高等数学数据失败:', e)
      }
    }
  }

  // 初始化
  loadData()
  loadTopics()

  return {
    // 状态
    topics,
    isLoading,
    currentTopicId,
    
    // 计算属性
    chapters,
    chapterProgress,
    overallProgress,
    currentTopic,
    topicsByImportance,
    
    // 方法
    loadTopics,
    getTopicsByChapter,
    getTopicsByType,
    getTopicsByImportanceLevel,
    markAsMastered,
    resetProgress,
    setCurrentTopic,
    getNextTopic,
    getPreviousTopic,
    saveData,
    loadData
  }
})