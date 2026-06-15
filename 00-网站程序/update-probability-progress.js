/**
 * 更新概率论强化章节进度
 * 将概率论强化细化为具体章节，标注已完成前三章
 */

const fs = require('fs');
const path = require('path');

// 读取学习记录文件
const recordsPath = path.join(__dirname, 'study-data', 'study-records.json');
const recordsData = JSON.parse(fs.readFileSync(recordsPath, 'utf8'));

console.log('📊 当前学习记录统计:');
console.log('- 总记录数:', recordsData.studyRecords.length);

// 查找数学一相关记录
const mathRecords = recordsData.studyRecords.filter(r => 
  r.subject === '数学一' && r.content.includes('概率论')
);

console.log('- 概率论相关记录:', mathRecords.length);

// 显示最近的概率论学习记录
if (mathRecords.length > 0) {
  console.log('\n最近的概率论学习记录:');
  mathRecords.slice(-5).forEach(record => {
    console.log(`  ${record.date}: ${record.content.substring(0, 50)}...`);
  });
}

// 更新科目进度统计
if (recordsData.subjectProgress['数学一']) {
  const mathProgress = recordsData.subjectProgress['数学一'];
  console.log('\n📐 数学一进度统计:');
  console.log('- 总学习时间:', mathProgress.totalTime, '分钟');
  console.log('- 最后学习日期:', mathProgress.lastStudyDate);
  console.log('- 完成率:', mathProgress.completionRate, '%');
}

console.log('\n✅ 数据检查完成');
console.log('\n💡 提示: 概率论强化章节已在前端配置中更新为:');
console.log('   ✅ 第一章：随机事件和概率（已完成）');
console.log('   ✅ 第二章：随机变量及其分布（已完成）');
console.log('   ✅ 第三章：二维随机变量及其分布（已完成）');
console.log('   🔄 第四章：随机变量的数字特征（进行中）');
console.log('   ⏳ 第五章：大数定律/中心极限定理（待开始）');
console.log('   ⏳ 第六章：数理统计的基本概念（待开始）');
