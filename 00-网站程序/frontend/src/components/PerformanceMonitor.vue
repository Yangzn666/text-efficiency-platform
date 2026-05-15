<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePerformanceStore } from '@/stores/performance'
import { ElMessage } from 'element-plus'

const performanceStore = usePerformanceStore()

const activeTab = ref('metrics')
const refreshInterval = ref<NodeJS.Timeout | null>(null)

// 计算属�?
const metrics = computed(() => performanceStore.metrics)
const resourceUsage = computed(() => performanceStore.resourceUsage)
const suggestions = computed(() => performanceStore.suggestions)
const overallScore = computed(() => performanceStore.overallScore)
const performanceGrade = computed(() => performanceStore.performanceGrade)
const highPrioritySuggestions = computed(() => performanceStore.highPrioritySuggestions)

const formatTime = (milliseconds: number) => {
  if (milliseconds < 1000) return `${milliseconds}ms`
  return `${(milliseconds / 1000).toFixed(1)}s`
}

const formatMemory = (mb: number) => {
  return `${mb}MB`
}

const getSuggestionIcon = (category: string) => {
  const icons: Record<string, string> = {
    'performance': '🚀',
    'memory': '💾',
    'network': '🌐',
    'ui': '🎨'
  }
  return icons[category] || '🔧'
}

const getImpactColor = (impact: string) => {
  const colors: Record<string, string> = {
    'severe': '#F56C6C',
    'moderate': '#E6A23C',
    'minor': '#909399'
  }
  return colors[impact] || '#909399'
}

const getPriorityTag = (priority: string) => {
  const tags: Record<string, any> = {
    'high': { type: 'danger', text: '高优先级' },
    'medium': { type: 'warning', text: '中优先级' },
    'low': { type: 'info', text: '低优先级' }
  }
  return tags[priority] || { type: 'info', text: priority }
}

const startMonitoring = async () => {
  try {
    await performanceStore.startMonitoring()
    ElMessage.success('性能监控已启动')
    
    // 设置定期刷新
    refreshInterval.value = setInterval(async () => {
      await performanceStore.collectPerformanceMetrics()
      await performanceStore.analyzeResourceUsage()
    }, 5000)
    
  } catch (error) {
    ElMessage.error('监控启动失败')
  }
}

const stopMonitoring = () => {
  performanceStore.stopMonitoring()
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
    refreshInterval.value = null
  }
  ElMessage.info('性能监控已停止')
}

const refreshData = async () => {
  try {
    await performanceStore.collectPerformanceMetrics()
    await performanceStore.analyzeResourceUsage()
    await performanceStore.generateSuggestions()
    ElMessage.success('数据刷新完成')
  } catch (error) {
    ElMessage.error('数据刷新失败')
  }
}

const implementSuggestion = async (suggestionId: string) => {
  try {
    await performanceStore.implementSuggestion(suggestionId)
    ElMessage.success('优化建议已实施')
  } catch (error) {
    ElMessage.error('实施失败')
  }
}

const exportReport = () => {
  performanceStore.exportPerformanceReport()
  ElMessage.success('性能报告导出成功')
}

const clearData = () => {
  performanceStore.clearPerformanceData()
  ElMessage.success('数据已清除')
}

onMounted(() => {
  // 页面加载完成后自动收集一次数�?
  setTimeout(() => {
    refreshData()
  }, 1000)
})
</script>

<template>
  <div class="performance-monitor-container">
    <div class="page-header">
      <h1 class="page-title">性能监控面板</h1>
      <p class="page-subtitle">实时监控和优化应用性能</p>
    </div>

    <div class="monitor-content">
      <!-- 顶部控制面板 -->
      <div class="control-panel">
        <el-card>
          <div class="panel-header">
            <div class="score-display">
              <div class="grade-circle" :style="{ borderColor: performanceGrade.color }">
                <span class="grade-text" :style="{ color: performanceGrade.color }">
                  {{ performanceGrade.grade }}
                </span>
              </div>
              <div class="score-info">
                <div class="score-value">{{ overallScore }}<span class="score-max">/100</span></div>
                <div class="score-label">性能评分</div>
              </div>
            </div>
            
            <div class="control-buttons">
              <el-button 
                v-if="!performanceStore.isMonitoring"
                type="primary"
                @click="startMonitoring"
              >
                <el-icon><VideoPlay /></el-icon>
                开始监�?
              </el-button>
              
              <el-button 
                v-else
                type="danger"
                @click="stopMonitoring"
              >
                <el-icon><VideoPause /></el-icon>
                停止监控
              </el-button>
              
              <el-button @click="refreshData">
                <el-icon><Refresh /></el-icon>
                刷新数据
              </el-button>
              
              <el-button @click="exportReport">
                <el-icon><Download /></el-icon>
                导出报告
              </el-button>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 主要监控区域 -->
      <el-tabs v-model="activeTab" class="monitor-tabs">
        <el-tab-pane label="性能指标" name="metrics">
          <div class="metrics-grid">
            <el-card class="metric-card">
              <template #header>
                <div class="metric-header">
                  <el-icon color="#4CAF50"><Timer /></el-icon>
                  <h3>加载时间</h3>
                </div>
              </template>
              <div class="metric-content">
                <div class="metric-value">{{ formatTime(metrics.loadTime) }}</div>
                <div class="metric-status" :class="{ 'warning': metrics.loadTime > 3000 }">
                  {{ metrics.loadTime > 3000 ? '较慢' : '正常' }}
                </div>
                <el-progress 
                  :percentage="Math.min(100, metrics.loadTime / 30)" 
                  :stroke-width="8"
                  :show-text="false"
                  :color="metrics.loadTime > 3000 ? '#F56C6C' : '#4CAF50'"
                />
              </div>
            </el-card>

            <el-card class="metric-card">
              <template #header>
                <div class="metric-header">
                  <el-icon color="#2196F3"><View /></el-icon>
                  <h3>首次绘制</h3>
                </div>
              </template>
              <div class="metric-content">
                <div class="metric-value">{{ formatTime(metrics.firstPaint) }}</div>
                <div class="metric-status" :class="{ 'warning': metrics.firstPaint > 1000 }">
                  {{ metrics.firstPaint > 1000 ? '延迟' : '良好' }}
                </div>
                <el-progress 
                  :percentage="Math.min(100, metrics.firstPaint / 10)" 
                  :stroke-width="8"
                  :show-text="false"
                  :color="metrics.firstPaint > 1000 ? '#F56C6C' : '#2196F3'"
                />
              </div>
            </el-card>

            <el-card class="metric-card">
              <template #header>
                <div class="metric-header">
                  <el-icon color="#FF9800"><Picture /></el-icon>
                  <h3>最大内容绘制</h3>
                </div>
              </template>
              <div class="metric-content">
                <div class="metric-value">{{ formatTime(metrics.largestContentfulPaint) }}</div>
                <div class="metric-status" :class="{ 'warning': metrics.largestContentfulPaint > 2500 }">
                  {{ metrics.largestContentfulPaint > 2500 ? '过慢' : '合格' }}
                </div>
                <el-progress 
                  :percentage="Math.min(100, metrics.largestContentfulPaint / 25)" 
                  :stroke-width="8"
                  :show-text="false"
                  :color="metrics.largestContentfulPaint > 2500 ? '#F56C6C' : '#FF9800'"
                />
              </div>
            </el-card>

            <el-card class="metric-card">
              <template #header>
                <div class="metric-header">
                  <el-icon color="#9C27B0"><DataAnalysis /></el-icon>
                  <h3>可交互时间</h3>
                </div>
              </template>
              <div class="metric-content">
                <div class="metric-value">{{ formatTime(metrics.timeToInteractive) }}</div>
                <div class="metric-status" :class="{ 'warning': metrics.timeToInteractive > 5000 }">
                  {{ metrics.timeToInteractive > 5000 ? '较长' : '快速' }}
                </div>
                <el-progress 
                  :percentage="Math.min(100, metrics.timeToInteractive / 50)" 
                  :stroke-width="8"
                  :show-text="false"
                  :color="metrics.timeToInteractive > 5000 ? '#F56C6C' : '#9C27B0'"
                />
              </div>
            </el-card>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="资源使用" name="resources">
          <div class="resources-grid">
            <el-card class="resource-card">
              <template #header>
                <h3>内存使用</h3>
              </template>
              <div class="resource-content">
                <div class="usage-display">
                  <el-progress 
                    type="circle"
                    :percentage="Math.min(100, resourceUsage.memory / 2)"
                    :width="120"
                    :color="resourceUsage.memory > 150 ? '#F56C6C' : resourceUsage.memory > 100 ? '#E6A23C' : '#67C23A'"
                  />
                  <div class="usage-info">
                    <div class="usage-value">{{ formatMemory(resourceUsage.memory) }}</div>
                    <div class="usage-label">已使用</div>
                  </div>
                </div>
              </div>
            </el-card>

            <el-card class="resource-card">
              <template #header>
                <h3>CPU使用率</h3>
              </template>
              <div class="resource-content">
                <div class="usage-display">
                  <el-progress 
                    type="circle"
                    :percentage="resourceUsage.cpu"
                    :width="120"
                    :color="resourceUsage.cpu > 70 ? '#F56C6C' : resourceUsage.cpu > 50 ? '#E6A23C' : '#67C23A'"
                  />
                  <div class="usage-info">
                    <div class="usage-value">{{ resourceUsage.cpu }}%</div>
                    <div class="usage-label">处理器</div>
                  </div>
                </div>
              </div>
            </el-card>

            <el-card class="resource-card">
              <template #header>
                <h3>存储占用</h3>
              </template>
              <div class="resource-content">
                <div class="usage-display">
                  <el-progress 
                    type="circle"
                    :percentage="Math.min(100, resourceUsage.storage / 5)"
                    :width="120"
                    :color="resourceUsage.storage > 3 ? '#F56C6C' : resourceUsage.storage > 1 ? '#E6A23C' : '#67C23A'"
                  />
                  <div class="usage-info">
                    <div class="usage-value">{{ resourceUsage.storage }}KB</div>
                    <div class="usage-label">本地存储</div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="优化建议" name="suggestions">
          <div class="suggestions-section">
            <div class="suggestions-header">
              <h3>性能优化建议</h3>
              <el-tag type="danger" v-if="highPrioritySuggestions.length > 0">
                {{ highPrioritySuggestions.length }}个高优先级问题
              </el-tag>
            </div>
            
            <div class="suggestions-list">
              <el-card 
                v-for="suggestion in suggestions" 
                :key="suggestion.id"
                class="suggestion-card"
                :class="{ 'high-priority': suggestion.priority === 'high' }"
              >
                <div class="suggestion-content">
                  <div class="suggestion-header">
                    <div class="suggestion-icon">
                      {{ getSuggestionIcon(suggestion.category) }}
                    </div>
                    <div class="suggestion-info">
                      <h4>{{ suggestion.title }}</h4>
                      <p>{{ suggestion.description }}</p>
                    </div>
                    <div class="suggestion-meta">
                      <el-tag :type="getPriorityTag(suggestion.priority).type" size="small">
                        {{ getPriorityTag(suggestion.priority).text }}
                      </el-tag>
                      <el-tag 
                        :color="getImpactColor(suggestion.impact)" 
                        size="small"
                        style="color: white;"
                      >
                        {{ suggestion.impact === 'severe' ? '严重影响' : 
                           suggestion.impact === 'moderate' ? '中等影响' : '轻微影响' }}
                      </el-tag>
                    </div>
                  </div>
                  
                  <div class="suggestion-details">
                    <div class="solution">
                      <strong>解决方案：</strong>{{ suggestion.solution }}
                    </div>
                    
                    <div class="suggestion-actions">
                      <el-button 
                        v-if="!suggestion.implemented"
                        type="primary"
                        size="small"
                        @click="implementSuggestion(suggestion.id)"
                      >
                        <el-icon><MagicStaff /></el-icon>
                        实施优化
                      </el-button>
                      
                      <el-tag v-else type="success" size="small">
                        <el-icon><Check /></el-icon>
                        已实施
                      </el-tag>
                    </div>
                  </div>
                </div>
              </el-card>
              
              <div v-if="suggestions.length === 0" class="no-suggestions">
                <el-icon size="60" color="#67C23A"><Check /></el-icon>
                <p>暂无性能优化建议</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <!-- 底部操作 -->
      <div class="bottom-actions">
        <el-button @click="clearData" type="danger" plain>
          <el-icon><Delete /></el-icon>
          清除数据
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.performance-monitor-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px 0;
}

.page-title {
  font-size: 2.8em;
  color: white;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  font-weight: 700;
}

.page-subtitle {
  font-size: 1.3em;
  color: rgba(255, 255, 255, 0.9);
  opacity: 0.9;
  font-weight: 400;
}

.monitor-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
}

.control-panel {
  margin-bottom: 30px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.score-display {
  display: flex;
  align-items: center;
  gap: 20px;
}

.grade-circle {
  width: 80px;
  height: 80px;
  border: 5px solid;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.grade-text {
  font-size: 2em;
  font-weight: 700;
}

.score-info {
  text-align: left;
}

.score-value {
  font-size: 2.5em;
  font-weight: 700;
  color: #333333;
}

.score-max {
  font-size: 0.5em;
  color: #999999;
}

.score-label {
  color: #666666;
  font-size: 1.1em;
}

.control-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.metrics-grid, .resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.metric-card, .resource-card {
  transition: all 0.3s ease;
}

.metric-card:hover, .resource-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 15px;
}

.metric-header h3 {
  color: #333333;
  margin: 0;
  font-size: 1.2em;
}

.metric-content {
  text-align: center;
  padding: 20px 0;
}

.metric-value {
  font-size: 2em;
  font-weight: 700;
  color: #333333;
  margin-bottom: 15px;
}

.metric-status {
  font-size: 1.1em;
  margin-bottom: 20px;
  font-weight: 500;
}

.metric-status.warning {
  color: #F56C6C;
}

.usage-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
}

.usage-info {
  text-align: center;
}

.usage-value {
  font-size: 1.8em;
  font-weight: 700;
  color: #333333;
  margin-bottom: 5px;
}

.usage-label {
  color: #666666;
  font-size: 1em;
}

.suggestions-section {
  padding: 20px 0;
}

.suggestions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.suggestions-header h3 {
  color: #333333;
  margin: 0;
  font-size: 1.5em;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.suggestion-card {
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.suggestion-card.high-priority {
  border-left-color: #F56C6C;
  background: #fff8f8;
}

.suggestion-card:hover {
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.suggestion-content {
  padding: 20px;
}

.suggestion-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;
}

.suggestion-icon {
  font-size: 2em;
  min-width: 50px;
  text-align: center;
}

.suggestion-info {
  flex: 1;
}

.suggestion-info h4 {
  color: #333333;
  margin: 0 0 10px 0;
  font-size: 1.2em;
}

.suggestion-info p {
  color: #666666;
  margin: 0;
  line-height: 1.6;
}

.suggestion-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.suggestion-details {
  border-top: 1px solid #eeeeee;
  padding-top: 20px;
}

.solution {
  color: #444444;
  margin-bottom: 20px;
  line-height: 1.6;
}

.suggestion-actions {
  display: flex;
  justify-content: flex-end;
}

.no-suggestions {
  text-align: center;
  padding: 60px 20px;
  color: #999999;
}

.no-suggestions p {
  margin-top: 20px;
  font-size: 1.2em;
}

.bottom-actions {
  text-align: center;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #eeeeee;
}

.monitor-tabs :deep(.el-tabs__header) {
  margin-bottom: 30px;
}

.monitor-tabs :deep(.el-tabs__nav-wrap)::after {
  display: none;
}

.monitor-tabs :deep(.el-tabs__item) {
  font-size: 1.2em;
  font-weight: 500;
  padding: 0 30px;
  height: 60px;
  line-height: 60px;
  color: #666666;
}

.monitor-tabs :deep(.el-tabs__item.is-active) {
  color: #4CAF50;
  font-weight: 600;
}

/* 响应式设�?*/
@media (max-width: 768px) {
  .performance-monitor-container {
    padding: 20px 15px;
  }
  
  .page-title {
    font-size: 2.2em;
  }
  
  .page-subtitle {
    font-size: 1.1em;
  }
  
  .monitor-content {
    padding: 20px;
  }
  
  .panel-header {
    flex-direction: column;
    gap: 25px;
  }
  
  .score-display {
    justify-content: center;
  }
  
  .control-buttons {
    justify-content: center;
    width: 100%;
  }
  
  .metrics-grid, .resources-grid {
    grid-template-columns: 1fr;
  }
  
  .suggestion-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .suggestion-meta {
    flex-direction: row;
    justify-content: center;
  }
}
</style>
