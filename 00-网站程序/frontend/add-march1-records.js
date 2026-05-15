// 添加3月1日学习记录的脚本
// 运行方式: 在项目根目录下执行 node frontend/add-march1-records.js

const localforage = require('localforage');

async function addMarch1Records() {
  try {
    console.log('🔍 开始添加2026年3月1日的学习记录...');
    
    // 从本地存储加载现有数据
    const studyRecords = await localforage.getItem('studyRecords') || [];
    const subjectProgress = await localforage.getItem('subjectProgress') || {};
    
    console.log(`📊 当前学习记录数量: ${studyRecords.length}`);
    
    // 3月1日的学习记录
    const march1Records = [
      {
        id: 'record_20260301_1_' + Date.now(),
        date: '2026-03-01',
        subject: '经验贴/视频',
        duration: 25,
        content: '向其他人学习考研经验',
        type: 'study',
        createdAt: new Date('2026-03-01T21:19:00Z').toISOString()
      },
      {
        id: 'record_20260301_2_' + Date.now(),
        date: '2026-03-01',
        subject: '数学',
        duration: 25,
        content: '数学学习',
        type: 'study',
        createdAt: new Date('2026-03-01T19:35:00Z').toISOString()
      },
      {
        id: 'record_20260301_3_' + Date.now(),
        date: '2026-03-01',
        subject: '计划',
        duration: 25,
        content: '考研学习计划制定',
        type: 'study',
        createdAt: new Date('2026-03-01T16:37:00Z').toISOString()
      },
      {
        id: 'record_20260301_4_' + Date.now(),
        date: '2026-03-01',
        subject: '计划',
        duration: 25,
        content: '考研学习计划制定',
        type: 'study',
        createdAt: new Date('2026-03-01T15:51:00Z').toISOString()
      }
    ];
    
    // 添加新记录
    const updatedRecords = [...studyRecords, ...march1Records];
    
    // 更新科目进度
    const updatedSubjectProgress = { ...subjectProgress };
    march1Records.forEach(record => {
      if (!updatedSubjectProgress[record.subject]) {
        updatedSubjectProgress[record.subject] = {
          totalTime: 0,
          lastStudyDate: '',
          weeklyGoal: 300,
          completionRate: 0
        };
      }
      updatedSubjectProgress[record.subject].totalTime += record.duration;
      updatedSubjectProgress[record.subject].lastStudyDate = record.date;
      
      // 计算完成率（简化处理）
      const weeklyTime = march1Records
        .filter(r => r.subject === record.subject && r.date === '2026-03-01')
        .reduce((sum, r) => sum + r.duration, 0);
      updatedSubjectProgress[record.subject].completionRate = Math.min(100, (weeklyTime / 300) * 100);
    });
    
    // 保存到本地存储
    await localforage.setItem('studyRecords', updatedRecords);
    await localforage.setItem('subjectProgress', updatedSubjectProgress);
    
    console.log(`✅ 成功添加 ${march1Records.length} 条学习记录`);
    console.log(`📊 总学习记录数: ${updatedRecords.length}`);
    console.log(`📅 3月1日总学习时间: ${march1Records.reduce((sum, r) => sum + r.duration, 0)} 分钟`);
    
    // 显示统计信息
    const todayStats = updatedRecords.filter(r => r.date === '2026-03-01');
    console.log('\n📋 3月1日学习统计:');
    todayStats.forEach(record => {
      console.log(`- ${record.subject}: ${record.duration}分钟 (${record.content})`);
    });
    
  } catch (error) {
    console.error('❌ 添加学习记录失败:', error);
  }
}

// 执行函数
addMarch1Records();