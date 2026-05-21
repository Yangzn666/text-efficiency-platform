<template>
  <div id="app">
    <!-- 全局加载指示器 -->
    <div v-if="isLoading" class="global-loading">
      <div class="loading-spinner"></div>
      <p class="loading-text">加载中...</p>
    </div>
    
    <div class="container">
      <header class="header">
        <h1>🎓 考研效率平台</h1>
        <nav class="nav">
          <button 
            v-for="route in routes" 
            :key="route.path"
            :class="{ active: $route.path === route.path }"
            @click="goToRoute(route.path)"
          >
            {{ route.name }}
          </button>
        </nav>
      </header>

      <main class="main-content">
        <router-view />
      </main>

      <footer class="footer">
        <p>© 2026 考研效率平台</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TodoDashboard from '@/components/TodoDashboard.vue'
import MathView from '@/views/MathView.vue'
import EnglishView from '@/views/EnglishView.vue'
import PoliticsView from '@/views/PoliticsView.vue'
import CS408View from '@/views/CS408View.vue'
import AttentionView from '@/views/AttentionViewIntegrated.vue'
import LearningPathView from '@/views/LearningPathView.vue'
import DataAnalyticsView from '@/views/DataAnalyticsView.vue'

const currentRoute = ref('/')
const isLoading = ref(true)

const routes = [
  { path: '/', name: '首页' },
  { path: '/math', name: '数学一' },
  { path: '/english', name: '英语一' },
  { path: '/politics', name: '政治' },
  { path: '/cs408', name: '408计算机' },
  { path: '/universities', name: '🏫 院校查询' },
  { path: '/attention', name: '注意力' },
  { path: '/learning-path', name: '学习路径' },
  { path: '/analytics', name: '数据分析' }
]

const router = useRouter()

const goToRoute = (path) => {
  console.log('导航到:', path)
  router.push(path).catch(err => {
    console.error('路由跳转失败:', err)
  })
}

const goToSubject = (subject) => {
  router.push(`/${subject}`)
}

// 页面加载完成后隐藏加载指示器
onMounted(() => {
  // 等待路由准备好后再隐藏加载指示器
  router.isReady().then(() => {
    setTimeout(() => {
      isLoading.value = false
    }, 300)
  }).catch(() => {
    // 如果出错，也隐藏加载指示器
    isLoading.value = false
  })
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'FZCuHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f5f7fa;
  min-height: 100vh;
}

.container {
  max-width: 3000px; /* 与main.scss保持一致，进一步增加宽度 */
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.header {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  padding: 25px 20px;
  text-align: center;
  border-radius: 0;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
  border: none;
  margin-bottom: 0;
}

.header h1 {
  color: #1976D2;
  margin-bottom: 20px;
  font-size: 2.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1976D2 0%, #64B5F6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 10px 0;
}

.nav button {
  padding: 12px 22px;
  border: 2px solid transparent;
  border-radius: 12px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-weight: normal !important;
  font-size: 1.15rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
  font-family: 'FZCuHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
  white-space: nowrap;
  flex-shrink: 0;
}

.nav button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #2196F3 0%, #64B5F6 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
  border-radius: 12px;
}

.nav button:hover {
  color: #2196F3;
  border-color: #2196F3;
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(33, 150, 243, 0.2);
}

.nav button:hover::before {
  opacity: 0.1;
}

.nav button.active {
  background: linear-gradient(135deg, #2196F3 0%, #64B5F6 100%);
  color: white;
  border-color: #2196F3;
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.3);
  transform: translateY(-3px);
}

.nav button.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: #2196F3;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(33, 150, 243, 0.4);
}

.main-content {
  flex: 1;
  padding: 20px;
  width: 100%;
  overflow-x: hidden;
}

.home-page {
  text-align: center;
  color: white;
}

.hero h2 {
  font-size: 3rem;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.subtitle {
  font-size: 1.3rem;
  margin-bottom: 50px;
  opacity: 0.9;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  background: white;
}

.feature-card .icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-card h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.4rem;
}

.feature-card p {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
}

.feature-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.progress-bar {
  width: 100px;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.subject-page, .page {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  min-height: 600px;
}

.footer {
  text-align: center;
  padding: 20px;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

/* 全局加载指示器 */
.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: white;
  margin-top: 20px;
  font-size: 1.2rem;
  font-weight: 500;
}

/* 响应式设计 - 平板 */
@media (max-width: 1024px) {
  .nav button {
    padding: 10px 16px;
    font-size: 0.95rem;
  }
}

/* 响应式设计 - 手机 */
@media (max-width: 768px) {
  .header {
    padding: 15px 10px;
    border-radius: 0;
    margin-bottom: 0;
  }
  
  .header h1 {
    font-size: 1.3rem;
    margin-bottom: 10px;
  }
  
  .nav {
    gap: 6px;
    justify-content: flex-start;
    padding: 8px 10px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .nav button {
    padding: 8px 14px;
    font-size: 0.85rem;
    border-radius: 8px;
    flex-shrink: 0;
  }
  
  .main-content {
    padding: 10px;
  }
  
  .subject-page, .page {
    padding: 15px 10px;
    border-radius: 15px;
  }
  
  .hero h2 {
    font-size: 1.5rem;
  }
  
  .subtitle {
    font-size: 0.9rem;
  }
  
  .features {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 0;
  }
  
  .feature-card {
    padding: 20px;
  }
  
  .footer {
    padding: 15px 10px;
    font-size: 0.85rem;
  }
}

/* 响应式设计 - 小屏手机 */
@media (max-width: 480px) {
  .header {
    padding: 12px 8px;
  }
  
  .header h1 {
    font-size: 1.1rem;
    margin-bottom: 8px;
  }
  
  .nav {
    gap: 5px;
    padding: 6px 8px;
  }
  
  .nav button {
    padding: 6px 10px;
    font-size: 0.75rem;
    border-radius: 6px;
  }
  
  .main-content {
    padding: 8px;
  }
  
  .subject-page, .page {
    padding: 12px 8px;
    border-radius: 12px;
  }
  
  .feature-card {
    padding: 15px;
  }
  
  .feature-card .icon {
    font-size: 2rem;
  }
  
  .feature-card h3 {
    font-size: 1.1rem;
  }
}
</style>