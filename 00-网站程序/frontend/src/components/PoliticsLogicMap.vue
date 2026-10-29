<script setup lang="ts">
// 政治逻辑图谱 · mermaid 粗线大字关系图（辅助记忆：把"帽子—正解—干扰"的从属/并列关系画出来）
// 所有映射均来自错题本订正（politicsWrongCause.TERM_CARDS / 新思想错题），不臆造考点。
// 下钻：顶部总览图点板块名 → 钻到该板块详图。自测模式：模糊遮住正解帽子做主动回忆。
import { ref, computed, reactive, watch, onMounted, onUnmounted, nextTick } from 'vue'
import type Mermaid from 'mermaid'

interface Diagram { key: string; title: string; hook: string; def: string }

const CLASSDEFS = [
  "classDef root fill:#16345c,stroke:#0d2137,stroke-width:3.4px,color:#ffffff,font-weight:bold;",
  "classDef right fill:#eef8f2,stroke:#2e9e6b,stroke-width:3.4px,color:#1f4d38;",
  "classDef ans fill:#eef8f2,stroke:#2e9e6b,stroke-width:3.4px,color:#1f4d38;",
  "classDef trap fill:#fff1ee,stroke:#e8604c,stroke-width:3.4px,color:#8a2b1c,stroke-dasharray:6 4;",
  "classDef hub fill:#fff8ec,stroke:#c98a1e,stroke-width:3.4px,color:#5a4300,font-weight:bold;"
].join("\n")

// 总览下钻图：新思想帽子地图 → 5 板块（节点 id = 板块 key，点击钻入）
const OVERVIEW: Diagram = {
  key: '__overview__', title: '🧭 总览 · 点板块名钻进去',
  hook: '新思想 4 大板块的定位词帽子地图。点任意板块节点，下方会下钻到该板块的完整关系图。',
  def: `graph TD\n${CLASSDEFS}\n
R["新思想 · 定位词帽子地图<br/>（单选选反 / 多选贪多 高发区）"]:::root
R --> QJ["⚔️ 强军<br/>4 顶帽子"]:::hub
R --> YG["🇭 一国两制<br/>4 顶帽子"]:::hub
R --> WJ["🌍 大国外交<br/>2 组帽子"]:::hub
R --> CL["🔥 全面从严治党<br/>7 顶帽子"]:::hub
R --> DL["🌱 导论<br/>两个结合 + 六个必须坚持"]:::hub`
}

// 总览图板块节点 id → 下钻目标 key（mermaid `call` 回调在本版本不触发，改为渲染后手动绑定）
const HUB_TO_KEY: Record<string, string> = { QJ: 'qj', YG: 'yglz', WJ: 'wj', CL: 'cl', DL: 'dl' }

const diagrams: Diagram[] = [
  {
    key: 'qj', title: '⚔️ 强军 · 三顶帽子别戴反',
    hook: '灵魂/命脉/首要＝听党指挥；核心＝能打胜仗；保证＝作风优良；根本制度＝军委主席负责制。',
    def: `graph TD\n${CLASSDEFS}\n
R["强军目标 · 帽子体系"]:::root
A["听党指挥"]:::right
A1["灵魂 · 命脉 · 建设首要"]:::ans
B["能打胜仗"]:::right
B1["强军兴军的核心"]:::ans
C["作风优良"]:::right
C1["人民军队的保证"]:::ans
D["党对军队绝对领导的<br/>根本制度 / 根本实现形式"]:::right
D1["军委主席负责制"]:::ans
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
    key: 'yglz', title: '🇭 一国两制 · 谁是根、谁是本',
    hook: '"一国"是前提·根·本；最高原则与根本宗旨都落在"维护国家主权、安全、发展利益"，"和平统一"只是目标。',
    def: `graph TD\n${CLASSDEFS}\n
R["一国两制"]:::root
P["一国"]:::right
P1["前提 · 基础 · 根 · 本"]:::ans
Z["两制"]:::right
Z1["从属、派生于'一国'"]:::ans
T0["二者等量齐观 / 比肩并列 ✗"]:::trap
H["方针的'最高原则'"]:::right
H1["维护国家主权、安全、发展利益"]:::ans
H2["实现祖国和平统一（是目标）"]:::trap
G["根本宗旨"]:::right
G1["维护国家主权安全发展利益<br/>＋ 保持港澳长期繁荣稳定"]:::ans
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
M1["服务民族复兴<br/>促进人类进步"]:::ans
M2["维护世界和平、促进共同发展<br/>（是宗旨）"]:::trap
S["对外工作的<br/>出发点 · 落脚点"]:::right
S1["维护国家主权<br/>安全、发展利益"]:::ans
S2["推动构建人类命运共同体<br/>（是目标）"]:::trap
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
R["全面从严治党<br/>帽子矩阵"]:::root
G1A["政治建设簇"]:::hub
G1B["自我革命簇"]:::hub
G1C["定位 · 多选簇"]:::hub
R-->G1A
R-->G1B
R-->G1C
A["党的建设的统领"]:::right
A1["政治建设"]:::ans
B["政治建设的'首要任务'"]:::right
B1["保证全党服从中央<br/>维护党中央权威和集中统一领导"]:::ans
C["党内政治生活的'首要任务'"]:::right
C1["加强思想教育和理论武装"]:::ans
C2["保证全党服从中央<br/>（那是政治建设的）"]:::trap
G1A-->A
A-->A1
G1A-->B
B-->B1
G1A-->C
C-->C1
C-. 别选 .->C2
D["最彻底的自我革命"]:::right
D1["反腐败"]:::ans
E["再塑党的形象的'第一行动'"]:::right
E1["中央八项规定"]:::ans
F["自我革命的'根本目的'"]:::right
F1["引领伟大社会革命"]:::ans
F2["跳出历史周期率<br/>（是意义，非目的）"]:::trap
G1B-->D
D-->D1
G1B-->E
E-->E1
G1B-->F
F-->F1
F-. 别选 .->F2
G["全面从严治党的定位<br/>（多选全选）"]:::right
G1["必由之路 ＋ 鲜明主题<br/>＋ 伟大实践"]:::ans
G2["党的政治建设的首要任务<br/>（干扰项）"]:::trap
G1C-->G
G-->G1
G-. 别选 .->G2`
  },
  {
    key: 'dl', title: '🌱 导论 · 两个结合 & 六个必须坚持',
    hook: '"两个结合"三顶帽子（必由之路 / 根本途径 / 最大法宝）全对，"根本所在"是来蹭的（你上次多选贪多就栽这）；六个必须坚持先把名字记全。',
    def: `graph TD\n${CLASSDEFS}\n
R["新思想 · 导论"]:::root
L["'两个结合' 是<br/>（多选 ABC）"]:::right
L1["开辟发展中国特色社会主义的<br/>必由之路"]:::ans
L2["推进马克思主义中国化时代化的<br/>根本途径"]:::ans
L3["我们取得成功的<br/>最大法宝"]:::ans
L4["坚定信仰信念、把握历史主动的<br/>'根本所在'"]:::trap
S["'六个必须坚持'<br/>（世界观方法论）"]:::right
S1["人民至上 · 自信自立 · 守正创新<br/>问题导向 · 系统观念 · 胸怀天下"]:::ans
S2["自信自立 ＝ 内在精神特质"]:::ans
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
const visible = ref<Diagram[]>([OVERVIEW, ...diagrams])
const drillTo = async (key: string) => { await onFilter(key) }

// 自测模式
const quizOn = ref(false)
try {
  if (new URLSearchParams(window.location.search).get('quiz') === '1') quizOn.value = true
} catch { /* noop */ }
const revealed = ref<Set<string>>(new Set())
const toggleQuiz = () => { quizOn.value = !quizOn.value; revealed.value = new Set() }
const revealCard = (key: string) => {
  if (!quizOn.value) return
  const s = new Set(revealed.value)
  s.has(key) ? s.delete(key) : s.add(key)
  revealed.value = s
}
const revealAll = () => { revealed.value = new Set(visible.value.map(d => d.key)) }
const hideAll = () => { revealed.value = new Set() }
const isHidden = (key: string) => quizOn.value && !revealed.value.has(key) && key !== OVERVIEW.key

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
    themeVariables: { fontSize: '24px', lineColor: '#c98a1e', edgeLabelBackground: '#fff8ec', primaryTextColor: '#1f2d3d' },
    flowchart: { useMaxWidth: false, htmlLabels: true, padding: 6, nodeSpacing: 38, rankSpacing: 56, curve: 'basis' }
  })
  return mermaidLib!
}

const elMap = new Map<string, HTMLElement>()
const setRef = (id: string) => (el: any) => { if (el) elMap.set(id, el as HTMLElement) }

/* ===== 图形查看器（移动端适配核心）=====
 * 痛点：mermaid 出图自然宽度常有 1200~1700px，手机上会横向溢出 → 图被"裁断"只剩左半。
 * 方案：内联默认「适配屏宽」全览（scale=1 即容器 100% 宽，绝不溢出），
 *       －/＋ 按倍数放大后可横向拖动；「1:1」恢复原始像素（字号最清晰）；
 *       「⛶ 全屏」在浮层里以 1:1 显示，支持双指捏合缩放 + 拖动，横屏看整图最舒服。 */
const svgHtml = reactive<Record<string, string>>({})
const naturalW = reactive<Record<string, number>>({})
const scale = reactive<Record<string, number>>({})
const MIN_S = 1
const MAX_S = 6

// 1:1 所需的倍数 = 自然宽度 / 容器宽度
const fitScaleOf = (key: string) => {
  const w = elMap.get(key)?.clientWidth || 0
  const nat = naturalW[key] || 0
  return w && nat ? Math.max(1, nat / w) : 1
}
// 首次渲染的默认倍数：桌面全览即可看清；手机上全览会把 23px 字缩到 6px，
// 所以默认直接给「能读清字」的档位（约 1:1 的 0.7 倍），想看全图点「适配屏宽」
const defaultScaleFor = (key: string) => {
  const fit = fitScaleOf(key)
  if (window.innerWidth > 768) return 1
  return Math.min(MAX_S, Math.max(1, Math.round(fit * 0.7 * 100) / 100))
}
const setScale = (key: string, v: number) => {
  scale[key] = Math.min(MAX_S, Math.max(MIN_S, Math.round(v * 100) / 100))
}
const zoomBy = (key: string, step: number) => setScale(key, (scale[key] || 1) + step)
const resetScale = (key: string) => setScale(key, 1)
const actualScale = (key: string) => setScale(key, fitScaleOf(key))

// 全屏浮层
const fsKey = ref('')
const fsScale = ref(1)
const fsHost = ref<HTMLElement | null>(null)
const fsTitle = computed(() => {
  const d = [OVERVIEW, ...diagrams].find(x => x.key === fsKey.value)
  return d ? d.title : ''
})
const openFs = (key: string) => {
  fsKey.value = key
  fsScale.value = fitScaleOf(key)
  nextTick(bindDrill)
}
const closeFs = () => { fsKey.value = '' }
const fsZoom = (step: number) => {
  fsScale.value = Math.min(6, Math.max(0.4, Math.round((fsScale.value + step) * 100) / 100))
}
const fsActual = () => { fsScale.value = fitScaleOf(fsKey.value) }

// 双指捏合缩放（浮层内）
let pinchBase = 0
let pinchScale0 = 1
const onTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 2) {
    pinchBase = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    )
    pinchScale0 = fsScale.value
  }
}
const onTouchMove = (e: TouchEvent) => {
  if (e.touches.length === 2 && pinchBase > 0) {
    const d = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    )
    fsScale.value = Math.min(6, Math.max(0.4, Math.round(pinchScale0 * (d / pinchBase) * 100) / 100))
    e.preventDefault()
  }
}
const onTouchEnd = () => { pinchBase = 0 }

// 总览图下钻：mermaid `call` 回调在本版本不触发，渲染后手动绑定（内联 + 浮层两套 DOM 都绑）
const bindDrill = () => {
  const hosts: HTMLElement[] = []
  const inline = elMap.get(OVERVIEW.key)
  if (inline) hosts.push(inline)
  if (fsHost.value) hosts.push(fsHost.value)
  hosts.forEach(h => {
    h.querySelectorAll<HTMLElement>('.node').forEach(n => {
      const id = n.id || ''
      const hub = Object.keys(HUB_TO_KEY).find(k => id.includes(`flowchart-${k}-`))
      if (!hub) return
      n.style.cursor = 'pointer'
      n.onclick = () => {
        closeFs()
        drillTo(HUB_TO_KEY[hub])
      }
    })
  })
}

const renderOne = async (d: Diagram) => {
  const el = elMap.get(d.key)
  if (!el) return
  try {
    const m = await getMermaid()
    const { svg } = await m.render(`logic-${d.key}-${Date.now()}`, d.def)
    const first = scale[d.key] === undefined
    svgHtml[d.key] = svg
    await nextTick()
    const svgEl = el.querySelector('svg')
    if (svgEl) {
      const vb = typeof svgEl.viewBox !== 'undefined' ? svgEl.viewBox?.baseVal : null
      naturalW[d.key] = Math.round(vb && vb.width ? vb.width : svgEl.getBoundingClientRect().width)
    }
    if (first) scale[d.key] = defaultScaleFor(d.key)
    bindDrill()
  } catch (e) {
    svgHtml[d.key] = `<div class="lg-err">图渲染失败：${(e as Error).message}</div>`
  }
}

const renderAll = async () => {
  await nextTick()
  for (const d of visible.value) await renderOne(d)
}

async function onFilter(k: string) {
  filter.value = k
  visible.value = k === 'all' ? [OVERVIEW, ...diagrams] : diagrams.filter(d => d.key === k)
  revealed.value = new Set()
  await renderAll()
}

const onKeydown = (e: KeyboardEvent) => { if (e.key === 'Escape') closeFs() }
watch(fsKey, async (k) => {
  document.body.style.overflow = k ? 'hidden' : ''
  if (!k) return
  await nextTick()
  bindDrill()
  // mermaid 图水平居中，浮层默认停在最左会先看到一片空白 → 自动滚到中间
  const box = fsHost.value
  if (box) {
    box.scrollTop = 0
    box.scrollLeft = Math.max(0, (box.scrollWidth - box.clientWidth) / 2)
  }
})

onMounted(() => {
  renderAll()
  window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="lg">
    <div class="lg-hero">
      <div class="lg-kicker">政治 · 逻辑图谱</div>
      <h2 class="lg-title">粗线大字，把"帽子"之间的关系一次画清</h2>
      <p class="lg-sub">
        你新思想最大的两个失分点是<b>单选定位词张冠李戴</b>和<b>多选贪多</b>。
        经验贴独立指出"多选里'帽子题（…的根本/核心/本质）约占九成"——和诊断完全吻合。
        每张图把「提问信号 → 正解帽子」用<b>绿色实线</b>连好，把最容易顺手多选的<b>干扰项</b>
        用<span class="lg-trap-word">红色虚线</span>标出来。
      </p>
      <div class="lg-legend">
        <span><i class="dot root"></i>主题</span>
        <span><i class="dot hub"></i>板块 / 簇</span>
        <span><i class="dot right"></i>正解帽子</span>
        <span><i class="dot trap"></i>高频干扰（别选）</span>
      </div>
    </div>

    <div class="lg-bar">
      <div class="lg-chips">
        <button :class="{ on: filter === 'all' }" @click="onFilter('all')">🧭 总览</button>
        <button v-for="d in diagrams" :key="d.key" :class="{ on: filter === d.key }" @click="onFilter(d.key)">{{ d.title.replace(/^[^\u4e00-\u9fa5A-Za-z]+/, '') }}</button>
      </div>
      <div class="lg-quiz">
        <button class="qz-toggle" :class="{ on: quizOn }" @click="toggleQuiz">🙈 自测模式</button>
        <template v-if="quizOn">
          <button class="qz-mini" @click="revealAll">全部揭晓</button>
          <button class="qz-mini" @click="hideAll">重新遮住</button>
        </template>
      </div>
    </div>
    <p v-if="quizOn" class="lg-quiz-tip">自测中：绿色"正解帽子"已模糊遮住——先在心里报出答案，再点卡片核对。</p>

    <div class="lg-list">
      <section
        v-for="d in visible" :key="d.key"
        class="lg-card" :class="{ 'ans-hidden': isHidden(d.key), clickable: quizOn && d.key !== OVERVIEW.key, overview: d.key === OVERVIEW.key }"
        @click="d.key === OVERVIEW.key ? null : revealCard(d.key)"
      >
        <div class="lg-card-head">
          <h3 class="lg-h">{{ d.title }}</h3>
          <button v-if="filter !== 'all'" class="lg-back" @click="onFilter('all')">← 返回总览</button>
          <span v-else-if="d.key === OVERVIEW.key" class="lg-drill-hint">👆 点板块节点下钻</span>
          <span v-if="isHidden(d.key)" class="lg-reveal-hint">点卡片揭晓</span>
        </div>
        <p class="lg-hook">🧠 {{ d.hook }}</p>

        <!-- 图形查看器工具条：手机上靠它把 1200px+ 的图看全 / 看大 -->
        <div class="lg-tools" @click.stop>
          <button class="lg-tool" :disabled="(scale[d.key] || 1) <= MIN_S" @click.stop="zoomBy(d.key, -0.5)" title="缩小">－</button>
          <span class="lg-zoom-num">{{ Math.round((scale[d.key] || 1) * 100) }}%</span>
          <button class="lg-tool" :disabled="(scale[d.key] || 1) >= MAX_S" @click.stop="zoomBy(d.key, 0.5)" title="放大">＋</button>
          <button class="lg-tool txt" @click.stop="resetScale(d.key)">适配屏宽</button>
          <button class="lg-tool txt" @click.stop="actualScale(d.key)">1:1 原尺寸</button>
          <button class="lg-tool fs" @click.stop="openFs(d.key)">⛶ 全屏放大</button>
        </div>

        <div class="lg-svg" :ref="setRef(d.key)">
          <div class="lg-canvas" :style="{ width: (scale[d.key] || 1) * 100 + '%' }" v-html="svgHtml[d.key]"></div>
        </div>
        <p class="lg-svg-hint">放大后左右拖动看局部；手机上点「⛶ 全屏放大」再双指捏合，转横屏看整张最舒服</p>
      </section>
    </div>

    <!-- 全屏查看器：1:1 原始像素出图（字号最清晰），双指缩放 + 拖动 -->
    <Teleport to="body">
      <div v-if="fsKey" class="lg-fs" @click.self="closeFs">
        <div class="lg-fs-bar" @click.stop>
          <strong class="lg-fs-title">{{ fsTitle }}</strong>
          <div class="lg-fs-ctrl">
            <button class="lg-tool" @click="fsZoom(-0.5)">－</button>
            <span class="lg-zoom-num">{{ Math.round(fsScale * 100) }}%</span>
            <button class="lg-tool" @click="fsZoom(0.5)">＋</button>
            <button class="lg-tool txt" @click="fsActual">1:1</button>
            <button class="lg-tool fs" @click="closeFs">✕ 关闭</button>
          </div>
        </div>
        <div
          ref="fsHost"
          class="lg-fs-body"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <div class="lg-canvas" :style="{ width: fsScale * 100 + '%' }" v-html="svgHtml[fsKey]"></div>
        </div>
        <p class="lg-fs-hint">双指捏合缩放 · 单指拖动看局部 · 点空白处或按 Esc 关闭</p>
      </div>
    </Teleport>

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
.lg-sub { color: #b9cbe0; font-size: .92rem; line-height: 1.8; margin: 0; max-width: 860px; position: relative; z-index: 1; }
.lg-sub b { color: var(--lg-gold); }
.lg-trap-word { color: #ff8a76; font-weight: 700; }
.lg-legend { display: flex; gap: 18px; margin-top: 16px; flex-wrap: wrap; position: relative; z-index: 1; font-size: .82rem; color: #d5e2f0; }
.lg-legend .dot { display: inline-block; width: 14px; height: 14px; border-radius: 4px; margin-right: 6px; vertical-align: -1px; }
.dot.root { background: var(--lg-navy); border: 2px solid #fff; }
.dot.hub { background: #fff8ec; border: 2px solid var(--lg-gold); }
.dot.right { background: #eef8f2; border: 2px solid var(--lg-green); }
.dot.trap { background: #fff1ee; border: 2px dashed var(--lg-coral); }

.lg-bar { display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 8px; }
.lg-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.lg-chips button, .lg-quiz button { border: 1px solid var(--lg-line); background: #fff; color: var(--lg-muted); padding: 8px 16px; border-radius: 999px; font-size: .9rem; font-weight: 600; cursor: pointer; transition: all .18s; }
.lg-chips button:hover { border-color: var(--lg-navy); color: var(--lg-navy); }
.lg-chips button.on { background: var(--lg-navy); color: #fff; border-color: var(--lg-navy); }
.lg-quiz { display: flex; gap: 8px; align-items: center; }
.qz-toggle.on { background: var(--lg-coral); color: #fff; border-color: var(--lg-coral); box-shadow: 0 4px 14px rgba(232,96,76,.28); }
.qz-mini { padding: 7px 13px !important; font-size: .82rem !important; }
.lg-quiz-tip { font-size: .84rem; color: var(--lg-coral); margin: 4px 0 14px; font-weight: 600; }

.lg-list { display: flex; flex-direction: column; gap: 18px; margin-top: 10px; }
.lg-card { border: 1px solid var(--lg-line); border-radius: 14px; background: #fff; padding: 20px 22px; transition: box-shadow .2s, border-color .2s; }
.lg-card.overview { border-color: rgba(201,138,30,.4); background: linear-gradient(180deg,#fffdf7,#fff); }
.lg-card.clickable { cursor: pointer; }
.lg-card.clickable:hover { box-shadow: 0 8px 22px rgba(13,33,55,.08); }
.lg-card.ans-hidden { border-color: rgba(232,96,76,.4); background: linear-gradient(180deg,#fffaf9,#fff); }
.lg-card-head { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.lg-h { font-size: 1.15rem; color: var(--lg-ink); margin: 0; padding-left: 12px; border-left: 4px solid var(--lg-gold); }
.lg-back { border: 1px solid var(--lg-line); background: #fff; color: var(--lg-navy); border-radius: 8px; padding: 4px 12px; font-size: .8rem; cursor: pointer; }
.lg-drill-hint { margin-left: auto; font-size: .8rem; font-weight: 700; color: #8a6100; background: #fdf1d6; border-radius: 6px; padding: 3px 10px; }
.lg-reveal-hint { margin-left: auto; font-size: .8rem; font-weight: 700; color: var(--lg-coral); background: #fff1ee; border-radius: 6px; padding: 3px 10px; }
.lg-hook { font-size: .92rem; line-height: 1.7; color: var(--lg-muted); margin: 10px 0 16px; background: var(--lg-soft); border-radius: 8px; padding: 10px 14px; }
/* ── 查看器容器：宽度锁死在卡片内，图在内部缩放/滚动，绝不把整页撑破 ── */
.lg-list { min-width: 0; }
.lg-card { min-width: 0; max-width: 100%; }
.lg-svg {
  overflow: auto;
  max-width: 100%;
  padding: 6px 2px;
  min-height: 60px;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-x pan-y;
  overscroll-behavior: contain;
  background: #fbfcfe;
  border: 1px solid var(--lg-line);
  border-radius: 10px;
}
.lg-canvas { min-width: 100%; }

/* 工具条 */
.lg-tools { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin: 4px 0 10px; }
.lg-tool { min-width: 34px; height: 30px; padding: 0 10px; border: 1px solid var(--lg-line); background: #fff; color: var(--lg-navy); border-radius: 8px; font-size: .95rem; font-weight: 800; line-height: 1; cursor: pointer; }
.lg-tool.txt { font-size: .8rem; font-weight: 700; color: var(--lg-muted); }
.lg-tool.fs { font-size: .8rem; background: var(--lg-navy); color: #fff; border-color: var(--lg-navy); }
.lg-tool:disabled { opacity: .38; cursor: not-allowed; }
.lg-zoom-num { font-family: var(--font-mono); font-size: .8rem; color: var(--lg-muted); min-width: 44px; text-align: center; }
.lg-svg-hint { margin: 8px 0 0; font-size: .76rem; color: #8fa3ba; line-height: 1.6; }

/* mermaid 标准：大字号 + 粗线条（内联与全屏浮层都用 .lg-canvas 命中） */
.lg-canvas :deep(svg) { width: 100%; height: auto; max-width: none; display: block; }
/* mermaid v11 的连线实际是 <g class="edgePaths"><path class="…flowchart-link">，
   没有 .path 类、也不是 .edgePath —— 旧选择器一条都不命中，线一直是默认 1px。 */
.lg-canvas :deep(.edgePaths path),
.lg-canvas :deep(path.flowchart-link),
.lg-canvas :deep(path.link),
.lg-canvas :deep(.edgePath path) { stroke-width: 4.6px !important; }
.lg-canvas :deep(.node rect), .lg-canvas :deep(.node polygon), .lg-canvas :deep(.node circle), .lg-canvas :deep(.node path) { stroke-width: 3.4px !important; }
/* 关键：SVG 被等比缩放时描边不跟着变细 —— 手机上「线太细」的主因 */
.lg-canvas :deep(svg *) { vector-effect: non-scaling-stroke; }
.lg-canvas :deep(.nodeLabel), .lg-canvas :deep(.node foreignObject div), .lg-canvas :deep(.node text) { font-size: 23px !important; font-weight: 800; line-height: 1.35; }
.lg-canvas :deep(.edgeLabel), .lg-canvas :deep(.edgeLabel foreignObject div), .lg-canvas :deep(.edgeLabel text) { font-size: 17px !important; font-weight: 700; color: var(--lg-coral); }

/* 全屏查看器 */
.lg-fs { position: fixed; inset: 0; z-index: 3000; background: rgba(8, 17, 30, .95); display: flex; flex-direction: column; }
.lg-fs-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, .12); }
.lg-fs-title { color: #fff; font-size: 1rem; letter-spacing: .02em; }
.lg-fs-ctrl { display: flex; align-items: center; gap: 8px; }
.lg-fs-ctrl .lg-tool { background: rgba(255, 255, 255, .08); color: #fff; border-color: rgba(255, 255, 255, .2); }
.lg-fs-ctrl .lg-tool.fs { background: var(--lg-coral); border-color: var(--lg-coral); }
.lg-fs-ctrl .lg-zoom-num { color: #c6d6ec; }
.lg-fs-body { flex: 1; overflow: auto; -webkit-overflow-scrolling: touch; touch-action: pan-x pan-y pinch-zoom; padding: 16px; }
.lg-fs-hint { margin: 0; padding: 10px 16px 16px; text-align: center; font-size: .78rem; color: #8fa3ba; }

.lg-card.ans-hidden :deep(.node.ans) { filter: blur(12px); transition: filter .25s ease; }
.lg-card:not(.ans-hidden) :deep(.node.ans) { filter: none; transition: filter .25s ease; }

.lg-err { color: var(--lg-coral); font-size: .9rem; padding: 12px; }

.lg-foot { margin-top: 24px; font-size: .84rem; color: var(--lg-muted); }
.lg-link { color: var(--lg-navy); font-weight: 700; text-decoration: none; border-bottom: 1px solid var(--lg-gold); }

/* 移动端：字号不再降级（原来降到 18px 正是"字太小"的原因），只收紧留白 + 放大触控热区 */
@media (max-width: 768px) {
  .lg-hero { padding: 20px 18px; }
  .lg-card { padding: 16px 14px; }
  .lg-tool { height: 34px; min-width: 38px; }
  .lg-svg-hint { font-size: .72rem; }
  .lg-fs-body { padding: 10px; }
}
</style>
