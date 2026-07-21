<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import WrongProblemAnalysis from '@/components/WrongProblemAnalysis.vue'
import KnowledgeStructure from '@/components/KnowledgeStructure.vue'
import MathPracticeModule from '@/components/MathPracticeModule.vue'
import MathProgressTracker from '@/components/MathProgressTracker.vue'
import QuickCards from '@/components/QuickCards.vue'

const router = useRouter()
const activeTab = ref('knowledge')
</script>

<template>
  <div class="math-container">
    <div class="page-header">
      <h1 class="page-title">数学一学习系统</h1>
      <p class="page-subtitle">高等数学 · 线性代数 · 概率统计</p>
      <div class="navigation-links">
        <el-button type="primary" plain @click="router.push('/math')">
          <el-icon><House /></el-icon>
          返回数学一首页
        </el-button>
        <el-button type="success" plain @click="router.push('/')">
          <el-icon><HomeFilled /></el-icon>
          返回网站主页
        </el-button>
      </div>
    </div>

    <div class="tab-navigation">
      <el-tabs v-model="activeTab" class="math-tabs">
        <el-tab-pane label="知识点梳理" name="knowledge">
          <KnowledgeStructure subject="math" />
        </el-tab-pane>

        <el-tab-pane label="错题分析" name="wrong">
          <WrongProblemAnalysis />
        </el-tab-pane>

        <el-tab-pane label="专项练习" name="practice">
          <MathPracticeModule />
        </el-tab-pane>

        <el-tab-pane label="学习进度" name="progress">
          <MathProgressTracker />
        </el-tab-pane>

        <el-tab-pane label="📇 速查卡片" name="quickcards">
          <QuickCards />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.math-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.page-header {
  text-align: center;
  padding: 40px 0 30px;
  background: linear-gradient(150deg, #0d2137 0%, #16345c 60%, #1e4576 100%);
  color: white;
  border-radius: 20px 20px 0 0;
  margin-bottom: 30px;
}

.page-title {
  font-size: 2.5em;
  margin-bottom: 15px;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.page-subtitle {
  font-size: 1.3em;
  opacity: 0.9;
  font-weight: 400;
}

.navigation-links {
  margin-top: 20px;
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.tab-navigation {
  margin-bottom: 40px;
}

.math-tabs :deep(.el-tabs__header) {
  margin-bottom: 30px;
}

.math-tabs :deep(.el-tabs__nav-wrap)::after {
  display: none;
}

.math-tabs :deep(.el-tabs__item) {
  font-size: 1.15em;
  font-weight: 500;
  padding: 0 25px;
  height: 56px;
  line-height: 56px;
  color: #303133;
}

.math-tabs :deep(.el-tabs__item.is-active) {
  color: #16345c;
  font-weight: 700;
}

.math-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, #ffc53d, #f0a820);
  height: 3px;
  border-radius: 2px;
}

@media (max-width: 768px) {
  .math-container {
    padding: 0 12px;
  }

  .page-title {
    font-size: 1.8em;
  }

  .page-header {
    padding: 25px 0 15px;
    border-radius: 12px 12px 0 0;
  }

  .math-tabs :deep(.el-tabs__item) {
    padding: 0 12px;
    font-size: 0.95em;
  }
}
</style>
