// 添加5月12日的学习记录
const fs = require('fs');
const path = require('path');

const recordsFile = path.join(__dirname, '..', 'study-data', 'study-records.json');

// 读取现有记录
let data = { studyRecords: [] };
if (fs.existsSync(recordsFile)) {
  const fileContent = fs.readFileSync(recordsFile, 'utf8');
  data = JSON.parse(fileContent);
}

// 确保studyRecords是数组
if (!Array.isArray(data.studyRecords)) {
  data.studyRecords = [];
}

// 定义今天的日期
const today = '2026-05-12';

// 要添加的学习记录
const newRecords = [
  {
    date: today,
    startTime: '13:00',
    endTime: '13:20',
    duration: 20,
    subject: '英语一',
    category: '词汇',
    content: '背单词',
    notes: ''
  },
  {
    date: today,
    startTime: '14:00',
    endTime: '14:25',
    duration: 25,
    subject: '408专业课',
    category: '计组',
    content: '计组第五章学习',
    notes: ''
  },
  {
    date: today,
    startTime: '15:00',
    endTime: '15:25',
    duration: 25,
    subject: '其他',
    category: '经验贴',
    content: '学习经验贴',
    notes: ''
  },
  {
    date: today,
    startTime: '15:30',
    endTime: '15:55',
    duration: 25,
    subject: '其他',
    category: '资料搜集',
    content: '搜集资料',
    notes: ''
  },
  {
    date: today,
    startTime: '16:00',
    endTime: '16:20',
    duration: 20,
    subject: '英语一',
    category: '词汇',
    content: '背单词',
    notes: ''
  }
];

// 添加新记录
data.studyRecords.push(...newRecords);

// 保存回文件
fs.writeFileSync(recordsFile, JSON.stringify(data, null, 2), 'utf8');

console.log(`✅ 成功添加 ${newRecords.length} 条学习记录到 ${today}`);
console.log('\n添加的记录：');
newRecords.forEach((record, index) => {
  console.log(`${index + 1}. ${record.startTime}-${record.endTime} ${record.content} (${record.duration}分钟)`);
});

// 计算总学习时间
const totalMinutes = newRecords.reduce((sum, r) => sum + r.duration, 0);
console.log(`\n📊 今日总学习时间：${totalMinutes}分钟 = ${(totalMinutes / 60).toFixed(2)}小时`);
