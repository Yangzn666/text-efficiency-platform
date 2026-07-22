<template>
  <div id="app">
    <!-- 全局加载指示器 -->
    <div v-if="isLoading" class="global-loading">
      <div class="loading-spinner"></div>
      <p class="loading-text">加载中...</p>
    </div>

    <div class="container">
      <header class="header">
        <div class="header-content">
          <h1>🎓 考研效率平台</h1>

          <!-- 移动端汉堡菜单按钮 -->
          <button class="mobile-menu-toggle" @click="toggleMobileMenu" aria-label="切换菜单">
            <span class="hamburger-icon" :class="{ open: mobileMenuOpen }">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        <!-- 桌面端导航 -->
        <nav class="nav desktop-nav">
          <button
            v-for="route in routes"
            :key="route.path"
            :class="{ active: $route.path === route.path }"
            @click="goToRoute(route.path)"
          >
            {{ route.name }}
          </button>
        </nav>

        <!-- 移动端下拉菜单 -->
        <nav v-if="mobileMenuOpen" class="nav mobile-nav">
          <button
            v-for="route in routes"
            :key="route.path"
            :class="{ active: $route.path === route.path }"
            @click="handleMobileNavClick(route.path)"
          >
            {{ route.name }}
          </button>
        </nav>
      </header>

      <main class="main-content">
        <router-view />
      </main>

      <footer class="footer">
        <p>© 2026 考研效率平台 · 浙大海宁 · 27考研必胜</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const isLoading = ref(true)
const mobileMenuOpen = ref(false)

const routes = [
  { path: '/', name: '今日状态' },
  { path: '/math', name: '数学一' },
  { path: '/english', name: '英语一' },
  { path: '/politics', name: '政治' },
  { path: '/cs408', name: '408计算机' },
  { path: '/wrong-problems', name: '错题本' },
  { path: '/universities', name: '🏫 院校查询' },
  { path: '/analytics', name: '数据分析' },
  { path: '/study-methods', name: '学习方法' }
]

const router = useRouter()

const goToRoute = (path) => {
  router.push(path).catch(err => {
    console.error('路由跳转失败:', err)
  })
}

const handleMobileNavClick = (path) => {
  goToRoute(path)
  mobileMenuOpen.value = false
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// 页面加载完成后隐藏加载指示器
onMounted(() => {
  router.isReady().then(() => {
    setTimeout(() => {
      isLoading.value = false
    }, 300)
  }).catch(() => {
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
  background: #f5f8fc;
  min-height: 100vh;
}

.container {
  max-width: 3000px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0;
}

/* ===== 作战室顶栏 ===== */
.header {
  background: linear-gradient(150deg, #0d2137 0%, #16345c 60%, #1e4576 100%);
  padding: 0;
  border-radius: 0;
  box-shadow: 0 4px 24px rgba(13, 33, 55, 0.35);
  border: none;
  margin-bottom: 0;
  position: relative;
  overflow: hidden;
}

/* 网格纹理 */
.header::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 36px 36px;
  pointer-events: none;
}

/* 金色光晕 */
.header::after {
  content: '';
  position: absolute;
  top: -60%;
  right: -5%;
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, rgba(255, 197, 61, 0.10) 0%, transparent 70%);
  pointer-events: none;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 18px 24px 10px;
  position: relative;
  z-index: 1;
}

.header h1 {
  color: #ffffff;
  margin: 0;
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header h1::after {
  content: '27考研 · 浙大海宁';
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  font-weight: 500;
  color: #ffc53d;
  letter-spacing: 0.12em;
  border: 1px solid rgba(255, 197, 61, 0.4);
  border-radius: 3px;
  padding: 3px 8px;
  transform: translateY(1px);
}

/* 移动端汉堡菜单按钮 */
.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 1001;
}

.hamburger-icon {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 24px;
}

.hamburger-icon span {
  display: block;
  height: 3px;
  background: #ffc53d;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger-icon.open span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.hamburger-icon.open span:nth-child(2) {
  opacity: 0;
}

.hamburger-icon.open span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* ===== 导航按钮 ===== */
.nav {
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 6px 24px 14px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.desktop-nav {
  flex-wrap: nowrap;
  overflow-x: visible;
}

.mobile-nav {
  display: none;
  flex-direction: column;
  gap: 8px;
  padding: 14px 20px 18px;
  background: rgba(13, 33, 55, 0.97);
  border-top: 1px solid rgba(255, 197, 61, 0.15);
}

.nav button {
  padding: 9px 20px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: #b8c9dd;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-weight: 500;
  font-size: 1rem;
  position: relative;
  overflow: hidden;
  font-family: inherit;
  white-space: nowrap;
  flex-shrink: 0;
  letter-spacing: 0.03em;
}

.nav button:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.10);
  border-color: rgba(255, 197, 61, 0.45);
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
}

.nav button.active {
  background: linear-gradient(135deg, #ffc53d 0%, #f0a820 100%);
  color: #0d2137;
  font-weight: 700;
  border-color: #ffc53d;
  box-shadow: 0 4px 16px rgba(255, 197, 61, 0.35);
  transform: translateY(-2px);
}

.nav button.active::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: #ffc53d;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(255, 197, 61, 0.6);
}

/* ===== 主内容区 ===== */
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
  color: #303133;
  margin-bottom: 15px;
  font-size: 1.4rem;
}

.feature-card p {
  color: #5b6b7f;
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
  background: #e4ebf3;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffc53d, #f0a820);
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

/* ===== 页脚 ===== */
.footer {
  text-align: center;
  padding: 18px 20px;
  color: #7a8fa6;
  background: #0d2137;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  border-top: 2px solid rgba(255, 197, 61, 0.25);
}

/* ===== 全局加载指示器 ===== */
.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(150deg, #0d2137 0%, #16345c 60%, #1e4576 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.global-loading::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 44px 44px;
}

.loading-spinner {
  width: 56px;
  height: 56px;
  border: 4px solid rgba(255, 197, 61, 0.2);
  border-top-color: #ffc53d;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
  position: relative;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: #b8c9dd;
  margin-top: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.15em;
  position: relative;
}

/* ===== 响应式 ===== */
@media (max-width: 1024px) {
  .nav button {
    padding: 8px 14px;
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 14px 14px 8px;
  }

  .header h1 {
    font-size: 1.2rem;
  }

  .header h1::after {
    display: none;
  }

  .nav {
    gap: 6px;
    justify-content: flex-start;
    padding: 6px 10px 12px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .nav button {
    padding: 7px 13px;
    font-size: 0.85rem;
    border-radius: 5px;
    flex-shrink: 0;
  }

  .mobile-menu-toggle {
    display: block;
  }

  .desktop-nav {
    display: none;
  }

  .mobile-nav {
    display: flex;
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
    padding: 14px 10px;
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 12px 10px 6px;
  }

  .header h1 {
    font-size: 1.05rem;
  }

  .nav {
    gap: 5px;
    padding: 5px 8px 10px;
  }

  .nav button {
    padding: 6px 10px;
    font-size: 0.78rem;
    border-radius: 4px;
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

@media (prefers-reduced-motion: reduce) {
  .nav button,
  .feature-card {
    transition: none;
  }
  .nav button:hover,
  .nav button.active {
    transform: none;
  }
}
</style>
