import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import localforage from 'localforage'

interface ReadingPassage {
  id: string
  title: string
  content: string
  source: string // 真题年份和卷次
  difficulty: '简单' | '中等' | '困难'
  wordCount: number
  questions: ReadingQuestion[]
  userAnswers: Record<string, string>
  completionTime?: number // 秒
  accuracy?: number
}

interface ReadingQuestion {
  id: string
  passageId: string
  questionNumber: number
  type: '细节理解' | '主旨大意' | '推理判断' | '词义猜测'
  content: string
  options: string[]
  correctAnswer: string
  explanation: string
  userAnswer?: string
  isCorrect?: boolean
}

interface VocabularyWord {
  id: string
  word: string
  phonetic: string
  definition: string
  example: string
  frequency: number // 出现频次
  masteryLevel: number // 0-100
  lastReviewed: string
  reviewInterval: number // 天数
  tags: string[]
}

interface WritingTopic {
  id: string
  type: '小作文' | '大作文'
  title: string
  prompt: string
  sampleAnswer: string
  keyPoints: string[]
  userAnswer?: string
  score?: number
  feedback?: string
}

interface TranslationExercise {
  id: string
  type: '英译汉' | '汉译英'
  content: string
  referenceAnswer: string
  userAnswer?: string
  score?: number
  feedback?: string
}

export const useEnglishStore = defineStore('english', () => {
  // 状态
  const readingPassages = ref<ReadingPassage[]>([])
  const vocabularyWords = ref<VocabularyWord[]>([])
  const writingTopics = ref<WritingTopic[]>([])
  const translationExercises = ref<TranslationExercise[]>([])
  const currentPassage = ref<ReadingPassage | null>(null)
  const isLoading = ref(false)

  // 计算属性
  const overallReadingAccuracy = computed(() => {
    const completedPassages = readingPassages.value.filter(p => p.accuracy !== undefined)
    if (completedPassages.length === 0) return 0
    
    const totalAccuracy = completedPassages.reduce((sum, passage) => sum + (passage.accuracy || 0), 0)
    return Math.round(totalAccuracy / completedPassages.length)
  })

  const vocabularyStats = computed(() => {
    const stats = {
      total: vocabularyWords.value.length,
      mastered: vocabularyWords.value.filter(word => word.masteryLevel >= 80).length,
      learning: vocabularyWords.value.filter(word => word.masteryLevel >= 50 && word.masteryLevel < 80).length,
      new: vocabularyWords.value.filter(word => word.masteryLevel < 50).length
    }
    return stats
  })

  const dueForReview = computed(() => {
    const today = new Date()
    return vocabularyWords.value.filter(word => {
      const nextReview = new Date(word.lastReviewed)
      nextReview.setDate(nextReview.getDate() + word.reviewInterval)
      return nextReview <= today
    })
  })

  const weakVocabulary = computed(() => {
    return vocabularyWords.value
      .filter(word => word.masteryLevel < 60)
      .sort((a, b) => a.masteryLevel - b.masteryLevel)
  })

  // 方法
  const addReadingPassage = async (passageData: Omit<ReadingPassage, 'id' | 'userAnswers'>) => {
    isLoading.value = true
    try {
      const newPassage: ReadingPassage = {
        id: 'passage_' + Date.now(),
        ...passageData,
        userAnswers: {}
      }

      readingPassages.value.push(newPassage)
      await saveEnglishData()
      return newPassage
    } catch (error) {
      console.error('添加阅读文章失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const submitReadingAnswers = async (passageId: string, answers: Record<string, string>) => {
    const passage = readingPassages.value.find(p => p.id === passageId)
    if (passage) {
      passage.userAnswers = { ...passage.userAnswers, ...answers }
      
      // 计算准确率
      let correctCount = 0
      let totalQuestions = 0
      
      passage.questions.forEach(question => {
        totalQuestions++
        if (answers[question.id] === question.correctAnswer) {
          correctCount++
          question.isCorrect = true
        } else {
          question.isCorrect = false
        }
        question.userAnswer = answers[question.id]
      })
      
      passage.accuracy = Math.round((correctCount / totalQuestions) * 100)
      
      await saveEnglishData()
      return passage.accuracy
    }
    return 0
  }

  const addVocabularyWord = async (wordData: Omit<VocabularyWord, 'id' | 'masteryLevel' | 'lastReviewed' | 'reviewInterval'>) => {
    isLoading.value = true
    try {
      const newWord: VocabularyWord = {
        id: 'vocab_' + Date.now(),
        ...wordData,
        masteryLevel: 0,
        lastReviewed: new Date().toISOString(),
        reviewInterval: 1
      }

      vocabularyWords.value.push(newWord)
      await saveEnglishData()
      return newWord
    } catch (error) {
      console.error('添加词汇失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateVocabularyMastery = async (wordId: string, level: number) => {
    const word = vocabularyWords.value.find(w => w.id === wordId)
    if (word) {
      word.masteryLevel = Math.max(0, Math.min(100, level))
      word.lastReviewed = new Date().toISOString()
      
      // 根据掌握程度调整复习间隔
      if (level >= 90) word.reviewInterval = 30
      else if (level >= 75) word.reviewInterval = 14
      else if (level >= 60) word.reviewInterval = 7
      else word.reviewInterval = 3
      
      await saveEnglishData()
    }
  }

  const addWritingTopic = async (topicData: Omit<WritingTopic, 'id'>) => {
    isLoading.value = true
    try {
      const newTopic: WritingTopic = {
        id: 'writing_' + Date.now(),
        ...topicData
      }

      writingTopics.value.push(newTopic)
      await saveEnglishData()
      return newTopic
    } catch (error) {
      console.error('添加写作题目失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const submitWritingAnswer = async (topicId: string, answer: string, score?: number, feedback?: string) => {
    const topic = writingTopics.value.find(t => t.id === topicId)
    if (topic) {
      topic.userAnswer = answer
      if (score !== undefined) topic.score = score
      if (feedback) topic.feedback = feedback
      
      await saveEnglishData()
      return { score, feedback }
    }
    return null
  }

  const addTranslationExercise = async (exerciseData: Omit<TranslationExercise, 'id'>) => {
    isLoading.value = true
    try {
      const newExercise: TranslationExercise = {
        id: 'translation_' + Date.now(),
        ...exerciseData
      }

      translationExercises.value.push(newExercise)
      await saveEnglishData()
      return newExercise
    } catch (error) {
      console.error('添加翻译练习失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const submitTranslationAnswer = async (exerciseId: string, answer: string, score?: number, feedback?: string) => {
    const exercise = translationExercises.value.find(e => e.id === exerciseId)
    if (exercise) {
      exercise.userAnswer = answer
      if (score !== undefined) exercise.score = score
      if (feedback) exercise.feedback = feedback
      
      await saveEnglishData()
      return { score, feedback }
    }
    return null
  }

  const getRecommendedVocabulary = (count: number = 10) => {
    // 基于遗忘曲线推荐词汇
    const dueWords = dueForReview.value.slice(0, Math.floor(count * 0.7))
    const weakWords = weakVocabulary.value.slice(0, Math.floor(count * 0.3))
    
    return [...dueWords, ...weakWords].slice(0, count)
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
        vocabulary: [] as VocabularyWord[],
        reading: [] as ReadingPassage[],
        writing: [] as WritingTopic[],
        translation: [] as TranslationExercise[]
      }
      
      // 分配词汇复习
      dailyPlan.vocabulary = getRecommendedVocabulary(15)
      
      // 分配阅读练习
      if (i % 2 === 0) {
        const unreadPassages = readingPassages.value.filter(p => Object.keys(p.userAnswers).length === 0)
        dailyPlan.reading = unreadPassages.slice(0, 1)
      }
      
      // 分配写作练习
      if (i % 3 === 0) {
        const unwrittenTopics = writingTopics.value.filter(t => !t.userAnswer)
        dailyPlan.writing = unwrittenTopics.slice(0, 1)
      }
      
      plan.push(dailyPlan)
    }
    
    return plan
  }

  const getReadingStatsByType = () => {
    const stats: Record<string, { total: number, correct: number, accuracy: number }> = {
      '细节理解': { total: 0, correct: 0, accuracy: 0 },
      '主旨大意': { total: 0, correct: 0, accuracy: 0 },
      '推理判断': { total: 0, correct: 0, accuracy: 0 },
      '词义猜测': { total: 0, correct: 0, accuracy: 0 }
    }
    
    readingPassages.value.forEach(passage => {
      passage.questions.forEach(question => {
        const typeStat = stats[question.type]
        if (typeStat) {
          typeStat.total++
          if (question.isCorrect) typeStat.correct++
        }
      })
    })
    
    Object.values(stats).forEach(stat => {
      if (stat.total > 0) {
        stat.accuracy = Math.round((stat.correct / stat.total) * 100)
      }
    })
    
    return stats
  }

  // 数据持久化
  const saveEnglishData = async () => {
    await localforage.setItem('englishReading', readingPassages.value)
    await localforage.setItem('englishVocabulary', vocabularyWords.value)
    await localforage.setItem('englishWriting', writingTopics.value)
    await localforage.setItem('englishTranslation', translationExercises.value)
  }

  const initializeEnglishData = async () => {
    isLoading.value = true
    try {
      const storedReading = await localforage.getItem<ReadingPassage[]>('englishReading')
      const storedVocabulary = await localforage.getItem<VocabularyWord[]>('englishVocabulary')
      const storedWriting = await localforage.getItem<WritingTopic[]>('englishWriting')
      const storedTranslation = await localforage.getItem<TranslationExercise[]>('englishTranslation')
      
      if (storedReading) readingPassages.value = storedReading
      if (storedVocabulary) vocabularyWords.value = storedVocabulary
      if (storedWriting) writingTopics.value = storedWriting
      if (storedTranslation) translationExercises.value = storedTranslation
      
      // 如果没有数据，加载示例数据
      if (readingPassages.value.length === 0) {
        await loadSampleData()
      }
    } catch (error) {
      console.error('初始化英语数据失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  const loadSampleData = async () => {
    // 添加示例阅读文章
    const samplePassage: Omit<ReadingPassage, 'id' | 'userAnswers'> = {
      title: '人工智能的发展',
      content: 'Artificial intelligence (AI) has become one of the most transformative technologies of our time...',
      source: '2023年真题',
      difficulty: '中等',
      wordCount: 320,
      questions: [
        {
          id: 'q1',
          passageId: '',
          questionNumber: 1,
          type: '细节理解',
          content: 'According to the passage, what is the main advantage of AI?',
          options: ['A. Lower cost', 'B. Higher efficiency', 'C. Better quality', 'D. Faster speed'],
          correctAnswer: 'B',
          explanation: '文中提到AI的主要优势是提高工作效率'
        }
      ]
    }

    const passage = await addReadingPassage(samplePassage)
    
    // 更新问题的passageId
    if (passage) {
      passage.questions.forEach(q => q.passageId = passage.id)
      await saveEnglishData()
    }

    // 添加示例词汇
    const sampleWords: Omit<VocabularyWord, 'id' | 'masteryLevel' | 'lastReviewed' | 'reviewInterval'>[] = [
      {
        word: 'artificial',
        phonetic: '/ˌɑːrtɪˈfɪʃl/',
        definition: '人工的，人造的',
        example: 'Artificial intelligence is changing our world.',
        frequency: 15,
        tags: ['科技', '基础词汇']
      },
      {
        word: 'transformative',
        phonetic: '/trænsˈfɔːrmətɪv/',
        definition: '变革性的，转化的',
        example: 'This technology is truly transformative.',
        frequency: 8,
        tags: ['学术词汇']
      }
    ]

    for (const word of sampleWords) {
      await addVocabularyWord(word)
    }

    // 添加示例写作题目
    const sampleWriting: Omit<WritingTopic, 'id'> = {
      type: '大作文',
      title: '科技发展对人类生活的影响',
      prompt: 'Write an essay discussing how technological development affects human life...',
      sampleAnswer: 'Technology has profoundly impacted human life in various ways...',
      keyPoints: ['提高效率', '改变交流方式', '创造新机遇', '带来挑战']
    }

    await addWritingTopic(sampleWriting)
  }

  return {
    // 状态
    readingPassages,
    vocabularyWords,
    writingTopics,
    translationExercises,
    currentPassage,
    isLoading,
    
    // 计算属性
    overallReadingAccuracy,
    vocabularyStats,
    dueForReview,
    weakVocabulary,
    
    // 方法
    addReadingPassage,
    submitReadingAnswers,
    addVocabularyWord,
    updateVocabularyMastery,
    addWritingTopic,
    submitWritingAnswer,
    addTranslationExercise,
    submitTranslationAnswer,
    getRecommendedVocabulary,
    generateStudyPlan,
    getReadingStatsByType,
    initializeEnglishData
  }
})