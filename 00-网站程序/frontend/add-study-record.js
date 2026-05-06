// 添加学习记录到网站
// 在浏览器控制台中运行此脚本

(function() {
  console.log('📝 正在添加学习记录...\n');
  
  // 获取当前日期
  const today = new Date().toISOString().split('T')[0];
  
  // 创建两条学习记录
  const record1 = {
    id: 'record_' + Date.now(),
    date: today,
    subject: '408专业课',
    duration: 25,
    content: '计算机组成原理 - 第三章 存储器系统',
    type: 'study',
    createdAt: new Date().toISOString()
  };
  
  const record2 = {
    id: 'record_' + (Date.now() + 1),
    date: today,
    subject: '408专业课',
    duration: 25,
    content: '计算机组成原理 - 第四章 指令系统',
    type: 'study',
    createdAt: new Date().toISOString()
  };
  
  // 获取现有数据
  let studyData = JSON.parse(localStorage.getItem('studyData') || '{}');
  
  if (!studyData.studyRecords) {
    studyData.studyRecords = [];
  }
  
  // 添加新记录
  studyData.studyRecords.push(record1);
  studyData.studyRecords.push(record2);
  
  // 保存数据
  localStorage.setItem('studyData', JSON.stringify(studyData));
  
  console.log('✅ 学习记录已保存！\n');
  console.log('📅 日期:', today);
  console.log('📚 科目: 408专业课 - 计算机组成原理');
  console.log('⏱️ 第一次: 16:00-16:25 (25分钟)');
  console.log('   📖 内容: 第三章 存储器系统');
  console.log('⏱️ 第二次: 16:30-16:55 (25分钟)');
  console.log('   📖 内容: 第四章 指令系统');
  console.log('📊 今日总计: 50分钟');
  console.log('\n🎉 记录完成！刷新页面即可看到更新的学习数据。');
  console.log('💪 继续保持，加油！');
})();
