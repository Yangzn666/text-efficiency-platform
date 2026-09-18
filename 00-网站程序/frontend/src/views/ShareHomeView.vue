<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ===== 每日一句 · 励志语录轮播 =====
const quotes = [
  '你不需要很厉害才能开始，但你需要开始才能很厉害。',
  '关关难过关关过，前路漫漫亦灿灿。',
  '把书读薄，把题做透，把心稳住。',
  '所谓运气，不过是你的努力刚好碰上了准备。',
  '当坚冰还盖着北海，你要做怒放的梅花。',
  '慢慢来，比较快；稳住，就是最大的效率。',
  '你走的每一步都算数，今天的坚持是明天的底气。',
  '考研这场黑屋子里的洗衣服，穿上身的那一刻，你会感谢现在没放弃的自己。'
]
const qIdx = ref(0)
const qVisible = ref(true)
let qTimer: ReturnType<typeof setInterval> | null = null
function rotateQuote() {
  qVisible.value = false
  setTimeout(() => {
    qIdx.value = (qIdx.value + 1) % quotes.length
    qVisible.value = true
  }, 450)
}
onMounted(() => { qTimer = setInterval(rotateQuote, 7000) })
onBeforeUnmount(() => { if (qTimer) clearInterval(qTimer) })

const modules = [
  {
    icon: '📐',
    title: '数学一知识体系',
    desc: '高等数学 · 线性代数 · 概率统计，章节化知识点梳理 + 配图 + 题型识别决策树',
    tag: '高数 / 线代 / 概率',
    route: '/math/detail',
    color: '#16345c'
  },
  {
    icon: '📇',
    title: '数学速查卡片',
    desc: '公式与定理速查，翻牌自测，考前快速过一遍核心结论',
    tag: '公式 / 定理',
    route: '/math/quickcards',
    color: '#0e7490'
  },
  {
    icon: '🧭',
    title: '数学专题指南',
    desc: '高频题型方法专题 + 真题弱点诊断：曲面积分、参数估计、级数、矩阵方程等的核心方法与易错点',
    tag: '题型 / 方法',
    route: '/math/guide',
    color: '#1d4ed8'
  },
  {
    icon: '🌳',
    title: '数学技能树',
    desc: '数学题型掌握度可视化图谱，一眼看清各模块的熟练度与待突破节点',
    tag: '掌握度图谱',
    route: '/skilltree',
    color: '#059669'
  },
  {
    icon: '💻',
    title: '408 计算机',
    desc: '数据结构 · 组成原理 · 操作系统 · 计算机网络，知识点梳理 + 考频地图 + 费曼学习法',
    tag: '数据结构 / 计组 / OS / 网络',
    route: '/cs408',
    color: '#409EFF'
  },
  {
    icon: '🧠',
    title: '学习方法',
    desc: '各科目强化期策略、刷题与错题复盘方法、费曼学习法与思维导图法',
    tag: '方法论',
    route: '/study-methods',
    color: '#7c3aed'
  },
  {
    icon: '📕',
    title: '政治框架',
    desc: '考研政治五模块知识框架（马原 · 毛中特 · 新思想 · 史纲 · 思修法基）+ 背诵卡片速记',
    tag: '框架 / 背诵',
    route: '/politics',
    color: '#dc2626'
  },
  {
    icon: '📖',
    title: '英语真题精读',
    desc: '考研英语一历年真题：传统阅读 / 完型 / 新题型，逐题解析 + 全文精读翻译与长难句，作答仅存本地浏览器',
    tag: '真题 / 解析 / 精读',
    route: '/english',
    color: '#0f766e'
  },
  {
    icon: '🏫',
    title: '院校查询',
    desc: '11408 考研院校数据库：历年分数线、报录比、招生名额与科目变更',
    tag: '择校参考',
    route: '/universities',
    color: '#b45309'
  }
]

function go(route: string) {
  router.push(route)
}
</script>

<template>
  <div class="share-home">
    <header class="hero">
      <div class="hero-grid"></div>
      <div class="hero-glow"></div>
      <div class="hero-inner">
        <span class="hero-kicker">STUDY · KNOWLEDGE · BASE</span>
        <h1 class="hero-title">考研知识<span class="gold">资料库</span></h1>
        <p class="hero-sub">数学一 · 408 计算机 · 学习方法 · 院校数据 —— 知识点整理与备考参考</p>
      </div>
    </header>

    <section class="daily-quote" :class="{ 'quote-hide': !qVisible }">
      <span class="dq-label">每日一句</span>
      <span class="dq-mark">“</span>
      <span class="dq-text">{{ quotes[qIdx] }}</span>
      <span class="dq-mark dq-mark-end">”</span>
    </section>

    <section class="module-grid">
      <div
        v-for="m in modules"
        :key="m.route"
        class="module-card"
        :style="{ '--accent': m.color }"
        @click="go(m.route)"
      >
        <div class="module-icon">{{ m.icon }}</div>
        <div class="module-body">
          <h3>{{ m.title }}</h3>
          <p>{{ m.desc }}</p>
          <span class="module-tag">{{ m.tag }}</span>
        </div>
        <div class="module-arrow">→</div>
      </div>
    </section>

    <footer class="page-note">
      <p>内容仅供学习交流，知识点以官方教材与最新考纲为准。</p>
    </footer>
  </div>
</template>

<style scoped>
.share-home {
  --font-mono: 'JetBrains Mono', monospace;
  --ink: #1f2d3d;
  --muted: #5b6b7f;
  --gold: #ffc53d;
  --navy-deep: #0d2137;
  --navy: #16345c;
  --line: #e4ebf3;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 0 40px;
}

.hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(150deg, var(--navy-deep) 0%, var(--navy) 60%, #1e4576 100%);
  border-radius: 14px;
  padding: 46px 40px 38px;
  margin-bottom: 28px;
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
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, rgba(255,197,61,0.14) 0%, transparent 70%);
  pointer-events: none;
}
.hero-inner {
  position: relative;
  z-index: 1;
}
.hero-kicker {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  color: var(--gold);
  text-transform: uppercase;
}
.hero-title {
  font-size: clamp(1.9rem, 3.6vw, 2.7rem);
  font-weight: 800;
  color: #fff;
  margin: 10px 0 8px;
  letter-spacing: 0.02em;
}
.hero-title .gold {
  color: var(--gold);
}
.hero-sub {
  color: #a8bdd4;
  font-size: 0.96rem;
  letter-spacing: 0.05em;
  line-height: 1.7;
}

.daily-quote {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(100deg, #fffdf5 0%, #fff 60%);
  border: 1px solid var(--line);
  border-left: 4px solid var(--gold);
  border-radius: 12px;
  padding: 16px 22px;
  margin-bottom: 22px;
  box-shadow: 0 2px 12px rgba(13, 33, 55, 0.05);
  transition: opacity 0.45s ease, transform 0.45s ease;
}
.daily-quote.quote-hide {
  opacity: 0;
  transform: translateY(-4px);
}
.dq-label {
  flex: none;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  color: #8a6d1f;
  background: rgba(255, 197, 61, 0.16);
  border: 1px solid rgba(255, 197, 61, 0.4);
  border-radius: 999px;
  padding: 3px 12px;
  white-space: nowrap;
}
.dq-mark {
  color: var(--gold);
  font-size: 1.4rem;
  font-weight: 800;
  line-height: 1;
}
.dq-mark-end { transform: translateY(0.35rem); }
.dq-text {
  font-size: 1.02rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--ink);
  line-height: 1.6;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 18px;
}
.module-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 22px 20px;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 2px 12px rgba(13, 33, 55, 0.05);
}
.module-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(13, 33, 55, 0.12);
  border-color: var(--accent);
}
.module-icon {
  font-size: 1.9rem;
  line-height: 1;
  flex: none;
}
.module-body {
  flex: 1;
  min-width: 0;
}
.module-body h3 {
  margin: 0 0 6px;
  font-size: 1.08rem;
  font-weight: 700;
  color: var(--ink);
}
.module-body p {
  margin: 0 0 10px;
  font-size: 0.88rem;
  color: var(--muted);
  line-height: 1.6;
}
.module-tag {
  display: inline-block;
  font-size: 0.72rem;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 10%, #fff);
  border: 1px solid color-mix(in srgb, var(--accent) 28%, #fff);
  border-radius: 999px;
  padding: 2px 10px;
  letter-spacing: 0.03em;
}
.module-arrow {
  flex: none;
  color: #c3cede;
  font-size: 1.2rem;
  align-self: center;
  transition: transform 0.2s ease, color 0.2s ease;
}
.module-card:hover .module-arrow {
  transform: translateX(4px);
  color: var(--accent);
}

.page-note {
  margin-top: 30px;
  text-align: center;
}
.page-note p {
  font-size: 0.8rem;
  color: #9aa7b8;
  letter-spacing: 0.04em;
}

@media (max-width: 768px) {
  .hero {
    padding: 32px 22px 28px;
  }
  .daily-quote {
    flex-wrap: wrap;
    gap: 8px;
    padding: 14px 16px;
  }
  .dq-text { font-size: 0.94rem; }
  .module-grid {
    grid-template-columns: 1fr;
  }
}
</style>
