<script setup lang="ts">
import { ref, computed } from 'vue'

// 八哥作文「综合写作路线图」：审题思维路线 + 大/小作文逻辑流程图 + 组句矩阵
// data 直接吃父级 bage JSON，图从真实模板结构派生，改 JSON 会自动同步
const props = defineProps<{ data: any }>()
const emit = defineEmits<{ (e: 'pickPlugin', id: string): void; (e: 'goto', sec: string): void }>()

const collapsed = ref(false)

// —— 阶段一：任何一篇作文的通用思维路线（静态，八哥方法论）——
const phases = [
  { n: '01', t: '审题定型', c: '读题干 + 看图，先判题型，再圈出"目的"。',
    k: ['大？小？', '图表 / 漫画', '书信·告示·纪要·备忘录'] },
  { n: '02', t: '选骨架', c: '大作文套三段模板；小作文套格式壳 + 挑正文插件。',
    k: ['三段式', '格式壳', '九大插件'] },
  { n: '03', t: '喂槽位', c: '把题干信息灌进【】槽，绝不自己凭空编内容。',
    k: ['主题T', '数据/对象', '原因·意义'] },
  { n: '04', t: '组句成段', c: '核心句 + 斜杠可选替换，用连接词把槽串成段。',
    k: ['核心句', 'First / Besides / Last'] },
  { n: '05', t: '润色去痕', c: '查字数·时态·单复数，做 10–30% 个人化改造。',
    k: ['别千篇一律', '考场 ≤35 分钟'] },
]

// —— 心态三件套：八哥模板的正确用法 ——
const mindset = [
  { ic: '🌳', h: '模板 = 骨架', p: '背的是"先写什么后写什么"的判断树，不是一整篇范文。', tone: 'navy' },
  { ic: '🧩', h: '句式 = 积木', p: '每个【槽位】配一句核心英文，题干喂什么就往里填什么。', tone: 'gold' },
  { ic: '🎯', h: '目的 = 指挥棒', p: '小作文正文写几句，完全由题干目的决定——先定目的再选插件。', tone: 'coral' },
]

// —— 从真实数据派生：大作文两套三段式流程 ——
const bigFlows = computed(() => (props.data?.big || []).map((b: any) => ({
  id: b.id, name: b.name, intro: b.intro,
  steps: (b.paragraphs || []).map((p: any, i: number) => ({
    idx: i + 1,
    title: p.title,
    branches: (p.groups || []).map((g: any) => g.name).filter(Boolean),
  })),
})))

// —— 小作文：格式壳流程 + 插件池矩阵 ——
const smallShell = ['称呼', '首段 · 表明身份 / 目的', '正文 ← 插件拼装', '尾段 · 期待 / 致谢', '落款']
const smallTypes = computed(() => props.data?.small?.types || [])
const plugins = computed(() => props.data?.small?.plugins || [])

// 插件池：按首字归类，做成"选哪个"的速查逻辑
function pick(p: any) { emit('pickPlugin', p.id) }
</script>

<template>
  <section id="bage-sec-map" class="bmap">
    <div class="bm-mast">
      <div class="bm-mast-l">
        <span class="bm-kicker">ROADMAP · 综合写作路线</span>
        <h3 class="bm-title">先想清楚怎么"长"出一篇作文，再去背句子</h3>
        <p class="bm-sub">八哥模板不是让你背整篇，而是给你一条<b>从审题到落笔的思维路线</b>。这张图是总纲，下面大/小作文的流程图都是它的具体展开。</p>
      </div>
      <button class="bm-collapse" @click="collapsed = !collapsed">{{ collapsed ? '▸ 展开路线图' : '▾ 收起' }}</button>
    </div>

    <div v-show="!collapsed" class="bm-body">
      <!-- ① 通用思维路线：五段横向轨道 -->
      <div class="bm-block">
        <h4 class="bm-h4">① 万能落笔路线 · 任何一篇都走这 5 步</h4>
        <div class="bm-rail">
          <span class="bm-rail-line"></span>
          <div v-for="(p, i) in phases" :key="p.n" class="bm-node" :style="{ animationDelay: (i * 90) + 'ms' }">
            <div class="bm-node-badge">{{ p.n }}</div>
            <div class="bm-node-card">
              <strong>{{ p.t }}</strong>
              <p>{{ p.c }}</p>
              <div class="bm-keys">
                <em v-for="k in p.k" :key="k">{{ k }}</em>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ② 大作文行文逻辑 -->
      <div class="bm-block">
        <h4 class="bm-h4">② 大作文 · 三段式行文逻辑（"描述 → 分析 → 评论"）</h4>
        <p class="bm-note">核心思路恒定：<b>第一段描对象、第二段挖原因/意义、第三段给评价/行动</b>。图表和漫画只是"第一段看什么"不同。</p>
        <div v-for="f in bigFlows" :key="f.id" class="bm-flow">
          <div class="bm-flow-head">
            <span class="bm-flow-tag">{{ f.name }}</span>
            <button class="bm-flow-jump" @click="emit('goto', 'bage-sec-big')">看完整句库 →</button>
          </div>
          <div class="bm-steps">
            <template v-for="(s, i) in f.steps" :key="i">
              <div class="bm-step">
                <div class="bm-step-no">第{{ ['一','二','三','四'][s.idx-1] || s.idx }}段</div>
                <div class="bm-step-title">{{ (s.title || '').replace(/^第.段\s*·\s*/, '') || s.title }}</div>
                <div v-if="s.branches.length" class="bm-branch">
                  <span class="bm-branch-lbl">分支</span>
                  <em v-for="b in s.branches" :key="b">{{ b }}</em>
                </div>
              </div>
              <div v-if="i < f.steps.length - 1" class="bm-arrow">➜</div>
            </template>
          </div>
        </div>
      </div>

      <!-- ③ 小作文组句矩阵 -->
      <div class="bm-block">
        <h4 class="bm-h4">③ 小作文 · "格式壳 × 九大插件" 组句法</h4>
        <p class="bm-note">四类应用文共用一条<b>格式壳</b>（头尾固定），正文则按题干"目的"从 9 个插件里拼 1–3 个。<b>换题型不改正文写法，只换插件</b>。</p>

        <div class="bm-shell">
          <template v-for="(s, i) in smallShell" :key="s">
            <div class="bm-shell-node" :class="{ hot: s.includes('插件') }">{{ s }}</div>
            <div v-if="i < smallShell.length - 1" class="bm-arrow sm">➜</div>
          </template>
        </div>

        <div class="bm-matrix">
          <div class="bm-matrix-lbl">四类格式都从这里取正文 ↓</div>
          <div class="bm-plug-pool">
            <button
              v-for="p in plugins" :key="p.id"
              class="bm-plug" @click="pick(p)"
            >
              <span class="bm-plug-n">{{ p.name }}</span>
              <span class="bm-plug-trg">{{ p.trigger }}</span>
            </button>
          </div>
          <div class="bm-types-row">
            <span class="bm-types-lbl">题型：</span>
            <em v-for="t in smallTypes" :key="t.id" class="bm-type">{{ t.name }}</em>
          </div>
        </div>
        <p class="bm-tip">👆 点任一插件，直接跳到下方「九大插件」看它的成套句子。</p>
      </div>

      <!-- ④ 心态三件套 -->
      <div class="bm-block">
        <h4 class="bm-h4">④ 抱什么思维去写 · 三件套</h4>
        <div class="bm-mind">
          <div v-for="m in mindset" :key="m.h" class="bm-mind-card" :class="m.tone">
            <div class="bm-mind-ic">{{ m.ic }}</div>
            <strong>{{ m.h }}</strong>
            <p>{{ m.p }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bmap {
  --bm-navy-deep: #0d2137; --bm-navy: #16345c; --bm-gold: #ffc53d; --bm-gold-d: #c98a1e;
  --bm-coral: #e8604c; --bm-ink: #1f2d3d; --bm-body: #4a5766; --bm-line: #e4ebf3; --bm-soft: #f5f8fc;
  --bm-serif: 'Georgia', 'Times New Roman', serif;
  scroll-margin-top: 62px; margin-bottom: 34px;
}
.bm-mast {
  position: relative; display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap;
  padding: 20px 22px; border-radius: 16px; margin-bottom: 6px; overflow: hidden;
  background: linear-gradient(135deg, var(--bm-navy-deep), var(--bm-navy) 60%, #235182);
  box-shadow: 0 12px 28px -14px rgba(13,33,55,.6);
}
.bm-mast::after {
  content: ''; position: absolute; inset: 0; pointer-events: none; opacity: .45;
  background-image: linear-gradient(rgba(255,197,61,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,197,61,.12) 1px, transparent 1px);
  background-size: 34px 34px;
}
.bm-mast-l { position: relative; z-index: 1; flex: 1; min-width: 240px; }
.bm-kicker { font-size: .68rem; font-weight: 800; letter-spacing: .22em; text-transform: uppercase; color: var(--bm-gold); }
.bm-title { font-family: var(--bm-serif); font-size: 1.5rem; font-weight: 800; color: #fff; margin: 7px 0 8px; line-height: 1.25; }
.bm-sub { font-size: .86rem; line-height: 1.7; color: #c6d6ec; margin: 0; max-width: 60ch; }
.bm-sub b { color: var(--bm-gold); font-weight: 700; }
.bm-collapse {
  position: relative; z-index: 1; flex: none; border: 1.5px solid var(--bm-gold); background: rgba(255,197,61,.1);
  color: var(--bm-gold); padding: 8px 14px; border-radius: 10px; font-size: .8rem; font-weight: 800; cursor: pointer;
}
.bm-collapse:hover { background: rgba(255,197,61,.2); }
.bm-body { padding-top: 8px; }

.bm-block { margin: 26px 0 4px; }
.bm-h4 {
  display: flex; align-items: center; gap: 9px; font-family: var(--bm-serif);
  font-size: 1.12rem; font-weight: 800; color: var(--bm-navy-deep); margin: 0 0 14px; padding-bottom: 9px;
  border-bottom: 2px solid var(--bm-line);
}
.bm-h4::before { content: ''; width: 6px; height: 20px; border-radius: 3px; background: linear-gradient(180deg, var(--bm-gold), var(--bm-gold-d)); }
.bm-note, .bm-tip { font-size: .86rem; line-height: 1.7; color: var(--bm-body); margin: 0 0 16px; }
.bm-note b { color: var(--bm-navy); font-weight: 800; }
.bm-tip { color: #8a5a12; background: #fff7e6; border-radius: 8px; padding: 8px 12px; margin-top: 12px; }

/* ① 轨道 */
.bm-rail { position: relative; display: flex; gap: 12px; overflow-x: auto; padding: 18px 4px 8px; scrollbar-width: thin; }
.bm-rail-line { position: absolute; left: 30px; right: 30px; top: 39px; height: 3px; border-radius: 3px; background: linear-gradient(90deg, var(--bm-gold), var(--bm-navy) 70%, var(--bm-blue, #3a7ca5)); z-index: 0; }
.bm-node { position: relative; z-index: 1; flex: 1 0 190px; max-width: 220px; animation: bm-rise .5s both; }
.bm-node-badge {
  width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; margin: 0 auto 10px;
  font-family: var(--bm-serif); font-weight: 800; font-size: 1.02rem; color: var(--bm-navy-deep);
  background: var(--bm-gold); box-shadow: 0 0 0 4px #fff, 0 6px 16px -6px rgba(200,150,20,.8);
}
.bm-node-card { background: #fff; border: 1px solid var(--bm-line); border-radius: 12px; padding: 13px 14px; text-align: center; box-shadow: 0 6px 16px -12px rgba(20,40,70,.5); }
.bm-node-card strong { display: block; font-size: 1rem; color: var(--bm-navy); margin-bottom: 6px; }
.bm-node-card p { font-size: .8rem; line-height: 1.55; color: var(--bm-body); margin: 0 0 9px; }
.bm-keys { display: flex; flex-wrap: wrap; gap: 5px; justify-content: center; }
.bm-keys em { font-style: normal; font-size: .72rem; font-weight: 700; color: var(--bm-navy); background: var(--bm-soft); border: 1px solid var(--bm-line); border-radius: 6px; padding: 2px 8px; }
@keyframes bm-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }

/* ② 大作文流程 */
.bm-flow { background: #fff; border: 1px solid var(--bm-line); border-radius: 14px; padding: 16px 18px; margin-bottom: 14px; box-shadow: 0 5px 14px -12px rgba(20,40,70,.5); }
.bm-flow-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 14px; }
.bm-flow-tag { font-family: var(--bm-serif); font-size: 1.02rem; font-weight: 800; color: var(--bm-navy-deep); }
.bm-flow-jump { border: 1px solid var(--bm-navy); background: #fff; color: var(--bm-navy); border-radius: 8px; padding: 4px 11px; font-size: .78rem; font-weight: 700; cursor: pointer; }
.bm-flow-jump:hover { background: var(--bm-navy); color: #fff; }
.bm-steps { display: flex; align-items: stretch; gap: 8px; flex-wrap: wrap; }
.bm-step { flex: 1 1 160px; background: var(--bm-soft); border: 1px solid var(--bm-line); border-radius: 11px; padding: 12px 14px; position: relative; }
.bm-step-no { font-size: .72rem; font-weight: 800; letter-spacing: .05em; color: var(--bm-gold-d); }
.bm-step-title { font-size: .95rem; font-weight: 800; color: var(--bm-navy); margin: 3px 0 8px; }
.bm-branch { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; }
.bm-branch-lbl { font-size: .7rem; color: var(--bm-body); margin-right: 2px; }
.bm-branch em { font-style: normal; font-size: .72rem; font-weight: 700; color: #fff; background: linear-gradient(135deg, var(--bm-navy), #2b5488); border-radius: 5px; padding: 2px 8px; }
.bm-arrow { display: grid; place-items: center; color: var(--bm-gold-d); font-size: 1.3rem; font-weight: 900; flex: none; }
.bm-arrow.sm { font-size: 1.05rem; }

/* ③ 小作文壳 + 矩阵 */
.bm-shell { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 18px; padding: 14px 16px; background: var(--bm-soft); border: 1px dashed var(--bm-navy); border-radius: 12px; }
.bm-shell-node { font-size: .84rem; font-weight: 700; color: var(--bm-navy); background: #fff; border: 1px solid var(--bm-line); border-radius: 9px; padding: 8px 13px; }
.bm-shell-node.hot { background: linear-gradient(135deg, var(--bm-coral), #f0795f); color: #fff; border-color: transparent; box-shadow: 0 6px 14px -7px rgba(232,96,76,.8); }
.bm-matrix { border: 1px solid var(--bm-line); border-radius: 14px; padding: 16px 18px; background: #fff; }
.bm-matrix-lbl { font-size: .82rem; font-weight: 800; color: var(--bm-ink); margin-bottom: 12px; }
.bm-plug-pool { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 10px; }
.bm-plug { text-align: left; border: 1.5px solid var(--bm-line); background: var(--bm-soft); border-radius: 10px; padding: 10px 12px; cursor: pointer; transition: all .15s; display: flex; flex-direction: column; gap: 4px; }
.bm-plug:hover { border-color: var(--bm-navy); background: #fff; transform: translateY(-2px); box-shadow: 0 8px 18px -12px rgba(20,40,70,.6); }
.bm-plug-n { font-size: .88rem; font-weight: 800; color: var(--bm-navy); }
.bm-plug-trg { font-size: .74rem; line-height: 1.45; color: var(--bm-body); }
.bm-types-row { display: flex; align-items: center; flex-wrap: wrap; gap: 7px; margin-top: 14px; padding-top: 12px; border-top: 1px dashed var(--bm-line); }
.bm-types-lbl { font-size: .8rem; font-weight: 700; color: var(--bm-ink); }
.bm-type { font-style: normal; font-size: .78rem; font-weight: 700; color: var(--bm-gold-d); background: #fff7e0; border: 1px solid #f0dca0; border-radius: 999px; padding: 3px 11px; }

/* ④ 心态三件套 */
.bm-mind { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 14px; }
.bm-mind-card { border-radius: 14px; padding: 18px; color: #fff; box-shadow: 0 10px 22px -14px rgba(20,40,70,.7); }
.bm-mind-card.navy { background: linear-gradient(150deg, var(--bm-navy-deep), var(--bm-navy)); }
.bm-mind-card.gold { background: linear-gradient(150deg, var(--bm-gold-d), #e0a92e); }
.bm-mind-card.coral { background: linear-gradient(150deg, #d9503c, var(--bm-coral)); }
.bm-mind-ic { font-size: 1.7rem; margin-bottom: 8px; }
.bm-mind-card strong { display: block; font-family: var(--bm-serif); font-size: 1.1rem; margin-bottom: 6px; }
.bm-mind-card p { font-size: .84rem; line-height: 1.6; margin: 0; opacity: .95; }

@media (max-width: 768px) {
  .bm-title { font-size: 1.25rem; }
  .bm-node { flex: 1 0 160px; }
  .bm-arrow { transform: rotate(90deg); }
  .bm-steps { flex-direction: column; }
  .bm-shell { flex-direction: column; align-items: stretch; }
  .bm-shell .bm-arrow { transform: rotate(90deg); align-self: center; }
}
</style>
