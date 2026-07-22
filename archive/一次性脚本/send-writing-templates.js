const nodemailer = require('nodemailer');

// 邮箱配置
const transporter = nodemailer.createTransport({
  service: 'qq',
  auth: {
    user: '2142744149@qq.com',
    pass: 'ushjvvzxbhqfbjie' // SMTP授权码
  }
});

// 作文模板HTML邮件内容
const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>英语六级作文模板 - Premium版</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      line-height: 1.8;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    
    .header p {
      font-size: 1.2em;
      opacity: 0.95;
      font-family: 'Inter', sans-serif;
    }
    
    .content {
      padding: 40px;
    }
    
    .framework-section {
      margin-bottom: 40px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
    
    .framework-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px 30px;
    }
    
    .framework-header h2 {
      font-size: 1.8em;
      margin-bottom: 5px;
    }
    
    .framework-header .badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.3);
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 0.9em;
      margin-top: 10px;
    }
    
    .framework-body {
      background: #f8f9fa;
      padding: 30px;
    }
    
    .paragraph {
      background: white;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      border-left: 4px solid #667eea;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    }
    
    .paragraph h3 {
      color: #667eea;
      font-size: 1.3em;
      margin-bottom: 10px;
      font-family: 'Georgia', serif;
    }
    
    .paragraph .description {
      color: #666;
      font-size: 0.95em;
      margin-bottom: 15px;
      font-style: italic;
    }
    
    .example {
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
      padding: 15px;
      border-radius: 8px;
      margin: 10px 0;
      border-left: 3px solid #4CAF50;
    }
    
    .example .en {
      font-family: 'Merriweather', 'Georgia', serif;
      color: #2E7D32;
      font-weight: 600;
      font-size: 1.05em;
      margin-bottom: 5px;
    }
    
    .example .cn {
      color: #555;
      font-size: 0.95em;
    }
    
    .tips-section {
      background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
      padding: 20px;
      border-radius: 12px;
      border-left: 4px solid #FF9800;
      margin-top: 20px;
    }
    
    .tips-section h4 {
      color: #F57C00;
      margin-bottom: 10px;
      font-size: 1.1em;
    }
    
    .tips-section ul {
      list-style: none;
      padding-left: 0;
    }
    
    .tips-section li {
      padding: 8px 0;
      color: #333;
      position: relative;
      padding-left: 25px;
    }
    
    .tips-section li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #FF9800;
      font-weight: bold;
    }
    
    .memory-tip {
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      padding: 20px;
      border-radius: 12px;
      border-left: 4px solid #2196F3;
      margin-top: 20px;
    }
    
    .memory-tip h4 {
      color: #1976D2;
      margin-bottom: 15px;
      font-size: 1.2em;
    }
    
    .memory-item {
      background: white;
      padding: 12px;
      border-radius: 8px;
      margin: 10px 0;
    }
    
    .memory-item strong {
      color: #1976D2;
      display: block;
      margin-bottom: 5px;
    }
    
    .footer {
      background: #f8f9fa;
      padding: 30px;
      text-align: center;
      color: #666;
      border-top: 2px solid #e0e0e0;
    }
    
    .footer p {
      margin: 5px 0;
    }
    
    .highlight {
      background: linear-gradient(135deg, #fff9c4 0%, #fff59d 100%);
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>✍️ 英语六级作文模板</h1>
      <p>Premium Enhanced Edition v2.2 | 记忆力强化版</p>
    </div>
    
    <div class="content">
      <!-- Framework 1: Argumentative Essay -->
      <div class="framework-section">
        <div class="framework-header">
          <h2>🏗️ 议论文框架</h2>
          <span class="badge">Argumentative Essay</span>
          <span class="badge">最常考类型</span>
        </div>
        <div class="framework-body">
          <!-- Paragraph 1 -->
          <div class="paragraph">
            <h3>第一段：引出话题 + 表明立场</h3>
            <p class="description">2-3句话，明确表达你的观点</p>
            
            <div class="example">
              <div class="en">Recently, the issue of ___ has aroused wide concern.</div>
              <div class="cn">最近，___问题引起了广泛关注。</div>
            </div>
            
            <div class="example">
              <div class="en">From my perspective, I firmly believe that...</div>
              <div class="cn">在我看来，我坚信...</div>
            </div>
          </div>
          
          <!-- Paragraph 2 -->
          <div class="paragraph">
            <h3>第二段：论证理由（2-3个论点）</h3>
            <p class="description">每点用First/Furthermore/Last连接，提供具体例子</p>
            
            <div class="example">
              <div class="en">First and foremost, ...</div>
              <div class="cn">首先且最重要的是...</div>
            </div>
            
            <div class="example">
              <div class="en">Furthermore, ...</div>
              <div class="cn">此外，...</div>
            </div>
            
            <div class="example">
              <div class="en">Last but not least, ...</div>
              <div class="cn">最后但同样重要的是...</div>
            </div>
          </div>
          
          <!-- Paragraph 3 -->
          <div class="paragraph">
            <h3>第三段：总结 + 建议/展望</h3>
            <p class="description">重申观点，提出建议或未来展望</p>
            
            <div class="example">
              <div class="en">In conclusion, ...</div>
              <div class="cn">总之，...</div>
            </div>
            
            <div class="example">
              <div class="en">It is high time that we took effective measures to...</div>
              <div class="cn">是时候采取有效措施来...</div>
            </div>
          </div>
          
          <!-- Tips -->
          <div class="tips-section">
            <h4>💡 使用要点</h4>
            <ul>
              <li>观点要明确，不要模棱两可</li>
              <li>每个论点都要有具体例子支撑</li>
              <li>使用高级词汇替换简单词（good→beneficial）</li>
              <li>注意段落间的逻辑连接词</li>
            </ul>
          </div>
          
          <!-- Memory Tip -->
          <div class="memory-tip">
            <h4>🧠 记忆技巧</h4>
            <div class="memory-item">
              <strong>📝 口诀：</strong>
              "引表论总" - 引出话题→表明立场→论证理由→总结展望
            </div>
            <div class="memory-item">
              <strong>🔗 联想：</strong>
              想象你在演讲：先说主题(引)，再站队(表)，然后讲道理(论)，最后收尾(总)
            </div>
            <div class="memory-item">
              <strong>🎯 关键词：</strong>
              Recently... / From my perspective... / First...Furthermore...Last... / In conclusion...
            </div>
          </div>
        </div>
      </div>
      
      <!-- Framework 2: Chart Description -->
      <div class="framework-section">
        <div class="framework-header">
          <h2>📊 图表作文框架</h2>
          <span class="badge">Chart/Graph Description</span>
          <span class="badge">数据描述类</span>
        </div>
        <div class="framework-body">
          <!-- Paragraph 1 -->
          <div class="paragraph">
            <h3>第一段：描述图表趋势</h3>
            <p class="description">客观描述数据变化，不加入主观判断</p>
            
            <div class="example">
              <div class="en">As is clearly shown in the chart, ...</div>
              <div class="cn">如图表所示，...</div>
            </div>
            
            <div class="example">
              <div class="en">The percentage of ___ increased/decreased from ___ to ___.</div>
              <div class="cn">___的百分比从___增加到/减少到___。</div>
            </div>
          </div>
          
          <!-- Paragraph 2 -->
          <div class="paragraph">
            <h3>第二段：分析原因</h3>
            <p class="description">解释数据变化的可能原因</p>
            
            <div class="example">
              <div class="en">Several factors contribute to this phenomenon.</div>
              <div class="cn">几个因素导致了这一现象。</div>
            </div>
            
            <div class="example">
              <div class="en">On the one hand, ... On the other hand, ...</div>
              <div class="cn">一方面...另一方面...</div>
            </div>
          </div>
          
          <!-- Paragraph 3 -->
          <div class="paragraph">
            <h3>第三段：预测/建议</h3>
            <p class="description">基于数据分析做出预测或提出建议</p>
            
            <div class="example">
              <div class="en">Based on the analysis above, it can be predicted that...</div>
              <div class="cn">基于以上分析，可以预测...</div>
            </div>
            
            <div class="example">
              <div class="en">Therefore, it is advisable to...</div>
              <div class="cn">因此，建议...</div>
            </div>
          </div>
          
          <!-- Tips -->
          <div class="tips-section">
            <h4>💡 使用要点</h4>
            <ul>
              <li>不要罗列所有数据，选择关键趋势</li>
              <li>使用比较和对比的表达方式</li>
              <li>时态要正确（过去数据用过去时）</li>
              <li>避免主观臆断，保持客观描述</li>
            </ul>
          </div>
          
          <!-- Memory Tip -->
          <div class="memory-tip">
            <h4>🧠 记忆技巧</h4>
            <div class="memory-item">
              <strong>📝 口诀：</strong>
              "描析预" - 描述数据→分析原因→预测趋势
            </div>
            <div class="memory-item">
              <strong>🔗 联想：</strong>
              像天气预报：先看图表(描)，再解释为什么(析)，最后预测未来(预)
            </div>
            <div class="memory-item">
              <strong>🎯 关键词：</strong>
              As shown... / Several factors... / It can be predicted...
            </div>
          </div>
        </div>
      </div>
      
      <!-- Framework 3: Letter Writing -->
      <div class="framework-section">
        <div class="framework-header">
          <h2>✉️ 书信框架</h2>
          <span class="badge">Letter Writing</span>
          <span class="badge">应用文类</span>
        </div>
        <div class="framework-body">
          <!-- Paragraph 1 -->
          <div class="paragraph">
            <h3>开头：说明写信目的</h3>
            <p class="description">直接表明写信意图</p>
            
            <div class="example">
              <div class="en">I am writing to express my concern about...</div>
              <div class="cn">我写此信是为了表达我对...的关注。</div>
            </div>
            
            <div class="example">
              <div class="en">I would like to offer some suggestions regarding...</div>
              <div class="cn">我想就...提供一些建议。</div>
            </div>
          </div>
          
          <!-- Paragraph 2 -->
          <div class="paragraph">
            <h3>正文：具体内容（分点陈述）</h3>
            <p class="description">清晰列出要点，逻辑分明</p>
            
            <div class="example">
              <div class="en">Firstly, ...</div>
              <div class="cn">首先，...</div>
            </div>
            
            <div class="example">
              <div class="en">Secondly, ...</div>
              <div class="cn">其次，...</div>
            </div>
            
            <div class="example">
              <div class="en">Finally, ...</div>
              <div class="cn">最后，...</div>
            </div>
          </div>
          
          <!-- Paragraph 3 -->
          <div class="paragraph">
            <h3>结尾：期待回复/感谢</h3>
            <p class="description">礼貌结束，表达期望</p>
            
            <div class="example">
              <div class="en">I would appreciate it if you could take my suggestions into consideration.</div>
              <div class="cn">如果您能考虑我的建议，我将不胜感激。</div>
            </div>
            
            <div class="example">
              <div class="en">Looking forward to your early reply.</div>
              <div class="cn">期待您的早日回复。</div>
            </div>
          </div>
          
          <!-- Tips -->
          <div class="tips-section">
            <h4>💡 使用要点</h4>
            <ul>
              <li>注意书信格式（称呼、署名）</li>
              <li>语气要礼貌得体</li>
              <li>内容要完整，涵盖所有要点</li>
              <li>字数控制在100-120词左右</li>
            </ul>
          </div>
          
          <!-- Memory Tip -->
          <div class="memory-tip">
            <h4>🧠 记忆技巧</h4>
            <div class="memory-item">
              <strong>📝 口诀：</strong>
              "目内结" - 目的→内容→结尾
            </div>
            <div class="memory-item">
              <strong>🔗 联想：</strong>
              写信三步骤：为何写(目)→写什么(内)→怎么结束(结)
            </div>
            <div class="memory-item">
              <strong>🎯 关键词：</strong>
              I am writing to... / Firstly...Secondly...Finally... / I would appreciate...
            </div>
          </div>
        </div>
      </div>
      
      <!-- Quick Reference -->
      <div class="framework-section">
        <div class="framework-header" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
          <h2>⚡ 万能句型速查表</h2>
          <span class="badge">24个高分句型</span>
        </div>
        <div class="framework-body">
          <div class="paragraph">
            <h3>🔝 开头引入（3句）</h3>
            <div class="example">
              <div class="en">1. With the rapid development of technology/society/economy, ...</div>
              <div class="cn">随着科技/社会/经济的快速发展，...</div>
            </div>
            <div class="example">
              <div class="en">2. Nowadays, ___ has become a hot topic / a matter of public concern.</div>
              <div class="cn">如今，___已成为热门话题/公众关注的问题。</div>
            </div>
            <div class="example">
              <div class="en">3. It is universally acknowledged that ...</div>
              <div class="cn">众所周知，...</div>
            </div>
          </div>
          
          <div class="paragraph">
            <h3>🔄 论证过渡（3句）</h3>
            <div class="example">
              <div class="en">4. On the one hand, ... On the other hand, ...</div>
              <div class="cn">一方面...另一方面...</div>
            </div>
            <div class="example">
              <div class="en">5. Furthermore / Moreover / In addition, ...</div>
              <div class="cn">此外/而且/另外，...</div>
            </div>
            <div class="example">
              <div class="en">6. However / Nevertheless, ...</div>
              <div class="cn">然而/尽管如此，...</div>
            </div>
          </div>
          
          <div class="paragraph">
            <h3>✅ 结论总结（3句）</h3>
            <div class="example">
              <div class="en">7. In conclusion / To sum up, ...</div>
              <div class="cn">总之/总而言之，...</div>
            </div>
            <div class="example">
              <div class="en">8. Taking all these factors into consideration, ...</div>
              <div class="cn">综合考虑所有因素，...</div>
            </div>
            <div class="example">
              <div class="en">9. It is high time that we took effective measures to ...</div>
              <div class="cn">是时候采取有效措施来...</div>
            </div>
          </div>
          
          <div class="paragraph">
            <h3>📈 数据描述（3句）</h3>
            <div class="example">
              <div class="en">10. The number/percentage has increased/decreased significantly.</div>
              <div class="cn">数量/百分比显著增长/下降。</div>
            </div>
            <div class="example">
              <div class="en">11. Compared with ___, ___ is higher/lower.</div>
              <div class="cn">与___相比，___更高/更低。</div>
            </div>
            <div class="example">
              <div class="en">12. It accounts for ___ percent of the total.</div>
              <div class="cn">它占总数的___百分比。</div>
            </div>
          </div>
          
          <div class="paragraph">
            <h3>💎 高级替换（3句）</h3>
            <div class="example">
              <div class="en">13. Instead of "good", use: beneficial / advantageous / favorable</div>
              <div class="cn">用beneficial/advantageous/favorable替换good</div>
            </div>
            <div class="example">
              <div class="en">14. Instead of "think", use: argue / maintain / contend</div>
              <div class="cn">用argue/maintain/contend替换think</div>
            </div>
            <div class="example">
              <div class="en">15. Instead of "important", use: crucial / vital / indispensable</div>
              <div class="cn">用crucial/vital/indispensable替换important</div>
            </div>
          </div>
          
          <div class="paragraph">
            <h3>🎯 举例论证（3句）</h3>
            <div class="example">
              <div class="en">16. For instance / For example, ...</div>
              <div class="cn">例如，...</div>
            </div>
            <div class="example">
              <div class="en">17. Take ... as an example.</div>
              <div class="cn">以...为例。</div>
            </div>
            <div class="example">
              <div class="en">18. A case in point is ...</div>
              <div class="cn">一个恰当的例子是...</div>
            </div>
          </div>
          
          <div class="paragraph">
            <h3>⚖️ 因果分析（3句）</h3>
            <div class="example">
              <div class="en">19. This is mainly because ...</div>
              <div class="cn">这主要是因为...</div>
            </div>
            <div class="example">
              <div class="en">20. As a result / Consequently, ...</div>
              <div class="cn">因此/结果是，...</div>
            </div>
            <div class="example">
              <div class="en">21. Due to / Owing to ..., ...</div>
              <div class="cn">由于...，...</div>
            </div>
          </div>
          
          <div class="paragraph">
            <h3>💡 建议措施（3句）</h3>
            <div class="example">
              <div class="en">22. It is advisable to ...</div>
              <div class="cn">建议...</div>
            </div>
            <div class="example">
              <div class="en">23. We should take effective measures to ...</div>
              <div class="cn">我们应该采取有效措施来...</div>
            </div>
            <div class="example">
              <div class="en">24. Only by doing ... can we ...</div>
              <div class="cn">只有通过...我们才能...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p><strong>📅 生成日期：</strong>2026年6月8日</p>
      <p><strong>🎯 适用考试：</strong>英语六级（CET-6）</p>
      <p><strong>✨ 版本：</strong>Premium v2.2 Memory Enhanced Edition</p>
      <p style="margin-top: 15px; color: #999;">
        💪 祝你六级作文取得高分！加油！
      </p>
    </div>
  </div>
</body>
</html>
`;

// 邮件选项
const mailOptions = {
  from: '"考研效率平台" <2142744149@qq.com>',
  to: '2142744149@qq.com',
  subject: '✍️ 英语六级作文模板 - Premium记忆力强化版 v2.2',
  html: htmlContent
};

// 发送邮件
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('❌ 邮件发送失败:', error);
    process.exit(1);
  } else {
    console.log('✅ 邮件发送成功！');
    console.log('📧 邮件ID:', info.messageId);
    console.log('📨 已发送至: 2142744149@qq.com');
    console.log('\n📋 邮件内容包括：');
    console.log('  ✓ 3大作文框架（议论文/图表/书信）');
    console.log('  ✓ 每个框架的记忆技巧（口诀+联想+关键词）');
    console.log('  ✓ 24个万能句型速查表');
    console.log('  ✓ 精美的渐变配色设计');
    console.log('  ✓ 响应式布局，支持手机查看');
    process.exit(0);
  }
});
