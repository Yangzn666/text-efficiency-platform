<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAnalyticsStore } from '@/stores/analytics'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const analyticsStore = useAnalyticsStore()
const userStore = useUserStore()

const reportType = ref('weekly')
const selectedPeriod = ref('')
const isGenerating = ref(false)

// 计算属�?
const weeklyReports = computed(() => analyticsStore.weeklyReports)
const availablePeriods = computed(() => {
  if (reportType.value === 'weekly') {
    return weeklyReports.value.map(report => ({
      value: report.week,
      label: `�?{report.week}�?(${new Date(report.week).toLocaleDateString()})`
    }))
  }
  return []
})

const generateReport = async () => {
  if (!selectedPeriod.value) {
    ElMessage.warning('请选择报告周期')
    return
  }

  isGenerating.value = true
  try {
    // 模拟报告生成过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    let reportData
    if (reportType.value === 'weekly') {
      reportData = weeklyReports.value.find(r => r.week === selectedPeriod.value)
    }
    
    if (reportData) {
      downloadReport(reportData)
      ElMessage.success('报告生成成功�?)
    } else {
      ElMessage.error('未找到对应的报告数据')
    }
  } catch (error) {
    ElMessage.error('报告生成失败')
  } finally {
    isGenerating.value = false
  }
}

const downloadReport = (data: any) => {
  const reportContent = generateReportContent(data)
  const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `学习报告_${data.week || new Date().toISOString().split('T')[0]}.txt`
  a.click()
  
  URL.revokeObjectURL(url)
}

const generateReportContent = (data: any) => {
  const userName = userStore.userInfo?.name || '同学'
  const now = new Date().toLocaleDateString()
  
  let content = `=== 考研学习报告 ===\n`
  content += `生成时间: ${now}\n`
  content += `学员姓名: ${userName}\n\n`
  
  if (data.week) {
    content += `报告周期: ${data.week}周\n`
    content += `=====================\n\n`
    
    content += `📊 学习概况\n`
    content += `----------\n`
    content += `总学习时�? ${Math.floor(data.totalTime / 60)}小时${data.totalTime % 60}分钟\n`
    content += `学习会话�? ${data.sessions}次\n`
    content += `平均学习效率: ${data.productivity}/10\n`
    content += `目标完成�? ${data.goalsAchieved}%\n`
    content += `连续学习天数: ${data.streak}天\n\n`
    
    content += `📚 科目学习时间分布\n`
    content += `--------------------\n`
    Object.entries(data.subjects).forEach(([subject, time]: [string, any]) => {
      const hours = Math.floor(time / 60)
      const minutes = time % 60
      content += `${subject}: ${hours}小时${minutes}分钟\n`
    })
    content += `\n`
    
    content += `🎯 学习建议\n`
    content += `----------\n`
    if (data.productivity >= 8) {
      content += `�?学习效率很高，继续保持！\n`
    } else if (data.productivity >= 6) {
      content += `�?学习效率良好，可以适当增加学习强度\n`
    } else {
      content += `�?学习效率有待提升，建议调整学习方法\n`
    }
    
    if (data.goalsAchieved >= 100) {
      content += `�?圆满完成本周学习目标，表现优秀！\n`
    } else if (data.goalsAchieved >= 80) {
      content += `�?基本完成学习目标，继续努力\n`
    } else {
      content += `�?未达到预期目标，需要加强时间管理\n`
    }
    
    content += `\n`
    content += `💡 改进建议\n`
    content += `----------\n`
    content += `1. 保持规律的学习作息\n`
    content += `2. 合理安排各科目学习时间\n`
    content += `3. 适时休息，避免疲劳学习\n`
    content += `4. 定期回顾和总结学习内容\n`
  }
  
  return content
}

const exportAllData = () => {
  analyticsStore.exportData()
  ElMessage.success('全部数据导出成功�?)
}

onMounted(() => {
  analyticsStore.initializeAnalyticsData()
  
  // 默认选择最新的周期
  if (availablePeriods.value.length > 0) {
    selectedPeriod.value = availablePeriods.value[availablePeriods.value.length - 1].value
  }
})
</script>

<template>
  <div class="report-generator-container">
    <div class="page-header">
      <h1 class="page-title">个人学习报告</h1>
      <p class="page-subtitle">生成详细的学习分析报�?/p>
    </div>

    <div class="generator-content">
      <el-card>
        <template #header>
          <div class="card-header">
            <h2>报告生成�?/h2>
          </div>
        </template>
        
        <div class="generator-form">
          <div class="form-row">
            <div class="form-item">
              <label>报告类型</label>
              <el-select v-model="reportType" style="width: 200px;">
                <el-option label="周报" value="weekly" />
                <el-option label="月报" value="monthly" disabled />
                <el-option label="季报" value="quarterly" disabled />
              </el-select>
            </div>
            
            <div class="form-item">
              <label>选择周期</label>
              <el-select 
                v-model="selectedPeriod" 
                placeholder="请选择报告周期"
                style="width: 300px;"
              >
                <el-option 
                  v-for="period in availablePeriods" 
                  :key="period.value"
                  :label="period.label"
                  :value="period.value"
                />
              </el-select>
            </div>
          </div>
          
          <div class="action-buttons">
            <el-button 
              type="primary" 
              size="large"
              :loading="isGenerating"
              @click="generateReport"
            >
              <el-icon><Document /></el-icon>
              {{ isGenerating ? '生成�?..' : '生成报告' }}
            </el-button>
            
            <el-button 
              size="large"
              @click="exportAllData"
            >
              <el-icon><Download /></el-icon>
              导出全部数据
            </el-button>
          </div>
        </div>
      </el-card>

      <!-- 报告预览 -->
      <div class="preview-section">
        <el-card>
          <template #header>
            <h3>报告预览</h3>
          </template>
          
          <div class="preview-content">
            <div class="preview-placeholder" v-if="!selectedPeriod">
              <el-icon size="60" color="#999999"><Document /></el-icon>
              <p>请选择报告周期以预览内�?/p>
            </div>
            
            <div class="preview-text" v-else>
              <pre>{{ generatePreview() }}</pre>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 历史报告 -->
      <div class="history-section">
        <el-card>
          <template #header>
            <h3>历史报告</h3>
          </template>
          
          <div class="history-list">
            <div 
              v-for="report in weeklyReports.slice(-5)" 
              :key="report.week"
              class="history-item"
            >
              <div class="report-info">
                <span class="report-period">第{{ report.week }}�?/span>
                <span class="report-date">{{ new Date(report.week).toLocaleDateString() }}</span>
              </div>
              <div class="report-stats">
                <span>学习{{ Math.floor(report.totalTime / 60) }}小时</span>
                <span>效率{{ report.productivity }}/10</span>
              </div>
              <el-button 
                size="small" 
                type="primary"
                @click="selectedPeriod = report.week"
              >
                查看详情
              </el-button>
            </div>
            
            <div v-if="weeklyReports.length === 0" class="no-history">
              <el-icon size="40" color="#999999"><DocumentCopy /></el-icon>
              <p>暂无历史报告</p>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.report-generator-container {
  max-width: 1200px;
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

.generator-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
}

.card-header h2 {
  color: #333333;
  margin: 0;
  font-size: 1.8em;
  text-align: center;
}

.generator-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-row {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  justify-content: center;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-item label {
  font-weight: 500;
  color: #333333;
  font-size: 1.1em;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

.preview-section, .history-section {
  margin-top: 40px;
}

.preview-section h3, .history-section h3 {
  color: #333333;
  margin: 0 0 20px 0;
  font-size: 1.4em;
  text-align: center;
}

.preview-placeholder {
  text-align: center;
  padding: 60px 20px;
  color: #999999;
}

.preview-placeholder p {
  margin-top: 20px;
  font-size: 1.2em;
}

.preview-text {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 12px;
  font-family: 'Courier New', monospace;
  line-height: 1.6;
  max-height: 400px;
  overflow-y: auto;
}

.preview-text pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: #333333;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.history-item:hover {
  background: #eef3fa;
  transform: translateX(5px);
}

.report-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.report-period {
  font-weight: 600;
  color: #333333;
  font-size: 1.1em;
}

.report-date {
  color: #666666;
  font-size: 0.9em;
}

.report-stats {
  display: flex;
  gap: 20px;
  color: #666666;
}

.no-history {
  text-align: center;
  padding: 40px 20px;
  color: #999999;
}

.no-history p {
  margin-top: 20px;
  font-size: 1.1em;
}

/* 响应式设�?*/
@media (max-width: 768px) {
  .report-generator-container {
    padding: 20px 15px;
  }
  
  .page-title {
    font-size: 2.2em;
  }
  
  .page-subtitle {
    font-size: 1.1em;
  }
  
  .generator-content {
    padding: 20px;
  }
  
  .form-row {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  
  .form-item {
    width: 100%;
    max-width: 300px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  
  .action-buttons .el-button {
    width: 200px;
  }
  
  .history-item {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .report-stats {
    justify-content: center;
  }
}
</style>
