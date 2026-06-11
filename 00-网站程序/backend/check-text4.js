const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/reading-questions.json', 'utf8'));
const text4 = data.questions.filter(q => q.year === 2005 && q.section === 'Traditional Reading' && q.textNumber === 4);

console.log('\n Text4 作答情况分析\n');
console.log('=' .repeat(60));

let correctCount = 0;
text4.forEach(q => {
  const isCorrect = q.userAnswer === q.correctAnswer;
  if (isCorrect) correctCount++;
  
  console.log(`\n第${q.number}题 (${q.type}):`);
  console.log(`  正确答案: ${q.correctAnswer}`);
  console.log(`  你的答案: ${q.userAnswer || '(未作答)'}`);
  console.log(`  结果: ${isCorrect ? '✅ 正确' : '❌ 错误'}`);
});

console.log('\n' + '=' .repeat(60));
console.log(`\n📈 总分: ${correctCount}/${text4.length} (${Math.round(correctCount/text4.length*100)}%)`);
console.log('\n');
