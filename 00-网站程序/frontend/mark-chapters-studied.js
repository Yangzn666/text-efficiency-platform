// 标记计组前三章为已学习
// 在浏览器控制台运行此脚本

const chaptersToMark = [
  // 第一章：计算机系统概述
  '1.1', '1.2', '1.3',
  // 第二章：数据的表示和运算
  '2.1', '2.2', '2.3', '2.4',
  // 第三章：存储系统
  '3.1', '3.2', '3.3', '3.4', '3.5', '3.6'
];

// 获取当前已学习的小节
const savedProgress = localStorage.getItem('composition_studied_sections');
let studiedSections = savedProgress ? new Set(JSON.parse(savedProgress)) : new Set();

console.log('当前已学习的小节数量:', studiedSections.size);
console.log('当前已学习的小节:', Array.from(studiedSections));

// 添加前三章的所有小节
chaptersToMark.forEach(sectionId => {
  studiedSections.add(sectionId);
});

// 保存到localStorage
localStorage.setItem('composition_studied_sections', JSON.stringify([...studiedSections]));

console.log('\n✅ 已成功标记计组前三章为已学习！');
console.log('新增标记的小节:', chaptersToMark.length, '个');
console.log('当前已学习的小节总数:', studiedSections.size);
console.log('所有已学习的小节:', Array.from(studiedSections).sort());

// 刷新页面以查看效果
console.log('\n请刷新页面以查看更新后的进度！');
