<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
// 使用动态导入解决TypeScript默认导出识别问题
const CodeTraining = defineAsyncComponent(() => import('@/components/PlaceholderComponent.vue'))
const MindMap = defineAsyncComponent(() => import('@/components/PlaceholderComponent.vue'))
const KnowledgeStructure = defineAsyncComponent(() => import('@/components/KnowledgeStructure.vue'))
const CS408ProgressTracker = defineAsyncComponent(() => import('@/components/CS408ProgressTracker.vue'))

const activeTab = ref('progress')
</script>

<template>
  <div class="cs408-container">
    <div class="page-header">
      <h1 class="page-title">408计算机科学综合</h1>
      <p class="page-subtitle">数据结构 · 计算机组成原理 · 操作系统 · 计算机网络</p>
    </div>

    <div class="tab-navigation">
      <el-tabs v-model="activeTab" class="cs408-tabs">
        <el-tab-pane label="学习进度" name="progress">
          <CS408ProgressTracker />
        </el-tab-pane>
        
        <el-tab-pane label="知识点梳理" name="knowledge">
          <KnowledgeStructure subject="cs408" />
        </el-tab-pane>
        
        <el-tab-pane label="代码实战" name="code">
          <CodeTraining />
        </el-tab-pane>
        
        <el-tab-pane label="思维导图" name="mindmap">
          <MindMap />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.cs408-container {
  max-width: 3000px; /* 统一增加容器宽度 */
  margin: 0 auto;
  padding: 0px; /* 极致减少408页面页边距至1/4 */
}

.page-header {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 25px rgba(33, 150, 243, 0.15);
  border: 2px solid #2196F3;
  text-align: center;
}

.page-title {
  font-size: 2.2em;
  color: #1976D2;
  margin-bottom: 10px;
  font-weight: 700;
}

.page-subtitle {
  font-size: 1.2em;
  color: #424242;
  font-weight: 500;
}

.tab-navigation {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.cs408-tabs :deep(.el-tabs__header) {
  margin-bottom: 25px;
}

.cs408-tabs :deep(.el-tabs__nav-wrap)::after {
  display: none;
}

.cs408-tabs :deep(.el-tabs__item) {
  font-size: 1.1em;
  font-weight: 500;
  padding: 0 25px;
  height: 50px;
  line-height: 50px;
  color: #666;
}

.cs408-tabs :deep(.el-tabs__item.is-active) {
  color: #2196F3;
  font-weight: 600;
}

.cs408-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, #2196F3, #64B5F6);
  height: 3px;
  border-radius: 2px;
}

.knowledge-content {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.knowledge-illustration {
  margin-bottom: 25px;
}

.knowledge-content h3 {
  font-size: 1.8em;
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
}

.knowledge-content p {
  font-size: 1.1em;
  margin-bottom: 30px;
  color: #666;
  line-height: 1.6;
}

.knowledge-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.feature-card {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  text-align: left;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
  border-color: #2196F3;
}

.feature-card h4 {
  color: #333;
  margin: 0 0 8px 0;
  font-size: 1.1em;
  font-weight: 600;
}

.feature-card p {
  color: #666;
  margin: 0;
  font-size: 0.95em;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cs408-container {
    padding: 12px;
  }
  
  .page-title {
    font-size: 1.8em;
  }
  
  .page-subtitle {
    font-size: 1em;
  }
  
  .tab-navigation {
    padding: 15px;
  }
  
  .knowledge-features {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .feature-card {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .cs408-tabs :deep(.el-tabs__item) {
    padding: 0 12px;
    font-size: 0.9em;
  }
}
</style>