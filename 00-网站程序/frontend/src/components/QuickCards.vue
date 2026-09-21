<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { QUICK_CARDS, type QuickSubjectKey } from '@/data/quickCardsData'

const STORAGE_KEY = 'quick-cards-mastered-v2'

const subject = ref<QuickSubjectKey>('higher')
const activeChapter = ref(0)
const flipped = ref<Set<string>>(new Set())
const mastered = ref<Set<string>>(new Set())

const chapters = computed(() => QUICK_CARDS[subject.value].chapters)
const currentChapter = computed(() => chapters.value[activeChapter.value])

// ---------- LaTeX 渲染 ----------
function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * 把卡片文本渲染为 HTML：
 * - $$...$$ → KaTeX 块级公式
 * - $...$   → KaTeX 行内公式
 * - 其余文本转义后 \n → <br>
 */
function texify(text: string): string {
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g)
  const html = parts.map(part => {
    if (part.startsWith('$$') && part.endsWith('$$') && part.length > 4) {
      try {
        return katex.renderToString(part.slice(2, -2), { displayMode: true, throwOnError: false, strict: false })
      } catch {
        return escapeHtml(part)
      }
    }
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      try {
        return katex.renderToString(part.slice(1, -1), { displayMode: false, throwOnError: false, strict: false })
      } catch {
        return escapeHtml(part)
      }
    }
    return escapeHtml(part)
  }).join('')
  return html.replace(/\n/g, '<br>')
}

// ---------- 考频 / 标签 辅助 ----------
function starText(s?: number): string {
  return s === 3 ? '★★★' : s === 2 ? '★★' : ''
}
const TAG_CLASS: Record<string, string> = {
  '公式': 'tag-formula', '概念': 'tag-concept', '方法': 'tag-method', '易错': 'tag-trap',
}
function tagClass(t?: string): string {
  return TAG_CLASS[t || ''] || 'tag-formula'
}

// ---------- 持久化 ----------
function loadMastered() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) mastered.value = new Set(JSON.parse(saved) as string[])
  } catch {
    mastered.value = new Set()
  }
}

function saveMastered() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(mastered.value)))
}

// ---------- 交互 ----------
function switchSubject(key: QuickSubjectKey) {
  subject.value = key
  activeChapter.value = 0
  flipped.value = new Set()
}

function selectChapter(index: number) {
  activeChapter.value = index
  flipped.value = new Set()
}

function flip(id: string) {
  const next = new Set(flipped.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  flipped.value = next
}

function isFlipped(id: string) {
  return flipped.value.has(id)
}

function isMastered(id: string) {
  return mastered.value.has(id)
}

function toggleMastered(id: string, event: Event) {
  event.stopPropagation()
  const next = new Set(mastered.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  mastered.value = next
  saveMastered()
}

function chapterMasteredCount(index: number) {
  const ch = chapters.value[index]
  return ch.cards.filter(c => mastered.value.has(c.id)).length
}

const subjectTotal = computed(() =>
  chapters.value.reduce((s, ch) => s + ch.cards.length, 0)
)
const subjectMastered = computed(() =>
  chapters.value.reduce((s, ch) => s + ch.cards.filter(c => mastered.value.has(c.id)).length, 0)
)

// 环形进度：半径 15，周长 ≈ 94.25
const RING_C = 94.25
const ringDash = computed(() =>
  subjectTotal.value
    ? ((subjectMastered.value / subjectTotal.value) * RING_C).toFixed(1)
    : '0'
)
const subjectPct = computed(() =>
  subjectTotal.value ? Math.round((subjectMastered.value / subjectTotal.value) * 100) : 0
)
// 本章高频星数（★★★ / ★★）
function chapterStarCount(index: number, n: number) {
  const ch = chapters.value[index]
  return ch ? ch.cards.filter(c => c.star === n).length : 0
}

onMounted(loadMastered)
</script>

<template>
  <div class="quick-cards" :class="'subj-' + subject">
    <!-- 科目切换 -->
    <div class="subject-switch">
      <button
        v-for="(meta, key) in QUICK_CARDS"
        :key="key"
        class="subject-btn"
        :class="{ active: subject === key }"
        @click="switchSubject(key as QuickSubjectKey)"
      >
        <span class="subject-icon">{{ meta.icon }}</span>
        <span class="subject-name">{{ meta.name }}</span>
      </button>
    </div>

    <!-- 章节选择（知识链排列） -->
    <div class="chapter-scroll">
      <button
        v-for="(ch, index) in chapters"
        :key="ch.id"
        class="chapter-chip"
        :class="{ active: activeChapter === index }"
        @click="selectChapter(index)"
      >
        <span class="chapter-short">{{ ch.title.replace(/^第\d+章\s*/, '') }}</span>
        <span class="chapter-progress">
          <i class="dot dot-done"></i>{{ chapterMasteredCount(index) }}/{{ ch.cards.length }}
          <i v-if="chapterStarCount(index, 3)" class="dot dot-star">★{{ chapterStarCount(index, 3) }}</i>
        </span>
      </button>
    </div>

    <!-- 当前章节标题 + 本科总进度 -->
    <div class="chapter-head">
      <div class="chapter-title-wrap">
        <span class="chapter-kicker">当前章节</span>
        <div class="chapter-title">{{ currentChapter.title }}</div>
      </div>
      <div class="subject-progress">
        <svg class="ring" viewBox="0 0 36 36" aria-hidden="true">
          <circle class="ring-bg" cx="18" cy="18" r="15" />
          <circle
            class="ring-fg"
            cx="18" cy="18" r="15"
            :stroke-dasharray="ringDash + ' ' + RING_C"
          />
        </svg>
        <div class="sp-text">
          <span class="sp-num">{{ subjectMastered }}<em>/{{ subjectTotal }}</em></span>
          <span class="sp-label">已掌握 · {{ subjectPct }}%</span>
        </div>
      </div>
    </div>

    <!-- 翻转卡片 -->
    <div class="cards-grid">
      <div
        v-for="card in currentChapter.cards"
        :key="card.id"
        class="flip-card"
        :class="{ flipped: isFlipped(card.id), mastered: isMastered(card.id), 'has-star': !!card.star }"
        @click="flip(card.id)"
      >
        <div class="flip-inner">
          <!-- 正面：自测问题 -->
          <div class="flip-face flip-front">
            <div class="face-top">
              <span class="face-tag">❓ 自测</span>
              <span class="face-badges">
                <span v-if="card.tag" class="tag-pill" :class="tagClass(card.tag)">{{ card.tag }}</span>
                <span v-if="card.star" class="star-badge" :class="'star-' + card.star">{{ starText(card.star) }}</span>
              </span>
            </div>
            <div class="face-content front-content" v-html="texify(card.front)"></div>
            <div class="face-hint">点击翻面看答案</div>
          </div>
          <!-- 背面：核心公式/定理 -->
          <div class="flip-face flip-back">
            <div class="face-top">
              <span class="face-tag back-tag">📌 核心结论</span>
              <span v-if="card.star" class="star-badge" :class="'star-' + card.star">{{ starText(card.star) }}</span>
            </div>
            <div class="face-content back-content" v-html="texify(card.back)"></div>
            <button
              class="master-btn"
              :class="{ on: isMastered(card.id) }"
              @click="toggleMastered(card.id, $event)"
            >
              {{ isMastered(card.id) ? '✓ 已掌握' : '标记掌握' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="cards-tip">
      💡 先遮住背面自测，翻面核对后点击「标记掌握」。带 <span class="inline-star">★★★ / ★★</span>
      的是背诵清单里的必背默写 / 高频点，优先攻克；已掌握的卡片会转绿，进度自动保存在本机。
    </div>
  </div>
</template>

<style scoped>
.quick-cards {
  /* 作战室配色 token */
  --ink: #14233a;
  --body: #2c3e50;
  --navy: #16345c;
  --navy-deep: #0d2137;
  --navy-light: #1e4576;
  --gold: #d4a012;
  --gold-light: #ffc53d;
  --gold-soft: rgba(212, 160, 18, 0.12);
  --line: #dbe4ef;
  --bg-soft: #f4f7fb;
  --green: #2f9e5f;
  /* 每科一个强调色 */
  --accent: #16345c;
  --accent-2: #1e4576;

  display: flex;
  flex-direction: column;
  gap: 18px;
  font-family: 'FZCuHei', '方正粗黑_GBK', 'Microsoft YaHei', sans-serif;
  color: var(--body);
}
.quick-cards.subj-higher { --accent: #16345c; --accent-2: #2b6cb0; }
.quick-cards.subj-linear { --accent: #5b3a8e; --accent-2: #8250c8; }
.quick-cards.subj-gailv  { --accent: #0f6b63; --accent-2: #17a08f; }

/* ---------- 科目切换 ---------- */
.subject-switch {
  display: flex;
  gap: 12px;
}
.subject-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px 12px;
  border: 2px solid var(--line);
  border-radius: 14px;
  background: #fff;
  color: var(--body);
  cursor: pointer;
  transition: all 0.22s ease;
  font-family: inherit;
}
.subject-btn:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(22, 52, 92, 0.08);
}
.subject-btn.active {
  border-color: transparent;
  background: linear-gradient(150deg, var(--accent) 0%, var(--accent-2) 100%);
  box-shadow: 0 10px 26px rgba(22, 52, 92, 0.22);
}
.subject-icon { font-size: 1.5em; line-height: 1; }
.subject-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--navy);
  letter-spacing: 0.04em;
}
.subject-btn.active .subject-name { color: #fff; }

/* ---------- 章节选择 ---------- */
.chapter-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 8px;
}
.chapter-chip {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 11px 16px;
  border: 1.5px solid var(--line);
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}
.chapter-chip:hover { border-color: var(--accent); }
.chapter-chip.active {
  border-color: var(--accent);
  background: linear-gradient(180deg, rgba(22, 52, 92, 0.04), rgba(22, 52, 92, 0.09));
  box-shadow: inset 0 -3px 0 var(--accent);
}
.chapter-short {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--ink);
  white-space: nowrap;
}
.chapter-progress {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.82rem;
  color: var(--green);
  font-weight: 700;
}
.dot { font-style: normal; }
.dot-star { color: var(--gold); margin-left: 4px; }

/* ---------- 章节标题 + 进度环 ---------- */
.chapter-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 4px 2px;
}
.chapter-kicker {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--gold);
  text-transform: uppercase;
}
.chapter-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--navy);
  letter-spacing: 0.02em;
}
.subject-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}
.ring { width: 52px; height: 52px; transform: rotate(-90deg); }
.ring circle { fill: none; stroke-width: 3.5; stroke-linecap: round; }
.ring-bg { stroke: var(--line); }
.ring-fg { stroke: var(--gold); transition: stroke-dasharray 0.5s ease; }
.sp-text { display: flex; flex-direction: column; line-height: 1.15; }
.sp-num { font-size: 1.4rem; font-weight: 700; color: var(--navy); }
.sp-num em { font-size: 0.95rem; font-style: normal; color: #8494a7; font-weight: 600; }
.sp-label { font-size: 0.82rem; color: #6b7c92; font-weight: 600; }

/* ---------- 翻转卡片 ---------- */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 18px;
}

.flip-card {
  perspective: 1400px;
  height: 300px;
  cursor: pointer;
}
.flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.55s cubic-bezier(0.4, 0.1, 0.2, 1);
}
.flip-card.flipped .flip-inner { transform: rotateY(180deg); }

.flip-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 16px;
  padding: 18px 18px 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 16px rgba(22, 52, 92, 0.08);
  overflow: hidden;
}
.flip-front {
  background: linear-gradient(155deg, #ffffff 0%, #eef4fb 100%);
  border: 2px solid #d7e4f4;
  border-top: 4px solid var(--accent);
}
.flip-back {
  background: linear-gradient(155deg, #fffdf5 0%, #fff2cf 100%);
  border: 2px solid #ffe082;
  border-top: 4px solid var(--gold);
  transform: rotateY(180deg);
}
.flip-card.mastered .flip-front {
  border-top-color: var(--green);
  background: linear-gradient(155deg, #ffffff 0%, #eef8ec 100%);
  border-color: #b7e3a5;
}
.flip-card.mastered .flip-back {
  border-top-color: var(--green);
  background: linear-gradient(155deg, #f4fbf1 0%, #e3f4da 100%);
  border-color: #b7e3a5;
}

.face-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
  flex-shrink: 0;
}
.face-badges { display: flex; align-items: center; gap: 8px; }
.face-tag {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--navy);
  letter-spacing: 0.03em;
}
.back-tag { color: #b7791f; }

/* 考频星徽 */
.star-badge {
  font-size: 0.86rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #8a6d0b;
  background: linear-gradient(135deg, #fff2c2, #ffdf80);
  border: 1px solid #f0c93f;
  border-radius: 999px;
  padding: 2px 9px;
  line-height: 1.5;
  box-shadow: 0 2px 6px var(--gold-soft);
}
.star-badge.star-3 { color: #7a4d00; background: linear-gradient(135deg, #ffe08a, #ffc53d); }
.star-badge.star-2 { color: #6b5a1a; background: linear-gradient(135deg, #fff3cf, #ffe08a); }

/* 内容类型标签 */
.tag-pill {
  font-size: 0.78rem;
  font-weight: 700;
  border-radius: 999px;
  padding: 2px 10px;
  line-height: 1.6;
  border: 1px solid transparent;
}
.tag-formula { color: #0f3f74; background: #e1edfb; border-color: #bcd6f2; }
.tag-concept { color: #1f6b3a; background: #e2f6e8; border-color: #b7e3a5; }
.tag-method  { color: #5b3a8e; background: #ece4f8; border-color: #d3c0ee; }
.tag-trap    { color: #9c2b2b; background: #fde6e6; border-color: #f4bcbc; }

.face-content {
  flex: 1;
  overflow-y: auto;
  color: var(--ink);
  line-height: 1.75;
}
.front-content {
  font-size: 1.28rem;
  font-weight: 700;
  display: flex;
  align-items: center;
}
.back-content { font-size: 1.15rem; }
.back-content :deep(.katex-display) {
  margin: 0.45em 0;
  overflow-x: auto;
  overflow-y: hidden;
}
.back-content :deep(.katex) { font-size: 1.16em; }
.front-content :deep(.katex) { font-size: 1.15em; }

.face-hint {
  font-size: 0.8rem;
  color: var(--navy);
  opacity: 0.5;
  text-align: center;
  margin-top: 8px;
  flex-shrink: 0;
}

.master-btn {
  margin-top: 12px;
  padding: 9px;
  border: 1.5px solid var(--gold);
  border-radius: 10px;
  background: #fff;
  color: #b7791f;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  font-family: inherit;
}
.master-btn:hover { background: #fff7e6; }
.master-btn.on {
  background: var(--green);
  border-color: var(--green);
  color: #fff;
}

.cards-tip {
  background: linear-gradient(135deg, #fffdf5 0%, #fff4d6 100%);
  border: 1px solid #ffd66b;
  border-left: 4px solid var(--gold);
  border-radius: 12px;
  padding: 12px 16px;
  color: var(--body);
  font-size: 1.02rem;
  line-height: 1.7;
}
.inline-star { color: var(--gold); font-weight: 800; }

@media (max-width: 600px) {
  .cards-grid { grid-template-columns: 1fr; }
  .flip-card { height: 320px; }
  .subject-btn { padding: 12px 6px; gap: 6px; }
  .subject-name { font-size: 1.05rem; }
  .subject-icon { font-size: 1.25em; }
  .chapter-title { font-size: 1.25rem; }
  .front-content { font-size: 1.2rem; }
  .back-content { font-size: 1.1rem; }
}
</style>
