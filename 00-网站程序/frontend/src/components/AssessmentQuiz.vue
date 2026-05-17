<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLearningPathStore } from '@/stores/learningPath'
import { ElMessage, ElMessageBox } from 'element-plus'

const learningPathStore = useLearningPathStore()

const props = defineProps<{
  subject: string
}>()

const emit = defineEmits<{
  complete: [result: any]
  cancel: []
}>()

// 计算属性
const currentAssessment = computed(() => learningPathStore.currentAssessment)
const currentQuestion = computed(() => {
  if (!currentAssessment.value) return null
  return currentAssessment.value.questions[currentAssessment.value.currentIndex]
})
const progress = computed(() => {
  if (!currentAssessment.value) return 0
  return Math.round(
    ((currentAssessment.value.currentIndex + 1) / currentAssessment.value.questions.length) * 100
  )
})
const isLastQuestion = computed(() => {
  if (!currentAssessment.value) return false
  return currentAssessment.value.currentIndex === currentAssessment.value.questions.length - 1
})

// 方法
const selectAnswer = (index: number) => {
  if (!currentAssessment.value) return
  learningPathStore.answerQuestion(currentAssessment.value.currentIndex, index)
}

const handleNext = () => {
  if (!currentAssessment.value) return
  
  // 检查是否已答题
  if (currentAssessment.value.answers[currentAssessment.value.currentIndex] === -1) {
    ElMessage.warning('请先选择一个答案')
    return
  }
  
  if (isLastQuestion.value) {
    // 最后一题，显示确认对话框
    ElMessageBox.confirm(
      '确定要提交测评吗？提交后将显示结果。',
      '确认提交',
      {
        confirmButtonText: '提交',
        cancelButtonText: '继续检查',
        type: 'warning'
      }
    ).then(() => {
      const result = learningPathStore.submitAssessment()
      if (result) {
        ElMessage.success('测评完成！')
        emit('complete', result)
      }
    }).catch(() => {
      // 用户取消
    })
  } else {
    learningPathStore.nextQuestion()
  }
}

const handlePrev = () => {
  learningPathStore.prevQuestion()
}

const handleCancel = () => {
  ElMessageBox.confirm(
    '确定要取消测评吗？进度将不会保存。',
    '确认取消',
    {
      confirmButtonText: '确定',
      cancelButtonText: '继续测评',
      type: 'warning'
    }
  ).then(() => {
    learningPathStore.cancelAssessment()
    emit('cancel')
  }).catch(() => {
    // 用户取消
  })
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return '#4CAF50'
    case 'medium': return '#FF9800'
    case 'hard': return '#FF6B6B'
    default: return '#999'
  }
}

const getDifficultyText = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return '简单'
    case 'medium': return '中等'
    case 'hard': return '困难'
    default: return '未知'
  }
}
</script>

<template>
  <div class="assessment-container" v-if="currentAssessment">
    <!-- 测评头部 -->
    <div class="assessment-header">
      <h3>📝 {{ currentAssessment.subject }} 水平测评</h3>
      <el-button text @click="handleCancel">取消</el-button>
    </div>

    <!-- 进度条 -->
    <div class="progress-section">
      <el-progress :percentage="progress" :stroke-width="8" />
      <div class="progress-text">
        第 {{ currentAssessment.currentIndex + 1 }} / {{ currentAssessment.questions.length }} 题
      </div>
    </div>

    <!-- 题目卡片 -->
    <div class="question-card" v-if="currentQuestion">
      <div class="question-header">
        <el-tag 
          :color="getDifficultyColor(currentQuestion.difficulty)"
          effect="dark"
          size="small"
        >
          {{ getDifficultyText(currentQuestion.difficulty) }}
        </el-tag>
        <span class="knowledge-point">{{ currentQuestion.knowledgePoint }}</span>
      </div>

      <div class="question-content">
        <h4>{{ currentQuestion.question }}</h4>
      </div>

      <div class="options-list">
        <div
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          class="option-item"
          :class="{ 
            'selected': currentAssessment.answers[currentAssessment.currentIndex] === index,
            'hoverable': true
          }"
          @click="selectAnswer(index)"
        >
          <div class="option-marker">
            {{ String.fromCharCode(65 + index) }}
          </div>
          <div class="option-text">{{ option }}</div>
        </div>
      </div>
    </div>

    <!-- 导航按钮 -->
    <div class="navigation-buttons">
      <el-button 
        @click="handlePrev"
        :disabled="currentAssessment.currentIndex === 0"
      >
        上一题
      </el-button>
      
      <el-button 
        type="primary"
        @click="handleNext"
      >
        {{ isLastQuestion ? '提交测评' : '下一题' }}
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.assessment-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.assessment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.assessment-header h3 {
  font-size: 1.5em;
  color: #333;
  margin: 0;
}

.progress-section {
  margin-bottom: 30px;
}

.progress-text {
  text-align: center;
  color: #666;
  margin-top: 10px;
  font-size: 0.95em;
}

.question-card {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 25px;
}

.question-header {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 20px;
}

.knowledge-point {
  color: #666;
  font-size: 0.9em;
}

.question-content h4 {
  font-size: 1.2em;
  color: #333;
  line-height: 1.6;
  margin: 0;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 25px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-item.hoverable:hover {
  border-color: #4CAF50;
  background: #f1f8f4;
}

.option-item.selected {
  border-color: #4CAF50;
  background: #e8f5e9;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
}

.option-marker {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border-radius: 50%;
  font-weight: 600;
  color: #666;
  flex-shrink: 0;
}

.option-item.selected .option-marker {
  background: #4CAF50;
  color: white;
}

.option-text {
  flex: 1;
  color: #333;
  font-size: 1em;
  line-height: 1.5;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.navigation-buttons .el-button {
  flex: 1;
  height: 45px;
  font-size: 1em;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .assessment-container {
    padding: 20px;
  }
  
  .assessment-header h3 {
    font-size: 1.3em;
  }
  
  .question-card {
    padding: 20px;
  }
  
  .question-content h4 {
    font-size: 1.1em;
  }
  
  .option-item {
    padding: 12px 15px;
  }
  
  .option-marker {
    width: 28px;
    height: 28px;
    font-size: 0.9em;
  }
  
  .option-text {
    font-size: 0.95em;
  }
}

@media (max-width: 480px) {
  .assessment-container {
    padding: 15px;
    border-radius: 15px;
  }
  
  .assessment-header h3 {
    font-size: 1.15em;
  }
  
  .question-card {
    padding: 15px;
  }
  
  .question-content h4 {
    font-size: 1em;
  }
  
  .option-item {
    padding: 10px 12px;
    gap: 10px;
  }
  
  .option-marker {
    width: 26px;
    height: 26px;
    font-size: 0.85em;
  }
  
  .option-text {
    font-size: 0.9em;
  }
  
  .navigation-buttons .el-button {
    height: 40px;
    font-size: 0.9em;
  }
}
</style>
