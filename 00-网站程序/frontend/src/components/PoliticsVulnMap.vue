<script setup lang="ts">
// 政治 · 考点漏洞地图（肖1000 一刷 483 题 → 381 考点簇 / 417 手册节点）
// 两个视图：🕳 漏洞地图（按章看簇，逐题 ●漏选 ▲错选 + 为什么）｜✍️ 手册抄写清单（勾选进度本地存）
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  loadPoliticsVuln, vulnMap, vulnLoading, vulnError, vulnStats, letters,
  hbKey, isMarkDone, toggleMark, resetMarks, hbCount, initHandbookProgress,
  type VulnGroup
} from '@/data/politicsVuln'
import { ElMessage } from 'element-plus'

/** 单选题的正确项字母（漏洞地图里单选把"应选+你选"都塞进 extra，这里回捞真值做配色） */
function pairCorrect(id: string): string {
  return letters.value[id]?.correct || ''
}
function copyMark(text: string) {
  const t = (text || '').trim()
  if (!t) return
  navigator.clipboard?.writeText(t)
    .then(() => ElMessage.success('标注短语已复制，去手册分支旁写上'))
    .catch(() => ElMessage.info('浏览器不允许自动复制，选中文字手动复制即可'))
}

const view = ref<'map' | 'handbook'>('map')
const subject = ref('all')
const chapter = ref('all')
const onlyHot = ref(false)
const kw = ref('')

// 支持从「今日动作」/错题本直达：?tab=vuln&sub=马原&chap=马原·第四章&kw=劳动二重性&view=handbook
const route = useRoute()
function applyQuery() {
  const q = route.query
  if (typeof q.sub === 'string' && q.sub) subject.value = q.sub
  if (typeof q.chap === 'string' && q.chap) chapter.value = q.chap
  if (typeof q.kw === 'string' && q.kw) kw.value = q.kw
  if (q.view === 'handbook') view.value = 'handbook'
}
onMounted(() => {
  initHandbookProgress()
  applyQuery()
  loadPoliticsVuln()
})
watch(() => route.query, applyQuery)

const SUBJ = ['马原', '史纲', '新思想', '思修']

const m = computed(() => vulnMap.value)
const stats = computed(() => (m.value ? vulnStats(m.value) : null))

const chaptersOfSubject = computed(() => {
  if (!m.value) return []
  return m.value.chapters.filter(c => subject.value === 'all' || c.subject === subject.value)
})

function matchKw(g: VulnGroup) {
  const k = kw.value.trim().toLowerCase()
  if (!k) return true
  if (g.group.toLowerCase().includes(k)) return true
  return g.questions.some(q =>
    (q.kp || '').toLowerCase().includes(k) ||
    (q.mark || '').toLowerCase().includes(k) ||
    (q.err || '').toLowerCase().includes(k) ||
    [...(q.miss || []), ...(q.extra || [])].some(l => (l.t || '').toLowerCase().includes(k) || (l.why || '').toLowerCase().includes(k))
  )
}

const visibleGroups = computed(() => {
  if (!m.value) return []
  return m.value.groups
    .filter(g => subject.value === 'all' || g.subject === subject.value)
    .filter(g => chapter.value === 'all' || g.chapter === chapter.value)
    .filter(g => !onlyHot.value || g.hot)
    .filter(matchKw)
    .sort((a, b) => (b.hot ? 1 : 0) - (a.hot ? 1 : 0) || b.count - a.count || a.chapter.localeCompare(b.chapter, 'zh'))
})

// ── 手册抄写清单 ──
const nodes = computed(() => {
  if (!m.value) return []
  const k = kw.value.trim().toLowerCase()
  return m.value.handbook
    .filter(n => subject.value === 'all' || n.subject === subject.value)
    .filter(n => chapter.value === 'all' || n.chapter === chapter.value)
    .filter(n => !k || n.node.toLowerCase().includes(k) || n.marks.some(x => (x.mark || '').toLowerCase().includes(k)))
})
const nodeKeys = computed(() => {
  const out: string[] = []
  nodes.value.forEach(n => n.marks.forEach(x => out.push(hbKey(n.subject, n.node, x.mark))))
  return out
})
const hbStat = computed(() => hbCount(nodeKeys.value))
const expandedNode = ref<string>('')
const toggleNode = (k: string) => { expandedNode.value = expandedNode.value === k ? '' : k }

// 分科节点数（今日动作用同一份数据）
const nodesBySubject = computed(() => {
  const mm: Record<string, { total: number; done: number }> = {}
  ;(m.value?.handbook || []).forEach(n => {
    const r = (mm[n.subject] ||= { total: 0, done: 0 })
    n.marks.forEach(x => { r.total++; if (isMarkDone(hbKey(n.subject, n.node, x.mark))) r.done++ })
  })
  return mm
})
defineExpose({ nodesBySubject })

const heatClass = (t: number) => (t >= 20 ? 'hi' : t >= 10 ? 'mid' : 'lo')
</script>

<template>
  <div class="vm">
    <div v-if="vulnLoading && !m" class="vm-tip">正在载入考点漏洞地图数据…</div>
    <div v-else-if="vulnError" class="vm-tip err">数据载入失败：{{ vulnError }}（刷新或检查 public/data/politics/ 下两个 json 是否已部署）</div>

    <template v-else-if="m && stats">
      <!-- 顶部数字条 -->
      <div class="vm-strip">
        <div class="vs-item"><b>{{ m.meta.total }}</b><span>一刷错题</span></div>
        <div class="vs-item"><b>{{ stats.groups }}</b><span>考点簇</span></div>
        <div class="vs-item"><b>{{ stats.nodes }}</b><span>手册节点</span></div>
        <div class="vs-item hot"><b>{{ stats.hotGroups }}</b><span>顽固簇（≥2题）</span></div>
        <div class="vs-item miss"><b>{{ stats.miss }}</b><span>漏选人次</span></div>
        <div class="vs-item extra"><b>{{ stats.extra }}</b><span>错选人次</span></div>
      </div>

      <!-- 视图 + 筛选 -->
      <div class="vm-bar">
        <div class="seg">
          <button :class="{ on: view === 'map' }" @click="view = 'map'">🕳 漏洞地图</button>
          <button :class="{ on: view === 'handbook' }" @click="view = 'handbook'">✍️ 手册抄写清单</button>
        </div>
        <div class="chips">
          <button class="chip" :class="{ on: subject === 'all' }" @click="subject = 'all'; chapter = 'all'">全部</button>
          <button v-for="s in SUBJ" :key="s" class="chip" :class="{ on: subject === s }"
                  @click="subject = s; chapter = 'all'">{{ s }}（{{ m.meta.subjects[s] }}）</button>
        </div>
        <select v-model="chapter" class="sel">
          <option value="all">全部章节</option>
          <option v-for="c in chaptersOfSubject" :key="c.chapter" :value="c.chapter">
            {{ c.chapter }} · {{ c.total }}题
          </option>
        </select>
        <label class="ck"><input type="checkbox" v-model="onlyHot" /> 只看顽固簇</label>
        <input v-model="kw" class="search" type="search" placeholder="搜考点 / 标注短语 / 选项原话…" />
        <span class="count">
          <template v-if="view === 'map'">{{ visibleGroups.length }} 簇</template>
          <template v-else>{{ nodes.length }} 节点 · 已抄 {{ hbStat.done }}/{{ hbStat.total }}</template>
        </span>
      </div>

      <!-- ══ 视图1：漏洞地图 ══ -->
      <div v-if="view === 'map'" class="vm-body">
        <div class="legend">
          <span><i class="dot miss"></i>漏选</span>
          <span><i class="dot extra"></i>错选</span>
          <span><i class="dot hot"></i>顽固簇=同一知识点重复错 ≥2 次（二轮优先）</span>
          <span>红笔抄漏选 · 蓝笔抄错选 · 紫笔补"成套 N 条"</span>
        </div>

        <!-- 各章热度索引 -->
        <details class="heat">
          <summary>📊 各章错点索引（{{ m.chapters.length }} 章，点开展开）</summary>
          <div class="heat-grid">
            <button v-for="c in m.chapters" :key="c.subject + c.chapter"
                    class="heat-cell" :class="[heatClass(c.total), { cur: chapter === c.chapter }]"
                    @click="subject = c.subject; chapter = c.chapter">
              <b>{{ c.total }}</b><span>{{ c.chapter }}</span>
              <em>漏{{ c.miss }} 错{{ c.extra }} · {{ c.groupCount }}簇</em>
            </button>
          </div>
        </details>

        <div v-if="!visibleGroups.length" class="vm-tip">没有符合条件的考点簇，换个筛选或清空搜索词。</div>

        <section v-for="g in visibleGroups" :key="g.key" class="grp" :class="{ hot: g.hot }">
          <header class="grp-h">
            <h3>{{ g.group }}<span v-if="g.hot" class="badge-hot">×{{ g.count }} 顽固</span></h3>
            <span class="grp-sub">{{ g.subject }} · {{ g.chapter }} · {{ g.count }} 题</span>
          </header>

          <article v-for="q in g.questions" :key="q.id" class="q">
            <div class="q-top">
              <span class="q-id">{{ q.id }}</span>
              <span class="q-type">{{ q.qtype }}</span>
              <span class="q-kp">{{ q.kp }}</span>
            </div>

            <div v-if="q.miss && q.miss.length" class="letters">
              <div v-for="l in q.miss" :key="'m' + l.l" class="lt miss">
                <span class="lt-l">● 漏选 {{ l.l }}</span>
                <span class="lt-t">{{ l.t }}</span>
                <p v-if="l.why" class="lt-w">{{ l.why }}</p>
              </div>
            </div>
            <div v-if="q.extra && q.extra.length" class="letters">
              <div v-for="l in q.extra" :key="'e' + l.l" class="lt"
                   :class="(q.singlePair && pairCorrect(q.id).includes(l.l)) ? 'miss' : 'extra'">
                <span class="lt-l">{{ q.singlePair ? (pairCorrect(q.id).includes(l.l) ? '◆ 应选 ' : '◇ 你选 ') : '▲ 错选 ' }}{{ l.l }}</span>
                <span class="lt-t">{{ l.t }}</span>
                <p v-if="l.why" class="lt-w">{{ l.why }}</p>
              </div>
            </div>

            <div class="q-foot">
              <div class="mark" title="双击复制这句标注短语" @dblclick="copyMark(q.mark)"><b>抄手册</b> {{ q.mark }}</div>
              <div v-if="q.err" class="err-line"><b>错因</b> {{ q.err }}</div>
              <div v-if="q.fix" class="fix-line"><b>处方</b> {{ q.fix }}</div>
              <div class="q-links">
                <router-link :to="`/politics?tab=practice&kw=${encodeURIComponent(q.id)}`">回炉这题 →</router-link>
                <router-link to="/wrong-problems?subject=politics">错题本 →</router-link>
              </div>
            </div>
          </article>
        </section>
      </div>

      <!-- ══ 视图2：手册抄写清单 ══ -->
      <div v-else class="vm-body">
        <div class="hb-intro">
          <div class="hb-prog">
            <div class="bar"><i :style="{ width: (hbStat.total ? hbStat.done / hbStat.total * 100 : 0) + '%' }"></i></div>
            <span>{{ hbStat.done }} / {{ hbStat.total }} 条已抄到手册</span>
          </div>
          <p>三步定位：<b>章 → 手册分支名 → 节点右下方空白抄短语</b>；手册上没有同名分支就挂到父节点，短语前加「△挂靠」。
             句式统一「①轮 + 动作 + 字母 + 一句原话」≤30 字，末尾带题号回指。二轮同一节点再错补「×2」＝顽固错点，进考前最后一晚默写清单。</p>
          <button class="ins-reset" @click="resetMarks()">重置抄写进度</button>
        </div>

        <div v-if="!nodes.length" class="vm-tip">没有符合条件的节点。</div>

        <div v-for="n in nodes" :key="n.subject + n.chapter + n.node" class="node">
          <header class="node-h" @click="toggleNode(n.subject + n.chapter + n.node)">
            <span class="nh-arrow">{{ expandedNode === n.subject + n.chapter + n.node ? '▾' : '▸' }}</span>
            <span class="nh-chap">{{ n.chapter }}</span>
            <b class="nh-node">{{ n.node }}</b>
            <span class="nh-n">{{ n.marks.length }} 条</span>
          </header>
          <ul v-show="expandedNode === n.subject + n.chapter + n.node" class="nh-list">
            <li v-for="(x, i) in n.marks" :key="i" class="nh-item">
              <label class="cb">
                <input type="checkbox" :checked="isMarkDone(hbKey(n.subject, n.node, x.mark))"
                       @change="toggleMark(hbKey(n.subject, n.node, x.mark))" />
                <span class="mark-txt">{{ x.mark }}</span>
              </label>
              <span class="nh-meta">
                <em v-if="x.kp">{{ x.kp }}</em>
                <code>{{ (x.ids || []).join(' · ') }}</code>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.vm {
  --vm-ink: #1f2d3d; --vm-body: #303133; --vm-muted: #5b6b7f;
  --vm-gold: #ffc53d; --vm-navy: #16345c; --vm-line: #e4ebf3; --vm-soft: #f5f8fc;
  --vm-miss: #e05656; --vm-extra: #2f6fb5; --vm-hot: #d94848; --vm-green: #2e9e6b;
  font-family: 'FZCuHei', system-ui, sans-serif;
  color: var(--vm-body); display: flex; flex-direction: column; gap: 16px;
}
.vm-tip { padding: 18px; color: var(--vm-muted); background: var(--vm-soft); border-radius: 10px; font-size: .9rem; }
.vm-tip.err { color: #a33; background: #fdf0f0; }

/* 数字条 */
.vm-strip { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; }
.vs-item { background: linear-gradient(150deg, #0d2137, #16345c); border-radius: 12px; padding: 12px 14px; text-align: center; }
.vs-item b { display: block; font-size: 1.6rem; color: var(--vm-gold); font-family: 'JetBrains Mono', monospace; }
.vs-item span { font-size: .74rem; color: #a8bdd4; }
.vs-item.miss b { color: #ff9b9b; } .vs-item.extra b { color: #8fc4ff; } .vs-item.hot b { color: #ffd0a6; }

/* 筛选栏 */
.vm-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; padding: 12px 14px; border: 1px solid var(--vm-line); border-radius: 12px; background: #fff; }
.seg { display: inline-flex; border: 1px solid var(--vm-line); border-radius: 10px; overflow: hidden; }
.seg button { border: none; background: #fff; padding: 8px 14px; font-size: .86rem; cursor: pointer; color: var(--vm-muted); }
.seg button.on { background: var(--vm-navy); color: #fff; font-weight: 700; }
.chips { display: inline-flex; gap: 6px; flex-wrap: wrap; }
.chip { border: 1px solid var(--vm-line); background: var(--vm-soft); color: var(--vm-muted); border-radius: 999px; padding: 5px 12px; font-size: .8rem; cursor: pointer; }
.chip.on { background: var(--vm-gold); border-color: var(--vm-gold); color: #6b4a00; font-weight: 800; }
.sel, .search { border: 1px solid var(--vm-line); border-radius: 8px; padding: 7px 10px; font-size: .84rem; color: var(--vm-body); background: #fff; }
.search { min-width: 220px; }
.ck { font-size: .8rem; color: var(--vm-muted); display: inline-flex; align-items: center; gap: 5px; }
.count { margin-left: auto; font-family: 'JetBrains Mono', monospace; font-size: .78rem; color: var(--vm-navy); }

/* 图例 */
.legend { display: flex; flex-wrap: wrap; gap: 14px; font-size: .78rem; color: var(--vm-muted); align-items: center; }
.legend .dot { display: inline-block; width: 9px; height: 9px; border-radius: 50%; margin-right: 5px; }
.dot.miss { background: var(--vm-miss); } .dot.extra { background: var(--vm-extra); } .dot.hot { background: var(--vm-hot); }

/* 各章索引 */
.heat { border: 1px dashed var(--vm-line); border-radius: 12px; padding: 10px 14px; background: #fff; }
.heat summary { cursor: pointer; font-size: .9rem; font-weight: 700; color: var(--vm-navy); }
.heat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 8px; margin-top: 12px; }
.heat-cell { text-align: left; border: 1px solid var(--vm-line); border-radius: 10px; padding: 8px 10px; background: var(--vm-soft); cursor: pointer; }
.heat-cell b { font-family: 'JetBrains Mono', monospace; font-size: 1.1rem; margin-right: 6px; }
.heat-cell span { font-size: .82rem; color: var(--vm-ink); }
.heat-cell em { display: block; font-style: normal; font-size: .72rem; color: var(--vm-muted); }
.heat-cell.hi b { color: var(--vm-hot); } .heat-cell.mid b { color: #d98a00; } .heat-cell.lo b { color: var(--vm-navy); }
.heat-cell.cur { border-color: var(--vm-gold); background: #fffdf6; }

/* 考点簇 */
.grp { border: 1px solid var(--vm-line); border-radius: 14px; background: #fff; padding: 16px 18px; }
.grp.hot { border-color: rgba(217, 72, 72, .45); box-shadow: 0 0 0 3px rgba(217, 72, 72, .06); }
.grp-h { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; border-bottom: 1px dashed var(--vm-line); padding-bottom: 8px; margin-bottom: 10px; }
.grp-h h3 { margin: 0; font-size: 1.08rem; color: var(--vm-ink); }
.badge-hot { margin-left: 8px; font-size: .7rem; font-weight: 800; color: #fff; background: var(--vm-hot); border-radius: 6px; padding: 2px 7px; vertical-align: middle; }
.grp-sub { font-size: .76rem; color: var(--vm-muted); font-family: 'JetBrains Mono', monospace; }

.q { padding: 10px 0; border-top: 1px solid #f2f5f9; }
.q:first-of-type { border-top: none; }
.q-top { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; margin-bottom: 6px; }
.q-id { font-family: 'JetBrains Mono', monospace; font-size: .72rem; color: #8a98a8; background: var(--vm-soft); border-radius: 5px; padding: 1px 6px; }
.q-type { font-size: .7rem; font-weight: 800; color: var(--vm-navy); background: rgba(22, 52, 92, .08); border-radius: 5px; padding: 1px 6px; }
.q-kp { font-size: .92rem; color: var(--vm-ink); font-weight: 700; }

.letters { display: flex; flex-direction: column; gap: 6px; margin: 6px 0; }
.lt { border-left: 3px solid var(--vm-line); padding: 6px 10px; background: var(--vm-soft); border-radius: 0 8px 8px 0; }
.lt.miss { border-left-color: var(--vm-miss); }
.lt.extra { border-left-color: var(--vm-extra); }
.lt-l { font-size: .74rem; font-weight: 800; margin-right: 8px; }
.lt.miss .lt-l { color: var(--vm-miss); } .lt.extra .lt-l { color: var(--vm-extra); }
.lt-t { font-size: .86rem; color: var(--vm-ink); }
.lt-w { margin: 3px 0 0; font-size: .8rem; color: var(--vm-muted); line-height: 1.65; }

.q-foot { margin-top: 8px; display: flex; flex-direction: column; gap: 4px; }
.mark { font-size: .86rem; color: #6b4a00; background: #fff8ec; border: 1px solid rgba(255, 197, 61, .45); border-radius: 8px; padding: 6px 10px; }
.mark b { color: #a37200; margin-right: 6px; font-size: .76rem; }
.err-line, .fix-line { font-size: .82rem; line-height: 1.65; color: var(--vm-body); }
.err-line b { color: var(--vm-hot); margin-right: 6px; }
.fix-line b { color: var(--vm-green); margin-right: 6px; }
.q-links { display: flex; gap: 12px; margin-top: 2px; }
.q-links a { font-size: .76rem; color: var(--vm-navy); text-decoration: none; border-bottom: 1px dotted var(--vm-navy); }

/* 手册清单 */
.hb-intro { border: 1px solid rgba(46, 158, 107, .4); background: linear-gradient(180deg, #f4fbf7, #fff); border-radius: 12px; padding: 14px 16px; }
.hb-intro p { margin: 10px 0; font-size: .84rem; color: var(--vm-body); line-height: 1.8; }
.hb-intro b { color: var(--vm-navy); }
.hb-prog { display: flex; align-items: center; gap: 12px; font-size: .82rem; color: #1f4d38; font-weight: 700; }
.hb-prog .bar { flex: 1; height: 8px; background: #e7f4ec; border-radius: 5px; overflow: hidden; }
.hb-prog .bar i { display: block; height: 100%; background: var(--vm-green); border-radius: 5px; transition: width .4s; }
.ins-reset { border: 1px solid var(--vm-line); background: #fff; color: var(--vm-muted); border-radius: 8px; padding: 6px 12px; font-size: .78rem; cursor: pointer; }

.node { border: 1px solid var(--vm-line); border-radius: 12px; background: #fff; overflow: hidden; }
.node-h { display: flex; align-items: center; gap: 10px; padding: 10px 14px; cursor: pointer; }
.node-h:hover { background: var(--vm-soft); }
.nh-arrow { color: #9fb0c2; font-size: .8rem; width: 12px; }
.nh-chap { font-size: .74rem; color: var(--vm-muted); font-family: 'JetBrains Mono', monospace; }
.nh-node { font-size: .98rem; color: var(--vm-ink); }
.nh-n { margin-left: auto; font-size: .74rem; color: var(--vm-navy); background: rgba(22, 52, 92, .07); border-radius: 6px; padding: 2px 8px; }
.nh-list { list-style: none; margin: 0; padding: 0 14px 12px; display: flex; flex-direction: column; gap: 8px; }
.nh-item { border-top: 1px dashed var(--vm-line); padding-top: 8px; }
.cb { display: flex; align-items: flex-start; gap: 8px; cursor: pointer; }
.cb input { margin-top: 4px; accent-color: var(--vm-green); }
.mark-txt { font-size: .88rem; color: var(--vm-ink); line-height: 1.7; }
.nh-meta { display: block; margin-left: 24px; }
.nh-meta em { font-style: normal; font-size: .78rem; color: var(--vm-muted); }
.nh-meta code { font-family: 'JetBrains Mono', monospace; font-size: .72rem; color: #8a98a8; margin-left: 8px; }

@media (max-width: 768px) {
  .vm-bar { padding: 10px; }
  .search { min-width: 140px; flex: 1; }
  .count { width: 100%; margin-left: 0; }
  .heat-cell span { font-size: .76rem; }
}
</style>
