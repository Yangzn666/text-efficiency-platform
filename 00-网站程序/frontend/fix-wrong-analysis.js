const fs = require('fs');

// 读取文件
let content = fs.readFileSync('./src/components/WrongProblemAnalysis.vue', 'utf8');

// 修复编码问题
content = content.replace('待复?', '待复习');
content = content.replace('平均掌握?', '平均掌握度');

// 写回文件
fs.writeFileSync('./src/components/WrongProblemAnalysis.vue', content, 'utf8');
console.log('WrongProblemAnalysis.vue 修复完成');