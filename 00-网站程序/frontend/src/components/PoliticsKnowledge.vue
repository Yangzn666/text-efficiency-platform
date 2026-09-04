<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import MarkdownIt from 'markdown-it'

interface Section {
  id: string
  name: string
  short: string
  icon: string
  file: string
  blurb: string
}

const SECTIONS: Section[] = [
  { id: 'marxism', name: '第一篇 马克思主义基本原理', short: '马原', icon: '🔴', file: 'marxism', blurb: '哲学重理解 · 政经重记忆 · 科社重框架 · 34题主阵地' },
  { id: 'maozhongte', name: '第二篇 毛泽东思想和中国特色社会主义理论体系概论', short: '毛中特', icon: '', file: 'mao-zhong-te', blurb: '新民主主义革命 · 社会主义改造 · 邓/三/科' },
  { id: 'xin-sixiang', name: '第三篇 习近平新时代中国特色社会主义思想概论', short: '新思想', icon: '⭐', file: 'xin-sixiang', blurb: '分值最高 · 时政强关联 · 中国式现代化 · 35题方向' },
  { id: 'history', name: '第四篇 中国近现代史纲要', short: '史纲', icon: '', file: 'modern-history', blurb: '时间轴记忆 · 重大事件意义 · 36题素材库' },
  { id: 'ethics', name: '第五篇 思想道德与法治', short: '思修法基', icon: '🧭', file: 'ethics-law', blurb: '贴近生活 · 记忆为主 · 性价比之王 · 37题方向' }
]

const md = new MarkdownIt({ html: false, linkify: true })

const activeId = ref('marxism')
const activeSection = computed(() => SECTIONS.find(s => s.id === activeId.value)!)
const rendered = ref('')
const loading = ref(false)
const cache = new Map<string, string>()

const loadSection = async (id: string) => {
  activeId.value = id
  const section = SECTIONS.find(s => s.id === id)!
  if (cache.has(id)) {
    rendered.value = cache.get(id)!
    return
  }
  loading.value = true
  try {
    const res = await fetch(`/data/politics/${section.file}.md`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const text = await res.text()
    const html = md.render(text)
    cache.set(id, html)
    rendered.value = html
  } catch (e) {
    rendered.value = '<blockquote>⚠️ 内容加载失败，请刷新页面重试。</blockquote>'
  } finally {
    loading.value = false
  }
}

onMounted(() => loadSection('marxism'))
</script>

<template>
  <div class="pk-wrap">
    <aside class="pk-nav">
      <div class="pk-nav-head">
        <span class="pk-nav-kicker">KNOWLEDGE MAP</span>
        <strong>五大篇导航</strong>
      </div>
      <button
        v-for="s in SECTIONS"
        :key="s.id"
        class="pk-nav-item"
        :class="{ active: s.id === activeId }"
        @click="loadSection(s.id)"
      >
        <span class="pk-nav-icon">{{ s.icon }}</span>
        <span class="pk-nav-text">
          <strong>{{ s.name }}</strong>
          <em>{{ s.blurb }}</em>
        </span>
      </button>
    </aside>

    <div class="pk-body">
      <div class="pk-body-head">
        <span class="pk-badge">{{ activeSection.icon }} {{ activeSection.short }}</span>
        <span class="pk-head-title">{{ activeSection.name }}</span>
      </div>
      <div v-if="loading" class="pk-loading">正在加载知识框架…</div>
      <article v-else class="pk-md" v-html="rendered"></article>
    </div>
  </div>
</template>

<style scoped>
.pk-wrap {
  --ink: #1f2d3d;
  --body: #303133;
  --gold: #ffc53d;
  --navy-deep: #0d2137;
  --navy: #16345c;
  --line: #e4ebf3;
  --bg-soft: #f5f8fc;
  --subject: #f56c6c;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  align-items: start;
}

/* ── 左侧导航 ─────────────────────── */
.pk-nav {
  position: sticky;
  top: 16px;
  background: linear-gradient(160deg, var(--navy-deep) 0%, var(--navy) 100%);
  border-radius: 14px;
  padding: 18px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pk-nav-head {
  padding: 2px 8px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  margin-bottom: 6px;
}

.pk-nav-kicker {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  letter-spacing: 0.22em;
  color: var(--gold);
  text-transform: uppercase;
}

.pk-nav-head strong {
  color: #fff;
  font-size: 1.02rem;
  letter-spacing: 0.06em;
}

.pk-nav-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 12px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: all 0.25s ease;
}

.pk-nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(3px);
}

.pk-nav-item.active {
  background: rgba(245, 108, 108, 0.16);
  border-color: rgba(245, 108, 108, 0.55);
  box-shadow: 0 0 16px rgba(245, 108, 108, 0.18);
}

.pk-nav-icon {
  font-size: 1.3rem;
  line-height: 1.3;
  flex-shrink: 0;
}

.pk-nav-text strong {
  display: block;
  color: #fff;
  font-size: 0.92rem;
  letter-spacing: 0.02em;
}

.pk-nav-item.active .pk-nav-text strong {
  color: var(--gold);
}

.pk-nav-text em {
  display: block;
  font-style: normal;
  color: #93aac5;
  font-size: 0.72rem;
  margin-top: 3px;
  line-height: 1.5;
}

/* ── 右侧内容 ─────────────────────── */
.pk-body {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 26px 30px;
  min-height: 480px;
}

.pk-body-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 2px solid var(--bg-soft);
  margin-bottom: 18px;
}

.pk-badge {
  background: linear-gradient(135deg, var(--subject), #d94848);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 5px 14px;
  border-radius: 999px;
  letter-spacing: 0.05em;
  box-shadow: 0 3px 10px rgba(245, 108, 108, 0.3);
  white-space: nowrap;
}

.pk-head-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: 0.02em;
}

.pk-loading {
  color: var(--navy);
  font-size: 0.95rem;
  padding: 40px 0;
  text-align: center;
}

/* ── Markdown 渲染样式（作战室规范）──── */
.pk-md {
  color: var(--body);
  font-size: 0.95rem;
  line-height: 1.85;
}

.pk-md :deep(h1) {
  font-size: 1.4rem;
  color: var(--ink);
  margin: 0 0 14px;
  padding-left: 14px;
  border-left: 5px solid var(--subject);
  letter-spacing: 0.02em;
}

.pk-md :deep(h2) {
  font-size: 1.12rem;
  color: var(--navy);
  margin: 26px 0 12px;
  padding: 8px 14px;
  background: linear-gradient(90deg, var(--bg-soft), transparent);
  border-radius: 8px 0 0 8px;
  border-left: 4px solid var(--gold);
}

.pk-md :deep(h3) {
  font-size: 1rem;
  color: var(--ink);
  margin: 18px 0 8px;
}

.pk-md :deep(blockquote) {
  margin: 14px 0;
  padding: 12px 18px;
  background: #fff8ec;
  border-left: 4px solid var(--gold);
  border-radius: 0 10px 10px 0;
  color: #7a5c10;
}

.pk-md :deep(ul), .pk-md :deep(ol) {
  padding-left: 24px;
  margin: 8px 0;
}

.pk-md :deep(li) {
  margin: 5px 0;
}

.pk-md :deep(strong) {
  color: var(--subject);
}

.pk-md :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 14px 0;
  font-size: 0.88rem;
}

.pk-md :deep(th) {
  background: var(--navy);
  color: var(--gold);
  padding: 9px 12px;
  text-align: left;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.pk-md :deep(td) {
  padding: 9px 12px;
  border-bottom: 1px solid var(--line);
}

.pk-md :deep(tr:nth-child(even) td) {
  background: var(--bg-soft);
}

.pk-md :deep(hr) {
  border: none;
  border-top: 1px dashed var(--line);
  margin: 20px 0;
}

/* ── 响应式 ───────────────────────── */
@media (max-width: 960px) {
  .pk-wrap {
    grid-template-columns: 1fr;
  }
  .pk-nav {
    position: static;
  }
  .pk-body {
    padding: 18px 16px;
  }
}
</style>
