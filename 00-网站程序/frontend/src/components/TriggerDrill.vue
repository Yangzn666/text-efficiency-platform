<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { TRIGGER_CARDS, SUBJECT_META, type TriggerCard, type TriggerSubject } from '@/data/triggerCards'

// ===== 状态持久化（localStorage）=====
interface CardStat { streak: number; mastered: boolean; miss: number }
type Store = Record<string, CardStat>
const LS_KEY = 'trigger-drill-v1'
const store = ref<Store>({})

function loadStore() {
  try { store.value = JSON.parse(localStorage.getItem(LS_KEY) || '{}') || {} }
  catch { store.value = {} }
}
function saveStore() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(store.value)) } catch { /* ignore */ }
}
function stat(id: string): CardStat {
  if (!store.value[id]) store.value[id] = { streak: 0, mastered: false, miss: 0 }
  return store.value[id]
}

// ===== 筛选 & 洗牌 =====
const subject = ref<'all' | TriggerSubject>('all')
const showMastered = ref(false)
const seed = ref(0)

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const deck = computed<TriggerCard[]>(() => {
  void seed.value
  let list = TRIGGER_CARDS.filter(c => subject.value === 'all' || c.subject === subject.value)
  if (!showMastered.value) list = list.filter(c => !store.value[c.id]?.mastered)
  return shuffle(list)
})

const idx = ref(0)
const flipped = ref(false)
const roundMissed = ref<string[]>([])
const done = computed(() => idx.value >= deck.value.length)
const current = computed(() => deck.value[idx.value] || null)

const total = computed(() => deck.value.length)
const masteredCount = computed(() =>
  TRIGGER_CARDS.filter(c => (subject.value === 'all' || c.subject === subject.value) && store.value[c.id]?.mastered).length
)
const poolCount = computed(() =>
  TRIGGER_CARDS.filter(c => subject.value === 'all' || c.subject === subject.value).length
)

watch([subject, showMastered], () => { idx.value = 0; flipped.value = false; roundMissed.value = [] })

function grade(hit: boolean) {
  const c = current.value
  if (!c) return
  const s = stat(c.id)
  if (hit) {
    s.streak += 1
    if (s.streak >= 2) s.mastered = true
  } else {
    s.streak = 0
    s.mastered = false
    s.miss += 1
    roundMissed.value.push(c.id)
  }
  store.value = { ...store.value, [c.id]: s }
  saveStore()
  next()
}
function next() { flipped.value = false; idx.value += 1 }
function prev() { if (idx.value > 0) { idx.value -= 1; flipped.value = false } }
function restart() { idx.value = 0; flipped.value = false; roundMissed.value = []; seed.value++ }

// 只刷本轮没扳对的
const retryDeck = ref<TriggerCard[] | null>(null)
function startRetry() {
  const ids = new Set(roundMissed.value)
  retryDeck.value = TRIGGER_CARDS.filter(c => ids.has(c.id))
  idx.value = 0; flipped.value = false; roundMissed.value = []
}
function exitRetry() { retryDeck.value = null; restart() }

const activeDeck = computed<TriggerCard[]>(() => retryDeck.value || deck.value)
const activeCurrent = computed(() => activeDeck.value[idx.value] || null)
const activeDone = computed(() => idx.value >= activeDeck.value.length)
const activeTotal = computed(() => activeDeck.value.length)

onMounted(loadStore)

function subjColor(s: TriggerSubject) { return SUBJECT_META[s].color }
function subjName(s: TriggerSubject) { return SUBJECT_META[s].short }
</script>

<template>
  <div class="trigger-drill">
    <div class="td-hero">
      <div class="td-hero-txt">
        <h2>⚡ 判据速答 · 把判据练成扳机</h2>
        <p>看到<strong>信号</strong>，先在心里说出<strong>第一动作</strong>，再翻牌对答案。连对 2 次自动毕业。专治「判据没扳机化、考场想不起第一步」。</p>
      </div>
      <div class="td-hero-stat">
        <div class="tds-num">{{ masteredCount }}<span>/{{ poolCount }}</span></div>
        <div class="tds-lbl">已扳熟</div>
      </div>
    </div>

    <div class="td-bar">
      <div class="td-filters">
        <button :class="{ on: subject === 'all' }" @click="subject = 'all'">全部</button>
        <button v-for="(m, k) in SUBJECT_META" :key="k" :class="{ on: subject === k }"
                :style="subject === k ? { background: m.color, borderColor: m.color } : {}"
                @click="subject = k as TriggerSubject">{{ m.short }}</button>
      </div>
      <label class="td-toggle">
        <input type="checkbox" v-model="showMastered" /> 含已扳熟
      </label>
    </div>

    <!-- 进度 -->
    <div class="td-progress">
      <div class="tp-track"><div class="tp-fill" :style="{ width: activeTotal ? (Math.min(idx, activeTotal) / activeTotal * 100) + '%' : '0%' }"></div></div>
      <span class="tp-txt">{{ Math.min(idx + (activeDone ? 0 : 1), activeTotal) }} / {{ activeTotal }}</span>
      <span v-if="retryDeck" class="tp-retry">🔁 回炉模式 · {{ roundMissed.length }} 待重答</span>
    </div>

    <!-- 完成页 -->
    <div v-if="activeDone" class="td-finish">
      <div class="tf-emoji">{{ roundMissed.length ? '💪' : '🎯' }}</div>
      <h3>{{ roundMissed.length ? `本组刷完，${roundMissed.length} 张没扳对` : '全组扳对，漂亮！' }}</h3>
      <p v-if="roundMissed.length">把没扳对的再过一遍，记忆才留得住。</p>
      <div class="tf-btns">
        <button v-if="roundMissed.length" class="tf-primary" @click="startRetry">只刷没扳对的（{{ roundMissed.length }}）</button>
        <button v-if="retryDeck" class="tf-ghost" @click="exitRetry">退出回炉</button>
        <button class="tf-ghost" @click="restart">重新洗牌再来</button>
      </div>
    </div>

    <!-- 卡片 -->
    <div v-else-if="activeCurrent" class="td-card-wrap">
      <div class="td-card" :class="{ flipped }">
        <!-- 正面：信号 -->
        <div class="td-face td-front">
          <span class="td-tag" :style="{ background: subjColor(activeCurrent.subject) }">{{ subjName(activeCurrent.subject) }}</span>
          <div class="td-kicker">信 号</div>
          <div class="td-cue">{{ activeCurrent.cue }}</div>
          <div class="td-hint">先在心里说出「第一动作」，再翻牌 ↓</div>
          <button class="td-flip-btn" @click="flipped = true">翻牌看答案</button>
        </div>
        <!-- 背面：动作 + 判据 + 坑 -->
        <div class="td-face td-back">
          <span class="td-tag" :style="{ background: subjColor(activeCurrent.subject) }">{{ subjName(activeCurrent.subject) }}</span>
          <div class="td-sec td-action">
            <div class="td-sec-h">✅ 第一动作</div>
            <div class="td-sec-b">{{ activeCurrent.action }}</div>
          </div>
          <div class="td-sec td-crit">
            <div class="td-sec-h">📐 判据</div>
            <div class="td-sec-b">{{ activeCurrent.criteria }}</div>
          </div>
          <div class="td-sec td-pit">
            <div class="td-sec-h">⚠️ 坑</div>
            <div class="td-sec-b">{{ activeCurrent.pitfall }}</div>
          </div>
          <div class="td-grade">
            <span class="tg-q">刚才扳对了吗？</span>
            <button class="tg-hit" @click="grade(true)">✓ 扳对了</button>
            <button class="tg-miss" @click="grade(false)">✗ 没扳出来</button>
          </div>
        </div>
      </div>
      <div class="td-nav">
        <button class="td-prev" :disabled="idx === 0" @click="prev">← 上一张</button>
        <span class="td-streak" v-if="store[activeCurrent.id]?.streak">连对 {{ store[activeCurrent.id].streak }}</span>
      </div>
    </div>

    <div v-else class="td-empty">这个筛选下没有可练的卡，试试「含已扳熟」或换科目。</div>
  </div>
</template>

<style scoped>
.trigger-drill { max-width: 860px; margin: 0 auto; padding: 8px 4px 40px; }

.td-hero {
  display: flex; align-items: center; justify-content: space-between; gap: 20px;
  background: linear-gradient(135deg, #0d2137, #16345c);
  color: #fff; border-radius: 14px; padding: 20px 24px; margin-bottom: 16px;
}
.td-hero-txt h2 { margin: 0 0 6px; font-size: 20px; }
.td-hero-txt p { margin: 0; font-size: 13px; line-height: 1.7; color: #c9d6e6; }
.td-hero-txt strong { color: #ffc53d; }
.td-hero-stat { text-align: center; flex: 0 0 auto; }
.tds-num { font-size: 30px; font-weight: 800; color: #ffc53d; line-height: 1; }
.tds-num span { font-size: 15px; color: #9fb2c9; font-weight: 600; }
.tds-lbl { font-size: 12px; color: #9fb2c9; margin-top: 4px; }

.td-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 10px; }
.td-filters { display: flex; gap: 8px; flex-wrap: wrap; }
.td-filters button {
  border: 1px solid #d5deea; background: #fff; color: #445; border-radius: 20px;
  padding: 5px 16px; font-size: 13px; cursor: pointer; transition: all .15s;
}
.td-filters button:hover { border-color: #16345c; color: #16345c; }
.td-filters button.on { background: #16345c; border-color: #16345c; color: #fff; }
.td-toggle { font-size: 13px; color: #5b6b7f; display: flex; align-items: center; gap: 6px; cursor: pointer; }

.td-progress { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.tp-track { flex: 1; height: 6px; background: #e6ecf4; border-radius: 4px; overflow: hidden; }
.tp-fill { height: 100%; background: linear-gradient(90deg, #16345c, #ffc53d); transition: width .25s; }
.tp-txt { font-size: 13px; color: #5b6b7f; font-variant-numeric: tabular-nums; }
.tp-retry { font-size: 12px; color: #e6a23c; font-weight: 600; }

/* 翻牌 */
.td-card-wrap { perspective: 1600px; }
.td-card { position: relative; min-height: 480px; transition: transform .5s; transform-style: preserve-3d; }
.td-card.flipped { transform: rotateY(180deg); }
.td-face {
  position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden;
  background: #fff; border: 1px solid #e4ebf3; border-radius: 16px; padding: 26px 28px;
  box-shadow: 0 8px 30px rgba(22, 52, 92, .08); display: flex; flex-direction: column;
  overflow-y: auto;
}
.td-back { transform: rotateY(180deg); }
.td-tag { position: absolute; top: 18px; right: 20px; color: #fff; font-size: 12px; padding: 3px 12px; border-radius: 12px; font-weight: 600; }
.td-kicker { font-size: 13px; letter-spacing: 6px; color: #9fb2c9; font-weight: 700; margin-bottom: 10px; }
.td-cue { font-size: 22px; line-height: 1.6; color: #1f2d3d; font-weight: 600; flex: 1; display: flex; align-items: center; }
.td-hint { font-size: 13px; color: #8a94a6; margin-bottom: 14px; }
.td-flip-btn {
  align-self: center; border: none; background: #16345c; color: #fff; font-size: 15px;
  padding: 11px 34px; border-radius: 24px; cursor: pointer; transition: background .15s;
}
.td-flip-btn:hover { background: #0f2742; }

.td-sec { margin-bottom: 12px; }
.td-sec-h { font-size: 13px; font-weight: 700; margin-bottom: 3px; }
.td-sec-b { font-size: 15px; line-height: 1.65; color: #303133; }
.td-action { background: #f0f9eb; border-left: 4px solid #67C23A; padding: 10px 14px; border-radius: 6px; }
.td-action .td-sec-h { color: #529b2e; }
.td-crit { background: #f5f8fc; border-left: 4px solid #16345c; padding: 10px 14px; border-radius: 6px; }
.td-crit .td-sec-h { color: #16345c; }
.td-pit { background: #fef0f0; border-left: 4px solid #F56C6C; padding: 10px 14px; border-radius: 6px; }
.td-pit .td-sec-h { color: #c45656; }

.td-grade { margin-top: auto; display: flex; align-items: center; gap: 12px; padding-top: 8px; }
.tg-q { font-size: 13px; color: #5b6b7f; margin-right: auto; }
.tg-hit, .tg-miss { border: none; border-radius: 22px; padding: 9px 22px; font-size: 14px; cursor: pointer; font-weight: 600; transition: transform .1s; }
.tg-hit { background: #67C23A; color: #fff; }
.tg-miss { background: #fff; color: #F56C6C; border: 1px solid #F56C6C; }
.tg-hit:hover, .tg-miss:hover { transform: translateY(-1px); }

.td-nav { display: flex; align-items: center; justify-content: space-between; margin-top: 14px; }
.td-prev { border: 1px solid #d5deea; background: #fff; color: #5b6b7f; border-radius: 18px; padding: 5px 16px; font-size: 13px; cursor: pointer; }
.td-prev:disabled { opacity: .4; cursor: not-allowed; }
.td-streak { font-size: 13px; color: #67C23A; font-weight: 600; }

.td-finish { text-align: center; background: #fff; border: 1px solid #e4ebf3; border-radius: 16px; padding: 40px 20px; box-shadow: 0 8px 30px rgba(22,52,92,.06); }
.tf-emoji { font-size: 46px; }
.tf-finish h3 { margin: 12px 0 6px; color: #1f2d3d; }
.td-finish p { color: #5b6b7f; font-size: 14px; margin: 0 0 20px; }
.tf-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.tf-primary { background: #ffc53d; color: #5a3d00; border: none; border-radius: 24px; padding: 10px 26px; font-size: 15px; font-weight: 700; cursor: pointer; }
.tf-ghost { background: #fff; color: #16345c; border: 1px solid #16345c; border-radius: 24px; padding: 10px 22px; font-size: 14px; cursor: pointer; }
.td-empty { text-align: center; color: #8a94a6; padding: 60px 0; font-size: 14px; }

@media (max-width: 640px) {
  .td-cue { font-size: 18px; }
  .td-hero { flex-direction: column; align-items: flex-start; }
}
</style>
