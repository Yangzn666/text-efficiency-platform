<template>
  <div class="ds-learning-page">
    <!-- 顶部面包屑和进度 -->
    <div class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <router-link to="/cs408">408计算机</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据结构</el-breadcrumb-item>
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
        <DSChapterNav />
      </div>
      
      <!-- 中间：思维导图 -->
      <div class="mindmap-panel">
        <MindMapView subject="datastructure" />
      </div>
      
      <!-- 右侧：知识点文档 -->
      <div class="knowledge-panel">
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
            <DSWrongProblems ref="wrongProblemsRef" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    
    <!-- 知识卡片 -->
    <KnowledgeCard ref="knowledgeCardRef" />
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, ref } from 'vue'
import { useDataStructureStore } from '@/stores/dataStructure'
import DSChapterNav from '@/components/DSChapterNav.vue'
import MindMapView from '@/components/MindMapView.vue'
import KnowledgeCard from '@/components/KnowledgeCard.vue'
import DSWrongProblems from '@/components/DSWrongProblems.vue'
import MarkdownIt from 'markdown-it'
import { ElMessage } from 'element-plus'

const dsStore = useDataStructureStore()

const currentChapter = computed(() => dsStore.currentChapter)
const currentSection = computed(() => dsStore.currentSection)
const overallProgress = computed(() => dsStore.overallProgress)

// 激活的面板：知识点 / 错题本
const activePanel = ref('knowledge')
const wrongProblemsRef = ref()

// 监听当前小节变化
watch(currentSection, (newSection) => {
  console.log('当前小节切换为:', newSection?.id, newSection?.title)
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
  
  // 线性表相关关键词
  const linearListKeywords = ['线性表', '顺序表', '链表', '单链表', '双链表']
  linearListKeywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'g')
    content = content.replace(regex, `<span class="knowledge-link" onclick="window.showKnowledgeCard('linearlist')">${keyword}</span>`)
  })
  
  // 栈和队列相关关键词
  const stackQueueKeywords = ['栈', '队列', '循环队列', '双端队列']
  stackQueueKeywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'g')
    content = content.replace(regex, `<span class="knowledge-link" onclick="window.showKnowledgeCard('stackqueue')">${keyword}</span>`)
  })
  
  // 树相关关键词
  const treeKeywords = ['二叉树', '哈夫曼树', '线索二叉树', '平衡二叉树']
  treeKeywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'g')
    content = content.replace(regex, `<span class="knowledge-link" onclick="window.showKnowledgeCard('tree')">${keyword}</span>`)
  })
  
  // 图相关关键词
  const graphKeywords = ['图', '邻接矩阵', '邻接表', '最小生成树', '最短路径']
  graphKeywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'g')
    content = content.replace(regex, `<span class="knowledge-link" onclick="window.showKnowledgeCard('graph')">${keyword}</span>`)
  })
  
  // 排序相关关键词
  const sortKeywords = ['快速排序', '归并排序', '堆排序', '冒泡排序']
  sortKeywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'g')
    content = content.replace(regex, `<span class="knowledge-link" onclick="window.showKnowledgeCard('sort')">${keyword}</span>`)
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
  return dsStore.studiedSections.has(currentSection.value.id)
})

function toggleCurrentSection() {
  if (currentSection.value) {
    dsStore.toggleSectionStudied(currentSection.value.id)
  }
}
</script>

<style scoped lang="scss">
.ds-learning-page {
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
    }
    
    .knowledge-panel {
      width: 45%;
      min-width: 400px;
      display: flex;
      flex-direction: column;
      background: #fff;
      border-left: 1px solid #e8e8e8;
      
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
            color: #16345c;
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
          color: #16345c;
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
          border-left: 4px solid #ffc53d;
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
            color: #409eff;
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
  .ds-learning-page {
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
  .ds-learning-page {
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
  .ds-learning-page {
    /* 页头进度条：窄屏下允许换行，进度条独占一行，避免横向溢出 */
    .page-header {
      padding: 12px 16px;

      .progress-info {
        flex-wrap: wrap;
        gap: 8px 12px;

        :deep(.el-progress) {
          width: 100% !important;
          margin-right: 0 !important;
        }
      }
    }

    .page-content {
      flex-direction: column;
      /* 桌面端靠 overflow:hidden 固定三栏；移动端改为可滚动，避免堆叠后知识点被裁切、滑不到 */
      overflow-y: auto;

      .mindmap-panel {
        height: 40vh;
        flex: none; /* 不再弹性扩张挤占下方知识点面板 */
        min-width: unset;

        /* 内部导图容器桌面端 min-height:500px，会超出 40vh 面板被裁掉，这里强制贴合面板 */
        :deep(.mindmap-container) {
          height: 100%;
          min-height: 0;
          max-height: none;
        }
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
