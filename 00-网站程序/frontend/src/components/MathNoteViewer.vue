<template>
  <div class="math-note-viewer">
    <!-- 左侧章节导航 -->
    <div class="note-sidebar">
      <div class="sidebar-header">
        <h3>{{ subject }}</h3>
        <p class="chapter-name">强化阶段完整框架</p>
      </div>
      
      <div class="chapter-list">
        <div 
          v-for="(chapter, index) in chapters" 
          :key="chapter.id"
          class="chapter-group"
        >
          <!-- 主章节 -->
          <div 
            class="chapter-item main-chapter"
            :class="{ active: currentChapter?.id === chapter.id }"
            @click="selectChapter(chapter)"
          >
            <span class="chapter-number">{{ index + 1 }}</span>
            <div class="chapter-info">
              <span class="chapter-title">{{ chapter.chapter }}</span>
              <span class="chapter-hours">{{ chapter.hours }}学时</span>
            </div>
          </div>
          
          <!-- 子章节 -->
          <div v-if="chapter.children && chapter.children.length > 0" class="sub-chapters">
            <div 
              v-for="(sub, subIndex) in chapter.children"
              :key="sub.id"
              class="chapter-item sub-chapter"
              :class="{ active: currentChapter?.id === sub.id }"
              @click="selectChapter(sub)"
            >
              <span class="chapter-number">{{ index + 1 }}.{{ subIndex + 1 }}</span>
              <div class="chapter-info">
                <span class="chapter-title">{{ sub.chapter }}</span>
                <span class="chapter-hours">{{ sub.hours }}学时</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧笔记内容 -->
    <div class="note-content-area">
      <div v-if="currentChapter" class="content-wrapper">
        <div class="content-header">
          <h2>{{ currentChapter.chapter }}</h2>
          <div class="content-actions">
            <el-button type="primary" @click="openLocalNote">
              <el-icon><Document /></el-icon>
              打开本地文件
            </el-button>
            <el-button @click="exportCurrentNote">
              <el-icon><Download /></el-icon>
              导出笔记
            </el-button>
          </div>
        </div>
        
        <!-- 元信息条 -->
        <div class="meta-info">
          <span class="meta-item">课程：武忠祥高等数学强化班</span>
          <span class="meta-divider">|</span>
          <span class="meta-item">学时：{{ currentChapter.hours }}学时</span>
          <span class="meta-divider">|</span>
          <span class="meta-item">更新：{{ currentChapter.updateTime }}</span>
        </div>
        
        <!-- 章节笔记内容 -->
        <div class="chapter-content">
          <!-- 思维导图 -->
          <div v-if="currentChapter.mindMap" class="mindmap-section">
            <div class="mindmap-header">
              <h3>🧠 知识思维导图</h3>
            </div>
            <div id="mermaid-mindmap" class="mermaid-mindmap-container"></div>
          </div>
          
          <!-- 笔记内容 -->
          <div class="note-body" v-html="renderNoteContent(currentChapter.content || '')"></div>
          
          <!-- 题型总结（如果有） -->
          <div v-if="currentChapter.problemTypes && currentChapter.problemTypes.length > 0" class="problem-types-section">
            <div class="section-header">
              <h3>📝 常见题型与解法</h3>
            </div>
            <div v-for="(ptype, idx) in currentChapter.problemTypes" :key="idx" class="problem-type-card">
              <div class="ptype-header">
                <span class="ptype-number">{{ idx + 1 }}</span>
                <h4>{{ ptype.name }}</h4>
              </div>
              <div class="ptype-content">
                <div class="ptype-methods">
                  <strong>可用方法：</strong>
                  <ul>
                    <li v-for="(method, mIdx) in ptype.methods" :key="mIdx">{{ method }}</li>
                  </ul>
                </div>
                <div class="ptype-strategy">
                  <strong>选择策略：</strong>
                  <p>{{ ptype.strategy }}</p>
                </div>
                <div class="ptype-example">
                  <strong>典型例题：</strong>
                  <div v-html="renderNoteContent(ptype.example)"></div>
                </div>
                <div class="ptype-warnings">
                  <strong>⚠️ 易错警示：</strong>
                  <ul>
                    <li v-for="(warning, wIdx) in ptype.warnings" :key="wIdx" class="warning-item">{{ warning }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="local-file-info">
          <el-alert
            title="本地笔记文件"
            type="info"
            :closable="false"
            show-icon
          >
            <template #default>
              完整笔记保存在：<br/>
              <code>D:\学习\效率\01-数学一\03-个人笔记\高等数学强化\</code><br/>
              请根据章节创建对应的Markdown文件
            </template>
          </el-alert>
        </div>
      </div>
      
      <el-empty v-else description="请选择一个章节查看笔记" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, Download } from '@element-plus/icons-vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import type Mermaid from 'mermaid'

const mermaidModule = ref<typeof Mermaid | null>(null)

// 初始化mermaid
const initMermaid = async () => {
  if (!mermaidModule.value) {
    const module = await import('mermaid')
    mermaidModule.value = module.default
    module.default.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose'
    })
  }
  return mermaidModule.value
}

// 渲染Mermaid思维导图
const renderMermaidMindMap = async () => {
  if (!currentChapter.value?.mindMap || !mermaidModule.value) return
  
  const mermaidContainer = document.getElementById('mermaid-mindmap')
  if (!mermaidContainer) return
  
  try {
    mermaidContainer.innerHTML = ''
    const id = `math-mindmap-${Date.now()}`
    const { svg } = await mermaidModule.value.render(id, currentChapter.value.mindMap)
    mermaidContainer.innerHTML = svg
    
    // 放大1.5倍
    await nextTick()
    const svgElement = mermaidContainer.querySelector('svg')
    if (svgElement) {
      svgElement.style.transform = 'scale(1.5)'
      svgElement.style.transformOrigin = 'center center'
      svgElement.style.display = 'block'
      svgElement.style.margin = '0 auto'
    }
  } catch (e) {
    console.error('思维导图渲染失败:', e)
  }
}

const props = defineProps<{
  subject?: string
}>()

const subject = ref(props.subject || '高等数学')

// 强化阶段完整章节结构
interface SubChapter {
  id: string
  chapter: string
  hours: number
  content: string
  problemTypes?: ProblemType[]  // 题型总结
  updateTime: string
}

interface ProblemType {
  name: string              // 题型名称
  methods: string[]         // 可用方法
  strategy: string          // 选择策略
  example: string           // 典型例题
  warnings: string[]        // 易错警示
}

interface Chapter {
  id: string
  chapter: string
  hours: number
  content: string
  updateTime: string
  mindMap?: string
  problemTypes?: ProblemType[]  // 题型总结
  children?: SubChapter[]
}

const chapters = ref<Chapter[]>([
  {
    id: 'ch1',
    chapter: '第一章 函数 极限 连续',
    hours: 10,
    updateTime: new Date().toLocaleDateString('zh-CN'),
    mindMap: `mindmap
  root((第一章 函数 极限 连续))
    1.1 函数
      函数概念
        定义域和对应法则
        复合函数
        反函数
        初等函数
      函数性态
        单调性
        奇偶性
        周期性
        有界性
    1.2 极限
      数列极限
        定义与性质
        夹逼准则
        单调有界准则
      函数极限
        定义与左右极限
        无穷小与无穷大
        等价无穷小
      重要极限
        sinx除以x的极限
        e的定义极限
    1.3 连续
      连续的定义
        点连续
        区间连续
      间断点
        第一类间断点
        第二类间断点
      连续函数性质
        最值定理
        介值定理
        零点定理`,
    content: `
> 请点击左侧子章节查看具体笔记内容
`,
    children: [
      {
        id: 'ch1-1',
        chapter: '1.1 函数',
        hours: 4,
        updateTime: new Date().toLocaleDateString('zh-CN'),
        content: `
## 知识框架

**函数的两个基本要素**
- **定义域 D**：自变量 x 的取值范围
- **对应法则 f**：x 与 y 的对应关系
- **核心结论**：两个函数相同 ⇔ 定义域相同 且 对应法则相同

**复合函数**
- **定义**：$y = f[g(x)]$
- **关键条件**：**内层函数的值域 ⊆ 外层函数的定义域**
- **分解方法**：从外到内逐层分解

**反函数**
- **存在条件**：函数必须**严格单调**(一一对应)
- **求法**：解出 $x = f^{-1}(y)$ → 交换 x, y
- **性质**：图像关于 $y = x$ 对称，单调性相同

---

## 函数性态

**单调性判定**
- **导数法**(最常用)：
  - $f'(x) > 0 \\Rightarrow$ 单调递增
  - $f'(x) < 0 \\Rightarrow$ 单调递减
- **重要结论**：$f'(x_0) > 0$ 不能推出在邻域内严格单调（见易错警示）

**奇偶性判定** ⭐
- **步骤**：
  1. **先看定义域**：必须关于原点对称！
  2. 计算 $f(-x)$
  3. 比较 $f(-x)$ 与 $f(x)$、$-f(x)$
- **常见函数**：
  - 奇：$\\sin x, \\tan x, x, x^3, \\arcsin x, \\arctan x$
  - 偶：$\\cos x, x^2, |x|, \\arccos x$
- **性质**：
  - 奇×奇=偶，偶×偶=偶，奇×偶=奇
  - 奇函数的原函数是偶函数
  - 偶函数的原函数不一定是奇函数
`,
        problemTypes: [
          {
            name: '定义域求解',
            methods: ['直接解不等式', '复合函数从内到外', '分式分母≠0', '根号下≥0', '对数真数>0'],
            strategy: '先找所有限制条件，再取交集。注意复合函数中“内层值域⊆外层定义域”',
            example: '已知 $f(x+1)$ 的定义域为 $[0,a]$，求 $f(x)$ 的定义域\n\n解：$0 \\leq x+1 \\leq a \\Rightarrow -1 \\leq x \\leq a-1$\n这里的 x 是 f 的自变量，所以 $f(x)$ 定义域为 $[1, a+1]$',
            warnings: [
              '混淆“f(x+1)的定义域”和“f(x)的定义域”',
              '忘记分母不能为0、根号下非负、对数真数大于0等基本条件',
              '复合函数忘记检查内层值域是否在外层定义域内'
            ]
          },
          {
            name: '奇偶性判断',
            methods: ['定义法f(-x)', '图像对称性', '运算性质'],
            strategy: '第一步必看定义域是否关于原点对称！不对称直接非奇非偶',
            example: '判断 $f(x) = \\ln(x + \\sqrt{1+x^2})$ 的奇偶性\n\n解：定义域为 R，关于原点对称\n$f(-x) = \\ln(-x + \\sqrt{1+x^2}) = \\ln\\frac{1}{x+\\sqrt{1+x^2}} = -\\ln(x+\\sqrt{1+x^2}) = -f(x)$\n故为奇函数',
            warnings: [
              '忽略定义域对称性检查',
              '计算f(-x)时符号错误',
              '误认为“奇+偶”仍是奇或偶（实际是非奇非偶）'
            ]
          },
          {
            name: '单调性证明',
            methods: ['定义法作差', '导数法f\'(x)符号', '复合函数单调性'],
            strategy: '优先用导数法。注意f\'(x₀)>0不能推出邻域内单调，需f\'(x)在区间内恒正/恒负',
            example: `证明：若f'(x)>0在(a,b)内恒成立，则f(x)在(a,b)内严格递增

证：任取x₁<x₂∈(a,b)，由拉格朗日中值定理
$f(x_2)-f(x_1) = f'(\\xi)(x_2-x_1)$，其中ξ∈(x₁,x₂)
因f'(ξ)>0，x₂-x₁>0，故f(x₂)>f(x₁)`,
            warnings: [
              '误认为f\'(x₀)>0就能推出在x₀附近单调（反例：f(x)=x+2x²sin(1/x)）',
              '导数为0的点未单独讨论（如f(x)=x³在x=0处）',
              '分段函数忘记检查分段点处的单调性'
            ]
          }
        ]
      },
      {
        id: 'ch1-2',
        chapter: '1.2 极限',
        hours: 4,
        updateTime: new Date().toLocaleDateString('zh-CN'),
        content: `
> 本章笔记待补充...
`,
      },
      {
        id: 'ch1-3',
        chapter: '1.3 连续',
        hours: 2,
        updateTime: new Date().toLocaleDateString('zh-CN'),
        content: `
> 本章笔记待补充...
`,
      }
    ]
  },
  {
    id: 'ch2',
    chapter: '第二章 一元函数微分学',
    hours: 8,
    updateTime: new Date().toLocaleDateString('zh-CN'),
    content: `
## 本章内容概要

> 本章笔记待补充...

### 1. 导数与微分
- 待补充

### 2. 求导法则
- 待补充

### 3. 中值定理
- 待补充

### 4. 导数的应用
- 待补充
`
  },
  {
    id: 'ch3',
    chapter: '第三章 一元函数积分学',
    hours: 8,
    updateTime: new Date().toLocaleDateString('zh-CN'),
    content: `
## 本章内容概要

> 本章笔记待补充...

### 1. 不定积分
- 待补充

### 2. 定积分
- 待补充

### 3. 积分的应用
- 待补充
`
  },
  {
    id: 'ch4',
    chapter: '第四章 常微分方程',
    hours: 2,
    updateTime: new Date().toLocaleDateString('zh-CN'),
    content: `
## 本章内容概要

> 本章笔记待补充...
`
  },
  {
    id: 'ch5',
    chapter: '第五章 多元函数微分学',
    hours: 5,
    updateTime: new Date().toLocaleDateString('zh-CN'),
    content: `
## 本章内容概要

> 本章笔记待补充...
`
  },
  {
    id: 'ch6',
    chapter: '第六章 二重积分',
    hours: 3,
    updateTime: new Date().toLocaleDateString('zh-CN'),
    content: `
## 本章内容概要

> 本章笔记待补充...
`
  },
  {
    id: 'ch7',
    chapter: '第七章 无穷级数',
    hours: 5,
    updateTime: new Date().toLocaleDateString('zh-CN'),
    content: `
## 本章内容概要

> 本章笔记待补充...
`
  },
  {
    id: 'ch8',
    chapter: '第八章 空间解析几何及其应用',
    hours: 1,
    updateTime: new Date().toLocaleDateString('zh-CN'),
    content: `
## 本章内容概要

> 本章笔记待补充...
`
  },
  {
    id: 'ch9',
    chapter: '第九章 多元积分学及其应用',
    hours: 4,
    updateTime: new Date().toLocaleDateString('zh-CN'),
    content: `
## 本章内容概要

> 本章笔记待补充...
`
  }
])

const currentChapter = ref<Chapter | null>(null)

// 选择章节
const selectChapter = (chapter: Chapter | SubChapter) => {
  currentChapter.value = chapter as any
  
  // 如果是主章节且有思维导图，渲染Mermaid
  if ('mindMap' in chapter && chapter.mindMap) {
    nextTick(() => {
      renderMermaidMindMap()
    })
  }
}

// 打开本地笔记文件
const openLocalNote = () => {
  if (!currentChapter.value) return
  
  const notePath = `D:\\学习\\效率\\01-数学一\\03-个人笔记\\高等数学强化\\${currentChapter.value.chapter.replace(/\s+/g, '-')}.md`
  const fileUrl = 'file:///' + notePath.replace(/\\/g, '/')
  window.open(fileUrl, '_blank')
  ElMessage.info('如果浏览器阻止打开，请手动打开文件：' + notePath)
}

// 导出当前笔记
const exportCurrentNote = () => {
  if (!currentChapter.value) return
  
  const content = currentChapter.value.content
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${currentChapter.value.chapter.replace(/\s+/g, '-')}.md`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  ElMessage.success('笔记已导出')
}

// 渲染笔记内容（支持LaTeX）
const renderNoteContent = (content: string) => {
  if (!content) return ''
  
  let html = content
    
  // 处理块级公式 $$...$$
  html = html.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
    try {
      return katex.renderToString(formula.trim(), { displayMode: true, throwOnError: false })
    } catch (e) {
      return match
    }
  })
  
  // 处理行内公式 $...$
  html = html.replace(/\$([^$\n]+?)\$/g, (match, formula) => {
    try {
      return katex.renderToString(formula.trim(), { displayMode: false, throwOnError: false })
    } catch (e) {
      return match
    }
  })
  
  // 处理Markdown
  html = html
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$1. $2</li>')
    .replace(/---/g, '<hr>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
  
  return '<p>' + html + '</p>'
}

// 默认选中第一章
onMounted(async () => {
  await initMermaid()
  
  if (chapters.value.length > 0) {
    currentChapter.value = chapters.value[0] as any
    
    // 渲染第一章的思维导图
    if (chapters.value[0].mindMap) {
      nextTick(() => {
        renderMermaidMindMap()
      })
    }
  }
})
</script>

<style scoped>
.math-note-viewer {
  display: flex;
  height: calc(100vh - 200px);
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* 左侧章节导航 */
.note-sidebar {
  width: 320px;
  background: linear-gradient(180deg, #f8f9fa 0%, #f0f2f5 100%);
  border-right: 2px solid #e8ecf1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 2px solid #e8ecf1;
}

.sidebar-header h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #1a1a1a;
  font-weight: 700;
}

.chapter-name {
  margin: 0;
  font-size: 13px;
  color: #666;
}

.chapter-list {
  padding: 12px;
}

.chapter-group {
  margin-bottom: 8px;
}

.chapter-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  margin-bottom: 8px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

/* 子章节缩进 */
.sub-chapters {
  padding-left: 16px;
}

.sub-chapter {
  padding: 10px 12px;
  margin-bottom: 4px;
  font-size: 13px;
}

.chapter-item:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.chapter-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.chapter-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.chapter-item:hover .chapter-number,
.chapter-item.active .chapter-number {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.chapter-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chapter-title {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
}

.chapter-hours {
  font-size: 12px;
  color: #999;
}

.chapter-item:hover .chapter-hours,
.chapter-item.active .chapter-hours {
  color: rgba(255, 255, 255, 0.8);
}

/* 右侧内容区 */
.note-content-area {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  background: white;
}

.content-wrapper {
  max-width: 900px;
  margin: 0 auto;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.content-header h2 {
  margin: 0;
  font-size: 24px;
  color: #1a1a1a;
  font-weight: 700;
}

.content-actions {
  display: flex;
  gap: 12px;
}

/* 元信息条 - 现代化 */
.meta-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  margin-bottom: 32px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  font-size: 14px;
  color: #5a6c7d;
  border: 1px solid #e8ecf1;
}

.meta-item {
  font-weight: 600;
  color: #2c3e50;
}

/* 思维导图区域 - 现代化卡片 */
.mindmap-section {
  margin-bottom: 40px;
  padding: 32px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  border: 1px solid #e8ecf1;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.08);
}

.mindmap-header {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
}

.mindmap-header h3 {
  margin: 0;
  font-size: 22px;
  color: #1a1a1a;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.mermaid-mindmap-container {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 450px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e8ecf1;
}

.mermaid-mindmap-container :deep(svg) {
  max-width: 100%;
  height: auto;
}

.meta-divider {
  color: #ccc;
}

.chapter-content {
  min-height: 400px;
}

/* 笔记正文样式 - 方正粗黑字体排版 */
.note-body {
  font-size: 15px;
  line-height: 2.2;
  color: #1a1a1a;
  font-family: 'FZCuHei', 'FZCuHei-B08', 'FZCuHeiS-R-GB', '方正粗黑', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-weight: 400;
  letter-spacing: 0.3px;
}

/* 标题样式 - 方正粗黑，不加粗 */
.note-body :deep(h1) {
  font-size: 28px;
  color: #111;
  margin: 48px 0 24px 0;
  font-weight: 400;
  letter-spacing: 1px;
  position: relative;
  padding-bottom: 16px;
  line-height: 1.4;
}

.note-body :deep(h1)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 48px;
  height: 3px;
  background: #333;
}

.note-body :deep(h2) {
  font-size: 20px;
  color: #222;
  margin: 36px 0 16px 0;
  font-weight: 400;
  letter-spacing: 0.5px;
  line-height: 1.5;
  padding-left: 12px;
  border-left: 2px solid #666;
}

.note-body :deep(h3) {
  font-size: 16px;
  color: #333;
  margin: 24px 0 12px 0;
  font-weight: 400;
  letter-spacing: 0.3px;
  line-height: 1.6;
}

/* 强调文本 - 不加粗，用颜色区分 */
.note-body :deep(strong) {
  color: #000;
  font-weight: 400;
  background: rgba(0, 0, 0, 0.04);
  padding: 1px 4px;
}

/* 引用块 - 简约风格 */
.note-body :deep(blockquote) {
  border: none;
  padding: 16px 20px;
  margin: 20px 0;
  background: #fafafa;
  border-left: 2px solid #999;
  color: #333;
  font-size: 14px;
  line-height: 2;
}

/* 分隔线 - 简约 */
.note-body :deep(hr) {
  border: none;
  height: 1px;
  background: #ddd;
  margin: 32px 0;
}

/* 列表样式 - 简约 */
.note-body :deep(ul),
.note-body :deep(ol) {
  padding-left: 20px;
  margin: 12px 0;
}

.note-body :deep(li) {
  margin: 6px 0;
  padding-left: 4px;
  line-height: 2;
}

.note-body :deep(ul li)::marker {
  color: #666;
}

.note-body :deep(ol li)::marker {
  color: #666;
  font-weight: 400;
}

/* 段落间距 */
.note-body :deep(p) {
  margin: 10px 0;
  text-align: justify;
}

/* KaTeX公式样式 */
.note-body :deep(.katex) {
  font-size: 1em !important;
}

.note-body :deep(.katex-display) {
  margin: 24px 0 !important;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 16px 20px;
  background: #fafafa;
  border-left: 2px solid #999;
}

/* 代码块样式 - 简约 */
.note-body :deep(pre) {
  background: #1a1a1a;
  color: #e0e0e0;
  padding: 16px 20px;
  overflow-x: auto;
  margin: 20px 0;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.8;
}

.note-body :deep(code) {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  background: #f0f0f0;
  color: #333;
  padding: 1px 4px;
  font-size: 0.9em;
}

.note-body :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
  font-size: inherit;
}

/* 表格样式 - 简约 */
.note-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.note-body :deep(th) {
  background: #f5f5f5;
  color: #111;
  padding: 12px 16px;
  text-align: left;
  font-weight: 400;
  font-size: 14px;
  border-bottom: 2px solid #333;
}

.note-body :deep(td) {
  padding: 10px 16px;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
  color: #222;
}

.note-body :deep(tr:last-child td) {
  border-bottom: none;
}

/* 链接样式 - 简约 */
.note-body :deep(a) {
  color: #333;
  text-decoration: underline;
  text-decoration-color: #999;
  text-underline-offset: 2px;
  font-weight: 400;
}

.note-body :deep(a:hover) {
  color: #000;
  text-decoration-color: #000;
}

/* 题型总结区域 */
.problem-types-section {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 2px solid #eee;
}

.section-header h3 {
  font-size: 22px;
  color: #111;
  margin: 0 0 24px 0;
  font-weight: 400;
  letter-spacing: 0.5px;
}

.problem-type-card {
  background: #fafafa;
  border-left: 3px solid #666;
  padding: 20px 24px;
  margin-bottom: 20px;
  border-radius: 0;
}

.ptype-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.ptype-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: #333;
  color: white;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 400;
  margin-right: 12px;
}

.ptype-header h4 {
  font-size: 18px;
  color: #111;
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.3px;
}

.ptype-content {
  padding-left: 40px;
}

.ptype-methods,
.ptype-strategy,
.ptype-example,
.ptype-warnings {
  margin-bottom: 16px;
}

.ptype-methods strong,
.ptype-strategy strong,
.ptype-example strong,
.ptype-warnings strong {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 400;
  font-size: 15px;
}

.ptype-methods ul,
.ptype-warnings ul {
  padding-left: 20px;
  margin: 8px 0;
}

.ptype-methods li,
.ptype-warnings li {
  margin: 6px 0;
  line-height: 1.8;
  color: #444;
}

.warning-item {
  color: #c00;
  position: relative;
  padding-left: 4px;
}

.warning-item::before {
  content: '•';
  color: #c00;
  margin-right: 8px;
}

.ptype-strategy p {
  margin: 0;
  line-height: 1.8;
  color: #444;
}

/* 图片样式 */
.note-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 16px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.local-file-info {
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #e8ecf1;
}

/* 响应式 */
@media (max-width: 768px) {
  .math-note-viewer {
    flex-direction: column;
    height: auto;
  }
  
  .note-sidebar {
    width: 100%;
    max-height: 300px;
  }
  
  .note-content-area {
    padding: 20px;
  }
}
</style>
