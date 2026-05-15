<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMathStore } from '@/stores/math'
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'DependencyGraph'
})

const mathStore = useMathStore()

const selectedChapter = ref<any>(null)
const graphType = ref('dependency') // 'dependency' 或 'progress'
const showDetails = ref(false)

// 计算属性
const dependencyGraph = computed(() => {
  return mathStore.getChapterDependencyGraph()
})

const progressData = computed(() => {
  return mathStore.chapters.map(chapter => ({
    id: chapter.id,
    title: chapter.title,
    mastery: chapter.masteryLevel,
    completed: chapter.completed,
    order: chapter.order
  }))
})

const weakChapters = computed(() => mathStore.weakAreas)

const renderDependencyGraph = () => {
  const container = document.getElementById('graph-container')
  if (!container) return

  // 清空容器
  container.innerHTML = ''

  // 创建SVG元素
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '100%')
  svg.setAttribute('height', '400')
  svg.setAttribute('viewBox', '0 0 800 400')

  // 获取章节数据
  const chapters = mathStore.chapters
  if (chapters.length === 0) {
    container.innerHTML = '<div class="no-data">暂无章节数据</div>'
    return
  }

  // 计算节点位置
  const nodePositions: Record<string, { x: number, y: number }> = {}
  const centerX = 400
  const centerY = 200
  const radius = 150

  chapters.forEach((chapter, index) => {
    const angle = (index * 2 * Math.PI) / chapters.length - Math.PI / 2
    nodePositions[chapter.id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    }
  })

  // 绘制连接线
  chapters.forEach(chapter => {
    const startPos = nodePositions[chapter.id]
    chapter.prerequisites.forEach(prereqId => {
      const prereqPos = nodePositions[prereqId]
      if (startPos && prereqPos) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttribute('x1', prereqPos.x.toString())
        line.setAttribute('y1', prereqPos.y.toString())
        line.setAttribute('x2', startPos.x.toString())
        line.setAttribute('y2', startPos.y.toString())
        line.setAttribute('stroke', '#FF6B6B')
        line.setAttribute('stroke-width', '2')
        line.setAttribute('marker-end', 'url(#arrowhead)')
        svg.appendChild(line)
      }
    })
  })

  // 绘制节点
  chapters.forEach(chapter => {
    const pos = nodePositions[chapter.id]
    if (!pos) return

    // 节点圆圈
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', pos.x.toString())
    circle.setAttribute('cy', pos.y.toString())
    circle.setAttribute('r', '30')
    circle.setAttribute('fill', chapter.completed ? '#4CAF50' : 
                       chapter.masteryLevel >= 70 ? '#FFD700' : '#FF6B6B')
    circle.setAttribute('stroke', '#333')
    circle.setAttribute('stroke-width', '2')
    circle.addEventListener('click', () => selectChapter(chapter))
    svg.appendChild(circle)

    // 节点标签
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('x', pos.x.toString())
    text.setAttribute('y', (pos.y + 5).toString())
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('font-family', 'Arial')
    text.setAttribute('font-size', '12')
    text.setAttribute('fill', 'white')
    text.setAttribute('font-weight', 'bold')
    text.textContent = chapter.order.toString()
    svg.appendChild(text)

    // 章节名称
    const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    nameText.setAttribute('x', pos.x.toString())
    nameText.setAttribute('y', (pos.y + 50).toString())
    nameText.setAttribute('text-anchor', 'middle')
    nameText.setAttribute('font-family', 'Arial')
    nameText.setAttribute('font-size', '10')
    nameText.setAttribute('fill', '#333')
    nameText.textContent = chapter.title
    svg.appendChild(nameText)
  })

  // 添加箭头标记
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
  const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker')
  marker.setAttribute('id', 'arrowhead')
  marker.setAttribute('markerWidth', '10')
  marker.setAttribute('markerHeight', '7')
  marker.setAttribute('refX', '9')
  marker.setAttribute('refY', '3.5')
  marker.setAttribute('orient', 'auto')
  
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
  polygon.setAttribute('points', '0 0, 10 3.5, 0 7')
  polygon.setAttribute('fill', '#FF6B6B')
  marker.appendChild(polygon)
  defs.appendChild(marker)
  svg.appendChild(defs)

  container.appendChild(svg)
}

const renderProgressGraph = () => {
  const container = document.getElementById('graph-container')
  if (!container) return

  container.innerHTML = ''

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '100%')
  svg.setAttribute('height', '400')
  svg.setAttribute('viewBox', '0 0 800 400')

  const chapters = [...mathStore.chapters].sort((a, b) => a.order - b.order)
  const barWidth = Math.max(50, 700 / chapters.length)
  const barSpacing = 20

  chapters.forEach((chapter, index) => {
    const x = 50 + index * (barWidth + barSpacing)
    const barHeight = (chapter.masteryLevel / 100) * 250
    const y = 300 - barHeight

    // 进度条
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', x.toString())
    rect.setAttribute('y', y.toString())
    rect.setAttribute('width', barWidth.toString())
    rect.setAttribute('height', barHeight.toString())
    rect.setAttribute('fill', chapter.completed ? '#4CAF50' : 
                     chapter.masteryLevel >= 70 ? '#FFD700' : '#FF6B6B')
    rect.setAttribute('rx', '5')
    rect.addEventListener('click', () => selectChapter(chapter))
    svg.appendChild(rect)

    // 章节标签
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('x', (x + barWidth / 2).toString())
    text.setAttribute('y', '320')
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('font-family', 'Arial')
    text.setAttribute('font-size', '12')
    text.setAttribute('fill', '#333')
    text.textContent = `第${chapter.order}章`
    svg.appendChild(text)

    // 掌握度百分比
    const percentText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    percentText.setAttribute('x', (x + barWidth / 2).toString())
    percentText.setAttribute('y', (y - 10).toString())
    percentText.setAttribute('text-anchor', 'middle')
    percentText.setAttribute('font-family', 'Arial')
    percentText.setAttribute('font-size', '10')
    percentText.setAttribute('fill', '#666')
    percentText.textContent = `${chapter.masteryLevel}%`
    svg.appendChild(percentText)
  })

  container.appendChild(svg)
}

const selectChapter = (chapter: any) => {
  selectedChapter.value = chapter
  showDetails.value = true
}

const updateChapterProgress = async (masteryLevel: number) => {
  if (!selectedChapter.value) return

  try {
    await mathStore.updateChapterProgress(selectedChapter.value.id, masteryLevel)
    ElMessage.success('进度更新成功')
    
    // 重新渲染图表
    if (graphType.value === 'dependency') {
      renderDependencyGraph()
    } else {
      renderProgressGraph()
    }
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

const switchGraphType = (type: string) => {
  graphType.value = type
  showDetails.value = false
  selectedChapter.value = null
  
  setTimeout(() => {
    if (type === 'dependency') {
      renderDependencyGraph()
    } else {
      renderProgressGraph()
    }
  }, 100)
}

onMounted(() => {
  mathStore.initializeMathData()
  
  setTimeout(() => {
    if (graphType.value === 'dependency') {
      renderDependencyGraph()
    } else {
      renderProgressGraph()
    }
  }, 500)
})
</script>

<template>
  <div class="dependency-graph-container">
    <!-- 顶部控制 -->
    <div class="graph-controls">
      <h2 class="section-title">章节依赖关系图</h2>
      <div class="controls">
        <el-radio-group v-model="graphType" @change="switchGraphType">
          <el-radio-button label="dependency">依赖关系图</el-radio-button>
          <el-radio-button label="progress">进度柱状图</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="graph-section">
      <div id="graph-container" class="graph-container"></div>
      
      <!-- 图例 -->
      <div class="legend">
        <div class="legend-item">
          <div class="legend-color" style="background-color: #FF6B6B;"></div>
          <span>未掌握(0-69%)</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background-color: #FFD700;"></div>
          <span>基本掌握 (70-84%)</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background-color: #4CAF50;"></div>
          <span>熟练掌握 (85-100%)</span>
        </div>
      </div>
    </div>

    <!-- 章节详情 -->
    <div v-if="showDetails && selectedChapter" class="chapter-details">
      <el-card>
        <template #header>
          <div class="card-header">
            <h3>第{{ selectedChapter.order }}章：{{ selectedChapter.title }}</h3>
            <el-tag :type="selectedChapter.completed ? 'success' : 'warning'">
              {{ selectedChapter.completed ? '已完成' : '进行中' }}
            </el-tag>
          </div>
        </template>
        
        <div class="chapter-info">
          <div class="info-row">
            <span class="label">预计学习时间</span>
            <span>{{ selectedChapter.estimatedTime }}分钟</span>
          </div>
          
          <div class="info-row">
            <span class="label">难度等级</span>
            <el-tag :type="selectedChapter.difficulty === '基础' ? 'success' : 
                          selectedChapter.difficulty === '进阶' ? 'warning' : 'danger'">
              {{ selectedChapter.difficulty }}
            </el-tag>
          </div>
          
          <div class="info-row">
            <span class="label">掌握程度</span>
            <el-slider
              v-model="selectedChapter.masteryLevel"
              :min="0"
              :max="100"
              show-input
              @change="updateChapterProgress"
            />
          </div>
          
          <div class="key-points">
            <h4>核心知识点：</h4>
            <el-tag 
              v-for="point in selectedChapter.keyPoints" 
              :key="point"
              type="info"
              style="margin: 5px;"
            >
              {{ point }}
            </el-tag>
          </div>
          
          <div class="prerequisites" v-if="selectedChapter.prerequisites.length > 0">
            <h4>前置章节</h4>
            <div class="prereq-list">
              <el-tag 
                v-for="prereqId in selectedChapter.prerequisites" 
                :key="prereqId"
                type="warning"
              >
                {{ mathStore.chapters.find(c => c.id === prereqId)?.title || prereqId }}
              </el-tag>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 薄弱环节提醒 -->
    <div v-if="weakChapters.length > 0" class="weak-areas">
      <el-card>
        <template #header>
          <h3>🚨 需要加强的章节</h3>
        </template>
        
        <div class="weak-list">
          <div 
            v-for="chapter in weakChapters.slice(0, 3)" 
            :key="chapter.id"
            class="weak-item"
            @click="selectChapter(chapter)"
          >
            <div class="weak-info">
              <span class="chapter-name">第{{ chapter.order }}章：{{ chapter.title }}</span>
              <el-progress 
                :percentage="chapter.masteryLevel" 
                :stroke-width="12"
                :color="chapter.masteryLevel < 50 ? '#FF6B6B' : '#FFD700'"
              />
            </div>
            <el-button size="small" type="primary">查看详情</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.dependency-graph-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.section-title {
  text-align: center;
  color: white;
  font-size: 2.2em;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.graph-controls {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  text-align: center;
}

.controls {
  margin-top: 20px;
}

.graph-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  text-align: center;
}

.graph-container {
  width: 100%;
  height: 400px;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 20px;
  position: relative;
}

.graph-container svg {
  width: 100%;
  height: 100%;
}

.no-data {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #999999;
  font-size: 1.2em;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.chapter-details {
  margin-bottom: 30px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  color: #333333;
  margin: 0;
  font-size: 1.4em;
}

.chapter-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.label {
  font-weight: 500;
  color: #666666;
  min-width: 100px;
}

.key-points, .prerequisites {
  grid-column: 1 / -1;
  margin-top: 20px;
}

.key-points h4, .prerequisites h4 {
  color: #333333;
  margin-bottom: 15px;
  font-size: 1.2em;
}

.prereq-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.weak-areas {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}

.weak-areas h3 {
  color: #333333;
  margin: 0 0 20px 0;
  font-size: 1.4em;
}

.weak-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.weak-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #fff8f8;
  border-radius: 12px;
  border: 1px solid #ffe0e0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.weak-item:hover {
  background: #fff0f0;
  transform: translateX(5px);
}

.weak-info {
  flex: 1;
  margin-right: 20px;
}

.chapter-name {
  display: block;
  font-weight: 500;
  color: #333333;
  margin-bottom: 10px;
}

/* 响应式设置*/
@media (max-width: 768px) {
  .dependency-graph-container {
    padding: 20px 15px;
  }
  
  .chapter-info {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .legend {
    gap: 15px;
  }
  
  .weak-item {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .weak-info {
    margin-right: 0;
  }
}
</style>
