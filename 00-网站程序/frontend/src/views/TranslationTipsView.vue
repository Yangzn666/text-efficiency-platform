<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => router.push({ path: '/english', query: { tab: 'translation' } })

const steps = [
  { no: '01', name: '断句切分', desc: '先找谓语动词，按连词/介词/标点把长句切成若干意群，确定主干位置', example: 'Television is one of the means // by which these feelings are created and conveyed // —and perhaps never before has it served so much...' },
  { no: '02', name: '成分分析', desc: '标出主谓宾，识别定语从句/状语从句/非谓语/插入语各自修饰谁', example: '主干：Television is one of the means（电视是手段之一）' },
  { no: '03', name: '组句润色', desc: '按中文表达习惯重组语序，补出省略成分，最后通读检查流畅度', example: '电视是引发和传递这些感受的手段之一……' }
]

const techniques = [
  { name: '词性转换', icon: '🔀', desc: '英文多用名词/介词，中文多用动词。译时把名词、介词、形容词转成动词。', example: 'He is a good eater. → 他很能吃。/ the realization of the dream → 实现梦想' },
  { name: '逆译法', icon: '↩️', desc: '英文后置定语、原因状语从句等，中文习惯前置，需倒着译。', example: 'the book written by Lu Xun → 鲁迅写的书 / because 从句常提前译' },
  { name: '顺译法', icon: '➡️', desc: '叙述顺序与中文一致的句子（时间先后、因果顺序）顺着译即可，不要过度调整。', example: 'He opened the door and walked in. → 他推开门走了进来。' },
  { name: '直译与意译', icon: '⚖️', desc: '能直译尽量直译保留原文形象；文化习语直译费解时意译，但考点句优先直译结构。', example: 'a double-edged sword → 双刃剑（直译通行）/ muddying the waters → 把事情搅浑（意译）' },
  { name: '增译法', icon: '➕', desc: '补出英文省略而中文必需的成分：主语、量词、范畴词等。', example: 'the unemployed → 失业人群 / reading → 阅读这一行为' },
  { name: '省译法', icon: '➖', desc: '英文的冠词、连接词、形式主语 it 等不译或融合，避免译文臃肿。', example: 'It is obvious that... → 显然……（不译 it）' }
]

const structures = [
  { name: '定语从句', tip: '短从句前置译"……的"；长从句拆成独立分句或用"这"复指。' },
  { name: '名词性从句', tip: '主语从句常用"……是……"或"……这一点"引出；同位语从句译为"即/也就是"。' },
  { name: '被动语态', tip: '中文多用主动，译为"被/受到/得以"或直接转主动句。' },
  { name: '倒装句', tip: '先还原正常语序再译；否定词前置的部分倒装（never before has it...）是英一高频考点。' },
  { name: '非谓语结构', tip: '现在分词作状语译"伴随着/通过……"，过去分词译"被/已……"，不定式译目的"为了……"。' },
  { name: '比较结构', tip: 'more A than B 译"与其说B不如说A"；no more than / not so much as 等固定比较句式要背熟。' },
  { name: '强调句与插入语', tip: 'It is...that 强调句译"正是……"；插入语用破折号或括号处理。' }
]

const scoringRules = [
  '每句 2 分，共 5 句 10 分：按意群给分，译出主干给基础分',
  '关键词译错或不译直接扣该意群分数，专有名词可音译/保留原文',
  '译文需要通顺：整句不知所云即使单词对也会被压分',
  '建议时间 25 分钟：5 分钟读文章语境 + 每句 3-4 分钟',
  '答题纸书写工整，修改用单线划掉，禁止涂黑团'
]
</script>

<template>
  <div class="tt-wrap">
    <div class="page-header">
      <el-button type="primary" link @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回翻译主页
      </el-button>
      <h2>⚡ 英一翻译技巧</h2>
      <p>英译汉 · 长难句拆分 · 六大译法 · 评分标准</p>
    </div>

    <!-- 考情速览 -->
    <section class="tt-intro">
      <div class="tt-intro-item">
        <strong>Part C</strong>
        <span>题型位置：阅读 Part C，一篇约400词文章中标出5个划线句</span>
      </div>
      <div class="tt-intro-item">
        <strong>10 分</strong>
        <span>每句 2 分按意群给分，全年得分率普遍偏低，是拉开差距的题型</span>
      </div>
      <div class="tt-intro-item">
        <strong>25 分钟</strong>
        <span>建议用时：先快速浏览全文把握主题，再逐句精译</span>
      </div>
    </section>

    <!-- 三步法 -->
    <h3 class="tt-h3">🧭 长难句翻译三步法</h3>
    <div class="tt-steps">
      <div v-for="s in steps" :key="s.no" class="tt-step">
        <span class="step-no">{{ s.no }}</span>
        <strong>{{ s.name }}</strong>
        <p>{{ s.desc }}</p>
        <code>{{ s.example }}</code>
      </div>
    </div>

    <!-- 六大技巧 -->
    <h3 class="tt-h3">🛠️ 六大核心译法</h3>
    <div class="tt-tech-grid">
      <div v-for="t in techniques" :key="t.name" class="tt-tech">
        <div class="tech-head">
          <span class="tech-icon">{{ t.icon }}</span>
          <strong>{{ t.name }}</strong>
        </div>
        <p>{{ t.desc }}</p>
        <code>{{ t.example }}</code>
      </div>
    </div>

    <!-- 高频结构 -->
    <h3 class="tt-h3">🏗️ 英一高频结构速查</h3>
    <div class="tt-struct-list">
      <div v-for="st in structures" :key="st.name" class="tt-struct">
        <strong>{{ st.name }}</strong>
        <span>{{ st.tip }}</span>
      </div>
    </div>

    <!-- 评分标准 -->
    <h3 class="tt-h3">📏 评分标准与应试要点</h3>
    <ul class="tt-rules">
      <li v-for="(r, i) in scoringRules" :key="i">{{ r }}</li>
    </ul>

    <div class="tt-cta">
      技巧千万条，实战第一条 —— 切换到「真题实战」页签，用 2005-2025 真题逐句练起来！
    </div>
  </div>
</template>

<style scoped>
.tt-wrap {
  --ink: #1f2d3d;
  --body: #303133;
  --gold: #ffc53d;
  --navy: #16345c;
  --navy-deep: #0d2137;
  --line: #e4ebf3;
  --bg-soft: #f5f8fc;
  max-width: 1000px;
  margin: 0 auto;
}
.page-header { text-align: center; margin-bottom: 24px; }
.page-header h2 { font-size: 1.7em; color: var(--navy); margin: 12px 0 8px; }
.page-header p { font-size: 0.92em; color: #5b6b7f; margin: 0; }

.tt-h3 {
  font-size: 1.1rem;
  color: var(--ink);
  margin: 26px 0 14px;
  padding-left: 12px;
  border-left: 4px solid var(--gold);
}

/* 考情速览 */
.tt-intro {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
}
.tt-intro-item {
  background: linear-gradient(160deg, var(--navy-deep), var(--navy));
  border-radius: 12px;
  padding: 18px 20px;
}
.tt-intro-item strong {
  display: block;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 1.7rem;
  color: var(--gold);
  letter-spacing: 0.04em;
  margin-bottom: 6px;
}
.tt-intro-item span {
  color: #a8bdd4;
  font-size: 0.8rem;
  line-height: 1.65;
}

/* 三步法 */
.tt-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
}
.tt-step {
  background: #fff;
  border: 1px solid var(--line);
  border-top: 4px solid var(--gold);
  border-radius: 12px;
  padding: 18px 20px;
}
.step-no {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--gold);
  letter-spacing: 0.15em;
}
.tt-step strong {
  display: block;
  font-size: 1rem;
  color: var(--ink);
  margin: 4px 0 8px;
}
.tt-step p {
  margin: 0 0 10px;
  font-size: 0.82rem;
  color: var(--body);
  line-height: 1.7;
}
.tt-step code, .tt-tech code {
  display: block;
  background: var(--bg-soft);
  border-radius: 8px;
  padding: 8px 12px;
  font-family: 'Georgia', serif;
  font-size: 0.78rem;
  color: var(--navy);
  line-height: 1.7;
  word-break: break-word;
}

/* 六大技巧 */
.tt-tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 14px;
}
.tt-tech {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 16px 18px;
  transition: all 0.22s ease;
}
.tt-tech:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 22px rgba(13, 33, 55, 0.1);
  border-color: var(--gold);
}
.tech-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.tech-icon { font-size: 1.2rem; }
.tech-head strong { color: var(--ink); font-size: 0.95rem; }
.tt-tech p {
  margin: 0 0 10px;
  font-size: 0.8rem;
  color: var(--body);
  line-height: 1.7;
}

/* 高频结构 */
.tt-struct-list { display: flex; flex-direction: column; gap: 8px; }
.tt-struct {
  display: flex;
  gap: 14px;
  align-items: baseline;
  background: #fff;
  border: 1px solid var(--line);
  border-left: 4px solid var(--navy);
  border-radius: 10px;
  padding: 11px 16px;
  transition: all 0.2s;
}
.tt-struct:hover { border-left-color: var(--gold); transform: translateX(4px); }
.tt-struct strong {
  color: var(--navy);
  font-size: 0.88rem;
  white-space: nowrap;
}
.tt-struct span { font-size: 0.8rem; color: var(--body); line-height: 1.65; }

/* 评分标准 */
.tt-rules {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.tt-rules li {
  position: relative;
  padding: 10px 14px 10px 34px;
  background: #fff8ec;
  border-radius: 10px;
  font-size: 0.84rem;
  color: #4a3d1a;
  line-height: 1.7;
}
.tt-rules li::before {
  content: '✓';
  position: absolute;
  left: 12px;
  color: var(--gold);
  font-weight: 800;
}

.tt-cta {
  margin-top: 26px;
  background: linear-gradient(135deg, #fff8ec, #fffdf5);
  border: 1px solid rgba(255, 197, 61, 0.45);
  border-radius: 12px;
  padding: 16px 20px;
  font-size: 0.88rem;
  color: var(--navy);
}
</style>
