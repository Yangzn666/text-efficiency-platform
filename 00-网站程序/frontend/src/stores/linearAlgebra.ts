import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface LinearAlgebraProblem {
  id: string
  chapter: string
  type: '选择题' | '填空题' | '计算题' | '证明题'
  difficulty: '基础' | '中等' | '困难'
  title: string
  content: string
  options?: string[]
  answer: string
  solution: string
  tags: string[]
  createdAt: string
  completed: boolean
  userAnswer?: string
  timeSpent?: number // 用时（秒）
}

export interface PracticeSession {
  id: string
  title: string
  problems: string[] // problem ids
  startTime: string
  endTime?: string
  score?: number
  totalTime?: number
}

export interface WrongProblem {
  problemId: string
  wrongCount: number
  lastWrongTime: string
  reviewNotes?: string
}

export const useLinearAlgebraStore = defineStore('linearAlgebra', () => {
  // 状态
  const problems = ref<LinearAlgebraProblem[]>([])
  const practiceSessions = ref<PracticeSession[]>([])
  const wrongProblems = ref<WrongProblem[]>([])
  const currentProblemIndex = ref(0)
  const isPracticing = ref(false)
  const startTime = ref<number | null>(null)

  // 计算属性
  const currentSession = computed(() => {
    return practiceSessions.value.find(session => !session.endTime)
  })

  const currentProblem = computed(() => {
    if (!currentSession.value || currentProblemIndex.value >= currentSession.value.problems.length) {
      return null
    }
    const problemId = currentSession.value.problems[currentProblemIndex.value]
    return problems.value.find(p => p.id === problemId)
  })

  const sessionProgress = computed(() => {
    if (!currentSession.value) return 0
    return Math.round((currentProblemIndex.value / currentSession.value.problems.length) * 100)
  })

  const chapterStats = computed(() => {
    const stats: Record<string, { total: number; completed: number; accuracy: number }> = {}
    
    problems.value.forEach(problem => {
      if (!stats[problem.chapter]) {
        stats[problem.chapter] = { total: 0, completed: 0, accuracy: 0 }
      }
      
      stats[problem.chapter].total++
      if (problem.completed) {
        stats[problem.chapter].completed++
      }
    })
    
    // 计算准确率
    Object.keys(stats).forEach(chapter => {
      const chapterData = stats[chapter]
      chapterData.accuracy = chapterData.total > 0 
        ? Math.round((chapterData.completed / chapterData.total) * 100)
        : 0
    })
    
    return stats
  })

  const difficultyStats = computed(() => {
    const stats: Record<string, { total: number; completed: number }> = {
      '基础': { total: 0, completed: 0 },
      '中等': { total: 0, completed: 0 },
      '困难': { total: 0, completed: 0 }
    }
    
    problems.value.forEach(problem => {
      stats[problem.difficulty].total++
      if (problem.completed) {
        stats[problem.difficulty].completed++
      }
    })
    
    return stats
  })

  // 方法
  const loadProblems = () => {
    // 从线代项目导入真实题目数据
    if (problems.value.length === 0) {
      const realProblems: LinearAlgebraProblem[] = [
        // 第一章 行列式 选择题
        {
          id: 'la_ch1_q1',
          chapter: '第一章 行列式',
          type: '选择题',
          difficulty: '中等',
          title: '伴随矩阵的行列式',
          content: '设A为n阶方阵，且|A|=2，则|A*|=（ ）',
          options: ['A. 2^(n-1)', 'B. 2^n', 'C. 2^(n-2)', 'D. 2'],
          answer: 'A',
          solution: '由|A*| = |A|^(n-1)，得|A*| = 2^(n-1)',
          tags: ['行列式', '伴随矩阵', '性质'],
          createdAt: new Date().toISOString(),
          completed: false
        },
        {
          id: 'la_ch1_q2',
          chapter: '第一章 行列式',
          type: '选择题',
          difficulty: '基础',
          title: '数乘矩阵的行列式',
          content: '设A为n阶方阵，则|kA|=（ ）',
          options: ['A. k|A|', 'B. kn|A|', 'C. k^n|A|', 'D. |kA|'],
          answer: 'C',
          solution: '数乘矩阵的行列式性质，|kA| = k^n|A|',
          tags: ['行列式', '数乘', '性质'],
          createdAt: new Date().toISOString(),
          completed: false
        },
        {
          id: 'la_ch1_q3',
          chapter: '第一章 行列式',
          type: '选择题',
          difficulty: '基础',
          title: '矩阵运算的行列式性质',
          content: '设A, B均为n阶方阵，则下列等式恒成立的是（ ）',
          options: ['A. |A+B|=|A|+|B|', 'B. |AB|=|A||B|', 'C. |A-B|=|A|-|B|', 'D. |A^T|=|A|'],
          answer: 'B',
          solution: 'A、C不成立，D中|A^T|=|A|但不是"等式"而是性质，B是行列式的乘法性质',
          tags: ['行列式', '运算性质'],
          createdAt: new Date().toISOString(),
          completed: false
        },
        {
          id: 'la_ch1_q4',
          chapter: '第一章 行列式',
          type: '选择题',
          difficulty: '中等',
          title: '正交矩阵的行列式',
          content: '设A为n阶方阵，且A^T=A^-1，则|A|=（ ）',
          options: ['A. 1', 'B. -1', 'C. ±1', 'D. 0'],
          answer: 'C',
          solution: '由A^T=A^-1得AA^T=E，故|A||A^T|=|A|²=|E|=1，所以|A|=±1',
          tags: ['行列式', '正交矩阵', '性质'],
          createdAt: new Date().toISOString(),
          completed: false
        },
        {
          id: 'la_ch1_q5',
          chapter: '第一章 行列式',
          type: '选择题',
          difficulty: '基础',
          title: '奇异矩阵的判定',
          content: '若n阶方阵A的秩r(A)<n，则|A|=（ ）',
          options: ['A. 1', 'B. -1', 'C. 0', 'D. 无法确定'],
          answer: 'C',
          solution: '方阵的秩小于阶数，则行列式为0',
          tags: ['行列式', '秩', '奇异矩阵'],
          createdAt: new Date().toISOString(),
          completed: false
        },
        
        // 第一章 行列式 填空题
        {
          id: 'la_ch1_f1',
          chapter: '第一章 行列式',
          type: '填空题',
          difficulty: '基础',
          title: '数乘矩阵的行列式计算',
          content: '设A为3阶方阵，且|A|=2，则|2A|=____。',
          answer: '16',
          solution: '|2A| = 2³|A| = 8×2 = 16',
          tags: ['行列式', '数乘', '计算'],
          createdAt: new Date().toISOString(),
          completed: false
        },
        {
          id: 'la_ch1_f2',
          chapter: '第一章 行列式',
          type: '填空题',
          difficulty: '中等',
          title: '伴随矩阵的行列式',
          content: '设A为4阶方阵，且|A|=3，则|A*|=____。',
          answer: '27',
          solution: '|A*| = |A|^(n-1) = 3^(4-1) = 3³ = 27',
          tags: ['行列式', '伴随矩阵', '计算'],
          createdAt: new Date().toISOString(),
          completed: false
        },
        {
          id: 'la_ch1_f3',
          chapter: '第一章 行列式',
          type: '填空题',
          difficulty: '基础',
          title: '单位矩阵的行列式',
          content: 'n阶单位矩阵E的行列式|E|=____。',
          answer: '1',
          solution: '单位矩阵的行列式恒为1',
          tags: ['行列式', '单位矩阵'],
          createdAt: new Date().toISOString(),
          completed: false
        },
        {
          id: 'la_ch1_f4',
          chapter: '第一章 行列式',
          type: '填空题',
          difficulty: '基础',
          title: '转置矩阵的行列式',
          content: '设A为n阶方阵，则|A^T|=____。',
          answer: '|A|',
          solution: '转置矩阵的行列式等于原矩阵的行列式',
          tags: ['行列式', '转置', '性质'],
          createdAt: new Date().toISOString(),
          completed: false
        },
        {
          id: 'la_ch1_f5',
          chapter: '第一章 行列式',
          type: '填空题',
          difficulty: '中等',
          title: '正交矩阵的行列式',
          content: '若A为正交矩阵，则|A|=____。',
          answer: '±1',
          solution: '正交矩阵满足AA^T=E，故|A|²=1，所以|A|=±1',
          tags: ['行列式', '正交矩阵', '性质'],
          createdAt: new Date().toISOString(),
          completed: false
        },
        
        // 第二章 矩阵 选择题
        {
          id: 'la_ch2_q1',
          chapter: '第二章 矩阵',
          type: '选择题',
          difficulty: '中等',
          title: '幂等矩阵的特征值',
          content: '设A为n阶方阵，且A²=A，则A的特征值只能是（ ）',
          options: ['A. 0', 'B. 1', 'C. 0或1', 'D. -1或1'],
          answer: 'C',
          solution: '由A²=A得λ²=λ，解得λ=0或λ=1',
          tags: ['矩阵', '特征值', '幂等矩阵'],
          createdAt: new Date().toISOString(),
          completed: false
        },
        {
          id: 'la_ch2_q2',
          chapter: '第二章 矩阵',
          type: '选择题',
          difficulty: '基础',
          title: '矩阵乘积的转置',
          content: '设A, B均为n阶方阵，则(AB)ᵀ=（ ）',
          options: ['A. AB', 'B. BA', 'C. AᵀBᵀ', 'D. BᵀAᵀ'],
          answer: 'D',
          solution: '矩阵乘积的转置等于转置矩阵的反序乘积',
          tags: ['矩阵', '转置', '运算性质'],
          createdAt: new Date().toISOString(),
          completed: false
        },
        {
          id: 'la_ch2_q3',
          chapter: '第二章 矩阵',
          type: '选择题',
          difficulty: '中等',
          title: '转置矩阵的逆',
          content: '设A为n阶可逆方阵，则(Aᵀ)⁻¹=（ ）',
          options: ['A. (A⁻¹)ᵀ', 'B. Aᵀ', 'C. A⁻¹', 'D. -(A⁻¹)ᵀ'],
          answer: 'A',
          solution: '可逆矩阵转置的逆等于逆矩阵的转置',
          tags: ['矩阵', '转置', '逆矩阵'],
          createdAt: new Date().toISOString(),
          completed: false
        },
        {
          id: 'la_ch2_q4',
          chapter: '第二章 矩阵',
          type: '选择题',
          difficulty: '基础',
          title: '伴随矩阵的性质',
          content: '设A为n阶方阵，A*为其伴随矩阵，则AA*=（ ）',
          options: ['A. |A|E', 'B. A', 'C. E', 'D. |A|A'],
          answer: 'A',
          solution: '方阵与其伴随矩阵的乘积等于行列式乘以单位矩阵',
          tags: ['矩阵', '伴随矩阵', '性质'],
          createdAt: new Date().toISOString(),
          completed: false
        },
        {
          id: 'la_ch2_q5',
          chapter: '第二章 矩阵',
          type: '选择题',
          difficulty: '中等',
          title: '对合矩阵的性质',
          content: '设A为n阶方阵，若A²=E，则A（ ）',
          options: ['A. 一定是单位矩阵', 'B. 一定不是单位矩阵', 'C. 可能是单位矩阵', 'D. 以上都不对'],
          answer: 'C',
          solution: 'A²=E说明A是对合矩阵，单位矩阵E满足此条件，但也可能存在其他对合矩阵',
          tags: ['矩阵', '对合矩阵', '性质'],
          createdAt: new Date().toISOString(),
          completed: false
        },
        
        // 第三章 向量 选择题
        {
          id: 'la_ch3_q1',
          chapter: '第三章 向量',
          type: '选择题',
          difficulty: '中等',
          title: '向量组的线性相关性',
          content: '设向量组α₁, α₂, α₃线性无关，则向量组（ ）',
          options: [
            'A. α₁, α₂, α₁+α₂线性无关', 
            'B. α₁, α₂, α₁-α₂线性无关',
            'C. α₁, α₂, α₁+2α₂线性无关', 
            'D. α₁, α₁+α₂, α₁+α₂+α₃线性相关'
          ],
          answer: 'D',
          solution: '由于α₁+α₂+α₃ = (α₁+α₂) + α₃，存在线性关系，故向量组线性相关',
          tags: ['向量', '线性相关', '线性无关'],
          createdAt: new Date().toISOString(),
          completed: false
        },
        {
          id: 'la_ch3_q2',
          chapter: '第三章 向量',
          type: '选择题',
          difficulty: '基础',
          title: '向量组的秩',
          content: '设向量组α₁, α₂, ..., αs的秩为r，则（ ）',
          options: [
            'A. 必有r<s', 
            'B. 向量组中任意r个向量线性无关',
            'C. 向量组中任意r+1个向量线性相关', 
            'D. 向量组中任意r-1个向量线性相关'
          ],
          answer: 'C',
          solution: '向量组的秩为r意味着最大线性无关组含有r个向量，因此任意r+1个向量必然线性相关',
          tags: ['向量', '秩', '线性相关'],
          createdAt: new Date().toISOString(),
          completed: false
        },
        {
          id: 'la_ch3_q3',
          chapter: '第三章 向量',
          type: '选择题',
          difficulty: '基础',
          title: '线性相关的性质',
          content: '设n维向量组α₁, α₂, ..., αs线性相关，则（ ）',
          options: [
            'A. 每个向量都可用其余向量线性表示',
            'B. 只有一个向量可用其余向量线性表示',
            'C. 至少有一个向量可用其余向量线性表示',
            'D. 任意一个向量都不可用其余向量线性表示'
          ],
          answer: 'C',
          solution: '线性相关意味着至少存在一组不全为零的系数使得线性组合为零向量，因此至少有一个向量可用其余向量线性表示',
          tags: ['向量', '线性相关', '线性表示'],
          createdAt: new Date().toISOString(),
          completed: false
        },
        {
          id: 'la_ch3_q4',
          chapter: '第三章 向量',
          type: '选择题',
          difficulty: '中等',
          title: '线性表示的判断',
          content: '设α₁, α₂, α₃线性无关，α₁, α₂, α₃, β线性相关，则（ ）',
          options: [
            'A. β一定能由α₁, α₂, α₃线性表示',
            'B. β一定不能由α₁, α₂, α₃线性表示',
            'C. β可能由α₁, α₂, α₃线性表示',
            'D. 以上都不对'
          ],
          answer: 'A',
          solution: '由于α₁, α₂, α₃线性无关，而加入β后线性相关，说明β必能由α₁, α₂, α₃线性表示',
          tags: ['向量', '线性相关', '线性表示'],
          createdAt: new Date().toISOString(),
          completed: false
        },
        {
          id: 'la_ch3_q5',
          chapter: '第三章 向量',
          type: '选择题',
          difficulty: '基础',
          title: '向量个数与维数的关系',
          content: 'n+1个n维向量组成的向量组（ ）',
          options: [
            'A. 一定线性无关',
            'B. 一定线性相关',
            'C. 可能线性无关',
            'D. 无法判断'
          ],
          answer: 'B',
          solution: 'n+1个n维向量必定线性相关，因为向量个数超过了维数',
          tags: ['向量', '线性相关', '维数'],
          createdAt: new Date().toISOString(),
          completed: false
        },
        
        // 第四章 线性方程组 选择题
        {
          id: 'la_ch4_q1',
          chapter: '第四章 线性方程组',
          type: '选择题',
          difficulty: '中等',
          title: '非齐次方程组有唯一解的条件',
          content: '设A为m×n矩阵，非齐次线性方程组Ax=b有唯一解的充分必要条件是（ ）',
          options: [
            'A. r(A)=r(A,b)=n',
            'B. r(A)=r(A,b)',
            'C. r(A)<n',
            'D. r(A)=n'
          ],
          answer: 'A',
          solution: '非齐次方程组有唯一解当且仅当系数矩阵和增广矩阵的秩相等且等于未知数个数',
          tags: ['线性方程组', '非齐次', '唯一解'],
          createdAt: new Date().toISOString(),
          completed: false
        },
        {
          id: 'la_ch4_q2',
          chapter: '第四章 线性方程组',
          type: '选择题',
          difficulty: '基础',
          title: '齐次方程组有非零解的条件',
          content: '设A为m×n矩阵，齐次线性方程组Ax=0有非零解的充分必要条件是（ ）',
          options: [
            'A. r(A)=n',
            'B. r(A)<n',
            'C. r(A)>n',
            'D. r(A)=m'
          ],
          answer: 'B',
          solution: '齐次方程组有非零解当且仅当系数矩阵的秩小于未知数个数',
          tags: ['线性方程组', '齐次', '非零解'],
          createdAt: new Date().toISOString(),
          completed: false
        },
        {
          id: 'la_ch4_q3',
          chapter: '第四章 线性方程组',
          type: '选择题',
          difficulty: '中等',
          title: '基础解系的向量个数',
          content: '设n元齐次线性方程组Ax=0的基础解系中含有r个解向量，则（ ）',
          options: [
            'A. r=n-r(A)',
            'B. r=n+r(A)',
            'C. r=r(A)-n',
            'D. r=n×r(A)'
          ],
          answer: 'A',
          solution: '基础解系中向量个数等于未知数个数减去系数矩阵的秩',
          tags: ['线性方程组', '齐次', '基础解系'],
          createdAt: new Date().toISOString(),
          completed: false
        },
        {
          id: 'la_ch4_q4',
          chapter: '第四章 线性方程组',
          type: '选择题',
          difficulty: '基础',
          title: '奇异矩阵对应的齐次方程组',
          content: '设A为n阶方阵，且|A|=0，则齐次线性方程组Ax=0（ ）',
          options: [
            'A. 只有零解',
            'B. 有非零解',
            'C. 无解',
            'D. 有无穷多解'
          ],
          answer: 'B',
          solution: '方阵行列式为0说明矩阵奇异，对应的齐次方程组必有非零解',
          tags: ['线性方程组', '齐次', '奇异矩阵'],
          createdAt: new Date().toISOString(),
          completed: false
        },
        {
          id: 'la_ch4_q5',
          chapter: '第四章 线性方程组',
          type: '选择题',
          difficulty: '中等',
          title: '非齐次方程组解的情况',
          content: '设非齐次线性方程组Ax=b有解，且r(A)=r<n，则该方程组（ ）',
          options: [
            'A. 有唯一解',
            'B. 有无穷多解',
            'C. 无解',
            'D. 解的情况不确定'
          ],
          answer: 'B',
          solution: '当r(A)=r<n时，方程组有无穷多解，因为存在自由未知数',
          tags: ['线性方程组', '非齐次', '无穷多解'],
          createdAt: new Date().toISOString(),
          completed: false
        }
      ]
      
      problems.value = realProblems
      saveData()
    }
  }

  const startPractice = (problemIds: string[], sessionTitle: string) => {
    const newSession: PracticeSession = {
      id: Date.now().toString(),
      title: sessionTitle,
      problems: problemIds,
      startTime: new Date().toISOString()
    }
    
    practiceSessions.value.push(newSession)
    currentProblemIndex.value = 0
    isPracticing.value = true
    startTime.value = Date.now()
    
    saveData()
  }

  const submitAnswer = (answer: string) => {
    if (!currentProblem.value) return
    
    currentProblem.value.userAnswer = answer
    currentProblem.value.completed = true
    currentProblem.value.timeSpent = startTime.value ? Math.floor((Date.now() - startTime.value) / 1000) : 0
    
    // 检查答案是否正确
    const isCorrect = checkAnswer(currentProblem.value, answer)
    
    if (!isCorrect) {
      // 记录错题
      addToWrongProblems(currentProblem.value.id)
    }
    
    // 移动到下一题
    moveToNextProblem()
  }

  const checkAnswer = (problem: LinearAlgebraProblem, userAnswer: string): boolean => {
    if (problem.type === '选择题') {
      return userAnswer === problem.answer
    } else if (problem.type === '填空题') {
      // 简单的字符串比较，实际应用中可能需要更复杂的匹配逻辑
      return userAnswer.trim() === problem.answer.trim()
    }
    // 计算题和证明题需要人工评判
    return true
  }

  const moveToNextProblem = () => {
    if (!currentSession.value) return
    
    currentProblemIndex.value++
    startTime.value = Date.now()
    
    // 检查是否完成所有题目
    if (currentProblemIndex.value >= currentSession.value.problems.length) {
      finishPractice()
    }
    
    saveData()
  }

  const finishPractice = () => {
    if (!currentSession.value) return
    
    const endTime = new Date().toISOString()
    const totalTime = startTime.value ? Math.floor((Date.now() - startTime.value) / 1000) : 0
    
    currentSession.value.endTime = endTime
    currentSession.value.totalTime = totalTime
    currentSession.value.score = calculateScore(currentSession.value.problems)
    
    isPracticing.value = false
    currentProblemIndex.value = 0
    startTime.value = null
    
    saveData()
  }

  const calculateScore = (problemIds: string[]): number => {
    const sessionProblems = problems.value.filter(p => problemIds.includes(p.id))
    const correctCount = sessionProblems.filter(p => p.completed && checkAnswer(p, p.userAnswer || '')).length
    return Math.round((correctCount / sessionProblems.length) * 100)
  }

  const addToWrongProblems = (problemId: string) => {
    const existing = wrongProblems.value.find(wp => wp.problemId === problemId)
    if (existing) {
      existing.wrongCount++
      existing.lastWrongTime = new Date().toISOString()
    } else {
      wrongProblems.value.push({
        problemId,
        wrongCount: 1,
        lastWrongTime: new Date().toISOString()
      })
    }
    
    saveData()
  }

  const getWrongProblems = (): LinearAlgebraProblem[] => {
    return problems.value.filter(problem => 
      wrongProblems.value.some(wp => wp.problemId === problem.id)
    )
  }

  const getProblemsByChapter = (chapter: string): LinearAlgebraProblem[] => {
    return problems.value.filter(problem => problem.chapter === chapter)
  }

  const getProblemsByType = (type: string): LinearAlgebraProblem[] => {
    return problems.value.filter(problem => problem.type === type)
  }

  const getProblemsByDifficulty = (difficulty: string): LinearAlgebraProblem[] => {
    return problems.value.filter(problem => problem.difficulty === difficulty)
  }

  // 数据持久化
  const saveData = () => {
    const data = {
      problems: problems.value,
      practiceSessions: practiceSessions.value,
      wrongProblems: wrongProblems.value
    }
    localStorage.setItem('linearAlgebraData', JSON.stringify(data))
  }

  const loadData = () => {
    const saved = localStorage.getItem('linearAlgebraData')
    const version = localStorage.getItem('linearAlgebraVersion')
    
    // 检查数据版本，如果不是最新版本则重新加载
    if (saved && version === 'v1.1') {
      try {
        const data = JSON.parse(saved)
        problems.value = data.problems || []
        practiceSessions.value = data.practiceSessions || []
        wrongProblems.value = data.wrongProblems || []
      } catch (e) {
        console.error('Failed to load linear algebra data:', e)
        // 出错时重新加载题目
        loadProblems()
      }
    } else {
      // 版本不匹配或没有数据，重新加载
      loadProblems()
      // 设置新版本
      localStorage.setItem('linearAlgebraVersion', 'v1.1')
    }
  }

  // 初始化
  loadData()
  // 强制重新加载题目数据以确保最新内容
  loadProblems()

  return {
    // 状态
    problems,
    practiceSessions,
    wrongProblems,
    currentProblemIndex,
    isPracticing,
    startTime,
    
    // 计算属性
    currentSession,
    currentProblem,
    sessionProgress,
    chapterStats,
    difficultyStats,
    
    // 方法
    loadProblems,
    startPractice,
    submitAnswer,
    checkAnswer,
    moveToNextProblem,
    finishPractice,
    calculateScore,
    addToWrongProblems,
    getWrongProblems,
    getProblemsByChapter,
    getProblemsByType,
    getProblemsByDifficulty,
    saveData,
    loadData
  }
})