// 解析完整的数知识点HTML文件
export interface KnowledgeSection {
  id: string
  title: string
  content: string
  subsections?: KnowledgeSubsection[]
}

export interface KnowledgeSubsection {
  id: string
  title: string
  content: string
  examples?: string[]
  formulas?: string[]
}

export interface CompleteKnowledgePoint {
  chapter: string
  order: number
  title: string
  mindmapContent: string
  coreConcepts: KnowledgeSection[]
  keyPoints: KnowledgeSection[]
  problemSolving: KnowledgeSection[]
}

// 解析完整的知识点HTML文件
export function parseCompleteKnowledgeHtml(htmlContent: string, fileName: string): CompleteKnowledgePoint {
  // 创建临时DOM来解析HTML
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')
  
  // 从文件名提取章节信息
  const titleMatch = fileName.match(/第(\d+)讲\s*(.*?)(?:\s|$)/)
  const order = titleMatch ? parseInt(titleMatch[1]) : 0
  const baseTitle = titleMatch ? titleMatch[2].trim() : fileName
  
  // 提取思维导图内容
  const mindmapContainer = doc.querySelector('.mindmap-container')
  const mindmapContent = mindmapContainer ? mindmapContainer.outerHTML : ''
  
  // 提取各个部分内容
  const coreConcepts = extractSections(doc, '二、核心概念')
  const keyPoints = extractSections(doc, '三、重点知识')
  const problemSolving = extractSections(doc, '四、做题思路')
  
  return {
    chapter: `第${order}讲 ${baseTitle}`,
    order: order,
    title: baseTitle,
    mindmapContent: mindmapContent,
    coreConcepts: coreConcepts,
    keyPoints: keyPoints,
    problemSolving: problemSolving
  }
}

// 提取指定标题下的所有章节
function extractSections(doc: Document, sectionTitle: string): KnowledgeSection[] {
  const sections: KnowledgeSection[] = []
  const headings = doc.querySelectorAll('h2')
  
  let targetSection: Element | null = null
  for (const heading of headings) {
    if (heading.textContent?.includes(sectionTitle)) {
      targetSection = heading
      break
    }
  }
  
  if (!targetSection) return sections
  
  // 查找该章节下的所有h3子章节
  let currentElement = targetSection.nextElementSibling
  while (currentElement && currentElement.tagName !== 'H2') {
    if (currentElement.tagName === 'H3') {
      const sectionTitle = currentElement.textContent?.trim() || ''
      const sectionId = sectionTitle.replace(/\s+/g, '-').toLowerCase()
      
      // 查找对应的内容区域
      const contentArea = currentElement.nextElementSibling?.nextElementSibling
      let content = ''
      const subsections: KnowledgeSubsection[] = []
      
      if (contentArea && contentArea.classList.contains('collapsible-content')) {
        content = contentArea.textContent?.trim() || ''
        
        // 提取子小节
        const subHeadings = contentArea.querySelectorAll('h4')
        subHeadings.forEach(subHeading => {
          const subTitle = subHeading.textContent?.trim() || ''
          const subId = subTitle.replace(/\s+/g, '-').toLowerCase()
          
          let subContent = ''
          let currentSub = subHeading.nextElementSibling
          while (currentSub && currentSub.tagName !== 'H4' && currentSub.tagName !== 'H3') {
            if (currentSub.classList?.contains('formula') || 
                currentSub.classList?.contains('example') ||
                currentSub.tagName === 'P') {
              subContent += currentSub.outerHTML + '\n'
            }
            currentSub = currentSub.nextElementSibling
          }
          
          subsections.push({
            id: subId,
            title: subTitle,
            content: subContent,
            examples: extractExamples(subContent),
            formulas: extractFormulas(subContent)
          })
        })
      }
      
      sections.push({
        id: sectionId,
        title: sectionTitle,
        content: content,
        subsections: subsections
      })
    }
    currentElement = currentElement.nextElementSibling
  }
  
  return sections
}

// 提取示例内容
function extractExamples(content: string): string[] {
  const examples: string[] = []
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = content
  
  const exampleElements = tempDiv.querySelectorAll('.example')
  exampleElements.forEach(example => {
    examples.push(example.textContent?.trim() || '')
  })
  
  return examples
}

// 提取公式内容
function extractFormulas(content: string): string[] {
  const formulas: string[] = []
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = content
  
  const formulaElements = tempDiv.querySelectorAll('.formula')
  formulaElements.forEach(formula => {
    formulas.push(formula.textContent?.trim() || '')
  })
  
  // 也提取行内公式
  const inlineMatches = content.match(/\$[^$]+\$/g)
  if (inlineMatches) {
    formulas.push(...inlineMatches)
  }
  
  return [...new Set(formulas)] // 去重
}

// 获取所有知识点文件
export function getAllKnowledgeFiles(): string[] {
  return [
    'd:/学习/效率/数学/高数基础知识/第1讲 函数、极限、连续.html',
    'd:/学习/效率/数学/高数基础知识/第2讲 数列极限.html',
    'd:/学习/效率/数学/高数基础知识/第3讲 一元函数微分学的概念.html',
    'd:/学习/效率/数学/高数基础知识/第4讲 一元函数微分学的计算.html',
    'd:/学习/效率/数学/高数基础知识/第5讲 一元函数微分学的应用(一) 几何应用.html',
    'd:/学习/效率/数学/高数基础知识/第6讲 一元函数微分学的应用(二) 中值定理、微分等式与微分不等式.html',
    'd:/学习/效率/数学/高数基础知识/第7讲 一元函数微分学的应用(三) 物理应用与经济应用.html',
    'd:/学习/效率/数学/高数基础知识/第8讲 一元函数积分学的概念与性质.html',
    'd:/学习/效率/数学/高数基础知识/第9讲 一元函数积分学的计算.html',
    'd:/学习/效率/数学/高数基础知识/第10讲 一元函数积分学的应用(一).html',
    'd:/学习/效率/数学/高数基础知识/第11讲：多元函数积分学的应用(二)——积分等式与积分不等式.html',
    'd:/学习/效率/数学/高数基础知识/第12讲：一元函数积分学的应用(三).html',
    'd:/学习/效率/数学/高数基础知识/第13讲 多元函数微分学.html',
    'd:/学习/效率/数学/高数基础知识/第14讲 二重积分.html',
    'd:/学习/效率/数学/高数基础知识/第15讲 微分方程.html',
    'd:/学习/效率/数学/高数基础知识/第16讲 无穷级数.html',
    'd:/学习/效率/数学/高数基础知识/第17讲 多元函数积分学的预备知识.html',
    'd:/学习/效率/数学/高数基础知识/第18讲 多元函数积分学.html'
  ]
}