// 直接注入2026-05-05英语语法学习记录到网站
const fs = require('fs');
const path = require('path');

console.log('🚀 开始注入2026-05-05英语语法学习记录到网站...\n');

const today = '2026-05-05';
const timestamp = Date.now();

// 创建4条学习记录
const newRecords = [
  {
    id: `record_${timestamp}_grammar_1`,
    date: today,
    subject: '英语一',
    duration: 25,
    content: '虚拟语气基础学习 - 掌握三种基本形式（与现在/过去/将来事实相反）、时态倒退规律、特殊句型（wish/suggest/It\'s time）、倒装结构',
    type: 'study',
    createdAt: new Date('2026-05-05T18:30:00').toISOString()
  },
  {
    id: `record_${timestamp}_grammar_2`,
    date: today,
    subject: '英语一',
    duration: 25,
    content: '虚拟语气实战练习 - 完成15道填空题（正确率70%），掌握基本结构，需加强不规则动词和固定搭配',
    type: 'practice',
    createdAt: new Date('2026-05-05T19:00:00').toISOString()
  },
  {
    id: `record_${timestamp}_grammar_3`,
    date: today,
    subject: '英语一',
    duration: 25,
    content: '虚拟语气选择题和改错题 - 选择题5题（60%）、改错题5题（60%），薄弱点：suggest规则、It\'s time用法、倒装结构',
    type: 'practice',
    createdAt: new Date('2026-05-05T19:30:00').toISOString()
  },
  {
    id: `record_${timestamp}_grammar_4`,
    date: today,
    subject: '英语一',
    duration: 25,
    content: '虚拟语气翻译练习 - 完成5道中译英，掌握混合虚拟语气，常见错误：wish后用法、advice不可数、listen to搭配',
    type: 'practice',
    createdAt: new Date('2026-05-05T20:00:00').toISOString()
  }
];

console.log('📝 准备注入的学习记录：');
newRecords.forEach((record, index) => {
  console.log(`  ${index + 1}. ${record.createdAt.substring(11, 16)} - ${record.duration}分钟 - ${record.content.substring(0, 30)}...`);
});
console.log(`\n📊 总计：${newRecords.reduce((sum, r) => sum + r.duration, 0)}分钟\n`);

// 读取HomeView.vue文件
const homeViewPath = path.join(__dirname, 'src', 'views', 'HomeView.vue');
let homeViewContent = fs.readFileSync(homeViewPath, 'utf-8');

// 查找autoRecordTodayStudy函数的位置，在其后添加新的函数
const injectFunction = `

// 注入2026-05-05英语语法学习记录
const injectEnglishGrammarRecords = () => {
  const targetDate = '2026-05-05'
  let studyData = JSON.parse(localStorage.getItem('studyData') || '{}')
  
  if (!studyData.studyRecords) {
    studyData.studyRecords = []
  }
  
  // 检查是否已经注入过
  const alreadyInjected = studyData.studyRecords.some((record: any) => 
    record.date === targetDate && 
    record.subject === '英语一' &&
    record.content.includes('虚拟语气')
  )
  
  if (!alreadyInjected) {
    const recordsToAdd = ${JSON.stringify(newRecords, null, 6)}
    
    recordsToAdd.forEach(record => {
      studyData.studyRecords.push(record)
    })
    
    localStorage.setItem('studyData', JSON.stringify(studyData))
    console.log('✅ 已成功注入2026-05-05英语语法学习记录（100分钟）')
    return true
  } else {
    console.log('ℹ️  2026-05-05英语语法学习记录已存在，跳过注入')
    return false
  }
}
`;

// 在autoRecordTodayStudy函数后插入新函数
const insertPosition = homeViewContent.indexOf('// 开始第一天英语语法学习');
if (insertPosition !== -1) {
  homeViewContent = homeViewContent.substring(0, insertPosition) + injectFunction + '\n' + homeViewContent.substring(insertPosition);
  
  // 保存修改后的文件
  fs.writeFileSync(homeViewPath, homeViewContent, 'utf-8');
  console.log('✅ 已将注入函数添加到HomeView.vue\n');
} else {
  console.log('⚠️  未找到合适的插入位置\n');
}

// 现在直接在onMounted中调用这个函数
// 查找onMounted的位置
const onMountedMatch = homeViewContent.match(/onMounted\(\s*\(\)\s*=>\s*\{[\s\S]*?\}\)/);
if (onMountedMatch) {
  const onMountedCode = onMountedMatch[0];
  // 在onMounted的开头添加调用
  const newOnMounted = onMountedCode.replace(
    /onMounted\(\s*\(\)\s*=>\s*\{/,
    'onMounted(() => {\n  // 注入2026-05-05英语语法学习记录\n  injectEnglishGrammarRecords()'
  );
  
  homeViewContent = homeViewContent.replace(onMountedCode, newOnMounted);
  fs.writeFileSync(homeViewPath, homeViewContent, 'utf-8');
  console.log('✅ 已在onMounted中添加自动调用\n');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📋 完成！现在请：');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('1. 刷新考研平台页面');
console.log('2. 学习记录会自动注入到localStorage');
console.log('3. 查看首页今日学习时长应该显示100分钟');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('💡 如果还是没有显示，请在浏览器控制台运行：');
console.log('   injectEnglishGrammarRecords()\n');
