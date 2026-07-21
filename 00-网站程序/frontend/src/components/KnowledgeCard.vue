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
      
      <!-- 快表(TLB)与慢表(页表)对比 -->
      <template v-if="currentCard?.id === 'tlbVsPageTable'">
        <h3>💡 知识点卡片：快表(TLB)与慢表(页表)对比</h3>
        
        <div class="card-section">
          <h4>📖 基本概念</h4>
          <ul>
            <li><strong>快表（TLB）</strong>：Translation Lookaside Buffer，位于CPU内部的相联存储器，用于缓存最近使用的页表项</li>
            <li><strong>慢表（页表）</strong>：存放在主存中的数组结构，包含所有虚拟页到物理页框的映射关系</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📊 TLB vs 页表详细对比</h4>
          <el-table :data="tlbComparisonData" border stripe style="width: 100%">
            <el-table-column prop="feature" label="特性" width="120" />
            <el-table-column prop="tlb" label="快表（TLB）" />
            <el-table-column prop="pageTable" label="慢表（页表）" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>🔄 工作流程</h4>
          <pre style="background: #f5f7fa; padding: 12px; border-radius: 4px; overflow-x: auto;">1. CPU发出虚拟地址
2. 先查TLB（快表）：
   - TLB命中 → 直接得到物理地址（快速路径）
   - TLB缺失 → 查页表（慢表）
3. 查页表：
   - 页表项有效 → 得到物理地址，同时更新TLB
   - 页表项无效 → 缺页中断，操作系统处理</pre>
        </div>
        
        <div class="card-section">
          <h4>⚡ 性能分析</h4>
          <ul>
            <li><strong>TLB命中率</strong>：通常90%以上（利用时间局部性）</li>
            <li><strong>平均访问时间公式</strong>：
              <pre style="background: #fff7e6; padding: 8px; border-radius: 4px; margin-top: 8px;">Ta = H × (Ttlb + Tmem) + (1-H) × (Ttlb + 2×Tmem)</pre>
              <ul>
                <li>H：TLB命中率</li>
                <li>Ttlb：TLB访问时间（约1个时钟周期）</li>
                <li>Tmem：主存访问时间（几十ns）</li>
              </ul>
            </li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》虚拟存储器章节中：</p>
          <ul>
            <li>✅ 理解TLB的作用和工作原理</li>
            <li>✅ 掌握TLB与页表的区别</li>
            <li>✅ 能够计算有TLB的平均访问时间</li>
            <li>✅ 理解TLB缺失的处理流程</li>
          </ul>
        </div>
      </template>
      
      <!-- 段式虚拟存储器详解 -->
      <template v-if="currentCard?.id === 'segmentedVirtualMemory'">
        <h3>💡 知识点卡片：段式虚拟存储器详解</h3>
        
        <div class="card-section">
          <h4>📖 基本概念</h4>
          <ul>
            <li><strong>定义</strong>：将程序的逻辑地址空间划分为若干个段（代码段、数据段、栈段等），每个段长度可变</li>
            <li><strong>地址结构</strong>：| 段号 | 段内偏移 |</li>
            <li><strong>段表</strong>：记录每个段的基址和长度，实现逻辑段到物理内存的映射</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🎯 分段方式的透明性 ⭐⭐⭐</h4>
          <el-table :data="segmentTransparencyData" border stripe style="width: 100%">
            <el-table-column prop="role" label="角色" width="150" />
            <el-table-column prop="transparent" label="是否透明" width="120" />
            <el-table-column prop="explanation" label="说明" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>📊 段式 vs 页式对比</h4>
          <el-table :data="segmentVsPageData" border stripe style="width: 100%">
            <el-table-column prop="feature" label="特性" width="120" />
            <el-table-column prop="segmented" label="段式" />
            <el-table-column prop="paged" label="页式" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>⚠️ 段式虚存的优缺点</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div style="background: #f0f9ff; padding: 12px; border-radius: 8px; border-left: 4px solid #409eff;">
              <h5 style="margin: 0 0 8px 0; color: #409eff;">优点</h5>
              <ul style="margin: 0; padding-left: 20px;">
                <li>符合用户视角（按逻辑模块划分）</li>
                <li>便于信息共享和保护</li>
                <li>支持动态链接</li>
                <li>段长可变，灵活性强</li>
              </ul>
            </div>
            <div style="background: #fef0f0; padding: 12px; border-radius: 8px; border-left: 4px solid #f56c6c;">
              <h5 style="margin: 0 0 8px 0; color: #f56c6c;">缺点</h5>
              <ul style="margin: 0; padding-left: 20px;">
                <li>产生外部碎片</li>
                <li>需要紧凑技术（compaction）</li>
                <li>管理复杂度高</li>
                <li>地址转换速度较慢</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》虚拟存储器章节中：</p>
          <ul>
            <li>✅ 理解段式虚存的基本原理</li>
            <li>✅ 掌握分段方式对不同程序员的透明性</li>
            <li>✅ 能够对比段式和页式的优缺点</li>
            <li>✅ 了解段页式虚存的三次访存过程</li>
          </ul>
        </div>
      </template>
      
      <!-- 多体交叉存储器详解 -->
      <template v-if="currentCard?.id === 'interleavedMemory'">
        <h3>💡 知识点卡片：多体交叉存储器详解</h3>
        
        <div class="card-section">
          <h4>📖 基本概念</h4>
          <ul>
            <li><strong>定义</strong>：将主存划分为多个独立的存储模块（体），通过并行访问提高存储器带宽</li>
            <li><strong>目的</strong>：解决CPU与主存速度不匹配问题</li>
            <li><strong>核心思想</strong>：连续地址分布在不同模块，实现并行访问</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📊 低位交叉 vs 高位交对比</h4>
          <el-table :data="interleavedComparisonData" border stripe style="width: 100%">
            <el-table-column prop="feature" label="特性" width="120" />
            <el-table-column prop="lowInterleave" label="低位交叉" />
            <el-table-column prop="highInterleave" label="高位交叉" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>🔍 低位交叉编址详解 ⭐⭐⭐</h4>
          <ul>
            <li><strong>编址方式</strong>：地址的低位选择模块号，高位选择模块内地址</li>
            <li><strong>示例</strong>（4体交叉）：
              <pre style="background: #f5f7fa; padding: 8px; border-radius: 4px; margin-top: 8px;">地址格式：| 高位地址 | 模块号(2位) |
地址0 → 模块0，地址1 → 模块1，地址2 → 模块2，地址3 → 模块3
地址4 → 模块0，地址5 → 模块1...</pre>
            </li>
            <li><strong>带宽提升</strong>：
              <ul>
                <li>理想情况下，m体交叉存储器的带宽是单体存储器的m倍</li>
                <li>公式：<code>带宽 = m × (字长 / 存取周期)</code></li>
              </ul>
            </li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📝 例题解析</h4>
          <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; border-left: 4px solid #409eff;">
            <p style="margin: 0 0 12px 0;"><strong>题目</strong>：某存储器采用4体低位交叉编址，存取周期为200ns，字长为32位。求存储器带宽。</p>
            <p style="margin: 0 0 8px 0;"><strong>解</strong>：</p>
            <ul style="margin: 0; padding-left: 20px;">
              <li>单体带宽 = 32位 / 200ns = 160 Mbps</li>
              <li>4体交叉带宽 = 4 × 160 Mbps = <span style="color: #4CAF50; font-weight: bold;">640 Mbps</span></li>
            </ul>
          </div>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》存储器章节中：</p>
          <ul>
            <li>✅ 理解低位交叉和高位交叉的区别</li>
            <li>✅ 掌握低位交叉的地址分配方式</li>
            <li>✅ 能够计算多体交叉存储器的带宽</li>
            <li>✅ 理解为什么现代计算机采用低位交叉</li>
          </ul>
        </div>
      </template>
      
      <!-- 扩展操作码技术详解 -->
      <template v-if="currentCard?.id === 'extendedOpcode'">
        <h3>💡 知识点卡片：扩展操作码技术详解</h3>
        
        <div class="card-section">
          <h4>📖 基本概念</h4>
          <ul>
            <li><strong>定义</strong>：通过缩短地址码位数来扩展操作码位数，实现变长操作码的技术</li>
            <li><strong>核心思想</strong>：高频指令使用短操作码，低频指令使用长操作码</li>
            <li><strong>设计原则</strong>：必须保证指令的唯一性（无歧义）</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🎯 设计原则</h4>
          <ol>
            <li><strong>高频短码</strong>：常用指令（如MOV、ADD）使用短操作码，节省空间</li>
            <li><strong>低频长码</strong>：不常用指令（如特权指令）使用长操作码，充分利用编码空间</li>
            <li><strong>唯一性原则</strong>：任何指令的编码不能是另一条指令的前缀（避免歧义）</li>
          </ol>
          <div style="background: #fff7e6; padding: 12px; border-radius: 8px; border-left: 4px solid #faad14; margin-top: 12px;">
            <p style="margin: 0; font-weight: bold; color: #fa8c16;">⚠️ 记忆口诀："高频短码，低频长码，唯一性原则"</p>
          </div>
        </div>
        
        <div class="card-section">
          <h4>📝 经典例题解析 ⭐⭐⭐</h4>
          <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; border-left: 4px solid #409eff;">
            <p style="margin: 0 0 12px 0;"><strong>题目</strong>：某指令系统采用扩展操作码，指令字长16位，每个地址码4位。若已有15条三地址指令、14条二地址指令、31条一地址指令，问能否再设计16条零地址指令？</p>
            
            <p style="margin: 16px 0 8px 0; font-weight: bold; color: #409eff;">解题步骤：</p>
            
            <p style="margin: 8px 0;"><strong>Step 1：分析三地址指令</strong></p>
            <ul style="margin: 4px 0; padding-left: 20px;">
              <li>指令格式：OP(4位) + A1(4位) + A2(4位) + A3(4位)</li>
              <li>15条三地址指令用掉：15种操作码组合（0000~1110）</li>
              <li>剩余：2⁴ - 15 = 1种组合（1111）可用于后续指令</li>
              <li>这1种组合可以扩展出：1 × 2⁴ × 2⁴ = 256种编码用于二地址及以下指令</li>
            </ul>
            
            <p style="margin: 12px 0 8px 0;"><strong>Step 2：分析二地址指令</strong></p>
            <ul style="margin: 4px 0; padding-left: 20px;">
              <li>指令格式：1111 + OP(4位) + A1(4位) + A2(4位)</li>
              <li>14条二地址指令用掉：14种组合（1111_0000~1111_1101）</li>
              <li>剩余：256 - 14×2⁴ = 256 - 224 = 32种组合用于一地址及以下指令</li>
            </ul>
            
            <p style="margin: 12px 0 8px 0;"><strong>Step 3：分析一地址指令</strong></p>
            <ul style="margin: 4px 0; padding-left: 20px;">
              <li>指令格式：1111_1110/1111_1111 + OP(4位) + A1(4位)</li>
              <li>可用组合：2种（1111_1110, 1111_1111）</li>
              <li>31条一地址指令用掉：31种组合</li>
              <li>剩余：32 - 31 = 1种组合（1111_1111_1111）用于零地址指令</li>
            </ul>
            
            <p style="margin: 12px 0 8px 0;"><strong>Step 4：分析零地址指令</strong></p>
            <ul style="margin: 4px 0; padding-left: 20px;">
              <li>指令格式：1111_1111_1111 + OP(4位)</li>
              <li>可用编码：1 × 2⁴ = 16种</li>
              <li>需要设计：16条零地址指令</li>
              <li><span style="color: #4CAF50; font-weight: bold;">✅ 结论：刚好可以设计16条零地址指令！</span></li>
            </ul>
          </div>
        </div>
        
        <div class="card-section">
          <h4>⚠️ 常见陷阱与注意事项</h4>
          <ul>
            <li><strong>陷阱1</strong>：忘记检查唯一性原则 → 确保短操作码不是长操作码的前缀</li>
            <li><strong>陷阱2</strong>：计算错误 → 每扩展一位，编码空间翻倍（×2ⁿ）</li>
            <li><strong>陷阱3</strong>：混淆地址码位数 → 题目中"每个地址码4位"意味着每次扩展都是×2⁴=×16</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》指令系统章节中：</p>
          <ul>
            <li>✅ 掌握扩展操作码的设计原理和计算方法</li>
            <li>✅ 能够判断给定的指令数量是否可行</li>
            <li>✅ 理解唯一性原则的重要性</li>
            <li>✅ 熟练运用"高频短码，低频长码"的设计思想</li>
          </ul>
        </div>
      </template>
      
      <!-- 8种数据寻址方式完全指南 -->
      <template v-if="currentCard?.id === 'addressingModes'">
        <h3>💡 知识点卡片：8种数据寻址方式完全指南</h3>
        
        <div class="card-section">
          <h4>📊 8种寻址方式对比总表</h4>
          <el-table :data="addressingModesData" border stripe style="width: 100%">
            <el-table-column prop="mode" label="寻址方式" width="120" />
            <el-table-column prop="ea" label="有效地址EA" width="150" />
            <el-table-column prop="memoryAccess" label="访存次数" width="100" />
            <el-table-column prop="advantage" label="优点" />
            <el-table-column prop="application" label="典型应用" width="150" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>🔍 三大易混淆寻址方式深度对比 ⭐⭐⭐</h4>
          <el-table :data="confusingModesData" border stripe style="width: 100%">
            <el-table-column prop="aspect" label="对比项" width="120" />
            <el-table-column prop="base" label="基址寻址" />
            <el-table-column prop="index" label="变址寻址" />
            <el-table-column prop="relative" label="相对寻址" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>⚡ 快速判断技巧</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div style="background: #f0f9ff; padding: 12px; border-radius: 8px;">
              <p style="margin: 0 0 8px 0; font-weight: bold; color: #409eff;">看到这些关键词 → 选择对应寻址方式</p>
              <ul style="margin: 0; padding-left: 20px; font-size: 0.9em;">
                <li>"#"或"立即数" → <strong>立即寻址</strong></li>
                <li>"Ri"或"寄存器" → <strong>寄存器寻址</strong></li>
                <li>"地址码即为有效地址" → <strong>直接寻址</strong></li>
                <li>"@"或"两次访存" → <strong>间接寻址</strong></li>
                <li>"寄存器中存放的是地址" → <strong>寄存器间接寻址</strong></li>
                <li>"多道程序"、"重定位" → <strong>基址寻址</strong></li>
                <li>"数组"、"循环"、"下标" → <strong>变址寻址</strong></li>
                <li>"转移"、"跳转"、"分支" → <strong>相对寻址</strong></li>
              </ul>
            </div>
            <div style="background: #fff7e6; padding: 12px; border-radius: 8px;">
              <p style="margin: 0 0 8px 0; font-weight: bold; color: #faad14;">记忆口诀</p>
              <ul style="margin: 0; padding-left: 20px; font-size: 0.9em;">
                <li>"立即最快，寄存器次之"</li>
                <li>"直接一次，间接两次"</li>
                <li>"基于操作系统重定位"</li>
                <li>"变化下标处理数组"</li>
                <li>"相对跳转位置无关"</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》指令系统章节中：</p>
          <ul>
            <li>✅ 熟练掌握8种寻址方式的EA计算公式</li>
            <li>✅ 能够根据应用场景选择最合适的寻址方式</li>
            <li>✅ 重点掌握基址、变址、相对三种寻址方式的区别</li>
            <li>✅ 能够分析综合应用题中的寻址方式</li>
          </ul>
        </div>
      </template>
      
      <!-- CISC与RISC全面对比 -->
      <template v-if="currentCard?.id === 'ciscVsRisc'">
        <h3>💡 知识点卡片：CISC与RISC全面对比</h3>
        
        <div class="card-section">
          <h4>📊 15维度详细对比表</h4>
          <el-table :data="ciscRiscComparisonData" border stripe style="width: 100%">
            <el-table-column prop="aspect" label="对比项" width="120" />
            <el-table-column prop="cisc" label="CISC" />
            <el-table-column prop="risc" label="RISC" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>🔑 RISC核心特点：Load/Store架构</h4>
          <ul>
            <li><strong>定义</strong>：只有LOAD和STORE指令可以访问内存，其他指令只能操作寄存器</li>
            <li><strong>LOAD指令</strong>：从内存加载数据到寄存器 📖</li>
            <li><strong>STORE指令</strong>：从寄存器存储数据到内存 📝</li>
            <li><strong>其他指令</strong>：如ADD、SUB只能在寄存器之间操作 🔢</li>
          </ul>
          <div style="background: #f0f9ff; padding: 12px; border-radius: 8px; margin-top: 12px;">
            <p style="margin: 0;"><strong>优点</strong>：简化了指令执行流程，便于流水线优化，提高执行速度 ⚡⚡⚡</p>
          </div>
        </div>
        
        <div class="card-section">
          <h4>🤝 现代处理器：CISC与RISC的融合</h4>
          <ul>
            <li><strong>CISC内部采用RISC思想</strong>：
              <ul>
                <li>x86处理器将复杂指令分解为微操作（μops）执行 🔧</li>
                <li>外部接口仍是CISC（保持兼容性），内部执行引擎是RISC风格 ⚡</li>
              </ul>
            </li>
            <li><strong>RISC增加复杂指令</strong>：
              <ul>
                <li>ARMv8增加浮点运算、SIMD等复杂指令 💪</li>
                <li>RISC-V逐步扩展指令集（向量扩展、加密扩展等） 🔧</li>
              </ul>
            </li>
            <li><strong>共同特点</strong>：
              <ul>
                <li>超标量架构、深流水线、乱序执行、分支预测、多级Cache、多核技术 🚀</li>
              </ul>
            </li>
          </ul>
          <div style="background: #fff7e6; padding: 12px; border-radius: 8px; margin-top: 12px;">
            <p style="margin: 0; font-weight: bold; color: #fa8c16;">💡 结论：现代处理器是CISC和RISC的混合体，关键看微架构设计质量！</p>
          </div>
        </div>
        
        <div class="card-section">
          <h4>📱 典型产品与应用场景</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div style="background: #fef0f0; padding: 12px; border-radius: 8px;">
              <h5 style="margin: 0 0 8px 0; color: #f56c6c;">CISC代表</h5>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Intel Core系列（PC、服务器）</li>
                <li>AMD Ryzen系列（PC、工作站）</li>
                <li>应用场景：个人电脑、服务器、工作站 💻🖥️</li>
              </ul>
            </div>
            <div style="background: #f0f9ff; padding: 12px; border-radius: 8px;">
              <h5 style="margin: 0 0 8px 0; color: #409eff;">RISC代表</h5>
              <ul style="margin: 0; padding-left: 20px;">
                <li>ARM（iPhone、安卓手机）</li>
                <li>MIPS（路由器、游戏机）</li>
                <li>RISC-V（IoT设备、AI加速器）</li>
                <li>应用场景：移动设备、嵌入式系统 📱🔧</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》指令系统章节中：</p>
          <ul>
            <li>✅ 掌握CISC和RISC的核心区别（至少5点）</li>
            <li>✅ 理解Load/Store架构的含义和优势</li>
            <li>✅ 了解现代处理器的融合趋势</li>
            <li>✅ 能够根据应用场景选择合适的架构</li>
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
          <h4>🎓 考研重点（408计算机）</h4>
          <p>在《计算机组成原理》外存储器章节中：</p>
          <ul>
            <li>✅ 理解RAID的基本概念和目的</li>
            <li>✅ 掌握常见RAID级别的优缺点</li>
            <li>✅ 能够计算RAID的空间利用率</li>
            <li>✅ 理解parity的工作原理</li>
          </ul>
        </div>
      </template>
      
      <!-- 读操作与写操作的区别 -->
      <template v-if="currentCard?.id === 'readWriteOps'">
        <h3>💡 知识点卡片：读操作与写操作的区别</h3>
        
        <div class="card-section">
          <h4>📖 读操作（Read Operation）</h4>
          <ul>
            <li><strong>定义</strong>：从存储器中取出数据</li>
            <li><strong>流程</strong>：
              <ol>
                <li>CPU送出地址到地址总线</li>
                <li>存储器根据地址找到对应单元</li>
                <li>将数据放到数据总线上</li>
                <li>CPU从数据总线读取数据</li>
              </ol>
            </li>
            <li><strong>特点</strong>：
              <ul>
                <li>✅ 不改变存储单元内容</li>
                <li>✅ 属于非破坏性操作</li>
                <li>✅ 可以连续读取</li>
              </ul>
            </li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>✍️ 写操作（Write Operation）</h4>
          <ul>
            <li><strong>定义</strong>：将数据存入存储器</li>
            <li><strong>流程</strong>：
              <ol>
                <li>CPU送出地址到地址总线</li>
                <li>CPU将数据放到数据总线</li>
                <li>CPU发出写控制信号</li>
                <li>存储器将数据写入指定单元</li>
              </ol>
            </li>
            <li><strong>特点</strong>：
              <ul>
                <li>⚠️ 会覆盖原有数据</li>
                <li>⚠️ 属于破坏性操作</li>
                <li>⚠️ 需要写使能信号</li>
              </ul>
            </li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📊 关键区别对比表</h4>
          <el-table :data="readWriteComparisonData" border stripe style="width: 100%">
            <el-table-column prop="aspect" label="对比项" width="120" />
            <el-table-column prop="read" label="读操作" width="200" />
            <el-table-column prop="write" label="写操作" />
          </el-table>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》主存储器章节中：</p>
          <ul>
            <li>✅ 掌握读操作和写操作的流程</li>
            <li>✅ 理解两者的本质区别（数据流向、破坏性）</li>
            <li>✅ 能够分析存储器访问时序图</li>
          </ul>
        </div>
      </template>
      
      <!-- 局部性原理详解 -->
      <template v-if="currentCard?.id === 'localityPrinciple'">
        <h3>💡 知识点卡片：局部性原理详解</h3>
        
        <div class="card-section">
          <h4>⏱️ 时间局部性（Temporal Locality）</h4>
          <ul>
            <li><strong>定义</strong>：如果某信息被访问，那么在不久的将来它可能再次被访问</li>
            <li><strong>原因</strong>：程序中存在循环结构、子程序调用、变量重复使用</li>
            <li><strong>示例</strong>：
              <pre style="background: #f5f7fa; padding: 12px; border-radius: 4px; overflow-x: auto;">for (i = 0; i < 1000; i++) {
    sum = sum + array[i];  // sum变量每次循环都被访问
}</pre>
              - `sum`变量在每次循环中都被访问 → 时间局部性好
            </li>
            <li><strong>应用</strong>：Cache缓存最近访问的数据</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📍 空间局部性（Spatial Locality）</h4>
          <ul>
            <li><strong>定义</strong>：如果某存储单元被访问，那么它附近的存储单元也可能被访问</li>
            <li><strong>原因</strong>：程序顺序执行、数组连续存储、指令连续存放</li>
            <li><strong>示例</strong>：
              <pre style="background: #f5f7fa; padding: 12px; border-radius: 4px; overflow-x: auto;">int array[100];
for (i = 0; i < 100; i++) {
    sum = sum + array[i];  // 数组元素连续访问
}</pre>
              - 访问array[0]后，很可能访问array[1]、array[2]... → 空间局部性好
            </li>
            <li><strong>应用</strong>：Cache预取相邻数据块</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📊 局部性原理的度量</h4>
          <el-table :data="localityMeasurementData" border stripe style="width: 100%">
            <el-table-column prop="type" label="类型" width="150" />
            <el-table-column prop="measurement" label="度量方法" />
            <el-table-column prop="good" label="良好表现" width="200" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>🔧 在存储系统中的应用</h4>
          <ol>
            <li><strong>Cache设计</strong>：利用局部性原理缓存常用数据
              <ul>
                <li>时间局部性 → 保留最近访问的数据</li>
                <li>空间局部性 → 预取相邻数据块</li>
              </ul>
            </li>
            <li><strong>虚拟存储器</strong>：只将当前需要的页面调入主存
              <ul>
                <li>页面置换算法（LRU）基于时间局部性</li>
                <li>预取机制基于空间局部性</li>
              </ul>
            </li>
          </ol>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》存储系统章节中：</p>
          <ul>
            <li>✅ 掌握时间局部性和空间局部性的定义</li>
            <li>✅ 能够分析代码的局部性特征</li>
            <li>✅ 理解局部性原理在Cache和虚存中的应用</li>
          </ul>
        </div>
      </template>
      
      <!-- 组相联映射实例 -->
      <template v-if="currentCard?.id === 'setAssociativeExample'">
        <h3>💡 知识点卡片：组相联映射实例</h3>
        
        <div class="card-section">
          <h4>📝 典型例题</h4>
          <p><strong>题目</strong>：设主存容量为1MB，Cache容量为16KB，每块32B，采用4路组相联映射，求地址格式。</p>
        </div>
        
        <div class="card-section">
          <h4>🔍 解题步骤</h4>
          
          <h5 style="margin-top: 16px; color: #409eff;">步骤1：计算块内偏移位数</h5>
          <pre style="background: #f5f7fa; padding: 12px; border-radius: 4px; overflow-x: auto;">块大小 = 32B = 2^5B
块内偏移 = 5位</pre>
          
          <h5 style="margin-top: 16px; color: #409eff;">步骤2：计算Cache块数</h5>
          <pre style="background: #f5f7fa; padding: 12px; border-radius: 4px; overflow-x: auto;">Cache容量 = 16KB = 2^14B
Cache块数 = 16KB / 32B = 512块</pre>
          
          <h5 style="margin-top: 16px; color: #409eff;">步骤3：计算组数</h5>
          <pre style="background: #f5f7fa; padding: 12px; border-radius: 4px; overflow-x: auto;">4路组相联 → 每组4块
组数 = 512 / 4 = 128组 = 2^7
组号 = 7位</pre>
          
          <h5 style="margin-top: 16px; color: #409eff;">步骤4：计算主存块数</h5>
          <pre style="background: #f5f7fa; padding: 12px; border-radius: 4px; overflow-x: auto;">主存容量 = 1MB = 2^20B
主存块数 = 1MB / 32B = 32768块 = 2^15</pre>
          
          <h5 style="margin-top: 16px; color: #409eff;">步骤5：计算标记位数</h5>
          <pre style="background: #f5f7fa; padding: 12px; border-radius: 4px; overflow-x: auto;">主存地址 = 20位（1MB = 2^20B）
标记 = 主存地址 - 组号 - 块内偏移
标记 = 20 - 7 - 5 = 8位</pre>
        </div>
        
        <div class="card-section">
          <h4>✅ 最终答案</h4>
          <pre style="background: #e8f5e9; padding: 12px; border-radius: 4px; overflow-x: auto; border-left: 4px solid #4CAF50;">地址格式：
| 标记Tag(8位) | 组号Set(7位) | 块内偏移Offset(5位) |</pre>
          
          <h5 style="margin-top: 16px; color: #409eff;">映射规则</h5>
          <ul>
            <li>主存块号 mod 组数 = 组号</li>
            <li>例：主存块号 = 100
              <ul>
                <li>100 mod 128 = 100 → 映射到第100组</li>
                <li>可以放在第100组的任意一行（0/1/2/3行）</li>
              </ul>
            </li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》Cache章节中：</p>
          <ul>
            <li>✅ 掌握组相联映射的地址格式计算方法</li>
            <li>✅ 能够进行类似题型的计算</li>
            <li>✅ 理解映射规则和冲突情况</li>
          </ul>
        </div>
      </template>
      
      <!-- 映射表有效位 -->
      <template v-if="currentCard?.id === 'validBit'">
        <h3>💡 知识点卡片：映射表有效位（必考点）</h3>
        
        <div class="card-section">
          <h4>⚠️ 为什么需要有效位？</h4>
          <ul>
            <li>Cache初始化时，所有块都是<strong>无效</strong>的（没有数据）</li>
            <li>标记（Tag）字段可能有任意值（可能是上次残留的数据）</li>
            <li>如果不检查有效位，可能会<strong>误判为命中</strong></li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🔑 有效位的作用</h4>
          <ul>
            <li><strong>有效位 = 1</strong>：该Cache块包含有效数据</li>
            <li><strong>有效位 = 0</strong>：该Cache块为空或数据已无效</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📋 映射表结构</h4>
          
          <h5 style="margin-top: 16px; color: #409eff;">直接映射映射表项</h5>
          <pre style="background: #f5f7fa; padding: 12px; border-radius: 4px; overflow-x: auto;">| 有效位(1位) | 标记Tag | 数据块 |</pre>
          
          <h5 style="margin-top: 16px; color: #409eff;">组相联映射映射表项</h5>
          <pre style="background: #f5f7fa; padding: 12px; border-radius: 4px; overflow-x: auto;">| 有效位(1位) | 标记Tag | 数据块 |</pre>
          <p style="color: #606266;">（每组有多个这样的表项）</p>
        </div>
        
        <div class="card-section">
          <h4>🔄 有效位的使用流程</h4>
          
          <h5 style="margin-top: 16px; color: #409eff;">读操作流程</h5>
          <ol>
            <li>根据地址找到Cache块</li>
            <li><strong>检查有效位</strong>：
              <ul>
                <li>有效位 = 0 → 未命中，访问主存</li>
                <li>有效位 = 1 → 继续检查标记</li>
              </ul>
            </li>
            <li>比较标记Tag：
              <ul>
                <li>Tag匹配 → 命中，返回数据</li>
                <li>Tag不匹配 → 未命中，访问主存</li>
              </ul>
            </li>
          </ol>
          
          <h5 style="margin-top: 16px; color: #409eff;">写操作流程</h5>
          <ol>
            <li>根据地址找到Cache块</li>
            <li>检查有效位和标记</li>
            <li>如果未命中，从主存调入块，<strong>设置有效位 = 1</strong></li>
            <li>写入数据到Cache</li>
          </ol>
        </div>
        
        <div class="card-section">
          <h4>🎯 重要考点</h4>
          <div style="background: #fff7e6; padding: 16px; border-radius: 8px; border-left: 4px solid #faad14;">
            <p style="margin: 0; font-weight: bold; color: #fa8c16;">⚠️ 必考点：映射表必须要有一位有效位！</p>
          </div>
          
          <h5 style="margin-top: 16px; color: #409eff;">原因</h5>
          <ul>
            <li>避免Cache初始化时的误判</li>
            <li>区分有效数据和无效数据</li>
            <li>确保Cache命中判断的准确性</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📝 真题示例</h4>
          <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; border-left: 4px solid #409eff;">
            <p style="margin: 0 0 12px 0;"><strong>题目</strong>：Cache的映射表中，每个映射项除了标记和数据外，还必须包含（ ）</p>
            <p style="margin: 0 0 8px 0;">A. 替换算法标志 &nbsp;&nbsp; B. 有效位 &nbsp;&nbsp; C. 修改位 &nbsp;&nbsp; D. 以上都是</p>
            <p style="margin: 0; color: #4CAF50; font-weight: bold;">✅ 答案：B（有效位是必须的，修改位和替换算法标志是可选的）</p>
          </div>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》Cache章节中：</p>
          <ul>
            <li>✅ 理解有效位的必要性和作用</li>
            <li>✅ 掌握有效位在读写操作中的使用流程</li>
            <li>✅ 能够回答相关选择题</li>
          </ul>
        </div>
      </template>
      
      <!-- 标志寄存器详解 -->
      <template v-if="currentCard?.id === 'flagsRegister'">
        <h3>💡 知识点卡片：标志寄存器详解</h3>
        
        <div class="card-section">
          <h4>📖 什么是标志寄存器？</h4>
          <ul>
            <li><strong>定义</strong>：FLAGS（16位）/ EFLAGS（32位）/ RFLAGS（64位）是CPU中用于存储运算结果状态和控制CPU行为的特殊寄存器</li>
            <li><strong>作用</strong>：记录算术/逻辑运算的结果特征，控制CPU的执行流程</li>
            <li><strong>分类</strong>：分为<strong>状态标志位</strong>和<strong>控制标志位</strong>两大类</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🔢 状态标志位（6个）⭐⭐⭐</h4>
          <p style="color: #606266; margin-bottom: 12px;">反映最近一次运算结果的状态，由CPU自动设置，程序员可以读取但不能直接修改</p>
          
          <el-table :data="statusFlagsData" border stripe style="width: 100%">
            <el-table-column prop="name" label="标志位" width="100" />
            <el-table-column prop="fullName" label="全称" width="150" />
            <el-table-column prop="condition" label="置1条件" />
            <el-table-column prop="application" label="典型应用" width="150" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>🎛️ 控制标志位（3个）</h4>
          <p style="color: #606266; margin-bottom: 12px;">控制CPU的特定行为，可以由程序员通过指令设置或清除</p>
          
          <el-table :data="controlFlagsData" border stripe style="width: 100%">
            <el-table-column prop="name" label="标志位" width="100" />
            <el-table-column prop="fullName" label="全称" width="150" />
            <el-table-column prop="value1" label="=1时的行为" />
            <el-table-column prop="value0" label="=0时的行为" />
            <el-table-column prop="instruction" label="相关指令" width="120" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>📊 标志寄存器结构（EFLAGS 32位）</h4>
          <pre style="background: #f5f7fa; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 0.9em;">位位置：  31...22 21 20 19 18 17 16 15...12 11 10  9  8  7  6  5  4  3  2  1  0
         | 保留  | ID | VIP|VIF|AC |VM |RF | 保留   | NT | IOPL | OF |DF |IF |TF |SF |ZF |  |AF |  |PF |  |CF |
                                                                                      ↑状态标志位↑  ↑控制标志位↑</pre>
          <p style="margin-top: 12px; color: #606266;"><strong>说明</strong>：</p>
          <ul>
            <li><strong>低12位</strong>：包含6个状态标志位和3个控制标志位（考研重点）</li>
            <li><strong>高20位</strong>：系统标志位和控制位（操作系统使用，考研较少涉及）</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🔍 状态标志位详解</h4>
          
          <h5 style="margin-top: 16px; color: #409eff;">1. CF（Carry Flag）进位标志</h5>
          <ul>
            <li><strong>无符号数运算</strong>时，最高位产生进位或借位则CF=1</li>
            <li><strong>示例</strong>：
              <pre style="background: #f5f7fa; padding: 8px; border-radius: 4px; margin-top: 8px;">8位无符号数：255 + 1 = 256（溢出）
11111111 + 00000001 = 1 00000000
                        ↑ CF=1（有进位）</pre>
            </li>
            <li><strong>应用</strong>：多精度加法、无符号数比较</li>
          </ul>
          
          <h5 style="margin-top: 16px; color: #409eff;">2. PF（Parity Flag）奇偶标志</h5>
          <ul>
            <li>运算结果<strong>最低8位</strong>中1的个数为偶数则PF=1</li>
            <li><strong>示例</strong>：结果 = 01100101（3个1）→ PF=0（奇数个）</li>
            <li><strong>应用</strong>：数据通信中的奇偶校验（现在很少用）</li>
          </ul>
          
          <h5 style="margin-top: 16px; color: #409eff;">3. AF（Auxiliary Carry Flag）辅助进位标志</h5>
          <ul>
            <li>运算结果<strong>第3位向第4位</strong>产生进位或借位则AF=1</li>
            <li><strong>应用</strong>：BCD码（二进制编码的十进制数）运算调整</li>
          </ul>
          
          <h5 style="margin-top: 16px; color: #409eff;">4. ZF（Zero Flag）零标志 ⭐⭐⭐</h5>
          <ul>
            <li>运算结果为<strong>0</strong>则ZF=1，否则ZF=0</li>
            <li><strong>示例</strong>：5 - 5 = 0 → ZF=1</li>
            <li><strong>应用</strong>：判断相等、循环结束条件、条件跳转（JE/JZ）</li>
          </ul>
          
          <h5 style="margin-top: 16px; color: #409eff;">5. SF（Sign Flag）符号标志 ⭐⭐⭐</h5>
          <ul>
            <li>运算结果的<strong>最高位</strong>（符号位）为1则SF=1（负数），为0则SF=0（正数）</li>
            <li><strong>示例</strong>：结果 = 10000001 → SF=1（负数）</li>
            <li><strong>应用</strong>：有符号数比较、判断正负</li>
          </ul>
          
          <h5 style="margin-top: 16px; color: #409eff;">6. OF（Overflow Flag）溢出标志 ⭐⭐⭐</h5>
          <ul>
            <li><strong>有符号数运算</strong>时，结果超出表示范围则OF=1</li>
            <li><strong>判断方法</strong>：
              <ul>
                <li>两个正数相加得负数 → OF=1</li>
                <li>两个负数相加得正数 → OF=1</li>
                <li>正数加负数 → OF=0（不会溢出）</li>
              </ul>
            </li>
            <li><strong>示例</strong>：
              <pre style="background: #f5f7fa; padding: 8px; border-radius: 4px; margin-top: 8px;">8位有符号数：127 + 1 = 128（溢出）
01111111 + 00000001 = 10000000
                        ↑ OF=1（正+正=负，溢出）</pre>
            </li>
            <li><strong>应用</strong>：有符号数运算的溢出检测</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>⚠️ CF vs OF 的区别（必考点）⭐⭐⭐</h4>
          <el-table :data="cfVsOfData" border stripe style="width: 100%">
            <el-table-column prop="aspect" label="对比项" width="120" />
            <el-table-column prop="cf" label="CF（进位标志）" />
            <el-table-column prop="of" label="OF（溢出标志）" />
          </el-table>
          
          <div style="background: #fff7e6; padding: 12px; border-radius: 8px; border-left: 4px solid #faad14; margin-top: 12px;">
            <p style="margin: 0; font-weight: bold; color: #fa8c16;">💡 记忆口诀："CF看无符号，OF看有符号"</p>
          </div>
        </div>
        
        <div class="card-section">
          <h4>🔧 控制标志位详解</h4>
          
          <h5 style="margin-top: 16px; color: #409eff;">1. DF（Direction Flag）方向标志</h5>
          <ul>
            <li><strong>DF=0</strong>：字符串操作时地址<strong>递增</strong>（从低到高）</li>
            <li><strong>DF=1</strong>：字符串操作时地址<strong>递减</strong>（从高到低）</li>
            <li><strong>相关指令</strong>：CLD（清DF）、STD（置DF）</li>
            <li><strong>应用</strong>：字符串复制、比较等操作的方向控制</li>
          </ul>
          
          <h5 style="margin-top: 16px; color: #409eff;">2. IF（Interrupt Flag）中断标志</h5>
          <ul>
            <li><strong>IF=1</strong>：允许响应可屏蔽中断（INTR）</li>
            <li><strong>IF=0</strong>：禁止响应可屏蔽中断</li>
            <li><strong>相关指令</strong>：CLI（清IF）、STI（置IF）</li>
            <li><strong>应用</strong>：临界区保护、中断控制</li>
          </ul>
          
          <h5 style="margin-top: 16px; color: #409eff;">3. TF（Trap Flag）陷阱标志</h5>
          <ul>
            <li><strong>TF=1</strong>：进入<strong>单步调试</strong>模式，每执行一条指令产生一次调试异常</li>
            <li><strong>TF=0</strong>：正常执行</li>
            <li><strong>应用</strong>：调试器使用（如GDB、OllyDbg）</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📝 经典例题解析 ⭐⭐⭐</h4>
          <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; border-left: 4px solid #409eff;">
            <p style="margin: 0 0 12px 0;"><strong>题目</strong>：设AL=80H，BL=80H，执行ADD AL, BL后，SF、ZF、CF、OF的值分别是多少？</p>
            
            <p style="margin: 12px 0 8px 0; font-weight: bold; color: #409eff;">解题步骤：</p>
            
            <p style="margin: 8px 0;"><strong>Step 1：计算结果</strong></p>
            <pre style="background: #f5f7fa; padding: 8px; border-radius: 4px;">80H + 80H = 100H
10000000 + 10000000 = 1 00000000
结果：AL=00H，有进位</pre>
            
            <p style="margin: 12px 0 8px 0;"><strong>Step 2：判断各标志位</strong></p>
            <ul style="margin: 4px 0; padding-left: 20px;">
              <li><strong>SF</strong>：结果最高位 = 0 → <span style="color: #4CAF50; font-weight: bold;">SF=0</span></li>
              <li><strong>ZF</strong>：结果 = 00H → <span style="color: #4CAF50; font-weight: bold;">ZF=1</span></li>
              <li><strong>CF</strong>：无符号数运算，有进位 → <span style="color: #4CAF50; font-weight: bold;">CF=1</span></li>
              <li><strong>OF</strong>：有符号数运算，80H=-128，(-128)+(-128)=-256（溢出）→ <span style="color: #4CAF50; font-weight: bold;">OF=1</span></li>
            </ul>
            
            <p style="margin: 12px 0 0 0; color: #4CAF50; font-weight: bold;">✅ 答案：SF=0, ZF=1, CF=1, OF=1</p>
          </div>
        </div>
        
        <div class="card-section">
          <h4>🎯 常见应用场景</h4>
          <ol>
            <li><strong>条件跳转</strong>：
              <ul>
                <li>JE/JZ（ZF=1）：相等/为零时跳转</li>
                <li>JNE/JNZ（ZF=0）：不等/非零时跳转</li>
                <li>JS（SF=1）：结果为负时跳转</li>
                <li>JO（OF=1）：溢出时跳转</li>
                <li>JB/JC（CF=1）：无符号数小于/有进位时跳转</li>
              </ul>
            </li>
            <li><strong>比较指令 CMP</strong>：实质是做减法但不保存结果，只影响标志位</li>
            <li><strong>循环控制</strong>：利用ZF判断循环是否结束</li>
          </ol>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点（408计算机）</h4>
          <p>在《计算机组成原理》运算方法和运算器章节中：</p>
          <ul>
            <li>✅ 掌握6个状态标志位的含义和置位条件（必考选择题）</li>
            <li>✅ 理解CF和OF的区别（无符号vs有符号）</li>
            <li>✅ 能够根据运算结果判断各标志位的值</li>
            <li>✅ 了解3个控制标志位的作用</li>
            <li>✅ 能够分析标志位在条件跳转中的应用</li>
          </ul>
        </div>
      </template>
      
      <!-- 通用寄存器的多功能特性 -->
      <template v-if="currentCard?.id === 'generalPurposeRegisters'">
        <h3>💡 知识点卡片：通用寄存器的多功能特性</h3>
        
        <div class="card-section">
          <h4>📌 什么是“可编程指定多种功能”？</h4>
          <p><strong>定义</strong>：通用寄存器虽然叫“通用”，但程序员可以根据需要将其用于不同的用途，包括：</p>
          <ul>
            <li><strong>数据寄存器</strong>：存放操作数、运算结果</li>
            <li><strong>地址寄存器</strong>：存放内存地址（指针）</li>
            <li><strong>计数器</strong>：循环计数（如ECX在x86中常用于LOOP指令）</li>
            <li><strong>栈指针</strong>：管理栈顶（如ESP专用于栈指针）</li>
            <li><strong>基址指针</strong>：访问栈帧中的局部变量（如EBP）</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🔍 x86架构的8个32位通用寄存器</h4>
          <el-table :data="registerData" border stripe style="width: 100%">
            <el-table-column prop="name" label="寄存器" width="100" />
            <el-table-column prop="traditional" label="传统用途" width="150" />
            <el-table-column prop="flexible" label="灵活用途" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>✅ 优点</h4>
          <ul>
            <li><strong>灵活性高</strong>：程序员可以根据需要自由分配寄存器用途</li>
            <li><strong>减少访存</strong>：多用寄存器可以减少对内存的访问，提高速度</li>
            <li><strong>优化空间大</strong>：编译器可以进行寄存器分配优化</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》指令系统章节中：</p>
          <ul>
            <li>✅ 理解通用寄存器的“通用”含义（可以编程指定多种功能）</li>
            <li>✅ 知道某些寄存器有约定用途（如ESP、EBP）</li>
            <li>✅ 了解寄存器数量对性能的影响（RISC通常有更多通用寄存器）</li>
          </ul>
        </div>
      </template>
      
      <!-- IR对程序员透明 -->
      <template v-if="currentCard?.id === 'irTransparency'">
        <h3>💡 知识点卡片：为什么IR对程序员完全透明</h3>
        
        <div class="card-section">
          <h4>📌 什么是“透明”？</h4>
          <p><strong>透明的含义</strong>：在计算机体系结构中，“透明”意味着<strong>看不见、摸不着、无法直接访问</strong>。</p>
          <p>说“IR对程序员透明”，意思是：</p>
          <ul>
            <li>❌ 程序员<strong>不能</strong>通过指令直接读取IR的内容</li>
            <li>❌ 程序员<strong>不能</strong>通过指令直接修改IR的内容</li>
            <li>✅ IR的内容完全由<strong>硬件自动控制</strong></li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🔄 IR的工作流程</h4>
          <div class="flow-diagram vertical">
            <div class="flow-step">取指阶段</div>
            <div class="flow-arrow">↓ 从内存取出指令</div>
            <div class="flow-step highlight">IR（硬件自动加载）</div>
            <div class="flow-arrow">↓ 控制器读取IR</div>
            <div class="flow-step">译码阶段</div>
            <div class="flow-arrow">↓ 执行指令</div>
            <div class="flow-step">IR自动更新</div>
          </div>
        </div>
        
        <div class="card-section">
          <h4>❓ 为什么IR要设计为透明？</h4>
          <ul>
            <li><strong>保证正确性</strong>：如果程序员可以修改IR，可能会破坏指令执行的正常流程</li>
            <li><strong>简化编程</strong>：程序员只需关心程序逻辑，不需要管理底层硬件细节</li>
            <li><strong>提高效率</strong>：硬件自动控制IR，速度快，无需软件干预</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🆚 哪些寄存器是透明的？哪些是可见的？</h4>
          <ul>
            <li><strong>透明的寄存器</strong>：IR、MAR、MDR（程序员无法直接访问）</li>
            <li><strong>可见的寄存器</strong>：通用寄存器（EAX、EBX等）、PC（部分架构可访问）、PSW（可读取标志位）</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》计算机系统概述章节中：</p>
          <ul>
            <li>✅ 理解“透明”的概念（看不见=透明）</li>
            <li>✅ 知道IR、MAR、MDR对程序员透明</li>
            <li>✅ 能够区分透明寄存器和可见寄存器</li>
          </ul>
        </div>
      </template>
      
      <!-- 间址周期 -->
      <template v-if="currentCard?.id === 'indirectCycle'">
        <h3>💡 知识点卡片：间址周期详解</h3>
        
        <div class="card-section">
          <h4>📌 什么是指令周期？</h4>
          <p><strong>指令周期</strong>：CPU从主存中取出一条指令并执行完该指令所需的全部时间。</p>
          <p>指令周期通常包含以下几个子周期：</p>
          <ul>
            <li><strong>取指周期（IF）</strong>：从内存取出指令</li>
            <li><strong>间址周期（IND）</strong>：如果使用间接寻址，需要额外访问内存获取有效地址</li>
            <li><strong>执行周期（EX）</strong>：执行指令的操作</li>
            <li><strong>中断周期（INT）</strong>：如果有中断请求，处理中断</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🔍 什么是间址周期？</h4>
          <p><strong>间址周期</strong>：当指令使用<strong>间接寻址</strong>时，在取指周期之后、执行周期之前，需要额外的一个周期来访问内存获取操作数的<strong>真正地址</strong>。</p>
          
          <div class="flow-diagram vertical">
            <div class="flow-step">取指周期</div>
            <div class="flow-arrow">↓ 取出指令，得到地址ADDR</div>
            <div class="flow-step highlight">间址周期</div>
            <div class="flow-arrow">↓ 访问ADDR，得到真正地址EA</div>
            <div class="flow-step">执行周期</div>
            <div class="flow-arrow">↓ 访问EA，得到操作数</div>
          </div>
        </div>
        
        <div class="card-section">
          <h4>⏱️ 间址周期的特点</h4>
          <ul>
            <li><strong>不是每条指令都有</strong>：只有使用间接寻址的指令才需要间址周期</li>
            <li><strong>增加访存次数</strong>：间接寻址需要<strong>两次访存</strong>（一次取地址，一次取操作数）</li>
            <li><strong>降低执行速度</strong>：相比直接寻址，间接寻址多了一次访存，速度更慢</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📊 不同寻址方式的访存次数对比</h4>
          <el-table :data="memoryAccessData" border stripe style="width: 100%">
            <el-table-column prop="mode" label="寻址方式" width="150" />
            <el-table-column prop="accessCount" label="访存次数" width="120" />
            <el-table-column prop="hasIndirectCycle" label="是否有间址周期" width="150" />
          </el-table>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》指令系统章节中：</p>
          <ul>
            <li>✅ 理解间址周期的定义和作用</li>
            <li>✅ 知道间址周期只在间接寻址时出现</li>
            <li>✅ 能够计算不同寻址方式的总访存次数</li>
            <li>✅ 理解间址周期对性能的影响</li>
          </ul>
        </div>
      </template>
      
      <!-- 汇编语言程序员可见的寄存器 -->
      <template v-if="currentCard?.id === 'visibleRegisters'">
        <h3>💡 知识点卡片：汇编语言程序员可见的寄存器</h3>
        
        <div class="card-section">
          <h4>📌 什么是“可见”？</h4>
          <p><strong>可见的含义</strong>：汇编语言程序员可以通过指令<strong>直接访问</strong>（读取或修改）的寄存器。</p>
        </div>
        
        <div class="card-section">
          <h4>✅ 汇编语言程序员可见的寄存器</h4>
          <ul>
            <li><strong>通用寄存器</strong>：EAX、EBX、ECX、EDX、ESI、EDI、EBP、ESP（x86架构）
              <ul>
                <li>可以直接用指令读写：MOV EAX, 100</li>
              </ul>
            </li>
            <li><strong>程序计数器PC</strong>：
              <ul>
                <li>虽然不能直接读写，但可以通过跳转指令间接修改</li>
                <li>在某些架构（如MIPS）中，PC是可见的</li>
              </ul>
            </li>
            <li><strong>标志寄存器PSW/FLAGS</strong>：
              <ul>
                <li>可以通过条件跳转指令读取标志位（如JE、JZ）</li>
                <li>某些标志位可以通过指令设置（如CLC清除CF）</li>
              </ul>
            </li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>❌ 汇编语言程序员不可见（透明）的寄存器</h4>
          <ul>
            <li><strong>指令寄存器IR</strong>：硬件自动控制，程序员无法访问</li>
            <li><strong>存储器地址寄存器MAR</strong>：硬件自动使用，程序员无法访问</li>
            <li><strong>存储器数据寄存器MDR</strong>：硬件自动使用，程序员无法访问</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📊 总结对比表</h4>
          <el-table :data="visibilityData" border stripe style="width: 100%">
            <el-table-column prop="register" label="寄存器" width="150" />
            <el-table-column prop="visible" label="是否可见" width="100" />
            <el-table-column prop="reason" label="原因" />
          </el-table>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》计算机系统概述章节中：</p>
          <ul>
            <li>✅ 能够区分可见寄存器和透明寄存器</li>
            <li>✅ 知道通用寄存器、PC、PSW是可见的</li>
            <li>✅ 知道IR、MAR、MDR是透明的</li>
            <li>✅ 理解“可见”与“透明”的概念</li>
          </ul>
        </div>
      </template>
      
      <!-- 指令按字边界对齐存放 -->
      <template v-if="currentCard?.id === 'instructionAlignment'">
        <h3>💡 知识点卡片：指令按字边界对齐存放详解</h3>
        
        <div class="card-section">
          <h4>📌 什么是指令对齐？</h4>
          <p><strong>定义</strong>：指令在内存中的起始地址必须是某个固定值（如4字节、8字节）的整数倍。</p>
          <p>例如：字长为4字节（32位），则指令地址必须是4的倍数（0x0000、0x0004、0x0008...）</p>
        </div>
        
        <div class="card-section">
          <h4>✅ 为什么要对齐？</h4>
          <ul>
            <li><strong>提高访存效率</strong>：对齐后一次访存即可读取完整指令
              <ul>
                <li>未对齐：可能需要两次访存（跨边界）</li>
              </ul>
            </li>
            <li><strong>简化硬件设计</strong>：不需要处理跨边界访问的复杂情况</li>
            <li><strong>避免性能损失</strong>：现代处理器对未对齐访问会有性能惩罚</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📊 对齐 vs 不对比示例</h4>
          <pre style="background: #f5f7fa; padding: 12px; border-radius: 4px; overflow-x: auto;">假设字长4字节，指令长度4字节：

✅ 对齐情况：
地址      内容
0x0000    指令1（4字节）→ 一次访存即可读取
0x0004    指令2（4字节）→ 一次访存即可读取
0x0008    指令3（4字节）→ 一次访存即可读取

❌ 不对齐情况：
地址      内容
0x0000    指令1的前2字节
0x0002    指令1的后2字节 + 指令2的前2字节 → 需要两次访存！
0x0004    指令2的后2字节 + ...
→ 效率低！</pre>
        </div>
        
        <div class="card-section">
          <h4>🌍 不同架构的对齐要求</h4>
          <el-table :data="alignmentData" border stripe style="width: 100%">
            <el-table-column prop="arch" label="架构" width="120" />
            <el-table-column prop="requirement" label="对齐要求" width="200" />
            <el-table-column prop="unalignedSupport" label="未对齐支持" />
          </el-table>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》指令系统章节中：</p>
          <ul>
            <li>✅ 理解指令对齐的定义和原因</li>
            <li>✅ 知道对齐可以提高访存效率</li>
            <li>✅ 了解不同架构的对齐要求</li>
            <li>✅ 能够分析对齐与不对齐的性能差异</li>
          </ul>
        </div>
      </template>
      
      <!-- 多周期CPU的特点 -->
      <template v-if="currentCard?.id === 'multiCycleCPU'">
        <h3>💡 知识点卡片：多周期CPU的特点</h3>
        
        <div class="card-section">
          <h4>📌 什么是单周期和多周期CPU？</h4>
          <ul>
            <li><strong>单周期CPU</strong>：每条指令在一个时钟周期内完成
              <ul>
                <li>时钟周期长度 = 最长指令的执行时间</li>
                <li>所有指令都占用相同的时间（即使简单指令也浪费）</li>
              </ul>
            </li>
            <li><strong>多周期CPU</strong>：不同指令可以使用不同数量的时钟周期
              <ul>
                <li>简单指令（如ADD）：1-2个周期</li>
                <li>复杂指令（如MUL、DIV）：多个周期</li>
                <li>时钟周期长度 = 最短阶段的执行时间</li>
              </ul>
            </li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🆚 单周期 vs 多周期对比</h4>
          <el-table :data="cpuComparisonData" border stripe style="width: 100%">
            <el-table-column prop="aspect" label="对比维度" width="150" />
            <el-table-column prop="singleCycle" label="单周期CPU" />
            <el-table-column prop="multiCycle" label="多周期CPU" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>✅ 多周期CPU的优点</h4>
          <ul>
            <li><strong>时钟频率更高</strong>：周期短，频率可以更高</li>
            <li><strong>硬件利用率高</strong>：不同阶段可以复用硬件资源（如ALU）</li>
            <li><strong>适合复杂指令</strong>：CISC架构常用多周期实现</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>❌ 多周期CPU的缺点</h4>
          <ul>
            <li><strong>控制复杂</strong>：需要状态机管理不同指令的执行阶段</li>
            <li><strong>CPI不固定</strong>：不同指令的CPI不同，难以预测性能</li>
            <li><strong>不利于流水线</strong>：多周期CPU通常不使用流水线（或者流水线深度较浅）</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研重点</h4>
          <p>在《计算机组成原理》中央处理器章节中：</p>
          <ul>
            <li>✅ 理解单周期和多周期CPU的区别</li>
            <li>✅ 知道多周期CPU的优缺点</li>
            <li>✅ 能够计算多周期CPU的CPI和性能</li>
            <li>✅ 了解多周期CPU与CISC的关系</li>
          </ul>
        </div>
      </template>
      
      <!-- 第五章知识卡片 -->
      
      <!-- 专用数据通路结构 -->
      <template v-if="currentCard?.id === 'dedicatedDatapath'">
        <h3>💡 知识点卡片：专用数据通路结构</h3>
        
        <div class="card-section">
          <h4>🔍 什么是专用数据通路？</h4>
          <ul>
            <li><strong>定义</strong>：为特定指令或操作专门设计的数据传输路径，而非使用通用总线</li>
            <li><strong>对比</strong>：与单总线、双总线等通用总线结构相对</li>
            <li><strong>应用场景</strong>：高性能处理器、流水线CPU、RISC架构</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>✅ 优点</h4>
          <ul>
            <li><strong>速度快</strong>：直接连接源和目的，无需经过总线仲裁</li>
            <li><strong>并行度高</strong>：多个专用通路可同时工作，提高吞吐量</li>
            <li><strong>延迟低</strong>：减少等待时间，适合流水线设计</li>
            <li><strong>确定性</strong>：数据传输时间可预测，便于时序分析</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>❌ 缺点</h4>
          <ul>
            <li><strong>成本高</strong>：需要更多的连线和逻辑电路，占用芯片面积</li>
            <li><strong>灵活性差</strong>：只能用于特定操作，难以扩展新功能</li>
            <li><strong>设计复杂</strong>：需要仔细规划每条通路的用途</li>
            <li><strong>功耗大</strong>：更多的电路意味着更高的功耗</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📊 专用通路 vs 通用总线对比</h4>
          <el-table :data="dedicatedPathComparison" border stripe style="width: 100%">
            <el-table-column prop="aspect" label="对比项" width="120" />
            <el-table-column prop="dedicated" label="专用数据通路" width="180" />
            <el-table-column prop="general" label="通用总线" width="180" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>🎯 典型应用场景</h4>
          <ol>
            <li><strong>ALU专用通路</strong>：寄存器文件到ALU的直接连接，用于算术运算</li>
            <li><strong>LOAD/STORE通路</strong>：专门的地址计算和数据传输通路</li>
            <li><strong>分支目标通路</strong>：快速计算分支目标地址</li>
            <li><strong>Forwarding通路</strong>：旁路技术中的专用数据转发路径</li>
          </ol>
        </div>
        
        <div class="card-section importance">
          <h4>📝 考研重点</h4>
          <p>在《计算机组成原理》数据通路章节中，专用数据通路是重要考点：</p>
          <ul>
            <li>✅ 理解专用通路与通用总线的权衡（速度vs成本）</li>
            <li>✅ 掌握专用通路在流水线中的应用</li>
            <li>✅ 能够分析给定指令集需要的专用通路数量</li>
            <li>✅ 理解现代处理器如何混合使用专用通路和通用总线</li>
          </ul>
        </div>
      </template>
      
      <!-- ALU与总线的连接方式 -->
      <template v-if="currentCard?.id === 'aluBusConnection'">
        <h3>💡 知识点卡片：ALU与总线的连接方式</h3>
        
        <div class="card-section">
          <h4>🔍 ALU的基本功能</h4>
          <ul>
            <li><strong>ALU（算术逻辑单元）</strong>：执行算术运算和逻辑运算的核心部件</li>
            <li><strong>算术运算</strong>：加法、减法、乘法、除法等</li>
            <li><strong>逻辑运算</strong>：与、或、非、异或、移位等</li>
            <li><strong>比较操作</strong>：大于、小于、等于等</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📊 ALU与总线的三种连接方式</h4>
          
          <h5>(1) 单总线结构</h5>
          <ul>
            <li><strong>连接方式</strong>：ALU的两个输入端都连接到同一条总线上</li>
            <li><strong>工作流程</strong>：
              <ol>
                <li>第一个操作数从寄存器送到总线，暂存到ALU的一个输入寄存器</li>
                <li>第二个操作数从寄存器送到总线，直接进入ALU的另一个输入端</li>
                <li>ALU执行运算，结果送回总线</li>
              </ol>
            </li>
            <li><strong>优点</strong>：结构简单，成本低</li>
            <li><strong>缺点</strong>：需要两个时钟周期才能完成一次运算</li>
          </ul>
          
          <h5>(2) 双总线结构</h5>
          <ul>
            <li><strong>连接方式</strong>：ALU的两个输入端分别连接到两条不同的总线</li>
            <li><strong>工作流程</strong>：
              <ol>
                <li>两个操作数同时从寄存器送到两条总线</li>
                <li>ALU同时接收两个操作数并执行运算</li>
                <li>结果通过第三条总线送回寄存器</li>
              </ol>
            </li>
            <li><strong>优点</strong>：只需一个时钟周期即可完成运算，速度快</li>
            <li><strong>缺点</strong>：需要更多的总线和寄存器，成本较高</li>
          </ul>
          
          <h5>(3) 三总线结构</h5>
          <ul>
            <li><strong>连接方式</strong>：ALU的两个输入端和输出端各有一条专用总线</li>
            <li><strong>工作流程</strong>：
              <ol>
                <li>两个操作数同时通过两条输入总线送到ALU</li>
                <li>ALU执行运算</li>
                <li>结果通过输出总线直接送回寄存器</li>
              </ol>
            </li>
            <li><strong>优点</strong>：速度最快，并行度最高</li>
            <li><strong>缺点</strong>：硬件成本最高，连线复杂</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📊 三种连接方式对比</h4>
          <el-table :data="aluConnectionComparison" border stripe style="width: 100%">
            <el-table-column prop="aspect" label="对比项" width="120" />
            <el-table-column prop="single" label="单总线" width="120" />
            <el-table-column prop="double" label="双总线" width="120" />
            <el-table-column prop="triple" label="三总线" width="120" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>🎯 考研重点</h4>
          <ul>
            <li>✅ 理解三种连接方式的工作原理和时序</li>
            <li>✅ 掌握单总线需要2个周期，双/三总线只需1个周期</li>
            <li>✅ 能够根据性能需求选择合适的连接方式</li>
            <li>✅ 理解总线数量与成本、速度的权衡关系</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>💡 实际应用</h4>
          <p>现代高性能处理器通常采用：</p>
          <ul>
            <li><strong>内部</strong>：多总线结构（类似三总线），提高并行度</li>
            <li><strong>外部</strong>：系统总线可能采用单总线或双总线，降低成本</li>
            <li><strong>RISC架构</strong>：倾向于使用多总线，追求高性能</li>
            <li><strong>CISC架构</strong>：可能使用单总线，注重成本控制</li>
          </ul>
        </div>
      </template>
      
      <!-- 三态门详解 -->
      <template v-if="currentCard?.id === 'tristateGate'">
        <h3>💡 知识点卡片：三态门详解</h3>
        
        <div class="card-section">
          <h4>🔍 什么是三态门？</h4>
          <ul>
            <li><strong>定义</strong>：一种具有三种输出状态的逻辑门电路</li>
            <li><strong>三种状态</strong>：
              <ol>
                <li><strong>高电平（1）</strong>：输出逻辑高电平</li>
                <li><strong>低电平（0）</strong>：输出逻辑低电平</li>
                <li><strong>高阻态（Z）</strong>：输出端与电路断开，相当于开路</li>
              </ol>
            </li>
            <li><strong>别名</strong>：三态缓冲器、三态输出门</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📊 三态门的工作原理</h4>
          <ul>
            <li><strong>控制端（EN）</strong>：使能信号，决定输出状态
              <ul>
                <li>EN = 1：正常工作，输出等于输入</li>
                <li>EN = 0：高阻态，输出与电路断开</li>
              </ul>
            </li>
            <li><strong>数据端（D）</strong>：输入数据</li>
            <li><strong>输出端（Q）</strong>：输出结果（0、1或Z）</li>
          </ul>
          
          <div class="formula-box">
            <strong>真值表：</strong><br>
            EN = 1, D = 0 → Q = 0<br>
            EN = 1, D = 1 → Q = 1<br>
            EN = 0, D = X → Q = Z（高阻态）
          </div>
        </div>
        
        <div class="card-section">
          <h4>✅ 三态门的主要作用</h4>
          <ol>
            <li><strong>总线共享</strong>：多个设备可以连接到同一条总线上，通过控制EN信号实现分时复用</li>
            <li><strong>避免冲突</strong>：当某个设备不使用时，进入高阻态，不会影响其他设备</li>
            <li><strong>双向传输</strong>：配合两个三态门可以实现数据的双向传输</li>
            <li><strong>隔离保护</strong>：高阻态可以隔离不同部分的电路，防止相互干扰</li>
          </ol>
        </div>
        
        <div class="card-section">
          <h4>🎯 在计算机中的应用</h4>
          <ul>
            <li><strong>寄存器输出</strong>：寄存器的输出端使用三态门，控制何时将数据送到总线</li>
            <li><strong>存储器芯片</strong>：多个存储芯片共享数据总线，通过片选信号控制三态门</li>
            <li><strong>I/O接口</strong>：I/O端口的数据传输使用三态门实现双向通信</li>
            <li><strong>总线驱动器</strong>：增强总线驱动能力，同时提供隔离功能</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>📝 考研重点</h4>
          <ul>
            <li>✅ 理解三态门的三种状态及其含义</li>
            <li>✅ 掌握三态门在总线结构中的作用（实现多设备共享）</li>
            <li>✅ 能够分析多个三态门连接到同一总线时的控制逻辑</li>
            <li>✅ 理解高阻态的作用：避免总线冲突，实现分时复用</li>
          </ul>
          
          <p><strong>常见考题</strong>：为什么总线上的设备输出需要使用三态门？</p>
          <p><strong>答案</strong>：因为多个设备共享同一条总线，如果两个设备同时输出不同的电平会导致短路。使用三态门可以让不使用的设备进入高阻态，避免冲突。</p>
        </div>
        
        <div class="card-section">
          <h4>💡 与普通门的区别</h4>
          <el-table :data="gateComparison" border stripe style="width: 100%">
            <el-table-column prop="type" label="门的类型" width="120" />
            <el-table-column prop="states" label="输出状态" width="200" />
            <el-table-column prop="feature" label="特点" />
          </el-table>
        </div>
      </template>
      
      <!-- 时间周期与操作关系 -->
      <template v-if="currentCard?.id === 'timePeriods'">
        <h3>💡 知识点卡片：时间周期与操作关系</h3>
        
        <div class="card-section">
          <h4>🔍 三种时间周期的定义</h4>
          
          <h5>(1) 时钟周期（Clock Cycle）</h5>
          <ul>
            <li><strong>定义</strong>：CPU主频的倒数，是CPU工作的最小时间单位</li>
            <li><strong>计算公式</strong>：时钟周期 = 1 / 主频</li>
            <li><strong>示例</strong>：主频2GHz，时钟周期 = 1/2GHz = 0.5ns</li>
            <li><strong>别名</strong>：T状态、节拍</li>
          </ul>
          
          <h5>(2) 机器周期（Machine Cycle）</h5>
          <ul>
            <li><strong>定义</strong>：CPU访问存储器一次所需要的时间</li>
            <li><strong>组成</strong>：由若干个时钟周期组成</li>
            <li><strong>示例</strong>：取指周期、间址周期、执行周期、中断周期</li>
            <li><strong>别名</strong>：CPU周期、总线周期</li>
          </ul>
          
          <h5>(3) 指令周期（Instruction Cycle）</h5>
          <ul>
            <li><strong>定义</strong>：CPU从内存取出一条指令并执行完这条指令所需的全部时间</li>
            <li><strong>组成</strong>：由若干个机器周期组成</li>
            <li><strong>示例</strong>：一条ADD指令可能需要1-2个机器周期，一条MUL指令可能需要3-5个机器周期</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📊 三者的关系</h4>
          <div class="formula-box">
            <strong>层级关系：</strong><br>
            指令周期 ≥ 机器周期 ≥ 时钟周期<br><br>
            <strong>数量关系：</strong><br>
            1个指令周期 = N个机器周期<br>
            1个机器周期 = M个时钟周期<br><br>
            <strong>举例：</strong><br>
            如果主频 = 1GHz，则：<br>
            时钟周期 = 1ns<br>
            机器周期 = 4ns（假设）<br>
            指令周期 = 8ns（简单指令）或 20ns（复杂指令）
          </div>
        </div>
        
        <div class="card-section">
          <h4>🎯 各周期对应的操作</h4>
          <el-table :data="periodOperations" border stripe style="width: 100%">
            <el-table-column prop="period" label="周期类型" width="120" />
            <el-table-column prop="operations" label="包含的操作" />
            <el-table-column prop="duration" label="典型时长" width="120" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>✅ 考研重点</h4>
          <ul>
            <li>✅ 掌握三种周期的定义和层级关系（必考选择题）</li>
            <li>✅ 能够根据主频计算时钟周期</li>
            <li>✅ 理解指令周期由多个机器周期组成，机器周期由多个时钟周期组成</li>
            <li>✅ 知道不同指令的指令周期长度可能不同</li>
          </ul>
          
          <p><strong>常见考题</strong>：某CPU主频为2GHz，每个机器周期包含4个时钟周期，平均每条指令需要2.5个机器周期，求该CPU的CPI和平均指令执行时间。</p>
          <p><strong>解答</strong>：<br>
          时钟周期 = 1/2GHz = 0.5ns<br>
          机器周期 = 4 × 0.5ns = 2ns<br>
          CPI = 2.5<br>
          平均指令执行时间 = 2.5 × 2ns = 5ns</p>
        </div>
        
        <div class="card-section importance">
          <h4>💡 实际应用意义</h4>
          <ul>
            <li><strong>性能评估</strong>：通过CPI（每条指令周期数）评估CPU性能</li>
            <li><strong>时序设计</strong>：设计控制器时需要确定每个操作的时序</li>
            <li><strong>流水线优化</strong>：将指令周期分解为多个阶段，实现并行执行</li>
            <li><strong>功耗管理</strong>：降低主频可以延长时钟周期，减少功耗</li>
          </ul>
        </div>
      </template>
      
      <!-- 微程序存储器是CPU的一部分 -->
      <template v-if="currentCard?.id === 'microprogramMemory'">
        <h3>💡 知识点卡片：微程序存储器是CPU的一部分</h3>
        
        <div class="card-section">
          <h4>🔍 什么是微程序存储器？</h4>
          <ul>
            <li><strong>定义</strong>：存储微程序的专用存储器，也称为控制存储器（CM, Control Memory）</li>
            <li><strong>位置</strong>：位于CPU内部，属于控制器的一部分</li>
            <li><strong>作用</strong>：存储所有机器指令对应的微程序</li>
            <li><strong>特点</strong>：只读存储器（ROM），速度快，容量小</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📊 微程序存储器的特点</h4>
          <ul>
            <li><strong>速度快</strong>：访问速度与CPU工作速度匹配，通常比主存快得多</li>
            <li><strong>容量小</strong>：只存储微程序，不需要存储用户数据和程序</li>
            <li><strong>只读性</strong>：通常是ROM或PROM，出厂时写入，运行时只读</li>
            <li><strong>固定性</strong>：微程序由CPU设计者预先编写，用户不能修改</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>✅ 为什么微程序存储器是CPU的一部分？</h4>
          <ol>
            <li><strong>物理位置</strong>：集成在CPU芯片内部，与控制器紧密连接</li>
            <li><strong>功能归属</strong>：属于控制器的组成部分，用于实现指令的解释执行</li>
            <li><strong>访问速度</strong>：需要与CPU时钟同步，必须内置才能保证速度</li>
            <li><strong>独立性</strong>：独立于主存储器，不占用内存地址空间</li>
          </ol>
        </div>
        
        <div class="card-section">
          <h4>🎯 微程序存储器 vs 主存储器</h4>
          <el-table :data="memoryComparison" border stripe style="width: 100%">
            <el-table-column prop="aspect" label="对比项" width="120" />
            <el-table-column prop="cm" label="微程序存储器（CM）" width="180" />
            <el-table-column prop="mainMem" label="主存储器" width="180" />
          </el-table>
        </div>
        
        <div class="card-section importance">
          <h4>📝 考研重点</h4>
          <ul>
            <li>✅ 理解微程序存储器的作用和位置（必考选择题）</li>
            <li>✅ 掌握微程序存储器与主存储器的区别</li>
            <li>✅ 知道微程序存储器是ROM，存储的是微程序而非用户程序</li>
            <li>✅ 理解为什么微程序存储器必须是CPU的一部分（速度要求）</li>
          </ul>
          
          <p><strong>常见考题</strong>：微程序存放在哪里？</p>
          <p><strong>答案</strong>：微程序存放在CPU内部的控制存储器（CM）中，CM是CPU控制器的一部分。</p>
        </div>
        
        <div class="card-section">
          <h4>💡 实际应用</h4>
          <ul>
            <li><strong>CISC处理器</strong>：广泛使用微程序技术，如Intel x86系列</li>
            <li><strong>可编程性</strong>：某些处理器支持微码更新（Microcode Update），可以修复bug</li>
            <li><strong>性能优化</strong>：通过优化微程序可以提高指令执行效率</li>
          </ul>
        </div>
      </template>
      
      <!-- 微程序、微指令、微操作、微命令 -->
      <template v-if="currentCard?.id === 'microConcepts'">
        <h3>💡 知识点卡片：微程序、微指令、微操作、微命令</h3>
        
        <div class="card-section">
          <h4>🔍 四个概念的层级关系</h4>
          <div class="formula-box">
            <strong>层级结构（从大到小）：</strong><br>
            微程序 > 微指令 > 微操作 > 微命令<br><br>
            <strong>包含关系：</strong><br>
            1个微程序 = 多条微指令序列<br>
            1条微指令 = 多个微操作（并行）<br>
            1个微操作 = 1个微命令
          </div>
        </div>
        
        <div class="card-section">
          <h4>📊 详细定义</h4>
          
          <h5>(1) 微命令（Micro Command）</h5>
          <ul>
            <li><strong>定义</strong>：控制信号，直接控制硬件部件的动作</li>
            <li><strong>示例</strong>：PC_out（PC输出）、MAR_in（MAR输入）、ALU_add（ALU加法）</li>
            <li><strong>特点</strong>：最基本的控制单元，不可再分</li>
          </ul>
          
          <h5>(2) 微操作（Micro Operation）</h5>
          <ul>
            <li><strong>定义</strong>：由微命令控制的硬件动作</li>
            <li><strong>示例</strong>：PC的内容送到MAR、ALU执行加法运算</li>
            <li><strong>特点</strong>：一个微操作对应一个微命令</li>
          </ul>
          
          <h5>(3) 微指令（Micro Instruction）</h5>
          <ul>
            <li><strong>定义</strong>：一组可以并行执行的微操作的集合</li>
            <li><strong>示例</strong>：{PC_out, MAR_in, Mem_read} 同时执行</li>
            <li><strong>特点</strong>：存储在控制存储器中，一个字长</li>
          </ul>
          
          <h5>(4) 微程序（Micro Program）</h5>
          <ul>
            <li><strong>定义</strong>：实现一条机器指令的微指令序列</li>
            <li><strong>示例</strong>：ADD指令的微程序可能包含5条微指令</li>
            <li><strong>特点</strong>：存放在控制存储器（CM）中</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🎯 实例说明</h4>
          <p><strong>以取指周期为例：</strong></p>
          <ol>
            <li><strong>微程序</strong>：取指微程序（实现取指功能）</li>
            <li><strong>微指令1</strong>：PC → MAR, PC + 1 → PC</li>
            <li><strong>微指令2</strong>：Mem[MAR] → MDR, MDR → IR</li>
            <li><strong>微操作</strong>：PC_out（微命令）→ PC内容送到总线（微操作）</li>
            <li><strong>微命令</strong>：PC_out、MAR_in、Mem_read等具体控制信号</li>
          </ol>
        </div>
        
        <div class="card-section importance">
          <h4>📝 考研重点</h4>
          <ul>
            <li>✅ 掌握四个概念的层级关系和包含关系（必考选择题）</li>
            <li>✅ 理解微指令中可以包含多个并行的微操作</li>
            <li>✅ 知道微程序存储在控制存储器（CM）中</li>
            <li>✅ 能够分析给定机器指令对应的微程序流程</li>
          </ul>
          
          <p><strong>常见考题</strong>：一条机器指令对应多少个微程序？</p>
          <p><strong>答案</strong>：一条机器指令对应一个微程序，该微程序由多条微指令组成。</p>
        </div>
        
        <div class="card-section">
          <h4>💡 类比理解</h4>
          <p>可以用做菜来类比：</p>
          <ul>
            <li><strong>微命令</strong>：打开煤气、点火、放油（具体动作）</li>
            <li><strong>微操作</strong>：点火这个动作本身</li>
            <li><strong>微指令</strong>：同时打开煤气+点火+放油（一组并行操作）</li>
            <li><strong>微程序</strong>：炒菜的完整步骤序列（加热→放菜→翻炒→出锅）</li>
          </ul>
        </div>
      </template>
      
      <!-- CPU控制器的三个组成部分 -->
      <template v-if="currentCard?.id === 'cpuController'">
        <h3>💡 知识点卡片：CPU控制器的三个组成部分</h3>
        
        <div class="card-section">
          <h4>🔍 CPU控制器的组成</h4>
          <p>CPU控制器主要由以下三个部分组成：</p>
          
          <h5>(1) 程序计数器（PC, Program Counter）</h5>
          <ul>
            <li><strong>功能</strong>：存放下一条要执行的指令的地址</li>
            <li><strong>特点</strong>：具有自动递增功能，取指后PC = PC + 1</li>
            <li><strong>作用</strong>：保证指令的顺序执行</li>
          </ul>
          
          <h5>(2) 指令寄存器（IR, Instruction Register）</h5>
          <ul>
            <li><strong>功能</strong>：存放当前正在执行的指令</li>
            <li><strong>特点</strong>：从内存取出指令后存入IR</li>
            <li><strong>作用</strong>：供译码器分析指令的操作码和地址码</li>
          </ul>
          
          <h5>(3) 指令译码器（ID, Instruction Decoder）</h5>
          <ul>
            <li><strong>功能</strong>：对IR中的指令进行译码，产生控制信号</li>
            <li><strong>特点</strong>：识别操作码，确定指令类型</li>
            <li><strong>作用</strong>：生成微命令序列，控制各部件协调工作</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📊 三者的工作流程</h4>
          <ol>
            <li><strong>取指</strong>：根据PC的值从内存取出指令 → 送入IR</li>
            <li><strong>译码</strong>：ID对IR中的指令进行译码 → 产生控制信号</li>
            <li><strong>执行</strong>：根据控制信号执行指令</li>
            <li><strong>更新PC</strong>：PC自动递增，指向下一条指令</li>
          </ol>
        </div>
        
        <div class="card-section importance">
          <h4>📝 考研重点</h4>
          <ul>
            <li>✅ 掌握CPU控制器的三个组成部分及其功能（必考选择题）</li>
            <li>✅ 理解PC、IR、ID在指令执行过程中的作用</li>
            <li>✅ 知道PC具有自动递增功能</li>
            <li>✅ 理解指令译码器产生控制信号的作用</li>
          </ul>
          
          <p><strong>常见考题</strong>：CPU控制器由哪三部分组成？</p>
          <p><strong>答案</strong>：程序计数器（PC）、指令寄存器（IR）、指令译码器（ID）。</p>
        </div>
        
        <div class="card-section">
          <h4>💡 补充说明</h4>
          <p>除了这三个核心部件，控制器还包括：</p>
          <ul>
            <li><strong>时序发生器</strong>：产生时钟信号和节拍信号</li>
            <li><strong>微命令形成部件</strong>：根据译码结果生成微命令序列</li>
            <li><strong>中断机构</strong>：处理中断请求</li>
          </ul>
        </div>
      </template>
      
      <!-- Flynn分类法详解 -->
      <template v-if="currentCard?.id === 'flynnClassification'">
        <h3>💡 知识点卡片：Flynn分类法详解</h3>
        
        <div class="card-section">
          <h4>🔍 什么是Flynn分类法？</h4>
          <ul>
            <li><strong>定义</strong>：根据指令流和数据流的数量对计算机体系结构进行分类的方法</li>
            <li><strong>提出者</strong>：Michael J. Flynn（1966年）</li>
            <li><strong>分类依据</strong>：指令流（Instruction Stream）和数据流（Data Stream）的数量</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📊 四种类型</h4>
          <el-table :data="flynnTypes" border stripe style="width: 100%">
            <el-table-column prop="type" label="类型" width="100" />
            <el-table-column prop="full" label="全称" width="250" />
            <el-table-column prop="description" label="说明" />
            <el-table-column prop="example" label="示例" width="150" />
          </el-table>
        </div>
        
        <div class="card-section importance">
          <h4>📝 考研重点</h4>
          <ul>
            <li>✅ 掌握四种类型的名称和特点（必考选择题）</li>
            <li>✅ 理解SISD是传统串行计算机，SIMD是向量处理器</li>
            <li>✅ 知道MIMD是现代多核处理器的架构</li>
            <li>✅ MISD在实际中很少使用</li>
          </ul>
        </div>
      </template>
      
      <!-- 超线程技术详解 -->
      <template v-if="currentCard?.id === 'hyperThreading'">
        <h3>💡 知识点卡片：超线程技术详解</h3>
        
        <div class="card-section">
          <h4>🔍 什么是超线程？</h4>
          <ul>
            <li><strong>定义</strong>：在一个物理核心上模拟出多个逻辑核心的技术</li>
            <li><strong>目的</strong>：提高CPU的资源利用率和吞吐量</li>
            <li><strong>原理</strong>：当一个线程等待时，切换到另一个线程执行</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>✅ 优点与缺点</h4>
          <ul>
            <li><strong>优点</strong>：提高并行度、改善资源利用率、提升吞吐量（约30%）</li>
            <li><strong>缺点</strong>：增加复杂度、可能降低单线程性能、功耗略增</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>📝 考研重点</h4>
          <ul>
            <li>✅ 理解超线程与多核的区别（超线程是逻辑核心，多核是物理核心）</li>
            <li>✅ 知道Intel是首个实现超线程技术的厂商</li>
            <li>✅ 理解超线程通过时间片轮转提高资源利用率</li>
          </ul>
        </div>
      </template>
      
      <!-- 刷新存储器（DRAM刷新） -->
      <template v-if="currentCard?.id === 'refreshMemory'">
        <h3>💡 知识点卡片：刷新存储器（DRAM刷新）</h3>
        
        <div class="card-section">
          <h4>🔍 为什么需要刷新？</h4>
          <ul>
            <li><strong>原因</strong>：DRAM使用电容存储数据，电容会漏电，数据会逐渐丢失</li>
            <li><strong>刷新周期</strong>：通常2ms-64ms需要刷新一次</li>
            <li><strong>刷新方式</strong>：定期读取并重写数据，恢复电荷</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📊 三种刷新方式</h4>
          <ul>
            <li><strong>集中刷新</strong>：在规定时间内集中刷新所有行，期间不能访问内存</li>
            <li><strong>分散刷新</strong>：将刷新操作分散到每个存取周期中</li>
            <li><strong>异步刷新</strong>：结合前两者，在空闲时刷新，最常用</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>📝 考研重点</h4>
          <ul>
            <li>✅ 理解DRAM需要刷新的原因（电容漏电）</li>
            <li>✅ 掌握三种刷新方式的特点</li>
            <li>✅ 知道SRAM不需要刷新（使用触发器存储）</li>
          </ul>
        </div>
      </template>
      
      <!-- I/O接口的功能 -->
      <template v-if="currentCard?.id === 'ioInterface'">
        <h3>💡 知识点卡片：I/O接口的功能</h3>
        
        <div class="card-section">
          <h4>🔍 I/O接口的主要功能</h4>
          <ol>
            <li><strong>数据缓冲</strong>：解决CPU与I/O设备速度不匹配的问题</li>
            <li><strong>信号转换</strong>：进行电平转换、串并转换等</li>
            <li><strong>设备选择</strong>：通过地址译码选择特定的I/O设备</li>
            <li><strong>命令译码</strong>：接收并解释CPU发出的控制命令</li>
            <li><strong>状态反馈</strong>：向CPU报告设备的工作状态（忙、闲、错误等）</li>
            <li><strong>中断管理</strong>：向CPU发出中断请求</li>
          </ol>
        </div>
        
        <div class="card-section importance">
          <h4>📝 考研重点</h4>
          <ul>
            <li>✅ 掌握I/O接口的六大功能（常考简答题）</li>
            <li>✅ 理解数据缓冲的作用（速度匹配）</li>
            <li>✅ 知道I/O接口是CPU与外设之间的桥梁</li>
          </ul>
        </div>
      </template>
      
      <!-- I/O端口与接口的关系 -->
      <template v-if="currentCard?.id === 'ioPortInterface'">
        <h3>💡 知识点卡片：I/O端口与接口的关系</h3>
        
        <div class="card-section">
          <h4>🔍 基本概念</h4>
          <ul>
            <li><strong>I/O端口</strong>：I/O接口中的寄存器，用于数据传输和控制</li>
            <li><strong>I/O接口</strong>：连接CPU和I/O设备的完整电路，包含多个端口</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📊 端口的类型</h4>
          <ul>
            <li><strong>数据端口</strong>：传输数据（输入/输出）</li>
            <li><strong>状态端口</strong>：读取设备状态</li>
            <li><strong>控制端口</strong>：发送控制命令</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>✅ 关系总结</h4>
          <p><strong>I/O接口 ⊃ I/O端口</strong></p>
          <p>一个I/O接口包含多个I/O端口，端口是接口的组成部分。</p>
        </div>
        
        <div class="card-section importance">
          <h4>📝 考研重点</h4>
          <ul>
            <li>✅ 理解端口和接口的区别与联系</li>
            <li>✅ 掌握三种端口的功能</li>
            <li>✅ 知道端口有独立的地址（端口地址）</li>
          </ul>
        </div>
      </template>
      
      <!-- 第6章：总线系统 -->
      
      <!-- 总线带宽计算 -->
      <template v-if="currentCard?.id === 'busBandwidth'">
        <h3>📊 总线带宽计算详解</h3>
        
        <div class="card-section">
          <h4>🔑 核心公式</h4>
          <div class="formula-box">
            <strong>总线带宽 = 总线宽度 × 总线频率 / 8</strong>
          </div>
          <ul>
            <li><strong>总线宽度</strong>：数据总线的位数（单位：bit）</li>
            <li><strong>总线频率</strong>：总线的工作频率（单位：Hz）</li>
            <li><strong>除以8</strong>：将bit转换为Byte（1 Byte = 8 bit）</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📝 例题详解</h4>
          <p><strong>题目</strong>：某总线宽度为32位，总线频率为100MHz，求总线带宽。</p>
          
          <div class="solution-steps">
            <p><strong>解答步骤：</strong></p>
            <ol>
              <li>代入公式：总线带宽 = 32 bit × 100 MHz / 8</li>
              <li>计算：= 32 × 100 × 10⁶ / 8 Byte/s</li>
              <li>= 400 × 10⁶ Byte/s</li>
              <li>= <strong>400 MB/s</strong></li>
            </ol>
          </div>
        </div>
        
        <div class="card-section">
          <h4>⚠️ 常见单位换算</h4>
          <el-table :data="unitConversions" border stripe style="width: 100%">
            <el-table-column prop="from" label="原始单位" width="150" />
            <el-table-column prop="to" label="目标单位" width="150" />
            <el-table-column prop="conversion" label="换算关系" />
          </el-table>
        </div>
        
        <div class="card-section importance">
          <h4>🎯 考研重点</h4>
          <ul>
            <li>✅ 总线带宽计算公式必考（选择题或计算题）</li>
            <li>✅ 注意单位换算：bit → Byte（除以8）</li>
            <li>✅ 地址总线宽度决定可寻址空间（2^n）</li>
          </ul>
        </div>
      </template>
      
      <!-- 总线仲裁对比 -->
      <template v-if="currentCard?.id === 'busArbitration'">
        <h3>⚖️ 三种总线仲裁方式详细对比</h3>
        
        <div class="card-section">
          <h4>📊 综合对比表</h4>
          <el-table :data="arbitrationComparison" border stripe style="width: 100%">
            <el-table-column prop="item" label="对比项" width="120" />
            <el-table-column prop="chain" label="链式查询" />
            <el-table-column prop="counter" label="计数器定时" />
            <el-table-column prop="independent" label="独立请求" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>🔍 链式查询方式</h4>
          <ul>
            <li><strong>原理</strong>：所有设备串联，BG信号依次传递</li>
            <li><strong>优先级</strong>：固定（离仲裁器近的优先级高）</li>
            <li><strong>优点</strong>：结构简单，控制线少（3根）</li>
            <li><strong>缺点</strong>：可靠性差（单点故障），速度慢</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🔍 计数器定时查询方式</h4>
          <ul>
            <li><strong>原理</strong>：仲裁器内部计数器依次查询设备</li>
            <li><strong>优先级</strong>：可设置（循环或固定）</li>
            <li><strong>优点</strong>：优先级灵活，可靠性较好</li>
            <li><strong>缺点</strong>：控制线较多，速度中等</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🔍 独立请求方式（最常用）</h4>
          <ul>
            <li><strong>原理</strong>：每个设备有独立的BR和BG线</li>
            <li><strong>优先级</strong>：可编程（软件动态调整）</li>
            <li><strong>优点</strong>：速度最快（并行查询），优先级灵活</li>
            <li><strong>缺点</strong>：控制线多（2n根），仲裁器复杂</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>💡 记忆口诀</h4>
          <p><strong>“链式简单但慢，计数灵活中等，独立快速但线多”</strong></p>
        </div>
      </template>
      
      <!-- 总线定时对比 -->
      <template v-if="currentCard?.id === 'busTiming'">
        <h3>⏱️ 同步vs异步总线定时对比</h3>
        
        <div class="card-section">
          <h4>📊 对比表</h4>
          <el-table :data="timingComparison" border stripe style="width: 100%">
            <el-table-column prop="item" label="对比项" width="120" />
            <el-table-column prop="sync" label="同步通信" />
            <el-table-column prop="async" label="异步通信" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>🔄 同步通信</h4>
          <ul>
            <li><strong>特点</strong>：共享时钟信号，固定时序</li>
            <li><strong>优点</strong>：速度快，控制简单</li>
            <li><strong>缺点</strong>：要求所有设备速度一致</li>
            <li><strong>应用</strong>：CPU与内存之间（速度快且稳定）</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🤝 异步通信（握手方式）</h4>
          <ul>
            <li><strong>不互锁</strong>：主设备发完就不等，从设备收到就应答（最快但不安全）</li>
            <li><strong>半互锁</strong>：主设备等待从设备应答，从设备发完就不等（中等）</li>
            <li><strong>全互锁</strong>：双方都等待对方确认（最慢但最安全）</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>💡 记忆口诀</h4>
          <p><strong>“同步靠时钟，异步靠握手”</strong></p>
        </div>
      </template>
      
      <!-- 总线标准对比 -->
      <template v-if="currentCard?.id === 'busStandards'">
        <h3>🔌 常见总线标准对比</h3>
        
        <div class="card-section">
          <h4>📊 总线标准对比表</h4>
          <el-table :data="busStandardsTable" border stripe style="width: 100%">
            <el-table-column prop="standard" label="标准" width="100" />
            <el-table-column prop="year" label="推出年份" width="100" />
            <el-table-column prop="type" label="类型" width="100" />
            <el-table-column prop="bandwidth" label="带宽" />
            <el-table-column prop="application" label="典型应用" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>🔍 PCI总线</h4>
          <ul>
            <li><strong>推出时间</strong>：1993年（Intel）</li>
            <li><strong>类型</strong>：并行总线</li>
            <li><strong>带宽</strong>：32位@33MHz = 133 MB/s</li>
            <li><strong>特点</strong>：即插即用，多主控</li>
            <li><strong>应用</strong>：早期PC扩展卡（声卡、网卡）</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🔍 USB总线</h4>
          <ul>
            <li><strong>USB 2.0</strong>：480 Mbps（60 MB/s）</li>
            <li><strong>USB 3.0</strong>：5 Gbps（625 MB/s）</li>
            <li><strong>USB 3.1</strong>：10 Gbps（1.25 GB/s）</li>
            <li><strong>特点</strong>：热插拔，通用性强</li>
            <li><strong>应用</strong>：键盘、鼠标、U盘、移动硬盘</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🔍 PCIe总线（现代主流）</h4>
          <ul>
            <li><strong>类型</strong>：串行总线（高速）</li>
            <li><strong>PCIe 3.0 x16</strong>：约16 GB/s</li>
            <li><strong>PCIe 4.0 x16</strong>：约32 GB/s</li>
            <li><strong>特点</strong>：点对点连接，可扩展性强</li>
            <li><strong>应用</strong>：显卡、NVMe SSD、高速网卡</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>🎯 发展趋势</h4>
          <p><strong>并行总线 → 串行总线</strong>（PCI → PCIe，PATA → SATA）</p>
          <p>原因：串行总线抗干扰能力强，适合高频传输</p>
        </div>
      </template>
      
      <!-- 第7章：输入输出系统 -->
      
      <!-- I/O编址方式对比 -->
      <template v-if="currentCard?.id === 'ioAddressing'">
        <h3>📍 I/O端口编址方式对比</h3>
        
        <div class="card-section">
          <h4>📊 统一编址 vs 独立编址</h4>
          <el-table :data="addressingComparison" border stripe style="width: 100%">
            <el-table-column prop="item" label="对比项" width="120" />
            <el-table-column prop="unified" label="统一编址" />
            <el-table-column prop="separate" label="独立编址" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>🔍 统一编址（存储器映射I/O）</h4>
          <ul>
            <li><strong>特点</strong>：I/O端口与内存地址统一编址</li>
            <li><strong>指令</strong>：使用相同的访存指令（如MOV）</li>
            <li><strong>优点</strong>：指令丰富，编程方便</li>
            <li><strong>缺点</strong>：占用内存地址空间</li>
            <li><strong>应用</strong>：ARM、MIPS、PowerPC等RISC架构</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🔍 独立编址（I/O映射I/O）</h4>
          <ul>
            <li><strong>特点</strong>：I/O端口有独立的地址空间</li>
            <li><strong>指令</strong>：使用专门的I/O指令（如IN、OUT）</li>
            <li><strong>优点</strong>：不占用内存空间，清晰区分</li>
            <li><strong>缺点</strong>：指令种类少，编程稍复杂</li>
            <li><strong>应用</strong>：x86架构</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>💡 记忆技巧</h4>
          <p><strong>“统一用MOV，独立用IN/OUT”</strong></p>
          <p>x86是独立编址的代表，ARM是统一编址的代表</p>
        </div>
      </template>
      
      <!-- 中断处理流程 -->
      <template v-if="currentCard?.id === 'interruptProcess'">
        <h3>🔔 中断处理完整流程</h3>
        
        <div class="card-section">
          <h4>📋 中断处理四阶段</h4>
          <div class="flow-diagram vertical">
            <div class="flow-step">1. 中断请求</div>
            <div class="flow-arrow">↓</div>
            <div class="flow-step">2. 中断响应</div>
            <div class="flow-arrow">↓</div>
            <div class="flow-step">3. 中断服务</div>
            <div class="flow-arrow">↓</div>
            <div class="flow-step">4. 中断返回</div>
          </div>
        </div>
        
        <div class="card-section">
          <h4>🔍 详细流程</h4>
          <ol>
            <li><strong>中断请求</strong>：I/O设备完成后发出INTR信号</li>
            <li><strong>中断响应</strong>：
              <ul>
                <li>CPU检查IF标志位（是否允许中断）</li>
                <li>保存断点（PC值压栈）</li>
                <li>保存现场（寄存器值压栈）</li>
                <li>关中断</li>
                <li>转入中断服务程序</li>
              </ul>
            </li>
            <li><strong>中断服务</strong>：
              <ul>
                <li>保护现场（保存更多寄存器）</li>
                <li>执行中断服务（如读取数据）</li>
                <li>恢复现场</li>
                <li>开中断</li>
              </ul>
            </li>
            <li><strong>中断返回</strong>：
              <ul>
                <li>IRET指令弹出PC值</li>
                <li>返回被中断的程序继续执行</li>
              </ul>
            </li>
          </ol>
        </div>
        
        <div class="card-section">
          <h4>⚠️ 关键要点</h4>
          <ul>
            <li><strong>关中断</strong>：保护临界区，防止嵌套中断</li>
            <li><strong>中断嵌套</strong>：高优先级中断可以打断低优先级中断</li>
            <li><strong>中断屏蔽</strong>：通过IMR寄存器动态设置优先级</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>🎯 考研重点</h4>
          <p>中断处理流程是必考大题！需要能够画出流程图并解释每个步骤。</p>
        </div>
      </template>
      
      <!-- DMA传送过程 -->
      <template v-if="currentCard?.id === 'dmaProcess'">
        <h3>🚀 DMA传送过程详解</h3>
        
        <div class="card-section">
          <h4>📋 DMA传送三阶段</h4>
          <div class="flow-diagram vertical">
            <div class="flow-step">1. 预处理阶段（CPU初始化）</div>
            <div class="flow-arrow">↓</div>
            <div class="flow-step highlight">2. 数据传送阶段（DMA控制）</div>
            <div class="flow-arrow">↓</div>
            <div class="flow-step">3. 后处理阶段（中断通知CPU）</div>
          </div>
        </div>
        
        <div class="card-section">
          <h4>🔍 详细流程</h4>
          <ol>
            <li><strong>预处理阶段</strong>（CPU参与）：
              <ul>
                <li>设置内存起始地址</li>
                <li>设置传输数据量（字节数或字数）</li>
                <li>设置传输方向（读/写）</li>
                <li>启动DMA控制器</li>
              </ul>
            </li>
            <li><strong>数据传送阶段</strong>（DMA控制）：
              <ul>
                <li>DMA向CPU发出总线请求（HOLD）</li>
                <li>CPU释放总线控制权（HLDA）</li>
                <li>DMA获得总线控制权</li>
                <li>DMA直接控制数据传输（周期窃取）</li>
                <li>每传输一个数据，地址递增，计数器减1</li>
                <li>计数器为0时，传输完成</li>
              </ul>
            </li>
            <li><strong>后处理阶段</strong>（CPU参与）：
              <ul>
                <li>DMA发出中断请求</li>
                <li>CPU响应中断，执行中断服务程序</li>
                <li>检查和处理（如错误处理）</li>
                <li>中断返回，CPU继续执行原程序</li>
              </ul>
            </li>
          </ol>
        </div>
        
        <div class="card-section">
          <h4>⚠️ 关键概念</h4>
          <ul>
            <li><strong>周期窃取（Cycle Stealing）</strong>：DMA每次传输一个数据后释放总线给CPU</li>
            <li><strong>CPU在DMA期间</strong>：不能访问内存，但可以执行内部操作（寄存器运算）</li>
            <li><strong>DMA控制器组成</strong>：地址寄存器、数据计数器、命令寄存器、状态寄存器</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>🎯 考研重点</h4>
          <p>DMA传送过程是必考大题！重点掌握三个阶段和周期窃取的概念。</p>
        </div>
      </template>
      
      <!-- 三种I/O方式对比 -->
      <template v-if="currentCard?.id === 'ioComparison'">
        <h3>⚖️ 三种I/O控制方式全面对比</h3>
        
        <div class="card-section">
          <h4>📊 综合对比表（必背！）</h4>
          <el-table :data="ioComparisonTable" border stripe style="width: 100%">
            <el-table-column prop="item" label="对比项" width="120" />
            <el-table-column prop="polling" label="程序查询" />
            <el-table-column prop="interrupt" label="中断驱动" />
            <el-table-column prop="dma" label="DMA" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>🔍 程序查询方式</h4>
          <ul>
            <li><strong>CPU参与度</strong>：最高（全程轮询等待）</li>
            <li><strong>CPU利用率</strong>：最低 ❌</li>
            <li><strong>硬件复杂度</strong>：最低 ✅</li>
            <li><strong>适用场景</strong>：简单嵌入式系统</li>
            <li><strong>典型设备</strong>：极低速设备</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🔍 中断驱动方式</h4>
          <ul>
            <li><strong>CPU参与度</strong>：中等（每个数据中断一次）</li>
            <li><strong>CPU利用率</strong>：较高 ✅</li>
            <li><strong>硬件复杂度</strong>：中等（需要中断控制器）</li>
            <li><strong>适用场景</strong>：中低速、小批量数据传输</li>
            <li><strong>典型设备</strong>：键盘、鼠标、打印机</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🔍 DMA方式</h4>
          <ul>
            <li><strong>CPU参与度</strong>：最低（只初始化+后处理）</li>
            <li><strong>CPU利用率</strong>：最高 ✅✅✅</li>
            <li><strong>硬件复杂度</strong>：最高 ❌（需要DMA控制器）</li>
            <li><strong>适用场景</strong>：高速、大批量数据传输</li>
            <li><strong>典型设备</strong>：硬盘、网卡、显卡</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>💡 记忆口诀</h4>
          <p><strong>“查询最笨CPU累，中断并行效率高，DMA大批量最快”</strong></p>
          <p><strong>“键鼠用中断，硬网用DMA，简单用查询”</strong></p>
        </div>
      </template>
      
      <!-- 码分复用（CDM）完全指南 -->
      <template v-if="currentCard?.id === 'cdm'">
        <h3>💡 知识点卡片：码分复用（CDM）完全指南</h3>
        
        <div class="card-section">
          <h4>📌 CDM的核心原理</h4>
          <p><strong>核心思想</strong>：每个用户使用不同的<strong>码片序列（Chip Sequence）</strong>，可以在同一时间、同一频率上传输数据</p>
          
          <div class="importance">
            <h5>关键特性：</h5>
            <ul>
              <li>✅ <strong>同时同频传输</strong>：所有用户在同一时间使用相同的频段</li>
              <li>✅ <strong>正交性</strong>：不同用户的码片序列相互正交（内积为0）</li>
              <li>✅ <strong>抗干扰能力强</strong>：即使有其他用户信号，也能正确解码</li>
              <li>✅ <strong>保密性好</strong>：不知道码片序列就无法解码</li>
            </ul>
          </div>
        </div>
        
        <div class="card-section">
          <h4>🔢 实现步骤详解</h4>
          
          <h5>（1）码片序列的要求</h5>
          <p>每个用户被分配一个唯一的<strong>m位码片序列</strong>，必须满足：</p>
          <ol>
            <li><strong>归一化条件</strong>：码片序列与自身的内积 = 1
              <ul><li>S · S = 1</li></ul>
            </li>
            <li><strong>正交条件</strong>：不同用户的码片序列内积 = 0
              <ul><li>S · T = 0（S ≠ T）</li></ul>
            </li>
            <li><strong>反码关系</strong>：码片序列的反码与自身内积 = -1
              <ul><li>S · (-S) = -1</li></ul>
            </li>
          </ol>
          
          <div class="example-box">
            <p><strong>举例</strong>（4位码片序列）：</p>
            <p>用户A的码片序列：S = (+1, +1, +1, -1)</p>
            <p>用户B的码片序列：T = (+1, -1, +1, +1)</p>
            <p><strong>验证正交性</strong>：</p>
            <p>S · T = (+1)(+1) + (+1)(-1) + (+1)(+1) + (-1)(+1) = 1 - 1 + 1 - 1 = 0 ✅</p>
          </div>
          
          <h5>（2）发送过程</h5>
          <p><strong>规则</strong>：</p>
          <ul>
            <li>发送比特 <strong>1</strong> → 发送码片序列 <strong>S</strong></li>
            <li>发送比特 <strong>0</strong> → 发送码片序列的反码 <strong>-S</strong></li>
          </ul>
          
          <h5>（3）接收过程（解码）</h5>
          <p><strong>解码公式</strong>：</p>
          <div class="formula-box">
            <p>接收到的信号 · 目标用户的码片序列 / m = 原始比特</p>
          </div>
          <p>其中：</p>
          <ul>
            <li>m：码片序列的长度</li>
            <li>结果 = +1 → 原始比特为 1</li>
            <li>结果 = -1 → 原始比特为 0</li>
            <li>结果 = 0 → 该用户未发送数据</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🧮 解码示例详解</h4>
          <p>假设两个用户A和B同时发送：</p>
          <ul>
            <li>用户A的码片序列：S = (+1, +1, +1, -1)</li>
            <li>用户B的码片序列：T = (+1, -1, +1, +1)</li>
          </ul>
          
          <p><strong>场景</strong>：A发送1，B发送0</p>
          <p>A发送：S = (+1, +1, +1, -1)</p>
          <p>B发送：-T = (-1, +1, -1, -1)</p>
          
          <p><strong>叠加后的信号</strong>：</p>
          <p>R = S + (-T) = (0, +2, 0, -2)</p>
          
          <p><strong>接收端解码A的数据</strong>：</p>
          <div class="formula-box">
            <p>R · S / m = (0, +2, 0, -2) · (+1, +1, +1, -1) / 4</p>
            <p>= (0×1 + 2×1 + 0×1 + (-2)×(-1)) / 4</p>
            <p>= (0 + 2 + 0 + 2) / 4 = 4/4 = <strong>+1</strong> （A发送的是比特1）✅</p>
          </div>
          
          <p><strong>接收端解码B的数据</strong>：</p>
          <div class="formula-box">
            <p>R · T / m = (0, +2, 0, -2) · (+1, -1, +1, +1) / 4</p>
            <p>= (0×1 + 2×(-1) + 0×1 + (-2)×1) / 4</p>
            <p>= (0 - 2 + 0 - 2) / 4 = -4/4 = <strong>-1</strong> （B发送的是比特0）✅</p>
          </div>
        </div>
        
        <div class="card-section">
          <h4>❓ 为什么CDM能正常工作？</h4>
          <p><strong>数学原理</strong>：利用码片序列的正交性</p>
          <p>当多个用户同时发送时，接收到的信号是所有用户信号的线性叠加：</p>
          <div class="formula-box">
            <p>R = Σ(各用户发送的信号)</p>
          </div>
          <p>解码时，用目标用户的码片序列与接收信号做内积：</p>
          <div class="formula-box">
            <p>R · S = (Σ各用户信号) · S</p>
            <p>= (用户A的信号 · S) + (用户B的信号 · S) + ...</p>
          </div>
          <p>由于正交性：</p>
          <ul>
            <li>用户A的信号 · S = ±m（取决于发送的是1还是0）</li>
            <li>用户B的信号 · S = 0（因为B的码片序列与S正交）</li>
            <li>其他用户的信号 · S = 0</li>
          </ul>
          <p>所以：<strong>R · S / m = ±1</strong>（可以准确恢复A的数据）✅</p>
        </div>
        
        <div class="card-section">
          <h4>📊 CDM vs FDM/TDM 对比</h4>
          <el-table :data="cdmComparisonData" border stripe style="width: 100%">
            <el-table-column prop="item" label="对比项" width="120" />
            <el-table-column prop="fdm" label="FDM" width="100" />
            <el-table-column prop="tdm" label="TDM" width="100" />
            <el-table-column prop="cdm" label="CDM" />
          </el-table>
        </div>
        
        <div class="card-section importance">
          <h4>💡 记忆口诀</h4>
          <p><strong>“码分复用靠正交，同时同频不冲突；内积为1是比特1，内积为负是比特0”</strong></p>
          <ul>
            <li><strong>码分复用靠正交</strong>：核心是利用码片序列的正交性</li>
            <li><strong>同时同频不冲突</strong>：所有用户在同一时间、同一频率传输</li>
            <li><strong>内积为1是比特1</strong>：解码结果为+1表示发送比特1</li>
            <li><strong>内积为负是比特0</strong>：解码结果为-1表示发送比特0</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研要点总结</h4>
          <ol>
            <li>⭐⭐⭐ <strong>码片序列必须满足正交性和归一化条件</strong></li>
            <li>⭐⭐ <strong>发送1发原码，发送0发反码</strong></li>
            <li>⭐⭐⭐ <strong>解码公式：接收信号 · 码片序列 / m</strong></li>
            <li>⭐⭐ <strong>CDM的三大优势</strong>：抗干扰强、保密性好、频谱利用率高</li>
            <li>⭐⭐ <strong>CDM vs FDM/TDM</strong>：CDM是唯一同时同频的复用技术</li>
            <li>⭐ <strong>典型应用</strong>：CDMA移动通信、3G网络</li>
          </ol>
        </div>
      </template>
      
      <!-- 三种交换方式对比 -->
      <template v-if="currentCard?.id === 'switchingMethods'">
        <div class="card-section">
          <h4>📊 三种交换方式详细对比</h4>
          <el-table :data="switchingComparison" border stripe style="width: 100%">
            <el-table-column prop="feature" label="对比项" width="120" />
            <el-table-column prop="circuit" label="电路交换" />
            <el-table-column prop="message" label="报文交换" />
            <el-table-column prop="packet" label="分组交换" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>🔌 电路交换（Circuit Switching）</h4>
          <ul>
            <li><strong>三个阶段</strong>：建立连接 → 通话 → 释放连接</li>
            <li><strong>资源独占</strong>：通信期间始终占用端到端的固定带宽</li>
            <li><strong>优点</strong>：实时性强，时延小，适合语音通话</li>
            <li><strong>缺点</strong>：信道利用率低，建立连接时间长</li>
            <li><strong>典型应用</strong>：传统电话网络（PSTN）</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📨 报文交换（Message Switching）</h4>
          <ul>
            <li><strong>存储转发</strong>：整个报文传输，中间节点完整接收后再转发</li>
            <li><strong>无需建立连接</strong>：动态分配线路</li>
            <li><strong>优点</strong>：线路利用率高，可实现差错控制和流量控制</li>
            <li><strong>缺点</strong>：时延大，需要较大存储空间</li>
            <li><strong>典型应用</strong>：电报系统、电子邮件</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📦 分组交换（Packet Switching）⭐⭐⭐必考</h4>
          <ul>
            <li><strong>统计复用</strong>：将报文划分为多个分组，每个分组独立传输</li>
            <li><strong>两种服务</strong>：
              <ul>
                <li><strong>数据报（Datagram）</strong>：无连接，每个分组独立选路（如IP）</li>
                <li><strong>虚电路（Virtual Circuit）</strong>：面向连接，建立逻辑连接（如ATM）</li>
              </ul>
            </li>
            <li><strong>优点</strong>：高效、灵活、迅速、可靠</li>
            <li><strong>缺点</strong>：存在时延，需要额外开销（首部信息）</li>
            <li><strong>典型应用</strong>：互联网（Internet）✅</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>💡 记忆口诀</h4>
          <p><strong>“电路独占实时好，报文存储时延大，分组统计最灵活”</strong></p>
          <ul>
            <li><strong>电路交换</strong> = 专线电话（独占资源）</li>
            <li><strong>报文交换</strong> = 邮局寄信（整封信存储转发）</li>
            <li><strong>分组交换</strong> = 快递分包（大包拆成小包分别运输）</li>
          </ul>
        </div>
      </template>
      
      <!-- 四种时延详解 -->
      <template v-if="currentCard?.id === 'networkDelay'">
        <div class="card-section">
          <h4>⏱️ 总时延组成公式</h4>
          <div class="formula-box">
            <p><strong>总时延 = 发送时延 + 传播时延 + 处理时延 + 排队时延</strong></p>
          </div>
        </div>
        
        <div class="card-section">
          <h4>1️⃣ 发送时延（Transmission Delay）⭐⭐⭐</h4>
          <div class="formula-box">
            <p><strong>发送时延 = 数据长度 / 发送速率</strong></p>
            <p>t_trans = L / R</p>
          </div>
          <ul>
            <li><strong>L</strong>：数据帧的长度（bit）</li>
            <li><strong>R</strong>：信道带宽/发送速率（bit/s）</li>
            <li><strong>特点</strong>：与数据长度成正比，与发送速率成反比</li>
            <li><strong>例子</strong>：1000 bit的数据，以1 Mbps速率发送，发送时延 = 1000/10⁶ = 1 ms</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>2️⃣ 传播时延（Propagation Delay）⭐⭐⭐</h4>
          <div class="formula-box">
            <p><strong>传播时延 = 信道长度 / 传播速率</strong></p>
            <p>t_prop = d / v</p>
          </div>
          <ul>
            <li><strong>d</strong>：信道长度（距离，m）</li>
            <li><strong>v</strong>：电磁波在介质中的传播速率（≈2×10⁸ m/s，光速的2/3）</li>
            <li><strong>特点</strong>：与距离成正比，与发送速率<strong>无关</strong></li>
            <li><strong>例子</strong>：1000 km的光纤，传播时延 = 10⁶ / (2×10⁸) = 5 ms</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>3️⃣ 处理时延（Processing Delay）</h4>
          <ul>
            <li>主机或路由器处理分组的时间</li>
            <li>包括：检查首部、决定路由、差错检测等</li>
            <li><strong>特点</strong>：通常很小，可忽略不计</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>4️⃣ 排队时延（Queuing Delay）</h4>
          <ul>
            <li>分组在路由器输入/输出队列中等待的时间</li>
            <li><strong>特点</strong>：不确定，取决于网络拥塞程度</li>
            <li>网络拥塞时，排队时延可能很大</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>💡 关键区别</h4>
          <ul>
            <li><strong>发送时延</strong>：取决于<strong>数据长度</strong>和<strong>发送速率</strong></li>
            <li><strong>传播时延</strong>：取决于<strong>距离</strong>和<strong>传播速度</strong>，与发送速率<strong>无关</strong></li>
            <li><strong>易错点</strong>：提高发送速率只能减少发送时延，不能减少传播时延！</li>
          </ul>
        </div>
      </template>
      
      <!-- OSI vs TCP/IP模型对比 -->
      <template v-if="currentCard?.id === 'osiVsTcpIp'">
        <div class="card-section">
          <h4>📊 OSI七层模型 vs TCP/IP四层模型</h4>
          <el-table :data="osiVsTcpIpTable" border stripe style="width: 100%">
            <el-table-column prop="layer" label="OSI七层模型" width="150" />
            <el-table-column prop="tcpip" label="TCP/IP四层模型" width="150" />
            <el-table-column prop="protocol" label="典型协议" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>🏛️ OSI七层模型（理论模型）</h4>
          <ul>
            <li><strong>7层结构</strong>：物理层 → 数据链路层 → 网络层 → 传输层 → 会话层 → 表示层 → 应用层</li>
            <li><strong>特点</strong>：
              <ul>
                <li>✅ 概念清晰，通用性强</li>
                <li>✅ 严格区分服务、接口和协议</li>
                <li>❌ 过于复杂，实现困难</li>
                <li>❌ 市场失败，主要用于教学</li>
              </ul>
            </li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🌐 TCP/IP四层模型（实际标准）⭐⭐⭐</h4>
          <ul>
            <li><strong>4层结构</strong>：网络接口层 → 网际层 → 传输层 → 应用层</li>
            <li><strong>特点</strong>：
              <ul>
                <li>✅ 简单实用，易于实现</li>
                <li>✅ 市场成功，互联网事实标准</li>
                <li>✅ 包容性强，支持多种底层技术</li>
                <li>❌ 层次划分不够清晰</li>
              </ul>
            </li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>💡 记忆技巧</h4>
          <p><strong>“OSI七层太复杂，TCP/IP四层最实用，五层折中好教学”</strong></p>
          <ul>
            <li>OSI = 理论完美但市场失败</li>
            <li>TCP/IP = 实践先行且市场成功 ✅</li>
            <li>五层模型 = 教学常用（去掉会话层和表示层）</li>
          </ul>
        </div>
      </template>
      
      <!-- 奈奎斯特定理 vs 香农定理 -->
      <template v-if="currentCard?.id === 'nyquistShannon'">
        <div class="card-section">
          <h4>📊 两个定理对比</h4>
          <el-table :data="nyquistVsShannon" border stripe style="width: 100%">
            <el-table-column prop="item" label="对比项" width="120" />
            <el-table-column prop="nyquist" label="奈奎斯特定理" />
            <el-table-column prop="shannon" label="香农定理" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>📐 奈奎斯特定理（Nyquist Theorem）⭐⭐</h4>
          <div class="formula-box">
            <p><strong>理想低通信道的最高码元传输速率 = 2W Baud</strong></p>
            <p><strong>极限数据传输率 = 2W × log₂V (bit/s)</strong></p>
          </div>
          <ul>
            <li><strong>W</strong>：信道带宽（Hz）</li>
            <li><strong>V</strong>：码元离散电平个数（一个码元可以携带log₂V比特信息）</li>
            <li><strong>前提条件</strong>：理想低通信道，<strong>无噪声</strong></li>
            <li><strong>限制因素</strong>：码间串扰</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📈 香农定理（Shannon Theorem）⭐⭐⭐必考</h4>
          <div class="formula-box">
            <p><strong>极限数据传输率 = W × log₂(1 + S/N) (bit/s)</strong></p>
          </div>
          <ul>
            <li><strong>W</strong>：信道带宽（Hz）</li>
            <li><strong>S/N</strong>：信噪比（功率比，不是dB）</li>
            <li><strong>信噪比(dB) = 10 × log₁₀(S/N)</strong></li>
            <li><strong>前提条件</strong>：带宽受限且有高斯白噪声干扰的信道</li>
            <li><strong>意义</strong>：给出了有噪声信道的理论上限</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>💡 关键区别</h4>
          <ul>
            <li><strong>奈奎斯特</strong>：无噪声，限制因素是码间串扰</li>
            <li><strong>香农</strong>：有噪声，限制因素是信噪比</li>
            <li><strong>实际应用</strong>：两者都需考虑，取较小值作为实际上限</li>
          </ul>
        </div>
      </template>
      
      <!-- 编码与调制方式 -->
      <template v-if="currentCard?.id === 'encodingModulation'">
        <div class="card-section">
          <h4>📊 数字编码方式对比</h4>
          <el-table :data="encodingComparison" border stripe style="width: 100%">
            <el-table-column prop="name" label="编码方式" width="150" />
            <el-table-column prop="description" label="特点" />
            <el-table-column prop="pros" label="优点" width="120" />
            <el-table-column prop="cons" label="缺点" width="120" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>🔢 常见数字编码</h4>
          <ul>
            <li><strong>NRZ（非归零码）</strong>：高电平=1，低电平=0，简单但存在直流分量</li>
            <li><strong>RZ（归零码）</strong>：每个比特中间归零，可自同步但带宽需求大</li>
            <li><strong>曼彻斯特编码</strong>：比特中间跳变，既表示数据又提供时钟信号 ✅</li>
            <li><strong>差分曼彻斯特编码</strong>：比特开始处是否有跳变表示0或1</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📡 模拟调制方法</h4>
          <ul>
            <li><strong>ASK（幅移键控）</strong>：用不同振幅表示0和1，抗干扰能力差</li>
            <li><strong>FSK（频移键控）</strong>：用不同频率表示0和1，抗干扰能力强</li>
            <li><strong>PSK（相移键控）</strong>：用不同相位表示数据，频谱效率高</li>
            <li><strong>DPSK（差分相移键控）</strong>：用相位变化表示数据，无需参考相位</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>💡 记忆技巧</h4>
          <p><strong>“曼彻斯特最常用，中间跳变带时钟；ASK看幅度，FSK看频率，PSK看相位”</strong></p>
        </div>
      </template>
      
      <!-- 检错编码详解 -->
      <template v-if="currentCard?.id === 'errorDetection'">
        <div class="card-section">
          <h4>📊 检错编码对比</h4>
          <el-table :data="errorDetectionComparison" border stripe style="width: 100%">
            <el-table-column prop="method" label="方法" width="120" />
            <el-table-column prop="principle" label="原理" />
            <el-table-column prop="capability" label="检错能力" />
            <el-table-column prop="canCorrect" label="能否纠错" width="100" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>1️⃣ 奇偶校验码</h4>
          <ul>
            <li><strong>原理</strong>：添加一个校验位，使整个码字中1的个数为奇数（奇校验）或偶数（偶校验）</li>
            <li><strong>检错能力</strong>：只能检测奇数个比特错误</li>
            <li><strong>缺点</strong>：不能检测偶数个比特错误，不能纠错</li>
            <li><strong>应用</strong>：简单场景，如内存校验</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>2️⃣ CRC循环冗余校验 ⭐⭐⭐必考</h4>
          <div class="formula-box">
            <p><strong>CRC计算步骤</strong>：</p>
            <ol>
              <li>选择生成多项式G(x)</li>
              <li>在数据后面添加r个0（r为G(x)的最高次幂）</li>
              <li>用模2除法除以G(x)，得到余数R</li>
              <li>将R附加到数据后面，形成CRC码</li>
            </ol>
          </div>
          <ul>
            <li><strong>模2除法</strong>：不借位的除法，实际上是异或（XOR）运算</li>
            <li><strong>检错能力</strong>：可以检测所有单个、双个、奇数个比特错误，以及长度≤r的突发错误</li>
            <li><strong>优点</strong>：检错能力强，实现简单（硬件实现）</li>
            <li><strong>缺点</strong>：不能纠错</li>
            <li><strong>应用</strong>：以太网、WiFi、存储系统 ✅</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>💡 考研要点</h4>
          <ul>
            <li>⭐⭐⭐ <strong>CRC计算是必考点</strong>：掌握模2除法和余数计算</li>
            <li>⭐⭐ <strong>奇偶校验特点</strong>：只能检奇数个错误</li>
            <li>⭐⭐ <strong>CRC vs 奇偶校验</strong>：CRC检错能力更强</li>
          </ul>
        </div>
      </template>
      
      <!-- 纠错编码与海明码 -->
      <template v-if="currentCard?.id === 'errorCorrection'">
        <div class="card-section">
          <h4>🎯 码距（海明距离）核心概念 ⭐⭐⭐</h4>
          <div class="formula-box">
            <p><strong>码距 = 两个等长码字之间不同比特的个数</strong></p>
          </div>
          <ul>
            <li><strong>计算方法</strong>：对两个码字进行异或运算，结果中1的个数就是码距</li>
            <li><strong>例子</strong>：码字A=10110，码字B=10011 → 异或=00101 → 码距=2</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>📐 码距与检错/纠错能力的关系 ⭐⭐⭐必考公式</h4>
          <el-table :data="codeDistanceFormula" border stripe style="width: 100%">
            <el-table-column prop="goal" label="目标" width="180" />
            <el-table-column prop="formula" label="所需最小码距" />
            <el-table-column prop="example" label="例子" />
          </el-table>
        </div>
        
        <div class="card-section importance">
          <h4>💡 记忆口诀</h4>
          <p><strong>“检一加一，纠二加一”</strong></p>
          <ul>
            <li><strong>检错</strong>：码距 = 错误数 + 1</li>
            <li><strong>纠错</strong>：码距 = 2 × 错误数 + 1</li>
          </ul>
          <p><strong>推导理解</strong>：</p>
          <ul>
            <li>检测1个错误：需要码距≥2（1个错误后不会变成另一个合法码字）</li>
            <li>纠正1个错误：需要码距≥3（要能区分是哪个码字出错了）</li>
            <li>纠正2个错误：需要码距≥5（2×2+1=5）</li>
            <li>纠正3个错误：需要码距≥7（2×3+1=7）</li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>🧠 形象理解：投票机制</h4>
          <ul>
            <li><strong>检测错误</strong> = 只要有分歧就知道出错了（码距小）</li>
            <li><strong>纠正错误</strong> = 需要多数票才能确定正确答案（码距大）
              <ul>
                <li>纠正1个错误：3个人投票，2:1就能确定（码距3）</li>
                <li>纠正2个错误：5个人投票，3:2就能确定（码距5）</li>
                <li>纠正3个错误：7个人投票，4:3就能确定（码距7）</li>
              </ul>
            </li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>🎓 考研要点总结</h4>
          <ol>
            <li>⭐⭐⭐ <strong>码距定义和计算方法</strong></li>
            <li>⭐⭐⭐ <strong>检错纠错公式（必考）</strong></li>
            <li>⭐⭐ <strong>海明码的校验位数计算</strong></li>
            <li>⭐⭐ <strong>常见编码的码距</strong>：奇偶校验(d=2)、海明码(d=3)</li>
          </ol>
        </div>
      </template>
      
      <!-- IP地址分类、NAT与子网划分 -->
      <template v-if="currentCard?.id === 'ipAddressing'">
        <div class="card-section">
          <h4>📊 IP地址分类</h4>
          <el-table :data="ipClassTable" border stripe style="width: 100%">
            <el-table-column prop="class" label="类别" width="80" />
            <el-table-column prop="range" label="地址范围" />
            <el-table-column prop="networkBits" label="网络号" width="100" />
            <el-table-column prop="hostBits" label="主机号" width="100" />
            <el-table-column prop="usage" label="适用场景" />
          </el-table>
        </div>
        
        <div class="card-section">
          <h4>🔄 NAT技术（网络地址转换）⭐⭐⭐必考</h4>
          <ul>
            <li><strong>作用</strong>：
              <ul>
                <li>解决IPv4地址不足问题</li>
                <li>隐藏内部网络结构，提高安全性</li>
              </ul>
            </li>
            <li><strong>工作原理</strong>：
              <ul>
                <li>内网使用私有地址（10.x.x.x、172.16-31.x.x、192.168.x.x）</li>
                <li>NAT路由器维护地址转换表</li>
                <li>出站时替换源IP，入站时替换目的IP</li>
              </ul>
            </li>
            <li><strong>类型</strong>：
              <ul>
                <li><strong>静态NAT</strong>：一对一映射</li>
                <li><strong>动态NAT</strong>：多对多映射</li>
                <li><strong>NAPT</strong>：多对一映射（最常用）✅</li>
              </ul>
            </li>
          </ul>
        </div>
        
        <div class="card-section">
          <h4>✂️ 子网划分 ⭐⭐⭐必考</h4>
          <ul>
            <li><strong>原理</strong>：从主机号借用若干位作为子网号</li>
            <li><strong>子网掩码</strong>：网络号和子网号对应位为1，主机号对应位为0</li>
            <li><strong>计算公式</strong>：
              <ul>
                <li>子网数 = 2^n（n为借用的子网位数）</li>
                <li>每个子网的主机数 = 2^m - 2（m为主机位数，减2是因为全0和全1不可用）</li>
              </ul>
            </li>
          </ul>
          
          <div class="example-box">
            <p><strong>例题</strong>：某公司申请到一个C类IP地址，但要连接6个子公司，最大的一个子公司有26台计算机，每个子公司在一个网段中，则子网掩码应设为多少？</p>
            <p><strong>解</strong>：</p>
            <p>最大子公司26台主机，需要至少5位主机位（2^5-2=30≥26）</p>
            <p>C类地址默认24位网络位，借用3位作为子网位（2^3=8≥6个子网）</p>
            <p>所以子网掩码为24+3=27位，即<strong>255.255.255.224</strong></p>
          </div>
        </div>
        
        <div class="card-section">
          <h4>🌐 CIDR（无分类编址）⭐⭐⭐</h4>
          <ul>
            <li><strong>作用</strong>：消除传统的A、B、C类划分</li>
            <li><strong>表示方法</strong>：斜线记法，如192.168.1.0/24</li>
            <li><strong>优点</strong>：支持路由聚合，减小路由表规模</li>
            <li><strong>应用</strong>：现代互联网的核心技术 ✅</li>
          </ul>
        </div>
        
        <div class="card-section importance">
          <h4>💡 记忆技巧</h4>
          <ul>
            <li><strong>A类</strong>：大型网络（政府、大公司）</li>
            <li><strong>B类</strong>：中型网络（大学、中型企业）</li>
            <li><strong>C类</strong>：小型网络（小型企业、家庭）</li>
            <li><strong>NAT</strong> = “翻译官”，把内网地址翻译成公网地址</li>
            <li><strong>子网划分</strong> = “分房间”，从主机号借位划分子网</li>
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
  tlbVsPageTable: {
    id: 'tlbVsPageTable',
    title: '💡 知识点卡片：快表(TLB)与慢表(页表)对比'
  },
  segmentedVirtualMemory: {
    id: 'segmentedVirtualMemory',
    title: '💡 知识点卡片：段式虚拟存储器详解'
  },
  interleavedMemory: {
    id: 'interleavedMemory',
    title: '💡 知识点卡片：多体交叉存储器详解'
  },
  extendedOpcode: {
    id: 'extendedOpcode',
    title: '💡 知识点卡片：扩展操作码技术'
  },
  // 第五章知识卡片
  dedicatedDatapath: {
    id: 'dedicatedDatapath',
    title: '💡 知识点卡片：专用数据通路结构'
  },
  aluBusConnection: {
    id: 'aluBusConnection',
    title: '💡 知识点卡片：ALU与总线的连接方式'
  },
  tristateGate: {
    id: 'tristateGate',
    title: '💡 知识点卡片：三态门详解'
  },
  timePeriods: {
    id: 'timePeriods',
    title: '💡 知识点卡片：时间周期与操作关系'
  },
  microprogramMemory: {
    id: 'microprogramMemory',
    title: '💡 知识点卡片：微程序存储器是CPU的一部分'
  },
  microConcepts: {
    id: 'microConcepts',
    title: '💡 知识点卡片：微程序、微指令、微操作、微命令'
  },
  cpuController: {
    id: 'cpuController',
    title: '💡 知识点卡片：CPU控制器的三个组成部分'
  },
  flynnClassification: {
    id: 'flynnClassification',
    title: '💡 知识点卡片：Flynn分类法详解'
  },
  hyperThreading: {
    id: 'hyperThreading',
    title: '💡 知识点卡片：超线程技术详解'
  },
  refreshMemory: {
    id: 'refreshMemory',
    title: '💡 知识点卡片：刷新存储器（DRAM刷新）'
  },
  ioInterface: {
    id: 'ioInterface',
    title: '💡 知识点卡片：I/O接口的功能'
  },
  ioPortInterface: {
    id: 'ioPortInterface',
    title: '💡 知识点卡片：I/O端口与接口的关系'
  },
  addressingModes: {
    id: 'addressingModes',
    title: '💡 知识点卡片：8种数据寻址方式完全指南'
  },
  ciscVsRisc: {
    id: 'ciscVsRisc',
    title: '💡 知识点卡片：CISC与RISC全面对比'
  },
  raid: {
    id: 'raid',
    title: '💡 知识点卡片：RAID技术详解'
  },
  flagsRegister: {
    id: 'flagsRegister',
    title: '💡 知识点卡片：标志寄存器详解'
  },
  generalPurposeRegisters: {
    id: 'generalPurposeRegisters',
    title: '💡 知识点卡片：通用寄存器的多功能特性'
  },
  irTransparency: {
    id: 'irTransparency',
    title: '💡 知识点卡片：为什么IR对程序员完全透明'
  },
  indirectCycle: {
    id: 'indirectCycle',
    title: '💡 知识点卡片：间址周期详解'
  },
  visibleRegisters: {
    id: 'visibleRegisters',
    title: '💡 知识点卡片：汇编语言程序员可见的寄存器'
  },
  instructionAlignment: {
    id: 'instructionAlignment',
    title: '💡 知识点卡片：指令按字边界对齐存放详解'
  },
  multiCycleCPU: {
    id: 'multiCycleCPU',
    title: '💡 知识点卡片：多周期CPU的特点'
  },
  cdm: {
    id: 'cdm',
    title: '💡 知识点卡片：码分复用（CDM）完全指南'
  },
  // 计算机网络知识卡片
  switchingMethods: {
    id: 'switchingMethods',
    title: '💡 知识点卡片：三种交换方式对比'
  },
  networkDelay: {
    id: 'networkDelay',
    title: '💡 知识点卡片：四种时延详解'
  },
  osiVsTcpIp: {
    id: 'osiVsTcpIp',
    title: '💡 知识点卡片：OSI vs TCP/IP模型对比'
  },
  nyquistShannon: {
    id: 'nyquistShannon',
    title: '💡 知识点卡片：奈奎斯特定理 vs 香农定理'
  },
  encodingModulation: {
    id: 'encodingModulation',
    title: '💡 知识点卡片：编码与调制方式'
  },
  errorDetection: {
    id: 'errorDetection',
    title: '💡 知识点卡片：检错编码详解'
  },
  errorCorrection: {
    id: 'errorCorrection',
    title: '💡 知识点卡片：纠错编码与海明码'
  },
  ipAddressing: {
    id: 'ipAddressing',
    title: '💡 知识点卡片：IP地址分类、NAT与子网划分'
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

const dedicatedPathComparison = [
  { aspect: '速度', dedicated: '快（直接连接）', general: '慢（需仲裁）' },
  { aspect: '并行度', dedicated: '高（多路同时）', general: '低（分时复用）' },
  { aspect: '成本', dedicated: '高（更多连线）', general: '低（共享资源）' },
  { aspect: '灵活性', dedicated: '差（固定用途）', general: '好（通用性强）' },
  { aspect: '设计难度', dedicated: '复杂（需规划）', general: '简单（标准化）' },
  { aspect: '适用场景', dedicated: '高性能CPU', general: '一般系统' }
]

const aluConnectionComparison = [
  { aspect: '总线数量', single: '1条', double: '2条', triple: '3条' },
  { aspect: '运算周期', single: '2个周期', double: '1个周期', triple: '1个周期' },
  { aspect: '硬件成本', single: '最低', double: '中等', triple: '最高' },
  { aspect: '速度', single: '最慢', double: '较快', triple: '最快' },
  { aspect: '复杂度', single: '最简单', double: '中等', triple: '最复杂' },
  { aspect: '应用场景', single: '低成本系统', double: '一般系统', triple: '高性能系统' }
]

const gateComparison = [
  { type: '普通门', states: '两种（0和1）', feature: '只能输出高电平或低电平' },
  { type: '三态门', states: '三种（0、1和Z）', feature: '可以增加高阻态，实现总线共享' },
  { type: '集电极开路门', states: '两种（0和1）', feature: '可以实现线与逻辑，需要上拉电阻' }
]

const periodOperations = [
  { period: '时钟周期', operations: 'CPU内部最基本操作（如寄存器传输、ALU运算）', duration: '0.5-1ns' },
  { period: '机器周期', operations: '取指、间址、执行、中断等完整步骤', duration: '2-4ns' },
  { period: '指令周期', operations: '完整执行一条指令的所有步骤', duration: '4-20ns' }
]

const memoryComparison = [
  { aspect: '位置', cm: 'CPU内部（控制器）', mainMem: 'CPU外部（主板上）' },
  { aspect: '速度', cm: '非常快（与CPU同步）', mainMem: '较慢（需要等待）' },
  { aspect: '容量', cm: '很小（几KB）', mainMem: '很大（几GB）' },
  { aspect: '类型', cm: 'ROM（只读）', mainMem: 'RAM（可读可写）' },
  { aspect: '内容', cm: '微程序', mainMem: '用户程序和数据' },
  { aspect: '可见性', cm: '对用户透明', mainMem: '用户可直接访问' }
]

const flynnTypes = [
  { type: 'SISD', full: 'Single Instruction Single Data', description: '单指令流单数据流，传统串行计算机', example: '普通PC' },
  { type: 'SIMD', full: 'Single Instruction Multiple Data', description: '单指令流多数据流，向量处理器', example: 'GPU、向量机' },
  { type: 'MISD', full: 'Multiple Instruction Single Data', description: '多指令流单数据流，实际很少使用', example: '容错系统' },
  { type: 'MIMD', full: 'Multiple Instruction Multiple Data', description: '多指令流多数据流，现代多核处理器', example: '多核CPU、集群' }
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

// TLB vs 页表对比数据
const tlbComparisonData = [
  { feature: '存储位置', tlb: 'CPU内部（寄存器或SRAM）', pageTable: '主存中' },
  { feature: '容量', tlb: '很小（16-512个条目）', pageTable: '很大（所有页面映射）' },
  { feature: '速度', tlb: '极快（1个时钟周期）', pageTable: '较慢（几十ns）' },
  { feature: '实现方式', tlb: '相联存储器（按内容查找）', pageTable: '数组结构（按索引查找）' },
  { feature: '管理方式', tlb: '硬件自动管理', pageTable: '操作系统管理' },
  { feature: '缺失处理', tlb: 'TLB缺失 → 查页表', pageTable: '页表缺失 → 缺页中断' },
  { feature: '成本', tlb: '昂贵（集成在CPU中）', pageTable: '便宜（占用主存空间）' }
]

// 分段透明性数据
const segmentTransparencyData = [
  { role: '低级语言程序员', transparent: '✅ 透明', explanation: '汇编程序员直接使用段寄存器和偏移地址，无需关心段的物理位置' },
  { role: '编译器', transparent: '✅ 透明', explanation: '编译器生成目标代码时自动处理段划分，程序员只需声明变量和函数' },
  { role: '应用程序员', transparent: '✅ 透明', explanation: '高级语言程序员完全看不到分段机制，像使用连续内存一样编程' },
  { role: '系统程序员', transparent: '❌ 不透明', explanation: '操作系统需要管理段表、处理段保护、实现段的装入和换出' }
]

// 段式 vs 页式对比数据
const segmentVsPageData = [
  { feature: '划分依据', segmented: '逻辑模块（代码、数据、栈）', paged: '固定大小页面' },
  { feature: '段/页大小', segmented: '可变长度', paged: '固定长度' },
  { feature: '碎片问题', segmented: '外部碎片', paged: '内部碎片' },
  { feature: '信息共享', segmented: '方便（以段为单位）', paged: '较复杂' },
  { feature: '地址转换', segmented: '段号→基址+偏移', paged: '页号→页框号+偏移' },
  { feature: '访存次数', segmented: '2次（段表+数据）', paged: '2次（页表+数据）' }
]

// 低位交叉 vs 高位交对比数据
const interleavedComparisonData = [
  { feature: '地址分配', lowInterleave: '连续地址在不同模块', highInterleave: '连续地址在同一模块' },
  { feature: '并行性', lowInterleave: '✅ 高（可同时访问）', highInterleave: '❌ 低（串行访问）' },
  { feature: '带宽', lowInterleave: '✅ 提高m倍', highInterleave: '❌ 无提升' },
  { feature: '应用场景', lowInterleave: '现代计算机主流', highInterleave: '早期计算机' },
  { feature: '适用访问模式', lowInterleave: '顺序访问、突发传输', highInterleave: '随机访问' }
]

// 8种寻址方式对比数据
const addressingModesData = [
  { mode: '立即寻址', ea: 'EA = NUM', memoryAccess: '0次 ⚡⚡⚡', advantage: '速度最快', application: '赋初值、常量' },
  { mode: '寄存器寻址', ea: 'EA = Ri', memoryAccess: '0次 ⚡⚡⚡', advantage: '速度极快', application: '频繁使用的变量' },
  { mode: '直接寻址', ea: 'EA = ADDR', memoryAccess: '1次 📖', advantage: '简单直观', application: '全局变量、静态数据' },
  { mode: '间接寻址', ea: 'EA = (ADDR)', memoryAccess: '2次 📖📖', advantage: '寻址范围大', application: '指针、动态数据结构' },
  { mode: '寄存器间接', ea: 'EA = (Ri)', memoryAccess: '1次 📖', advantage: '灵活性好', application: '数组遍历、指针操作' },
  { mode: '基址寻址', ea: 'EA = (RB) + X', memoryAccess: '1次 📖', advantage: '支持重定位', application: '多道程序、操作系统 🏛️' },
  { mode: '变址寻址', ea: 'EA = (RI) + X', memoryAccess: '1次 📖', advantage: '适合数组处理', application: '数组、循环 📊🔄' },
  { mode: '相对寻址', ea: 'EA = (PC) + X', memoryAccess: '1次 📖', advantage: '位置无关代码', application: '转移、跳转 🏃‍♂️🎯' }
]

// 三大易混淆寻址方式对比数据
const confusingModesData = [
  { aspect: '公式', base: 'EA = (RB) + X', index: 'EA = (RI) + X', relative: 'EA = (PC) + X' },
  { aspect: '寄存器角色', base: 'RB存放基地址（程序起始地址）', index: 'RI存放索引值（下标）', relative: 'PC存放下一条指令地址' },
  { aspect: '谁管理', base: '操作系统管理（用户不可改）🔒', index: '用户程序管理（用户可改）👤', relative: '硬件自动更新（PC）' },
  { aspect: 'X的含义', base: 'X是偏移量（编译时确定）', index: 'X是基准地址（数组首地址）', relative: 'X是偏移量（有符号数）' },
  { aspect: '主要用途', base: '程序重定位、多道程序 🏛️', index: '数组处理、循环 📊', relative: '转移、跳转、分支 🏃‍♂️' },
  { aspect: '变化频率', base: 'RB基本不变（加载后固定）', index: 'RI经常变化（每次循环都变）🔄', relative: 'PC每条指令后自动+1' },
  { aspect: '记忆口诀', base: '"基于操作系统"', index: '"变化的是下标"', relative: '"相对PC跳转"' }
]

// CISC vs RISC对比数据
const ciscRiscComparisonData = [
  { aspect: '指令数量', cisc: '多（几百条）💪', risc: '少（几十到一百多条）✂️' },
  { aspect: '指令长度', cisc: '可变（1~15字节）📦', risc: '固定（如32位）📏' },
  { aspect: '寻址方式', cisc: '丰富多样 🔍🔍🔍', risc: '简单少数 🔍' },
  { aspect: '执行时间', cisc: '不等（1~多个周期）⏱️', risc: '相等（大多1周期）⚡' },
  { aspect: '控制方式', cisc: '微程序控制 🔧', risc: '硬布线控制 🔧⚡' },
  { aspect: '访存方式', cisc: '多数指令可直接访存 📖', risc: '仅LOAD/STORE可访存 📦➡️📦' },
  { aspect: '寄存器数量', cisc: '较少（8~16个）📊', risc: '较多（如32个）📊📊' },
  { aspect: '硬件复杂度', cisc: '高（译码器复杂）❌', risc: '低（译码器简单）✅' },
  { aspect: '编译器难度', cisc: '低（容易生成代码）✅', risc: '高（需要优化）❌' },
  { aspect: '代码密度', cisc: '高（程序占用内存小）✅', risc: '低（程序占用内存大）❌' },
  { aspect: '流水线友好度', cisc: '差（指令长度不一）❌', risc: '好（指令长度一致）✅✅✅' },
  { aspect: '功耗', cisc: '较高 ❌', risc: '较低 ✅✅' },
  { aspect: '时钟频率', cisc: '较低 🐢', risc: '较高 🚀' },
  { aspect: '向后兼容性', cisc: '强 ✅✅✅', risc: '弱 ❌' },
  { aspect: '典型应用', cisc: 'PC、服务器 💻🖥️', risc: '手机、嵌入式 📱🔧' },
  { aspect: '代表架构', cisc: 'x86、x86-64', risc: 'ARM、MIPS、RISC-V' }
]

// RAID级别对比数据
const raidComparisonData = [
  { level: 'RAID 0', minDisks: '2', faultTolerance: '❌ 无', spaceUtilization: '100%', readPerformance: '⭐⭐⭐ 极高', writePerformance: '⭐⭐⭐ 极高', application: '临时数据、视频编辑' },
  { level: 'RAID 1', minDisks: '2', faultTolerance: '✅ 允许1块损坏', spaceUtilization: '50%', readPerformance: '⭐⭐ 一般', writePerformance: '⭐ 较低', application: '系统盘、关键数据' },
  { level: 'RAID 5', minDisks: '3', faultTolerance: '✅ 允许1块损坏', spaceUtilization: '(n-1)/n', readPerformance: '⭐⭐⭐ 高', writePerformance: '⭐⭐ 中等', application: '文件服务器、数据库' },
  { level: 'RAID 6', minDisks: '4', faultTolerance: '✅ 允许2块损坏', spaceUtilization: '(n-2)/n', readPerformance: '⭐⭐⭐ 高', writePerformance: '⭐ 较低', application: '大容量存储、归档' },
  { level: 'RAID 10', minDisks: '4', faultTolerance: '✅ 允许每组1块损坏', spaceUtilization: '50%', readPerformance: '⭐⭐⭐ 高', writePerformance: '⭐⭐ 中等', application: '高性能数据库' }
]

// CDM vs FDM/TDM 对比数据
const cdmComparisonData = [
  { item: '复用维度', fdm: '频率域', tdm: '时间域', cdm: '码域 ✅' },
  { item: '是否同时传输', fdm: '✅ 是', tdm: '❌ 否（轮流）', cdm: '✅ 是' },
  { item: '是否同频传输', fdm: '❌ 否（不同频率）', tdm: '✅ 是', cdm: '✅ 是' },
  { item: '抗干扰能力', fdm: '中等', tdm: '中等', cdm: '✅ 最强' },
  { item: '保密性', fdm: '差', tdm: '差', cdm: '✅ 最好' },
  { item: '实现复杂度', fdm: '中等', tdm: '简单', cdm: '复杂' },
  { item: '频谱利用率', fdm: '低', tdm: '中', cdm: '✅ 高' },
  { item: '典型应用', fdm: '广播、电视', tdm: '数字通信', cdm: 'CDMA手机' }
]

// 读操作与写操作对比数据
const readWriteComparisonData = [
  { aspect: '数据流向', read: '存储器→CPU', write: 'CPU→存储器' },
  { aspect: '控制信号', read: '读使能（RD）', write: '写使能（WR）' },
  { aspect: '内容变化', read: '不改变', write: '覆盖原有数据' },
  { aspect: '破坏性', read: '非破坏性', write: '破坏性' },
  { aspect: '总线使用', read: '数据总线输入', write: '数据总线输出' }
]

// 局部性原理度量数据
const localityMeasurementData = [
  { type: '时间局部性', measurement: '同一数据被重复访问的时间间隔', good: '间隔短，频繁访问' },
  { type: '空间局部性', measurement: '被访问数据的地址分布范围', good: '范围小，连续访问' }
]

// 标志寄存器相关数据
const statusFlagsData = [
  { name: 'CF', fullName: 'Carry Flag', condition: '无符号数运算最高位有进位/借位', application: '多精度加法' },
  { name: 'PF', fullName: 'Parity Flag', condition: '结果最低8位中1的个数为偶数', application: '奇偶校验' },
  { name: 'AF', fullName: 'Auxiliary Carry', condition: '第3位向第4位有进位/借位', application: 'BCD码调整' },
  { name: 'ZF', fullName: 'Zero Flag', condition: '运算结果为0', application: '判断相等⭐⭐⭐' },
  { name: 'SF', fullName: 'Sign Flag', condition: '结果最高位（符号位）为1', application: '判断正负⭐⭐⭐' },
  { name: 'OF', fullName: 'Overflow Flag', condition: '有符号数运算结果溢出', application: '溢出检测⭐⭐⭐' }
]

const controlFlagsData = [
  { name: 'DF', fullName: 'Direction Flag', value1: '字符串操作地址递减', value0: '字符串操作地址递增', instruction: 'CLD/STD' },
  { name: 'IF', fullName: 'Interrupt Flag', value1: '允许响应中断', value0: '禁止响应中断', instruction: 'CLI/STI' },
  { name: 'TF', fullName: 'Trap Flag', value1: '单步调试模式', value0: '正常执行', instruction: '调试器' }
]

const cfVsOfData = [
  { aspect: '适用场景', cf: '无符号数运算', of: '有符号数运算' },
  { aspect: '判断依据', cf: '最高位是否有进位/借位', of: '结果是否超出有符号数范围' },
  { aspect: '溢出含义', cf: '无符号数溢出', of: '有符号数溢出' },
  { aspect: '示例（8位）', cf: '255+1=256 → CF=1', of: '127+1=128 → OF=1' },
  { aspect: '同时发生', cf: '可能同时为1', of: '例如：128+128 → CF=1, OF=1' }
]

// 通用寄存器数据
const registerData = [
  { name: 'EAX', traditional: '累加器', flexible: '算术运算、函数返回值' },
  { name: 'EBX', traditional: '基址寄存器', flexible: '数据指针、基址寻址' },
  { name: 'ECX', traditional: '计数器', flexible: '循环计数、字符串操作' },
  { name: 'EDX', traditional: '数据寄存器', flexible: 'I/O指针、乘除法' },
  { name: 'ESI', traditional: '源变址', flexible: '字符串源指针' },
  { name: 'EDI', traditional: '目的变址', flexible: '字符串目的指针' },
  { name: 'EBP', traditional: '基址指针', flexible: '栈帧基址、局部变量访问' },
  { name: 'ESP', traditional: '栈指针', flexible: '栈顶管理（专用）' }
]

// 间址周期访存次数数据
const memoryAccessData = [
  { mode: '立即寻址', accessCount: '0次', hasIndirectCycle: '❌ 否' },
  { mode: '寄存器寻址', accessCount: '0次', hasIndirectCycle: '❌ 否' },
  { mode: '直接寻址', accessCount: '1次', hasIndirectCycle: '❌ 否' },
  { mode: '间接寻址', accessCount: '2次', hasIndirectCycle: '✅ 是' },
  { mode: '寄存器间接', accessCount: '1次', hasIndirectCycle: '❌ 否' },
  { mode: '基址/变址/相对', accessCount: '1次', hasIndirectCycle: '❌ 否' }
]

// 可见性数据
const visibilityData = [
  { register: '通用寄存器', visible: '✅ 可见', reason: '可通过指令直接读写' },
  { register: 'PC', visible: '✅ 可见', reason: '可通过跳转指令间接修改' },
  { register: 'PSW/FLAGS', visible: '✅ 可见', reason: '可通过条件跳转读取标志位' },
  { register: 'IR', visible: '❌ 透明', reason: '硬件自动控制，程序员无法访问' },
  { register: 'MAR', visible: '❌ 透明', reason: '硬件自动使用，程序员无法访问' },
  { register: 'MDR', visible: '❌ 透明', reason: '硬件自动使用，程序员无法访问' }
]

// 指令对齐数据
const alignmentData = [
  { arch: 'x86/x86-64', requirement: '建议对齐（非强制）', unalignedSupport: '✅ 支持，但性能降低' },
  { arch: 'ARM（早期）', requirement: '严格对齐', unalignedSupport: '❌ 不支持，产生异常' },
  { arch: 'ARMv7+', requirement: '建议对齐', unalignedSupport: '✅ 支持，但性能降低' },
  { arch: 'MIPS', requirement: '严格对齐', unalignedSupport: '❌ 不支持，产生异常' },
  { arch: 'RISC-V', requirement: '建议对齐', unalignedSupport: '部分支持' }
]

// 单周期vs多周期CPU对比数据
const cpuComparisonData = [
  { aspect: '时钟周期', singleCycle: '长（等于最长指令时间）', multiCycle: '短（等于最短阶段时间）' },
  { aspect: 'CPI', singleCycle: '固定为1', multiCycle: '不固定（1~多个）' },
  { aspect: '时钟频率', singleCycle: '低', multiCycle: '高' },
  { aspect: '硬件利用率', singleCycle: '低（简单指令浪费）', multiCycle: '高（可复用硬件）' },
  { aspect: '控制复杂度', singleCycle: '简单', multiCycle: '复杂（需要状态机）' },
  { aspect: '典型应用', singleCycle: '简单嵌入式系统', multiCycle: 'CISC架构（x86）' },
  { aspect: '流水线友好度', singleCycle: '好', multiCycle: '差' }
]

// 第6章：总线系统相关数据

// 单位换算表
const unitConversions = [
  { from: '1 Byte', to: '8 bit', conversion: '1 B = 8 b' },
  { from: '1 KB', to: '1024 B', conversion: '1 KB = 1024 B = 8192 bit' },
  { from: '1 MB', to: '1024 KB', conversion: '1 MB = 1024 KB = 1,048,576 B' },
  { from: '1 GHz', to: '1000 MHz', conversion: '1 GHz = 10⁹ Hz' },
  { from: '1 MHz', to: '1000 KHz', conversion: '1 MHz = 10⁶ Hz' }
]

// 总线仲裁对比表
const arbitrationComparison = [
  { item: '控制线数量', chain: '少（3根）✅', counter: '中等（~log₂n根）', independent: '多（2n根）❌' },
  { item: '响应速度', chain: '慢 ❌', counter: '中等', independent: '快 ✅✅✅' },
  { item: '优先级灵活性', chain: '固定 ❌', counter: '可设置 ✅', independent: '灵活 ✅✅' },
  { item: '可靠性', chain: '差 ❌', counter: '好 ✅', independent: '好 ✅✅' },
  { item: '电路复杂度', chain: '简单 ✅', counter: '中等', independent: '复杂 ❌' },
  { item: '扩充性', chain: '容易 ✅', counter: '容易', independent: '困难 ❌' }
]

// 总线定时对比表
const timingComparison = [
  { item: '同步信号', sync: '共享时钟信号', async: '握手信号（REQ/ACK）' },
  { item: '速度', sync: '快 ⚡⚡⚡', async: '较慢 ⚡' },
  { item: '设备要求', sync: '所有设备速度一致', async: '可适应不同速度' },
  { item: '控制复杂度', sync: '简单', async: '复杂' },
  { item: '应用场景', sync: 'CPU与内存之间', async: 'CPU与慢速I/O设备' }
]

// 总线标准对比表
const busStandardsTable = [
  { standard: 'PCI', year: '1993', type: '并行', bandwidth: '133-533 MB/s', application: '早期扩展卡' },
  { standard: 'USB 2.0', year: '2000', type: '串行', bandwidth: '60 MB/s', application: '键盘鼠标U盘' },
  { standard: 'USB 3.0', year: '2008', type: '串行', bandwidth: '625 MB/s', application: '移动硬盘' },
  { standard: 'PCIe 3.0', year: '2010', type: '串行', bandwidth: '~1 GB/s (x1)', application: '显卡SSD' },
  { standard: 'SATA 3.0', year: '2009', type: '串行', bandwidth: '600 MB/s', application: '机械硬盘SSD' }
]

// ========== 计算机网络知识卡片数据 ==========

// 三种交换方式对比
const switchingComparison = [
  { feature: '连接建立', circuit: '需要（三个阶段）', message: '不需要', packet: '数据报不需要，虚电路需要' },
  { feature: '资源占用', circuit: '独占（固定带宽）', message: '动态分配', packet: '统计复用' },
  { feature: '时延特性', circuit: '小（实时性强）', message: '大（存储转发）', packet: '中等' },
  { feature: '信道利用率', circuit: '低 ❌', message: '较高', packet: '高 ✅' },
  { feature: '可靠性', circuit: '一般', message: '好', packet: '好 ✅' },
  { feature: '典型应用', circuit: '电话网络', message: '电报、邮件', packet: '互联网 ✅' }
]

// 四种时延对比
const delayComparison = [
  { type: '发送时延', formula: 'L / R', dependsOn: '数据长度、发送速率', importance: '⭐⭐⭐' },
  { type: '传播时延', formula: 'd / v', dependsOn: '距离、传播速度', importance: '⭐⭐⭐' },
  { type: '处理时延', formula: '-', dependsOn: '设备性能', importance: '⭐' },
  { type: '排队时延', formula: '-', dependsOn: '网络拥塞程度', importance: '⭐⭐' }
]

// OSI vs TCP/IP对比
const osiVsTcpIpTable = [
  { layer: '应用层', tcpip: '应用层', protocol: 'HTTP、FTP、DNS、SMTP' },
  { layer: '表示层', tcpip: '（合并到应用层）', protocol: '-' },
  { layer: '会话层', tcpip: '（合并到应用层）', protocol: '-' },
  { layer: '传输层', tcpip: '传输层', protocol: 'TCP、UDP' },
  { layer: '网络层', tcpip: '网际层', protocol: 'IP、ICMP、ARP' },
  { layer: '数据链路层', tcpip: '网络接口层', protocol: '以太网、WiFi' },
  { layer: '物理层', tcpip: '网络接口层', protocol: '双绞线、光纤' }
]

// 奈奎斯特 vs 香农定理对比
const nyquistVsShannon = [
  { item: '前提条件', nyquist: '理想低通信道，无噪声', shannon: '带宽受限且有高斯白噪声' },
  { item: '限制因素', nyquist: '码间串扰', shannon: '信噪比' },
  { item: '公式', nyquist: '2W × log₂V', shannon: 'W × log₂(1 + S/N)' },
  { item: '单位', nyquist: 'Baud（码元速率）', shannon: 'bit/s（比特速率）' },
  { item: '意义', nyquist: '无噪声时的理论上限', shannon: '有噪声时的理论上限' }
]

// 编码方式对比
const encodingComparison = [
  { name: 'NRZ', description: '高电平=1，低电平=0', pros: '简单', cons: '直流分量' },
  { name: 'RZ', description: '每个比特中间归零', pros: '可自同步', cons: '带宽需求大' },
  { name: '曼彻斯特', description: '比特中间跳变', pros: '自带时钟 ✅', cons: '带宽翻倍' },
  { name: '差分曼彻斯特', description: '开始处跳变表示0/1', pros: '抗干扰强', cons: '复杂' }
]

// 检错编码对比
const errorDetectionComparison = [
  { method: '奇偶校验', principle: '添加校验位使1的个数为奇数或偶数', capability: '只能检测奇数个错误', canCorrect: '❌ 否' },
  { method: 'CRC', principle: '使用生成多项式进行模2除法', capability: '可检测单、双、奇数个错误及突发错误', canCorrect: '❌ 否' },
  { method: '海明码', principle: '多个校验位交叉覆盖', capability: '可检测并纠正单个错误', canCorrect: '✅ 是' }
]

// 码距与检错纠错关系
const codeDistanceFormula = [
  { goal: '检测 e 个错误', formula: 'd ≥ e + 1', example: '检测1个错误 → d≥2' },
  { goal: '纠正 t 个错误', formula: 'd ≥ 2t + 1', example: '纠正1个错误 → d≥3' },
  { goal: '检测e个+纠正t个', formula: 'd ≥ e + t + 1 (e>t)', example: '检测2个+纠正1个 → d≥4' }
]

// IP地址分类
const ipClassTable = [
  { class: 'A类', range: '1.0.0.0~126.255.255.255', networkBits: '8位', hostBits: '24位', usage: '大型网络' },
  { class: 'B类', range: '128.0.0.0~191.255.255.255', networkBits: '16位', hostBits: '16位', usage: '中型网络' },
  { class: 'C类', range: '192.0.0.0~223.255.255.255', networkBits: '24位', hostBits: '8位', usage: '小型网络' },
  { class: 'D类', range: '224.0.0.0~239.255.255.255', networkBits: '-', hostBits: '-', usage: '组播' },
  { class: 'E类', range: '240.0.0.0~255.255.255.255', networkBits: '-', hostBits: '-', usage: '保留' }
]

// 第7章：输入输出系统相关数据

// I/O编址方式对比表
const addressingComparison = [
  { item: '地址空间', unified: '与内存统一', separate: '独立空间' },
  { item: '指令类型', unified: '访存指令（MOV）', separate: '专用I/O指令（IN/OUT）' },
  { item: '指令丰富度', unified: '丰富 ✅', separate: '较少 ❌' },
  { item: '占用内存', unified: '是 ❌', separate: '否 ✅' },
  { item: '编程难度', unified: '简单 ✅', separate: '稍复杂' },
  { item: '典型架构', unified: 'ARM/MIPS', separate: 'x86' }
]

// 三种I/O方式对比表
const ioComparisonTable = [
  { item: 'CPU参与度', polling: '最高（全程参与）', interrupt: '中等（每个数据中断）', dma: '最低（只初始化+后处理）' },
  { item: 'CPU利用率', polling: '最低 ❌', interrupt: '较高 ✅', dma: '最高 ✅✅✅' },
  { item: '硬件复杂度', polling: '最低 ✅', interrupt: '中等', dma: '最高 ❌' },
  { item: '实时性', polling: '最差 ❌', interrupt: '好 ✅', dma: '好 ✅' },
  { item: '适用设备', polling: '极低速设备', interrupt: '中低速设备', dma: '高速设备' },
  { item: '数据批量', polling: '小批量', interrupt: '小批量', dma: '大批量' },
  { item: '典型应用', polling: '简单嵌入式', interrupt: '键鼠打印机', dma: '硬盘网卡' }
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
        background: #fff8e6;
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
