const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/reading-questions.json', 'utf8'));
const text4 = data.questions.filter(q => q.year === 2005 && q.section === 'Traditional Reading' && q.textNumber === 4);

console.log('\n📋 Text4 详细解析验证\n');
console.log('=' .repeat(60));

text4.forEach(q => {
  console.log(`\n第${q.number}题 (${q.type}):`);
  if (q.detailedAnalysis) {
    console.log('  ✅ 有详细解析');
    console.log(`     - 文章结构: ${q.detailedAnalysis.articleStructure?.length || 0}个段落`);
    console.log(`     - 词汇表: ${q.detailedAnalysis.vocabulary?.length || 0}个单词`);
    console.log(`     - 解题步骤: ${Object.keys(q.detailedAnalysis.questionBreakdown || {}).length}项`);
    console.log(`     - 常见陷阱: ${q.detailedAnalysis.commonTraps?.length || 0}个`);
    console.log(`     - 记忆技巧: ${q.detailedAnalysis.memoryTechnique ? '✅' : '❌'}`);
  } else {
    console.log('  ❌ 无详细解析');
  }
});

console.log('\n' + '=' .repeat(60));
console.log('\n');
