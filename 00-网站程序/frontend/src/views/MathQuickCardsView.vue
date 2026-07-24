<script setup lang="ts">
import { useRouter } from 'vue-router'
import QuickCards from '@/components/QuickCards.vue'
import MathReinforcementNav from '@/components/MathReinforcementNav.vue'

const router = useRouter()
</script>

<template>
  <div class="math-container">
    <MathReinforcementNav />
    <div class="page-header">
      <h1 class="page-title">数学一速查卡片</h1>
      <p class="page-subtitle">公式定理 · 翻面自测 · 快速过筛</p>
      <div class="navigation-links">
        <el-button type="primary" plain @click="router.push('/math')">
          <el-icon><House /></el-icon>
          返回数学一首页
        </el-button>
      </div>
    </div>

    <div class="cards-body">
      <QuickCards />
    </div>
  </div>
</template>

<style scoped>
.math-container {
  max-width: 1520px;
  margin: 0 auto;
  padding: 0 16px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  font-family: 'FZCuHei', '方正粗黑_GBK', 'Microsoft YaHei', sans-serif;
  font-weight: 400;
}

.page-header {
  text-align: center;
  padding: 24px 0 18px;
  background: linear-gradient(150deg, #0d2137 0%, #16345c 60%, #1e4576 100%);
  color: white;
  border-radius: 20px 20px 0 0;
  margin-bottom: 18px;
}

.page-title {
  font-size: 2.2em;
  margin-bottom: 12px;
  font-weight: 400;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  color: #fff;
}

.page-title::after {
  content: none;
}

.page-subtitle {
  font-size: 1.2em;
  opacity: 0.9;
  font-weight: 400;
}

.navigation-links {
  margin-top: 16px;
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.cards-body {
  padding: 0 4px 40px;
}

@media (max-width: 768px) {
  .math-container {
    padding: 0 12px;
  }

  .page-title {
    font-size: 1.7em;
  }

  .page-header {
    padding: 20px 0 14px;
    border-radius: 12px 12px 0 0;
  }
}
</style>
