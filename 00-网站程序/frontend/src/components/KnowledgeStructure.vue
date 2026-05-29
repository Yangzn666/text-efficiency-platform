<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
    difficulty: (chapter.difficulty === '进阶' ? '中等' : chapter.difficulty) as '基础' | '中等' | '困难',
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
  // 在下一帧渲染完成后执行公式渲染
  setTimeout(() => {
    renderMathFormulas()
  }, 100)
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
  
  // 处理Markdown格式的标题
  let formatted = content.replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
  
  // 处理LaTeX公式标记
  formatted = formatted.replace(/\$\$(.*?)\$\$/gs, (match, formula) => {
    return `<span data-latex-block="${formula.trim().replace(/"/g, '&quot;')}"></span>`
  }).replace(/\$(.*?)\$/g, (match, formula) => {
    return `<span data-latex-inline="${formula.trim().replace(/"/g, '&quot;')}"></span>`
  })
  
  // 处理列表项
  formatted = formatted.replace(/^- (.+)$/gm, '<li>$1</li>')
  formatted = formatted.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
  
  // 处理重点标识
  formatted = formatted.replace(/★/g, '<span class="highlight-star">★</span>')
  
  // 处理换行（保留段落之间的空行）
  formatted = formatted.replace(/\n\n/g, '</p><p>')
  formatted = formatted.replace(/\n/g, '<br>')
  
  // 包裹段落
  if (!formatted.startsWith('<')) {
    formatted = '<p>' + formatted + '</p>'
  }
  
  return formatted
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
          
          <div class="point-content" v-html="formatContent(selectedPoint.content)"></div>
          
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
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
  border-radius: 25px;
  padding: 35px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header-section {
  text-align: center;
  margin-bottom: 40px;
  padding: 25px 0;
}

.subject-title {
  font-size: 2.5em;
  margin-bottom: 15px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subject-description {
  font-size: 1.3em;
  color: #555;
  margin-bottom: 0;
  font-weight: 400;
}

.controls-section {
  margin-bottom: 35px;
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

.search-bar {
  max-width: 450px;
  margin-bottom: 25px;
}

.category-filters {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.content-layout {
  display: flex;
  flex: 1;
  gap: 35px;
  min-height: 0;
}

.points-sidebar {
  width: 400px;
  overflow-y: auto;
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  height: fit-content;
  max-height: calc(100vh - 300px);
}

.category-group {
  margin-bottom: 35px;
}

.category-title {
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 3px solid #667eea;
  font-size: 1.4em;
  font-weight: 700;
}

.points-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.point-card {
  padding: 25px;
  border-radius: 16px;
  background: #fafbff;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 3px solid transparent;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.point-card:hover {
  transform: translateX(8px) translateY(-3px);
  border-color: #667eea;
  background: #f0f5ff;
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.2);
}

.point-card.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.3);
}

.point-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.point-title {
  font-weight: 700;
  color: #2c3e50;
  font-size: 1.2em;
  flex: 1;
  margin-right: 15px;
  line-height: 1.4;
}

.point-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.progress-text {
  font-size: 1em;
  color: #666;
  min-width: 50px;
  font-weight: 500;
}

.key-points {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.key-point-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 500;
}

.no-results {
  text-align: center;
  padding: 80px 30px;
  color: #999;
  background: white;
  border-radius: 15px;
}

.no-results p {
  margin-top: 20px;
  font-size: 1.2em;
  color: #666;
}

.point-detail {
  flex: 1;
  overflow-y: auto;
  padding-left: 25px;
}

.detail-content {
  max-width: 900px;
  background: white;
  border-radius: 20px;
  padding: 35px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
}

.detail-header {
  margin-bottom: 35px;
  padding-bottom: 25px;
  border-bottom: 3px solid #f0f0f0;
}

.detail-header h2 {
  color: #2c3e50;
  margin-bottom: 25px;
  font-size: 2.3em;
  font-weight: 800;
  line-height: 1.3;
}

.header-tags {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.progress-section {
  margin-bottom: 35px;
  padding: 25px;
  background: linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%);
  border-radius: 16px;
  border: 1px solid #e0e7ff;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.progress-info span {
  font-weight: 600;
  color: #2c3e50;
  min-width: 100px;
  font-size: 1.1em;
}

.point-content {
  line-height: 2.0;
  color: #34495e;
  font-size: 1.15em;
  margin-bottom: 45px;
  padding: 5px 0;
}

.point-content :deep(h1) {
  font-size: 1.6em;
  color: #2c3e50;
  margin: 35px 0 20px 0;
  padding-bottom: 15px;
  border-bottom: 3px solid #667eea;
  font-weight: 700;
}

.point-content :deep(h2) {
  font-size: 1.4em;
  color: #34495e;
  margin: 30px 0 18px 0;
  font-weight: 600;
}

.point-content :deep(h3) {
  font-size: 1.2em;
  color: #4a5568;
  margin: 25px 0 15px 0;
  font-weight: 500;
}

.point-content :deep(p) {
  margin: 18px 0;
  line-height: 1.9;
}

.point-content :deep(ul),
.point-content :deep(ol) {
  margin: 20px 0;
  padding-left: 30px;
}

.point-content :deep(li) {
  margin: 12px 0;
  line-height: 1.7;
}

.point-content :deep(strong) {
  color: #667eea;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.highlight-star {
  color: #FFD700;
  font-weight: 800;
  font-size: 1.2em;
}

.detail-actions {
  display: flex;
  gap: 25px;
  padding-top: 35px;
  border-top: 2px solid #f0f0f0;
  justify-content: center;
}

.placeholder {
  text-align: center;
  padding: 120px 30px;
  color: #999;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.placeholder h3 {
  margin: 25px 0 15px 0;
  color: #666;
  font-size: 1.8em;
}

/* 滚动条样式 */
.points-sidebar::-webkit-scrollbar,
.point-detail::-webkit-scrollbar {
  width: 8px;
}

.points-sidebar::-webkit-scrollbar-track,
.point-detail::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.points-sidebar::-webkit-scrollbar-thumb,
.point-detail::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

.points-sidebar::-webkit-scrollbar-thumb:hover,
.point-detail::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .content-layout {
    flex-direction: column;
  }
  
  .points-sidebar {
    width: 100%;
    max-height: 400px;
    margin-bottom: 25px;
  }
  
  .point-detail {
    padding-left: 0;
  }
}

@media (max-width: 768px) {
  .knowledge-structure {
    padding: 25px;
    border-radius: 20px;
  }
  
  .subject-title {
    font-size: 2em;
  }
  
  .controls-section {
    text-align: center;
    padding: 20px;
  }
  
  .category-filters {
    justify-content: center;
    gap: 10px;
  }
  
  .point-card {
    padding: 20px;
  }
  
  .detail-header h2 {
    font-size: 1.8em;
  }
  
  .detail-content {
    padding: 25px;
  }
  
  .detail-actions {
    flex-direction: column;
    gap: 15px;
  }
  
  .detail-actions .el-button {
    width: 100%;
  }
  
  .point-content {
    font-size: 1.05em;
  }
}

@media (max-width: 480px) {
  .knowledge-structure {
    padding: 15px;
    border-radius: 15px;
  }
  
  .subject-title {
    font-size: 1.6em;
  }
  
  .controls-section {
    padding: 15px;
  }
  
  .category-filters {
    gap: 8px;
    flex-wrap: wrap;
  }
  
  .point-card {
    padding: 15px;
  }
  
  .point-title {
    font-size: 1.1em;
  }
  
  .detail-header h2 {
    font-size: 1.4em;
  }
  
  .detail-content {
    padding: 15px;
  }
  
  .point-content {
    font-size: 0.95em;
    line-height: 1.6;
  }
}
</style>