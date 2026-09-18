// 共享版（公开知识库）路由子集（P5 方案 B：单树双版本）
// 由 vite 构建期别名 `@/router/routes` 在 `--mode share` 时装载本文件。
// 只引用可公开浏览的视图，个人专属视图（错题本 / 数据分析 / 今日状态 / 翻译 / 精读等）
// 不在此表出现 → 对应 chunk 不会被打包进 share dist（构建期代码级裁剪）。
// 表内容与 frontend-share/src/router/index.ts 保持一致。
import type { RouteRecordRaw } from 'vue-router'

const ShareHomeView = () => import('@/views/ShareHomeView.vue')
const StudyMethodsView = () => import('@/views/StudyMethodsView.vue')
const CS408View = () => import('@/views/CS408View.vue')
const CSLearningView = () => import('@/views/CSLearning.vue')
const DSLearningView = () => import('@/views/DSLearning.vue')
const NetworkLearningView = () => import('@/views/NetworkLearning.vue')
const OSLearningView = () => import('@/views/OSLearning.vue')
const FeynmanLearning = () => import('@/components/FeynmanLearning.vue')
const MathView = () => import('@/views/MathView.vue')
const MathQuickCardsView = () => import('@/views/MathQuickCardsView.vue')
const UniversitiesView = () => import('@/views/UniversitiesView.vue')
const MathTopicGuideView = () => import('@/views/MathTopicGuideView.vue')
const SkillTreeView = () => import('@/views/SkillTreeView.vue')
const PoliticsView = () => import('@/views/PoliticsView.vue')
const EnglishView = () => import('@/views/EnglishView.vue')
const SrsView = () => import('@/views/SrsView.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: ShareHomeView
  },
  {
    path: '/study-methods',
    name: 'study-methods',
    component: StudyMethodsView,
    meta: { title: '学习方法' }
  },
  {
    path: '/cs408',
    name: 'cs408',
    component: CS408View,
    meta: { title: '408计算机' }
  },
  {
    path: '/cs408/composition',
    name: 'cs-composition',
    component: CSLearningView,
    meta: {
      title: '计算机组成原理',
      subject: '计算机组成原理'
    }
  },
  {
    path: '/cs408/datastructure',
    name: 'cs-datastructure',
    component: DSLearningView,
    meta: {
      title: '数据结构',
      subject: '数据结构'
    }
  },
  {
    path: '/cs408/network',
    name: 'cs-network',
    component: NetworkLearningView,
    meta: {
      title: '计算机网络',
      subject: '计算机网络'
    }
  },
  {
    path: '/cs408/os',
    name: 'cs-os',
    component: OSLearningView,
    meta: {
      title: '操作系统',
      subject: '操作系统'
    }
  },
  {
    path: '/cs408/feynman',
    name: 'cs408-feynman',
    component: FeynmanLearning,
    meta: {
      title: '费曼学习法'
    }
  },
  {
    path: '/math',
    name: 'math',
    component: MathView,
    meta: { title: '数学一知识体系' }
  },
  {
    path: '/math/detail',
    name: 'math-detail',
    component: MathView,
    meta: { title: '数学一知识体系' }
  },
  {
    path: '/math/quickcards',
    name: 'math-quickcards',
    component: MathQuickCardsView,
    meta: { title: '速查卡片' }
  },
  {
    path: '/math/guide',
    name: 'math-guide',
    component: MathTopicGuideView,
    meta: { title: '专题指南' }
  },
  {
    path: '/universities',
    name: 'universities',
    component: UniversitiesView,
    meta: { title: '院校查询' }
  },
  {
    path: '/politics',
    name: 'politics',
    component: PoliticsView,
    meta: { title: '政治框架' }
  },
  {
    path: '/english',
    name: 'english',
    component: EnglishView,
    meta: { title: '英语真题精读' }
  },
  {
    path: '/skilltree',
    name: 'skilltree',
    component: SkillTreeView,
    meta: { title: '技能树' }
  },
  {
    path: '/srs',
    name: 'srs',
    component: SrsView,
    meta: { title: '记忆卡' }
  },
  // 兼容旧链接：未匹配路由重定向到首页
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

export default routes
