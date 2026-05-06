<template>
  <div class="ai-grammar-assistant">
    <!-- 头部介绍 -->
    <div class="assistant-header">
      <div class="header-content">
        <h2 class="title">🤖 AI辅助语法学习中心</h2>
        <p class="subtitle">高阶思维 × AI协作 = 深度学习体验</p>
      </div>
      <div class="quick-stats">
        <div class="stat-item">
          <span class="stat-icon">📚</span>
          <div class="stat-info">
            <div class="stat-value">{{ completedTemplates }}</div>
            <div class="stat-label">已使用模板</div>
          </div>
        </div>
        <div class="stat-item">
          <span class="stat-icon">💬</span>
          <div class="stat-info">
            <div class="stat-value">{{ totalInteractions }}</div>
            <div class="stat-label">AI对话次数</div>
          </div>
        </div>
        <div class="stat-item">
          <span class="stat-icon">🎯</span>
          <div class="stat-info">
            <div class="stat-value">{{ masteredPoints }}</div>
            <div class="stat-label">掌握语法点</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速开始区域 -->
    <div class="quick-start-section">
      <h3 class="section-title">⚡ 快速开始</h3>
      <div class="action-cards">
        <div class="action-card primary" @click="startDiagnosis">
          <div class="card-icon">🔍</div>
          <h4>开始语法诊断</h4>
          <p>AI评估你的当前水平，生成个性化学习路径</p>
          <el-button type="primary" size="small">立即开始</el-button>
        </div>
        
        <div class="action-card secondary" @click="viewPromptLibrary">
          <div class="card-icon">📋</div>
          <h4>查看Prompt模板库</h4>
          <p>10个专业模板，覆盖所有学习场景</p>
          <el-button type="success" size="small">浏览模板</el-button>
        </div>
        
        <div class="action-card tertiary" @click="openKnowledgeBase">
          <div class="card-icon">🗂️</div>
          <h4>我的语法知识库</h4>
          <p>查看已整理的语法知识卡片</p>
          <el-button type="info" size="small">打开知识库</el-button>
        </div>
      </div>
    </div>

    <!-- AI学习工作区 -->
    <div class="workspace-section">
      <h3 class="section-title">🛠️ AI学习工作区</h3>
      
      <el-tabs v-model="activeWorkspace" class="workspace-tabs">
        <!-- 模板选择器 -->
        <el-tab-pane label="选择模板" name="templates">
          <div class="templates-grid">
            <div 
              v-for="template in templates" 
              :key="template.id"
              class="template-card"
              :class="{ 'in-use': template.inUse }"
              @click="selectTemplate(template)"
            >
              <div class="template-header">
                <span class="template-number">{{ template.id }}</span>
                <h4>{{ template.name }}</h4>
              </div>
              <p class="template-desc">{{ template.description }}</p>
              <div class="template-tags">
                <el-tag 
                  v-for="tag in template.tags" 
                  :key="tag" 
                  size="small"
                  :type="getTagType(tag)"
                >
                  {{ tag }}
                </el-tag>
              </div>
              <div class="template-footer">
                <span class="usage-count">已使用 {{ template.usageCount }} 次</span>
                <el-button size="small" type="primary" @click.stop="useTemplate(template)">
                  使用此模板
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 对话历史 -->
        <el-tab-pane label="对话历史" name="history">
          <div class="history-list">
            <div 
              v-for="conversation in conversations" 
              :key="conversation.id"
              class="conversation-item"
              @click="viewConversation(conversation)"
            >
              <div class="conversation-header">
                <h4>{{ conversation.title }}</h4>
                <span class="conversation-date">{{ formatDate(conversation.date) }}</span>
              </div>
              <p class="conversation-preview">{{ conversation.preview }}</p>
              <div class="conversation-meta">
                <el-tag size="small" :type="getTemplateType(conversation.template)">{{ conversation.template }}</el-tag>
                <span class="message-count">{{ conversation.messageCount }} 条消息</span>
              </div>
            </div>
            
            <el-empty v-if="conversations.length === 0" description="暂无对话记录" />
          </div>
        </el-tab-pane>

        <!-- 学习进度 -->
        <el-tab-pane label="学习进度" name="progress">
          <div class="progress-dashboard">
            <div class="progress-chart">
              <h4>语法能力雷达图</h4>
              <div class="chart-placeholder">
                <p>📊 能力评估图表（待实现）</p>
                <p class="hint">完成诊断后将显示你的能力分布</p>
              </div>
            </div>
            
            <div class="progress-details">
              <h4>各模块掌握情况</h4>
              <div class="module-progress">
                <div 
                  v-for="module in grammarModules" 
                  :key="module.name"
                  class="module-item"
                >
                  <div class="module-info">
                    <span class="module-name">{{ module.name }}</span>
                    <span class="module-percentage">{{ module.progress }}%</span>
                  </div>
                  <el-progress 
                    :percentage="module.progress" 
                    :color="getProgressColor(module.progress)"
                    :stroke-width="8"
                  />
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 使用指南 -->
    <div class="guide-section">
      <h3 class="section-title">📖 使用指南</h3>
      <el-collapse v-model="activeGuide">
        <el-collapse-item title="如何高效使用AI辅助学习？" name="1">
          <div class="guide-content">
            <h4>✅ 正确做法</h4>
            <ul>
              <li><strong>明确目标</strong>：每次对话前清楚自己想要什么</li>
              <li><strong>提供背景</strong>：让AI了解你的水平和目标</li>
              <li><strong>迭代优化</strong>：不满意就继续追问</li>
              <li><strong>验证输出</strong>：交叉验证AI的回答</li>
              <li><strong>记录精华</strong>：保存有价值的对话</li>
            </ul>
            
            <h4>❌ 避免陷阱</h4>
            <ul>
              <li>不要直接抄答案，理解过程比答案重要</li>
              <li>不要过度依赖，AI是辅助，思考主体是你</li>
              <li>不要盲目相信，AI可能给出错误解释</li>
              <li>不要浅层使用，充分利用AI的深度分析能力</li>
            </ul>
          </div>
        </el-collapse-item>
        
        <el-collapse-item title="推荐的学習流程" name="2">
          <div class="guide-content">
            <ol>
              <li><strong>诊断阶段</strong>：使用"学习进度诊断师"模板评估当前水平</li>
              <li><strong>规划阶段</strong>：让AI生成个性化语法地图和学习计划</li>
              <li><strong>学习阶段</strong>：
                <ul>
                  <li>看网课前：用"语法概念深度解释器"预习</li>
                  <li>学习中：随时提问疑惑点</li>
                  <li>学习后：用"个性化练习生成器"巩固</li>
                </ul>
              </li>
              <li><strong>应用阶段</strong>：用"写作反馈助手"检查实际应用</li>
              <li><strong>复习阶段</strong>：用"语法知识卡片生成器"整理笔记</li>
            </ol>
          </div>
        </el-collapse-item>
        
        <el-collapse-item title="追问技巧" name="3">
          <div class="guide-content">
            <p>如果AI的回答不够好，可以尝试以下追问方式：</p>
            <ul>
              <li>"这个解释还是不太懂，能换个角度吗？"</li>
              <li>"能不能用更简单的例子？"</li>
              <li>"这个太简单了，有更深入的讲解吗？"</li>
              <li>"能否给我一个实际应用的场景？"</li>
              <li>"如果[某种情况]，这个规则还适用吗？"</li>
              <li>"请扮演语言学教授，会如何解释这个问题？"</li>
            </ul>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- 提示对话框 -->
    <el-dialog
      v-model="showPromptDialog"
      :title="selectedTemplate?.name || 'Prompt模板'"
      width="70%"
      class="prompt-dialog"
    >
      <div v-if="selectedTemplate" class="prompt-content">
        <div class="prompt-header">
          <el-alert
            :title="'模板编号：' + selectedTemplate.id"
            type="info"
            :closable="false"
            show-icon
          />
        </div>
        
        <div class="prompt-body">
          <h4>📋 模板内容</h4>
          <pre class="prompt-text">{{ selectedTemplate.fullContent }}</pre>
        </div>
        
        <div class="prompt-actions">
          <el-button type="primary" @click="copyPrompt">
            <el-icon><CopyDocument /></el-icon>
            复制到剪贴板
          </el-button>
          <el-button type="success" @click="openInNewTab">
            <el-icon><Link /></el-icon>
            在新标签页打开
          </el-button>
          <el-button @click="showPromptDialog = false">关闭</el-button>
        </div>
        
        <div class="prompt-tips">
          <h4>💡 使用提示</h4>
          <ul>
            <li>复制模板后，替换<code>[方括号]</code>中的内容为你自己的情况</li>
            <li>将填充好的Prompt粘贴到AI对话框（如通义千问、ChatGPT等）</li>
            <li>根据AI的回答进行迭代追问，深入理解</li>
            <li>将有价值的对话保存到"对话历史"中</li>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CopyDocument, Link } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 统计数据
const completedTemplates = ref(3)
const totalInteractions = ref(15)
const masteredPoints = ref(8)

// 工作区标签
const activeWorkspace = ref('templates')
const activeGuide = ref([])

// 对话框状态
const showPromptDialog = ref(false)
const selectedTemplate = ref<any>(null)

// 模板数据
const templates = ref([
  {
    id: '1',
    name: '语法概念深度解释器',
    description: '深入理解语法本质，而非死记规则',
    tags: ['基础', '理解', '高频'],
    usageCount: 5,
    inUse: true,
    fullContent: `我想深入学习[语法概念，如：定语从句/虚拟语气/非谓语动词]。请不要只是告诉我规则，而是帮我理解：

1. 为什么英语需要这种结构？它解决了什么表达问题？
2. 这个语法点的本质功能是什么？（用一句话概括）
3. 与其他类似结构的核心区别在哪里？
4. 能否用中文的类似表达方式做对比，帮助我理解差异？
5. 给我3个考研真题中的经典例句，并分析：
   - 句子结构
   - 为什么作者选择这样的结构
   - 如果换成其他结构会怎样

背景信息：
- 我的水平：[描述你的当前水平]
- 学习目标：考研英语一，目标分数[XX]分
- 学习方式偏好：[如：喜欢类比、喜欢实例等]

请用通俗易懂的语言，可以类比、举例，但不要过于学术化。`
  },
  {
    id: '2',
    name: '长难句拆解教练',
    description: '系统化分析复杂句子结构',
    tags: ['阅读', '分析', '核心'],
    usageCount: 8,
    inUse: true,
    fullContent: `请帮我拆解以下考研真题长难句：

[粘贴长难句]

要求按以下步骤进行：

**步骤1：识别主干**
- 主语：
- 谓语：
- 宾语/表语：

**步骤2：标记修饰成分**
- 定语（修饰名词的部分）：
- 状语（修饰动词/句子的部分）：
- 补语：
- 插入语：

**步骤3：识别从句**
- 从句类型：[名词性/定语/状语从句]
- 从句功能：
- 引导词：

**步骤4：还原简化**
将这个复杂句拆分为[3-5]个简单句

**步骤5：逻辑分析**
- 作者的写作意图是什么？
- 为什么要写得这么复杂？
- 句子的逻辑关系是什么？

**步骤6：翻译与技巧**
- 流畅的中文翻译：
- 翻译时的处理策略：

**步骤7：学习要点**
- 值得学习的语法结构：
- 可在作文中借鉴的表达：
- 类似的句型模式：`
  },
  {
    id: '3',
    name: '平行文本分析师',
    description: '对比不同表达方式，理解语法选择逻辑',
    tags: ['对比', '进阶', '写作'],
    usageCount: 3,
    inUse: false,
    fullContent: `请帮我分析以下两个句子的语法差异和语用效果：

句子A：[粘贴句子A]
句子B：[粘贴句子B]

分析维度：

**1. 语法结构差异**
- 句子A使用了哪些语法手段？
- 句子B使用了哪些语法手段？
- 核心差异在哪里？

**2. 信息焦点差异**
- 句子A强调了什么？弱化了什么？
- 句子B强调了什么？弱化了什么？

**3. 语气和风格差异**
- 正式程度、客观性、语气强弱

**4. 适用场景**
- 在什么语境下用句子A更好？
- 在什么情况下用句子B更好？

**5. 总结表格**
请用一个表格对比两个句子的关键差异。`
  },
  {
    id: '4',
    name: '句式变换实验室',
    description: '练习用不同结构表达同一意思',
    tags: ['写作', '应用', '练习'],
    usageCount: 4,
    inUse: false,
    fullContent: `我想练习句式变换能力。请以"[核心意思]"为主题，帮我：

**第一部分：示例学习**
生成5-8种不同语法结构的表达方式，每种标注：
- 使用的语法结构
- 语气强弱
- 正式程度
- 适用场景
- 考研作文推荐度

**第二部分：实战练习**
给我3个新的核心意思，让我自己尝试变换。

**第三部分：反馈与改进**
在我完成后，请评价并提供改进建议。`
  },
  {
    id: '5',
    name: '写作反馈助手',
    description: '检查语法使用并提供优化建议',
    tags: ['写作', '反馈', '评分'],
    usageCount: 6,
    inUse: true,
    fullContent: `我用今天学的[语法结构名称]写了一段话，请帮我全面评估：

**我的段落**：
[粘贴你的段落]

**评估要求**：
1. 语法准确性检查
2. 表达质量评估
3. 优化建议（提供1-2个优化版本）
4. 考研作文评分
5. 学习建议

请从考研作文评分标准角度评价。`
  },
  {
    id: '6',
    name: '个性化练习生成器',
    description: '针对薄弱环节生成定制练习',
    tags: ['练习', '定制', '测试'],
    usageCount: 7,
    inUse: false,
    fullContent: `我刚学习了[语法点名称]，感觉理解得还不够扎实。请为我生成一套针对性练习题：

**练习要求**：
1. 选择题（5道，考研真题风格）
2. 改错题（3道，设置典型错误）
3. 翻译题（2道，中译英）
4. 写作题（1道，要求使用目标语法）
5. 每道题都要有详细解析

难度控制：略高于我当前水平，有挑战性但不至于打击信心。`
  },
  {
    id: '7',
    name: '苏格拉底式提问导师',
    description: '通过引导式提问培养深度思考',
    tags: ['深度', '思考', '高阶'],
    usageCount: 2,
    inUse: false,
    fullContent: `我想深入学习[语法概念]。请不要直接告诉我答案，而是通过苏格拉底式的提问引导我自己思考和发现。

**对话规则**：
1. 每次只问一个问题
2. 问题要有启发性
3. 根据我的回答调整下一个问题
4. 如果我卡住了，给一点提示，但不要直接给答案
5. 最后帮我总结讨论得出的结论

现在开始第一个问题。请记住：你的角色是引导者，不是讲解者。`
  },
  {
    id: '8',
    name: '考研作文阅卷模拟',
    description: '模拟真实考研阅卷，获取专业反馈',
    tags: ['作文', '评分', '模拟'],
    usageCount: 3,
    inUse: false,
    fullContent: `请扮演考研英语阅卷老师，对我的作文进行评分和点评：

**作文题目**：[粘贴题目]
**我的作文**：[粘贴作文全文]

**评分标准**：考研英语一大作文（满分20分）

**评估要求**：
1. 总体评分和档次
2. 分项评分（内容、语言、结构等）
3. 详细评语（优点和不足）
4. 逐段分析
5. 修改建议和优化版本
6. 重点改进方向`
  },
  {
    id: '9',
    name: '语法知识卡片生成器',
    description: '创建标准化的语法知识库',
    tags: ['笔记', '整理', '复习'],
    usageCount: 5,
    inUse: false,
    fullContent: `我想为[语法点名称]创建一个标准化的知识卡片。

**卡片格式要求**：
- 核心功能（一句话概括）
- 典型结构（公式化表示）
- 使用场景（3个场景+例句）
- 经典例句（3个考研真题）
- 常见错误（2-3个典型错误）
- 关联知识点
- 考研重要性评级
- 我的笔记（留空）
- 复习计划（基于艾宾浩斯曲线）

请用Markdown格式输出，方便我导入笔记软件。`
  },
  {
    id: '10',
    name: '学习进度诊断师',
    description: '定期评估学习效果，调整学习计划',
    tags: ['诊断', '规划', '复盘'],
    usageCount: 1,
    inUse: false,
    fullContent: `请帮我诊断当前的英语语法学习进度，并给出下一步建议。

**我的学习情况**：
- 已完成内容：[列出已学的语法点]
- 学习时间：[X周/月]
- 自我评估：掌握较好的、仍有困惑的、完全不懂的

**诊断要求**：
1. 能力雷达图（6个维度评估）
2. 优势分析
3. 问题诊断
4. 下一步建议（短期/中期/长期）
5. 资源推荐
6. 激励与建议

请基于以上信息，给我一份详细的诊断报告和改进方案。`
  }
])

// 对话历史
const conversations = ref([
  {
    id: 1,
    title: '定语从句深度理解',
    date: '2026-05-05',
    preview: '讨论了限制性与非限制性定语从句的本质区别...',
    template: '语法概念深度解释器',
    messageCount: 12
  },
  {
    id: 2,
    title: '长难句分析练习',
    date: '2026-05-04',
    preview: '分析了2019年阅读真题中的3个复杂句子...',
    template: '长难句拆解教练',
    messageCount: 8
  }
])

// 语法模块进度
const grammarModules = ref([
  { name: '句子骨架（主谓宾）', progress: 85 },
  { name: '定语从句', progress: 70 },
  { name: '状语从句', progress: 60 },
  { name: '名词性从句', progress: 45 },
  { name: '非谓语动词', progress: 30 },
  { name: '虚拟语气', progress: 20 },
  { name: '倒装与强调', progress: 15 },
  { name: '特殊结构', progress: 10 }
])

// 方法
const getTagType = (tag: string): '' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | undefined => {
  const typeMap: Record<string, '' | 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
    '基础': '',
    '理解': 'success',
    '高频': 'warning',
    '阅读': 'primary',
    '分析': 'info',
    '核心': 'danger',
    '对比': '',
    '进阶': 'warning',
    '写作': 'success',
    '应用': 'primary',
    '练习': 'info',
    '反馈': 'warning',
    '评分': 'danger',
    '定制': 'success',
    '测试': 'primary',
    '深度': 'danger',
    '思考': 'warning',
    '高阶': 'danger',
    '作文': 'success',
    '模拟': 'primary',
    '笔记': '',
    '整理': 'info',
    '复习': 'warning',
    '诊断': 'danger',
    '规划': 'success',
    '复盘': 'info'
  }
  const type = typeMap[tag]
  // 如果映射值为空字符串，返回 undefined（不设置 type 属性）
  return type === '' ? undefined : type
}

const getProgressColor = (progress: number) => {
  if (progress >= 80) return '#67C23A'
  if (progress >= 60) return '#E6A23C'
  return '#F56C6C'
}

const getTemplateType = (templateName: string): '' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | undefined => {
  // 根据模板名称返回对应的标签类型
  const typeMap: Record<string, '' | 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
    '语法概念深度解释器': 'primary',
    '长难句拆解教练': 'success',
    '平行文本分析师': 'warning',
    '句式变换实验室': 'info',
    '写作反馈助手': 'danger',
    '个性化练习生成器': 'primary',
    '苏格拉底式提问导师': 'warning',
    '考研作文阅卷模拟': 'danger',
    '语法知识卡片生成器': 'success',
    '学习进度诊断师': 'info'
  }
  const type = typeMap[templateName]
  return type === '' ? undefined : type
}

const selectTemplate = (template: any) => {
  selectedTemplate.value = template
  showPromptDialog.value = true
}

const useTemplate = (template: any) => {
  selectedTemplate.value = template
  showPromptDialog.value = true
  // 更新使用次数
  template.usageCount++
  template.inUse = true
}

const copyPrompt = () => {
  if (selectedTemplate.value) {
    navigator.clipboard.writeText(selectedTemplate.value.fullContent)
    ElMessage.success('已复制到剪贴板！')
  }
}

const openInNewTab = () => {
  // 打开Prompt模板库文档
  window.open('/02-英语一/04-备考指南/复习计划/AI辅助语法学习-Prompt模板库.md', '_blank')
}

const startDiagnosis = () => {
  ElMessage.info('即将启动AI诊断流程...')
  // TODO: 实现诊断流程
}

const viewPromptLibrary = () => {
  // 滚动到模板选择器
  activeWorkspace.value = 'templates'
}

const openKnowledgeBase = () => {
  ElMessage.info('知识库功能开发中...')
  // TODO: 实现知识库
}

const viewConversation = (conversation: any) => {
  ElMessage.info(`查看对话：${conversation.title}`)
  // TODO: 实现对话详情查看
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.ai-grammar-assistant {
  max-width: 1400px;
  margin: 0 auto;
  padding: 25px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 头部样式 */
.assistant-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 35px;
  margin-bottom: 30px;
  color: white;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.35);
}

.header-content {
  margin-bottom: 28px;
}

.title {
  font-size: 2.2em;
  margin: 0 0 12px 0;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 1.15em;
  opacity: 0.95;
  margin: 0;
  font-weight: 400;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.18);
  padding: 18px;
  border-radius: 14px;
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2em;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 1.8em;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 0.9em;
  opacity: 0.9;
  margin-top: 5px;
}

/* 快速开始区域 */
.quick-start-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.6em;
  color: #333;
  margin-bottom: 22px;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 22px;
}

.action-card {
  padding: 28px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  border: 2px solid transparent;
}

.action-card.primary {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-color: #2196F3;
}

.action-card.secondary {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border-color: #4CAF50;
}

.action-card.tertiary {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  border-color: #9C27B0;
}

.action-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
}

.card-icon {
  font-size: 3em;
  margin-bottom: 15px;
}

.action-card h4 {
  font-size: 1.2em;
  color: #333;
  margin: 0 0 10px 0;
}

.action-card p {
  color: #666;
  margin: 0 0 15px 0;
  font-size: 0.95em;
  line-height: 1.5;
}

/* 工作区样式 */
.workspace-section {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.workspace-section:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.workspace-tabs {
  margin-top: 20px;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.template-card {
  padding: 22px;
  border: 2px solid #e8e8e8;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  display: flex;
  flex-direction: column;
}

.template-card:hover {
  border-color: #667eea;
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.25);
  transform: translateY(-4px);
}

.template-card.in-use {
  border-color: #52c41a;
  background: linear-gradient(135deg, #f6ffed 0%, #f0f9e8 100%);
  box-shadow: 0 2px 8px rgba(82, 196, 26, 0.15);
}

.template-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.template-number {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9em;
}

.template-card h4 {
  margin: 0;
  color: #333;
  font-size: 1.1em;
  flex: 1;
}

.template-desc {
  color: #666;
  font-size: 0.9em;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.template-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
  min-height: 24px;
}

.template-tags :deep(.el-tag) {
  border-radius: 6px;
  font-weight: 500;
  padding: 4px 10px;
}

.template-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #e0e0e0;
}

.usage-count {
  font-size: 0.85em;
  color: #999;
}

/* 对话历史样式 */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.conversation-item {
  padding: 20px;
  border: 1.5px solid #e8e8e8;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
}

.conversation-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  transform: translateX(4px);
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.conversation-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.05em;
}

.conversation-date {
  font-size: 0.85em;
  color: #999;
}

.conversation-preview {
  color: #666;
  font-size: 0.9em;
  margin: 0 0 10px 0;
  line-height: 1.5;
}

.conversation-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.conversation-meta :deep(.el-tag) {
  border-radius: 6px;
  font-weight: 500;
  padding: 4px 10px;
}

.message-count {
  font-size: 0.85em;
  color: #999;
}

/* 进度仪表板 */
.progress-dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.progress-chart,
.progress-details {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
}

.progress-chart h4,
.progress-details h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.1em;
}

.chart-placeholder {
  background: white;
  padding: 40px;
  border-radius: 10px;
  text-align: center;
  border: 2px dashed #ddd;
}

.chart-placeholder p {
  margin: 5px 0;
  color: #999;
}

.hint {
  font-size: 0.9em;
  color: #bbb;
}

.module-progress {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.module-item {
  background: white;
  padding: 12px;
  border-radius: 8px;
}

.module-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9em;
}

.module-name {
  color: #333;
  font-weight: 500;
}

.module-percentage {
  color: #667eea;
  font-weight: 600;
}

/* 使用指南样式 */
.guide-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.guide-content {
  padding: 10px;
}

.guide-content h4 {
  color: #333;
  margin: 15px 0 10px 0;
  font-size: 1.05em;
}

.guide-content ul,
.guide-content ol {
  margin: 10px 0;
  padding-left: 20px;
}

.guide-content li {
  margin: 8px 0;
  color: #666;
  line-height: 1.6;
}

.guide-content code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  color: #e91e63;
}

/* 对话框样式 */
.prompt-dialog :deep(.el-dialog__body) {
  padding: 20px;
}

.prompt-content {
  max-height: 60vh;
  overflow-y: auto;
}

.prompt-header {
  margin-bottom: 20px;
}

.prompt-body {
  margin-bottom: 20px;
}

.prompt-body h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.prompt-text {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 300px;
  overflow-y: auto;
}

.prompt-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.prompt-tips {
  background: #fff3cd;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #ffc107;
}

.prompt-tips h4 {
  margin: 0 0 10px 0;
  color: #856404;
}

.prompt-tips ul {
  margin: 0;
  padding-left: 20px;
}

.prompt-tips li {
  margin: 6px 0;
  color: #856404;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-grammar-assistant {
    padding: 15px;
  }
  
  .title {
    font-size: 1.6em;
  }
  
  .quick-stats {
    grid-template-columns: 1fr;
  }
  
  .action-cards {
    grid-template-columns: 1fr;
  }
  
  .templates-grid {
    grid-template-columns: 1fr;
  }
  
  .progress-dashboard {
    grid-template-columns: 1fr;
  }
  
  .prompt-actions {
    flex-direction: column;
  }
}
</style>
