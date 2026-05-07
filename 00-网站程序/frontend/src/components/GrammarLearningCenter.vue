<template>
  <div class="grammar-learning-center">
    <div class="center-header">
      <h2 class="center-title">🎓 语法学习中心</h2>
      <p class="center-subtitle">AI辅助 · 诊断评估 · 学习计划 · 进度追踪</p>
    </div>

    <!-- 内部标签页 -->
    <el-tabs v-model="activeSubTab" type="border-card" class="grammar-tabs">
      <!-- AI语法助手 -->
      <el-tab-pane label="AI语法助手" name="aiAssistant">
        <AIGrammarAssistant />
      </el-tab-pane>

      <!-- 语法诊断报告 -->
      <el-tab-pane label="语法诊断" name="diagnosis">
        <GrammarDiagnosis />
      </el-tab-pane>

      <!-- 语法学习计划 -->
      <el-tab-pane label="学习计划" name="learningPlan">
        <GrammarLearningPlan />
      </el-tab-pane>

      <!-- 学习情况报告 -->
      <el-tab-pane label="学习报告" name="progressReport">
        <StudyProgressReport />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'

const AIGrammarAssistant = defineAsyncComponent(() => import('@/components/AIGrammarAssistant.vue'))
const GrammarDiagnosis = defineAsyncComponent(() => import('@/components/GrammarDiagnosis.vue'))
const GrammarLearningPlan = defineAsyncComponent(() => import('@/components/GrammarLearningPlan.vue'))
const StudyProgressReport = defineAsyncComponent(() => import('@/components/StudyProgressReport.vue'))

const activeSubTab = ref('aiAssistant')
</script>

<style scoped>
.grammar-learning-center {
  max-width: 100%;
}

.center-header {
  text-align: center;
  margin-bottom: 25px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.center-title {
  font-size: 2em;
  margin: 0 0 8px 0;
  font-weight: 700;
}

.center-subtitle {
  margin: 0;
  font-size: 1.1em;
  opacity: 0.95;
}

.grammar-tabs {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

/* 调整内部标签页样式 */
.grammar-tabs :deep(.el-tabs__header) {
  margin-bottom: 20px;
}

.grammar-tabs :deep(.el-tabs__item) {
  font-size: 1.05em;
  padding: 0 25px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .center-header {
    padding: 15px;
  }
  
  .center-title {
    font-size: 1.6em;
  }
  
  .center-subtitle {
    font-size: 0.95em;
  }
  
  .grammar-tabs {
    padding: 15px;
  }
  
  .grammar-tabs :deep(.el-tabs__item) {
    padding: 0 15px;
    font-size: 0.95em;
  }
}
</style>
