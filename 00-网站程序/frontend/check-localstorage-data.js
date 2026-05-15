// @ts-nocheck
// 检查localStorage中的学习记录数据
(function() {
  console.log('🔍 检查localStorage学习记录数据...\n');
  
  try {
    const studyRecords = JSON.parse(localStorage.getItem('studyRecords') || '[]');
    
    console.log(`📊 总记录数：${studyRecords.length} 条\n`);
    
    // 按日期分组统计
    const recordsByDate = {};
    studyRecords.forEach(record => {
      if (!recordsByDate[record.date]) {
        recordsByDate[record.date] = [];
      }
      recordsByDate[record.date].push(record);
    });
    
    console.log('📅 按日期统计：');
    Object.keys(recordsByDate).sort().forEach(date => {
      const records = recordsByDate[date];
      const totalMinutes = records.reduce((sum, r) => sum + r.duration, 0);
      console.log(`  ${date}: ${records.length}条记录, 共${totalMinutes}分钟`);
      records.forEach((r, i) => {
        console.log(`    - ${r.subject}: ${r.duration}分钟 (${r.content.substring(0, 30)}...)`);
      });
    });
    
    console.log('\n📈 本周学习记录（2026-05-04 到 2026-05-10）：');
    const weekStart = new Date('2026-05-04');
    const weekEnd = new Date('2026-05-10');
    
    const weekRecords = studyRecords.filter(r => {
      const recordDate = new Date(r.date);
      return recordDate >= weekStart && recordDate <= weekEnd;
    });
    
    let weekTotal = 0;
    weekRecords.forEach(r => {
      console.log(`  ${r.date} - ${r.subject}: ${r.duration}分钟`);
      weekTotal += r.duration;
    });
    
    console.log(`\n📊 本周总学习时长：${weekTotal}分钟 (${Math.floor(weekTotal/60)}小时${weekTotal%60}分钟)`);
    
    // 检查subjectProgress
    const subjectProgress = JSON.parse(localStorage.getItem('subjectProgress') || '{}');
    console.log('\n📚 科目进度数据：');
    Object.keys(subjectProgress).forEach(subject => {
      const progress = subjectProgress[subject];
      console.log(`  ${subject}:`);
      console.log(`    - 总时长: ${progress.totalTime}分钟`);
      console.log(`    - 最后学习: ${progress.lastStudyDate}`);
      console.log(`    - 本周目标: ${progress.weeklyGoal}分钟`);
      console.log(`    - 完成率: ${progress.completionRate}%`);
    });
    
  } catch (error) {
    console.error('❌ 检查失败:', error);
  }
})();
