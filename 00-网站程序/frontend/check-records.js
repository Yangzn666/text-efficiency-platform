// 检查2026-05-05学习记录是否已成功写入
(function() {
  console.log('🔍 开始检查学习记录...\n');
  
  try {
    // 获取所有学习记录
    const studyRecords = JSON.parse(localStorage.getItem('studyRecords') || '[]');
    
    console.log(`📊 总记录数：${studyRecords.length} 条\n`);
    
    // 查找今天的记录
    const today = '2026-05-05';
    const todayRecords = studyRecords.filter(r => r.date === today);
    
    if (todayRecords.length === 0) {
      console.log('❌ 未找到2026-05-05的学习记录');
      console.log('💡 请确保已经运行了自动注入脚本');
      return;
    }
    
    console.log(`✅ 找到 ${todayRecords.length} 条2026-05-05的学习记录：\n`);
    
    let totalDuration = 0;
    todayRecords.forEach((record, index) => {
      console.log(`📝 记录 ${index + 1}:`);
      console.log(`   ID: ${record.id}`);
      console.log(`   时间: ${new Date(record.createdAt).toLocaleTimeString('zh-CN')}`);
      console.log(`   科目: ${record.subject}`);
      console.log(`   时长: ${record.duration} 分钟`);
      console.log(`   类型: ${record.type}`);
      console.log(`   内容: ${record.content.substring(0, 50)}...`);
      console.log('');
      totalDuration += record.duration;
    });
    
    console.log(`📈 今日总学习时长：${totalDuration} 分钟 (${Math.floor(totalDuration/60)}小时${totalDuration%60}分钟)\n`);
    
    // 检查科目进度
    const subjectProgress = JSON.parse(localStorage.getItem('subjectProgress') || '{}');
    if (subjectProgress['英语']) {
      console.log('📚 英语科目进度：');
      console.log(`   总学习时间: ${subjectProgress['英语'].totalTime} 分钟`);
      console.log(`   最后学习日期: ${subjectProgress['英语'].lastStudyDate}`);
      console.log(`   本周完成率: ${subjectProgress['英语'].completionRate.toFixed(1)}%`);
      console.log('');
    }
    
    console.log('✅ 数据检查完成！');
    console.log('🔄 现在可以刷新考研平台页面查看最新数据');
    
  } catch (error) {
    console.error('❌ 检查失败:', error);
  }
})();
