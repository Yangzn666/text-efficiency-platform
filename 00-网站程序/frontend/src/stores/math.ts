import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import localforage from 'localforage'

interface MathChapter {
  id: string
  title: string
  order: number
  estimatedTime: number // 分钟
  difficulty: '基础' | '进阶' | '难点'
  prerequisites: string[] // 前置章节
  keyPoints: string[]
  practiceProblems: MathProblem[]
  completed: boolean
  masteryLevel: number // 0-100
  lastStudied: string
}

interface MathProblem {
  id: string
  chapterId: string
  title: string
  type: '选择题' | '填空题' | '解答题'
  difficulty: '简单' | '中等' | '困难'
  content: string
  solution: string
  userAnswer?: string
  isCorrect?: boolean
  attempts: number
  tags: string[]
}

interface WrongProblem {
  id: string
  originalProblem: MathProblem
  mistakeType: '计算错误' | '概念不清' | '思路错误' | '粗心大意'
  correction: string
  reviewCount: number
  nextReview: string
}

interface FormulaCard {
  id: string
  category: string
  title: string
  formula: string
  description: string
  examples: string[]
  masteryLevel: number
}

// 新增：章节元数据接口
interface ChapterMetadata {
  id: string
  order: number
  title: string
  estimatedHours: number
  difficulty: '基础' | '核心' | '进阶' | '难点'
  importance: number  // 1-5
  prerequisites: string[]
  keyTopics: string[]
  markdownFile: string
  pdfReference: string
}

// 新增：公式卡片数据接口（来自formulas.json）
interface FormulaData {
  id: string
  name: string
  latex: string
  description: string
  application: string
  difficulty: '基础' | '进阶' | '难点'
}

// 扩展MathChapter接口
interface ExtendedMathChapter extends MathChapter {
  metadata?: ChapterMetadata
  contentFile?: string
  contentBase?: string  // 章节Markdown所在目录，如 /data/math/higher-math/
  subject?: string  // '高等数学' | '线性代数' | '概率论与数理统计'
}

// 三大学科的数据源配置
// DATA_BASE：生产环境部署在 GitHub Pages 子路径下，必须拼上 base，否则 /data/... 会指向域名根目录 404
const DATA_BASE = import.meta.env.BASE_URL
const MATH_DATA_VERSION = 'v4-2026-07-22-baseurl'
const SUBJECT_SOURCES = [
  { subject: '高等数学', base: 'data/math/higher-math/' },
  { subject: '线性代数', base: 'data/math/linear-algebra/' },
  { subject: '概率论与数理统计', base: 'data/math/probability/' }
]

export const useMathStore = defineStore('math', () => {
  // 状态
  const chapters = ref<ExtendedMathChapter[]>([])
  const problems = ref<MathProblem[]>([])
  const wrongProblems = ref<WrongProblem[]>([])
  const formulaCards = ref<FormulaCard[]>([])
  const currentChapter = ref<MathChapter | null>(null)
  const isLoading = ref(false)

  // 计算属性
  const overallProgress = computed(() => {
    if (chapters.value.length === 0) return 0
    const totalMastery = chapters.value.reduce((sum, chapter) => sum + chapter.masteryLevel, 0)
    return Math.round(totalMastery / chapters.value.length)
  })

  const completedChapters = computed(() => {
    return chapters.value.filter(chapter => chapter.completed)
  })

  const weakAreas = computed(() => {
    return chapters.value
      .filter(chapter => chapter.masteryLevel < 70)
      .sort((a, b) => a.masteryLevel - b.masteryLevel)
  })

  const wrongProblemsByType = computed(() => {
    const stats: Record<string, number> = {}
    wrongProblems.value.forEach(problem => {
      stats[problem.mistakeType] = (stats[problem.mistakeType] || 0) + 1
    })
    return stats
  })

  const dueForReview = computed(() => {
    const today = new Date().toISOString()
    return wrongProblems.value.filter(problem => problem.nextReview <= today)
  })

  // 方法
  const addChapter = async (chapterData: Omit<MathChapter, 'id' | 'completed' | 'masteryLevel' | 'lastStudied' | 'practiceProblems'>) => {
    isLoading.value = true
    try {
      const newChapter: MathChapter = {
        id: 'chapter_' + Date.now(),
        ...chapterData,
        completed: false,
        masteryLevel: 0,
        lastStudied: new Date().toISOString(),
        practiceProblems: []
      }

      chapters.value.push(newChapter)
      await saveMathData()
      return newChapter
    } catch (error) {
      console.error('添加章节失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateChapterProgress = async (chapterId: string, masteryLevel: number) => {
    const chapter = chapters.value.find(c => c.id === chapterId)
    if (chapter) {
      chapter.masteryLevel = Math.max(0, Math.min(100, masteryLevel))
      chapter.lastStudied = new Date().toISOString()
      
      if (masteryLevel >= 85) {
        chapter.completed = true
      }
      
      await saveMathData()
    }
  }

  const addProblem = async (problemData: Omit<MathProblem, 'id' | 'attempts'>) => {
    isLoading.value = true
    try {
      const newProblem: MathProblem = {
        id: 'problem_' + Date.now(),
        ...problemData,
        attempts: 0
      }

      problems.value.push(newProblem)
      
      // 添加到对应章节
      const chapter = chapters.value.find(c => c.id === problemData.chapterId)
      if (chapter) {
        chapter.practiceProblems.push(newProblem)
      }
      
      await saveMathData()
      return newProblem
    } catch (error) {
      console.error('添加题目失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const submitAnswer = async (problemId: string, answer: string) => {
    const problem = problems.value.find(p => p.id === problemId)
    if (problem) {
      problem.userAnswer = answer
      problem.attempts += 1
      
      // 简单的答案检查逻辑
      const isCorrect = checkAnswer(problem.solution, answer)
      problem.isCorrect = isCorrect
      
      if (!isCorrect) {
        // 添加到错题本
        await addToWrongProblems(problem)
      }
      
      await saveMathData()
      return isCorrect
    }
    return false
  }

  const checkAnswer = (solution: string, userAnswer: string): boolean => {
    // 简化的答案检查（实际应用中需要更复杂的逻辑）
    const cleanSolution = solution.replace(/\s+/g, '').toLowerCase()
    const cleanUserAnswer = userAnswer.replace(/\s+/g, '').toLowerCase()
    return cleanSolution === cleanUserAnswer
  }

  const addToWrongProblems = async (problem: MathProblem) => {
    const existingWrong = wrongProblems.value.find(wp => wp.originalProblem.id === problem.id)
    if (!existingWrong) {
      const newWrong: WrongProblem = {
        id: 'wrong_' + Date.now(),
        originalProblem: problem,
        mistakeType: '粗心大意', // 默认值
        correction: '',
        reviewCount: 0,
        nextReview: new Date(Date.now() + 86400000).toISOString() // 1天后复习
      }
      
      wrongProblems.value.push(newWrong)
      await saveMathData()
    }
  }

  const updateWrongProblem = async (wrongId: string, correction: string, mistakeType: string) => {
    const wrongProblem = wrongProblems.value.find(wp => wp.id === wrongId)
    if (wrongProblem) {
      wrongProblem.correction = correction
      wrongProblem.mistakeType = mistakeType as any
      wrongProblem.reviewCount += 1
      
      // 根据复习次数设置下次复习时间
      const intervals = [1, 3, 7, 14, 30] // 天数间隔
      const interval = intervals[Math.min(wrongProblem.reviewCount, intervals.length - 1)]
      const nextDate = new Date()
      nextDate.setDate(nextDate.getDate() + interval)
      wrongProblem.nextReview = nextDate.toISOString()
      
      await saveMathData()
    }
  }

  const addFormulaCard = async (formulaData: Omit<FormulaCard, 'id' | 'masteryLevel'>) => {
    isLoading.value = true
    try {
      const newCard: FormulaCard = {
        id: 'formula_' + Date.now(),
        ...formulaData,
        masteryLevel: 0
      }

      formulaCards.value.push(newCard)
      await saveMathData()
      return newCard
    } catch (error) {
      console.error('添加公式卡片失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateFormulaMastery = async (formulaId: string, level: number) => {
    const formula = formulaCards.value.find(f => f.id === formulaId)
    if (formula) {
      formula.masteryLevel = Math.max(0, Math.min(100, level))
      await saveMathData()
    }
  }

  const getChapterDependencyGraph = () => {
    const graph: Record<string, string[]> = {}
    
    chapters.value.forEach(chapter => {
      graph[chapter.id] = chapter.prerequisites
    })
    
    return graph
  }

  const getRecommendedProblems = (count: number = 5) => {
    // 基于薄弱章节推荐题目
    const weakChapterIds = weakAreas.value.slice(0, 2).map(c => c.id)
    
    return problems.value
      .filter(problem => 
        weakChapterIds.includes(problem.chapterId) || 
        problem.attempts === 0
      )
      .slice(0, count)
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
        chapters: [] as MathChapter[],
        problems: [] as MathProblem[],
        reviewWrong: [] as WrongProblem[],
        formulas: [] as FormulaCard[]
      }
      
      // 分配章节学习
      if (i < chapters.value.length) {
        dailyPlan.chapters.push(chapters.value[i])
      }
      
      // 分配练习题
      const recommended = getRecommendedProblems(3)
      dailyPlan.problems = recommended
      
      // 分配错题复习
      dailyPlan.reviewWrong = dueForReview.value.slice(i * 2, i * 2 + 2)
      
      plan.push(dailyPlan)
    }
    
    return plan
  }

  // 数据持久化
  const saveMathData = async () => {
    try {
      // 将复杂对象序列化为简单对象再存储
      const simplifiedChapters = chapters.value.map(chapter => ({
        ...chapter,
        practiceProblems: chapter.practiceProblems.map(p => p.id) // 只存储ID引用
      }))
      
      localStorage.setItem('mathChapters', JSON.stringify(simplifiedChapters))
      localStorage.setItem('mathProblems', JSON.stringify(problems.value))
      localStorage.setItem('mathWrongProblems', JSON.stringify(wrongProblems.value))
      localStorage.setItem('mathFormulaCards', JSON.stringify(formulaCards.value))
    } catch (error) {
      console.error('保存数学数据失败:', error)
    }
  }

  // 新增：从metadata.json加载章节数据（三大学科）
  const loadChaptersFromMetadata = async () => {
    // 先累积到局部数组，全部加载完成后一次性原子赋值。
    // 不能边 fetch 边 push 到 chapters.value：两次并发初始化（如 HMR 热更新重载组件、
    // 快速切换路由）会在 await 处交错向同一数组 push，导致每个章节重复两遍。
    const loaded: ExtendedMathChapter[] = []

    for (const source of SUBJECT_SOURCES) {
      try {
        const response = await fetch(DATA_BASE + source.base + 'metadata.json')
        if (!response.ok) {
          console.warn(`无法加载 ${source.subject} 的metadata.json`)
          continue
        }

        const metadata = await response.json()

        // 转换metadata为MathChapter格式
        for (const ch of metadata.chapters) {
          const chapter: ExtendedMathChapter = {
            id: source.subject + '_' + ch.id,
            title: ch.title,
            order: ch.order,
            estimatedTime: ch.estimatedHours * 60,  // 转为分钟
            difficulty: ch.difficulty === '核心' ? '进阶' : ch.difficulty,
            prerequisites: ch.prerequisites,
            keyPoints: ch.keyTopics,
            practiceProblems: [],
            completed: false,
            masteryLevel: 0,
            lastStudied: '',
            subject: source.subject,
            metadata: ch,
            contentFile: ch.markdownFile,
            contentBase: source.base
          }
          loaded.push(chapter)
        }
      } catch (error) {
        console.error(`加载 ${source.subject} 章节元数据失败:`, error)
      }
    }

    if (loaded.length === 0) {
      throw new Error('未能从任何metadata.json加载章节数据')
    }

    // 原子赋值：整体替换，杜绝并发交错导致的章节重复
    chapters.value = loaded

    await saveMathData()
    console.log('成功从metadata.json加载', chapters.value.length, '个章节（三学科）')
  }

  // 新增：加载章节Markdown内容
  const loadChapterContent = async (chapterId: string): Promise<string> => {
    const chapter = chapters.value.find(ch => ch.id === chapterId)
    if (!chapter || !chapter.contentFile) {
      console.warn('章节不存在或没有contentFile:', chapterId)
      return ''
    }
    
    try {
      const base = chapter.contentBase || 'data/math/higher-math/'
      const response = await fetch(DATA_BASE + base + chapter.contentFile)
      if (!response.ok) {
        throw new Error(`无法加载章节内容: ${chapter.contentFile}`)
      }
      return await response.text()
    } catch (error) {
      console.error('加载章节内容失败:', error)
      return ''
    }
  }

  // 新增：加载公式卡片数据
  const loadFormulasFromJson = async () => {
    try {
      const response = await fetch(DATA_BASE + 'data/math/higher-math/formulas.json')
      if (!response.ok) {
        throw new Error('无法加载formulas.json')
      }
      
      const data = await response.json()
      
      // 清空现有公式卡片
      formulaCards.value = []
      
      // 转换为FormulaCard格式
      Object.keys(data).forEach(chapterId => {
        const chapterData = data[chapterId]
        chapterData.formulas.forEach((f: FormulaData) => {
          const card: FormulaCard = {
            id: f.id,
            category: chapterData.title,
            title: f.name,
            formula: f.latex,
            description: f.description,
            examples: [f.application],
            masteryLevel: 0
          }
          formulaCards.value.push(card)
        })
      })
      
      await saveMathData()
      console.log('成功加载', formulaCards.value.length, '个公式卡片')
    } catch (error) {
      console.error('加载公式卡片失败:', error)
    }
  }

  const initializeMathData = async () => {
    isLoading.value = true
    try {
      // 数据版本检查：版本不一致时强制从metadata.json重新加载三学科数据
      const storedVersion = localStorage.getItem('mathDataVersion')
      if (storedVersion !== MATH_DATA_VERSION) {
        localStorage.removeItem('mathChapters')
        localStorage.removeItem('mathFormulaCards')
      }

      const storedChapters = localStorage.getItem('mathChapters')
      const storedProblems = localStorage.getItem('mathProblems')
      const storedWrong = localStorage.getItem('mathWrongProblems')
      const storedFormulas = localStorage.getItem('mathFormulaCards')
      
      // 优先尝试从metadata.json加载数据
      if (!storedChapters || storedChapters === '[]') {
        try {
          await loadChaptersFromMetadata()
          await loadFormulasFromJson()
          localStorage.setItem('mathDataVersion', MATH_DATA_VERSION)
          console.log('从metadata.json加载成功')
          return
        } catch (error) {
          console.error('从metadata.json加载失败，尝试加载localStorage数据:', error)
        }
      }
      
      if (storedChapters) {
        const parsedChapters = JSON.parse(storedChapters)
        // 恢复practiceProblems引用
        parsedChapters.forEach((chapter: any) => {
          chapter.practiceProblems = []
        })
        // 按 id 去重：早期版本的并发初始化竞态可能把重复章节写进了 localStorage，
        // 保留首次出现的条目（以保留掌握度等进度）。
        const seenIds = new Set<string>()
        chapters.value = parsedChapters.filter((chapter: any) => {
          if (seenIds.has(chapter.id)) return false
          seenIds.add(chapter.id)
          return true
        })
        // 若确实去掉了重复数据，回写一次以清除 localStorage 中的旧污染
        if (chapters.value.length !== parsedChapters.length) {
          console.warn(`检测到 localStorage 中 ${parsedChapters.length - chapters.value.length} 个重复章节，已去重`)
          await saveMathData()
        }
      }
      
      if (storedProblems) problems.value = JSON.parse(storedProblems)
      if (storedWrong) wrongProblems.value = JSON.parse(storedWrong)
      if (storedFormulas) formulaCards.value = JSON.parse(storedFormulas)
      
      // 如果没有数据，加载示例数据
      if (chapters.value.length === 0) {
        await loadSampleData()
      }
    } catch (error) {
      console.error('初始化数学数据失败:', error)
      // 出错时加载示例数据
      await loadSampleData()
    } finally {
      isLoading.value = false
    }
  }

  const loadSampleData = async () => {
    // 保留现有的示例数据加载逻辑作为后备
    // 但优先使用新的metadata.json加载方式
    try {
      await loadChaptersFromMetadata()
      return
    } catch (error) {
      console.error('从metadata.json加载失败，使用示例数据:', error)
    }

    // 原有的示例数据加载逻辑（保留作为后备）
    const sampleChapters: Omit<MathChapter, 'id' | 'completed' | 'masteryLevel' | 'lastStudied' | 'practiceProblems'>[] = [
      {
        title: '函数、极限、连续',
        order: 1,
        estimatedTime: 120,
        difficulty: '基础',
        prerequisites: [],
        keyPoints: ['函数概念', '极限定义', '连续性', '间断点类型']
      },
      {
        title: '数列极限',
        order: 2,
        estimatedTime: 90,
        difficulty: '基础',
        prerequisites: ['函数、极限、连续'],
        keyPoints: ['数列极限定义', '收敛准则', '重要极限', '夹逼定理']
      },
      {
        title: '一元函数微分学的概念',
        order: 3,
        estimatedTime: 150,
        difficulty: '进阶',
        prerequisites: ['函数、极限、连续'],
        keyPoints: ['导数定义', '几何意义', '可导性', '微分概念']
      },
      {
        title: '一元函数微分学的计算',
        order: 4,
        estimatedTime: 180,
        difficulty: '进阶',
        prerequisites: ['一元函数微分学的概念'],
        keyPoints: ['基本求导公式', '求导法则', '高阶导数', '隐函数求导']
      },
      {
        title: '一元函数微分学的应用(一) 几何应用',
        order: 5,
        estimatedTime: 120,
        difficulty: '进阶',
        prerequisites: ['一元函数微分学的计算'],
        keyPoints: ['函数单调性', '极值问题', '凹凸性', '拐点']
      },
      {
        title: '一元函数微分学的应用(二) 中值定理、微分等式与微分不等式',
        order: 6,
        estimatedTime: 150,
        difficulty: '难点',
        prerequisites: ['一元函数微分学的应用(一) 几何应用'],
        keyPoints: ['罗尔定理', '拉格朗日中值定理', '柯西中值定理', '泰勒公式']
      },
      {
        title: '一元函数微分学的应用(三) 物理应用与经济应用',
        order: 7,
        estimatedTime: 100,
        difficulty: '进阶',
        prerequisites: ['一元函数微分学的应用(二) 中值定理、微分等式与微分不等式'],
        keyPoints: ['变化率问题', '最优化问题', '边际分析', '弹性分析']
      },
      {
        title: '一元函数积分学的概念与性质',
        order: 8,
        estimatedTime: 140,
        difficulty: '进阶',
        prerequisites: ['一元函数微分学的概念'],
        keyPoints: ['原函数', '不定积分', '定积分', '微积分基本定理']
      },
      {
        title: '一元函数积分学的计算',
        order: 9,
        estimatedTime: 200,
        difficulty: '难点',
        prerequisites: ['一元函数积分学的概念与性质'],
        keyPoints: ['换元积分法', '分部积分法', '有理函数积分', '反常积分']
      },
      {
        title: '一元函数积分学的应用(一)',
        order: 10,
        estimatedTime: 120,
        difficulty: '进阶',
        prerequisites: ['一元函数积分学的计算'],
        keyPoints: ['平面图形面积', '旋转体体积', '弧长计算', '物理应用']
      },
      {
        title: '多元函数积分学的应用(二)—积分等式与积分不等式',
        order: 11,
        estimatedTime: 130,
        difficulty: '难点',
        prerequisites: ['一元函数积分学的应用(一)'],
        keyPoints: ['积分不等式', '积分等式', '变限积分', '积分应用']
      },
      {
        title: '一元函数积分学的应用(三)',
        order: 12,
        estimatedTime: 110,
        difficulty: '进阶',
        prerequisites: ['多元函数积分学的应用(二)—积分等式与积分不等式'],
        keyPoints: ['经济应用', '概率应用', '工程应用', '数值计算']
      },
      {
        title: '多元函数微分学',
        order: 13,
        estimatedTime: 180,
        difficulty: '难点',
        prerequisites: ['一元函数微分学的计算'],
        keyPoints: ['偏导数', '全微分', '方向导数', '梯度']
      },
      {
        title: '二重积分',
        order: 14,
        estimatedTime: 160,
        difficulty: '难点',
        prerequisites: ['多元函数微分学', '一元函数积分学的计算'],
        keyPoints: ['二重积分概念', '计算方法', '应用', '坐标变换']
      },
      {
        title: '微分方程',
        order: 15,
        estimatedTime: 150,
        difficulty: '难点',
        prerequisites: ['一元函数积分学的计算'],
        keyPoints: ['一阶微分方程', '二阶线性微分方程', '应用', '解的存在唯一性']
      },
      {
        title: '无穷级数',
        order: 16,
        estimatedTime: 140,
        difficulty: '难点',
        prerequisites: ['数列极限', '一元函数微分学的应用(二) 中值定理、微分等式与微分不等式'],
        keyPoints: ['数项级数', '幂级数', '傅里叶级数', '收敛性判别']
      },
      {
        title: '多元函数积分学的预备知识',
        order: 17,
        estimatedTime: 100,
        difficulty: '进阶',
        prerequisites: ['多元函数微分学'],
        keyPoints: ['空间解析几何', '向量代数', '曲面方程', '空间曲线']
      },
      {
        title: '多元函数积分学',
        order: 18,
        estimatedTime: 200,
        difficulty: '难点',
        prerequisites: ['二重积分', '多元函数积分学的预备知识'],
        keyPoints: ['三重积分', '曲线积分', '曲面积分', '格林公式']
      }
    ]

    for (const chapter of sampleChapters) {
      await addChapter(chapter)
    }

    // 添加示例题目
    const sampleProblems: Omit<MathProblem, 'id' | 'attempts'>[] = [
      {
        chapterId: chapters.value[0]?.id || '',
        title: '极限计算基础',
        type: '解答题',
        difficulty: '简单',
        content: '求 lim(x→0) (sin x)/x',
        solution: '1',
        tags: ['极限', '重要极限']
      },
      {
        chapterId: chapters.value[2]?.id || '',
        title: '导数定义应用',
        type: '解答题',
        difficulty: '中等',
        content: '用定义求 f(x) = x² 在 x = 1 处的导数',
        solution: '2',
        tags: ['导数定义', '极限']
      }
    ]

    for (const problem of sampleProblems) {
      if (problem.chapterId) {
        await addProblem(problem)
      }
    }

    // 添加示例公式卡片
    const sampleFormulas: Omit<FormulaCard, 'id' | 'masteryLevel'>[] = [
      {
        category: '极限',
        title: '两个重要极限',
        formula: 'lim(x→0) (sin x)/x = 1\nlim(x→∞) (1+1/x)^x = e',
        description: '高等数学中最常用的两个重要极限公式',
        examples: ['lim(x→0) (tan x)/x = 1', 'lim(x→0) (e^x-1)/x = 1']
      },
      {
        category: '导数',
        title: '基本求导公式',
        formula: "(x^n)' = nx^(n-1)\n(sin x)' = cos x\n(cos x)' = -sin x",
        description: '最基本的求导公式，必须熟练掌握',
        examples: ["(x³)' = 3x²", "(sin 2x)' = 2cos 2x"]
      }
    ]

    for (const formula of sampleFormulas) {
      await addFormulaCard(formula)
    }
  }

  return {
    // 状态
    chapters,
    problems,
    wrongProblems,
    formulaCards,
    currentChapter,
    isLoading,
    
    // 计算属性
    overallProgress,
    completedChapters,
    weakAreas,
    wrongProblemsByType,
    dueForReview,
    
    // 方法
    addChapter,
    updateChapterProgress,
    addProblem,
    submitAnswer,
    addToWrongProblems,
    updateWrongProblem,
    addFormulaCard,
    updateFormulaMastery,
    getChapterDependencyGraph,
    getRecommendedProblems,
    generateStudyPlan,
    saveMathData,
    initializeMathData,
    
    // 新增方法
    loadChaptersFromMetadata,
    loadChapterContent,
    loadFormulasFromJson
  }
})