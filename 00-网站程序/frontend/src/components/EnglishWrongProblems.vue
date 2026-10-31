<script setup lang="ts">
// 英语一错题本（不再是空壳）
//
// 站点里本来就有 860 道真题的作答记录（reading/index.json 每题带 correctAnswer + userAnswer），
// 但英语错题本一直显示"暂无英语一错题"——做错的题从来没有沉淀成任何可回炉的清单。
// 这里把做错的题自动沉淀进统一错题 store：可按题型/年份筛、看当年错在哪、逐题复测，
// 连对 2 次才毕业；解析按需懒加载 by-year/<年份>.json（手机端不预下载）。
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useWrongProblemsStore } from '@/stores/wrongProblems'
import WrongRetestActions from '@/components/WrongRetestActions.vue'
import {
  loadEnglishWrongSeeds, getEnglishDetail, stripHtml,
  englishCauseDistribution, englishYearDistribution,
  type EnglishWrongSeed, type EnglishDetail
} from '@/data/englishWrong'

const wp = useWrongProblemsStore()
const problems = wp.bind('english', [])

const loading = ref(true)
const loadError = ref('')
const syncing = ref(false)

async function seed(force = false) {
  loading.value = true
  loadError.value = ''
  try {
    const list = await loadEnglishWrongSeeds(force)
    // 增量补种：store 已认识的 id 不会重复塞回来，删掉的题也不会复活
    wp.bind('english', list as unknown as any[])
    if (!list.length) loadError.value = '作答记录里暂时没有错题（做过且判错的题才会进来）'
  } catch (e: any) {
    loadError.value = `读不到英语作答数据：${e?.message || e}`
  } finally {
    loading.value = false
  }
}

async function resync() {
  syncing.value = true
  // 重读 index.json + 浏览器里更新的作答，把新做错的题补进账本
  const list = await loadEnglishWrongSeeds(true)
  const known = new Set(problems.value.map(p => p.id))
  const added = list.filter(p => !known.has(p.id))
  wp.bind('english', list as unknown as any[])
  syncing.value = false
  ElMessage.success(added.length ? `同步完成，新沉淀 ${added.length} 道错题` : '同步完成，没有新增错题')
}

onMounted(() => seed())

const list = computed(() => problems.value as unknown as EnglishWrongSeed[])
const graduated = computed(() => list.value.filter(p => p.mastered).length)
const pending = computed(() => list.value.length - graduated.value)
const streaking = computed(() => list.value.filter(p => !p.mastered && (p.correctStreak || 0) > 0).length)

const causes = computed(() => englishCauseDistribution(list.value))
const years = computed(() => englishYearDistribution(list.value))

const causeFilter = ref('all')
const yearFilter = ref('all')
const stateFilter = ref('all')
const keyword = ref('')
const maxCause = computed(() => causes.value.reduce((m, c) => Math.max(m, c.count), 1))

const filtered = computed(() => {
  let l = list.value
  if (causeFilter.value !== 'all') l = l.filter(p => p.mistakeType === causeFilter.value)
  if (yearFilter.value !== 'all') l = l.filter(p => (p.chapterName || '').startsWith(yearFilter.value))
  if (stateFilter.value === 'graduated') l = l.filter(p => p.mastered)
  if (stateFilter.value === 'pending') l = l.filter(p => !p.mastered)
  const k = keyword.value.trim().toLowerCase()
  if (k) l = l.filter(p =>
    (p.content || '').toLowerCase().includes(k) ||
    (p.title || '').toLowerCase().includes(k) ||
    (p.sectionName || '').toLowerCase().includes(k)
  )
  // 没毕业的排前面，同年份按题号；越近的年份越靠前
  return l.slice().sort((a, b) => {
    if (!!a.mastered !== !!b.mastered) return a.mastered ? 1 : -1
    const ya = parseInt((a.chapterName || '').slice(0, 4)) || 0
    const yb = parseInt((b.chapterName || '').slice(0, 4)) || 0
    if (ya !== yb) return yb - ya
    return (a.title || '').localeCompare(b.title || '')
  })
})

// ---------- 解析懒加载 ----------
const openDetail = ref<Record<string, boolean>>({})
const details = ref<Record<string, EnglishDetail | null>>({})
const detailLoading = ref<Record<string, boolean>>({})

function yearOf(p: EnglishWrongSeed) {
  return parseInt((p.chapterName || '').slice(0, 4)) || new Date().getFullYear()
}

async function toggleDetail(p: EnglishWrongSeed) {
  const id = p.id
  if (openDetail.value[id]) { delete openDetail.value[id]; return }
  openDetail.value[id] = true
  if (details.value[id] !== undefined) return
  detailLoading.value[id] = true
  details.value[id] = await getEnglishDetail(yearOf(p), p.rawKey)
  detailLoading.value[id] = false
}

/** 选项行：应选标 ◆、你选的标 ◇，与政治错题本同一套视觉语言 */
function markOf(p: EnglishWrongSeed, label: string) {
  const right = (p.rightAnswer || '').trim()
  const yours = (p.yourAnswer || '').trim()
  if (label === right && label === yours) return 'both'
  if (label === right) return 'right'
  if (label === yours) return 'yours'
  return ''
}

const tips = (p: EnglishWrongSeed) => stripHtml(details.value[p.id]?.tips || '')
const analysis = (p: EnglishWrongSeed) => stripHtml(details.value[p.id]?.analysis || '')
</script>

<template>
  <div class="ewp">
    <div v-if="loading" class="ewp-tip">正在从真题作答记录里沉淀错题…</div>
    <div v-else-if="loadError && !list.length" class="ewp-tip bad">
      {{ loadError }}
      <div class="ewp-tip-sub">去做几道题（<router-link to="/english">英语一 · 阅读/完形</router-link>）再回来，这里会自动长出账。</div>
    </div>

    <template v-else>
      <!-- 顶部账本条 -->
      <div class="ewp-strip">
        <div class="es"><b>{{ list.length }}</b><span>沉淀错题</span></div>
        <div class="es hot"><b>{{ pending }}</b><span>待重做毕业</span></div>
        <div class="es"><b>{{ streaking }}</b><span>连对推进中</span></div>
        <div class="es ok"><b>{{ graduated }}</b><span>已毕业</span></div>
        <button class="ewp-sync" :disabled="syncing" @click="resync">
          {{ syncing ? '同步中…' : '↻ 同步做题记录' }}
        </button>
      </div>

      <!-- 错因分布：错题集中在哪种题型，决定接下来刷什么 -->
      <section class="ewp-card">
        <h3 class="ewp-h3">🎯 错在哪类题 <small>点一条即可筛出该题型全部错题</small></h3>
        <div class="cause-grid">
          <button
            v-for="c in causes"
            :key="c.type"
            class="cause"
            :class="{ on: causeFilter === c.type }"
            @click="causeFilter = causeFilter === c.type ? 'all' : c.type"
          >
            <span class="c-name">{{ c.type }}</span>
            <span class="c-track"><i :style="{ width: (c.count / maxCause * 100) + '%' }" /></span>
            <span class="c-num">{{ c.count }}</span>
          </button>
        </div>
        <p class="ewp-note">
          分布决定动作：细节/推理占大头 → 回「定位 + 同义替换」；词汇/搭配占大头 → 背真题生词本；
          主旨/态度占大头 → 练首尾段与观点词。
        </p>
      </section>

      <!-- 筛选 -->
      <section class="ewp-card">
        <div class="ewp-tools">
          <select v-model="yearFilter" class="ewp-inp">
            <option value="all">全部年份（{{ years.length }} 年）</option>
            <option v-for="y in years" :key="y.year" :value="y.year">{{ y.year }} 年（{{ y.count }} 题）</option>
          </select>
          <select v-model="causeFilter" class="ewp-inp">
            <option value="all">全部题型</option>
            <option v-for="c in causes" :key="c.type" :value="c.type">{{ c.type }}（{{ c.count }}）</option>
          </select>
          <select v-model="stateFilter" class="ewp-inp">
            <option value="all">全部状态</option>
            <option value="pending">待重做</option>
            <option value="graduated">已毕业</option>
          </select>
          <input v-model="keyword" class="ewp-inp grow" placeholder="搜题干关键词 / 篇目" />
        </div>
        <div class="ewp-count">
          筛出 <b>{{ filtered.length }}</b> 题 · 未毕业 {{ filtered.filter(p => !p.mastered).length }} 题
        </div>

        <p v-if="!filtered.length" class="ewp-tip good">这个筛选下没有题——换个题型或年份看看。</p>

        <div class="ewp-list">
          <article
            v-for="p in filtered"
            :key="p.id"
            class="ew"
            :class="{ grad: p.mastered }"
          >
            <header class="ew-head">
              <div class="ew-title">
                <span class="ew-cause">{{ p.mistakeType }}</span>
                <span class="ew-chapter">{{ p.chapterName }}</span>
                <span class="ew-passage" v-if="p.sectionName">{{ p.sectionName }}</span>
              </div>
              <WrongRetestActions :problem="p" />
            </header>

            <div class="ew-stem">{{ p.content }}</div>

            <ul class="ew-opts">
              <li
                v-for="o in p.options"
                :key="o.label"
                :class="markOf(p, o.label)"
              >
                <span class="op-mark">
                  <template v-if="markOf(p, o.label) === 'right'">◆ 应选</template>
                  <template v-else-if="markOf(p, o.label) === 'both'">◆✓ 你选对了</template>
                  <template v-else-if="markOf(p, o.label) === 'yours'">◇ 你选</template>
                  <template v-else>{{ o.label }}</template>
                </span>
                <span class="op-text">{{ o.text }}</span>
              </li>
            </ul>

            <div class="ew-actions">
              <button class="ew-btn" @click="toggleDetail(p)">
                {{ openDetail[p.id] ? '收起解析' : '看当年解析（应选为什么对 / 你选为什么错）' }}
              </button>
              <router-link class="ew-btn ghost" :to="{ path: '/english', query: { tab: 'reading' } }">回精读页重做本篇 →</router-link>
            </div>

            <div v-if="openDetail[p.id]" class="ew-detail">
              <div v-if="detailLoading[p.id]" class="ewd-loading">加载 {{ yearOf(p) }} 年解析…</div>
              <template v-else-if="details[p.id]">
                <p v-if="tips(p)" class="ewd-block"><b>思路</b>{{ tips(p) }}</p>
                <p v-if="analysis(p)" class="ewd-block"><b>答案解析</b>{{ analysis(p) }}</p>
                <p v-if="!tips(p) && !analysis(p)" class="ewd-block dim">这条记录里没有解析文本。</p>
              </template>
              <div v-else class="ewd-block dim">没找到 {{ yearOf(p) }} 年这篇的解析文件（by-year 数据缺失）。</div>
            </div>
          </article>
        </div>
      </section>

      <p class="ewp-how">
        账本来源：<code>data/english/reading/index.json</code> 的作答记录 + 浏览器里更新的作答
        （<code>readingUserAnswers</code>）。在精读页每做错一道，点「↻ 同步做题记录」就长出一条新错题；
        毕业状态、复测次数记在统一错题本（<code>wrong-problems-v1</code>），和其它科目同一套连对 2 次机制。
      </p>
    </template>
  </div>
</template>

<style scoped>
.ewp { padding: 4px 0 20px; }
.ewp-tip { padding: 14px 16px; border-radius: 11px; background: #eef2f8; color: #5a6472; font-size: .92em; line-height: 1.7; }
.ewp-tip.bad { background: #fdecea; color: #b6402f; }
.ewp-tip.good { background: #e9f7ef; color: #1f7a4d; }
.ewp-tip-sub { margin-top: 6px; color: #7a848f; }
.ewp-tip-sub a { color: #2b6cb0; }

.ewp-strip { display: grid; grid-template-columns: repeat(auto-fit, minmax(96px, 1fr)); gap: 8px; align-items: stretch; margin-bottom: 12px; }
.es { background: #16345c; color: #fff; border-radius: 11px; padding: 10px 8px; text-align: center; }
.es b { display: block; font-size: 1.35em; line-height: 1.2; }
.es span { display: block; font-size: .72em; opacity: .85; margin-top: 2px; }
.es.hot { background: #b6402f; }
.es.ok { background: #1f7a4d; }
.ewp-sync {
  border: 1px solid #dfe5ee; background: #fff; color: #16345c; font-weight: 700;
  border-radius: 11px; padding: 0 12px; cursor: pointer; font-size: .88em;
}
.ewp-sync:disabled { opacity: .6; cursor: default; }

.ewp-card { background: #fff; border: 1px solid #e3e8ef; border-radius: 14px; padding: 14px; margin-bottom: 14px; }
.ewp-h3 { margin: 0 0 10px; font-size: 1.02em; color: #16345c; font-weight: 800; }
.ewp-h3 small { font-weight: 500; color: #8a94a3; font-size: .72em; margin-left: 6px; }
.ewp-note { margin: 10px 0 0; font-size: .78em; color: #7a848f; line-height: 1.65; }
.ewp-how { font-size: .78em; color: #8a94a3; line-height: 1.7; padding: 0 4px; }
.ewp-how code { background: #f1f4f9; padding: 1px 5px; border-radius: 5px; color: #b6402f; }

.cause-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 6px; }
.cause {
  display: grid; grid-template-columns: 84px 1fr 32px; align-items: center; gap: 8px;
  border: 1px solid #eaeef4; background: #fafbfd; border-radius: 9px; padding: 6px 9px;
  cursor: pointer; font-size: .82em; text-align: left; color: #3b4757;
}
.cause:hover { border-color: #c8d6ea; background: #f2f6fb; }
.cause.on { border-color: #16345c; background: #eaf0f8; }
.c-name { font-weight: 700; color: #22314a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.c-track { height: 8px; border-radius: 999px; background: #eef2f8; overflow: hidden; }
.c-track i { display: block; height: 100%; background: linear-gradient(90deg, #e8604c, #ffb27a); border-radius: 999px; }
.c-num { text-align: right; font-weight: 700; color: #b6402f; font-variant-numeric: tabular-nums; }

.ewp-tools { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
.ewp-inp { border: 1px solid #dfe5ee; border-radius: 8px; padding: 5px 9px; font-size: .84em; color: #3b4757; background: #fff; }
.ewp-inp.grow { flex: 1; min-width: 160px; }
.ewp-count { font-size: .8em; color: #8a94a3; margin-bottom: 10px; }
.ewp-count b { color: #b6402f; font-size: 1.15em; }

.ewp-list { display: grid; gap: 10px; }
.ew { border: 1px solid #e8edf4; border-left: 3px solid #e8604c; border-radius: 12px; padding: 12px 13px; background: #fff; }
.ew.grad { border-left-color: #2e9e6b; opacity: .72; background: #fbfdfc; }
.ew-head { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: space-between; }
.ew-title { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; font-size: .82em; }
.ew-cause { background: #fdecea; color: #b6402f; border-radius: 6px; padding: 1px 7px; font-weight: 700; }
.ew-chapter { color: #16345c; font-weight: 700; }
.ew-passage { color: #8a94a3; }
.ew-stem { margin: 9px 0 8px; font-size: .92em; line-height: 1.7; color: #22314a; max-width: 70ch; overflow-wrap: break-word; }

.ew-opts { margin: 0; padding: 0; list-style: none; display: grid; gap: 4px; }
.ew-opts li { display: grid; grid-template-columns: 84px 1fr; gap: 8px; font-size: .84em; padding: 5px 8px; border-radius: 8px; background: #f8fafc; color: #3b4757; }
.ew-opts li.right { background: #e9f7ef; border: 1px solid #bfe3cd; }
.ew-opts li.yours { background: #fdecea; border: 1px solid #f3c9c2; }
.ew-opts li.both { background: #eaf3ff; border: 1px solid #b9d6f2; }
.op-mark { font-weight: 700; color: #8a94a3; white-space: nowrap; }
.ew-opts li.right .op-mark { color: #1f7a4d; }
.ew-opts li.yours .op-mark { color: #b6402f; }
.ew-opts li.both .op-mark { color: #2b6cb0; }
.op-text { word-break: break-word; }

.ew-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 9px; }
.ew-btn { border: 1px solid #dfe5ee; background: #fff; color: #16345c; border-radius: 8px; padding: 4px 11px; font-size: .8em; cursor: pointer; text-decoration: none; }
.ew-btn:hover { background: #f2f6fb; }
.ew-btn.ghost { color: #2b6cb0; border-style: dashed; }

.ew-detail { margin-top: 10px; border-top: 1px dashed #e3e8ef; padding-top: 10px; }
.ewd-block { margin: 0 0 8px; font-size: .84em; line-height: 1.7; color: #3b4757; white-space: pre-line; max-width: 70ch; overflow-wrap: break-word; }
.ewd-block b { display: inline-block; margin-right: 8px; color: #b6402f; }
.ewd-block.dim { color: #a8b0bb; }
.ewd-loading { font-size: .82em; color: #8a94a3; }

@media (max-width: 640px) {
  .cause { grid-template-columns: 72px 1fr 28px; }
  .ew-opts li { grid-template-columns: 72px 1fr; }
  .ewp-tools .ewp-inp { flex: 1 1 46%; }
}
</style>
