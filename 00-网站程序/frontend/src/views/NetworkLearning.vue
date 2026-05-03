<template>
  <div class="network-learning-page">
    <!-- 顶部面包屑和进度 -->
    <div class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <router-link to="/cs408">408专业课</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>计算机网络</el-breadcrumb-item>
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
        <NetworkChapterNav />
      </div>
      
      <!-- 中间：思维导图 -->
      <div class="mindmap-panel">
        <MindMapView />
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
            <NetworkWrongProblems ref="wrongProblemsRef" />
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
import { useNetworkStore } from '@/stores/network'
import NetworkChapterNav from '@/components/NetworkChapterNav.vue'
import MindMapView from '@/components/MindMapView.vue'
import KnowledgeCard from '@/components/KnowledgeCard.vue'
import NetworkWrongProblems from '@/components/NetworkWrongProblems.vue'
import MarkdownIt from 'markdown-it'
import { ElMessage } from 'element-plus'

const networkStore = useNetworkStore()

const currentChapter = computed(() => networkStore.currentChapter)
const currentSection = computed(() => networkStore.currentSection)
const overallProgress = computed(() => networkStore.overallProgress)

// 激活的面板：知识点 / 错题本
const activePanel = ref('knowledge')
const wrongProblemsRef = ref()

// 监听当前小节变化
watch(currentSection, (newSection) => {
  console.log('当前小节切换为:', newSection?.id, newSection?.title)
})

// 知识卡片引用
const knowledgeCardRef = ref()

// 判断当前小节是否已学习
const isCurrentSectionStudied = computed(() => {
  if (!currentSection.value) return false
  return networkStore.isSectionStudied(currentSection.value.id)
})

// 渲染Markdown内容
const renderedMarkdown = computed(() => {
  if (!currentSection.value || !currentSection.value.content) {
    return '<p class="empty-tip">暂无内容</p>'
  }
  
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
  })
  
  // 添加自定义样式类
  return md.render(currentSection.value.content)
})

// 切换当前小节的学习状态
const toggleCurrentSection = () => {
  if (!currentSection.value) return
  
  networkStore.toggleSectionStudied(currentSection.value.id)
  
  const studied = networkStore.isSectionStudied(currentSection.value.id)
  ElMessage.success(studied ? '已标记为学习完成！' : '已取消学习标记')
}

// 组件挂载时设置默认思维导图
onMounted(() => {
  console.log('网络学习页面已加载')
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.network-learning-page {
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  
  .page-header {
    padding: 16px 24px;
    background: white;
    border-bottom: 1px solid #e4e7ed;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    
    .el-breadcrumb {
      margin-bottom: 12px;
      font-size: 14px;
    }
    
    .progress-info {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #606266;
      
      .progress-text {
        font-weight: 500;
        color: $primary-color;
      }
    }
  }
  
  .page-content {
    flex: 1;
    display: flex;
    gap: 16px;
    padding: 16px 24px;
    overflow: hidden;
    
    // 左侧导航面板
    .nav-panel {
      width: 250px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      flex-shrink: 0;
    }
    
    // 中间思维导图面板
    .mindmap-panel {
      min-width: 300px;
      flex: 1;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }
    
    // 右侧知识点面板
    .knowledge-panel {
      width: 45%;
      min-width: 400px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      
      .knowledge-tabs {
        height: 100%;
        display: flex;
        flex-direction: column;
        
        :deep(.el-tabs__content) {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          
          // 美化滚动条
          &::-webkit-scrollbar {
            width: 6px;
          }
          
          &::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
          }
          
          &::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
            
            &:hover {
              background: #a8a8a8;
            }
          }
        }
      }
      
      .knowledge-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 12px;
        border-bottom: 2px solid #e4e7ed;
        
        h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #303133;
        }
      }
      
      .knowledge-content {
        line-height: 1.8;
        color: #606266;
        font-size: 14px;
        
        :deep(h2) {
          font-size: 20px;
          color: #303133;
          margin-top: 24px;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e4e7ed;
        }
        
        :deep(h3) {
          font-size: 17px;
          color: #303133;
          margin-top: 20px;
          margin-bottom: 10px;
        }
        
        :deep(h4) {
          font-size: 15px;
          color: #606266;
          margin-top: 16px;
          margin-bottom: 8px;
        }
        
        :deep(p) {
          margin: 8px 0;
        }
        
        :deep(ul), :deep(ol) {
          padding-left: 24px;
          margin: 8px 0;
        }
        
        :deep(li) {
          margin: 4px 0;
        }
        
        :deep(table) {
          width: 100%;
          border-collapse: collapse;
          margin: 12px 0;
          
          th, td {
            border: 1px solid #dcdfe6;
            padding: 8px 12px;
            text-align: left;
          }
          
          th {
            background: #f5f7fa;
            font-weight: 600;
          }
          
          tr:nth-child(even) {
            background: #fafafa;
          }
        }
        
        :deep(code) {
          background: #f5f7fa;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: 13px;
          color: #e83e8c;
        }
        
        :deep(pre) {
          background: #282c34;
          color: #abb2bf;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 12px 0;
          
          code {
            background: transparent;
            color: inherit;
            padding: 0;
          }
        }
        
        :deep(blockquote) {
          border-left: 4px solid $primary-color;
          padding: 12px 16px;
          margin: 12px 0;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 4px;
        }
        
        .empty-tip {
          text-align: center;
          color: #909399;
          padding: 40px 0;
          font-size: 14px;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 1400px) {
  .network-learning-page {
    .page-content {
      .knowledge-panel {
        width: 40%;
        min-width: 350px;
      }
    }
  }
}

@media (max-width: 1200px) {
  .network-learning-page {
    .page-content {
      flex-direction: column;
      
      .nav-panel {
        width: 100%;
        max-height: 200px;
      }
      
      .mindmap-panel {
        min-height: 300px;
      }
      
      .knowledge-panel {
        width: 100%;
        min-width: unset;
        min-height: 400px;
      }
    }
  }
}
</style>
