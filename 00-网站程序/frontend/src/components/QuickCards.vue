<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { QUICK_CARDS, type QuickSubjectKey } from '@/data/quickCardsData'

const STORAGE_KEY = 'quick-cards-mastered-v1'

const subject = ref<QuickSubjectKey>('higher')
const activeChapter = ref(0)
const flipped = ref<Set<string>>(new Set())
const mastered = ref<Set<string>>(new Set())

const chapters = computed(() => QUICK_CARDS[subject.value].chapters)
const currentChapter = computed(() => chapters.value[activeChapter.value])

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

onMounted(loadMastered)
</script>

<template>
  <div class="quick-cards">
    <!-- 科目切换 -->
    <div class="subject-switch">
      <button
        v-for="(meta, key) in QUICK_CARDS"
        :key="key"
        class="subject-btn"
        :class="{ active: subject === key }"
        @click="switchSubject(key as QuickSubjectKey)"
      >
        {{ meta.icon }} {{ meta.name }}
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
        <span class="chapter-progress">{{ chapterMasteredCount(index) }}/{{ ch.cards.length }}</span>
      </button>
    </div>

    <div class="chapter-title">{{ currentChapter.title }}</div>

    <!-- 翻转卡片 -->
    <div class="cards-grid">
      <div
        v-for="card in currentChapter.cards"
        :key="card.id"
        class="flip-card"
        :class="{ flipped: isFlipped(card.id), mastered: isMastered(card.id) }"
        @click="flip(card.id)"
      >
        <div class="flip-inner">
          <!-- 正面：自测问题 -->
          <div class="flip-face flip-front">
            <div class="face-tag">❓ 自测</div>
            <div class="face-content front-content">{{ card.front }}</div>
            <div class="face-hint">点击翻面看答案</div>
          </div>
          <!-- 背面：核心公式/定理 -->
          <div class="flip-face flip-back">
            <div class="face-tag back-tag">📌 核心结论</div>
            <div class="face-content back-content">{{ card.back }}</div>
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
      💡 先遮住背面自测，翻面核对后点击「标记掌握」。已掌握的卡片会标绿。
    </div>
  </div>
</template>

<style scoped>
.quick-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.subject-switch {
  display: flex;
  gap: 10px;
}
.subject-btn {
  flex: 1;
  padding: 12px;
  border: 2px solid #ebeef5;
  border-radius: 12px;
  background: #fff;
  color: #303133;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.subject-btn.active {
  border-color: #ffc53d;
  background: #fff8e6;
  color: #16345c;
}

.chapter-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 6px;
}
.chapter-chip {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 14px;
  border: 1px solid #dcdfe6;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}
.chapter-chip.active {
  border-color: #ffc53d;
  background: #fff8e6;
}
.chapter-short {
  font-size: 0.85em;
  font-weight: 600;
  color: #303133;
  white-space: nowrap;
}
.chapter-progress {
  font-size: 0.72em;
  color: #67c23a;
}

.chapter-title {
  font-size: 1.15em;
  font-weight: 700;
  color: #16345c;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.flip-card {
  perspective: 1000px;
  height: 220px;
  cursor: pointer;
}
.flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.5s;
}
.flip-card.flipped .flip-inner {
  transform: rotateY(180deg);
}

.flip-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
}
.flip-front {
  background: linear-gradient(135deg, #ffffff 0%, #f5f8fc 100%);
  border: 2px solid #dbe7f5;
}
.flip-back {
  background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
  border: 2px solid #ffe082;
  transform: rotateY(180deg);
}
.flip-card.mastered .flip-front {
  border-color: #95d475;
  background: linear-gradient(135deg, #ffffff 0%, #f0f9eb 100%);
}
.flip-card.mastered .flip-back {
  border-color: #95d475;
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
}

.face-tag {
  font-size: 0.75em;
  font-weight: 700;
  color: #16345c;
  margin-bottom: 8px;
}
.back-tag {
  color: #e6a23c;
}
.face-content {
  flex: 1;
  overflow-y: auto;
  color: #303133;
  line-height: 1.6;
  white-space: pre-wrap;
}
.front-content {
  font-size: 1em;
  font-weight: 600;
  display: flex;
  align-items: center;
}
.back-content {
  font-size: 0.85em;
}
.face-hint {
  font-size: 0.72em;
  color: #303133;
  opacity: 0.5;
  text-align: center;
  margin-top: 8px;
}

.master-btn {
  margin-top: 10px;
  padding: 7px;
  border: 1px solid #e6a23c;
  border-radius: 8px;
  background: #fff;
  color: #e6a23c;
  font-size: 0.82em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.master-btn.on {
  background: #67c23a;
  border-color: #67c23a;
  color: #fff;
}

.cards-tip {
  background: #fff8e6;
  border: 1px solid #ffd66b;
  border-radius: 10px;
  padding: 10px 14px;
  color: #303133;
  font-size: 0.85em;
}

@media (max-width: 600px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
  .flip-card {
    height: 240px;
  }
}
</style>
