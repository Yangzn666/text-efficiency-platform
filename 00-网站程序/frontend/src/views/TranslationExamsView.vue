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

const EVAL_KEY = 'translation-exam-eval-v1'
const MISTAKE_KEY = 'translation-mistakes-v1'
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

onMounted(async () => {
  loadEval()
  try {
    const res = await fetch('/data/english/translation-exams.json')
    const data = await res.json()
    yearList.value = (data.years as YearData[]).sort((a, b) => b.year - a.year)
    loaded.value = true
    if (yearList.value.length) activeYear.value = yearList.value[0].year
  } catch {
    ElMessage.error('真题数据加载失败，请刷新重试')
  }
})

const currentYear = computed(() => yearList.value.find(y => y.year === activeYear.value) || null)
const yearProgress = (yd: YearData) => yd.sentences.filter(s => evalStore.value[s.id]).length

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

const getMyTranslation = (id: string) => evalStore.value[id]?.myTranslation || ''
const setMyTranslation = (id: string, text: string) => {
  const rec = evalStore.value[id] || { level: '' as Level, myTranslation: '', at: '' }
  rec.myTranslation = text
  evalStore.value[id] = rec
  saveEval()
}
const getLevel = (id: string): Level | '' => evalStore.value[id]?.level || ''

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
</script>

<template>
  <div class="te-wrap">
    <div class="page-header">
      <el-button type="primary" link @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回翻译主页
      </el-button>
      <h2>📝 英一翻译真题实战</h2>
      <p>2005-2025 · 每年5句 · 参考译文与结构拆解 · 数据源：研砖</p>
    </div>

    <div v-if="!loaded" class="te-loading">真题数据加载中…</div>

    <template v-else>
      <!-- 年份选择 -->
      <div class="te-year-bar">
        <button
          v-for="yd in yearList"
          :key="yd.year"
          class="te-year"
          :class="{ active: yd.year === activeYear }"
          @click="switchYear(yd.year)"
        >
          {{ yd.year }}
          <em>{{ yearProgress(yd) }}/5</em>
        </button>
      </div>

      <!-- 工具条 -->
      <div class="te-toolbar" v-if="currentYear">
        <span class="te-toolbar-title">{{ currentYear.year }} 年 Part C 翻译（英译汉 · 共5句 · 满分10分）</span>
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

      <!-- 句子卡片 -->
      <div v-if="currentYear" class="te-list">
        <section
          v-for="s in currentYear.sentences"
          :key="s.id"
          class="te-card"
          :class="{ done: getLevel(s.id) === 'mastered', fuzzy: getLevel(s.id) === 'fuzzy', weak: getLevel(s.id) === 'weak' }"
        >
          <div class="te-card-head">
            <span class="te-no">{{ s.no }}</span>
            <span class="te-state">
              {{ getLevel(s.id) === 'mastered' ? '✅ 已掌握' : getLevel(s.id) === 'fuzzy' ? '🌗 模糊' : getLevel(s.id) === 'weak' ? '❌ 未掌握' : '⬜ 待作答' }}
            </span>
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
              <button class="eval-btn good" :class="{ picked: getLevel(s.id) === 'mastered' }" @click="evaluate(currentYear!.year, s, 'mastered')">✅ 掌握</button>
              <button class="eval-btn mid" :class="{ picked: getLevel(s.id) === 'fuzzy' }" @click="evaluate(currentYear!.year, s, 'fuzzy')">🌗 模糊</button>
              <button class="eval-btn bad" :class="{ picked: getLevel(s.id) === 'weak' }" @click="evaluate(currentYear!.year, s, 'weak')">❌ 未掌握</button>
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

/* 年份条 */
.te-year-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 20px;
}
.te-year {
  border: 1px solid var(--line);
  background: #fff;
  color: var(--navy);
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  padding: 7px 13px;
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.2s;
}
.te-year em {
  font-style: normal;
  font-size: 0.68rem;
  color: #8492a6;
  margin-left: 5px;
}
.te-year:hover { border-color: var(--gold); transform: translateY(-2px); }
.te-year.active {
  background: linear-gradient(135deg, var(--navy-deep), var(--navy));
  color: var(--gold);
  border-color: var(--navy);
}
.te-year.active em { color: #a8bdd4; }

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
}
</style>
