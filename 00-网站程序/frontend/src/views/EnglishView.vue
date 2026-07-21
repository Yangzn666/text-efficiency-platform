<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted } from 'vue'
import { useRoute } from 'vue-router'
// 使用动态导入解决TypeScript默认导出识别问题
const ReadingPractice = defineAsyncComponent(() => import('@/components/ReadingPractice.vue'))
const VocabularySystem = defineAsyncComponent(() => import('@/components/VocabularyLearning.vue'))
const EnglishStudyPlan = defineAsyncComponent(() => import('@/components/EnglishStudyPlan.vue'))
const GrammarLearningCenter = defineAsyncComponent(() => import('@/components/GrammarLearningCenter.vue'))
const TranslationLearning = defineAsyncComponent(() => import('@/components/TranslationLearning.vue'))
const WritingLearning = defineAsyncComponent(() => import('@/components/WritingLearning-Premium.vue'))
const EnglishReadingLog = defineAsyncComponent(() => import('@/components/EnglishReadingLog.vue'))

const route = useRoute()
const activeTab = ref('reading')

// 在组件挂载时检查路由参数，激活对应的tab
onMounted(() => {
  const tabParam = route.query.tab as string
  if (tabParam && ['reading', 'vocabulary', 'writing', 'translation', 'studyPlan', 'grammarCenter', 'readingLog'].includes(tabParam)) {
    activeTab.value = tabParam
  }
})
</script>

<template>
  <div class="english-container">
    <header class="page-hero">
      <div class="hero-grid"></div>
      <div class="hero-glow"></div>
      <div class="hero-inner">
        <span class="hero-kicker">ENGLISH · 英语一 · 目标75+</span>
        <h1 class="hero-title">英语一<span class="gold">学习系统</span></h1>
        <p class="hero-sub">阅读理解 · 词汇记忆 · 写作训练 · 翻译练习</p>
      </div>
    </header>

    <div class="tab-navigation">
      <el-tabs v-model="activeTab" class="english-tabs">
        <el-tab-pane label="真题阅读" name="reading">
          <ReadingPractice />
        </el-tab-pane>

        <el-tab-pane label="📊 阅读记录" name="readingLog">
          <EnglishReadingLog />
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
  --subject: #E6A23C;
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
.english-tabs :deep(.el-tabs__header) {
  margin-bottom: 22px;
}
.english-tabs :deep(.el-tabs__nav-wrap)::after {
  background: var(--line);
}
.english-tabs :deep(.el-tabs__item) {
  font-size: 1.02rem;
  font-weight: 500;
  padding: 0 22px;
  height: 46px;
  line-height: 46px;
  color: var(--muted);
  transition: color 0.25s;
}
.english-tabs :deep(.el-tabs__item:hover) {
  color: var(--navy);
}
.english-tabs :deep(.el-tabs__item.is-active) {
  color: var(--navy);
  font-weight: 700;
}
.english-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, var(--gold), #f0a820);
  height: 3px;
  border-radius: 2px;
}

.writing-content, .translation-content {
  text-align: center;
  padding: 40px 20px;
  color: var(--muted);
}

.writing-illustration, .translation-illustration {
  margin-bottom: 25px;
}

.writing-content h3, .translation-content h3 {
  font-size: 1.6rem;
  color: var(--ink);
  margin-bottom: 15px;
  font-weight: 700;
}

.writing-content p, .translation-content p {
  font-size: 1.05rem;
  margin-bottom: 30px;
  color: var(--muted);
  line-height: 1.6;
}

.writing-features, .translation-features {
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
  .writing-features, .translation-features {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .feature-card {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  .english-tabs :deep(.el-tabs__item) {
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