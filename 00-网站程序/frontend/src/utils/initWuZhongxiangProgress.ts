/**
 * 初始化武忠祥高等数学强化阶段进度
 * 根据用户提供的学时数据计算进度
 */

// import { useMathReinforcementStore } from '@/stores/mathReinforcement'

export function initWuZhongxiangAdvancedMath() {
  // const store = useMathReinforcementStore()

  // 武忠祥高等数学强化阶段课程总学时
  const totalHours = 46 // 10+8+8+2+5+3+5+1+4 = 46学时

  // 根据用户实际情况计算已完成学时
  // 用户需要根据实际听课情况填写已完成学时
  const completedHours = {
    '第一章 函数 极限 连续': 10,    // 已完成10学时
    '第二章 一元函数微分学': 8,     // 已完成8学时
    '第三章 一元函数积分学': 8,     // 已完成8学时
    '第四章 常微分方程': 2,         // 已完成2学时
    '第五章 多元函数微分学': 5,     // 已完成5学时
    '第六章 二重积分': 3,           // 已完成3学时
    '第七章 无穷级数': 5,           // 已完成5学时
    '第八章 空间解析几何及其应用': 1, // 已完成1学时
    '第九章 多元积分学及其应用': 4   // 已完成4学时
  }

  // 检查哪些章节已完成
  const chapters = Object.keys(completedHours)
  const completedChapters = chapters.filter((chapter: string) => completedHours[chapter as keyof typeof completedHours] > 0)
  
  console.log('=== 武忠祥高等数学强化阶段进度 ===')
  console.log(`总学时: ${totalHours}学时`)
  console.log(`已完成章节: ${completedChapters.length}/${chapters.length}`)
  console.log('完成章节列表:', completedChapters)
  
  // 计算整体进度百分比
  const progressPercentage = (completedChapters.length / chapters.length * 100).toFixed(1)
  console.log(`整体进度: ${progressPercentage}%`)
  
  return {
    totalHours,
    completedChapters,
    progressPercentage
  }
}

/**
 * 初始化方浩概率论强化阶段进度
 */
export function initFangHaoProbability() {
  // const store = useMathReinforcementStore()

  // 方浩概率论强化阶段课程总学时
  const totalHours = 21 // 总学时
  
  // 用户已完成学时
  const completedHours = 9 // 用户已听了9小时
  
  // 概率论总共6讲
  const totalLectures = 6
  
  // 计算进度
  const progressPercentage = (completedHours / totalHours * 100).toFixed(1)
  
  // 估算已完成讲数(假设每讲学时均匀分布)
  const hoursPerLecture = totalHours / totalLectures // 3.5学时/讲
  const completedLectures = Math.floor(completedHours / hoursPerLecture)
  
  console.log('=== 方浩概率论强化阶段进度 ===')
  console.log(`总学时: ${totalHours}学时`)
  console.log(`已完成: ${completedHours}学时`)
  console.log(`总讲数: ${totalLectures}讲`)
  console.log(`已完成讲数: 约${completedLectures}讲`)
  console.log(`整体进度: ${progressPercentage}%`)
  
  return {
    totalHours,
    completedHours,
    totalLectures,
    completedLectures,
    progressPercentage
  }
}

/**
 * 一键初始化所有进度数据
 */
export function initAllMathProgress() {
  console.log('🎯 开始初始化数学强化阶段进度...\n')
  
  // 初始化高等数学
  const advancedMath = initWuZhongxiangAdvancedMath()
  console.log('')
  
  // 初始化概率论
  const probability = initFangHaoProbability()
  console.log('')
  
  // 总结
  console.log('=== 数学强化阶段总体进度 ===')
  console.log(`高等数学(武忠祥): ${advancedMath.progressPercentage}%`)
  console.log(`概率论(方浩): ${probability.progressPercentage}%`)
  console.log(`线性代数: 待补充`)
  
  return {
    advancedMath,
    probability
  }
}

// 导出到全局,方便在控制台调用
if (typeof window !== 'undefined') {
  (window as any).initMathProgress = initAllMathProgress
  console.log(' 在控制台输入 initMathProgress() 即可初始化进度数据')
}
