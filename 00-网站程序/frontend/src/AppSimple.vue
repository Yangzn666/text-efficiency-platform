<template>
  <div class="app">
    <header class="header">
      <h1>考研效率平台</h1>
      <nav>
        <button 
          v-for="item in menuItems" 
          :key="item.id"
          :class="{ active: activeMenu === item.id }"
          @click="activeMenu = item.id"
        >
          {{ item.name }}
        </button>
      </nav>
    </header>

    <main class="main">
      <div v-if="activeMenu === 'home'" class="home">
        <h2>欢迎使用考研效率平台</h2>
        <p>专注学习，高效备考，一站式考研助手</p>
        
        <div class="features">
          <div class="feature-card">
            <h3>📊 学习统计</h3>
            <p>可视化学习数据，精准掌握学习进度和效率</p>
          </div>
          
          <div class="feature-card">
            <h3>🧠 心理干预</h3>
            <p>专业的心理学方法帮助克服拖延，建立积极习惯</p>
          </div>
          
          <div class="feature-card">
            <h3>🎯 注意力管理</h3>
            <p>科学的时间管理和专注力训练工具</p>
          </div>
          
          <div class="feature-card">
            <h3>📚 学科专项</h3>
            <p>408计算机、数学、英语、政治全方位学习支持</p>
          </div>
        </div>
      </div>

      <div v-else-if="activeMenu === 'analytics'" class="analytics">
        <h2>学习统计分析</h2>
        <p>学习数据分析功能正在开发中...</p>
      </div>

      <div v-else-if="activeMenu === 'profile'" class="profile">
        <h2>个人中心</h2>
        <p>个人信息管理功能正在开发中...</p>
      </div>

      <div v-else-if="activeMenu === 'settings'" class="settings">
        <h2>系统设置</h2>
        <p>系统配置功能正在开发中...</p>
      </div>
    </main>

    <footer class="footer">
      <p>© 2024 考研效率平台 - 专注学习，高效备考</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeMenu = ref('home')

const menuItems = [
  { id: 'home', name: '首页' },
  { id: 'analytics', name: '学习统计' },
  { id: 'profile', name: '个人中心' },
  { id: 'settings', name: '系统设置' }
]
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  text-align: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.header h1 {
  color: #333;
  margin-bottom: 20px;
  font-size: 2rem;
}

.header nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.header button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: #f0f0f0;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.header button:hover {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
}

.header button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  width: 100%;
}

.home {
  text-align: center;
  color: white;
}

.home h2 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.home p {
  font-size: 1.2rem;
  margin-bottom: 40px;
  opacity: 0.9;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.2);
}

.feature-card h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.4rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.analytics, .profile, .settings {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
  min-height: 400px;
  text-align: center;
}

.analytics h2, .profile h2, .settings h2 {
  color: #333;
  margin-bottom: 30px;
  font-size: 2rem;
}

.footer {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 20px;
  text-align: center;
  margin-top: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header {
    padding: 15px;
  }
  
  .header h1 {
    font-size: 1.5rem;
  }
  
  .header nav {
    gap: 10px;
  }
  
  .header button {
    padding: 8px 15px;
    font-size: 0.9rem;
  }
  
  .home h2 {
    font-size: 2rem;
  }
  
  .features {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .main {
    padding: 20px 15px;
  }
}
</style>