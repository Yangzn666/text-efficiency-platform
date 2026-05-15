<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
// 使用动态导入解决TypeScript默认导出识别问题
const ReadingPractice = defineAsyncComponent(() => import('@/components/ReadingPractice.vue'))
const VocabularySystem = defineAsyncComponent(() => import('@/components/VocabularyLearning.vue'))
const EnglishStudyPlan = defineAsyncComponent(() => import('@/components/EnglishStudyPlan.vue'))
const GrammarLearningCenter = defineAsyncComponent(() => import('@/components/GrammarLearningCenter.vue'))
const TranslationLearning = defineAsyncComponent(() => import('@/components/TranslationLearning.vue'))
const WritingLearning = defineAsyncComponent(() => import('@/components/WritingLearning.vue'))

const activeTab = ref('vocabulary')
</script>

<template>
  <div class="english-container">
    <div class="page-header">
      <h1 class="page-title">英语一学习系统</h1>
      <p class="page-subtitle">阅读理解 · 词汇记忆 · 写作训练 · 翻译练习</p>
    </div>

    <div class="tab-navigation">
      <el-tabs v-model="activeTab" class="english-tabs">
        <el-tab-pane label="真题阅读" name="reading">
          <ReadingPractice />
        </el-tab-pane>
        
        <el-tab-pane label="词汇系统" name="vocabulary">
          <VocabularySystem />
        </el-tab-pane>
        
        <el-tab-pane label="写作训练" name="writing">
          <WritingLearning />
        </el-tab-pane>
        
        <el-tab-pane label="翻译练习" name="translation">
          <TranslationLearning />
        </el-tab-pane>
        
        <el-tab-pane label="学习计划" name="studyPlan">
          <EnglishStudyPlan />
        </el-tab-pane>
        
        <el-tab-pane label="语法学习中心" name="grammarCenter">
          <GrammarLearningCenter />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.english-container {
  max-width: 3000px; /* 统一增加容器宽度 */
  margin: 0 auto;
  padding: 0px; /* 极致减少英语页面页边距至1/4 */
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
  margin-top: 10px;
}

.tab-navigation {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.english-tabs :deep(.el-tabs__header) {
  margin-bottom: 25px;
}

.english-tabs :deep(.el-tabs__nav-wrap)::after {
  display: none;
}

.english-tabs :deep(.el-tabs__item) {
  font-size: 1.1em;
  font-weight: 500;
  padding: 0 25px;
  height: 50px;
  line-height: 50px;
  color: #666;
}

.english-tabs :deep(.el-tabs__item.is-active) {
  color: #2196F3;
  font-weight: 600;
}

.english-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, #2196F3, #64B5F6);
  height: 3px;
  border-radius: 2px;
}

.writing-content, .translation-content {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.writing-illustration, .translation-illustration {
  margin-bottom: 25px;
}

.writing-content h3, .translation-content h3 {
  font-size: 1.8em;
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
}

.writing-content p, .translation-content p {
  font-size: 1.1em;
  margin-bottom: 30px;
  color: #666;
  line-height: 1.6;
}

.writing-features, .translation-features {
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
  .english-container {
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
  
  .writing-features, .translation-features {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .feature-card {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .english-tabs :deep(.el-tabs__item) {
    padding: 0 12px;
    font-size: 0.9em;
  }
}
</style>