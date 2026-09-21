<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => router.push({ path: '/english', query: { tab: 'cloze' } })

// 解题总纲三步（吃透思维导图主干）
const steps = [
  { no: '01', name: '读懂首句', desc: '完型首句通常不设空，是全文的“主题句 + 基调”。先读它锁定文章话题、作者态度（褒/贬），后面所有空都围绕这条主线。', example: '首句给“科技让生活更便利”→ 全文褒义基调，情感形容词优先选 positive 项' },
  { no: '02', name: '判断“谁和谁的关系”', desc: '先看空格落在哪一层——句中、句间、还是段间。这一步决定你去“句内找搭配”还是“跨句找逻辑连接词”。', example: '空格在句首且后面无逗号 → 多半是句间/段间逻辑词（however / therefore 类）' },
  { no: '03', name: '确定“什么逻辑”再选词', desc: '关系定了，再判方向：一致（顺承）还是对立（转折/让步）。以选项词为核心，从内到外找搭配、找复现、找逻辑信号。', example: '前后语义相反 → 锁转折簇；前后同向堆叠 → 锁并列/递进簇' }
]

// 五类词从内到外解题（思维导图“词义辨析”分支）
const wordTypes = [
  { name: '动词', icon: '⚡', inside: '看主谓宾是否搭配、看状语修饰', outside: '看上下句的逻辑关系（转折/因果）定方向', tip: '动词是完型第一大户，先判及物/不及物 + 与宾语的习惯搭配' },
  { name: '名词', icon: '📦', inside: '看主谓宾 / 主系表、看它的修饰语（形容词、后置定语、定从/同位从）', outside: '看指代词 this / these / such 回指的上文名词', tip: '名词常靠“上下文复现”解题，上文出现过的词或其上位词' },
  { name: '形容词', icon: '🎨', inside: '作表语修饰主语、作定语修饰名词、形容词短语（be + adj + 介词）', outside: '看作者态度与情感色彩（褒/贬/中性）', tip: '先定情感极性再选，正/负向往往一步秒杀两个干扰项' },
  { name: '副词', icon: '🧭', inside: '作状语修饰动词/形容词/整句', outside: '「短语和句子」之间的关系→用副词；「主句和从句」之间的关系→用连词', tip: '判词性：空格若能连接两个句子就是连词，若只是修饰就是副词' },
  { name: '介词', icon: '🔗', inside: '看搭配（动词/名词/形容词 + 固定介词）', outside: '空格在句首、或空格后无逗号时优先想介词短语作状语', tip: '介词题=纯搭配题，靠平时按“搭配块”积累，不靠语法推' }
]

// 谁和谁的关系（三层次）
const relations = [
  { name: '句内关系', where: '空格在句子中间', how: '答案在“本句之内”——找主谓宾搭配、修饰关系、指代，不必跨句。' },
  { name: '句间关系', where: '空格连着前后两个句子（最常见，大多数空在此）', how: '找逻辑连接词，判“一致 / 对立”，跨句取信号。' },
  { name: '段间关系', where: '空格在句首且后无逗号、或在段首、或在段落首句的句中', how: '看承上启下的过渡逻辑：转折、因果、递进、总结，往往统领整段基调。' }
]

// 什么逻辑：对立 vs 一致（思维导图逻辑关系全表）
const logicGroups = [
  {
    title: '对立逻辑（前后语义相反 / 让步）',
    tone: 'red',
    sets: [
      { label: '转折', words: 'however · but · yet · nevertheless · nonetheless' },
      { label: '让步·连词', words: 'although · though · even though · even if · while（三义：让步/对比/时间）' },
      { label: '让步·介词', words: 'despite · in spite of（后接名词/doing，不接句子）' },
      { label: '相反·反而', words: 'instead of · rather than · on the contrary · conversely · by contrast / in contrast' },
      { label: '否则 / 事实上', words: 'otherwise（adv 否则 / adj 不是那样） · in fact（确切说=补充，或强调=相反）' }
    ]
  },
  {
    title: '一致逻辑（前后同向：并列 / 因果 / 总分 / 递进）',
    tone: 'blue',
    sets: [
      { label: '并列', words: 'and · as well as · also · not only… but also · either… or · neither… nor · likewise · similarly' },
      { label: '因果·原因', words: 'because / because of · since · as · for · in that · now that · due to · owing to · considering that · seeing that' },
      { label: '因果·结果', words: 'therefore · consequently · thus · hence · as a result · so · so that' },
      { label: '递进', words: 'furthermore · moreover · what’s more · besides · in addition · apart from · even · indeed' },
      { label: '总分', words: '总结（in short / overall）↔ 例子（for example / for instance / such as）' }
    ]
  }
]

// 应试要点
const scoringRules = [
  '完型一篇 20 空、每空 0.5 分共 10 分，是“投入产出比最低”的题型，别恋战——整篇控制在 15–18 分钟',
  '单词量是地基：真题高频词+熟词僻义没过关时，技巧救不了生词，先补词再练题',
  '“从内到外”顺序：先本句搭配，本句定不了再跨句找逻辑，最后靠全文复现/基调兜底',
  '情感色彩与上下位复现是暗线：全文基调、褒贬、this/such 回指，能锁定词义辨析题',
  '做完必复盘四件事：错的那空是“搭配没记住 / 逻辑判反 / 生词卡壳”，归类补到词汇或搭配本'
]

// 读不懂文章怎么办：30 秒抢救主旨三步（尤其抽象议论/法律/制度类）
const rescueSteps = [
  { no: 'R1', name: '死磕首句（主题句）', desc: '完型首句从不设空，是命题人白送的主题句＋态度基调。只读它一句，先拿到“在谈什么 + 褒还是贬”。', example: '2012 首句：The ethical judgments of the Supreme Court justices have become an important issue recently. → 话题=大法官道德判断，基调=有问题(批评)' },
  { no: 'R2', name: '圈复现词', desc: '不逐句翻译，扫全文圈出反复出现的名词/形容词，它们拼起来就是主旨。', example: 'court / legitimacy / politics / impartial / code of conduct / ethics → “法院正当性来自独立于政治、需准则约束”' },
  { no: 'R3', name: '读末段＋态度词定骨架', desc: '末段一般给结论或建议；再扫情感词判方向。认得“现状被破坏→找原因→开药方”这套议论文骨架。', example: '负向词 cannot maintain/weakened/less likely/doubts ＋ 末段 must address/accountable = 问题→原因→建议三段式' }
]

// 完形复盘生词本：按年份累积做错过的“生词 / 熟词僻义 / 搭配”，学完回做真题闭环
const reviewWords = [
  {
    year: '2012',
    tone: '法律·制度类抽象文（最高法院与政治的边界）',
    items: [
      { word: 'accept', cn: '熟词僻义：不只是“接受”→ (be accepted as) 被当作、被认为是。记钩子：ac+cept(拿)→拿进来→接受', eg: '…makes it less likely that the court’s decisions will be accepted as impartial judgments.', from: '#4（你选C suspected）' },
      { word: 'impartial', cn: '公正的、不偏不倚。钩子：im-(不)+partial(偏袒的)→不偏袒→公正；反义 partial/biased', eg: 'the court’s reputation for being independent and impartial', from: '原文卡壳词，直接影响 #3/#4 判断' },
      { word: 'ethics code', cn: '道德准则、行为规范；= code of conduct（文中同义替换）', eg: 'the justices are not bound by an ethics code / the code of conduct', from: '#5 #6 语境核心词' },
      { word: 'subject (to)', cn: '熟词僻义：be subject to = 须服从、受…约束/适用（不是“主题/科目/话题”）。钩子：sub(下)+ject(投掷)→被置于…之下→受制于', eg: 'make itself subject to the code of conduct that applies to the rest of the federal judiciary', from: '#6（你选C immune，正好是反义干扰）' },
      { word: 'the rest (of)', cn: '“…中其余的部分/剩下的那些（人或物）”。the rest of + 名词；文中 the rest of the federal judiciary = 联邦司法系统里除最高法院大法官之外的其他法官', eg: 'the code of conduct that applies to the rest of the federal judiciary', from: '#7 后文理解卡点' },
      { word: 'judiciary', cn: '司法系统／司法机构，也指全体法官；federal judiciary = 联邦司法系统。钩子：judge(法官)→judic-(司法)→judiciary', eg: 'the rest of the federal judiciary', from: '#7 主题词' },
      { word: 'line', cn: '熟词僻义：line = 分界线、界限（不是“联系”！）。核心义“线”→画线把两物隔开→界线；a line between A and B = A与B之间的界限。你误当的“联系/连接”其实是形近词 link（line↔link 一字之差、方向相反：line分开，link连接）', eg: 'whether there is still a line between the court and politics（法院与政治之间是否还有界线）', from: '#9（你选B barrier，把line误解成“联系”方向反了）' },
      { word: 'upset', cn: '熟词僻义：及物动词还有“使不痛快→得罪、冒犯”(=offend/displease)，你熟的是“难过/打乱”。钩子：up+set 把立着的东西弄翻→把人心绪弄翻→得罪。upset sb. = 得罪某人', eg: 'They gave justices permanent positions so they would be free to upset those in power（给终身制，好让他们敢于得罪当权者）', from: '#12（干扰 serve/satisfy 方向相反，replace 过猛）' },
      { word: 'cultivate', cn: '熟词僻义：不只是“耕种”→ 经营、培育、拉拢（关系/支持/好感）。cultivate political support = 拉拢政治支持', eg: 'and have no need to cultivate political support（且无须去拉拢政治支持）', from: '#13（与 upset 同句对仗：敢得罪权贵＋无须拉拢支持）' },
      { word: 'inescapably', cn: '不可避免地、逃脱不了地。拆词 in-(不)+escape(逃脱)+-ably；同义 inevitably / unavoidably', eg: 'the law it shapes is inescapably political（它所塑造的法律不可避免地带有政治性）', from: '#16 前后理解卡点' },
      { word: 'shape', cn: '熟词僻义：作动词 = 塑造、形成、决定…的走向（不是名词“形状”）。policy shapes the law = 政策塑造/决定法律', eg: 'When the court deals with social policy decisions, the law it shapes is inescapably political', from: '#16（正确C shapes；你选D controls 过重，excludes/questions 不合）' },
      { word: 'dismiss (as)', cn: '熟词僻义：be dismissed as + 贬义词 = 把…斥为…、当作…而不予采信/不理会（不只是“解散/解雇”）。钩子：dis-(离开)+miss(送)→打发走→不当回事。固定：dismissed as unjust / a joke / nonsense', eg: 'decisions split along ideological lines are so easily dismissed as unjust（按意识形态划线的裁决很容易被斥为不公而不采信）', from: '#17（正确A dismissed；你选D distorted 不接 as 且语义偏“曲解”，不合）' },
      { word: 'address', cn: '熟词僻义（考研/写作高频）：动词 = 处理、应对、设法解决(=deal with / tackle)；address the problem/issues/concerns/doubts/needs。你熟的“地址/演讲”之外必掌握这一义', eg: 'The justices must address doubts about the court’s legitimacy by making themselves accountable to the code of conduct（须回应/打消对法院正当性的质疑）', from: '#18（正确C address；suppress压制/ignore忽略/exploit利用 皆为“绕过问题”，只有address是“主动解决”）' },
      { word: 'by all means / at all costs / in a word / as a result', cn: '四个高频连接短语打包：① by all means 口语“当然可以、尽管！”(表许可) 或加强语气“务必、一定”（不是字面“用所有方法”）② at all costs (=at any cost) 不惜一切代价（表决心）③ in a word 总之（用于总结）④ as a result 因此、结果（唯一表因果递进）', eg: '—May I use your phone? —By all means! / 原文：…seen as separate from politics and, as a result, convincing as law（因此才能被当作真正的法律）', from: '#20（正确D as a result 因→果；你选A by all means 是“许可/务必”，不合因果链）' },
      { word: 'be bound by', cn: '熟词僻义：bind(绑) → 过去分词 bound → be bound by + 规则/法律/协议 = 受…约束、被…绑定；反义 be free from。别把 bound 只当形容词“绑好的/注定的(be bound to do=一定会做)”。同族：binding(有约束力的)、unbound(不受约束的)', eg: 'Part of the problem is that the justices are not bound by an ethics code（问题部分在于大法官并不受道德准则约束）', from: '#5（正确C bound；你选D founded 完全没联系，因不认得 bind→bound 变化）' }
    ]
  },
  {
    year: '2013',
    tone: `行为心理·决策偏见（Simonsohn：人做决定时是"情境盲"，法官/招生官被当天手上的连续样本带偏）`,
    items: [
      { word: `on the whole`, cn: `整体来说、总的来说（=generally / overall），用于对全局做一个概括性评价。别和 as a whole（作为整体）混。`, eg: `People are, on the whole, poor at considering background information when making individual decisions.（整体来说，人们做个人决策时都不擅长考虑背景信息。）`, from: `首句固定表达（非空格），全文基调句` },
      { word: `external`, cn: `外部的、外面的（=outside/outward），反义 internal（内部的）。钩子：exter-外部→同族 exterior/extra。external factors＝外部因素。`, eg: `…a strength that grants the ability to make judgments which are unbiased by external factors.（看似优点：让人做出不受外部因素干扰的判断。）`, from: `#2（正确答案D external；干扰项A minor/B objective/C crucial）` },
      { word: `minor`, cn: `次要的、轻微的、不重要的（=lesser/secondary）；作名词还指"未成年人"。钩子：min-小（同 minimum/minority）→小的→次要的。`, eg: `#2 干扰项：minor factors＝次要因素——但上下文讲的是"不受外界(external)影响"，不是"不受次要影响"，故排除。`, from: `#2 选项A（用户标注：次要）` },
      { word: `big picture`, cn: `整体情况、全局、大局。固定搭配 see / consider / look at the big picture＝着眼全局、从大处看；反义 the details（细枝末节）。`, eg: `…an inability to consider the big picture was leading decision-makers to be biased…（不考虑全局，反而让决策者带有偏见。）`, from: `#3（正确答案 picture，构成 the big picture）` },
      { word: `turn to`, cn: `转向（某人/某物）寻求帮助、求助于、借助。=go to sb. for help。另有"翻到(书页)、转到(话题)"义。钩子：转身面向某人→向他求援。`, eg: `To test this idea, he turned to the university-admissions process.（为验证这个想法，他转向求助于大学招生流程这个案例。）`, from: `第二段固定表达（非空格）` },
      { word: `fond`, cn: `be fond of＝喜欢、喜爱（=like/love，语气更温情）。a judge fond of appearing too soft on crime＝一个乐于显得对犯罪心慈手软的法官。`, eg: `…a judge fond of appearing too soft on crime might be more likely to send someone to prison…`, from: `#5（正确答案 fond of）` }
    ]
  }
]
</script>

<template>
  <div class="cz-wrap">
    <div class="page-header">
      <el-button type="primary" link @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回英语作战室
      </el-button>
      <h2>🧩 考研英语完型填空解题方法</h2>
      <p>三_step_总纲 · 五类词从内到外 · 谁和谁的关系 · 对立/一致逻辑全表 · 应试要点</p>
    </div>

    <!-- 一句话总纲 -->
    <section class="cz-intro">
      <div class="cz-intro-item">
        <strong>20 空 / 10 分</strong>
        <span>每空 0.5 分，耗时高、区分度低——目标是“稳拿中等分、不追求满分”，为阅读写作省时间</span>
      </div>
      <div class="cz-intro-item">
        <strong>单词是地基</strong>
        <span>技巧解决“熟词怎么选错”，词汇量决定“能不能选对”。词没过关前，先补词再刷题</span>
      </div>
      <div class="cz-intro-item">
        <strong>三步定答案</strong>
        <span>读懂首句定基调 → 判断空格在哪一层关系 → 以选项词为核心从内到外找逻辑与搭配</span>
      </div>
    </section>

    <!-- 三步总纲 -->
    <h3 class="cz-h3">🧭 解题总纲三步</h3>
    <div class="cz-steps">
      <div v-for="s in steps" :key="s.no" class="cz-step">
        <span class="step-no">{{ s.no }}</span>
        <strong>{{ s.name }}</strong>
        <p>{{ s.desc }}</p>
        <code>{{ s.example }}</code>
      </div>
    </div>

    <!-- 读不懂文章怎么办 -->
    <h3 class="cz-h3">🆘 读不懂文章怎么办 · 30 秒抢救主旨</h3>
    <div class="cz-steps">
      <div v-for="s in rescueSteps" :key="s.no" class="cz-step">
        <span class="step-no">{{ s.no }}</span>
        <strong>{{ s.name }}</strong>
        <p>{{ s.desc }}</p>
        <code>{{ s.example }}</code>
      </div>
    </div>

    <!-- 五类词 -->
    <h3 class="cz-h3">🔤 五类词“从内到外”解题</h3>
    <div class="cz-word-grid">
      <div v-for="w in wordTypes" :key="w.name" class="cz-word">
        <div class="word-head">
          <span class="word-icon">{{ w.icon }}</span>
          <strong>{{ w.name }}</strong>
        </div>
        <p class="from-in"><em>内（本句）</em>{{ w.inside }}</p>
        <p class="from-out"><em>外（跨句）</em>{{ w.outside }}</p>
        <code>{{ w.tip }}</code>
      </div>
    </div>

    <!-- 谁和谁的关系 -->
    <h3 class="cz-h3">🔀 先判断：谁和谁的关系</h3>
    <div class="cz-rel-list">
      <div v-for="r in relations" :key="r.name" class="cz-rel">
        <strong>{{ r.name }}</strong>
        <span class="rel-where">{{ r.where }}</span>
        <span class="rel-how">{{ r.how }}</span>
      </div>
    </div>

    <!-- 什么逻辑 -->
    <h3 class="cz-h3">⚖️ 再判断：什么逻辑（信号词全表）</h3>
    <div class="cz-logic">
      <div v-for="g in logicGroups" :key="g.title" class="cz-logic-group" :class="g.tone">
        <div class="logic-title">{{ g.title }}</div>
        <div class="logic-sets">
          <div v-for="s in g.sets" :key="s.label" class="logic-set">
            <span class="set-label">{{ s.label }}</span>
            <span class="set-words">{{ s.words }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 应试要点 -->
    <h3 class="cz-h3">📏 应试要点与复盘</h3>
    <ul class="cz-rules">
      <li v-for="(r, i) in scoringRules" :key="i">{{ r }}</li>
    </ul>

    <!-- 复盘生词本 -->
    <h3 class="cz-h3">📕 完形复盘生词本（按年份累积）</h3>
    <div class="cz-review">
      <div v-for="g in reviewWords" :key="g.year" class="review-year">
        <div class="review-year-head">
          <span class="review-year-badge">{{ g.year }} 年</span>
          <em>{{ g.tone }}</em>
        </div>
        <div class="review-items">
          <div v-for="(it, i) in g.items" :key="i" class="review-card">
            <div class="rc-word">{{ it.word }}</div>
            <div class="rc-cn">{{ it.cn }}</div>
            <div class="rc-eg">“{{ it.eg }}”</div>
            <div class="rc-from">📍 {{ it.from }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="cz-cta">
      方法千万条，词汇第一条 —— 先在「词汇系统」把真题高频词过关，再回这页用“三步 + 逻辑表”逐空拆 2005–2025 完型真题。
    </div>
  </div>
</template>

<style scoped>
.cz-wrap {
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

.cz-h3 {
  font-size: 1.1rem;
  color: var(--ink);
  margin: 26px 0 14px;
  padding-left: 12px;
  border-left: 4px solid var(--gold);
}

/* 一句话总纲 */
.cz-intro {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
}
.cz-intro-item {
  background: linear-gradient(160deg, var(--navy-deep), var(--navy));
  border-radius: 12px;
  padding: 18px 20px;
}
.cz-intro-item strong {
  display: block;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 1.55rem;
  color: var(--gold);
  letter-spacing: 0.04em;
  margin-bottom: 6px;
}
.cz-intro-item span {
  color: #a8bdd4;
  font-size: 0.8rem;
  line-height: 1.65;
}

/* 三步 */
.cz-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
}
.cz-step {
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
.cz-step strong {
  display: block;
  font-size: 1rem;
  color: var(--ink);
  margin: 4px 0 8px;
}
.cz-step p {
  margin: 0 0 10px;
  font-size: 0.82rem;
  color: var(--body);
  line-height: 1.7;
}
.cz-step code, .cz-word code {
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

/* 五类词 */
.cz-word-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 14px;
}
.cz-word {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 16px 18px;
  transition: all 0.22s ease;
}
.cz-word:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 22px rgba(13, 33, 55, 0.1);
  border-color: var(--gold);
}
.word-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.word-icon { font-size: 1.2rem; }
.word-head strong { color: var(--ink); font-size: 1rem; }
.cz-word p {
  margin: 0 0 8px;
  font-size: 0.8rem;
  color: var(--body);
  line-height: 1.65;
}
.cz-word p em {
  font-style: normal;
  font-weight: 700;
  color: var(--navy);
  margin-right: 6px;
  padding: 1px 6px;
  border-radius: 5px;
  background: rgba(22, 52, 92, 0.08);
  font-size: 0.72rem;
}
.from-out em { color: #a8501a; background: rgba(168, 80, 26, 0.1) !important; }

/* 谁和谁的关系 */
.cz-rel-list { display: flex; flex-direction: column; gap: 8px; }
.cz-rel {
  display: grid;
  grid-template-columns: 96px 1fr;
  grid-template-areas: "name where" "name how";
  column-gap: 14px;
  row-gap: 2px;
  align-items: baseline;
  background: #fff;
  border: 1px solid var(--line);
  border-left: 4px solid var(--navy);
  border-radius: 10px;
  padding: 11px 16px;
  transition: all 0.2s;
}
.cz-rel:hover { border-left-color: var(--gold); transform: translateX(4px); }
.cz-rel strong { grid-area: name; color: var(--navy); font-size: 0.9rem; white-space: nowrap; }
.rel-where { grid-area: where; font-size: 0.82rem; color: var(--gold-deep, #f0a820); font-weight: 600; }
.rel-how { grid-area: how; font-size: 0.8rem; color: var(--body); line-height: 1.65; }

/* 什么逻辑 */
.cz-logic { display: flex; flex-direction: column; gap: 14px; }
.cz-logic-group {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 14px 16px;
}
.cz-logic-group.red { border-top: 4px solid #d9534f; }
.cz-logic-group.blue { border-top: 4px solid var(--navy); }
.logic-title {
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 12px;
}
.cz-logic-group.red .logic-title { color: #b23c38; }
.cz-logic-group.blue .logic-title { color: var(--navy); }
.logic-sets { display: flex; flex-direction: column; gap: 8px; }
.logic-set {
  display: grid;
  grid-template-columns: 104px 1fr;
  gap: 12px;
  align-items: baseline;
}
.set-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--ink);
  white-space: nowrap;
}
.set-words {
  font-family: 'Georgia', serif;
  font-size: 0.8rem;
  color: var(--navy);
  line-height: 1.7;
}

/* 应试要点 */
.cz-rules {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.cz-rules li {
  position: relative;
  padding: 10px 14px 10px 34px;
  background: #fff8ec;
  border-radius: 10px;
  font-size: 0.84rem;
  color: #4a3d1a;
  line-height: 1.7;
}
.cz-rules li::before {
  content: '✓';
  position: absolute;
  left: 12px;
  color: var(--gold);
  font-weight: 800;
}

.cz-cta {
  margin-top: 26px;
  background: linear-gradient(135deg, #fff8ec, #fffdf5);
  border: 1px solid rgba(255, 197, 61, 0.45);
  border-radius: 12px;
  padding: 16px 20px;
  font-size: 0.88rem;
  color: var(--navy);
}

/* 复盘生词本 */
.cz-review { display: flex; flex-direction: column; gap: 16px; }
.review-year {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 14px 16px;
}
.review-year-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.review-year-badge {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #fff;
  background: linear-gradient(135deg, var(--navy-deep), var(--navy));
  border-radius: 8px;
  padding: 3px 12px;
  white-space: nowrap;
}
.review-year-head em {
  font-style: normal;
  font-size: 0.8rem;
  color: #5b6b7f;
}
.review-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}
.review-card {
  border: 1px solid var(--line);
  border-left: 4px solid var(--gold);
  border-radius: 10px;
  padding: 12px 15px;
  background: var(--bg-soft);
  transition: all 0.2s;
}
.review-card:hover { border-left-color: var(--navy); box-shadow: 0 6px 18px rgba(13,33,55,0.08); }
.rc-word {
  font-family: 'Georgia', serif;
  font-weight: 700;
  font-size: 1.02rem;
  color: var(--navy);
  margin-bottom: 5px;
}
.rc-cn {
  font-size: 0.82rem;
  color: var(--body);
  line-height: 1.65;
  margin-bottom: 7px;
}
.rc-eg {
  font-family: 'Georgia', serif;
  font-size: 0.78rem;
  font-style: italic;
  color: var(--navy);
  background: #fff;
  border-radius: 7px;
  padding: 7px 10px;
  line-height: 1.6;
  word-break: break-word;
}
.rc-from {
  margin-top: 6px;
  font-size: 0.72rem;
  color: #a06a00;
}

@media (max-width: 768px) {
  .review-items { grid-template-columns: 1fr; }
}
</style>
