#!/usr/bin/env node
/**
 * 操作系统知识点邮件发送脚本
 * 发送第2章四个小节的完整知识点到用户邮箱
 */

const nodemailer = require('nodemailer');

// 邮件配置
const transporter = nodemailer.createTransport({
  service: 'qq',
  auth: {
    user: '2142744149@qq.com',
    pass: 'ushjvvzxbhqfbjie'  // 授权码
  }
});

// 通用HTML邮件模板
function createEmailTemplate(title, content) {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      line-height: 1.6;
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
    
    .header h1 {
      font-size: 32px;
      margin-bottom: 10px;
      font-weight: 700;
    }
    
    .header .subtitle {
      font-size: 16px;
      opacity: 0.9;
    }
    
    .content {
      padding: 40px;
    }
    
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
    
    h4 {
      color: #333;
      font-size: 18px;
      margin: 20px 0 10px 0;
      font-weight: 600;
    }
    
    p {
      margin: 12px 0;
      color: #333;
      font-size: 15px;
    }
    
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
      font-size: 14px;
    }
    
    td {
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
      font-size: 14px;
    }
    
    tr:nth-child(even) {
      background: #f8f9fa;
    }
    
    tr:hover {
      background: #e3f2fd;
    }
    
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
    
    pre {
      background: #2d2d2d;
      color: #f8f8f2;
      padding: 20px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 15px 0;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 13px;
      line-height: 1.5;
    }
    
    code {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 13px;
      color: #e83e8c;
    }
    
    .emoji {
      font-size: 18px;
    }
    
    ul, ol {
      margin: 10px 0 10px 20px;
    }
    
    li {
      margin: 8px 0;
      font-size: 15px;
    }
    
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
    
    .badge-primary {
      background: #667eea;
      color: white;
    }
    
    .badge-success {
      background: #28a745;
      color: white;
    }
    
    .badge-warning {
      background: #ffc107;
      color: #333;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${title}</h1>
      <div class="subtitle">408操作系统 · 王道考研 · 完整知识点</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>📚 考研加油！祝你成功上岸浙江大学！</p>
      <p style="margin-top: 10px; font-size: 12px;">自动生成于 ${new Date().toLocaleString('zh-CN')}</p>
    </div>
  </div>
</body>
</html>
  `;
}

// 发送邮件函数
async function sendEmail(subject, htmlContent) {
  const mailOptions = {
    from: '"考研操作系统知识点" <2142744149@qq.com>',
    to: '2142744149@qq.com',
    subject: subject,
    html: htmlContent
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ 邮件发送成功: ${subject}`);
    console.log(`   Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`❌ 邮件发送失败: ${subject}`);
    console.error(`   Error: ${error.message}`);
    return false;
  }
}

// 2.1 进程与线程简介
const section21 = `
<h2>一、进程的概念 <span class="badge badge-primary">⭐⭐ 重点</span></h2>
<p><strong>定义</strong>：进程是程序的一次执行过程，是系统进行<span class="highlight">资源分配和调度</span>的基本单位</p>

<h3>进程 vs 程序</h3>
<table>
  <tr><th>对比项</th><th>程序</th><th>进程</th></tr>
  <tr><td>性质</td><td>静态的代码文件</td><td>动态的执行过程</td></tr>
  <tr><td>存在位置</td><td>磁盘上</td><td>内存中</td></tr>
  <tr><td>生命周期</td><td>永久存在</td><td>临时存在（创建→运行→终止）</td></tr>
  <tr><td>组成</td><td>代码+数据</td><td>程序段+数据段+PCB</td></tr>
</table>

<h2>二、进程的特征 <span class="badge badge-warning">⭐⭐ 必考</span></h2>
<h3>1. 动态性（最基本特征）</h3>
<p>进程是"活"的，程序是"死"的</p>

<h3>2. 并发性</h3>
<p>宏观上：多个进程同时执行；微观上：进程交替执行</p>

<h3>3. 独立性</h3>
<p>每个进程有独立的地址空间，进程间互不干扰</p>

<h3>4. 异步性</h3>
<p>进程按各自独立的、不可预知的速度向前推进</p>

<h3>5. 结构性</h3>
<p>进程由<strong>程序段、数据段和PCB</strong>三部分组成</p>

<h2>三、进程的组成 <span class="badge badge-primary">⭐⭐ 重点</span></h2>
<h3>进程控制块PCB <span class="badge badge-warning">⭐⭐⭐ 必考</span></h3>
<p><strong>定义</strong>：系统感知进程存在的<strong>唯一标志</strong></p>

<table>
  <tr><th>信息类型</th><th>具体内容</th></tr>
  <tr><td>进程标识符</td><td>PID（进程ID）、PPID（父进程ID）</td></tr>
  <tr><td>处理机状态</td><td>通用寄存器、指令计数器、程序状态字PSW</td></tr>
  <tr><td>进程调度信息</td><td>进程状态、优先级、等待时间</td></tr>
  <tr><td>进程控制信息</td><td>程序和数据的地址、资源清单、同步机制</td></tr>
</table>

<h2>四、进程的状态与转换 <span class="badge badge-warning">⭐⭐⭐ 必考</span></h2>
<h3>三状态模型</h3>
<table>
  <tr><th>状态</th><th>说明</th><th>特征</th></tr>
  <tr><td>就绪态</td><td>已获得除CPU外的所有资源</td><td>万事俱备，只欠CPU</td></tr>
  <tr><td>运行态</td><td>已获得CPU，正在执行</td><td>正在使用CPU</td></tr>
  <tr><td>阻塞态</td><td>因等待某事件而暂停</td><td>等待I/O、信号量等</td></tr>
</table>

<div class="important">
  <strong>重要规则</strong><br>
  ❌ 阻塞 → 运行：不可能！必须先经过就绪态<br>
  ❌ 就绪 → 阻塞：不可能！只有运行态才能阻塞
</div>

<h2>五、线程的概念 <span class="badge badge-primary">⭐⭐ 重点</span></h2>
<h3>线程 vs 进程 <span class="badge badge-warning">⭐⭐ 必考</span></h3>
<table>
  <tr><th>对比项</th><th>进程</th><th>线程</th></tr>
  <tr><td>资源拥有</td><td>独立拥有资源</td><td>共享进程资源</td></tr>
  <tr><td>调度单位</td><td>不是（传统OS）</td><td>是</td></tr>
  <tr><td>并发性</td><td>较低</td><td>更高</td></tr>
  <tr><td>系统开销</td><td>大（创建/切换）</td><td>小</td></tr>
  <tr><td>独立性</td><td>高（独立地址空间）</td><td>低（共享地址空间）</td></tr>
</table>

<div class="tip">
  <strong>💡 学习提示</strong><br>
  ✅ 进程的特征是高频考点<br>
  ✅ PCB的内容和作用必考<br>
  ✅ 三状态模型的转换图必须掌握<br>
  ✅ 进程vs线程的对比常考选择题
</div>
`;

// 2.2 CPU调度
const section22 = `
<h2>一、调度的基本概念</h2>
<h3>三级调度</h3>
<table>
  <tr><th>调度级别</th><th>名称</th><th>频率</th><th>说明</th></tr>
  <tr><td>高级调度</td><td>作业调度</td><td>低（分钟级）</td><td>从外存→内存，创建进程</td></tr>
  <tr><td>中级调度</td><td>内存调度</td><td>中</td><td>内存↔外存交换（挂起/激活）</td></tr>
  <tr><td>低级调度</td><td>进程调度</td><td>高（毫秒级）</td><td>从就绪队列选择进程分配CPU</td></tr>
</table>

<div class="important">
  <strong>注意</strong><br>
  ✅ 低级调度是OS必须具有的调度<br>
  ❌ 高级和中级调度不是必须的
</div>

<h2>二、调度时机 <span class="badge badge-primary">⭐ 重点</span></h2>
<table>
  <tr><th>时机</th><th>类型</th><th>说明</th></tr>
  <tr><td>进程终止</td><td>主动</td><td>进程执行完毕</td></tr>
  <tr><td>进程阻塞</td><td>主动</td><td>等待I/O、信号量</td></tr>
  <tr><td>时间片用完</td><td>被动</td><td>RR算法</td></tr>
  <tr><td>更高优先级进程到达</td><td>被动</td><td>抢占式调度</td></tr>
</table>

<h2>三、调度方式</h2>
<table>
  <tr><th>方式</th><th>说明</th><th>特点</th></tr>
  <tr><td>非抢占式</td><td>一旦分配CPU就一直运行，直到主动放弃</td><td>简单、开销小</td></tr>
  <tr><td>抢占式</td><td>可以暂停正在执行的进程</td><td>灵活、响应快</td></tr>
</table>

<h2>四、CPU调度算法 <span class="badge badge-warning">⭐⭐⭐ 必考</span></h2>

<h3>1. 先来先服务（FCFS）</h3>
<p><strong>原理</strong>：按进程到达的先后顺序调度</p>
<ul>
  <li>✅ 简单、公平</li>
  <li>❌ 对短作业不利（护航效应）</li>
  <li>❌ 平均等待时间长</li>
</ul>

<h3>2. 短作业优先（SJF）</h3>
<p><strong>原理</strong>：优先调度运行时间短的作业</p>
<ul>
  <li>✅ 平均等待时间最短（最优）</li>
  <li>❌ 对长作业不利（可能饥饿）</li>
  <li>❌ 难以预知运行时间</li>
</ul>

<h3>3. 高响应比优先（HRRN）</h3>
<p><strong>响应比公式</strong>：</p>
<pre>响应比 = (等待时间 + 要求服务时间) / 要求服务时间
       = 1 + 等待时间 / 要求服务时间</pre>

<h3>4. 时间片轮转（RR）</h3>
<p><strong>原理</strong>：每个进程分配一个时间片，轮流执行</p>
<ul>
  <li>✅ 公平、响应快</li>
  <li>✅ 适合分时系统</li>
  <li>❌ 时间片大小影响性能</li>
</ul>

<h3>5. 多级反馈队列（MLFQ）<span class="badge badge-primary">⭐⭐ 重点</span></h3>
<p><strong>规则</strong>：</p>
<ol>
  <li>新进程进入队列1（最高优先级）</li>
  <li>队列1采用RR，时间片最小</li>
  <li>时间片用完未完成，降级到下一队列</li>
  <li>高优先级队列为空时，才调度低优先级队列</li>
  <li>新进程到达可抢占低优先级进程</li>
</ol>

<h2>五、调度算法对比 <span class="badge badge-warning">⭐⭐ 必考</span></h2>
<table>
  <tr><th>算法</th><th>公平性</th><th>效率</th><th>响应时间</th><th>实现难度</th></tr>
  <tr><td>FCFS</td><td>公平</td><td>低</td><td>差</td><td>简单</td></tr>
  <tr><td>SJF</td><td>不公平</td><td>高</td><td>较好</td><td>中等</td></tr>
  <tr><td>HRRN</td><td>较公平</td><td>较高</td><td>好</td><td>中等</td></tr>
  <tr><td>RR</td><td>公平</td><td>中等</td><td>好</td><td>简单</td></tr>
  <tr><td>MLFQ</td><td>较公平</td><td>高</td><td>好</td><td>复杂</td></tr>
</table>

<div class="tip">
  <strong> 学习提示</strong><br>
  ✅ 调度算法的计算题必考（周转时间、等待时间）<br>
  ✅ 掌握每种算法的优缺点<br>
  ✅ 理解多级反馈队列的工作原理<br>
  ✅ 会画甘特图分析调度过程
</div>
`;

// 2.3 同步与互斥
const section23 = `
<h2>一、基本概念</h2>

<h3>临界资源</h3>
<p>一次仅允许一个进程使用的资源（如打印机、共享变量）</p>

<h3>临界区</h3>
<p>进程中访问临界资源的那段代码</p>

<h3>互斥 vs 同步</h3>
<table>
  <tr><th>对比项</th><th>互斥</th><th>同步</th></tr>
  <tr><td>本质</td><td>间接制约关系（竞争关系）</td><td>直接制约关系（合作关系）</td></tr>
  <tr><td>示例</td><td>打印机同一时刻只能一个进程使用</td><td>生产后才能消费</td></tr>
</table>

<h2>二、实现临界区互斥的方法 <span class="badge badge-primary">⭐⭐ 重点</span></h2>

<h3>软件方法</h3>
<h4>Peterson算法 <span class="badge badge-warning">⭐ 经典</span></h4>
<pre>flag[i] = true;        // 我想进入
turn = j;              // 让你优先
while (flag[j] && turn == j);  // 如果你也想且你优先，则等待
critical section;
flag[i] = false;</pre>

<h3>硬件方法</h3>
<ul>
  <li><strong>中断屏蔽方法</strong>：关中断→临界区→开中断</li>
  <li><strong>TestAndSet指令</strong>：原子操作，测试并设置</li>
  <li><strong>Swap指令</strong>：交换两个变量的值（原子操作）</li>
</ul>

<h2>三、信号量机制 <span class="badge badge-warning">⭐⭐⭐ 必考</span></h2>

<h3>记录型信号量 <span class="badge badge-primary">⭐ 重要</span></h3>
<p><strong>P操作（wait）</strong>：</p>
<pre>void wait(semaphore S) {
    S.value--;           // 申请一个资源
    if (S.value < 0) {   // 无可用资源
        block(S.L);      // 阻塞，加入等待队列
    }
}</pre>

<p><strong>V操作（signal）</strong>：</p>
<pre>void signal(semaphore S) {
    S.value++;           // 释放一个资源
    if (S.value <= 0) {  // 有进程在等待
        wakeup(S.L);     // 唤醒一个等待进程
    }
}</pre>

<div class="important">
  <strong>value的含义</strong><br>
  • value > 0：可用资源数量<br>
  • value = 0：无可用资源，但无等待进程<br>
  • value < 0：|value| 表示等待进程数
</div>

<h2>四、经典同步问题 <span class="badge badge-warning">⭐⭐⭐ 必考</span></h2>

<h3>1. 生产者-消费者问题</h3>
<p><strong>信号量设置</strong>：</p>
<ul>
  <li>mutex = 1：互斥访问缓冲区</li>
  <li>empty = n：空闲缓冲区数量</li>
  <li>full = 0：已用缓冲区数量</li>
</ul>

<div class="warning">
  <strong>⚠️ 注意</strong>：P操作的顺序不能颠倒！先P资源信号量，再P互斥信号量，否则可能导致死锁
</div>

<h3>2. 读者-写者问题</h3>
<ul>
  <li><strong>读者优先</strong>：只要有读者在读，写者就必须等待（写者可能饥饿）</li>
  <li><strong>写者优先</strong>：一旦有写者等待，后续读者必须等待</li>
</ul>

<h3>3. 哲学家进餐问题</h3>
<p><strong>问题</strong>：可能死锁（所有人都拿起左筷）</p>
<p><strong>解决方案</strong>：</p>
<ol>
  <li>限制同时进餐人数：最多4人</li>
  <li>奇偶策略：奇数号先左后右，偶数号先右后左</li>
  <li>AND信号量：同时申请两根筷子</li>
</ol>

<div class="tip">
  <strong>💡 学习提示</strong><br>
  ✅ 信号量的P、V操作是核心考点<br>
  ✅ 三个经典问题必考（会写伪代码）<br>
  ✅ 理解互斥和同步的区别<br>
  ✅ 掌握Peterson算法的原理
</div>
`;

// 2.4 死锁
const section24 = `
<h2>一、死锁的概念</h2>
<p><strong>定义</strong>：多个进程因竞争资源而造成的一种<strong>僵局</strong>，若无外力作用，这些进程都将无法向前推进</p>

<h2>二、死锁产生的条件 <span class="badge badge-warning">⭐⭐ 必考</span></h2>
<p><strong>四个必要条件</strong>（缺一不可）：</p>

<table>
  <tr><th>条件</th><th>含义</th><th>示例</th></tr>
  <tr><td>互斥条件</td><td>资源只能被一个进程独占使用</td><td>打印机、磁带机</td></tr>
  <tr><td>请求和保持条件</td><td>进程已保持至少一个资源，但又提出新的资源请求</td><td>持有R1，请求R2</td></tr>
  <tr><td>不剥夺条件</td><td>进程已获得的资源在未使用完之前不能被剥夺</td><td>只能由进程自己释放</td></tr>
  <tr><td>循环等待条件</td><td>存在进程等待环路</td><td>P1→P2→P3→P1</td></tr>
</table>

<div class="important">
  <strong>重要结论</strong><br>
  ✅ 四个条件<strong>同时满足</strong>才会发生死锁<br>
  ❌ 破坏任一条件即可预防死锁
</div>

<h2>三、预防死锁 <span class="badge badge-primary">⭐⭐ 重点</span></h2>
<p><strong>思想</strong>：破坏四个必要条件之一</p>

<h3>破坏循环等待条件 <span class="badge badge-warning">⭐ 常用</span></h3>
<p><strong>方法</strong>：顺序资源分配法</p>
<ul>
  <li>给所有资源编号</li>
  <li>进程只能按递增顺序申请资源</li>
</ul>

<h2>四、死锁避免（银行家算法）<span class="badge badge-warning">⭐⭐⭐ 必考</span></h2>

<h3>安全状态 vs 不安全状态</h3>
<table>
  <tr><th>状态</th><th>说明</th></tr>
  <tr><td>安全状态</td><td>系统能按某种顺序为每个进程分配资源，直至满足每个进程的最大需求</td></tr>
  <tr><td>不安全状态</td><td>不存在安全序列，<strong>不一定</strong>发生死锁，但可能发生</td></tr>
</table>

<div class="important">
  <strong>关系</strong><br>
  ✅ 安全状态 → 一定无死锁<br>
  ❌ 不安全状态 → 可能有死锁
</div>

<h3>银行家算法的数据结构</h3>
<table>
  <tr><th>数据结构</th><th>类型</th><th>说明</th></tr>
  <tr><td>Available</td><td>vector[m]</td><td>每类资源的可用数量</td></tr>
  <tr><td>Max</td><td>matrix[n×m]</td><td>每个进程的最大需求</td></tr>
  <tr><td>Allocation</td><td>matrix[n×m]</td><td>每个进程已分配的资源</td></tr>
  <tr><td>Need</td><td>matrix[n×m]</td><td>每个进程还需要的资源</td></tr>
</table>

<p><strong>关系</strong>：Need[i][j] = Max[i][j] - Allocation[i][j]</p>

<h3>银行家算法步骤</h3>
<pre>Step 1: 检查 Request[i] ≤ Need[i] ?
        是 → 继续
        否 → 报错（超出最大需求）

Step 2: 检查 Request[i] ≤ Available ?
        是 → 继续
        否 → Pi等待（资源不足）

Step 3: 试探性分配
        Available = Available - Request[i]
        Allocation[i] = Allocation[i] + Request[i]
        Need[i] = Need[i] - Request[i]

Step 4: 执行安全性算法
        是安全状态 → 正式分配
        是不安全状态 → 恢复原状态，Pi等待</pre>

<h3>安全性算法</h3>
<pre>1. Work = Available, Finish[i] = false
2. 寻找满足以下条件的进程i：
   Finish[i] == false && Need[i] ≤ Work
   如果找到，执行步骤3；否则执行步骤4
3. Work = Work + Allocation[i]
   Finish[i] = true
   跳转到步骤2
4. 如果所有Finish[i] == true，则系统处于安全状态</pre>

<h2>五、死锁检测与解除</h2>

<h3>死锁检测</h3>
<p>使用资源分配图检测是否存在环路</p>

<h3>死锁解除方法</h3>
<ol>
  <li><strong>资源剥夺法</strong>：从某些进程剥夺足够资源给死锁进程</li>
  <li><strong>撤销进程法</strong>：终止一个或多个死锁进程</li>
  <li><strong>进程回退法</strong>：让进程回退到足以解除死锁的 Checkpoint</li>
</ol>

<div class="tip">
  <strong>💡 学习提示</strong><br>
  ✅ 死锁的四个必要条件是选择题高频考点<br>
  ✅ 银行家算法的计算题必考<br>
  ✅ 会判断系统是否处于安全状态<br>
  ✅ 理解预防、避免、检测的区别
</div>
`;

// 主函数
async function main() {
  console.log('🚀 开始发送操作系统知识点邮件...\n');

  const emails = [
    {
      subject: '【408操作系统】2.1 进程与线程简介 - 完整知识点',
      content: section21
    },
    {
      subject: '【408操作系统】2.2 CPU调度 - 完整知识点',
      content: section22
    },
    {
      subject: '【408操作系统】2.3 同步与互斥 - 完整知识点',
      content: section23
    },
    {
      subject: '【408操作系统】2.4 死锁 - 完整知识点',
      content: section24
    }
  ];

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    console.log(`📧 [${i + 1}/4] 正在发送: ${email.subject}`);
    
    const htmlContent = createEmailTemplate(email.subject.replace('【408操作系统】', ''), email.content);
    const success = await sendEmail(email.subject, htmlContent);
    
    if (success) {
      console.log(`   ✅ 发送成功！\n`);
      // 每封邮件间隔2秒，避免被QQ邮箱限制
      if (i < emails.length - 1) {
        console.log('   ⏳ 等待2秒后发送下一封...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } else {
      console.log(`   ❌ 发送失败\n`);
    }
  }

  console.log('\n✨ 所有邮件发送完成！');
  console.log('📮 请检查你的QQ邮箱收件箱');
}

// 运行
main().catch(console.error);
