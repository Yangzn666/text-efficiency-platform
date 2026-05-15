// 添加2026-05-09的学习记录
// 运行方式: node frontend/add-may9-records.js

const fs = require('fs');
const path = require('path');

console.log('📝 正在添加2026年5月9日的学习记录...\n');

const today = '2026-05-09';

// 创建四条学习记录
const records = [
  {
    id: 'record_20260509_1_' + Date.now(),
    date: today,
    subject: '408专业课',
    duration: 25,
    content: '计算机组成原理 - 第四章 指令系统',
    type: 'study',
    createdAt: new Date('2026-05-09T18:00:00').toISOString()
  },
  {
    id: 'record_20260509_2_' + (Date.now() + 1),
    date: today,
    subject: '数学一',
    duration: 25,
    content: '概率论与数理统计 - 第二章强化（1）',
    type: 'study',
    createdAt: new Date('2026-05-09T21:00:00').toISOString()
  },
  {
    id: 'record_20260509_3_' + (Date.now() + 2),
    date: today,
    subject: '数学一',
    duration: 25,
    content: '概率论与数理统计 - 第二章强化（2）',
    type: 'study',
    createdAt: new Date('2026-05-09T21:30:00').toISOString()
  },
  {
    id: 'record_20260509_4_' + (Date.now() + 3),
    date: today,
    subject: '数学一',
    duration: 25,
    content: '概率论与数理统计 - 第二章强化（3）',
    type: 'study',
    createdAt: new Date('2026-05-09T22:00:00').toISOString()
  }
];

try {
  // 读取现有的localStorage数据文件
  const dataPath = path.join(__dirname, 'src', 'stores', 'data.json');
  let data = {};
  
  if (fs.existsSync(dataPath)) {
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    data = JSON.parse(fileContent);
  }
  
  // 获取现有记录
  let studyRecords = data.studyRecords || [];
  
  // 检查是否已存在
  const alreadyExists = studyRecords.some(r => 
    r.date === today && 
    r.subject === '408专业课' &&
    r.content.includes('第四章')
  );
  
  if (alreadyExists) {
    console.log('️  今天的记录已存在，跳过添加');
  } else {
    // 添加新记录
    studyRecords.push(...records);
    
    // 更新数据
    data.studyRecords = studyRecords;
    
    // 保存回文件
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
    
    console.log('✅ 成功添加4条学习记录！\n');
    console.log(' 日期:', today);
    console.log('\n📚 记录详情:');
    console.log('1. 408专业课 - 25分钟 (18:00-18:25)');
    console.log('   计算机组成原理 - 第四章 指令系统');
    console.log('2. 数学一 - 25分钟 (21:00-21:25)');
    console.log('   概率论与数理统计 - 第二章强化（1）');
    console.log('3. 数学一 - 25分钟 (21:30-21:55)');
    console.log('   概率论与数理统计 - 第二章强化（2）');
    console.log('4. 数学一 - 25分钟 (22:00-22:25)');
    console.log('   概率论与数理统计 - 第二章强化（3）');
    console.log('\n📊 今日总学习时间: 100分钟');
    console.log(`\n💾 已保存到: ${dataPath}`);
  }
  
} catch (error) {
  console.error('❌ 添加学习记录失败:', error);
}
