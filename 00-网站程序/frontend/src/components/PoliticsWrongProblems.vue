<script setup lang="ts">
import { useWrongProblemsStore } from '@/stores/wrongProblems'
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, DocumentChecked, Upload, Picture, CopyDocument, MagicStick, ArrowDown } from '@element-plus/icons-vue'
import {
  deriveCause, CAUSE_META, CAUSE_ORDER, subjectPrefix,
  type CauseKey,
} from '@/data/politicsWrongCause'
import { POLITICS_WRONG_SEED } from '@/data/politicsWrongSeed'
// 一刷 483 题逐题细读的真实字母明细（漏选/错选 + 为什么）：
// 有数据时错因一律以真实作答为准，不再用订正文本正则猜；没有的题（新录入）自动回退 deriveCause。
import { loadPoliticsVuln, letters, realCauseKey, groupOfQuestion } from '@/data/politicsVuln'

interface WrongProblem {
  id: string
  chapterId: string
  chapterName: string
  sectionId: string
  sectionName: string
  title: string
  content: string
  mistakeType: string
  importance: number
  correction: string
  createdAt: string
  reviewCount: number
  lastReviewAt: string
  mastered: boolean
}

const wp = useWrongProblemsStore(); const problems = wp.bind('politics', POLITICS_WRONG_SEED)
const activeTab = ref('list')
const showAddDialog = ref(false)
const selectedProblem = ref<WrongProblem | null>(null)

// 图片录入相关状态
const imageUploadMode = ref(false) // 是否启用图片录入模式
const uploadedImages = ref<string[]>([]) // 上传的图片列表（base64）
const imagePreviewUrl = ref('') // 当前预览的图片URL
const ocrTipVisible = ref(true) // 是否显示OCR提示

// 错题展开状态管理（记录每道题的订正笔记是否展开）
const expandedCorrections = ref<Set<string>>(new Set())

const newProblem = ref({
  chapterId: '',
  chapterName: '',
  sectionId: '',
  sectionName: '',
  title: '',
  content: '',
  mistakeType: '',
  importance: 3,
  correction: ''
})

const mistakeTypes = [
  { value: '概念不清', label: '概念理解不清' },
  { value: '计算错误', label: '计算错误' },
  { value: '思路错误', label: '解题思路错误' },
  { value: '粗心大意', label: '粗心/审题不清' },
  { value: '不会做', label: '完全不会做' }
]

const chapterFilter = ref('all')
const typeFilter = ref('all')
const masteredFilter = ref('all')
const subjectFilter = ref('all')   // all | my | sg | sx | xxs
const causeFilter = ref<CauseKey | 'all'>('all')

// 计算属性
const filteredProblems = computed(() => {
  return problems.value.filter(p => {
    if (subjectFilter.value !== 'all' && subjectPrefix(p) !== subjectFilter.value) return false
    if (chapterFilter.value !== 'all' && p.chapterId !== chapterFilter.value) return false
    if (causeFilter.value !== 'all' && causeOf(p) !== causeFilter.value) return false
    if (typeFilter.value !== 'all' && p.mistakeType !== typeFilter.value) return false
    if (masteredFilter.value === 'mastered' && !p.mastered) return false
    if (masteredFilter.value === 'unmastered' && p.mastered) return false
    return true
  })
})

const chapters = computed(() => {
  const unique = new Map()
  problems.value.forEach(p => {
    if (!unique.has(p.chapterId)) {
      unique.set(p.chapterId, { id: p.chapterId, name: p.chapterName })
    }
  })
  return Array.from(unique.values())
})

const stats = computed(() => {
  const total = problems.value.length
  const mastered = problems.value.filter(p => p.mastered).length
  const unmastered = total - mastered
  
  const typeStats: Record<string, number> = {}
  problems.value.forEach(p => {
    typeStats[p.mistakeType] = (typeStats[p.mistakeType] || 0) + 1
  })
  
  return { total, mastered, unmastered, typeStats }
})

// ── 错因（客观推导）分布：仅统计未掌握题，掌握后自动退出诊断 ──
const unmasteredProblems = computed(() => problems.value.filter(p => !p.mastered))

const causeStats = computed(() => {
  const m: Record<CauseKey, number> = { 'single-confuse': 0, 'multi-over': 0, 'multi-under': 0, 'multi-both': 0 }
  unmasteredProblems.value.forEach(p => { m[causeOf(p)]++ })
  const total = unmasteredProblems.value.length || 1
  return CAUSE_ORDER.map(k => ({
    ...CAUSE_META[k],
    count: m[k],
    pct: Math.round((m[k] / total) * 100),
  }))
})

// 漏选 / 错选 真实人次（未掌握题范围）——判断瓶颈到底是"记不全"还是"认不出干扰项"
const letterFlow = computed(() => {
  let miss = 0, extra = 0
  unmasteredProblems.value.forEach(p => {
    const r = letters.value[p.id]
    if (!r) return
    miss += (r.miss || []).length
    extra += (r.extra || []).length
  })
  const sum = miss + extra || 1
  return { miss, extra, missPct: Math.round(miss / sum * 100), extraPct: Math.round(extra / sum * 100) }
})

const subjectStats = computed(() => {
  const m: Record<string, number> = { my: 0, sg: 0, sx: 0, xxs: 0 }
  unmasteredProblems.value.forEach(p => { const s = subjectPrefix(p); if (s in m) m[s]++ })
  return [
    { key: 'my', name: '马原', count: m.my },
    { key: 'sg', name: '史纲', count: m.sg },
    { key: 'sx', name: '思修', count: m.sx },
    { key: 'xxs', name: '新思想', count: m.xxs },
  ]
})

/* ── 错因判定：真实字母优先，明细缺失才回退订正文本推导 ──
   （realCauseKey 读的是 wrong-letters.json 里一刷实际作答的漏选/错选集合，
     deriveCause 是从 correction 字符串正则猜，精度差一档）*/
const causeOf = (p: WrongProblem): CauseKey => realCauseKey(p.id) ?? deriveCause(p)
const causeMeta = (p: WrongProblem) => CAUSE_META[causeOf(p)]
const toggleCause = (k: CauseKey) => { causeFilter.value = causeFilter.value === k ? 'all' : k }
const setSubject = (k: string) => { subjectFilter.value = subjectFilter.value === k ? 'all' : k }

/* ── 选项字母级明细（红=漏选/应选，蓝=错选/你选）── */
interface LetterRow { l: string; t: string; why: string }
const letterRec = (p: WrongProblem) => letters.value[p.id] || null
const isSingle = (p: WrongProblem) => letterRec(p)?.qtype === '单选'
const hasLetters = (p: WrongProblem) => !!letters.value[p.id]
const rowsOf = (arr: { l: string; t: string }[] | undefined, why: Record<string, string>): LetterRow[] =>
  (arr || []).map(x => ({ l: x.l, t: x.t, why: why[x.l] || '' }))
const missRows = (p: WrongProblem): LetterRow[] => {
  const r = letterRec(p); return r ? rowsOf(r.miss, r.why) : []
}
const answerLine = (p: WrongProblem) => {
  const r = letterRec(p)
  return r ? `正确 ${r.correct || '—'} ｜ 你选 ${r.mine || '—'}` : ''
}
const extraRows = (p: WrongProblem): LetterRow[] => {
  const r = letterRec(p); return r ? rowsOf(r.extra, r.why) : []
}
/** 该题命中的考点簇 → 供「看它在哪个漏洞簇」直达 */
const vulnOf = (p: WrongProblem) => groupOfQuestion(p.id)
const vulnQuery = (p: WrongProblem) => {
  const g = vulnOf(p)
  return g ? { tab: 'vuln' as const, sub: g.subject, chap: g.chapter, kw: g.group } : { tab: 'vuln' as const, kw: p.id }
}
/** 真实明细覆盖了多少题（数据加载完后角标会从「推导」变「真实」）*/
const realCoveredCount = computed(() => problems.value.filter(p => !!letters.value[p.id]).length)
const realCauseReady = computed(() => realCoveredCount.value > 0)

// 方法
const openAddDialog = () => {
  newProblem.value = {
    chapterId: '',
    chapterName: '',
    sectionId: '',
    sectionName: '',
    title: '',
    content: '',
    mistakeType: '',
    importance: 3,
    correction: ''
  }
  showAddDialog.value = true
}

const addProblem = () => {
  if (!newProblem.value.title || !newProblem.value.mistakeType) {
    ElMessage.warning('请填写题目和错误类型')
    return
  }
  
  const problem: WrongProblem = {
    id: `wrong_${Date.now()}`,
    chapterId: newProblem.value.chapterId || 'unknown',
    chapterName: newProblem.value.chapterName || '未分类',
    sectionId: newProblem.value.sectionId || '',
    sectionName: newProblem.value.sectionName || '',
    title: newProblem.value.title,
    content: newProblem.value.content,
    mistakeType: newProblem.value.mistakeType,
    importance: newProblem.value.importance,
    correction: newProblem.value.correction,
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  }
  
  problems.value.unshift(problem)
  saveToLocalStorage()
  showAddDialog.value = false
  ElMessage.success('错题添加成功')
}

const toggleMastered = (problem: WrongProblem) => {
  problem.mastered = !problem.mastered
  if (problem.mastered) {
    problem.reviewCount++
    problem.lastReviewAt = new Date().toISOString()
  }
  saveToLocalStorage()
  ElMessage.success(problem.mastered ? '已标记为掌握' : '已取消掌握')
}

const deleteProblem = (id: string) => {
  problems.value = problems.value.filter(p => p.id !== id)
  saveToLocalStorage()
  ElMessage.success('已删除')
}

const saveToLocalStorage = () => {
  wp.persist()
}

const loadFromLocalStorage = () => { /* 统一 store 托管载入与持久化 */ }

// ==================== 图片录入相关函数 ====================

// 处理图片上传
const handleImageUpload = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const base64 = e.target?.result as string
    uploadedImages.value.push(base64)
    imagePreviewUrl.value = base64
    ElMessage.success('图片上传成功！请手动提取题目内容并填写到下方表单')
  }
  reader.readAsDataURL(file)
  return false // 阻止自动上传
}

// 删除已上传的图片
const removeImage = (index: number) => {
  uploadedImages.value.splice(index, 1)
  if (uploadedImages.value.length === 0) {
    imagePreviewUrl.value = ''
  } else {
    imagePreviewUrl.value = uploadedImages.value[uploadedImages.value.length - 1]
  }
}

// 切换图片预览模式
const toggleImageMode = () => {
  imageUploadMode.value = !imageUploadMode.value
  if (!imageUploadMode.value) {
    uploadedImages.value = []
    imagePreviewUrl.value = ''
  }
}

// 复制OCR提示文本（方便用户粘贴）
const copyOcrTemplate = () => {
  const template = `【题目标题】
【题目内容】
A. 
B. 
C. 
D. 
【正确答案】
【错误原因/解析】`
  navigator.clipboard.writeText(template).then(() => {
    ElMessage.success('模板已复制到剪贴板，请根据图片内容填写')
  })
}

// 快速填充示例（用于测试）
const fillExampleData = () => {
  newProblem.value = {
    chapterId: 'ch2',
    chapterName: '第二章 线性表',
    sectionId: '2.1',
    sectionName: '2.1 线性表的定义和基本操作',
    title: '顺序表的基本操作',
    content: '在长度为n的顺序表中，插入一个元素的时间复杂度是（）。\nA. O(1)\nB. O(n)\nC. O(logn)\nD. O(n²)',
    mistakeType: '计算错误',
    importance: 4,
    correction: '正确答案：B\n解析：顺序表插入需要移动元素，平均移动n/2个元素，时间复杂度为O(n)。'
  }
  ElMessage.success('已填充示例数据，您可以根据实际图片内容修改')
}

// ==================== 错题展开/折叠功能 ====================

// 切换订正笔记的展开/折叠状态
const toggleCorrection = (problemId: string) => {
  if (expandedCorrections.value.has(problemId)) {
    expandedCorrections.value.delete(problemId)
  } else {
    expandedCorrections.value.add(problemId)
  }
}

// 检查某道题的订正笔记是否展开
const isCorrectionExpanded = (problemId: string) => {
  return expandedCorrections.value.has(problemId)
}

const getImportanceStars = (level: number) => {
  return '⭐'.repeat(level)
}

// 格式化题目内容，按行分割
const formatContent = (content: string): string[] => {
  if (!content) return []
  // 按换行符分割，过滤空行
  return content.split('\n').filter(line => line.trim() !== '')
}

onMounted(() => {
  loadFromLocalStorage()
  // 真实漏选/错选明细（幂等；离线或数据缺失时静默回退到订正文本推导）
  loadPoliticsVuln().catch(() => { /* noop */ })
})

// 暴露方法供外部调用
defineExpose({
  openAddDialog,
  problems
})
</script>

<template>
  <div class="wrong-problems-container">
    <!-- 顶部统计 -->
    <div class="stats-bar">
      <div class="stat-item">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">总错题数</div>
      </div>
      <div class="stat-item mastered">
        <div class="stat-value">{{ stats.mastered }}</div>
        <div class="stat-label">已掌握</div>
      </div>
      <div class="stat-item unmastered">
        <div class="stat-value">{{ stats.unmastered }}</div>
        <div class="stat-label">未掌握</div>
      </div>
    </div>

    <!-- 功能标签页 -->
    <el-tabs v-model="activeTab" class="wrong-tabs">
      <el-tab-pane label="错题列表" name="list">
        <!-- 错因诊断面板（由正确答案 vs 您的答案实时推导） -->
        <div class="cause-board">
          <div class="cause-board-title">
            <span>🩺 错因分布</span>
            <em>点击色块即可筛选，仅统计未掌握题</em>
            <span class="cbt-right">
              <span v-if="realCauseReady" class="src-pill real">真实判定 · 已覆盖 {{ realCoveredCount }} 题</span>
              <span v-else class="src-pill est">订正文本推导</span>
              <router-link class="src-vuln" :to="{ path: '/politics', query: { tab: 'vuln' } }">🕳 考点漏洞地图 ↗</router-link>
            </span>
          </div>
          <div class="cause-chips">
            <button
              class="subject-chip" :class="{ on: subjectFilter === 'all' }"
              @click="subjectFilter = 'all'"
            >全部</button>
            <button
              v-for="s in subjectStats" :key="s.key"
              class="subject-chip" :class="{ on: subjectFilter === s.key }"
              @click="setSubject(s.key)"
            >{{ s.name }} <b>{{ s.count }}</b></button>
          </div>
          <div class="cause-cells">
            <button
              v-for="c in causeStats" :key="c.key"
              class="cause-cell" :class="{ on: causeFilter === c.key }"
              :style="{ '--cc': c.hex }"
              @click="toggleCause(c.key)"
            >
              <span class="cc-bar"></span>
              <span class="cc-name">{{ c.short }}</span>
              <span class="cc-count">{{ c.count }}</span>
              <span class="cc-pct">{{ c.pct }}%</span>
              <span class="cc-track"><i :style="{ width: c.pct + '%' }"></i></span>
            </button>
          </div>
        </div>

        <!-- 筛选栏 -->
        <div class="filter-bar">
          <el-button type="primary" @click="openAddDialog">
            <el-icon><Plus /></el-icon>
            添加错题
          </el-button>
          
          <el-space>
            <el-select v-model="chapterFilter" placeholder="按章节筛选" clearable style="width: 150px">
              <el-option label="全部章节" value="all" />
              <el-option 
                v-for="ch in chapters" 
                :key="ch.id" 
                :label="ch.name" 
                :value="ch.id" 
              />
            </el-select>
            
            <el-select v-model="typeFilter" placeholder="按类型筛选" clearable style="width: 150px">
              <el-option label="全部类型" value="all" />
              <el-option 
                v-for="type in mistakeTypes" 
                :key="type.value" 
                :label="type.label" 
                :value="type.value" 
              />
            </el-select>
            
            <el-select v-model="masteredFilter" placeholder="掌握状态" clearable style="width: 130px">
              <el-option label="全部" value="all" />
              <el-option label="已掌握" value="mastered" />
              <el-option label="未掌握" value="unmastered" />
            </el-select>
          </el-space>
        </div>

        <!-- 错题列表 -->
        <div class="problems-list">
          <el-card 
            v-for="problem in filteredProblems" 
            :key="problem.id"
            class="problem-card"
            :class="{ mastered: problem.mastered }"
          >
            <div class="problem-header">
              <div class="problem-title">
                <h4>{{ problem.title }}</h4>
                <div class="problem-tags">
                  <span class="cause-badge" :style="{ '--cc': causeMeta(problem).hex }">
                    {{ causeMeta(problem).short }}
                    <i v-if="hasLetters(problem)" class="cb-src real" title="由一刷真实作答字母判定">真实</i>
                    <i v-else class="cb-src est" title="订正文本推导（未收录进 483 题明细）">推导</i>
                  </span>
                  <span class="importance">{{ getImportanceStars(problem.importance) }}</span>
                </div>
              </div>
              <div class="problem-actions">
                <el-button 
                  :type="problem.mastered ? 'success' : 'default'"
                  size="small"
                  @click="toggleMastered(problem)"
                >
                  {{ problem.mastered ? '已掌握 ✓' : '标记掌握' }}
                </el-button>
                <el-button 
                  type="danger" 
                  size="small"
                  @click="deleteProblem(problem.id)"
                >
                  删除
                </el-button>
              </div>
            </div>
            
            <div class="problem-meta">
              <span class="pm-item">📚 {{ problem.chapterName }}</span>
              <span class="pm-item" v-if="problem.sectionName">{{ problem.sectionName }}</span>
              <span class="pm-item">📅 {{ new Date(problem.createdAt).toLocaleDateString() }}</span>
              <span class="pm-item" v-if="problem.reviewCount > 0">复习 {{ problem.reviewCount }} 次</span>
            </div>
            
            <div v-if="problem.content" class="problem-content">
              <strong>题目内容：</strong>
              <div class="content-text">
                <div v-for="(line, index) in formatContent(problem.content)" :key="index" class="content-line">
                  {{ line }}
                </div>
              </div>
            </div>

            <!-- 选项字母级解剖（真实一刷作答）：红=漏选/应选，蓝=错选/你选 -->
            <div v-if="hasLetters(problem)" class="letter-anatomy">
              <div class="la-head">
                <span class="la-tag">{{ isSingle(problem) ? '单选 · 两个"看着都对"的选反了' : '多选 · 逐项解剖' }}</span>
                <span class="la-answer">{{ answerLine(problem) }}</span>
                <router-link
                  v-if="vulnOf(problem)"
                  class="la-vuln"
                  :to="{ path: '/politics', query: vulnQuery(problem) }"
                  :title="'跳到考点漏洞地图：' + (vulnOf(problem)?.group || '')"
                >🕳 {{ vulnOf(problem)?.group }} · 同簇一刷错 {{ vulnOf(problem)?.count }} 题 ↗</router-link>
              </div>

              <div class="la-rows">
                <div v-for="r in missRows(problem)" :key="'m-' + problem.id + r.l" class="la-row miss">
                  <span class="la-badge">{{ isSingle(problem) ? '◆ 应选' : '● 漏选' }} {{ r.l }}</span>
                  <div class="la-body">
                    <p class="la-text">{{ r.t }}</p>
                    <p v-if="r.why" class="la-why">{{ r.why }}</p>
                  </div>
                </div>
                <div v-for="r in extraRows(problem)" :key="'e-' + problem.id + r.l" class="la-row extra">
                  <span class="la-badge">{{ isSingle(problem) ? '◇ 你选' : '▲ 错选' }} {{ r.l }}</span>
                  <div class="la-body">
                    <p class="la-text">{{ r.t }}</p>
                    <p v-if="r.why" class="la-why">{{ r.why }}</p>
                  </div>
                </div>
              </div>

              <p v-if="vulnOf(problem)" class="la-cure">
                <b>抄进手册：</b>{{ vulnOf(problem)?.questions.find(q => q.id === problem.id)?.mark || '回到该簇卡片照抄标注短语' }}
              </p>
            </div>

            <div v-if="problem.correction" class="problem-correction">
              <div class="correction-header" @click="toggleCorrection(problem.id)">
                <strong>订正笔记</strong>
                <el-icon 
                  class="expand-icon" 
                  :class="{ expanded: isCorrectionExpanded(problem.id) }"
                >
                  <ArrowDown />
                </el-icon>
              </div>
              <transition name="expand">
                <div v-show="isCorrectionExpanded(problem.id)" class="correction-text">
                  {{ problem.correction }}
                </div>
              </transition>
            </div>
          </el-card>
          
          <div v-if="filteredProblems.length === 0" class="empty-state">
            <el-icon size="80" color="#c0c4cc"><DocumentChecked /></el-icon>
            <p>暂无错题记录</p>
            <el-button type="primary" @click="openAddDialog">添加第一道错题</el-button>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="统计分析" name="stats">
        <div class="stats-content">
          <el-card class="ca-card">
            <template #header>
              <h3>错因结构 · 优先按一刷真实作答字母判定（仅未掌握题）</h3>
            </template>
            <p class="ca-sub">
              真实明细已覆盖 <b>{{ realCoveredCount }}</b> / {{ problems.length }} 题；
              其余为新增错题，暂用订正文本推导。
            </p>
            <div v-if="letterFlow.miss + letterFlow.extra > 0" class="flow-block">
              <div class="flow-title">漏选 vs 错选（真实人次）</div>
              <div class="flow-row">
                <span class="flow-k miss">● 漏选</span>
                <div class="flow-bar"><i class="miss" :style="{ width: letterFlow.missPct + '%' }"></i></div>
                <span class="flow-v">{{ letterFlow.miss }} 次 · {{ letterFlow.missPct }}%</span>
              </div>
              <div class="flow-row">
                <span class="flow-k extra">▲ 错选</span>
                <div class="flow-bar"><i class="extra" :style="{ width: letterFlow.extraPct + '%' }"></i></div>
                <span class="flow-v">{{ letterFlow.extra }} 次 · {{ letterFlow.extraPct }}%</span>
              </div>
              <p class="flow-note">
                {{ letterFlow.extra >= letterFlow.miss
                    ? '错选多于漏选 → 瓶颈是「认不出干扰项」：交卷前逐条反问「这选项话说绝没绝 / 是不是张冠李戴」。'
                    : '漏选多于错选 → 瓶颈是「成套结论记不全」：先把「四大 / 五个 / 四个战略支撑」这类清单补全再判断。' }}
              </p>
            </div>
            <div class="cause-analysis">
              <div v-for="c in causeStats" :key="c.key" class="ca-row" :style="{ '--cc': c.hex }">
                <div class="ca-head">
                  <span class="ca-dot"></span>
                  <span class="ca-label">{{ c.label }}</span>
                  <span class="ca-count">{{ c.count }} 题 · {{ c.pct }}%</span>
                </div>
                <div class="ca-bar"><i :style="{ width: c.pct + '%' }"></i></div>
                <div class="ca-text"><b>病因：</b>{{ c.diag }}</div>
                <div class="ca-text"><b>处方：</b>{{ c.cure }}</div>
              </div>
            </div>
          </el-card>

          <el-card class="ca-card">
            <template #header>
              <h3>分科目待攻克（未掌握错题数）</h3>
            </template>
            <div class="subject-grid">
              <div v-for="s in subjectStats" :key="s.key" class="sg-item">
                <div class="sg-name">{{ s.name }}</div>
                <div class="sg-count">{{ s.count }}</div>
              </div>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加错题对话框 -->
    <el-dialog 
      v-model="showAddDialog" 
      title="添加错题"
      width="800px"
      :close-on-click-modal="false"
    >
      <!-- 图片录入模式切换按钮 -->
      <div style="margin-bottom: 16px; display: flex; gap: 12px; align-items: center;">
        <el-button 
          :type="imageUploadMode ? 'primary' : 'default'" 
          @click="toggleImageMode"
          :icon="Picture"
        >
          {{ imageUploadMode ? '关闭图片预览' : '启用图片录入模式' }}
        </el-button>
        <el-button 
          v-if="imageUploadMode" 
          @click="copyOcrTemplate"
          :icon="CopyDocument"
          size="small"
        >
          复制填写模板
        </el-button>
        <el-button 
          v-if="imageUploadMode && uploadedImages.length === 0" 
          @click="fillExampleData"
          :icon="MagicStick"
          size="small"
        >
          填充示例数据
        </el-button>
      </div>

      <!-- 图片上传和预览区域 -->
      <div v-if="imageUploadMode" style="margin-bottom: 20px; padding: 16px; background: #f5f7fa; border-radius: 8px;">
        <el-alert
          v-if="ocrTipVisible"
          title="💡 使用提示"
          type="info"
          :closable="true"
          @close="ocrTipVisible = false"
          style="margin-bottom: 12px"
        >
          <p style="margin: 4px 0;">1. 点击下方上传按钮或拖拽图片到此处</p>
          <p style="margin: 4px 0;">2. 查看右侧图片，手动提取题目内容</p>
          <p style="margin: 4px 0;">3. 将提取的内容填写到下方表单中</p>
          <p style="margin: 4px 0; color: #e6a23c;">⚠️ 目前需要手动录入，未来可集成OCR自动识别</p>
        </el-alert>

        <el-upload
          class="image-uploader"
          action="#"
          :auto-upload="false"
          :on-change="(file: any) => handleImageUpload(file.raw)"
          :show-file-list="false"
          accept="image/*"
          drag
          multiple
        >
          <el-icon class="el-icon--upload"><Upload /></el-icon>
          <div class="el-upload__text">
            拖拽图片到此处或 <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">支持 JPG/PNG 格式，可同时上传多张图片</div>
          </template>
        </el-upload>

        <!-- 图片预览区 -->
        <div v-if="uploadedImages.length > 0" style="margin-top: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: bold; color: #606266;">已上传 {{ uploadedImages.length }} 张图片</span>
            <el-button size="small" @click="uploadedImages = []; imagePreviewUrl = ''">清空全部</el-button>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px;">
            <div 
              v-for="(img, index) in uploadedImages" 
              :key="index"
              style="position: relative; border: 2px solid #dcdfe6; border-radius: 8px; overflow: hidden; cursor: pointer;"
              :style="{ borderColor: imagePreviewUrl === img ? '#409eff' : '#dcdfe6' }"
              @click="imagePreviewUrl = img"
            >
              <img :src="img" style="width: 100%; height: 150px; object-fit: cover;" />
              <div 
                style="position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.6); color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer;"
                @click.stop="removeImage(index)"
              >
                ×
              </div>
              <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.5); color: white; text-align: center; font-size: 12px; padding: 2px;">
                {{ index + 1 }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 20px;">
        <!-- 左侧：图片预览（大图） -->
        <div v-if="imageUploadMode && imagePreviewUrl" style="flex: 1; max-width: 400px;">
          <div style="border: 2px solid #409eff; border-radius: 8px; overflow: hidden; background: #fff;">
            <img :src="imagePreviewUrl" style="width: 100%; max-height: 600px; object-fit: contain;" />
          </div>
          <p style="text-align: center; color: #909399; font-size: 12px; margin-top: 8px;">
            👆 点击图片放大查看细节
          </p>
        </div>

        <!-- 右侧：表单填写区 -->
        <el-form :model="newProblem" label-position="top" :style="{ flex: imageUploadMode ? 1 : 1 }">
        <el-form-item label="所属章节">
          <el-input v-model="newProblem.chapterName" placeholder="例如：第一章 计算机系统概述" />
        </el-form-item>
        
        <el-form-item label="所属小节">
          <el-input v-model="newProblem.sectionName" placeholder="例如：1.1 计算机发展历程（可选）" />
        </el-form-item>
        
        <el-form-item label="题目标题">
          <el-input v-model="newProblem.title" placeholder="简要描述题目" />
        </el-form-item>
        
        <el-form-item label="题目内容">
          <el-input 
            v-model="newProblem.content" 
            type="textarea" 
            :rows="4"
            placeholder="详细的题目内容..."
          />
        </el-form-item>
        
        <el-form-item label="错误类型">
          <el-select v-model="newProblem.mistakeType" placeholder="选择错误类型" style="width: 100%">
            <el-option 
              v-for="type in mistakeTypes" 
              :key="type.value" 
              :label="type.label" 
              :value="type.value" 
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="重要程度">
          <el-rate v-model="newProblem.importance" :max="5" />
        </el-form-item>
        
        <el-form-item label="订正笔记">
          <el-input 
            v-model="newProblem.correction" 
            type="textarea" 
            :rows="4"
            placeholder="正确的解题思路和答案（可选）"
          />
        </el-form-item>
      </el-form>
      </div>
      
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addProblem">添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
/* ══ 错因诊断面板 ══ */
.cause-board {
  background: linear-gradient(135deg, #f7f9fc 0%, #eef3fa 100%);
  border: 1px solid #e4ebf3;
  border-radius: 12px;
  padding: 14px 16px 16px;
  margin-bottom: 14px;
}
.cause-board-title {
  display: flex; align-items: baseline; gap: 10px;
  font-weight: 700; color: #16345c; font-size: 15px; margin-bottom: 10px;
  em { font-style: normal; font-weight: 400; font-size: 12px; color: #8a97a8; }
}
.cause-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.subject-chip {
  border: 1px solid #d5deea; background: #fff; color: #5b6b7f;
  border-radius: 20px; padding: 4px 12px; font-size: 13px; cursor: pointer;
  transition: all .15s; b { margin-left: 2px; color: #909399; }
  &:hover { border-color: #16345c; }
  &.on { background: #16345c; border-color: #16345c; color: #fff; b { color: #ffc53d; } }
}
.cause-cells { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.cause-cell {
  position: relative; text-align: left; cursor: pointer;
  background: #fff; border: 1px solid #e4ebf3; border-left: 4px solid var(--cc, #ccc);
  border-radius: 10px; padding: 10px 12px; display: flex; flex-direction: column; gap: 2px;
  transition: all .15s;
  &:hover { box-shadow: 0 4px 14px rgba(22,52,92,.10); transform: translateY(-1px); }
  &.on { border-color: var(--cc); box-shadow: 0 0 0 2px color-mix(in srgb, var(--cc) 30%, transparent); }
  .cc-name { font-size: 13px; color: #303133; font-weight: 600; }
  .cc-count { font-size: 22px; font-weight: 800; color: var(--cc); line-height: 1.1; }
  .cc-pct { font-size: 12px; color: #8a97a8; }
  .cc-track { display: block; height: 4px; border-radius: 2px; background: #eef1f6; margin-top: 4px; overflow: hidden;
    i { display: block; height: 100%; background: var(--cc); border-radius: 2px; }
  }
}
.cause-badge {
  display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #fff;
  background: var(--cc, #909399); border-radius: 6px; padding: 1px 8px;
}
.cb-src {
  font-style: normal; font-size: 10px; font-weight: 700; line-height: 1;
  padding: 2px 5px; border-radius: 4px; background: rgba(255,255,255,.24); color: #fff;
  &.est { background: rgba(0,0,0,.16); }
}
.cbt-right { margin-left: auto; display: inline-flex; align-items: center; gap: 10px; }
.src-pill {
  font-style: normal; font-size: 11px; font-weight: 700; border-radius: 999px; padding: 3px 10px;
  &.real { color: #1f4d38; background: #e7f4ec; border: 1px solid rgba(46,158,107,.35); }
  &.est { color: #8a6100; background: #fdf1d6; border: 1px solid rgba(255,197,61,.5); }
}
.src-vuln {
  font-size: 12px; font-weight: 700; color: #16345c; text-decoration: none;
  border-bottom: 1px solid #ffc53d;
  &:hover { color: #e8604c; }
}

/* ══ 选项字母级解剖（真实一刷作答）══ */
.letter-anatomy {
  margin: 12px 0 0; padding: 12px 14px;
  border: 1px solid #e4ebf3; border-left: 4px solid #16345c;
  border-radius: 10px; background: linear-gradient(180deg, #f7faff, #fff);
}
.la-head {
  display: flex; flex-wrap: wrap; align-items: baseline; gap: 10px; margin-bottom: 8px;
}
.la-tag { font-size: 12px; font-weight: 800; color: #16345c; letter-spacing: .02em; }
.la-answer { font-size: 12px; color: #5b6b7f; font-family: 'JetBrains Mono', monospace; }
.la-vuln {
  margin-left: auto; font-size: 12px; font-weight: 700; text-decoration: none;
  color: #8a6100; background: #fdf1d6; border: 1px solid rgba(255,197,61,.5);
  border-radius: 999px; padding: 3px 10px;
  &:hover { background: #ffe9b3; }
}
.la-rows { display: flex; flex-direction: column; gap: 8px; }
.la-row {
  display: grid; grid-template-columns: 92px 1fr; gap: 10px; align-items: start;
  &.miss .la-badge { color: #fff; background: #e8604c; }
  &.extra .la-badge { color: #fff; background: #409eff; }
  &.miss .la-text { border-left: 3px solid rgba(232,96,76,.45); }
  &.extra .la-text { border-left: 3px solid rgba(64,158,255,.45); }
}
.la-badge {
  justify-self: start; font-size: 12px; font-weight: 800; border-radius: 6px; padding: 2px 8px; white-space: nowrap;
}
.la-text {
  margin: 0; font-size: 13.5px; line-height: 1.65; color: #303133;
  padding: 2px 0 2px 10px; word-break: break-word;
}
.la-why { margin: 4px 0 0 10px; font-size: 12.5px; line-height: 1.6; color: #5b6b7f; }
.la-cure {
  margin: 10px 0 0; padding-top: 8px; border-top: 1px dashed #dfe7f0;
  font-size: 12.5px; color: #1f4d38; line-height: 1.6;
  b { color: #16345c; }
}

/* ══ 统计分析：真实明细区 ══ */
.ca-sub { font-size: 12.5px; color: #8a97a8; margin: 0 0 12px; b { color: #16345c; } }
.flow-block {
  border: 1px solid #eef1f6; border-radius: 10px; padding: 12px 14px; margin-bottom: 16px; background: #fbfcfe;
}
.flow-title { font-size: 13px; font-weight: 700; color: #16345c; margin-bottom: 8px; }
.flow-row { display: grid; grid-template-columns: 72px 1fr 110px; gap: 10px; align-items: center; margin-bottom: 6px; }
.flow-k { font-size: 12.5px; font-weight: 700;
  &.miss { color: #e8604c; }
  &.extra { color: #409eff; }
}
.flow-bar { height: 10px; border-radius: 5px; background: #eef1f6; overflow: hidden;
  i { display: block; height: 100%; border-radius: 5px; transition: width .4s;
    &.miss { background: #e8604c; }
    &.extra { background: #409eff; }
  }
}
.flow-v { font-size: 12.5px; color: #5b6b7f; text-align: right; font-family: 'JetBrains Mono', monospace; }
.flow-note { margin: 6px 0 0; font-size: 12.5px; line-height: 1.65; color: #303133; }

/* ══ 统计分析页 ══ */
.stats-content { display: flex; flex-direction: column; gap: 16px; }
.ca-card h3 { font-size: 15px; color: #16345c; margin: 0; }
.cause-analysis { display: flex; flex-direction: column; gap: 16px; }
.ca-row {
  border: 1px solid #eef1f6; border-left: 4px solid var(--cc); border-radius: 10px; padding: 12px 14px;
  .ca-head { display: flex; align-items: center; gap: 8px; }
  .ca-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--cc); }
  .ca-label { font-weight: 700; color: #303133; }
  .ca-count { margin-left: auto; font-size: 13px; color: var(--cc); font-weight: 700; }
  .ca-bar { height: 8px; border-radius: 4px; background: #eef1f6; margin: 8px 0; overflow: hidden;
    i { display: block; height: 100%; background: var(--cc); border-radius: 4px; }
  }
  .ca-text { font-size: 13px; color: #5b6b7f; line-height: 1.6; b { color: #16345c; } }
}
.subject-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.sg-item {
  text-align: center; background: #f7f9fc; border-radius: 10px; padding: 16px 8px;
  .sg-name { font-size: 14px; color: #5b6b7f; }
  .sg-count { font-size: 26px; font-weight: 800; color: #16345c; margin-top: 4px; }
}
@media (max-width: 720px) {
  .cause-cells { grid-template-columns: repeat(2, 1fr); }
  .subject-grid { grid-template-columns: repeat(2, 1fr); }
}

.wrong-problems-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  
  .stats-bar {
    display: flex;
    gap: 20px;
    padding: 16px;
    background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
    border-radius: 12px;
    margin-bottom: 16px;
    
    .stat-item {
      flex: 1;
      text-align: center;
      color: white;
      
      &.mastered {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        padding: 8px;
      }
      
      &.unmastered {
        background: rgba(255, 255, 255, 0.15);
        border-radius: 8px;
        padding: 8px;
      }
      
      .stat-value {
        font-size: 2em;
        font-weight: 700;
        margin-bottom: 4px;
      }
      
      .stat-label {
        font-size: 0.9em;
        opacity: 0.9;
      }
    }
  }
  
  .wrong-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    :deep(.el-tabs__content) {
      flex: 1;
      overflow-y: auto;
      padding: 16px 0;
    }
  }
  
  .filter-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 12px;
    background: #f5f7fa;
    border-radius: 8px;
  }
  
  .problems-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .problem-card {
      transition: all 0.3s;
      border-left: 4px solid #ffc53d;
      
      &.mastered {
        border-left-color: #67c23a;
        opacity: 0.7;
        
        .problem-title h4 {
          text-decoration: line-through;
          color: #909399;
        }
      }
      
      &:hover {
        transform: translateX(4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      .problem-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-wrap: wrap;
        gap: 10px 16px;
        margin-bottom: 12px;
        
        .problem-title {
          flex: 1;
          min-width: 0;
          
          h4 {
            margin: 0 0 8px 0;
            color: #303133;
            font-size: 1.1em;
          }
          
          .problem-tags {
            display: flex;
            gap: 8px;
            align-items: center;
            
            .importance {
              font-size: 0.9em;
            }
          }
        }
        
        .problem-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
        }
      }
      
      .problem-meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px 16px;
        font-size: 0.85em;
        line-height: 1.6;
        color: #909399;
        margin-bottom: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid #ebeef5;
      }
      
      .problem-content,
      .problem-correction {
        margin-bottom: 12px;
        
        strong {
          display: block;
          margin-bottom: 8px;
          color: #606266;
          font-size: 0.95em;
        }
        
        // 订正笔记头部（可点击）
        .correction-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          user-select: none;
          
          &:hover {
            background: linear-gradient(135deg, #ffe0b2 0%, #ffcc80 100%);
            box-shadow: 0 2px 8px rgba(255, 152, 0, 0.2);
          }
          
          strong {
            margin: 0;
            color: #e65100;
            font-weight: 600;
          }
          
          .expand-icon {
            transition: transform 0.3s;
            color: #ff9800;
            font-size: 18px;
            
            &.expanded {
              transform: rotate(180deg);
            }
          }
        }
        
        .content-text,
        .correction-text {
          padding: 16px;
          background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
          border-radius: 8px;
          line-height: 1.7;
          color: #303133;
          font-size: 0.95em;
          max-width: 70ch;
          overflow-wrap: break-word;
        }
        
        .content-text {
          .content-line {
            padding: 6px 0;
            min-height: 24px;
            
            // 题目前缀（非选项行）
            &:first-child:not(:only-child) {
              font-weight: 600;
              color: #303133;
              padding-bottom: 10px;
              border-bottom: 1px dashed #dcdfe6;
              margin-bottom: 8px;
            }
            
            // 选项行样式
            &:not(:first-child) {
              padding-left: 16px;
              position: relative;
              transition: all 0.2s;
              
              &:hover {
                background: rgba(13, 33, 55, 0.08);
                border-radius: 4px;
                padding-left: 20px;
              }
              
              // 选项标识符（A. B. C. D.）加粗
              &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 4px;
                height: 4px;
                background: #16345c;
                border-radius: 50%;
              }
            }
          }
        }
        
        .correction-text {
          white-space: pre-wrap;
          background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
          border-left: 3px solid #ff9800;
          margin-top: 8px;
        }
      }
    }
    
    // 展开/折叠动画
    .expand-enter-active,
    .expand-leave-active {
      transition: all 0.3s ease;
      overflow: hidden;
    }
    
    .expand-enter-from,
    .expand-leave-to {
      opacity: 0;
      max-height: 0;
      padding: 0 16px;
    }
    
    .expand-enter-to,
    .expand-leave-from {
      opacity: 1;
      max-height: 500px;
      padding: 16px;
    }
    
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #909399;
      
      p {
        margin: 16px 0;
        font-size: 1.1em;
      }
    }
  }
  
  .stats-content {
    .type-stats {
      display: flex;
      flex-direction: column;
      gap: 16px;
      
      .type-stat-item {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .type-label {
          min-width: 100px;
        }
        
        :deep(.el-progress) {
          flex: 1;
        }
        
        .type-count {
          min-width: 60px;
          text-align: right;
          font-weight: 600;
          color: #606266;
        }
      }
    }
  }
}
</style>
