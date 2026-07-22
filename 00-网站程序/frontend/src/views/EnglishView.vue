<script setup lang="ts">
import { ref, computed, defineAsyncComponent, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useReadingLogStore } from '@/stores/readingLog'
// 使用动态导入解决TypeScript默认导出识别问题
const ReadingPractice = defineAsyncComponent(() => import('@/components/ReadingPractice.vue'))
const VocabularySystem = defineAsyncComponent(() => import('@/components/VocabularyLearning.vue'))
const EnglishStudyPlan = defineAsyncComponent(() => import('@/components/EnglishStudyPlan.vue'))
const GrammarLearningCenter = defineAsyncComponent(() => import('@/components/GrammarLearningCenter.vue'))
const TranslationView = defineAsyncComponent(() => import('@/views/TranslationView.vue'))
const WritingLearning = defineAsyncComponent(() => import('@/components/WritingLearning-Premium.vue'))
const EnglishReadingLog = defineAsyncComponent(() => import('@/components/EnglishReadingLog.vue'))

const route = useRoute()
const activeTab = ref('reading')
const readingLog = useReadingLogStore()

// 实时数据
const examDate = new Date('2026-12-19')
const daysLeft = computed(() => {
  const diff = examDate.getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / 86400000))
})
const passagesDone = computed(() => readingLog.overall.done)
const passagesTotal = computed(() => readingLog.overall.total)
const readingAccuracy = computed(() => readingLog.overall.accuracy)
const readingPercent = computed(() => Math.round((passagesDone.value / passagesTotal.value) * 100))

// Tab配置
const tabItems = [
  { name: 'reading', label: '真题阅读', icon: '📖' },
  { name: 'readingLog', label: '阅读记录', icon: '📊' },
  { name: 'vocabulary', label: '词汇系统', icon: '🧠' },
  { name: 'writing', label: '写作训练', icon: '✍️' },
  { name: 'translation', label: '翻译', icon: '🔄' },
  { name: 'studyPlan', label: '学习计划', icon: '🗓️' },
  { name: 'grammarCenter', label: '语法中心', icon: '📐' }
]

// 在组件挂载时检查路由参数，激活对应的tab
onMounted(() => {
  const tabParam = route.query.tab as string
  if (tabParam && tabItems.some(t => t.name === tabParam)) {
    activeTab.value = tabParam
  }
})
</script>

<template>
  <div class="english-container">
    <!-- 作战室页头：实时数据 + 倒计时 -->
    <header class="page-hero">
      <div class="hero-grid"></div>
      <div class="hero-glow"></div>
      <div class="hero-noise"></div>
      <div class="hero-inner">
        <div class="hero-left">
          <span class="hero-kicker">ENGLISH ONE · 目标75+ · 浙大海宁</span>
          <h1 class="hero-title">英语一<span class="gold">作战室</span></h1>
          <p class="hero-sub">真题精读 · 词汇突破 · 写作输出 · 翻译实战</p>
        </div>
        <div class="hero-stats">
          <div class="stat-chip countdown">
            <span class="stat-num">{{ daysLeft }}</span>
            <span class="stat-label">天后上考场</span>
          </div>
          <div class="stat-chip">
            <span class="stat-num">{{ passagesDone }}<small>/{{ passagesTotal }}</small></span>
            <span class="stat-label">真题阅读完成</span>
            <div class="stat-bar">
              <div class="stat-bar-fill" :style="{ width: readingPercent + '%' }"></div>
            </div>
          </div>
          <div class="stat-chip">
            <span class="stat-num">{{ readingAccuracy }}<small>%</small></span>
            <span class="stat-label">阅读正确率</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 自定义胶囊导航 -->
    <nav class="tab-strip">
      <button
        v-for="tab in tabItems"
        :key="tab.name"
        class="tab-pill"
        :class="{ active: activeTab === tab.name }"
        @click="activeTab = tab.name"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-text">{{ tab.label }}</span>
      </button>
    </nav>

    <!-- 内容区 -->
    <div class="content-deck">
      <div v-show="activeTab === 'reading'"><ReadingPractice /></div>
      <div v-show="activeTab === 'readingLog'"><EnglishReadingLog /></div>
      <div v-show="activeTab === 'vocabulary'"><VocabularySystem /></div>
      <div v-show="activeTab === 'writing'"><WritingLearning /></div>
      <div v-show="activeTab === 'translation'"><TranslationView :embedded="true" /></div>
      <div v-show="activeTab === 'studyPlan'"><EnglishStudyPlan /></div>
      <div v-show="activeTab === 'grammarCenter'"><GrammarLearningCenter /></div>
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
  --gold-deep: #f0a820;
  --navy-deep: #0d2137;
  --navy: #16345c;
  --navy-mid: #1e4576;
  --line: #e4ebf3;
  --bg-soft: #f5f8fc;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
}

/* ============ 作战室页头 ============ */
.page-hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(150deg, var(--navy-deep) 0%, var(--navy) 55%, var(--navy-mid) 100%);
  border-radius: 16px;
  padding: 36px 40px 30px;
  margin-bottom: 16px;
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 42px 42px;
  pointer-events: none;
}
.hero-glow {
  position: absolute;
  top: -80%;
  right: -6%;
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, rgba(255,197,61,0.14) 0%, transparent 68%);
  pointer-events: none;
  animation: glowPulse 5s ease-in-out infinite;
}
@keyframes glowPulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.08); }
}
.hero-noise {
  position: absolute;
  inset: 0;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  pointer-events: none;
}
.hero-inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
  flex-wrap: wrap;
}
.hero-left {
  flex: 1;
  min-width: 260px;
}
.hero-kicker {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: var(--gold);
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.hero-kicker::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--gold);
  animation: blink 2s ease-in-out infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
.hero-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.9rem);
  font-weight: 800;
  color: #fff;
  margin: 8px 0 6px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}
.hero-title .gold {
  color: var(--gold);
  text-shadow: 0 0 24px rgba(255,197,61,0.35);
}
.hero-sub {
  color: #a8bdd4;
  font-size: 0.92rem;
  letter-spacing: 0.08em;
}

/* 页头实时数据芯片 */
.hero-stats {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.stat-chip {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 12px 18px;
  min-width: 108px;
  text-align: center;
  backdrop-filter: blur(4px);
  transition: transform 0.25s, border-color 0.25s;
}
.stat-chip:hover {
  transform: translateY(-2px);
  border-color: rgba(255,197,61,0.35);
}
.stat-chip.countdown {
  border-color: rgba(255,197,61,0.4);
  background: rgba(255,197,61,0.08);
}
.stat-num {
  display: block;
  font-family: var(--font-mono);
  font-size: 1.65rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}
.stat-chip.countdown .stat-num {
  color: var(--gold);
}
.stat-num small {
  font-size: 0.85rem;
  opacity: 0.7;
  font-weight: 400;
}
.stat-label {
  display: block;
  font-size: 0.72rem;
  color: #8fa8c4;
  margin-top: 4px;
  letter-spacing: 0.06em;
}
.stat-bar {
  height: 4px;
  background: rgba(255,255,255,0.12);
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
}
.stat-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gold), var(--gold-deep));
  border-radius: 2px;
  transition: width 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

/* ============ 胶囊Tab导航 ============ */
.tab-strip {
  display: flex;
  gap: 8px;
  padding: 10px 14px;
  background: #fff;
  border-radius: 14px;
  border: 1px solid var(--line);
  box-shadow: 0 2px 12px rgba(13, 33, 55, 0.05);
  margin-bottom: 16px;
  overflow-x: auto;
  scrollbar-width: none;
}
.tab-strip::-webkit-scrollbar {
  display: none;
}
.tab-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--muted);
  white-space: nowrap;
  transition: all 0.22s ease;
  font-family: inherit;
}
.tab-pill:hover {
  background: var(--bg-soft);
  color: var(--ink);
  transform: translateY(-1px);
}
.tab-pill:active {
  transform: scale(0.97);
}
.tab-pill.active {
  background: linear-gradient(135deg, var(--navy-deep), var(--navy));
  color: #fff;
  font-weight: 600;
  border-color: rgba(255,197,61,0.3);
  box-shadow: 0 4px 14px rgba(13, 33, 55, 0.25);
}
.tab-pill.active .tab-icon {
  transform: scale(1.15);
}
.tab-icon {
  font-size: 1.05rem;
  transition: transform 0.22s;
}

/* ============ 内容区 ============ */
.content-deck {
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--line);
  box-shadow: 0 4px 24px rgba(13, 33, 55, 0.06);
  padding: 28px;
  min-height: 520px;
}

/* ============ 响应式 ============ */
@media (max-width: 900px) {
  .hero-inner {
    flex-direction: column;
    align-items: flex-start;
  }
  .hero-stats {
    width: 100%;
  }
  .stat-chip {
    flex: 1;
    min-width: 90px;
    padding: 10px 12px;
  }
}
@media (max-width: 768px) {
  .page-hero {
    padding: 26px 20px 22px;
    border-radius: 12px;
  }
  .tab-strip {
    padding: 8px 10px;
    gap: 6px;
  }
  .tab-pill {
    padding: 8px 13px;
    font-size: 0.85rem;
  }
  .content-deck {
    padding: 16px;
    border-radius: 12px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .hero-glow, .hero-kicker::before {
    animation: none;
  }
  .tab-pill, .stat-chip {
    transition: none;
  }
}
</style>