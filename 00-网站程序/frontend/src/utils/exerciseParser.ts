// 解析数学习题HTML文件的工具函数
export interface MathProblem {
  id: string
  chapter: string
  title: string
  content: string
  solution: string
  type: '选择题' | '填空题' | '解答题' | '证明题'
  difficulty: '基础' | '中等' | '困难'
  tags: string[]
  createdAt: string
  mastered: boolean
  attempts: number
  correct: boolean | null
}

export interface ExerciseChapter {
  id: string
  title: string
  order: number
  problems: MathProblem[]
  totalProblems: number
  completedProblems: number
  createdAt: string
}

// 解析习题HTML文件内容
export function parseExerciseHtmlContent(htmlContent: string, fileName: string): ExerciseChapter {
  // 创建临时DOM来解析HTML
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')
  
  // 从文件名提取章节信息
  const titleMatch = fileName.match(/第(\d+)讲\s*(.*?)(?:\s|$)/)
  const order = titleMatch ? parseInt(titleMatch[1]) : 0
  const baseTitle = titleMatch ? titleMatch[2].replace('题型分类练习', '').trim() : fileName
  
  // 查找所有题目
  const questions = doc.querySelectorAll('.question')
  const problems: MathProblem[] = []
  
  questions.forEach((question, index) => {
    const titleElement = question.querySelector('.question-title')
    const contentElement = question.querySelector('.question-content')
    
    if (titleElement && contentElement) {
      const problemTitle = titleElement.textContent?.trim() || `题目${index + 1}`
      const problemContent = contentElement.textContent?.trim() || ''
      
      // 查找对应的答案
      let solution = ''
      const answerElements = question.parentElement?.querySelectorAll('.answer')
      if (answerElements && answerElements.length > 0) {
        // 找到紧随其后的答案元素
        let nextElement = question.nextElementSibling
        while (nextElement && !nextElement.classList.contains('answer')) {
          nextElement = nextElement.nextElementSibling
        }
        if (nextElement && nextElement.classList.contains('answer')) {
          solution = nextElement.textContent?.trim() || ''
        }
      }
      
      // 如果没找到答案，尝试从HTML结构中提取
      if (!solution) {
        const answerHeaders = doc.querySelectorAll('h4')
        answerHeaders.forEach(header => {
          if (header.textContent?.includes('答案') || header.textContent?.includes('解：')) {
            const answerContent = header.nextElementSibling
            if (answerContent && answerContent.tagName === 'P') {
              solution = answerContent.textContent?.trim() || ''
            }
          }
        })
      }
      
      // 判断题目类型
      const type = determineProblemType(problemContent, solution)
      
      // 判断难度
      const difficulty = calculateDifficulty(problemContent, solution)
      
      // 提取标签
      const tags = extractTags(problemContent, baseTitle)
      
      problems.push({
        id: `problem_${order}_${index + 1}`,
        chapter: `第${order}讲 ${baseTitle}`,
        title: problemTitle,
        content: problemContent,
        solution: solution || '暂无解析',
        type: type,
        difficulty: difficulty,
        tags: tags,
        createdAt: new Date().toISOString(),
        mastered: false,
        attempts: 0,
        correct: null
      })
    }
  })
  
  return {
    id: `exercise_chapter_${order}`,
    title: `第${order}讲 ${baseTitle}`,
    order: order,
    problems: problems,
    totalProblems: problems.length,
    completedProblems: 0,
    createdAt: new Date().toISOString()
  }
}

// 判断题目类型
function determineProblemType(content: string, solution: string): '选择题' | '填空题' | '解答题' | '证明题' {
  // 检查是否有选项（A、B、C、D）
  if (/[A-Z]\s*[\.、]/.test(content)) {
    return '选择题'
  }
  
  // 检查是否有填空符号
  if (/[__空白空]/.test(content) || /\\underline/.test(content)) {
    return '填空题'
  }
  
  // 检查是否是证明题
  if (/证明|证/.test(content) && solution.length > 100) {
    return '证明题'
  }
  
  return '解答题'
}

// 计算题目难度
function calculateDifficulty(content: string, solution: string): '基础' | '中等' | '困难' {
  const contentLength = content.length
  const solutionLength = solution.length
  
  // 基于长度和关键词判断
  const difficultKeywords = ['证明', '证', '复杂', '综合', '技巧性强']
  const hasDifficultKeyword = difficultKeywords.some(keyword => 
    content.includes(keyword) || solution.includes(keyword)
  )
  
  if (hasDifficultKeyword || contentLength > 200 || solutionLength > 500) {
    return '困难'
  } else if (contentLength > 100 || solutionLength > 200) {
    return '中等'
  } else {
    return '基础'
  }
}

// 提取标签
function extractTags(content: string, chapterTitle: string): string[] {
  const tags: string[] = [chapterTitle]
  
  // 基于内容关键词添加标签
  const keywordTags: Record<string, string> = {
    '极限': '极限',
    '导数': '导数',
    '积分': '积分',
    '连续': '连续性',
    '函数': '函数',
    '微分': '微分',
    '级数': '级数',
    '方程': '微分方程'
  }
  
  Object.entries(keywordTags).forEach(([keyword, tag]) => {
    if (content.includes(keyword)) {
      tags.push(tag)
    }
  })
  
  return [...new Set(tags)] // 去重
}

// 从文件名获取章节信息
export function getChapterFromFilename(filename: string): { order: number; title: string } | null {
  const match = filename.match(/第(\d+)讲\s*(.*?)(?:\s题型分类练习)?\.html/)
  if (match) {
    return {
      order: parseInt(match[1]),
      title: match[2].trim()
    }
  }
  return null
}

// 批量处理所有习题文件
export async function loadAllExerciseChapters(): Promise<ExerciseChapter[]> {
  // 这里应该从实际文件系统读取
  // 在前端环境中我们模拟数据
  
  const chapters: ExerciseChapter[] = []
  
  // 模拟6个章节的习题数据
  const chapterData = [
    { order: 1, title: '函数、极限与连续', problemCount: 10 },
    { order: 2, title: '导数与微分、中值定理', problemCount: 8 },
    { order: 3, title: '一元函数积分学', problemCount: 12 },
    { order: 4, title: '多元函数微分学', problemCount: 9 },
    { order: 5, title: '多元函数积分学', problemCount: 11 },
    { order: 6, title: '无穷级数', problemCount: 7 }
  ]
  
  chapterData.forEach(({ order, title, problemCount }) => {
    const problems: MathProblem[] = []
    
    for (let i = 1; i <= problemCount; i++) {
      problems.push({
        id: `problem_${order}_${i}`,
        chapter: `第${order}讲 ${title}`,
        title: `例题${i}`,
        content: `这是第${order}讲${title}的第${i}道练习题。题目内容涉及相关的数学概念和计算方法。`,
        solution: `这是第${i}题的详细解答过程，包含完整的解题步骤和思路分析。`,
        type: i % 4 === 0 ? '选择题' : i % 3 === 0 ? '填空题' : i % 2 === 0 ? '证明题' : '解答题',
        difficulty: i % 3 === 0 ? '困难' : i % 2 === 0 ? '中等' : '基础',
        tags: [title, '练习题'],
        createdAt: new Date().toISOString(),
        mastered: false,
        attempts: 0,
        correct: null
      })
    }
    
    chapters.push({
      id: `exercise_chapter_${order}`,
      title: `第${order}讲 ${title}`,
      order: order,
      problems: problems,
      totalProblems: problemCount,
      completedProblems: 0,
      createdAt: new Date().toISOString()
    })
  })
  
  return chapters
}