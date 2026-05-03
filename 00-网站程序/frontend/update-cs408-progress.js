// 更新408学习进度脚本
// 在浏览器控制台中运行此脚本来更新学习记录

(async function updateCS408Progress() {
  console.log('💻 开始更新408学习进度...');
  
  try {
    // 获取当前存储的数据
    const studyRecords = JSON.parse(localStorage.getItem('studyRecords') || '[]');
    
    console.log(`📝 当前学习记录数量: ${studyRecords.length}`);
    
    // 创建今日学习记录
    const today = new Date().toISOString().split('T')[0];
    const timestamp = Date.now();
    
    const newRecords = [
      {
        id: `record_${timestamp}_cs408_update`,
        date: today,
        subject: '408计算机',
        duration: 150,
        content: '408基础阶段进度更新：数据结构已完成，开始计算机组成原理基础学习',
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
    console.log('\n📋 408计算机专业课基础阶段进度摘要:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📚 四门课程学习顺序:');
    console.log('  1. ✅ 数据结构 - 已完成 (2026-04-29)');
    console.log('  2. 🔄 计算机组成原理 - 进行中 (2026-04-30开始)');
    console.log('  3. ⏳ 计算机网络 - 待开始');
    console.log('  4. ⏳ 操作系统 - 待开始');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 提示: 请刷新页面查看最新进度');
    
  } catch (error) {
    console.error('❌ 更新学习记录失败:', error);
  }
})();
