import { createRouter, createWebHistory } from 'vue-router'
// 使用动态导入实现路由懒加载
const HomeView = () => import('@/views/HomeView.vue')
const TodayStatusView = () => import('@/views/TodayStatusView.vue')
const StudyMethodsView = () => import('@/views/StudyMethodsView.vue')
const CS408View = () => import('@/views/CS408View.vue')
const CSLearningView = () => import('@/views/CSLearning.vue')
const DSLearningView = () => import('@/views/DSLearning.vue')
const NetworkLearningView = () => import('@/views/NetworkLearning.vue')
const OSLearningView = () => import('@/views/OSLearning.vue')
const FeynmanLearning = () => import('@/components/FeynmanLearning.vue')
const WrongProblemsView = () => import('@/views/WrongProblemsView.vue')
const MathView = () => import('@/views/MathView.vue')
// 数学一仪表盘 + 速查卡片页
const ReinforcementDashboard = () => import('@/components/ReinforcementDashboard.vue')
const MathQuickCardsView = () => import('@/views/MathQuickCardsView.vue')
const EnglishView = () => import('@/views/EnglishView.vue')
const PoliticsView = () => import('@/views/PoliticsView.vue')
const DataAnalyticsView = () => import('@/views/DataAnalyticsView.vue')
const IntensiveReadingView = () => import('@/views/IntensiveReadingView.vue')
const UniversitiesView = () => import('@/views/UniversitiesView.vue')
// 翻译模块（合并为单页标签）
const TranslationView = () => import('@/views/TranslationView.vue')
// 技能树（数学题型掌握度可视化）
const SkillTreeView = () => import('@/views/SkillTreeView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'today-status',
      component: TodayStatusView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/study-methods',
      name: 'study-methods',
      component: StudyMethodsView,
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
      path: '/cs408/feynman',
      name: 'cs408-feynman',
      component: FeynmanLearning,
      meta: {
        requiresAuth: true,
        title: '费曼学习法'
      }
    },
    {
      path: '/wrong-problems',
      name: 'wrong-problems',
      component: WrongProblemsView,
      meta: { 
        requiresAuth: true,
        title: '全科错题本'
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
    {
      path: '/math/quickcards',
      name: 'math-quickcards',
      component: MathQuickCardsView,
      meta: { requiresAuth: true, title: '速查卡片' }
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
    },
    // 翻译模块（6个子模块合并为单页标签，通过 ?tab= 定位）
    {
      path: '/translation',
      name: 'translation',
      component: TranslationView,
      meta: { requiresAuth: true, title: '翻译学习模块' }
    },
    // 技能树（数学题型掌握度可视化，数据来自费曼复习题库）
    {
      path: '/skilltree',
      name: 'skilltree',
      component: SkillTreeView,
      meta: { requiresAuth: true, title: '技能树' }
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