<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTestingStore } from '@/stores/testing'
import { ElMessage } from 'element-plus'

const testingStore = useTestingStore()

const activeTab = ref('testing')

// 计算属�?
const testSuites = computed(() => testingStore.testSuites)
const overallResults = computed(() => testingStore.overallTestResults)
const testDuration = computed(() => testingStore.testDuration)
const testStatus = computed(() => testingStore.testStatus)
const deploymentConfig = computed(() => testingStore.deploymentConfig)
const isTesting = computed(() => testingStore.isTesting)

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'pending': '#909399',
    'running': '#409EFF',
    'passed': '#67C23A',
    'failed': '#F56C6C'
  }
  return colors[status] || '#909399'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    'pending': '待执行',
    'running': '执行中',
    'passed': '通过',
    'failed': '失败'
  }
  return texts[status] || status
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    'functionality': '🔧',
    'performance': '📈',
    'compatibility': '🌐',
    'security': '🔒'
  }
  return icons[category] || '📋'
}

const runAllTests = async () => {
  try {
    await testingStore.runAllTests()
    ElMessage.success('所有测试执行完成！')
  } catch (error) {
    ElMessage.error('测试执行失败')
  }
}

const runTestSuite = async (suiteId: string) => {
  try {
    await testingStore.runTestSuite(suiteId)
    ElMessage.success('测试套件执行完成')
  } catch (error) {
    ElMessage.error('测试套件执行失败')
  }
}

const resetTests = () => {
  testingStore.resetTests()
  ElMessage.info('测试已重置')
}

const exportReport = () => {
  testingStore.exportTestReport()
  ElMessage.success('测试报告导出成功')
}

const updateConfig = () => {
  ElMessage.success('部署配置已更新')
}

onMounted(() => {
  // 组件挂载时的初始化逻辑
})
</script>

<template>
  <div class="system-testing-container">
    <div class="page-header">
      <h1 class="page-title">系统测试中心</h1>
      <p class="page-subtitle">全面的功能测试和性能验证</p>
    </div>

    <div class="testing-content">
      <!-- 测试概览面板 -->
      <div class="overview-panel">
        <el-card>
          <div class="overview-header">
            <div class="results-summary">
              <div class="result-item">
                <div class="result-value">{{ overallResults.passed }}</div>
                <div class="result-label">通过</div>
              </div>
              
              <div class="result-item">
                <div class="result-value">{{ overallResults.failed }}</div>
                <div class="result-label">失败</div>
              </div>
              
              <div class="result-item">
                <div class="result-value">{{ overallResults.total }}</div>
                <div class="result-label">总计</div>
              </div>
              
              <div class="result-item">
                <div class="result-value">{{ overallResults.percentage }}%</div>
                <div class="result-label">通过率</div>
              </div>
            </div>
            
            <div class="test-controls">
              <el-button 
                type="primary" 
                size="large"
                :loading="isTesting"
                @click="runAllTests"
              >
                <el-icon><VideoPlay v-if="!isTesting" /><Loading v-else /></el-icon>
                {{ isTesting ? '测试执行中...' : '运行所有测试' }}
              </el-button>
              
              <el-button @click="resetTests">
                <el-icon><RefreshLeft /></el-icon>
                重置测试
              </el-button>
              
              <el-button @click="exportReport">
                <el-icon><Document /></el-icon>
                导出报告
              </el-button>
            </div>
          </div>
          
          <div class="test-progress" v-if="isTesting">
            <el-progress 
              :percentage="overallResults.percentage" 
              :stroke-width="12"
              status="success"
            />
            <div class="progress-info">
              测试执行中... 已耗时: {{ (testDuration / 1000).toFixed(1) }}秒
            </div>
          </div>
        </el-card>
      </div>

      <!-- 主要测试区域 -->
      <el-tabs v-model="activeTab" class="testing-tabs">
        <el-tab-pane label="功能测试" name="testing">
          <div class="test-suites">
            <el-card 
              v-for="suite in testSuites" 
              :key="suite.id"
              class="suite-card"
            >
              <template #header>
                <div class="suite-header">
                  <div class="suite-info">
                    <h3>{{ suite.name }}</h3>
                    <p>{{ suite.description }}</p>
                  </div>
                  
                  <div class="suite-stats">
                    <el-tag type="success">{{ suite.passed }} 通过</el-tag>
                    <el-tag type="danger">{{ suite.failed }} 失败</el-tag>
                    <el-tag>{{ suite.total }} 总计</el-tag>
                    <span class="duration">{{ (suite.duration / 1000).toFixed(1) }}s</span>
                  </div>
                  
                  <el-button 
                    size="small" 
                    @click="runTestSuite(suite.id)"
                    :disabled="isTesting"
                  >
                    <el-icon><Refresh /></el-icon>
                    重新测试
                  </el-button>
                </div>
              </template>
              
              <div class="test-list">
                <div 
                  v-for="test in suite.tests" 
                  :key="test.id"
                  class="test-item"
                  :class="test.status"
                >
                  <div class="test-icon">
                    {{ getCategoryIcon(test.category) }}
                  </div>
                  
                  <div class="test-info">
                    <div class="test-name">{{ test.name }}</div>
                    <div class="test-status">
                      <el-tag 
                        :color="getStatusColor(test.status)" 
                        size="small"
                        style="color: white;"
                      >
                        {{ getStatusText(test.status) }}
                      </el-tag>
                      <span class="test-duration">{{ test.duration }}ms</span>
                    </div>
                  </div>
                  
                  <div class="test-error" v-if="test.error">
                    <el-alert 
                      :title="test.error" 
                      type="error" 
                      :closable="false"
                      show-icon
                    />
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="部署配置" name="deployment">
          <div class="deployment-config">
            <el-card>
              <template #header>
                <h3>部署环境配置</h3>
              </template>
              
              <el-form :model="deploymentConfig" label-width="120px">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="部署环境">
                      <el-select v-model="deploymentConfig.environment" style="width: 100%;">
                        <el-option label="开发环境" value="development" />
                        <el-option label="测试环境" value="staging" />
                        <el-option label="生产环境" value="production" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  
                  <el-col :span="12">
                    <el-form-item label="端口号">
                      <el-input-number 
                        v-model="deploymentConfig.port" 
                        :min="1000" 
                        :max="9999" 
                        style="width: 100%;"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="主机地址">
                      <el-input v-model="deploymentConfig.host" />
                    </el-form-item>
                  </el-col>
                  
                  <el-col :span="12">
                    <el-form-item label="SSL加密">
                      <el-switch v-model="deploymentConfig.ssl" />
                    </el-form-item>
                  </el-col>
                </el-row>
                
                <el-divider>数据库配置</el-divider>
                
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="数据库类型">
                      <el-select v-model="deploymentConfig.database.type" style="width: 100%;">
                        <el-option label="SQLite" value="sqlite" />
                        <el-option label="LowDB" value="lowdb" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  
                  <el-col :span="12">
                    <el-form-item label="数据库路径">
                      <el-input v-model="deploymentConfig.database.path" placeholder="请输入数据库文件路径"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                
                <el-divider>功能特性</el-divider>
                
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="数据分析">
                      <el-switch v-model="deploymentConfig.features.analytics" />
                    </el-form-item>
                  </el-col>
                  
                  <el-col :span="8">
                    <el-form-item label="通知系统">
                      <el-switch v-model="deploymentConfig.features.notifications" />
                    </el-form-item>
                  </el-col>
                  
                  <el-col :span="8">
                    <el-form-item label="离线模式">
                      <el-switch v-model="deploymentConfig.features.offlineMode" />
                    </el-form-item>
                  </el-col>
                </el-row>
                
                <div class="form-actions">
                  <el-button type="primary" @click="updateConfig">
                    <el-icon><Check /></el-icon>
                    保存配置
                  </el-button>
                  
                  <el-button>
                    <el-icon><RefreshLeft /></el-icon>
                    恢复默认
                  </el-button>
                </div>
              </el-form>
            </el-card>
            
            <div class="deployment-actions">
              <el-card>
                <template #header>
                  <h3>部署操作</h3>
                </template>
                
                <div class="action-buttons">
                  <el-button type="primary" size="large" disabled>
                    <el-icon><UploadFilled /></el-icon>
                    部署到服务器
                  </el-button>
                  
                  <el-button type="success" size="large" disabled>
                    <el-icon><DataLine /></el-icon>
                    启动本地服务
                  </el-button>
                  
                  <el-button type="warning" size="large" disabled>
                    <el-icon><Setting /></el-icon>
                    环境检测
                  </el-button>
                </div>
                
                <div class="deployment-info">
                  <el-alert
                    title="部署功能开发中"
                    type="info"
                    description="本地部署和服务发布功能正在开发中，敬请期待"
                    show-icon
                  />
                </div>
              </el-card>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="测试报告" name="reports">
          <div class="reports-section">
            <div class="report-header">
              <h3>历史测试报告</h3>
              <p>查看历次测试的详细结果和趋势分析</p>
            </div>
            
            <div class="report-list">
              <el-card class="report-item">
                <div class="report-content">
                  <div class="report-info">
                    <h4>最新测试报告</h4>
                    <p>2026-01-29 23:00</p>
                    <div class="report-stats">
                      <el-tag type="success">通过率 92%</el-tag>
                      <el-tag>总用时 45.2s</el-tag>
                    </div>
                  </div>
                  
                  <div class="report-actions">
                    <el-button type="primary" size="small">
                      <el-icon><View /></el-icon>
                      查看详情
                    </el-button>
                    <el-button size="small">
                      <el-icon><Download /></el-icon>
                      下载报告
                    </el-button>
                  </div>
                </div>
              </el-card>
              
              <div class="no-reports" v-if="false">
                <el-icon size="60" color="#909399"><Document /></el-icon>
                <p>暂无测试报告</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.system-testing-container {
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

.testing-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
}

.overview-panel {
  margin-bottom: 30px;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.results-summary {
  display: flex;
  gap: 30px;
}

.result-item {
  text-align: center;
}

.result-value {
  font-size: 2em;
  font-weight: 700;
  color: #333333;
}

.result-label {
  color: #666666;
  font-size: 1em;
}

.test-controls {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.test-progress {
  margin-top: 20px;
}

.progress-info {
  text-align: center;
  color: #666666;
  margin-top: 10px;
  font-size: 0.9em;
}

.testing-tabs :deep(.el-tabs__header) {
  margin-bottom: 30px;
}

.testing-tabs :deep(.el-tabs__nav-wrap)::after {
  display: none;
}

.testing-tabs :deep(.el-tabs__item) {
  font-size: 1.2em;
  font-weight: 500;
  padding: 0 30px;
  height: 60px;
  line-height: 60px;
  color: #666666;
}

.testing-tabs :deep(.el-tabs__item.is-active) {
  color: #409EFF;
  font-weight: 600;
}

.test-suites {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.suite-card {
  transition: all 0.3s ease;
}

.suite-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.suite-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.suite-info h3 {
  color: #333333;
  margin: 0 0 10px 0;
  font-size: 1.3em;
}

.suite-info p {
  color: #666666;
  margin: 0;
}

.suite-stats {
  display: flex;
  align-items: center;
  gap: 15px;
}

.duration {
  color: #999999;
  font-size: 0.9em;
}

.test-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.test-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.test-item:hover {
  background: #f0f0f0;
}

.test-item.running {
  border-left: 4px solid #409EFF;
  background: #f0f8ff;
}

.test-item.passed {
  border-left: 4px solid #67C23A;
  background: #f8fff8;
}

.test-item.failed {
  border-left: 4px solid #F56C6C;
  background: #fff8f8;
}

.test-icon {
  font-size: 1.5em;
  min-width: 40px;
  text-align: center;
}

.test-info {
  flex: 1;
}

.test-name {
  color: #333333;
  font-weight: 500;
  margin-bottom: 10px;
}

.test-status {
  display: flex;
  align-items: center;
  gap: 15px;
}

.test-duration {
  color: #999999;
  font-size: 0.9em;
}

.test-error {
  margin-top: 15px;
  width: 100%;
}

.deployment-config {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eeeeee;
}

.deployment-actions {
  margin-top: 30px;
}

.action-buttons {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.deployment-info {
  margin-top: 20px;
}

.reports-section {
  padding: 20px 0;
}

.report-header {
  text-align: center;
  margin-bottom: 40px;
}

.report-header h3 {
  color: #333333;
  font-size: 1.8em;
  margin-bottom: 15px;
}

.report-header p {
  color: #666666;
  font-size: 1.2em;
}

.report-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.report-item {
  transition: all 0.3s ease;
}

.report-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.report-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.report-info h4 {
  color: #333333;
  margin: 0 0 10px 0;
  font-size: 1.3em;
}

.report-info p {
  color: #666666;
  margin: 0 0 15px 0;
}

.report-stats {
  display: flex;
  gap: 15px;
}

.report-actions {
  display: flex;
  gap: 15px;
}

.no-reports {
  text-align: center;
  padding: 60px 20px;
  color: #999999;
}

.no-reports p {
  margin-top: 20px;
  font-size: 1.2em;
}

/* 响应式设计*/
@media (max-width: 768px) {
  .system-testing-container {
    padding: 20px 15px;
  }
  
  .page-title {
    font-size: 2.2em;
  }
  
  .page-subtitle {
    font-size: 1.1em;
  }
  
  .testing-content {
    padding: 20px;
  }
  
  .overview-header {
    flex-direction: column;
    gap: 25px;
  }
  
  .results-summary {
    justify-content: center;
    gap: 20px;
  }
  
  .test-controls {
    justify-content: center;
    width: 100%;
  }
  
  .suite-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .suite-stats {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .test-item {
    flex-direction: column;
    gap: 15px;
  }
  
  .test-status {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .report-content {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .report-stats, .report-actions {
    justify-content: center;
  }
}
</style>
