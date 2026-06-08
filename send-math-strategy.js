#!/usr/bin/env node
/**
 * 考研数学中值定理学习策略邮件发送脚本
 */

const nodemailer = require('nodemailer');

// 邮件配置
const transporter = nodemailer.createTransport({
  service: 'qq',
  auth: {
    user: '2142744149@qq.com',
    pass: 'ushjvvzxbhqfbjie'
  }
});

// 创建HTML邮件内容
const emailContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>考研数学强化阶段 - 中值定理学习策略</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      line-height: 1.8;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    .header h1 { font-size: 32px; margin-bottom: 10px; font-weight: 700; }
    .header .subtitle { font-size: 16px; opacity: 0.9; }
    .content { padding: 40px; }
    h2 {
      color: #667eea;
      font-size: 24px;
      margin: 30px 0 15px 0;
      padding-bottom: 10px;
      border-bottom: 3px solid #667eea;
      font-weight: 600;
    }
    h3 {
      color: #764ba2;
      font-size: 20px;
      margin: 25px 0 12px 0;
      font-weight: 600;
    }
    p { margin: 12px 0; color: #333; font-size: 15px; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    th {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
    }
    tr:nth-child(even) { background: #f8f9fa; }
    tr:hover { background: #e3f2fd; }
    .highlight {
      background: linear-gradient(120deg, #ffeaa7 0%, #fdcb6e 100%);
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 600;
    }
    .important {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 15px 0;
      border-radius: 4px;
    }
    .tip {
      background: #d1ecf1;
      border-left: 4px solid #17a2b8;
      padding: 15px;
      margin: 15px 0;
      border-radius: 4px;
    }
    .warning {
      background: #f8d7da;
      border-left: 4px solid #dc3545;
      padding: 15px;
      margin: 15px 0;
      border-radius: 4px;
    }
    ul, ol { margin: 10px 0 10px 20px; }
    li { margin: 8px 0; font-size: 15px; }
    .footer {
      background: #f8f9fa;
      padding: 20px 40px;
      text-align: center;
      color: #6c757d;
      font-size: 14px;
      border-top: 1px solid #e0e0e0;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      margin: 0 5px;
    }
    .badge-success { background: #28a745; color: white; }
    .badge-warning { background: #ffc107; color: #333; }
    .badge-danger { background: #dc3545; color: white; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📚 考研数学强化阶段学习建议</h1>
      <div class="subtitle">关于中值定理的学习策略分析</div>
    </div>
    <div class="content">
      <h2>🎯 当前学习状况</h2>
      <p><strong>已完成：</strong>极限、一元微分（强化阶段前两章）✅</p>
      <p><strong>待决定：</strong>是否现在学习中值定理</p>
      <p><strong>基础阶段：</strong>已跳过中值定理部分</p>

      <h2>📊 经验帖核心观点汇总</h2>
      <p>分析了多份高分经验帖（150分Deya、143分邂逅遗憾、139分武忠祥体系等），关于<span class="highlight">中值定理</span>的建议如下：</p>

      <h3>1️⃣ 中值定理的定位与难度</h3>
      <div class="important">
        <strong>经验帖共识：</strong><br>
        "微分中值定理可以看B站众多UP的中值定理专题，选择一个最适合自己且讲得全面的UP听一下即可"<br>
        ——《数学一备考终极指南_27考研版》
      </div>
      <ul>
        <li>✅ 中值定理是<strong>强化阶段的难点和重点</strong></li>
        <li>✅ 属于<strong>证明题的核心工具</strong>，考研必考</li>
        <li>✅ 基础阶段跳过很正常，很多同学都这样安排</li>
        <li>✅ 需要<strong>专项突破</strong>，不是普通章节</li>
      </ul>

      <h3>2️⃣ 学习时机建议</h3>
      
      <h3>方案A：现在就学 <span class="badge badge-success">强烈推荐 ⭐⭐⭐⭐⭐</span></h3>
      <div class="tip">
        <strong>推荐理由：</strong><br>
        1. <strong>知识连贯性最佳</strong>：刚学完一元微分，中值定理是其自然延伸<br>
        2. <strong>武忠祥体系安排</strong>：中值定理在强化讲义第2章和第9讲，属于前期内容<br>
        3. <strong>经验帖建议</strong>："循序渐进，一环扣一环...必须深刻理解掌握"<br>
        4. <strong>时间充裕</strong>：现在是5月底，距离考试还有7个月
      </div>

      <h3>方案B：先学其他再回来 <span class="badge badge-danger">不推荐 ❌</span></h3>
      <div class="warning">
        <strong>风险提示：</strong><br>
        • 遗忘成本高：后面学的多元积分、级数等与中值定理关联度低<br>
        • 心理压力：难点越拖越怕，容易形成心理障碍<br>
        • 时间浪费：来回切换主题，效率低下<br>
        • 经验帖警告："你对上一个环节的理解会影响下一个环节"
      </div>

      <h2>💡 中值定理三步突破法</h2>
      
      <h3>第一步：建立框架（2-3天）</h3>
      <ul>
        <li>听武忠祥强化讲义第2章中值定理部分</li>
        <li>理解四个中值定理的关系：<br>
          <code>罗尔 → 拉格朗日 → 柯西 → 泰勒</code><br>
          （特殊 → 一般 → 更一般 → 最高级形式）
        </li>
        <li>制作思维导图，理清逻辑关系</li>
      </ul>

      <h3>第二步：专项突破（5-7天）</h3>
      <ul>
        <li>看B站中值定理专题视频（推荐：武忠祥或方浩的专题课）</li>
        <li>重点掌握<strong>辅助函数构造方法</strong>：
          <ul>
            <li>分析法（还原法）</li>
            <li>微分方程法</li>
          </ul>
        </li>
        <li>做武忠祥严选题中值定理部分</li>
      </ul>

      <h3>第三步：巩固提升（3-5天）</h3>
      <ul>
        <li>完成李林880题中值定理章节</li>
        <li>整理错题本，总结常见题型</li>
        <li>用费曼学习法：尝试给别人讲解中值定理证明思路</li>
      </ul>

      <h2>📅 推荐学习计划（接下来2周）</h2>
      <table>
        <tr><th>时间</th><th>内容</th><th>时长</th><th>目标</th></tr>
        <tr><td>第1-2天</td><td>武忠祥强化讲义听课+笔记</td><td>4小时/天</td><td>理解四个中值定理</td></tr>
        <tr><td>第3-5天</td><td>B站专题视频+辅助函数构造</td><td>3小时/天</td><td>掌握证明技巧</td></tr>
        <tr><td>第6-8天</td><td>武忠祥严选题</td><td>3小时/天</td><td>熟练应用</td></tr>
        <tr><td>第9-11天</td><td>李林880题对应章节</td><td>3小时/天</td><td>巩固提升</td></tr>
        <tr><td>第12-14天</td><td>错题整理+思维导图+费曼讲解</td><td>2小时/天</td><td>查漏补缺</td></tr>
      </table>
      <p><strong>总计：</strong>约40-45小时，2周内攻克中值定理 💪</p>

      <h2>⚠️ 避坑指南</h2>
      <div class="warning">
        <strong>常见误区：</strong><br>
        ❌ 只看不练：视频看了很多，题做得很少<br>
        ❌ 过早放弃：第一遍不会就放弃<br>
        ❌ 死记硬背：不理解辅助函数构造原理<br>
        ❌ 忽视每日一题
      </div>
      <div class="tip">
        <strong>正确做法：</strong><br>
        ✅ 勤于动笔：每道证明题都要完整写出过程<br>
        ✅ 坚持每日一题：细水长流，每天巩固<br>
        ✅ 制作思维导图：串联知识点，形成体系<br>
        ✅ 反复刷错题：至少二刷，第三遍只刷错题
      </div>

      <h2>🌟 心态调整建议</h2>
      <ol>
        <li><strong>不要害怕难点</strong>：中值定理确实难，但所有考生都觉得难，你不是一个人</li>
        <li><strong>相信量变引起质变</strong>：第一遍不懂很正常，第二遍、第三遍就会豁然开朗</li>
        <li><strong>专注当下</strong>：不要想"后面还有很多要学"，先把眼前的中值定理攻克</li>
        <li><strong>享受突破的快感</strong>：当你真正理解中值定理时，会有巨大的成就感</li>
      </ol>

      <h2>🎯 最终建议</h2>
      <div class="important">
        <h3 style="margin-top: 0;">强烈建议现在就学中值定理！</h3>
        <p><strong>核心理由：</strong></p>
        <ol>
          <li>知识连贯性最佳（刚学完一元微分）</li>
          <li>时间充裕（距离考试还有7个月）</li>
          <li>经验帖一致推荐强化阶段完成</li>
          <li>避免后续学习的心理障碍和时间浪费</li>
        </ol>
      </div>

      <div class="tip">
        <h3 style="margin-top: 0;">行动口号：</h3>
        <p style="font-size: 18px; font-weight: 600; color: #667eea;">
          "现在不攻克，以后更难受！趁热打铁，一举拿下中值定理！" 💪🔥
        </p>
      </div>

      <h2>📞 如有疑问</h2>
      <p>如果在学习过程中遇到困难：</p>
      <ul>
        <li>回看武忠祥强化视频</li>
        <li>参考B站专题课程</li>
        <li>加入考研数学交流群（如Deya群：860957136）</li>
        <li>使用费曼学习法，找同学互相讲解</li>
      </ul>
    </div>
    <div class="footer">
      <p style="font-size: 18px; font-weight: 600; color: #667eea;">加油！你现在的进度已经领先大多数人！</p>
      <p style="font-size: 24px; margin-top: 10px;">保持这个节奏，浙大人工智能专硕必定是你的！SIUUU！🎓✨</p>
      <p style="margin-top: 20px; font-size: 12px;">基于多份高分经验帖综合分析 · ${new Date().toLocaleString('zh-CN')}</p>
    </div>
  </div>
</body>
</html>
`;

// 发送邮件
async function sendEmail() {
  const mailOptions = {
    from: '"考研数学学习助手" <2142744149@qq.com>',
    to: '2142744149@qq.com',
    subject: '【考研数学】强化阶段中值定理学习策略 - 详细分析报告',
    html: emailContent
  };

  try {
    console.log('🚀 正在发送邮件...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ 邮件发送成功！');
    console.log(`   Message ID: ${info.messageId}`);
    console.log('📮 请检查你的QQ邮箱收件箱');
    return true;
  } catch (error) {
    console.error('❌ 邮件发送失败');
    console.error(`   Error: ${error.message}`);
    return false;
  }
}

// 运行
sendEmail().catch(console.error);
