// 直接在浏览器控制台运行，将学习记录写入正确的存储位置
(function() {
  console.log('🚀 开始注入2026-05-05英语语法学习记录...\n');
  
  const today = '2026-05-05';
  const timestamp = Date.now();
  
  // 创建4条学习记录
  const newRecords = [
    {
      id: `record_${timestamp}_grammar_1`,
      date: today,
      subject: '英语一',
      duration: 25,
      content: '虚拟语气基础学习 - 掌握三种基本形式（与现在/过去/将来事实相反）、时态倒退规律、特殊句型（wish/suggest/It\'s time）、倒装结构',
      type: 'study',
      createdAt: new Date('2026-05-05T18:30:00').toISOString()
    },
    {
      id: `record_${timestamp}_grammar_2`,
      date: today,
      subject: '英语一',
      duration: 25,
      content: '虚拟语气实战练习 - 完成15道填空题（正确率70%），掌握基本结构，需加强不规则动词和固定搭配',
      type: 'practice',
      createdAt: new Date('2026-05-05T19:00:00').toISOString()
    },
    {
      id: `record_${timestamp}_grammar_3`,
      date: today,
      subject: '英语一',
      duration: 25,
      content: '虚拟语气选择题和改错题 - 选择题5题（60%）、改错题5题（60%），薄弱点：suggest规则、It\'s time用法、倒装结构',
      type: 'practice',
      createdAt: new Date('2026-05-05T19:30:00').toISOString()
    },
    {
      id: `record_${timestamp}_grammar_4`,
      date: today,
      subject: '英语一',
      duration: 25,
      content: '虚拟语气翻译练习 - 完成5道中译英，掌握混合虚拟语气，常见错误：wish后用法、advice不可数、listen to搭配',
      type: 'practice',
      createdAt: new Date('2026-05-05T20:00:00').toISOString()
    }
  ];
  
  console.log('📝 准备注入的学习记录：');
  newRecords.forEach((record, index) => {
    console.log(`  ${index + 1}. ${record.createdAt.substring(11, 16)} - ${record.duration}分钟`);
  });
  console.log(`\n📊 总计：${newRecords.reduce((sum, r) => sum + r.duration, 0)}分钟\n`);
  
  try {
    // 方法1：写入 localStorage.studyData（HomeView使用）
    let studyData = JSON.parse(localStorage.getItem('studyData') || '{}');
    if (!studyData.studyRecords) {
      studyData.studyRecords = [];
    }
    
    // 检查是否已经存在
    const alreadyExists = studyData.studyRecords.some(record => 
      record.date === today && 
      record.subject === '英语一' &&
      record.content.includes('虚拟语气')
    );
    
    if (!alreadyExists) {
      studyData.studyRecords.push(...newRecords);
      localStorage.setItem('studyData', JSON.stringify(studyData));
      console.log('✅ 已写入 localStorage.studyData');
    } else {
      console.log('ℹ️  localStorage.studyData 中已存在记录');
    }
    
    // 方法2：写入 localforage 使用的 IndexedDB（studyStore使用）
    // 由于localforage使用IndexedDB，我们需要通过localStorage的fallback来写入
    // localforage会先尝试IndexedDB，如果失败会使用localStorage
    
    // 直接写入 localStorage.studyRecords（localforage的fallback）
    let existingRecords = [];
    try {
      const stored = localStorage.getItem('studyRecords');
      if (stored) {
        existingRecords = JSON.parse(stored);
      }
    } catch (e) {
      console.log('⚠️  无法读取现有studyRecords');
    }
    
    // 检查是否已经存在
    const alreadyInStore = existingRecords.some(record => 
      record.date === today && 
      record.subject === '英语一' &&
      record.content.includes('虚拟语气')
    );
    
    if (!alreadyInStore) {
      existingRecords.push(...newRecords);
      localStorage.setItem('studyRecords', JSON.stringify(existingRecords));
      console.log('✅ 已写入 localStorage.studyRecords');
    } else {
      console.log('ℹ️  localStorage.studyRecords 中已存在记录');
    }
    
    // 更新科目进度
    let subjectProgress = {};
    try {
      const stored = localStorage.getItem('subjectProgress');
      if (stored) {
        subjectProgress = JSON.parse(stored);
      }
    } catch (e) {}
    
    if (!subjectProgress['英语一']) {
      subjectProgress['英语一'] = {
        totalTime: 0,
        lastStudyDate: '',
        weeklyGoal: 300,
        completionRate: 0
      };
    }
    
    subjectProgress['英语一'].totalTime += 100;
    subjectProgress['英语一'].lastStudyDate = today;
    
    // 计算本周完成率
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const allRecords = [...existingRecords, ...studyData.studyRecords];
    const weeklyTime = allRecords
      .filter(r => r.subject === '英语一' && new Date(r.date) >= oneWeekAgo)
      .reduce((sum, r) => sum + r.duration, 0);
    subjectProgress['英语一'].completionRate = Math.min(100, (weeklyTime / 300) * 100);
    
    localStorage.setItem('subjectProgress', JSON.stringify(subjectProgress));
    console.log('✅ 已更新科目进度\n');
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ 注入完成！');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 今日英语学习时长：100分钟');
    console.log('🔄 请刷新页面查看最新数据');
    console.log('💡 如果还是显示0，请按Ctrl+Shift+R强制刷新');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    return true;
  } catch (error) {
    console.error('❌ 注入失败:', error);
    return false;
  }
})();
