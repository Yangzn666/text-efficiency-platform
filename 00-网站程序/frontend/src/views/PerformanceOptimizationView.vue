<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import PerformanceMonitor from '@/components/PerformanceMonitor.vue'
// 使用动态导入解决TypeScript默认导出识别问题
const PerformanceTools = defineAsyncComponent(() => import('@/components/PlaceholderComponent.vue'))

const activeTab = ref('monitor')
</script>

<template>
  <div class="performance-optimization-container">
    <div class="page-header">
      <h1 class="page-title">性能优化中心</h1>
      <p class="page-subtitle">提升应用响应速度和用户体验</p>
    </div>

    <div class="tab-navigation">
      <el-tabs v-model="activeTab" class="performance-tabs">
        <el-tab-pane label="性能监控" name="monitor">
          <PerformanceMonitor />
        </el-tab-pane>
        
        <el-tab-pane label="优化工具" name="tools">
          <PerformanceTools />
        </el-tab-pane>
        
        <el-tab-pane label="最佳实践" name="best-practices">
          <div class="practices-content">
            <div class="practices-illustration">
              <el-icon size="80" color="#4CAF50"><Trophy /></el-icon>
            </div>
            <h3>🏆 性能优化最佳实践</h3>
            <p>遵循行业标准的性能优化指南</p>
            
            <div class="practices-grid">
              <div class="practice-category">
                <h4>📦 资源优化</h4>
                <ul class="practice-list">
                  <li>压缩图片和静态资源</li>
                  <li>启用Gzip/Brotli压缩</li>
                  <li>使用CDN加速静态资源</li>
                  <li>实施代码分割和懒加载</li>
                </ul>
              </div>
              
              <div class="practice-category">
                <h4>渲染优化</h4>
                <ul class="practice-list">
                  <li>优化关键渲染路径</li>
                  <li>减少重排和重绘</li>
                  <li>使用虚拟滚动处理大量数据</li>
                  <li>合理使用CSS动画和变换</li>
                </ul>
              </div>
              
              <div class="practice-category">
                <h4>💾 内存管理</h4>
                <ul class="practice-list">
                  <li>及时清理无用的对象引用</li>
                  <li>避免内存泄漏</li>
                  <li>优化数据结构和算法</li>
                  <li>合理使用缓存机制</li>
                </ul>
              </div>
              
              <div class="practice-category">
                <h4>🌐 网络优化</h4>
                <ul class="practice-list">
                  <li>减少HTTP请求数量</li>
                  <li>使用HTTP/2协议</li>
                  <li>优化DNS解析</li>
                  <li>实施预加载和预连接</li>
                </ul>
              </div>
            </div>
            
            <div class="performance-metrics">
              <h4>关键性能指标(KPI)</h4>
              <div class="metrics-cards">
                <div class="metric-card">
                  <div class="metric-name">LCP</div>
                  <div class="metric-value">≤2.5s</div>
                  <div class="metric-desc">最大内容绘制</div>
                </div>
                
                <div class="metric-card">
                  <div class="metric-name">FID</div>
                  <div class="metric-value">≤100ms</div>
                  <div class="metric-desc">首次输入延迟</div>
                </div>
                
                <div class="metric-card">
                  <div class="metric-name">CLS</div>
                  <div class="metric-value">≤0.1</div>
                  <div class="metric-desc">累积布局偏移</div>
                </div>
                
                <div class="metric-card">
                  <div class="metric-name">FCP</div>
                  <div class="metric-value">≤1.8s</div>
                  <div class="metric-desc">首次内容绘制</div>
                </div>
              </div>
            </div>
            
            <el-button type="primary" size="large" disabled>
              最佳实践指南开发中...
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.performance-optimization-container {
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

.performance-tabs :deep(.el-tabs__header) {
  margin-bottom: 30px;
}

.performance-tabs :deep(.el-tabs__nav-wrap)::after {
  display: none;
}

.performance-tabs :deep(.el-tabs__item) {
  font-size: 1.2em;
  font-weight: 500;
  padding: 0 30px;
  height: 60px;
  line-height: 60px;
  color: #666666;
}

.performance-tabs :deep(.el-tabs__item.is-active) {
  color: #4CAF50;
  font-weight: 600;
}

.performance-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, #FF6B6B 0%, #4CAF50 100%);
  height: 4px;
  border-radius: 2px;
}

.practices-content {
  text-align: center;
  padding: 50px 20px;
  color: #666666;
}

.practices-illustration {
  margin-bottom: 30px;
}

.practices-content h3 {
  font-size: 2em;
  color: #333333;
  margin-bottom: 15px;
}

.practices-content p {
  font-size: 1.2em;
  margin-bottom: 40px;
  color: #666666;
}

.practices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}

.practice-category {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 15px;
  text-align: left;
  transition: all 0.3s ease;
}

.practice-category:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.practice-category h4 {
  color: #333333;
  margin: 0 0 20px 0;
  font-size: 1.3em;
  text-align: center;
}

.practice-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.practice-list li {
  padding: 12px 0;
  border-bottom: 1px solid #eeeeee;
  color: #666666;
  position: relative;
  padding-left: 25px;
}

.practice-list li:last-child {
  border-bottom: none;
}

.practice-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #4CAF50;
  font-weight: bold;
}

.performance-metrics {
  margin: 50px 0;
}

.performance-metrics h4 {
  color: #333333;
  font-size: 1.5em;
  margin-bottom: 30px;
}

.metrics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.metric-card {
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  color: white;
  padding: 25px;
  border-radius: 15px;
  text-align: center;
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(76, 175, 80, 0.3);
}

.metric-name {
  font-size: 1.2em;
  font-weight: 600;
  margin-bottom: 10px;
}

.metric-value {
  font-size: 2em;
  font-weight: 700;
  margin-bottom: 10px;
}

.metric-desc {
  font-size: 0.9em;
  opacity: 0.9;
}

/* 响应式设计*/
@media (max-width: 768px) {
  .performance-optimization-container {
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
  
  .practices-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .practice-category {
    padding: 20px;
  }
  
  .metrics-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .metric-card {
    padding: 20px;
  }
  
  .performance-tabs :deep(.el-tabs__item) {
    padding: 0 15px;
    font-size: 1em;
  }
}
</style>
