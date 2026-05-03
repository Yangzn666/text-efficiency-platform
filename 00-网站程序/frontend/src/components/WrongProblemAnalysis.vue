<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMathStore } from '@/stores/math'
import { ElMessage } from 'element-plus'

const mathStore = useMathStore()

const activeTab = ref('analysis')
const selectedWrong = ref<any>(null)
const correctionForm = ref({
  mistakeType: '',
  correction: ''
})

// 错误类型选项
const mistakeTypes = [
  { value: '计算错误', label: '计算错误' },
  { value: '概念不清', label: '概念理解不清' },
  { value: '思路错误', label: '解题思路错误' },
  { value: '粗心大意', label: '粗心/审题不清' }
]

// 计算属�?
const wrongProblems = computed(() => mathStore.wrongProblems)
const wrongByType = computed(() => mathStore.wrongProblemsByType)
const dueForReview = computed(() => mathStore.dueForReview)

const mistakeTypeStats = computed(() => {
  const stats: Record<string, { count: number, percentage: number }> = {}
  const totalCount = wrongProblems.value.length
  
  Object.entries(wrongByType.value).forEach(([type, count]) => {
    stats[type] = {
      count,
      percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
    }
  })
  
  return stats
})

const reviewSchedule = computed(() => {
  const schedule: Record<string, any[]> = {}
  
  wrongProblems.value.forEach(problem => {
    const date = problem.nextReview.split('T')[0]
    if (!schedule[date]) {
      schedule[date] = []
    }
    schedule[date].push(problem)
  })
  
  return schedule
})

const handleCorrectionSubmit = async () => {
  if (!selectedWrong.value || !correctionForm.value.mistakeType) {
    ElMessage.warning('请选择错误类型并填写订正内容')
    return
  }

  try {
    await mathStore.updateWrongProblem(
      selectedWrong.value.id,
      correctionForm.value.correction,
      correctionForm.value.mistakeType
    )
    
    ElMessage.success('错题订正完成')
    selectedWrong.value = null
    correctionForm.value = { mistakeType: '', correction: '' }
  } catch (error) {
    ElMessage.error('订正失败')
  }
}

const quickReview = async (wrongId: string) => {
  const wrong = wrongProblems.value.find(w => w.id === wrongId)
  if (wrong) {
    selectedWrong.value = wrong
    correctionForm.value = {
      mistakeType: wrong.mistakeType,
      correction: wrong.correction
    }
  }
}

const deleteWrongProblem = async (wrongId: string) => {
  // 简单的删除实现（实际应用中应该有确认步骤）
  mathStore.wrongProblems = mathStore.wrongProblems.filter(w => w.id !== wrongId)
  await mathStore.saveMathData()
  ElMessage.success('错题已删除')
}

const exportWrongProblems = () => {
  const exportData = {
    problems: wrongProblems.value,
    stats: mistakeTypeStats.value,
    exportTime: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `错题本_${new Date().toISOString().split('T')[0]}.json`
  a.click()
  
  URL.revokeObjectURL(url)
  ElMessage.success('导出成功')
}

// 工具函数
const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return '#4CAF50'
  if (percentage >= 60) return '#FF9800'
  return '#FF6B6B'
}

const getMistakeTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    '计算错误': 'danger',
    '概念不清': 'warning',
    '思路错误': 'info',
    '粗心大意': 'success'
  }
  return colorMap[type] || 'default'
}

onMounted(() => {
  mathStore.initializeMathData()
})
</script>

<template>
  <div class="wrong-analysis-container">
    <!-- 顶部统计 -->
    <div class="stats-section">
      <h2 class="section-title">数学错题分析</h2>
      <p class="section-description">分析错误原因，避免重复犯错</p>
      
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-value">{{ wrongProblems.length }}</div>
          <div class="stat-label">错题总数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ dueForReview.length }}</div>
          <div class="stat-label">待复习</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ Object.keys(mistakeTypeStats).length }}</div>
          <div class="stat-label">错误类型</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ Math.round(Object.values(mistakeTypeStats).reduce((sum, stat) => sum + stat.percentage, 0) / Math.max(1, Object.keys(mistakeTypeStats).length)) }}%</div>
          <div class="stat-label">平均掌握度</div>
        </div>
      </div>
    </div>

    <!-- 主要功能区域 -->
    <div class="analysis-content">
      <el-tabs v-model="activeTab" class="analysis-tabs">
        <el-tab-pane label="错题统计" name="analysis">
          <div class="analysis-section">
            <!-- 错误类型分布 -->
            <el-card class="chart-card">
              <template #header>
                <div class="card-header">
                  <h3>错误类型分布</h3>
                </div>
              </template>
              
              <div class="mistake-distribution">
                <div 
                  v-for="(stat, type) in mistakeTypeStats" 
                  :key="type"
                  class="mistake-type-bar"
                >
                  <div class="type-info">
                    <span class="type-name">{{ type }}</span>
                    <span class="type-count">{{ stat.count }}个</span>
                  </div>
                  <el-progress 
                    :percentage="stat.percentage" 
                    :stroke-width="20"
                    :color="getProgressColor(stat.percentage)"
                  />
                  <div class="type-percentage">{{ stat.percentage }}%</div>
                </div>
              </div>
            </el-card>

            <!-- 复习计划 -->
            <el-card class="schedule-card">
              <template #header>
                <div class="card-header">
                  <h3>复习计划</h3>
                  <el-button size="small" @click="exportWrongProblems">
                    <el-icon><Download /></el-icon>
                    导出错题
                  </el-button>
                </div>
              </template>
              
              <div class="review-schedule">
                <div 
                  v-for="(problems, date) in reviewSchedule" 
                  :key="date"
                  class="schedule-day"
                >
                  <div class="date-header">
                    <h4>{{ date }}</h4>
                    <el-tag type="warning">{{ problems.length }}个</el-tag>
                  </div>
                  
                  <div class="problems-list">
                    <div 
                      v-for="problem in problems" 
                      :key="problem.id"
                      class="problem-item"
                      @click="quickReview(problem.id)"
                    >
                      <div class="problem-title">
                        {{ problem.originalProblem.title }}
                      </div>
                      <div class="problem-type">
                        <el-tag size="small" :type="getMistakeTypeColor(problem.mistakeType)">
                          {{ problem.mistakeType }}
                        </el-tag>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-if="Object.keys(reviewSchedule).length === 0" class="no-schedule">
                  <el-icon size="40" color="#999999"><Calendar /></el-icon>
                  <p>暂无待复习的错题</p>
                </div>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="错题详情" name="details">
          <div class="details-section">
            <div class="wrong-problems-grid">
              <el-card 
                v-for="wrong in wrongProblems" 
                :key="wrong.id"
                class="wrong-card"
              >
                <template #header>
                  <div class="wrong-header">
                    <h4>{{ wrong.originalProblem.title }}</h4>
                    <div class="wrong-actions">
                      <el-tag :type="getMistakeTypeColor(wrong.mistakeType)" size="small">
                        {{ wrong.mistakeType }}
                      </el-tag>
                      <el-button 
                        size="small" 
                        type="primary"
                        @click="quickReview(wrong.id)"
                      >
                        订正
                      </el-button>
                      <el-button 
                        size="small" 
                        type="danger"
                        @click="deleteWrongProblem(wrong.id)"
                      >
                        删除
                      </el-button>
                    </div>
                  </div>
                </template>
                
                <div class="wrong-content">
                  <div class="problem-info">
                    <p><strong>题目内容：</strong>{{ wrong.originalProblem.content }}</p>
                    <p><strong>标准答案：</strong>{{ wrong.originalProblem.solution }}</p>
                    <p v-if="wrong.originalProblem.userAnswer">
                      <strong>你的答案：</strong>{{ wrong.originalProblem.userAnswer }}
                    </p>
                  </div>
                  
                  <div v-if="wrong.correction" class="correction-info">
                    <p><strong>订正内容：</strong>{{ wrong.correction }}</p>
                    <p><strong>复习次数：</strong>{{ wrong.reviewCount }}次</p>
                    <p><strong>下次复习：</strong>{{ new Date(wrong.nextReview).toLocaleDateString() }}</p>
                  </div>
                </div>
              </el-card>
            </div>
            
            <div v-if="wrongProblems.length === 0" class="no-wrong-problems">
              <el-icon size="80" color="#999999"><DocumentChecked /></el-icon>
              <p>恭喜！目前没有错题</p>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="错题订正" name="correction" :disabled="!selectedWrong">
          <div v-if="selectedWrong" class="correction-section">
            <el-card>
              <template #header>
                <div class="card-header">
                  <h3>错题订正：{{ selectedWrong.originalProblem.title }}</h3>
                </div>
              </template>
              
              <div class="correction-content">
                <div class="problem-review">
                  <h4>题目回顾</h4>
                  <div class="problem-details">
                    <p><strong>题目：</strong>{{ selectedWrong.originalProblem.content }}</p>
                    <p><strong>标准答案：</strong>{{ selectedWrong.originalProblem.solution }}</p>
                    <p v-if="selectedWrong.originalProblem.userAnswer">
                      <strong>你的答案：</strong>{{ selectedWrong.originalProblem.userAnswer }}
                    </p>
                  </div>
                </div>
                
                <el-form :model="correctionForm" label-position="top" class="correction-form">
                  <el-form-item label="错误类型">
                    <el-select 
                      v-model="correctionForm.mistakeType" 
                      placeholder="选择错误类型"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="type in mistakeTypes"
                        :key="type.value"
                        :label="type.label"
                        :value="type.value"
                      />
                    </el-select>
                  </el-form-item>
                  
                  <el-form-item label="订正过程">
                    <el-input
                      v-model="correctionForm.correction"
                      type="textarea"
                      :rows="6"
                      placeholder="详细写出正确的解题过程和思路..."
                    />
                  </el-form-item>
                  
                  <el-form-item>
                    <el-button 
                      type="primary" 
                      size="large"
                      @click="handleCorrectionSubmit"
                    >
                      <el-icon><Check /></el-icon>
                      完成订正
                    </el-button>
                    <el-button 
                      size="large"
                      @click="selectedWrong = null"
                    >
                      取消
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
          </div>
          
          <div v-else class="no-selection">
            <el-icon size="60" color="#999999"><EditPen /></el-icon>
            <p>请先从错题详情中选择一道题目进行订正</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.wrong-analysis-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.section-title {
  text-align: center;
  color: white;
  font-size: 2.2em;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.section-description {
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2em;
  margin-bottom: 40px;
}

.stats-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  text-align: center;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
  margin-top: 30px;
}

.stat-card {
  background: linear-gradient(135deg, #FF6B6B 0%, #4CAF50 100%);
  color: white;
  padding: 25px;
  border-radius: 15px;
}

.stat-value {
  font-size: 2.5em;
  font-weight: 700;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 1.1em;
  opacity: 0.9;
}

.analysis-content {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}

.analysis-tabs :deep(.el-tabs__header) {
  margin-bottom: 30px;
}

.analysis-tabs :deep(.el-tabs__nav-wrap)::after {
  display: none;
}

.analysis-tabs :deep(.el-tabs__item) {
  font-size: 1.2em;
  font-weight: 500;
  padding: 0 30px;
  height: 60px;
  line-height: 60px;
  color: #666666;
}

.chart-card, .schedule-card {
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

.mistake-distribution {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mistake-type-bar {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 12px;
}

.type-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.type-name {
  font-weight: 500;
  color: #333333;
}

.type-count {
  color: #666666;
}

.type-percentage {
  text-align: right;
  font-weight: 600;
  color: #FF6B6B;
  margin-top: 5px;
}

.review-schedule {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.schedule-day {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
}

.date-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.date-header h4 {
  color: #333333;
  margin: 0;
}

.problems-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.problem-item {
  padding: 12px;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #eeeeee;
}

.problem-item:hover {
  transform: translateX(5px);
  border-color: #FF6B6B;
  box-shadow: 0 3px 10px rgba(255, 107, 107, 0.2);
}

.problem-title {
  color: #333333;
  margin-bottom: 8px;
  font-size: 0.95em;
}

.no-schedule, .no-wrong-problems, .no-selection {
  text-align: center;
  padding: 60px 20px;
  color: #999999;
}

.no-schedule p, .no-wrong-problems p, .no-selection p {
  margin-top: 20px;
  font-size: 1.2em;
}

.wrong-problems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.wrong-card {
  transition: all 0.3s ease;
}

.wrong-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.wrong-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.wrong-header h4 {
  color: #333333;
  margin: 0 0 15px 0;
  font-size: 1.2em;
}

.wrong-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wrong-content {
  color: #666666;
  line-height: 1.6;
}

.problem-info p, .correction-info p {
  margin: 10px 0;
}

.correction-section {
  max-width: 800px;
  margin: 0 auto;
}

.problem-review {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.problem-review h4 {
  color: #333333;
  margin-bottom: 15px;
  font-size: 1.3em;
}

.correction-form {
  max-width: 600px;
  margin: 0 auto;
}

/* 工具函数样式 */
.mistake-type-bar :deep(.el-progress-bar__outer) {
  border-radius: 10px;
}

.mistake-type-bar :deep(.el-progress-bar__inner) {
  border-radius: 10px;
}

/* 响应式设�?*/
@media (max-width: 768px) {
  .wrong-analysis-container {
    padding: 20px 15px;
  }
  
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .wrong-problems-grid {
    grid-template-columns: 1fr;
  }
  
  .review-schedule {
    grid-template-columns: 1fr;
  }
  
  .wrong-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .wrong-actions {
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>
