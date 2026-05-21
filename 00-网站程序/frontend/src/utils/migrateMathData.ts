/**
 * 数据迁移脚本
 * 从旧的 advancedMath.ts 和 math.ts 迁移数据到新的 mathReinforcement.ts
 */

import { useAdvancedMathStore } from '@/stores/advancedMath'
import { useMathStore } from '@/stores/math'
import { useMathReinforcementStore } from '@/stores/mathReinforcement'

export async function migrateToReinforcementSystem() {
  console.log('🔄 开始迁移数据到强化学习系统...')
  
  const oldMathStore = useAdvancedMathStore()
  const oldMathStore2 = useMathStore()
  const newStore = useMathReinforcementStore()
  
  let migratedCount = 0
  
  try {
    // 1. 迁移知识点
    if (oldMathStore.topics && oldMathStore.topics.length > 0) {
      console.log(`📚 发现 ${oldMathStore.topics.length} 个旧知识点`)
      
      for (const oldTopic of oldMathStore.topics) {
        // 确定科目
        let subject: '高等数学' | '线性代数' | '概率论' = '高等数学'
        if (oldTopic.chapter.includes('线代') || oldTopic.chapter.includes('矩阵') || oldTopic.chapter.includes('向量')) {
          subject = '线性代数'
        } else if (oldTopic.chapter.includes('概率') || oldTopic.chapter.includes('统计')) {
          subject = '概率论'
        }
        
        // 创建新知识点
        await newStore.addTopic({
          subject,
          chapter: oldTopic.chapter,
          topicName: oldTopic.title,
          questionTypes: [],
          lectureTime: 0,
          practiceTime: 0,
          masteryLevel: oldTopic.mastered ? 80 : 30,
          masteryDetails: {
            conceptUnderstand: oldTopic.mastered ? 80 : 40,
            methodMaster: oldTopic.mastered ? 75 : 35,
            calculationSpeed: oldTopic.mastered ? 70 : 30,
            comprehensiveAbility: oldTopic.mastered ? 65 : 25
          },
          isKeyExample: false,
          reviewRound: oldTopic.mastered ? 1 : 0,
          needsSpecialTraining: !oldTopic.mastered
        })
        
        migratedCount++
      }
      
      console.log(`✅ 成功迁移 ${migratedCount} 个知识点`)
    }
    
    // 2. 迁移错题(如果有)
    if (oldMathStore2.wrongProblems && oldMathStore2.wrongProblems.length > 0) {
      console.log(`❌ 发现 ${oldMathStore2.wrongProblems.length} 道旧错题`)
      
      for (const oldWrong of oldMathStore2.wrongProblems) {
        await newStore.addWrongProblem({
          topicId: '', // 需要手动关联
          problemSource: '讲义例题',
          questionType: '未知',
          difficulty: '中等',
          mistakeType: ['概念不清'],
          mistakeAnalysis: oldWrong.correction || '未记录',
          correctSolution: oldWrong.correction || '未记录',
          keyTechnique: '',
          alternativeMethods: [],
          tags: [],
          priority: 'medium'
        })
      }
      
      console.log(`✅ 成功迁移错题`)
    }
    
    // 3. 初始化一些默认的专题突破
    const defaultTrainings = [
      {
        name: '微分中值定理专题',
        subject: '高等数学',
        description: '罗尔定理、拉格朗日中值定理、柯西中值定理的综合应用',
        videoSource: 'B站众多UP主',
        estimatedTime: 5
      },
      {
        name: '积分不等式专题',
        subject: '高等数学',
        description: '各类积分不等式的证明技巧',
        videoSource: '武忠祥/方浩',
        estimatedTime: 4
      },
      {
        name: '无穷级数综合题专题',
        subject: '高等数学',
        description: '级数判敛、幂级数展开、傅里叶级数',
        videoSource: '方浩',
        estimatedTime: 6
      },
      {
        name: '曲线曲面积分专题',
        subject: '高等数学',
        description: '格林公式、高斯公式、斯托克斯公式',
        videoSource: '武忠祥+张宇',
        estimatedTime: 5
      },
      {
        name: '特征值特征向量专题',
        subject: '线性代数',
        description: '特征值计算、相似对角化、二次型',
        videoSource: '李永乐',
        estimatedTime: 4
      },
      {
        name: '多维随机变量专题',
        subject: '概率论',
        description: '二维随机变量分布、边缘分布、条件分布',
        videoSource: '方浩',
        estimatedTime: 5
      }
    ]
    
    for (const training of defaultTrainings) {
      await newStore.addSpecialTraining({
        ...training,
        materialLinks: []
      })
    }
    
    console.log(`✅ 已添加 ${defaultTrainings.length} 个默认专题`)
    
    console.log('🎉 数据迁移完成!')
    return {
      success: true,
      migratedTopics: migratedCount,
      message: '数据迁移成功'
    }
    
  } catch (error) {
    console.error('❌ 数据迁移失败:', error)
    return {
      success: false,
      migratedTopics: migratedCount,
      error: error
    }
  }
}

// 导出一个便捷函数,可以在控制台直接调用
if (typeof window !== 'undefined') {
  (window as any).migrateMathData = migrateToReinforcementSystem
}
