import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AuthView from '@/views/AuthView.vue'
import AttentionView from '@/views/AttentionViewIntegrated.vue'
import LearningPathView from '@/views/LearningPathView.vue'
import PsychologyView from '@/views/PsychologyView.vue'
import CS408View from '@/views/CS408View.vue'
import CSLearningView from '@/views/CSLearning.vue'
import DSLearningView from '@/views/DSLearning.vue'
import NetworkLearningView from '@/views/NetworkLearning.vue'
import WrongProblemsView from '@/views/WrongProblemsView.vue'
import MathView from '@/views/MathView.vue'
import MathHomeView from '@/views/MathHomeView.vue'
import EnglishView from '@/views/EnglishView.vue'
import PoliticsView from '@/views/PoliticsView.vue'
import DataAnalyticsView from '@/views/DataAnalyticsView.vue'
import UXOptimizationView from '@/views/UXOptimizationView.vue'
import PerformanceOptimizationView from '@/views/PerformanceOptimizationView.vue'
import SystemTestDeploymentView from '@/views/SystemTestDeploymentView.vue'
import TaskManagementView from '@/views/TaskManagementView.vue'
import IntensiveReadingView from '@/views/IntensiveReadingView.vue'
import UniversitiesView from '@/views/UniversitiesView.vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    // {
      // path: '/auth',
      // name: 'auth',
      // component: AuthView
    // },
    {
      path: '/attention',
      name: 'attention',
      component: AttentionView,
      meta: { requiresAuth: true }
    },
    {
      path: '/learning-path',
      name: 'learning-path',
      component: LearningPathView,
      meta: { requiresAuth: true }
    },
    {
      path: '/psychology',
      name: 'psychology',
      component: PsychologyView,
      meta: { requiresAuth: true }
    },
    {
      path: '/cs408',
      name: 'cs408',
      component: CS408View,
      meta: { requiresAuth: true }
    },
    {
      path: '/cs408/composition',
      name: 'cs-composition',
      component: CSLearningView,
      meta: { 
        requiresAuth: true,
        title: '计算机组成原理',
        subject: '计算机组成原理'
      }
    },
    {
      path: '/cs408/datastructure',
      name: 'cs-datastructure',
      component: DSLearningView,
      meta: { 
        requiresAuth: true,
        title: '数据结构',
        subject: '数据结构'
      }
    },
    {
      path: '/cs408/network',
      name: 'cs-network',
      component: NetworkLearningView,
      meta: { 
        requiresAuth: true,
        title: '计算机网络',
        subject: '计算机网络'
      }
    },
    {
      path: '/wrong-problems',
      name: 'wrong-problems',
      component: WrongProblemsView,
      meta: { 
        requiresAuth: true,
        title: '计组错题本'
      }
    },
    {
      path: '/math',
      name: 'math',
      component: MathHomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/math/detail',
      name: 'math-detail',
      component: MathView,
      meta: { requiresAuth: true }
    },
    {
      path: '/english',
      name: 'english',
      component: EnglishView,
      meta: { requiresAuth: true }
    },
    {
      path: '/politics',
      name: 'politics',
      component: PoliticsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: DataAnalyticsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/ux',
      name: 'ux',
      component: UXOptimizationView,
      meta: { requiresAuth: true }
    },
    {
      path: '/performance',
      name: 'performance',
      component: PerformanceOptimizationView,
      meta: { requiresAuth: true }
    },
    {
      path: '/test-deploy',
      name: 'test-deploy',
      component: SystemTestDeploymentView,
      meta: { requiresAuth: true }
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: TaskManagementView
    },
    {
      path: '/intensive-reading',
      name: 'intensive-reading',
      component: IntensiveReadingView,
      meta: { requiresAuth: true }
    },
    {
      path: '/universities',
      name: 'universities',
      component: UniversitiesView,
      meta: { requiresAuth: false }
    }
  ]
})

// 移除认证守卫，无需登录
// router.beforeEach((to, _from, next) => {
//   const userStore = useUserStore()
//   
//   // 初始化用户状态
//   if (!userStore.isAuthenticated) {
//     userStore.initializeUser()
//   }
//   
//   // 检查是否需要认证
//   if (to.meta.requiresAuth && !userStore.isAuthenticated) {
//     next('/auth')
//   } else if (to.name === 'auth' && userStore.isAuthenticated) {
//     // 如果已登录，访问认证页面则重定向到主页
//     next('/')
//   } else {
//     next()
//   }
// })

export default router