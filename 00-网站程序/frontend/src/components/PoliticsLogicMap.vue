<script setup lang="ts">
// 政治逻辑图谱 · mermaid 粗线大字关系图（辅助记忆：把"帽子—正解—干扰"的从属/并列关系画出来）
// 所有映射均来自错题本订正（politicsWrongCause.TERM_CARDS / 新思想错题），不臆造考点。
import { ref, onMounted, nextTick } from 'vue'
import type Mermaid from 'mermaid'

interface Diagram { key: string; title: string; hook: string; def: string }

const CLASSDEFS = [
  "classDef root fill:#16345c,stroke:#0d2137,stroke-width:3px,color:#ffffff,font-weight:bold;",
  "classDef right fill:#eef8f2,stroke:#2e9e6b,stroke-width:3px,color:#1f4d38;",
  "classDef trap fill:#fff1ee,stroke:#e8604c,stroke-width:3px,color:#8a2b1c,stroke-dasharray:6 4;"
].join("\n")

const diagrams: Diagram[] = [
  {
    key: 'qj', title: '⚔️ 强军 · 三顶帽子别戴反',
    hook: '灵魂/命脉/首要＝听党指挥；核心＝能打胜仗；保证＝作风优良；根本制度＝军委主席负责制。',
    def: `graph TD\n${CLASSDEFS}\n
R["强军目标 · 帽子体系"]:::root
A["听党指挥"]:::right
A1["灵魂 · 命脉 · 建设首要"]:::right
B["能打胜仗"]:::right
B1["强军兴军的核心"]:::right
C["作风优良"]:::right
C1["人民军队的保证"]:::right
D["党对军队绝对领导的<br/>根本制度 / 根本实现形式"]:::right
D1["军委主席负责制"]:::right
D2["支部建在连上 / 政治委员制<br/>＝实现形式之一，非根本"]:::trap
R-->A
A-->A1
R-->B
B-->B1
R-->C
C-->C1
R-->D
D-->D1
D-. 别选 .->D2`
  },
  {
    key: 'yglz', title: '🇭🇰 一国两制 · 谁是根、谁是本',
    hook: '"一国"是前提·根·本；最高原则与根本宗旨都落在"维护国家主权、安全、发展利益"，"和平统一"只是目标。',
    def: `graph TD\n${CLASSDEFS}\n
R["一国两制"]:::root
P["一国"]:::right
P1["前提 · 基础 · 根 · 本"]:::right
Z["两制"]:::right
Z1["从属、派生于'一国'"]:::right
T0["二者等量齐观 / 比肩并列 ✗"]:::trap
H["方针的'最高原则'"]:::right
H1["维护国家主权、安全、发展利益"]:::right
H2["实现祖国和平统一（是目标）"]:::trap
G["根本宗旨"]:::right
G1["维护国家主权安全发展利益<br/>＋ 保持港澳长期繁荣稳定"]:::right
R-->P
P-->P1
R-->Z
Z-->Z1
P1-. 二者不对等 .->T0
R-->H
H-->H1
H-. 别选 .->H2
R-->G
G-->G1`
  },
  {
    key: 'wj', title: '🌍 大国外交 · 主线 / 落脚点 / 目标分层',
    hook: '主线管"复兴＋进步"；出发点和落脚点永远是"国家主权安全发展利益"；"命运共同体"是目标不是主线。',
    def: `graph TD\n${CLASSDEFS}\n
R["中国特色大国外交"]:::root
M["主线"]:::right
M1["服务民族复兴 · 促进人类进步"]:::right
M2["维护世界和平、促进共同发展（是宗旨）"]:::trap
S["对外工作的出发点 · 落脚点"]:::right
S1["维护国家主权、安全、发展利益"]:::right
S2["推动构建人类命运共同体（是目标）"]:::trap
R-->M
M-->M1
M-. 别选 .->M2
R-->S
S-->S1
S-. 别选 .->S2`
  },
  {
    key: 'cl', title: '🔥 全面从严治党 · "最X"帽子矩阵',
    hook: '统领是政治建设；两个"首要任务"分家——政治建设要"服从中央"、党内政治生活要"思想教育"；最彻底自我革命＝反腐败，第一行动＝八项规定，根本目的＝引领社会革命。',
    def: `graph TD\n${CLASSDEFS}\n
R["全面从严治党 · 帽子矩阵"]:::root
A["党的建设的统领"]:::right
A1["政治建设"]:::right
B["政治建设的'首要任务'"]:::right
B1["保证全党服从中央<br/>维护党中央权威和集中统一领导"]:::right
C["党内政治生活的'首要任务'"]:::right
C1["加强思想教育和理论武装"]:::right
C2["保证全党服从中央<br/>（那是政治建设的）"]:::trap
D["最彻底的自我革命"]:::right
D1["反腐败"]:::right
E["再塑党的形象的'第一行动'"]:::right
E1["中央八项规定"]:::right
F["自我革命的'根本目的'"]:::right
F1["引领伟大社会革命"]:::right
F2["跳出历史周期率（是意义，非目的）"]:::trap
G["全面从严治党的定位（多选全选）"]:::right
G1["必由之路 ＋ 鲜明主题 ＋ 伟大实践"]:::right
G2["党的政治建设的首要任务（干扰项）"]:::trap
R-->A
A-->A1
R-->B
B-->B1
R-->C
C-->C1
C-. 别选 .->C2
R-->D
D-->D1
R-->E
E-->E1
R-->F
F-->F1
F-. 别选 .->F2
R-->G
G-->G1
G-. 别选 .->G2`
  },
  {
    key: 'dl', title: '🌱 导论 · 两个结合 & 六个必须坚持',
    hook: '"两个结合"三顶帽子（必由之路 / 根本途径 / 最大法宝）全对，"根本所在"是来蹭的（你上次多选贪多就栽这）；六个必须坚持先把名字记全。',
    def: `graph TD\n${CLASSDEFS}\n
R["新思想 · 导论"]:::root
L["'两个结合' 是（多选 ABC）"]:::right
L1["开辟发展中国特色社会主义的必由之路"]:::right
L2["推进马克思主义中国化时代化的根本途径"]:::right
L3["我们取得成功的最大法宝"]:::right
L4["坚定信仰信念、把握历史主动的'根本所在'"]:::trap
S["'六个必须坚持'（世界观方法论）"]:::right
S1["人民至上 · 自信自立 · 守正创新<br/>问题导向 · 系统观念 · 胸怀天下"]:::right
S2["自信自立 ＝ 内在精神特质"]:::right
R-->L
L-->L1
L-->L2
L-->L3
L-. 别选 .->L4
R-->S
S-->S1
S-->S2`
  }
]

const filter = ref('all')
const visible = ref<Diagram[]>(diagrams)
const setFilter = (k: string) => {
  filter.value = k
  visible.value = k === 'all' ? diagrams : diagrams.filter(d => d.key === k)
}

let mermaidLib: typeof Mermaid | null = null
const getMermaid = async () => {
  if (!mermaidLib) {
    const m = await import('mermaid')
    mermaidLib = m.default
  }
  mermaidLib!.initialize({
    startOnLoad: false,
    theme: 'base',
    securityLevel: 'loose',
    fontFamily: "'PingFang SC','Microsoft YaHei',sans-serif",
    themeVariables: { fontSize: '20px', lineColor: '#5b6b7f', primaryTextColor: '#1f2d3d' },
    flowchart: { useMaxWidth: false, htmlLabels: true, padding: 14, nodeSpacing: 46, rankSpacing: 62, curve: 'basis' }
  })
  return mermaidLib!
}

const elMap = new Map<string, HTMLElement>()
const setRef = (id: string) => (el: any) => { if (el) elMap.set(id, el as HTMLElement) }

const renderOne = async (d: Diagram) => {
  const el = elMap.get(d.key)
  if (!el) return
  try {
    const m = await getMermaid()
    el.innerHTML = ''
    const { svg } = await m.render(`logic-${d.key}-${Date.now()}`, d.def)
    el.innerHTML = svg
  } catch (e) {
    el.innerHTML = `<div class="lg-err">图渲染失败：${(e as Error).message}</div>`
  }
}

const renderAll = async () => {
  await nextTick()
  for (const d of visible.value) await renderOne(d)
}

onMounted(renderAll)
// 切换筛选后重渲染当前可见图
const onFilter = async (k: string) => { setFilter(k); await renderAll() }
</script>

<template>
  <div class="lg">
    <div class="lg-hero">
      <div class="lg-kicker">政治 · 逻辑图谱</div>
      <h2 class="lg-title">粗线大字，把"帽子"之间的关系一次画清</h2>
      <p class="lg-sub">
        你新思想最大的两个失分点是<b>单选定位词张冠李戴</b>和<b>多选贪多</b>。
        下面每张图把「提问信号 → 正解帽子」用<b>绿色实线</b>连好，把最容易顺手多选的
        <b>干扰项</b>用<span class="lg-trap-word">红色虚线</span>标出来——看图回忆，比背条目更牢。
      </p>
      <div class="lg-legend">
        <span><i class="dot root"></i>主题</span>
        <span><i class="dot right"></i>正解帽子</span>
        <span><i class="dot trap"></i>高频干扰（别选）</span>
      </div>
    </div>

    <div class="lg-chips">
      <button :class="{ on: filter === 'all' }" @click="onFilter('all')">全部</button>
      <button v-for="d in diagrams" :key="d.key" :class="{ on: filter === d.key }" @click="onFilter(d.key)">{{ d.title.replace(/^[^\u4e00-\u9fa5A-Za-z]+/, '') }}</button>
    </div>

    <div class="lg-list">
      <section v-for="d in visible" :key="d.key" class="lg-card">
        <h3 class="lg-h">{{ d.title }}</h3>
        <p class="lg-hook">🧠 {{ d.hook }}</p>
        <div class="lg-svg" :ref="setRef(d.key)"></div>
      </section>
    </div>

    <p class="lg-foot">💡 看完图仍拿不准，去 <router-link to="/politics?tab=terms" class="lg-link">定位词速答</router-link> 翻牌自测，或到 <router-link to="/politics?tab=practice" class="lg-link">错题再练</router-link> 按错因回炉。</p>
  </div>
</template>

<style scoped>
.lg {
  --lg-ink: #1f2d3d; --lg-body: #303133; --lg-muted: #5b6b7f;
  --lg-gold: #ffc53d; --lg-navy: #16345c; --lg-navy-deep: #0d2137;
  --lg-coral: #e8604c; --lg-green: #2e9e6b; --lg-line: #e4ebf3; --lg-soft: #f5f8fc;
  --font-display: 'Barlow Condensed', 'FZCuHei', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  color: var(--lg-body);
}
.lg-hero {
  background: linear-gradient(150deg, var(--lg-navy-deep) 0%, var(--lg-navy) 70%, #1e4576 100%);
  border-radius: 16px; padding: 26px 30px; color: #fff; margin-bottom: 18px; position: relative; overflow: hidden;
}
.lg-hero::after {
  content: ''; position: absolute; inset: 0;
  background-image: linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);
  background-size: 40px 40px; pointer-events: none;
}
.lg-kicker { font-family: var(--font-mono); font-size: .72rem; letter-spacing: .2em; color: var(--lg-gold); position: relative; z-index: 1; }
.lg-title { font-size: clamp(1.3rem,2.4vw,1.8rem); margin: 8px 0 10px; font-weight: 800; position: relative; z-index: 1; }
.lg-sub { color: #b9cbe0; font-size: .92rem; line-height: 1.8; margin: 0; max-width: 820px; position: relative; z-index: 1; }
.lg-sub b { color: var(--lg-gold); }
.lg-trap-word { color: #ff8a76; font-weight: 700; }
.lg-legend { display: flex; gap: 20px; margin-top: 16px; flex-wrap: wrap; position: relative; z-index: 1; font-size: .82rem; color: #d5e2f0; }
.lg-legend .dot { display: inline-block; width: 14px; height: 14px; border-radius: 4px; margin-right: 6px; vertical-align: -1px; }
.dot.root { background: var(--lg-navy); border: 2px solid #fff; }
.dot.right { background: #eef8f2; border: 2px solid var(--lg-green); }
.dot.trap { background: #fff1ee; border: 2px dashed var(--lg-coral); }

.lg-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
.lg-chips button { border: 1px solid var(--lg-line); background: #fff; color: var(--lg-muted); padding: 8px 16px; border-radius: 999px; font-size: .9rem; font-weight: 600; cursor: pointer; transition: all .18s; }
.lg-chips button:hover { border-color: var(--lg-navy); color: var(--lg-navy); }
.lg-chips button.on { background: var(--lg-navy); color: #fff; border-color: var(--lg-navy); }

.lg-list { display: flex; flex-direction: column; gap: 18px; }
.lg-card { border: 1px solid var(--lg-line); border-radius: 14px; background: #fff; padding: 20px 22px; }
.lg-h { font-size: 1.15rem; color: var(--lg-ink); margin: 0 0 8px; padding-left: 12px; border-left: 4px solid var(--lg-gold); }
.lg-hook { font-size: .92rem; line-height: 1.7; color: var(--lg-muted); margin: 0 0 16px; background: var(--lg-soft); border-radius: 8px; padding: 10px 14px; }
.lg-svg { overflow-x: auto; padding: 6px 2px; min-height: 60px; }

/* 粗线大字：加粗所有连线与节点边框、放大文字（mermaid 注入的 SVG 用 :deep 命中） */
.lg-svg :deep(.edgePaths path) { stroke-width: 3px !important; }
.lg-svg :deep(.edgePath path) { stroke-width: 3px !important; }
.lg-svg :deep(.node rect), .lg-svg :deep(.node polygon), .lg-svg :deep(.node circle), .lg-svg :deep(.node path) { stroke-width: 3px !important; }
.lg-svg :deep(.node foreignObject div), .lg-svg :deep(.node text) { font-size: 20px !important; font-weight: 700; line-height: 1.4; }
.lg-svg :deep(.edgeLabel foreignObject div), .lg-svg :deep(.edgeLabel text) { font-size: 15px !important; color: var(--lg-coral); font-weight: 700; }
.lg-svg :deep(svg) { max-width: none; }

.lg-err { color: var(--lg-coral); font-size: .9rem; padding: 12px; }

.lg-foot { margin-top: 24px; font-size: .84rem; color: var(--lg-muted); }
.lg-link { color: var(--lg-navy); font-weight: 700; text-decoration: none; border-bottom: 1px solid var(--lg-gold); }

@media (max-width: 768px) {
  .lg-svg :deep(.node foreignObject div), .lg-svg :deep(.node text) { font-size: 17px !important; }
}
</style>
