<script setup lang="ts">
import { ref, computed } from 'vue'
import { renderMath } from '@/utils/mathRender'
import methodsData from '@/data/methods.json'

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
</script>

<template>
  <div class="method-library-page">
    <div class="page-header">
      <div class="header-decoration"></div>
      <h1 class="page-title">方法库</h1>
      <p class="page-subtitle">记录「第一次见 / 原本不会」的解题方法 · 复习"看到什么信号就用哪一招"</p>
    </div>

    <div class="page-content">
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
