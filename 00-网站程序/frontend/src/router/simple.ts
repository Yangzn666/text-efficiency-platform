import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AuthView from '@/views/AuthView.vue'
import LearningPathView from '@/views/LearningPathViewComplete.vue'
import DataAnalyticsView from '@/views/DataAnalyticsView.vue'
import SettingsView from '@/views/SettingsView.vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView
    },
    {
      path: '/learning-path',
      name: 'learning-path',
      component: LearningPathView,
      meta: { requiresAuth: true }
    },
    {
      path: '/stats',
      name: 'stats',
      component: DataAnalyticsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: { requiresAuth: true }
    }
  ]
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  
  // 初始化用户状态
  if (!userStore.isAuthenticated) {
    userStore.initializeUser()
  }
  
  // 检查是否需要认证
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next('/auth')
  } else if (to.name === 'auth' && userStore.isAuthenticated) {
    // 如果已登录，访问认证页面则重定向到主页
    next('/')
  } else {
    next()
  }
})

export default router