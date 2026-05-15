<template>
  <div id="app">
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TodoDashboard from '@/components/TodoDashboard.vue'
import MathView from '@/views/MathView.vue'
import EnglishView from '@/views/EnglishView.vue'
import PoliticsView from '@/views/PoliticsView.vue'
import CS408View from '@/views/CS408View.vue'
import AttentionView from '@/views/AttentionViewIntegrated.vue'
import LearningPathView from '@/views/LearningPathView.vue'
import DataAnalyticsView from '@/views/DataAnalyticsView.vue'
import PsychologyView from '@/views/PsychologyView.vue'

const currentRoute = ref('/')

const routes = [
  { path: '/', name: '首页' },
  { path: '/math', name: '数学一' },
  { path: '/english', name: '英语一' },
  { path: '/politics', name: '政治' },
  { path: '/cs408', name: '408计算机' },
  { path: '/universities', name: '🏫 院校查询' },
  { path: '/attention', name: '注意力' },
  { path: '/learning-path', name: '学习路径' },
  { path: '/analytics', name: '数据分析' },
  { path: '/psychology', name: '心理干预' }
]

const router = useRouter()

const goToRoute = (path) => {
  router.push(path)
}

const goToSubject = (subject) => {
  router.push(`/${subject}`)
}
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
  padding: 0 24px; /* 与主容器保持一致的左右内边距 */
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
  padding: 0 20px;
  width: 100%;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .header {
    padding: 20px 15px;
    border-radius: 0 0 15px 15px;
  }
  
  .header h1 {
    font-size: 1.5rem;
  }
  
  .nav {
    gap: 8px;
  }
  
  .nav button {
    padding: 8px 12px;
    font-size: 0.75rem;
    border-radius: 8px;
  }
  
  .hero h2 {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .features {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .main-content {
    padding: 20px 15px;
  }
  
  .subject-page, .page {
    padding: 20px 15px;
  }
}
</style>