#!/usr/bin/env node
/**
 * 明日学习计划生成器（供定时任务调用）
 * --------------------------------------------------
 * 从 Supabase 云端读取最新进度（today_status 表），按网站同款算法
 * 生成「第二日」学习计划，输出美观的纯文本（适合微信阅读）。
 *
 * 用法：node scripts/generate-plan.mjs
 * 依赖：frontend/.env 中的 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
 *       （Node 18+ 内置 fetch，无需额外依赖，也不用 curl）
 *
 * 目标日期规则（适配电脑不常开）：
 *   - 运行时刻 >= 12:00 → 计划为「明天」（晚间预览）
 *   - 运行时刻 <  12:00 → 计划为「今天」（清晨补发，仍是"接下来的一天"）
 */

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FRONTEND_ROOT = join(__dirname, '..')

// ---------- 读取 .env ----------
function loadEnv() {
  const envPath = join(FRONTEND_ROOT, '.env')
  const out = {}
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && !line.trim().startsWith('#')) out[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  }
  // 进程环境变量优先
  out.VITE_SUPABASE_URL ||= process.env.VITE_SUPABASE_URL
  out.VITE_SUPABASE_ANON_KEY ||= process.env.VITE_SUPABASE_ANON_KEY
  return out
}

// ---------- 日期工具 ----------
const pad = (n) => String(n).padStart(2, '0')
const toStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const daysBetween = (from, to) =>
  Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000)
const WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

// ---------- 计划默认值 + 单元标题模板（与网站 todayStatus.ts 完全一致） ----------
const DEFAULT_EXAM_DATE = '2026-12-19'
const DAILY_TIME_BUDGET = 480
const MAX_PER_SUBJECT_PER_DAY = 2

const unitLabels = {
  math: (n) => {
    if (n <= 30) return `基础30讲 第${n}讲`
    if (n <= 48) return `武忠详强化 第${n - 30}讲`
    if (n <= 66) return `1000题A组 高数第${n - 48}讲`
    if (n <= 75) return `1000题A组 线代第${n - 66}讲`
    if (n <= 84) return `1000题A组 概率第${n - 75}讲`
    if (n <= 101) return `1000题B组 高数第${n - 84}讲`
    if (n <= 107) return `1000题B组 线代第${n - 101}讲`
    if (n <= 110) return `1000题B组 概率第${n - 107}讲`
    if (n <= 111) return `1000题B组 高数第18讲`
    if (n <= 114) return `1000题B组 线代第${n - 105}讲`
    if (n <= 120) return `1000题B组 概率第${n - 111}讲`
    if (n <= 130) return `660题 第${n - 120}章 + 错题回顾`
    if (n <= 140) return `李林880 第${n - 130}章`
    if (n <= 158) return `真题套卷 第${n - 140}套（限时3h + 订正）`
    return `数学冲刺回顾`
  },
  cs408: (n) => {
    if (n <= 40) return `基础轮 第${n}章`
    if (n <= 66) return `王道大题强化 第${n - 40}章（费曼讲解→大题）`
    if (n <= 74) return `王道26模拟卷 第${n - 66}套`
    return `408冲刺回顾`
  },
  english: (n) => {
    if (n <= 4) return `单词 第${n}轮`
    if (n <= 14) return `语法长难句 第${n - 4}讲`
    if (n <= 102) return `英一真题 第${n - 14}篇精读（生词+长难句）`
    if (n <= 116) return `新题型 第${n - 102}篇`
    if (n <= 126) return `翻译 第${n - 116}篇`
    if (n <= 136) return `作文 第${n - 126}个模块`
    if (n <= 147) return `套卷模考 第${n - 136}套`
    return `英语冲刺回顾`
  },
  politics: (n) => {
    if (n <= 30) return `徐涛强化 第${n}讲 + 肖1000对应章节`
    if (n <= 50) return `肖1000 第${n - 30}章（二刷错题）`
    if (n <= 58) return `肖八 第${n - 50}套（选择题+订正）`
    if (n <= 62) return `肖四 第${n - 58}套（选择+背大题）`
    return `政治冲刺回顾`
  }
}

const DEFAULT_PLANS = [
  { key: 'math', name: '数学一', icon: '📐', totalUnits: 158, dailyQuota: 1, estMinutes: 100, completedUnits: 110, startDate: '2026-05-01', targetDate: '2026-12-12', active: true },
  { key: 'cs408', name: '408计算机', icon: '💻', totalUnits: 74, dailyQuota: 1, estMinutes: 150, completedUnits: 40, startDate: '2026-07-01', targetDate: '2026-12-12', active: true },
  { key: 'english', name: '英语一', icon: '📖', totalUnits: 147, dailyQuota: 1, estMinutes: 75, completedUnits: 22, startDate: '2026-06-15', targetDate: '2026-12-15', active: true },
  { key: 'politics', name: '政治', icon: '🚩', totalUnits: 62, dailyQuota: 1, estMinutes: 50, completedUnits: 0, startDate: '2026-07-15', targetDate: '2026-12-15', active: true }
]

// ---------- 从云端拉取进度 ----------
async function fetchCloudState(env) {
  const url = env.VITE_SUPABASE_URL
  const key = env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) return null
  const endpoint = `${url.replace(/\/$/, '')}/rest/v1/today_status?user_id=eq.default&select=data,updated_at`
  const res = await fetch(endpoint, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  })
  if (!res.ok) throw new Error(`Supabase 返回 ${res.status}`)
  const rows = await res.json()
  return Array.isArray(rows) && rows.length ? rows[0].data : null
}

// ---------- 合并云端进度到默认计划 ----------
function mergePlans(cloud) {
  const plans = DEFAULT_PLANS.map((p) => ({ ...p }))
  if (cloud && Array.isArray(cloud.plans)) {
    for (const saved of cloud.plans) {
      const p = plans.find((x) => x.key === saved.key)
      if (!p) continue
      p.totalUnits = saved.totalUnits ?? p.totalUnits
      p.dailyQuota = saved.dailyQuota ?? p.dailyQuota
      p.estMinutes = saved.estMinutes ?? p.estMinutes
      p.completedUnits = saved.completedUnits ?? p.completedUnits
      p.startDate = saved.startDate ?? p.startDate
      p.targetDate = saved.targetDate ?? p.targetDate
      p.active = saved.active ?? p.active
    }
  }
  return plans
}

// ---------- 生成指定日期的任务清单（移植自 generateSnapshot） ----------
function generateSnapshot(plans, forDate) {
  const items = []
  const active = plans.filter((p) => p.active)
  const countOf = {}
  const backlogOf = {}
  let totalMinutes = 0

  for (const plan of active) {
    const remaining = plan.totalUnits - plan.completedUnits
    if (remaining <= 0) { countOf[plan.key] = 0; continue }
    const base = Math.min(plan.dailyQuota, remaining)
    countOf[plan.key] = base
    totalMinutes += base * plan.estMinutes
    const elapsed = Math.max(0, daysBetween(plan.startDate, forDate) + 1)
    const expected = Math.min(plan.totalUnits, elapsed * plan.dailyQuota)
    backlogOf[plan.key] = Math.max(0, expected - plan.completedUnits)
  }

  let added = true
  while (totalMinutes < DAILY_TIME_BUDGET && added) {
    added = false
    for (const plan of active) {
      if (totalMinutes >= DAILY_TIME_BUDGET) break
      const current = countOf[plan.key] || 0
      const remaining = plan.totalUnits - plan.completedUnits
      if (current >= MAX_PER_SUBJECT_PER_DAY || current >= (backlogOf[plan.key] || 0) || current >= remaining) continue
      if (totalMinutes + plan.estMinutes > DAILY_TIME_BUDGET) continue
      countOf[plan.key] = current + 1
      totalMinutes += plan.estMinutes
      added = true
    }
  }

  for (const plan of plans) {
    const count = countOf[plan.key] || 0
    for (let i = 0; i < count; i++) {
      const unitIndex = plan.completedUnits + i + 1
      items.push({
        subject: plan.key,
        subjectName: plan.name,
        icon: plan.icon,
        estMinutes: plan.estMinutes,
        title: unitLabels[plan.key](unitIndex),
        unitIndex
      })
    }
  }
  return { items, backlogOf }
}

// ---------- 进度条 ----------
function bar(done, total, width = 10) {
  const ratio = total > 0 ? done / total : 0
  const filled = Math.round(ratio * width)
  return '█'.repeat(filled) + '░'.repeat(width - filled)
}
const fmtMin = (m) => (m >= 60 ? `${Math.floor(m / 60)}小时${m % 60 ? m % 60 + '分' : ''}` : `${m}分钟`)
const fmtDateCN = (d) => `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
const shortDate = (s) => { const d = new Date(s); return `${d.getMonth() + 1}月${d.getDate()}日` }

// ---------- 打卡连续天数（从最近一次有完成的日期往前数连续天数） ----------
function computeStreak(dailyRecords) {
  if (!dailyRecords) return { streak: 0, lastDate: null, lastCount: 0 }
  const dates = Object.keys(dailyRecords)
    .filter((d) => (dailyRecords[d] && dailyRecords[d].completedCount || 0) >= 1)
    .sort()
    .reverse()
  if (!dates.length) return { streak: 0, lastDate: null, lastCount: 0 }
  let streak = 1
  for (let i = 0; i < dates.length - 1; i++) {
    const diff = Math.round((new Date(dates[i]) - new Date(dates[i + 1])) / 86400000)
    if (diff === 1) streak++
    else break
  }
  return { streak, lastDate: dates[0], lastCount: dailyRecords[dates[0]].completedCount }
}

// ---------- 鼓励语 ----------
const QUOTES = [
  '今天的努力，是明天上岸的底气。早点休息，明天全力出击！',
  '坚持本身就是一种天赋，你已经在超越大多数人的路上。',
  '别和别人比进度，昨天的你才是唯一的对手。',
  '考研是一场马拉松，稳住节奏，终点线就在眼前。',
  '把每一个单元吃透，分数自然会站在你这边。',
  '休息好才能学得好，今晚好好睡，明天精神满满！'
]

// ---------- 主流程 ----------
async function main() {
  const env = loadEnv()
  const now = new Date()
  // 目标日期：中午之后算"明天"，凌晨/上午算"今天"
  const target = new Date(now)
  if (now.getHours() >= 12) target.setDate(target.getDate() + 1)
  const forDate = toStr(target)

  let cloud = null
  try {
    cloud = await fetchCloudState(env)
  } catch (e) {
    console.error(`⚠️ 云端读取失败（${e.message}），将使用内置默认进度。`)
  }

  const plans = mergePlans(cloud)
  const examDate = (cloud && cloud.examDate) ? cloud.examDate : DEFAULT_EXAM_DATE
  const { items, backlogOf } = generateSnapshot(plans, forDate)
  const streakInfo = computeStreak(cloud && cloud.dailyRecords)

  const todayS = toStr(now)
  const daysLeft = Math.max(0, daysBetween(todayS, examDate))
  const totalMin = items.reduce((s, t) => s + t.estMinutes, 0)
  const DIV = '━━━━━━━━━━━━━━━━━━━━'
  const sub = '────────────────────'

  const L = []
  // 头部
  L.push('🌙 明日学习计划')
  L.push(`📅 ${fmtDateCN(target)} · ${WEEK[target.getDay()]}`)
  L.push(DIV)
  L.push('')
  // 倒计时
  L.push(`⏳ 距考研初试还有 ${daysLeft} 天`)
  const targetLine = plans
    .filter((p) => p.active)
    .map((p) => `${p.icon}${Math.max(0, daysBetween(todayS, p.targetDate))}天`)
    .join(' · ')
  L.push(`🎯 距各科目标日：${targetLine}`)
  L.push('')
  // 任务清单
  L.push(`📋 明日任务 · 共 ${items.length} 项 · 约 ${fmtMin(totalMin)}`)
  L.push(sub)
  if (items.length === 0) {
    L.push('🎉 所有科目都已完成，明天用来复盘和休整吧！')
  } else {
    const bySubject = {}
    for (const t of items) (bySubject[t.subject] ||= []).push(t)
    for (const plan of plans) {
      const list = bySubject[plan.key]
      if (!list) continue
      const subjMin = list.reduce((s, t) => s + t.estMinutes, 0)
      L.push(`${plan.icon} ${plan.name} · 约${fmtMin(subjMin)}`)
      list.forEach((t) => L.push(`   ☐ ${t.title}`))
    }
  }
  L.push('')
  // 各科进度
  L.push('📊 各科进度')
  L.push(sub)
  for (const plan of plans.filter((p) => p.active)) {
    const pct = plan.totalUnits > 0 ? Math.round((plan.completedUnits / plan.totalUnits) * 100) : 0
    L.push(`${plan.icon} ${plan.name.padEnd(6, ' ')} ${bar(plan.completedUnits, plan.totalUnits)} ${plan.completedUnits}/${plan.totalUnits} · ${pct}%`)
  }
  L.push('')
  // 你的坚持（打卡情况）
  L.push('🔁 你的坚持')
  L.push(sub)
  if (streakInfo.streak > 0) {
    L.push(`🔥 连续打卡 ${streakInfo.streak} 天 · 最近完成 ${streakInfo.lastCount} 项（${shortDate(streakInfo.lastDate)}）`)
  } else {
    L.push('🌱 还没有打卡记录，从明天开始点亮你的坚持吧！')
  }
  // 欠账提醒
  const backlogNotes = plans
    .filter((p) => p.active && (backlogOf[p.key] || 0) > 0)
    .map((p) => `${p.name}落后约 ${backlogOf[p.key]} 个单元`)
  if (backlogNotes.length) {
    L.push('')
    L.push('💡 欠账提醒')
    L.push(sub)
    L.push(backlogNotes.join('，') + '，量力补上，别堆到最后～')
  }
  L.push('')
  // 鼓励 + 晚安
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)]
  L.push(`🔥 ${quote}`)
  L.push('😴 早点休息，明天见！')

  console.log(L.join('\n'))
}

main().catch((e) => {
  console.error('生成计划时出错：', e.message)
  process.exit(1)
})
