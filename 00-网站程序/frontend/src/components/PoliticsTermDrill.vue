<script setup lang="ts">
// 定位词速答 · 翻牌自测（新思想最高频"张冠李戴"帽子）
// 数据源：@/data/politicsWrongCause 里的 TERM_CARDS
import { ref, computed } from 'vue'
import { TERM_CARDS } from '@/data/politicsWrongCause'

const topics = ['全部', ...Array.from(new Set(TERM_CARDS.map(t => t.topic)))]
const activeTopic = ref('全部')
const shuffled = ref(false)

const list = computed(() => {
  let arr = activeTopic.value === '全部'
    ? TERM_CARDS
    : TERM_CARDS.filter(t => t.topic === activeTopic.value)
  if (shuffled.value) arr = [...arr].sort(() => Math.random() - 0.5)
  return arr
})

// 翻面状态：默认背面（只看信号词），点击翻到答案
const flipped = ref<Set<string>>(new Set())
const toggleFlip = (id: string) => {
  const s = new Set(flipped.value)
  s.has(id) ? s.delete(id) : s.add(id)
  flipped.value = s
}
const flipAll = () => {
  flipped.value = flipped.value.size === list.value.length
    ? new Set()
    : new Set(list.value.map(t => t.id))
}

// 自评：已掌握 / 还模糊
type Status = 'ok' | 'blur'
const marks = ref<Record<string, Status>>({})
const mark = (id: string, st: Status) => {
  const m = { ...marks.value }
  m[id] = m[id] === st ? undefined as any : st
  if (m[id] === undefined) delete m[id]
  marks.value = m
  const s = new Set(flipped.value); s.delete(id); flipped.value = s
}
const okCount = computed(() => Object.values(marks.value).filter(v => v === 'ok').length)
const blurCount = computed(() => Object.values(marks.value).filter(v => v === 'blur').length)
const remain = computed(() => list.value.length - okCount.value - blurCount.value)
const resetMarks = () => { marks.value = {}; flipped.value = new Set() }
</script>

<template>
  <div class="td">
    <div class="td-hero">
      <div class="td-kicker">新思想 · 定位词速答</div>
      <h2 class="td-title">看到"帽子"，一秒报出它该配的那颗头</h2>
      <p class="td-sub">
        单选选反、多选贪多，几乎都栽在「最X原则 / 根本 / 首要 / 统领 / 落脚点」这类定位词上。
        点卡片翻面看正解与干扰项，再自评「记住了 / 还模糊」，把张冠李戴一次性掰正。
      </p>
      <div class="td-kpis">
        <div class="td-kpi"><strong>{{ okCount }}</strong><span>已记住</span></div>
        <div class="td-kpi coral"><strong>{{ blurCount }}</strong><span>还模糊</span></div>
        <div class="td-kpi"><strong>{{ remain }}</strong><span>本组未练</span></div>
      </div>
    </div>

    <div class="td-bar">
      <div class="td-chips">
        <button v-for="tp in topics" :key="tp" :class="{ on: activeTopic === tp }" @click="activeTopic = tp">{{ tp }}</button>
      </div>
      <div class="td-tools">
        <button @click="shuffled = !shuffled">{{ shuffled ? '✓ 乱序' : '打乱顺序' }}</button>
        <button @click="flipAll">翻面 / 收起</button>
        <button class="ghost" @click="resetMarks">重置进度</button>
      </div>
    </div>

    <div class="td-grid">
      <div
        v-for="t in list" :key="t.id"
        class="td-card" :class="[flipped.has(t.id) ? 'show' : 'hide', marks[t.id]]"
        @click="toggleFlip(t.id)"
      >
        <span class="td-topic">{{ t.topic }}</span>
        <div class="td-face front">
          <div class="td-q">{{ t.signal }}</div>
          <div class="td-hint">👆 想好了？点这里翻面对答案</div>
        </div>
        <div class="td-face back">
          <div class="td-a"><b>正解</b>{{ t.answer }}</div>
          <div class="td-trap"><b>别选</b>{{ t.trap }}</div>
          <div class="td-src">{{ t.src }}</div>
          <div class="td-marks" @click.stop>
            <button class="mk-ok" :class="{ on: marks[t.id] === 'ok' }" @click="mark(t.id, 'ok')">记住了 ✓</button>
            <button class="mk-blur" :class="{ on: marks[t.id] === 'blur' }" @click="mark(t.id, 'blur')">还模糊 ✗</button>
          </div>
        </div>
      </div>
    </div>

    <p class="td-foot">💡 这套帽子题记不牢时，回 <router-link to="/wrong-problems?subject=politics" class="td-link">全科错题本 → 新思想</router-link> 逐题重做，或在「错题再练」里按错因回炉。</p>
  </div>
</template>

<style scoped>
.td {
  --td-ink: #1f2d3d; --td-body: #303133; --td-muted: #5b6b7f;
  --td-gold: #ffc53d; --td-navy: #16345c; --td-navy-deep: #0d2137;
  --td-coral: #e8604c; --td-green: #2e9e6b; --td-line: #e4ebf3; --td-soft: #f5f8fc;
  --font-display: 'Barlow Condensed', 'FZCuHei', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  color: var(--td-body);
}
.td-hero {
  background: linear-gradient(150deg, var(--td-navy-deep) 0%, var(--td-navy) 70%, #1e4576 100%);
  border-radius: 16px; padding: 26px 30px; color: #fff; position: relative; overflow: hidden; margin-bottom: 18px;
}
.td-hero::after {
  content: ''; position: absolute; inset: 0;
  background-image: linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);
  background-size: 40px 40px; pointer-events: none;
}
.td-kicker { font-family: var(--font-mono); font-size: .72rem; letter-spacing: .2em; color: var(--td-gold); position: relative; z-index: 1; }
.td-title { font-size: clamp(1.3rem,2.4vw,1.8rem); margin: 8px 0 10px; font-weight: 800; position: relative; z-index: 1; }
.td-sub { color: #b9cbe0; font-size: .9rem; line-height: 1.75; margin: 0; max-width: 760px; position: relative; z-index: 1; }
.td-kpis { display: flex; gap: 16px; margin-top: 18px; position: relative; z-index: 1; }
.td-kpi { background: rgba(255,255,255,.08); border-radius: 10px; padding: 10px 18px; text-align: center; min-width: 84px; }
.td-kpi strong { display: block; font-family: var(--font-display); font-size: 1.7rem; color: var(--td-gold); line-height: 1; }
.td-kpi span { font-size: .72rem; color: #b9cbe0; }
.td-kpi.coral strong { color: #ff8a76; }

.td-bar { display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 16px; }
.td-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.td-chips button, .td-tools button {
  border: 1px solid var(--td-line); background: #fff; color: var(--td-muted);
  padding: 7px 16px; border-radius: 999px; font-size: .88rem; font-weight: 600; cursor: pointer; transition: all .18s;
}
.td-chips button:hover, .td-tools button:hover { border-color: var(--td-navy); color: var(--td-navy); }
.td-chips button.on { background: var(--td-navy); color: #fff; border-color: var(--td-navy); }
.td-tools { display: flex; gap: 8px; }
.td-tools button.ghost { border-style: dashed; }

.td-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
.td-card {
  position: relative; border: 1px solid var(--td-line); border-radius: 14px; background: #fff;
  padding: 18px 20px 20px; cursor: pointer; min-height: 178px; overflow: hidden;
  border-left: 4px solid var(--td-green); transition: box-shadow .2s, transform .2s;
}
.td-card:hover { box-shadow: 0 10px 26px rgba(13,33,55,.1); transform: translateY(-2px); }
.td-card.ok { border-left-color: var(--td-green); background: linear-gradient(180deg,#f2fbf6,#fff); }
.td-card.blur { border-left-color: var(--td-coral); background: linear-gradient(180deg,#fff4f1,#fff); }
.td-topic {
  position: absolute; top: 14px; right: 14px; font-size: .7rem; font-weight: 700;
  color: var(--td-navy); background: #eef3f9; border-radius: 6px; padding: 2px 9px;
}
.td-face { display: none; flex-direction: column; gap: 10px; }
.td-card.hide .front { display: flex; }
.td-card.show .back { display: flex; }
.td-q { font-size: 1.04rem; font-weight: 700; color: var(--td-ink); line-height: 1.55; padding-right: 60px; }
.td-hint { margin-top: auto; font-size: .8rem; color: var(--td-muted); }
.td-a { font-size: 1.02rem; color: #1f7a55; line-height: 1.6; }
.td-a b { display: inline-block; font-size: .72rem; color: #fff; background: var(--td-green); border-radius: 5px; padding: 1px 8px; margin-right: 8px; vertical-align: 2px; }
.td-trap { font-size: .9rem; color: var(--td-body); line-height: 1.6; background: #fff4f1; border-radius: 8px; padding: 10px 12px; }
.td-trap b { display: inline-block; font-size: .72rem; color: #fff; background: var(--td-coral); border-radius: 5px; padding: 1px 8px; margin-right: 8px; vertical-align: 2px; }
.td-src { font-family: var(--font-mono); font-size: .74rem; color: var(--td-muted); }
.td-marks { display: flex; gap: 10px; margin-top: 4px; }
.td-marks button { flex: 1; border: 1px solid var(--td-line); background: #fff; border-radius: 8px; padding: 8px; cursor: pointer; font-size: .86rem; font-weight: 600; color: var(--td-muted); transition: all .15s; }
.mk-ok.on, .mk-ok:hover { border-color: var(--td-green); color: var(--td-green); background: #eef8f2; }
.mk-blur.on, .mk-blur:hover { border-color: var(--td-coral); color: var(--td-coral); background: #fff1ee; }

.td-foot { margin-top: 24px; font-size: .84rem; color: var(--td-muted); }
.td-link { color: var(--td-navy); font-weight: 700; text-decoration: none; border-bottom: 1px solid var(--td-gold); }

@media (max-width: 768px) {
  .td-kpis { gap: 10px; }
  .td-grid { grid-template-columns: 1fr; }
}
</style>
