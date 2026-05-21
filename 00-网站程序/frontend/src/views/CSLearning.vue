<template>
  <div class="cs-learning-page">
    <!-- 顶部面包屑和进度 -->
    <div class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <router-link to="/cs408">408专业课</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>计算机组成原理</el-breadcrumb-item>
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
        
        <el-divider direction="vertical" />
        
        <el-button 
          type="primary" 
          size="small"
          icon="Link"
          @click="openVisualIndex"
        >
          408可视化学习
        </el-button>
      </div>
    </div>
    
    <!-- 主体内容区 -->
    <div class="page-content">
      <!-- 左侧：章节导航 -->
      <div class="nav-panel">
        <CompositionChapterNav />
      </div>
      
      <!-- 中间：思维导图 -->
      <div class="mindmap-panel">
        <MindMapView subject="composition" />
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
          <el-tab-pane label="知识点" name="knowledge">
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
            <CSWrongProblems ref="wrongProblemsRef" />
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
import { useCompositionStore } from '@/stores/composition'
import CompositionChapterNav from '@/components/CompositionChapterNav.vue'
import MindMapView from '@/components/MindMapView.vue'
import KnowledgeCard from '@/components/KnowledgeCard.vue'
import CSWrongProblems from '@/components/CSWrongProblems.vue'
import MarkdownIt from 'markdown-it'
import { ElMessage } from 'element-plus'
import { ArrowLeft, ArrowRight, DArrowLeft, DArrowRight } from '@element-plus/icons-vue'

const compositionStore = useCompositionStore()

const currentChapter = computed(() => compositionStore.currentChapter)
const currentSection = computed(() => compositionStore.currentSection)
const overallProgress = computed(() => compositionStore.overallProgress)

// 激活的面板:知识点 / 错题本
const activePanel = ref('knowledge')
const wrongProblemsRef = ref()

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
    // 知识点内容区域滚动到顶部
    const knowledgeContent = document.querySelector('.knowledge-content')
    if (knowledgeContent) {
      knowledgeContent.scrollTop = 0
    }
    
    // 错题本区域滚动到顶部
    const wrongProblemsPanel = document.querySelector('.wrong-problems-panel')
    if (wrongProblemsPanel) {
      wrongProblemsPanel.scrollTop = 0
    }
  })
})

// 知识卡片引用
const knowledgeCardRef = ref()

// 扩展Markdown渲染器，添加点击事件
const highlightCode = (str: string, _lang: string): string => {
  const mdTemp = new MarkdownIt()
  return `<pre class="code-block"><code>${mdTemp.utils.escapeHtml(str)}</code></pre>`
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: highlightCode
})

// 渲染Markdown，并为关键词添加点击事件
const renderedMarkdown = computed(() => {
  if (!currentSection.value) {
    return '<p class="empty-tip">请选择一个知识点开始学习</p>'
  }
  
  let content = md.render(currentSection.value.content)
  
  // 汇编语言相关关键词
  const assemblyKeywords = ['汇编语言', '机器语言', '汇编器', '助记符', '二进制代码']
  assemblyKeywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'g')
    content = content.replace(regex, `<span class="knowledge-link" onclick="window.showKnowledgeCard('assembly')">${keyword}</span>`)
  })
  
  // 晶体管相关关键词
  const transistorKeywords = ['晶体管', '电子管', '半导体']
  transistorKeywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'g')
    content = content.replace(regex, `<span class="knowledge-link" onclick="window.showKnowledgeCard('transistor')">${keyword}</span>`)
  })
  
  // 集成电路相关关键词
  const icKeywords = ['集成电路', '芯片', '摩尔定律']
  icKeywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'g')
    content = content.replace(regex, `<span class="knowledge-link" onclick="window.showKnowledgeCard('ic')">${keyword}</span>`)
  })
  
  // 存储器相关关键词
  const storageKeywords = ['存储器', '内存', '主存', 'Cache', '缓存', '虚拟存储器']
  storageKeywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'g')
    content = content.replace(regex, `<span class="knowledge-link" onclick="window.showKnowledgeCard('storage')">${keyword}</span>`)
  })
  
  // 编译器相关关键词
  const compilerKeywords = ['编译器', '解释器', '字节码', '机器码', 'JIT']
  compilerKeywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'g')
    content = content.replace(regex, `<span class="knowledge-link" onclick="window.showKnowledgeCard('compiler')">${keyword}</span>`)
  })
  
  return content
})

// 在window对象上注册方法，供Markdown中的onclick调用
onMounted(() => {
  ;(window as any).showKnowledgeCard = (cardId: string) => {
    knowledgeCardRef.value?.show(cardId)
  }
})

const isCurrentSectionStudied = computed(() => {
  if (!currentSection.value) return false
  return compositionStore.studiedSections.has(currentSection.value.id)
})

function toggleCurrentSection() {
  if (currentSection.value) {
    compositionStore.toggleSectionStudied(currentSection.value.id)
  }
}

// 打开408可视化学习网站
const openVisualIndex = () => {
  window.open('https://www.codebrick.tech/visual-index.html', '_blank')
}
</script>

<style scoped lang="scss">
.cs-learning-page {
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  
  .page-header {
    padding: 16px 24px;
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    .ant-breadcrumb {
      margin-bottom: 12px;
    }
    
    .progress-info {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #595959;
      
      .progress-text {
        white-space: nowrap;
      }
    }
  }
  
  .page-content {
    flex: 1;
    display: flex;
    overflow: hidden;
    
    .nav-panel {
      width: 280px;
      min-width: 280px;
      overflow-y: auto;
      background: #fff;
    }
    
    .mindmap-panel {
      flex: 1;
      min-width: 400px;
      overflow: hidden;
      transition: flex 0.3s ease;
      
      .cs-learning-page .knowledge-panel.expanded & {
        flex: 0.3;
        min-width: 200px;
      }
    }
    
    .knowledge-panel {
      width: 45%;
      min-width: 400px;
      max-width: 600px;
      display: flex;
      flex-direction: column;
      background: #fff;
      border-left: 1px solid #e8e8e8;
      position: relative;
      transition: all 0.3s ease;
      
      &.expanded {
        width: 65%;
        max-width: 900px;
        min-width: 600px;
      }
      
      .panel-toggle-btn {
        position: absolute;
        left: -16px;
        top: 50%;
        transform: translateY(-50%);
        width: 16px;
        height: 48px;
        background: linear-gradient(to right, #f0f5ff, #fff);
        border: 1px solid #d9d9d9;
        border-right: none;
        border-radius: 6px 0 0 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #1890ff;
        transition: all 0.3s;
        z-index: 10;
        box-shadow: -2px 0 6px rgba(0, 0, 0, 0.08);
        
        &:hover {
          background: linear-gradient(to right, #1890ff, #40a9ff);
          color: #fff;
          border-color: #1890ff;
          width: 20px;
          left: -20px;
          box-shadow: -3px 0 8px rgba(24, 144, 255, 0.3);
        }
      }
      
      .knowledge-tabs {
        height: 100%;
        display: flex;
        flex-direction: column;
        
        :deep(.el-tabs__header) {
          margin: 0;
          padding: 0 20px;
          border-bottom: 1px solid #e8e8e8;
        }
        
        :deep(.el-tabs__nav-wrap::after) {
          display: none;
        }
        
        :deep(.el-tabs__item) {
          font-size: 15px;
          font-weight: 500;
          color: #606266;
          height: 48px;
          line-height: 48px;
          
          &.is-active {
            color: #1890ff;
          }
        }
        
        :deep(.el-tabs__content) {
          flex: 1;
          overflow-y: auto;
          padding: 0;
        }
        
        :deep(.el-tab-pane) {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
      }
      
      .knowledge-header {
        padding: 16px 20px;
        border-bottom: 1px solid #e8e8e8;
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #262626;
        }
      }
      
      .knowledge-content {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        
        .empty-tip {
          text-align: center;
          color: #8c8c8c;
          font-size: 14px;
          margin-top: 100px;
        }
        
        :deep(h2) {
          font-size: 20px;
          color: #1890ff;
          border-bottom: 2px solid #e8e8e8;
          padding-bottom: 8px;
          margin-top: 24px;
          
          &:first-child {
            margin-top: 0;
          }
        }
        
        :deep(h3) {
          font-size: 17px;
          color: #262626;
          margin-top: 20px;
        }
        
        :deep(h4) {
          font-size: 15px;
          color: #595959;
          margin-top: 16px;
        }
        
        :deep(p) {
          line-height: 1.8;
          color: #262626;
          margin: 12px 0;
          font-size: 15px;
        }
        
        :deep(ul), :deep(ol) {
          padding-left: 24px;
          line-height: 1.8;
          color: #262626;
          font-size: 15px;
        }
        
        :deep(li) {
          margin: 6px 0;
        }
        
        :deep(strong) {
          color: #262626;
          font-weight: 600;
        }
        
        :deep(code) {
          background: #f5f5f5;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: 13px;
          color: #c41d7f;
        }
        
        :deep(pre) {
          background: #f5f5f5;
          padding: 16px;
          border-radius: 4px;
          overflow-x: auto;
          
          code {
            background: none;
            padding: 0;
            color: #262626;
          }
        }
        
        :deep(.code-block) {
          background: #282c34;
          color: #abb2bf;
          padding: 16px;
          border-radius: 4px;
          overflow-x: auto;
          
          code {
            color: inherit;
          }
        }
        
        :deep(blockquote) {
          border-left: 4px solid #1890ff;
          padding-left: 16px;
          margin: 16px 0;
          color: #595959;
          background: #f0f5ff;
          padding: 12px 16px;
          border-radius: 0 4px 4px 0;
        }
        
        :deep(table) {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
          
          th, td {
            border: 1px solid #e8e8e8;
            padding: 8px 12px;
            text-align: left;
          }
          
          th {
            background: #fafafa;
            font-weight: 600;
          }
          
          tr:nth-child(even) {
            background: #fafafa;
          }
        }
        
        // 知识链接样式
        :deep(.knowledge-link) {
          color: #409eff;
          cursor: pointer;
          text-decoration: underline;
          font-weight: 600;
          transition: all 0.3s;
          
          &:hover {
            color: #66b1ff;
            background: #ecf5ff;
            padding: 2px 4px;
            border-radius: 3px;
          }
        }
      }
    }
  }
}

// 响应式布局
@media (max-width: 1400px) {
  .cs-learning-page {
    .page-content {
      .nav-panel {
        width: 240px;
        min-width: 240px;
      }
      
      .knowledge-panel {
        width: 40%;
        min-width: 350px;
      }
    }
  }
}

@media (max-width: 1200px) {
  .cs-learning-page {
    .page-content {
      .nav-panel {
        display: none;
      }
      
      .mindmap-panel {
        min-width: 300px;
      }
      
      .knowledge-panel {
        width: 50%;
        min-width: 300px;
      }
    }
  }
}

@media (max-width: 768px) {
  .cs-learning-page {
    .page-content {
      flex-direction: column;
      
      .mindmap-panel {
        height: 40vh;
        min-width: unset;
      }
      
      .knowledge-panel {
        width: 100%;
        min-width: unset;
        border-left: none;
        border-top: 1px solid #e8e8e8;
      }
    }
  }
}
</style>
