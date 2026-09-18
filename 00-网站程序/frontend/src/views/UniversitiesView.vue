<template>
  <div class="universities-container">
    <!-- 头部标题 -->
    <header class="page-header">
      <div class="ph-grid"></div>
      <div class="ph-glow"></div>
      <div class="ph-inner">
        <span class="ph-kicker">UNIVERSITIES · 院校数据库 · 2026版</span>
        <h1>11408考研院校<span class="gold">数据库</span></h1>
        <p class="subtitle">69所重点院校完整信息 · 分数线 · 报录比 · 科目变更</p>
        <p class="data-updated">📅 数据更新：2026年5月13日 · 来源：灰灰考研统计（27所院校2026复试线/录取分已同步核验）</p>
      </div>
    </header>

    <!-- 搜索和筛选区 -->
    <div class="filter-section">
      <!-- 搜索框 -->
      <div class="search-box">
        <input 
          v-model="searchKeyword" 
          type="text" 
          placeholder="🔍 搜索院校名称、地区、学科等级..."
          class="search-input"
        />
      </div>

      <!-- 筛选条件 -->
      <div class="filter-controls">
        <!-- 院校层次 -->
        <select v-model="filterLevel" class="filter-select">
          <option value="">全部层次</option>
          <option value="C9">C9联盟</option>
          <option value="985">其他985</option>
          <option value="211">强势211</option>
          <option value="双非">强势双非</option>
        </select>

        <!-- 地区筛选 -->
        <select v-model="filterRegion" class="filter-select">
          <option value="">全部地区</option>
          <option value="北京">北京</option>
          <option value="上海">上海</option>
          <option value="江苏">江苏</option>
          <option value="浙江">浙江</option>
          <option value="广东">广东</option>
          <option value="湖北">湖北</option>
          <option value="四川">四川</option>
          <option value="其他">其他地区</option>
        </select>

        <!-- 难度等级 -->
        <select v-model="filterDifficulty" class="filter-select">
          <option value="">全部难度</option>
          <option value="S+">S+级（顶尖）</option>
          <option value="A+">A+级（极难）</option>
          <option value="A">A级（很难）</option>
          <option value="A-">A-级（较难）</option>
          <option value="B+">B+级（中等）</option>
        </select>

        <!-- 排序方式 -->
        <select v-model="sortBy" class="filter-select sort-select">
          <option value="">排序：默认</option>
          <option value="scoreLine-asc">复试线 低→高</option>
          <option value="scoreLine-desc">复试线 高→低</option>
          <option value="avgScore-asc">录取均分 低→高</option>
          <option value="avgScore-desc">录取均分 高→低</option>
          <option value="quota-desc">统考名额 多→少</option>
          <option value="difficulty-asc">难度 易→难</option>
        </select>

        <!-- 特殊标签 -->
        <label class="checkbox-label">
          <input type="checkbox" v-model="showOnly408Change" />
          <span>仅显示2026改考408</span>
        </label>

        <label class="checkbox-label">
          <input type="checkbox" v-model="showOnlyAI" />
          <span>仅显示AI专硕</span>
        </label>
      </div>

      <!-- 统计信息 -->
      <div class="stats-bar">
        <span class="stat-item">共找到 <strong>{{ filteredUniversities.length }}</strong> 所院校</span>
        <button @click="resetFilters" class="reset-btn">重置筛选</button>
      </div>
    </div>

    <!-- 择校推荐器（冲 / 稳 / 保） -->
    <div class="matcher-card">
      <div class="matcher-head">
        <h3>🧭 择校推荐器 · 输入你的目标分，一键分档</h3>
        <p class="matcher-sub">以院校「录取均分 / 最新复试线」为参照线，按 ±5 / +20 阈值划分冲稳保，仅供初筛，最终请结合大小年与自身实力。</p>
      </div>
      <div class="matcher-controls">
        <label class="mc-field">
          <span class="mc-label">目标总分</span>
          <input type="number" v-model.number="recScore" min="250" max="450" step="5" class="mc-input" />
        </label>
        <label class="mc-field">
          <span class="mc-label">意向地区</span>
          <select v-model="recRegion" class="mc-select">
            <option value="">不限地区</option>
            <option v-for="r in matcherRegions" :key="r" :value="r">{{ r }}</option>
          </select>
        </label>
        <div class="mc-checks">
          <label class="mc-check"><input type="checkbox" v-model="rec408Only" /><span>只看改考408</span></label>
          <label class="mc-check"><input type="checkbox" v-model="recExclude408" /><span>排除改考408</span></label>
          <label class="mc-check"><input type="checkbox" v-model="recAIOnly" /><span>只看AI专硕</span></label>
        </div>
      </div>

      <div class="matcher-cols">
        <div class="mc-col rush">
          <div class="mc-col-head">
            <span class="mc-tag">🔥 冲</span>
            <span class="mc-count">{{ recommend.rush.length }} 所</span>
          </div>
          <p class="mc-col-tip">目标分略低于参照线，搏一搏</p>
          <ul class="mc-list">
            <li v-for="item in recommend.rush.slice(0, 8)" :key="item.uni.name" class="mitem" @click="showDetail(item.uni)">
              <div class="mitem-top">
                <span class="mitem-name">{{ item.uni.name }}</span>
                <span class="mitem-ref">参照 {{ item.ref }}</span>
              </div>
              <div class="mitem-sub">
                <span class="mitem-badge">{{ item.uni.level }} · {{ item.uni.difficulty }}</span>
                <span class="mitem-reason">{{ recReason(item, 'rush') }}</span>
              </div>
            </li>
            <li v-if="!recommend.rush.length" class="mitem-empty">暂无匹配，放宽地区或调低目标分</li>
          </ul>
        </div>

        <div class="mc-col stable">
          <div class="mc-col-head">
            <span class="mc-tag">✅ 稳</span>
            <span class="mc-count">{{ recommend.stable.length }} 所</span>
          </div>
          <p class="mc-col-tip">目标分与参照线持平，主战场</p>
          <ul class="mc-list">
            <li v-for="item in recommend.stable.slice(0, 8)" :key="item.uni.name" class="mitem" @click="showDetail(item.uni)">
              <div class="mitem-top">
                <span class="mitem-name">{{ item.uni.name }}</span>
                <span class="mitem-ref">参照 {{ item.ref }}</span>
              </div>
              <div class="mitem-sub">
                <span class="mitem-badge">{{ item.uni.level }} · {{ item.uni.difficulty }}</span>
                <span class="mitem-reason">{{ recReason(item, 'stable') }}</span>
              </div>
            </li>
            <li v-if="!recommend.stable.length" class="mitem-empty">暂无匹配</li>
          </ul>
        </div>

        <div class="mc-col safety">
          <div class="mc-col-head">
            <span class="mc-tag">🛡️ 保</span>
            <span class="mc-count">{{ recommend.safety.length }} 所</span>
          </div>
          <p class="mc-col-tip">目标分明显高于参照线，兜底</p>
          <ul class="mc-list">
            <li v-for="item in recommend.safety.slice(0, 8)" :key="item.uni.name" class="mitem" @click="showDetail(item.uni)">
              <div class="mitem-top">
                <span class="mitem-name">{{ item.uni.name }}</span>
                <span class="mitem-ref">参照 {{ item.ref }}</span>
              </div>
              <div class="mitem-sub">
                <span class="mitem-badge">{{ item.uni.level }} · {{ item.uni.difficulty }}</span>
                <span class="mitem-reason">{{ recReason(item, 'safety') }}</span>
              </div>
            </li>
            <li v-if="!recommend.safety.length" class="mitem-empty">暂无匹配</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 择校方法论 / 避坑指南 -->
    <div class="method-card">
      <button class="method-toggle" @click="methodOpen = !methodOpen">
        <span class="mt-title">📖 择校方法论 · 避坑指南</span>
        <span class="mt-arrow" :class="{ open: methodOpen }">▾</span>
      </button>
      <div v-show="methodOpen" class="method-grid">
        <div v-for="m in methodology" :key="m.title" class="method-item">
          <div class="mi-head"><span class="mi-icon">{{ m.icon }}</span><span class="mi-title">{{ m.title }}</span></div>
          <p class="mi-body">{{ m.body }}</p>
        </div>
      </div>
    </div>

    <!-- 院校卡片列表 -->
    <div class="universities-grid">
      <div 
        v-for="uni in filteredUniversities" 
        :key="uni.name"
        class="university-card"
        @click="showDetail(uni)"
      >
        <!-- 卡片头部 -->
        <div class="card-header">
          <h3 class="uni-name">{{ uni.name }}</h3>
          <span v-if="getLevelBadgeText(uni.level)" :class="['level-badge', getLevelBadgeClass(uni.level)]">{{ getLevelBadgeText(uni.level) }}</span>
        </div>

        <!-- 学院信息 -->
        <div v-if="uni.college" class="college-info">
          <span class="college-label">🏛️</span>
          <span class="college-name">{{ uni.college }}</span>
        </div>

        <!-- 基本信息 -->
        <div class="card-body">
          <div class="info-row">
            <span class="label">📍 地区：</span>
            <span class="value">{{ uni.region }}</span>
          </div>
          <div class="info-row">
            <span class="label">📊 学科：</span>
            <span :class="['value', getGradeClass(uni.grade)]">{{ uni.grade || '待补充' }}</span>
          </div>
          <div class="info-row">
            <span class="label">🎯 难度：</span>
            <span :class="['difficulty-badge', uni.difficulty.toLowerCase()]">{{ uni.difficulty }}</span>
          </div>
          <!-- 显示专业分数线 -->
          <div v-if="uni.majors && uni.majors.length > 0" class="majors-preview">
            <div class="label">📚 11408专业：</div>
            <div class="major-tags">
              <span v-for="(major, idx) in uni.majors.slice(0, 3)" :key="idx" class="major-tag">
                {{ major.name }} <span class="major-type">({{ major.type }})</span> {{ major.scoreLine }}分
              </span>
              <span v-if="uni.majors.length > 3" class="more-tag">+{{ uni.majors.length - 3 }}</span>
            </div>
          </div>
          <div v-else class="info-row">
            <span class="label">💰 分数线：</span>
            <span class="value score">{{ uni.scoreLine }}分</span>
          </div>
        </div>

        <!-- 标签 -->
        <div class="card-tags">
          <span v-if="uni.is408Change" class="tag tag-408">2026改考408</span>
          <span v-if="uni.hasAI" class="tag tag-ai">AI专硕</span>
          <span v-if="uni.tags" v-for="tag in uni.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>

        <!-- 查看详情按钮 -->
        <div class="card-footer">
          <button
            :class="['compare-btn', { active: isCompared(uni) }]"
            @click.stop="toggleCompare(uni)"
          >{{ isCompared(uni) ? '✓ 已选' : '+ 对比' }}</button>
          <button class="detail-btn">查看详情 →</button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredUniversities.length === 0" class="empty-state">
      <p>😕 没有找到匹配的院校</p>
      <button @click="resetFilters" class="reset-btn">重置筛选条件</button>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="selectedUni" class="modal-overlay" @click="closeDetail">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeDetail">×</button>
        
        <div class="modal-header">
          <div class="header-top">
            <h2>{{ selectedUni.name }}</h2>
            <div class="header-badges">
              <span :class="['level-badge', getLevelBadgeClass(selectedUni.level)]">{{ selectedUni.level }}</span>
              <span :class="['difficulty-badge', selectedUni.difficulty.toLowerCase()]">难度 {{ selectedUni.difficulty }}</span>
            </div>
          </div>
          <div class="header-meta">
            <span class="meta-chip">📍 {{ selectedUni.region }}</span>
            <span class="meta-chip">🏫 {{ selectedUni.college }}</span>
            <span class="meta-chip">学科 <b :class="getGradeClass(selectedUni.grade)">{{ selectedUni.grade || '—' }}</b></span>
            <span class="meta-chip accent">复试线 <b>{{ selectedUni.scoreLine || '—' }}</b>分</span>
            <span class="meta-chip accent">目标 <b>≥{{ selectedUni.targetScore || '—' }}</b>分</span>
            <span class="meta-chip">💰 {{ selectedUni.salary }}</span>
          </div>
          <div v-if="selectedUni.tags && selectedUni.tags.length" class="header-tags">
            <span v-for="tag in selectedUni.tags" :key="tag" class="header-tag">{{ tag }}</span>
          </div>
        </div>

        <div class="modal-body">
          <!-- 招生数据 -->
          <section v-if="selectedUni.scoreHistory && selectedUni.scoreHistory.length > 0" class="detail-section">
            <h3>📊 历年分数线</h3>
            <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>年份</th>
                  <th>方向/校区</th>
                  <th>复试线</th>
                  <th>录取均分</th>
                  <th>统考名额</th>
                  <th>报录比</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(year, idx) in selectedUni.scoreHistory" :key="idx">
                  <td>{{ year.year }}</td>
                  <td>{{ year.direction || '—' }}</td>
                  <td>{{ year.scoreLine }}</td>
                  <td>{{ year.avgScore }}</td>
                  <td>{{ year.quota }}</td>
                  <td>{{ year.ratio }}</td>
                </tr>
              </tbody>
            </table>
            </div>
            <p class="chart-caption">📈 历年走势（复试线 / 录取均分 / 报录比）——识别大小年</p>
            <div ref="trendEl" class="chart-box"></div>
          </section>

          <!-- 专业分数线 -->
          <section v-if="selectedUni.majors && selectedUni.majors.length > 0" class="detail-section">
            <h3>📚 11408专业分数线</h3>
            <div class="table-wrap">
            <table class="data-table majors-table">
              <thead>
                <tr>
                  <th>专业代码</th>
                  <th>专业名称</th>
                  <th>类型</th>
                  <th>总分</th>
                  <th>政治</th>
                  <th>外语</th>
                  <th>业务课1</th>
                  <th>业务课2</th>
                  <th>录取最低分</th>
                  <th>录取平均分</th>
                  <th>招生人数</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="major in selectedUni.majors" :key="major.code + major.name">
                  <td>{{ major.code }}</td>
                  <td>{{ major.name }}</td>
                  <td>{{ major.type || '-' }}</td>
                  <td class="score-cell">{{ major.scoreLine }}分</td>
                  <td>{{ major.politics || '-' }}</td>
                  <td>{{ major.english || '-' }}</td>
                  <td>{{ major.course1 || '-' }}</td>
                  <td>{{ major.course2 || '-' }}</td>
                  <td>{{ major.minScore || '待更新' }}</td>
                  <td>{{ major.avgScore || '待更新' }}</td>
                  <td>{{ major.quota || '待更新' }}</td>
                </tr>
              </tbody>
            </table>
            </div>
          </section>

          <!-- 考试科目 -->
          <section class="detail-section">
            <h3>📚 考试科目</h3>
            <div class="exam-subjects">
              <div class="subject-item">
                <span class="subject-code">101</span>
                <span class="subject-name">思想政治理论</span>
                <span class="subject-score">100分</span>
              </div>
              <div class="subject-item">
                <span class="subject-code">201</span>
                <span class="subject-name">英语一</span>
                <span class="subject-score">100分</span>
              </div>
              <div class="subject-item">
                <span class="subject-code">301</span>
                <span class="subject-name">数学一</span>
                <span class="subject-score">150分</span>
              </div>
              <div class="subject-item highlight">
                <span class="subject-code">408</span>
                <span class="subject-name">计算机学科专业基础</span>
                <span class="subject-score">150分</span>
              </div>
            </div>
            <p class="total-score">总分：<strong>500分</strong></p>
          </section>

          <!-- 就业方向 -->
          <section class="detail-section">
            <h3>💼 就业方向</h3>
            <div class="employment-list">
              <div v-for="job in selectedUni.employment" :key="job.direction" class="employment-item">
                <span class="direction">{{ job.direction }}</span>
                <span class="percentage">{{ job.percentage }}</span>
                <span class="companies">{{ job.companies }}</span>
              </div>
            </div>
            <div v-if="selectedUni.employment && selectedUni.employment.length" class="pie-wrap">
              <p class="chart-caption">🥧 就业去向分布</p>
              <div ref="pieEl" class="chart-box pie"></div>
            </div>
            <div class="salary-info">
              <p><strong>硕士起薪：</strong>{{ selectedUni.salary }}</p>
            </div>
          </section>

          <!-- 备考建议 -->
          <section class="detail-section">
            <h3>📝 备考建议</h3>
            <div class="advice-grid">
              <div class="advice-card pros">
                <h4>✅ 优势</h4>
                <ul>
                  <li v-for="pro in selectedUni.pros" :key="pro">{{ pro }}</li>
                </ul>
              </div>
              <div class="advice-card cons">
                <h4>❌ 劣势</h4>
                <ul>
                  <li v-for="con in selectedUni.cons" :key="con">{{ con }}</li>
                </ul>
              </div>
            </div>
            <div class="target-score">
              <p><strong>建议目标分数：</strong>≥ {{ selectedUni.targetScore }}分</p>
            </div>
          </section>

          <!-- 相关链接 -->
          <section class="detail-section">
            <h3>🔗 相关链接</h3>
            <div class="links-list">
              <a :href="selectedUni.links.graduate" target="_blank" class="link-item">研究生院官网 →</a>
              <a :href="selectedUni.links.college" target="_blank" class="link-item">学院官网 →</a>
              <a :href="selectedUni.links.yz" target="_blank" class="link-item">研招网页面 →</a>
            </div>
          </section>
        </div>
      </div>
    </div>

    <!-- 对比浮动栏 -->
    <div v-if="compareList.length > 0" class="compare-bar">
      <div class="compare-bar-items">
        <span class="compare-bar-label">对比 ({{ compareList.length }}/3)：</span>
        <span v-for="u in compareList" :key="u.name" class="compare-chip">
          {{ u.name }}
          <button class="chip-remove" @click="removeCompare(u.name)">×</button>
        </span>
      </div>
      <div class="compare-bar-actions">
        <button class="compare-clear" @click="clearCompare">清空</button>
        <button class="compare-go" @click="openCompare">开始对比 →</button>
      </div>
    </div>

    <!-- 对比弹窗 -->
    <div v-if="compareVisible" class="modal-overlay" @click="compareVisible = false">
      <div class="modal-content compare-modal" @click.stop>
        <button class="close-btn" @click="compareVisible = false">×</button>
        <div class="modal-header">
          <h2>🎯 院校对比</h2>
        </div>
        <div class="modal-body">
          <div class="compare-table-wrap">
            <table class="compare-table">
              <thead>
                <tr>
                  <th class="compare-row-label">对比项</th>
                  <th v-for="u in compareList" :key="u.name">{{ u.name }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="compare-row-label">院校层次</td>
                  <td v-for="u in compareList" :key="u.name">{{ u.level }}</td>
                </tr>
                <tr>
                  <td class="compare-row-label">学科等级</td>
                  <td v-for="u in compareList" :key="u.name" :class="getGradeClass(u.grade)">{{ u.grade || '—' }}</td>
                </tr>
                <tr>
                  <td class="compare-row-label">所在地区</td>
                  <td v-for="u in compareList" :key="u.name">{{ u.region }}</td>
                </tr>
                <tr>
                  <td class="compare-row-label">难度评级</td>
                  <td v-for="u in compareList" :key="u.name"><span :class="['difficulty-badge', u.difficulty.toLowerCase()]">{{ u.difficulty }}</span></td>
                </tr>
                <tr>
                  <td class="compare-row-label">复试线</td>
                  <td v-for="u in compareList" :key="u.name" class="score-cell">{{ u.scoreLine }}分</td>
                </tr>
                <tr>
                  <td class="compare-row-label">录取均分</td>
                  <td v-for="u in compareList" :key="u.name">{{ compareAvg(u) }}</td>
                </tr>
                <tr>
                  <td class="compare-row-label">统考名额</td>
                  <td v-for="u in compareList" :key="u.name">{{ compareQuota(u) }}</td>
                </tr>
                <tr>
                  <td class="compare-row-label">2026改考408</td>
                  <td v-for="u in compareList" :key="u.name">{{ u.is408Change ? '✓ 是' : '否' }}</td>
                </tr>
                <tr>
                  <td class="compare-row-label">AI专硕</td>
                  <td v-for="u in compareList" :key="u.name">{{ u.hasAI ? '✓ 有' : '无' }}</td>
                </tr>
                <tr>
                  <td class="compare-row-label">建议目标分</td>
                  <td v-for="u in compareList" :key="u.name">≥ {{ u.targetScore }}分</td>
                </tr>
                <tr>
                  <td class="compare-row-label">硕士起薪</td>
                  <td v-for="u in compareList" :key="u.name">{{ u.salary || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="compareList.length >= 2" class="radar-wrap">
            <p class="chart-caption">🕸️ 五维能力雷达（院校名气 / 学科实力 / 就业薪资 / 上岸难度 / 招生规模）</p>
            <div ref="radarEl" class="chart-box radar"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import universitiesData from '../data/universities.json'

// ECharts 按需引入(仅择校页用到, 懒加载分包, 控制包体积)
import * as echarts from 'echarts/core'
import { LineChart, PieChart, RadarChart, BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([LineChart, PieChart, RadarChart, BarChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, CanvasRenderer])

// 类型定义
interface Major {
  code: string
  name: string
  type?: string
  scoreLine: number
  politics?: number
  english?: number
  course1?: number
  course2?: number
  minScore?: number | null
  avgScore?: number | null
  quota?: number | null
}

interface University {
  name: string
  college: string
  region: string
  level: string
  grade?: string
  difficulty: string
  majors?: Major[]
  scoreLine: number
  scoreHistory?: any[]
  is408Change: boolean
  hasAI: boolean
  tags?: string[]
  [key: string]: any
}

// 搜索和筛选状态
const searchKeyword = ref('')
const filterLevel = ref('')
const filterRegion = ref('')
const filterDifficulty = ref('')
const showOnly408Change = ref(false)
const showOnlyAI = ref(false)
const sortBy = ref('')

// 选中的院校
const selectedUni = ref<any>(null)

// ===== 院校对比 =====
const compareList = ref<any[]>([])
const compareVisible = ref(false)

const isCompared = (uni: any): boolean => {
  return compareList.value.some(u => u.name === uni.name)
}

const toggleCompare = (uni: any) => {
  const idx = compareList.value.findIndex(u => u.name === uni.name)
  if (idx >= 0) {
    compareList.value.splice(idx, 1)
  } else {
    if (compareList.value.length >= 3) {
      alert('最多同时对比 3 所院校，请先移除一所')
      return
    }
    compareList.value.push(uni)
  }
}

const removeCompare = (name: string) => {
  compareList.value = compareList.value.filter(u => u.name !== name)
}

const clearCompare = () => {
  compareList.value = []
  compareVisible.value = false
}

const openCompare = () => {
  if (compareList.value.length < 2) {
    alert('请至少选择 2 所院校进行对比')
    return
  }
  compareVisible.value = true
}

// 对比用的最新均分/名额
const compareAvg = (uni: any) => {
  const n = getLatestStat(uni, 'avgScore')
  return n === null ? '待更新' : n
}
const compareQuota = (uni: any) => {
  const n = getLatestStat(uni, 'quota')
  return n === null ? '待更新' : n
}

// 难度等级 -> 数字（越大越难）
const difficultyRank = (d: string): number => {
  const map: Record<string, number> = { 'B+': 1, 'B': 1, 'A-': 2, 'A': 3, 'A+': 4, 'S+': 5, 'S': 5 }
  return map[d] ?? 0
}

// 把可能为"待更新"的字段转成数字，无效返回 null
const numVal = (v: any): number | null => {
  if (v === null || v === undefined) return null
  const n = parseFloat(String(v).replace(/[^\d.]/g, ''))
  return isNaN(n) ? null : n
}

// 从 scoreHistory 取最新一年的指定字段（均分/名额），回退到 majors
const getLatestStat = (uni: any, field: 'avgScore' | 'quota'): number | null => {
  const hist = uni.scoreHistory
  if (Array.isArray(hist) && hist.length > 0) {
    const maxYear = Math.max(...hist.map((h: any) => h.year || 0))
    const latest = hist.filter((h: any) => h.year === maxYear)
    for (const h of latest) {
      const n = numVal(h[field])
      if (n !== null) return n
    }
  }
  const majors = uni.majors
  if (Array.isArray(majors)) {
    for (const m of majors) {
      const n = numVal(m[field])
      if (n !== null) return n
    }
  }
  return null
}

// 取排序用的数值
const getSortValue = (uni: any): number => {
  const key = sortBy.value
  if (key === 'difficulty-asc') return difficultyRank(uni.difficulty)
  if (key === 'scoreLine-asc' || key === 'scoreLine-desc') return numVal(uni.scoreLine) ?? -1
  if (key === 'avgScore-asc' || key === 'avgScore-desc') return getLatestStat(uni, 'avgScore') ?? -1
  if (key === 'quota-desc') return getLatestStat(uni, 'quota') ?? -1
  return 0
}

// 筛选后的院校列表
const filteredUniversities = computed(() => {
  let result = universitiesData.filter(uni => {
    // 关键词搜索
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      const matchName = uni.name.toLowerCase().includes(keyword)
      const matchRegion = uni.region.toLowerCase().includes(keyword)
      const matchGrade = uni.grade ? uni.grade.toLowerCase().includes(keyword) : false
      const matchCollege = uni.college ? uni.college.toLowerCase().includes(keyword) : false
      if (!matchName && !matchRegion && !matchGrade && !matchCollege) return false
    }

    // 层次筛选
    if (filterLevel.value) {
      const level = uni.level || ''
      if (filterLevel.value === 'C9' && !level.includes('C9')) return false
      if (filterLevel.value === '985' && (!level.includes('985') || level.includes('C9'))) return false
      if (filterLevel.value === '211' && (!level.includes('211') || level.includes('985'))) return false
      if (filterLevel.value === '双非' && (level.includes('985') || level.includes('211'))) return false
    }

    // 地区筛选
    if (filterRegion.value) {
      const region = uni.region || ''
      if (filterRegion.value === '其他') {
        // 排除常见地区
        const commonRegions = ['北京', '上海', '江苏', '浙江', '广东', '湖北', '四川']
        if (commonRegions.some(r => region.includes(r))) return false
      } else if (!region.includes(filterRegion.value)) {
        return false
      }
    }

    // 难度筛选
    if (filterDifficulty.value && uni.difficulty !== filterDifficulty.value) return false

    // 改考408筛选
    if (showOnly408Change.value && !uni.is408Change) return false

    // AI专硕筛选
    if (showOnlyAI.value && !uni.hasAI) return false

    return true
  })

  // 排序
  if (sortBy.value) {
    const desc = sortBy.value.endsWith('-desc')
    result = result.slice().sort((a, b) => {
      const va = getSortValue(a)
      const vb = getSortValue(b)
      // 无有效值(-1)排到末尾
      if (va === -1 && vb === -1) return 0
      if (va === -1) return 1
      if (vb === -1) return -1
      return desc ? vb - va : va - vb
    })
  }

  return result
})

// 显示详情
const showDetail = (uni: any) => {
  selectedUni.value = uni
}

// 关闭详情
const closeDetail = () => {
  selectedUni.value = null
}

// 重置筛选
const resetFilters = () => {
  searchKeyword.value = ''
  filterLevel.value = ''
  filterRegion.value = ''
  filterDifficulty.value = ''
  showOnly408Change.value = false
  showOnlyAI.value = false
  sortBy.value = ''
}

// 辅助函数：将grade转换为合法的CSS类名
const getGradeClass = (grade: string | undefined) => {
  if (!grade) return 'grade-none'
  // 将特殊字符替换为合法字符：- -> minus, + -> plus（注意顺序：先替换-，否则+替换出的-plus会被-替换破坏）
  return 'grade-' + grade.replace(/-/g, '-minus').replace(/\+/g, '-plus').toLowerCase()
}

// 辅助函数：获取层级标签的简写
const getLevelBadgeClass = (level: string | undefined) => {
  if (!level) return 'none'
  if (level.includes('C9')) return 'c9'
  if (level.includes('985')) return 'g985'
  if (level.includes('211')) return 'g211'
  return 'none'
}

// 辅助函数：获取层级标签的显示文字
const getLevelBadgeText = (level: string | undefined) => {
  if (!level) return ''
  if (level.includes('C9')) return 'C9'
  if (level.includes('985')) return '985'
  if (level.includes('211')) return '211'
  return ''
}

// 取字符串里第一个数字(处理 "36+1专项"、"35-50万" 这类)
const firstNum = (v: any): number | null => {
  if (v === null || v === undefined) return null
  const m = String(v).match(/\d+(\.\d+)?/)
  return m ? parseFloat(m[0]) : null
}

/* ============================================================
   ECharts 可视化
   ============================================================ */
let trendChart: any = null
let pieChart: any = null
let radarChart: any = null
const trendEl = ref<HTMLElement | null>(null)
const pieEl = ref<HTMLElement | null>(null)
const radarEl = ref<HTMLElement | null>(null)

// 按年份聚合某字段(该年多方向取均值), 返回 { years, values }
function yearlySeries(uni: any, field: string) {
  const byYear: Record<number, number[]> = {}
  ;(uni.scoreHistory || []).forEach((h: any) => {
    const v = numVal(h[field])
    if (v === null || !h.year) return
    ;(byYear[h.year] = byYear[h.year] || []).push(v)
  })
  const years = Object.keys(byYear).map(Number).sort((a, b) => a - b)
  const values = years.map(y => {
    const arr = byYear[y]
    return Math.round(arr.reduce((s, x) => s + x, 0) / arr.length)
  })
  return { years, values }
}

function renderDetailCharts(uni: any) {
  // —— 历年趋势折线 + 报录比柱 ——
  if (trendEl.value) {
    trendChart?.dispose()
    trendChart = echarts.init(trendEl.value)
    const line = yearlySeries(uni, 'scoreLine')
    const avg = yearlySeries(uni, 'avgScore')
    const ratio = yearlySeries(uni, 'ratio')
    const years = Array.from(new Set([...line.years, ...avg.years])).sort((a, b) => a - b)
    const pick = (s: { years: number[]; values: number[] }, y: number) => {
      const i = s.years.indexOf(y)
      return i < 0 ? null : s.values[i]
    }
    trendChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['复试线', '录取均分', '报录比'], bottom: 0, textStyle: { color: '#4a5568' } },
      grid: { left: 46, right: 48, top: 28, bottom: 42 },
      xAxis: { type: 'category', data: years.map(String), axisLine: { lineStyle: { color: '#cbd5e0' } } },
      yAxis: [
        { type: 'value', name: '分', scale: true, axisLabel: { color: '#718096' }, splitLine: { lineStyle: { color: '#eef3f8' } } },
        { type: 'value', name: '报录比', position: 'right', axisLabel: { color: '#718096' }, splitLine: { show: false } }
      ],
      series: [
        { name: '报录比', type: 'bar', yAxisIndex: 1, barWidth: '36%', data: years.map(y => pick(ratio, y)), itemStyle: { color: 'rgba(240,168,32,0.32)', borderRadius: [4, 4, 0, 0] } },
        { name: '复试线', type: 'line', smooth: true, data: years.map(y => pick(line, y)), itemStyle: { color: '#16345c' }, lineStyle: { width: 3 } },
        { name: '录取均分', type: 'line', smooth: true, data: years.map(y => pick(avg, y)), itemStyle: { color: '#ffc53d' }, lineStyle: { width: 3 } }
      ]
    })
  }
  // —— 就业去向饼 ——
  const emp = (uni.employment || [])
    .map((e: any) => ({ name: e.direction, value: firstNum(e.percentage) }))
    .filter((e: any) => e.value && e.value > 0)
  if (pieEl.value && emp.length) {
    pieChart?.dispose()
    pieChart = echarts.init(pieEl.value)
    pieChart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
      legend: { bottom: 0, type: 'scroll', textStyle: { color: '#4a5568', fontSize: 11 } },
      color: ['#16345c', '#ffc53d', '#4facfe', '#43e97b', '#f093fb', '#f5576c', '#a8edea'],
      series: [{
        name: '就业去向', type: 'pie', radius: ['42%', '66%'], center: ['50%', '44%'],
        data: emp, label: { formatter: '{b}\n{c}%', fontSize: 11, color: '#4a5568' },
        itemStyle: { borderColor: '#fff', borderWidth: 2 }
      }]
    })
  }
}

// 归一化打分(0-100) 供雷达图
const levelScore = (l = '') => l.includes('C9') ? 100 : l.includes('985') ? 85 : l.includes('211') ? 65 : l.includes('双一流') ? 58 : 45
const gradeScore = (g = '') => (({ 'A+': 100, 'A': 92, 'A-': 82, 'B+': 72, 'B': 62, 'B-': 52, 'C+': 42 } as Record<string, number>)[g] || 55)
const salaryScore = (s: any) => { const n = firstNum(s); return n === null ? 50 : Math.min(100, Math.round(n * 2)) }
const diffScore = (d = '') => (({ 'S+': 100, 'S': 95, 'A+': 85, 'A': 72, 'A-': 60, 'B+': 48, 'B': 40 } as Record<string, number>)[d] || 55)
const quotaScore = (q: number | null) => q === null ? 50 : Math.min(100, Math.round((Math.min(q, 40) / 40) * 100))

function renderRadar() {
  if (!radarEl.value || compareList.value.length < 2) return
  radarChart?.dispose()
  radarChart = echarts.init(radarEl.value)
  const indicators = [
    { name: '院校名气', max: 100 }, { name: '学科实力', max: 100 }, { name: '就业薪资', max: 100 },
    { name: '上岸难度', max: 100 }, { name: '招生规模', max: 100 }
  ]
  const colors = ['#16345c', '#ffc53d', '#43e97b']
  const data = compareList.value.map((u, i) => ({
    name: u.name, type: 'radar', areaStyle: { opacity: 0.12 },
    lineStyle: { color: colors[i % 3], width: 2 }, itemStyle: { color: colors[i % 3] },
    value: [levelScore(u.level), gradeScore(u.grade), salaryScore(u.salary), diffScore(u.difficulty), quotaScore(getLatestStat(u, 'quota'))]
  }))
  radarChart.setOption({
    tooltip: {}, legend: { bottom: 0, textStyle: { color: '#4a5568' } },
    radar: {
      indicator: indicators, radius: '62%', center: ['50%', '46%'],
      axisName: { color: '#4a5568', fontSize: 12 },
      splitLine: { lineStyle: { color: '#dbe4ee' } }, splitArea: { areaStyle: { color: ['#fff', '#f7fafc'] } },
      axisLine: { lineStyle: { color: '#cbd5e0' } }
    },
    series: [{ type: 'radar', data }]
  })
}

watch(selectedUni, async (uni) => {
  trendChart?.dispose(); pieChart?.dispose(); trendChart = null; pieChart = null
  if (uni) { await nextTick(); renderDetailCharts(uni) }
})
watch(compareVisible, async (v) => {
  radarChart?.dispose(); radarChart = null
  if (v) { await nextTick(); renderRadar() }
})
const handleResize = () => { trendChart?.resize(); pieChart?.resize(); radarChart?.resize() }
onMounted(() => window.addEventListener('resize', handleResize))
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose(); pieChart?.dispose(); radarChart?.dispose()
})

/* ============================================================
   择校推荐器（冲 / 稳 / 保）
   ============================================================ */
const recScore = ref(360)
const recRegion = ref('')
const rec408Only = ref(false)
const recAIOnly = ref(false)
const recExclude408 = ref(false)

const referenceScore = (uni: any): number | null => {
  const raw = getLatestStat(uni, 'avgScore') ?? numVal(uni.targetScore) ?? numVal(uni.scoreLine)
  // 过滤 0 / "待更新" / 明显不合理的占位值（考研总分线不会低于 200）
  return (raw !== null && Number.isFinite(raw) && raw >= 200) ? raw : null
}

const matchPool = computed(() => {
  return universitiesData.filter((u: any) => {
    if (referenceScore(u) === null) return false
    if (recRegion.value) {
      const region = u.region || ''
      if (recRegion.value === '其他') {
        const c = ['北京', '上海', '江苏', '浙江', '广东', '湖北', '四川']
        if (c.some(x => region.includes(x))) return false
      } else if (!region.includes(recRegion.value)) return false
    }
    if (rec408Only.value && !u.is408Change) return false
    if (recAIOnly.value && !u.hasAI) return false
    if (recExclude408.value && u.is408Change) return false
    return true
  })
})

const recommend = computed(() => {
  const t = numVal(recScore.value)
  const buckets: any = { rush: [], stable: [], safety: [] }
  if (t === null) return buckets
  matchPool.value.forEach((u: any) => {
    const ref = referenceScore(u)!
    const diff = t - ref
    const item = { uni: u, ref, gap: diff }
    if (diff < -5) buckets.rush.push(item)
    else if (diff <= 20) buckets.stable.push(item)
    else buckets.safety.push(item)
  })
  buckets.rush.sort((a: any, b: any) => a.ref - b.ref)        // 冲: 最接近的在前
  buckets.stable.sort((a: any, b: any) => b.ref - a.ref)
  buckets.safety.sort((a: any, b: any) => b.ref - a.ref)
  return buckets
})

const recReason = (item: any, type: string): string => {
  if (type === 'rush') return `往年参照线约 ${item.ref} 分，比你目标高 ${item.gap < 0 ? -item.gap : item.gap} 分，需冲`
  if (type === 'stable') return `参照线约 ${item.ref} 分，与目标分基本持平，较稳`
  return `高出参照线约 ${item.gap} 分，可作保底`
}

const matcherRegions = ['北京', '上海', '江苏', '浙江', '广东', '湖北', '四川', '其他']

/* ============================================================
   择校方法论 / 避坑指南
   ============================================================ */
const methodOpen = ref(true)
const methodology = [
  { icon: '🎯', title: '冲稳保怎么定', body: '以"录取均分/最新复试线"为参照线：目标分低于参照线 5 分以上=冲；持平或高 20 分以内=稳；高出 20 分以上=保。建议 1 冲 + 1~2 稳 + 1 保，别全冲也别全保。' },
  { icon: '🔁', title: '警惕大小年', body: '单看一年分数线容易被骗。前一年暴涨、复试线偏高往往是"大年"，次年常回落。一定看 3 年以上的走势（点开详情看折线图），判断是趋势还是波动。' },
  { icon: '📉', title: '报录比 ≠ 复录比', body: '报录比含弃考/划水，真实竞争看"录取数 ÷ 进复试数"。名额被推免大幅挤占的专业，统考实际名额要单独确认，别看简章总数。' },
  { icon: '⚠️', title: '改考 408 的机会与风险', body: '改统考 408 通常更公平、可参考全国数据、复习方向明确；但对基础弱者难度上升。自命题改 408 的当年往往是"大小年"拐点，值得博，但要用实力兜底。' },
  { icon: '🏫', title: '校区与学院口径', body: '哈工大(深圳)、山大(威海)、各类"研究院/校区"分数线和培养可能不同。对比时确认口径一致，别把学硕(081200)线和专硕(085404)线混看。' },
  { icon: '🛡️', title: '保护一志愿/复试公平', body: '优先选保护一志愿、复试刷人比例稳定、不歧视双非的院校。查拟录取名单看是否有大量调剂、双非考生占比，判断实际友好度。' }
]
</script>

<style scoped>
.universities-container {
  --font-display: 'Barlow Condensed', 'FZCuHei', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --gold: #ffc53d;
  --navy-deep: #0d2137;
  --navy: #16345c;
  --line: #e4ebf3;
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  background: linear-gradient(180deg, #f5f8fc 0%, #edf2f8 100%);
  min-height: 100vh;
}

/* 头部 */
.page-header {
  text-align: left;
  margin-bottom: 28px;
  padding: 38px 40px 32px;
  background: linear-gradient(150deg, #0d2137 0%, #16345c 60%, #1e4576 100%);
  border-radius: 14px;
  color: white;
  box-shadow: 0 8px 32px rgba(13, 33, 55, 0.25);
  position: relative;
  overflow: hidden;
}

.ph-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
  background-size: 44px 44px;
  pointer-events: none;
}

.ph-glow {
  position: absolute;
  top: -70%;
  right: -8%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255,197,61,0.13) 0%, transparent 70%);
  pointer-events: none;
}

.ph-inner {
  position: relative;
  z-index: 1;
}

.ph-kicker {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  color: var(--gold);
  text-transform: uppercase;
}

.page-header h1 {
  font-size: clamp(1.8rem, 3.5vw, 2.5rem);
  margin: 8px 0 6px 0;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.page-header h1 .gold {
  color: var(--gold);
}

.subtitle {
  font-size: 0.95rem;
  color: #a8bdd4;
  margin: 0;
  letter-spacing: 0.06em;
}

.data-updated {
  margin: 10px auto 0;
  display: inline-block;
  font-size: 0.78rem;
  letter-spacing: 0.05em;
  color: #ffd77a;
  background: rgba(255, 197, 61, 0.1);
  border: 1px solid rgba(255, 197, 61, 0.3);
  border-radius: 999px;
  padding: 5px 16px;
}

/* 筛选区 */
.filter-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid rgba(255,255,255,0.5);
}

.search-box {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 14px 24px;
  font-size: 16px;
  border: 2px solid #e8ecf1;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.search-input:focus {
  outline: none;
  border-color: #16345c;
  box-shadow: 0 0 0 4px rgba(22, 52, 92, 0.10), 0 4px 12px rgba(13, 33, 55, 0.08);
  transform: translateY(-1px);
}

.filter-controls {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.filter-select {
  padding: 12px 18px;
  font-size: 14px;
  border: 2px solid #e8ecf1;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  font-weight: 500;
}

.filter-select:hover {
  border-color: #16345c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 33, 55, 0.10);
}

.filter-select:focus {
  outline: none;
  border-color: #16345c;
  box-shadow: 0 0 0 3px rgba(22, 52, 92, 0.10);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.stats-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
}

.stat-item {
  font-size: 14px;
  color: #666;
}

.reset-btn {
  padding: 10px 24px;
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  color: #ffc53d;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(13, 33, 55, 0.25);
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 33, 55, 0.35);
}

.reset-btn:active {
  transform: translateY(0);
}

/* 院校网格 */
.universities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

/* 院校卡片 */
.university-card {
  background: white;
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 2px 12px rgba(13, 33, 55, 0.05);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 1px solid #e4ebf3;
}

.university-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ffc53d 0%, #f0a820 100%);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 1;
}

.university-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(13, 33, 55, 0.13);
  border-color: rgba(255, 197, 61, 0.45);
}

.university-card:hover::before {
  opacity: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  padding: 16px 16px 12px 16px;
  background: linear-gradient(135deg, #fafbfc 0%, #f5f8fc 100%);
  border-bottom: 1px solid #e4ebf3;
}

.uni-name {
  font-size: 1.2em;
  margin: 0;
  color: #1a202c;
  font-weight: 700;
  line-height: 1.4;
  flex: 1;
  letter-spacing: -0.01em;
}

/* 学院信息 */
.college-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f0f5fa 100%);
  border-radius: 0;
  margin-bottom: 0;
  border: none;
  border-bottom: 1px solid #eef3f8;
}

.college-label {
  font-size: 16px;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
}

.college-name {
  font-size: 13px;
  color: #4a5568;
  font-weight: 500;
  line-height: 1.4;
}

.level-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: all 0.3s;
  white-space: nowrap;
  flex-shrink: 0;
  letter-spacing: 0.02em;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.university-card:hover .level-badge {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.level-badge.c9 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.level-badge.g985 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.level-badge.g211 {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.level-badge.双非 {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.card-body {
  padding: 14px 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #eef3f8;
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  color: #718096;
  font-size: 13px;
  font-weight: 500;
}

.value {
  color: #2d3748;
  font-weight: 600;
  font-size: 13px;
  text-align: right;
}

.value.score {
  color: #e53e3e;
  font-weight: 700;
  font-size: 14px;
}

/* 专业预览样式 */
.majors-preview {
  padding: 8px 0 6px 0;
  border-bottom: 1px solid #eef3f8;
}

.majors-preview .label {
  margin-bottom: 8px;
  font-weight: 600;
}

.major-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.major-tag {
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  border-radius: 12px;
  font-size: 11px;
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(13, 33, 55, 0.2);
  transition: all 0.2s;
}

.university-card:hover .major-tag {
  box-shadow: 0 3px 10px rgba(13, 33, 55, 0.3);
}

.major-type {
  font-size: 10px;
  color: rgba(255,255,255,0.85);
  font-weight: 500;
  margin-left: 2px;
}

.more-tag {
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 12px;
  font-size: 11px;
  color: white;
  font-weight: 600;
}

.grade-a-plus {
  color: #f5576c;
  font-weight: bold;
}

.grade-a {
  color: #ff6b6b;
  font-weight: bold;
}

.grade-a-minus {
  color: #ffa502;
  font-weight: bold;
}

.grade-b-plus {
  color: #2ed573;
  font-weight: bold;
}

.grade-b {
  color: #1e90ff;
  font-weight: bold;
}

.grade-none {
  color: #999;
  font-style: italic;
}

.difficulty-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  transition: all 0.2s;
}

.difficulty-badge.s\+ {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.difficulty-badge.s {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.difficulty-badge.a\+ {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  color: white;
}

.difficulty-badge.a {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  color: #c05621;
}

.difficulty-badge.a- {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #2b6cb0;
}

.difficulty-badge.b\+ {
  background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%);
  color: #22543d;
}

.difficulty-badge.b {
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  color: #2a4365;
}

/* 标签 */
.card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  padding: 0 16px 12px 16px;
}

.tag {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  background: linear-gradient(135deg, #f5f8fc 0%, #edf2f8 100%);
  color: #16345c;
  font-weight: 600;
  border: 1px solid rgba(22, 52, 92, 0.12);
  transition: all 0.2s;
}

.tag:hover {
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  color: #ffc53d;
  border-color: transparent;
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(13, 33, 55, 0.25);
}

.tag-408 {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  color: #856404;
  border-color: rgba(133, 100, 4, 0.2);
}

.tag-408:hover {
  background: linear-gradient(135deg, #856404 0%, #d69e2e 100%);
  color: white;
  border-color: transparent;
}

.tag-ai {
  background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
  color: #0c5460;
  border-color: rgba(12, 84, 96, 0.2);
}

.tag-ai:hover {
  background: linear-gradient(135deg, #0c5460 0%, #234e52 100%);
  color: white;
  border-color: transparent;
}

.detail-btn {
  width: 100%;
  padding: 12px 16px;
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  color: #ffc53d;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 14px rgba(13, 33, 55, 0.25);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.02em;
}

.detail-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.detail-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(13, 33, 55, 0.35);
}

.detail-btn:hover::before {
  width: 300px;
  height: 300px;
}

.detail-btn:active {
  transform: translateY(0);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state p {
  font-size: 1.2em;
  margin-bottom: 20px;
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: white;
  transform: rotate(90deg) scale(1.1);
  box-shadow: 0 6px 16px rgba(0,0,0,0.2);
}

.modal-header {
  padding: 18px 24px 14px;
  background: linear-gradient(150deg, #0d2137 0%, #16345c 100%);
  color: white;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.45em;
  letter-spacing: 0.5px;
}

.header-badges {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.header-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12.5px;
  background: rgba(255,255,255,0.09);
  border: 1px solid rgba(255,255,255,0.14);
  color: rgba(255,255,255,0.88);
}

.meta-chip b {
  font-size: 13.5px;
}

.meta-chip.accent {
  background: rgba(255,197,61,0.13);
  border-color: rgba(255,197,61,0.35);
}

.meta-chip.accent b {
  color: #ffc53d;
  font-size: 14.5px;
}

.header-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.header-tag {
  padding: 2px 9px;
  border-radius: 10px;
  font-size: 11px;
  background: rgba(255,255,255,0.06);
  border: 1px dashed rgba(255,255,255,0.25);
  color: rgba(255,255,255,0.65);
}

.modal-body {
  padding: 22px 24px;
}

.detail-section {
  margin-bottom: 32px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 16px;
  border: 1px solid #e8ecf1;
}

.detail-section h3 {
  font-size: 1.3em;
  margin-bottom: 16px;
  color: #2d3748;
  border-bottom: 2px solid #ffc53d;
  padding-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: all 0.3s;
  border: 1px solid #e8ecf1;
}

.detail-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.detail-item .label {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.detail-item .value {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}

.data-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.data-table tbody tr:hover {
  background: #f8f9fa;
}

/* 表格横向滚动容器（移动端防溢出） */
.table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 10px;
  border: 1px solid #e8ecf1;
}

.table-wrap .data-table {
  min-width: 560px;
}

.table-wrap .data-table.majors-table {
  min-width: 920px;
}

.table-wrap .data-table th:first-child,
.table-wrap .data-table td:first-child {
  position: sticky;
  left: 0;
  background: #f8f9fa;
  z-index: 2;
  box-shadow: 2px 0 4px rgba(0,0,0,0.04);
}

.table-wrap .data-table tbody tr:hover td:first-child {
  background: #f8f9fa;
}

.score-cell {
  color: #f5576c;
  font-weight: bold;
}

.exam-subjects {
  display: grid;
  gap: 10px;
}

.subject-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  gap: 15px;
}

.subject-item.highlight {
  background: linear-gradient(135deg, rgba(255,197,61,0.08) 0%, rgba(240,168,32,0.12) 100%);
  border: 2px solid rgba(255, 197, 61, 0.5);
}

.subject-code {
  padding: 4px 12px;
  background: #16345c;
  color: #ffc53d;
  border-radius: 4px;
  font-weight: bold;
  min-width: 50px;
  text-align: center;
}

.subject-name {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.subject-score {
  font-weight: bold;
  color: #16345c;
}

.total-score {
  text-align: right;
  margin-top: 15px;
  font-size: 1.1em;
}

.employment-list {
  display: grid;
  gap: 10px;
}

.employment-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  gap: 15px;
}

.direction {
  flex: 1;
  font-weight: 500;
  color: #333;
}

.percentage {
  padding: 4px 12px;
  background: #16345c;
  color: #ffc53d;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.companies {
  flex: 2;
  font-size: 13px;
  color: #666;
}

.salary-info {
  margin-top: 15px;
  padding: 15px;
  background: linear-gradient(135deg, rgba(255,197,61,0.08) 0%, rgba(240,168,32,0.12) 100%);
  border-radius: 8px;
  text-align: center;
}

.advice-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 15px;
}

.advice-card {
  padding: 15px;
  border-radius: 8px;
}

.advice-card.pros {
  background: #e8f5e9;
}

.advice-card.cons {
  background: #ffebee;
}

.advice-card h4 {
  margin: 0 0 10px 0;
  font-size: 1em;
}

.advice-card ul {
  margin: 0;
  padding-left: 20px;
}

.advice-card li {
  margin-bottom: 5px;
  font-size: 14px;
}

.target-score {
  text-align: center;
  padding: 15px;
  background: linear-gradient(135deg, rgba(255,197,61,0.08) 0%, rgba(240,168,32,0.12) 100%);
  border-radius: 8px;
  font-size: 1.1em;
}

.links-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.link-item {
  padding: 14px 18px;
  background: white;
  border-radius: 8px;
  color: #16345c;
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid #e4ebf3;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.link-item:hover {
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  color: #ffc53d;
  border-color: #16345c;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(13, 33, 55, 0.25);
}

/* ===== 排序下拉框 ===== */
.sort-select {
  border-color: rgba(255, 197, 61, 0.5);
  background: linear-gradient(135deg, #fffdf5 0%, #fff8e6 100%);
}

/* ===== 卡片底部按钮区 ===== */
.card-footer {
  display: flex;
  gap: 8px;
  padding: 0 16px 16px 16px;
}

.compare-btn {
  flex: 0 0 auto;
  padding: 12px 14px;
  background: white;
  color: #16345c;
  border: 2px solid #e4ebf3;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.compare-btn:hover {
  border-color: #16345c;
  background: #f5f8fc;
  transform: translateY(-2px);
}

.compare-btn.active {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: #0d2137;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(67, 233, 123, 0.35);
}

.detail-btn {
  flex: 1;
}

/* ===== 底部浮动对比栏 ===== */
.compare-bar {
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  width: min(920px, calc(100% - 32px));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 20px;
  background: rgba(13, 33, 55, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
  z-index: 900;
  animation: compareBarIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes compareBarIn {
  from { opacity: 0; transform: translateX(-50%) translateY(20px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.compare-bar-items {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
}

.compare-bar-label {
  color: #ffc53d;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}

.compare-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px 5px 12px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 197, 61, 0.3);
  border-radius: 20px;
  color: white;
  font-size: 13px;
  font-weight: 500;
}

.chip-remove {
  width: 18px;
  height: 18px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 13px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.chip-remove:hover {
  background: #f5576c;
  transform: scale(1.1);
}

.compare-bar-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.compare-clear {
  padding: 10px 16px;
  background: transparent;
  color: #a8bdd4;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
}

.compare-clear:hover {
  color: white;
  border-color: rgba(255, 255, 255, 0.5);
}

.compare-go {
  padding: 10px 20px;
  background: linear-gradient(135deg, #ffc53d 0%, #f0a820 100%);
  color: #0d2137;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 14px rgba(255, 197, 61, 0.35);
}

.compare-go:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 197, 61, 0.5);
}

/* ===== 对比弹窗 ===== */
.compare-modal {
  max-width: 1000px;
}

.compare-table-wrap {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e8ecf1;
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 520px;
}

.compare-table th,
.compare-table td {
  padding: 14px 16px;
  text-align: center;
  border-bottom: 1px solid #eef3f8;
  font-size: 14px;
}

.compare-table thead th {
  background: linear-gradient(135deg, #0d2137 0%, #16345c 100%);
  color: #ffc53d;
  font-size: 15px;
  font-weight: 700;
  position: sticky;
  top: 0;
}

.compare-table tbody tr:nth-child(even) {
  background: #f8fafc;
}

.compare-table tbody tr:hover {
  background: #fff8e6;
}

.compare-row-label {
  text-align: left !important;
  font-weight: 600;
  color: #4a5568;
  background: #f5f8fc !important;
  white-space: nowrap;
  width: 110px;
}

.compare-table thead th.compare-row-label {
  background: linear-gradient(135deg, #0d2137 0%, #16345c 100%) !important;
  color: #a8bdd4;
}

/* 给浮动对比栏留出底部空间 */
.universities-container {
  padding-bottom: 100px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .universities-container {
    padding: 14px;
    padding-bottom: 110px;
  }

  .page-header {
    padding: 26px 22px 22px;
  }

  .page-header h1 {
    font-size: 1.8em;
  }

  .filter-section {
    padding: 16px;
  }

  .filter-controls {
    flex-direction: column;
    gap: 10px;
  }

  .filter-select {
    width: 100%;
  }

  /* 两个复选框并排，不占满整行 */
  .checkbox-label {
    display: inline-flex;
    width: auto;
    margin-right: 14px;
  }

  .universities-grid {
    grid-template-columns: 1fr;
  }

  .detail-grid,
  .advice-grid {
    grid-template-columns: 1fr;
  }

  .modal-overlay {
    padding: 10px;
  }

  .modal-content {
    max-height: 95vh;
    border-radius: 16px;
  }

  .modal-header {
    padding: 20px 18px;
  }

  .modal-header h2 {
    font-size: 1.4em;
  }

  .header-meta {
    gap: 6px;
  }

  .meta-chip {
    font-size: 12px;
    padding: 3px 8px;
  }

  .meta-chip b {
    font-size: 13px;
  }

  .meta-chip.accent b {
    font-size: 14px;
  }

  .modal-body {
    padding: 16px;
  }

  .detail-section {
    padding: 16px;
    margin-bottom: 20px;
  }

  .table-wrap .data-table th,
  .table-wrap .data-table td {
    padding: 9px 10px;
    font-size: 13px;
  }

  /* 对比浮动栏：紧凑全宽 */
  .compare-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    padding: 12px 14px;
    bottom: 12px;
    width: calc(100% - 24px);
  }

  .compare-bar-actions {
    justify-content: flex-end;
  }

  .compare-table th,
  .compare-table td {
    padding: 10px 12px;
    font-size: 13px;
  }
}

/* ================= 择校推荐器 ================= */
.matcher-card {
  background: linear-gradient(160deg, #ffffff 0%, #f5f8fc 100%);
  border: 1px solid #e4ebf3;
  border-top: 4px solid #16345c;
  border-radius: 16px;
  padding: 20px 22px 24px;
  margin: 0 0 22px;
  box-shadow: 0 8px 28px rgba(13, 33, 55, 0.08);
}

.matcher-head h3 {
  margin: 0 0 6px;
  font-size: 1.28em;
  color: #16345c;
  letter-spacing: 0.3px;
}

.matcher-sub {
  margin: 0 0 16px;
  font-size: 13px;
  color: #718096;
  line-height: 1.6;
}

.matcher-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 16px 22px;
  padding: 14px 16px;
  background: rgba(22, 52, 92, 0.03);
  border: 1px solid #e6ecf3;
  border-radius: 12px;
  margin-bottom: 20px;
}

.mc-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.mc-label {
  font-size: 12px;
  font-weight: 600;
  color: #4a5568;
}

.mc-input,
.mc-select {
  padding: 9px 12px;
  border: 1.5px solid #d6e0ec;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #16345c;
  background: white;
  min-width: 110px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.mc-input:focus,
.mc-select:focus {
  outline: none;
  border-color: #ffc53d;
  box-shadow: 0 0 0 3px rgba(255, 197, 61, 0.18);
}

.mc-checks {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-left: auto;
}

.mc-check {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #4a5568;
  cursor: pointer;
  white-space: nowrap;
}

.mc-check input {
  width: 16px;
  height: 16px;
  accent-color: #16345c;
  cursor: pointer;
}

.matcher-cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.mc-col {
  background: white;
  border: 1px solid #eaeff5;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
}

.mc-col.rush { border-top: 3px solid #f5576c; }
.mc-col.stable { border-top: 3px solid #ffc53d; }
.mc-col.safety { border-top: 3px solid #4facfe; }

.mc-col-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}

.mc-tag {
  font-size: 1.05em;
  font-weight: 800;
  color: #16345c;
}

.mc-count {
  font-size: 12px;
  font-weight: 700;
  color: #718096;
  background: #f0f4f9;
  padding: 2px 10px;
  border-radius: 12px;
}

.mc-col-tip {
  margin: 2px 0 12px;
  font-size: 12px;
  color: #a0aec0;
}

.mc-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mitem {
  padding: 9px 11px;
  border: 1px solid #eef2f7;
  border-radius: 9px;
  background: #fafcfe;
  cursor: pointer;
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}

.mitem:hover {
  border-color: #16345c;
  background: #fffdf5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(13, 33, 55, 0.12);
}

.mitem-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.mitem-name {
  font-size: 14px;
  font-weight: 700;
  color: #16345c;
}

.mitem-ref {
  font-size: 12px;
  font-weight: 700;
  color: #e53e3e;
  white-space: nowrap;
}

.mitem-sub {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.mitem-badge {
  font-size: 11px;
  color: #718096;
  background: #eef3f8;
  padding: 1px 7px;
  border-radius: 8px;
  white-space: nowrap;
}

.mitem-reason {
  font-size: 11.5px;
  color: #8a97a8;
  flex: 1;
  min-width: 120px;
}

.mitem-empty {
  padding: 14px 10px;
  text-align: center;
  font-size: 12.5px;
  color: #b0bac6;
  border: 1px dashed #e2e8f0;
  border-radius: 9px;
}

/* ================= 择校方法论 ================= */
.method-card {
  background: white;
  border: 1px solid #e4ebf3;
  border-radius: 16px;
  margin: 0 0 22px;
  overflow: hidden;
  box-shadow: 0 6px 22px rgba(13, 33, 55, 0.06);
}

.method-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 22px;
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  border: none;
  cursor: pointer;
}

.mt-title {
  font-size: 1.15em;
  font-weight: 700;
  color: #ffc53d;
  letter-spacing: 0.3px;
}

.mt-arrow {
  font-size: 18px;
  color: #ffc53d;
  transition: transform 0.25s;
}

.mt-arrow.open { transform: rotate(180deg); }

.method-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  padding: 20px 22px;
}

.method-item {
  padding: 14px 16px;
  background: #f8fafc;
  border: 1px solid #eef2f7;
  border-left: 3px solid #ffc53d;
  border-radius: 10px;
  transition: all 0.2s;
}

.method-item:hover {
  background: #fffdf5;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(13, 33, 55, 0.08);
}

.mi-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.mi-icon { font-size: 18px; }

.mi-title {
  font-size: 14.5px;
  font-weight: 700;
  color: #16345c;
}

.mi-body {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: #4a5568;
}

/* ================= 图表容器 ================= */
.chart-caption {
  margin: 18px 0 6px;
  font-size: 13px;
  font-weight: 600;
  color: #16345c;
}

.chart-box {
  width: 100%;
  height: 300px;
}

.chart-box.pie { height: 280px; }
.chart-box.radar { height: 380px; }

@media (max-width: 768px) {
  .matcher-card { padding: 16px 12px 18px; }
  .matcher-controls { gap: 12px; }
  .mc-checks { margin-left: 0; width: 100%; }
  .matcher-cols { grid-template-columns: 1fr; }
  .method-grid { grid-template-columns: 1fr; padding: 16px 14px; }
  .chart-box { height: 240px; }
  .chart-box.radar { height: 320px; }
}
</style>
