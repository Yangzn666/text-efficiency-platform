<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// 使用同步导入避免GitHub Pages动态加载问题
import CodeTraining from '@/components/PlaceholderComponent.vue'
import CS408SpineMap from '@/components/CS408SpineMap.vue'
import KnowledgeStructure from '@/components/KnowledgeStructure.vue'
import CS408ProgressTracker from '@/components/CS408ProgressTracker.vue'
import CS408QuickEntry from '@/components/CS408QuickEntry.vue'
import ReinforcementTracker from '@/components/ReinforcementTracker.vue'
import FeynmanLearning from '@/components/FeynmanLearning.vue'
import ExamFrequencyMap from '@/components/ExamFrequencyMap.vue'
import CS408TopicGuide from '@/components/CS408TopicGuide.vue'
import RealExamBigQuestions from '@/components/RealExamBigQuestions.vue'
import { useSrsStore } from '@/stores/srs'

const activeTab = ref((new URLSearchParams(typeof location !== 'undefined' ? location.search : '').get('tab')) || 'progress')

// ===== 408 复习闭环：真题重做队列转间隔重复记忆卡 =====
const router = useRouter()
const srs = useSrsStore()
srs.init()
const cs408Due = computed(() => srs.cs408DueCount)
const cs408Total = computed(() => srs.cs408TotalCount)
// 进入 408 页即后台灌卡，让"今日复习"角标第一时间准确
onMounted(() => { srs.seedCS408() })
function goReview() {
  srs.seedCS408().finally(() => router.push({ path: '/srs', query: { pool: 'cs408-bigq' } }))
}
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

    <!-- 复习闭环 · 治"记不住/太多"：真题重做队列自动排进间隔重复卡池 -->
    <section class="review-loop">
      <div class="rl-icon">🔁</div>
      <div class="rl-text">
        <h3 class="rl-title">复习闭环 · 讲过 / 做错的 408 大题，按记忆曲线再推给你</h3>
        <p class="rl-sub">
          把「讲过、做错、半懂」的真题大题灌成间隔重复记忆卡，手机碎片时间刷一轮主动回忆，到期自动回炉——不再"学过就忘"。
          <strong>今日待复习 {{ cs408Due }}</strong> 张 · 已入池 {{ cs408Total }} 张。
        </p>
      </div>
      <button class="rl-btn" @click="goReview">
        {{ cs408Due > 0 ? `今日复习 ${cs408Due} 张` : '去复习卡池' }}
      </button>
    </section>

    <div class="tab-navigation">
      <el-tabs v-model="activeTab" class="cs408-tabs">
        <el-tab-pane label="学习进度" name="progress">
          <CS408ProgressTracker />
        </el-tab-pane>

        <el-tab-pane label="🧭 主线地图" name="spine">
          <CS408SpineMap />
        </el-tab-pane>

        <el-tab-pane label="🎯 强化进度" name="reinforcement">
          <ReinforcementTracker />
        </el-tab-pane>

        <el-tab-pane label="🧠 费曼学习法" name="feynman">
          <FeynmanLearning />
        </el-tab-pane>

        <el-tab-pane label="📊 考频地图" name="frequency">
          <ExamFrequencyMap />
        </el-tab-pane>
        <el-tab-pane label="📝 真题大题" name="exam">
          <RealExamBigQuestions />
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

        <el-tab-pane label="🧭 专题指南" name="guide">
          <CS408TopicGuide />
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

/* 复习闭环 banner */
.review-loop {
  display: flex;
  align-items: center;
  gap: 18px;
  background: linear-gradient(135deg, #f4f8fd 0%, #eef3fb 100%);
  border: 1px solid var(--line);
  border-left: 5px solid var(--gold);
  border-radius: 14px;
  padding: 20px 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 18px rgba(13, 33, 55, 0.05);
}
.review-loop .rl-icon {
  font-size: 2.2rem;
  line-height: 1;
  flex-shrink: 0;
}
.review-loop .rl-text {
  flex: 1;
  min-width: 0;
}
.review-loop .rl-title {
  margin: 0 0 6px;
  font-size: 1.08rem;
  font-weight: 700;
  color: var(--navy);
}
.review-loop .rl-sub {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--muted);
}
.review-loop .rl-sub strong {
  color: var(--navy);
}
.review-loop .rl-btn {
  flex-shrink: 0;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.98rem;
  color: var(--navy-deep);
  background: linear-gradient(90deg, var(--gold), #f0a820);
  padding: 12px 22px;
  border-radius: 999px;
  box-shadow: 0 4px 14px rgba(240, 168, 32, 0.35);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  white-space: nowrap;
}
.review-loop .rl-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(240, 168, 32, 0.45);
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
  .review-loop {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    gap: 12px;
    padding: 16px 18px;
  }
  .review-loop .rl-icon { font-size: 1.8rem; }
  .review-loop .rl-btn { width: 100%; }
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