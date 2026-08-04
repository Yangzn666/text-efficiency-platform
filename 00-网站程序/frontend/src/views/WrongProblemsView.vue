<script setup lang="ts">
import { ref } from 'vue'
import WrongProblemsDashboard from '@/components/WrongProblemsDashboard.vue'
import MathWrongProblems from '@/components/MathWrongProblems.vue'
import EnglishWrongProblems from '@/components/EnglishWrongProblems.vue'
import PoliticsWrongProblems from '@/components/PoliticsWrongProblems.vue'
import CSWrongProblems from '@/components/CSWrongProblems.vue'
import DSWrongProblems from '@/components/DSWrongProblems.vue'
import OSWrongProblems from '@/components/OSWrongProblems.vue'
import NetworkWrongProblems from '@/components/NetworkWrongProblems.vue'

const activeSubject = ref('math')
const active408 = ref('ds')
</script>

<template>
  <div class="wrong-problems-page">
    <div class="page-header">
      <div class="header-decoration"></div>
      <h1 class="page-title">全科错题本</h1>
      <p class="page-subtitle">按科目记录、复习和掌握每一道错题</p>
    </div>
    
    <div class="page-content">
      <!-- Dashboard -->
      <WrongProblemsDashboard />

      <!-- 一级：考研科目 -->
      <el-tabs v-model="activeSubject" class="subject-tabs">
        <el-tab-pane label="数学一" name="math">
          <MathWrongProblems />
        </el-tab-pane>
        <el-tab-pane label="英语一" name="english">
          <EnglishWrongProblems />
        </el-tab-pane>
        <el-tab-pane label="政治" name="politics">
          <PoliticsWrongProblems />
        </el-tab-pane>
        <el-tab-pane label="408计算机" name="cs408">
          <!-- 二级：408四门 -->
          <el-tabs v-model="active408" class="sub-tabs">
            <el-tab-pane label="数据结构" name="ds">
              <DSWrongProblems />
            </el-tab-pane>
            <el-tab-pane label="计组" name="cs">
              <CSWrongProblems />
            </el-tab-pane>
            <el-tab-pane label="操作系统" name="os">
              <OSWrongProblems />
            </el-tab-pane>
            <el-tab-pane label="计算机网络" name="network">
              <NetworkWrongProblems />
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrong-problems-page {
  --ink: #1a2332;
  --body: #2c3e50;
  --gold: #d4a012;
  --gold-light: #f0c040;
  --gold-glow: rgba(212, 160, 18, 0.12);
  --navy-deep: #0a1628;
  --navy: #16345c;
  --navy-light: #1e4576;
  --line: #dce3ed;
  --bg-soft: #f4f7fb;
  --paper: #faf8f4;
  --cream: #f5f0e6;

  max-width: 1520px;
  margin: 0 auto;
  padding: 0 16px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(10, 22, 40, 0.12);
  overflow: hidden;
  font-family: 'FZCuHei', '方正粗黑_GBK', 'Microsoft YaHei', sans-serif;
  font-weight: 400;
  color: var(--body);

  .page-header {
    position: relative;
    text-align: center;
    padding: 36px 24px 28px;
    background: linear-gradient(150deg, var(--navy-deep) 0%, var(--navy) 55%, var(--navy-light) 100%);
    color: white;
    border-radius: 20px 20px 0 0;
    overflow: hidden;

    .header-decoration {
      position: absolute;
      inset: 0;
      background:
        repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 24px,
          rgba(255, 255, 255, 0.015) 24px,
          rgba(255, 255, 255, 0.015) 48px
        );
      pointer-events: none;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, transparent 0%, var(--gold) 25%, var(--gold-light) 50%, var(--gold) 75%, transparent 100%);
      }
    }

    .page-title {
      font-family: 'FZCuHei', '方正粗黑_GBK', 'Microsoft YaHei', serif;
      font-size: 2.2em;
      margin: 0 0 12px;
      font-weight: 400;
      text-shadow: 2px 3px 6px rgba(0, 0, 0, 0.35);
      color: #fff;
      letter-spacing: 0.06em;
      position: relative;
    }

    .page-subtitle {
      font-size: 1.1em;
      opacity: 0.82;
      font-weight: 400;
      letter-spacing: 0.1em;
      margin: 0;
    }
  }
  
  .page-content {
    padding: 24px 24px 40px;
  }
  
  .subject-tabs {
    margin-top: 28px;

    :deep(.el-tabs__header) {
      margin-bottom: 20px;
    }
    
    :deep(.el-tabs__content) {
      padding: 0;
    }
  }
  
  .sub-tabs {
    :deep(.el-tabs__header) {
      margin-bottom: 16px;
      
      .el-tabs__item {
        font-size: 0.95em;
      }
    }
    
    :deep(.el-tabs__content) {
      padding: 0;
    }
  }
}
</style>
