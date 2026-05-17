/**
 * 基于用户真实学习进度创建个性化学习路径
 * 
 * 使用方法：
 * 1. 打开浏览器开发者工具（F12）
 * 2. 切换到Console标签
 * 3. 复制粘贴此文件全部内容并执行
 */

console.log('🚀 开始创建个性化学习路径...\n')

// 等待Vue应用加载
setTimeout(async () => {
  try {
    // 动态导入store
    const module = await import('/src/stores/learningPath.ts')
    const learningPathStore = module.useLearningPathStore()
    
    console.log('✅ Store加载成功\n')
    
    // ========== 数学一学习路径 ==========
    console.log('📐 创建数学一学习路径...')
    
    const mathPathStructure = {
      name: '数学一强化冲刺计划',
      description: '基于当前进度：高数和线代基础已完成，概率论强化进行中',
      chapters: [
        {
          title: '概率论强化（剩余章节）',
          order: 1,
          estimatedTime: 360, // 6小时，剩余6章
          dependencies: [],
          tasks: [
            { title: '第4章：多维随机变量', type: 'reading', estimatedTime: 90, priority: 'high' },
            { title: '第5章：数字特征', type: 'reading', estimatedTime: 60, priority: 'high' },
            { title: '第6章：大数定律和中心极限定理', type: 'reading', estimatedTime: 45, priority: 'medium' },
            { title: '第7章：数理统计基本概念', type: 'reading', estimatedTime: 60, priority: 'high' },
            { title: '第8章：参数估计', type: 'reading', estimatedTime: 75, priority: 'high' },
            { title: '第9章：假设检验', type: 'reading', estimatedTime: 60, priority: 'medium' }
          ]
        },
        {
          title: '高等数学强化复习',
          order: 2,
          estimatedTime: 480, // 8小时
          dependencies: ['1'],
          tasks: [
            { title: '一元函数微积分综合', type: 'review', estimatedTime: 120, priority: 'high' },
            { title: '多元函数微积分', type: 'review', estimatedTime: 120, priority: 'high' },
            { title: '无穷级数', type: 'review', estimatedTime: 90, priority: 'high' },
            { title: '常微分方程', type: 'review', estimatedTime: 90, priority: 'medium' },
            { title: '向量代数和空间解析几何', type: 'review', estimatedTime: 60, priority: 'medium' }
          ]
        },
        {
          title: '线性代数强化复习',
          order: 3,
          estimatedTime: 240, // 4小时
          dependencies: ['1'],
          tasks: [
            { title: '行列式和矩阵', type: 'review', estimatedTime: 60, priority: 'high' },
            { title: '向量组和线性方程组', type: 'review', estimatedTime: 60, priority: 'high' },
            { title: '特征值和特征向量', type: 'review', estimatedTime: 60, priority: 'high' },
            { title: '二次型', type: 'review', estimatedTime: 60, priority: 'medium' }
          ]
        },
        {
          title: '真题训练（近10年）',
          order: 4,
          estimatedTime: 600, // 10小时
          dependencies: ['1', '2', '3'],
          tasks: [
            { title: '2015-2019年真题第一遍', type: 'exercise', estimatedTime: 300, priority: 'high' },
            { title: '错题整理与分析', type: 'review', estimatedTime: 120, priority: 'high' },
            { title: '2020-2024年真题第二遍', type: 'exercise', estimatedTime: 180, priority: 'high' }
          ]
        }
      ]
    }
    
    await learningPathStore.createLearningPath('数学一', mathPathStructure.chapters)
    console.log('✅ 数学一路径创建成功\n')
    
    // ========== 408专业课学习路径 ==========
    console.log('💻 创建408专业课学习路径...')
    
    const cs408PathStructure = {
      name: '408计算机专业全程复习计划',
      description: '基于当前进度：数据结构已完成，组成原理55%，操作系统和网络未开始',
      chapters: [
        {
          title: '计算机组成原理（剩余章节）',
          order: 1,
          estimatedTime: 240, // 4小时，剩余4章
          dependencies: [],
          tasks: [
            { title: '第6章：指令系统', type: 'reading', estimatedTime: 45, priority: 'high' },
            { title: '第7章：中央处理器CPU', type: 'reading', estimatedTime: 75, priority: 'high' },
            { title: '第8章：总线', type: 'reading', estimatedTime: 45, priority: 'medium' },
            { title: '第9章：I/O系统', type: 'reading', estimatedTime: 60, priority: 'medium' }
          ]
        },
        {
          title: '操作系统（全新学习）',
          order: 2,
          estimatedTime: 300, // 5小时
          dependencies: ['1'],
          tasks: [
            { title: '进程管理', type: 'reading', estimatedTime: 90, priority: 'high' },
            { title: '内存管理', type: 'reading', estimatedTime: 75, priority: 'high' },
            { title: '文件管理', type: 'reading', estimatedTime: 60, priority: 'medium' },
            { title: 'I/O管理', type: 'reading', estimatedTime: 45, priority: 'medium' },
            { title: '综合练习', type: 'practice', estimatedTime: 60, priority: 'high' }
          ]
        },
        {
          title: '计算机网络（全新学习）',
          order: 3,
          estimatedTime: 300, // 5小时
          dependencies: ['2'],
          tasks: [
            { title: '物理层和数据链路层', type: 'reading', estimatedTime: 60, priority: 'medium' },
            { title: '网络层', type: 'reading', estimatedTime: 90, priority: 'high' },
            { title: '传输层', type: 'reading', estimatedTime: 75, priority: 'high' },
            { title: '应用层', type: 'reading', estimatedTime: 45, priority: 'medium' },
            { title: '综合练习', type: 'practice', estimatedTime: 60, priority: 'high' }
          ]
        },
        {
          title: '数据结构复习巩固',
          order: 4,
          estimatedTime: 180, // 3小时
          dependencies: [],
          tasks: [
            { title: '线性表和栈队列', type: 'review', estimatedTime: 45, priority: 'medium' },
            { title: '树和图', type: 'review', estimatedTime: 60, priority: 'high' },
            { title: '查找和排序', type: 'review', estimatedTime: 60, priority: 'high' },
            { title: '综合练习', type: 'practice', estimatedTime: 45, priority: 'high' }
          ]
        },
        {
          title: '真题训练（近5年）',
          order: 5,
          estimatedTime: 480, // 8小时
          dependencies: ['1', '2', '3', '4'],
          tasks: [
            { title: '2020-2024年真题第一遍', type: 'exercise', estimatedTime: 240, priority: 'high' },
            { title: '错题整理与知识点回顾', type: 'review', estimatedTime: 120, priority: 'high' },
            { title: '重点难点专项突破', type: 'practice', estimatedTime: 120, priority: 'high' }
          ]
        }
      ]
    }
    
    await learningPathStore.createLearningPath('408计算机科学综合', cs408PathStructure.chapters)
    console.log('✅ 408路径创建成功\n')
    
    // ========== 英语一学习路径 ==========
    console.log('📖 创建英语一学习路径...')
    
    const englishPathStructure = {
      name: '英语一强化提升计划',
      description: '基于当前进度：词汇80%，语法40%，真题0%',
      chapters: [
        {
          title: '词汇巩固（最后20%）',
          order: 1,
          estimatedTime: 120, // 2小时
          dependencies: [],
          tasks: [
            { title: '低频词汇突破', type: 'reading', estimatedTime: 60, priority: 'medium' },
            { title: '词汇复习巩固', type: 'review', estimatedTime: 60, priority: 'high' }
          ]
        },
        {
          title: '语法长难句强化',
          order: 2,
          estimatedTime: 180, // 3小时
          dependencies: ['1'],
          tasks: [
            { title: '从句深度分析', type: 'reading', estimatedTime: 60, priority: 'high' },
            { title: '特殊句式掌握', type: 'reading', estimatedTime: 60, priority: 'high' },
            { title: '长难句拆解练习', type: 'practice', estimatedTime: 60, priority: 'high' }
          ]
        },
        {
          title: '阅读理解专项',
          order: 3,
          estimatedTime: 360, // 6小时
          dependencies: ['1', '2'],
          tasks: [
            { title: '阅读技巧与方法论', type: 'reading', estimatedTime: 90, priority: 'high' },
            { title: '真题阅读精练（20篇）', type: 'practice', estimatedTime: 180, priority: 'high' },
            { title: '错题分析与总结', type: 'review', estimatedTime: 90, priority: 'high' }
          ]
        },
        {
          title: '翻译与完型填空',
          order: 4,
          estimatedTime: 180, // 3小时
          dependencies: ['1', '2'],
          tasks: [
            { title: '翻译技巧与练习', type: 'practice', estimatedTime: 90, priority: 'medium' },
            { title: '完型填空训练', type: 'practice', estimatedTime: 60, priority: 'medium' },
            { title: '新题型训练', type: 'practice', estimatedTime: 60, priority: 'medium' }
          ]
        },
        {
          title: '写作专项',
          order: 5,
          estimatedTime: 240, // 4小时
          dependencies: ['1', '2', '3'],
          tasks: [
            { title: '小作文模板与范文', type: 'practice', estimatedTime: 90, priority: 'high' },
            { title: '大作文结构与素材', type: 'practice', estimatedTime: 90, priority: 'high' },
            { title: '写作批改与修改', type: 'review', estimatedTime: 60, priority: 'high' }
          ]
        },
        {
          title: '真题模考冲刺',
          order: 6,
          estimatedTime: 300, // 5小时
          dependencies: ['1', '2', '3', '4', '5'],
          tasks: [
            { title: '近5年真题模考', type: 'exercise', estimatedTime: 180, priority: 'high' },
            { title: '考前重点复习', type: 'review', estimatedTime: 120, priority: 'high' }
          ]
        }
      ]
    }
    
    await learningPathStore.createLearningPath('英语一', englishPathStructure.chapters)
    console.log('✅ 英语一路径创建成功\n')
    
    // ========== 政治学习路径 ==========
    console.log('📕 创建政治学习路径...')
    
    const politicsPathStructure = {
      name: '政治冲刺复习计划（7月启动）',
      description: '计划7月开始，全面覆盖五部分内容',
      chapters: [
        {
          title: '马克思主义基本原理',
          order: 1,
          estimatedTime: 180, // 3小时
          dependencies: [],
          tasks: [
            { title: '唯物论和辩证法', type: 'reading', estimatedTime: 60, priority: 'high' },
            { title: '认识论和历史观', type: 'reading', estimatedTime: 60, priority: 'high' },
            { title: '政治经济学', type: 'reading', estimatedTime: 45, priority: 'medium' },
            { title: '科学社会主义', type: 'reading', estimatedTime: 30, priority: 'medium' }
          ]
        },
        {
          title: '毛泽东思想和中国特色社会主义理论体系',
          order: 2,
          estimatedTime: 240, // 4小时
          dependencies: ['1'],
          tasks: [
            { title: '毛泽东思想', type: 'reading', estimatedTime: 60, priority: 'high' },
            { title: '邓小平理论', type: 'reading', estimatedTime: 45, priority: 'medium' },
            { title: '三个代表和科学发展观', type: 'reading', estimatedTime: 45, priority: 'medium' },
            { title: '新时代中国特色社会主义思想', type: 'reading', estimatedTime: 60, priority: 'high' },
            { title: '综合练习', type: 'practice', estimatedTime: 60, priority: 'high' }
          ]
        },
        {
          title: '中国近现代史纲要',
          order: 3,
          estimatedTime: 150, // 2.5小时
          dependencies: [],
          tasks: [
            { title: '旧民主主义革命时期', type: 'reading', estimatedTime: 45, priority: 'medium' },
            { title: '新民主主义革命时期', type: 'reading', estimatedTime: 45, priority: 'high' },
            { title: '社会主义革命和建设时期', type: 'reading', estimatedTime: 45, priority: 'medium' },
            { title: '改革开放新时期', type: 'reading', estimatedTime: 30, priority: 'medium' }
          ]
        },
        {
          title: '思想道德修养与法律基础',
          order: 4,
          estimatedTime: 120, // 2小时
          dependencies: [],
          tasks: [
            { title: '思想道德部分', type: 'reading', estimatedTime: 60, priority: 'medium' },
            { title: '法律基础部分', type: 'reading', estimatedTime: 60, priority: 'medium' }
          ]
        },
        {
          title: '形势与政策',
          order: 5,
          estimatedTime: 90, // 1.5小时
          dependencies: [],
          tasks: [
            { title: '年度热点事件', type: 'reading', estimatedTime: 45, priority: 'high' },
            { title: '重要会议精神', type: 'reading', estimatedTime: 45, priority: 'high' }
          ]
        },
        {
          title: '选择题强化训练',
          order: 6,
          estimatedTime: 180, // 3小时
          dependencies: ['1', '2', '3', '4', '5'],
          tasks: [
            { title: '肖秀荣1000题', type: 'exercise', estimatedTime: 120, priority: 'high' },
            { title: '错题整理与背诵', type: 'review', estimatedTime: 60, priority: 'high' }
          ]
        },
        {
          title: '分析题背诵冲刺',
          order: 7,
          estimatedTime: 180, // 3小时
          dependencies: ['1', '2', '3', '4', '5'],
          tasks: [
            { title: '肖四肖八背诵', type: 'reading', estimatedTime: 120, priority: 'high' },
            { title: '答题技巧训练', type: 'practice', estimatedTime: 60, priority: 'high' }
          ]
        }
      ]
    }
    
    await learningPathStore.createLearningPath('政治', politicsPathStructure.chapters)
    console.log('✅ 政治路径创建成功\n')
    
    console.log('\n🎉 所有学习路径创建完成！')
    console.log('\n📊 创建的路径：')
    console.log('  1. 数学一强化冲刺计划')
    console.log('  2. 408计算机专业全程复习计划')
    console.log('  3. 英语一强化提升计划')
    console.log('  4. 政治冲刺复习计划')
    console.log('\n💡 提示：')
    console.log('  - 打开"学习路径"页面查看')
    console.log('  - 点击"路径可视化"标签页')
    console.log('  - 选择科目查看详细计划')
    console.log('  - 可以开始测评获取更个性化的建议')
    
  } catch (error) {
    console.error('❌ 创建学习路径失败:', error)
    console.log('\n请确保：')
    console.log('1. 已经在浏览器中打开了网站')
    console.log('2. 已经导航到任意页面')
    console.log('3. 然后再次运行此脚本')
  }
}, 1000)
