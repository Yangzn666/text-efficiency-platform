// 学习数据清理脚本
// 在浏览器控制台中运行此脚本以清除模拟的学习数据

(function() {
  console.log('=== 开始清理模拟学习数据 ===');
  
  // 检查当前localStorage中的数据
  console.log('当前localStorage中的学习相关数据:');
  const studyKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (
      key.includes('study') || 
      key.includes('learning') || 
      key.includes('analytics') || 
      key.includes('progress') ||
      key.includes('session')
    )) {
      studyKeys.push(key);
      console.log('-', key, ':', localStorage.getItem(key));
    }
  }
  
  if (studyKeys.length === 0) {
    console.log('✅ 未发现需要清理的学习数据');
    return;
  }
  
  console.log('\n即将删除的学习数据项:', studyKeys.length, '项');
  
  // 删除学习相关数据
  studyKeys.forEach(key => {
    localStorage.removeItem(key);
    console.log('🗑️ 已删除:', key);
  });
  
  console.log('\n✅ 学习数据清理完成！');
  console.log('系统将从今天开始记录真实的学习数据');
  console.log('代办事项数据保持不变');
  
  // 可选：刷新页面
  console.log('\n建议刷新页面以应用更改');
  
})();
