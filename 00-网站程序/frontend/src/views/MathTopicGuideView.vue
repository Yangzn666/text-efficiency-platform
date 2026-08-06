<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MathReinforcementNav from '@/components/MathReinforcementNav.vue'
import { MATH_TOPIC_GUIDES } from '@/data/mathTopicGuides'
import katex from 'katex'
import 'katex/dist/katex.min.css'

const router = useRouter()
const guides = MATH_TOPIC_GUIDES

const activeCategory = ref<string | null>(null)
const expandedCards = ref<Set<string>>(new Set())

const categories = [
  { key: null, label: '全部', icon: '📚' },
  { key: 'gaoshu', label: '高数', icon: '📐' },
  { key: 'linear-algebra', label: '线代', icon: '🔢' },
  { key: 'probability', label: '概率论', icon: '🎲' },
  { key: 'series', label: '级数', icon: '' },
  { key: 'ode', label: '微分方程', icon: '🔑' },
  { key: 'power-series', label: '幂级数', icon: '📈' },
  { key: 'rotation', label: '旋转体', icon: '' },
  { key: 'proof', label: '证明题', icon: '⚖️' },
  { key: 'estimation', label: '参数估计', icon: '📋' },
]

const categoryMap: Record<string, string> = {
  'gaoshu-18': 'gaoshu',
  'implicit-diff': 'gaoshu',
  'linear-systems': 'linear-algebra',
  'quadratic-form': 'linear-algebra',
  'probability-ch3': 'probability',
  'series-convergence': 'series',
  'second-order-ode': 'ode',
  'power-series-taylor': 'power-series',
  'rotation-volume': 'rotation',
  'proof-framework': 'proof',
  'parameter-estimation': 'estimation',
}

const filteredGuides = computed(() => {
  if (!activeCategory.value) return guides
  return guides.filter(g => categoryMap[g.id] === activeCategory.value)
})

function toggleCard(id: string) {
  if (expandedCards.value.has(id)) {
    expandedCards.value.delete(id)
  } else {
    expandedCards.value.add(id)
  }
  expandedCards.value = new Set(expandedCards.value)
}

function expandAll() {
  expandedCards.value = new Set(filteredGuides.value.map(g => g.id))
}

function collapseAll() {
  expandedCards.value = new Set()
}

function isExpanded(id: string) {
  return expandedCards.value.has(id)
}

function itemCount(id: string) {
  const g = guides.find(x => x.id === id)
  return g ? g.items.length : 0
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * 把文本中的 $...$ 和 $$...$$ 渲染为 KaTeX HTML
 */
function texify(text: string): string {
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g)
  return parts.map(part => {
    if (part.startsWith('$$') && part.endsWith('$$') && part.length > 4) {
      try {
        return katex.renderToString(part.slice(2, -2), { displayMode: true, throwOnError: false, strict: false })
      } catch { return escapeHtml(part) }
    }
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      try {
        return katex.renderToString(part.slice(1, -1), { displayMode: false, throwOnError: false, strict: false })
      } catch { return escapeHtml(part) }
    }
    return escapeHtml(part)
  }).join('')
}
</script>

<template>
  <div class="math-container">
    <MathReinforcementNav />
    <div class="page-header">
      <div class="header-decoration"></div>
      <h1 class="page-title">数学一专题指南</h1>
      <p class="page-subtitle">题型识别决策树 · 先识别再选公式 · 数一专属难点</p>
      <div class="navigation-links">
        <el-button type="primary" plain @click="router.push('/math')">
          <el-icon><House /></el-icon>
          返回数学一首页
        </el-button>
      </div>
    </div>

    <div class="guide-body">
      <!-- Category Filter Bar -->
      <div class="filter-bar">
        <button
          v-for="cat in categories"
          :key="cat.key ?? '__all__'"
          class="filter-btn"
          :class="{ active: activeCategory === cat.key }"
          @click="activeCategory = cat.key"
        >
          <span class="filter-icon">{{ cat.icon }}</span>
          {{ cat.label }}
        </button>
        <div class="filter-actions">
          <button class="action-btn" @click="expandAll">展开全部</button>
          <button class="action-btn" @click="collapseAll">折叠全部</button>
        </div>
      </div>

      <section v-for="g in filteredGuides" :key="g.id" class="guide-card">
        <div class="card-head" @click="toggleCard(g.id)">
          <h2 v-html="texify(g.head)"></h2>
          <span class="head-note">{{ g.note }}</span>
          <span class="item-count">{{ itemCount(g.id) }} 项</span>
          <span class="expand-icon" :class="{ expanded: isExpanded(g.id) }">
            <svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 10l5 5 5-5z" fill="currentColor"/></svg>
          </span>
        </div>
        <div class="guide-intro-box">
          <p class="guide-intro" v-html="texify(g.intro)"></p>
        </div>
        <Transition name="expand">
          <div v-show="isExpanded(g.id)" class="guide-list">
            <div v-for="(item, gi) in g.items" :key="gi" class="guide-item">
              <div class="gi-head">
                <span class="gi-icon">{{ item.icon }}</span>
                <strong v-html="texify(item.title)"></strong>
                <span class="gi-tag">{{ item.tag }}</span>
              </div>
              <ul class="gi-points">
                <li v-for="(p, pi) in item.points" :key="pi" v-html="texify(p)"></li>
              </ul>
              <div v-if="item.tip" class="gi-tip" v-html="'⚠️ ' + texify(item.tip)"></div>
            </div>
          </div>
        </Transition>
      </section>
    </div>
  </div>
</template>

<style scoped>
.math-container {
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
}

/* ── Header ─────────────────────────────── */
.page-header {
  position: relative;
  text-align: center;
  padding: 36px 24px 28px;
  background: linear-gradient(150deg, var(--navy-deep) 0%, var(--navy) 55%, var(--navy-light) 100%);
  color: white;
  border-radius: 20px 20px 0 0;
  margin-bottom: 24px;
  overflow: hidden;
}

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
}

.header-decoration::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, var(--gold) 25%, var(--gold-light) 50%, var(--gold) 75%, transparent 100%);
}

.page-title {
  font-family: 'FZCuHei', '方正粗黑_GBK', 'Microsoft YaHei', serif;
  font-size: 2.4em;
  margin: 0 0 12px;
  font-weight: 400;
  text-shadow: 2px 3px 6px rgba(0, 0, 0, 0.35);
  color: #fff;
  letter-spacing: 0.06em;
  position: relative;
}

.page-subtitle {
  font-size: 1.2em;
  opacity: 0.82;
  font-weight: 400;
  letter-spacing: 0.1em;
  margin: 0;
}

.navigation-links {
  margin-top: 18px;
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
}

/* ── Guide Body ─────────────────────────── */
.guide-body {
  padding: 8px 24px 48px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  counter-reset: guide-num;
}

/* ── Filter Bar ─────────────────────────── */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 14px 20px;
  background: var(--bg-soft);
  border-radius: 14px;
  border: 1px solid var(--line);
  margin-bottom: 4px;
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 15px;
  border: 1.5px solid var(--line);
  border-radius: 999px;
  background: #fff;
  color: var(--body);
  font-size: 0.92rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.filter-btn:hover {
  border-color: var(--gold);
  color: var(--ink);
  background: #fffef8;
}

.filter-btn.active {
  background: var(--navy);
  color: #fff;
  border-color: var(--navy);
}

.filter-icon {
  font-size: 0.95rem;
  line-height: 1;
}

.filter-actions {
  margin-left: auto;
  display: flex;
  gap: 6px;
}

.action-btn {
  padding: 5px 13px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
  color: var(--navy);
  font-size: 0.85rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--navy);
  color: #fff;
  border-color: var(--navy);
}

/* ── Guide Card ─────────────────────────── */
.guide-card {
  position: relative;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: #fff;
  padding: 28px 28px 24px;
  box-shadow: 0 4px 20px rgba(22, 52, 92, 0.05);
  counter-increment: guide-num;
  transition: box-shadow 0.35s ease;
}

.guide-card::before {
  content: counter(guide-num, decimal-leading-zero);
  position: absolute;
  top: -10px;
  left: 24px;
  font-family: 'Playfair Display', 'Georgia', 'Times New Roman', serif;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--gold);
  background: #fff;
  padding: 3px 12px;
  border-radius: 999px;
  border: 1.5px solid var(--gold);
  letter-spacing: 0.08em;
  box-shadow: 0 2px 8px var(--gold-glow);
}

.guide-card:hover {
  box-shadow: 0 8px 36px rgba(22, 52, 92, 0.1);
}

.card-head {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 0;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line);
  cursor: pointer;
  user-select: none;
  transition: background 0.2s ease;
  border-radius: 12px 12px 0 0;
  padding: 14px 16px 14px 16px;
  margin: -28px -28px 0;
}

.card-head:hover {
  background: rgba(22, 52, 92, 0.02);
}

.card-head h2 {
  margin: 0;
  font-size: 1.4rem;
  color: var(--ink);
  position: relative;
  padding-left: 16px;
  letter-spacing: 0.02em;
  flex: 1;
  min-width: 200px;
}

.card-head h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 3px;
  bottom: 3px;
  width: 5px;
  border-radius: 3px;
  background: linear-gradient(180deg, var(--gold) 0%, var(--gold-light) 100%);
}

.head-note {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--navy);
  background: linear-gradient(135deg, rgba(22, 52, 92, 0.06), rgba(22, 52, 92, 0.1));
  padding: 5px 14px;
  border-radius: 999px;
  letter-spacing: 0.04em;
  border: 1px solid rgba(22, 52, 92, 0.06);
}

.item-count {
  font-size: 0.78rem;
  color: #8896a7;
  background: var(--bg-soft);
  padding: 3px 10px;
  border-radius: 999px;
  font-weight: 600;
  white-space: nowrap;
}

.expand-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--bg-soft);
  color: var(--navy);
  transition: transform 0.3s ease, background 0.2s ease;
  flex-shrink: 0;
}

.expand-icon:hover {
  background: var(--line);
}

.expand-icon.expanded {
  transform: rotate(180deg);
  background: var(--gold-glow);
  color: var(--gold);
}

/* ── Expand Transition ──────────────────── */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ── Intro Box ──────────────────────────── */
.guide-intro-box {
  background: linear-gradient(135deg, var(--cream) 0%, var(--paper) 100%);
  border-left: 4px solid var(--gold);
  border-radius: 0 12px 12px 0;
  padding: 16px 20px;
  margin-bottom: 20px;
  position: relative;
}

.guide-intro-box::after {
  content: '';
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  background: radial-gradient(circle, var(--gold-glow) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.guide-intro {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.85;
  color: var(--navy);
}

/* ── Guide List ─────────────────────────── */
.guide-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.guide-item {
  border: 1px solid var(--line);
  border-left: 4px solid var(--navy);
  border-radius: 12px;
  background: #fff;
  padding: 20px 22px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.guide-item:hover {
  transform: translateX(6px);
  border-left-color: var(--gold);
  box-shadow: 0 4px 18px rgba(22, 52, 92, 0.08);
}

.gi-head {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.gi-icon {
  font-size: 1.45rem;
  line-height: 1.2;
  flex-shrink: 0;
}

.gi-head strong {
  font-size: 1.18rem;
  color: var(--ink);
  letter-spacing: 0.02em;
}

.gi-tag {
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--navy);
  background: rgba(22, 52, 92, 0.06);
  padding: 3px 12px;
  border-radius: 999px;
  margin-left: auto;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.gi-points {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.gi-points li {
  position: relative;
  padding: 4px 0 4px 22px;
  font-size: 1.15rem;
  line-height: 1.85;
  color: var(--body);
}

.gi-points li::before {
  content: '';
  position: absolute;
  left: 3px;
  top: 12px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gold);
  box-shadow: 0 0 0 2px var(--gold-glow);
}

.gi-tip {
  margin-top: 12px;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #9a7216;
  background: linear-gradient(135deg, #fffbf0 0%, #fff6e0 100%);
  border-radius: 10px;
  padding: 12px 16px;
  border: 1px solid rgba(212, 160, 18, 0.15);
}

/* ── KaTeX Formula Styles ──────────────── */
:deep(.katex) {
  font-size: 1.15em !important;
  font-family: 'KaTeX_Main', 'Times New Roman', serif !important;
}

:deep(.katex-display) {
  margin: 0.6em 0;
  overflow-x: auto;
  overflow-y: hidden;
}

/* inline math in titles should be slightly larger */
.card-head h2 :deep(.katex) {
  font-size: 1.15em !important;
}

.gi-head strong :deep(.katex) {
  font-size: 1.12em !important;
}

.gi-points li :deep(.katex) {
  font-size: 1.15em !important;
}

.gi-tip :deep(.katex) {
  font-size: 1.15em !important;
}

/* ── Responsive ─────────────────────────── */
@media (max-width: 768px) {
  .math-container { padding: 0 12px; }
  .page-title { font-size: 1.85em; }
  .page-header { padding: 24px 16px 20px; border-radius: 12px 12px 0 0; }
  .guide-body { padding: 4px 12px 36px; gap: 22px; }
  .guide-card { padding: 22px 16px 18px; }
  .guide-card::before { left: 16px; font-size: 0.78rem; }
  .card-head h2 { font-size: 1.2rem; }
  .gi-head strong { font-size: 1.05rem; }
  .gi-tag { font-size: 0.72rem; padding: 2px 10px; }
}
</style>
