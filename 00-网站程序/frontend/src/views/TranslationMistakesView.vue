<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => router.push({ path: '/english', query: { tab: 'translation' } })

const MISTAKE_KEY = 'translation-mistakes-v1'

interface Mistake {
  id: string
  year: number
  no: number
  en: string
  zh: string
  myTranslation: string
  level: 'fuzzy' | 'weak'
  addedAt: string
}

const mistakes = ref<Mistake[]>([])
const filterLevel = ref<'all' | 'fuzzy' | 'weak'>('all')
const revealed = ref<string[]>([])

const load = () => {
  try {
    const raw = localStorage.getItem(MISTAKE_KEY)
    mistakes.value = raw ? JSON.parse(raw) : []
  } catch { mistakes.value = [] }
}
onMounted(load)

const filtered = computed(() =>
  filterLevel.value === 'all' ? mistakes.value : mistakes.value.filter(m => m.level === filterLevel.value)
)

const stats = computed(() => ({
  total: mistakes.value.length,
  weak: mistakes.value.filter(m => m.level === 'weak').length,
  fuzzy: mistakes.value.filter(m => m.level === 'fuzzy').length
}))

const save = () => localStorage.setItem(MISTAKE_KEY, JSON.stringify(mistakes.value))

const remove = (id: string) => {
  mistakes.value = mistakes.value.filter(m => m.id !== id)
  save()
}

const upgrade = (id: string) => {
  const m = mistakes.value.find(x => x.id === id)
  if (m) m.level = 'fuzzy'
  save()
}

const toggleReveal = (id: string) => {
  const i = revealed.value.indexOf(id)
  i > -1 ? revealed.value.splice(i, 1) : revealed.value.push(id)
}
</script>

<template>
  <div class="tm-wrap">
    <div class="page-header">
      <el-button type="primary" link @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回翻译主页
      </el-button>
      <h2>❌ 翻译错题本</h2>
      <p>真题实战中标记「模糊/未掌握」的句子自动收入 · 盲翻重练 · 逐条销账</p>
    </div>

    <!-- 统计与筛选 -->
    <div class="tm-bar">
      <div class="tm-stats">
        <span class="tm-stat">共 {{ stats.total }} 句</span>
        <span class="tm-stat weak">❌ 未掌握 {{ stats.weak }}</span>
        <span class="tm-stat fuzzy">🌗 模糊 {{ stats.fuzzy }}</span>
      </div>
      <div class="tm-filter">
        <button :class="{ active: filterLevel === 'all' }" @click="filterLevel = 'all'">全部</button>
        <button :class="{ active: filterLevel === 'weak' }" @click="filterLevel = 'weak'">只看未掌握</button>
        <button :class="{ active: filterLevel === 'fuzzy' }" @click="filterLevel = 'fuzzy'">只看模糊</button>
      </div>
    </div>

    <div v-if="!filtered.length" class="tm-empty">
      <template v-if="!mistakes.length">
        🎉 错题本是空的。去「真题实战」做一套翻译，标记模糊/未掌握的句子会自动收入这里。
      </template>
      <template v-else>当前筛选条件下没有错题，换个筛选试试。</template>
    </div>

    <div v-else class="tm-list">
      <section
        v-for="m in filtered"
        :key="m.id"
        class="tm-card"
        :class="m.level"
      >
        <div class="tm-head">
          <span class="tm-year">{{ m.year }}年 · 第{{ m.no }}句</span>
          <span class="tm-level">{{ m.level === 'weak' ? '❌ 未掌握' : '🌗 模糊' }}</span>
          <span class="tm-date">{{ m.addedAt }} 加入</span>
        </div>
        <p class="tm-en">{{ m.en }}</p>

        <div v-if="m.myTranslation" class="tm-mine">
          <span class="tm-label">我的译文</span>
          <p>{{ m.myTranslation }}</p>
        </div>

        <button class="tm-toggle" @click="toggleReveal(m.id)">
          {{ revealed.includes(m.id) ? '▲ 收起参考译文' : '▼ 盲翻完成后查看参考译文' }}
        </button>

        <div v-if="revealed.includes(m.id)" class="tm-answer">
          <span class="tm-label gold">参考译文</span>
          <p>{{ m.zh }}</p>
        </div>

        <div class="tm-actions">
          <button v-if="m.level === 'weak'" class="tm-btn mid" @click="upgrade(m.id)">🌗 已能译出，降为模糊</button>
          <button class="tm-btn good" @click="remove(m.id)">✅ 已彻底掌握，销账</button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.tm-wrap {
  --ink: #1f2d3d;
  --body: #303133;
  --gold: #ffc53d;
  --navy: #16345c;
  --line: #e4ebf3;
  --bg-soft: #f5f8fc;
  max-width: 900px;
  margin: 0 auto;
}
.page-header { text-align: center; margin-bottom: 24px; }
.page-header h2 { font-size: 1.7em; color: var(--navy); margin: 12px 0 8px; }
.page-header p { font-size: 0.92em; color: #5b6b7f; margin: 0; }

.tm-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}
.tm-stats { display: flex; gap: 10px; flex-wrap: wrap; }
.tm-stat {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--navy);
  background: var(--bg-soft);
  padding: 6px 14px;
  border-radius: 999px;
}
.tm-stat.weak { background: #fff0f0; color: #c0392b; }
.tm-stat.fuzzy { background: #fff8ec; color: #a06a00; }

.tm-filter { display: flex; gap: 8px; }
.tm-filter button {
  border: 1px solid var(--line);
  background: #fff;
  color: var(--navy);
  font-size: 0.8rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s;
}
.tm-filter button:hover { border-color: var(--gold); }
.tm-filter button.active {
  background: var(--navy);
  color: var(--gold);
  border-color: var(--navy);
}

.tm-empty {
  text-align: center;
  background: var(--bg-soft);
  border-radius: 14px;
  padding: 48px 24px;
  color: var(--navy);
  font-size: 0.92rem;
  line-height: 1.8;
}

.tm-list { display: flex; flex-direction: column; gap: 16px; }
.tm-card {
  background: #fff;
  border: 1.5px solid var(--line);
  border-radius: 14px;
  padding: 18px 22px;
}
.tm-card.weak { border-left: 5px solid #f56c6c; }
.tm-card.fuzzy { border-left: 5px solid #f5a623; }

.tm-head {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.tm-year {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--navy);
}
.tm-level { font-size: 0.75rem; color: #c0392b; font-weight: 700; }
.tm-card.fuzzy .tm-level { color: #a06a00; }
.tm-date { margin-left: auto; font-size: 0.72rem; color: #8492a6; }

.tm-en {
  font-family: 'Georgia', serif;
  font-size: 1rem;
  line-height: 1.9;
  color: var(--ink);
  margin: 0 0 12px;
}
.tm-label {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--navy);
  background: var(--bg-soft);
  padding: 2px 10px;
  border-radius: 999px;
  margin-bottom: 6px;
}
.tm-label.gold {
  color: #a06a00;
  background: #fff8ec;
}
.tm-mine { margin-bottom: 12px; }
.tm-mine p, .tm-answer p {
  margin: 0 0 10px;
  font-size: 0.9rem;
  line-height: 1.85;
  color: var(--body);
}
.tm-toggle {
  border: none;
  background: var(--bg-soft);
  color: var(--navy);
  font-size: 0.78rem;
  font-weight: 700;
  padding: 7px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.tm-toggle:hover { background: rgba(255, 197, 61, 0.2); }
.tm-answer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--line);
}
.tm-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 8px;
}
.tm-btn {
  border: 1px solid var(--line);
  background: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 7px 16px;
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.2s;
}
.tm-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(13, 33, 55, 0.1); }
.tm-btn.good { color: #1e7a45; border-color: #bfe8cf; }
.tm-btn.mid { color: #a06a00; border-color: #f0dfb8; }
</style>
