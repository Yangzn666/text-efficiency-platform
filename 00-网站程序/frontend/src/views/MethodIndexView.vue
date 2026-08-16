<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MathReinforcementNav from '@/components/MathReinforcementNav.vue'
import {
  mathMethods,
  getMethodsByCategory,
  getRelatedMethods,
  getCategories,
  getSubCategories,
  getCrossLinkCount,
  type MathMethod
} from '../data/mathMethodTags'

const router = useRouter()

// ── 状态 ──────────────────────────────────────────────
const selectedCategory = ref<string>('全部')
const selectedSubCategory = ref<string>('全部')
const networkMethodId = ref<string | null>(null)
const showNetworkView = ref(false)

// ── 科目与子分类 ──────────────────────────────────────
const categories = computed(() => ['全部', ...getCategories()])

const subCategories = computed(() => {
  if (selectedCategory.value === '全部') return ['全部']
  return ['全部', ...getSubCategories(selectedCategory.value)]
})

// ── 筛选后的方法列表 ──────────────────────────────────
const filteredMethods = computed(() => {
  let list: MathMethod[]
  if (selectedCategory.value === '全部') {
    list = mathMethods
  } else {
    list = getMethodsByCategory(selectedCategory.value)
  }
  if (selectedSubCategory.value !== '全部') {
    list = list.filter(m => m.subCategory === selectedSubCategory.value)
  }
  return list
})

// ── 统计数据 ──────────────────────────────────────────
const stats = computed(() => {
  const total = mathMethods.length
  const crossLinks = getCrossLinkCount()
  const freqMap: Record<string, number> = { '必考': 0, '高频': 0, '中频': 0, '低频': 0 }
  mathMethods.forEach(m => { freqMap[m.frequency] = (freqMap[m.frequency] || 0) + 1 })
  const freqBreakdown = Object.entries(freqMap).map(([label, count]) => ({
    label,
    count,
    color: freqColorMap[label] || '#909399'
  }))
  return { total, crossLinks, freqBreakdown }
})

// ── 频率颜色 ──────────────────────────────────────────
const freqColorMap: Record<string, string> = {
  '必考': '#f56c6c',
  '高频': '#e6a23c',
  '中频': '#d4b106',
  '低频': '#909399'
}

const freqTagType = (freq: string): 'danger' | 'warning' | 'info' | '' => {
  if (freq === '必考') return 'danger'
  if (freq === '高频') return 'warning'
  if (freq === '中频') return 'info'
  return 'info'
}

// ── 科目颜色 ──────────────────────────────────────────
const categoryColorMap: Record<string, string> = {
  '高数': '#409eff',
  '线代': '#67c23a',
  '概率': '#e6a23c'
}

// ── 操作函数 ──────────────────────────────────────────
function selectCategory(cat: string) {
  selectedCategory.value = cat
  selectedSubCategory.value = '全部'
  networkMethodId.value = null
  showNetworkView.value = false
}

function selectSubCategory(sub: string) {
  selectedSubCategory.value = sub
  networkMethodId.value = null
  showNetworkView.value = false
}

function focusMethod(methodId: string) {
  networkMethodId.value = methodId
  showNetworkView.value = true
  // 确保目标方法的科目/子分类被选中
  const target = mathMethods.find(m => m.id === methodId)
  if (target) {
    selectedCategory.value = target.category
    selectedSubCategory.value = target.subCategory
  }
}

function toggleNetworkView(methodId: string) {
  if (networkMethodId.value === methodId && showNetworkView.value) {
    showNetworkView.value = false
    networkMethodId.value = null
  } else {
    networkMethodId.value = methodId
    showNetworkView.value = true
  }
}

// ── 网络视图数据 ──────────────────────────────────────
const networkCenter = computed<MathMethod | null>(() => {
  if (!networkMethodId.value) return null
  return mathMethods.find(m => m.id === networkMethodId.value) || null
})

const networkRelated = computed<MathMethod[]>(() => {
  if (!networkMethodId.value) return []
  return getRelatedMethods(networkMethodId.value)
})

// ── 网络视图辅助函数 ─────────────────────────────────
function getRelatedPosition(idx: number, total: number): { x: number; y: number } {
  const angle = (2 * Math.PI * idx) / total - Math.PI / 2
  const radius = 38
  return {
    x: 50 + radius * Math.cos(angle),
    y: 50 + radius * Math.sin(angle)
  }
}

function getRelatedNodeStyle(idx: number, total: number): Record<string, string> {
  const pos = getRelatedPosition(idx, total)
  return {
    left: `${pos.x}%`,
    top: `${pos.y}%`
  }
}
</script>

<template>
  <div class="method-index-container">
    <!-- 顶部导航 -->
    <MathReinforcementNav />

    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">数学方法索引</h1>
      <p class="page-subtitle">跨章节按招法索引 · 看清哪些方法反复出现</p>
      <div class="navigation-links">
        <el-button type="primary" plain @click="router.push('/math')">
          <el-icon><House /></el-icon>
          返回数学一首页
        </el-button>
      </div>
    </div>

    <!-- 统计栏 -->
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-number">{{ stats.total }}</span>
        <span class="stat-label">方法总数</span>
      </div>
      <div class="stat-divider" />
      <div class="stat-item">
        <span class="stat-number">{{ stats.crossLinks }}</span>
        <span class="stat-label">跨章节关联</span>
      </div>
      <div class="stat-divider" />
      <div class="stat-item" v-for="item in stats.freqBreakdown" :key="item.label">
        <span class="stat-number" :style="{ color: item.color }">{{ item.count }}</span>
        <span class="stat-label">{{ item.label }}</span>
      </div>
    </div>

    <!-- 科目筛选 -->
    <div class="filter-section">
      <div class="category-buttons">
        <el-button
          v-for="cat in categories"
          :key="cat"
          :type="selectedCategory === cat ? 'primary' : 'default'"
          :class="{ 'cat-btn-active': selectedCategory === cat }"
          round
          @click="selectCategory(cat)"
        >
          <span
            v-if="cat !== '全部'"
            class="cat-dot"
            :style="{ background: categoryColorMap[cat] }"
          />
          {{ cat }}
        </el-button>
      </div>

      <!-- 子分类标签 -->
      <div class="subcategory-tabs" v-if="subCategories.length > 1">
        <span
          v-for="sub in subCategories"
          :key="sub"
          class="sub-tab"
          :class="{ 'sub-tab-active': selectedSubCategory === sub }"
          @click="selectSubCategory(sub)"
        >
          {{ sub }}
        </span>
      </div>
    </div>

    <!-- 方法卡片列表 -->
    <div class="methods-grid" v-if="!showNetworkView">
      <div
        v-for="method in filteredMethods"
        :key="method.id"
        class="method-card"
      >
        <!-- 卡片头部 -->
        <div class="card-header">
          <div class="card-title-row">
            <h3 class="method-name">{{ method.name }}</h3>
            <el-tag
              :type="freqTagType(method.frequency)"
              size="small"
              effect="dark"
              round
            >
              {{ method.frequency }}
            </el-tag>
          </div>
          <div class="card-meta">
            <span class="meta-category" :style="{ color: categoryColorMap[method.category] }">
              {{ method.category }}
            </span>
            <span class="meta-separator">·</span>
            <span class="meta-subcategory">{{ method.subCategory }}</span>
          </div>
        </div>

        <!-- 描述 -->
        <div class="card-body">
          <div class="info-row">
            <span class="info-label">什么时候用</span>
            <span class="info-text">{{ method.description }}</span>
          </div>
          <div class="info-row">
            <span class="info-label fallback-label">走不通换</span>
            <span class="info-text fallback-text">{{ method.fallback }}</span>
          </div>
        </div>

        <!-- 关联方法 -->
        <div class="card-footer" v-if="method.relatedMethods.length > 0">
          <span class="related-label">关联招法</span>
          <div class="related-tags">
            <el-tag
              v-for="relId in method.relatedMethods"
              :key="relId"
              size="small"
              class="related-tag"
              @click="focusMethod(relId)"
              effect="plain"
            >
              {{ mathMethods.find(m => m.id === relId)?.shortName || relId }}
            </el-tag>
          </div>
        </div>

        <!-- 网络视图按钮 -->
        <div class="card-action">
          <el-button
            text
            size="small"
            class="network-btn"
            @click="toggleNetworkView(method.id)"
          >
            查看招法网络
          </el-button>
        </div>
      </div>

      <div v-if="filteredMethods.length === 0" class="empty-state">
        <el-empty description="该分类下暂无方法" />
      </div>
    </div>

    <!-- 网络视图 -->
    <div class="network-view" v-if="showNetworkView && networkCenter">
      <div class="network-header">
        <el-button text @click="showNetworkView = false; networkMethodId = null">
          ← 返回列表
        </el-button>
        <span class="network-title">招法网络</span>
      </div>

      <div class="network-canvas">
        <!-- 中心节点 -->
        <div class="center-node">
          <div class="node-card center-card">
            <div class="node-name">{{ networkCenter.name }}</div>
            <el-tag
              :type="freqTagType(networkCenter.frequency)"
              size="small"
              effect="dark"
              round
            >
              {{ networkCenter.frequency }}
            </el-tag>
            <div class="node-category">
              <span :style="{ color: categoryColorMap[networkCenter.category] }">
                {{ networkCenter.category }}
              </span>
              · {{ networkCenter.subCategory }}
            </div>
            <div class="node-desc">{{ networkCenter.description }}</div>
          </div>
        </div>

        <!-- 连接线（CSS 实现） -->
        <svg class="connection-lines" v-if="networkRelated.length > 0">
          <line
            v-for="(_, idx) in networkRelated"
            :key="'line-' + idx"
            :x1="50 + '%' "
            :y1="50 + '%'"
            :x2="getRelatedPosition(idx, networkRelated.length).x + '%'"
            :y2="getRelatedPosition(idx, networkRelated.length).y + '%'"
            stroke="#c0c8d4"
            stroke-width="1.5"
            stroke-dasharray="6,4"
            opacity="0.6"
          />
        </svg>

        <!-- 关联节点 -->
        <div
          v-for="(rel, idx) in networkRelated"
          :key="rel.id"
          class="related-node"
          :style="getRelatedNodeStyle(idx, networkRelated.length)"
        >
          <div class="node-card related-card" @click="focusMethod(rel.id)">
            <div class="node-name small">{{ rel.shortName }}</div>
            <el-tag
              :type="freqTagType(rel.frequency)"
              size="small"
              round
              class="node-freq"
            >
              {{ rel.frequency }}
            </el-tag>
            <div class="node-cat-small" :style="{ color: categoryColorMap[rel.category] }">
              {{ rel.category }} · {{ rel.subCategory }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.method-index-container {
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

/* ── 页面头部 ───────────────────────────── */
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

/* ── 统计栏 ─────────────────────────────── */
.stats-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 18px 24px;
  margin: 0 24px 20px;
  background: linear-gradient(135deg, #f0f4f8 0%, #e8edf3 100%);
  border-radius: 14px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-number {
  font-size: 1.6em;
  font-weight: 700;
  color: #16345c;
  line-height: 1;
}

.stat-label {
  font-size: 0.82em;
  color: #6b7b8d;
  white-space: nowrap;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: #c8d0da;
  flex-shrink: 0;
}

/* ── 筛选区域 ───────────────────────────── */
.filter-section {
  padding: 0 24px;
  margin-bottom: 20px;
}

.category-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.cat-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.cat-btn-active {
  font-weight: 600;
}

.subcategory-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 8px 0;
}

.sub-tab {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.88em;
  color: #5a6a7a;
  cursor: pointer;
  transition: all 0.2s;
  background: #f5f7fa;
  border: 1px solid transparent;
  user-select: none;
}

.sub-tab:hover {
  background: #e8edf3;
  color: #16345c;
}

.sub-tab-active {
  background: #16345c;
  color: #fff;
  border-color: #16345c;
  font-weight: 500;
}

/* ── 方法卡片网格 ───────────────────────── */
.methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
  gap: 18px;
  padding: 0 24px 40px;
}

.method-card {
  background: #fff;
  border: 1px solid #e4e8ee;
  border-radius: 14px;
  padding: 20px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.method-card:hover {
  border-color: #b0bec5;
  box-shadow: 0 8px 28px rgba(22, 52, 92, 0.1);
  transform: translateY(-2px);
}

/* ── 卡片头部 ───────────────────────────── */
.card-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.method-name {
  font-size: 1.08em;
  font-weight: 600;
  color: #16345c;
  margin: 0;
  line-height: 1.4;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82em;
}

.meta-category {
  font-weight: 600;
}

.meta-separator {
  color: #c0c8d4;
}

.meta-subcategory {
  color: #8896a4;
}

/* ── 卡片内容 ───────────────────────────── */
.card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.info-label {
  font-size: 0.78em;
  color: #fff;
  background: #16345c;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
  flex-shrink: 0;
  line-height: 1.6;
}

.fallback-label {
  background: #8896a4;
}

.info-text {
  font-size: 0.88em;
  color: #4a5568;
  line-height: 1.6;
}

.fallback-text {
  color: #7a8896;
  font-style: italic;
}

/* ── 卡片底部（关联标签） ──────────────── */
.card-footer {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid #f0f2f5;
}

.related-label {
  font-size: 0.78em;
  color: #8896a4;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 2px;
}

.related-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.related-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.related-tag:hover {
  color: #16345c;
  border-color: #16345c;
  background: #eef3f9;
}

/* ── 卡片操作 ───────────────────────────── */
.card-action {
  display: flex;
  justify-content: flex-end;
}

.network-btn {
  color: #8896a4;
  font-size: 0.82em;
}

.network-btn:hover {
  color: #16345c;
}

/* ── 空状态 ─────────────────────────────── */
.empty-state {
  grid-column: 1 / -1;
  padding: 60px 0;
}

/* ── 网络视图 ───────────────────────────── */
.network-view {
  padding: 0 24px 40px;
}

.network-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.network-title {
  font-size: 1.1em;
  font-weight: 600;
  color: #16345c;
}

.network-canvas {
  position: relative;
  width: 100%;
  height: 520px;
  background: linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%);
  border-radius: 16px;
  border: 1px solid #e4e8ee;
  overflow: hidden;
}

.connection-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.center-node {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.related-node {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.node-card {
  background: #fff;
  border-radius: 12px;
  padding: 14px 18px;
  box-shadow: 0 4px 16px rgba(22, 52, 92, 0.1);
  border: 2px solid #e4e8ee;
  text-align: center;
  min-width: 120px;
}

.center-card {
  border-color: #16345c;
  min-width: 200px;
  max-width: 260px;
  box-shadow: 0 8px 32px rgba(22, 52, 92, 0.18);
}

.related-card {
  cursor: pointer;
  min-width: 130px;
  max-width: 170px;
  transition: all 0.2s;
}

.related-card:hover {
  border-color: #409eff;
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.2);
  transform: scale(1.05);
}

.node-name {
  font-size: 1em;
  font-weight: 600;
  color: #16345c;
  margin-bottom: 6px;
  line-height: 1.3;
}

.node-name.small {
  font-size: 0.88em;
}

.node-category {
  font-size: 0.78em;
  color: #8896a4;
  margin-top: 6px;
}

.node-desc {
  font-size: 0.78em;
  color: #6b7b8d;
  margin-top: 8px;
  line-height: 1.4;
  text-align: left;
}

.node-freq {
  margin-top: 4px;
}

.node-cat-small {
  font-size: 0.72em;
  margin-top: 4px;
}

/* ── 响应式 ─────────────────────────────── */
@media (max-width: 768px) {
  .method-index-container {
    padding: 0 12px;
    overflow: visible;
  }

  .page-title {
    font-size: 1.7em;
  }

  .page-header {
    padding: 20px 0 14px;
    border-radius: 12px 12px 0 0;
  }

  .stats-bar {
    gap: 14px;
    margin: 0 12px 16px;
    padding: 14px 16px;
  }

  .stat-number {
    font-size: 1.3em;
  }

  .stat-divider {
    display: none;
  }

  .filter-section {
    padding: 0 12px;
  }

  .category-buttons {
    gap: 8px;
  }

  .methods-grid {
    grid-template-columns: 1fr;
    padding: 0 12px 30px;
    gap: 14px;
  }

  .method-card {
    padding: 16px;
  }

  .network-canvas {
    height: 400px;
  }

  .center-card {
    min-width: 130px;
    max-width: 160px;
    font-size: 0.82em;
  }

  .related-card {
    min-width: 80px;
    max-width: 110px;
    font-size: 0.75em;
  }

  .node-name {
    font-size: 0.88em;
  }

  .node-name.small {
    font-size: 0.78em;
  }
}

@media (max-width: 480px) {
  .stats-bar {
    gap: 10px;
  }

  .network-canvas {
    height: 360px;
  }
}
</style>
