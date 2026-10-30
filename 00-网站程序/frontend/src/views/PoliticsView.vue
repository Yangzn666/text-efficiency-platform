<script setup lang="ts">
import { ref, watch, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useSrsStore } from '@/stores/srs'

const PoliticsToday = defineAsyncComponent(() => import('@/components/PoliticsToday.vue'))
const PoliticsVulnMap = defineAsyncComponent(() => import('@/components/PoliticsVulnMap.vue'))
const PoliticsKnowledge = defineAsyncComponent(() => import('@/components/PoliticsKnowledge.vue'))
const PoliticsAtlas = defineAsyncComponent(() => import('@/components/PoliticsAtlas.vue'))
const PoliticsReciteCards = defineAsyncComponent(() => import('@/components/PoliticsReciteCards.vue'))
const PoliticsDiagnosis = defineAsyncComponent(() => import('@/components/PoliticsDiagnosis.vue'))
const PoliticsTermDrill = defineAsyncComponent(() => import('@/components/PoliticsTermDrill.vue'))
const PoliticsWrongDrill = defineAsyncComponent(() => import('@/components/PoliticsWrongDrill.vue'))

// 默认落地「今日动作」：打开就知道今天练什么；?tab= 仍可直达任意页签
const activeTab = ref('today')

const route = useRoute()
const TAB_NAMES = ['today', 'vuln', 'knowledge', 'atlas', 'recite', 'terms', 'practice', 'diagnosis']
// 向后兼容：路线图/我的打法已折叠进「今日动作」，记忆图谱+逻辑图谱已合并为「图谱」，
// 旧书签与组件里的旧链接继续可用。
const LEGACY_TAB: Record<string, string> = {
  roadmap: 'today', playbook: 'today', mindmap: 'atlas', logic: 'atlas',
}
function resolveTab(v?: string | null): string | null {
  if (!v) return null
  const key = LEGACY_TAB[v] || v
  return TAB_NAMES.includes(key) ? key : null
}
const qTab = route.query.tab as string | undefined
{ const t = resolveTab(qTab); if (t) activeTab.value = t }
watch(() => route.query.tab, (v) => { const t = resolveTab(v as string | undefined); if (t) activeTab.value = t })

// 政治漏洞卡：进入政治页就静默灌入间隔重复队列（幂等、失败静默），
// 今日动作页的"到期 N 张"和 /srs 的池子都依赖它。
const srs = useSrsStore()
srs.init()
srs.seedPolitics().catch(() => { /* 离线或数据缺失时静默 */ })

// 真题演练室页签角标：未掌握题数由「我的打法」与错题本共用，这里不再重复统计
</script>

<template>
  <div class="politics-container">
    <header class="page-hero">
      <div class="hero-grid"></div>
      <div class="hero-glow"></div>
      <div class="hero-inner">
        <span class="hero-kicker">POLITICS · 政治 · 目标70+</span>
        <h1 class="hero-title">政治<span class="gold">作战室</span></h1>
        <p class="hero-sub">今日动作 · 考点漏洞地图 · 知识框架 · 图谱 · 背诵卡片 · 演练回炉 —— 一屏开工</p>
      </div>
    </header>

    <div class="tab-navigation">
      <el-tabs v-model="activeTab" class="politics-tabs">
        <!-- ══ 页签1：今日动作（默认落地，含折叠的我的打法 + 路线图）══ -->
        <el-tab-pane label="📌 今日动作" name="today">
          <PoliticsToday />
        </el-tab-pane>

        <!-- ══ 页签2：考点漏洞地图（483题→381簇/417手册节点）══ -->
        <el-tab-pane label="🕳 考点漏洞地图" name="vuln" lazy>
          <PoliticsVulnMap />
        </el-tab-pane>

        <!-- ══ 页签3：知识框架 ══ -->
        <el-tab-pane label="🧱 知识框架" name="knowledge" lazy>
          <PoliticsKnowledge />
        </el-tab-pane>

        <!-- ══ 页签4：图谱（记忆图谱 + 逻辑图谱合并）══ -->
        <el-tab-pane label="🧠 图谱" name="atlas" lazy>
          <PoliticsAtlas />
        </el-tab-pane>

        <!-- ══ 页签5：背诵卡片 ══ -->
        <el-tab-pane label="🃏 背诵卡片" name="recite" lazy>
          <PoliticsReciteCards />
        </el-tab-pane>

        <!-- ══ 页签6：定位词速答 ══ -->
        <el-tab-pane label="🎯 定位词速答" name="terms" lazy>
          <PoliticsTermDrill />
        </el-tab-pane>

        <!-- ══ 页签7：真题演练室 ══ -->
        <el-tab-pane label="⚔️ 真题演练室" name="practice" lazy>
          <div class="drill-wrap">
            <PoliticsWrongDrill />
          </div>
          <h3 class="practice-sub">📌 刷题平台与资料使用指引</h3>
          <div class="practice-grid">
            <section class="practice-card brick">
              <div class="pc-head">
                <span class="pc-icon">🧱</span>
                <div>
                  <h3>研砖 · 政治真题在线</h3>
                  <p>政治真题在线刷题平台（需注册），按年/按考点刷题，含答案解析</p>
                </div>
              </div>
              <a class="pc-btn" href="https://www.mathbrick.cn/politics" target="_blank" rel="noopener">
                进入研砖政治板块 ↗
              </a>
              <ul class="pc-points">
                <li>选择题按年份实战，训练考场节奏</li>
                <li>10月开始后每周至少一套真题选择题</li>
              </ul>
            </section>

            <section class="practice-card guide">
              <div class="pc-head">
                <span class="pc-icon">📕</span>
                <div>
                  <h3>肖秀荣系列使用指引</h3>
                  <p>肖1000 → 肖8 → 肖4，三件套各司其职</p>
                </div>
              </div>
              <ul class="pc-points xiao">
                <li><strong>肖1000题</strong>：8-10月，按章刷+二刷错题，只用铅笔做、可反复</li>
                <li><strong>肖八</strong>：11月，选择题刷到全对，大题读思路不背</li>
                <li><strong>肖四</strong>：12月，4×4 道大题全文背诵，考前每天过一遍</li>
              </ul>
            </section>

            <section class="practice-card wrong">
              <div class="pc-head">
                <span class="pc-icon">📋</span>
                <div>
                  <h3>政治错题回收</h3>
                  <p>刷题中的错题统一录入全科错题本，按遗忘曲线回顾</p>
                </div>
              </div>
              <router-link class="pc-btn local" to="/wrong-problems?subject=politics">
                打开全科错题本 →
              </router-link>
              <ul class="pc-points">
                <li>错题记录时注明考点（如"马原-矛盾论"），方便按块回炉</li>
                <li>考前两周只看错题不再做新题</li>
              </ul>
            </section>
          </div>
        </el-tab-pane>

        <!-- ══ 页签5：错因诊断 ══ -->
        <el-tab-pane label="🩺 错因诊断" name="diagnosis" lazy>
          <PoliticsDiagnosis />
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

/* ══ 作战室页头 ══ */
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

/* ══ 页签容器 ══ */
.tab-navigation {
  background: #fff;
  border-radius: 14px;
  padding: 24px 28px;
  border: 1px solid var(--line);
  box-shadow: 0 4px 20px rgba(13, 33, 55, 0.06);
}

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
  color: var(--subject);
  font-weight: 700;
}
.politics-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, var(--subject), #d94848);
  height: 3px;
  border-radius: 2px;
}

/* 路线图 / 我的打法的样式已随组件抽离到 PoliticsRoadmap.vue、PoliticsPlaybook.vue */

/* ══ 页签4：真题演练室 ══ */
.drill-wrap {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 22px 24px;
  margin-bottom: 20px;
}
.practice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 18px;
}
.practice-sub {
  font-size: 1.05rem;
  color: var(--navy);
  margin: 6px 0 14px;
  padding-left: 10px;
  border-left: 4px solid var(--gold);
}

.practice-card {
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 22px 24px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: all 0.28s ease;
}

.practice-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 28px rgba(13, 33, 55, 0.12);
}

.practice-card.brick:hover { border-color: var(--subject); }
.practice-card.guide:hover { border-color: var(--gold); }
.practice-card.wrong:hover { border-color: var(--navy); }

.pc-head {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.pc-icon {
  font-size: 1.9rem;
  line-height: 1.2;
}

.pc-head h3 {
  margin: 0 0 4px;
  font-size: 1.02rem;
  color: var(--ink);
  letter-spacing: 0.02em;
}

.pc-head p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--muted);
  line-height: 1.6;
}

.pc-btn {
  display: inline-block;
  align-self: flex-start;
  background: linear-gradient(135deg, var(--subject), #d94848);
  color: #fff;
  font-weight: 700;
  font-size: 0.88rem;
  padding: 10px 22px;
  border-radius: 10px;
  text-decoration: none;
  letter-spacing: 0.04em;
  box-shadow: 0 4px 14px rgba(245, 108, 108, 0.3);
  transition: all 0.22s ease;
}

.pc-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(245, 108, 108, 0.42);
  color: #fff;
}

.pc-btn.local {
  background: linear-gradient(135deg, var(--navy), #1e4576);
  box-shadow: 0 4px 14px rgba(22, 52, 92, 0.3);
}

.pc-btn.local:hover {
  box-shadow: 0 8px 20px rgba(22, 52, 92, 0.42);
}

.pc-points {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.pc-points li {
  position: relative;
  padding-left: 20px;
  font-size: 0.82rem;
  color: var(--body);
  line-height: 1.65;
}

.pc-points li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--gold);
  font-weight: 800;
}

.pc-points.xiao li strong {
  color: var(--subject);
}

/* ══ 响应式 ══ */
@media (max-width: 768px) {
  .page-hero {
    padding: 26px 20px 22px;
    border-radius: 10px;
  }
  .tab-navigation {
    padding: 14px;
  }
  .politics-tabs :deep(.el-tabs__item) {
    padding: 0 12px;
    font-size: 0.88rem;
  }
  .practice-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .practice-card {
    transition: none;
  }
}
</style>
