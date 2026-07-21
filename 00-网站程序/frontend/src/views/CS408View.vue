<script setup lang="ts">
import { ref } from 'vue'
// 使用同步导入避免GitHub Pages动态加载问题
import CodeTraining from '@/components/PlaceholderComponent.vue'
import MindMap from '@/components/PlaceholderComponent.vue'
import KnowledgeStructure from '@/components/KnowledgeStructure.vue'
import CS408ProgressTracker from '@/components/CS408ProgressTracker.vue'
import CS408QuickEntry from '@/components/CS408QuickEntry.vue'
import ReinforcementTracker from '@/components/ReinforcementTracker.vue'

const activeTab = ref('progress')
</script>

<template>
  <div class="cs408-container">
    <header class="page-hero">
      <div class="hero-grid"></div>
      <div class="hero-glow"></div>
      <div class="hero-inner">
        <span class="hero-kicker">CS408 · 计算机学科专业基础 · 目标110+</span>
        <h1 class="hero-title">408计算机<span class="gold">科学综合</span></h1>
        <p class="hero-sub">数据结构 · 计算机组成原理 · 操作系统 · 计算机网络</p>
      </div>
    </header>

    <div class="tab-navigation">
      <el-tabs v-model="activeTab" class="cs408-tabs">
        <el-tab-pane label="学习进度" name="progress">
          <CS408ProgressTracker />
        </el-tab-pane>

        <el-tab-pane label="🎯 强化进度" name="reinforcement">
          <ReinforcementTracker />
        </el-tab-pane>
        
        <el-tab-pane label="知识点梳理" name="knowledge">
          <div class="knowledge-section">
            <!-- 快速入口卡片 -->
            <CS408QuickEntry />
            
            <!-- 详细知识点结构 -->
            <KnowledgeStructure subject="cs408" />
          </div>
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
  --font-display: 'Barlow Condensed', 'FZCuHei', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --ink: #1f2d3d;
  --body: #303133;
  --muted: #5b6b7f;
  --gold: #ffc53d;
  --navy-deep: #0d2137;
  --navy: #16345c;
  --line: #e4ebf3;
  --bg-soft: #f5f8fc;
  --subject: #409EFF;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
}

/* 作战室页头 */
.page-hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(150deg, var(--navy-deep) 0%, var(--navy) 60%, #1e4576 100%);
  border-radius: 14px;
  padding: 38px 40px 32px;
  margin-bottom: 24px;
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
  background-size: 44px 44px;
  pointer-events: none;
}
.hero-glow {
  position: absolute;
  top: -70%;
  right: -8%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255,197,61,0.13) 0%, transparent 70%);
  pointer-events: none;
}
.hero-inner {
  position: relative;
  z-index: 1;
}
.hero-kicker {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  color: var(--gold);
  text-transform: uppercase;
}
.hero-title {
  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  font-weight: 800;
  color: #fff;
  margin: 8px 0 6px;
  letter-spacing: 0.02em;
}
.hero-title .gold {
  color: var(--gold);
}
.hero-sub {
  color: #a8bdd4;
  font-size: 0.95rem;
  letter-spacing: 0.06em;
}

/* 内容卡片 */
.tab-navigation {
  background: #fff;
  border-radius: 14px;
  padding: 24px 28px;
  border: 1px solid var(--line);
  box-shadow: 0 4px 20px rgba(13, 33, 55, 0.06);
}

/* 页签重制 */
.cs408-tabs :deep(.el-tabs__header) {
  margin-bottom: 22px;
}
.cs408-tabs :deep(.el-tabs__nav-wrap)::after {
  background: var(--line);
}
.cs408-tabs :deep(.el-tabs__item) {
  font-size: 1.02rem;
  font-weight: 500;
  padding: 0 22px;
  height: 46px;
  line-height: 46px;
  color: var(--muted);
  white-space: nowrap;
  transition: color 0.25s;
}
.cs408-tabs :deep(.el-tabs__item:hover) {
  color: var(--navy);
}
.cs408-tabs :deep(.el-tabs__item.is-active) {
  color: var(--navy);
  font-weight: 700;
}
.cs408-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, var(--gold), #f0a820);
  height: 3px;
  border-radius: 2px;
}

.knowledge-content {
  text-align: center;
  padding: 40px 20px;
  color: var(--muted);
}

.knowledge-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.knowledge-illustration {
  margin-bottom: 25px;
}

.knowledge-content h3 {
  font-size: 1.6rem;
  color: var(--ink);
  margin-bottom: 15px;
  font-weight: 700;
}

.knowledge-content p {
  font-size: 1.05rem;
  margin-bottom: 30px;
  color: var(--muted);
  line-height: 1.6;
}

.knowledge-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
  margin-bottom: 30px;
}

.feature-card {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  background: var(--bg-soft);
  border-radius: 10px;
  text-align: left;
  transition: all 0.25s ease;
  border: 1px solid var(--line);
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(13, 33, 55, 0.10);
  border-color: var(--subject);
  background: #fff;
}

.feature-card h4 {
  color: var(--ink);
  margin: 0 0 8px 0;
  font-size: 1.05rem;
  font-weight: 700;
}

.feature-card p {
  color: var(--muted);
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.5;
}

/* 响应式 */
@media (max-width: 768px) {
  .page-hero {
    padding: 26px 20px 22px;
    border-radius: 10px;
  }
  .tab-navigation {
    padding: 14px;
  }
  .knowledge-features {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .feature-card {
    flex-direction: column;
    text-align: center;
    gap: 12px;
    padding: 15px;
  }
  .cs408-tabs :deep(.el-tabs__item) {
    padding: 0 10px;
    font-size: 0.85rem;
    height: 42px;
    line-height: 42px;
  }
}

@media (max-width: 480px) {
  .page-hero {
    padding: 20px 16px 18px;
  }
  .tab-navigation {
    padding: 10px;
  }
  .cs408-tabs :deep(.el-tabs__header) {
    margin-bottom: 14px;
  }
  .cs408-tabs :deep(.el-tabs__item) {
    padding: 0 8px;
    font-size: 0.8rem;
    height: 38px;
    line-height: 38px;
  }
  .knowledge-content {
    padding: 20px 10px;
  }
  .knowledge-content h3 {
    font-size: 1.3rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .feature-card {
    transition: none;
  }
}
</style>