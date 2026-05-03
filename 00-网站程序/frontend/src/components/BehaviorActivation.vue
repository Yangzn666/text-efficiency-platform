<template>
  <div class="behavior-activation">
    <!-- 行为激活活动列表 -->
    <div class="activities-section">
      <div class="section-header">
        <h3>🏃‍♂️ 行为激活活动</h3>
        <el-button type="primary" @click="showAddDialog = true">
          <el-icon><Plus /></el-icon>
          添加活动
        </el-button>
      </div>
      
      <div class="activities-grid">
        <div 
          v-for="activity in activities" 
          :key="activity.id"
          class="activity-card"
          :class="{ 'completed': activity.completed }"
        >
          <div class="activity-header">
            <div class="activity-icon">{{ activity.icon }}</div>
            <div class="activity-info">
              <h4>{{ activity.title }}</h4>
              <p>{{ activity.description }}</p>
              <div class="activity-meta">
                <el-tag :type="getActivityType(activity.category)">
                  {{ activity.category }}
                </el-tag>
                <span class="duration">{{ activity.duration }}分钟</span>
                <span class="points">+{{ activity.points }}积分</span>
              </div>
            </div>
          </div>
          
          <div class="activity-actions">
            <el-checkbox 
              v-model="activity.completed"
              @change="toggleActivity(activity)"
              size="large"
            >
              {{ activity.completed ? '已完成' : '标记完成' }}
            </el-checkbox>
            
            <el-button 
              size="small" 
              type="danger"
              @click="deleteActivity(activity.id)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 每日活动统计 -->
    <div class="stats-section">
      <h3>📊 今日活动统计</h3>
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <div class="stat-number">{{ completedActivities.length }}</div>
            <div class="stat-label">已完成活动</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⏱️</div>
          <div class="stat-info">
            <div class="stat-number">{{ totalDuration }}分钟</div>
            <div class="stat-label">总时长</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-info">
            <div class="stat-number">{{ earnedPoints }}</div>
            <div class="stat-label">获得积分</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加活动对话框 -->
    <el-dialog
      v-model="showAddDialog"
      title="添加行为激活活动"
      width="500px"
      @close="resetForm"
    >
      <el-form
        ref="activityFormRef"
        :model="activityForm"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="活动名称" prop="title">
          <el-input
            v-model="activityForm.title"
            placeholder="请输入活动名称"
          />
        </el-form-item>
        
        <el-form-item label="活动描述" prop="description">
          <el-input
            v-model="activityForm.description"
            type="textarea"
            :rows="2"
            placeholder="简要描述活动内容"
          />
        </el-form-item>
        
        <el-form-item label="活动类别" prop="category">
          <el-select v-model="activityForm.category" placeholder="选择活动类别">
            <el-option label="学习" value="学习" />
            <el-option label="运动" value="运动" />
            <el-option label="社交" value="社交" />
            <el-option label="兴趣" value="兴趣" />
            <el-option label="放松" value="放松" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="预计时长" prop="duration">
          <el-input-number
            v-model="activityForm.duration"
            :min="5"
            :max="240"
            :step="5"
            controls-position="right"
          />
          <span style="margin-left: 10px">分钟</span>
        </el-form-item>
        
        <el-form-item label="积分奖励" prop="points">
          <el-slider
            v-model="activityForm.points"
            :min="10"
            :max="100"
            :step="10"
            show-input
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="submitForm"
            :loading="submitLoading"
          >
            添加活动
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { usePsychologyStore } from '@/stores/psychology'
import type { FormInstance, FormRules } from 'element-plus'

interface Activity {
  id: string
  title: string
  description: string
  category: string
  duration: number
  points: number
  completed: boolean
  icon: string
  createdAt: string
}

const psychologyStore = usePsychologyStore()

// 状态
const activities = ref<Activity[]>([])
const showAddDialog = ref(false)
const submitLoading = ref(false)
const activityFormRef = ref<FormInstance>()

// 表单数据
const activityForm = reactive({
  title: '',
  description: '',
  category: '学习',
  duration: 30,
  points: 30
})

const formRules = reactive<FormRules>({
  title: [
    { required: true, message: '请输入活动名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入活动描述', trigger: 'blur' },
    { max: 200, message: '描述不能超过 200 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择活动类别', trigger: 'change' }
  ],
  duration: [
    { required: true, message: '请输入预计时长', trigger: 'change' }
  ],
  points: [
    { required: true, message: '请选择积分奖励', trigger: 'change' }
  ]
})

// 计算属性
const completedActivities = computed(() => {
  return activities.value.filter(activity => activity.completed)
})

const totalDuration = computed(() => {
  return completedActivities.value.reduce((sum, activity) => sum + activity.duration, 0)
})

const earnedPoints = computed(() => {
  return completedActivities.value.reduce((sum, activity) => sum + activity.points, 0)
})

// 方法
const getActivityType = (category: string) => {
  const typeMap: Record<string, string> = {
    '学习': 'primary',
    '运动': 'success',
    '社交': 'warning',
    '兴趣': 'info',
    '放松': '',
    '其他': ''
  }
  return typeMap[category] || ''
}

const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, string> = {
    '学习': '📚',
    '运动': '🏃‍♂️',
    '社交': '👥',
    '兴趣': '🎨',
    '放松': '🧘‍♀️',
    '其他': '⭐'
  }
  return iconMap[category] || '⭐'
}

const toggleActivity = (activity: Activity) => {
  if (activity.completed) {
    psychologyStore.addPoints(activity.points, `完成${activity.title}`)
    ElMessage.success(`完成"${activity.title}"，获得${activity.points}积分！`)
  }
}

const deleteActivity = async (id: string) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个活动吗？',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    const index = activities.value.findIndex(a => a.id === id)
    if (index !== -1) {
      activities.value.splice(index, 1)
      saveActivities()
      ElMessage.success('活动删除成功')
    }
  } catch {
    // 用户取消删除
  }
}

const submitForm = async () => {
  if (!activityFormRef.value) return
  
  try {
    await activityFormRef.value.validate()
    submitLoading.value = true
    
    const newActivity: Activity = {
      id: Date.now().toString(),
      title: activityForm.title,
      description: activityForm.description,
      category: activityForm.category,
      duration: activityForm.duration,
      points: activityForm.points,
      completed: false,
      icon: getCategoryIcon(activityForm.category),
      createdAt: new Date().toISOString()
    }
    
    activities.value.push(newActivity)
    saveActivities()
    ElMessage.success('活动添加成功')
    
    showAddDialog.value = false
    resetForm()
  } catch (error) {
    console.error('表单提交失败:', error)
  } finally {
    submitLoading.value = false
  }
}

const resetForm = () => {
  activityFormRef.value?.resetFields()
  Object.assign(activityForm, {
    title: '',
    description: '',
    category: '学习',
    duration: 30,
    points: 30
  })
}

// 数据持久化
const saveActivities = () => {
  localStorage.setItem('behaviorActivities', JSON.stringify(activities.value))
}

const loadActivities = () => {
  const saved = localStorage.getItem('behaviorActivities')
  if (saved) {
    try {
      activities.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to load activities:', e)
    }
  }
}

// 初始化
onMounted(() => {
  loadActivities()
  
  // 如果没有活动，添加一些示例活动
  if (activities.value.length === 0) {
    const sampleActivities: Activity[] = [
      {
        id: 'sample_1',
        title: '晨间冥想',
        description: '进行10分钟的正念冥想，开启美好的一天',
        category: '放松',
        duration: 10,
        points: 20,
        completed: false,
        icon: '🧘‍♀️',
        createdAt: new Date().toISOString()
      },
      {
        id: 'sample_2',
        title: '复习数学知识点',
        description: '系统复习线性代数核心概念',
        category: '学习',
        duration: 60,
        points: 60,
        completed: false,
        icon: '📚',
        createdAt: new Date().toISOString()
      },
      {
        id: 'sample_3',
        title: '户外散步',
        description: '到公园进行30分钟的轻松散步',
        category: '运动',
        duration: 30,
        points: 30,
        completed: false,
        icon: '🏃‍♂️',
        createdAt: new Date().toISOString()
      }
    ]
    activities.value = sampleActivities
    saveActivities()
  }
})
</script>

<style scoped>
.behavior-activation {
  padding: 20px 0;
}

.activities-section {
  margin-bottom: 40px;
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
  margin: 0;
  color: #333;
  font-size: 1.5em;
}

.activities-grid {
  display: grid;
  gap: 20px;
}

.activity-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px;
  background: #fafafa;
  border-radius: 15px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.activity-card:hover {
  background: #f0f8ff;
  border-color: #667eea;
  transform: translateX(5px);
}

.activity-card.completed {
  background: #f5fff5;
  border-color: #4CAF50;
  opacity: 0.8;
}

.activity-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  flex: 1;
}

.activity-icon {
  font-size: 2.5em;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.activity-info h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.2em;
}

.activity-info p {
  margin: 0 0 15px 0;
  color: #666;
  line-height: 1.5;
}

.activity-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.duration,
.points {
  color: #666;
  font-size: 0.9em;
}

.points {
  color: #FF9800;
  font-weight: 600;
}

.activity-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stats-section {
  background: #f8f9ff;
  border-radius: 15px;
  padding: 25px;
  border: 1px solid #e0e7ff;
}

.stats-section h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.4em;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  font-size: 2em;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 1.8em;
  font-weight: 800;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 0.9em;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .activity-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  
  .activity-header {
    width: 100%;
  }
  
  .activity-actions {
    align-self: flex-end;
    width: 100%;
    justify-content: space-between;
  }
  
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .activity-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>