<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
// 使用动态导入解决TypeScript默认导出识别问题
const SystemTesting = defineAsyncComponent(() => import('@/components/SystemTesting.vue'))
const DeploymentAssistant = defineAsyncComponent(() => import('@/components/PlaceholderComponent.vue'))

const activeTab = ref('testing')
</script>

<template>
  <div class="system-test-deployment-container">
    <div class="page-header">
      <h1 class="page-title">系统测试与部署</h1>
      <p class="page-subtitle">全面测试验证和一键部署上线</p>
    </div>

    <div class="tab-navigation">
      <el-tabs v-model="activeTab" class="test-deploy-tabs">
        <el-tab-pane label="系统测试" name="testing">
          <SystemTesting />
        </el-tab-pane>
        
        <el-tab-pane label="部署助手" name="deployment">
          <DeploymentAssistant />
        </el-tab-pane>
        
        <el-tab-pane label="使用指南" name="guide">
          <div class="guide-content">
            <div class="guide-illustration">
              <el-icon size="80" color="#409EFF"><Reading /></el-icon>
            </div>
            <h3>📚 使用指南与最佳实践</h3>
            <p>详细的系统使用说明和操作指导</p>
            
            <div class="guide-sections">
              <div class="guide-category">
                <h4>🚀 快速开始</h4>
                <ol class="guide-steps">
                  <li>运行系统测试确保功能正常</li>
                  <li>配置部署参数和环境</li>
                  <li>使用部署助手一键完成部署</li>
                  <li>访问部署地址开始使用</li>
                </ol>
              </div>
              
              <div class="guide-category">
                <h4>🧪 测试说明</h4>
                <ul class="guide-list">
                  <li><strong>功能测试</strong>: 验证核心功能模块是否正常工作</li>
                  <li><strong>性能测试</strong>: 检查系统响应速度和资源使用</li>
                  <li><strong>兼容性测试</strong>: 确保在不同环境下正常运行</li>
                  <li><strong>安全测试</strong>: 验证数据安全和访问控制</li>
                </ul>
              </div>
              
              <div class="guide-category">
                <h4>⚙️ 部署配置</h4>
                <div class="config-options">
                  <div class="config-item">
                    <h5>本地部署</h5>
                    <p>适用于个人学习和开发测试</p>
                    <ul>
                      <li>端口: 3000</li>
                      <li>数据: LowDB本地文件</li>
                      <li>特点: 无需服务器，完全离线</li>
                    </ul>
                  </div>
                  
                  <div class="config-item">
                    <h5>服务器部署</h5>
                    <p>适用于团队协作和正式使用</p>
                    <ul>
                      <li>环境: Node.js服务器</li>
                      <li>数据: SQLite或其他</li>
                      <li>特点: 支持多用户，数据共享</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="guide-category">
                <h4>💡 最佳实践</h4>
                <div class="best-practices">
                  <div class="practice-item">
                    <el-icon color="#67C23A"><Check /></el-icon>
                    <div>
                      <h5>定期测试</h5>
                      <p>建议每次重要更新后都运行完整测试</p>
                    </div>
                  </div>
                  
                  <div class="practice-item">
                    <el-icon color="#409EFF"><DataLine /></el-icon>
                    <div>
                      <h5>监控性能</h5>
                      <p>关注系统资源使用和响应时间</p>
                    </div>
                  </div>
                  
                  <div class="practice-item">
                    <el-icon color="#E6A23C"><Warning /></el-icon>
                    <div>
                      <h5>备份数据</h5>
                      <p>定期备份重要学习数据和配置</p>
                    </div>
                  </div>
                  
                  <div class="practice-item">
                    <el-icon color="#F56C6C"><Setting /></el-icon>
                    <div>
                      <h5>环境隔离</h5>
                      <p>开发、测试、生产环境分离管理</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="troubleshooting">
              <h4>🔧 常见问题解决</h4>
              <div class="faq-items">
                <div class="faq-item">
                  <h5>Q: 测试失败怎么办？</h5>
                  <p>A: 查看详细的错误信息，根据提示修复问题后重新运行测试</p>
                </div>
                
                <div class="faq-item">
                  <h5>Q: 部署后无法访问？</h5>
                  <p>A: 检查端口是否被占用，防火墙设置，以及服务是否正常启动</p>
                </div>
                
                <div class="faq-item">
                  <h5>Q: 数据丢失如何恢复？</h5>
                  <p>A: 如果启用了自动备份，可以从备份文件中恢复数据</p>
                </div>
                
                <div class="faq-item">
                  <h5>Q: 性能缓慢如何优化？</h5>
                  <p>A: 清理缓存数据，关闭不必要的功能模块，升级硬件配置</p>
                </div>
              </div>
            </div>
            
            <el-button type="primary" size="large" disabled>
              完整使用手册开发中...
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.system-test-deployment-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
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

.tab-navigation {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
}

.test-deploy-tabs :deep(.el-tabs__header) {
  margin-bottom: 30px;
}

.test-deploy-tabs :deep(.el-tabs__nav-wrap)::after {
  display: none;
}

.test-deploy-tabs :deep(.el-tabs__item) {
  font-size: 1.2em;
  font-weight: 500;
  padding: 0 30px;
  height: 60px;
  line-height: 60px;
  color: #666666;
}

.test-deploy-tabs :deep(.el-tabs__item.is-active) {
  color: #409EFF;
  font-weight: 600;
}

.test-deploy-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, #FF6B6B 0%, #409EFF 100%);
  height: 4px;
  border-radius: 2px;
}

.guide-content {
  text-align: center;
  padding: 50px 20px;
  color: #666666;
}

.guide-illustration {
  margin-bottom: 30px;
}

.guide-content h3 {
  font-size: 2em;
  color: #333333;
  margin-bottom: 15px;
}

.guide-content p {
  font-size: 1.2em;
  margin-bottom: 40px;
  color: #666666;
}

.guide-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}

.guide-category {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 15px;
  text-align: left;
  transition: all 0.3s ease;
}

.guide-category:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.guide-category h4 {
  color: #333333;
  margin: 0 0 20px 0;
  font-size: 1.3em;
  text-align: center;
}

.guide-steps {
  padding-left: 20px;
  color: #444444;
  line-height: 1.8;
}

.guide-steps li {
  margin-bottom: 12px;
}

.guide-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.guide-list li {
  padding: 12px 0;
  border-bottom: 1px solid #eeeeee;
  color: #444444;
  line-height: 1.6;
}

.guide-list li:last-child {
  border-bottom: none;
}

.guide-list strong {
  color: #333333;
}

.config-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.config-item {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #eeeeee;
}

.config-item h5 {
  color: #333333;
  margin: 0 0 10px 0;
  font-size: 1.1em;
}

.config-item p {
  color: #666666;
  margin: 0 0 15px 0;
  font-size: 0.95em;
}

.config-item ul {
  padding-left: 15px;
  margin: 0;
  color: #444444;
  font-size: 0.9em;
}

.config-item li {
  margin-bottom: 8px;
}

.best-practices {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.practice-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #eeeeee;
}

.practice-item h5 {
  color: #333333;
  margin: 0 0 8px 0;
  font-size: 1em;
}

.practice-item p {
  color: #666666;
  margin: 0;
  font-size: 0.9em;
  line-height: 1.5;
}

.troubleshooting {
  margin: 50px 0;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 15px;
}

.troubleshooting h4 {
  color: #333333;
  font-size: 1.5em;
  margin-bottom: 30px;
  text-align: center;
}

.faq-items {
  display: grid;
  gap: 25px;
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  background: white;
  padding: 25px;
  border-radius: 12px;
  border-left: 4px solid #409EFF;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
}

.faq-item h5 {
  color: #333333;
  margin: 0 0 15px 0;
  font-size: 1.1em;
}

.faq-item p {
  color: #666666;
  margin: 0;
  line-height: 1.6;
}

/* 响应式设计*/
@media (max-width: 768px) {
  .system-test-deployment-container {
    padding: 15px;
  }
  
  .page-title {
    font-size: 2.2em;
  }
  
  .page-subtitle {
    font-size: 1.1em;
  }
  
  .tab-navigation {
    padding: 20px;
  }
  
  .guide-sections {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .guide-category {
    padding: 20px;
  }
  
  .config-options {
    grid-template-columns: 1fr;
  }
  
  .best-practices {
    grid-template-columns: 1fr;
  }
  
  .practice-item {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
  
  .faq-items {
    gap: 20px;
  }
  
  .test-deploy-tabs :deep(.el-tabs__item) {
    padding: 0 15px;
    font-size: 1em;
  }
}
</style>
