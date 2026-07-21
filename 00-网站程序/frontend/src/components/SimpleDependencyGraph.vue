<template>
  <div class="simple-dependency-graph">
    <!-- 控制面板 -->
    <div class="graph-controls">
      <h2 class="controls-title">📊 数学章节依赖关系图</h2>
      <div class="control-buttons">
        <el-button @click="refreshGraph">
          <el-icon><Refresh /></el-icon>
          刷新图表
        </el-button>
      </div>
    </div>

    <!-- 图表容器 -->
    <div class="graph-container">
      <div v-if="isLoading" class="loading">
        <el-spinner />
        <p>正在加载依赖关系数据...</p>
      </div>
      
      <div v-else-if="chapters.length === 0" class="no-data">
        <el-icon size="60" color="#999"><Document /></el-icon>
        <p>暂无章节数据</p>
      </div>
      
      <div v-else class="graph-content">
        <!-- 简单的列表视图 -->
        <div class="chapters-list">
          <div 
            v-for="chapter in chapters" 
            :key="chapter.id"
            class="chapter-item"
            :class="getChapterStatusClass(chapter)"
          >
            <div class="chapter-header">
              <span class="chapter-number">{{ chapter.order }}</span>
              <h3 class="chapter-title">{{ chapter.title }}</h3>
              <el-tag :type="getDifficultyTag(chapter.difficulty)" size="small">
                {{ chapter.difficulty }}
              </el-tag>
            </div>
            
            <div class="chapter-details">
              <div class="progress-info">
                <span>掌握度:</span>
                <el-progress 
                  :percentage="chapter.masteryLevel" 
                  :stroke-width="10"
                  :show-text="false"
                  :color="getProgressColor(chapter.masteryLevel)"
                />
                <span class="mastery-percent">{{ chapter.masteryLevel }}%</span>
              </div>
              
              <div class="prerequisites-info">
                <span>前置章节:</span>
                <span class="prereq-list">
                  {{ getPrerequisiteNames(chapter.prerequisites) || '无' }}
                </span>
              </div>
              
              <div class="keypoints-info">
                <span>关键知识点:</span>
                <div class="keypoints-tags">
                  <el-tag 
                    v-for="(point, index) in chapter.keyPoints.slice(0, 3)" 
                    :key="index"
                    size="small"
                    type="info"
                  >
                    {{ point }}
                  </el-tag>
                </div>
              </div>
              
              <div class="actions">
                <el-button 
                  size="small" 
                  type="primary" 
                  @click="updateChapterProgress(chapter)"
                >
                  更新进度
                </el-button>
                <el-button 
                  size="small" 
                  @click="viewChapterDetails(chapter)"
                >
                  详细信息
                </el-button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 依赖关系图谱 -->
        <div class="dependency-map">
          <h3>🔗 章节依赖关系</h3>
          <div class="map-content">
            <div 
              v-for="chapter in sortedChapters" 
              :key="chapter.id"
              class="map-item"
              :class="getChapterStatusClass(chapter)"
            >
              <div class="map-header">
                <span class="map-number">{{ chapter.order }}</span>
                <span class="map-title">{{ chapter.title }}</span>
              </div>
              
              <div class="map-prerequisites" v-if="chapter.prerequisites.length > 0">
                <div class="arrow">←</div>
                <div class="prereq-nodes">
                  <span 
                    v-for="prereqId in chapter.prerequisites" 
                    :key="prereqId"
                    class="prereq-node"
                  >
                    {{ getChapterByIndex(prereqId)?.order || '?' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 进度更新弹窗 -->
    <el-dialog
      v-model="showProgressModal"
      title="更新学习进度"
      width="400px"
    >
      <div v-if="currentChapter">
        <p>更新 <strong>{{ currentChapter.title }}</strong> 的掌握度:</p>
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
          <el-button @click="showProgressModal = false">取消</el-button>
          <el-button type="primary" @click="confirmProgressUpdate">确认更新</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMathStore } from '@/stores/math'
import { ElMessage } from 'element-plus'
import { Refresh, Document } from '@element-plus/icons-vue'

const mathStore = useMathStore()

// 状态
const isLoading = ref(true)
const showProgressModal = ref(false)
const currentChapter = ref<any>(null)
const newMasteryLevel = ref(0)

// 计算属性
const chapters = computed(() => mathStore.chapters)

const sortedChapters = computed(() => {
  return [...chapters.value].sort((a, b) => a.order - b.order)
})

// 方法
const refreshGraph = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}

const getChapterStatusClass = (chapter: any) => {
  if (chapter.masteryLevel >= 85) return 'completed'
  if (chapter.masteryLevel >= 70) return 'good'
  if (chapter.masteryLevel >= 50) return 'needs-improvement'
  return 'weak'
}

const getDifficultyTag = (difficulty: string) => {
  const types: Record<string, any> = {
    '基础': 'success',
    '进阶': 'warning',
    '难点': 'danger'
  }
  return types[difficulty] || 'info'
}

const getProgressColor = (mastery: number) => {
  if (mastery >= 85) return '#4CAF50'
  if (mastery >= 70) return '#FFD700'
  if (mastery >= 50) return '#FF9800'
  return '#FF6B6B'
}

const getMasteryTag = (mastery: number) => {
  if (mastery >= 85) return 'success'
  if (mastery >= 70) return 'warning'
  if (mastery >= 50) return 'info'
  return 'danger'
}

const getStatusText = (mastery: number) => {
  if (mastery >= 85) return '已完成'
  if (mastery >= 70) return '掌握良好'
  if (mastery >= 50) return '需要加强'
  return '薄弱环节'
}

const getPrerequisiteNames = (prerequisites: string[]) => {
  const prereqChapters = prerequisites
    .map(id => chapters.value.find(c => c.id === id))
    .filter(Boolean)
    .map((c: any) => c.title)
  return prereqChapters.length > 0 ? prereqChapters.join(', ') : ''
}

const getChapterByIndex = (chapterId: string) => {
  return chapters.value.find(c => c.id === chapterId)
}

const updateChapterProgress = (chapter: any) => {
  currentChapter.value = chapter
  newMasteryLevel.value = chapter.masteryLevel
  showProgressModal.value = true
}

const confirmProgressUpdate = async () => {
  if (!currentChapter.value) return

  try {
    await mathStore.updateChapterProgress(currentChapter.value.id, newMasteryLevel.value)
    ElMessage.success('进度更新成功')
    showProgressModal.value = false
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

const viewChapterDetails = (chapter: any) => {
  ElMessage.info(`查看 ${chapter.title} 的详细信息`)
}

// 生命周期
onMounted(async () => {
  try {
    await mathStore.initializeMathData()
    isLoading.value = false
  } catch (error) {
    console.error('初始化失败:', error)
    isLoading.value = false
  }
})
</script>

<style scoped>
.simple-dependency-graph {
  padding: 20px;
  max-width: 1200px;
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
}

.graph-container {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  min-height: 500px;
}

.loading, .no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #999;
}

.loading p, .no-data p {
  margin-top: 15px;
  font-size: 1.1em;
}

.chapters-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.chapter-item {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 20px;
  border-left: 5px solid #4CAF50;
  transition: all 0.3s ease;
}

.chapter-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.chapter-item.completed { border-left-color: #4CAF50; }
.chapter-item.good { border-left-color: #FFD700; }
.chapter-item.needs-improvement { border-left-color: #FF9800; }
.chapter-item.weak { border-left-color: #FF6B6B; }

.chapter-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.chapter-number {
  background: #4CAF50;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.chapter-title {
  flex: 1;
  margin: 0;
  font-size: 1.2em;
  color: #333;
}

.chapter-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.progress-info, .prerequisites-info, .keypoints-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-info span:first-child,
.prerequisites-info span:first-child,
.keypoints-info span:first-child {
  font-weight: 500;
  color: #666;
  min-width: 80px;
}

.mastery-percent {
  font-weight: bold;
  color: #333;
  min-width: 40px;
}

.prereq-list {
  color: #666;
  flex: 1;
}

.keypoints-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  flex: 1;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.dependency-map {
  background: #f0f8ff;
  border-radius: 15px;
  padding: 25px;
}

.dependency-map h3 {
  margin: 0 0 20px 0;
  color: #333;
  text-align: center;
}

.map-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.map-item {
  background: white;
  border-radius: 10px;
  padding: 15px;
  border-left: 3px solid #4CAF50;
}

.map-item.completed { border-left-color: #4CAF50; }
.map-item.good { border-left-color: #FFD700; }
.map-item.needs-improvement { border-left-color: #FF9800; }
.map-item.weak { border-left-color: #FF6B6B; }

.map-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.map-number {
  background: #4CAF50;
  color: white;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9em;
  font-weight: bold;
}

.map-title {
  font-weight: 500;
  color: #333;
}

.map-prerequisites {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9em;
}

.arrow {
  color: #999;
  font-weight: bold;
}

.prereq-nodes {
  display: flex;
  gap: 5px;
}

.prereq-node {
  background: #eef3fa;
  color: #16345c;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: 500;
}

.slider-info {
  margin-top: 20px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .simple-dependency-graph {
    padding: 15px;
  }
  
  .chapters-list {
    grid-template-columns: 1fr;
  }
  
  .chapter-header {
    flex-wrap: wrap;
  }
  
  .chapter-number {
    width: 25px;
    height: 25px;
    font-size: 0.9em;
  }
}
</style>