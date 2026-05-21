import { createRouter, createWebHistory } from 'vue-router'
// 使用动态导入实现路由懒加载
const HomeView = () => import('@/views/HomeView.vue')
const AttentionView = () => import('@/views/AttentionViewNew.vue')
const LearningPathView = () => import('@/views/LearningPathView.vue')
const PsychologyView = () => import('@/views/PsychologyView.vue')
const CS408View = () => import('@/views/CS408View.vue')
const CSLearningView = () => import('@/views/CSLearning.vue')
const DSLearningView = () => import('@/views/DSLearning.vue')
const NetworkLearningView = () => import('@/views/NetworkLearning.vue')
const OSLearningView = () => import('@/views/OSLearning.vue')
const WrongProblemsView = () => import('@/views/WrongProblemsView.vue')
const MathView = () => import('@/views/MathView.vue')
// 数学强化阶段组件
const ReinforcementDashboard = () => import('@/components/ReinforcementDashboard.vue')
const TopicReinforcementView = () => import('@/components/TopicReinforcementView.vue')
const SpecialTrainingCenter = () => import('@/components/SpecialTrainingCenter.vue')
const EnglishView = () => import('@/views/EnglishView.vue')
const PoliticsView = () => import('@/views/PoliticsView.vue')
const DataAnalyticsView = () => import('@/views/DataAnalyticsView.vue')
const UXOptimizationView = () => import('@/views/UXOptimizationView.vue')
const PerformanceOptimizationView = () => import('@/views/PerformanceOptimizationView.vue')
const SystemTestDeploymentView = () => import('@/views/SystemTestDeploymentView.vue')
const TaskManagementView = () => import('@/views/TaskManagementView.vue')
const IntensiveReadingView = () => import('@/views/IntensiveReadingView.vue')
const UniversitiesView = () => import('@/views/UniversitiesView.vue')

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
      path: '/cs408/os',
      name: 'cs-os',
      component: OSLearningView,
      meta: { 
        requiresAuth: true,
        title: '操作系统',
        subject: '操作系统'
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
      component: ReinforcementDashboard,
      meta: { 
        requiresAuth: true,
        title: '数学强化学习'
      }
    },
    {
      path: '/math/detail',
      name: 'math-detail',
      component: MathView,
      meta: { requiresAuth: true }
    },
    // 数学强化阶段路由
    {
      path: '/math/reinforcement',
      name: 'math-reinforcement-dashboard',
      component: ReinforcementDashboard,
      meta: { 
        requiresAuth: true,
        title: '数学强化学习仪表盘'
      }
    },
    {
      path: '/math/reinforcement/topics',
      name: 'math-reinforcement-topics',
      component: TopicReinforcementView,
      meta: { 
        requiresAuth: true,
        title: '知识点强化管理'
      }
    },
    {
      path: '/math/reinforcement/topics/:id',
      name: 'math-reinforcement-topic-detail',
      component: TopicReinforcementView,
      meta: { 
        requiresAuth: true,
        title: '知识点详情'
      }
    },
    {
      path: '/math/reinforcement/special-training',
      name: 'math-reinforcement-special-training',
      component: SpecialTrainingCenter,
      meta: { 
        requiresAuth: true,
        title: '专题突破中心'
      }
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