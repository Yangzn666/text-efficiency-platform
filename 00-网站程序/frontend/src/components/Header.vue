<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useStudyStore } from '@/stores/study'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const studyStore = useStudyStore()

const isDropdownVisible = ref(false)

const handleLogout = () => {
  userStore.logout()
  ElMessage.success('已退出登录')
}

const menuItems = computed(() => [
  { name: '首页', icon: 'HomeFilled', route: '/' },
  { name: '学习方法', icon: 'Reading', route: '/study-methods' },
  { name: '学习路径', icon: 'Document', route: '/learning-path' },
  { name: '计组学习', icon: 'Cpu', route: '/cs408/composition' },
  { name: '错题本', icon: 'DocumentChecked', route: '/wrong-problems' },
  { name: '统计数据', icon: 'DataAnalysis', route: '/stats' }
])
</script>

<template>
  <header class="main-header">
    <div class="header-container">
      <!-- Logo区域 -->
      <div class="logo-section">
        <div class="logo">
          <el-icon size="28" color="#FF6B6B"><MagicStick /></el-icon>
          <span class="logo-text">考研效率平台</span>
        </div>
      </div>

      <!-- 导航菜单 -->
      <nav class="nav-menu">
        <router-link 
          v-for="item in menuItems" 
          :key="item.route"
          :to="item.route"
          class="nav-item"
          active-class="active"
        >
          <el-icon :size="20"><component :is="item.icon" /></el-icon>
          <span>{{ item.name }}</span>
        </router-link>
      </nav>

      <!-- 用户信息区域 -->
      <div class="user-section">
        <div class="user-info">
          <div class="study-stats">
            <span class="today-time">今日 {{ studyStore.todayStudyTime }}分钟</span>
            <span class="streak">🔥 {{ studyStore.currentStreak }}天</span>
          </div>
          
          <div class="user-dropdown" @click="isDropdownVisible = !isDropdownVisible">
            <div class="user-avatar">
              <el-icon size="20"><User /></el-icon>
            </div>
            <span class="username">{{ userStore.displayName }}</span>
            <el-icon size="16"><ArrowDown /></el-icon>
          </div>
        </div>

        <!-- 下拉菜单 -->
        <transition name="dropdown">
          <div v-show="isDropdownVisible" class="dropdown-menu">
            <div class="dropdown-item" @click="handleLogout">
              <el-icon><SwitchButton /></el-icon>
              <span>退出登录</span>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<style scoped>
.main-header {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 30px;
  font-family: 'FZCuHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 25px;
  display: flex;
  align-items: center;
  height: 75px;
}

.logo-section {
  flex-shrink: 0;
  margin-right: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1976D2;
  font-weight: 700;
  font-size: 1.4em;
  font-family: 'FZCuHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.logo-text {
  background: linear-gradient(135deg, #1976D2 0%, #64B5F6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-menu {
  display: flex;
  gap: 20px;
  flex: 1;
  justify-content: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 12px;
  text-decoration: none;
  color: #666;
  font-size: 19px;
  font-weight: normal;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  white-space: nowrap;
  min-width: fit-content;
  border: 2px solid transparent;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  font-family: 'FZCuHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
}

.nav-item:hover {
  color: #2196F3;
  border-color: #2196F3;
  background: rgba(33, 150, 243, 0.05);
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(33, 150, 243, 0.15);
}

.nav-item.active {
  color: #2196F3;
  border-color: #2196F3;
  background: linear-gradient(135deg, #2196F3 0%, #64B5F6 100%);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.25);
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: #2196F3;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(33, 150, 243, 0.4);
}

.user-section {
  position: relative;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.study-stats {
  display: flex;
  gap: 15px;
  font-size: 14px;
  color: #666666;
}

.today-time {
  background: linear-gradient(135deg, #4CAF50 0%, #FF6B6B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 500;
}

.streak {
  color: #FF6B6B;
  font-weight: normal;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 107, 107, 0.2);
}

.user-dropdown:hover {
  background: rgba(255, 107, 107, 0.1);
  border-color: rgba(255, 107, 107, 0.3);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B6B 0%, #4CAF50 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.username {
  font-weight: 500;
  color: #333333;
  font-size: 15px;
  font-family: 'FZCuHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  min-width: 160px;
  z-index: 1001;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  cursor: pointer;
  color: #666666;
  font-size: 14px;
  font-family: 'FZCuHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-weight: normal;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: #f8f9fa;
  color: #FF6B6B;
}

.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 响应式设计 - 字体已更新 */
@media (max-width: 768px) {
  .main-header {
    border-radius: 0 0 15px 15px;
  }
  
  .header-container {
    padding: 0 20px;
    height: 65px;
  }
  
  .logo {
    font-size: 1.2em;
  }
  
  .nav-menu {
    display: none;
  }
  
  .study-stats {
    display: none;
  }
  
  .user-dropdown {
    padding: 6px 12px;
  }
  
  .username {
    display: none;
  }
}

/* 中等屏幕优化 */
@media (max-width: 1024px) and (min-width: 769px) {
  .nav-menu {
    gap: 15px;
  }
  
  .nav-item {
    font-family: 'FZCuHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
    font-size: 18px;
    font-weight: normal;
    padding: 8px 14px;
    gap: 6px;
  }
  
  .header-container {
    padding: 0 20px;
  }
}
</style>