<script setup lang="ts">
import { ref } from 'vue'

// ══════════ 政治·记忆图谱 ══════════
// 把最难的框架画成"图"：树状/逻辑链/时间轴/决策图，重点词标红加粗，方便记忆。
// 内容对齐考研政治标准体系，作为「知识框架」纯文字的可视化补充。

const active = ref<'philosophy' | 'economy' | 'history' | 'thought' | 'trick'>('philosophy')

const NAV = [
  { id: 'philosophy', ic: '🌳', t: '马原·哲学体系树', s: '四大板块一次记全' },
  { id: 'economy', ic: '⛓️', t: '马原·政经逻辑链', s: '商品→资本→剩余价值' },
  { id: 'history', ic: '📜', t: '史纲·时间轴', s: '1840→今天一条线' },
  { id: 'thought', ic: '🧩', t: '毛中特·新思想框架', s: '五位一体/四个全面' },
  { id: 'trick', ic: '🎩', t: '多选·帽子词判断', s: '一眼识别绝对化陷阱' },
] as const

// —— 重点词标红：「」内词 + 绝对化帽子词 ——
const HL_WORDS = ['唯一', '完全', '彻底', '永远', '任何', '取决于', '只要', '决定', '根本', '核心', '实质', '标志', '开端', '确立', '全部', '都', '一定', '不再', '所有']
function hl(s: string): string {
  if (!s) return ''
  let t = String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const pool: string[] = []
  t = t.replace(/「([^」]+)」|“([^”]+)”/g, (_m, a, b) => { pool.push(a ?? b); return `\u0000${pool.length - 1}\u0000` })
  for (const w of HL_WORDS) t = t.split(w).join(`\u0001${w}\u0002`)
  t = t.replace(/\u0001([^\u0002]*)\u0002/g, '<b class="hl">$1</b>')
  t = t.replace(/\u0000(\d+)\u0000/g, (_m, i) => `<b class="hl">「${pool[+i]}」</b>`)
  return t
}

// ──────── ① 马原哲学体系树 ────────
const phil = [
  {
    name: '唯物论', color: 'red', q: '世界"是什么"',
    lead: '回答世界的本原——物质还是意识',
    nodes: [
      { h: '物质与意识', b: ['物质「决定」意识', '意识对物质有「能动」反作用', '世界的真正统一性在于它的物质性'] },
      { h: '运动与静止', b: ['运动是绝对的、静止是相对的', '动中有静、静中有动'] },
      { h: '规律客观性', b: ['规律不可创造不可消灭', '人能认识和「利用」规律'] },
    ],
  },
  {
    name: '辩证法', color: 'navy', q: '世界"怎么样"',
    lead: '联系、发展的观点 + 三大规律五对范畴',
    nodes: [
      { h: '两大总特征', b: ['普遍「联系」', '永恒「发展」'] },
      { h: '对立统一规律', b: ['矛盾=动力，是辩证法的实质「核心」', '同一性与斗争性', '普遍性(共性)与特殊性(个性)「具体问题具体分析」', '两点论与重点论统一'] },
      { h: '质量互变规律', b: ['量变是质变必要准备', '质变是量变必然结果'] },
      { h: '否定之否定', b: ['事物发展是前进性与曲折性统一', '螺旋式上升'] },
    ],
  },
  {
    name: '认识论', color: 'gold', q: '怎么"认识"世界',
    lead: '实践是认识的基础，两次飞跃 + 真理',
    nodes: [
      { h: '实践决定认识', b: ['实践是认识的来源、动力、目的、「检验标准」', '实践「唯一」的检验真理标准'] },
      { h: '两次飞跃', b: ['感性→理性(认识)', '理性→实践(更重要)'] },
      { h: '真理', b: ['客观性、具体性、条件性', '绝对性与相对性统一', '真理与谬误相伴而行'] },
    ],
  },
  {
    name: '唯物史观', color: 'green', q: '人类社会"何规律"',
    lead: '社会存在决定社会意识，两大基本矛盾',
    nodes: [
      { h: '社会存在/意识', b: ['社会存在「决定」社会意识', '社会意识具有相对独立性'] },
      { h: '两大基本矛盾', b: ['生产力与生产关系', '经济基础与上层建筑'] },
      { h: '人民群众', b: ['人民群众是历史的创造者', '「群众观点」群众路线'] },
    ],
  },
]

// ──────── ② 政经逻辑链 ────────
const econChain = [
  { t: '商品', d: '二因素(使用价值+价值)｜劳动二重性(具体劳动+抽象劳动)——理解整章的「钥匙」' },
  { t: '货币', d: '价值尺度、流通手段(两个基本职能) + 贮藏/支付/世界货币' },
  { t: '资本总公式', d: 'G—W—G′，增值额即剩余价值；劳动力成为商品是货币「转化为」资本的前提' },
  { t: '剩余价值', d: '绝对(延长工作日) / 相对(缩短必要劳动) / 超额(个别<社会)——「剥削的秘密」' },
  { t: '资本积累', d: '剩余价值→资本，两极分化，资本有机构成提高' },
  { t: '再生产与流通', d: '单个资本(周转/固定流动) + 社会总资本(两大部类 I生产资料·II消费资料)' },
  { t: '利润平均化', d: '产业·商业·借贷资本瓜分剩余价值，利润→平均利润，价值→生产价格' },
]

// ──────── ③ 史纲时间轴 ────────
const hist = [
  { y: '1840', t: '鸦片战争', n: '近代史「开端」，开始沦为半殖民地半封建社会' },
  { y: '1851', t: '太平天国', n: '农民战争最高峰，《资政新篇》最早发展资本主义' },
  { y: '1861', t: '洋务运动', n: '"自强求富"，中国「近代化」起步(只学器物)' },
  { y: '1895', t: '甲午战败', n: '洋务破产，列强瓜分狂潮' },
  { y: '1898', t: '戊戌变法', n: '资产阶级改良，"百日维新"，思想启蒙' },
  { y: '1911', t: '辛亥革命', n: '推翻帝制，建立民国；「20世纪第一次巨变」' },
  { y: '1915', t: '新文化运动', n: '民主与科学，思想大解放' },
  { y: '1919', t: '五四运动', n: '工人阶级登上舞台，新民主主义革命「开端」' },
  { y: '1921', t: '中共成立', n: '"开天辟地的大事变"，革命有了「主心骨」' },
  { y: '1935', t: '遵义会议', n: '生死攸关「转折点」，党走向成熟的「标志」' },
  { y: '1945', t: '抗战胜利 / 七大', n: '近代反侵略第一次「完全胜利」；确立毛泽东思想' },
  { y: '1949', t: '新中国成立', n: '「站起来」，新民主主义革命基本胜利' },
  { y: '1956', t: '三大改造完成', n: '社会主义制度「确立」，进入初级阶段' },
  { y: '1978', t: '十一届三中全会', n: '「改革开放」开端，工作重心转移到经济建设' },
  { y: '新时代', t: '2012 至今', n: '「强起来」，中国特色社会主义进入新时代' },
]

// ──────── ④ 毛中特 / 新思想框架（中心+辐射） ────────
const thought = [
  { h: '五位一体', sub: '总体布局', items: ['经济建设', '政治建设', '文化建设', '社会建设', '生态文明建设'] },
  { h: '四个全面', sub: '战略布局', items: ['全面建设社会主义现代化国家', '全面深化改革', '全面依法治国', '全面从严治党'] },
  { h: '新发展理念', sub: '指挥棒', items: ['创新', '协调', '绿色', '开放', '共享'] },
  { h: '中国式现代化', sub: '五大特征', items: ['人口规模巨大', '全体人民共同富裕', '物质文明和精神文明相协调', '人与自然和谐共生', '走和平发展道路'] },
  { h: '两个一百年', sub: '奋斗目标', items: ['建党100年·全面建成小康社会(已实现)', '建国100年·建成社会主义现代化强国'] },
  { h: '十四个坚持', sub: '基本方略', items: ['党对一切工作的领导', '以人民为中心', '新发展理念', '人民当家作主', '全面深化改革 …(共14条)'] },
]

// ──────── ⑤ 多选·帽子词判断流程 ────────
const trickSteps = [
  { q: '选项里出现「绝对化」帽子词？', w: ['唯一', '完全', '彻底', '永远', '任何', '取决于', '只要…就', '全都', '消除', '解决了'], verdict: 'bad', tip: '政治里越绝对的表述越可疑——先判「错」再验证。这是多选题最划算的排除法。' },
  { q: '它把"某一个"说成"全部/所有"？', w: ['扩大外延', '以偏概全', '把部分当整体'], verdict: 'bad', tip: '典型"帽子过大"：正确原理被套上绝对量词。' },
  { q: '偷换了主体/因果/时间？', w: ['颠倒了', '根本原因', '决定性因素', '标志着'], verdict: 'warn', tip: '注意"根本原因 vs 直接原因""开始 vs 完成""标志"三类常设陷阱。' },
  { q: '表述本身正确但与题干无关？', w: ['答非所问', '材料没体现'], verdict: 'warn', tip: '"说法对但不选"——多选题最爱用的迷惑项，紧扣题干设问。' },
  { q: '措辞温和、留有余地、符合原理？', w: ['一般', '往往', '在一定程度上', '有利于'], verdict: 'good', tip: '越是克制、有条件的表述，越可能是正确答案。' },
]
</script>

<template>
  <div class="pmm">
    <!-- 页头 -->
    <div class="pmm-mast">
      <span class="pmm-kicker">MIND MAP · 政治记忆图谱</span>
      <h3 class="pmm-title">别硬背，先看"图"——一张图记住一块体系</h3>
      <p class="pmm-sub">政治难记，是因为知识是"网状"的而文字是"线性"的。把体系先画成<b>树、链、轴、决策图</b>记骨架，再回知识框架填血肉，记得牢、忘得慢。重点词已<b>标红加粗</b>。</p>
    </div>

    <!-- 图谱导航 -->
    <div class="pmm-nav">
      <button
        v-for="n in NAV" :key="n.id"
        class="pmm-nav-btn" :class="{ on: active === n.id }"
        @click="active = n.id"
      >
        <span class="pnn-ic">{{ n.ic }}</span>
        <span class="pnn-txt"><strong>{{ n.t }}</strong><em>{{ n.s }}</em></span>
      </button>
    </div>

    <!-- ① 马原哲学树 -->
    <section v-if="active === 'philosophy'" class="pmm-body">
      <p class="pmm-lead">🌳 马原哲学 = 回答四个问题：<b>世界是什么(唯物论) · 世界怎么样(辩证法) · 怎么认识(认识论) · 社会何规律(唯物史观)</b>。四大块先立骨架，再挂考点。</p>
      <div class="philo-grid">
        <div v-for="b in phil" :key="b.name" class="philo-branch" :class="b.color">
          <div class="pb-root">
            <span class="pb-name">{{ b.name }}</span>
            <span class="pb-q">{{ b.q }}</span>
          </div>
          <p class="pb-lead" v-html="hl(b.lead)"></p>
          <div class="pb-node" v-for="n in b.nodes" :key="n.h">
            <strong class="pb-node-h">{{ n.h }}</strong>
            <ul>
              <li v-for="(x, i) in n.b" :key="i" v-html="hl(x)"></li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ② 政经逻辑链 -->
    <section v-if="active === 'economy'" class="pmm-body">
      <p class="pmm-lead">⛓️ 政经不是零散名词，是一条<b>增值逻辑链</b>：从"商品"这个细胞一路推到"利润平均化"。顺着链条走，概念自动归位。</p>
      <div class="chain">
        <template v-for="(c, i) in econChain" :key="c.t">
          <div class="chain-node">
            <div class="cn-no">{{ i + 1 }}</div>
            <div class="cn-body">
              <strong class="cn-t">{{ c.t }}</strong>
              <p class="cn-d" v-html="hl(c.d)"></p>
            </div>
          </div>
          <div v-if="i < econChain.length - 1" class="chain-arrow">➜</div>
        </template>
      </div>
      <p class="pmm-tip">🔑 记住两组"二"：<b>劳动二重性 → 商品二因素</b>；一切"剥削"的秘密都藏在<b>剩余价值</b>那一步。</p>
    </section>

    <!-- ③ 史纲时间轴 -->
    <section v-if="active === 'history'" class="pmm-body">
      <p class="pmm-lead">📜 史纲就是"一条时间轴 + 每个节点的<b>意义定位词</b>"。年份记不牢没关系，先记<b>开端 / 转折点 / 标志 / 确立</b>这类"帽子词"，选择题就靠它。</p>
      <div class="timeline-h">
        <div class="th-node" v-for="(h, i) in hist" :key="i" :class="{ key: ['1840','1919','1921','1935','1949','1956','1978'].includes(h.y) }">
          <div class="th-dot"></div>
          <div class="th-year">{{ h.y }}</div>
          <div class="th-title">{{ h.t }}</div>
          <div class="th-note" v-html="hl(h.n)"></div>
        </div>
      </div>
    </section>

    <!-- ④ 毛中特/新思想框架 -->
    <section v-if="active === 'thought'" class="pmm-body">
      <p class="pmm-lead">🧩 新思想分值最高、全靠"框架数词"。<b>几个"全"、几个"化"、五大、十四个</b>——把数字和名字对上，多选就能一眼配对。</p>
      <div class="hub-grid">
        <div class="hub-card" v-for="th in thought" :key="th.h">
          <div class="hub-head">
            <strong>{{ th.h }}</strong>
            <span class="hub-sub">{{ th.sub }}</span>
          </div>
          <ol>
            <li v-for="(it, i) in th.items" :key="i" v-html="hl(it)"></li>
          </ol>
        </div>
      </div>
    </section>

    <!-- ⑤ 多选帽子词判断 -->
    <section v-if="active === 'trick'" class="pmm-body">
      <p class="pmm-lead">🎩 多选题拉分核心。养成"看到绝对化词就报警"的 reflex——按下面这条决策流走一遍，排除法能救回很多分。这与「错因诊断」里的找茬演练配套。</p>
      <div class="trick-flow">
        <div v-for="(t, i) in trickSteps" :key="i" class="trick-step" :class="t.verdict">
          <div class="ts-q">{{ i + 1 }}. {{ t.q }}</div>
          <div class="ts-words">
            <em v-for="w in t.w" :key="w">{{ w }}</em>
          </div>
          <div class="ts-verdict">
            {{ t.verdict === 'bad' ? '❌ 大概率错' : t.verdict === 'warn' ? '⚠️ 存疑核对' : '✅ 更像正确' }}
          </div>
          <p class="ts-tip" v-html="hl(t.tip)"></p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.pmm {
  --pd-navy-deep: #0d2137; --pd-navy: #16345c; --pd-gold: #ffc53d; --pd-goldd: #c98a1e;
  --pd-red: #f56c6c; --pd-red-d: #d94848; --pd-green: #2f9e6f;
  --pd-ink: #1f2d3d; --pd-body: #3a4a5b; --pd-muted: #6b7a8c; --pd-line: #e4ebf3; --pd-soft: #f5f8fc;
  --pd-serif: 'Georgia', 'Times New Roman', serif;
}
:deep(.hl) { color: var(--pd-red); font-weight: 800; }

.pmm-mast {
  background: linear-gradient(135deg, var(--pd-navy-deep), var(--pd-navy) 60%, #1e4576);
  border-radius: 16px; padding: 24px 26px; margin-bottom: 18px; position: relative; overflow: hidden;
}
.pmm-mast::after {
  content: ''; position: absolute; inset: 0; pointer-events: none; opacity: .4;
  background-image: linear-gradient(rgba(255,197,61,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,197,61,.12) 1px, transparent 1px);
  background-size: 34px 34px;
}
.pmm-kicker { position: relative; z-index: 1; font-size: .68rem; font-weight: 800; letter-spacing: .22em; color: var(--pd-gold); text-transform: uppercase; }
.pmm-title { position: relative; z-index: 1; font-family: var(--pd-serif); font-size: 1.5rem; font-weight: 800; color: #fff; margin: 8px 0 10px; line-height: 1.25; }
.pmm-sub { position: relative; z-index: 1; font-size: .88rem; line-height: 1.75; color: #c6d6ec; margin: 0; max-width: 74ch; }
.pmm-sub b { color: var(--pd-gold); }

.pmm-nav { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 22px; }
.pmm-nav-btn {
  display: flex; align-items: center; gap: 10px; text-align: left; cursor: pointer;
  border: 1.5px solid var(--pd-line); background: #fff; border-radius: 12px; padding: 10px 14px; transition: all .16s;
}
.pmm-nav-btn:hover { border-color: var(--pd-navy); transform: translateY(-2px); }
.pmm-nav-btn.on { border-color: var(--pd-red); background: linear-gradient(135deg, #fff2f2, #ffeaea); box-shadow: 0 8px 18px -12px rgba(245,108,108,.6); }
.pnn-ic { font-size: 1.4rem; }
.pnn-txt { display: flex; flex-direction: column; }
.pnn-txt strong { font-size: .92rem; color: var(--pd-navy-deep); }
.pnn-txt em { font-style: normal; font-size: .72rem; color: var(--pd-muted); margin-top: 2px; }

.pmm-body { animation: pmm-in .35s both; }
@keyframes pmm-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.pmm-lead { font-size: .92rem; line-height: 1.8; color: var(--pd-body); margin: 0 0 20px; background: var(--pd-soft); border-radius: 10px; padding: 12px 16px; border-left: 4px solid var(--pd-gold); }
.pmm-lead b { color: var(--pd-navy); }
.pmm-tip { font-size: .86rem; line-height: 1.7; color: #8a5a12; background: #fff8ec; border-radius: 10px; padding: 12px 16px; margin-top: 18px; }
.pmm-tip b { color: var(--pd-red-d); }

/* ① 哲学树 */
.philo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
.philo-branch { border: 1px solid var(--pd-line); border-radius: 14px; overflow: hidden; background: #fff; box-shadow: 0 6px 18px -14px rgba(20,40,70,.6); }
.pb-root { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; padding: 14px 16px; color: #fff; }
.pb-name { font-family: var(--pd-serif); font-size: 1.2rem; font-weight: 800; }
.pb-q { font-size: .78rem; opacity: .92; }
.philo-branch.red .pb-root { background: linear-gradient(135deg, var(--pd-red-d), var(--pd-red)); }
.philo-branch.navy .pb-root { background: linear-gradient(135deg, var(--pd-navy-deep), var(--pd-navy)); }
.philo-branch.gold .pb-root { background: linear-gradient(135deg, var(--pd-goldd), #e0a92e); }
.philo-branch.green .pb-root { background: linear-gradient(135deg, #227a55, var(--pd-green)); }
.pb-lead { font-size: .82rem; line-height: 1.6; color: var(--pd-muted); margin: 0; padding: 12px 16px 4px; }
.pb-node { padding: 10px 16px; border-top: 1px dashed var(--pd-line); }
.pb-node-h { display: block; font-size: .92rem; color: var(--pd-navy); margin-bottom: 6px; }
.pb-node ul { margin: 0; padding-left: 18px; }
.pb-node li { font-size: .84rem; line-height: 1.65; color: var(--pd-body); margin: 4px 0; }

/* ② 逻辑链 */
.chain { display: flex; flex-direction: column; gap: 0; }
.chain-node { display: flex; gap: 14px; align-items: stretch; }
.cn-no { flex: none; width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; font-family: var(--pd-serif); font-weight: 800; color: #fff; background: linear-gradient(135deg, var(--pd-navy), #2b5488); box-shadow: 0 0 0 4px #fff; }
.cn-body { flex: 1; background: #fff; border: 1px solid var(--pd-line); border-radius: 12px; padding: 12px 16px; margin-bottom: 14px; }
.cn-t { display: block; font-size: 1.02rem; color: var(--pd-navy-deep); margin-bottom: 4px; }
.cn-d { font-size: .86rem; line-height: 1.65; color: var(--pd-body); margin: 0; }
.chain-arrow { width: 34px; text-align: center; color: var(--pd-goldd); font-size: 1.2rem; font-weight: 900; margin: -8px 0 6px; padding-left: 2px; }

/* ③ 时间轴 */
.timeline-h { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
.th-node { position: relative; background: #fff; border: 1px solid var(--pd-line); border-radius: 12px; padding: 14px 12px 12px; }
.th-node.key { border-color: var(--pd-red); background: linear-gradient(180deg, #fff4f4, #fff); box-shadow: 0 8px 18px -14px rgba(245,108,108,.7); }
.th-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--pd-navy); position: absolute; top: -6px; left: 14px; box-shadow: 0 0 0 3px #fff; }
.th-node.key .th-dot { background: var(--pd-red); }
.th-year { font-family: var(--pd-serif); font-weight: 800; font-size: 1.1rem; color: var(--pd-red-d); }
.th-title { font-size: .9rem; font-weight: 800; color: var(--pd-navy-deep); margin: 2px 0 6px; }
.th-note { font-size: .78rem; line-height: 1.55; color: var(--pd-body); }

/* ④ 框架 hub */
.hub-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
.hub-card { border: 1px solid var(--pd-line); border-radius: 14px; background: #fff; overflow: hidden; box-shadow: 0 6px 18px -14px rgba(20,40,70,.6); }
.hub-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; padding: 14px 16px; background: linear-gradient(135deg, var(--pd-navy-deep), var(--pd-navy)); }
.hub-head strong { font-family: var(--pd-serif); font-size: 1.12rem; color: var(--pd-gold); }
.hub-sub { font-size: .76rem; color: #a8bdd4; }
.hub-card ol { margin: 0; padding: 12px 16px 14px 34px; }
.hub-card li { font-size: .86rem; line-height: 1.7; color: var(--pd-body); margin: 5px 0; }

/* ⑤ 帽子词决策 */
.trick-flow { display: flex; flex-direction: column; gap: 14px; }
.trick-step { border-radius: 14px; padding: 16px 18px; border: 1.5px solid var(--pd-line); background: #fff; position: relative; }
.trick-step.bad { border-color: #f3c2c2; background: linear-gradient(180deg, #fff5f5, #fff); }
.trick-step.warn { border-color: #f0dca0; background: linear-gradient(180deg, #fffaf0, #fff); }
.trick-step.good { border-color: #bfe4cd; background: linear-gradient(180deg, #f2fbf6, #fff); }
.ts-q { font-size: 1rem; font-weight: 800; color: var(--pd-navy-deep); margin-bottom: 10px; }
.ts-words { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
.ts-words em { font-style: normal; font-size: .78rem; font-weight: 700; color: #fff; background: linear-gradient(135deg, var(--pd-navy), #2b5488); border-radius: 6px; padding: 3px 10px; }
.trick-step.bad .ts-words em { background: linear-gradient(135deg, var(--pd-red-d), var(--pd-red)); }
.trick-step.warn .ts-words em { background: linear-gradient(135deg, var(--pd-goldd), #e0a92e); }
.trick-step.good .ts-words em { background: linear-gradient(135deg, #227a55, var(--pd-green)); }
.ts-verdict { font-size: .9rem; font-weight: 800; margin-bottom: 6px; }
.trick-step.bad .ts-verdict { color: var(--pd-red-d); }
.trick-step.warn .ts-verdict { color: var(--pd-goldd); }
.trick-step.good .ts-verdict { color: var(--pd-green); }
.ts-tip { font-size: .84rem; line-height: 1.65; color: var(--pd-body); margin: 0; }

@media (max-width: 768px) {
  .pmm-title { font-size: 1.25rem; }
  .pnn-txt em { display: none; }
  .timeline-h { grid-template-columns: 1fr 1fr; }
}
</style>
