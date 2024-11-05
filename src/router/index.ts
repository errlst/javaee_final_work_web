import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'  // 添加重定向
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/',
      name: 'layout',
      component: () => import('../views/LayoutView.vue'),
      children: [
        {
          path: 'goods',
          name: 'goods',
          component: () => import('../views/GoodsView.vue')
        },
        {
          path: 'contract',
          name: 'contract',
          component: () => import('../views/ContractView.vue')
        }
      ]
    }
  ]
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  // 这里可以添加登录验证逻辑
  if (to.path !== '/login') {
    // 检查是否已登录，这里需要根据你的实际登录状态判断
    const isLoggedIn = localStorage.getItem('token') // 或其他登录状态判断
    if (!isLoggedIn) {
      next('/login')
      return
    }
  }
  next()
})

export default router