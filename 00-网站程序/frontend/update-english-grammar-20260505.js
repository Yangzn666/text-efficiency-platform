// @ts-nocheck
// 2026-05-05 英语语法学习记录更新脚本
// 在浏览器控制台中运行此脚本以保存学习记录

(async function updateEnglishGrammarProgress() {
  try {
    const studyRecords = JSON.parse(localStorage.getItem('studyRecords') || '[]');
    const today = '2026-05-05';
    const timestamp = Date.now();
    
    // 创建今天的学习记录（4个时间段，每个25分钟）
    const newRecords = [
      {
        id: `record_${timestamp}_grammar_session1`,
        date: today,
        subject: '英语',
        duration: 25,
        content: '虚拟语气基础学习：掌握三种基本形式（与现在/过去/将来事实相反）。理解时态倒退规律：用时间距离表达现实距离。学习特殊句型：wish后、suggest/demand后、虚拟语气规则。掌握倒装结构：Had/Should/Were提前省略if的用法。',
        type: 'study',
        createdAt: new Date('2026-05-05T18:30:00').toISOString()
      },
      {
        id: `record_${timestamp}_grammar_session2`,
        date: today,
        subject: '英语',
        duration: 25,
        content: '虚拟语气实战练习：完成15道填空题（正确率约70%）。掌握与现在/过去/将来事实相反的基本结构。需要加强：不规则动词变化（wake-woken, speak-spoke, leave-left, catch-caught, lose-lost）、固定搭配（listen to, advice不可数）。',
        type: 'practice',
        createdAt: new Date('2026-05-05T19:00:00').toISOString()
      },
      {
        id: `record_${timestamp}_grammar_session3`,
        date: today,
        subject: '英语',
        duration: 25,
        content: '虚拟语气选择题和改错题：选择题5题（正确率60%），改错题5题（正确率60%）。薄弱点：suggest后应用(should)+原形而非过去式；特殊句型用过去式而非should；倒装结构中had后接过去分词known而非knew。',
        type: 'practice',
        createdAt: new Date('2026-05-05T19:30:00').toISOString()
      },
      {
        id: `record_${timestamp}_grammar_session4`,
        date: today,
        subject: '英语',
        duration: 25,
        content: '虚拟语气翻译练习：完成5道中译英题目。掌握混合虚拟语气（if从句过去+主句现在）。常见错误：wish后用过去分词spoken错误，应为spoke或could speak；advice是不可数名词无复数；listen必须加to。总学习时长100分钟。',
        type: 'practice',
        createdAt: new Date('2026-05-05T20:00:00').toISOString()
      }
    ];
    
    // 合并到现有记录中
    const updatedRecords = [...studyRecords, ...newRecords];
    
    // 保存到localStorage
    localStorage.setItem('studyRecords', JSON.stringify(updatedRecords));
    
    // 更新科目进度
    const subjectProgress = JSON.parse(localStorage.getItem('subjectProgress') || '{}');
    if (!subjectProgress['英语']) {
      subjectProgress['英语'] = {
        totalTime: 0,
        lastStudyDate: '',
        weeklyGoal: 300,
        completionRate: 0
      };
    }
    subjectProgress['英语'].totalTime += 100;
    subjectProgress['英语'].lastStudyDate = today;
    
    // 计算本周英语学习时间
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyEnglishTime = updatedRecords
      .filter(r => r.subject === '英语' && new Date(r.date) >= oneWeekAgo)
      .reduce((sum, r) => sum + r.duration, 0);
    subjectProgress['英语'].completionRate = Math.min(100, (weeklyEnglishTime / 300) * 100);
    
    localStorage.setItem('subjectProgress', JSON.stringify(subjectProgress));
    
    console.log('✅ 2026-05-05 英语语法学习记录已更新！');
    console.log('📊 今日学习统计：');
    console.log('  ⏰ 学习时段：18:30-18:55, 19:00-19:25, 19:30-19:55, 20:00-20:25');
    console.log('  📈 总时长：100分钟（1小时40分钟）');
    console.log('  📚 学习内容：虚拟语气系统学习');
    console.log('');
    console.log(' 学习详情：');
    console.log('  ✅ 任务2：虚拟语气基础理论（25分钟）');
    console.log('     - 三种基本形式：与现在/过去/将来事实相反');
    console.log('     - 时态倒退规律：用时间距离表达现实距离');
    console.log('     - 特殊句型：wish/suggest等');
    console.log('     - 倒装结构：Had/Should/Were提前');
    console.log('');
    console.log('  ✅ 任务3：实战练习（75分钟）');
    console.log('     - 填空题15题：正确率约70%');
    console.log('     - 选择题5题：正确率60%');
    console.log('     - 改错题5题：正确率60%');
    console.log('     - 翻译题5题：部分有小错误');
    console.log('');
    console.log('💡 AI建议：');
    console.log('  1️⃣  加强不规则动词记忆：制作不规则动词卡片');
    console.log('  2️⃣  巩固特殊句型规则：suggest/demand用(should)+原形');
    console.log('  3️⃣  注意固定搭配：listen to, advice不可数');
    console.log('  4️⃣  明天学习计划：定语从句（关系代词/副词）');
    console.log('');
    console.log('🎯 掌握情况：');
    console.log('  ✅ 很好：基本结构、倒装结构、混合虚拟语气概念');
    console.log('  ⚠️  需加强：不规则动词、固定搭配、特殊句型细节');
    console.log('');
    console.log('📅 请刷新页面查看最新进度');
    
  } catch (error) {
    console.error('❌ 更新失败:', error);
  }
})();
