const fs = require('fs');

// 读取数据
const data = JSON.parse(fs.readFileSync('data/reading-questions.json', 'utf8'));

// 筛选传统阅读题目
const traditionalQuestions = data.questions.filter(q => q.section === 'Traditional Reading');

console.log('\n📊 传统阅读题目统计\n');
console.log('=' .repeat(60));
console.log(`总题数: ${traditionalQuestions.length}`);

// 按年份分组
const byYear = {};
traditionalQuestions.forEach(q => {
  byYear[q.year] = (byYear[q.year] || 0) + 1;
});

console.log('\n按年份分布:');
Object.keys(byYear).sort().forEach(year => {
  console.log(`  ${year}年: ${byYear[year]}题`);
});

// 按题型分类
const byType = {};
traditionalQuestions.forEach(q => {
  byType[q.type] = (byType[q.type] || 0) + 1;
});

console.log('\n按题型分布:');
Object.keys(byType).forEach(type => {
  console.log(`  ${type}: ${byType[type]}题`);
});

console.log('\n' + '=' .repeat(60));

// 检查解析质量
console.log('\n🔍 解析质量检查:\n');

let hasAnalysis = 0;
let hasErrorAnalysis = 0;
let hasTips = 0;

traditionalQuestions.forEach(q => {
  if (q.analysis && q.analysis.length > 20) hasAnalysis++;
  if (q.errorAnalysis && Object.keys(q.errorAnalysis).length > 0) hasErrorAnalysis++;
  if (q.tips && q.tips.length > 10) hasTips++;
});

console.log(`✅ 有详细解析的题目: ${hasAnalysis}/${traditionalQuestions.length} (${Math.round(hasAnalysis/traditionalQuestions.length*100)}%)`);
console.log(`✅ 有错误选项分析的题目: ${hasErrorAnalysis}/${traditionalQuestions.length} (${Math.round(hasErrorAnalysis/traditionalQuestions.length*100)}%)`);
console.log(`✅ 有解题技巧的题目: ${hasTips}/${traditionalQuestions.length} (${Math.round(hasTips/traditionalQuestions.length*100)}%)`);

console.log('\n');
