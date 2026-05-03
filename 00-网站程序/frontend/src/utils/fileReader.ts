// 读取本地HTML文件的工具函数
export async function readHtmlFile(filePath: string): Promise<string> {
  try {
    // 在浏览器环境中，我们需要通过其他方式获取文件内容
    // 这里模拟读取过程
    
    // 实际应用中，可以通过以下方式获取文件：
    // 1. File API (用户上传)
    // 2. Fetch API (从服务器获取)
    // 3. Node.js fs模块 (服务器端)
    
    console.log(`尝试读取文件: ${filePath}`)
    
    // 模拟返回文件内容
    return `<html><body>模拟文件内容</body></html>`
  } catch (error) {
    console.error('读取文件失败:', error)
    throw error
  }
}

// 获取所有习题文件路径
export function getAllExerciseFiles(): string[] {
  // 模拟文件路径列表
  return [
    'd:/学习/效率/数学/高数基础知识/第1讲 函数、极限与连续 题型分类练习.html',
    'd:/学习/效率/数学/高数基础知识/第2讲 导数与微分、中值定理 题型分类练习.html',
    'd:/学习/效率/数学/高数基础知识/第3讲 一元函数积分学 题型分类练习.html',
    'd:/学习/效率/数学/高数基础知识/第4讲 多元函数微分学 题型分类练习.html',
    'd:/学习/效率/数学/高数基础知识/第5讲 多元函数积分学 题型分类练习.html',
    'd:/学习/效率/数学/高数基础知识/第6讲 无穷级数 题型分类练习.html'
  ]
}

// 从文件路径提取文件名
export function getFileNameFromPath(filePath: string): string {
  return filePath.split('/').pop()?.split('\\').pop() || ''
}

// 检查文件是否存在（模拟）
export async function fileExists(filePath: string): Promise<boolean> {
  // 在实际应用中，这里应该检查文件系统
  // 现在我们简单地认为所有预定义的文件都存在
  const exerciseFiles = getAllExerciseFiles()
  return exerciseFiles.includes(filePath)
}