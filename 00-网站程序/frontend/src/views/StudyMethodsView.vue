<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTodayStatusStore } from '@/stores/todayStatus'
import { subjectTabs, studyMethods, mottos } from '@/data/studyMethods'

const store = useTodayStatusStore()

// ---------- 当前科目 ----------
const activeSubject = ref('math')
const cm = computed(() => (studyMethods as any)[activeSubject.value])

// ---------- 工具箱渐进披露（此刻聚焦 / 展开全部 / 进阶淡显） ----------
const showAllTools = ref(false)
const focusTitles = computed<string[]>(() => (cm.value && (cm.value as any).focus) || [])
const advancedTitles = computed<string[]>(() => (cm.value && (cm.value as any).advanced) || [])
const focusTools = computed<any[]>(() => {
  const tk = (cm.value as any)?.toolkit || []
  return tk.filter((t: any) => focusTitles.value.includes(t.title))
})
const restTools = computed<any[]>(() => {
  const tk = (cm.value as any)?.toolkit || []
  return tk.filter((t: any) => !focusTitles.value.includes(t.title))
})

// ---------- 实时数据（倒计时 / 各科进度） ----------
const daysToExam = computed(() => store.daysToExam)
const overallPrep = computed(() => store.overallPrep.actual)
const progressMap = computed(() => {
  const m: Record<string, number> = {}
  store.plans.forEach((p: any) => { m[p.key] = Math.round((p.completedUnits / p.totalUnits) * 100) })
  return m
})

const mottoIdx = ref(0)
const currentMotto = computed(() => mottos[mottoIdx.value % mottos.length])
let mottoTimer: ReturnType<typeof setInterval> | null = null

// ---------- 阶段手风琴 ----------
const openPhases = ref<number[]>([1])
const togglePhase = (i: number) => {
  const idx = openPhases.value.indexOf(i)
  if (idx >= 0) openPhases.value.splice(idx, 1)
  else openPhases.value.push(i)
}

const switchSubject = (key: string) => {
  activeSubject.value = key
  openPhases.value = [1]
  showAllTools.value = false
}

onMounted(() => {
  store.load()
  mottoTimer = setInterval(() => {
    mottoIdx.value = (mottoIdx.value + 1) % mottos.length
  }, 6000)
})
onUnmounted(() => { if (mottoTimer) clearInterval(mottoTimer) })
</script>

<template>
  <div class="methods">
    <!-- ① 作战手册头 -->
    <header class="hero">
      <div class="hero-grid"></div>
      <div class="hero-glow"></div>
      <div class="hero-top">
        <div class="hero-title-block">
          <span class="hero-kicker">STUDY PLAYBOOK · 27考研 · 浙大海宁</span>
          <h1 class="hero-title">学习方法<span class="gold">作战手册</span></h1>
          <div class="hero-phase">
            <span class="phase-pulse"></span>
            当前阶段 · 强化期（7-9月）
          </div>
        </div>
        <div class="hero-stats">
          <div class="hero-stat">
            <span class="stat-num">{{ daysToExam }}</span>
            <span class="stat-label">距初试（天）</span>
          </div>
          <div class="hero-divider"></div>
          <div class="hero-stat">
            <span class="stat-num">{{ overallPrep }}<i>%</i></span>
            <span class="stat-label">整体备考进度</span>
          </div>
        </div>
      </div>
      <div class="hero-motto">
        <transition name="motto-fade" mode="out-in">
          <span :key="mottoIdx">「{{ currentMotto }}」</span>
        </transition>
      </div>
    </header>

    <!-- ② 科目页签 -->
    <nav class="tab-rail">
      <button
        v-for="t in subjectTabs"
        :key="t.key"
        class="tab"
        :class="{ active: activeSubject === t.key }"
        :style="{ '--tab-color': t.color }"
        @click="switchSubject(t.key)"
      >
        <span class="tab-icon">{{ t.icon }}</span>
        <span class="tab-label">{{ t.label }}</span>
        <span v-if="progressMap[t.key] !== undefined" class="tab-prog">{{ progressMap[t.key] }}%</span>
      </button>
    </nav>

    <!-- ③ 内容区 -->
    <div class="content">
      <!-- 强化期作战图 -->
      <section v-if="cm.intensive" class="battle">
        <div class="battle-head">
          <div class="battle-title">
            <span class="battle-pulse" :style="{ background: cm.color }"></span>
            <h2>强化期作战图</h2>
            <span class="battle-period">{{ cm.intensive.period }}</span>
          </div>
          <span class="battle-note">基于最新高分经验贴 · 针对当前阶段</span>
        </div>
        <div class="battle-focus">{{ cm.intensive.focus }}</div>
        <div class="battle-actions">
          <div v-for="(a, i) in cm.intensive.actions" :key="i" class="action">
            <div class="a-top">
              <span class="a-tag" :style="{ background: cm.color + '1f', color: cm.color, borderColor: cm.color + '55' }">{{ a.tag }}</span>
              <strong>{{ a.title }}</strong>
            </div>
            <p>{{ a.detail }}</p>
          </div>
        </div>
        <div class="battle-rhythm">
          <div class="rhythm">
            <span class="r-label">上午</span>
            <p>{{ cm.intensive.rhythm.morning }}</p>
          </div>
          <div class="rhythm">
            <span class="r-label">下午</span>
            <p>{{ cm.intensive.rhythm.afternoon }}</p>
          </div>
          <div class="rhythm">
            <span class="r-label">晚上</span>
            <p>{{ cm.intensive.rhythm.evening }}</p>
          </div>
        </div>
      </section>

      <!-- 核心军规 -->
      <section class="card">
        <div class="card-head">
          <h2>核心军规</h2>
          <span class="head-note">{{ cm.corePrinciples.length }} 条铁律</span>
        </div>
        <div class="principle-list">
          <div v-for="(p, i) in (cm.corePrinciples as any[])" :key="i" class="principle">
            <span class="p-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <div class="p-body">
              <div class="p-top">
                <strong>{{ p.title }}</strong>
                <span class="p-star">{{ p.star }}</span>
              </div>
              <p>{{ p.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 方法论工具箱（渐进披露：此刻在用 → 展开全部 → 进阶淡显） -->
      <section v-if="cm.toolkit" class="card">
        <div class="card-head">
          <h2>方法论工具箱</h2>
          <span class="head-note">{{ cm.toolkit.length }} 个方法 · 可直接套用</span>
        </div>

        <!-- 此刻在用 -->
        <div v-if="focusTools.length" class="tk-focus-wrap">
          <div class="tk-focus-label">🎯 此刻在用 · {{ focusTools.length }} 个<span class="tk-focus-hint">——先做透这几个，别一次铺开</span></div>
          <div class="toolkit-grid">
            <div v-for="(tk, ti) in focusTools" :key="'f'+ti" class="toolkit-card tk-focus" :class="{ 'tk-ai': tk.ai }">
              <div class="tk-head">
                <span class="tk-icon">{{ tk.icon }}</span>
                <div class="tk-title-block">
                  <strong>{{ tk.title }}<span v-if="tk.src" class="tk-badge">{{ tk.src }}新增</span></strong>
                  <span class="tk-when">适用 · {{ tk.when }}</span>
                </div>
              </div>
              <ol class="tk-steps"><li v-for="(s, si) in tk.steps" :key="si">{{ s }}</li></ol>
              <details v-if="tk.controversy" class="tk-controversy">
                <summary>⚠️ 有不同声音 · 点开看</summary>
                <ul><li v-for="(c, ci) in tk.controversy" :key="ci">{{ c }}</li></ul>
              </details>
            </div>
          </div>
        </div>

        <!-- 展开全部（备用方法，默认折叠） -->
        <button
          v-if="restTools.length && focusTools.length"
          class="tk-toggle"
          @click="showAllTools = !showAllTools"
        >
          <span class="tk-toggle-arrow" :class="{ open: showAllTools }">▸</span>
          {{ showAllTools ? '收起备用方法' : '展开全部方法' }} · {{ restTools.length }} 个备用
        </button>

        <div v-show="showAllTools || !focusTools.length" class="toolkit-grid tk-rest">
          <div v-for="(tk, ti) in restTools" :key="'r'+ti" class="toolkit-card" :class="{ 'tk-ai': tk.ai, 'tk-new': tk.src, 'tk-advanced': advancedTitles.includes(tk.title) }">
            <div class="tk-head">
              <span class="tk-icon">{{ tk.icon }}</span>
              <div class="tk-title-block">
                <strong>{{ tk.title }}<span v-if="tk.src" class="tk-badge">{{ tk.src }}新增</span><span v-if="advancedTitles.includes(tk.title)" class="tk-adv-badge">进阶 · 先用主流程</span></strong>
                <span class="tk-when">适用 · {{ tk.when }}</span>
              </div>
            </div>
            <ol class="tk-steps"><li v-for="(s, si) in tk.steps" :key="si">{{ s }}</li></ol>
            <details v-if="tk.controversy" class="tk-controversy">
              <summary>⚠️ 有不同声音 · 点开看</summary>
              <ul><li v-for="(c, ci) in tk.controversy" :key="ci">{{ c }}</li></ul>
            </details>
          </div>
        </div>
      </section>

      <!-- 专题指南（题型识别决策树 / 题型归类清单，通用） -->
      <section v-if="cm.topicGuide" class="card guide-card">
        <div class="card-head">
          <h2>{{ cm.topicGuide.head }}</h2>
          <span class="head-note">{{ cm.topicGuide.note }}</span>
        </div>
        <p class="guide-intro">{{ cm.topicGuide.intro }}</p>
        <div class="guide-list">
          <div v-for="(g, gi) in (cm.topicGuide.items as any[])" :key="gi" class="guide-item">
            <div class="gi-head">
              <span class="gi-icon">{{ g.icon }}</span>
              <strong>{{ g.title }}</strong>
              <span class="gi-tag">{{ g.tag }}</span>
            </div>
            <ul class="gi-points">
              <li v-for="(p, pi) in g.points" :key="pi">{{ p }}</li>
            </ul>
            <div v-if="g.tip" class="gi-tip">⚠️ {{ g.tip }}</div>
          </div>
        </div>
      </section>

      <!-- 全程阶段规划（手风琴时间轴） -->
      <section v-if="cm.phases" class="card">
        <div class="card-head">
          <h2>全程阶段规划</h2>
          <span class="head-note">点击展开详情</span>
        </div>
        <div class="timeline">
          <div
            v-for="(ph, i) in (cm.phases as any[])"
            :key="i"
            class="phase"
            :class="{ now: ph.now, open: openPhases.includes(i) }"
          >
            <button class="phase-head" @click="togglePhase(i)">
              <span class="phase-dot"></span>
              <span class="phase-num">第{{ i + 1 }}轮</span>
              <span class="phase-name">{{ ph.name }}</span>
              <span class="phase-time">{{ ph.time }} · {{ ph.duration }}</span>
              <span v-if="ph.now" class="phase-now-badge">当前</span>
              <span class="phase-chevron">▾</span>
            </button>
            <div v-show="openPhases.includes(i)" class="phase-body">
              <div class="pb-block">
                <h4>🎯 阶段目标</h4>
                <ul class="pb-list"><li v-for="(g, gi) in ph.goals" :key="gi">{{ g }}</li></ul>
              </div>
              <div v-if="ph.subPhases" class="pb-block">
                <h4>📋 阶段细分</h4>
                <div v-for="(sub, si) in ph.subPhases" :key="si" class="subphase">
                  <strong>{{ sub.name }}</strong>
                  <ul class="pb-list"><li v-for="(t, ti) in sub.tasks" :key="ti">{{ t }}</li></ul>
                </div>
              </div>
              <div v-if="ph.schedule" class="pb-block sched-block">
                <h4>⏰ 每日节奏</h4>
                <div class="sched-row"><span class="s-label">上午</span>{{ ph.schedule.morning }}</div>
                <div class="sched-row"><span class="s-label">下午</span>{{ ph.schedule.afternoon }}</div>
                <div class="sched-row"><span class="s-label">晚上</span>{{ ph.schedule.evening }}</div>
              </div>
              <div v-if="ph.materials || ph.methods" class="pb-block">
                <h4>📖 {{ ph.materials ? '推荐资料' : '学习方法' }}</h4>
                <ul class="pb-list"><li v-for="(m, mi) in (ph.materials || ph.methods)" :key="mi">{{ m }}</li></ul>
              </div>
              <div v-if="ph.warnings" class="pb-block caution-block">
                <h4>⚠️ 注意事项</h4>
                <ul class="pb-list"><li v-for="(w, wi) in ph.warnings" :key="wi">{{ w }}</li></ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 抗拖延实战指南（仅高效学习） -->
      <section v-if="cm.antiProcrastination" class="card">
        <div class="card-head">
          <h2>抗拖延实战指南</h2>
          <span class="head-note">立即开始</span>
        </div>
        <div class="anti-grid">
          <div v-for="(b, bi) in cm.antiProcrastination" :key="bi" class="anti-block">
            <h3>{{ b.title }}</h3>
            <ul class="pb-list"><li v-for="(it, ii) in b.items" :key="ii">{{ it }}</li></ul>
          </div>
        </div>
      </section>

      <!-- 心态管理专区（仅心态） -->
      <section v-if="cm.isMind" class="mind-note">
        <span class="mn-icon">🫀</span>
        <p>{{ cm.firstAidNote }}</p>
      </section>

      <section v-if="cm.mindFirstAid" class="card mind-card">
        <div class="card-head">
          <h2>焦虑 · 推翻计划急救卡</h2>
          <span class="head-note">体感差的当下，扫一眼</span>
        </div>
        <div class="firstaid-grid">
          <div v-for="(fa, fi) in (cm.mindFirstAid as any[])" :key="fi" class="firstaid">
            <div class="fa-trigger">当 {{ fa.trigger }}</div>
            <ul class="fa-lines">
              <li v-for="(ln, li) in fa.lines" :key="li">{{ ln }}</li>
            </ul>
          </div>
        </div>
      </section>

      <section v-if="cm.milestones" class="card milestone-card">
        <div class="card-head">
          <h2>你已经走到的位置</h2>
          <span class="head-note">反驳"我什么都没做"</span>
        </div>
        <p class="ms-intro">焦虑时大脑会抹掉你的进度。下面是你已完成的真实里程碑，慌了先看这里。</p>
        <ul class="ms-list">
          <li v-for="(m, mi) in (cm.milestones as any[])" :key="mi"><span class="ms-check">✓</span>{{ m }}</li>
        </ul>
      </section>

      <section v-if="cm.inspiration" class="card inspire-card">
        <div class="card-head">
          <h2>他们，也是一路狼狈过来的</h2>
          <span class="head-note">2026 上岸者说</span>
        </div>
        <div class="inspire-grid">
          <div v-for="(ip, ii) in (cm.inspiration as any[])" :key="ii" class="quote">
            <p class="q-line">{{ ip.line }}</p>
            <span class="q-who">—— {{ ip.who }}</span>
          </div>
        </div>
      </section>

      <!-- 名师推荐 + 考场答题技巧 -->
      <div class="duo">
        <section v-if="cm.teacherComparison" class="card">
          <div class="card-head">
            <h2>名师推荐</h2>
            <span class="head-note">按擅长领域</span>
          </div>
          <div class="teacher-list">
            <div v-for="(t, i) in cm.teacherComparison" :key="i" class="teacher">
              <div class="t-top">
                <strong>{{ t.name }}</strong>
                <span class="t-rating">{{ t.rating }}</span>
              </div>
              <p class="t-style">{{ t.style }}</p>
              <span class="t-best">适用 · {{ t.bestFor }}</span>
            </div>
          </div>
        </section>
        <section v-if="cm.examTechniques" class="card">
          <div class="card-head">
            <h2>考场答题技巧</h2>
            <span class="head-note">实战策略</span>
          </div>
          <div class="time-alloc">
            <span class="ta-label">⏱ 时间分配</span>
            <p>{{ cm.examTechniques.timeAllocation }}</p>
          </div>
          <ol class="strat-list">
            <li v-for="(s, i) in cm.examTechniques.strategies" :key="i">{{ s }}</li>
          </ol>
        </section>
      </div>

      <!-- 选填题技巧（数学 · Kira最后六课） -->
      <section v-if="cm.fillBlankSkills" class="card">
        <div class="card-head">
          <h2>选填题技巧</h2>
          <span class="head-note">见风使舵 · 拿捏老头</span>
        </div>
        <div class="time-alloc">
          <span class="ta-label">🎯 心法</span>
          <p>{{ cm.fillBlankSkills.mindset }}</p>
        </div>
        <div v-if="cm.fillBlankSkills.types" class="pb-block">
          <h4>题型五分类 · 读懂命题人意图</h4>
          <ul class="pb-list"><li v-for="(t, i) in cm.fillBlankSkills.types" :key="i"><b>{{ t.tag }}</b>：{{ t.desc }}</li></ul>
        </div>
        <div v-if="cm.fillBlankSkills.methods" class="pb-block">
          <h4>六把刷子 · 稳准狠</h4>
          <ul class="pb-list"><li v-for="(m, i) in cm.fillBlankSkills.methods" :key="i"><b>{{ m.name }}</b>：{{ m.use }}</li></ul>
        </div>
        <div v-if="cm.fillBlankSkills.elimination" class="pb-block">
          <h4>排除错误选项 · 三大法</h4>
          <ul class="pb-list"><li v-for="(e, i) in cm.fillBlankSkills.elimination" :key="i">{{ e }}</li></ul>
        </div>
        <div v-if="cm.fillBlankSkills.strategy" class="pb-block">
          <h4>做局与反做局 · 策略</h4>
          <ul class="pb-list"><li v-for="(s, i) in cm.fillBlankSkills.strategy" :key="i">{{ s }}</li></ul>
        </div>
      </section>

      <!-- 常见误区 · 避坑清单 -->
      <section class="card">
        <div class="card-head">
          <h2>常见误区 · 避坑清单</h2>
          <span class="head-note">{{ cm.commonMistakes.length }} 个坑</span>
        </div>
        <div class="mistake-grid">
          <div v-for="(m, i) in cm.commonMistakes" :key="i" class="mistake">
            <div class="m-wrong">❌ {{ m.mistake }}</div>
            <div class="m-conseq">后果 · {{ m.consequence }}</div>
            <div class="m-fix">✅ {{ m.solution }}</div>
          </div>
        </div>
      </section>

      <!-- 按基础分层策略 -->
      <section v-if="cm.levelAdvice" class="card">
        <div class="card-head">
          <h2>按基础分层策略</h2>
          <span class="head-note">对号入座</span>
        </div>
        <div class="level-list">
          <div class="level lv-weak"><span class="lv-tag">基础薄弱</span><p>{{ cm.levelAdvice.weak }}</p></div>
          <div class="level lv-mid"><span class="lv-tag">基础一般</span><p>{{ cm.levelAdvice.average }}</p></div>
          <div class="level lv-good"><span class="lv-tag">基础较好</span><p>{{ cm.levelAdvice.good }}</p></div>
        </div>
      </section>

      <!-- 推荐学习资料 -->
      <section class="card">
        <div class="card-head">
          <h2>推荐学习资料</h2>
          <span class="head-note">精选清单</span>
        </div>
        <div class="res-grid">
          <div v-for="(cat, ci) in cm.resources" :key="ci" class="res-group">
            <h4>{{ cat.type }}</h4>
            <div class="res-tags">
              <template v-for="(it, ii) in cat.items" :key="ii">
                <a v-if="it && it.url" :href="it.url" target="_blank" class="res-tag res-link">{{ it.text }} ↗</a>
                <span v-else class="res-tag">{{ it }}</span>
              </template>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.methods {
  --font-display: 'Barlow Condensed', 'Arial Narrow', 'PingFang SC', sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
  --ink: #1f2d3d;
  --body: #303133;
  --muted: #5b6b7f;
  --gold: #ffc53d;
  --navy-deep: #0d2137;
  --navy: #16345c;
  --navy-light: #1e4576;
  --line: #e4ebf3;
  --bg-soft: #f5f8fc;
  max-width: 1380px;
  margin: 0 auto;
  padding: 22px 20px 60px;
  color: var(--body);
  display: flex;
  flex-direction: column;
  gap: 18px;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  -webkit-tap-highlight-color: transparent;
}

/* ==================== ① 作战手册头 ==================== */
.hero {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  background: linear-gradient(150deg, var(--navy-deep) 0%, var(--navy) 55%, var(--navy-light) 100%);
  color: #fff;
  padding: 32px 38px 26px;
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
  background-size: 44px 44px;
  pointer-events: none;
}
.hero-glow {
  position: absolute;
  width: 460px;
  height: 460px;
  right: -140px;
  top: -200px;
  background: radial-gradient(circle, rgba(255, 197, 61, 0.2) 0%, transparent 65%);
  pointer-events: none;
}
.hero-top {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  flex-wrap: wrap;
}
.hero-title-block { display: flex; flex-direction: column; gap: 10px; }
.hero-kicker {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 3px;
  color: #a9c2e0;
  text-transform: uppercase;
}
.hero-title {
  margin: 0;
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 800;
  letter-spacing: 2px;
  line-height: 1.15;
  color: #fff;
}
.hero-title .gold { color: var(--gold); margin-left: 6px; }
.hero-phase {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  font-size: 0.85rem;
  font-weight: 600;
  color: #dbe7f5;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 5px 14px;
  border-radius: 999px;
}
.phase-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gold);
  animation: pulse 1.6s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.45; transform: scale(1.35); }
}
.hero-stats { display: flex; align-items: center; gap: 26px; }
.hero-stat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.stat-num {
  font-family: var(--font-display);
  font-size: clamp(2.6rem, 5vw, 3.8rem);
  font-weight: 700;
  line-height: 1;
  color: var(--gold);
  font-variant-numeric: tabular-nums;
}
.stat-num i { font-style: normal; font-size: 0.5em; color: #dbe7f5; margin-left: 2px; }
.stat-label { font-size: 0.78rem; color: #a9c2e0; letter-spacing: 2px; }
.hero-divider { width: 1px; align-self: stretch; background: rgba(255, 255, 255, 0.16); }
.hero-motto {
  position: relative;
  margin-top: 22px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 0.95rem;
  color: #e8eef7;
  letter-spacing: 1px;
  min-height: 1.6em;
}
.motto-fade-enter-active, .motto-fade-leave-active { transition: opacity 0.5s ease, transform 0.5s ease; }
.motto-fade-enter-from { opacity: 0; transform: translateY(8px); }
.motto-fade-leave-to { opacity: 0; transform: translateY(-8px); }

/* ==================== ② 科目页签 ==================== */
.tab-rail {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border: 1px solid var(--line);
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(22, 52, 92, 0.08);
  overflow-x: auto;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
  -webkit-tap-highlight-color: transparent;
}
.tab-rail::-webkit-scrollbar { display: none; }
.tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  scroll-snap-align: start;
  padding: 9px 18px;
  border: none;
  border-bottom: 3px solid transparent;
  border-radius: 10px;
  background: transparent;
  cursor: pointer;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--muted);
  transition: all 0.2s ease;
}
.tab:hover { background: var(--bg-soft); color: var(--ink); transform: translateY(-1px); }
.tab.active {
  color: var(--ink);
  background: color-mix(in srgb, var(--tab-color) 10%, #fff);
  border-bottom-color: var(--tab-color);
}
.tab-icon { font-size: 1.1rem; }
.tab-prog {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--tab-color);
  background: color-mix(in srgb, var(--tab-color) 14%, #fff);
  padding: 2px 8px;
  border-radius: 999px;
}

/* ==================== ③ 通用卡片 ==================== */
.content { display: flex; flex-direction: column; gap: 18px; }
.card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 24px 26px;
  box-shadow: 0 2px 10px rgba(22, 52, 92, 0.05);
}
.card-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 20px;
}
.card-head h2 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
  position: relative;
  padding-left: 13px;
}
.card-head h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 3px;
  bottom: 3px;
  width: 4px;
  border-radius: 2px;
  background: var(--gold);
}
.head-note { font-size: 0.76rem; color: var(--muted); font-family: var(--font-mono); }

/* ==================== 强化期作战图 ==================== */
.battle {
  background: linear-gradient(160deg, #fffdf5, #fff8e6);
  border: 1px solid #f3e5b8;
  border-radius: 18px;
  padding: 26px 28px;
  box-shadow: 0 3px 14px rgba(184, 134, 11, 0.08);
}
.battle-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.battle-title { display: flex; align-items: center; gap: 10px; }
.battle-pulse {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation: pulse 1.6s ease-in-out infinite;
}
.battle-title h2 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--ink);
  letter-spacing: 1px;
}
.battle-period {
  font-family: var(--font-mono);
  font-size: 0.76rem;
  font-weight: 700;
  color: #9a7b2e;
  background: rgba(255, 197, 61, 0.25);
  border: 1px solid #f0d98c;
  padding: 3px 12px;
  border-radius: 999px;
}
.battle-note { font-size: 0.76rem; color: #9a7b2e; font-family: var(--font-mono); }
.battle-focus {
  font-size: 1.02rem;
  font-weight: 600;
  line-height: 1.7;
  color: var(--navy);
  background: rgba(255, 255, 255, 0.7);
  border-left: 4px solid var(--gold);
  border-radius: 0 10px 10px 0;
  padding: 12px 16px;
  margin-bottom: 18px;
}
.battle-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 18px;
}
.action {
  background: #fff;
  border: 1px solid #f0e3b5;
  border-radius: 12px;
  padding: 14px 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.action:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(184, 134, 11, 0.14); }
.a-top { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.a-tag {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 999px;
  border: 1px solid;
  flex-shrink: 0;
}
.a-top strong { font-size: 0.95rem; color: var(--ink); }
.action p { margin: 0; font-size: 0.84rem; line-height: 1.65; color: var(--body); }
.battle-rhythm {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
.rhythm {
  background: var(--navy);
  border-radius: 12px;
  padding: 12px 16px;
  color: #dbe7f5;
}
.r-label {
  display: block;
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--gold);
  margin-bottom: 4px;
}
.rhythm p { margin: 0; font-size: 0.82rem; line-height: 1.55; color: #c8d8ec; }

/* ==================== 核心军规 ==================== */
.principle-list { display: flex; flex-direction: column; gap: 14px; }
.principle {
  display: flex;
  gap: 18px;
  padding: 16px 18px;
  border-radius: 12px;
  background: var(--bg-soft);
  border: 1px solid var(--line);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.principle:hover { transform: translateX(4px); box-shadow: 0 3px 12px rgba(22, 52, 92, 0.08); }
.p-num {
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1;
  color: var(--gold);
  text-shadow: 0 1px 0 rgba(184, 134, 11, 0.25);
  flex-shrink: 0;
}
.p-body { flex: 1; min-width: 0; }
.p-top { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; margin-bottom: 4px; }
.p-top strong { font-size: 1.02rem; color: var(--ink); }
.p-star { font-size: 0.8rem; flex-shrink: 0; }
.p-body p { margin: 0; font-size: 0.9rem; line-height: 1.7; color: var(--body); }

/* ==================== 方法论工具箱 ==================== */
.toolkit-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.toolkit-card {
  background: var(--bg-soft);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 18px 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.toolkit-card:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(22, 52, 92, 0.09); }
.toolkit-card.tk-ai {
  background: linear-gradient(160deg, #f0f7ff, #e9f1fd);
  border-color: #c9ddf6;
}
.toolkit-card.tk-ai:hover { box-shadow: 0 6px 16px rgba(64, 130, 226, 0.14); }
.tk-head { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
.tk-icon { font-size: 1.55rem; line-height: 1.2; flex-shrink: 0; }
.tk-title-block { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.tk-title-block strong { font-size: 1rem; color: var(--ink); }
.tk-when { font-size: 0.72rem; color: var(--muted); font-family: var(--font-mono); letter-spacing: 0.5px; }
.tk-badge { display: inline-block; margin-left: 8px; padding: 1px 7px; font-size: 0.62rem; font-weight: 700; color: #fff; background: #2fa36b; border-radius: 999px; vertical-align: middle; letter-spacing: 0.5px; font-family: var(--font-mono); }
.toolkit-card.tk-new { border-color: rgba(47, 163, 107, 0.45); box-shadow: inset 3px 0 0 #2fa36b; }
.tk-steps { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 7px; }
.tk-steps li { font-size: 0.86rem; line-height: 1.65; color: var(--body); }
.tk-steps li::marker { color: var(--gold); font-weight: 700; font-family: var(--font-display); }

/* 此刻在用 · 聚焦带 */
.tk-focus-wrap {
  background: linear-gradient(160deg, #fffdf5, #fff6e0);
  border: 1px solid #f0dca0;
  border-radius: 14px;
  padding: 14px 16px 16px;
  margin-bottom: 16px;
}
.tk-focus-label {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 0.98rem;
  font-weight: 800;
  color: #9a7b2e;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}
.tk-focus-hint { font-size: 0.76rem; font-weight: 600; color: #b8a064; letter-spacing: 0; }
.toolkit-card.tk-focus {
  background: #fff;
  border: 1.5px solid #f0cf6a;
  box-shadow: 0 3px 12px rgba(184, 134, 11, 0.13);
}
.toolkit-card.tk-focus:hover { box-shadow: 0 7px 18px rgba(184, 134, 11, 0.2); }
.tk-focus-wrap .toolkit-card.tk-ai { background: linear-gradient(160deg, #f3f9ff, #eef5fe); }

/* 展开全部 · 折叠按钮 */
.tk-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: center;
  padding: 11px 16px;
  margin-bottom: 14px;
  border: 1px dashed #c2cee0;
  border-radius: 12px;
  background: var(--bg-soft);
  color: var(--navy);
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}
.tk-toggle:hover { background: #eef4fb; border-color: var(--navy-light); }
.tk-toggle-arrow { display: inline-block; transition: transform 0.2s ease; color: var(--muted); }
.tk-toggle-arrow.open { transform: rotate(90deg); }
.tk-rest { margin-top: 2px; }

/* 进阶 · 淡显 */
.toolkit-card.tk-advanced { opacity: 0.9; background: #fafcfe; }
.tk-adv-badge {
  display: inline-block;
  margin-left: 8px;
  padding: 1px 8px;
  font-size: 0.6rem;
  font-weight: 700;
  color: #fff;
  background: #98a6b8;
  border-radius: 999px;
  vertical-align: middle;
  letter-spacing: 0.4px;
  font-family: var(--font-mono);
}

/* 争议 · 折叠 */
.tk-controversy {
  margin-top: 12px;
  border-top: 1px dashed #e6c58a;
  padding-top: 10px;
}
.tk-controversy summary {
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 700;
  color: #b3801f;
  list-style: none;
  user-select: none;
}
.tk-controversy summary::-webkit-details-marker { display: none; }
.tk-controversy summary::before { content: '▸ '; transition: transform 0.2s ease; }
.tk-controversy[open] summary::before { content: '▾ '; }
.tk-controversy ul { margin: 8px 0 0 0; padding-left: 18px; display: flex; flex-direction: column; gap: 5px; }
.tk-controversy li { font-size: 0.82rem; line-height: 1.6; color: #8a6a2a; background: #fff8ec; border-radius: 6px; padding: 6px 9px; list-style: none; }

/* ==================== 专题指南（决策树 / 题型清单） ==================== */
.guide-intro {
  margin: 0 0 18px 0;
  font-size: 0.92rem;
  line-height: 1.75;
  color: var(--navy);
  background: var(--bg-soft);
  border-left: 4px solid var(--gold);
  border-radius: 0 10px 10px 0;
  padding: 12px 16px;
}
.guide-list { display: flex; flex-direction: column; gap: 14px; }
.guide-item {
  border: 1px solid var(--line);
  border-left: 4px solid var(--navy-light);
  border-radius: 12px;
  background: #fff;
  padding: 16px 18px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.guide-item:hover { transform: translateX(4px); box-shadow: 0 3px 12px rgba(22, 52, 92, 0.08); }
.gi-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; }
.gi-icon { font-size: 1.3rem; line-height: 1.2; flex-shrink: 0; }
.gi-head strong { font-size: 1rem; color: var(--ink); }
.gi-tag {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--navy);
  background: rgba(22, 52, 92, 0.07);
  padding: 3px 11px;
  border-radius: 999px;
  margin-left: auto;
}
.gi-points { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.gi-points li {
  position: relative;
  padding: 2px 0 2px 18px;
  font-size: 0.87rem;
  line-height: 1.65;
  color: var(--body);
}
.gi-points li::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 11px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gold);
}
.gi-tip {
  margin-top: 10px;
  font-size: 0.83rem;
  line-height: 1.6;
  color: #c08a1e;
  background: #fff6ec;
  border-radius: 8px;
  padding: 8px 12px;
}

/* ==================== 阶段时间轴（手风琴） ==================== */
.timeline { display: flex; flex-direction: column; gap: 12px; }
.phase {
  border: 1px solid var(--line);
  border-left: 4px solid #c9d6e5;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.phase.now { border-left-color: var(--gold); background: #fffdf5; }
.phase.open { box-shadow: 0 3px 12px rgba(22, 52, 92, 0.07); }
.phase-head {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 15px 18px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
}
.phase-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #c9d6e5;
  flex-shrink: 0;
}
.phase.now .phase-dot { background: var(--gold); animation: pulse 1.6s ease-in-out infinite; }
.phase-num {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--navy);
  background: rgba(22, 52, 92, 0.07);
  padding: 3px 12px;
  border-radius: 999px;
  flex-shrink: 0;
}
.phase-name { font-weight: 700; color: var(--ink); font-size: 1rem; }
.phase-time { font-family: var(--font-mono); font-size: 0.74rem; color: var(--muted); margin-left: auto; }
.phase-now-badge {
  font-size: 0.68rem;
  font-weight: 700;
  color: #9a7b2e;
  background: rgba(255, 197, 61, 0.3);
  border: 1px solid #f0d98c;
  padding: 2px 10px;
  border-radius: 999px;
  flex-shrink: 0;
}
.phase-chevron { color: var(--muted); transition: transform 0.25s ease; flex-shrink: 0; }
.phase.open .phase-chevron { transform: rotate(180deg); }
.phase-body {
  padding: 4px 20px 20px 44px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.pb-block h4 { margin: 0 0 8px 0; font-size: 0.92rem; font-weight: 700; color: var(--navy); }
.pb-list { list-style: none; margin: 0; padding: 0; }
.pb-list li {
  position: relative;
  padding: 4px 0 4px 18px;
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--body);
}
.pb-list li::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 12px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gold);
}
.subphase {
  background: var(--bg-soft);
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 10px;
}
.subphase:last-child { margin-bottom: 0; }
.subphase strong { display: block; font-size: 0.88rem; color: var(--navy); margin-bottom: 6px; }
.sched-block { background: #f3f0fb; border-radius: 10px; padding: 12px 14px; }
.sched-row { font-size: 0.86rem; color: var(--body); padding: 4px 0; line-height: 1.6; }
.s-label {
  display: inline-block;
  font-weight: 700;
  color: #6d5bb8;
  min-width: 44px;
  margin-right: 8px;
}
.caution-block { background: #fff6ec; border-radius: 10px; padding: 12px 14px; }
.caution-block .pb-list li::before { background: #e6a23c; }

/* ==================== 抗拖延（高效学习） ==================== */
.anti-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.anti-block {
  background: var(--bg-soft);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 18px 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.anti-block:hover { transform: translateY(-3px); box-shadow: 0 5px 14px rgba(22, 52, 92, 0.08); }
.anti-block h3 { margin: 0 0 12px 0; font-size: 1rem; font-weight: 700; color: var(--ink); }

/* ==================== 心态管理专区 ==================== */
.mind-note {
  display: flex;
  align-items: center;
  gap: 14px;
  background: linear-gradient(135deg, #fff0f6, #ffe9f2);
  border: 1px solid #f8c8dd;
  border-radius: 14px;
  padding: 16px 20px;
}
.mind-note .mn-icon { font-size: 1.6rem; line-height: 1; flex-shrink: 0; }
.mind-note p { margin: 0; font-size: 0.95rem; line-height: 1.7; color: #b0346a; font-weight: 600; }
.mind-card { background: linear-gradient(160deg, #fffafc, #fff3f8); border-color: #f6d5e4; }
.firstaid-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.firstaid {
  background: #fff;
  border: 1px solid #f4d3e2;
  border-left: 4px solid #e85d9a;
  border-radius: 12px;
  padding: 16px 18px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.firstaid:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(232, 93, 154, 0.16); }
.fa-trigger { font-size: 0.95rem; font-weight: 700; color: #b0346a; margin-bottom: 10px; }
.fa-lines { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 7px; }
.fa-lines li {
  position: relative;
  padding-left: 18px;
  font-size: 0.86rem;
  line-height: 1.65;
  color: var(--body);
}
.fa-lines li::before { content: '›'; position: absolute; left: 2px; top: 0; color: #e85d9a; font-weight: 700; }
.milestone-card { background: #f6fff4; border-color: #cdecc6; }
.milestone-card .card-head h2::before { background: #67c23a; }
.ms-intro { margin: 0 0 14px 0; font-size: 0.88rem; line-height: 1.7; color: var(--muted); }
.ms-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.ms-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 0.92rem; line-height: 1.6; color: var(--ink); font-weight: 500; }
.ms-check {
  flex-shrink: 0;
  width: 20px; height: 20px; line-height: 20px; text-align: center;
  border-radius: 50%; background: #67c23a; color: #fff; font-size: 0.72rem; font-weight: 700; margin-top: 1px;
}
.inspire-card { background: linear-gradient(160deg, #fffdf5, #fff6e9); border-color: #f2e2bf; }
.inspire-card .card-head h2::before { background: #e6a23c; }
.inspire-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.quote {
  background: #fff;
  border: 1px solid #f0e3c5;
  border-radius: 12px;
  padding: 16px 18px;
  display: flex; flex-direction: column; gap: 8px;
}
.q-line { margin: 0; font-size: 0.95rem; line-height: 1.7; color: var(--navy); font-weight: 600; }
.q-who { align-self: flex-end; font-size: 0.78rem; color: #b08a4a; font-family: var(--font-mono); }

/* ==================== 名师 + 答题技巧 ==================== */
.duo { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; align-items: start; }
.teacher-list { display: flex; flex-direction: column; gap: 12px; }
.teacher {
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--bg-soft);
  border: 1px solid var(--line);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.teacher:hover { transform: translateX(4px); box-shadow: 0 3px 12px rgba(22, 52, 92, 0.08); }
.t-top { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; margin-bottom: 4px; }
.t-top strong { font-size: 1rem; color: var(--ink); }
.t-rating { font-size: 0.78rem; }
.t-style { margin: 0 0 8px 0; font-size: 0.86rem; line-height: 1.6; color: var(--body); }
.t-best {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--navy);
  background: rgba(22, 52, 92, 0.07);
  padding: 3px 10px;
  border-radius: 999px;
}
.time-alloc {
  background: rgba(22, 52, 92, 0.06);
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 16px;
}
.ta-label { display: block; font-size: 0.78rem; font-weight: 700; color: var(--navy); margin-bottom: 4px; }
.time-alloc p { margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--ink); line-height: 1.6; }
.strat-list { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 8px; }
.strat-list li { font-size: 0.88rem; line-height: 1.65; color: var(--body); }
.strat-list li::marker { color: var(--gold); font-weight: 700; }

/* ==================== 常见误区 ==================== */
.mistake-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.mistake {
  border-radius: 12px;
  border: 1px solid var(--line);
  border-left: 4px solid #f56c6c;
  background: #fffafa;
  padding: 15px 17px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.mistake:hover { transform: translateY(-3px); box-shadow: 0 5px 14px rgba(217, 79, 79, 0.1); }
.m-wrong { font-weight: 700; color: #d94f4f; font-size: 0.95rem; margin-bottom: 6px; }
.m-conseq { font-size: 0.82rem; color: var(--muted); margin-bottom: 8px; }
.m-fix { font-size: 0.86rem; font-weight: 600; color: #4a9c2d; background: #f0faea; border-radius: 8px; padding: 8px 10px; }

/* ==================== 分层策略 ==================== */
.level-list { display: flex; flex-direction: column; gap: 12px; }
.level {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  border-radius: 12px;
  border: 1px solid var(--line);
  padding: 14px 16px;
}
.level p { margin: 0; font-size: 0.88rem; line-height: 1.65; color: var(--body); flex: 1; }
.lv-tag {
  font-size: 0.78rem;
  font-weight: 700;
  padding: 3px 12px;
  border-radius: 999px;
  flex-shrink: 0;
}
.lv-weak { border-left: 4px solid #f56c6c; background: #fffafa; }
.lv-weak .lv-tag { background: #fde8e8; color: #d94f4f; }
.lv-mid { border-left: 4px solid #e6a23c; background: #fffcf5; }
.lv-mid .lv-tag { background: #fdf3e0; color: #c08a1e; }
.lv-good { border-left: 4px solid #67c23a; background: #fafff7; }
.lv-good .lv-tag { background: #e8f7e0; color: #4a9c2d; }

/* ==================== 推荐资料 ==================== */
.res-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
.res-group {
  background: var(--bg-soft);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 16px 18px;
}
.res-group h4 {
  margin: 0 0 12px 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--navy);
  padding-bottom: 8px;
  border-bottom: 2px solid var(--gold);
}
.res-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.res-tag {
  font-size: 0.8rem;
  color: var(--body);
  background: #fff;
  border: 1px solid var(--line);
  padding: 5px 12px;
  border-radius: 999px;
  transition: all 0.2s ease;
}
.res-tag:hover { border-color: var(--navy); color: var(--navy); transform: translateY(-1px); }

.res-link {
  text-decoration: none;
  cursor: pointer;
  color: var(--navy);
  border-color: rgba(22, 52, 92, 0.35);
  background: #f0f7ff;
  font-weight: 600;
}
.res-link:hover {
  background: var(--navy);
  color: var(--gold);
  border-color: var(--navy);
}

/* ==================== 响应式 ==================== */
@media (max-width: 1080px) {
  .battle-actions { grid-template-columns: 1fr 1fr; }
  .duo { grid-template-columns: 1fr; }
}
@media (max-width: 860px) {
  .battle-actions, .battle-rhythm { grid-template-columns: 1fr; }
  .mistake-grid, .anti-grid, .toolkit-grid { grid-template-columns: 1fr; }
  .hero-stats { width: 100%; justify-content: flex-start; }
  .hero { padding: 28px 24px 22px; }
  .card { padding: 20px 18px; }
  .battle { padding: 22px 20px; }
}
@media (max-width: 600px) {
  .methods { padding: 14px 12px 40px; gap: 14px; }
  .content { gap: 14px; }
  .hero { padding: 24px 18px 20px; border-radius: 14px; }
  .hero-top { gap: 18px; }
  .hero-stats { gap: 18px; }
  .stat-num { font-size: 2.2rem; }
  .hero-motto { font-size: 0.85rem; margin-top: 16px; padding-top: 12px; }
  .tab-rail { padding: 8px 10px; gap: 6px; border-radius: 12px; }
  .tab { padding: 8px 14px; font-size: 0.86rem; }
  .card { padding: 18px 15px; border-radius: 14px; }
  .card-head { margin-bottom: 16px; }
  .card-head h2 { font-size: 1.08rem; }
  .battle { padding: 20px 16px; }
  .battle-title h2 { font-size: 1.2rem; }
  .battle-focus { font-size: 0.95rem; padding: 10px 14px; }
  .phase-head { padding: 13px 14px; gap: 9px; }
  .phase-body { padding: 4px 16px 16px 20px; }
  .phase-time { display: none; }
  .principle { gap: 12px; padding: 14px 14px; }
  .p-num { font-size: 1.8rem; }
  .tk-steps { padding-left: 16px; }
  .res-grid { grid-template-columns: 1fr; }
}
@media (max-width: 400px) {
  .methods { padding: 12px 10px 36px; }
  .hero { padding: 20px 15px 18px; }
  .hero-title { letter-spacing: 1px; }
  .stat-num { font-size: 1.9rem; }
  .tab { padding: 7px 11px; font-size: 0.82rem; gap: 6px; }
  .tab-icon { font-size: 1rem; }
  .card { padding: 16px 13px; }
  .action, .rhythm { padding: 12px 13px; }
  .principle { padding: 12px 12px; }
  .p-top { flex-wrap: wrap; }
  .level { flex-direction: column; gap: 8px; }
}

/* 动效可访问性 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
