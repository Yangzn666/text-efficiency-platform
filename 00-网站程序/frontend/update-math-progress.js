// 更新数学学习进度脚本
// 在浏览器控制台中运行此脚本来更新学习记录

(async function updateMathProgress() {
  console.log('📊 开始更新数学学习进度...');
  
  try {
    // 获取当前存储的数据
    const studyRecords = JSON.parse(localStorage.getItem('studyRecords') || '[]');
    
    console.log(`📝 当前学习记录数量: ${studyRecords.length}`);
    
    // 创建今日学习记录
    const today = new Date().toISOString().split('T')[0];
    const timestamp = Date.now();
    
    const newRecords = [
      {
        id: `record_${timestamp}_math_update`,
        date: today,
        subject: '数学',
        duration: 180,
        content: '基础阶段进度更新：基础三十讲概率论剩3讲，1000题高数1-17讲完成、线代完成、概率论剩3讲',
        type: 'study',
        createdAt: new Date().toISOString()
      }
    ];
    
    // 更新学习记录
    const updatedRecords = [...studyRecords, ...newRecords];
    localStorage.setItem('studyRecords', JSON.stringify(updatedRecords));
    
    console.log('✅ 学习记录已更新');
    console.log(`➕ 新增 ${newRecords.length} 条记录`);
    console.log(`📅 今日日期: ${today}`);
    
    // 显示进度摘要
    console.log('\n📋 数学一基础阶段进度摘要:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📖 基础三十讲:');
    console.log('  ├─ 高等数学(1-8讲): ✅ 已完成');
    console.log('  ├─ 线性代数(9-14讲): ✅ 已完成');
    console.log('  └─ 概率论(15-18讲): 🔄 15讲完成，16-18讲待完成');
    console.log('');
    console.log('✏️ 1000题A组:');
    console.log('  ├─ 高等数学(1-18讲): 🔄 1-17讲完成，第18讲待完成');
    console.log('  ├─ 线性代数(9-14讲): ✅ 已完成');
    console.log('  └─ 概率论(15-18讲): 🔄 15讲完成，16-18讲待完成');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 提示: 请刷新页面查看最新进度');
    
  } catch (error) {
    console.error('❌ 更新学习记录失败:', error);
  }
})();
