import { createRouter, createWebHistory } from 'vue-router'
// P5 方案 B：路由表由 vite 构建期别名 `@/router/routes` 决定——
//   默认(个人)模式 → ./routes.personal.ts；`--mode share` → ./routes.share.ts。
// 只装载其一，另一表引用的视图不会被打包，实现单树双版本的构建期代码级裁剪。
import routes from '@/router/routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
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
