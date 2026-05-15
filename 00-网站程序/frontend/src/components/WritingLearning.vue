<template>
  <div class="writing-learning">
    <div class="page-header">
      <h2>✍️ 写作学习系统</h2>
      <p>写作指导 + 模板背诵 + 高分句型</p>
    </div>

    <!-- 选项卡切换 -->
    <div class="tab-switcher">
      <button 
        :class="['tab-btn', { active: activeTab === 'guide' }]" 
        @click="activeTab = 'guide'"
      >
        写作指导
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'templates' }]" 
        @click="activeTab = 'templates'"
      >
        模板背诵
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'phrases' }]" 
        @click="activeTab = 'phrases'"
      >
        高分句型
      </button>
    </div>

    <!-- 写作指导 -->
    <div v-if="activeTab === 'guide'" class="guide-section">
      <div class="guide-list">
        <div 
          v-for="guide in writingGuides" 
          :key="guide.id"
          class="guide-card"
          @click="showGuideDetail(guide)"
        >
          <div class="guide-icon">{{ guide.icon }}</div>
          <h3>{{ guide.title }}</h3>
          <p>{{ guide.description }}</p>
        </div>
      </div>

      <!-- 写作指导详情弹窗 -->
      <el-dialog 
        v-model="guideDetailVisible" 
        :title="selectedGuide?.title"
        width="800px"
      >
        <div v-if="selectedGuide" class="guide-detail">
          <div class="guide-content" v-html="selectedGuide.content"></div>
        </div>
      </el-dialog>
    </div>

    <!-- 模板背诵 -->
    <div v-if="activeTab === 'templates'" class="templates-section">
      <div class="templates-toolbar">
        <el-select v-model="templateFilter" placeholder="选择模板类型" clearable style="width: 200px;">
          <el-option label="图表作文" value="chart" />
          <el-option label="话题论述" value="topic" />
          <el-option label="书信" value="letter" />
        </el-select>
        <el-button type="primary" @click="showAddTemplateDialog">
          <el-icon><Plus /></el-icon>
          添加模板
        </el-button>
      </div>

      <div class="templates-list">
        <div 
          v-for="template in filteredTemplates" 
          :key="template.id"
          class="template-card"
        >
          <div class="template-header">
            <span :class="['template-type', template.type]">{{ getTypeLabel(template.type) }}</span>
            <div class="template-actions">
              <el-button size="small" @click="toggleTemplateContent(template.id)">
                {{ template.showContent ? '收起' : '展开' }}
              </el-button>
              <el-button size="small" type="danger" @click="deleteTemplate(template.id)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
          
          <div v-if="template.showContent" class="template-content">
            <div class="template-title">{{ template.title }}</div>
            <div class="template-text">{{ template.content }}</div>
            
            <div class="template-usage">
              <strong>使用说明：</strong>
              <p>{{ template.usage }}</p>
            </div>
          </div>
        </div>
      </div>

      <el-empty v-if="filteredTemplates.length === 0" description="暂无模板" />

      <!-- 添加模板弹窗 -->
      <el-dialog 
        v-model="addTemplateVisible" 
        title="添加模板"
        width="700px"
      >
        <el-form :model="templateForm" label-width="100px">
          <el-form-item label="类型">
            <el-select v-model="templateForm.type" placeholder="请选择类型">
              <el-option label="图表作文" value="chart" />
              <el-option label="话题论述" value="topic" />
              <el-option label="书信" value="letter" />
            </el-select>
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="templateForm.title" placeholder="模板标题" />
          </el-form-item>
          <el-form-item label="内容">
            <el-input 
              v-model="templateForm.content" 
              type="textarea" 
              :rows="6"
              placeholder="请输入模板内容"
            />
          </el-form-item>
          <el-form-item label="使用说明">
            <el-input 
              v-model="templateForm.usage" 
              type="textarea" 
              :rows="3"
              placeholder="请输入使用说明"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="addTemplateVisible = false">取消</el-button>
          <el-button type="primary" @click="saveTemplate">保存</el-button>
        </template>
      </el-dialog>
    </div>

    <!-- 高分句型 -->
    <div v-if="activeTab === 'phrases'" class="phrases-section">
      <div class="phrases-list">
        <div 
          v-for="category in phraseCategories" 
          :key="category.id"
          class="phrase-category"
        >
          <h3 class="category-title">{{ category.icon }} {{ category.title }}</h3>
          <div class="phrases-grid">
            <div 
              v-for="phrase in category.phrases" 
              :key="phrase.id"
              class="phrase-card"
              @click="showPhraseDetail(phrase)"
            >
              <div class="phrase-text">{{ phrase.english }}</div>
              <div class="phrase-meaning">{{ phrase.chinese }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 句型详情弹窗 -->
      <el-dialog 
        v-model="phraseDetailVisible" 
        :title="'句型详解'"
        width="700px"
      >
        <div v-if="selectedPhrase" class="phrase-detail">
          <div class="detail-english">
            <strong>英文：</strong>{{ selectedPhrase.english }}
          </div>
          <div class="detail-chinese">
            <strong>中文：</strong>{{ selectedPhrase.chinese }}
          </div>
          <div v-if="selectedPhrase.examples && selectedPhrase.examples.length > 0" class="detail-examples">
            <h4>例句</h4>
            <div 
              v-for="(example, index) in selectedPhrase.examples" 
              :key="index"
              class="example-item"
            >
              <div class="example-text">{{ example }}</div>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>

    <!-- 使用提示 -->
    <div class="usage-tips">
      <el-icon><InfoFilled /></el-icon>
      <span>💡 使用建议：先学方法，再背模板，每周至少写一篇作文，对照范文找差距</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Delete, InfoFilled } from '@element-plus/icons-vue'

const activeTab = ref('guide')

// 写作指导数据
const writingGuides = [
  {
    id: 1,
    icon: '📊',
    title: '图表作文写作技巧',
    description: '掌握图表描述的关键步骤和常用表达',
    content: `
      <h4>一、写作结构</h4>
      <p><strong>第一段：</strong>描述图表内容（1-2句）</p>
      <p><strong>第二段：</strong>分析数据变化或对比（3-4句）</p>
      <p><strong>第三段：</strong>总结趋势或提出建议（1-2句）</p>
      
      <h4>二、常用句型</h4>
      <p>• The chart/graph shows that...</p>
      <p>• According to the data, ...</p>
      <p>• It can be seen from the chart that...</p>
      
      <h4>三、数据表达词汇</h4>
      <p>• 增长：increase, rise, grow, surge</p>
      <p>• 下降：decrease, decline, drop, fall</p>
      <p>• 波动：fluctuate, vary</p>
      <p>• 稳定：remain stable, stay constant</p>
      
      <h4>四、注意事项</h4>
      <p>1. 不要罗列所有数据，选择重要的趋势</p>
      <p>2. 使用比较和对比的表达方式</p>
      <p>3. 注意时态的正确使用</p>
      <p>4. 避免主观臆断，客观描述数据</p>
    `
  },
  {
    id: 2,
    icon: '',
    title: '话题论述写作技巧',
    description: '学会就某个话题展开论述和论证',
    content: `
      <h4>一、写作结构</h4>
      <p><strong>第一段：</strong>引出话题，表明观点（2-3句）</p>
      <p><strong>第二段：</strong>论证观点，提供理由和例子（3-4句）</p>
      <p><strong>第三段：</strong>总结重申观点（1-2句）</p>
      
      <h4>二、常用开头</h4>
      <p>• Nowaday, ... has become a hot topic.</p>
      <p>• With the development of ..., ...</p>
      <p>• Different people have different views on...</p>
      
      <h4>三、论证方法</h4>
      <p>• 举例论证：For example, / For instance, / Take ... as an example</p>
      <p>• 对比论证：On the one hand, ... On the other hand, ...</p>
      <p>• 因果论证：This is mainly because... / The reason is that...</p>
      
      <h4>四、注意事项</h4>
      <p>1. 观点要明确，不要模棱两可</p>
      <p>2. 论据要充分，要有具体例子</p>
      <p>3. 逻辑要清晰，使用连接词</p>
      <p>4. 语言要正式，避免口语化表达</p>
    `
  },
  {
    id: 3,
    icon: '✉️',
    title: '书信写作技巧',
    description: '掌握各类书信的格式和写作要点',
    content: `
      <h4>一、书信格式</h4>
      <p><strong>称呼：</strong>Dear ...,</p>
      <p><strong>正文：</strong>分段落书写</p>
      <p><strong>结尾：</strong>Yours sincerely, / Best regards,</p>
      <p><strong>署名：</strong>Li Ming</p>
      
      <h4>二、常见书信类型</h4>
      <p>• 建议信：Letter of Advice</p>
      <p>• 道歉信：Letter of Apology</p>
      <p>• 感谢信：Letter of Thanks</p>
      <p>• 投诉信：Letter of Complaint</p>
      
      <h4>三、常用表达</h4>
      <p>• 开头：I am writing to...</p>
      <p>• 建议：I would like to suggest that...</p>
      <p>• 道歉：I am sorry for...</p>
      <p>• 感谢：I am writing to express my gratitude for...</p>
      
      <h4>四、注意事项</h4>
      <p>1. 注意书信的正式程度</p>
      <p>2. 语气要礼貌得体</p>
      <p>3. 内容要完整，涵盖所有要点</p>
      <p>4. 字数控制在100-120词左右</p>
    `
  },
  {
    id: 4,
    icon: '📝',
    title: '考研英语作文评分标准',
    description: '了解评分标准，针对性提高写作水平',
    content: `
      <h4>一、评分维度</h4>
      <p><strong>内容完整性（Content）：</strong>是否涵盖所有要点</p>
      <p><strong>语言准确性（Language）：</strong>语法、词汇、拼写是否正确</p>
      <p><strong>逻辑连贯性（Coherence）：</strong>段落之间是否连贯</p>
      <p><strong>词汇丰富性（Vocabulary）：</strong>词汇是否多样、高级</p>
      
      <h4>二、高分要点</h4>
      <p>1. 使用复合句和复杂句</p>
      <p>2. 词汇要多样化，避免重复</p>
      <p>3. 使用恰当的连接词</p>
      <p>4. 避免语法错误</p>
      <p>5. 书写要工整</p>
      
      <h4>三、常见扣分点</h4>
      <p>• 语法错误（时态、主谓一致等）</p>
      <p>• 拼写错误</p>
      <p>• 内容不完整，遗漏要点</p>
      <p>• 逻辑混乱，缺乏连贯性</p>
      <p>• 词汇单一，重复使用</p>
      <p>• 字数不足或过多</p>
    `
  }
]

// 模板数据
const defaultTemplates = [
  {
    id: 1,
    type: 'chart',
    title: '图表作文通用模板',
    content: 'As is shown in the chart/graph, [描述图表主要内容]. According to the data, [具体数据或趋势]. It can be clearly seen that [总结主要发现]. In my opinion, [个人观点或建议]. This trend is likely to continue in the future.',
    usage: '适用于描述柱状图、折线图、饼图等数据变化趋势',
    showContent: false
  },
  {
    id: 2,
    type: 'topic',
    title: '话题论述通用模板',
    content: 'Nowadays, [话题] has become a widely discussed issue. Some people believe that [观点一], while others argue that [观点二]. From my perspective, I agree with the latter/former view. Firstly, [理由一]. Secondly, [理由二]. Therefore, [结论].',
    usage: '适用于讨论社会热点、争议话题等议论文',
    showContent: false
  },
  {
    id: 3,
    type: 'letter',
    title: '建议信模板',
    content: 'Dear [Name],\n\nI am writing to express my views on [话题]. I would like to suggest that [建议内容]. The reasons are as follows. Firstly, [理由一]. Secondly, [理由二]. I hope you will take my suggestions into consideration.\n\nYours sincerely,\nLi Ming',
    usage: '适用于给他人提出建议的正式书信',
    showContent: false
  }
]

const templates = ref<any[]>([])
const templateFilter = ref('')
const addTemplateVisible = ref(false)

const templateForm = ref({
  type: 'chart',
  title: '',
  content: '',
  usage: ''
})

// 高分句型数据
const phraseCategories = [
  {
    id: 1,
    icon: '🔝',
    title: '开头句型',
    phrases: [
      {
        id: 1,
        english: 'With the rapid development of ...',
        chinese: '随着...的快速发展',
        examples: ['With the rapid development of technology, our lives have changed dramatically.']
      },
      {
        id: 2,
        english: 'Nowadays, ... has become a hot topic.',
        chinese: '如今，...已成为热门话题',
        examples: ['Nowadays, environmental protection has become a hot topic.']
      },
      {
        id: 3,
        english: 'It is universally acknowledged that ...',
        chinese: '众所周知，...',
        examples: ['It is universally acknowledged that education is the key to success.']
      }
    ]
  },
  {
    id: 2,
    icon: '️',
    title: '过渡句型',
    phrases: [
      {
        id: 4,
        english: 'On the one hand, ... On the other hand, ...',
        chinese: '一方面...另一方面...',
        examples: ['On the one hand, technology brings convenience. On the other hand, it also causes problems.']
      },
      {
        id: 5,
        english: 'Furthermore, / Moreover, / In addition, ...',
        chinese: '此外，而且，另外...',
        examples: ['Furthermore, we should also consider the long-term effects.']
      },
      {
        id: 6,
        english: 'However, ...',
        chinese: '然而，...',
        examples: ['However, this approach may not work in all cases.']
      }
    ]
  },
  {
    id: 3,
    icon: '✅',
    title: '结论句型',
    phrases: [
      {
        id: 7,
        english: 'In conclusion, ...',
        chinese: '总之，...',
        examples: ['In conclusion, we should take action to protect the environment.']
      },
      {
        id: 8,
        english: 'To sum up, ...',
        chinese: '总而言之，...',
        examples: ['To sum up, education plays a vital role in personal development.']
      },
      {
        id: 9,
        english: 'Taking all these factors into consideration, ...',
        chinese: '综合考虑所有因素，...',
        examples: ['Taking all these factors into consideration, I believe that...']
      }
    ]
  },
  {
    id: 4,
    icon: '📈',
    title: '数据描述句型',
    phrases: [
      {
        id: 10,
        english: 'The number/percentage has increased/decreased significantly.',
        chinese: '数量/百分比显著增长/下降',
        examples: ['The number of college students has increased significantly in recent years.']
      },
      {
        id: 11,
        english: 'Compared with ..., ... is higher/lower.',
        chinese: '与...相比，...更高/更低',
        examples: ['Compared with 2010, the unemployment rate is lower.']
      },
      {
        id: 12,
        english: 'It accounts for ... percent of the total.',
        chinese: '它占总数的...百分比',
        examples: ['Renewable energy accounts for 25 percent of the total energy consumption.']
      }
    ]
  }
]

const guideDetailVisible = ref(false)
const selectedGuide = ref<any>(null)
const phraseDetailVisible = ref(false)
const selectedPhrase = ref<any>(null)

function getTypeLabel(type: string) {
  const labels: Record<string, string> = {
    chart: '图表作文',
    topic: '话题论述',
    letter: '书信'
  }
  return labels[type] || type
}

function showGuideDetail(guide: any) {
  selectedGuide.value = guide
  guideDetailVisible.value = true
}

function toggleTemplateContent(id: number) {
  const template = templates.value.find(t => t.id === id)
  if (template) {
    template.showContent = !template.showContent
  }
}

function showAddTemplateDialog() {
  templateForm.value = {
    type: 'chart',
    title: '',
    content: '',
    usage: ''
  }
  addTemplateVisible.value = true
}

function saveTemplate() {
  const newTemplate = {
    id: Date.now(),
    type: templateForm.value.type,
    title: templateForm.value.title,
    content: templateForm.value.content,
    usage: templateForm.value.usage,
    showContent: true
  }
  templates.value.unshift(newTemplate)
  localStorage.setItem('english-writing-templates', JSON.stringify(templates.value))
  addTemplateVisible.value = false
}

function deleteTemplate(id: number) {
  templates.value = templates.value.filter(t => t.id !== id)
  localStorage.setItem('english-writing-templates', JSON.stringify(templates.value))
}

function showPhraseDetail(phrase: any) {
  selectedPhrase.value = phrase
  phraseDetailVisible.value = true
}

const filteredTemplates = computed(() => {
  if (!templateFilter.value) return templates.value
  return templates.value.filter(t => t.type === templateFilter.value)
})

onMounted(() => {
  const saved = localStorage.getItem('english-writing-templates')
  if (saved) {
    templates.value = JSON.parse(saved)
  } else {
    templates.value = defaultTemplates
    localStorage.setItem('english-writing-templates', JSON.stringify(templates.value))
  }
})
</script>

<style scoped>
.writing-learning {
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h2 {
  font-size: 2em;
  color: #9C27B0;
  margin-bottom: 10px;
}

.page-header p {
  font-size: 1.1em;
  color: #666;
}

.tab-switcher {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  justify-content: center;
}

.tab-btn {
  padding: 12px 30px;
  border: 2px solid #9C27B0;
  background: white;
  color: #9C27B0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  background: #f3e5f5;
}

.tab-btn.active {
  background: #9C27B0;
  color: white;
}

.guide-section {
  margin-bottom: 30px;
}

.guide-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.guide-card {
  padding: 25px;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
}

.guide-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  border-color: #9C27B0;
}

.guide-icon {
  font-size: 2.5em;
  margin-bottom: 15px;
}

.guide-card h3 {
  font-size: 1.3em;
  color: #333;
  margin-bottom: 10px;
}

.guide-card p {
  color: #666;
  font-size: 0.95em;
  line-height: 1.5;
}

.guide-detail {
  padding: 10px;
}

.guide-content h4 {
  color: #9C27B0;
  margin: 20px 0 10px 0;
  font-size: 1.2em;
}

.guide-content p {
  color: #333;
  line-height: 1.8;
  margin: 8px 0;
}

.templates-section {
  margin-bottom: 30px;
}

.templates-toolbar {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  justify-content: space-between;
  align-items: center;
}

.templates-list {
  display: grid;
  gap: 15px;
}

.template-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.template-type {
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: 500;
}

.template-type.chart {
  background: #e3f2fd;
  color: #1976D2;
}

.template-type.topic {
  background: #f3e5f5;
  color: #7B1FA2;
}

.template-type.letter {
  background: #e8f5e9;
  color: #388E3C;
}

.template-actions {
  display: flex;
  gap: 8px;
}

.template-content {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.template-title {
  font-size: 1.2em;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.template-text {
  color: #666;
  line-height: 1.8;
  margin-bottom: 15px;
  white-space: pre-wrap;
}

.template-usage {
  padding: 15px;
  background: #fff3e0;
  border-radius: 8px;
  border-left: 3px solid #FF9800;
}

.template-usage p {
  margin-top: 8px;
  color: #666;
}

.phrases-section {
  margin-bottom: 30px;
}

.phrases-list {
  display: grid;
  gap: 30px;
}

.category-title {
  font-size: 1.4em;
  color: #9C27B0;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f3e5f5;
}

.phrases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.phrase-card {
  padding: 15px;
  background: #f8f9fa;
  border-left: 3px solid #9C27B0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.phrase-card:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.phrase-text {
  font-size: 1.05em;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.6;
}

.phrase-meaning {
  color: #666;
  font-size: 0.95em;
}

.phrase-detail {
  padding: 10px;
}

.detail-english,
.detail-chinese {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.detail-english strong,
.detail-chinese strong {
  color: #9C27B0;
}

.detail-examples h4 {
  color: #333;
  margin-bottom: 15px;
}

.example-item {
  padding: 12px;
  background: #f3e5f5;
  border-radius: 8px;
  margin-bottom: 10px;
}

.example-text {
  color: #333;
  line-height: 1.6;
}

.usage-tips {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 20px;
  background: #f3e5f5;
  border-radius: 10px;
  color: #7B1FA2;
  font-size: 0.95em;
}

@media (max-width: 768px) {
  .guide-list,
  .phrases-grid {
    grid-template-columns: 1fr;
  }
  
  .templates-toolbar {
    flex-direction: column;
  }
}
</style>
