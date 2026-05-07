const fs = require('fs');
const path = require('path');

// 读取JSON文件
const jsonPath = path.join(__dirname, '../../05-经验贴整理/2005年英语一完型真题.json');
const dataPath = path.join(__dirname, 'data/reading-questions.json');

console.log('📖 读取题目数据...');
const questions = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`✅ 成功读取 ${questions.length} 道题目`);

// 检查目标文件是否存在
let existingData = { questions: [] };
if (fs.existsSync(dataPath)) {
  console.log('📂 发现现有数据，准备合并...');
  existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

// 去重：检查是否已存在相同年份和题号的题目
const existingIds = new Set(
  existingData.questions.map(q => `${q.year}-${q.number}`)
);

const newQuestions = questions.filter(
  q => !existingIds.has(`${q.year}-${q.number}`)
);

console.log(`📊 新题目: ${newQuestions.length} 道`);
console.log(`📊 已有题目: ${existingData.questions.length} 道`);

if (newQuestions.length === 0) {
  console.log('⚠️ 所有题目已存在，无需导入');
  process.exit(0);
}

// 合并数据
const updatedData = {
  questions: [...existingData.questions, ...newQuestions],
  lastUpdated: new Date().toISOString()
};

// 保存到后端数据文件
fs.writeFileSync(dataPath, JSON.stringify(updatedData, null, 2), 'utf8');

console.log('\n✅ 导入成功！');
console.log(`📈 总题目数: ${updatedData.questions.length} 道`);
console.log(`💾 保存位置: ${dataPath}`);
console.log(`🕐 更新时间: ${updatedData.lastUpdated}`);
