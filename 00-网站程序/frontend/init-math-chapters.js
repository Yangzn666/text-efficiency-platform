import { useMathReinforcementStore } from './src/stores/mathReinforcement'
import type { ReinforcementTopic } from './src/stores/mathReinforcement'

const store = useMathReinforcementStore()

// 强化阶段完整章节结构
const chapterStructure = [
  {
    chapter: '第一章 函数 极限 连续',
    hours: 10,
    topics: [
      { id: 'ch1-functions', topicName: '函数 极限 连续', questionTypes: ['概念题', '计算题', '综合题'] }
    ]
  },
  {
    chapter: '第二章 一元函数微分学',
    hours: 8,
    topics: [
      { id: 'ch2-derivative', topicName: '一元函数微分学', questionTypes: ['概念题', '计算题', '证明题', '综合题'] }
    ]
  },
  {
    chapter: '第三章 一元函数积分学',
    hours: 8,
    topics: [
      { id: 'ch3-integral', topicName: '一元函数积分学', questionTypes: ['计算题', '应用题', '证明题'] }
    ]
  },
  {
    chapter: '第四章 常微分方程',
    hours: 2,
    topics: [
      { id: 'ch4-ode', topicName: '常微分方程', questionTypes: ['计算题', '应用题'] }
    ]
  },
  {
    chapter: '第五章 多元函数微分学',
    hours: 5,
    topics: [
      { id: 'ch5-multivar-diff', topicName: '多元函数微分学', questionTypes: ['概念题', '计算题', '综合题'] }
    ]
  },
  {
    chapter: '第六章 二重积分',
    hours: 3,
    topics: [
      { id: 'ch6-double-integral', topicName: '二重积分', questionTypes: ['计算题', '应用题'] }
    ]
  },
  {
    chapter: '第七章 无穷级数',
    hours: 5,
    topics: [
      { id: 'ch7-series', topicName: '无穷级数', questionTypes: ['概念题', '计算题', '证明题'] }
    ]
  },
  {
    chapter: '第八章 空间解析几何及其应用',
    hours: 1,
    topics: [
      { id: 'ch8-geometry', topicName: '空间解析几何及其应用', questionTypes: ['计算题', '应用题'] }
    ]
  },
  {
    chapter: '第九章 多元积分学及其应用',
    hours: 4,
    topics: [
      { id: 'ch9-multivar-integral', topicName: '多元积分学及其应用', questionTypes: ['计算题', '应用题', '综合题'] }
    ]
  }
]

// 检查并初始化知识点
chapterStructure.forEach(chapter => {
  chapter.topics.forEach(topic => {
    const exists = store.topics.find(t => t.id === topic.id)
    
    if (!exists) {
      console.log(`创建知识点: ${topic.topicName}`)
      store.createTopic({
        id: topic.id,
        topicName: topic.topicName,
        subject: '高等数学',
        chapter: chapter.chapter,
        questionTypes: topic.questionTypes,
        importanceLevel: 'high',
        estimatedStudyTime: chapter.hours * 3, // 学时转为分钟
        actualStudyTime: 0,
        lectureCount: 0,
        practiceCount: 0,
        masteryLevel: 0,
        masteryDetails: {
          conceptUnderstand: 0,
          methodMaster: 0,
          calculationSpeed: 0,
          comprehensiveAbility: 0
        },
        wrongProblemCount: 0,
        notes: `# ${topic.topicName}

## 本章内容概要

> 本章笔记待补充...

## 核心知识点

### 1. 基本概念
- 待补充

### 2. 重要公式
- 待补充

### 3. 解题方法
- 待补充

### 4. 典型例题
- 待补充

### 5. 易错点总结
- 待补充

## 学习建议

1. 重点掌握基本概念和公式
2. 大量练习典型题型
3. 总结解题思路和技巧
4. 注意常见错误和陷阱

---
*最后更新: ${new Date().toLocaleDateString('zh-CN')}*
`,
        studyRecords: [],
        nextReviewDate: new Date().toISOString().split('T')[0],
        needsSpecialTraining: false
      })
    }
  })
})

console.log('✅ 高数强化章节框架已创建！')
console.log(`共 ${chapterStructure.length} 章，${chapterStructure.reduce((sum, ch) => sum + ch.topics.length, 0)} 个知识点`)
console.log(' 可以在 MathNoteViewer 中查看和编辑笔记')
