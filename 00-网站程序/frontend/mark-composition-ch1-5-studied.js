// 标记计组前五章为已学习完成
// 在浏览器控制台运行此脚本

const chaptersToMark = [
  // 第一章：计算机系统概述
  '1.1', '1.2', '1.3',
  // 第二章：数据的表示和运算
  '2.1', '2.2', '2.3', '2.4',
  // 第三章：存储系统
  '3.1', '3.2', '3.3', '3.4', '3.5', '3.6',
  // 第四章：指令系统
  '4.1', '4.2', '4.3', '4.4',
  // 第五章：中央处理器（CPU）
  '5.1', '5.2', '5.3', '5.4', '5.5'
];

console.log('🚀 开始标记计组前五章为已学习...\n');

// 获取当前已学习的小节
const savedProgress = localStorage.getItem('composition_studied_sections');
let studiedSections = savedProgress ? new Set(JSON.parse(savedProgress)) : new Set();

console.log('📊 标记前状态:');
console.log('   当前已学习的小节数量:', studiedSections.size);
console.log('   当前已学习的小节:', Array.from(studiedSections).sort());
console.log('');

// 添加前五章的所有小节
let newlyAdded = 0;
chaptersToMark.forEach(sectionId => {
  if (!studiedSections.has(sectionId)) {
    studiedSections.add(sectionId);
    newlyAdded++;
  }
});

// 保存到localStorage
localStorage.setItem('composition_studied_sections', JSON.stringify([...studiedSections]));

console.log('✅ 已成功标记计组前五章为已学习！\n');
console.log('📈 统计信息:');
console.log('   新增标记的小节:', newlyAdded, '个');
console.log('   当前已学习的小节总数:', studiedSections.size);
console.log('   所有已学习的小节:', Array.from(studiedSections).sort());
console.log('');
console.log('📚 已完成章节:');
console.log('   ✅ 第一章：计算机系统概述 (3个小节)');
console.log('   ✅ 第二章：数据的表示和运算 (4个小节)');
console.log('   ✅ 第三章：存储系统 (6个小节)');
console.log('   ✅ 第四章：指令系统 (4个小节)');
console.log('   ✅ 第五章：中央处理器CPU (5个小节)');
console.log('');
console.log('💡 请刷新页面以查看更新后的进度！');
console.log('🎉 恭喜完成计组前五章的学习！');
