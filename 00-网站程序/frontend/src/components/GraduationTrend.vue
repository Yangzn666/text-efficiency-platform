// 掌握度趋势 · 近 7 / 30 天三条线：回炉销账、错题复测、连对毕业
// 数据源：review-log-v1（今天起逐日累计）+ review-queue-done-v1（销账天然按日分桶）
//        + 错题本 lastReviewAt（给日志上线前的历史做一次回推，避免图表一开始全空）
// 结论句按用户偏好置顶：一句「本周毕业 X 道，最弱科目 Y」。
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, nextTick } from 'vue'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { useWrongProblemsStore } from '@/stores/wrongProblems'
import { lastDays, graduationsBySubject, loadReviewLog } from '@/data/reviewLog'
import { doneHistory } from '@/data/reviewQueues'

echarts.use([LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

const wp = useWrongProblemsStore()
wp.init()

const span = ref<7 | 30>(7)
const el = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null
let ro: ResizeObserver | null = null

// 历史回推：错题本只留 lastReviewAt，用它统计「当天最后复习过且已毕业」的数量。
// 只用于补齐日志上线前的空缺，不覆盖已有流水。
const masteredByDay = computed<Record<string, number>>(() => {
  const m: Record<string, number> = {}
  wp.all.forEach(p => {
    if (!p.mastered || !p.lastReviewAt) return
    m[p.lastReviewAt] = (m[p.lastReviewAt] || 0) + 1
  })
  return m
})

const points = computed(() => {
  loadReviewLog()
  const qh = doneHistory()
  return lastDays(span.value, qh).map(p => {
    // 毕业：优先用流水；流水当天为 0 而回推有值时才用回推（防止重复计数）
    const grad = p.graduate || masteredByDay.value[p.date] || 0
    return { ...p, graduate: grad }
  })
})

const totals = computed(() => {
  const list = points.value
  return {
    graduate: list.reduce((s, p) => s + p.graduate, 0),
    queue: list.reduce((s, p) => s + p.queue, 0),
    wrong: list.reduce((s, p) => s + p.wrong, 0),
    srs: list.reduce((s, p) => s + p.srs, 0)
  }
})

const subjects = computed(() => {
  const g = graduationsBySubject(span.value)
  const label: Record<string, string> = {
    math: '数学', cs: '计组', ds: '数据结构', os: '操作系统',
    network: '计网', english: '英语', politics: '政治'
  }
  return Object.entries(g)
    .map(([k, n]) => ({ key: k, name: label[k] || k, n }))
    .sort((a, b) => b.n - a.n)
})

const weakest = computed(() => {
  const rows = wp.bySubject
  const order: Array<[string, string]> = [
    ['math', '数学'], ['cs', '计组'], ['ds', '数据结构'], ['os', '操作系统'],
    ['network', '计网'], ['english', '英语'], ['politics', '政治']
  ]
  let worst = { name: '', left: -1, rate: 0 }
  order.forEach(([k, name]) => {
    const row = rows[k as keyof typeof rows]
    if (!row || !row.total) return
    const left = row.total - row.mastered
    if (left > worst.left) worst = { name, left, rate: Math.round((row.mastered / row.total) * 100) }
  })
  return worst
})

const headline = computed(() => {
  const t = totals.value
  const w = weakest.value
  if (!t.graduate && !t.queue && !t.wrong) {
    return `近 ${span.value} 天还没有复习流水——从今天开始，销账、复测、毕业都会自动记账。`
  }
  const parts = [`近 ${span.value} 天毕业 ${t.graduate} 道`]
  if (t.queue) parts.push(`销回炉 ${t.queue} 条`)
  if (w.name) parts.push(`最弱科目 ${w.name}（未掌握 ${w.left} 道，掌握率 ${w.rate}%）`)
  return parts.join('，') + '。'
})

function render() {
  if (!el.value) return
  if (!chart) chart = echarts.init(el.value, undefined, { renderer: 'canvas' })
  const list = points.value
  const compact = span.value === 30
  chart.setOption({
    animationDuration: 400,
    grid: { top: 26, left: 8, right: 12, bottom: 6, containLabel: true },
    tooltip: { trigger: 'axis', confine: true },
    legend: {
      top: 0, right: 0, itemWidth: 10, itemHeight: 8,
      textStyle: { fontSize: 11, color: '#5a6472' }
    },
    xAxis: {
      type: 'category',
      data: list.map(p => p.label),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#dfe5ee' } },
      axisLabel: { fontSize: 10, color: '#8a94a3', interval: compact ? 4 : 0 }
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: { lineStyle: { color: '#eef2f8' } },
      axisLabel: { fontSize: 10, color: '#8a94a3' }
    },
    series: [
      {
        name: '回炉销账', type: 'line', smooth: true, symbolSize: 4,
        data: list.map(p => p.queue),
        itemStyle: { color: '#16345c' },
        areaStyle: { color: 'rgba(22,52,92,.08)' }
      },
      {
        name: '错题复测', type: 'line', smooth: true, symbolSize: 4,
        data: list.map(p => p.wrong),
        itemStyle: { color: '#e8604c' }
      },
      {
        name: '连对毕业', type: 'line', smooth: true, symbolSize: 4,
        data: list.map(p => p.graduate),
        itemStyle: { color: '#2e9e6b' },
        areaStyle: { color: 'rgba(46,158,107,.10)' }
      }
    ]
  }, true)
}

function onResize() { chart?.resize() }

onMounted(async () => {
  await nextTick()
  render()
  window.addEventListener('resize', onResize)
  if (el.value && 'ResizeObserver' in window) {
    ro = new ResizeObserver(() => chart?.resize())
    ro.observe(el.value)
  }
})
watch(span, () => nextTick(render))
watch(points, () => render(), { deep: false })
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  ro?.disconnect()
  chart?.dispose()
  chart = null
})
</script>

<template>
  <section class="gt">
    <div class="gt-head">
      <h3 class="gt-title">📈 掌握度趋势 <small>只增不减的底账</small></h3>
      <div class="gt-switch">
        <button :class="{ on: span === 7 }" @click="span = 7">近 7 天</button>
        <button :class="{ on: span === 30 }" @click="span = 30">近 30 天</button>
      </div>
    </div>
    <p class="gt-headline">{{ headline }}</p>
    <div class="gt-tiles">
      <div class="gt-tile green"><b>{{ totals.graduate }}</b><span>毕业(道)</span></div>
      <div class="gt-tile navy"><b>{{ totals.queue }}</b><span>回炉销账</span></div>
      <div class="gt-tile coral"><b>{{ totals.wrong }}</b><span>错题复测</span></div>
      <div class="gt-tile blue"><b>{{ totals.srs }}</b><span>记忆卡</span></div>
    </div>
    <div ref="el" class="gt-chart"></div>
    <div v-if="subjects.length" class="gt-sub">
      <span class="gt-sub-label">毕业分科：</span>
      <span v-for="s in subjects" :key="s.key" class="gt-chip">{{ s.name }} {{ s.n }}</span>
    </div>
    <p class="gt-note">
      回炉销账来自每日销账记录；错题复测与毕业来自流水（今天起逐日记账，之前的毕业用错题本最后复习日回推）。
    </p>
  </section>
</template>

<style scoped>
.gt { background: #fff; border: 1px solid #e3e8ef; border-radius: 14px; padding: 14px; margin-bottom: 14px; }
.gt-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
.gt-title { margin: 0; font-size: 1.02em; color: #16345c; font-weight: 800; }
.gt-title small { font-weight: 500; color: #8a94a3; font-size: .74em; margin-left: 6px; }
.gt-switch { display: flex; gap: 4px; background: #f1f4f9; border-radius: 999px; padding: 3px; }
.gt-switch button { border: 0; background: transparent; color: #5a6472; font-size: .78em; padding: 4px 10px; border-radius: 999px; cursor: pointer; }
.gt-switch button.on { background: #16345c; color: #fff; font-weight: 700; }
.gt-headline { margin: 8px 0 10px; font-size: .86em; color: #22314a; line-height: 1.6; font-weight: 600; }
.gt-tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 8px; }
.gt-tile { border-radius: 10px; padding: 8px 6px; text-align: center; background: #f7f9fc; border: 1px solid #e8edf4; }
.gt-tile b { display: block; font-size: 1.25em; line-height: 1.2; }
.gt-tile span { display: block; font-size: .7em; color: #7a848f; margin-top: 2px; }
.gt-tile.green b { color: #2e9e6b; }
.gt-tile.navy b { color: #16345c; }
.gt-tile.coral b { color: #e8604c; }
.gt-tile.blue b { color: #2b6cb0; }
.gt-chart { width: 100%; height: 190px; }
.gt-sub { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-top: 6px; font-size: .78em; color: #5a6472; }
.gt-sub-label { color: #8a94a3; }
.gt-chip { background: #eef2f8; border-radius: 999px; padding: 2px 9px; }
.gt-note { margin: 8px 0 0; font-size: .72em; color: #8a94a3; line-height: 1.6; }
@media (max-width: 480px) {
  .gt-tiles { grid-template-columns: repeat(2, 1fr); }
  .gt-chart { height: 170px; }
}
</style>
