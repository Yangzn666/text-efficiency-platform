<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
// 使用动态导入解决TypeScript默认导出识别问题
const UserPreferences = defineAsyncComponent(() => import('@/components/PlaceholderComponent.vue'))
const InteractiveTutorial = defineAsyncComponent(() => import('@/components/PlaceholderComponent.vue'))

const activeTab = ref('preferences')
</script>

<template>
  <div class="ux-optimization-container">
    <div class="page-header">
      <h1 class="page-title">用户体验优化</h1>
      <p class="page-subtitle">让学习体验更加流畅和愉悦</p>
    </div>

    <div class="tab-navigation">
      <el-tabs v-model="activeTab" class="ux-tabs">
        <el-tab-pane label="偏好设置" name="preferences">
          <UserPreferences />
        </el-tab-pane>
        
        <el-tab-pane label="交互引导" name="tutorial">
          <div class="tutorial-section">
            <div class="tutorial-intro">
              <div class="intro-illustration">
                <el-icon size="80" color="#FF6B6B"><Guide /></el-icon>
              </div>
              <h3>🎮 交互式新手引导</h3>
              <p>通过渐进式的引导帮助用户快速上手系统功能</p>
            </div>
            
            <div class="tutorial-preview">
              <InteractiveTutorial />
            </div>
            
            <div class="tutorial-features">
              <div class="feature-card">
                <el-icon size="24" color="#4CAF50"><Pointer /></el-icon>
                <div>
                  <h4>智能引导</h4>
                  <p>根据用户操作智能推荐下一步学习内容</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#2196F3"><MagicStaff /></el-icon>
                <div>
                  <h4>渐进学习</h4>
                  <p>分步骤介绍系统功能，避免信息过载</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#FF9800"><Lightning /></el-icon>
                <div>
                  <h4>即时反馈</h4>
                  <p>实时显示操作结果和学习进度</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#9C27B0"><Collection /></el-icon>
                <div>
                  <h4>个性化路径</h4>
                  <p>根据用户需求定制专属学习路径</p>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="界面优化" name="interface">
          <div class="interface-content">
            <div class="interface-illustration">
              <el-icon size="80" color="#4CAF50"><Monitor /></el-icon>
            </div>
            <h3>🎨 界面设计优化</h3>
            <p>持续优化视觉设计和交互体验</p>
            
            <div class="interface-features">
              <div class="feature-card">
                <el-icon size="24" color="#FF6B6B"><Brush /></el-icon>
                <div>
                  <h4>视觉层次优化</h4>
                  <p>清晰的信息架构和视觉层次设计</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#4CAF50"><Crop /></el-icon>
                <div>
                  <h4>响应式布局</h4>
                  <p>适配各种设备屏幕的自适应设计</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#2196F3"><Connection /></el-icon>
                <div>
                  <h4>交互流畅性</h4>
                  <p>优化动画效果和页面切换体验</p>
                </div>
              </div>
              
              <div class="feature-card">
                <el-icon size="24" color="#FF9800"><DataLine /></el-icon>
                <div>
                  <h4>数据可视化</h4>
                  <p>直观的图表展示和数据呈现</p>
                </div>
              </div>
            </div>
            
            <el-button type="primary" size="large" disabled>
              界面优化系统开发中...
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.ux-optimization-container {
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

.ux-tabs :deep(.el-tabs__header) {
  margin-bottom: 30px;
}

.ux-tabs :deep(.el-tabs__nav-wrap)::after {
  display: none;
}

.ux-tabs :deep(.el-tabs__item) {
  font-size: 1.2em;
  font-weight: 500;
  padding: 0 30px;
  height: 60px;
  line-height: 60px;
  color: #666666;
}

.ux-tabs :deep(.el-tabs__item.is-active) {
  color: #FF6B6B;
  font-weight: 600;
}

.ux-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(90deg, #FF6B6B 0%, #4CAF50 100%);
  height: 4px;
  border-radius: 2px;
}

.tutorial-section {
  text-align: center;
  padding: 30px 20px;
}

.tutorial-intro {
  margin-bottom: 40px;
}

.intro-illustration {
  margin-bottom: 30px;
}

.tutorial-intro h3 {
  font-size: 2em;
  color: #333333;
  margin-bottom: 15px;
}

.tutorial-intro p {
  font-size: 1.2em;
  margin-bottom: 30px;
  color: #666666;
}

.tutorial-preview {
  margin: 40px 0;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tutorial-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.interface-content {
  text-align: center;
  padding: 50px 20px;
  color: #666666;
}

.interface-illustration {
  margin-bottom: 30px;
}

.interface-content h3 {
  font-size: 2em;
  color: #333333;
  margin-bottom: 15px;
}

.interface-content p {
  font-size: 1.2em;
  margin-bottom: 40px;
  color: #666666;
}

.interface-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.feature-card {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 15px;
  text-align: left;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.feature-card h4 {
  color: #333333;
  margin: 0 0 10px 0;
  font-size: 1.3em;
}

.feature-card p {
  color: #666666;
  margin: 0;
  font-size: 1em;
  line-height: 1.6;
}

/* 响应式设计*/
@media (max-width: 768px) {
  .ux-optimization-container {
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
  
  .tutorial-features, .interface-features {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .feature-card {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .ux-tabs :deep(.el-tabs__item) {
    padding: 0 15px;
    font-size: 1em;
  }
}
</style>
