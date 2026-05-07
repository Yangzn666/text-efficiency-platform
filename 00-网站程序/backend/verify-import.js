const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data/reading-questions.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('\n📊 数据验证报告\n');
console.log('=' .repeat(50));
console.log(`总题目数: ${data.questions.length} 道`);

// 年份分布
console.log('\n📅 年份分布:');
const years = {};
data.questions.forEach(q => {
  years[q.year] = (years[q.year] || 0) + 1;
});
Object.entries(years).forEach(([year, count]) => {
  console.log(`  ${year}年: ${count}题`);
});

// 用户作答情况
console.log('\n✍️ 用户作答情况:');
const answered = data.questions.filter(q => q.userAnswer);
console.log(`  已作答: ${answered.length}题`);
const correct = answered.filter(q => q.userAnswer === q.correctAnswer);
const wrong = answered.filter(q => q.userAnswer !== q.correctAnswer);
console.log(`  ✅ 答对: ${correct.length}题`);
console.log(`  ❌ 答错: ${wrong.length}题`);
console.log(`  📈 正确率: ${Math.round(correct.length / answered.length * 100)}%`);

// 题型分布
console.log('\n📝 题型分布:');
const types = {};
data.questions.forEach(q => {
  types[q.type] = (types[q.type] || 0) + 1;
});
Object.entries(types).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
  console.log(`  ${type}: ${count}题`);
});

// 错误分析覆盖
console.log('\n🔍 错误分析覆盖:');
const withErrorAnalysis = data.questions.filter(q => q.errorAnalysis);
console.log(`  有错误分析的题目: ${withErrorAnalysis.length}题`);
console.log(`  覆盖率: ${Math.round(withErrorAnalysis.length / data.questions.length * 100)}%`);

console.log('\n' + '='.repeat(50));
console.log('✅ 数据验证完成！\n');
