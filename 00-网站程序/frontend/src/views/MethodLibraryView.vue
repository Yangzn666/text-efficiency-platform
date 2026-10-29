<script setup lang="ts">
import { ref, computed } from 'vue'
import { renderMath } from '@/utils/mathRender'
import methodsData from '@/data/methods.json'
import { ALL_QUOTES, QUOTES_CHINESE, QUOTE_GROUPS, quoteOfToday } from '@/data/quotes'

// 方法条目结构（与 src/data/methods.json 对齐）
interface MethodItem {
  id: string
  subject: string
  subjectName: string
  name: string
  trigger: string
  steps: string
  formula: string
  applies: string
  pitfall: string
  source: string
  learnedDate: string
  mastery: string
  nextReview: string
}

const methods = methodsData as MethodItem[]

// 六个科目分组（与错题本视觉/结构对等，顶部按科目筛选）
const SUBJECT_TABS: { key: string; label: string }[] = [
  { key: 'gaoshu', label: '高等数学' },
  { key: 'xiandai', label: '线性代数' },
  { key: 'gailv', label: '概率论' },
  { key: 'cs408', label: '408' },
  { key: 'english', label: '英语' },
  { key: 'politics', label: '政治' },
]

const activeSubject = ref(SUBJECT_TABS[0].key)

const bySubject = (key: string) => methods.filter((m) => m.subject === key)

// 每个 tab 的条目 + 徽标计数用
const counts = computed(() => {
  const map: Record<string, number> = {}
  SUBJECT_TABS.forEach((t) => { map[t.key] = bySubject(t.key).length })
  return map
})

// 展开/折叠每张卡片的详情区
const expanded = ref<Set<string>>(new Set())
const isExpanded = (id: string) => expanded.value.has(id)
const toggleDetail = (id: string) => {
  const s = new Set(expanded.value)
  s.has(id) ? s.delete(id) : s.add(id)
  expanded.value = s
}

// 掌握状态 → 徽标配色（沿用全站语义：初学=金、会用=蓝、熟练=绿）
const masteryClass = (m: string) =>
  m === '熟练' ? 'badge-proficient' : m === '会用' ? 'badge-familiar' : 'badge-newcomer'

// 是否到了/过了下次复习日期
const reviewStatus = (dateStr: string) => {
  const d = Date.parse(dateStr)
  if (Number.isNaN(d)) return ''
  return d <= Date.now() ? 'overdue' : ''
}

/* ─────────── 今日一句 ─────────── */
// 按当天日期确定性取样：同一天刷新不换句，隔天自动轮到下一句；也可手动前后翻。
const qIdx = ref(Math.max(0, ALL_QUOTES.indexOf(quoteOfToday())))
const todayQuote = computed(() => ALL_QUOTES[qIdx.value] ?? ALL_QUOTES[0])
const shiftQuote = (step: number) => {
  qIdx.value = (qIdx.value + step + ALL_QUOTES.length) % ALL_QUOTES.length
}
const isChinese = computed(() => QUOTES_CHINESE.includes(todayQuote.value))
const dateLabel = computed(() =>
  new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })
)

// 全库导航（点开看每句的完整出处 + 适用场景）
const quotesOpen = ref(false)
</script>

<template>
  <div class="method-library-page">
    <div class="page-header">
      <div class="header-decoration"></div>
      <h1 class="page-title">方法库</h1>
      <p class="page-subtitle">记录「第一次见 / 原本不会」的解题方法 · 复习"看到什么信号就用哪一招"</p>
    </div>

    <div class="page-content">
      <!-- ───────── 今日一句 ───────── -->
      <section class="quote-card">
        <div class="qc-top">
          <span class="qc-tag">今日一句</span>
          <span class="qc-src-chip" :class="isChinese ? 'cn' : 'fg'">{{ isChinese ? '中 · 古文／近代' : '外 · 心理／哲／体育' }}</span>
          <span class="qc-date">{{ dateLabel }}</span>
        </div>

        <div class="qc-body">
          <span class="qc-mark">“</span>
          <p class="qc-text">{{ todayQuote.text }}</p>
          <p class="qc-by">
            —— {{ todayQuote.author }}<template v-if="todayQuote.src"> · {{ todayQuote.src }}</template>
          </p>
          <p v-if="todayQuote.scene" class="qc-scene">
            <span class="qc-scene-label">适合此刻</span>{{ todayQuote.scene }}
          </p>
        </div>

        <div class="qc-foot">
          <div class="qc-nav">
            <button class="qc-btn" type="button" @click="shiftQuote(-1)">‹ 上一句</button>
            <button class="qc-btn" type="button" @click="shiftQuote(1)">下一句 ›</button>
          </div>
          <span class="qc-count">{{ qIdx + 1 }} / {{ ALL_QUOTES.length }} · 每天自动轮一句</span>
          <button class="qc-link" type="button" @click="quotesOpen = !quotesOpen">
            {{ quotesOpen ? '收起全部语录 ▴' : '全部语录 · 按主题 ▾' }}
          </button>
        </div>

        <div v-show="quotesOpen" class="qc-library">
          <div v-for="g in QUOTE_GROUPS" :key="g.key" class="qc-group">
            <div class="qcg-title">{{ g.icon }} {{ g.name }}<em>{{ g.items.length }} 条</em></div>
            <div class="qcg-list">
              <div v-for="q in g.items" :key="q.text" class="qcg-item">
                <p class="qcg-text">{{ q.text }}</p>
                <p class="qcg-by">—— {{ q.author }}<template v-if="q.src"> · {{ q.src }}</template></p>
                <p v-if="q.scene" class="qcg-scene">{{ q.scene }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <el-tabs v-model="activeSubject" class="subject-tabs">
        <el-tab-pane v-for="tab in SUBJECT_TABS" :key="tab.key" :name="tab.key">
          <template #label>
            <span class="tab-label">
              {{ tab.label }}
              <span v-if="counts[tab.key]" class="tab-count">{{ counts[tab.key] }}</span>
            </span>
          </template>

          <!-- 空科目占位 -->
          <div v-if="counts[tab.key] === 0" class="empty-state">
            <el-icon size="48" color="#909399"><DocumentChecked /></el-icon>
            <p>暂无，遇到即补</p>
            <p class="hint">深挖错题时若用到新方法，会自动登记到这里</p>
          </div>

          <!-- 方法卡片列表 -->
          <div v-else class="method-list">
            <div v-for="m in bySubject(tab.key)" :key="m.id" class="method-card">
              <div class="card-head">
                <div class="card-id">
                  <span class="id-chip">{{ m.id }}</span>
                  <span class="card-name">{{ m.name }}</span>
                </div>
                <span class="mastery-badge" :class="masteryClass(m.mastery)">{{ m.mastery }}</span>
              </div>

              <!-- 触发信号：复习核心，放在最显眼位置 -->
              <div class="trigger-block">
                <div class="trigger-label">🔔 触发信号 · 看到什么就用它</div>
                <div class="trigger-body" v-html="renderMath(m.trigger)"></div>
              </div>

              <!-- 折叠展开：做法 / 公式 / 适用题型 / 易错反例 -->
              <div class="detail-collapse">
                <div class="detail-toggle" @click="toggleDetail(m.id)">
                  <span class="toggle-arrow">{{ isExpanded(m.id) ? '▾' : '▸' }}</span>
                  <span>{{ isExpanded(m.id) ? '收起方法细节' : '展开：做法 / 公式 / 适用 / 易错' }}</span>
                </div>

                <div v-show="isExpanded(m.id)" class="detail-body">
                  <div class="detail-section">
                    <div class="section-title">做法（分步）</div>
                    <div class="section-content" v-html="renderMath(m.steps)"></div>
                  </div>
                  <div class="detail-section" v-if="m.formula">
                    <div class="section-title">结论 / 公式</div>
                    <div class="section-content formula" v-html="renderMath(m.formula)"></div>
                  </div>
                  <div class="detail-section" v-if="m.applies">
                    <div class="section-title">适用题型</div>
                    <div class="section-content" v-html="renderMath(m.applies)"></div>
                  </div>
                  <div class="detail-section pitfall" v-if="m.pitfall">
                    <div class="section-title">易错 / 反例</div>
                    <div class="section-content" v-html="renderMath(m.pitfall)"></div>
                  </div>
                  <div class="detail-section source" v-if="m.source">
                    <div class="section-title">来源题</div>
                    <div class="section-content" v-html="renderMath(m.source)"></div>
                  </div>
                </div>
              </div>

              <!-- 底部：学会日期 + 下次复习 -->
              <div class="card-foot">
                <span class="foot-item">学会：{{ m.learnedDate }}</span>
                <span class="foot-item" :class="{ overdue: reviewStatus(m.nextReview) === 'overdue' }">
                  下次复习：{{ m.nextReview }}
                  <em v-if="reviewStatus(m.nextReview) === 'overdue'">（待复习）</em>
                </span>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped lang="scss">
.method-library-page {
  --ink: #1a2332;
  --body: #2c3e50;
  --gold: #d4a012;
  --gold-light: #f0c040;
  --navy-deep: #0a1628;
  --navy: #16345c;
  --navy-light: #1e4576;
  --line: #dce3ed;

  max-width: 1520px;
  margin: 0 auto;
  padding: 0 16px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(10, 22, 40, 0.12);
  overflow: hidden;
  font-family: 'FZCuHei', '方正粗黑_GBK', 'Microsoft YaHei', sans-serif;
  color: var(--body);

  .page-header {
    position: relative;
    text-align: center;
    padding: 36px 24px 28px;
    background: linear-gradient(150deg, var(--navy-deep) 0%, var(--navy) 55%, var(--navy-light) 100%);
    color: white;
    border-radius: 20px 20px 0 0;
    overflow: hidden;

    .header-decoration {
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 24px,
        rgba(255, 255, 255, 0.015) 24px,
        rgba(255, 255, 255, 0.015) 48px
      );
      pointer-events: none;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, transparent 0%, var(--gold) 25%, var(--gold-light) 50%, var(--gold) 75%, transparent 100%);
      }
    }

    .page-title {
      font-size: 2.2em;
      margin: 0 0 12px;
      text-shadow: 2px 3px 6px rgba(0, 0, 0, 0.35);
      letter-spacing: 0.06em;
      position: relative;
    }

    .page-subtitle {
      font-size: 1.05em;
      opacity: 0.82;
      letter-spacing: 0.06em;
      margin: 0;
    }
  }

  .page-content {
    padding: 24px 24px 40px;
  }

  /* ── 今日一句 ── */
  .quote-card {
    position: relative;
    margin-bottom: 22px;
    padding: 20px 22px 16px;
    border-radius: 12px;
    border: 1px solid rgba(212, 160, 18, 0.42);
    background:
      radial-gradient(120% 140% at 12% 0%, rgba(212, 160, 18, 0.16) 0%, transparent 58%),
      linear-gradient(135deg, #101c30 0%, #16345c 100%);
    overflow: hidden;

    .qc-top {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 10px;
    }
    .qc-tag {
      font-size: 0.86em;
      font-weight: 700;
      letter-spacing: 0.18em;
      color: #0a1628;
      background: linear-gradient(90deg, var(--gold), var(--gold-light));
      padding: 3px 12px;
      border-radius: 20px;
    }
    .qc-src-chip {
      font-size: 0.8em;
      padding: 2px 10px;
      border-radius: 12px;
      font-weight: 600;
      &.cn { color: #ffd9a0; border: 1px solid rgba(255, 159, 69, 0.6); background: rgba(255, 159, 69, 0.12); }
      &.fg { color: #9fd2ff; border: 1px solid rgba(74, 168, 255, 0.6); background: rgba(74, 168, 255, 0.12); }
    }
    .qc-date { margin-left: auto; font-size: 0.82em; color: #8595a8; letter-spacing: 0.05em; }

    .qc-body {
      position: relative;
      padding-left: 16px;
      border-left: 3px solid var(--gold);
    }
    .qc-mark {
      position: absolute;
      left: 26px;
      top: -14px;
      font-size: 3.2em;
      line-height: 1;
      color: rgba(240, 192, 64, 0.24);
      font-family: Georgia, serif;
      pointer-events: none;
    }
    .qc-text {
      position: relative;
      margin: 0;
      font-size: 1.5em;
      line-height: 1.65;
      font-weight: 600;
      letter-spacing: 0.03em;
      color: #f7f3e6;
      font-family: 'Songti SC', 'STSong', 'SimSun', serif;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
    }
    .qc-by { margin: 10px 0 0; font-size: 0.98em; color: var(--gold-light); letter-spacing: 0.06em; }
    .qc-scene {
      display: flex;
      align-items: baseline;
      gap: 8px;
      flex-wrap: wrap;
      margin: 10px 0 0;
      font-size: 0.94em;
      color: #c8d3e0;
      .qc-scene-label {
        flex-shrink: 0;
        font-size: 0.86em;
        font-weight: 700;
        letter-spacing: 0.08em;
        color: #0a1628;
        background: #8ab4a0;
        border-radius: 4px;
        padding: 1px 7px;
      }
    }

    .qc-foot {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px dashed rgba(212, 160, 18, 0.28);
      font-size: 0.85em;
      color: #8595a8;
    }
    .qc-nav { display: inline-flex; gap: 8px; }
    .qc-btn {
      cursor: pointer;
      font: inherit;
      color: #e8eaed;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 16px;
      padding: 4px 14px;
      transition: all 0.2s;
      &:hover { border-color: var(--gold); color: var(--gold-light); background: rgba(212, 160, 18, 0.14); }
    }
    .qc-link {
      cursor: pointer;
      font: inherit;
      margin-left: auto;
      white-space: nowrap;
      color: #9fb4d0;
      background: none;
      border: none;
      text-decoration: underline dotted;
      &:hover { color: var(--gold-light); }
    }

    .qc-library {
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 14px;
    }
    .qc-group {
      background: rgba(255, 255, 255, 0.035);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 12px 14px;
      .qcg-title {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--gold-light);
        font-weight: 600;
        font-size: 0.98em;
        margin-bottom: 8px;
        em {
          font-style: normal;
          font-size: 0.8em;
          color: #8595a8;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 10px;
          padding: 0 8px;
        }
      }
      .qcg-list { display: flex; flex-direction: column; gap: 10px; }
      .qcg-text { margin: 0; color: #e6e9ef; font-size: 0.98em; line-height: 1.6; }
      .qcg-by { margin: 3px 0 0; color: #9fb4d0; font-size: 0.86em; }
      .qcg-scene { margin: 3px 0 0; color: #a8d4be; font-size: 0.84em; }
    }
  }

  .subject-tabs {
    margin-top: 8px;

    :deep(.el-tabs__header) { margin-bottom: 20px; }
    :deep(.el-tabs__content) { padding: 0; }
  }

  .tab-label { display: inline-flex; align-items: center; gap: 6px; }
  .tab-count {
    background: var(--gold);
    color: #fff;
    font-size: 0.72em;
    min-width: 18px;
    height: 18px;
    line-height: 18px;
    padding: 0 5px;
    border-radius: 9px;
    text-align: center;
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #909399;

    p { margin: 12px 0 0; font-size: 1.05em; }
    .hint { font-size: 0.9em; color: #c0c4cc; }
  }

  .method-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .method-card {
    background: #1a2332;
    border: 1px solid #2a3a4a;
    border-radius: 10px;
    padding: 18px 20px;
    transition: all 0.3s;

    &:hover {
      border-color: var(--gold);
      box-shadow: 0 2px 12px rgba(212, 160, 18, 0.12);
    }
  }

  .card-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 14px;

    .card-id { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .id-chip {
      background: rgba(212, 160, 18, 0.16);
      color: var(--gold-light);
      border: 1px solid rgba(212, 160, 18, 0.4);
      font-size: 0.82em;
      padding: 2px 8px;
      border-radius: 6px;
      letter-spacing: 0.05em;
    }
    .card-name {
      font-size: 1.12em;
      font-weight: 600;
      color: #e8eaed;
    }
  }

  .mastery-badge {
    flex-shrink: 0;
    font-size: 0.82em;
    padding: 3px 12px;
    border-radius: 14px;
    font-weight: 600;
    white-space: nowrap;
  }
  .badge-newcomer { background: rgba(212, 160, 18, 0.18); color: var(--gold-light); border: 1px solid var(--gold); }
  .badge-familiar { background: rgba(30, 69, 118, 0.5); color: #7fb2e8; border: 1px solid #3a6ea5; }
  .badge-proficient { background: rgba(138, 180, 160, 0.16); color: #a8d4be; border: 1px solid #8ab4a0; }

  .trigger-block {
    background: rgba(212, 160, 18, 0.1);
    border-left: 4px solid var(--gold);
    border-radius: 6px;
    padding: 12px 14px;
    margin-bottom: 12px;

    .trigger-label {
      color: var(--gold-light);
      font-size: 0.88em;
      font-weight: 600;
      margin-bottom: 6px;
      letter-spacing: 0.03em;
    }
    .trigger-body {
      color: #f0e6cf;
      font-size: 1.02em;
      line-height: 1.7;
    }
  }

  .detail-collapse { margin-bottom: 10px; }
  .detail-toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    color: #8ab4a0;
    font-size: 0.9em;
    user-select: none;
    padding: 4px 0;
    &:hover { color: #a8d4be; }
    .toggle-arrow { font-size: 0.85em; }
  }
  .detail-body {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .detail-section {
    .section-title {
      color: var(--gold);
      font-size: 0.85em;
      font-weight: 600;
      margin-bottom: 4px;
      letter-spacing: 0.04em;
    }
    .section-content {
      color: #b0b8c4;
      font-size: 0.98em;
      line-height: 1.7;
      padding: 10px 12px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 6px;
    }
    .section-content.formula {
      background: rgba(30, 69, 118, 0.28);
      border-left: 3px solid var(--navy-light);
    }
    &.pitfall .section-content {
      color: #e6a9a9;
      background: rgba(230, 120, 120, 0.08);
      border-left: 3px solid #c06060;
    }
    &.source .section-content { color: #9fb4d0; }
  }

  .card-foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    padding-top: 10px;
    border-top: 1px dashed #2a3a4a;
    font-size: 0.85em;
    color: #8595a8;

    .foot-item.overdue { color: var(--gold-light); em { font-style: normal; font-weight: 600; } }
  }

  /* KaTeX 深色卡片适配（与错题本一致） */
  :deep(.katex) { font-size: 1.08em; color: #e8eaed; }
  .trigger-block :deep(.katex) { color: #f0e6cf; }
  .pitfall :deep(.katex) { color: #e6a9a9; }
  :deep(.katex-display) { margin: 0.5em 0; overflow-x: auto; overflow-y: hidden; }
}

/* ── 手机端适配：窄屏竖向堆叠、字号够大、不横向溢出 ── */
@media (max-width: 768px) {
  .method-library-page {
    padding: 0 8px;
    border-radius: 14px;

    .page-header { padding: 26px 16px 20px; .page-title { font-size: 1.7em; } .page-subtitle { font-size: 0.95em; } }
    .page-content { padding: 16px 12px 32px; }

    .quote-card {
      padding: 16px 14px 12px;
      .qc-date { margin-left: 0; }
      .qc-body { padding-left: 12px; }
      .qc-mark { left: 20px; top: -10px; font-size: 2.4em; }
      .qc-text { font-size: 1.24em; line-height: 1.7; }
      .qc-foot { gap: 10px; }
      .qc-link { margin-left: 0; }
      .qc-library { grid-template-columns: 1fr; }
    }

    .subject-tabs :deep(.el-tabs__header) { margin-bottom: 14px; }

    .method-card { padding: 14px 14px; }

    .card-head {
      flex-direction: column;
      align-items: flex-start;
      .card-name { font-size: 1.06em; line-height: 1.4; }
    }
    .mastery-badge { align-self: flex-end; margin-top: -34px; }

    .trigger-block { padding: 12px 12px; .trigger-body { font-size: 1.05em; } }
    .detail-section .section-content { font-size: 1em; }

    .card-foot { flex-direction: column; align-items: flex-start; gap: 4px; }
  }
}
</style>
