<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { useMathStore } from '../stores/math'

interface KnowledgePoint {
  id: string
  title: string
  content: string
  category: string
  difficulty: '基础' | '中等' | '困难'
  importance: 'high' | 'medium' | 'low'
  progress: number
  keyPoints: string[]
  prerequisites?: string[]
  relatedPoints?: string[]
}

interface SubjectConfig {
  name: string
  color: string
  description: string
  categories: string[]
}

const props = defineProps<{
  subject: string
}>()

const activeCategory = ref('')
const selectedPoint = ref<KnowledgePoint | null>(null)
const searchTerm = ref('')
const chapterContent = ref('') // 存储当前选中章节的Markdown内容
const isLoadingContent = ref(false) // 加载状态

// 初始化数学store
const mathStore = useMathStore()

// 学科配置
const subjectConfigs: Record<string, SubjectConfig> = {
  math: {
    name: '数学',
    color: '#FF6B6B',
    description: '高等数学、线性代数、概率论与数理统计',
    categories: ['高等数学', '线性代数', '概率论与数理统计']
  },
  english: {
    name: '英语',
    color: '#4ECDC4',
    description: '阅读理解、完形填空、翻译、写作',
    categories: ['词汇', '语法', '阅读', '写作']
  },
  politics: {
    name: '政治',
    color: '#45B7D1',
    description: '马原、毛中特、史纲、思修法基',
    categories: ['马克思主义原理', '毛泽东思想', '中国近现代史', '思想道德修养']
  },
  cs408: {
    name: '计算机专业课',
    color: '#96CEB4',
    description: '数据结构、计算机组成原理、操作系统、计算机网络',
    categories: ['数据结构', '组成原理', '操作系统', '计算机网络']
  }
}

const currentConfig = computed(() => {
  return subjectConfigs[props.subject] || subjectConfigs.math
})

// 新增：从store动态获取知识点数据
const filteredPoints = computed(() => {
  let points: KnowledgePoint[] = []
  
  // 将store中的chapters转换为KnowledgePoint格式
  const allChapters = mathStore.chapters.map(chapter => ({
    id: chapter.id,
    title: chapter.title,
    content: '', // 初始为空，点击后加载
    category: chapter.subject || '高等数学',
    difficulty: (chapter.difficulty === '进阶' ? '中等' : chapter.difficulty === '难点' ? '困难' : chapter.difficulty) as '基础' | '中等' | '困难',
    importance: 'high' as 'high' | 'medium' | 'low',
    progress: chapter.masteryLevel || 0,
    keyPoints: chapter.keyPoints || []
  }))
  
  points = allChapters
  
  if (activeCategory.value) {
    points = points.filter(point => point.category === activeCategory.value)
  }
  
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    points = points.filter(point => 
      point.title.toLowerCase().includes(term) ||
      point.keyPoints.some(kp => kp.toLowerCase().includes(term))
    )
  }
  
  return points
})

const pointsByCategory = computed(() => {
  const grouped: Record<string, KnowledgePoint[]> = {}
  filteredPoints.value.forEach(point => {
    if (!grouped[point.category]) {
      grouped[point.category] = []
    }
    grouped[point.category].push(point)
  })
  return grouped
})

const getDifficultyColor = (difficulty: string) => {
  const colors: Record<string, string> = {
    '基础': '#4CAF50',
    '中等': '#FF9800',
    '困难': '#F44336'
  }
  return colors[difficulty] || '#9E9E9E'
}

const getImportanceIcon = (importance: string) => {
  const icons: Record<string, string> = {
    'high': '⭐',
    'medium': '🌟',
    'low': '✨'
  }
  return icons[importance] || '⚪'
}

// 新增：加载章节Markdown内容
const loadChapterContent = async (chapterId: string) => {
  isLoadingContent.value = true
  try {
    const content = await mathStore.loadChapterContent(chapterId)
    chapterContent.value = content
    console.log(`成功加载章节 ${chapterId} 的内容`)
  } catch (error) {
    console.error('加载章节内容失败:', error)
    chapterContent.value = '内容加载中...'
  } finally {
    isLoadingContent.value = false
  }
}

// 方法
const selectPoint = async (point: KnowledgePoint) => {
  selectedPoint.value = point
  // 加载该章节的Markdown内容
  await loadChapterContent(point.id)
  // 等待DOM更新完成后执行公式渲染
  await nextTick()
  setTimeout(() => {
    renderMathFormulas()
  }, 50)
}

const renderMathFormulas = () => {
  const contentElement = document.querySelector('.point-content')
  if (!contentElement) return
  
  // 渲染块级公式 $$...$$
  const blockFormulas = contentElement.querySelectorAll('[data-latex-block]')
  blockFormulas.forEach(span => {
    try {
      const formula = span.getAttribute('data-latex-block') || ''
      katex.render(formula, span as HTMLElement, {
        displayMode: true,
        throwOnError: false,
        strict: false
      })
    } catch (e) {
      console.error('块级公式渲染失败:', e)
    }
  })
  
  // 渲染行内公式 $...$
  const inlineFormulas = contentElement.querySelectorAll('[data-latex-inline]')
  inlineFormulas.forEach(span => {
    try {
      const formula = span.getAttribute('data-latex-inline') || ''
      katex.render(formula, span as HTMLElement, {
        displayMode: false,
        throwOnError: false,
        strict: false
      })
    } catch (e) {
      console.error('行内公式渲染失败:', e)
    }
  })
}

const formatContent = (content: string) => {
  // 如果内容为空，显示提示信息
  if (!content) {
    return '<p style="color: #999; text-align: center;">点击左侧章节查看详细内容</p>'
  }
  
  // 最先处理折叠块 :::fold 标题 ... :::（内部内容继续走后续markdown流程）
  let formatted = content.replace(/:::fold([^\n]*)\n([\s\S]*?)\n:::/g, (_m, title, inner) => {
    return `<details class="fold-block"><summary>${title.trim() || '点击展开'}</summary><div class="fold-body">${inner}</div></details>`
  })
  
  // 处理Markdown格式的标题（先处理更长的标记）
  formatted = formatted.replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
  
  // 处理LaTeX公式标记（先块级后行内）
  formatted = formatted.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
    return `<span data-latex-block="${formula.trim().replace(/"/g, '&quot;')}"></span>`
  }).replace(/\$([^$\n]+?)\$/g, (match, formula) => {
    return `<span data-latex-inline="${formula.trim().replace(/"/g, '&quot;')}"></span>`
  })
  
  // 处理加粗（放在公式之后，避免影响公式属性）
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  
  // 处理分隔线
  formatted = formatted.replace(/^---+$/gm, '<hr>')
  
  // 处理有序列表项（临时标记，避免与无序列表混淆）
  formatted = formatted.replace(/^\d+\.\s+(.+)$/gm, '<oli>$1</oli>')
  
  // 处理无序列表项
  formatted = formatted.replace(/^-\s+(.+)$/gm, '<li>$1</li>')
  
  // 包裹连续的无序列表项
  formatted = formatted.replace(/(?:<li>[\s\S]*?<\/li>\s*)+/g, (m) => `<ul>${m}</ul>`)
  
  // 包裹连续的有序列表项并还原为li
  formatted = formatted.replace(/(?:<oli>[\s\S]*?<\/oli>\s*)+/g, (m) => {
    return `<ol>${m.replace(/<oli>/g, '<li>').replace(/<\/oli>/g, '</li>')}</ol>`
  })
  
  // 处理重点标识
  formatted = formatted.replace(/★/g, '<span class="highlight-star">★</span>')
  
  // 处理换行：空行分段，单换行由HTML自然合并（不再生成<br>，大幅缩短页面）
  formatted = formatted.replace(/\n{2,}/g, '</p><p>')
  formatted = formatted.replace(/\n/g, ' ')
  
  // 包裹段落
  if (!formatted.startsWith('<')) {
    formatted = '<p>' + formatted + '</p>'
  }
  
  // 自动折叠H2大节（首节默认展开，其余收起，缩短页面长度）
  formatted = wrapSections(formatted)
  
  return formatted
}

// 将HTML按h2拆分为可折叠区块
const wrapSections = (html: string) => {
  const h1Match = html.match(/^<h1>[\s\S]*?<\/h1>/)
  const h1Part = h1Match ? h1Match[0] : ''
  const rest = h1Match ? html.slice(h1Match[0].length) : html
  
  const parts = rest.split(/(?=<h2>)/)
  let sectionIndex = 0
  
  const wrapped = parts.map(part => {
    if (!part.trim()) return ''
    if (part.startsWith('<h2>')) {
      const titleMatch = part.match(/<h2>([\s\S]*?)<\/h2>/)
      const title = titleMatch ? titleMatch[1] : ''
      const body = part.replace(/<h2>[\s\S]*?<\/h2>/, '')
      const open = sectionIndex === 0 ? ' open' : ''
      sectionIndex++
      return `<details class="section-fold"${open}><summary>${title}</summary><div class="section-body">${body}</div></details>`
    }
    return part
  }).join('')
  
  return h1Part + wrapped
}

const startPractice = () => {
  if (selectedPoint.value) {
    console.log(`开始练习: ${selectedPoint.value.title}`)
    // 这里可以跳转到练习页面
  }
}

const markAsMastered = () => {
  if (selectedPoint.value) {
    // 更新store中的章节掌握程度
    const chapter = mathStore.chapters.find(ch => ch.id === selectedPoint.value?.id)
    if (chapter) {
      chapter.masteryLevel = Math.min(100, (chapter.masteryLevel || 0) + 10)
      selectedPoint.value.progress = chapter.masteryLevel
      mathStore.saveMathData()
      console.log(`标记掌握: ${selectedPoint.value.title}`)
    }
  }
}

onMounted(async () => {
  // 确保数学数据已初始化
  if (mathStore.chapters.length === 0) {
    await mathStore.initializeMathData()
  }
  activeCategory.value = currentConfig.value.categories[0] || ''
})
</script>

<template>
  <div class="knowledge-structure">
    <!-- 顶部信息 -->
    <div class="header-section">
      <h2 class="subject-title" :style="{ color: currentConfig.color }">
        📚 {{ currentConfig.name }}知识体系
      </h2>
      <p class="subject-description">{{ currentConfig.description }}</p>
    </div>

    <!-- 搜索和筛选 -->
    <div class="controls-section">
      <div class="search-bar">
        <el-input
          v-model="searchTerm"
          placeholder="搜索知识点..."
          clearable
          size="large"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
      
      <div class="category-filters">
        <el-button
          :type="!activeCategory ? 'primary' : 'default'"
          @click="activeCategory = ''"
        >
          全部
        </el-button>
        <el-button
          v-for="category in currentConfig.categories"
          :key="category"
          :type="activeCategory === category ? 'primary' : 'default'"
          @click="activeCategory = category"
        >
          {{ category }}
        </el-button>
      </div>
    </div>

    <div class="content-layout">
      <!-- 知识点列表 -->
      <div class="points-sidebar">
        <div 
          v-for="(points, category) in pointsByCategory"
          :key="category"
          class="category-group"
        >
          <h3 class="category-title">{{ category }}</h3>
          <div class="points-list">
            <div
              v-for="point in points"
              :key="point.id"
              class="point-card"
              :class="{ 'active': selectedPoint?.id === point.id }"
              @click="selectPoint(point)"
            >
              <div class="point-header">
                <div class="point-title">
                  {{ getImportanceIcon(point.importance) }}
                  {{ point.title }}
                </div>
                <el-tag 
                  :color="getDifficultyColor(point.difficulty)"
                  size="small"
                >
                  {{ point.difficulty }}
                </el-tag>
              </div>
              <div class="point-meta">
                <el-progress 
                  :percentage="point.progress"
                  :stroke-width="4"
                  :show-text="false"
                />
                <div class="progress-text">{{ point.progress }}%</div>
              </div>
              <div class="key-points">
                <el-tag
                  v-for="kp in point.keyPoints"
                  :key="kp"
                  size="small"
                  type="info"
                >
                  {{ kp }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="filteredPoints.length === 0" class="no-results">
          <el-icon size="40" color="#999"><Document /></el-icon>
          <p>暂无匹配的知识点</p>
        </div>
      </div>

      <!-- 知识点详情 -->
      <div class="point-detail">
        <div v-if="selectedPoint" class="detail-content">
          <div class="detail-header">
            <h2>{{ selectedPoint.title }}</h2>
            <div class="header-tags">
              <el-tag :color="currentConfig.color" effect="dark">
                {{ selectedPoint.category }}
              </el-tag>
              <el-tag :type="selectedPoint.difficulty === '基础' ? 'success' : selectedPoint.difficulty === '中等' ? 'warning' : 'danger'">
                {{ selectedPoint.difficulty }}
              </el-tag>
              <el-tag v-if="selectedPoint.importance === 'high'" type="danger">
                重点
              </el-tag>
            </div>
          </div>
          
          <div class="progress-section">
            <div class="progress-info">
              <span>掌握进度:</span>
              <el-progress 
                :percentage="selectedPoint.progress"
                :stroke-width="12"
                :text-inside="true"
                :color="currentConfig.color"
              />
            </div>
          </div>
          
          <div class="point-content" v-if="isLoadingContent">
            <p style="color: #999; text-align: center;">内容加载中...</p>
          </div>
          <div class="point-content" v-else v-html="formatContent(chapterContent)"></div>
          
          <div class="detail-actions">
            <el-button type="primary" size="large" @click="startPractice">
              <el-icon><Edit /></el-icon>
              开始练习
            </el-button>
            <el-button size="large" @click="markAsMastered">
              <el-icon><Check /></el-icon>
              标记掌握
            </el-button>
          </div>
        </div>
        
        <div v-else class="placeholder">
          <el-icon size="80" color="#999"><Collection /></el-icon>
          <h3>请选择知识点</h3>
          <p>从左侧列表中选择要学习的知识点</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.knowledge-structure {
  --font-display: 'FZCuHei', '方正粗黑_GBK', 'Microsoft YaHei', sans-serif;
  --font-mono: 'JetBrains Mono', Consolas, Monaco, monospace;
  height: 100%;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(ellipse at top right, rgba(42, 82, 144, 0.07) 0%, transparent 55%),
    linear-gradient(160deg, #f7f9fc 0%, #edf2f9 100%);
  border-radius: 14px;
  padding: 16px 20px;
  font-family: 'FZCuHei', '方正粗黑_GBK', 'Microsoft YaHei', sans-serif;
  font-weight: 400;
}

.header-section {
  text-align: left;
  margin-bottom: 12px;
  padding: 0 4px 10px;
  border-bottom: 1px solid rgba(22, 52, 92, 0.12);
  position: relative;
}

.header-section::after {
  content: '';
  position: absolute;
  left: 4px;
  bottom: -2px;
  width: 72px;
  height: 3px;
  background: linear-gradient(90deg, #ffc53d, #f0a820);
  border-radius: 2px;
}

.subject-title {
  font-family: var(--font-display);
  font-size: 1.9em;
  margin: 0 0 4px;
  font-weight: 400;
  letter-spacing: 1px;
  color: #0d2137;
  line-height: 1.15;
}

.subject-description {
  font-family: var(--font-mono);
  font-size: 0.82em;
  letter-spacing: 2.5px;
  color: #5a6b85;
  margin-bottom: 0;
  font-weight: 400;
}

.controls-section {
  margin-bottom: 14px;
  background: #fff;
  border: 1px solid rgba(22, 52, 92, 0.08);
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 4px 16px rgba(13, 33, 55, 0.06);
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.search-bar {
  width: 260px;
  margin-bottom: 0;
}

.category-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.category-filters :deep(.el-button) {
  border-radius: 9999px;
  font-weight: 400;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
}

.category-filters :deep(.el-button--primary) {
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  border-color: #16345c;
  box-shadow: 0 4px 12px rgba(13, 33, 55, 0.25);
}

.content-layout {
  display: flex;
  flex: 1;
  gap: 16px;
  min-height: 0;
}

.points-sidebar {
  width: 285px;
  flex-shrink: 0;
  overflow-y: auto;
  background: #fff;
  border: 1px solid rgba(22, 52, 92, 0.08);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 4px 16px rgba(13, 33, 55, 0.06);
  height: fit-content;
  max-height: calc(100vh - 260px);
}

.category-group {
  margin-bottom: 14px;
}

.category-title {
  font-family: var(--font-display);
  color: #0d2137;
  margin: 0 0 8px;
  padding-bottom: 6px;
  border-bottom: 2px solid #ffc53d;
  font-size: 1.1em;
  font-weight: 400;
  letter-spacing: 1px;
}

.points-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.point-card {
  padding: 9px 12px;
  border-radius: 9px;
  background: #f8fafd;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(22, 52, 92, 0.08);
  border-left: 3px solid transparent;
}

.point-card:hover {
  transform: translateX(4px);
  border-left-color: #f0a820;
  background: #f0f5fc;
  box-shadow: 0 6px 18px rgba(13, 33, 55, 0.1);
}

.point-card.active {
  border-left-color: #ffc53d;
  border-color: rgba(255, 197, 61, 0.45);
  background: linear-gradient(90deg, rgba(255, 197, 61, 0.12) 0%, rgba(22, 52, 92, 0.04) 100%);
  box-shadow: 0 6px 20px rgba(13, 33, 55, 0.12);
}

.point-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.point-title {
  font-weight: 400;
  color: #16345c;
  font-size: 0.92em;
  flex: 1;
  margin-right: 8px;
  line-height: 1.3;
}

.point-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0;
}

.progress-text {
  font-family: var(--font-mono);
  font-size: 0.75em;
  color: #16345c;
  min-width: 36px;
  font-weight: 400;
}

.key-points {
  display: none;
}

.key-point-tag {
  background: #eef3fa;
  color: #16345c;
  padding: 5px 11px;
  border-radius: 9999px;
  font-size: 0.82em;
  font-weight: 400;
}

.no-results {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  background: #fff;
  border: 1px solid rgba(22, 52, 92, 0.08);
  border-radius: 12px;
}

.no-results p {
  margin-top: 12px;
  font-size: 1em;
  color: #5a6b85;
}

.point-detail {
  flex: 1;
  overflow-y: auto;
  padding-left: 4px;
}

.detail-content {
  background: #fff;
  border: 1px solid rgba(22, 52, 92, 0.08);
  border-radius: 12px;
  padding: 20px 26px;
  box-shadow: 0 8px 28px rgba(13, 33, 55, 0.08);
}

.detail-header {
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(22, 52, 92, 0.1);
  position: relative;
}

.detail-header::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 56px;
  height: 3px;
  background: linear-gradient(90deg, #ffc53d, #f0a820);
  border-radius: 2px;
}

.detail-header h2 {
  font-family: var(--font-display);
  color: #0d2137;
  margin: 0 0 10px;
  font-size: 1.7em;
  font-weight: 400;
  letter-spacing: 1px;
  line-height: 1.2;
}

.header-tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.progress-section {
  margin-bottom: 16px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #f7f9fc 0%, #eef3fa 100%);
  border-radius: 10px;
  border: 1px solid rgba(22, 52, 92, 0.08);
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}

.progress-info span {
  font-weight: 400;
  color: #16345c;
  min-width: 90px;
  font-size: 1em;
}

.point-content {
  line-height: 1.55;
  color: #303133;
  font-size: 0.95em;
  margin-bottom: 12px;
  padding: 2px 0;
}

.point-content :deep(h1) {
  font-family: var(--font-display);
  font-size: 1.3em;
  color: #0d2137;
  margin: 8px 0 6px 0;
  padding-bottom: 5px;
  border-bottom: 2px solid #ffc53d;
  font-weight: 400;
  letter-spacing: 0.5px;
  line-height: 1.25;
}

.point-content :deep(h2) {
  font-size: 1.12em;
  color: #16345c;
  margin: 8px 0 4px 0;
  padding-left: 10px;
  border-left: 3px solid #ffc53d;
  font-weight: 400;
  line-height: 1.3;
}

.point-content :deep(h3) {
  font-size: 1.04em;
  color: #1e4576;
  margin: 6px 0 3px 0;
  font-weight: 400;
}

.point-content :deep(h4) {
  font-size: 1em;
  color: #2a5290;
  margin: 5px 0 2px 0;
  font-weight: 400;
}

.point-content :deep(hr) {
  border: none;
  border-top: 2px dashed #d0d7e5;
  margin: 6px 0;
}

/* H2大节折叠块 */
.point-content :deep(.section-fold) {
  margin: 6px 0;
  border: 1px solid #e4e9f2;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
}

.point-content :deep(.section-fold[open]) {
  border-color: rgba(22, 52, 92, 0.15);
}

.point-content :deep(.section-fold summary) {
  padding: 6px 12px;
  cursor: pointer;
  user-select: none;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.02em;
  color: #16345c;
  background: #f6f8fc;
  line-height: 1.25;
  margin: 0;
  border-left: none;
}

.point-content :deep(.section-fold summary::-webkit-details-marker) {
  display: none;
}

.point-content :deep(.section-fold summary::before) {
  content: '\25B6';
  font-size: 0.6em;
  color: #f0a820;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.point-content :deep(.section-fold[open] summary::before) {
  transform: rotate(90deg);
}

.point-content :deep(.section-fold summary:hover) {
  background: #eef3fa;
}

.point-content :deep(.section-body) {
  padding: 3px 12px 6px;
}

.point-content :deep(p) {
  margin: 6px 0;
  line-height: 1.55;
}

.point-content :deep(ul),
.point-content :deep(ol) {
  margin: 2px 0;
  padding-left: 20px;
}

.point-content :deep(li) {
  margin: 3px 0;
  line-height: 1.5;
}

.point-content :deep(li)::marker {
  color: #f0a820;
  font-weight: 400;
}

.point-content :deep(strong) {
  color: #0d2137;
  font-weight: 400;
  background: linear-gradient(transparent 62%, rgba(255, 197, 61, 0.35) 62%);
  padding: 0 2px;
}

.point-content :deep(.katex-display) {
  margin: 3px 0;
  padding: 5px 12px;
  background: #f8fafd;
  border: 1px solid rgba(22, 52, 92, 0.07);
  border-radius: 6px;
  overflow-x: auto;
  overflow-y: hidden;
}

.point-content :deep(.katex) {
  font-size: 1.05em;
}

.highlight-star {
  color: #FFD700;
  font-weight: 800;
  font-size: 1.2em;
}

/* 折叠例题块 */
.point-content :deep(.fold-block) {
  margin: 4px 0;
  border: 1px solid #e2e8f0;
  border-left: 4px solid #ffc53d;
  border-radius: 8px;
  background: #fafcff;
  overflow: hidden;
  transition: box-shadow 0.25s ease;
}

.point-content :deep(.fold-block:hover) {
  box-shadow: 0 4px 14px rgba(13, 33, 55, 0.08);
}

.point-content :deep(.fold-block[open]) {
  border-left-color: #16345c;
  background: #fff;
}

.point-content :deep(.fold-block summary) {
  padding: 6px 12px;
  font-weight: 400;
  color: #16345c;
  cursor: pointer;
  user-select: none;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.92em;
  line-height: 1.3;
}

.point-content :deep(.fold-block summary::-webkit-details-marker) {
  display: none;
}

.point-content :deep(.fold-block summary::before) {
  content: '\25B6';
  font-size: 0.65em;
  color: #f0a820;
  transition: transform 0.25s ease;
  flex-shrink: 0;
}

.point-content :deep(.fold-block[open] summary::before) {
  transform: rotate(90deg);
}

.point-content :deep(.fold-block summary:hover) {
  background: rgba(255, 197, 61, 0.08);
}

.point-content :deep(.fold-body) {
  padding: 2px 14px 8px;
  border-top: 1px dashed #e8edf5;
}

.detail-actions {
  display: flex;
  gap: 20px;
  padding-top: 18px;
  border-top: 2px solid #f0f0f0;
  justify-content: center;
}

.placeholder {
  text-align: center;
  padding: 70px 30px;
  color: #999;
  background: #fff;
  border: 1px solid rgba(22, 52, 92, 0.08);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(13, 33, 55, 0.05);
}

.placeholder h3 {
  margin: 22px 0 12px 0;
  color: #16345c;
  font-family: var(--font-display);
  font-size: 1.7em;
  letter-spacing: 1px;
}

/* 滚动条样式 */
.points-sidebar::-webkit-scrollbar,
.point-detail::-webkit-scrollbar {
  width: 8px;
}

.points-sidebar::-webkit-scrollbar-track,
.point-detail::-webkit-scrollbar-track {
  background: #eef2f8;
  border-radius: 4px;
}

.points-sidebar::-webkit-scrollbar-thumb,
.point-detail::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  border-radius: 4px;
}

.points-sidebar::-webkit-scrollbar-thumb:hover,
.point-detail::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2a5290 0%, #1e4576 100%);
}

/* 响应式设计 */
@media (max-width: 1000px) {
  .content-layout {
    flex-direction: column;
  }
  
  .points-sidebar {
    width: 100%;
    max-height: 320px;
    margin-bottom: 14px;
  }
  
  .point-detail {
    padding-left: 0;
  }
}

@media (max-width: 768px) {
  .knowledge-structure {
    padding: 12px;
    border-radius: 12px;
  }
  
  .subject-title {
    font-size: 1.6em;
  }
  
  .controls-section {
    padding: 10px 12px;
  }
  
  .search-bar {
    width: 100%;
  }
  
  .detail-header h2 {
    font-size: 1.4em;
  }
  
  .detail-content {
    padding: 14px 16px;
  }
  
  .detail-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  .detail-actions .el-button {
    width: 100%;
  }
}
</style>