<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

interface Category { id: string; name: string }
interface Card { id: number; category: string; title: string; front: string; back: string }

type Mastery = 'none' | 'fuzzy' | 'mastered'

const STORAGE_KEY = 'politics-recite-mastery-v1'

const categories = ref<Category[]>([])
const cards = ref<Card[]>([])
const loaded = ref(false)

const activeCategory = ref('all')
const index = ref(0)
const flipped = ref(false)
const mastery = ref<Record<number, Mastery>>({})
const onlyWeak = ref(false)

// ── 数据加载与持久化 ──────────────────────────
const loadMastery = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) mastery.value = JSON.parse(raw)
  } catch { mastery.value = {} }
}

const saveMastery = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mastery.value))
}

onMounted(async () => {
  loadMastery()
  try {
    const res = await fetch('/data/politics/recite-cards.json')
    const data = await res.json()
    categories.value = data.categories
    cards.value = data.cards
    loaded.value = true
  } catch {
    ElMessage.error('背诵卡片数据加载失败，请刷新重试')
  }
})

// ── 卡片过滤与导航 ──────────────────────────
const filtered = computed(() => {
  let list = cards.value
  if (activeCategory.value !== 'all') {
    list = list.filter(c => c.category === activeCategory.value)
  }
  if (onlyWeak.value) {
    list = list.filter(c => (mastery.value[c.id] || 'none') !== 'mastered')
  }
  return list
})

const current = computed<Card | null>(() => filtered.value[index.value] || null)
const categoryName = (id: string) => categories.value.find(c => c.id === id)?.name || id

const stats = computed(() => {
  const pool = activeCategory.value === 'all'
    ? cards.value
    : cards.value.filter(c => c.category === activeCategory.value)
  let mastered = 0, fuzzy = 0, none = 0
  for (const c of pool) {
    const m = mastery.value[c.id] || 'none'
    if (m === 'mastered') mastered++
    else if (m === 'fuzzy') fuzzy++
    else none++
  }
  return { total: pool.length, mastered, fuzzy, none }
})

const clampIndex = () => {
  if (filtered.value.length === 0) { index.value = 0; return }
  if (index.value >= filtered.value.length) index.value = 0
  if (index.value < 0) index.value = filtered.value.length - 1
}

const pickCategory = (id: string) => {
  activeCategory.value = id
  index.value = 0
  flipped.value = false
  clampIndex()
}

const prev = () => {
  if (!filtered.value.length) return
  flipped.value = false
  index.value = (index.value - 1 + filtered.value.length) % filtered.value.length
}

const next = () => {
  if (!filtered.value.length) return
  flipped.value = false
  index.value = (index.value + 1) % filtered.value.length
}

const mark = (level: Mastery) => {
  if (!current.value) return
  mastery.value[current.value.id] = level
  saveMastery()
  const tips: Record<Mastery, string> = {
    mastered: '已标记掌握 ✓',
    fuzzy: '已标记模糊，记得回头再过一遍',
    none: '已移除标记'
  }
  ElMessage.success(tips[level])
  next()
}

const resetAll = () => {
  mastery.value = {}
  saveMastery()
  ElMessage.info('全部掌握度标记已重置')
}

const currentMastery = computed<Mastery>(() =>
  current.value ? (mastery.value[current.value.id] || 'none') : 'none'
)
</script>

<template>
  <div class="prc-wrap" v-if="loaded">
    <!-- 顶部：分类 + 统计 -->
    <div class="prc-top">
      <div class="prc-cats">
        <button class="prc-cat" :class="{ active: activeCategory === 'all' }" @click="pickCategory('all')">
          全部 <em>{{ cards.length }}</em>
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="prc-cat"
          :class="{ active: activeCategory === cat.id }"
          @click="pickCategory(cat.id)"
        >
          {{ cat.name }}
        </button>
      </div>
      <div class="prc-stats">
        <span class="stat mastered">✅ 已掌握 {{ stats.mastered }}</span>
        <span class="stat fuzzy">🌗 模糊 {{ stats.fuzzy }}</span>
        <span class="stat none">⬜ 未标记 {{ stats.none }}</span>
        <button class="prc-reset" @click="resetAll" title="清空所有掌握度标记">重置</button>
      </div>
    </div>

    <!-- 只练薄弱 -->
    <label class="prc-weak-toggle">
      <input type="checkbox" v-model="onlyWeak" @change="index = 0; flipped = false">
      <span>只练「模糊 + 未标记」卡片</span>
    </label>

    <!-- 卡片区 -->
    <div v-if="current" class="prc-stage">
      <div class="prc-progress">
        第 {{ index + 1 }} / {{ filtered.length }} 张
        <span class="prc-mastery-tag" :class="currentMastery">
          {{ currentMastery === 'mastered' ? '已掌握' : currentMastery === 'fuzzy' ? '模糊' : '未标记' }}
        </span>
      </div>

      <div class="flip-scene" :class="{ flipped }" @click="flipped = !flipped">
        <div class="flip-card">
          <div class="flip-face flip-front">
            <div class="face-head">
              <span class="face-cat">{{ categoryName(current.category) }}</span>
              <span class="face-hint">点击卡片查看答案 ↻</span>
            </div>
            <h3 class="face-title">{{ current.title }}</h3>
            <p class="face-question">{{ current.front }}</p>
          </div>
          <div class="flip-face flip-back">
            <div class="face-head">
              <span class="face-cat">参考答案</span>
              <span class="face-hint">点击卡片返回问题 ↻</span>
            </div>
            <p class="face-answer">{{ current.back }}</p>
          </div>
        </div>
      </div>

      <div class="prc-actions">
        <button class="prc-btn nav" @click="prev">← 上一张</button>
        <button class="prc-btn bad" @click="mark('fuzzy')">🌗 模糊</button>
        <button class="prc-btn good" @click="mark('mastered')">✅ 掌握</button>
        <button class="prc-btn nav" @click="next">下一张 →</button>
      </div>
      <p class="prc-tip">💡 先在脑中默背答案，再翻卡核对；模糊的卡片会留在薄弱池里反复出现。</p>
    </div>

    <div v-else class="prc-empty">
      🎉 当前分类下没有需要练习的卡片了，切换分类或取消「只练薄弱」试试。
    </div>
  </div>
  <div v-else class="prc-loading">背诵卡片加载中…</div>
</template>

<style scoped>
.prc-wrap {
  --ink: #1f2d3d;
  --body: #303133;
  --gold: #ffc53d;
  --navy-deep: #0d2137;
  --navy: #16345c;
  --line: #e4ebf3;
  --bg-soft: #f5f8fc;
  --subject: #f56c6c;
}

.prc-loading {
  text-align: center;
  padding: 60px 0;
  color: var(--navy);
}

/* ── 顶部分类与统计 ─────────────── */
.prc-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.prc-cats {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.prc-cat {
  border: 1px solid var(--line);
  background: #fff;
  color: var(--navy);
  font-weight: 600;
  font-size: 0.85rem;
  padding: 7px 16px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.22s ease;
}

.prc-cat em {
  font-style: normal;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  margin-left: 4px;
  color: #8492a6;
}

.prc-cat:hover {
  border-color: var(--subject);
  transform: translateY(-2px);
}

.prc-cat.active {
  background: linear-gradient(135deg, var(--subject), #d94848);
  border-color: var(--subject);
  color: #fff;
  box-shadow: 0 4px 14px rgba(245, 108, 108, 0.35);
}

.prc-cat.active em {
  color: rgba(255, 255, 255, 0.85);
}

.prc-stats {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.8rem;
  flex-wrap: wrap;
}

.stat {
  padding: 5px 12px;
  border-radius: 8px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.stat.mastered { background: #e8f8ee; color: #1e7a45; }
.stat.fuzzy { background: #fff4e0; color: #a06a00; }
.stat.none { background: #eef2f7; color: #4a5a70; }

.prc-reset {
  border: 1px dashed #c3cedd;
  background: transparent;
  color: #5b6b7f;
  font-size: 0.75rem;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.prc-reset:hover {
  border-color: var(--subject);
  color: var(--subject);
}

.prc-weak-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--navy);
  cursor: pointer;
  margin-bottom: 18px;
  user-select: none;
}

.prc-weak-toggle input {
  accent-color: var(--subject);
  width: 15px;
  height: 15px;
}

/* ── 翻卡舞台 ─────────────────────── */
.prc-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.prc-progress {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--navy);
  letter-spacing: 0.08em;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.prc-mastery-tag {
  font-family: inherit;
  font-size: 0.68rem;
  padding: 2px 10px;
  border-radius: 999px;
  font-weight: 700;
}

.prc-mastery-tag.mastered { background: #e8f8ee; color: #1e7a45; }
.prc-mastery-tag.fuzzy { background: #fff4e0; color: #a06a00; }
.prc-mastery-tag.none { background: #eef2f7; color: #4a5a70; }

.flip-scene {
  width: 100%;
  max-width: 680px;
  min-height: 340px;
  perspective: 1400px;
  cursor: pointer;
}

.flip-card {
  position: relative;
  width: 100%;
  min-height: 340px;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
}

.flip-scene.flipped .flip-card {
  transform: rotateY(180deg);
}

.flip-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 16px;
  padding: 26px 30px;
  display: flex;
  flex-direction: column;
}

.flip-front {
  background: linear-gradient(160deg, var(--navy-deep) 0%, var(--navy) 70%, #1e4576 100%);
  border: 1px solid rgba(255, 197, 61, 0.25);
  box-shadow: 0 12px 40px rgba(13, 33, 55, 0.35);
}

.flip-back {
  background: linear-gradient(160deg, #fffdf5 0%, #fff8ec 100%);
  border: 2px solid var(--gold);
  box-shadow: 0 12px 40px rgba(212, 160, 18, 0.25);
  transform: rotateY(180deg);
}

.face-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.face-cat {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  padding: 4px 12px;
  border-radius: 999px;
}

.flip-front .face-cat {
  color: var(--gold);
  border: 1px solid rgba(255, 197, 61, 0.5);
}

.flip-back .face-cat {
  color: #7a5c10;
  background: rgba(212, 160, 18, 0.15);
}

.face-hint {
  font-size: 0.72rem;
}

.flip-front .face-hint { color: #7f96b3; }
.flip-back .face-hint { color: #b09548; }

.face-title {
  color: #fff;
  font-size: 1.3rem;
  letter-spacing: 0.03em;
  margin-bottom: 14px;
}

.face-question {
  color: #c9d8ea;
  font-size: 1.02rem;
  line-height: 1.9;
  margin: 0;
}

.face-answer {
  color: #4a3d1a;
  font-size: 0.98rem;
  line-height: 2;
  margin: 0;
  overflow-y: auto;
}

/* ── 操作按钮 ─────────────────────── */
.prc-actions {
  display: flex;
  gap: 12px;
  margin-top: 22px;
  flex-wrap: wrap;
  justify-content: center;
}

.prc-btn {
  font-size: 0.9rem;
  font-weight: 700;
  padding: 10px 24px;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--navy);
  transition: all 0.22s ease;
  letter-spacing: 0.03em;
}

.prc-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(13, 33, 55, 0.12);
}

.prc-btn.good {
  background: linear-gradient(135deg, #2fae62, #1e7a45);
  border-color: #2fae62;
  color: #fff;
}

.prc-btn.bad {
  background: linear-gradient(135deg, #f5a623, #d98c0f);
  border-color: #f5a623;
  color: #fff;
}

.prc-tip {
  margin-top: 16px;
  font-size: 0.8rem;
  color: #5b6b7f;
}

.prc-empty {
  text-align: center;
  padding: 50px 20px;
  color: var(--navy);
  font-size: 0.95rem;
  background: var(--bg-soft);
  border-radius: 12px;
}

@media (max-width: 640px) {
  .flip-scene {
    min-height: 420px;
  }
  .flip-card {
    min-height: 420px;
  }
  .flip-face {
    padding: 20px 18px;
  }
}
</style>
