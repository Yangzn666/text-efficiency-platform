<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

// 懒加载6个翻译子模块，仅在首次激活对应标签时加载
const TranslationPhrasesView = defineAsyncComponent(() => import('@/views/TranslationPhrasesView.vue'))
const TranslationVocabularyView = defineAsyncComponent(() => import('@/views/TranslationVocabularyView.vue'))
const TranslationPatternsView = defineAsyncComponent(() => import('@/views/TranslationPatternsView.vue'))
const TranslationExamsView = defineAsyncComponent(() => import('@/views/TranslationExamsView.vue'))
const TranslationTipsView = defineAsyncComponent(() => import('@/views/TranslationTipsView.vue'))
const TranslationMistakesView = defineAsyncComponent(() => import('@/views/TranslationMistakesView.vue'))

const route = useRoute()
const router = useRouter()

const tabNames = ['phrases', 'vocabulary', 'patterns', 'exams', 'tips', 'mistakes']
const activeTab = ref('phrases')

function syncFromQuery() {
  const tabParam = route.query.tab as string
  if (tabParam && tabNames.includes(tabParam)) {
    activeTab.value = tabParam
  }
}

onMounted(syncFromQuery)
// 支持从翻译主页点击模块卡片时通过 query 切换标签
watch(() => route.query.tab, syncFromQuery)

function goBackToHub() {
  router.push({ path: '/english', query: { tab: 'translation' } })
}
</script>

<template>
  <div class="translation-view">
    <div class="page-header">
      <el-button type="primary" link @click="goBackToHub">
        <el-icon><ArrowLeft /></el-icon>
        返回翻译主页
      </el-button>
      <h2>🌐 翻译学习模块</h2>
      <p>词组 · 词汇 · 句型 · 真题 · 技巧 · 错题</p>
    </div>

    <div class="tab-container">
      <el-tabs v-model="activeTab" class="translation-tabs">
        <el-tab-pane label="📚 翻译词组" name="phrases" lazy>
          <TranslationPhrasesView />
        </el-tab-pane>
        <el-tab-pane label="📖 核心词汇" name="vocabulary" lazy>
          <TranslationVocabularyView />
        </el-tab-pane>
        <el-tab-pane label="🔗 万能句型" name="patterns" lazy>
          <TranslationPatternsView />
        </el-tab-pane>
        <el-tab-pane label="📝 真题实战" name="exams" lazy>
          <TranslationExamsView />
        </el-tab-pane>
        <el-tab-pane label="⚡ 翻译技巧" name="tips" lazy>
          <TranslationTipsView />
        </el-tab-pane>
        <el-tab-pane label="⚠️ 错题本" name="mistakes" lazy>
          <TranslationMistakesView />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.translation-view {
  --font-mono: 'JetBrains Mono', monospace;
  --gold: #ffc53d;
  --navy-deep: #0d2137;
  --navy: #16345c;
  --muted: #5b6b7f;
  --line: #e4ebf3;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
}

.page-header {
  background: linear-gradient(150deg, #0d2137 0%, #16345c 60%, #1e4576 100%);
  border-radius: 14px;
  padding: 28px 34px 24px;
  margin-bottom: 24px;
  text-align: left;
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
  background-size: 44px 44px;
  pointer-events: none;
}

.page-header :deep(.el-button) {
  color: #a8bdd4;
  position: relative;
  z-index: 1;
  font-size: 0.85rem;
}

.page-header :deep(.el-button:hover) {
  color: var(--gold);
}

.page-header h2 {
  font-size: 1.7rem;
  color: #fff;
  margin: 6px 0 4px;
  font-weight: 800;
  position: relative;
  z-index: 1;
}

.page-header p {
  font-size: 0.9rem;
  color: #a8bdd4;
  font-weight: 400;
  margin: 0;
  letter-spacing: 0.06em;
  position: relative;
  z-index: 1;
}

.tab-container {
  background: #fff;
  border-radius: 14px;
  padding: 24px 28px;
  border: 1px solid var(--line);
  box-shadow: 0 4px 20px rgba(13, 33, 55, 0.06);
}

.translation-tabs :deep(.el-tabs__header) {
  margin-bottom: 22px;
}

.translation-tabs :deep(.el-tabs__nav-wrap)::after {
  background: var(--line);
}

.translation-tabs :deep(.el-tabs__item) {
  font-size: 1rem;
  font-weight: 500;
  padding: 0 18px;
  height: 46px;
  line-height: 46px;
  color: var(--muted);
  transition: color 0.25s;
}

.translation-tabs :deep(.el-tabs__item:hover) {
  color: var(--navy);
}

.translation-tabs :deep(.el-tabs__item.is-active) {
  color: var(--navy);
  font-weight: 700;
}

.translation-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, var(--gold), #f0a820);
  height: 3px;
  border-radius: 2px;
}

/* 隐藏嵌入子模块自带的页头（含返回按钮），由本页统一提供导航 */
.translation-tabs :deep(.page-header) {
  display: none;
}

@media (max-width: 768px) {
  .page-header {
    padding: 20px;
  }
  .page-header h2 {
    font-size: 1.3rem;
  }
  .tab-container {
    padding: 12px;
  }
  .translation-tabs :deep(.el-tabs__item) {
    padding: 0 10px;
    font-size: 0.85rem;
  }
}
</style>
