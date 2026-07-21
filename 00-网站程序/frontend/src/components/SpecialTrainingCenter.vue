<template>
  <div class="special-training-center">
    <!-- 导航菜单 -->
    <MathReinforcementNav />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>🎯 专题突破中心</h1>
      <p class="subtitle">针对薄弱环节 · 专项训练 · 快速提升</p>
    </div>

    <!-- 智能推荐 -->
    <div class="recommendations-section" v-if="recommendedTrainings.length > 0">
      <div class="section-header">
        <h2>💡 智能推荐</h2>
        <p>基于你的学习情况,以下专题建议优先学习</p>
      </div>

      <div class="recommendations-list">
        <div 
          v-for="training in recommendedTrainings" 
          :key="training.id"
          class="recommendation-card"
        >
          <div class="recommend-badge">强烈推荐</div>
          <div class="card-content">
            <h3>{{ training.name }}</h3>
            <p class="reason">{{ getRecommendReason(training) }}</p>
            <div class="training-info">
              <span>📺 {{ training.videoSource }}</span>
              <span>⏱️ {{ training.estimatedTime }}小时</span>
            </div>
            <div class="actions">
              <el-button type="primary" @click="startTraining(training)">
                开始学习
              </el-button>
              <el-button @click="snoozeTraining(training)">
                稍后学习
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 所有专题 -->
    <div class="all-trainings-section">
      <div class="section-header">
        <h2>📚 所有专题</h2>
        <el-button type="primary" @click="showAddDialog = true">
          <el-icon><Plus /></el-icon>
          添加专题
        </el-button>
      </div>

      <!-- 筛选器 -->
      <div class="filters">
        <el-radio-group v-model="filterSubject" @change="applyFilters">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="高等数学">高等数学</el-radio-button>
          <el-radio-button label="线性代数">线性代数</el-radio-button>
          <el-radio-button label="概率论">概率论</el-radio-button>
        </el-radio-group>

        <el-radio-group v-model="filterStatus" @change="applyFilters">
          <el-radio-button label="">全部状态</el-radio-button>
          <el-radio-button label="completed">已完成</el-radio-button>
          <el-radio-button label="in-progress">进行中</el-radio-button>
          <el-radio-button label="not-started">未开始</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 专题列表 -->
      <div class="trainings-grid">
        <div 
          v-for="training in filteredTrainings" 
          :key="training.id"
          class="training-card"
          :class="{ completed: training.completed }"
        >
          <div class="card-header">
            <h3>{{ training.name }}</h3>
            <el-tag 
              v-if="training.completed" 
              type="success"
              size="small"
            >
              ✓ 已完成
            </el-tag>
          </div>

          <div class="card-body">
            <p class="description">{{ training.description }}</p>
            
            <div class="meta-info">
              <div class="meta-item">
                <span class="label">科目:</span>
                <span class="value">{{ training.subject }}</span>
              </div>
              <div class="meta-item">
                <span class="label">视频来源:</span>
                <span class="value">{{ training.videoSource }}</span>
              </div>
              <div class="meta-item">
                <span class="label">预计时长:</span>
                <span class="value">{{ training.estimatedTime }}小时</span>
              </div>
            </div>

            <div class="progress-section" v-if="!training.completed">
              <div class="progress-header">
                <span>学习进度</span>
                <span>{{ training.progress }}%</span>
              </div>
              <el-progress 
                :percentage="training.progress" 
                :stroke-width="8"
                :color="getProgressColor(training.progress)"
              />
              <div class="progress-stats">
                <span>已做 {{ training.problemsSolved }} 道题</span>
                <span>掌握度 {{ training.masteryLevel }}%</span>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <el-button 
              v-if="!training.completed"
              type="primary" 
              size="small"
              @click="continueTraining(training)"
            >
              {{ training.progress === 0 ? '开始学习' : '继续学习' }}
            </el-button>
            <el-button 
              v-else
              type="success" 
              size="small"
              disabled
            >
              已完成
            </el-button>
            <el-button size="small" @click="viewTrainingDetail(training)">
              详情
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加专题对话框 -->
    <el-dialog
      v-model="showAddDialog"
      title="添加专题"
      width="600px"
    >
      <el-form :model="newTraining" label-width="100px">
        <el-form-item label="专题名称">
          <el-input v-model="newTraining.name" placeholder="如: 微分中值定理专题" />
        </el-form-item>

        <el-form-item label="所属科目">
          <el-select v-model="newTraining.subject" style="width: 100%">
            <el-option label="高等数学" value="高等数学" />
            <el-option label="线性代数" value="线性代数" />
            <el-option label="概率论" value="概率论" />
          </el-select>
        </el-form-item>

        <el-form-item label="专题描述">
          <el-input
            v-model="newTraining.description"
            type="textarea"
            :rows="3"
            placeholder="描述专题内容和目标..."
          />
        </el-form-item>

        <el-form-item label="视频来源">
          <el-input v-model="newTraining.videoSource" placeholder="如: B站某某UP主、武忠祥" />
        </el-form-item>

        <el-form-item label="预计时长">
          <el-input-number 
            v-model="newTraining.estimatedTime" 
            :min="1" 
            :max="50"
          />
          <span style="margin-left: 8px">小时</span>
        </el-form-item>

        <el-form-item label="视频链接">
          <el-input v-model="newTraining.videoUrl" placeholder="B站或其他平台链接" />
        </el-form-item>

        <el-form-item label="相关资料">
          <el-input
            v-model="materialLinksText"
            type="textarea"
            :rows="2"
            placeholder="每行一个链接..."
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="submitNewTraining">
          添加
        </el-button>
      </template>
    </el-dialog>

    <!-- 更新进度对话框 -->
    <el-dialog
      v-model="showProgressDialog"
      title="更新学习进度"
      width="500px"
      v-if="currentTraining"
    >
      <div class="progress-update">
        <h3>{{ currentTraining.name }}</h3>
        
        <el-form label-width="100px">
          <el-form-item label="学习进度">
            <el-slider 
              v-model="tempProgress" 
              :min="0" 
              :max="100"
              show-input
            />
          </el-form-item>

          <el-form-item label="已做题数">
            <el-input-number 
              v-model="tempProblemsSolved" 
              :min="0"
            />
          </el-form-item>
        </el-form>

        <div class="tips">
          <p>💡 提示:</p>
          <ul>
            <li>进度达到100%时自动标记为完成</li>
            <li>建议每看完一个视频更新一次进度</li>
            <li>配套习题做完后更新题数</li>
          </ul>
        </div>
      </div>

      <template #footer>
        <el-button @click="showProgressDialog = false">取消</el-button>
        <el-button type="primary" @click="saveProgress">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useMathReinforcementStore } from '@/stores/mathReinforcement'
import type { SpecialTraining } from '@/stores/mathReinforcement'
import MathReinforcementNav from './MathReinforcementNav.vue'

const store = useMathReinforcementStore()

// 筛选状态
const filterSubject = ref('')
const filterStatus = ref('')

// 对话框状态
const showAddDialog = ref(false)
const showProgressDialog = ref(false)
const currentTraining = ref<SpecialTraining | null>(null)

// 临时变量
const tempProgress = ref(0)
const tempProblemsSolved = ref(0)

// 新专题表单
const newTraining = ref({
  name: '',
  subject: '高等数学',
  description: '',
  videoSource: '',
  estimatedTime: 5,
  videoUrl: '',
  materialLinks: [] as string[]
})

const materialLinksText = ref('')

// 计算属性
const recommendedTrainings = computed(() => {
  // 基于薄弱知识点推荐专题
  const needsTrainingTopics = store.needsSpecialTrainingTopics
  
  if (needsTrainingTopics.length === 0) return []

  // 统计各科目需要的专题数量
  const subjectCount: Record<string, number> = {}
  needsTrainingTopics.forEach(topic => {
    subjectCount[topic.subject] = (subjectCount[topic.subject] || 0) + 1
  })

  // 返回对应的专题
  return store.specialTrainings.filter(training => {
    return subjectCount[training.subject] && subjectCount[training.subject] >= 2 && !training.completed
  }).slice(0, 3)
})

const filteredTrainings = computed(() => {
  let trainings = [...store.specialTrainings]

  if (filterSubject.value) {
    trainings = trainings.filter(t => t.subject === filterSubject.value)
  }

  if (filterStatus.value === 'completed') {
    trainings = trainings.filter(t => t.completed)
  } else if (filterStatus.value === 'in-progress') {
    trainings = trainings.filter(t => t.progress > 0 && !t.completed)
  } else if (filterStatus.value === 'not-started') {
    trainings = trainings.filter(t => t.progress === 0)
  }

  return trainings
})

// 方法
const getProgressColor = (progress: number) => {
  if (progress >= 80) return '#67C23A'
  if (progress >= 50) return '#E6A23C'
  return '#409EFF'
}

const getRecommendReason = (training: SpecialTraining) => {
  const relatedTopics = store.needsSpecialTrainingTopics.filter(t => t.subject === training.subject)
  return `该科目有 ${relatedTopics.length} 个知识点需要加强,建议进行专项训练`
}

const applyFilters = () => {
  // 筛选逻辑已在computed中实现
}

const startTraining = (training: SpecialTraining) => {
  if (training.videoUrl) {
    window.open(training.videoUrl, '_blank')
  }
  continueTraining(training)
}

const continueTraining = (training: SpecialTraining) => {
  currentTraining.value = training
  tempProgress.value = training.progress
  tempProblemsSolved.value = training.problemsSolved
  showProgressDialog.value = true
}

const viewTrainingDetail = (training: SpecialTraining) => {
  currentTraining.value = training
  tempProgress.value = training.progress
  tempProblemsSolved.value = training.problemsSolved
  showProgressDialog.value = true
}

const snoozeTraining = (training: SpecialTraining) => {
  ElMessage.info('已标记为稍后学习')
}

const submitNewTraining = async () => {
  // 解析资料链接
  if (materialLinksText.value) {
    newTraining.value.materialLinks = materialLinksText.value
      .split('\n')
      .filter(link => link.trim())
  }

  await store.addSpecialTraining(newTraining.value)
  
  ElMessage.success('专题添加成功!')
  showAddDialog.value = false
  
  // 重置表单
  newTraining.value = {
    name: '',
    subject: '高等数学',
    description: '',
    videoSource: '',
    estimatedTime: 5,
    videoUrl: '',
    materialLinks: []
  }
  materialLinksText.value = ''
}

const saveProgress = async () => {
  if (!currentTraining.value) return

  await store.updateSpecialTrainingProgress(
    currentTraining.value.id,
    tempProgress.value,
    tempProblemsSolved.value
  )

  ElMessage.success('进度已更新!')
  showProgressDialog.value = false
  currentTraining.value = null
}

onMounted(() => {
  console.log('专题突破中心已加载')
})
</script>

<style scoped>
.special-training-center {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
  background: linear-gradient(180deg, #f5f7fa 0%, #e8ecf1 100%);
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 0;
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(13, 33, 55, 0.3);
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.page-header h1 {
  font-size: 36px;
  color: #ffffff;
  margin-bottom: 12px;
  font-weight: 700;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}

.subtitle {
  color: rgba(255, 255, 255, 0.95);
  font-size: 16px;
  margin: 0;
  font-weight: 400;
  letter-spacing: 1px;
  position: relative;
  z-index: 1;
}

/* 智能推荐 */
.recommendations-section {
  margin-bottom: 40px;
}

.section-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
}

.section-header h2 {
  font-size: 24px;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.section-header p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.recommendations-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.recommendation-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.8);
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.recommendation-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(13, 33, 55, 0.2);
  border-color: #ffc53d;
}

.recommend-badge {
  position: absolute;
  top: -10px;
  right: 20px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
}

.card-content h3 {
  font-size: 20px;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  font-weight: 700;
}

.reason {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.training-info {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #999;
}

.actions {
  display: flex;
  gap: 12px;
}

/* 所有专题 */
.all-trainings-section {
  margin-top: 40px;
}

.trainings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.training-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.training-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ffc53d 0%, #f0a820 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.training-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(13, 33, 55, 0.2);
  border-color: #ffc53d;
}

.training-card:hover::before {
  opacity: 1;
}

.training-card.completed {
  opacity: 0.7;
  background: linear-gradient(135deg, #f0f9f0 0%, #e8f5e9 100%);
  border-color: #43e97b;
}

.training-card.in-progress {
  border-color: #ffc53d;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.subject-tag {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 8px;
  background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
  color: white;
  font-weight: 600;
}

.status-tag {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 600;
}

.status-tag.completed {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.status-tag.in-progress {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.card-body h3 {
  font-size: 18px;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  font-weight: 700;
}

.description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.meta-info {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #999;
}

.progress-section {
  margin-bottom: 16px;
}

.progress-label {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.next-review {
  font-size: 13px;
  color: #999;
  margin: 0;
  font-weight: 500;
}

.card-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 2px solid #f0f0f0;
}

.empty-state {
  padding: 60px 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .special-training-center {
    padding: 16px;
  }
  
  .page-header {
    padding: 24px 0;
    border-radius: 16px;
  }
  
  .page-header h1 {
    font-size: 28px;
  }
  
  .recommendations-list,
  .trainings-grid {
    grid-template-columns: 1fr;
  }
}
</style>
