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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import universitiesData from '../data/universities.json'

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
</style>
