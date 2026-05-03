// 解析数学HTML文件的工具函数
export interface MathChapter {
  id: string
  title: string
  order: number
  topics: MathTopic[]
  createdAt: string
}

export interface MathTopic {
  id: string
  title: string
  content: string
  examples?: string[]
  importance: number // 1-5
  type: 'concept' | 'method' | 'formula'
  mastered: boolean
  lastReviewed: string
}

// 解析HTML文件内容
export function parseMathHtmlContent(htmlContent: string, chapterTitle: string): MathChapter {
  // 创建临时DOM来解析HTML
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')
  
  // 提取章节信息
  const titleMatch = chapterTitle.match(/第(\d+)讲\s*(.*)/)
  const order = titleMatch ? parseInt(titleMatch[1]) : 0
  const title = titleMatch ? titleMatch[2] : chapterTitle
  
  // 查找所有可折叠内容区域
  const collapsibleSections = doc.querySelectorAll('.collapsible-content')
  const topics: MathTopic[] = []
  
  collapsibleSections.forEach((section, index) => {
    const header = section.previousElementSibling
    if (header && header.classList.contains('collapsible-header')) {
      const topicTitle = header.textContent?.trim() || `知识点${index + 1}`
      
      // 提取详细内容
      const contentDiv = section.querySelector('.collapsible-detail')
      const content = contentDiv ? contentDiv.textContent?.trim() || '' : ''
      
      // 简单的重要性判断（基于标题关键词）
      const importance = calculateImportance(topicTitle, content)
      
      // 判断类型
      const type = determineTopicType(topicTitle, content)
      
      topics.push({
        id: `topic_${order}_${index + 1}`,
        title: topicTitle,
        content: content,
        importance: importance,
        type: type,
        mastered: false,
        lastReviewed: new Date().toISOString()
      })
    }
  })
  
  return {
    id: `chapter_${order}`,
    title: title,
    order: order,
    topics: topics,
    createdAt: new Date().toISOString()
  }
}

// 计算知识点重要性
function calculateImportance(title: string, content: string): number {
  const highImportanceKeywords = ['定义', '定理', '准则', '性质', '公式', '方法']
  const mediumImportanceKeywords = ['应用', '例题', '计算', '证明']
  
  let score = 3 // 默认中等重要性
  
  for (const keyword of highImportanceKeywords) {
    if (title.includes(keyword) || content.includes(keyword)) {
      score = Math.max(score, 5)
      break
    }
  }
  
  if (score === 3) {
    for (const keyword of mediumImportanceKeywords) {
      if (title.includes(keyword) || content.includes(keyword)) {
        score = 4
        break
      }
    }
  }
  
  return score
}

// 判断知识点类型
function determineTopicType(title: string, content: string): 'concept' | 'method' | 'formula' {
  const conceptKeywords = ['定义', '概念', '性质', '定理', '准则']
  const methodKeywords = ['方法', '步骤', '技巧', '应用', '计算']
  const formulaKeywords = ['公式', '等式', '方程', '表达式']
  
  // 优先级：公式 > 方法 > 概念
  for (const keyword of formulaKeywords) {
    if (title.includes(keyword) || content.includes(keyword)) {
      return 'formula'
    }
  }
  
  for (const keyword of methodKeywords) {
    if (title.includes(keyword) || content.includes(keyword)) {
      return 'method'
    }
  }
  
  for (const keyword of conceptKeywords) {
    if (title.includes(keyword) || content.includes(keyword)) {
      return 'concept'
    }
  }
  
  return 'concept' // 默认为概念类
}

// 从文件名提取章节信息
export function extractChapterInfo(filename: string): { order: number; title: string } | null {
  const match = filename.match(/第(\d+)讲\s*(.*?)(?:\s|$)/)
  if (match) {
    return {
      order: parseInt(match[1]),
      title: match[2].trim()
    }
  }
  return null
}

// 批量处理所有章节文件
export async function loadAllMathChapters(): Promise<MathChapter[]> {
  // 这里应该从实际文件系统读取，但在前端环境中我们需要模拟
  // 实际应用中可以通过API或文件上传方式导入
  
  const chapters: MathChapter[] = []
  
  // 模拟18个章节的数据结构
  const chapterTitles = [
    '函数、极限、连续',
    '数列极限',
    '一元函数微分学的概念',
    '一元函数微分学的计算',
    '一元函数微分学的应用(一) 几何应用',
    '一元函数微分学的应用(二) 中值定理、微分等式与微分不等式',
    '一元函数微分学的应用(三) 物理应用与经济应用',
    '一元函数积分学的概念与性质',
    '一元函数积分学的计算',
    '一元函数积分学的应用(一)',
    '多元函数积分学的应用(二)——积分等式与积分不等式',
    '一元函数积分学的应用(三)',
    '多元函数微分学',
    '二重积分',
    '微分方程',
    '无穷级数',
    '多元函数积分学的预备知识',
    '多元函数积分学'
  ]
  
  // 为每个章节创建示例数据
  chapterTitles.forEach((title, index) => {
    const order = index + 1
    const topics: MathTopic[] = [
      {
        id: `topic_${order}_1`,
        title: `${title.split(' ')[0]}核心概念`,
        content: `这是${title}的核心概念内容，包含重要定义和基本性质。`,
        importance: 5,
        type: 'concept',
        mastered: false,
        lastReviewed: new Date().toISOString()
      },
      {
        id: `topic_${order}_2`,
        title: `${title.split(' ')[0]}重要方法`,
        content: `这是${title}的重要解题方法和技巧。`,
        importance: 4,
        type: 'method',
        mastered: false,
        lastReviewed: new Date().toISOString()
      }
    ]
    
    chapters.push({
      id: `chapter_${order}`,
      title: title,
      order: order,
      topics: topics,
      createdAt: new Date().toISOString()
    })
  })
  
  return chapters
}