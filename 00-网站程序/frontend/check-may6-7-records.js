// @ts-nocheck
// 检查5月6日和5月7日的学习记录
(function() {
  console.log('🔍 检查5月6日和5月7日的学习记录...\n');
  
  try {
    const studyRecords = JSON.parse(localStorage.getItem('studyRecords') || '[]');
    
    console.log(`📊 总记录数：${studyRecords.length} 条\n`);
    
    // 查找5月6日和5月7日的记录
    const may6Records = studyRecords.filter(r => r.date === '2026-05-06');
    const may7Records = studyRecords.filter(r => r.date === '2026-05-07');
    
    console.log('📅 2026-05-06（星期二）的学习记录：');
    if (may6Records.length === 0) {
      console.log('  ❌ 没有找到5月6日的学习记录');
    } else {
      let totalMinutes = 0;
      may6Records.forEach((r, i) => {
        console.log(`  ${i + 1}. ${r.subject}: ${r.duration}分钟 - ${r.content.substring(0, 50)}...`);
        totalMinutes += r.duration;
      });
      console.log(`  📊 总计：${totalMinutes}分钟\n`);
    }
    
    console.log('📅 2026-05-07（星期三）的学习记录：');
    if (may7Records.length === 0) {
      console.log('  ❌ 没有找到5月7日的学习记录');
    } else {
      let totalMinutes = 0;
      may7Records.forEach((r, i) => {
        console.log(`  ${i + 1}. ${r.subject}: ${r.duration}分钟 - ${r.content.substring(0, 50)}...`);
        totalMinutes += r.duration;
      });
      console.log(`  📊 总计：${totalMinutes}分钟\n`);
    }
    
    // 计算本周（从5月3日星期日开始）的学习时长
    const weekStart = new Date('2026-05-03');
    const weekRecords = studyRecords.filter(r => new Date(r.date) >= weekStart);
    
    console.log('📈 本周学习记录（从2026-05-03星期日开始）：');
    let weekTotal = 0;
    const recordsByDate = {};
    weekRecords.forEach(r => {
      if (!recordsByDate[r.date]) {
        recordsByDate[r.date] = 0;
      }
      recordsByDate[r.date] += r.duration;
      weekTotal += r.duration;
    });
    
    Object.keys(recordsByDate).sort().forEach(date => {
      console.log(`  ${date}: ${recordsByDate[date]}分钟`);
    });
    
    console.log(`\n📊 本周总学习时长：${weekTotal}分钟 (${Math.floor(weekTotal/60)}小时${weekTotal%60}分钟)`);
    
  } catch (error) {
    console.error('❌ 检查失败:', error);
  }
})();
