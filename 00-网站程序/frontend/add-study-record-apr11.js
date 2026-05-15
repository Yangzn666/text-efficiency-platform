// 在浏览器控制台中运行此脚本，添加学习进度记录
(async function addStudyRecord() {
  try {
    // 获取现有的学习记录
    const studyRecords = JSON.parse(localStorage.getItem('studyRecords') || '[]');
    
    // 创建新的学习记录
    const newRecord = {
      id: 'record_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      date: '2026-04-11',
      subject: '数学',
      duration: 40, // 40分钟（23:00~23:40）
      content: '概率论第三章强化',
      type: 'study',
      createdAt: new Date().toISOString()
    };
    
    // 添加新记录
    studyRecords.push(newRecord);
    
    // 保存到localStorage
    localStorage.setItem('studyRecords', JSON.stringify(studyRecords));
    
    console.log('✅ 学习记录添加成功！');
    console.log('📚 记录详情：');
    console.log('  📅 日期：2026-04-11');
    console.log('  ⏰ 时间：23:00 ~ 23:40（40分钟）');
    console.log('  📖 科目：数学');
    console.log('  📝 内容：概率论第三章强化');
    console.log('  🆔 记录ID：', newRecord.id);
    
    return newRecord;
  } catch (error) {
    console.error('❌ 添加学习记录失败:', error);
    throw error;
  }
})();
