<script setup lang="ts">
// 全站记忆卡 SRS 复习页（P4-1）· 手机碎片时间刷间隔重复卡
import { ref, computed, onMounted } from 'vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { useSrsStore, type SrsGrade } from '@/stores/srs'

const store = useSrsStore()
store.init()

// LaTeX 渲染（复用速查卡 texify 方案）
function texify(text: string): string {
  if (!text) return ''
  return text
    .replace(/\$\$([\s\S]+?)\$\$/g, (_m, p1) => katex.renderToString(p1, { displayMode: true, throwOnError: false, strict: false }))
    .replace(/\$([^$]+?)\$/g, (_m, p1) => katex.renderToString(p1, { displayMode: false, throwOnError: false, strict: false }))
}

// ---------- 会话状态 ----------
const poolFilter = ref<string>('all')
const queue = ref<string[]>([])
const pos = ref(0)
const done = ref(0)
const flipped = ref(false)
const started = ref(false)

const poolChips = computed(() => [
  { key: 'all', label: `全部 (${store.totalCount})` },
  ...store.pools.map(p => ({ key: p.pool, label: `${p.poolLabel} (${p.due + p.neu})` }))
])

function inFilter(id: string): boolean {
  if (poolFilter.value === 'all') return true
  return store.cards[id]?.pool === poolFilter.value
}

function beginSession() {
  queue.value = store.sessionQueue.map(c => c.id).filter(inFilter)
  pos.value = 0
  done.value = 0
  flipped.value = false
  started.value = true
}

const cur = computed(() => (pos.value < queue.value.length ? store.cards[queue.value[pos.value]] : null))
const sessionTotal = computed(() => queue.value.length)
const sessionLeft = computed(() => Math.max(0, queue.value.length - pos.value))
const sessionDone = computed(() => started.value && !cur.value)

function reveal() { flipped.value = true }
function rate(g: SrsGrade) {
  const id = queue.value[pos.value]
  if (!id) return
  store.grade(id, g)
  done.value += 1
  if (g === 'again') queue.value.push(id) // 当日回炉，排到队尾
  pos.value += 1
  flipped.value = false
}

// 卡片盒子可视化
function boxPips(box: number): string {
  if (box === 0) return '新'
  return '★'.repeat(box) + '☆'.repeat(Math.max(0, store.MAX_BOX - box))
}

// 统计卡
const statCards = computed(() => ([
  { key: 'due', label: '待复习', value: store.dueCount, color: '#e6544f' },
  { key: 'new', label: '新卡', value: store.newCount, color: '#3a6df0' },
  { key: 'mature', label: '已掌握', value: store.matureCount, color: '#2fa36b' },
  { key: 'total', label: '卡片总数', value: store.totalCount, color: '#8a6d1f' }
]))

onMounted(() => { beginSession() })
</script>

<template>
  <div class="srs">
    <div class="srs-header">
      <h2 class="srs-title">🧠 记忆卡 · 间隔重复</h2>
      <p class="srs-sub">Leitner 盒算法 · 到期自动安排 · 手机碎片时间刷卡</p>
    </div>

    <!-- 统计 -->
    <div class="stat-row">
      <div v-for="s in statCards" :key="s.key" class="stat-box">
        <div class="stat-num" :style="{ color: s.color }">{{ s.value }}</div>
        <div class="stat-label">{{ s.label }}</div>
      </div>
    </div>

    <!-- 池筛选 -->
    <div class="chips">
      <button v-for="c in poolChips" :key="c.key" class="chip" :class="{ active: poolFilter === c.key }"
              @click="poolFilter = c.key; beginSession()">{{ c.label }}</button>
    </div>

    <!-- 会话区 -->
    <div class="session">
      <template v-if="cur">
        <div class="meta-bar">
          <span class="prog">本次剩余 {{ sessionLeft }} / {{ sessionTotal }} · 已答 {{ done }}</span>
          <span class="box-tag">{{ boxPips(cur.box) }} <i v-if="cur.lapses">· 遗忘{{ cur.lapses }}</i></span>
        </div>

        <div class="pool-tag">{{ cur.poolLabel }}<template v-if="cur.chapter"> · {{ cur.chapter }}</template></div>

        <div class="card-face">
          <div class="face-label">回忆以下内容</div>
          <div class="face-body" v-html="texify(cur.front)"></div>
        </div>

        <div v-if="flipped" class="card-face answer">
          <div class="face-label">答案</div>
          <div class="face-body" v-html="texify(cur.back)"></div>
        </div>

        <div v-if="!flipped" class="actions">
          <button class="btn-reveal" @click="reveal">显示答案</button>
        </div>
        <div v-else class="grade-row">
          <button class="btn again" @click="rate('again')"><b>重来</b><span>&lt;1天</span></button>
          <button class="btn good" @click="rate('good')"><b>记得</b><span>{{ store.INTERVALS[Math.min(store.MAX_BOX - 1, Math.max(0, cur.box))] }}天</span></button>
          <button class="btn easy" @click="rate('easy')"><b>简单</b><span>{{ store.INTERVALS[Math.min(store.MAX_BOX - 1, cur.box + 1)] }}天</span></button>
        </div>
      </template>

      <!-- 空 / 完成态 -->
      <div v-else class="empty">
        <template v-if="sessionDone">
          <div class="empty-emoji">🎉</div>
          <div class="empty-title">本次复习完成！</div>
          <div class="empty-sub">明天会按记忆曲线再安排到期卡片。随时可再来一组。</div>
        </template>
        <template v-else>
          <div class="empty-emoji">🗂️</div>
          <div class="empty-title">当前没有到期卡片</div>
          <div class="empty-sub">待复习 {{ store.dueCount }} · 新卡 {{ store.newCount }}。可切换上方卡池，或稍后再来。</div>
        </template>
        <button class="btn-reveal restart" @click="beginSession">重新开始一组</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.srs { max-width: 760px; margin: 0 auto; padding: 20px 16px 60px; }
.srs-header { text-align: center; margin-bottom: 18px; }
.srs-title { font-size: 1.9em; color: #1a1a2e; margin: 0 0 6px; font-weight: 700; }
.srs-sub { color: #888; margin: 0; font-size: 1.02em; }
.stat-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px; }
.stat-box { background: #f7f8fa; border: 1px solid #eee; border-radius: 12px; padding: 14px 8px; text-align: center; }
.stat-num { font-size: 1.7em; font-weight: 800; line-height: 1; }
.stat-label { font-size: .95em; color: #5b6b7f; margin-top: 6px; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
.chip { border: 1px solid #d7deea; background: #fff; color: #3a4a5f; border-radius: 999px; padding: 7px 14px; font-size: .98em; cursor: pointer; transition: .15s; }
.chip.active { background: #16345c; color: #fff; border-color: transparent; }
.session { background: #fff; border: 1px solid #eceff3; border-radius: 16px; padding: 20px 18px 24px; box-shadow: 0 4px 18px rgba(30,60,110,.06); }
.meta-bar { display: flex; justify-content: space-between; align-items: center; font-size: .95em; color: #5b6b7f; margin-bottom: 10px; }
.box-tag { font-weight: 700; color: #f0a92e; letter-spacing: 1px; }
.box-tag i { color: #e6544f; font-style: normal; font-weight: 600; margin-left: 4px; }
.pool-tag { display: inline-block; font-size: .9em; color: #3a6df0; background: #eef2fb; border-radius: 6px; padding: 3px 10px; margin-bottom: 12px; }
.card-face { border-radius: 14px; padding: 22px 18px; margin-bottom: 16px; }
.card-face:not(.answer) { background: linear-gradient(135deg,#fbfcfe,#f1f4fa); border: 1px solid #e6ebf3; }
.card-face.answer { background: #f4fbf6; border: 1px solid #cdeed6; }
.face-label { font-size: .85em; color: #93a1b3; margin-bottom: 8px; letter-spacing: 1px; }
.face-body { font-size: 1.28em; color: #1f2d3d; line-height: 1.7; word-break: break-word; }
.face-body :deep(.katex-display) { margin: .5em 0; }
.actions { text-align: center; }
.btn-reveal { background: #16345c; color: #fff; border: none; border-radius: 12px; padding: 16px 40px; font-size: 1.2em; font-weight: 700; cursor: pointer; }
.btn-reveal.restart { margin-top: 18px; }
.grade-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.btn { border: none; border-radius: 12px; padding: 16px 8px; cursor: pointer; color: #fff; display: flex; flex-direction: column; align-items: center; gap: 3px; font-size: 1.05em; }
.btn b { font-size: 1.15em; }
.btn span { font-size: .8em; opacity: .9; }
.btn.again { background: #e6544f; }
.btn.good { background: #2fa36b; }
.btn.easy { background: #3a6df0; }
.empty { text-align: center; padding: 30px 10px; }
.empty-emoji { font-size: 3em; }
.empty-title { font-size: 1.35em; font-weight: 700; color: #1f2d3d; margin: 10px 0 6px; }
.empty-sub { color: #7a8798; font-size: 1.02em; }
@media (max-width: 480px) {
  .stat-row { grid-template-columns: repeat(2, 1fr); }
  .face-body { font-size: 1.2em; }
}
</style>
