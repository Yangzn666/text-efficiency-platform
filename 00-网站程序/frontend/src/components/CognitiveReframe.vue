<template>
  <div class="cognitive-reframe">
    <!-- 认知重构记录列表 -->
    <div class="records-section">
      <div class="section-header">
        <h3>📝 认知重构练习记录</h3>
        <el-button type="primary" @click="showAddDialog = true">
          <el-icon><Plus /></el-icon>
          添加练习
        </el-button>
      </div>
      
      <div class="records-list">
        <div 
          v-if="psychologyStore.todayRecords.length === 0"
          class="empty-state"
        >
          <el-icon size="60" color="#999"><Document /></el-icon>
          <h4>暂无今日记录</h4>
          <p>开始你的第一次认知重构练习吧</p>
        </div>
        
        <div 
          v-else
          class="records-grid"
        >
          <div 
            v-for="record in psychologyStore.todayRecords" 
            :key="record.id"
            class="record-card"
          >
            <div class="record-header">
              <div class="mood-indicators">
                <span class="mood-before">
                  {{ psychologyStore.getMoodEmoji(record.moodBefore) }}
                  {{ record.moodBefore }}/10
                </span>
                <el-icon><ArrowRight /></el-icon>
                <span class="mood-after">
                  {{ psychologyStore.getMoodEmoji(record.moodAfter) }}
                  {{ record.moodAfter }}/10
                </span>
              </div>
              <div class="record-date">
                {{ formatDate(record.createdAt) }}
              </div>
            </div>
            
            <div class="record-content">
              <div class="thought-section">
                <h4>负面想法</h4>
                <p>{{ record.negativeThought }}</p>
              </div>
              
              <div class="distortion-section">
                <h4>认知扭曲</h4>
                <el-tag type="warning">{{ record.cognitiveDistortion }}</el-tag>
              </div>
              
              <div class="response-section">
                <h4>理性回应</h4>
                <p>{{ record.rationalResponse }}</p>
              </div>
            </div>
            
            <div class="record-actions">
              <el-button size="small" @click="editRecord(record)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button 
                size="small" 
                type="danger" 
                @click="deleteRecord(record.id)"
              >
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingRecord ? '编辑认知重构记录' : '添加认知重构记录'"
      width="600px"
      @close="resetForm"
    >
      <el-form
        ref="recordFormRef"
        :model="recordForm"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="负面想法" prop="negativeThought">
          <el-input
            v-model="recordForm.negativeThought"
            type="textarea"
            :rows="3"
            placeholder="描述引发负面情绪的想法"
          />
        </el-form-item>
        
        <el-form-item label="认知扭曲" prop="cognitiveDistortion">
          <el-select 
            v-model="recordForm.cognitiveDistortion" 
            placeholder="选择认知扭曲类型"
            style="width: 100%"
          >
            <el-option
              v-for="distortion in psychologyStore.getCognitiveDistortions()"
              :key="distortion"
              :label="distortion"
              :value="distortion"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="理性回应" prop="rationalResponse">
          <el-input
            v-model="recordForm.rationalResponse"
            type="textarea"
            :rows="3"
            placeholder="写下理性的反驳和积极的想法"
          />
        </el-form-item>
        
        <div class="mood-section">
          <el-form-item label="之前情绪" prop="moodBefore">
            <div class="mood-slider">
              <el-slider
                v-model="recordForm.moodBefore"
                :min="1"
                :max="10"
                show-input
                show-stops
              />
              <span class="mood-emoji">
                {{ psychologyStore.getMoodEmoji(recordForm.moodBefore) }}
              </span>
            </div>
          </el-form-item>
          
          <el-form-item label="之后情绪" prop="moodAfter">
            <div class="mood-slider">
              <el-slider
                v-model="recordForm.moodAfter"
                :min="1"
                :max="10"
                show-input
                show-stops
              />
              <span class="mood-emoji">
                {{ psychologyStore.getMoodEmoji(recordForm.moodAfter) }}
              </span>
            </div>
          </el-form-item>
        </div>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="submitForm"
            :loading="submitLoading"
          >
            {{ editingRecord ? '更新' : '添加' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 认知扭曲说明 -->
    <div class="distortions-guide">
      <h3>🔍 常见认知扭曲类型</h3>
      <div class="distortions-grid">
        <div class="distortion-item">
          <h4>全或无思维</h4>
          <p>认为事物只有黑白两种极端，没有中间地带</p>
        </div>
        <div class="distortion-item">
          <h4>过度概括</h4>
          <p>基于单一事件得出普遍性结论</p>
        </div>
        <div class="distortion-item">
          <h4>心理过滤</h4>
          <p>只关注负面信息，忽略正面信息</p>
        </div>
        <div class="distortion-item">
          <h4>贬低积极面</h4>
          <p>拒绝承认积极的经历或成就</p>
        </div>
        <div class="distortion-item">
          <h4>妄下结论</h4>
          <p>在没有证据的情况下做出负面假设</p>
        </div>
        <div class="distortion-item">
          <h4>放大缩小</h4>
          <p>夸大问题的重要性或缩小自己的能力</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { usePsychologyStore } from '@/stores/psychology'
import type { CognitiveRecord } from '@/stores/psychology'
import type { FormInstance, FormRules } from 'element-plus'

const psychologyStore = usePsychologyStore()

// 表单相关
const showAddDialog = ref(false)
const editingRecord = ref<CognitiveRecord | null>(null)
const submitLoading = ref(false)
const recordFormRef = ref<FormInstance>()

const recordForm = reactive({
  negativeThought: '',
  cognitiveDistortion: '',
  rationalResponse: '',
  moodBefore: 5,
  moodAfter: 5,
  date: new Date().toISOString().split('T')[0]
})

const formRules = reactive<FormRules>({
  negativeThought: [
    { required: true, message: '请输入负面想法', trigger: 'blur' }
  ],
  cognitiveDistortion: [
    { required: true, message: '请选择认知扭曲类型', trigger: 'change' }
  ],
  rationalResponse: [
    { required: true, message: '请输入理性回应', trigger: 'blur' }
  ],
  moodBefore: [
    { required: true, message: '请选择之前的情绪状态', trigger: 'change' }
  ],
  moodAfter: [
    { required: true, message: '请选择之后的情绪状态', trigger: 'change' }
  ]
})

// 方法
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const editRecord = (record: CognitiveRecord) => {
  editingRecord.value = record
  recordForm.negativeThought = record.negativeThought
  recordForm.cognitiveDistortion = record.cognitiveDistortion
  recordForm.rationalResponse = record.rationalResponse
  recordForm.moodBefore = record.moodBefore
  recordForm.moodAfter = record.moodAfter
  recordForm.date = record.date
  showAddDialog.value = true
}

const deleteRecord = async (id: string) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这条认知重构记录吗？',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    psychologyStore.deleteCognitiveRecord(id)
    ElMessage.success('记录删除成功')
  } catch {
    // 用户取消删除
  }
}

const submitForm = async () => {
  if (!recordFormRef.value) return
  
  try {
    await recordFormRef.value.validate()
    submitLoading.value = true
    
    const formData = {
      negativeThought: recordForm.negativeThought,
      cognitiveDistortion: recordForm.cognitiveDistortion,
      rationalResponse: recordForm.rationalResponse,
      moodBefore: recordForm.moodBefore,
      moodAfter: recordForm.moodAfter,
      date: recordForm.date
    }
    
    if (editingRecord.value) {
      psychologyStore.updateCognitiveRecord(editingRecord.value.id, formData)
      ElMessage.success('记录更新成功')
    } else {
      psychologyStore.addCognitiveRecord(formData)
      ElMessage.success('记录添加成功')
      // 根据情绪改善给予积分奖励
      const improvement = recordForm.moodAfter - recordForm.moodBefore
      if (improvement > 0) {
        ElMessage.success(`情绪改善了${improvement}分，获得${improvement * 10}积分奖励！`)
      }
    }
    
    showAddDialog.value = false
    resetForm()
  } catch (error) {
    console.error('表单提交失败:', error)
  } finally {
    submitLoading.value = false
  }
}

const resetForm = () => {
  recordFormRef.value?.resetFields()
  editingRecord.value = null
  Object.assign(recordForm, {
    negativeThought: '',
    cognitiveDistortion: '',
    rationalResponse: '',
    moodBefore: 5,
    moodAfter: 5,
    date: new Date().toISOString().split('T')[0]
  })
}

onMounted(() => {
  psychologyStore.loadData()
})
</script>

<style scoped>
.cognitive-reframe {
  padding: 20px 0;
}

.records-section {
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

.records-list {
  min-height: 200px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state h4 {
  margin: 20px 0 10px 0;
  color: #666;
}

.records-grid {
  display: grid;
  gap: 20px;
}

.record-card {
  background: #fafafa;
  border-radius: 15px;
  padding: 25px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.record-card:hover {
  background: #f0f8ff;
  border-color: #667eea;
  transform: translateX(5px);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.mood-indicators {
  display: flex;
  align-items: center;
  gap: 15px;
  font-weight: 600;
}

.mood-before {
  color: #f44336;
}

.mood-after {
  color: #4CAF50;
}

.record-date {
  color: #999;
  font-size: 0.9em;
}

.record-content {
  margin-bottom: 20px;
}

.thought-section,
.distortion-section,
.response-section {
  margin-bottom: 20px;
}

.thought-section h4,
.distortion-section h4,
.response-section h4 {
  color: #333;
  margin: 0 0 10px 0;
  font-size: 1.1em;
}

.thought-section p,
.response-section p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.record-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.mood-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.mood-slider {
  display: flex;
  align-items: center;
  gap: 15px;
}

.mood-emoji {
  font-size: 1.5em;
  min-width: 30px;
  text-align: center;
}

.distortions-guide {
  background: #f8f9ff;
  border-radius: 15px;
  padding: 25px;
  border: 1px solid #e0e7ff;
}

.distortions-guide h3 {
  color: #333;
  margin: 0 0 20px 0;
  font-size: 1.4em;
}

.distortions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.distortion-item {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.distortion-item h4 {
  color: #667eea;
  margin: 0 0 10px 0;
  font-size: 1.1em;
}

.distortion-item p {
  color: #666;
  margin: 0;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .record-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .mood-indicators {
    width: 100%;
    justify-content: space-between;
  }
  
  .record-actions {
    justify-content: center;
  }
  
  .distortions-grid {
    grid-template-columns: 1fr;
  }
  
  .mood-slider {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>