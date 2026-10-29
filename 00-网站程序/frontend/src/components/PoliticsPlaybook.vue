<script setup lang="ts">
// 政治 · 我的打法（个性化 playbook）
// 依据：网站经验贴政治部分（得选择题者得天下 / 多选帽子题约占九成 / 肖四必背 / 背诵手册精读做旱区大题保险）
//      + 本人画像（27考研·浙大海宁·跨考408·浙江旱区·政治每天1-1.5h·病灶=新思想单选定位混淆+多选贪多）
// 病灶数字来自错题本实时推导（deriveCause），不写死。
import { ref, computed, onMounted } from 'vue'
import { useWrongProblemsStore } from '@/stores/wrongProblems'
import { POLITICS_WRONG_SEED } from '@/data/politicsWrongSeed'
import { deriveCause, isXxs, CAUSE_META, CAUSE_ORDER, type CauseKey } from '@/data/politicsWrongCause'

const wp = useWrongProblemsStore()
const problems = wp.bind('politics', POLITICS_WRONG_SEED)

// ── 病灶实时统计（只看未掌握的题）──
const unmastered = computed(() => problems.value.filter(p => !p.mastered))
const causeCount = computed(() => {
  const m: Record<CauseKey, number> = { 'single-confuse': 0, 'multi-over': 0, 'multi-under': 0, 'multi-both': 0 }
  unmastered.value.forEach(p => { m[deriveCause(p)]++ })
  return m
})
const xxsUnmastered = computed(() => unmastered.value.filter(isXxs).length)
const causeMax = computed(() => Math.max(1, ...CAUSE_ORDER.map(k => causeCount.value[k])))

// 每条病灶 → 处方 + 直达页签
const RX: Record<CauseKey, { to: string; label: string; act: string }> = {
  'single-confuse': { to: 'logic', label: '逻辑图谱下钻', act: '点板块 hub 看「提问信号→正解帽子」实线；再去定位词速答翻牌' },
  'multi-over':     { to: 'practice', label: '错题再练·按错因回炉', act: '交卷前逐条反问「这选项题干问的那个定位吗？话说绝没绝？」宁缺毋滥' },
  'multi-under':    { to: 'terms', label: '定位词速答补清单', act: '把「四大/五个/四个战略支撑」这类成套结论做成清单先补全再判断' },
  'multi-both':     { to: 'mindmap', label: '记忆图谱搭框架', act: '回炉该节思维导图，先搭框架再刷题，别急着逐个纠错选项' },
}

// ── 阶段打法（按今天日期高亮当前阶段）──
const today = new Date()
const ymd = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
const phases = [
  { id: 'p1', span: '现在 · 10月底 → 11月初', title: '选择题攻坚（拉分核心）', focus: '肖1000二刷错题 + 研砖按年刷真题选择题 + 腿姐技巧班"帽子题"判断法', budget: '1 - 1.5h/天', until: '2026-11-09' },
  { id: 'p2', span: '11月中 → 11月底', title: '肖八 + 启动背诵手册', focus: '肖八选择题刷到全对（大题只读思路不背）；同时启动背诵手册精读第①遍——浙江旱区大题保险', budget: '1.5h/天', until: '2026-11-30' },
  { id: 'p3', span: '12月 → 考前', title: '肖四保命盘（旱区生死线）', focus: '肖四 4×4 道大题全文背诵，每天大声背 1h；时政冲刺册 + 回顾错题本只看不练', budget: '2 - 2.5h/天', until: '2026-12-19' },
]
const currentPhase = computed(() => phases.findIndex(p => ymd <= p.until))
const activeIdx = computed(() => (currentPhase.value < 0 ? phases.length - 1 : currentPhase.value))

// ── 旱区大题保险：背诵手册精读遍数打卡（localStorage 持久）──
const LS_KEY = 'politics-recite-passes-v1'
const TARGET_PASSES = 3
const passes = ref(0)
const passLog = ref<string[]>([])
onMounted(() => {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) { const o = JSON.parse(raw); passes.value = o.passes || 0; passLog.value = o.log || [] }
  } catch { /* noop */ }
})
function save() { try { localStorage.setItem(LS_KEY, JSON.stringify({ passes: passes.value, log: passLog.value })) } catch { /* noop */ } }
function addPass() {
  if (passes.value >= TARGET_PASSES) return
  passes.value++
  passLog.value.unshift(ymd)
  passLog.value = passLog.value.slice(0, 6)
  save()
}
function resetPasses() { passes.value = 0; passLog.value = []; save() }
</script>

<template>
  <div class="pb">
    <!-- 总纲 -->
    <div class="pb-hero">
      <div class="pb-kicker">POLITICS · 我的打法</div>
      <h2 class="pb-title">得选择题者得天下，大题靠背诵手册兜旱区</h2>
      <p class="pb-sub">
        这是把你的<b>错题本病灶</b>和<b>经验贴共识</b>合在一起、只对你一个人成立的打法。
        核心两条：① 政治的分差几乎全在<b>多选题</b>（错 1 个少 2 分，且"帽子题"约占多选九成）——你诊断出的最大失分点正是<b>单选定位混淆</b>和<b>多选贪多</b>；
        ② 你在<b>浙江旱区</b>，大题压分，所以 11 月起必须用<b>背诵手册精读</b>给自己上一道大题保险，别裸奔到 12 月只赌肖四。
      </p>
      <div class="pb-rules">
        <span class="pb-rule">🕐 每天 1 - 1.5h，绝不挤占数学与 408</span>
        <span class="pb-rule">🎯 主攻选择题，大题靠手册+肖四</span>
        <span class="pb-rule">🩹 病灶当天回炉，不留过夜</span>
      </div>
    </div>

    <!-- 病灶 → 处方 -->
    <section class="pb-card">
      <h3 class="pb-h">🩺 我的病灶 → 处方（实时取自错题本）</h3>
      <p class="pb-note">当前未掌握政治错题 <b>{{ unmastered.length }}</b> 道，其中新思想 <b>{{ xxsUnmastered }}</b> 道。按错因排序，点右侧按钮直达对应工具。</p>
      <div class="rx-list">
        <div v-for="k in CAUSE_ORDER" :key="k" class="rx-row">
          <span class="rx-dot" :style="{ background: CAUSE_META[k].hex }"></span>
          <div class="rx-main">
            <div class="rx-top">
              <strong class="rx-label">{{ CAUSE_META[k].label }}</strong>
              <span class="rx-count">{{ causeCount[k] }} 题</span>
            </div>
            <div class="rx-bar"><i :style="{ width: (causeCount[k] / causeMax * 100) + '%', background: CAUSE_META[k].hex }"></i></div>
            <p class="rx-act">→ {{ RX[k].act }}</p>
          </div>
          <router-link class="rx-btn" :to="`/politics?tab=${RX[k].to}`">{{ RX[k].label }} ↗</router-link>
        </div>
      </div>
    </section>

    <!-- 阶段打法 -->
    <section class="pb-card">
      <h3 class="pb-h">📅 阶段打法（当前阶段已高亮）</h3>
      <div class="ph-list">
        <div v-for="(p, i) in phases" :key="p.id" class="ph-row" :class="{ now: i === activeIdx, done: i < activeIdx }">
          <div class="ph-rail"><span class="ph-dot"></span></div>
          <div class="ph-body">
            <div class="ph-head">
              <span class="ph-span">{{ p.span }}</span>
              <span v-if="i === activeIdx" class="ph-badge">进行中</span>
              <span v-else-if="i < activeIdx" class="ph-badge done-badge">已过</span>
              <strong class="ph-title">{{ p.title }}</strong>
            </div>
            <p class="ph-focus">{{ p.focus }}</p>
            <span class="ph-budget">⏱ {{ p.budget }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 每日固定动作 -->
    <section class="pb-card">
      <h3 class="pb-h">🔁 每天 1 小时的固定动作（照做即可）</h3>
      <ol class="routine">
        <li><b>10 min 定位词速答</b>：翻牌自测新思想"帽子"，答错的当场标记。<router-link class="inl" to="/politics?tab=terms"> 去翻牌 ↗</router-link></li>
        <li><b>20 min 错题再练</b>：按"贪多 / 定位混淆"错因回炉 3-5 题，做对 2 次自动毕业。<router-link class="inl" to="/politics?tab=practice"> 去回炉 ↗</router-link></li>
        <li><b>20 min 主线</b>：现阶段=肖1000二刷/真题选择题；11月=肖八选择题；12月=肖四大题背诵。</li>
        <li><b>睡前 10 min</b>：翻 2-3 张背诵卡片 + 瞄一眼逻辑图谱。<router-link class="inl" to="/politics?tab=logic"> 看图谱 ↗</router-link></li>
      </ol>
    </section>

    <!-- 旱区大题保险：背诵手册遍数打卡 -->
    <section class="pb-card insure">
      <div class="ins-head">
        <h3 class="pb-h">🛡️ 旱区大题保险 · 背诵手册精读遍数</h3>
        <span class="ins-tag">目标 {{ TARGET_PASSES }} 遍 · 11 月起</span>
      </div>
      <p class="pb-note">浙江旱区大题普遍压 3-5 分，只赌肖四风险高。用腿姐/徐涛<b>冲刺背诵手册</b>精读打底：每精读一遍点一次打卡，把大题"话术"混熟，考场上即使没押中也有的写。</p>
      <div class="ins-pips">
        <span v-for="n in TARGET_PASSES" :key="n" class="pip" :class="{ on: n <= passes }">{{ n }}</span>
      </div>
      <div class="ins-actions">
        <button class="ins-btn" :disabled="passes >= TARGET_PASSES" @click="addPass">
          {{ passes >= TARGET_PASSES ? '已完成 ' + TARGET_PASSES + ' 遍 ✓' : '精读完成一遍（+' + 1 + '）' }}
        </button>
        <button v-if="passes > 0" class="ins-reset" @click="resetPasses">重置</button>
      </div>
      <p v-if="passLog.length" class="ins-log">最近打卡：{{ passLog.join(' · ') }}</p>
    </section>

    <p class="pb-foot">💡 病灶数字会随你在 <router-link class="inl" to="/politics?tab=diagnosis">错因诊断</router-link> 和 <router-link class="inl" to="/politics?tab=practice">错题再练</router-link> 里的作答自动更新。</p>
  </div>
</template>

<style scoped>
.pb {
  --pb-ink: #1f2d3d; --pb-body: #303133; --pb-muted: #5b6b7f;
  --pb-gold: #ffc53d; --pb-navy: #16345c; --pb-navy-deep: #0d2137;
  --pb-coral: #e8604c; --pb-green: #2e9e6b; --pb-line: #e4ebf3; --pb-soft: #f5f8fc;
  --font-mono: 'JetBrains Mono', monospace;
  color: var(--pb-body);
  display: flex; flex-direction: column; gap: 18px;
}
.pb-hero {
  background: linear-gradient(150deg, var(--pb-navy-deep) 0%, var(--pb-navy) 70%, #1e4576 100%);
  border-radius: 16px; padding: 26px 30px; color: #fff; position: relative; overflow: hidden;
}
.pb-hero::after {
  content: ''; position: absolute; inset: 0;
  background-image: linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);
  background-size: 40px 40px; pointer-events: none;
}
.pb-kicker { font-family: var(--font-mono); font-size: .72rem; letter-spacing: .2em; color: var(--pb-gold); position: relative; z-index: 1; }
.pb-title { font-size: clamp(1.25rem,2.3vw,1.7rem); margin: 8px 0 12px; font-weight: 800; position: relative; z-index: 1; }
.pb-sub { color: #c3d3e6; font-size: .92rem; line-height: 1.85; margin: 0; max-width: 900px; position: relative; z-index: 1; }
.pb-sub b { color: var(--pb-gold); }
.pb-rules { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 16px; position: relative; z-index: 1; }
.pb-rule { font-size: .82rem; font-weight: 700; color: #ffe6a6; background: rgba(255,197,61,.14); border: 1px solid rgba(255,197,61,.3); border-radius: 999px; padding: 5px 14px; }

.pb-card { border: 1px solid var(--pb-line); border-radius: 14px; background: #fff; padding: 20px 24px; }
.pb-h { font-size: 1.12rem; color: var(--pb-ink); margin: 0 0 6px; padding-left: 12px; border-left: 4px solid var(--pb-gold); }
.pb-note { font-size: .86rem; color: var(--pb-muted); margin: 4px 0 14px; line-height: 1.7; }
.pb-note b { color: var(--pb-navy); }

.rx-list { display: flex; flex-direction: column; gap: 12px; }
.rx-row { display: grid; grid-template-columns: 14px 1fr auto; gap: 12px; align-items: center; padding: 12px 14px; border: 1px solid var(--pb-line); border-radius: 10px; background: var(--pb-soft); }
.rx-dot { width: 12px; height: 12px; border-radius: 50%; }
.rx-top { display: flex; align-items: baseline; gap: 10px; }
.rx-label { font-size: .95rem; color: var(--pb-ink); }
.rx-count { font-family: var(--font-mono); font-size: .82rem; font-weight: 700; color: var(--pb-coral); }
.rx-bar { height: 7px; border-radius: 4px; background: #e9eef5; margin: 6px 0; overflow: hidden; }
.rx-bar i { display: block; height: 100%; border-radius: 4px; transition: width .4s; }
.rx-act { font-size: .82rem; color: var(--pb-muted); margin: 2px 0 0; line-height: 1.6; }
.rx-btn { white-space: nowrap; text-decoration: none; font-size: .82rem; font-weight: 700; color: #fff; background: linear-gradient(135deg, var(--pb-navy), #1e4576); border-radius: 8px; padding: 8px 14px; }
.rx-btn:hover { box-shadow: 0 6px 16px rgba(22,52,92,.28); }

.ph-list { display: flex; flex-direction: column; }
.ph-row { display: grid; grid-template-columns: 30px 1fr; gap: 6px; }
.ph-rail { display: flex; flex-direction: column; align-items: center; }
.ph-dot { width: 14px; height: 14px; border-radius: 50%; background: #cfd8e3; margin-top: 20px; flex-shrink: 0; }
.ph-row.done .ph-dot { background: var(--pb-green); }
.ph-row.now .ph-dot { background: var(--pb-gold); box-shadow: 0 0 0 3px rgba(255,197,61,.3), 0 0 12px rgba(255,197,61,.5); }
.ph-body { border: 1px solid var(--pb-line); border-radius: 12px; padding: 14px 18px; margin-bottom: 14px; }
.ph-row.now .ph-body { border-color: var(--pb-gold); background: linear-gradient(180deg,#fffdf6,#fff); }
.ph-head { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.ph-span { font-family: var(--font-mono); font-size: .78rem; color: var(--pb-muted); }
.ph-badge { font-size: .7rem; font-weight: 800; color: #8a6100; background: #fdf1d6; border-radius: 6px; padding: 2px 8px; }
.ph-badge.done-badge { color: #1f4d38; background: #e7f4ec; }
.ph-title { font-size: 1.02rem; color: var(--pb-ink); }
.ph-focus { font-size: .88rem; color: var(--pb-body); line-height: 1.7; margin: 6px 0 8px; }
.ph-budget { font-size: .78rem; font-weight: 700; color: var(--pb-navy); background: var(--pb-soft); padding: 3px 12px; border-radius: 999px; }

.routine { margin: 8px 0 0; padding-left: 22px; display: flex; flex-direction: column; gap: 8px; }
.routine li { font-size: .9rem; line-height: 1.75; color: var(--pb-body); }
.routine li b { color: var(--pb-navy); }
.inl { color: var(--pb-navy); font-weight: 700; text-decoration: none; border-bottom: 1px solid var(--pb-gold); margin-left: 4px; }

.insure { border-color: rgba(46,158,107,.4); background: linear-gradient(180deg,#f4fbf7,#fff); }
.ins-head { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px; }
.insure .pb-h { border-left-color: var(--pb-green); }
.ins-tag { font-family: var(--font-mono); font-size: .78rem; color: #1f4d38; background: #e7f4ec; border-radius: 6px; padding: 3px 10px; font-weight: 700; }
.ins-pips { display: flex; gap: 12px; margin: 14px 0; }
.pip { width: 40px; height: 40px; border-radius: 10px; display: grid; place-items: center; font-weight: 800; font-size: 1.05rem; background: #eef2f6; color: #9fb0c2; border: 2px solid #dfe6ee; }
.pip.on { background: var(--pb-green); color: #fff; border-color: var(--pb-green); box-shadow: 0 4px 12px rgba(46,158,107,.3); }
.ins-actions { display: flex; gap: 10px; align-items: center; }
.ins-btn { border: none; cursor: pointer; font-size: .9rem; font-weight: 700; color: #fff; background: linear-gradient(135deg, var(--pb-green), #23845a); border-radius: 10px; padding: 10px 20px; }
.ins-btn:disabled { background: #b9c6d2; cursor: default; }
.ins-btn:not(:disabled):hover { box-shadow: 0 6px 16px rgba(46,158,107,.34); }
.ins-reset { border: 1px solid var(--pb-line); background: #fff; color: var(--pb-muted); border-radius: 8px; padding: 8px 14px; font-size: .82rem; cursor: pointer; }
.ins-log { font-size: .8rem; color: var(--pb-muted); margin: 10px 0 0; font-family: var(--font-mono); }

.pb-foot { font-size: .84rem; color: var(--pb-muted); }

@media (max-width: 768px) {
  .rx-row { grid-template-columns: 12px 1fr; }
  .rx-btn { grid-column: 2; justify-self: start; }
}
</style>
