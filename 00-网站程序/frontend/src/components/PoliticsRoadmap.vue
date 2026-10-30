<script setup lang="ts">
// 政治 · 备考路线图（从 PoliticsView 内联模板抽出，改为可折叠的紧凑版）
// 只保留三阶段任务与课程对账数字；数据源仍是 stores/todayStatus，避免两处说两套话。
import { computed, onMounted } from 'vue'
import {
  useTodayStatusStore,
  POLITICS_COURSE_LESSONS,
  POLITICS_COURSE_HOURS_2X,
  POLITICS_COURSE_RAW_HOURS
} from '@/stores/todayStatus'

const todayStore = useTodayStatusStore()
onMounted(() => { todayStore.load() })

/** 串讲一刷硬截止线（过了这天就没时间二刷和刷肖八） */
const ROUND1_DEADLINE = '2026-10-20'
const courseLessons = POLITICS_COURSE_LESSONS
const courseDone = computed(() => {
  const p = todayStore.plans.find(x => x.key === 'politics')
  return Math.min(courseLessons, p?.completedUnits ?? 0)
})
const courseLeft = computed(() => courseLessons - courseDone.value)
const perDayNeeded = computed(() => {
  const days = Math.max(1, Math.round((new Date(ROUND1_DEADLINE).getTime() - Date.now()) / 86400000))
  return (courseLeft.value / days).toFixed(1)
})

const stages = [
  {
    phase: 'PHASE 01', time: '8月 - 9月', title: '强化筑基期', color: 'gold',
    goal: '搭建框架 · 理解考点 · 刷透肖1000题',
    tasks: [
      '主线课程：考点串讲五模块共 58 讲，按网盘目录顺序（马原→思修→史纲→毛中特→新思想）2 倍速过一遍',
      '每看完一讲立即对应刷肖秀荣《1000题》该章节，当天错题当天订正',
      '马原哲学部分重理解：矛盾、实践、认识论必须能用自己的话讲出来',
      '形策暂不系统投入，每天刷新闻留印象即可'
    ],
    daily: '每日预算 1 - 1.5 小时',
    tip: '此阶段不求全记住，选择题正确率 60% 即达标，重点是建立框架感'
  },
  {
    phase: 'PHASE 02', time: '10月', title: '真题技巧期', color: 'red',
    goal: '真题实战 · 技巧提炼 · 错题回炉',
    tasks: [
      '腿姐技巧班（选择题技巧为主），学会识别命题陷阱与绝对化表述',
      '肖1000题二刷错题与标记题，正确率目标提升至 75%+',
      '研砖政治模块按年刷真题选择题，感受命题风格',
      '开始整理时政热点笔记，跟随主流时政串讲资料'
    ],
    daily: '每日预算 1.5 - 2 小时',
    tip: '多选题是政治拉分核心，错 1 个少 2 分，技巧班的"帽子题"判断法务必练熟'
  },
  {
    phase: 'PHASE 03', time: '11月 - 12月', title: '冲刺决胜期', color: 'navy',
    goal: '肖8肖4 · 时政突击 · 分析题背诵',
    tasks: [
      '肖八到手：选择题全刷、反复刷到全对，分析题只看思路不必背',
      '肖四到手：4 道分析题 × 4 套卷全部背熟，这是政治分析题的保命盘',
      '时政冲刺册 + 各机构押题卷选择题（腿4、徐8等选做）',
      '回顾错题本中的政治错题，考前一周只看不练'
    ],
    daily: '每日预算 2 - 2.5 小时',
    tip: '肖四大题押题命中率常年极高，背诵优先级高于一切，12月每天大声背诵 1 小时'
  }
]
</script>

<template>
  <div class="rm">
    <div class="rm-grid">
      <div class="rm-cell"><b>{{ courseLessons }} 讲</b><span>考点串讲五模块（马原21·思修8·史纲9·毛中特7·新思想13）</span></div>
      <div class="rm-cell"><b>{{ POLITICS_COURSE_HOURS_2X }} h</b><span>2 倍速净看课（原始约 {{ POLITICS_COURSE_RAW_HOURS }} h）</span></div>
      <div class="rm-cell"><b>{{ courseDone }}/{{ courseLessons }}</b><span>已看完 · 剩 {{ courseLeft }} 讲</span></div>
      <div class="rm-cell"><b>{{ perDayNeeded }} 讲/天</b><span>10-20 前过完一轮的日配额</span></div>
    </div>
    <div class="rm-line">
      <section v-for="(s, i) in stages" :key="i" class="rm-stage" :class="s.color">
        <span class="rm-tag">{{ s.phase }} · {{ s.time }}</span>
        <strong class="rm-title">{{ s.title }}</strong>
        <p class="rm-goal">{{ s.goal }}</p>
        <ul class="rm-tasks">
          <li v-for="(t, j) in s.tasks" :key="j">{{ t }}</li>
        </ul>
        <p class="rm-foot">⏱ {{ s.daily }} ｜ 💡 {{ s.tip }}</p>
        <span v-if="i < stages.length - 1" class="rm-arrow">↓</span>
      </section>
    </div>
  </div>
</template>

<style scoped>
.rm {
  --rm-ink: #1f2d3d; --rm-muted: #5b6b7f; --rm-gold: #ffc53d;
  --rm-navy: #16345c; --rm-line: #e4ebf3; --rm-soft: #f5f8fc; --rm-coral: #e8604c;
  display: flex; flex-direction: column; gap: 14px;
}
.rm-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; }
.rm-cell { background: var(--rm-soft); border: 1px solid var(--rm-line); border-radius: 10px; padding: 10px 12px; }
.rm-cell b { display: block; font-size: 1.15rem; color: var(--rm-navy); font-family: 'JetBrains Mono', monospace; }
.rm-cell span { font-size: .74rem; color: var(--rm-muted); line-height: 1.6; }
.rm-line { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; }
.rm-stage { position: relative; border: 1px solid var(--rm-line); border-radius: 12px; padding: 14px 16px; background: #fff; }
.rm-stage.gold { border-top: 3px solid var(--rm-gold); }
.rm-stage.red { border-top: 3px solid var(--rm-coral); }
.rm-stage.navy { border-top: 3px solid var(--rm-navy); }
.rm-tag { font-family: 'JetBrains Mono', monospace; font-size: .7rem; letter-spacing: .1em; color: var(--rm-muted); }
.rm-title { display: block; font-size: 1.02rem; color: var(--rm-ink); margin: 2px 0 4px; }
.rm-goal { margin: 0 0 8px; font-size: .82rem; color: var(--rm-navy); font-weight: 700; }
.rm-tasks { margin: 0 0 8px; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 5px; }
.rm-tasks li { position: relative; padding-left: 16px; font-size: .82rem; color: #4a5a6c; line-height: 1.65; }
.rm-tasks li::before { content: '▸'; position: absolute; left: 0; color: var(--rm-gold); font-weight: 700; }
.rm-foot { margin: 0; font-size: .74rem; color: var(--rm-muted); border-top: 1px dashed var(--rm-line); padding-top: 7px; }
.rm-arrow { position: absolute; right: -12px; top: 50%; transform: translateY(-50%); color: #cfd8e3; }
@media (max-width: 900px) { .rm-arrow { display: none; } }
</style>
