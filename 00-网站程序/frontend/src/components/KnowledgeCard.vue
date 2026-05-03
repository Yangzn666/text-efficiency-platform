<template>
  <el-dialog
    v-model="visible"
    :title="currentCard?.title || '💡 知识点卡片'"
    width="800px"
    :close-on-click-modal="false"
    destroy-on-close
    class="knowledge-card-dialog"
  >
    <div class="knowledge-card-content">
      <!-- 汇编语言与机器语言 -->
      <template v-if="currentCard?.id === 'assembly'">
      
      <div class="card-section">
        <h4>🔢 机器语言（Machine Language）</h4>
        <ul>
          <li><strong>计算机唯一能直接理解的语言</strong></li>
          <li>由 <strong>0 和 1</strong> 组成的二进制代码</li>
          <li>每条指令对应一个基本操作</li>
          <li>例如：<code>10110000 01100001</code> （表示把数字 97 放入寄存器）</li>
        </ul>
        
        <div class="pros-cons">
          <div class="cons">
            <strong>缺点：</strong>
            <ul>
              <li>❌ 人类难以阅读和理解</li>
              <li>❌ 容易出错，调试困难</li>
              <li> 不同CPU的机器语言不同</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="card-section">
        <h4> 汇编语言（Assembly Language）</h4>
        <ul>
          <li><strong>机器语言的符号化表示</strong></li>
          <li>用<strong>助记符</strong>代替二进制代码</li>
          <li>例如：<code>MOV AL, 61h</code> （把十六进制数61放入AL寄存器）</li>
        </ul>
        
        <div class="pros-cons">
          <div class="pros">
            <strong>优点：</strong>
            <ul>
              <li>✅ 比机器语言更易读</li>
              <li>✅ 保留了机器语言的高效性</li>
              <li>✅ 可以直接控制硬件</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="card-section">
        <h4>🔄 两者的关系</h4>
        <div class="flow-diagram">
          <div class="flow-step">汇编语言</div>
          <div class="flow-arrow">──[汇编器]──&gt;</div>
          <div class="flow-step">机器语言</div>
          <div class="flow-arrow">──[CPU执行]──&gt;</div>
          <div class="flow-step">结果</div>
        </div>
        <div class="flow-example">
          <code>MOV AL, 61h</code> → <code>10110000 01100001</code> → <code>执行操作</code>
        </div>
      </div>
      
      <div class="card-section">
        <h4>📊 具体对应关系示例</h4>
        <el-table :data="examples" border stripe style="width: 100%">
          <el-table-column prop="assembly" label="汇编语言" width="180" />
          <el-table-column prop="binary" label="机器语言（二进制）" width="200" />
          <el-table-column prop="hex" label="机器语言（十六进制）" width="150" />
          <el-table-column prop="meaning" label="含义" />
        </el-table>
      </div>
      
      <div class="card-section">
        <h4>🎯 关键要点</h4>
        <ol>
          <li><strong>一一对应</strong>：每条汇编指令对应一条机器指令</li>
          <li><strong>低级语言</strong>：两者都是低级语言，接近硬件</li>
          <li><strong>需要翻译</strong>：汇编语言必须通过<strong>汇编器（Assembler）</strong>翻译成机器语言</li>
          <li><strong>高效性</strong>：执行效率高，但开发效率低</li>
        </ol>
      </div>
      
      <div class="card-section">
        <h4>💡 现代编程中的位置</h4>
        <div class="flow-diagram vertical">
          <div class="flow-step">高级语言（C/Java/Python）</div>
          <div class="flow-arrow">↓ [编译器]</div>
          <div class="flow-step highlight">汇编语言</div>
          <div class="flow-arrow">↓ [汇编器]</div>
          <div class="flow-step">机器语言（0和1）</div>
          <div class="flow-arrow">↓ [CPU执行]</div>
          <div class="flow-step">硬件操作</div>
        </div>
      </div>
      
      <div class="card-section importance">
        <h4> 考研重点</h4>
        <p>在《计算机组成原理》指令系统章节中，理解汇编语言和机器语言的关系是基础，有助于：</p>
        <ul>
          <li>✅ 理解程序底层运行机制</li>
          <li>✅ 理解CPU指令执行过程</li>
          <li>✅ 理解编译原理的基础</li>
          <li>✅ 理解计算机体系结构</li>
        </ul>
      </div>
      </template>
      
      <!-- 晶体管 vs 电子管 -->
      <template v-if="currentCard?.id === 'transistor'">
        <h3> 晶体管 vs 电子管</h3>
        
        <div class="card-section">
          <h4>🔥 电子管（Vacuum Tube）- 第一代计算机</h4>
          <ul>
            <li><strong>工作原理</strong>：利用真空中的电子流动控制电流</li>
            <li><strong>体积</strong>：非常大（像灯泡一样大）</li>
            <li><strong>功耗</strong>：极高（需要加热灯丝）</li>
            <li><strong>寿命</strong>：很短（容易烧坏）</li>
            <li><strong>速度</strong>：较慢（毫秒级）</li>
            <li><strong>发热</strong>：严重（需要庞大冷却系统）</li>
          </ul>
          
          <div class="pros-cons">
            <div class="cons">
              <strong>缺点：</strong>
              <ul>
                <li>❌ 体积庞大（ENIAC占地167平方米）</li>
                <li>❌ 功耗极高（150千瓦）</li>
                <li>❌ 可靠性差（每天烧坏几个电子管）</li>
                <li>❌ 速度慢（千次/秒）</li>
                <li>❌ 成本高</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="card-section">
          <h4> 晶体管（Transistor）- 第二代计算机</h4>
          <ul>
            <li><strong>工作原理</strong>：利用半导体材料控制电流</li>
            <li><strong>体积</strong>：极小（米粒大小）</li>
            <li><strong>功耗</strong>：极低（不需要加热）</li>
            <li><strong>寿命</strong>：很长（不易损坏）</li>
            <li><strong>速度</strong>：快（微秒级，比电子管快1000倍）</li>
            <li><strong>发热</strong>：很小</li>
          </ul>
          
          <div class="pros-cons">
            <div class="pros">
              <strong>优点：</strong>
              <ul>
                <li>✅ 体积缩小1000倍</li>
                <li>✅ 功耗降低100倍</li>
                <li>✅ 可靠性提高100倍</li>
                <li>✅ 速度快1000倍</li>
                <li>✅ 成本大幅降低</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="card-section">
          <h4>📊 性能对比</h4>
          <el-table :data="comparisonData" border stripe style="width: 100%">
            <el-table-column prop="aspect" label="对比项" width="120" />
            <el-table-column prop="vacuum" label="电子管" width="150" />
            <el-table-column prop="transistor" label="晶体管" width="150" />
            <el-table-column prop="improvement" label="提升倍数" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>🚀 为什么第二代计算机快了那么多？</h4>
          <ol>
            <li><strong>开关速度快</strong>：晶体管开关速度是电子管的1000倍</li>
            <li><strong>无需预热</strong>：电子管需要加热灯丝，晶体管即开即用</li>
            <li><strong>集成度提高</strong>：可以制造更复杂的电路</li>
            <li><strong>信号传输快</strong>：半导体中电子移动更快</li>
            <li><strong>可靠性高</strong>：减少了故障和重启时间</li>
          </ol>
        </div>
        
        <div class="card-section">
          <h4> 典型计算机对比</h4>
          <div class="flow-diagram">
            <div class="flow-step">
              <strong>ENIAC（1946）</strong><br>
              电子管<br>
              5000次/秒<br>
              167㎡
            </div>
            <div class="flow-arrow">→ → →</div>
            <div class="flow-step highlight">
              <strong>IBM 7094（1962）</strong><br>
              晶体管<br>
              20万次/秒<br>
              仅占几个机柜
            </div>
          </div>
          <p style="text-align: center; margin-top: 12px; color: #606266;">
            <strong>速度提升了40倍！</strong>
          </p>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》计算机发展章节中，理解计算机代际划分的关键技术：</p>
          <ul>
            <li>✅ 第一代（1946-1957）：电子管</li>
            <li>✅ 第二代（1958-1964）：晶体管</li>
            <li>✅ 第三代（1965-1970）：集成电路</li>
            <li>✅ 第四代（1971-至今）：大规模集成电路</li>
          </ul>
        </div>
      </template>
      
      <!-- 集成电路 -->
      <template v-if="currentCard?.id === 'ic'">
        <h3> 集成电路（Integrated Circuit）</h3>
        
        <div class="card-section">
          <h4>💡 什么是集成电路？</h4>
          <ul>
            <li><strong>定义</strong>：将多个晶体管、电阻、电容等元件集成在一块半导体芯片上</li>
            <li><strong>发明时间</strong>：1958年（Jack Kilby 和 Robert Noyce）</li>
            <li><strong>核心技术</strong>：光刻技术、半导体工艺</li>
            <li><strong>特点</strong>：体积小、重量轻、可靠性高、成本低</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4> 为什么集成电路是巨大进步？</h4>
          
          <div class="pros-cons">
            <div class="pros">
              <strong>核心优势：</strong>
              <ol>
                <li><strong>集成度提高</strong>：一块芯片可以包含数百万到数十亿个晶体管</li>
                <li><strong>体积大幅缩小</strong>：从房间大小到手掌大小</li>
                <li><strong>功耗降低</strong>：元件间距小，信号传输距离短</li>
                <li><strong>速度提升</strong>：信号传输延迟减少</li>
                <li><strong>可靠性提高</strong>：减少焊接点和连接线</li>
                <li><strong>成本降低</strong>：批量生产，单位成本下降</li>
              </ol>
            </div>
          </div>
        </div>
        
        <div class="card-section">
          <h4> 集成电路如何提升计算机性能？</h4>
          <ol>
            <li><strong>元件间距缩小</strong>
              <ul>
                <li>信号传输距离缩短 → 延迟减少</li>
                <li>寄生电容减小 → 开关速度加快</li>
              </ul>
            </li>
            <li><strong>并行处理能力</strong>
              <ul>
                <li>可以集成更多功能单元</li>
                <li>支持多核处理器</li>
              </ul>
            </li>
            <li><strong>存储密度提高</strong>
              <ul>
                <li>内存容量大幅增加</li>
                <li>缓存可以更大</li>
              </ul>
            </li>
            <li><strong>专用电路</strong>
              <ul>
                <li>可以设计专门的加速器（GPU、AI芯片）</li>
                <li>提高特定任务的性能</li>
              </ul>
            </li>
            <li><strong>摩尔定律</strong>
              <ul>
                <li>每18-24个月，芯片上的晶体管数量翻番</li>
                <li>性能持续提升，成本持续下降</li>
              </ul>
            </li>
          </ol>
        </div>
        
        <div class="card-section">
          <h4>📊 代际对比</h4>
          <el-table :data="icComparisonData" border stripe style="width: 100%">
            <el-table-column prop="generation" label="代际" width="100" />
            <el-table-column prop="tech" label="核心技术" width="150" />
            <el-table-column prop="transistors" label="晶体管数量" width="150" />
            <el-table-column prop="example" label="典型产品" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4> 典型性能提升</h4>
          <div class="flow-diagram">
            <div class="flow-step">
              <strong>晶体管时代</strong><br>
              几百个元件<br>
              几kHz<br>
              占几个机柜
            </div>
            <div class="flow-arrow">→ → →</div>
            <div class="flow-step highlight">
              <strong>集成电路时代</strong><br>
              数十亿元件<br>
              几GHz<br>
              手指大小
            </div>
          </div>
          <p style="text-align: center; margin-top: 12px; color: #606266;">
            <strong>体积缩小100万倍，性能提升100万倍！</strong>
          </p>
        </div>
        
        <div class="card-section">
          <h4> 摩尔定律的推动</h4>
          <ul>
            <li><strong>1965年</strong>：Gordon Moore 提出摩尔定律</li>
            <li><strong>预测</strong>：芯片上的晶体管数量每18-24个月翻番</li>
            <li><strong>结果</strong>：从1971年的2300个晶体管（Intel 4004）到现在的数百亿个</li>
            <li><strong>影响</strong>：计算机性能持续提升，价格持续下降</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》计算机发展章节中：</p>
          <ul>
            <li>✅ 理解集成电路的定义和特点</li>
            <li>✅ 掌握集成电路如何提升计算机性能</li>
            <li>✅ 理解摩尔定律及其影响</li>
            <li>✅ 了解大规模集成电路和超大规模集成电路的区别</li>
          </ul>
        </div>
      </template>
      
      <!-- 以存储器为核心的计算机结构 -->
      <template v-if="currentCard?.id === 'storage'">
        <h3> 为什么现代计算机结构以存储器为核心？</h3>
        
        <div class="card-section">
          <h4> 冯·诺依曼结构的演变</h4>
          <ul>
            <li><strong>早期计算机</strong>：以运算器（CPU）为中心</li>
            <li><strong>现代计算机</strong>：以存储器为中心</li>
            <li><strong>原因</strong>：存储器成为性能瓶颈和系统核心</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4> 为什么以存储器为核心？</h4>
          
          <div class="pros-cons">
            <div class="pros">
              <strong>核心原因：</strong>
              <ol>
                <li><strong>冯·诺依曼瓶颈</strong>
                  <ul>
                    <li>CPU速度远快于存储器访问速度</li>
                    <li>数据必须从存储器取到CPU才能处理</li>
                    <li>存储器成为系统性能的关键瓶颈</li>
                  </ul>
                </li>
                <li><strong>程序和数据都存储在存储器中</strong>
                  <ul>
                    <li>指令和数据统一编址</li>
                    <li>存储器是程序和数据的唯一来源</li>
                  </ul>
                </li>
                <li><strong>存储器层次结构复杂</strong>
                  <ul>
                    <li>寄存器 → Cache → 主存 → 外存</li>
                    <li>需要精心设计存储层次以优化性能</li>
                  </ul>
                </li>
                <li><strong>存储器容量决定系统能力</strong>
                  <ul>
                    <li>内存大小影响多任务处理能力</li>
                    <li>存储容量限制程序规模和数据量</li>
                  </ul>
                </li>
              </ol>
            </div>
          </div>
        </div>
        
        <div class="card-section">
          <h4> 存储器核心地位的具体体现</h4>
          <ol>
            <li><strong>总线结构以存储器为中心</strong>
              <ul>
                <li>CPU、I/O设备都通过总线访问存储器</li>
                <li>存储器是数据交换的枢纽</li>
              </ul>
            </li>
            <li><strong>Cache层次结构</strong>
              <ul>
                <li>L1 Cache、L2 Cache、L3 Cache</li>
                <li>减少CPU等待时间</li>
              </ul>
            </li>
            <li><strong>虚拟存储器</strong>
              <ul>
                <li>扩展主存容量</li>
                <li>提供统一的地址空间</li>
              </ul>
            </li>
            <li><strong>存储器管理单元（MMU）</strong>
              <ul>
                <li>地址转换</li>
                <li>内存保护</li>
              </ul>
            </li>
          </ol>
        </div>
        
        <div class="card-section">
          <h4> 性能瓶颈分析</h4>
          <el-table :data="bottleneckData" border stripe style="width: 100%">
            <el-table-column prop="component" label="组件" width="120" />
            <el-table-column prop="speed" label="访问速度" width="150" />
            <el-table-column prop="latency" label="延迟" width="120" />
            <el-table-column prop="impact" label="对性能的影响" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4> 现代解决方案</h4>
          <ol>
            <li><strong>多级Cache</strong>：减少CPU等待时间</li>
            <li><strong>预取技术</strong>：提前将数据加载到Cache</li>
            <li><strong>乱序执行</strong>：CPU可以执行其他指令等待数据</li>
            <li><strong>多核并行</strong>：多个核心同时工作</li>
            <li><strong>内存控制器集成</strong>：CPU内部集成内存控制器</li>
            <li><strong>高速总线</strong>：提高存储器带宽</li>
          </ol>
        </div>
        
        <div class="card-section">
          <h4> 对比：传统 vs 现代结构</h4>
          <div class="flow-diagram">
            <div class="flow-step">
              <strong>传统结构</strong><br>
              CPU为中心<br>
              数据流向CPU<br>
              简单总线
            </div>
            <div class="flow-arrow">→ → →</div>
            <div class="flow-step highlight">
              <strong>现代结构</strong><br>
              存储器为中心<br>
              数据在存储层次中流动<br>
              复杂存储层次
            </div>
          </div>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》中，理解存储器核心地位是重点：</p>
          <ul>
            <li>✅ 掌握冯·诺依曼结构的特点</li>
            <li>✅ 理解存储器为什么成为系统核心</li>
            <li>✅ 掌握存储器层次结构的设计</li>
            <li>✅ 理解Cache、虚拟存储器的作用</li>
            <li>✅ 了解现代计算机的性能优化技术</li>
          </ul>
        </div>
      </template>
      
      <!-- 编译器 vs 解释器 -->
      <template v-if="currentCard?.id === 'compiler'">
        <h3> 编译器 vs 解释器</h3>
        
        <div class="card-section">
          <h4> 什么是编译器（Compiler）？</h4>
          <ul>
            <li><strong>工作方式</strong>：将整个源代码一次性翻译成机器语言</li>
            <li><strong>执行时机</strong>：先编译，后执行</li>
            <li><strong>输出</strong>：生成可执行文件（.exe, .out等）</li>
            <li><strong>典型语言</strong>：C、C++、Rust、Go</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4> 什么是解释器（Interpreter）？</h4>
          <ul>
            <li><strong>工作方式</strong>：逐行读取源代码并立即执行</li>
            <li><strong>执行时机</strong>：边解释，边执行</li>
            <li><strong>输出</strong>：不生成可执行文件，直接运行</li>
            <li><strong>典型语言</strong>：Python、JavaScript、Ruby、PHP</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4> 核心区别对比</h4>
          <el-table :data="compilerComparisonData" border stripe style="width: 100%">
            <el-table-column prop="aspect" label="对比项" width="120" />
            <el-table-column prop="compiler" label="编译器" width="180" />
            <el-table-column prop="interpreter" label="解释器" width="180" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4> 工作流程对比</h4>
          <div class="flow-diagram">
            <div class="flow-step">
              <strong>编译器</strong><br>
              源代码<br>
              ↓ [编译]<br>
              机器码<br>
              ↓ [执行]<br>
              结果
            </div>
            <div class="flow-arrow">VS</div>
            <div class="flow-step highlight">
              <strong>解释器</strong><br>
              源代码<br>
              ↓ [解释+执行]<br>
              逐行处理<br>
              ↓<br>
              结果
            </div>
          </div>
        </div>
        
        <div class="card-section">
          <h4> 各自的优缺点</h4>
          
          <div class="pros-cons">
            <div class="pros">
              <strong>编译器优点：</strong>
              <ul>
                <li>✅ 执行速度快（已翻译成机器码）</li>
                <li>✅ 可以优化代码</li>
                <li>✅ 不依赖源代码运行</li>
                <li>✅ 适合大型项目</li>
              </ul>
              <strong>缺点：</strong>
              <ul>
                <li>❌ 编译时间长</li>
                <li> 跨平台需要重新编译</li>
                <li>❌ 调试相对困难</li>
              </ul>
            </div>
            
            <div class="cons">
              <strong>解释器优点：</strong>
              <ul>
                <li>✅ 跨平台性好</li>
                <li>✅ 开发调试快速</li>
                <li>✅ 可以动态执行代码</li>
                <li>✅ 适合脚本和快速原型</li>
              </ul>
              <strong>缺点：</strong>
              <ul>
                <li>❌ 执行速度慢</li>
                <li>❌ 需要解释器环境</li>
                <li>❌ 无法提前优化</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="card-section">
          <h4> 现代混合方式</h4>
          <ul>
            <li><strong>JIT编译（Just-In-Time）</strong>：Java、C#等采用
              <ul>
                <li>先编译成字节码</li>
                <li>运行时即时编译成机器码</li>
                <li>兼顾两者优点</li>
              </ul>
            </li>
            <li><strong>AOT编译（Ahead-Of-Time）</strong>：提前编译
              <ul>
                <li>如TypeScript编译成JavaScript</li>
                <li>提高运行时性能</li>
              </ul>
            </li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4> 典型应用场景</h4>
          <ul>
            <li><strong>编译器</strong>：系统软件、游戏引擎、性能关键应用</li>
            <li><strong>解释器</strong>：Web开发、数据分析、脚本自动化</li>
            <li><strong>JIT</strong>：企业应用、移动应用、跨平台开发</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》和《编译原理》中：</p>
          <ul>
            <li>✅ 理解编译器和解释器的工作原理</li>
            <li>✅ 掌握两者的区别和适用场景</li>
            <li>✅ 了解JIT编译等现代技术</li>
            <li>✅ 理解编译过程的各个阶段</li>
          </ul>
        </div>
      </template>
    </div>
    
    <template #footer>
      <el-button type="primary" @click="visible = false">我知道了</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const visible = ref(false)
const currentCardId = ref('')

// 知识卡片数据
const cardData = {
  assembly: {
    id: 'assembly',
    title: ' 知识点卡片：汇编语言与机器语言'
  },
  transistor: {
    id: 'transistor',
    title: '💡 知识点卡片：晶体管 vs 电子管'
  },
  ic: {
    id: 'ic',
    title: '💡 知识点卡片：集成电路'
  },
  storage: {
    id: 'storage',
    title: '💡 知识点卡片：以存储器为核心的计算机结构'
  },
  compiler: {
    id: 'compiler',
    title: '💡 知识点卡片：编译器 vs 解释器'
  }
}

const currentCard = computed(() => cardData[currentCardId.value as keyof typeof cardData])

const examples = [
  {
    assembly: 'MOV AL, 61h',
    binary: '10110000 01100001',
    hex: 'B0 61',
    meaning: '将数值61放入AL寄存器'
  },
  {
    assembly: 'ADD AL, BL',
    binary: '00000010 11011000',
    hex: '02 D8',
    meaning: 'AL = AL + BL'
  },
  {
    assembly: 'JMP 0x1000',
    binary: '11101001 ...',
    hex: 'E9 ...',
    meaning: '跳转到地址1000'
  }
]

const comparisonData = [
  { aspect: '体积', vacuum: '大（灯泡大小）', transistor: '小（米粒大小）', improvement: '缩小1000倍' },
  { aspect: '功耗', vacuum: '高（需加热）', transistor: '低（无需加热）', improvement: '降低100倍' },
  { aspect: '速度', vacuum: '慢（毫秒级）', transistor: '快（微秒级）', improvement: '提升1000倍' },
  { aspect: '寿命', vacuum: '短（易烧坏）', transistor: '长（不易损坏）', improvement: '提升100倍' },
  { aspect: '可靠性', vacuum: '差', transistor: '高', improvement: '提升100倍' }
]

const icComparisonData = [
  { generation: 'SSI', tech: '小规模集成电路', transistors: '10-100个', example: '早期逻辑门电路' },
  { generation: 'MSI', tech: '中规模集成电路', transistors: '100-1000个', example: '计数器、寄存器' },
  { generation: 'LSI', tech: '大规模集成电路', transistors: '1000-10万', example: '早期微处理器（Intel 4004）' },
  { generation: 'VLSI', tech: '超大规模集成电路', transistors: '10万-1亿', example: '现代CPU、内存芯片' },
  { generation: 'ULSI', tech: '特大规模集成电路', transistors: '1亿以上', example: '现代多核处理器、GPU' }
]

const bottleneckData = [
  { component: '寄存器', speed: '极快', latency: '<1ns', impact: '几乎无影响' },
  { component: 'L1 Cache', speed: '很快', latency: '1-3ns', impact: '轻微影响' },
  { component: 'L2 Cache', speed: '快', latency: '3-10ns', impact: '中等影响' },
  { component: 'L3 Cache', speed: '较快', latency: '10-30ns', impact: '较大影响' },
  { component: '主存', speed: '慢', latency: '50-100ns', impact: '严重影响' },
  { component: '外存', speed: '极慢', latency: 'ms级', impact: '灾难性影响' }
]

const compilerComparisonData = [
  { aspect: '翻译方式', compiler: '一次性全部翻译', interpreter: '逐行翻译执行' },
  { aspect: '执行速度', compiler: '快', interpreter: '慢' },
  { aspect: '开发效率', compiler: '较低', interpreter: '高' },
  { aspect: '跨平台性', compiler: '差（需重新编译）', interpreter: '好' },
  { aspect: '调试难度', compiler: '较难', interpreter: '容易' },
  { aspect: '内存占用', compiler: '少', interpreter: '多' },
  { aspect: '错误检测', compiler: '编译时发现', interpreter: '运行时发现' },
  { aspect: '典型语言', compiler: 'C/C++/Rust/Go', interpreter: 'Python/JS/Ruby/PHP' }
]

function show(cardId: string = 'assembly') {
  currentCardId.value = cardId
  visible.value = true
}

defineExpose({
  show
})
</script>

<style scoped lang="scss">
.knowledge-card-content {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 16px;
  
  h3 {
    color: #409eff;
    margin-bottom: 20px;
    font-size: 20px;
    border-bottom: 2px solid #409eff;
    padding-bottom: 10px;
  }
  
  h4 {
    color: #303133;
    margin: 20px 0 12px 0;
    font-size: 16px;
  }
  
  .card-section {
    margin-bottom: 24px;
    
    ul, ol {
      line-height: 1.8;
      padding-left: 24px;
      
      li {
        margin-bottom: 8px;
      }
    }
    
    code {
      background: #f5f7fa;
      padding: 2px 8px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      color: #e6a23c;
      font-weight: bold;
    }
    
    .pros-cons {
      margin-top: 12px;
      
      .pros, .cons {
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 8px;
        
        ul {
          margin-top: 8px;
        }
      }
      
      .pros {
        background: #f0f9ff;
        border-left: 4px solid #409eff;
      }
      
      .cons {
        background: #fef0f0;
        border-left: 4px solid #f56c6c;
      }
    }
    
    .flow-diagram {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin: 16px 0;
      flex-wrap: wrap;
      
      &.vertical {
        flex-direction: column;
      }
      
      .flow-step {
        background: #ecf5ff;
        padding: 12px 20px;
        border-radius: 8px;
        border: 2px solid #409eff;
        font-weight: bold;
        color: #409eff;
        text-align: center;
        min-width: 120px;
        
        &.highlight {
          background: #409eff;
          color: #fff;
        }
      }
      
      .flow-arrow {
        color: #909399;
        font-weight: bold;
        font-size: 14px;
      }
    }
    
    .flow-example {
      text-align: center;
      margin-top: 12px;
      font-size: 14px;
      color: #606266;
      
      code {
        margin: 0 4px;
      }
    }
    
    &.importance {
      background: #fff7e6;
      border: 2px solid #faad14;
      border-radius: 8px;
      padding: 16px;
      
      h4 {
        color: #fa8c16;
        margin-top: 0;
      }
    }
  }
}

:deep(.el-table) {
  margin: 12px 0;
  
  .el-table__header th {
    background: #f5f7fa;
    font-weight: bold;
  }
}
</style>
