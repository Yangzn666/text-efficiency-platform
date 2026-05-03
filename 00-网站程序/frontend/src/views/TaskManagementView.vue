<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Plus } from '@element-plus/icons-vue'
import TaskManager from '@/components/TaskManager.vue'
import { useTaskStore } from '@/stores/tasks'

const router = useRouter()
const taskStore = useTaskStore()

// 页面状态
const loading = ref(true)
const pageTitle = ref('学习计划与任务管理')

// 导航方法
const goBack = () => {
  router.go(-1)
}

const goToHome = () => {
  router.push('/')
}

// 页面初始化
onMounted(() => {
  try {
    taskStore.loadTasks()
    loading.value = false
  } catch (error) {
    ElMessage.error('页面加载失败，请刷新重试')
    loading.value = false
  }
})
</script>

<template>
  <div class="task-management-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <el-button 
            :icon="ArrowLeft" 
            @click="goBack"
            class="back-button"
            circle
          />
          <h1 class="page-title">{{ pageTitle }}</h1>
        </div>
        
        <div class="header-right">
          <el-button 
            type="primary" 
            :icon="Plus"
            @click="goToHome"
          >
            返回首页
          </el-button>
        </div>
      </div>
    </div>

    <!-- 页面主体 -->
    <div class="page-content">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>正在加载任务数据...</p>
        </div>
      </div>
      
      <div v-else class="task-manager-wrapper">
        <TaskManager />
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-management-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0px; /* 极致减少任务管理页面页边距至1/4 */
}

/* 页面头部 */
.page-header {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.back-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  transition: all 0.3s ease;
}

.back-button:hover {
  transform: translateX(-3px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.page-title {
  margin: 0;
  font-size: 1.8em;
  font-weight: 700;
  color: #2c3e50;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-right .el-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.header-right .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

/* 页面主体 */
.page-content {
  max-width: 1200px;
  margin: 0 auto;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loading-spinner {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  color: #666;
  font-size: 1.1em;
  margin: 0;
}

.task-manager-wrapper {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .task-management-page {
    padding: 15px;
  }
  
  .page-header {
    padding: 15px;
    margin-bottom: 20px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    gap: 15px;
  }
  
  .header-left {
    justify-content: center;
  }
  
  .page-title {
    font-size: 1.5em;
  }
  
  .task-manager-wrapper {
    padding: 20px 15px;
  }
}

@media (max-width: 480px) {
  .task-management-page {
    padding: 10px;
  }
  
  .page-header {
    padding: 12px;
  }
  
  .page-title {
    font-size: 1.3em;
  }
  
  .back-button {
    width: 36px;
    height: 36px;
  }
  
  .task-manager-wrapper {
    padding: 15px 12px;
  }
}

/* 平板优化 */
@media (min-width: 769px) and (max-width: 1024px) {
  .task-management-page {
    padding: 20px;
  }
  
  .page-header {
    padding: 20px;
  }
  
  .task-manager-wrapper {
    padding: 25px;
  }
}

/* 大屏幕优化 */
@media (min-width: 1200px) {
  .task-management-page {
    padding: 30px;
  }
  
  .page-header {
    padding: 25px;
    margin-bottom: 30px;
  }
  
  .page-title {
    font-size: 2em;
  }
  
  .task-manager-wrapper {
    padding: 30px;
  }
}
</style>