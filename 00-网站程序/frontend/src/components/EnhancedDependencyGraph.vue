<template>
  <div class="enhanced-dependency-graph">
    <!-- 控制面板 -->
    <div class="graph-controls">
      <h2 class="controls-title">📊 数学章节依赖关系图</h2>
      <div class="control-buttons">
        <el-button 
          :type="graphMode === 'radial' ? 'primary' : 'default'" 
          @click="switchMode('radial')"
        >
          <el-icon><Connection /></el-icon>
          径向布局
        </el-button>
        <el-button 
          :type="graphMode === 'force' ? 'primary' : 'default'" 
          @click="switchMode('force')"
        >
          <el-icon><Share /></el-icon>
          力导向布局
        </el-button>
        <el-button 
          :type="graphMode === 'timeline' ? 'primary' : 'default'" 
          @click="switchMode('timeline')"
        >
          <el-icon><DataLine /></el-icon>
          时间线布局
        </el-button>
        <el-button @click="resetView">
          <el-icon><Refresh /></el-icon>
          重置视图
        </el-button>
        <el-button @click="toggleFullscreen" type="success">
          <el-icon><FullScreen /></el-icon>
          {{ isFullscreen ? '退出全屏' : '全屏查看' }}
        </el-button>
      </div>
      
      <div class="legend">
        <div class="legend-item">
          <div class="legend-color" style="background: #4CAF50;"></div>
          <span>已完成</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background: #FFD700;"></div>
          <span>掌握良好 (≥70%)</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background: #FF9800;"></div>
          <span>需要加强 (50-69%)</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background: #FF6B6B;"></div>
          <span>薄弱环节 (<50%)</span>
        </div>
      </div>
    </div>

    <!-- 图表容器 -->
    <div 
      class="graph-container" 
      :class="{ 'fullscreen': isFullscreen }"
      ref="graphContainer"
    >
      <div id="enhanced-graph" class="graph-svg-container"></div>
      
      <!-- 悬浮信息面板 -->
      <div 
        class="hover-info" 
        :style="{ left: hoverPosition.x + 'px', top: hoverPosition.y + 'px' }"
        v-show="hoveredChapter"
      >
        <div class="info-header">
          <h4>{{ hoveredChapter?.title || '' }}</h4>
          <div class="info-status" :class="getStatusClass(hoveredChapter?.masteryLevel || 0)">
            {{ getStatusText(hoveredChapter?.masteryLevel || 0) }}
          </div>
        </div>
        <div class="info-content">
          <div class="info-row">
            <span class="info-label">掌握度:</span>
            <el-progress 
              :percentage="hoveredChapter.masteryLevel" 
              :stroke-width="8"
              :show-text="false"
              :color="getProgressColor(hoveredChapter.masteryLevel)"
            />
            <span class="info-value">{{ hoveredChapter.masteryLevel }}%</span>
          </div>
          <div class="info-row">
            <span class="info-label">前置章节:</span>
            <span class="info-value">
              {{ getPrerequisiteNames(hoveredChapter.prerequisites) }}
            </span>
          </div>
          <div class="info-row">
            <span class="info-label">关键知识点:</span>
            <span class="info-value">{{ hoveredChapter.keyPoints.slice(0, 3).join(', ') }}</span>
          </div>
          <div class="info-actions">
            <el-button size="small" type="primary" @click="viewChapterDetails(hoveredChapter)">
              详细查看
            </el-button>
            <el-button size="small" @click="updateProgress(hoveredChapter)">
              更新进度
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 章节详情弹窗 -->
    <el-dialog
      v-model="showChapterDialog"
      :title="selectedChapter?.title"
      width="80%"
      :fullscreen="dialogFullscreen"
    >
      <div class="chapter-detail-content" v-if="selectedChapter">
        <div class="detail-header">
          <div class="chapter-meta">
            <el-tag :type="getDifficultyTag(selectedChapter.difficulty)">
              {{ selectedChapter.difficulty }}
            </el-tag>
            <el-tag>{{ selectedChapter.estimatedTime }}分钟</el-tag>
            <el-tag :type="getMasteryTag(selectedChapter.masteryLevel)">
              掌握度: {{ selectedChapter.masteryLevel }}%
            </el-tag>
          </div>
        </div>
        
        <div class="detail-sections">
          <el-tabs v-model="activeDetailTab">
            <el-tab-pane label="依赖关系" name="dependencies">
              <div class="dependencies-section">
                <div class="prerequisites">
                  <h4>📚 前置章节</h4>
                  <div class="chapter-list">
                    <div 
                      v-for="prereq in getPrerequisiteChapters(selectedChapter.prerequisites)" 
                      :key="prereq.id"
                      class="chapter-item"
                      :class="getStatusClass(prereq.masteryLevel)"
                    >
                      <div class="chapter-info">
                        <span class="chapter-title">{{ prereq.title }}</span>
                        <span class="chapter-mastery">{{ prereq.masteryLevel }}%</span>
                      </div>
                      <el-progress 
                        :percentage="prereq.masteryLevel" 
                        :stroke-width="6"
                        :show-text="false"
                      />
                    </div>
                  </div>
                </div>
                
                <div class="dependents">
                  <h4>🔗 后续章节</h4>
                  <div class="chapter-list">
                    <div 
                      v-for="dependent in getDependentChapters(selectedChapter.id)" 
                      :key="dependent.id"
                      class="chapter-item"
                      :class="getStatusClass(dependent.masteryLevel)"
                    >
                      <div class="chapter-info">
                        <span class="chapter-title">{{ dependent.title }}</span>
                        <span class="chapter-mastery">{{ dependent.masteryLevel }}%</span>
                      </div>
                      <el-progress 
                        :percentage="dependent.masteryLevel" 
                        :stroke-width="6"
                        :show-text="false"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="关键知识点" name="keypoints">
              <div class="keypoints-section">
                <el-card 
                  v-for="(point, index) in selectedChapter.keyPoints" 
                  :key="index"
                  class="keypoint-card"
                >
                  <div class="keypoint-content">
                    <h4>知识点 {{ Number(index) + 1 }}</h4>
                    <p>{{ point }}</p>
                  </div>
                </el-card>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="进度统计" name="statistics">
              <div class="statistics-section">
                <div class="stats-grid">
                  <div class="stat-card">
                    <div class="stat-value">{{ selectedChapter.practiceProblems.length }}</div>
                    <div class="stat-label">练习题目</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-value">{{ getCompletedProblems(selectedChapter).length }}</div>
                    <div class="stat-label">已完成题目</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-value">{{ getLastStudyDate(selectedChapter.lastStudied) }}</div>
                    <div class="stat-label">上次学习</div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showChapterDialog = false">关闭</el-button>
          <el-button 
            type="primary" 
            @click="goToChapter(selectedChapter)"
          >
            前往学习
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 进度更新弹窗 -->
    <el-dialog
      v-model="showProgressDialog"
      title="更新学习进度"
      width="400px"
    >
      <div v-if="chapterToUpdate">
        <p>更新 <strong>{{ chapterToUpdate.title }}</strong> 的掌握度:</p>
        <el-slider
          v-model="newMasteryLevel"
          :min="0"
          :max="100"
          :step="5"
          show-input
          show-stops
        />
        <div class="slider-info">
          <el-tag :type="getMasteryTag(newMasteryLevel)">
            {{ getStatusText(newMasteryLevel) }}
          </el-tag>
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showProgressDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmProgressUpdate">确认更新</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useMathStore } from '@/stores/math'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as d3 from 'd3'
import { 
  Connection, 
  Share, 
  DataLine, 
  Refresh, 
  FullScreen 
} from '@element-plus/icons-vue'

const mathStore = useMathStore()

// 状态
const graphMode = ref('radial')
const isFullscreen = ref(false)
const dialogFullscreen = ref(false)
const showChapterDialog = ref(false)
const showProgressDialog = ref(false)
const selectedChapter = ref<any>(null)
const chapterToUpdate = ref<any>(null)
const newMasteryLevel = ref(0)
const activeDetailTab = ref('dependencies')
const hoveredChapter = ref<any>(null)
const hoverPosition = ref({ x: 0, y: 0 })

const graphContainer = ref<HTMLElement | null>(null)

// 计算属性
const allChapters = computed(() => mathStore.chapters)

// 方法
const switchMode = (mode: string) => {
  graphMode.value = mode
  nextTick(() => {
    renderGraph()
  })
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  dialogFullscreen.value = isFullscreen.value
  nextTick(() => {
    renderGraph()
  })
}

const resetView = () => {
  // 重置缩放和平移
  const svg = d3.select('#enhanced-graph svg')
  if (!svg.empty()) {
    // 使用类型断言解决 D3.js 类型冲突问题
    (svg as any).call(d3.zoom().transform as any, d3.zoomIdentity)
  }
}

const renderGraph = () => {
  const container = document.getElementById('enhanced-graph')
  if (!container) return

  // 清空容器
  container.innerHTML = ''

  // 根据不同模式渲染
  switch (graphMode.value) {
    case 'radial':
      renderRadialGraph(container)
      break
    case 'force':
      renderForceGraph(container)
      break
    case 'timeline':
      renderTimelineGraph(container)
      break
  }
}

const renderRadialGraph = (container: HTMLElement) => {
  const width = container.clientWidth || 800
  const height = container.clientHeight || 600
  const radius = Math.min(width, height) * 0.4

  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .call(d3.zoom().on('zoom', (event: any) => {
      (g as any).attr('transform', event.transform)
    }) as any)

  const g = svg.append('g')
    .attr('transform', `translate(${width/2},${height/2})`)

  const chapters = allChapters.value
  if (chapters.length === 0) {
    container.innerHTML = '<div class="no-data">暂无章节数据</div>'
    return
  }

  // 创建力导向模拟
  const simulation = d3.forceSimulation(chapters as any)
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(0, 0))
    .force('collision', d3.forceCollide().radius(40))

  // 绘制连接线
  const links: any[] = []
  chapters.forEach(chapter => {
    chapter.prerequisites.forEach(prereqId => {
      const source = chapters.find(c => c.id === prereqId)
      if (source) {
        links.push({ source, target: chapter })
      }
    })
  })

  const link = g.selectAll('.link')
    .data(links)
    .enter().append('line')
    .attr('class', 'link')
    .attr('stroke', '#999')
    .attr('stroke-width', 2)
    .attr('marker-end', 'url(#arrowhead)')

  // 绘制节点
  const node = g.selectAll('.node')
    .data(chapters)
    .enter().append('g')
    .attr('class', 'node')
    .call(d3.drag()
      .on('start', dragstarted as any)
      .on('drag', dragged as any)
      .on('end', dragended as any) as any)

  // 节点圆圈
  node.append('circle')
    .attr('r', 30)
    .attr('fill', d => getColorByMastery(d.masteryLevel))
    .attr('stroke', '#333')
    .attr('stroke-width', 2)
    .on('mouseover', (event, d) => showHoverInfo(event, d))
    .on('mouseout', hideHoverInfo)
    .on('click', (event, d) => viewChapterDetails(d))

  // 节点文字
  node.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', 5)
    .attr('fill', 'white')
    .attr('font-weight', 'bold')
    .attr('font-size', '14px')
    .text(d => d.order)

  // 章节名称
  node.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', 45)
    .attr('fill', '#333')
    .attr('font-size', '12px')
    .text(d => d.title.length > 8 ? d.title.substring(0, 8) + '...' : d.title)

  // 添加箭头标记
  const defs = svg.append('defs')
  const marker = defs.append('marker')
    .attr('id', 'arrowhead')
    .attr('markerWidth', 10)
    .attr('markerHeight', 7)
    .attr('refX', 35)
    .attr('refY', 3.5)
    .attr('orient', 'auto')

  marker.append('polygon')
    .attr('points', '0 0, 10 3.5, 0 7')
    .attr('fill', '#999')

  // 更新力导向模拟
  simulation.on('tick', () => {
    (link as any)
      .attr('x1', (d: any) => d.source.x)
      .attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x)
      .attr('y2', (d: any) => d.target.y)

    (node as any).attr('transform', (d: any) => `translate(${d.x},${d.y})`)
  })

  function dragstarted(this: any, event: any, d: any) {
    if (!event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }

  function dragged(this: any, event: any, d: any) {
    d.fx = event.x
    d.fy = event.y
  }

  function dragended(this: any, event: any, d: any) {
    if (!event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }
}

const renderForceGraph = (container: HTMLElement) => {
  // 力导向图的具体实现
  renderRadialGraph(container) // 暂时复用径向图逻辑
}

const renderTimelineGraph = (container: HTMLElement) => {
  const width = container.clientWidth || 800
  const height = container.clientHeight || 600

  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  const chapters = [...allChapters.value].sort((a, b) => a.order - b.order)
  const nodeHeight = 60
  const nodeWidth = 120
  const spacing = 80

  // 绘制时间轴
  svg.append('line')
    .attr('x1', 50)
    .attr('y1', height / 2)
    .attr('x2', width - 50)
    .attr('y2', height / 2)
    .attr('stroke', '#ccc')
    .attr('stroke-width', 2)

  // 绘制节点
  const nodes = svg.selectAll('.timeline-node')
    .data(chapters)
    .enter().append('g')
    .attr('class', 'timeline-node')
    .attr('transform', (d, i) => {
      const x = 50 + i * (nodeWidth + spacing)
      const y = height / 2
      return `translate(${x}, ${y})`
    })

  nodes.append('rect')
    .attr('width', nodeWidth)
    .attr('height', nodeHeight)
    .attr('rx', 10)
    .attr('fill', d => getColorByMastery(d.masteryLevel))
    .attr('stroke', '#333')
    .attr('stroke-width', 2)
    .on('click', (event, d) => viewChapterDetails(d))

  nodes.append('text')
    .attr('x', nodeWidth / 2)
    .attr('y', nodeHeight / 2 - 5)
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .attr('font-weight', 'bold')
    .text(d => `第${d.order}章`)

  nodes.append('text')
    .attr('x', nodeWidth / 2)
    .attr('y', nodeHeight / 2 + 15)
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .attr('font-size', '10px')
    .text(d => d.title.length > 6 ? d.title.substring(0, 6) + '...' : d.title)
}

// 工具方法
const getColorByMastery = (mastery: number) => {
  if (mastery >= 85) return '#4CAF50' // 绿色 - 已完成
  if (mastery >= 70) return '#FFD700' // 金色 - 掌握良好
  if (mastery >= 50) return '#FF9800' // 橙色 - 需要加强
  return '#FF6B6B' // 红色 - 薄弱环节
}

const getStatusClass = (mastery: number) => {
  if (mastery >= 85) return 'completed'
  if (mastery >= 70) return 'good'
  if (mastery >= 50) return 'needs-improvement'
  return 'weak'
}

const getStatusText = (mastery: number) => {
  if (mastery >= 85) return '已完成'
  if (mastery >= 70) return '掌握良好'
  if (mastery >= 50) return '需要加强'
  return '薄弱环节'
}

const getProgressColor = (mastery: number) => {
  if (mastery >= 85) return '#4CAF50'
  if (mastery >= 70) return '#FFD700'
  if (mastery >= 50) return '#FF9800'
  return '#FF6B6B'
}

const getPrerequisiteNames = (prerequisites: string[]) => {
  const prereqChapters = prerequisites
    .map(id => allChapters.value.find(c => c.id === id))
    .filter(Boolean)
    .map((c: any) => c.title)
  return prereqChapters.length > 0 ? prereqChapters.join(', ') : '无'
}

const getPrerequisiteChapters = (prerequisites: string[]) => {
  return prerequisites
    .map(id => allChapters.value.find(c => c.id === id))
    .filter(Boolean) as any[]
}

const getDependentChapters = (chapterId: string) => {
  return allChapters.value.filter(chapter => 
    chapter.prerequisites.includes(chapterId)
  )
}

const getCompletedProblems = (chapter: any) => {
  return chapter.practiceProblems.filter((p: any) => p.isCorrect)
}

const getLastStudyDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  return `${diffDays}天前`
}

const getDifficultyTag = (difficulty: string) => {
  const types: Record<string, any> = {
    '基础': 'success',
    '进阶': 'warning',
    '难点': 'danger'
  }
  return types[difficulty] || 'info'
}

const getMasteryTag = (mastery: number) => {
  if (mastery >= 85) return 'success'
  if (mastery >= 70) return 'warning'
  if (mastery >= 50) return 'info'
  return 'danger'
}

const showHoverInfo = (event: MouseEvent, chapter: any) => {
  hoveredChapter.value = chapter
  hoverPosition.value = { 
    x: event.clientX + 10, 
    y: event.clientY + 10 
  }
}

const hideHoverInfo = () => {
  hoveredChapter.value = null
}

const viewChapterDetails = (chapter: any) => {
  selectedChapter.value = chapter
  showChapterDialog.value = true
}

const updateProgress = (chapter: any) => {
  chapterToUpdate.value = chapter
  newMasteryLevel.value = chapter.masteryLevel
  showProgressDialog.value = true
}

const confirmProgressUpdate = async () => {
  if (!chapterToUpdate.value) return

  try {
    await mathStore.updateChapterProgress(chapterToUpdate.value.id, newMasteryLevel.value)
    ElMessage.success('进度更新成功')
    showProgressDialog.value = false
    renderGraph()
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

const goToChapter = (chapter: any) => {
  // 跳转到章节学习页面的逻辑
  ElMessage.info(`前往第${chapter.order}章学习`)
  showChapterDialog.value = false
}

// 生命周期
onMounted(() => {
  mathStore.initializeMathData()
  
  setTimeout(() => {
    renderGraph()
  }, 500)

  // 监听窗口大小变化
  window.addEventListener('resize', renderGraph)
})

onUnmounted(() => {
  window.removeEventListener('resize', renderGraph)
})
</script>

<style scoped>
.enhanced-dependency-graph {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.graph-controls {
  background: white;
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}

.controls-title {
  text-align: center;
  color: #333;
  margin: 0 0 20px 0;
  font-size: 1.8em;
}

.control-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 25px;
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
  border: 1px solid #ddd;
}

.graph-container {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  height: 600px;
  position: relative;
  overflow: hidden;
}

.graph-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  border-radius: 0;
}

.graph-svg-container {
  width: 100%;
  height: 100%;
}

.hover-info {
  position: fixed;
  background: white;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  z-index: 1001;
  min-width: 250px;
  border: 1px solid #eee;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.info-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.1em;
}

.info-status {
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 0.8em;
  font-weight: 500;
}

.info-status.completed { background: #e8f5e8; color: #4CAF50; }
.info-status.good { background: #fff8e1; color: #FF9800; }
.info-status.needs-improvement { background: #fff3e0; color: #FF9800; }
.info-status.weak { background: #ffebee; color: #f44336; }

.info-content {
  font-size: 0.9em;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.info-label {
  font-weight: 500;
  color: #666;
  min-width: 80px;
}

.info-value {
  flex: 1;
  color: #333;
}

.info-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.chapter-detail-content {
  max-height: 70vh;
  overflow-y: auto;
}

.detail-header {
  margin-bottom: 20px;
}

.chapter-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.dependencies-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.prerequisites, .dependents {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

.prerequisites h4, .dependents h4 {
  margin: 0 0 15px 0;
  color: #333;
}

.chapter-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chapter-item {
  background: white;
  border-radius: 8px;
  padding: 12px;
  border-left: 4px solid #4CAF50;
}

.chapter-item.good { border-left-color: #FFD700; }
.chapter-item.needs-improvement { border-left-color: #FF9800; }
.chapter-item.weak { border-left-color: #FF6B6B; }

.chapter-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.chapter-title {
  font-weight: 500;
  color: #333;
}

.chapter-mastery {
  font-weight: bold;
  color: #666;
}

.keypoints-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.keypoint-card {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.keypoint-card:hover {
  transform: translateY(-2px);
}

.keypoint-content h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.keypoint-content p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

.statistics-section {
  padding: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  color: white;
}

.stat-value {
  font-size: 2.5em;
  font-weight: bold;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 1.1em;
  opacity: 0.9;
}

.slider-info {
  margin-top: 20px;
  text-align: center;
}

.no-data {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #999;
  font-size: 1.2em;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .enhanced-dependency-graph {
    padding: 15px;
  }
  
  .control-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .legend {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  .graph-container {
    height: 500px;
  }
  
  .dependencies-section {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>