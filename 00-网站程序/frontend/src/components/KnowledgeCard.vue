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
      
      <!-- 补码的本质与优势 -->
      <template v-if="currentCard?.id === 'complement'">
        <h3>💡 知识点卡片：补码的本质与优势</h3>
        
        <div class="card-section">
          <h4>🔢 什么是补码？</h4>
          <ul>
            <li><strong>定义</strong>：一种带符号整数的表示方法</li>
            <li><strong>核心思想</strong>：基于<strong>模运算</strong>（Modular Arithmetic）</li>
            <li><strong>正数</strong>：补码 = 原码</li>
            <li><strong>负数</strong>：补码 = 反码 + 1</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🎯 补码的三大优势</h4>
          
          <div class="pros-cons">
            <div class="pros">
              <strong>优势1：唯一的0表示</strong>
              <ul>
                <li>✅ 原码和反码都有+0和-0两种表示</li>
                <li>✅ 补码只有唯一的0（0000...0）</li>
                <li>✅ 避免了歧义，简化了比较运算</li>
              </ul>
            </div>
          </div>
          
          <div class="pros-cons">
            <div class="pros">
              <strong>优势2：统一加减运算</strong>
              <ul>
                <li>✅ 减法可以转换为加法：[A-B]补 = [A]补 + [-B]补</li>
                <li>✅ CPU只需要一个加法器，不需要减法器</li>
                <li>✅ 简化了硬件设计，提高了运算速度</li>
              </ul>
            </div>
          </div>
          
          <div class="pros-cons">
            <div class="pros">
              <strong>优势3：符号位参与运算</strong>
              <ul>
                <li>✅ 符号位和数值位一起参与运算</li>
                <li>✅ 不需要单独处理符号位</li>
                <li>✅ 运算规则简单统一</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="card-section">
          <h4>📊 三种编码对比</h4>
          <el-table :data="encodingComparisonData" border stripe style="width: 100%">
            <el-table-column prop="encoding" label="编码方式" width="100" />
            <el-table-column prop="positiveZero" label="+0表示" width="100" />
            <el-table-column prop="negativeZero" label="-0表示" width="100" />
            <el-table-column prop="range" label="表示范围" width="150" />
            <el-table-column prop="calculation" label="运算复杂度" />
          </el-table>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》数据表示章节中：</p>
          <ul>
            <li>✅ 掌握补码的定义和计算方法</li>
            <li>✅ 理解补码相比原码、反码的优势</li>
            <li>✅ 能够进行补码的加减运算</li>
            <li>✅ 理解C语言中整数以补码形式存储</li>
          </ul>
        </div>
      </template>
      
      <!-- 溢出判断三种方法 -->
      <template v-if="currentCard?.id === 'overflow'">
        <h3>💡 知识点卡片：溢出判断三种方法</h3>
        
        <div class="card-section">
          <h4>⚠️ 什么是溢出？</h4>
          <ul>
            <li><strong>定义</strong>：运算结果超出了机器数的表示范围</li>
            <li><strong>正溢出</strong>：两个正数相加，结果为负</li>
            <li><strong>负溢出</strong>：两个负数相加，结果为正</li>
            <li><strong>注意</strong>：正数加负数不会溢出</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🔍 方法一：符号位判断</h4>
          <el-table :data="overflowMethod1Data" border stripe style="width: 100%">
            <el-table-column prop="case" label="情况" width="200" />
            <el-table-column prop="result" label="结果" width="200" />
            <el-table-column prop="overflow" label="是否溢出" />
          </el-table>
          <p style="margin-top: 12px; color: #606266;"><strong>优点</strong>：直观易懂，快速判断<br><strong>缺点</strong>：只能判断是否溢出，不能区分类型</p>
        </div>
        
        <div class="card-section">
          <h4>🔍 方法二：进位判断（最常用）</h4>
          <p><strong>公式</strong>：溢出 = Cn ⊕ Cn-1</p>
          <ul>
            <li>Cn：符号位的进位</li>
            <li>Cn-1：最高数值位的进位</li>
            <li>⊕：异或运算（不同为1，相同为0）</li>
          </ul>
          <p style="margin-top: 12px; color: #606266;"><strong>优点</strong>：硬件实现简单，常用<br><strong>缺点</strong>：需要获取进位信号</p>
        </div>
        
        <div class="card-section">
          <h4>🔍 方法三：双符号位（变形补码）</h4>
          <el-table :data="overflowMethod3Data" border stripe style="width: 100%">
            <el-table-column prop="signs" label="双符号位" width="120" />
            <el-table-column prop="meaning" label="含义" width="200" />
            <el-table-column prop="overflow" label="是否溢出" />
          </el-table>
          <p style="margin-top: 12px; color: #606266;"><strong>优点</strong>：能区分正溢出和负溢出<br><strong>缺点</strong>：需要额外存储和运算</p>
        </div>
        
        <div class="card-section">
          <h4>📊 三种方法对比</h4>
          <el-table :data="overflowComparisonData" border stripe style="width: 100%">
            <el-table-column prop="method" label="方法" width="200" />
            <el-table-column prop="difficulty" label="难度" width="100" />
            <el-table-column prop="advantage" label="优点" width="200" />
            <el-table-column prop="disadvantage" label="缺点" />
          </el-table>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》定点数运算章节中：</p>
          <ul>
            <li>✅ 掌握三种溢出判断方法</li>
            <li>✅ 能够进行溢出判断的计算题</li>
            <li>✅ 理解溢出的原因和后果</li>
          </ul>
        </div>
      </template>
      
      <!-- IEEE 754浮点数标准 -->
      <template v-if="currentCard?.id === 'ieee754'">
        <h3>💡 知识点卡片：IEEE 754浮点数标准</h3>
        
        <div class="card-section">
          <h4>📐 IEEE 754标准格式</h4>
          <p><strong>单精度（32位）</strong>：</p>
          <el-table :data="singlePrecisionData" border stripe style="width: 100%">
            <el-table-column prop="field" label="字段" width="120" />
            <el-table-column prop="bits" label="位数" width="100" />
            <el-table-column prop="description" label="说明" />
          </el-table>
          
          <p style="margin-top: 16px;"><strong>双精度（64位）</strong>：</p>
          <el-table :data="doublePrecisionData" border stripe style="width: 100%">
            <el-table-column prop="field" label="字段" width="120" />
            <el-table-column prop="bits" label="位数" width="100" />
            <el-table-column prop="description" label="说明" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>🔢 规格化与非规格化</h4>
          <el-table :data="normalizationData" border stripe style="width: 100%">
            <el-table-column prop="type" label="类型" width="120" />
            <el-table-column prop="condition" label="条件" width="200" />
            <el-table-column prop="meaning" label="含义" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>⚠️ 特殊值表示</h4>
          <el-table :data="specialValuesData" border stripe style="width: 100%">
            <el-table-column prop="value" label="值" width="80" />
            <el-table-column prop="exp" label="阶码" width="120" />
            <el-table-column prop="mantissa" label="尾数" width="120" />
            <el-table-column prop="example" label="示例" />
          </el-table>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》浮点数章节中：</p>
          <ul>
            <li>✅ 掌握IEEE 754标准的格式（单精度、双精度）</li>
            <li>✅ 能够进行十进制到IEEE 754的转换</li>
            <li>✅ 理解规格化、非规格化、特殊值的表示</li>
            <li>✅ 掌握浮点数的加减运算步骤</li>
          </ul>
        </div>
      </template>
      
      <!-- 浮点数加减运算5步骤 -->
      <template v-if="currentCard?.id === 'floatCalc'">
        <h3>💡 知识点卡片：浮点数加减运算5步骤</h3>
        
        <div class="card-section">
          <h4>📝 运算步骤总览</h4>
          <ol>
            <li><strong>对阶</strong>：小阶向大阶看齐</li>
            <li><strong>尾数求和</strong>：按补码加法规则进行</li>
            <li><strong>规格化</strong>：左规或右规</li>
            <li><strong>舍入</strong>：处理精度损失</li>
            <li><strong>溢出判断</strong>：检查阶码是否溢出</li>
          </ol>
        </div>
        
        <div class="card-section">
          <h4>1️⃣ 对阶</h4>
          <ul>
            <li><strong>原则</strong>：小阶向大阶看齐</li>
            <li><strong>操作</strong>：阶码小的尾数右移，右移位数 = 阶码差</li>
            <li><strong>原因</strong>：右移丢失的是低位，误差较小；左移会丢失高位，误差大</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>2️⃣ 尾数求和</h4>
          <ul>
            <li>按补码加法规则进行</li>
            <li>符号位参与运算</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>3️⃣ 规格化</h4>
          <el-table :data="normalizationStepsData" border stripe style="width: 100%">
            <el-table-column prop="type" label="类型" width="100" />
            <el-table-column prop="condition" label="条件" width="250" />
            <el-table-column prop="operation" label="操作" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>4️⃣ 舍入</h4>
          <el-table :data="roundingMethodsData" border stripe style="width: 100%">
            <el-table-column prop="method" label="方法" width="120" />
            <el-table-column prop="rule" label="规则" width="250" />
            <el-table-column prop="bias" label="偏差" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>5️⃣ 溢出判断</h4>
          <ul>
            <li><strong>阶码上溢</strong>：结果太大 → ±∞</li>
            <li><strong>阶码下溢</strong>：结果太小 → 0</li>
            <li><strong>尾数溢出</strong>：通过右规解决，不算真正的溢出</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》浮点数章节中：</p>
          <ul>
            <li>✅ 掌握浮点数加减运算的5个步骤</li>
            <li>✅ 能够进行具体的计算题</li>
            <li>✅ 理解对阶、规格化、舍入的原理</li>
          </ul>
        </div>
      </template>
      
      <!-- DRAM刷新机制详解 -->
      <template v-if="currentCard?.id === 'dramRefresh'">
        <h3>💡 知识点卡片：DRAM刷新机制详解</h3>
        
        <div class="card-section">
          <h4>⚠️ 为什么需要刷新？</h4>
          <ul>
            <li><strong>原因</strong>：DRAM使用电容存储电荷，电容会漏电</li>
            <li><strong>保持时间</strong>：通常只能保持几ms（毫秒）</li>
            <li><strong>后果</strong>：如果不刷新，数据会丢失</li>
            <li><strong>刷新周期</strong>：通常2ms或64ms（所有行必须在刷新周期内刷新一遍）</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🔄 三种刷新方式对比</h4>
          
          <div class="pros-cons">
            <div class="pros">
              <strong>1. 集中刷新</strong>
              <ul>
                <li>✅ 实现简单</li>
                <li>❌ <strong>死区时间长</strong>（刷新期间不能访问内存）</li>
                <li>示例：64ms周期，1024行，每行1个时钟周期 → 死区1024个时钟周期</li>
              </ul>
            </div>
          </div>
          
          <div class="pros-cons">
            <div class="pros">
              <strong>2. 分散刷新</strong>
              <ul>
                <li>✅ <strong>无死区时间</strong></li>
                <li>❌ <strong>存取周期变长</strong>（每个周期都要预留刷新时间）</li>
                <li>示例：原500ns → 分散后1000ns（500ns读写+500ns刷新）</li>
              </ul>
            </div>
          </div>
          
          <div class="pros-cons">
            <div class="pros">
              <strong>3. 异步刷新 ⭐最常用</strong>
              <ul>
                <li>✅ 折中方案，既有较短的死区时间，又不显著影响存取周期</li>
                <li>❌ 控制逻辑较复杂</li>
                <li>示例：64ms/1024行 = 每隔62.5μs刷新一行</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="card-section">
          <h4>📝 刷新计算例题</h4>
          <p><strong>题目</strong>：某DRAM芯片有1024行，刷新周期为64ms，采用异步刷新方式。问：刷新信号的时间间隔是多少？</p>
          <p><strong>解答</strong>：</p>
          <pre style="background: #f5f7fa; padding: 12px; border-radius: 4px; overflow-x: auto;">刷新间隔 = 刷新周期 / 行数
        = 64ms / 1024
        = 62.5μs

即每隔62.5μs刷新一行。</pre>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》半导体存储器章节中：</p>
          <ul>
            <li>✅ 掌握三种刷新方式的优缺点</li>
            <li>✅ 能够进行刷新间隔的计算</li>
            <li>✅ 理解为什么DRAM需要刷新而SRAM不需要</li>
          </ul>
        </div>
      </template>
      
      <!-- Cache地址映射三种方式 -->
      <template v-if="currentCard?.id === 'cacheMapping'">
        <h3>💡 知识点卡片：Cache地址映射三种方式</h3>
        
        <div class="card-section">
          <h4>1️⃣ 直接映射</h4>
          <ul>
            <li><strong>原理</strong>：主存块只能映射到Cache的固定位置</li>
            <li><strong>公式</strong>：Cache行号 = 主存块号 mod Cache总行数</li>
            <li><strong>地址格式</strong>：| 标记Tag | Cache行号 | 块内偏移 |</li>
          </ul>
          <div class="pros-cons">
            <div class="pros">
              <strong>优点</strong>：硬件简单，速度快
            </div>
            <div class="cons">
              <strong>缺点</strong>：冲突率高
            </div>
          </div>
        </div>
        
        <div class="card-section">
          <h4>2️⃣ 全相联映射</h4>
          <ul>
            <li><strong>原理</strong>：主存块可以映射到Cache的任意位置</li>
            <li><strong>地址格式</strong>：| 标记Tag | 块内偏移 |</li>
          </ul>
          <div class="pros-cons">
            <div class="pros">
              <strong>优点</strong>：冲突率最低
            </div>
            <div class="cons">
              <strong>缺点</strong>：硬件复杂，速度慢（需要比较所有行）
            </div>
          </div>
        </div>
        
        <div class="card-section">
          <h4>3️⃣ 组相联映射 ⭐⭐ 折中方案</h4>
          <ul>
            <li><strong>原理</strong>：Cache分组，主存块映射到固定组，组内任意位置</li>
            <li><strong>公式</strong>：组号 = 主存块号 mod Cache总组数</li>
            <li><strong>地址格式</strong>：| 标记Tag | 组号 | 块内偏移 |</li>
            <li><strong>n路组相联</strong>：每组有n行（2路组相联最常用）</li>
          </ul>
          <div class="pros-cons">
            <div class="pros">
              <strong>优点</strong>：折中直接映射和全相联
            </div>
          </div>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》Cache章节中：</p>
          <ul>
            <li>✅ 掌握三种映射方式的原理和地址格式</li>
            <li>✅ 能够进行映射计算题</li>
            <li>✅ 理解各自的优缺点和应用场景</li>
          </ul>
        </div>
      </template>
      
      <!-- SRAM vs DRAM对比 -->
      <template v-if="currentCard?.id === 'sramVsDram'">
        <h3>💡 知识点卡片：SRAM vs DRAM对比</h3>
        
        <div class="card-section">
          <h4>📊 详细对比表</h4>
          <el-table :data="sramDramComparisonData" border stripe style="width: 100%">
            <el-table-column prop="feature" label="特性" width="120" />
            <el-table-column prop="sram" label="SRAM" width="200" />
            <el-table-column prop="dram" label="DRAM" width="200" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>🔍 核心区别</h4>
          <ol>
            <li><strong>存储元件</strong>：
              <ul>
                <li>SRAM：6个晶体管组成的双稳态触发器</li>
                <li>DRAM：1个晶体管 + 1个电容（1T1C结构）</li>
              </ul>
            </li>
            <li><strong>刷新需求</strong>：
              <ul>
                <li>SRAM：不需要刷新（只要不断电，信息就稳定）</li>
                <li>DRAM：需要定期刷新（电容会漏电）</li>
              </ul>
            </li>
            <li><strong>速度</strong>：
              <ul>
                <li>SRAM：快（访问时间短，约几ns）</li>
                <li>DRAM：较慢（访问时间长，约几十ns）</li>
              </ul>
            </li>
            <li><strong>应用场景</strong>：
              <ul>
                <li>SRAM：用于Cache（因为速度快）</li>
                <li>DRAM：用于主存（因为容量大、成本低）</li>
              </ul>
            </li>
          </ol>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》半导体存储器章节中：</p>
          <ul>
            <li>✅ 掌握SRAM和DRAM的区别（必考选择题）</li>
            <li>✅ 理解各自的应用场景</li>
            <li>✅ 能够解释为什么Cache用SRAM而主存用DRAM</li>
          </ul>
        </div>
      </template>
      
      <!-- 相联存储器原理 -->
      <template v-if="currentCard?.id === 'associativeMemory'">
        <h3>💡 知识点卡片：相联存储器原理</h3>
        
        <div class="card-section">
          <h4>💡 什么是相联存储器？</h4>
          <ul>
            <li><strong>定义</strong>：按内容访问的存储器（Content-Addressable Memory, CAM）</li>
            <li><strong>特点</strong>：不通过地址访问，而是通过<strong>数据内容</strong>进行查找</li>
            <li><strong>工作原理</strong>：并行比较所有存储单元，速度极快（O(1)时间复杂度）</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🔍 工作过程</h4>
          <ol>
            <li>输入一个数据（关键字）</li>
            <li>同时与所有存储单元的内容进行比较</li>
            <li>返回匹配的地址或直接返回数据</li>
          </ol>
        </div>
        
        <div class="card-section">
          <h4>📍 应用场景</h4>
          <ul>
            <li><strong>TLB（快表）</strong>：加速虚拟地址到物理地址的转换</li>
            <li><strong>Cache标记比较</strong>：判断Cache是否命中</li>
            <li><strong>路由器查表</strong>：快速查找路由表项</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📊 优缺点对比</h4>
          <div class="pros-cons">
            <div class="pros">
              <strong>优点</strong>
              <ul>
                <li>✅ 查找速度快（并行比较）</li>
                <li>✅ 适合频繁查找的场景</li>
              </ul>
            </div>
            <div class="cons">
              <strong>缺点</strong>
              <ul>
                <li>❌ 硬件复杂（每个单元都需要比较器）</li>
                <li>❌ 功耗大</li>
                <li>❌ 集成度低</li>
                <li>❌ 价格昂贵</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》存储器章节中：</p>
          <ul>
            <li>✅ 理解相联存储器的概念和工作原理</li>
            <li>✅ 掌握其在TLB和Cache中的应用</li>
            <li>✅ 了解其优缺点</li>
          </ul>
        </div>
      </template>
      
      <!-- Flash存储器分类与应用 -->
      <template v-if="currentCard?.id === 'flashMemory'">
        <h3>💡 知识点卡片：Flash存储器分类与应用</h3>
        
        <div class="card-section">
          <h4>💡 什么是Flash存储器？</h4>
          <ul>
            <li><strong>定义</strong>：基于EEPROM技术改进的非易失性存储器</li>
            <li><strong>特点</strong>：按块擦除（而非按字节），提高擦除速度</li>
            <li><strong>优势</strong>：非易失性、速度快、抗震性好、体积小</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📊 NOR Flash vs NAND Flash</h4>
          <el-table :data="flashComparisonData" border stripe style="width: 100%">
            <el-table-column prop="feature" label="特性" width="120" />
            <el-table-column prop="nor" label="NOR Flash" width="200" />
            <el-table-column prop="nand" label="NAND Flash" width="200" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>📍 应用场景</h4>
          <ul>
            <li><strong>NOR Flash</strong>：存储固件、BIOS、嵌入式系统代码（支持XIP）</li>
            <li><strong>NAND Flash</strong>：U盘、SSD、手机存储、SD卡（容量大、成本低）</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>⚠️ 注意事项</h4>
          <ul>
            <li><strong>寿命有限</strong>：擦写次数约1万~10万次</li>
            <li><strong>磨损均衡</strong>：需要算法延长寿命</li>
            <li><strong>坏块管理</strong>：NAND Flash可能出现坏块</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》外存储器章节中：</p>
          <ul>
            <li>✅ 掌握Flash存储器的特点</li>
            <li>✅ 理解NOR和NAND的区别</li>
            <li>✅ 了解SSD的工作原理</li>
          </ul>
        </div>
      </template>
      
      <!-- Cache性能计算 -->
      <template v-if="currentCard?.id === 'cachePerformance'">
        <h3>💡 知识点卡片：Cache性能计算</h3>
        
        <div class="card-section">
          <h4>📐 核心公式</h4>
          <p><strong>平均访问时间</strong>：</p>
          <pre style="background: #f5f7fa; padding: 12px; border-radius: 4px; overflow-x: auto;">Ta = H × Tc + (1-H) × Tm</pre>
          <ul>
            <li>H：命中率（Hit Rate）</li>
            <li>Tc：Cache访问时间</li>
            <li>Tm：主存访问时间</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📝 计算例题</h4>
          <p><strong>题目</strong>：Cache命中率90%，Cache访问时间10ns，主存100ns，求平均访问时间？</p>
          <p><strong>解答</strong>：</p>
          <pre style="background: #f5f7fa; padding: 12px; border-radius: 4px; overflow-x: auto;">Ta = 0.9 × 10 + 0.1 × 100
   = 9 + 10
   = 19ns</pre>
          <p style="margin-top: 12px; color: #606266;"><strong>分析</strong>：虽然Cache命中率高达90%，但平均访问时间仍受未命中的10%影响较大。</p>
        </div>
        
        <div class="card-section">
          <h4>🔍 影响命中率的因素</h4>
          <ul>
            <li><strong>Cache容量</strong>：容量越大，命中率越高</li>
            <li><strong>块大小</strong>：块太大或太小都会降低命中率</li>
            <li><strong>映射方式</strong>：全相联 > 组相联 > 直接映射</li>
            <li><strong>替换算法</strong>：LRU > FIFO > 随机</li>
            <li><strong>程序局部性</strong>：局部性越好，命中率越高</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》Cache章节中：</p>
          <ul>
            <li>✅ 掌握平均访问时间的计算公式</li>
            <li>✅ 能够进行命中率相关的计算题</li>
            <li>✅ 理解影响命中率的因素</li>
          </ul>
        </div>
      </template>
      
      <!-- 存储器扩展设计 -->
      <template v-if="currentCard?.id === 'memoryExpansion'">
        <h3>💡 知识点卡片：存储器扩展设计</h3>
        
        <div class="card-section">
          <h4>1️⃣ 位扩展</h4>
          <ul>
            <li><strong>场景</strong>：存储芯片的字长不够</li>
            <li><strong>方法</strong>：所有芯片的地址线、片选线、读写线并联，数据线分别连接</li>
            <li><strong>示例</strong>：用8K×1位芯片组成8K×8位存储器 → 需要8片</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>2️⃣ 字扩展（容量扩展）</h4>
          <ul>
            <li><strong>场景</strong>：存储芯片的数量不够</li>
            <li><strong>方法</strong>：所有芯片的数据线并联，地址线低位并联，高位通过译码器选择芯片</li>
            <li><strong>示例</strong>：用16K×4位芯片组成64K×4位存储器 → 需要4片，用2-4译码器片选</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>3️⃣ 字位同时扩展</h4>
          <ul>
            <li><strong>方法</strong>：先位扩展，再字扩展（或先字后位）</li>
            <li><strong>示例</strong>：用16K×1位芯片组成64K×8位存储器</li>
          </ul>
          <pre style="background: #f5f7fa; padding: 12px; border-radius: 4px; overflow-x: auto;">总容量 = 64K × 8位
单片容量 = 16K × 1位
需要芯片数 = (64K×8) / (16K×1) = 32片

步骤：
1. 先用8片16K×1位组成16K×8位（位扩展）
2. 再用4组这样的组合，通过2-4译码器片选（字扩展）</pre>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》主存储器章节中：</p>
          <ul>
            <li>✅ 掌握位扩展、字扩展、字位扩展的方法</li>
            <li>✅ 能够进行芯片数量的计算</li>
            <li>✅ 理解地址线和数据线的连接方式</li>
          </ul>
        </div>
      </template>
      
      <!-- 虚拟存储器地址转换 -->
      <template v-if="currentCard?.id === 'virtualMemoryAddress'">
        <h3>💡 知识点卡片：虚拟存储器地址转换</h3>
        
        <div class="card-section">
          <h4>📐 页式虚存地址结构</h4>
          <pre style="background: #f5f7fa; padding: 12px; border-radius: 4px; overflow-x: auto;">| 页号P | 页内偏移d |</pre>
          <ul>
            <li><strong>页号P</strong>：查页表得到页框号</li>
            <li><strong>页内偏移d</strong>：直接使用</li>
            <li><strong>物理地址</strong> = 页框号 + 页内偏移</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🔄 地址转换流程</h4>
          <ol>
            <li>CPU给出虚拟地址（页号P + 页内偏移d）</li>
            <li>先查TLB（快表）
              <ul>
                <li>命中：直接得到页框号</li>
                <li>未命中：查页表，同时更新TLB</li>
              </ul>
            </li>
            <li>页框号 + 页内偏移 = 物理地址</li>
            <li>访问物理内存</li>
          </ol>
        </div>
        
        <div class="card-section">
          <h4>⚡ TLB加速原理</h4>
          <ul>
            <li><strong>TLB作用</strong>：Cache页表，加速地址转换</li>
            <li><strong>TLB命中率</strong>：通常90%以上</li>
            <li><strong>平均访问时间（有TLB）</strong>：</li>
          </ul>
          <pre style="background: #f5f7fa; padding: 12px; border-radius: 4px; overflow-x: auto;">Ta = H × (Ttlb + Tmem) + (1-H) × (Ttlb + 2×Tmem)</pre>
          <ul>
            <li>H：TLB命中率</li>
            <li>Ttlb：TLB访问时间</li>
            <li>Tmem：内存访问时间</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》虚拟存储器章节中：</p>
          <ul>
            <li>✅ 掌握页式虚存的地址转换流程</li>
            <li>✅ 理解TLB的作用和加速原理</li>
            <li>✅ 能够进行有TLB的平均访问时间计算</li>
          </ul>
        </div>
      </template>
      
      <!-- RAID技术详解 -->
      <template v-if="currentCard?.id === 'raid'">
        <h3>💡 知识点卡片：RAID技术详解</h3>
        
        <div class="card-section">
          <h4>📖 什么是RAID？</h4>
          <ul>
            <li><strong>定义</strong>：RAID（Redundant Array of Independent Disks，独立磁盘冗余阵列）是一种将多个物理磁盘组合成一个逻辑单元的技术</li>
            <li><strong>核心思想</strong>：通过数据分布、镜像或parity（奇偶校验）来提高性能、可靠性或两者兼有</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🎯 RAID的三大作用</h4>
          <ol>
            <li><strong>提高数据可靠性</strong>
              <ul>
                <li>通过数据冗余（镜像或parity）防止单点故障</li>
                <li>单个磁盘损坏时，数据仍可恢复</li>
              </ul>
            </li>
            <li><strong>提升I/O性能</strong>
              <ul>
                <li>并行读写多个磁盘，提高吞吐量</li>
                <li>适合高并发访问场景</li>
              </ul>
            </li>
            <li><strong>扩大存储容量</strong>
              <ul>
                <li>将多个小容量磁盘组合成大容量逻辑卷</li>
              </ul>
            </li>
          </ol>
        </div>
        
        <div class="card-section">
          <h4>📊 常见RAID级别对比表</h4>
          <el-table :data="raidComparisonData" border stripe style="width: 100%">
            <el-table-column prop="level" label="RAID级别" width="100" />
            <el-table-column prop="minDisks" label="最少磁盘数" width="100" />
            <el-table-column prop="faultTolerance" label="容错能力" width="120" />
            <el-table-column prop="spaceUtilization" label="空间利用率" width="120" />
            <el-table-column prop="readPerformance" label="读性能" width="100" />
            <el-table-column prop="writePerformance" label="写性能" width="100" />
            <el-table-column prop="application" label="应用场景" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>🔍 各RAID级别详解</h4>
          
          <h5 style="margin-top: 16px; color: #409eff;">RAID 0（条带化）</h5>
          <pre style="background: #f5f7fa; padding: 12px; border-radius: 4px; overflow-x: auto;">磁盘1: [A1] [A3] [A5]
磁盘2: [A2] [A4] [A6]</pre>
          <ul>
            <li><strong>原理</strong>：数据分散存储在多个磁盘</li>
            <li><strong>优点</strong>：速度最快，空间利用率100%</li>
            <li><strong>缺点</strong>：<span style="color: #f56c6c; font-weight: bold;">无冗余</span>，任一磁盘损坏则全部数据丢失</li>
            <li><strong>适用</strong>：对速度要求高、数据不重要的场景（临时数据、视频编辑）</li>
          </ul>
          
          <h5 style="margin-top: 16px; color: #409eff;">RAID 1（镜像）</h5>
          <pre style="background: #f5f7fa; padding: 12px; border-radius: 4px; overflow-x: auto;">磁盘1: [A1] [A2] [A3]
磁盘2: [A1] [A2] [A3]  ← 完全相同</pre>
          <ul>
            <li><strong>原理</strong>：数据完全复制到另一块磁盘</li>
            <li><strong>优点</strong>：可靠性最高，读取速度快</li>
            <li><strong>缺点</strong>：空间利用率仅50%，成本高</li>
            <li><strong>适用</strong>：操作系统、关键业务数据</li>
          </ul>
          
          <h5 style="margin-top: 16px; color: #409eff;">RAID 5（分布式奇偶校验）⭐⭐</h5>
          <pre style="background: #f5f7fa; padding: 12px; border-radius: 4px; overflow-x: auto;">磁盘1: [A1] [A2] [P3]
磁盘2: [B1] [P2] [B3]
磁盘3: [P1] [C2] [C3]
(P = Parity 奇偶校验)</pre>
          <ul>
            <li><strong>原理</strong>：数据和parity信息分散存储</li>
            <li><strong>优点</strong>：兼顾性能和可靠性，空间利用率高</li>
            <li><strong>缺点</strong>：写入时需要计算parity，写性能下降</li>
            <li><strong>适用</strong>：通用文件服务器、中小型数据库</li>
          </ul>
          
          <h5 style="margin-top: 16px; color: #409eff;">RAID 6（双重奇偶校验）</h5>
          <pre style="background: #f5f7fa; padding: 12px; border-radius: 4px; overflow-x: auto;">磁盘1: [A1] [A2] [P3] [Q4]
磁盘2: [B1] [P2] [B3] [Q4]
磁盘3: [P1] [C2] [C3] [Q4]
磁盘4: [Q1] [Q2] [Q3] [D4]
(P, Q = 两种不同的parity)</pre>
          <ul>
            <li><strong>原理</strong>：使用两种独立的parity算法</li>
            <li><strong>优点</strong>：允许同时损坏2块磁盘</li>
            <li><strong>缺点</strong>：写性能更低，需要至少4块磁盘</li>
            <li><strong>适用</strong>：大容量存储系统、数据归档</li>
          </ul>
          
          <h5 style="margin-top: 16px; color: #409eff;">RAID 10（镜像+条带化）⭐⭐⭐</h5>
          <pre style="background: #f5f7fa; padding: 12px; border-radius: 4px; overflow-x: auto;">第一组(RAID 1):     第二组(RAID 1):
磁盘1: [A1] [A2]   磁盘3: [B1] [B2]
磁盘2: [A1] [A2]   磁盘4: [B1] [B2]
         ↓                  ↓
      条带化(RAID 0) 组合</pre>
          <ul>
            <li><strong>原理</strong>：先做RAID 1镜像，再做RAID 0条带化</li>
            <li><strong>优点</strong>：兼具RAID 1的可靠性和RAID 0的速度</li>
            <li><strong>缺点</strong>：空间利用率仅50%，成本高</li>
            <li><strong>适用</strong>：高性能数据库、虚拟化平台</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>💡 选择建议</h4>
          <ul>
            <li>🟢 <strong>追求速度</strong> → RAID 0（视频剪辑、游戏加载、临时缓存）</li>
            <li>🔵 <strong>追求可靠性</strong> → RAID 1（操作系统、财务数据、邮件服务器）</li>
            <li>🟡 <strong>平衡方案</strong> → RAID 5（文件服务器、Web服务器、中小型数据库）</li>
            <li>🔴 <strong>高可靠性需求</strong> → RAID 6（大规模存储、视频监控、数据备份）</li>
            <li>🟠 <strong>高性能+高可靠</strong> → RAID 10（核心数据库、虚拟化集群、高频交易系统）</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>⚠️ 重要注意事项</h4>
          <ol>
            <li><strong>RAID不是备份</strong>：RAID只能防止硬件故障，不能防止误删除、病毒、火灾等</li>
            <li><strong>定期测试</strong>：定期检查RAID状态，确保冗余有效</li>
            <li><strong>热备盘</strong>：重要系统建议配置热备盘（Hot Spare），自动替换故障磁盘</li>
            <li><strong>控制器电池</strong>：RAID卡需要电池保护缓存数据，断电时写入未完成的数据</li>
          </ol>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点（408专业课）</h4>
          <p>在《计算机组成原理》外存储器章节中：</p>
          <ul>
            <li>✅ 理解RAID的基本概念和目的</li>
            <li>✅ 掌握常见RAID级别的优缺点</li>
            <li>✅ 能够计算RAID的空间利用率</li>
            <li>✅ 理解parity的工作原理</li>
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
  },
  ieee754: {
    id: 'ieee754',
    title: '💡 知识点卡片：IEEE 754浮点数标准'
  },
  overflow: {
    id: 'overflow',
    title: '💡 知识点卡片：溢出判断三种方法'
  },
  complement: {
    id: 'complement',
    title: '💡 知识点卡片：补码的本质与优势'
  },
  floatCalc: {
    id: 'floatCalc',
    title: '💡 知识点卡片：浮点数加减运算5步骤'
  },
  shift: {
    id: 'shift',
    title: '💡 知识点卡片：算术移位vs逻辑移位'
  },
  booth: {
    id: 'booth',
    title: '💡 知识点卡片：布斯乘法算法'
  },
  amdahl: {
    id: 'amdahl',
    title: '💡 知识点卡片：Amdahl定律详解'
  },
  division: {
    id: 'division',
    title: '💡 知识点卡片：定点数除法（加减交替法）'
  },
  // 第三章知识卡片
  dramRefresh: {
    id: 'dramRefresh',
    title: '💡 知识点卡片：DRAM刷新机制详解'
  },
  cacheMapping: {
    id: 'cacheMapping',
    title: '💡 知识点卡片：Cache地址映射三种方式'
  },
  sramVsDram: {
    id: 'sramVsDram',
    title: '💡 知识点卡片：SRAM vs DRAM对比'
  },
  associativeMemory: {
    id: 'associativeMemory',
    title: '💡 知识点卡片：相联存储器原理'
  },
  flashMemory: {
    id: 'flashMemory',
    title: '💡 知识点卡片：Flash存储器分类与应用'
  },
  cachePerformance: {
    id: 'cachePerformance',
    title: '💡 知识点卡片：Cache性能计算'
  },
  memoryExpansion: {
    id: 'memoryExpansion',
    title: '💡 知识点卡片：存储器扩展设计'
  },
  virtualMemoryAddress: {
    id: 'virtualMemoryAddress',
    title: '💡 知识点卡片：虚拟存储器地址转换'
  },
  raid: {
    id: 'raid',
    title: '💡 知识点卡片：RAID技术详解'
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

// IEEE 754浮点数标准相关数据
const singlePrecisionData = [
  { field: '符号位 S', bits: '1位', description: '0正1负' },
  { field: '阶码 E', bits: '8位', description: '移码表示，偏置值127' },
  { field: '尾数 M', bits: '23位', description: '隐含最高位1，实际精度24位' }
]

const doublePrecisionData = [
  { field: '符号位 S', bits: '1位', description: '0正1负' },
  { field: '阶码 E', bits: '11位', description: '移码表示，偏置值1023' },
  { field: '尾数 M', bits: '52位', description: '隐含最高位1，实际精度53位' }
]

const normalizationData = [
  { type: '规格化数', condition: '阶码不全为0且不全为1', meaning: '正常浮点数，尾数隐含最高位1' },
  { type: '非规格化数', condition: '阶码全为0', meaning: '非常接近0的数，尾数不隐含1' },
  { type: '无穷大', condition: '阶码全为1，尾数全为0', meaning: '±∞（溢出结果）' },
  { type: 'NaN', condition: '阶码全为1，尾数非0', meaning: '非数（非法运算结果）' },
  { type: '零', condition: '阶码全为0，尾数全为0', meaning: '±0（符号位决定正负）' }
]

const specialValuesData = [
  { value: '+∞', exp: '11111111', mantissa: '000...000', example: '正数除以0' },
  { value: '-∞', exp: '11111111', mantissa: '000...000', example: '负数除以0' },
  { value: 'NaN', exp: '11111111', mantissa: '非0', example: '0/0, √(-1)' },
  { value: '+0', exp: '00000000', mantissa: '000...000', example: 'S=0' },
  { value: '-0', exp: '00000000', mantissa: '000...000', example: 'S=1' }
]

// 溢出判断相关数据
const overflowMethod1Data = [
  { case: '正数 + 正数 = 负数', result: '符号位由0变1', overflow: '✅ 正溢出' },
  { case: '负数 + 负数 = 正数', result: '符号位由1变0', overflow: '✅ 负溢出' },
  { case: '正数 + 负数', result: '符号位任意', overflow: '❌ 不会溢出' }
]

const overflowMethod3Data = [
  { signs: '00', meaning: '正数', overflow: '无溢出' },
  { signs: '11', meaning: '负数', overflow: '无溢出' },
  { signs: '01', meaning: '结果为正但超出范围', overflow: '✅ 正溢出' },
  { signs: '10', meaning: '结果为负但超出范围', overflow: '✅ 负溢出' }
]

const overflowComparisonData = [
  { method: '方法一：符号位判断', difficulty: '⭐', advantage: '直观易懂，快速判断', disadvantage: '只能判断是否溢出，不能区分类型' },
  { method: '方法二：进位判断', difficulty: '⭐⭐', advantage: '硬件实现简单，常用', disadvantage: '需要获取进位信号' },
  { method: '方法三：双符号位', difficulty: '⭐⭐⭐', advantage: '能区分正溢出和负溢出', disadvantage: '需要额外存储和运算' }
]

// 补码相关数据
const encodingComparisonData = [
  { encoding: '原码', positiveZero: '0000', negativeZero: '1000', range: '-127 ~ +127', calculation: '高（需分别处理）' },
  { encoding: '反码', positiveZero: '0000', negativeZero: '1111', range: '-127 ~ +127', calculation: '中（循环进位）' },
  { encoding: '补码', positiveZero: '0000', negativeZero: '无', range: '-128 ~ +127', calculation: '低（统一加法）' }
]

// 浮点数运算相关数据
const normalizationStepsData = [
  { type: '左规', condition: '尾数最高位为0（如0.0xxx）', operation: '尾数左移1位，阶码减1，直到最高位为1' },
  { type: '右规', condition: '尾数溢出（如10.xxx或01.xxx）', operation: '尾数右移1位，阶码加1' }
]

const roundingMethodsData = [
  { method: '就近舍入', rule: '四舍五入（丢失位>0.5则进位）', bias: '无偏差' },
  { method: '朝0舍入', rule: '直接截断（丢弃低位）', bias: '偏向0' },
  { method: '朝+∞舍入', rule: '正数进位，负数截断', bias: '偏向+∞' },
  { method: '朝-∞舍入', rule: '正数截断，负数进位', bias: '偏向-∞' }
]

// SRAM vs DRAM对比数据
const sramDramComparisonData = [
  { feature: '存储元件', sram: '6个晶体管（六管触发器）', dram: '1个晶体管 + 1个电容（1T1C）' },
  { feature: '刷新需求', sram: '不需要刷新', dram: '需要定期刷新' },
  { feature: '速度', sram: '快（几ns）', dram: '较慢（几十ns）' },
  { feature: '集成度', sram: '低', dram: '高' },
  { feature: '功耗', sram: '较大', dram: '较小' },
  { feature: '价格', sram: '昂贵', dram: '便宜' },
  { feature: '应用场景', sram: 'Cache', dram: '主存' }
]

// Flash存储器对比数据
const flashComparisonData = [
  { feature: '读取方式', nor: '随机访问', nand: '顺序访问' },
  { feature: '写入速度', nor: '慢', nand: '快' },
  { feature: '擦除单位', nor: '字节/扇区', nand: '块' },
  { feature: '容量', nor: '小（MB级）', nand: '大（GB级）' },
  { feature: '成本', nor: '高', nand: '低' },
  { feature: 'XIP支持', nor: '支持（可直接执行代码）', nand: '不支持' },
  { feature: '应用', nor: 'BIOS、固件', nand: 'U盘、SSD、手机存储' }
]

// RAID级别对比数据
const raidComparisonData = [
  { level: 'RAID 0', minDisks: '2', faultTolerance: '❌ 无', spaceUtilization: '100%', readPerformance: '⭐⭐⭐ 极高', writePerformance: '⭐⭐⭐ 极高', application: '临时数据、视频编辑' },
  { level: 'RAID 1', minDisks: '2', faultTolerance: '✅ 允许1块损坏', spaceUtilization: '50%', readPerformance: '⭐⭐ 一般', writePerformance: '⭐ 较低', application: '系统盘、关键数据' },
  { level: 'RAID 5', minDisks: '3', faultTolerance: '✅ 允许1块损坏', spaceUtilization: '(n-1)/n', readPerformance: '⭐⭐⭐ 高', writePerformance: '⭐⭐ 中等', application: '文件服务器、数据库' },
  { level: 'RAID 6', minDisks: '4', faultTolerance: '✅ 允许2块损坏', spaceUtilization: '(n-2)/n', readPerformance: '⭐⭐⭐ 高', writePerformance: '⭐ 较低', application: '大容量存储、归档' },
  { level: 'RAID 10', minDisks: '4', faultTolerance: '✅ 允许每组1块损坏', spaceUtilization: '50%', readPerformance: '⭐⭐⭐ 高', writePerformance: '⭐⭐ 中等', application: '高性能数据库' }
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
