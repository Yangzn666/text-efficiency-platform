const fs = require('fs');

console.log('\n🔍 新手详解版数据验证\n');
console.log('=' .repeat(60));

// 读取数据
const data = JSON.parse(fs.readFileSync('data/reading-questions.json', 'utf8'));

// 筛选传统阅读题目
const traditionalQuestions = data.questions.filter(q => q.section === 'Traditional Reading');

console.log(`\n 总体统计:`);
console.log(`  传统阅读总题数: ${traditionalQuestions.length}`);

// 检查有详细解析的题目
const withDetailedAnalysis = traditionalQuestions.filter(q => q.detailedAnalysis);
console.log(`  有详细解析的题目: ${withDetailedAnalysis.length}/${traditionalQuestions.length} (${Math.round(withDetailedAnalysis.length/traditionalQuestions.length*100)}%)`);

// Text4详细检查
const text4Questions = traditionalQuestions.filter(q => q.year === 2005 && q.textNumber === 4);
console.log(`\n📝 Text4 详细检查:`);
text4Questions.forEach(q => {
  console.log(`\n  第${q.number}题 (${q.type}):`);
  if (q.detailedAnalysis) {
    const da = q.detailedAnalysis;
    console.log(`    ✅ 文章结构: ${da.articleStructure?.length || 0}个段落`);
    console.log(`    ✅ 核心词汇: ${da.vocabulary?.length || 0}个单词`);
    console.log(`    ✅ 解题步骤: ${Object.keys(da.questionBreakdown || {}).length}项`);
    console.log(`    ✅ 常见陷阱: ${da.commonTraps?.length || 0}个`);
    console.log(`    ✅ 记忆技巧: ${da.memoryTechnique ? '有' : '无'}`);
    
    // 检查关键字段
    const checks = [
      { name: 'articleStructure', has: !!da.articleStructure },
      { name: 'vocabulary', has: !!da.vocabulary },
      { name: 'questionBreakdown', has: !!da.questionBreakdown },
      { name: 'commonTraps', has: !!da.commonTraps },
      { name: 'memoryTechnique', has: !!da.memoryTechnique }
    ];
    
    const allPassed = checks.every(c => c.has);
    console.log(`    ${allPassed ? '✅' : ''} 所有模块完整: ${allPassed ? '是' : '否'}`);
  } else {
    console.log(`     无详细解析`);
  }
});

console.log('\n' + '=' .repeat(60));

// 其他年份检查
const otherYears = traditionalQuestions.filter(q => !q.detailedAnalysis);
if (otherYears.length > 0) {
  console.log(`\n⚠️  待优化题目: ${otherYears.length}道`);
  const byYear = {};
  otherYears.forEach(q => {
    byYear[q.year] = (byYear[q.year] || 0) + 1;
  });
  Object.keys(byYear).sort().forEach(year => {
    console.log(`    ${year}年: ${byYear[year]}题`);
  });
} else {
  console.log(`\n✅ 所有题目都已完成优化!`);
}

console.log('\n');
