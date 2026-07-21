<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
// 使用动态导入解决TypeScript默认导出识别问题
const CurrentAffairs = defineAsyncComponent(() => import('@/components/PlaceholderComponent.vue'))
const PoliticalPoints = defineAsyncComponent(() => import('@/components/PlaceholderComponent.vue'))
const KnowledgeStructure = defineAsyncComponent(() => import('@/components/KnowledgeStructure.vue'))

const activeTab = ref('knowledge')
</script>

<template>
  <div class="politics-container">
    <header class="page-hero">
      <div class="hero-grid"></div>
      <div class="hero-glow"></div>
      <div class="hero-inner">
        <span class="hero-kicker">POLITICS · 政治 · 目标70+</span>
        <h1 class="hero-title">政治<span class="gold">学习系统</span></h1>
        <p class="hero-sub">时政热点 · 考点梳理 · 知识关联 · 模拟练习</p>
      </div>
    </header>

    <div class="tab-navigation">
      <el-tabs v-model="activeTab" class="politics-tabs">
        <el-tab-pane label="知识点梳理" name="knowledge">
          <KnowledgeStructure subject="politics" />
        </el-tab-pane>
        
        <el-tab-pane label="时政热点" name="affairs">
          <CurrentAffairs />
        </el-tab-pane>
        
        <el-tab-pane label="考点关联" name="points">
          <PoliticalPoints />
        </el-tab-pane>
        
        <el-tab-pane label="知识结构" name="structure">
          <div class="structure-content">
            <div class="structure-illustration">
              <el-icon size="80" color="#ffc53d"><Connection /></el-icon>
            </div>
            <h3>🧠 知识结构可视化</h3>
            <p>构建政治知识体系，理清概念间的关系</p>
            
            <div class="structure-features">
              <div class="feature-card">
                <el-icon size="24" color="#FF6B6B"><DataAnalysis /></el-icon>
                <div>
                  <h4>知识图谱构建</h4>
                  <p>可视化展示知识点之间的逻辑关系</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#4CAF50"><Cpu /></el-icon>
                <div>
                  <h4>智能关联分析</h4>
                  <p>自动识别和建立知识点间的联系</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#FF9800"><Lightning /></el-icon>
                <div>
                  <h4>学习路径优化</h4>
                  <p>基于知识结构推荐最优学习顺序</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#9C27B0"><Collection /></el-icon>
                <div>
                  <h4>记忆强化系统</h4>
                  <p>通过结构化学习加深理解和记忆</p>
                </div>
              </div>
            </div>
            
            <el-button type="primary" size="large" @click="activeTab = 'knowledge'">
              <el-icon><Collection /></el-icon>
              前往知识点梳理
            </el-button>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="模拟练习" name="practice">
          <div class="practice-content">
            <div class="practice-illustration">
              <el-icon size="80" color="#FF9800"><EditPen /></el-icon>
            </div>
            <h3>📝 模拟试题练习</h3>
            <p>海量政治模拟题，在线练习和智能批改</p>
            
            <div class="practice-features">
              <div class="feature-card">
                <el-icon size="24" color="#FF6B6B"><Document /></el-icon>
                <div>
                  <h4>全题型覆盖</h4>
                  <p>单选、多选、简答、论述题全面练习</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#4CAF50"><DataLine /></el-icon>
                <div>
                  <h4>智能评分系统</h4>
                  <p>AI辅助批改和详细答案解析</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#ffc53d"><TrendCharts /></el-icon>
                <div>
                  <h4>成绩统计分析</h4>
                  <p>练习成绩趋势和薄弱环节分析</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#9C27B0"><MagicStaff /></el-icon>
                <div>
                  <h4>错题巩固训练</h4>
                  <p>针对性错题练习和知识点强化</p>
                </div>
              </div>
            </div>
            
            <el-button type="primary" size="large" @click="activeTab = 'knowledge'">
              <el-icon><Collection /></el-icon>
              前往知识点梳理
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.politics-container {
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
  --subject: #F56C6C;
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
.politics-tabs :deep(.el-tabs__header) {
  margin-bottom: 22px;
}
.politics-tabs :deep(.el-tabs__nav-wrap)::after {
  background: var(--line);
}
.politics-tabs :deep(.el-tabs__item) {
  font-size: 1.02rem;
  font-weight: 500;
  padding: 0 22px;
  height: 46px;
  line-height: 46px;
  color: var(--muted);
  transition: color 0.25s;
}
.politics-tabs :deep(.el-tabs__item:hover) {
  color: var(--navy);
}
.politics-tabs :deep(.el-tabs__item.is-active) {
  color: var(--navy);
  font-weight: 700;
}
.politics-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, var(--gold), #f0a820);
  height: 3px;
  border-radius: 2px;
}

.structure-content, .practice-content {
  text-align: center;
  padding: 40px 20px;
  color: var(--muted);
}

.structure-illustration, .practice-illustration {
  margin-bottom: 25px;
}

.structure-content h3, .practice-content h3 {
  font-size: 1.6rem;
  color: var(--ink);
  margin-bottom: 15px;
  font-weight: 700;
}

.structure-content p, .practice-content p {
  font-size: 1.05rem;
  margin-bottom: 30px;
  color: var(--muted);
  line-height: 1.6;
}

.structure-features, .practice-features {
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
  .structure-features, .practice-features {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .feature-card {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  .politics-tabs :deep(.el-tabs__item) {
    padding: 0 12px;
    font-size: 0.9rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .feature-card {
    transition: none;
  }
}
</style>
