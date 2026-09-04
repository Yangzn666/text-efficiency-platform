<script setup lang="ts">
import { CS408_TOPIC_GUIDES, type Cs408TopicGuide } from '@/data/cs408TopicGuides'

const guides = CS408_TOPIC_GUIDES

// ===== 码砖（codebrick）真题跳转 =====
const BRICK_BASE = 'https://www.codebrick.tech/practice/browse'
const SUBJECT_NAMES: Record<string, string> = { ds: '数据结构', co: '组成原理', os: '操作系统', cn: '计算机网络' }
const BRICK_YEARS = Array.from({ length: 18 }, (_, i) => 2009 + i) // 2009-2026

const brickYearUrl = (subject: string, year: number) => `${BRICK_BASE}/${subject}/year/${year}`
const brickBrowseUrl = (subject: string) => `${BRICK_BASE}/${subject}`

// 将要点文本中的真题年份（2009-2026）自动转成码砖真题跳转链接，其余文本原样转义输出
const renderPoint = (text: string, subject: string) => {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return escaped.replace(/\b(20(09|1\d|2[0-6]))\b/g, (y) =>
    `<a class="year-link" href="${brickYearUrl(subject, Number(y))}" target="_blank" rel="noopener" title="在码砖查看${y}年${SUBJECT_NAMES[subject]}真题">${y}<span class="yl-arrow">↗</span></a>`
  )
}
const subjectName = (g: Cs408TopicGuide) => SUBJECT_NAMES[g.subject] || '408'
</script>

<template>
  <div class="cs408-guide-container">
    <section v-for="g in guides" :key="g.id" class="guide-card">
      <div class="card-head">
        <h2>{{ g.head }}</h2>
        <span class="head-note">{{ g.note }}</span>
      </div>

      <!-- 码砖真题直达 -->
      <div class="brick-bar">
        <div class="brick-bar-head">
          <span class="brick-label">🧱 码砖真题直达</span>
          <a class="brick-entry" :href="brickBrowseUrl(g.subject)" target="_blank" rel="noopener">
            按章节刷{{ subjectName(g) }}真题 ↗
          </a>
        </div>
        <div class="brick-years">
          <a
            v-for="year in BRICK_YEARS"
            :key="year"
            class="brick-year"
            :href="brickYearUrl(g.subject, year)"
            target="_blank"
            rel="noopener"
            :title="`码砖 ${year}年${subjectName(g)}真题`"
          >{{ year }}</a>
        </div>
      </div>

      <div class="guide-intro-wrap">
        <p class="guide-intro">{{ g.intro }}</p>
      </div>
      <div class="guide-list">
        <div v-for="(item, gi) in g.items" :key="gi" class="guide-item">
          <div class="gi-head">
            <span class="gi-icon">{{ item.icon }}</span>
            <strong>{{ item.title }}</strong>
            <span class="gi-tag">{{ item.tag }}</span>
          </div>
          <ul class="gi-points">
            <li v-for="(p, pi) in item.points" :key="pi" v-html="renderPoint(p, g.subject)"></li>
          </ul>
          <div v-if="item.tip" class="gi-tip">⚠️ {{ item.tip }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.cs408-guide-container {
  --ink: #1a2332;
  --body: #2c3e50;
  --gold: #d4a012;
  --gold-light: #f0c040;
  --gold-glow: rgba(212, 160, 18, 0.12);
  --navy-deep: #0a1628;
  --navy: #16345c;
  --navy-light: #1e4576;
  --line: #dce3ed;
  --bg-soft: #f4f7fb;
  --paper: #faf8f4;
  --cream: #f5f0e6;

  padding: 20px 0;
  font-family: 'FZCuHei', '方正粗黑_GBK', 'Microsoft YaHei', sans-serif;
  color: var(--body);
}

/* ── Intro Box ──────────────────────────── */
.guide-intro-box {
  background: linear-gradient(135deg, var(--cream) 0%, var(--paper) 100%);
  border-left: 4px solid var(--gold);
  border-radius: 0 12px 12px 0;
  padding: 18px 22px;
  margin-bottom: 28px;
  position: relative;
}

.guide-intro-box::after {
  content: '';
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  background: radial-gradient(circle, var(--gold-glow) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.guide-intro-text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--navy);
}

/* ── Guide Card ─────────────────────────── */
.guide-card {
  position: relative;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: #fff;
  padding: 28px 28px 24px;
  box-shadow: 0 4px 20px rgba(22, 52, 92, 0.05);
  margin-bottom: 24px;
  transition: box-shadow 0.35s ease;
}

.guide-card:last-child {
  margin-bottom: 0;
}

.guide-card:hover {
  box-shadow: 0 8px 36px rgba(22, 52, 92, 0.1);
}

.card-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line);
}

.card-head h2 {
  margin: 0;
  font-size: 1.28rem;
  color: var(--ink);
  position: relative;
  padding-left: 16px;
  letter-spacing: 0.02em;
}

.card-head h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 3px;
  bottom: 3px;
  width: 5px;
  border-radius: 3px;
  background: linear-gradient(180deg, var(--gold) 0%, var(--gold-light) 100%);
}

.head-note {
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--navy);
  background: linear-gradient(135deg, rgba(22, 52, 92, 0.06), rgba(22, 52, 92, 0.1));
  padding: 5px 14px;
  border-radius: 999px;
  letter-spacing: 0.04em;
  border: 1px solid rgba(22, 52, 92, 0.06);
}

/* ── Intro Wrap (card-level) ────────────── */
.guide-intro-wrap {
  background: var(--bg-soft);
  border-left: 4px solid var(--gold);
  border-radius: 0 10px 10px 0;
  padding: 14px 18px;
  margin-bottom: 20px;
}

.guide-intro {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.8;
  color: var(--navy);
}

/* ── Guide List ─────────────────────────── */
.guide-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.guide-item {
  border: 1px solid var(--line);
  border-left: 4px solid var(--navy);
  border-radius: 12px;
  background: #fff;
  padding: 18px 20px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.guide-item:hover {
  transform: translateX(6px);
  border-left-color: var(--gold);
  box-shadow: 0 4px 18px rgba(22, 52, 92, 0.08);
}

.gi-head {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.gi-icon {
  font-size: 1.35rem;
  line-height: 1.2;
  flex-shrink: 0;
}

.gi-head strong {
  font-size: 1.02rem;
  color: var(--ink);
  letter-spacing: 0.02em;
}

.gi-tag {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--navy);
  background: rgba(22, 52, 92, 0.06);
  padding: 3px 12px;
  border-radius: 999px;
  margin-left: auto;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.gi-points {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.gi-points li {
  position: relative;
  padding: 3px 0 3px 20px;
  font-size: 0.88rem;
  line-height: 1.7;
  color: var(--body);
}

.gi-points li::before {
  content: '';
  position: absolute;
  left: 3px;
  top: 12px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gold);
  box-shadow: 0 0 0 2px var(--gold-glow);
}

.gi-tip {
  margin-top: 12px;
  font-size: 0.84rem;
  line-height: 1.65;
  color: #9a7216;
  background: linear-gradient(135deg, #fffbf0 0%, #fff6e0 100%);
  border-radius: 10px;
  padding: 10px 14px;
  border: 1px solid rgba(212, 160, 18, 0.15);
}

/* ── 码砖真题直达条 ─────────────── */
.brick-bar {
  margin-bottom: 20px;
  border: 1px solid var(--line);
  border-left: 4px solid var(--gold);
  border-radius: 0 12px 12px 0;
  background: linear-gradient(135deg, #fffdf5 0%, #f8fafd 100%);
  padding: 14px 18px;
}

.brick-bar-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.brick-label {
  font-size: 0.86rem;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: 0.04em;
}

.brick-entry {
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%);
  padding: 6px 14px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.25s ease;
  box-shadow: 0 2px 8px rgba(22, 52, 92, 0.2);
}

.brick-entry:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 14px rgba(22, 52, 92, 0.3);
}

.brick-years {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.brick-year {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--navy);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 7px;
  padding: 4px 10px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.brick-year:hover {
  color: #fff;
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px var(--gold-glow);
}

/* ── 要点内联年份链接 ─────────────── */
:deep(.year-link) {
  display: inline-block;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-weight: 700;
  font-size: 0.84em;
  color: var(--navy);
  background: rgba(22, 52, 92, 0.07);
  border-radius: 6px;
  padding: 0 6px;
  margin: 0 2px;
  text-decoration: none;
  transition: all 0.18s ease;
}

:deep(.year-link):hover {
  color: #fff;
  background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%);
}

:deep(.year-link .yl-arrow) {
  font-size: 0.8em;
  margin-left: 2px;
  opacity: 0.75;
}

@media (max-width: 768px) {
  .guide-card { padding: 20px 16px; }
  .card-head h2 { font-size: 1.1rem; }
  .gi-head strong { font-size: 0.95rem; }
  .gi-tag { font-size: 0.65rem; padding: 2px 10px; }
}
</style>
