// 八哥英语课程进度更新脚本
// 在浏览器控制台中运行此脚本以保存学习记录

(async function updateEnglishProgress() {
  try {
    const studyRecords = JSON.parse(localStorage.getItem('studyRecords') || '[]');
    const today = new Date().toISOString().split('T')[0];
    const timestamp = Date.now();
    
    // 创建英语学习记录
    const newRecords = [
      {
        id: `record_${timestamp}_english_update`,
        date: today,
        subject: '英语',
        duration: 0,
        content: '八哥老师27考研英语全程班课程安排已记录：基础阶段（词汇1800+基础语法+长难句+阅读精读+阅读四步法），暑期强化阶段（阅读+翻译+完形+新题型+写作），冲刺阶段（五大题型+真题+写作带练）',
        type: 'study',
        createdAt: new Date().toISOString()
      }
    ];
    
    // 保存到localStorage
    localStorage.setItem('studyRecords', JSON.stringify([...studyRecords, ...newRecords]));
    
    console.log('✅ 英语学习记录已更新！');
    console.log('📚 课程阶段：');
    console.log('  1️⃣ 基础阶段（开始-6月）：词汇1800、基础语法、长难句四步法、阅读精读、阅读四步法');
    console.log('  2️ 暑期强化（7-9月）：阅读+翻译+完形+新题型+写作保命');
    console.log('  3️ 冲刺模拟（10-12月）：五大题型、2021-2026真题、写作50天带练');
    console.log('');
    console.log('📝 请刷新页面查看最新进度');
    
  } catch (error) {
    console.error('❌ 更新失败:', error);
  }
})();
