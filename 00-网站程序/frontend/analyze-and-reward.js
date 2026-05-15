// 分析学习数据并生成奖励和成就
// 在浏览器控制台中运行此脚本

(function() {
  console.log('🔍 开始分析学习数据...\n');
  
  // 获取心理学数据
  const psychologyData = JSON.parse(localStorage.getItem('psychologyData') || '{}');
  const studyData = JSON.parse(localStorage.getItem('studyData') || '{}');
  const todoData = JSON.parse(localStorage.getItem('todoData') || '{}');
  const attentionData = JSON.parse(localStorage.getItem('attentionData') || '{}');
  
  console.log('📊 当前数据统计:');
  console.log('  - 总积分:', psychologyData.totalPoints || 0);
  console.log('  - 已解锁成就:', (psychologyData.achievements || []).length);
  console.log('  - 连续天数:', (psychologyData.streakInfo || {}).count || 0);
  console.log('  - 学习记录数:', (studyData.studyRecords || []).length);
  console.log('  - 任务完成数:', (todoData.todos || []).filter(t => t.completed).length);
  console.log('');
  
  // 计算学习统计数据
  const studyRecords = studyData.studyRecords || [];
  const todos = todoData.todos || [];
  const completedTodos = todos.filter(t => t.completed);
  
  // 计算总学习时长
  const totalStudyMinutes = studyRecords.reduce((sum, r) => sum + (r.duration || 0), 0);
  const totalStudyHours = Math.round(totalStudyMinutes / 60);
  
  // 计算本周学习时长
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyRecords = studyRecords.filter(r => new Date(r.date) >= oneWeekAgo);
  const weeklyStudyMinutes = weeklyRecords.reduce((sum, r) => sum + (r.duration || 0), 0);
  const weeklyStudyHours = Math.round(weeklyStudyMinutes / 60);
  
  // 计算本月学习时长
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthlyRecords = studyRecords.filter(r => new Date(r.date) >= firstDayOfMonth);
  const monthlyStudyMinutes = monthlyRecords.reduce((sum, r) => sum + (r.duration || 0), 0);
  const monthlyStudyHours = Math.round(monthlyStudyMinutes / 60);
  
  // 统计各科目学习时长
  const subjectStats = {};
  studyRecords.forEach(record => {
    if (!subjectStats[record.subject]) {
      subjectStats[record.subject] = { totalTime: 0, sessions: 0 };
    }
    subjectStats[record.subject].totalTime += record.duration;
    subjectStats[record.subject].sessions += 1;
  });
  
  console.log('📚 学习统计:');
  console.log('  - 总学习时长:', totalStudyHours, '小时');
  console.log('  - 本周学习:', weeklyStudyHours, '小时');
  console.log('  - 本月学习:', monthlyStudyHours, '小时');
  console.log('  - 完成任务:', completedTodos.length, '个');
  console.log('');
  
  console.log('📖 各科目的学习情况:');
  Object.entries(subjectStats).forEach(([subject, stats]) => {
    const hours = Math.round(stats.totalTime / 60);
    console.log(`  - ${subject}: ${hours}小时 (${stats.sessions}次)`);
  });
  console.log('');
  
  // 建议的奖励和成就
  console.log('🎁 基于你的学习情况，建议获得以下奖励:\n');
  
  let suggestedPoints = 0;
  const suggestions = [];
  
  // 1. 学习时长奖励
  if (totalStudyHours >= 10) {
    const points = Math.floor(totalStudyHours * 10);
    suggestedPoints += points;
    suggestions.push({
      reason: `累计学习${totalStudyHours}小时`,
      points: points,
      type: '学习成就'
    });
  }
  
  // 2. 本周学习奖励
  if (weeklyStudyHours >= 20) {
    const points = weeklyStudyHours * 5;
    suggestedPoints += points;
    suggestions.push({
      reason: `本周学习${weeklyStudyHours}小时（高效学习）`,
      points: points,
      type: '周奖励'
    });
  }
  
  // 3. 任务完成奖励
  if (completedTodos.length >= 10) {
    const points = completedTodos.length * 15;
    suggestedPoints += points;
    suggestions.push({
      reason: `完成${completedTodos.length}个任务`,
      points: points,
      type: '任务成就'
    });
  }
  
  // 4. 科目专项奖励
  Object.entries(subjectStats).forEach(([subject, stats]) => {
    const hours = stats.totalTime / 60;
    if (hours >= 5) {
      const points = Math.floor(hours * 8);
      suggestedPoints += points;
      suggestions.push({
        reason: `${subject}深入学习${Math.round(hours)}小时`,
        points: points,
        type: '科目成就'
      });
    }
  });
  
  // 5. 连续学习奖励
  const streakDays = (psychologyData.streakInfo || {}).count || 0;
  if (streakDays >= 7) {
    const points = streakDays * 10;
    suggestedPoints += points;
    suggestions.push({
      reason: `连续学习${streakDays}天`,
      points: points,
      type: '连击奖励'
    });
  }
  
  // 显示建议
  if (suggestions.length > 0) {
    suggestions.forEach((suggestion, index) => {
      console.log(`${index + 1}. ${suggestion.reason}`);
      console.log(`   🏆 类型: ${suggestion.type}`);
      console.log(`   ⭐ 积分: +${suggestion.points}`);
      console.log('');
    });
    
    console.log('💰 建议总积分:', suggestedPoints);
    console.log('');
    
    // 询问是否应用
    console.log('⚠️  要应用这些奖励，请在控制台输入: applyRewards()');
    console.log('');
    
    // 创建应用函数
    window.applyRewards = function() {
      console.log('✅ 正在应用奖励...\n');
      
      // 更新积分
      const currentPoints = psychologyData.totalPoints || 0;
      const newPoints = currentPoints + suggestedPoints;
      psychologyData.totalPoints = newPoints;
      
      // 添加成就
      if (!psychologyData.achievements) {
        psychologyData.achievements = [];
      }
      
      const timestamp = new Date().toISOString();
      
      // 根据学习时长添加成就
      if (totalStudyHours >= 10 && !psychologyData.achievements.find(a => a.id === 'ach_study_hours_10')) {
        psychologyData.achievements.push({
          id: 'ach_study_hours_10',
          title: '📚 学习达人',
          description: `累计学习${totalStudyHours}小时`,
          points: 100,
          unlockedAt: timestamp,
          category: '学习成就'
        });
        console.log('🏆 解锁成就: 学习达人');
      }
      
      if (weeklyStudyHours >= 20 && !psychologyData.achievements.find(a => a.id === 'ach_weekly_intensive')) {
        psychologyData.achievements.push({
          id: 'ach_weekly_intensive',
          title: '⚡ 高强度学习',
          description: `单周学习${weeklyStudyHours}小时`,
          points: 80,
          unlockedAt: timestamp,
          category: '学习成就'
        });
        console.log('🏆 解锁成就: 高强度学习');
      }
      
      if (completedTodos.length >= 10 && !psychologyData.achievements.find(a => a.id === 'ach_todo_master')) {
        psychologyData.achievements.push({
          id: 'ach_todo_master',
          title: '✅ 任务大师',
          description: `完成${completedTodos.length}个任务`,
          points: 90,
          unlockedAt: timestamp,
          category: '任务成就'
        });
        console.log('🏆 解锁成就: 任务大师');
      }
      
      if (streakDays >= 7 && !psychologyData.achievements.find(a => a.id === 'ach_streak_week')) {
        psychologyData.achievements.push({
          id: 'ach_streak_week',
          title: '🔥 一周坚持',
          description: `连续学习${streakDays}天`,
          points: 70,
          unlockedAt: timestamp,
          category: '连击成就'
        });
        console.log('🏆 解锁成就: 一周坚持');
      }
      
      // 保存数据
      localStorage.setItem('psychologyData', JSON.stringify(psychologyData));
      
      console.log('\n✅ 奖励应用成功！');
      console.log(`💰 新增积分: +${suggestedPoints}`);
      console.log(`📊 总积分: ${newPoints}`);
      console.log(`🏆 成就数量: ${psychologyData.achievements.length}`);
      console.log('\n🎉 刷新页面即可看到更新！');
    };
  } else {
    console.log('💡 继续加油学习，很快就能获得奖励了！');
    console.log('');
    console.log('📌 建议:');
    console.log('  - 每天保持至少2小时的学习时间');
    console.log('  - 完成每日待办任务');
    console.log('  - 保持连续学习习惯');
    console.log('  - 记录情绪和认知重构练习');
  }
  
  console.log('\n========================================');
  console.log('🎊 分析完成！继续保持学习热情！💪');
  console.log('========================================\n');
})();
