const fs = require('fs');

try {
  const data = JSON.parse(fs.readFileSync('data/reading-questions.json', 'utf8'));
  console.log('JSON解析成功');
  console.log('总题目数:', data.questions.length);
  
  // 按年份和题型分组统计
  const groups = {};
  data.questions.forEach(q => {
    const key = `${q.year}-${q.section}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(q.number);
  });
  
  console.log('\n题目分布:');
  Object.keys(groups).forEach(key => {
    const numbers = groups[key];
    console.log(`  ${key}: ${numbers.length}题 (编号: ${numbers.join(', ')})`);
  });
  
  // 检查Text3
  const text3 = data.questions.filter(q => q.year === 2005 && q.section === 'Traditional Reading' && q.textNumber === 3);
  console.log('\nText3题目:');
  text3.forEach(q => {
    console.log(`  第${q.number}题: userAnswer="${q.userAnswer}", correctAnswer="${q.correctAnswer}"`);
  });
  
} catch(e) {
  console.log('JSON解析失败:', e.message);
  console.log('错误位置:', e.stack);
}
