// 自动写入2026-05-05英语语法学习记录到网站数据库
const fs = require('fs');
const path = require('path');

console.log('🚀 开始写入2026-05-05英语语法学习记录...\n');

// 读取现有的study.ts文件，了解数据结构
const studyStorePath = path.join(__dirname, 'src', 'stores', 'study.ts');
console.log('📂 检查项目结构...');

if (!fs.existsSync(studyStorePath)) {
  console.error('❌ 找不到study.ts文件');
  process.exit(1);
}

console.log('✅ 找到study.ts文件\n');

// 创建学习记录数据
const today = '2026-05-05';
const timestamp = Date.now();

const newRecords = [
  {
    id: `record_${timestamp}_grammar_session1`,
    date: today,
    subject: '英语',
    duration: 25,
    content: '虚拟语气基础学习：掌握三种基本形式（与现在/过去/将来事实相反）。理解时态倒退规律：用时间距离表达现实距离。学习特殊句型：wish后、suggest/demand后、It\'s time后的虚拟语气规则。掌握倒装结构：Had/Should/Were提前省略if的用法。',
    type: 'study',
    createdAt: new Date('2026-05-05T18:30:00').toISOString()
  },
  {
    id: `record_${timestamp}_grammar_session2`,
    date: today,
    subject: '英语',
    duration: 25,
    content: '虚拟语气实战练习：完成15道填空题（正确率约70%）。掌握与现在/过去/将来事实相反的基本结构。需要加强：不规则动词变化（wake-woken, speak-spoke, leave-left, catch-caught, lose-lost）、固定搭配（listen to, advice不可数）。',
    type: 'practice',
    createdAt: new Date('2026-05-05T19:00:00').toISOString()
  },
  {
    id: `record_${timestamp}_grammar_session3`,
    date: today,
    subject: '英语',
    duration: 25,
    content: '虚拟语气选择题和改错题：选择题5题（正确率60%），改错题5题（正确率60%）。薄弱点：suggest后应用(should)+原形而非过去式；It\'s time后用过去式而非should；倒装结构中had后接过去分词known而非knew。',
    type: 'practice',
    createdAt: new Date('2026-05-05T19:30:00').toISOString()
  },
  {
    id: `record_${timestamp}_grammar_session4`,
    date: today,
    subject: '英语',
    duration: 25,
    content: '虚拟语气翻译练习：完成5道中译英题目。掌握混合虚拟语气（if从句过去+主句现在）。常见错误：wish后用过去分词spoken错误，应为spoke或could speak；advice是不可数名词无复数；listen必须加to。总学习时长100分钟。',
    type: 'practice',
    createdAt: new Date('2026-05-05T20:00:00').toISOString()
  }
];

console.log('📝 准备写入的学习记录：');
console.log(`  - 时间段1: 18:30-18:55 (25分钟) - 虚拟语气基础`);
console.log(`  - 时间段2: 19:00-19:25 (25分钟) - 填空题练习`);
console.log(`  - 时间段3: 19:30-19:55 (25分钟) - 选择题和改错题`);
console.log(`  - 时间段4: 20:00-20:25 (25分钟) - 翻译题练习`);
console.log(`  - 总计: 100分钟\n`);

// 由于这是前端项目，数据存储在浏览器的localStorage中
// 我们需要生成一个可以在浏览器控制台运行的脚本
const scriptContent = `
// 2026-05-05 英语语法学习记录 - 自动注入脚本
(function() {
  const newRecords = ${JSON.stringify(newRecords, null, 2)};
  
  try {
    // 获取现有记录
    const studyRecords = JSON.parse(localStorage.getItem('studyRecords') || '[]');
    
    // 合并新记录
    const updatedRecords = [...studyRecords, ...newRecords];
    
    // 保存到localStorage
    localStorage.setItem('studyRecords', JSON.stringify(updatedRecords));
    
    // 更新科目进度
    const subjectProgress = JSON.parse(localStorage.getItem('subjectProgress') || '{}');
    if (!subjectProgress['英语']) {
      subjectProgress['英语'] = {
        totalTime: 0,
        lastStudyDate: '',
        weeklyGoal: 300,
        completionRate: 0
      };
    }
    subjectProgress['英语'].totalTime += 100;
    subjectProgress['英语'].lastStudyDate = '${today}';
    
    // 计算本周英语学习时间
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyEnglishTime = updatedRecords
      .filter(r => r.subject === '英语' && new Date(r.date) >= oneWeekAgo)
      .reduce((sum, r) => sum + r.duration, 0);
    subjectProgress['英语'].completionRate = Math.min(100, (weeklyEnglishTime / 300) * 100);
    
    localStorage.setItem('subjectProgress', JSON.stringify(subjectProgress));
    
    console.log('✅ 学习记录已成功写入！');
    console.log('📊 今日英语学习统计：');
    console.log('  ⏰ 学习时段：18:30-18:55, 19:00-19:25, 19:30-19:55, 20:00-20:25');
    console.log('  📈 总时长：100分钟（1小时40分钟）');
    console.log('  📚 学习内容：虚拟语气系统学习');
    console.log('');
    console.log('💡 AI建议：');
    console.log('  1️⃣  加强不规则动词记忆');
    console.log('  2️⃣  巩固特殊句型规则');
    console.log('  3️⃣  注意固定搭配');
    console.log('  4️⃣  明天学习：定语从句');
    console.log('');
    console.log('🔄 请刷新页面查看最新进度');
    
    return true;
  } catch (error) {
    console.error('❌ 写入失败:', error);
    return false;
  }
})();
`;

// 将脚本保存为可执行文件
const outputPath = path.join(__dirname, 'auto-inject-grammar-records.js');
fs.writeFileSync(outputPath, scriptContent, 'utf-8');

console.log('✅ 脚本已生成：auto-inject-grammar-records.js\n');

// 尝试通过puppeteer或其他方式自动注入到浏览器
// 但由于这是一个纯前端项目，最简单的方式是提供一个HTML文件来自动执行

const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>自动注入学习记录</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .container {
      background: rgba(255, 255, 255, 0.95);
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      color: #333;
    }
    h1 {
      color: #667eea;
      text-align: center;
    }
    .status {
      padding: 15px;
      margin: 20px 0;
      border-radius: 8px;
      font-size: 16px;
    }
    .success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    .info {
      background: #d1ecf1;
      color: #0c5460;
      border: 1px solid #bee5eb;
    }
    button {
      background: #667eea;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      margin: 10px 5px;
    }
    button:hover {
      background: #5568d3;
    }
    .details {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📚 学习记录自动注入工具</h1>
    
    <div id="status" class="status info">
      正在准备注入2026-05-05的英语语法学习记录...
    </div>
    
    <div style="text-align: center;">
      <button onclick="injectRecords()">立即注入</button>
      <button onclick="window.close()" style="background: #6c757d;">关闭</button>
    </div>
    
    <div class="details">
      <h3>📊 即将注入的学习记录：</h3>
      <ul>
        <li>⏰ 18:30-18:55 (25分钟) - 虚拟语气基础理论</li>
        <li>⏰ 19:00-19:25 (25分钟) - 填空题练习</li>
        <li>⏰ 19:30-19:55 (25分钟) - 选择题和改错题</li>
        <li>⏰ 20:00-20:25 (25分钟) - 翻译题练习</li>
        <li><strong>总计：100分钟（1小时40分钟）</strong></li>
      </ul>
      
      <h3>💡 AI建议：</h3>
      <ol>
        <li>加强不规则动词记忆</li>
        <li>巩固特殊句型规则（suggest/demand用should+原形）</li>
        <li>掌握It's time后用过去式</li>
        <li>注意固定搭配（listen to, advice不可数）</li>
        <li>明天学习计划：定语从句</li>
      </ol>
    </div>
  </div>

  <script>
    const newRecords = ${JSON.stringify(newRecords, null, 2)};
    
    function injectRecords() {
      try {
        // 获取现有记录
        const studyRecords = JSON.parse(localStorage.getItem('studyRecords') || '[]');
        
        // 合并新记录
        const updatedRecords = [...studyRecords, ...newRecords];
        
        // 保存到localStorage
        localStorage.setItem('studyRecords', JSON.stringify(updatedRecords));
        
        // 更新科目进度
        const subjectProgress = JSON.parse(localStorage.getItem('subjectProgress') || '{}');
        if (!subjectProgress['英语']) {
          subjectProgress['英语'] = {
            totalTime: 0,
            lastStudyDate: '',
            weeklyGoal: 300,
            completionRate: 0
          };
        }
        subjectProgress['英语'].totalTime += 100;
        subjectProgress['英语'].lastStudyDate = '${today}';
        
        // 计算本周英语学习时间
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weeklyEnglishTime = updatedRecords
          .filter(r => r.subject === '英语' && new Date(r.date) >= oneWeekAgo)
          .reduce((sum, r) => sum + r.duration, 0);
        subjectProgress['英语'].completionRate = Math.min(100, (weeklyEnglishTime / 300) * 100);
        
        localStorage.setItem('subjectProgress', JSON.stringify(subjectProgress));
        
        document.getElementById('status').className = 'status success';
        document.getElementById('status').innerHTML = 
          '✅ 学习记录已成功注入！<br>' +
          '📊 今日英语学习：100分钟<br>' +
          '🔄 请刷新考研平台页面查看最新进度';
        
        console.log('✅ 学习记录已成功写入localStorage');
        
        // 3秒后自动关闭
        setTimeout(() => {
          window.close();
        }, 3000);
        
      } catch (error) {
        document.getElementById('status').className = 'status';
        document.getElementById('status').style.background = '#f8d7da';
        document.getElementById('status').style.color = '#721c24';
        document.getElementById('status').innerHTML = '❌ 注入失败：' + error.message;
        console.error('❌ 写入失败:', error);
      }
    }
    
    // 页面加载后自动执行
    window.onload = function() {
      setTimeout(injectRecords, 500);
    };
  </script>
</body>
</html>
`;

const htmlPath = path.join(__dirname, 'auto-inject-records.html');
fs.writeFileSync(htmlPath, htmlContent, 'utf-8');

console.log('✅ HTML注入工具已生成：auto-inject-records.html\n');
console.log('🌐 正在打开浏览器自动注入...\n');

// 尝试在默认浏览器中打开HTML文件
const { exec } = require('child_process');
exec(`start "" "${htmlPath}"`, (error) => {
  if (error) {
    console.log('⚠️  无法自动打开浏览器，请手动打开以下文件：');
    console.log(`   ${htmlPath}\n`);
  } else {
    console.log('✅ 浏览器已打开，学习记录将自动注入！\n');
    console.log('📌 注入完成后，浏览器窗口会自动关闭。');
    console.log('🔄 然后请刷新考研平台页面查看最新进度。\n');
  }
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📋 操作说明：');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('1. 浏览器会自动打开并注入学习记录');
console.log('2. 注入完成后窗口会自动关闭');
console.log('3. 刷新考研平台页面即可看到今天的学习记录');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
