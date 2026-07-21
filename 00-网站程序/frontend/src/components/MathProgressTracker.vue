<template>
  <div class="math-progress-container">
    <div class="progress-header">
      <h2 class="page-title">📚 数学一学习进度</h2>
      <p class="page-subtitle">基础阶段：基础30讲 + 1000题A组</p>
    </div>
    
    <!-- 总体进度概览 -->
    <div class="progress-overview">
      <div class="overview-card">
        <div class="card-icon">📖</div>
        <div class="card-content">
          <h3>学习模块</h3>
          <div class="progress-numbers">
            <span class="current">{{ learningCompleted }}</span>
            <span class="separator">/</span>
            <span class="total">{{ totalChapters }}</span>
          </div>
          <div class="progress-percent">{{ learningPercent }}%</div>
          <el-progress 
            :percentage="learningPercent" 
            :stroke-width="8"
            color="#4CAF50"
            class="progress-bar"
          />
        </div>
      </div>
      
      <div class="overview-card">
        <div class="card-icon">✏️</div>
        <div class="card-content">
          <h3>课后习题</h3>
          <div class="progress-numbers">
            <span class="current">{{ exerciseCompleted }}</span>
            <span class="separator">/</span>
            <span class="total">{{ totalChapters }}</span>
          </div>
          <div class="progress-percent">{{ exercisePercent }}%</div>
          <el-progress 
            :percentage="exercisePercent" 
            :stroke-width="8"
            color="#16345c"
            class="progress-bar"
          />
        </div>
      </div>
    </div>
    
    <!-- 学习模块详情 -->
    <div class="module-section">
      <div class="section-header">
        <h3>📖 学习模块进度</h3>
        <div class="section-stats">
          <span class="stat-item">已完成: <strong>{{ learningCompleted }}</strong></span>
          <span class="stat-item">未完成: <strong>{{ totalChapters - learningCompleted }}</strong></span>
        </div>
      </div>
      
      <div class="chapters-grid">
        <div 
          v-for="chapter in chapters" 
          :key="'learning-' + chapter.id"
          :class="[
            'chapter-card',
            getLearningStatusClass(chapter.id)
          ]"
        >
          <div class="chapter-header">
            <span class="chapter-number">第{{ chapter.id }}讲</span>
            <el-tag 
              :type="getLearningTagType(chapter.id)"
              size="small"
            >
              {{ getLearningStatusText(chapter.id) }}
            </el-tag>
          </div>
          <div class="chapter-task">学习</div>
        </div>
      </div>
    </div>
    
    <!-- 习题模块详情 -->
    <div class="module-section">
      <div class="section-header">
        <h3>✏️ 课后习题进度</h3>
        <div class="section-stats">
          <span class="stat-item">已完成: <strong>{{ exerciseCompleted }}</strong></span>
          <span class="stat-item">未完成: <strong>{{ totalChapters - exerciseCompleted }}</strong></span>
        </div>
      </div>
      
      <div class="chapters-grid">
        <div 
          v-for="chapter in chapters" 
          :key="'exercise-' + chapter.id"
          :class="[
            'chapter-card',
            getExerciseStatusClass(chapter.id)
          ]"
        >
          <div class="chapter-header">
            <span class="chapter-number">第{{ chapter.id }}讲</span>
            <el-tag 
              :type="getExerciseTagType(chapter.id)"
              size="small"
            >
              {{ getExerciseStatusText(chapter.id) }}
            </el-tag>
          </div>
          <div class="chapter-task">课后习题</div>
        </div>
      </div>
    </div>
    
    <!-- 未完成提醒 -->
    <div v-if="incompleteItems.length > 0" class="reminder-section">
      <el-alert
        title="待完成任务提醒"
        type="warning"
        show-icon
        :closable="false"
      >
        <template #default>
          <div class="reminder-content">
            <p>以下内容需要继续完成：</p>
            <ul>
              <li v-for="item in incompleteItems" :key="item.key">
                {{ item.text }}
              </li>
            </ul>
          </div>
        </template>
      </el-alert>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 章节数据
const chapters = ref([
  { id: 1, title: '函数、极限、连续' },
  { id: 2, title: '一元函数微分学' },
  { id: 3, title: '一元函数积分学' },
  { id: 4, title: '向量代数和空间解析几何' },
  { id: 5, title: '多元函数微分学' },
  { id: 6, title: '多元函数积分学' },
  { id: 7, title: '无穷级数' },
  { id: 8, title: '常微分方程' },
  { id: 9, title: '行列式' },
  { id: 10, title: '矩阵' },
  { id: 11, title: '向量' },
  { id: 12, title: '线性方程组' },
  { id: 13, title: '矩阵的特征值和特征向量' },
  { id: 14, title: '二次型' },
  { id: 15, title: '随机事件和概率' },
  { id: 16, title: '随机变量及其分布' },
  { id: 17, title: '多维随机变量及其分布' },
  { id: 18, title: '随机变量的数字特征' }
])

// 学习进度状态（基础三十讲）
const learningStatus = ref({
  // 高等数学部分（1-8讲）：已完成
  1: 'completed', 2: 'completed', 3: 'completed', 4: 'completed',
  5: 'completed', 6: 'completed', 7: 'completed', 8: 'completed',
  // 线性代数部分（9-14讲）：已完成
  9: 'completed', 10: 'completed', 11: 'completed', 
  12: 'completed', 13: 'completed', 14: 'completed',
  // 概率论部分（15-18讲）：还剩3讲未完成（16-18讲）
  15: 'completed', 16: 'pending', 17: 'pending', 18: 'pending'
})

// 习题进度状态（1000题A组）
const exerciseStatus = ref({
  // 高等数学部分（1-18讲）：1-17讲完成，第18讲未完成
  1: 'completed', 2: 'completed', 3: 'completed', 4: 'completed',
  5: 'completed', 6: 'completed', 7: 'completed', 8: 'completed',
  9: 'completed', 10: 'completed', 11: 'completed', 12: 'completed',
  13: 'completed', 14: 'completed', 15: 'completed', 16: 'completed',
  17: 'completed', 18: 'pending',
  // 线性代数部分（9-14讲已在上面标记为completed）
  // 概率论部分（15-18讲）：还剩最后3讲（16-18讲未完成）
  // 注意：这里15讲已完成，16-18讲未完成
})

// 计算属性
const totalChapters = computed(() => chapters.value.length)

const learningCompleted = computed(() => {
  return Object.values(learningStatus.value).filter(status => status === 'completed').length
})

const exerciseCompleted = computed(() => {
  return Object.values(exerciseStatus.value).filter(status => status === 'completed').length
})

const learningPercent = computed(() => {
  return Math.round((learningCompleted.value / totalChapters.value) * 100)
})

const exercisePercent = computed(() => {
  return Math.round((exerciseCompleted.value / totalChapters.value) * 100)
})

const incompleteItems = computed(() => {
  const items = []
  
  // 检查未完成的学习（基础三十讲）
  if (learningStatus.value[16] === 'pending') {
    items.push({
      key: 'learning-16',
      text: '基础三十讲 - 第16讲：随机变量及其分布'
    })
  }
  if (learningStatus.value[17] === 'pending') {
    items.push({
      key: 'learning-17',
      text: '基础三十讲 - 第17讲：多维随机变量及其分布'
    })
  }
  if (learningStatus.value[18] === 'pending') {
    items.push({
      key: 'learning-18',
      text: '基础三十讲 - 第18讲：随机变量的数字特征'
    })
  }
  
  // 检查未完成的习题（1000题A组）
  if (exerciseStatus.value[18] === 'pending') {
    items.push({
      key: 'exercise-18',
      text: '1000题A组 - 第18讲习题（高数部分最后一讲）'
    })
  }
  if (exerciseStatus.value[16] === 'pending') {
    items.push({
      key: 'exercise-16',
      text: '1000题A组 - 第16讲习题（概率论）'
    })
  }
  if (exerciseStatus.value[17] === 'pending') {
    items.push({
      key: 'exercise-17',
      text: '1000题A组 - 第17讲习题（概率论）'
    })
  }
  
  return items
})

// 方法
const getLearningStatusClass = (chapterId) => {
  return learningStatus.value[chapterId] === 'completed' ? 'completed' : 'pending'
}

const getExerciseStatusClass = (chapterId) => {
  return exerciseStatus.value[chapterId] === 'completed' ? 'completed' : 'pending'
}

const getLearningTagType = (chapterId) => {
  return learningStatus.value[chapterId] === 'completed' ? 'success' : 'danger'
}

const getExerciseTagType = (chapterId) => {
  return exerciseStatus.value[chapterId] === 'completed' ? 'success' : 'danger'
}

const getLearningStatusText = (chapterId) => {
  return learningStatus.value[chapterId] === 'completed' ? '已完成' : '未学习'
}

const getExerciseStatusText = (chapterId) => {
  return exerciseStatus.value[chapterId] === 'completed' ? '已完成' : '未完成'
}
</script>

<style scoped>
.math-progress-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.progress-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #666;
}

.progress-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.overview-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-5px);
}

.card-icon {
  font-size: 3rem;
}

.card-content {
  flex: 1;
}

.card-content h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.progress-numbers {
  display: flex;
  align-items: baseline;
  gap: 5px;
  margin-bottom: 10px;
}

.current {
  font-size: 2.5rem;
  font-weight: bold;
  color: #4CAF50;
}

.separator {
  font-size: 1.5rem;
  color: #999;
}

.total {
  font-size: 1.5rem;
  color: #999;
}

.progress-percent {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 15px;
}

.progress-bar {
  margin-top: 10px;
}

.module-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.section-header h3 {
  color: #333;
  font-size: 1.5rem;
}

.section-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  color: #666;
}

.stat-item strong {
  color: #4CAF50;
  font-size: 1.2rem;
}

.chapters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
}

.chapter-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.chapter-card.completed {
  background: #e8f5e8;
  border-color: #4CAF50;
}

.chapter-card.pending {
  background: #fce8e8;
  border-color: #f44336;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.chapter-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.chapter-number {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.chapter-task {
  font-size: 0.9rem;
  color: #666;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 20px;
}

.reminder-section {
  margin-top: 30px;
}

.reminder-content ul {
  margin-top: 10px;
  padding-left: 20px;
}

.reminder-content li {
  margin-bottom: 5px;
  color: #666;
}

@media (max-width: 768px) {
  .progress-overview {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .chapters-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
  
  .page-title {
    font-size: 2rem;
  }
}
</style>