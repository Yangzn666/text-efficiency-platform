
// 2026-05-05 英语语法学习记录 - 自动注入脚本
(function() {
  const newRecords = [
  {
    "id": "record_1778071170496_grammar_session1",
    "date": "2026-05-05",
    "subject": "英语",
    "duration": 25,
    "content": "虚拟语气基础学习：掌握三种基本形式（与现在/过去/将来事实相反）。理解时态倒退规律：用时间距离表达现实距离。学习特殊句型：wish后、suggest/demand后、It's time后的虚拟语气规则。掌握倒装结构：Had/Should/Were提前省略if的用法。",
    "type": "study",
    "createdAt": "2026-05-05T10:30:00.000Z"
  },
  {
    "id": "record_1778071170496_grammar_session2",
    "date": "2026-05-05",
    "subject": "英语",
    "duration": 25,
    "content": "虚拟语气实战练习：完成15道填空题（正确率约70%）。掌握与现在/过去/将来事实相反的基本结构。需要加强：不规则动词变化（wake-woken, speak-spoke, leave-left, catch-caught, lose-lost）、固定搭配（listen to, advice不可数）。",
    "type": "practice",
    "createdAt": "2026-05-05T11:00:00.000Z"
  },
  {
    "id": "record_1778071170496_grammar_session3",
    "date": "2026-05-05",
    "subject": "英语",
    "duration": 25,
    "content": "虚拟语气选择题和改错题：选择题5题（正确率60%），改错题5题（正确率60%）。薄弱点：suggest后应用(should)+原形而非过去式；It's time后用过去式而非should；倒装结构中had后接过去分词known而非knew。",
    "type": "practice",
    "createdAt": "2026-05-05T11:30:00.000Z"
  },
  {
    "id": "record_1778071170496_grammar_session4",
    "date": "2026-05-05",
    "subject": "英语",
    "duration": 25,
    "content": "虚拟语气翻译练习：完成5道中译英题目。掌握混合虚拟语气（if从句过去+主句现在）。常见错误：wish后用过去分词spoken错误，应为spoke或could speak；advice是不可数名词无复数；listen必须加to。总学习时长100分钟。",
    "type": "practice",
    "createdAt": "2026-05-05T12:00:00.000Z"
  }
];
  
  try {
    // 获取现有记录
    const studyRecords = JSON.parse(localStorage.getItem('studyRecords') || '[]');
    
    // 合并新记录
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
    subjectProgress['英语'].lastStudyDate = '2026-05-05';
    
    // 计算本周英语学习时间
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyEnglishTime = updatedRecords
      .filter(r => r.subject === '英语' && new Date(r.date) >= oneWeekAgo)
      .reduce((sum, r) => sum + r.duration, 0);
    subjectProgress['英语'].completionRate = Math.min(100, (weeklyEnglishTime / 300) * 100);
    
    localStorage.setItem('subjectProgress', JSON.stringify(subjectProgress));
    
    console.log('✅ 学习记录已成功写入！');
    console.log('📊 今日英语学习统计：');
    console.log('  ⏰ 学习时段：18:30-18:55, 19:00-19:25, 19:30-19:55, 20:00-20:25');
    console.log('  📈 总时长：100分钟（1小时40分钟）');
    console.log('  📚 学习内容：虚拟语气系统学习');
    console.log('');
    console.log('💡 AI建议：');
    console.log('  1️⃣  加强不规则动词记忆');
    console.log('  2️⃣  巩固特殊句型规则');
    console.log('  3️⃣  注意固定搭配');
    console.log('  4️⃣  明天学习：定语从句');
    console.log('');
    console.log('🔄 请刷新页面查看最新进度');
    
    return true;
  } catch (error) {
    console.error('❌ 写入失败:', error);
    return false;
  }
})();
