import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
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

export default router