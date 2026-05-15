// 添加2026-05-08的学习记录
// 运行方式: node frontend/add-may8-records.js

const fs = require('fs');
const path = require('path');

console.log('📝 正在添加2026年5月8日的学习记录...\n');

const today = '2026-05-08';

// 创建两条学习记录
const record1 = {
  id: 'record_20260508_1_' + Date.now(),
  date: today,
  subject: '英语',
  duration: 17,
  content: '背单词 - 词汇记忆与复习',
  type: 'study',
  createdAt: new Date('2026-05-08T21:00:00').toISOString()
};

const record2 = {
  id: 'record_20260508_2_' + (Date.now() + 1),
  date: today,
  subject: '408专业课',
  duration: 25,
  content: '计算机组成原理 - 第四章 指令系统',
  type: 'study',
  createdAt: new Date('2026-05-08T22:00:00').toISOString()
};

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
    ((r.subject === '英语' && r.duration === 17) || 
     (r.subject === '408专业课' && r.duration === 25))
  );
  
  if (alreadyExists) {
    console.log('⚠️  5月8日的记录可能已存在，跳过添加');
    process.exit(0);
  }
  
  // 添加新记录
  studyRecords.push(record1, record2);
  data.studyRecords = studyRecords;
  
  // 更新科目进度
  let subjectProgress = data.subjectProgress || {};
  
  if (!subjectProgress['英语']) {
    subjectProgress['英语'] = {
      totalTime: 0,
      lastStudyDate: '',
      weeklyGoal: 300,
      completionRate: 0
    };
  }
  subjectProgress['英语'].totalTime += 17;
  subjectProgress['英语'].lastStudyDate = today;
  
  if (!subjectProgress['408专业课']) {
    subjectProgress['408专业课'] = {
      totalTime: 0,
      lastStudyDate: '',
      weeklyGoal: 300,
      completionRate: 0
    };
  }
  subjectProgress['408专业课'].totalTime += 25;
  subjectProgress['408专业课'].lastStudyDate = today;
  
  data.subjectProgress = subjectProgress;
  
  // 保存数据
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
  
  console.log('✅ 2026-05-08 学习记录已成功添加！\n');
  console.log('📊 今日学习统计：');
  console.log('  📚 21:00-21:17 英语 - 背单词 (17分钟)');
  console.log('  💻 22:00-22:25 408专业课 - 计组第四章 (25分钟)');
  console.log('  ⏰ 总时长：42分钟\n');
  console.log('💡 请刷新考研平台页面查看最新进度');
  
} catch (error) {
  console.error('❌ 添加学习记录失败:', error);
  process.exit(1);
}
