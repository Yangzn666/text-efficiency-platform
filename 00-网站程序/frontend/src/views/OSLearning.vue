<template>
  <div class="os-learning-page">
    <!-- 顶部面包屑和进度 -->
    <div class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <router-link to="/cs408">408专业课</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>操作系统</el-breadcrumb-item>
      </el-breadcrumb>
      
      <div class="progress-info">
        <el-progress 
          :percentage="overallProgress" 
          :stroke-width="8"
          style="width: 200px; margin-right: 16px;"
        />
        <span class="progress-text">总进度: {{ overallProgress }}%</span>
        
        <el-divider direction="vertical" />
        
        <span v-if="currentChapter">
          当前: 第{{ currentChapter.number }}章 - {{ currentChapter.title }}
        </span>
      </div>
    </div>
    
    <!-- 主体内容区 -->
    <div class="page-content">
      <!-- 左侧：章节导航 -->
      <div class="nav-panel">
        <OSChapterNav />
      </div>
      
      <!-- 中间：思维导图 -->
      <div class="mindmap-panel">
        <OSMindMapView />
      </div>
      
      <!-- 右侧:知识点文档 -->
      <div class="knowledge-panel" :class="{ 'expanded': isKnowledgePanelExpanded }">
        <!-- 展开/收起按钮 -->
        <div class="panel-toggle-btn" @click="toggleKnowledgePanel" :title="isKnowledgePanelExpanded ? '收起面板' : '展开面板'">
          <el-icon :size="18">
            <DArrowLeft v-if="isKnowledgePanelExpanded" />
            <DArrowRight v-else />
          </el-icon>
        </div>
              
        <!-- 标签页切换 -->
        <el-tabs v-model="activePanel" class="knowledge-tabs">
          <el-tab-pane name="knowledge">
            <template #label>
              <span class="tab-label">知识点</span>
            </template>
            <div class="knowledge-header">
              <h3 v-if="currentSection">
                {{ currentSection.id }} {{ currentSection.title }}
              </h3>
              <el-space>
                <el-button 
                  size="small" 
                  :type="isCurrentSectionStudied ? 'primary' : 'default'"
                  @click="toggleCurrentSection"
                >
                  {{ isCurrentSectionStudied ? '已学习 ✓' : '标记为已学习' }}
                </el-button>
              </el-space>
            </div>
            
            <div class="knowledge-content markdown-body" v-html="renderedMarkdown"></div>
          </el-tab-pane>
          
          <el-tab-pane label="错题本" name="wrong-problems">
            <OSWrongProblems ref="wrongProblemsRef" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    
    <!-- 知识卡片 -->
    <KnowledgeCard ref="knowledgeCardRef" />
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, ref, nextTick } from 'vue'
import { useOperatingSystemStore } from '@/stores/operatingSystem'
import OSChapterNav from '@/components/OSChapterNav.vue'
import OSMindMapView from '@/components/OSMindMapView.vue'
import OSWrongProblems from '@/components/OSWrongProblems.vue'
import KnowledgeCard from '@/components/KnowledgeCard.vue'
import MarkdownIt from 'markdown-it'
import { DArrowLeft, DArrowRight } from '@element-plus/icons-vue'

const osStore = useOperatingSystemStore()

const currentChapter = computed(() => osStore.currentChapter)
const currentSection = computed(() => osStore.currentSection)
const overallProgress = computed(() => osStore.progress.percentage)

// 激活的面板
const activePanel = ref('knowledge')
const wrongProblemsRef = ref()
const knowledgeCardRef = ref()

// 右侧面板展开/收起状态
const isKnowledgePanelExpanded = ref(false)

// 切换右侧面板展开/收起
const toggleKnowledgePanel = () => {
  isKnowledgePanelExpanded.value = !isKnowledgePanelExpanded.value
}

// 监听当前小节变化
watch(currentSection, (newSection) => {
  console.log('当前小节切换为:', newSection?.id, newSection?.title)
  
  // 切换章节时,将滚动条重置到顶部
  nextTick(() => {
    // 方法1: 查找所有可能的滚动容器
    const scrollContainers = [
      '.knowledge-tabs .el-tabs__content',
      '.knowledge-panel .el-tab-pane',
      '.knowledge-content'
    ]
    
    scrollContainers.forEach(selector => {
      const container = document.querySelector(selector)
      if (container) {
        console.log('重置滚动条:', selector, container.scrollTop)
        container.scrollTop = 0
      }
    })
    
    // 方法2: 使用setTimeout再次尝试（确保DOM完全渲染）
    setTimeout(() => {
      scrollContainers.forEach(selector => {
        const container = document.querySelector(selector)
        if (container) {
          container.scrollTop = 0
          console.log('二次重置滚动条:', selector)
        }
      })
    }, 50)
    
    // 错题本区域滚动到顶部
    const wrongProblemsPanel = document.querySelector('.wrong-problems-container')
    if (wrongProblemsPanel) {
      wrongProblemsPanel.scrollTop = 0
    }
  })
})

// 扩展Markdown渲染器
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str: string, lang: string): string => {
    return `<pre class="code-block"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})

// 自定义标题渲染，添加绿色样式
const defaultH3Renderer = md.renderer.rules.heading_open
const defaultH4Renderer = md.renderer.rules.heading_open

md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  if (token.tag === 'h3' || token.tag === 'h4') {
    // 为h3和h4添加绿色样式类
    token.attrJoin('class', 'section-heading')
  }
  // 使用默认渲染器
  const defaultRenderer = token.tag === 'h3' ? defaultH3Renderer : defaultH4Renderer
  if (typeof defaultRenderer === 'function') {
    return defaultRenderer(tokens, idx, options, env, self)
  }
  return self.renderToken(tokens, idx, options)
}

const renderedMarkdown = computed(() => {
  if (!currentSection.value) {
    console.warn('currentSection为空')
    return '<div class="empty-tip">请选择一个小节查看知识点</div>'
  }
  
  console.log('渲染章节:', currentSection.value.id, '内容长度:', currentSection.value.content?.length || 0)
  
  try {
    let content = md.render(currentSection.value.content || '')
    
    console.log('Markdown渲染成功，HTML长度:', content.length)
    
    // 只在1.3节中显示特权指令相关链接
    if (currentSection.value.id === '1.3') {
      const privilegeKeywords = ['修改寄存器指令']
      privilegeKeywords.forEach(keyword => {
        const regex = new RegExp(keyword, 'g')
        content = content.replace(regex, `<span class="knowledge-link" onclick="window.showKnowledgeCard('privilegedInstruction')">${keyword}</span>`)
      })
    }
    
    return content
  } catch (error) {
    console.error('Markdown渲染失败:', error)
    return `<div class="empty-tip">渲染失败: ${error.message}</div>`
  }
})

// 在window对象上注册方法，供Markdown中的onclick调用
onMounted(() => {
  ;(window as any).showKnowledgeCard = (cardId: string) => {
    knowledgeCardRef.value?.show(cardId)
  }
})

const isCurrentSectionStudied = computed(() => {
  if (!currentSection.value) return false
  return osStore.isSectionStudied(currentSection.value.id)
})

const toggleCurrentSection = () => {
  if (currentSection.value) {
    osStore.toggleSectionStudied(currentSection.value.id)
  }
}

onMounted(() => {
  console.log('操作系统学习页面已加载')
})
</script>

<style scoped>
.os-learning-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.page-header {
  background: white;
  padding: 16px 24px;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.progress-info {
  display: flex;
  align-items: center;
  margin-top: 12px;
  font-size: 14px;
  color: #606266;
}

.progress-text {
  font-weight: 500;
}

.page-content {
  flex: 1;
  display: flex;
  gap: 16px;
  padding: 16px;
  overflow: hidden;
}

.nav-panel {
  width: 280px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow-y: auto;
}

.mindmap-panel {
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.knowledge-panel {
  width: 500px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: relative;
}

.knowledge-panel.expanded {
  width: 800px;
}

.panel-toggle-btn {
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background: #409eff;
  border-radius: 4px 0 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  z-index: 10;
  box-shadow: -2px 0 8px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
}

.panel-toggle-btn:hover {
  background: #66b1ff;
  width: 28px;
}

.knowledge-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止tabs组件本身溢出 */
}

.knowledge-tabs :deep(.el-tabs__header) {
  flex-shrink: 0; /* 头部不收缩 */
  display: flex;
  justify-content: center; /* 标签居中显示 */
}

.knowledge-tabs :deep(.el-tabs__nav) {
  display: flex;
  justify-content: center;
  width: 100%;
}

.knowledge-tabs :deep(.el-tabs__item) {
  font-size: 15px;
  font-weight: 500;
  color: #606266;
  height: 48px;
  line-height: 48px;
  padding: 0 20px;
  
  &.is-active {
    color: #409eff;
  }
}

/* 自定义标签样式，确保文字居中 */
.tab-label {
  display: inline-block;
  text-align: center;
  min-width: 60px;
}

.knowledge-tabs :deep(.el-tabs__content) {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px 40px 16px 60px; /* 进一步增加左边距，确保文字不被遮挡 */
  min-height: 0; /* 允许flex子项缩小 */
}

.knowledge-tabs :deep(.el-tab-pane) {
  height: 100%;
  overflow-y: auto; /* 确保tab-pane也可以滚动 */
}

.knowledge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e4e7ed;
}

.knowledge-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.knowledge-content {
  line-height: 1.8;
  color: #303133; /* 主文本颜色改为深色，提高可读性 */
  font-size: 15px; /* 稍微增大字号 */
  word-wrap: break-word; /* 长文本自动换行 */
  overflow-wrap: break-word; /* 兼容现代浏览器 */
}

/* 防止长文本溢出 */
.knowledge-content :deep(p),
.knowledge-content :deep(li),
.knowledge-content :deep(td) {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto; /* 自动断字 */
}

.knowledge-content :deep(h1),
.knowledge-content :deep(h2),
.knowledge-content :deep(h3),
.knowledge-content :deep(h4) {
  margin-top: 28px;
  margin-bottom: 14px;
  font-weight: 600;
}

.knowledge-content :deep(h1) {
  font-size: 26px;
  color: #667eea; /* 紫蓝色 */
  border-bottom: 3px solid #667eea;
  padding-bottom: 10px;
  margin-top: 32px;
  font-weight: 700;
}

.knowledge-content :deep(h2) {
  font-size: 22px;
  color: #409eff; /* 蓝色 */
  border-left: 5px solid #409eff;
  padding-left: 14px;
  font-weight: 700;
}

.knowledge-content :deep(h3) {
  font-size: 18px;
  color: #67c23a; /* 绿色 */
  font-weight: 600;
}

.knowledge-content :deep(h4) {
  font-size: 16px;
  color: #e6a23c; /* 橙色 */
  font-weight: 600;
}

.knowledge-content :deep(code) {
  background: #fff3cd;
  padding: 3px 8px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: #856404; /* 深黄色，更清晰 */
  font-size: 14px;
  border: 1px solid #ffeaa7;
}

.knowledge-content :deep(pre.code-block) {
  background: #282c34;
  color: #abb2bf;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  overflow-y: auto;
  margin: 16px 0;
  max-height: 500px; /* 限制最大高度 */
  font-size: 14px;
  line-height: 1.6;
}

.knowledge-content :deep(pre.code-block) code {
  background: transparent;
  padding: 0;
  color: inherit;
  border: none;
}

.knowledge-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
  font-size: 14px;
  table-layout: fixed; /* 固定表格布局，防止溢出 */
}

.knowledge-content :deep(th),
.knowledge-content :deep(td) {
  border: 1px solid #dcdfe6;
  padding: 10px 12px;
  text-align: left;
  word-wrap: break-word; /* 表格内容自动换行 */
  overflow-wrap: break-word;
}

.knowledge-content :deep(th) {
  background: #ecf5ff;
  color: #409eff;
  font-weight: 600;
}

.knowledge-content :deep(tr:nth-child(even)) {
  background: #f9fafb;
}

.knowledge-content :deep(tr:hover) {
  background: #ecf5ff;
}

/* 列表样式优化 */
.knowledge-content :deep(ul),
.knowledge-content :deep(ol) {
  padding-left: 24px;
  margin: 12px 0;
}

.knowledge-content :deep(li) {
  margin: 8px 0;
  line-height: 1.8;
}

/* 引用块样式 */
.knowledge-content :deep(blockquote) {
  border-left: 4px solid #409eff;
  background: #f5f7fa;
  padding: 12px 16px;
  margin: 16px 0;
  color: #606266;
}

/* 知识卡片链接样式 */
.knowledge-content :deep(.knowledge-link) {
  color: #409eff;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 3px;
  transition: all 0.2s;
  
  &:hover {
    color: #66b1ff;
    background: #ecf5ff;
    padding: 2px 4px;
    border-radius: 3px;
  }
}

/* 章节标题绿色样式 */
.knowledge-content :deep(.section-heading) {
  color: #67c23a !important;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 12px;
  
  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 1em;
    background: #67c23a;
    margin-right: 8px;
    vertical-align: middle;
    border-radius: 2px;
  }
}

/* 空提示样式 */
.knowledge-content :deep(.empty-tip) {
  text-align: center;
  color: #909399;
  padding: 40px 0;
  font-size: 16px;
}

/* 强调文本 */
.knowledge-content :deep(strong),
.knowledge-content :deep(b) {
  color: #1f2d3d;
  font-weight: 600;
}
</style>
