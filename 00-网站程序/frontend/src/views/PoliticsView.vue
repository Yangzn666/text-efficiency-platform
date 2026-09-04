<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'

const PoliticsKnowledge = defineAsyncComponent(() => import('@/components/PoliticsKnowledge.vue'))
const PoliticsReciteCards = defineAsyncComponent(() => import('@/components/PoliticsReciteCards.vue'))

const activeTab = ref('roadmap')

// 备考路线图三阶段数据
const stages = [
  {
    phase: 'PHASE 01',
    time: '8月 - 9月',
    title: '强化筑基期',
    color: 'gold',
    goal: '搭建框架 · 理解考点 · 刷透肖1000题',
    tasks: [
      '主线课程：徐涛强化班（或腿姐考点清单），按马原→毛中特→史纲→思修顺序过一遍',
      '每看完一章立即对应刷肖秀荣《1000题》该章节，当天错题当天订正',
      '马原哲学部分重理解：矛盾、实践、认识论必须能用自己的话讲出来',
      '形策暂不系统投入，每天刷新闻留印象即可'
    ],
    daily: '每日预算 1 - 1.5 小时',
    tip: '此阶段不求全记住，选择题正确率 60% 即达标，重点是建立框架感'
  },
  {
    phase: 'PHASE 02',
    time: '10月',
    title: '真题技巧期',
    color: 'red',
    goal: '真题实战 · 技巧提炼 · 错题回炉',
    tasks: [
      '腿姐技巧班（选择题技巧为主），学会识别命题陷阱与绝对化表述',
      '肖1000题二刷错题与标记题，正确率目标提升至 75%+',
      '研砖政治模块按年刷真题选择题，感受命题风格',
      '开始整理时政热点笔记，跟随主流时政串讲资料'
    ],
    daily: '每日预算 1.5 - 2 小时',
    tip: '多选题是政治拉分核心，错 1 个少 2 分，技巧班的"帽子题"判断法务必练熟'
  },
  {
    phase: 'PHASE 03',
    time: '11月 - 12月',
    title: '冲刺决胜期',
    color: 'navy',
    goal: '肖8肖4 · 时政突击 · 分析题背诵',
    tasks: [
      '肖八到手：选择题全刷、反复刷到全对，分析题只看思路不必背',
      '肖四到手：4 道分析题 × 4 套卷全部背熟，这是政治分析题的保命盘',
      '时政冲刺册 + 各机构押题卷选择题（腿4、徐8等选做）',
      '回顾错题本中的政治错题，考前一周只看不练'
    ],
    daily: '每日预算 2 - 2.5 小时',
    tip: '肖四大题押题命中率常年极高，背诵优先级高于一切，12月每天大声背诵 1 小时'
  }
]
</script>

<template>
  <div class="politics-container">
    <header class="page-hero">
      <div class="hero-grid"></div>
      <div class="hero-glow"></div>
      <div class="hero-inner">
        <span class="hero-kicker">POLITICS · 政治 · 目标70+</span>
        <h1 class="hero-title">政治<span class="gold">作战室</span></h1>
        <p class="hero-sub">路线图 · 知识框架 · 背诵卡片 · 真题演练 —— 一站到位</p>
      </div>
    </header>

    <div class="tab-navigation">
      <el-tabs v-model="activeTab" class="politics-tabs">
        <!-- ══ 页签1：备考路线图 ══ -->
        <el-tab-pane label="🗺️ 备考路线图" name="roadmap">
          <div class="roadmap-intro">
            <span class="ri-icon">🎯</span>
            <div>
              <strong>8月启动，完全来得及</strong>
              <p>政治是所有科目中启动最晚、性价比最高的。现阶段每天 1-1.5 小时足够，切忌过早投入挤压数学与408。以下三阶段计划与主流名师节奏一致，照着执行即可。</p>
            </div>
          </div>

          <div class="timeline">
            <section
              v-for="(s, i) in stages"
              :key="i"
              class="stage-card"
              :class="s.color"
            >
              <div class="stage-rail">
                <span class="stage-dot"></span>
                <span v-if="i < stages.length - 1" class="stage-line"></span>
              </div>
              <div class="stage-body">
                <div class="stage-head">
                  <span class="stage-phase">{{ s.phase }}</span>
                  <span class="stage-time">{{ s.time }}</span>
                  <strong class="stage-title">{{ s.title }}</strong>
                </div>
                <div class="stage-goal">目标：{{ s.goal }}</div>
                <ul class="stage-tasks">
                  <li v-for="(t, j) in s.tasks" :key="j">{{ t }}</li>
                </ul>
                <div class="stage-foot">
                  <span class="stage-daily">⏱ {{ s.daily }}</span>
                  <span class="stage-tip">💡 {{ s.tip }}</span>
                </div>
              </div>
            </section>
          </div>

          <div class="budget-card">
            <h3>📐 现阶段每日时间预算建议</h3>
            <div class="budget-grid">
              <div class="budget-item">
                <strong>1 - 1.5h</strong>
                <span>政治总投入（视频课 + 肖1000）</span>
              </div>
              <div class="budget-item">
                <strong>60%</strong>
                <span>看课与理解（徐涛强化/腿姐考点清单）</span>
              </div>
              <div class="budget-item">
                <strong>40%</strong>
                <span>刷题与订正（肖1000按章同步）</span>
              </div>
              <div class="budget-item">
                <strong>10min</strong>
                <span>睡前翻 2-3 张背诵卡片巩固</span>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- ══ 页签2：知识框架 ══ -->
        <el-tab-pane label="🧱 知识框架" name="knowledge" lazy>
          <PoliticsKnowledge />
        </el-tab-pane>

        <!-- ══ 页签3：背诵卡片 ══ -->
        <el-tab-pane label="🃏 背诵卡片" name="recite" lazy>
          <PoliticsReciteCards />
        </el-tab-pane>

        <!-- ══ 页签4：真题演练室 ══ -->
        <el-tab-pane label="⚔️ 真题演练室" name="practice" lazy>
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
              <router-link class="pc-btn local" to="/wrong-problems">
                打开全科错题本 →
              </router-link>
              <ul class="pc-points">
                <li>错题记录时注明考点（如"马原-矛盾论"），方便按块回炉</li>
                <li>考前两周只看错题不再做新题</li>
              </ul>
            </section>
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

/* ══ 页签1：路线图 ══ */
.roadmap-intro {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  background: linear-gradient(135deg, #fff8ec, #fffdf5);
  border: 1px solid rgba(255, 197, 61, 0.45);
  border-radius: 12px;
  padding: 18px 22px;
  margin-bottom: 26px;
}
.ri-icon {
  font-size: 2rem;
  line-height: 1.2;
}
.roadmap-intro strong {
  display: block;
  color: var(--ink);
  font-size: 1.05rem;
  margin-bottom: 6px;
}
.roadmap-intro p {
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.75;
}

.timeline {
  display: flex;
  flex-direction: column;
}

.stage-card {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 4px;
}

.stage-rail {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stage-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 0 0 2px var(--gold), 0 0 14px rgba(255, 197, 61, 0.5);
  background: var(--gold);
  margin-top: 22px;
  flex-shrink: 0;
}

.stage-card.red .stage-dot {
  background: var(--subject);
  box-shadow: 0 0 0 2px var(--subject), 0 0 14px rgba(245, 108, 108, 0.5);
}

.stage-card.navy .stage-dot {
  background: var(--navy);
  box-shadow: 0 0 0 2px var(--navy), 0 0 14px rgba(22, 52, 92, 0.5);
}

.stage-line {
  flex: 1;
  width: 3px;
  background: linear-gradient(180deg, var(--gold), rgba(255, 197, 61, 0.15));
  border-radius: 2px;
  margin: 6px 0;
}

.stage-body {
  border: 1px solid var(--line);
  border-radius: 14px;
  background: #fff;
  padding: 20px 24px;
  margin-bottom: 22px;
  transition: all 0.28s ease;
}

.stage-body:hover {
  transform: translateX(5px);
  box-shadow: 0 8px 24px rgba(13, 33, 55, 0.1);
  border-color: var(--gold);
}

.stage-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.stage-phase {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  color: var(--gold);
  background: rgba(255, 197, 61, 0.12);
  padding: 3px 10px;
  border-radius: 6px;
  font-weight: 700;
}

.stage-card.red .stage-phase {
  color: var(--subject);
  background: rgba(245, 108, 108, 0.1);
}

.stage-card.navy .stage-phase {
  color: var(--navy);
  background: rgba(22, 52, 92, 0.08);
}

.stage-time {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--muted);
  letter-spacing: 0.05em;
}

.stage-title {
  font-size: 1.15rem;
  color: var(--ink);
  letter-spacing: 0.03em;
}

.stage-goal {
  font-size: 0.88rem;
  color: var(--navy);
  font-weight: 700;
  margin-bottom: 10px;
}

.stage-tasks {
  margin: 0 0 12px;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stage-tasks li {
  position: relative;
  padding-left: 20px;
  font-size: 0.88rem;
  color: var(--body);
  line-height: 1.7;
}

.stage-tasks li::before {
  content: '▸';
  position: absolute;
  left: 2px;
  color: var(--gold);
  font-weight: 700;
}

.stage-foot {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  padding-top: 10px;
  border-top: 1px dashed var(--line);
}

.stage-daily {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--navy);
  background: var(--bg-soft);
  padding: 4px 12px;
  border-radius: 999px;
  white-space: nowrap;
}

.stage-tip {
  font-size: 0.78rem;
  color: #a06a00;
  background: #fff8ec;
  padding: 4px 12px;
  border-radius: 999px;
  line-height: 1.6;
}

.budget-card {
  background: linear-gradient(150deg, var(--navy-deep) 0%, var(--navy) 100%);
  border-radius: 14px;
  padding: 24px 28px;
  margin-top: 6px;
}

.budget-card h3 {
  color: #fff;
  font-size: 1.05rem;
  margin: 0 0 16px;
  letter-spacing: 0.04em;
}

.budget-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.budget-item {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 197, 61, 0.2);
  border-radius: 10px;
  padding: 16px 18px;
  transition: all 0.25s ease;
}

.budget-item:hover {
  background: rgba(255, 197, 61, 0.1);
  transform: translateY(-3px);
}

.budget-item strong {
  display: block;
  font-family: var(--font-display);
  font-size: 1.7rem;
  color: var(--gold);
  letter-spacing: 0.04em;
  margin-bottom: 6px;
}

.budget-item span {
  color: #a8bdd4;
  font-size: 0.8rem;
  line-height: 1.6;
}

/* ══ 页签4：真题演练室 ══ */
.practice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 18px;
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
  .stage-card {
    grid-template-columns: 30px 1fr;
  }
  .budget-card {
    padding: 18px 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .stage-body, .practice-card, .budget-item {
    transition: none;
  }
}
</style>
