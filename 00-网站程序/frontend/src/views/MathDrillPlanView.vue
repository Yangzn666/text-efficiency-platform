<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MathReinforcementNav from '@/components/MathReinforcementNav.vue'

const router = useRouter()
const plan = ref<any>(null)
const loading = ref(true)
const STORAGE_KEY = 'mathdrillplan-v1'
const done = ref<Record<string, boolean>>({})

function itemKey(date: string, paper: string, type: string, n?: number) {
  return `${date}|${paper}|${type}|${n ?? '-'}`
}

async function load() {
  loading.value = true
  const base = import.meta.env.BASE_URL || '/'
  try {
    const res = await fetch(`${base}data/math/drill-plan.json?t=${Date.now()}`)
    plan.value = await res.json()
  } catch (e) {
    plan.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) done.value = JSON.parse(raw)
  } catch { done.value = {} }
  load()
})

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(done.value)) } catch {}
}
function toggle(key: string) {
  done.value = { ...done.value, [key]: !done.value[key] }
  save()
}
function isChecked(key: string) {
  return !!done.value[key]
}

// 统计所有可打勾项（skip 项不计入待办）
function countables(tasks: any[]) {
  const keys: string[] = []
  for (const t of tasks) {
    if (t.type === 'skip') continue
    if (t.nums && t.nums.length) {
      for (const n of t.nums) keys.push(itemKey(t._date, t.paper, t.type, n))
    } else {
      keys.push(itemKey(t._date, t.paper, t.type))
    }
  }
  return keys
}

const stats = computed(() => {
  if (!plan.value) return { total: 0, done: 0 }
  let total = 0, d = 0
  for (const ph of plan.value.phases) {
    for (const day of ph.days) {
      const tasks = day.tasks.map((t: any) => ({ ...t, _date: day.date }))
      const ks = countables(tasks)
      total += ks.length
      d += ks.filter((k) => done.value[k]).length
    }
  }
  return { total, done: d }
})
const pct = computed(() => (stats.value.total ? Math.round((stats.value.done / stats.value.total) * 100) : 0))

function phasePct(ph: any) {
  let total = 0, d = 0
  for (const day of ph.days) {
    const tasks = day.tasks.map((t: any) => ({ ...t, _date: day.date }))
    const ks = countables(tasks)
    total += ks.length
    d += ks.filter((k) => done.value[k]).length
  }
  return total ? Math.round((d / total) * 100) : 0
}

const typeLabel: Record<string, string> = { do: '✅ 掐表做', look: '⏱ 看思路', mock: '🎯 整套限时', review: '🔁 复盘回炉', skip: '❌ 跳过' }

function resetAll() {
  if (confirm('确定清空全部打勾进度？')) { done.value = {}; save() }
}
</script>

<template>
  <div class="dp-container">
    <MathReinforcementNav />

    <div class="dp-header">
      <h1 class="dp-title">{{ plan?.meta?.title || '数学模拟卷 · 刷题清单' }}</h1>
      <p class="dp-sub">{{ plan?.meta?.subtitle }}</p>
      <div class="dp-dates">
        <span class="chip">更新 {{ plan?.meta?.updated }}</span>
        <span class="chip">初试 {{ plan?.meta?.examDate }}</span>
        <span class="chip">剩余 {{ plan ? Math.max(0, Math.round((new Date(plan.meta.examDate).getTime() - new Date('2026-10-27').getTime()) / 86400000)) : '' }} 天</span>
      </div>
      <div v-if="plan?.meta?.principle" class="dp-principle">📌 {{ plan.meta.principle }}</div>
    </div>

    <!-- 总进度 -->
    <div class="dp-overall">
      <div class="dp-overall-top">
        <span>总进度</span>
        <span class="mono">{{ stats.done }} / {{ stats.total }} 项 · {{ pct }}%</span>
      </div>
      <div class="dp-bar"><i :style="{ width: pct + '%' }"></i></div>
      <button class="dp-reset" @click="resetAll">清空进度</button>
    </div>

    <div v-if="loading" class="dp-loading">加载中…</div>
    <div v-else-if="!plan" class="dp-loading">清单加载失败，请刷新重试。</div>

    <template v-else>
      <section v-for="ph in plan.phases" :key="ph.id" class="dp-phase">
        <div class="ph-head">
          <div class="ph-badge" :class="'ph-' + ph.id">{{ ph.id }}</div>
          <div class="ph-title-wrap">
            <h2>{{ ph.name }}</h2>
            <div class="ph-dates">{{ ph.dates }}</div>
          </div>
          <div class="ph-pct mono">{{ phasePct(ph) }}%</div>
        </div>
        <div class="ph-focus">{{ ph.focus }}</div>

        <div v-for="day in ph.days" :key="day.date" class="dp-day">
          <div class="day-head">
            <span class="day-date">{{ day.date }}</span>
            <span class="day-title">{{ day.title }}</span>
          </div>
          <div v-for="(t, ti) in day.tasks" :key="ti" class="task" :class="'task-' + t.type">
            <span class="task-tag">{{ typeLabel[t.type] || t.type }}</span>
            <span class="task-paper">{{ t.paper }}</span>
            <div class="task-nums">
              <template v-if="t.nums && t.nums.length">
                <button
                  v-for="n in t.nums"
                  :key="n"
                  class="num"
                  :class="{ on: isChecked(itemKey(day.date, t.paper, t.type, n)) }"
                  @click="toggle(itemKey(day.date, t.paper, t.type, n))"
                >{{ n }}</button>
              </template>
              <button
                v-else-if="t.type !== 'skip'"
                class="num single"
                :class="{ on: isChecked(itemKey(day.date, t.paper, t.type)) }"
                @click="toggle(itemKey(day.date, t.paper, t.type))"
              >{{ isChecked(itemKey(day.date, t.paper, t.type)) ? '✓ 已完成' : '○ 标记完成' }}</button>
            </div>
          </div>
        </div>
      </section>

      <div class="dp-foot">共 {{ plan.phases.length }} 个阶段 · 打开此页即接着上次的勾继续。祝上岸 🎓</div>
    </template>
  </div>
</template>

<style scoped>
.dp-container {
  max-width: 1120px; margin: 0 auto; padding: 0 16px 48px;
  background: #f4f1ea; border-radius: 20px;
  font-family: 'FZCuHei', 'Microsoft YaHei', 'PingFang SC', system-ui, sans-serif;
  color: #1c2b28;
}
.dp-header { padding: 22px 8px 8px; }
.dp-title { font-size: 26px; font-weight: 800; color: #22333b; margin: 0 0 4px; }
.dp-sub { font-size: 14px; color: #7c8079; margin: 0 0 12px; }
.dp-dates { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.chip { background: #22333b; color: #f4f1ea; font-size: 12.5px; padding: 4px 12px; border-radius: 999px; }
.dp-principle { background: #eef1f6; border: 1px solid #cdd6e3; border-radius: 12px; padding: 12px 14px; font-size: 13.5px; line-height: 1.7; color: #22333b; }

.dp-overall { position: relative; background: #fffdf8; border: 1px solid #e3ddce; border-radius: 14px; padding: 14px 16px; margin: 16px 8px 6px; }
.dp-overall-top { display: flex; justify-content: space-between; font-size: 13.5px; color: #7c8079; margin-bottom: 8px; }
.mono { font-family: ui-monospace, Menlo, Consolas, monospace; }
.dp-bar { height: 14px; border-radius: 999px; background: #e8e2d4; overflow: hidden; }
.dp-bar i { display: block; height: 100%; background: linear-gradient(90deg, #2f6b57, #4f9b7f); transition: width .3s; }
.dp-reset { position: absolute; right: 14px; bottom: 12px; border: 1px solid #d8d2c4; background: #fff; color: #b3402f; font-size: 12px; border-radius: 8px; padding: 3px 10px; cursor: pointer; }
.dp-loading { text-align: center; color: #7c8079; padding: 40px; }

.dp-phase { margin-top: 28px; }
.ph-head { display: flex; align-items: center; gap: 12px; }
.ph-badge { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 20px; color: #fff; }
.ph-A { background: #2f6b57; } .ph-B { background: #c8892a; } .ph-C { background: #b3402f; }
.ph-title-wrap h2 { margin: 0; font-size: 19px; color: #22333b; }
.ph-dates { font-size: 12.5px; color: #7c8079; }
.ph-pct { margin-left: auto; font-size: 14px; color: #2f6b57; font-weight: 700; }
.ph-focus { font-size: 13px; color: #7c8079; margin: 6px 0 12px 52px; }

.dp-day { background: #fffdf8; border: 1px solid #e7e1d3; border-radius: 12px; padding: 12px 14px; margin: 0 0 10px 52px; }
.day-head { display: flex; align-items: baseline; gap: 10px; margin-bottom: 8px; }
.day-date { font-family: ui-monospace, monospace; font-weight: 700; color: #d9694a; font-size: 14px; }
.day-title { font-size: 15px; font-weight: 700; color: #22333b; }

.task { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 7px 0; border-top: 1px dashed #ece6d8; }
.task:first-of-type { border-top: none; }
.task-tag { font-size: 11.5px; font-weight: 700; padding: 2px 8px; border-radius: 6px; white-space: nowrap; }
.task-do .task-tag { background: #e9f3ee; color: #2f6b57; }
.task-look .task-tag { background: #f7edd8; color: #a9741f; }
.task-mock .task-tag { background: #e7ecf5; color: #2b4a7a; }
.task-review .task-tag { background: #efe7f2; color: #6d4a7a; }
.task-skip .task-tag { background: #f6e2de; color: #b3402f; }
.task-paper { font-size: 13px; color: #454f4b; }
.task-skip .task-paper { color: #b3402f; }
.task-nums { display: flex; flex-wrap: wrap; gap: 6px; width: 100%; }
.num { min-width: 30px; height: 30px; padding: 0 8px; border: 1.5px solid #cfc8b8; background: #fff; border-radius: 8px; font-size: 13px; font-weight: 600; color: #454f4b; cursor: pointer; transition: all .15s; }
.num:hover { border-color: #2f6b57; }
.num.on { background: #2f6b57; border-color: #2f6b57; color: #fff; text-decoration: line-through; }
.num.single { min-width: 100px; }
.num.single.on { text-decoration: none; }
.task-mock .num.on { background: #2b4a7a; border-color: #2b4a7a; }
.task-review .num.on { background: #6d4a7a; border-color: #6d4a7a; }

.dp-foot { text-align: center; color: #7c8079; font-size: 12.5px; margin-top: 30px; }

@media (max-width: 768px) {
  .dp-title { font-size: 21px; }
  .dp-day, .ph-focus { margin-left: 0; }
  .task { gap: 6px; }
  .num { min-width: 28px; height: 28px; }
}
</style>
