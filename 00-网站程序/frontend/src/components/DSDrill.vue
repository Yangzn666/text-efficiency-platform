<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { renderExamMarkdown } from '@/utils/examRender'

interface BigQ {
  slug: string; subject: string; year: number; index: number
  chapterCode: string; chapterName: string; score: number; tags: string[]
  stem: string; explanation: string
}
interface Rec { result: 'correct' | 'partial' | 'wrong'; date: string; attempts: number }

// 与「真题大题」共用同一份进度存储 → 破零数会同步上涨
const LS_KEY = 'exam408-big-v2'
const diskRecords = ref<Record<string, Rec>>({})
const localRecords = ref<Record<string, Rec>>({})
const records = computed(() => ({ ...diskRecords.value, ...localRecords.value }))

const items = ref<BigQ[]>([])
const loading = ref(true)
const idx = ref(0)
const showHint = ref(false)
const showAns = ref(false)

// 由易到难的章节顺序（先攒正反馈，再啃图）
const ORDER = ['ds-stack', 'ds-list', 'ds-search', 'ds-sort', 'ds-tree', 'ds-graph']
const FIRST_STEP: Record<string, string> = {
  'ds-stack': '先标清"进出被限制在哪一端"，再用数组下标 top/rear 把前 3 步操作手摇模拟一遍，看是否越界/矛盾。',
  'ds-list': '先画结点方框+箭头，数清"要改几根 next 指针"；判该用 头结点 / 双指针 / 快慢指针 哪一个，再动笔。',
  'ds-search': '折半先写出 low、high、mid 和"区间开闭约定"，每趟更新一个端点；判定树先画根，失败叶补在外层。',
  'ds-sort': '问"第 k 趟结果"先认算法每趟特征：冒泡→末尾 k 个已归位；选择→前 k 个是最值；插入→前 k+1 个有序；快排→基准落位；堆→先建堆再逐个换顶调整。',
  'ds-tree': '遍历题先默写三种遍历"根在第几位"；给两种遍历求第三种→先在前序/后序里锁定根，再切左右子树递归。',
  'ds-graph': '先定存储结构（邻接矩阵 or 邻接表）；遍历 BFS 用队列、DFS 用递归/栈；最短路权非负→画 Dijkstra 表格逐步填 dist 和前驱；判环/排序→入度为 0。',
}
const GENERIC_STEP = '先把已知条件和"到底求什么"逐条列出来，再写最小可执行第一步：画结构图 / 列表 / 设变量，绝不留空白。'

const deck = computed<BigQ[]>(() => {
  const ds = items.value.filter(i => i.subject === 'ds')
  const rank = (c: string) => { const k = ORDER.indexOf(c); return k < 0 ? 99 : k }
  return [...ds].sort((a, b) => rank(a.chapterCode) - rank(b.chapterCode) || a.year - b.year || a.index - b.index)
})
const current = computed(() => deck.value[idx.value] || null)
const doneCount = computed(() => deck.value.filter(q => records.value[q.slug]).length)
const total = computed(() => deck.value.length)
const curRec = computed(() => current.value ? records.value[current.value.slug] : undefined)

function firstStep(q: BigQ): string { return FIRST_STEP[q.chapterCode] || GENERIC_STEP }
function render(t: string): string { return renderExamMarkdown(t) }

function setResult(r: Rec['result']) {
  if (!current.value) return
  const slug = current.value.slug
  const cur = localRecords.value[slug]
  localRecords.value = { ...localRecords.value, [slug]: { result: r, date: todayStr(), attempts: (cur?.attempts || 0) + 1 } }
  try { localStorage.setItem(LS_KEY, JSON.stringify(localRecords.value)) } catch { /* ignore */ }
}
function todayStr() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }

function go(n: number) { idx.value = Math.max(0, Math.min(total.value - 1, n)); showHint.value = false; showAns.value = false }
function next() { if (idx.value < total.value - 1) go(idx.value + 1) }
function prev() { if (idx.value > 0) go(idx.value - 1) }

// 跳到下一道"没记录"的题
function nextTodo() {
  for (let k = 1; k <= total.value; k++) {
    const j = (idx.value + k) % total.value
    if (!records.value[deck.value[j].slug]) { go(j); return }
  }
}

async function load() {
  loading.value = true
  const base = import.meta.env.BASE_URL || '/'
  try {
    const [rq, pq] = await Promise.all([
      fetch(`${base}data/408-exam/questions.json`).then(r => (r.ok ? r.json() : null)).catch(() => null),
      fetch(`${base}data/408-exam/progress.json?t=${Date.now()}`).then(r => (r.ok ? r.json() : null)).catch(() => null),
    ])
    if (rq) items.value = rq.items || []
    if (pq && pq.records) diskRecords.value = pq.records
  } catch (e) { console.error('DS drill load failed', e) }
  finally { loading.value = false }
  try { localRecords.value = JSON.parse(localStorage.getItem(LS_KEY) || '{}') || {} } catch { localRecords.value = {} }
}
onMounted(load)
</script>

<template>
  <div class="ds-drill">
    <div class="dd-hero">
      <div>
        <h2>🧗 数据结构 · 破零带刷</h2>
        <p>DS 真题大题现在 <strong>0 / 36</strong>——这是你最大的黑洞。这里按<strong>由易到难</strong>一题一题带你破零：先说「第一步做什么」，再动手算，最后对答案。进度与「真题大题」同步。</p>
      </div>
      <div class="dd-ring">
        <div class="ddr-num">{{ doneCount }}<span>/{{ total }}</span></div>
        <div class="ddr-lbl">已破</div>
      </div>
    </div>

    <div v-if="loading" class="dd-loading">加载真题中…</div>

    <template v-else-if="current">
      <div class="dd-bar">
        <div class="ddb-track"><div class="ddb-fill" :style="{ width: ((idx + 1) / total * 100) + '%' }"></div></div>
        <span class="ddb-txt">第 {{ idx + 1 }} / {{ total }} 题</span>
        <button class="ddb-todo" @click="nextTodo">跳到下一道没做 →</button>
      </div>

      <div class="dd-card">
        <div class="dd-meta">
          <span class="ddm-ch">{{ current.chapterName }}</span>
          <span class="ddm-year">{{ current.year }} 年第 {{ current.index }} 题</span>
          <span class="ddm-score">{{ current.score }} 分</span>
          <span v-if="curRec" class="ddm-res" :class="curRec.result">
            {{ curRec.result === 'correct' ? '✓ 做对' : curRec.result === 'wrong' ? '✗ 做错' : '◐ 半对' }}
          </span>
        </div>

        <div class="dd-body markdown-body" v-html="render(current.stem)"></div>

        <div class="dd-tools">
          <button class="dd-hint-btn" @click="showHint = !showHint">💡 {{ showHint ? '收起' : '破题第一步' }}</button>
          <button class="dd-ans-btn" @click="showAns = !showAns">📖 {{ showAns ? '收起解析' : '看解析' }}</button>
        </div>

        <div v-if="showHint" class="dd-hint">
          <span class="dh-tag">第一步</span>{{ firstStep(current) }}
        </div>

        <div v-if="showAns" class="dd-ans markdown-body" v-html="render(current.explanation)"></div>

        <div class="dd-grade">
          <span class="dg-lbl">这题独立做下来：</span>
          <button class="dg-ok" :class="{ on: curRec?.result === 'correct' }" @click="setResult('correct')">✓ 做对</button>
          <button class="dg-half" :class="{ on: curRec?.result === 'partial' }" @click="setResult('partial')">◐ 半对</button>
          <button class="dg-bad" :class="{ on: curRec?.result === 'wrong' }" @click="setResult('wrong')">✗ 做错</button>
        </div>
      </div>

      <div class="dd-nav">
        <button :disabled="idx === 0" @click="prev">← 上一题</button>
        <button :disabled="idx >= total - 1" @click="next">下一题 →</button>
      </div>
    </template>

    <div v-else class="dd-empty">没有加载到数据结构真题，请检查 questions.json。</div>
  </div>
</template>

<style scoped>
.ds-drill { max-width: 900px; margin: 0 auto; padding: 8px 4px 40px; }
.dd-hero {
  display: flex; align-items: center; justify-content: space-between; gap: 20px;
  background: linear-gradient(135deg, #0d2137, #16345c); color: #fff;
  border-radius: 14px; padding: 20px 24px; margin-bottom: 16px;
}
.dd-hero h2 { margin: 0 0 8px; font-size: 20px; }
.dd-hero p { margin: 0; font-size: 13px; line-height: 1.75; color: #c9d6e6; max-width: 640px; }
.dd-hero strong { color: #ffc53d; }
.dd-ring { text-align: center; flex: 0 0 auto; }
.ddr-num { font-size: 30px; font-weight: 800; color: #ffc53d; line-height: 1; }
.ddr-num span { font-size: 15px; color: #9fb2c9; font-weight: 600; }
.ddr-lbl { font-size: 12px; color: #9fb2c9; margin-top: 4px; }
.dd-loading, .dd-empty { text-align: center; color: #8a94a6; padding: 50px 0; }

.dd-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.ddb-track { flex: 1; height: 6px; background: #e6ecf4; border-radius: 4px; overflow: hidden; }
.ddb-fill { height: 100%; background: linear-gradient(90deg, #16345c, #409EFF); transition: width .25s; }
.ddb-txt { font-size: 13px; color: #5b6b7f; white-space: nowrap; }
.ddb-todo { border: 1px solid #409EFF; background: #fff; color: #409EFF; border-radius: 16px; padding: 4px 14px; font-size: 12px; cursor: pointer; white-space: nowrap; }
.ddb-todo:hover { background: #409EFF; color: #fff; }

.dd-card { background: #fff; border: 1px solid #e4ebf3; border-radius: 14px; padding: 22px 26px; box-shadow: 0 8px 30px rgba(22,52,92,.06); }
.dd-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
.ddm-ch { background: #409EFF; color: #fff; font-size: 12px; padding: 3px 12px; border-radius: 12px; font-weight: 600; }
.ddm-year { font-size: 13px; color: #5b6b7f; }
.ddm-score { font-size: 13px; color: #e6a23c; font-weight: 700; }
.ddm-res { margin-left: auto; font-size: 13px; font-weight: 700; padding: 3px 12px; border-radius: 12px; }
.ddm-res.correct { color: #67C23A; background: #f0f9eb; }
.ddm-res.partial { color: #e6a23c; background: #fdf6ec; }
.ddm-res.wrong { color: #F56C6C; background: #fef0f0; }

.dd-body { font-size: 15px; line-height: 1.85; color: #1f2d3d; }
.dd-tools { display: flex; gap: 12px; margin: 16px 0 4px; }
.dd-hint-btn, .dd-ans-btn { border-radius: 20px; padding: 7px 18px; font-size: 14px; cursor: pointer; border: 1px solid #d5deea; background: #fff; color: #16345c; transition: all .15s; }
.dd-hint-btn { border-color: #ffc53d; background: #fffbf0; color: #8a6d1a; }
.dd-hint-btn:hover, .dd-ans-btn:hover { transform: translateY(-1px); }

.dd-hint { margin-top: 10px; background: #fff8e6; border-left: 4px solid #ffc53d; padding: 12px 16px; border-radius: 6px; font-size: 14px; line-height: 1.7; color: #6b5410; }
.dh-tag { display: inline-block; background: #ffc53d; color: #5a3d00; font-size: 12px; font-weight: 700; padding: 1px 10px; border-radius: 10px; margin-right: 8px; }
.dd-ans { margin-top: 14px; padding: 16px 18px; background: #f7f9fc; border-radius: 8px; border: 1px solid #eef2f7; font-size: 14px; line-height: 1.8; }

.dd-grade { display: flex; align-items: center; gap: 12px; margin-top: 20px; padding-top: 16px; border-top: 1px dashed #e4ebf3; }
.dg-lbl { font-size: 13px; color: #5b6b7f; margin-right: auto; }
.dg-ok, .dg-half, .dg-bad { border-radius: 20px; padding: 7px 18px; font-size: 14px; cursor: pointer; border: 1px solid transparent; font-weight: 600; }
.dg-ok { background: #f0f9eb; color: #67C23A; border-color: #b3e19d; }
.dg-ok.on { background: #67C23A; color: #fff; }
.dg-half { background: #fdf6ec; color: #e6a23c; border-color: #f3d19e; }
.dg-half.on { background: #e6a23c; color: #fff; }
.dg-bad { background: #fef0f0; color: #F56C6C; border-color: #fbc4c4; }
.dg-bad.on { background: #F56C6C; color: #fff; }

.dd-nav { display: flex; justify-content: space-between; margin-top: 16px; }
.dd-nav button { border: 1px solid #16345c; background: #fff; color: #16345c; border-radius: 22px; padding: 8px 24px; font-size: 14px; cursor: pointer; }
.dd-nav button:disabled { opacity: .35; cursor: not-allowed; }
.dd-nav button:not(:disabled):hover { background: #16345c; color: #fff; }

/* 渲染内容（v-html）需要 :deep */
:deep(.dd-body h3), :deep(.dd-ans h3) { font-size: 16px; margin: 14px 0 8px; color: #16345c; }
:deep(.dd-body h4), :deep(.dd-ans h4) { font-size: 15px; margin: 12px 0 6px; }
:deep(.dd-body p), :deep(.dd-ans p) { margin: 8px 0; }
:deep(.dd-body ul), :deep(.dd-ans ul) { padding-left: 22px; margin: 8px 0; }
:deep(.dd-body code), :deep(.dd-ans code) { background: #eef2f7; padding: 1px 6px; border-radius: 4px; font-size: 13px; }
:deep(.dd-ans .ex-code), :deep(.dd-body .ex-code) { background: #1e2a3a; color: #e6edf3; padding: 12px 14px; border-radius: 8px; overflow-x: auto; }
:deep(.ex-table-wrap) { overflow-x: auto; }
:deep(.dd-ans table), :deep(.dd-body table) { border-collapse: collapse; margin: 10px 0; }
:deep(.dd-ans th), :deep(.dd-ans td), :deep(.dd-body th), :deep(.dd-body td) { border: 1px solid #d5deea; padding: 6px 10px; font-size: 13px; }
</style>
