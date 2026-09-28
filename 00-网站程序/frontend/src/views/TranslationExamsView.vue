<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => router.push({ path: '/english', query: { tab: 'translation' } })

// ══════════ 数据结构 ══════════
interface Trunk { 主语?: string; 谓语?: string; 宾语或表语?: string; 主干翻译?: string }
interface Component { 成分类型: string; 原文: string; 修饰对象?: string; 中文翻译?: string; 说明?: string }
interface Sentence { id: string; no: number; en: string; zh: string; trunk: Trunk | null; components: Component[] }
interface YearData { year: number; title: string; sentences: Sentence[] }
type Level = 'mastered' | 'fuzzy' | 'weak'
interface EvalRecord { level: Level; myTranslation: string; at: string }
// 磁盘/镜像同形记录：public/data/english/translation-progress.json 的 records 值结构
interface DiskRec { level: Level; date: string; attempts: number; myTranslation?: string; score?: number; comment?: string }

const BASE = import.meta.env.BASE_URL || '/'
const EVAL_KEY = 'translation-exam-eval-v1'
const MISTAKE_KEY = 'translation-mistakes-v1'
// 跨设备同步镜像：与磁盘 records 完全同形（level/date/attempts），evaluate() 时顺手写入。
// 同步流程（由助手手动执行）：读 localStorage[SYNC_KEY] → records = {...磁盘.records, ...镜像}
// → 更新 updatedAt → 写回 translation-progress.json → build → push。merge 规则纯字典覆盖，可预测。
const SYNC_KEY = 'translation-progress-sync-v1'
const LIMIT_MINUTES = 25

// ══════════ 数据加载 ══════════
const yearList = ref<YearData[]>([])
const loaded = ref(false)
const activeYear = ref<number | null>(null)

const evalStore = ref<Record<string, EvalRecord>>({})
const loadEval = () => {
  try {
    const raw = localStorage.getItem(EVAL_KEY)
    if (raw) evalStore.value = JSON.parse(raw)
  } catch { evalStore.value = {} }
}
const saveEval = () => localStorage.setItem(EVAL_KEY, JSON.stringify(evalStore.value))

// 磁盘基线（跨设备真相源）+ 本机同步镜像；显示优先级：本机 EVAL > 本机镜像 > 磁盘
const diskRecords = ref<Record<string, DiskRec>>({})
const syncRecords = ref<Record<string, DiskRec>>({})
const diskUpdatedAt = ref('')
const loadSync = () => {
  try {
    const raw = localStorage.getItem(SYNC_KEY)
    if (raw) syncRecords.value = JSON.parse(raw) || {}
  } catch { syncRecords.value = {} }
}
const saveSync = () => {
  try { localStorage.setItem(SYNC_KEY, JSON.stringify(syncRecords.value)) } catch { /* 存储失败不阻塞流程 */ }
}
const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const levelOf = (id: string): Level | '' =>
  evalStore.value[id]?.level || syncRecords.value[id]?.level || diskRecords.value[id]?.level || ''
const recOf = (id: string): DiskRec | undefined => syncRecords.value[id] || diskRecords.value[id]

onMounted(async () => {
  loadEval()
  loadSync()
  try {
    const res = await fetch(`${BASE}data/english/translation-exams.json`)
    const data = await res.json()
    yearList.value = (data.years as YearData[]).sort((a, b) => b.year - a.year)
    loaded.value = true
    if (yearList.value.length) activeYear.value = yearList.value[0].year
  } catch {
    ElMessage.error('真题数据加载失败，请刷新重试')
  }
  // 磁盘基线可选加载：失败/不存在时静默退化为纯本机模式，不阻塞做题流程
  try {
    const pr = await fetch(`${BASE}data/english/translation-progress.json?t=${Date.now()}`)
    if (pr.ok) {
      const pf = await pr.json()
      if (pf && pf.records) diskRecords.value = pf.records
      if (pf && pf.updatedAt) diskUpdatedAt.value = pf.updatedAt
    }
  } catch { /* 离线或无基线文件 */ }
})

const currentYear = computed(() => yearList.value.find(y => y.year === activeYear.value) || null)

// ══════════ 限时模式 ══════════
const limitEnabled = ref(false)
const remainSeconds = ref(LIMIT_MINUTES * 60)
const timerRunning = ref(false)
let timerHandle: ReturnType<typeof setInterval> | null = null

const startTimer = () => {
  if (timerRunning.value) return
  timerRunning.value = true
  timerHandle = setInterval(() => {
    remainSeconds.value -= 1
    if (remainSeconds.value <= 0) {
      remainSeconds.value = 0
      stopTimer()
      ElMessage.warning('25分钟限时已到，请对照参考译文完成自评！')
    }
  }, 1000)
}
const stopTimer = () => {
  timerRunning.value = false
  if (timerHandle) { clearInterval(timerHandle); timerHandle = null }
}
const resetTimer = () => {
  stopTimer()
  remainSeconds.value = LIMIT_MINUTES * 60
}
const toggleLimit = () => {
  if (limitEnabled.value) {
    limitEnabled.value = false
    stopTimer()
  } else {
    limitEnabled.value = true
    resetTimer()
    ElMessage.info(`限时模式开启：${LIMIT_MINUTES}分钟内完成本年度5句`)
  }
}
const switchYear = (y: number) => {
  activeYear.value = y
  expanded.value = []
  if (limitEnabled.value) resetTimer()
}
onUnmounted(stopTimer)

const timeText = computed(() => {
  const s = Math.abs(remainSeconds.value)
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
})
const isOvertime = computed(() => remainSeconds.value <= 0)

// ══════════ 逐句作答 ══════════
const expanded = ref<string[]>([])
const toggleExpand = (id: string) => {
  const i = expanded.value.indexOf(id)
  i > -1 ? expanded.value.splice(i, 1) : expanded.value.push(id)
}

const getMyTranslation = (id: string) => evalStore.value[id]?.myTranslation || diskRecords.value[id]?.myTranslation || ''
const setMyTranslation = (id: string, text: string) => {
  const rec = evalStore.value[id] || { level: '' as Level, myTranslation: '', at: '' }
  rec.myTranslation = text
  evalStore.value[id] = rec
  saveEval()
}

const addMistake = (year: number, s: Sentence, myTranslation: string, level: Level) => {
  try {
    const raw = localStorage.getItem(MISTAKE_KEY)
    const list: any[] = raw ? JSON.parse(raw) : []
    if (list.some(m => m.id === s.id)) return
    list.unshift({
      id: s.id,
      year,
      no: s.no,
      en: s.en,
      zh: s.zh,
      myTranslation,
      level,
      addedAt: new Date().toLocaleDateString('zh-CN')
    })
    localStorage.setItem(MISTAKE_KEY, JSON.stringify(list))
  } catch { /* 存储失败不阻塞流程 */ }
}

const removeMistake = (id: string) => {
  try {
    const raw = localStorage.getItem(MISTAKE_KEY)
    if (!raw) return
    const list = JSON.parse(raw).filter((m: any) => m.id !== id)
    localStorage.setItem(MISTAKE_KEY, JSON.stringify(list))
  } catch { /* ignore */ }
}

const evaluate = (year: number, s: Sentence, level: Level) => {
  const myTranslation = getMyTranslation(s.id)
  evalStore.value[s.id] = {
    level,
    myTranslation,
    at: new Date().toLocaleString('zh-CN', { hour12: false })
  }
  saveEval()
  // 写同步镜像（与磁盘 records 同形）：attempts 以磁盘基线为种子，档位变化才 +1
  const prev = syncRecords.value[s.id] || diskRecords.value[s.id]
  syncRecords.value[s.id] = {
    level,
    date: todayStr(),
    attempts: (prev?.attempts || 0) + (prev && prev.level === level ? 0 : 1)
  }
  saveSync()
  if (level === 'weak') {
    addMistake(year, s, myTranslation, level)
    ElMessage.warning('已标记未掌握，自动收入翻译错题本')
  } else if (level === 'fuzzy') {
    addMistake(year, s, myTranslation, level)
    ElMessage.info('已标记模糊，收入错题本待巩固')
  } else {
    removeMistake(s.id)
    ElMessage.success('已标记掌握 ✓')
  }
}

// ══════════ 进度面板：全局统计 + 年份格子 + 状态筛选 ══════════
const stats = computed(() => {
  let mastered = 0, fuzzy = 0, weak = 0
  for (const yd of yearList.value) {
    for (const s of yd.sentences) {
      const lv = levelOf(s.id)
      if (lv === 'mastered') mastered++
      else if (lv === 'fuzzy') fuzzy++
      else if (lv === 'weak') weak++
    }
  }
  const total = yearList.value.reduce((n, yd) => n + yd.sentences.length, 0)
  const doneN = mastered + fuzzy + weak
  return {
    total, doneN, mastered, fuzzy, weak,
    undone: total - doneN,
    review: fuzzy + weak,
    pct: total ? Math.round((doneN / total) * 100) : 0
  }
})
const yearGrid = computed(() => yearList.value.map(yd => {
  const cells = yd.sentences.map(s => levelOf(s.id))
  return { year: yd.year, cells, doneN: cells.filter(Boolean).length }
}))

type StateFilter = 'all' | 'todo' | 'review'
const stateFilter = ref<StateFilter>('all')
const visibleSentences = computed<Sentence[]>(() => {
  const yd = currentYear.value
  if (!yd) return []
  if (stateFilter.value === 'todo') return yd.sentences.filter(s => !levelOf(s.id))
  if (stateFilter.value === 'review') return yd.sentences.filter(s => { const lv = levelOf(s.id); return lv === 'fuzzy' || lv === 'weak' })
  return yd.sentences
})
const headerSub = computed(() =>
  loaded.value
    ? `2001–2026 全 ${stats.value.total} 句 · 参考译文与结构拆解 · 数据源：研砖`
    : '2001–2026 · 参考译文与结构拆解 · 数据源：研砖'
)
</script>

<template>
  <div class="te-wrap">
    <div class="page-header">
      <el-button type="primary" link @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回翻译主页
      </el-button>
      <h2>📝 英一翻译真题实战</h2>
      <p>{{ headerSub }}</p>
    </div>

    <div v-if="!loaded" class="te-loading">真题数据加载中…</div>

    <template v-else>
      <!-- 进度面板 -->
      <div class="tp-panel">
        <div class="tp-top">
          <div class="tp-num"><b>{{ stats.doneN }}</b> / {{ stats.total }} 句已刷</div>
          <div class="tp-bar"><span :style="{ width: stats.pct + '%' }"></span></div>
          <div class="tp-tiers">
            <span class="tier ok">✅ {{ stats.mastered }}</span>
            <span class="tier mid">🌗 {{ stats.fuzzy }}</span>
            <span class="tier bad">❌ {{ stats.weak }}</span>
            <span class="tier none">⬜ 未刷 {{ stats.undone }}</span>
            <span class="tp-pct">{{ stats.pct }}%</span>
          </div>
        </div>

        <div class="tp-filters">
          <button class="tp-chip" :class="{ on: stateFilter === 'all' }" @click="stateFilter = 'all'">全部</button>
          <button class="tp-chip" :class="{ on: stateFilter === 'todo' }" @click="stateFilter = 'todo'">未刷</button>
          <button class="tp-chip" :class="{ on: stateFilter === 'review' }" @click="stateFilter = 'review'">待复习 {{ stats.review }}</button>
        </div>

        <div class="tp-grid">
          <button
            v-for="g in yearGrid"
            :key="g.year"
            class="tp-cell"
            :class="{ active: g.year === activeYear }"
            :title="`${g.year} 年 ${g.doneN}/${g.cells.length}`"
            @click="switchYear(g.year)"
          >
            <span class="tp-ycap">{{ g.year }}<em>{{ g.doneN }}/{{ g.cells.length }}</em></span>
            <span class="tp-dots"><i v-for="(lv, i) in g.cells" :key="i" :class="lv || 'none'"></i></span>
          </button>
        </div>

        <p class="tp-sync-note">
          <template v-if="diskUpdatedAt">🌐 跨设备基线更新于 {{ diskUpdatedAt }} · 本机标记优先显示 · 对助手说「同步翻译进度」可把本机记录合并到所有设备</template>
          <template v-else>💻 当前仅本机记录 · 对助手说「同步翻译进度」即可跨设备保留</template>
        </p>
      </div>

      <!-- 工具条 -->
      <div class="te-toolbar" v-if="currentYear">
        <span class="te-toolbar-title">{{ currentYear.year }} 年 Part C 翻译（英译汉 · 共{{ currentYear.sentences.length }}句 · 满分10分）</span>
        <div class="te-limit" :class="{ overtime: limitEnabled && isOvertime }">
          <label class="te-limit-switch">
            <input type="checkbox" :checked="limitEnabled" @change="toggleLimit">
            限时模式（{{ LIMIT_MINUTES }}分钟/年）
          </label>
          <template v-if="limitEnabled">
            <span class="te-timer">{{ timeText }}</span>
            <button @click="timerRunning ? stopTimer() : startTimer()">{{ timerRunning ? '暂停' : '开始' }}</button>
            <button @click="resetTimer">重置</button>
          </template>
        </div>
      </div>

      <!-- 句子卡片（随面板筛选器过滤） -->
      <div v-if="currentYear && !visibleSentences.length" class="tp-empty">
        {{ stateFilter === 'todo' ? '这一年已经全部刷完 🎉' : '这一年没有需要复习的句子，状态不错！' }}
        <button class="te-toggle" @click="stateFilter = 'all'">看全部</button>
      </div>
      <div v-else-if="currentYear" class="te-list">
        <section
          v-for="s in visibleSentences"
          :key="s.id"
          class="te-card"
          :class="{ done: levelOf(s.id) === 'mastered', fuzzy: levelOf(s.id) === 'fuzzy', weak: levelOf(s.id) === 'weak' }"
        >
          <div class="te-card-head">
            <span class="te-no">{{ s.no }}</span>
            <span class="te-state">
              {{ levelOf(s.id) === 'mastered' ? '✅ 已掌握' : levelOf(s.id) === 'fuzzy' ? '🌗 模糊' : levelOf(s.id) === 'weak' ? '❌ 未掌握' : '⬜ 待作答' }}
            </span>
            <span v-if="recOf(s.id) && recOf(s.id)!.attempts > 1" class="te-attempts">第 {{ recOf(s.id)!.attempts }} 次 · {{ recOf(s.id)!.date }}</span>
          </div>
          <p class="te-en">{{ s.en }}</p>
          <textarea
            class="te-input"
            placeholder="在此写下你的译文（先独立翻译，再看参考）…"
            :value="getMyTranslation(s.id)"
            @input="setMyTranslation(s.id, ($event.target as HTMLTextAreaElement).value)"
          ></textarea>

          <button class="te-toggle" @click="toggleExpand(s.id)">
            {{ expanded.includes(s.id) ? '▲ 收起参考译文与拆解' : '▼ 对照参考译文与拆解' }}
          </button>

          <div v-if="expanded.includes(s.id)" class="te-answer">
            <div class="te-zh">
              <span class="te-zh-label">参考译文</span>
              <p>{{ s.zh }}</p>
            </div>
            <div v-if="s.trunk" class="te-trunk">
              <span class="te-zh-label">句子主干</span>
              <div class="te-trunk-grid">
                <div v-if="s.trunk['主语']"><em>主语</em>{{ s.trunk['主语'] }}</div>
                <div v-if="s.trunk['谓语']"><em>谓语</em>{{ s.trunk['谓语'] }}</div>
                <div v-if="s.trunk['宾语或表语']"><em>宾/表</em>{{ s.trunk['宾语或表语'] }}</div>
              </div>
            </div>
            <div v-if="s.components.length" class="te-components">
              <span class="te-zh-label">结构拆解</span>
              <div v-for="(c, i) in s.components" :key="i" class="te-component">
                <div class="tc-head">
                  <span class="tc-type">{{ c['成分类型'] }}</span>
                  <span class="tc-text">{{ c['原文'] }}</span>
                </div>
                <div class="tc-body">
                  <span v-if="c['修饰对象'] && c['修饰对象'] !== '-'">修饰：{{ c['修饰对象'] }}</span>
                  <span>{{ c['中文翻译'] }}</span>
                </div>
                <p v-if="c['说明']" class="tc-note">{{ c['说明'] }}</p>
              </div>
            </div>

            <div class="te-eval">
              <span>自评本句：</span>
              <button class="eval-btn good" :class="{ picked: levelOf(s.id) === 'mastered' }" @click="evaluate(currentYear!.year, s, 'mastered')">✅ 掌握</button>
              <button class="eval-btn mid" :class="{ picked: levelOf(s.id) === 'fuzzy' }" @click="evaluate(currentYear!.year, s, 'fuzzy')">🌗 模糊</button>
              <button class="eval-btn bad" :class="{ picked: levelOf(s.id) === 'weak' }" @click="evaluate(currentYear!.year, s, 'weak')">❌ 未掌握</button>
            </div>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<style scoped>
.te-wrap {
  --ink: #1f2d3d;
  --body: #303133;
  --gold: #ffc53d;
  --navy-deep: #0d2137;
  --navy: #16345c;
  --line: #e4ebf3;
  --bg-soft: #f5f8fc;
  max-width: 1000px;
  margin: 0 auto;
}
.te-loading { text-align: center; padding: 60px 0; color: var(--navy); }

.page-header { text-align: center; margin-bottom: 24px; }
.page-header h2 {
  font-size: 1.7em;
  color: var(--navy);
  margin: 12px 0 8px;
}
.page-header p { font-size: 0.92em; color: #5b6b7f; margin: 0; }

/* 进度面板 */
.tp-panel {
  background: #fff;
  border: 1.5px solid var(--line);
  border-radius: 14px;
  padding: 14px 18px;
  margin-bottom: 16px;
}
.tp-top { text-align: left; }
.tp-num { font-size: 0.95rem; color: #5b6b7f; }
.tp-num b { color: #f0a820; font-size: 1.3rem; font-family: 'JetBrains Mono', monospace; }
.tp-bar { height: 8px; background: #eef2f7; border-radius: 6px; overflow: hidden; margin: 6px 0 8px; }
.tp-bar span { display: block; height: 100%; background: linear-gradient(90deg, #ffc53d, #f0a820); border-radius: 6px; transition: width 0.4s; }
.tp-tiers { display: flex; gap: 12px; flex-wrap: wrap; font-size: 0.82rem; color: #5b6b7f; align-items: center; }
.tier.ok { color: #2fae62; font-weight: 700; }
.tier.mid { color: #f5a623; font-weight: 700; }
.tier.bad { color: #f56c6c; font-weight: 700; }
.tier.none { color: #90a0b4; }
.tp-pct { margin-left: auto; font-family: 'JetBrains Mono', monospace; font-weight: 800; color: var(--navy); }

.tp-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
.tp-chip {
  border: 1px solid var(--line);
  background: #fff;
  color: #5b6b7f;
  border-radius: 16px;
  padding: 4px 14px;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s;
}
.tp-chip:hover { border-color: var(--gold); }
.tp-chip.on { background: var(--navy); border-color: var(--navy); color: #fff; }

.tp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(108px, 1fr));
  gap: 8px;
  margin-top: 12px;
}
.tp-cell {
  display: block;
  text-align: left;
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 10px;
  padding: 7px 9px 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.tp-cell:hover { border-color: var(--gold); transform: translateY(-1px); }
.tp-cell.active { border-color: var(--navy); box-shadow: 0 0 0 1px var(--navy) inset; background: #f7faff; }
.tp-ycap {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 4px;
  font-weight: 800;
  font-size: 0.78rem;
  color: var(--navy);
  font-family: 'JetBrains Mono', monospace;
}
.tp-ycap em { font-style: normal; font-size: 0.64rem; color: #8492a6; font-weight: 600; }
.tp-dots { display: flex; gap: 3px; margin-top: 6px; }
.tp-dots i { flex: 1; height: 7px; min-width: 4px; border-radius: 3px; background: #e9eef5; }
.tp-dots i.mastered { background: #2fae62; }
.tp-dots i.fuzzy { background: #f5a623; }
.tp-dots i.weak { background: #f56c6c; }

.tp-sync-note { margin: 10px 0 0; font-size: 0.72rem; color: #8492a6; line-height: 1.6; }

.tp-empty {
  background: #fff;
  border: 1.5px dashed var(--line);
  border-radius: 14px;
  padding: 36px 16px;
  text-align: center;
  color: #5b6b7f;
  font-size: 0.92rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

/* 卡片次数角标 */
.te-attempts { margin-left: auto; font-size: 0.72rem; color: #90a0b4; font-family: 'JetBrains Mono', monospace; }

/* 工具条 */
.te-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  background: linear-gradient(150deg, var(--navy-deep), var(--navy));
  border-radius: 12px;
  padding: 12px 20px;
  margin-bottom: 18px;
}
.te-toolbar-title {
  color: #fff;
  font-size: 0.92rem;
  letter-spacing: 0.03em;
}
.te-limit {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.te-limit-switch {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #a8bdd4;
  font-size: 0.8rem;
  cursor: pointer;
  user-select: none;
}
.te-limit-switch input { accent-color: var(--gold); }
.te-timer {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.25rem;
  color: var(--gold);
}
.te-limit.overtime .te-timer { color: #f56c6c; }
.te-limit button {
  border: 1px solid rgba(255, 197, 61, 0.5);
  background: transparent;
  color: var(--gold);
  font-size: 0.72rem;
  padding: 3px 10px;
  border-radius: 7px;
  cursor: pointer;
}
.te-limit button:hover { background: rgba(255, 197, 61, 0.15); }

/* 句子卡片 */
.te-list { display: flex; flex-direction: column; gap: 16px; }
.te-card {
  background: #fff;
  border: 1.5px solid var(--line);
  border-radius: 14px;
  padding: 18px 22px;
  transition: all 0.25s;
}
.te-card:hover { border-color: var(--navy); box-shadow: 0 4px 16px rgba(13, 33, 55, 0.08); }
.te-card.done { border-left: 5px solid #2fae62; }
.te-card.fuzzy { border-left: 5px solid #f5a623; }
.te-card.weak { border-left: 5px solid #f56c6c; }

.te-card-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.te-no {
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--gold), #f0a820);
  color: var(--navy-deep);
  font-weight: 800;
  font-size: 0.9rem;
  flex-shrink: 0;
}
.te-state { font-size: 0.78rem; color: #5b6b7f; }

.te-en {
  font-family: 'Georgia', serif;
  font-size: 1.05rem;
  line-height: 1.9;
  color: var(--ink);
  margin: 0 0 12px;
}
.te-input {
  width: 100%;
  min-height: 76px;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 0.92rem;
  line-height: 1.9;
  color: var(--body);
  resize: vertical;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}
.te-input:focus { border-color: var(--gold); box-shadow: 0 0 0 2px rgba(255, 197, 61, 0.15); }

.te-toggle {
  margin-top: 10px;
  border: none;
  background: var(--bg-soft);
  color: var(--navy);
  font-size: 0.8rem;
  font-weight: 700;
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.te-toggle:hover { background: rgba(255, 197, 61, 0.2); }

.te-answer {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px dashed var(--line);
}
.te-zh-label {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--gold);
  background: rgba(255, 197, 61, 0.12);
  border: 1px solid rgba(255, 197, 61, 0.4);
  padding: 2px 10px;
  border-radius: 999px;
  margin-bottom: 8px;
}
.te-zh p {
  margin: 0 0 14px;
  font-size: 0.95rem;
  line-height: 1.9;
  color: var(--body);
}
.te-trunk { margin-bottom: 14px; }
.te-trunk-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.te-trunk-grid div {
  background: var(--bg-soft);
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.8rem;
  color: var(--ink);
  font-family: 'Georgia', serif;
}
.te-trunk-grid em {
  font-style: normal;
  font-family: inherit;
  font-size: 0.68rem;
  color: var(--navy);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 1px 7px;
  margin-right: 7px;
}
.te-component {
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 8px;
  background: #fff;
}
.tc-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
}
.tc-type {
  font-size: 0.7rem;
  font-weight: 800;
  color: #fff;
  background: var(--navy);
  padding: 2px 10px;
  border-radius: 999px;
  white-space: nowrap;
}
.tc-text {
  font-family: 'Georgia', serif;
  font-size: 0.84rem;
  color: var(--ink);
}
.tc-body {
  margin-top: 6px;
  font-size: 0.78rem;
  color: #5b6b7f;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}
.tc-note {
  margin: 6px 0 0;
  font-size: 0.76rem;
  color: #a06a00;
  background: #fff8ec;
  border-radius: 6px;
  padding: 5px 10px;
  line-height: 1.6;
}

.te-eval {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
  font-size: 0.82rem;
  color: var(--navy);
}
.eval-btn {
  border: 1px solid var(--line);
  background: #fff;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 7px 16px;
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.2s;
}
.eval-btn:hover { transform: translateY(-2px); }
.eval-btn.good.picked { background: #2fae62; border-color: #2fae62; color: #fff; }
.eval-btn.mid.picked { background: #f5a623; border-color: #f5a623; color: #fff; }
.eval-btn.bad.picked { background: #f56c6c; border-color: #f56c6c; color: #fff; }

@media (max-width: 640px) {
  .te-toolbar { flex-direction: column; align-items: stretch; }
  .te-card { padding: 14px 16px; }
  .tp-panel { padding: 12px 12px; }
  .tp-grid { grid-template-columns: repeat(auto-fill, minmax(88px, 1fr)); gap: 6px; }
  .tp-cell { padding: 6px 7px 7px; }
  .te-card-head { flex-wrap: wrap; }
}
</style>
